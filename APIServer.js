let request = require('request')
let cheerio = require('cheerio')
let express = require('express')
let app = express()

let jerkyExplorer = function (plateNumber, vin, category, callBack) {
  let timeout = 2000
  let cookies = request.jar()
  let sessionCookie = ''
  let page1 = 'https://www.fsm.gov.mo/webticket/tq_c.aspx' // 汽機車目錄
  let page2 = 'https://www.fsm.gov.mo/webticket/Webform1.aspx?carClass=' + category + '&Lang=C' // 車牌輸入
  let page3 = 'https://www.fsm.gov.mo/webticket/Webform2.aspx' // 有違例
  let page4 = 'https://www.fsm.gov.mo/webticket/Webform3.aspx' // VIN輸入
  let page5 = 'https://www.fsm.gov.mo' // + next, 結果
  let next = ''
  let result = {
    plateNumber: plateNumber,
    vin: vin,
    category: category,
    crawlerStatus: true,
    msg: '',
    guilty: null,
    jerkys: []
  }
  let reqCall = function (options, succ) {
    request.cookie(sessionCookie)
    request(options, function (error, response, body) {
      if (error) {
        console.log(error)
        result.crawlerStatus = false
        result.msg = '訪問超時'
        callBack(result)
        return
      }
      if (response.statusCode === 200 || response.statusCode === 302) {
        if (response.statusCode === 302) {
          next = response.headers.location
        }
        let responseBody = cheerio.load(body)
        if (succ != null) {
          succ(responseBody, response.statusCode)
        }
      }
    })
  }
  let step0 = function () {
    let options = {
      url: page1,
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Origin': 'https://www.fsm.gov.mo',
        'Referer': 'https://www.fsm.gov.mo/webticket/menu_c.aspx'
      },
      jar: cookies,
      timeout: timeout
    }
    reqCall(options, step1)
  }
  let step1 = function () {
    let options = {
      url: page2,
      method: 'GET',
      headers: {
        'Referer': page1
      },
      jar: cookies,
      timeout: timeout
    }
    reqCall(options, step2)
  }
  let step2 = function (responseBody, statusCode) {
    sessionCookie = cookies.getCookieString(page2)
    let VIEWSTATE = responseBody('input#__VIEWSTATE').val()
    let EVENTVALIDATION = responseBody('input#__EVENTVALIDATION').val()

    let form = {
      '__VIEWSTATE': VIEWSTATE,
      '__EVENTVALIDATION': EVENTVALIDATION,
      'resW': '1680',
      'resH': '1050',
      'Calculator': plateNumber,
      'btnOk': '確  定',
      'Textbox1': ''
    }
    let options = {
      url: page2,
      method: 'POST',
      headers: {
        'Referer': page2
      },
      jar: cookies,
      form: form,
      timeout: timeout
    }
    reqCall(options, step3)
  }
  let step3 = function (responseBody, statusCode) {
    if (statusCode === 200) {
      result.crawlerStatus = false
      result.msg = '輸入的車牌編號沒有登記'
      callBack(result)
    } else {
      let options = {
        url: page3,
        method: 'GET',
        headers: {
          'Referer': page2
        },
        jar: cookies
      }
      reqCall(options, step4)
    }
  }
  let step4 = function (responseBody, statusCode) {
    let VIEWSTATE = responseBody('input#__VIEWSTATE').val()
    let EVENTVALIDATION = responseBody('input#__EVENTVALIDATION').val()
    let form = {
      '__VIEWSTATE': VIEWSTATE,
      '__EVENTVALIDATION': EVENTVALIDATION,
      'btDetail': '違例詳情'
    }
    let options = {
      url: page3,
      method: 'POST',
      headers: {
        'Referer': page3
      },
      jar: cookies,
      form: form
    }
    reqCall(options, step5)
  }
  let step5 = function (responseBody, statusCode) {
    let options = {
      url: page4,
      method: 'GET',
      headers: {
        'Referer': page3
      },
      jar: cookies
    }
    reqCall(options, step6)
  }
  let step6 = function (responseBody, statusCode) {
    let VIEWSTATE = responseBody('input#__VIEWSTATE').val()
    let EVENTVALIDATION = responseBody('input#__EVENTVALIDATION').val()
    let form = {
      '__VIEWSTATE': VIEWSTATE,
      '__EVENTVALIDATION': EVENTVALIDATION,
      'Calculator': vin,
      'btQuery': '確 定',
      'Textbox1': ''
    }
    let options = {
      url: page4,
      method: 'POST',
      headers: {
        'Referer': page4
      },
      jar: cookies,
      form: form
    }
    reqCall(options, step7)
  }
  let step7 = function (responseBody, statusCode) {
    if (statusCode === 200) {
      result.crawlerStatus = false
      result.msg = '輸入的車身編號 ' + vin + ' 不正確'
      callBack(result)
    } else {
      page5 += next
      let options = {
        url: page5,
        method: 'GET',
        headers: {
          'Referer': page4
        },
        jar: cookies
      }
      reqCall(options, step8)
    }
  }
  let step8 = function (responseBody, statusCode) {
    let jerkyCrawler = function ($, key) {
      let temp = $(key)
      if (temp.length > 0) {
        let tr = temp.find('tr')
        for (let i = 2; i < tr.length; i++) {
          let td = $(tr[i]).find('td')
          let detail = $(td[2]).html().split('<br>')

          $(td[2]).html(detail[0])
          let penaltyClause = $(td[2]).text()
          $(td[2]).html(detail[1])
          let penaltyClauseDetail = $(td[2]).text()
          $(td[2]).html(detail[2])
          let place = $(td[2]).text().replace('地點: ', '')

          let jerky = {
            'datetime': $(td[1]).text().substring(0, 16),
            'accusation_no': $(td[1]).text().substring(16, 100),
            'penalty_clause': penaltyClause,
            'penalty_clause_detail': penaltyClauseDetail,
            'place': place,
            'fine': $(td[3]).text().substring(1, 100),
            'type': key.split('#')[key.split('#').length - 1]
          }
          result.jerkys.push(jerky)
        }
      }
    }
    if (responseBody('#lbMsgText').length > 0) {
      result.crawlerStatus = false
      result.msg = responseBody('#lbMsgText').text()
    } else {
      let key1 = 'table#taResultDriving' // 行政違法
      let key2 = 'table#taResultParking' // 輕微違反
      jerkyCrawler(responseBody, key1)
      jerkyCrawler(responseBody, key2)
      if (result.jerkys.length === 0) {
        result.guilty = false
        result.msg = '沒有違例紀錄'
      } else {
        result.guilty = true
        result.msg = '有違例紀錄'
      }
    }
    callBack(result)
  }
  step0()
}

let jerkyExplorerApi = function (req, resp) {
  let query = req.query
  if ('plate_number' in query && 'vin' in query && 'category' in query) {
    let plateNumber = query['plate_number']
    let vin = query['vin']
    let category = query['category']
    jerkyExplorer(plateNumber, vin, category, function (data) {
      let response = JSON.stringify({
        status: 'success',
        result: data
      })
      resp.setHeader('Content-Type', 'application/json');
      resp.send(response)
    })
  } else {
    let response = JSON.stringify({
      status: 'wrong request format.',
      result: null
    })
    resp.setHeader('Content-Type', 'application/json');
    resp.send(response)
  }
}

app.get('/api/jerkySearch', jerkyExplorerApi)

let server = app.listen(9002, 'localhost', function () {
   let host = server.address().address
   let port = server.address().port
   console.log("iJeryAPI Server listening at %s:%s", host, port)
})

// function httpRequest(url, callback){
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-Type", "application/json");
//     xhr.onreadystatechange = function() {
//         if (xhr.readyState == 4) {
//             callback(xhr.responseText);
//         }
//     }
//     let myData = {
//       email:'admin@myvlog.xyz',
//       password:'Cbd199108'
//     }
//     xhr.send(JSON.stringify(myData));
// }
//
// httpRequest('https://api-t.myvlog.xyz/v1/users/signin', function(res){
//     document.getElementById('ip_div').innerText = JSON.stringify(JSON.parse(res).data);
//     localStorage.qafAuth = JSON.stringify(JSON.parse(res).data)
// });

let rootUrl = "https://api.qaf.io/v1"

function httpRequest(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      callback(xhr.responseText);
    }
  }
  xhr.send();
}


function getCategory () {
  let url = `${rootUrl}/categories/all`
  httpRequest(url, function(result){
    let allData = JSON.parse(result).data
    let newData = _.chain(allData).map((obj) => {
      return `<option value='${obj._id}'>${obj.name}</option>`
    }).value()
    $("#categoryId").append(newData)
  });
}

function checkSign () {
  if (localStorage && localStorage.qafAuth) {
    //  登录了
    $('.control').addClass('hide')
    $('.control').removeClass('show')
    $('#form-post').removeClass('hide')
    $('#form-post').addClass('show')
    getCategory()
   } else {
    //  没登录
    $('.control').addClass('hide')
    $('.control').removeClass('show')
    $('#form-signin').removeClass('hide')
    $('#form-signin').addClass('show')
  }
}
// 登录
$("#submit-btn").on('click', function () {
  $.post({
    url: `${rootUrl}/users/signin`,
    method: 'post',
    data: $("#form-signin").serialize(),
    success: function (res) {
      if (res.code === 0) {
        localStorage.qafAuth = JSON.stringify(res.data)
        $("#ip_div").html('登录成功')
        checkSign()
      } else {
        $("#ip_div").html(res.msg)
      }
    },
    error: function (err) {
      $("#ip_div").html(JSON.stringify(err))
    }
  })
})
// localStorage.removeItem('qafAuth')
// 创建
$("#creat-post-btn").on('click', function () {
  let form = {
    "access_token": JSON.parse(localStorage.qafAuth).access_token,
    "data": {
      name: $("#name").val(),
      description: $('#description').val(),
      sourceUrl: $('#sourceUrl').val(),
      videoUrl: $('#videoUrl').val(),
      imgUrl: $('#imgUrl').val(),
      duration: $('#duration').val(),
      tags: $('#tags').val().split(','),
      categoryId: $('#categoryId').val()
    }
  }
  $.post({
    url: `${rootUrl}/videos/create`,
    method: 'post',
    data: JSON.stringify(form),
    processData: false,
    contentType: "application/json; charset=UTF-8",
    success: function (res) {
      if (res.code === 0) {
        $("#ip_div").html('创建成功')
      } else {
        $("#ip_div").html(res.msg)
        // 移除登录
        localStorage.removeItem('qafAuth')
      }
    },
    error: function (err) {
      $("#ip_div").html(JSON.stringify(err))
    }
  })
})

chrome.tabs.getSelected(null, function (tab) {//获取当前tab
    //向tab发送请求
    chrome.tabs.sendRequest(tab.id, { action: "GetInfo" }, function (response) {
      // $("#ip_div").html(JSON.stringify(response))
      if (response) {
        for (let i in response) {
          $("#"+i).val(response[i])
        }
        // 检查是否登录
        checkSign ()
      } else {
        $('.control').addClass('hide')
        $("#ip_div").html('当前插件仅支持哔哩哔哩视频详情页')
        // $('#wrong').removeClass('hide')
        // $('#wrong').addClass('show')
      }
    });
});

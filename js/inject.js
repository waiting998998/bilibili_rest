window.onload = () => {
  let arr = []
  $('.tag').each(function (){
    arr.push($(this).text())
  })
  let duration = $('meta[itemprop="duration"]')[0].content
  duration = duration.replace('T','')
  duration = duration.replace('M',':')
  duration = duration.replace('S','')
  duration = duration.replace(' ','')

  let obj = {
    name: $('meta[itemprop="name"]')[0].content,
    description: $("#v_desc").html(),
    duration: duration,
    imgUrl: $('meta[itemprop="thumbnailUrl"]')[0].content,
    videoUrl: $('#link2').val(),
    sourceUrl: window.location.href,
    categoryId: 'dscdsewr3223',
    tags: arr
  }
  chrome.extension.onRequest.addListener(//监听扩展程序进程或内容脚本发送请求的请求
    function (request, sender, sendResponse) {
      if (request.action == "GetInfo") {
        if (/bilibili.com\/video/.test(window.location.href)) {
          sendResponse(obj);
        } else {
          sendResponse(false)
        }
      }
    }
  );
}

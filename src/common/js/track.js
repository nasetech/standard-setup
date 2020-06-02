function track(action, label, page){
  let category = page? page : '操作';
  let nodeid = 'btn';
  _czc.push(["_trackEvent", category, action, label, '', nodeid]);
}

export default track;
/**
 * @author kai
 * @email chanthinker@foxmail.com
 */
;((win,doc)=>{
  doc.getElementById('Jdoc').addEventListener('touchmove', (e)=>{
    e.preventDefault()
  },false)

  let dev = false || window.location.href.indexOf('?dev')>-1;
  let useLong = false; // 用矩形比较长的边长作为判断标
  let fillUserDrawing = false; // 默认不在视觉上填充用户的绘制


  let clientH = win.innerHeight;
  let clientW = win.innerWidth;

  win.hasPlay = false;
  let isMobile = false;

  let lineColor = '#fdf0b0', lineWidth = 2;

  try {
    isMobile = document.createEvent('touchEvent')
  } catch(e) {
    console.log(e)
  }

  let start, end, move ;

  if (!isMobile) {
    start = 'mousedown'
    end = 'mouseup'
    move = 'mousemove'
  }else{
    start = 'touchstart'
    end = 'touchend'
    move = 'touchmove'
  }

  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = clientW
  canvas.height = clientH

  // to record user's drawing
  const cacheCan = document.createElement('canvas')
  cacheCan.width = canvas.width
  cacheCan.height = canvas.height

  const cacheCtx = cacheCan.getContext('2d')
  cacheCtx.strokeStyle = lineColor
  cacheCtx.lineWidth = lineWidth

  // 用来填充用户的绘制
  const fillCan = document.createElement('canvas')
  fillCan.width = canvas.width
  fillCan.height = canvas.height
  const fillCtx = fillCan.getContext('2d')

  let startState = {
    val : -1,
    isStart: false
  };

  let boundaryLeft = startState.val
  let boundaryTop = startState.val
  let boundaryRight = startState.val
  let boundaryBottom = startState.val
  let startDraw = startState.isStart

  let board = document.createElement('canvas')
  let circle = document.createElement('canvas')

  const reStart = ()=>{
    win.hasPlay = false
    boundaryLeft = startState.val
    boundaryTop = startState.val
    boundaryRight = startState.val
    boundaryBottom = startState.val
    startDraw = startState.isStart

    let rect = printVal()
    ctx.clearRect(0,0,canvas.width,canvas.height)
    cacheCtx.clearRect(0,0,canvas.width,canvas.height)
    fillCtx.clearRect(0,0,canvas.width,canvas.height)

    board.getContext('2d').clearRect(0,0,rect.width,rect.height)
    circle.getContext('2d').clearRect(0,0,rect.d,rect.d)

    if (dev) {
      clreaRect()
      clearImg()
    }
  }

  const updateBoundary = (evt) => {
    let x,y;
    if (!isMobile) {
      x = evt.pageX
      y = evt.pageY
    }else{
      let type = evt.type;
      if (type != end) { // `touchend` can't fecth ponits,but `mouseUp` will
        x = evt.touches[0].pageX
        y = evt.touches[0].pageY
      }
    }
    // console.log(x)

    if (x < boundaryLeft || boundaryLeft < 0) {
      boundaryLeft = x
    }
    if (y < boundaryTop || boundaryTop < 0) {
      boundaryTop = y
    }
    if (x > boundaryRight || boundaryRight < 0) {
      boundaryRight = x
    }
    if (y > boundaryBottom || boundaryBottom < 0) {
      boundaryBottom = y
    }

    if(x < 0){
      boundaryLeft = 0
    }

    if (x>canvas.width) {
      boundaryRight = canvas.width
    }

    if (y < 0) {
      boundaryTop = 0
    }

    if(y > canvas.height){
      boundaryBottom = canvas.height
    }
  }

  const printVal = ()=>{
    let rectWidth = boundaryRight-boundaryLeft,
      rectHeight = boundaryBottom-boundaryTop,
      d;

    let bool = !useLong ? (rectWidth > rectHeight) : (rectWidth < rectHeight)
    if (bool) {
      d = rectHeight
    }else{
      d = rectWidth
    }

    let obj = {
      left: (boundaryLeft),
      top: (boundaryTop),
      right: (boundaryRight),
      bottom: (boundaryBottom),
      width: (rectWidth),
      height: (rectHeight),
      d: (d)
    }

    return obj;
  }

  const drawLine = (evt,cb)=>{
    const {type} = evt

    let x, y;
    if (type == start) {

      cacheCtx.beginPath();
      cacheCtx.lineCap = 'round'
      cacheCtx.lineJoin = 'round'

      if(isMobile){
        x = evt.touches[0].clientX
        y = evt.touches[0].clientY
      }else{
        x = evt.clientX
        y = evt.clientY
      }

      if(x < 0){
        x = 0
      }

      if (x>canvas.width) {
        x = canvas.width
      }

      if (y < 0) {
        y = 0
      }

      if(y > canvas.height){
        y = canvas.height
      }

      cacheCtx.moveTo(x,y)
    }

    if (type == move){
      if (isMobile) {
        cacheCtx.lineTo(evt.touches[0].clientX, evt.touches[0].clientY)
      }else{
        cacheCtx.lineTo(evt.clientX, evt.clientY)
      }
      cacheCtx.stroke()
    }

    if (type == end){
      cacheCtx.closePath()
      // 先记录用户画的内容, 再填充

      cacheCtx.fill();
      if (!fillUserDrawing) {
        fillCtx.drawImage(cacheCan,0,0)
        return;
      }
    }

    cb && cb()
  }

  const drawRect = (evt)=>{
    if (evt.type == end) {
      let rect = printVal()
      let _width,_height;
      if (useLong) {
        _height = _width = rect.d
      }else{
        _width = rect.width
        _height = rect.height
      }
      if (doc.getElementById('Jtest') && doc.getElementById('Jcover')) {
        Jtest.style.cssText = `left:${rect.left}px;top:${rect.top}px;width:${_width}px;height:${_height}px;`
        Jcover.style.cssText = `width:${rect.d}px;height:${rect.d}px;`
      }
    }
  }

  const clreaRect = ()=>{
    if (doc.getElementById('Jtest') && doc.getElementById('Jcover')) {
      Jtest.style.cssText = `left:0;top:0px;width:0px;height:0px;`
      Jcover.style.cssText = `width:0px;height:0px;`
    }
  }

  const draw = (evt)=>{
    drawLine(evt,()=>{
      ctx.drawImage(cacheCan, 0, 0) // 即时渲染
    })

    if(dev){
      drawRect(evt)
    }
  }

  const calcPoints = (ctx,canWidth,canHeight)=>{
    let imgData=ctx.getImageData(0,0,canWidth,canHeight);
    let aArr = [];
    let _data = imgData.data, _len = _data.length;

    for (let i=0;i<_len;i+=4){
      let singlePixel = [
        _data[i],
        _data[i+1],
        _data[i+2],
        _data[i+3]
      ]

      let _set = new Set(singlePixel)
      let _arr = Array.from(_set)

      if (_arr.length != 1) {
        aArr.push(singlePixel)
      }
    }

    return aArr.length
  }

  const calcShape = (obj)=>{
    let {can,srcCan} = obj

    let rect = printVal()
    let rectWidth = rect.width
    let rectHeight = rect.height

    can.width = rectWidth
    can.height = rectHeight

    let ctx = can.getContext('2d')
    ctx.drawImage(srcCan, rect.left, rect.top,rectWidth,rectHeight,0,0,rectWidth,rectHeight);

    return calcPoints(ctx,rectWidth,rectHeight)
  }

  const calcShapeInCircle = (obj)=>{
    let {can,srcCan} = obj

    let rect = printVal()
    let rectWidth = rect.width
    let rectHeight = rect.height
    let diameter = rect.d
    let r = (diameter/2)-0.5  // 可以增加1px的安全边距

    can.width = diameter
    can.height = diameter

    let circleCtx = can.getContext('2d');

    circleCtx.beginPath();
    circleCtx.arc(r,r,r,0,2*Math.PI);
    // circleCtx.fill()
    circleCtx.clip();
    circleCtx.closePath();

    if (!useLong) {
      if (rectWidth > rectHeight) {
        circleCtx.drawImage(srcCan,(rectWidth/2-r),0,diameter,diameter,0,0,diameter,diameter)
      }else{
        circleCtx.drawImage(srcCan,0,(rectHeight/2-r),diameter,diameter,0,0,diameter,diameter)
      }
    }else{
      if (rectWidth > rectHeight) {
        circleCtx.drawImage(srcCan,0,0,diameter,diameter,0,r-(rectHeight/2),diameter,diameter)
      }else{
        circleCtx.drawImage(srcCan,0,0,diameter,diameter,r-(rectWidth/2),0,diameter,diameter)
      }
    }

    return calcPoints(circleCtx,diameter,diameter)
  }

  const insertImg2Html = (img,can)=>{
    let src = can.toDataURL('image/png',0.6)
    img.src = src
  }

  const clearImg = ()=>{
    doc.getElementById('Jimg') && Jimg.removeAttribute('src')
    doc.getElementById('Jimg2') && Jimg2.removeAttribute('src')
  }

  const getS = ()=>{
    let rect = printVal()
    let diameter = rect.d
    let RADIUS = diameter/2

    let sCicle = parseInt(Math.PI*RADIUS*RADIUS)
    let sRect = useLong?  parseInt(diameter*diameter) : parseInt(rect.width*rect.height)
    let sClip = sRect - sCicle

    return {
      sRect,
      // sSquare,
      sCicle,
      sClip
    }
  }

  const calc = ()=>{
    let rect = printVal()
    if (rect.d<50) {
      return false;
    }

    let sShape = calcShape({
      can:board,
      srcCan: fillUserDrawing? canvas : fillCan
    })

    let sShapeInner = calcShapeInCircle({
      can:circle,
      srcCan: board
    });

    if (dev) {
      doc.getElementById('Jimg') && insertImg2Html(Jimg,board)
      doc.getElementById('Jimg2') && insertImg2Html(Jimg2,circle)
    }



    let res = getS()
    let sRect = res.sRect
    let sCicle = res.sCicle
    let sClip = res.sClip

    return {
      sShape,
      sShapeInner,
      sRect,
      sCicle,
      sClip,
    }
  }

  const gameStart = (cb)=>{
    // start/down
    canvas.addEventListener(start, (evt) => {
      if (win.hasPlay) {
        return
      }
      evt.preventDefault()
      startDraw = true
      updateBoundary(evt)
      draw(evt)
    })

    // move
    canvas.addEventListener(move, (evt) => {
      if (win.hasPlay) {
        return
      }
      evt.preventDefault()
      if (!startDraw){
        return
      }
      updateBoundary(evt)
      draw(evt)
    })

    // end/up
    canvas.addEventListener(end, (evt) => {
      if (win.hasPlay) {
        return
      }
      evt.preventDefault()
      startDraw = false
      updateBoundary(evt)
      draw(evt)
      win.hasPlay = true

      cb && cb()
    })
  }


  win.reStart = reStart;
  win.calc = calc;
  win.gameStart = gameStart
})(window,document);
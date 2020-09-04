;(()=>{
  const doc = document
  let util = {
    showTips:(str,bool)=>{
      let tips = doc.getElementById('JpopTips')
      tips.innerHTML = str
      tips.classList.remove('icon')
      tips.style.display = 'block';
      if (!bool) {
        let t = setTimeout(()=>{
          clearTimeout(t)
          t = null
          tips.style.display = 'none';
        }, 1500)
      }else{
        tips.classList.add('icon')
      }
    },
    hideTips:()=>{
      let tips = doc.getElementById('JpopTips')
      tips.style.display = 'none'
    },
    showPop:(id)=>{
      let ele = doc.getElementById(id);

      Jpop.style.display = 'block'
      ele && (ele.style.display = 'block')
    },
    hidePop:(id)=>{
      let  ele = doc.getElementById(id);

      Jpop.style.display = 'none';
      ele && (ele.style.display = 'none')
    },
    randomNum(s,b){
      let base = s||50, max = b ||100, distance = max-base;
      return base + Math.floor(Math.random()*distance)
    }
  }


  let analyzing = false;

  const gameFinished = ()=>{
    if (!window.hasPlay) {
      util.showPop('JstartTips')
      return
    }

    analyzing = true;
    util.showTips('分析中',true)

    let t = setTimeout(()=>{
      clearTimeout(t)
      t = null;

      let res = window.calc();
      analyzing = false;
      util.hideTips();

      if (!res) {
        util.showTips('要不您再试试?')
        window.reStart()
        return
      }

      let {sRect , sShape ,sCicle ,sShapeInner,sClip} = res

      let radio1 = +((sShapeInner/sCicle).toFixed(2))
      let radio2 = +(((sShape-sShapeInner)/sClip).toFixed(2))

      console.log(radio1,radio2)

      if ((radio1 >0.9 ) && (radio2 <=0.4)) {
        let score = radio1*100-radio2*100
        Jscore.innerHTML = score
        // Jpercent.innerHTML = util.randomNum(score-10,score)
        util.showPop('Jwin')
      }else{
        util.showPop('Jrestart')
      }
    },300)
  }

  Jmask.addEventListener('click', (e)=>{
    e.preventDefault()
    Jmask.style.display = 'none'
    Jsvg.classList.add('on')
    let t = setTimeout(()=>{
      clearTimeout(t)
      t = null;
      util.showTips('请开始画圆')
      gameStart(()=>{
        gameFinished()
      })
    },2000)
  },false)

  Jpop.addEventListener('click', (e)=>{
    let id = e.target.id
    switch (id) {
      case 'JcloseStartTips':
        util.hidePop('JstartTips')
        break;
      case 'JclosePopRule':
        util.hidePop('JpopRule')
        break;
      case 'JcloseRestart':
        util.hidePop('Jrestart')
        window.reStart()
        break;
      case 'JcloseWin':
        util.hidePop('Jwin')
        window.reStart()
        break;
      default:
        break;
    }
  },false)
})()
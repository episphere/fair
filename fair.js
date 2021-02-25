console.log('fair.js loaded')

fair={date:Date(),parms:{},checklist:[]}

fair.getparms=q=>{
    location.search.slice(1).split('&').forEach(aa=>{
        aa = aa.split('=')
        fair.parms[aa[0]]=decodeURIComponent(aa[1])
    })
    return fair.parms
}

fair.getparms()

fair.ui=async(
        el=document.getElementById('FAIRreport'),
        url=fair.parms.url
    )=>{
    console.log(`FAIR report for ${url}`) // https://data.cdc.gov/resource/muzy-jte6.json
    let h= '<hr><div style="background-color:silver;width:100%">'
    h += `URL: <input size="50" id="urlInput"> <button id="startFAIR">Start</button>`
    h += '</div><hr>'
    //h += `<h3>Dereferenceability</h3>`
    h += '<div style="width:100%"><ol id="FAIRchecklist" style="width:100%"></ol></div>'
    el.innerHTML=h
    urlInput.value=fair.parms.url||""
    if(urlInput.value.length>1){
        fair.parms.url=urlInput.value
        fair.deref(url=fair.parms.url,cont=true)
    }
    startFAIR.onclick=()=>{
        FAIRchecklist.innerHTML=''
        fair.parms.url=urlInput.value
        fair.deref(url=fair.parms.url,cont=true)
    }

    return el
}

fair.deref = async(url=fair.parms.url,cont)=>{
    fetch(url)
      .catch((error)=>{
          let li = document.createElement('li')
          FAIRchecklist.appendChild(li)
          li.innerHTML=`${error}`
          li.style.color="darkred"
          trafficLight.src="red.png"
      })
      .then(r1 => {
        r1.json()
            .catch((error)=>{
                let li = document.createElement('li')
                FAIRchecklist.appendChild(li)
                li.innerHTML=`${error}`
                li.style.color="orange"
                setTimeout((_=>{trafficLight.src="yellow.png"}),1000)
            })
            .then(data => {
                let li = document.createElement('li')
                FAIRchecklist.appendChild(li)
                li.innerHTML=`<p>type: ${r1.type}</p>`
                li.style.color="darkgreen"
                trafficLight.src="green.png"
                let ta = document.createElement('textArea')
                li.appendChild(ta)
                ta.style.backgroundColor='black'
                ta.style.color='lime'
                ta.value=JSON.stringify(data,null,3)
                ta.style.width="60em"
                ta.style.height="30em"
            })
      })//.catch(err=>console.log('error:',err));
    
    /*
    try {
        let res = await (await fetch(url))
        let h = `type: ${res.type}`
        li.innerHTML=h
        li.style.color="darkgreen"
        console.log(JSON.stringify(res,null,3))
    }
    catch(err){

    }
    */
    //return li
}


if(document.getElementById('FAIRreport')){
    //if
    fair.ui()
}

if(typeof(define)!='undefined'){
    define(fair)
}
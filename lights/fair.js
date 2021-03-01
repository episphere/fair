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
    h += `URL: <input size="54" id="urlInput" style="color:navy"> <button id="startFAIR">Start</button> <button id="openURL">Open</button>`
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
        location.search=`url=${encodeURIComponent(urlInput.value)}`
        //FAIRchecklist.innerHTML=''
        //fair.parms.url=urlInput.value
        //fair.deref(url=fair.parms.url,cont=true)
    }
    openURL.onclick=_=>{
        window.open(urlInput.value)
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
                ta.style.fontSize='small'
                ta.style.color='lime'
                ta.value=JSON.stringify(data,null,3)
                ta.style.width="50em"
                ta.style.height="30em"
                // if a connect concept id
                let matchConnect=urlInput.value.match(/^https\:\/\/episphere\.github\.io\/conceptGithubActions\/jsons\/([0-9]+)\.json/)
                if(matchConnect){
                    let liConnect = document.createElement('li')
                    FAIRchecklist.appendChild(liConnect)
                    liConnect.innerHTML=`Connect <a href="https://episphere.github.io/conceptGithubActions/web/#${matchConnect[1]}" target="_blank">conceptID#${matchConnect[1]}</a>.`
                    liConnect.style.color="darkgreen"

                }

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
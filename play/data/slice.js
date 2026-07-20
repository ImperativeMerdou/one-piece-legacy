/* VERTICAL SLICE — smoke-test scene (replaced by the full Pit/Kettle slice in 4E/4F) */
"use strict";
window.SLICE={start:"test",scenes:{
"test":{id:"test",title:"Stage Test",goto:null,beats:[
 {t:"card",text:"NORTH BLUE — COIN TOSS ISLAND · STAGE TEST"},
 {t:"shot",bg:"bg.cointoss.pit.wide.night",cam:[960,540,1],cine:true,
  actors:[{id:"merdou",role:"char.merdou",mood:"grin",x:640,h:1010},
          {id:"ashren",role:"char.ashren",mood:"smug",x:1330,h:930}]},
 {t:"say",who:"merdou",mood:"shout",text:"**STAGE TEST!** Full viewport! SIXTEEN BY NINE!"},
 {t:"shot",cam:[640,430,1.7]},
 {t:"say",who:"merdou",mood:"laugh",text:"**UHUHUHU!!** Close-up! LOOK AT THIS BEARD!"},
 {t:"shot",cam:[960,540,1],cine:false},
 {t:"say",who:"ashren",mood:"talk",text:"Choice test next. Try hovering."},
 {t:"choice",id:"T1",prompt:"The stage holds its breath.",options:[
  {id:1,label:"Shot system works.",risk:"Immediate consequence: continue.",hl:"merdou",mood:"grin",
   effects:{purse:1000,known:[{icon:"berry",who:"PURSE",text:"+1,000 test berries."}]},goto:null},
  {id:2,label:"Shake the stage.",risk:"It shakes.",hl:"ashren",
   effects:{known:[{icon:"crowd",who:"STAGE",text:"Shaken, not broken."}]},goto:null},
  {id:3,label:"End test.",risk:"Ends the test.",effects:{},goto:null}
 ]},
 {t:"panel"},
 {t:"fx",kind:"shake-hard",sfx:"DON!!"},
 {t:"cap",text:"End of stage test."}
]}}};

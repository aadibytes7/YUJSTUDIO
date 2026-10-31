const fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const source=fs.readFileSync(__dirname+'/../app.js','utf8');
const elements=new Map();
function node(id){if(!elements.has(id))elements.set(id,{id,style:{},dataset:{},value:'',innerHTML:'',textContent:'',attributes:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},focus(){},blur(){},addEventListener(){},setAttribute(){},removeAttribute(){},querySelectorAll(){return []},querySelector(){return null}});return elements.get(id)}
const context={console,Date,Intl,crypto,URL,URLSearchParams,TextDecoder,TextEncoder,Promise,Map,Set,Array,Number,JSON,String,Object,RegExp,Math,Error,Boolean,
  document:{title:'',getElementById:node,addEventListener(){},querySelectorAll(){return []},createElement(){return node('element-'+Math.random())}},
  window:{scrollTo(){},prompt(){return null}},
  location:{protocol:'file:'},
  localStorage:{getItem(){return null},setItem(){},removeItem(){}},
  setTimeout(fn){},clearTimeout(){},
  confirm(){return true},fetch:async()=>{throw Error('Should not call remote APIs in demo')}
};context.globalThis=context;
vm.createContext(context);
vm.runInContext(source+'\nglobalThis.__probe={state,render,renderOverview,renderCampaigns,renderPlanner,renderCreative,renderReviews,renderCalendar,renderAnalytics,renderOperations,renderSettings};',context,{timeout:5000});
setTimeout(()=>{
  const x=context.__probe;
  if(x.state.campaigns.length!==3)throw Error('Demo bootstrap failed');
  for(const key of ['overview','campaigns','planner','creative','reviews','calendar','analytics','operations','settings']){
    x.state.page=key; x.render(); const html=node('appView').innerHTML;
    if(!html.includes('page-heading')||html.length<600)throw Error('Empty '+key);
    console.log(key,html.length,'characters');
  }
  console.log('PASS: all 9 page renderers boot in offline demo mode');
},500);

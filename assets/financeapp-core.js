var FinanceAppBundle=function(ea){"use strict";function O(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function N(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function V(){return O(new Date)}function oa(t,e){return new Date(t,e+1,0).getDate()}function Da(t,e,a){return O(new Date(t,e,Math.min(a,oa(t,e))))}function Kt(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return O(new Date(t,e+1,0));const s=parseInt(o);if(!isNaN(s))return Da(t,e,s)}if(a.startsWith("nthweekday:")){const o=a.split(":"),s=parseInt(o[1]),n=parseInt(o[2]);if(s===-1){const p=new Date(t,e+1,0);for(;p.getDay()!==n;)p.setDate(p.getDate()-1);return O(p)}const i=new Date(t,e,1);for(;i.getDay()!==n;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(s-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),O(i)}return null}function Ra(t,e){if(!e)return t;const a=N(t);return Kt(a.getFullYear(),a.getMonth(),e)??t}const to=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],ao={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function sa(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${ao[a]||a+"º"} ${to[o]} del mes`}return t}function It(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function ot(t){return t/100}function st(t){return ot(It(t))}function z(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function Na(t){return(t||0).toFixed(2)+"%"}function zt(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function qa(t,e,a,o=0){const s=zt(t,e,a),n=t*(1-o/100);let i=e/100/12;for(let p=0;p<200;p++){const l=s*(1-Math.pow(1+i,-a))/i-n,x=s*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),v=i-l/x;if(Math.abs(v-i)<1e-10){i=v;break}i=v}return(Math.pow(1+i,12)-1)*100}function La(t,e,a,o,s=0,n=[],i={}){const p=[];let u=t;const l=N(o),x=e/100/12;let v=a,r=zt(u,e,v);const b=[...n].sort(($,I)=>$.fecha.localeCompare(I.fecha));let g=0;for(let $=1;$<=a*2&&u>.01;$++){const I=new Date(l);l.setMonth(l.getMonth()+1);const m=Ra(O(I),i.diaPago||"");for(;g<b.length&&b[g].fecha<=m;){const A=b[g],h=A.cantidad*(s/100);if(u-=A.cantidad,u=Math.max(0,u),A.tipo==="plazo"?v=Math.ceil(-Math.log(1-u*x/r)/Math.log(1+x)):(v=a-$+1,r=zt(u,e,v)),p.push({mes:"AMORT",fecha:A.fecha,cuota:0,interes:0,amortizacion:A.cantidad,comisionAmort:h,capitalPendiente:u,esAmortizacion:!0,simulacion:A.simulacion||!1}),g++,u<.01)break}if(u<.01)break;const d=u*x,f=Math.min(r-d,u);if(u-=f,u<.01&&(u=0),p.push({mes:$,fecha:m,cuota:r,interes:d,amortizacion:f,comisionAmort:0,capitalPendiente:u,esAmortizacion:!1,simulacion:!1}),v--,v<=0||u<.01)break}return p}const ka=new Map;function Z(t){var I;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((m,d)=>`${m.fecha}|${m.cantidad}|${m.tipo||""}`.localeCompare(`${d.fecha}|${d.cantidad}|${d.tipo||""}`)).map(m=>`${m.fecha}:${m.cantidad}:${m.tipo||""}`).join(";")}`,o=ka.get(a);if(o)return o;const{capital:s,tin:n,meses:i,fechaInicio:p,comisionAmort:u,comisionApertura:l}=t,x=La(s,n,i,p,u||0,e,t),v=x.reduce((m,d)=>m+d.interes,0),r=x.reduce((m,d)=>m+d.comisionAmort,0),b=s*((l||0)/100),g=x.filter(m=>!m.esAmortizacion),$={cuota:zt(s,n,i),totalIntereses:v,tae:qa(s,n,i,l||0),costoTotal:v+r+b,comAp:b,totalComAm:r,fechaFin:((I=g.slice(-1)[0])==null?void 0:I.fecha)||"",mesesReales:g.length,tabla:x};return ka.set(a,$),$}function Oa(t){const e=Z(t),a=Z({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,s=a.mesesReales-e.mesesReales,n=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:s,costeTotalAmort:n,ahorroNeto:o-n,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function lt(t,e,a){if(!t||t.length===0)return 1;const o=N(e),s=N(a);if(s<=o)return 1;const n=[...t].sort((u,l)=>u.year-l.year);let i=1,p=new Date(o);for(;p<s;){const u=p.getFullYear(),l=n.filter($=>$.year<=u),x=l.length>0?l[l.length-1]:n[0],v=(x?x.tasa:0)/100,r=new Date(u+1,0,1),b=r<s?r:s,g=(b.getTime()-p.getTime())/(1e3*60*60*24);i*=Math.pow(1+v,g/365.25),p=b}return i}function Ba(t,e,a,o=0){const s=N(e),n=N(a);if(n<=s)return o;const i=(n.getTime()-s.getTime())/864e5,p=t?[...t].sort((x,v)=>x.year-v.year):[];let u=0,l=new Date(s);for(;l<n;){const x=l.getFullYear(),v=new Date(x+1,0,1),r=v<n?v:n,b=(r.getTime()-l.getTime())/864e5,g=p.filter(m=>m.year<=x),$=g.length>0?g[g.length-1]:null,I=$!==null?$.tasa:o;u+=I*b,l=r}return i>0?u/i:o}function Ha(t,e){return((1+t/100)/(1+e/100)-1)*100}function eo(t,e,a,o){const s=lt(e,a,o);return s>0?t/s:t}function oo(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,s=e.saludUmbralDTIVerde??30,n=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],p=e.saludExcluirHipoteca||!1,{ingresos:u=0,cuotas:l=0,cuotasHipoteca:x=0,gastosBasicos:v=0,gastosOtros:r=0,amortizaciones:b=0}=t,g=u-l-b-v-r,$=g,I=u>0?$/u*100:null,m=p?l-x:l,d=u>0?m/u*100:null,f=u>0?l/u*100:null,A=u>0?(v+l+b)/u*100:null,h=u>0?r/u*100:null,y=(S,M,C)=>S===null?"neutral":S>=M?"verde":S>=C?"amarillo":"rojo",w=(S,M,C)=>S===null?"neutral":S<=M?"verde":S<=C?"amarillo":"rojo";return{ingresos:u,cuotas:l,cuotasHipoteca:x,gastosBasicos:v,gastosOtros:r,amortizaciones:b,ahorroBruto:g,ahorroReal:$,tasaAhorro:I,dti:d,dtiTotal:f,excluyeHipoteca:p,pctNecesidades:A,pctDeseos:h,semAhorro:y(I,a,o),semDTI:w(d,s,n),semNecesidades:w(A,i[0],i[0]+15),semDeseos:w(h,i[1],i[1]+10),semAhorroRegla:y(I,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:s,umbralDTIAmarillo:n,regla:i}}function dt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function it(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function Rt(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];a&&o.push({fecha:a,saldo:t.saldoInicial||0});for(const n of t.historicoSaldos||[])n.fecha>=a&&o.push(n);o.sort((n,i)=>i.fecha.localeCompare(n.fecha));const s=o.find(n=>n.fecha<=e);return s?s.saldo:t.saldoInicial||0}else{const s=[...t.historicoSaldos||[]].sort((n,i)=>i.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=e);return s?s.saldo:0}}function na(t,e){const a=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return a?e.filter(o=>a.includes(o._id)):e.filter(o=>o.activo&&!o.simulacion)}function Ga(t,e,a=0){const o=na(t,e).reduce((s,n)=>s+it(n),0);return t.usarColchon!==!1?Math.max(0,o-a):o}function Va(t,e,a){if(!t.targetAmount||t.targetAmount<=0)return null;const o=na(t,e);if(o.length===0)return null;const s=a.hoy??new Date,n=a.horizonteMeses??120,i=t.usarColchon!==!1,p=o.map(u=>({acc:u,eventos:a.extractoCuenta(u),cursor:0,saldo:it(u)}));for(let u=1;u<=n;u++){const l=new Date(s.getFullYear(),s.getMonth()+u,1),x=`${l.getFullYear()}-${String(l.getMonth()+1).padStart(2,"0")}`,v=O(new Date(l.getFullYear(),l.getMonth()+1,0));let r=0;for(const g of p){for(;g.cursor<g.eventos.length&&g.eventos[g.cursor].fecha<=v;)g.saldo=g.eventos[g.cursor].saldoAcum??g.saldo,g.cursor++;r+=g.saldo}const b=i?a.colchonEnFecha(v):0;if(r-b>=t.targetAmount)return x}return null}function Ua(t,e){const a=t.escenarioIds||[];return a.length===0?!0:!!e&&a.includes(e)}function Ya(t,e){const a=o=>Ua(o,e);return{loans:t.loans.filter(a).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}const ia=t=>t.slice(0,7);function so(t){const[e,a]=t.split("-").map(Number);return`${a===12?e+1:e}-${String(a===12?1:a+1).padStart(2,"0")}`}function ra(t,e,a){if(t.length===0)return[];const o=new Map;for(const l of t)l.saldoAcum!==void 0&&o.set(ia(l.fecha),l.saldoAcum);const s=t[0];let n=(s.saldoAcum??0)-(s.delta??0);const i=ia(e||s.fecha),p=ia(a||t[t.length-1].fecha);if(p<i)return[];const u=[];for(let l=i;l<=p;l=so(l)){const x=o.get(l);x!==void 0&&(n=x);const[v,r]=l.split("-").map(Number);u.push({x:N(O(new Date(v,r-1,15))).getTime(),mes:l,y:n})}return u}function ca(t,e){let a=null;for(const o of t){if(o.fecha>e)break;o.saldoAcum!==void 0&&(a=o.saldoAcum)}return a}const ft=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ct(t,e){const a=[...e].sort((n,i)=>n[0]-i[0]);let o=0,s=t;for(let n=a.length-1;n>=0;n--){const[i,p]=a[n];s<=i||(o+=(s-i)*(p/100),s=i)}return o}function la(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,s=Math.min(2e3,a),n=Math.max(0,a-o-s),i=n<=15876?7302:n<=21622?Math.max(0,7302-1.75*(n-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:s,RNT:n,reducArt20:i,baseImponible:Math.max(0,n-i)}}function yt(t,e){return la(t,e).baseImponible}function Wa(t,e){return ct(t,e)/12}const At=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function da(t,e){if(!t||t<=0)return 0;const a=e||At;let o=0,s=t;for(let n=0;n<a.length;n++){const[i,p]=a[n],u=n<a.length-1?a[n+1][0]:1/0,l=Math.min(s,u-i);if(!(l<=0)&&(o+=l*(p/100),s-=l,s<=0))break}return o}function Ft(t,e){if(dt(t)!=="inversion")return null;const a=it(t),o=(t.aportaciones||[]).reduce((i,p)=>i+p.cantidad,0)||t.saldoInicial||0,s=Math.max(0,a-o),n=da(s,e);return{saldo:a,costBase:o,plusvalia:s,impuesto:n,neto:a-n}}function Xt(t,e=new Date){var r;if(dt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=it(t),s=O(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),n=[...t.aportaciones||[]].sort((b,g)=>b.fecha.localeCompare(g.fecha));let i=0;const p=n.reduce((b,g)=>b+g.cantidad,0);for(const b of n)b.fecha<=s&&(i+=b.cantidad);const u=Math.max(0,o-p),l=p>0?i/p:0,x=Math.min(o,i+u*l),v=Math.max(0,o-x);return{saldo:o,disponible:x,bloqueado:v,costBase:p,beneficio:u,numAportaciones:n.length,proxDesbloqueo:((r=n.find(b=>b.fecha>s))==null?void 0:r.fecha)||null}}function Ja(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(dt(t)!=="pension"||!o)return 0;const s=it(t);if(s<=0)return 0;const n=(t.aportaciones||[]).reduce((l,x)=>l+x.cantidad,0),i=Math.max(0,s-n);if(i<=0)return 0;const p=i/s;return+(e*p*o/100).toFixed(2)}function ua(t,e,a){var u;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const n=(e||[]).filter(l=>(l.grupoNomina||"")===o&&l.activo!==!1).reduce((l,x)=>l+(x.bruto||0)*(x.nPagas||12),0),i=[...a||[]].sort((l,x)=>l[0]-x[0]);let p=((u=i[0])==null?void 0:u[1])||19;for(const[l,x]of i)if(n>=l)p=x;else break;return p}const pa=6.35;function wt(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function Ka(t){return Math.max(0,(t.bruto||0)-wt(t))}function no(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function io(t){const e=t.reduce((i,p)=>i+(p.bruto||0),0),a=t.reduce((i,p)=>i+wt(p),0),o=Math.max(0,e-a),s=yt(e,a),n=new Map;for(const i of t)n.set(i._id,o>0?s*(Ka(i)/o):0);return n}function ma(t,e,a){if(t.irpfModo==="manual")return Ka(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return ct(yt(t.bruto||0,wt(t)),a);const o=no(e.filter(i=>i.irpfModo!=="manual")),s=io(e);let n=0;for(const i of o){const p=s.get(i._id)??0;if(i._id===t._id)return ct(n+p,a)-ct(n,a);n+=p}return ct(yt(t.bruto||0,wt(t)),a)}function ro(t,e){return t.reduce((a,o)=>a+ma(o,t,e),0)}function co(t,e){var s;const a=[...e||[]].sort((n,i)=>n[0]-i[0]);let o=((s=a[0])==null?void 0:s[1])??19;for(const[n,i]of a)if(t>=n)o=i;else break;return o}function Xa(t,e){if(!t||t.length===0)return 0;const a=t.reduce((s,n)=>s+(n.bruto||0),0),o=t.reduce((s,n)=>s+wt(n),0);return co(yt(a,o),e)}function fa(t,e,a){const o=t.bruto||0,s=wt(t),n=Math.max(0,o-s),i=t.nPagas||12,p=t.ssPct??pa,u=n*(p/100),l=ma(t,e,a);return{brutoAnual:o,flexAnual:s,baseDineraria:n,nPagas:i,ssPct:p,ssAnual:u,irpfAnual:l,irpfPct:n>0?l/n*100:0,netoPorPaga:(n-u-l)/i}}function lo(t){const e=new Map,a=[];for(const o of t){const s=o.grupoNomina||"";if(!s){a.push(o);continue}const n=e.get(s)??[];n.push(o),e.set(s,n)}return{grupos:e,sueltas:a}}const St=1500;function Qa(t){const e=t.cuantia||0,a=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?e*12/a:t.tipoFrecuencia==="diaria"?e*365.25/a:e}const Nt=t=>{const e=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(e)?e:0};function uo(t,e){const a=t.grupoNomina||"";return a?e.filter(o=>(o.grupoNomina||"")===a):null}function Za(t,e){return t.reduce((a,o)=>a+ma(o,uo(o,t),e),0)}function te(t){const{nominas:e,tramosGeneral:a,tramosAhorro:o}=t,s=t.extras??{},n=e.reduce((S,M)=>S+(M.bruto||0),0),i=e.reduce((S,M)=>S+wt(M),0),p=la(n,i),u=t.aportacionesPension,l=St,x=Math.min(u,l),v=Math.max(0,p.RNT-p.reducArt20-x),r=Nt(s.capInmobiliario),b=Nt(s.capMobiliario),g=Nt(s.gananciasFondos),$=Nt(s.otrasCorto),I=Nt(s.retCapital),m=Math.max(0,v+t.otrosIngresos+r+$),d=Math.max(0,b+g),f=ct(m,a),A=ct(d,o),h=f+A,y=Za(e,a),w=y+I;return{brutoTotal:n,flexTotal:i,brutoIRPF:p.baseIRPF,cotizSS:p.cotizSS,gastosArt19:p.gastosArt19,RNT:p.RNT,reducArt20:p.reducArt20,aportPP:u,limPP:l,deducPP:x,RNTred:v,otrosIngresos:t.otrosIngresos,capInmobiliario:r,capMobiliario:b,gananciasFondos:g,otrasCorto:$,baseGeneral:m,baseAhorro:d,cuotaGen:f,cuotaAho:A,cuotaIntegra:h,retNomina:y,retCapital:I,totalRet:w,resultado:h-w}}const po=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:St,TRAMOS_AHORRO_DEFAULT:At,TRAMOS_IRPF_DEFAULT:ft,ajustarFechaPago:Ra,ajustarPrecioReal:eo,calcBaseImponibleTrabajo:yt,calcFactorInflacion:lt,calcFondoInversion:Ft,calcFondosPension:Xt,calcGananciasCapital:da,calcIRPF:ct,calcImpuestoPension:Ja,calcInflacionMediaAnual:Ba,calcSaludFinanciera:oo,calcTAE:qa,calcTipoMarginalPension:ua,calcTipoRealFisher:Ha,calcularDeclaracion:te,clampedDate:Da,cuentasDelObjetivo:na,cuotaMensual:zt,desgloseBaseTrabajo:la,filtrarPorEscenario:Ya,formatEUR:z,formatLocalDate:O,formatPct:Na,fromCents:ot,ingresoAnual:Qa,labelDiaPago:sa,lastDayOfMonth:oa,modeloFondoDe:dt,parseLocalDate:N,proyectarFechaCumplimiento:Va,resolverDiaEfectivo:Kt,resumenPrestamo:Z,resumenPrestamoConAhorro:Oa,retencionMensual:Wa,retencionesNomina:Za,roundMoney:st,saldoEnFecha:Rt,saldoEnFechaExtracto:ca,saldoParaObjetivo:Ga,saldoRealCuenta:it,serieMensual:ra,tablaAmortizacion:La,toCents:It,todayISO:V,visibleEnEscenario:Ua},Symbol.toStringTag,{value:"Module"}));function qt(t,e,a=null){const o=[],s=N(e.start),n=N(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const p=N(i.fechaInicio||e.start),u=i.fechaFin?N(i.fechaFin):n,l=i.cuantia,x=v=>o.push({fecha:v,concepto:i.concepto,cuantia:l,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")p>=s&&p<=n&&p<=u&&x(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const v=Math.max(1,i.frecuencia||1);let r=p.getFullYear(),b=p.getMonth();const g=Math.ceil(240/v)+2;for(let $=0;$<g;$++){const I=Kt(r,b,i.diaPago||"")||(()=>{const d=p.getDate(),f=new Date(r,b+1,0).getDate();return O(new Date(r,b,Math.min(d,f)))})(),m=N(I);if(m>n||m>u)break;m>=s&&m>=p&&x(I),b+=v,b>=12&&(r+=Math.floor(b/12),b=b%12)}}else if(i.tipoFrecuencia==="diaria"){const v=Math.max(1,i.frecuencia||1)*864e5;let r=new Date(Math.max(p.getTime(),s.getTime()));if(p<s){const b=Math.ceil((s.getTime()-p.getTime())/v);r=new Date(p.getTime()+b*v)}for(;r<=n&&r<=u;)x(O(r)),r=new Date(r.getTime()+v)}}return o}function ae(t,e,a=null){const o=[];for(const s of t){if(!s.activo||a&&a.length>0&&!a.includes(s.cuenta||"default"))continue;const{tabla:n}=Z(s);for(const i of n)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${s.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${s.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan",simulacion:s.simulacion||!1}))}return o}function ee(t,e,a=null,o={accounts:[]}){const s=[],n=N(e.start),i=N(e.end),p=o.accounts||[],u=o.nominas||[],l=o.resolverTramosIRPF||(()=>ft),x=o.resolverTramosGanancias||(()=>At),v=r=>{var b;return((b=p.find(g=>g._id===r))==null?void 0:b.nombre)??r};for(const r of t){if(!r.activo||r.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(r.cuenta||"default")||a.includes(r.cuentaDestino||"default")))continue;const b=N(r.fechaInicio||e.start),g=r.fechaFin?N(r.fechaFin):i,$=I=>{const m=p.find(P=>P._id===(r.cuenta||"default")),d=p.find(P=>P._id===(r.cuentaDestino||"default")),f=dt(m),A=dt(d),h=f==="inversion"&&A==="inversion"||f==="pension"&&A==="pension",y=["transferencia",...h?["traspaso"]:[],...r.tags||[]],w=h?"traspaso-out":"transfer-out",S=h?"traspaso-in":"transfer-in",M=!a||a.length===0||a.includes(r.cuenta||"default"),C=!a||a.length===0||a.includes(r.cuentaDestino||"default");if(M&&s.push({fecha:I,concepto:`Transf. → ${v(r.cuentaDestino||"default")}: ${r.concepto}`,cuantia:r.cuantia,tipo:"gasto",tags:y,cuenta:r.cuenta||"default",sourceId:r._id,sourceType:w}),C&&s.push({fecha:I,concepto:`Transf. ← ${v(r.cuenta||"default")}: ${r.concepto}`,cuantia:r.cuantia,tipo:"ingreso",tags:y,cuenta:r.cuentaDestino||"default",sourceId:r._id,sourceType:S}),M&&!h&&m){if(f==="inversion"){const P=parseInt(I.slice(0,4)),F=Ft(m,x(P));if(F&&F.saldo>0&&F.plusvalia>0){const T=Math.min(1,r.cuantia/F.saldo),R=F.plusvalia*T*.19;R>.01&&s.push({fecha:I,concepto:`Retención IRPF reembolso ${m.nombre} (19% s/plusvalía)`,cuantia:R,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:r.cuenta||"default",sourceId:r._id,sourceType:"investment-tax"})}}else if(f==="pension"){const P=l(parseInt(I.slice(0,4))),F=ua(m,u,P),T=Ja(m,r.cuantia,F||void 0);if(T>0){const _=m.grupoNomina?`IRPF rescate ${m.nombre} (tipo marginal grupo "${m.grupoNomina}": ${F}%)`:`Retención rescate ${m.nombre} (${m.impuestoRetirada}% s/beneficio)`;s.push({fecha:I,concepto:_,cuantia:T,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:r.cuenta||"default",sourceId:r._id,sourceType:"pension-tax"})}}}};if(r.tipoFrecuencia==="extraordinario")b>=n&&b<=i&&b<=g&&$(r.fechaInicio);else if(r.tipoFrecuencia==="mensual"){const I=Math.max(1,r.frecuencia||1);let m=b.getFullYear(),d=b.getMonth();const f=Math.ceil(240/I)+2;for(let A=0;A<f;A++){const h=Kt(m,d,r.diaPago||"")||(()=>{const w=b.getDate(),S=new Date(m,d+1,0).getDate();return O(new Date(m,d,Math.min(w,S)))})(),y=N(h);if(y>i||y>g)break;y>=n&&y>=b&&$(h),d+=I,d>=12&&(m+=Math.floor(d/12),d=d%12)}}else if(r.tipoFrecuencia==="diaria"){const I=Math.max(1,r.frecuencia||1)*864e5;let m=new Date(Math.max(b.getTime(),n.getTime()));if(b<n){const d=Math.ceil((n.getTime()-b.getTime())/I);m=new Date(b.getTime()+d*I)}for(;m<=i&&m<=g;)$(O(m)),m=new Date(m.getTime()+I)}}return s}function oe(t,e,a=null){const o=[],s=N(e.start),n=N(e.end);for(const i of t){const p=dt(i);if(p==="cuenta"||!i.activo)continue;const u=i.planAportaciones||[];for(const l of u){if(!l.importe||l.importe<=0)continue;const x=N(l.fechaInicio||e.start),v=l.fechaFin?N(l.fechaFin):n,r=l.cuentaOrigen||"default",b=!a||!a.length||a.includes(r),g=!a||!a.length||a.includes(i._id),$=p==="pension"?"pension":"capital-mobiliario",I=h=>{b&&o.push({fecha:h,concepto:`Aportación → ${i.nombre}`,cuantia:l.importe,tipo:"gasto",tags:["aportacion","transferencia",$],cuenta:r,sourceId:l._id,sourceType:"aportacion-out"}),g&&o.push({fecha:h,concepto:`Aportación ${i.nombre} (${l.periodicidad||"mensual"})`,cuantia:l.importe,tipo:"ingreso",tags:["aportacion","transferencia",$],cuenta:i._id,sourceId:l._id,sourceType:"aportacion-in"})},m={mensual:1,trimestral:3,semestral:6,anual:12}[l.periodicidad||"mensual"]||1;let d=x.getFullYear(),f=x.getMonth();const A=Math.ceil(240/m)+2;for(let h=0;h<A;h++){const y=new Date(d,f+1,0).getDate(),w=O(new Date(d,f,Math.min(x.getDate(),y))),S=N(w);if(S>n||S>v)break;S>=s&&S>=x&&I(w),f+=m,f>=12&&(d+=Math.floor(f/12),f=f%12)}}}return o}function se(t,e,a=null,o=[]){const s=[];for(const n of t){if(!n.activo||!n.interes||n.interes<=0||a&&a.length>0&&!a.includes(n._id))continue;const i=N(e.start),p=N(e.end),u=n.periodoCobro||"mensual",l=u==="mensual",x=l?null:{diario:864e5,semanal:7*864e5}[u]||864e5,v=l?1/12:x/(365.25*864e5);let r=Rt(n,e.start);const b=o.filter(I=>I.cuenta===n._id).map(I=>({fecha:I.fecha,delta:I.tipo==="ingreso"?Math.abs(I.cuantia):-Math.abs(I.cuantia)})).sort((I,m)=>I.fecha.localeCompare(m.fecha));let g=0,$=new Date(i);for(;$<=p;){const I=l?new Date($.getFullYear(),$.getMonth()+1,$.getDate()):new Date($.getTime()+x),m=new Date(Math.min(I.getTime(),p.getTime()+1)),d=O(m);let f=0;for(;g<b.length&&b[g].fecha<d;)f+=b[g].delta,g++;const A=r,h=r+f,y=Math.max(0,(A+h)/2);r=h;const w=l?v:(m.getTime()-$.getTime())/(365.25*864e5),S=y*(Math.pow(1+n.interes/100,w)-1);S>.001&&s.push({fecha:O($),concepto:`Interés ${n.nombre}`,cuantia:S,tipo:"ingreso",tags:["interes","cuenta"],cuenta:n._id,sourceId:n._id,sourceType:"account-interest"}),$=I}}return s}function ne(t,e,a,o=null){const s=[],n=e||ft;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const p=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),u=Wa(p,n),l={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:u,tags:["irpf","fiscal"]};s.push(...qt([l],a,o))}return s}const mo=[5,11,2,8],fo={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function ie(t,e,a=null,o=[],s=()=>ft){const n=[],i=N(e.start),p=N(e.end),u=o.length>0,l={};for(const r of t){const b=r.grupoNomina||"";l[b]||(l[b]=[]),l[b].push(r)}for(const r of Object.keys(l))l[r].sort((b,g)=>(g.bruto||0)-(b.bruto||0));function x(r,b){if(!u||!r.mesActualizacionIPC)return r.bruto||0;const g=r.fechaInicio||e.start,$=N(g),I=N(b);let m=0;for(let f=$.getFullYear();f<=I.getFullYear();f++){const A=new Date(f,r.mesActualizacionIPC-1,1);A>$&&A<=I&&m++}if(m===0)return r.bruto||0;const d=O(new Date($.getFullYear()+m,0,1));return(r.bruto||0)*lt(o,g,d)}function v(r,b){const g=x(r,b),$=(r.retribucionFlexible||[]).reduce((P,F)=>P+(F.importe||0)*12,0),I=Math.max(0,g-$);if(r.irpfModo==="manual")return I*((r.irpfPct||0)/100);const m=s(parseInt(b.slice(0,4))),d=r.grupoNomina||"";if(!d)return ct(yt(g,$),m);const f=l[d].filter(P=>P.activo),A=f.reduce((P,F)=>P+x(F,b),0),h=f.reduce((P,F)=>P+(F.retribucionFlexible||[]).reduce((T,_)=>T+(_.importe||0)*12,0),0),y=Math.max(0,A-h),w=yt(A,h),S=Math.max(0,g-$),M=y>0?w*(S/y):0,C=f.filter(P=>P._id!==r._id&&(P.bruto||0)>(r.bruto||0)).reduce((P,F)=>{const T=(F.retribucionFlexible||[]).reduce((R,q)=>R+(q.importe||0)*12,0),_=Math.max(0,x(F,b)-T);return P+(y>0?w*(_/y):0)},0);return ct(C+M,m)-ct(C,m)}for(const r of t){if(!r.activo)continue;const b=r.cuenta||"default";if(a&&a.length>0&&!a.includes(b))continue;const g=Math.max(1,r.nPagas||12),$=N(r.fechaInicio||e.start),I=r.fechaFin?N(r.fechaFin):p,m=d=>{const f=x(r,d),A=v(r,d),h=(r.retribucionFlexible||[]).reduce((T,_)=>T+(_.importe||0)*12,0),y=Math.max(0,f-h),w=(r.ssPct??6.35)/100,S=y*w,M=y/g,C=A/g,P=S/g,F=r.representacion==="simplificado"?M-P-C:M;n.push({fecha:d,concepto:r.nombre,cuantia:F,tipo:"ingreso",cuenta:b,tags:r.tags||[],sourceId:r._id,sourceType:"nomina"}),r.representacion==="detallado"&&(P>0&&n.push({fecha:d,concepto:`SS ${r.nombre}`,cuantia:P,tipo:"gasto",cuenta:b,tags:["seguridad-social","fiscal"],sourceId:r._id+"_ss",sourceType:"nomina"}),C>0&&n.push({fecha:d,concepto:`IRPF ${r.nombre}`,cuantia:C,tipo:"gasto",cuenta:b,tags:["irpf","fiscal"],sourceId:r._id+"_irpf",sourceType:"nomina"}));for(const T of r.retribucionFlexible||[])!T.cuenta||!(T.importe>0)||a&&a.length>0&&!a.includes(T.cuenta)||n.push({fecha:d,concepto:`${r.nombre} — ${fo[T.tipo]||T.tipo}`,cuantia:T.importe,tipo:"ingreso",cuenta:T.cuenta,tags:["retribucion-flexible",T.tipo],sourceId:`${r._id}_flex_${T._id||T.tipo}`,sourceType:"nomina"})};if(g<=12){const d=g===12?1:Math.round(12/g),f=$.getDate();let A=$.getFullYear(),h=$.getMonth();for(let y=0;y<300;y++){const w=new Date(A,h+1,0).getDate(),S=new Date(A,h,Math.min(f,w));if(S>p||S>I)break;S>=i&&S>=$&&m(O(S)),h+=d,h>=12&&(A+=Math.floor(h/12),h=h%12)}}else{const d=g-12,f=$.getDate();let A=$.getFullYear(),h=$.getMonth();for(let S=0;S<300;S++){const M=new Date(A,h+1,0).getDate(),C=new Date(A,h,Math.min(f,M));if(C>p||C>I)break;C>=i&&C>=$&&m(O(C)),h++,h>=12&&(A++,h=0)}const y=Math.max($.getFullYear(),i.getFullYear()),w=Math.min((r.fechaFin?I:p).getFullYear(),p.getFullYear());for(let S=y;S<=w;S++)for(const M of mo.slice(0,d)){const C=new Date(S,M,15);C>=i&&C<=p&&C>=$&&C<=I&&m(O(C))}}}return n}function re(t,e,a,o=null,s="default"){const n=[];if(!e||e.length===0)return n;const i=N(a.start),p=N(a.end),u=V(),l=t.filter(v=>v.activo&&v.tipo==="gasto"&&v.tipoFrecuencia==="mensual");let x=new Date(i.getFullYear(),i.getMonth(),1);for(;x<=p;){const v=x.getFullYear(),r=x.getMonth(),b=v+"-"+String(r+1).padStart(2,"0"),g=b+"-01",$=O(new Date(v,r+1,0)),I=O(new Date(v,r,15));let m=0;for(const d of l){if(o&&o.length>0&&!o.includes(d.cuenta||"default")||d.fechaInicio&&d.fechaInicio>$||d.fechaFin&&d.fechaFin<g)continue;const f=d.fechaInicio||u,A=lt(e,f,I);if(A<=1)continue;const h=Math.max(1,d.frecuencia||1);m+=d.cuantia*(A-1)/h}m>.01&&n.push({fecha:I,concepto:"Incremento coste de vida",cuantia:m,tipo:"gasto",tags:["inflacion"],cuenta:s,sourceId:"inflacion_vida_"+b,sourceType:"inflacion"}),x=new Date(v,r+1,1)}return n}function ce(t,e,a,o="default"){const s=[];if(!e||e.length===0||t<=0)return s;const n=N(a.start),i=N(a.end),p=[...e].sort((l,x)=>l.year-x.year);let u=new Date(n.getFullYear(),n.getMonth(),1);for(;u<=i;){const l=u.getFullYear(),x=u.getMonth(),v=l+"-"+String(x+1).padStart(2,"0"),r=O(new Date(l,x,15)),b=p.filter(d=>d.year<=l),g=b.length>0?b[b.length-1]:p[0],$=g?g.tasa/100:0,I=Math.pow(1+$,1/12)-1,m=t*I;m>.01&&s.push({fecha:r,concepto:"Pérdida ahorro por inflación",cuantia:m,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+v,sourceType:"inflacion"}),u=new Date(l,x+1,1)}return s}function le(t,e,a){const o=a.fechaReferencia||a.dashboardStart,s=o<a.dashboardStart?a.dashboardStart:o>a.dashboardEnd?a.dashboardEnd:o,n=e.reduce((v,r)=>v+Rt(r,s),0),i=t.filter(v=>v.fecha<s),p=t.filter(v=>v.fecha>=s),u=[];let l=n;for(const v of[...i].reverse()){const r=v.tipo==="ingreso"?Math.abs(v.cuantia):-Math.abs(v.cuantia);u.unshift({...v,delta:r,saldoAcum:l}),l-=r}const x=[];l=n;for(const v of p){const r=v.tipo==="ingreso"?Math.abs(v.cuantia):-Math.abs(v.cuantia);l+=r,x.push({...v,delta:r,saldoAcum:l})}return[...u,...x]}function vo(t,e,a,o=null){const s=e.filter(n=>n.activo&&(!o||o.length===0||o.includes(n._id)));return le([...t].sort((n,i)=>n.fecha.localeCompare(i.fecha)),s,a)}function Lt(t){const{loans:e,expenses:a,accounts:o,config:s}=t,n=t.filtroAccounts??null,i=t.nominas??[],p=t.inflacionPeriodos??[],u={start:s.dashboardStart,end:s.dashboardEnd},l=a.filter($=>$.tipo!=="transferencia"),x=a.filter($=>$.tipo==="transferencia"),v={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let r=[];r=r.concat(qt(l,u,n)),r=r.concat(ae(e,u,n)),r=r.concat(ee(x,u,n,v)),r=r.concat(oe(o,u,n));const b=se(o,u,n,r);if(r=r.concat(b),r=r.concat(ne(a,s.tramos_irpf,u,n)),r=r.concat(ie(i,u,n,p,t.resolverTramosIRPF)),s.usarInflacion&&p.length>0){const $=(o.find(d=>d.activo&&d.esCuentaPrincipal)||o.find(d=>d.activo)||{_id:"default"})._id;r=r.concat(re(l,p,u,n,$));const m=o.filter(d=>d.activo&&(!n||n.length===0||n.includes(d._id))).reduce((d,f)=>d+Rt(f,s.dashboardStart),0);r=r.concat(ce(m,p,u,$))}r.sort(($,I)=>$.fecha.localeCompare(I.fecha));const g=o.filter($=>$.activo&&(!n||n.length===0||n.includes($._id)));return le(r,g,s)}function go(t,e,a=null){const o=V(),n=e.filter(p=>p.activo&&(!a||a.length===0||a.includes(p._id))).reduce((p,u)=>p+it(u),0),i=t.filter(p=>p.fecha<=o);return i.length===0?n:i[i.length-1].saldoAcum}function de(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const s of o.tags||["sin_tag"])a.set(s,(a.get(s)||0)+Math.abs(o.cuantia));return a}function bo(t,e){const a=[];let o=!1;for(let s=0;s<t.length;s++){const n=t[s],i=n.saldoAcum;i<0&&(s===0||t[s-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:n.fecha,saldo:i,mensaje:`Saldo negativo (${z(i)}) a partir del ${n.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:n.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${z(i)} < ${z(e)}) desde ${n.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:n.fecha,saldo:i,mensaje:`Recuperación del colchón el ${n.fecha} (${z(i)})`})))}return a}function ho(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,p)=>i+Math.abs(p.cuantia),0),o=N(e.dashboardStart),s=N(e.dashboardEnd),n=Math.max(1,(s.getTime()-o.getTime())/(30.44*864e5));return a/n}function yo(t,e,a=V()){const o=new Set,s=e.map(p=>{const u=p.fechaInicialSaldo||"",l={};u&&u<=a&&(l[u]=p.saldoInicial||0);for(const x of p.historicoSaldos||[])x.fecha<=a&&(!u||x.fecha>=u)&&(l[x.fecha]=x.saldo);return Object.keys(l).forEach(x=>o.add(x)),l}),n={};for(const p of[...o].sort()){let u=0;for(let l=0;l<e.length;l++){const x=Object.entries(s[l]).filter(([v])=>v<=p);x.length>0?(x.sort(([v],[r])=>r.localeCompare(v)),u+=x[0][1]):u+=e[l].saldoInicial||0}n[p]=u}const i=[];for(const[p,u]of Object.entries(n).sort(([l],[x])=>l.localeCompare(x))){const l=t.filter(b=>b.fecha<=p),x=l.length>0?l[l.length-1].saldoAcum:null;if(x===null)continue;const v=u-x,r=x!==0?v/Math.abs(x)*100:0;i.push({cuenta:"Total",fecha:p,estimado:x,real:u,desv:v,pct:r})}return i}const xo=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:yo,detectarPuntosCriticos:bo,mediaMensualGastos:ho},Symbol.toStringTag,{value:"Module"}));function kt(t,e=new Date){const a=O(e),o=new Date(e);o.setMonth(o.getMonth()+1);const s=O(o),n=t.filter(p=>p.basico&&p.activo&&p.tipo==="gasto");return qt(n,{start:a,end:s}).reduce((p,u)=>p+Math.abs(u.cuantia),0)}function va(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+zt(a.capital,a.tin,a.meses),0)}function ue(t,e,a,o){return e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0?e.colchonFijo:(kt(t,o)+va(a))*(e.colchonMeses||6)}function pe(t,e,a,o,s){const i=[...e.colchonPuntos||[]].sort((u,l)=>u.fecha.localeCompare(l.fecha)).filter(u=>u.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(kt(t,s)+va(a))*(i.meses||6):ue(t,e,a,s)}function Qt(t,e,a,o,s,n=!1,i){const p=[...t.puntos||[]].sort((x,v)=>x.fecha.localeCompare(v.fecha)),u=p.filter(x=>x.fecha<=s).pop()||(n?p[0]:null);return u?u.tipo==="fijo"?u.importe||0:(kt(e,i)+va(o))*(u.meses||1):0}function $o(t,e){const a={};for(const o of e)a[o._id]=it(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=o.cuantia),{fecha:o.fecha,saldos:{...a}}))}function Io(t,e,a,o,s,n,i){const p=[];for(const u of(t||[]).filter(l=>l.activo!==!1)){let l=!1;for(let x=0;x<e.length;x++){const v=e[x],r=Qt(u,o,s,n,v.fecha,!1,i);if(r<=0){l=!1;continue}const b=!u.cuentas||u.cuentas.length===0?v.saldoAcum:u.cuentas.reduce((g,$)=>{var I,m;return g+(((m=(I=a[x])==null?void 0:I.saldos)==null?void 0:m[$])||0)},0);b<r&&!l?(l=!0,p.push({tipo:"bajo_margen",fecha:v.fecha,saldo:b,target:r,nombre:u.nombre,mensaje:`⚠ ${u.nombre}: ${z(b)} < ${z(r)} desde ${v.fecha}`})):b>=r&&l&&(l=!1,p.push({tipo:"recuperacion_margen",fecha:v.fecha,saldo:b,target:r,nombre:u.nombre,mensaje:`✓ ${u.nombre}: recuperado el ${v.fecha}`}))}}return p}const Ao=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:ue,calcColchonEnFecha:pe,calcGastoBasicoMensual:kt,calcMargenEnFecha:Qt,detectarCrucesMargenes:Io,saldosPorCuentaEnExtracto:$o},Symbol.toStringTag,{value:"Module"})),me=[];function ga(){const t=new Map,e=new WeakMap;let a=1,o=0,s=0;const n=u=>{if(!u||typeof u!="object")return 0;const l=e.get(u);if(l)return l;const x=a++;return e.set(u,x),x},i=u=>u.map(l=>[l._id,l.capital,l.tin,l.meses,l.fechaInicio,l.comisionAmort||0,l.comisionApertura||0,l.diaPago||"",l.activo?1:0,l.cuenta||"",(l.amortizaciones||[]).map(x=>`${x.fecha}:${x.cantidad}:${x.tipo||""}`).sort().join(",")].join("|")).join(";");function p(u){const l=[i(u.loans),n(u.expenses),n(u.accounts),n(u.nominas),n(u.inflacionPeriodos),u.config.dashboardStart,u.config.dashboardEnd,u.config.fechaReferencia||"",u.config.usarInflacion?1:0,(u.filtroAccounts||[]).join(",")].join("#"),x=t.get(l);if(x)return s++,x;o++;const v=Lt(u);return t.set(l,v),v}return{statement:p,stats:()=>({hits:s,misses:o}),clear:()=>t.clear()}}function ba(t,e,a,o,s={},n=ga()){const{frecuencia:i=1,mesesHorizonte:p=36,minAmortizable:u=500,tipoAmort:l="plazo",fechaPrimeraAmort:x=null,loanIds:v=null,nominas:r=me,sourceAccountId:b=null,selectedMarginIds:g=null,hoy:$=new Date}=s,I=O($),m=Math.min(120,Math.max(1,p)),d=a.filter(D=>D.activo),f=d.map(D=>D._id),A=d.find(D=>D.esCuentaPrincipal)||d[0],h=b&&f.includes(b)?d.find(D=>D._id===b):A,y=h==null?void 0:h._id,w=t.filter(D=>D.activo&&!D.simulacion&&(!v||v.includes(D._id))).sort((D,k)=>k.tin-D.tin),S=!!g&&g.length>0,M=(o.margenesSeguridad||[]).filter(D=>D.activo!==!1).filter(D=>!D.cuentas||D.cuentas.length===0||D.cuentas.includes(y)).filter(D=>!S||g.includes(D._id));if(w.length===0)return{plan:[],margenesAplicados:M.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const C={};for(const D of w)C[D._id]=[];const P=[];function F(D){const k=new Date($.getFullYear(),$.getMonth()+D,1),U=k.getFullYear(),J=k.getMonth(),X=`${U}-${String(J+1).padStart(2,"0")}`,pt=O(new Date(U,J,Math.min(15,new Date(U,J+1,0).getDate())));return{label:X,dia15:pt}}function T(D,k){const U=[...D.amortizaciones||[],...C[D._id]],{tabla:J}=Z({...D,amortizaciones:U}),X=J.filter(et=>!et.esAmortizacion&&et.fecha<=k);if(X.length>0)return X[X.length-1].capitalPendiente;const pt=U.filter(et=>et.fecha<=k).reduce((et,mt)=>et+mt.cantidad,0);return Math.max(0,D.capital-pt)}function _(D){const k=t.map(nt=>({...nt,amortizaciones:[...nt.amortizaciones||[],...C[nt._id]||[]]})),U={...o,dashboardStart:I,dashboardEnd:D},J=n.statement({loans:k,expenses:e,accounts:a,config:U,filtroAccounts:null,nominas:r}),X=d.reduce((nt,Dt)=>nt+it(Dt),0),pt=h?it(h):0,et=X>0?pt/X:1;let mt=pt,Wt=X;for(const nt of J){const Dt=nt.delta??(nt.tipo==="ingreso"?Math.abs(nt.cuantia):-Math.abs(nt.cuantia));nt.cuenta===y?mt+=Dt:f.includes(nt.cuenta)||(mt+=Dt*et),Wt=nt.saldoAcum}return{source:mt,total:Wt}}function R(D){const{source:k}=_(D);if(k<=0)return k;let U=0;for(const J of M){const X=Qt(J,e,o,t,D,!0,$);X>U&&(U=X)}return k-U}const q=2;let B=0;if(x){for(let D=0;D<m;D++)if(F(D).dia15>=x){B=D;break}}for(let D=0;D<m;D++){if((D-B)%i!==0||D<B)continue;const{label:k,dia15:U}=F(D);if(U<I)continue;const J=R(U)-q;if(J<u)continue;let X=J,pt=0;for(const et of w){if(X<u)break;const mt=T(et,U);if(mt<1)continue;const Wt=et.comisionAmort||0,nt=1+Wt/100,Dt=Math.floor(X/nt),Qe=Math.min(Dt,mt);if(Qe<u)continue;const Jt=Math.min(Math.floor(Qe),Math.floor(mt)),Ze=+(Jt*Wt/100).toFixed(2),Ea=Jt+Ze;Ea>X||(C[et._id].push({_id:`opt_${k}_${et._id}`,fecha:U,cantidad:Jt,tipo:l,simulacion:!0}),pt+=Ea,P.push({mes:k,fechaAmort:U,loanId:et._id,loanNombre:et.nombre,tin:et.tin,capitalAntes:mt,cantidadAmort:Jt,comision:Ze,capitalDespues:Math.max(0,mt-Jt),saldoDisponible:J+q,excedente:J,saldoDespues:J+q-pt,tipoAmort:l}),X-=Ea)}}const G=P.reduce((D,k)=>D+k.cantidadAmort,0),L=P.reduce((D,k)=>D+k.comision,0),H=w.map(D=>{const k=C[D._id];if(!k.length)return null;const U=Z(D),J=Z({...D,amortizaciones:[...D.amortizaciones||[],...k]});return{loanId:D._id,nombre:D.nombre,tin:D.tin,fechaFinSin:U.fechaFin,fechaFinCon:J.fechaFin,mesesAhorrados:U.mesesReales-J.mesesReales,interesesSin:U.totalIntereses,interesesCon:J.totalIntereses,ahorroIntereses:U.totalIntereses-J.totalIntereses,numAmortizaciones:k.length,totalAmortizado:k.reduce((X,pt)=>X+pt.cantidad,0)}}).filter(D=>D!==null),Q=H.reduce((D,k)=>D+k.ahorroIntereses,0);return{plan:P,margenesAplicados:M.length,totalAmortizado:G,totalComisiones:L,totalAhorroIntereses:Q,resumenPorLoan:H}}function fe(t,e,a,o,s={},n){const{horizonte:i=60,minAmortizable:p=500,tipoAmort:u="plazo",fechaObjetivo:l=null,frecuencias:x=[1,2,3,6,12],fechaPrimeraAmort:v=null,loanIds:r=null,nominas:b=me,sourceAccountId:g=null,selectedMarginIds:$=null,hoy:I=new Date}=s,m=n??ga(),d=O(I),f=l||O(new Date(I.getFullYear(),I.getMonth()+i,1));function A(w){const S=t.map(F=>({...F,amortizaciones:[...F.amortizaciones||[],...w[F._id]||[]]})),M={...o,dashboardStart:d,dashboardEnd:f},C=m.statement({loans:S,expenses:e,accounts:a,config:M,filtroAccounts:null,nominas:b});if(C.length===0)return a.filter(F=>F.activo).reduce((F,T)=>F+it(T),0);const P=C.filter(F=>F.fecha<=f);return P.length>0?P[P.length-1].saldoAcum:C[0].saldoAcum}const h=A({}),y=x.map(w=>{const S=ba(t,e,a,o,{frecuencia:w,mesesHorizonte:i,minAmortizable:p,tipoAmort:u,fechaPrimeraAmort:v,loanIds:r,nominas:b,sourceAccountId:g,selectedMarginIds:$,hoy:I},m),M={};for(const P of t)M[P._id]=[];for(const P of S.plan)M[P.loanId].push({_id:P.mes+"_"+P.loanId,fecha:P.fechaAmort,cantidad:P.cantidadAmort,tipo:u,simulacion:!0});const C=A(M);return{frecuencia:w,label:w===1?"Mensual":`Cada ${w} meses`,numAmortizaciones:S.plan.length,totalAmortizado:S.totalAmortizado,totalComisiones:S.totalComisiones,ahorroIntereses:S.totalAhorroIntereses,saldoObjetivo:C,gananciaSaldo:C-h,valorTotal:S.totalAhorroIntereses+(C-h),plan:S.plan,resumenPorLoan:S.resumenPorLoan}}).filter(w=>w.numAmortizaciones>0);if(y.length>0){const w=Math.max(...y.map(C=>C.ahorroIntereses)),S=Math.max(...y.map(C=>C.saldoObjetivo)),M=Math.max(...y.map(C=>C.valorTotal));y.forEach(C=>{C.esMejorIntereses=C.ahorroIntereses===w,C.esMejorSaldo=C.saldoObjetivo===S,C.esMejorValor=C.valorTotal===M})}return{resultados:y,saldoBase:h,fechaObjetivo:f}}const wo=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:fe,createStatementMemo:ga,defaultHoyISO:V,optimizarAmortizaciones:ba},Symbol.toStringTag,{value:"Module"})),So=30.44*864e5;function ve(t){const e=t.getFullYear(),a=t.getMonth();return{desde:O(new Date(e,a,1)),hasta:O(new Date(e,a,oa(e,a)))}}function ge(t){const[e,a]=t.split("-").map(Number);return ve(new Date(e,a-1,1))}function Mo(t,e){return Math.max(1,(N(e).getTime()-N(t).getTime())/So)}const Co=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),xt=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function zo(t,e){const a=new Map(e.map(n=>[n._id,n.clasificacion]));let o=0,s=0;for(const n of t){if(n.tipo!=="gasto"||n.sourceType!=="expense")continue;const i=a.get(n.sourceId??"");i!==null&&(i==="deseo"?s+=Math.abs(n.cuantia):o+=Math.abs(n.cuantia))}return{basicos:o,deseo:s}}function Fo(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=r=>r.sourceType==="loan"&&r.tipo==="gasto",s=e.loanIdsIniciados,n=xt(t.filter(r=>r.tipo==="ingreso")),i=xt(t.filter(r=>o(r)&&(!s||s.has(r.sourceId??"")))),p=xt(t.filter(r=>o(r)&&e.hipotecaIds.has(r.sourceId??""))),u=xt(t.filter(r=>r.sourceType==="loan-amort")),l=xt(t.filter(r=>r.sourceType==="account-interest")),{basicos:x,deseo:v}=zo(t,e.expenses);return{ingresos:n/a,cuotas:i/a,cuotasHipoteca:p/a,amortizaciones:u/a,gastosBasicos:x/a,gastosDeseo:v/a,gastosTotales:(i+x+v)/a,intereses:l/a}}function be(t,e){return t.reduce((a,o)=>{const s=Z(o).tabla.filter(n=>!n.esAmortizacion&&n.fecha<=e);return a+(s.length>0?s[s.length-1].capitalPendiente:o.capital||0)},0)}function Po(t,e,a,o){const s=t.filter(l=>l.activo&&!l.simulacion&&(l.fechaInicio||"")<=a),n=s.reduce((l,x)=>{if((x.amortizaciones||[]).filter(g=>g.fecha>=e&&g.fecha<=a).length===0)return l;const r=Z(x).totalIntereses,b=Z({...x,amortizaciones:(x.amortizaciones||[]).filter(g=>g.fecha<e||g.fecha>a)}).totalIntereses;return l+Math.max(0,b-r)},0),i=s.filter(l=>l.mostrarFechaFinEnDashboard!==!1).map(l=>({loan:l,fechaFin:Z(l).fechaFin})).filter(l=>!!l.fechaFin&&l.fechaFin>=e&&l.fechaFin<=a),p=s.map(l=>Z(l).tabla),u=l=>{const{desde:x,hasta:v}=ge(l);return p.reduce((r,b)=>{const g=b.find($=>!$.esAmortizacion&&$.fecha>=x&&$.fecha<=v);return r+(g?g.cuota:0)},0)};return{deudaInicio:be(s,e),deudaFin:be(s,a),ahorroIntereses:n,ahorroInteresesMes:o>0?n/o:0,cuotasInicio:u(e.slice(0,7)),cuotasFin:u(a.slice(0,7)),finEnPeriodo:i}}function To(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:xt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function he(t,e=new Set,a="desglosado"){if(e.size===0)return de(t,"gasto");const o=new Map;for(const s of t){if(s.tipo!=="gasto")continue;const n=s.tags||[],i=n.filter(l=>e.has(l)),p=n.filter(l=>!e.has(l)),u=a==="porgrupos"&&i.length>0?i:p;for(const l of u)o.set(l,(o.get(l)||0)+Math.abs(s.cuantia))}return o}function jo(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...he(t,e.grupoTags,e.modo).entries()].filter(([s])=>!a||a.size===0||a.has(s)).map(([s,n])=>({tag:s,total:n/o})).sort((s,n)=>n.total-s.total)}function _o(t,e){const a=e.reduce((o,s)=>o+it(s),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:xt(t.filter(o=>o.tipo==="gasto")),totalIngresos:xt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Eo(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function Do(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function Ro(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}const No=Object.freeze(Object.defineProperty({__proto__:null,cuentasVisibles:Eo,gastoPorTagOrdenado:jo,idsHipoteca:Do,idsPrestamosIniciados:Ro,interesesPorCuenta:To,mesesDelPeriodo:Mo,metricasFlujo:Fo,rangoMes:ge,rangoMesDe:ve,resumenPrestamosPeriodo:Po,sinTransferencias:Co,sumarGastosPorTag:he,totalesPeriodo:_o},Symbol.toStringTag,{value:"Module"}));function qo(t,e,a){const o=t||[];if(!o.length)return e;const s=o.find(i=>i.año===a);if(s)return s.tramos;const n=o.filter(i=>i.año<a).sort((i,p)=>p.año-i.año);return n.length?n[0].tramos:e}function vt(t,e){return a=>qo(t,e,a)}const Ot=7,ye=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],xe=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function ha(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}function $e(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:ye,tramosGananciasCapital:xe,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function Lo(t,e){return{loans:[],expenses:[],accounts:[ha(t)],nominas:[],goals:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],config:$e(t,e)}}const gt=t=>Array.isArray(t)?t:[],ko=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Bt(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function Ie(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function ya(t){const{varianza:e,inflacion:a,...o}=t;return o}function Oo(t,e){const{hoyISO:a,finISO:o}=e,s={...t},n=ko(t.config),p={...$e(a,o)};for(const[x,v]of Object.entries(n))v!=null&&(p[x]=v);delete p.saldoInicial,delete p.saldoInicialFecha,delete p.inflacionGlobal,delete p.showMC,delete p.mcIteraciones,(!Array.isArray(p.tramos_irpf)||p.tramos_irpf.length===0)&&(p.tramos_irpf=ye),(!Array.isArray(p.tramosGananciasCapital)||p.tramosGananciasCapital.length===0)&&(p.tramosGananciasCapital=xe),(!Array.isArray(p.saludRegla)||p.saludRegla.length!==3)&&(p.saludRegla=[50,30,20]),(typeof p.features!="object"||p.features===null||Array.isArray(p.features))&&(p.features={}),s.config=p;let u=gt(t.accounts).map(x=>{const v={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...x};return v.modeloFondo||(v.modeloFondo=v.esFondoPension?"pension":"cuenta"),delete v.esFondoPension,Array.isArray(v.historicoSaldos)||(v.historicoSaldos=[]),Bt(v)});u.length===0&&(u=[ha(a)]);const l=u.filter(x=>x.esCuentaPrincipal);if(l.length===0){const x=u.find(v=>v._id==="default")||u[0];u=u.map(v=>({...v,esCuentaPrincipal:v._id===x._id}))}else if(l.length>1){let x=!1;u=u.map(v=>v.esCuentaPrincipal?x?{...v,esCuentaPrincipal:!1}:(x=!0,v):v)}return s.accounts=u,s.expenses=gt(t.expenses).map(x=>{const v={basico:!1,activo:!0,tags:[],historialPrecios:[],...x};return Array.isArray(v.tags)||(v.tags=[]),Array.isArray(v.historialPrecios)||(v.historialPrecios=[]),v.diaPago=Ie(v.diaPago),ya(Bt(v))}),s.loans=gt(t.loans).map(x=>{const v={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...x};return Array.isArray(v.tags)||(v.tags=[]),v.diaPago=Ie(v.diaPago),v.amortizaciones=gt(v.amortizaciones).map(r=>Bt(r)),ya(Bt(v))}),s.nominas=gt(t.nominas).map(x=>{const v={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...x};return Array.isArray(v.tags)||(v.tags=[]),Array.isArray(v.retribucionFlexible)||(v.retribucionFlexible=[]),ya(Bt(v))}),s.goals=gt(t.goals).map((x,v)=>{const r=Array.isArray(x.cuentaIds)?x.cuentaIds:x.cuentaId?[x.cuentaId]:[],{cuentaId:b,...g}=x;return{prioridad:v+1,completado:!1,usarColchon:!0,targetAmount:0,...g,cuentaIds:r}}),s.inflacion=gt(t.inflacion),s.tramosIRPFHistorico=gt(t.tramosIRPFHistorico),s.tramosGananciasCapitalHistorico=gt(t.tramosGananciasCapitalHistorico),s.escenarios=gt(t.escenarios).map(({inversiones:x,...v})=>v),s}const Pt=t=>Array.isArray(t)?t:[];let xa=0;function Bo(t){return xa+=1,`${t}_${xa.toString(36)}`}const Ho=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Go=t=>typeof t=="number"&&Number.isFinite(t);function Vo(t,e){const a={...t};xa=0;const o=Pt(t.transacciones),s=Pt(t.puntosControl),n=[...s],i=new Set(s.map(l=>`${l.cuentaId}|${l.fecha}`)),p=(l,x,v,r)=>{if(!Ho(x)||!Go(v))return;const b=`${l}|${x}`;i.has(b)||(i.add(b),n.push({_id:Bo("pc"),fecha:x,cuentaId:l,saldoCts:It(v),...typeof r=="string"&&r?{nota:r}:{}}))};for(const l of Pt(t.accounts)){const x=typeof l._id=="string"?l._id:null;if(x)for(const v of Pt(l.historicoSaldos))p(x,v.fecha,v.saldo,v.nota)}const u=Pt(t.history);if(u.length>0){const l=Pt(t.accounts),x=l.find(r=>r.esCuentaPrincipal)||l.find(r=>r.activo)||l[0],v=typeof(x==null?void 0:x._id)=="string"?x._id:"default";for(const r of u){const b=typeof r.cuenta=="string"?r.cuenta:typeof r.cuentaId=="string"?r.cuentaId:v;p(b,r.fecha,r.saldo,r.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=n.sort((l,x)=>String(l.fecha).localeCompare(String(x.fecha))),a}const $a=t=>Array.isArray(t)?t:[],Uo=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Yo=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Ia=0;function Wo(){return Ia+=1,`tx_hp_${Ia.toString(36)}`}function Jo(t,e){const a={...t};Ia=0;const o=[...$a(t.transacciones)],s=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),n=$a(t.expenses).map(i=>{const p=$a(i.historialPrecios),u=typeof i._id=="string"?i._id:null,l=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",x=i.tipo==="ingreso"?"ingreso":"gasto",v=Array.isArray(i.tags)?i.tags.filter(g=>typeof g=="string"):[];if(u)for(const g of p){if(!g||!Uo(g.fecha)||!Yo(g.cuantia))continue;const $=x==="ingreso"?It(g.cuantia):-It(g.cuantia),I=`${u}|${g.fecha}|${$}`;s.has(I)||(s.add(I),o.push({_id:Wo(),fecha:g.fecha,cuentaId:l,importeCts:$,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:v,estimacionId:u,tipo:x,origen:"importado",nota:typeof g.nota=="string"&&g.nota?g.nota:"Importado del historial de precios"}))}const{historialPrecios:r,...b}=i;return b});return a.expenses=n,a.transacciones=o.sort((i,p)=>String(i.fecha).localeCompare(String(p.fecha))),a}const Ko=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Oo},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Vo},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:Jo}],Xo=["history"];function Ae(t,e,a){let o=t;const s=[];for(const n of[...Ko].sort((i,p)=>i.version-p.version))(e??0)>=n.version||(o=n.migrate(o,a),s.push(n.version));return{state:o,applied:s}}const Zt="state_",Aa="state__schemaVersion",we="financeapp_";function Qo(t=localStorage,e=we){const a=o=>`${e}${o}`;return{get(o){try{const s=t.getItem(a(o));return s===null?null:JSON.parse(s)}catch{return null}},set(o,s){try{t.setItem(a(o),JSON.stringify(s))}catch(n){console.error("No se pudo guardar en localStorage:",o,n)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(e)&&o.push(n.slice(e.length))}return o}}}function Zo(t=localStorage,e=we){const a=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(Zt)&&!n.startsWith(e)&&a.push(n)}const o=[];for(const s of a)try{const n=t.getItem(s);n!==null&&t.getItem(`${e}${s}`)===null&&(t.setItem(`${e}${s}`,n),o.push(s)),t.removeItem(s)}catch{}return o}function ts(t){return O(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function as({adapter:t,hoy:e=new Date}){const a=O(e),o=ts(e);let s=Lo(a,o);const n=new Set;let i=[];function p(M){for(const C of n)C(M)}function u(M){t.set(`${Zt}${M}`,s[M])}function l(){const M={};for(const T of Object.keys(s)){const _=t.get(`${Zt}${T}`);_!==null&&(M[T]=_)}for(const T of Xo){const _=t.get(`${Zt}${T}`);_!==null&&(M[T]=_)}const C=t.get(Aa),{state:P,applied:F}=Ae(M,C,{hoyISO:a,finISO:o});if(s=P,x(),F.length>0){for(const T of Object.keys(s))u(T);t.set(Aa,Ot)}return i=F,{applied:F}}function x(){if(!Array.isArray(s.accounts)||s.accounts.length===0){s.accounts=[ha(a)],u("accounts");return}const M=s.accounts.filter(C=>C.esCuentaPrincipal);if(M.length===0)s.accounts=s.accounts.map((C,P)=>P===0?{...C,esCuentaPrincipal:!0}:C),u("accounts");else if(M.length>1){let C=!1;s.accounts=s.accounts.map(P=>P.esCuentaPrincipal?C?{...P,esCuentaPrincipal:!1}:(C=!0,P):P),u("accounts")}}function v(M){return s[M]}function r(M,C){s[M]=C,u(M),p(M)}function b(M){r("config",{...s.config,...M})}function g(M){return n.add(M),()=>n.delete(M)}function $(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function I(M,C){const P=[...s[M]],F={...C,_id:$()};return P.push(F),r(M,P),F}function m(M,C,P){const F=s[M].map(T=>T._id===C?{...T,...P}:T);r(M,F)}function d(M,C){const P=s[M].filter(F=>F._id!==C);r(M,P)}function f(){const M=s.accounts||[],C=M.find(P=>P.esCuentaPrincipal&&P.activo)||M.find(P=>P.activo);return C?C._id:"default"}function A(M){var C;return((C=s.accounts.find(P=>P._id===M))==null?void 0:C.nombre)??M}function h(){return vt(s.tramosIRPFHistorico,s.config.tramos_irpf)}function y(){return vt(s.tramosGananciasCapitalHistorico,s.config.tramosGananciasCapital)}function w(){return structuredClone(s)}function S(M,C=null){const{state:P,applied:F}=Ae(M,C,{hoyISO:a,finISO:o});s=P,x();for(const T of Object.keys(s))u(T);t.set(Aa,Ot);for(const T of Object.keys(s))p(T);return{applied:F}}return{load:l,get:v,set:r,patchConfig:b,subscribe:g,addItem:I,updateItem:m,removeItem:d,getPrincipalAccountId:f,accountName:A,resolverTramosIRPF:h,resolverTramosGanancias:y,snapshot:w,replaceAll:S,get schemaVersion(){return Ot},get migrationsApplied(){return[...i]},get today(){return a||V()}}}const Y={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},$t=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:Y.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:Y.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:Y.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:Y.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:Y.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro",descripcion:"Metas con importe y fecha, con proyección de cumplimiento.",grupo:Y.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:Y.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:Y.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:Y.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:Y.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:Y.planificacion,porDefecto:!1},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:Y.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:Y.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"salud-financiera",nombre:"Salud financiera",descripcion:"Tasa de ahorro, ratio de endeudamiento y regla 50/30/20 con semáforos.",grupo:Y.analisis,porDefecto:!0},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:Y.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:Y.analisis,porDefecto:!0},{id:"flujo-mensual",nombre:"Flujo de caja mensual",descripcion:"Entradas y salidas mes a mes del periodo analizado.",grupo:Y.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:Y.analisis,porDefecto:!0},{id:"desviacion",nombre:"Desviación real vs estimado",descripcion:"Compara el saldo real registrado con el proyectado en cada fecha.",grupo:Y.analisis,porDefecto:!0,dependencias:["contabilidad"]},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:Y.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:Y.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:Y.datos,porDefecto:!1,dependencias:["sync-nube"]}],es=new Map($t.map(t=>[t.id,t]));function Ht(t){return es.get(t)}function Se(t){return $t.filter(e=>(e.dependencias||[]).includes(t))}function wa(){const t={};for(const e of $t)t[e.id]=e.porDefecto;return t}function Me(){const t=[],e=new Map;for(const a of $t)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function os(t){function e(){return{...wa(),...t.get("config").features||{}}}function a(v){t.patchConfig({features:v})}function o(v,r=e(),b=new Set){const g=Ht(v);if(!g)return!1;if(g.nucleo)return!0;if(r[v]===!1)return!1;if(b.has(v))return!0;b.add(v);for(const $ of g.dependencias||[])if(!o($,r,b))return!1;return!0}function s(v,r=e()){const b=Ht(v);return b?(b.dependencias||[]).filter(g=>!o(g,r)):[]}function n(v,r){var f;const b=Ht(v);if(!b)return{cambiadas:[]};if(b.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const g=e(),$=new Map($t.map(A=>[A.id,o(A.id,g)])),I={...g,[v]:r};let m;if(r){const A=[...b.dependencias||[]];for(;A.length;){const h=A.pop();I[h]===!1&&(I[h]=!0,m="dependencias-activadas"),A.push(...((f=Ht(h))==null?void 0:f.dependencias)||[])}}else{const A=Se(v).map(h=>h.id);for(;A.length;){const h=A.pop();I[h]!==!1&&(I[h]=!1,m="cascada-apagado"),A.push(...Se(h).map(y=>y.id))}}return a(I),{cambiadas:$t.filter(A=>o(A.id,I)!==$.get(A.id)).map(A=>A.id),motivo:m}}function i(){const v=e();return $t.map(r=>{const b=s(r.id,v);return{...r,activa:o(r.id,v),...b.length>0&&v[r.id]!==!1?{bloqueadaPor:b}:{}}})}function p(){const v=e();return Me().map(({grupo:r,features:b})=>({grupo:r,features:b.map(g=>{const $=s(g.id,v);return{...g,activa:o(g.id,v),...$.length>0&&v[g.id]!==!1?{bloqueadaPor:$}:{}}})}))}function u(){a(wa())}function l(v){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...v?{nombre:v}:{},features:e()}}function x(v){const r=v,b=r&&typeof r=="object"&&r.features&&typeof r.features=="object"?r.features:null;if(!b)throw new Error('El perfil no tiene una sección "features" válida');const g=wa(),$=[],I=[];for(const[m,d]of Object.entries(b)){if(!Ht(m)){I.push(m);continue}if(typeof d!="boolean"){I.push(m);continue}g[m]=d,$.push(m)}return a(g),{aplicadas:$,ignoradas:I}}return{isEnabled:v=>o(v),setEnabled:n,estado:i,estadoPorGrupo:p,reset:u,exportProfile:l,importProfile:x,bloqueadaPor:v=>s(v)}}const Gt=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Tt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function ss(t){var s,n;const a=(((s=t.bloqueadaPor)==null?void 0:s.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(n=t.bloqueadaPor)==null?void 0:n.map(Gt).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${Gt(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${Gt(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${Gt(t.descripcion)}</div>
        ${a}
      </div>
    </div>`}function ns(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:s})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Gt(o)}</div>
        ${s.map(ss).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function is(t){var s;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-feature-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function rs(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${ns(a)}`,s(i)}function s(i){var u,l,x;i.querySelectorAll("[data-feature-toggle]").forEach(v=>{v.addEventListener("change",()=>{var g;const r=v.dataset.featureToggle,b=a.setEnabled(r,v.checked);b.motivo==="dependencias-activadas"&&Tt(t,"Se han activado también las funcionalidades necesarias"),b.motivo==="cascada-apagado"&&Tt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(g=t.onChange)==null||g.call(t,b.cambiadas),o(i)})});const p=i.querySelector("[data-feature-file]");(u=i.querySelector('[data-feature-action="export"]'))==null||u.addEventListener("click",()=>{const v=a.exportProfile(),r=new Blob([JSON.stringify(v,null,2)],{type:"application/json"}),b=URL.createObjectURL(r),g=e.createElement("a");g.href=b,g.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,g.click(),URL.revokeObjectURL(b),Tt(t,"Perfil de funcionalidades guardado")}),(l=i.querySelector('[data-feature-action="import"]'))==null||l.addEventListener("click",()=>p==null?void 0:p.click()),p==null||p.addEventListener("change",async()=>{var r,b;const v=(r=p.files)==null?void 0:r[0];if(v)try{const{aplicadas:g,ignoradas:$}=a.importProfile(JSON.parse(await v.text()));Tt(t,$.length>0?`Perfil cargado (${g.length} aplicadas, ${$.length} ignoradas por ser de otra versión)`:`Perfil cargado (${g.length} funcionalidades)`),(b=t.onChange)==null||b.call(t,g),o(i)}catch(g){Tt(t,"No se pudo cargar el perfil: "+g.message,"err")}finally{p.value=""}}),(x=i.querySelector('[data-feature-action="reset"]'))==null||x.addEventListener("click",()=>{var v;a.reset(),Tt(t,"Funcionalidades restablecidas"),(v=t.onChange)==null||v.call(t,[]),o(i)})}function n(){const i=is(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:n,renderInto:o}}const Ce={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function cs({flags:t,document:e=document,router:a,rutasExtra:o}){function s(){const i=e.querySelector(".nav-btn.active[data-view]");return(i==null?void 0:i.dataset.view)??null}function n(){let i=!1;const p=Object.entries((o==null?void 0:o())??{}).map(([u,l])=>[l,u]);for(const[u,l]of[...Object.entries(Ce),...p]){const x=t.isEnabled(u),v=e.querySelector(`.nav-btn[data-view="${l}"]`);v&&(v.style.display=x?"":"none"),!x&&s()===l&&(i=!0)}if(e.querySelectorAll(".nav-section").forEach(u=>{const l=[...u.querySelectorAll(".nav-btn[data-view]")];if(l.length===0)return;const x=l.some(v=>v.style.display!=="none");u.style.display=x?"":"none"}),i){const u=a??globalThis.Router;u==null||u.navigate("dashboard")}}return{apply:n,vistaPara:i=>Ce[i]}}function ls({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function s(g){return`view-${g}`}function n(g){const $=t.getElementById(s(g.route));if($)return $;const I=t.querySelector(".view-container");if(!I)return null;const m=t.createElement("div");return m.id=s(g.route),m.className="view hidden",I.appendChild(m),m}function i(g){if(t.querySelector(`.nav-btn[data-view="${g.route}"]`))return;const $=t.querySelectorAll(".nav-section"),I=$[g.seccion??Math.max(0,$.length-1)];if(!I)return;const m=t.createElement("button");m.className="nav-btn",m.dataset.view=g.route,m.innerHTML=`${g.iconoPath?`<svg viewBox="0 0 24 24"><path d="${g.iconoPath}"/></svg>`:""}<span>${g.nombre}</span>`,I.appendChild(m),m.addEventListener("click",()=>{const d=globalThis.Router;d==null||d.navigate(g.route)})}function p(g){a.set(g.route,g),n(g),i(g)}function u(){return[...a.keys()].filter(g=>{const $=a.get(g);return!e||e($.flagId??$.id)})}function l(g){return u().includes(g)}function x(g){const $=a.get(g);if(!$||e&&!e($.flagId??$.id))return!1;const I=n($);if(!I)return!1;if(o&&o!==g){const m=a.get(o),d=t.getElementById(s(o));m!=null&&m.unmount&&d&&m.unmount(d)}return $.mount(I),o=g,!0}function v(){o&&x(o)}function r(){const g={};for(const[$,I]of a)g[$]=I.flagId??I.id;return g}function b(){for(const g of a.values())n(g),i(g)}return{register:p,routes:u,has:l,mount:x,rerender:v,flagPorRuta:r,attachToShell:b,get activa(){return o}}}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function jt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${c(z(t))}</span>`}function ze(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function Fe(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${c(e)}</span>`).join(" ")}const ds=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function us(t){const[e,a]=t.split("-").map(Number);return`${ds[a-1]} ${e}`}function E(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function tt(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function j(t,e,a){t.addEventListener("click",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(e);s&&t.contains(s)&&a(s,o)})}function W(t,e,a){t.addEventListener("change",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(e);s&&t.contains(s)&&a(s,o)})}function ut(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function Pe(t,e){const a=parseFloat(ut(t,e));return Number.isFinite(a)?a:0}function ps(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function ms(t,e){const{ledger:a}=t,o=(t.hoy??V)(),s=t.accounts().filter(d=>d.activo),{desde:n,hasta:i}=ps(e.mes),p={cuentaId:e.cuentaId||void 0,desde:n,hasta:i,texto:e.filtroTexto||void 0},u=a.transacciones(p),l=t.estimaciones().filter(d=>d.tipo!=="transferencia"),x=u.filter(d=>d.importeCts<0).reduce((d,f)=>d+f.importeCts,0),v=u.filter(d=>d.importeCts>0).reduce((d,f)=>d+f.importeCts,0),r=e.cuentaId?a.saldoCuenta(e.cuentaId,i):a.saldoTotal(i),b=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),g=s.map(d=>`<option value="${c(d._id)}"${d._id===e.cuentaId?" selected":""}>${c(d.nombre)}</option>`).join(""),$=d=>'<option value="">— sin asignar —</option>'+l.map(f=>`<option value="${c(f._id)}"${f._id===d?" selected":""}>${c(f.concepto)} (${c(z(f.cuantia))})</option>`).join(""),I=u.map(d=>{var f;return`
      <tr data-tx="${c(d._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${c(d.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${c(d.concepto)}</td>
        <td style="padding:7px 8px">${Fe(d.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${c(((f=t.accounts().find(A=>A._id===d.cuentaId))==null?void 0:f.nombre)??d.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${c(d._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${$(d.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${jt(ot(d.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${c(d._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${c(d._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),m=b.slice().reverse().slice(0,8).map(d=>{var f;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${c(d.fecha)}</span>
        <span style="color:var(--text3)">${c(((f=t.accounts().find(A=>A._id===d.cuentaId))==null?void 0:f.nombre)??d.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${c(z(ot(d.saldoCts)))}</span>
        ${d.nota?`<span style="color:var(--text3)">${c(d.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${c(d._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="card-title">Movimientos reales</div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${g}</select>
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">Mes</label>
            <input class="form-input" type="month" id="acc-mes" value="${c(e.mes)}" style="width:140px"/>
          </div>
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${c(e.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${jt(ot(x))}</span>
          <span>Ingresos: ${jt(ot(v))}</span>
          <span>Neto: ${jt(ot(v+x))}</span>
          <span style="margin-left:auto">Saldo a ${c(i)}: <strong>${c(z(r))}</strong></span>
        </div>

        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="background:var(--bg3)">
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Fecha</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Concepto</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Etiquetas</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Cuenta</th>
                <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Estimación relacionada</th>
                <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Importe</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${I||'<tr><td colspan="7" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="card mb-14">
          <div class="card-title">Registrar movimiento</div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="nt-fecha" value="${c(o)}"/></div>
            <div class="form-group"><label class="form-label">Tipo</label>
              <select class="form-input" id="nt-tipo">
                <option value="gasto">Gasto</option>
                <option value="ingreso">Ingreso</option>
                <option value="ajuste">Ajuste</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label class="form-label">Concepto</label><input class="form-input" type="text" id="nt-concepto" placeholder="Compra supermercado"/></div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Importe (€)</label><input class="form-input" type="number" id="nt-importe" step="0.01" min="0" placeholder="0,00"/></div>
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${g}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(d=>`<option value="${c(d)}"></option>`).join("")}</datalist>
          </div>
          <div class="form-group">
            <label class="form-label">Estimación relacionada</label>
            <select class="form-input" id="nt-estimacion">${$(null)}</select>
            <div class="text-sm mt-4" style="color:var(--text3)">Si la dejas sin asignar, se relaciona por etiqueta.</div>
          </div>
          <button class="btn-primary full-width" id="nt-guardar">Registrar</button>
        </div>

        <div class="card">
          <div class="card-title">Saldo real conocido</div>
          <div class="text-sm mb-8" style="color:var(--text2)">
            Ancla el histórico: el saldo de cualquier fecha se calcula desde el último punto
            de control más los movimientos posteriores. Si el banco dice otra cosa, manda el punto.
          </div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="pc-fecha" value="${c(o)}"/></div>
            <div class="form-group"><label class="form-label">Saldo (€)</label><input class="form-input" type="number" id="pc-saldo" step="0.01" placeholder="0,00"/></div>
          </div>
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${g}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${m?`<div class="mt-12">${m}</div>`:""}
        </div>
      </div>
    </div>`}function fs(t,e,a,o){const{ledger:s}=e;W(t,"#acc-cuenta",i=>{a.cuentaId=i.value,o()}),W(t,"#acc-mes",i=>{a.mes=i.value||a.mes,o()});const n=t.querySelector("#acc-buscar");n==null||n.addEventListener("input",()=>{a.filtroTexto=n.value,clearTimeout(n._t),n._t=window.setTimeout(o,200)}),j(t,"#nt-guardar",()=>{const i=ut(t,"#nt-concepto").trim(),p=Pe(t,"#nt-importe");if(!i)return E("Indica un concepto","err");if(!(p>0))return E("Indica un importe mayor que cero","err");const u=ut(t,"#nt-tags").split(",").map(l=>l.trim().toLowerCase()).filter(Boolean);s.registrar({fecha:ut(t,"#nt-fecha")||(e.hoy??V)(),cuentaId:ut(t,"#nt-cuenta"),importe:p,concepto:i,tags:u,tipo:ut(t,"#nt-tipo"),estimacionId:ut(t,"#nt-estimacion")||null}),E("Movimiento registrado"),e.onDatosCambiados(),o()}),j(t,"[data-tx-borrar]",i=>{const p=i.dataset.txBorrar;tt("¿Eliminar este movimiento?")&&(s.eliminar(p),E("Movimiento eliminado"),e.onDatosCambiados(),o())}),j(t,"[data-tx-editar]",i=>{const p=i.dataset.txEditar,u=s.transacciones().find(v=>v._id===p);if(!u)return;const l=window.prompt(`Importe de "${u.concepto}" (€)`,String(Math.abs(ot(u.importeCts))));if(l===null)return;const x=parseFloat(l.replace(",","."));if(!Number.isFinite(x)||x<=0)return E("Importe no válido","err");s.actualizar(p,{importe:x}),E("Movimiento actualizado"),e.onDatosCambiados(),o()}),W(t,"[data-tx-estimacion]",i=>{const p=i.getAttribute("data-tx-estimacion");s.asignarEstimacion(p,i.value||null),E("Asignación actualizada"),e.onDatosCambiados()}),j(t,"#pc-guardar",()=>{if(ut(t,"#pc-saldo").trim()==="")return E("Indica el saldo","err");const p=Pe(t,"#pc-saldo");s.registrarPuntoControl(ut(t,"#pc-cuenta"),ut(t,"#pc-fecha")||(e.hoy??V)(),p,ut(t,"#pc-nota").trim()||void 0),E("Saldo real registrado"),e.onDatosCambiados(),o()}),j(t,"[data-pc-borrar]",i=>{tt("¿Eliminar este punto de control?")&&(s.eliminarPuntoControl(i.dataset.pcBorrar),E("Punto de control eliminado"),e.onDatosCambiados(),o())})}function Te(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:s=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const n=st(t.mediaRealReciente),i=st(n-e),p=e!==0?i/Math.abs(e)*100:n!==0?100:0;if(Math.abs(p)<s)return null;const u=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:st(e),cuantiaSugerida:n,diferencia:i,variacionPct:p,precision:t.precision,mesesConsiderados:u,motivo:i>0?`El gasto real de los últimos ${u} meses supera lo estimado`:`El gasto real de los últimos ${u} meses es inferior a lo estimado`}}function vs(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(n,i,p={}){const u=p.hoy??V(),l=t.get("expenses"),x=l.find(g=>g._id===n);if(!x)throw new Error(`La estimación ${n} no existe`);const v={...x,fechaFin:u},r={...x,_id:e(),cuantia:st(i),fechaInicio:u,fechaFin:x.fechaFin??null,ajustadaDesdeId:x._id,ajustadaEn:u},b=l.map(g=>g._id===n?v:g);return b.push(r),t.set("expenses",b),{estimacionCerrada:v,estimacionNueva:r}}function o(n,i={}){const p=[],u=[];for(const l of n)try{p.push(a(l.estimacionId,l.cuantiaSugerida,i))}catch(x){u.push({estimacionId:l.estimacionId,error:x.message})}return{aplicadas:p,errores:u}}function s(n){const i=t.get("expenses"),p=new Map(i.map($=>[$._id,$])),u=p.get(n);if(!u)return[];const l=[];let x=u;const v=new Set;for(;x!=null&&x.ajustadaDesdeId&&!v.has(x._id);){v.add(x._id);const $=p.get(x.ajustadaDesdeId);if(!$)break;l.unshift($),x=$}const r=[];let b=u;const g=new Set([u._id]);for(;;){const $=i.find(I=>I.ajustadaDesdeId===b._id&&!g.has(I._id));if(!$)break;g.add($._id),r.push($),b=$}return[...l,u,...r]}return{aplicar:a,aplicarTodas:o,cadena:s}}function Sa(t){const e=t.estimaciones(),a=new Map(e.map(o=>[o._id,o]));return t.precision.analizarTodas(e).map(o=>{const s=a.get(o.estimacionId);return{analisis:o,estimacion:s,sugerencia:Te(o,s.cuantia)}}).filter(o=>!!o.estimacion)}function gs(t){const e=Sa(t),a=e.filter(u=>u.analisis.precision!==null),o=e.filter(u=>u.sugerencia!==null),s=t.precision.analizarPorTag(e.map(u=>u.analisis));if(a.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const n=a.map(({analisis:u,estimacion:l,sugerencia:x})=>{const v=u.meses.slice(-6).map(r=>`${us(r.mes)}: ${z(r.estimado)} → ${z(r.real)} (${r.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${c(l.concepto)}</div>
          <div style="margin-top:3px">${Fe(u.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${c(v)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(z(u.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(z(u.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${jt(u.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${ze(u.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${x?`<button class="btn-secondary" data-sugerir="${c(u.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${c(x.motivo)}">Sugerir ajuste → ${c(z(x.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=s.map(u=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${c(u.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${u.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(z(u.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(z(u.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${jt(u.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${ze(u.precision)}</td>
      </tr>`).join(""),p=(u,l="left")=>`<th style="padding:7px 8px;text-align:${l};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${u}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Precisión de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm mb-10" style="color:var(--text2);line-height:1.6">
        Se comparan solo los meses ya cerrados que tengan movimientos reales. Al ajustar, la
        estimación actual se cierra hoy y se crea su continuación con el importe corregido:
        el pasado se mantiene tal como lo estimaste.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg3)">
            ${p("Estimación")}${p("Estimado","right")}${p("Real","right")}${p("Desviación","right")}${p("Precisión","right")}${p("","right")}
          </tr></thead>
          <tbody>${n}</tbody>
        </table>
      </div>
    </div>

    <div class="card mb-14">
      <div class="card-title">Precisión conjunta por etiqueta</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg3)">
            ${p("Etiqueta")}${p("Estimaciones","right")}${p("Estimado","right")}${p("Real","right")}${p("Desviación","right")}${p("Precisión","right")}
          </tr></thead>
          <tbody>${i||'<tr><td colspan="6" style="padding:14px;text-align:center;color:var(--text2);font-size:13px">Sin etiquetas comparables.</td></tr>'}</tbody>
        </table>
      </div>
    </div>`}function bs(t,e,a){j(t,"[data-sugerir]",o=>{const s=o.dataset.sugerir,n=Sa(e).find(u=>u.analisis.estimacionId===s);if(!(n!=null&&n.sugerencia))return;const i=n.sugerencia,p=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${z(i.cuantiaActual)}
Nueva estimación: ${z(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;tt(p)&&(e.adjuster.aplicar(s,i.cuantiaSugerida,{hoy:e.hoy()}),E(`Estimación ajustada a ${z(i.cuantiaSugerida)}`),e.onDatosCambiados(),a())}),j(t,"#ajustar-todas",()=>{const o=Sa(e).map(p=>p.sugerencia).filter(p=>p!==null);if(o.length===0)return;const s=o.map(p=>`• ${p.concepto}: ${z(p.cuantiaActual)} → ${z(p.cuantiaSugerida)}`).join(`
`);if(!tt(`Se van a ajustar ${o.length} estimaciones:

${s}

¿Continuar?`))return;const{aplicadas:n,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});E(i.length>0?`${n.length} ajustadas, ${i.length} con error`:`${n.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const hs="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function ys(t){const e={cuentaId:"",mes:(t.hoy??V)().slice(0,7),filtroTexto:""},a=()=>{var p;return(p=t.onDatosCambiados)==null?void 0:p.call(t)},o=t.hoy??V,s={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:a,hoy:o},n={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:a,hoy:o};function i(p){const u=t.ledger.saldoTotal(o()),l=t.ledger.ultimaFecha(),x=t.ledger.transacciones().length;p.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Contabilidad <span>real</span></h1>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--accent)">
        📒 Lo que registras aquí es el <strong>histórico real</strong>: manda sobre las
        estimaciones para el pasado. Las estimaciones siguen proyectando el futuro, y con
        estos datos puedes medir su acierto y ajustarlas.
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin-bottom:14px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Saldo real hoy</div>
          <div class="stat-value" style="font-size:1.3rem">${c(z(u))}</div>
          <div style="font-size:11px;color:var(--text3)">suma de cuentas activas</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Movimientos registrados</div>
          <div class="stat-value" style="font-size:1.3rem">${x}</div>
          <div style="font-size:11px;color:var(--text3)">${l?`último: ${c(l)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-transacciones"></div>
      <div id="acc-precision"></div>`;const v=p.querySelector("#acc-transacciones"),r=p.querySelector("#acc-precision");v.innerHTML=ms(s,e),r.innerHTML=gs(n);const b=()=>i(p);fs(v,s,e,b),bs(r,n,b)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:hs,mount:i}}const xs="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Ma(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function $s(t){const{store:e}=t,a=t.hoy??V,o=()=>N(a()),s=()=>e.get("config").margenesSeguridad??[];function n(b){var g;e.patchConfig({margenesSeguridad:b}),(g=t.onDatosCambiados)==null||g.call(t)}function i(b,g){const $=s().map(m=>({...m,puntos:(m.puntos??[]).map(d=>({...d}))})),I=$.find(m=>m._id===b);I&&(g(I),n($))}function p(b){const g=e.get("config"),$=Qt(b,e.get("expenses"),g,e.get("loans"),a(),!1,o());return z($)}function u(b,g,$){const I=g.tipo==="fijo",m=I?"":`<span class="text-sm" style="color:var(--text3)">${c(z((g.meses??0)*$))}</span>`;return`
      <tr data-punto="${c(g._id)}" data-margen="${c(b._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${c(g.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${I?" selected":""}>Fijo €</option>
            <option value="meses"${I?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${I?`<input type="number" class="form-input" style="width:90px" value="${g.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${I?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${g.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${m}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function l(b,g,$){const I=b.cuentas&&b.cuentas.length>0?b.cuentas.map(A=>{var h;return((h=g.find(y=>y._id===A))==null?void 0:h.nombre)??A}).join(", "):"Todas las cuentas activas",d=[...b.puntos??[]].sort((A,h)=>A.fecha.localeCompare(h.fecha)).map(A=>u(b,A,$)).join(""),f=b.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${c(I)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${c(p(b))}</strong>
      </div>
      <div class="mt-8" style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="color:var(--text3);text-align:left;border-bottom:1px solid var(--border)">
              <th style="padding:4px 6px;font-weight:500">Fecha</th>
              <th style="padding:4px 6px;font-weight:500">Tipo</th>
              <th style="padding:4px 6px;font-weight:500">Importe €</th>
              <th style="padding:4px 6px;font-weight:500">Meses</th>
              <th style="padding:4px 6px;font-weight:500">Equiv. €</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${d||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${c(b._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${c(b.nombre)}</span>
            <span class="badge ${b.activo?"badge-active":"badge-inactive"}">${b.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${b.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${b.activo?"checked":""} data-toggle-margen="${c(b._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${c(b._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${c(b._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${f}
      </div>`}function x(b,g){const $=g?s().find(f=>f._id===g):null,I=e.get("accounts").filter(f=>f.activo),m=new Set(($==null?void 0:$.cuentas)??[]),d=I.map(f=>`
        <label class="tag" data-chip="${c(f._id)}" style="cursor:pointer;${m.has(f._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${c(f._id)}" ${m.has(f._id)?"checked":""} style="display:none"/>
          ${c(f.nombre)}
        </label>`).join(" ");b.innerHTML=`
      <div class="modal-title">${g?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${c(($==null?void 0:$.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${d||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${$?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${c(V())}"/></div>
          <div class="form-group"><label class="form-label">Tipo</label>
            <select class="form-input" id="mg-p-tipo">
              <option value="fijo">Fijo €</option>
              <option value="meses">Meses de gastos básicos</option>
            </select>
          </div>
        </div>
        <div class="form-group" id="mg-p-importe-wrap"><label class="form-label">Importe (€)</label><input class="form-input" type="number" id="mg-p-importe" value="0" min="0"/></div>
        <div class="form-group" id="mg-p-meses-wrap" style="display:none"><label class="form-label">Nº meses</label><input class="form-input" type="number" id="mg-p-meses" value="1" min="0" step="0.5"/></div>
      </div>`}
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar-form>Cancelar</button>
        <button class="btn-primary" data-guardar-margen="${c(g??"")}">Guardar</button>
      </div>`}function v(b,g){const $=document.getElementById("modal-overlay"),I=document.getElementById("modal-content");!$||!I||(x(I,b),$.classList.remove("hidden"),W(I,".mg-acc-chip",m=>{const d=m,f=I.querySelector(`[data-chip="${d.value}"]`);f&&(f.style.cssText=`cursor:pointer;${d.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),W(I,"#mg-p-tipo",m=>{const d=m.value==="fijo",f=I.querySelector("#mg-p-importe-wrap"),A=I.querySelector("#mg-p-meses-wrap");f&&(f.style.display=d?"":"none"),A&&(A.style.display=d?"none":"")}),j(I,"[data-cerrar-form]",()=>$.classList.add("hidden")),j(I,"[data-guardar-margen]",m=>{var y,w,S,M,C;const d=m.getAttribute("data-guardar-margen")||"",f=((y=I.querySelector("#mg-nombre"))==null?void 0:y.value.trim())??"";if(!f)return E("El nombre es obligatorio","err");const A=[...I.querySelectorAll(".mg-acc-chip:checked")].map(P=>P.value),h=s().map(P=>({...P}));if(d){const P=h.findIndex(F=>F._id===d);if(P===-1)return E("Margen no encontrado","err");h[P]={...h[P],nombre:f,cuentas:A}}else{const P=((w=I.querySelector("#mg-p-tipo"))==null?void 0:w.value)??"fijo",F={_id:Ma(),fecha:((S=I.querySelector("#mg-p-fecha"))==null?void 0:S.value)||V(),tipo:P,importe:parseFloat(((M=I.querySelector("#mg-p-importe"))==null?void 0:M.value)??"0")||0,meses:parseFloat(((C=I.querySelector("#mg-p-meses"))==null?void 0:C.value)??"1")||1};h.push({_id:Ma(),nombre:f,activo:!0,cuentas:A,puntos:[F]})}n(h),E(d?"Margen actualizado":"Margen creado"),$.classList.add("hidden"),g()}))}function r(b){const g=s(),$=e.get("accounts"),I=kt(e.get("expenses"),o());b.innerHTML=`
      <div class="page-header">
        <div>
          <h1 class="page-title">Márgenes de <span>seguridad</span></h1>
          <p class="text-sm" style="color:var(--text3);margin:4px 0 0">
            Umbrales de saldo mínimo por cuenta o grupo de cuentas. El dashboard avisa cuando la
            proyección los cruza, y el optimizador de amortizaciones los respeta.
          </p>
        </div>
        <button class="btn-primary" data-nuevo-margen>+ Añadir margen</button>
      </div>
      ${g.length===0?`<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`:g.map(d=>l(d,$,I)).join("")}`;const m=()=>r(b);j(b,"[data-nuevo-margen]",()=>v(null,m)),j(b,"[data-editar-margen]",d=>v(d.getAttribute("data-editar-margen"),m)),j(b,"[data-borrar-margen]",d=>{tt("¿Eliminar este margen de seguridad?")&&(n(s().filter(f=>f._id!==d.getAttribute("data-borrar-margen"))),E("Margen eliminado"),m())}),W(b,"[data-toggle-margen]",d=>{const f=d.getAttribute("data-toggle-margen");i(f,A=>{A.activo=d.checked}),m()}),j(b,"[data-add-punto]",d=>{const f=d.getAttribute("data-add-punto");i(f,A=>{A.puntos=[...A.puntos??[],{_id:Ma(),fecha:V(),tipo:"fijo",importe:0,meses:1}]}),m()}),j(b,"[data-borrar-punto]",d=>{const f=d.closest("[data-punto]");if(!f)return;const A=f.dataset.margen,h=f.dataset.punto;i(A,y=>{y.puntos=(y.puntos??[]).filter(w=>w._id!==h)}),m()}),W(b,"[data-campo]",d=>{const f=d.closest("[data-punto]");if(!f)return;const A=d.getAttribute("data-campo"),h=d.value;i(f.dataset.margen,y=>{const w=(y.puntos??[]).find(S=>S._id===f.dataset.punto);w&&(A==="fecha"?w.fecha=h:A==="tipo"?w.tipo=h:A==="importe"?w.importe=parseFloat(h)||0:w.meses=parseFloat(h)||0)}),m()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:xs,mount:r}}const Is="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function As(t){const e=Array.isArray(t)?t[1]??[]:[];return Array.isArray(e)?e.filter(a=>a&&a.value!==null&&a.value!==void 0&&Number.isFinite(Number(a.value))).map(a=>({year:parseInt(a.date),tasa:parseFloat(Number(a.value).toFixed(2))})).filter(a=>Number.isFinite(a.year)).sort((a,o)=>a.year-o.year):[]}function ws({fetchImpl:t,url:e=Is}={}){let a=null,o=!1;async function s(n=!1){if(a&&!n)return a;if(o)return null;o=!0;try{const p=await(t??fetch)(e);if(!p.ok)throw new Error(`HTTP ${p.status}`);return a=As(await p.json()),a}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:s,invalidar:()=>{a=null},get enCache(){return a}}}const Ss="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function Ms(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function Cs(t){const{store:e}=t,a=t.ipc??ws(),o=()=>e.get("inflacion")??[];function s(){var v;(v=t.onDatosCambiados)==null||v.call(t)}function n(v,r){if(!v||v.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const b=new Set(o().map(d=>d.year)),g=v.filter(d=>d.year>=r).reverse(),$=g.filter(d=>!b.has(d.year)).length,I=[...new Set(v.map(d=>d.year))].sort((d,f)=>d-f),m=g.map(d=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${d.year}" data-tasa="${d.tasa}" ${b.has(d.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${d.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${Ms(d.tasa)}">${d.tasa.toFixed(2)}%</span>
          ${b.has(d.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${I.map(d=>`<option value="${d}"${d===r?" selected":""}>${d}</option>`).join("")}
        </select>
        <span style="font-size:10px;color:var(--text3)">
          Fuente: Banco Mundial · FP.CPI.TOTL.ZG · ${v[0].year}–${v[v.length-1].year}
        </span>
        <button class="btn-secondary btn-sm" data-ipc-recargar title="Forzar recarga desde la API">↺</button>
      </div>
      <div style="max-height:300px;overflow-y:auto;margin-bottom:12px">${m}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="font-size:12px;color:var(--text3)">${$} periodo${$!==1?"s":""} nuevo${$!==1?"s":""} disponible${$!==1?"s":""}</span>
        <div class="flex gap-8">
          <button class="btn-secondary" data-ipc-cerrar>Cancelar</button>
          <button class="btn-primary" data-ipc-importar ${$===0?"disabled":""}>↓ Importar seleccionados</button>
        </div>
      </div>`}function i(v){return!v||v.length===0?2e3:Math.max(v[0].year,new Date().getFullYear()-25)}async function p(v){const r=document.getElementById("modal-overlay"),b=document.getElementById("modal-content");if(!r||!b)return;b.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,r.classList.remove("hidden");const g=(I,m)=>{const d=document.getElementById("ipc-body");d&&(d.innerHTML=n(I,m))},$=await a.obtener();g($,i($)),j(b,"[data-ipc-cerrar]",()=>r.classList.add("hidden")),W(b,"#ipc-desde",I=>{g(a.enCache,parseInt(I.value))}),j(b,"[data-ipc-recargar]",()=>{a.invalidar();const I=document.getElementById("ipc-body");I&&(I.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),a.obtener(!0).then(m=>g(m,i(m)))}),j(b,"[data-ipc-importar]",()=>{const I=[...b.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(I.length===0)return E("Nada seleccionado","err");const m=new Set(o().map(f=>f.year));let d=0;for(const f of I){const A=parseInt(f.dataset.year??""),h=parseFloat(f.dataset.tasa??"");!Number.isFinite(A)||!Number.isFinite(h)||m.has(A)||(e.addItem("inflacion",{year:A,tasa:h}),m.add(A),d++)}r.classList.add("hidden"),E(`${d} periodo${d!==1?"s":""} importado${d!==1?"s":""} correctamente`),s(),v()})}function u(v,r){var m;const b=document.getElementById("modal-overlay"),g=document.getElementById("modal-content");if(!b||!g)return;const $=v?o().find(d=>d._id===v):null;g.innerHTML=`
      <div class="modal-title">${v?"Editar periodo de inflación":"Nuevo periodo de inflación"}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Año</label>
          <input class="form-input" type="number" id="inf-year" value="${($==null?void 0:$.year)??new Date().getFullYear()}" placeholder="2026"/></div>
        <div class="form-group"><label class="form-label">Tasa anual (%)</label>
          <input class="form-input" type="number" id="inf-tasa" step="0.01" value="${($==null?void 0:$.tasa)??""}" placeholder="3.5"/></div>
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-inf-cerrar>Cancelar</button>
        <button class="btn-primary" data-inf-guardar="${c(v??"")}">Guardar</button>
      </div>`,b.classList.remove("hidden");const I=()=>{var y;const d=parseFloat(((y=g.querySelector("#inf-tasa"))==null?void 0:y.value)??""),f=g.querySelector("#inf-preview");if(!f)return;if(!Number.isFinite(d)||d<=0){f.innerHTML="";return}const A=(Math.pow(1+d/100,1/12)-1)*100,h=Math.pow(1+d/100,5);f.innerHTML=`Con un ${d}% anual: <strong>${A.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${h.toFixed(3)}</strong> (+${((h-1)*100).toFixed(1)}%)`};(m=g.querySelector("#inf-tasa"))==null||m.addEventListener("input",I),I(),j(g,"[data-inf-cerrar]",()=>b.classList.add("hidden")),j(g,"[data-inf-guardar]",d=>{const f=d.getAttribute("data-inf-guardar")||"",A=parseInt(g.querySelector("#inf-year").value),h=parseFloat(g.querySelector("#inf-tasa").value);if(!Number.isFinite(A)||A<1900||A>2200)return E("Año inválido","err");if(!Number.isFinite(h)||h<0||h>100)return E("Tasa inválida (0–100%)","err");if(o().filter(w=>w._id!==f).some(w=>w.year===A))return E("Ya existe un periodo para ese año","err");f?(e.updateItem("inflacion",f,{year:A,tasa:h}),E("Periodo actualizado")):(e.addItem("inflacion",{year:A,tasa:h}),E("Periodo añadido")),b.classList.add("hidden"),s(),r()})}function l(v,r){const b=(Math.pow(1+v.tasa/100,.08333333333333333)-1)*100,g=`${v.year}-12-31`,$=g>r?lt([v],r,g):null;return`
      <div class="exp-table-row" data-periodo="${c(v._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${v.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${v.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${b.toFixed(3)}%/mes</div>
        <div class="num">${$!==null?`×${$.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${c(v._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${c(v._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function x(v){const r=o(),b=e.get("config").usarInflacion||!1,g=[...r].sort((y,w)=>w.year-y.year),$=V(),I=new Date().getFullYear(),m=O(new Date(I+5,0,1)),d=O(new Date(I+10,0,1)),f=b&&r.length>0?lt(r,$,m):null,A=b&&r.length>0?lt(r,$,d):null;v.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${!b&&r.length===0?`<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
        <div style="font-weight:600;font-size:14px;margin-bottom:6px">Módulo opcional</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Registra la tasa de inflación estimada de cada año y las proyecciones mostrarán el coste
          en <strong>euros de hoy</strong>. Útil para comparar el coste real de un préstamo largo o
          ver cómo se erosiona el ahorro. Para un uso básico puedes ignorarlo.
        </div>
      </div>`:""}

      <div class="card mb-14" style="padding:16px 20px">
        <div class="flex gap-16 items-center" style="flex-wrap:wrap;justify-content:space-between">
          <div>
            <div style="font-weight:600;font-size:15px">Usar estimaciones de inflación</div>
            <div class="text-sm" style="color:var(--text3);margin-top:4px">
              Aplica la inflación acumulada año a año a las proyecciones.
            </div>
          </div>
          <label class="toggle" style="flex-shrink:0">
            <input type="checkbox" data-toggle-inflacion ${b?"checked":""}/>
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${f!==null&&A!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${f.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((f-1)*100).toFixed(1)}%)</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +10 años</div>
            <div class="stat-value neg">×${A.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((A-1)*100).toFixed(1)}%)</span></div>
          </div>
        </div>`:""}
      </div>

      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          <span class="exp-col-head">Año</span>
          <span class="exp-col-head">Tasa anual (%)</span>
          <span class="exp-col-head">Equivalente mensual</span>
          <span class="exp-col-head">Factor acumulado desde hoy</span>
          <span></span>
        </div>
        ${g.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':g.map(y=>l(y,$)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const h=()=>x(v);W(v,"[data-toggle-inflacion]",y=>{const w=y.checked;e.patchConfig({usarInflacion:w}),E(w?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),s(),h()}),j(v,"[data-nuevo-periodo]",()=>u(null,h)),j(v,"[data-editar-periodo]",y=>u(y.getAttribute("data-editar-periodo"),h)),j(v,"[data-importar-ipc]",()=>void p(h)),j(v,"[data-borrar-periodo]",y=>{tt("¿Eliminar este periodo de inflación?")&&(e.removeItem("inflacion",y.getAttribute("data-borrar-periodo")),E("Periodo eliminado"),s(),h())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:Ss,mount:x}}const zs=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],Fs=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Ps=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function Ts(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Ca=(t,e)=>t.map(([a,o])=>`<option value="${c(a)}"${a===e?" selected":""}>${c(o)}</option>`).join("");function je(t,e="dp"){const{modo:a,dia:o,nth:s,wd:n}=Ts(t),i=Ca(zs.map(p=>[p,p==="ultimo"?"Último día":p]),o);return`<div class="form-group" data-diapago="${c(e)}">
    <label class="form-label">Día efectivo</label>
    <div class="flex gap-8 items-center" style="flex-wrap:wrap;row-gap:6px">
      <select class="form-select" data-dp-modo style="width:auto;min-width:145px">
        <option value="none"${a==="none"?" selected":""}>Sin ajuste</option>
        <option value="dia"${a==="dia"?" selected":""}>Día del mes</option>
        <option value="nthweekday"${a==="nthweekday"?" selected":""}>Día de la semana</option>
      </select>
      <span data-dp-dia class="flex gap-8 items-center"${a!=="dia"?' style="display:none"':""}>
        el día <select class="form-select" data-dp-dnum style="width:auto;min-width:80px">${i}</select>
      </span>
      <span data-dp-nth class="flex gap-8 items-center"${a!=="nthweekday"?' style="display:none"':""}>
        el
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Ca(Fs,s)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Ca(Ps,n)}</select>
        del mes
      </span>
    </div>
  </div>`}function _e(t){var o,s,n;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(s=e.querySelector("[data-dp-dia]"))==null||s.style.setProperty("display",a==="dia"?"":"none"),(n=e.querySelector("[data-dp-nth]"))==null||n.style.setProperty("display",a==="nthweekday"?"":"none")}function Ee(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=s=>{var n;return((n=e.querySelector(s))==null?void 0:n.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const js="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",_s=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Es(t){const e=t.hoy??V,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var m;return(m=t.onDatosCambiados)==null?void 0:m.call(t)},s=()=>t.store.get("accounts"),n=m=>{var d;return((d=s().find(f=>f._id===(m||"default")))==null?void 0:d.nombre)??(m||"default")};function i(){const m=e();let d=[...t.store.get("expenses")];if(a.mostrarExpirados||(d=d.filter(f=>!f.fechaFin||f.fechaFin>=m)),a.tipo&&(d=d.filter(f=>f.tipo===a.tipo)),a.cuenta&&(d=d.filter(f=>(f.cuenta||"default")===a.cuenta)),a.desde&&(d=d.filter(f=>(f.fechaInicio??"")>=a.desde)),a.hasta&&(d=d.filter(f=>(f.fechaInicio??"")<=a.hasta)),a.busqueda){const f=a.busqueda.toLowerCase();d=d.filter(A=>A.concepto.toLowerCase().includes(f))}return a.tags.size>0&&(d=d.filter(f=>(f.tags||[]).some(A=>a.tags.has(A)))),d.sort((f,A)=>{const h=f[a.orden]??"",y=A[a.orden]??"";return typeof h=="number"&&typeof y=="number"?(h-y)*a.sentido:String(h).localeCompare(String(y))*a.sentido})}function p(){return[...new Set(t.store.get("expenses").flatMap(m=>m.tags||[]))].filter(Boolean).sort()}function u(m,d){const f=a.orden===m?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${m}">${c(d)} <span class="sort-arrow">${f}</span></span>`}function l(m,d=!1){return(d?'<option value="">Todas las cuentas</option>':"")+s().filter(A=>A.activo!==!1).map(A=>`<option value="${c(A._id)}"${A._id===m?" selected":""}>${c(A.nombre)}</option>`).join("")}function x(m){const d=m.tipo==="transferencia",f=sa(m.diaPago??""),A=m.tipoFrecuencia==="extraordinario"?"Único":`Cada ${m.frecuencia??1} ${m.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${f?` · ${f}`:""}`,h=!!m.fechaFin&&m.fechaFin<e(),y=d?'<span class="badge badge-purple">⇄ transf.</span>':m.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',w=d?`${c(n(m.cuenta))} → ${c(n(m.cuentaDestino))}`:c(n(m.cuenta)),S=(m.tags||[]).map(M=>`<span class="tag${a.tags.has(M)?" active":""}" data-tag="${c(M)}" title="Filtrar por ${c(M)}">${c(M)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(m.concepto)}</div>
        <div class="tag-list mt-4">${S}</div>
      </div>
      <div>${y}</div>
      <div class="num ${m.tipo==="ingreso"?"pos":d?"":"neg"}">${d?"⇄ ":""}${c(z(m.cuantia))}</div>
      <div class="text-sm">${c(A)}</div>
      <div class="text-sm exp-col-hide">${w}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${c(m._id)}"${m.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${m.tipo==="gasto"&&m.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffd166" title="Gasto clasificado como deseo">deseo</span>':""}
        ${m.tipo==="gasto"&&m.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${m.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${m.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${c(m.ajustadaEn??"")}">ajustada</span>`:""}
        ${h?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${c(m._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${c(m._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${c(m._id)}">✕</button>
      </div>
    </div>`}function v(m){const d=i(),f=p();m.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Gastos e <span>Ingresos</span></h1>
        <div class="page-actions">
          <label class="flex gap-8 items-center" style="font-size:12px;color:var(--text2)">
            <label class="toggle"><input type="checkbox" data-expirados${a.mostrarExpirados?" checked":""}/><span class="toggle-slider"></span></label>
            Expirados
          </label>
          <button class="btn-primary" data-nuevo>+ Nuevo</button>
        </div>
      </div>
      <div class="filter-bar">
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${c(a.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${a.tipo==="gasto"?" selected":""}>Gastos</option>
          <option value="ingreso"${a.tipo==="ingreso"?" selected":""}>Ingresos</option>
          <option value="transferencia"${a.tipo==="transferencia"?" selected":""}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${l(a.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${c(a.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${c(a.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${f.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${f.map(A=>`<span class="tag${a.tags.has(A)?" active":""}" data-tag="${c(A)}">${c(A)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${u("concepto","Concepto")} ${u("tipo","Tipo")} ${u("cuantia","Cuantía")} ${u("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${d.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':d.map(x).join("")}
      </div>`}function r(m){const d=(m==null?void 0:m.tipo)==="transferencia",f=t.store.get("escenarios"),A=(m==null?void 0:m.escenarioIds)||[],h=(y,w,S,M,C="")=>`<div class="form-group"><label class="form-label">${c(w)}</label>
       <input class="form-input" type="${S}" id="${y}" value="${c(M)}" placeholder="${c(C)}"/></div>`;return`
      <div class="grid-2">
        ${h("ef-concepto","Concepto","text",(m==null?void 0:m.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(m==null?void 0:m.tipo)==="gasto"||!(m!=null&&m.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(m==null?void 0:m.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${d?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${h("ef-cuantia","Cuantía (€)","number",(m==null?void 0:m.cuantia)??"","500")}
        ${h("ef-frecuencia","Frecuencia","number",(m==null?void 0:m.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${_s.map(([y,w])=>`<option value="${y}"${((m==null?void 0:m.tipoFrecuencia)??"mensual")===y?" selected":""}>${c(w)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${h("ef-fecha-ini","Fecha inicio","date",(m==null?void 0:m.fechaInicio)??e())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${l((m==null?void 0:m.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${d?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${l((m==null?void 0:m.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(m==null?void 0:m.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${m!=null&&m._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${h("ef-fecha-fin","Fecha fin (opcional)","date",(m==null?void 0:m.fechaFin)??"")}</div>
          <div class="mt-8">${je(m==null?void 0:m.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${d?' style="display:none"':""}>
            <div class="mt-8" id="ef-clasificacion-wrap"${(m==null?void 0:m.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${((m==null?void 0:m.clasificacion)??"necesidad")==="necesidad"?" selected":""}>Necesidad</option>
                  <option value="deseo"${(m==null?void 0:m.clasificacion)==="deseo"?" selected":""}>Deseo</option>
                  <option value=""${(m==null?void 0:m.clasificacion)===null?" selected":""}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label>
              <input class="form-input" type="text" id="ef-tags" value="${c(((m==null?void 0:m.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
            <div class="form-row mt-8">
              <label class="form-label">Gasto básico</label>
              <label class="toggle"><input type="checkbox" id="ef-basico"${m!=null&&m.basico?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Incluir en el cálculo del colchón económico</span>
            </div>
            <div class="form-row mt-8" id="ef-irpf-wrap"${(m==null?void 0:m.tipo)==="ingreso"?"":' style="display:none"'}>
              <label class="form-label">Sujeto a retención IRPF</label>
              <label class="toggle"><input type="checkbox" id="ef-sujetoIRPF"${m!=null&&m.sujetoIRPF?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Calcula y proyecta la retención mensual</span>
            </div>
          </div>
          ${f.length>0?`<div class="form-group mt-8"><label class="form-label">Escenarios</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${f.map(y=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${A.includes(y._id)?c(y.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${c(y._id)}"${A.includes(y._id)?" checked":""}/>
                          ${c(y.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${c((m==null?void 0:m._id)??"")}">Guardar</button>
      </div>`}function b(m){var A;const d=((A=m.querySelector("#ef-tipo"))==null?void 0:A.value)??"gasto",f=(h,y)=>{const w=m.querySelector(h);w&&(w.style.display=y?"":"none")};f("#ef-destino-wrap",d==="transferencia"),f("#ef-basico-wrap",d!=="transferencia"),f("#ef-irpf-wrap",d==="ingreso"),f("#ef-clasificacion-wrap",d==="gasto")}function g(m,d,f){const A=document.getElementById("modal-overlay"),h=document.getElementById("modal-content");!A||!h||(h.innerHTML=`<div class="modal-title">${c(d)}</div>${r(m)}`,A.classList.remove("hidden"),W(h,"#ef-tipo",()=>b(h)),W(h,"[data-dp-modo]",()=>_e(h)),j(h,"[data-cancelar]",()=>A.classList.add("hidden")),j(h,"[data-guardar]",y=>{$(h,y.getAttribute("data-guardar")||"")&&(A.classList.add("hidden"),f())}))}function $(m,d){const f=P=>{var F;return((F=m.querySelector(P))==null?void 0:F.value)??""},A=P=>{var F;return!!((F=m.querySelector(P))!=null&&F.checked)},h=f("#ef-tipo")||"gasto",y=h==="transferencia",w=f("#ef-concepto").trim(),S=parseFloat(f("#ef-cuantia"));if(!w||!Number.isFinite(S))return E("Concepto y cuantía obligatorios","err"),!1;const M=f("#ef-clasificacion"),C={concepto:w,tipo:h,cuantia:S,frecuencia:parseInt(f("#ef-frecuencia"),10)||1,tipoFrecuencia:f("#ef-tipo-frec")||"mensual",fechaInicio:f("#ef-fecha-ini"),fechaFin:f("#ef-fecha-fin")||null,diaPago:Ee(m),cuenta:f("#ef-cuenta"),cuentaDestino:y?f("#ef-cuenta-dest")||"default":void 0,activo:A("#ef-activo"),basico:!y&&A("#ef-basico"),sujetoIRPF:!y&&A("#ef-sujetoIRPF"),clasificacion:h==="gasto"?M||null:void 0,tags:y?["transferencia"]:f("#ef-tags").split(",").map(P=>P.trim()).filter(Boolean),escenarioIds:[...m.querySelectorAll(".ef-escenario:checked")].map(P=>P.value)};return d?(t.store.updateItem("expenses",d,C),E("Actualizado")):(t.store.addItem("expenses",C),E("Creado")),o(),!0}function I(m,d){const f=m.querySelector("[data-busqueda]");let A;f==null||f.addEventListener("input",()=>{clearTimeout(A),A=setTimeout(()=>{a.busqueda=f.value,d();const h=m.querySelector("[data-busqueda]");h==null||h.focus(),h==null||h.setSelectionRange(h.value.length,h.value.length)},250)}),W(m,"[data-expirados]",h=>{a.mostrarExpirados=h.checked,d()}),W(m,"[data-f-tipo]",h=>{a.tipo=h.value,d()}),W(m,"[data-f-cuenta]",h=>{a.cuenta=h.value,d()}),W(m,"[data-f-desde]",h=>{a.desde=h.value,d()}),W(m,"[data-f-hasta]",h=>{a.hasta=h.value,d()}),j(m,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,d()}),j(m,"[data-limpiar-tags]",()=>{a.tags=new Set,d()}),j(m,"[data-tag]",h=>{const y=h.getAttribute("data-tag");a.tags.has(y)?a.tags.delete(y):a.tags.add(y),d()}),j(m,"[data-orden]",h=>{const y=h.getAttribute("data-orden");a.orden===y?a.sentido=a.sentido===1?-1:1:(a.orden=y,a.sentido=1),d()}),j(m,"[data-nuevo]",()=>g(null,"Nuevo gasto/ingreso",d)),j(m,"[data-editar]",h=>{const y=t.store.get("expenses").find(w=>w._id===h.getAttribute("data-editar"));y&&g(y,"Editar",d)}),j(m,"[data-duplicar]",h=>{const y=t.store.get("expenses").find(M=>M._id===h.getAttribute("data-duplicar"));if(!y)return;const{_id:w,...S}=y;g({...S,concepto:`${y.concepto} (copia)`},"Duplicar movimiento",d)}),j(m,"[data-borrar]",h=>{tt("¿Eliminar?")&&(t.store.removeItem("expenses",h.getAttribute("data-borrar")),E("Eliminado"),o(),d())}),W(m,"[data-activo]",h=>{const y=h;t.store.updateItem("expenses",y.getAttribute("data-activo"),{activo:y.checked}),o(),d()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:js,mount(m){const d=()=>v(m);v(m),m.dataset.wired!=="1"&&(I(m,d),m.dataset.wired="1")}}}function ta(t,e,a){return t.reduce((o,s)=>{if(s.esAmortizacion)return o;const n=lt(e,a,s.fecha);return o+(n>0?s.interes/n:s.interes)},0)}function De(t,e,a,o){return t.reduce((s,n)=>{const i=lt(e,a,n.fecha),p=n.esAmortizacion?n.amortizacion+n.comisionAmort:n.cuota;return s+(i>0?p/i:p)},0)+o}function Ds(t,e,a){const o=t.amortizaciones||[];return o.map((s,n)=>{const i=Z({...t,amortizaciones:o.slice(0,n)}),p=Z({...t,amortizaciones:o.slice(0,n+1)});return{nominal:i.totalIntereses-p.totalIntereses,real:ta(i.tabla,e,a)-ta(p.tabla,e,a)}})}const za=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${c(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function Rs(t,e){const a=Oa(t),o=(t.amortizaciones||[]).length>0,s=e.periodos.length>0,n=e.usarInflacion&&s,i=s?Ba(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,p=s?Ha(t.tin||0,i):null,u=o&&s?Ds(t,e.periodos,e.hoy):[],l=u.length?ta(a.sinAmort.tabla,e.periodos,e.hoy)-ta(a.tabla,e.periodos,e.hoy):null,x=l===null?null:l-a.costeTotalAmort,v=n?De(a.tabla,e.periodos,e.hoy,a.comAp):null,r=n&&o?De(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${c(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${c(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(0,229,160,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(t.tags||[]).map(b=>`<span class="tag">${c(b)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${c(t.tin)}%</span>
        <span class="text-sm">${c(z(t.capital))}</span>
        <span class="text-sm">${c(t.meses)}m</span>
        <button class="btn-icon" data-amort-loan="${c(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${c(t._id)}">

      <div class="grid-4 mb-12">
        ${za("Cuota mensual",c(z(a.cuota)),e.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${c(z(e.cuotaMes))}</div>`:"")}
        ${za("Total intereses",c(z(a.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(z(a.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${c(a.fechaFin||"—")}</div>
          ${o&&a.fechaFin!==a.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(a.sinAmort.fechaFin||"—")}${a.ahorroTiempo>0?` (−${a.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${za("Total pagado",c(z(a.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${c(z(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${c(Na(a.tae))}</div></div>
          <div><div class="stat-label">TIN</div><div class="stat-value">${c(t.tin)}%</div></div>
          ${p!==null?`<div title="Tipo de interés real (Fisher): TIN ajustado por la inflación media del ${i.toFixed(2)}% anual durante el préstamo">
                   <div class="stat-label">TIN real</div>
                   <div class="stat-value" style="color:${p<=0?"var(--accent)":p<t.tin?"var(--yellow)":"var(--text)"}">${p.toFixed(2)}%
                     <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${i.toFixed(1)}%)</span>
                   </div>
                 </div>`:""}
          <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${c(t.meses)} meses</div></div>
        </div>
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">Capital</div><div class="stat-value">${c(z(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${c(z(a.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${c(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${c(sa(t.diaPago))}</div></div>`:""}
        </div>
      </div>

      ${o?"":`<div class="loan-optim-cta">
               <div class="loan-optim-cta-text">
                 <strong>¿Quieres pagar menos intereses?</strong>
                 Simula amortizaciones anticipadas y descubre cuánto puedes ahorrar.
               </div>
               <button class="btn-primary btn-sm" data-amort-loan="${c(t._id)}">+ Amortizar</button>
               <button class="btn-secondary btn-sm" data-optimizar>✨ Optimizar</button>
             </div>`}

      ${o?`<div class="card" style="background:var(--bg3);padding:12px;margin-bottom:12px">
               <div class="card-title" style="margin-bottom:8px;color:var(--accent)">💰 Ahorro por amortizaciones</div>
               ${l!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${c(z(a.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${c(z(l))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${c(z(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${c(z(a.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(x??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${c(z(x??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${c(z(a.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${c(z(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${c(z(a.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${v!==null?Ns(t,a.totalPagado,v,r):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${n?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(b=>qs(b,n,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((b,g)=>Ls(t._id,b,u[g]??null,e)).join("")}`:""}
    </div>
  </div>`}function Ns(t,e,a,o){const s=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const p=o-a,u=p>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${c(z(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${c(z(a))}</div></div>
        <div><div class="stat-label">${u?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${u?"pos":"neg"}">${u?"−":"+"}${c(z(Math.abs(p)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${s}
    </div>`}const n=e-a,i=n>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${c(z(e))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${c(z(a))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${c(z(Math.abs(n)))}</div></div>
    </div>
    ${s}
  </div>`}function qs(t,e,a){let o="";if(e&&!t.esAmortizacion){const s=lt(a.periodos,a.hoy,t.fecha);o=c(z(s>0?t.cuota/s:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":c(t.mes)}</td>
    <td class="num">${c(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":c(z(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${c(z(t.interes))}</td>
    <td class="num">${c(z(t.amortizacion))}</td>
    <td class="num">${c(z(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Ls(t,e,a,o){const s=(e.escenarioIds||[]).map(n=>`<span class="badge badge-yellow">🔭 ${c(o.nombreEscenario(n))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${c(e.fecha)}</span>
    <span class="num">${c(z(e.cantidad))}</span>
    <span class="badge ${e.simulacion?"badge-sim":"badge-active"}">${e.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${e.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${s}
    ${a?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${c(z(a.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${c(z(a.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${c(t)}|${c(e._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${c(t)}|${c(e._id)}">✕</button>
  </div>`}const K=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,_t=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([s,n])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(n)}</option>`).join("")}
   </select></div>`,Vt=(t,e,a,o="")=>`<label class="form-label">${c(e)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${a?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${c(o)}</span>`:""}`;function Ut(t,e,a){return t.length===0?"":`<div class="form-group mt-8"><label class="form-label">Escenarios</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${t.map(o=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${e.includes(o._id)?c(o.color||"var(--accent)"):"var(--border)"}">
            <input type="checkbox" class="${c(a)}" value="${c(o._id)}"${e.includes(o._id)?" checked":""}/>
            ${c(o.nombre)}
          </label>`).join("")}
    </div></div>`}const ks=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function Os(t,e,a,o=V()){return`
    <div class="grid-2">
      ${K("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${K("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${K("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${K("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${K("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??o)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${ks(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${je(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${_t("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${K("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${K("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${c(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${Vt("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${Ut(a,(t==null?void 0:t.escenarioIds)??[],"loan-escenario")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${Vt("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${Vt("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${Vt("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Bs(t,e,a,o=V()){return`
    <div class="grid-2">
      ${K("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??o)}
      ${K("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${_t("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(e==null?void 0:e.tipo)??"cuota")}
    </div>
    ${Ut(a,(e==null?void 0:e.escenarioIds)??[],"amort-escenario")}
    <div class="form-row mt-8">
      ${Vt("am-sim","Simulación",!!(e!=null&&e.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${c(t)}|${c((e==null?void 0:e._id)??"")}">${e?"Guardar cambios":"Añadir"}</button>
    </div>`}const Re="opt_",Ne=t=>String(t).startsWith(Re);function Hs(t){let e=null,a=null;const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content");function n(d,f){const A=o(),h=s();return!A||!h?null:(h.innerHTML=`<div class="modal-title">${c(d)}</div>${f}`,A.classList.remove("hidden"),h)}const i=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")};function p(){let d=!1;for(const f of t.loans()){const A=(f.amortizaciones||[]).filter(h=>!Ne(h._id));A.length!==(f.amortizaciones||[]).length&&(t.guardarAmortizaciones(f._id,A),d=!0)}return d}function u(){var S,M;const d=t.loans().filter(C=>C.activo&&!C.simulacion);if(d.length===0){E("No hay préstamos activos para optimizar","err");return}const f=t.config(),A=t.accounts().filter(C=>C.activo&&!C.simulacion),h=((S=A.find(C=>C.esCuentaPrincipal))==null?void 0:S._id)??((M=A[0])==null?void 0:M._id)??"",y=f.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,w=n("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${A.map(C=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${c(C._id)}"${C._id===h?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(C.nombre)}${C._id===h?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${c(z(it(C)))}</span>
              </label>`).join("")||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${d.map(C=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
              <input type="checkbox" class="opt-loan-check" value="${c(C._id)}"${C.tin>=5?" checked":""} style="accent-color:var(--accent)"/>
              <span style="font-size:13px;flex:1">${c(C.nombre)}</span>
              <span class="badge badge-yellow" style="font-size:11px">${c(C.tin)}% TIN</span>
            </label>`).join("")}
      </div>
      <button class="btn-secondary btn-sm mb-12" data-opt-todos>Seleccionar todo</button>

      <div class="grid-2" style="gap:10px">
        ${K("opt-horizonte","Horizonte (meses)","number",60,"60")}
        ${K("opt-frecuencia","Frecuencia manual (cada N meses)","number",1,"1")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${K("opt-min","Importe mínimo por amortización (€)","number",500,"500")}
        ${_t("opt-tipo","Efecto de la amortización",[["plazo","Reducir plazo (mantener cuota)"],["cuota","Reducir cuota (mantener plazo)"]],"plazo")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${K("opt-fecha-primera","Fecha primera amortización","date","")}
        ${K("opt-fecha-obj","Fecha objetivo para comparar saldo","date",y)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar>📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);w&&(l(w),W(w,".opt-acc-radio",()=>l(w)),j(w,"[data-opt-todos]",()=>{const C=[...w.querySelectorAll(".opt-loan-check")],P=C.every(F=>F.checked);C.forEach(F=>F.checked=!P)}),j(w,"[data-cancelar]",i),j(w,"[data-opt-calcular]",()=>b(w)),j(w,"[data-opt-comparar]",()=>g(w)))}function l(d){var w;const f=(w=d.querySelector(".opt-acc-radio:checked"))==null?void 0:w.value,h=(t.config().margenesSeguridad||[]).filter(S=>S.activo!==!1).filter(S=>!S.cuentas||S.cuentas.length===0||f&&S.cuentas.includes(f)),y=d.querySelector("#opt-margenes-wrap");y&&(y.innerHTML=h.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':h.map(S=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${c(S._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(S.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!S.cuentas||S.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function x(d){var y,w,S,M;const f=(C,P,F=0)=>{var _;const T=parseFloat(((_=d.querySelector(C))==null?void 0:_.value)??"");return Number.isFinite(T)?Math.max(F,T):P},A=[...d.querySelectorAll(".opt-loan-check")],h=A.filter(C=>C.checked).map(C=>C.value);return{horizonte:Math.round(f("#opt-horizonte",60,1)),frecuencia:Math.round(f("#opt-frecuencia",1,1)),minAmortizable:f("#opt-min",500),tipoAmort:((y=d.querySelector("#opt-tipo"))==null?void 0:y.value)||"plazo",fechaObjetivo:((w=d.querySelector("#opt-fecha-obj"))==null?void 0:w.value)||null,fechaPrimeraAmort:((S=d.querySelector("#opt-fecha-primera"))==null?void 0:S.value)||null,loanIds:A.length===0||h.length===A.length?null:h,sourceAccountId:((M=d.querySelector(".opt-acc-radio:checked"))==null?void 0:M.value)??null,selectedMarginIds:[...d.querySelectorAll(".opt-margin-check:checked")].map(C=>C.value)}}const v=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function r(d,f=""){const A=n("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${c(d)}</div>
        ${f?`<div class="text-sm mt-8" style="color:var(--text3)">${c(f)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);A&&(j(A,"[data-opt-volver]",u),j(A,"[data-cancelar]",i))}function b(d){const f=x(d);p()&&E("Plan anterior eliminado, recalculando…");const{loans:A,expenses:h,accounts:y,config:w,nominas:S}=v(),M=ba(A,h,y,w,{frecuencia:f.frecuencia,mesesHorizonte:f.horizonte,minAmortizable:f.minAmortizable,tipoAmort:f.tipoAmort,fechaPrimeraAmort:f.fechaPrimeraAmort,loanIds:f.loanIds,nominas:S,sourceAccountId:f.sourceAccountId,selectedMarginIds:f.selectedMarginIds});if(M.plan.length===0){r(`No hay excedente suficiente respetando los ${M.margenesAplicados} márgenes de seguridad activos en los próximos ${f.horizonte} meses para generar amortizaciones por encima del mínimo de ${z(f.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}a={plan:M.plan,tipoAmort:f.tipoAmort};const C=`✨ Plan de optimización · ${f.frecuencia===1?"Mensual":`Cada ${f.frecuencia} meses`} · ${f.horizonte}m`,P=n(C,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(z(M.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${c(z(M.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${c(z(M.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${M.margenesAplicados}</div></div>
      </div>
      ${M.resumenPorLoan.map(Le).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${M.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${M.plan.map(F=>qe(F,!0)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">
        Las amortizaciones se añaden como <strong>simulaciones</strong> y no afectan tus datos reales
        hasta que las conviertas en reales manualmente desde cada préstamo.
      </div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Descartar</button>
        <button class="btn-primary" data-opt-aplicar>Aplicar plan como simulación</button>
      </div>`);P&&(j(P,"[data-opt-volver]",u),j(P,"[data-cancelar]",i),j(P,"[data-opt-aplicar]",()=>{a&&I(a.plan,a.tipoAmort)}))}function g(d){const f=x(d);p();const{loans:A,expenses:h,accounts:y,config:w,nominas:S}=v(),M=fe(A,h,y,w,{horizonte:f.horizonte,minAmortizable:f.minAmortizable,tipoAmort:f.tipoAmort,fechaObjetivo:f.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:f.fechaPrimeraAmort,loanIds:f.loanIds,nominas:S,sourceAccountId:f.sourceAccountId,selectedMarginIds:f.selectedMarginIds});if(M.resultados.length===0){r("No hay excedente suficiente en ninguna frecuencia.");return}e=M;const{resultados:C,saldoBase:P,fechaObjetivo:F}=M,T=C.map(R=>{const q=[R.esMejorIntereses&&"💰 +intereses",R.esMejorSaldo&&"🏦 +saldo",R.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${R.esMejorValor?"background:rgba(0,229,160,0.06);":""}">
          <td style="font-weight:600">${c(R.label)}</td>
          <td class="num">${R.numAmortizaciones}</td>
          <td class="num neg">${c(z(R.totalAmortizado))}</td>
          <td class="num pos">${c(z(R.ahorroIntereses))}</td>
          <td class="num ${R.saldoObjetivo>=P?"pos":"neg"}">${c(z(R.saldoObjetivo))}</td>
          <td class="num pos">${c(z(R.valorTotal))}</td>
          <td style="font-size:11px">${q}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${R.frecuencia}">Usar</button></td>
        </tr>`}).join(""),_=n(`📊 Comparativa de frecuencias · hasta ${F}`,`
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${c(F)}: <strong>${c(z(P))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${c(F.slice(0,7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${T}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);_&&(j(_,"[data-opt-volver]",u),j(_,"[data-cancelar]",i),j(_,"[data-opt-usar]",R=>$(Number(R.getAttribute("data-opt-usar")))))}function $(d){var A;const f=e==null?void 0:e.resultados.find(h=>h.frecuencia===d);f&&(p(),I(f.plan,((A=f.plan[0])==null?void 0:A.tipoAmort)||"plazo",{titulo:`✨ Plan ${f.label} · aplicado`,resumen:f,fechaObjetivo:e==null?void 0:e.fechaObjetivo}))}function I(d,f,A){if(d.length===0)return;const h=new Map;for(const w of d){const S=h.get(w.loanId)??[];S.push({_id:`${Re}${w.mes}_${w.loanId}`,fecha:w.fechaAmort,cantidad:w.cantidadAmort,tipo:f,simulacion:!0}),h.set(w.loanId,S)}let y=0;for(const w of t.loans()){const S=h.get(w._id);if(!S)continue;const M=(w.amortizaciones||[]).filter(C=>!Ne(C._id));t.guardarAmortizaciones(w._id,[...M,...S]),y+=1}E(`Plan aplicado: ${d.length} amortizaciones en ${y} préstamo${y!==1?"s":""} (simulación)`),A?m(A):i(),t.refrescar([...h.keys()])}function m({titulo:d,resumen:f,fechaObjetivo:A}){const h=n(d,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(z(f.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${c(z(f.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${c((A==null?void 0:A.slice(0,7))??"")}</div><div class="stat-value pos">${c(z(f.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${c(z(f.totalComisiones))}</div></div>
      </div>
      ${f.resumenPorLoan.map(Le).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${f.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${f.plan.map(y=>qe(y,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);h&&j(h,"[data-cancelar]",i)}return{abrir:u,get planManual(){return a},get comparativa(){return e}}}function qe(t,e){const a=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${c(z(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${c(t.mes)}</td>
    <td>${c(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${c(z(t.capitalAntes))}</td>
    <td class="num neg">${c(z(t.cantidadAmort))}${a}</td>
    <td class="num">${c(z(t.capitalDespues))}</td>
    ${e?`<td class="num" style="color:var(--text3)">${c(z(t.saldoDisponible))} → ${c(z(t.saldoDespues))}</td>`:""}
  </tr>`}function Le(t){return`<div class="card mb-8" style="padding:12px">
    <div class="flex justify-between items-center mb-8">
      <span style="font-weight:600">${c(t.nombre)}</span>
      <span class="badge badge-yellow">${c(t.tin)}% TIN</span>
    </div>
    <div class="grid-4" style="gap:8px;font-size:12px">
      <div><div class="stat-label">Fecha fin</div>
        <div class="num" style="text-decoration:line-through;color:var(--text3)">${c(t.fechaFinSin)}</div>
        <div class="num pos">${c(t.fechaFinCon)}</div></div>
      <div><div class="stat-label">Plazo ahorrado</div><div class="num pos">${t.mesesAhorrados>0?`${t.mesesAhorrados}m`:"—"}</div></div>
      <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${c(z(t.ahorroIntereses))}</div></div>
      <div><div class="stat-label">${t.numAmortizaciones} amorts.</div><div class="num">${c(z(t.totalAmortizado))}</div></div>
    </div>
  </div>`}const Gs="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Vs(t){const e=t.hoy??V;let a=!1;const o=new Set;let s=null;const n=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)},i=()=>t.store.get("escenarios"),p=h=>{var y;return((y=i().find(w=>w._id===h))==null?void 0:y.nombre)??h};function u(h){if(!h.activo||h.simulacion)return!1;const y=Z(h).tabla.filter(w=>!w.esAmortizacion);return y.length===0?!0:y[y.length-1].fecha<e()}function l(h,y){const w=e(),S=w.slice(0,7),M=new Map;let C=0;for(const P of h){if(!P.activo||P.simulacion||y.has(P._id)||(P.fechaInicio||"")>w)continue;const F=Z(P).tabla.filter(_=>!_.esAmortizacion&&_.fecha.startsWith(S)),T=F.length>0?F[0].cuota:0;M.set(P._id,T),C+=T}return{porLoan:M,total:C,activos:[...M.values()].filter(P=>P>0).length}}function x(h){const y=t.store.get("config"),w=y.dashboardStart,S=y.dashboardEnd,M=Math.max(1,(N(S).getTime()-N(w).getTime())/(30.44*864e5));let C=0;for(const P of h)!P.activo||P.simulacion||(C+=Z(P).tabla.filter(F=>!F.esAmortizacion&&F.fecha>=w&&F.fecha<=S).reduce((F,T)=>F+T.cuota,0));return{media:C/M,desde:w,hasta:S}}function v(h){const y=[...t.store.get("loans")].sort((_,R)=>R.tin-_.tin),w=new Set(y.filter(u).map(_=>_._id)),S=a?y:y.filter(_=>!w.has(_._id)),M=l(y,w),C=x(y),P=t.store.get("config"),F=t.store.get("inflacion"),T=new Date(N(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});h.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${w.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${w.size})</button>`:""}
          <button class="btn-secondary" data-optimizar>✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${M.total>0||C.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${M.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${c(T)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${c(z(M.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${M.activos} préstamo${M.activos!==1?"s":""} activo${M.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${C.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${c(z(C.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${c(C.desde)} → ${c(C.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${S.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':S.map(_=>Rs(_,{periodos:F,usarInflacion:!!P.usarInflacion,hoy:e(),cuotaMes:M.porLoan.get(_._id)??0,completado:w.has(_._id),nombreEscenario:p})).join("")}
      </div>`;for(const _ of h.querySelectorAll("[data-body-loan]"))o.has(_.dataset.bodyLoan??"")&&_.classList.add("open")}const r=()=>document.getElementById("modal-overlay"),b=()=>document.getElementById("modal-content"),g=()=>{var h;return(h=r())==null?void 0:h.classList.add("hidden")};function $(h,y){const w=r(),S=b();return!w||!S?null:(S.innerHTML=`<div class="modal-title">${c(h)}</div>${y}`,w.classList.remove("hidden"),j(S,"[data-cancelar]",g),S)}function I(h,y){const w=h?t.store.get("loans").find(M=>M._id===h)??null:null,S=$(h?"Editar préstamo":"Nuevo préstamo",Os(w,t.store.get("accounts"),i(),e()));S&&(S.addEventListener("change",M=>{var C;(C=M.target)!=null&&C.matches("[data-dp-modo]")&&_e(S)}),j(S,"[data-guardar-loan]",M=>{m(S,M.getAttribute("data-guardar-loan")||"")&&(g(),y())}))}function m(h,y){const w=_=>{var R;return((R=h.querySelector(_))==null?void 0:R.value)??""},S=_=>{var R;return!!((R=h.querySelector(_))!=null&&R.checked)},M=w("#f-nombre").trim(),C=parseFloat(w("#f-capital")),P=parseFloat(w("#f-tin")),F=parseInt(w("#f-meses"),10);if(!M||!Number.isFinite(C)||!Number.isFinite(P)||!Number.isFinite(F))return E("Completa los campos obligatorios","err"),!1;const T={nombre:M,capital:C,tin:P,meses:F,fechaInicio:w("#f-fecha"),comisionApertura:parseFloat(w("#f-com-ap"))||0,comisionAmort:parseFloat(w("#f-com-am"))||0,diaPago:Ee(h),cuenta:w("#f-cuenta"),simulacion:S("#f-sim"),activo:S("#f-activo"),mostrarFechaFinEnDashboard:S("#f-mostrar-fin"),tipoTasa:w("#f-tipo-tasa"),basico:S("#f-basico"),tags:w("#f-tags").split(",").map(_=>_.trim()).filter(Boolean),escenarioIds:[...h.querySelectorAll(".loan-escenario:checked")].map(_=>_.value)};return y?(t.store.updateItem("loans",y,T),E("Préstamo actualizado")):(t.store.addItem("loans",{...T,amortizaciones:[]}),E("Préstamo creado")),n(),!0}function d(h,y,w){const S=t.store.get("loans").find(P=>P._id===h);if(!S)return;const M=y?(S.amortizaciones||[]).find(P=>P._id===y)??null:null,C=$(y?"Editar amortización":"Añadir amortización",Bs(h,M,i(),e()));C&&j(C,"[data-guardar-amort]",P=>{const[F,T]=(P.getAttribute("data-guardar-amort")||"").split("|");f(C,F,T)&&(g(),w([F]))})}function f(h,y,w){var R;const S=q=>{var B;return((B=h.querySelector(q))==null?void 0:B.value)??""},M=S("#am-fecha"),C=parseFloat(S("#am-cant"));if(!M||!Number.isFinite(C)||C<=0)return E("Fecha y cantidad requeridas","err"),!1;const P=t.store.get("loans").find(q=>q._id===y);if(!P)return!1;const F={fecha:M,cantidad:C,tipo:S("#am-tipo"),simulacion:!!((R=h.querySelector("#am-sim"))!=null&&R.checked),escenarioIds:[...h.querySelectorAll(".amort-escenario:checked")].map(q=>q.value)},T=P.amortizaciones||[],_=w?T.map(q=>q._id===w?{...q,...F}:q):[...T,{_id:Date.now().toString(36),...F}];return t.store.updateItem("loans",y,{amortizaciones:_}),E(w?"Amortización actualizada":"Amortización añadida"),n(),!0}function A(h,y,w){j(h,"[data-toggle-finalizados]",()=>{a=!a,y()}),j(h,"[data-nuevo-loan]",()=>I(null,y)),j(h,"[data-optimizar]",()=>w.abrir()),j(h,"[data-toggle-loan]",(S,M)=>{var T;if((T=M.target)!=null&&T.closest("button"))return;const C=S.getAttribute("data-toggle-loan"),P=[...h.querySelectorAll("[data-body-loan]")].find(_=>_.dataset.bodyLoan===C);(P==null?void 0:P.classList.toggle("open"))?o.add(C):o.delete(C)}),j(h,"[data-editar-loan]",S=>I(S.getAttribute("data-editar-loan"),y)),j(h,"[data-borrar-loan]",S=>{if(!tt("¿Eliminar préstamo?"))return;const M=S.getAttribute("data-borrar-loan");t.store.removeItem("loans",M),o.delete(M),E("Eliminado"),n(),y()}),j(h,"[data-amort-loan]",S=>{const M=S.getAttribute("data-amort-loan");o.add(M),d(M,null,y)}),j(h,"[data-editar-amort]",S=>{const[M,C]=(S.getAttribute("data-editar-amort")||"").split("|");o.add(M),d(M,C,y)}),j(h,"[data-borrar-amort]",S=>{const[M,C]=(S.getAttribute("data-borrar-amort")||"").split("|"),P=t.store.get("loans").find(F=>F._id===M);P&&(t.store.updateItem("loans",M,{amortizaciones:(P.amortizaciones||[]).filter(F=>F._id!==C)}),E("Amortización eliminada"),n(),y([M]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Gs,mount(h){const y=(w=[])=>{for(const S of w)o.add(S);v(h)};s??(s=Hs({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(w,S)=>{t.store.updateItem("loans",w,{amortizaciones:S}),n()},hoy:e,refrescar:y})),v(h),h.dataset.wired!=="1"&&(A(h,y,s),h.dataset.wired="1")}}}const Us={transporte:125,restaurante:220,otros:null},Ys={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Ws=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Et=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,Js=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function Ks(t,e){const a=t.map((n,i)=>{const p=e.find(x=>x._id===n.cuenta),u=Us[n.tipo],l=u!=null&&n.importe>u;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${c(Ys[n.tipo]??n.tipo)}</span>
        <span style="flex:1;font-size:12px">${c(z(n.importe))}/mes${l?` <span style="color:var(--red)" title="Supera el límite orientativo de ${c(z(u))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${p?c(p.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
        <button class="btn-danger btn-sm" data-flex-borrar="${i}">✕</button>
      </div>`}).join(""),o=e.filter(n=>(n.modeloFondo||"cuenta")!=="pension"&&n.activo!==!1),s=o.filter(n=>(n.modeloFondo||"cuenta")==="beneficio");return`<div style="margin-bottom:8px">${a||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin componentes. Añade transporte o restaurante.</div>'}</div>
    <div class="grid-3 mt-6" style="gap:6px">
      <select class="form-select" id="fc-tipo" style="font-size:12px">
        <option value="transporte">Transporte</option>
        <option value="restaurante">Restaurante</option>
        <option value="otros">Otros</option>
      </select>
      <input class="form-input" type="number" id="fc-importe" placeholder="€/mes" min="0" style="font-size:12px"/>
      <select class="form-select" id="fc-cuenta" style="font-size:12px">
        <option value="">Sin cuenta vinculada</option>
        ${o.map(n=>`<option value="${c(n._id)}">${c(n.nombre)}${(n.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${s.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function Xs(t,e){const a=e.hoy??V(),o=(t==null?void 0:t.nPagas)??12,s=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Et("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Et("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(n=>`<option value="${n}"${s&&o===n?" selected":""}>${n} pagas</option>`).join("")}
          <option value="custom"${s?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${Js(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Et("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??a)}
          ${Et("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Et("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${Ws.map((n,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${c(n)} (${i+1})</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="grid-2 mt-8">
          <div class="form-group" id="nf-custom-pagas-wrap"${s?' style="display:none"':""}>
            <label class="form-label">Nº pagas (personalizado)</label>
            <input class="form-input" type="number" id="nf-npagas-custom" min="1" max="24" value="${o}"/>
          </div>
          <div class="form-group"><label class="form-label">Modo IRPF</label>
            <select class="form-select" id="nf-irpfmodo">
              <option value="auto"${((t==null?void 0:t.irpfModo)??"auto")==="auto"?" selected":""}>Auto (tramos)</option>
              <option value="manual"${(t==null?void 0:t.irpfModo)==="manual"?" selected":""}>Manual (%)</option>
            </select>
          </div>
        </div>
        <div id="nf-irpfpct-wrap" class="mt-8"${(t==null?void 0:t.irpfModo)==="manual"?"":' style="display:none"'}>
          ${Et("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??pa).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
            <div class="text-sm mt-4" style="color:var(--text3)">CC 4,70 + Desempleo 1,55 + FP 0,10 + MEI 0,13</div>
          </div>
        </div>
        <div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
          <div style="font-weight:600;font-size:13px;margin-bottom:6px">Retribución flexible
            <span style="font-weight:400;color:var(--text3);font-size:11px">(art. 42 LIRPF — exento IRPF y SS)</span></div>
          <div class="auth-hint mb-8" style="border-color:var(--accent)">
            Los importes mensuales reducen la base IRPF. Límites orientativos:
            <strong>transporte €125/mes</strong> (€1.500/año) · <strong>restaurante €220/mes</strong> (~€11/día × 20 días).
          </div>
          <div id="flex-comp-container"></div>
        </div>
        ${Ut(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"nom-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function ke(t,e){const a=i=>{var p;return((p=t.querySelector(i))==null?void 0:p.value)??""},o=(i,p=0)=>{const u=parseFloat(a(i));return Number.isFinite(u)?u:p},s=a("#nf-npagas"),n=s==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(s,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:n,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",pa),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:e}}function Qs(t,e,a,o){const s=ke(t,e),n=e.reduce((m,d)=>m+(d.importe||0)*12,0),i=Math.max(0,s.bruto-n),p=i*(s.ssPct/100),u=s.irpfModo==="manual"?i*(s.irpfPct/100):ct(yt(s.bruto,n),a.tramos),l=i-p-u,x=i/s.nPagas,v=p/s.nPagas,r=u/s.nPagas,b=x-v-r,g=s.grupoNomina?a.nominas.filter(m=>m.grupoNomina===s.grupoNomina&&m._id!==o):[],$=g.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${c(s.grupoNomina)}" con ${c(g.map(m=>m.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",I=n>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${c(z(n))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${c(z(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${c(z(s.bruto))}</span>
      ${I}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${c(z(p))} (${s.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${c(z(u))} (${i>0?(u/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${c(z(l))}</span>
      ${n>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${c(z(n))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${c(z(b))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${s.representacion==="simplificado"?`ingreso ${c(z(b))}/paga`:`ingreso ${c(z(x))} − SS ${c(z(v))} − IRPF ${c(z(r))}`}${n>0?" + recargas flex":""}</span>
    </div>${$}`}function Zs(t,e,a,o){const s=()=>{const p=t.querySelector("#flex-comp-container");p&&(p.innerHTML=Ks(e,a.accounts))},n=()=>{const p=t.querySelector("#nf-preview");p&&(p.innerHTML=Qs(t,e,a,o))},i=()=>{var u,l;const p=(x,v)=>{const r=t.querySelector(x);r&&(r.style.display=v?"":"none")};p("#nf-custom-pagas-wrap",((u=t.querySelector("#nf-npagas"))==null?void 0:u.value)==="custom"),p("#nf-irpfpct-wrap",((l=t.querySelector("#nf-irpfmodo"))==null?void 0:l.value)==="manual"),n()};t.addEventListener("input",p=>{var u;(u=p.target)!=null&&u.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&n()}),W(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),j(t,"[data-flex-anadir]",()=>{var l,x,v;const p=((l=t.querySelector("#fc-tipo"))==null?void 0:l.value)||"transporte",u=parseFloat(((x=t.querySelector("#fc-importe"))==null?void 0:x.value)??"")||0;if(!u)return E("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:p,importe:u,cuenta:((v=t.querySelector("#fc-cuenta"))==null?void 0:v.value)||""}),s(),n()}),j(t,"[data-flex-borrar]",p=>{e.splice(Number(p.getAttribute("data-flex-borrar")),1),s(),n()}),s(),n()}const Oe=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function tn(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var r;return(r=o())==null?void 0:r.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??ft;function p(r,b){const g=o(),$=s();return!g||!$?null:($.innerHTML=`<div class="modal-title">${c(r)}</div>${b}`,g.classList.remove("hidden"),j($,"[data-cerrar]",n),$)}function u(){e=null;const r=[...t.store.get("tramosIRPFHistorico")].sort(($,I)=>$.año-I.año),b="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=p("Tramos IRPF por ejercicio",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
        Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${b}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(Oe(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${r.map($=>`<div style="${b}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(Oe($.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tabla="${$.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tabla="${$.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="irpf-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);g&&(j(g,"[data-editar-tabla]",$=>{const I=$.getAttribute("data-editar-tabla");v(I==="default"?"default":Number(I))}),j(g,"[data-borrar-tabla]",$=>{const I=Number($.getAttribute("data-borrar-tabla"));tt(`¿Eliminar la tabla del ejercicio ${I}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(m=>m.año!==I)),E(`Tabla ${I} eliminada`),t.onDatosCambiados(),u())}),j(g,"[data-anadir-anyo]",()=>{var m;const $=parseInt(((m=g.querySelector("#irpf-new-year"))==null?void 0:m.value)??"",10);if(!$||$<2e3||$>2100)return E("Año inválido","err");const I=t.store.get("tramosIRPFHistorico");if(I.some(d=>d.año===$))return E("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...I,{_id:Date.now().toString(36),año:$,tramos:i().map(d=>[...d])}]),t.onDatosCambiados(),v($)}))}function l(){return a.map(([r,b],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${g}" value="${r}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${g}" value="${b}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function x(r){a=[...r.querySelectorAll("[data-tr-min]")].map((g,$)=>{const I=r.querySelector(`[data-tr-pct="${$}"]`);return[parseFloat(g.value)||0,parseFloat((I==null?void 0:I.value)??"")||0]})}function v(r){var d;e=r;const b=t.store.get("tramosIRPFHistorico");a=(r==="default"?i():((d=b.find(f=>f.año===r))==null?void 0:d.tramos)??i()).map(f=>[...f]);const $=r==="default"?"tabla por defecto":`ejercicio ${r}`,I=p(`Tramos IRPF — ${r==="default"?"Por defecto":r}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${c($)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!I)return;const m=()=>{const f=I.querySelector("#irpf-tramos-rows");f&&(f.innerHTML=l())};j(I,"[data-volver]",u),j(I,"[data-tr-anadir]",()=>{x(I),a.push([0,0]),m()}),j(I,"[data-tr-borrar]",f=>{x(I),a.splice(Number(f.getAttribute("data-tr-borrar")),1),m()}),j(I,"[data-tr-guardar]",()=>{x(I);const f=[...a].sort((A,h)=>A[0]-h[0]);if(f.length===0)return E("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:f}),E("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(A=>A.año===e?{...A,tramos:f}:A)),E(`Tabla ${e} guardada`)),t.onDatosCambiados(),u()})}return{abrir:u}}const Be=1500,Mt=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,an=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([s,n])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(n)}</option>`).join("")}
   </select></div>`,en=t=>(t.modeloFondo||"cuenta")==="pension";function on(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(s=>sn(s,e,a,o)).join("")}</div>`}function sn(t,e,a,o){const s=Xt(t);if(!s)return"";const n=ua(t,e,a),i=o.slice(0,4),p=(t.aportaciones||[]).filter(l=>l.fecha>=`${i}-01-01`).reduce((l,x)=>l+x.cantidad,0),u=Math.min(p,Be)*(n/100);return`<div class="card">
    <div class="flex justify-between items-center mb-10">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${c(t.nombre)}</span>
        <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
        ${t.grupoNomina?`<span class="badge badge-blue">Grupo: ${c(t.grupoNomina)}</span>`:""}
      </div>
      <div class="flex gap-8">
        <button class="btn-icon" data-editar-pension="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger btn-sm" data-borrar-pension="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2" style="gap:6px;margin-bottom:8px">
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${c(z(s.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(z(s.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${s.beneficio>=0?"pos":"neg"}">${c(z(s.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(z(s.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(z(s.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${p>Be?"neg":""}">${c(z(p))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${c(z(u))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${c(t.grupoNomina)}": ${n}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${s.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${c(s.proxDesbloqueo)}</div>`:""}
  </div>`}function nn(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${c(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${c(z(a.importe))} / ${c(a.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${c(a.fechaFin||"indefinido")}</span>
        <button class="btn-danger btn-sm" data-aport-borrar="${o}">✕</button>
      </div>`).join("")||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin aportaciones programadas</div>'}</div>
    <div class="grid-2 mt-6" style="gap:6px">
      <input class="form-input" type="number" id="paport-importe" placeholder="Importe €" style="font-size:12px"/>
      <select class="form-select" id="paport-periodo" style="font-size:12px">
        ${[["mensual","Mensual"],["trimestral","Trimestral"],["semestral","Semestral"],["anual","Anual"]].map(([a,o])=>`<option value="${a}">${o}</option>`).join("")}
      </select>
    </div>
    <div class="grid-2 mt-4" style="gap:6px">
      <input class="form-input" type="date" id="paport-inicio" style="font-size:12px"/>
      <input class="form-input" type="date" id="paport-fin" style="font-size:12px"/>
    </div>
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function rn(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,p)=>p.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,s=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],n=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${Mt("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${Mt("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Mt("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${Mt("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${Mt("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${an("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${Mt("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${n?' style="display:none"':""}>
        ${Mt("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
      </div>
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Grupo (para IRPF marginal real)</label>
      <select class="form-select" id="pen-grupo">
        <option value="">Sin grupo — usar tipo fijo</option>
        ${s.map(i=>`<option value="${c(i)}"${(t==null?void 0:t.grupoNomina)===i?" selected":""}>${c(i)}</option>`).join("")}
      </select>
      ${s.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Crea grupos en las nóminas para poder seleccionarlos aquí.</div>':""}
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Aportaciones programadas</label>
      <div id="pen-aport-container"></div>
    </div>
    <div class="form-group mt-8"><label class="form-label">Descripción</label>
      <input class="form-input" type="text" id="pen-desc" value="${c((t==null?void 0:t.descripcion)??"")}" placeholder="Plan de pensiones..."/></div>
    <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
      <label class="form-label">Activo</label>
      <label class="toggle"><input type="checkbox" id="pen-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      <label class="form-label" style="margin-left:12px">Simulación</label>
      <label class="toggle"><input type="checkbox" id="pen-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
    </div>
    ${Ut(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"pen-escenario")}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function cn(t,e,a){const o=()=>{const s=t.querySelector("#pen-aport-container");s&&(s.innerHTML=nn(e))};W(t,"#pen-grupo",s=>{const n=t.querySelector("#pen-impuesto-wrap");n&&(n.style.display=s.value?"none":"")}),j(t,"[data-aport-anadir]",()=>{var n,i,p,u;const s=parseFloat(((n=t.querySelector("#paport-importe"))==null?void 0:n.value)??"")||0;if(!s)return E("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((p=t.querySelector("#paport-inicio"))==null?void 0:p.value)||a,fechaFin:((u=t.querySelector("#paport-fin"))==null?void 0:u.value)||""}),o()}),j(t,"[data-aport-borrar]",s=>{e.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function ln(t,e,a,o){var I;const s=m=>{var d;return((d=t.querySelector(m))==null?void 0:d.value)??""},n=(m,d=0)=>{const f=parseFloat(s(m));return Number.isFinite(f)?f:d},i=m=>{var d;return!!((d=t.querySelector(m))!=null&&d.checked)},p=s("#pen-nombre").trim();if(!p)return{datos:{},error:"Nombre obligatorio"};const u=n("#pen-saldo"),l=s("#pen-grupo"),x={nombre:p,grupoNomina:l,saldo:u,saldoInicial:n("#pen-saldo-ini"),fechaInicialSaldo:s("#pen-fecha-ini")||o,interes:n("#pen-interes"),periodoCobro:s("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(s("#pen-bloqueo"),10)||120,impuestoRetirada:l?0:n("#pen-impuesto"),planAportaciones:e,descripcion:s("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(m=>m.value)},v=[...(a==null?void 0:a.historicoSaldos)??[]],r=[...(a==null?void 0:a.aportaciones)??[]],g=((I=[...v].sort((m,d)=>d.fecha.localeCompare(m.fecha))[0])==null?void 0:I.saldo)??(a==null?void 0:a.saldo)??null,$=Date.now().toString(36);return a?(g===null||Math.abs(u-g)>.005)&&(v.push({_id:$,fecha:o,saldo:u,nota:"Actualización manual"}),u>(g??0)&&r.push({_id:`${$}a`,fecha:o,cantidad:u-(g??0)})):u>0&&(v.push({_id:$,fecha:o,saldo:u,nota:"Saldo inicial"}),r.push({_id:`${$}a`,fecha:x.fechaInicialSaldo??o,cantidad:u})),{datos:{...x,historicoSaldos:v,aportaciones:r}}}const dn="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function un(t){const e=t.hoy??V,a=()=>{var I;return(I=t.onDatosCambiados)==null?void 0:I.call(t)};function o(){const I=t.store.get("config");return vt(t.store.get("tramosIRPFHistorico"),I.tramos_irpf??ft)(Number(e().slice(0,4)))}function s(I,m,d){const f=fa(I,m,d),A=!!m&&I.irpfModo!=="manual",h=[I.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${I.mesActualizacionIPC}">IPC m${I.mesActualizacionIPC}</span>`:"",f.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${c(z(f.flexAnual))}/año</span>`:"",Math.abs(f.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${f.ssPct.toFixed(2)}%</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(I.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${h}</div>
      </div>
      <div class="num">${c(z(f.brutoAnual))}
        ${f.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${c(z(f.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${c(z(f.netoPorPaga))}/paga neto</div></div>
      <div class="text-sm">${f.nPagas} pagas</div>
      <div class="text-sm ${A?"neg":""}">${I.irpfModo==="manual"?`${c(I.irpfPct??0)}% (manual)`:`${f.irpfPct.toFixed(1)}% (auto)`}${A?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${I.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${c(n(I.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${c(I._id)}"${I.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${c(I._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${c(I._id)}">✕</button>
      </div>
    </div>`}const n=I=>{var m;return((m=t.store.get("accounts").find(d=>d._id===(I||"default")))==null?void 0:m.nombre)??(I||"default")};function i(I,m,d){const f=m.reduce((y,w)=>y+(w.bruto||0),0),A=ro(m,d),h=f>0?A/f*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${c(I)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${c(z(f))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${h.toFixed(1)}%</strong> (${c(z(A))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${m.map(y=>s(y,m,d)).join("")}
      </div>
    </div>`}function p(I){const m=o(),d=[...t.store.get("nominas")].sort((w,S)=>(S.bruto||0)-(w.bruto||0)),{grupos:f,sueltas:A}=lo(d),h=t.store.get("accounts").filter(en),y=d.filter(w=>w.activo!==!1);I.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${d.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...f.entries()].map(([w,S])=>i(w,S,m)).join("")}
      ${A.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${A.map(w=>s(w,null,m)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${on(h,y,m,e())}</div>`}const u=()=>document.getElementById("modal-overlay"),l=()=>document.getElementById("modal-content"),x=()=>{var I;return(I=u())==null?void 0:I.classList.add("hidden")};function v(I,m){const d=u(),f=l();return!d||!f?null:(f.innerHTML=`<div class="modal-title">${c(I)}</div>${m}`,d.classList.remove("hidden"),j(f,"[data-cancelar]",x),f)}function r(I,m){const d=I?t.store.get("nominas").find(y=>y._id===I)??null:null,f=[...(d==null?void 0:d.retribucionFlexible)??[]].map(y=>({...y})),A={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:o(),hoy:e()},h=v(I?"Editar nómina":"Nueva nómina",Xs(d,A));h&&(Zs(h,f,A,I??""),j(h,"[data-guardar-nomina]",y=>{const w=ke(h,f);if(!w.nombre||w.bruto<=0)return E("Nombre y bruto anual son obligatorios","err");const S=y.getAttribute("data-guardar-nomina")||"",M={...w,activo:!0,tags:["nomina"]};S?(t.store.updateItem("nominas",S,M),E("Nómina actualizada")):(t.store.addItem("nominas",M),E("Nómina creada")),a(),x(),m()}))}function b(I,m){const d=I?t.store.get("accounts").find(h=>h._id===I)??null:null,f=[...(d==null?void 0:d.planAportaciones)??[]].map(h=>({...h})),A=v(I?"Editar plan de pensiones":"Nuevo plan de pensiones",rn(d,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:e()}));A&&(cn(A,f,e()),j(A,"[data-guardar-pension]",h=>{const{datos:y,error:w}=ln(A,f,d,e());if(w)return E(w,"err");const S=h.getAttribute("data-guardar-pension")||"";S?(t.store.updateItem("accounts",S,y),E("Plan actualizado")):(t.store.addItem("accounts",y),E("Plan creado")),a(),x(),m()}))}function g(I,m,d){j(I,"[data-nueva-nomina]",()=>r(null,m)),j(I,"[data-editar-nom]",f=>r(f.getAttribute("data-editar-nom"),m)),j(I,"[data-borrar-nom]",f=>{tt("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",f.getAttribute("data-borrar-nom")),E("Eliminada"),a(),m())}),W(I,"[data-activo-nom]",f=>{const A=f;t.store.updateItem("nominas",A.getAttribute("data-activo-nom"),{activo:A.checked}),a(),m()}),j(I,"[data-tramos]",()=>d.abrir()),j(I,"[data-nueva-pension]",()=>b(null,m)),j(I,"[data-editar-pension]",f=>b(f.getAttribute("data-editar-pension"),m)),j(I,"[data-borrar-pension]",f=>{tt("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",f.getAttribute("data-borrar-pension")),E("Plan eliminado"),a(),m())})}let $=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:dn,mount(I){const m=()=>p(I);$??($=tn({store:t.store,onDatosCambiados:()=>{a(),m()},año:()=>Number(e().slice(0,4))})),p(I),I.dataset.wired!=="1"&&(g(I,m,$),I.dataset.wired="1")}}}const pn="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",mn="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",He={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},fn={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function vn(t,e){const a=t.filter(u=>u.activo&&dt(u)==="inversion");if(a.length===0)return"";let o=0,s=0,n=0,i=0;for(const u of a){const l=Ft(u,e);l&&(o+=l.saldo,s+=l.costBase,n+=l.plusvalia,i+=l.impuesto)}const p=s>0?(n/s*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${c(z(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${c(z(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${c(p)}%)</div><div class="stat-value ${n>=0?"pos":"neg"}">${c(z(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${c(z(i))}</div><div class="stat-sub">Neto: ${c(z(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function gn(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,s=Math.max(1,(N(o).getTime()-N(a).getTime())/(30.44*864e5)),n=Rt(t,a),i=n*(Math.pow(1+t.interes/100,s/12)-1);let p="";if(e.config.usarInflacion&&e.inflacion.length>0){const u=n*(lt(e.inflacion,a,o)-1),l=i-u;p=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${c(z(u))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${l>=0?"var(--accent)":"var(--red)"};font-weight:600">${c(z(l))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${c(a.slice(0,7))} → ${c(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${c(z(i))}</span>
    </div>${p}
  </div>`}function bn(t,e){const a=He[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,s=e.nominas.flatMap(b=>(b.retribucionFlexible??[]).filter(g=>g.cuenta===t._id).map(g=>({nomina:b,importe:g.importe}))),n=s.reduce((b,g)=>b+g.importe,0),i=n*12,p=o!==null&&i>o,u=o!==null?Math.min(i,o):i,l=t.grupoNomina?e.nominas.filter(b=>(b.grupoNomina||"")===t.grupoNomina&&b.activo!==!1):s.slice(0,1).map(b=>b.nomina),x=Xa(l,e.tramosIRPF),v=u*x/100,r=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${x}%`:`tipo marginal ${x}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${c(a.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${c(z(n))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${p?"neg":"pos"}">${c(z(i))}/año${p?` ⚠ excede límite ${c(z(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${c(z(o))}/año</span></div>`:""}
    ${v>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${c(r)}">≈ ${c(z(v))}/año <span style="font-size:10px;color:var(--text3)">(${c(x)}%)</span></span></div>`:""}
    ${s.length>0?s.map(b=>`<div style="font-size:11px;color:var(--text3)">↩ ${c(b.nomina.nombre)}: ${c(z(b.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function hn(t){const e=Xt(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(z(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(z(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${c(z(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${c(z(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${c(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${c(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function yn(t,e){const a=Ft(t,e.tramosGanancias);if(!a)return"";const o=e.config,s=e.flujos(t._id),n=N(o.dashboardStart),i=N(o.dashboardEnd),p=Math.max(0,(i.getTime()-n.getTime())/(30.44*864e5)),u=a.saldo+s.totalAportaciones-s.totalReembolsos,l=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,x=u>0&&p>0?Math.max(0,u*Math.pow(1+l,p)):Math.max(0,u),v=a.costBase+s.totalAportaciones,r=Math.max(0,x-v),b=da(r,e.tramosGanancias),g=r>0?(b/r*100).toFixed(1):"0",$=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",I=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",m=(w,S,M)=>w.map(C=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${S} ${c(C.contraparte)}: ${c(C.concepto)}</span>
          <span class="num ${M}">${c(z(C.total))} · ${C.ocurrencias} mov.</span>
        </div>`).join(""),f=s.entradas.length>0||s.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${c(o.dashboardStart.slice(0,7))} → ${c(o.dashboardEnd.slice(0,7))})</div>
         ${m(s.entradas,"↓","pos")}
         ${m(s.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${s.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${c(z(s.totalAportaciones))}</span></div>`:""}
           ${s.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${c(z(s.totalReembolsos))}</span></div>`:""}
           ${s.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${c(z(s.retencion))}</span></div>`:s.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',A=e.invModo(t._id),h=w=>`padding:3px 10px;border-radius:20px;border:1px solid ${w?"var(--accent)":"var(--border)"};background:${w?"var(--accent-dim)":"transparent"};color:${w?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,y=A==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(z(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${c(z(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${c(z(a.neto))}</div><div class="stat-sub">${c(I)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${c(z(v))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${c(z(x))}</div><div class="stat-sub">${c($)} · ${c(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${c(z(x-b))}</div><div class="stat-sub">${c(g)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${c(t._id)}|real" style="${h(A==="real")}">Real</button>
          <button data-inv-modo="${c(t._id)}|proyeccion" style="${h(A==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${y}
      ${f}
    </div>`}function xn(t,e){const a=[...t.historicoSaldos||[]].sort((u,l)=>l.fecha.localeCompare(u.fecha)),o=a[0],s=it(t),n=dt(t),i=t.esCuentaPrincipal,p=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",n==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",n==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",n==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${c((He[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(u=>`<span class="badge badge-yellow">🔭 ${c(e.nombreEscenario(u))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${c(t.nombre)}</span>
        ${p}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${c(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${c(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${mn}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${pn}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${c(z(t.saldoInicial||0))}</div><div class="stat-sub">${c(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${c(z(s))}</div>${o?`<div class="stat-sub">Registro: ${c(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${c(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${c(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${gn(t,e)}
    ${n==="beneficio"?bn(t,e):""}
    ${n==="pension"?hn(t):""}
    ${n==="inversion"?yn(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${c(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${c(t.descripcion)}</div>`:""}
  </div>`}const $n=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function In(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${c(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${c(z(a.importe))} / ${c(a.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${c(a.fechaFin||"indefinido")}</span>
        <button class="btn-danger btn-sm" data-aport-borrar="${o}">✕</button>
      </div>`).join("")||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin aportaciones programadas</div>'}</div>
    <div class="grid-2 mt-6" style="gap:6px">
      <input class="form-input" type="number" id="aport-importe" placeholder="Importe €" style="font-size:12px"/>
      <select class="form-select" id="aport-periodo" style="font-size:12px">
        ${[["mensual","Mensual"],["trimestral","Trimestral"],["semestral","Semestral"],["anual","Anual"]].map(([a,o])=>`<option value="${a}">${o}</option>`).join("")}
      </select>
    </div>
    <div class="grid-2 mt-4" style="gap:6px">
      <input class="form-input" type="date" id="aport-inicio" style="font-size:12px"/>
      <input class="form-input" type="date" id="aport-fin" style="font-size:12px"/>
    </div>
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function An(t,e){const a=t?dt(t):"cuenta",o=[...new Set(e.nominas.filter(n=>n.grupoNomina).map(n=>n.grupoNomina))],s=n=>n?"":' style="display:none"';return`
    <div class="grid-2">
      ${K("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${_t("ac-modelo","Tipo",$n,a)}
    </div>
    <div class="grid-2 mt-8">
      ${K("ac-saldo","Saldo actual (€)","number",e.saldoActual,"5000")}
      ${K("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${K("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${K("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="form-row mt-8">
      <label class="form-label">Activa</label>
      <label class="toggle"><input type="checkbox" id="ac-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
    </div>

    <details class="form-advanced mt-12"${t?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="mt-8">
          ${_t("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
        </div>
        <div id="ac-inversion-hint"${s(a==="inversion")}>
          <div class="auth-hint mt-8" style="border-color:#10b981">
            📈 <strong>Fondo de inversión:</strong> la tarjeta muestra la plusvalía latente y el impuesto estimado
            sobre ganancias de capital con los tramos configurados en esta misma vista.
          </div>
        </div>
        <div id="ac-beneficio-fields"${s(a==="beneficio")}>
          <div class="auth-hint mt-8" style="border-color:var(--accent)">
            🎫 <strong>Tarjeta beneficio:</strong> se recarga mensualmente desde la nómina. Los gastos
            (metro, restaurante) se registran como movimientos sobre esta cuenta.
          </div>
          <div class="form-group mt-8">
            ${_t("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
          </div>
          <div class="form-group mt-8">
            <label class="form-label">Grupo de nóminas (para el tipo marginal de IRPF)</label>
            <select class="form-select" id="ac-beneficio-grupo">
              <option value="">Sin grupo — usar la primera nómina vinculada</option>
              ${o.map(n=>`<option value="${c(n)}"${(t==null?void 0:t.grupoNomina)===n?" selected":""}>${c(n)}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Aportaciones programadas</label>
          <div id="ac-aport-container"></div>
        </div>
        <div class="form-group mt-8"><label class="form-label">Descripción</label>
          <input class="form-input" type="text" id="ac-desc" value="${c((t==null?void 0:t.descripcion)??"")}" placeholder="Fondo indexado global..."/></div>
        <div class="form-row mt-8">
          <label class="form-label">Simulación</label>
          <label class="toggle"><input type="checkbox" id="ac-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
        </div>
        ${Ut(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"ac-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function wn(t,e,a){const o=()=>{const s=t.querySelector("#ac-aport-container");s&&(s.innerHTML=In(e))};W(t,"#ac-modelo",s=>{const n=s.value,i=(p,u)=>{const l=t.querySelector(p);l&&(l.style.display=u?"":"none")};i("#ac-inversion-hint",n==="inversion"),i("#ac-beneficio-fields",n==="beneficio")}),j(t,"[data-aport-anadir]",()=>{var n,i,p,u;const s=parseFloat(((n=t.querySelector("#aport-importe"))==null?void 0:n.value)??"")||0;if(!s)return E("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((p=t.querySelector("#aport-inicio"))==null?void 0:p.value)||a,fechaFin:((u=t.querySelector("#aport-fin"))==null?void 0:u.value)||""}),o()}),j(t,"[data-aport-borrar]",s=>{e.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function Sn(t,e,a,o,s){const n=g=>{var $;return(($=t.querySelector(g))==null?void 0:$.value)??""},i=(g,$=0)=>{const I=parseFloat(n(g));return Number.isFinite(I)?I:$},p=g=>{var $;return!!(($=t.querySelector(g))!=null&&$.checked)},u=n("#ac-nombre").trim();if(!u)return{datos:{},error:"Nombre obligatorio"};const l=n("#ac-modelo")||"cuenta",x=l==="beneficio",v=i("#ac-saldo"),r={nombre:u,saldo:v,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:n("#ac-fecha-ini")||s,interes:i("#ac-interes"),periodoCobro:n("#ac-periodo")||"mensual",descripcion:n("#ac-desc").trim(),activo:p("#ac-activo"),simulacion:p("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(g=>g.value),modeloFondo:l,planAportaciones:e,tipoBeneficio:x?n("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:x?n("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&v<=0)return{datos:r};if(!(o===null||Math.abs(v-o)>.005))return{datos:r};if(l==="inversion"&&v>(o??0)){const g=Date.now().toString(36);r.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${g}a`,fecha:a?s:r.fechaInicialSaldo??s,cantidad:v-(o??0)}]}return{datos:r,punto:{fecha:s,saldo:v,nota:a?"Actualización manual":"Saldo inicial"}}}function Fa(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:ot(e.saldoCts),nota:e.nota}))}function Mn(t,e,a,o,s){const n=a.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${c(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${c(z(i.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${c(i.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${c(e)}|${c(i._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${c(e)}|${c(i._id)}">✕</button>
      </div>`).join("");return`
    <div class="card-title">Histórico — ${c(t)}</div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${a.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':n}
    </div>
    <div class="divider"></div>
    <div class="card-title">Añadir punto de control</div>
    <div class="grid-3">
      <div class="form-group"><label class="form-label">Fecha</label>
        <input class="form-input" type="date" id="hi-fecha" value="${c(s)}"/></div>
      <div class="form-group"><label class="form-label">Saldo real (€)</label>
        <input class="form-input" type="number" id="hi-saldo" placeholder="5000"/></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="hi-nota" placeholder="Extracto enero..."/></div>
    </div>
    <div class="flex gap-8 mt-12" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cerrar</button>
      <button class="btn-primary" data-hist-anadir="${c(e)}">Añadir</button>
    </div>`}const Ge=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function Cn(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var r;return(r=o())==null?void 0:r.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??At;function p(r,b){const g=o(),$=s();return!g||!$?null:($.innerHTML=`<div class="modal-title">${c(r)}</div>${b}`,g.classList.remove("hidden"),j($,"[data-cerrar]",n),$)}function u(){e=null;const r=[...t.store.get("tramosGananciasCapitalHistorico")].sort(($,I)=>$.año-I.año),b="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=p("Tramos — Ganancias de capital",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tramos marginales de la base del ahorro (art. 49 LIRPF): plusvalías de fondos, intereses y dividendos.
        Un ejercicio sin tabla propia usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${b}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(Ge(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${r.map($=>`<div style="${b}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(Ge($.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tg="${$.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tg="${$.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="tg-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo-tg>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);g&&(j(g,"[data-editar-tg]",$=>{const I=$.getAttribute("data-editar-tg");v(I==="default"?"default":Number(I))}),j(g,"[data-borrar-tg]",$=>{const I=Number($.getAttribute("data-borrar-tg"));tt(`¿Eliminar la tabla del ejercicio ${I}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(m=>m.año!==I)),E(`Tabla ${I} eliminada`),t.onDatosCambiados(),u())}),j(g,"[data-anadir-anyo-tg]",()=>{var m;const $=parseInt(((m=g.querySelector("#tg-new-year"))==null?void 0:m.value)??"",10);if(!$||$<2e3||$>2100)return E("Año inválido","err");const I=t.store.get("tramosGananciasCapitalHistorico");if(I.some(d=>d.año===$))return E("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...I,{_id:Date.now().toString(36),año:$,tramos:i().map(d=>[...d])}]),t.onDatosCambiados(),v($)}))}function l(){return a.map(([r,b],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${g}" value="${r}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${g}" value="${b}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function x(r){a=[...r.querySelectorAll("[data-tg-min]")].map((b,g)=>{const $=r.querySelector(`[data-tg-pct="${g}"]`);return[parseFloat(b.value)||0,parseFloat(($==null?void 0:$.value)??"")||0]})}function v(r){var m;e=r;const b=t.store.get("tramosGananciasCapitalHistorico");a=(r==="default"?i():((m=b.find(d=>d.año===r))==null?void 0:m.tramos)??i()).map(d=>[...d]);const $=p(`Ganancias de capital — ${r==="default"?"Por defecto":r}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!$)return;const I=()=>{const d=$.querySelector("#tg-rows");d&&(d.innerHTML=l())};j($,"[data-volver-tg]",u),j($,"[data-tg-anadir]",()=>{x($),a.push([0,0]),I()}),j($,"[data-tg-borrar]",d=>{x($),a.splice(Number(d.getAttribute("data-tg-borrar")),1),I()}),j($,"[data-tg-guardar]",()=>{x($);const d=[...a].sort((f,A)=>f[0]-A[0]);if(d.length===0)return E("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:d}),E("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(f=>f.año===e?{...f,tramos:d}:f)),E(`Tabla ${e} guardada`)),t.onDatosCambiados(),u()})}return{abrir:u}}const Pa=["#00e5a0","#4d9fff","#ffd166","#ff4d6d","#a855f7","#fb923c"],zn="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z";function Fn(t){const e=()=>document.getElementById("modal-overlay"),a=()=>document.getElementById("modal-content"),o=()=>{var l;return(l=e())==null?void 0:l.classList.add("hidden")};function s(l,x,v,r){const b=Ga(l,v,r),g=l.targetAmount||0,$=g>0?Math.min(100,b/g*100):0,I=!l.completado&&g>0&&b>=g,m=l.targetDate?Math.max(0,Math.round((N(l.targetDate).getTime()-N(t.hoy()).getTime())/(30.44*864e5))):null,d=m!==null&&m>0?Math.max(0,g-b)/m:null,f=!l.completado&&!I?Va(l,v,{extractoCuenta:t.extractoCuenta,colchonEnFecha:t.colchonEnFecha,hoy:N(t.hoy())}):null,A=(l.cuentaIds||[]).length>0?(l.cuentaIds||[]).map(M=>{var C;return((C=v.find(P=>P._id===M))==null?void 0:C.nombre)??M}).join(", "):"Todas las cuentas activas",h=[l.completado?'<span class="badge badge-active">✓ Completado</span>':"",I?'<span class="badge" style="background:rgba(0,229,160,0.2);color:var(--accent)">🎉 ¡Meta alcanzada!</span>':"",l.usarColchon!==!1?'<span class="badge badge-inactive" title="Colchón descontado del saldo">🛡 −colchón</span>':""].join(""),y=$>=100?"var(--accent)":$>=70?"var(--yellow)":"var(--text2)",w=["card mb-8",l.completado?"goal-completado":"",I?"goal-alcanzado":""].filter(Boolean).join(" "),S=[d!==null?`<span>Necesitas ${c(z(d))}/mes</span>`:"",l.targetDate?`<span>Meta fijada: ${c(l.targetDate)}</span>`:"",f?`<span style="color:var(--accent)">📈 Estimado: ${c(f)}</span>`:!l.completado&&!I?'<span style="color:var(--text3)">Sin proyección</span>':"",l.usarColchon!==!1?`<span>Colchón: ${c(z(r))}</span>`:"",`<span>Cuentas: ${c(A)}</span>`].join("");return`<div class="${w}" style="padding:14px;border:1px solid ${I?"var(--accent)":"var(--border)"}">
      <div class="flex justify-between items-center mb-8">
        <div class="flex gap-8 items-center flex-wrap">
          <span class="goal-priority-badge">#${c(l.prioridad||x+1)}</span>
          <span style="font-weight:600;font-size:14px${l.completado?";text-decoration:line-through;color:var(--text3)":""}">${c(l.nombre)}</span>
          ${h}
        </div>
        <div class="flex gap-8">
          ${I?`<button class="btn-primary btn-sm" data-completar-goal="${c(l._id)}">Marcar completado</button>`:""}
          <button class="btn-icon" data-editar-goal="${c(l._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${zn}"/></svg></button>
          <button class="btn-danger btn-sm" data-borrar-goal="${c(l._id)}">✕</button>
        </div>
      </div>
      <div class="flex justify-between mb-4">
        <span class="text-sm">${c(z(b))} / ${c(z(g))}</span>
        <span class="text-sm" style="color:${y}">${$.toFixed(0)}%${m!==null?` · ${m}m restantes`:""}</span>
      </div>
      <div class="goal-bar"><div class="goal-bar-fill" style="width:${$}%;background:${c(l.color||"var(--accent)")}"></div></div>
      <div class="flex gap-12 mt-8 flex-wrap" style="font-size:11px;color:var(--text3)">${S}</div>
    </div>`}function n(l){const x=[...t.store.get("goals")].sort((b,g)=>(b.prioridad||99)-(g.prioridad||99)),v=t.store.get("accounts"),r=t.colchonEnFecha(t.hoy());l.innerHTML=`
      <div class="flex justify-between items-center mb-12">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro</div>
        <button class="btn-primary btn-sm" data-nuevo-goal>+ Objetivo</button>
      </div>
      ${x.length===0?'<div class="text-sm" style="color:var(--text3)">Sin objetivos. Define metas de ahorro para seguirlas aquí y en el Dashboard.</div>':x.map((b,g)=>s(b,g,v,r)).join("")}`}function i(l){const x=t.store.get("accounts").filter($=>$.activo&&!$.simulacion),v=t.store.get("goals"),r=l?l.prioridad||1:Math.max(0,...v.map($=>$.prioridad||0))+1,b=(l==null?void 0:l.color)||Pa[0],g=x.map($=>`<label style="display:flex;gap:8px;align-items:center;font-size:13px;cursor:pointer">
          <input type="checkbox" class="goal-acc-check" value="${c($._id)}"${((l==null?void 0:l.cuentaIds)||[]).includes($._id)?" checked":""}/>
          ${c($.nombre)}
        </label>`).join("");return`
      <div class="form-group"><label class="form-label">Nombre del objetivo</label>
        <input class="form-input" type="text" id="goal-nombre" value="${c((l==null?void 0:l.nombre)??"")}" placeholder="Ej: Fondo de emergencia"/></div>
      <div class="grid-2 mt-8">
        <div class="form-group"><label class="form-label">Importe objetivo (€)</label>
          <input class="form-input" type="number" id="goal-amount" value="${c((l==null?void 0:l.targetAmount)??"")}" placeholder="10000"/></div>
        <div class="form-group"><label class="form-label">Fecha límite (opcional)</label>
          <input class="form-input" type="date" id="goal-date" value="${c((l==null?void 0:l.targetDate)??"")}"/></div>
      </div>

      <details class="form-advanced mt-12"${l?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="form-group mt-8"><label class="form-label">Prioridad (1 = mayor)</label>
            <input class="form-input" type="number" id="goal-prio" value="${c(r)}" placeholder="1"/></div>
          <div class="form-group mt-8">
            <label class="form-label">Cuentas a considerar (vacío = todas las activas)</label>
            <div style="display:flex;flex-direction:column;gap:6px;padding:8px;background:var(--bg3);border-radius:var(--radius)">
              ${g||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
            </div>
          </div>
          <div class="form-row mt-8">
            <label class="form-label">Descontar colchón económico</label>
            <label class="toggle"><input type="checkbox" id="goal-colchon"${(l==null?void 0:l.usarColchon)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
            <span class="text-sm" style="margin-left:6px;color:var(--text3)">Muestra el excedente sobre el mínimo de seguridad</span>
          </div>
          <div class="form-row mt-8">
            <label class="form-label">Marcar como completado</label>
            <label class="toggle"><input type="checkbox" id="goal-completado"${l!=null&&l.completado?" checked":""}/><span class="toggle-slider"></span></label>
          </div>
          <div class="form-group mt-8"><label class="form-label">Color</label>
            <select class="form-select" id="goal-color">
              ${Pa.map($=>`<option value="${$}"${$===b?" selected":""}>${$}</option>`).join("")}
            </select></div>
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-goal="${c((l==null?void 0:l._id)??"")}">Guardar</button>
      </div>`}function p(l,x){const v=l?t.store.get("goals").find(g=>g._id===l)??null:null,r=e(),b=a();!r||!b||(b.innerHTML=`<div class="modal-title">${l?"Editar objetivo":"Nuevo objetivo"}</div>${i(v)}`,r.classList.remove("hidden"),j(b,"[data-cancelar]",o),j(b,"[data-guardar-goal]",g=>{var f,A;const $=h=>{var y;return((y=b.querySelector(h))==null?void 0:y.value)??""},I=$("#goal-nombre").trim();if(!I)return E("Nombre obligatorio","err");const m={nombre:I,targetAmount:parseFloat($("#goal-amount"))||0,targetDate:$("#goal-date")||null,prioridad:parseInt($("#goal-prio"),10)||1,color:$("#goal-color")||Pa[0],usarColchon:!!((f=b.querySelector("#goal-colchon"))!=null&&f.checked),completado:!!((A=b.querySelector("#goal-completado"))!=null&&A.checked),cuentaIds:[...b.querySelectorAll(".goal-acc-check:checked")].map(h=>h.value)},d=g.getAttribute("data-guardar-goal")||"";d?(t.store.updateItem("goals",d,m),E("Actualizado")):(t.store.addItem("goals",m),E("Objetivo creado")),t.onDatosCambiados(),o(),x()}))}function u(l,x){j(l,"[data-nuevo-goal]",()=>p(null,x)),j(l,"[data-editar-goal]",v=>p(v.getAttribute("data-editar-goal"),x)),j(l,"[data-borrar-goal]",v=>{tt("¿Eliminar objetivo?")&&(t.store.removeItem("goals",v.getAttribute("data-borrar-goal")),E("Objetivo eliminado"),t.onDatosCambiados(),x())}),j(l,"[data-completar-goal]",v=>{t.store.updateItem("goals",v.getAttribute("data-completar-goal"),{completado:!0}),E("Objetivo marcado como completado ✓"),t.onDatosCambiados(),x()})}return{render:n,wire:u}}const Pn="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Tn=120;function jn(t){const e=t.hoy??V,a=()=>{var F;return(F=t.onDatosCambiados)==null?void 0:F.call(t)},o=t.mostrarObjetivos??(()=>!0),s=new Map,n=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),p=F=>{var T;return((T=i().find(_=>_._id===F))==null?void 0:T.nombre)??F},u=F=>{var T;return((T=t.store.get("accounts").find(_=>_._id===F))==null?void 0:T.nombre)??F},l=()=>vt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??ft)(Number(e().slice(0,4))),x=()=>vt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??At),v=()=>x()(Number(e().slice(0,4))),r=F=>pe(t.store.get("expenses"),n(),t.store.get("loans"),F);function b(){const F=n(),T=t.store.get("accounts"),_=Lt({loans:[],expenses:t.store.get("expenses").filter(L=>L.tipo==="transferencia"),accounts:T,config:{dashboardStart:F.dashboardStart,dashboardEnd:F.dashboardEnd,fechaReferencia:F.dashboardStart},nominas:[],resolverTramosGanancias:x()}),R=new Map,q=L=>{let H=R.get(L);return H||(H={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},R.set(L,H)),H},B=(L,H)=>{const Q=`${H.sourceId}`,D=L.find(U=>U.concepto===Q),k=D??{concepto:Q,contraparte:"",total:0,ocurrencias:0};k.total+=Math.abs(H.cuantia),k.ocurrencias+=1,D||L.push(k)};for(const L of _){if(!L.cuenta)continue;const H=q(L.cuenta);L.sourceType==="transfer-in"||L.sourceType==="traspaso-in"?(H.totalAportaciones+=Math.abs(L.cuantia),B(H.entradas,L)):L.sourceType==="transfer-out"||L.sourceType==="traspaso-out"?(H.totalReembolsos+=Math.abs(L.cuantia),B(H.salidas,L)):L.sourceType==="investment-tax"&&(H.retencion+=Math.abs(L.cuantia))}const G=t.store.get("expenses");for(const L of R.values())for(const[H,Q]of[[L.entradas,"cuenta"],[L.salidas,"cuentaDestino"]])for(const D of H){const k=G.find(U=>U._id===D.concepto);D.contraparte=u((k==null?void 0:k[Q])??"default"),D.concepto=(k==null?void 0:k.concepto)||(Q==="cuenta"?"Aportación":"Reembolso")}return R}function g(){const F=new Map,T=n(),_=e(),R=new Date(Number(_.slice(0,4)),Number(_.slice(5,7))-1+Tn+1,0),q=`${R.getFullYear()}-${String(R.getMonth()+1).padStart(2,"0")}-${String(R.getDate()).padStart(2,"0")}`;return B=>{const G=F.get(B._id);if(G)return G;const L=Lt({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...T,dashboardStart:_,dashboardEnd:q,fechaReferencia:_},filtroAccounts:[B._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:vt(t.store.get("tramosIRPFHistorico"),T.tramos_irpf??ft),resolverTramosGanancias:x()}).map(H=>({fecha:H.fecha,saldoAcum:H.saldoAcum}));return F.set(B._id,L),L}}const $=Fn({store:t.store,colchonEnFecha:r,extractoCuenta:F=>I(F),hoy:e,onDatosCambiados:a});let I=g();function m(F){I=g();const _=t.store.get("accounts").filter(G=>dt(G)!=="pension"),R=b(),q={config:n(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:l(),tramosGanancias:v(),nombreEscenario:p,flujos:G=>R.get(G)??fn,invModo:G=>s.get(G)??"proyeccion"};F.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${vn(_,q.tramosGanancias)}
      <div class="grid-3">${_.map(G=>xn(G,q)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const B=F.querySelector("#goals-section");B&&$.render(B)}const d=()=>document.getElementById("modal-overlay"),f=()=>document.getElementById("modal-content"),A=()=>{var F;return(F=d())==null?void 0:F.classList.add("hidden")};function h(F,T){const _=d(),R=f();return!_||!R?null:(R.innerHTML=F?`<div class="modal-title">${c(F)}</div>${T}`:T,_.classList.remove("hidden"),j(R,"[data-cancelar]",A),R)}function y(F,T){const _=F?t.store.get("accounts").find(G=>G._id===F)??null:null,R=[...(_==null?void 0:_.planAportaciones)??[]].map(G=>({...G})),q=_?w(_):null,B=h(F?"Editar cuenta / fondo":"Nueva cuenta / fondo",An(_,{escenarios:i(),nominas:t.store.get("nominas"),hoy:e(),saldoActual:q??0}));B&&(wn(B,R,e()),j(B,"[data-guardar-acc]",G=>{const L=G.getAttribute("data-guardar-acc")||"",{datos:H,punto:Q,error:D}=Sn(B,R,_,q,e());if(D)return E(D,"err");let k=L;L?t.store.updateItem("accounts",L,H):k=t.store.addItem("accounts",H)._id,Q&&t.ledger.registrarPuntoControl(k,Q.fecha,Q.saldo,Q.nota),E(L?"Actualizada":"Cuenta / fondo creado"),a(),A(),T()}))}function w(F){const T=t.ledger.puntosControl(F._id);return T.length>0?Fa(T)[0].saldo:F.saldo??null}function S(F,T){const _=t.store.get("accounts").find(B=>B._id===F);if(!_)return;const R=h("Histórico de saldos",Mn(_.nombre,F,Fa(t.ledger.puntosControl(F)),_.saldoInicial||0,e()));if(!R)return;const q=()=>{T(),S(F,T)};j(R,"[data-hist-anadir]",()=>{var H,Q,D;const B=((H=R.querySelector("#hi-fecha"))==null?void 0:H.value)??"",G=parseFloat(((Q=R.querySelector("#hi-saldo"))==null?void 0:Q.value)??""),L=((D=R.querySelector("#hi-nota"))==null?void 0:D.value.trim())??"";if(!B||!Number.isFinite(G))return E("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(F,B,G,L||void 0),E("Punto añadido"),a(),q()}),j(R,"[data-hist-borrar]",B=>{const[,G]=(B.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(G),E("Eliminado"),a(),q()}),j(R,"[data-hist-inicial]",B=>{const[G,L]=(B.getAttribute("data-hist-inicial")||"").split("|"),H=t.ledger.puntosControl(G).find(D=>D._id===L);if(!H)return;const Q=Fa([H])[0].saldo;t.store.updateItem("accounts",G,{saldoInicial:Q,fechaInicialSaldo:H.fecha}),E(`Punto inicial → ${H.fecha} (${z(Q)})`),a(),q()})}function M(F){const T=t.store.get("accounts").filter(q=>q.activo);if(T.length===0)return E("No hay cuentas activas","err");const _=e(),R=T.map(q=>`• ${q.nombre}: ${z(w(q)??q.saldoInicial??0)}`).join(`
`);if(tt(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${_})?

${R}

Esto recalibra el punto de arranque del dashboard.`)){for(const q of T)t.store.updateItem("accounts",q._id,{saldoInicial:w(q)??q.saldoInicial??0,fechaInicialSaldo:_});E("Saldo base actualizado"),a(),F()}}function C(F,T,_){j(F,"[data-nueva-acc]",()=>y(null,T)),j(F,"[data-editar-acc]",R=>y(R.getAttribute("data-editar-acc"),T)),j(F,"[data-tramos-ganancias]",()=>_.abrir()),j(F,"[data-reset-base]",()=>M(T)),j(F,"[data-hist-acc]",R=>S(R.getAttribute("data-hist-acc"),T)),j(F,"[data-principal-acc]",R=>{const q=R.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(B=>({...B,esCuentaPrincipal:B._id===q}))),E("Cuenta marcada como principal"),a(),T()}),j(F,"[data-borrar-acc]",R=>{const q=R.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return E("Debe existir al menos una cuenta","err");if(!tt("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",q);const G=t.store.get("accounts");G.length>0&&!G.some(L=>L.esCuentaPrincipal)&&t.store.set("accounts",G.map((L,H)=>H===0?{...L,esCuentaPrincipal:!0}:L)),E("Cuenta eliminada"),a(),T()}),j(F,"[data-inv-modo]",R=>{const[q,B]=(R.getAttribute("data-inv-modo")||"").split("|");s.set(q,B==="real"?"real":"proyeccion"),T()}),$.wire(F,T)}let P=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:Pn,mount(F){const T=()=>m(F);P??(P=Cn({store:t.store,onDatosCambiados:()=>{a(),T()},año:()=>Number(e().slice(0,4))})),m(F),F.dataset.wired!=="1"&&(C(F,T,P),F.dataset.wired="1")}}}const at=(t,e,a="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${a};font-size:12px;padding:5px 10px">${c(z(e))}</td>
  </tr>`,Ta=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${c(t)}</td></tr>`;function Ve(t){const a=t.capMobiliario!==0||t.gananciasFondos!==0?`${at("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
       ${at("Ganancias patrimoniales (fondos/acciones)",t.gananciasFondos,t.gananciasFondos>=0?"var(--text)":"var(--green)",!0)}`:'<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>',o=t.resultado>0?"var(--red)":"var(--green)",s=t.resultado>0?"🔴 A PAGAR":"🟢 A DEVOLVER";return`
    <table style="width:100%;border-collapse:collapse">
      ${Ta("RENDIMIENTOS DEL TRABAJO")}
      ${at("Ingresos íntegros del trabajo",t.brutoTotal,"var(--text)",!0)}
      ${t.flexTotal>0?at("− Retribución flexible exenta (Art. 42 LIRPF)",-t.flexTotal,"var(--green)",!0):""}
      ${t.flexTotal>0?at("= Ingresos sujetos a IRPF",t.brutoIRPF):""}
      ${at("− Cotizaciones SS (≈6,35 %)",-t.cotizSS,"var(--red)",!0)}
      ${at("− Gastos deducibles (Art. 19.2 LIRPF)",-t.gastosArt19,"var(--red)",!0)}
      ${at("= Rendimiento neto trabajo",t.RNT)}
      ${at("− Reducción Art. 20 LIRPF",-t.reducArt20,"var(--green)",!0)}
      ${t.deducPP>0?at(`− Aportaciones a planes de pensiones (${c(z(t.aportPP))}, límite ${c(z(t.limPP))})`,-t.deducPP,"var(--green)",!0):""}
      ${t.otrosIngresos>0?at("+ Otros ingresos sujetos a IRPF",t.otrosIngresos,"var(--text)",!0):""}
      ${t.capInmobiliario!==0?at("+ Capital inmobiliario neto",t.capInmobiliario,t.capInmobiliario>=0?"var(--text)":"var(--green)",!0):""}
      ${t.otrasCorto!==0?at("± Otras ganancias a corto plazo",t.otrasCorto,"var(--text)",!0):""}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE GENERAL</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(z(t.baseGeneral))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota IRPF base general</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(z(t.cuotaGen))}</td>
      </tr>

      ${Ta("BASE DEL AHORRO")}
      ${a}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(z(t.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(z(t.cuotaAho))}</td>
      </tr>

      ${Ta("RESULTADO")}
      ${at("Cuota íntegra total",t.cuotaIntegra,"var(--red)")}
      ${at("− Retenciones en nómina",-t.retNomina,"var(--green)",!0)}
      ${t.retCapital!==0?at("− Retenciones de capital mobiliario",-t.retCapital,"var(--green)",!0):""}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${s}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${o}">${c(z(Math.abs(t.resultado)))}</td>
      </tr>
    </table>`}const Yt=(t,e,a,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${c(e)}</label>
    <input type="number" id="${t}" class="form-input" value="${c(a)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${c(o)}</div>`:""}
  </div>`;function _n(t){const e=t.extras,a=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
           ⚠️ No tienes nóminas configuradas. Ve a <strong>Nóminas</strong> para añadir tus ingresos del trabajo.
         </div>`:"";return`
    <div class="auth-hint mb-12" style="border-color:var(--accent)">
      📋 Estimación orientativa de tu declaración de la renta <strong>${t.año}</strong> con los datos de la aplicación.
      Los rendimientos del trabajo se detectan automáticamente; introduce a mano lo que la aplicación no conoce.
      <strong>No sustituye el asesoramiento fiscal profesional.</strong>
    </div>
    ${a}

    <div class="grid-2" style="gap:16px;align-items:start">
      <div>
        <div class="card" style="padding:16px;margin-bottom:12px">
          <div class="card-title mb-12">Datos adicionales</div>
          <div class="text-sm mb-8" style="color:var(--text2)">Importes anuales que la aplicación no calcula sola.</div>
          ${Yt("rex-inmobiliario","Capital inmobiliario neto (alquileres − gastos)",e.capInmobiliario??0)}
          ${Yt("rex-mobiliario","Capital mobiliario (dividendos, intereses)",e.capMobiliario??0)}
          ${Yt("rex-ganancias","Ganancias / pérdidas patrimoniales (fondos, acciones)",e.gananciasFondos??0,"Positivo = ganancia · Negativo = pérdida compensable")}
          ${Yt("rex-otras","Otras ganancias a corto plazo (menos de 1 año)",e.otrasCorto??0)}
          ${Yt("rex-ret-cap","Retenciones de capital ya aplicadas",e.retCapital??0,"Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen")}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${t.nominas.length>0?t.nominas.map(o=>`• ${c(o.nombre)}: ${c(z(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${c(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${Ve(t.declaracion)}</div>
      </div>
    </div>`}function Ue(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((a,o)=>a[0]-o[0]).map(([a,o],s,n)=>{const i=s<n.length-1?n[s+1][0]:null,p=i!==null?`${z(a)} – ${z(i)}`:`Más de ${z(a)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${c(p)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${c(o)}%</td>
      </tr>`}).join("")}
  </table>`}const En=(t,e,a)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${c(e)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${a}</div>
  </div>`,rt=(t,e,a="")=>`<div class="stat-card"><div class="stat-label">${c(t)}</div><div class="stat-value ${a}">${c(e)}</div></div>`,bt=(t,e,a="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${c(t)}</span><span class="num ${a}">${c(e)}</span></div>`;function Dn(t,e,a){const o=t.filter(u=>(u.modeloFondo||"cuenta")==="inversion");if(o.length===0)return En("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let s=0,n=0,i=0;const p=o.map(u=>{const l=Ft(u,e);if(!l)return"";s+=l.saldo,n+=l.costBase,i+=l.impuesto;const x=l.costBase>0?l.plusvalia/l.costBase*100:0,v=(u.escenarioIds||[]).map(r=>`<span class="badge badge-yellow">🔭 ${c(a(r))}</span>`).join("");return`
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${c(u.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${v}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            ${rt("Valor actual",z(l.saldo))}
            ${rt("Coste base (aportado)",z(l.costBase))}
          </div>
          <div class="grid-2" style="gap:8px">
            ${rt(`Plusvalía latente (${x>=0?"+":""}${x.toFixed(1)}%)`,z(l.plusvalia),l.plusvalia>=0?"pos":"neg")}
            ${rt("Imp. ganancias de capital (est.)",z(l.impuesto),"neg")}
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${c(z(l.neto))}</span>
          </div>
        </div>`}).join("");return`
    <div class="card mb-16" style="border:1px solid rgba(99,102,241,0.3)">
      <div class="card-title">Cartera de fondos — resumen</div>
      <div class="grid-3" style="gap:8px;margin-bottom:10px">
        ${rt("Valor total de la cartera",z(s))}
        ${rt("Total aportado (coste base)",z(n))}
        ${rt("Plusvalía latente total",z(s-n),s-n>=0?"pos":"neg")}
      </div>
      <div class="grid-2" style="gap:8px">
        ${rt("Impuesto estimado si se liquida todo",z(i),"neg")}
        ${rt("Neto tras impuestos (cartera completa)",z(s-i),"pos")}
      </div>
    </div>

    ${p}

    <div class="card mt-16">
      <div class="card-title mb-12">Marco fiscal — Fondos de inversión</div>
      <div class="grid-2" style="gap:16px;margin-bottom:16px">
        <div style="padding:14px;background:rgba(16,185,129,0.06);border:1px solid rgba(16,185,129,0.25);border-radius:var(--radius)">
          <div style="font-weight:600;margin-bottom:6px;color:#10b981">✓ Traspaso (fondo → fondo)</div>
          <div class="text-sm" style="color:var(--text2);line-height:1.6">
            <strong>Sin tributación</strong> (art. 94 LIRPF). Diferimiento fiscal total: la plusvalía latente queda acumulada
            y la base de coste se traslada al nuevo fondo.
          </div>
        </div>
        <div style="padding:14px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.25);border-radius:var(--radius)">
          <div style="font-weight:600;margin-bottom:6px;color:var(--red)">€ Reembolso (fondo → cuenta corriente)</div>
          <div class="text-sm" style="color:var(--text2);line-height:1.6">
            Tributa como <strong>ganancia patrimonial</strong> en la base del ahorro, con retención del <strong>19 %</strong>
            sobre la plusvalía proporcional al importe retirado.
          </div>
        </div>
      </div>
      <div style="margin-bottom:4px;font-size:12px;font-weight:600;color:var(--text2)">Tramos de ganancias patrimoniales (base del ahorro)</div>
      ${Ue(e)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function Rn(t){const{nominas:e,planes:a,tramos:o}=t,s=b=>b.grupoNomina?e.filter(g=>(g.grupoNomina||"")===b.grupoNomina):null,n=e.map(b=>({n:b,d:fa(b,s(b),o)})),i=n.reduce((b,g)=>b+g.d.brutoAnual,0),p=n.reduce((b,g)=>b+g.d.irpfAnual,0),u=n.reduce((b,g)=>b+g.d.ssAnual,0),l=n.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':n.map(({n:b,d:g})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${c(b.nombre)}</div>
          ${bt("Bruto anual",z(g.brutoAnual))}
          ${g.flexAnual>0?bt("− Retribución flexible exenta",z(-g.flexAnual),"pos"):""}
          ${bt("− Cotización SS",z(-g.ssAnual),"neg")}
          ${bt(`− IRPF estimado (${g.irpfPct.toFixed(1)} %)`,z(-g.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${c(z(g.baseDineraria-g.ssAnual-g.irpfAnual))}</span>
          </div>
        </div>`).join(""),x=Xa(e,o),v=`${t.hoy.slice(0,4)}-01-01`,r=a.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':a.map(b=>{const g=Xt(b);if(!g)return"";const $=(b.aportaciones||[]).filter(f=>f.fecha>=v).reduce((f,A)=>f+A.cantidad,0),m=Math.min($,St)*x/100,d=$>St;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${c(b.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${bt("Valor actual",z(g.saldo))}
          ${bt("Coste base (total aportado)",z(g.costBase))}
          ${bt("Revalorización",z(g.beneficio),g.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(t.hoy.slice(0,4))}</div>
            ${bt("Aportado",`${z($)}${d?" ⚠":""}`,d?"neg":"")}
            ${bt("Límite deducible",z(St))}
            ${bt(`Ahorro IRPF est. (marginal ${x} %)`,z(m),"pos")}
            ${d?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${c(z(St))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${g.proxDesbloqueo?`· Próx. desbloqueo: ${c(g.proxDesbloqueo)}`:""}
          </div>
        </div>`}).join("");return`
    <div class="card mb-16">
      <div class="card-title mb-10">Nóminas activas — importes anuales</div>
      <div class="grid-4" style="gap:8px;margin-bottom:14px">
        ${rt("Bruto anual total",z(i))}
        ${rt("Cotización SS anual",z(u),"neg")}
        ${rt("IRPF estimado anual",z(p),"neg")}
        ${rt("Neto anual",z(i-u-p),"pos")}
      </div>
      <div class="grid-3">${l}</div>
    </div>

    <div class="card-title mb-8">Planes de pensiones</div>
    <div class="auth-hint mb-14" style="border-color:var(--yellow)">
      💼 <strong>Diferencia clave frente a los fondos de inversión:</strong> el rescate de un plan de pensiones tributa en la
      <strong>base general del IRPF</strong> (tramos ordinarios hasta el 47 %), <em>no</em> en la base del ahorro. Las
      aportaciones son deducibles hasta <strong>${c(z(St))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${r}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${Ue(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const aa=(t,e)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${c(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${c(e)}</div>
  </div>`;function Nn(){return`
    <div class="card" style="text-align:center;padding:56px 32px;border:2px dashed var(--border)">
      <div style="font-size:44px;margin-bottom:16px">🏠</div>
      <div style="font-size:18px;font-weight:700;margin-bottom:8px">Capital Inmobiliario</div>
      <span class="badge" style="margin-bottom:20px;font-size:12px;padding:5px 14px;background:rgba(99,102,241,0.12);color:var(--accent)">En construcción</span>
      <div class="text-sm" style="color:var(--text2);max-width:480px;margin:0 auto 28px;line-height:1.6">
        Aquí podrás gestionar <strong>ingresos por alquiler</strong>, aplicar la reducción del 60 % para arrendamiento de
        vivienda habitual y deducir los gastos correspondientes. Mientras tanto, introduce el rendimiento neto a mano en
        la pestaña <strong>Declaración Renta</strong>.
      </div>
      <div class="grid-2" style="max-width:480px;margin:0 auto;gap:12px;text-align:left">
        ${aa("Rendimientos íntegros","Alquileres, subarriendos y cesión de derechos sobre inmuebles")}
        ${aa("Gastos deducibles","IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación")}
        ${aa("Reducción del 60 %","Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)")}
        ${aa("Base general del IRPF","Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.")}
      </div>
    </div>`}const Ye=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],qn="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function Ln(t){const e=t.hoy??V;let a="declaracion",o={};const s=()=>t.store.get("config"),n=()=>Number(e().slice(0,4)),i=()=>t.store.get("nominas").filter(d=>d.activo),p=()=>t.store.get("accounts").filter(d=>(d.modeloFondo||"cuenta")==="pension"),u=d=>{var f;return((f=t.store.get("escenarios").find(A=>A._id===d))==null?void 0:f.nombre)??d},l=()=>vt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??ft)(n()),x=()=>vt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??At)(n());function v(){const d=`${n()}-01-01`,f=t.store.get("nominas").filter(y=>y.activo&&!y.simulacion),A=p().reduce((y,w)=>y+(w.aportaciones||[]).filter(S=>S.fecha>=d).reduce((S,M)=>S+M.cantidad,0),0),h=t.store.get("expenses").filter(y=>y.activo&&y.sujetoIRPF&&y.tipo==="ingreso").reduce((y,w)=>y+Qa(w),0);return te({nominas:f,aportacionesPension:A,otrosIngresos:h,extras:o,tramosGeneral:l(),tramosAhorro:x()})}function r(){const d=l(),f=i(),A=T=>T.grupoNomina?f.filter(_=>(_.grupoNomina||"")===T.grupoNomina):null,h=f.map(T=>fa(T,A(T),d)),y=h.reduce((T,_)=>T+_.brutoAnual,0),w=h.reduce((T,_)=>T+_.irpfAnual,0),S=h.reduce((T,_)=>T+_.ssAnual,0),M=t.store.get("accounts").filter(T=>(T.modeloFondo||"cuenta")==="inversion");let C=0,P=0;for(const T of M){const _=Ft(T,x());_&&(C+=_.plusvalia,P+=_.impuesto)}if(y<=0&&M.length===0)return"";const F=(T,_,R)=>`<div class="exec-item"><div class="exec-item-label">${c(T)}</div><div class="exec-item-val ${R}">${c(_)}</div></div>`;return`<div class="exec-summary mb-14">
      ${y>0?F("IRPF trabajo",`${z(w)}/año`,"neg"):""}
      ${y>0?F("Neto trabajo",`${z(y-S-w)}/año`,"pos"):""}
      ${M.length>0?F("Plusvalía latente",z(C),C>=0?"pos":"neg"):""}
      ${M.length>0?F("Imp. potencial (inversión)",z(P),"neg"):""}
    </div>`}function b(){return a==="mobiliario"?Dn(t.store.get("accounts"),x(),u):a==="trabajo"?Rn({nominas:i(),planes:p(),tramos:l(),hoy:e()}):a==="inmobiliario"?Nn():_n({año:n(),extras:o,declaracion:v(),nominas:i().map(d=>({nombre:d.nombre,bruto:d.bruto||0})),planes:p().map(d=>d.nombre)})}function g(d,f){const A=a===d;return`<button data-tab-fisc="${d}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${A?"600":"400"};
      color:${A?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${A?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${c(f)}</button>`}function $(d){const f=d.querySelector("#fisc-tabs"),A=d.querySelector("#fisc-tab-content");f&&(f.innerHTML=Ye.map(([h,y])=>g(h,y)).join("")),A&&(A.innerHTML=b())}function I(d){d.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${r()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${Ye.map(([f,A])=>g(f,A)).join("")}
      </div>
      <div id="fisc-tab-content">${b()}</div>`}function m(d){j(d,"[data-tab-fisc]",f=>{a=f.getAttribute("data-tab-fisc")||"declaracion",$(d)}),d.addEventListener("input",f=>{var w;if(!((w=f.target)==null?void 0:w.closest("[data-rex]")))return;const h=S=>{var M;return((M=d.querySelector(`#${S}`))==null?void 0:M.value)??"0"};o={capInmobiliario:parseFloat(h("rex-inmobiliario"))||0,capMobiliario:parseFloat(h("rex-mobiliario"))||0,gananciasFondos:parseFloat(h("rex-ganancias"))||0,otrasCorto:parseFloat(h("rex-otras"))||0,retCapital:parseFloat(h("rex-ret-cap"))||0};const y=d.querySelector("#renta-cuadro");y&&(y.innerHTML=Ve(v()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:qn,mount(d){I(d),d.dataset.wired!=="1"&&(m(d),d.dataset.wired="1")}}}const We=()=>globalThis.Chart??null;function kn(t,e){const a=We();if(!a)return null;const o=e.map(s=>({label:s.label,data:s.puntos.map(n=>({x:n.x,y:n.y})),borderColor:s.esBase?"#6b7280":s.color,backgroundColor:s.esBase?"transparent":`${s.color}18`,borderWidth:s.esBase?1.5:2,...s.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new a(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:s=>`${s.dataset.label}: ${z(s.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:s=>z(s)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const On=()=>We()!==null,Ct=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Bn="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function Hn(t){const e=()=>{var y;return(y=t.onDatosCambiados)==null?void 0:y.call(t)},a=new Set;let o=null;const s=()=>t.store.get("config"),n=()=>t.store.get("escenarios"),i=y=>{var w;return y?((w=n().find(S=>S._id===y))==null?void 0:w.nombre)??y:"Base"};function p(y){const w=s(),S=Ya({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(y==null?void 0:y._id)??null),M=a.size>0?S.accounts.filter(T=>!a.has(T._id)):S.accounts,C=a.size>0?M.map(T=>T._id):null,P=y!=null&&y.fechaFin&&y.fechaFin>w.dashboardEnd?y.fechaFin:w.dashboardEnd;return{eventos:Lt({loans:S.loans,expenses:S.expenses,accounts:M,config:{...w,dashboardEnd:P},filtroAccounts:C,nominas:S.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:vt(t.store.get("tramosIRPFHistorico"),w.tramos_irpf??ft),resolverTramosGanancias:vt(t.store.get("tramosGananciasCapitalHistorico"),w.tramosGananciasCapital??At)}),horizonte:P}}function u(y){const w=t.store.get("loans"),S=F=>(F.escenarioIds||[]).includes(y),M=[[w.filter(S).length,"préstamo","préstamos"],[w.flatMap(F=>F.amortizaciones||[]).filter(S).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(S).length,"gasto","gastos"],[t.store.get("accounts").filter(S).length,"cuenta","cuentas"],[t.store.get("nominas").filter(S).length,"nómina","nóminas"]],C=M.reduce((F,[T])=>F+T,0),P=M.filter(([F])=>F>0).map(([F,T,_])=>`${F} ${F===1?T:_}`).join(" · ");return{total:C,texto:P}}function l(y,w){const S=w===y._id,M=y.color||Ct[0],{total:C,texto:P}=u(y._id);return`<div class="card mb-12" style="border-left:3px solid ${c(M)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${c(M)};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${c(y.nombre)}</span>
        ${S?'<span class="badge badge-yellow">● Activo</span>':""}
        ${y.fechaFin?`<span class="badge badge-inactive">📅 ${c(y.fechaFin)}</span>`:""}
        <div class="flex gap-8">
          ${S?'<button class="btn-secondary btn-sm" data-desactivar-esc>Desactivar</button>':`<button class="btn-primary btn-sm" data-activar-esc="${c(y._id)}">Activar</button>`}
          <button class="btn-secondary btn-sm" data-editar-esc="${c(y._id)}">Editar</button>
          <button class="btn-danger btn-sm" data-borrar-esc="${c(y._id)}">✕</button>
        </div>
      </div>
      ${y.descripcion?`<div class="text-sm mb-8" style="color:var(--text2)">${c(y.descripcion)}</div>`:""}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${C===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${c(P)}</span>`}
      </div>
    </div>`}function x(y){const w=s().dashboardEnd,S=ca(p(null).eventos,w);return`
      <div class="card-title" style="margin-bottom:10px">Saldo en la fecha objetivo, frente a la base</div>
      <table style="width:100%;font-size:13px;border-collapse:collapse">
        <thead>
          <tr style="color:var(--text2);border-bottom:1px solid var(--border)">
            <th style="text-align:left;padding:6px 10px">Escenario</th>
            <th style="text-align:right;padding:6px 10px">Fecha objetivo</th>
            <th style="text-align:right;padding:6px 10px">Saldo estimado</th>
            <th style="text-align:right;padding:6px 10px">vs Base</th>
          </tr>
        </thead>
        <tbody>${y.map(C=>{const{eventos:P}=p(C),F=C.fechaFin||w,T=ca(P,F),_=T!==null&&S!==null?T-S:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c(C.color||Ct[0])};margin-right:6px"></span>
            ${c(C.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${c(F)}</td>
          <td class="num" style="padding:6px 10px">${T!==null?c(z(T)):"—"}</td>
          <td class="num ${_===null?"":_>=0?"pos":"neg"}" style="padding:6px 10px">
            ${_===null?"—":`${_>=0?"+":""}${c(z(_))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function v(){const y=t.store.get("accounts");return y.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${y.map(S=>{const M=a.has(S._id);return`<button data-toggle-cuenta="${c(S._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${M?"var(--border)":"var(--accent)"};
          background:${M?"transparent":"rgba(99,102,241,0.1)"};
          color:${M?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${M?"text-decoration:line-through;":""}">${c(S.nombre)}</button>`}).join("")}
    </div>`}function r(){if(o){try{o.destroy()}catch{}o=null}}function b(y){const w=s(),S=p(null),M=[{label:"Base (sin escenario)",color:"#6b7280",esBase:!0,puntos:ra(S.eventos,w.dashboardStart,w.dashboardEnd)}];return y.forEach((C,P)=>{const{eventos:F,horizonte:T}=p(C);M.push({label:C.nombre,color:C.color||Ct[P%Ct.length],puntos:ra(F,w.dashboardStart,T)})}),M}function g(y,w){r();const S=y.querySelector("#chart-comparacion");S&&(o=kn(S,b(w)))}function $(y){r();const w=new Set(t.store.get("accounts").map(C=>C._id));for(const C of[...a])w.has(C)||a.delete(C);const S=n(),M=s().escenarioActivo||null;y.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Escenarios</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo escenario</button></div>
      </div>

      ${M?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${c(i(M))}</span>
                 <span style="font-size:12px;color:var(--text3);margin-left:8px">El dashboard muestra la proyección de este escenario</span>
               </div>
               <button class="btn-secondary btn-sm" data-desactivar-esc>Volver a base</button>
             </div>`:""}

      ${S.length===0?`<div class="card mb-14" style="padding:20px 24px">
               <div style="font-weight:600;font-size:14px;margin-bottom:8px">¿Qué son los escenarios?</div>
               <div class="text-sm" style="color:var(--text2);line-height:1.7;margin-bottom:12px">
                 Los escenarios sirven para probar <strong>situaciones hipotéticas</strong> sin tocar tu plan base:
                 ¿qué pasaría si amortizas la hipoteca de forma agresiva?, ¿si cambias de trabajo y sube el sueldo?,
                 ¿si abres una inversión nueva?<br><br>
                 <strong>Cómo funciona:</strong>
                 <ol style="margin:8px 0 0 16px;padding:0">
                   <li>Crea un escenario con un nombre descriptivo.</li>
                   <li>En Préstamos, Gastos, Cuentas o Nóminas, asigna los elementos que pertenecen a él.</li>
                   <li>Actívalo para ver cómo cambia la proyección del Dashboard.</li>
                 </ol>
               </div>
               <button class="btn-primary btn-sm" data-nuevo-esc>+ Crear mi primer escenario</button>
             </div>
             <div class="card" style="text-align:center;padding:32px;color:var(--text3)">
               <div style="font-size:13px">Una vez creado, asígnale préstamos, gastos o cuentas desde sus secciones, con el selector de "Escenarios" del formulario.</div>
             </div>`:`<div>${S.map(C=>l(C,M)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de escenarios</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${v()}</div>
               ${On()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${x(S)}</div>`}`,S.length>0&&g(y,S)}const I=()=>document.getElementById("modal-overlay"),m=()=>document.getElementById("modal-content"),d=()=>{var y;return(y=I())==null?void 0:y.classList.add("hidden")};function f(y,w){const S=y?n().find(F=>F._id===y)??null:null,M=I(),C=m();if(!M||!C)return;const P=(S==null?void 0:S.color)||Ct[0];C.innerHTML=`
      <div class="modal-title">${y?"Editar escenario":"Nuevo escenario"}</div>
      <div class="form-group"><label class="form-label">Nombre del escenario</label>
        <input class="form-input" type="text" id="esc-nombre" value="${c((S==null?void 0:S.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${c((S==null?void 0:S.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${Ct.map(F=>`<div data-color-esc="${F}" style="width:26px;height:26px;border-radius:50%;background:${F};cursor:pointer;
              border:2px solid ${F===P?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${c(P)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${c((S==null?void 0:S.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${c(y??"")}">${y?"Guardar cambios":"Crear escenario"}</button>
      </div>`,M.classList.remove("hidden"),j(C,"[data-cancelar]",d),j(C,"[data-color-esc]",F=>{const T=F.getAttribute("data-color-esc");C.querySelector("#esc-color").value=T;for(const _ of C.querySelectorAll("[data-color-esc]"))_.style.border=_.getAttribute("data-color-esc")===T?"2px solid white":"2px solid transparent"}),j(C,"[data-guardar-esc]",F=>{const T=C.querySelector("#esc-nombre").value.trim();if(!T)return E("El nombre es obligatorio","err");const _={nombre:T,fechaFin:C.querySelector("#esc-fecha-fin").value||null,color:C.querySelector("#esc-color").value||Ct[0],descripcion:C.querySelector("#esc-desc").value.trim()},R=F.getAttribute("data-guardar-esc")||"";R?(t.store.updateItem("escenarios",R,_),E("Escenario actualizado")):(t.store.addItem("escenarios",_),E("Escenario creado")),e(),d(),w()})}function A(y,w){if(!tt("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const S=M=>M.map(C=>({...C,escenarioIds:(C.escenarioIds||[]).filter(P=>P!==y)}));t.store.set("loans",S(t.store.get("loans")).map(M=>({...M,amortizaciones:S(M.amortizaciones||[])}))),t.store.set("expenses",S(t.store.get("expenses"))),t.store.set("nominas",S(t.store.get("nominas"))),t.store.set("accounts",S(t.store.get("accounts"))),s().escenarioActivo===y&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",y),E("Escenario eliminado"),e(),w()}function h(y,w){j(y,"[data-nuevo-esc]",()=>f(null,w)),j(y,"[data-editar-esc]",S=>f(S.getAttribute("data-editar-esc"),w)),j(y,"[data-borrar-esc]",S=>A(S.getAttribute("data-borrar-esc"),w)),j(y,"[data-activar-esc]",S=>{const M=S.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:M}),E(`Escenario "${i(M)}" activado`),e(),w()}),j(y,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),E("Volviendo a la realidad base"),e(),w()}),j(y,"[data-toggle-cuenta]",S=>{const M=S.getAttribute("data-toggle-cuenta");a.has(M)?a.delete(M):a.add(M);const C=y.querySelector("#esc-pastillas");C&&(C.innerHTML=v());const P=n(),F=y.querySelector("#esc-comparativa");F&&(F.innerHTML=x(P)),g(y,P)})}return{id:"escenarios",route:"escenarios",nombre:"Escenarios",flagId:"supuestos",seccion:2,iconoPath:Bn,mount(y){const w=()=>$(y);$(y),y.dataset.wired!=="1"&&(h(y,w),y.dataset.wired="1")},unmount(){r()}}}function Je(t,e,a=!1){const o=Math.abs(It(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function Gn(t){function e(f){return`${f}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(f={}){var h;const A=(h=f.texto)==null?void 0:h.trim().toLowerCase();return t.get("transacciones").filter(y=>!(f.cuentaId&&y.cuentaId!==f.cuentaId||f.desde&&y.fecha<f.desde||f.hasta&&y.fecha>f.hasta||f.tipo&&y.tipo!==f.tipo||f.estimacionId&&y.estimacionId!==f.estimacionId||f.tags&&f.tags.length>0&&!f.tags.some(w=>y.tags.includes(w))||A&&!y.concepto.toLowerCase().includes(A))).sort((y,w)=>y.fecha.localeCompare(w.fecha)||y._id.localeCompare(w._id))}function o(f){const A={_id:e("tx"),fecha:f.fecha,cuentaId:f.cuentaId,importeCts:Je(f.tipo,f.importe,f.negativo),concepto:f.concepto,tags:f.tags??[],estimacionId:f.estimacionId??null,tipo:f.tipo,origen:f.origen??"manual",...f.nota?{nota:f.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),A]),A}function s(f,A){t.set("transacciones",t.get("transacciones").map(h=>{if(h._id!==f)return h;const{importe:y,...w}=A,S={...h,...w};return y!==void 0&&(S.importeCts=Je(S.tipo,y,S.importeCts<0)),S}))}function n(f){t.set("transacciones",t.get("transacciones").filter(A=>A._id!==f))}function i(f,A){s(f,{estimacionId:A})}function p(f){return t.get("puntosControl").filter(A=>!f||A.cuentaId===f).sort((A,h)=>A.fecha.localeCompare(h.fecha))}function u(f,A,h,y){const w={_id:e("pc"),fecha:A,cuentaId:f,saldoCts:It(h),...y?{nota:y}:{}},S=t.get("puntosControl").filter(M=>!(M.cuentaId===f&&M.fecha===A));return t.set("puntosControl",[...S,w].sort((M,C)=>M.fecha.localeCompare(C.fecha))),x(f),w}function l(f){const A=t.get("puntosControl").find(h=>h._id===f);t.set("puntosControl",t.get("puntosControl").filter(h=>h._id!==f)),A&&x(A.cuentaId)}function x(f){const A=p(f),h=t.get("accounts");h.some(y=>y._id===f)&&t.set("accounts",h.map(y=>y._id===f?{...y,historicoSaldos:A.map(w=>({_id:w._id,fecha:w.fecha,saldo:ot(w.saldoCts),...w.nota?{nota:w.nota}:{}}))}:y))}function v(f,A=V()){const h=p(f).filter(M=>M.fecha<=A).pop(),y=h==null?void 0:h.fecha,w=(h==null?void 0:h.saldoCts)??0;return t.get("transacciones").filter(M=>M.cuentaId===f&&M.fecha<=A&&(y===void 0||M.fecha>y)).reduce((M,C)=>M+C.importeCts,w)}function r(f,A){return ot(v(f,A))}function b(f=V(),A){const h=A??t.get("accounts").filter(y=>y.activo).map(y=>y._id);return ot(h.reduce((y,w)=>y+v(w,f),0))}function g(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function $(){const f=[...t.get("transacciones").map(A=>A.fecha),...t.get("puntosControl").map(A=>A.fecha)];return f.length>0?f.sort().pop()??null:null}function I(f={}){return ot(a(f).reduce((A,h)=>A+h.importeCts,0))}function m(f={}){const A=new Map;for(const h of a(f)){const y=h.fecha.slice(0,7);A.set(y,(A.get(y)??0)+h.importeCts)}return new Map([...A.entries()].sort(([h],[y])=>h.localeCompare(y)).map(([h,y])=>[h,ot(y)]))}function d(f={}){const A=new Map;for(const h of a(f))for(const y of h.tags.length>0?h.tags:["sin_tag"])A.set(y,(A.get(y)??0)+h.importeCts);return new Map([...A.entries()].map(([h,y])=>[h,ot(y)]))}return{transacciones:a,registrar:o,actualizar:s,eliminar:n,asignarEstimacion:i,puntosControl:p,registrarPuntoControl:u,eliminarPuntoControl:l,saldoCuenta:r,saldoCuentaCts:v,saldoTotal:b,tieneDatos:g,ultimaFecha:$,total:I,totalPorMes:m,totalPorTag:d}}function ht(t){return t.trim().toLowerCase()}function Vn(t){function e(){const l=new Map,x=(v,r)=>{const b=ht(v);if(!b)return;const g=l.get(b)??{tag:b,estimaciones:0,reales:0,total:0};g[r]+=1,g.total+=1,l.set(b,g)};for(const v of t.get("expenses"))for(const r of v.tags??[])x(r,"estimaciones");for(const v of t.get("transacciones"))for(const r of v.tags??[])x(r,"reales");return[...l.values()].sort((v,r)=>r.total-v.total||v.tag.localeCompare(r.tag))}function a(){return e().map(l=>l.tag)}function o(l){return e().filter(x=>l==="estimaciones"?x.reales===0:x.estimaciones===0).map(x=>x.tag)}function s(l,x,v){const r=ht(x),b=(l??[]).map(ht);if(!b.includes(r))return l??[];const g=b.filter($=>$!==r);return v===null?[...new Set(g)]:[...new Set([...g,ht(v)])]}function n(l,x){const v=ht(x);if(!v)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return u(l,v)}function i(l,x){let v=0;for(const r of l)ht(r)!==ht(x)&&(v+=u(r,ht(x)).cambiados);return{cambiados:v}}function p(l){return u(l,null)}function u(l,x){let v=0;const r=t.get("expenses").map(w=>{const S=s(w.tags,l,x);return S!==w.tags&&(v+=1),S===w.tags?w:{...w,tags:S}});t.set("expenses",r);const b=t.get("transacciones").map(w=>{const S=s(w.tags,l,x);return S!==w.tags&&(v+=1),S===w.tags?w:{...w,tags:S}});t.set("transacciones",b);const g=t.get("loans").map(w=>{const S=s(w.tags,l,x);return S!==w.tags&&(v+=1),S===w.tags?w:{...w,tags:S}});t.set("loans",g);const $=t.get("nominas").map(w=>{const S=s(w.tags,l,x);return S!==w.tags&&(v+=1),S===w.tags?w:{...w,tags:S}});t.set("nominas",$);const I=t.get("config"),m=ht(l),d=w=>{const S=(w??[]).map(ht);if(!S.includes(m))return w??[];const M=S.filter(C=>C!==m);return x===null?[...new Set(M)]:[...new Set([...M,x])]},f={},A=d(I.activeTagsFilter),h=d(I.tagCategorias),y=d(I.tagGrupos);return A!==I.activeTagsFilter&&(f.activeTagsFilter=A),h!==I.tagCategorias&&(f.tagCategorias=h),y!==I.tagGrupos&&(f.tagGrupos=y),Object.keys(f).length>0&&t.patchConfig(f),{cambiados:v}}return{uso:e,todas:a,soloEn:o,renombrar:n,fusionar:i,eliminar:p}}function Un(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function Yn(t,e){const a=N(t),o=[];for(let s=1;s<=e;s++){const n=new Date(a.getFullYear(),a.getMonth()-s,1);o.push(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Wn(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function Jn(t,e){const{inicio:a,fin:o}=Wn(e);return qt([t],{start:a,end:o}).reduce((n,i)=>n+Math.abs(i.cuantia),0)}function Kn(t){function e(s,n={}){var A;const{mesesHistorial:i=12,mesesMedia:p=3,hoy:u=V()}=n,l=t.transacciones({estimacionId:s._id}),v=l.length===0&&(((A=s.tags)==null?void 0:A.length)??0)>0?t.transacciones({tags:s.tags}):l,r=new Map;for(const h of v){const y=h.fecha.slice(0,7);r.set(y,(r.get(y)??0)+Math.abs(h.importeCts)/100)}const b=[];for(const h of Yn(u,i)){const y=r.get(h);if(y===void 0)continue;const w=st(Jn(s,h));b.push({mes:h,estimado:w,real:st(y),desviacion:st(y-w),precision:Un(w,y)})}const g=st(b.reduce((h,y)=>h+y.estimado,0)),$=st(b.reduce((h,y)=>h+y.real,0)),I=b.reduce((h,y)=>h+Math.abs(y.estimado),0),m=b.length===0?null:I>0?b.reduce((h,y)=>h+y.precision*Math.abs(y.estimado),0)/I:b.reduce((h,y)=>h+y.precision,0)/b.length,d=b.slice(-p),f=d.length>0?st(d.reduce((h,y)=>h+y.real,0)/d.length):null;return{estimacionId:s._id,concepto:s.concepto,tags:s.tags??[],meses:b,estimadoTotal:g,realTotal:$,desviacionTotal:st($-g),precision:m,mediaRealReciente:f,infraestimada:$>g}}function a(s,n={}){return s.filter(i=>i.tipo!=="transferencia").map(i=>e(i,n)).sort((i,p)=>i.precision===null&&p.precision===null?i.concepto.localeCompare(p.concepto):i.precision===null?1:p.precision===null?-1:i.precision-p.precision)}function o(s){const n=new Map;for(const i of s)if(i.precision!==null)for(const p of i.tags.length>0?i.tags:["sin_tag"]){const u=n.get(p)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};u.estimado+=i.estimadoTotal,u.real+=i.realTotal,u.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),u.peso+=Math.abs(i.estimadoTotal),u.n+=1,n.set(p,u)}return[...n.entries()].map(([i,p])=>({tag:i,estimadoTotal:st(p.estimado),realTotal:st(p.real),desviacionTotal:st(p.real-p.estimado),precision:p.peso>0?p.pesoPrecision/p.peso:null,estimaciones:p.n})).sort((i,p)=>(i.precision??101)-(p.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}const ja="financeapp_session",Xn=["local","dropbox","firebase"];function Qn(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!Xn.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function Zn({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now()}={}){const o=()=>t??(typeof localStorage<"u"?localStorage:null);function s(r){const b=o();if(b)try{r?b.setItem(ja,JSON.stringify(r)):b.removeItem(ja)}catch{}}function n(){const r=o();if(!r)return null;try{return Qn(r.getItem(ja))}catch{return null}}function i(){const r=n();return r?(a()-r.ultimoUso)/6e4:null}function p(){const r=e();if(!Number.isFinite(r)||r<=0)return!1;const b=i();return b!==null&&b>=r}function u(){const r=n();return r?p()?(s(null),null):r:null}function l(r){const b=a(),g={modo:r.modo,...r.email?{email:r.email}:{},...r.passphrase?{passphrase:r.passphrase}:{},creadaEn:b,ultimoUso:b};return s(g),g}function x(){const r=n();r&&s({...r,ultimoUso:a()})}function v(){s(null)}return{abrir:l,leer:u,tocar:x,cerrar:v,caducada:p,inactividadMinutos:i,get activa(){return u()!==null}}}const Ke=["pointerdown","keydown","visibilitychange"];function ti({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:s=clearInterval,target:n=typeof document<"u"?document:void 0}){let i=!0;const p=()=>{i&&t.tocar()};for(const x of Ke)n==null||n.addEventListener(x,p);const u=o(()=>{i&&t.caducada()&&(l(),t.cerrar(),e())},a);function l(){if(i){i=!1,s(u);for(const x of Ke)n==null||n.removeEventListener(x,p)}}return l}const ai=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}];function Xe(){if(typeof localStorage<"u"){const r=Zo();r.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${r.join(", ")}`)}const t=as({adapter:Qo()}),{applied:e}=t.load();e.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${e.join(", ")} (esquema v${Ot})`);const a=os(t),o=Zn({autoLogoutMinutos:()=>{var b,g;const r=(g=(b=globalThis.State)==null?void 0:b.get)==null?void 0:g.call(b,"config");return Number((r==null?void 0:r.autoLogoutMinutos)??t.get("config").autoLogoutMinutos??0)}}),s=Gn(t),n=Vn(t),i=Kn(s),p=vs(t),u=ls({isEnabled:r=>a.isEnabled(r)}),l=cs({flags:a,rutasExtra:()=>u.flagPorRuta()}),x=rs({flags:a,onChange:()=>{var r,b;u.attachToShell(),l.apply(),(b=(r=globalThis.Router)==null?void 0:r.rerender)==null||b.call(r)}}),v=()=>{var r,b;(b=(r=globalThis.State)==null?void 0:r.load)==null||b.call(r)};return u.register(Es({store:t,onDatosCambiados:v})),u.register(Vs({store:t,onDatosCambiados:v})),u.register(un({store:t,onDatosCambiados:v})),u.register(jn({store:t,ledger:s,mostrarObjetivos:()=>a.isEnabled("goals"),onDatosCambiados:v})),u.register(ys({ledger:s,tags:n,precision:i,adjuster:p,accounts:()=>t.get("accounts"),estimaciones:()=>t.get("expenses"),onDatosCambiados:v})),u.register(Hn({store:t,onDatosCambiados:v})),u.register(Cs({store:t,onDatosCambiados:v})),u.register(Ln({store:t})),u.register($s({store:t,onDatosCambiados:v})),{version:Ot,core:po,engine:{generarExtracto:Lt,recomputarSaldoAcum:vo,saldoHoy:go,sumarPorTags:de,providers:{proyectarGastos:qt,proyectarPrestamos:ae,proyectarTransferencias:ee,proyectarNominas:ie,proyectarInteresesCuentas:se,proyectarAportaciones:oe,proyectarRetencionesFiscales:ne,proyectarInflacionGastos:re,proyectarPerdidaAhorro:ce},analysis:xo,margins:Ao,optimizer:wo,dashboard:No},store:t,flags:a,featureRegistry:{all:$t,porGrupo:Me},ui:{openFeatures:x.open,applyGating:l.apply},app:u,session:Object.assign(o,{vigilar:r=>ti({sesion:o,onCaducada:r}),opciones:ai}),accounting:{ledger:s,tags:n,precision:i,adjuster:p,sugerirAjuste:Te}}}function ei(){try{const t=Xe();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const _a=typeof window<"u"?ei():null;if(_a){const t=()=>{_a.app.attachToShell(),_a.ui.applyGating()};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",t,{once:!0}):t(),document.addEventListener("click",e=>{const a=e.target;a!=null&&a.closest(".nav-btn[data-view]")&&setTimeout(t,0)})}return ea.bootstrap=Xe,Object.defineProperty(ea,Symbol.toStringTag,{value:"Module"}),ea}({});
//# sourceMappingURL=financeapp-core.js.map

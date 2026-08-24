var FinanceAppBundle=function($t){"use strict";var Xl=Object.defineProperty;var Zl=($t,V,G)=>V in $t?Xl($t,V,{enumerable:!0,configurable:!0,writable:!0,value:G}):$t[V]=G;var ss=($t,V,G)=>Zl($t,typeof V!="symbol"?V+"":V,G);function V(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function G(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function Y(){return V(new Date)}function Me(t,e){return new Date(t,e+1,0).getDate()}function ca(t,e,a){return V(new Date(t,e,Math.min(a,Me(t,e))))}function ue(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return V(new Date(t,e+1,0));const n=parseInt(o);if(!isNaN(n))return ca(t,e,n)}if(a.startsWith("nthweekday:")){const o=a.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,e+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return V(r)}const i=new Date(t,e,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),V(i)}return null}function da(t,e){if(!e)return t;const a=G(t);return ue(a.getFullYear(),a.getMonth(),e)??t}const ns=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],is={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function Se(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${is[a]||a+"º"} ${ns[o]} del mes`}return t}function Vt(t,e){const a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((o-a)/864e5)}function It(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function et(t){return t/100}function W(t){return et(It(t))}function j(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function ua(t){return(t||0).toFixed(2)+"%"}function Tt(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function pa(t,e,a,o=0){const n=Tt(t,e,a),s=t*(1-o/100);let i=e/100/12;for(let r=0;r<200;r++){const p=n*(1-Math.pow(1+i,-a))/i-s,h=n*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),u=i-p/h;if(Math.abs(u-i)<1e-10){i=u;break}i=u}return(Math.pow(1+i,12)-1)*100}function ma(t,e,a,o,n=0,s=[],i={}){const r=[];let l=t;const p=G(o),h=e/100/12;let u=a,d=Tt(l,e,u);const v=[...s].sort(($,A)=>$.fecha.localeCompare(A.fecha));let y=0;for(let $=1;$<=a*2&&l>.01;$++){const A=new Date(p);p.setMonth(p.getMonth()+1);const f=da(V(A),i.diaPago||"");for(;y<v.length&&v[y].fecha<=f;){const I=v[y],b=I.cantidad*(n/100);if(l-=I.cantidad,l=Math.max(0,l),I.tipo==="plazo"?u=Math.ceil(-Math.log(1-l*h/d)/Math.log(1+h)):(u=a-$+1,d=Tt(l,e,u)),r.push({mes:"AMORT",fecha:I.fecha,cuota:0,interes:0,amortizacion:I.cantidad,comisionAmort:b,capitalPendiente:l,esAmortizacion:!0,simulacion:I.simulacion||!1}),y++,l<.01)break}if(l<.01)break;const g=l*h,m=Math.min(d-g,l);if(l-=m,l<.01&&(l=0),r.push({mes:$,fecha:f,cuota:d,interes:g,amortizacion:m,comisionAmort:0,capitalPendiente:l,esAmortizacion:!1,simulacion:!1}),u--,u<=0||l<.01)break}return r}const fa=new Map;function at(t){var A;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((f,g)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${g.fecha}|${g.cantidad}|${g.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=fa.get(a);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:l,comisionApertura:p}=t,h=ma(n,s,i,r,l||0,e,t),u=h.reduce((f,g)=>f+g.interes,0),d=h.reduce((f,g)=>f+g.comisionAmort,0),v=n*((p||0)/100),y=h.filter(f=>!f.esAmortizacion),$={cuota:Tt(n,s,i),totalIntereses:u,tae:pa(n,s,i,p||0),costoTotal:u+d+v,comAp:v,totalComAm:d,fechaFin:((A=y.slice(-1)[0])==null?void 0:A.fecha)||"",mesesReales:y.length,tabla:h};return fa.set(a,$),$}function va(t){const e=at(t),a=at({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,n=a.mesesReales-e.mesesReales,s=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function pt(t,e,a){if(!t||t.length===0)return 1;const o=G(e),n=G(a);if(n<=o)return 1;const s=[...t].sort((l,p)=>l.year-p.year);let i=1,r=new Date(o);for(;r<n;){const l=r.getFullYear(),p=s.filter($=>$.year<=l),h=p.length>0?p[p.length-1]:s[0],u=(h?h.tasa:0)/100,d=new Date(l+1,0,1),v=d<n?d:n,y=Vt(r,v);i*=Math.pow(1+u,y/365.25),r=v}return i}function ga(t,e,a,o=0){const n=G(e),s=G(a);if(s<=n)return o;const i=Vt(n,s),r=t?[...t].sort((h,u)=>h.year-u.year):[];let l=0,p=new Date(n);for(;p<s;){const h=p.getFullYear(),u=new Date(h+1,0,1),d=u<s?u:s,v=Vt(p,d),y=r.filter(f=>f.year<=h),$=y.length>0?y[y.length-1]:null,A=$!==null?$.tasa:o;l+=A*v,p=d}return i>0?l/i:o}function ba(t,e){return((1+t/100)/(1+e/100)-1)*100}function rs(t,e,a,o){const n=pt(e,a,o);return n>0?t/n:t}function ls(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,n=e.saludUmbralDTIVerde??30,s=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],r=e.saludExcluirHipoteca||!1,{ingresos:l=0,cuotas:p=0,cuotasHipoteca:h=0,gastosBasicos:u=0,gastosOtros:d=0,amortizaciones:v=0}=t,y=l-p-v-u-d,$=y,A=l>0?$/l*100:null,f=r?p-h:p,g=l>0?f/l*100:null,m=l>0?p/l*100:null,I=l>0?(u+p+v)/l*100:null,b=l>0?d/l*100:null,x=(w,z,_)=>w===null?"neutral":w>=z?"verde":w>=_?"amarillo":"rojo",S=(w,z,_)=>w===null?"neutral":w<=z?"verde":w<=_?"amarillo":"rojo";return{ingresos:l,cuotas:p,cuotasHipoteca:h,gastosBasicos:u,gastosOtros:d,amortizaciones:v,ahorroBruto:y,ahorroReal:$,tasaAhorro:A,dti:g,dtiTotal:m,excluyeHipoteca:r,pctNecesidades:I,pctDeseos:b,semAhorro:x(A,a,o),semDTI:S(g,n,s),semNecesidades:S(I,i[0],i[0]+15),semDeseos:S(b,i[1],i[1]+10),semAhorroRegla:x(A,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function mt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function rt(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function Ut(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];a&&o.push({fecha:a,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,i)=>{s.fecha>=a&&o.push({...s,prioridad:i})}),o.sort((s,i)=>i.fecha.localeCompare(s.fecha)||i.prioridad-s.prioridad);const n=o.find(s=>s.fecha<=e);return n?n.saldo:t.saldoInicial||0}else{const n=[...t.historicoSaldos||[]].sort((s,i)=>i.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=e);return n?n.saldo:0}}function we(t,e){const a=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return a?e.filter(o=>a.includes(o._id)):e.filter(o=>o.activo&&!o.simulacion)}function ha(t,e,a=0){const o=we(t,e).reduce((n,s)=>n+rt(s),0);return t.usarColchon!==!1?Math.max(0,o-a):o}function cs(t,e,a){if(!t.targetAmount||t.targetAmount<=0)return null;const o=we(t,e);if(o.length===0)return null;const n=a.hoy??new Date,s=a.horizonteMeses??120,i=t.usarColchon!==!1,r=o.map(l=>({acc:l,eventos:a.extractoCuenta(l),cursor:0,saldo:rt(l)}));for(let l=1;l<=s;l++){const p=new Date(n.getFullYear(),n.getMonth()+l,1),h=`${p.getFullYear()}-${String(p.getMonth()+1).padStart(2,"0")}`,u=V(new Date(p.getFullYear(),p.getMonth()+1,0));let d=0;for(const y of r){for(;y.cursor<y.eventos.length&&y.eventos[y.cursor].fecha<=u;)y.saldo=y.eventos[y.cursor].saldoAcum??y.saldo,y.cursor++;d+=y.saldo}const v=i?a.colchonEnFecha(u):0;if(d-v>=t.targetAmount)return h}return null}function ya(t,e){const a=t.escenarioIds||[];return a.length===0?!0:!!e&&a.includes(e)}function xa(t,e){const a=o=>ya(o,e);return{loans:t.loans.filter(a).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}const Ce=t=>t.slice(0,7);function ds(t){const[e,a]=t.split("-").map(Number);return`${a===12?e+1:e}-${String(a===12?1:a+1).padStart(2,"0")}`}function je(t,e,a){if(t.length===0)return[];const o=new Map;for(const p of t)p.saldoAcum!==void 0&&o.set(Ce(p.fecha),p.saldoAcum);const n=t[0];let s=(n.saldoAcum??0)-(n.delta??0);const i=Ce(e||n.fecha),r=Ce(a||t[t.length-1].fecha);if(r<i)return[];const l=[];for(let p=i;p<=r;p=ds(p)){const h=o.get(p);h!==void 0&&(s=h);const[u,d]=p.split("-").map(Number);l.push({x:G(V(new Date(u,d-1,15))).getTime(),mes:p,y:s})}return l}function Ee(t,e){let a=null;for(const o of t){if(o.fecha>e)break;o.saldoAcum!==void 0&&(a=o.saldoAcum)}return a}function us(t){const e=a=>!a.simulacion;return{loans:t.loans.filter(e).map(a=>({...a,amortizaciones:(a.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}function ps(t){const e=a=>!!a.simulacion;return t.loans.some(a=>e(a)||(a.amortizaciones||[]).some(e))||t.expenses.some(e)||t.nominas.some(e)||t.accounts.some(e)}const gt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ut(t,e){const a=[...e].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=a.length-1;s>=0;s--){const[i,r]=a[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function ze(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,n=Math.min(2e3,a),s=Math.max(0,a-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function Mt(t,e){return ze(t,e).baseImponible}function $a(t,e){return ut(t,e)/12}const jt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Fe(t,e){if(!t||t<=0)return 0;const a=e||jt;let o=0,n=t;for(let s=0;s<a.length;s++){const[i,r]=a[s],l=s<a.length-1?a[s+1][0]:1/0,p=Math.min(n,l-i);if(!(p<=0)&&(o+=p*(r/100),n-=p,n<=0))break}return o}function Rt(t,e){if(mt(t)!=="inversion")return null;const a=rt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,a-o),s=Fe(n,e);return{saldo:a,costBase:o,plusvalia:n,impuesto:s,neto:a-s}}function pe(t,e=new Date){var d;if(mt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=rt(t),n=V(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),s=[...t.aportaciones||[]].sort((v,y)=>v.fecha.localeCompare(y.fecha));let i=0;const r=s.reduce((v,y)=>v+y.cantidad,0);for(const v of s)v.fecha<=n&&(i+=v.cantidad);const l=Math.max(0,o-r),p=r>0?i/r:0,h=Math.min(o,i+l*p),u=Math.max(0,o-h);return{saldo:o,disponible:h,bloqueado:u,costBase:r,beneficio:l,numAportaciones:s.length,proxDesbloqueo:((d=s.find(v=>v.fecha>n))==null?void 0:d.fecha)||null}}function Ia(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(mt(t)!=="pension"||!o)return 0;const n=rt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((p,h)=>p+h.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(e*r*o/100).toFixed(2)}function _e(t,e,a){var l;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(e||[]).filter(p=>(p.grupoNomina||"")===o&&p.activo!==!1).reduce((p,h)=>p+(h.bruto||0)*(h.nPagas||12),0),i=[...a||[]].sort((p,h)=>p[0]-h[0]);let r=((l=i[0])==null?void 0:l[1])||19;for(const[p,h]of i)if(s>=p)r=h;else break;return r}const Pe=6.35;function Et(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function Aa(t){return Math.max(0,(t.bruto||0)-Et(t))}function ms(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function fs(t){const e=t.reduce((i,r)=>i+(r.bruto||0),0),a=t.reduce((i,r)=>i+Et(r),0),o=Math.max(0,e-a),n=Mt(e,a),s=new Map;for(const i of t)s.set(i._id,o>0?n*(Aa(i)/o):0);return s}function De(t,e,a){if(t.irpfModo==="manual")return Aa(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return ut(Mt(t.bruto||0,Et(t)),a);const o=ms(e.filter(i=>i.irpfModo!=="manual")),n=fs(e);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return ut(s+r,a)-ut(s,a);s+=r}return ut(Mt(t.bruto||0,Et(t)),a)}function vs(t,e){return t.reduce((a,o)=>a+De(o,t,e),0)}function gs(t,e){var n;const a=[...e||[]].sort((s,i)=>s[0]-i[0]);let o=((n=a[0])==null?void 0:n[1])??19;for(const[s,i]of a)if(t>=s)o=i;else break;return o}function Ma(t,e){if(!t||t.length===0)return 0;const a=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+Et(s),0);return gs(Mt(a,o),e)}function Te(t,e,a){const o=t.bruto||0,n=Et(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??Pe,l=s*(r/100),p=De(t,e,a);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:l,irpfAnual:p,irpfPct:s>0?p/s*100:0,netoPorPaga:(s-l-p)/i}}function bs(t){const e=new Map,a=[];for(const o of t){const n=o.grupoNomina||"";if(!n){a.push(o);continue}const s=e.get(n)??[];s.push(o),e.set(n,s)}return{grupos:e,sueltas:a}}const zt=1500;function Sa(t){const e=t.cuantia||0,a=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?e*12/a:t.tipoFrecuencia==="diaria"?e*365.25/a:e}const Yt=t=>{const e=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(e)?e:0};function hs(t,e){const a=t.grupoNomina||"";return a?e.filter(o=>(o.grupoNomina||"")===a):null}function wa(t,e){return t.reduce((a,o)=>a+De(o,hs(o,t),e),0)}function Ca(t){const{nominas:e,tramosGeneral:a,tramosAhorro:o}=t,n=t.extras??{},s=e.reduce((w,z)=>w+(z.bruto||0),0),i=e.reduce((w,z)=>w+Et(z),0),r=ze(s,i),l=t.aportacionesPension,p=zt,h=Math.min(l,p),u=Math.max(0,r.RNT-r.reducArt20-h),d=Yt(n.capInmobiliario),v=Yt(n.capMobiliario),y=Yt(n.gananciasFondos),$=Yt(n.otrasCorto),A=Yt(n.retCapital),f=Math.max(0,u+t.otrosIngresos+d+$),g=Math.max(0,v+y),m=ut(f,a),I=ut(g,o),b=m+I,x=wa(e,a),S=x+A;return{brutoTotal:s,flexTotal:i,brutoIRPF:r.baseIRPF,cotizSS:r.cotizSS,gastosArt19:r.gastosArt19,RNT:r.RNT,reducArt20:r.reducArt20,aportPP:l,limPP:p,deducPP:h,RNTred:u,otrosIngresos:t.otrosIngresos,capInmobiliario:d,capMobiliario:v,gananciasFondos:y,otrasCorto:$,baseGeneral:f,baseAhorro:g,cuotaGen:m,cuotaAho:I,cuotaIntegra:b,retNomina:x,retCapital:A,totalRet:S,resultado:b-S}}const ys=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:zt,TRAMOS_AHORRO_DEFAULT:jt,TRAMOS_IRPF_DEFAULT:gt,ajustarFechaPago:da,ajustarPrecioReal:rs,calcBaseImponibleTrabajo:Mt,calcFactorInflacion:pt,calcFondoInversion:Rt,calcFondosPension:pe,calcGananciasCapital:Fe,calcIRPF:ut,calcImpuestoPension:Ia,calcInflacionMediaAnual:ga,calcSaludFinanciera:ls,calcTAE:pa,calcTipoMarginalPension:_e,calcTipoRealFisher:ba,calcularDeclaracion:Ca,clampedDate:ca,cuentasDelObjetivo:we,cuotaMensual:Tt,desgloseBaseTrabajo:ze,diasEntre:Vt,filtrarPorEscenario:xa,formatEUR:j,formatLocalDate:V,formatPct:ua,fromCents:et,haySimulaciones:ps,ingresoAnual:Sa,labelDiaPago:Se,lastDayOfMonth:Me,modeloFondoDe:mt,parseLocalDate:G,proyectarFechaCumplimiento:cs,resolverDiaEfectivo:ue,resumenPrestamo:at,resumenPrestamoConAhorro:va,retencionMensual:$a,retencionesNomina:wa,roundMoney:W,saldoEnFecha:Ut,saldoEnFechaExtracto:Ee,saldoParaObjetivo:ha,saldoRealCuenta:rt,serieMensual:je,sinSimulaciones:us,tablaAmortizacion:ma,toCents:It,todayISO:Y,visibleEnEscenario:ya},Symbol.toStringTag,{value:"Module"}));function Jt(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const r=G(i.fechaInicio||e.start),l=i.fechaFin?G(i.fechaFin):s,p=i.cuantia,h=u=>o.push({fecha:u,concepto:i.concepto,cuantia:p,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=l&&h(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const u=Math.max(1,i.frecuencia||1);let d=r.getFullYear(),v=r.getMonth();const y=Math.ceil(240/u)+2;for(let $=0;$<y;$++){const A=ue(d,v,i.diaPago||"")||(()=>{const g=r.getDate(),m=new Date(d,v+1,0).getDate();return V(new Date(d,v,Math.min(g,m)))})(),f=G(A);if(f>s||f>l)break;f>=n&&f>=r&&h(A),v+=u,v>=12&&(d+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const u=Math.max(1,i.frecuencia||1)*864e5;let d=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const v=Math.ceil((n.getTime()-r.getTime())/u);d=new Date(r.getTime()+v*u)}for(;d<=s&&d<=l;)h(V(d)),d=new Date(d.getTime()+u)}}return o}function ja(t,e,a=null){const o=[];for(const n of t){if(!n.activo||a&&a.length>0&&!a.includes(n.cuenta||"default"))continue;const{tabla:s}=at(n);for(const i of s)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function Ea(t,e,a=null,o={accounts:[]}){const n=[],s=G(e.start),i=G(e.end),r=o.accounts||[],l=o.nominas||[],p=o.resolverTramosIRPF||(()=>gt),h=o.resolverTramosGanancias||(()=>jt),u=d=>{var v;return((v=r.find(y=>y._id===d))==null?void 0:v.nombre)??d};for(const d of t){if(!d.activo||d.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(d.cuenta||"default")||a.includes(d.cuentaDestino||"default")))continue;const v=G(d.fechaInicio||e.start),y=d.fechaFin?G(d.fechaFin):i,$=A=>{const f=r.find(D=>D._id===(d.cuenta||"default")),g=r.find(D=>D._id===(d.cuentaDestino||"default")),m=mt(f),I=mt(g),b=m==="inversion"&&I==="inversion"||m==="pension"&&I==="pension",x=["transferencia",...b?["traspaso"]:[],...d.tags||[]],S=b?"traspaso-out":"transfer-out",w=b?"traspaso-in":"transfer-in",z=!a||a.length===0||a.includes(d.cuenta||"default"),_=!a||a.length===0||a.includes(d.cuentaDestino||"default");if(z&&n.push({fecha:A,concepto:`Transf. → ${u(d.cuentaDestino||"default")}: ${d.concepto}`,cuantia:d.cuantia,tipo:"gasto",tags:x,cuenta:d.cuenta||"default",sourceId:d._id,sourceType:S}),_&&n.push({fecha:A,concepto:`Transf. ← ${u(d.cuenta||"default")}: ${d.concepto}`,cuantia:d.cuantia,tipo:"ingreso",tags:x,cuenta:d.cuentaDestino||"default",sourceId:d._id,sourceType:w}),z&&!b&&f){if(m==="inversion"){const D=parseInt(A.slice(0,4)),C=Rt(f,h(D));if(C&&C.saldo>0&&C.plusvalia>0){const M=Math.min(1,d.cuantia/C.saldo),F=C.plusvalia*M*.19;F>.01&&n.push({fecha:A,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:F,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:d.cuenta||"default",sourceId:d._id,sourceType:"investment-tax"})}}else if(m==="pension"){const D=p(parseInt(A.slice(0,4))),C=_e(f,l,D),M=Ia(f,d.cuantia,C||void 0);if(M>0){const E=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${C}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;n.push({fecha:A,concepto:E,cuantia:M,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:d.cuenta||"default",sourceId:d._id,sourceType:"pension-tax"})}}}};if(d.tipoFrecuencia==="extraordinario")v>=s&&v<=i&&v<=y&&$(d.fechaInicio);else if(d.tipoFrecuencia==="mensual"){const A=Math.max(1,d.frecuencia||1);let f=v.getFullYear(),g=v.getMonth();const m=Math.ceil(240/A)+2;for(let I=0;I<m;I++){const b=ue(f,g,d.diaPago||"")||(()=>{const S=v.getDate(),w=new Date(f,g+1,0).getDate();return V(new Date(f,g,Math.min(S,w)))})(),x=G(b);if(x>i||x>y)break;x>=s&&x>=v&&$(b),g+=A,g>=12&&(f+=Math.floor(g/12),g=g%12)}}else if(d.tipoFrecuencia==="diaria"){const A=Math.max(1,d.frecuencia||1)*864e5;let f=new Date(Math.max(v.getTime(),s.getTime()));if(v<s){const g=Math.ceil((s.getTime()-v.getTime())/A);f=new Date(v.getTime()+g*A)}for(;f<=i&&f<=y;)$(V(f)),f=new Date(f.getTime()+A)}}return n}function za(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){const r=mt(i);if(r==="cuenta"||!i.activo)continue;const l=i.planAportaciones||[];for(const p of l){if(!p.importe||p.importe<=0)continue;const h=G(p.fechaInicio||e.start),u=p.fechaFin?G(p.fechaFin):s,d=p.cuentaOrigen||"default",v=!a||!a.length||a.includes(d),y=!a||!a.length||a.includes(i._id),$=r==="pension"?"pension":"capital-mobiliario",A=b=>{v&&o.push({fecha:b,concepto:`Aportación → ${i.nombre}`,cuantia:p.importe,tipo:"gasto",tags:["aportacion","transferencia",$],cuenta:d,sourceId:p._id,sourceType:"aportacion-out"}),y&&o.push({fecha:b,concepto:`Aportación ${i.nombre} (${p.periodicidad||"mensual"})`,cuantia:p.importe,tipo:"ingreso",tags:["aportacion","transferencia",$],cuenta:i._id,sourceId:p._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[p.periodicidad||"mensual"]||1;let g=h.getFullYear(),m=h.getMonth();const I=Math.ceil(240/f)+2;for(let b=0;b<I;b++){const x=new Date(g,m+1,0).getDate(),S=V(new Date(g,m,Math.min(h.getDate(),x))),w=G(S);if(w>s||w>u)break;w>=n&&w>=h&&A(S),m+=f,m>=12&&(g+=Math.floor(m/12),m=m%12)}}}return o}function Fa(t,e,a=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||a&&a.length>0&&!a.includes(s._id))continue;const i=G(e.start),r=G(e.end),l=s.periodoCobro||"mensual",p=l==="mensual",h=p?null:{diario:864e5,semanal:7*864e5}[l]||864e5,u=p?1/12:h/(365.25*864e5);let d=Ut(s,e.start);const v=o.filter(A=>A.cuenta===s._id).map(A=>({fecha:A.fecha,delta:A.tipo==="ingreso"?Math.abs(A.cuantia):-Math.abs(A.cuantia)})).sort((A,f)=>A.fecha.localeCompare(f.fecha));let y=0,$=new Date(i);for(;$<=r;){const A=p?new Date($.getFullYear(),$.getMonth()+1,$.getDate()):new Date($.getTime()+h),f=new Date(Math.min(A.getTime(),r.getTime()+1)),g=V(f);let m=0;for(;y<v.length&&v[y].fecha<g;)m+=v[y].delta,y++;const I=d,b=d+m,x=Math.max(0,(I+b)/2);d=b;const S=p?u:(f.getTime()-$.getTime())/(365.25*864e5),w=x*(Math.pow(1+s.interes/100,S)-1);w>.001&&n.push({fecha:V($),concepto:`Interés ${s.nombre}`,cuantia:w,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),$=A}}return n}function _a(t,e,a,o=null){const n=[],s=e||gt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),l=$a(r,s),p={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:l,tags:["irpf","fiscal"]};n.push(...Jt([p],a,o))}return n}const xs=[5,11,2,8],$s={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function Pa(t,e,a=null,o=[],n=()=>gt){const s=[],i=G(e.start),r=G(e.end),l=o.length>0,p={};for(const d of t){const v=d.grupoNomina||"";p[v]||(p[v]=[]),p[v].push(d)}for(const d of Object.keys(p))p[d].sort((v,y)=>(y.bruto||0)-(v.bruto||0));function h(d,v){if(!l||!d.mesActualizacionIPC)return d.bruto||0;const y=d.fechaInicio||e.start,$=G(y),A=G(v);let f=0;for(let m=$.getFullYear();m<=A.getFullYear();m++){const I=new Date(m,d.mesActualizacionIPC-1,1);I>$&&I<=A&&f++}if(f===0)return d.bruto||0;const g=V(new Date($.getFullYear()+f,0,1));return(d.bruto||0)*pt(o,y,g)}function u(d,v){const y=h(d,v),$=(d.retribucionFlexible||[]).reduce((D,C)=>D+(C.importe||0)*12,0),A=Math.max(0,y-$);if(d.irpfModo==="manual")return A*((d.irpfPct||0)/100);const f=n(parseInt(v.slice(0,4))),g=d.grupoNomina||"";if(!g)return ut(Mt(y,$),f);const m=p[g].filter(D=>D.activo),I=m.reduce((D,C)=>D+h(C,v),0),b=m.reduce((D,C)=>D+(C.retribucionFlexible||[]).reduce((M,E)=>M+(E.importe||0)*12,0),0),x=Math.max(0,I-b),S=Mt(I,b),w=Math.max(0,y-$),z=x>0?S*(w/x):0,_=m.filter(D=>D._id!==d._id&&(D.bruto||0)>(d.bruto||0)).reduce((D,C)=>{const M=(C.retribucionFlexible||[]).reduce((F,T)=>F+(T.importe||0)*12,0),E=Math.max(0,h(C,v)-M);return D+(x>0?S*(E/x):0)},0);return ut(_+z,f)-ut(_,f)}for(const d of t){if(!d.activo)continue;const v=d.cuenta||"default";if(a&&a.length>0&&!a.includes(v))continue;const y=Math.max(1,d.nPagas||12),$=G(d.fechaInicio||e.start),A=d.fechaFin?G(d.fechaFin):r,f=g=>{const m=h(d,g),I=u(d,g),b=(d.retribucionFlexible||[]).reduce((M,E)=>M+(E.importe||0)*12,0),x=Math.max(0,m-b),S=(d.ssPct??6.35)/100,w=x*S,z=x/y,_=I/y,D=w/y,C=d.representacion==="simplificado"?z-D-_:z;s.push({fecha:g,concepto:d.nombre,cuantia:C,tipo:"ingreso",cuenta:v,tags:d.tags||[],sourceId:d._id,sourceType:"nomina"}),d.representacion==="detallado"&&(D>0&&s.push({fecha:g,concepto:`SS ${d.nombre}`,cuantia:D,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:d._id+"_ss",sourceType:"nomina"}),_>0&&s.push({fecha:g,concepto:`IRPF ${d.nombre}`,cuantia:_,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:d._id+"_irpf",sourceType:"nomina"}));for(const M of d.retribucionFlexible||[])!M.cuenta||!(M.importe>0)||a&&a.length>0&&!a.includes(M.cuenta)||s.push({fecha:g,concepto:`${d.nombre} — ${$s[M.tipo]||M.tipo}`,cuantia:M.importe,tipo:"ingreso",cuenta:M.cuenta,tags:["retribucion-flexible",M.tipo],sourceId:`${d._id}_flex_${M._id||M.tipo}`,sourceType:"nomina"})};if(y<=12){const g=y===12?1:Math.round(12/y),m=$.getDate();let I=$.getFullYear(),b=$.getMonth();for(let x=0;x<300;x++){const S=new Date(I,b+1,0).getDate(),w=new Date(I,b,Math.min(m,S));if(w>r||w>A)break;w>=i&&w>=$&&f(V(w)),b+=g,b>=12&&(I+=Math.floor(b/12),b=b%12)}}else{const g=y-12,m=$.getDate();let I=$.getFullYear(),b=$.getMonth();for(let w=0;w<300;w++){const z=new Date(I,b+1,0).getDate(),_=new Date(I,b,Math.min(m,z));if(_>r||_>A)break;_>=i&&_>=$&&f(V(_)),b++,b>=12&&(I++,b=0)}const x=Math.max($.getFullYear(),i.getFullYear()),S=Math.min((d.fechaFin?A:r).getFullYear(),r.getFullYear());for(let w=x;w<=S;w++)for(const z of xs.slice(0,g)){const _=new Date(w,z,15);_>=i&&_<=r&&_>=$&&_<=A&&f(V(_))}}}return s}function Da(t,e,a,o=null,n="default"){const s=[];if(!e||e.length===0)return s;const i=G(a.start),r=G(a.end),l=Y(),p=t.filter(u=>u.activo&&u.tipo==="gasto"&&u.tipoFrecuencia==="mensual");let h=new Date(i.getFullYear(),i.getMonth(),1);for(;h<=r;){const u=h.getFullYear(),d=h.getMonth(),v=u+"-"+String(d+1).padStart(2,"0"),y=v+"-01",$=V(new Date(u,d+1,0)),A=V(new Date(u,d,15));let f=0;for(const g of p){if(o&&o.length>0&&!o.includes(g.cuenta||"default")||g.fechaInicio&&g.fechaInicio>$||g.fechaFin&&g.fechaFin<y)continue;const m=g.fechaInicio||l,I=pt(e,m,A);if(I<=1)continue;const b=Math.max(1,g.frecuencia||1);f+=g.cuantia*(I-1)/b}f>.01&&s.push({fecha:A,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),h=new Date(u,d+1,1)}return s}function Ta(t,e,a,o="default"){const n=[];if(!e||e.length===0||t<=0)return n;const s=G(a.start),i=G(a.end),r=[...e].sort((p,h)=>p.year-h.year);let l=new Date(s.getFullYear(),s.getMonth(),1);for(;l<=i;){const p=l.getFullYear(),h=l.getMonth(),u=p+"-"+String(h+1).padStart(2,"0"),d=V(new Date(p,h,15)),v=r.filter(g=>g.year<=p),y=v.length>0?v[v.length-1]:r[0],$=y?y.tasa/100:0,A=Math.pow(1+$,1/12)-1,f=t*A;f>.01&&n.push({fecha:d,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+u,sourceType:"inflacion"}),l=new Date(p,h+1,1)}return n}function Ra(t,e,a){const o=a.fechaReferencia||a.dashboardStart,n=o<a.dashboardStart?a.dashboardStart:o>a.dashboardEnd?a.dashboardEnd:o,s=e.reduce((u,d)=>u+Ut(d,n),0),i=t.filter(u=>u.fecha<n),r=t.filter(u=>u.fecha>=n),l=[];let p=s;for(const u of[...i].reverse()){const d=u.tipo==="ingreso"?Math.abs(u.cuantia):-Math.abs(u.cuantia);l.unshift({...u,delta:d,saldoAcum:p}),p-=d}const h=[];p=s;for(const u of r){const d=u.tipo==="ingreso"?Math.abs(u.cuantia):-Math.abs(u.cuantia);p+=d,h.push({...u,delta:d,saldoAcum:p})}return[...l,...h]}function Is(t,e,a,o=null){const n=e.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return Ra([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,a)}function Wt(t){const{loans:e,expenses:a,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],l={start:n.dashboardStart,end:n.dashboardEnd},p=a.filter($=>$.tipo!=="transferencia"),h=a.filter($=>$.tipo==="transferencia"),u={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let d=[];d=d.concat(Jt(p,l,s)),d=d.concat(ja(e,l,s)),d=d.concat(Ea(h,l,s,u)),d=d.concat(za(o,l,s));const v=Fa(o,l,s,d);if(d=d.concat(v),d=d.concat(_a(a,n.tramos_irpf,l,s)),d=d.concat(Pa(i,l,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const $=(o.find(g=>g.activo&&g.esCuentaPrincipal)||o.find(g=>g.activo)||{_id:"default"})._id;d=d.concat(Da(p,r,l,s,$));const f=o.filter(g=>g.activo&&(!s||s.length===0||s.includes(g._id))).reduce((g,m)=>g+Ut(m,n.dashboardStart),0);d=d.concat(Ta(f,r,l,$))}d.sort(($,A)=>$.fecha.localeCompare(A.fecha));const y=o.filter($=>$.activo&&(!s||s.length===0||s.includes($._id)));return Ra(d,y,n)}function As(t,e,a=null){const o=Y(),s=e.filter(r=>r.activo&&(!a||a.length===0||a.includes(r._id))).reduce((r,l)=>r+rt(l),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function Na(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])a.set(n,(a.get(n)||0)+Math.abs(o.cuantia));return a}function Ms(t,e){const a=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${j(i)}) a partir del ${s.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${j(i)} < ${j(e)}) desde ${s.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${j(i)})`})))}return a}function Ss(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=G(e.dashboardStart),n=G(e.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return a/s}function ws(t,e,a=Y()){const o=new Set,n=e.map(r=>{const l=r.fechaInicialSaldo||"",p={};l&&l<=a&&(p[l]=r.saldoInicial||0);for(const h of r.historicoSaldos||[])h.fecha<=a&&(!l||h.fecha>=l)&&(p[h.fecha]=h.saldo);return Object.keys(p).forEach(h=>o.add(h)),p}),s={};for(const r of[...o].sort()){let l=0;for(let p=0;p<e.length;p++){const h=Object.entries(n[p]).filter(([u])=>u<=r);h.length>0?(h.sort(([u],[d])=>d.localeCompare(u)),l+=h[0][1]):l+=e[p].saldoInicial||0}s[r]=l}const i=[];for(const[r,l]of Object.entries(s).sort(([p],[h])=>p.localeCompare(h))){const p=t.filter(v=>v.fecha<=r),h=p.length>0?p[p.length-1].saldoAcum:null;if(h===null)continue;const u=l-h,d=h!==0?u/Math.abs(h)*100:0;i.push({cuenta:"Total",fecha:r,estimado:h,real:l,desv:u,pct:d})}return i}const Cs=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:ws,detectarPuntosCriticos:Ms,mediaMensualGastos:Ss},Symbol.toStringTag,{value:"Module"}));function Qt(t,e=new Date){const a=V(e),o=new Date(e);o.setMonth(o.getMonth()+1);const n=V(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Jt(s,{start:a,end:n}).reduce((r,l)=>r+Math.abs(l.cuantia),0)}function Re(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+Tt(a.capital,a.tin,a.meses),0)}function Oa(t,e,a,o){return e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0?e.colchonFijo:(Qt(t,o)+Re(a))*(e.colchonMeses||6)}function qa(t,e,a,o,n){const i=[...e.colchonPuntos||[]].sort((l,p)=>l.fecha.localeCompare(p.fecha)).filter(l=>l.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(Qt(t,n)+Re(a))*(i.meses||6):Oa(t,e,a,n)}function me(t,e,a,o,n,s=!1,i){const r=[...t.puntos||[]].sort((h,u)=>h.fecha.localeCompare(u.fecha)),l=r.filter(h=>h.fecha<=n).pop()||(s?r[0]:null);return l?l.tipo==="fijo"?l.importe||0:(Qt(e,i)+Re(o))*(l.meses||1):0}function js(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function Es(t,e){const a={};for(const o of e)a[o._id]=rt(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=js(o)),{fecha:o.fecha,saldos:{...a}}))}function zs(t,e,a,o,n,s,i){const r=[];for(const l of(t||[]).filter(p=>p.activo!==!1)){let p=!1;for(let h=0;h<e.length;h++){const u=e[h],d=me(l,o,n,s,u.fecha,!1,i);if(d<=0){p=!1;continue}const v=!l.cuentas||l.cuentas.length===0?u.saldoAcum:l.cuentas.reduce((y,$)=>{var A,f;return y+(((f=(A=a[h])==null?void 0:A.saldos)==null?void 0:f[$])||0)},0);v<d&&!p?(p=!0,r.push({tipo:"bajo_margen",fecha:u.fecha,saldo:v,target:d,nombre:l.nombre,mensaje:`⚠ ${l.nombre}: ${j(v)} < ${j(d)} desde ${u.fecha}`})):v>=d&&p&&(p=!1,r.push({tipo:"recuperacion_margen",fecha:u.fecha,saldo:v,target:d,nombre:l.nombre,mensaje:`✓ ${l.nombre}: recuperado el ${u.fecha}`}))}}return r}const Fs=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Oa,calcColchonEnFecha:qa,calcGastoBasicoMensual:Qt,calcMargenEnFecha:me,detectarCrucesMargenes:zs,saldosPorCuentaEnExtracto:Es},Symbol.toStringTag,{value:"Module"}));function _s(t){if(!t||t.showColchon===!1)return null;const e=t.colchonPuntos??[];return e.length>0?{nombre:"Colchón",puntos:[...e]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function La(t,e){return Vt(G(t),G(e))}const Ps=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ba(t,e){const[a,o,n]=t.split("-").map(Number),s=t.slice(0,4)===e.slice(0,4);return`${n} de ${Ps[o-1]}${s?"":` de ${a}`}`}function ka(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Ds(t,e={}){const{hoy:a=Y(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=e,r=[];for(const u of t.puntosCriticos??[])u.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:u.fecha,distancia:Math.abs(u.saldo),titulo:d=>d?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:d=>`El ${d} el saldo proyectado baja a ${j(u.saldo)}.`}):u.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:u.fecha,distancia:Math.abs(u.saldo),titulo:d=>d?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:d=>`El ${d} el saldo queda en ${j(u.saldo)}, por debajo del colchón.`});for(const u of t.crucesMargenes??[])u.tipo==="bajo_margen"&&r.push({id:`margen:${u.nombre}`,gravedad:"aviso",fecha:u.fecha,distancia:Math.max(0,u.target-u.saldo),titulo:d=>d?`Podrías bajar de «${u.nombre}»`:`Bajas de «${u.nombre}»`,detalle:d=>`El ${d} tendrías ${j(u.saldo)}, y el margen pide ${j(u.target)}.`});const l=new Map;for(const u of r){const d=l.get(u.id);(!d||u.fecha<d.fecha)&&l.set(u.id,u)}const p=[];for(const u of l.values()){const d=La(a,u.fecha);if(d<0||d>(u.gravedad==="critico"?o:n))continue;const v=i?i(d):0,y=v>0&&u.distancia<v;p.push({id:u.id,gravedad:u.gravedad,fecha:u.fecha,dias:d,plazo:ka(d),titulo:u.titulo(y),detalle:u.detalle(Ba(u.fecha,a)),incierto:y})}const h={critico:0,aviso:1};return p.sort((u,d)=>u.fecha.localeCompare(d.fecha)||h[u.gravedad]-h[d.gravedad]),p.slice(0,s)}const Ts=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:_s,construirAvisos:Ds,describirPlazo:ka,diasEntreISO:La,fechaEnPalabras:Ba},Symbol.toStringTag,{value:"Module"}));class Rs extends Error{constructor(a,o){super(`La funcionalidad "${a}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);ss(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=a}}let Kt=null;function Ns(t){const e=Kt;return Kt=t,()=>{Kt=e}}function Ha(t){return Kt?Kt(t):!0}function Ga(t,e){if(!Ha(t))throw new Rs(t,e)}const Va=[];function Ne(){const t=new Map,e=new WeakMap;let a=1,o=0,n=0;const s=l=>{if(!l||typeof l!="object")return 0;const p=e.get(l);if(p)return p;const h=a++;return e.set(l,h),h},i=l=>l.map(p=>[p._id,p.capital,p.tin,p.meses,p.fechaInicio,p.comisionAmort||0,p.comisionApertura||0,p.diaPago||"",p.activo?1:0,p.cuenta||"",(p.amortizaciones||[]).map(h=>`${h.fecha}:${h.cantidad}:${h.tipo||""}`).sort().join(",")].join("|")).join(";");function r(l){const p=[i(l.loans),s(l.expenses),s(l.accounts),s(l.nominas),s(l.inflacionPeriodos),l.config.dashboardStart,l.config.dashboardEnd,l.config.fechaReferencia||"",l.config.usarInflacion?1:0,(l.filtroAccounts||[]).join(",")].join("#"),h=t.get(p);if(h)return n++,h;o++;const u=Wt(l);return t.set(p,u),u}return{statement:r,stats:()=>({hits:n,misses:o}),clear:()=>t.clear()}}function Oe(t,e,a,o,n={},s=Ne()){Ga("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:r=36,minAmortizable:l=500,tipoAmort:p="plazo",fechaPrimeraAmort:h=null,loanIds:u=null,nominas:d=Va,sourceAccountId:v=null,selectedMarginIds:y=null,hoy:$=new Date}=n,A=V($),f=Math.min(120,Math.max(1,r)),g=a.filter(O=>O.activo),m=g.map(O=>O._id),I=g.find(O=>O.esCuentaPrincipal)||g[0],b=v&&m.includes(v)?g.find(O=>O._id===v):I,x=b==null?void 0:b._id,S=t.filter(O=>O.activo&&!O.simulacion&&(!u||u.includes(O._id))).sort((O,H)=>H.tin-O.tin),w=!!y&&y.length>0,z=(o.margenesSeguridad||[]).filter(O=>O.activo!==!1).filter(O=>!O.cuentas||O.cuentas.length===0||O.cuentas.includes(x)).filter(O=>!w||y.includes(O._id));if(S.length===0)return{plan:[],margenesAplicados:z.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const _={};for(const O of S)_[O._id]=[];const D=[];function C(O){const H=new Date($.getFullYear(),$.getMonth()+O,1),U=H.getFullYear(),Q=H.getMonth(),K=`${U}-${String(Q+1).padStart(2,"0")}`,st=V(new Date(U,Q,Math.min(15,new Date(U,Q+1,0).getDate())));return{label:K,dia15:st}}function M(O,H){const U=[...O.amortizaciones||[],..._[O._id]],{tabla:Q}=at({...O,amortizaciones:U}),K=Q.filter(nt=>nt.fecha<=H);if(K.length>0)return K[K.length-1].capitalPendiente;const st=U.filter(nt=>nt.fecha<=H).reduce((nt,vt)=>nt+vt.cantidad,0);return Math.max(0,O.capital-st)}function E(O){const H=t.map(it=>({...it,amortizaciones:[...it.amortizaciones||[],..._[it._id]||[]]})),U={...o,dashboardStart:A,dashboardEnd:O},Q=s.statement({loans:H,expenses:e,accounts:a,config:U,filtroAccounts:null,nominas:d}),K=g.reduce((it,Gt)=>it+rt(Gt),0),st=b?rt(b):0,nt=K>0?st/K:1;let vt=st,ce=K;for(const it of Q){const Gt=it.delta??(it.tipo==="ingreso"?Math.abs(it.cuantia):-Math.abs(it.cuantia));it.cuenta===x?vt+=Gt:m.includes(it.cuenta)||(vt+=Gt*nt),ce=it.saldoAcum}return{source:vt,total:ce}}function F(O){const{source:H}=E(O);if(H<=0)return H;let U=0;for(const Q of z){const K=me(Q,e,o,t,O,!0,$);K>U&&(U=K)}return H-U}const T=2;let N=0;if(h){for(let O=0;O<f;O++)if(C(O).dia15>=h){N=O;break}}for(let O=0;O<f;O++){if((O-N)%i!==0||O<N)continue;const{label:H,dia15:U}=C(O);if(U<A)continue;const Q=F(U)-T;if(Q<l)continue;let K=Q,st=0;for(const nt of S){if(K<l)break;const vt=M(nt,U);if(vt<1)continue;const ce=nt.comisionAmort||0,it=1+ce/100,Gt=Math.floor(K/it),as=Math.min(Gt,vt);if(as<l)continue;const de=Math.min(Math.floor(as),Math.floor(vt)),os=+(de*ce/100).toFixed(2),la=de+os;la>K||(_[nt._id].push({_id:`opt_${H}_${nt._id}`,fecha:U,cantidad:de,tipo:p,simulacion:!0}),st+=la,D.push({mes:H,fechaAmort:U,loanId:nt._id,loanNombre:nt.nombre,tin:nt.tin,capitalAntes:vt,cantidadAmort:de,comision:os,capitalDespues:Math.max(0,vt-de),saldoDisponible:Q+T,excedente:Q,saldoDespues:Q+T-st,tipoAmort:p}),K-=la)}}const P=D.reduce((O,H)=>O+H.cantidadAmort,0),B=D.reduce((O,H)=>O+H.comision,0),L=S.map(O=>{const H=_[O._id];if(!H.length)return null;const U=at(O),Q=at({...O,amortizaciones:[...O.amortizaciones||[],...H]});return{loanId:O._id,nombre:O.nombre,tin:O.tin,fechaFinSin:U.fechaFin,fechaFinCon:Q.fechaFin,mesesAhorrados:U.mesesReales-Q.mesesReales,interesesSin:U.totalIntereses,interesesCon:Q.totalIntereses,ahorroIntereses:U.totalIntereses-Q.totalIntereses,numAmortizaciones:H.length,totalAmortizado:H.reduce((K,st)=>K+st.cantidad,0)}}).filter(O=>O!==null),k=L.reduce((O,H)=>O+H.ahorroIntereses,0);return{plan:D,margenesAplicados:z.length,totalAmortizado:P,totalComisiones:B,totalAhorroIntereses:k,resumenPorLoan:L}}function Ua(t,e,a,o,n={},s){Ga("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:r=500,tipoAmort:l="plazo",fechaObjetivo:p=null,frecuencias:h=[1,2,3,6,12],fechaPrimeraAmort:u=null,loanIds:d=null,nominas:v=Va,sourceAccountId:y=null,selectedMarginIds:$=null,hoy:A=new Date}=n,f=s??Ne(),g=V(A),m=p||V(new Date(A.getFullYear(),A.getMonth()+i,1));function I(S){const w=t.map(C=>({...C,amortizaciones:[...C.amortizaciones||[],...S[C._id]||[]]})),z={...o,dashboardStart:g,dashboardEnd:m},_=f.statement({loans:w,expenses:e,accounts:a,config:z,filtroAccounts:null,nominas:v});if(_.length===0)return a.filter(C=>C.activo).reduce((C,M)=>C+rt(M),0);const D=_.filter(C=>C.fecha<=m);return D.length>0?D[D.length-1].saldoAcum:_[0].saldoAcum}const b=I({}),x=h.map(S=>{const w=Oe(t,e,a,o,{frecuencia:S,mesesHorizonte:i,minAmortizable:r,tipoAmort:l,fechaPrimeraAmort:u,loanIds:d,nominas:v,sourceAccountId:y,selectedMarginIds:$,hoy:A},f),z={};for(const D of t)z[D._id]=[];for(const D of w.plan)z[D.loanId].push({_id:D.mes+"_"+D.loanId,fecha:D.fechaAmort,cantidad:D.cantidadAmort,tipo:l,simulacion:!0});const _=I(z);return{frecuencia:S,label:S===1?"Mensual":`Cada ${S} meses`,numAmortizaciones:w.plan.length,totalAmortizado:w.totalAmortizado,totalComisiones:w.totalComisiones,ahorroIntereses:w.totalAhorroIntereses,saldoObjetivo:_,gananciaSaldo:_-b,valorTotal:w.totalAhorroIntereses+(_-b),plan:w.plan,resumenPorLoan:w.resumenPorLoan}}).filter(S=>S.numAmortizaciones>0);if(x.length>0){const S=Math.max(...x.map(_=>_.ahorroIntereses)),w=Math.max(...x.map(_=>_.saldoObjetivo)),z=Math.max(...x.map(_=>_.valorTotal));x.forEach(_=>{_.esMejorIntereses=_.ahorroIntereses===S,_.esMejorSaldo=_.saldoObjetivo===w,_.esMejorValor=_.valorTotal===z})}return{resultados:x,saldoBase:b,fechaObjetivo:m}}const Os=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:Ua,createStatementMemo:Ne,defaultHoyISO:Y,optimizarAmortizaciones:Oe},Symbol.toStringTag,{value:"Module"})),qs=30.44*864e5;function Ya(t){const e=t.getFullYear(),a=t.getMonth();return{desde:V(new Date(e,a,1)),hasta:V(new Date(e,a,Me(e,a)))}}function Ja(t){const[e,a]=t.split("-").map(Number);return Ya(new Date(e,a-1,1))}function Ls(t,e){return Math.max(1,(G(e).getTime()-G(t).getTime())/qs)}const Bs=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),St=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function ks(t,e){const a=new Map(e.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=a.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function Hs(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=d=>d.sourceType==="loan"&&d.tipo==="gasto",n=e.loanIdsIniciados,s=St(t.filter(d=>d.tipo==="ingreso")),i=St(t.filter(d=>o(d)&&(!n||n.has(d.sourceId??"")))),r=St(t.filter(d=>o(d)&&e.hipotecaIds.has(d.sourceId??""))),l=St(t.filter(d=>d.sourceType==="loan-amort")),p=St(t.filter(d=>d.sourceType==="account-interest")),{basicos:h,deseo:u}=ks(t,e.expenses);return{ingresos:s/a,cuotas:i/a,cuotasHipoteca:r/a,amortizaciones:l/a,gastosBasicos:h/a,gastosDeseo:u/a,gastosTotales:(i+h+u)/a,intereses:p/a}}function Wa(t,e){return t.reduce((a,o)=>{const n=at(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=e);return a+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function Gs(t,e,a,o){const n=t.filter(p=>p.activo&&!p.simulacion&&(p.fechaInicio||"")<=a),s=n.reduce((p,h)=>{if((h.amortizaciones||[]).filter(y=>y.fecha>=e&&y.fecha<=a).length===0)return p;const d=at(h).totalIntereses,v=at({...h,amortizaciones:(h.amortizaciones||[]).filter(y=>y.fecha<e||y.fecha>a)}).totalIntereses;return p+Math.max(0,v-d)},0),i=n.filter(p=>p.mostrarFechaFinEnDashboard!==!1).map(p=>({loan:p,fechaFin:at(p).fechaFin})).filter(p=>!!p.fechaFin&&p.fechaFin>=e&&p.fechaFin<=a),r=n.map(p=>at(p).tabla),l=p=>{const{desde:h,hasta:u}=Ja(p);return r.reduce((d,v)=>{const y=v.find($=>!$.esAmortizacion&&$.fecha>=h&&$.fecha<=u);return d+(y?y.cuota:0)},0)};return{deudaInicio:Wa(n,e),deudaFin:Wa(n,a),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:l(e.slice(0,7)),cuotasFin:l(a.slice(0,7)),finEnPeriodo:i}}function Vs(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:St(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function Qa(t,e=new Set,a="desglosado"){if(e.size===0)return Na(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(p=>e.has(p)),r=s.filter(p=>!e.has(p)),l=a==="porgrupos"&&i.length>0?i:r;for(const p of l)o.set(p,(o.get(p)||0)+Math.abs(n.cuantia))}return o}function Us(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...Qa(t,e.grupoTags,e.modo).entries()].filter(([n])=>!a||a.size===0||a.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function Ys(t,e){const a=e.reduce((o,n)=>o+rt(n),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:St(t.filter(o=>o.tipo==="gasto")),totalIngresos:St(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Js(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function Ws(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function Qs(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}function Ks(t,e){if(t.length===0)return[];const a=p=>e==="mes"?p.slice(0,7):p.slice(0,4),o=p=>e==="mes"?`${p}-01`:`${p}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let l=null;for(const p of t){const h=a(p.fecha),u=p.saldoAcum??i;(!l||l.periodo!==h)&&(l&&(i=l.cierre),l={periodo:h,inicio:o(h),apertura:i,cierre:u,maximo:Math.max(i,u),minimo:Math.min(i,u),eventos:0},r.push(l)),l.cierre=u,u>l.maximo&&(l.maximo=u),u<l.minimo&&(l.minimo=u),l.eventos+=1}return r}const Xs=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Ks,cuentasVisibles:Js,gastoPorTagOrdenado:Us,idsHipoteca:Ws,idsPrestamosIniciados:Qs,interesesPorCuenta:Vs,mesesDelPeriodo:Ls,metricasFlujo:Hs,rangoMes:Ja,rangoMesDe:Ya,resumenPrestamosPeriodo:Gs,sinTransferencias:Bs,sumarGastosPorTag:Qa,totalesPeriodo:Ys},Symbol.toStringTag,{value:"Module"}));function Zs(t,e,a){const o=t||[];if(!o.length)return e;const n=o.find(i=>i.año===a);if(n)return n.tramos;const s=o.filter(i=>i.año<a).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:e}function bt(t,e){return a=>Zs(t,e,a)}const Xt=8,Ka=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Xa=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function qe(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}function Za(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Ka,tramosGananciasCapital:Xa,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function tn(t,e){return{loans:[],expenses:[],accounts:[qe(t)],nominas:[],goals:[],planes:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],config:Za(t,e)}}const ht=t=>Array.isArray(t)?t:[],en=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Zt(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function to(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function Le(t){const{varianza:e,inflacion:a,...o}=t;return o}function an(t,e){const{hoyISO:a,finISO:o}=e,n={...t},s=en(t.config),r={...Za(a,o)};for(const[h,u]of Object.entries(s))u!=null&&(r[h]=u);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Ka),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Xa),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let l=ht(t.accounts).map(h=>{const u={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...h};return u.modeloFondo||(u.modeloFondo=u.esFondoPension?"pension":"cuenta"),delete u.esFondoPension,Array.isArray(u.historicoSaldos)||(u.historicoSaldos=[]),Zt(u)});l.length===0&&(l=[qe(a)]);const p=l.filter(h=>h.esCuentaPrincipal);if(p.length===0){const h=l.find(u=>u._id==="default")||l[0];l=l.map(u=>({...u,esCuentaPrincipal:u._id===h._id}))}else if(p.length>1){let h=!1;l=l.map(u=>u.esCuentaPrincipal?h?{...u,esCuentaPrincipal:!1}:(h=!0,u):u)}return n.accounts=l,n.expenses=ht(t.expenses).map(h=>{const u={basico:!1,activo:!0,tags:[],historialPrecios:[],...h};return Array.isArray(u.tags)||(u.tags=[]),Array.isArray(u.historialPrecios)||(u.historialPrecios=[]),u.diaPago=to(u.diaPago),Le(Zt(u))}),n.loans=ht(t.loans).map(h=>{const u={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...h};return Array.isArray(u.tags)||(u.tags=[]),u.diaPago=to(u.diaPago),u.amortizaciones=ht(u.amortizaciones).map(d=>Zt(d)),Le(Zt(u))}),n.nominas=ht(t.nominas).map(h=>{const u={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...h};return Array.isArray(u.tags)||(u.tags=[]),Array.isArray(u.retribucionFlexible)||(u.retribucionFlexible=[]),Le(Zt(u))}),n.goals=ht(t.goals).map((h,u)=>{const d=Array.isArray(h.cuentaIds)?h.cuentaIds:h.cuentaId?[h.cuentaId]:[],{cuentaId:v,...y}=h;return{prioridad:u+1,completado:!1,usarColchon:!0,targetAmount:0,...y,cuentaIds:d}}),n.inflacion=ht(t.inflacion),n.tramosIRPFHistorico=ht(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=ht(t.tramosGananciasCapitalHistorico),n.escenarios=ht(t.escenarios).map(({inversiones:h,...u})=>u),n}const Nt=t=>Array.isArray(t)?t:[];let Be=0;function on(t){return Be+=1,`${t}_${Be.toString(36)}`}const sn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),nn=t=>typeof t=="number"&&Number.isFinite(t);function rn(t,e){const a={...t};Be=0;const o=Nt(t.transacciones),n=Nt(t.puntosControl),s=[...n],i=new Set(n.map(p=>`${p.cuentaId}|${p.fecha}`)),r=(p,h,u,d)=>{if(!sn(h)||!nn(u))return;const v=`${p}|${h}`;i.has(v)||(i.add(v),s.push({_id:on("pc"),fecha:h,cuentaId:p,saldoCts:It(u),...typeof d=="string"&&d?{nota:d}:{}}))};for(const p of Nt(t.accounts)){const h=typeof p._id=="string"?p._id:null;if(h)for(const u of Nt(p.historicoSaldos))r(h,u.fecha,u.saldo,u.nota)}const l=Nt(t.history);if(l.length>0){const p=Nt(t.accounts),h=p.find(d=>d.esCuentaPrincipal)||p.find(d=>d.activo)||p[0],u=typeof(h==null?void 0:h._id)=="string"?h._id:"default";for(const d of l){const v=typeof d.cuenta=="string"?d.cuenta:typeof d.cuentaId=="string"?d.cuentaId:u;r(v,d.fecha,d.saldo,d.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=s.sort((p,h)=>String(p.fecha).localeCompare(String(h.fecha))),a}const ke=t=>Array.isArray(t)?t:[],ln=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),cn=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let He=0;function dn(){return He+=1,`tx_hp_${He.toString(36)}`}function un(t,e){const a={...t};He=0;const o=[...ke(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=ke(t.expenses).map(i=>{const r=ke(i.historialPrecios),l=typeof i._id=="string"?i._id:null,p=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",h=i.tipo==="ingreso"?"ingreso":"gasto",u=Array.isArray(i.tags)?i.tags.filter(y=>typeof y=="string"):[];if(l)for(const y of r){if(!y||!ln(y.fecha)||!cn(y.cuantia))continue;const $=h==="ingreso"?It(y.cuantia):-It(y.cuantia),A=`${l}|${y.fecha}|${$}`;n.has(A)||(n.add(A),o.push({_id:dn(),fecha:y.fecha,cuentaId:p,importeCts:$,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:u,estimacionId:l,tipo:h,origen:"importado",nota:typeof y.nota=="string"&&y.nota?y.nota:"Importado del historial de precios"}))}const{historialPrecios:d,...v}=i;return v});return a.expenses=s,a.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),a}const eo=t=>Array.isArray(t)?t:[],wt=(t,e="")=>typeof t=="string"&&t.trim()?t:e,Ot=(t,e=0)=>typeof t=="number"&&Number.isFinite(t)?t:e,pn=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function mn(t,e){var h;const a={...t};if(Array.isArray(a.planes))return a;const o=eo(a.goals),n=eo(a.accounts),s=n.map(u=>{const d=Ot(u.bloqueoMeses,0);return{_id:`veh_${wt(u._id,"x")}`,nombre:wt(u.nombre,"Cuenta"),rentabilidadRealAnual:Ot(u.interes,0)/100,liquidez:u.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":d>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Ot(u.impuestoRetirada,0)/100,topeAportacionAnual:u.modeloFondo==="pension"?It(1500):null,riesgo:u.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:wt(u._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Ot(u.interes,0)>0}}),i=new Map(n.map((u,d)=>[wt(u._id,""),s[d]._id])),r=((h=s[0])==null?void 0:h._id)??"",l=o.map((u,d)=>{const v=Array.isArray(u.cuentaIds)?u.cuentaIds.map($=>wt($,"")):[],y=pn(u.targetDate);return{_id:wt(u._id,`obj_mig_${d}`),nombre:wt(u.nombre,`Objetivo ${d+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:It(Ot(u.targetAmount,0)),fechaLimite:y,prioridad:Ot(u.prioridad,d+1),modoAsignacion:y?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:u.completado===!0?"COMPLETADO":"PENDIENTE",notas:wt(u.notas,"")}}),p={_id:"plan_base",nombre:"Plan base",fechaInicio:e.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:l,eventos:[],creadoEn:e.hoyISO};return a.planes=[p],a}const fn=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:an},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:rn},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:un},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:mn}],vn=["history"];function ao(t,e,a){let o=t;const n=[];for(const s of[...fn].sort((i,r)=>i.version-r.version))(e??0)>=s.version||(o=s.migrate(o,a),n.push(s.version));return{state:o,applied:n}}const fe="state_",Ge="state__schemaVersion",oo="financeapp_",so="state__modificadoEn";function gn(t=localStorage,e=oo){const a=o=>`${e}${o}`;return{get(o){try{const n=t.getItem(a(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(a(o),JSON.stringify(n)),o!==so&&t.setItem(a(so),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(e)&&o.push(s.slice(e.length))}return o}}}function bn(t=localStorage,e=oo){const a=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(fe)&&!s.startsWith(e)&&a.push(s)}const o=[];for(const n of a)try{const s=t.getItem(n);s!==null&&t.getItem(`${e}${n}`)===null&&(t.setItem(`${e}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function hn({ventanaMs:t=15e3,ahora:e=()=>Date.now()}={}){let a=null;function o(){return a?e()-a.cuando>t?(a=null,null):a:null}return{registrar(n){a={...n,cuando:e()}},pendiente:o,tomar(){const n=o();return a=null,n},limpiar(){a=null}}}const yn={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},escenarios:{articulo:"El",que:"supuesto"},planes:{articulo:"El",que:"plan"},goals:{articulo:"El",que:"objetivo"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function xn(t,e){const a=yn[t]??{articulo:"El",que:"elemento"},o=e.concepto??e.nombre??e.titulo??(e.year!==void 0?String(e.year):null);return o?`${a.articulo} ${a.que} «${String(o)}»`:`${a.articulo} ${a.que}`}function $n(t){return V(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function In({adapter:t,hoy:e=new Date}){const a=V(e),o=$n(e);let n=tn(a,o);const s=new Set;let i=[];const r=hn();function l(C){for(const M of s)M(C)}function p(C){t.set(`${fe}${C}`,n[C])}function h(){const C={};for(const T of Object.keys(n)){const N=t.get(`${fe}${T}`);N!==null&&(C[T]=N)}for(const T of vn){const N=t.get(`${fe}${T}`);N!==null&&(C[T]=N)}const M=t.get(Ge),{state:E,applied:F}=ao(C,M,{hoyISO:a,finISO:o});if(n=E,u(),F.length>0){for(const T of Object.keys(n))p(T);t.set(Ge,Xt)}return i=F,{applied:F}}function u(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[qe(a)],p("accounts");return}const C=n.accounts.filter(M=>M.esCuentaPrincipal);if(C.length===0)n.accounts=n.accounts.map((M,E)=>E===0?{...M,esCuentaPrincipal:!0}:M),p("accounts");else if(C.length>1){let M=!1;n.accounts=n.accounts.map(E=>E.esCuentaPrincipal?M?{...E,esCuentaPrincipal:!1}:(M=!0,E):E),p("accounts")}}function d(C){return n[C]}function v(C,M){n[C]=M,p(C),l(C)}function y(C){v("config",{...n.config,...C})}function $(C){return s.add(C),()=>s.delete(C)}function A(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function f(C,M){const E=[...n[C]],F={...M,_id:A()};return E.push(F),v(C,E),F}function g(C,M,E){const F=n[C].map(T=>T._id===M?{...T,...E}:T);v(C,F)}function m(C,M){const E=n[C],F=E.findIndex(T=>T._id===M);F<0||(r.registrar({col:C,item:E[F],indice:F}),v(C,E.filter((T,N)=>N!==F)))}function I(){const C=r.tomar();if(!C)return null;const M=[...n[C.col]];return M.splice(Math.min(C.indice,M.length),0,C.item),v(C.col,M),C}function b(){return r.pendiente()}function x(){const C=n.accounts||[],M=C.find(E=>E.esCuentaPrincipal&&E.activo)||C.find(E=>E.activo);return M?M._id:"default"}function S(C){var M;return((M=n.accounts.find(E=>E._id===C))==null?void 0:M.nombre)??C}function w(){return bt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function z(){return bt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function _(){return structuredClone(n)}function D(C,M=null){const{state:E,applied:F}=ao(C,M,{hoyISO:a,finISO:o});n=E,u();for(const T of Object.keys(n))p(T);t.set(Ge,Xt);for(const T of Object.keys(n))l(T);return{applied:F}}return{load:h,get:d,set:v,patchConfig:y,subscribe:$,addItem:f,updateItem:g,removeItem:m,deshacerBorrado:I,borradoPendiente:b,getPrincipalAccountId:x,accountName:S,resolverTramosIRPF:w,resolverTramosGanancias:z,snapshot:_,replaceAll:D,get schemaVersion(){return Xt},get migrationsApplied(){return[...i]},get today(){return a||Y()}}}const X={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},Ct=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:X.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:X.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:X.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:X.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:X.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro (antiguos)",descripcion:"Solo lectura: la copia previa al planificador. Los objetivos se gestionan en «Objetivos financieros». Apagada de fábrica; enciéndela si quieres revisar los antiguos antes de descartarlos.",grupo:X.dinero,porDefecto:!1,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:X.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:X.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:X.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:X.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:X.planificacion,porDefecto:!1},{id:"planner",nombre:"Objetivos financieros",descripcion:"Plan a largo plazo: objetivos que compiten por el flujo mensual y se encadenan al completarse.",grupo:X.planificacion,porDefecto:!0},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:X.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:X.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:X.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:X.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:X.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:X.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:X.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:X.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:X.datos,porDefecto:!1,dependencias:["sync-nube"]}],An=new Map(Ct.map(t=>[t.id,t]));function te(t){return An.get(t)}function no(t){return Ct.filter(e=>(e.dependencias||[]).includes(t))}function Ve(){const t={};for(const e of Ct)t[e.id]=e.porDefecto;return t}function io(){const t=[],e=new Map;for(const a of Ct)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function Mn(t){function e(){return{...Ve(),...t.get("config").features||{}}}function a(u){t.patchConfig({features:u})}function o(u,d=e(),v=new Set){const y=te(u);if(!y)return!1;if(y.nucleo)return!0;if(d[u]===!1)return!1;if(v.has(u))return!0;v.add(u);for(const $ of y.dependencias||[])if(!o($,d,v))return!1;return!0}function n(u,d=e()){const v=te(u);return v?(v.dependencias||[]).filter(y=>!o(y,d)):[]}function s(u,d){var m;const v=te(u);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const y=e(),$=new Map(Ct.map(I=>[I.id,o(I.id,y)])),A={...y,[u]:d};let f;if(d){const I=[...v.dependencias||[]];for(;I.length;){const b=I.pop();A[b]===!1&&(A[b]=!0,f="dependencias-activadas"),I.push(...((m=te(b))==null?void 0:m.dependencias)||[])}}else{const I=no(u).map(b=>b.id);for(;I.length;){const b=I.pop();A[b]!==!1&&(A[b]=!1,f="cascada-apagado"),I.push(...no(b).map(x=>x.id))}}return a(A),{cambiadas:Ct.filter(I=>o(I.id,A)!==$.get(I.id)).map(I=>I.id),motivo:f}}function i(){const u=e();return Ct.map(d=>{const v=n(d.id,u);return{...d,activa:o(d.id,u),...v.length>0&&u[d.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const u=e();return io().map(({grupo:d,features:v})=>({grupo:d,features:v.map(y=>{const $=n(y.id,u);return{...y,activa:o(y.id,u),...$.length>0&&u[y.id]!==!1?{bloqueadaPor:$}:{}}})}))}function l(){a(Ve())}function p(u){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...u?{nombre:u}:{},features:e()}}function h(u){const d=u,v=d&&typeof d=="object"&&d.features&&typeof d.features=="object"?d.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const y=Ve(),$=[],A=[];for(const[f,g]of Object.entries(v)){if(!te(f)){A.push(f);continue}if(typeof g!="boolean"){A.push(f);continue}y[f]=g,$.push(f)}return a(y),{aplicadas:$,ignoradas:A}}return{isEnabled:u=>o(u),setEnabled:s,estado:i,estadoPorGrupo:r,reset:l,exportProfile:p,importProfile:h,bloqueadaPor:u=>n(u)}}const ee=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function qt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Sn(t){var n,s;const a=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(ee).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${ee(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${ee(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${ee(t.descripcion)}</div>
        ${a}
      </div>
    </div>`}function wn(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${ee(o)}</div>
        ${n.map(Sn).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Cn(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function jn(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${wn(a)}`,n(i)}function n(i){var l,p,h;i.querySelectorAll("[data-feature-toggle]").forEach(u=>{u.addEventListener("change",()=>{var y;const d=u.dataset.featureToggle,v=a.setEnabled(d,u.checked);v.motivo==="dependencias-activadas"&&qt(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&qt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(y=t.onChange)==null||y.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(l=i.querySelector('[data-feature-action="export"]'))==null||l.addEventListener("click",()=>{const u=a.exportProfile(),d=new Blob([JSON.stringify(u,null,2)],{type:"application/json"}),v=URL.createObjectURL(d),y=e.createElement("a");y.href=v,y.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,y.click(),URL.revokeObjectURL(v),qt(t,"Perfil de funcionalidades guardado")}),(p=i.querySelector('[data-feature-action="import"]'))==null||p.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var d,v;const u=(d=r.files)==null?void 0:d[0];if(u)try{const{aplicadas:y,ignoradas:$}=a.importProfile(JSON.parse(await u.text()));qt(t,$.length>0?`Perfil cargado (${y.length} aplicadas, ${$.length} ignoradas por ser de otra versión)`:`Perfil cargado (${y.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,y),o(i)}catch(y){qt(t,"No se pudo cargar el perfil: "+y.message,"err")}finally{r.value=""}}),(h=i.querySelector('[data-feature-action="reset"]'))==null||h.addEventListener("click",()=>{var u;a.reset(),qt(t,"Funcionalidades restablecidas"),(u=t.onChange)==null||u.call(t,[]),o(i)})}function s(){const i=Cn(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const ro={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function lo(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const n=e(o);a.style.display=n?"":"none",n?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function En({flags:t,document:e=document,router:a,rutasExtra:o}){function n(){const r=e.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const l=Object.entries((o==null?void 0:o())??{}).map(([p,h])=>[h,p]);for(const[p,h]of[...Object.entries(ro),...l]){const u=t.isEnabled(p),d=e.querySelector(`.nav-btn[data-view="${h}"]`);d&&(d.style.display=u?"":"none"),!u&&n()===h&&(r=!0)}if(e.querySelectorAll(".nav-section").forEach(p=>{const h=[...p.querySelectorAll(".nav-btn[data-view]")];if(h.length===0)return;const u=h.some(d=>d.style.display!=="none");p.style.display=u?"":"none"}),lo(e,p=>t.isEnabled(p)),r){const p=a??globalThis.Router;p==null||p.navigate("dashboard")}}function i(r=e.body){if(typeof MutationObserver>"u")return()=>{};let l=!1;const p=new MutationObserver(()=>{if(!l){l=!0;try{lo(e,h=>t.isEnabled(h))}finally{l=!1}}});return p.observe(r,{childList:!0,subtree:!0}),()=>p.disconnect()}return{apply:s,observar:i,vistaPara:r=>ro[r]}}const zn="toast toast-deshacer";function Fn(t){const{store:e,rerender:a,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function l(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function p(u){const d=n();if(!d)return;l();const v=document.createElement("div");v.className=zn,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const y=document.createElement("span");y.textContent=`${xn(u.col,u.item)} se ha eliminado.`,y.style.flex="1";const $=document.createElement("button");$.type="button",$.className="btn-secondary btn-sm",$.textContent="Deshacer",$.style.flexShrink="0",$.addEventListener("click",()=>{const A=e.deshacerBorrado();if(l(),!A)return;const f=n();if(f){const g=document.createElement("div");g.className="toast toast-ok",g.textContent="Deshecho.",f.appendChild(g),setTimeout(()=>g.remove(),2500)}a==null||a()}),v.appendChild(y),v.appendChild($),d.appendChild(v),s=v,i=setTimeout(l,o)}const h=e.subscribe(()=>{const u=e.borradoPendiente();if(!u){r=null,l();return}u!==r&&(r=u,p(u))});return()=>{h(),l()}}function _n({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function n(y){return`view-${y}`}function s(y){const $=t.getElementById(n(y.route));if($)return $;const A=t.querySelector(".view-container");if(!A)return null;const f=t.createElement("div");return f.id=n(y.route),f.className="view hidden",A.appendChild(f),f}function i(y){if(t.querySelector(`.nav-btn[data-view="${y.route}"]`))return;const $=t.querySelectorAll(".nav-section"),A=$[y.seccion??Math.max(0,$.length-1)];if(!A)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=y.route,f.innerHTML=`${y.iconoPath?`<svg viewBox="0 0 24 24"><path d="${y.iconoPath}"/></svg>`:""}<span>${y.nombre}</span>`,A.appendChild(f),f.addEventListener("click",()=>{const g=globalThis.Router;g==null||g.navigate(y.route)})}function r(y){a.set(y.route,y),s(y),i(y)}function l(){return[...a.keys()].filter(y=>{const $=a.get(y);return!e||e($.flagId??$.id)})}function p(y){return l().includes(y)}function h(y){const $=a.get(y);if(!$||e&&!e($.flagId??$.id))return!1;const A=s($);if(!A)return!1;if(o&&o!==y){const f=a.get(o),g=t.getElementById(n(o));f!=null&&f.unmount&&g&&f.unmount(g)}return $.mount(A),o=y,!0}function u(){o&&h(o)}function d(){const y={};for(const[$,A]of a)y[$]=A.flagId??A.id;return y}function v(){for(const y of a.values())s(y),i(y)}return{register:r,routes:l,has:p,mount:h,rerender:u,flagPorRuta:d,attachToShell:v,get activa(){return o}}}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ft(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${c(j(t))}</span>`}function co(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function uo(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${c(e)}</span>`).join(" ")}const Pn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ue(t){const[e,a]=t.split("-").map(Number);return`${Pn[a-1]} ${e}`}function q(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function Z(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function R(t,e,a){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function J(t,e,a){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function ft(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function po(t,e){const a=parseFloat(ft(t,e));return Number.isFinite(a)?a:0}function Dn(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Tn(t,e){const{ledger:a}=t,o=(t.hoy??Y)(),n=t.accounts().filter(g=>g.activo),{desde:s,hasta:i}=Dn(e.mes),r={cuentaId:e.cuentaId||void 0,desde:s,hasta:i,texto:e.filtroTexto||void 0},l=a.transacciones(r),p=t.estimaciones().filter(g=>g.tipo!=="transferencia"),h=l.filter(g=>g.importeCts<0).reduce((g,m)=>g+m.importeCts,0),u=l.filter(g=>g.importeCts>0).reduce((g,m)=>g+m.importeCts,0),d=e.cuentaId?a.saldoCuenta(e.cuentaId,i):a.saldoTotal(i),v=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),y=n.map(g=>`<option value="${c(g._id)}"${g._id===e.cuentaId?" selected":""}>${c(g.nombre)}</option>`).join(""),$=g=>'<option value="">— sin asignar —</option>'+p.map(m=>`<option value="${c(m._id)}"${m._id===g?" selected":""}>${c(m.concepto)} (${c(j(m.cuantia))})</option>`).join(""),A=l.map(g=>{var m;return`
      <tr data-tx="${c(g._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${c(g.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${c(g.concepto)}</td>
        <td style="padding:7px 8px">${uo(g.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${c(((m=t.accounts().find(I=>I._id===g.cuentaId))==null?void 0:m.nombre)??g.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${c(g._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${$(g.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Ft(et(g.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${c(g._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${c(g._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),f=v.slice().reverse().slice(0,8).map(g=>{var m;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${c(g.fecha)}</span>
        <span style="color:var(--text3)">${c(((m=t.accounts().find(I=>I._id===g.cuentaId))==null?void 0:m.nombre)??g.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${c(j(et(g.saldoCts)))}</span>
        ${g.nota?`<span style="color:var(--text3)">${c(g.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${c(g._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="card-title">Movimientos reales</div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${y}</select>
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
          <span>Gastos: ${Ft(et(h))}</span>
          <span>Ingresos: ${Ft(et(u))}</span>
          <span>Neto: ${Ft(et(u+h))}</span>
          <span style="margin-left:auto">Saldo a ${c(i)}: <strong>${c(j(d))}</strong></span>
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
              ${A||'<tr><td colspan="7" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
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
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${y}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(g=>`<option value="${c(g)}"></option>`).join("")}</datalist>
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
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${y}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${f?`<div class="mt-12">${f}</div>`:""}
        </div>
      </div>
    </div>`}function Rn(t,e,a,o){const{ledger:n}=e;J(t,"#acc-cuenta",i=>{a.cuentaId=i.value,o()}),J(t,"#acc-mes",i=>{a.mes=i.value||a.mes,o()});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{a.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),R(t,"#nt-guardar",()=>{const i=ft(t,"#nt-concepto").trim(),r=po(t,"#nt-importe");if(!i)return q("Indica un concepto","err");if(!(r>0))return q("Indica un importe mayor que cero","err");const l=ft(t,"#nt-tags").split(",").map(p=>p.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:ft(t,"#nt-fecha")||(e.hoy??Y)(),cuentaId:ft(t,"#nt-cuenta"),importe:r,concepto:i,tags:l,tipo:ft(t,"#nt-tipo"),estimacionId:ft(t,"#nt-estimacion")||null}),q("Movimiento registrado"),e.onDatosCambiados(),o()}),R(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;Z("¿Eliminar este movimiento?")&&(n.eliminar(r),q("Movimiento eliminado"),e.onDatosCambiados(),o())}),R(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,l=n.transacciones().find(u=>u._id===r);if(!l)return;const p=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(et(l.importeCts))));if(p===null)return;const h=parseFloat(p.replace(",","."));if(!Number.isFinite(h)||h<=0)return q("Importe no válido","err");n.actualizar(r,{importe:h}),q("Movimiento actualizado"),e.onDatosCambiados(),o()}),J(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),q("Asignación actualizada"),e.onDatosCambiados()}),R(t,"#pc-guardar",()=>{if(ft(t,"#pc-saldo").trim()==="")return q("Indica el saldo","err");const r=po(t,"#pc-saldo");n.registrarPuntoControl(ft(t,"#pc-cuenta"),ft(t,"#pc-fecha")||(e.hoy??Y)(),r,ft(t,"#pc-nota").trim()||void 0),q("Saldo real registrado"),e.onDatosCambiados(),o()}),R(t,"[data-pc-borrar]",i=>{Z("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),q("Punto de control eliminado"),e.onDatosCambiados(),o())})}function Ye(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=W(t.mediaRealReciente),i=W(s-e),r=e!==0?i/Math.abs(e)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const l=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:W(e),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:l,motivo:i>0?`El gasto real de los últimos ${l} meses supera lo estimado`:`El gasto real de los últimos ${l} meses es inferior a lo estimado`}}function Nn(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(s,i,r={}){const l=r.hoy??Y(),p=t.get("expenses"),h=p.find(y=>y._id===s);if(!h)throw new Error(`La estimación ${s} no existe`);const u={...h,fechaFin:l},d={...h,_id:e(),cuantia:W(i),fechaInicio:l,fechaFin:h.fechaFin??null,ajustadaDesdeId:h._id,ajustadaEn:l},v=p.map(y=>y._id===s?u:y);return v.push(d),t.set("expenses",v),{estimacionCerrada:u,estimacionNueva:d}}function o(s,i={}){const r=[],l=[];for(const p of s)try{r.push(a(p.estimacionId,p.cuantiaSugerida,i))}catch(h){l.push({estimacionId:p.estimacionId,error:h.message})}return{aplicadas:r,errores:l}}function n(s){const i=t.get("expenses"),r=new Map(i.map($=>[$._id,$])),l=r.get(s);if(!l)return[];const p=[];let h=l;const u=new Set;for(;h!=null&&h.ajustadaDesdeId&&!u.has(h._id);){u.add(h._id);const $=r.get(h.ajustadaDesdeId);if(!$)break;p.unshift($),h=$}const d=[];let v=l;const y=new Set([l._id]);for(;;){const $=i.find(A=>A.ajustadaDesdeId===v._id&&!y.has(A._id));if(!$)break;y.add($._id),d.push($),v=$}return[...p,l,...d]}return{aplicar:a,aplicarTodas:o,cadena:n}}function Je(t){const e=t.estimaciones(),a=new Map(e.map(o=>[o._id,o]));return t.precision.analizarTodas(e).map(o=>{const n=a.get(o.estimacionId);return{analisis:o,estimacion:n,sugerencia:Ye(o,n.cuantia)}}).filter(o=>!!o.estimacion)}function On(t){const e=Je(t),a=e.filter(l=>l.analisis.precision!==null),o=e.filter(l=>l.sugerencia!==null),n=t.precision.analizarPorTag(e.map(l=>l.analisis));if(a.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const s=a.map(({analisis:l,estimacion:p,sugerencia:h})=>{const u=l.meses.slice(-6).map(d=>`${Ue(d.mes)}: ${j(d.estimado)} → ${j(d.real)} (${d.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${c(p.concepto)}</div>
          <div style="margin-top:3px">${uo(l.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${c(u)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(j(l.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(j(l.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Ft(l.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${co(l.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${h?`<button class="btn-secondary" data-sugerir="${c(l.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${c(h.motivo)}">Sugerir ajuste → ${c(j(h.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=n.map(l=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${c(l.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${l.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(j(l.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(j(l.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Ft(l.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${co(l.precision)}</td>
      </tr>`).join(""),r=(l,p="left")=>`<th style="padding:7px 8px;text-align:${p};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${l}</th>`;return`
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
            ${r("Estimación")}${r("Estimado","right")}${r("Real","right")}${r("Desviación","right")}${r("Precisión","right")}${r("","right")}
          </tr></thead>
          <tbody>${s}</tbody>
        </table>
      </div>
    </div>

    <div class="card mb-14">
      <div class="card-title">Precisión conjunta por etiqueta</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg3)">
            ${r("Etiqueta")}${r("Estimaciones","right")}${r("Estimado","right")}${r("Real","right")}${r("Desviación","right")}${r("Precisión","right")}
          </tr></thead>
          <tbody>${i||'<tr><td colspan="6" style="padding:14px;text-align:center;color:var(--text2);font-size:13px">Sin etiquetas comparables.</td></tr>'}</tbody>
        </table>
      </div>
    </div>`}function qn(t,e,a){R(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=Je(e).find(l=>l.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${j(i.cuantiaActual)}
Nueva estimación: ${j(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;Z(r)&&(e.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:e.hoy()}),q(`Estimación ajustada a ${j(i.cuantiaSugerida)}`),e.onDatosCambiados(),a())}),R(t,"#ajustar-todas",()=>{const o=Je(e).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${j(r.cuantiaActual)} → ${j(r.cuantiaSugerida)}`).join(`
`);if(!Z(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});q(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const Ln=[";",",","	","|"],Bn={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function ve(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ge(t,e){const a=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===e?(a.push(o.trim()),o=""):o+=i}return a.push(o.trim()),a}function kn(t){let e=";",a=-1;for(const o of Ln){const n=t.slice(0,20).map(l=>ge(l,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(l=>l===s).length*10+s;r>a&&(a=r,e=o)}return e}function ae(t){let e=(t??"").trim();if(!e)return null;let a=!1;if(/^\(.*\)$/.test(e)&&(a=!0,e=e.slice(1,-1).trim()),e.endsWith("-")&&(a=!0,e=e.slice(0,-1).trim()),e.startsWith("-")&&(a=!0,e=e.slice(1).trim()),e.startsWith("+")&&(e=e.slice(1).trim()),e=e.replace(/[€$£\s  ]/g,""),!e)return null;const o=e.lastIndexOf(","),n=e.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(e)&&e.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(e)&&e.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const h=s===","?o:n;i=e.slice(0,h).replace(/[.,]/g,""),r=e.slice(h+1).replace(/[.,]/g,"")}else i=e.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const l=(r+"00").slice(0,2),p=Number(i||"0")*100+Number(l);return Number.isFinite(p)?a?-p:p:null}function We(t){const e=(t??"").trim();if(!e)return null;let a=e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a)return mo(Number(a[1]),Number(a[2]),Number(a[3]));if(a=e.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),a){let o=Number(a[3]);return o<100&&(o+=o<70?2e3:1900),mo(o,Number(a[2]),Number(a[1]))}return null}function mo(t,e,a){if(e<1||e>12||a<1||a>31)return null;const o=new Date(t,e-1,a);return o.getFullYear()!==t||o.getMonth()!==e-1||o.getDate()!==a?null:`${t}-${String(e).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function fo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>We(a)!==null).length/e.length}function vo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>ae(a)!==null).length/e.length}function Hn(t,e){const a={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>e.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=ve(t[i]);if(r&&Bn[s].some(l=>r===l||r.startsWith(l)||r.includes(l))){if(s==="importe"&&ve(t[i]).includes("saldo"))continue;a[s]=i,o.add(i);break}}if(a.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=fo(n(r));l>i&&(i=l,s=r)}s>=0&&(a.fecha=s,o.add(s))}if(a.importe<0&&a.debe<0&&a.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||ve(t[r]).includes("saldo"))continue;const l=vo(n(r));l>i&&(i=l,s=r)}s>=0&&(a.importe=s,o.add(s))}if(a.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=n(r);if(vo(l)>.5||fo(l)>.5)continue;const p=l.reduce((h,u)=>h+u.length,0)/Math.max(1,l.length);p>i&&(i=p,s=r)}s>=0&&(a.concepto=s)}return a}function Gn(t){const e=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(h=>h.trim()!=="");if(e.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const a=kn(e),o=e.map(h=>ge(h,a).length),n=Math.max(...o);let s=o.findIndex(h=>h===n);s<0&&(s=0);const i=ge(e[s],a);let r=e.slice(s+1).map(h=>ge(h,a));const l=We(i[0]??"")!==null||i.some(h=>ae(h)!==null&&/\d/.test(h));l&&(r=[i,...r]);const p=Hn(l?i.map(()=>""):i,r.slice(0,40));return{separador:a,cabeceras:l?i.map((h,u)=>`Columna ${u+1}`):i,filas:r,lineaCabecera:s+1,mapeo:p}}function go(t,e,a){return`${t}|${e}|${ve(a).replace(/\s+/g," ")}`}function Vn(t,e,a=[]){const o=new Set(a.map(s=>go(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],l=e.fecha>=0?We(s[e.fecha]??""):null;e.fecha<0?r.push("sin columna de fecha"):l||r.push(`fecha ilegible: «${s[e.fecha]??""}»`);let p=null;if(e.importe>=0)p=ae(s[e.importe]??""),p===null&&r.push(`importe ilegible: «${s[e.importe]??""}»`);else if(e.debe>=0||e.haber>=0){const d=e.debe>=0?ae(s[e.debe]??""):null,v=e.haber>=0?ae(s[e.haber]??""):null;d===null&&v===null?r.push("sin importe en Debe ni en Haber"):d!==null&&d!==0?p=-Math.abs(d):v!==null&&v!==0?p=Math.abs(v):p=0}else r.push("sin columna de importe");p===0&&r.push("importe cero");const h=(e.concepto>=0?s[e.concepto]??"":"").trim()||"Movimiento importado";let u=!1;if(l&&p!==null){const d=go(l,p,h);u=o.has(d)||n.has(d),n.add(d)}return{linea:t.lineaCabecera+1+i,fecha:l,concepto:h,importeCts:p,errores:r,duplicada:u}})}function Un(t,e){const a=t.filter(n=>n.errores.length===0&&(e||!n.duplicada)),o=a.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:a.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:a.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function be(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const Yn=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function Qe(t,e){if(!e.analisis||!e.mapeo){e.filas=[];return}const a=t.ledger.transacciones(e.cuentaId?{cuentaId:e.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));e.filas=Vn(e.analisis,e.mapeo,a)}function Jn(t,e){const a=t.accounts().filter(n=>n.activo);if(!e.abierto)return`
      <div class="card">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <div>
            <div class="card-title" style="margin:0">Importar extracto</div>
            <div class="text-sm mt-4" style="color:var(--text3)">
              Sube el CSV que descargas del banco en vez de teclear los movimientos.
            </div>
          </div>
          <button class="btn-secondary btn-sm" data-imp-abrir>Importar CSV</button>
        </div>
      </div>`;const o=a.map(n=>`<option value="${c(n._id)}"${n._id===e.cuentaId?" selected":""}>${c(n.nombre)}</option>`).join("");return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Importar extracto</div>
        <button class="btn-secondary btn-sm" data-imp-cerrar>Cancelar</button>
      </div>

      ${e.error?`<div class="alert-card alert-danger mb-12"><div class="alert-body">${c(e.error)}</div></div>`:""}

      <div class="form-row mb-12">
        <div class="form-group" style="flex:1;min-width:190px">
          <label class="form-label" for="imp-cuenta">Cuenta de destino</label>
          <select class="form-select" id="imp-cuenta">
            <option value="">— elige una cuenta —</option>
            ${o}
          </select>
        </div>
        <div class="form-group" style="flex:1;min-width:190px">
          <label class="form-label" for="imp-fichero">Fichero CSV</label>
          <input class="form-input" type="file" id="imp-fichero" accept=".csv,.txt,text/csv" />
        </div>
      </div>

      ${e.analisis&&e.mapeo?Qn(e,e.analisis,e.mapeo):Wn()}
    </div>`}function Wn(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function Qn(t,e,a){const o=Un(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+e.cabeceras.map((l,p)=>`<option value="${p}"${p===r?" selected":""}>${c(l||`Columna ${p+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${c(t.nombreFichero)}</strong> · ${e.filas.length} línea${e.filas.length!==1?"s":""}
      · separador <code>${c(e.separador==="	"?"tabulador":e.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${Yn.map(r=>`<div class="form-group">
          <label class="form-label" for="imp-col-${r.clave}">${c(r.etiqueta)}</label>
          <select class="form-select" id="imp-col-${r.clave}" data-imp-col="${r.clave}">${n(a[r.clave])}</select>
        </div>`).join("")}
    </div>
    <div class="text-sm mb-12" style="color:var(--text3)">
      Usa <em>Importe</em> si tu banco da una sola columna con signo, o <em>Debe</em> y <em>Haber</em> si las separa.
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin-bottom:12px">
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Se importarán</div>
        <div class="stat-value" style="font-size:1.15rem">${o.importables}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Neto</div>
        <div class="stat-value" style="font-size:1.15rem">${Ft(et(o.sumaCts))}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Periodo</div>
        <div class="stat-value" style="font-size:0.95rem">${o.desde?`${c(o.desde)} → ${c(o.hasta??"")}`:"—"}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Repetidos</div>
        <div class="stat-value" style="font-size:1.15rem;color:${o.duplicadas>0?"var(--yellow)":"var(--text)"}">${o.duplicadas}</div>
      </div>
    </div>

    ${o.duplicadas>0?`<label class="flex items-center gap-8 mb-12" style="font-size:13px;cursor:pointer">
             <input type="checkbox" id="imp-duplicadas"${t.incluirDuplicadas?" checked":""} />
             Importar también los ${o.duplicadas} repetido${o.duplicadas!==1?"s":""}
             <span style="color:var(--text3);font-size:12px">(ya hay un movimiento igual en fecha, importe y concepto)</span>
           </label>`:""}

    ${s.length>0?`<div class="alert-card alert-warning mb-12">
             <div class="alert-icon">⚠️</div>
             <div class="alert-body">
               <div class="alert-title">${s.length} línea${s.length!==1?"s":""} no se puede${s.length!==1?"n":""} importar</div>
               <div class="alert-sub">${s.slice(0,4).map(r=>`línea ${r.linea}: ${c(r.errores[0])}`).join(" · ")}${s.length>4?" …":""}</div>
             </div>
           </div>`:""}

    <div class="card-title mb-8">Previsualización</div>
    <div class="table-wrap mb-12">
      <table style="min-width:420px">
        <thead><tr>
          <th style="cursor:default">Fecha</th>
          <th style="cursor:default">Concepto</th>
          <th style="cursor:default;text-align:right">Importe</th>
          <th style="cursor:default">Estado</th>
        </tr></thead>
        <tbody>
          ${i.map(r=>{const l=r.errores.length>0,p=l?r.errores[0]:r.duplicada?"repetido":"se importa",h=l?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${l?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${c(r.fecha??"—")}</td>
                <td style="font-size:12px">${c(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":c(j(et(r.importeCts)))}</td>
                <td style="font-size:11px;color:${h}">${c(p)}</td>
              </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    ${t.filas.length>i.length?`<div class="text-sm mb-12" style="color:var(--text3)">…y ${t.filas.length-i.length} más.</div>`:""}

    <div class="flex gap-8" style="justify-content:flex-end;flex-wrap:wrap">
      <button class="btn-secondary" data-imp-cerrar>Cancelar</button>
      <button class="btn-primary" data-imp-confirmar${o.importables===0||!t.cuentaId?" disabled":""}>
        Importar ${o.importables} movimiento${o.importables!==1?"s":""}
      </button>
    </div>
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function Kn(t,e,a,o){R(t,"[data-imp-abrir]",()=>{const s=e.accounts().filter(i=>i.activo);Object.assign(a,be(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),R(t,"[data-imp-cerrar]",()=>{Object.assign(a,be()),o()}),J(t,"#imp-cuenta",s=>{a.cuentaId=s.value,Qe(e,a),o()}),J(t,"#imp-duplicadas",s=>{a.incluirDuplicadas=s.checked,o()}),J(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;a.mapeo&&(a.mapeo[r]=Number(i.value),Qe(e,a),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&Xn(s).then(r=>{const l=Gn(r);a.nombreFichero=s.name,a.error=l.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",a.analisis=l,a.mapeo={...l.mapeo},Qe(e,a),o()}).catch(r=>{a.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),R(t,"[data-imp-confirmar]",()=>{if(!a.cuentaId)return;const s=a.filas.filter(i=>i.errores.length===0&&(a.incluirDuplicadas||!i.duplicada));if(s.length!==0){for(const i of s)e.ledger.registrar({fecha:i.fecha,cuentaId:a.cuentaId,importe:Math.abs(et(i.importeCts)),tipo:i.importeCts<0?"gasto":"ingreso",concepto:i.concepto,origen:"importado"});q(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""}`),Object.assign(a,be()),e.onDatosCambiados(),o()}})}function Xn(t){return t.arrayBuffer().then(e=>{const a=new TextDecoder("utf-8").decode(e);if(!a.includes("�"))return a;try{return new TextDecoder("iso-8859-1").decode(e)}catch{return a}})}function Zn(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function ti(t,e){const a=G(t),o=[];for(let n=1;n<=e;n++){const s=new Date(a.getFullYear(),a.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function ei(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function bo(t,e){const{inicio:a,fin:o}=ei(e);return Jt([t],{start:a,end:o}).reduce((s,i)=>s+Math.abs(i.cuantia),0)}function ai(t){function e(n,s={}){var I;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:l=Y()}=s,p=t.transacciones({estimacionId:n._id}),u=p.length===0&&(((I=n.tags)==null?void 0:I.length)??0)>0?t.transacciones({tags:n.tags}):p,d=new Map;for(const b of u){const x=b.fecha.slice(0,7);d.set(x,(d.get(x)??0)+Math.abs(b.importeCts)/100)}const v=[];for(const b of ti(l,i)){const x=d.get(b);if(x===void 0)continue;const S=W(bo(n,b));v.push({mes:b,estimado:S,real:W(x),desviacion:W(x-S),precision:Zn(S,x)})}const y=W(v.reduce((b,x)=>b+x.estimado,0)),$=W(v.reduce((b,x)=>b+x.real,0)),A=v.reduce((b,x)=>b+Math.abs(x.estimado),0),f=v.length===0?null:A>0?v.reduce((b,x)=>b+x.precision*Math.abs(x.estimado),0)/A:v.reduce((b,x)=>b+x.precision,0)/v.length,g=v.slice(-r),m=g.length>0?W(g.reduce((b,x)=>b+x.real,0)/g.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:v,estimadoTotal:y,realTotal:$,desviacionTotal:W($-y),precision:f,mediaRealReciente:m,infraestimada:$>y}}function a(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>e(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const l=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};l.estimado+=i.estimadoTotal,l.real+=i.realTotal,l.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),l.peso+=Math.abs(i.estimadoTotal),l.n+=1,s.set(r,l)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:W(r.estimado),realTotal:W(r.real),desviacionTotal:W(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}function oi(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function si(t){const[e,a]=t.slice(0,7).split("-").map(Number),o=new Date(e,a-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function ni(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function ii(t,e,a){const o=new Map(e.map(s=>[s._id,[]])),n=e.filter(s=>{var i;return!a(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const l of n){const p=(l.tags??[]).filter(h=>s.tags.includes(h)).length;p!==0&&(p>r||p===r&&i&&l._id<i._id)&&(i=l,r=p)}i&&o.get(i._id).push(s)}return o}function ri(t,e,a,o={}){const{desde:n,hasta:s}=oi(a),i=t.transacciones({desde:n,hasta:s}),r=i.filter(m=>m.importeCts<0),l=i.filter(m=>m.importeCts>0),p=e.filter(m=>m.tipo==="gasto"&&m.activo!==!1),h=new Map((o.analisis??[]).map(m=>[m.estimacionId,m])),u=new Set(p.filter(m=>t.transacciones({estimacionId:m._id}).length>0).map(m=>m._id)),d=ii(r,p,m=>u.has(m)),v=new Set,y=p.map(m=>{const I=d.get(m._id)??[];for(const w of I)v.add(w._id);const b=W(I.reduce((w,z)=>w+Math.abs(z.importeCts)/100,0)),x=W(bo(m,a)),S=h.get(m._id);return{estimacionId:m._id,concepto:m.concepto,tags:m.tags??[],estimado:x,real:b,desviacion:W(b-x),sinMovimiento:I.length===0,sugerencia:S?Ye(S,m.cuantia,{hoy:o.hoy}):null}}),$=new Map;for(const m of r){if(v.has(m._id))continue;const I=ni(m.concepto),b=$.get(I)??{concepto:m.concepto,total:0,movimientos:0};b.total=W(b.total+Math.abs(m.importeCts)/100),b.movimientos+=1,$.set(I,b)}const A=[...$.values()].sort((m,I)=>I.total-m.total),f=W(y.reduce((m,I)=>m+I.estimado,0)),g=W(r.reduce((m,I)=>m+Math.abs(I.importeCts)/100,0));return{mes:a,estimado:f,real:g,desviacion:W(g-f),ingresosReales:W(l.reduce((m,I)=>m+I.importeCts/100,0)),filas:y.sort((m,I)=>Math.abs(I.desviacion)-Math.abs(m.desviacion)),sinEstimacion:A,totalSinEstimacion:W(A.reduce((m,I)=>m+I.total,0)),vacio:i.length===0}}function ho(t){const e=new Set;for(const a of t.transacciones())e.add(a.fecha.slice(0,7));return[...e].sort().reverse()}function li(){return{mes:""}}function Ke(t,e){if(e.mes)return e.mes;const a=ho(t.ledger),o=si((t.hoy??Y)());return a.includes(o)?o:a[0]??o}function Xe(t,e){const a=(t.hoy??Y)(),o=t.estimaciones(),n=t.precision.analizarTodas(o,{hoy:a});return ri(t.ledger,o,e,{analisis:n,hoy:a})}function ci(t,e){const a=Ke(t,e),o=ho(t.ledger);o.includes(a)||o.unshift(a);const n=Xe(t,a),s=`
    <select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
      ${o.map(l=>`<option value="${c(l)}"${l===a?" selected":""}>${c(Ue(l))}</option>`).join("")}
    </select>`;if(n.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">Cierre de mes</div>
          ${s}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados en ${c(Ue(a))}. Importa el extracto del banco o
          registra los movimientos a mano y aquí verás en qué se desvió el mes respecto a lo que habías previsto.
        </div>
      </div>`;const i=l=>l>0?"+":"",r=n.desviacion>0?"var(--red)":n.desviacion<0?"var(--accent)":"var(--text2)";return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Cierre de mes</div>
        ${s}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:14px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Habías previsto</div>
          <div class="stat-value" style="font-size:1.15rem">${c(j(n.estimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Has gastado</div>
          <div class="stat-value" style="font-size:1.15rem">${c(j(n.real))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación</div>
          <div class="stat-value" style="font-size:1.15rem;color:${r}">${i(n.desviacion)}${c(j(n.desviacion))}</div>
          <div class="stat-sub">${n.desviacion>0?"de más":n.desviacion<0?"de menos":"clavado"}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${n.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${c(j(n.totalSinEstimacion))}</div>
          <div class="stat-sub">${n.sinEstimacion.length} concepto${n.sinEstimacion.length!==1?"s":""}</div>
        </div>
      </div>

      ${di(n)}
      ${ui(n)}
    </div>`}function di(t){const e=t.filas.filter(o=>o.estimado>0||o.real>0);if(e.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas para este mes.</div>';const a=e.filter(o=>o.sugerencia);return`
    <div class="card-title mb-8">Dónde te desviaste</div>
    <div class="table-wrap mb-12">
      <table style="min-width:460px">
        <thead><tr>
          <th style="cursor:default">Concepto</th>
          <th style="cursor:default;text-align:right">Previsto</th>
          <th style="cursor:default;text-align:right">Real</th>
          <th style="cursor:default;text-align:right">Desviación</th>
          <th style="cursor:default"></th>
        </tr></thead>
        <tbody>
          ${e.map(o=>{const n=o.desviacion>0?"var(--red)":o.desviacion<0?"var(--accent)":"var(--text2)",s=o.sugerencia;return`<tr>
                <td style="font-size:12px">
                  ${c(o.concepto)}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${c(j(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${c(j(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${n}">
                  ${o.desviacion>0?"+":""}${c(j(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${s?`<button class="btn-secondary btn-sm" data-cie-ajustar="${c(o.estimacionId)}"
                           title="Pasar la estimación de ${c(j(s.cuantiaActual))} a ${c(j(s.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${c(j(s.cuantiaSugerida))}</button>`:""}
                </td>
              </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    ${a.length>0?`<div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
             <div class="text-sm" style="color:var(--text2)">
               ${a.length} estimación${a.length!==1?"es":""} se desvía${a.length!==1?"n":""}
               de forma sistemática. Ajustarla cierra la estimación de hoy y abre una nueva con el importe corregido.
             </div>
             <button class="btn-primary btn-sm" data-cie-ajustar-todas>Ajustar todas</button>
           </div>`:""}`}function ui(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
      <div class="alert-icon">✓</div>
      <div class="alert-body">
        <div class="alert-title">Todo el gasto del mes estaba previsto</div>
        <div class="alert-sub">Ningún movimiento se queda fuera de tus estimaciones.</div>
      </div>
    </div>`:`
    <div class="card-title mb-8">Gasto que no tenías previsto</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Movimientos que no cuadran con ninguna estimación. Si alguno se repite mes a mes, merece una estimación propia.
    </div>
    <div class="table-wrap">
      <table style="min-width:320px">
        <thead><tr>
          <th style="cursor:default">Concepto</th>
          <th style="cursor:default;text-align:right">Movimientos</th>
          <th style="cursor:default;text-align:right">Total</th>
        </tr></thead>
        <tbody>
          ${t.sinEstimacion.slice(0,10).map(e=>`<tr>
                <td style="font-size:12px">${c(e.concepto)}</td>
                <td style="text-align:right;font-size:12px;color:var(--text3)">${e.movimientos}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--yellow)">${c(j(e.total))}</td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function pi(t,e,a,o){J(t,"#cie-mes",n=>{a.mes=n.value,o()}),R(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=Xe(e,Ke(e,a)).filas.find(l=>l.estimacionId===s);r!=null&&r.sugerencia&&(e.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(e.hoy??Y)()}),q(`«${r.concepto}» ajustada a ${j(r.sugerencia.cuantiaSugerida)}`),e.onDatosCambiados(),o())}),R(t,"[data-cie-ajustar-todas]",()=>{const s=Xe(e,Ke(e,a)).filas.map(l=>l.sugerencia).filter(l=>l!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=e.adjuster.aplicarTodas(s,{hoy:(e.hoy??Y)()});q(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),e.onDatosCambiados(),o()})}const mi="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function fi(t){const e={cuentaId:"",mes:(t.hoy??Y)().slice(0,7),filtroTexto:""},a=be(),o=li(),n=()=>{var u;return(u=t.onDatosCambiados)==null?void 0:u.call(t)},s=t.hoy??Y,i={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:n,hoy:s},r={ledger:t.ledger,accounts:t.accounts,onDatosCambiados:n},l={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:n,hoy:s},p={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:n,hoy:s};function h(u){const d=t.ledger.saldoTotal(s()),v=t.ledger.ultimaFecha(),y=t.ledger.transacciones().length;u.innerHTML=`
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
          <div class="stat-value" style="font-size:1.3rem">${c(j(d))}</div>
          <div style="font-size:11px;color:var(--text3)">suma de cuentas activas</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Movimientos registrados</div>
          <div class="stat-value" style="font-size:1.3rem">${y}</div>
          <div style="font-size:11px;color:var(--text3)">${v?`último: ${c(v)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-importar"></div>
      <div id="acc-cierre" data-feature="precision-estimaciones"></div>
      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const $=u.querySelector("#acc-importar"),A=u.querySelector("#acc-cierre"),f=u.querySelector("#acc-transacciones"),g=u.querySelector("#acc-precision");$.innerHTML=Jn(r,a),A.innerHTML=ci(l,o),f.innerHTML=Tn(i,e),g.innerHTML=On(p);const m=()=>h(u);Kn($,r,a,m),pi(A,l,o,m),Rn(f,i,e,m),qn(g,p,m)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:mi,mount:h}}const vi="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Ze(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function gi(t){const{store:e}=t,a=t.hoy??Y,o=()=>G(a()),n=()=>e.get("config").margenesSeguridad??[];function s(v){var y;e.patchConfig({margenesSeguridad:v}),(y=t.onDatosCambiados)==null||y.call(t)}function i(v,y){const $=n().map(f=>({...f,puntos:(f.puntos??[]).map(g=>({...g}))})),A=$.find(f=>f._id===v);A&&(y(A),s($))}function r(v){const y=e.get("config"),$=me(v,e.get("expenses"),y,e.get("loans"),a(),!1,o());return j($)}function l(v,y,$){const A=y.tipo==="fijo",f=A?"":`<span class="text-sm" style="color:var(--text3)">${c(j((y.meses??0)*$))}</span>`;return`
      <tr data-punto="${c(y._id)}" data-margen="${c(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${c(y.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${A?" selected":""}>Fijo €</option>
            <option value="meses"${A?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${A?`<input type="number" class="form-input" style="width:90px" value="${y.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${A?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${y.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${f}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function p(v,y,$){const A=v.cuentas&&v.cuentas.length>0?v.cuentas.map(I=>{var b;return((b=y.find(x=>x._id===I))==null?void 0:b.nombre)??I}).join(", "):"Todas las cuentas activas",g=[...v.puntos??[]].sort((I,b)=>I.fecha.localeCompare(b.fecha)).map(I=>l(v,I,$)).join(""),m=v.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${c(A)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${c(r(v))}</strong>
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
            ${g||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${c(v._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${c(v.nombre)}</span>
            <span class="badge ${v.activo?"badge-active":"badge-inactive"}">${v.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${v.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${v.activo?"checked":""} data-toggle-margen="${c(v._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${c(v._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${c(v._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${m}
      </div>`}function h(v,y){const $=y?n().find(m=>m._id===y):null,A=e.get("accounts").filter(m=>m.activo),f=new Set(($==null?void 0:$.cuentas)??[]),g=A.map(m=>`
        <label class="tag" data-chip="${c(m._id)}" style="cursor:pointer;${f.has(m._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${c(m._id)}" ${f.has(m._id)?"checked":""} style="display:none"/>
          ${c(m.nombre)}
        </label>`).join(" ");v.innerHTML=`
      <div class="modal-title">${y?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${c(($==null?void 0:$.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${g||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${$?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${c(Y())}"/></div>
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
        <button class="btn-primary" data-guardar-margen="${c(y??"")}">Guardar</button>
      </div>`}function u(v,y){const $=document.getElementById("modal-overlay"),A=document.getElementById("modal-content");!$||!A||(h(A,v),$.classList.remove("hidden"),J(A,".mg-acc-chip",f=>{const g=f,m=A.querySelector(`[data-chip="${g.value}"]`);m&&(m.style.cssText=`cursor:pointer;${g.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),J(A,"#mg-p-tipo",f=>{const g=f.value==="fijo",m=A.querySelector("#mg-p-importe-wrap"),I=A.querySelector("#mg-p-meses-wrap");m&&(m.style.display=g?"":"none"),I&&(I.style.display=g?"none":"")}),R(A,"[data-cerrar-form]",()=>$.classList.add("hidden")),R(A,"[data-guardar-margen]",f=>{var x,S,w,z,_;const g=f.getAttribute("data-guardar-margen")||"",m=((x=A.querySelector("#mg-nombre"))==null?void 0:x.value.trim())??"";if(!m)return q("El nombre es obligatorio","err");const I=[...A.querySelectorAll(".mg-acc-chip:checked")].map(D=>D.value),b=n().map(D=>({...D}));if(g){const D=b.findIndex(C=>C._id===g);if(D===-1)return q("Margen no encontrado","err");b[D]={...b[D],nombre:m,cuentas:I}}else{const D=((S=A.querySelector("#mg-p-tipo"))==null?void 0:S.value)??"fijo",C={_id:Ze(),fecha:((w=A.querySelector("#mg-p-fecha"))==null?void 0:w.value)||Y(),tipo:D,importe:parseFloat(((z=A.querySelector("#mg-p-importe"))==null?void 0:z.value)??"0")||0,meses:parseFloat(((_=A.querySelector("#mg-p-meses"))==null?void 0:_.value)??"1")||1};b.push({_id:Ze(),nombre:m,activo:!0,cuentas:I,puntos:[C]})}s(b),q(g?"Margen actualizado":"Margen creado"),$.classList.add("hidden"),y()}))}function d(v){const y=n(),$=e.get("accounts"),A=Qt(e.get("expenses"),o());v.innerHTML=`
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
      ${y.length===0?`<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`:y.map(g=>p(g,$,A)).join("")}`;const f=()=>d(v);R(v,"[data-nuevo-margen]",()=>u(null,f)),R(v,"[data-editar-margen]",g=>u(g.getAttribute("data-editar-margen"),f)),R(v,"[data-borrar-margen]",g=>{Z("¿Eliminar este margen de seguridad?")&&(s(n().filter(m=>m._id!==g.getAttribute("data-borrar-margen"))),q("Margen eliminado"),f())}),J(v,"[data-toggle-margen]",g=>{const m=g.getAttribute("data-toggle-margen");i(m,I=>{I.activo=g.checked}),f()}),R(v,"[data-add-punto]",g=>{const m=g.getAttribute("data-add-punto");i(m,I=>{I.puntos=[...I.puntos??[],{_id:Ze(),fecha:Y(),tipo:"fijo",importe:0,meses:1}]}),f()}),R(v,"[data-borrar-punto]",g=>{const m=g.closest("[data-punto]");if(!m)return;const I=m.dataset.margen,b=m.dataset.punto;i(I,x=>{x.puntos=(x.puntos??[]).filter(S=>S._id!==b)}),f()}),J(v,"[data-campo]",g=>{const m=g.closest("[data-punto]");if(!m)return;const I=g.getAttribute("data-campo"),b=g.value;i(m.dataset.margen,x=>{const S=(x.puntos??[]).find(w=>w._id===m.dataset.punto);S&&(I==="fecha"?S.fecha=b:I==="tipo"?S.tipo=b:I==="importe"?S.importe=parseFloat(b)||0:S.meses=parseFloat(b)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:vi,mount:d}}const bi="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function hi(t){const e=Array.isArray(t)?t[1]??[]:[];return Array.isArray(e)?e.filter(a=>a&&a.value!==null&&a.value!==void 0&&Number.isFinite(Number(a.value))).map(a=>({year:parseInt(a.date),tasa:parseFloat(Number(a.value).toFixed(2))})).filter(a=>Number.isFinite(a.year)).sort((a,o)=>a.year-o.year):[]}function yi({fetchImpl:t,url:e=bi}={}){let a=null,o=!1;async function n(s=!1){if(a&&!s)return a;if(o)return null;o=!0;try{const r=await(t??fetch)(e);if(!r.ok)throw new Error(`HTTP ${r.status}`);return a=hi(await r.json()),a}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:n,invalidar:()=>{a=null},get enCache(){return a}}}const xi="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function $i(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function Ii(t){const{store:e}=t,a=t.ipc??yi(),o=()=>e.get("inflacion")??[];function n(){var u;(u=t.onDatosCambiados)==null||u.call(t)}function s(u,d){if(!u||u.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const v=new Set(o().map(g=>g.year)),y=u.filter(g=>g.year>=d).reverse(),$=y.filter(g=>!v.has(g.year)).length,A=[...new Set(u.map(g=>g.year))].sort((g,m)=>g-m),f=y.map(g=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${g.year}" data-tasa="${g.tasa}" ${v.has(g.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${g.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${$i(g.tasa)}">${g.tasa.toFixed(2)}%</span>
          ${v.has(g.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${A.map(g=>`<option value="${g}"${g===d?" selected":""}>${g}</option>`).join("")}
        </select>
        <span style="font-size:10px;color:var(--text3)">
          Fuente: Banco Mundial · FP.CPI.TOTL.ZG · ${u[0].year}–${u[u.length-1].year}
        </span>
        <button class="btn-secondary btn-sm" data-ipc-recargar title="Forzar recarga desde la API">↺</button>
      </div>
      <div style="max-height:300px;overflow-y:auto;margin-bottom:12px">${f}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="font-size:12px;color:var(--text3)">${$} periodo${$!==1?"s":""} nuevo${$!==1?"s":""} disponible${$!==1?"s":""}</span>
        <div class="flex gap-8">
          <button class="btn-secondary" data-ipc-cerrar>Cancelar</button>
          <button class="btn-primary" data-ipc-importar ${$===0?"disabled":""}>↓ Importar seleccionados</button>
        </div>
      </div>`}function i(u){return!u||u.length===0?2e3:Math.max(u[0].year,new Date().getFullYear()-25)}async function r(u){const d=document.getElementById("modal-overlay"),v=document.getElementById("modal-content");if(!d||!v)return;v.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,d.classList.remove("hidden");const y=(A,f)=>{const g=document.getElementById("ipc-body");g&&(g.innerHTML=s(A,f))},$=await a.obtener();y($,i($)),R(v,"[data-ipc-cerrar]",()=>d.classList.add("hidden")),J(v,"#ipc-desde",A=>{y(a.enCache,parseInt(A.value))}),R(v,"[data-ipc-recargar]",()=>{a.invalidar();const A=document.getElementById("ipc-body");A&&(A.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),a.obtener(!0).then(f=>y(f,i(f)))}),R(v,"[data-ipc-importar]",()=>{const A=[...v.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(A.length===0)return q("Nada seleccionado","err");const f=new Set(o().map(m=>m.year));let g=0;for(const m of A){const I=parseInt(m.dataset.year??""),b=parseFloat(m.dataset.tasa??"");!Number.isFinite(I)||!Number.isFinite(b)||f.has(I)||(e.addItem("inflacion",{year:I,tasa:b}),f.add(I),g++)}d.classList.add("hidden"),q(`${g} periodo${g!==1?"s":""} importado${g!==1?"s":""} correctamente`),n(),u()})}function l(u,d){var f;const v=document.getElementById("modal-overlay"),y=document.getElementById("modal-content");if(!v||!y)return;const $=u?o().find(g=>g._id===u):null;y.innerHTML=`
      <div class="modal-title">${u?"Editar periodo de inflación":"Nuevo periodo de inflación"}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Año</label>
          <input class="form-input" type="number" id="inf-year" value="${($==null?void 0:$.year)??new Date().getFullYear()}" placeholder="2026"/></div>
        <div class="form-group"><label class="form-label">Tasa anual (%)</label>
          <input class="form-input" type="number" id="inf-tasa" step="0.01" value="${($==null?void 0:$.tasa)??""}" placeholder="3.5"/></div>
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-inf-cerrar>Cancelar</button>
        <button class="btn-primary" data-inf-guardar="${c(u??"")}">Guardar</button>
      </div>`,v.classList.remove("hidden");const A=()=>{var x;const g=parseFloat(((x=y.querySelector("#inf-tasa"))==null?void 0:x.value)??""),m=y.querySelector("#inf-preview");if(!m)return;if(!Number.isFinite(g)||g<=0){m.innerHTML="";return}const I=(Math.pow(1+g/100,1/12)-1)*100,b=Math.pow(1+g/100,5);m.innerHTML=`Con un ${g}% anual: <strong>${I.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${b.toFixed(3)}</strong> (+${((b-1)*100).toFixed(1)}%)`};(f=y.querySelector("#inf-tasa"))==null||f.addEventListener("input",A),A(),R(y,"[data-inf-cerrar]",()=>v.classList.add("hidden")),R(y,"[data-inf-guardar]",g=>{const m=g.getAttribute("data-inf-guardar")||"",I=parseInt(y.querySelector("#inf-year").value),b=parseFloat(y.querySelector("#inf-tasa").value);if(!Number.isFinite(I)||I<1900||I>2200)return q("Año inválido","err");if(!Number.isFinite(b)||b<0||b>100)return q("Tasa inválida (0–100%)","err");if(o().filter(S=>S._id!==m).some(S=>S.year===I))return q("Ya existe un periodo para ese año","err");m?(e.updateItem("inflacion",m,{year:I,tasa:b}),q("Periodo actualizado")):(e.addItem("inflacion",{year:I,tasa:b}),q("Periodo añadido")),v.classList.add("hidden"),n(),d()})}function p(u,d){const v=(Math.pow(1+u.tasa/100,.08333333333333333)-1)*100,y=`${u.year}-12-31`,$=y>d?pt([u],d,y):null;return`
      <div class="exp-table-row" data-periodo="${c(u._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${u.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${u.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${v.toFixed(3)}%/mes</div>
        <div class="num">${$!==null?`×${$.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${c(u._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${c(u._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function h(u){const d=o(),v=e.get("config").usarInflacion||!1,y=[...d].sort((x,S)=>S.year-x.year),$=Y(),A=new Date().getFullYear(),f=V(new Date(A+5,0,1)),g=V(new Date(A+10,0,1)),m=v&&d.length>0?pt(d,$,f):null,I=v&&d.length>0?pt(d,$,g):null;u.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${!v&&d.length===0?`<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
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
            <input type="checkbox" data-toggle-inflacion ${v?"checked":""}/>
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${m!==null&&I!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${m.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((m-1)*100).toFixed(1)}%)</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +10 años</div>
            <div class="stat-value neg">×${I.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((I-1)*100).toFixed(1)}%)</span></div>
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
        ${y.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':y.map(x=>p(x,$)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const b=()=>h(u);J(u,"[data-toggle-inflacion]",x=>{const S=x.checked;e.patchConfig({usarInflacion:S}),q(S?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),n(),b()}),R(u,"[data-nuevo-periodo]",()=>l(null,b)),R(u,"[data-editar-periodo]",x=>l(x.getAttribute("data-editar-periodo"),b)),R(u,"[data-importar-ipc]",()=>void r(b)),R(u,"[data-borrar-periodo]",x=>{Z("¿Eliminar este periodo de inflación?")&&(e.removeItem("inflacion",x.getAttribute("data-borrar-periodo")),q("Periodo eliminado"),n(),b())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:xi,mount:h}}const Ai=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],Mi=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Si=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function wi(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const ta=(t,e)=>t.map(([a,o])=>`<option value="${c(a)}"${a===e?" selected":""}>${c(o)}</option>`).join("");function yo(t,e="dp"){const{modo:a,dia:o,nth:n,wd:s}=wi(t),i=ta(Ai.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${c(e)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${ta(Mi,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${ta(Si,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function xo(t){var o,n,s;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=e.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",a==="dia"?"":"none"),(s=e.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",a==="nthweekday"?"":"none")}function $o(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=n=>{var s;return((s=e.querySelector(n))==null?void 0:s.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const Ci="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",ji=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Ei(t){const e=t.hoy??Y,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},n=()=>t.store.get("accounts"),s=f=>{var g;return((g=n().find(m=>m._id===(f||"default")))==null?void 0:g.nombre)??(f||"default")};function i(){const f=e();let g=[...t.store.get("expenses")];if(a.mostrarExpirados||(g=g.filter(m=>!m.fechaFin||m.fechaFin>=f)),a.tipo&&(g=g.filter(m=>m.tipo===a.tipo)),a.cuenta&&(g=g.filter(m=>(m.cuenta||"default")===a.cuenta)),a.desde&&(g=g.filter(m=>(m.fechaInicio??"")>=a.desde)),a.hasta&&(g=g.filter(m=>(m.fechaInicio??"")<=a.hasta)),a.busqueda){const m=a.busqueda.toLowerCase();g=g.filter(I=>I.concepto.toLowerCase().includes(m))}return a.tags.size>0&&(g=g.filter(m=>(m.tags||[]).some(I=>a.tags.has(I)))),g.sort((m,I)=>{const b=m[a.orden]??"",x=I[a.orden]??"";return typeof b=="number"&&typeof x=="number"?(b-x)*a.sentido:String(b).localeCompare(String(x))*a.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function l(f,g){const m=a.orden===f?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${c(g)} <span class="sort-arrow">${m}</span></span>`}function p(f,g=!1){return(g?'<option value="">Todas las cuentas</option>':"")+n().filter(I=>I.activo!==!1).map(I=>`<option value="${c(I._id)}"${I._id===f?" selected":""}>${c(I.nombre)}</option>`).join("")}function h(f){const g=f.tipo==="transferencia",m=Se(f.diaPago??""),I=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${m?` · ${m}`:""}`,b=!!f.fechaFin&&f.fechaFin<e(),x=g?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',S=g?`${c(s(f.cuenta))} → ${c(s(f.cuentaDestino))}`:c(s(f.cuenta)),w=(f.tags||[]).map(z=>`<span class="tag${a.tags.has(z)?" active":""}" data-tag="${c(z)}" title="Filtrar por ${c(z)}">${c(z)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(f.concepto)}</div>
        <div class="tag-list mt-4">${w}</div>
      </div>
      <div>${x}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":g?"":"neg"}">${g?"⇄ ":""}${c(j(f.cuantia))}</div>
      <div class="text-sm">${c(I)}</div>
      <div class="text-sm exp-col-hide">${S}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${c(f._id)}"${f.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${f.tipo==="gasto"&&f.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${f.tipo==="gasto"&&f.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${f.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${f.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${c(f.ajustadaEn??"")}">ajustada</span>`:""}
        ${b?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${c(f._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${c(f._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${c(f._id)}">✕</button>
      </div>
    </div>`}function u(f){const g=i(),m=r();f.innerHTML=`
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
        <select class="form-select" data-f-cuenta>${p(a.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${c(a.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${c(a.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${m.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${m.map(I=>`<span class="tag${a.tags.has(I)?" active":""}" data-tag="${c(I)}">${c(I)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${l("concepto","Concepto")} ${l("tipo","Tipo")} ${l("cuantia","Cuantía")} ${l("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${g.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':g.map(h).join("")}
      </div>`}function d(f){const g=(f==null?void 0:f.tipo)==="transferencia",m=t.store.get("escenarios"),I=(f==null?void 0:f.escenarioIds)||[],b=(x,S,w,z,_="")=>`<div class="form-group"><label class="form-label">${c(S)}</label>
       <input class="form-input" type="${w}" id="${x}" value="${c(z)}" placeholder="${c(_)}"/></div>`;return`
      <div class="grid-2">
        ${b("ef-concepto","Concepto","text",(f==null?void 0:f.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(f==null?void 0:f.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${g?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${b("ef-cuantia","Cuantía (€)","number",(f==null?void 0:f.cuantia)??"","500")}
        ${b("ef-frecuencia","Frecuencia","number",(f==null?void 0:f.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${ji.map(([x,S])=>`<option value="${x}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===x?" selected":""}>${c(S)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${b("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??e())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${p((f==null?void 0:f.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${g?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${p((f==null?void 0:f.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(f==null?void 0:f.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${f!=null&&f._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${b("ef-fecha-fin","Fecha fin (opcional)","date",(f==null?void 0:f.fechaFin)??"")}</div>
          <div class="mt-8">${yo(f==null?void 0:f.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${g?' style="display:none"':""}>
            <div class="mt-8" id="ef-clasificacion-wrap"${(f==null?void 0:f.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${((f==null?void 0:f.clasificacion)??"necesidad")==="necesidad"?" selected":""}>Necesidad</option>
                  <option value="deseo"${(f==null?void 0:f.clasificacion)==="deseo"?" selected":""}>Deseo</option>
                  <option value=""${(f==null?void 0:f.clasificacion)===null?" selected":""}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label>
              <input class="form-input" type="text" id="ef-tags" value="${c(((f==null?void 0:f.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
            <div class="form-row mt-8">
              <label class="form-label">Gasto básico</label>
              <label class="toggle"><input type="checkbox" id="ef-basico"${f!=null&&f.basico?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Incluir en el cálculo del colchón económico</span>
            </div>
            <div class="form-row mt-8" id="ef-irpf-wrap"${(f==null?void 0:f.tipo)==="ingreso"?"":' style="display:none"'}>
              <label class="form-label">Sujeto a retención IRPF</label>
              <label class="toggle"><input type="checkbox" id="ef-sujetoIRPF"${f!=null&&f.sujetoIRPF?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Calcula y proyecta la retención mensual</span>
            </div>
          </div>
          ${m.length>0?`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${m.map(x=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${I.includes(x._id)?c(x.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${c(x._id)}"${I.includes(x._id)?" checked":""}/>
                          ${c(x.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${c((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function v(f){var I;const g=((I=f.querySelector("#ef-tipo"))==null?void 0:I.value)??"gasto",m=(b,x)=>{const S=f.querySelector(b);S&&(S.style.display=x?"":"none")};m("#ef-destino-wrap",g==="transferencia"),m("#ef-basico-wrap",g!=="transferencia"),m("#ef-irpf-wrap",g==="ingreso"),m("#ef-clasificacion-wrap",g==="gasto")}function y(f,g,m){const I=document.getElementById("modal-overlay"),b=document.getElementById("modal-content");!I||!b||(b.innerHTML=`<div class="modal-title">${c(g)}</div>${d(f)}`,I.classList.remove("hidden"),J(b,"#ef-tipo",()=>v(b)),J(b,"[data-dp-modo]",()=>xo(b)),R(b,"[data-cancelar]",()=>I.classList.add("hidden")),R(b,"[data-guardar]",x=>{$(b,x.getAttribute("data-guardar")||"")&&(I.classList.add("hidden"),m())}))}function $(f,g){const m=D=>{var C;return((C=f.querySelector(D))==null?void 0:C.value)??""},I=D=>{var C;return!!((C=f.querySelector(D))!=null&&C.checked)},b=m("#ef-tipo")||"gasto",x=b==="transferencia",S=m("#ef-concepto").trim(),w=parseFloat(m("#ef-cuantia"));if(!S||!Number.isFinite(w))return q("Concepto y cuantía obligatorios","err"),!1;const z=m("#ef-clasificacion"),_={concepto:S,tipo:b,cuantia:w,frecuencia:parseInt(m("#ef-frecuencia"),10)||1,tipoFrecuencia:m("#ef-tipo-frec")||"mensual",fechaInicio:m("#ef-fecha-ini"),fechaFin:m("#ef-fecha-fin")||null,diaPago:$o(f),cuenta:m("#ef-cuenta"),cuentaDestino:x?m("#ef-cuenta-dest")||"default":void 0,activo:I("#ef-activo"),basico:!x&&I("#ef-basico"),sujetoIRPF:!x&&I("#ef-sujetoIRPF"),clasificacion:b==="gasto"?z||null:void 0,tags:x?["transferencia"]:m("#ef-tags").split(",").map(D=>D.trim()).filter(Boolean),escenarioIds:[...f.querySelectorAll(".ef-escenario:checked")].map(D=>D.value)};return g?(t.store.updateItem("expenses",g,_),q("Actualizado")):(t.store.addItem("expenses",_),q("Creado")),o(),!0}function A(f,g){const m=f.querySelector("[data-busqueda]");let I;m==null||m.addEventListener("input",()=>{clearTimeout(I),I=setTimeout(()=>{a.busqueda=m.value,g();const b=f.querySelector("[data-busqueda]");b==null||b.focus(),b==null||b.setSelectionRange(b.value.length,b.value.length)},250)}),J(f,"[data-expirados]",b=>{a.mostrarExpirados=b.checked,g()}),J(f,"[data-f-tipo]",b=>{a.tipo=b.value,g()}),J(f,"[data-f-cuenta]",b=>{a.cuenta=b.value,g()}),J(f,"[data-f-desde]",b=>{a.desde=b.value,g()}),J(f,"[data-f-hasta]",b=>{a.hasta=b.value,g()}),R(f,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,g()}),R(f,"[data-limpiar-tags]",()=>{a.tags=new Set,g()}),R(f,"[data-tag]",b=>{const x=b.getAttribute("data-tag");a.tags.has(x)?a.tags.delete(x):a.tags.add(x),g()}),R(f,"[data-orden]",b=>{const x=b.getAttribute("data-orden");a.orden===x?a.sentido=a.sentido===1?-1:1:(a.orden=x,a.sentido=1),g()}),R(f,"[data-nuevo]",()=>y(null,"Nuevo gasto/ingreso",g)),R(f,"[data-editar]",b=>{const x=t.store.get("expenses").find(S=>S._id===b.getAttribute("data-editar"));x&&y(x,"Editar",g)}),R(f,"[data-duplicar]",b=>{const x=t.store.get("expenses").find(z=>z._id===b.getAttribute("data-duplicar"));if(!x)return;const{_id:S,...w}=x;y({...w,concepto:`${x.concepto} (copia)`},"Duplicar movimiento",g)}),R(f,"[data-borrar]",b=>{Z("¿Eliminar?")&&(t.store.removeItem("expenses",b.getAttribute("data-borrar")),q("Eliminado"),o(),g())}),J(f,"[data-activo]",b=>{const x=b;t.store.updateItem("expenses",x.getAttribute("data-activo"),{activo:x.checked}),o(),g()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:Ci,mount(f){const g=()=>u(f);u(f),f.dataset.wired!=="1"&&(A(f,g),f.dataset.wired="1")}}}function he(t,e,a){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=pt(e,a,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function Io(t,e,a,o){return t.reduce((n,s)=>{const i=pt(e,a,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function zi(t,e,a){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=at({...t,amortizaciones:o.slice(0,s)}),r=at({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:he(i.tabla,e,a)-he(r.tabla,e,a)}})}const ea=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${c(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function Fi(t,e){const a=va(t),o=(t.amortizaciones||[]).length>0,n=e.periodos.length>0,s=e.usarInflacion&&n,i=n?ga(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,r=n?ba(t.tin||0,i):null,l=o&&n?zi(t,e.periodos,e.hoy):[],p=l.length?he(a.sinAmort.tabla,e.periodos,e.hoy)-he(a.tabla,e.periodos,e.hoy):null,h=p===null?null:p-a.costeTotalAmort,u=s?Io(a.tabla,e.periodos,e.hoy,a.comAp):null,d=s&&o?Io(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${c(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${c(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(t.tags||[]).map(v=>`<span class="tag">${c(v)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${c(t.tin)}%</span>
        <span class="text-sm">${c(j(t.capital))}</span>
        <span class="text-sm">${c(t.meses)}m</span>
        <button class="btn-icon" data-amort-loan="${c(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${c(t._id)}">

      <div class="grid-4 mb-12">
        ${ea("Cuota mensual",c(j(a.cuota)),e.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${c(j(e.cuotaMes))}</div>`:"")}
        ${ea("Total intereses",c(j(a.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(j(a.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${c(a.fechaFin||"—")}</div>
          ${o&&a.fechaFin!==a.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(a.sinAmort.fechaFin||"—")}${a.ahorroTiempo>0?` (−${a.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${ea("Total pagado",c(j(a.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${c(j(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${c(ua(a.tae))}</div></div>
          <div><div class="stat-label">TIN</div><div class="stat-value">${c(t.tin)}%</div></div>
          ${r!==null?`<div title="Tipo de interés real (Fisher): TIN ajustado por la inflación media del ${i.toFixed(2)}% anual durante el préstamo">
                   <div class="stat-label">TIN real</div>
                   <div class="stat-value" style="color:${r<=0?"var(--accent)":r<t.tin?"var(--yellow)":"var(--text)"}">${r.toFixed(2)}%
                     <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${i.toFixed(1)}%)</span>
                   </div>
                 </div>`:""}
          <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${c(t.meses)} meses</div></div>
        </div>
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">Capital</div><div class="stat-value">${c(j(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${c(j(a.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${c(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${c(Se(t.diaPago))}</div></div>`:""}
        </div>
      </div>

      ${o?"":`<div class="loan-optim-cta">
               <div class="loan-optim-cta-text">
                 <strong>¿Quieres pagar menos intereses?</strong>
                 Simula amortizaciones anticipadas y descubre cuánto puedes ahorrar.
               </div>
               <button class="btn-primary btn-sm" data-amort-loan="${c(t._id)}">+ Amortizar</button>
               <button class="btn-secondary btn-sm" data-optimizar data-feature="optimizador">✨ Optimizar</button>
             </div>`}

      ${o?`<div class="card" style="background:var(--bg3);padding:12px;margin-bottom:12px">
               <div class="card-title" style="margin-bottom:8px;color:var(--accent)">💰 Ahorro por amortizaciones</div>
               ${p!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${c(j(a.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${c(j(p))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${c(j(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${c(j(a.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(h??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${c(j(h??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${c(j(a.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${c(j(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${c(j(a.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${u!==null?_i(t,a.totalPagado,u,d):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(v=>Pi(v,s,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,y)=>Di(t._id,v,l[y]??null,e)).join("")}`:""}
    </div>
  </div>`}function _i(t,e,a,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-a,l=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${c(j(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${c(j(a))}</div></div>
        <div><div class="stat-label">${l?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${l?"pos":"neg"}">${l?"−":"+"}${c(j(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=e-a,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${c(j(e))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${c(j(a))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${c(j(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function Pi(t,e,a){let o="";if(e&&!t.esAmortizacion){const n=pt(a.periodos,a.hoy,t.fecha);o=c(j(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":c(t.mes)}</td>
    <td class="num">${c(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":c(j(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${c(j(t.interes))}</td>
    <td class="num">${c(j(t.amortizacion))}</td>
    <td class="num">${c(j(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Di(t,e,a,o){const n=(e.escenarioIds||[]).map(s=>`<span class="badge badge-yellow">🔭 ${c(o.nombreEscenario(s))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${c(e.fecha)}</span>
    <span class="num">${c(j(e.cantidad))}</span>
    <span class="badge ${e.simulacion?"badge-sim":"badge-active"}">${e.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${e.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${n}
    ${a?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${c(j(a.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${c(j(a.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${c(t)}|${c(e._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${c(t)}|${c(e._id)}">✕</button>
  </div>`}const tt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(n)}"/></div>`,Lt=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${c(n)}"${n===o?" selected":""}>${c(s)}</option>`).join("")}
   </select></div>`,oe=(t,e,a,o="")=>`<label class="form-label">${c(e)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${a?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${c(o)}</span>`:""}`;function se(t,e,a){return t.length===0?"":`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${t.map(o=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${e.includes(o._id)?c(o.color||"var(--accent)"):"var(--border)"}">
            <input type="checkbox" class="${c(a)}" value="${c(o._id)}"${e.includes(o._id)?" checked":""}/>
            ${c(o.nombre)}
          </label>`).join("")}
    </div></div>`}const Ti=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function Ri(t,e,a,o=Y()){return`
    <div class="grid-2">
      ${tt("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${tt("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${tt("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${tt("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${tt("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??o)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${Ti(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${yo(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Lt("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${tt("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${tt("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${c(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${oe("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${se(a,(t==null?void 0:t.escenarioIds)??[],"loan-escenario")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${oe("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${oe("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${oe("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Ni(t,e,a,o=Y()){return`
    <div class="grid-2">
      ${tt("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??o)}
      ${tt("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Lt("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(e==null?void 0:e.tipo)??"cuota")}
    </div>
    ${se(a,(e==null?void 0:e.escenarioIds)??[],"amort-escenario")}
    <div class="form-row mt-8">
      ${oe("am-sim","Simulación",!!(e!=null&&e.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${c(t)}|${c((e==null?void 0:e._id)??"")}">${e?"Guardar cambios":"Añadir"}</button>
    </div>`}const Ao="opt_",Mo=t=>String(t).startsWith(Ao);function Oi(t){let e=null,a=null;const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content");function s(m,I){const b=o(),x=n();return!b||!x?null:(x.innerHTML=`<div class="modal-title">${c(m)}</div>${I}`,b.classList.remove("hidden"),x)}const i=()=>{var m;return(m=o())==null?void 0:m.classList.add("hidden")};function r(){let m=!1;for(const I of t.loans()){const b=(I.amortizaciones||[]).filter(x=>!Mo(x._id));b.length!==(I.amortizaciones||[]).length&&(t.guardarAmortizaciones(I._id,b),m=!0)}return m}function l(m){try{return m()}catch(I){return q(I instanceof Error?I.message:"No se ha podido completar el cálculo","err"),null}}function p(){var z,_;if(!Ha("optimizador")){q("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const m=t.loans().filter(D=>D.activo&&!D.simulacion);if(m.length===0){q("No hay préstamos activos para optimizar","err");return}const I=t.config(),b=t.accounts().filter(D=>D.activo&&!D.simulacion),x=((z=b.find(D=>D.esCuentaPrincipal))==null?void 0:z._id)??((_=b[0])==null?void 0:_._id)??"",S=I.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,w=s("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${b.map(D=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${c(D._id)}"${D._id===x?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(D.nombre)}${D._id===x?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${c(j(rt(D)))}</span>
              </label>`).join("")||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${m.map(D=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
              <input type="checkbox" class="opt-loan-check" value="${c(D._id)}"${D.tin>=5?" checked":""} style="accent-color:var(--accent)"/>
              <span style="font-size:13px;flex:1">${c(D.nombre)}</span>
              <span class="badge badge-yellow" style="font-size:11px">${c(D.tin)}% TIN</span>
            </label>`).join("")}
      </div>
      <button class="btn-secondary btn-sm mb-12" data-opt-todos>Seleccionar todo</button>

      <div class="grid-2" style="gap:10px">
        ${tt("opt-horizonte","Horizonte (meses)","number",60,"60")}
        ${tt("opt-frecuencia","Frecuencia manual (cada N meses)","number",1,"1")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${tt("opt-min","Importe mínimo por amortización (€)","number",500,"500")}
        ${Lt("opt-tipo","Efecto de la amortización",[["plazo","Reducir plazo (mantener cuota)"],["cuota","Reducir cuota (mantener plazo)"]],"plazo")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${tt("opt-fecha-primera","Fecha primera amortización","date","")}
        ${tt("opt-fecha-obj","Fecha objetivo para comparar saldo","date",S)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);w&&(h(w),J(w,".opt-acc-radio",()=>h(w)),R(w,"[data-opt-todos]",()=>{const D=[...w.querySelectorAll(".opt-loan-check")],C=D.every(M=>M.checked);D.forEach(M=>M.checked=!C)}),R(w,"[data-cancelar]",i),R(w,"[data-opt-calcular]",()=>y(w)),R(w,"[data-opt-comparar]",()=>$(w)))}function h(m){var w;const I=(w=m.querySelector(".opt-acc-radio:checked"))==null?void 0:w.value,x=(t.config().margenesSeguridad||[]).filter(z=>z.activo!==!1).filter(z=>!z.cuentas||z.cuentas.length===0||I&&z.cuentas.includes(I)),S=m.querySelector("#opt-margenes-wrap");S&&(S.innerHTML=x.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':x.map(z=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${c(z._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(z.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!z.cuentas||z.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function u(m){var S,w,z,_;const I=(D,C,M=0)=>{var F;const E=parseFloat(((F=m.querySelector(D))==null?void 0:F.value)??"");return Number.isFinite(E)?Math.max(M,E):C},b=[...m.querySelectorAll(".opt-loan-check")],x=b.filter(D=>D.checked).map(D=>D.value);return{horizonte:Math.round(I("#opt-horizonte",60,1)),frecuencia:Math.round(I("#opt-frecuencia",1,1)),minAmortizable:I("#opt-min",500),tipoAmort:((S=m.querySelector("#opt-tipo"))==null?void 0:S.value)||"plazo",fechaObjetivo:((w=m.querySelector("#opt-fecha-obj"))==null?void 0:w.value)||null,fechaPrimeraAmort:((z=m.querySelector("#opt-fecha-primera"))==null?void 0:z.value)||null,loanIds:b.length===0||x.length===b.length?null:x,sourceAccountId:((_=m.querySelector(".opt-acc-radio:checked"))==null?void 0:_.value)??null,selectedMarginIds:[...m.querySelectorAll(".opt-margin-check:checked")].map(D=>D.value)}}const d=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function v(m,I=""){const b=s("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${c(m)}</div>
        ${I?`<div class="text-sm mt-8" style="color:var(--text3)">${c(I)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);b&&(R(b,"[data-opt-volver]",p),R(b,"[data-cancelar]",i))}function y(m){const I=u(m);r()&&q("Plan anterior eliminado, recalculando…");const{loans:b,expenses:x,accounts:S,config:w,nominas:z}=d(),_=l(()=>Oe(b,x,S,w,{frecuencia:I.frecuencia,mesesHorizonte:I.horizonte,minAmortizable:I.minAmortizable,tipoAmort:I.tipoAmort,fechaPrimeraAmort:I.fechaPrimeraAmort,loanIds:I.loanIds,nominas:z,sourceAccountId:I.sourceAccountId,selectedMarginIds:I.selectedMarginIds}));if(!_)return;if(_.plan.length===0){v(`No hay excedente suficiente respetando los ${_.margenesAplicados} márgenes de seguridad activos en los próximos ${I.horizonte} meses para generar amortizaciones por encima del mínimo de ${j(I.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}a={plan:_.plan,tipoAmort:I.tipoAmort};const D=`✨ Plan de optimización · ${I.frecuencia===1?"Mensual":`Cada ${I.frecuencia} meses`} · ${I.horizonte}m`,C=s(D,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(j(_.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${c(j(_.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${c(j(_.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${_.margenesAplicados}</div></div>
      </div>
      ${_.resumenPorLoan.map(wo).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${_.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${_.plan.map(M=>So(M,!0)).join("")}</tbody>
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
      </div>`);C&&(R(C,"[data-opt-volver]",p),R(C,"[data-cancelar]",i),R(C,"[data-opt-aplicar]",()=>{a&&f(a.plan,a.tipoAmort)}))}function $(m){const I=u(m);r();const{loans:b,expenses:x,accounts:S,config:w,nominas:z}=d(),_=l(()=>Ua(b,x,S,w,{horizonte:I.horizonte,minAmortizable:I.minAmortizable,tipoAmort:I.tipoAmort,fechaObjetivo:I.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:I.fechaPrimeraAmort,loanIds:I.loanIds,nominas:z,sourceAccountId:I.sourceAccountId,selectedMarginIds:I.selectedMarginIds}));if(!_)return;if(_.resultados.length===0){v("No hay excedente suficiente en ninguna frecuencia.");return}e=_;const{resultados:D,saldoBase:C,fechaObjetivo:M}=_,E=D.map(T=>{const N=[T.esMejorIntereses&&"💰 +intereses",T.esMejorSaldo&&"🏦 +saldo",T.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${T.esMejorValor?"background:rgba(46,230,168,0.06);":""}">
          <td style="font-weight:600">${c(T.label)}</td>
          <td class="num">${T.numAmortizaciones}</td>
          <td class="num neg">${c(j(T.totalAmortizado))}</td>
          <td class="num pos">${c(j(T.ahorroIntereses))}</td>
          <td class="num ${T.saldoObjetivo>=C?"pos":"neg"}">${c(j(T.saldoObjetivo))}</td>
          <td class="num pos">${c(j(T.valorTotal))}</td>
          <td style="font-size:11px">${N}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${T.frecuencia}">Usar</button></td>
        </tr>`}).join(""),F=s(`📊 Comparativa de frecuencias · hasta ${M}`,`
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${c(M)}: <strong>${c(j(C))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${c(M.slice(0,7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${E}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);F&&(R(F,"[data-opt-volver]",p),R(F,"[data-cancelar]",i),R(F,"[data-opt-usar]",T=>A(Number(T.getAttribute("data-opt-usar")))))}function A(m){var b;const I=e==null?void 0:e.resultados.find(x=>x.frecuencia===m);I&&(r(),f(I.plan,((b=I.plan[0])==null?void 0:b.tipoAmort)||"plazo",{titulo:`✨ Plan ${I.label} · aplicado`,resumen:I,fechaObjetivo:e==null?void 0:e.fechaObjetivo}))}function f(m,I,b){if(m.length===0)return;const x=new Map;for(const w of m){const z=x.get(w.loanId)??[];z.push({_id:`${Ao}${w.mes}_${w.loanId}`,fecha:w.fechaAmort,cantidad:w.cantidadAmort,tipo:I,simulacion:!0}),x.set(w.loanId,z)}let S=0;for(const w of t.loans()){const z=x.get(w._id);if(!z)continue;const _=(w.amortizaciones||[]).filter(D=>!Mo(D._id));t.guardarAmortizaciones(w._id,[..._,...z]),S+=1}q(`Plan aplicado: ${m.length} amortizaciones en ${S} préstamo${S!==1?"s":""} (simulación)`),b?g(b):i(),t.refrescar([...x.keys()])}function g({titulo:m,resumen:I,fechaObjetivo:b}){const x=s(m,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(j(I.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${c(j(I.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${c((b==null?void 0:b.slice(0,7))??"")}</div><div class="stat-value pos">${c(j(I.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${c(j(I.totalComisiones))}</div></div>
      </div>
      ${I.resumenPorLoan.map(wo).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${I.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${I.plan.map(S=>So(S,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);x&&R(x,"[data-cancelar]",i)}return{abrir:p,get planManual(){return a},get comparativa(){return e}}}function So(t,e){const a=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${c(j(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${c(t.mes)}</td>
    <td>${c(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${c(j(t.capitalAntes))}</td>
    <td class="num neg">${c(j(t.cantidadAmort))}${a}</td>
    <td class="num">${c(j(t.capitalDespues))}</td>
    ${e?`<td class="num" style="color:var(--text3)">${c(j(t.saldoDisponible))} → ${c(j(t.saldoDespues))}</td>`:""}
  </tr>`}function wo(t){return`<div class="card mb-8" style="padding:12px">
    <div class="flex justify-between items-center mb-8">
      <span style="font-weight:600">${c(t.nombre)}</span>
      <span class="badge badge-yellow">${c(t.tin)}% TIN</span>
    </div>
    <div class="grid-4" style="gap:8px;font-size:12px">
      <div><div class="stat-label">Fecha fin</div>
        <div class="num" style="text-decoration:line-through;color:var(--text3)">${c(t.fechaFinSin)}</div>
        <div class="num pos">${c(t.fechaFinCon)}</div></div>
      <div><div class="stat-label">Plazo ahorrado</div><div class="num pos">${t.mesesAhorrados>0?`${t.mesesAhorrados}m`:"—"}</div></div>
      <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${c(j(t.ahorroIntereses))}</div></div>
      <div><div class="stat-label">${t.numAmortizaciones} amorts.</div><div class="num">${c(j(t.totalAmortizado))}</div></div>
    </div>
  </div>`}const qi="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Li(t){const e=t.hoy??Y;let a=!1;const o=new Set;let n=null;const s=()=>{var b;return(b=t.onDatosCambiados)==null?void 0:b.call(t)},i=()=>t.store.get("escenarios"),r=b=>{var x;return((x=i().find(S=>S._id===b))==null?void 0:x.nombre)??b};function l(b){if(!b.activo||b.simulacion)return!1;const x=at(b).tabla.filter(S=>!S.esAmortizacion);return x.length===0?!0:x[x.length-1].fecha<e()}function p(b,x){const S=e(),w=S.slice(0,7),z=new Map;let _=0;for(const D of b){if(!D.activo||D.simulacion||x.has(D._id)||(D.fechaInicio||"")>S)continue;const C=at(D).tabla.filter(E=>!E.esAmortizacion&&E.fecha.startsWith(w)),M=C.length>0?C[0].cuota:0;z.set(D._id,M),_+=M}return{porLoan:z,total:_,activos:[...z.values()].filter(D=>D>0).length}}function h(b){const x=t.store.get("config"),S=x.dashboardStart,w=x.dashboardEnd,z=Math.max(1,(G(w).getTime()-G(S).getTime())/(30.44*864e5));let _=0;for(const D of b)!D.activo||D.simulacion||(_+=at(D).tabla.filter(C=>!C.esAmortizacion&&C.fecha>=S&&C.fecha<=w).reduce((C,M)=>C+M.cuota,0));return{media:_/z,desde:S,hasta:w}}function u(b){const x=[...t.store.get("loans")].sort((E,F)=>F.tin-E.tin),S=new Set(x.filter(l).map(E=>E._id)),w=a?x:x.filter(E=>!S.has(E._id)),z=p(x,S),_=h(x),D=t.store.get("config"),C=t.store.get("inflacion"),M=new Date(G(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});b.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${S.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${S.size})</button>`:""}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${z.total>0||_.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${z.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${c(M)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${c(j(z.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${z.activos} préstamo${z.activos!==1?"s":""} activo${z.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${_.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${c(j(_.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${c(_.desde)} → ${c(_.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${w.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':w.map(E=>Fi(E,{periodos:C,usarInflacion:!!D.usarInflacion,hoy:e(),cuotaMes:z.porLoan.get(E._id)??0,completado:S.has(E._id),nombreEscenario:r})).join("")}
      </div>`;for(const E of b.querySelectorAll("[data-body-loan]"))o.has(E.dataset.bodyLoan??"")&&E.classList.add("open")}const d=()=>document.getElementById("modal-overlay"),v=()=>document.getElementById("modal-content"),y=()=>{var b;return(b=d())==null?void 0:b.classList.add("hidden")};function $(b,x){const S=d(),w=v();return!S||!w?null:(w.innerHTML=`<div class="modal-title">${c(b)}</div>${x}`,S.classList.remove("hidden"),R(w,"[data-cancelar]",y),w)}function A(b,x){const S=b?t.store.get("loans").find(z=>z._id===b)??null:null,w=$(b?"Editar préstamo":"Nuevo préstamo",Ri(S,t.store.get("accounts"),i(),e()));w&&(w.addEventListener("change",z=>{var _;(_=z.target)!=null&&_.matches("[data-dp-modo]")&&xo(w)}),R(w,"[data-guardar-loan]",z=>{f(w,z.getAttribute("data-guardar-loan")||"")&&(y(),x())}))}function f(b,x){const S=E=>{var F;return((F=b.querySelector(E))==null?void 0:F.value)??""},w=E=>{var F;return!!((F=b.querySelector(E))!=null&&F.checked)},z=S("#f-nombre").trim(),_=parseFloat(S("#f-capital")),D=parseFloat(S("#f-tin")),C=parseInt(S("#f-meses"),10);if(!z||!Number.isFinite(_)||!Number.isFinite(D)||!Number.isFinite(C))return q("Completa los campos obligatorios","err"),!1;const M={nombre:z,capital:_,tin:D,meses:C,fechaInicio:S("#f-fecha"),comisionApertura:parseFloat(S("#f-com-ap"))||0,comisionAmort:parseFloat(S("#f-com-am"))||0,diaPago:$o(b),cuenta:S("#f-cuenta"),simulacion:w("#f-sim"),activo:w("#f-activo"),mostrarFechaFinEnDashboard:w("#f-mostrar-fin"),tipoTasa:S("#f-tipo-tasa"),basico:w("#f-basico"),tags:S("#f-tags").split(",").map(E=>E.trim()).filter(Boolean),escenarioIds:[...b.querySelectorAll(".loan-escenario:checked")].map(E=>E.value)};return x?(t.store.updateItem("loans",x,M),q("Préstamo actualizado")):(t.store.addItem("loans",{...M,amortizaciones:[]}),q("Préstamo creado")),s(),!0}function g(b,x,S){const w=t.store.get("loans").find(D=>D._id===b);if(!w)return;const z=x?(w.amortizaciones||[]).find(D=>D._id===x)??null:null,_=$(x?"Editar amortización":"Añadir amortización",Ni(b,z,i(),e()));_&&R(_,"[data-guardar-amort]",D=>{const[C,M]=(D.getAttribute("data-guardar-amort")||"").split("|");m(_,C,M)&&(y(),S([C]))})}function m(b,x,S){var F;const w=T=>{var N;return((N=b.querySelector(T))==null?void 0:N.value)??""},z=w("#am-fecha"),_=parseFloat(w("#am-cant"));if(!z||!Number.isFinite(_)||_<=0)return q("Fecha y cantidad requeridas","err"),!1;const D=t.store.get("loans").find(T=>T._id===x);if(!D)return!1;const C={fecha:z,cantidad:_,tipo:w("#am-tipo"),simulacion:!!((F=b.querySelector("#am-sim"))!=null&&F.checked),escenarioIds:[...b.querySelectorAll(".amort-escenario:checked")].map(T=>T.value)},M=D.amortizaciones||[],E=S?M.map(T=>T._id===S?{...T,...C}:T):[...M,{_id:Date.now().toString(36),...C}];return t.store.updateItem("loans",x,{amortizaciones:E}),q(S?"Amortización actualizada":"Amortización añadida"),s(),!0}function I(b,x,S){R(b,"[data-toggle-finalizados]",()=>{a=!a,x()}),R(b,"[data-nuevo-loan]",()=>A(null,x)),R(b,"[data-optimizar]",()=>S.abrir()),R(b,"[data-toggle-loan]",(w,z)=>{var M;if((M=z.target)!=null&&M.closest("button"))return;const _=w.getAttribute("data-toggle-loan"),D=[...b.querySelectorAll("[data-body-loan]")].find(E=>E.dataset.bodyLoan===_);(D==null?void 0:D.classList.toggle("open"))?o.add(_):o.delete(_)}),R(b,"[data-editar-loan]",w=>A(w.getAttribute("data-editar-loan"),x)),R(b,"[data-borrar-loan]",w=>{if(!Z("¿Eliminar préstamo?"))return;const z=w.getAttribute("data-borrar-loan");t.store.removeItem("loans",z),o.delete(z),q("Eliminado"),s(),x()}),R(b,"[data-amort-loan]",w=>{const z=w.getAttribute("data-amort-loan");o.add(z),g(z,null,x)}),R(b,"[data-editar-amort]",w=>{const[z,_]=(w.getAttribute("data-editar-amort")||"").split("|");o.add(z),g(z,_,x)}),R(b,"[data-borrar-amort]",w=>{const[z,_]=(w.getAttribute("data-borrar-amort")||"").split("|"),D=t.store.get("loans").find(C=>C._id===z);D&&(t.store.updateItem("loans",z,{amortizaciones:(D.amortizaciones||[]).filter(C=>C._id!==_)}),q("Amortización eliminada"),s(),x([z]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:qi,mount(b){const x=(S=[])=>{for(const w of S)o.add(w);u(b)};n??(n=Oi({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(S,w)=>{t.store.updateItem("loans",S,{amortizaciones:w}),s()},hoy:e,refrescar:x})),u(b),b.dataset.wired!=="1"&&(I(b,x,n),b.dataset.wired="1")}}}const Bi={transporte:125,restaurante:220,otros:null},ki={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Hi=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Bt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(n)}"/></div>`,Gi=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function Vi(t,e){const a=t.map((s,i)=>{const r=e.find(h=>h._id===s.cuenta),l=Bi[s.tipo],p=l!=null&&s.importe>l;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${c(ki[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${c(j(s.importe))}/mes${p?` <span style="color:var(--red)" title="Supera el límite orientativo de ${c(j(l))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?c(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
        <button class="btn-danger btn-sm" data-flex-borrar="${i}">✕</button>
      </div>`}).join(""),o=e.filter(s=>(s.modeloFondo||"cuenta")!=="pension"&&s.activo!==!1),n=o.filter(s=>(s.modeloFondo||"cuenta")==="beneficio");return`<div style="margin-bottom:8px">${a||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin componentes. Añade transporte o restaurante.</div>'}</div>
    <div class="grid-3 mt-6" style="gap:6px">
      <select class="form-select" id="fc-tipo" style="font-size:12px">
        <option value="transporte">Transporte</option>
        <option value="restaurante">Restaurante</option>
        <option value="otros">Otros</option>
      </select>
      <input class="form-input" type="number" id="fc-importe" placeholder="€/mes" min="0" style="font-size:12px"/>
      <select class="form-select" id="fc-cuenta" style="font-size:12px">
        <option value="">Sin cuenta vinculada</option>
        ${o.map(s=>`<option value="${c(s._id)}">${c(s.nombre)}${(s.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function Ui(t,e){const a=e.hoy??Y(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Bt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Bt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(s=>`<option value="${s}"${n&&o===s?" selected":""}>${s} pagas</option>`).join("")}
          <option value="custom"${n?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${Gi(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Bt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??a)}
          ${Bt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Bt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${Hi.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${c(s)} (${i+1})</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="grid-2 mt-8">
          <div class="form-group" id="nf-custom-pagas-wrap"${n?' style="display:none"':""}>
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
          ${Bt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??Pe).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${se(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"nom-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Co(t,e){const a=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const l=parseFloat(a(i));return Number.isFinite(l)?l:r},n=a("#nf-npagas"),s=n==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Pe),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:e}}function Yi(t,e,a,o){const n=Co(t,e),s=e.reduce((f,g)=>f+(g.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),l=n.irpfModo==="manual"?i*(n.irpfPct/100):ut(Mt(n.bruto,s),a.tramos),p=i-r-l,h=i/n.nPagas,u=r/n.nPagas,d=l/n.nPagas,v=h-u-d,y=n.grupoNomina?a.nominas.filter(f=>f.grupoNomina===n.grupoNomina&&f._id!==o):[],$=y.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${c(n.grupoNomina)}" con ${c(y.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",A=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${c(j(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${c(j(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${c(j(n.bruto))}</span>
      ${A}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${c(j(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${c(j(l))} (${i>0?(l/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${c(j(p))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${c(j(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${c(j(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${c(j(v))}/paga`:`ingreso ${c(j(h))} − SS ${c(j(u))} − IRPF ${c(j(d))}`}${s>0?" + recargas flex":""}</span>
    </div>${$}`}function Ji(t,e,a,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=Vi(e,a.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=Yi(t,e,a,o))},i=()=>{var l,p;const r=(h,u)=>{const d=t.querySelector(h);d&&(d.style.display=u?"":"none")};r("#nf-custom-pagas-wrap",((l=t.querySelector("#nf-npagas"))==null?void 0:l.value)==="custom"),r("#nf-irpfpct-wrap",((p=t.querySelector("#nf-irpfmodo"))==null?void 0:p.value)==="manual"),s()};t.addEventListener("input",r=>{var l;(l=r.target)!=null&&l.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),J(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),R(t,"[data-flex-anadir]",()=>{var p,h,u;const r=((p=t.querySelector("#fc-tipo"))==null?void 0:p.value)||"transporte",l=parseFloat(((h=t.querySelector("#fc-importe"))==null?void 0:h.value)??"")||0;if(!l)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:r,importe:l,cuenta:((u=t.querySelector("#fc-cuenta"))==null?void 0:u.value)||""}),n(),s()}),R(t,"[data-flex-borrar]",r=>{e.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const jo=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function Wi(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??gt;function r(d,v){const y=o(),$=n();return!y||!$?null:($.innerHTML=`<div class="modal-title">${c(d)}</div>${v}`,y.classList.remove("hidden"),R($,"[data-cerrar]",s),$)}function l(){e=null;const d=[...t.store.get("tramosIRPFHistorico")].sort(($,A)=>$.año-A.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",y=r("Tramos IRPF por ejercicio",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
        Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${v}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(jo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${d.map($=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(jo($.tramos))}</span>
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
      </div>`);y&&(R(y,"[data-editar-tabla]",$=>{const A=$.getAttribute("data-editar-tabla");u(A==="default"?"default":Number(A))}),R(y,"[data-borrar-tabla]",$=>{const A=Number($.getAttribute("data-borrar-tabla"));Z(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),R(y,"[data-anadir-anyo]",()=>{var f;const $=parseInt(((f=y.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!$||$<2e3||$>2100)return q("Año inválido","err");const A=t.store.get("tramosIRPFHistorico");if(A.some(g=>g.año===$))return q("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...A,{_id:Date.now().toString(36),año:$,tramos:i().map(g=>[...g])}]),t.onDatosCambiados(),u($)}))}function p(){return a.map(([d,v],y)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${y}" value="${d}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${y}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${y}">✕</button>
          </div>
        </div>`).join("")}function h(d){a=[...d.querySelectorAll("[data-tr-min]")].map((y,$)=>{const A=d.querySelector(`[data-tr-pct="${$}"]`);return[parseFloat(y.value)||0,parseFloat((A==null?void 0:A.value)??"")||0]})}function u(d){var g;e=d;const v=t.store.get("tramosIRPFHistorico");a=(d==="default"?i():((g=v.find(m=>m.año===d))==null?void 0:g.tramos)??i()).map(m=>[...m]);const $=d==="default"?"tabla por defecto":`ejercicio ${d}`,A=r(`Tramos IRPF — ${d==="default"?"Por defecto":d}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${c($)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${p()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!A)return;const f=()=>{const m=A.querySelector("#irpf-tramos-rows");m&&(m.innerHTML=p())};R(A,"[data-volver]",l),R(A,"[data-tr-anadir]",()=>{h(A),a.push([0,0]),f()}),R(A,"[data-tr-borrar]",m=>{h(A),a.splice(Number(m.getAttribute("data-tr-borrar")),1),f()}),R(A,"[data-tr-guardar]",()=>{h(A);const m=[...a].sort((I,b)=>I[0]-b[0]);if(m.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:m}),q("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(I=>I.año===e?{...I,tramos:m}:I)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}const Eo=1500,_t=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(n)}"/></div>`,Qi=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${c(n)}"${n===o?" selected":""}>${c(s)}</option>`).join("")}
   </select></div>`,Ki=t=>(t.modeloFondo||"cuenta")==="pension";function Xi(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>Zi(n,e,a,o)).join("")}</div>`}function Zi(t,e,a,o){const n=pe(t);if(!n)return"";const s=_e(t,e,a),i=o.slice(0,4),r=(t.aportaciones||[]).filter(p=>p.fecha>=`${i}-01-01`).reduce((p,h)=>p+h.cantidad,0),l=Math.min(r,Eo)*(s/100);return`<div class="card">
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
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${c(j(n.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(j(n.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${n.beneficio>=0?"pos":"neg"}">${c(j(n.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(j(n.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(j(n.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>Eo?"neg":""}">${c(j(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${c(j(l))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${c(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${c(n.proxDesbloqueo)}</div>`:""}
  </div>`}function tr(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${c(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${c(j(a.importe))} / ${c(a.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function er(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${_t("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${_t("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${_t("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${_t("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${_t("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${Qi("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${_t("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${s?' style="display:none"':""}>
        ${_t("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
      </div>
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Grupo (para IRPF marginal real)</label>
      <select class="form-select" id="pen-grupo">
        <option value="">Sin grupo — usar tipo fijo</option>
        ${n.map(i=>`<option value="${c(i)}"${(t==null?void 0:t.grupoNomina)===i?" selected":""}>${c(i)}</option>`).join("")}
      </select>
      ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Crea grupos en las nóminas para poder seleccionarlos aquí.</div>':""}
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
    ${se(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"pen-escenario")}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function ar(t,e,a){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=tr(e))};J(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),R(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#paport-fin"))==null?void 0:l.value)||""}),o()}),R(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function or(t,e,a,o){var A;const n=f=>{var g;return((g=t.querySelector(f))==null?void 0:g.value)??""},s=(f,g=0)=>{const m=parseFloat(n(f));return Number.isFinite(m)?m:g},i=f=>{var g;return!!((g=t.querySelector(f))!=null&&g.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const l=s("#pen-saldo"),p=n("#pen-grupo"),h={nombre:r,grupoNomina:p,saldo:l,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:p?0:s("#pen-impuesto"),planAportaciones:e,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(f=>f.value)},u=[...(a==null?void 0:a.historicoSaldos)??[]],d=[...(a==null?void 0:a.aportaciones)??[]],y=((A=[...u].sort((f,g)=>g.fecha.localeCompare(f.fecha))[0])==null?void 0:A.saldo)??(a==null?void 0:a.saldo)??null,$=Date.now().toString(36);return a?(y===null||Math.abs(l-y)>.005)&&(u.push({_id:$,fecha:o,saldo:l,nota:"Actualización manual"}),l>(y??0)&&d.push({_id:`${$}a`,fecha:o,cantidad:l-(y??0)})):l>0&&(u.push({_id:$,fecha:o,saldo:l,nota:"Saldo inicial"}),d.push({_id:`${$}a`,fecha:h.fechaInicialSaldo??o,cantidad:l})),{datos:{...h,historicoSaldos:u,aportaciones:d}}}const sr="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function nr(t){const e=t.hoy??Y,a=()=>{var A;return(A=t.onDatosCambiados)==null?void 0:A.call(t)};function o(){const A=t.store.get("config");return bt(t.store.get("tramosIRPFHistorico"),A.tramos_irpf??gt)(Number(e().slice(0,4)))}function n(A,f,g){const m=Te(A,f,g),I=!!f&&A.irpfModo!=="manual",b=[A.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${A.mesActualizacionIPC}">IPC m${A.mesActualizacionIPC}</span>`:"",m.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${c(j(m.flexAnual))}/año</span>`:"",Math.abs(m.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${m.ssPct.toFixed(2)}%</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(A.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${b}</div>
      </div>
      <div class="num">${c(j(m.brutoAnual))}
        ${m.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${c(j(m.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${c(j(m.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${m.nPagas} pagas</div>
      <div class="text-sm ${I?"neg":""}">${A.irpfModo==="manual"?`${c(A.irpfPct??0)}% (manual)`:`${m.irpfPct.toFixed(1)}% (auto)`}${I?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${A.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${c(s(A.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${c(A._id)}"${A.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${c(A._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${c(A._id)}">✕</button>
      </div>
    </div>`}const s=A=>{var f;return((f=t.store.get("accounts").find(g=>g._id===(A||"default")))==null?void 0:f.nombre)??(A||"default")};function i(A,f,g){const m=f.reduce((x,S)=>x+(S.bruto||0),0),I=vs(f,g),b=m>0?I/m*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${c(A)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${c(j(m))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${b.toFixed(1)}%</strong> (${c(j(I))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${f.map(x=>n(x,f,g)).join("")}
      </div>
    </div>`}function r(A){const f=o(),g=[...t.store.get("nominas")].sort((S,w)=>(w.bruto||0)-(S.bruto||0)),{grupos:m,sueltas:I}=bs(g),b=t.store.get("accounts").filter(Ki),x=g.filter(S=>S.activo!==!1);A.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${g.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...m.entries()].map(([S,w])=>i(S,w,f)).join("")}
      ${I.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${I.map(S=>n(S,null,f)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Xi(b,x,f,e())}</div>`}const l=()=>document.getElementById("modal-overlay"),p=()=>document.getElementById("modal-content"),h=()=>{var A;return(A=l())==null?void 0:A.classList.add("hidden")};function u(A,f){const g=l(),m=p();return!g||!m?null:(m.innerHTML=`<div class="modal-title">${c(A)}</div>${f}`,g.classList.remove("hidden"),R(m,"[data-cancelar]",h),m)}function d(A,f){const g=A?t.store.get("nominas").find(x=>x._id===A)??null:null,m=[...(g==null?void 0:g.retribucionFlexible)??[]].map(x=>({...x})),I={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:o(),hoy:e()},b=u(A?"Editar nómina":"Nueva nómina",Ui(g,I));b&&(Ji(b,m,I,A??""),R(b,"[data-guardar-nomina]",x=>{const S=Co(b,m);if(!S.nombre||S.bruto<=0)return q("Nombre y bruto anual son obligatorios","err");const w=x.getAttribute("data-guardar-nomina")||"",z={...S,activo:!0,tags:["nomina"]};w?(t.store.updateItem("nominas",w,z),q("Nómina actualizada")):(t.store.addItem("nominas",z),q("Nómina creada")),a(),h(),f()}))}function v(A,f){const g=A?t.store.get("accounts").find(b=>b._id===A)??null:null,m=[...(g==null?void 0:g.planAportaciones)??[]].map(b=>({...b})),I=u(A?"Editar plan de pensiones":"Nuevo plan de pensiones",er(g,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:e()}));I&&(ar(I,m,e()),R(I,"[data-guardar-pension]",b=>{const{datos:x,error:S}=or(I,m,g,e());if(S)return q(S,"err");const w=b.getAttribute("data-guardar-pension")||"";w?(t.store.updateItem("accounts",w,x),q("Plan actualizado")):(t.store.addItem("accounts",x),q("Plan creado")),a(),h(),f()}))}function y(A,f,g){R(A,"[data-nueva-nomina]",()=>d(null,f)),R(A,"[data-editar-nom]",m=>d(m.getAttribute("data-editar-nom"),f)),R(A,"[data-borrar-nom]",m=>{Z("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",m.getAttribute("data-borrar-nom")),q("Eliminada"),a(),f())}),J(A,"[data-activo-nom]",m=>{const I=m;t.store.updateItem("nominas",I.getAttribute("data-activo-nom"),{activo:I.checked}),a(),f()}),R(A,"[data-tramos]",()=>g.abrir()),R(A,"[data-nueva-pension]",()=>v(null,f)),R(A,"[data-editar-pension]",m=>v(m.getAttribute("data-editar-pension"),f)),R(A,"[data-borrar-pension]",m=>{Z("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",m.getAttribute("data-borrar-pension")),q("Plan eliminado"),a(),f())})}let $=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:sr,mount(A){const f=()=>r(A);$??($=Wi({store:t.store,onDatosCambiados:()=>{a(),f()},año:()=>Number(e().slice(0,4))})),r(A),A.dataset.wired!=="1"&&(y(A,f,$),A.dataset.wired="1")}}}const ir="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",rr="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",zo={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},lr={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function cr(t,e){const a=t.filter(l=>l.activo&&mt(l)==="inversion");if(a.length===0)return"";let o=0,n=0,s=0,i=0;for(const l of a){const p=Rt(l,e);p&&(o+=p.saldo,n+=p.costBase,s+=p.plusvalia,i+=p.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${c(j(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${c(j(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${c(r)}%)</div><div class="stat-value ${s>=0?"pos":"neg"}">${c(j(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${c(j(i))}</div><div class="stat-sub">Neto: ${c(j(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function dr(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,n=Math.max(1,(G(o).getTime()-G(a).getTime())/(30.44*864e5)),s=Ut(t,a),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(e.config.usarInflacion&&e.inflacion.length>0){const l=s*(pt(e.inflacion,a,o)-1),p=i-l;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${c(j(l))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${p>=0?"var(--accent)":"var(--red)"};font-weight:600">${c(j(p))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${c(a.slice(0,7))} → ${c(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${c(j(i))}</span>
    </div>${r}
  </div>`}function ur(t,e){const a=zo[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,n=e.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(y=>y.cuenta===t._id).map(y=>({nomina:v,importe:y.importe}))),s=n.reduce((v,y)=>v+y.importe,0),i=s*12,r=o!==null&&i>o,l=o!==null?Math.min(i,o):i,p=t.grupoNomina?e.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):n.slice(0,1).map(v=>v.nomina),h=Ma(p,e.tramosIRPF),u=l*h/100,d=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${h}%`:`tipo marginal ${h}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${c(a.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${c(j(s))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${c(j(i))}/año${r?` ⚠ excede límite ${c(j(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${c(j(o))}/año</span></div>`:""}
    ${u>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${c(d)}">≈ ${c(j(u))}/año <span style="font-size:10px;color:var(--text3)">(${c(h)}%)</span></span></div>`:""}
    ${n.length>0?n.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${c(v.nomina.nombre)}: ${c(j(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function pr(t){const e=pe(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(j(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(j(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${c(j(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${c(j(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${c(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${c(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function mr(t,e){const a=Rt(t,e.tramosGanancias);if(!a)return"";const o=e.config,n=e.flujos(t._id),s=G(o.dashboardStart),i=G(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),l=a.saldo+n.totalAportaciones-n.totalReembolsos,p=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,h=l>0&&r>0?Math.max(0,l*Math.pow(1+p,r)):Math.max(0,l),u=a.costBase+n.totalAportaciones,d=Math.max(0,h-u),v=Fe(d,e.tramosGanancias),y=d>0?(v/d*100).toFixed(1):"0",$=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",A=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",f=(S,w,z)=>S.map(_=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${w} ${c(_.contraparte)}: ${c(_.concepto)}</span>
          <span class="num ${z}">${c(j(_.total))} · ${_.ocurrencias} mov.</span>
        </div>`).join(""),m=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${c(o.dashboardStart.slice(0,7))} → ${c(o.dashboardEnd.slice(0,7))})</div>
         ${f(n.entradas,"↓","pos")}
         ${f(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${c(j(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${c(j(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${c(j(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',I=e.invModo(t._id),b=S=>`padding:3px 10px;border-radius:20px;border:1px solid ${S?"var(--accent)":"var(--border)"};background:${S?"var(--accent-dim)":"transparent"};color:${S?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,x=I==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(j(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${c(j(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${c(j(a.neto))}</div><div class="stat-sub">${c(A)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${c(j(u))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${c(j(h))}</div><div class="stat-sub">${c($)} · ${c(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${c(j(h-v))}</div><div class="stat-sub">${c(y)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${c(t._id)}|real" style="${b(I==="real")}">Real</button>
          <button data-inv-modo="${c(t._id)}|proyeccion" style="${b(I==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${x}
      ${m}
    </div>`}function fr(t,e){const a=[...t.historicoSaldos||[]].sort((l,p)=>p.fecha.localeCompare(l.fecha)),o=a[0],n=rt(t),s=mt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${c((zo[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(l=>`<span class="badge badge-yellow">🔭 ${c(e.nombreEscenario(l))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${c(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${c(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${c(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${rr}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${ir}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${c(j(t.saldoInicial||0))}</div><div class="stat-sub">${c(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${c(j(n))}</div>${o?`<div class="stat-sub">Registro: ${c(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${c(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${c(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${dr(t,e)}
    ${s==="beneficio"?ur(t,e):""}
    ${s==="pension"?pr(t):""}
    ${s==="inversion"?mr(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${c(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${c(t.descripcion)}</div>`:""}
  </div>`}const vr=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function gr(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${c(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${c(j(a.importe))} / ${c(a.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function br(t,e){const a=t?mt(t):"cuenta",o=[...new Set(e.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${tt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Lt("ac-modelo","Tipo",vr,a)}
    </div>
    <div class="grid-2 mt-8">
      ${tt("ac-saldo","Saldo actual (€)","number",e.saldoActual,"5000")}
      ${tt("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${tt("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${tt("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="form-row mt-8">
      <label class="form-label">Activa</label>
      <label class="toggle"><input type="checkbox" id="ac-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
    </div>

    <details class="form-advanced mt-12"${t?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="mt-8">
          ${Lt("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
        </div>
        <div id="ac-inversion-hint"${n(a==="inversion")}>
          <div class="auth-hint mt-8" style="border-color:#10b981">
            📈 <strong>Fondo de inversión:</strong> la tarjeta muestra la plusvalía latente y el impuesto estimado
            sobre ganancias de capital con los tramos configurados en esta misma vista.
          </div>
        </div>
        <div id="ac-beneficio-fields"${n(a==="beneficio")}>
          <div class="auth-hint mt-8" style="border-color:var(--accent)">
            🎫 <strong>Tarjeta beneficio:</strong> se recarga mensualmente desde la nómina. Los gastos
            (metro, restaurante) se registran como movimientos sobre esta cuenta.
          </div>
          <div class="form-group mt-8">
            ${Lt("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
          </div>
          <div class="form-group mt-8">
            <label class="form-label">Grupo de nóminas (para el tipo marginal de IRPF)</label>
            <select class="form-select" id="ac-beneficio-grupo">
              <option value="">Sin grupo — usar la primera nómina vinculada</option>
              ${o.map(s=>`<option value="${c(s)}"${(t==null?void 0:t.grupoNomina)===s?" selected":""}>${c(s)}</option>`).join("")}
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
        ${se(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"ac-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function hr(t,e,a){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=gr(e))};J(t,"#ac-modelo",n=>{const s=n.value,i=(r,l)=>{const p=t.querySelector(r);p&&(p.style.display=l?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),R(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#aport-fin"))==null?void 0:l.value)||""}),o()}),R(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function yr(t,e,a,o,n){const s=y=>{var $;return(($=t.querySelector(y))==null?void 0:$.value)??""},i=(y,$=0)=>{const A=parseFloat(s(y));return Number.isFinite(A)?A:$},r=y=>{var $;return!!(($=t.querySelector(y))!=null&&$.checked)},l=s("#ac-nombre").trim();if(!l)return{datos:{},error:"Nombre obligatorio"};const p=s("#ac-modelo")||"cuenta",h=p==="beneficio",u=i("#ac-saldo"),d={nombre:l,saldo:u,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(y=>y.value),modeloFondo:p,planAportaciones:e,tipoBeneficio:h?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:h?s("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&u<=0)return{datos:d};if(!(o===null||Math.abs(u-o)>.005))return{datos:d};if(p==="inversion"&&u>(o??0)){const y=Date.now().toString(36);d.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${y}a`,fecha:a?n:d.fechaInicialSaldo??n,cantidad:u-(o??0)}]}return{datos:d,punto:{fecha:n,saldo:u,nota:a?"Actualización manual":"Saldo inicial"}}}function aa(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:et(e.saldoCts),nota:e.nota}))}function xr(t,e,a,o,n){const s=a.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${c(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${c(j(i.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${c(i.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${c(e)}|${c(i._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${c(e)}|${c(i._id)}">✕</button>
      </div>`).join("");return`
    <div class="card-title">Histórico — ${c(t)}</div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${a.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':s}
    </div>
    <div class="divider"></div>
    <div class="card-title">Añadir punto de control</div>
    <div class="grid-3">
      <div class="form-group"><label class="form-label">Fecha</label>
        <input class="form-input" type="date" id="hi-fecha" value="${c(n)}"/></div>
      <div class="form-group"><label class="form-label">Saldo real (€)</label>
        <input class="form-input" type="number" id="hi-saldo" placeholder="5000"/></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="hi-nota" placeholder="Extracto enero..."/></div>
    </div>
    <div class="flex gap-8 mt-12" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cerrar</button>
      <button class="btn-primary" data-hist-anadir="${c(e)}">Añadir</button>
    </div>`}const Fo=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function $r(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??jt;function r(d,v){const y=o(),$=n();return!y||!$?null:($.innerHTML=`<div class="modal-title">${c(d)}</div>${v}`,y.classList.remove("hidden"),R($,"[data-cerrar]",s),$)}function l(){e=null;const d=[...t.store.get("tramosGananciasCapitalHistorico")].sort(($,A)=>$.año-A.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",y=r("Tramos — Ganancias de capital",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tramos marginales de la base del ahorro (art. 49 LIRPF): plusvalías de fondos, intereses y dividendos.
        Un ejercicio sin tabla propia usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${v}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(Fo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${d.map($=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(Fo($.tramos))}</span>
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
      </div>`);y&&(R(y,"[data-editar-tg]",$=>{const A=$.getAttribute("data-editar-tg");u(A==="default"?"default":Number(A))}),R(y,"[data-borrar-tg]",$=>{const A=Number($.getAttribute("data-borrar-tg"));Z(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),R(y,"[data-anadir-anyo-tg]",()=>{var f;const $=parseInt(((f=y.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!$||$<2e3||$>2100)return q("Año inválido","err");const A=t.store.get("tramosGananciasCapitalHistorico");if(A.some(g=>g.año===$))return q("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...A,{_id:Date.now().toString(36),año:$,tramos:i().map(g=>[...g])}]),t.onDatosCambiados(),u($)}))}function p(){return a.map(([d,v],y)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${y}" value="${d}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${y}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${y}">✕</button>
          </div>
        </div>`).join("")}function h(d){a=[...d.querySelectorAll("[data-tg-min]")].map((v,y)=>{const $=d.querySelector(`[data-tg-pct="${y}"]`);return[parseFloat(v.value)||0,parseFloat(($==null?void 0:$.value)??"")||0]})}function u(d){var f;e=d;const v=t.store.get("tramosGananciasCapitalHistorico");a=(d==="default"?i():((f=v.find(g=>g.año===d))==null?void 0:f.tramos)??i()).map(g=>[...g]);const $=r(`Ganancias de capital — ${d==="default"?"Por defecto":d}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${p()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!$)return;const A=()=>{const g=$.querySelector("#tg-rows");g&&(g.innerHTML=p())};R($,"[data-volver-tg]",l),R($,"[data-tg-anadir]",()=>{h($),a.push([0,0]),A()}),R($,"[data-tg-borrar]",g=>{h($),a.splice(Number(g.getAttribute("data-tg-borrar")),1),A()}),R($,"[data-tg-guardar]",()=>{h($);const g=[...a].sort((m,I)=>m[0]-I[0]);if(g.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:g}),q("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(m=>m.año===e?{...m,tramos:g}:m)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}function Ir(t){function e(){if(t.navegar)return t.navegar("planner");const s=globalThis.Router;s==null||s.navigate("planner")}function a(s,i,r){const l=ha(s,i,r),p=s.targetAmount||0,h=p>0?Math.min(100,l/p*100):0;return`
      <div style="padding:8px 0;border-bottom:1px solid var(--hairline-soft)">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:500">${c(s.nombre)}</span>
          <span class="num" style="font-size:11px;color:var(--text3)">
            ${c(j(l))} / ${c(j(p))}
          </span>
        </div>
        <div class="goal-bar"><div class="goal-bar-fill" style="width:${h}%;background:${c(s.color||"var(--accent)")}"></div></div>
      </div>`}function o(s){const i=t.store.get("goals");if(i.length===0){s.innerHTML="",s.style.display="none";return}s.style.display="";const r=t.store.get("accounts"),l=t.colchonEnFecha(t.hoy()),p=[...i].sort((h,u)=>(h.prioridad||99)-(u.prioridad||99));s.innerHTML=`
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro (antiguos)</div>
        <button class="btn-primary btn-sm" data-ir-planner>Ir a Objetivos financieros</button>
      </div>
      <div class="text-sm mb-12" style="color:var(--text2);line-height:1.6">
        Estos objetivos se gestionan ahora en <strong>Objetivos financieros</strong>, donde compiten por tu
        flujo mensual en vez de medir solo el saldo de unas cuentas. Ya se copiaron allí; esto es solo la
        copia antigua, en modo lectura.
      </div>
      ${p.map(h=>a(h,r,l)).join("")}
      <div class="mt-12">
        <button class="btn-secondary btn-sm" data-descartar-goals style="color:var(--red)">Descartar los antiguos</button>
        <div class="text-sm mt-4" style="color:var(--text3)">
          Comprueba antes que están en Objetivos financieros: esto no se puede deshacer.
        </div>
      </div>`}function n(s,i){R(s,"[data-ir-planner]",()=>e()),R(s,"[data-descartar-goals]",()=>{const r=t.store.get("goals").length;if(Z(`Se van a borrar ${r} objetivo${r!==1?"s":""} de ahorro antiguos. ¿Seguro?`)){for(const l of[...t.store.get("goals")])t.store.removeItem("goals",l._id);q("Objetivos antiguos descartados"),t.onDatosCambiados(),i()}})}return{render:o,wire:n}}const Ar="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Mr=120;function Sr(t){const e=t.hoy??Y,a=()=>{var C;return(C=t.onDatosCambiados)==null?void 0:C.call(t)},o=t.mostrarObjetivos??(()=>!0),n=new Map,s=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),r=C=>{var M;return((M=i().find(E=>E._id===C))==null?void 0:M.nombre)??C},l=C=>{var M;return((M=t.store.get("accounts").find(E=>E._id===C))==null?void 0:M.nombre)??C},p=()=>bt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??gt)(Number(e().slice(0,4))),h=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??jt),u=()=>h()(Number(e().slice(0,4))),d=C=>qa(t.store.get("expenses"),s(),t.store.get("loans"),C);function v(){const C=s(),M=t.store.get("accounts"),E=Wt({loans:[],expenses:t.store.get("expenses").filter(B=>B.tipo==="transferencia"),accounts:M,config:{dashboardStart:C.dashboardStart,dashboardEnd:C.dashboardEnd,fechaReferencia:C.dashboardStart},nominas:[],resolverTramosGanancias:h()}),F=new Map,T=B=>{let L=F.get(B);return L||(L={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},F.set(B,L)),L},N=(B,L)=>{const k=`${L.sourceId}`,O=B.find(U=>U.concepto===k),H=O??{concepto:k,contraparte:"",total:0,ocurrencias:0};H.total+=Math.abs(L.cuantia),H.ocurrencias+=1,O||B.push(H)};for(const B of E){if(!B.cuenta)continue;const L=T(B.cuenta);B.sourceType==="transfer-in"||B.sourceType==="traspaso-in"?(L.totalAportaciones+=Math.abs(B.cuantia),N(L.entradas,B)):B.sourceType==="transfer-out"||B.sourceType==="traspaso-out"?(L.totalReembolsos+=Math.abs(B.cuantia),N(L.salidas,B)):B.sourceType==="investment-tax"&&(L.retencion+=Math.abs(B.cuantia))}const P=t.store.get("expenses");for(const B of F.values())for(const[L,k]of[[B.entradas,"cuenta"],[B.salidas,"cuentaDestino"]])for(const O of L){const H=P.find(U=>U._id===O.concepto);O.contraparte=l((H==null?void 0:H[k])??"default"),O.concepto=(H==null?void 0:H.concepto)||(k==="cuenta"?"Aportación":"Reembolso")}return F}function y(){const C=new Map,M=s(),E=e(),F=new Date(Number(E.slice(0,4)),Number(E.slice(5,7))-1+Mr+1,0),T=`${F.getFullYear()}-${String(F.getMonth()+1).padStart(2,"0")}-${String(F.getDate()).padStart(2,"0")}`;return N=>{const P=C.get(N._id);if(P)return P;const B=Wt({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...M,dashboardStart:E,dashboardEnd:T,fechaReferencia:E},filtroAccounts:[N._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),M.tramos_irpf??gt),resolverTramosGanancias:h()}).map(L=>({fecha:L.fecha,saldoAcum:L.saldoAcum}));return C.set(N._id,B),B}}const $=Ir({store:t.store,colchonEnFecha:d,extractoCuenta:C=>A(C),hoy:e,onDatosCambiados:a});let A=y();function f(C){A=y();const E=t.store.get("accounts").filter(P=>mt(P)!=="pension"),F=v(),T={config:s(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:p(),tramosGanancias:u(),nombreEscenario:r,flujos:P=>F.get(P)??lr,invModo:P=>n.get(P)??"proyeccion"};C.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${cr(E,T.tramosGanancias)}
      <div class="grid-3">${E.map(P=>fr(P,T)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const N=C.querySelector("#goals-section");N&&$.render(N)}const g=()=>document.getElementById("modal-overlay"),m=()=>document.getElementById("modal-content"),I=()=>{var C;return(C=g())==null?void 0:C.classList.add("hidden")};function b(C,M){const E=g(),F=m();return!E||!F?null:(F.innerHTML=C?`<div class="modal-title">${c(C)}</div>${M}`:M,E.classList.remove("hidden"),R(F,"[data-cancelar]",I),F)}function x(C,M){const E=C?t.store.get("accounts").find(P=>P._id===C)??null:null,F=[...(E==null?void 0:E.planAportaciones)??[]].map(P=>({...P})),T=E?S(E):null,N=b(C?"Editar cuenta / fondo":"Nueva cuenta / fondo",br(E,{escenarios:i(),nominas:t.store.get("nominas"),hoy:e(),saldoActual:T??0}));N&&(hr(N,F,e()),R(N,"[data-guardar-acc]",P=>{const B=P.getAttribute("data-guardar-acc")||"",{datos:L,punto:k,error:O}=yr(N,F,E,T,e());if(O)return q(O,"err");let H=B;B?t.store.updateItem("accounts",B,L):H=t.store.addItem("accounts",L)._id,k&&t.ledger.registrarPuntoControl(H,k.fecha,k.saldo,k.nota),q(B?"Actualizada":"Cuenta / fondo creado"),a(),I(),M()}))}function S(C){const M=t.ledger.puntosControl(C._id);return M.length>0?aa(M)[0].saldo:C.saldo??null}function w(C,M){const E=t.store.get("accounts").find(N=>N._id===C);if(!E)return;const F=b("Histórico de saldos",xr(E.nombre,C,aa(t.ledger.puntosControl(C)),E.saldoInicial||0,e()));if(!F)return;const T=()=>{M(),w(C,M)};R(F,"[data-hist-anadir]",()=>{var L,k,O;const N=((L=F.querySelector("#hi-fecha"))==null?void 0:L.value)??"",P=parseFloat(((k=F.querySelector("#hi-saldo"))==null?void 0:k.value)??""),B=((O=F.querySelector("#hi-nota"))==null?void 0:O.value.trim())??"";if(!N||!Number.isFinite(P))return q("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(C,N,P,B||void 0),q("Punto añadido"),a(),T()}),R(F,"[data-hist-borrar]",N=>{const[,P]=(N.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(P),q("Eliminado"),a(),T()}),R(F,"[data-hist-inicial]",N=>{const[P,B]=(N.getAttribute("data-hist-inicial")||"").split("|"),L=t.ledger.puntosControl(P).find(O=>O._id===B);if(!L)return;const k=aa([L])[0].saldo;t.store.updateItem("accounts",P,{saldoInicial:k,fechaInicialSaldo:L.fecha}),q(`Punto inicial → ${L.fecha} (${j(k)})`),a(),T()})}function z(C){const M=t.store.get("accounts").filter(T=>T.activo);if(M.length===0)return q("No hay cuentas activas","err");const E=e(),F=M.map(T=>`• ${T.nombre}: ${j(S(T)??T.saldoInicial??0)}`).join(`
`);if(Z(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${E})?

${F}

Esto recalibra el punto de arranque del dashboard.`)){for(const T of M)t.store.updateItem("accounts",T._id,{saldoInicial:S(T)??T.saldoInicial??0,fechaInicialSaldo:E});q("Saldo base actualizado"),a(),C()}}function _(C,M,E){R(C,"[data-nueva-acc]",()=>x(null,M)),R(C,"[data-editar-acc]",F=>x(F.getAttribute("data-editar-acc"),M)),R(C,"[data-tramos-ganancias]",()=>E.abrir()),R(C,"[data-reset-base]",()=>z(M)),R(C,"[data-hist-acc]",F=>w(F.getAttribute("data-hist-acc"),M)),R(C,"[data-principal-acc]",F=>{const T=F.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(N=>({...N,esCuentaPrincipal:N._id===T}))),q("Cuenta marcada como principal"),a(),M()}),R(C,"[data-borrar-acc]",F=>{const T=F.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return q("Debe existir al menos una cuenta","err");if(!Z("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",T);const P=t.store.get("accounts");P.length>0&&!P.some(B=>B.esCuentaPrincipal)&&t.store.set("accounts",P.map((B,L)=>L===0?{...B,esCuentaPrincipal:!0}:B)),q("Cuenta eliminada"),a(),M()}),R(C,"[data-inv-modo]",F=>{const[T,N]=(F.getAttribute("data-inv-modo")||"").split("|");n.set(T,N==="real"?"real":"proyeccion"),M()}),$.wire(C,M)}let D=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:Ar,mount(C){const M=()=>f(C);D??(D=$r({store:t.store,onDatosCambiados:()=>{a(),M()},año:()=>Number(e().slice(0,4))})),f(C),C.dataset.wired!=="1"&&(_(C,M,D),C.dataset.wired="1")}}}const ot=(t,e,a="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${a};font-size:12px;padding:5px 10px">${c(j(e))}</td>
  </tr>`,oa=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${c(t)}</td></tr>`;function _o(t){const a=t.capMobiliario!==0||t.gananciasFondos!==0?`${ot("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
       ${ot("Ganancias patrimoniales (fondos/acciones)",t.gananciasFondos,t.gananciasFondos>=0?"var(--text)":"var(--green)",!0)}`:'<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>',o=t.resultado>0?"var(--red)":"var(--green)",n=t.resultado>0?"🔴 A PAGAR":"🟢 A DEVOLVER";return`
    <table style="width:100%;border-collapse:collapse">
      ${oa("RENDIMIENTOS DEL TRABAJO")}
      ${ot("Ingresos íntegros del trabajo",t.brutoTotal,"var(--text)",!0)}
      ${t.flexTotal>0?ot("− Retribución flexible exenta (Art. 42 LIRPF)",-t.flexTotal,"var(--green)",!0):""}
      ${t.flexTotal>0?ot("= Ingresos sujetos a IRPF",t.brutoIRPF):""}
      ${ot("− Cotizaciones SS (≈6,35 %)",-t.cotizSS,"var(--red)",!0)}
      ${ot("− Gastos deducibles (Art. 19.2 LIRPF)",-t.gastosArt19,"var(--red)",!0)}
      ${ot("= Rendimiento neto trabajo",t.RNT)}
      ${ot("− Reducción Art. 20 LIRPF",-t.reducArt20,"var(--green)",!0)}
      ${t.deducPP>0?ot(`− Aportaciones a planes de pensiones (${c(j(t.aportPP))}, límite ${c(j(t.limPP))})`,-t.deducPP,"var(--green)",!0):""}
      ${t.otrosIngresos>0?ot("+ Otros ingresos sujetos a IRPF",t.otrosIngresos,"var(--text)",!0):""}
      ${t.capInmobiliario!==0?ot("+ Capital inmobiliario neto",t.capInmobiliario,t.capInmobiliario>=0?"var(--text)":"var(--green)",!0):""}
      ${t.otrasCorto!==0?ot("± Otras ganancias a corto plazo",t.otrasCorto,"var(--text)",!0):""}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE GENERAL</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(j(t.baseGeneral))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota IRPF base general</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(j(t.cuotaGen))}</td>
      </tr>

      ${oa("BASE DEL AHORRO")}
      ${a}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(j(t.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(j(t.cuotaAho))}</td>
      </tr>

      ${oa("RESULTADO")}
      ${ot("Cuota íntegra total",t.cuotaIntegra,"var(--red)")}
      ${ot("− Retenciones en nómina",-t.retNomina,"var(--green)",!0)}
      ${t.retCapital!==0?ot("− Retenciones de capital mobiliario",-t.retCapital,"var(--green)",!0):""}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${n}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${o}">${c(j(Math.abs(t.resultado)))}</td>
      </tr>
    </table>`}const ne=(t,e,a,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${c(e)}</label>
    <input type="number" id="${t}" class="form-input" value="${c(a)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${c(o)}</div>`:""}
  </div>`;function wr(t){const e=t.extras,a=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
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
          ${ne("rex-inmobiliario","Capital inmobiliario neto (alquileres − gastos)",e.capInmobiliario??0)}
          ${ne("rex-mobiliario","Capital mobiliario (dividendos, intereses)",e.capMobiliario??0)}
          ${ne("rex-ganancias","Ganancias / pérdidas patrimoniales (fondos, acciones)",e.gananciasFondos??0,"Positivo = ganancia · Negativo = pérdida compensable")}
          ${ne("rex-otras","Otras ganancias a corto plazo (menos de 1 año)",e.otrasCorto??0)}
          ${ne("rex-ret-cap","Retenciones de capital ya aplicadas",e.retCapital??0,"Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen")}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${t.nominas.length>0?t.nominas.map(o=>`• ${c(o.nombre)}: ${c(j(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${c(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${_o(t.declaracion)}</div>
      </div>
    </div>`}function Po(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((a,o)=>a[0]-o[0]).map(([a,o],n,s)=>{const i=n<s.length-1?s[n+1][0]:null,r=i!==null?`${j(a)} – ${j(i)}`:`Más de ${j(a)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${c(r)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${c(o)}%</td>
      </tr>`}).join("")}
  </table>`}const Cr=(t,e,a)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${c(e)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${a}</div>
  </div>`,ct=(t,e,a="")=>`<div class="stat-card"><div class="stat-label">${c(t)}</div><div class="stat-value ${a}">${c(e)}</div></div>`,yt=(t,e,a="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${c(t)}</span><span class="num ${a}">${c(e)}</span></div>`;function jr(t,e,a){const o=t.filter(l=>(l.modeloFondo||"cuenta")==="inversion");if(o.length===0)return Cr("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let n=0,s=0,i=0;const r=o.map(l=>{const p=Rt(l,e);if(!p)return"";n+=p.saldo,s+=p.costBase,i+=p.impuesto;const h=p.costBase>0?p.plusvalia/p.costBase*100:0,u=(l.escenarioIds||[]).map(d=>`<span class="badge badge-yellow">🔭 ${c(a(d))}</span>`).join("");return`
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${c(l.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${u}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            ${ct("Valor actual",j(p.saldo))}
            ${ct("Coste base (aportado)",j(p.costBase))}
          </div>
          <div class="grid-2" style="gap:8px">
            ${ct(`Plusvalía latente (${h>=0?"+":""}${h.toFixed(1)}%)`,j(p.plusvalia),p.plusvalia>=0?"pos":"neg")}
            ${ct("Imp. ganancias de capital (est.)",j(p.impuesto),"neg")}
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${c(j(p.neto))}</span>
          </div>
        </div>`}).join("");return`
    <div class="card mb-16" style="border:1px solid rgba(99,102,241,0.3)">
      <div class="card-title">Cartera de fondos — resumen</div>
      <div class="grid-3" style="gap:8px;margin-bottom:10px">
        ${ct("Valor total de la cartera",j(n))}
        ${ct("Total aportado (coste base)",j(s))}
        ${ct("Plusvalía latente total",j(n-s),n-s>=0?"pos":"neg")}
      </div>
      <div class="grid-2" style="gap:8px">
        ${ct("Impuesto estimado si se liquida todo",j(i),"neg")}
        ${ct("Neto tras impuestos (cartera completa)",j(n-i),"pos")}
      </div>
    </div>

    ${r}

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
      ${Po(e)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function Er(t){const{nominas:e,planes:a,tramos:o}=t,n=v=>v.grupoNomina?e.filter(y=>(y.grupoNomina||"")===v.grupoNomina):null,s=e.map(v=>({n:v,d:Te(v,n(v),o)})),i=s.reduce((v,y)=>v+y.d.brutoAnual,0),r=s.reduce((v,y)=>v+y.d.irpfAnual,0),l=s.reduce((v,y)=>v+y.d.ssAnual,0),p=s.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':s.map(({n:v,d:y})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${c(v.nombre)}</div>
          ${yt("Bruto anual",j(y.brutoAnual))}
          ${y.flexAnual>0?yt("− Retribución flexible exenta",j(-y.flexAnual),"pos"):""}
          ${yt("− Cotización SS",j(-y.ssAnual),"neg")}
          ${yt(`− IRPF estimado (${y.irpfPct.toFixed(1)} %)`,j(-y.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${c(j(y.baseDineraria-y.ssAnual-y.irpfAnual))}</span>
          </div>
        </div>`).join(""),h=Ma(e,o),u=`${t.hoy.slice(0,4)}-01-01`,d=a.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':a.map(v=>{const y=pe(v);if(!y)return"";const $=(v.aportaciones||[]).filter(m=>m.fecha>=u).reduce((m,I)=>m+I.cantidad,0),f=Math.min($,zt)*h/100,g=$>zt;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${c(v.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${yt("Valor actual",j(y.saldo))}
          ${yt("Coste base (total aportado)",j(y.costBase))}
          ${yt("Revalorización",j(y.beneficio),y.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(t.hoy.slice(0,4))}</div>
            ${yt("Aportado",`${j($)}${g?" ⚠":""}`,g?"neg":"")}
            ${yt("Límite deducible",j(zt))}
            ${yt(`Ahorro IRPF est. (marginal ${h} %)`,j(f),"pos")}
            ${g?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${c(j(zt))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${y.proxDesbloqueo?`· Próx. desbloqueo: ${c(y.proxDesbloqueo)}`:""}
          </div>
        </div>`}).join("");return`
    <div class="card mb-16">
      <div class="card-title mb-10">Nóminas activas — importes anuales</div>
      <div class="grid-4" style="gap:8px;margin-bottom:14px">
        ${ct("Bruto anual total",j(i))}
        ${ct("Cotización SS anual",j(l),"neg")}
        ${ct("IRPF estimado anual",j(r),"neg")}
        ${ct("Neto anual",j(i-l-r),"pos")}
      </div>
      <div class="grid-3">${p}</div>
    </div>

    <div class="card-title mb-8">Planes de pensiones</div>
    <div class="auth-hint mb-14" style="border-color:var(--yellow)">
      💼 <strong>Diferencia clave frente a los fondos de inversión:</strong> el rescate de un plan de pensiones tributa en la
      <strong>base general del IRPF</strong> (tramos ordinarios hasta el 47 %), <em>no</em> en la base del ahorro. Las
      aportaciones son deducibles hasta <strong>${c(j(zt))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${d}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${Po(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const ye=(t,e)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${c(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${c(e)}</div>
  </div>`;function zr(){return`
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
        ${ye("Rendimientos íntegros","Alquileres, subarriendos y cesión de derechos sobre inmuebles")}
        ${ye("Gastos deducibles","IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación")}
        ${ye("Reducción del 60 %","Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)")}
        ${ye("Base general del IRPF","Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.")}
      </div>
    </div>`}const Do=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],Fr="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function _r(t){const e=t.hoy??Y;let a="declaracion",o={};const n=()=>t.store.get("config"),s=()=>Number(e().slice(0,4)),i=()=>t.store.get("nominas").filter(g=>g.activo),r=()=>t.store.get("accounts").filter(g=>(g.modeloFondo||"cuenta")==="pension"),l=g=>{var m;return((m=t.store.get("escenarios").find(I=>I._id===g))==null?void 0:m.nombre)??g},p=()=>bt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??gt)(s()),h=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??jt)(s());function u(){const g=`${s()}-01-01`,m=t.store.get("nominas").filter(x=>x.activo&&!x.simulacion),I=r().reduce((x,S)=>x+(S.aportaciones||[]).filter(w=>w.fecha>=g).reduce((w,z)=>w+z.cantidad,0),0),b=t.store.get("expenses").filter(x=>x.activo&&x.sujetoIRPF&&x.tipo==="ingreso").reduce((x,S)=>x+Sa(S),0);return Ca({nominas:m,aportacionesPension:I,otrosIngresos:b,extras:o,tramosGeneral:p(),tramosAhorro:h()})}function d(){const g=p(),m=i(),I=M=>M.grupoNomina?m.filter(E=>(E.grupoNomina||"")===M.grupoNomina):null,b=m.map(M=>Te(M,I(M),g)),x=b.reduce((M,E)=>M+E.brutoAnual,0),S=b.reduce((M,E)=>M+E.irpfAnual,0),w=b.reduce((M,E)=>M+E.ssAnual,0),z=t.store.get("accounts").filter(M=>(M.modeloFondo||"cuenta")==="inversion");let _=0,D=0;for(const M of z){const E=Rt(M,h());E&&(_+=E.plusvalia,D+=E.impuesto)}if(x<=0&&z.length===0)return"";const C=(M,E,F)=>`<div class="exec-item"><div class="exec-item-label">${c(M)}</div><div class="exec-item-val ${F}">${c(E)}</div></div>`;return`<div class="exec-summary mb-14">
      ${x>0?C("IRPF trabajo",`${j(S)}/año`,"neg"):""}
      ${x>0?C("Neto trabajo",`${j(x-w-S)}/año`,"pos"):""}
      ${z.length>0?C("Plusvalía latente",j(_),_>=0?"pos":"neg"):""}
      ${z.length>0?C("Imp. potencial (inversión)",j(D),"neg"):""}
    </div>`}function v(){return a==="mobiliario"?jr(t.store.get("accounts"),h(),l):a==="trabajo"?Er({nominas:i(),planes:r(),tramos:p(),hoy:e()}):a==="inmobiliario"?zr():wr({año:s(),extras:o,declaracion:u(),nominas:i().map(g=>({nombre:g.nombre,bruto:g.bruto||0})),planes:r().map(g=>g.nombre)})}function y(g,m){const I=a===g;return`<button data-tab-fisc="${g}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${I?"600":"400"};
      color:${I?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${I?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${c(m)}</button>`}function $(g){const m=g.querySelector("#fisc-tabs"),I=g.querySelector("#fisc-tab-content");m&&(m.innerHTML=Do.map(([b,x])=>y(b,x)).join("")),I&&(I.innerHTML=v())}function A(g){g.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${d()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${Do.map(([m,I])=>y(m,I)).join("")}
      </div>
      <div id="fisc-tab-content">${v()}</div>`}function f(g){R(g,"[data-tab-fisc]",m=>{a=m.getAttribute("data-tab-fisc")||"declaracion",$(g)}),g.addEventListener("input",m=>{var S;if(!((S=m.target)==null?void 0:S.closest("[data-rex]")))return;const b=w=>{var z;return((z=g.querySelector(`#${w}`))==null?void 0:z.value)??"0"};o={capInmobiliario:parseFloat(b("rex-inmobiliario"))||0,capMobiliario:parseFloat(b("rex-mobiliario"))||0,gananciasFondos:parseFloat(b("rex-ganancias"))||0,otrasCorto:parseFloat(b("rex-otras"))||0,retCapital:parseFloat(b("rex-ret-cap"))||0};const x=g.querySelector("#renta-cuadro");x&&(x.innerHTML=_o(u()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:Fr,mount(g){A(g),g.dataset.wired!=="1"&&(f(g),g.dataset.wired="1")}}}const To=()=>globalThis.Chart??null;function Pr(t,e){const a=To();if(!a)return null;const o=e.map(n=>({label:n.label,data:n.puntos.map(s=>({x:s.x,y:s.y})),borderColor:n.esBase?"#6b7280":n.color,backgroundColor:n.esBase?"transparent":`${n.color}18`,borderWidth:n.esBase?1.5:2,...n.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new a(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:n=>`${n.dataset.label}: ${j(n.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:n=>j(n)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const Dr=()=>To()!==null,Pt=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Tr="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function Rr(t){const e=()=>{var x;return(x=t.onDatosCambiados)==null?void 0:x.call(t)},a=new Set;let o=null;const n=()=>t.store.get("config"),s=()=>t.store.get("escenarios"),i=x=>{var S;return x?((S=s().find(w=>w._id===x))==null?void 0:S.nombre)??x:"Base"};function r(x){const S=n(),w=xa({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(x==null?void 0:x._id)??null),z=a.size>0?w.accounts.filter(M=>!a.has(M._id)):w.accounts,_=a.size>0?z.map(M=>M._id):null,D=x!=null&&x.fechaFin&&x.fechaFin>S.dashboardEnd?x.fechaFin:S.dashboardEnd;return{eventos:Wt({loans:w.loans,expenses:w.expenses,accounts:z,config:{...S,dashboardEnd:D},filtroAccounts:_,nominas:w.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),S.tramos_irpf??gt),resolverTramosGanancias:bt(t.store.get("tramosGananciasCapitalHistorico"),S.tramosGananciasCapital??jt)}),horizonte:D}}function l(x){const S=t.store.get("loans"),w=C=>(C.escenarioIds||[]).includes(x),z=[[S.filter(w).length,"préstamo","préstamos"],[S.flatMap(C=>C.amortizaciones||[]).filter(w).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(w).length,"gasto","gastos"],[t.store.get("accounts").filter(w).length,"cuenta","cuentas"],[t.store.get("nominas").filter(w).length,"nómina","nóminas"]],_=z.reduce((C,[M])=>C+M,0),D=z.filter(([C])=>C>0).map(([C,M,E])=>`${C} ${C===1?M:E}`).join(" · ");return{total:_,texto:D}}function p(x,S){const w=S===x._id,z=x.color||Pt[0],{total:_,texto:D}=l(x._id);return`<div class="card mb-12" style="border-left:3px solid ${c(z)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${c(z)};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${c(x.nombre)}</span>
        ${w?'<span class="badge badge-yellow">● Activo</span>':""}
        ${x.fechaFin?`<span class="badge badge-inactive">📅 ${c(x.fechaFin)}</span>`:""}
        <div class="flex gap-8">
          ${w?'<button class="btn-secondary btn-sm" data-desactivar-esc>Desactivar</button>':`<button class="btn-primary btn-sm" data-activar-esc="${c(x._id)}">Activar</button>`}
          <button class="btn-secondary btn-sm" data-editar-esc="${c(x._id)}">Editar</button>
          <button class="btn-danger btn-sm" data-borrar-esc="${c(x._id)}">✕</button>
        </div>
      </div>
      ${x.descripcion?`<div class="text-sm mb-8" style="color:var(--text2)">${c(x.descripcion)}</div>`:""}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${_===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${c(D)}</span>`}
      </div>
    </div>`}function h(x){const S=n().dashboardEnd,w=Ee(r(null).eventos,S);return`
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
        <tbody>${x.map(_=>{const{eventos:D}=r(_),C=_.fechaFin||S,M=Ee(D,C),E=M!==null&&w!==null?M-w:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c(_.color||Pt[0])};margin-right:6px"></span>
            ${c(_.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${c(C)}</td>
          <td class="num" style="padding:6px 10px">${M!==null?c(j(M)):"—"}</td>
          <td class="num ${E===null?"":E>=0?"pos":"neg"}" style="padding:6px 10px">
            ${E===null?"—":`${E>=0?"+":""}${c(j(E))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function u(){const x=t.store.get("accounts");return x.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${x.map(w=>{const z=a.has(w._id);return`<button data-toggle-cuenta="${c(w._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${z?"var(--border)":"var(--accent)"};
          background:${z?"transparent":"rgba(99,102,241,0.1)"};
          color:${z?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${z?"text-decoration:line-through;":""}">${c(w.nombre)}</button>`}).join("")}
    </div>`}function d(){if(o){try{o.destroy()}catch{}o=null}}function v(x){const S=n(),w=r(null),z=[{label:"Base (sin supuesto)",color:"#6b7280",esBase:!0,puntos:je(w.eventos,S.dashboardStart,S.dashboardEnd)}];return x.forEach((_,D)=>{const{eventos:C,horizonte:M}=r(_);z.push({label:_.nombre,color:_.color||Pt[D%Pt.length],puntos:je(C,S.dashboardStart,M)})}),z}function y(x,S){d();const w=x.querySelector("#chart-comparacion");w&&(o=Pr(w,v(S)))}function $(x){d();const S=new Set(t.store.get("accounts").map(_=>_._id));for(const _ of[...a])S.has(_)||a.delete(_);const w=s(),z=n().escenarioActivo||null;x.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Supuestos</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo supuesto</button></div>
      </div>

      ${z?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${c(i(z))}</span>
                 <span style="font-size:12px;color:var(--text3);margin-left:8px">El dashboard muestra la proyección de este supuesto</span>
               </div>
               <button class="btn-secondary btn-sm" data-desactivar-esc>Volver a base</button>
             </div>`:""}

      ${w.length===0?`<div class="card mb-14" style="padding:20px 24px">
               <div style="font-weight:600;font-size:14px;margin-bottom:8px">¿Qué son los supuestos?</div>
               <div class="text-sm" style="color:var(--text2);line-height:1.7;margin-bottom:12px">
                 Los supuestos sirven para probar <strong>situaciones hipotéticas</strong> sin tocar tu plan base:
                 ¿qué pasaría si amortizas la hipoteca de forma agresiva?, ¿si cambias de trabajo y sube el sueldo?,
                 ¿si abres una inversión nueva?<br><br>
                 <strong>Cómo funciona:</strong>
                 <ol style="margin:8px 0 0 16px;padding:0">
                   <li>Crea un supuesto con un nombre descriptivo.</li>
                   <li>En Préstamos, Gastos, Cuentas o Nóminas, asigna los elementos que pertenecen a él.</li>
                   <li>Actívalo para ver cómo cambia la proyección del Dashboard.</li>
                 </ol>
               </div>
               <button class="btn-primary btn-sm" data-nuevo-esc>+ Crear mi primer supuesto</button>
             </div>
             <div class="card" style="text-align:center;padding:32px;color:var(--text3)">
               <div style="font-size:13px">Una vez creado, asígnale préstamos, gastos o cuentas desde sus secciones, con el selector de «Supuestos» del formulario.</div>
             </div>`:`<div>${w.map(_=>p(_,z)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de supuestos</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${u()}</div>
               ${Dr()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${h(w)}</div>`}`,w.length>0&&y(x,w)}const A=()=>document.getElementById("modal-overlay"),f=()=>document.getElementById("modal-content"),g=()=>{var x;return(x=A())==null?void 0:x.classList.add("hidden")};function m(x,S){const w=x?s().find(C=>C._id===x)??null:null,z=A(),_=f();if(!z||!_)return;const D=(w==null?void 0:w.color)||Pt[0];_.innerHTML=`
      <div class="modal-title">${x?"Editar supuesto":"Nuevo supuesto"}</div>
      <div class="form-group"><label class="form-label">Nombre del supuesto</label>
        <input class="form-input" type="text" id="esc-nombre" value="${c((w==null?void 0:w.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${c((w==null?void 0:w.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${Pt.map(C=>`<div data-color-esc="${C}" style="width:26px;height:26px;border-radius:50%;background:${C};cursor:pointer;
              border:2px solid ${C===D?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${c(D)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${c((w==null?void 0:w.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${c(x??"")}">${x?"Guardar cambios":"Crear escenario"}</button>
      </div>`,z.classList.remove("hidden"),R(_,"[data-cancelar]",g),R(_,"[data-color-esc]",C=>{const M=C.getAttribute("data-color-esc");_.querySelector("#esc-color").value=M;for(const E of _.querySelectorAll("[data-color-esc]"))E.style.border=E.getAttribute("data-color-esc")===M?"2px solid white":"2px solid transparent"}),R(_,"[data-guardar-esc]",C=>{const M=_.querySelector("#esc-nombre").value.trim();if(!M)return q("El nombre es obligatorio","err");const E={nombre:M,fechaFin:_.querySelector("#esc-fecha-fin").value||null,color:_.querySelector("#esc-color").value||Pt[0],descripcion:_.querySelector("#esc-desc").value.trim()},F=C.getAttribute("data-guardar-esc")||"";F?(t.store.updateItem("escenarios",F,E),q("Escenario actualizado")):(t.store.addItem("escenarios",E),q("Escenario creado")),e(),g(),S()})}function I(x,S){if(!Z("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const w=z=>z.map(_=>({..._,escenarioIds:(_.escenarioIds||[]).filter(D=>D!==x)}));t.store.set("loans",w(t.store.get("loans")).map(z=>({...z,amortizaciones:w(z.amortizaciones||[])}))),t.store.set("expenses",w(t.store.get("expenses"))),t.store.set("nominas",w(t.store.get("nominas"))),t.store.set("accounts",w(t.store.get("accounts"))),n().escenarioActivo===x&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",x),q("Escenario eliminado"),e(),S()}function b(x,S){R(x,"[data-nuevo-esc]",()=>m(null,S)),R(x,"[data-editar-esc]",w=>m(w.getAttribute("data-editar-esc"),S)),R(x,"[data-borrar-esc]",w=>I(w.getAttribute("data-borrar-esc"),S)),R(x,"[data-activar-esc]",w=>{const z=w.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:z}),q(`Escenario "${i(z)}" activado`),e(),S()}),R(x,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),q("Volviendo a la realidad base"),e(),S()}),R(x,"[data-toggle-cuenta]",w=>{const z=w.getAttribute("data-toggle-cuenta");a.has(z)?a.delete(z):a.add(z);const _=x.querySelector("#esc-pastillas");_&&(_.innerHTML=u());const D=s(),C=x.querySelector("#esc-comparativa");C&&(C.innerHTML=h(D)),y(x,D)})}return{id:"escenarios",route:"escenarios",nombre:"Supuestos",flagId:"supuestos",seccion:2,iconoPath:Tr,mount(x){const S=()=>$(x);$(x),x.dataset.wired!=="1"&&(b(x,S),x.dataset.wired="1")},unmount(){d()}}}const Nr=1e-12,Ro=t=>Math.abs(t)<Nr,No=t=>t/12;function Or(t,e,a,o){if(a<=0)return Math.max(0,Math.ceil(t-e));const n=t-e;if(n<=0)return 0;const s=No(o);if(Ro(s))return Math.ceil(n/a);const i=Math.pow(1+s,a),r=(t-e*i)*s/(i-1);return r<=0?0:Math.ceil(r)}function qr(t,e){const a=No(e);return Ro(a)?0:Math.round(t*a)}function Oo({rentaNetaMensual:t,tasaRetiroSeguro:e,tipoFiscalEfectivo:a}){if(e<=0)throw new RangeError("La tasa de retiro seguro tiene que ser mayor que cero.");if(a>=1)throw new RangeError("El tipo fiscal efectivo no puede llegar al 100 %.");const o=Math.round(t*12/(1-a));return{retiroBrutoAnual:o,capitalNecesario:Math.round(o/e)}}function qo(t,e){const[a,o]=t.split("-").map(Number),n=a*12+(o-1)+e,s=Math.floor(n/12),i=n%12+1;return`${s}-${String(i).padStart(2,"0")}`}function sa(t,e){const[a,o]=t.split("-").map(Number),[n,s]=e.split("-").map(Number);return(n-a)*12+(s-o)}const Lo=t=>Number(t.slice(0,4));function xe(t){return t.rentaDeseada?Oo(t.rentaDeseada).capitalNecesario:t.importeObjetivo??0}const Lr={_id:"__sin_vehiculo__"};function $e(t){var g,m,I;const e=Math.max(0,Math.floor(t.horizonteMeses)),a=new Map(t.vehiculos.map(b=>[b._id,b])),o=[...t.objetivos].sort((b,x)=>b.prioridad-x.prioridad).map(b=>({def:b,objetivo:xe(b),saldo:b.saldoActual,estado:xe(b)>0&&b.saldoActual>=xe(b)&&b.modoAsignacion!=="ABSORBE_RESIDUAL"?"COMPLETADO":"PENDIENTE",vehiculo:a.get(b.vehiculoId),aportadoEnAño:0,añoEnCurso:Lo(t.fechaInicio),ultimaSolicitud:0,solicitadoAcumulado:0,mesesReclamando:0})),n=new Map;for(const b of t.eventos){const x=n.get(b.fecha)??[];x.push(b),n.set(b.fecha,x)}const s=[],i=[],r=[];let l=t.perfil.netoMensual,p=t.perfil.gastosFijosMensuales,h=0,u=0;const d=[];for(let b=0;b<e;b++){const x=qo(t.fechaInicio,b),S=Lo(x);for(const P of n.get(x)??[])if(P.tipo==="CAMBIO_INGRESOS")l=P.importe;else if(P.tipo==="CAMBIO_GASTOS_FIJOS")p=P.importe;else if(P.tipo==="NUEVA_DEUDA")p+=P.importe;else if(P.tipo==="INYECCION_CAPITAL"){const B=P.objetivoDestinoId?o.find(L=>L.def._id===P.objetivoDestinoId):void 0;B?B.saldo+=P.importe:l+=P.importe}for(const P of o)P.añoEnCurso!==S&&(P.añoEnCurso=S,P.aportadoEnAño=0);const w=Math.max(0,l-p),z=Math.round(w*Br(t.pctDisfrute));let _=w-z;const D=_,C=o.filter(P=>P.estado!=="COMPLETADO"),M=[];let E=0;const F=C.filter(P=>P.def.modoAsignacion==="ABSORBE_RESIDUAL"),T=C.filter(P=>P.def.modoAsignacion!=="ABSORBE_RESIDUAL");for(const P of T){const B=kr(P,x,b,t);P.ultimaSolicitud=B,B>0&&(P.solicitadoAcumulado+=B,P.mesesReclamando+=1),(P.def.modoAsignacion==="CUOTA_POR_FECHA"||P.def.modoAsignacion==="FIJO")&&(E+=B);const L=Math.max(0,Math.min(B,_));_-=L,P.saldo+=L,P.aportadoEnAño+=L,h+=L,L>0&&P.estado==="PENDIENTE"&&(P.estado="EN_CURSO"),M.push({objetivoId:P.def._id,asignado:L,solicitado:B,saldoTrasMes:P.saldo})}if(F.length>0&&_>0){const P=F.map(k=>Math.max(0,k.def.pesoResidual??1)),B=P.reduce((k,O)=>k+O,0)||F.length;let L=0;F.forEach((k,O)=>{const H=O===F.length-1?_-L:Math.floor(_*P[O]/B);L+=H,k.saldo+=H,k.aportadoEnAño+=H,h+=H,H>0&&k.estado==="PENDIENTE"&&(k.estado="EN_CURSO"),M.push({objetivoId:k.def._id,asignado:H,solicitado:0,saldoTrasMes:k.saldo})}),_-=L}else for(const P of F)M.push({objetivoId:P.def._id,asignado:0,solicitado:0,saldoTrasMes:P.saldo});E>D&&d.push({mes:x,deficit:E-D});for(const P of o)P.saldo<=0||(P.saldo+=qr(P.saldo,((g=P.vehiculo)==null?void 0:g.rentabilidadRealAnual)??0));for(const P of o)P.estado!=="COMPLETADO"&&(P.def.modoAsignacion==="ABSORBE_RESIDUAL"&&P.objetivo<=0||P.objetivo>0&&P.saldo>=P.objetivo&&(P.estado="COMPLETADO",i.push({objetivoId:P.def._id,nombre:P.def.nombre,mes:x,indice:b,importeFinal:P.saldo,cuotaLiberada:P.ultimaSolicitud})));for(const P of o)M.some(B=>B.objetivoId===P.def._id)||M.push({objetivoId:P.def._id,asignado:0,solicitado:0,saldoTrasMes:P.saldo});const N=o.reduce((P,B)=>P+B.saldo,0);if(u+=z,s.push({indice:b,mes:x,netoMensual:l,gastosFijos:p,sobrante:w,disfrute:z,disponible:D,sinAsignar:_,asignaciones:M.sort((P,B)=>Bo(o,P.objetivoId)-Bo(o,B.objetivoId)),patrimonioTotal:N}),o.length>0&&o.every(P=>P.estado==="COMPLETADO"))break}const v=[];if(d.length>0){const b=Math.round(d.reduce((x,S)=>x+S.deficit,0)/d.length);r.push({severidad:"error",codigo:"INVIABLE",mensaje:`El plan no cabe en el flujo de caja durante ${d.length} mes${d.length!==1?"es":""} (desde ${d[0].mes}). Déficit medio: ${(b/100).toFixed(2)} €/mes.`,mes:d[0].mes,deficitMensual:b});for(const x of o)x.estado!=="COMPLETADO"&&x.def.fechaLimite&&x.def.modoAsignacion==="CUOTA_POR_FECHA"&&(x.estado="INVIABLE");v.push(...Gr(o,t,b))}for(const b of o){const x=(m=b.vehiculo)==null?void 0:m.topeAportacionAnual;x&&b.def.modoAsignacion==="FIJO"&&(b.def.importeFijoMensual??0)*12>x&&r.push({severidad:"atencion",codigo:"TOPE_FISCAL",objetivoId:b.def._id,mensaje:`«${b.def.nombre}» pide ${((b.def.importeFijoMensual??0)/100).toFixed(2)} €/mes, que supera el tope anual de ${(x/100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`})}for(const b of o)b.estado!=="COMPLETADO"&&b.objetivo>0&&b.def.modoAsignacion!=="ABSORBE_RESIDUAL"&&r.push({severidad:"atencion",codigo:"NUNCA_COMPLETADO",objetivoId:b.def._id,mensaje:`«${b.def.nombre}» no se completa dentro del horizonte de ${e} meses.`});const y=o.find(b=>b.def.tipo==="INVERSION_PERPETUA"),$=y?i.find(b=>b.objetivoId===y.def._id):void 0,A={};for(const b of o){const x=((I=b.vehiculo)==null?void 0:I._id)??Lr._id;A[x]=(A[x]??0)+b.saldo}const f={};for(const b of o)f[b.def._id]=b.estado;return{viable:d.length===0,mesesSimulados:s.length,serieMensual:s,hitos:i,fases:Hr(s,i),avisos:r,propuestas:v,estadoFinal:f,resumen:{patrimonioFinal:o.reduce((b,x)=>b+x.saldo,0),patrimonioPorVehiculo:A,totalAportado:h,totalDisfrute:u,mesIndependencia:($==null?void 0:$.mes)??null}}}const Br=t=>Number.isFinite(t)?Math.min(1,Math.max(0,t)):0,Bo=(t,e)=>t.findIndex(a=>a.def._id===e);function kr(t,e,a,o){var s,i;const n=Math.max(0,t.objetivo-t.saldo);switch(t.def.modoAsignacion){case"ABSORBE_TODO":return n;case"FIJO":{const r=t.def.importeFijoMensual??0,l=(s=t.vehiculo)==null?void 0:s.topeAportacionAnual;if(!l)return t.objetivo>0?Math.min(r,n):r;const p=Math.max(0,l-t.aportadoEnAño),h=Math.min(r,p);return t.objetivo>0?Math.min(h,n):h}case"CUOTA_POR_FECHA":{if(n<=0)return 0;const r=t.def.fechaLimite?sa(e,t.def.fechaLimite):o.horizonteMeses-a;return Or(t.objetivo,t.saldo,Math.max(0,r),((i=t.vehiculo)==null?void 0:i.rentabilidadRealAnual)??0)}default:return 0}}function Hr(t,e){if(t.length===0)return[];const o=[0,...[...new Set(e.map(s=>s.indice))].sort((s,i)=>s-i).map(s=>s+1)].filter((s,i,r)=>r.indexOf(s)===i&&s<t.length),n=[];for(let s=0;s<o.length;s++){const i=o[s],r=(s+1<o.length?o[s+1]:t.length)-1;if(r<i)continue;const l=new Set;for(let p=i;p<=r;p++)for(const h of t[p].asignaciones)h.asignado>0&&l.add(h.objetivoId);n.push({desde:t[i].mes,hasta:t[r].mes,meses:r-i+1,objetivosActivos:[...l]})}return n}function Gr(t,e,a){const o=[],n=Math.max(0,e.perfil.netoMensual-e.perfil.gastosFijosMensuales);if(n>0&&e.pctDisfrute>0){const l=Math.ceil(Math.min(e.pctDisfrute,a/n)*100);if(l>0){const p=Math.round(e.pctDisfrute*100);o.push({clase:"REDUCIR_DISFRUTE",magnitud:l,mensaje:`Bajar el disfrute ${l} punto${l!==1?"s":""} (del ${p} % al ${Math.max(0,p-l)} %) libera ${(Math.min(a,n*e.pctDisfrute)/100).toFixed(0)} €/mes.`})}}const s=t.filter(l=>l.def.modoAsignacion==="CUOTA_POR_FECHA"&&l.def.fechaLimite&&l.estado!=="COMPLETADO"),i=l=>l.mesesReclamando>0?l.solicitadoAcumulado/l.mesesReclamando:0,r=[...s].sort((l,p)=>i(p)-i(l))[0];if(r){const l=Math.max(0,r.objetivo-r.saldo),p=i(r),h=Math.max(1,sa(e.fechaInicio,r.def.fechaLimite)),u=Math.max(1,p-a),d=Math.ceil(l/u),v=Math.max(1,d-h);o.push({clase:"RETRASAR_FECHA",objetivoId:r.def._id,magnitud:v,mensaje:`Retrasar «${r.def.nombre}» ${v} mes${v!==1?"es":""}, hasta ${qo(r.def.fechaLimite,v)}, baja su cuota a lo que cabe en el flujo.`});const y=Math.min(Math.round(a*h),Math.max(0,r.objetivo-1));y>0&&o.push({clase:"REDUCIR_IMPORTE",objetivoId:r.def._id,magnitud:y,mensaje:`O reducir «${r.def.nombre}» en ${(y/100).toFixed(0)} €, de ${(r.objetivo/100).toFixed(0)} € a ${((r.objetivo-y)/100).toFixed(0)} €.`})}return s.length>1&&o.push({clase:"REORDENAR",magnitud:s.length,mensaje:`Hay ${s.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`}),o.length===0&&o.push({clase:"REDUCIR_IMPORTE",magnitud:a,mensaje:`Faltan ${(a/100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`}),o}const Vr=()=>globalThis.Chart??null,Ie=["#2ee6a8","#4d9fff","#a855f7","#f97316","#eab308","#22d3ee","#fb7185","#34d399"],ko=new WeakMap;function Ur(t,e,a){const o=Vr();if(!o)return null;const n=ko.get(t);if(n)try{n.destroy()}catch{}const s=new Map,i=new Map(e.objetivos.map(v=>[v._id,v.vehiculoId])),r=new Set(e.objetivos.map(v=>v.vehiculoId));for(const v of r)s.set(v,[]);for(const v of a.serieMensual){const y=new Map;for(const $ of v.asignaciones){const A=i.get($.objetivoId);A&&y.set(A,(y.get(A)??0)+$.saldoTrasMes)}for(const $ of r)s.get($).push((y.get($)??0)/100)}const l=v=>{var y;return((y=e.vehiculos.find($=>$._id===v))==null?void 0:y.nombre)??"Sin vehículo"},p=[...r],h=p.map((v,y)=>a.serieMensual.map(($,A)=>p.slice(0,y+1).reduce((f,g)=>f+(s.get(g)[A]??0),0))),u=p.map((v,y)=>({label:l(v),data:h[y],borderColor:Ie[y%Ie.length],backgroundColor:`${Ie[y%Ie.length]}33`,fill:y===0?"origin":"-1",borderWidth:1.5,pointRadius:0,tension:.25})),d=new o(t,{type:"line",data:{labels:a.serieMensual.map(v=>v.mes),datasets:u},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#a9b6cc",font:{size:11},boxWidth:12}},tooltip:{backgroundColor:"#111a28",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#a9b6cc",bodyColor:"#eef3fb",callbacks:{label:v=>{const y=v.datasetIndex>0?v.chart.data.datasets[v.datasetIndex-1].data[v.dataIndex]??0:0;return` ${v.dataset.label}: ${j(v.parsed.y-y)}`}}}},scales:{x:{ticks:{color:"#6b7b96",maxTicksLimit:12},grid:{display:!1}},y:{ticks:{color:"#6b7b96",callback:v=>j(v)},grid:{color:"rgba(255,255,255,0.07)"}}}}});return ko.set(t,d),d}const na=t=>j(t/100),Yr={CUOTA_POR_FECHA:"Cuota para llegar a la fecha",ABSORBE_TODO:"Se lleva todo lo disponible",ABSORBE_RESIDUAL:"Recibe lo que sobre",FIJO:"Importe fijo al mes"},Jr={CUOTA_POR_FECHA:"Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.",ABSORBE_RESIDUAL:"No reclama nada; recoge lo que quede tras servir a los de prioridad superior.",FIJO:"Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene."},Ho={COMPLETADO:"var(--accent)",EN_CURSO:"var(--text)",PENDIENTE:"var(--text3)",INVIABLE:"var(--red)"};function Wr(t,e){if(t.objetivos.length===0)return`<div class="card" style="text-align:center;padding:34px 20px">
      <div style="font-size:26px;margin-bottom:10px">🎯</div>
      <div class="card-title" style="margin-bottom:6px">Todavía no hay objetivos</div>
      <div class="text-sm" style="color:var(--text2);max-width:52ch;margin:0 auto;line-height:1.7">
        Un objetivo es algo a lo que quieres llegar —amortizar el coche, la entrada de un piso, un colchón—
        con un importe y, si la tiene, una fecha. Compiten por el mismo dinero cada mes, y cuando uno se
        completa su cuota pasa sola al siguiente.
      </div>
    </div>`;const a=[...t.objetivos].sort((s,i)=>s.prioridad-i.prioridad),o=e.serieMensual[0],n=s=>t.vehiculos.find(i=>i._id===s);return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      El orden es la <strong>prioridad</strong>: el de arriba se sirve primero y los de abajo reciben lo que quede.
      La columna «pide ahora» es lo que cada objetivo está reclamando este mes.
      <br>Arrastra las tarjetas para reordenarlas.
    </div>
    ${a.map(s=>{var i;return Qr(s,e,o,(i=n(s.vehiculoId))==null?void 0:i.nombre)}).join("")}`}function Qr(t,e,a,o){const n=xe(t),s=e.estadoFinal[t._id]??t.estado,i=a==null?void 0:a.asignaciones.find(u=>u.objetivoId===t._id),r=(i==null?void 0:i.solicitado)??0,l=e.hitos.find(u=>u.objetivoId===t._id),p=n>0?Math.min(100,t.saldoActual/n*100):0,h=e.avisos.filter(u=>u.objetivoId===t._id);return`
    <div class="card mb-10" draggable="true" data-pl-objetivo="${c(t._id)}"
         style="padding:14px 16px;border-left:3px solid ${Ho[s]??"var(--text3)"};cursor:grab">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span title="Arrastra para cambiar la prioridad" style="color:var(--text3);cursor:grab;user-select:none">⠿</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3)">#${c(t.prioridad)}</span>
            <span style="font-weight:700;font-size:14px">${c(t.nombre)}</span>
            <span class="badge" style="font-size:10px;background:var(--bg3);color:var(--text2)">${c(Yr[t.modoAsignacion])}</span>
            ${s==="INVIABLE"?'<span class="badge badge-red" style="font-size:10px">no llega</span>':""}
            ${s==="COMPLETADO"?'<span class="badge badge-green" style="font-size:10px">completado</span>':""}
          </div>
          <div class="text-sm" style="color:var(--text3);margin-top:4px">${c(Jr[t.modoAsignacion])}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:17px;font-weight:700">${c(n>0?na(n):"— sin meta —")}</div>
          ${t.fechaLimite?`<div class="text-sm" style="color:var(--text3)">para ${c(t.fechaLimite)}</div>`:""}
          <button class="btn-secondary btn-sm" data-pl-editar-objetivo="${c(t._id)}" style="margin-top:6px;font-size:11px;padding:2px 9px">Editar</button>
        </div>
      </div>

      ${n>0?`<div class="goal-bar" style="margin-top:10px"><div class="goal-bar-fill" style="width:${p.toFixed(1)}%;background:${Ho[s]??"var(--accent)"}"></div></div>`:""}

      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:12px">
        <div><span style="color:var(--text3)">Pide ahora:</span> <strong style="font-family:var(--font-mono)">${c(na(r))}</strong>/mes</div>
        <div><span style="color:var(--text3)">Ya acumulado:</span> <span style="font-family:var(--font-mono)">${c(na(t.saldoActual))}</span></div>
        ${o?`<div><span style="color:var(--text3)">Vehículo:</span> ${c(o)}</div>`:""}
        ${l?`<div><span style="color:var(--text3)">Se completa:</span> <strong style="color:var(--accent)">${c(l.mes)}</strong></div>`:""}
      </div>

      ${h.length>0?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${h.map(u=>`⚠ ${c(u.mensaje)}`).join("<br>")}
             </div>`:""}
      ${t.notas?`<div class="text-sm" style="color:var(--text3);margin-top:8px;white-space:pre-wrap">${c(t.notas)}</div>`:""}
    </div>`}const dt=t=>(t/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}),Go=[{id:"venta-vivienda",nombre:"Venta de vivienda",icono:"🏠",descripcion:"Lo que queda de verdad tras cancelar la hipoteca y pagar impuestos y gastos. Suele ser bastante menos que el precio de venta.",tipo:"INYECCION_CAPITAL",campos:[{id:"precio",etiqueta:"Precio de venta (€)",ayuda:"Lo que te paga el comprador"},{id:"hipoteca",etiqueta:"Hipoteca pendiente (€)",ayuda:"Capital vivo el día de la firma"},{id:"gastos",etiqueta:"Impuestos y gastos (€)",ayuda:"Plusvalía municipal, IRPF de la ganancia, agencia, notaría"}],calcular:t=>Math.max(0,(t.precio??0)-(t.hipoteca??0)-(t.gastos??0)),resumir:t=>`Venta ${dt(t.precio??0)} € − hipoteca ${dt(t.hipoteca??0)} € − gastos ${dt(t.gastos??0)} €`},{id:"nueva-hipoteca",nombre:"Nueva hipoteca",icono:"🔑",descripcion:"Sube tus gastos fijos con la cuota nueva. Normalmente va en la misma fecha que la venta.",tipo:"NUEVA_DEUDA",campos:[{id:"cuota",etiqueta:"Cuota mensual (€)",ayuda:"Se suma a tus gastos fijos a partir de ese mes"}],calcular:t=>t.cuota??0,resumir:t=>`Cuota de ${dt(t.cuota??0)} €/mes`},{id:"hijo",nombre:"Llegada de un hijo",icono:"👶",descripcion:"Fija tus gastos fijos en un valor nuevo. Si el gasto sube por etapas, crea varios eventos seguidos.",tipo:"CAMBIO_GASTOS_FIJOS",campos:[{id:"actuales",etiqueta:"Gastos fijos actuales (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"incremento",etiqueta:"Incremento mensual (€)",ayuda:"Guardería, ropa, sanidad…"}],calcular:t=>(t.actuales??0)+(t.incremento??0),resumir:t=>`Gastos fijos ${dt(t.actuales??0)} € → ${dt((t.actuales??0)+(t.incremento??0))} €/mes`},{id:"subida-sueldo",nombre:"Subida de sueldo",icono:"📈",descripcion:"Fija tu neto mensual en un valor nuevo desde ese mes.",tipo:"CAMBIO_INGRESOS",campos:[{id:"actual",etiqueta:"Neto mensual actual (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"subida",etiqueta:"Subida mensual neta (€)",ayuda:"Lo que te llega a la cuenta, no el bruto"}],calcular:t=>(t.actual??0)+(t.subida??0),resumir:t=>`Neto ${dt(t.actual??0)} € → ${dt((t.actual??0)+(t.subida??0))} €/mes`},{id:"inyeccion",nombre:"Entrada de dinero",icono:"💰",descripcion:"Una herencia, un bonus, la venta de un coche. Puede ir dirigida a un objetivo concreto.",tipo:"INYECCION_CAPITAL",campos:[{id:"importe",etiqueta:"Importe (€)"}],calcular:t=>t.importe??0,resumir:t=>`Entrada de ${dt(t.importe??0)} €`}],Kr=t=>Go.find(e=>e.id===t);function Xr(t,e){switch(t.tipo){case"INYECCION_CAPITAL":return`Entra ${dt(t.importe)} €${e?` → «${e}»`:" al reparto general"}`;case"CAMBIO_INGRESOS":return`El neto mensual pasa a ${dt(t.importe)} €`;case"CAMBIO_GASTOS_FIJOS":return`Los gastos fijos pasan a ${dt(t.importe)} €/mes`;case"NUEVA_DEUDA":return`Los gastos fijos suben ${dt(t.importe)} €/mes`}}function Zr(t,e,a,o){const n=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,s=new Map(t.vehiculos.map(r=>[r._id,`veh_${n()}`])),i=new Map(t.objetivos.map(r=>[r._id,`obj_${n()}`]));return{...t,_id:a,nombre:e,activo:!1,creadoEn:o,vehiculos:t.vehiculos.map(r=>({...r,_id:s.get(r._id)})),objetivos:t.objetivos.map(r=>({...r,_id:i.get(r._id),vehiculoId:s.get(r.vehiculoId)??r.vehiculoId})),eventos:t.eventos.map(r=>({...r,_id:`ev_${n()}`,objetivoDestinoId:r.objetivoDestinoId?i.get(r.objetivoDestinoId)??null:null}))}}function tl(t){return[...new Set(t.flatMap(a=>a.hitos.map(o=>o.nombre)))].map(a=>{const o=t.map(i=>i.hitos.find(r=>r.nombre===a)??null),n=o.map(i=>i?i.indice:null),s=n[0];return{nombre:a,meses:o.map(i=>i?i.mes:null),diferencias:n.map(i=>i!==null&&s!==null?i-s:null)}})}const el=t=>j(t/100),al={INYECCION_CAPITAL:"💰",CAMBIO_GASTOS_FIJOS:"🏷️",CAMBIO_INGRESOS:"📈",NUEVA_DEUDA:"🔑"};function ol(t){const e=[...t.eventos].sort((o,n)=>o.fecha.localeCompare(n.fecha)),a=o=>{var n;return o?(n=t.objetivos.find(s=>s._id===o))==null?void 0:n.nombre:void 0};return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      Los eventos son los cambios de vida que mueven el plan de verdad: una venta, una hipoteca nueva, un hijo,
      un ascenso. Se aplican <strong>al principio del mes</strong> que indiques.
    </div>

    <div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Añadir</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${Go.map(o=>`<button class="btn-secondary btn-sm" data-pl-plantilla="${c(o.id)}"
            style="display:flex;align-items:center;gap:6px;padding:7px 12px">
            <span style="font-size:14px">${o.icono}</span>
            <span style="font-size:12px">${c(o.nombre)}</span>
          </button>`).join("")}
      </div>
    </div>

    ${e.length===0?`<div class="card" style="text-align:center;padding:30px 20px">
             <div style="font-size:24px;margin-bottom:8px">📅</div>
             <div class="text-sm" style="color:var(--text2);max-width:50ch;margin:0 auto;line-height:1.7">
               Todavía no hay eventos. Sin ellos el plan asume que tus ingresos y tus gastos se quedan como están
               durante todo el horizonte, cosa que no pasa nunca.
             </div>
           </div>`:`<div class="card">
             <div class="card-title mb-12">Línea temporal (${e.length})</div>
             ${e.map(o=>sl(o,t,a(o.objetivoDestinoId))).join("")}
           </div>`}`}function sl(t,e,a){const o=sa(e.fechaInicio,t.fecha),n=o<0?"antes del inicio del plan":o===0?"en el primer mes":`dentro de ${o} mes${o!==1?"es":""}`,s=o<0||o>=e.horizonteMeses;return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:16px;flex-shrink:0;width:24px;text-align:center">${al[t.tipo]}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--accent)">${c(t.fecha)}</span>
          <span style="font-size:11px;color:var(--text3)">${c(n)}</span>
          ${s?'<span class="badge badge-yellow" style="font-size:10px">fuera del horizonte</span>':""}
        </div>
        <div style="font-size:12px;margin-top:3px">${c(Xr(t,a))}</div>
        ${t.notas?`<div style="font-size:11px;color:var(--text3);margin-top:2px">${c(t.notas)}</div>`:""}
      </div>
      <div style="display:flex;gap:5px;flex-shrink:0">
        <button class="btn-secondary btn-sm" data-pl-editar-evento="${c(t._id)}" style="font-size:11px;padding:2px 9px">Editar</button>
      </div>
    </div>`}function nl(t,e,a,o){const n=t.campos.map(i=>{const r=o[i.id];return`<div class="form-group">
        <label class="form-label" for="ev-${c(i.id)}">${c(i.etiqueta)}</label>
        <input class="form-input" type="number" step="0.01" id="ev-${c(i.id)}" value="${r!==void 0?(r/100).toFixed(2):""}">
        ${i.ayuda?`<div class="text-sm mt-4" style="color:var(--text3)">${c(i.ayuda)}</div>`:""}
      </div>`}).join(""),s=[["","— al reparto general —"],...a.objetivos.map(i=>[i._id,i.nombre])];return`
    <div class="text-sm mb-14" style="color:var(--text2);line-height:1.7">${t.icono} ${c(t.descripcion)}</div>

    <div class="form-group">
      <label class="form-label" for="ev-fecha">Mes en que ocurre</label>
      <input class="form-input" type="month" id="ev-fecha" value="${c((e==null?void 0:e.fecha)??a.fechaInicio)}">
    </div>

    ${n}

    <div class="card mb-12" style="background:var(--bg3);padding:10px 12px">
      <div class="text-sm" style="color:var(--text3)">Importe que se aplicará</div>
      <div id="ev-resultado" style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--accent);margin-top:2px">—</div>
    </div>

    ${t.tipo==="INYECCION_CAPITAL"?`<div class="form-group">
             <label class="form-label" for="ev-destino">¿A qué objetivo va?</label>
             <select class="form-input" id="ev-destino">
               ${s.map(([i,r])=>`<option value="${c(i)}"${i===((e==null?void 0:e.objetivoDestinoId)??"")?" selected":""}>${c(r)}</option>`).join("")}
             </select>
             <div class="text-sm mt-4" style="color:var(--text3)">
               Dirigida a un objetivo lo completa antes y libera su cuota; al reparto general entra como ingreso extra de ese mes.
             </div>
           </div>`:""}

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${e?'<button class="btn-secondary" data-ev-borrar style="color:var(--red)">Borrar</button>':""}
      <button class="btn-secondary" data-ev-cancelar>Cancelar</button>
      <button class="btn-primary" data-ev-guardar>${e?"Guardar":"Añadir evento"}</button>
    </div>`}function Vo(t,e){var o;const a={};for(const n of e.campos){const s=((o=t.querySelector(`#ev-${n.id}`))==null?void 0:o.value)??"",i=parseFloat(String(s).replace(",","."));a[n.id]=Number.isFinite(i)?Math.round(i*100):0}return a}const il=(t,e)=>el(t.calcular(e)),rl=[-2,-1,0,1,2],ll=[-10,0,10],cl=[-20,0,20];function Uo(t){return t.hitos.length===0?null:Math.max(...t.hitos.map(e=>e.indice))}function dl(t,e,a,o,n){const s={};for(const l of o.hitos)s[l.objetivoId]=l.mes;const i=Uo(o),r=n?Uo(n):i;return{etiqueta:t,delta:e,esBase:a,viable:o.viable,hitos:s,desplazamientoMeses:i!==null&&r!==null?i-r:null,patrimonioFinal:o.resumen.patrimonioFinal}}function ul(t,e,a){if(a===0)return t;switch(e){case"rentabilidad":return{...t,vehiculos:t.vehiculos.map(o=>({...o,rentabilidadRealAnual:Math.max(0,o.rentabilidadRealAnual+a/100)}))};case"disfrute":return{...t,pctDisfrute:Math.min(1,Math.max(0,t.pctDisfrute+a/100))};case"ingresos":return{...t,perfil:{...t.perfil,netoMensual:Math.max(0,Math.round(t.perfil.netoMensual*(1+a/100)))}}}}const pl=t=>t>0?`+${t}`:String(t);function ia(t,e,a,o,n,s){const i=$e(t),r=n.map(l=>dl(l===0?"Plan actual":`${pl(l)} ${s}`,l,l===0,l===0?i:$e(ul(t,e,l)),i));return{palanca:e,titulo:a,descripcion:o,variantes:r}}function ml(t){return[ia(t,"rentabilidad","Rentabilidad de los vehículos","Mueve la rentabilidad real de todos los vehículos a la vez. Es la palanca que menos controlas.",rl,"puntos"),ia(t,"disfrute","Porcentaje de disfrute","Lo que apartas para gastar en vez de asignar a objetivos. Es la palanca que más controlas.",ll,"puntos"),ia(t,"ingresos","Ingresos","Un ascenso, un cambio de trabajo o una reducción de jornada.",cl,"%")]}function fl(t){if(t===null)return"no comparable";if(t===0)return"sin cambio";const e=Math.abs(t),a=Math.floor(e/12),o=e%12,n=[a>0?`${a} año${a!==1?"s":""}`:"",o>0?`${o} mes${o!==1?"es":""}`:""].filter(Boolean).join(" y ");return t<0?`${n} antes`:`${n} más tarde`}const Yo=t=>j(t/100);function vl(t,e,a){return`
    ${gl(t,e)}
    ${t.length>1?bl(t):""}
    ${hl(a)}`}function gl(t,e){return`<div class="card mb-14">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Planes (${t.length})</span>
      <div class="flex gap-8 flex-wrap">
        <button class="btn-secondary btn-sm" data-pl-duplicar>Duplicar el activo</button>
        <button class="btn-secondary btn-sm" data-pl-exportar>Exportar JSON</button>
        <button class="btn-secondary btn-sm" data-pl-importar>Importar JSON</button>
      </div>
    </div>

    ${t.map(a=>{const o=a._id===e;return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);flex-wrap:wrap">
        <div style="flex:1;min-width:180px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-weight:600;font-size:13px">${c(a.nombre)}</span>
            ${o?'<span class="badge badge-green" style="font-size:10px">activo</span>':""}
          </div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">
            ${a.objetivos.length} objetivo${a.objetivos.length!==1?"s":""} ·
            ${a.eventos.length} evento${a.eventos.length!==1?"s":""} ·
            desde ${c(a.fechaInicio)}${a.creadoEn?` · creado ${c(a.creadoEn)}`:""}
          </div>
        </div>
        <div class="flex gap-5 flex-wrap">
          ${o?"":`<button class="btn-secondary btn-sm" data-pl-activar="${c(a._id)}" style="font-size:11px;padding:2px 9px">Usar este</button>`}
          <button class="btn-secondary btn-sm" data-pl-renombrar="${c(a._id)}" style="font-size:11px;padding:2px 9px">Renombrar</button>
          ${t.length>1?`<button class="btn-secondary btn-sm" data-pl-borrar-plan="${c(a._id)}" style="font-size:11px;padding:2px 9px;color:var(--red)">Borrar</button>`:""}
        </div>
      </div>`}).join("")}
  </div>`}function bl(t){const e=t.slice(0,3),a=e.map(r=>({plan:r,res:$e(r)})),o=tl(a.map(({plan:r,res:l})=>({nombre:r.nombre,hitos:l.hitos}))),n=["Hito",...e.map(r=>r.nombre)].map((r,l)=>`<th style="text-align:${l===0?"left":"right"};padding:6px 8px;font-size:11px;color:var(--text3)">${c(r)}</th>`).join(""),s=o.map(r=>`<tr>
      <td style="padding:5px 8px;font-size:12px">${c(r.nombre)}</td>
      ${r.meses.map((l,p)=>{const h=r.diferencias[p],u=h===null||h===0?"var(--text2)":h<0?"var(--accent)":"var(--red)",d=p===0||h===null||h===0?"":`<div style="font-size:10px;color:${u}">${h>0?"+":""}${h} m</div>`;return`<td style="text-align:right;padding:5px 8px;font-family:var(--font-mono);font-size:11px;color:${u}">
            ${c(l??"no llega")}${d}
          </td>`}).join("")}
    </tr>`).join("");return`<div class="card mb-14">
    <div class="card-title mb-10">Comparativa</div>
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">${a.map(({plan:r,res:l})=>`<div style="flex:1;min-width:150px">
      <div style="font-size:11px;color:var(--text3)">${c(r.nombre)}</div>
      <div style="font-family:var(--font-mono);font-size:15px;font-weight:700">${c(Yo(l.resumen.patrimonioFinal))}</div>
      <div style="font-size:10px;color:${l.viable?"var(--accent)":"var(--red)"}">${l.viable?"viable":"no cabe en el flujo"}</div>
    </div>`).join("")}</div>
    ${o.length===0?'<div class="text-sm" style="color:var(--text3)">Ninguno de los planes completa objetivos dentro de su horizonte.</div>':`<div style="overflow-x:auto">
             <table style="width:100%;border-collapse:collapse">
               <thead><tr style="border-bottom:1px solid var(--border2)">${n}</tr></thead>
               <tbody>${s}</tbody>
             </table>
           </div>
           <div class="text-sm mt-8" style="color:var(--text3)">
             Los hitos se emparejan por nombre. La diferencia es respecto al primer plan de la tabla.
           </div>`}
  </div>`}function hl(t){return t?`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Análisis de sensibilidad</span>
      <button class="btn-secondary btn-sm" data-pl-sensibilidad>Recalcular</button>
    </div>
    ${t.map(yl).join("")}
    <div class="text-sm mt-8" style="color:var(--text3);line-height:1.6">
      El desplazamiento es sobre el <strong>último hito</strong> del plan: cuándo terminarías de cumplirlo todo.
    </div>
  </div>`:`<div class="card">
      <div class="card-title mb-8">Análisis de sensibilidad</div>
      <div class="text-sm mb-12" style="color:var(--text2);line-height:1.7">
        Vuelve a simular moviendo una palanca cada vez y te dice cuánto adelanta o retrasa el plan.
        Son diez simulaciones, así que se calcula solo cuando lo pides.
      </div>
      <button class="btn-primary" data-pl-sensibilidad>Calcular</button>
    </div>`}function yl(t){return`<div style="margin-bottom:18px">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px">${c(t.titulo)}</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px">${c(t.descripcion)}</div>
    ${t.variantes.map(e=>{const a=e.desplazamientoMeses,o=a===null?"var(--text3)":a===0?"var(--text2)":a<0?"var(--accent)":"var(--red)";return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 0;font-size:12px;${e.esBase?"border-top:1px solid var(--border);border-bottom:1px solid var(--border);":""}">
        <span style="${e.esBase?"font-weight:700":"color:var(--text2)"}">${c(e.etiqueta)}</span>
        <span style="display:flex;gap:14px;align-items:baseline">
          <span style="color:${o};font-size:11px">${c(fl(a))}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3);min-width:88px;text-align:right">${c(Yo(e.patrimonioFinal))}</span>
        </span>
      </div>`}).join("")}
  </div>`}const At=t=>j(t/100);function xl(t,e,a=0){return`
    ${$l(e)}
    ${Il(t,e)}
    <div class="card mb-14">
      <div class="card-title mb-12">Patrimonio por vehículo</div>
      <div class="chart-wrap-lg"><canvas id="pl-chart"></canvas></div>
    </div>
    ${Al(e)}
    ${Ml(t,e)}
    ${Sl(t,e,a)}`}function $l(t){if(t.avisos.length===0&&t.propuestas.length===0)return"";const e={error:"var(--red)",atencion:"var(--yellow)",info:"var(--text2)"},a=t.avisos.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:5px">
        <span style="color:${e[i.severidad]};flex-shrink:0">${i.severidad==="error"?"✕":"⚠"}</span>
        <span style="color:var(--text2)">${c(i.mensaje)}</span>
      </div>`).join(""),o=t.propuestas.length>0?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
           <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Cómo hacerlo encajar — elige una:</div>
           ${t.propuestas.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:4px">
             <span style="color:var(--accent);flex-shrink:0">→</span><span style="color:var(--text2)">${c(i.mensaje)}</span>
           </div>`).join("")}
         </div>`:"",n=t.viable?"rgba(255,209,102,0.28)":"rgba(255,77,109,0.3)";return`<div class="card mb-14" style="background:${t.viable?"rgba(255,209,102,0.05)":"rgba(255,77,109,0.05)"};border-color:${n}">
    <div class="card-title mb-8">${t.viable?"Cosas a revisar":"El plan no cabe en tu flujo de caja"}</div>
    ${a}${o}
  </div>`}function Il(t,e){const a=(n,s,i="")=>`<div class="stat-card">
      <div class="stat-label">${c(n)}</div>
      <div class="stat-value" style="font-size:18px">${c(s)}</div>
      ${i?`<div class="stat-sub">${c(i)}</div>`:""}
    </div>`,o=e.serieMensual[e.serieMensual.length-1];return`<div class="grid-4 mb-14">
    ${a("Patrimonio final",At(e.resumen.patrimonioFinal),o?`en ${o.mes}`:"")}
    ${a("Total aportado",At(e.resumen.totalAportado),`${e.mesesSimulados} meses simulados`)}
    ${a("Total a disfrute",At(e.resumen.totalDisfrute),`${Math.round(t.pctDisfrute*100)} % del sobrante`)}
    ${a("Independencia",e.resumen.mesIndependencia??"—",e.resumen.mesIndependencia?"objetivo perpetuo cubierto":"sin objetivo de independencia")}
  </div>`}function Al(t){return t.hitos.length===0?`<div class="card mb-14"><div class="card-title mb-8">Hitos</div>
      <div class="text-sm" style="color:var(--text3)">Ningún objetivo se completa dentro del horizonte.</div></div>`:`<div class="card mb-14">
    <div class="card-title mb-12">Hitos</div>
    ${t.hitos.map(e=>`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div style="display:flex;align-items:center;gap:9px">
          <span style="font-family:var(--font-mono);color:var(--accent);font-size:11px">${c(e.mes)}</span>
          <span style="font-weight:600">${c(e.nombre)}</span>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono)">${c(At(e.importeFinal))}</div>
          ${e.cuotaLiberada>0?`<div style="font-size:10px;color:var(--text3)">libera ${c(At(e.cuotaLiberada))}/mes</div>`:""}
        </div>
      </div>`).join("")}
  </div>`}function Ml(t,e){if(e.fases.length<=1)return"";const a=o=>{var n;return((n=t.objetivos.find(s=>s._id===o))==null?void 0:n.nombre)??o};return`<div class="card mb-14">
    <div class="card-title mb-12">Fases del plan</div>
    <div class="text-sm mb-10" style="color:var(--text3)">Tramos entre hitos: en cada uno el dinero se reparte de forma distinta.</div>
    ${e.fases.map((o,n)=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);flex-shrink:0;width:26px">${n+1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${c(o.desde)} → ${c(o.hasta)} <span style="color:var(--text3);font-weight:400">(${o.meses} mes${o.meses!==1?"es":""})</span></div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">${c(o.objetivosActivos.map(a).join(" · ")||"sin asignaciones")}</div>
        </div>
      </div>`).join("")}
  </div>`}const ie=60;function Sl(t,e,a=0){if(e.serieMensual.length===0)return"";const o=[...t.objetivos].sort((h,u)=>h.prioridad-u.prioridad),n=Math.ceil(e.serieMensual.length/ie),s=Math.min(Math.max(0,a),n-1),i=e.serieMensual.slice(s*ie,(s+1)*ie),r=["Mes","Disponible",...o.map(h=>h.nombre),"Sin asignar","Patrimonio"].map(h=>`<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${c(h)}</th>`).join(""),l=i.map(h=>{const u=o.map(d=>{const v=h.asignaciones.find($=>$.objetivoId===d._id),y=(v==null?void 0:v.asignado)??0;return`<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${y>0?"var(--text)":"var(--text3)"}">${c(y>0?At(y):"·")}</td>`}).join("");return`<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${c(h.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${c(At(h.disponible))}</td>
        ${u}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${c(h.sinAsignar>0?At(h.sinAsignar):"·")}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${c(At(h.patrimonioTotal))}</td>
      </tr>`}).join(""),p=n>1?`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap">
           <button class="btn-secondary btn-sm" data-pl-pagina="${s-1}"${s===0?" disabled":""}>← Anteriores</button>
           <span class="text-sm" style="color:var(--text3)">
             Meses ${s*ie+1}–${Math.min((s+1)*ie,e.serieMensual.length)} de ${e.serieMensual.length}
           </span>
           <button class="btn-secondary btn-sm" data-pl-pagina="${s+1}"${s>=n-1?" disabled":""}>Siguientes →</button>
         </div>`:"";return`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Mes a mes</span>
      <button class="btn-secondary btn-sm" data-pl-csv>Exportar CSV</button>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead><tr style="border-bottom:1px solid var(--border2)">${r}</tr></thead>
        <tbody>${l}</tbody>
      </table>
    </div>
    ${p}
  </div>`}function wl(t,e){const a=[...t.objetivos].sort((i,r)=>i.prioridad-r.prioridad),o=i=>(i/100).toFixed(2).replace(".",","),n=["Mes","Neto","Gastos fijos","Disfrute","Disponible",...a.map(i=>i.nombre),"Sin asignar","Patrimonio"],s=e.serieMensual.map(i=>[i.mes,o(i.netoMensual),o(i.gastosFijos),o(i.disfrute),o(i.disponible),...a.map(r=>{var l;return o(((l=i.asignaciones.find(p=>p.objetivoId===r._id))==null?void 0:l.asignado)??0)}),o(i.sinAsignar),o(i.patrimonioTotal)].join(";"));return[n.join(";"),...s].join(`
`)}const kt=t=>{const e=typeof t=="number"?t:parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},re=t=>(t/100).toFixed(2),Jo=t=>(t*100).toFixed(2),Ht=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?e/100:0},Cl=[["AHORRO_OBJETIVO","Ahorrar una cantidad"],["AMORTIZAR_DEUDA","Amortizar deuda"],["INVERSION_PERPETUA","Independencia económica"],["APORTACION_FIJA","Aportación periódica"]],jl=[["CUOTA_POR_FECHA","Cuota para llegar a la fecha"],["ABSORBE_TODO","Se lleva todo lo disponible"],["ABSORBE_RESIDUAL","Recibe lo que sobre"],["FIJO","Importe fijo al mes"]],El=[["INMEDIATA","Inmediata"],["MEDIA","Media (con preaviso o penalización)"],["BLOQUEADA_HASTA_JUBILACION","Bloqueada hasta la jubilación"]],zl=[["NULO","Nulo"],["BAJO","Bajo"],["MEDIO","Medio"],["ALTO","Alto"]],Wo={AHORRO_OBJETIVO:"CUOTA_POR_FECHA",AMORTIZAR_DEUDA:"ABSORBE_TODO",INVERSION_PERPETUA:"ABSORBE_RESIDUAL",APORTACION_FIJA:"FIJO"},lt=(t,e,a,o,n="",s="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <input class="form-input" id="${t}" type="${a}" value="${c(o)}" ${s}>
    ${n?`<div class="text-sm mt-4" style="color:var(--text3)">${n}</div>`:""}
  </div>`,Dt=(t,e,a,o,n="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <select class="form-input" id="${t}">
      ${a.map(([s,i])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(i)}</option>`).join("")}
    </select>
    ${n?`<div class="text-sm mt-4" style="color:var(--text3)">${n}</div>`:""}
  </div>`;function Fl(t,e,a){var l,p,h;const o=t===null,n=(t==null?void 0:t.tipo)??"AHORRO_OBJETIVO",s=(t==null?void 0:t.modoAsignacion)??Wo[n],i=!!(t!=null&&t.rentaDeseada),r=e.length>0?e.map(u=>[u._id,u.nombre]):[["","— no hay vehículos: crea uno primero —"]];return`
    <div class="grid-2" style="gap:10px">
      ${lt("ob-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Entrada del piso"')}
      ${lt("ob-prioridad","Prioridad","number",(t==null?void 0:t.prioridad)??a,"Menor número = se sirve antes",'min="1"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Dt("ob-tipo","Tipo",Cl,n)}
      ${Dt("ob-modo","Cómo pide dinero",jl,s)}
    </div>
    <div class="text-sm mb-12" id="ob-modo-ayuda" style="color:var(--text3);line-height:1.6"></div>

    <!-- Independencia económica: capital o renta (§2.6) -->
    <div id="ob-bloque-perpetua" style="display:${n==="INVERSION_PERPETUA"?"block":"none"}">
      <div class="card mb-12" style="background:var(--bg3);padding:12px">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer">
            <input type="radio" name="ob-derivar" value="capital"${i?"":" checked"} style="accent-color:var(--accent)">
            Defino el capital
          </label>
          <label style="display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer">
            <input type="radio" name="ob-derivar" value="renta"${i?" checked":""} style="accent-color:var(--accent)">
            Defino la renta que quiero
          </label>
        </div>
        <div id="ob-renta-campos" style="display:${i?"block":"none"}">
          <div class="grid-2" style="gap:10px">
            ${lt("ob-renta","Renta neta mensual (€)","number",re(((l=t==null?void 0:t.rentaDeseada)==null?void 0:l.rentaNetaMensual)??2e5),"",'step="0.01"')}
            ${lt("ob-swr","Tasa de retiro seguro (%)","number",((((p=t==null?void 0:t.rentaDeseada)==null?void 0:p.tasaRetiroSeguro)??.04)*100).toFixed(2),"",'step="0.1"')}
          </div>
          ${lt("ob-fiscal","Tipo fiscal efectivo al retirar (%)","number",((((h=t==null?void 0:t.rentaDeseada)==null?void 0:h.tipoFiscalEfectivo)??.2)*100).toFixed(2),"",'step="0.5"')}
          <div class="text-sm mt-8" style="color:var(--yellow);line-height:1.6">
            Capital necesario: <strong id="ob-capital-derivado" style="font-family:var(--font-mono)">—</strong>
          </div>
          <div class="text-sm mt-6" style="color:var(--text3);line-height:1.6">
            Un 4 % está calibrado para que la cartera aguante <strong>unos 30 años</strong> con alta probabilidad,
            <strong>no</strong> para que el capital no baje nunca. Si no quieres tocar el principal —por ejemplo
            porque haya herencia prevista— lo prudente es 3–3,5 %.
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-importe" style="display:${i?"none":"block"}">
        ${lt("ob-importe","Importe objetivo (€)","number",re((t==null?void 0:t.importeObjetivo)??0),"Deja 0 si no tiene meta (un cubo perpetuo)",'step="0.01"')}
      </div>
      ${lt("ob-fecha","Fecha límite","month",(t==null?void 0:t.fechaLimite)??"","Vacío = lo antes posible")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ob-saldo","Ya acumulado (€)","number",re((t==null?void 0:t.saldoActual)??0),"Con lo que arranca el objetivo",'step="0.01"')}
      ${Dt("ob-vehiculo","Vehículo",r,(t==null?void 0:t.vehiculoId)??r[0][0])}
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-fijo" style="display:${s==="FIJO"?"block":"none"}">
        ${lt("ob-fijo","Importe fijo mensual (€)","number",re((t==null?void 0:t.importeFijoMensual)??0),"",'step="0.01"')}
      </div>
      <div id="ob-bloque-residual" style="display:${s==="ABSORBE_RESIDUAL"?"block":"none"}">
        ${lt("ob-peso","Peso del residual","number",(t==null?void 0:t.pesoResidual)??1,"Si hay varios, reparte en proporción",'min="0" step="0.5"')}
      </div>
    </div>

    <div class="form-group">
      <label class="form-label" for="ob-notas">Notas</label>
      <textarea class="form-input" id="ob-notas" rows="2" style="resize:vertical;font-family:var(--font-sans)">${c((t==null?void 0:t.notas)??"")}</textarea>
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ob-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ob-cancelar>Cancelar</button>
      <button class="btn-primary" data-ob-guardar>${o?"Crear objetivo":"Guardar"}</button>
    </div>`}function _l(t,e,a){var p;const o=h=>{var u;return((u=t.querySelector(`#${h}`))==null?void 0:u.value)??""},n=o("ob-nombre").trim();if(!n)return null;const s=o("ob-tipo"),i=o("ob-modo"),r=((p=t.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:p.value)==="renta",l=s==="INVERSION_PERPETUA"&&r;return{_id:(e==null?void 0:e._id)??`obj_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:n,tipo:s,importeObjetivo:l?null:kt(o("ob-importe")),fechaLimite:o("ob-fecha")||null,prioridad:Math.max(1,Number(o("ob-prioridad"))||a),modoAsignacion:i,vehiculoId:o("ob-vehiculo"),saldoActual:kt(o("ob-saldo")),estado:(e==null?void 0:e.estado)??"PENDIENTE",notas:o("ob-notas"),...i==="FIJO"?{importeFijoMensual:kt(o("ob-fijo"))}:{},...i==="ABSORBE_RESIDUAL"?{pesoResidual:Math.max(0,Number(o("ob-peso"))||1)}:{},...l?{rentaDeseada:{rentaNetaMensual:kt(o("ob-renta")),tasaRetiroSeguro:Ht(o("ob-swr")),tipoFiscalEfectivo:Ht(o("ob-fiscal"))}}:{rentaDeseada:null}}}function Pl(t){const e=a=>{var o;return((o=t.querySelector(`#${a}`))==null?void 0:o.value)??""};try{const{capitalNecesario:a}=Oo({rentaNetaMensual:kt(e("ob-renta")),tasaRetiroSeguro:Ht(e("ob-swr")),tipoFiscalEfectivo:Ht(e("ob-fiscal"))});return`${(a/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0})} €`}catch{return"no calculable con esos parámetros"}}function Dl(t,e,a){const o=t===null,n=!!(t!=null&&t.esDeuda),s=[["","— ninguna —"],...e.map(r=>[r._id,r.nombre])],i=[["","— ninguno —"],...a.map(r=>[r._id,`${r.nombre} (${r.tin} % TIN)`])];return`
    <div class="card mb-12" style="background:rgba(46,230,168,0.05);border-color:rgba(46,230,168,0.22);padding:12px">
      <div class="text-sm" style="color:var(--text2);line-height:1.7">
        <strong>Amortizar deuda también rinde.</strong> El interés que dejas de pagar es un retorno
        <strong>garantizado</strong>: un préstamo al 9 % «renta» más, y sin riesgo, que un fondo al 5 %. Por eso
        suele encabezar la prioridad, aunque cueste verlo como una inversión.
      </div>
    </div>

    <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;font-size:13px;cursor:pointer">
      <input type="checkbox" id="ve-deuda"${n?" checked":""} style="accent-color:var(--accent)">
      Este vehículo amortiza un préstamo
    </label>

    <div id="ve-bloque-prestamo" style="display:${n?"block":"none"}">
      ${Dt("ve-prestamo","Préstamo",i,(t==null?void 0:t.prestamoId)??"","Su TIN se usará como rentabilidad")}
    </div>

    ${lt("ve-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Fondo indexado"')}

    <div class="grid-2" style="gap:10px">
      ${lt("ve-rent","Rentabilidad REAL anual (%)","number",Jo((t==null?void 0:t.rentabilidadRealAnual)??0),"Nominal menos inflación. Un fondo al 7 % nominal con 2 % de inflación son 5 %",'step="0.1"')}
      ${lt("ve-fiscal","Fiscalidad al retirar (%)","number",Jo((t==null?void 0:t.fiscalidadRetirada)??0),"Tipo efectivo sobre la plusvalía",'step="0.5"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Dt("ve-liquidez","Liquidez",El,(t==null?void 0:t.liquidez)??"INMEDIATA")}
      ${Dt("ve-riesgo","Riesgo",zl,(t==null?void 0:t.riesgo)??"NULO")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ve-tope","Tope de aportación anual (€)","number",t!=null&&t.topeAportacionAnual?re(t.topeAportacionAnual):"","Vacío = sin tope. Pensiones: 1500",'step="0.01"')}
      ${Dt("ve-cuenta","Cuenta asociada",s,(t==null?void 0:t.cuentaId)??"","Enlaza con una cuenta que ya tengas")}
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ve-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ve-cancelar>Cancelar</button>
      <button class="btn-primary" data-ve-guardar>${o?"Crear vehículo":"Guardar"}</button>
    </div>`}function Tl(t,e){var i;const a=r=>{var l;return((l=t.querySelector(`#${r}`))==null?void 0:l.value)??""},o=a("ve-nombre").trim();if(!o)return null;const n=((i=t.querySelector("#ve-deuda"))==null?void 0:i.checked)??!1,s=a("ve-tope").trim();return{_id:(e==null?void 0:e._id)??`veh_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:o,rentabilidadRealAnual:Ht(a("ve-rent")),liquidez:a("ve-liquidez"),fiscalidadRetirada:Ht(a("ve-fiscal")),topeAportacionAnual:s?kt(s):null,riesgo:a("ve-riesgo"),cuentaId:a("ve-cuenta")||null,prestamoId:n&&a("ve-prestamo")||null,esDeuda:n}}const Rl={CUOTA_POR_FECHA:"Cada mes calcula lo que hace falta para llegar a la fecha, con el saldo que lleva. Si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo lo disponible hasta completarse. Los de menor prioridad no reciben nada mientras tanto.",ABSORBE_RESIDUAL:"No reclama nada: recoge lo que quede tras servir a los de arriba. Es el modo del cubo de largo plazo.",FIJO:"Aporta siempre lo mismo. Si el vehículo tiene tope anual, se aporta hasta agotarlo y se reanuda en enero."},Nl="M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z",Qo=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},Ae=t=>(t/100).toFixed(2);function Ol(t){const e=t.hoy??Y;let a="config",o=null,n=0,s=null;function i(){const M=t.store.get("planes");return M.find(E=>E.activo)??M[0]??null}function r(){const M=i();return M||t.store.addItem("planes",{nombre:"Plan base",fechaInicio:e().slice(0,7),horizonteMeses:480,pctDisfrute:0,activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:[],objetivos:[],eventos:[],creadoEn:e()})}function l(M){var F;const E=i();E&&(t.store.updateItem("planes",E._id,M),s=null,o=null,(F=t.onDatosCambiados)==null||F.call(t))}function p(){const E=t.store.get("nominas").filter(N=>N.activo).reduce((N,P)=>N+(P.bruto||0),0),F=Math.round(E*.75/12),T=t.store.get("expenses").filter(N=>N.activo&&N.basico&&N.tipo==="gasto").reduce((N,P)=>N+(P.cuantia||0),0);return{neto:Math.round(F*100),gastos:Math.round(T*100)}}function h(M){return s||(s=$e(M)),s}function u(M){const E=p(),F=Math.max(0,M.perfil.netoMensual-M.perfil.gastosFijosMensuales),T=Math.round(M.pctDisfrute*100);return`
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${c(Ae(M.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${c(j(E.neto/100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${c(Ae(M.perfil.gastosFijosMensuales))}">
            <div class="text-sm mt-4" style="color:var(--text3)">Según tus gastos básicos: ~${c(j(E.gastos/100))}/mes</div>
          </div>
        </div>

        <div class="form-group mt-8">
          <label class="form-label">Disfrute: <span id="pl-pct-val" style="font-family:var(--font-mono);color:var(--accent)">${T} %</span> del sobrante</label>
          <input type="range" id="pl-disfrute" min="0" max="100" step="1" value="${T}" style="width:100%;accent-color:var(--accent)">
          <div class="text-sm mt-4" style="color:var(--text3)">
            Lo que NO se asigna a objetivos. Con ${c(j(Math.max(0,M.perfil.netoMensual-M.perfil.gastosFijosMensuales)/100))} de sobrante,
            quedan <strong id="pl-disponible">${c(j(F*(1-M.pctDisfrute)/100))}</strong>/mes para los objetivos.
          </div>
        </div>

        <div class="grid-2 mt-8" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Mes de inicio</label>
            <input class="form-input" type="month" id="pl-inicio" value="${c(M.fechaInicio)}">
          </div>
          <div class="form-group">
            <label class="form-label">Horizonte (meses)</label>
            <input class="form-input" type="number" id="pl-horizonte" min="1" max="600" value="${c(M.horizonteMeses)}">
          </div>
        </div>

        <div class="flex gap-8 mt-12">
          <button class="btn-primary" data-pl-guardar>Guardar</button>
        </div>
      </div>

      <div class="card mb-14" style="background:rgba(77,159,255,0.05);border-color:rgba(77,159,255,0.25)">
        <div class="card-title mb-8">Todo en euros de hoy</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          Este módulo trabaja en <strong>términos reales</strong>: no modela la inflación, asume que tu sueldo y tus
          objetivos crecen con ella. Por eso las rentabilidades que introduzcas tienen que ser
          <strong>reales</strong> (la nominal menos la inflación esperada). Si pones el 7 % nominal de un fondo sin
          descontar un ~2 % de inflación, la simulación te dirá que llegas años antes de lo que llegarás.
          <br><br>
          Y es un <strong>simulador, no un asesor</strong>: supone una rentabilidad constante, y la realidad no es
          lineal. Sirve para comparar decisiones entre sí, no para dar fechas exactas.
        </div>
      </div>

      ${d(M)}`}function d(M){return`
      <div class="card">
        <div class="card-title mb-8">Notas del plan</div>
        <textarea class="form-input" id="pl-notas" rows="4" style="resize:vertical;font-family:var(--font-sans)"
          placeholder="Supuestos, decisiones tomadas, cosas a revisar…">${c(M.notas??"")}</textarea>
        <button class="btn-secondary btn-sm mt-8" data-pl-guardar-notas>Guardar notas</button>
      </div>`}const v=()=>document.getElementById("modal-overlay"),y=()=>document.getElementById("modal-content"),$=()=>{var M;return(M=v())==null?void 0:M.classList.add("hidden")};function A(M,E){const F=v(),T=y();return!F||!T?null:(T.innerHTML=`<div class="modal-title">${c(M)}</div>${E}`,F.classList.remove("hidden"),T)}function f(M){l({objetivos:M})}function g(M,E){const F=i();if(!F)return;const T=E?F.objetivos.find(k=>k._id===E)??null:null,N=F.objetivos.reduce((k,O)=>Math.max(k,O.prioridad),0)+1,P=A(T?`Editar «${T.nombre}»`:"Nuevo objetivo",Fl(T,F.vehiculos,N));if(!P)return;const B=()=>{var U;const k=(U=P.querySelector("#ob-modo"))==null?void 0:U.value,O=P.querySelector("#ob-modo-ayuda");O&&k&&(O.textContent=Rl[k]);const H=(Q,K)=>{const st=P.querySelector(Q);st&&(st.style.display=K?"block":"none")};H("#ob-bloque-fijo",k==="FIJO"),H("#ob-bloque-residual",k==="ABSORBE_RESIDUAL")};B();const L=()=>{const k=P.querySelector("#ob-capital-derivado");k&&(k.textContent=Pl(P))};L(),J(P,"#ob-modo",B),J(P,"#ob-tipo",()=>{const k=P.querySelector("#ob-tipo").value,O=P.querySelector("#ob-modo");O&&(O.value=Wo[k]);const H=P.querySelector("#ob-bloque-perpetua");H&&(H.style.display=k==="INVERSION_PERPETUA"?"block":"none"),B()}),J(P,'input[name="ob-derivar"]',()=>{var U;const k=((U=P.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:U.value)==="renta",O=P.querySelector("#ob-renta-campos"),H=P.querySelector("#ob-bloque-importe");O&&(O.style.display=k?"block":"none"),H&&(H.style.display=k?"none":"block"),L()}),J(P,"#ob-renta, #ob-swr, #ob-fiscal",L),R(P,"[data-ob-cancelar]",$),R(P,"[data-ob-guardar]",()=>{const k=_l(P,T,N);if(!k){q("El objetivo necesita un nombre","err");return}if(!k.vehiculoId){q("Crea antes un vehículo donde meter el dinero","err");return}const O=F.objetivos.filter(H=>H._id!==k._id);f([...O,k]),$(),q(T?"Objetivo actualizado":`Objetivo «${k.nombre}» creado`),D(M)}),R(P,"[data-ob-borrar]",()=>{T&&Z(`¿Borrar «${T.nombre}»? Esto no se puede deshacer.`)&&(f(F.objetivos.filter(k=>k._id!==T._id)),$(),q("Objetivo borrado"),D(M))})}function m(M,E){const F=i();if(!F)return;const T=E?F.vehiculos.find(L=>L._id===E)??null:null,N=t.store.get("accounts").filter(L=>L.activo).map(L=>({_id:L._id,nombre:L.nombre})),P=t.store.get("loans").filter(L=>L.activo&&!L.simulacion).map(L=>({_id:L._id,nombre:L.nombre,tin:L.tin})),B=A(T?`Editar «${T.nombre}»`:"Nuevo vehículo",Dl(T,N,P));B&&(J(B,"#ve-deuda",()=>{const L=B.querySelector("#ve-deuda").checked,k=B.querySelector("#ve-bloque-prestamo");k&&(k.style.display=L?"block":"none")}),J(B,"#ve-prestamo",()=>{const L=B.querySelector("#ve-prestamo").value,k=P.find(U=>U._id===L);if(!k)return;const O=B.querySelector("#ve-rent"),H=B.querySelector("#ve-nombre");O&&(O.value=String(k.tin)),H&&!H.value.trim()&&(H.value=`Amortizar ${k.nombre}`)}),R(B,"[data-ve-cancelar]",$),R(B,"[data-ve-guardar]",()=>{const L=Tl(B,T);if(!L){q("El vehículo necesita un nombre","err");return}const k=F.vehiculos.filter(O=>O._id!==L._id);l({vehiculos:[...k,L]}),$(),q(T?"Vehículo actualizado":`Vehículo «${L.nombre}» creado`),D(M)}),R(B,"[data-ve-borrar]",()=>{if(!T)return;const L=F.objetivos.filter(k=>k.vehiculoId===T._id);if(L.length>0){q(`No se puede borrar: lo usan ${L.length} objetivo${L.length!==1?"s":""}`,"err");return}Z(`¿Borrar el vehículo «${T.nombre}»?`)&&(l({vehiculos:F.vehiculos.filter(k=>k._id!==T._id)}),$(),q("Vehículo borrado"),D(M))}))}function I(M,E,F){const T=i();if(!T||E===F)return;const N=[...T.objetivos].sort((k,O)=>k.prioridad-O.prioridad),P=N.findIndex(k=>k._id===E),B=N.findIndex(k=>k._id===F);if(P<0||B<0)return;const[L]=N.splice(P,1);N.splice(B,0,L),f(N.map((k,O)=>({...k,prioridad:O+1}))),D(M)}function b(M){return M.vehiculos.length===0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.06);border-color:rgba(255,209,102,0.28)">
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          <strong style="color:var(--yellow)">No hay vehículos todavía.</strong>
          Un vehículo es dónde va el dinero —una cuenta, un fondo, un plan de pensiones o la amortización de un
          préstamo— y con qué rentabilidad crece. Hace falta al menos uno para poder crear objetivos.
        </div>
      </div>`:`<div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Vehículos</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${M.vehiculos.map(E=>{const F=M.objetivos.filter(T=>T.vehiculoId===E._id).length;return`<button class="btn-secondary btn-sm" data-pl-editar-vehiculo="${c(E._id)}"
              style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 11px;text-align:left${E.revisarRentabilidad?";border-color:rgba(255,209,102,0.45)":""}">
              <span style="font-weight:600;font-size:12px">${c(E.nombre)}${E.esDeuda?" 🔒":""}${E.revisarRentabilidad?" ⚠":""}</span>
              <span style="font-size:10px;color:var(--text3)">
                ${c((E.rentabilidadRealAnual*100).toFixed(2))} % real · ${F} objetivo${F!==1?"s":""}
              </span>
            </button>`}).join("")}
      </div>
      ${M.vehiculos.some(E=>E.revisarRentabilidad)?`<div class="text-sm mt-10" style="color:var(--yellow);line-height:1.7;padding-top:10px;border-top:1px solid var(--border)">
               ⚠ Los vehículos marcados traen la rentabilidad de tus cuentas, que es <strong>nominal</strong>.
               Este módulo trabaja en términos <strong>reales</strong>: réstale la inflación que esperes
               (unos 2 puntos) o la simulación te dirá que llegas antes de lo que llegarás. Al guardarlos
               desde su formulario el aviso desaparece.
             </div>`:""}
    </div>`}function x(M,E,F){const T=i(),N=Kr(E);if(!T||!N)return;const P=F?T.eventos.find(O=>O._id===F)??null:null,B={};N.id==="hijo"&&(B.actuales=T.perfil.gastosFijosMensuales),N.id==="subida-sueldo"&&(B.actual=T.perfil.netoMensual);const L=A(P?`Editar evento · ${N.nombre}`:N.nombre,nl(N,P,T,B));if(!L)return;const k=()=>{const O=L.querySelector("#ev-resultado");O&&(O.textContent=il(N,Vo(L,N)))};k();for(const O of N.campos)J(L,`#ev-${O.id}`,k);R(L,"[data-ev-cancelar]",$),R(L,"[data-ev-guardar]",()=>{var Q,K;const O=((Q=L.querySelector("#ev-fecha"))==null?void 0:Q.value)??"";if(!O){q("El evento necesita un mes","err");return}const H=Vo(L,N),U={_id:(P==null?void 0:P._id)??`ev_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,fecha:O,tipo:N.tipo,importe:N.calcular(H),objetivoDestinoId:((K=L.querySelector("#ev-destino"))==null?void 0:K.value)||null,notas:N.resumir(H)};l({eventos:[...T.eventos.filter(st=>st._id!==U._id),U]}),$(),q(P?"Evento actualizado":"Evento añadido"),D(M)}),R(L,"[data-ev-borrar]",()=>{!P||!Z("¿Borrar este evento?")||(l({eventos:T.eventos.filter(O=>O._id!==P._id)}),$(),q("Evento borrado"),D(M))})}function S(M){var E;switch(M.tipo){case"CAMBIO_GASTOS_FIJOS":return"hijo";case"CAMBIO_INGRESOS":return"subida-sueldo";case"NUEVA_DEUDA":return"nueva-hipoteca";case"INYECCION_CAPITAL":return(E=M.notas)!=null&&E.includes("hipoteca")?"venta-vivienda":"inyeccion"}}function w(){const M=i();if(!M)return;const E=new Blob([JSON.stringify(M,null,2)],{type:"application/json"}),F=URL.createObjectURL(E),T=document.createElement("a");T.href=F,T.download=`plan-${M.nombre.replace(/[^\w-]+/g,"_")}-${e()}.json`,T.click(),URL.revokeObjectURL(F),q("Plan exportado")}function z(M){const E=document.createElement("input");E.type="file",E.accept="application/json,.json",E.addEventListener("change",async()=>{var T,N;const F=(T=E.files)==null?void 0:T[0];if(F)try{const P=JSON.parse(await F.text());if(!P||!Array.isArray(P.objetivos)||!Array.isArray(P.vehiculos)||!P.perfil){q("Ese fichero no es un plan de objetivos","err");return}const B=`${P.nombre??"Importado"} (importado)`,L=t.store.addItem("planes",{...P,nombre:B,activo:!1,creadoEn:e()});s=null,o=null,(N=t.onDatosCambiados)==null||N.call(t),q(`Plan «${L.nombre}» importado`),D(M)}catch(P){console.error("[Planner] Importación fallida:",P),q("No se ha podido leer el fichero","err")}}),E.click()}function _(M,E){switch(a){case"config":return u(M);case"objetivos":return Wr(M,E);case"simulacion":return xl(M,E,n);case"eventos":return ol(M);case"escenarios":return vl(t.store.get("planes"),M._id,o)}}function D(M){const E=r(),F=h(E),T=(P,B)=>`<button class="period-btn ${a===P?"active":""}" data-pl-tab="${P}">${B}</button>`,N=F.viable?'<span class="badge badge-green">Plan viable</span>':'<span class="badge badge-red">No cabe en el flujo</span>';if(M.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Objetivos <span>financieros</span></h1>
        <div class="page-actions">${N}</div>
      </div>

      <div class="period-selector mb-14">
        ${T("config","Plan")}
        ${T("objetivos",`Objetivos (${E.objetivos.length})`)}
        ${T("simulacion","Simulación")}
        ${T("eventos",`Eventos (${E.eventos.length})`)}
        ${T("escenarios","Comparar planes")}
      </div>

      ${a==="objetivos"?`<div class="flex gap-8 mb-14 flex-wrap">
               <button class="btn-primary" data-pl-nuevo-objetivo>+ Nuevo objetivo</button>
               <button class="btn-secondary" data-pl-nuevo-vehiculo>+ Nuevo vehículo</button>
             </div>
             ${b(E)}`:""}

      <div id="pl-cuerpo">${_(E,F)}</div>`,a==="simulacion"){const P=M.querySelector("#pl-chart");P&&Ur(P,E,F)}C(M)}function C(M){R(M,"[data-pl-tab]",F=>{a=F.dataset.plTab,D(M)}),J(M,"#pl-disfrute",F=>{const T=Number(F.value)/100,N=M.querySelector("#pl-pct-val");N&&(N.textContent=`${Math.round(T*100)} %`);const P=i();if(!P)return;const B=Math.max(0,P.perfil.netoMensual-P.perfil.gastosFijosMensuales)*(1-T),L=M.querySelector("#pl-disponible");L&&(L.textContent=j(B/100))}),R(M,"[data-pl-usar-sugerido]",()=>{const F=p(),T=M.querySelector("#pl-neto"),N=M.querySelector("#pl-gastos");T&&(T.value=Ae(F.neto)),N&&(N.value=Ae(F.gastos))}),R(M,"[data-pl-guardar]",()=>{const F=T=>{var N;return((N=M.querySelector(T))==null?void 0:N.value)??""};l({perfil:{netoMensual:Qo(F("#pl-neto")),gastosFijosMensuales:Qo(F("#pl-gastos")),manual:!0},pctDisfrute:Math.min(1,Math.max(0,Number(F("#pl-disfrute"))/100)),fechaInicio:F("#pl-inicio")||e().slice(0,7),horizonteMeses:Math.min(600,Math.max(1,Number(F("#pl-horizonte"))||480))}),q("Plan guardado"),D(M)}),R(M,"[data-pl-plantilla]",F=>x(M,F.dataset.plPlantilla??"",null)),R(M,"[data-pl-editar-evento]",F=>{var P;const T=F.dataset.plEditarEvento??"",N=(P=i())==null?void 0:P.eventos.find(B=>B._id===T);N&&x(M,S(N),T)}),R(M,"[data-pl-duplicar]",()=>{var P;const F=i();if(!F)return;const T=window.prompt("Nombre del plan nuevo:",`${F.nombre} (copia)`);if(!(T!=null&&T.trim()))return;const N=Zr(F,T.trim(),`plan_${Date.now().toString(36)}`,e());t.store.addItem("planes",N),(P=t.onDatosCambiados)==null||P.call(t),q(`Plan «${N.nombre}» creado. Actívalo para editarlo.`),D(M)}),R(M,"[data-pl-activar]",F=>{var N;const T=F.dataset.plActivar;if(T){for(const P of t.store.get("planes"))t.store.updateItem("planes",P._id,{activo:P._id===T});s=null,o=null,(N=t.onDatosCambiados)==null||N.call(t),q("Plan activo cambiado"),D(M)}}),R(M,"[data-pl-renombrar]",F=>{var B;const T=F.dataset.plRenombrar,N=t.store.get("planes").find(L=>L._id===T);if(!N)return;const P=window.prompt("Nuevo nombre:",N.nombre);P!=null&&P.trim()&&(t.store.updateItem("planes",N._id,{nombre:P.trim()}),(B=t.onDatosCambiados)==null||B.call(t),D(M))}),R(M,"[data-pl-borrar-plan]",F=>{var B;const T=F.dataset.plBorrarPlan,N=t.store.get("planes").find(L=>L._id===T);if(!N||!Z(`¿Borrar el plan «${N.nombre}» con sus ${N.objetivos.length} objetivos? No se puede deshacer.`))return;t.store.removeItem("planes",N._id);const P=t.store.get("planes");N.activo&&P.length>0&&t.store.updateItem("planes",P[0]._id,{activo:!0}),s=null,o=null,(B=t.onDatosCambiados)==null||B.call(t),q("Plan borrado"),D(M)}),R(M,"[data-pl-sensibilidad]",()=>{const F=i();F&&(o=ml(F),D(M))}),R(M,"[data-pl-pagina]",F=>{n=Number(F.dataset.plPagina)||0,D(M)}),R(M,"[data-pl-exportar]",w),R(M,"[data-pl-importar]",()=>z(M)),R(M,"[data-pl-nuevo-objetivo]",()=>g(M,null)),R(M,"[data-pl-nuevo-vehiculo]",()=>m(M,null)),R(M,"[data-pl-editar-vehiculo]",F=>m(M,F.dataset.plEditarVehiculo??null)),R(M,"[data-pl-editar-objetivo]",F=>g(M,F.dataset.plEditarObjetivo??null));let E=null;M.querySelectorAll("[data-pl-objetivo]").forEach(F=>{F.addEventListener("dragstart",()=>{E=F.dataset.plObjetivo??null,F.style.opacity="0.45"}),F.addEventListener("dragend",()=>{F.style.opacity="",M.querySelectorAll("[data-pl-objetivo]").forEach(T=>T.style.borderTop="")}),F.addEventListener("dragover",T=>{T.preventDefault(),E&&F.dataset.plObjetivo!==E&&(F.style.borderTop="2px solid var(--accent)")}),F.addEventListener("dragleave",()=>{F.style.borderTop=""}),F.addEventListener("drop",T=>{T.preventDefault(),F.style.borderTop="";const N=F.dataset.plObjetivo;E&&N&&I(M,E,N),E=null})}),R(M,"[data-pl-csv]",()=>{const F=i();if(!F||!s)return;const T=new Blob(["\uFEFF"+wl(F,s)],{type:"text/csv;charset=utf-8"}),N=URL.createObjectURL(T),P=document.createElement("a");P.href=N,P.download=`plan-${F.nombre.replace(/[^\w-]+/g,"_")}-${e()}.csv`,P.click(),URL.revokeObjectURL(N),q(`CSV exportado (${s.serieMensual.length} meses)`)}),R(M,"[data-pl-guardar-notas]",()=>{var F;l({notas:((F=M.querySelector("#pl-notas"))==null?void 0:F.value)??""}),q("Notas guardadas")})}return{id:"planner",route:"planner",nombre:"Objetivos financieros",seccion:2,iconoPath:Nl,mount:D}}function Ko(t,e,a=!1){const o=Math.abs(It(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function ql(t){function e(m){return`${m}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(m={}){var b;const I=(b=m.texto)==null?void 0:b.trim().toLowerCase();return t.get("transacciones").filter(x=>!(m.cuentaId&&x.cuentaId!==m.cuentaId||m.desde&&x.fecha<m.desde||m.hasta&&x.fecha>m.hasta||m.tipo&&x.tipo!==m.tipo||m.estimacionId&&x.estimacionId!==m.estimacionId||m.tags&&m.tags.length>0&&!m.tags.some(S=>x.tags.includes(S))||I&&!x.concepto.toLowerCase().includes(I))).sort((x,S)=>x.fecha.localeCompare(S.fecha)||x._id.localeCompare(S._id))}function o(m){const I={_id:e("tx"),fecha:m.fecha,cuentaId:m.cuentaId,importeCts:Ko(m.tipo,m.importe,m.negativo),concepto:m.concepto,tags:m.tags??[],estimacionId:m.estimacionId??null,tipo:m.tipo,origen:m.origen??"manual",...m.nota?{nota:m.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),I]),I}function n(m,I){t.set("transacciones",t.get("transacciones").map(b=>{if(b._id!==m)return b;const{importe:x,...S}=I,w={...b,...S};return x!==void 0&&(w.importeCts=Ko(w.tipo,x,w.importeCts<0)),w}))}function s(m){t.set("transacciones",t.get("transacciones").filter(I=>I._id!==m))}function i(m,I){n(m,{estimacionId:I})}function r(m){return t.get("puntosControl").filter(I=>!m||I.cuentaId===m).sort((I,b)=>I.fecha.localeCompare(b.fecha))}function l(m,I,b,x){const S={_id:e("pc"),fecha:I,cuentaId:m,saldoCts:It(b),...x?{nota:x}:{}},w=t.get("puntosControl").filter(z=>!(z.cuentaId===m&&z.fecha===I));return t.set("puntosControl",[...w,S].sort((z,_)=>z.fecha.localeCompare(_.fecha))),h(m),S}function p(m){const I=t.get("puntosControl").find(b=>b._id===m);t.set("puntosControl",t.get("puntosControl").filter(b=>b._id!==m)),I&&h(I.cuentaId)}function h(m){const I=r(m),b=t.get("accounts");b.some(x=>x._id===m)&&t.set("accounts",b.map(x=>x._id===m?{...x,historicoSaldos:I.map(S=>({_id:S._id,fecha:S.fecha,saldo:et(S.saldoCts),...S.nota?{nota:S.nota}:{}}))}:x))}function u(m,I=Y()){const b=r(m).filter(z=>z.fecha<=I).pop(),x=b==null?void 0:b.fecha,S=(b==null?void 0:b.saldoCts)??0;return t.get("transacciones").filter(z=>z.cuentaId===m&&z.fecha<=I&&(x===void 0||z.fecha>x)).reduce((z,_)=>z+_.importeCts,S)}function d(m,I){return et(u(m,I))}function v(m=Y(),I){const b=I??t.get("accounts").filter(x=>x.activo).map(x=>x._id);return et(b.reduce((x,S)=>x+u(S,m),0))}function y(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function $(){const m=[...t.get("transacciones").map(I=>I.fecha),...t.get("puntosControl").map(I=>I.fecha)];return m.length>0?m.sort().pop()??null:null}function A(m={}){return et(a(m).reduce((I,b)=>I+b.importeCts,0))}function f(m={}){const I=new Map;for(const b of a(m)){const x=b.fecha.slice(0,7);I.set(x,(I.get(x)??0)+b.importeCts)}return new Map([...I.entries()].sort(([b],[x])=>b.localeCompare(x)).map(([b,x])=>[b,et(x)]))}function g(m={}){const I=new Map;for(const b of a(m))for(const x of b.tags.length>0?b.tags:["sin_tag"])I.set(x,(I.get(x)??0)+b.importeCts);return new Map([...I.entries()].map(([b,x])=>[b,et(x)]))}return{transacciones:a,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:p,saldoCuenta:d,saldoCuentaCts:u,saldoTotal:v,tieneDatos:y,ultimaFecha:$,total:A,totalPorMes:f,totalPorTag:g}}function xt(t){return t.trim().toLowerCase()}function Ll(t){function e(){const p=new Map,h=(u,d)=>{const v=xt(u);if(!v)return;const y=p.get(v)??{tag:v,estimaciones:0,reales:0,total:0};y[d]+=1,y.total+=1,p.set(v,y)};for(const u of t.get("expenses"))for(const d of u.tags??[])h(d,"estimaciones");for(const u of t.get("transacciones"))for(const d of u.tags??[])h(d,"reales");return[...p.values()].sort((u,d)=>d.total-u.total||u.tag.localeCompare(d.tag))}function a(){return e().map(p=>p.tag)}function o(p){return e().filter(h=>p==="estimaciones"?h.reales===0:h.estimaciones===0).map(h=>h.tag)}function n(p,h,u){const d=xt(h),v=(p??[]).map(xt);if(!v.includes(d))return p??[];const y=v.filter($=>$!==d);return u===null?[...new Set(y)]:[...new Set([...y,xt(u)])]}function s(p,h){const u=xt(h);if(!u)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return l(p,u)}function i(p,h){let u=0;for(const d of p)xt(d)!==xt(h)&&(u+=l(d,xt(h)).cambiados);return{cambiados:u}}function r(p){return l(p,null)}function l(p,h){let u=0;const d=t.get("expenses").map(S=>{const w=n(S.tags,p,h);return w!==S.tags&&(u+=1),w===S.tags?S:{...S,tags:w}});t.set("expenses",d);const v=t.get("transacciones").map(S=>{const w=n(S.tags,p,h);return w!==S.tags&&(u+=1),w===S.tags?S:{...S,tags:w}});t.set("transacciones",v);const y=t.get("loans").map(S=>{const w=n(S.tags,p,h);return w!==S.tags&&(u+=1),w===S.tags?S:{...S,tags:w}});t.set("loans",y);const $=t.get("nominas").map(S=>{const w=n(S.tags,p,h);return w!==S.tags&&(u+=1),w===S.tags?S:{...S,tags:w}});t.set("nominas",$);const A=t.get("config"),f=xt(p),g=S=>{const w=(S??[]).map(xt);if(!w.includes(f))return S??[];const z=w.filter(_=>_!==f);return h===null?[...new Set(z)]:[...new Set([...z,h])]},m={},I=g(A.activeTagsFilter),b=g(A.tagCategorias),x=g(A.tagGrupos);return I!==A.activeTagsFilter&&(m.activeTagsFilter=I),b!==A.tagCategorias&&(m.tagCategorias=b),x!==A.tagGrupos&&(m.tagGrupos=x),Object.keys(m).length>0&&t.patchConfig(m),{cambiados:u}}return{uso:e,todas:a,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const Bl=3;function Xo(t){return t<.005?0:t}function kl(t){if(t.length<2)return null;const e=t.reduce((o,n)=>o+n,0)/t.length,a=t.reduce((o,n)=>o+(n-e)**2,0)/(t.length-1);return Math.sqrt(a)}function Hl(t){const e=[],a=[],o=[];for(const i of t){if(i.meses.length<Bl)continue;const r=kl(i.meses.map(l=>l.desviacion));r!==null&&(e.push(r),a.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(e.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(e.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(a.reduce((i,r)=>i+r*r,0));return{sigmaMensual:Xo(n),sigmaDeriva:Xo(s),estimaciones:e.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function Zo(t,e,a=1,o=0){if(e<=0)return 0;const n=Math.max(0,t)*Math.sqrt(e),s=Math.max(0,o)*e;return n===0&&s===0?0:W(a*Math.hypot(n,s))}function Gl(t,e,a={}){if(!e.fiable||t.length===0)return[];const{z:o=1}=a,n=a.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[l,p]=r.fecha.slice(0,7).split("-").map(Number),h=Math.max(0,(l-s)*12+(p-i)),u=Zo(e.sigmaMensual,h,o,e.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:W(r.saldoAcum+u),abajo:W(r.saldoAcum-u)}})}function Vl(t,e=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const a=e>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${e} desviación${e!==1?"es":""} típica${e!==1?"s":""} (${a} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const ra="financeapp_session",Ul=["local","dropbox","firebase"];function Yl(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!Ul.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function Jl({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now()}={}){const o=()=>t??(typeof localStorage<"u"?localStorage:null);function n(d){const v=o();if(v)try{d?v.setItem(ra,JSON.stringify(d)):v.removeItem(ra)}catch{}}function s(){const d=o();if(!d)return null;try{return Yl(d.getItem(ra))}catch{return null}}function i(){const d=s();return d?(a()-d.ultimoUso)/6e4:null}function r(){const d=e();if(!Number.isFinite(d)||d<=0)return!1;const v=i();return v!==null&&v>=d}function l(){const d=s();return d?r()?(n(null),null):d:null}function p(d){const v=a(),y={modo:d.modo,...d.email?{email:d.email}:{},...d.passphrase?{passphrase:d.passphrase}:{},creadaEn:v,ultimoUso:v};return n(y),y}function h(){const d=s();d&&n({...d,ultimoUso:a()})}function u(){n(null)}return{abrir:p,leer:l,tocar:h,cerrar:u,caducada:r,inactividadMinutos:i,get activa(){return l()!==null}}}const ts=["pointerdown","keydown","visibilitychange"];function Wl({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const h of ts)s==null||s.addEventListener(h,r);const l=o(()=>{i&&t.caducada()&&(p(),t.cerrar(),e())},a);function p(){if(i){i=!1,n(l);for(const h of ts)s==null||s.removeEventListener(h,r)}}return p}const Ql=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}];function es(){if(typeof localStorage<"u"){const d=bn();d.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${d.join(", ")}`)}const t=In({adapter:gn()}),{applied:e}=t.load();e.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${e.join(", ")} (esquema v${Xt})`);const a=Mn(t);Ns(d=>a.isEnabled(d));const o=Jl({autoLogoutMinutos:()=>{var v,y;const d=(y=(v=globalThis.State)==null?void 0:v.get)==null?void 0:y.call(v,"config");return Number((d==null?void 0:d.autoLogoutMinutos)??t.get("config").autoLogoutMinutos??0)}}),n=ql(t),s=Ll(t),i=ai(n),r=Nn(t),l=_n({isEnabled:d=>a.isEnabled(d)}),p=En({flags:a,rutasExtra:()=>l.flagPorRuta()}),h=jn({flags:a,onChange:()=>{var d,v;l.attachToShell(),p.apply(),(v=(d=globalThis.Router)==null?void 0:d.rerender)==null||v.call(d)}}),u=()=>{var v,y,$,A,f,g;const d=globalThis;if((y=(v=d.State)==null?void 0:v.load)==null||y.call(v),((A=($=d.Router)==null?void 0:$.current)==null?void 0:A.call($))==="dashboard")try{(g=(f=d.DashboardModule)==null?void 0:f.render)==null||g.call(f)}catch(m){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",m)}};return l.register(Ei({store:t,onDatosCambiados:u})),l.register(Li({store:t,onDatosCambiados:u})),l.register(nr({store:t,onDatosCambiados:u})),l.register(Sr({store:t,ledger:n,mostrarObjetivos:()=>a.isEnabled("goals"),onDatosCambiados:u})),l.register(fi({ledger:n,tags:s,precision:i,adjuster:r,accounts:()=>t.get("accounts"),estimaciones:()=>t.get("expenses"),onDatosCambiados:u})),l.register(Ol({store:t,onDatosCambiados:u})),l.register(Rr({store:t,onDatosCambiados:u})),l.register(Ii({store:t,onDatosCambiados:u})),l.register(_r({store:t})),l.register(gi({store:t,onDatosCambiados:u})),{version:Xt,core:ys,engine:{generarExtracto:Wt,recomputarSaldoAcum:Is,saldoHoy:As,sumarPorTags:Na,providers:{proyectarGastos:Jt,proyectarPrestamos:ja,proyectarTransferencias:Ea,proyectarNominas:Pa,proyectarInteresesCuentas:Fa,proyectarAportaciones:za,proyectarRetencionesFiscales:_a,proyectarInflacionGastos:Da,proyectarPerdidaAhorro:Ta},analysis:Cs,margins:Fs,avisos:Ts,optimizer:Os,dashboard:Xs},store:t,flags:a,featureRegistry:{all:Ct,porGrupo:io},ui:{openFeatures:h.open,applyGating:p.apply,watchGating:()=>p.observar(),instalarDeshacer:()=>Fn({store:t,rerender:()=>{var v,y,$,A;const d=globalThis;(y=(v=d.State)==null?void 0:v.load)==null||y.call(v),(A=($=d.Router)==null?void 0:$.rerender)==null||A.call($)}})},app:l,session:Object.assign(o,{vigilar:d=>Wl({sesion:o,onCaducada:d}),opciones:Ql}),accounting:{ledger:n,tags:s,precision:i,adjuster:r,sugerirAjuste:Ye,medirVariabilidad:Hl,bandaDeConfianza:Gl,bandaAcumulada:Zo,describirBanda:Vl}}}function Kl(){try{const t=es();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const le=typeof window<"u"?Kl():null;if(le){let t=!1;const e=()=>{le.app.attachToShell(),le.ui.applyGating(),t||(t=!0,le.ui.watchGating(),le.ui.instalarDeshacer())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",a=>{const o=a.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(e,0)})}return $t.bootstrap=es,Object.defineProperty($t,Symbol.toStringTag,{value:"Module"}),$t}({});
//# sourceMappingURL=financeapp-core.js.map

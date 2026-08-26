var FinanceAppBundle=function($t){"use strict";var jc=Object.defineProperty;var _c=($t,V,G)=>V in $t?jc($t,V,{enumerable:!0,configurable:!0,writable:!0,value:G}):$t[V]=G;var $n=($t,V,G)=>_c($t,typeof V!="symbol"?V+"":V,G);function V(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function G(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function Y(){return V(new Date)}function je(t,e){return new Date(t,e+1,0).getDate()}function ha(t,e,a){return V(new Date(t,e,Math.min(a,je(t,e))))}function fe(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return V(new Date(t,e+1,0));const n=parseInt(o);if(!isNaN(n))return ha(t,e,n)}if(a.startsWith("nthweekday:")){const o=a.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,e+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return V(r)}const i=new Date(t,e,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),V(i)}return null}function ya(t,e){if(!e)return t;const a=G(t);return fe(a.getFullYear(),a.getMonth(),e)??t}const In=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],An={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function _e(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${An[a]||a+"º"} ${In[o]} del mes`}return t}function Jt(t,e){const a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((o-a)/864e5)}function It(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function et(t){return t/100}function W(t){return et(It(t))}function E(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function xa(t){return(t||0).toFixed(2)+"%"}function Rt(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function $a(t,e,a,o=0){const n=Rt(t,e,a),s=t*(1-o/100);let i=e/100/12;for(let r=0;r<200;r++){const u=n*(1-Math.pow(1+i,-a))/i-s,h=n*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),d=i-u/h;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function Ia(t,e,a,o,n=0,s=[],i={}){const r=[];let l=t;const u=G(o),h=e/100/12;let d=a,m=Rt(l,e,d);const x=[...s].sort(($,A)=>$.fecha.localeCompare(A.fecha));let y=0;for(let $=1;$<=a*2&&l>.01;$++){const A=new Date(u);u.setMonth(u.getMonth()+1);const v=ya(V(A),i.diaPago||"");for(;y<x.length&&x[y].fecha<=v;){const I=x[y],p=I.cantidad*(n/100);if(l-=I.cantidad,l=Math.max(0,l),I.tipo==="plazo"?d=Math.ceil(-Math.log(1-l*h/m)/Math.log(1+h)):(d=a-$+1,m=Rt(l,e,d)),r.push({mes:"AMORT",fecha:I.fecha,cuota:0,interes:0,amortizacion:I.cantidad,comisionAmort:p,capitalPendiente:l,esAmortizacion:!0,simulacion:I.simulacion||!1}),y++,l<.01)break}if(l<.01)break;const b=l*h,f=Math.min(m-b,l);if(l-=f,l<.01&&(l=0),r.push({mes:$,fecha:v,cuota:m,interes:b,amortizacion:f,comisionAmort:0,capitalPendiente:l,esAmortizacion:!1,simulacion:!1}),d--,d<=0||l<.01)break}return r}const Aa=new Map;function at(t){var A;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((v,b)=>`${v.fecha}|${v.cantidad}|${v.tipo||""}`.localeCompare(`${b.fecha}|${b.cantidad}|${b.tipo||""}`)).map(v=>`${v.fecha}:${v.cantidad}:${v.tipo||""}`).join(";")}`,o=Aa.get(a);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:l,comisionApertura:u}=t,h=Ia(n,s,i,r,l||0,e,t),d=h.reduce((v,b)=>v+b.interes,0),m=h.reduce((v,b)=>v+b.comisionAmort,0),x=n*((u||0)/100),y=h.filter(v=>!v.esAmortizacion),$={cuota:Rt(n,s,i),totalIntereses:d,tae:$a(n,s,i,u||0),costoTotal:d+m+x,comAp:x,totalComAm:m,fechaFin:((A=y.slice(-1)[0])==null?void 0:A.fecha)||"",mesesReales:y.length,tabla:h};return Aa.set(a,$),$}function wa(t){const e=at(t),a=at({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,n=a.mesesReales-e.mesesReales,s=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function pt(t,e,a){if(!t||t.length===0)return 1;const o=G(e),n=G(a);if(n<=o)return 1;const s=[...t].sort((l,u)=>l.year-u.year);let i=1,r=new Date(o);for(;r<n;){const l=r.getFullYear(),u=s.filter($=>$.year<=l),h=u.length>0?u[u.length-1]:s[0],d=(h?h.tasa:0)/100,m=new Date(l+1,0,1),x=m<n?m:n,y=Jt(r,x);i*=Math.pow(1+d,y/365.25),r=x}return i}function Sa(t,e,a,o=0){const n=G(e),s=G(a);if(s<=n)return o;const i=Jt(n,s),r=t?[...t].sort((h,d)=>h.year-d.year):[];let l=0,u=new Date(n);for(;u<s;){const h=u.getFullYear(),d=new Date(h+1,0,1),m=d<s?d:s,x=Jt(u,m),y=r.filter(v=>v.year<=h),$=y.length>0?y[y.length-1]:null,A=$!==null?$.tasa:o;l+=A*x,u=m}return i>0?l/i:o}function Ma(t,e){return((1+t/100)/(1+e/100)-1)*100}function wn(t,e,a,o){const n=pt(e,a,o);return n>0?t/n:t}function Sn(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,n=e.saludUmbralDTIVerde??30,s=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],r=e.saludExcluirHipoteca||!1,{ingresos:l=0,cuotas:u=0,cuotasHipoteca:h=0,gastosBasicos:d=0,gastosOtros:m=0,amortizaciones:x=0}=t,y=l-u-x-d-m,$=y,A=l>0?$/l*100:null,v=r?u-h:u,b=l>0?v/l*100:null,f=l>0?u/l*100:null,I=l>0?(d+u+x)/l*100:null,p=l>0?m/l*100:null,g=(S,j,_)=>S===null?"neutral":S>=j?"verde":S>=_?"amarillo":"rojo",w=(S,j,_)=>S===null?"neutral":S<=j?"verde":S<=_?"amarillo":"rojo";return{ingresos:l,cuotas:u,cuotasHipoteca:h,gastosBasicos:d,gastosOtros:m,amortizaciones:x,ahorroBruto:y,ahorroReal:$,tasaAhorro:A,dti:b,dtiTotal:f,excluyeHipoteca:r,pctNecesidades:I,pctDeseos:p,semAhorro:g(A,a,o),semDTI:w(b,n,s),semNecesidades:w(I,i[0],i[0]+15),semDeseos:w(p,i[1],i[1]+10),semAhorroRegla:g(A,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function mt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function rt(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function Wt(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];a&&o.push({fecha:a,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,i)=>{s.fecha>=a&&o.push({...s,prioridad:i})}),o.sort((s,i)=>i.fecha.localeCompare(s.fecha)||i.prioridad-s.prioridad);const n=o.find(s=>s.fecha<=e);return n?n.saldo:t.saldoInicial||0}else{const n=[...t.historicoSaldos||[]].sort((s,i)=>i.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=e);return n?n.saldo:0}}function ze(t,e){const a=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return a?e.filter(o=>a.includes(o._id)):e.filter(o=>o.activo&&!o.simulacion)}function Ca(t,e,a=0){const o=ze(t,e).reduce((n,s)=>n+rt(s),0);return t.usarColchon!==!1?Math.max(0,o-a):o}function Mn(t,e,a){if(!t.targetAmount||t.targetAmount<=0)return null;const o=ze(t,e);if(o.length===0)return null;const n=a.hoy??new Date,s=a.horizonteMeses??120,i=t.usarColchon!==!1,r=o.map(l=>({acc:l,eventos:a.extractoCuenta(l),cursor:0,saldo:rt(l)}));for(let l=1;l<=s;l++){const u=new Date(n.getFullYear(),n.getMonth()+l,1),h=`${u.getFullYear()}-${String(u.getMonth()+1).padStart(2,"0")}`,d=V(new Date(u.getFullYear(),u.getMonth()+1,0));let m=0;for(const y of r){for(;y.cursor<y.eventos.length&&y.eventos[y.cursor].fecha<=d;)y.saldo=y.eventos[y.cursor].saldoAcum??y.saldo,y.cursor++;m+=y.saldo}const x=i?a.colchonEnFecha(d):0;if(m-x>=t.targetAmount)return h}return null}function Ea(t,e){const a=t.escenarioIds||[];return a.length===0?!0:!!e&&a.includes(e)}function ja(t,e){const a=o=>Ea(o,e);return{loans:t.loans.filter(a).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}const Fe=t=>t.slice(0,7);function Cn(t){const[e,a]=t.split("-").map(Number);return`${a===12?e+1:e}-${String(a===12?1:a+1).padStart(2,"0")}`}function Pe(t,e,a){if(t.length===0)return[];const o=new Map;for(const u of t)u.saldoAcum!==void 0&&o.set(Fe(u.fecha),u.saldoAcum);const n=t[0];let s=(n.saldoAcum??0)-(n.delta??0);const i=Fe(e||n.fecha),r=Fe(a||t[t.length-1].fecha);if(r<i)return[];const l=[];for(let u=i;u<=r;u=Cn(u)){const h=o.get(u);h!==void 0&&(s=h);const[d,m]=u.split("-").map(Number);l.push({x:G(V(new Date(d,m-1,15))).getTime(),mes:u,y:s})}return l}function De(t,e){let a=null;for(const o of t){if(o.fecha>e)break;o.saldoAcum!==void 0&&(a=o.saldoAcum)}return a}function En(t){const e=a=>!a.simulacion;return{loans:t.loans.filter(e).map(a=>({...a,amortizaciones:(a.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}function jn(t){const e=a=>!!a.simulacion;return t.loans.some(a=>e(a)||(a.amortizaciones||[]).some(e))||t.expenses.some(e)||t.nominas.some(e)||t.accounts.some(e)}const gt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ut(t,e){const a=[...e].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=a.length-1;s>=0;s--){const[i,r]=a[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function Te(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,n=Math.min(2e3,a),s=Math.max(0,a-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function wt(t,e){return Te(t,e).baseImponible}function _a(t,e){return ut(t,e)/12}const jt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Ne(t,e){if(!t||t<=0)return 0;const a=e||jt;let o=0,n=t;for(let s=0;s<a.length;s++){const[i,r]=a[s],l=s<a.length-1?a[s+1][0]:1/0,u=Math.min(n,l-i);if(!(u<=0)&&(o+=u*(r/100),n-=u,n<=0))break}return o}function Ot(t,e){if(mt(t)!=="inversion")return null;const a=rt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,a-o),s=Ne(n,e);return{saldo:a,costBase:o,plusvalia:n,impuesto:s,neto:a-s}}function ve(t,e=new Date){var m;if(mt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=rt(t),n=V(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),s=[...t.aportaciones||[]].sort((x,y)=>x.fecha.localeCompare(y.fecha));let i=0;const r=s.reduce((x,y)=>x+y.cantidad,0);for(const x of s)x.fecha<=n&&(i+=x.cantidad);const l=Math.max(0,o-r),u=r>0?i/r:0,h=Math.min(o,i+l*u),d=Math.max(0,o-h);return{saldo:o,disponible:h,bloqueado:d,costBase:r,beneficio:l,numAportaciones:s.length,proxDesbloqueo:((m=s.find(x=>x.fecha>n))==null?void 0:m.fecha)||null}}function za(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(mt(t)!=="pension"||!o)return 0;const n=rt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((u,h)=>u+h.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(e*r*o/100).toFixed(2)}function Re(t,e,a){var l;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(e||[]).filter(u=>(u.grupoNomina||"")===o&&u.activo!==!1).reduce((u,h)=>u+(h.bruto||0)*(h.nPagas||12),0),i=[...a||[]].sort((u,h)=>u[0]-h[0]);let r=((l=i[0])==null?void 0:l[1])||19;for(const[u,h]of i)if(s>=u)r=h;else break;return r}const Oe=6.35;function _t(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function Fa(t){return Math.max(0,(t.bruto||0)-_t(t))}function _n(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function zn(t){const e=t.reduce((i,r)=>i+(r.bruto||0),0),a=t.reduce((i,r)=>i+_t(r),0),o=Math.max(0,e-a),n=wt(e,a),s=new Map;for(const i of t)s.set(i._id,o>0?n*(Fa(i)/o):0);return s}function qe(t,e,a){if(t.irpfModo==="manual")return Fa(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return ut(wt(t.bruto||0,_t(t)),a);const o=_n(e.filter(i=>i.irpfModo!=="manual")),n=zn(e);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return ut(s+r,a)-ut(s,a);s+=r}return ut(wt(t.bruto||0,_t(t)),a)}function Fn(t,e){return t.reduce((a,o)=>a+qe(o,t,e),0)}function Pn(t,e){var n;const a=[...e||[]].sort((s,i)=>s[0]-i[0]);let o=((n=a[0])==null?void 0:n[1])??19;for(const[s,i]of a)if(t>=s)o=i;else break;return o}function Pa(t,e){if(!t||t.length===0)return 0;const a=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+_t(s),0);return Pn(wt(a,o),e)}function Le(t,e,a){const o=t.bruto||0,n=_t(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??Oe,l=s*(r/100),u=qe(t,e,a);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:l,irpfAnual:u,irpfPct:s>0?u/s*100:0,netoPorPaga:(s-l-u)/i}}function Dn(t){const e=new Map,a=[];for(const o of t){const n=o.grupoNomina||"";if(!n){a.push(o);continue}const s=e.get(n)??[];s.push(o),e.set(n,s)}return{grupos:e,sueltas:a}}const zt=1500;function Da(t){const e=t.cuantia||0,a=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?e*12/a:t.tipoFrecuencia==="diaria"?e*365.25/a:e}const Kt=t=>{const e=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(e)?e:0};function Tn(t,e){const a=t.grupoNomina||"";return a?e.filter(o=>(o.grupoNomina||"")===a):null}function Ta(t,e){return t.reduce((a,o)=>a+qe(o,Tn(o,t),e),0)}function Na(t){const{nominas:e,tramosGeneral:a,tramosAhorro:o}=t,n=t.extras??{},s=e.reduce((S,j)=>S+(j.bruto||0),0),i=e.reduce((S,j)=>S+_t(j),0),r=Te(s,i),l=t.aportacionesPension,u=zt,h=Math.min(l,u),d=Math.max(0,r.RNT-r.reducArt20-h),m=Kt(n.capInmobiliario),x=Kt(n.capMobiliario),y=Kt(n.gananciasFondos),$=Kt(n.otrasCorto),A=Kt(n.retCapital),v=Math.max(0,d+t.otrosIngresos+m+$),b=Math.max(0,x+y),f=ut(v,a),I=ut(b,o),p=f+I,g=Ta(e,a),w=g+A;return{brutoTotal:s,flexTotal:i,brutoIRPF:r.baseIRPF,cotizSS:r.cotizSS,gastosArt19:r.gastosArt19,RNT:r.RNT,reducArt20:r.reducArt20,aportPP:l,limPP:u,deducPP:h,RNTred:d,otrosIngresos:t.otrosIngresos,capInmobiliario:m,capMobiliario:x,gananciasFondos:y,otrasCorto:$,baseGeneral:v,baseAhorro:b,cuotaGen:f,cuotaAho:I,cuotaIntegra:p,retNomina:g,retCapital:A,totalRet:w,resultado:p-w}}const Nn=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:zt,TRAMOS_AHORRO_DEFAULT:jt,TRAMOS_IRPF_DEFAULT:gt,ajustarFechaPago:ya,ajustarPrecioReal:wn,calcBaseImponibleTrabajo:wt,calcFactorInflacion:pt,calcFondoInversion:Ot,calcFondosPension:ve,calcGananciasCapital:Ne,calcIRPF:ut,calcImpuestoPension:za,calcInflacionMediaAnual:Sa,calcSaludFinanciera:Sn,calcTAE:$a,calcTipoMarginalPension:Re,calcTipoRealFisher:Ma,calcularDeclaracion:Na,clampedDate:ha,cuentasDelObjetivo:ze,cuotaMensual:Rt,desgloseBaseTrabajo:Te,diasEntre:Jt,filtrarPorEscenario:ja,formatEUR:E,formatLocalDate:V,formatPct:xa,fromCents:et,haySimulaciones:jn,ingresoAnual:Da,labelDiaPago:_e,lastDayOfMonth:je,modeloFondoDe:mt,parseLocalDate:G,proyectarFechaCumplimiento:Mn,resolverDiaEfectivo:fe,resumenPrestamo:at,resumenPrestamoConAhorro:wa,retencionMensual:_a,retencionesNomina:Ta,roundMoney:W,saldoEnFecha:Wt,saldoEnFechaExtracto:De,saldoParaObjetivo:Ca,saldoRealCuenta:rt,serieMensual:Pe,sinSimulaciones:En,tablaAmortizacion:Ia,toCents:It,todayISO:Y,visibleEnEscenario:Ea},Symbol.toStringTag,{value:"Module"}));function Qt(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const r=G(i.fechaInicio||e.start),l=i.fechaFin?G(i.fechaFin):s,u=i.cuantia,h=d=>o.push({fecha:d,concepto:i.concepto,cuantia:u,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=l&&h(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let m=r.getFullYear(),x=r.getMonth();const y=Math.ceil(240/d)+2;for(let $=0;$<y;$++){const A=fe(m,x,i.diaPago||"")||(()=>{const b=r.getDate(),f=new Date(m,x+1,0).getDate();return V(new Date(m,x,Math.min(b,f)))})(),v=G(A);if(v>s||v>l)break;v>=n&&v>=r&&h(A),x+=d,x>=12&&(m+=Math.floor(x/12),x=x%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let m=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const x=Math.ceil((n.getTime()-r.getTime())/d);m=new Date(r.getTime()+x*d)}for(;m<=s&&m<=l;)h(V(m)),m=new Date(m.getTime()+d)}}return o}function Ra(t,e,a=null){const o=[];for(const n of t){if(!n.activo||a&&a.length>0&&!a.includes(n.cuenta||"default"))continue;const{tabla:s}=at(n);for(const i of s)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function Oa(t,e,a=null,o={accounts:[]}){const n=[],s=G(e.start),i=G(e.end),r=o.accounts||[],l=o.nominas||[],u=o.resolverTramosIRPF||(()=>gt),h=o.resolverTramosGanancias||(()=>jt),d=m=>{var x;return((x=r.find(y=>y._id===m))==null?void 0:x.nombre)??m};for(const m of t){if(!m.activo||m.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(m.cuenta||"default")||a.includes(m.cuentaDestino||"default")))continue;const x=G(m.fechaInicio||e.start),y=m.fechaFin?G(m.fechaFin):i,$=A=>{const v=r.find(P=>P._id===(m.cuenta||"default")),b=r.find(P=>P._id===(m.cuentaDestino||"default")),f=mt(v),I=mt(b),p=f==="inversion"&&I==="inversion"||f==="pension"&&I==="pension",g=["transferencia",...p?["traspaso"]:[],...m.tags||[]],w=p?"traspaso-out":"transfer-out",S=p?"traspaso-in":"transfer-in",j=!a||a.length===0||a.includes(m.cuenta||"default"),_=!a||a.length===0||a.includes(m.cuentaDestino||"default");if(j&&n.push({fecha:A,concepto:`Transf. → ${d(m.cuentaDestino||"default")}: ${m.concepto}`,cuantia:m.cuantia,tipo:"gasto",tags:g,cuenta:m.cuenta||"default",sourceId:m._id,sourceType:w}),_&&n.push({fecha:A,concepto:`Transf. ← ${d(m.cuenta||"default")}: ${m.concepto}`,cuantia:m.cuantia,tipo:"ingreso",tags:g,cuenta:m.cuentaDestino||"default",sourceId:m._id,sourceType:S}),j&&!p&&v){if(f==="inversion"){const P=parseInt(A.slice(0,4)),C=Ot(v,h(P));if(C&&C.saldo>0&&C.plusvalia>0){const M=Math.min(1,m.cuantia/C.saldo),F=C.plusvalia*M*.19;F>.01&&n.push({fecha:A,concepto:`Retención IRPF reembolso ${v.nombre} (19% s/plusvalía)`,cuantia:F,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:m.cuenta||"default",sourceId:m._id,sourceType:"investment-tax"})}}else if(f==="pension"){const P=u(parseInt(A.slice(0,4))),C=Re(v,l,P),M=za(v,m.cuantia,C||void 0);if(M>0){const z=v.grupoNomina?`IRPF rescate ${v.nombre} (tipo marginal grupo "${v.grupoNomina}": ${C}%)`:`Retención rescate ${v.nombre} (${v.impuestoRetirada}% s/beneficio)`;n.push({fecha:A,concepto:z,cuantia:M,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:m.cuenta||"default",sourceId:m._id,sourceType:"pension-tax"})}}}};if(m.tipoFrecuencia==="extraordinario")x>=s&&x<=i&&x<=y&&$(m.fechaInicio);else if(m.tipoFrecuencia==="mensual"){const A=Math.max(1,m.frecuencia||1);let v=x.getFullYear(),b=x.getMonth();const f=Math.ceil(240/A)+2;for(let I=0;I<f;I++){const p=fe(v,b,m.diaPago||"")||(()=>{const w=x.getDate(),S=new Date(v,b+1,0).getDate();return V(new Date(v,b,Math.min(w,S)))})(),g=G(p);if(g>i||g>y)break;g>=s&&g>=x&&$(p),b+=A,b>=12&&(v+=Math.floor(b/12),b=b%12)}}else if(m.tipoFrecuencia==="diaria"){const A=Math.max(1,m.frecuencia||1)*864e5;let v=new Date(Math.max(x.getTime(),s.getTime()));if(x<s){const b=Math.ceil((s.getTime()-x.getTime())/A);v=new Date(x.getTime()+b*A)}for(;v<=i&&v<=y;)$(V(v)),v=new Date(v.getTime()+A)}}return n}function qa(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){const r=mt(i);if(r==="cuenta"||!i.activo)continue;const l=i.planAportaciones||[];for(const u of l){if(!u.importe||u.importe<=0)continue;const h=G(u.fechaInicio||e.start),d=u.fechaFin?G(u.fechaFin):s,m=u.cuentaOrigen||"default",x=!a||!a.length||a.includes(m),y=!a||!a.length||a.includes(i._id),$=r==="pension"?"pension":"capital-mobiliario",A=p=>{x&&o.push({fecha:p,concepto:`Aportación → ${i.nombre}`,cuantia:u.importe,tipo:"gasto",tags:["aportacion","transferencia",$],cuenta:m,sourceId:u._id,sourceType:"aportacion-out"}),y&&o.push({fecha:p,concepto:`Aportación ${i.nombre} (${u.periodicidad||"mensual"})`,cuantia:u.importe,tipo:"ingreso",tags:["aportacion","transferencia",$],cuenta:i._id,sourceId:u._id,sourceType:"aportacion-in"})},v={mensual:1,trimestral:3,semestral:6,anual:12}[u.periodicidad||"mensual"]||1;let b=h.getFullYear(),f=h.getMonth();const I=Math.ceil(240/v)+2;for(let p=0;p<I;p++){const g=new Date(b,f+1,0).getDate(),w=V(new Date(b,f,Math.min(h.getDate(),g))),S=G(w);if(S>s||S>d)break;S>=n&&S>=h&&A(w),f+=v,f>=12&&(b+=Math.floor(f/12),f=f%12)}}}return o}function La(t,e,a=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||a&&a.length>0&&!a.includes(s._id))continue;const i=G(e.start),r=G(e.end),l=s.periodoCobro||"mensual",u=l==="mensual",h=u?null:{diario:864e5,semanal:7*864e5}[l]||864e5,d=u?1/12:h/(365.25*864e5);let m=Wt(s,e.start);const x=o.filter(A=>A.cuenta===s._id).map(A=>({fecha:A.fecha,delta:A.tipo==="ingreso"?Math.abs(A.cuantia):-Math.abs(A.cuantia)})).sort((A,v)=>A.fecha.localeCompare(v.fecha));let y=0,$=new Date(i);for(;$<=r;){const A=u?new Date($.getFullYear(),$.getMonth()+1,$.getDate()):new Date($.getTime()+h),v=new Date(Math.min(A.getTime(),r.getTime()+1)),b=V(v);let f=0;for(;y<x.length&&x[y].fecha<b;)f+=x[y].delta,y++;const I=m,p=m+f,g=Math.max(0,(I+p)/2);m=p;const w=u?d:(v.getTime()-$.getTime())/(365.25*864e5),S=g*(Math.pow(1+s.interes/100,w)-1);S>.001&&n.push({fecha:V($),concepto:`Interés ${s.nombre}`,cuantia:S,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),$=A}}return n}function Ba(t,e,a,o=null){const n=[],s=e||gt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),l=_a(r,s),u={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:l,tags:["irpf","fiscal"]};n.push(...Qt([u],a,o))}return n}const Rn=[5,11,2,8],On={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function ka(t,e,a=null,o=[],n=()=>gt){const s=[],i=G(e.start),r=G(e.end),l=o.length>0,u={};for(const m of t){const x=m.grupoNomina||"";u[x]||(u[x]=[]),u[x].push(m)}for(const m of Object.keys(u))u[m].sort((x,y)=>(y.bruto||0)-(x.bruto||0));function h(m,x){if(!l||!m.mesActualizacionIPC)return m.bruto||0;const y=m.fechaInicio||e.start,$=G(y),A=G(x);let v=0;for(let f=$.getFullYear();f<=A.getFullYear();f++){const I=new Date(f,m.mesActualizacionIPC-1,1);I>$&&I<=A&&v++}if(v===0)return m.bruto||0;const b=V(new Date($.getFullYear()+v,0,1));return(m.bruto||0)*pt(o,y,b)}function d(m,x){const y=h(m,x),$=(m.retribucionFlexible||[]).reduce((P,C)=>P+(C.importe||0)*12,0),A=Math.max(0,y-$);if(m.irpfModo==="manual")return A*((m.irpfPct||0)/100);const v=n(parseInt(x.slice(0,4))),b=m.grupoNomina||"";if(!b)return ut(wt(y,$),v);const f=u[b].filter(P=>P.activo),I=f.reduce((P,C)=>P+h(C,x),0),p=f.reduce((P,C)=>P+(C.retribucionFlexible||[]).reduce((M,z)=>M+(z.importe||0)*12,0),0),g=Math.max(0,I-p),w=wt(I,p),S=Math.max(0,y-$),j=g>0?w*(S/g):0,_=f.filter(P=>P._id!==m._id&&(P.bruto||0)>(m.bruto||0)).reduce((P,C)=>{const M=(C.retribucionFlexible||[]).reduce((F,T)=>F+(T.importe||0)*12,0),z=Math.max(0,h(C,x)-M);return P+(g>0?w*(z/g):0)},0);return ut(_+j,v)-ut(_,v)}for(const m of t){if(!m.activo)continue;const x=m.cuenta||"default";if(a&&a.length>0&&!a.includes(x))continue;const y=Math.max(1,m.nPagas||12),$=G(m.fechaInicio||e.start),A=m.fechaFin?G(m.fechaFin):r,v=b=>{const f=h(m,b),I=d(m,b),p=(m.retribucionFlexible||[]).reduce((M,z)=>M+(z.importe||0)*12,0),g=Math.max(0,f-p),w=(m.ssPct??6.35)/100,S=g*w,j=g/y,_=I/y,P=S/y,C=m.representacion==="simplificado"?j-P-_:j;s.push({fecha:b,concepto:m.nombre,cuantia:C,tipo:"ingreso",cuenta:x,tags:m.tags||[],sourceId:m._id,sourceType:"nomina"}),m.representacion==="detallado"&&(P>0&&s.push({fecha:b,concepto:`SS ${m.nombre}`,cuantia:P,tipo:"gasto",cuenta:x,tags:["seguridad-social","fiscal"],sourceId:m._id+"_ss",sourceType:"nomina"}),_>0&&s.push({fecha:b,concepto:`IRPF ${m.nombre}`,cuantia:_,tipo:"gasto",cuenta:x,tags:["irpf","fiscal"],sourceId:m._id+"_irpf",sourceType:"nomina"}));for(const M of m.retribucionFlexible||[])!M.cuenta||!(M.importe>0)||a&&a.length>0&&!a.includes(M.cuenta)||s.push({fecha:b,concepto:`${m.nombre} — ${On[M.tipo]||M.tipo}`,cuantia:M.importe,tipo:"ingreso",cuenta:M.cuenta,tags:["retribucion-flexible",M.tipo],sourceId:`${m._id}_flex_${M._id||M.tipo}`,sourceType:"nomina"})};if(y<=12){const b=y===12?1:Math.round(12/y),f=$.getDate();let I=$.getFullYear(),p=$.getMonth();for(let g=0;g<300;g++){const w=new Date(I,p+1,0).getDate(),S=new Date(I,p,Math.min(f,w));if(S>r||S>A)break;S>=i&&S>=$&&v(V(S)),p+=b,p>=12&&(I+=Math.floor(p/12),p=p%12)}}else{const b=y-12,f=$.getDate();let I=$.getFullYear(),p=$.getMonth();for(let S=0;S<300;S++){const j=new Date(I,p+1,0).getDate(),_=new Date(I,p,Math.min(f,j));if(_>r||_>A)break;_>=i&&_>=$&&v(V(_)),p++,p>=12&&(I++,p=0)}const g=Math.max($.getFullYear(),i.getFullYear()),w=Math.min((m.fechaFin?A:r).getFullYear(),r.getFullYear());for(let S=g;S<=w;S++)for(const j of Rn.slice(0,b)){const _=new Date(S,j,15);_>=i&&_<=r&&_>=$&&_<=A&&v(V(_))}}}return s}function Ha(t,e,a,o=null,n="default"){const s=[];if(!e||e.length===0)return s;const i=G(a.start),r=G(a.end),l=Y(),u=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let h=new Date(i.getFullYear(),i.getMonth(),1);for(;h<=r;){const d=h.getFullYear(),m=h.getMonth(),x=d+"-"+String(m+1).padStart(2,"0"),y=x+"-01",$=V(new Date(d,m+1,0)),A=V(new Date(d,m,15));let v=0;for(const b of u){if(o&&o.length>0&&!o.includes(b.cuenta||"default")||b.fechaInicio&&b.fechaInicio>$||b.fechaFin&&b.fechaFin<y)continue;const f=b.fechaInicio||l,I=pt(e,f,A);if(I<=1)continue;const p=Math.max(1,b.frecuencia||1);v+=b.cuantia*(I-1)/p}v>.01&&s.push({fecha:A,concepto:"Incremento coste de vida",cuantia:v,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+x,sourceType:"inflacion"}),h=new Date(d,m+1,1)}return s}function Ga(t,e,a,o="default"){const n=[];if(!e||e.length===0||t<=0)return n;const s=G(a.start),i=G(a.end),r=[...e].sort((u,h)=>u.year-h.year);let l=new Date(s.getFullYear(),s.getMonth(),1);for(;l<=i;){const u=l.getFullYear(),h=l.getMonth(),d=u+"-"+String(h+1).padStart(2,"0"),m=V(new Date(u,h,15)),x=r.filter(b=>b.year<=u),y=x.length>0?x[x.length-1]:r[0],$=y?y.tasa/100:0,A=Math.pow(1+$,1/12)-1,v=t*A;v>.01&&n.push({fecha:m,concepto:"Pérdida ahorro por inflación",cuantia:v,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),l=new Date(u,h+1,1)}return n}function Va(t,e,a){const o=a.fechaReferencia||a.dashboardStart,n=o<a.dashboardStart?a.dashboardStart:o>a.dashboardEnd?a.dashboardEnd:o,s=e.reduce((d,m)=>d+Wt(m,n),0),i=t.filter(d=>d.fecha<n),r=t.filter(d=>d.fecha>=n),l=[];let u=s;for(const d of[...i].reverse()){const m=d.tipo==="ingreso"?Math.abs(d.cuantia):-Math.abs(d.cuantia);l.unshift({...d,delta:m,saldoAcum:u}),u-=m}const h=[];u=s;for(const d of r){const m=d.tipo==="ingreso"?Math.abs(d.cuantia):-Math.abs(d.cuantia);u+=m,h.push({...d,delta:m,saldoAcum:u})}return[...l,...h]}function qn(t,e,a,o=null){const n=e.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return Va([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,a)}function Xt(t){const{loans:e,expenses:a,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],l={start:n.dashboardStart,end:n.dashboardEnd},u=a.filter($=>$.tipo!=="transferencia"),h=a.filter($=>$.tipo==="transferencia"),d={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let m=[];m=m.concat(Qt(u,l,s)),m=m.concat(Ra(e,l,s)),m=m.concat(Oa(h,l,s,d)),m=m.concat(qa(o,l,s));const x=La(o,l,s,m);if(m=m.concat(x),m=m.concat(Ba(a,n.tramos_irpf,l,s)),m=m.concat(ka(i,l,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const $=(o.find(b=>b.activo&&b.esCuentaPrincipal)||o.find(b=>b.activo)||{_id:"default"})._id;m=m.concat(Ha(u,r,l,s,$));const v=o.filter(b=>b.activo&&(!s||s.length===0||s.includes(b._id))).reduce((b,f)=>b+Wt(f,n.dashboardStart),0);m=m.concat(Ga(v,r,l,$))}m.sort(($,A)=>$.fecha.localeCompare(A.fecha));const y=o.filter($=>$.activo&&(!s||s.length===0||s.includes($._id)));return Va(m,y,n)}function Ln(t,e,a=null){const o=Y(),s=e.filter(r=>r.activo&&(!a||a.length===0||a.includes(r._id))).reduce((r,l)=>r+rt(l),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function Ua(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])a.set(n,(a.get(n)||0)+Math.abs(o.cuantia));return a}function Bn(t,e){const a=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${E(i)}) a partir del ${s.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${E(i)} < ${E(e)}) desde ${s.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${E(i)})`})))}return a}function kn(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=G(e.dashboardStart),n=G(e.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return a/s}function Hn(t,e,a=Y()){const o=new Set,n=e.map(r=>{const l=r.fechaInicialSaldo||"",u={};l&&l<=a&&(u[l]=r.saldoInicial||0);for(const h of r.historicoSaldos||[])h.fecha<=a&&(!l||h.fecha>=l)&&(u[h.fecha]=h.saldo);return Object.keys(u).forEach(h=>o.add(h)),u}),s={};for(const r of[...o].sort()){let l=0;for(let u=0;u<e.length;u++){const h=Object.entries(n[u]).filter(([d])=>d<=r);h.length>0?(h.sort(([d],[m])=>m.localeCompare(d)),l+=h[0][1]):l+=e[u].saldoInicial||0}s[r]=l}const i=[];for(const[r,l]of Object.entries(s).sort(([u],[h])=>u.localeCompare(h))){const u=t.filter(x=>x.fecha<=r),h=u.length>0?u[u.length-1].saldoAcum:null;if(h===null)continue;const d=l-h,m=h!==0?d/Math.abs(h)*100:0;i.push({cuenta:"Total",fecha:r,estimado:h,real:l,desv:d,pct:m})}return i}const Gn=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:Hn,detectarPuntosCriticos:Bn,mediaMensualGastos:kn},Symbol.toStringTag,{value:"Module"}));function Zt(t,e=new Date){const a=V(e),o=new Date(e);o.setMonth(o.getMonth()+1);const n=V(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Qt(s,{start:a,end:n}).reduce((r,l)=>r+Math.abs(l.cuantia),0)}function Be(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+Rt(a.capital,a.tin,a.meses),0)}function Ya(t,e,a,o){return e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0?e.colchonFijo:(Zt(t,o)+Be(a))*(e.colchonMeses||6)}function Ja(t,e,a,o,n){const i=[...e.colchonPuntos||[]].sort((l,u)=>l.fecha.localeCompare(u.fecha)).filter(l=>l.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(Zt(t,n)+Be(a))*(i.meses||6):Ya(t,e,a,n)}function ge(t,e,a,o,n,s=!1,i){const r=[...t.puntos||[]].sort((h,d)=>h.fecha.localeCompare(d.fecha)),l=r.filter(h=>h.fecha<=n).pop()||(s?r[0]:null);return l?l.tipo==="fijo"?l.importe||0:(Zt(e,i)+Be(o))*(l.meses||1):0}function Vn(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function Un(t,e){const a={};for(const o of e)a[o._id]=rt(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=Vn(o)),{fecha:o.fecha,saldos:{...a}}))}function Yn(t,e,a,o,n,s,i){const r=[];for(const l of(t||[]).filter(u=>u.activo!==!1)){let u=!1;for(let h=0;h<e.length;h++){const d=e[h],m=ge(l,o,n,s,d.fecha,!1,i);if(m<=0){u=!1;continue}const x=!l.cuentas||l.cuentas.length===0?d.saldoAcum:l.cuentas.reduce((y,$)=>{var A,v;return y+(((v=(A=a[h])==null?void 0:A.saldos)==null?void 0:v[$])||0)},0);x<m&&!u?(u=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:x,target:m,nombre:l.nombre,mensaje:`⚠ ${l.nombre}: ${E(x)} < ${E(m)} desde ${d.fecha}`})):x>=m&&u&&(u=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:x,target:m,nombre:l.nombre,mensaje:`✓ ${l.nombre}: recuperado el ${d.fecha}`}))}}return r}const Jn=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Ya,calcColchonEnFecha:Ja,calcGastoBasicoMensual:Zt,calcMargenEnFecha:ge,detectarCrucesMargenes:Yn,saldosPorCuentaEnExtracto:Un},Symbol.toStringTag,{value:"Module"}));function Wn(t){if(!t||t.showColchon===!1)return null;const e=t.colchonPuntos??[];return e.length>0?{nombre:"Colchón",puntos:[...e]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function Wa(t,e){return Jt(G(t),G(e))}const Kn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ka(t,e){const[a,o,n]=t.split("-").map(Number),s=t.slice(0,4)===e.slice(0,4);return`${n} de ${Kn[o-1]}${s?"":` de ${a}`}`}function Qa(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Qn(t,e={}){const{hoy:a=Y(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=e,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:m=>m?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:m=>`El ${m} el saldo proyectado baja a ${E(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:m=>m?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:m=>`El ${m} el saldo queda en ${E(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:m=>m?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:m=>`El ${m} tendrías ${E(d.saldo)}, y el margen pide ${E(d.target)}.`});const l=new Map;for(const d of r){const m=l.get(d.id);(!m||d.fecha<m.fecha)&&l.set(d.id,d)}const u=[];for(const d of l.values()){const m=Wa(a,d.fecha);if(m<0||m>(d.gravedad==="critico"?o:n))continue;const x=i?i(m):0,y=x>0&&d.distancia<x;u.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:m,plazo:Qa(m),titulo:d.titulo(y),detalle:d.detalle(Ka(d.fecha,a)),incierto:y})}const h={critico:0,aviso:1};return u.sort((d,m)=>d.fecha.localeCompare(m.fecha)||h[d.gravedad]-h[m.gravedad]),u.slice(0,s)}const Xn=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:Wn,construirAvisos:Qn,describirPlazo:Qa,diasEntreISO:Wa,fechaEnPalabras:Ka},Symbol.toStringTag,{value:"Module"}));class Zn extends Error{constructor(a,o){super(`La funcionalidad "${a}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);$n(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=a}}let te=null;function ts(t){const e=te;return te=t,()=>{te=e}}function Xa(t){return te?te(t):!0}function Za(t,e){if(!Xa(t))throw new Zn(t,e)}const to=[];function ke(){const t=new Map,e=new WeakMap;let a=1,o=0,n=0;const s=l=>{if(!l||typeof l!="object")return 0;const u=e.get(l);if(u)return u;const h=a++;return e.set(l,h),h},i=l=>l.map(u=>[u._id,u.capital,u.tin,u.meses,u.fechaInicio,u.comisionAmort||0,u.comisionApertura||0,u.diaPago||"",u.activo?1:0,u.cuenta||"",(u.amortizaciones||[]).map(h=>`${h.fecha}:${h.cantidad}:${h.tipo||""}`).sort().join(",")].join("|")).join(";");function r(l){const u=[i(l.loans),s(l.expenses),s(l.accounts),s(l.nominas),s(l.inflacionPeriodos),l.config.dashboardStart,l.config.dashboardEnd,l.config.fechaReferencia||"",l.config.usarInflacion?1:0,(l.filtroAccounts||[]).join(",")].join("#"),h=t.get(u);if(h)return n++,h;o++;const d=Xt(l);return t.set(u,d),d}return{statement:r,stats:()=>({hits:n,misses:o}),clear:()=>t.clear()}}function He(t,e,a,o,n={},s=ke()){Za("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:r=36,minAmortizable:l=500,tipoAmort:u="plazo",fechaPrimeraAmort:h=null,loanIds:d=null,nominas:m=to,sourceAccountId:x=null,selectedMarginIds:y=null,hoy:$=new Date}=n,A=V($),v=Math.min(120,Math.max(1,r)),b=a.filter(O=>O.activo),f=b.map(O=>O._id),I=b.find(O=>O.esCuentaPrincipal)||b[0],p=x&&f.includes(x)?b.find(O=>O._id===x):I,g=p==null?void 0:p._id,w=t.filter(O=>O.activo&&!O.simulacion&&(!d||d.includes(O._id))).sort((O,H)=>H.tin-O.tin),S=!!y&&y.length>0,j=(o.margenesSeguridad||[]).filter(O=>O.activo!==!1).filter(O=>!O.cuentas||O.cuentas.length===0||O.cuentas.includes(g)).filter(O=>!S||y.includes(O._id));if(w.length===0)return{plan:[],margenesAplicados:j.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const _={};for(const O of w)_[O._id]=[];const P=[];function C(O){const H=new Date($.getFullYear(),$.getMonth()+O,1),U=H.getFullYear(),K=H.getMonth(),Q=`${U}-${String(K+1).padStart(2,"0")}`,nt=V(new Date(U,K,Math.min(15,new Date(U,K+1,0).getDate())));return{label:Q,dia15:nt}}function M(O,H){const U=[...O.amortizaciones||[],..._[O._id]],{tabla:K}=at({...O,amortizaciones:U}),Q=K.filter(st=>st.fecha<=H);if(Q.length>0)return Q[Q.length-1].capitalPendiente;const nt=U.filter(st=>st.fecha<=H).reduce((st,vt)=>st+vt.cantidad,0);return Math.max(0,O.capital-nt)}function z(O){const H=t.map(it=>({...it,amortizaciones:[...it.amortizaciones||[],..._[it._id]||[]]})),U={...o,dashboardStart:A,dashboardEnd:O},K=s.statement({loans:H,expenses:e,accounts:a,config:U,filtroAccounts:null,nominas:m}),Q=b.reduce((it,Yt)=>it+rt(Yt),0),nt=p?rt(p):0,st=Q>0?nt/Q:1;let vt=nt,pe=Q;for(const it of K){const Yt=it.delta??(it.tipo==="ingreso"?Math.abs(it.cuantia):-Math.abs(it.cuantia));it.cuenta===g?vt+=Yt:f.includes(it.cuenta)||(vt+=Yt*st),pe=it.saldoAcum}return{source:vt,total:pe}}function F(O){const{source:H}=z(O);if(H<=0)return H;let U=0;for(const K of j){const Q=ge(K,e,o,t,O,!0,$);Q>U&&(U=Q)}return H-U}const T=2;let R=0;if(h){for(let O=0;O<v;O++)if(C(O).dia15>=h){R=O;break}}for(let O=0;O<v;O++){if((O-R)%i!==0||O<R)continue;const{label:H,dia15:U}=C(O);if(U<A)continue;const K=F(U)-T;if(K<l)continue;let Q=K,nt=0;for(const st of w){if(Q<l)break;const vt=M(st,U);if(vt<1)continue;const pe=st.comisionAmort||0,it=1+pe/100,Yt=Math.floor(Q/it),yn=Math.min(Yt,vt);if(yn<l)continue;const me=Math.min(Math.floor(yn),Math.floor(vt)),xn=+(me*pe/100).toFixed(2),ba=me+xn;ba>Q||(_[st._id].push({_id:`opt_${H}_${st._id}`,fecha:U,cantidad:me,tipo:u,simulacion:!0}),nt+=ba,P.push({mes:H,fechaAmort:U,loanId:st._id,loanNombre:st.nombre,tin:st.tin,capitalAntes:vt,cantidadAmort:me,comision:xn,capitalDespues:Math.max(0,vt-me),saldoDisponible:K+T,excedente:K,saldoDespues:K+T-nt,tipoAmort:u}),Q-=ba)}}const D=P.reduce((O,H)=>O+H.cantidadAmort,0),B=P.reduce((O,H)=>O+H.comision,0),L=w.map(O=>{const H=_[O._id];if(!H.length)return null;const U=at(O),K=at({...O,amortizaciones:[...O.amortizaciones||[],...H]});return{loanId:O._id,nombre:O.nombre,tin:O.tin,fechaFinSin:U.fechaFin,fechaFinCon:K.fechaFin,mesesAhorrados:U.mesesReales-K.mesesReales,interesesSin:U.totalIntereses,interesesCon:K.totalIntereses,ahorroIntereses:U.totalIntereses-K.totalIntereses,numAmortizaciones:H.length,totalAmortizado:H.reduce((Q,nt)=>Q+nt.cantidad,0)}}).filter(O=>O!==null),k=L.reduce((O,H)=>O+H.ahorroIntereses,0);return{plan:P,margenesAplicados:j.length,totalAmortizado:D,totalComisiones:B,totalAhorroIntereses:k,resumenPorLoan:L}}function eo(t,e,a,o,n={},s){Za("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:r=500,tipoAmort:l="plazo",fechaObjetivo:u=null,frecuencias:h=[1,2,3,6,12],fechaPrimeraAmort:d=null,loanIds:m=null,nominas:x=to,sourceAccountId:y=null,selectedMarginIds:$=null,hoy:A=new Date}=n,v=s??ke(),b=V(A),f=u||V(new Date(A.getFullYear(),A.getMonth()+i,1));function I(w){const S=t.map(C=>({...C,amortizaciones:[...C.amortizaciones||[],...w[C._id]||[]]})),j={...o,dashboardStart:b,dashboardEnd:f},_=v.statement({loans:S,expenses:e,accounts:a,config:j,filtroAccounts:null,nominas:x});if(_.length===0)return a.filter(C=>C.activo).reduce((C,M)=>C+rt(M),0);const P=_.filter(C=>C.fecha<=f);return P.length>0?P[P.length-1].saldoAcum:_[0].saldoAcum}const p=I({}),g=h.map(w=>{const S=He(t,e,a,o,{frecuencia:w,mesesHorizonte:i,minAmortizable:r,tipoAmort:l,fechaPrimeraAmort:d,loanIds:m,nominas:x,sourceAccountId:y,selectedMarginIds:$,hoy:A},v),j={};for(const P of t)j[P._id]=[];for(const P of S.plan)j[P.loanId].push({_id:P.mes+"_"+P.loanId,fecha:P.fechaAmort,cantidad:P.cantidadAmort,tipo:l,simulacion:!0});const _=I(j);return{frecuencia:w,label:w===1?"Mensual":`Cada ${w} meses`,numAmortizaciones:S.plan.length,totalAmortizado:S.totalAmortizado,totalComisiones:S.totalComisiones,ahorroIntereses:S.totalAhorroIntereses,saldoObjetivo:_,gananciaSaldo:_-p,valorTotal:S.totalAhorroIntereses+(_-p),plan:S.plan,resumenPorLoan:S.resumenPorLoan}}).filter(w=>w.numAmortizaciones>0);if(g.length>0){const w=Math.max(...g.map(_=>_.ahorroIntereses)),S=Math.max(...g.map(_=>_.saldoObjetivo)),j=Math.max(...g.map(_=>_.valorTotal));g.forEach(_=>{_.esMejorIntereses=_.ahorroIntereses===w,_.esMejorSaldo=_.saldoObjetivo===S,_.esMejorValor=_.valorTotal===j})}return{resultados:g,saldoBase:p,fechaObjetivo:f}}const es=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:eo,createStatementMemo:ke,defaultHoyISO:Y,optimizarAmortizaciones:He},Symbol.toStringTag,{value:"Module"})),as=30.44*864e5;function ao(t){const e=t.getFullYear(),a=t.getMonth();return{desde:V(new Date(e,a,1)),hasta:V(new Date(e,a,je(e,a)))}}function oo(t){const[e,a]=t.split("-").map(Number);return ao(new Date(e,a-1,1))}function os(t,e){return Math.max(1,(G(e).getTime()-G(t).getTime())/as)}const ns=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),St=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function ss(t,e){const a=new Map(e.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=a.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function is(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=m=>m.sourceType==="loan"&&m.tipo==="gasto",n=e.loanIdsIniciados,s=St(t.filter(m=>m.tipo==="ingreso")),i=St(t.filter(m=>o(m)&&(!n||n.has(m.sourceId??"")))),r=St(t.filter(m=>o(m)&&e.hipotecaIds.has(m.sourceId??""))),l=St(t.filter(m=>m.sourceType==="loan-amort")),u=St(t.filter(m=>m.sourceType==="account-interest")),{basicos:h,deseo:d}=ss(t,e.expenses);return{ingresos:s/a,cuotas:i/a,cuotasHipoteca:r/a,amortizaciones:l/a,gastosBasicos:h/a,gastosDeseo:d/a,gastosTotales:(i+h+d)/a,intereses:u/a}}function no(t,e){return t.reduce((a,o)=>{const n=at(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=e);return a+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function rs(t,e,a,o){const n=t.filter(u=>u.activo&&!u.simulacion&&(u.fechaInicio||"")<=a),s=n.reduce((u,h)=>{if((h.amortizaciones||[]).filter(y=>y.fecha>=e&&y.fecha<=a).length===0)return u;const m=at(h).totalIntereses,x=at({...h,amortizaciones:(h.amortizaciones||[]).filter(y=>y.fecha<e||y.fecha>a)}).totalIntereses;return u+Math.max(0,x-m)},0),i=n.filter(u=>u.mostrarFechaFinEnDashboard!==!1).map(u=>({loan:u,fechaFin:at(u).fechaFin})).filter(u=>!!u.fechaFin&&u.fechaFin>=e&&u.fechaFin<=a),r=n.map(u=>at(u).tabla),l=u=>{const{desde:h,hasta:d}=oo(u);return r.reduce((m,x)=>{const y=x.find($=>!$.esAmortizacion&&$.fecha>=h&&$.fecha<=d);return m+(y?y.cuota:0)},0)};return{deudaInicio:no(n,e),deudaFin:no(n,a),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:l(e.slice(0,7)),cuotasFin:l(a.slice(0,7)),finEnPeriodo:i}}function ls(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:St(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function so(t,e=new Set,a="desglosado"){if(e.size===0)return Ua(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(u=>e.has(u)),r=s.filter(u=>!e.has(u)),l=a==="porgrupos"&&i.length>0?i:r;for(const u of l)o.set(u,(o.get(u)||0)+Math.abs(n.cuantia))}return o}function cs(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...so(t,e.grupoTags,e.modo).entries()].filter(([n])=>!a||a.size===0||a.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function ds(t,e){const a=e.reduce((o,n)=>o+rt(n),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:St(t.filter(o=>o.tipo==="gasto")),totalIngresos:St(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function us(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function ps(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function ms(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}function fs(t,e){if(t.length===0)return[];const a=u=>e==="mes"?u.slice(0,7):u.slice(0,4),o=u=>e==="mes"?`${u}-01`:`${u}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let l=null;for(const u of t){const h=a(u.fecha),d=u.saldoAcum??i;(!l||l.periodo!==h)&&(l&&(i=l.cierre),l={periodo:h,inicio:o(h),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(l)),l.cierre=d,d>l.maximo&&(l.maximo=d),d<l.minimo&&(l.minimo=d),l.eventos+=1}return r}const vs=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:fs,cuentasVisibles:us,gastoPorTagOrdenado:cs,idsHipoteca:ps,idsPrestamosIniciados:ms,interesesPorCuenta:ls,mesesDelPeriodo:os,metricasFlujo:is,rangoMes:oo,rangoMesDe:ao,resumenPrestamosPeriodo:rs,sinTransferencias:ns,sumarGastosPorTag:so,totalesPeriodo:ds},Symbol.toStringTag,{value:"Module"}));function gs(t,e,a){const o=t||[];if(!o.length)return e;const n=o.find(i=>i.año===a);if(n)return n.tramos;const s=o.filter(i=>i.año<a).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:e}function bt(t,e){return a=>gs(t,e,a)}const ee=8,io=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],ro=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Ge(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}function lo(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:io,tramosGananciasCapital:ro,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function co(t,e){return{loans:[],expenses:[],accounts:[Ge(t)],nominas:[],goals:[],planes:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],config:lo(t,e)}}const ht=t=>Array.isArray(t)?t:[],bs=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function ae(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function uo(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function Ve(t){const{varianza:e,inflacion:a,...o}=t;return o}function hs(t,e){const{hoyISO:a,finISO:o}=e,n={...t},s=bs(t.config),r={...lo(a,o)};for(const[h,d]of Object.entries(s))d!=null&&(r[h]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=io),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=ro),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let l=ht(t.accounts).map(h=>{const d={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...h};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),ae(d)});l.length===0&&(l=[Ge(a)]);const u=l.filter(h=>h.esCuentaPrincipal);if(u.length===0){const h=l.find(d=>d._id==="default")||l[0];l=l.map(d=>({...d,esCuentaPrincipal:d._id===h._id}))}else if(u.length>1){let h=!1;l=l.map(d=>d.esCuentaPrincipal?h?{...d,esCuentaPrincipal:!1}:(h=!0,d):d)}return n.accounts=l,n.expenses=ht(t.expenses).map(h=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...h};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=uo(d.diaPago),Ve(ae(d))}),n.loans=ht(t.loans).map(h=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...h};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=uo(d.diaPago),d.amortizaciones=ht(d.amortizaciones).map(m=>ae(m)),Ve(ae(d))}),n.nominas=ht(t.nominas).map(h=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...h};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),Ve(ae(d))}),n.goals=ht(t.goals).map((h,d)=>{const m=Array.isArray(h.cuentaIds)?h.cuentaIds:h.cuentaId?[h.cuentaId]:[],{cuentaId:x,...y}=h;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...y,cuentaIds:m}}),n.inflacion=ht(t.inflacion),n.tramosIRPFHistorico=ht(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=ht(t.tramosGananciasCapitalHistorico),n.escenarios=ht(t.escenarios).map(({inversiones:h,...d})=>d),n}const qt=t=>Array.isArray(t)?t:[];let Ue=0;function ys(t){return Ue+=1,`${t}_${Ue.toString(36)}`}const xs=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),$s=t=>typeof t=="number"&&Number.isFinite(t);function Is(t,e){const a={...t};Ue=0;const o=qt(t.transacciones),n=qt(t.puntosControl),s=[...n],i=new Set(n.map(u=>`${u.cuentaId}|${u.fecha}`)),r=(u,h,d,m)=>{if(!xs(h)||!$s(d))return;const x=`${u}|${h}`;i.has(x)||(i.add(x),s.push({_id:ys("pc"),fecha:h,cuentaId:u,saldoCts:It(d),...typeof m=="string"&&m?{nota:m}:{}}))};for(const u of qt(t.accounts)){const h=typeof u._id=="string"?u._id:null;if(h)for(const d of qt(u.historicoSaldos))r(h,d.fecha,d.saldo,d.nota)}const l=qt(t.history);if(l.length>0){const u=qt(t.accounts),h=u.find(m=>m.esCuentaPrincipal)||u.find(m=>m.activo)||u[0],d=typeof(h==null?void 0:h._id)=="string"?h._id:"default";for(const m of l){const x=typeof m.cuenta=="string"?m.cuenta:typeof m.cuentaId=="string"?m.cuentaId:d;r(x,m.fecha,m.saldo,m.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=s.sort((u,h)=>String(u.fecha).localeCompare(String(h.fecha))),a}const Ye=t=>Array.isArray(t)?t:[],As=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),ws=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Je=0;function Ss(){return Je+=1,`tx_hp_${Je.toString(36)}`}function Ms(t,e){const a={...t};Je=0;const o=[...Ye(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Ye(t.expenses).map(i=>{const r=Ye(i.historialPrecios),l=typeof i._id=="string"?i._id:null,u=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",h=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(y=>typeof y=="string"):[];if(l)for(const y of r){if(!y||!As(y.fecha)||!ws(y.cuantia))continue;const $=h==="ingreso"?It(y.cuantia):-It(y.cuantia),A=`${l}|${y.fecha}|${$}`;n.has(A)||(n.add(A),o.push({_id:Ss(),fecha:y.fecha,cuentaId:u,importeCts:$,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:l,tipo:h,origen:"importado",nota:typeof y.nota=="string"&&y.nota?y.nota:"Importado del historial de precios"}))}const{historialPrecios:m,...x}=i;return x});return a.expenses=s,a.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),a}const po=t=>Array.isArray(t)?t:[],Mt=(t,e="")=>typeof t=="string"&&t.trim()?t:e,Lt=(t,e=0)=>typeof t=="number"&&Number.isFinite(t)?t:e,Cs=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function Es(t,e){var h;const a={...t};if(Array.isArray(a.planes))return a;const o=po(a.goals),n=po(a.accounts),s=n.map(d=>{const m=Lt(d.bloqueoMeses,0);return{_id:`veh_${Mt(d._id,"x")}`,nombre:Mt(d.nombre,"Cuenta"),rentabilidadRealAnual:Lt(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":m>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Lt(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?It(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:Mt(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Lt(d.interes,0)>0}}),i=new Map(n.map((d,m)=>[Mt(d._id,""),s[m]._id])),r=((h=s[0])==null?void 0:h._id)??"",l=o.map((d,m)=>{const x=Array.isArray(d.cuentaIds)?d.cuentaIds.map($=>Mt($,"")):[],y=Cs(d.targetDate);return{_id:Mt(d._id,`obj_mig_${m}`),nombre:Mt(d.nombre,`Objetivo ${m+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:It(Lt(d.targetAmount,0)),fechaLimite:y,prioridad:Lt(d.prioridad,m+1),modoAsignacion:y?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(x[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:Mt(d.notas,"")}}),u={_id:"plan_base",nombre:"Plan base",fechaInicio:e.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:l,eventos:[],creadoEn:e.hoyISO};return a.planes=[u],a}const js=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:hs},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Is},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:Ms},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:Es}],_s=["history"];function mo(t,e,a){let o=t;const n=[];for(const s of[...js].sort((i,r)=>i.version-r.version))(e??0)>=s.version||(o=s.migrate(o,a),n.push(s.version));return{state:o,applied:n}}const Bt="state_",We="state__schemaVersion",fo="financeapp_",vo="state__modificadoEn";function zs(t=localStorage,e=fo){const a=o=>`${e}${o}`;return{get(o){try{const n=t.getItem(a(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(a(o),JSON.stringify(n)),o!==vo&&t.setItem(a(vo),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(e)&&o.push(s.slice(e.length))}return o}}}function Fs(t=localStorage,e=fo){const a=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(Bt)&&!s.startsWith(e)&&a.push(s)}const o=[];for(const n of a)try{const s=t.getItem(n);s!==null&&t.getItem(`${e}${n}`)===null&&(t.setItem(`${e}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function Ps({ventanaMs:t=15e3,ahora:e=()=>Date.now()}={}){let a=null;function o(){return a?e()-a.cuando>t?(a=null,null):a:null}return{registrar(n){a={...n,cuando:e()}},pendiente:o,tomar(){const n=o();return a=null,n},limpiar(){a=null}}}const Ds={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},escenarios:{articulo:"El",que:"supuesto"},planes:{articulo:"El",que:"plan"},goals:{articulo:"El",que:"objetivo"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function Ts(t,e){const a=Ds[t]??{articulo:"El",que:"elemento"},o=e.concepto??e.nombre??e.titulo??(e.year!==void 0?String(e.year):null);return o?`${a.articulo} ${a.que} «${String(o)}»`:`${a.articulo} ${a.que}`}function Ns(t){return V(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function Rs({adapter:t,hoy:e=new Date}){const a=V(e),o=Ns(e);let n=co(a,o);const s=new Set;let i=[];const r=Ps();function l(C){for(const M of s)M(C)}function u(C){t.set(`${Bt}${C}`,n[C])}function h(){const C={};for(const T of Object.keys(n)){const R=t.get(`${Bt}${T}`);R!==null&&(C[T]=R)}for(const T of _s){const R=t.get(`${Bt}${T}`);R!==null&&(C[T]=R)}const M=t.get(We),{state:z,applied:F}=mo(C,M,{hoyISO:a,finISO:o});if(n=z,d(),F.length>0){for(const T of Object.keys(n))u(T);t.set(We,ee)}return i=F,{applied:F}}function d(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[Ge(a)],u("accounts");return}const C=n.accounts.filter(M=>M.esCuentaPrincipal);if(C.length===0)n.accounts=n.accounts.map((M,z)=>z===0?{...M,esCuentaPrincipal:!0}:M),u("accounts");else if(C.length>1){let M=!1;n.accounts=n.accounts.map(z=>z.esCuentaPrincipal?M?{...z,esCuentaPrincipal:!1}:(M=!0,z):z),u("accounts")}}function m(C){return n[C]}function x(C,M){n[C]=M,u(C),l(C)}function y(C){x("config",{...n.config,...C})}function $(C){return s.add(C),()=>s.delete(C)}function A(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function v(C,M){const z=[...n[C]],F={...M,_id:A()};return z.push(F),x(C,z),F}function b(C,M,z){const F=n[C].map(T=>T._id===M?{...T,...z}:T);x(C,F)}function f(C,M){const z=n[C],F=z.findIndex(T=>T._id===M);F<0||(r.registrar({col:C,item:z[F],indice:F}),x(C,z.filter((T,R)=>R!==F)))}function I(){const C=r.tomar();if(!C)return null;const M=[...n[C.col]];return M.splice(Math.min(C.indice,M.length),0,C.item),x(C.col,M),C}function p(){return r.pendiente()}function g(){const C=n.accounts||[],M=C.find(z=>z.esCuentaPrincipal&&z.activo)||C.find(z=>z.activo);return M?M._id:"default"}function w(C){var M;return((M=n.accounts.find(z=>z._id===C))==null?void 0:M.nombre)??C}function S(){return bt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function j(){return bt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function _(){return structuredClone(n)}function P(C,M=null){const{state:z,applied:F}=mo(C,M,{hoyISO:a,finISO:o});n=z,d();for(const T of Object.keys(n))u(T);t.set(We,ee);for(const T of Object.keys(n))l(T);return{applied:F}}return{load:h,get:m,set:x,patchConfig:y,subscribe:$,addItem:v,updateItem:b,removeItem:f,deshacerBorrado:I,borradoPendiente:p,getPrincipalAccountId:g,accountName:w,resolverTramosIRPF:S,resolverTramosGanancias:j,snapshot:_,replaceAll:P,get schemaVersion(){return ee},get migrationsApplied(){return[...i]},get today(){return a||Y()}}}function Os(){let t=0,e=null;const a=new Set;function o(n){t+=1,e=n;for(const s of a)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>e,marcar:o,suscribir(n){return a.add(n),()=>a.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const oe=Object.keys(co("1970-01-01","1970-01-01"));function go(t){const e={};for(const a of oe){const o=t.get(`${Bt}${a}`);o!=null&&(e[a]=o)}return e}function qs(t,e){const a=[];for(const o of oe){const n=e[o];n!=null&&(t(`${Bt}${o}`,n),a.push(o))}return a}function Ls(t){return oe.filter(e=>t[e]===void 0||t[e]===null)}function Bs(t){var i,r;const e=l=>{const u=t[l];return Array.isArray(u)?u:[]};if(!oe.filter(l=>l!=="config"&&l!=="accounts"&&l!=="planes").every(l=>e(l).length===0))return!1;const o=e("planes");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="plan_base"&&!(Array.isArray((r=o[0])==null?void 0:r.objetivos)&&o[0].objetivos.length>0)?e("accounts").every(l=>l._id==="default"&&!(typeof l.saldoInicial=="number"&&l.saldoInicial!==0)&&!(Array.isArray(l.historicoSaldos)&&l.historicoSaldos.length>0)):!1}const X={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},Ct=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:X.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:X.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:X.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:X.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:X.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro (antiguos)",descripcion:"Solo lectura: la copia previa al planificador. Los objetivos se gestionan en «Objetivos financieros». Apagada de fábrica; enciéndela si quieres revisar los antiguos antes de descartarlos.",grupo:X.dinero,porDefecto:!1,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:X.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:X.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:X.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:X.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:X.planificacion,porDefecto:!1},{id:"planner",nombre:"Objetivos financieros",descripcion:"Plan a largo plazo: objetivos que compiten por el flujo mensual y se encadenan al completarse.",grupo:X.planificacion,porDefecto:!0},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:X.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:X.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:X.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:X.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:X.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:X.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:X.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:X.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:X.datos,porDefecto:!1,dependencias:["sync-nube"]}],ks=new Map(Ct.map(t=>[t.id,t]));function ne(t){return ks.get(t)}function bo(t){return Ct.filter(e=>(e.dependencias||[]).includes(t))}function Ke(){const t={};for(const e of Ct)t[e.id]=e.porDefecto;return t}function ho(){const t=[],e=new Map;for(const a of Ct)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function Hs(t){function e(){return{...Ke(),...t.get("config").features||{}}}function a(d){t.patchConfig({features:d})}function o(d,m=e(),x=new Set){const y=ne(d);if(!y)return!1;if(y.nucleo)return!0;if(m[d]===!1)return!1;if(x.has(d))return!0;x.add(d);for(const $ of y.dependencias||[])if(!o($,m,x))return!1;return!0}function n(d,m=e()){const x=ne(d);return x?(x.dependencias||[]).filter(y=>!o(y,m)):[]}function s(d,m){var f;const x=ne(d);if(!x)return{cambiadas:[]};if(x.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const y=e(),$=new Map(Ct.map(I=>[I.id,o(I.id,y)])),A={...y,[d]:m};let v;if(m){const I=[...x.dependencias||[]];for(;I.length;){const p=I.pop();A[p]===!1&&(A[p]=!0,v="dependencias-activadas"),I.push(...((f=ne(p))==null?void 0:f.dependencias)||[])}}else{const I=bo(d).map(p=>p.id);for(;I.length;){const p=I.pop();A[p]!==!1&&(A[p]=!1,v="cascada-apagado"),I.push(...bo(p).map(g=>g.id))}}return a(A),{cambiadas:Ct.filter(I=>o(I.id,A)!==$.get(I.id)).map(I=>I.id),motivo:v}}function i(){const d=e();return Ct.map(m=>{const x=n(m.id,d);return{...m,activa:o(m.id,d),...x.length>0&&d[m.id]!==!1?{bloqueadaPor:x}:{}}})}function r(){const d=e();return ho().map(({grupo:m,features:x})=>({grupo:m,features:x.map(y=>{const $=n(y.id,d);return{...y,activa:o(y.id,d),...$.length>0&&d[y.id]!==!1?{bloqueadaPor:$}:{}}})}))}function l(){a(Ke())}function u(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:e()}}function h(d){const m=d,x=m&&typeof m=="object"&&m.features&&typeof m.features=="object"?m.features:null;if(!x)throw new Error('El perfil no tiene una sección "features" válida');const y=Ke(),$=[],A=[];for(const[v,b]of Object.entries(x)){if(!ne(v)){A.push(v);continue}if(typeof b!="boolean"){A.push(v);continue}y[v]=b,$.push(v)}return a(y),{aplicadas:$,ignoradas:A}}return{isEnabled:d=>o(d),setEnabled:s,estado:i,estadoPorGrupo:r,reset:l,exportProfile:u,importProfile:h,bloqueadaPor:d=>n(d)}}const se=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function kt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Gs(t){var n,s;const a=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(se).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${se(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${se(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${se(t.descripcion)}</div>
        ${a}
      </div>
    </div>`}function Vs(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${se(o)}</div>
        ${n.map(Gs).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Us(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function Ys(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Vs(a)}`,n(i)}function n(i){var l,u,h;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var y;const m=d.dataset.featureToggle,x=a.setEnabled(m,d.checked);x.motivo==="dependencias-activadas"&&kt(t,"Se han activado también las funcionalidades necesarias"),x.motivo==="cascada-apagado"&&kt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(y=t.onChange)==null||y.call(t,x.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(l=i.querySelector('[data-feature-action="export"]'))==null||l.addEventListener("click",()=>{const d=a.exportProfile(),m=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),x=URL.createObjectURL(m),y=e.createElement("a");y.href=x,y.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,y.click(),URL.revokeObjectURL(x),kt(t,"Perfil de funcionalidades guardado")}),(u=i.querySelector('[data-feature-action="import"]'))==null||u.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var m,x;const d=(m=r.files)==null?void 0:m[0];if(d)try{const{aplicadas:y,ignoradas:$}=a.importProfile(JSON.parse(await d.text()));kt(t,$.length>0?`Perfil cargado (${y.length} aplicadas, ${$.length} ignoradas por ser de otra versión)`:`Perfil cargado (${y.length} funcionalidades)`),(x=t.onChange)==null||x.call(t,y),o(i)}catch(y){kt(t,"No se pudo cargar el perfil: "+y.message,"err")}finally{r.value=""}}),(h=i.querySelector('[data-feature-action="reset"]'))==null||h.addEventListener("click",()=>{var d;a.reset(),kt(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function s(){const i=Us(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const yo={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function xo(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const n=e(o);a.style.display=n?"":"none",n?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function Js({flags:t,document:e=document,router:a,rutasExtra:o}){function n(){const r=e.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const l=Object.entries((o==null?void 0:o())??{}).map(([u,h])=>[h,u]);for(const[u,h]of[...Object.entries(yo),...l]){const d=t.isEnabled(u),m=e.querySelector(`.nav-btn[data-view="${h}"]`);m&&(m.style.display=d?"":"none"),!d&&n()===h&&(r=!0)}if(e.querySelectorAll(".nav-section").forEach(u=>{const h=[...u.querySelectorAll(".nav-btn[data-view]")];if(h.length===0)return;const d=h.some(m=>m.style.display!=="none");u.style.display=d?"":"none"}),xo(e,u=>t.isEnabled(u)),r){const u=a??globalThis.Router;u==null||u.navigate("dashboard")}}function i(r=e.body){if(typeof MutationObserver>"u")return()=>{};let l=!1;const u=new MutationObserver(()=>{if(!l){l=!0;try{xo(e,h=>t.isEnabled(h))}finally{l=!1}}});return u.observe(r,{childList:!0,subtree:!0}),()=>u.disconnect()}return{apply:s,observar:i,vistaPara:r=>yo[r]}}const Ws="toast toast-deshacer";function Ks(t){const{store:e,rerender:a,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function l(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function u(d){const m=n();if(!m)return;l();const x=document.createElement("div");x.className=Ws,x.style.display="flex",x.style.alignItems="center",x.style.gap="12px";const y=document.createElement("span");y.textContent=`${Ts(d.col,d.item)} se ha eliminado.`,y.style.flex="1";const $=document.createElement("button");$.type="button",$.className="btn-secondary btn-sm",$.textContent="Deshacer",$.style.flexShrink="0",$.addEventListener("click",()=>{const A=e.deshacerBorrado();if(l(),!A)return;const v=n();if(v){const b=document.createElement("div");b.className="toast toast-ok",b.textContent="Deshecho.",v.appendChild(b),setTimeout(()=>b.remove(),2500)}a==null||a()}),x.appendChild(y),x.appendChild($),m.appendChild(x),s=x,i=setTimeout(l,o)}const h=e.subscribe(()=>{const d=e.borradoPendiente();if(!d){r=null,l();return}d!==r&&(r=d,u(d))});return()=>{h(),l()}}function be(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function $o(t,e){const a=be(t),o=be(e);if(!o)return-1;const n=a.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(a[n-1])?1:2}const Ft=t=>{const e=Number(t);return Number.isFinite(e)?`${e.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function Qs(t){const e=[],a=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";e.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[Ft(o.cuantia),a(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],a(o.cuenta)].join(" ")})}for(const o of t.accounts??[])e.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:Ft(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])e.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:Ft(o.capital),ruta:"loans",extra:[...o.tags??[],a(o.cuenta)].join(" ")});for(const o of t.nominas??[])e.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${Ft(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.escenarios??[])e.push({tipo:"supuesto",etiqueta:"Supuesto",id:o._id,titulo:o.nombre,detalle:o.descripcion??"",ruta:"escenarios"});for(const o of t.planes??[]){e.push({tipo:"plan",etiqueta:"Plan",id:o._id,titulo:o.nombre,detalle:o.notas??"",ruta:"planner"});for(const n of o.objetivos??[])e.push({tipo:"objetivo",etiqueta:"Objetivo",id:n._id,titulo:n.nombre,detalle:[n.importeObjetivo!==null?Ft(n.importeObjetivo/100):"",o.nombre].filter(Boolean).join(" · "),ruta:"planner"})}for(const o of t.goals??[])e.push({tipo:"objetivo",etiqueta:"Objetivo",id:o._id,titulo:o.nombre,detalle:Ft(o.targetAmount),ruta:"accounts"});for(const o of t.transacciones??[])e.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,Ft(o.importeCts/100),a(o.cuentaId)].filter(Boolean).join(" · "),ruta:"contabilidad",extra:(o.tags??[]).join(" ")});return e}function Xs(t,e,a={}){const{maximo:o=12,rutasDisponibles:n=null}=a,s=be(e);if(s.length<2)return[];const i=l=>n===null||n.includes(l),r=[];for(const l of Qs(t)){if(!i(l.ruta))continue;const u=$o(l.titulo,s),h=u>=0?-1:Math.min($o(l.extra??"",s),2);if(u<0&&h<0)continue;const d=u>=0?u:3;r.push({tipo:l.tipo,etiqueta:l.etiqueta,id:l.id,titulo:l.titulo,detalle:l.detalle,ruta:l.ruta,peso:d*1e3+Math.min(999,be(l.titulo).length)})}return r.sort((l,u)=>l.peso-u.peso||l.titulo.localeCompare(u.titulo,"es")),r.slice(0,o)}const Zs="buscador-overlay",Io="btn-buscador";function ti(t){const e=t.doc??document,a=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function l(){const I=e.createElement("div");I.id=Zs,I.className="modal-overlay",I.style.alignItems="flex-start",I.style.paddingTop="10vh";const p=e.createElement("div");p.className="modal-box",p.style.maxWidth="560px",p.style.padding="14px";const g=e.createElement("input");g.type="search",g.className="form-input",g.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",g.setAttribute("aria-label","Buscar en toda la aplicación"),g.autocomplete="off";const w=e.createElement("div");return w.style.marginTop="10px",w.style.maxHeight="52vh",w.style.overflowY="auto",p.appendChild(g),p.appendChild(w),I.appendChild(p),e.body.appendChild(I),I.addEventListener("click",S=>{S.target===I&&$()}),g.addEventListener("input",()=>{r=0,h()}),g.addEventListener("keydown",x),o=I,n=g,s=w,I}function u(){if(s){if(s.textContent="",i.length===0){const I=e.createElement("div");I.style.padding="14px 4px",I.style.fontSize="13px",I.style.color="var(--text3)";const p=(n==null?void 0:n.value.trim())??"";I.textContent=p.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild(I);return}i.forEach((I,p)=>{const g=e.createElement("button");g.type="button",g.className="buscador-fila",g.dataset.indice=String(p),p===r&&g.classList.add("activa");const w=e.createElement("div");w.style.minWidth="0";const S=e.createElement("div");S.textContent=I.titulo,S.style.fontSize="13px",S.style.overflow="hidden",S.style.textOverflow="ellipsis",S.style.whiteSpace="nowrap";const j=e.createElement("div");j.textContent=I.detalle,j.style.fontSize="11px",j.style.color="var(--text3)",j.style.overflow="hidden",j.style.textOverflow="ellipsis",j.style.whiteSpace="nowrap",w.appendChild(S),I.detalle&&w.appendChild(j);const _=e.createElement("span");_.className="tag",_.textContent=I.etiqueta,_.style.flexShrink="0",g.appendChild(w),g.appendChild(_),g.addEventListener("click",()=>m(p)),s.appendChild(g)})}}function h(){const I=(n==null?void 0:n.value)??"";i=Xs(t.estado(),I,{rutasDisponibles:a()}),r>=i.length&&(r=Math.max(0,i.length-1)),u()}function d(I){var p,g;i.length!==0&&(r=(r+I+i.length)%i.length,u(),(g=(p=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:p.scrollIntoView)==null||g.call(p,{block:"nearest"}))}function m(I){const p=i[I];p&&($(),t.navegar(p.ruta))}function x(I){I.key==="Escape"?(I.preventDefault(),$()):I.key==="ArrowDown"?(I.preventDefault(),d(1)):I.key==="ArrowUp"?(I.preventDefault(),d(-1)):I.key==="Enter"&&(I.preventDefault(),m(r))}function y(){const I=o??l();I.classList.remove("hidden"),I.style.display="",r=0,n&&(n.value="",n.focus()),h()}function $(){o&&(o.style.display="none",i=[])}function A(){return!!o&&o.style.display!=="none"}function v(I){(I.ctrlKey||I.metaKey)&&(I.key==="k"||I.key==="K")&&(I.preventDefault(),A()?$():y())}e.addEventListener("keydown",v);let b=null;function f(){const I=e.getElementById("period-bar");if(!I||e.getElementById(Io))return;const p=e.createElement("button");p.id=Io,p.type="button",p.className="btn-secondary",p.title="Buscar en toda la aplicación (Ctrl+K)",p.setAttribute("aria-label","Buscar"),p.textContent="🔍 Buscar",p.style.marginLeft="auto",p.addEventListener("click",y),I.appendChild(p),b=p}return f(),()=>{e.removeEventListener("keydown",v),b==null||b.remove(),o==null||o.remove(),o=null,n=null,s=null}}const Qe="aviso-guardado";function ei(t){const e=t.doc??document,a=t.contenedor??(()=>e.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,l=null;function u(){var y;r&&clearTimeout(r),r=null,(y=e.getElementById(Qe))==null||y.remove()}function h(){if(s==="oculto")return u();const y=a();if(!y)return;let $=e.getElementById(Qe);$||($=e.createElement("div"),$.id=Qe,y.appendChild($)),$.className=`toast toast-guardado toast-guardado--${s}`,$.style.display="flex",$.style.alignItems="center",$.style.gap="12px",$.textContent="";const A=e.createElement("span");if(A.style.flex="1",$.appendChild(A),s==="pendiente")A.textContent="Tienes cambios sin guardar.",$.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void m())),$.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",h()}));else if(s==="subiendo"){A.textContent="Subiendo…";const v=e.createElement("span");v.className="guardado-giro",v.setAttribute("aria-hidden","true"),$.appendChild(v)}else s==="guardado"?A.textContent="¡Guardado!":s==="error"&&(A.textContent="No se ha podido guardar.",$.appendChild(d("Reintentar","btn-primary btn-sm",()=>void m())))}function d(y,$,A){const v=e.createElement("button");return v.type="button",v.className=$,v.textContent=y,v.style.flexShrink="0",v.addEventListener("click",A),v}async function m(){if(l)return l;r&&clearTimeout(r);const y=t.cambios.revision();return s="subiendo",h(),l=(async()=>{try{await t.guardar(),n.alDia(y),s="guardado",h(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),h()},o)}catch($){console.error("[guardado] no se ha podido subir la copia:",$),s="error",h()}finally{l=null}})(),l}const x=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",h()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:m,detener(){x(),u()}}}function ai({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function n(y){return`view-${y}`}function s(y){const $=t.getElementById(n(y.route));if($)return $;const A=t.querySelector(".view-container");if(!A)return null;const v=t.createElement("div");return v.id=n(y.route),v.className="view hidden",A.appendChild(v),v}function i(y){if(t.querySelector(`.nav-btn[data-view="${y.route}"]`))return;const $=t.querySelectorAll(".nav-section"),A=$[y.seccion??Math.max(0,$.length-1)];if(!A)return;const v=t.createElement("button");v.className="nav-btn",v.dataset.view=y.route,v.innerHTML=`${y.iconoPath?`<svg viewBox="0 0 24 24"><path d="${y.iconoPath}"/></svg>`:""}<span>${y.nombre}</span>`,A.appendChild(v),v.addEventListener("click",()=>{const b=globalThis.Router;b==null||b.navigate(y.route)})}function r(y){a.set(y.route,y),s(y),i(y)}function l(){return[...a.keys()].filter(y=>{const $=a.get(y);return!e||e($.flagId??$.id)})}function u(y){return l().includes(y)}function h(y){const $=a.get(y);if(!$||e&&!e($.flagId??$.id))return!1;const A=s($);if(!A)return!1;if(o&&o!==y){const v=a.get(o),b=t.getElementById(n(o));v!=null&&v.unmount&&b&&v.unmount(b)}return $.mount(A),o=y,!0}function d(){o&&h(o)}function m(){const y={};for(const[$,A]of a)y[$]=A.flagId??A.id;return y}function x(){for(const y of a.values())s(y),i(y)}return{register:r,routes:l,has:u,mount:h,rerender:d,flagPorRuta:m,attachToShell:x,get activa(){return o}}}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Pt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${c(E(t))}</span>`}function Ao(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function wo(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${c(e)}</span>`).join(" ")}const oi=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Xe(t){const[e,a]=t.split("-").map(Number);return`${oi[a-1]} ${e}`}function q(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function Z(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function N(t,e,a){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function J(t,e,a){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function ft(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function So(t,e){const a=parseFloat(ft(t,e));return Number.isFinite(a)?a:0}function ni(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function si(t,e){const{ledger:a}=t,o=(t.hoy??Y)(),n=t.accounts().filter(b=>b.activo),{desde:s,hasta:i}=ni(e.mes),r={cuentaId:e.cuentaId||void 0,desde:s,hasta:i,texto:e.filtroTexto||void 0},l=a.transacciones(r),u=t.estimaciones().filter(b=>b.tipo!=="transferencia"),h=l.filter(b=>b.importeCts<0).reduce((b,f)=>b+f.importeCts,0),d=l.filter(b=>b.importeCts>0).reduce((b,f)=>b+f.importeCts,0),m=e.cuentaId?a.saldoCuenta(e.cuentaId,i):a.saldoTotal(i),x=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),y=n.map(b=>`<option value="${c(b._id)}"${b._id===e.cuentaId?" selected":""}>${c(b.nombre)}</option>`).join(""),$=b=>'<option value="">— sin asignar —</option>'+u.map(f=>`<option value="${c(f._id)}"${f._id===b?" selected":""}>${c(f.concepto)} (${c(E(f.cuantia))})</option>`).join(""),A=l.map(b=>{var f;return`
      <tr data-tx="${c(b._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${c(b.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${c(b.concepto)}</td>
        <td style="padding:7px 8px">${wo(b.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${c(((f=t.accounts().find(I=>I._id===b.cuentaId))==null?void 0:f.nombre)??b.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${c(b._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${$(b.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Pt(et(b.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${c(b._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${c(b._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),v=x.slice().reverse().slice(0,8).map(b=>{var f;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${c(b.fecha)}</span>
        <span style="color:var(--text3)">${c(((f=t.accounts().find(I=>I._id===b.cuentaId))==null?void 0:f.nombre)??b.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${c(E(et(b.saldoCts)))}</span>
        ${b.nota?`<span style="color:var(--text3)">${c(b.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${c(b._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
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
          <span>Gastos: ${Pt(et(h))}</span>
          <span>Ingresos: ${Pt(et(d))}</span>
          <span>Neto: ${Pt(et(d+h))}</span>
          <span style="margin-left:auto">Saldo a ${c(i)}: <strong>${c(E(m))}</strong></span>
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
            <datalist id="acc-tags-list">${t.tagsConocidas().map(b=>`<option value="${c(b)}"></option>`).join("")}</datalist>
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
          ${v?`<div class="mt-12">${v}</div>`:""}
        </div>
      </div>
    </div>`}function ii(t,e,a,o){const{ledger:n}=e;J(t,"#acc-cuenta",i=>{a.cuentaId=i.value,o()}),J(t,"#acc-mes",i=>{a.mes=i.value||a.mes,o()});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{a.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),N(t,"#nt-guardar",()=>{const i=ft(t,"#nt-concepto").trim(),r=So(t,"#nt-importe");if(!i)return q("Indica un concepto","err");if(!(r>0))return q("Indica un importe mayor que cero","err");const l=ft(t,"#nt-tags").split(",").map(u=>u.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:ft(t,"#nt-fecha")||(e.hoy??Y)(),cuentaId:ft(t,"#nt-cuenta"),importe:r,concepto:i,tags:l,tipo:ft(t,"#nt-tipo"),estimacionId:ft(t,"#nt-estimacion")||null}),q("Movimiento registrado"),e.onDatosCambiados(),o()}),N(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;Z("¿Eliminar este movimiento?")&&(n.eliminar(r),q("Movimiento eliminado"),e.onDatosCambiados(),o())}),N(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,l=n.transacciones().find(d=>d._id===r);if(!l)return;const u=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(et(l.importeCts))));if(u===null)return;const h=parseFloat(u.replace(",","."));if(!Number.isFinite(h)||h<=0)return q("Importe no válido","err");n.actualizar(r,{importe:h}),q("Movimiento actualizado"),e.onDatosCambiados(),o()}),J(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),q("Asignación actualizada"),e.onDatosCambiados()}),N(t,"#pc-guardar",()=>{if(ft(t,"#pc-saldo").trim()==="")return q("Indica el saldo","err");const r=So(t,"#pc-saldo");n.registrarPuntoControl(ft(t,"#pc-cuenta"),ft(t,"#pc-fecha")||(e.hoy??Y)(),r,ft(t,"#pc-nota").trim()||void 0),q("Saldo real registrado"),e.onDatosCambiados(),o()}),N(t,"[data-pc-borrar]",i=>{Z("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),q("Punto de control eliminado"),e.onDatosCambiados(),o())})}function Ze(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=W(t.mediaRealReciente),i=W(s-e),r=e!==0?i/Math.abs(e)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const l=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:W(e),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:l,motivo:i>0?`El gasto real de los últimos ${l} meses supera lo estimado`:`El gasto real de los últimos ${l} meses es inferior a lo estimado`}}function ri(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(s,i,r={}){const l=r.hoy??Y(),u=t.get("expenses"),h=u.find(y=>y._id===s);if(!h)throw new Error(`La estimación ${s} no existe`);const d={...h,fechaFin:l},m={...h,_id:e(),cuantia:W(i),fechaInicio:l,fechaFin:h.fechaFin??null,ajustadaDesdeId:h._id,ajustadaEn:l},x=u.map(y=>y._id===s?d:y);return x.push(m),t.set("expenses",x),{estimacionCerrada:d,estimacionNueva:m}}function o(s,i={}){const r=[],l=[];for(const u of s)try{r.push(a(u.estimacionId,u.cuantiaSugerida,i))}catch(h){l.push({estimacionId:u.estimacionId,error:h.message})}return{aplicadas:r,errores:l}}function n(s){const i=t.get("expenses"),r=new Map(i.map($=>[$._id,$])),l=r.get(s);if(!l)return[];const u=[];let h=l;const d=new Set;for(;h!=null&&h.ajustadaDesdeId&&!d.has(h._id);){d.add(h._id);const $=r.get(h.ajustadaDesdeId);if(!$)break;u.unshift($),h=$}const m=[];let x=l;const y=new Set([l._id]);for(;;){const $=i.find(A=>A.ajustadaDesdeId===x._id&&!y.has(A._id));if(!$)break;y.add($._id),m.push($),x=$}return[...u,l,...m]}return{aplicar:a,aplicarTodas:o,cadena:n}}function ta(t){const e=t.estimaciones(),a=new Map(e.map(o=>[o._id,o]));return t.precision.analizarTodas(e).map(o=>{const n=a.get(o.estimacionId);return{analisis:o,estimacion:n,sugerencia:Ze(o,n.cuantia)}}).filter(o=>!!o.estimacion)}function li(t){const e=ta(t),a=e.filter(l=>l.analisis.precision!==null),o=e.filter(l=>l.sugerencia!==null),n=t.precision.analizarPorTag(e.map(l=>l.analisis));if(a.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const s=a.map(({analisis:l,estimacion:u,sugerencia:h})=>{const d=l.meses.slice(-6).map(m=>`${Xe(m.mes)}: ${E(m.estimado)} → ${E(m.real)} (${m.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${c(u.concepto)}</div>
          <div style="margin-top:3px">${wo(l.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${c(d)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(E(l.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(E(l.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Pt(l.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${Ao(l.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${h?`<button class="btn-secondary" data-sugerir="${c(l.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${c(h.motivo)}">Sugerir ajuste → ${c(E(h.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=n.map(l=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${c(l.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${l.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(E(l.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(E(l.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Pt(l.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${Ao(l.precision)}</td>
      </tr>`).join(""),r=(l,u="left")=>`<th style="padding:7px 8px;text-align:${u};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${l}</th>`;return`
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
    </div>`}function ci(t,e,a){N(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=ta(e).find(l=>l.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${E(i.cuantiaActual)}
Nueva estimación: ${E(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;Z(r)&&(e.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:e.hoy()}),q(`Estimación ajustada a ${E(i.cuantiaSugerida)}`),e.onDatosCambiados(),a())}),N(t,"#ajustar-todas",()=>{const o=ta(e).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${E(r.cuantiaActual)} → ${E(r.cuantiaSugerida)}`).join(`
`);if(!Z(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});q(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const di=[";",",","	","|"],ui={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function he(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ye(t,e){const a=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===e?(a.push(o.trim()),o=""):o+=i}return a.push(o.trim()),a}function pi(t){let e=";",a=-1;for(const o of di){const n=t.slice(0,20).map(l=>ye(l,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(l=>l===s).length*10+s;r>a&&(a=r,e=o)}return e}function ie(t){let e=(t??"").trim();if(!e)return null;let a=!1;if(/^\(.*\)$/.test(e)&&(a=!0,e=e.slice(1,-1).trim()),e.endsWith("-")&&(a=!0,e=e.slice(0,-1).trim()),e.startsWith("-")&&(a=!0,e=e.slice(1).trim()),e.startsWith("+")&&(e=e.slice(1).trim()),e=e.replace(/[€$£\s  ]/g,""),!e)return null;const o=e.lastIndexOf(","),n=e.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(e)&&e.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(e)&&e.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const h=s===","?o:n;i=e.slice(0,h).replace(/[.,]/g,""),r=e.slice(h+1).replace(/[.,]/g,"")}else i=e.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const l=(r+"00").slice(0,2),u=Number(i||"0")*100+Number(l);return Number.isFinite(u)?a?-u:u:null}function ea(t){const e=(t??"").trim();if(!e)return null;let a=e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a)return Mo(Number(a[1]),Number(a[2]),Number(a[3]));if(a=e.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),a){let o=Number(a[3]);return o<100&&(o+=o<70?2e3:1900),Mo(o,Number(a[2]),Number(a[1]))}return null}function Mo(t,e,a){if(e<1||e>12||a<1||a>31)return null;const o=new Date(t,e-1,a);return o.getFullYear()!==t||o.getMonth()!==e-1||o.getDate()!==a?null:`${t}-${String(e).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function Co(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>ea(a)!==null).length/e.length}function Eo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>ie(a)!==null).length/e.length}function mi(t,e){const a={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>e.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=he(t[i]);if(r&&ui[s].some(l=>r===l||r.startsWith(l)||r.includes(l))){if(s==="importe"&&he(t[i]).includes("saldo"))continue;a[s]=i,o.add(i);break}}if(a.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=Co(n(r));l>i&&(i=l,s=r)}s>=0&&(a.fecha=s,o.add(s))}if(a.importe<0&&a.debe<0&&a.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||he(t[r]).includes("saldo"))continue;const l=Eo(n(r));l>i&&(i=l,s=r)}s>=0&&(a.importe=s,o.add(s))}if(a.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=n(r);if(Eo(l)>.5||Co(l)>.5)continue;const u=l.reduce((h,d)=>h+d.length,0)/Math.max(1,l.length);u>i&&(i=u,s=r)}s>=0&&(a.concepto=s)}return a}function fi(t){const e=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(h=>h.trim()!=="");if(e.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const a=pi(e),o=e.map(h=>ye(h,a).length),n=Math.max(...o);let s=o.findIndex(h=>h===n);s<0&&(s=0);const i=ye(e[s],a);let r=e.slice(s+1).map(h=>ye(h,a));const l=ea(i[0]??"")!==null||i.some(h=>ie(h)!==null&&/\d/.test(h));l&&(r=[i,...r]);const u=mi(l?i.map(()=>""):i,r.slice(0,40));return{separador:a,cabeceras:l?i.map((h,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:s+1,mapeo:u}}function jo(t,e,a){return`${t}|${e}|${he(a).replace(/\s+/g," ")}`}function vi(t,e,a=[]){const o=new Set(a.map(s=>jo(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],l=e.fecha>=0?ea(s[e.fecha]??""):null;e.fecha<0?r.push("sin columna de fecha"):l||r.push(`fecha ilegible: «${s[e.fecha]??""}»`);let u=null;if(e.importe>=0)u=ie(s[e.importe]??""),u===null&&r.push(`importe ilegible: «${s[e.importe]??""}»`);else if(e.debe>=0||e.haber>=0){const m=e.debe>=0?ie(s[e.debe]??""):null,x=e.haber>=0?ie(s[e.haber]??""):null;m===null&&x===null?r.push("sin importe en Debe ni en Haber"):m!==null&&m!==0?u=-Math.abs(m):x!==null&&x!==0?u=Math.abs(x):u=0}else r.push("sin columna de importe");u===0&&r.push("importe cero");const h=(e.concepto>=0?s[e.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(l&&u!==null){const m=jo(l,u,h);d=o.has(m)||n.has(m),n.add(m)}return{linea:t.lineaCabecera+1+i,fecha:l,concepto:h,importeCts:u,errores:r,duplicada:d}})}function gi(t,e){const a=t.filter(n=>n.errores.length===0&&(e||!n.duplicada)),o=a.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:a.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:a.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function xe(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const bi=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function aa(t,e){if(!e.analisis||!e.mapeo){e.filas=[];return}const a=t.ledger.transacciones(e.cuentaId?{cuentaId:e.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));e.filas=vi(e.analisis,e.mapeo,a)}function hi(t,e){const a=t.accounts().filter(n=>n.activo);if(!e.abierto)return`
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

      ${e.analisis&&e.mapeo?xi(e,e.analisis,e.mapeo):yi()}
    </div>`}function yi(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function xi(t,e,a){const o=gi(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+e.cabeceras.map((l,u)=>`<option value="${u}"${u===r?" selected":""}>${c(l||`Columna ${u+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${c(t.nombreFichero)}</strong> · ${e.filas.length} línea${e.filas.length!==1?"s":""}
      · separador <code>${c(e.separador==="	"?"tabulador":e.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${bi.map(r=>`<div class="form-group">
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
        <div class="stat-value" style="font-size:1.15rem">${Pt(et(o.sumaCts))}</div>
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
          ${i.map(r=>{const l=r.errores.length>0,u=l?r.errores[0]:r.duplicada?"repetido":"se importa",h=l?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${l?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${c(r.fecha??"—")}</td>
                <td style="font-size:12px">${c(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":c(E(et(r.importeCts)))}</td>
                <td style="font-size:11px;color:${h}">${c(u)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function $i(t,e,a,o){N(t,"[data-imp-abrir]",()=>{const s=e.accounts().filter(i=>i.activo);Object.assign(a,xe(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),N(t,"[data-imp-cerrar]",()=>{Object.assign(a,xe()),o()}),J(t,"#imp-cuenta",s=>{a.cuentaId=s.value,aa(e,a),o()}),J(t,"#imp-duplicadas",s=>{a.incluirDuplicadas=s.checked,o()}),J(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;a.mapeo&&(a.mapeo[r]=Number(i.value),aa(e,a),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&Ii(s).then(r=>{const l=fi(r);a.nombreFichero=s.name,a.error=l.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",a.analisis=l,a.mapeo={...l.mapeo},aa(e,a),o()}).catch(r=>{a.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),N(t,"[data-imp-confirmar]",()=>{if(!a.cuentaId)return;const s=a.filas.filter(i=>i.errores.length===0&&(a.incluirDuplicadas||!i.duplicada));if(s.length!==0){for(const i of s)e.ledger.registrar({fecha:i.fecha,cuentaId:a.cuentaId,importe:Math.abs(et(i.importeCts)),tipo:i.importeCts<0?"gasto":"ingreso",concepto:i.concepto,origen:"importado"});q(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""}`),Object.assign(a,xe()),e.onDatosCambiados(),o()}})}function Ii(t){return t.arrayBuffer().then(e=>{const a=new TextDecoder("utf-8").decode(e);if(!a.includes("�"))return a;try{return new TextDecoder("iso-8859-1").decode(e)}catch{return a}})}function Ai(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function wi(t,e){const a=G(t),o=[];for(let n=1;n<=e;n++){const s=new Date(a.getFullYear(),a.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Si(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function _o(t,e){const{inicio:a,fin:o}=Si(e);return Qt([t],{start:a,end:o}).reduce((s,i)=>s+Math.abs(i.cuantia),0)}function Mi(t){function e(n,s={}){var I;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:l=Y()}=s,u=t.transacciones({estimacionId:n._id}),d=u.length===0&&(((I=n.tags)==null?void 0:I.length)??0)>0?t.transacciones({tags:n.tags}):u,m=new Map;for(const p of d){const g=p.fecha.slice(0,7);m.set(g,(m.get(g)??0)+Math.abs(p.importeCts)/100)}const x=[];for(const p of wi(l,i)){const g=m.get(p);if(g===void 0)continue;const w=W(_o(n,p));x.push({mes:p,estimado:w,real:W(g),desviacion:W(g-w),precision:Ai(w,g)})}const y=W(x.reduce((p,g)=>p+g.estimado,0)),$=W(x.reduce((p,g)=>p+g.real,0)),A=x.reduce((p,g)=>p+Math.abs(g.estimado),0),v=x.length===0?null:A>0?x.reduce((p,g)=>p+g.precision*Math.abs(g.estimado),0)/A:x.reduce((p,g)=>p+g.precision,0)/x.length,b=x.slice(-r),f=b.length>0?W(b.reduce((p,g)=>p+g.real,0)/b.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:x,estimadoTotal:y,realTotal:$,desviacionTotal:W($-y),precision:v,mediaRealReciente:f,infraestimada:$>y}}function a(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>e(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const l=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};l.estimado+=i.estimadoTotal,l.real+=i.realTotal,l.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),l.peso+=Math.abs(i.estimadoTotal),l.n+=1,s.set(r,l)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:W(r.estimado),realTotal:W(r.real),desviacionTotal:W(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}function Ci(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Ei(t){const[e,a]=t.slice(0,7).split("-").map(Number),o=new Date(e,a-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function ji(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function _i(t,e,a){const o=new Map(e.map(s=>[s._id,[]])),n=e.filter(s=>{var i;return!a(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const l of n){const u=(l.tags??[]).filter(h=>s.tags.includes(h)).length;u!==0&&(u>r||u===r&&i&&l._id<i._id)&&(i=l,r=u)}i&&o.get(i._id).push(s)}return o}function zi(t,e,a,o={}){const{desde:n,hasta:s}=Ci(a),i=t.transacciones({desde:n,hasta:s}),r=i.filter(f=>f.importeCts<0),l=i.filter(f=>f.importeCts>0),u=e.filter(f=>f.tipo==="gasto"&&f.activo!==!1),h=new Map((o.analisis??[]).map(f=>[f.estimacionId,f])),d=new Set(u.filter(f=>t.transacciones({estimacionId:f._id}).length>0).map(f=>f._id)),m=_i(r,u,f=>d.has(f)),x=new Set,y=u.map(f=>{const I=m.get(f._id)??[];for(const S of I)x.add(S._id);const p=W(I.reduce((S,j)=>S+Math.abs(j.importeCts)/100,0)),g=W(_o(f,a)),w=h.get(f._id);return{estimacionId:f._id,concepto:f.concepto,tags:f.tags??[],estimado:g,real:p,desviacion:W(p-g),sinMovimiento:I.length===0,sugerencia:w?Ze(w,f.cuantia,{hoy:o.hoy}):null}}),$=new Map;for(const f of r){if(x.has(f._id))continue;const I=ji(f.concepto),p=$.get(I)??{concepto:f.concepto,total:0,movimientos:0};p.total=W(p.total+Math.abs(f.importeCts)/100),p.movimientos+=1,$.set(I,p)}const A=[...$.values()].sort((f,I)=>I.total-f.total),v=W(y.reduce((f,I)=>f+I.estimado,0)),b=W(r.reduce((f,I)=>f+Math.abs(I.importeCts)/100,0));return{mes:a,estimado:v,real:b,desviacion:W(b-v),ingresosReales:W(l.reduce((f,I)=>f+I.importeCts/100,0)),filas:y.sort((f,I)=>Math.abs(I.desviacion)-Math.abs(f.desviacion)),sinEstimacion:A,totalSinEstimacion:W(A.reduce((f,I)=>f+I.total,0)),vacio:i.length===0}}function zo(t){const e=new Set;for(const a of t.transacciones())e.add(a.fecha.slice(0,7));return[...e].sort().reverse()}function Fi(){return{mes:""}}function oa(t,e){if(e.mes)return e.mes;const a=zo(t.ledger),o=Ei((t.hoy??Y)());return a.includes(o)?o:a[0]??o}function na(t,e){const a=(t.hoy??Y)(),o=t.estimaciones(),n=t.precision.analizarTodas(o,{hoy:a});return zi(t.ledger,o,e,{analisis:n,hoy:a})}function Pi(t,e){const a=oa(t,e),o=zo(t.ledger);o.includes(a)||o.unshift(a);const n=na(t,a),s=`
    <select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
      ${o.map(l=>`<option value="${c(l)}"${l===a?" selected":""}>${c(Xe(l))}</option>`).join("")}
    </select>`;if(n.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">Cierre de mes</div>
          ${s}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados en ${c(Xe(a))}. Importa el extracto del banco o
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
          <div class="stat-value" style="font-size:1.15rem">${c(E(n.estimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Has gastado</div>
          <div class="stat-value" style="font-size:1.15rem">${c(E(n.real))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación</div>
          <div class="stat-value" style="font-size:1.15rem;color:${r}">${i(n.desviacion)}${c(E(n.desviacion))}</div>
          <div class="stat-sub">${n.desviacion>0?"de más":n.desviacion<0?"de menos":"clavado"}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${n.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${c(E(n.totalSinEstimacion))}</div>
          <div class="stat-sub">${n.sinEstimacion.length} concepto${n.sinEstimacion.length!==1?"s":""}</div>
        </div>
      </div>

      ${Di(n)}
      ${Ti(n)}
    </div>`}function Di(t){const e=t.filas.filter(o=>o.estimado>0||o.real>0);if(e.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas para este mes.</div>';const a=e.filter(o=>o.sugerencia);return`
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
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${c(E(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${c(E(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${n}">
                  ${o.desviacion>0?"+":""}${c(E(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${s?`<button class="btn-secondary btn-sm" data-cie-ajustar="${c(o.estimacionId)}"
                           title="Pasar la estimación de ${c(E(s.cuantiaActual))} a ${c(E(s.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${c(E(s.cuantiaSugerida))}</button>`:""}
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
           </div>`:""}`}function Ti(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--yellow)">${c(E(e.total))}</td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function Ni(t,e,a,o){J(t,"#cie-mes",n=>{a.mes=n.value,o()}),N(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=na(e,oa(e,a)).filas.find(l=>l.estimacionId===s);r!=null&&r.sugerencia&&(e.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(e.hoy??Y)()}),q(`«${r.concepto}» ajustada a ${E(r.sugerencia.cuantiaSugerida)}`),e.onDatosCambiados(),o())}),N(t,"[data-cie-ajustar-todas]",()=>{const s=na(e,oa(e,a)).filas.map(l=>l.sugerencia).filter(l=>l!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=e.adjuster.aplicarTodas(s,{hoy:(e.hoy??Y)()});q(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),e.onDatosCambiados(),o()})}const Ri="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function Oi(t){const e={cuentaId:"",mes:(t.hoy??Y)().slice(0,7),filtroTexto:""},a=xe(),o=Fi(),n=()=>{var d;return(d=t.onDatosCambiados)==null?void 0:d.call(t)},s=t.hoy??Y,i={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:n,hoy:s},r={ledger:t.ledger,accounts:t.accounts,onDatosCambiados:n},l={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:n,hoy:s},u={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:n,hoy:s};function h(d){const m=t.ledger.saldoTotal(s()),x=t.ledger.ultimaFecha(),y=t.ledger.transacciones().length;d.innerHTML=`
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
          <div class="stat-value" style="font-size:1.3rem">${c(E(m))}</div>
          <div style="font-size:11px;color:var(--text3)">suma de cuentas activas</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Movimientos registrados</div>
          <div class="stat-value" style="font-size:1.3rem">${y}</div>
          <div style="font-size:11px;color:var(--text3)">${x?`último: ${c(x)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-importar"></div>
      <div id="acc-cierre" data-feature="precision-estimaciones"></div>
      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const $=d.querySelector("#acc-importar"),A=d.querySelector("#acc-cierre"),v=d.querySelector("#acc-transacciones"),b=d.querySelector("#acc-precision");$.innerHTML=hi(r,a),A.innerHTML=Pi(l,o),v.innerHTML=si(i,e),b.innerHTML=li(u);const f=()=>h(d);$i($,r,a,f),Ni(A,l,o,f),ii(v,i,e,f),ci(b,u,f)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:Ri,mount:h}}const qi="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function sa(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function Li(t){const{store:e}=t,a=t.hoy??Y,o=()=>G(a()),n=()=>e.get("config").margenesSeguridad??[];function s(x){var y;e.patchConfig({margenesSeguridad:x}),(y=t.onDatosCambiados)==null||y.call(t)}function i(x,y){const $=n().map(v=>({...v,puntos:(v.puntos??[]).map(b=>({...b}))})),A=$.find(v=>v._id===x);A&&(y(A),s($))}function r(x){const y=e.get("config"),$=ge(x,e.get("expenses"),y,e.get("loans"),a(),!1,o());return E($)}function l(x,y,$){const A=y.tipo==="fijo",v=A?"":`<span class="text-sm" style="color:var(--text3)">${c(E((y.meses??0)*$))}</span>`;return`
      <tr data-punto="${c(y._id)}" data-margen="${c(x._id)}">
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
        <td style="padding:4px 6px">${v}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function u(x,y,$){const A=x.cuentas&&x.cuentas.length>0?x.cuentas.map(I=>{var p;return((p=y.find(g=>g._id===I))==null?void 0:p.nombre)??I}).join(", "):"Todas las cuentas activas",b=[...x.puntos??[]].sort((I,p)=>I.fecha.localeCompare(p.fecha)).map(I=>l(x,I,$)).join(""),f=x.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${c(A)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${c(r(x))}</strong>
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
            ${b||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${c(x._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${c(x.nombre)}</span>
            <span class="badge ${x.activo?"badge-active":"badge-inactive"}">${x.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${x.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${x.activo?"checked":""} data-toggle-margen="${c(x._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${c(x._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${c(x._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${f}
      </div>`}function h(x,y){const $=y?n().find(f=>f._id===y):null,A=e.get("accounts").filter(f=>f.activo),v=new Set(($==null?void 0:$.cuentas)??[]),b=A.map(f=>`
        <label class="tag" data-chip="${c(f._id)}" style="cursor:pointer;${v.has(f._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${c(f._id)}" ${v.has(f._id)?"checked":""} style="display:none"/>
          ${c(f.nombre)}
        </label>`).join(" ");x.innerHTML=`
      <div class="modal-title">${y?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${c(($==null?void 0:$.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${b||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
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
      </div>`}function d(x,y){const $=document.getElementById("modal-overlay"),A=document.getElementById("modal-content");!$||!A||(h(A,x),$.classList.remove("hidden"),J(A,".mg-acc-chip",v=>{const b=v,f=A.querySelector(`[data-chip="${b.value}"]`);f&&(f.style.cssText=`cursor:pointer;${b.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),J(A,"#mg-p-tipo",v=>{const b=v.value==="fijo",f=A.querySelector("#mg-p-importe-wrap"),I=A.querySelector("#mg-p-meses-wrap");f&&(f.style.display=b?"":"none"),I&&(I.style.display=b?"none":"")}),N(A,"[data-cerrar-form]",()=>$.classList.add("hidden")),N(A,"[data-guardar-margen]",v=>{var g,w,S,j,_;const b=v.getAttribute("data-guardar-margen")||"",f=((g=A.querySelector("#mg-nombre"))==null?void 0:g.value.trim())??"";if(!f)return q("El nombre es obligatorio","err");const I=[...A.querySelectorAll(".mg-acc-chip:checked")].map(P=>P.value),p=n().map(P=>({...P}));if(b){const P=p.findIndex(C=>C._id===b);if(P===-1)return q("Margen no encontrado","err");p[P]={...p[P],nombre:f,cuentas:I}}else{const P=((w=A.querySelector("#mg-p-tipo"))==null?void 0:w.value)??"fijo",C={_id:sa(),fecha:((S=A.querySelector("#mg-p-fecha"))==null?void 0:S.value)||Y(),tipo:P,importe:parseFloat(((j=A.querySelector("#mg-p-importe"))==null?void 0:j.value)??"0")||0,meses:parseFloat(((_=A.querySelector("#mg-p-meses"))==null?void 0:_.value)??"1")||1};p.push({_id:sa(),nombre:f,activo:!0,cuentas:I,puntos:[C]})}s(p),q(b?"Margen actualizado":"Margen creado"),$.classList.add("hidden"),y()}))}function m(x){const y=n(),$=e.get("accounts"),A=Zt(e.get("expenses"),o());x.innerHTML=`
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
             </div>`:y.map(b=>u(b,$,A)).join("")}`;const v=()=>m(x);N(x,"[data-nuevo-margen]",()=>d(null,v)),N(x,"[data-editar-margen]",b=>d(b.getAttribute("data-editar-margen"),v)),N(x,"[data-borrar-margen]",b=>{Z("¿Eliminar este margen de seguridad?")&&(s(n().filter(f=>f._id!==b.getAttribute("data-borrar-margen"))),q("Margen eliminado"),v())}),J(x,"[data-toggle-margen]",b=>{const f=b.getAttribute("data-toggle-margen");i(f,I=>{I.activo=b.checked}),v()}),N(x,"[data-add-punto]",b=>{const f=b.getAttribute("data-add-punto");i(f,I=>{I.puntos=[...I.puntos??[],{_id:sa(),fecha:Y(),tipo:"fijo",importe:0,meses:1}]}),v()}),N(x,"[data-borrar-punto]",b=>{const f=b.closest("[data-punto]");if(!f)return;const I=f.dataset.margen,p=f.dataset.punto;i(I,g=>{g.puntos=(g.puntos??[]).filter(w=>w._id!==p)}),v()}),J(x,"[data-campo]",b=>{const f=b.closest("[data-punto]");if(!f)return;const I=b.getAttribute("data-campo"),p=b.value;i(f.dataset.margen,g=>{const w=(g.puntos??[]).find(S=>S._id===f.dataset.punto);w&&(I==="fecha"?w.fecha=p:I==="tipo"?w.tipo=p:I==="importe"?w.importe=parseFloat(p)||0:w.meses=parseFloat(p)||0)}),v()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:qi,mount:m}}const Bi="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function ki(t){const e=Array.isArray(t)?t[1]??[]:[];return Array.isArray(e)?e.filter(a=>a&&a.value!==null&&a.value!==void 0&&Number.isFinite(Number(a.value))).map(a=>({year:parseInt(a.date),tasa:parseFloat(Number(a.value).toFixed(2))})).filter(a=>Number.isFinite(a.year)).sort((a,o)=>a.year-o.year):[]}function Hi({fetchImpl:t,url:e=Bi}={}){let a=null,o=!1;async function n(s=!1){if(a&&!s)return a;if(o)return null;o=!0;try{const r=await(t??fetch)(e);if(!r.ok)throw new Error(`HTTP ${r.status}`);return a=ki(await r.json()),a}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:n,invalidar:()=>{a=null},get enCache(){return a}}}const Gi="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function Vi(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function Ui(t){const{store:e}=t,a=t.ipc??Hi(),o=()=>e.get("inflacion")??[];function n(){var d;(d=t.onDatosCambiados)==null||d.call(t)}function s(d,m){if(!d||d.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const x=new Set(o().map(b=>b.year)),y=d.filter(b=>b.year>=m).reverse(),$=y.filter(b=>!x.has(b.year)).length,A=[...new Set(d.map(b=>b.year))].sort((b,f)=>b-f),v=y.map(b=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${b.year}" data-tasa="${b.tasa}" ${x.has(b.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${b.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${Vi(b.tasa)}">${b.tasa.toFixed(2)}%</span>
          ${x.has(b.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${A.map(b=>`<option value="${b}"${b===m?" selected":""}>${b}</option>`).join("")}
        </select>
        <span style="font-size:10px;color:var(--text3)">
          Fuente: Banco Mundial · FP.CPI.TOTL.ZG · ${d[0].year}–${d[d.length-1].year}
        </span>
        <button class="btn-secondary btn-sm" data-ipc-recargar title="Forzar recarga desde la API">↺</button>
      </div>
      <div style="max-height:300px;overflow-y:auto;margin-bottom:12px">${v}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="font-size:12px;color:var(--text3)">${$} periodo${$!==1?"s":""} nuevo${$!==1?"s":""} disponible${$!==1?"s":""}</span>
        <div class="flex gap-8">
          <button class="btn-secondary" data-ipc-cerrar>Cancelar</button>
          <button class="btn-primary" data-ipc-importar ${$===0?"disabled":""}>↓ Importar seleccionados</button>
        </div>
      </div>`}function i(d){return!d||d.length===0?2e3:Math.max(d[0].year,new Date().getFullYear()-25)}async function r(d){const m=document.getElementById("modal-overlay"),x=document.getElementById("modal-content");if(!m||!x)return;x.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,m.classList.remove("hidden");const y=(A,v)=>{const b=document.getElementById("ipc-body");b&&(b.innerHTML=s(A,v))},$=await a.obtener();y($,i($)),N(x,"[data-ipc-cerrar]",()=>m.classList.add("hidden")),J(x,"#ipc-desde",A=>{y(a.enCache,parseInt(A.value))}),N(x,"[data-ipc-recargar]",()=>{a.invalidar();const A=document.getElementById("ipc-body");A&&(A.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),a.obtener(!0).then(v=>y(v,i(v)))}),N(x,"[data-ipc-importar]",()=>{const A=[...x.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(A.length===0)return q("Nada seleccionado","err");const v=new Set(o().map(f=>f.year));let b=0;for(const f of A){const I=parseInt(f.dataset.year??""),p=parseFloat(f.dataset.tasa??"");!Number.isFinite(I)||!Number.isFinite(p)||v.has(I)||(e.addItem("inflacion",{year:I,tasa:p}),v.add(I),b++)}m.classList.add("hidden"),q(`${b} periodo${b!==1?"s":""} importado${b!==1?"s":""} correctamente`),n(),d()})}function l(d,m){var v;const x=document.getElementById("modal-overlay"),y=document.getElementById("modal-content");if(!x||!y)return;const $=d?o().find(b=>b._id===d):null;y.innerHTML=`
      <div class="modal-title">${d?"Editar periodo de inflación":"Nuevo periodo de inflación"}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Año</label>
          <input class="form-input" type="number" id="inf-year" value="${($==null?void 0:$.year)??new Date().getFullYear()}" placeholder="2026"/></div>
        <div class="form-group"><label class="form-label">Tasa anual (%)</label>
          <input class="form-input" type="number" id="inf-tasa" step="0.01" value="${($==null?void 0:$.tasa)??""}" placeholder="3.5"/></div>
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-inf-cerrar>Cancelar</button>
        <button class="btn-primary" data-inf-guardar="${c(d??"")}">Guardar</button>
      </div>`,x.classList.remove("hidden");const A=()=>{var g;const b=parseFloat(((g=y.querySelector("#inf-tasa"))==null?void 0:g.value)??""),f=y.querySelector("#inf-preview");if(!f)return;if(!Number.isFinite(b)||b<=0){f.innerHTML="";return}const I=(Math.pow(1+b/100,1/12)-1)*100,p=Math.pow(1+b/100,5);f.innerHTML=`Con un ${b}% anual: <strong>${I.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${p.toFixed(3)}</strong> (+${((p-1)*100).toFixed(1)}%)`};(v=y.querySelector("#inf-tasa"))==null||v.addEventListener("input",A),A(),N(y,"[data-inf-cerrar]",()=>x.classList.add("hidden")),N(y,"[data-inf-guardar]",b=>{const f=b.getAttribute("data-inf-guardar")||"",I=parseInt(y.querySelector("#inf-year").value),p=parseFloat(y.querySelector("#inf-tasa").value);if(!Number.isFinite(I)||I<1900||I>2200)return q("Año inválido","err");if(!Number.isFinite(p)||p<0||p>100)return q("Tasa inválida (0–100%)","err");if(o().filter(w=>w._id!==f).some(w=>w.year===I))return q("Ya existe un periodo para ese año","err");f?(e.updateItem("inflacion",f,{year:I,tasa:p}),q("Periodo actualizado")):(e.addItem("inflacion",{year:I,tasa:p}),q("Periodo añadido")),x.classList.add("hidden"),n(),m()})}function u(d,m){const x=(Math.pow(1+d.tasa/100,.08333333333333333)-1)*100,y=`${d.year}-12-31`,$=y>m?pt([d],m,y):null;return`
      <div class="exp-table-row" data-periodo="${c(d._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${d.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${d.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${x.toFixed(3)}%/mes</div>
        <div class="num">${$!==null?`×${$.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${c(d._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${c(d._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function h(d){const m=o(),x=e.get("config").usarInflacion||!1,y=[...m].sort((g,w)=>w.year-g.year),$=Y(),A=new Date().getFullYear(),v=V(new Date(A+5,0,1)),b=V(new Date(A+10,0,1)),f=x&&m.length>0?pt(m,$,v):null,I=x&&m.length>0?pt(m,$,b):null;d.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${!x&&m.length===0?`<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
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
            <input type="checkbox" data-toggle-inflacion ${x?"checked":""}/>
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${f!==null&&I!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${f.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((f-1)*100).toFixed(1)}%)</span></div>
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
        ${y.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':y.map(g=>u(g,$)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const p=()=>h(d);J(d,"[data-toggle-inflacion]",g=>{const w=g.checked;e.patchConfig({usarInflacion:w}),q(w?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),n(),p()}),N(d,"[data-nuevo-periodo]",()=>l(null,p)),N(d,"[data-editar-periodo]",g=>l(g.getAttribute("data-editar-periodo"),p)),N(d,"[data-importar-ipc]",()=>void r(p)),N(d,"[data-borrar-periodo]",g=>{Z("¿Eliminar este periodo de inflación?")&&(e.removeItem("inflacion",g.getAttribute("data-borrar-periodo")),q("Periodo eliminado"),n(),p())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:Gi,mount:h}}const Yi=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],Ji=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Wi=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function Ki(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const ia=(t,e)=>t.map(([a,o])=>`<option value="${c(a)}"${a===e?" selected":""}>${c(o)}</option>`).join("");function Fo(t,e="dp"){const{modo:a,dia:o,nth:n,wd:s}=Ki(t),i=ia(Yi.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${c(e)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${ia(Ji,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${ia(Wi,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function Po(t){var o,n,s;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=e.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",a==="dia"?"":"none"),(s=e.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",a==="nthweekday"?"":"none")}function Do(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=n=>{var s;return((s=e.querySelector(n))==null?void 0:s.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const Qi="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Xi=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Zi(t){const e=t.hoy??Y,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var v;return(v=t.onDatosCambiados)==null?void 0:v.call(t)},n=()=>t.store.get("accounts"),s=v=>{var b;return((b=n().find(f=>f._id===(v||"default")))==null?void 0:b.nombre)??(v||"default")};function i(){const v=e();let b=[...t.store.get("expenses")];if(a.mostrarExpirados||(b=b.filter(f=>!f.fechaFin||f.fechaFin>=v)),a.tipo&&(b=b.filter(f=>f.tipo===a.tipo)),a.cuenta&&(b=b.filter(f=>(f.cuenta||"default")===a.cuenta)),a.desde&&(b=b.filter(f=>(f.fechaInicio??"")>=a.desde)),a.hasta&&(b=b.filter(f=>(f.fechaInicio??"")<=a.hasta)),a.busqueda){const f=a.busqueda.toLowerCase();b=b.filter(I=>I.concepto.toLowerCase().includes(f))}return a.tags.size>0&&(b=b.filter(f=>(f.tags||[]).some(I=>a.tags.has(I)))),b.sort((f,I)=>{const p=f[a.orden]??"",g=I[a.orden]??"";return typeof p=="number"&&typeof g=="number"?(p-g)*a.sentido:String(p).localeCompare(String(g))*a.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(v=>v.tags||[]))].filter(Boolean).sort()}function l(v,b){const f=a.orden===v?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${v}">${c(b)} <span class="sort-arrow">${f}</span></span>`}function u(v,b=!1){return(b?'<option value="">Todas las cuentas</option>':"")+n().filter(I=>I.activo!==!1).map(I=>`<option value="${c(I._id)}"${I._id===v?" selected":""}>${c(I.nombre)}</option>`).join("")}function h(v){const b=v.tipo==="transferencia",f=_e(v.diaPago??""),I=v.tipoFrecuencia==="extraordinario"?"Único":`Cada ${v.frecuencia??1} ${v.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${f?` · ${f}`:""}`,p=!!v.fechaFin&&v.fechaFin<e(),g=b?'<span class="badge badge-purple">⇄ transf.</span>':v.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',w=b?`${c(s(v.cuenta))} → ${c(s(v.cuentaDestino))}`:c(s(v.cuenta)),S=(v.tags||[]).map(j=>`<span class="tag${a.tags.has(j)?" active":""}" data-tag="${c(j)}" title="Filtrar por ${c(j)}">${c(j)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(v.concepto)}</div>
        <div class="tag-list mt-4">${S}</div>
      </div>
      <div>${g}</div>
      <div class="num ${v.tipo==="ingreso"?"pos":b?"":"neg"}">${b?"⇄ ":""}${c(E(v.cuantia))}</div>
      <div class="text-sm">${c(I)}</div>
      <div class="text-sm exp-col-hide">${w}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${c(v._id)}"${v.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${v.tipo==="gasto"&&v.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${v.tipo==="gasto"&&v.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${v.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${v.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${c(v.ajustadaEn??"")}">ajustada</span>`:""}
        ${p?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${c(v._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${c(v._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${c(v._id)}">✕</button>
      </div>
    </div>`}function d(v){const b=i(),f=r();v.innerHTML=`
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
        <select class="form-select" data-f-cuenta>${u(a.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${c(a.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${c(a.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${f.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${f.map(I=>`<span class="tag${a.tags.has(I)?" active":""}" data-tag="${c(I)}">${c(I)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${l("concepto","Concepto")} ${l("tipo","Tipo")} ${l("cuantia","Cuantía")} ${l("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${b.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':b.map(h).join("")}
      </div>`}function m(v){const b=(v==null?void 0:v.tipo)==="transferencia",f=t.store.get("escenarios"),I=(v==null?void 0:v.escenarioIds)||[],p=(g,w,S,j,_="")=>`<div class="form-group"><label class="form-label">${c(w)}</label>
       <input class="form-input" type="${S}" id="${g}" value="${c(j)}" placeholder="${c(_)}"/></div>`;return`
      <div class="grid-2">
        ${p("ef-concepto","Concepto","text",(v==null?void 0:v.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(v==null?void 0:v.tipo)==="gasto"||!(v!=null&&v.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(v==null?void 0:v.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${b?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${p("ef-cuantia","Cuantía (€)","number",(v==null?void 0:v.cuantia)??"","500")}
        ${p("ef-frecuencia","Frecuencia","number",(v==null?void 0:v.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${Xi.map(([g,w])=>`<option value="${g}"${((v==null?void 0:v.tipoFrecuencia)??"mensual")===g?" selected":""}>${c(w)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${p("ef-fecha-ini","Fecha inicio","date",(v==null?void 0:v.fechaInicio)??e())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${u((v==null?void 0:v.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${b?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${u((v==null?void 0:v.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(v==null?void 0:v.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${v!=null&&v._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${p("ef-fecha-fin","Fecha fin (opcional)","date",(v==null?void 0:v.fechaFin)??"")}</div>
          <div class="mt-8">${Fo(v==null?void 0:v.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${b?' style="display:none"':""}>
            <div class="mt-8" id="ef-clasificacion-wrap"${(v==null?void 0:v.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${((v==null?void 0:v.clasificacion)??"necesidad")==="necesidad"?" selected":""}>Necesidad</option>
                  <option value="deseo"${(v==null?void 0:v.clasificacion)==="deseo"?" selected":""}>Deseo</option>
                  <option value=""${(v==null?void 0:v.clasificacion)===null?" selected":""}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label>
              <input class="form-input" type="text" id="ef-tags" value="${c(((v==null?void 0:v.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
            <div class="form-row mt-8">
              <label class="form-label">Gasto básico</label>
              <label class="toggle"><input type="checkbox" id="ef-basico"${v!=null&&v.basico?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Incluir en el cálculo del colchón económico</span>
            </div>
            <div class="form-row mt-8" id="ef-irpf-wrap"${(v==null?void 0:v.tipo)==="ingreso"?"":' style="display:none"'}>
              <label class="form-label">Sujeto a retención IRPF</label>
              <label class="toggle"><input type="checkbox" id="ef-sujetoIRPF"${v!=null&&v.sujetoIRPF?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Calcula y proyecta la retención mensual</span>
            </div>
          </div>
          ${f.length>0?`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${f.map(g=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${I.includes(g._id)?c(g.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${c(g._id)}"${I.includes(g._id)?" checked":""}/>
                          ${c(g.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${c((v==null?void 0:v._id)??"")}">Guardar</button>
      </div>`}function x(v){var I;const b=((I=v.querySelector("#ef-tipo"))==null?void 0:I.value)??"gasto",f=(p,g)=>{const w=v.querySelector(p);w&&(w.style.display=g?"":"none")};f("#ef-destino-wrap",b==="transferencia"),f("#ef-basico-wrap",b!=="transferencia"),f("#ef-irpf-wrap",b==="ingreso"),f("#ef-clasificacion-wrap",b==="gasto")}function y(v,b,f){const I=document.getElementById("modal-overlay"),p=document.getElementById("modal-content");!I||!p||(p.innerHTML=`<div class="modal-title">${c(b)}</div>${m(v)}`,I.classList.remove("hidden"),J(p,"#ef-tipo",()=>x(p)),J(p,"[data-dp-modo]",()=>Po(p)),N(p,"[data-cancelar]",()=>I.classList.add("hidden")),N(p,"[data-guardar]",g=>{$(p,g.getAttribute("data-guardar")||"")&&(I.classList.add("hidden"),f())}))}function $(v,b){const f=P=>{var C;return((C=v.querySelector(P))==null?void 0:C.value)??""},I=P=>{var C;return!!((C=v.querySelector(P))!=null&&C.checked)},p=f("#ef-tipo")||"gasto",g=p==="transferencia",w=f("#ef-concepto").trim(),S=parseFloat(f("#ef-cuantia"));if(!w||!Number.isFinite(S))return q("Concepto y cuantía obligatorios","err"),!1;const j=f("#ef-clasificacion"),_={concepto:w,tipo:p,cuantia:S,frecuencia:parseInt(f("#ef-frecuencia"),10)||1,tipoFrecuencia:f("#ef-tipo-frec")||"mensual",fechaInicio:f("#ef-fecha-ini"),fechaFin:f("#ef-fecha-fin")||null,diaPago:Do(v),cuenta:f("#ef-cuenta"),cuentaDestino:g?f("#ef-cuenta-dest")||"default":void 0,activo:I("#ef-activo"),basico:!g&&I("#ef-basico"),sujetoIRPF:!g&&I("#ef-sujetoIRPF"),clasificacion:p==="gasto"?j||null:void 0,tags:g?["transferencia"]:f("#ef-tags").split(",").map(P=>P.trim()).filter(Boolean),escenarioIds:[...v.querySelectorAll(".ef-escenario:checked")].map(P=>P.value)};return b?(t.store.updateItem("expenses",b,_),q("Actualizado")):(t.store.addItem("expenses",_),q("Creado")),o(),!0}function A(v,b){const f=v.querySelector("[data-busqueda]");let I;f==null||f.addEventListener("input",()=>{clearTimeout(I),I=setTimeout(()=>{a.busqueda=f.value,b();const p=v.querySelector("[data-busqueda]");p==null||p.focus(),p==null||p.setSelectionRange(p.value.length,p.value.length)},250)}),J(v,"[data-expirados]",p=>{a.mostrarExpirados=p.checked,b()}),J(v,"[data-f-tipo]",p=>{a.tipo=p.value,b()}),J(v,"[data-f-cuenta]",p=>{a.cuenta=p.value,b()}),J(v,"[data-f-desde]",p=>{a.desde=p.value,b()}),J(v,"[data-f-hasta]",p=>{a.hasta=p.value,b()}),N(v,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,b()}),N(v,"[data-limpiar-tags]",()=>{a.tags=new Set,b()}),N(v,"[data-tag]",p=>{const g=p.getAttribute("data-tag");a.tags.has(g)?a.tags.delete(g):a.tags.add(g),b()}),N(v,"[data-orden]",p=>{const g=p.getAttribute("data-orden");a.orden===g?a.sentido=a.sentido===1?-1:1:(a.orden=g,a.sentido=1),b()}),N(v,"[data-nuevo]",()=>y(null,"Nuevo gasto/ingreso",b)),N(v,"[data-editar]",p=>{const g=t.store.get("expenses").find(w=>w._id===p.getAttribute("data-editar"));g&&y(g,"Editar",b)}),N(v,"[data-duplicar]",p=>{const g=t.store.get("expenses").find(j=>j._id===p.getAttribute("data-duplicar"));if(!g)return;const{_id:w,...S}=g;y({...S,concepto:`${g.concepto} (copia)`},"Duplicar movimiento",b)}),N(v,"[data-borrar]",p=>{Z("¿Eliminar?")&&(t.store.removeItem("expenses",p.getAttribute("data-borrar")),q("Eliminado"),o(),b())}),J(v,"[data-activo]",p=>{const g=p;t.store.updateItem("expenses",g.getAttribute("data-activo"),{activo:g.checked}),o(),b()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:Qi,mount(v){const b=()=>d(v);d(v),v.dataset.wired!=="1"&&(A(v,b),v.dataset.wired="1")}}}function $e(t,e,a){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=pt(e,a,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function To(t,e,a,o){return t.reduce((n,s)=>{const i=pt(e,a,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function tr(t,e,a){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=at({...t,amortizaciones:o.slice(0,s)}),r=at({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:$e(i.tabla,e,a)-$e(r.tabla,e,a)}})}const ra=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${c(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function er(t,e){const a=wa(t),o=(t.amortizaciones||[]).length>0,n=e.periodos.length>0,s=e.usarInflacion&&n,i=n?Sa(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,r=n?Ma(t.tin||0,i):null,l=o&&n?tr(t,e.periodos,e.hoy):[],u=l.length?$e(a.sinAmort.tabla,e.periodos,e.hoy)-$e(a.tabla,e.periodos,e.hoy):null,h=u===null?null:u-a.costeTotalAmort,d=s?To(a.tabla,e.periodos,e.hoy,a.comAp):null,m=s&&o?To(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${c(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${c(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(t.tags||[]).map(x=>`<span class="tag">${c(x)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${c(t.tin)}%</span>
        <span class="text-sm">${c(E(t.capital))}</span>
        <span class="text-sm">${c(t.meses)}m</span>
        <button class="btn-icon" data-amort-loan="${c(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${c(t._id)}">

      <div class="grid-4 mb-12">
        ${ra("Cuota mensual",c(E(a.cuota)),e.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${c(E(e.cuotaMes))}</div>`:"")}
        ${ra("Total intereses",c(E(a.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(E(a.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${c(a.fechaFin||"—")}</div>
          ${o&&a.fechaFin!==a.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(a.sinAmort.fechaFin||"—")}${a.ahorroTiempo>0?` (−${a.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${ra("Total pagado",c(E(a.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${c(E(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${c(xa(a.tae))}</div></div>
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
          <div><div class="stat-label">Capital</div><div class="stat-value">${c(E(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${c(E(a.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${c(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${c(_e(t.diaPago))}</div></div>`:""}
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
               ${u!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${c(E(a.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${c(E(u))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${c(E(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${c(E(a.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(h??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${c(E(h??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${c(E(a.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${c(E(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${c(E(a.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${d!==null?ar(t,a.totalPagado,d,m):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(x=>or(x,s,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((x,y)=>nr(t._id,x,l[y]??null,e)).join("")}`:""}
    </div>
  </div>`}function ar(t,e,a,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-a,l=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${c(E(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${c(E(a))}</div></div>
        <div><div class="stat-label">${l?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${l?"pos":"neg"}">${l?"−":"+"}${c(E(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=e-a,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${c(E(e))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${c(E(a))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${c(E(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function or(t,e,a){let o="";if(e&&!t.esAmortizacion){const n=pt(a.periodos,a.hoy,t.fecha);o=c(E(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":c(t.mes)}</td>
    <td class="num">${c(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":c(E(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${c(E(t.interes))}</td>
    <td class="num">${c(E(t.amortizacion))}</td>
    <td class="num">${c(E(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function nr(t,e,a,o){const n=(e.escenarioIds||[]).map(s=>`<span class="badge badge-yellow">🔭 ${c(o.nombreEscenario(s))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${c(e.fecha)}</span>
    <span class="num">${c(E(e.cantidad))}</span>
    <span class="badge ${e.simulacion?"badge-sim":"badge-active"}">${e.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${e.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${n}
    ${a?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${c(E(a.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${c(E(a.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${c(t)}|${c(e._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${c(t)}|${c(e._id)}">✕</button>
  </div>`}const tt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(n)}"/></div>`,Ht=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${c(n)}"${n===o?" selected":""}>${c(s)}</option>`).join("")}
   </select></div>`,re=(t,e,a,o="")=>`<label class="form-label">${c(e)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${a?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${c(o)}</span>`:""}`;function le(t,e,a){return t.length===0?"":`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${t.map(o=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${e.includes(o._id)?c(o.color||"var(--accent)"):"var(--border)"}">
            <input type="checkbox" class="${c(a)}" value="${c(o._id)}"${e.includes(o._id)?" checked":""}/>
            ${c(o.nombre)}
          </label>`).join("")}
    </div></div>`}const sr=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function ir(t,e,a,o=Y()){return`
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
            <select class="form-select" id="f-cuenta">${sr(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${Fo(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Ht("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
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
          ${re("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${le(a,(t==null?void 0:t.escenarioIds)??[],"loan-escenario")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${re("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${re("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${re("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function rr(t,e,a,o=Y()){return`
    <div class="grid-2">
      ${tt("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??o)}
      ${tt("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Ht("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(e==null?void 0:e.tipo)??"cuota")}
    </div>
    ${le(a,(e==null?void 0:e.escenarioIds)??[],"amort-escenario")}
    <div class="form-row mt-8">
      ${re("am-sim","Simulación",!!(e!=null&&e.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${c(t)}|${c((e==null?void 0:e._id)??"")}">${e?"Guardar cambios":"Añadir"}</button>
    </div>`}const No="opt_",Ro=t=>String(t).startsWith(No);function lr(t){let e=null,a=null;const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content");function s(f,I){const p=o(),g=n();return!p||!g?null:(g.innerHTML=`<div class="modal-title">${c(f)}</div>${I}`,p.classList.remove("hidden"),g)}const i=()=>{var f;return(f=o())==null?void 0:f.classList.add("hidden")};function r(){let f=!1;for(const I of t.loans()){const p=(I.amortizaciones||[]).filter(g=>!Ro(g._id));p.length!==(I.amortizaciones||[]).length&&(t.guardarAmortizaciones(I._id,p),f=!0)}return f}function l(f){try{return f()}catch(I){return q(I instanceof Error?I.message:"No se ha podido completar el cálculo","err"),null}}function u(){var j,_;if(!Xa("optimizador")){q("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const f=t.loans().filter(P=>P.activo&&!P.simulacion);if(f.length===0){q("No hay préstamos activos para optimizar","err");return}const I=t.config(),p=t.accounts().filter(P=>P.activo&&!P.simulacion),g=((j=p.find(P=>P.esCuentaPrincipal))==null?void 0:j._id)??((_=p[0])==null?void 0:_._id)??"",w=I.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,S=s("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${p.map(P=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${c(P._id)}"${P._id===g?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(P.nombre)}${P._id===g?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${c(E(rt(P)))}</span>
              </label>`).join("")||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${f.map(P=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
              <input type="checkbox" class="opt-loan-check" value="${c(P._id)}"${P.tin>=5?" checked":""} style="accent-color:var(--accent)"/>
              <span style="font-size:13px;flex:1">${c(P.nombre)}</span>
              <span class="badge badge-yellow" style="font-size:11px">${c(P.tin)}% TIN</span>
            </label>`).join("")}
      </div>
      <button class="btn-secondary btn-sm mb-12" data-opt-todos>Seleccionar todo</button>

      <div class="grid-2" style="gap:10px">
        ${tt("opt-horizonte","Horizonte (meses)","number",60,"60")}
        ${tt("opt-frecuencia","Frecuencia manual (cada N meses)","number",1,"1")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${tt("opt-min","Importe mínimo por amortización (€)","number",500,"500")}
        ${Ht("opt-tipo","Efecto de la amortización",[["plazo","Reducir plazo (mantener cuota)"],["cuota","Reducir cuota (mantener plazo)"]],"plazo")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${tt("opt-fecha-primera","Fecha primera amortización","date","")}
        ${tt("opt-fecha-obj","Fecha objetivo para comparar saldo","date",w)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);S&&(h(S),J(S,".opt-acc-radio",()=>h(S)),N(S,"[data-opt-todos]",()=>{const P=[...S.querySelectorAll(".opt-loan-check")],C=P.every(M=>M.checked);P.forEach(M=>M.checked=!C)}),N(S,"[data-cancelar]",i),N(S,"[data-opt-calcular]",()=>y(S)),N(S,"[data-opt-comparar]",()=>$(S)))}function h(f){var S;const I=(S=f.querySelector(".opt-acc-radio:checked"))==null?void 0:S.value,g=(t.config().margenesSeguridad||[]).filter(j=>j.activo!==!1).filter(j=>!j.cuentas||j.cuentas.length===0||I&&j.cuentas.includes(I)),w=f.querySelector("#opt-margenes-wrap");w&&(w.innerHTML=g.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':g.map(j=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${c(j._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(j.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!j.cuentas||j.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function d(f){var w,S,j,_;const I=(P,C,M=0)=>{var F;const z=parseFloat(((F=f.querySelector(P))==null?void 0:F.value)??"");return Number.isFinite(z)?Math.max(M,z):C},p=[...f.querySelectorAll(".opt-loan-check")],g=p.filter(P=>P.checked).map(P=>P.value);return{horizonte:Math.round(I("#opt-horizonte",60,1)),frecuencia:Math.round(I("#opt-frecuencia",1,1)),minAmortizable:I("#opt-min",500),tipoAmort:((w=f.querySelector("#opt-tipo"))==null?void 0:w.value)||"plazo",fechaObjetivo:((S=f.querySelector("#opt-fecha-obj"))==null?void 0:S.value)||null,fechaPrimeraAmort:((j=f.querySelector("#opt-fecha-primera"))==null?void 0:j.value)||null,loanIds:p.length===0||g.length===p.length?null:g,sourceAccountId:((_=f.querySelector(".opt-acc-radio:checked"))==null?void 0:_.value)??null,selectedMarginIds:[...f.querySelectorAll(".opt-margin-check:checked")].map(P=>P.value)}}const m=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function x(f,I=""){const p=s("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${c(f)}</div>
        ${I?`<div class="text-sm mt-8" style="color:var(--text3)">${c(I)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);p&&(N(p,"[data-opt-volver]",u),N(p,"[data-cancelar]",i))}function y(f){const I=d(f);r()&&q("Plan anterior eliminado, recalculando…");const{loans:p,expenses:g,accounts:w,config:S,nominas:j}=m(),_=l(()=>He(p,g,w,S,{frecuencia:I.frecuencia,mesesHorizonte:I.horizonte,minAmortizable:I.minAmortizable,tipoAmort:I.tipoAmort,fechaPrimeraAmort:I.fechaPrimeraAmort,loanIds:I.loanIds,nominas:j,sourceAccountId:I.sourceAccountId,selectedMarginIds:I.selectedMarginIds}));if(!_)return;if(_.plan.length===0){x(`No hay excedente suficiente respetando los ${_.margenesAplicados} márgenes de seguridad activos en los próximos ${I.horizonte} meses para generar amortizaciones por encima del mínimo de ${E(I.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}a={plan:_.plan,tipoAmort:I.tipoAmort};const P=`✨ Plan de optimización · ${I.frecuencia===1?"Mensual":`Cada ${I.frecuencia} meses`} · ${I.horizonte}m`,C=s(P,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(E(_.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${c(E(_.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${c(E(_.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${_.margenesAplicados}</div></div>
      </div>
      ${_.resumenPorLoan.map(qo).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${_.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${_.plan.map(M=>Oo(M,!0)).join("")}</tbody>
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
      </div>`);C&&(N(C,"[data-opt-volver]",u),N(C,"[data-cancelar]",i),N(C,"[data-opt-aplicar]",()=>{a&&v(a.plan,a.tipoAmort)}))}function $(f){const I=d(f);r();const{loans:p,expenses:g,accounts:w,config:S,nominas:j}=m(),_=l(()=>eo(p,g,w,S,{horizonte:I.horizonte,minAmortizable:I.minAmortizable,tipoAmort:I.tipoAmort,fechaObjetivo:I.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:I.fechaPrimeraAmort,loanIds:I.loanIds,nominas:j,sourceAccountId:I.sourceAccountId,selectedMarginIds:I.selectedMarginIds}));if(!_)return;if(_.resultados.length===0){x("No hay excedente suficiente en ninguna frecuencia.");return}e=_;const{resultados:P,saldoBase:C,fechaObjetivo:M}=_,z=P.map(T=>{const R=[T.esMejorIntereses&&"💰 +intereses",T.esMejorSaldo&&"🏦 +saldo",T.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${T.esMejorValor?"background:rgba(46,230,168,0.06);":""}">
          <td style="font-weight:600">${c(T.label)}</td>
          <td class="num">${T.numAmortizaciones}</td>
          <td class="num neg">${c(E(T.totalAmortizado))}</td>
          <td class="num pos">${c(E(T.ahorroIntereses))}</td>
          <td class="num ${T.saldoObjetivo>=C?"pos":"neg"}">${c(E(T.saldoObjetivo))}</td>
          <td class="num pos">${c(E(T.valorTotal))}</td>
          <td style="font-size:11px">${R}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${T.frecuencia}">Usar</button></td>
        </tr>`}).join(""),F=s(`📊 Comparativa de frecuencias · hasta ${M}`,`
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${c(M)}: <strong>${c(E(C))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${c(M.slice(0,7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${z}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);F&&(N(F,"[data-opt-volver]",u),N(F,"[data-cancelar]",i),N(F,"[data-opt-usar]",T=>A(Number(T.getAttribute("data-opt-usar")))))}function A(f){var p;const I=e==null?void 0:e.resultados.find(g=>g.frecuencia===f);I&&(r(),v(I.plan,((p=I.plan[0])==null?void 0:p.tipoAmort)||"plazo",{titulo:`✨ Plan ${I.label} · aplicado`,resumen:I,fechaObjetivo:e==null?void 0:e.fechaObjetivo}))}function v(f,I,p){if(f.length===0)return;const g=new Map;for(const S of f){const j=g.get(S.loanId)??[];j.push({_id:`${No}${S.mes}_${S.loanId}`,fecha:S.fechaAmort,cantidad:S.cantidadAmort,tipo:I,simulacion:!0}),g.set(S.loanId,j)}let w=0;for(const S of t.loans()){const j=g.get(S._id);if(!j)continue;const _=(S.amortizaciones||[]).filter(P=>!Ro(P._id));t.guardarAmortizaciones(S._id,[..._,...j]),w+=1}q(`Plan aplicado: ${f.length} amortizaciones en ${w} préstamo${w!==1?"s":""} (simulación)`),p?b(p):i(),t.refrescar([...g.keys()])}function b({titulo:f,resumen:I,fechaObjetivo:p}){const g=s(f,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(E(I.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${c(E(I.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${c((p==null?void 0:p.slice(0,7))??"")}</div><div class="stat-value pos">${c(E(I.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${c(E(I.totalComisiones))}</div></div>
      </div>
      ${I.resumenPorLoan.map(qo).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${I.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${I.plan.map(w=>Oo(w,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);g&&N(g,"[data-cancelar]",i)}return{abrir:u,get planManual(){return a},get comparativa(){return e}}}function Oo(t,e){const a=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${c(E(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${c(t.mes)}</td>
    <td>${c(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${c(E(t.capitalAntes))}</td>
    <td class="num neg">${c(E(t.cantidadAmort))}${a}</td>
    <td class="num">${c(E(t.capitalDespues))}</td>
    ${e?`<td class="num" style="color:var(--text3)">${c(E(t.saldoDisponible))} → ${c(E(t.saldoDespues))}</td>`:""}
  </tr>`}function qo(t){return`<div class="card mb-8" style="padding:12px">
    <div class="flex justify-between items-center mb-8">
      <span style="font-weight:600">${c(t.nombre)}</span>
      <span class="badge badge-yellow">${c(t.tin)}% TIN</span>
    </div>
    <div class="grid-4" style="gap:8px;font-size:12px">
      <div><div class="stat-label">Fecha fin</div>
        <div class="num" style="text-decoration:line-through;color:var(--text3)">${c(t.fechaFinSin)}</div>
        <div class="num pos">${c(t.fechaFinCon)}</div></div>
      <div><div class="stat-label">Plazo ahorrado</div><div class="num pos">${t.mesesAhorrados>0?`${t.mesesAhorrados}m`:"—"}</div></div>
      <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${c(E(t.ahorroIntereses))}</div></div>
      <div><div class="stat-label">${t.numAmortizaciones} amorts.</div><div class="num">${c(E(t.totalAmortizado))}</div></div>
    </div>
  </div>`}const cr="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function dr(t){const e=t.hoy??Y;let a=!1;const o=new Set;let n=null;const s=()=>{var p;return(p=t.onDatosCambiados)==null?void 0:p.call(t)},i=()=>t.store.get("escenarios"),r=p=>{var g;return((g=i().find(w=>w._id===p))==null?void 0:g.nombre)??p};function l(p){if(!p.activo||p.simulacion)return!1;const g=at(p).tabla.filter(w=>!w.esAmortizacion);return g.length===0?!0:g[g.length-1].fecha<e()}function u(p,g){const w=e(),S=w.slice(0,7),j=new Map;let _=0;for(const P of p){if(!P.activo||P.simulacion||g.has(P._id)||(P.fechaInicio||"")>w)continue;const C=at(P).tabla.filter(z=>!z.esAmortizacion&&z.fecha.startsWith(S)),M=C.length>0?C[0].cuota:0;j.set(P._id,M),_+=M}return{porLoan:j,total:_,activos:[...j.values()].filter(P=>P>0).length}}function h(p){const g=t.store.get("config"),w=g.dashboardStart,S=g.dashboardEnd,j=Math.max(1,(G(S).getTime()-G(w).getTime())/(30.44*864e5));let _=0;for(const P of p)!P.activo||P.simulacion||(_+=at(P).tabla.filter(C=>!C.esAmortizacion&&C.fecha>=w&&C.fecha<=S).reduce((C,M)=>C+M.cuota,0));return{media:_/j,desde:w,hasta:S}}function d(p){const g=[...t.store.get("loans")].sort((z,F)=>F.tin-z.tin),w=new Set(g.filter(l).map(z=>z._id)),S=a?g:g.filter(z=>!w.has(z._id)),j=u(g,w),_=h(g),P=t.store.get("config"),C=t.store.get("inflacion"),M=new Date(G(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});p.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${w.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${w.size})</button>`:""}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${j.total>0||_.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${j.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${c(M)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${c(E(j.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${j.activos} préstamo${j.activos!==1?"s":""} activo${j.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${_.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${c(E(_.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${c(_.desde)} → ${c(_.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${S.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':S.map(z=>er(z,{periodos:C,usarInflacion:!!P.usarInflacion,hoy:e(),cuotaMes:j.porLoan.get(z._id)??0,completado:w.has(z._id),nombreEscenario:r})).join("")}
      </div>`;for(const z of p.querySelectorAll("[data-body-loan]"))o.has(z.dataset.bodyLoan??"")&&z.classList.add("open")}const m=()=>document.getElementById("modal-overlay"),x=()=>document.getElementById("modal-content"),y=()=>{var p;return(p=m())==null?void 0:p.classList.add("hidden")};function $(p,g){const w=m(),S=x();return!w||!S?null:(S.innerHTML=`<div class="modal-title">${c(p)}</div>${g}`,w.classList.remove("hidden"),N(S,"[data-cancelar]",y),S)}function A(p,g){const w=p?t.store.get("loans").find(j=>j._id===p)??null:null,S=$(p?"Editar préstamo":"Nuevo préstamo",ir(w,t.store.get("accounts"),i(),e()));S&&(S.addEventListener("change",j=>{var _;(_=j.target)!=null&&_.matches("[data-dp-modo]")&&Po(S)}),N(S,"[data-guardar-loan]",j=>{v(S,j.getAttribute("data-guardar-loan")||"")&&(y(),g())}))}function v(p,g){const w=z=>{var F;return((F=p.querySelector(z))==null?void 0:F.value)??""},S=z=>{var F;return!!((F=p.querySelector(z))!=null&&F.checked)},j=w("#f-nombre").trim(),_=parseFloat(w("#f-capital")),P=parseFloat(w("#f-tin")),C=parseInt(w("#f-meses"),10);if(!j||!Number.isFinite(_)||!Number.isFinite(P)||!Number.isFinite(C))return q("Completa los campos obligatorios","err"),!1;const M={nombre:j,capital:_,tin:P,meses:C,fechaInicio:w("#f-fecha"),comisionApertura:parseFloat(w("#f-com-ap"))||0,comisionAmort:parseFloat(w("#f-com-am"))||0,diaPago:Do(p),cuenta:w("#f-cuenta"),simulacion:S("#f-sim"),activo:S("#f-activo"),mostrarFechaFinEnDashboard:S("#f-mostrar-fin"),tipoTasa:w("#f-tipo-tasa"),basico:S("#f-basico"),tags:w("#f-tags").split(",").map(z=>z.trim()).filter(Boolean),escenarioIds:[...p.querySelectorAll(".loan-escenario:checked")].map(z=>z.value)};return g?(t.store.updateItem("loans",g,M),q("Préstamo actualizado")):(t.store.addItem("loans",{...M,amortizaciones:[]}),q("Préstamo creado")),s(),!0}function b(p,g,w){const S=t.store.get("loans").find(P=>P._id===p);if(!S)return;const j=g?(S.amortizaciones||[]).find(P=>P._id===g)??null:null,_=$(g?"Editar amortización":"Añadir amortización",rr(p,j,i(),e()));_&&N(_,"[data-guardar-amort]",P=>{const[C,M]=(P.getAttribute("data-guardar-amort")||"").split("|");f(_,C,M)&&(y(),w([C]))})}function f(p,g,w){var F;const S=T=>{var R;return((R=p.querySelector(T))==null?void 0:R.value)??""},j=S("#am-fecha"),_=parseFloat(S("#am-cant"));if(!j||!Number.isFinite(_)||_<=0)return q("Fecha y cantidad requeridas","err"),!1;const P=t.store.get("loans").find(T=>T._id===g);if(!P)return!1;const C={fecha:j,cantidad:_,tipo:S("#am-tipo"),simulacion:!!((F=p.querySelector("#am-sim"))!=null&&F.checked),escenarioIds:[...p.querySelectorAll(".amort-escenario:checked")].map(T=>T.value)},M=P.amortizaciones||[],z=w?M.map(T=>T._id===w?{...T,...C}:T):[...M,{_id:Date.now().toString(36),...C}];return t.store.updateItem("loans",g,{amortizaciones:z}),q(w?"Amortización actualizada":"Amortización añadida"),s(),!0}function I(p,g,w){N(p,"[data-toggle-finalizados]",()=>{a=!a,g()}),N(p,"[data-nuevo-loan]",()=>A(null,g)),N(p,"[data-optimizar]",()=>w.abrir()),N(p,"[data-toggle-loan]",(S,j)=>{var M;if((M=j.target)!=null&&M.closest("button"))return;const _=S.getAttribute("data-toggle-loan"),P=[...p.querySelectorAll("[data-body-loan]")].find(z=>z.dataset.bodyLoan===_);(P==null?void 0:P.classList.toggle("open"))?o.add(_):o.delete(_)}),N(p,"[data-editar-loan]",S=>A(S.getAttribute("data-editar-loan"),g)),N(p,"[data-borrar-loan]",S=>{if(!Z("¿Eliminar préstamo?"))return;const j=S.getAttribute("data-borrar-loan");t.store.removeItem("loans",j),o.delete(j),q("Eliminado"),s(),g()}),N(p,"[data-amort-loan]",S=>{const j=S.getAttribute("data-amort-loan");o.add(j),b(j,null,g)}),N(p,"[data-editar-amort]",S=>{const[j,_]=(S.getAttribute("data-editar-amort")||"").split("|");o.add(j),b(j,_,g)}),N(p,"[data-borrar-amort]",S=>{const[j,_]=(S.getAttribute("data-borrar-amort")||"").split("|"),P=t.store.get("loans").find(C=>C._id===j);P&&(t.store.updateItem("loans",j,{amortizaciones:(P.amortizaciones||[]).filter(C=>C._id!==_)}),q("Amortización eliminada"),s(),g([j]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:cr,mount(p){const g=(w=[])=>{for(const S of w)o.add(S);d(p)};n??(n=lr({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(w,S)=>{t.store.updateItem("loans",w,{amortizaciones:S}),s()},hoy:e,refrescar:g})),d(p),p.dataset.wired!=="1"&&(I(p,g,n),p.dataset.wired="1")}}}const ur={transporte:125,restaurante:220,otros:null},pr={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},mr=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Gt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(n)}"/></div>`,fr=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function vr(t,e){const a=t.map((s,i)=>{const r=e.find(h=>h._id===s.cuenta),l=ur[s.tipo],u=l!=null&&s.importe>l;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${c(pr[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${c(E(s.importe))}/mes${u?` <span style="color:var(--red)" title="Supera el límite orientativo de ${c(E(l))}/mes">⚠</span>`:""}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function gr(t,e){const a=e.hoy??Y(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Gt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Gt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(s=>`<option value="${s}"${n&&o===s?" selected":""}>${s} pagas</option>`).join("")}
          <option value="custom"${n?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${fr(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Gt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??a)}
          ${Gt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Gt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${mr.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${c(s)} (${i+1})</option>`).join("")}
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
          ${Gt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??Oe).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${le(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"nom-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Lo(t,e){const a=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const l=parseFloat(a(i));return Number.isFinite(l)?l:r},n=a("#nf-npagas"),s=n==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Oe),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:e}}function br(t,e,a,o){const n=Lo(t,e),s=e.reduce((v,b)=>v+(b.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),l=n.irpfModo==="manual"?i*(n.irpfPct/100):ut(wt(n.bruto,s),a.tramos),u=i-r-l,h=i/n.nPagas,d=r/n.nPagas,m=l/n.nPagas,x=h-d-m,y=n.grupoNomina?a.nominas.filter(v=>v.grupoNomina===n.grupoNomina&&v._id!==o):[],$=y.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${c(n.grupoNomina)}" con ${c(y.map(v=>v.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",A=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${c(E(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${c(E(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${c(E(n.bruto))}</span>
      ${A}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${c(E(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${c(E(l))} (${i>0?(l/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${c(E(u))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${c(E(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${c(E(x))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${c(E(x))}/paga`:`ingreso ${c(E(h))} − SS ${c(E(d))} − IRPF ${c(E(m))}`}${s>0?" + recargas flex":""}</span>
    </div>${$}`}function hr(t,e,a,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=vr(e,a.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=br(t,e,a,o))},i=()=>{var l,u;const r=(h,d)=>{const m=t.querySelector(h);m&&(m.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((l=t.querySelector("#nf-npagas"))==null?void 0:l.value)==="custom"),r("#nf-irpfpct-wrap",((u=t.querySelector("#nf-irpfmodo"))==null?void 0:u.value)==="manual"),s()};t.addEventListener("input",r=>{var l;(l=r.target)!=null&&l.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),J(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),N(t,"[data-flex-anadir]",()=>{var u,h,d;const r=((u=t.querySelector("#fc-tipo"))==null?void 0:u.value)||"transporte",l=parseFloat(((h=t.querySelector("#fc-importe"))==null?void 0:h.value)??"")||0;if(!l)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:r,importe:l,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),n(),s()}),N(t,"[data-flex-borrar]",r=>{e.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const Bo=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function yr(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var m;return(m=o())==null?void 0:m.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??gt;function r(m,x){const y=o(),$=n();return!y||!$?null:($.innerHTML=`<div class="modal-title">${c(m)}</div>${x}`,y.classList.remove("hidden"),N($,"[data-cerrar]",s),$)}function l(){e=null;const m=[...t.store.get("tramosIRPFHistorico")].sort(($,A)=>$.año-A.año),x="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",y=r("Tramos IRPF por ejercicio",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
        Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${x}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(Bo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${m.map($=>`<div style="${x}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(Bo($.tramos))}</span>
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
      </div>`);y&&(N(y,"[data-editar-tabla]",$=>{const A=$.getAttribute("data-editar-tabla");d(A==="default"?"default":Number(A))}),N(y,"[data-borrar-tabla]",$=>{const A=Number($.getAttribute("data-borrar-tabla"));Z(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(v=>v.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),N(y,"[data-anadir-anyo]",()=>{var v;const $=parseInt(((v=y.querySelector("#irpf-new-year"))==null?void 0:v.value)??"",10);if(!$||$<2e3||$>2100)return q("Año inválido","err");const A=t.store.get("tramosIRPFHistorico");if(A.some(b=>b.año===$))return q("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...A,{_id:Date.now().toString(36),año:$,tramos:i().map(b=>[...b])}]),t.onDatosCambiados(),d($)}))}function u(){return a.map(([m,x],y)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${y}" value="${m}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${y}" value="${x}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${y}">✕</button>
          </div>
        </div>`).join("")}function h(m){a=[...m.querySelectorAll("[data-tr-min]")].map((y,$)=>{const A=m.querySelector(`[data-tr-pct="${$}"]`);return[parseFloat(y.value)||0,parseFloat((A==null?void 0:A.value)??"")||0]})}function d(m){var b;e=m;const x=t.store.get("tramosIRPFHistorico");a=(m==="default"?i():((b=x.find(f=>f.año===m))==null?void 0:b.tramos)??i()).map(f=>[...f]);const $=m==="default"?"tabla por defecto":`ejercicio ${m}`,A=r(`Tramos IRPF — ${m==="default"?"Por defecto":m}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${c($)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!A)return;const v=()=>{const f=A.querySelector("#irpf-tramos-rows");f&&(f.innerHTML=u())};N(A,"[data-volver]",l),N(A,"[data-tr-anadir]",()=>{h(A),a.push([0,0]),v()}),N(A,"[data-tr-borrar]",f=>{h(A),a.splice(Number(f.getAttribute("data-tr-borrar")),1),v()}),N(A,"[data-tr-guardar]",()=>{h(A);const f=[...a].sort((I,p)=>I[0]-p[0]);if(f.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:f}),q("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(I=>I.año===e?{...I,tramos:f}:I)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}const ko=1500,Dt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(n)}"/></div>`,xr=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${c(n)}"${n===o?" selected":""}>${c(s)}</option>`).join("")}
   </select></div>`,$r=t=>(t.modeloFondo||"cuenta")==="pension";function Ir(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>Ar(n,e,a,o)).join("")}</div>`}function Ar(t,e,a,o){const n=ve(t);if(!n)return"";const s=Re(t,e,a),i=o.slice(0,4),r=(t.aportaciones||[]).filter(u=>u.fecha>=`${i}-01-01`).reduce((u,h)=>u+h.cantidad,0),l=Math.min(r,ko)*(s/100);return`<div class="card">
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
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${c(E(n.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(E(n.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${n.beneficio>=0?"pos":"neg"}">${c(E(n.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(E(n.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(E(n.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>ko?"neg":""}">${c(E(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${c(E(l))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${c(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${c(n.proxDesbloqueo)}</div>`:""}
  </div>`}function wr(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${c(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${c(E(a.importe))} / ${c(a.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Sr(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${Dt("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${Dt("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Dt("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${Dt("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${Dt("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${xr("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${Dt("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${s?' style="display:none"':""}>
        ${Dt("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
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
    ${le(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"pen-escenario")}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Mr(t,e,a){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=wr(e))};J(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),N(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#paport-fin"))==null?void 0:l.value)||""}),o()}),N(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Cr(t,e,a,o){var A;const n=v=>{var b;return((b=t.querySelector(v))==null?void 0:b.value)??""},s=(v,b=0)=>{const f=parseFloat(n(v));return Number.isFinite(f)?f:b},i=v=>{var b;return!!((b=t.querySelector(v))!=null&&b.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const l=s("#pen-saldo"),u=n("#pen-grupo"),h={nombre:r,grupoNomina:u,saldo:l,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:u?0:s("#pen-impuesto"),planAportaciones:e,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(v=>v.value)},d=[...(a==null?void 0:a.historicoSaldos)??[]],m=[...(a==null?void 0:a.aportaciones)??[]],y=((A=[...d].sort((v,b)=>b.fecha.localeCompare(v.fecha))[0])==null?void 0:A.saldo)??(a==null?void 0:a.saldo)??null,$=Date.now().toString(36);return a?(y===null||Math.abs(l-y)>.005)&&(d.push({_id:$,fecha:o,saldo:l,nota:"Actualización manual"}),l>(y??0)&&m.push({_id:`${$}a`,fecha:o,cantidad:l-(y??0)})):l>0&&(d.push({_id:$,fecha:o,saldo:l,nota:"Saldo inicial"}),m.push({_id:`${$}a`,fecha:h.fechaInicialSaldo??o,cantidad:l})),{datos:{...h,historicoSaldos:d,aportaciones:m}}}const Er="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function jr(t){const e=t.hoy??Y,a=()=>{var A;return(A=t.onDatosCambiados)==null?void 0:A.call(t)};function o(){const A=t.store.get("config");return bt(t.store.get("tramosIRPFHistorico"),A.tramos_irpf??gt)(Number(e().slice(0,4)))}function n(A,v,b){const f=Le(A,v,b),I=!!v&&A.irpfModo!=="manual",p=[A.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${A.mesActualizacionIPC}">IPC m${A.mesActualizacionIPC}</span>`:"",f.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${c(E(f.flexAnual))}/año</span>`:"",Math.abs(f.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${f.ssPct.toFixed(2)}%</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(A.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${p}</div>
      </div>
      <div class="num">${c(E(f.brutoAnual))}
        ${f.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${c(E(f.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${c(E(f.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${f.nPagas} pagas</div>
      <div class="text-sm ${I?"neg":""}">${A.irpfModo==="manual"?`${c(A.irpfPct??0)}% (manual)`:`${f.irpfPct.toFixed(1)}% (auto)`}${I?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${A.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${c(s(A.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${c(A._id)}"${A.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${c(A._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${c(A._id)}">✕</button>
      </div>
    </div>`}const s=A=>{var v;return((v=t.store.get("accounts").find(b=>b._id===(A||"default")))==null?void 0:v.nombre)??(A||"default")};function i(A,v,b){const f=v.reduce((g,w)=>g+(w.bruto||0),0),I=Fn(v,b),p=f>0?I/f*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${c(A)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${c(E(f))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${p.toFixed(1)}%</strong> (${c(E(I))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${v.map(g=>n(g,v,b)).join("")}
      </div>
    </div>`}function r(A){const v=o(),b=[...t.store.get("nominas")].sort((w,S)=>(S.bruto||0)-(w.bruto||0)),{grupos:f,sueltas:I}=Dn(b),p=t.store.get("accounts").filter($r),g=b.filter(w=>w.activo!==!1);A.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${b.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...f.entries()].map(([w,S])=>i(w,S,v)).join("")}
      ${I.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${I.map(w=>n(w,null,v)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Ir(p,g,v,e())}</div>`}const l=()=>document.getElementById("modal-overlay"),u=()=>document.getElementById("modal-content"),h=()=>{var A;return(A=l())==null?void 0:A.classList.add("hidden")};function d(A,v){const b=l(),f=u();return!b||!f?null:(f.innerHTML=`<div class="modal-title">${c(A)}</div>${v}`,b.classList.remove("hidden"),N(f,"[data-cancelar]",h),f)}function m(A,v){const b=A?t.store.get("nominas").find(g=>g._id===A)??null:null,f=[...(b==null?void 0:b.retribucionFlexible)??[]].map(g=>({...g})),I={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:o(),hoy:e()},p=d(A?"Editar nómina":"Nueva nómina",gr(b,I));p&&(hr(p,f,I,A??""),N(p,"[data-guardar-nomina]",g=>{const w=Lo(p,f);if(!w.nombre||w.bruto<=0)return q("Nombre y bruto anual son obligatorios","err");const S=g.getAttribute("data-guardar-nomina")||"",j={...w,activo:!0,tags:["nomina"]};S?(t.store.updateItem("nominas",S,j),q("Nómina actualizada")):(t.store.addItem("nominas",j),q("Nómina creada")),a(),h(),v()}))}function x(A,v){const b=A?t.store.get("accounts").find(p=>p._id===A)??null:null,f=[...(b==null?void 0:b.planAportaciones)??[]].map(p=>({...p})),I=d(A?"Editar plan de pensiones":"Nuevo plan de pensiones",Sr(b,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:e()}));I&&(Mr(I,f,e()),N(I,"[data-guardar-pension]",p=>{const{datos:g,error:w}=Cr(I,f,b,e());if(w)return q(w,"err");const S=p.getAttribute("data-guardar-pension")||"";S?(t.store.updateItem("accounts",S,g),q("Plan actualizado")):(t.store.addItem("accounts",g),q("Plan creado")),a(),h(),v()}))}function y(A,v,b){N(A,"[data-nueva-nomina]",()=>m(null,v)),N(A,"[data-editar-nom]",f=>m(f.getAttribute("data-editar-nom"),v)),N(A,"[data-borrar-nom]",f=>{Z("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",f.getAttribute("data-borrar-nom")),q("Eliminada"),a(),v())}),J(A,"[data-activo-nom]",f=>{const I=f;t.store.updateItem("nominas",I.getAttribute("data-activo-nom"),{activo:I.checked}),a(),v()}),N(A,"[data-tramos]",()=>b.abrir()),N(A,"[data-nueva-pension]",()=>x(null,v)),N(A,"[data-editar-pension]",f=>x(f.getAttribute("data-editar-pension"),v)),N(A,"[data-borrar-pension]",f=>{Z("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",f.getAttribute("data-borrar-pension")),q("Plan eliminado"),a(),v())})}let $=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Er,mount(A){const v=()=>r(A);$??($=yr({store:t.store,onDatosCambiados:()=>{a(),v()},año:()=>Number(e().slice(0,4))})),r(A),A.dataset.wired!=="1"&&(y(A,v,$),A.dataset.wired="1")}}}const _r="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",zr="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",Ho={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Fr={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Pr(t,e){const a=t.filter(l=>l.activo&&mt(l)==="inversion");if(a.length===0)return"";let o=0,n=0,s=0,i=0;for(const l of a){const u=Ot(l,e);u&&(o+=u.saldo,n+=u.costBase,s+=u.plusvalia,i+=u.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${c(E(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${c(E(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${c(r)}%)</div><div class="stat-value ${s>=0?"pos":"neg"}">${c(E(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${c(E(i))}</div><div class="stat-sub">Neto: ${c(E(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function Dr(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,n=Math.max(1,(G(o).getTime()-G(a).getTime())/(30.44*864e5)),s=Wt(t,a),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(e.config.usarInflacion&&e.inflacion.length>0){const l=s*(pt(e.inflacion,a,o)-1),u=i-l;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${c(E(l))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${u>=0?"var(--accent)":"var(--red)"};font-weight:600">${c(E(u))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${c(a.slice(0,7))} → ${c(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${c(E(i))}</span>
    </div>${r}
  </div>`}function Tr(t,e){const a=Ho[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,n=e.nominas.flatMap(x=>(x.retribucionFlexible??[]).filter(y=>y.cuenta===t._id).map(y=>({nomina:x,importe:y.importe}))),s=n.reduce((x,y)=>x+y.importe,0),i=s*12,r=o!==null&&i>o,l=o!==null?Math.min(i,o):i,u=t.grupoNomina?e.nominas.filter(x=>(x.grupoNomina||"")===t.grupoNomina&&x.activo!==!1):n.slice(0,1).map(x=>x.nomina),h=Pa(u,e.tramosIRPF),d=l*h/100,m=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${h}%`:`tipo marginal ${h}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${c(a.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${c(E(s))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${c(E(i))}/año${r?` ⚠ excede límite ${c(E(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${c(E(o))}/año</span></div>`:""}
    ${d>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${c(m)}">≈ ${c(E(d))}/año <span style="font-size:10px;color:var(--text3)">(${c(h)}%)</span></span></div>`:""}
    ${n.length>0?n.map(x=>`<div style="font-size:11px;color:var(--text3)">↩ ${c(x.nomina.nombre)}: ${c(E(x.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function Nr(t){const e=ve(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(E(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(E(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${c(E(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${c(E(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${c(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${c(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function Rr(t,e){const a=Ot(t,e.tramosGanancias);if(!a)return"";const o=e.config,n=e.flujos(t._id),s=G(o.dashboardStart),i=G(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),l=a.saldo+n.totalAportaciones-n.totalReembolsos,u=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,h=l>0&&r>0?Math.max(0,l*Math.pow(1+u,r)):Math.max(0,l),d=a.costBase+n.totalAportaciones,m=Math.max(0,h-d),x=Ne(m,e.tramosGanancias),y=m>0?(x/m*100).toFixed(1):"0",$=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",A=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",v=(w,S,j)=>w.map(_=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${S} ${c(_.contraparte)}: ${c(_.concepto)}</span>
          <span class="num ${j}">${c(E(_.total))} · ${_.ocurrencias} mov.</span>
        </div>`).join(""),f=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${c(o.dashboardStart.slice(0,7))} → ${c(o.dashboardEnd.slice(0,7))})</div>
         ${v(n.entradas,"↓","pos")}
         ${v(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${c(E(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${c(E(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${c(E(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',I=e.invModo(t._id),p=w=>`padding:3px 10px;border-radius:20px;border:1px solid ${w?"var(--accent)":"var(--border)"};background:${w?"var(--accent-dim)":"transparent"};color:${w?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,g=I==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(E(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${c(E(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${c(E(a.neto))}</div><div class="stat-sub">${c(A)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${c(E(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${c(E(h))}</div><div class="stat-sub">${c($)} · ${c(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${c(E(h-x))}</div><div class="stat-sub">${c(y)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${c(t._id)}|real" style="${p(I==="real")}">Real</button>
          <button data-inv-modo="${c(t._id)}|proyeccion" style="${p(I==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${g}
      ${f}
    </div>`}function Or(t,e){const a=[...t.historicoSaldos||[]].sort((l,u)=>u.fecha.localeCompare(l.fecha)),o=a[0],n=rt(t),s=mt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${c((Ho[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(l=>`<span class="badge badge-yellow">🔭 ${c(e.nombreEscenario(l))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${c(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${c(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${c(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${zr}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${_r}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${c(E(t.saldoInicial||0))}</div><div class="stat-sub">${c(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${c(E(n))}</div>${o?`<div class="stat-sub">Registro: ${c(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${c(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${c(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Dr(t,e)}
    ${s==="beneficio"?Tr(t,e):""}
    ${s==="pension"?Nr(t):""}
    ${s==="inversion"?Rr(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${c(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${c(t.descripcion)}</div>`:""}
  </div>`}const qr=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function Lr(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${c(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${c(E(a.importe))} / ${c(a.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Br(t,e){const a=t?mt(t):"cuenta",o=[...new Set(e.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${tt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Ht("ac-modelo","Tipo",qr,a)}
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
          ${Ht("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${Ht("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
        ${le(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"ac-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function kr(t,e,a){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=Lr(e))};J(t,"#ac-modelo",n=>{const s=n.value,i=(r,l)=>{const u=t.querySelector(r);u&&(u.style.display=l?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),N(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#aport-fin"))==null?void 0:l.value)||""}),o()}),N(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Hr(t,e,a,o,n){const s=y=>{var $;return(($=t.querySelector(y))==null?void 0:$.value)??""},i=(y,$=0)=>{const A=parseFloat(s(y));return Number.isFinite(A)?A:$},r=y=>{var $;return!!(($=t.querySelector(y))!=null&&$.checked)},l=s("#ac-nombre").trim();if(!l)return{datos:{},error:"Nombre obligatorio"};const u=s("#ac-modelo")||"cuenta",h=u==="beneficio",d=i("#ac-saldo"),m={nombre:l,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(y=>y.value),modeloFondo:u,planAportaciones:e,tipoBeneficio:h?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:h?s("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&d<=0)return{datos:m};if(!(o===null||Math.abs(d-o)>.005))return{datos:m};if(u==="inversion"&&d>(o??0)){const y=Date.now().toString(36);m.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${y}a`,fecha:a?n:m.fechaInicialSaldo??n,cantidad:d-(o??0)}]}return{datos:m,punto:{fecha:n,saldo:d,nota:a?"Actualización manual":"Saldo inicial"}}}function la(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:et(e.saldoCts),nota:e.nota}))}function Gr(t,e,a,o,n){const s=a.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${c(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${c(E(i.saldo))}</span>
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
    </div>`}const Go=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function Vr(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var m;return(m=o())==null?void 0:m.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??jt;function r(m,x){const y=o(),$=n();return!y||!$?null:($.innerHTML=`<div class="modal-title">${c(m)}</div>${x}`,y.classList.remove("hidden"),N($,"[data-cerrar]",s),$)}function l(){e=null;const m=[...t.store.get("tramosGananciasCapitalHistorico")].sort(($,A)=>$.año-A.año),x="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",y=r("Tramos — Ganancias de capital",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tramos marginales de la base del ahorro (art. 49 LIRPF): plusvalías de fondos, intereses y dividendos.
        Un ejercicio sin tabla propia usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${x}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(Go(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${m.map($=>`<div style="${x}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(Go($.tramos))}</span>
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
      </div>`);y&&(N(y,"[data-editar-tg]",$=>{const A=$.getAttribute("data-editar-tg");d(A==="default"?"default":Number(A))}),N(y,"[data-borrar-tg]",$=>{const A=Number($.getAttribute("data-borrar-tg"));Z(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(v=>v.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),N(y,"[data-anadir-anyo-tg]",()=>{var v;const $=parseInt(((v=y.querySelector("#tg-new-year"))==null?void 0:v.value)??"",10);if(!$||$<2e3||$>2100)return q("Año inválido","err");const A=t.store.get("tramosGananciasCapitalHistorico");if(A.some(b=>b.año===$))return q("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...A,{_id:Date.now().toString(36),año:$,tramos:i().map(b=>[...b])}]),t.onDatosCambiados(),d($)}))}function u(){return a.map(([m,x],y)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${y}" value="${m}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${y}" value="${x}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${y}">✕</button>
          </div>
        </div>`).join("")}function h(m){a=[...m.querySelectorAll("[data-tg-min]")].map((x,y)=>{const $=m.querySelector(`[data-tg-pct="${y}"]`);return[parseFloat(x.value)||0,parseFloat(($==null?void 0:$.value)??"")||0]})}function d(m){var v;e=m;const x=t.store.get("tramosGananciasCapitalHistorico");a=(m==="default"?i():((v=x.find(b=>b.año===m))==null?void 0:v.tramos)??i()).map(b=>[...b]);const $=r(`Ganancias de capital — ${m==="default"?"Por defecto":m}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!$)return;const A=()=>{const b=$.querySelector("#tg-rows");b&&(b.innerHTML=u())};N($,"[data-volver-tg]",l),N($,"[data-tg-anadir]",()=>{h($),a.push([0,0]),A()}),N($,"[data-tg-borrar]",b=>{h($),a.splice(Number(b.getAttribute("data-tg-borrar")),1),A()}),N($,"[data-tg-guardar]",()=>{h($);const b=[...a].sort((f,I)=>f[0]-I[0]);if(b.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:b}),q("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(f=>f.año===e?{...f,tramos:b}:f)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}function Ur(t){function e(){if(t.navegar)return t.navegar("planner");const s=globalThis.Router;s==null||s.navigate("planner")}function a(s,i,r){const l=Ca(s,i,r),u=s.targetAmount||0,h=u>0?Math.min(100,l/u*100):0;return`
      <div style="padding:8px 0;border-bottom:1px solid var(--hairline-soft)">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:500">${c(s.nombre)}</span>
          <span class="num" style="font-size:11px;color:var(--text3)">
            ${c(E(l))} / ${c(E(u))}
          </span>
        </div>
        <div class="goal-bar"><div class="goal-bar-fill" style="width:${h}%;background:${c(s.color||"var(--accent)")}"></div></div>
      </div>`}function o(s){const i=t.store.get("goals");if(i.length===0){s.innerHTML="",s.style.display="none";return}s.style.display="";const r=t.store.get("accounts"),l=t.colchonEnFecha(t.hoy()),u=[...i].sort((h,d)=>(h.prioridad||99)-(d.prioridad||99));s.innerHTML=`
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro (antiguos)</div>
        <button class="btn-primary btn-sm" data-ir-planner>Ir a Objetivos financieros</button>
      </div>
      <div class="text-sm mb-12" style="color:var(--text2);line-height:1.6">
        Estos objetivos se gestionan ahora en <strong>Objetivos financieros</strong>, donde compiten por tu
        flujo mensual en vez de medir solo el saldo de unas cuentas. Ya se copiaron allí; esto es solo la
        copia antigua, en modo lectura.
      </div>
      ${u.map(h=>a(h,r,l)).join("")}
      <div class="mt-12">
        <button class="btn-secondary btn-sm" data-descartar-goals style="color:var(--red)">Descartar los antiguos</button>
        <div class="text-sm mt-4" style="color:var(--text3)">
          Comprueba antes que están en Objetivos financieros: esto no se puede deshacer.
        </div>
      </div>`}function n(s,i){N(s,"[data-ir-planner]",()=>e()),N(s,"[data-descartar-goals]",()=>{const r=t.store.get("goals").length;if(Z(`Se van a borrar ${r} objetivo${r!==1?"s":""} de ahorro antiguos. ¿Seguro?`)){for(const l of[...t.store.get("goals")])t.store.removeItem("goals",l._id);q("Objetivos antiguos descartados"),t.onDatosCambiados(),i()}})}return{render:o,wire:n}}const Yr="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Jr=120;function Wr(t){const e=t.hoy??Y,a=()=>{var C;return(C=t.onDatosCambiados)==null?void 0:C.call(t)},o=t.mostrarObjetivos??(()=>!0),n=new Map,s=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),r=C=>{var M;return((M=i().find(z=>z._id===C))==null?void 0:M.nombre)??C},l=C=>{var M;return((M=t.store.get("accounts").find(z=>z._id===C))==null?void 0:M.nombre)??C},u=()=>bt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??gt)(Number(e().slice(0,4))),h=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??jt),d=()=>h()(Number(e().slice(0,4))),m=C=>Ja(t.store.get("expenses"),s(),t.store.get("loans"),C);function x(){const C=s(),M=t.store.get("accounts"),z=Xt({loans:[],expenses:t.store.get("expenses").filter(B=>B.tipo==="transferencia"),accounts:M,config:{dashboardStart:C.dashboardStart,dashboardEnd:C.dashboardEnd,fechaReferencia:C.dashboardStart},nominas:[],resolverTramosGanancias:h()}),F=new Map,T=B=>{let L=F.get(B);return L||(L={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},F.set(B,L)),L},R=(B,L)=>{const k=`${L.sourceId}`,O=B.find(U=>U.concepto===k),H=O??{concepto:k,contraparte:"",total:0,ocurrencias:0};H.total+=Math.abs(L.cuantia),H.ocurrencias+=1,O||B.push(H)};for(const B of z){if(!B.cuenta)continue;const L=T(B.cuenta);B.sourceType==="transfer-in"||B.sourceType==="traspaso-in"?(L.totalAportaciones+=Math.abs(B.cuantia),R(L.entradas,B)):B.sourceType==="transfer-out"||B.sourceType==="traspaso-out"?(L.totalReembolsos+=Math.abs(B.cuantia),R(L.salidas,B)):B.sourceType==="investment-tax"&&(L.retencion+=Math.abs(B.cuantia))}const D=t.store.get("expenses");for(const B of F.values())for(const[L,k]of[[B.entradas,"cuenta"],[B.salidas,"cuentaDestino"]])for(const O of L){const H=D.find(U=>U._id===O.concepto);O.contraparte=l((H==null?void 0:H[k])??"default"),O.concepto=(H==null?void 0:H.concepto)||(k==="cuenta"?"Aportación":"Reembolso")}return F}function y(){const C=new Map,M=s(),z=e(),F=new Date(Number(z.slice(0,4)),Number(z.slice(5,7))-1+Jr+1,0),T=`${F.getFullYear()}-${String(F.getMonth()+1).padStart(2,"0")}-${String(F.getDate()).padStart(2,"0")}`;return R=>{const D=C.get(R._id);if(D)return D;const B=Xt({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...M,dashboardStart:z,dashboardEnd:T,fechaReferencia:z},filtroAccounts:[R._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),M.tramos_irpf??gt),resolverTramosGanancias:h()}).map(L=>({fecha:L.fecha,saldoAcum:L.saldoAcum}));return C.set(R._id,B),B}}const $=Ur({store:t.store,colchonEnFecha:m,extractoCuenta:C=>A(C),hoy:e,onDatosCambiados:a});let A=y();function v(C){A=y();const z=t.store.get("accounts").filter(D=>mt(D)!=="pension"),F=x(),T={config:s(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:u(),tramosGanancias:d(),nombreEscenario:r,flujos:D=>F.get(D)??Fr,invModo:D=>n.get(D)??"proyeccion"};C.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${Pr(z,T.tramosGanancias)}
      <div class="grid-3">${z.map(D=>Or(D,T)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const R=C.querySelector("#goals-section");R&&$.render(R)}const b=()=>document.getElementById("modal-overlay"),f=()=>document.getElementById("modal-content"),I=()=>{var C;return(C=b())==null?void 0:C.classList.add("hidden")};function p(C,M){const z=b(),F=f();return!z||!F?null:(F.innerHTML=C?`<div class="modal-title">${c(C)}</div>${M}`:M,z.classList.remove("hidden"),N(F,"[data-cancelar]",I),F)}function g(C,M){const z=C?t.store.get("accounts").find(D=>D._id===C)??null:null,F=[...(z==null?void 0:z.planAportaciones)??[]].map(D=>({...D})),T=z?w(z):null,R=p(C?"Editar cuenta / fondo":"Nueva cuenta / fondo",Br(z,{escenarios:i(),nominas:t.store.get("nominas"),hoy:e(),saldoActual:T??0}));R&&(kr(R,F,e()),N(R,"[data-guardar-acc]",D=>{const B=D.getAttribute("data-guardar-acc")||"",{datos:L,punto:k,error:O}=Hr(R,F,z,T,e());if(O)return q(O,"err");let H=B;B?t.store.updateItem("accounts",B,L):H=t.store.addItem("accounts",L)._id,k&&t.ledger.registrarPuntoControl(H,k.fecha,k.saldo,k.nota),q(B?"Actualizada":"Cuenta / fondo creado"),a(),I(),M()}))}function w(C){const M=t.ledger.puntosControl(C._id);return M.length>0?la(M)[0].saldo:C.saldo??null}function S(C,M){const z=t.store.get("accounts").find(R=>R._id===C);if(!z)return;const F=p("Histórico de saldos",Gr(z.nombre,C,la(t.ledger.puntosControl(C)),z.saldoInicial||0,e()));if(!F)return;const T=()=>{M(),S(C,M)};N(F,"[data-hist-anadir]",()=>{var L,k,O;const R=((L=F.querySelector("#hi-fecha"))==null?void 0:L.value)??"",D=parseFloat(((k=F.querySelector("#hi-saldo"))==null?void 0:k.value)??""),B=((O=F.querySelector("#hi-nota"))==null?void 0:O.value.trim())??"";if(!R||!Number.isFinite(D))return q("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(C,R,D,B||void 0),q("Punto añadido"),a(),T()}),N(F,"[data-hist-borrar]",R=>{const[,D]=(R.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(D),q("Eliminado"),a(),T()}),N(F,"[data-hist-inicial]",R=>{const[D,B]=(R.getAttribute("data-hist-inicial")||"").split("|"),L=t.ledger.puntosControl(D).find(O=>O._id===B);if(!L)return;const k=la([L])[0].saldo;t.store.updateItem("accounts",D,{saldoInicial:k,fechaInicialSaldo:L.fecha}),q(`Punto inicial → ${L.fecha} (${E(k)})`),a(),T()})}function j(C){const M=t.store.get("accounts").filter(T=>T.activo);if(M.length===0)return q("No hay cuentas activas","err");const z=e(),F=M.map(T=>`• ${T.nombre}: ${E(w(T)??T.saldoInicial??0)}`).join(`
`);if(Z(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${z})?

${F}

Esto recalibra el punto de arranque del dashboard.`)){for(const T of M)t.store.updateItem("accounts",T._id,{saldoInicial:w(T)??T.saldoInicial??0,fechaInicialSaldo:z});q("Saldo base actualizado"),a(),C()}}function _(C,M,z){N(C,"[data-nueva-acc]",()=>g(null,M)),N(C,"[data-editar-acc]",F=>g(F.getAttribute("data-editar-acc"),M)),N(C,"[data-tramos-ganancias]",()=>z.abrir()),N(C,"[data-reset-base]",()=>j(M)),N(C,"[data-hist-acc]",F=>S(F.getAttribute("data-hist-acc"),M)),N(C,"[data-principal-acc]",F=>{const T=F.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(R=>({...R,esCuentaPrincipal:R._id===T}))),q("Cuenta marcada como principal"),a(),M()}),N(C,"[data-borrar-acc]",F=>{const T=F.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return q("Debe existir al menos una cuenta","err");if(!Z("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",T);const D=t.store.get("accounts");D.length>0&&!D.some(B=>B.esCuentaPrincipal)&&t.store.set("accounts",D.map((B,L)=>L===0?{...B,esCuentaPrincipal:!0}:B)),q("Cuenta eliminada"),a(),M()}),N(C,"[data-inv-modo]",F=>{const[T,R]=(F.getAttribute("data-inv-modo")||"").split("|");n.set(T,R==="real"?"real":"proyeccion"),M()}),$.wire(C,M)}let P=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:Yr,mount(C){const M=()=>v(C);P??(P=Vr({store:t.store,onDatosCambiados:()=>{a(),M()},año:()=>Number(e().slice(0,4))})),v(C),C.dataset.wired!=="1"&&(_(C,M,P),C.dataset.wired="1")}}}const ot=(t,e,a="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${a};font-size:12px;padding:5px 10px">${c(E(e))}</td>
  </tr>`,ca=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${c(t)}</td></tr>`;function Vo(t){const a=t.capMobiliario!==0||t.gananciasFondos!==0?`${ot("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
       ${ot("Ganancias patrimoniales (fondos/acciones)",t.gananciasFondos,t.gananciasFondos>=0?"var(--text)":"var(--green)",!0)}`:'<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>',o=t.resultado>0?"var(--red)":"var(--green)",n=t.resultado>0?"🔴 A PAGAR":"🟢 A DEVOLVER";return`
    <table style="width:100%;border-collapse:collapse">
      ${ca("RENDIMIENTOS DEL TRABAJO")}
      ${ot("Ingresos íntegros del trabajo",t.brutoTotal,"var(--text)",!0)}
      ${t.flexTotal>0?ot("− Retribución flexible exenta (Art. 42 LIRPF)",-t.flexTotal,"var(--green)",!0):""}
      ${t.flexTotal>0?ot("= Ingresos sujetos a IRPF",t.brutoIRPF):""}
      ${ot("− Cotizaciones SS (≈6,35 %)",-t.cotizSS,"var(--red)",!0)}
      ${ot("− Gastos deducibles (Art. 19.2 LIRPF)",-t.gastosArt19,"var(--red)",!0)}
      ${ot("= Rendimiento neto trabajo",t.RNT)}
      ${ot("− Reducción Art. 20 LIRPF",-t.reducArt20,"var(--green)",!0)}
      ${t.deducPP>0?ot(`− Aportaciones a planes de pensiones (${c(E(t.aportPP))}, límite ${c(E(t.limPP))})`,-t.deducPP,"var(--green)",!0):""}
      ${t.otrosIngresos>0?ot("+ Otros ingresos sujetos a IRPF",t.otrosIngresos,"var(--text)",!0):""}
      ${t.capInmobiliario!==0?ot("+ Capital inmobiliario neto",t.capInmobiliario,t.capInmobiliario>=0?"var(--text)":"var(--green)",!0):""}
      ${t.otrasCorto!==0?ot("± Otras ganancias a corto plazo",t.otrasCorto,"var(--text)",!0):""}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE GENERAL</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(E(t.baseGeneral))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota IRPF base general</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(E(t.cuotaGen))}</td>
      </tr>

      ${ca("BASE DEL AHORRO")}
      ${a}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(E(t.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(E(t.cuotaAho))}</td>
      </tr>

      ${ca("RESULTADO")}
      ${ot("Cuota íntegra total",t.cuotaIntegra,"var(--red)")}
      ${ot("− Retenciones en nómina",-t.retNomina,"var(--green)",!0)}
      ${t.retCapital!==0?ot("− Retenciones de capital mobiliario",-t.retCapital,"var(--green)",!0):""}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${n}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${o}">${c(E(Math.abs(t.resultado)))}</td>
      </tr>
    </table>`}const ce=(t,e,a,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${c(e)}</label>
    <input type="number" id="${t}" class="form-input" value="${c(a)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${c(o)}</div>`:""}
  </div>`;function Kr(t){const e=t.extras,a=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
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
          ${ce("rex-inmobiliario","Capital inmobiliario neto (alquileres − gastos)",e.capInmobiliario??0)}
          ${ce("rex-mobiliario","Capital mobiliario (dividendos, intereses)",e.capMobiliario??0)}
          ${ce("rex-ganancias","Ganancias / pérdidas patrimoniales (fondos, acciones)",e.gananciasFondos??0,"Positivo = ganancia · Negativo = pérdida compensable")}
          ${ce("rex-otras","Otras ganancias a corto plazo (menos de 1 año)",e.otrasCorto??0)}
          ${ce("rex-ret-cap","Retenciones de capital ya aplicadas",e.retCapital??0,"Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen")}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${t.nominas.length>0?t.nominas.map(o=>`• ${c(o.nombre)}: ${c(E(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${c(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${Vo(t.declaracion)}</div>
      </div>
    </div>`}function Uo(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((a,o)=>a[0]-o[0]).map(([a,o],n,s)=>{const i=n<s.length-1?s[n+1][0]:null,r=i!==null?`${E(a)} – ${E(i)}`:`Más de ${E(a)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${c(r)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${c(o)}%</td>
      </tr>`}).join("")}
  </table>`}const Qr=(t,e,a)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${c(e)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${a}</div>
  </div>`,ct=(t,e,a="")=>`<div class="stat-card"><div class="stat-label">${c(t)}</div><div class="stat-value ${a}">${c(e)}</div></div>`,yt=(t,e,a="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${c(t)}</span><span class="num ${a}">${c(e)}</span></div>`;function Xr(t,e,a){const o=t.filter(l=>(l.modeloFondo||"cuenta")==="inversion");if(o.length===0)return Qr("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let n=0,s=0,i=0;const r=o.map(l=>{const u=Ot(l,e);if(!u)return"";n+=u.saldo,s+=u.costBase,i+=u.impuesto;const h=u.costBase>0?u.plusvalia/u.costBase*100:0,d=(l.escenarioIds||[]).map(m=>`<span class="badge badge-yellow">🔭 ${c(a(m))}</span>`).join("");return`
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${c(l.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${d}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            ${ct("Valor actual",E(u.saldo))}
            ${ct("Coste base (aportado)",E(u.costBase))}
          </div>
          <div class="grid-2" style="gap:8px">
            ${ct(`Plusvalía latente (${h>=0?"+":""}${h.toFixed(1)}%)`,E(u.plusvalia),u.plusvalia>=0?"pos":"neg")}
            ${ct("Imp. ganancias de capital (est.)",E(u.impuesto),"neg")}
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${c(E(u.neto))}</span>
          </div>
        </div>`}).join("");return`
    <div class="card mb-16" style="border:1px solid rgba(99,102,241,0.3)">
      <div class="card-title">Cartera de fondos — resumen</div>
      <div class="grid-3" style="gap:8px;margin-bottom:10px">
        ${ct("Valor total de la cartera",E(n))}
        ${ct("Total aportado (coste base)",E(s))}
        ${ct("Plusvalía latente total",E(n-s),n-s>=0?"pos":"neg")}
      </div>
      <div class="grid-2" style="gap:8px">
        ${ct("Impuesto estimado si se liquida todo",E(i),"neg")}
        ${ct("Neto tras impuestos (cartera completa)",E(n-i),"pos")}
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
      ${Uo(e)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function Zr(t){const{nominas:e,planes:a,tramos:o}=t,n=x=>x.grupoNomina?e.filter(y=>(y.grupoNomina||"")===x.grupoNomina):null,s=e.map(x=>({n:x,d:Le(x,n(x),o)})),i=s.reduce((x,y)=>x+y.d.brutoAnual,0),r=s.reduce((x,y)=>x+y.d.irpfAnual,0),l=s.reduce((x,y)=>x+y.d.ssAnual,0),u=s.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':s.map(({n:x,d:y})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${c(x.nombre)}</div>
          ${yt("Bruto anual",E(y.brutoAnual))}
          ${y.flexAnual>0?yt("− Retribución flexible exenta",E(-y.flexAnual),"pos"):""}
          ${yt("− Cotización SS",E(-y.ssAnual),"neg")}
          ${yt(`− IRPF estimado (${y.irpfPct.toFixed(1)} %)`,E(-y.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${c(E(y.baseDineraria-y.ssAnual-y.irpfAnual))}</span>
          </div>
        </div>`).join(""),h=Pa(e,o),d=`${t.hoy.slice(0,4)}-01-01`,m=a.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':a.map(x=>{const y=ve(x);if(!y)return"";const $=(x.aportaciones||[]).filter(f=>f.fecha>=d).reduce((f,I)=>f+I.cantidad,0),v=Math.min($,zt)*h/100,b=$>zt;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${c(x.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${yt("Valor actual",E(y.saldo))}
          ${yt("Coste base (total aportado)",E(y.costBase))}
          ${yt("Revalorización",E(y.beneficio),y.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(t.hoy.slice(0,4))}</div>
            ${yt("Aportado",`${E($)}${b?" ⚠":""}`,b?"neg":"")}
            ${yt("Límite deducible",E(zt))}
            ${yt(`Ahorro IRPF est. (marginal ${h} %)`,E(v),"pos")}
            ${b?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${c(E(zt))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${y.proxDesbloqueo?`· Próx. desbloqueo: ${c(y.proxDesbloqueo)}`:""}
          </div>
        </div>`}).join("");return`
    <div class="card mb-16">
      <div class="card-title mb-10">Nóminas activas — importes anuales</div>
      <div class="grid-4" style="gap:8px;margin-bottom:14px">
        ${ct("Bruto anual total",E(i))}
        ${ct("Cotización SS anual",E(l),"neg")}
        ${ct("IRPF estimado anual",E(r),"neg")}
        ${ct("Neto anual",E(i-l-r),"pos")}
      </div>
      <div class="grid-3">${u}</div>
    </div>

    <div class="card-title mb-8">Planes de pensiones</div>
    <div class="auth-hint mb-14" style="border-color:var(--yellow)">
      💼 <strong>Diferencia clave frente a los fondos de inversión:</strong> el rescate de un plan de pensiones tributa en la
      <strong>base general del IRPF</strong> (tramos ordinarios hasta el 47 %), <em>no</em> en la base del ahorro. Las
      aportaciones son deducibles hasta <strong>${c(E(zt))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${m}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${Uo(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const Ie=(t,e)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${c(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${c(e)}</div>
  </div>`;function tl(){return`
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
        ${Ie("Rendimientos íntegros","Alquileres, subarriendos y cesión de derechos sobre inmuebles")}
        ${Ie("Gastos deducibles","IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación")}
        ${Ie("Reducción del 60 %","Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)")}
        ${Ie("Base general del IRPF","Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.")}
      </div>
    </div>`}const Yo=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],el="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function al(t){const e=t.hoy??Y;let a="declaracion",o={};const n=()=>t.store.get("config"),s=()=>Number(e().slice(0,4)),i=()=>t.store.get("nominas").filter(b=>b.activo),r=()=>t.store.get("accounts").filter(b=>(b.modeloFondo||"cuenta")==="pension"),l=b=>{var f;return((f=t.store.get("escenarios").find(I=>I._id===b))==null?void 0:f.nombre)??b},u=()=>bt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??gt)(s()),h=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??jt)(s());function d(){const b=`${s()}-01-01`,f=t.store.get("nominas").filter(g=>g.activo&&!g.simulacion),I=r().reduce((g,w)=>g+(w.aportaciones||[]).filter(S=>S.fecha>=b).reduce((S,j)=>S+j.cantidad,0),0),p=t.store.get("expenses").filter(g=>g.activo&&g.sujetoIRPF&&g.tipo==="ingreso").reduce((g,w)=>g+Da(w),0);return Na({nominas:f,aportacionesPension:I,otrosIngresos:p,extras:o,tramosGeneral:u(),tramosAhorro:h()})}function m(){const b=u(),f=i(),I=M=>M.grupoNomina?f.filter(z=>(z.grupoNomina||"")===M.grupoNomina):null,p=f.map(M=>Le(M,I(M),b)),g=p.reduce((M,z)=>M+z.brutoAnual,0),w=p.reduce((M,z)=>M+z.irpfAnual,0),S=p.reduce((M,z)=>M+z.ssAnual,0),j=t.store.get("accounts").filter(M=>(M.modeloFondo||"cuenta")==="inversion");let _=0,P=0;for(const M of j){const z=Ot(M,h());z&&(_+=z.plusvalia,P+=z.impuesto)}if(g<=0&&j.length===0)return"";const C=(M,z,F)=>`<div class="exec-item"><div class="exec-item-label">${c(M)}</div><div class="exec-item-val ${F}">${c(z)}</div></div>`;return`<div class="exec-summary mb-14">
      ${g>0?C("IRPF trabajo",`${E(w)}/año`,"neg"):""}
      ${g>0?C("Neto trabajo",`${E(g-S-w)}/año`,"pos"):""}
      ${j.length>0?C("Plusvalía latente",E(_),_>=0?"pos":"neg"):""}
      ${j.length>0?C("Imp. potencial (inversión)",E(P),"neg"):""}
    </div>`}function x(){return a==="mobiliario"?Xr(t.store.get("accounts"),h(),l):a==="trabajo"?Zr({nominas:i(),planes:r(),tramos:u(),hoy:e()}):a==="inmobiliario"?tl():Kr({año:s(),extras:o,declaracion:d(),nominas:i().map(b=>({nombre:b.nombre,bruto:b.bruto||0})),planes:r().map(b=>b.nombre)})}function y(b,f){const I=a===b;return`<button data-tab-fisc="${b}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${I?"600":"400"};
      color:${I?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${I?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${c(f)}</button>`}function $(b){const f=b.querySelector("#fisc-tabs"),I=b.querySelector("#fisc-tab-content");f&&(f.innerHTML=Yo.map(([p,g])=>y(p,g)).join("")),I&&(I.innerHTML=x())}function A(b){b.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${m()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${Yo.map(([f,I])=>y(f,I)).join("")}
      </div>
      <div id="fisc-tab-content">${x()}</div>`}function v(b){N(b,"[data-tab-fisc]",f=>{a=f.getAttribute("data-tab-fisc")||"declaracion",$(b)}),b.addEventListener("input",f=>{var w;if(!((w=f.target)==null?void 0:w.closest("[data-rex]")))return;const p=S=>{var j;return((j=b.querySelector(`#${S}`))==null?void 0:j.value)??"0"};o={capInmobiliario:parseFloat(p("rex-inmobiliario"))||0,capMobiliario:parseFloat(p("rex-mobiliario"))||0,gananciasFondos:parseFloat(p("rex-ganancias"))||0,otrasCorto:parseFloat(p("rex-otras"))||0,retCapital:parseFloat(p("rex-ret-cap"))||0};const g=b.querySelector("#renta-cuadro");g&&(g.innerHTML=Vo(d()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:el,mount(b){A(b),b.dataset.wired!=="1"&&(v(b),b.dataset.wired="1")}}}const Jo=()=>globalThis.Chart??null;function ol(t,e){const a=Jo();if(!a)return null;const o=e.map(n=>({label:n.label,data:n.puntos.map(s=>({x:s.x,y:s.y})),borderColor:n.esBase?"#6b7280":n.color,backgroundColor:n.esBase?"transparent":`${n.color}18`,borderWidth:n.esBase?1.5:2,...n.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new a(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:n=>`${n.dataset.label}: ${E(n.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:n=>E(n)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const nl=()=>Jo()!==null,Tt=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],sl="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function il(t){const e=()=>{var g;return(g=t.onDatosCambiados)==null?void 0:g.call(t)},a=new Set;let o=null;const n=()=>t.store.get("config"),s=()=>t.store.get("escenarios"),i=g=>{var w;return g?((w=s().find(S=>S._id===g))==null?void 0:w.nombre)??g:"Base"};function r(g){const w=n(),S=ja({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(g==null?void 0:g._id)??null),j=a.size>0?S.accounts.filter(M=>!a.has(M._id)):S.accounts,_=a.size>0?j.map(M=>M._id):null,P=g!=null&&g.fechaFin&&g.fechaFin>w.dashboardEnd?g.fechaFin:w.dashboardEnd;return{eventos:Xt({loans:S.loans,expenses:S.expenses,accounts:j,config:{...w,dashboardEnd:P},filtroAccounts:_,nominas:S.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),w.tramos_irpf??gt),resolverTramosGanancias:bt(t.store.get("tramosGananciasCapitalHistorico"),w.tramosGananciasCapital??jt)}),horizonte:P}}function l(g){const w=t.store.get("loans"),S=C=>(C.escenarioIds||[]).includes(g),j=[[w.filter(S).length,"préstamo","préstamos"],[w.flatMap(C=>C.amortizaciones||[]).filter(S).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(S).length,"gasto","gastos"],[t.store.get("accounts").filter(S).length,"cuenta","cuentas"],[t.store.get("nominas").filter(S).length,"nómina","nóminas"]],_=j.reduce((C,[M])=>C+M,0),P=j.filter(([C])=>C>0).map(([C,M,z])=>`${C} ${C===1?M:z}`).join(" · ");return{total:_,texto:P}}function u(g,w){const S=w===g._id,j=g.color||Tt[0],{total:_,texto:P}=l(g._id);return`<div class="card mb-12" style="border-left:3px solid ${c(j)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${c(j)};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${c(g.nombre)}</span>
        ${S?'<span class="badge badge-yellow">● Activo</span>':""}
        ${g.fechaFin?`<span class="badge badge-inactive">📅 ${c(g.fechaFin)}</span>`:""}
        <div class="flex gap-8">
          ${S?'<button class="btn-secondary btn-sm" data-desactivar-esc>Desactivar</button>':`<button class="btn-primary btn-sm" data-activar-esc="${c(g._id)}">Activar</button>`}
          <button class="btn-secondary btn-sm" data-editar-esc="${c(g._id)}">Editar</button>
          <button class="btn-danger btn-sm" data-borrar-esc="${c(g._id)}">✕</button>
        </div>
      </div>
      ${g.descripcion?`<div class="text-sm mb-8" style="color:var(--text2)">${c(g.descripcion)}</div>`:""}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${_===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${c(P)}</span>`}
      </div>
    </div>`}function h(g){const w=n().dashboardEnd,S=De(r(null).eventos,w);return`
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
        <tbody>${g.map(_=>{const{eventos:P}=r(_),C=_.fechaFin||w,M=De(P,C),z=M!==null&&S!==null?M-S:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c(_.color||Tt[0])};margin-right:6px"></span>
            ${c(_.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${c(C)}</td>
          <td class="num" style="padding:6px 10px">${M!==null?c(E(M)):"—"}</td>
          <td class="num ${z===null?"":z>=0?"pos":"neg"}" style="padding:6px 10px">
            ${z===null?"—":`${z>=0?"+":""}${c(E(z))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function d(){const g=t.store.get("accounts");return g.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${g.map(S=>{const j=a.has(S._id);return`<button data-toggle-cuenta="${c(S._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${j?"var(--border)":"var(--accent)"};
          background:${j?"transparent":"rgba(99,102,241,0.1)"};
          color:${j?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${j?"text-decoration:line-through;":""}">${c(S.nombre)}</button>`}).join("")}
    </div>`}function m(){if(o){try{o.destroy()}catch{}o=null}}function x(g){const w=n(),S=r(null),j=[{label:"Base (sin supuesto)",color:"#6b7280",esBase:!0,puntos:Pe(S.eventos,w.dashboardStart,w.dashboardEnd)}];return g.forEach((_,P)=>{const{eventos:C,horizonte:M}=r(_);j.push({label:_.nombre,color:_.color||Tt[P%Tt.length],puntos:Pe(C,w.dashboardStart,M)})}),j}function y(g,w){m();const S=g.querySelector("#chart-comparacion");S&&(o=ol(S,x(w)))}function $(g){m();const w=new Set(t.store.get("accounts").map(_=>_._id));for(const _ of[...a])w.has(_)||a.delete(_);const S=s(),j=n().escenarioActivo||null;g.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Supuestos</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo supuesto</button></div>
      </div>

      ${j?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${c(i(j))}</span>
                 <span style="font-size:12px;color:var(--text3);margin-left:8px">El dashboard muestra la proyección de este supuesto</span>
               </div>
               <button class="btn-secondary btn-sm" data-desactivar-esc>Volver a base</button>
             </div>`:""}

      ${S.length===0?`<div class="card mb-14" style="padding:20px 24px">
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
             </div>`:`<div>${S.map(_=>u(_,j)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de supuestos</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${d()}</div>
               ${nl()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${h(S)}</div>`}`,S.length>0&&y(g,S)}const A=()=>document.getElementById("modal-overlay"),v=()=>document.getElementById("modal-content"),b=()=>{var g;return(g=A())==null?void 0:g.classList.add("hidden")};function f(g,w){const S=g?s().find(C=>C._id===g)??null:null,j=A(),_=v();if(!j||!_)return;const P=(S==null?void 0:S.color)||Tt[0];_.innerHTML=`
      <div class="modal-title">${g?"Editar supuesto":"Nuevo supuesto"}</div>
      <div class="form-group"><label class="form-label">Nombre del supuesto</label>
        <input class="form-input" type="text" id="esc-nombre" value="${c((S==null?void 0:S.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${c((S==null?void 0:S.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${Tt.map(C=>`<div data-color-esc="${C}" style="width:26px;height:26px;border-radius:50%;background:${C};cursor:pointer;
              border:2px solid ${C===P?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${c(P)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${c((S==null?void 0:S.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${c(g??"")}">${g?"Guardar cambios":"Crear escenario"}</button>
      </div>`,j.classList.remove("hidden"),N(_,"[data-cancelar]",b),N(_,"[data-color-esc]",C=>{const M=C.getAttribute("data-color-esc");_.querySelector("#esc-color").value=M;for(const z of _.querySelectorAll("[data-color-esc]"))z.style.border=z.getAttribute("data-color-esc")===M?"2px solid white":"2px solid transparent"}),N(_,"[data-guardar-esc]",C=>{const M=_.querySelector("#esc-nombre").value.trim();if(!M)return q("El nombre es obligatorio","err");const z={nombre:M,fechaFin:_.querySelector("#esc-fecha-fin").value||null,color:_.querySelector("#esc-color").value||Tt[0],descripcion:_.querySelector("#esc-desc").value.trim()},F=C.getAttribute("data-guardar-esc")||"";F?(t.store.updateItem("escenarios",F,z),q("Escenario actualizado")):(t.store.addItem("escenarios",z),q("Escenario creado")),e(),b(),w()})}function I(g,w){if(!Z("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const S=j=>j.map(_=>({..._,escenarioIds:(_.escenarioIds||[]).filter(P=>P!==g)}));t.store.set("loans",S(t.store.get("loans")).map(j=>({...j,amortizaciones:S(j.amortizaciones||[])}))),t.store.set("expenses",S(t.store.get("expenses"))),t.store.set("nominas",S(t.store.get("nominas"))),t.store.set("accounts",S(t.store.get("accounts"))),n().escenarioActivo===g&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",g),q("Escenario eliminado"),e(),w()}function p(g,w){N(g,"[data-nuevo-esc]",()=>f(null,w)),N(g,"[data-editar-esc]",S=>f(S.getAttribute("data-editar-esc"),w)),N(g,"[data-borrar-esc]",S=>I(S.getAttribute("data-borrar-esc"),w)),N(g,"[data-activar-esc]",S=>{const j=S.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:j}),q(`Escenario "${i(j)}" activado`),e(),w()}),N(g,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),q("Volviendo a la realidad base"),e(),w()}),N(g,"[data-toggle-cuenta]",S=>{const j=S.getAttribute("data-toggle-cuenta");a.has(j)?a.delete(j):a.add(j);const _=g.querySelector("#esc-pastillas");_&&(_.innerHTML=d());const P=s(),C=g.querySelector("#esc-comparativa");C&&(C.innerHTML=h(P)),y(g,P)})}return{id:"escenarios",route:"escenarios",nombre:"Supuestos",flagId:"supuestos",seccion:2,iconoPath:sl,mount(g){const w=()=>$(g);$(g),g.dataset.wired!=="1"&&(p(g,w),g.dataset.wired="1")},unmount(){m()}}}const rl=1e-12,Wo=t=>Math.abs(t)<rl,Ko=t=>t/12;function ll(t,e,a,o){if(a<=0)return Math.max(0,Math.ceil(t-e));const n=t-e;if(n<=0)return 0;const s=Ko(o);if(Wo(s))return Math.ceil(n/a);const i=Math.pow(1+s,a),r=(t-e*i)*s/(i-1);return r<=0?0:Math.ceil(r)}function cl(t,e){const a=Ko(e);return Wo(a)?0:Math.round(t*a)}function Qo({rentaNetaMensual:t,tasaRetiroSeguro:e,tipoFiscalEfectivo:a}){if(e<=0)throw new RangeError("La tasa de retiro seguro tiene que ser mayor que cero.");if(a>=1)throw new RangeError("El tipo fiscal efectivo no puede llegar al 100 %.");const o=Math.round(t*12/(1-a));return{retiroBrutoAnual:o,capitalNecesario:Math.round(o/e)}}function Xo(t,e){const[a,o]=t.split("-").map(Number),n=a*12+(o-1)+e,s=Math.floor(n/12),i=n%12+1;return`${s}-${String(i).padStart(2,"0")}`}function da(t,e){const[a,o]=t.split("-").map(Number),[n,s]=e.split("-").map(Number);return(n-a)*12+(s-o)}const Zo=t=>Number(t.slice(0,4));function Ae(t){return t.rentaDeseada?Qo(t.rentaDeseada).capitalNecesario:t.importeObjetivo??0}const dl={_id:"__sin_vehiculo__"};function we(t){var b,f,I;const e=Math.max(0,Math.floor(t.horizonteMeses)),a=new Map(t.vehiculos.map(p=>[p._id,p])),o=[...t.objetivos].sort((p,g)=>p.prioridad-g.prioridad).map(p=>({def:p,objetivo:Ae(p),saldo:p.saldoActual,estado:Ae(p)>0&&p.saldoActual>=Ae(p)&&p.modoAsignacion!=="ABSORBE_RESIDUAL"?"COMPLETADO":"PENDIENTE",vehiculo:a.get(p.vehiculoId),aportadoEnAño:0,añoEnCurso:Zo(t.fechaInicio),ultimaSolicitud:0,solicitadoAcumulado:0,mesesReclamando:0})),n=new Map;for(const p of t.eventos){const g=n.get(p.fecha)??[];g.push(p),n.set(p.fecha,g)}const s=[],i=[],r=[];let l=t.perfil.netoMensual,u=t.perfil.gastosFijosMensuales,h=0,d=0;const m=[];for(let p=0;p<e;p++){const g=Xo(t.fechaInicio,p),w=Zo(g);for(const D of n.get(g)??[])if(D.tipo==="CAMBIO_INGRESOS")l=D.importe;else if(D.tipo==="CAMBIO_GASTOS_FIJOS")u=D.importe;else if(D.tipo==="NUEVA_DEUDA")u+=D.importe;else if(D.tipo==="INYECCION_CAPITAL"){const B=D.objetivoDestinoId?o.find(L=>L.def._id===D.objetivoDestinoId):void 0;B?B.saldo+=D.importe:l+=D.importe}for(const D of o)D.añoEnCurso!==w&&(D.añoEnCurso=w,D.aportadoEnAño=0);const S=Math.max(0,l-u),j=Math.round(S*ul(t.pctDisfrute));let _=S-j;const P=_,C=o.filter(D=>D.estado!=="COMPLETADO"),M=[];let z=0;const F=C.filter(D=>D.def.modoAsignacion==="ABSORBE_RESIDUAL"),T=C.filter(D=>D.def.modoAsignacion!=="ABSORBE_RESIDUAL");for(const D of T){const B=pl(D,g,p,t);D.ultimaSolicitud=B,B>0&&(D.solicitadoAcumulado+=B,D.mesesReclamando+=1),(D.def.modoAsignacion==="CUOTA_POR_FECHA"||D.def.modoAsignacion==="FIJO")&&(z+=B);const L=Math.max(0,Math.min(B,_));_-=L,D.saldo+=L,D.aportadoEnAño+=L,h+=L,L>0&&D.estado==="PENDIENTE"&&(D.estado="EN_CURSO"),M.push({objetivoId:D.def._id,asignado:L,solicitado:B,saldoTrasMes:D.saldo})}if(F.length>0&&_>0){const D=F.map(k=>Math.max(0,k.def.pesoResidual??1)),B=D.reduce((k,O)=>k+O,0)||F.length;let L=0;F.forEach((k,O)=>{const H=O===F.length-1?_-L:Math.floor(_*D[O]/B);L+=H,k.saldo+=H,k.aportadoEnAño+=H,h+=H,H>0&&k.estado==="PENDIENTE"&&(k.estado="EN_CURSO"),M.push({objetivoId:k.def._id,asignado:H,solicitado:0,saldoTrasMes:k.saldo})}),_-=L}else for(const D of F)M.push({objetivoId:D.def._id,asignado:0,solicitado:0,saldoTrasMes:D.saldo});z>P&&m.push({mes:g,deficit:z-P});for(const D of o)D.saldo<=0||(D.saldo+=cl(D.saldo,((b=D.vehiculo)==null?void 0:b.rentabilidadRealAnual)??0));for(const D of o)D.estado!=="COMPLETADO"&&(D.def.modoAsignacion==="ABSORBE_RESIDUAL"&&D.objetivo<=0||D.objetivo>0&&D.saldo>=D.objetivo&&(D.estado="COMPLETADO",i.push({objetivoId:D.def._id,nombre:D.def.nombre,mes:g,indice:p,importeFinal:D.saldo,cuotaLiberada:D.ultimaSolicitud})));for(const D of o)M.some(B=>B.objetivoId===D.def._id)||M.push({objetivoId:D.def._id,asignado:0,solicitado:0,saldoTrasMes:D.saldo});const R=o.reduce((D,B)=>D+B.saldo,0);if(d+=j,s.push({indice:p,mes:g,netoMensual:l,gastosFijos:u,sobrante:S,disfrute:j,disponible:P,sinAsignar:_,asignaciones:M.sort((D,B)=>tn(o,D.objetivoId)-tn(o,B.objetivoId)),patrimonioTotal:R}),o.length>0&&o.every(D=>D.estado==="COMPLETADO"))break}const x=[];if(m.length>0){const p=Math.round(m.reduce((g,w)=>g+w.deficit,0)/m.length);r.push({severidad:"error",codigo:"INVIABLE",mensaje:`El plan no cabe en el flujo de caja durante ${m.length} mes${m.length!==1?"es":""} (desde ${m[0].mes}). Déficit medio: ${(p/100).toFixed(2)} €/mes.`,mes:m[0].mes,deficitMensual:p});for(const g of o)g.estado!=="COMPLETADO"&&g.def.fechaLimite&&g.def.modoAsignacion==="CUOTA_POR_FECHA"&&(g.estado="INVIABLE");x.push(...fl(o,t,p))}for(const p of o){const g=(f=p.vehiculo)==null?void 0:f.topeAportacionAnual;g&&p.def.modoAsignacion==="FIJO"&&(p.def.importeFijoMensual??0)*12>g&&r.push({severidad:"atencion",codigo:"TOPE_FISCAL",objetivoId:p.def._id,mensaje:`«${p.def.nombre}» pide ${((p.def.importeFijoMensual??0)/100).toFixed(2)} €/mes, que supera el tope anual de ${(g/100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`})}for(const p of o)p.estado!=="COMPLETADO"&&p.objetivo>0&&p.def.modoAsignacion!=="ABSORBE_RESIDUAL"&&r.push({severidad:"atencion",codigo:"NUNCA_COMPLETADO",objetivoId:p.def._id,mensaje:`«${p.def.nombre}» no se completa dentro del horizonte de ${e} meses.`});const y=o.find(p=>p.def.tipo==="INVERSION_PERPETUA"),$=y?i.find(p=>p.objetivoId===y.def._id):void 0,A={};for(const p of o){const g=((I=p.vehiculo)==null?void 0:I._id)??dl._id;A[g]=(A[g]??0)+p.saldo}const v={};for(const p of o)v[p.def._id]=p.estado;return{viable:m.length===0,mesesSimulados:s.length,serieMensual:s,hitos:i,fases:ml(s,i),avisos:r,propuestas:x,estadoFinal:v,resumen:{patrimonioFinal:o.reduce((p,g)=>p+g.saldo,0),patrimonioPorVehiculo:A,totalAportado:h,totalDisfrute:d,mesIndependencia:($==null?void 0:$.mes)??null}}}const ul=t=>Number.isFinite(t)?Math.min(1,Math.max(0,t)):0,tn=(t,e)=>t.findIndex(a=>a.def._id===e);function pl(t,e,a,o){var s,i;const n=Math.max(0,t.objetivo-t.saldo);switch(t.def.modoAsignacion){case"ABSORBE_TODO":return n;case"FIJO":{const r=t.def.importeFijoMensual??0,l=(s=t.vehiculo)==null?void 0:s.topeAportacionAnual;if(!l)return t.objetivo>0?Math.min(r,n):r;const u=Math.max(0,l-t.aportadoEnAño),h=Math.min(r,u);return t.objetivo>0?Math.min(h,n):h}case"CUOTA_POR_FECHA":{if(n<=0)return 0;const r=t.def.fechaLimite?da(e,t.def.fechaLimite):o.horizonteMeses-a;return ll(t.objetivo,t.saldo,Math.max(0,r),((i=t.vehiculo)==null?void 0:i.rentabilidadRealAnual)??0)}default:return 0}}function ml(t,e){if(t.length===0)return[];const o=[0,...[...new Set(e.map(s=>s.indice))].sort((s,i)=>s-i).map(s=>s+1)].filter((s,i,r)=>r.indexOf(s)===i&&s<t.length),n=[];for(let s=0;s<o.length;s++){const i=o[s],r=(s+1<o.length?o[s+1]:t.length)-1;if(r<i)continue;const l=new Set;for(let u=i;u<=r;u++)for(const h of t[u].asignaciones)h.asignado>0&&l.add(h.objetivoId);n.push({desde:t[i].mes,hasta:t[r].mes,meses:r-i+1,objetivosActivos:[...l]})}return n}function fl(t,e,a){const o=[],n=Math.max(0,e.perfil.netoMensual-e.perfil.gastosFijosMensuales);if(n>0&&e.pctDisfrute>0){const l=Math.ceil(Math.min(e.pctDisfrute,a/n)*100);if(l>0){const u=Math.round(e.pctDisfrute*100);o.push({clase:"REDUCIR_DISFRUTE",magnitud:l,mensaje:`Bajar el disfrute ${l} punto${l!==1?"s":""} (del ${u} % al ${Math.max(0,u-l)} %) libera ${(Math.min(a,n*e.pctDisfrute)/100).toFixed(0)} €/mes.`})}}const s=t.filter(l=>l.def.modoAsignacion==="CUOTA_POR_FECHA"&&l.def.fechaLimite&&l.estado!=="COMPLETADO"),i=l=>l.mesesReclamando>0?l.solicitadoAcumulado/l.mesesReclamando:0,r=[...s].sort((l,u)=>i(u)-i(l))[0];if(r){const l=Math.max(0,r.objetivo-r.saldo),u=i(r),h=Math.max(1,da(e.fechaInicio,r.def.fechaLimite)),d=Math.max(1,u-a),m=Math.ceil(l/d),x=Math.max(1,m-h);o.push({clase:"RETRASAR_FECHA",objetivoId:r.def._id,magnitud:x,mensaje:`Retrasar «${r.def.nombre}» ${x} mes${x!==1?"es":""}, hasta ${Xo(r.def.fechaLimite,x)}, baja su cuota a lo que cabe en el flujo.`});const y=Math.min(Math.round(a*h),Math.max(0,r.objetivo-1));y>0&&o.push({clase:"REDUCIR_IMPORTE",objetivoId:r.def._id,magnitud:y,mensaje:`O reducir «${r.def.nombre}» en ${(y/100).toFixed(0)} €, de ${(r.objetivo/100).toFixed(0)} € a ${((r.objetivo-y)/100).toFixed(0)} €.`})}return s.length>1&&o.push({clase:"REORDENAR",magnitud:s.length,mensaje:`Hay ${s.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`}),o.length===0&&o.push({clase:"REDUCIR_IMPORTE",magnitud:a,mensaje:`Faltan ${(a/100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`}),o}const vl=()=>globalThis.Chart??null,Se=["#2ee6a8","#4d9fff","#a855f7","#f97316","#eab308","#22d3ee","#fb7185","#34d399"],en=new WeakMap;function gl(t,e,a){const o=vl();if(!o)return null;const n=en.get(t);if(n)try{n.destroy()}catch{}const s=new Map,i=new Map(e.objetivos.map(x=>[x._id,x.vehiculoId])),r=new Set(e.objetivos.map(x=>x.vehiculoId));for(const x of r)s.set(x,[]);for(const x of a.serieMensual){const y=new Map;for(const $ of x.asignaciones){const A=i.get($.objetivoId);A&&y.set(A,(y.get(A)??0)+$.saldoTrasMes)}for(const $ of r)s.get($).push((y.get($)??0)/100)}const l=x=>{var y;return((y=e.vehiculos.find($=>$._id===x))==null?void 0:y.nombre)??"Sin vehículo"},u=[...r],h=u.map((x,y)=>a.serieMensual.map(($,A)=>u.slice(0,y+1).reduce((v,b)=>v+(s.get(b)[A]??0),0))),d=u.map((x,y)=>({label:l(x),data:h[y],borderColor:Se[y%Se.length],backgroundColor:`${Se[y%Se.length]}33`,fill:y===0?"origin":"-1",borderWidth:1.5,pointRadius:0,tension:.25})),m=new o(t,{type:"line",data:{labels:a.serieMensual.map(x=>x.mes),datasets:d},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#a9b6cc",font:{size:11},boxWidth:12}},tooltip:{backgroundColor:"#111a28",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#a9b6cc",bodyColor:"#eef3fb",callbacks:{label:x=>{const y=x.datasetIndex>0?x.chart.data.datasets[x.datasetIndex-1].data[x.dataIndex]??0:0;return` ${x.dataset.label}: ${E(x.parsed.y-y)}`}}}},scales:{x:{ticks:{color:"#6b7b96",maxTicksLimit:12},grid:{display:!1}},y:{ticks:{color:"#6b7b96",callback:x=>E(x)},grid:{color:"rgba(255,255,255,0.07)"}}}}});return en.set(t,m),m}const ua=t=>E(t/100),bl={CUOTA_POR_FECHA:"Cuota para llegar a la fecha",ABSORBE_TODO:"Se lleva todo lo disponible",ABSORBE_RESIDUAL:"Recibe lo que sobre",FIJO:"Importe fijo al mes"},hl={CUOTA_POR_FECHA:"Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.",ABSORBE_RESIDUAL:"No reclama nada; recoge lo que quede tras servir a los de prioridad superior.",FIJO:"Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene."},an={COMPLETADO:"var(--accent)",EN_CURSO:"var(--text)",PENDIENTE:"var(--text3)",INVIABLE:"var(--red)"};function yl(t,e){if(t.objetivos.length===0)return`<div class="card" style="text-align:center;padding:34px 20px">
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
    ${a.map(s=>{var i;return xl(s,e,o,(i=n(s.vehiculoId))==null?void 0:i.nombre)}).join("")}`}function xl(t,e,a,o){const n=Ae(t),s=e.estadoFinal[t._id]??t.estado,i=a==null?void 0:a.asignaciones.find(d=>d.objetivoId===t._id),r=(i==null?void 0:i.solicitado)??0,l=e.hitos.find(d=>d.objetivoId===t._id),u=n>0?Math.min(100,t.saldoActual/n*100):0,h=e.avisos.filter(d=>d.objetivoId===t._id);return`
    <div class="card mb-10" draggable="true" data-pl-objetivo="${c(t._id)}"
         style="padding:14px 16px;border-left:3px solid ${an[s]??"var(--text3)"};cursor:grab">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span title="Arrastra para cambiar la prioridad" style="color:var(--text3);cursor:grab;user-select:none">⠿</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3)">#${c(t.prioridad)}</span>
            <span style="font-weight:700;font-size:14px">${c(t.nombre)}</span>
            <span class="badge" style="font-size:10px;background:var(--bg3);color:var(--text2)">${c(bl[t.modoAsignacion])}</span>
            ${s==="INVIABLE"?'<span class="badge badge-red" style="font-size:10px">no llega</span>':""}
            ${s==="COMPLETADO"?'<span class="badge badge-green" style="font-size:10px">completado</span>':""}
          </div>
          <div class="text-sm" style="color:var(--text3);margin-top:4px">${c(hl[t.modoAsignacion])}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:17px;font-weight:700">${c(n>0?ua(n):"— sin meta —")}</div>
          ${t.fechaLimite?`<div class="text-sm" style="color:var(--text3)">para ${c(t.fechaLimite)}</div>`:""}
          <button class="btn-secondary btn-sm" data-pl-editar-objetivo="${c(t._id)}" style="margin-top:6px;font-size:11px;padding:2px 9px">Editar</button>
        </div>
      </div>

      ${n>0?`<div class="goal-bar" style="margin-top:10px"><div class="goal-bar-fill" style="width:${u.toFixed(1)}%;background:${an[s]??"var(--accent)"}"></div></div>`:""}

      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:12px">
        <div><span style="color:var(--text3)">Pide ahora:</span> <strong style="font-family:var(--font-mono)">${c(ua(r))}</strong>/mes</div>
        <div><span style="color:var(--text3)">Ya acumulado:</span> <span style="font-family:var(--font-mono)">${c(ua(t.saldoActual))}</span></div>
        ${o?`<div><span style="color:var(--text3)">Vehículo:</span> ${c(o)}</div>`:""}
        ${l?`<div><span style="color:var(--text3)">Se completa:</span> <strong style="color:var(--accent)">${c(l.mes)}</strong></div>`:""}
      </div>

      ${h.length>0?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${h.map(d=>`⚠ ${c(d.mensaje)}`).join("<br>")}
             </div>`:""}
      ${t.notas?`<div class="text-sm" style="color:var(--text3);margin-top:8px;white-space:pre-wrap">${c(t.notas)}</div>`:""}
    </div>`}const dt=t=>(t/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}),on=[{id:"venta-vivienda",nombre:"Venta de vivienda",icono:"🏠",descripcion:"Lo que queda de verdad tras cancelar la hipoteca y pagar impuestos y gastos. Suele ser bastante menos que el precio de venta.",tipo:"INYECCION_CAPITAL",campos:[{id:"precio",etiqueta:"Precio de venta (€)",ayuda:"Lo que te paga el comprador"},{id:"hipoteca",etiqueta:"Hipoteca pendiente (€)",ayuda:"Capital vivo el día de la firma"},{id:"gastos",etiqueta:"Impuestos y gastos (€)",ayuda:"Plusvalía municipal, IRPF de la ganancia, agencia, notaría"}],calcular:t=>Math.max(0,(t.precio??0)-(t.hipoteca??0)-(t.gastos??0)),resumir:t=>`Venta ${dt(t.precio??0)} € − hipoteca ${dt(t.hipoteca??0)} € − gastos ${dt(t.gastos??0)} €`},{id:"nueva-hipoteca",nombre:"Nueva hipoteca",icono:"🔑",descripcion:"Sube tus gastos fijos con la cuota nueva. Normalmente va en la misma fecha que la venta.",tipo:"NUEVA_DEUDA",campos:[{id:"cuota",etiqueta:"Cuota mensual (€)",ayuda:"Se suma a tus gastos fijos a partir de ese mes"}],calcular:t=>t.cuota??0,resumir:t=>`Cuota de ${dt(t.cuota??0)} €/mes`},{id:"hijo",nombre:"Llegada de un hijo",icono:"👶",descripcion:"Fija tus gastos fijos en un valor nuevo. Si el gasto sube por etapas, crea varios eventos seguidos.",tipo:"CAMBIO_GASTOS_FIJOS",campos:[{id:"actuales",etiqueta:"Gastos fijos actuales (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"incremento",etiqueta:"Incremento mensual (€)",ayuda:"Guardería, ropa, sanidad…"}],calcular:t=>(t.actuales??0)+(t.incremento??0),resumir:t=>`Gastos fijos ${dt(t.actuales??0)} € → ${dt((t.actuales??0)+(t.incremento??0))} €/mes`},{id:"subida-sueldo",nombre:"Subida de sueldo",icono:"📈",descripcion:"Fija tu neto mensual en un valor nuevo desde ese mes.",tipo:"CAMBIO_INGRESOS",campos:[{id:"actual",etiqueta:"Neto mensual actual (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"subida",etiqueta:"Subida mensual neta (€)",ayuda:"Lo que te llega a la cuenta, no el bruto"}],calcular:t=>(t.actual??0)+(t.subida??0),resumir:t=>`Neto ${dt(t.actual??0)} € → ${dt((t.actual??0)+(t.subida??0))} €/mes`},{id:"inyeccion",nombre:"Entrada de dinero",icono:"💰",descripcion:"Una herencia, un bonus, la venta de un coche. Puede ir dirigida a un objetivo concreto.",tipo:"INYECCION_CAPITAL",campos:[{id:"importe",etiqueta:"Importe (€)"}],calcular:t=>t.importe??0,resumir:t=>`Entrada de ${dt(t.importe??0)} €`}],$l=t=>on.find(e=>e.id===t);function Il(t,e){switch(t.tipo){case"INYECCION_CAPITAL":return`Entra ${dt(t.importe)} €${e?` → «${e}»`:" al reparto general"}`;case"CAMBIO_INGRESOS":return`El neto mensual pasa a ${dt(t.importe)} €`;case"CAMBIO_GASTOS_FIJOS":return`Los gastos fijos pasan a ${dt(t.importe)} €/mes`;case"NUEVA_DEUDA":return`Los gastos fijos suben ${dt(t.importe)} €/mes`}}function Al(t,e,a,o){const n=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,s=new Map(t.vehiculos.map(r=>[r._id,`veh_${n()}`])),i=new Map(t.objetivos.map(r=>[r._id,`obj_${n()}`]));return{...t,_id:a,nombre:e,activo:!1,creadoEn:o,vehiculos:t.vehiculos.map(r=>({...r,_id:s.get(r._id)})),objetivos:t.objetivos.map(r=>({...r,_id:i.get(r._id),vehiculoId:s.get(r.vehiculoId)??r.vehiculoId})),eventos:t.eventos.map(r=>({...r,_id:`ev_${n()}`,objetivoDestinoId:r.objetivoDestinoId?i.get(r.objetivoDestinoId)??null:null}))}}function wl(t){return[...new Set(t.flatMap(a=>a.hitos.map(o=>o.nombre)))].map(a=>{const o=t.map(i=>i.hitos.find(r=>r.nombre===a)??null),n=o.map(i=>i?i.indice:null),s=n[0];return{nombre:a,meses:o.map(i=>i?i.mes:null),diferencias:n.map(i=>i!==null&&s!==null?i-s:null)}})}const Sl=t=>E(t/100),Ml={INYECCION_CAPITAL:"💰",CAMBIO_GASTOS_FIJOS:"🏷️",CAMBIO_INGRESOS:"📈",NUEVA_DEUDA:"🔑"};function Cl(t){const e=[...t.eventos].sort((o,n)=>o.fecha.localeCompare(n.fecha)),a=o=>{var n;return o?(n=t.objetivos.find(s=>s._id===o))==null?void 0:n.nombre:void 0};return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      Los eventos son los cambios de vida que mueven el plan de verdad: una venta, una hipoteca nueva, un hijo,
      un ascenso. Se aplican <strong>al principio del mes</strong> que indiques.
    </div>

    <div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Añadir</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${on.map(o=>`<button class="btn-secondary btn-sm" data-pl-plantilla="${c(o.id)}"
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
             ${e.map(o=>El(o,t,a(o.objetivoDestinoId))).join("")}
           </div>`}`}function El(t,e,a){const o=da(e.fechaInicio,t.fecha),n=o<0?"antes del inicio del plan":o===0?"en el primer mes":`dentro de ${o} mes${o!==1?"es":""}`,s=o<0||o>=e.horizonteMeses;return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:16px;flex-shrink:0;width:24px;text-align:center">${Ml[t.tipo]}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--accent)">${c(t.fecha)}</span>
          <span style="font-size:11px;color:var(--text3)">${c(n)}</span>
          ${s?'<span class="badge badge-yellow" style="font-size:10px">fuera del horizonte</span>':""}
        </div>
        <div style="font-size:12px;margin-top:3px">${c(Il(t,a))}</div>
        ${t.notas?`<div style="font-size:11px;color:var(--text3);margin-top:2px">${c(t.notas)}</div>`:""}
      </div>
      <div style="display:flex;gap:5px;flex-shrink:0">
        <button class="btn-secondary btn-sm" data-pl-editar-evento="${c(t._id)}" style="font-size:11px;padding:2px 9px">Editar</button>
      </div>
    </div>`}function jl(t,e,a,o){const n=t.campos.map(i=>{const r=o[i.id];return`<div class="form-group">
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
    </div>`}function nn(t,e){var o;const a={};for(const n of e.campos){const s=((o=t.querySelector(`#ev-${n.id}`))==null?void 0:o.value)??"",i=parseFloat(String(s).replace(",","."));a[n.id]=Number.isFinite(i)?Math.round(i*100):0}return a}const _l=(t,e)=>Sl(t.calcular(e)),zl=[-2,-1,0,1,2],Fl=[-10,0,10],Pl=[-20,0,20];function sn(t){return t.hitos.length===0?null:Math.max(...t.hitos.map(e=>e.indice))}function Dl(t,e,a,o,n){const s={};for(const l of o.hitos)s[l.objetivoId]=l.mes;const i=sn(o),r=n?sn(n):i;return{etiqueta:t,delta:e,esBase:a,viable:o.viable,hitos:s,desplazamientoMeses:i!==null&&r!==null?i-r:null,patrimonioFinal:o.resumen.patrimonioFinal}}function Tl(t,e,a){if(a===0)return t;switch(e){case"rentabilidad":return{...t,vehiculos:t.vehiculos.map(o=>({...o,rentabilidadRealAnual:Math.max(0,o.rentabilidadRealAnual+a/100)}))};case"disfrute":return{...t,pctDisfrute:Math.min(1,Math.max(0,t.pctDisfrute+a/100))};case"ingresos":return{...t,perfil:{...t.perfil,netoMensual:Math.max(0,Math.round(t.perfil.netoMensual*(1+a/100)))}}}}const Nl=t=>t>0?`+${t}`:String(t);function pa(t,e,a,o,n,s){const i=we(t),r=n.map(l=>Dl(l===0?"Plan actual":`${Nl(l)} ${s}`,l,l===0,l===0?i:we(Tl(t,e,l)),i));return{palanca:e,titulo:a,descripcion:o,variantes:r}}function Rl(t){return[pa(t,"rentabilidad","Rentabilidad de los vehículos","Mueve la rentabilidad real de todos los vehículos a la vez. Es la palanca que menos controlas.",zl,"puntos"),pa(t,"disfrute","Porcentaje de disfrute","Lo que apartas para gastar en vez de asignar a objetivos. Es la palanca que más controlas.",Fl,"puntos"),pa(t,"ingresos","Ingresos","Un ascenso, un cambio de trabajo o una reducción de jornada.",Pl,"%")]}function Ol(t){if(t===null)return"no comparable";if(t===0)return"sin cambio";const e=Math.abs(t),a=Math.floor(e/12),o=e%12,n=[a>0?`${a} año${a!==1?"s":""}`:"",o>0?`${o} mes${o!==1?"es":""}`:""].filter(Boolean).join(" y ");return t<0?`${n} antes`:`${n} más tarde`}const rn=t=>E(t/100);function ql(t,e,a){return`
    ${Ll(t,e)}
    ${t.length>1?Bl(t):""}
    ${kl(a)}`}function Ll(t,e){return`<div class="card mb-14">
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
  </div>`}function Bl(t){const e=t.slice(0,3),a=e.map(r=>({plan:r,res:we(r)})),o=wl(a.map(({plan:r,res:l})=>({nombre:r.nombre,hitos:l.hitos}))),n=["Hito",...e.map(r=>r.nombre)].map((r,l)=>`<th style="text-align:${l===0?"left":"right"};padding:6px 8px;font-size:11px;color:var(--text3)">${c(r)}</th>`).join(""),s=o.map(r=>`<tr>
      <td style="padding:5px 8px;font-size:12px">${c(r.nombre)}</td>
      ${r.meses.map((l,u)=>{const h=r.diferencias[u],d=h===null||h===0?"var(--text2)":h<0?"var(--accent)":"var(--red)",m=u===0||h===null||h===0?"":`<div style="font-size:10px;color:${d}">${h>0?"+":""}${h} m</div>`;return`<td style="text-align:right;padding:5px 8px;font-family:var(--font-mono);font-size:11px;color:${d}">
            ${c(l??"no llega")}${m}
          </td>`}).join("")}
    </tr>`).join("");return`<div class="card mb-14">
    <div class="card-title mb-10">Comparativa</div>
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">${a.map(({plan:r,res:l})=>`<div style="flex:1;min-width:150px">
      <div style="font-size:11px;color:var(--text3)">${c(r.nombre)}</div>
      <div style="font-family:var(--font-mono);font-size:15px;font-weight:700">${c(rn(l.resumen.patrimonioFinal))}</div>
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
  </div>`}function kl(t){return t?`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Análisis de sensibilidad</span>
      <button class="btn-secondary btn-sm" data-pl-sensibilidad>Recalcular</button>
    </div>
    ${t.map(Hl).join("")}
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
    </div>`}function Hl(t){return`<div style="margin-bottom:18px">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px">${c(t.titulo)}</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px">${c(t.descripcion)}</div>
    ${t.variantes.map(e=>{const a=e.desplazamientoMeses,o=a===null?"var(--text3)":a===0?"var(--text2)":a<0?"var(--accent)":"var(--red)";return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 0;font-size:12px;${e.esBase?"border-top:1px solid var(--border);border-bottom:1px solid var(--border);":""}">
        <span style="${e.esBase?"font-weight:700":"color:var(--text2)"}">${c(e.etiqueta)}</span>
        <span style="display:flex;gap:14px;align-items:baseline">
          <span style="color:${o};font-size:11px">${c(Ol(a))}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3);min-width:88px;text-align:right">${c(rn(e.patrimonioFinal))}</span>
        </span>
      </div>`}).join("")}
  </div>`}const At=t=>E(t/100);function Gl(t,e,a=0){return`
    ${Vl(e)}
    ${Ul(t,e)}
    <div class="card mb-14">
      <div class="card-title mb-12">Patrimonio por vehículo</div>
      <div class="chart-wrap-lg"><canvas id="pl-chart"></canvas></div>
    </div>
    ${Yl(e)}
    ${Jl(t,e)}
    ${Wl(t,e,a)}`}function Vl(t){if(t.avisos.length===0&&t.propuestas.length===0)return"";const e={error:"var(--red)",atencion:"var(--yellow)",info:"var(--text2)"},a=t.avisos.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:5px">
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
  </div>`}function Ul(t,e){const a=(n,s,i="")=>`<div class="stat-card">
      <div class="stat-label">${c(n)}</div>
      <div class="stat-value" style="font-size:18px">${c(s)}</div>
      ${i?`<div class="stat-sub">${c(i)}</div>`:""}
    </div>`,o=e.serieMensual[e.serieMensual.length-1];return`<div class="grid-4 mb-14">
    ${a("Patrimonio final",At(e.resumen.patrimonioFinal),o?`en ${o.mes}`:"")}
    ${a("Total aportado",At(e.resumen.totalAportado),`${e.mesesSimulados} meses simulados`)}
    ${a("Total a disfrute",At(e.resumen.totalDisfrute),`${Math.round(t.pctDisfrute*100)} % del sobrante`)}
    ${a("Independencia",e.resumen.mesIndependencia??"—",e.resumen.mesIndependencia?"objetivo perpetuo cubierto":"sin objetivo de independencia")}
  </div>`}function Yl(t){return t.hitos.length===0?`<div class="card mb-14"><div class="card-title mb-8">Hitos</div>
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
  </div>`}function Jl(t,e){if(e.fases.length<=1)return"";const a=o=>{var n;return((n=t.objetivos.find(s=>s._id===o))==null?void 0:n.nombre)??o};return`<div class="card mb-14">
    <div class="card-title mb-12">Fases del plan</div>
    <div class="text-sm mb-10" style="color:var(--text3)">Tramos entre hitos: en cada uno el dinero se reparte de forma distinta.</div>
    ${e.fases.map((o,n)=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);flex-shrink:0;width:26px">${n+1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${c(o.desde)} → ${c(o.hasta)} <span style="color:var(--text3);font-weight:400">(${o.meses} mes${o.meses!==1?"es":""})</span></div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">${c(o.objetivosActivos.map(a).join(" · ")||"sin asignaciones")}</div>
        </div>
      </div>`).join("")}
  </div>`}const de=60;function Wl(t,e,a=0){if(e.serieMensual.length===0)return"";const o=[...t.objetivos].sort((h,d)=>h.prioridad-d.prioridad),n=Math.ceil(e.serieMensual.length/de),s=Math.min(Math.max(0,a),n-1),i=e.serieMensual.slice(s*de,(s+1)*de),r=["Mes","Disponible",...o.map(h=>h.nombre),"Sin asignar","Patrimonio"].map(h=>`<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${c(h)}</th>`).join(""),l=i.map(h=>{const d=o.map(m=>{const x=h.asignaciones.find($=>$.objetivoId===m._id),y=(x==null?void 0:x.asignado)??0;return`<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${y>0?"var(--text)":"var(--text3)"}">${c(y>0?At(y):"·")}</td>`}).join("");return`<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${c(h.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${c(At(h.disponible))}</td>
        ${d}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${c(h.sinAsignar>0?At(h.sinAsignar):"·")}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${c(At(h.patrimonioTotal))}</td>
      </tr>`}).join(""),u=n>1?`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap">
           <button class="btn-secondary btn-sm" data-pl-pagina="${s-1}"${s===0?" disabled":""}>← Anteriores</button>
           <span class="text-sm" style="color:var(--text3)">
             Meses ${s*de+1}–${Math.min((s+1)*de,e.serieMensual.length)} de ${e.serieMensual.length}
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
    ${u}
  </div>`}function Kl(t,e){const a=[...t.objetivos].sort((i,r)=>i.prioridad-r.prioridad),o=i=>(i/100).toFixed(2).replace(".",","),n=["Mes","Neto","Gastos fijos","Disfrute","Disponible",...a.map(i=>i.nombre),"Sin asignar","Patrimonio"],s=e.serieMensual.map(i=>[i.mes,o(i.netoMensual),o(i.gastosFijos),o(i.disfrute),o(i.disponible),...a.map(r=>{var l;return o(((l=i.asignaciones.find(u=>u.objetivoId===r._id))==null?void 0:l.asignado)??0)}),o(i.sinAsignar),o(i.patrimonioTotal)].join(";"));return[n.join(";"),...s].join(`
`)}const Vt=t=>{const e=typeof t=="number"?t:parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},ue=t=>(t/100).toFixed(2),ln=t=>(t*100).toFixed(2),Ut=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?e/100:0},Ql=[["AHORRO_OBJETIVO","Ahorrar una cantidad"],["AMORTIZAR_DEUDA","Amortizar deuda"],["INVERSION_PERPETUA","Independencia económica"],["APORTACION_FIJA","Aportación periódica"]],Xl=[["CUOTA_POR_FECHA","Cuota para llegar a la fecha"],["ABSORBE_TODO","Se lleva todo lo disponible"],["ABSORBE_RESIDUAL","Recibe lo que sobre"],["FIJO","Importe fijo al mes"]],Zl=[["INMEDIATA","Inmediata"],["MEDIA","Media (con preaviso o penalización)"],["BLOQUEADA_HASTA_JUBILACION","Bloqueada hasta la jubilación"]],tc=[["NULO","Nulo"],["BAJO","Bajo"],["MEDIO","Medio"],["ALTO","Alto"]],cn={AHORRO_OBJETIVO:"CUOTA_POR_FECHA",AMORTIZAR_DEUDA:"ABSORBE_TODO",INVERSION_PERPETUA:"ABSORBE_RESIDUAL",APORTACION_FIJA:"FIJO"},lt=(t,e,a,o,n="",s="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <input class="form-input" id="${t}" type="${a}" value="${c(o)}" ${s}>
    ${n?`<div class="text-sm mt-4" style="color:var(--text3)">${n}</div>`:""}
  </div>`,Nt=(t,e,a,o,n="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <select class="form-input" id="${t}">
      ${a.map(([s,i])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(i)}</option>`).join("")}
    </select>
    ${n?`<div class="text-sm mt-4" style="color:var(--text3)">${n}</div>`:""}
  </div>`;function ec(t,e,a){var l,u,h;const o=t===null,n=(t==null?void 0:t.tipo)??"AHORRO_OBJETIVO",s=(t==null?void 0:t.modoAsignacion)??cn[n],i=!!(t!=null&&t.rentaDeseada),r=e.length>0?e.map(d=>[d._id,d.nombre]):[["","— no hay vehículos: crea uno primero —"]];return`
    <div class="grid-2" style="gap:10px">
      ${lt("ob-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Entrada del piso"')}
      ${lt("ob-prioridad","Prioridad","number",(t==null?void 0:t.prioridad)??a,"Menor número = se sirve antes",'min="1"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Nt("ob-tipo","Tipo",Ql,n)}
      ${Nt("ob-modo","Cómo pide dinero",Xl,s)}
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
            ${lt("ob-renta","Renta neta mensual (€)","number",ue(((l=t==null?void 0:t.rentaDeseada)==null?void 0:l.rentaNetaMensual)??2e5),"",'step="0.01"')}
            ${lt("ob-swr","Tasa de retiro seguro (%)","number",((((u=t==null?void 0:t.rentaDeseada)==null?void 0:u.tasaRetiroSeguro)??.04)*100).toFixed(2),"",'step="0.1"')}
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
        ${lt("ob-importe","Importe objetivo (€)","number",ue((t==null?void 0:t.importeObjetivo)??0),"Deja 0 si no tiene meta (un cubo perpetuo)",'step="0.01"')}
      </div>
      ${lt("ob-fecha","Fecha límite","month",(t==null?void 0:t.fechaLimite)??"","Vacío = lo antes posible")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ob-saldo","Ya acumulado (€)","number",ue((t==null?void 0:t.saldoActual)??0),"Con lo que arranca el objetivo",'step="0.01"')}
      ${Nt("ob-vehiculo","Vehículo",r,(t==null?void 0:t.vehiculoId)??r[0][0])}
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-fijo" style="display:${s==="FIJO"?"block":"none"}">
        ${lt("ob-fijo","Importe fijo mensual (€)","number",ue((t==null?void 0:t.importeFijoMensual)??0),"",'step="0.01"')}
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
    </div>`}function ac(t,e,a){var u;const o=h=>{var d;return((d=t.querySelector(`#${h}`))==null?void 0:d.value)??""},n=o("ob-nombre").trim();if(!n)return null;const s=o("ob-tipo"),i=o("ob-modo"),r=((u=t.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:u.value)==="renta",l=s==="INVERSION_PERPETUA"&&r;return{_id:(e==null?void 0:e._id)??`obj_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:n,tipo:s,importeObjetivo:l?null:Vt(o("ob-importe")),fechaLimite:o("ob-fecha")||null,prioridad:Math.max(1,Number(o("ob-prioridad"))||a),modoAsignacion:i,vehiculoId:o("ob-vehiculo"),saldoActual:Vt(o("ob-saldo")),estado:(e==null?void 0:e.estado)??"PENDIENTE",notas:o("ob-notas"),...i==="FIJO"?{importeFijoMensual:Vt(o("ob-fijo"))}:{},...i==="ABSORBE_RESIDUAL"?{pesoResidual:Math.max(0,Number(o("ob-peso"))||1)}:{},...l?{rentaDeseada:{rentaNetaMensual:Vt(o("ob-renta")),tasaRetiroSeguro:Ut(o("ob-swr")),tipoFiscalEfectivo:Ut(o("ob-fiscal"))}}:{rentaDeseada:null}}}function oc(t){const e=a=>{var o;return((o=t.querySelector(`#${a}`))==null?void 0:o.value)??""};try{const{capitalNecesario:a}=Qo({rentaNetaMensual:Vt(e("ob-renta")),tasaRetiroSeguro:Ut(e("ob-swr")),tipoFiscalEfectivo:Ut(e("ob-fiscal"))});return`${(a/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0})} €`}catch{return"no calculable con esos parámetros"}}function nc(t,e,a){const o=t===null,n=!!(t!=null&&t.esDeuda),s=[["","— ninguna —"],...e.map(r=>[r._id,r.nombre])],i=[["","— ninguno —"],...a.map(r=>[r._id,`${r.nombre} (${r.tin} % TIN)`])];return`
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
      ${Nt("ve-prestamo","Préstamo",i,(t==null?void 0:t.prestamoId)??"","Su TIN se usará como rentabilidad")}
    </div>

    ${lt("ve-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Fondo indexado"')}

    <div class="grid-2" style="gap:10px">
      ${lt("ve-rent","Rentabilidad REAL anual (%)","number",ln((t==null?void 0:t.rentabilidadRealAnual)??0),"Nominal menos inflación. Un fondo al 7 % nominal con 2 % de inflación son 5 %",'step="0.1"')}
      ${lt("ve-fiscal","Fiscalidad al retirar (%)","number",ln((t==null?void 0:t.fiscalidadRetirada)??0),"Tipo efectivo sobre la plusvalía",'step="0.5"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Nt("ve-liquidez","Liquidez",Zl,(t==null?void 0:t.liquidez)??"INMEDIATA")}
      ${Nt("ve-riesgo","Riesgo",tc,(t==null?void 0:t.riesgo)??"NULO")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ve-tope","Tope de aportación anual (€)","number",t!=null&&t.topeAportacionAnual?ue(t.topeAportacionAnual):"","Vacío = sin tope. Pensiones: 1500",'step="0.01"')}
      ${Nt("ve-cuenta","Cuenta asociada",s,(t==null?void 0:t.cuentaId)??"","Enlaza con una cuenta que ya tengas")}
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ve-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ve-cancelar>Cancelar</button>
      <button class="btn-primary" data-ve-guardar>${o?"Crear vehículo":"Guardar"}</button>
    </div>`}function sc(t,e){var i;const a=r=>{var l;return((l=t.querySelector(`#${r}`))==null?void 0:l.value)??""},o=a("ve-nombre").trim();if(!o)return null;const n=((i=t.querySelector("#ve-deuda"))==null?void 0:i.checked)??!1,s=a("ve-tope").trim();return{_id:(e==null?void 0:e._id)??`veh_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:o,rentabilidadRealAnual:Ut(a("ve-rent")),liquidez:a("ve-liquidez"),fiscalidadRetirada:Ut(a("ve-fiscal")),topeAportacionAnual:s?Vt(s):null,riesgo:a("ve-riesgo"),cuentaId:a("ve-cuenta")||null,prestamoId:n&&a("ve-prestamo")||null,esDeuda:n}}const ic={CUOTA_POR_FECHA:"Cada mes calcula lo que hace falta para llegar a la fecha, con el saldo que lleva. Si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo lo disponible hasta completarse. Los de menor prioridad no reciben nada mientras tanto.",ABSORBE_RESIDUAL:"No reclama nada: recoge lo que quede tras servir a los de arriba. Es el modo del cubo de largo plazo.",FIJO:"Aporta siempre lo mismo. Si el vehículo tiene tope anual, se aporta hasta agotarlo y se reanuda en enero."},rc="M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z",dn=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},Me=t=>(t/100).toFixed(2);function lc(t){const e=t.hoy??Y;let a="config",o=null,n=0,s=null;function i(){const M=t.store.get("planes");return M.find(z=>z.activo)??M[0]??null}function r(){const M=i();return M||t.store.addItem("planes",{nombre:"Plan base",fechaInicio:e().slice(0,7),horizonteMeses:480,pctDisfrute:0,activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:[],objetivos:[],eventos:[],creadoEn:e()})}function l(M){var F;const z=i();z&&(t.store.updateItem("planes",z._id,M),s=null,o=null,(F=t.onDatosCambiados)==null||F.call(t))}function u(){const z=t.store.get("nominas").filter(R=>R.activo).reduce((R,D)=>R+(D.bruto||0),0),F=Math.round(z*.75/12),T=t.store.get("expenses").filter(R=>R.activo&&R.basico&&R.tipo==="gasto").reduce((R,D)=>R+(D.cuantia||0),0);return{neto:Math.round(F*100),gastos:Math.round(T*100)}}function h(M){return s||(s=we(M)),s}function d(M){const z=u(),F=Math.max(0,M.perfil.netoMensual-M.perfil.gastosFijosMensuales),T=Math.round(M.pctDisfrute*100);return`
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${c(Me(M.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${c(E(z.neto/100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${c(Me(M.perfil.gastosFijosMensuales))}">
            <div class="text-sm mt-4" style="color:var(--text3)">Según tus gastos básicos: ~${c(E(z.gastos/100))}/mes</div>
          </div>
        </div>

        <div class="form-group mt-8">
          <label class="form-label">Disfrute: <span id="pl-pct-val" style="font-family:var(--font-mono);color:var(--accent)">${T} %</span> del sobrante</label>
          <input type="range" id="pl-disfrute" min="0" max="100" step="1" value="${T}" style="width:100%;accent-color:var(--accent)">
          <div class="text-sm mt-4" style="color:var(--text3)">
            Lo que NO se asigna a objetivos. Con ${c(E(Math.max(0,M.perfil.netoMensual-M.perfil.gastosFijosMensuales)/100))} de sobrante,
            quedan <strong id="pl-disponible">${c(E(F*(1-M.pctDisfrute)/100))}</strong>/mes para los objetivos.
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

      ${m(M)}`}function m(M){return`
      <div class="card">
        <div class="card-title mb-8">Notas del plan</div>
        <textarea class="form-input" id="pl-notas" rows="4" style="resize:vertical;font-family:var(--font-sans)"
          placeholder="Supuestos, decisiones tomadas, cosas a revisar…">${c(M.notas??"")}</textarea>
        <button class="btn-secondary btn-sm mt-8" data-pl-guardar-notas>Guardar notas</button>
      </div>`}const x=()=>document.getElementById("modal-overlay"),y=()=>document.getElementById("modal-content"),$=()=>{var M;return(M=x())==null?void 0:M.classList.add("hidden")};function A(M,z){const F=x(),T=y();return!F||!T?null:(T.innerHTML=`<div class="modal-title">${c(M)}</div>${z}`,F.classList.remove("hidden"),T)}function v(M){l({objetivos:M})}function b(M,z){const F=i();if(!F)return;const T=z?F.objetivos.find(k=>k._id===z)??null:null,R=F.objetivos.reduce((k,O)=>Math.max(k,O.prioridad),0)+1,D=A(T?`Editar «${T.nombre}»`:"Nuevo objetivo",ec(T,F.vehiculos,R));if(!D)return;const B=()=>{var U;const k=(U=D.querySelector("#ob-modo"))==null?void 0:U.value,O=D.querySelector("#ob-modo-ayuda");O&&k&&(O.textContent=ic[k]);const H=(K,Q)=>{const nt=D.querySelector(K);nt&&(nt.style.display=Q?"block":"none")};H("#ob-bloque-fijo",k==="FIJO"),H("#ob-bloque-residual",k==="ABSORBE_RESIDUAL")};B();const L=()=>{const k=D.querySelector("#ob-capital-derivado");k&&(k.textContent=oc(D))};L(),J(D,"#ob-modo",B),J(D,"#ob-tipo",()=>{const k=D.querySelector("#ob-tipo").value,O=D.querySelector("#ob-modo");O&&(O.value=cn[k]);const H=D.querySelector("#ob-bloque-perpetua");H&&(H.style.display=k==="INVERSION_PERPETUA"?"block":"none"),B()}),J(D,'input[name="ob-derivar"]',()=>{var U;const k=((U=D.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:U.value)==="renta",O=D.querySelector("#ob-renta-campos"),H=D.querySelector("#ob-bloque-importe");O&&(O.style.display=k?"block":"none"),H&&(H.style.display=k?"none":"block"),L()}),J(D,"#ob-renta, #ob-swr, #ob-fiscal",L),N(D,"[data-ob-cancelar]",$),N(D,"[data-ob-guardar]",()=>{const k=ac(D,T,R);if(!k){q("El objetivo necesita un nombre","err");return}if(!k.vehiculoId){q("Crea antes un vehículo donde meter el dinero","err");return}const O=F.objetivos.filter(H=>H._id!==k._id);v([...O,k]),$(),q(T?"Objetivo actualizado":`Objetivo «${k.nombre}» creado`),P(M)}),N(D,"[data-ob-borrar]",()=>{T&&Z(`¿Borrar «${T.nombre}»? Esto no se puede deshacer.`)&&(v(F.objetivos.filter(k=>k._id!==T._id)),$(),q("Objetivo borrado"),P(M))})}function f(M,z){const F=i();if(!F)return;const T=z?F.vehiculos.find(L=>L._id===z)??null:null,R=t.store.get("accounts").filter(L=>L.activo).map(L=>({_id:L._id,nombre:L.nombre})),D=t.store.get("loans").filter(L=>L.activo&&!L.simulacion).map(L=>({_id:L._id,nombre:L.nombre,tin:L.tin})),B=A(T?`Editar «${T.nombre}»`:"Nuevo vehículo",nc(T,R,D));B&&(J(B,"#ve-deuda",()=>{const L=B.querySelector("#ve-deuda").checked,k=B.querySelector("#ve-bloque-prestamo");k&&(k.style.display=L?"block":"none")}),J(B,"#ve-prestamo",()=>{const L=B.querySelector("#ve-prestamo").value,k=D.find(U=>U._id===L);if(!k)return;const O=B.querySelector("#ve-rent"),H=B.querySelector("#ve-nombre");O&&(O.value=String(k.tin)),H&&!H.value.trim()&&(H.value=`Amortizar ${k.nombre}`)}),N(B,"[data-ve-cancelar]",$),N(B,"[data-ve-guardar]",()=>{const L=sc(B,T);if(!L){q("El vehículo necesita un nombre","err");return}const k=F.vehiculos.filter(O=>O._id!==L._id);l({vehiculos:[...k,L]}),$(),q(T?"Vehículo actualizado":`Vehículo «${L.nombre}» creado`),P(M)}),N(B,"[data-ve-borrar]",()=>{if(!T)return;const L=F.objetivos.filter(k=>k.vehiculoId===T._id);if(L.length>0){q(`No se puede borrar: lo usan ${L.length} objetivo${L.length!==1?"s":""}`,"err");return}Z(`¿Borrar el vehículo «${T.nombre}»?`)&&(l({vehiculos:F.vehiculos.filter(k=>k._id!==T._id)}),$(),q("Vehículo borrado"),P(M))}))}function I(M,z,F){const T=i();if(!T||z===F)return;const R=[...T.objetivos].sort((k,O)=>k.prioridad-O.prioridad),D=R.findIndex(k=>k._id===z),B=R.findIndex(k=>k._id===F);if(D<0||B<0)return;const[L]=R.splice(D,1);R.splice(B,0,L),v(R.map((k,O)=>({...k,prioridad:O+1}))),P(M)}function p(M){return M.vehiculos.length===0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.06);border-color:rgba(255,209,102,0.28)">
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          <strong style="color:var(--yellow)">No hay vehículos todavía.</strong>
          Un vehículo es dónde va el dinero —una cuenta, un fondo, un plan de pensiones o la amortización de un
          préstamo— y con qué rentabilidad crece. Hace falta al menos uno para poder crear objetivos.
        </div>
      </div>`:`<div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Vehículos</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${M.vehiculos.map(z=>{const F=M.objetivos.filter(T=>T.vehiculoId===z._id).length;return`<button class="btn-secondary btn-sm" data-pl-editar-vehiculo="${c(z._id)}"
              style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 11px;text-align:left${z.revisarRentabilidad?";border-color:rgba(255,209,102,0.45)":""}">
              <span style="font-weight:600;font-size:12px">${c(z.nombre)}${z.esDeuda?" 🔒":""}${z.revisarRentabilidad?" ⚠":""}</span>
              <span style="font-size:10px;color:var(--text3)">
                ${c((z.rentabilidadRealAnual*100).toFixed(2))} % real · ${F} objetivo${F!==1?"s":""}
              </span>
            </button>`}).join("")}
      </div>
      ${M.vehiculos.some(z=>z.revisarRentabilidad)?`<div class="text-sm mt-10" style="color:var(--yellow);line-height:1.7;padding-top:10px;border-top:1px solid var(--border)">
               ⚠ Los vehículos marcados traen la rentabilidad de tus cuentas, que es <strong>nominal</strong>.
               Este módulo trabaja en términos <strong>reales</strong>: réstale la inflación que esperes
               (unos 2 puntos) o la simulación te dirá que llegas antes de lo que llegarás. Al guardarlos
               desde su formulario el aviso desaparece.
             </div>`:""}
    </div>`}function g(M,z,F){const T=i(),R=$l(z);if(!T||!R)return;const D=F?T.eventos.find(O=>O._id===F)??null:null,B={};R.id==="hijo"&&(B.actuales=T.perfil.gastosFijosMensuales),R.id==="subida-sueldo"&&(B.actual=T.perfil.netoMensual);const L=A(D?`Editar evento · ${R.nombre}`:R.nombre,jl(R,D,T,B));if(!L)return;const k=()=>{const O=L.querySelector("#ev-resultado");O&&(O.textContent=_l(R,nn(L,R)))};k();for(const O of R.campos)J(L,`#ev-${O.id}`,k);N(L,"[data-ev-cancelar]",$),N(L,"[data-ev-guardar]",()=>{var K,Q;const O=((K=L.querySelector("#ev-fecha"))==null?void 0:K.value)??"";if(!O){q("El evento necesita un mes","err");return}const H=nn(L,R),U={_id:(D==null?void 0:D._id)??`ev_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,fecha:O,tipo:R.tipo,importe:R.calcular(H),objetivoDestinoId:((Q=L.querySelector("#ev-destino"))==null?void 0:Q.value)||null,notas:R.resumir(H)};l({eventos:[...T.eventos.filter(nt=>nt._id!==U._id),U]}),$(),q(D?"Evento actualizado":"Evento añadido"),P(M)}),N(L,"[data-ev-borrar]",()=>{!D||!Z("¿Borrar este evento?")||(l({eventos:T.eventos.filter(O=>O._id!==D._id)}),$(),q("Evento borrado"),P(M))})}function w(M){var z;switch(M.tipo){case"CAMBIO_GASTOS_FIJOS":return"hijo";case"CAMBIO_INGRESOS":return"subida-sueldo";case"NUEVA_DEUDA":return"nueva-hipoteca";case"INYECCION_CAPITAL":return(z=M.notas)!=null&&z.includes("hipoteca")?"venta-vivienda":"inyeccion"}}function S(){const M=i();if(!M)return;const z=new Blob([JSON.stringify(M,null,2)],{type:"application/json"}),F=URL.createObjectURL(z),T=document.createElement("a");T.href=F,T.download=`plan-${M.nombre.replace(/[^\w-]+/g,"_")}-${e()}.json`,T.click(),URL.revokeObjectURL(F),q("Plan exportado")}function j(M){const z=document.createElement("input");z.type="file",z.accept="application/json,.json",z.addEventListener("change",async()=>{var T,R;const F=(T=z.files)==null?void 0:T[0];if(F)try{const D=JSON.parse(await F.text());if(!D||!Array.isArray(D.objetivos)||!Array.isArray(D.vehiculos)||!D.perfil){q("Ese fichero no es un plan de objetivos","err");return}const B=`${D.nombre??"Importado"} (importado)`,L=t.store.addItem("planes",{...D,nombre:B,activo:!1,creadoEn:e()});s=null,o=null,(R=t.onDatosCambiados)==null||R.call(t),q(`Plan «${L.nombre}» importado`),P(M)}catch(D){console.error("[Planner] Importación fallida:",D),q("No se ha podido leer el fichero","err")}}),z.click()}function _(M,z){switch(a){case"config":return d(M);case"objetivos":return yl(M,z);case"simulacion":return Gl(M,z,n);case"eventos":return Cl(M);case"escenarios":return ql(t.store.get("planes"),M._id,o)}}function P(M){const z=r(),F=h(z),T=(D,B)=>`<button class="period-btn ${a===D?"active":""}" data-pl-tab="${D}">${B}</button>`,R=F.viable?'<span class="badge badge-green">Plan viable</span>':'<span class="badge badge-red">No cabe en el flujo</span>';if(M.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Objetivos <span>financieros</span></h1>
        <div class="page-actions">${R}</div>
      </div>

      <div class="period-selector mb-14">
        ${T("config","Plan")}
        ${T("objetivos",`Objetivos (${z.objetivos.length})`)}
        ${T("simulacion","Simulación")}
        ${T("eventos",`Eventos (${z.eventos.length})`)}
        ${T("escenarios","Comparar planes")}
      </div>

      ${a==="objetivos"?`<div class="flex gap-8 mb-14 flex-wrap">
               <button class="btn-primary" data-pl-nuevo-objetivo>+ Nuevo objetivo</button>
               <button class="btn-secondary" data-pl-nuevo-vehiculo>+ Nuevo vehículo</button>
             </div>
             ${p(z)}`:""}

      <div id="pl-cuerpo">${_(z,F)}</div>`,a==="simulacion"){const D=M.querySelector("#pl-chart");D&&gl(D,z,F)}C(M)}function C(M){N(M,"[data-pl-tab]",F=>{a=F.dataset.plTab,P(M)}),J(M,"#pl-disfrute",F=>{const T=Number(F.value)/100,R=M.querySelector("#pl-pct-val");R&&(R.textContent=`${Math.round(T*100)} %`);const D=i();if(!D)return;const B=Math.max(0,D.perfil.netoMensual-D.perfil.gastosFijosMensuales)*(1-T),L=M.querySelector("#pl-disponible");L&&(L.textContent=E(B/100))}),N(M,"[data-pl-usar-sugerido]",()=>{const F=u(),T=M.querySelector("#pl-neto"),R=M.querySelector("#pl-gastos");T&&(T.value=Me(F.neto)),R&&(R.value=Me(F.gastos))}),N(M,"[data-pl-guardar]",()=>{const F=T=>{var R;return((R=M.querySelector(T))==null?void 0:R.value)??""};l({perfil:{netoMensual:dn(F("#pl-neto")),gastosFijosMensuales:dn(F("#pl-gastos")),manual:!0},pctDisfrute:Math.min(1,Math.max(0,Number(F("#pl-disfrute"))/100)),fechaInicio:F("#pl-inicio")||e().slice(0,7),horizonteMeses:Math.min(600,Math.max(1,Number(F("#pl-horizonte"))||480))}),q("Plan guardado"),P(M)}),N(M,"[data-pl-plantilla]",F=>g(M,F.dataset.plPlantilla??"",null)),N(M,"[data-pl-editar-evento]",F=>{var D;const T=F.dataset.plEditarEvento??"",R=(D=i())==null?void 0:D.eventos.find(B=>B._id===T);R&&g(M,w(R),T)}),N(M,"[data-pl-duplicar]",()=>{var D;const F=i();if(!F)return;const T=window.prompt("Nombre del plan nuevo:",`${F.nombre} (copia)`);if(!(T!=null&&T.trim()))return;const R=Al(F,T.trim(),`plan_${Date.now().toString(36)}`,e());t.store.addItem("planes",R),(D=t.onDatosCambiados)==null||D.call(t),q(`Plan «${R.nombre}» creado. Actívalo para editarlo.`),P(M)}),N(M,"[data-pl-activar]",F=>{var R;const T=F.dataset.plActivar;if(T){for(const D of t.store.get("planes"))t.store.updateItem("planes",D._id,{activo:D._id===T});s=null,o=null,(R=t.onDatosCambiados)==null||R.call(t),q("Plan activo cambiado"),P(M)}}),N(M,"[data-pl-renombrar]",F=>{var B;const T=F.dataset.plRenombrar,R=t.store.get("planes").find(L=>L._id===T);if(!R)return;const D=window.prompt("Nuevo nombre:",R.nombre);D!=null&&D.trim()&&(t.store.updateItem("planes",R._id,{nombre:D.trim()}),(B=t.onDatosCambiados)==null||B.call(t),P(M))}),N(M,"[data-pl-borrar-plan]",F=>{var B;const T=F.dataset.plBorrarPlan,R=t.store.get("planes").find(L=>L._id===T);if(!R||!Z(`¿Borrar el plan «${R.nombre}» con sus ${R.objetivos.length} objetivos? No se puede deshacer.`))return;t.store.removeItem("planes",R._id);const D=t.store.get("planes");R.activo&&D.length>0&&t.store.updateItem("planes",D[0]._id,{activo:!0}),s=null,o=null,(B=t.onDatosCambiados)==null||B.call(t),q("Plan borrado"),P(M)}),N(M,"[data-pl-sensibilidad]",()=>{const F=i();F&&(o=Rl(F),P(M))}),N(M,"[data-pl-pagina]",F=>{n=Number(F.dataset.plPagina)||0,P(M)}),N(M,"[data-pl-exportar]",S),N(M,"[data-pl-importar]",()=>j(M)),N(M,"[data-pl-nuevo-objetivo]",()=>b(M,null)),N(M,"[data-pl-nuevo-vehiculo]",()=>f(M,null)),N(M,"[data-pl-editar-vehiculo]",F=>f(M,F.dataset.plEditarVehiculo??null)),N(M,"[data-pl-editar-objetivo]",F=>b(M,F.dataset.plEditarObjetivo??null));let z=null;M.querySelectorAll("[data-pl-objetivo]").forEach(F=>{F.addEventListener("dragstart",()=>{z=F.dataset.plObjetivo??null,F.style.opacity="0.45"}),F.addEventListener("dragend",()=>{F.style.opacity="",M.querySelectorAll("[data-pl-objetivo]").forEach(T=>T.style.borderTop="")}),F.addEventListener("dragover",T=>{T.preventDefault(),z&&F.dataset.plObjetivo!==z&&(F.style.borderTop="2px solid var(--accent)")}),F.addEventListener("dragleave",()=>{F.style.borderTop=""}),F.addEventListener("drop",T=>{T.preventDefault(),F.style.borderTop="";const R=F.dataset.plObjetivo;z&&R&&I(M,z,R),z=null})}),N(M,"[data-pl-csv]",()=>{const F=i();if(!F||!s)return;const T=new Blob(["\uFEFF"+Kl(F,s)],{type:"text/csv;charset=utf-8"}),R=URL.createObjectURL(T),D=document.createElement("a");D.href=R,D.download=`plan-${F.nombre.replace(/[^\w-]+/g,"_")}-${e()}.csv`,D.click(),URL.revokeObjectURL(R),q(`CSV exportado (${s.serieMensual.length} meses)`)}),N(M,"[data-pl-guardar-notas]",()=>{var F;l({notas:((F=M.querySelector("#pl-notas"))==null?void 0:F.value)??""}),q("Notas guardadas")})}return{id:"planner",route:"planner",nombre:"Objetivos financieros",seccion:2,iconoPath:rc,mount:P}}function un(t,e,a=!1){const o=Math.abs(It(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function cc(t){function e(f){return`${f}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(f={}){var p;const I=(p=f.texto)==null?void 0:p.trim().toLowerCase();return t.get("transacciones").filter(g=>!(f.cuentaId&&g.cuentaId!==f.cuentaId||f.desde&&g.fecha<f.desde||f.hasta&&g.fecha>f.hasta||f.tipo&&g.tipo!==f.tipo||f.estimacionId&&g.estimacionId!==f.estimacionId||f.tags&&f.tags.length>0&&!f.tags.some(w=>g.tags.includes(w))||I&&!g.concepto.toLowerCase().includes(I))).sort((g,w)=>g.fecha.localeCompare(w.fecha)||g._id.localeCompare(w._id))}function o(f){const I={_id:e("tx"),fecha:f.fecha,cuentaId:f.cuentaId,importeCts:un(f.tipo,f.importe,f.negativo),concepto:f.concepto,tags:f.tags??[],estimacionId:f.estimacionId??null,tipo:f.tipo,origen:f.origen??"manual",...f.nota?{nota:f.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),I]),I}function n(f,I){t.set("transacciones",t.get("transacciones").map(p=>{if(p._id!==f)return p;const{importe:g,...w}=I,S={...p,...w};return g!==void 0&&(S.importeCts=un(S.tipo,g,S.importeCts<0)),S}))}function s(f){t.set("transacciones",t.get("transacciones").filter(I=>I._id!==f))}function i(f,I){n(f,{estimacionId:I})}function r(f){return t.get("puntosControl").filter(I=>!f||I.cuentaId===f).sort((I,p)=>I.fecha.localeCompare(p.fecha))}function l(f,I,p,g){const w={_id:e("pc"),fecha:I,cuentaId:f,saldoCts:It(p),...g?{nota:g}:{}},S=t.get("puntosControl").filter(j=>!(j.cuentaId===f&&j.fecha===I));return t.set("puntosControl",[...S,w].sort((j,_)=>j.fecha.localeCompare(_.fecha))),h(f),w}function u(f){const I=t.get("puntosControl").find(p=>p._id===f);t.set("puntosControl",t.get("puntosControl").filter(p=>p._id!==f)),I&&h(I.cuentaId)}function h(f){const I=r(f),p=t.get("accounts");p.some(g=>g._id===f)&&t.set("accounts",p.map(g=>g._id===f?{...g,historicoSaldos:I.map(w=>({_id:w._id,fecha:w.fecha,saldo:et(w.saldoCts),...w.nota?{nota:w.nota}:{}}))}:g))}function d(f,I=Y()){const p=r(f).filter(j=>j.fecha<=I).pop(),g=p==null?void 0:p.fecha,w=(p==null?void 0:p.saldoCts)??0;return t.get("transacciones").filter(j=>j.cuentaId===f&&j.fecha<=I&&(g===void 0||j.fecha>g)).reduce((j,_)=>j+_.importeCts,w)}function m(f,I){return et(d(f,I))}function x(f=Y(),I){const p=I??t.get("accounts").filter(g=>g.activo).map(g=>g._id);return et(p.reduce((g,w)=>g+d(w,f),0))}function y(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function $(){const f=[...t.get("transacciones").map(I=>I.fecha),...t.get("puntosControl").map(I=>I.fecha)];return f.length>0?f.sort().pop()??null:null}function A(f={}){return et(a(f).reduce((I,p)=>I+p.importeCts,0))}function v(f={}){const I=new Map;for(const p of a(f)){const g=p.fecha.slice(0,7);I.set(g,(I.get(g)??0)+p.importeCts)}return new Map([...I.entries()].sort(([p],[g])=>p.localeCompare(g)).map(([p,g])=>[p,et(g)]))}function b(f={}){const I=new Map;for(const p of a(f))for(const g of p.tags.length>0?p.tags:["sin_tag"])I.set(g,(I.get(g)??0)+p.importeCts);return new Map([...I.entries()].map(([p,g])=>[p,et(g)]))}return{transacciones:a,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:u,saldoCuenta:m,saldoCuentaCts:d,saldoTotal:x,tieneDatos:y,ultimaFecha:$,total:A,totalPorMes:v,totalPorTag:b}}function xt(t){return t.trim().toLowerCase()}function dc(t){function e(){const u=new Map,h=(d,m)=>{const x=xt(d);if(!x)return;const y=u.get(x)??{tag:x,estimaciones:0,reales:0,total:0};y[m]+=1,y.total+=1,u.set(x,y)};for(const d of t.get("expenses"))for(const m of d.tags??[])h(m,"estimaciones");for(const d of t.get("transacciones"))for(const m of d.tags??[])h(m,"reales");return[...u.values()].sort((d,m)=>m.total-d.total||d.tag.localeCompare(m.tag))}function a(){return e().map(u=>u.tag)}function o(u){return e().filter(h=>u==="estimaciones"?h.reales===0:h.estimaciones===0).map(h=>h.tag)}function n(u,h,d){const m=xt(h),x=(u??[]).map(xt);if(!x.includes(m))return u??[];const y=x.filter($=>$!==m);return d===null?[...new Set(y)]:[...new Set([...y,xt(d)])]}function s(u,h){const d=xt(h);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return l(u,d)}function i(u,h){let d=0;for(const m of u)xt(m)!==xt(h)&&(d+=l(m,xt(h)).cambiados);return{cambiados:d}}function r(u){return l(u,null)}function l(u,h){let d=0;const m=t.get("expenses").map(w=>{const S=n(w.tags,u,h);return S!==w.tags&&(d+=1),S===w.tags?w:{...w,tags:S}});t.set("expenses",m);const x=t.get("transacciones").map(w=>{const S=n(w.tags,u,h);return S!==w.tags&&(d+=1),S===w.tags?w:{...w,tags:S}});t.set("transacciones",x);const y=t.get("loans").map(w=>{const S=n(w.tags,u,h);return S!==w.tags&&(d+=1),S===w.tags?w:{...w,tags:S}});t.set("loans",y);const $=t.get("nominas").map(w=>{const S=n(w.tags,u,h);return S!==w.tags&&(d+=1),S===w.tags?w:{...w,tags:S}});t.set("nominas",$);const A=t.get("config"),v=xt(u),b=w=>{const S=(w??[]).map(xt);if(!S.includes(v))return w??[];const j=S.filter(_=>_!==v);return h===null?[...new Set(j)]:[...new Set([...j,h])]},f={},I=b(A.activeTagsFilter),p=b(A.tagCategorias),g=b(A.tagGrupos);return I!==A.activeTagsFilter&&(f.activeTagsFilter=I),p!==A.tagCategorias&&(f.tagCategorias=p),g!==A.tagGrupos&&(f.tagGrupos=g),Object.keys(f).length>0&&t.patchConfig(f),{cambiados:d}}return{uso:e,todas:a,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const uc=3;function pn(t){return t<.005?0:t}function pc(t){if(t.length<2)return null;const e=t.reduce((o,n)=>o+n,0)/t.length,a=t.reduce((o,n)=>o+(n-e)**2,0)/(t.length-1);return Math.sqrt(a)}function mc(t){const e=[],a=[],o=[];for(const i of t){if(i.meses.length<uc)continue;const r=pc(i.meses.map(l=>l.desviacion));r!==null&&(e.push(r),a.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(e.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(e.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(a.reduce((i,r)=>i+r*r,0));return{sigmaMensual:pn(n),sigmaDeriva:pn(s),estimaciones:e.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function mn(t,e,a=1,o=0){if(e<=0)return 0;const n=Math.max(0,t)*Math.sqrt(e),s=Math.max(0,o)*e;return n===0&&s===0?0:W(a*Math.hypot(n,s))}function fc(t,e,a={}){if(!e.fiable||t.length===0)return[];const{z:o=1}=a,n=a.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[l,u]=r.fecha.slice(0,7).split("-").map(Number),h=Math.max(0,(l-s)*12+(u-i)),d=mn(e.sigmaMensual,h,o,e.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:W(r.saldoAcum+d),abajo:W(r.saldoAcum-d)}})}function vc(t,e=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const a=e>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${e} desviación${e!==1?"es":""} típica${e!==1?"s":""} (${a} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const ma="financeapp_session",gc=["local","dropbox","firebase"];function bc(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!gc.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function hc({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(x){const y=n();if(y)try{x?y.setItem(ma,JSON.stringify(x)):y.removeItem(ma)}catch{}}function i(){const x=n();if(!x)return null;try{return bc(x.getItem(ma))}catch{return null}}function r(){const x=i();return x?(a()-x.ultimoUso)/6e4:null}function l(){const x=e();if(!Number.isFinite(x)||x<=0||o())return!1;const y=r();return y!==null&&y>=x}function u(){const x=i();return x?l()?(s(null),null):x:null}function h(x){const y=a(),$={modo:x.modo,...x.email?{email:x.email}:{},...x.passphrase?{passphrase:x.passphrase}:{},creadaEn:y,ultimoUso:y};return s($),$}function d(){const x=i();x&&s({...x,ultimoUso:a()})}function m(){s(null)}return{abrir:h,leer:u,tocar:d,cerrar:m,caducada:l,inactividadMinutos:r,get activa(){return u()!==null}}}const fn=["pointerdown","keydown","visibilitychange"];function yc({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const h of fn)s==null||s.addEventListener(h,r);const l=o(()=>{i&&t.caducada()&&(u(),t.cerrar(),e())},a);function u(){if(i){i=!1,n(l);for(const h of fn)s==null||s.removeEventListener(h,r)}}return u}const xc=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],$c="FinanceApp",Ic=new TextEncoder().encode("financeapp-bio-passphrase-v1");function vn(t){return new Uint8Array(new ArrayBuffer(t))}const fa="financeapp_bio_credencial",va="financeapp_bio_secreto",ga="financeapp_bio_ultimo_desbloqueo",gn="financeapp_bio_gracia_min",Ac=5;function wc(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function Ce(t){const e=t instanceof Uint8Array?t:new Uint8Array(t);let a="";for(const o of e)a+=String.fromCharCode(o);return btoa(a)}function Ee(t){const e=atob(t),a=vn(e.length);for(let o=0;o<e.length;o++)a[o]=e.charCodeAt(o);return a}function Sc(t){return Ce(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Mc(t){const e=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return Ee(e)}function bn(t){return t.getClientExtensionResults()}function Cc(t={}){const e=t.webauthn??wc(),a=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(p=>crypto.getRandomValues(vn(p)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return e.disponiblePlataforma()}function l(){const p=o==null?void 0:o.getItem(fa);if(!p)return null;try{const g=JSON.parse(p);return typeof g.credencialId!="string"||typeof g.salt!="string"?null:g}catch{return null}}function u(){return l()!==null}async function h(p){const g=await a.importKey("raw",p,"HKDF",!1,["deriveKey"]);return a.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:Ic},g,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d(p,g){const w=s(12),S=await a.encrypt({name:"AES-GCM",iv:w},p,new TextEncoder().encode(g));return`${Ce(w)}:${Ce(S)}`}async function m(p,g){const[w,S]=g.split(":"),j=Ee(w),_=Ee(S),P=await a.decrypt({name:"AES-GCM",iv:j},p,_);return new TextDecoder().decode(P)}async function x(p,g){var R,D;if(!p)throw new Error("No hay clave de cifrado que envolver.");const w=s(32),S=s(32),j=s(16),_=await e.create({publicKey:{challenge:S,rp:{name:$c},user:{id:j,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:w}}},timeout:6e4}});if(!_)throw new Error("No se ha podido crear la credencial biométrica.");const P=bn(_);if(!((R=P.prf)!=null&&R.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let C=((D=P.prf.results)==null?void 0:D.first)??null;if(C||(C=await y(_.rawId,w)),!C)throw new Error("El sensor no ha devuelto material de cifrado.");const M=await h(C),z=await d(M,p),F={credencialId:Sc(_.rawId),salt:Ce(w),modo:g,creadaEn:n()},T=i();T.setItem(fa,JSON.stringify(F)),T.setItem(va,z)}async function y(p,g){var S,j;const w=await e.get({publicKey:{challenge:s(32),allowCredentials:[{id:p,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:g}}},timeout:6e4}});return w?((j=(S=bn(w).prf)==null?void 0:S.results)==null?void 0:j.first)??null:null}async function $(){const p=l();if(!p)throw new Error("No hay huella configurada en este dispositivo.");const g=o==null?void 0:o.getItem(va);if(!g)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const w=await y(Mc(p.credencialId).buffer,Ee(p.salt));if(!w)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const S=await h(w),j=await m(S,g);return v(),j}function A(){o==null||o.removeItem(fa),o==null||o.removeItem(va),o==null||o.removeItem(ga)}function v(){o==null||o.setItem(ga,String(n()))}function b(){const p=o==null?void 0:o.getItem(gn);if(p==null)return Ac;const g=Number(p);return Number.isFinite(g)&&g>0?g:0}function f(p){o==null||o.setItem(gn,String(Math.max(0,Math.floor(p)||0)))}function I(){if(!u())return!1;const p=b();if(p<=0)return!1;const g=o==null?void 0:o.getItem(ga),w=g?Number(g):NaN;return Number.isFinite(w)?n()-w<p*6e4:!1}return{disponible:r,registrada:u,leerCredencial:l,registrar:x,desbloquear:$,olvidar:A,marcarDesbloqueo:v,dentroDeGracia:I,graciaMinutos:b,configurarGracia:f}}function hn(){if(typeof localStorage<"u"){const $=Fs();$.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${$.join(", ")}`)}const t=zs(),e=Rs({adapter:t}),a=Os(),{applied:o}=e.load();o.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${o.join(", ")} (esquema v${ee})`),e.subscribe($=>a.marcar($));const n=Hs(e);ts($=>n.isEnabled($));const s=Cc(),i=hc({autoLogoutMinutos:()=>{var A,v;const $=(v=(A=globalThis.State)==null?void 0:A.get)==null?void 0:v.call(A,"config");return Number(($==null?void 0:$.autoLogoutMinutos)??e.get("config").autoLogoutMinutos??0)},graciaActiva:()=>s.dentroDeGracia()}),r=cc(e),l=dc(e),u=Mi(r),h=ri(e),d=ai({isEnabled:$=>n.isEnabled($)}),m=Js({flags:n,rutasExtra:()=>d.flagPorRuta()}),x=Ys({flags:n,onChange:()=>{var $,A;d.attachToShell(),m.apply(),(A=($=globalThis.Router)==null?void 0:$.rerender)==null||A.call($)}}),y=()=>{var A,v,b,f,I,p;const $=globalThis;if((v=(A=$.State)==null?void 0:A.load)==null||v.call(A),((f=(b=$.Router)==null?void 0:b.current)==null?void 0:f.call(b))==="dashboard")try{(p=(I=$.DashboardModule)==null?void 0:I.render)==null||p.call(I)}catch(g){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",g)}};return d.register(Zi({store:e,onDatosCambiados:y})),d.register(dr({store:e,onDatosCambiados:y})),d.register(jr({store:e,onDatosCambiados:y})),d.register(Wr({store:e,ledger:r,mostrarObjetivos:()=>n.isEnabled("goals"),onDatosCambiados:y})),d.register(Oi({ledger:r,tags:l,precision:u,adjuster:h,accounts:()=>e.get("accounts"),estimaciones:()=>e.get("expenses"),onDatosCambiados:y})),d.register(lc({store:e,onDatosCambiados:y})),d.register(il({store:e,onDatosCambiados:y})),d.register(Ui({store:e,onDatosCambiados:y})),d.register(al({store:e})),d.register(Li({store:e,onDatosCambiados:y})),{version:ee,core:Nn,engine:{generarExtracto:Xt,recomputarSaldoAcum:qn,saldoHoy:Ln,sumarPorTags:Ua,providers:{proyectarGastos:Qt,proyectarPrestamos:Ra,proyectarTransferencias:Oa,proyectarNominas:ka,proyectarInteresesCuentas:La,proyectarAportaciones:qa,proyectarRetencionesFiscales:Ba,proyectarInflacionGastos:Ha,proyectarPerdidaAhorro:Ga},analysis:Gn,margins:Jn,avisos:Xn,optimizer:es,dashboard:vs},store:e,flags:n,featureRegistry:{all:Ct,porGrupo:ho},ui:{openFeatures:x.open,applyGating:m.apply,watchGating:()=>m.observar(),instalarDeshacer:()=>Ks({store:e,rerender:()=>{var A,v,b,f;const $=globalThis;(v=(A=$.State)==null?void 0:A.load)==null||v.call(A),(f=(b=$.Router)==null?void 0:b.rerender)==null||f.call(b)}}),avisoGuardado:null,instalarBuscador:()=>ti({estado:()=>({accounts:e.get("accounts"),expenses:e.get("expenses"),loans:e.get("loans"),nominas:e.get("nominas"),escenarios:e.get("escenarios"),planes:e.get("planes"),goals:e.get("goals"),transacciones:e.get("transacciones")}),rutasDisponibles:()=>d.routes(),navegar:$=>{var A,v;return(v=(A=globalThis.Router)==null?void 0:A.navigate)==null?void 0:v.call(A,$)}})},app:d,session:Object.assign(i,{vigilar:$=>yc({sesion:i,onCaducada:$}),opciones:xc}),biometria:s,cambios:a,datos:{colecciones:oe,snapshot:()=>go(t),aplicar:($,{sellar:A=!0}={})=>{const b=qs(A?(f,I)=>t.set(f,I):(f,I)=>{const p=globalThis.StorageAdapter;p!=null&&p.setRestaurando?p.setRestaurando(f,I):t.set(f,I)},$);return e.load(),a.marcar("copia-restaurada"),b},faltantes:$=>Ls($),esVacioOPorDefecto:()=>Bs(go(t)),recargar:()=>{e.load(),a.marcar("recarga-externa")}},accounting:{ledger:r,tags:l,precision:u,adjuster:h,sugerirAjuste:Ze,medirVariabilidad:mc,bandaDeConfianza:fc,bandaAcumulada:mn,describirBanda:vc}}}function Ec(){try{const t=hn();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const Et=typeof window<"u"?Ec():null;if(Et){let t=!1;const e=()=>{if(Et.app.attachToShell(),Et.ui.applyGating(),!t){t=!0,Et.ui.watchGating(),Et.ui.instalarDeshacer(),Et.ui.instalarBuscador();const a=globalThis,o=()=>{var n,s,i,r;return(s=(n=a.FirebaseService)==null?void 0:n.isConnected)!=null&&s.call(n)?a.FirebaseService:(r=(i=a.DropboxService)==null?void 0:i.isConnected)!=null&&r.call(i)?a.DropboxService:null};Et.ui.avisoGuardado=ei({cambios:Et.cambios,hayDestino:()=>o()!==null,guardar:async()=>{const n=o();if(!(n!=null&&n.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await n.uploadBackup()}})}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",a=>{const o=a.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(e,0)})}return $t.bootstrap=hn,Object.defineProperty($t,Symbol.toStringTag,{value:"Module"}),$t}({});
//# sourceMappingURL=financeapp-core.js.map

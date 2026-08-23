var FinanceAppBundle=function($t){"use strict";var Xr=Object.defineProperty;var Zr=($t,V,G)=>V in $t?Xr($t,V,{enumerable:!0,configurable:!0,writable:!0,value:G}):$t[V]=G;var Lo=($t,V,G)=>Zr($t,typeof V!="symbol"?V+"":V,G);function V(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function G(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function J(){return V(new Date)}function xe(t,a){return new Date(t,a+1,0).getDate()}function ta(t,a,e){return V(new Date(t,a,Math.min(e,xe(t,a))))}function le(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return V(new Date(t,a+1,0));const s=parseInt(o);if(!isNaN(s))return ta(t,a,s)}if(e.startsWith("nthweekday:")){const o=e.split(":"),s=parseInt(o[1]),n=parseInt(o[2]);if(s===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==n;)r.setDate(r.getDate()-1);return V(r)}const i=new Date(t,a,1);for(;i.getDay()!==n;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(s-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),V(i)}return null}function ea(t,a){if(!a)return t;const e=G(t);return le(e.getFullYear(),e.getMonth(),a)??t}const ko=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],Bo={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function $e(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${Bo[e]||e+"º"} ${ko[o]} del mes`}return t}function ce(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function It(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function ot(t){return t/100}function st(t){return ot(It(t))}function z(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function aa(t){return(t||0).toFixed(2)+"%"}function Tt(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function oa(t,a,e,o=0){const s=Tt(t,a,e),n=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const c=s*(1-Math.pow(1+i,-e))/i-n,x=s*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),p=i-c/x;if(Math.abs(p-i)<1e-10){i=p;break}i=p}return(Math.pow(1+i,12)-1)*100}function sa(t,a,e,o,s=0,n=[],i={}){const r=[];let d=t;const c=G(o),x=a/100/12;let p=e,u=Tt(d,a,p);const v=[...n].sort(($,A)=>$.fecha.localeCompare(A.fecha));let b=0;for(let $=1;$<=e*2&&d>.01;$++){const A=new Date(c);c.setMonth(c.getMonth()+1);const m=ea(V(A),i.diaPago||"");for(;b<v.length&&v[b].fecha<=m;){const I=v[b],f=I.cantidad*(s/100);if(d-=I.cantidad,d=Math.max(0,d),I.tipo==="plazo"?p=Math.ceil(-Math.log(1-d*x/u)/Math.log(1+x)):(p=e-$+1,u=Tt(d,a,p)),r.push({mes:"AMORT",fecha:I.fecha,cuota:0,interes:0,amortizacion:I.cantidad,comisionAmort:f,capitalPendiente:d,esAmortizacion:!0,simulacion:I.simulacion||!1}),b++,d<.01)break}if(d<.01)break;const g=d*x,h=Math.min(u-g,d);if(d-=h,d<.01&&(d=0),r.push({mes:$,fecha:m,cuota:u,interes:g,amortizacion:h,comisionAmort:0,capitalPendiente:d,esAmortizacion:!1,simulacion:!1}),p--,p<=0||d<.01)break}return r}const na=new Map;function tt(t){var A;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((m,g)=>`${m.fecha}|${m.cantidad}|${m.tipo||""}`.localeCompare(`${g.fecha}|${g.cantidad}|${g.tipo||""}`)).map(m=>`${m.fecha}:${m.cantidad}:${m.tipo||""}`).join(";")}`,o=na.get(e);if(o)return o;const{capital:s,tin:n,meses:i,fechaInicio:r,comisionAmort:d,comisionApertura:c}=t,x=sa(s,n,i,r,d||0,a,t),p=x.reduce((m,g)=>m+g.interes,0),u=x.reduce((m,g)=>m+g.comisionAmort,0),v=s*((c||0)/100),b=x.filter(m=>!m.esAmortizacion),$={cuota:Tt(s,n,i),totalIntereses:p,tae:oa(s,n,i,c||0),costoTotal:p+u+v,comAp:v,totalComAm:u,fechaFin:((A=b.slice(-1)[0])==null?void 0:A.fecha)||"",mesesReales:b.length,tabla:x};return na.set(e,$),$}function ia(t){const a=tt(t),e=tt({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,s=e.mesesReales-a.mesesReales,n=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:s,costeTotalAmort:n,ahorroNeto:o-n,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function pt(t,a,e){if(!t||t.length===0)return 1;const o=G(a),s=G(e);if(s<=o)return 1;const n=[...t].sort((d,c)=>d.year-c.year);let i=1,r=new Date(o);for(;r<s;){const d=r.getFullYear(),c=n.filter($=>$.year<=d),x=c.length>0?c[c.length-1]:n[0],p=(x?x.tasa:0)/100,u=new Date(d+1,0,1),v=u<s?u:s,b=ce(r,v);i*=Math.pow(1+p,b/365.25),r=v}return i}function ra(t,a,e,o=0){const s=G(a),n=G(e);if(n<=s)return o;const i=ce(s,n),r=t?[...t].sort((x,p)=>x.year-p.year):[];let d=0,c=new Date(s);for(;c<n;){const x=c.getFullYear(),p=new Date(x+1,0,1),u=p<n?p:n,v=ce(c,u),b=r.filter(m=>m.year<=x),$=b.length>0?b[b.length-1]:null,A=$!==null?$.tasa:o;d+=A*v,c=u}return i>0?d/i:o}function la(t,a){return((1+t/100)/(1+a/100)-1)*100}function Ho(t,a,e,o){const s=pt(a,e,o);return s>0?t/s:t}function Go(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,s=a.saludUmbralDTIVerde??30,n=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:d=0,cuotas:c=0,cuotasHipoteca:x=0,gastosBasicos:p=0,gastosOtros:u=0,amortizaciones:v=0}=t,b=d-c-v-p-u,$=b,A=d>0?$/d*100:null,m=r?c-x:c,g=d>0?m/d*100:null,h=d>0?c/d*100:null,I=d>0?(p+c+v)/d*100:null,f=d>0?u/d*100:null,y=(S,C,j)=>S===null?"neutral":S>=C?"verde":S>=j?"amarillo":"rojo",M=(S,C,j)=>S===null?"neutral":S<=C?"verde":S<=j?"amarillo":"rojo";return{ingresos:d,cuotas:c,cuotasHipoteca:x,gastosBasicos:p,gastosOtros:u,amortizaciones:v,ahorroBruto:b,ahorroReal:$,tasaAhorro:A,dti:g,dtiTotal:h,excluyeHipoteca:r,pctNecesidades:I,pctDeseos:f,semAhorro:y(A,e,o),semDTI:M(g,s,n),semNecesidades:M(I,i[0],i[0]+15),semDeseos:M(f,i[1],i[1]+10),semAhorroRegla:y(A,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:s,umbralDTIAmarillo:n,regla:i}}function mt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function rt(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Vt(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((n,i)=>{n.fecha>=e&&o.push({...n,prioridad:i})}),o.sort((n,i)=>i.fecha.localeCompare(n.fecha)||i.prioridad-n.prioridad);const s=o.find(n=>n.fecha<=a);return s?s.saldo:t.saldoInicial||0}else{const s=[...t.historicoSaldos||[]].sort((n,i)=>i.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=a);return s?s.saldo:0}}function Ie(t,a){const e=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return e?a.filter(o=>e.includes(o._id)):a.filter(o=>o.activo&&!o.simulacion)}function ca(t,a,e=0){const o=Ie(t,a).reduce((s,n)=>s+rt(n),0);return t.usarColchon!==!1?Math.max(0,o-e):o}function da(t,a,e){if(!t.targetAmount||t.targetAmount<=0)return null;const o=Ie(t,a);if(o.length===0)return null;const s=e.hoy??new Date,n=e.horizonteMeses??120,i=t.usarColchon!==!1,r=o.map(d=>({acc:d,eventos:e.extractoCuenta(d),cursor:0,saldo:rt(d)}));for(let d=1;d<=n;d++){const c=new Date(s.getFullYear(),s.getMonth()+d,1),x=`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}`,p=V(new Date(c.getFullYear(),c.getMonth()+1,0));let u=0;for(const b of r){for(;b.cursor<b.eventos.length&&b.eventos[b.cursor].fecha<=p;)b.saldo=b.eventos[b.cursor].saldoAcum??b.saldo,b.cursor++;u+=b.saldo}const v=i?e.colchonEnFecha(p):0;if(u-v>=t.targetAmount)return x}return null}function ua(t,a){const e=t.escenarioIds||[];return e.length===0?!0:!!a&&e.includes(a)}function pa(t,a){const e=o=>ua(o,a);return{loans:t.loans.filter(e).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}const Ae=t=>t.slice(0,7);function Vo(t){const[a,e]=t.split("-").map(Number);return`${e===12?a+1:a}-${String(e===12?1:e+1).padStart(2,"0")}`}function Me(t,a,e){if(t.length===0)return[];const o=new Map;for(const c of t)c.saldoAcum!==void 0&&o.set(Ae(c.fecha),c.saldoAcum);const s=t[0];let n=(s.saldoAcum??0)-(s.delta??0);const i=Ae(a||s.fecha),r=Ae(e||t[t.length-1].fecha);if(r<i)return[];const d=[];for(let c=i;c<=r;c=Vo(c)){const x=o.get(c);x!==void 0&&(n=x);const[p,u]=c.split("-").map(Number);d.push({x:G(V(new Date(p,u-1,15))).getTime(),mes:c,y:n})}return d}function Se(t,a){let e=null;for(const o of t){if(o.fecha>a)break;o.saldoAcum!==void 0&&(e=o.saldoAcum)}return e}function Uo(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function Yo(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}const gt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ut(t,a){const e=[...a].sort((n,i)=>n[0]-i[0]);let o=0,s=t;for(let n=e.length-1;n>=0;n--){const[i,r]=e[n];s<=i||(o+=(s-i)*(r/100),s=i)}return o}function we(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,s=Math.min(2e3,e),n=Math.max(0,e-o-s),i=n<=15876?7302:n<=21622?Math.max(0,7302-1.75*(n-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:s,RNT:n,reducArt20:i,baseImponible:Math.max(0,n-i)}}function Mt(t,a){return we(t,a).baseImponible}function ma(t,a){return ut(t,a)/12}const jt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Ce(t,a){if(!t||t<=0)return 0;const e=a||jt;let o=0,s=t;for(let n=0;n<e.length;n++){const[i,r]=e[n],d=n<e.length-1?e[n+1][0]:1/0,c=Math.min(s,d-i);if(!(c<=0)&&(o+=c*(r/100),s-=c,s<=0))break}return o}function Dt(t,a){if(mt(t)!=="inversion")return null;const e=rt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,s=Math.max(0,e-o),n=Ce(s,a);return{saldo:e,costBase:o,plusvalia:s,impuesto:n,neto:e-n}}function de(t,a=new Date){var u;if(mt(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=rt(t),s=V(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),n=[...t.aportaciones||[]].sort((v,b)=>v.fecha.localeCompare(b.fecha));let i=0;const r=n.reduce((v,b)=>v+b.cantidad,0);for(const v of n)v.fecha<=s&&(i+=v.cantidad);const d=Math.max(0,o-r),c=r>0?i/r:0,x=Math.min(o,i+d*c),p=Math.max(0,o-x);return{saldo:o,disponible:x,bloqueado:p,costBase:r,beneficio:d,numAportaciones:n.length,proxDesbloqueo:((u=n.find(v=>v.fecha>s))==null?void 0:u.fecha)||null}}function fa(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(mt(t)!=="pension"||!o)return 0;const s=rt(t);if(s<=0)return 0;const n=(t.aportaciones||[]).reduce((c,x)=>c+x.cantidad,0),i=Math.max(0,s-n);if(i<=0)return 0;const r=i/s;return+(a*r*o/100).toFixed(2)}function je(t,a,e){var d;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const n=(a||[]).filter(c=>(c.grupoNomina||"")===o&&c.activo!==!1).reduce((c,x)=>c+(x.bruto||0)*(x.nPagas||12),0),i=[...e||[]].sort((c,x)=>c[0]-x[0]);let r=((d=i[0])==null?void 0:d[1])||19;for(const[c,x]of i)if(n>=c)r=x;else break;return r}const ze=6.35;function zt(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function va(t){return Math.max(0,(t.bruto||0)-zt(t))}function Jo(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function Wo(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+zt(r),0),o=Math.max(0,a-e),s=Mt(a,e),n=new Map;for(const i of t)n.set(i._id,o>0?s*(va(i)/o):0);return n}function Ee(t,a,e){if(t.irpfModo==="manual")return va(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return ut(Mt(t.bruto||0,zt(t)),e);const o=Jo(a.filter(i=>i.irpfModo!=="manual")),s=Wo(a);let n=0;for(const i of o){const r=s.get(i._id)??0;if(i._id===t._id)return ut(n+r,e)-ut(n,e);n+=r}return ut(Mt(t.bruto||0,zt(t)),e)}function Qo(t,a){return t.reduce((e,o)=>e+Ee(o,t,a),0)}function Ko(t,a){var s;const e=[...a||[]].sort((n,i)=>n[0]-i[0]);let o=((s=e[0])==null?void 0:s[1])??19;for(const[n,i]of e)if(t>=n)o=i;else break;return o}function ga(t,a){if(!t||t.length===0)return 0;const e=t.reduce((s,n)=>s+(n.bruto||0),0),o=t.reduce((s,n)=>s+zt(n),0);return Ko(Mt(e,o),a)}function Fe(t,a,e){const o=t.bruto||0,s=zt(t),n=Math.max(0,o-s),i=t.nPagas||12,r=t.ssPct??ze,d=n*(r/100),c=Ee(t,a,e);return{brutoAnual:o,flexAnual:s,baseDineraria:n,nPagas:i,ssPct:r,ssAnual:d,irpfAnual:c,irpfPct:n>0?c/n*100:0,netoPorPaga:(n-d-c)/i}}function Xo(t){const a=new Map,e=[];for(const o of t){const s=o.grupoNomina||"";if(!s){e.push(o);continue}const n=a.get(s)??[];n.push(o),a.set(s,n)}return{grupos:a,sueltas:e}}const Et=1500;function ba(t){const a=t.cuantia||0,e=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?a*12/e:t.tipoFrecuencia==="diaria"?a*365.25/e:a}const Ut=t=>{const a=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(a)?a:0};function Zo(t,a){const e=t.grupoNomina||"";return e?a.filter(o=>(o.grupoNomina||"")===e):null}function ha(t,a){return t.reduce((e,o)=>e+Ee(o,Zo(o,t),a),0)}function ya(t){const{nominas:a,tramosGeneral:e,tramosAhorro:o}=t,s=t.extras??{},n=a.reduce((S,C)=>S+(C.bruto||0),0),i=a.reduce((S,C)=>S+zt(C),0),r=we(n,i),d=t.aportacionesPension,c=Et,x=Math.min(d,c),p=Math.max(0,r.RNT-r.reducArt20-x),u=Ut(s.capInmobiliario),v=Ut(s.capMobiliario),b=Ut(s.gananciasFondos),$=Ut(s.otrasCorto),A=Ut(s.retCapital),m=Math.max(0,p+t.otrosIngresos+u+$),g=Math.max(0,v+b),h=ut(m,e),I=ut(g,o),f=h+I,y=ha(a,e),M=y+A;return{brutoTotal:n,flexTotal:i,brutoIRPF:r.baseIRPF,cotizSS:r.cotizSS,gastosArt19:r.gastosArt19,RNT:r.RNT,reducArt20:r.reducArt20,aportPP:d,limPP:c,deducPP:x,RNTred:p,otrosIngresos:t.otrosIngresos,capInmobiliario:u,capMobiliario:v,gananciasFondos:b,otrasCorto:$,baseGeneral:m,baseAhorro:g,cuotaGen:h,cuotaAho:I,cuotaIntegra:f,retNomina:y,retCapital:A,totalRet:M,resultado:f-M}}const ts=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:Et,TRAMOS_AHORRO_DEFAULT:jt,TRAMOS_IRPF_DEFAULT:gt,ajustarFechaPago:ea,ajustarPrecioReal:Ho,calcBaseImponibleTrabajo:Mt,calcFactorInflacion:pt,calcFondoInversion:Dt,calcFondosPension:de,calcGananciasCapital:Ce,calcIRPF:ut,calcImpuestoPension:fa,calcInflacionMediaAnual:ra,calcSaludFinanciera:Go,calcTAE:oa,calcTipoMarginalPension:je,calcTipoRealFisher:la,calcularDeclaracion:ya,clampedDate:ta,cuentasDelObjetivo:Ie,cuotaMensual:Tt,desgloseBaseTrabajo:we,diasEntre:ce,filtrarPorEscenario:pa,formatEUR:z,formatLocalDate:V,formatPct:aa,fromCents:ot,haySimulaciones:Yo,ingresoAnual:ba,labelDiaPago:$e,lastDayOfMonth:xe,modeloFondoDe:mt,parseLocalDate:G,proyectarFechaCumplimiento:da,resolverDiaEfectivo:le,resumenPrestamo:tt,resumenPrestamoConAhorro:ia,retencionMensual:ma,retencionesNomina:ha,roundMoney:st,saldoEnFecha:Vt,saldoEnFechaExtracto:Se,saldoParaObjetivo:ca,saldoRealCuenta:rt,serieMensual:Me,sinSimulaciones:Uo,tablaAmortizacion:sa,toCents:It,todayISO:J,visibleEnEscenario:ua},Symbol.toStringTag,{value:"Module"}));function Yt(t,a,e=null){const o=[],s=G(a.start),n=G(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=G(i.fechaInicio||a.start),d=i.fechaFin?G(i.fechaFin):n,c=i.cuantia,x=p=>o.push({fecha:p,concepto:i.concepto,cuantia:c,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=s&&r<=n&&r<=d&&x(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const p=Math.max(1,i.frecuencia||1);let u=r.getFullYear(),v=r.getMonth();const b=Math.ceil(240/p)+2;for(let $=0;$<b;$++){const A=le(u,v,i.diaPago||"")||(()=>{const g=r.getDate(),h=new Date(u,v+1,0).getDate();return V(new Date(u,v,Math.min(g,h)))})(),m=G(A);if(m>n||m>d)break;m>=s&&m>=r&&x(A),v+=p,v>=12&&(u+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const p=Math.max(1,i.frecuencia||1)*864e5;let u=new Date(Math.max(r.getTime(),s.getTime()));if(r<s){const v=Math.ceil((s.getTime()-r.getTime())/p);u=new Date(r.getTime()+v*p)}for(;u<=n&&u<=d;)x(V(u)),u=new Date(u.getTime()+p)}}return o}function xa(t,a,e=null){const o=[];for(const s of t){if(!s.activo||e&&e.length>0&&!e.includes(s.cuenta||"default"))continue;const{tabla:n}=tt(s);for(const i of n)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${s.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${s.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan",simulacion:s.simulacion||!1}))}return o}function $a(t,a,e=null,o={accounts:[]}){const s=[],n=G(a.start),i=G(a.end),r=o.accounts||[],d=o.nominas||[],c=o.resolverTramosIRPF||(()=>gt),x=o.resolverTramosGanancias||(()=>jt),p=u=>{var v;return((v=r.find(b=>b._id===u))==null?void 0:v.nombre)??u};for(const u of t){if(!u.activo||u.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(u.cuenta||"default")||e.includes(u.cuentaDestino||"default")))continue;const v=G(u.fechaInicio||a.start),b=u.fechaFin?G(u.fechaFin):i,$=A=>{const m=r.find(E=>E._id===(u.cuenta||"default")),g=r.find(E=>E._id===(u.cuentaDestino||"default")),h=mt(m),I=mt(g),f=h==="inversion"&&I==="inversion"||h==="pension"&&I==="pension",y=["transferencia",...f?["traspaso"]:[],...u.tags||[]],M=f?"traspaso-out":"transfer-out",S=f?"traspaso-in":"transfer-in",C=!e||e.length===0||e.includes(u.cuenta||"default"),j=!e||e.length===0||e.includes(u.cuentaDestino||"default");if(C&&s.push({fecha:A,concepto:`Transf. → ${p(u.cuentaDestino||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"gasto",tags:y,cuenta:u.cuenta||"default",sourceId:u._id,sourceType:M}),j&&s.push({fecha:A,concepto:`Transf. ← ${p(u.cuenta||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"ingreso",tags:y,cuenta:u.cuentaDestino||"default",sourceId:u._id,sourceType:S}),C&&!f&&m){if(h==="inversion"){const E=parseInt(A.slice(0,4)),F=Dt(m,x(E));if(F&&F.saldo>0&&F.plusvalia>0){const w=Math.min(1,u.cuantia/F.saldo),T=F.plusvalia*w*.19;T>.01&&s.push({fecha:A,concepto:`Retención IRPF reembolso ${m.nombre} (19% s/plusvalía)`,cuantia:T,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"investment-tax"})}}else if(h==="pension"){const E=c(parseInt(A.slice(0,4))),F=je(m,d,E),w=fa(m,u.cuantia,F||void 0);if(w>0){const P=m.grupoNomina?`IRPF rescate ${m.nombre} (tipo marginal grupo "${m.grupoNomina}": ${F}%)`:`Retención rescate ${m.nombre} (${m.impuestoRetirada}% s/beneficio)`;s.push({fecha:A,concepto:P,cuantia:w,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"pension-tax"})}}}};if(u.tipoFrecuencia==="extraordinario")v>=n&&v<=i&&v<=b&&$(u.fechaInicio);else if(u.tipoFrecuencia==="mensual"){const A=Math.max(1,u.frecuencia||1);let m=v.getFullYear(),g=v.getMonth();const h=Math.ceil(240/A)+2;for(let I=0;I<h;I++){const f=le(m,g,u.diaPago||"")||(()=>{const M=v.getDate(),S=new Date(m,g+1,0).getDate();return V(new Date(m,g,Math.min(M,S)))})(),y=G(f);if(y>i||y>b)break;y>=n&&y>=v&&$(f),g+=A,g>=12&&(m+=Math.floor(g/12),g=g%12)}}else if(u.tipoFrecuencia==="diaria"){const A=Math.max(1,u.frecuencia||1)*864e5;let m=new Date(Math.max(v.getTime(),n.getTime()));if(v<n){const g=Math.ceil((n.getTime()-v.getTime())/A);m=new Date(v.getTime()+g*A)}for(;m<=i&&m<=b;)$(V(m)),m=new Date(m.getTime()+A)}}return s}function Ia(t,a,e=null){const o=[],s=G(a.start),n=G(a.end);for(const i of t){const r=mt(i);if(r==="cuenta"||!i.activo)continue;const d=i.planAportaciones||[];for(const c of d){if(!c.importe||c.importe<=0)continue;const x=G(c.fechaInicio||a.start),p=c.fechaFin?G(c.fechaFin):n,u=c.cuentaOrigen||"default",v=!e||!e.length||e.includes(u),b=!e||!e.length||e.includes(i._id),$=r==="pension"?"pension":"capital-mobiliario",A=f=>{v&&o.push({fecha:f,concepto:`Aportación → ${i.nombre}`,cuantia:c.importe,tipo:"gasto",tags:["aportacion","transferencia",$],cuenta:u,sourceId:c._id,sourceType:"aportacion-out"}),b&&o.push({fecha:f,concepto:`Aportación ${i.nombre} (${c.periodicidad||"mensual"})`,cuantia:c.importe,tipo:"ingreso",tags:["aportacion","transferencia",$],cuenta:i._id,sourceId:c._id,sourceType:"aportacion-in"})},m={mensual:1,trimestral:3,semestral:6,anual:12}[c.periodicidad||"mensual"]||1;let g=x.getFullYear(),h=x.getMonth();const I=Math.ceil(240/m)+2;for(let f=0;f<I;f++){const y=new Date(g,h+1,0).getDate(),M=V(new Date(g,h,Math.min(x.getDate(),y))),S=G(M);if(S>n||S>p)break;S>=s&&S>=x&&A(M),h+=m,h>=12&&(g+=Math.floor(h/12),h=h%12)}}}return o}function Aa(t,a,e=null,o=[]){const s=[];for(const n of t){if(!n.activo||!n.interes||n.interes<=0||e&&e.length>0&&!e.includes(n._id))continue;const i=G(a.start),r=G(a.end),d=n.periodoCobro||"mensual",c=d==="mensual",x=c?null:{diario:864e5,semanal:7*864e5}[d]||864e5,p=c?1/12:x/(365.25*864e5);let u=Vt(n,a.start);const v=o.filter(A=>A.cuenta===n._id).map(A=>({fecha:A.fecha,delta:A.tipo==="ingreso"?Math.abs(A.cuantia):-Math.abs(A.cuantia)})).sort((A,m)=>A.fecha.localeCompare(m.fecha));let b=0,$=new Date(i);for(;$<=r;){const A=c?new Date($.getFullYear(),$.getMonth()+1,$.getDate()):new Date($.getTime()+x),m=new Date(Math.min(A.getTime(),r.getTime()+1)),g=V(m);let h=0;for(;b<v.length&&v[b].fecha<g;)h+=v[b].delta,b++;const I=u,f=u+h,y=Math.max(0,(I+f)/2);u=f;const M=c?p:(m.getTime()-$.getTime())/(365.25*864e5),S=y*(Math.pow(1+n.interes/100,M)-1);S>.001&&s.push({fecha:V($),concepto:`Interés ${n.nombre}`,cuantia:S,tipo:"ingreso",tags:["interes","cuenta"],cuenta:n._id,sourceId:n._id,sourceType:"account-interest"}),$=A}}return s}function Ma(t,a,e,o=null){const s=[],n=a||gt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),d=ma(r,n),c={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:d,tags:["irpf","fiscal"]};s.push(...Yt([c],e,o))}return s}const es=[5,11,2,8],as={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function Sa(t,a,e=null,o=[],s=()=>gt){const n=[],i=G(a.start),r=G(a.end),d=o.length>0,c={};for(const u of t){const v=u.grupoNomina||"";c[v]||(c[v]=[]),c[v].push(u)}for(const u of Object.keys(c))c[u].sort((v,b)=>(b.bruto||0)-(v.bruto||0));function x(u,v){if(!d||!u.mesActualizacionIPC)return u.bruto||0;const b=u.fechaInicio||a.start,$=G(b),A=G(v);let m=0;for(let h=$.getFullYear();h<=A.getFullYear();h++){const I=new Date(h,u.mesActualizacionIPC-1,1);I>$&&I<=A&&m++}if(m===0)return u.bruto||0;const g=V(new Date($.getFullYear()+m,0,1));return(u.bruto||0)*pt(o,b,g)}function p(u,v){const b=x(u,v),$=(u.retribucionFlexible||[]).reduce((E,F)=>E+(F.importe||0)*12,0),A=Math.max(0,b-$);if(u.irpfModo==="manual")return A*((u.irpfPct||0)/100);const m=s(parseInt(v.slice(0,4))),g=u.grupoNomina||"";if(!g)return ut(Mt(b,$),m);const h=c[g].filter(E=>E.activo),I=h.reduce((E,F)=>E+x(F,v),0),f=h.reduce((E,F)=>E+(F.retribucionFlexible||[]).reduce((w,P)=>w+(P.importe||0)*12,0),0),y=Math.max(0,I-f),M=Mt(I,f),S=Math.max(0,b-$),C=y>0?M*(S/y):0,j=h.filter(E=>E._id!==u._id&&(E.bruto||0)>(u.bruto||0)).reduce((E,F)=>{const w=(F.retribucionFlexible||[]).reduce((T,R)=>T+(R.importe||0)*12,0),P=Math.max(0,x(F,v)-w);return E+(y>0?M*(P/y):0)},0);return ut(j+C,m)-ut(j,m)}for(const u of t){if(!u.activo)continue;const v=u.cuenta||"default";if(e&&e.length>0&&!e.includes(v))continue;const b=Math.max(1,u.nPagas||12),$=G(u.fechaInicio||a.start),A=u.fechaFin?G(u.fechaFin):r,m=g=>{const h=x(u,g),I=p(u,g),f=(u.retribucionFlexible||[]).reduce((w,P)=>w+(P.importe||0)*12,0),y=Math.max(0,h-f),M=(u.ssPct??6.35)/100,S=y*M,C=y/b,j=I/b,E=S/b,F=u.representacion==="simplificado"?C-E-j:C;n.push({fecha:g,concepto:u.nombre,cuantia:F,tipo:"ingreso",cuenta:v,tags:u.tags||[],sourceId:u._id,sourceType:"nomina"}),u.representacion==="detallado"&&(E>0&&n.push({fecha:g,concepto:`SS ${u.nombre}`,cuantia:E,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:u._id+"_ss",sourceType:"nomina"}),j>0&&n.push({fecha:g,concepto:`IRPF ${u.nombre}`,cuantia:j,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:u._id+"_irpf",sourceType:"nomina"}));for(const w of u.retribucionFlexible||[])!w.cuenta||!(w.importe>0)||e&&e.length>0&&!e.includes(w.cuenta)||n.push({fecha:g,concepto:`${u.nombre} — ${as[w.tipo]||w.tipo}`,cuantia:w.importe,tipo:"ingreso",cuenta:w.cuenta,tags:["retribucion-flexible",w.tipo],sourceId:`${u._id}_flex_${w._id||w.tipo}`,sourceType:"nomina"})};if(b<=12){const g=b===12?1:Math.round(12/b),h=$.getDate();let I=$.getFullYear(),f=$.getMonth();for(let y=0;y<300;y++){const M=new Date(I,f+1,0).getDate(),S=new Date(I,f,Math.min(h,M));if(S>r||S>A)break;S>=i&&S>=$&&m(V(S)),f+=g,f>=12&&(I+=Math.floor(f/12),f=f%12)}}else{const g=b-12,h=$.getDate();let I=$.getFullYear(),f=$.getMonth();for(let S=0;S<300;S++){const C=new Date(I,f+1,0).getDate(),j=new Date(I,f,Math.min(h,C));if(j>r||j>A)break;j>=i&&j>=$&&m(V(j)),f++,f>=12&&(I++,f=0)}const y=Math.max($.getFullYear(),i.getFullYear()),M=Math.min((u.fechaFin?A:r).getFullYear(),r.getFullYear());for(let S=y;S<=M;S++)for(const C of es.slice(0,g)){const j=new Date(S,C,15);j>=i&&j<=r&&j>=$&&j<=A&&m(V(j))}}}return n}function wa(t,a,e,o=null,s="default"){const n=[];if(!a||a.length===0)return n;const i=G(e.start),r=G(e.end),d=J(),c=t.filter(p=>p.activo&&p.tipo==="gasto"&&p.tipoFrecuencia==="mensual");let x=new Date(i.getFullYear(),i.getMonth(),1);for(;x<=r;){const p=x.getFullYear(),u=x.getMonth(),v=p+"-"+String(u+1).padStart(2,"0"),b=v+"-01",$=V(new Date(p,u+1,0)),A=V(new Date(p,u,15));let m=0;for(const g of c){if(o&&o.length>0&&!o.includes(g.cuenta||"default")||g.fechaInicio&&g.fechaInicio>$||g.fechaFin&&g.fechaFin<b)continue;const h=g.fechaInicio||d,I=pt(a,h,A);if(I<=1)continue;const f=Math.max(1,g.frecuencia||1);m+=g.cuantia*(I-1)/f}m>.01&&n.push({fecha:A,concepto:"Incremento coste de vida",cuantia:m,tipo:"gasto",tags:["inflacion"],cuenta:s,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),x=new Date(p,u+1,1)}return n}function Ca(t,a,e,o="default"){const s=[];if(!a||a.length===0||t<=0)return s;const n=G(e.start),i=G(e.end),r=[...a].sort((c,x)=>c.year-x.year);let d=new Date(n.getFullYear(),n.getMonth(),1);for(;d<=i;){const c=d.getFullYear(),x=d.getMonth(),p=c+"-"+String(x+1).padStart(2,"0"),u=V(new Date(c,x,15)),v=r.filter(g=>g.year<=c),b=v.length>0?v[v.length-1]:r[0],$=b?b.tasa/100:0,A=Math.pow(1+$,1/12)-1,m=t*A;m>.01&&s.push({fecha:u,concepto:"Pérdida ahorro por inflación",cuantia:m,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+p,sourceType:"inflacion"}),d=new Date(c,x+1,1)}return s}function ja(t,a,e){const o=e.fechaReferencia||e.dashboardStart,s=o<e.dashboardStart?e.dashboardStart:o>e.dashboardEnd?e.dashboardEnd:o,n=a.reduce((p,u)=>p+Vt(u,s),0),i=t.filter(p=>p.fecha<s),r=t.filter(p=>p.fecha>=s),d=[];let c=n;for(const p of[...i].reverse()){const u=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);d.unshift({...p,delta:u,saldoAcum:c}),c-=u}const x=[];c=n;for(const p of r){const u=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);c+=u,x.push({...p,delta:u,saldoAcum:c})}return[...d,...x]}function os(t,a,e,o=null){const s=a.filter(n=>n.activo&&(!o||o.length===0||o.includes(n._id)));return ja([...t].sort((n,i)=>n.fecha.localeCompare(i.fecha)),s,e)}function Jt(t){const{loans:a,expenses:e,accounts:o,config:s}=t,n=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],d={start:s.dashboardStart,end:s.dashboardEnd},c=e.filter($=>$.tipo!=="transferencia"),x=e.filter($=>$.tipo==="transferencia"),p={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let u=[];u=u.concat(Yt(c,d,n)),u=u.concat(xa(a,d,n)),u=u.concat($a(x,d,n,p)),u=u.concat(Ia(o,d,n));const v=Aa(o,d,n,u);if(u=u.concat(v),u=u.concat(Ma(e,s.tramos_irpf,d,n)),u=u.concat(Sa(i,d,n,r,t.resolverTramosIRPF)),s.usarInflacion&&r.length>0){const $=(o.find(g=>g.activo&&g.esCuentaPrincipal)||o.find(g=>g.activo)||{_id:"default"})._id;u=u.concat(wa(c,r,d,n,$));const m=o.filter(g=>g.activo&&(!n||n.length===0||n.includes(g._id))).reduce((g,h)=>g+Vt(h,s.dashboardStart),0);u=u.concat(Ca(m,r,d,$))}u.sort(($,A)=>$.fecha.localeCompare(A.fecha));const b=o.filter($=>$.activo&&(!n||n.length===0||n.includes($._id)));return ja(u,b,s)}function ss(t,a,e=null){const o=J(),n=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,d)=>r+rt(d),0),i=t.filter(r=>r.fecha<=o);return i.length===0?n:i[i.length-1].saldoAcum}function za(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const s of o.tags||["sin_tag"])e.set(s,(e.get(s)||0)+Math.abs(o.cuantia));return e}function ns(t,a){const e=[];let o=!1;for(let s=0;s<t.length;s++){const n=t[s],i=n.saldoAcum;i<0&&(s===0||t[s-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:n.fecha,saldo:i,mensaje:`Saldo negativo (${z(i)}) a partir del ${n.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:n.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${z(i)} < ${z(a)}) desde ${n.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:n.fecha,saldo:i,mensaje:`Recuperación del colchón el ${n.fecha} (${z(i)})`})))}return e}function is(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=G(a.dashboardStart),s=G(a.dashboardEnd),n=Math.max(1,(s.getTime()-o.getTime())/(30.44*864e5));return e/n}function rs(t,a,e=J()){const o=new Set,s=a.map(r=>{const d=r.fechaInicialSaldo||"",c={};d&&d<=e&&(c[d]=r.saldoInicial||0);for(const x of r.historicoSaldos||[])x.fecha<=e&&(!d||x.fecha>=d)&&(c[x.fecha]=x.saldo);return Object.keys(c).forEach(x=>o.add(x)),c}),n={};for(const r of[...o].sort()){let d=0;for(let c=0;c<a.length;c++){const x=Object.entries(s[c]).filter(([p])=>p<=r);x.length>0?(x.sort(([p],[u])=>u.localeCompare(p)),d+=x[0][1]):d+=a[c].saldoInicial||0}n[r]=d}const i=[];for(const[r,d]of Object.entries(n).sort(([c],[x])=>c.localeCompare(x))){const c=t.filter(v=>v.fecha<=r),x=c.length>0?c[c.length-1].saldoAcum:null;if(x===null)continue;const p=d-x,u=x!==0?p/Math.abs(x)*100:0;i.push({cuenta:"Total",fecha:r,estimado:x,real:d,desv:p,pct:u})}return i}const ls=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:rs,detectarPuntosCriticos:ns,mediaMensualGastos:is},Symbol.toStringTag,{value:"Module"}));function Wt(t,a=new Date){const e=V(a),o=new Date(a);o.setMonth(o.getMonth()+1);const s=V(o),n=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Yt(n,{start:e,end:s}).reduce((r,d)=>r+Math.abs(d.cuantia),0)}function _e(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+Tt(e.capital,e.tin,e.meses),0)}function Ea(t,a,e,o){return a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0?a.colchonFijo:(Wt(t,o)+_e(e))*(a.colchonMeses||6)}function Fa(t,a,e,o,s){const i=[...a.colchonPuntos||[]].sort((d,c)=>d.fecha.localeCompare(c.fecha)).filter(d=>d.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(Wt(t,s)+_e(e))*(i.meses||6):Ea(t,a,e,s)}function ue(t,a,e,o,s,n=!1,i){const r=[...t.puntos||[]].sort((x,p)=>x.fecha.localeCompare(p.fecha)),d=r.filter(x=>x.fecha<=s).pop()||(n?r[0]:null);return d?d.tipo==="fijo"?d.importe||0:(Wt(a,i)+_e(o))*(d.meses||1):0}function cs(t,a){const e={};for(const o of a)e[o._id]=rt(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=o.cuantia),{fecha:o.fecha,saldos:{...e}}))}function ds(t,a,e,o,s,n,i){const r=[];for(const d of(t||[]).filter(c=>c.activo!==!1)){let c=!1;for(let x=0;x<a.length;x++){const p=a[x],u=ue(d,o,s,n,p.fecha,!1,i);if(u<=0){c=!1;continue}const v=!d.cuentas||d.cuentas.length===0?p.saldoAcum:d.cuentas.reduce((b,$)=>{var A,m;return b+(((m=(A=e[x])==null?void 0:A.saldos)==null?void 0:m[$])||0)},0);v<u&&!c?(c=!0,r.push({tipo:"bajo_margen",fecha:p.fecha,saldo:v,target:u,nombre:d.nombre,mensaje:`⚠ ${d.nombre}: ${z(v)} < ${z(u)} desde ${p.fecha}`})):v>=u&&c&&(c=!1,r.push({tipo:"recuperacion_margen",fecha:p.fecha,saldo:v,target:u,nombre:d.nombre,mensaje:`✓ ${d.nombre}: recuperado el ${p.fecha}`}))}}return r}const us=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Ea,calcColchonEnFecha:Fa,calcGastoBasicoMensual:Wt,calcMargenEnFecha:ue,detectarCrucesMargenes:ds,saldosPorCuentaEnExtracto:cs},Symbol.toStringTag,{value:"Module"}));class ps extends Error{constructor(e,o){super(`La funcionalidad "${e}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);Lo(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=e}}let Qt=null;function ms(t){const a=Qt;return Qt=t,()=>{Qt=a}}function _a(t){return Qt?Qt(t):!0}function Pa(t,a){if(!_a(t))throw new ps(t,a)}const Ta=[];function Pe(){const t=new Map,a=new WeakMap;let e=1,o=0,s=0;const n=d=>{if(!d||typeof d!="object")return 0;const c=a.get(d);if(c)return c;const x=e++;return a.set(d,x),x},i=d=>d.map(c=>[c._id,c.capital,c.tin,c.meses,c.fechaInicio,c.comisionAmort||0,c.comisionApertura||0,c.diaPago||"",c.activo?1:0,c.cuenta||"",(c.amortizaciones||[]).map(x=>`${x.fecha}:${x.cantidad}:${x.tipo||""}`).sort().join(",")].join("|")).join(";");function r(d){const c=[i(d.loans),n(d.expenses),n(d.accounts),n(d.nominas),n(d.inflacionPeriodos),d.config.dashboardStart,d.config.dashboardEnd,d.config.fechaReferencia||"",d.config.usarInflacion?1:0,(d.filtroAccounts||[]).join(",")].join("#"),x=t.get(c);if(x)return s++,x;o++;const p=Jt(d);return t.set(c,p),p}return{statement:r,stats:()=>({hits:s,misses:o}),clear:()=>t.clear()}}function Te(t,a,e,o,s={},n=Pe()){Pa("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:r=36,minAmortizable:d=500,tipoAmort:c="plazo",fechaPrimeraAmort:x=null,loanIds:p=null,nominas:u=Ta,sourceAccountId:v=null,selectedMarginIds:b=null,hoy:$=new Date}=s,A=V($),m=Math.min(120,Math.max(1,r)),g=e.filter(O=>O.activo),h=g.map(O=>O._id),I=g.find(O=>O.esCuentaPrincipal)||g[0],f=v&&h.includes(v)?g.find(O=>O._id===v):I,y=f==null?void 0:f._id,M=t.filter(O=>O.activo&&!O.simulacion&&(!p||p.includes(O._id))).sort((O,H)=>H.tin-O.tin),S=!!b&&b.length>0,C=(o.margenesSeguridad||[]).filter(O=>O.activo!==!1).filter(O=>!O.cuentas||O.cuentas.length===0||O.cuentas.includes(y)).filter(O=>!S||b.includes(O._id));if(M.length===0)return{plan:[],margenesAplicados:C.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const j={};for(const O of M)j[O._id]=[];const E=[];function F(O){const H=new Date($.getFullYear(),$.getMonth()+O,1),U=H.getFullYear(),W=H.getMonth(),Q=`${U}-${String(W+1).padStart(2,"0")}`,at=V(new Date(U,W,Math.min(15,new Date(U,W+1,0).getDate())));return{label:Q,dia15:at}}function w(O,H){const U=[...O.amortizaciones||[],...j[O._id]],{tabla:W}=tt({...O,amortizaciones:U}),Q=W.filter(nt=>nt.fecha<=H);if(Q.length>0)return Q[Q.length-1].capitalPendiente;const at=U.filter(nt=>nt.fecha<=H).reduce((nt,vt)=>nt+vt.cantidad,0);return Math.max(0,O.capital-at)}function P(O){const H=t.map(it=>({...it,amortizaciones:[...it.amortizaciones||[],...j[it._id]||[]]})),U={...o,dashboardStart:A,dashboardEnd:O},W=n.statement({loans:H,expenses:a,accounts:e,config:U,filtroAccounts:null,nominas:u}),Q=g.reduce((it,Gt)=>it+rt(Gt),0),at=f?rt(f):0,nt=Q>0?at/Q:1;let vt=at,ie=Q;for(const it of W){const Gt=it.delta??(it.tipo==="ingreso"?Math.abs(it.cuantia):-Math.abs(it.cuantia));it.cuenta===y?vt+=Gt:h.includes(it.cuenta)||(vt+=Gt*nt),ie=it.saldoAcum}return{source:vt,total:ie}}function T(O){const{source:H}=P(O);if(H<=0)return H;let U=0;for(const W of C){const Q=ue(W,a,o,t,O,!0,$);Q>U&&(U=Q)}return H-U}const R=2;let N=0;if(x){for(let O=0;O<m;O++)if(F(O).dia15>=x){N=O;break}}for(let O=0;O<m;O++){if((O-N)%i!==0||O<N)continue;const{label:H,dia15:U}=F(O);if(U<A)continue;const W=T(U)-R;if(W<d)continue;let Q=W,at=0;for(const nt of M){if(Q<d)break;const vt=w(nt,U);if(vt<1)continue;const ie=nt.comisionAmort||0,it=1+ie/100,Gt=Math.floor(Q/it),No=Math.min(Gt,vt);if(No<d)continue;const re=Math.min(Math.floor(No),Math.floor(vt)),qo=+(re*ie/100).toFixed(2),Ze=re+qo;Ze>Q||(j[nt._id].push({_id:`opt_${H}_${nt._id}`,fecha:U,cantidad:re,tipo:c,simulacion:!0}),at+=Ze,E.push({mes:H,fechaAmort:U,loanId:nt._id,loanNombre:nt.nombre,tin:nt.tin,capitalAntes:vt,cantidadAmort:re,comision:qo,capitalDespues:Math.max(0,vt-re),saldoDisponible:W+R,excedente:W,saldoDespues:W+R-at,tipoAmort:c}),Q-=Ze)}}const _=E.reduce((O,H)=>O+H.cantidadAmort,0),k=E.reduce((O,H)=>O+H.comision,0),L=M.map(O=>{const H=j[O._id];if(!H.length)return null;const U=tt(O),W=tt({...O,amortizaciones:[...O.amortizaciones||[],...H]});return{loanId:O._id,nombre:O.nombre,tin:O.tin,fechaFinSin:U.fechaFin,fechaFinCon:W.fechaFin,mesesAhorrados:U.mesesReales-W.mesesReales,interesesSin:U.totalIntereses,interesesCon:W.totalIntereses,ahorroIntereses:U.totalIntereses-W.totalIntereses,numAmortizaciones:H.length,totalAmortizado:H.reduce((Q,at)=>Q+at.cantidad,0)}}).filter(O=>O!==null),B=L.reduce((O,H)=>O+H.ahorroIntereses,0);return{plan:E,margenesAplicados:C.length,totalAmortizado:_,totalComisiones:k,totalAhorroIntereses:B,resumenPorLoan:L}}function Da(t,a,e,o,s={},n){Pa("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:r=500,tipoAmort:d="plazo",fechaObjetivo:c=null,frecuencias:x=[1,2,3,6,12],fechaPrimeraAmort:p=null,loanIds:u=null,nominas:v=Ta,sourceAccountId:b=null,selectedMarginIds:$=null,hoy:A=new Date}=s,m=n??Pe(),g=V(A),h=c||V(new Date(A.getFullYear(),A.getMonth()+i,1));function I(M){const S=t.map(F=>({...F,amortizaciones:[...F.amortizaciones||[],...M[F._id]||[]]})),C={...o,dashboardStart:g,dashboardEnd:h},j=m.statement({loans:S,expenses:a,accounts:e,config:C,filtroAccounts:null,nominas:v});if(j.length===0)return e.filter(F=>F.activo).reduce((F,w)=>F+rt(w),0);const E=j.filter(F=>F.fecha<=h);return E.length>0?E[E.length-1].saldoAcum:j[0].saldoAcum}const f=I({}),y=x.map(M=>{const S=Te(t,a,e,o,{frecuencia:M,mesesHorizonte:i,minAmortizable:r,tipoAmort:d,fechaPrimeraAmort:p,loanIds:u,nominas:v,sourceAccountId:b,selectedMarginIds:$,hoy:A},m),C={};for(const E of t)C[E._id]=[];for(const E of S.plan)C[E.loanId].push({_id:E.mes+"_"+E.loanId,fecha:E.fechaAmort,cantidad:E.cantidadAmort,tipo:d,simulacion:!0});const j=I(C);return{frecuencia:M,label:M===1?"Mensual":`Cada ${M} meses`,numAmortizaciones:S.plan.length,totalAmortizado:S.totalAmortizado,totalComisiones:S.totalComisiones,ahorroIntereses:S.totalAhorroIntereses,saldoObjetivo:j,gananciaSaldo:j-f,valorTotal:S.totalAhorroIntereses+(j-f),plan:S.plan,resumenPorLoan:S.resumenPorLoan}}).filter(M=>M.numAmortizaciones>0);if(y.length>0){const M=Math.max(...y.map(j=>j.ahorroIntereses)),S=Math.max(...y.map(j=>j.saldoObjetivo)),C=Math.max(...y.map(j=>j.valorTotal));y.forEach(j=>{j.esMejorIntereses=j.ahorroIntereses===M,j.esMejorSaldo=j.saldoObjetivo===S,j.esMejorValor=j.valorTotal===C})}return{resultados:y,saldoBase:f,fechaObjetivo:h}}const fs=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:Da,createStatementMemo:Pe,defaultHoyISO:J,optimizarAmortizaciones:Te},Symbol.toStringTag,{value:"Module"})),vs=30.44*864e5;function Ra(t){const a=t.getFullYear(),e=t.getMonth();return{desde:V(new Date(a,e,1)),hasta:V(new Date(a,e,xe(a,e)))}}function Oa(t){const[a,e]=t.split("-").map(Number);return Ra(new Date(a,e-1,1))}function gs(t,a){return Math.max(1,(G(a).getTime()-G(t).getTime())/vs)}const bs=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),St=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function hs(t,a){const e=new Map(a.map(n=>[n._id,n.clasificacion]));let o=0,s=0;for(const n of t){if(n.tipo!=="gasto"||n.sourceType!=="expense")continue;const i=e.get(n.sourceId??"");i!==null&&(i==="deseo"?s+=Math.abs(n.cuantia):o+=Math.abs(n.cuantia))}return{basicos:o,deseo:s}}function ys(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=u=>u.sourceType==="loan"&&u.tipo==="gasto",s=a.loanIdsIniciados,n=St(t.filter(u=>u.tipo==="ingreso")),i=St(t.filter(u=>o(u)&&(!s||s.has(u.sourceId??"")))),r=St(t.filter(u=>o(u)&&a.hipotecaIds.has(u.sourceId??""))),d=St(t.filter(u=>u.sourceType==="loan-amort")),c=St(t.filter(u=>u.sourceType==="account-interest")),{basicos:x,deseo:p}=hs(t,a.expenses);return{ingresos:n/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:d/e,gastosBasicos:x/e,gastosDeseo:p/e,gastosTotales:(i+x+p)/e,intereses:c/e}}function Na(t,a){return t.reduce((e,o)=>{const s=tt(o).tabla.filter(n=>!n.esAmortizacion&&n.fecha<=a);return e+(s.length>0?s[s.length-1].capitalPendiente:o.capital||0)},0)}function xs(t,a,e,o){const s=t.filter(c=>c.activo&&!c.simulacion&&(c.fechaInicio||"")<=e),n=s.reduce((c,x)=>{if((x.amortizaciones||[]).filter(b=>b.fecha>=a&&b.fecha<=e).length===0)return c;const u=tt(x).totalIntereses,v=tt({...x,amortizaciones:(x.amortizaciones||[]).filter(b=>b.fecha<a||b.fecha>e)}).totalIntereses;return c+Math.max(0,v-u)},0),i=s.filter(c=>c.mostrarFechaFinEnDashboard!==!1).map(c=>({loan:c,fechaFin:tt(c).fechaFin})).filter(c=>!!c.fechaFin&&c.fechaFin>=a&&c.fechaFin<=e),r=s.map(c=>tt(c).tabla),d=c=>{const{desde:x,hasta:p}=Oa(c);return r.reduce((u,v)=>{const b=v.find($=>!$.esAmortizacion&&$.fecha>=x&&$.fecha<=p);return u+(b?b.cuota:0)},0)};return{deudaInicio:Na(s,a),deudaFin:Na(s,e),ahorroIntereses:n,ahorroInteresesMes:o>0?n/o:0,cuotasInicio:d(a.slice(0,7)),cuotasFin:d(e.slice(0,7)),finEnPeriodo:i}}function $s(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:St(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function qa(t,a=new Set,e="desglosado"){if(a.size===0)return za(t,"gasto");const o=new Map;for(const s of t){if(s.tipo!=="gasto")continue;const n=s.tags||[],i=n.filter(c=>a.has(c)),r=n.filter(c=>!a.has(c)),d=e==="porgrupos"&&i.length>0?i:r;for(const c of d)o.set(c,(o.get(c)||0)+Math.abs(s.cuantia))}return o}function Is(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...qa(t,a.grupoTags,a.modo).entries()].filter(([s])=>!e||e.size===0||e.has(s)).map(([s,n])=>({tag:s,total:n/o})).sort((s,n)=>n.total-s.total)}function As(t,a){const e=a.reduce((o,s)=>o+rt(s),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:St(t.filter(o=>o.tipo==="gasto")),totalIngresos:St(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Ms(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function Ss(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function ws(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function Cs(t,a){if(t.length===0)return[];const e=c=>a==="mes"?c.slice(0,7):c.slice(0,4),o=c=>a==="mes"?`${c}-01`:`${c}-01-01`,s=t[0],n=s.delta??(s.tipo==="ingreso"?Math.abs(s.cuantia):-Math.abs(s.cuantia));let i=(s.saldoAcum??0)-n;const r=[];let d=null;for(const c of t){const x=e(c.fecha),p=c.saldoAcum??i;(!d||d.periodo!==x)&&(d&&(i=d.cierre),d={periodo:x,inicio:o(x),apertura:i,cierre:p,maximo:Math.max(i,p),minimo:Math.min(i,p),eventos:0},r.push(d)),d.cierre=p,p>d.maximo&&(d.maximo=p),p<d.minimo&&(d.minimo=p),d.eventos+=1}return r}const js=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Cs,cuentasVisibles:Ms,gastoPorTagOrdenado:Is,idsHipoteca:Ss,idsPrestamosIniciados:ws,interesesPorCuenta:$s,mesesDelPeriodo:gs,metricasFlujo:ys,rangoMes:Oa,rangoMesDe:Ra,resumenPrestamosPeriodo:xs,sinTransferencias:bs,sumarGastosPorTag:qa,totalesPeriodo:As},Symbol.toStringTag,{value:"Module"}));function zs(t,a,e){const o=t||[];if(!o.length)return a;const s=o.find(i=>i.año===e);if(s)return s.tramos;const n=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return n.length?n[0].tramos:a}function bt(t,a){return e=>zs(t,a,e)}const Kt=8,La=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],ka=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function De(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}function Ba(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:La,tramosGananciasCapital:ka,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function Es(t,a){return{loans:[],expenses:[],accounts:[De(t)],nominas:[],goals:[],planes:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],config:Ba(t,a)}}const ht=t=>Array.isArray(t)?t:[],Fs=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Xt(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function Ha(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function Re(t){const{varianza:a,inflacion:e,...o}=t;return o}function _s(t,a){const{hoyISO:e,finISO:o}=a,s={...t},n=Fs(t.config),r={...Ba(e,o)};for(const[x,p]of Object.entries(n))p!=null&&(r[x]=p);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=La),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=ka),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),s.config=r;let d=ht(t.accounts).map(x=>{const p={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...x};return p.modeloFondo||(p.modeloFondo=p.esFondoPension?"pension":"cuenta"),delete p.esFondoPension,Array.isArray(p.historicoSaldos)||(p.historicoSaldos=[]),Xt(p)});d.length===0&&(d=[De(e)]);const c=d.filter(x=>x.esCuentaPrincipal);if(c.length===0){const x=d.find(p=>p._id==="default")||d[0];d=d.map(p=>({...p,esCuentaPrincipal:p._id===x._id}))}else if(c.length>1){let x=!1;d=d.map(p=>p.esCuentaPrincipal?x?{...p,esCuentaPrincipal:!1}:(x=!0,p):p)}return s.accounts=d,s.expenses=ht(t.expenses).map(x=>{const p={basico:!1,activo:!0,tags:[],historialPrecios:[],...x};return Array.isArray(p.tags)||(p.tags=[]),Array.isArray(p.historialPrecios)||(p.historialPrecios=[]),p.diaPago=Ha(p.diaPago),Re(Xt(p))}),s.loans=ht(t.loans).map(x=>{const p={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...x};return Array.isArray(p.tags)||(p.tags=[]),p.diaPago=Ha(p.diaPago),p.amortizaciones=ht(p.amortizaciones).map(u=>Xt(u)),Re(Xt(p))}),s.nominas=ht(t.nominas).map(x=>{const p={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...x};return Array.isArray(p.tags)||(p.tags=[]),Array.isArray(p.retribucionFlexible)||(p.retribucionFlexible=[]),Re(Xt(p))}),s.goals=ht(t.goals).map((x,p)=>{const u=Array.isArray(x.cuentaIds)?x.cuentaIds:x.cuentaId?[x.cuentaId]:[],{cuentaId:v,...b}=x;return{prioridad:p+1,completado:!1,usarColchon:!0,targetAmount:0,...b,cuentaIds:u}}),s.inflacion=ht(t.inflacion),s.tramosIRPFHistorico=ht(t.tramosIRPFHistorico),s.tramosGananciasCapitalHistorico=ht(t.tramosGananciasCapitalHistorico),s.escenarios=ht(t.escenarios).map(({inversiones:x,...p})=>p),s}const Rt=t=>Array.isArray(t)?t:[];let Oe=0;function Ps(t){return Oe+=1,`${t}_${Oe.toString(36)}`}const Ts=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Ds=t=>typeof t=="number"&&Number.isFinite(t);function Rs(t,a){const e={...t};Oe=0;const o=Rt(t.transacciones),s=Rt(t.puntosControl),n=[...s],i=new Set(s.map(c=>`${c.cuentaId}|${c.fecha}`)),r=(c,x,p,u)=>{if(!Ts(x)||!Ds(p))return;const v=`${c}|${x}`;i.has(v)||(i.add(v),n.push({_id:Ps("pc"),fecha:x,cuentaId:c,saldoCts:It(p),...typeof u=="string"&&u?{nota:u}:{}}))};for(const c of Rt(t.accounts)){const x=typeof c._id=="string"?c._id:null;if(x)for(const p of Rt(c.historicoSaldos))r(x,p.fecha,p.saldo,p.nota)}const d=Rt(t.history);if(d.length>0){const c=Rt(t.accounts),x=c.find(u=>u.esCuentaPrincipal)||c.find(u=>u.activo)||c[0],p=typeof(x==null?void 0:x._id)=="string"?x._id:"default";for(const u of d){const v=typeof u.cuenta=="string"?u.cuenta:typeof u.cuentaId=="string"?u.cuentaId:p;r(v,u.fecha,u.saldo,u.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=n.sort((c,x)=>String(c.fecha).localeCompare(String(x.fecha))),e}const Ne=t=>Array.isArray(t)?t:[],Os=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Ns=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let qe=0;function qs(){return qe+=1,`tx_hp_${qe.toString(36)}`}function Ls(t,a){const e={...t};qe=0;const o=[...Ne(t.transacciones)],s=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),n=Ne(t.expenses).map(i=>{const r=Ne(i.historialPrecios),d=typeof i._id=="string"?i._id:null,c=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",x=i.tipo==="ingreso"?"ingreso":"gasto",p=Array.isArray(i.tags)?i.tags.filter(b=>typeof b=="string"):[];if(d)for(const b of r){if(!b||!Os(b.fecha)||!Ns(b.cuantia))continue;const $=x==="ingreso"?It(b.cuantia):-It(b.cuantia),A=`${d}|${b.fecha}|${$}`;s.has(A)||(s.add(A),o.push({_id:qs(),fecha:b.fecha,cuentaId:c,importeCts:$,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:p,estimacionId:d,tipo:x,origen:"importado",nota:typeof b.nota=="string"&&b.nota?b.nota:"Importado del historial de precios"}))}const{historialPrecios:u,...v}=i;return v});return e.expenses=n,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const Ga=t=>Array.isArray(t)?t:[],wt=(t,a="")=>typeof t=="string"&&t.trim()?t:a,Ot=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,ks=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function Bs(t,a){var x;const e={...t};if(Array.isArray(e.planes))return e;const o=Ga(e.goals),s=Ga(e.accounts),n=s.map(p=>{const u=Ot(p.bloqueoMeses,0);return{_id:`veh_${wt(p._id,"x")}`,nombre:wt(p.nombre,"Cuenta"),rentabilidadRealAnual:Ot(p.interes,0)/100,liquidez:p.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":u>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Ot(p.impuestoRetirada,0)/100,topeAportacionAnual:p.modeloFondo==="pension"?It(1500):null,riesgo:p.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:wt(p._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Ot(p.interes,0)>0}}),i=new Map(s.map((p,u)=>[wt(p._id,""),n[u]._id])),r=((x=n[0])==null?void 0:x._id)??"",d=o.map((p,u)=>{const v=Array.isArray(p.cuentaIds)?p.cuentaIds.map($=>wt($,"")):[],b=ks(p.targetDate);return{_id:wt(p._id,`obj_mig_${u}`),nombre:wt(p.nombre,`Objetivo ${u+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:It(Ot(p.targetAmount,0)),fechaLimite:b,prioridad:Ot(p.prioridad,u+1),modoAsignacion:b?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:p.completado===!0?"COMPLETADO":"PENDIENTE",notas:wt(p.notas,"")}}),c={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:n,objetivos:d,eventos:[],creadoEn:a.hoyISO};return e.planes=[c],e}const Hs=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:_s},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Rs},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:Ls},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:Bs}],Gs=["history"];function Va(t,a,e){let o=t;const s=[];for(const n of[...Hs].sort((i,r)=>i.version-r.version))(a??0)>=n.version||(o=n.migrate(o,e),s.push(n.version));return{state:o,applied:s}}const pe="state_",Le="state__schemaVersion",Ua="financeapp_",Ya="state__modificadoEn";function Vs(t=localStorage,a=Ua){const e=o=>`${a}${o}`;return{get(o){try{const s=t.getItem(e(o));return s===null?null:JSON.parse(s)}catch{return null}},set(o,s){try{t.setItem(e(o),JSON.stringify(s)),o!==Ya&&t.setItem(e(Ya),JSON.stringify(Date.now()))}catch(n){console.error("No se pudo guardar en localStorage:",o,n)}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(a)&&o.push(n.slice(a.length))}return o}}}function Us(t=localStorage,a=Ua){const e=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(pe)&&!n.startsWith(a)&&e.push(n)}const o=[];for(const s of e)try{const n=t.getItem(s);n!==null&&t.getItem(`${a}${s}`)===null&&(t.setItem(`${a}${s}`,n),o.push(s)),t.removeItem(s)}catch{}return o}function Ys(t){return V(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function Js({adapter:t,hoy:a=new Date}){const e=V(a),o=Ys(a);let s=Es(e,o);const n=new Set;let i=[];function r(C){for(const j of n)j(C)}function d(C){t.set(`${pe}${C}`,s[C])}function c(){const C={};for(const w of Object.keys(s)){const P=t.get(`${pe}${w}`);P!==null&&(C[w]=P)}for(const w of Gs){const P=t.get(`${pe}${w}`);P!==null&&(C[w]=P)}const j=t.get(Le),{state:E,applied:F}=Va(C,j,{hoyISO:e,finISO:o});if(s=E,x(),F.length>0){for(const w of Object.keys(s))d(w);t.set(Le,Kt)}return i=F,{applied:F}}function x(){if(!Array.isArray(s.accounts)||s.accounts.length===0){s.accounts=[De(e)],d("accounts");return}const C=s.accounts.filter(j=>j.esCuentaPrincipal);if(C.length===0)s.accounts=s.accounts.map((j,E)=>E===0?{...j,esCuentaPrincipal:!0}:j),d("accounts");else if(C.length>1){let j=!1;s.accounts=s.accounts.map(E=>E.esCuentaPrincipal?j?{...E,esCuentaPrincipal:!1}:(j=!0,E):E),d("accounts")}}function p(C){return s[C]}function u(C,j){s[C]=j,d(C),r(C)}function v(C){u("config",{...s.config,...C})}function b(C){return n.add(C),()=>n.delete(C)}function $(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function A(C,j){const E=[...s[C]],F={...j,_id:$()};return E.push(F),u(C,E),F}function m(C,j,E){const F=s[C].map(w=>w._id===j?{...w,...E}:w);u(C,F)}function g(C,j){const E=s[C].filter(F=>F._id!==j);u(C,E)}function h(){const C=s.accounts||[],j=C.find(E=>E.esCuentaPrincipal&&E.activo)||C.find(E=>E.activo);return j?j._id:"default"}function I(C){var j;return((j=s.accounts.find(E=>E._id===C))==null?void 0:j.nombre)??C}function f(){return bt(s.tramosIRPFHistorico,s.config.tramos_irpf)}function y(){return bt(s.tramosGananciasCapitalHistorico,s.config.tramosGananciasCapital)}function M(){return structuredClone(s)}function S(C,j=null){const{state:E,applied:F}=Va(C,j,{hoyISO:e,finISO:o});s=E,x();for(const w of Object.keys(s))d(w);t.set(Le,Kt);for(const w of Object.keys(s))r(w);return{applied:F}}return{load:c,get:p,set:u,patchConfig:v,subscribe:b,addItem:A,updateItem:m,removeItem:g,getPrincipalAccountId:h,accountName:I,resolverTramosIRPF:f,resolverTramosGanancias:y,snapshot:M,replaceAll:S,get schemaVersion(){return Kt},get migrationsApplied(){return[...i]},get today(){return e||J()}}}const K={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},Ct=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:K.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:K.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:K.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:K.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:K.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro",descripcion:"Metas con importe y fecha, con proyección de cumplimiento.",grupo:K.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:K.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:K.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:K.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:K.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:K.planificacion,porDefecto:!1},{id:"planner",nombre:"Objetivos financieros",descripcion:"Plan a largo plazo: objetivos que compiten por el flujo mensual y se encadenan al completarse.",grupo:K.planificacion,porDefecto:!0},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:K.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:K.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:K.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:K.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:K.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:K.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:K.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:K.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:K.datos,porDefecto:!1,dependencias:["sync-nube"]}],Ws=new Map(Ct.map(t=>[t.id,t]));function Zt(t){return Ws.get(t)}function Ja(t){return Ct.filter(a=>(a.dependencias||[]).includes(t))}function ke(){const t={};for(const a of Ct)t[a.id]=a.porDefecto;return t}function Wa(){const t=[],a=new Map;for(const e of Ct)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function Qs(t){function a(){return{...ke(),...t.get("config").features||{}}}function e(p){t.patchConfig({features:p})}function o(p,u=a(),v=new Set){const b=Zt(p);if(!b)return!1;if(b.nucleo)return!0;if(u[p]===!1)return!1;if(v.has(p))return!0;v.add(p);for(const $ of b.dependencias||[])if(!o($,u,v))return!1;return!0}function s(p,u=a()){const v=Zt(p);return v?(v.dependencias||[]).filter(b=>!o(b,u)):[]}function n(p,u){var h;const v=Zt(p);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const b=a(),$=new Map(Ct.map(I=>[I.id,o(I.id,b)])),A={...b,[p]:u};let m;if(u){const I=[...v.dependencias||[]];for(;I.length;){const f=I.pop();A[f]===!1&&(A[f]=!0,m="dependencias-activadas"),I.push(...((h=Zt(f))==null?void 0:h.dependencias)||[])}}else{const I=Ja(p).map(f=>f.id);for(;I.length;){const f=I.pop();A[f]!==!1&&(A[f]=!1,m="cascada-apagado"),I.push(...Ja(f).map(y=>y.id))}}return e(A),{cambiadas:Ct.filter(I=>o(I.id,A)!==$.get(I.id)).map(I=>I.id),motivo:m}}function i(){const p=a();return Ct.map(u=>{const v=s(u.id,p);return{...u,activa:o(u.id,p),...v.length>0&&p[u.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const p=a();return Wa().map(({grupo:u,features:v})=>({grupo:u,features:v.map(b=>{const $=s(b.id,p);return{...b,activa:o(b.id,p),...$.length>0&&p[b.id]!==!1?{bloqueadaPor:$}:{}}})}))}function d(){e(ke())}function c(p){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...p?{nombre:p}:{},features:a()}}function x(p){const u=p,v=u&&typeof u=="object"&&u.features&&typeof u.features=="object"?u.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const b=ke(),$=[],A=[];for(const[m,g]of Object.entries(v)){if(!Zt(m)){A.push(m);continue}if(typeof g!="boolean"){A.push(m);continue}b[m]=g,$.push(m)}return e(b),{aplicadas:$,ignoradas:A}}return{isEnabled:p=>o(p),setEnabled:n,estado:i,estadoPorGrupo:r,reset:d,exportProfile:c,importProfile:x,bloqueadaPor:p=>s(p)}}const te=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Nt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Ks(t){var s,n;const e=(((s=t.bloqueadaPor)==null?void 0:s.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(n=t.bloqueadaPor)==null?void 0:n.map(te).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${te(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${te(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${te(t.descripcion)}</div>
        ${e}
      </div>
    </div>`}function Xs(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:s})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${te(o)}</div>
        ${s.map(Ks).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Zs(t){var s;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-feature-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function tn(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Xs(e)}`,s(i)}function s(i){var d,c,x;i.querySelectorAll("[data-feature-toggle]").forEach(p=>{p.addEventListener("change",()=>{var b;const u=p.dataset.featureToggle,v=e.setEnabled(u,p.checked);v.motivo==="dependencias-activadas"&&Nt(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&Nt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(b=t.onChange)==null||b.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(d=i.querySelector('[data-feature-action="export"]'))==null||d.addEventListener("click",()=>{const p=e.exportProfile(),u=new Blob([JSON.stringify(p,null,2)],{type:"application/json"}),v=URL.createObjectURL(u),b=a.createElement("a");b.href=v,b.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,b.click(),URL.revokeObjectURL(v),Nt(t,"Perfil de funcionalidades guardado")}),(c=i.querySelector('[data-feature-action="import"]'))==null||c.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var u,v;const p=(u=r.files)==null?void 0:u[0];if(p)try{const{aplicadas:b,ignoradas:$}=e.importProfile(JSON.parse(await p.text()));Nt(t,$.length>0?`Perfil cargado (${b.length} aplicadas, ${$.length} ignoradas por ser de otra versión)`:`Perfil cargado (${b.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,b),o(i)}catch(b){Nt(t,"No se pudo cargar el perfil: "+b.message,"err")}finally{r.value=""}}),(x=i.querySelector('[data-feature-action="reset"]'))==null||x.addEventListener("click",()=>{var p;e.reset(),Nt(t,"Funcionalidades restablecidas"),(p=t.onChange)==null||p.call(t,[]),o(i)})}function n(){const i=Zs(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:n,renderInto:o}}const Qa={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function Ka(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const s=a(o);e.style.display=s?"":"none",s?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function en({flags:t,document:a=document,router:e,rutasExtra:o}){function s(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function n(){let r=!1;const d=Object.entries((o==null?void 0:o())??{}).map(([c,x])=>[x,c]);for(const[c,x]of[...Object.entries(Qa),...d]){const p=t.isEnabled(c),u=a.querySelector(`.nav-btn[data-view="${x}"]`);u&&(u.style.display=p?"":"none"),!p&&s()===x&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(c=>{const x=[...c.querySelectorAll(".nav-btn[data-view]")];if(x.length===0)return;const p=x.some(u=>u.style.display!=="none");c.style.display=p?"":"none"}),Ka(a,c=>t.isEnabled(c)),r){const c=e??globalThis.Router;c==null||c.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let d=!1;const c=new MutationObserver(()=>{if(!d){d=!0;try{Ka(a,x=>t.isEnabled(x))}finally{d=!1}}});return c.observe(r,{childList:!0,subtree:!0}),()=>c.disconnect()}return{apply:n,observar:i,vistaPara:r=>Qa[r]}}function an({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function s(b){return`view-${b}`}function n(b){const $=t.getElementById(s(b.route));if($)return $;const A=t.querySelector(".view-container");if(!A)return null;const m=t.createElement("div");return m.id=s(b.route),m.className="view hidden",A.appendChild(m),m}function i(b){if(t.querySelector(`.nav-btn[data-view="${b.route}"]`))return;const $=t.querySelectorAll(".nav-section"),A=$[b.seccion??Math.max(0,$.length-1)];if(!A)return;const m=t.createElement("button");m.className="nav-btn",m.dataset.view=b.route,m.innerHTML=`${b.iconoPath?`<svg viewBox="0 0 24 24"><path d="${b.iconoPath}"/></svg>`:""}<span>${b.nombre}</span>`,A.appendChild(m),m.addEventListener("click",()=>{const g=globalThis.Router;g==null||g.navigate(b.route)})}function r(b){e.set(b.route,b),n(b),i(b)}function d(){return[...e.keys()].filter(b=>{const $=e.get(b);return!a||a($.flagId??$.id)})}function c(b){return d().includes(b)}function x(b){const $=e.get(b);if(!$||a&&!a($.flagId??$.id))return!1;const A=n($);if(!A)return!1;if(o&&o!==b){const m=e.get(o),g=t.getElementById(s(o));m!=null&&m.unmount&&g&&m.unmount(g)}return $.mount(A),o=b,!0}function p(){o&&x(o)}function u(){const b={};for(const[$,A]of e)b[$]=A.flagId??A.id;return b}function v(){for(const b of e.values())n(b),i(b)}return{register:r,routes:d,has:c,mount:x,rerender:p,flagPorRuta:u,attachToShell:v,get activa(){return o}}}function l(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function qt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${l(z(t))}</span>`}function Xa(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function Za(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${l(a)}</span>`).join(" ")}const on=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function sn(t){const[a,e]=t.split("-").map(Number);return`${on[e-1]} ${a}`}function q(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function X(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function D(t,a,e){t.addEventListener("click",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(a);s&&t.contains(s)&&e(s,o)})}function Y(t,a,e){t.addEventListener("change",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(a);s&&t.contains(s)&&e(s,o)})}function ft(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function to(t,a){const e=parseFloat(ft(t,a));return Number.isFinite(e)?e:0}function nn(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function rn(t,a){const{ledger:e}=t,o=(t.hoy??J)(),s=t.accounts().filter(g=>g.activo),{desde:n,hasta:i}=nn(a.mes),r={cuentaId:a.cuentaId||void 0,desde:n,hasta:i,texto:a.filtroTexto||void 0},d=e.transacciones(r),c=t.estimaciones().filter(g=>g.tipo!=="transferencia"),x=d.filter(g=>g.importeCts<0).reduce((g,h)=>g+h.importeCts,0),p=d.filter(g=>g.importeCts>0).reduce((g,h)=>g+h.importeCts,0),u=a.cuentaId?e.saldoCuenta(a.cuentaId,i):e.saldoTotal(i),v=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),b=s.map(g=>`<option value="${l(g._id)}"${g._id===a.cuentaId?" selected":""}>${l(g.nombre)}</option>`).join(""),$=g=>'<option value="">— sin asignar —</option>'+c.map(h=>`<option value="${l(h._id)}"${h._id===g?" selected":""}>${l(h.concepto)} (${l(z(h.cuantia))})</option>`).join(""),A=d.map(g=>{var h;return`
      <tr data-tx="${l(g._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${l(g.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${l(g.concepto)}</td>
        <td style="padding:7px 8px">${Za(g.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${l(((h=t.accounts().find(I=>I._id===g.cuentaId))==null?void 0:h.nombre)??g.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${l(g._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${$(g.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${qt(ot(g.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${l(g._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${l(g._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),m=v.slice().reverse().slice(0,8).map(g=>{var h;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${l(g.fecha)}</span>
        <span style="color:var(--text3)">${l(((h=t.accounts().find(I=>I._id===g.cuentaId))==null?void 0:h.nombre)??g.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${l(z(ot(g.saldoCts)))}</span>
        ${g.nota?`<span style="color:var(--text3)">${l(g.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${l(g._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="card-title">Movimientos reales</div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${b}</select>
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">Mes</label>
            <input class="form-input" type="month" id="acc-mes" value="${l(a.mes)}" style="width:140px"/>
          </div>
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${l(a.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${qt(ot(x))}</span>
          <span>Ingresos: ${qt(ot(p))}</span>
          <span>Neto: ${qt(ot(p+x))}</span>
          <span style="margin-left:auto">Saldo a ${l(i)}: <strong>${l(z(u))}</strong></span>
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
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="nt-fecha" value="${l(o)}"/></div>
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
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${b}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(g=>`<option value="${l(g)}"></option>`).join("")}</datalist>
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
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="pc-fecha" value="${l(o)}"/></div>
            <div class="form-group"><label class="form-label">Saldo (€)</label><input class="form-input" type="number" id="pc-saldo" step="0.01" placeholder="0,00"/></div>
          </div>
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${b}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${m?`<div class="mt-12">${m}</div>`:""}
        </div>
      </div>
    </div>`}function ln(t,a,e,o){const{ledger:s}=a;Y(t,"#acc-cuenta",i=>{e.cuentaId=i.value,o()}),Y(t,"#acc-mes",i=>{e.mes=i.value||e.mes,o()});const n=t.querySelector("#acc-buscar");n==null||n.addEventListener("input",()=>{e.filtroTexto=n.value,clearTimeout(n._t),n._t=window.setTimeout(o,200)}),D(t,"#nt-guardar",()=>{const i=ft(t,"#nt-concepto").trim(),r=to(t,"#nt-importe");if(!i)return q("Indica un concepto","err");if(!(r>0))return q("Indica un importe mayor que cero","err");const d=ft(t,"#nt-tags").split(",").map(c=>c.trim().toLowerCase()).filter(Boolean);s.registrar({fecha:ft(t,"#nt-fecha")||(a.hoy??J)(),cuentaId:ft(t,"#nt-cuenta"),importe:r,concepto:i,tags:d,tipo:ft(t,"#nt-tipo"),estimacionId:ft(t,"#nt-estimacion")||null}),q("Movimiento registrado"),a.onDatosCambiados(),o()}),D(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;X("¿Eliminar este movimiento?")&&(s.eliminar(r),q("Movimiento eliminado"),a.onDatosCambiados(),o())}),D(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,d=s.transacciones().find(p=>p._id===r);if(!d)return;const c=window.prompt(`Importe de "${d.concepto}" (€)`,String(Math.abs(ot(d.importeCts))));if(c===null)return;const x=parseFloat(c.replace(",","."));if(!Number.isFinite(x)||x<=0)return q("Importe no válido","err");s.actualizar(r,{importe:x}),q("Movimiento actualizado"),a.onDatosCambiados(),o()}),Y(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");s.asignarEstimacion(r,i.value||null),q("Asignación actualizada"),a.onDatosCambiados()}),D(t,"#pc-guardar",()=>{if(ft(t,"#pc-saldo").trim()==="")return q("Indica el saldo","err");const r=to(t,"#pc-saldo");s.registrarPuntoControl(ft(t,"#pc-cuenta"),ft(t,"#pc-fecha")||(a.hoy??J)(),r,ft(t,"#pc-nota").trim()||void 0),q("Saldo real registrado"),a.onDatosCambiados(),o()}),D(t,"[data-pc-borrar]",i=>{X("¿Eliminar este punto de control?")&&(s.eliminarPuntoControl(i.dataset.pcBorrar),q("Punto de control eliminado"),a.onDatosCambiados(),o())})}function eo(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:s=5}=e;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const n=st(t.mediaRealReciente),i=st(n-a),r=a!==0?i/Math.abs(a)*100:n!==0?100:0;if(Math.abs(r)<s)return null;const d=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:st(a),cuantiaSugerida:n,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:d,motivo:i>0?`El gasto real de los últimos ${d} meses supera lo estimado`:`El gasto real de los últimos ${d} meses es inferior a lo estimado`}}function cn(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(n,i,r={}){const d=r.hoy??J(),c=t.get("expenses"),x=c.find(b=>b._id===n);if(!x)throw new Error(`La estimación ${n} no existe`);const p={...x,fechaFin:d},u={...x,_id:a(),cuantia:st(i),fechaInicio:d,fechaFin:x.fechaFin??null,ajustadaDesdeId:x._id,ajustadaEn:d},v=c.map(b=>b._id===n?p:b);return v.push(u),t.set("expenses",v),{estimacionCerrada:p,estimacionNueva:u}}function o(n,i={}){const r=[],d=[];for(const c of n)try{r.push(e(c.estimacionId,c.cuantiaSugerida,i))}catch(x){d.push({estimacionId:c.estimacionId,error:x.message})}return{aplicadas:r,errores:d}}function s(n){const i=t.get("expenses"),r=new Map(i.map($=>[$._id,$])),d=r.get(n);if(!d)return[];const c=[];let x=d;const p=new Set;for(;x!=null&&x.ajustadaDesdeId&&!p.has(x._id);){p.add(x._id);const $=r.get(x.ajustadaDesdeId);if(!$)break;c.unshift($),x=$}const u=[];let v=d;const b=new Set([d._id]);for(;;){const $=i.find(A=>A.ajustadaDesdeId===v._id&&!b.has(A._id));if(!$)break;b.add($._id),u.push($),v=$}return[...c,d,...u]}return{aplicar:e,aplicarTodas:o,cadena:s}}function Be(t){const a=t.estimaciones(),e=new Map(a.map(o=>[o._id,o]));return t.precision.analizarTodas(a).map(o=>{const s=e.get(o.estimacionId);return{analisis:o,estimacion:s,sugerencia:eo(o,s.cuantia)}}).filter(o=>!!o.estimacion)}function dn(t){const a=Be(t),e=a.filter(d=>d.analisis.precision!==null),o=a.filter(d=>d.sugerencia!==null),s=t.precision.analizarPorTag(a.map(d=>d.analisis));if(e.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const n=e.map(({analisis:d,estimacion:c,sugerencia:x})=>{const p=d.meses.slice(-6).map(u=>`${sn(u.mes)}: ${z(u.estimado)} → ${z(u.real)} (${u.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${l(c.concepto)}</div>
          <div style="margin-top:3px">${Za(d.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${l(p)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${l(z(d.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${l(z(d.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${qt(d.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${Xa(d.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${x?`<button class="btn-secondary" data-sugerir="${l(d.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${l(x.motivo)}">Sugerir ajuste → ${l(z(x.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=s.map(d=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${l(d.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${d.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${l(z(d.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${l(z(d.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${qt(d.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${Xa(d.precision)}</td>
      </tr>`).join(""),r=(d,c="left")=>`<th style="padding:7px 8px;text-align:${c};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${d}</th>`;return`
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
          <tbody>${n}</tbody>
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
    </div>`}function un(t,a,e){D(t,"[data-sugerir]",o=>{const s=o.dataset.sugerir,n=Be(a).find(d=>d.analisis.estimacionId===s);if(!(n!=null&&n.sugerencia))return;const i=n.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${z(i.cuantiaActual)}
Nueva estimación: ${z(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;X(r)&&(a.adjuster.aplicar(s,i.cuantiaSugerida,{hoy:a.hoy()}),q(`Estimación ajustada a ${z(i.cuantiaSugerida)}`),a.onDatosCambiados(),e())}),D(t,"#ajustar-todas",()=>{const o=Be(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const s=o.map(r=>`• ${r.concepto}: ${z(r.cuantiaActual)} → ${z(r.cuantiaSugerida)}`).join(`
`);if(!X(`Se van a ajustar ${o.length} estimaciones:

${s}

¿Continuar?`))return;const{aplicadas:n,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});q(i.length>0?`${n.length} ajustadas, ${i.length} con error`:`${n.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const pn="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function mn(t){const a={cuentaId:"",mes:(t.hoy??J)().slice(0,7),filtroTexto:""},e=()=>{var r;return(r=t.onDatosCambiados)==null?void 0:r.call(t)},o=t.hoy??J,s={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:o},n={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:e,hoy:o};function i(r){const d=t.ledger.saldoTotal(o()),c=t.ledger.ultimaFecha(),x=t.ledger.transacciones().length;r.innerHTML=`
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
          <div class="stat-value" style="font-size:1.3rem">${l(z(d))}</div>
          <div style="font-size:11px;color:var(--text3)">suma de cuentas activas</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Movimientos registrados</div>
          <div class="stat-value" style="font-size:1.3rem">${x}</div>
          <div style="font-size:11px;color:var(--text3)">${c?`último: ${l(c)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const p=r.querySelector("#acc-transacciones"),u=r.querySelector("#acc-precision");p.innerHTML=rn(s,a),u.innerHTML=dn(n);const v=()=>i(r);ln(p,s,a,v),un(u,n,v)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:pn,mount:i}}const fn="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function He(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function vn(t){const{store:a}=t,e=t.hoy??J,o=()=>G(e()),s=()=>a.get("config").margenesSeguridad??[];function n(v){var b;a.patchConfig({margenesSeguridad:v}),(b=t.onDatosCambiados)==null||b.call(t)}function i(v,b){const $=s().map(m=>({...m,puntos:(m.puntos??[]).map(g=>({...g}))})),A=$.find(m=>m._id===v);A&&(b(A),n($))}function r(v){const b=a.get("config"),$=ue(v,a.get("expenses"),b,a.get("loans"),e(),!1,o());return z($)}function d(v,b,$){const A=b.tipo==="fijo",m=A?"":`<span class="text-sm" style="color:var(--text3)">${l(z((b.meses??0)*$))}</span>`;return`
      <tr data-punto="${l(b._id)}" data-margen="${l(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${l(b.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${A?" selected":""}>Fijo €</option>
            <option value="meses"${A?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${A?`<input type="number" class="form-input" style="width:90px" value="${b.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${A?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${b.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${m}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function c(v,b,$){const A=v.cuentas&&v.cuentas.length>0?v.cuentas.map(I=>{var f;return((f=b.find(y=>y._id===I))==null?void 0:f.nombre)??I}).join(", "):"Todas las cuentas activas",g=[...v.puntos??[]].sort((I,f)=>I.fecha.localeCompare(f.fecha)).map(I=>d(v,I,$)).join(""),h=v.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${l(A)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${l(r(v))}</strong>
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
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${l(v._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${l(v.nombre)}</span>
            <span class="badge ${v.activo?"badge-active":"badge-inactive"}">${v.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${v.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${v.activo?"checked":""} data-toggle-margen="${l(v._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${l(v._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${l(v._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${h}
      </div>`}function x(v,b){const $=b?s().find(h=>h._id===b):null,A=a.get("accounts").filter(h=>h.activo),m=new Set(($==null?void 0:$.cuentas)??[]),g=A.map(h=>`
        <label class="tag" data-chip="${l(h._id)}" style="cursor:pointer;${m.has(h._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${l(h._id)}" ${m.has(h._id)?"checked":""} style="display:none"/>
          ${l(h.nombre)}
        </label>`).join(" ");v.innerHTML=`
      <div class="modal-title">${b?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${l(($==null?void 0:$.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
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
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${l(J())}"/></div>
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
        <button class="btn-primary" data-guardar-margen="${l(b??"")}">Guardar</button>
      </div>`}function p(v,b){const $=document.getElementById("modal-overlay"),A=document.getElementById("modal-content");!$||!A||(x(A,v),$.classList.remove("hidden"),Y(A,".mg-acc-chip",m=>{const g=m,h=A.querySelector(`[data-chip="${g.value}"]`);h&&(h.style.cssText=`cursor:pointer;${g.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),Y(A,"#mg-p-tipo",m=>{const g=m.value==="fijo",h=A.querySelector("#mg-p-importe-wrap"),I=A.querySelector("#mg-p-meses-wrap");h&&(h.style.display=g?"":"none"),I&&(I.style.display=g?"none":"")}),D(A,"[data-cerrar-form]",()=>$.classList.add("hidden")),D(A,"[data-guardar-margen]",m=>{var y,M,S,C,j;const g=m.getAttribute("data-guardar-margen")||"",h=((y=A.querySelector("#mg-nombre"))==null?void 0:y.value.trim())??"";if(!h)return q("El nombre es obligatorio","err");const I=[...A.querySelectorAll(".mg-acc-chip:checked")].map(E=>E.value),f=s().map(E=>({...E}));if(g){const E=f.findIndex(F=>F._id===g);if(E===-1)return q("Margen no encontrado","err");f[E]={...f[E],nombre:h,cuentas:I}}else{const E=((M=A.querySelector("#mg-p-tipo"))==null?void 0:M.value)??"fijo",F={_id:He(),fecha:((S=A.querySelector("#mg-p-fecha"))==null?void 0:S.value)||J(),tipo:E,importe:parseFloat(((C=A.querySelector("#mg-p-importe"))==null?void 0:C.value)??"0")||0,meses:parseFloat(((j=A.querySelector("#mg-p-meses"))==null?void 0:j.value)??"1")||1};f.push({_id:He(),nombre:h,activo:!0,cuentas:I,puntos:[F]})}n(f),q(g?"Margen actualizado":"Margen creado"),$.classList.add("hidden"),b()}))}function u(v){const b=s(),$=a.get("accounts"),A=Wt(a.get("expenses"),o());v.innerHTML=`
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
      ${b.length===0?`<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`:b.map(g=>c(g,$,A)).join("")}`;const m=()=>u(v);D(v,"[data-nuevo-margen]",()=>p(null,m)),D(v,"[data-editar-margen]",g=>p(g.getAttribute("data-editar-margen"),m)),D(v,"[data-borrar-margen]",g=>{X("¿Eliminar este margen de seguridad?")&&(n(s().filter(h=>h._id!==g.getAttribute("data-borrar-margen"))),q("Margen eliminado"),m())}),Y(v,"[data-toggle-margen]",g=>{const h=g.getAttribute("data-toggle-margen");i(h,I=>{I.activo=g.checked}),m()}),D(v,"[data-add-punto]",g=>{const h=g.getAttribute("data-add-punto");i(h,I=>{I.puntos=[...I.puntos??[],{_id:He(),fecha:J(),tipo:"fijo",importe:0,meses:1}]}),m()}),D(v,"[data-borrar-punto]",g=>{const h=g.closest("[data-punto]");if(!h)return;const I=h.dataset.margen,f=h.dataset.punto;i(I,y=>{y.puntos=(y.puntos??[]).filter(M=>M._id!==f)}),m()}),Y(v,"[data-campo]",g=>{const h=g.closest("[data-punto]");if(!h)return;const I=g.getAttribute("data-campo"),f=g.value;i(h.dataset.margen,y=>{const M=(y.puntos??[]).find(S=>S._id===h.dataset.punto);M&&(I==="fecha"?M.fecha=f:I==="tipo"?M.tipo=f:I==="importe"?M.importe=parseFloat(f)||0:M.meses=parseFloat(f)||0)}),m()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:fn,mount:u}}const gn="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function bn(t){const a=Array.isArray(t)?t[1]??[]:[];return Array.isArray(a)?a.filter(e=>e&&e.value!==null&&e.value!==void 0&&Number.isFinite(Number(e.value))).map(e=>({year:parseInt(e.date),tasa:parseFloat(Number(e.value).toFixed(2))})).filter(e=>Number.isFinite(e.year)).sort((e,o)=>e.year-o.year):[]}function hn({fetchImpl:t,url:a=gn}={}){let e=null,o=!1;async function s(n=!1){if(e&&!n)return e;if(o)return null;o=!0;try{const r=await(t??fetch)(a);if(!r.ok)throw new Error(`HTTP ${r.status}`);return e=bn(await r.json()),e}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:s,invalidar:()=>{e=null},get enCache(){return e}}}const yn="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function xn(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function $n(t){const{store:a}=t,e=t.ipc??hn(),o=()=>a.get("inflacion")??[];function s(){var p;(p=t.onDatosCambiados)==null||p.call(t)}function n(p,u){if(!p||p.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const v=new Set(o().map(g=>g.year)),b=p.filter(g=>g.year>=u).reverse(),$=b.filter(g=>!v.has(g.year)).length,A=[...new Set(p.map(g=>g.year))].sort((g,h)=>g-h),m=b.map(g=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${g.year}" data-tasa="${g.tasa}" ${v.has(g.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${g.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${xn(g.tasa)}">${g.tasa.toFixed(2)}%</span>
          ${v.has(g.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${A.map(g=>`<option value="${g}"${g===u?" selected":""}>${g}</option>`).join("")}
        </select>
        <span style="font-size:10px;color:var(--text3)">
          Fuente: Banco Mundial · FP.CPI.TOTL.ZG · ${p[0].year}–${p[p.length-1].year}
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
      </div>`}function i(p){return!p||p.length===0?2e3:Math.max(p[0].year,new Date().getFullYear()-25)}async function r(p){const u=document.getElementById("modal-overlay"),v=document.getElementById("modal-content");if(!u||!v)return;v.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,u.classList.remove("hidden");const b=(A,m)=>{const g=document.getElementById("ipc-body");g&&(g.innerHTML=n(A,m))},$=await e.obtener();b($,i($)),D(v,"[data-ipc-cerrar]",()=>u.classList.add("hidden")),Y(v,"#ipc-desde",A=>{b(e.enCache,parseInt(A.value))}),D(v,"[data-ipc-recargar]",()=>{e.invalidar();const A=document.getElementById("ipc-body");A&&(A.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),e.obtener(!0).then(m=>b(m,i(m)))}),D(v,"[data-ipc-importar]",()=>{const A=[...v.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(A.length===0)return q("Nada seleccionado","err");const m=new Set(o().map(h=>h.year));let g=0;for(const h of A){const I=parseInt(h.dataset.year??""),f=parseFloat(h.dataset.tasa??"");!Number.isFinite(I)||!Number.isFinite(f)||m.has(I)||(a.addItem("inflacion",{year:I,tasa:f}),m.add(I),g++)}u.classList.add("hidden"),q(`${g} periodo${g!==1?"s":""} importado${g!==1?"s":""} correctamente`),s(),p()})}function d(p,u){var m;const v=document.getElementById("modal-overlay"),b=document.getElementById("modal-content");if(!v||!b)return;const $=p?o().find(g=>g._id===p):null;b.innerHTML=`
      <div class="modal-title">${p?"Editar periodo de inflación":"Nuevo periodo de inflación"}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Año</label>
          <input class="form-input" type="number" id="inf-year" value="${($==null?void 0:$.year)??new Date().getFullYear()}" placeholder="2026"/></div>
        <div class="form-group"><label class="form-label">Tasa anual (%)</label>
          <input class="form-input" type="number" id="inf-tasa" step="0.01" value="${($==null?void 0:$.tasa)??""}" placeholder="3.5"/></div>
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-inf-cerrar>Cancelar</button>
        <button class="btn-primary" data-inf-guardar="${l(p??"")}">Guardar</button>
      </div>`,v.classList.remove("hidden");const A=()=>{var y;const g=parseFloat(((y=b.querySelector("#inf-tasa"))==null?void 0:y.value)??""),h=b.querySelector("#inf-preview");if(!h)return;if(!Number.isFinite(g)||g<=0){h.innerHTML="";return}const I=(Math.pow(1+g/100,1/12)-1)*100,f=Math.pow(1+g/100,5);h.innerHTML=`Con un ${g}% anual: <strong>${I.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${f.toFixed(3)}</strong> (+${((f-1)*100).toFixed(1)}%)`};(m=b.querySelector("#inf-tasa"))==null||m.addEventListener("input",A),A(),D(b,"[data-inf-cerrar]",()=>v.classList.add("hidden")),D(b,"[data-inf-guardar]",g=>{const h=g.getAttribute("data-inf-guardar")||"",I=parseInt(b.querySelector("#inf-year").value),f=parseFloat(b.querySelector("#inf-tasa").value);if(!Number.isFinite(I)||I<1900||I>2200)return q("Año inválido","err");if(!Number.isFinite(f)||f<0||f>100)return q("Tasa inválida (0–100%)","err");if(o().filter(M=>M._id!==h).some(M=>M.year===I))return q("Ya existe un periodo para ese año","err");h?(a.updateItem("inflacion",h,{year:I,tasa:f}),q("Periodo actualizado")):(a.addItem("inflacion",{year:I,tasa:f}),q("Periodo añadido")),v.classList.add("hidden"),s(),u()})}function c(p,u){const v=(Math.pow(1+p.tasa/100,.08333333333333333)-1)*100,b=`${p.year}-12-31`,$=b>u?pt([p],u,b):null;return`
      <div class="exp-table-row" data-periodo="${l(p._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${p.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${p.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${v.toFixed(3)}%/mes</div>
        <div class="num">${$!==null?`×${$.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${l(p._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${l(p._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function x(p){const u=o(),v=a.get("config").usarInflacion||!1,b=[...u].sort((y,M)=>M.year-y.year),$=J(),A=new Date().getFullYear(),m=V(new Date(A+5,0,1)),g=V(new Date(A+10,0,1)),h=v&&u.length>0?pt(u,$,m):null,I=v&&u.length>0?pt(u,$,g):null;p.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${!v&&u.length===0?`<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
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
        ${h!==null&&I!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${h.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((h-1)*100).toFixed(1)}%)</span></div>
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
        ${b.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':b.map(y=>c(y,$)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const f=()=>x(p);Y(p,"[data-toggle-inflacion]",y=>{const M=y.checked;a.patchConfig({usarInflacion:M}),q(M?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),s(),f()}),D(p,"[data-nuevo-periodo]",()=>d(null,f)),D(p,"[data-editar-periodo]",y=>d(y.getAttribute("data-editar-periodo"),f)),D(p,"[data-importar-ipc]",()=>void r(f)),D(p,"[data-borrar-periodo]",y=>{X("¿Eliminar este periodo de inflación?")&&(a.removeItem("inflacion",y.getAttribute("data-borrar-periodo")),q("Periodo eliminado"),s(),f())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:yn,mount:x}}const In=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],An=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Mn=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function Sn(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Ge=(t,a)=>t.map(([e,o])=>`<option value="${l(e)}"${e===a?" selected":""}>${l(o)}</option>`).join("");function ao(t,a="dp"){const{modo:e,dia:o,nth:s,wd:n}=Sn(t),i=Ge(In.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${l(a)}">
    <label class="form-label">Día efectivo</label>
    <div class="flex gap-8 items-center" style="flex-wrap:wrap;row-gap:6px">
      <select class="form-select" data-dp-modo style="width:auto;min-width:145px">
        <option value="none"${e==="none"?" selected":""}>Sin ajuste</option>
        <option value="dia"${e==="dia"?" selected":""}>Día del mes</option>
        <option value="nthweekday"${e==="nthweekday"?" selected":""}>Día de la semana</option>
      </select>
      <span data-dp-dia class="flex gap-8 items-center"${e!=="dia"?' style="display:none"':""}>
        el día <select class="form-select" data-dp-dnum style="width:auto;min-width:80px">${i}</select>
      </span>
      <span data-dp-nth class="flex gap-8 items-center"${e!=="nthweekday"?' style="display:none"':""}>
        el
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Ge(An,s)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Ge(Mn,n)}</select>
        del mes
      </span>
    </div>
  </div>`}function oo(t){var o,s,n;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(s=a.querySelector("[data-dp-dia]"))==null||s.style.setProperty("display",e==="dia"?"":"none"),(n=a.querySelector("[data-dp-nth]"))==null||n.style.setProperty("display",e==="nthweekday"?"":"none")}function so(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=s=>{var n;return((n=a.querySelector(s))==null?void 0:n.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const wn="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Cn=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function jn(t){const a=t.hoy??J,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var m;return(m=t.onDatosCambiados)==null?void 0:m.call(t)},s=()=>t.store.get("accounts"),n=m=>{var g;return((g=s().find(h=>h._id===(m||"default")))==null?void 0:g.nombre)??(m||"default")};function i(){const m=a();let g=[...t.store.get("expenses")];if(e.mostrarExpirados||(g=g.filter(h=>!h.fechaFin||h.fechaFin>=m)),e.tipo&&(g=g.filter(h=>h.tipo===e.tipo)),e.cuenta&&(g=g.filter(h=>(h.cuenta||"default")===e.cuenta)),e.desde&&(g=g.filter(h=>(h.fechaInicio??"")>=e.desde)),e.hasta&&(g=g.filter(h=>(h.fechaInicio??"")<=e.hasta)),e.busqueda){const h=e.busqueda.toLowerCase();g=g.filter(I=>I.concepto.toLowerCase().includes(h))}return e.tags.size>0&&(g=g.filter(h=>(h.tags||[]).some(I=>e.tags.has(I)))),g.sort((h,I)=>{const f=h[e.orden]??"",y=I[e.orden]??"";return typeof f=="number"&&typeof y=="number"?(f-y)*e.sentido:String(f).localeCompare(String(y))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(m=>m.tags||[]))].filter(Boolean).sort()}function d(m,g){const h=e.orden===m?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${m}">${l(g)} <span class="sort-arrow">${h}</span></span>`}function c(m,g=!1){return(g?'<option value="">Todas las cuentas</option>':"")+s().filter(I=>I.activo!==!1).map(I=>`<option value="${l(I._id)}"${I._id===m?" selected":""}>${l(I.nombre)}</option>`).join("")}function x(m){const g=m.tipo==="transferencia",h=$e(m.diaPago??""),I=m.tipoFrecuencia==="extraordinario"?"Único":`Cada ${m.frecuencia??1} ${m.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${h?` · ${h}`:""}`,f=!!m.fechaFin&&m.fechaFin<a(),y=g?'<span class="badge badge-purple">⇄ transf.</span>':m.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',M=g?`${l(n(m.cuenta))} → ${l(n(m.cuentaDestino))}`:l(n(m.cuenta)),S=(m.tags||[]).map(C=>`<span class="tag${e.tags.has(C)?" active":""}" data-tag="${l(C)}" title="Filtrar por ${l(C)}">${l(C)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${l(m.concepto)}</div>
        <div class="tag-list mt-4">${S}</div>
      </div>
      <div>${y}</div>
      <div class="num ${m.tipo==="ingreso"?"pos":g?"":"neg"}">${g?"⇄ ":""}${l(z(m.cuantia))}</div>
      <div class="text-sm">${l(I)}</div>
      <div class="text-sm exp-col-hide">${M}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${l(m._id)}"${m.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${m.tipo==="gasto"&&m.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${m.tipo==="gasto"&&m.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${m.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${m.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${l(m.ajustadaEn??"")}">ajustada</span>`:""}
        ${f?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${l(m._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${l(m._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${l(m._id)}">✕</button>
      </div>
    </div>`}function p(m){const g=i(),h=r();m.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Gastos e <span>Ingresos</span></h1>
        <div class="page-actions">
          <label class="flex gap-8 items-center" style="font-size:12px;color:var(--text2)">
            <label class="toggle"><input type="checkbox" data-expirados${e.mostrarExpirados?" checked":""}/><span class="toggle-slider"></span></label>
            Expirados
          </label>
          <button class="btn-primary" data-nuevo>+ Nuevo</button>
        </div>
      </div>
      <div class="filter-bar">
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${l(e.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${e.tipo==="gasto"?" selected":""}>Gastos</option>
          <option value="ingreso"${e.tipo==="ingreso"?" selected":""}>Ingresos</option>
          <option value="transferencia"${e.tipo==="transferencia"?" selected":""}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${c(e.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${l(e.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${l(e.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${h.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${h.map(I=>`<span class="tag${e.tags.has(I)?" active":""}" data-tag="${l(I)}">${l(I)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${d("concepto","Concepto")} ${d("tipo","Tipo")} ${d("cuantia","Cuantía")} ${d("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${g.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':g.map(x).join("")}
      </div>`}function u(m){const g=(m==null?void 0:m.tipo)==="transferencia",h=t.store.get("escenarios"),I=(m==null?void 0:m.escenarioIds)||[],f=(y,M,S,C,j="")=>`<div class="form-group"><label class="form-label">${l(M)}</label>
       <input class="form-input" type="${S}" id="${y}" value="${l(C)}" placeholder="${l(j)}"/></div>`;return`
      <div class="grid-2">
        ${f("ef-concepto","Concepto","text",(m==null?void 0:m.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(m==null?void 0:m.tipo)==="gasto"||!(m!=null&&m.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(m==null?void 0:m.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${g?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${f("ef-cuantia","Cuantía (€)","number",(m==null?void 0:m.cuantia)??"","500")}
        ${f("ef-frecuencia","Frecuencia","number",(m==null?void 0:m.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${Cn.map(([y,M])=>`<option value="${y}"${((m==null?void 0:m.tipoFrecuencia)??"mensual")===y?" selected":""}>${l(M)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${f("ef-fecha-ini","Fecha inicio","date",(m==null?void 0:m.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${c((m==null?void 0:m.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${g?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${c((m==null?void 0:m.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(m==null?void 0:m.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${m!=null&&m._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${f("ef-fecha-fin","Fecha fin (opcional)","date",(m==null?void 0:m.fechaFin)??"")}</div>
          <div class="mt-8">${ao(m==null?void 0:m.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${g?' style="display:none"':""}>
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
              <input class="form-input" type="text" id="ef-tags" value="${l(((m==null?void 0:m.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
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
          ${h.length>0?`<div class="form-group mt-8"><label class="form-label">Escenarios</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${h.map(y=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${I.includes(y._id)?l(y.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${l(y._id)}"${I.includes(y._id)?" checked":""}/>
                          ${l(y.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${l((m==null?void 0:m._id)??"")}">Guardar</button>
      </div>`}function v(m){var I;const g=((I=m.querySelector("#ef-tipo"))==null?void 0:I.value)??"gasto",h=(f,y)=>{const M=m.querySelector(f);M&&(M.style.display=y?"":"none")};h("#ef-destino-wrap",g==="transferencia"),h("#ef-basico-wrap",g!=="transferencia"),h("#ef-irpf-wrap",g==="ingreso"),h("#ef-clasificacion-wrap",g==="gasto")}function b(m,g,h){const I=document.getElementById("modal-overlay"),f=document.getElementById("modal-content");!I||!f||(f.innerHTML=`<div class="modal-title">${l(g)}</div>${u(m)}`,I.classList.remove("hidden"),Y(f,"#ef-tipo",()=>v(f)),Y(f,"[data-dp-modo]",()=>oo(f)),D(f,"[data-cancelar]",()=>I.classList.add("hidden")),D(f,"[data-guardar]",y=>{$(f,y.getAttribute("data-guardar")||"")&&(I.classList.add("hidden"),h())}))}function $(m,g){const h=E=>{var F;return((F=m.querySelector(E))==null?void 0:F.value)??""},I=E=>{var F;return!!((F=m.querySelector(E))!=null&&F.checked)},f=h("#ef-tipo")||"gasto",y=f==="transferencia",M=h("#ef-concepto").trim(),S=parseFloat(h("#ef-cuantia"));if(!M||!Number.isFinite(S))return q("Concepto y cuantía obligatorios","err"),!1;const C=h("#ef-clasificacion"),j={concepto:M,tipo:f,cuantia:S,frecuencia:parseInt(h("#ef-frecuencia"),10)||1,tipoFrecuencia:h("#ef-tipo-frec")||"mensual",fechaInicio:h("#ef-fecha-ini"),fechaFin:h("#ef-fecha-fin")||null,diaPago:so(m),cuenta:h("#ef-cuenta"),cuentaDestino:y?h("#ef-cuenta-dest")||"default":void 0,activo:I("#ef-activo"),basico:!y&&I("#ef-basico"),sujetoIRPF:!y&&I("#ef-sujetoIRPF"),clasificacion:f==="gasto"?C||null:void 0,tags:y?["transferencia"]:h("#ef-tags").split(",").map(E=>E.trim()).filter(Boolean),escenarioIds:[...m.querySelectorAll(".ef-escenario:checked")].map(E=>E.value)};return g?(t.store.updateItem("expenses",g,j),q("Actualizado")):(t.store.addItem("expenses",j),q("Creado")),o(),!0}function A(m,g){const h=m.querySelector("[data-busqueda]");let I;h==null||h.addEventListener("input",()=>{clearTimeout(I),I=setTimeout(()=>{e.busqueda=h.value,g();const f=m.querySelector("[data-busqueda]");f==null||f.focus(),f==null||f.setSelectionRange(f.value.length,f.value.length)},250)}),Y(m,"[data-expirados]",f=>{e.mostrarExpirados=f.checked,g()}),Y(m,"[data-f-tipo]",f=>{e.tipo=f.value,g()}),Y(m,"[data-f-cuenta]",f=>{e.cuenta=f.value,g()}),Y(m,"[data-f-desde]",f=>{e.desde=f.value,g()}),Y(m,"[data-f-hasta]",f=>{e.hasta=f.value,g()}),D(m,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,g()}),D(m,"[data-limpiar-tags]",()=>{e.tags=new Set,g()}),D(m,"[data-tag]",f=>{const y=f.getAttribute("data-tag");e.tags.has(y)?e.tags.delete(y):e.tags.add(y),g()}),D(m,"[data-orden]",f=>{const y=f.getAttribute("data-orden");e.orden===y?e.sentido=e.sentido===1?-1:1:(e.orden=y,e.sentido=1),g()}),D(m,"[data-nuevo]",()=>b(null,"Nuevo gasto/ingreso",g)),D(m,"[data-editar]",f=>{const y=t.store.get("expenses").find(M=>M._id===f.getAttribute("data-editar"));y&&b(y,"Editar",g)}),D(m,"[data-duplicar]",f=>{const y=t.store.get("expenses").find(C=>C._id===f.getAttribute("data-duplicar"));if(!y)return;const{_id:M,...S}=y;b({...S,concepto:`${y.concepto} (copia)`},"Duplicar movimiento",g)}),D(m,"[data-borrar]",f=>{X("¿Eliminar?")&&(t.store.removeItem("expenses",f.getAttribute("data-borrar")),q("Eliminado"),o(),g())}),Y(m,"[data-activo]",f=>{const y=f;t.store.updateItem("expenses",y.getAttribute("data-activo"),{activo:y.checked}),o(),g()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:wn,mount(m){const g=()=>p(m);p(m),m.dataset.wired!=="1"&&(A(m,g),m.dataset.wired="1")}}}function me(t,a,e){return t.reduce((o,s)=>{if(s.esAmortizacion)return o;const n=pt(a,e,s.fecha);return o+(n>0?s.interes/n:s.interes)},0)}function no(t,a,e,o){return t.reduce((s,n)=>{const i=pt(a,e,n.fecha),r=n.esAmortizacion?n.amortizacion+n.comisionAmort:n.cuota;return s+(i>0?r/i:r)},0)+o}function zn(t,a,e){const o=t.amortizaciones||[];return o.map((s,n)=>{const i=tt({...t,amortizaciones:o.slice(0,n)}),r=tt({...t,amortizaciones:o.slice(0,n+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:me(i.tabla,a,e)-me(r.tabla,a,e)}})}const Ve=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${l(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function En(t,a){const e=ia(t),o=(t.amortizaciones||[]).length>0,s=a.periodos.length>0,n=a.usarInflacion&&s,i=s?ra(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=s?la(t.tin||0,i):null,d=o&&s?zn(t,a.periodos,a.hoy):[],c=d.length?me(e.sinAmort.tabla,a.periodos,a.hoy)-me(e.tabla,a.periodos,a.hoy):null,x=c===null?null:c-e.costeTotalAmort,p=n?no(e.tabla,a.periodos,a.hoy,e.comAp):null,u=n&&o?no(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${l(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${l(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(t.tags||[]).map(v=>`<span class="tag">${l(v)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${l(t.tin)}%</span>
        <span class="text-sm">${l(z(t.capital))}</span>
        <span class="text-sm">${l(t.meses)}m</span>
        <button class="btn-icon" data-amort-loan="${l(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${l(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${l(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${l(t._id)}">

      <div class="grid-4 mb-12">
        ${Ve("Cuota mensual",l(z(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${l(z(a.cuotaMes))}</div>`:"")}
        ${Ve("Total intereses",l(z(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${l(z(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${l(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${l(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Ve("Total pagado",l(z(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${l(z(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${l(aa(e.tae))}</div></div>
          <div><div class="stat-label">TIN</div><div class="stat-value">${l(t.tin)}%</div></div>
          ${r!==null?`<div title="Tipo de interés real (Fisher): TIN ajustado por la inflación media del ${i.toFixed(2)}% anual durante el préstamo">
                   <div class="stat-label">TIN real</div>
                   <div class="stat-value" style="color:${r<=0?"var(--accent)":r<t.tin?"var(--yellow)":"var(--text)"}">${r.toFixed(2)}%
                     <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${i.toFixed(1)}%)</span>
                   </div>
                 </div>`:""}
          <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${l(t.meses)} meses</div></div>
        </div>
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">Capital</div><div class="stat-value">${l(z(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${l(z(e.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${l(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${l($e(t.diaPago))}</div></div>`:""}
        </div>
      </div>

      ${o?"":`<div class="loan-optim-cta">
               <div class="loan-optim-cta-text">
                 <strong>¿Quieres pagar menos intereses?</strong>
                 Simula amortizaciones anticipadas y descubre cuánto puedes ahorrar.
               </div>
               <button class="btn-primary btn-sm" data-amort-loan="${l(t._id)}">+ Amortizar</button>
               <button class="btn-secondary btn-sm" data-optimizar data-feature="optimizador">✨ Optimizar</button>
             </div>`}

      ${o?`<div class="card" style="background:var(--bg3);padding:12px;margin-bottom:12px">
               <div class="card-title" style="margin-bottom:8px;color:var(--accent)">💰 Ahorro por amortizaciones</div>
               ${c!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${l(z(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${l(z(c))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${l(z(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${l(z(e.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(x??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${l(z(x??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${l(z(e.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${l(z(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${l(z(e.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${p!==null?Fn(t,e.totalPagado,p,u):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${n?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(v=>_n(v,n,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,b)=>Pn(t._id,v,d[b]??null,a)).join("")}`:""}
    </div>
  </div>`}function Fn(t,a,e,o){const s=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,d=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${l(z(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${l(z(e))}</div></div>
        <div><div class="stat-label">${d?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${d?"pos":"neg"}">${d?"−":"+"}${l(z(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${s}
    </div>`}const n=a-e,i=n>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${l(z(a))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${l(z(e))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${l(z(Math.abs(n)))}</div></div>
    </div>
    ${s}
  </div>`}function _n(t,a,e){let o="";if(a&&!t.esAmortizacion){const s=pt(e.periodos,e.hoy,t.fecha);o=l(z(s>0?t.cuota/s:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":l(t.mes)}</td>
    <td class="num">${l(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":l(z(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${l(z(t.interes))}</td>
    <td class="num">${l(z(t.amortizacion))}</td>
    <td class="num">${l(z(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Pn(t,a,e,o){const s=(a.escenarioIds||[]).map(n=>`<span class="badge badge-yellow">🔭 ${l(o.nombreEscenario(n))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${l(a.fecha)}</span>
    <span class="num">${l(z(a.cantidad))}</span>
    <span class="badge ${a.simulacion?"badge-sim":"badge-active"}">${a.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${a.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${s}
    ${e?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${l(z(e.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${l(z(e.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${l(t)}|${l(a._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${l(t)}|${l(a._id)}">✕</button>
  </div>`}const Z=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${l(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${l(o)}" placeholder="${l(s)}"/></div>`,Lt=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${l(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([s,n])=>`<option value="${l(s)}"${s===o?" selected":""}>${l(n)}</option>`).join("")}
   </select></div>`,ee=(t,a,e,o="")=>`<label class="form-label">${l(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${l(o)}</span>`:""}`;function ae(t,a,e){return t.length===0?"":`<div class="form-group mt-8"><label class="form-label">Escenarios</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${t.map(o=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${a.includes(o._id)?l(o.color||"var(--accent)"):"var(--border)"}">
            <input type="checkbox" class="${l(e)}" value="${l(o._id)}"${a.includes(o._id)?" checked":""}/>
            ${l(o.nombre)}
          </label>`).join("")}
    </div></div>`}const Tn=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${l(e._id)}"${e._id===a?" selected":""}>${l(e.nombre)}</option>`).join("");function Dn(t,a,e,o=J()){return`
    <div class="grid-2">
      ${Z("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${Z("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${Z("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${Z("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${Z("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??o)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${Tn(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${ao(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Lt("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${Z("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${Z("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${l(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${ee("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${ae(e,(t==null?void 0:t.escenarioIds)??[],"loan-escenario")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${ee("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${ee("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${ee("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${l((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Rn(t,a,e,o=J()){return`
    <div class="grid-2">
      ${Z("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??o)}
      ${Z("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Lt("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(a==null?void 0:a.tipo)??"cuota")}
    </div>
    ${ae(e,(a==null?void 0:a.escenarioIds)??[],"amort-escenario")}
    <div class="form-row mt-8">
      ${ee("am-sim","Simulación",!!(a!=null&&a.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${l(t)}|${l((a==null?void 0:a._id)??"")}">${a?"Guardar cambios":"Añadir"}</button>
    </div>`}const io="opt_",ro=t=>String(t).startsWith(io);function On(t){let a=null,e=null;const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content");function n(h,I){const f=o(),y=s();return!f||!y?null:(y.innerHTML=`<div class="modal-title">${l(h)}</div>${I}`,f.classList.remove("hidden"),y)}const i=()=>{var h;return(h=o())==null?void 0:h.classList.add("hidden")};function r(){let h=!1;for(const I of t.loans()){const f=(I.amortizaciones||[]).filter(y=>!ro(y._id));f.length!==(I.amortizaciones||[]).length&&(t.guardarAmortizaciones(I._id,f),h=!0)}return h}function d(h){try{return h()}catch(I){return q(I instanceof Error?I.message:"No se ha podido completar el cálculo","err"),null}}function c(){var C,j;if(!_a("optimizador")){q("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const h=t.loans().filter(E=>E.activo&&!E.simulacion);if(h.length===0){q("No hay préstamos activos para optimizar","err");return}const I=t.config(),f=t.accounts().filter(E=>E.activo&&!E.simulacion),y=((C=f.find(E=>E.esCuentaPrincipal))==null?void 0:C._id)??((j=f[0])==null?void 0:j._id)??"",M=I.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,S=n("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${f.map(E=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${l(E._id)}"${E._id===y?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${l(E.nombre)}${E._id===y?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${l(z(rt(E)))}</span>
              </label>`).join("")||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${h.map(E=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
              <input type="checkbox" class="opt-loan-check" value="${l(E._id)}"${E.tin>=5?" checked":""} style="accent-color:var(--accent)"/>
              <span style="font-size:13px;flex:1">${l(E.nombre)}</span>
              <span class="badge badge-yellow" style="font-size:11px">${l(E.tin)}% TIN</span>
            </label>`).join("")}
      </div>
      <button class="btn-secondary btn-sm mb-12" data-opt-todos>Seleccionar todo</button>

      <div class="grid-2" style="gap:10px">
        ${Z("opt-horizonte","Horizonte (meses)","number",60,"60")}
        ${Z("opt-frecuencia","Frecuencia manual (cada N meses)","number",1,"1")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${Z("opt-min","Importe mínimo por amortización (€)","number",500,"500")}
        ${Lt("opt-tipo","Efecto de la amortización",[["plazo","Reducir plazo (mantener cuota)"],["cuota","Reducir cuota (mantener plazo)"]],"plazo")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${Z("opt-fecha-primera","Fecha primera amortización","date","")}
        ${Z("opt-fecha-obj","Fecha objetivo para comparar saldo","date",M)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);S&&(x(S),Y(S,".opt-acc-radio",()=>x(S)),D(S,"[data-opt-todos]",()=>{const E=[...S.querySelectorAll(".opt-loan-check")],F=E.every(w=>w.checked);E.forEach(w=>w.checked=!F)}),D(S,"[data-cancelar]",i),D(S,"[data-opt-calcular]",()=>b(S)),D(S,"[data-opt-comparar]",()=>$(S)))}function x(h){var S;const I=(S=h.querySelector(".opt-acc-radio:checked"))==null?void 0:S.value,y=(t.config().margenesSeguridad||[]).filter(C=>C.activo!==!1).filter(C=>!C.cuentas||C.cuentas.length===0||I&&C.cuentas.includes(I)),M=h.querySelector("#opt-margenes-wrap");M&&(M.innerHTML=y.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':y.map(C=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${l(C._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${l(C.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!C.cuentas||C.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function p(h){var M,S,C,j;const I=(E,F,w=0)=>{var T;const P=parseFloat(((T=h.querySelector(E))==null?void 0:T.value)??"");return Number.isFinite(P)?Math.max(w,P):F},f=[...h.querySelectorAll(".opt-loan-check")],y=f.filter(E=>E.checked).map(E=>E.value);return{horizonte:Math.round(I("#opt-horizonte",60,1)),frecuencia:Math.round(I("#opt-frecuencia",1,1)),minAmortizable:I("#opt-min",500),tipoAmort:((M=h.querySelector("#opt-tipo"))==null?void 0:M.value)||"plazo",fechaObjetivo:((S=h.querySelector("#opt-fecha-obj"))==null?void 0:S.value)||null,fechaPrimeraAmort:((C=h.querySelector("#opt-fecha-primera"))==null?void 0:C.value)||null,loanIds:f.length===0||y.length===f.length?null:y,sourceAccountId:((j=h.querySelector(".opt-acc-radio:checked"))==null?void 0:j.value)??null,selectedMarginIds:[...h.querySelectorAll(".opt-margin-check:checked")].map(E=>E.value)}}const u=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function v(h,I=""){const f=n("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${l(h)}</div>
        ${I?`<div class="text-sm mt-8" style="color:var(--text3)">${l(I)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);f&&(D(f,"[data-opt-volver]",c),D(f,"[data-cancelar]",i))}function b(h){const I=p(h);r()&&q("Plan anterior eliminado, recalculando…");const{loans:f,expenses:y,accounts:M,config:S,nominas:C}=u(),j=d(()=>Te(f,y,M,S,{frecuencia:I.frecuencia,mesesHorizonte:I.horizonte,minAmortizable:I.minAmortizable,tipoAmort:I.tipoAmort,fechaPrimeraAmort:I.fechaPrimeraAmort,loanIds:I.loanIds,nominas:C,sourceAccountId:I.sourceAccountId,selectedMarginIds:I.selectedMarginIds}));if(!j)return;if(j.plan.length===0){v(`No hay excedente suficiente respetando los ${j.margenesAplicados} márgenes de seguridad activos en los próximos ${I.horizonte} meses para generar amortizaciones por encima del mínimo de ${z(I.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}e={plan:j.plan,tipoAmort:I.tipoAmort};const E=`✨ Plan de optimización · ${I.frecuencia===1?"Mensual":`Cada ${I.frecuencia} meses`} · ${I.horizonte}m`,F=n(E,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${l(z(j.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${l(z(j.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${l(z(j.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${j.margenesAplicados}</div></div>
      </div>
      ${j.resumenPorLoan.map(co).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${j.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${j.plan.map(w=>lo(w,!0)).join("")}</tbody>
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
      </div>`);F&&(D(F,"[data-opt-volver]",c),D(F,"[data-cancelar]",i),D(F,"[data-opt-aplicar]",()=>{e&&m(e.plan,e.tipoAmort)}))}function $(h){const I=p(h);r();const{loans:f,expenses:y,accounts:M,config:S,nominas:C}=u(),j=d(()=>Da(f,y,M,S,{horizonte:I.horizonte,minAmortizable:I.minAmortizable,tipoAmort:I.tipoAmort,fechaObjetivo:I.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:I.fechaPrimeraAmort,loanIds:I.loanIds,nominas:C,sourceAccountId:I.sourceAccountId,selectedMarginIds:I.selectedMarginIds}));if(!j)return;if(j.resultados.length===0){v("No hay excedente suficiente en ninguna frecuencia.");return}a=j;const{resultados:E,saldoBase:F,fechaObjetivo:w}=j,P=E.map(R=>{const N=[R.esMejorIntereses&&"💰 +intereses",R.esMejorSaldo&&"🏦 +saldo",R.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${R.esMejorValor?"background:rgba(46,230,168,0.06);":""}">
          <td style="font-weight:600">${l(R.label)}</td>
          <td class="num">${R.numAmortizaciones}</td>
          <td class="num neg">${l(z(R.totalAmortizado))}</td>
          <td class="num pos">${l(z(R.ahorroIntereses))}</td>
          <td class="num ${R.saldoObjetivo>=F?"pos":"neg"}">${l(z(R.saldoObjetivo))}</td>
          <td class="num pos">${l(z(R.valorTotal))}</td>
          <td style="font-size:11px">${N}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${R.frecuencia}">Usar</button></td>
        </tr>`}).join(""),T=n(`📊 Comparativa de frecuencias · hasta ${w}`,`
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${l(w)}: <strong>${l(z(F))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${l(w.slice(0,7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${P}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);T&&(D(T,"[data-opt-volver]",c),D(T,"[data-cancelar]",i),D(T,"[data-opt-usar]",R=>A(Number(R.getAttribute("data-opt-usar")))))}function A(h){var f;const I=a==null?void 0:a.resultados.find(y=>y.frecuencia===h);I&&(r(),m(I.plan,((f=I.plan[0])==null?void 0:f.tipoAmort)||"plazo",{titulo:`✨ Plan ${I.label} · aplicado`,resumen:I,fechaObjetivo:a==null?void 0:a.fechaObjetivo}))}function m(h,I,f){if(h.length===0)return;const y=new Map;for(const S of h){const C=y.get(S.loanId)??[];C.push({_id:`${io}${S.mes}_${S.loanId}`,fecha:S.fechaAmort,cantidad:S.cantidadAmort,tipo:I,simulacion:!0}),y.set(S.loanId,C)}let M=0;for(const S of t.loans()){const C=y.get(S._id);if(!C)continue;const j=(S.amortizaciones||[]).filter(E=>!ro(E._id));t.guardarAmortizaciones(S._id,[...j,...C]),M+=1}q(`Plan aplicado: ${h.length} amortizaciones en ${M} préstamo${M!==1?"s":""} (simulación)`),f?g(f):i(),t.refrescar([...y.keys()])}function g({titulo:h,resumen:I,fechaObjetivo:f}){const y=n(h,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${l(z(I.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${l(z(I.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${l((f==null?void 0:f.slice(0,7))??"")}</div><div class="stat-value pos">${l(z(I.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${l(z(I.totalComisiones))}</div></div>
      </div>
      ${I.resumenPorLoan.map(co).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${I.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${I.plan.map(M=>lo(M,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);y&&D(y,"[data-cancelar]",i)}return{abrir:c,get planManual(){return e},get comparativa(){return a}}}function lo(t,a){const e=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${l(z(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${l(t.mes)}</td>
    <td>${l(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${l(z(t.capitalAntes))}</td>
    <td class="num neg">${l(z(t.cantidadAmort))}${e}</td>
    <td class="num">${l(z(t.capitalDespues))}</td>
    ${a?`<td class="num" style="color:var(--text3)">${l(z(t.saldoDisponible))} → ${l(z(t.saldoDespues))}</td>`:""}
  </tr>`}function co(t){return`<div class="card mb-8" style="padding:12px">
    <div class="flex justify-between items-center mb-8">
      <span style="font-weight:600">${l(t.nombre)}</span>
      <span class="badge badge-yellow">${l(t.tin)}% TIN</span>
    </div>
    <div class="grid-4" style="gap:8px;font-size:12px">
      <div><div class="stat-label">Fecha fin</div>
        <div class="num" style="text-decoration:line-through;color:var(--text3)">${l(t.fechaFinSin)}</div>
        <div class="num pos">${l(t.fechaFinCon)}</div></div>
      <div><div class="stat-label">Plazo ahorrado</div><div class="num pos">${t.mesesAhorrados>0?`${t.mesesAhorrados}m`:"—"}</div></div>
      <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${l(z(t.ahorroIntereses))}</div></div>
      <div><div class="stat-label">${t.numAmortizaciones} amorts.</div><div class="num">${l(z(t.totalAmortizado))}</div></div>
    </div>
  </div>`}const Nn="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function qn(t){const a=t.hoy??J;let e=!1;const o=new Set;let s=null;const n=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},i=()=>t.store.get("escenarios"),r=f=>{var y;return((y=i().find(M=>M._id===f))==null?void 0:y.nombre)??f};function d(f){if(!f.activo||f.simulacion)return!1;const y=tt(f).tabla.filter(M=>!M.esAmortizacion);return y.length===0?!0:y[y.length-1].fecha<a()}function c(f,y){const M=a(),S=M.slice(0,7),C=new Map;let j=0;for(const E of f){if(!E.activo||E.simulacion||y.has(E._id)||(E.fechaInicio||"")>M)continue;const F=tt(E).tabla.filter(P=>!P.esAmortizacion&&P.fecha.startsWith(S)),w=F.length>0?F[0].cuota:0;C.set(E._id,w),j+=w}return{porLoan:C,total:j,activos:[...C.values()].filter(E=>E>0).length}}function x(f){const y=t.store.get("config"),M=y.dashboardStart,S=y.dashboardEnd,C=Math.max(1,(G(S).getTime()-G(M).getTime())/(30.44*864e5));let j=0;for(const E of f)!E.activo||E.simulacion||(j+=tt(E).tabla.filter(F=>!F.esAmortizacion&&F.fecha>=M&&F.fecha<=S).reduce((F,w)=>F+w.cuota,0));return{media:j/C,desde:M,hasta:S}}function p(f){const y=[...t.store.get("loans")].sort((P,T)=>T.tin-P.tin),M=new Set(y.filter(d).map(P=>P._id)),S=e?y:y.filter(P=>!M.has(P._id)),C=c(y,M),j=x(y),E=t.store.get("config"),F=t.store.get("inflacion"),w=new Date(G(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});f.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${M.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${M.size})</button>`:""}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${C.total>0||j.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${C.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${l(w)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${l(z(C.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${C.activos} préstamo${C.activos!==1?"s":""} activo${C.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${j.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${l(z(j.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${l(j.desde)} → ${l(j.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${S.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':S.map(P=>En(P,{periodos:F,usarInflacion:!!E.usarInflacion,hoy:a(),cuotaMes:C.porLoan.get(P._id)??0,completado:M.has(P._id),nombreEscenario:r})).join("")}
      </div>`;for(const P of f.querySelectorAll("[data-body-loan]"))o.has(P.dataset.bodyLoan??"")&&P.classList.add("open")}const u=()=>document.getElementById("modal-overlay"),v=()=>document.getElementById("modal-content"),b=()=>{var f;return(f=u())==null?void 0:f.classList.add("hidden")};function $(f,y){const M=u(),S=v();return!M||!S?null:(S.innerHTML=`<div class="modal-title">${l(f)}</div>${y}`,M.classList.remove("hidden"),D(S,"[data-cancelar]",b),S)}function A(f,y){const M=f?t.store.get("loans").find(C=>C._id===f)??null:null,S=$(f?"Editar préstamo":"Nuevo préstamo",Dn(M,t.store.get("accounts"),i(),a()));S&&(S.addEventListener("change",C=>{var j;(j=C.target)!=null&&j.matches("[data-dp-modo]")&&oo(S)}),D(S,"[data-guardar-loan]",C=>{m(S,C.getAttribute("data-guardar-loan")||"")&&(b(),y())}))}function m(f,y){const M=P=>{var T;return((T=f.querySelector(P))==null?void 0:T.value)??""},S=P=>{var T;return!!((T=f.querySelector(P))!=null&&T.checked)},C=M("#f-nombre").trim(),j=parseFloat(M("#f-capital")),E=parseFloat(M("#f-tin")),F=parseInt(M("#f-meses"),10);if(!C||!Number.isFinite(j)||!Number.isFinite(E)||!Number.isFinite(F))return q("Completa los campos obligatorios","err"),!1;const w={nombre:C,capital:j,tin:E,meses:F,fechaInicio:M("#f-fecha"),comisionApertura:parseFloat(M("#f-com-ap"))||0,comisionAmort:parseFloat(M("#f-com-am"))||0,diaPago:so(f),cuenta:M("#f-cuenta"),simulacion:S("#f-sim"),activo:S("#f-activo"),mostrarFechaFinEnDashboard:S("#f-mostrar-fin"),tipoTasa:M("#f-tipo-tasa"),basico:S("#f-basico"),tags:M("#f-tags").split(",").map(P=>P.trim()).filter(Boolean),escenarioIds:[...f.querySelectorAll(".loan-escenario:checked")].map(P=>P.value)};return y?(t.store.updateItem("loans",y,w),q("Préstamo actualizado")):(t.store.addItem("loans",{...w,amortizaciones:[]}),q("Préstamo creado")),n(),!0}function g(f,y,M){const S=t.store.get("loans").find(E=>E._id===f);if(!S)return;const C=y?(S.amortizaciones||[]).find(E=>E._id===y)??null:null,j=$(y?"Editar amortización":"Añadir amortización",Rn(f,C,i(),a()));j&&D(j,"[data-guardar-amort]",E=>{const[F,w]=(E.getAttribute("data-guardar-amort")||"").split("|");h(j,F,w)&&(b(),M([F]))})}function h(f,y,M){var T;const S=R=>{var N;return((N=f.querySelector(R))==null?void 0:N.value)??""},C=S("#am-fecha"),j=parseFloat(S("#am-cant"));if(!C||!Number.isFinite(j)||j<=0)return q("Fecha y cantidad requeridas","err"),!1;const E=t.store.get("loans").find(R=>R._id===y);if(!E)return!1;const F={fecha:C,cantidad:j,tipo:S("#am-tipo"),simulacion:!!((T=f.querySelector("#am-sim"))!=null&&T.checked),escenarioIds:[...f.querySelectorAll(".amort-escenario:checked")].map(R=>R.value)},w=E.amortizaciones||[],P=M?w.map(R=>R._id===M?{...R,...F}:R):[...w,{_id:Date.now().toString(36),...F}];return t.store.updateItem("loans",y,{amortizaciones:P}),q(M?"Amortización actualizada":"Amortización añadida"),n(),!0}function I(f,y,M){D(f,"[data-toggle-finalizados]",()=>{e=!e,y()}),D(f,"[data-nuevo-loan]",()=>A(null,y)),D(f,"[data-optimizar]",()=>M.abrir()),D(f,"[data-toggle-loan]",(S,C)=>{var w;if((w=C.target)!=null&&w.closest("button"))return;const j=S.getAttribute("data-toggle-loan"),E=[...f.querySelectorAll("[data-body-loan]")].find(P=>P.dataset.bodyLoan===j);(E==null?void 0:E.classList.toggle("open"))?o.add(j):o.delete(j)}),D(f,"[data-editar-loan]",S=>A(S.getAttribute("data-editar-loan"),y)),D(f,"[data-borrar-loan]",S=>{if(!X("¿Eliminar préstamo?"))return;const C=S.getAttribute("data-borrar-loan");t.store.removeItem("loans",C),o.delete(C),q("Eliminado"),n(),y()}),D(f,"[data-amort-loan]",S=>{const C=S.getAttribute("data-amort-loan");o.add(C),g(C,null,y)}),D(f,"[data-editar-amort]",S=>{const[C,j]=(S.getAttribute("data-editar-amort")||"").split("|");o.add(C),g(C,j,y)}),D(f,"[data-borrar-amort]",S=>{const[C,j]=(S.getAttribute("data-borrar-amort")||"").split("|"),E=t.store.get("loans").find(F=>F._id===C);E&&(t.store.updateItem("loans",C,{amortizaciones:(E.amortizaciones||[]).filter(F=>F._id!==j)}),q("Amortización eliminada"),n(),y([C]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Nn,mount(f){const y=(M=[])=>{for(const S of M)o.add(S);p(f)};s??(s=On({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(M,S)=>{t.store.updateItem("loans",M,{amortizaciones:S}),n()},hoy:a,refrescar:y})),p(f),f.dataset.wired!=="1"&&(I(f,y,s),f.dataset.wired="1")}}}const Ln={transporte:125,restaurante:220,otros:null},kn={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Bn=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],kt=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${l(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${l(o)}" placeholder="${l(s)}"/></div>`,Hn=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${l(e._id)}"${e._id===a?" selected":""}>${l(e.nombre)}</option>`).join("");function Gn(t,a){const e=t.map((n,i)=>{const r=a.find(x=>x._id===n.cuenta),d=Ln[n.tipo],c=d!=null&&n.importe>d;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${l(kn[n.tipo]??n.tipo)}</span>
        <span style="flex:1;font-size:12px">${l(z(n.importe))}/mes${c?` <span style="color:var(--red)" title="Supera el límite orientativo de ${l(z(d))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?l(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
        <button class="btn-danger btn-sm" data-flex-borrar="${i}">✕</button>
      </div>`}).join(""),o=a.filter(n=>(n.modeloFondo||"cuenta")!=="pension"&&n.activo!==!1),s=o.filter(n=>(n.modeloFondo||"cuenta")==="beneficio");return`<div style="margin-bottom:8px">${e||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin componentes. Añade transporte o restaurante.</div>'}</div>
    <div class="grid-3 mt-6" style="gap:6px">
      <select class="form-select" id="fc-tipo" style="font-size:12px">
        <option value="transporte">Transporte</option>
        <option value="restaurante">Restaurante</option>
        <option value="otros">Otros</option>
      </select>
      <input class="form-input" type="number" id="fc-importe" placeholder="€/mes" min="0" style="font-size:12px"/>
      <select class="form-select" id="fc-cuenta" style="font-size:12px">
        <option value="">Sin cuenta vinculada</option>
        ${o.map(n=>`<option value="${l(n._id)}">${l(n.nombre)}${(n.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${s.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function Vn(t,a){const e=a.hoy??J(),o=(t==null?void 0:t.nPagas)??12,s=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${kt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${kt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(n=>`<option value="${n}"${s&&o===n?" selected":""}>${n} pagas</option>`).join("")}
          <option value="custom"${s?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${Hn(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${kt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??e)}
          ${kt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${kt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${Bn.map((n,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${l(n)} (${i+1})</option>`).join("")}
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
          ${kt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??ze).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${ae(a.escenarios,(t==null?void 0:t.escenarioIds)??[],"nom-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${l((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function uo(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const d=parseFloat(e(i));return Number.isFinite(d)?d:r},s=e("#nf-npagas"),n=s==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(s,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:n,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",ze),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:a}}function Un(t,a,e,o){const s=uo(t,a),n=a.reduce((m,g)=>m+(g.importe||0)*12,0),i=Math.max(0,s.bruto-n),r=i*(s.ssPct/100),d=s.irpfModo==="manual"?i*(s.irpfPct/100):ut(Mt(s.bruto,n),e.tramos),c=i-r-d,x=i/s.nPagas,p=r/s.nPagas,u=d/s.nPagas,v=x-p-u,b=s.grupoNomina?e.nominas.filter(m=>m.grupoNomina===s.grupoNomina&&m._id!==o):[],$=b.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${l(s.grupoNomina)}" con ${l(b.map(m=>m.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",A=n>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${l(z(n))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${l(z(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${l(z(s.bruto))}</span>
      ${A}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${l(z(r))} (${s.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${l(z(d))} (${i>0?(d/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${l(z(c))}</span>
      ${n>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${l(z(n))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${l(z(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${s.representacion==="simplificado"?`ingreso ${l(z(v))}/paga`:`ingreso ${l(z(x))} − SS ${l(z(p))} − IRPF ${l(z(u))}`}${n>0?" + recargas flex":""}</span>
    </div>${$}`}function Yn(t,a,e,o){const s=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=Gn(a,e.accounts))},n=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=Un(t,a,e,o))},i=()=>{var d,c;const r=(x,p)=>{const u=t.querySelector(x);u&&(u.style.display=p?"":"none")};r("#nf-custom-pagas-wrap",((d=t.querySelector("#nf-npagas"))==null?void 0:d.value)==="custom"),r("#nf-irpfpct-wrap",((c=t.querySelector("#nf-irpfmodo"))==null?void 0:c.value)==="manual"),n()};t.addEventListener("input",r=>{var d;(d=r.target)!=null&&d.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&n()}),Y(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),D(t,"[data-flex-anadir]",()=>{var c,x,p;const r=((c=t.querySelector("#fc-tipo"))==null?void 0:c.value)||"transporte",d=parseFloat(((x=t.querySelector("#fc-importe"))==null?void 0:x.value)??"")||0;if(!d)return q("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:d,cuenta:((p=t.querySelector("#fc-cuenta"))==null?void 0:p.value)||""}),s(),n()}),D(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),s(),n()}),s(),n()}const po=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Jn(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??gt;function r(u,v){const b=o(),$=s();return!b||!$?null:($.innerHTML=`<div class="modal-title">${l(u)}</div>${v}`,b.classList.remove("hidden"),D($,"[data-cerrar]",n),$)}function d(){a=null;const u=[...t.store.get("tramosIRPFHistorico")].sort(($,A)=>$.año-A.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",b=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${l(po(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${u.map($=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${l(po($.tramos))}</span>
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
      </div>`);b&&(D(b,"[data-editar-tabla]",$=>{const A=$.getAttribute("data-editar-tabla");p(A==="default"?"default":Number(A))}),D(b,"[data-borrar-tabla]",$=>{const A=Number($.getAttribute("data-borrar-tabla"));X(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(m=>m.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),d())}),D(b,"[data-anadir-anyo]",()=>{var m;const $=parseInt(((m=b.querySelector("#irpf-new-year"))==null?void 0:m.value)??"",10);if(!$||$<2e3||$>2100)return q("Año inválido","err");const A=t.store.get("tramosIRPFHistorico");if(A.some(g=>g.año===$))return q("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...A,{_id:Date.now().toString(36),año:$,tramos:i().map(g=>[...g])}]),t.onDatosCambiados(),p($)}))}function c(){return e.map(([u,v],b)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${b}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${b}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${b}">✕</button>
          </div>
        </div>`).join("")}function x(u){e=[...u.querySelectorAll("[data-tr-min]")].map((b,$)=>{const A=u.querySelector(`[data-tr-pct="${$}"]`);return[parseFloat(b.value)||0,parseFloat((A==null?void 0:A.value)??"")||0]})}function p(u){var g;a=u;const v=t.store.get("tramosIRPFHistorico");e=(u==="default"?i():((g=v.find(h=>h.año===u))==null?void 0:g.tramos)??i()).map(h=>[...h]);const $=u==="default"?"tabla por defecto":`ejercicio ${u}`,A=r(`Tramos IRPF — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${l($)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${c()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!A)return;const m=()=>{const h=A.querySelector("#irpf-tramos-rows");h&&(h.innerHTML=c())};D(A,"[data-volver]",d),D(A,"[data-tr-anadir]",()=>{x(A),e.push([0,0]),m()}),D(A,"[data-tr-borrar]",h=>{x(A),e.splice(Number(h.getAttribute("data-tr-borrar")),1),m()}),D(A,"[data-tr-guardar]",()=>{x(A);const h=[...e].sort((I,f)=>I[0]-f[0]);if(h.length===0)return q("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:h}),q("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(I=>I.año===a?{...I,tramos:h}:I)),q(`Tabla ${a} guardada`)),t.onDatosCambiados(),d()})}return{abrir:d}}const mo=1500,Ft=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${l(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${l(o)}" placeholder="${l(s)}"/></div>`,Wn=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${l(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([s,n])=>`<option value="${l(s)}"${s===o?" selected":""}>${l(n)}</option>`).join("")}
   </select></div>`,Qn=t=>(t.modeloFondo||"cuenta")==="pension";function Kn(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(s=>Xn(s,a,e,o)).join("")}</div>`}function Xn(t,a,e,o){const s=de(t);if(!s)return"";const n=je(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(c=>c.fecha>=`${i}-01-01`).reduce((c,x)=>c+x.cantidad,0),d=Math.min(r,mo)*(n/100);return`<div class="card">
    <div class="flex justify-between items-center mb-10">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${l(t.nombre)}</span>
        <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
        ${t.grupoNomina?`<span class="badge badge-blue">Grupo: ${l(t.grupoNomina)}</span>`:""}
      </div>
      <div class="flex gap-8">
        <button class="btn-icon" data-editar-pension="${l(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger btn-sm" data-borrar-pension="${l(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2" style="gap:6px;margin-bottom:8px">
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${l(z(s.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${l(z(s.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${s.beneficio>=0?"pos":"neg"}">${l(z(s.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${l(z(s.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${l(z(s.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${l(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>mo?"neg":""}">${l(z(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${l(z(d))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${l(t.grupoNomina)}": ${n}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${s.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${l(s.proxDesbloqueo)}</div>`:""}
  </div>`}function Zn(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${l(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${l(z(e.importe))} / ${l(e.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${l(e.fechaFin||"indefinido")}</span>
        <button class="btn-danger btn-sm" data-aport-borrar="${o}">✕</button>
      </div>`).join("")||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin aportaciones programadas</div>'}</div>
    <div class="grid-2 mt-6" style="gap:6px">
      <input class="form-input" type="number" id="paport-importe" placeholder="Importe €" style="font-size:12px"/>
      <select class="form-select" id="paport-periodo" style="font-size:12px">
        ${[["mensual","Mensual"],["trimestral","Trimestral"],["semestral","Semestral"],["anual","Anual"]].map(([e,o])=>`<option value="${e}">${o}</option>`).join("")}
      </select>
    </div>
    <div class="grid-2 mt-4" style="gap:6px">
      <input class="form-input" type="date" id="paport-inicio" style="font-size:12px"/>
      <input class="form-input" type="date" id="paport-fin" style="font-size:12px"/>
    </div>
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function ti(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,s=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],n=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${Ft("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${Ft("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Ft("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${Ft("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${Ft("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${Wn("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${Ft("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${n?' style="display:none"':""}>
        ${Ft("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
      </div>
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Grupo (para IRPF marginal real)</label>
      <select class="form-select" id="pen-grupo">
        <option value="">Sin grupo — usar tipo fijo</option>
        ${s.map(i=>`<option value="${l(i)}"${(t==null?void 0:t.grupoNomina)===i?" selected":""}>${l(i)}</option>`).join("")}
      </select>
      ${s.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Crea grupos en las nóminas para poder seleccionarlos aquí.</div>':""}
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Aportaciones programadas</label>
      <div id="pen-aport-container"></div>
    </div>
    <div class="form-group mt-8"><label class="form-label">Descripción</label>
      <input class="form-input" type="text" id="pen-desc" value="${l((t==null?void 0:t.descripcion)??"")}" placeholder="Plan de pensiones..."/></div>
    <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
      <label class="form-label">Activo</label>
      <label class="toggle"><input type="checkbox" id="pen-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      <label class="form-label" style="margin-left:12px">Simulación</label>
      <label class="toggle"><input type="checkbox" id="pen-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
    </div>
    ${ae(a.escenarios,(t==null?void 0:t.escenarioIds)??[],"pen-escenario")}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${l((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function ei(t,a,e){const o=()=>{const s=t.querySelector("#pen-aport-container");s&&(s.innerHTML=Zn(a))};Y(t,"#pen-grupo",s=>{const n=t.querySelector("#pen-impuesto-wrap");n&&(n.style.display=s.value?"none":"")}),D(t,"[data-aport-anadir]",()=>{var n,i,r,d;const s=parseFloat(((n=t.querySelector("#paport-importe"))==null?void 0:n.value)??"")||0;if(!s)return q("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((d=t.querySelector("#paport-fin"))==null?void 0:d.value)||""}),o()}),D(t,"[data-aport-borrar]",s=>{a.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function ai(t,a,e,o){var A;const s=m=>{var g;return((g=t.querySelector(m))==null?void 0:g.value)??""},n=(m,g=0)=>{const h=parseFloat(s(m));return Number.isFinite(h)?h:g},i=m=>{var g;return!!((g=t.querySelector(m))!=null&&g.checked)},r=s("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const d=n("#pen-saldo"),c=s("#pen-grupo"),x={nombre:r,grupoNomina:c,saldo:d,saldoInicial:n("#pen-saldo-ini"),fechaInicialSaldo:s("#pen-fecha-ini")||o,interes:n("#pen-interes"),periodoCobro:s("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(s("#pen-bloqueo"),10)||120,impuestoRetirada:c?0:n("#pen-impuesto"),planAportaciones:a,descripcion:s("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(m=>m.value)},p=[...(e==null?void 0:e.historicoSaldos)??[]],u=[...(e==null?void 0:e.aportaciones)??[]],b=((A=[...p].sort((m,g)=>g.fecha.localeCompare(m.fecha))[0])==null?void 0:A.saldo)??(e==null?void 0:e.saldo)??null,$=Date.now().toString(36);return e?(b===null||Math.abs(d-b)>.005)&&(p.push({_id:$,fecha:o,saldo:d,nota:"Actualización manual"}),d>(b??0)&&u.push({_id:`${$}a`,fecha:o,cantidad:d-(b??0)})):d>0&&(p.push({_id:$,fecha:o,saldo:d,nota:"Saldo inicial"}),u.push({_id:`${$}a`,fecha:x.fechaInicialSaldo??o,cantidad:d})),{datos:{...x,historicoSaldos:p,aportaciones:u}}}const oi="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function si(t){const a=t.hoy??J,e=()=>{var A;return(A=t.onDatosCambiados)==null?void 0:A.call(t)};function o(){const A=t.store.get("config");return bt(t.store.get("tramosIRPFHistorico"),A.tramos_irpf??gt)(Number(a().slice(0,4)))}function s(A,m,g){const h=Fe(A,m,g),I=!!m&&A.irpfModo!=="manual",f=[A.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${A.mesActualizacionIPC}">IPC m${A.mesActualizacionIPC}</span>`:"",h.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${l(z(h.flexAnual))}/año</span>`:"",Math.abs(h.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${h.ssPct.toFixed(2)}%</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${l(A.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${f}</div>
      </div>
      <div class="num">${l(z(h.brutoAnual))}
        ${h.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${l(z(h.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${l(z(h.netoPorPaga))}/paga neto</div></div>
      <div class="text-sm">${h.nPagas} pagas</div>
      <div class="text-sm ${I?"neg":""}">${A.irpfModo==="manual"?`${l(A.irpfPct??0)}% (manual)`:`${h.irpfPct.toFixed(1)}% (auto)`}${I?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${A.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${l(n(A.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${l(A._id)}"${A.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${l(A._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${l(A._id)}">✕</button>
      </div>
    </div>`}const n=A=>{var m;return((m=t.store.get("accounts").find(g=>g._id===(A||"default")))==null?void 0:m.nombre)??(A||"default")};function i(A,m,g){const h=m.reduce((y,M)=>y+(M.bruto||0),0),I=Qo(m,g),f=h>0?I/h*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${l(A)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${l(z(h))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${f.toFixed(1)}%</strong> (${l(z(I))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${m.map(y=>s(y,m,g)).join("")}
      </div>
    </div>`}function r(A){const m=o(),g=[...t.store.get("nominas")].sort((M,S)=>(S.bruto||0)-(M.bruto||0)),{grupos:h,sueltas:I}=Xo(g),f=t.store.get("accounts").filter(Qn),y=g.filter(M=>M.activo!==!1);A.innerHTML=`
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
      ${[...h.entries()].map(([M,S])=>i(M,S,m)).join("")}
      ${I.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${I.map(M=>s(M,null,m)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Kn(f,y,m,a())}</div>`}const d=()=>document.getElementById("modal-overlay"),c=()=>document.getElementById("modal-content"),x=()=>{var A;return(A=d())==null?void 0:A.classList.add("hidden")};function p(A,m){const g=d(),h=c();return!g||!h?null:(h.innerHTML=`<div class="modal-title">${l(A)}</div>${m}`,g.classList.remove("hidden"),D(h,"[data-cancelar]",x),h)}function u(A,m){const g=A?t.store.get("nominas").find(y=>y._id===A)??null:null,h=[...(g==null?void 0:g.retribucionFlexible)??[]].map(y=>({...y})),I={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:o(),hoy:a()},f=p(A?"Editar nómina":"Nueva nómina",Vn(g,I));f&&(Yn(f,h,I,A??""),D(f,"[data-guardar-nomina]",y=>{const M=uo(f,h);if(!M.nombre||M.bruto<=0)return q("Nombre y bruto anual son obligatorios","err");const S=y.getAttribute("data-guardar-nomina")||"",C={...M,activo:!0,tags:["nomina"]};S?(t.store.updateItem("nominas",S,C),q("Nómina actualizada")):(t.store.addItem("nominas",C),q("Nómina creada")),e(),x(),m()}))}function v(A,m){const g=A?t.store.get("accounts").find(f=>f._id===A)??null:null,h=[...(g==null?void 0:g.planAportaciones)??[]].map(f=>({...f})),I=p(A?"Editar plan de pensiones":"Nuevo plan de pensiones",ti(g,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:a()}));I&&(ei(I,h,a()),D(I,"[data-guardar-pension]",f=>{const{datos:y,error:M}=ai(I,h,g,a());if(M)return q(M,"err");const S=f.getAttribute("data-guardar-pension")||"";S?(t.store.updateItem("accounts",S,y),q("Plan actualizado")):(t.store.addItem("accounts",y),q("Plan creado")),e(),x(),m()}))}function b(A,m,g){D(A,"[data-nueva-nomina]",()=>u(null,m)),D(A,"[data-editar-nom]",h=>u(h.getAttribute("data-editar-nom"),m)),D(A,"[data-borrar-nom]",h=>{X("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",h.getAttribute("data-borrar-nom")),q("Eliminada"),e(),m())}),Y(A,"[data-activo-nom]",h=>{const I=h;t.store.updateItem("nominas",I.getAttribute("data-activo-nom"),{activo:I.checked}),e(),m()}),D(A,"[data-tramos]",()=>g.abrir()),D(A,"[data-nueva-pension]",()=>v(null,m)),D(A,"[data-editar-pension]",h=>v(h.getAttribute("data-editar-pension"),m)),D(A,"[data-borrar-pension]",h=>{X("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",h.getAttribute("data-borrar-pension")),q("Plan eliminado"),e(),m())})}let $=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:oi,mount(A){const m=()=>r(A);$??($=Jn({store:t.store,onDatosCambiados:()=>{e(),m()},año:()=>Number(a().slice(0,4))})),r(A),A.dataset.wired!=="1"&&(b(A,m,$),A.dataset.wired="1")}}}const ni="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",ii="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",fo={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},ri={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function li(t,a){const e=t.filter(d=>d.activo&&mt(d)==="inversion");if(e.length===0)return"";let o=0,s=0,n=0,i=0;for(const d of e){const c=Dt(d,a);c&&(o+=c.saldo,s+=c.costBase,n+=c.plusvalia,i+=c.impuesto)}const r=s>0?(n/s*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${l(z(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${l(z(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${l(r)}%)</div><div class="stat-value ${n>=0?"pos":"neg"}">${l(z(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${l(z(i))}</div><div class="stat-sub">Neto: ${l(z(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function ci(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,s=Math.max(1,(G(o).getTime()-G(e).getTime())/(30.44*864e5)),n=Vt(t,e),i=n*(Math.pow(1+t.interes/100,s/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const d=n*(pt(a.inflacion,e,o)-1),c=i-d;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${l(z(d))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${c>=0?"var(--accent)":"var(--red)"};font-weight:600">${l(z(c))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${l(e.slice(0,7))} → ${l(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${l(z(i))}</span>
    </div>${r}
  </div>`}function di(t,a){const e=fo[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,s=a.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(b=>b.cuenta===t._id).map(b=>({nomina:v,importe:b.importe}))),n=s.reduce((v,b)=>v+b.importe,0),i=n*12,r=o!==null&&i>o,d=o!==null?Math.min(i,o):i,c=t.grupoNomina?a.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):s.slice(0,1).map(v=>v.nomina),x=ga(c,a.tramosIRPF),p=d*x/100,u=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${x}%`:`tipo marginal ${x}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${l(e.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${l(z(n))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${l(z(i))}/año${r?` ⚠ excede límite ${l(z(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${l(z(o))}/año</span></div>`:""}
    ${p>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${l(u)}">≈ ${l(z(p))}/año <span style="font-size:10px;color:var(--text3)">(${l(x)}%)</span></span></div>`:""}
    ${s.length>0?s.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${l(v.nomina.nombre)}: ${l(z(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function ui(t){const a=de(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${l(z(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${l(z(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${l(z(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${l(z(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${l(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${l(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function pi(t,a){const e=Dt(t,a.tramosGanancias);if(!e)return"";const o=a.config,s=a.flujos(t._id),n=G(o.dashboardStart),i=G(o.dashboardEnd),r=Math.max(0,(i.getTime()-n.getTime())/(30.44*864e5)),d=e.saldo+s.totalAportaciones-s.totalReembolsos,c=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,x=d>0&&r>0?Math.max(0,d*Math.pow(1+c,r)):Math.max(0,d),p=e.costBase+s.totalAportaciones,u=Math.max(0,x-p),v=Ce(u,a.tramosGanancias),b=u>0?(v/u*100).toFixed(1):"0",$=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",A=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",m=(M,S,C)=>M.map(j=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${S} ${l(j.contraparte)}: ${l(j.concepto)}</span>
          <span class="num ${C}">${l(z(j.total))} · ${j.ocurrencias} mov.</span>
        </div>`).join(""),h=s.entradas.length>0||s.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${l(o.dashboardStart.slice(0,7))} → ${l(o.dashboardEnd.slice(0,7))})</div>
         ${m(s.entradas,"↓","pos")}
         ${m(s.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${s.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${l(z(s.totalAportaciones))}</span></div>`:""}
           ${s.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${l(z(s.totalReembolsos))}</span></div>`:""}
           ${s.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${l(z(s.retencion))}</span></div>`:s.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',I=a.invModo(t._id),f=M=>`padding:3px 10px;border-radius:20px;border:1px solid ${M?"var(--accent)":"var(--border)"};background:${M?"var(--accent-dim)":"transparent"};color:${M?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,y=I==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${l(z(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${l(z(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${l(z(e.neto))}</div><div class="stat-sub">${l(A)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${l(z(p))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${l(z(x))}</div><div class="stat-sub">${l($)} · ${l(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${l(z(x-v))}</div><div class="stat-sub">${l(b)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${l(t._id)}|real" style="${f(I==="real")}">Real</button>
          <button data-inv-modo="${l(t._id)}|proyeccion" style="${f(I==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${y}
      ${h}
    </div>`}function mi(t,a){const e=[...t.historicoSaldos||[]].sort((d,c)=>c.fecha.localeCompare(d.fecha)),o=e[0],s=rt(t),n=mt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",n==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",n==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",n==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${l((fo[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(d=>`<span class="badge badge-yellow">🔭 ${l(a.nombreEscenario(d))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${l(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${l(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${l(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${ii}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${l(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${ni}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${l(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${l(z(t.saldoInicial||0))}</div><div class="stat-sub">${l(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${l(z(s))}</div>${o?`<div class="stat-sub">Registro: ${l(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${l(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${l(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${ci(t,a)}
    ${n==="beneficio"?di(t,a):""}
    ${n==="pension"?ui(t):""}
    ${n==="inversion"?pi(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${l(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${l(t.descripcion)}</div>`:""}
  </div>`}const fi=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function vi(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${l(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${l(z(e.importe))} / ${l(e.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${l(e.fechaFin||"indefinido")}</span>
        <button class="btn-danger btn-sm" data-aport-borrar="${o}">✕</button>
      </div>`).join("")||'<div style="font-size:12px;color:var(--text3);padding:4px 0">Sin aportaciones programadas</div>'}</div>
    <div class="grid-2 mt-6" style="gap:6px">
      <input class="form-input" type="number" id="aport-importe" placeholder="Importe €" style="font-size:12px"/>
      <select class="form-select" id="aport-periodo" style="font-size:12px">
        ${[["mensual","Mensual"],["trimestral","Trimestral"],["semestral","Semestral"],["anual","Anual"]].map(([e,o])=>`<option value="${e}">${o}</option>`).join("")}
      </select>
    </div>
    <div class="grid-2 mt-4" style="gap:6px">
      <input class="form-input" type="date" id="aport-inicio" style="font-size:12px"/>
      <input class="form-input" type="date" id="aport-fin" style="font-size:12px"/>
    </div>
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function gi(t,a){const e=t?mt(t):"cuenta",o=[...new Set(a.nominas.filter(n=>n.grupoNomina).map(n=>n.grupoNomina))],s=n=>n?"":' style="display:none"';return`
    <div class="grid-2">
      ${Z("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Lt("ac-modelo","Tipo",fi,e)}
    </div>
    <div class="grid-2 mt-8">
      ${Z("ac-saldo","Saldo actual (€)","number",a.saldoActual,"5000")}
      ${Z("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Z("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${Z("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
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
        <div id="ac-inversion-hint"${s(e==="inversion")}>
          <div class="auth-hint mt-8" style="border-color:#10b981">
            📈 <strong>Fondo de inversión:</strong> la tarjeta muestra la plusvalía latente y el impuesto estimado
            sobre ganancias de capital con los tramos configurados en esta misma vista.
          </div>
        </div>
        <div id="ac-beneficio-fields"${s(e==="beneficio")}>
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
              ${o.map(n=>`<option value="${l(n)}"${(t==null?void 0:t.grupoNomina)===n?" selected":""}>${l(n)}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Aportaciones programadas</label>
          <div id="ac-aport-container"></div>
        </div>
        <div class="form-group mt-8"><label class="form-label">Descripción</label>
          <input class="form-input" type="text" id="ac-desc" value="${l((t==null?void 0:t.descripcion)??"")}" placeholder="Fondo indexado global..."/></div>
        <div class="form-row mt-8">
          <label class="form-label">Simulación</label>
          <label class="toggle"><input type="checkbox" id="ac-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
        </div>
        ${ae(a.escenarios,(t==null?void 0:t.escenarioIds)??[],"ac-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${l((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function bi(t,a,e){const o=()=>{const s=t.querySelector("#ac-aport-container");s&&(s.innerHTML=vi(a))};Y(t,"#ac-modelo",s=>{const n=s.value,i=(r,d)=>{const c=t.querySelector(r);c&&(c.style.display=d?"":"none")};i("#ac-inversion-hint",n==="inversion"),i("#ac-beneficio-fields",n==="beneficio")}),D(t,"[data-aport-anadir]",()=>{var n,i,r,d;const s=parseFloat(((n=t.querySelector("#aport-importe"))==null?void 0:n.value)??"")||0;if(!s)return q("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((d=t.querySelector("#aport-fin"))==null?void 0:d.value)||""}),o()}),D(t,"[data-aport-borrar]",s=>{a.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function hi(t,a,e,o,s){const n=b=>{var $;return(($=t.querySelector(b))==null?void 0:$.value)??""},i=(b,$=0)=>{const A=parseFloat(n(b));return Number.isFinite(A)?A:$},r=b=>{var $;return!!(($=t.querySelector(b))!=null&&$.checked)},d=n("#ac-nombre").trim();if(!d)return{datos:{},error:"Nombre obligatorio"};const c=n("#ac-modelo")||"cuenta",x=c==="beneficio",p=i("#ac-saldo"),u={nombre:d,saldo:p,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:n("#ac-fecha-ini")||s,interes:i("#ac-interes"),periodoCobro:n("#ac-periodo")||"mensual",descripcion:n("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(b=>b.value),modeloFondo:c,planAportaciones:a,tipoBeneficio:x?n("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:x?n("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&p<=0)return{datos:u};if(!(o===null||Math.abs(p-o)>.005))return{datos:u};if(c==="inversion"&&p>(o??0)){const b=Date.now().toString(36);u.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${b}a`,fecha:e?s:u.fechaInicialSaldo??s,cantidad:p-(o??0)}]}return{datos:u,punto:{fecha:s,saldo:p,nota:e?"Actualización manual":"Saldo inicial"}}}function Ue(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:ot(a.saldoCts),nota:a.nota}))}function yi(t,a,e,o,s){const n=e.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${l(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${l(z(i.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${l(i.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${l(a)}|${l(i._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${l(a)}|${l(i._id)}">✕</button>
      </div>`).join("");return`
    <div class="card-title">Histórico — ${l(t)}</div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${e.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':n}
    </div>
    <div class="divider"></div>
    <div class="card-title">Añadir punto de control</div>
    <div class="grid-3">
      <div class="form-group"><label class="form-label">Fecha</label>
        <input class="form-input" type="date" id="hi-fecha" value="${l(s)}"/></div>
      <div class="form-group"><label class="form-label">Saldo real (€)</label>
        <input class="form-input" type="number" id="hi-saldo" placeholder="5000"/></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="hi-nota" placeholder="Extracto enero..."/></div>
    </div>
    <div class="flex gap-8 mt-12" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cerrar</button>
      <button class="btn-primary" data-hist-anadir="${l(a)}">Añadir</button>
    </div>`}const vo=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function xi(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??jt;function r(u,v){const b=o(),$=s();return!b||!$?null:($.innerHTML=`<div class="modal-title">${l(u)}</div>${v}`,b.classList.remove("hidden"),D($,"[data-cerrar]",n),$)}function d(){a=null;const u=[...t.store.get("tramosGananciasCapitalHistorico")].sort(($,A)=>$.año-A.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",b=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${l(vo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${u.map($=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${l(vo($.tramos))}</span>
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
      </div>`);b&&(D(b,"[data-editar-tg]",$=>{const A=$.getAttribute("data-editar-tg");p(A==="default"?"default":Number(A))}),D(b,"[data-borrar-tg]",$=>{const A=Number($.getAttribute("data-borrar-tg"));X(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(m=>m.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),d())}),D(b,"[data-anadir-anyo-tg]",()=>{var m;const $=parseInt(((m=b.querySelector("#tg-new-year"))==null?void 0:m.value)??"",10);if(!$||$<2e3||$>2100)return q("Año inválido","err");const A=t.store.get("tramosGananciasCapitalHistorico");if(A.some(g=>g.año===$))return q("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...A,{_id:Date.now().toString(36),año:$,tramos:i().map(g=>[...g])}]),t.onDatosCambiados(),p($)}))}function c(){return e.map(([u,v],b)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${b}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${b}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${b}">✕</button>
          </div>
        </div>`).join("")}function x(u){e=[...u.querySelectorAll("[data-tg-min]")].map((v,b)=>{const $=u.querySelector(`[data-tg-pct="${b}"]`);return[parseFloat(v.value)||0,parseFloat(($==null?void 0:$.value)??"")||0]})}function p(u){var m;a=u;const v=t.store.get("tramosGananciasCapitalHistorico");e=(u==="default"?i():((m=v.find(g=>g.año===u))==null?void 0:m.tramos)??i()).map(g=>[...g]);const $=r(`Ganancias de capital — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${c()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!$)return;const A=()=>{const g=$.querySelector("#tg-rows");g&&(g.innerHTML=c())};D($,"[data-volver-tg]",d),D($,"[data-tg-anadir]",()=>{x($),e.push([0,0]),A()}),D($,"[data-tg-borrar]",g=>{x($),e.splice(Number(g.getAttribute("data-tg-borrar")),1),A()}),D($,"[data-tg-guardar]",()=>{x($);const g=[...e].sort((h,I)=>h[0]-I[0]);if(g.length===0)return q("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:g}),q("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(h=>h.año===a?{...h,tramos:g}:h)),q(`Tabla ${a} guardada`)),t.onDatosCambiados(),d()})}return{abrir:d}}const Ye=["#2ee6a8","#4d9fff","#ffb020","#ff6b6b","#a855f7","#fb923c"],$i="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z";function Ii(t){const a=()=>document.getElementById("modal-overlay"),e=()=>document.getElementById("modal-content"),o=()=>{var c;return(c=a())==null?void 0:c.classList.add("hidden")};function s(c,x,p,u){const v=ca(c,p,u),b=c.targetAmount||0,$=b>0?Math.min(100,v/b*100):0,A=!c.completado&&b>0&&v>=b,m=c.targetDate?Math.max(0,Math.round((G(c.targetDate).getTime()-G(t.hoy()).getTime())/(30.44*864e5))):null,g=m!==null&&m>0?Math.max(0,b-v)/m:null,h=!c.completado&&!A?da(c,p,{extractoCuenta:t.extractoCuenta,colchonEnFecha:t.colchonEnFecha,hoy:G(t.hoy())}):null,I=(c.cuentaIds||[]).length>0?(c.cuentaIds||[]).map(C=>{var j;return((j=p.find(E=>E._id===C))==null?void 0:j.nombre)??C}).join(", "):"Todas las cuentas activas",f=[c.completado?'<span class="badge badge-active">✓ Completado</span>':"",A?'<span class="badge" style="background:rgba(46,230,168,0.2);color:var(--accent)">🎉 ¡Meta alcanzada!</span>':"",c.usarColchon!==!1?'<span class="badge badge-inactive" title="Colchón descontado del saldo">🛡 −colchón</span>':""].join(""),y=$>=100?"var(--accent)":$>=70?"var(--yellow)":"var(--text2)",M=["card mb-8",c.completado?"goal-completado":"",A?"goal-alcanzado":""].filter(Boolean).join(" "),S=[g!==null?`<span>Necesitas ${l(z(g))}/mes</span>`:"",c.targetDate?`<span>Meta fijada: ${l(c.targetDate)}</span>`:"",h?`<span style="color:var(--accent)">📈 Estimado: ${l(h)}</span>`:!c.completado&&!A?'<span style="color:var(--text3)">Sin proyección</span>':"",c.usarColchon!==!1?`<span>Colchón: ${l(z(u))}</span>`:"",`<span>Cuentas: ${l(I)}</span>`].join("");return`<div class="${M}" style="padding:14px;border:1px solid ${A?"var(--accent)":"var(--border)"}">
      <div class="flex justify-between items-center mb-8">
        <div class="flex gap-8 items-center flex-wrap">
          <span class="goal-priority-badge">#${l(c.prioridad||x+1)}</span>
          <span style="font-weight:600;font-size:14px${c.completado?";text-decoration:line-through;color:var(--text3)":""}">${l(c.nombre)}</span>
          ${f}
        </div>
        <div class="flex gap-8">
          ${A?`<button class="btn-primary btn-sm" data-completar-goal="${l(c._id)}">Marcar completado</button>`:""}
          <button class="btn-icon" data-editar-goal="${l(c._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${$i}"/></svg></button>
          <button class="btn-danger btn-sm" data-borrar-goal="${l(c._id)}">✕</button>
        </div>
      </div>
      <div class="flex justify-between mb-4">
        <span class="text-sm">${l(z(v))} / ${l(z(b))}</span>
        <span class="text-sm" style="color:${y}">${$.toFixed(0)}%${m!==null?` · ${m}m restantes`:""}</span>
      </div>
      <div class="goal-bar"><div class="goal-bar-fill" style="width:${$}%;background:${l(c.color||"var(--accent)")}"></div></div>
      <div class="flex gap-12 mt-8 flex-wrap" style="font-size:11px;color:var(--text3)">${S}</div>
    </div>`}function n(c){const x=[...t.store.get("goals")].sort((v,b)=>(v.prioridad||99)-(b.prioridad||99)),p=t.store.get("accounts"),u=t.colchonEnFecha(t.hoy());c.innerHTML=`
      <div class="flex justify-between items-center mb-12">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro</div>
        <button class="btn-primary btn-sm" data-nuevo-goal>+ Objetivo</button>
      </div>
      ${x.length===0?'<div class="text-sm" style="color:var(--text3)">Sin objetivos. Define metas de ahorro para seguirlas aquí y en el Dashboard.</div>':x.map((v,b)=>s(v,b,p,u)).join("")}`}function i(c){const x=t.store.get("accounts").filter($=>$.activo&&!$.simulacion),p=t.store.get("goals"),u=c?c.prioridad||1:Math.max(0,...p.map($=>$.prioridad||0))+1,v=(c==null?void 0:c.color)||Ye[0],b=x.map($=>`<label style="display:flex;gap:8px;align-items:center;font-size:13px;cursor:pointer">
          <input type="checkbox" class="goal-acc-check" value="${l($._id)}"${((c==null?void 0:c.cuentaIds)||[]).includes($._id)?" checked":""}/>
          ${l($.nombre)}
        </label>`).join("");return`
      <div class="form-group"><label class="form-label">Nombre del objetivo</label>
        <input class="form-input" type="text" id="goal-nombre" value="${l((c==null?void 0:c.nombre)??"")}" placeholder="Ej: Fondo de emergencia"/></div>
      <div class="grid-2 mt-8">
        <div class="form-group"><label class="form-label">Importe objetivo (€)</label>
          <input class="form-input" type="number" id="goal-amount" value="${l((c==null?void 0:c.targetAmount)??"")}" placeholder="10000"/></div>
        <div class="form-group"><label class="form-label">Fecha límite (opcional)</label>
          <input class="form-input" type="date" id="goal-date" value="${l((c==null?void 0:c.targetDate)??"")}"/></div>
      </div>

      <details class="form-advanced mt-12"${c?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="form-group mt-8"><label class="form-label">Prioridad (1 = mayor)</label>
            <input class="form-input" type="number" id="goal-prio" value="${l(u)}" placeholder="1"/></div>
          <div class="form-group mt-8">
            <label class="form-label">Cuentas a considerar (vacío = todas las activas)</label>
            <div style="display:flex;flex-direction:column;gap:6px;padding:8px;background:var(--bg3);border-radius:var(--radius)">
              ${b||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
            </div>
          </div>
          <div class="form-row mt-8">
            <label class="form-label">Descontar colchón económico</label>
            <label class="toggle"><input type="checkbox" id="goal-colchon"${(c==null?void 0:c.usarColchon)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
            <span class="text-sm" style="margin-left:6px;color:var(--text3)">Muestra el excedente sobre el mínimo de seguridad</span>
          </div>
          <div class="form-row mt-8">
            <label class="form-label">Marcar como completado</label>
            <label class="toggle"><input type="checkbox" id="goal-completado"${c!=null&&c.completado?" checked":""}/><span class="toggle-slider"></span></label>
          </div>
          <div class="form-group mt-8"><label class="form-label">Color</label>
            <select class="form-select" id="goal-color">
              ${Ye.map($=>`<option value="${$}"${$===v?" selected":""}>${$}</option>`).join("")}
            </select></div>
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-goal="${l((c==null?void 0:c._id)??"")}">Guardar</button>
      </div>`}function r(c,x){const p=c?t.store.get("goals").find(b=>b._id===c)??null:null,u=a(),v=e();!u||!v||(v.innerHTML=`<div class="modal-title">${c?"Editar objetivo":"Nuevo objetivo"}</div>${i(p)}`,u.classList.remove("hidden"),D(v,"[data-cancelar]",o),D(v,"[data-guardar-goal]",b=>{var h,I;const $=f=>{var y;return((y=v.querySelector(f))==null?void 0:y.value)??""},A=$("#goal-nombre").trim();if(!A)return q("Nombre obligatorio","err");const m={nombre:A,targetAmount:parseFloat($("#goal-amount"))||0,targetDate:$("#goal-date")||null,prioridad:parseInt($("#goal-prio"),10)||1,color:$("#goal-color")||Ye[0],usarColchon:!!((h=v.querySelector("#goal-colchon"))!=null&&h.checked),completado:!!((I=v.querySelector("#goal-completado"))!=null&&I.checked),cuentaIds:[...v.querySelectorAll(".goal-acc-check:checked")].map(f=>f.value)},g=b.getAttribute("data-guardar-goal")||"";g?(t.store.updateItem("goals",g,m),q("Actualizado")):(t.store.addItem("goals",m),q("Objetivo creado")),t.onDatosCambiados(),o(),x()}))}function d(c,x){D(c,"[data-nuevo-goal]",()=>r(null,x)),D(c,"[data-editar-goal]",p=>r(p.getAttribute("data-editar-goal"),x)),D(c,"[data-borrar-goal]",p=>{X("¿Eliminar objetivo?")&&(t.store.removeItem("goals",p.getAttribute("data-borrar-goal")),q("Objetivo eliminado"),t.onDatosCambiados(),x())}),D(c,"[data-completar-goal]",p=>{t.store.updateItem("goals",p.getAttribute("data-completar-goal"),{completado:!0}),q("Objetivo marcado como completado ✓"),t.onDatosCambiados(),x()})}return{render:n,wire:d}}const Ai="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Mi=120;function Si(t){const a=t.hoy??J,e=()=>{var F;return(F=t.onDatosCambiados)==null?void 0:F.call(t)},o=t.mostrarObjetivos??(()=>!0),s=new Map,n=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),r=F=>{var w;return((w=i().find(P=>P._id===F))==null?void 0:w.nombre)??F},d=F=>{var w;return((w=t.store.get("accounts").find(P=>P._id===F))==null?void 0:w.nombre)??F},c=()=>bt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??gt)(Number(a().slice(0,4))),x=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??jt),p=()=>x()(Number(a().slice(0,4))),u=F=>Fa(t.store.get("expenses"),n(),t.store.get("loans"),F);function v(){const F=n(),w=t.store.get("accounts"),P=Jt({loans:[],expenses:t.store.get("expenses").filter(k=>k.tipo==="transferencia"),accounts:w,config:{dashboardStart:F.dashboardStart,dashboardEnd:F.dashboardEnd,fechaReferencia:F.dashboardStart},nominas:[],resolverTramosGanancias:x()}),T=new Map,R=k=>{let L=T.get(k);return L||(L={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},T.set(k,L)),L},N=(k,L)=>{const B=`${L.sourceId}`,O=k.find(U=>U.concepto===B),H=O??{concepto:B,contraparte:"",total:0,ocurrencias:0};H.total+=Math.abs(L.cuantia),H.ocurrencias+=1,O||k.push(H)};for(const k of P){if(!k.cuenta)continue;const L=R(k.cuenta);k.sourceType==="transfer-in"||k.sourceType==="traspaso-in"?(L.totalAportaciones+=Math.abs(k.cuantia),N(L.entradas,k)):k.sourceType==="transfer-out"||k.sourceType==="traspaso-out"?(L.totalReembolsos+=Math.abs(k.cuantia),N(L.salidas,k)):k.sourceType==="investment-tax"&&(L.retencion+=Math.abs(k.cuantia))}const _=t.store.get("expenses");for(const k of T.values())for(const[L,B]of[[k.entradas,"cuenta"],[k.salidas,"cuentaDestino"]])for(const O of L){const H=_.find(U=>U._id===O.concepto);O.contraparte=d((H==null?void 0:H[B])??"default"),O.concepto=(H==null?void 0:H.concepto)||(B==="cuenta"?"Aportación":"Reembolso")}return T}function b(){const F=new Map,w=n(),P=a(),T=new Date(Number(P.slice(0,4)),Number(P.slice(5,7))-1+Mi+1,0),R=`${T.getFullYear()}-${String(T.getMonth()+1).padStart(2,"0")}-${String(T.getDate()).padStart(2,"0")}`;return N=>{const _=F.get(N._id);if(_)return _;const k=Jt({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...w,dashboardStart:P,dashboardEnd:R,fechaReferencia:P},filtroAccounts:[N._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),w.tramos_irpf??gt),resolverTramosGanancias:x()}).map(L=>({fecha:L.fecha,saldoAcum:L.saldoAcum}));return F.set(N._id,k),k}}const $=Ii({store:t.store,colchonEnFecha:u,extractoCuenta:F=>A(F),hoy:a,onDatosCambiados:e});let A=b();function m(F){A=b();const P=t.store.get("accounts").filter(_=>mt(_)!=="pension"),T=v(),R={config:n(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:c(),tramosGanancias:p(),nombreEscenario:r,flujos:_=>T.get(_)??ri,invModo:_=>s.get(_)??"proyeccion"};F.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${li(P,R.tramosGanancias)}
      <div class="grid-3">${P.map(_=>mi(_,R)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const N=F.querySelector("#goals-section");N&&$.render(N)}const g=()=>document.getElementById("modal-overlay"),h=()=>document.getElementById("modal-content"),I=()=>{var F;return(F=g())==null?void 0:F.classList.add("hidden")};function f(F,w){const P=g(),T=h();return!P||!T?null:(T.innerHTML=F?`<div class="modal-title">${l(F)}</div>${w}`:w,P.classList.remove("hidden"),D(T,"[data-cancelar]",I),T)}function y(F,w){const P=F?t.store.get("accounts").find(_=>_._id===F)??null:null,T=[...(P==null?void 0:P.planAportaciones)??[]].map(_=>({..._})),R=P?M(P):null,N=f(F?"Editar cuenta / fondo":"Nueva cuenta / fondo",gi(P,{escenarios:i(),nominas:t.store.get("nominas"),hoy:a(),saldoActual:R??0}));N&&(bi(N,T,a()),D(N,"[data-guardar-acc]",_=>{const k=_.getAttribute("data-guardar-acc")||"",{datos:L,punto:B,error:O}=hi(N,T,P,R,a());if(O)return q(O,"err");let H=k;k?t.store.updateItem("accounts",k,L):H=t.store.addItem("accounts",L)._id,B&&t.ledger.registrarPuntoControl(H,B.fecha,B.saldo,B.nota),q(k?"Actualizada":"Cuenta / fondo creado"),e(),I(),w()}))}function M(F){const w=t.ledger.puntosControl(F._id);return w.length>0?Ue(w)[0].saldo:F.saldo??null}function S(F,w){const P=t.store.get("accounts").find(N=>N._id===F);if(!P)return;const T=f("Histórico de saldos",yi(P.nombre,F,Ue(t.ledger.puntosControl(F)),P.saldoInicial||0,a()));if(!T)return;const R=()=>{w(),S(F,w)};D(T,"[data-hist-anadir]",()=>{var L,B,O;const N=((L=T.querySelector("#hi-fecha"))==null?void 0:L.value)??"",_=parseFloat(((B=T.querySelector("#hi-saldo"))==null?void 0:B.value)??""),k=((O=T.querySelector("#hi-nota"))==null?void 0:O.value.trim())??"";if(!N||!Number.isFinite(_))return q("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(F,N,_,k||void 0),q("Punto añadido"),e(),R()}),D(T,"[data-hist-borrar]",N=>{const[,_]=(N.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(_),q("Eliminado"),e(),R()}),D(T,"[data-hist-inicial]",N=>{const[_,k]=(N.getAttribute("data-hist-inicial")||"").split("|"),L=t.ledger.puntosControl(_).find(O=>O._id===k);if(!L)return;const B=Ue([L])[0].saldo;t.store.updateItem("accounts",_,{saldoInicial:B,fechaInicialSaldo:L.fecha}),q(`Punto inicial → ${L.fecha} (${z(B)})`),e(),R()})}function C(F){const w=t.store.get("accounts").filter(R=>R.activo);if(w.length===0)return q("No hay cuentas activas","err");const P=a(),T=w.map(R=>`• ${R.nombre}: ${z(M(R)??R.saldoInicial??0)}`).join(`
`);if(X(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${P})?

${T}

Esto recalibra el punto de arranque del dashboard.`)){for(const R of w)t.store.updateItem("accounts",R._id,{saldoInicial:M(R)??R.saldoInicial??0,fechaInicialSaldo:P});q("Saldo base actualizado"),e(),F()}}function j(F,w,P){D(F,"[data-nueva-acc]",()=>y(null,w)),D(F,"[data-editar-acc]",T=>y(T.getAttribute("data-editar-acc"),w)),D(F,"[data-tramos-ganancias]",()=>P.abrir()),D(F,"[data-reset-base]",()=>C(w)),D(F,"[data-hist-acc]",T=>S(T.getAttribute("data-hist-acc"),w)),D(F,"[data-principal-acc]",T=>{const R=T.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(N=>({...N,esCuentaPrincipal:N._id===R}))),q("Cuenta marcada como principal"),e(),w()}),D(F,"[data-borrar-acc]",T=>{const R=T.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return q("Debe existir al menos una cuenta","err");if(!X("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",R);const _=t.store.get("accounts");_.length>0&&!_.some(k=>k.esCuentaPrincipal)&&t.store.set("accounts",_.map((k,L)=>L===0?{...k,esCuentaPrincipal:!0}:k)),q("Cuenta eliminada"),e(),w()}),D(F,"[data-inv-modo]",T=>{const[R,N]=(T.getAttribute("data-inv-modo")||"").split("|");s.set(R,N==="real"?"real":"proyeccion"),w()}),$.wire(F,w)}let E=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:Ai,mount(F){const w=()=>m(F);E??(E=xi({store:t.store,onDatosCambiados:()=>{e(),w()},año:()=>Number(a().slice(0,4))})),m(F),F.dataset.wired!=="1"&&(j(F,w,E),F.dataset.wired="1")}}}const et=(t,a,e="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${e};font-size:12px;padding:5px 10px">${l(z(a))}</td>
  </tr>`,Je=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${l(t)}</td></tr>`;function go(t){const e=t.capMobiliario!==0||t.gananciasFondos!==0?`${et("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
       ${et("Ganancias patrimoniales (fondos/acciones)",t.gananciasFondos,t.gananciasFondos>=0?"var(--text)":"var(--green)",!0)}`:'<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>',o=t.resultado>0?"var(--red)":"var(--green)",s=t.resultado>0?"🔴 A PAGAR":"🟢 A DEVOLVER";return`
    <table style="width:100%;border-collapse:collapse">
      ${Je("RENDIMIENTOS DEL TRABAJO")}
      ${et("Ingresos íntegros del trabajo",t.brutoTotal,"var(--text)",!0)}
      ${t.flexTotal>0?et("− Retribución flexible exenta (Art. 42 LIRPF)",-t.flexTotal,"var(--green)",!0):""}
      ${t.flexTotal>0?et("= Ingresos sujetos a IRPF",t.brutoIRPF):""}
      ${et("− Cotizaciones SS (≈6,35 %)",-t.cotizSS,"var(--red)",!0)}
      ${et("− Gastos deducibles (Art. 19.2 LIRPF)",-t.gastosArt19,"var(--red)",!0)}
      ${et("= Rendimiento neto trabajo",t.RNT)}
      ${et("− Reducción Art. 20 LIRPF",-t.reducArt20,"var(--green)",!0)}
      ${t.deducPP>0?et(`− Aportaciones a planes de pensiones (${l(z(t.aportPP))}, límite ${l(z(t.limPP))})`,-t.deducPP,"var(--green)",!0):""}
      ${t.otrosIngresos>0?et("+ Otros ingresos sujetos a IRPF",t.otrosIngresos,"var(--text)",!0):""}
      ${t.capInmobiliario!==0?et("+ Capital inmobiliario neto",t.capInmobiliario,t.capInmobiliario>=0?"var(--text)":"var(--green)",!0):""}
      ${t.otrasCorto!==0?et("± Otras ganancias a corto plazo",t.otrasCorto,"var(--text)",!0):""}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE GENERAL</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${l(z(t.baseGeneral))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota IRPF base general</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${l(z(t.cuotaGen))}</td>
      </tr>

      ${Je("BASE DEL AHORRO")}
      ${e}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${l(z(t.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${l(z(t.cuotaAho))}</td>
      </tr>

      ${Je("RESULTADO")}
      ${et("Cuota íntegra total",t.cuotaIntegra,"var(--red)")}
      ${et("− Retenciones en nómina",-t.retNomina,"var(--green)",!0)}
      ${t.retCapital!==0?et("− Retenciones de capital mobiliario",-t.retCapital,"var(--green)",!0):""}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${s}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${o}">${l(z(Math.abs(t.resultado)))}</td>
      </tr>
    </table>`}const oe=(t,a,e,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${l(a)}</label>
    <input type="number" id="${t}" class="form-input" value="${l(e)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${l(o)}</div>`:""}
  </div>`;function wi(t){const a=t.extras,e=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
           ⚠️ No tienes nóminas configuradas. Ve a <strong>Nóminas</strong> para añadir tus ingresos del trabajo.
         </div>`:"";return`
    <div class="auth-hint mb-12" style="border-color:var(--accent)">
      📋 Estimación orientativa de tu declaración de la renta <strong>${t.año}</strong> con los datos de la aplicación.
      Los rendimientos del trabajo se detectan automáticamente; introduce a mano lo que la aplicación no conoce.
      <strong>No sustituye el asesoramiento fiscal profesional.</strong>
    </div>
    ${e}

    <div class="grid-2" style="gap:16px;align-items:start">
      <div>
        <div class="card" style="padding:16px;margin-bottom:12px">
          <div class="card-title mb-12">Datos adicionales</div>
          <div class="text-sm mb-8" style="color:var(--text2)">Importes anuales que la aplicación no calcula sola.</div>
          ${oe("rex-inmobiliario","Capital inmobiliario neto (alquileres − gastos)",a.capInmobiliario??0)}
          ${oe("rex-mobiliario","Capital mobiliario (dividendos, intereses)",a.capMobiliario??0)}
          ${oe("rex-ganancias","Ganancias / pérdidas patrimoniales (fondos, acciones)",a.gananciasFondos??0,"Positivo = ganancia · Negativo = pérdida compensable")}
          ${oe("rex-otras","Otras ganancias a corto plazo (menos de 1 año)",a.otrasCorto??0)}
          ${oe("rex-ret-cap","Retenciones de capital ya aplicadas",a.retCapital??0,"Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen")}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${t.nominas.length>0?t.nominas.map(o=>`• ${l(o.nombre)}: ${l(z(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${l(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${go(t.declaracion)}</div>
      </div>
    </div>`}function bo(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((e,o)=>e[0]-o[0]).map(([e,o],s,n)=>{const i=s<n.length-1?n[s+1][0]:null,r=i!==null?`${z(e)} – ${z(i)}`:`Más de ${z(e)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${l(r)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${l(o)}%</td>
      </tr>`}).join("")}
  </table>`}const Ci=(t,a,e)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${l(a)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${e}</div>
  </div>`,ct=(t,a,e="")=>`<div class="stat-card"><div class="stat-label">${l(t)}</div><div class="stat-value ${e}">${l(a)}</div></div>`,yt=(t,a,e="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${l(t)}</span><span class="num ${e}">${l(a)}</span></div>`;function ji(t,a,e){const o=t.filter(d=>(d.modeloFondo||"cuenta")==="inversion");if(o.length===0)return Ci("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let s=0,n=0,i=0;const r=o.map(d=>{const c=Dt(d,a);if(!c)return"";s+=c.saldo,n+=c.costBase,i+=c.impuesto;const x=c.costBase>0?c.plusvalia/c.costBase*100:0,p=(d.escenarioIds||[]).map(u=>`<span class="badge badge-yellow">🔭 ${l(e(u))}</span>`).join("");return`
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${l(d.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${p}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            ${ct("Valor actual",z(c.saldo))}
            ${ct("Coste base (aportado)",z(c.costBase))}
          </div>
          <div class="grid-2" style="gap:8px">
            ${ct(`Plusvalía latente (${x>=0?"+":""}${x.toFixed(1)}%)`,z(c.plusvalia),c.plusvalia>=0?"pos":"neg")}
            ${ct("Imp. ganancias de capital (est.)",z(c.impuesto),"neg")}
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${l(z(c.neto))}</span>
          </div>
        </div>`}).join("");return`
    <div class="card mb-16" style="border:1px solid rgba(99,102,241,0.3)">
      <div class="card-title">Cartera de fondos — resumen</div>
      <div class="grid-3" style="gap:8px;margin-bottom:10px">
        ${ct("Valor total de la cartera",z(s))}
        ${ct("Total aportado (coste base)",z(n))}
        ${ct("Plusvalía latente total",z(s-n),s-n>=0?"pos":"neg")}
      </div>
      <div class="grid-2" style="gap:8px">
        ${ct("Impuesto estimado si se liquida todo",z(i),"neg")}
        ${ct("Neto tras impuestos (cartera completa)",z(s-i),"pos")}
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
      ${bo(a)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function zi(t){const{nominas:a,planes:e,tramos:o}=t,s=v=>v.grupoNomina?a.filter(b=>(b.grupoNomina||"")===v.grupoNomina):null,n=a.map(v=>({n:v,d:Fe(v,s(v),o)})),i=n.reduce((v,b)=>v+b.d.brutoAnual,0),r=n.reduce((v,b)=>v+b.d.irpfAnual,0),d=n.reduce((v,b)=>v+b.d.ssAnual,0),c=n.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':n.map(({n:v,d:b})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${l(v.nombre)}</div>
          ${yt("Bruto anual",z(b.brutoAnual))}
          ${b.flexAnual>0?yt("− Retribución flexible exenta",z(-b.flexAnual),"pos"):""}
          ${yt("− Cotización SS",z(-b.ssAnual),"neg")}
          ${yt(`− IRPF estimado (${b.irpfPct.toFixed(1)} %)`,z(-b.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${l(z(b.baseDineraria-b.ssAnual-b.irpfAnual))}</span>
          </div>
        </div>`).join(""),x=ga(a,o),p=`${t.hoy.slice(0,4)}-01-01`,u=e.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':e.map(v=>{const b=de(v);if(!b)return"";const $=(v.aportaciones||[]).filter(h=>h.fecha>=p).reduce((h,I)=>h+I.cantidad,0),m=Math.min($,Et)*x/100,g=$>Et;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${l(v.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${yt("Valor actual",z(b.saldo))}
          ${yt("Coste base (total aportado)",z(b.costBase))}
          ${yt("Revalorización",z(b.beneficio),b.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${l(t.hoy.slice(0,4))}</div>
            ${yt("Aportado",`${z($)}${g?" ⚠":""}`,g?"neg":"")}
            ${yt("Límite deducible",z(Et))}
            ${yt(`Ahorro IRPF est. (marginal ${x} %)`,z(m),"pos")}
            ${g?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${l(z(Et))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${b.proxDesbloqueo?`· Próx. desbloqueo: ${l(b.proxDesbloqueo)}`:""}
          </div>
        </div>`}).join("");return`
    <div class="card mb-16">
      <div class="card-title mb-10">Nóminas activas — importes anuales</div>
      <div class="grid-4" style="gap:8px;margin-bottom:14px">
        ${ct("Bruto anual total",z(i))}
        ${ct("Cotización SS anual",z(d),"neg")}
        ${ct("IRPF estimado anual",z(r),"neg")}
        ${ct("Neto anual",z(i-d-r),"pos")}
      </div>
      <div class="grid-3">${c}</div>
    </div>

    <div class="card-title mb-8">Planes de pensiones</div>
    <div class="auth-hint mb-14" style="border-color:var(--yellow)">
      💼 <strong>Diferencia clave frente a los fondos de inversión:</strong> el rescate de un plan de pensiones tributa en la
      <strong>base general del IRPF</strong> (tramos ordinarios hasta el 47 %), <em>no</em> en la base del ahorro. Las
      aportaciones son deducibles hasta <strong>${l(z(Et))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${u}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${bo(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const fe=(t,a)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${l(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${l(a)}</div>
  </div>`;function Ei(){return`
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
        ${fe("Rendimientos íntegros","Alquileres, subarriendos y cesión de derechos sobre inmuebles")}
        ${fe("Gastos deducibles","IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación")}
        ${fe("Reducción del 60 %","Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)")}
        ${fe("Base general del IRPF","Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.")}
      </div>
    </div>`}const ho=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],Fi="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function _i(t){const a=t.hoy??J;let e="declaracion",o={};const s=()=>t.store.get("config"),n=()=>Number(a().slice(0,4)),i=()=>t.store.get("nominas").filter(g=>g.activo),r=()=>t.store.get("accounts").filter(g=>(g.modeloFondo||"cuenta")==="pension"),d=g=>{var h;return((h=t.store.get("escenarios").find(I=>I._id===g))==null?void 0:h.nombre)??g},c=()=>bt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??gt)(n()),x=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??jt)(n());function p(){const g=`${n()}-01-01`,h=t.store.get("nominas").filter(y=>y.activo&&!y.simulacion),I=r().reduce((y,M)=>y+(M.aportaciones||[]).filter(S=>S.fecha>=g).reduce((S,C)=>S+C.cantidad,0),0),f=t.store.get("expenses").filter(y=>y.activo&&y.sujetoIRPF&&y.tipo==="ingreso").reduce((y,M)=>y+ba(M),0);return ya({nominas:h,aportacionesPension:I,otrosIngresos:f,extras:o,tramosGeneral:c(),tramosAhorro:x()})}function u(){const g=c(),h=i(),I=w=>w.grupoNomina?h.filter(P=>(P.grupoNomina||"")===w.grupoNomina):null,f=h.map(w=>Fe(w,I(w),g)),y=f.reduce((w,P)=>w+P.brutoAnual,0),M=f.reduce((w,P)=>w+P.irpfAnual,0),S=f.reduce((w,P)=>w+P.ssAnual,0),C=t.store.get("accounts").filter(w=>(w.modeloFondo||"cuenta")==="inversion");let j=0,E=0;for(const w of C){const P=Dt(w,x());P&&(j+=P.plusvalia,E+=P.impuesto)}if(y<=0&&C.length===0)return"";const F=(w,P,T)=>`<div class="exec-item"><div class="exec-item-label">${l(w)}</div><div class="exec-item-val ${T}">${l(P)}</div></div>`;return`<div class="exec-summary mb-14">
      ${y>0?F("IRPF trabajo",`${z(M)}/año`,"neg"):""}
      ${y>0?F("Neto trabajo",`${z(y-S-M)}/año`,"pos"):""}
      ${C.length>0?F("Plusvalía latente",z(j),j>=0?"pos":"neg"):""}
      ${C.length>0?F("Imp. potencial (inversión)",z(E),"neg"):""}
    </div>`}function v(){return e==="mobiliario"?ji(t.store.get("accounts"),x(),d):e==="trabajo"?zi({nominas:i(),planes:r(),tramos:c(),hoy:a()}):e==="inmobiliario"?Ei():wi({año:n(),extras:o,declaracion:p(),nominas:i().map(g=>({nombre:g.nombre,bruto:g.bruto||0})),planes:r().map(g=>g.nombre)})}function b(g,h){const I=e===g;return`<button data-tab-fisc="${g}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${I?"600":"400"};
      color:${I?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${I?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${l(h)}</button>`}function $(g){const h=g.querySelector("#fisc-tabs"),I=g.querySelector("#fisc-tab-content");h&&(h.innerHTML=ho.map(([f,y])=>b(f,y)).join("")),I&&(I.innerHTML=v())}function A(g){g.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${u()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${ho.map(([h,I])=>b(h,I)).join("")}
      </div>
      <div id="fisc-tab-content">${v()}</div>`}function m(g){D(g,"[data-tab-fisc]",h=>{e=h.getAttribute("data-tab-fisc")||"declaracion",$(g)}),g.addEventListener("input",h=>{var M;if(!((M=h.target)==null?void 0:M.closest("[data-rex]")))return;const f=S=>{var C;return((C=g.querySelector(`#${S}`))==null?void 0:C.value)??"0"};o={capInmobiliario:parseFloat(f("rex-inmobiliario"))||0,capMobiliario:parseFloat(f("rex-mobiliario"))||0,gananciasFondos:parseFloat(f("rex-ganancias"))||0,otrasCorto:parseFloat(f("rex-otras"))||0,retCapital:parseFloat(f("rex-ret-cap"))||0};const y=g.querySelector("#renta-cuadro");y&&(y.innerHTML=go(p()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:Fi,mount(g){A(g),g.dataset.wired!=="1"&&(m(g),g.dataset.wired="1")}}}const yo=()=>globalThis.Chart??null;function Pi(t,a){const e=yo();if(!e)return null;const o=a.map(s=>({label:s.label,data:s.puntos.map(n=>({x:n.x,y:n.y})),borderColor:s.esBase?"#6b7280":s.color,backgroundColor:s.esBase?"transparent":`${s.color}18`,borderWidth:s.esBase?1.5:2,...s.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new e(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:s=>`${s.dataset.label}: ${z(s.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:s=>z(s)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const Ti=()=>yo()!==null,_t=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Di="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function Ri(t){const a=()=>{var y;return(y=t.onDatosCambiados)==null?void 0:y.call(t)},e=new Set;let o=null;const s=()=>t.store.get("config"),n=()=>t.store.get("escenarios"),i=y=>{var M;return y?((M=n().find(S=>S._id===y))==null?void 0:M.nombre)??y:"Base"};function r(y){const M=s(),S=pa({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(y==null?void 0:y._id)??null),C=e.size>0?S.accounts.filter(w=>!e.has(w._id)):S.accounts,j=e.size>0?C.map(w=>w._id):null,E=y!=null&&y.fechaFin&&y.fechaFin>M.dashboardEnd?y.fechaFin:M.dashboardEnd;return{eventos:Jt({loans:S.loans,expenses:S.expenses,accounts:C,config:{...M,dashboardEnd:E},filtroAccounts:j,nominas:S.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),M.tramos_irpf??gt),resolverTramosGanancias:bt(t.store.get("tramosGananciasCapitalHistorico"),M.tramosGananciasCapital??jt)}),horizonte:E}}function d(y){const M=t.store.get("loans"),S=F=>(F.escenarioIds||[]).includes(y),C=[[M.filter(S).length,"préstamo","préstamos"],[M.flatMap(F=>F.amortizaciones||[]).filter(S).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(S).length,"gasto","gastos"],[t.store.get("accounts").filter(S).length,"cuenta","cuentas"],[t.store.get("nominas").filter(S).length,"nómina","nóminas"]],j=C.reduce((F,[w])=>F+w,0),E=C.filter(([F])=>F>0).map(([F,w,P])=>`${F} ${F===1?w:P}`).join(" · ");return{total:j,texto:E}}function c(y,M){const S=M===y._id,C=y.color||_t[0],{total:j,texto:E}=d(y._id);return`<div class="card mb-12" style="border-left:3px solid ${l(C)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${l(C)};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${l(y.nombre)}</span>
        ${S?'<span class="badge badge-yellow">● Activo</span>':""}
        ${y.fechaFin?`<span class="badge badge-inactive">📅 ${l(y.fechaFin)}</span>`:""}
        <div class="flex gap-8">
          ${S?'<button class="btn-secondary btn-sm" data-desactivar-esc>Desactivar</button>':`<button class="btn-primary btn-sm" data-activar-esc="${l(y._id)}">Activar</button>`}
          <button class="btn-secondary btn-sm" data-editar-esc="${l(y._id)}">Editar</button>
          <button class="btn-danger btn-sm" data-borrar-esc="${l(y._id)}">✕</button>
        </div>
      </div>
      ${y.descripcion?`<div class="text-sm mb-8" style="color:var(--text2)">${l(y.descripcion)}</div>`:""}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${j===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${l(E)}</span>`}
      </div>
    </div>`}function x(y){const M=s().dashboardEnd,S=Se(r(null).eventos,M);return`
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
        <tbody>${y.map(j=>{const{eventos:E}=r(j),F=j.fechaFin||M,w=Se(E,F),P=w!==null&&S!==null?w-S:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${l(j.color||_t[0])};margin-right:6px"></span>
            ${l(j.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${l(F)}</td>
          <td class="num" style="padding:6px 10px">${w!==null?l(z(w)):"—"}</td>
          <td class="num ${P===null?"":P>=0?"pos":"neg"}" style="padding:6px 10px">
            ${P===null?"—":`${P>=0?"+":""}${l(z(P))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function p(){const y=t.store.get("accounts");return y.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${y.map(S=>{const C=e.has(S._id);return`<button data-toggle-cuenta="${l(S._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${C?"var(--border)":"var(--accent)"};
          background:${C?"transparent":"rgba(99,102,241,0.1)"};
          color:${C?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${C?"text-decoration:line-through;":""}">${l(S.nombre)}</button>`}).join("")}
    </div>`}function u(){if(o){try{o.destroy()}catch{}o=null}}function v(y){const M=s(),S=r(null),C=[{label:"Base (sin escenario)",color:"#6b7280",esBase:!0,puntos:Me(S.eventos,M.dashboardStart,M.dashboardEnd)}];return y.forEach((j,E)=>{const{eventos:F,horizonte:w}=r(j);C.push({label:j.nombre,color:j.color||_t[E%_t.length],puntos:Me(F,M.dashboardStart,w)})}),C}function b(y,M){u();const S=y.querySelector("#chart-comparacion");S&&(o=Pi(S,v(M)))}function $(y){u();const M=new Set(t.store.get("accounts").map(j=>j._id));for(const j of[...e])M.has(j)||e.delete(j);const S=n(),C=s().escenarioActivo||null;y.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Escenarios</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo escenario</button></div>
      </div>

      ${C?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${l(i(C))}</span>
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
             </div>`:`<div>${S.map(j=>c(j,C)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de escenarios</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${p()}</div>
               ${Ti()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${x(S)}</div>`}`,S.length>0&&b(y,S)}const A=()=>document.getElementById("modal-overlay"),m=()=>document.getElementById("modal-content"),g=()=>{var y;return(y=A())==null?void 0:y.classList.add("hidden")};function h(y,M){const S=y?n().find(F=>F._id===y)??null:null,C=A(),j=m();if(!C||!j)return;const E=(S==null?void 0:S.color)||_t[0];j.innerHTML=`
      <div class="modal-title">${y?"Editar escenario":"Nuevo escenario"}</div>
      <div class="form-group"><label class="form-label">Nombre del escenario</label>
        <input class="form-input" type="text" id="esc-nombre" value="${l((S==null?void 0:S.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${l((S==null?void 0:S.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${_t.map(F=>`<div data-color-esc="${F}" style="width:26px;height:26px;border-radius:50%;background:${F};cursor:pointer;
              border:2px solid ${F===E?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${l(E)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${l((S==null?void 0:S.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${l(y??"")}">${y?"Guardar cambios":"Crear escenario"}</button>
      </div>`,C.classList.remove("hidden"),D(j,"[data-cancelar]",g),D(j,"[data-color-esc]",F=>{const w=F.getAttribute("data-color-esc");j.querySelector("#esc-color").value=w;for(const P of j.querySelectorAll("[data-color-esc]"))P.style.border=P.getAttribute("data-color-esc")===w?"2px solid white":"2px solid transparent"}),D(j,"[data-guardar-esc]",F=>{const w=j.querySelector("#esc-nombre").value.trim();if(!w)return q("El nombre es obligatorio","err");const P={nombre:w,fechaFin:j.querySelector("#esc-fecha-fin").value||null,color:j.querySelector("#esc-color").value||_t[0],descripcion:j.querySelector("#esc-desc").value.trim()},T=F.getAttribute("data-guardar-esc")||"";T?(t.store.updateItem("escenarios",T,P),q("Escenario actualizado")):(t.store.addItem("escenarios",P),q("Escenario creado")),a(),g(),M()})}function I(y,M){if(!X("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const S=C=>C.map(j=>({...j,escenarioIds:(j.escenarioIds||[]).filter(E=>E!==y)}));t.store.set("loans",S(t.store.get("loans")).map(C=>({...C,amortizaciones:S(C.amortizaciones||[])}))),t.store.set("expenses",S(t.store.get("expenses"))),t.store.set("nominas",S(t.store.get("nominas"))),t.store.set("accounts",S(t.store.get("accounts"))),s().escenarioActivo===y&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",y),q("Escenario eliminado"),a(),M()}function f(y,M){D(y,"[data-nuevo-esc]",()=>h(null,M)),D(y,"[data-editar-esc]",S=>h(S.getAttribute("data-editar-esc"),M)),D(y,"[data-borrar-esc]",S=>I(S.getAttribute("data-borrar-esc"),M)),D(y,"[data-activar-esc]",S=>{const C=S.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:C}),q(`Escenario "${i(C)}" activado`),a(),M()}),D(y,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),q("Volviendo a la realidad base"),a(),M()}),D(y,"[data-toggle-cuenta]",S=>{const C=S.getAttribute("data-toggle-cuenta");e.has(C)?e.delete(C):e.add(C);const j=y.querySelector("#esc-pastillas");j&&(j.innerHTML=p());const E=n(),F=y.querySelector("#esc-comparativa");F&&(F.innerHTML=x(E)),b(y,E)})}return{id:"escenarios",route:"escenarios",nombre:"Escenarios",flagId:"supuestos",seccion:2,iconoPath:Di,mount(y){const M=()=>$(y);$(y),y.dataset.wired!=="1"&&(f(y,M),y.dataset.wired="1")},unmount(){u()}}}const Oi=1e-12,xo=t=>Math.abs(t)<Oi,$o=t=>t/12;function Ni(t,a,e,o){if(e<=0)return Math.max(0,Math.ceil(t-a));const s=t-a;if(s<=0)return 0;const n=$o(o);if(xo(n))return Math.ceil(s/e);const i=Math.pow(1+n,e),r=(t-a*i)*n/(i-1);return r<=0?0:Math.ceil(r)}function qi(t,a){const e=$o(a);return xo(e)?0:Math.round(t*e)}function Io({rentaNetaMensual:t,tasaRetiroSeguro:a,tipoFiscalEfectivo:e}){if(a<=0)throw new RangeError("La tasa de retiro seguro tiene que ser mayor que cero.");if(e>=1)throw new RangeError("El tipo fiscal efectivo no puede llegar al 100 %.");const o=Math.round(t*12/(1-e));return{retiroBrutoAnual:o,capitalNecesario:Math.round(o/a)}}function Ao(t,a){const[e,o]=t.split("-").map(Number),s=e*12+(o-1)+a,n=Math.floor(s/12),i=s%12+1;return`${n}-${String(i).padStart(2,"0")}`}function We(t,a){const[e,o]=t.split("-").map(Number),[s,n]=a.split("-").map(Number);return(s-e)*12+(n-o)}const Mo=t=>Number(t.slice(0,4));function ve(t){return t.rentaDeseada?Io(t.rentaDeseada).capitalNecesario:t.importeObjetivo??0}const Li={_id:"__sin_vehiculo__"};function ge(t){var g,h,I;const a=Math.max(0,Math.floor(t.horizonteMeses)),e=new Map(t.vehiculos.map(f=>[f._id,f])),o=[...t.objetivos].sort((f,y)=>f.prioridad-y.prioridad).map(f=>({def:f,objetivo:ve(f),saldo:f.saldoActual,estado:ve(f)>0&&f.saldoActual>=ve(f)&&f.modoAsignacion!=="ABSORBE_RESIDUAL"?"COMPLETADO":"PENDIENTE",vehiculo:e.get(f.vehiculoId),aportadoEnAño:0,añoEnCurso:Mo(t.fechaInicio),ultimaSolicitud:0,solicitadoAcumulado:0,mesesReclamando:0})),s=new Map;for(const f of t.eventos){const y=s.get(f.fecha)??[];y.push(f),s.set(f.fecha,y)}const n=[],i=[],r=[];let d=t.perfil.netoMensual,c=t.perfil.gastosFijosMensuales,x=0,p=0;const u=[];for(let f=0;f<a;f++){const y=Ao(t.fechaInicio,f),M=Mo(y);for(const _ of s.get(y)??[])if(_.tipo==="CAMBIO_INGRESOS")d=_.importe;else if(_.tipo==="CAMBIO_GASTOS_FIJOS")c=_.importe;else if(_.tipo==="NUEVA_DEUDA")c+=_.importe;else if(_.tipo==="INYECCION_CAPITAL"){const k=_.objetivoDestinoId?o.find(L=>L.def._id===_.objetivoDestinoId):void 0;k?k.saldo+=_.importe:d+=_.importe}for(const _ of o)_.añoEnCurso!==M&&(_.añoEnCurso=M,_.aportadoEnAño=0);const S=Math.max(0,d-c),C=Math.round(S*ki(t.pctDisfrute));let j=S-C;const E=j,F=o.filter(_=>_.estado!=="COMPLETADO"),w=[];let P=0;const T=F.filter(_=>_.def.modoAsignacion==="ABSORBE_RESIDUAL"),R=F.filter(_=>_.def.modoAsignacion!=="ABSORBE_RESIDUAL");for(const _ of R){const k=Bi(_,y,f,t);_.ultimaSolicitud=k,k>0&&(_.solicitadoAcumulado+=k,_.mesesReclamando+=1),(_.def.modoAsignacion==="CUOTA_POR_FECHA"||_.def.modoAsignacion==="FIJO")&&(P+=k);const L=Math.max(0,Math.min(k,j));j-=L,_.saldo+=L,_.aportadoEnAño+=L,x+=L,L>0&&_.estado==="PENDIENTE"&&(_.estado="EN_CURSO"),w.push({objetivoId:_.def._id,asignado:L,solicitado:k,saldoTrasMes:_.saldo})}if(T.length>0&&j>0){const _=T.map(B=>Math.max(0,B.def.pesoResidual??1)),k=_.reduce((B,O)=>B+O,0)||T.length;let L=0;T.forEach((B,O)=>{const H=O===T.length-1?j-L:Math.floor(j*_[O]/k);L+=H,B.saldo+=H,B.aportadoEnAño+=H,x+=H,H>0&&B.estado==="PENDIENTE"&&(B.estado="EN_CURSO"),w.push({objetivoId:B.def._id,asignado:H,solicitado:0,saldoTrasMes:B.saldo})}),j-=L}else for(const _ of T)w.push({objetivoId:_.def._id,asignado:0,solicitado:0,saldoTrasMes:_.saldo});P>E&&u.push({mes:y,deficit:P-E});for(const _ of o)_.saldo<=0||(_.saldo+=qi(_.saldo,((g=_.vehiculo)==null?void 0:g.rentabilidadRealAnual)??0));for(const _ of o)_.estado!=="COMPLETADO"&&(_.def.modoAsignacion==="ABSORBE_RESIDUAL"&&_.objetivo<=0||_.objetivo>0&&_.saldo>=_.objetivo&&(_.estado="COMPLETADO",i.push({objetivoId:_.def._id,nombre:_.def.nombre,mes:y,indice:f,importeFinal:_.saldo,cuotaLiberada:_.ultimaSolicitud})));for(const _ of o)w.some(k=>k.objetivoId===_.def._id)||w.push({objetivoId:_.def._id,asignado:0,solicitado:0,saldoTrasMes:_.saldo});const N=o.reduce((_,k)=>_+k.saldo,0);if(p+=C,n.push({indice:f,mes:y,netoMensual:d,gastosFijos:c,sobrante:S,disfrute:C,disponible:E,sinAsignar:j,asignaciones:w.sort((_,k)=>So(o,_.objetivoId)-So(o,k.objetivoId)),patrimonioTotal:N}),o.length>0&&o.every(_=>_.estado==="COMPLETADO"))break}const v=[];if(u.length>0){const f=Math.round(u.reduce((y,M)=>y+M.deficit,0)/u.length);r.push({severidad:"error",codigo:"INVIABLE",mensaje:`El plan no cabe en el flujo de caja durante ${u.length} mes${u.length!==1?"es":""} (desde ${u[0].mes}). Déficit medio: ${(f/100).toFixed(2)} €/mes.`,mes:u[0].mes,deficitMensual:f});for(const y of o)y.estado!=="COMPLETADO"&&y.def.fechaLimite&&y.def.modoAsignacion==="CUOTA_POR_FECHA"&&(y.estado="INVIABLE");v.push(...Gi(o,t,f))}for(const f of o){const y=(h=f.vehiculo)==null?void 0:h.topeAportacionAnual;y&&f.def.modoAsignacion==="FIJO"&&(f.def.importeFijoMensual??0)*12>y&&r.push({severidad:"atencion",codigo:"TOPE_FISCAL",objetivoId:f.def._id,mensaje:`«${f.def.nombre}» pide ${((f.def.importeFijoMensual??0)/100).toFixed(2)} €/mes, que supera el tope anual de ${(y/100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`})}for(const f of o)f.estado!=="COMPLETADO"&&f.objetivo>0&&f.def.modoAsignacion!=="ABSORBE_RESIDUAL"&&r.push({severidad:"atencion",codigo:"NUNCA_COMPLETADO",objetivoId:f.def._id,mensaje:`«${f.def.nombre}» no se completa dentro del horizonte de ${a} meses.`});const b=o.find(f=>f.def.tipo==="INVERSION_PERPETUA"),$=b?i.find(f=>f.objetivoId===b.def._id):void 0,A={};for(const f of o){const y=((I=f.vehiculo)==null?void 0:I._id)??Li._id;A[y]=(A[y]??0)+f.saldo}const m={};for(const f of o)m[f.def._id]=f.estado;return{viable:u.length===0,mesesSimulados:n.length,serieMensual:n,hitos:i,fases:Hi(n,i),avisos:r,propuestas:v,estadoFinal:m,resumen:{patrimonioFinal:o.reduce((f,y)=>f+y.saldo,0),patrimonioPorVehiculo:A,totalAportado:x,totalDisfrute:p,mesIndependencia:($==null?void 0:$.mes)??null}}}const ki=t=>Number.isFinite(t)?Math.min(1,Math.max(0,t)):0,So=(t,a)=>t.findIndex(e=>e.def._id===a);function Bi(t,a,e,o){var n,i;const s=Math.max(0,t.objetivo-t.saldo);switch(t.def.modoAsignacion){case"ABSORBE_TODO":return s;case"FIJO":{const r=t.def.importeFijoMensual??0,d=(n=t.vehiculo)==null?void 0:n.topeAportacionAnual;if(!d)return t.objetivo>0?Math.min(r,s):r;const c=Math.max(0,d-t.aportadoEnAño),x=Math.min(r,c);return t.objetivo>0?Math.min(x,s):x}case"CUOTA_POR_FECHA":{if(s<=0)return 0;const r=t.def.fechaLimite?We(a,t.def.fechaLimite):o.horizonteMeses-e;return Ni(t.objetivo,t.saldo,Math.max(0,r),((i=t.vehiculo)==null?void 0:i.rentabilidadRealAnual)??0)}default:return 0}}function Hi(t,a){if(t.length===0)return[];const o=[0,...[...new Set(a.map(n=>n.indice))].sort((n,i)=>n-i).map(n=>n+1)].filter((n,i,r)=>r.indexOf(n)===i&&n<t.length),s=[];for(let n=0;n<o.length;n++){const i=o[n],r=(n+1<o.length?o[n+1]:t.length)-1;if(r<i)continue;const d=new Set;for(let c=i;c<=r;c++)for(const x of t[c].asignaciones)x.asignado>0&&d.add(x.objetivoId);s.push({desde:t[i].mes,hasta:t[r].mes,meses:r-i+1,objetivosActivos:[...d]})}return s}function Gi(t,a,e){const o=[],s=Math.max(0,a.perfil.netoMensual-a.perfil.gastosFijosMensuales);if(s>0&&a.pctDisfrute>0){const d=Math.ceil(Math.min(a.pctDisfrute,e/s)*100);if(d>0){const c=Math.round(a.pctDisfrute*100);o.push({clase:"REDUCIR_DISFRUTE",magnitud:d,mensaje:`Bajar el disfrute ${d} punto${d!==1?"s":""} (del ${c} % al ${Math.max(0,c-d)} %) libera ${(Math.min(e,s*a.pctDisfrute)/100).toFixed(0)} €/mes.`})}}const n=t.filter(d=>d.def.modoAsignacion==="CUOTA_POR_FECHA"&&d.def.fechaLimite&&d.estado!=="COMPLETADO"),i=d=>d.mesesReclamando>0?d.solicitadoAcumulado/d.mesesReclamando:0,r=[...n].sort((d,c)=>i(c)-i(d))[0];if(r){const d=Math.max(0,r.objetivo-r.saldo),c=i(r),x=Math.max(1,We(a.fechaInicio,r.def.fechaLimite)),p=Math.max(1,c-e),u=Math.ceil(d/p),v=Math.max(1,u-x);o.push({clase:"RETRASAR_FECHA",objetivoId:r.def._id,magnitud:v,mensaje:`Retrasar «${r.def.nombre}» ${v} mes${v!==1?"es":""}, hasta ${Ao(r.def.fechaLimite,v)}, baja su cuota a lo que cabe en el flujo.`});const b=Math.min(Math.round(e*x),Math.max(0,r.objetivo-1));b>0&&o.push({clase:"REDUCIR_IMPORTE",objetivoId:r.def._id,magnitud:b,mensaje:`O reducir «${r.def.nombre}» en ${(b/100).toFixed(0)} €, de ${(r.objetivo/100).toFixed(0)} € a ${((r.objetivo-b)/100).toFixed(0)} €.`})}return n.length>1&&o.push({clase:"REORDENAR",magnitud:n.length,mensaje:`Hay ${n.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`}),o.length===0&&o.push({clase:"REDUCIR_IMPORTE",magnitud:e,mensaje:`Faltan ${(e/100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`}),o}const Vi=()=>globalThis.Chart??null,be=["#2ee6a8","#4d9fff","#a855f7","#f97316","#eab308","#22d3ee","#fb7185","#34d399"],wo=new WeakMap;function Ui(t,a,e){const o=Vi();if(!o)return null;const s=wo.get(t);if(s)try{s.destroy()}catch{}const n=new Map,i=new Map(a.objetivos.map(v=>[v._id,v.vehiculoId])),r=new Set(a.objetivos.map(v=>v.vehiculoId));for(const v of r)n.set(v,[]);for(const v of e.serieMensual){const b=new Map;for(const $ of v.asignaciones){const A=i.get($.objetivoId);A&&b.set(A,(b.get(A)??0)+$.saldoTrasMes)}for(const $ of r)n.get($).push((b.get($)??0)/100)}const d=v=>{var b;return((b=a.vehiculos.find($=>$._id===v))==null?void 0:b.nombre)??"Sin vehículo"},c=[...r],x=c.map((v,b)=>e.serieMensual.map(($,A)=>c.slice(0,b+1).reduce((m,g)=>m+(n.get(g)[A]??0),0))),p=c.map((v,b)=>({label:d(v),data:x[b],borderColor:be[b%be.length],backgroundColor:`${be[b%be.length]}33`,fill:b===0?"origin":"-1",borderWidth:1.5,pointRadius:0,tension:.25})),u=new o(t,{type:"line",data:{labels:e.serieMensual.map(v=>v.mes),datasets:p},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#a9b6cc",font:{size:11},boxWidth:12}},tooltip:{backgroundColor:"#111a28",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#a9b6cc",bodyColor:"#eef3fb",callbacks:{label:v=>{const b=v.datasetIndex>0?v.chart.data.datasets[v.datasetIndex-1].data[v.dataIndex]??0:0;return` ${v.dataset.label}: ${z(v.parsed.y-b)}`}}}},scales:{x:{ticks:{color:"#6b7b96",maxTicksLimit:12},grid:{display:!1}},y:{ticks:{color:"#6b7b96",callback:v=>z(v)},grid:{color:"rgba(255,255,255,0.07)"}}}}});return wo.set(t,u),u}const Qe=t=>z(t/100),Yi={CUOTA_POR_FECHA:"Cuota para llegar a la fecha",ABSORBE_TODO:"Se lleva todo lo disponible",ABSORBE_RESIDUAL:"Recibe lo que sobre",FIJO:"Importe fijo al mes"},Ji={CUOTA_POR_FECHA:"Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.",ABSORBE_RESIDUAL:"No reclama nada; recoge lo que quede tras servir a los de prioridad superior.",FIJO:"Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene."},Co={COMPLETADO:"var(--accent)",EN_CURSO:"var(--text)",PENDIENTE:"var(--text3)",INVIABLE:"var(--red)"};function Wi(t,a){if(t.objetivos.length===0)return`<div class="card" style="text-align:center;padding:34px 20px">
      <div style="font-size:26px;margin-bottom:10px">🎯</div>
      <div class="card-title" style="margin-bottom:6px">Todavía no hay objetivos</div>
      <div class="text-sm" style="color:var(--text2);max-width:52ch;margin:0 auto;line-height:1.7">
        Un objetivo es algo a lo que quieres llegar —amortizar el coche, la entrada de un piso, un colchón—
        con un importe y, si la tiene, una fecha. Compiten por el mismo dinero cada mes, y cuando uno se
        completa su cuota pasa sola al siguiente.
      </div>
    </div>`;const e=[...t.objetivos].sort((n,i)=>n.prioridad-i.prioridad),o=a.serieMensual[0],s=n=>t.vehiculos.find(i=>i._id===n);return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      El orden es la <strong>prioridad</strong>: el de arriba se sirve primero y los de abajo reciben lo que quede.
      La columna «pide ahora» es lo que cada objetivo está reclamando este mes.
      <br>Arrastra las tarjetas para reordenarlas.
    </div>
    ${e.map(n=>{var i;return Qi(n,a,o,(i=s(n.vehiculoId))==null?void 0:i.nombre)}).join("")}`}function Qi(t,a,e,o){const s=ve(t),n=a.estadoFinal[t._id]??t.estado,i=e==null?void 0:e.asignaciones.find(p=>p.objetivoId===t._id),r=(i==null?void 0:i.solicitado)??0,d=a.hitos.find(p=>p.objetivoId===t._id),c=s>0?Math.min(100,t.saldoActual/s*100):0,x=a.avisos.filter(p=>p.objetivoId===t._id);return`
    <div class="card mb-10" draggable="true" data-pl-objetivo="${l(t._id)}"
         style="padding:14px 16px;border-left:3px solid ${Co[n]??"var(--text3)"};cursor:grab">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span title="Arrastra para cambiar la prioridad" style="color:var(--text3);cursor:grab;user-select:none">⠿</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3)">#${l(t.prioridad)}</span>
            <span style="font-weight:700;font-size:14px">${l(t.nombre)}</span>
            <span class="badge" style="font-size:10px;background:var(--bg3);color:var(--text2)">${l(Yi[t.modoAsignacion])}</span>
            ${n==="INVIABLE"?'<span class="badge badge-red" style="font-size:10px">no llega</span>':""}
            ${n==="COMPLETADO"?'<span class="badge badge-green" style="font-size:10px">completado</span>':""}
          </div>
          <div class="text-sm" style="color:var(--text3);margin-top:4px">${l(Ji[t.modoAsignacion])}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:17px;font-weight:700">${l(s>0?Qe(s):"— sin meta —")}</div>
          ${t.fechaLimite?`<div class="text-sm" style="color:var(--text3)">para ${l(t.fechaLimite)}</div>`:""}
          <button class="btn-secondary btn-sm" data-pl-editar-objetivo="${l(t._id)}" style="margin-top:6px;font-size:11px;padding:2px 9px">Editar</button>
        </div>
      </div>

      ${s>0?`<div class="goal-bar" style="margin-top:10px"><div class="goal-bar-fill" style="width:${c.toFixed(1)}%;background:${Co[n]??"var(--accent)"}"></div></div>`:""}

      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:12px">
        <div><span style="color:var(--text3)">Pide ahora:</span> <strong style="font-family:var(--font-mono)">${l(Qe(r))}</strong>/mes</div>
        <div><span style="color:var(--text3)">Ya acumulado:</span> <span style="font-family:var(--font-mono)">${l(Qe(t.saldoActual))}</span></div>
        ${o?`<div><span style="color:var(--text3)">Vehículo:</span> ${l(o)}</div>`:""}
        ${d?`<div><span style="color:var(--text3)">Se completa:</span> <strong style="color:var(--accent)">${l(d.mes)}</strong></div>`:""}
      </div>

      ${x.length>0?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${x.map(p=>`⚠ ${l(p.mensaje)}`).join("<br>")}
             </div>`:""}
      ${t.notas?`<div class="text-sm" style="color:var(--text3);margin-top:8px;white-space:pre-wrap">${l(t.notas)}</div>`:""}
    </div>`}const dt=t=>(t/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}),jo=[{id:"venta-vivienda",nombre:"Venta de vivienda",icono:"🏠",descripcion:"Lo que queda de verdad tras cancelar la hipoteca y pagar impuestos y gastos. Suele ser bastante menos que el precio de venta.",tipo:"INYECCION_CAPITAL",campos:[{id:"precio",etiqueta:"Precio de venta (€)",ayuda:"Lo que te paga el comprador"},{id:"hipoteca",etiqueta:"Hipoteca pendiente (€)",ayuda:"Capital vivo el día de la firma"},{id:"gastos",etiqueta:"Impuestos y gastos (€)",ayuda:"Plusvalía municipal, IRPF de la ganancia, agencia, notaría"}],calcular:t=>Math.max(0,(t.precio??0)-(t.hipoteca??0)-(t.gastos??0)),resumir:t=>`Venta ${dt(t.precio??0)} € − hipoteca ${dt(t.hipoteca??0)} € − gastos ${dt(t.gastos??0)} €`},{id:"nueva-hipoteca",nombre:"Nueva hipoteca",icono:"🔑",descripcion:"Sube tus gastos fijos con la cuota nueva. Normalmente va en la misma fecha que la venta.",tipo:"NUEVA_DEUDA",campos:[{id:"cuota",etiqueta:"Cuota mensual (€)",ayuda:"Se suma a tus gastos fijos a partir de ese mes"}],calcular:t=>t.cuota??0,resumir:t=>`Cuota de ${dt(t.cuota??0)} €/mes`},{id:"hijo",nombre:"Llegada de un hijo",icono:"👶",descripcion:"Fija tus gastos fijos en un valor nuevo. Si el gasto sube por etapas, crea varios eventos seguidos.",tipo:"CAMBIO_GASTOS_FIJOS",campos:[{id:"actuales",etiqueta:"Gastos fijos actuales (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"incremento",etiqueta:"Incremento mensual (€)",ayuda:"Guardería, ropa, sanidad…"}],calcular:t=>(t.actuales??0)+(t.incremento??0),resumir:t=>`Gastos fijos ${dt(t.actuales??0)} € → ${dt((t.actuales??0)+(t.incremento??0))} €/mes`},{id:"subida-sueldo",nombre:"Subida de sueldo",icono:"📈",descripcion:"Fija tu neto mensual en un valor nuevo desde ese mes.",tipo:"CAMBIO_INGRESOS",campos:[{id:"actual",etiqueta:"Neto mensual actual (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"subida",etiqueta:"Subida mensual neta (€)",ayuda:"Lo que te llega a la cuenta, no el bruto"}],calcular:t=>(t.actual??0)+(t.subida??0),resumir:t=>`Neto ${dt(t.actual??0)} € → ${dt((t.actual??0)+(t.subida??0))} €/mes`},{id:"inyeccion",nombre:"Entrada de dinero",icono:"💰",descripcion:"Una herencia, un bonus, la venta de un coche. Puede ir dirigida a un objetivo concreto.",tipo:"INYECCION_CAPITAL",campos:[{id:"importe",etiqueta:"Importe (€)"}],calcular:t=>t.importe??0,resumir:t=>`Entrada de ${dt(t.importe??0)} €`}],Ki=t=>jo.find(a=>a.id===t);function Xi(t,a){switch(t.tipo){case"INYECCION_CAPITAL":return`Entra ${dt(t.importe)} €${a?` → «${a}»`:" al reparto general"}`;case"CAMBIO_INGRESOS":return`El neto mensual pasa a ${dt(t.importe)} €`;case"CAMBIO_GASTOS_FIJOS":return`Los gastos fijos pasan a ${dt(t.importe)} €/mes`;case"NUEVA_DEUDA":return`Los gastos fijos suben ${dt(t.importe)} €/mes`}}function Zi(t,a,e,o){const s=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,n=new Map(t.vehiculos.map(r=>[r._id,`veh_${s()}`])),i=new Map(t.objetivos.map(r=>[r._id,`obj_${s()}`]));return{...t,_id:e,nombre:a,activo:!1,creadoEn:o,vehiculos:t.vehiculos.map(r=>({...r,_id:n.get(r._id)})),objetivos:t.objetivos.map(r=>({...r,_id:i.get(r._id),vehiculoId:n.get(r.vehiculoId)??r.vehiculoId})),eventos:t.eventos.map(r=>({...r,_id:`ev_${s()}`,objetivoDestinoId:r.objetivoDestinoId?i.get(r.objetivoDestinoId)??null:null}))}}function tr(t){return[...new Set(t.flatMap(e=>e.hitos.map(o=>o.nombre)))].map(e=>{const o=t.map(i=>i.hitos.find(r=>r.nombre===e)??null),s=o.map(i=>i?i.indice:null),n=s[0];return{nombre:e,meses:o.map(i=>i?i.mes:null),diferencias:s.map(i=>i!==null&&n!==null?i-n:null)}})}const er=t=>z(t/100),ar={INYECCION_CAPITAL:"💰",CAMBIO_GASTOS_FIJOS:"🏷️",CAMBIO_INGRESOS:"📈",NUEVA_DEUDA:"🔑"};function or(t){const a=[...t.eventos].sort((o,s)=>o.fecha.localeCompare(s.fecha)),e=o=>{var s;return o?(s=t.objetivos.find(n=>n._id===o))==null?void 0:s.nombre:void 0};return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      Los eventos son los cambios de vida que mueven el plan de verdad: una venta, una hipoteca nueva, un hijo,
      un ascenso. Se aplican <strong>al principio del mes</strong> que indiques.
    </div>

    <div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Añadir</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${jo.map(o=>`<button class="btn-secondary btn-sm" data-pl-plantilla="${l(o.id)}"
            style="display:flex;align-items:center;gap:6px;padding:7px 12px">
            <span style="font-size:14px">${o.icono}</span>
            <span style="font-size:12px">${l(o.nombre)}</span>
          </button>`).join("")}
      </div>
    </div>

    ${a.length===0?`<div class="card" style="text-align:center;padding:30px 20px">
             <div style="font-size:24px;margin-bottom:8px">📅</div>
             <div class="text-sm" style="color:var(--text2);max-width:50ch;margin:0 auto;line-height:1.7">
               Todavía no hay eventos. Sin ellos el plan asume que tus ingresos y tus gastos se quedan como están
               durante todo el horizonte, cosa que no pasa nunca.
             </div>
           </div>`:`<div class="card">
             <div class="card-title mb-12">Línea temporal (${a.length})</div>
             ${a.map(o=>sr(o,t,e(o.objetivoDestinoId))).join("")}
           </div>`}`}function sr(t,a,e){const o=We(a.fechaInicio,t.fecha),s=o<0?"antes del inicio del plan":o===0?"en el primer mes":`dentro de ${o} mes${o!==1?"es":""}`,n=o<0||o>=a.horizonteMeses;return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:16px;flex-shrink:0;width:24px;text-align:center">${ar[t.tipo]}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--accent)">${l(t.fecha)}</span>
          <span style="font-size:11px;color:var(--text3)">${l(s)}</span>
          ${n?'<span class="badge badge-yellow" style="font-size:10px">fuera del horizonte</span>':""}
        </div>
        <div style="font-size:12px;margin-top:3px">${l(Xi(t,e))}</div>
        ${t.notas?`<div style="font-size:11px;color:var(--text3);margin-top:2px">${l(t.notas)}</div>`:""}
      </div>
      <div style="display:flex;gap:5px;flex-shrink:0">
        <button class="btn-secondary btn-sm" data-pl-editar-evento="${l(t._id)}" style="font-size:11px;padding:2px 9px">Editar</button>
      </div>
    </div>`}function nr(t,a,e,o){const s=t.campos.map(i=>{const r=o[i.id];return`<div class="form-group">
        <label class="form-label" for="ev-${l(i.id)}">${l(i.etiqueta)}</label>
        <input class="form-input" type="number" step="0.01" id="ev-${l(i.id)}" value="${r!==void 0?(r/100).toFixed(2):""}">
        ${i.ayuda?`<div class="text-sm mt-4" style="color:var(--text3)">${l(i.ayuda)}</div>`:""}
      </div>`}).join(""),n=[["","— al reparto general —"],...e.objetivos.map(i=>[i._id,i.nombre])];return`
    <div class="text-sm mb-14" style="color:var(--text2);line-height:1.7">${t.icono} ${l(t.descripcion)}</div>

    <div class="form-group">
      <label class="form-label" for="ev-fecha">Mes en que ocurre</label>
      <input class="form-input" type="month" id="ev-fecha" value="${l((a==null?void 0:a.fecha)??e.fechaInicio)}">
    </div>

    ${s}

    <div class="card mb-12" style="background:var(--bg3);padding:10px 12px">
      <div class="text-sm" style="color:var(--text3)">Importe que se aplicará</div>
      <div id="ev-resultado" style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--accent);margin-top:2px">—</div>
    </div>

    ${t.tipo==="INYECCION_CAPITAL"?`<div class="form-group">
             <label class="form-label" for="ev-destino">¿A qué objetivo va?</label>
             <select class="form-input" id="ev-destino">
               ${n.map(([i,r])=>`<option value="${l(i)}"${i===((a==null?void 0:a.objetivoDestinoId)??"")?" selected":""}>${l(r)}</option>`).join("")}
             </select>
             <div class="text-sm mt-4" style="color:var(--text3)">
               Dirigida a un objetivo lo completa antes y libera su cuota; al reparto general entra como ingreso extra de ese mes.
             </div>
           </div>`:""}

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${a?'<button class="btn-secondary" data-ev-borrar style="color:var(--red)">Borrar</button>':""}
      <button class="btn-secondary" data-ev-cancelar>Cancelar</button>
      <button class="btn-primary" data-ev-guardar>${a?"Guardar":"Añadir evento"}</button>
    </div>`}function zo(t,a){var o;const e={};for(const s of a.campos){const n=((o=t.querySelector(`#ev-${s.id}`))==null?void 0:o.value)??"",i=parseFloat(String(n).replace(",","."));e[s.id]=Number.isFinite(i)?Math.round(i*100):0}return e}const ir=(t,a)=>er(t.calcular(a)),rr=[-2,-1,0,1,2],lr=[-10,0,10],cr=[-20,0,20];function Eo(t){return t.hitos.length===0?null:Math.max(...t.hitos.map(a=>a.indice))}function dr(t,a,e,o,s){const n={};for(const d of o.hitos)n[d.objetivoId]=d.mes;const i=Eo(o),r=s?Eo(s):i;return{etiqueta:t,delta:a,esBase:e,viable:o.viable,hitos:n,desplazamientoMeses:i!==null&&r!==null?i-r:null,patrimonioFinal:o.resumen.patrimonioFinal}}function ur(t,a,e){if(e===0)return t;switch(a){case"rentabilidad":return{...t,vehiculos:t.vehiculos.map(o=>({...o,rentabilidadRealAnual:Math.max(0,o.rentabilidadRealAnual+e/100)}))};case"disfrute":return{...t,pctDisfrute:Math.min(1,Math.max(0,t.pctDisfrute+e/100))};case"ingresos":return{...t,perfil:{...t.perfil,netoMensual:Math.max(0,Math.round(t.perfil.netoMensual*(1+e/100)))}}}}const pr=t=>t>0?`+${t}`:String(t);function Ke(t,a,e,o,s,n){const i=ge(t),r=s.map(d=>dr(d===0?"Plan actual":`${pr(d)} ${n}`,d,d===0,d===0?i:ge(ur(t,a,d)),i));return{palanca:a,titulo:e,descripcion:o,variantes:r}}function mr(t){return[Ke(t,"rentabilidad","Rentabilidad de los vehículos","Mueve la rentabilidad real de todos los vehículos a la vez. Es la palanca que menos controlas.",rr,"puntos"),Ke(t,"disfrute","Porcentaje de disfrute","Lo que apartas para gastar en vez de asignar a objetivos. Es la palanca que más controlas.",lr,"puntos"),Ke(t,"ingresos","Ingresos","Un ascenso, un cambio de trabajo o una reducción de jornada.",cr,"%")]}function fr(t){if(t===null)return"no comparable";if(t===0)return"sin cambio";const a=Math.abs(t),e=Math.floor(a/12),o=a%12,s=[e>0?`${e} año${e!==1?"s":""}`:"",o>0?`${o} mes${o!==1?"es":""}`:""].filter(Boolean).join(" y ");return t<0?`${s} antes`:`${s} más tarde`}const Fo=t=>z(t/100);function vr(t,a,e){return`
    ${gr(t,a)}
    ${t.length>1?br(t):""}
    ${hr(e)}`}function gr(t,a){return`<div class="card mb-14">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Planes (${t.length})</span>
      <div class="flex gap-8 flex-wrap">
        <button class="btn-secondary btn-sm" data-pl-duplicar>Duplicar el activo</button>
        <button class="btn-secondary btn-sm" data-pl-exportar>Exportar JSON</button>
        <button class="btn-secondary btn-sm" data-pl-importar>Importar JSON</button>
      </div>
    </div>

    ${t.map(e=>{const o=e._id===a;return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);flex-wrap:wrap">
        <div style="flex:1;min-width:180px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-weight:600;font-size:13px">${l(e.nombre)}</span>
            ${o?'<span class="badge badge-green" style="font-size:10px">activo</span>':""}
          </div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">
            ${e.objetivos.length} objetivo${e.objetivos.length!==1?"s":""} ·
            ${e.eventos.length} evento${e.eventos.length!==1?"s":""} ·
            desde ${l(e.fechaInicio)}${e.creadoEn?` · creado ${l(e.creadoEn)}`:""}
          </div>
        </div>
        <div class="flex gap-5 flex-wrap">
          ${o?"":`<button class="btn-secondary btn-sm" data-pl-activar="${l(e._id)}" style="font-size:11px;padding:2px 9px">Usar este</button>`}
          <button class="btn-secondary btn-sm" data-pl-renombrar="${l(e._id)}" style="font-size:11px;padding:2px 9px">Renombrar</button>
          ${t.length>1?`<button class="btn-secondary btn-sm" data-pl-borrar-plan="${l(e._id)}" style="font-size:11px;padding:2px 9px;color:var(--red)">Borrar</button>`:""}
        </div>
      </div>`}).join("")}
  </div>`}function br(t){const a=t.slice(0,3),e=a.map(r=>({plan:r,res:ge(r)})),o=tr(e.map(({plan:r,res:d})=>({nombre:r.nombre,hitos:d.hitos}))),s=["Hito",...a.map(r=>r.nombre)].map((r,d)=>`<th style="text-align:${d===0?"left":"right"};padding:6px 8px;font-size:11px;color:var(--text3)">${l(r)}</th>`).join(""),n=o.map(r=>`<tr>
      <td style="padding:5px 8px;font-size:12px">${l(r.nombre)}</td>
      ${r.meses.map((d,c)=>{const x=r.diferencias[c],p=x===null||x===0?"var(--text2)":x<0?"var(--accent)":"var(--red)",u=c===0||x===null||x===0?"":`<div style="font-size:10px;color:${p}">${x>0?"+":""}${x} m</div>`;return`<td style="text-align:right;padding:5px 8px;font-family:var(--font-mono);font-size:11px;color:${p}">
            ${l(d??"no llega")}${u}
          </td>`}).join("")}
    </tr>`).join("");return`<div class="card mb-14">
    <div class="card-title mb-10">Comparativa</div>
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">${e.map(({plan:r,res:d})=>`<div style="flex:1;min-width:150px">
      <div style="font-size:11px;color:var(--text3)">${l(r.nombre)}</div>
      <div style="font-family:var(--font-mono);font-size:15px;font-weight:700">${l(Fo(d.resumen.patrimonioFinal))}</div>
      <div style="font-size:10px;color:${d.viable?"var(--accent)":"var(--red)"}">${d.viable?"viable":"no cabe en el flujo"}</div>
    </div>`).join("")}</div>
    ${o.length===0?'<div class="text-sm" style="color:var(--text3)">Ninguno de los planes completa objetivos dentro de su horizonte.</div>':`<div style="overflow-x:auto">
             <table style="width:100%;border-collapse:collapse">
               <thead><tr style="border-bottom:1px solid var(--border2)">${s}</tr></thead>
               <tbody>${n}</tbody>
             </table>
           </div>
           <div class="text-sm mt-8" style="color:var(--text3)">
             Los hitos se emparejan por nombre. La diferencia es respecto al primer plan de la tabla.
           </div>`}
  </div>`}function hr(t){return t?`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Análisis de sensibilidad</span>
      <button class="btn-secondary btn-sm" data-pl-sensibilidad>Recalcular</button>
    </div>
    ${t.map(yr).join("")}
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
    </div>`}function yr(t){return`<div style="margin-bottom:18px">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px">${l(t.titulo)}</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px">${l(t.descripcion)}</div>
    ${t.variantes.map(a=>{const e=a.desplazamientoMeses,o=e===null?"var(--text3)":e===0?"var(--text2)":e<0?"var(--accent)":"var(--red)";return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 0;font-size:12px;${a.esBase?"border-top:1px solid var(--border);border-bottom:1px solid var(--border);":""}">
        <span style="${a.esBase?"font-weight:700":"color:var(--text2)"}">${l(a.etiqueta)}</span>
        <span style="display:flex;gap:14px;align-items:baseline">
          <span style="color:${o};font-size:11px">${l(fr(e))}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3);min-width:88px;text-align:right">${l(Fo(a.patrimonioFinal))}</span>
        </span>
      </div>`}).join("")}
  </div>`}const At=t=>z(t/100);function xr(t,a,e=0){return`
    ${$r(a)}
    ${Ir(t,a)}
    <div class="card mb-14">
      <div class="card-title mb-12">Patrimonio por vehículo</div>
      <div class="chart-wrap-lg"><canvas id="pl-chart"></canvas></div>
    </div>
    ${Ar(a)}
    ${Mr(t,a)}
    ${Sr(t,a,e)}`}function $r(t){if(t.avisos.length===0&&t.propuestas.length===0)return"";const a={error:"var(--red)",atencion:"var(--yellow)",info:"var(--text2)"},e=t.avisos.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:5px">
        <span style="color:${a[i.severidad]};flex-shrink:0">${i.severidad==="error"?"✕":"⚠"}</span>
        <span style="color:var(--text2)">${l(i.mensaje)}</span>
      </div>`).join(""),o=t.propuestas.length>0?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
           <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Cómo hacerlo encajar — elige una:</div>
           ${t.propuestas.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:4px">
             <span style="color:var(--accent);flex-shrink:0">→</span><span style="color:var(--text2)">${l(i.mensaje)}</span>
           </div>`).join("")}
         </div>`:"",s=t.viable?"rgba(255,209,102,0.28)":"rgba(255,77,109,0.3)";return`<div class="card mb-14" style="background:${t.viable?"rgba(255,209,102,0.05)":"rgba(255,77,109,0.05)"};border-color:${s}">
    <div class="card-title mb-8">${t.viable?"Cosas a revisar":"El plan no cabe en tu flujo de caja"}</div>
    ${e}${o}
  </div>`}function Ir(t,a){const e=(s,n,i="")=>`<div class="stat-card">
      <div class="stat-label">${l(s)}</div>
      <div class="stat-value" style="font-size:18px">${l(n)}</div>
      ${i?`<div class="stat-sub">${l(i)}</div>`:""}
    </div>`,o=a.serieMensual[a.serieMensual.length-1];return`<div class="grid-4 mb-14">
    ${e("Patrimonio final",At(a.resumen.patrimonioFinal),o?`en ${o.mes}`:"")}
    ${e("Total aportado",At(a.resumen.totalAportado),`${a.mesesSimulados} meses simulados`)}
    ${e("Total a disfrute",At(a.resumen.totalDisfrute),`${Math.round(t.pctDisfrute*100)} % del sobrante`)}
    ${e("Independencia",a.resumen.mesIndependencia??"—",a.resumen.mesIndependencia?"objetivo perpetuo cubierto":"sin objetivo de independencia")}
  </div>`}function Ar(t){return t.hitos.length===0?`<div class="card mb-14"><div class="card-title mb-8">Hitos</div>
      <div class="text-sm" style="color:var(--text3)">Ningún objetivo se completa dentro del horizonte.</div></div>`:`<div class="card mb-14">
    <div class="card-title mb-12">Hitos</div>
    ${t.hitos.map(a=>`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div style="display:flex;align-items:center;gap:9px">
          <span style="font-family:var(--font-mono);color:var(--accent);font-size:11px">${l(a.mes)}</span>
          <span style="font-weight:600">${l(a.nombre)}</span>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono)">${l(At(a.importeFinal))}</div>
          ${a.cuotaLiberada>0?`<div style="font-size:10px;color:var(--text3)">libera ${l(At(a.cuotaLiberada))}/mes</div>`:""}
        </div>
      </div>`).join("")}
  </div>`}function Mr(t,a){if(a.fases.length<=1)return"";const e=o=>{var s;return((s=t.objetivos.find(n=>n._id===o))==null?void 0:s.nombre)??o};return`<div class="card mb-14">
    <div class="card-title mb-12">Fases del plan</div>
    <div class="text-sm mb-10" style="color:var(--text3)">Tramos entre hitos: en cada uno el dinero se reparte de forma distinta.</div>
    ${a.fases.map((o,s)=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);flex-shrink:0;width:26px">${s+1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${l(o.desde)} → ${l(o.hasta)} <span style="color:var(--text3);font-weight:400">(${o.meses} mes${o.meses!==1?"es":""})</span></div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">${l(o.objetivosActivos.map(e).join(" · ")||"sin asignaciones")}</div>
        </div>
      </div>`).join("")}
  </div>`}const se=60;function Sr(t,a,e=0){if(a.serieMensual.length===0)return"";const o=[...t.objetivos].sort((x,p)=>x.prioridad-p.prioridad),s=Math.ceil(a.serieMensual.length/se),n=Math.min(Math.max(0,e),s-1),i=a.serieMensual.slice(n*se,(n+1)*se),r=["Mes","Disponible",...o.map(x=>x.nombre),"Sin asignar","Patrimonio"].map(x=>`<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${l(x)}</th>`).join(""),d=i.map(x=>{const p=o.map(u=>{const v=x.asignaciones.find($=>$.objetivoId===u._id),b=(v==null?void 0:v.asignado)??0;return`<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${b>0?"var(--text)":"var(--text3)"}">${l(b>0?At(b):"·")}</td>`}).join("");return`<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${l(x.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${l(At(x.disponible))}</td>
        ${p}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${l(x.sinAsignar>0?At(x.sinAsignar):"·")}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${l(At(x.patrimonioTotal))}</td>
      </tr>`}).join(""),c=s>1?`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap">
           <button class="btn-secondary btn-sm" data-pl-pagina="${n-1}"${n===0?" disabled":""}>← Anteriores</button>
           <span class="text-sm" style="color:var(--text3)">
             Meses ${n*se+1}–${Math.min((n+1)*se,a.serieMensual.length)} de ${a.serieMensual.length}
           </span>
           <button class="btn-secondary btn-sm" data-pl-pagina="${n+1}"${n>=s-1?" disabled":""}>Siguientes →</button>
         </div>`:"";return`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Mes a mes</span>
      <button class="btn-secondary btn-sm" data-pl-csv>Exportar CSV</button>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead><tr style="border-bottom:1px solid var(--border2)">${r}</tr></thead>
        <tbody>${d}</tbody>
      </table>
    </div>
    ${c}
  </div>`}function wr(t,a){const e=[...t.objetivos].sort((i,r)=>i.prioridad-r.prioridad),o=i=>(i/100).toFixed(2).replace(".",","),s=["Mes","Neto","Gastos fijos","Disfrute","Disponible",...e.map(i=>i.nombre),"Sin asignar","Patrimonio"],n=a.serieMensual.map(i=>[i.mes,o(i.netoMensual),o(i.gastosFijos),o(i.disfrute),o(i.disponible),...e.map(r=>{var d;return o(((d=i.asignaciones.find(c=>c.objetivoId===r._id))==null?void 0:d.asignado)??0)}),o(i.sinAsignar),o(i.patrimonioTotal)].join(";"));return[s.join(";"),...n].join(`
`)}const Bt=t=>{const a=typeof t=="number"?t:parseFloat(String(t).replace(",","."));return Number.isFinite(a)?Math.round(a*100):0},ne=t=>(t/100).toFixed(2),_o=t=>(t*100).toFixed(2),Ht=t=>{const a=parseFloat(String(t).replace(",","."));return Number.isFinite(a)?a/100:0},Cr=[["AHORRO_OBJETIVO","Ahorrar una cantidad"],["AMORTIZAR_DEUDA","Amortizar deuda"],["INVERSION_PERPETUA","Independencia económica"],["APORTACION_FIJA","Aportación periódica"]],jr=[["CUOTA_POR_FECHA","Cuota para llegar a la fecha"],["ABSORBE_TODO","Se lleva todo lo disponible"],["ABSORBE_RESIDUAL","Recibe lo que sobre"],["FIJO","Importe fijo al mes"]],zr=[["INMEDIATA","Inmediata"],["MEDIA","Media (con preaviso o penalización)"],["BLOQUEADA_HASTA_JUBILACION","Bloqueada hasta la jubilación"]],Er=[["NULO","Nulo"],["BAJO","Bajo"],["MEDIO","Medio"],["ALTO","Alto"]],Po={AHORRO_OBJETIVO:"CUOTA_POR_FECHA",AMORTIZAR_DEUDA:"ABSORBE_TODO",INVERSION_PERPETUA:"ABSORBE_RESIDUAL",APORTACION_FIJA:"FIJO"},lt=(t,a,e,o,s="",n="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${a}</label>
    <input class="form-input" id="${t}" type="${e}" value="${l(o)}" ${n}>
    ${s?`<div class="text-sm mt-4" style="color:var(--text3)">${s}</div>`:""}
  </div>`,Pt=(t,a,e,o,s="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${a}</label>
    <select class="form-input" id="${t}">
      ${e.map(([n,i])=>`<option value="${l(n)}"${n===o?" selected":""}>${l(i)}</option>`).join("")}
    </select>
    ${s?`<div class="text-sm mt-4" style="color:var(--text3)">${s}</div>`:""}
  </div>`;function Fr(t,a,e){var d,c,x;const o=t===null,s=(t==null?void 0:t.tipo)??"AHORRO_OBJETIVO",n=(t==null?void 0:t.modoAsignacion)??Po[s],i=!!(t!=null&&t.rentaDeseada),r=a.length>0?a.map(p=>[p._id,p.nombre]):[["","— no hay vehículos: crea uno primero —"]];return`
    <div class="grid-2" style="gap:10px">
      ${lt("ob-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Entrada del piso"')}
      ${lt("ob-prioridad","Prioridad","number",(t==null?void 0:t.prioridad)??e,"Menor número = se sirve antes",'min="1"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Pt("ob-tipo","Tipo",Cr,s)}
      ${Pt("ob-modo","Cómo pide dinero",jr,n)}
    </div>
    <div class="text-sm mb-12" id="ob-modo-ayuda" style="color:var(--text3);line-height:1.6"></div>

    <!-- Independencia económica: capital o renta (§2.6) -->
    <div id="ob-bloque-perpetua" style="display:${s==="INVERSION_PERPETUA"?"block":"none"}">
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
            ${lt("ob-renta","Renta neta mensual (€)","number",ne(((d=t==null?void 0:t.rentaDeseada)==null?void 0:d.rentaNetaMensual)??2e5),"",'step="0.01"')}
            ${lt("ob-swr","Tasa de retiro seguro (%)","number",((((c=t==null?void 0:t.rentaDeseada)==null?void 0:c.tasaRetiroSeguro)??.04)*100).toFixed(2),"",'step="0.1"')}
          </div>
          ${lt("ob-fiscal","Tipo fiscal efectivo al retirar (%)","number",((((x=t==null?void 0:t.rentaDeseada)==null?void 0:x.tipoFiscalEfectivo)??.2)*100).toFixed(2),"",'step="0.5"')}
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
        ${lt("ob-importe","Importe objetivo (€)","number",ne((t==null?void 0:t.importeObjetivo)??0),"Deja 0 si no tiene meta (un cubo perpetuo)",'step="0.01"')}
      </div>
      ${lt("ob-fecha","Fecha límite","month",(t==null?void 0:t.fechaLimite)??"","Vacío = lo antes posible")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ob-saldo","Ya acumulado (€)","number",ne((t==null?void 0:t.saldoActual)??0),"Con lo que arranca el objetivo",'step="0.01"')}
      ${Pt("ob-vehiculo","Vehículo",r,(t==null?void 0:t.vehiculoId)??r[0][0])}
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-fijo" style="display:${n==="FIJO"?"block":"none"}">
        ${lt("ob-fijo","Importe fijo mensual (€)","number",ne((t==null?void 0:t.importeFijoMensual)??0),"",'step="0.01"')}
      </div>
      <div id="ob-bloque-residual" style="display:${n==="ABSORBE_RESIDUAL"?"block":"none"}">
        ${lt("ob-peso","Peso del residual","number",(t==null?void 0:t.pesoResidual)??1,"Si hay varios, reparte en proporción",'min="0" step="0.5"')}
      </div>
    </div>

    <div class="form-group">
      <label class="form-label" for="ob-notas">Notas</label>
      <textarea class="form-input" id="ob-notas" rows="2" style="resize:vertical;font-family:var(--font-sans)">${l((t==null?void 0:t.notas)??"")}</textarea>
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ob-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ob-cancelar>Cancelar</button>
      <button class="btn-primary" data-ob-guardar>${o?"Crear objetivo":"Guardar"}</button>
    </div>`}function _r(t,a,e){var c;const o=x=>{var p;return((p=t.querySelector(`#${x}`))==null?void 0:p.value)??""},s=o("ob-nombre").trim();if(!s)return null;const n=o("ob-tipo"),i=o("ob-modo"),r=((c=t.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:c.value)==="renta",d=n==="INVERSION_PERPETUA"&&r;return{_id:(a==null?void 0:a._id)??`obj_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:s,tipo:n,importeObjetivo:d?null:Bt(o("ob-importe")),fechaLimite:o("ob-fecha")||null,prioridad:Math.max(1,Number(o("ob-prioridad"))||e),modoAsignacion:i,vehiculoId:o("ob-vehiculo"),saldoActual:Bt(o("ob-saldo")),estado:(a==null?void 0:a.estado)??"PENDIENTE",notas:o("ob-notas"),...i==="FIJO"?{importeFijoMensual:Bt(o("ob-fijo"))}:{},...i==="ABSORBE_RESIDUAL"?{pesoResidual:Math.max(0,Number(o("ob-peso"))||1)}:{},...d?{rentaDeseada:{rentaNetaMensual:Bt(o("ob-renta")),tasaRetiroSeguro:Ht(o("ob-swr")),tipoFiscalEfectivo:Ht(o("ob-fiscal"))}}:{rentaDeseada:null}}}function Pr(t){const a=e=>{var o;return((o=t.querySelector(`#${e}`))==null?void 0:o.value)??""};try{const{capitalNecesario:e}=Io({rentaNetaMensual:Bt(a("ob-renta")),tasaRetiroSeguro:Ht(a("ob-swr")),tipoFiscalEfectivo:Ht(a("ob-fiscal"))});return`${(e/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0})} €`}catch{return"no calculable con esos parámetros"}}function Tr(t,a,e){const o=t===null,s=!!(t!=null&&t.esDeuda),n=[["","— ninguna —"],...a.map(r=>[r._id,r.nombre])],i=[["","— ninguno —"],...e.map(r=>[r._id,`${r.nombre} (${r.tin} % TIN)`])];return`
    <div class="card mb-12" style="background:rgba(46,230,168,0.05);border-color:rgba(46,230,168,0.22);padding:12px">
      <div class="text-sm" style="color:var(--text2);line-height:1.7">
        <strong>Amortizar deuda también rinde.</strong> El interés que dejas de pagar es un retorno
        <strong>garantizado</strong>: un préstamo al 9 % «renta» más, y sin riesgo, que un fondo al 5 %. Por eso
        suele encabezar la prioridad, aunque cueste verlo como una inversión.
      </div>
    </div>

    <label style="display:flex;align-items:center;gap:8px;margin-bottom:12px;font-size:13px;cursor:pointer">
      <input type="checkbox" id="ve-deuda"${s?" checked":""} style="accent-color:var(--accent)">
      Este vehículo amortiza un préstamo
    </label>

    <div id="ve-bloque-prestamo" style="display:${s?"block":"none"}">
      ${Pt("ve-prestamo","Préstamo",i,(t==null?void 0:t.prestamoId)??"","Su TIN se usará como rentabilidad")}
    </div>

    ${lt("ve-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Fondo indexado"')}

    <div class="grid-2" style="gap:10px">
      ${lt("ve-rent","Rentabilidad REAL anual (%)","number",_o((t==null?void 0:t.rentabilidadRealAnual)??0),"Nominal menos inflación. Un fondo al 7 % nominal con 2 % de inflación son 5 %",'step="0.1"')}
      ${lt("ve-fiscal","Fiscalidad al retirar (%)","number",_o((t==null?void 0:t.fiscalidadRetirada)??0),"Tipo efectivo sobre la plusvalía",'step="0.5"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Pt("ve-liquidez","Liquidez",zr,(t==null?void 0:t.liquidez)??"INMEDIATA")}
      ${Pt("ve-riesgo","Riesgo",Er,(t==null?void 0:t.riesgo)??"NULO")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ve-tope","Tope de aportación anual (€)","number",t!=null&&t.topeAportacionAnual?ne(t.topeAportacionAnual):"","Vacío = sin tope. Pensiones: 1500",'step="0.01"')}
      ${Pt("ve-cuenta","Cuenta asociada",n,(t==null?void 0:t.cuentaId)??"","Enlaza con una cuenta que ya tengas")}
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ve-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ve-cancelar>Cancelar</button>
      <button class="btn-primary" data-ve-guardar>${o?"Crear vehículo":"Guardar"}</button>
    </div>`}function Dr(t,a){var i;const e=r=>{var d;return((d=t.querySelector(`#${r}`))==null?void 0:d.value)??""},o=e("ve-nombre").trim();if(!o)return null;const s=((i=t.querySelector("#ve-deuda"))==null?void 0:i.checked)??!1,n=e("ve-tope").trim();return{_id:(a==null?void 0:a._id)??`veh_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:o,rentabilidadRealAnual:Ht(e("ve-rent")),liquidez:e("ve-liquidez"),fiscalidadRetirada:Ht(e("ve-fiscal")),topeAportacionAnual:n?Bt(n):null,riesgo:e("ve-riesgo"),cuentaId:e("ve-cuenta")||null,prestamoId:s&&e("ve-prestamo")||null,esDeuda:s}}const Rr={CUOTA_POR_FECHA:"Cada mes calcula lo que hace falta para llegar a la fecha, con el saldo que lleva. Si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo lo disponible hasta completarse. Los de menor prioridad no reciben nada mientras tanto.",ABSORBE_RESIDUAL:"No reclama nada: recoge lo que quede tras servir a los de arriba. Es el modo del cubo de largo plazo.",FIJO:"Aporta siempre lo mismo. Si el vehículo tiene tope anual, se aporta hasta agotarlo y se reanuda en enero."},Or="M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z",To=t=>{const a=parseFloat(String(t).replace(",","."));return Number.isFinite(a)?Math.round(a*100):0},he=t=>(t/100).toFixed(2);function Nr(t){const a=t.hoy??J;let e="config",o=null,s=0,n=null;function i(){const w=t.store.get("planes");return w.find(P=>P.activo)??w[0]??null}function r(){const w=i();return w||t.store.addItem("planes",{nombre:"Plan base",fechaInicio:a().slice(0,7),horizonteMeses:480,pctDisfrute:0,activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:[],objetivos:[],eventos:[],creadoEn:a()})}function d(w){var T;const P=i();P&&(t.store.updateItem("planes",P._id,w),n=null,o=null,(T=t.onDatosCambiados)==null||T.call(t))}function c(){const P=t.store.get("nominas").filter(N=>N.activo).reduce((N,_)=>N+(_.bruto||0),0),T=Math.round(P*.75/12),R=t.store.get("expenses").filter(N=>N.activo&&N.basico&&N.tipo==="gasto").reduce((N,_)=>N+(_.cuantia||0),0);return{neto:Math.round(T*100),gastos:Math.round(R*100)}}function x(w){return n||(n=ge(w)),n}function p(w){const P=c(),T=Math.max(0,w.perfil.netoMensual-w.perfil.gastosFijosMensuales),R=Math.round(w.pctDisfrute*100);return`
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${l(he(w.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${l(z(P.neto/100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${l(he(w.perfil.gastosFijosMensuales))}">
            <div class="text-sm mt-4" style="color:var(--text3)">Según tus gastos básicos: ~${l(z(P.gastos/100))}/mes</div>
          </div>
        </div>

        <div class="form-group mt-8">
          <label class="form-label">Disfrute: <span id="pl-pct-val" style="font-family:var(--font-mono);color:var(--accent)">${R} %</span> del sobrante</label>
          <input type="range" id="pl-disfrute" min="0" max="100" step="1" value="${R}" style="width:100%;accent-color:var(--accent)">
          <div class="text-sm mt-4" style="color:var(--text3)">
            Lo que NO se asigna a objetivos. Con ${l(z(Math.max(0,w.perfil.netoMensual-w.perfil.gastosFijosMensuales)/100))} de sobrante,
            quedan <strong id="pl-disponible">${l(z(T*(1-w.pctDisfrute)/100))}</strong>/mes para los objetivos.
          </div>
        </div>

        <div class="grid-2 mt-8" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Mes de inicio</label>
            <input class="form-input" type="month" id="pl-inicio" value="${l(w.fechaInicio)}">
          </div>
          <div class="form-group">
            <label class="form-label">Horizonte (meses)</label>
            <input class="form-input" type="number" id="pl-horizonte" min="1" max="600" value="${l(w.horizonteMeses)}">
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

      ${u(w)}`}function u(w){return`
      <div class="card">
        <div class="card-title mb-8">Notas del plan</div>
        <textarea class="form-input" id="pl-notas" rows="4" style="resize:vertical;font-family:var(--font-sans)"
          placeholder="Supuestos, decisiones tomadas, cosas a revisar…">${l(w.notas??"")}</textarea>
        <button class="btn-secondary btn-sm mt-8" data-pl-guardar-notas>Guardar notas</button>
      </div>`}const v=()=>document.getElementById("modal-overlay"),b=()=>document.getElementById("modal-content"),$=()=>{var w;return(w=v())==null?void 0:w.classList.add("hidden")};function A(w,P){const T=v(),R=b();return!T||!R?null:(R.innerHTML=`<div class="modal-title">${l(w)}</div>${P}`,T.classList.remove("hidden"),R)}function m(w){d({objetivos:w})}function g(w,P){const T=i();if(!T)return;const R=P?T.objetivos.find(B=>B._id===P)??null:null,N=T.objetivos.reduce((B,O)=>Math.max(B,O.prioridad),0)+1,_=A(R?`Editar «${R.nombre}»`:"Nuevo objetivo",Fr(R,T.vehiculos,N));if(!_)return;const k=()=>{var U;const B=(U=_.querySelector("#ob-modo"))==null?void 0:U.value,O=_.querySelector("#ob-modo-ayuda");O&&B&&(O.textContent=Rr[B]);const H=(W,Q)=>{const at=_.querySelector(W);at&&(at.style.display=Q?"block":"none")};H("#ob-bloque-fijo",B==="FIJO"),H("#ob-bloque-residual",B==="ABSORBE_RESIDUAL")};k();const L=()=>{const B=_.querySelector("#ob-capital-derivado");B&&(B.textContent=Pr(_))};L(),Y(_,"#ob-modo",k),Y(_,"#ob-tipo",()=>{const B=_.querySelector("#ob-tipo").value,O=_.querySelector("#ob-modo");O&&(O.value=Po[B]);const H=_.querySelector("#ob-bloque-perpetua");H&&(H.style.display=B==="INVERSION_PERPETUA"?"block":"none"),k()}),Y(_,'input[name="ob-derivar"]',()=>{var U;const B=((U=_.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:U.value)==="renta",O=_.querySelector("#ob-renta-campos"),H=_.querySelector("#ob-bloque-importe");O&&(O.style.display=B?"block":"none"),H&&(H.style.display=B?"none":"block"),L()}),Y(_,"#ob-renta, #ob-swr, #ob-fiscal",L),D(_,"[data-ob-cancelar]",$),D(_,"[data-ob-guardar]",()=>{const B=_r(_,R,N);if(!B){q("El objetivo necesita un nombre","err");return}if(!B.vehiculoId){q("Crea antes un vehículo donde meter el dinero","err");return}const O=T.objetivos.filter(H=>H._id!==B._id);m([...O,B]),$(),q(R?"Objetivo actualizado":`Objetivo «${B.nombre}» creado`),E(w)}),D(_,"[data-ob-borrar]",()=>{R&&X(`¿Borrar «${R.nombre}»? Esto no se puede deshacer.`)&&(m(T.objetivos.filter(B=>B._id!==R._id)),$(),q("Objetivo borrado"),E(w))})}function h(w,P){const T=i();if(!T)return;const R=P?T.vehiculos.find(L=>L._id===P)??null:null,N=t.store.get("accounts").filter(L=>L.activo).map(L=>({_id:L._id,nombre:L.nombre})),_=t.store.get("loans").filter(L=>L.activo&&!L.simulacion).map(L=>({_id:L._id,nombre:L.nombre,tin:L.tin})),k=A(R?`Editar «${R.nombre}»`:"Nuevo vehículo",Tr(R,N,_));k&&(Y(k,"#ve-deuda",()=>{const L=k.querySelector("#ve-deuda").checked,B=k.querySelector("#ve-bloque-prestamo");B&&(B.style.display=L?"block":"none")}),Y(k,"#ve-prestamo",()=>{const L=k.querySelector("#ve-prestamo").value,B=_.find(U=>U._id===L);if(!B)return;const O=k.querySelector("#ve-rent"),H=k.querySelector("#ve-nombre");O&&(O.value=String(B.tin)),H&&!H.value.trim()&&(H.value=`Amortizar ${B.nombre}`)}),D(k,"[data-ve-cancelar]",$),D(k,"[data-ve-guardar]",()=>{const L=Dr(k,R);if(!L){q("El vehículo necesita un nombre","err");return}const B=T.vehiculos.filter(O=>O._id!==L._id);d({vehiculos:[...B,L]}),$(),q(R?"Vehículo actualizado":`Vehículo «${L.nombre}» creado`),E(w)}),D(k,"[data-ve-borrar]",()=>{if(!R)return;const L=T.objetivos.filter(B=>B.vehiculoId===R._id);if(L.length>0){q(`No se puede borrar: lo usan ${L.length} objetivo${L.length!==1?"s":""}`,"err");return}X(`¿Borrar el vehículo «${R.nombre}»?`)&&(d({vehiculos:T.vehiculos.filter(B=>B._id!==R._id)}),$(),q("Vehículo borrado"),E(w))}))}function I(w,P,T){const R=i();if(!R||P===T)return;const N=[...R.objetivos].sort((B,O)=>B.prioridad-O.prioridad),_=N.findIndex(B=>B._id===P),k=N.findIndex(B=>B._id===T);if(_<0||k<0)return;const[L]=N.splice(_,1);N.splice(k,0,L),m(N.map((B,O)=>({...B,prioridad:O+1}))),E(w)}function f(w){return w.vehiculos.length===0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.06);border-color:rgba(255,209,102,0.28)">
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          <strong style="color:var(--yellow)">No hay vehículos todavía.</strong>
          Un vehículo es dónde va el dinero —una cuenta, un fondo, un plan de pensiones o la amortización de un
          préstamo— y con qué rentabilidad crece. Hace falta al menos uno para poder crear objetivos.
        </div>
      </div>`:`<div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Vehículos</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${w.vehiculos.map(P=>{const T=w.objetivos.filter(R=>R.vehiculoId===P._id).length;return`<button class="btn-secondary btn-sm" data-pl-editar-vehiculo="${l(P._id)}"
              style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 11px;text-align:left${P.revisarRentabilidad?";border-color:rgba(255,209,102,0.45)":""}">
              <span style="font-weight:600;font-size:12px">${l(P.nombre)}${P.esDeuda?" 🔒":""}${P.revisarRentabilidad?" ⚠":""}</span>
              <span style="font-size:10px;color:var(--text3)">
                ${l((P.rentabilidadRealAnual*100).toFixed(2))} % real · ${T} objetivo${T!==1?"s":""}
              </span>
            </button>`}).join("")}
      </div>
      ${w.vehiculos.some(P=>P.revisarRentabilidad)?`<div class="text-sm mt-10" style="color:var(--yellow);line-height:1.7;padding-top:10px;border-top:1px solid var(--border)">
               ⚠ Los vehículos marcados traen la rentabilidad de tus cuentas, que es <strong>nominal</strong>.
               Este módulo trabaja en términos <strong>reales</strong>: réstale la inflación que esperes
               (unos 2 puntos) o la simulación te dirá que llegas antes de lo que llegarás. Al guardarlos
               desde su formulario el aviso desaparece.
             </div>`:""}
    </div>`}function y(w,P,T){const R=i(),N=Ki(P);if(!R||!N)return;const _=T?R.eventos.find(O=>O._id===T)??null:null,k={};N.id==="hijo"&&(k.actuales=R.perfil.gastosFijosMensuales),N.id==="subida-sueldo"&&(k.actual=R.perfil.netoMensual);const L=A(_?`Editar evento · ${N.nombre}`:N.nombre,nr(N,_,R,k));if(!L)return;const B=()=>{const O=L.querySelector("#ev-resultado");O&&(O.textContent=ir(N,zo(L,N)))};B();for(const O of N.campos)Y(L,`#ev-${O.id}`,B);D(L,"[data-ev-cancelar]",$),D(L,"[data-ev-guardar]",()=>{var W,Q;const O=((W=L.querySelector("#ev-fecha"))==null?void 0:W.value)??"";if(!O){q("El evento necesita un mes","err");return}const H=zo(L,N),U={_id:(_==null?void 0:_._id)??`ev_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,fecha:O,tipo:N.tipo,importe:N.calcular(H),objetivoDestinoId:((Q=L.querySelector("#ev-destino"))==null?void 0:Q.value)||null,notas:N.resumir(H)};d({eventos:[...R.eventos.filter(at=>at._id!==U._id),U]}),$(),q(_?"Evento actualizado":"Evento añadido"),E(w)}),D(L,"[data-ev-borrar]",()=>{!_||!X("¿Borrar este evento?")||(d({eventos:R.eventos.filter(O=>O._id!==_._id)}),$(),q("Evento borrado"),E(w))})}function M(w){var P;switch(w.tipo){case"CAMBIO_GASTOS_FIJOS":return"hijo";case"CAMBIO_INGRESOS":return"subida-sueldo";case"NUEVA_DEUDA":return"nueva-hipoteca";case"INYECCION_CAPITAL":return(P=w.notas)!=null&&P.includes("hipoteca")?"venta-vivienda":"inyeccion"}}function S(){const w=i();if(!w)return;const P=new Blob([JSON.stringify(w,null,2)],{type:"application/json"}),T=URL.createObjectURL(P),R=document.createElement("a");R.href=T,R.download=`plan-${w.nombre.replace(/[^\w-]+/g,"_")}-${a()}.json`,R.click(),URL.revokeObjectURL(T),q("Plan exportado")}function C(w){const P=document.createElement("input");P.type="file",P.accept="application/json,.json",P.addEventListener("change",async()=>{var R,N;const T=(R=P.files)==null?void 0:R[0];if(T)try{const _=JSON.parse(await T.text());if(!_||!Array.isArray(_.objetivos)||!Array.isArray(_.vehiculos)||!_.perfil){q("Ese fichero no es un plan de objetivos","err");return}const k=`${_.nombre??"Importado"} (importado)`,L=t.store.addItem("planes",{..._,nombre:k,activo:!1,creadoEn:a()});n=null,o=null,(N=t.onDatosCambiados)==null||N.call(t),q(`Plan «${L.nombre}» importado`),E(w)}catch(_){console.error("[Planner] Importación fallida:",_),q("No se ha podido leer el fichero","err")}}),P.click()}function j(w,P){switch(e){case"config":return p(w);case"objetivos":return Wi(w,P);case"simulacion":return xr(w,P,s);case"eventos":return or(w);case"escenarios":return vr(t.store.get("planes"),w._id,o)}}function E(w){const P=r(),T=x(P),R=(_,k)=>`<button class="period-btn ${e===_?"active":""}" data-pl-tab="${_}">${k}</button>`,N=T.viable?'<span class="badge badge-green">Plan viable</span>':'<span class="badge badge-red">No cabe en el flujo</span>';if(w.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Objetivos <span>financieros</span></h1>
        <div class="page-actions">${N}</div>
      </div>

      <div class="period-selector mb-14">
        ${R("config","Plan")}
        ${R("objetivos",`Objetivos (${P.objetivos.length})`)}
        ${R("simulacion","Simulación")}
        ${R("eventos",`Eventos (${P.eventos.length})`)}
        ${R("escenarios","Escenarios")}
      </div>

      ${e==="objetivos"?`<div class="flex gap-8 mb-14 flex-wrap">
               <button class="btn-primary" data-pl-nuevo-objetivo>+ Nuevo objetivo</button>
               <button class="btn-secondary" data-pl-nuevo-vehiculo>+ Nuevo vehículo</button>
             </div>
             ${f(P)}`:""}

      <div id="pl-cuerpo">${j(P,T)}</div>`,e==="simulacion"){const _=w.querySelector("#pl-chart");_&&Ui(_,P,T)}F(w)}function F(w){D(w,"[data-pl-tab]",T=>{e=T.dataset.plTab,E(w)}),Y(w,"#pl-disfrute",T=>{const R=Number(T.value)/100,N=w.querySelector("#pl-pct-val");N&&(N.textContent=`${Math.round(R*100)} %`);const _=i();if(!_)return;const k=Math.max(0,_.perfil.netoMensual-_.perfil.gastosFijosMensuales)*(1-R),L=w.querySelector("#pl-disponible");L&&(L.textContent=z(k/100))}),D(w,"[data-pl-usar-sugerido]",()=>{const T=c(),R=w.querySelector("#pl-neto"),N=w.querySelector("#pl-gastos");R&&(R.value=he(T.neto)),N&&(N.value=he(T.gastos))}),D(w,"[data-pl-guardar]",()=>{const T=R=>{var N;return((N=w.querySelector(R))==null?void 0:N.value)??""};d({perfil:{netoMensual:To(T("#pl-neto")),gastosFijosMensuales:To(T("#pl-gastos")),manual:!0},pctDisfrute:Math.min(1,Math.max(0,Number(T("#pl-disfrute"))/100)),fechaInicio:T("#pl-inicio")||a().slice(0,7),horizonteMeses:Math.min(600,Math.max(1,Number(T("#pl-horizonte"))||480))}),q("Plan guardado"),E(w)}),D(w,"[data-pl-plantilla]",T=>y(w,T.dataset.plPlantilla??"",null)),D(w,"[data-pl-editar-evento]",T=>{var _;const R=T.dataset.plEditarEvento??"",N=(_=i())==null?void 0:_.eventos.find(k=>k._id===R);N&&y(w,M(N),R)}),D(w,"[data-pl-duplicar]",()=>{var _;const T=i();if(!T)return;const R=window.prompt("Nombre del plan nuevo:",`${T.nombre} (copia)`);if(!(R!=null&&R.trim()))return;const N=Zi(T,R.trim(),`plan_${Date.now().toString(36)}`,a());t.store.addItem("planes",N),(_=t.onDatosCambiados)==null||_.call(t),q(`Plan «${N.nombre}» creado. Actívalo para editarlo.`),E(w)}),D(w,"[data-pl-activar]",T=>{var N;const R=T.dataset.plActivar;if(R){for(const _ of t.store.get("planes"))t.store.updateItem("planes",_._id,{activo:_._id===R});n=null,o=null,(N=t.onDatosCambiados)==null||N.call(t),q("Plan activo cambiado"),E(w)}}),D(w,"[data-pl-renombrar]",T=>{var k;const R=T.dataset.plRenombrar,N=t.store.get("planes").find(L=>L._id===R);if(!N)return;const _=window.prompt("Nuevo nombre:",N.nombre);_!=null&&_.trim()&&(t.store.updateItem("planes",N._id,{nombre:_.trim()}),(k=t.onDatosCambiados)==null||k.call(t),E(w))}),D(w,"[data-pl-borrar-plan]",T=>{var k;const R=T.dataset.plBorrarPlan,N=t.store.get("planes").find(L=>L._id===R);if(!N||!X(`¿Borrar el plan «${N.nombre}» con sus ${N.objetivos.length} objetivos? No se puede deshacer.`))return;t.store.removeItem("planes",N._id);const _=t.store.get("planes");N.activo&&_.length>0&&t.store.updateItem("planes",_[0]._id,{activo:!0}),n=null,o=null,(k=t.onDatosCambiados)==null||k.call(t),q("Plan borrado"),E(w)}),D(w,"[data-pl-sensibilidad]",()=>{const T=i();T&&(o=mr(T),E(w))}),D(w,"[data-pl-pagina]",T=>{s=Number(T.dataset.plPagina)||0,E(w)}),D(w,"[data-pl-exportar]",S),D(w,"[data-pl-importar]",()=>C(w)),D(w,"[data-pl-nuevo-objetivo]",()=>g(w,null)),D(w,"[data-pl-nuevo-vehiculo]",()=>h(w,null)),D(w,"[data-pl-editar-vehiculo]",T=>h(w,T.dataset.plEditarVehiculo??null)),D(w,"[data-pl-editar-objetivo]",T=>g(w,T.dataset.plEditarObjetivo??null));let P=null;w.querySelectorAll("[data-pl-objetivo]").forEach(T=>{T.addEventListener("dragstart",()=>{P=T.dataset.plObjetivo??null,T.style.opacity="0.45"}),T.addEventListener("dragend",()=>{T.style.opacity="",w.querySelectorAll("[data-pl-objetivo]").forEach(R=>R.style.borderTop="")}),T.addEventListener("dragover",R=>{R.preventDefault(),P&&T.dataset.plObjetivo!==P&&(T.style.borderTop="2px solid var(--accent)")}),T.addEventListener("dragleave",()=>{T.style.borderTop=""}),T.addEventListener("drop",R=>{R.preventDefault(),T.style.borderTop="";const N=T.dataset.plObjetivo;P&&N&&I(w,P,N),P=null})}),D(w,"[data-pl-csv]",()=>{const T=i();if(!T||!n)return;const R=new Blob(["\uFEFF"+wr(T,n)],{type:"text/csv;charset=utf-8"}),N=URL.createObjectURL(R),_=document.createElement("a");_.href=N,_.download=`plan-${T.nombre.replace(/[^\w-]+/g,"_")}-${a()}.csv`,_.click(),URL.revokeObjectURL(N),q(`CSV exportado (${n.serieMensual.length} meses)`)}),D(w,"[data-pl-guardar-notas]",()=>{var T;d({notas:((T=w.querySelector("#pl-notas"))==null?void 0:T.value)??""}),q("Notas guardadas")})}return{id:"planner",route:"planner",nombre:"Objetivos financieros",seccion:2,iconoPath:Or,mount:E}}function Do(t,a,e=!1){const o=Math.abs(It(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function qr(t){function a(h){return`${h}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(h={}){var f;const I=(f=h.texto)==null?void 0:f.trim().toLowerCase();return t.get("transacciones").filter(y=>!(h.cuentaId&&y.cuentaId!==h.cuentaId||h.desde&&y.fecha<h.desde||h.hasta&&y.fecha>h.hasta||h.tipo&&y.tipo!==h.tipo||h.estimacionId&&y.estimacionId!==h.estimacionId||h.tags&&h.tags.length>0&&!h.tags.some(M=>y.tags.includes(M))||I&&!y.concepto.toLowerCase().includes(I))).sort((y,M)=>y.fecha.localeCompare(M.fecha)||y._id.localeCompare(M._id))}function o(h){const I={_id:a("tx"),fecha:h.fecha,cuentaId:h.cuentaId,importeCts:Do(h.tipo,h.importe,h.negativo),concepto:h.concepto,tags:h.tags??[],estimacionId:h.estimacionId??null,tipo:h.tipo,origen:h.origen??"manual",...h.nota?{nota:h.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),I]),I}function s(h,I){t.set("transacciones",t.get("transacciones").map(f=>{if(f._id!==h)return f;const{importe:y,...M}=I,S={...f,...M};return y!==void 0&&(S.importeCts=Do(S.tipo,y,S.importeCts<0)),S}))}function n(h){t.set("transacciones",t.get("transacciones").filter(I=>I._id!==h))}function i(h,I){s(h,{estimacionId:I})}function r(h){return t.get("puntosControl").filter(I=>!h||I.cuentaId===h).sort((I,f)=>I.fecha.localeCompare(f.fecha))}function d(h,I,f,y){const M={_id:a("pc"),fecha:I,cuentaId:h,saldoCts:It(f),...y?{nota:y}:{}},S=t.get("puntosControl").filter(C=>!(C.cuentaId===h&&C.fecha===I));return t.set("puntosControl",[...S,M].sort((C,j)=>C.fecha.localeCompare(j.fecha))),x(h),M}function c(h){const I=t.get("puntosControl").find(f=>f._id===h);t.set("puntosControl",t.get("puntosControl").filter(f=>f._id!==h)),I&&x(I.cuentaId)}function x(h){const I=r(h),f=t.get("accounts");f.some(y=>y._id===h)&&t.set("accounts",f.map(y=>y._id===h?{...y,historicoSaldos:I.map(M=>({_id:M._id,fecha:M.fecha,saldo:ot(M.saldoCts),...M.nota?{nota:M.nota}:{}}))}:y))}function p(h,I=J()){const f=r(h).filter(C=>C.fecha<=I).pop(),y=f==null?void 0:f.fecha,M=(f==null?void 0:f.saldoCts)??0;return t.get("transacciones").filter(C=>C.cuentaId===h&&C.fecha<=I&&(y===void 0||C.fecha>y)).reduce((C,j)=>C+j.importeCts,M)}function u(h,I){return ot(p(h,I))}function v(h=J(),I){const f=I??t.get("accounts").filter(y=>y.activo).map(y=>y._id);return ot(f.reduce((y,M)=>y+p(M,h),0))}function b(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function $(){const h=[...t.get("transacciones").map(I=>I.fecha),...t.get("puntosControl").map(I=>I.fecha)];return h.length>0?h.sort().pop()??null:null}function A(h={}){return ot(e(h).reduce((I,f)=>I+f.importeCts,0))}function m(h={}){const I=new Map;for(const f of e(h)){const y=f.fecha.slice(0,7);I.set(y,(I.get(y)??0)+f.importeCts)}return new Map([...I.entries()].sort(([f],[y])=>f.localeCompare(y)).map(([f,y])=>[f,ot(y)]))}function g(h={}){const I=new Map;for(const f of e(h))for(const y of f.tags.length>0?f.tags:["sin_tag"])I.set(y,(I.get(y)??0)+f.importeCts);return new Map([...I.entries()].map(([f,y])=>[f,ot(y)]))}return{transacciones:e,registrar:o,actualizar:s,eliminar:n,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:d,eliminarPuntoControl:c,saldoCuenta:u,saldoCuentaCts:p,saldoTotal:v,tieneDatos:b,ultimaFecha:$,total:A,totalPorMes:m,totalPorTag:g}}function xt(t){return t.trim().toLowerCase()}function Lr(t){function a(){const c=new Map,x=(p,u)=>{const v=xt(p);if(!v)return;const b=c.get(v)??{tag:v,estimaciones:0,reales:0,total:0};b[u]+=1,b.total+=1,c.set(v,b)};for(const p of t.get("expenses"))for(const u of p.tags??[])x(u,"estimaciones");for(const p of t.get("transacciones"))for(const u of p.tags??[])x(u,"reales");return[...c.values()].sort((p,u)=>u.total-p.total||p.tag.localeCompare(u.tag))}function e(){return a().map(c=>c.tag)}function o(c){return a().filter(x=>c==="estimaciones"?x.reales===0:x.estimaciones===0).map(x=>x.tag)}function s(c,x,p){const u=xt(x),v=(c??[]).map(xt);if(!v.includes(u))return c??[];const b=v.filter($=>$!==u);return p===null?[...new Set(b)]:[...new Set([...b,xt(p)])]}function n(c,x){const p=xt(x);if(!p)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return d(c,p)}function i(c,x){let p=0;for(const u of c)xt(u)!==xt(x)&&(p+=d(u,xt(x)).cambiados);return{cambiados:p}}function r(c){return d(c,null)}function d(c,x){let p=0;const u=t.get("expenses").map(M=>{const S=s(M.tags,c,x);return S!==M.tags&&(p+=1),S===M.tags?M:{...M,tags:S}});t.set("expenses",u);const v=t.get("transacciones").map(M=>{const S=s(M.tags,c,x);return S!==M.tags&&(p+=1),S===M.tags?M:{...M,tags:S}});t.set("transacciones",v);const b=t.get("loans").map(M=>{const S=s(M.tags,c,x);return S!==M.tags&&(p+=1),S===M.tags?M:{...M,tags:S}});t.set("loans",b);const $=t.get("nominas").map(M=>{const S=s(M.tags,c,x);return S!==M.tags&&(p+=1),S===M.tags?M:{...M,tags:S}});t.set("nominas",$);const A=t.get("config"),m=xt(c),g=M=>{const S=(M??[]).map(xt);if(!S.includes(m))return M??[];const C=S.filter(j=>j!==m);return x===null?[...new Set(C)]:[...new Set([...C,x])]},h={},I=g(A.activeTagsFilter),f=g(A.tagCategorias),y=g(A.tagGrupos);return I!==A.activeTagsFilter&&(h.activeTagsFilter=I),f!==A.tagCategorias&&(h.tagCategorias=f),y!==A.tagGrupos&&(h.tagGrupos=y),Object.keys(h).length>0&&t.patchConfig(h),{cambiados:p}}return{uso:a,todas:e,soloEn:o,renombrar:n,fusionar:i,eliminar:r}}function kr(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function Br(t,a){const e=G(t),o=[];for(let s=1;s<=a;s++){const n=new Date(e.getFullYear(),e.getMonth()-s,1);o.push(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Hr(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function Gr(t,a){const{inicio:e,fin:o}=Hr(a);return Yt([t],{start:e,end:o}).reduce((n,i)=>n+Math.abs(i.cuantia),0)}function Vr(t){function a(s,n={}){var I;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:d=J()}=n,c=t.transacciones({estimacionId:s._id}),p=c.length===0&&(((I=s.tags)==null?void 0:I.length)??0)>0?t.transacciones({tags:s.tags}):c,u=new Map;for(const f of p){const y=f.fecha.slice(0,7);u.set(y,(u.get(y)??0)+Math.abs(f.importeCts)/100)}const v=[];for(const f of Br(d,i)){const y=u.get(f);if(y===void 0)continue;const M=st(Gr(s,f));v.push({mes:f,estimado:M,real:st(y),desviacion:st(y-M),precision:kr(M,y)})}const b=st(v.reduce((f,y)=>f+y.estimado,0)),$=st(v.reduce((f,y)=>f+y.real,0)),A=v.reduce((f,y)=>f+Math.abs(y.estimado),0),m=v.length===0?null:A>0?v.reduce((f,y)=>f+y.precision*Math.abs(y.estimado),0)/A:v.reduce((f,y)=>f+y.precision,0)/v.length,g=v.slice(-r),h=g.length>0?st(g.reduce((f,y)=>f+y.real,0)/g.length):null;return{estimacionId:s._id,concepto:s.concepto,tags:s.tags??[],meses:v,estimadoTotal:b,realTotal:$,desviacionTotal:st($-b),precision:m,mediaRealReciente:h,infraestimada:$>b}}function e(s,n={}){return s.filter(i=>i.tipo!=="transferencia").map(i=>a(i,n)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(s){const n=new Map;for(const i of s)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const d=n.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};d.estimado+=i.estimadoTotal,d.real+=i.realTotal,d.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),d.peso+=Math.abs(i.estimadoTotal),d.n+=1,n.set(r,d)}return[...n.entries()].map(([i,r])=>({tag:i,estimadoTotal:st(r.estimado),realTotal:st(r.real),desviacionTotal:st(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}const Xe="financeapp_session",Ur=["local","dropbox","firebase"];function Yr(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!Ur.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function Jr({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now()}={}){const o=()=>t??(typeof localStorage<"u"?localStorage:null);function s(u){const v=o();if(v)try{u?v.setItem(Xe,JSON.stringify(u)):v.removeItem(Xe)}catch{}}function n(){const u=o();if(!u)return null;try{return Yr(u.getItem(Xe))}catch{return null}}function i(){const u=n();return u?(e()-u.ultimoUso)/6e4:null}function r(){const u=a();if(!Number.isFinite(u)||u<=0)return!1;const v=i();return v!==null&&v>=u}function d(){const u=n();return u?r()?(s(null),null):u:null}function c(u){const v=e(),b={modo:u.modo,...u.email?{email:u.email}:{},...u.passphrase?{passphrase:u.passphrase}:{},creadaEn:v,ultimoUso:v};return s(b),b}function x(){const u=n();u&&s({...u,ultimoUso:e()})}function p(){s(null)}return{abrir:c,leer:d,tocar:x,cerrar:p,caducada:r,inactividadMinutos:i,get activa(){return d()!==null}}}const Ro=["pointerdown","keydown","visibilitychange"];function Wr({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:s=clearInterval,target:n=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const x of Ro)n==null||n.addEventListener(x,r);const d=o(()=>{i&&t.caducada()&&(c(),t.cerrar(),a())},e);function c(){if(i){i=!1,s(d);for(const x of Ro)n==null||n.removeEventListener(x,r)}}return c}const Qr=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}];function Oo(){if(typeof localStorage<"u"){const u=Us();u.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${u.join(", ")}`)}const t=Js({adapter:Vs()}),{applied:a}=t.load();a.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${a.join(", ")} (esquema v${Kt})`);const e=Qs(t);ms(u=>e.isEnabled(u));const o=Jr({autoLogoutMinutos:()=>{var v,b;const u=(b=(v=globalThis.State)==null?void 0:v.get)==null?void 0:b.call(v,"config");return Number((u==null?void 0:u.autoLogoutMinutos)??t.get("config").autoLogoutMinutos??0)}}),s=qr(t),n=Lr(t),i=Vr(s),r=cn(t),d=an({isEnabled:u=>e.isEnabled(u)}),c=en({flags:e,rutasExtra:()=>d.flagPorRuta()}),x=tn({flags:e,onChange:()=>{var u,v;d.attachToShell(),c.apply(),(v=(u=globalThis.Router)==null?void 0:u.rerender)==null||v.call(u)}}),p=()=>{var v,b,$,A,m,g;const u=globalThis;if((b=(v=u.State)==null?void 0:v.load)==null||b.call(v),((A=($=u.Router)==null?void 0:$.current)==null?void 0:A.call($))==="dashboard")try{(g=(m=u.DashboardModule)==null?void 0:m.render)==null||g.call(m)}catch(h){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",h)}};return d.register(jn({store:t,onDatosCambiados:p})),d.register(qn({store:t,onDatosCambiados:p})),d.register(si({store:t,onDatosCambiados:p})),d.register(Si({store:t,ledger:s,mostrarObjetivos:()=>e.isEnabled("goals"),onDatosCambiados:p})),d.register(mn({ledger:s,tags:n,precision:i,adjuster:r,accounts:()=>t.get("accounts"),estimaciones:()=>t.get("expenses"),onDatosCambiados:p})),d.register(Nr({store:t,onDatosCambiados:p})),d.register(Ri({store:t,onDatosCambiados:p})),d.register($n({store:t,onDatosCambiados:p})),d.register(_i({store:t})),d.register(vn({store:t,onDatosCambiados:p})),{version:Kt,core:ts,engine:{generarExtracto:Jt,recomputarSaldoAcum:os,saldoHoy:ss,sumarPorTags:za,providers:{proyectarGastos:Yt,proyectarPrestamos:xa,proyectarTransferencias:$a,proyectarNominas:Sa,proyectarInteresesCuentas:Aa,proyectarAportaciones:Ia,proyectarRetencionesFiscales:Ma,proyectarInflacionGastos:wa,proyectarPerdidaAhorro:Ca},analysis:ls,margins:us,optimizer:fs,dashboard:js},store:t,flags:e,featureRegistry:{all:Ct,porGrupo:Wa},ui:{openFeatures:x.open,applyGating:c.apply,watchGating:()=>c.observar()},app:d,session:Object.assign(o,{vigilar:u=>Wr({sesion:o,onCaducada:u}),opciones:Qr}),accounting:{ledger:s,tags:n,precision:i,adjuster:r,sugerirAjuste:eo}}}function Kr(){try{const t=Oo();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const ye=typeof window<"u"?Kr():null;if(ye){let t=!1;const a=()=>{ye.app.attachToShell(),ye.ui.applyGating(),t||(t=!0,ye.ui.watchGating())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",e=>{const o=e.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(a,0)})}return $t.bootstrap=Oo,Object.defineProperty($t,Symbol.toStringTag,{value:"Module"}),$t}({});
//# sourceMappingURL=financeapp-core.js.map

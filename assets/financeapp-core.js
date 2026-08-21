var FinanceAppBundle=function(xt){"use strict";var Ar=Object.defineProperty;var Mr=(xt,G,L)=>G in xt?Ar(xt,G,{enumerable:!0,configurable:!0,writable:!0,value:L}):xt[G]=L;var Po=(xt,G,L)=>Mr(xt,typeof G!="symbol"?G+"":G,L);function G(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function L(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function V(){return G(new Date)}function be(t,a){return new Date(t,a+1,0).getDate()}function Qe(t,a,e){return G(new Date(t,a,Math.min(e,be(t,a))))}function ie(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return G(new Date(t,a+1,0));const s=parseInt(o);if(!isNaN(s))return Qe(t,a,s)}if(e.startsWith("nthweekday:")){const o=e.split(":"),s=parseInt(o[1]),n=parseInt(o[2]);if(s===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==n;)r.setDate(r.getDate()-1);return G(r)}const i=new Date(t,a,1);for(;i.getDay()!==n;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(s-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),G(i)}return null}function Ke(t,a){if(!a)return t;const e=L(t);return ie(e.getFullYear(),e.getMonth(),a)??t}const To=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],Do={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function he(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${Do[e]||e+"º"} ${To[o]} del mes`}return t}function re(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function $t(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function at(t){return t/100}function ot(t){return at($t(t))}function E(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function Xe(t){return(t||0).toFixed(2)+"%"}function Pt(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function Ze(t,a,e,o=0){const s=Pt(t,a,e),n=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const l=s*(1-Math.pow(1+i,-e))/i-n,x=s*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),m=i-l/x;if(Math.abs(m-i)<1e-10){i=m;break}i=m}return(Math.pow(1+i,12)-1)*100}function ta(t,a,e,o,s=0,n=[],i={}){const r=[];let u=t;const l=L(o),x=a/100/12;let m=e,d=Pt(u,a,m);const g=[...n].sort(($,M)=>$.fecha.localeCompare(M.fecha));let h=0;for(let $=1;$<=e*2&&u>.01;$++){const M=new Date(l);l.setMonth(l.getMonth()+1);const f=Ke(G(M),i.diaPago||"");for(;h<g.length&&g[h].fecha<=f;){const A=g[h],v=A.cantidad*(s/100);if(u-=A.cantidad,u=Math.max(0,u),A.tipo==="plazo"?m=Math.ceil(-Math.log(1-u*x/d)/Math.log(1+x)):(m=e-$+1,d=Pt(u,a,m)),r.push({mes:"AMORT",fecha:A.fecha,cuota:0,interes:0,amortizacion:A.cantidad,comisionAmort:v,capitalPendiente:u,esAmortizacion:!0,simulacion:A.simulacion||!1}),h++,u<.01)break}if(u<.01)break;const b=u*x,y=Math.min(d-b,u);if(u-=y,u<.01&&(u=0),r.push({mes:$,fecha:f,cuota:d,interes:b,amortizacion:y,comisionAmort:0,capitalPendiente:u,esAmortizacion:!1,simulacion:!1}),m--,m<=0||u<.01)break}return r}const ea=new Map;function tt(t){var M;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((f,b)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${b.fecha}|${b.cantidad}|${b.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=ea.get(e);if(o)return o;const{capital:s,tin:n,meses:i,fechaInicio:r,comisionAmort:u,comisionApertura:l}=t,x=ta(s,n,i,r,u||0,a,t),m=x.reduce((f,b)=>f+b.interes,0),d=x.reduce((f,b)=>f+b.comisionAmort,0),g=s*((l||0)/100),h=x.filter(f=>!f.esAmortizacion),$={cuota:Pt(s,n,i),totalIntereses:m,tae:Ze(s,n,i,l||0),costoTotal:m+d+g,comAp:g,totalComAm:d,fechaFin:((M=h.slice(-1)[0])==null?void 0:M.fecha)||"",mesesReales:h.length,tabla:x};return ea.set(e,$),$}function aa(t){const a=tt(t),e=tt({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,s=e.mesesReales-a.mesesReales,n=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:s,costeTotalAmort:n,ahorroNeto:o-n,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function dt(t,a,e){if(!t||t.length===0)return 1;const o=L(a),s=L(e);if(s<=o)return 1;const n=[...t].sort((u,l)=>u.year-l.year);let i=1,r=new Date(o);for(;r<s;){const u=r.getFullYear(),l=n.filter($=>$.year<=u),x=l.length>0?l[l.length-1]:n[0],m=(x?x.tasa:0)/100,d=new Date(u+1,0,1),g=d<s?d:s,h=re(r,g);i*=Math.pow(1+m,h/365.25),r=g}return i}function oa(t,a,e,o=0){const s=L(a),n=L(e);if(n<=s)return o;const i=re(s,n),r=t?[...t].sort((x,m)=>x.year-m.year):[];let u=0,l=new Date(s);for(;l<n;){const x=l.getFullYear(),m=new Date(x+1,0,1),d=m<n?m:n,g=re(l,d),h=r.filter(f=>f.year<=x),$=h.length>0?h[h.length-1]:null,M=$!==null?$.tasa:o;u+=M*g,l=d}return i>0?u/i:o}function sa(t,a){return((1+t/100)/(1+a/100)-1)*100}function Ro(t,a,e,o){const s=dt(a,e,o);return s>0?t/s:t}function Oo(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,s=a.saludUmbralDTIVerde??30,n=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:u=0,cuotas:l=0,cuotasHipoteca:x=0,gastosBasicos:m=0,gastosOtros:d=0,amortizaciones:g=0}=t,h=u-l-g-m-d,$=h,M=u>0?$/u*100:null,f=r?l-x:l,b=u>0?f/u*100:null,y=u>0?l/u*100:null,A=u>0?(m+l+g)/u*100:null,v=u>0?d/u*100:null,p=(I,w,C)=>I===null?"neutral":I>=w?"verde":I>=C?"amarillo":"rojo",S=(I,w,C)=>I===null?"neutral":I<=w?"verde":I<=C?"amarillo":"rojo";return{ingresos:u,cuotas:l,cuotasHipoteca:x,gastosBasicos:m,gastosOtros:d,amortizaciones:g,ahorroBruto:h,ahorroReal:$,tasaAhorro:M,dti:b,dtiTotal:y,excluyeHipoteca:r,pctNecesidades:A,pctDeseos:v,semAhorro:p(M,e,o),semDTI:S(b,s,n),semNecesidades:S(A,i[0],i[0]+15),semDeseos:S(v,i[1],i[1]+10),semAhorroRegla:p(M,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:s,umbralDTIAmarillo:n,regla:i}}function ut(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function it(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Ht(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];e&&o.push({fecha:e,saldo:t.saldoInicial||0});for(const n of t.historicoSaldos||[])n.fecha>=e&&o.push(n);o.sort((n,i)=>i.fecha.localeCompare(n.fecha));const s=o.find(n=>n.fecha<=a);return s?s.saldo:t.saldoInicial||0}else{const s=[...t.historicoSaldos||[]].sort((n,i)=>i.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=a);return s?s.saldo:0}}function ye(t,a){const e=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return e?a.filter(o=>e.includes(o._id)):a.filter(o=>o.activo&&!o.simulacion)}function na(t,a,e=0){const o=ye(t,a).reduce((s,n)=>s+it(n),0);return t.usarColchon!==!1?Math.max(0,o-e):o}function ia(t,a,e){if(!t.targetAmount||t.targetAmount<=0)return null;const o=ye(t,a);if(o.length===0)return null;const s=e.hoy??new Date,n=e.horizonteMeses??120,i=t.usarColchon!==!1,r=o.map(u=>({acc:u,eventos:e.extractoCuenta(u),cursor:0,saldo:it(u)}));for(let u=1;u<=n;u++){const l=new Date(s.getFullYear(),s.getMonth()+u,1),x=`${l.getFullYear()}-${String(l.getMonth()+1).padStart(2,"0")}`,m=G(new Date(l.getFullYear(),l.getMonth()+1,0));let d=0;for(const h of r){for(;h.cursor<h.eventos.length&&h.eventos[h.cursor].fecha<=m;)h.saldo=h.eventos[h.cursor].saldoAcum??h.saldo,h.cursor++;d+=h.saldo}const g=i?e.colchonEnFecha(m):0;if(d-g>=t.targetAmount)return x}return null}function ra(t,a){const e=t.escenarioIds||[];return e.length===0?!0:!!a&&e.includes(a)}function la(t,a){const e=o=>ra(o,a);return{loans:t.loans.filter(e).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}const xe=t=>t.slice(0,7);function No(t){const[a,e]=t.split("-").map(Number);return`${e===12?a+1:a}-${String(e===12?1:e+1).padStart(2,"0")}`}function $e(t,a,e){if(t.length===0)return[];const o=new Map;for(const l of t)l.saldoAcum!==void 0&&o.set(xe(l.fecha),l.saldoAcum);const s=t[0];let n=(s.saldoAcum??0)-(s.delta??0);const i=xe(a||s.fecha),r=xe(e||t[t.length-1].fecha);if(r<i)return[];const u=[];for(let l=i;l<=r;l=No(l)){const x=o.get(l);x!==void 0&&(n=x);const[m,d]=l.split("-").map(Number);u.push({x:L(G(new Date(m,d-1,15))).getTime(),mes:l,y:n})}return u}function Ie(t,a){let e=null;for(const o of t){if(o.fecha>a)break;o.saldoAcum!==void 0&&(e=o.saldoAcum)}return e}function qo(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function Lo(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}const vt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ct(t,a){const e=[...a].sort((n,i)=>n[0]-i[0]);let o=0,s=t;for(let n=e.length-1;n>=0;n--){const[i,r]=e[n];s<=i||(o+=(s-i)*(r/100),s=i)}return o}function Ae(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,s=Math.min(2e3,e),n=Math.max(0,e-o-s),i=n<=15876?7302:n<=21622?Math.max(0,7302-1.75*(n-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:s,RNT:n,reducArt20:i,baseImponible:Math.max(0,n-i)}}function At(t,a){return Ae(t,a).baseImponible}function ca(t,a){return ct(t,a)/12}const Ct=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Me(t,a){if(!t||t<=0)return 0;const e=a||Ct;let o=0,s=t;for(let n=0;n<e.length;n++){const[i,r]=e[n],u=n<e.length-1?e[n+1][0]:1/0,l=Math.min(s,u-i);if(!(l<=0)&&(o+=l*(r/100),s-=l,s<=0))break}return o}function Tt(t,a){if(ut(t)!=="inversion")return null;const e=it(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,s=Math.max(0,e-o),n=Me(s,a);return{saldo:e,costBase:o,plusvalia:s,impuesto:n,neto:e-n}}function le(t,a=new Date){var d;if(ut(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=it(t),s=G(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),n=[...t.aportaciones||[]].sort((g,h)=>g.fecha.localeCompare(h.fecha));let i=0;const r=n.reduce((g,h)=>g+h.cantidad,0);for(const g of n)g.fecha<=s&&(i+=g.cantidad);const u=Math.max(0,o-r),l=r>0?i/r:0,x=Math.min(o,i+u*l),m=Math.max(0,o-x);return{saldo:o,disponible:x,bloqueado:m,costBase:r,beneficio:u,numAportaciones:n.length,proxDesbloqueo:((d=n.find(g=>g.fecha>s))==null?void 0:d.fecha)||null}}function da(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(ut(t)!=="pension"||!o)return 0;const s=it(t);if(s<=0)return 0;const n=(t.aportaciones||[]).reduce((l,x)=>l+x.cantidad,0),i=Math.max(0,s-n);if(i<=0)return 0;const r=i/s;return+(a*r*o/100).toFixed(2)}function Se(t,a,e){var u;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const n=(a||[]).filter(l=>(l.grupoNomina||"")===o&&l.activo!==!1).reduce((l,x)=>l+(x.bruto||0)*(x.nPagas||12),0),i=[...e||[]].sort((l,x)=>l[0]-x[0]);let r=((u=i[0])==null?void 0:u[1])||19;for(const[l,x]of i)if(n>=l)r=x;else break;return r}const we=6.35;function Ft(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function ua(t){return Math.max(0,(t.bruto||0)-Ft(t))}function ko(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function Bo(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+Ft(r),0),o=Math.max(0,a-e),s=At(a,e),n=new Map;for(const i of t)n.set(i._id,o>0?s*(ua(i)/o):0);return n}function Ce(t,a,e){if(t.irpfModo==="manual")return ua(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return ct(At(t.bruto||0,Ft(t)),e);const o=ko(a.filter(i=>i.irpfModo!=="manual")),s=Bo(a);let n=0;for(const i of o){const r=s.get(i._id)??0;if(i._id===t._id)return ct(n+r,e)-ct(n,e);n+=r}return ct(At(t.bruto||0,Ft(t)),e)}function Ho(t,a){return t.reduce((e,o)=>e+Ce(o,t,a),0)}function Go(t,a){var s;const e=[...a||[]].sort((n,i)=>n[0]-i[0]);let o=((s=e[0])==null?void 0:s[1])??19;for(const[n,i]of e)if(t>=n)o=i;else break;return o}function pa(t,a){if(!t||t.length===0)return 0;const e=t.reduce((s,n)=>s+(n.bruto||0),0),o=t.reduce((s,n)=>s+Ft(n),0);return Go(At(e,o),a)}function Fe(t,a,e){const o=t.bruto||0,s=Ft(t),n=Math.max(0,o-s),i=t.nPagas||12,r=t.ssPct??we,u=n*(r/100),l=Ce(t,a,e);return{brutoAnual:o,flexAnual:s,baseDineraria:n,nPagas:i,ssPct:r,ssAnual:u,irpfAnual:l,irpfPct:n>0?l/n*100:0,netoPorPaga:(n-u-l)/i}}function Vo(t){const a=new Map,e=[];for(const o of t){const s=o.grupoNomina||"";if(!s){e.push(o);continue}const n=a.get(s)??[];n.push(o),a.set(s,n)}return{grupos:a,sueltas:e}}const zt=1500;function ma(t){const a=t.cuantia||0,e=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?a*12/e:t.tipoFrecuencia==="diaria"?a*365.25/e:a}const Gt=t=>{const a=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(a)?a:0};function Uo(t,a){const e=t.grupoNomina||"";return e?a.filter(o=>(o.grupoNomina||"")===e):null}function fa(t,a){return t.reduce((e,o)=>e+Ce(o,Uo(o,t),a),0)}function va(t){const{nominas:a,tramosGeneral:e,tramosAhorro:o}=t,s=t.extras??{},n=a.reduce((I,w)=>I+(w.bruto||0),0),i=a.reduce((I,w)=>I+Ft(w),0),r=Ae(n,i),u=t.aportacionesPension,l=zt,x=Math.min(u,l),m=Math.max(0,r.RNT-r.reducArt20-x),d=Gt(s.capInmobiliario),g=Gt(s.capMobiliario),h=Gt(s.gananciasFondos),$=Gt(s.otrasCorto),M=Gt(s.retCapital),f=Math.max(0,m+t.otrosIngresos+d+$),b=Math.max(0,g+h),y=ct(f,e),A=ct(b,o),v=y+A,p=fa(a,e),S=p+M;return{brutoTotal:n,flexTotal:i,brutoIRPF:r.baseIRPF,cotizSS:r.cotizSS,gastosArt19:r.gastosArt19,RNT:r.RNT,reducArt20:r.reducArt20,aportPP:u,limPP:l,deducPP:x,RNTred:m,otrosIngresos:t.otrosIngresos,capInmobiliario:d,capMobiliario:g,gananciasFondos:h,otrasCorto:$,baseGeneral:f,baseAhorro:b,cuotaGen:y,cuotaAho:A,cuotaIntegra:v,retNomina:p,retCapital:M,totalRet:S,resultado:v-S}}const Yo=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:zt,TRAMOS_AHORRO_DEFAULT:Ct,TRAMOS_IRPF_DEFAULT:vt,ajustarFechaPago:Ke,ajustarPrecioReal:Ro,calcBaseImponibleTrabajo:At,calcFactorInflacion:dt,calcFondoInversion:Tt,calcFondosPension:le,calcGananciasCapital:Me,calcIRPF:ct,calcImpuestoPension:da,calcInflacionMediaAnual:oa,calcSaludFinanciera:Oo,calcTAE:Ze,calcTipoMarginalPension:Se,calcTipoRealFisher:sa,calcularDeclaracion:va,clampedDate:Qe,cuentasDelObjetivo:ye,cuotaMensual:Pt,desgloseBaseTrabajo:Ae,diasEntre:re,filtrarPorEscenario:la,formatEUR:E,formatLocalDate:G,formatPct:Xe,fromCents:at,haySimulaciones:Lo,ingresoAnual:ma,labelDiaPago:he,lastDayOfMonth:be,modeloFondoDe:ut,parseLocalDate:L,proyectarFechaCumplimiento:ia,resolverDiaEfectivo:ie,resumenPrestamo:tt,resumenPrestamoConAhorro:aa,retencionMensual:ca,retencionesNomina:fa,roundMoney:ot,saldoEnFecha:Ht,saldoEnFechaExtracto:Ie,saldoParaObjetivo:na,saldoRealCuenta:it,serieMensual:$e,sinSimulaciones:qo,tablaAmortizacion:ta,toCents:$t,todayISO:V,visibleEnEscenario:ra},Symbol.toStringTag,{value:"Module"}));function Vt(t,a,e=null){const o=[],s=L(a.start),n=L(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=L(i.fechaInicio||a.start),u=i.fechaFin?L(i.fechaFin):n,l=i.cuantia,x=m=>o.push({fecha:m,concepto:i.concepto,cuantia:l,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=s&&r<=n&&r<=u&&x(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const m=Math.max(1,i.frecuencia||1);let d=r.getFullYear(),g=r.getMonth();const h=Math.ceil(240/m)+2;for(let $=0;$<h;$++){const M=ie(d,g,i.diaPago||"")||(()=>{const b=r.getDate(),y=new Date(d,g+1,0).getDate();return G(new Date(d,g,Math.min(b,y)))})(),f=L(M);if(f>n||f>u)break;f>=s&&f>=r&&x(M),g+=m,g>=12&&(d+=Math.floor(g/12),g=g%12)}}else if(i.tipoFrecuencia==="diaria"){const m=Math.max(1,i.frecuencia||1)*864e5;let d=new Date(Math.max(r.getTime(),s.getTime()));if(r<s){const g=Math.ceil((s.getTime()-r.getTime())/m);d=new Date(r.getTime()+g*m)}for(;d<=n&&d<=u;)x(G(d)),d=new Date(d.getTime()+m)}}return o}function ga(t,a,e=null){const o=[];for(const s of t){if(!s.activo||e&&e.length>0&&!e.includes(s.cuenta||"default"))continue;const{tabla:n}=tt(s);for(const i of n)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${s.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${s.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan",simulacion:s.simulacion||!1}))}return o}function ba(t,a,e=null,o={accounts:[]}){const s=[],n=L(a.start),i=L(a.end),r=o.accounts||[],u=o.nominas||[],l=o.resolverTramosIRPF||(()=>vt),x=o.resolverTramosGanancias||(()=>Ct),m=d=>{var g;return((g=r.find(h=>h._id===d))==null?void 0:g.nombre)??d};for(const d of t){if(!d.activo||d.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(d.cuenta||"default")||e.includes(d.cuentaDestino||"default")))continue;const g=L(d.fechaInicio||a.start),h=d.fechaFin?L(d.fechaFin):i,$=M=>{const f=r.find(F=>F._id===(d.cuenta||"default")),b=r.find(F=>F._id===(d.cuentaDestino||"default")),y=ut(f),A=ut(b),v=y==="inversion"&&A==="inversion"||y==="pension"&&A==="pension",p=["transferencia",...v?["traspaso"]:[],...d.tags||[]],S=v?"traspaso-out":"transfer-out",I=v?"traspaso-in":"transfer-in",w=!e||e.length===0||e.includes(d.cuenta||"default"),C=!e||e.length===0||e.includes(d.cuentaDestino||"default");if(w&&s.push({fecha:M,concepto:`Transf. → ${m(d.cuentaDestino||"default")}: ${d.concepto}`,cuantia:d.cuantia,tipo:"gasto",tags:p,cuenta:d.cuenta||"default",sourceId:d._id,sourceType:S}),C&&s.push({fecha:M,concepto:`Transf. ← ${m(d.cuenta||"default")}: ${d.concepto}`,cuantia:d.cuantia,tipo:"ingreso",tags:p,cuenta:d.cuentaDestino||"default",sourceId:d._id,sourceType:I}),w&&!v&&f){if(y==="inversion"){const F=parseInt(M.slice(0,4)),z=Tt(f,x(F));if(z&&z.saldo>0&&z.plusvalia>0){const j=Math.min(1,d.cuantia/z.saldo),D=z.plusvalia*j*.19;D>.01&&s.push({fecha:M,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:D,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:d.cuenta||"default",sourceId:d._id,sourceType:"investment-tax"})}}else if(y==="pension"){const F=l(parseInt(M.slice(0,4))),z=Se(f,u,F),j=da(f,d.cuantia,z||void 0);if(j>0){const _=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${z}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;s.push({fecha:M,concepto:_,cuantia:j,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:d.cuenta||"default",sourceId:d._id,sourceType:"pension-tax"})}}}};if(d.tipoFrecuencia==="extraordinario")g>=n&&g<=i&&g<=h&&$(d.fechaInicio);else if(d.tipoFrecuencia==="mensual"){const M=Math.max(1,d.frecuencia||1);let f=g.getFullYear(),b=g.getMonth();const y=Math.ceil(240/M)+2;for(let A=0;A<y;A++){const v=ie(f,b,d.diaPago||"")||(()=>{const S=g.getDate(),I=new Date(f,b+1,0).getDate();return G(new Date(f,b,Math.min(S,I)))})(),p=L(v);if(p>i||p>h)break;p>=n&&p>=g&&$(v),b+=M,b>=12&&(f+=Math.floor(b/12),b=b%12)}}else if(d.tipoFrecuencia==="diaria"){const M=Math.max(1,d.frecuencia||1)*864e5;let f=new Date(Math.max(g.getTime(),n.getTime()));if(g<n){const b=Math.ceil((n.getTime()-g.getTime())/M);f=new Date(g.getTime()+b*M)}for(;f<=i&&f<=h;)$(G(f)),f=new Date(f.getTime()+M)}}return s}function ha(t,a,e=null){const o=[],s=L(a.start),n=L(a.end);for(const i of t){const r=ut(i);if(r==="cuenta"||!i.activo)continue;const u=i.planAportaciones||[];for(const l of u){if(!l.importe||l.importe<=0)continue;const x=L(l.fechaInicio||a.start),m=l.fechaFin?L(l.fechaFin):n,d=l.cuentaOrigen||"default",g=!e||!e.length||e.includes(d),h=!e||!e.length||e.includes(i._id),$=r==="pension"?"pension":"capital-mobiliario",M=v=>{g&&o.push({fecha:v,concepto:`Aportación → ${i.nombre}`,cuantia:l.importe,tipo:"gasto",tags:["aportacion","transferencia",$],cuenta:d,sourceId:l._id,sourceType:"aportacion-out"}),h&&o.push({fecha:v,concepto:`Aportación ${i.nombre} (${l.periodicidad||"mensual"})`,cuantia:l.importe,tipo:"ingreso",tags:["aportacion","transferencia",$],cuenta:i._id,sourceId:l._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[l.periodicidad||"mensual"]||1;let b=x.getFullYear(),y=x.getMonth();const A=Math.ceil(240/f)+2;for(let v=0;v<A;v++){const p=new Date(b,y+1,0).getDate(),S=G(new Date(b,y,Math.min(x.getDate(),p))),I=L(S);if(I>n||I>m)break;I>=s&&I>=x&&M(S),y+=f,y>=12&&(b+=Math.floor(y/12),y=y%12)}}}return o}function ya(t,a,e=null,o=[]){const s=[];for(const n of t){if(!n.activo||!n.interes||n.interes<=0||e&&e.length>0&&!e.includes(n._id))continue;const i=L(a.start),r=L(a.end),u=n.periodoCobro||"mensual",l=u==="mensual",x=l?null:{diario:864e5,semanal:7*864e5}[u]||864e5,m=l?1/12:x/(365.25*864e5);let d=Ht(n,a.start);const g=o.filter(M=>M.cuenta===n._id).map(M=>({fecha:M.fecha,delta:M.tipo==="ingreso"?Math.abs(M.cuantia):-Math.abs(M.cuantia)})).sort((M,f)=>M.fecha.localeCompare(f.fecha));let h=0,$=new Date(i);for(;$<=r;){const M=l?new Date($.getFullYear(),$.getMonth()+1,$.getDate()):new Date($.getTime()+x),f=new Date(Math.min(M.getTime(),r.getTime()+1)),b=G(f);let y=0;for(;h<g.length&&g[h].fecha<b;)y+=g[h].delta,h++;const A=d,v=d+y,p=Math.max(0,(A+v)/2);d=v;const S=l?m:(f.getTime()-$.getTime())/(365.25*864e5),I=p*(Math.pow(1+n.interes/100,S)-1);I>.001&&s.push({fecha:G($),concepto:`Interés ${n.nombre}`,cuantia:I,tipo:"ingreso",tags:["interes","cuenta"],cuenta:n._id,sourceId:n._id,sourceType:"account-interest"}),$=M}}return s}function xa(t,a,e,o=null){const s=[],n=a||vt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),u=ca(r,n),l={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:u,tags:["irpf","fiscal"]};s.push(...Vt([l],e,o))}return s}const Jo=[5,11,2,8],Wo={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function $a(t,a,e=null,o=[],s=()=>vt){const n=[],i=L(a.start),r=L(a.end),u=o.length>0,l={};for(const d of t){const g=d.grupoNomina||"";l[g]||(l[g]=[]),l[g].push(d)}for(const d of Object.keys(l))l[d].sort((g,h)=>(h.bruto||0)-(g.bruto||0));function x(d,g){if(!u||!d.mesActualizacionIPC)return d.bruto||0;const h=d.fechaInicio||a.start,$=L(h),M=L(g);let f=0;for(let y=$.getFullYear();y<=M.getFullYear();y++){const A=new Date(y,d.mesActualizacionIPC-1,1);A>$&&A<=M&&f++}if(f===0)return d.bruto||0;const b=G(new Date($.getFullYear()+f,0,1));return(d.bruto||0)*dt(o,h,b)}function m(d,g){const h=x(d,g),$=(d.retribucionFlexible||[]).reduce((F,z)=>F+(z.importe||0)*12,0),M=Math.max(0,h-$);if(d.irpfModo==="manual")return M*((d.irpfPct||0)/100);const f=s(parseInt(g.slice(0,4))),b=d.grupoNomina||"";if(!b)return ct(At(h,$),f);const y=l[b].filter(F=>F.activo),A=y.reduce((F,z)=>F+x(z,g),0),v=y.reduce((F,z)=>F+(z.retribucionFlexible||[]).reduce((j,_)=>j+(_.importe||0)*12,0),0),p=Math.max(0,A-v),S=At(A,v),I=Math.max(0,h-$),w=p>0?S*(I/p):0,C=y.filter(F=>F._id!==d._id&&(F.bruto||0)>(d.bruto||0)).reduce((F,z)=>{const j=(z.retribucionFlexible||[]).reduce((D,N)=>D+(N.importe||0)*12,0),_=Math.max(0,x(z,g)-j);return F+(p>0?S*(_/p):0)},0);return ct(C+w,f)-ct(C,f)}for(const d of t){if(!d.activo)continue;const g=d.cuenta||"default";if(e&&e.length>0&&!e.includes(g))continue;const h=Math.max(1,d.nPagas||12),$=L(d.fechaInicio||a.start),M=d.fechaFin?L(d.fechaFin):r,f=b=>{const y=x(d,b),A=m(d,b),v=(d.retribucionFlexible||[]).reduce((j,_)=>j+(_.importe||0)*12,0),p=Math.max(0,y-v),S=(d.ssPct??6.35)/100,I=p*S,w=p/h,C=A/h,F=I/h,z=d.representacion==="simplificado"?w-F-C:w;n.push({fecha:b,concepto:d.nombre,cuantia:z,tipo:"ingreso",cuenta:g,tags:d.tags||[],sourceId:d._id,sourceType:"nomina"}),d.representacion==="detallado"&&(F>0&&n.push({fecha:b,concepto:`SS ${d.nombre}`,cuantia:F,tipo:"gasto",cuenta:g,tags:["seguridad-social","fiscal"],sourceId:d._id+"_ss",sourceType:"nomina"}),C>0&&n.push({fecha:b,concepto:`IRPF ${d.nombre}`,cuantia:C,tipo:"gasto",cuenta:g,tags:["irpf","fiscal"],sourceId:d._id+"_irpf",sourceType:"nomina"}));for(const j of d.retribucionFlexible||[])!j.cuenta||!(j.importe>0)||e&&e.length>0&&!e.includes(j.cuenta)||n.push({fecha:b,concepto:`${d.nombre} — ${Wo[j.tipo]||j.tipo}`,cuantia:j.importe,tipo:"ingreso",cuenta:j.cuenta,tags:["retribucion-flexible",j.tipo],sourceId:`${d._id}_flex_${j._id||j.tipo}`,sourceType:"nomina"})};if(h<=12){const b=h===12?1:Math.round(12/h),y=$.getDate();let A=$.getFullYear(),v=$.getMonth();for(let p=0;p<300;p++){const S=new Date(A,v+1,0).getDate(),I=new Date(A,v,Math.min(y,S));if(I>r||I>M)break;I>=i&&I>=$&&f(G(I)),v+=b,v>=12&&(A+=Math.floor(v/12),v=v%12)}}else{const b=h-12,y=$.getDate();let A=$.getFullYear(),v=$.getMonth();for(let I=0;I<300;I++){const w=new Date(A,v+1,0).getDate(),C=new Date(A,v,Math.min(y,w));if(C>r||C>M)break;C>=i&&C>=$&&f(G(C)),v++,v>=12&&(A++,v=0)}const p=Math.max($.getFullYear(),i.getFullYear()),S=Math.min((d.fechaFin?M:r).getFullYear(),r.getFullYear());for(let I=p;I<=S;I++)for(const w of Jo.slice(0,b)){const C=new Date(I,w,15);C>=i&&C<=r&&C>=$&&C<=M&&f(G(C))}}}return n}function Ia(t,a,e,o=null,s="default"){const n=[];if(!a||a.length===0)return n;const i=L(e.start),r=L(e.end),u=V(),l=t.filter(m=>m.activo&&m.tipo==="gasto"&&m.tipoFrecuencia==="mensual");let x=new Date(i.getFullYear(),i.getMonth(),1);for(;x<=r;){const m=x.getFullYear(),d=x.getMonth(),g=m+"-"+String(d+1).padStart(2,"0"),h=g+"-01",$=G(new Date(m,d+1,0)),M=G(new Date(m,d,15));let f=0;for(const b of l){if(o&&o.length>0&&!o.includes(b.cuenta||"default")||b.fechaInicio&&b.fechaInicio>$||b.fechaFin&&b.fechaFin<h)continue;const y=b.fechaInicio||u,A=dt(a,y,M);if(A<=1)continue;const v=Math.max(1,b.frecuencia||1);f+=b.cuantia*(A-1)/v}f>.01&&n.push({fecha:M,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:s,sourceId:"inflacion_vida_"+g,sourceType:"inflacion"}),x=new Date(m,d+1,1)}return n}function Aa(t,a,e,o="default"){const s=[];if(!a||a.length===0||t<=0)return s;const n=L(e.start),i=L(e.end),r=[...a].sort((l,x)=>l.year-x.year);let u=new Date(n.getFullYear(),n.getMonth(),1);for(;u<=i;){const l=u.getFullYear(),x=u.getMonth(),m=l+"-"+String(x+1).padStart(2,"0"),d=G(new Date(l,x,15)),g=r.filter(b=>b.year<=l),h=g.length>0?g[g.length-1]:r[0],$=h?h.tasa/100:0,M=Math.pow(1+$,1/12)-1,f=t*M;f>.01&&s.push({fecha:d,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+m,sourceType:"inflacion"}),u=new Date(l,x+1,1)}return s}function Ma(t,a,e){const o=e.fechaReferencia||e.dashboardStart,s=o<e.dashboardStart?e.dashboardStart:o>e.dashboardEnd?e.dashboardEnd:o,n=a.reduce((m,d)=>m+Ht(d,s),0),i=t.filter(m=>m.fecha<s),r=t.filter(m=>m.fecha>=s),u=[];let l=n;for(const m of[...i].reverse()){const d=m.tipo==="ingreso"?Math.abs(m.cuantia):-Math.abs(m.cuantia);u.unshift({...m,delta:d,saldoAcum:l}),l-=d}const x=[];l=n;for(const m of r){const d=m.tipo==="ingreso"?Math.abs(m.cuantia):-Math.abs(m.cuantia);l+=d,x.push({...m,delta:d,saldoAcum:l})}return[...u,...x]}function Qo(t,a,e,o=null){const s=a.filter(n=>n.activo&&(!o||o.length===0||o.includes(n._id)));return Ma([...t].sort((n,i)=>n.fecha.localeCompare(i.fecha)),s,e)}function Ut(t){const{loans:a,expenses:e,accounts:o,config:s}=t,n=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],u={start:s.dashboardStart,end:s.dashboardEnd},l=e.filter($=>$.tipo!=="transferencia"),x=e.filter($=>$.tipo==="transferencia"),m={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let d=[];d=d.concat(Vt(l,u,n)),d=d.concat(ga(a,u,n)),d=d.concat(ba(x,u,n,m)),d=d.concat(ha(o,u,n));const g=ya(o,u,n,d);if(d=d.concat(g),d=d.concat(xa(e,s.tramos_irpf,u,n)),d=d.concat($a(i,u,n,r,t.resolverTramosIRPF)),s.usarInflacion&&r.length>0){const $=(o.find(b=>b.activo&&b.esCuentaPrincipal)||o.find(b=>b.activo)||{_id:"default"})._id;d=d.concat(Ia(l,r,u,n,$));const f=o.filter(b=>b.activo&&(!n||n.length===0||n.includes(b._id))).reduce((b,y)=>b+Ht(y,s.dashboardStart),0);d=d.concat(Aa(f,r,u,$))}d.sort(($,M)=>$.fecha.localeCompare(M.fecha));const h=o.filter($=>$.activo&&(!n||n.length===0||n.includes($._id)));return Ma(d,h,s)}function Ko(t,a,e=null){const o=V(),n=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,u)=>r+it(u),0),i=t.filter(r=>r.fecha<=o);return i.length===0?n:i[i.length-1].saldoAcum}function Sa(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const s of o.tags||["sin_tag"])e.set(s,(e.get(s)||0)+Math.abs(o.cuantia));return e}function Xo(t,a){const e=[];let o=!1;for(let s=0;s<t.length;s++){const n=t[s],i=n.saldoAcum;i<0&&(s===0||t[s-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:n.fecha,saldo:i,mensaje:`Saldo negativo (${E(i)}) a partir del ${n.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:n.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${E(i)} < ${E(a)}) desde ${n.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:n.fecha,saldo:i,mensaje:`Recuperación del colchón el ${n.fecha} (${E(i)})`})))}return e}function Zo(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=L(a.dashboardStart),s=L(a.dashboardEnd),n=Math.max(1,(s.getTime()-o.getTime())/(30.44*864e5));return e/n}function ts(t,a,e=V()){const o=new Set,s=a.map(r=>{const u=r.fechaInicialSaldo||"",l={};u&&u<=e&&(l[u]=r.saldoInicial||0);for(const x of r.historicoSaldos||[])x.fecha<=e&&(!u||x.fecha>=u)&&(l[x.fecha]=x.saldo);return Object.keys(l).forEach(x=>o.add(x)),l}),n={};for(const r of[...o].sort()){let u=0;for(let l=0;l<a.length;l++){const x=Object.entries(s[l]).filter(([m])=>m<=r);x.length>0?(x.sort(([m],[d])=>d.localeCompare(m)),u+=x[0][1]):u+=a[l].saldoInicial||0}n[r]=u}const i=[];for(const[r,u]of Object.entries(n).sort(([l],[x])=>l.localeCompare(x))){const l=t.filter(g=>g.fecha<=r),x=l.length>0?l[l.length-1].saldoAcum:null;if(x===null)continue;const m=u-x,d=x!==0?m/Math.abs(x)*100:0;i.push({cuenta:"Total",fecha:r,estimado:x,real:u,desv:m,pct:d})}return i}const es=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:ts,detectarPuntosCriticos:Xo,mediaMensualGastos:Zo},Symbol.toStringTag,{value:"Module"}));function Yt(t,a=new Date){const e=G(a),o=new Date(a);o.setMonth(o.getMonth()+1);const s=G(o),n=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Vt(n,{start:e,end:s}).reduce((r,u)=>r+Math.abs(u.cuantia),0)}function ze(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+Pt(e.capital,e.tin,e.meses),0)}function wa(t,a,e,o){return a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0?a.colchonFijo:(Yt(t,o)+ze(e))*(a.colchonMeses||6)}function Ca(t,a,e,o,s){const i=[...a.colchonPuntos||[]].sort((u,l)=>u.fecha.localeCompare(l.fecha)).filter(u=>u.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(Yt(t,s)+ze(e))*(i.meses||6):wa(t,a,e,s)}function ce(t,a,e,o,s,n=!1,i){const r=[...t.puntos||[]].sort((x,m)=>x.fecha.localeCompare(m.fecha)),u=r.filter(x=>x.fecha<=s).pop()||(n?r[0]:null);return u?u.tipo==="fijo"?u.importe||0:(Yt(a,i)+ze(o))*(u.meses||1):0}function as(t,a){const e={};for(const o of a)e[o._id]=it(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=o.cuantia),{fecha:o.fecha,saldos:{...e}}))}function os(t,a,e,o,s,n,i){const r=[];for(const u of(t||[]).filter(l=>l.activo!==!1)){let l=!1;for(let x=0;x<a.length;x++){const m=a[x],d=ce(u,o,s,n,m.fecha,!1,i);if(d<=0){l=!1;continue}const g=!u.cuentas||u.cuentas.length===0?m.saldoAcum:u.cuentas.reduce((h,$)=>{var M,f;return h+(((f=(M=e[x])==null?void 0:M.saldos)==null?void 0:f[$])||0)},0);g<d&&!l?(l=!0,r.push({tipo:"bajo_margen",fecha:m.fecha,saldo:g,target:d,nombre:u.nombre,mensaje:`⚠ ${u.nombre}: ${E(g)} < ${E(d)} desde ${m.fecha}`})):g>=d&&l&&(l=!1,r.push({tipo:"recuperacion_margen",fecha:m.fecha,saldo:g,target:d,nombre:u.nombre,mensaje:`✓ ${u.nombre}: recuperado el ${m.fecha}`}))}}return r}const ss=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:wa,calcColchonEnFecha:Ca,calcGastoBasicoMensual:Yt,calcMargenEnFecha:ce,detectarCrucesMargenes:os,saldosPorCuentaEnExtracto:as},Symbol.toStringTag,{value:"Module"}));class ns extends Error{constructor(e,o){super(`La funcionalidad "${e}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);Po(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=e}}let Jt=null;function is(t){const a=Jt;return Jt=t,()=>{Jt=a}}function Fa(t){return Jt?Jt(t):!0}function za(t,a){if(!Fa(t))throw new ns(t,a)}const Ea=[];function Ee(){const t=new Map,a=new WeakMap;let e=1,o=0,s=0;const n=u=>{if(!u||typeof u!="object")return 0;const l=a.get(u);if(l)return l;const x=e++;return a.set(u,x),x},i=u=>u.map(l=>[l._id,l.capital,l.tin,l.meses,l.fechaInicio,l.comisionAmort||0,l.comisionApertura||0,l.diaPago||"",l.activo?1:0,l.cuenta||"",(l.amortizaciones||[]).map(x=>`${x.fecha}:${x.cantidad}:${x.tipo||""}`).sort().join(",")].join("|")).join(";");function r(u){const l=[i(u.loans),n(u.expenses),n(u.accounts),n(u.nominas),n(u.inflacionPeriodos),u.config.dashboardStart,u.config.dashboardEnd,u.config.fechaReferencia||"",u.config.usarInflacion?1:0,(u.filtroAccounts||[]).join(",")].join("#"),x=t.get(l);if(x)return s++,x;o++;const m=Ut(u);return t.set(l,m),m}return{statement:r,stats:()=>({hits:s,misses:o}),clear:()=>t.clear()}}function je(t,a,e,o,s={},n=Ee()){za("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:r=36,minAmortizable:u=500,tipoAmort:l="plazo",fechaPrimeraAmort:x=null,loanIds:m=null,nominas:d=Ea,sourceAccountId:g=null,selectedMarginIds:h=null,hoy:$=new Date}=s,M=G($),f=Math.min(120,Math.max(1,r)),b=e.filter(O=>O.activo),y=b.map(O=>O._id),A=b.find(O=>O.esCuentaPrincipal)||b[0],v=g&&y.includes(g)?b.find(O=>O._id===g):A,p=v==null?void 0:v._id,S=t.filter(O=>O.activo&&!O.simulacion&&(!m||m.includes(O._id))).sort((O,H)=>H.tin-O.tin),I=!!h&&h.length>0,w=(o.margenesSeguridad||[]).filter(O=>O.activo!==!1).filter(O=>!O.cuentas||O.cuentas.length===0||O.cuentas.includes(p)).filter(O=>!I||h.includes(O._id));if(S.length===0)return{plan:[],margenesAplicados:w.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const C={};for(const O of S)C[O._id]=[];const F=[];function z(O){const H=new Date($.getFullYear(),$.getMonth()+O,1),J=H.getFullYear(),Q=H.getMonth(),X=`${J}-${String(Q+1).padStart(2,"0")}`,mt=G(new Date(J,Q,Math.min(15,new Date(J,Q+1,0).getDate())));return{label:X,dia15:mt}}function j(O,H){const J=[...O.amortizaciones||[],...C[O._id]],{tabla:Q}=tt({...O,amortizaciones:J}),X=Q.filter(st=>st.fecha<=H);if(X.length>0)return X[X.length-1].capitalPendiente;const mt=J.filter(st=>st.fecha<=H).reduce((st,ft)=>st+ft.cantidad,0);return Math.max(0,O.capital-mt)}function _(O){const H=t.map(nt=>({...nt,amortizaciones:[...nt.amortizaciones||[],...C[nt._id]||[]]})),J={...o,dashboardStart:M,dashboardEnd:O},Q=n.statement({loans:H,expenses:a,accounts:e,config:J,filtroAccounts:null,nominas:d}),X=b.reduce((nt,Bt)=>nt+it(Bt),0),mt=v?it(v):0,st=X>0?mt/X:1;let ft=mt,se=X;for(const nt of Q){const Bt=nt.delta??(nt.tipo==="ingreso"?Math.abs(nt.cuantia):-Math.abs(nt.cuantia));nt.cuenta===p?ft+=Bt:y.includes(nt.cuenta)||(ft+=Bt*st),se=nt.saldoAcum}return{source:ft,total:se}}function D(O){const{source:H}=_(O);if(H<=0)return H;let J=0;for(const Q of w){const X=ce(Q,a,o,t,O,!0,$);X>J&&(J=X)}return H-J}const N=2;let B=0;if(x){for(let O=0;O<f;O++)if(z(O).dia15>=x){B=O;break}}for(let O=0;O<f;O++){if((O-B)%i!==0||O<B)continue;const{label:H,dia15:J}=z(O);if(J<M)continue;const Q=D(J)-N;if(Q<u)continue;let X=Q,mt=0;for(const st of S){if(X<u)break;const ft=j(st,J);if(ft<1)continue;const se=st.comisionAmort||0,nt=1+se/100,Bt=Math.floor(X/nt),jo=Math.min(Bt,ft);if(jo<u)continue;const ne=Math.min(Math.floor(jo),Math.floor(ft)),_o=+(ne*se/100).toFixed(2),We=ne+_o;We>X||(C[st._id].push({_id:`opt_${H}_${st._id}`,fecha:J,cantidad:ne,tipo:l,simulacion:!0}),mt+=We,F.push({mes:H,fechaAmort:J,loanId:st._id,loanNombre:st.nombre,tin:st.tin,capitalAntes:ft,cantidadAmort:ne,comision:_o,capitalDespues:Math.max(0,ft-ne),saldoDisponible:Q+N,excedente:Q,saldoDespues:Q+N-mt,tipoAmort:l}),X-=We)}}const T=F.reduce((O,H)=>O+H.cantidadAmort,0),q=F.reduce((O,H)=>O+H.comision,0),k=S.map(O=>{const H=C[O._id];if(!H.length)return null;const J=tt(O),Q=tt({...O,amortizaciones:[...O.amortizaciones||[],...H]});return{loanId:O._id,nombre:O.nombre,tin:O.tin,fechaFinSin:J.fechaFin,fechaFinCon:Q.fechaFin,mesesAhorrados:J.mesesReales-Q.mesesReales,interesesSin:J.totalIntereses,interesesCon:Q.totalIntereses,ahorroIntereses:J.totalIntereses-Q.totalIntereses,numAmortizaciones:H.length,totalAmortizado:H.reduce((X,mt)=>X+mt.cantidad,0)}}).filter(O=>O!==null),Y=k.reduce((O,H)=>O+H.ahorroIntereses,0);return{plan:F,margenesAplicados:w.length,totalAmortizado:T,totalComisiones:q,totalAhorroIntereses:Y,resumenPorLoan:k}}function ja(t,a,e,o,s={},n){za("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:r=500,tipoAmort:u="plazo",fechaObjetivo:l=null,frecuencias:x=[1,2,3,6,12],fechaPrimeraAmort:m=null,loanIds:d=null,nominas:g=Ea,sourceAccountId:h=null,selectedMarginIds:$=null,hoy:M=new Date}=s,f=n??Ee(),b=G(M),y=l||G(new Date(M.getFullYear(),M.getMonth()+i,1));function A(S){const I=t.map(z=>({...z,amortizaciones:[...z.amortizaciones||[],...S[z._id]||[]]})),w={...o,dashboardStart:b,dashboardEnd:y},C=f.statement({loans:I,expenses:a,accounts:e,config:w,filtroAccounts:null,nominas:g});if(C.length===0)return e.filter(z=>z.activo).reduce((z,j)=>z+it(j),0);const F=C.filter(z=>z.fecha<=y);return F.length>0?F[F.length-1].saldoAcum:C[0].saldoAcum}const v=A({}),p=x.map(S=>{const I=je(t,a,e,o,{frecuencia:S,mesesHorizonte:i,minAmortizable:r,tipoAmort:u,fechaPrimeraAmort:m,loanIds:d,nominas:g,sourceAccountId:h,selectedMarginIds:$,hoy:M},f),w={};for(const F of t)w[F._id]=[];for(const F of I.plan)w[F.loanId].push({_id:F.mes+"_"+F.loanId,fecha:F.fechaAmort,cantidad:F.cantidadAmort,tipo:u,simulacion:!0});const C=A(w);return{frecuencia:S,label:S===1?"Mensual":`Cada ${S} meses`,numAmortizaciones:I.plan.length,totalAmortizado:I.totalAmortizado,totalComisiones:I.totalComisiones,ahorroIntereses:I.totalAhorroIntereses,saldoObjetivo:C,gananciaSaldo:C-v,valorTotal:I.totalAhorroIntereses+(C-v),plan:I.plan,resumenPorLoan:I.resumenPorLoan}}).filter(S=>S.numAmortizaciones>0);if(p.length>0){const S=Math.max(...p.map(C=>C.ahorroIntereses)),I=Math.max(...p.map(C=>C.saldoObjetivo)),w=Math.max(...p.map(C=>C.valorTotal));p.forEach(C=>{C.esMejorIntereses=C.ahorroIntereses===S,C.esMejorSaldo=C.saldoObjetivo===I,C.esMejorValor=C.valorTotal===w})}return{resultados:p,saldoBase:v,fechaObjetivo:y}}const rs=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:ja,createStatementMemo:Ee,defaultHoyISO:V,optimizarAmortizaciones:je},Symbol.toStringTag,{value:"Module"})),ls=30.44*864e5;function _a(t){const a=t.getFullYear(),e=t.getMonth();return{desde:G(new Date(a,e,1)),hasta:G(new Date(a,e,be(a,e)))}}function Pa(t){const[a,e]=t.split("-").map(Number);return _a(new Date(a,e-1,1))}function cs(t,a){return Math.max(1,(L(a).getTime()-L(t).getTime())/ls)}const ds=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),Mt=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function us(t,a){const e=new Map(a.map(n=>[n._id,n.clasificacion]));let o=0,s=0;for(const n of t){if(n.tipo!=="gasto"||n.sourceType!=="expense")continue;const i=e.get(n.sourceId??"");i!==null&&(i==="deseo"?s+=Math.abs(n.cuantia):o+=Math.abs(n.cuantia))}return{basicos:o,deseo:s}}function ps(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=d=>d.sourceType==="loan"&&d.tipo==="gasto",s=a.loanIdsIniciados,n=Mt(t.filter(d=>d.tipo==="ingreso")),i=Mt(t.filter(d=>o(d)&&(!s||s.has(d.sourceId??"")))),r=Mt(t.filter(d=>o(d)&&a.hipotecaIds.has(d.sourceId??""))),u=Mt(t.filter(d=>d.sourceType==="loan-amort")),l=Mt(t.filter(d=>d.sourceType==="account-interest")),{basicos:x,deseo:m}=us(t,a.expenses);return{ingresos:n/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:u/e,gastosBasicos:x/e,gastosDeseo:m/e,gastosTotales:(i+x+m)/e,intereses:l/e}}function Ta(t,a){return t.reduce((e,o)=>{const s=tt(o).tabla.filter(n=>!n.esAmortizacion&&n.fecha<=a);return e+(s.length>0?s[s.length-1].capitalPendiente:o.capital||0)},0)}function ms(t,a,e,o){const s=t.filter(l=>l.activo&&!l.simulacion&&(l.fechaInicio||"")<=e),n=s.reduce((l,x)=>{if((x.amortizaciones||[]).filter(h=>h.fecha>=a&&h.fecha<=e).length===0)return l;const d=tt(x).totalIntereses,g=tt({...x,amortizaciones:(x.amortizaciones||[]).filter(h=>h.fecha<a||h.fecha>e)}).totalIntereses;return l+Math.max(0,g-d)},0),i=s.filter(l=>l.mostrarFechaFinEnDashboard!==!1).map(l=>({loan:l,fechaFin:tt(l).fechaFin})).filter(l=>!!l.fechaFin&&l.fechaFin>=a&&l.fechaFin<=e),r=s.map(l=>tt(l).tabla),u=l=>{const{desde:x,hasta:m}=Pa(l);return r.reduce((d,g)=>{const h=g.find($=>!$.esAmortizacion&&$.fecha>=x&&$.fecha<=m);return d+(h?h.cuota:0)},0)};return{deudaInicio:Ta(s,a),deudaFin:Ta(s,e),ahorroIntereses:n,ahorroInteresesMes:o>0?n/o:0,cuotasInicio:u(a.slice(0,7)),cuotasFin:u(e.slice(0,7)),finEnPeriodo:i}}function fs(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:Mt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function Da(t,a=new Set,e="desglosado"){if(a.size===0)return Sa(t,"gasto");const o=new Map;for(const s of t){if(s.tipo!=="gasto")continue;const n=s.tags||[],i=n.filter(l=>a.has(l)),r=n.filter(l=>!a.has(l)),u=e==="porgrupos"&&i.length>0?i:r;for(const l of u)o.set(l,(o.get(l)||0)+Math.abs(s.cuantia))}return o}function vs(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...Da(t,a.grupoTags,a.modo).entries()].filter(([s])=>!e||e.size===0||e.has(s)).map(([s,n])=>({tag:s,total:n/o})).sort((s,n)=>n.total-s.total)}function gs(t,a){const e=a.reduce((o,s)=>o+it(s),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:Mt(t.filter(o=>o.tipo==="gasto")),totalIngresos:Mt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function bs(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function hs(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function ys(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function xs(t,a){if(t.length===0)return[];const e=l=>a==="mes"?l.slice(0,7):l.slice(0,4),o=l=>a==="mes"?`${l}-01`:`${l}-01-01`,s=t[0],n=s.delta??(s.tipo==="ingreso"?Math.abs(s.cuantia):-Math.abs(s.cuantia));let i=(s.saldoAcum??0)-n;const r=[];let u=null;for(const l of t){const x=e(l.fecha),m=l.saldoAcum??i;(!u||u.periodo!==x)&&(u&&(i=u.cierre),u={periodo:x,inicio:o(x),apertura:i,cierre:m,maximo:Math.max(i,m),minimo:Math.min(i,m),eventos:0},r.push(u)),u.cierre=m,m>u.maximo&&(u.maximo=m),m<u.minimo&&(u.minimo=m),u.eventos+=1}return r}const $s=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:xs,cuentasVisibles:bs,gastoPorTagOrdenado:vs,idsHipoteca:hs,idsPrestamosIniciados:ys,interesesPorCuenta:fs,mesesDelPeriodo:cs,metricasFlujo:ps,rangoMes:Pa,rangoMesDe:_a,resumenPrestamosPeriodo:ms,sinTransferencias:ds,sumarGastosPorTag:Da,totalesPeriodo:gs},Symbol.toStringTag,{value:"Module"}));function Is(t,a,e){const o=t||[];if(!o.length)return a;const s=o.find(i=>i.año===e);if(s)return s.tramos;const n=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return n.length?n[0].tramos:a}function gt(t,a){return e=>Is(t,a,e)}const Wt=8,Ra=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Oa=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function _e(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}function Na(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Ra,tramosGananciasCapital:Oa,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function As(t,a){return{loans:[],expenses:[],accounts:[_e(t)],nominas:[],goals:[],planes:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],config:Na(t,a)}}const bt=t=>Array.isArray(t)?t:[],Ms=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Qt(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function qa(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function Pe(t){const{varianza:a,inflacion:e,...o}=t;return o}function Ss(t,a){const{hoyISO:e,finISO:o}=a,s={...t},n=Ms(t.config),r={...Na(e,o)};for(const[x,m]of Object.entries(n))m!=null&&(r[x]=m);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Ra),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Oa),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),s.config=r;let u=bt(t.accounts).map(x=>{const m={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...x};return m.modeloFondo||(m.modeloFondo=m.esFondoPension?"pension":"cuenta"),delete m.esFondoPension,Array.isArray(m.historicoSaldos)||(m.historicoSaldos=[]),Qt(m)});u.length===0&&(u=[_e(e)]);const l=u.filter(x=>x.esCuentaPrincipal);if(l.length===0){const x=u.find(m=>m._id==="default")||u[0];u=u.map(m=>({...m,esCuentaPrincipal:m._id===x._id}))}else if(l.length>1){let x=!1;u=u.map(m=>m.esCuentaPrincipal?x?{...m,esCuentaPrincipal:!1}:(x=!0,m):m)}return s.accounts=u,s.expenses=bt(t.expenses).map(x=>{const m={basico:!1,activo:!0,tags:[],historialPrecios:[],...x};return Array.isArray(m.tags)||(m.tags=[]),Array.isArray(m.historialPrecios)||(m.historialPrecios=[]),m.diaPago=qa(m.diaPago),Pe(Qt(m))}),s.loans=bt(t.loans).map(x=>{const m={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...x};return Array.isArray(m.tags)||(m.tags=[]),m.diaPago=qa(m.diaPago),m.amortizaciones=bt(m.amortizaciones).map(d=>Qt(d)),Pe(Qt(m))}),s.nominas=bt(t.nominas).map(x=>{const m={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...x};return Array.isArray(m.tags)||(m.tags=[]),Array.isArray(m.retribucionFlexible)||(m.retribucionFlexible=[]),Pe(Qt(m))}),s.goals=bt(t.goals).map((x,m)=>{const d=Array.isArray(x.cuentaIds)?x.cuentaIds:x.cuentaId?[x.cuentaId]:[],{cuentaId:g,...h}=x;return{prioridad:m+1,completado:!1,usarColchon:!0,targetAmount:0,...h,cuentaIds:d}}),s.inflacion=bt(t.inflacion),s.tramosIRPFHistorico=bt(t.tramosIRPFHistorico),s.tramosGananciasCapitalHistorico=bt(t.tramosGananciasCapitalHistorico),s.escenarios=bt(t.escenarios).map(({inversiones:x,...m})=>m),s}const Dt=t=>Array.isArray(t)?t:[];let Te=0;function ws(t){return Te+=1,`${t}_${Te.toString(36)}`}const Cs=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Fs=t=>typeof t=="number"&&Number.isFinite(t);function zs(t,a){const e={...t};Te=0;const o=Dt(t.transacciones),s=Dt(t.puntosControl),n=[...s],i=new Set(s.map(l=>`${l.cuentaId}|${l.fecha}`)),r=(l,x,m,d)=>{if(!Cs(x)||!Fs(m))return;const g=`${l}|${x}`;i.has(g)||(i.add(g),n.push({_id:ws("pc"),fecha:x,cuentaId:l,saldoCts:$t(m),...typeof d=="string"&&d?{nota:d}:{}}))};for(const l of Dt(t.accounts)){const x=typeof l._id=="string"?l._id:null;if(x)for(const m of Dt(l.historicoSaldos))r(x,m.fecha,m.saldo,m.nota)}const u=Dt(t.history);if(u.length>0){const l=Dt(t.accounts),x=l.find(d=>d.esCuentaPrincipal)||l.find(d=>d.activo)||l[0],m=typeof(x==null?void 0:x._id)=="string"?x._id:"default";for(const d of u){const g=typeof d.cuenta=="string"?d.cuenta:typeof d.cuentaId=="string"?d.cuentaId:m;r(g,d.fecha,d.saldo,d.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=n.sort((l,x)=>String(l.fecha).localeCompare(String(x.fecha))),e}const De=t=>Array.isArray(t)?t:[],Es=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),js=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Re=0;function _s(){return Re+=1,`tx_hp_${Re.toString(36)}`}function Ps(t,a){const e={...t};Re=0;const o=[...De(t.transacciones)],s=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),n=De(t.expenses).map(i=>{const r=De(i.historialPrecios),u=typeof i._id=="string"?i._id:null,l=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",x=i.tipo==="ingreso"?"ingreso":"gasto",m=Array.isArray(i.tags)?i.tags.filter(h=>typeof h=="string"):[];if(u)for(const h of r){if(!h||!Es(h.fecha)||!js(h.cuantia))continue;const $=x==="ingreso"?$t(h.cuantia):-$t(h.cuantia),M=`${u}|${h.fecha}|${$}`;s.has(M)||(s.add(M),o.push({_id:_s(),fecha:h.fecha,cuentaId:l,importeCts:$,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:m,estimacionId:u,tipo:x,origen:"importado",nota:typeof h.nota=="string"&&h.nota?h.nota:"Importado del historial de precios"}))}const{historialPrecios:d,...g}=i;return g});return e.expenses=n,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const La=t=>Array.isArray(t)?t:[],St=(t,a="")=>typeof t=="string"&&t.trim()?t:a,Kt=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,Ts=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function Ds(t,a){var x;const e={...t};if(Array.isArray(e.planes))return e;const o=La(e.goals),s=La(e.accounts),n=s.map(m=>{const d=Kt(m.bloqueoMeses,0);return{_id:`veh_${St(m._id,"x")}`,nombre:St(m.nombre,"Cuenta"),rentabilidadRealAnual:Kt(m.interes,0)/100,liquidez:m.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":d>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Kt(m.impuestoRetirada,0)/100,topeAportacionAnual:m.modeloFondo==="pension"?$t(1500):null,riesgo:m.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:St(m._id,""),prestamoId:null,esDeuda:!1}}),i=new Map(s.map((m,d)=>[St(m._id,""),n[d]._id])),r=((x=n[0])==null?void 0:x._id)??"",u=o.map((m,d)=>{const g=Array.isArray(m.cuentaIds)?m.cuentaIds.map($=>St($,"")):[],h=Ts(m.targetDate);return{_id:St(m._id,`obj_mig_${d}`),nombre:St(m.nombre,`Objetivo ${d+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:$t(Kt(m.targetAmount,0)),fechaLimite:h,prioridad:Kt(m.prioridad,d+1),modoAsignacion:h?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(g[0])??r,saldoActual:0,estado:m.completado===!0?"COMPLETADO":"PENDIENTE",notas:St(m.notas,"")}}),l={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:n,objetivos:u,eventos:[],creadoEn:a.hoyISO};return e.planes=[l],e}const Rs=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Ss},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:zs},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:Ps},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:Ds}],Os=["history"];function ka(t,a,e){let o=t;const s=[];for(const n of[...Rs].sort((i,r)=>i.version-r.version))(a??0)>=n.version||(o=n.migrate(o,e),s.push(n.version));return{state:o,applied:s}}const de="state_",Oe="state__schemaVersion",Ba="financeapp_",Ha="state__modificadoEn";function Ns(t=localStorage,a=Ba){const e=o=>`${a}${o}`;return{get(o){try{const s=t.getItem(e(o));return s===null?null:JSON.parse(s)}catch{return null}},set(o,s){try{t.setItem(e(o),JSON.stringify(s)),o!==Ha&&t.setItem(e(Ha),JSON.stringify(Date.now()))}catch(n){console.error("No se pudo guardar en localStorage:",o,n)}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(a)&&o.push(n.slice(a.length))}return o}}}function qs(t=localStorage,a=Ba){const e=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(de)&&!n.startsWith(a)&&e.push(n)}const o=[];for(const s of e)try{const n=t.getItem(s);n!==null&&t.getItem(`${a}${s}`)===null&&(t.setItem(`${a}${s}`,n),o.push(s)),t.removeItem(s)}catch{}return o}function Ls(t){return G(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function ks({adapter:t,hoy:a=new Date}){const e=G(a),o=Ls(a);let s=As(e,o);const n=new Set;let i=[];function r(w){for(const C of n)C(w)}function u(w){t.set(`${de}${w}`,s[w])}function l(){const w={};for(const j of Object.keys(s)){const _=t.get(`${de}${j}`);_!==null&&(w[j]=_)}for(const j of Os){const _=t.get(`${de}${j}`);_!==null&&(w[j]=_)}const C=t.get(Oe),{state:F,applied:z}=ka(w,C,{hoyISO:e,finISO:o});if(s=F,x(),z.length>0){for(const j of Object.keys(s))u(j);t.set(Oe,Wt)}return i=z,{applied:z}}function x(){if(!Array.isArray(s.accounts)||s.accounts.length===0){s.accounts=[_e(e)],u("accounts");return}const w=s.accounts.filter(C=>C.esCuentaPrincipal);if(w.length===0)s.accounts=s.accounts.map((C,F)=>F===0?{...C,esCuentaPrincipal:!0}:C),u("accounts");else if(w.length>1){let C=!1;s.accounts=s.accounts.map(F=>F.esCuentaPrincipal?C?{...F,esCuentaPrincipal:!1}:(C=!0,F):F),u("accounts")}}function m(w){return s[w]}function d(w,C){s[w]=C,u(w),r(w)}function g(w){d("config",{...s.config,...w})}function h(w){return n.add(w),()=>n.delete(w)}function $(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function M(w,C){const F=[...s[w]],z={...C,_id:$()};return F.push(z),d(w,F),z}function f(w,C,F){const z=s[w].map(j=>j._id===C?{...j,...F}:j);d(w,z)}function b(w,C){const F=s[w].filter(z=>z._id!==C);d(w,F)}function y(){const w=s.accounts||[],C=w.find(F=>F.esCuentaPrincipal&&F.activo)||w.find(F=>F.activo);return C?C._id:"default"}function A(w){var C;return((C=s.accounts.find(F=>F._id===w))==null?void 0:C.nombre)??w}function v(){return gt(s.tramosIRPFHistorico,s.config.tramos_irpf)}function p(){return gt(s.tramosGananciasCapitalHistorico,s.config.tramosGananciasCapital)}function S(){return structuredClone(s)}function I(w,C=null){const{state:F,applied:z}=ka(w,C,{hoyISO:e,finISO:o});s=F,x();for(const j of Object.keys(s))u(j);t.set(Oe,Wt);for(const j of Object.keys(s))r(j);return{applied:z}}return{load:l,get:m,set:d,patchConfig:g,subscribe:h,addItem:M,updateItem:f,removeItem:b,getPrincipalAccountId:y,accountName:A,resolverTramosIRPF:v,resolverTramosGanancias:p,snapshot:S,replaceAll:I,get schemaVersion(){return Wt},get migrationsApplied(){return[...i]},get today(){return e||V()}}}const W={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},wt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:W.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:W.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:W.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:W.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:W.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro",descripcion:"Metas con importe y fecha, con proyección de cumplimiento.",grupo:W.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:W.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:W.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:W.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:W.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:W.planificacion,porDefecto:!1},{id:"planner",nombre:"Objetivos financieros",descripcion:"Plan a largo plazo: objetivos que compiten por el flujo mensual y se encadenan al completarse.",grupo:W.planificacion,porDefecto:!0},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:W.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:W.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:W.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:W.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:W.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:W.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:W.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:W.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:W.datos,porDefecto:!1,dependencias:["sync-nube"]}],Bs=new Map(wt.map(t=>[t.id,t]));function Xt(t){return Bs.get(t)}function Ga(t){return wt.filter(a=>(a.dependencias||[]).includes(t))}function Ne(){const t={};for(const a of wt)t[a.id]=a.porDefecto;return t}function Va(){const t=[],a=new Map;for(const e of wt)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function Hs(t){function a(){return{...Ne(),...t.get("config").features||{}}}function e(m){t.patchConfig({features:m})}function o(m,d=a(),g=new Set){const h=Xt(m);if(!h)return!1;if(h.nucleo)return!0;if(d[m]===!1)return!1;if(g.has(m))return!0;g.add(m);for(const $ of h.dependencias||[])if(!o($,d,g))return!1;return!0}function s(m,d=a()){const g=Xt(m);return g?(g.dependencias||[]).filter(h=>!o(h,d)):[]}function n(m,d){var y;const g=Xt(m);if(!g)return{cambiadas:[]};if(g.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const h=a(),$=new Map(wt.map(A=>[A.id,o(A.id,h)])),M={...h,[m]:d};let f;if(d){const A=[...g.dependencias||[]];for(;A.length;){const v=A.pop();M[v]===!1&&(M[v]=!0,f="dependencias-activadas"),A.push(...((y=Xt(v))==null?void 0:y.dependencias)||[])}}else{const A=Ga(m).map(v=>v.id);for(;A.length;){const v=A.pop();M[v]!==!1&&(M[v]=!1,f="cascada-apagado"),A.push(...Ga(v).map(p=>p.id))}}return e(M),{cambiadas:wt.filter(A=>o(A.id,M)!==$.get(A.id)).map(A=>A.id),motivo:f}}function i(){const m=a();return wt.map(d=>{const g=s(d.id,m);return{...d,activa:o(d.id,m),...g.length>0&&m[d.id]!==!1?{bloqueadaPor:g}:{}}})}function r(){const m=a();return Va().map(({grupo:d,features:g})=>({grupo:d,features:g.map(h=>{const $=s(h.id,m);return{...h,activa:o(h.id,m),...$.length>0&&m[h.id]!==!1?{bloqueadaPor:$}:{}}})}))}function u(){e(Ne())}function l(m){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...m?{nombre:m}:{},features:a()}}function x(m){const d=m,g=d&&typeof d=="object"&&d.features&&typeof d.features=="object"?d.features:null;if(!g)throw new Error('El perfil no tiene una sección "features" válida');const h=Ne(),$=[],M=[];for(const[f,b]of Object.entries(g)){if(!Xt(f)){M.push(f);continue}if(typeof b!="boolean"){M.push(f);continue}h[f]=b,$.push(f)}return e(h),{aplicadas:$,ignoradas:M}}return{isEnabled:m=>o(m),setEnabled:n,estado:i,estadoPorGrupo:r,reset:u,exportProfile:l,importProfile:x,bloqueadaPor:m=>s(m)}}const Zt=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Rt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Gs(t){var s,n;const e=(((s=t.bloqueadaPor)==null?void 0:s.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(n=t.bloqueadaPor)==null?void 0:n.map(Zt).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${Zt(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${Zt(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${Zt(t.descripcion)}</div>
        ${e}
      </div>
    </div>`}function Vs(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:s})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Zt(o)}</div>
        ${s.map(Gs).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Us(t){var s;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-feature-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function Ys(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Vs(e)}`,s(i)}function s(i){var u,l,x;i.querySelectorAll("[data-feature-toggle]").forEach(m=>{m.addEventListener("change",()=>{var h;const d=m.dataset.featureToggle,g=e.setEnabled(d,m.checked);g.motivo==="dependencias-activadas"&&Rt(t,"Se han activado también las funcionalidades necesarias"),g.motivo==="cascada-apagado"&&Rt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(h=t.onChange)==null||h.call(t,g.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(u=i.querySelector('[data-feature-action="export"]'))==null||u.addEventListener("click",()=>{const m=e.exportProfile(),d=new Blob([JSON.stringify(m,null,2)],{type:"application/json"}),g=URL.createObjectURL(d),h=a.createElement("a");h.href=g,h.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,h.click(),URL.revokeObjectURL(g),Rt(t,"Perfil de funcionalidades guardado")}),(l=i.querySelector('[data-feature-action="import"]'))==null||l.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var d,g;const m=(d=r.files)==null?void 0:d[0];if(m)try{const{aplicadas:h,ignoradas:$}=e.importProfile(JSON.parse(await m.text()));Rt(t,$.length>0?`Perfil cargado (${h.length} aplicadas, ${$.length} ignoradas por ser de otra versión)`:`Perfil cargado (${h.length} funcionalidades)`),(g=t.onChange)==null||g.call(t,h),o(i)}catch(h){Rt(t,"No se pudo cargar el perfil: "+h.message,"err")}finally{r.value=""}}),(x=i.querySelector('[data-feature-action="reset"]'))==null||x.addEventListener("click",()=>{var m;e.reset(),Rt(t,"Funcionalidades restablecidas"),(m=t.onChange)==null||m.call(t,[]),o(i)})}function n(){const i=Us(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:n,renderInto:o}}const Ua={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function Ya(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const s=a(o);e.style.display=s?"":"none",s?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function Js({flags:t,document:a=document,router:e,rutasExtra:o}){function s(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function n(){let r=!1;const u=Object.entries((o==null?void 0:o())??{}).map(([l,x])=>[x,l]);for(const[l,x]of[...Object.entries(Ua),...u]){const m=t.isEnabled(l),d=a.querySelector(`.nav-btn[data-view="${x}"]`);d&&(d.style.display=m?"":"none"),!m&&s()===x&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(l=>{const x=[...l.querySelectorAll(".nav-btn[data-view]")];if(x.length===0)return;const m=x.some(d=>d.style.display!=="none");l.style.display=m?"":"none"}),Ya(a,l=>t.isEnabled(l)),r){const l=e??globalThis.Router;l==null||l.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let u=!1;const l=new MutationObserver(()=>{if(!u){u=!0;try{Ya(a,x=>t.isEnabled(x))}finally{u=!1}}});return l.observe(r,{childList:!0,subtree:!0}),()=>l.disconnect()}return{apply:n,observar:i,vistaPara:r=>Ua[r]}}function Ws({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function s(h){return`view-${h}`}function n(h){const $=t.getElementById(s(h.route));if($)return $;const M=t.querySelector(".view-container");if(!M)return null;const f=t.createElement("div");return f.id=s(h.route),f.className="view hidden",M.appendChild(f),f}function i(h){if(t.querySelector(`.nav-btn[data-view="${h.route}"]`))return;const $=t.querySelectorAll(".nav-section"),M=$[h.seccion??Math.max(0,$.length-1)];if(!M)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=h.route,f.innerHTML=`${h.iconoPath?`<svg viewBox="0 0 24 24"><path d="${h.iconoPath}"/></svg>`:""}<span>${h.nombre}</span>`,M.appendChild(f),f.addEventListener("click",()=>{const b=globalThis.Router;b==null||b.navigate(h.route)})}function r(h){e.set(h.route,h),n(h),i(h)}function u(){return[...e.keys()].filter(h=>{const $=e.get(h);return!a||a($.flagId??$.id)})}function l(h){return u().includes(h)}function x(h){const $=e.get(h);if(!$||a&&!a($.flagId??$.id))return!1;const M=n($);if(!M)return!1;if(o&&o!==h){const f=e.get(o),b=t.getElementById(s(o));f!=null&&f.unmount&&b&&f.unmount(b)}return $.mount(M),o=h,!0}function m(){o&&x(o)}function d(){const h={};for(const[$,M]of e)h[$]=M.flagId??M.id;return h}function g(){for(const h of e.values())n(h),i(h)}return{register:r,routes:u,has:l,mount:x,rerender:m,flagPorRuta:d,attachToShell:g,get activa(){return o}}}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ot(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${c(E(t))}</span>`}function Ja(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function Wa(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${c(a)}</span>`).join(" ")}const Qs=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ks(t){const[a,e]=t.split("-").map(Number);return`${Qs[e-1]} ${a}`}function R(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function Z(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function P(t,a,e){t.addEventListener("click",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(a);s&&t.contains(s)&&e(s,o)})}function U(t,a,e){t.addEventListener("change",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(a);s&&t.contains(s)&&e(s,o)})}function pt(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function Qa(t,a){const e=parseFloat(pt(t,a));return Number.isFinite(e)?e:0}function Xs(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Zs(t,a){const{ledger:e}=t,o=(t.hoy??V)(),s=t.accounts().filter(b=>b.activo),{desde:n,hasta:i}=Xs(a.mes),r={cuentaId:a.cuentaId||void 0,desde:n,hasta:i,texto:a.filtroTexto||void 0},u=e.transacciones(r),l=t.estimaciones().filter(b=>b.tipo!=="transferencia"),x=u.filter(b=>b.importeCts<0).reduce((b,y)=>b+y.importeCts,0),m=u.filter(b=>b.importeCts>0).reduce((b,y)=>b+y.importeCts,0),d=a.cuentaId?e.saldoCuenta(a.cuentaId,i):e.saldoTotal(i),g=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),h=s.map(b=>`<option value="${c(b._id)}"${b._id===a.cuentaId?" selected":""}>${c(b.nombre)}</option>`).join(""),$=b=>'<option value="">— sin asignar —</option>'+l.map(y=>`<option value="${c(y._id)}"${y._id===b?" selected":""}>${c(y.concepto)} (${c(E(y.cuantia))})</option>`).join(""),M=u.map(b=>{var y;return`
      <tr data-tx="${c(b._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${c(b.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${c(b.concepto)}</td>
        <td style="padding:7px 8px">${Wa(b.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${c(((y=t.accounts().find(A=>A._id===b.cuentaId))==null?void 0:y.nombre)??b.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${c(b._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${$(b.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Ot(at(b.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${c(b._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${c(b._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),f=g.slice().reverse().slice(0,8).map(b=>{var y;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${c(b.fecha)}</span>
        <span style="color:var(--text3)">${c(((y=t.accounts().find(A=>A._id===b.cuentaId))==null?void 0:y.nombre)??b.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${c(E(at(b.saldoCts)))}</span>
        ${b.nota?`<span style="color:var(--text3)">${c(b.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${c(b._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="card-title">Movimientos reales</div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${h}</select>
          </div>
          <div class="form-group" style="margin:0">
            <label class="form-label">Mes</label>
            <input class="form-input" type="month" id="acc-mes" value="${c(a.mes)}" style="width:140px"/>
          </div>
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${c(a.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${Ot(at(x))}</span>
          <span>Ingresos: ${Ot(at(m))}</span>
          <span>Neto: ${Ot(at(m+x))}</span>
          <span style="margin-left:auto">Saldo a ${c(i)}: <strong>${c(E(d))}</strong></span>
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
              ${M||'<tr><td colspan="7" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
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
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${h}</select></div>
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
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${h}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${f?`<div class="mt-12">${f}</div>`:""}
        </div>
      </div>
    </div>`}function tn(t,a,e,o){const{ledger:s}=a;U(t,"#acc-cuenta",i=>{e.cuentaId=i.value,o()}),U(t,"#acc-mes",i=>{e.mes=i.value||e.mes,o()});const n=t.querySelector("#acc-buscar");n==null||n.addEventListener("input",()=>{e.filtroTexto=n.value,clearTimeout(n._t),n._t=window.setTimeout(o,200)}),P(t,"#nt-guardar",()=>{const i=pt(t,"#nt-concepto").trim(),r=Qa(t,"#nt-importe");if(!i)return R("Indica un concepto","err");if(!(r>0))return R("Indica un importe mayor que cero","err");const u=pt(t,"#nt-tags").split(",").map(l=>l.trim().toLowerCase()).filter(Boolean);s.registrar({fecha:pt(t,"#nt-fecha")||(a.hoy??V)(),cuentaId:pt(t,"#nt-cuenta"),importe:r,concepto:i,tags:u,tipo:pt(t,"#nt-tipo"),estimacionId:pt(t,"#nt-estimacion")||null}),R("Movimiento registrado"),a.onDatosCambiados(),o()}),P(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;Z("¿Eliminar este movimiento?")&&(s.eliminar(r),R("Movimiento eliminado"),a.onDatosCambiados(),o())}),P(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,u=s.transacciones().find(m=>m._id===r);if(!u)return;const l=window.prompt(`Importe de "${u.concepto}" (€)`,String(Math.abs(at(u.importeCts))));if(l===null)return;const x=parseFloat(l.replace(",","."));if(!Number.isFinite(x)||x<=0)return R("Importe no válido","err");s.actualizar(r,{importe:x}),R("Movimiento actualizado"),a.onDatosCambiados(),o()}),U(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");s.asignarEstimacion(r,i.value||null),R("Asignación actualizada"),a.onDatosCambiados()}),P(t,"#pc-guardar",()=>{if(pt(t,"#pc-saldo").trim()==="")return R("Indica el saldo","err");const r=Qa(t,"#pc-saldo");s.registrarPuntoControl(pt(t,"#pc-cuenta"),pt(t,"#pc-fecha")||(a.hoy??V)(),r,pt(t,"#pc-nota").trim()||void 0),R("Saldo real registrado"),a.onDatosCambiados(),o()}),P(t,"[data-pc-borrar]",i=>{Z("¿Eliminar este punto de control?")&&(s.eliminarPuntoControl(i.dataset.pcBorrar),R("Punto de control eliminado"),a.onDatosCambiados(),o())})}function Ka(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:s=5}=e;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const n=ot(t.mediaRealReciente),i=ot(n-a),r=a!==0?i/Math.abs(a)*100:n!==0?100:0;if(Math.abs(r)<s)return null;const u=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:ot(a),cuantiaSugerida:n,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:u,motivo:i>0?`El gasto real de los últimos ${u} meses supera lo estimado`:`El gasto real de los últimos ${u} meses es inferior a lo estimado`}}function en(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(n,i,r={}){const u=r.hoy??V(),l=t.get("expenses"),x=l.find(h=>h._id===n);if(!x)throw new Error(`La estimación ${n} no existe`);const m={...x,fechaFin:u},d={...x,_id:a(),cuantia:ot(i),fechaInicio:u,fechaFin:x.fechaFin??null,ajustadaDesdeId:x._id,ajustadaEn:u},g=l.map(h=>h._id===n?m:h);return g.push(d),t.set("expenses",g),{estimacionCerrada:m,estimacionNueva:d}}function o(n,i={}){const r=[],u=[];for(const l of n)try{r.push(e(l.estimacionId,l.cuantiaSugerida,i))}catch(x){u.push({estimacionId:l.estimacionId,error:x.message})}return{aplicadas:r,errores:u}}function s(n){const i=t.get("expenses"),r=new Map(i.map($=>[$._id,$])),u=r.get(n);if(!u)return[];const l=[];let x=u;const m=new Set;for(;x!=null&&x.ajustadaDesdeId&&!m.has(x._id);){m.add(x._id);const $=r.get(x.ajustadaDesdeId);if(!$)break;l.unshift($),x=$}const d=[];let g=u;const h=new Set([u._id]);for(;;){const $=i.find(M=>M.ajustadaDesdeId===g._id&&!h.has(M._id));if(!$)break;h.add($._id),d.push($),g=$}return[...l,u,...d]}return{aplicar:e,aplicarTodas:o,cadena:s}}function qe(t){const a=t.estimaciones(),e=new Map(a.map(o=>[o._id,o]));return t.precision.analizarTodas(a).map(o=>{const s=e.get(o.estimacionId);return{analisis:o,estimacion:s,sugerencia:Ka(o,s.cuantia)}}).filter(o=>!!o.estimacion)}function an(t){const a=qe(t),e=a.filter(u=>u.analisis.precision!==null),o=a.filter(u=>u.sugerencia!==null),s=t.precision.analizarPorTag(a.map(u=>u.analisis));if(e.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const n=e.map(({analisis:u,estimacion:l,sugerencia:x})=>{const m=u.meses.slice(-6).map(d=>`${Ks(d.mes)}: ${E(d.estimado)} → ${E(d.real)} (${d.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${c(l.concepto)}</div>
          <div style="margin-top:3px">${Wa(u.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${c(m)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(E(u.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(E(u.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Ot(u.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${Ja(u.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${x?`<button class="btn-secondary" data-sugerir="${c(u.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${c(x.motivo)}">Sugerir ajuste → ${c(E(x.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=s.map(u=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${c(u.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${u.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(E(u.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(E(u.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Ot(u.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${Ja(u.precision)}</td>
      </tr>`).join(""),r=(u,l="left")=>`<th style="padding:7px 8px;text-align:${l};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${u}</th>`;return`
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
    </div>`}function on(t,a,e){P(t,"[data-sugerir]",o=>{const s=o.dataset.sugerir,n=qe(a).find(u=>u.analisis.estimacionId===s);if(!(n!=null&&n.sugerencia))return;const i=n.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${E(i.cuantiaActual)}
Nueva estimación: ${E(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;Z(r)&&(a.adjuster.aplicar(s,i.cuantiaSugerida,{hoy:a.hoy()}),R(`Estimación ajustada a ${E(i.cuantiaSugerida)}`),a.onDatosCambiados(),e())}),P(t,"#ajustar-todas",()=>{const o=qe(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const s=o.map(r=>`• ${r.concepto}: ${E(r.cuantiaActual)} → ${E(r.cuantiaSugerida)}`).join(`
`);if(!Z(`Se van a ajustar ${o.length} estimaciones:

${s}

¿Continuar?`))return;const{aplicadas:n,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});R(i.length>0?`${n.length} ajustadas, ${i.length} con error`:`${n.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const sn="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function nn(t){const a={cuentaId:"",mes:(t.hoy??V)().slice(0,7),filtroTexto:""},e=()=>{var r;return(r=t.onDatosCambiados)==null?void 0:r.call(t)},o=t.hoy??V,s={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:o},n={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:e,hoy:o};function i(r){const u=t.ledger.saldoTotal(o()),l=t.ledger.ultimaFecha(),x=t.ledger.transacciones().length;r.innerHTML=`
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
          <div class="stat-value" style="font-size:1.3rem">${c(E(u))}</div>
          <div style="font-size:11px;color:var(--text3)">suma de cuentas activas</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Movimientos registrados</div>
          <div class="stat-value" style="font-size:1.3rem">${x}</div>
          <div style="font-size:11px;color:var(--text3)">${l?`último: ${c(l)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const m=r.querySelector("#acc-transacciones"),d=r.querySelector("#acc-precision");m.innerHTML=Zs(s,a),d.innerHTML=an(n);const g=()=>i(r);tn(m,s,a,g),on(d,n,g)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:sn,mount:i}}const rn="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Le(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function ln(t){const{store:a}=t,e=t.hoy??V,o=()=>L(e()),s=()=>a.get("config").margenesSeguridad??[];function n(g){var h;a.patchConfig({margenesSeguridad:g}),(h=t.onDatosCambiados)==null||h.call(t)}function i(g,h){const $=s().map(f=>({...f,puntos:(f.puntos??[]).map(b=>({...b}))})),M=$.find(f=>f._id===g);M&&(h(M),n($))}function r(g){const h=a.get("config"),$=ce(g,a.get("expenses"),h,a.get("loans"),e(),!1,o());return E($)}function u(g,h,$){const M=h.tipo==="fijo",f=M?"":`<span class="text-sm" style="color:var(--text3)">${c(E((h.meses??0)*$))}</span>`;return`
      <tr data-punto="${c(h._id)}" data-margen="${c(g._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${c(h.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${M?" selected":""}>Fijo €</option>
            <option value="meses"${M?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${M?`<input type="number" class="form-input" style="width:90px" value="${h.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${M?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${h.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${f}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function l(g,h,$){const M=g.cuentas&&g.cuentas.length>0?g.cuentas.map(A=>{var v;return((v=h.find(p=>p._id===A))==null?void 0:v.nombre)??A}).join(", "):"Todas las cuentas activas",b=[...g.puntos??[]].sort((A,v)=>A.fecha.localeCompare(v.fecha)).map(A=>u(g,A,$)).join(""),y=g.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${c(M)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${c(r(g))}</strong>
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
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${c(g._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${c(g.nombre)}</span>
            <span class="badge ${g.activo?"badge-active":"badge-inactive"}">${g.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${g.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${g.activo?"checked":""} data-toggle-margen="${c(g._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${c(g._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${c(g._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${y}
      </div>`}function x(g,h){const $=h?s().find(y=>y._id===h):null,M=a.get("accounts").filter(y=>y.activo),f=new Set(($==null?void 0:$.cuentas)??[]),b=M.map(y=>`
        <label class="tag" data-chip="${c(y._id)}" style="cursor:pointer;${f.has(y._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${c(y._id)}" ${f.has(y._id)?"checked":""} style="display:none"/>
          ${c(y.nombre)}
        </label>`).join(" ");g.innerHTML=`
      <div class="modal-title">${h?"Editar margen":"Nuevo margen de seguridad"}</div>
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
        <button class="btn-primary" data-guardar-margen="${c(h??"")}">Guardar</button>
      </div>`}function m(g,h){const $=document.getElementById("modal-overlay"),M=document.getElementById("modal-content");!$||!M||(x(M,g),$.classList.remove("hidden"),U(M,".mg-acc-chip",f=>{const b=f,y=M.querySelector(`[data-chip="${b.value}"]`);y&&(y.style.cssText=`cursor:pointer;${b.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),U(M,"#mg-p-tipo",f=>{const b=f.value==="fijo",y=M.querySelector("#mg-p-importe-wrap"),A=M.querySelector("#mg-p-meses-wrap");y&&(y.style.display=b?"":"none"),A&&(A.style.display=b?"none":"")}),P(M,"[data-cerrar-form]",()=>$.classList.add("hidden")),P(M,"[data-guardar-margen]",f=>{var p,S,I,w,C;const b=f.getAttribute("data-guardar-margen")||"",y=((p=M.querySelector("#mg-nombre"))==null?void 0:p.value.trim())??"";if(!y)return R("El nombre es obligatorio","err");const A=[...M.querySelectorAll(".mg-acc-chip:checked")].map(F=>F.value),v=s().map(F=>({...F}));if(b){const F=v.findIndex(z=>z._id===b);if(F===-1)return R("Margen no encontrado","err");v[F]={...v[F],nombre:y,cuentas:A}}else{const F=((S=M.querySelector("#mg-p-tipo"))==null?void 0:S.value)??"fijo",z={_id:Le(),fecha:((I=M.querySelector("#mg-p-fecha"))==null?void 0:I.value)||V(),tipo:F,importe:parseFloat(((w=M.querySelector("#mg-p-importe"))==null?void 0:w.value)??"0")||0,meses:parseFloat(((C=M.querySelector("#mg-p-meses"))==null?void 0:C.value)??"1")||1};v.push({_id:Le(),nombre:y,activo:!0,cuentas:A,puntos:[z]})}n(v),R(b?"Margen actualizado":"Margen creado"),$.classList.add("hidden"),h()}))}function d(g){const h=s(),$=a.get("accounts"),M=Yt(a.get("expenses"),o());g.innerHTML=`
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
      ${h.length===0?`<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`:h.map(b=>l(b,$,M)).join("")}`;const f=()=>d(g);P(g,"[data-nuevo-margen]",()=>m(null,f)),P(g,"[data-editar-margen]",b=>m(b.getAttribute("data-editar-margen"),f)),P(g,"[data-borrar-margen]",b=>{Z("¿Eliminar este margen de seguridad?")&&(n(s().filter(y=>y._id!==b.getAttribute("data-borrar-margen"))),R("Margen eliminado"),f())}),U(g,"[data-toggle-margen]",b=>{const y=b.getAttribute("data-toggle-margen");i(y,A=>{A.activo=b.checked}),f()}),P(g,"[data-add-punto]",b=>{const y=b.getAttribute("data-add-punto");i(y,A=>{A.puntos=[...A.puntos??[],{_id:Le(),fecha:V(),tipo:"fijo",importe:0,meses:1}]}),f()}),P(g,"[data-borrar-punto]",b=>{const y=b.closest("[data-punto]");if(!y)return;const A=y.dataset.margen,v=y.dataset.punto;i(A,p=>{p.puntos=(p.puntos??[]).filter(S=>S._id!==v)}),f()}),U(g,"[data-campo]",b=>{const y=b.closest("[data-punto]");if(!y)return;const A=b.getAttribute("data-campo"),v=b.value;i(y.dataset.margen,p=>{const S=(p.puntos??[]).find(I=>I._id===y.dataset.punto);S&&(A==="fecha"?S.fecha=v:A==="tipo"?S.tipo=v:A==="importe"?S.importe=parseFloat(v)||0:S.meses=parseFloat(v)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:rn,mount:d}}const cn="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function dn(t){const a=Array.isArray(t)?t[1]??[]:[];return Array.isArray(a)?a.filter(e=>e&&e.value!==null&&e.value!==void 0&&Number.isFinite(Number(e.value))).map(e=>({year:parseInt(e.date),tasa:parseFloat(Number(e.value).toFixed(2))})).filter(e=>Number.isFinite(e.year)).sort((e,o)=>e.year-o.year):[]}function un({fetchImpl:t,url:a=cn}={}){let e=null,o=!1;async function s(n=!1){if(e&&!n)return e;if(o)return null;o=!0;try{const r=await(t??fetch)(a);if(!r.ok)throw new Error(`HTTP ${r.status}`);return e=dn(await r.json()),e}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:s,invalidar:()=>{e=null},get enCache(){return e}}}const pn="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function mn(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function fn(t){const{store:a}=t,e=t.ipc??un(),o=()=>a.get("inflacion")??[];function s(){var m;(m=t.onDatosCambiados)==null||m.call(t)}function n(m,d){if(!m||m.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const g=new Set(o().map(b=>b.year)),h=m.filter(b=>b.year>=d).reverse(),$=h.filter(b=>!g.has(b.year)).length,M=[...new Set(m.map(b=>b.year))].sort((b,y)=>b-y),f=h.map(b=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${b.year}" data-tasa="${b.tasa}" ${g.has(b.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${b.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${mn(b.tasa)}">${b.tasa.toFixed(2)}%</span>
          ${g.has(b.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${M.map(b=>`<option value="${b}"${b===d?" selected":""}>${b}</option>`).join("")}
        </select>
        <span style="font-size:10px;color:var(--text3)">
          Fuente: Banco Mundial · FP.CPI.TOTL.ZG · ${m[0].year}–${m[m.length-1].year}
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
      </div>`}function i(m){return!m||m.length===0?2e3:Math.max(m[0].year,new Date().getFullYear()-25)}async function r(m){const d=document.getElementById("modal-overlay"),g=document.getElementById("modal-content");if(!d||!g)return;g.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,d.classList.remove("hidden");const h=(M,f)=>{const b=document.getElementById("ipc-body");b&&(b.innerHTML=n(M,f))},$=await e.obtener();h($,i($)),P(g,"[data-ipc-cerrar]",()=>d.classList.add("hidden")),U(g,"#ipc-desde",M=>{h(e.enCache,parseInt(M.value))}),P(g,"[data-ipc-recargar]",()=>{e.invalidar();const M=document.getElementById("ipc-body");M&&(M.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),e.obtener(!0).then(f=>h(f,i(f)))}),P(g,"[data-ipc-importar]",()=>{const M=[...g.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(M.length===0)return R("Nada seleccionado","err");const f=new Set(o().map(y=>y.year));let b=0;for(const y of M){const A=parseInt(y.dataset.year??""),v=parseFloat(y.dataset.tasa??"");!Number.isFinite(A)||!Number.isFinite(v)||f.has(A)||(a.addItem("inflacion",{year:A,tasa:v}),f.add(A),b++)}d.classList.add("hidden"),R(`${b} periodo${b!==1?"s":""} importado${b!==1?"s":""} correctamente`),s(),m()})}function u(m,d){var f;const g=document.getElementById("modal-overlay"),h=document.getElementById("modal-content");if(!g||!h)return;const $=m?o().find(b=>b._id===m):null;h.innerHTML=`
      <div class="modal-title">${m?"Editar periodo de inflación":"Nuevo periodo de inflación"}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Año</label>
          <input class="form-input" type="number" id="inf-year" value="${($==null?void 0:$.year)??new Date().getFullYear()}" placeholder="2026"/></div>
        <div class="form-group"><label class="form-label">Tasa anual (%)</label>
          <input class="form-input" type="number" id="inf-tasa" step="0.01" value="${($==null?void 0:$.tasa)??""}" placeholder="3.5"/></div>
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-inf-cerrar>Cancelar</button>
        <button class="btn-primary" data-inf-guardar="${c(m??"")}">Guardar</button>
      </div>`,g.classList.remove("hidden");const M=()=>{var p;const b=parseFloat(((p=h.querySelector("#inf-tasa"))==null?void 0:p.value)??""),y=h.querySelector("#inf-preview");if(!y)return;if(!Number.isFinite(b)||b<=0){y.innerHTML="";return}const A=(Math.pow(1+b/100,1/12)-1)*100,v=Math.pow(1+b/100,5);y.innerHTML=`Con un ${b}% anual: <strong>${A.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${v.toFixed(3)}</strong> (+${((v-1)*100).toFixed(1)}%)`};(f=h.querySelector("#inf-tasa"))==null||f.addEventListener("input",M),M(),P(h,"[data-inf-cerrar]",()=>g.classList.add("hidden")),P(h,"[data-inf-guardar]",b=>{const y=b.getAttribute("data-inf-guardar")||"",A=parseInt(h.querySelector("#inf-year").value),v=parseFloat(h.querySelector("#inf-tasa").value);if(!Number.isFinite(A)||A<1900||A>2200)return R("Año inválido","err");if(!Number.isFinite(v)||v<0||v>100)return R("Tasa inválida (0–100%)","err");if(o().filter(S=>S._id!==y).some(S=>S.year===A))return R("Ya existe un periodo para ese año","err");y?(a.updateItem("inflacion",y,{year:A,tasa:v}),R("Periodo actualizado")):(a.addItem("inflacion",{year:A,tasa:v}),R("Periodo añadido")),g.classList.add("hidden"),s(),d()})}function l(m,d){const g=(Math.pow(1+m.tasa/100,.08333333333333333)-1)*100,h=`${m.year}-12-31`,$=h>d?dt([m],d,h):null;return`
      <div class="exp-table-row" data-periodo="${c(m._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${m.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${m.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${g.toFixed(3)}%/mes</div>
        <div class="num">${$!==null?`×${$.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${c(m._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${c(m._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function x(m){const d=o(),g=a.get("config").usarInflacion||!1,h=[...d].sort((p,S)=>S.year-p.year),$=V(),M=new Date().getFullYear(),f=G(new Date(M+5,0,1)),b=G(new Date(M+10,0,1)),y=g&&d.length>0?dt(d,$,f):null,A=g&&d.length>0?dt(d,$,b):null;m.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${!g&&d.length===0?`<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
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
            <input type="checkbox" data-toggle-inflacion ${g?"checked":""}/>
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${y!==null&&A!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${y.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((y-1)*100).toFixed(1)}%)</span></div>
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
        ${h.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':h.map(p=>l(p,$)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const v=()=>x(m);U(m,"[data-toggle-inflacion]",p=>{const S=p.checked;a.patchConfig({usarInflacion:S}),R(S?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),s(),v()}),P(m,"[data-nuevo-periodo]",()=>u(null,v)),P(m,"[data-editar-periodo]",p=>u(p.getAttribute("data-editar-periodo"),v)),P(m,"[data-importar-ipc]",()=>void r(v)),P(m,"[data-borrar-periodo]",p=>{Z("¿Eliminar este periodo de inflación?")&&(a.removeItem("inflacion",p.getAttribute("data-borrar-periodo")),R("Periodo eliminado"),s(),v())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:pn,mount:x}}const vn=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],gn=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],bn=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function hn(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const ke=(t,a)=>t.map(([e,o])=>`<option value="${c(e)}"${e===a?" selected":""}>${c(o)}</option>`).join("");function Xa(t,a="dp"){const{modo:e,dia:o,nth:s,wd:n}=hn(t),i=ke(vn.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${c(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${ke(gn,s)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${ke(bn,n)}</select>
        del mes
      </span>
    </div>
  </div>`}function Za(t){var o,s,n;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(s=a.querySelector("[data-dp-dia]"))==null||s.style.setProperty("display",e==="dia"?"":"none"),(n=a.querySelector("[data-dp-nth]"))==null||n.style.setProperty("display",e==="nthweekday"?"":"none")}function to(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=s=>{var n;return((n=a.querySelector(s))==null?void 0:n.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const yn="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",xn=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function $n(t){const a=t.hoy??V,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},s=()=>t.store.get("accounts"),n=f=>{var b;return((b=s().find(y=>y._id===(f||"default")))==null?void 0:b.nombre)??(f||"default")};function i(){const f=a();let b=[...t.store.get("expenses")];if(e.mostrarExpirados||(b=b.filter(y=>!y.fechaFin||y.fechaFin>=f)),e.tipo&&(b=b.filter(y=>y.tipo===e.tipo)),e.cuenta&&(b=b.filter(y=>(y.cuenta||"default")===e.cuenta)),e.desde&&(b=b.filter(y=>(y.fechaInicio??"")>=e.desde)),e.hasta&&(b=b.filter(y=>(y.fechaInicio??"")<=e.hasta)),e.busqueda){const y=e.busqueda.toLowerCase();b=b.filter(A=>A.concepto.toLowerCase().includes(y))}return e.tags.size>0&&(b=b.filter(y=>(y.tags||[]).some(A=>e.tags.has(A)))),b.sort((y,A)=>{const v=y[e.orden]??"",p=A[e.orden]??"";return typeof v=="number"&&typeof p=="number"?(v-p)*e.sentido:String(v).localeCompare(String(p))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function u(f,b){const y=e.orden===f?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${c(b)} <span class="sort-arrow">${y}</span></span>`}function l(f,b=!1){return(b?'<option value="">Todas las cuentas</option>':"")+s().filter(A=>A.activo!==!1).map(A=>`<option value="${c(A._id)}"${A._id===f?" selected":""}>${c(A.nombre)}</option>`).join("")}function x(f){const b=f.tipo==="transferencia",y=he(f.diaPago??""),A=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${y?` · ${y}`:""}`,v=!!f.fechaFin&&f.fechaFin<a(),p=b?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',S=b?`${c(n(f.cuenta))} → ${c(n(f.cuentaDestino))}`:c(n(f.cuenta)),I=(f.tags||[]).map(w=>`<span class="tag${e.tags.has(w)?" active":""}" data-tag="${c(w)}" title="Filtrar por ${c(w)}">${c(w)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(f.concepto)}</div>
        <div class="tag-list mt-4">${I}</div>
      </div>
      <div>${p}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":b?"":"neg"}">${b?"⇄ ":""}${c(E(f.cuantia))}</div>
      <div class="text-sm">${c(A)}</div>
      <div class="text-sm exp-col-hide">${S}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${c(f._id)}"${f.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${f.tipo==="gasto"&&f.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffd166" title="Gasto clasificado como deseo">deseo</span>':""}
        ${f.tipo==="gasto"&&f.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${f.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${f.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${c(f.ajustadaEn??"")}">ajustada</span>`:""}
        ${v?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${c(f._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${c(f._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${c(f._id)}">✕</button>
      </div>
    </div>`}function m(f){const b=i(),y=r();f.innerHTML=`
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
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${c(e.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${e.tipo==="gasto"?" selected":""}>Gastos</option>
          <option value="ingreso"${e.tipo==="ingreso"?" selected":""}>Ingresos</option>
          <option value="transferencia"${e.tipo==="transferencia"?" selected":""}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${l(e.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${c(e.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${c(e.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${y.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${y.map(A=>`<span class="tag${e.tags.has(A)?" active":""}" data-tag="${c(A)}">${c(A)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${u("concepto","Concepto")} ${u("tipo","Tipo")} ${u("cuantia","Cuantía")} ${u("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${b.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':b.map(x).join("")}
      </div>`}function d(f){const b=(f==null?void 0:f.tipo)==="transferencia",y=t.store.get("escenarios"),A=(f==null?void 0:f.escenarioIds)||[],v=(p,S,I,w,C="")=>`<div class="form-group"><label class="form-label">${c(S)}</label>
       <input class="form-input" type="${I}" id="${p}" value="${c(w)}" placeholder="${c(C)}"/></div>`;return`
      <div class="grid-2">
        ${v("ef-concepto","Concepto","text",(f==null?void 0:f.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(f==null?void 0:f.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${b?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${v("ef-cuantia","Cuantía (€)","number",(f==null?void 0:f.cuantia)??"","500")}
        ${v("ef-frecuencia","Frecuencia","number",(f==null?void 0:f.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${xn.map(([p,S])=>`<option value="${p}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===p?" selected":""}>${c(S)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${v("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${l((f==null?void 0:f.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${b?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${l((f==null?void 0:f.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(f==null?void 0:f.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${f!=null&&f._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${v("ef-fecha-fin","Fecha fin (opcional)","date",(f==null?void 0:f.fechaFin)??"")}</div>
          <div class="mt-8">${Xa(f==null?void 0:f.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${b?' style="display:none"':""}>
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
          ${y.length>0?`<div class="form-group mt-8"><label class="form-label">Escenarios</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${y.map(p=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${A.includes(p._id)?c(p.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${c(p._id)}"${A.includes(p._id)?" checked":""}/>
                          ${c(p.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${c((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function g(f){var A;const b=((A=f.querySelector("#ef-tipo"))==null?void 0:A.value)??"gasto",y=(v,p)=>{const S=f.querySelector(v);S&&(S.style.display=p?"":"none")};y("#ef-destino-wrap",b==="transferencia"),y("#ef-basico-wrap",b!=="transferencia"),y("#ef-irpf-wrap",b==="ingreso"),y("#ef-clasificacion-wrap",b==="gasto")}function h(f,b,y){const A=document.getElementById("modal-overlay"),v=document.getElementById("modal-content");!A||!v||(v.innerHTML=`<div class="modal-title">${c(b)}</div>${d(f)}`,A.classList.remove("hidden"),U(v,"#ef-tipo",()=>g(v)),U(v,"[data-dp-modo]",()=>Za(v)),P(v,"[data-cancelar]",()=>A.classList.add("hidden")),P(v,"[data-guardar]",p=>{$(v,p.getAttribute("data-guardar")||"")&&(A.classList.add("hidden"),y())}))}function $(f,b){const y=F=>{var z;return((z=f.querySelector(F))==null?void 0:z.value)??""},A=F=>{var z;return!!((z=f.querySelector(F))!=null&&z.checked)},v=y("#ef-tipo")||"gasto",p=v==="transferencia",S=y("#ef-concepto").trim(),I=parseFloat(y("#ef-cuantia"));if(!S||!Number.isFinite(I))return R("Concepto y cuantía obligatorios","err"),!1;const w=y("#ef-clasificacion"),C={concepto:S,tipo:v,cuantia:I,frecuencia:parseInt(y("#ef-frecuencia"),10)||1,tipoFrecuencia:y("#ef-tipo-frec")||"mensual",fechaInicio:y("#ef-fecha-ini"),fechaFin:y("#ef-fecha-fin")||null,diaPago:to(f),cuenta:y("#ef-cuenta"),cuentaDestino:p?y("#ef-cuenta-dest")||"default":void 0,activo:A("#ef-activo"),basico:!p&&A("#ef-basico"),sujetoIRPF:!p&&A("#ef-sujetoIRPF"),clasificacion:v==="gasto"?w||null:void 0,tags:p?["transferencia"]:y("#ef-tags").split(",").map(F=>F.trim()).filter(Boolean),escenarioIds:[...f.querySelectorAll(".ef-escenario:checked")].map(F=>F.value)};return b?(t.store.updateItem("expenses",b,C),R("Actualizado")):(t.store.addItem("expenses",C),R("Creado")),o(),!0}function M(f,b){const y=f.querySelector("[data-busqueda]");let A;y==null||y.addEventListener("input",()=>{clearTimeout(A),A=setTimeout(()=>{e.busqueda=y.value,b();const v=f.querySelector("[data-busqueda]");v==null||v.focus(),v==null||v.setSelectionRange(v.value.length,v.value.length)},250)}),U(f,"[data-expirados]",v=>{e.mostrarExpirados=v.checked,b()}),U(f,"[data-f-tipo]",v=>{e.tipo=v.value,b()}),U(f,"[data-f-cuenta]",v=>{e.cuenta=v.value,b()}),U(f,"[data-f-desde]",v=>{e.desde=v.value,b()}),U(f,"[data-f-hasta]",v=>{e.hasta=v.value,b()}),P(f,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,b()}),P(f,"[data-limpiar-tags]",()=>{e.tags=new Set,b()}),P(f,"[data-tag]",v=>{const p=v.getAttribute("data-tag");e.tags.has(p)?e.tags.delete(p):e.tags.add(p),b()}),P(f,"[data-orden]",v=>{const p=v.getAttribute("data-orden");e.orden===p?e.sentido=e.sentido===1?-1:1:(e.orden=p,e.sentido=1),b()}),P(f,"[data-nuevo]",()=>h(null,"Nuevo gasto/ingreso",b)),P(f,"[data-editar]",v=>{const p=t.store.get("expenses").find(S=>S._id===v.getAttribute("data-editar"));p&&h(p,"Editar",b)}),P(f,"[data-duplicar]",v=>{const p=t.store.get("expenses").find(w=>w._id===v.getAttribute("data-duplicar"));if(!p)return;const{_id:S,...I}=p;h({...I,concepto:`${p.concepto} (copia)`},"Duplicar movimiento",b)}),P(f,"[data-borrar]",v=>{Z("¿Eliminar?")&&(t.store.removeItem("expenses",v.getAttribute("data-borrar")),R("Eliminado"),o(),b())}),U(f,"[data-activo]",v=>{const p=v;t.store.updateItem("expenses",p.getAttribute("data-activo"),{activo:p.checked}),o(),b()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:yn,mount(f){const b=()=>m(f);m(f),f.dataset.wired!=="1"&&(M(f,b),f.dataset.wired="1")}}}function ue(t,a,e){return t.reduce((o,s)=>{if(s.esAmortizacion)return o;const n=dt(a,e,s.fecha);return o+(n>0?s.interes/n:s.interes)},0)}function eo(t,a,e,o){return t.reduce((s,n)=>{const i=dt(a,e,n.fecha),r=n.esAmortizacion?n.amortizacion+n.comisionAmort:n.cuota;return s+(i>0?r/i:r)},0)+o}function In(t,a,e){const o=t.amortizaciones||[];return o.map((s,n)=>{const i=tt({...t,amortizaciones:o.slice(0,n)}),r=tt({...t,amortizaciones:o.slice(0,n+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:ue(i.tabla,a,e)-ue(r.tabla,a,e)}})}const Be=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${c(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function An(t,a){const e=aa(t),o=(t.amortizaciones||[]).length>0,s=a.periodos.length>0,n=a.usarInflacion&&s,i=s?oa(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=s?sa(t.tin||0,i):null,u=o&&s?In(t,a.periodos,a.hoy):[],l=u.length?ue(e.sinAmort.tabla,a.periodos,a.hoy)-ue(e.tabla,a.periodos,a.hoy):null,x=l===null?null:l-e.costeTotalAmort,m=n?eo(e.tabla,a.periodos,a.hoy,e.comAp):null,d=n&&o?eo(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${c(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${c(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(0,229,160,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(t.tags||[]).map(g=>`<span class="tag">${c(g)}</span>`).join("")}
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
        ${Be("Cuota mensual",c(E(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${c(E(a.cuotaMes))}</div>`:"")}
        ${Be("Total intereses",c(E(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(E(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${c(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Be("Total pagado",c(E(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${c(E(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${c(Xe(e.tae))}</div></div>
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
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${c(E(e.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${c(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${c(he(t.diaPago))}</div></div>`:""}
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
               ${l!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${c(E(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${c(E(l))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${c(E(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${c(E(e.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(x??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${c(E(x??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${c(E(e.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${c(E(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${c(E(e.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${m!==null?Mn(t,e.totalPagado,m,d):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${n?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(g=>Sn(g,n,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((g,h)=>wn(t._id,g,u[h]??null,a)).join("")}`:""}
    </div>
  </div>`}function Mn(t,a,e,o){const s=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,u=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${c(E(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${c(E(e))}</div></div>
        <div><div class="stat-label">${u?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${u?"pos":"neg"}">${u?"−":"+"}${c(E(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${s}
    </div>`}const n=a-e,i=n>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${c(E(a))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${c(E(e))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${c(E(Math.abs(n)))}</div></div>
    </div>
    ${s}
  </div>`}function Sn(t,a,e){let o="";if(a&&!t.esAmortizacion){const s=dt(e.periodos,e.hoy,t.fecha);o=c(E(s>0?t.cuota/s:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":c(t.mes)}</td>
    <td class="num">${c(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":c(E(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${c(E(t.interes))}</td>
    <td class="num">${c(E(t.amortizacion))}</td>
    <td class="num">${c(E(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function wn(t,a,e,o){const s=(a.escenarioIds||[]).map(n=>`<span class="badge badge-yellow">🔭 ${c(o.nombreEscenario(n))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${c(a.fecha)}</span>
    <span class="num">${c(E(a.cantidad))}</span>
    <span class="badge ${a.simulacion?"badge-sim":"badge-active"}">${a.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${a.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${s}
    ${e?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${c(E(e.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${c(E(e.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${c(t)}|${c(a._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${c(t)}|${c(a._id)}">✕</button>
  </div>`}const K=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${c(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,Nt=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${c(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([s,n])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(n)}</option>`).join("")}
   </select></div>`,te=(t,a,e,o="")=>`<label class="form-label">${c(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${c(o)}</span>`:""}`;function ee(t,a,e){return t.length===0?"":`<div class="form-group mt-8"><label class="form-label">Escenarios</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${t.map(o=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${a.includes(o._id)?c(o.color||"var(--accent)"):"var(--border)"}">
            <input type="checkbox" class="${c(e)}" value="${c(o._id)}"${a.includes(o._id)?" checked":""}/>
            ${c(o.nombre)}
          </label>`).join("")}
    </div></div>`}const Cn=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${c(e._id)}"${e._id===a?" selected":""}>${c(e.nombre)}</option>`).join("");function Fn(t,a,e,o=V()){return`
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
            <select class="form-select" id="f-cuenta">${Cn(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${Xa(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Nt("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
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
          ${te("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${ee(e,(t==null?void 0:t.escenarioIds)??[],"loan-escenario")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${te("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${te("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${te("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function zn(t,a,e,o=V()){return`
    <div class="grid-2">
      ${K("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??o)}
      ${K("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Nt("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(a==null?void 0:a.tipo)??"cuota")}
    </div>
    ${ee(e,(a==null?void 0:a.escenarioIds)??[],"amort-escenario")}
    <div class="form-row mt-8">
      ${te("am-sim","Simulación",!!(a!=null&&a.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${c(t)}|${c((a==null?void 0:a._id)??"")}">${a?"Guardar cambios":"Añadir"}</button>
    </div>`}const ao="opt_",oo=t=>String(t).startsWith(ao);function En(t){let a=null,e=null;const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content");function n(y,A){const v=o(),p=s();return!v||!p?null:(p.innerHTML=`<div class="modal-title">${c(y)}</div>${A}`,v.classList.remove("hidden"),p)}const i=()=>{var y;return(y=o())==null?void 0:y.classList.add("hidden")};function r(){let y=!1;for(const A of t.loans()){const v=(A.amortizaciones||[]).filter(p=>!oo(p._id));v.length!==(A.amortizaciones||[]).length&&(t.guardarAmortizaciones(A._id,v),y=!0)}return y}function u(y){try{return y()}catch(A){return R(A instanceof Error?A.message:"No se ha podido completar el cálculo","err"),null}}function l(){var w,C;if(!Fa("optimizador")){R("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const y=t.loans().filter(F=>F.activo&&!F.simulacion);if(y.length===0){R("No hay préstamos activos para optimizar","err");return}const A=t.config(),v=t.accounts().filter(F=>F.activo&&!F.simulacion),p=((w=v.find(F=>F.esCuentaPrincipal))==null?void 0:w._id)??((C=v[0])==null?void 0:C._id)??"",S=A.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,I=n("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${v.map(F=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${c(F._id)}"${F._id===p?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(F.nombre)}${F._id===p?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${c(E(it(F)))}</span>
              </label>`).join("")||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${y.map(F=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
              <input type="checkbox" class="opt-loan-check" value="${c(F._id)}"${F.tin>=5?" checked":""} style="accent-color:var(--accent)"/>
              <span style="font-size:13px;flex:1">${c(F.nombre)}</span>
              <span class="badge badge-yellow" style="font-size:11px">${c(F.tin)}% TIN</span>
            </label>`).join("")}
      </div>
      <button class="btn-secondary btn-sm mb-12" data-opt-todos>Seleccionar todo</button>

      <div class="grid-2" style="gap:10px">
        ${K("opt-horizonte","Horizonte (meses)","number",60,"60")}
        ${K("opt-frecuencia","Frecuencia manual (cada N meses)","number",1,"1")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${K("opt-min","Importe mínimo por amortización (€)","number",500,"500")}
        ${Nt("opt-tipo","Efecto de la amortización",[["plazo","Reducir plazo (mantener cuota)"],["cuota","Reducir cuota (mantener plazo)"]],"plazo")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${K("opt-fecha-primera","Fecha primera amortización","date","")}
        ${K("opt-fecha-obj","Fecha objetivo para comparar saldo","date",S)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);I&&(x(I),U(I,".opt-acc-radio",()=>x(I)),P(I,"[data-opt-todos]",()=>{const F=[...I.querySelectorAll(".opt-loan-check")],z=F.every(j=>j.checked);F.forEach(j=>j.checked=!z)}),P(I,"[data-cancelar]",i),P(I,"[data-opt-calcular]",()=>h(I)),P(I,"[data-opt-comparar]",()=>$(I)))}function x(y){var I;const A=(I=y.querySelector(".opt-acc-radio:checked"))==null?void 0:I.value,p=(t.config().margenesSeguridad||[]).filter(w=>w.activo!==!1).filter(w=>!w.cuentas||w.cuentas.length===0||A&&w.cuentas.includes(A)),S=y.querySelector("#opt-margenes-wrap");S&&(S.innerHTML=p.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':p.map(w=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${c(w._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(w.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!w.cuentas||w.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function m(y){var S,I,w,C;const A=(F,z,j=0)=>{var D;const _=parseFloat(((D=y.querySelector(F))==null?void 0:D.value)??"");return Number.isFinite(_)?Math.max(j,_):z},v=[...y.querySelectorAll(".opt-loan-check")],p=v.filter(F=>F.checked).map(F=>F.value);return{horizonte:Math.round(A("#opt-horizonte",60,1)),frecuencia:Math.round(A("#opt-frecuencia",1,1)),minAmortizable:A("#opt-min",500),tipoAmort:((S=y.querySelector("#opt-tipo"))==null?void 0:S.value)||"plazo",fechaObjetivo:((I=y.querySelector("#opt-fecha-obj"))==null?void 0:I.value)||null,fechaPrimeraAmort:((w=y.querySelector("#opt-fecha-primera"))==null?void 0:w.value)||null,loanIds:v.length===0||p.length===v.length?null:p,sourceAccountId:((C=y.querySelector(".opt-acc-radio:checked"))==null?void 0:C.value)??null,selectedMarginIds:[...y.querySelectorAll(".opt-margin-check:checked")].map(F=>F.value)}}const d=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function g(y,A=""){const v=n("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${c(y)}</div>
        ${A?`<div class="text-sm mt-8" style="color:var(--text3)">${c(A)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);v&&(P(v,"[data-opt-volver]",l),P(v,"[data-cancelar]",i))}function h(y){const A=m(y);r()&&R("Plan anterior eliminado, recalculando…");const{loans:v,expenses:p,accounts:S,config:I,nominas:w}=d(),C=u(()=>je(v,p,S,I,{frecuencia:A.frecuencia,mesesHorizonte:A.horizonte,minAmortizable:A.minAmortizable,tipoAmort:A.tipoAmort,fechaPrimeraAmort:A.fechaPrimeraAmort,loanIds:A.loanIds,nominas:w,sourceAccountId:A.sourceAccountId,selectedMarginIds:A.selectedMarginIds}));if(!C)return;if(C.plan.length===0){g(`No hay excedente suficiente respetando los ${C.margenesAplicados} márgenes de seguridad activos en los próximos ${A.horizonte} meses para generar amortizaciones por encima del mínimo de ${E(A.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}e={plan:C.plan,tipoAmort:A.tipoAmort};const F=`✨ Plan de optimización · ${A.frecuencia===1?"Mensual":`Cada ${A.frecuencia} meses`} · ${A.horizonte}m`,z=n(F,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(E(C.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${c(E(C.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${c(E(C.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${C.margenesAplicados}</div></div>
      </div>
      ${C.resumenPorLoan.map(no).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${C.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${C.plan.map(j=>so(j,!0)).join("")}</tbody>
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
      </div>`);z&&(P(z,"[data-opt-volver]",l),P(z,"[data-cancelar]",i),P(z,"[data-opt-aplicar]",()=>{e&&f(e.plan,e.tipoAmort)}))}function $(y){const A=m(y);r();const{loans:v,expenses:p,accounts:S,config:I,nominas:w}=d(),C=u(()=>ja(v,p,S,I,{horizonte:A.horizonte,minAmortizable:A.minAmortizable,tipoAmort:A.tipoAmort,fechaObjetivo:A.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:A.fechaPrimeraAmort,loanIds:A.loanIds,nominas:w,sourceAccountId:A.sourceAccountId,selectedMarginIds:A.selectedMarginIds}));if(!C)return;if(C.resultados.length===0){g("No hay excedente suficiente en ninguna frecuencia.");return}a=C;const{resultados:F,saldoBase:z,fechaObjetivo:j}=C,_=F.map(N=>{const B=[N.esMejorIntereses&&"💰 +intereses",N.esMejorSaldo&&"🏦 +saldo",N.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${N.esMejorValor?"background:rgba(0,229,160,0.06);":""}">
          <td style="font-weight:600">${c(N.label)}</td>
          <td class="num">${N.numAmortizaciones}</td>
          <td class="num neg">${c(E(N.totalAmortizado))}</td>
          <td class="num pos">${c(E(N.ahorroIntereses))}</td>
          <td class="num ${N.saldoObjetivo>=z?"pos":"neg"}">${c(E(N.saldoObjetivo))}</td>
          <td class="num pos">${c(E(N.valorTotal))}</td>
          <td style="font-size:11px">${B}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${N.frecuencia}">Usar</button></td>
        </tr>`}).join(""),D=n(`📊 Comparativa de frecuencias · hasta ${j}`,`
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${c(j)}: <strong>${c(E(z))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${c(j.slice(0,7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${_}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);D&&(P(D,"[data-opt-volver]",l),P(D,"[data-cancelar]",i),P(D,"[data-opt-usar]",N=>M(Number(N.getAttribute("data-opt-usar")))))}function M(y){var v;const A=a==null?void 0:a.resultados.find(p=>p.frecuencia===y);A&&(r(),f(A.plan,((v=A.plan[0])==null?void 0:v.tipoAmort)||"plazo",{titulo:`✨ Plan ${A.label} · aplicado`,resumen:A,fechaObjetivo:a==null?void 0:a.fechaObjetivo}))}function f(y,A,v){if(y.length===0)return;const p=new Map;for(const I of y){const w=p.get(I.loanId)??[];w.push({_id:`${ao}${I.mes}_${I.loanId}`,fecha:I.fechaAmort,cantidad:I.cantidadAmort,tipo:A,simulacion:!0}),p.set(I.loanId,w)}let S=0;for(const I of t.loans()){const w=p.get(I._id);if(!w)continue;const C=(I.amortizaciones||[]).filter(F=>!oo(F._id));t.guardarAmortizaciones(I._id,[...C,...w]),S+=1}R(`Plan aplicado: ${y.length} amortizaciones en ${S} préstamo${S!==1?"s":""} (simulación)`),v?b(v):i(),t.refrescar([...p.keys()])}function b({titulo:y,resumen:A,fechaObjetivo:v}){const p=n(y,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(E(A.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${c(E(A.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${c((v==null?void 0:v.slice(0,7))??"")}</div><div class="stat-value pos">${c(E(A.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${c(E(A.totalComisiones))}</div></div>
      </div>
      ${A.resumenPorLoan.map(no).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${A.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${A.plan.map(S=>so(S,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);p&&P(p,"[data-cancelar]",i)}return{abrir:l,get planManual(){return e},get comparativa(){return a}}}function so(t,a){const e=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${c(E(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${c(t.mes)}</td>
    <td>${c(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${c(E(t.capitalAntes))}</td>
    <td class="num neg">${c(E(t.cantidadAmort))}${e}</td>
    <td class="num">${c(E(t.capitalDespues))}</td>
    ${a?`<td class="num" style="color:var(--text3)">${c(E(t.saldoDisponible))} → ${c(E(t.saldoDespues))}</td>`:""}
  </tr>`}function no(t){return`<div class="card mb-8" style="padding:12px">
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
  </div>`}const jn="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function _n(t){const a=t.hoy??V;let e=!1;const o=new Set;let s=null;const n=()=>{var v;return(v=t.onDatosCambiados)==null?void 0:v.call(t)},i=()=>t.store.get("escenarios"),r=v=>{var p;return((p=i().find(S=>S._id===v))==null?void 0:p.nombre)??v};function u(v){if(!v.activo||v.simulacion)return!1;const p=tt(v).tabla.filter(S=>!S.esAmortizacion);return p.length===0?!0:p[p.length-1].fecha<a()}function l(v,p){const S=a(),I=S.slice(0,7),w=new Map;let C=0;for(const F of v){if(!F.activo||F.simulacion||p.has(F._id)||(F.fechaInicio||"")>S)continue;const z=tt(F).tabla.filter(_=>!_.esAmortizacion&&_.fecha.startsWith(I)),j=z.length>0?z[0].cuota:0;w.set(F._id,j),C+=j}return{porLoan:w,total:C,activos:[...w.values()].filter(F=>F>0).length}}function x(v){const p=t.store.get("config"),S=p.dashboardStart,I=p.dashboardEnd,w=Math.max(1,(L(I).getTime()-L(S).getTime())/(30.44*864e5));let C=0;for(const F of v)!F.activo||F.simulacion||(C+=tt(F).tabla.filter(z=>!z.esAmortizacion&&z.fecha>=S&&z.fecha<=I).reduce((z,j)=>z+j.cuota,0));return{media:C/w,desde:S,hasta:I}}function m(v){const p=[...t.store.get("loans")].sort((_,D)=>D.tin-_.tin),S=new Set(p.filter(u).map(_=>_._id)),I=e?p:p.filter(_=>!S.has(_._id)),w=l(p,S),C=x(p),F=t.store.get("config"),z=t.store.get("inflacion"),j=new Date(L(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});v.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${S.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${S.size})</button>`:""}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${w.total>0||C.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${w.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${c(j)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${c(E(w.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${w.activos} préstamo${w.activos!==1?"s":""} activo${w.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${C.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${c(E(C.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${c(C.desde)} → ${c(C.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${I.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':I.map(_=>An(_,{periodos:z,usarInflacion:!!F.usarInflacion,hoy:a(),cuotaMes:w.porLoan.get(_._id)??0,completado:S.has(_._id),nombreEscenario:r})).join("")}
      </div>`;for(const _ of v.querySelectorAll("[data-body-loan]"))o.has(_.dataset.bodyLoan??"")&&_.classList.add("open")}const d=()=>document.getElementById("modal-overlay"),g=()=>document.getElementById("modal-content"),h=()=>{var v;return(v=d())==null?void 0:v.classList.add("hidden")};function $(v,p){const S=d(),I=g();return!S||!I?null:(I.innerHTML=`<div class="modal-title">${c(v)}</div>${p}`,S.classList.remove("hidden"),P(I,"[data-cancelar]",h),I)}function M(v,p){const S=v?t.store.get("loans").find(w=>w._id===v)??null:null,I=$(v?"Editar préstamo":"Nuevo préstamo",Fn(S,t.store.get("accounts"),i(),a()));I&&(I.addEventListener("change",w=>{var C;(C=w.target)!=null&&C.matches("[data-dp-modo]")&&Za(I)}),P(I,"[data-guardar-loan]",w=>{f(I,w.getAttribute("data-guardar-loan")||"")&&(h(),p())}))}function f(v,p){const S=_=>{var D;return((D=v.querySelector(_))==null?void 0:D.value)??""},I=_=>{var D;return!!((D=v.querySelector(_))!=null&&D.checked)},w=S("#f-nombre").trim(),C=parseFloat(S("#f-capital")),F=parseFloat(S("#f-tin")),z=parseInt(S("#f-meses"),10);if(!w||!Number.isFinite(C)||!Number.isFinite(F)||!Number.isFinite(z))return R("Completa los campos obligatorios","err"),!1;const j={nombre:w,capital:C,tin:F,meses:z,fechaInicio:S("#f-fecha"),comisionApertura:parseFloat(S("#f-com-ap"))||0,comisionAmort:parseFloat(S("#f-com-am"))||0,diaPago:to(v),cuenta:S("#f-cuenta"),simulacion:I("#f-sim"),activo:I("#f-activo"),mostrarFechaFinEnDashboard:I("#f-mostrar-fin"),tipoTasa:S("#f-tipo-tasa"),basico:I("#f-basico"),tags:S("#f-tags").split(",").map(_=>_.trim()).filter(Boolean),escenarioIds:[...v.querySelectorAll(".loan-escenario:checked")].map(_=>_.value)};return p?(t.store.updateItem("loans",p,j),R("Préstamo actualizado")):(t.store.addItem("loans",{...j,amortizaciones:[]}),R("Préstamo creado")),n(),!0}function b(v,p,S){const I=t.store.get("loans").find(F=>F._id===v);if(!I)return;const w=p?(I.amortizaciones||[]).find(F=>F._id===p)??null:null,C=$(p?"Editar amortización":"Añadir amortización",zn(v,w,i(),a()));C&&P(C,"[data-guardar-amort]",F=>{const[z,j]=(F.getAttribute("data-guardar-amort")||"").split("|");y(C,z,j)&&(h(),S([z]))})}function y(v,p,S){var D;const I=N=>{var B;return((B=v.querySelector(N))==null?void 0:B.value)??""},w=I("#am-fecha"),C=parseFloat(I("#am-cant"));if(!w||!Number.isFinite(C)||C<=0)return R("Fecha y cantidad requeridas","err"),!1;const F=t.store.get("loans").find(N=>N._id===p);if(!F)return!1;const z={fecha:w,cantidad:C,tipo:I("#am-tipo"),simulacion:!!((D=v.querySelector("#am-sim"))!=null&&D.checked),escenarioIds:[...v.querySelectorAll(".amort-escenario:checked")].map(N=>N.value)},j=F.amortizaciones||[],_=S?j.map(N=>N._id===S?{...N,...z}:N):[...j,{_id:Date.now().toString(36),...z}];return t.store.updateItem("loans",p,{amortizaciones:_}),R(S?"Amortización actualizada":"Amortización añadida"),n(),!0}function A(v,p,S){P(v,"[data-toggle-finalizados]",()=>{e=!e,p()}),P(v,"[data-nuevo-loan]",()=>M(null,p)),P(v,"[data-optimizar]",()=>S.abrir()),P(v,"[data-toggle-loan]",(I,w)=>{var j;if((j=w.target)!=null&&j.closest("button"))return;const C=I.getAttribute("data-toggle-loan"),F=[...v.querySelectorAll("[data-body-loan]")].find(_=>_.dataset.bodyLoan===C);(F==null?void 0:F.classList.toggle("open"))?o.add(C):o.delete(C)}),P(v,"[data-editar-loan]",I=>M(I.getAttribute("data-editar-loan"),p)),P(v,"[data-borrar-loan]",I=>{if(!Z("¿Eliminar préstamo?"))return;const w=I.getAttribute("data-borrar-loan");t.store.removeItem("loans",w),o.delete(w),R("Eliminado"),n(),p()}),P(v,"[data-amort-loan]",I=>{const w=I.getAttribute("data-amort-loan");o.add(w),b(w,null,p)}),P(v,"[data-editar-amort]",I=>{const[w,C]=(I.getAttribute("data-editar-amort")||"").split("|");o.add(w),b(w,C,p)}),P(v,"[data-borrar-amort]",I=>{const[w,C]=(I.getAttribute("data-borrar-amort")||"").split("|"),F=t.store.get("loans").find(z=>z._id===w);F&&(t.store.updateItem("loans",w,{amortizaciones:(F.amortizaciones||[]).filter(z=>z._id!==C)}),R("Amortización eliminada"),n(),p([w]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:jn,mount(v){const p=(S=[])=>{for(const I of S)o.add(I);m(v)};s??(s=En({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(S,I)=>{t.store.updateItem("loans",S,{amortizaciones:I}),n()},hoy:a,refrescar:p})),m(v),v.dataset.wired!=="1"&&(A(v,p,s),v.dataset.wired="1")}}}const Pn={transporte:125,restaurante:220,otros:null},Tn={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Dn=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],qt=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${c(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,Rn=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${c(e._id)}"${e._id===a?" selected":""}>${c(e.nombre)}</option>`).join("");function On(t,a){const e=t.map((n,i)=>{const r=a.find(x=>x._id===n.cuenta),u=Pn[n.tipo],l=u!=null&&n.importe>u;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${c(Tn[n.tipo]??n.tipo)}</span>
        <span style="flex:1;font-size:12px">${c(E(n.importe))}/mes${l?` <span style="color:var(--red)" title="Supera el límite orientativo de ${c(E(u))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?c(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
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
        ${o.map(n=>`<option value="${c(n._id)}">${c(n.nombre)}${(n.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${s.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function Nn(t,a){const e=a.hoy??V(),o=(t==null?void 0:t.nPagas)??12,s=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${qt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${qt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(n=>`<option value="${n}"${s&&o===n?" selected":""}>${n} pagas</option>`).join("")}
          <option value="custom"${s?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${Rn(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${qt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??e)}
          ${qt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${qt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${Dn.map((n,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${c(n)} (${i+1})</option>`).join("")}
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
          ${qt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??we).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${ee(a.escenarios,(t==null?void 0:t.escenarioIds)??[],"nom-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function io(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const u=parseFloat(e(i));return Number.isFinite(u)?u:r},s=e("#nf-npagas"),n=s==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(s,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:n,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",we),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:a}}function qn(t,a,e,o){const s=io(t,a),n=a.reduce((f,b)=>f+(b.importe||0)*12,0),i=Math.max(0,s.bruto-n),r=i*(s.ssPct/100),u=s.irpfModo==="manual"?i*(s.irpfPct/100):ct(At(s.bruto,n),e.tramos),l=i-r-u,x=i/s.nPagas,m=r/s.nPagas,d=u/s.nPagas,g=x-m-d,h=s.grupoNomina?e.nominas.filter(f=>f.grupoNomina===s.grupoNomina&&f._id!==o):[],$=h.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${c(s.grupoNomina)}" con ${c(h.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",M=n>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${c(E(n))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${c(E(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${c(E(s.bruto))}</span>
      ${M}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${c(E(r))} (${s.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${c(E(u))} (${i>0?(u/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${c(E(l))}</span>
      ${n>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${c(E(n))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${c(E(g))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${s.representacion==="simplificado"?`ingreso ${c(E(g))}/paga`:`ingreso ${c(E(x))} − SS ${c(E(m))} − IRPF ${c(E(d))}`}${n>0?" + recargas flex":""}</span>
    </div>${$}`}function Ln(t,a,e,o){const s=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=On(a,e.accounts))},n=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=qn(t,a,e,o))},i=()=>{var u,l;const r=(x,m)=>{const d=t.querySelector(x);d&&(d.style.display=m?"":"none")};r("#nf-custom-pagas-wrap",((u=t.querySelector("#nf-npagas"))==null?void 0:u.value)==="custom"),r("#nf-irpfpct-wrap",((l=t.querySelector("#nf-irpfmodo"))==null?void 0:l.value)==="manual"),n()};t.addEventListener("input",r=>{var u;(u=r.target)!=null&&u.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&n()}),U(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),P(t,"[data-flex-anadir]",()=>{var l,x,m;const r=((l=t.querySelector("#fc-tipo"))==null?void 0:l.value)||"transporte",u=parseFloat(((x=t.querySelector("#fc-importe"))==null?void 0:x.value)??"")||0;if(!u)return R("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:u,cuenta:((m=t.querySelector("#fc-cuenta"))==null?void 0:m.value)||""}),s(),n()}),P(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),s(),n()}),s(),n()}const ro=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function kn(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??vt;function r(d,g){const h=o(),$=s();return!h||!$?null:($.innerHTML=`<div class="modal-title">${c(d)}</div>${g}`,h.classList.remove("hidden"),P($,"[data-cerrar]",n),$)}function u(){a=null;const d=[...t.store.get("tramosIRPFHistorico")].sort(($,M)=>$.año-M.año),g="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",h=r("Tramos IRPF por ejercicio",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
        Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${g}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(ro(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${d.map($=>`<div style="${g}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(ro($.tramos))}</span>
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
      </div>`);h&&(P(h,"[data-editar-tabla]",$=>{const M=$.getAttribute("data-editar-tabla");m(M==="default"?"default":Number(M))}),P(h,"[data-borrar-tabla]",$=>{const M=Number($.getAttribute("data-borrar-tabla"));Z(`¿Eliminar la tabla del ejercicio ${M}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==M)),R(`Tabla ${M} eliminada`),t.onDatosCambiados(),u())}),P(h,"[data-anadir-anyo]",()=>{var f;const $=parseInt(((f=h.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!$||$<2e3||$>2100)return R("Año inválido","err");const M=t.store.get("tramosIRPFHistorico");if(M.some(b=>b.año===$))return R("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...M,{_id:Date.now().toString(36),año:$,tramos:i().map(b=>[...b])}]),t.onDatosCambiados(),m($)}))}function l(){return e.map(([d,g],h)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${h}" value="${d}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${h}" value="${g}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${h}">✕</button>
          </div>
        </div>`).join("")}function x(d){e=[...d.querySelectorAll("[data-tr-min]")].map((h,$)=>{const M=d.querySelector(`[data-tr-pct="${$}"]`);return[parseFloat(h.value)||0,parseFloat((M==null?void 0:M.value)??"")||0]})}function m(d){var b;a=d;const g=t.store.get("tramosIRPFHistorico");e=(d==="default"?i():((b=g.find(y=>y.año===d))==null?void 0:b.tramos)??i()).map(y=>[...y]);const $=d==="default"?"tabla por defecto":`ejercicio ${d}`,M=r(`Tramos IRPF — ${d==="default"?"Por defecto":d}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${c($)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!M)return;const f=()=>{const y=M.querySelector("#irpf-tramos-rows");y&&(y.innerHTML=l())};P(M,"[data-volver]",u),P(M,"[data-tr-anadir]",()=>{x(M),e.push([0,0]),f()}),P(M,"[data-tr-borrar]",y=>{x(M),e.splice(Number(y.getAttribute("data-tr-borrar")),1),f()}),P(M,"[data-tr-guardar]",()=>{x(M);const y=[...e].sort((A,v)=>A[0]-v[0]);if(y.length===0)return R("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:y}),R("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(A=>A.año===a?{...A,tramos:y}:A)),R(`Tabla ${a} guardada`)),t.onDatosCambiados(),u()})}return{abrir:u}}const lo=1500,Et=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${c(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,Bn=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${c(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([s,n])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(n)}</option>`).join("")}
   </select></div>`,Hn=t=>(t.modeloFondo||"cuenta")==="pension";function Gn(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(s=>Vn(s,a,e,o)).join("")}</div>`}function Vn(t,a,e,o){const s=le(t);if(!s)return"";const n=Se(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(l=>l.fecha>=`${i}-01-01`).reduce((l,x)=>l+x.cantidad,0),u=Math.min(r,lo)*(n/100);return`<div class="card">
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
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${c(E(s.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(E(s.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${s.beneficio>=0?"pos":"neg"}">${c(E(s.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(E(s.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(E(s.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>lo?"neg":""}">${c(E(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${c(E(u))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${c(t.grupoNomina)}": ${n}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${s.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${c(s.proxDesbloqueo)}</div>`:""}
  </div>`}function Un(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${c(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${c(E(e.importe))} / ${c(e.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${c(e.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Yn(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,s=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],n=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${Et("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${Et("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Et("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${Et("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${Et("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${Bn("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${Et("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${n?' style="display:none"':""}>
        ${Et("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
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
    ${ee(a.escenarios,(t==null?void 0:t.escenarioIds)??[],"pen-escenario")}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Jn(t,a,e){const o=()=>{const s=t.querySelector("#pen-aport-container");s&&(s.innerHTML=Un(a))};U(t,"#pen-grupo",s=>{const n=t.querySelector("#pen-impuesto-wrap");n&&(n.style.display=s.value?"none":"")}),P(t,"[data-aport-anadir]",()=>{var n,i,r,u;const s=parseFloat(((n=t.querySelector("#paport-importe"))==null?void 0:n.value)??"")||0;if(!s)return R("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((u=t.querySelector("#paport-fin"))==null?void 0:u.value)||""}),o()}),P(t,"[data-aport-borrar]",s=>{a.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function Wn(t,a,e,o){var M;const s=f=>{var b;return((b=t.querySelector(f))==null?void 0:b.value)??""},n=(f,b=0)=>{const y=parseFloat(s(f));return Number.isFinite(y)?y:b},i=f=>{var b;return!!((b=t.querySelector(f))!=null&&b.checked)},r=s("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const u=n("#pen-saldo"),l=s("#pen-grupo"),x={nombre:r,grupoNomina:l,saldo:u,saldoInicial:n("#pen-saldo-ini"),fechaInicialSaldo:s("#pen-fecha-ini")||o,interes:n("#pen-interes"),periodoCobro:s("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(s("#pen-bloqueo"),10)||120,impuestoRetirada:l?0:n("#pen-impuesto"),planAportaciones:a,descripcion:s("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(f=>f.value)},m=[...(e==null?void 0:e.historicoSaldos)??[]],d=[...(e==null?void 0:e.aportaciones)??[]],h=((M=[...m].sort((f,b)=>b.fecha.localeCompare(f.fecha))[0])==null?void 0:M.saldo)??(e==null?void 0:e.saldo)??null,$=Date.now().toString(36);return e?(h===null||Math.abs(u-h)>.005)&&(m.push({_id:$,fecha:o,saldo:u,nota:"Actualización manual"}),u>(h??0)&&d.push({_id:`${$}a`,fecha:o,cantidad:u-(h??0)})):u>0&&(m.push({_id:$,fecha:o,saldo:u,nota:"Saldo inicial"}),d.push({_id:`${$}a`,fecha:x.fechaInicialSaldo??o,cantidad:u})),{datos:{...x,historicoSaldos:m,aportaciones:d}}}const Qn="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Kn(t){const a=t.hoy??V,e=()=>{var M;return(M=t.onDatosCambiados)==null?void 0:M.call(t)};function o(){const M=t.store.get("config");return gt(t.store.get("tramosIRPFHistorico"),M.tramos_irpf??vt)(Number(a().slice(0,4)))}function s(M,f,b){const y=Fe(M,f,b),A=!!f&&M.irpfModo!=="manual",v=[M.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${M.mesActualizacionIPC}">IPC m${M.mesActualizacionIPC}</span>`:"",y.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${c(E(y.flexAnual))}/año</span>`:"",Math.abs(y.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${y.ssPct.toFixed(2)}%</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(M.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${v}</div>
      </div>
      <div class="num">${c(E(y.brutoAnual))}
        ${y.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${c(E(y.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${c(E(y.netoPorPaga))}/paga neto</div></div>
      <div class="text-sm">${y.nPagas} pagas</div>
      <div class="text-sm ${A?"neg":""}">${M.irpfModo==="manual"?`${c(M.irpfPct??0)}% (manual)`:`${y.irpfPct.toFixed(1)}% (auto)`}${A?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${M.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${c(n(M.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${c(M._id)}"${M.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${c(M._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${c(M._id)}">✕</button>
      </div>
    </div>`}const n=M=>{var f;return((f=t.store.get("accounts").find(b=>b._id===(M||"default")))==null?void 0:f.nombre)??(M||"default")};function i(M,f,b){const y=f.reduce((p,S)=>p+(S.bruto||0),0),A=Ho(f,b),v=y>0?A/y*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${c(M)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${c(E(y))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${v.toFixed(1)}%</strong> (${c(E(A))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${f.map(p=>s(p,f,b)).join("")}
      </div>
    </div>`}function r(M){const f=o(),b=[...t.store.get("nominas")].sort((S,I)=>(I.bruto||0)-(S.bruto||0)),{grupos:y,sueltas:A}=Vo(b),v=t.store.get("accounts").filter(Hn),p=b.filter(S=>S.activo!==!1);M.innerHTML=`
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
      ${[...y.entries()].map(([S,I])=>i(S,I,f)).join("")}
      ${A.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${A.map(S=>s(S,null,f)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Gn(v,p,f,a())}</div>`}const u=()=>document.getElementById("modal-overlay"),l=()=>document.getElementById("modal-content"),x=()=>{var M;return(M=u())==null?void 0:M.classList.add("hidden")};function m(M,f){const b=u(),y=l();return!b||!y?null:(y.innerHTML=`<div class="modal-title">${c(M)}</div>${f}`,b.classList.remove("hidden"),P(y,"[data-cancelar]",x),y)}function d(M,f){const b=M?t.store.get("nominas").find(p=>p._id===M)??null:null,y=[...(b==null?void 0:b.retribucionFlexible)??[]].map(p=>({...p})),A={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:o(),hoy:a()},v=m(M?"Editar nómina":"Nueva nómina",Nn(b,A));v&&(Ln(v,y,A,M??""),P(v,"[data-guardar-nomina]",p=>{const S=io(v,y);if(!S.nombre||S.bruto<=0)return R("Nombre y bruto anual son obligatorios","err");const I=p.getAttribute("data-guardar-nomina")||"",w={...S,activo:!0,tags:["nomina"]};I?(t.store.updateItem("nominas",I,w),R("Nómina actualizada")):(t.store.addItem("nominas",w),R("Nómina creada")),e(),x(),f()}))}function g(M,f){const b=M?t.store.get("accounts").find(v=>v._id===M)??null:null,y=[...(b==null?void 0:b.planAportaciones)??[]].map(v=>({...v})),A=m(M?"Editar plan de pensiones":"Nuevo plan de pensiones",Yn(b,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:a()}));A&&(Jn(A,y,a()),P(A,"[data-guardar-pension]",v=>{const{datos:p,error:S}=Wn(A,y,b,a());if(S)return R(S,"err");const I=v.getAttribute("data-guardar-pension")||"";I?(t.store.updateItem("accounts",I,p),R("Plan actualizado")):(t.store.addItem("accounts",p),R("Plan creado")),e(),x(),f()}))}function h(M,f,b){P(M,"[data-nueva-nomina]",()=>d(null,f)),P(M,"[data-editar-nom]",y=>d(y.getAttribute("data-editar-nom"),f)),P(M,"[data-borrar-nom]",y=>{Z("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",y.getAttribute("data-borrar-nom")),R("Eliminada"),e(),f())}),U(M,"[data-activo-nom]",y=>{const A=y;t.store.updateItem("nominas",A.getAttribute("data-activo-nom"),{activo:A.checked}),e(),f()}),P(M,"[data-tramos]",()=>b.abrir()),P(M,"[data-nueva-pension]",()=>g(null,f)),P(M,"[data-editar-pension]",y=>g(y.getAttribute("data-editar-pension"),f)),P(M,"[data-borrar-pension]",y=>{Z("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",y.getAttribute("data-borrar-pension")),R("Plan eliminado"),e(),f())})}let $=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Qn,mount(M){const f=()=>r(M);$??($=kn({store:t.store,onDatosCambiados:()=>{e(),f()},año:()=>Number(a().slice(0,4))})),r(M),M.dataset.wired!=="1"&&(h(M,f,$),M.dataset.wired="1")}}}const Xn="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Zn="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",co={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},ti={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function ei(t,a){const e=t.filter(u=>u.activo&&ut(u)==="inversion");if(e.length===0)return"";let o=0,s=0,n=0,i=0;for(const u of e){const l=Tt(u,a);l&&(o+=l.saldo,s+=l.costBase,n+=l.plusvalia,i+=l.impuesto)}const r=s>0?(n/s*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${c(E(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${c(E(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${c(r)}%)</div><div class="stat-value ${n>=0?"pos":"neg"}">${c(E(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${c(E(i))}</div><div class="stat-sub">Neto: ${c(E(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function ai(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,s=Math.max(1,(L(o).getTime()-L(e).getTime())/(30.44*864e5)),n=Ht(t,e),i=n*(Math.pow(1+t.interes/100,s/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const u=n*(dt(a.inflacion,e,o)-1),l=i-u;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${c(E(u))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${l>=0?"var(--accent)":"var(--red)"};font-weight:600">${c(E(l))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${c(e.slice(0,7))} → ${c(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${c(E(i))}</span>
    </div>${r}
  </div>`}function oi(t,a){const e=co[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,s=a.nominas.flatMap(g=>(g.retribucionFlexible??[]).filter(h=>h.cuenta===t._id).map(h=>({nomina:g,importe:h.importe}))),n=s.reduce((g,h)=>g+h.importe,0),i=n*12,r=o!==null&&i>o,u=o!==null?Math.min(i,o):i,l=t.grupoNomina?a.nominas.filter(g=>(g.grupoNomina||"")===t.grupoNomina&&g.activo!==!1):s.slice(0,1).map(g=>g.nomina),x=pa(l,a.tramosIRPF),m=u*x/100,d=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${x}%`:`tipo marginal ${x}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${c(e.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${c(E(n))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${c(E(i))}/año${r?` ⚠ excede límite ${c(E(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${c(E(o))}/año</span></div>`:""}
    ${m>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${c(d)}">≈ ${c(E(m))}/año <span style="font-size:10px;color:var(--text3)">(${c(x)}%)</span></span></div>`:""}
    ${s.length>0?s.map(g=>`<div style="font-size:11px;color:var(--text3)">↩ ${c(g.nomina.nombre)}: ${c(E(g.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function si(t){const a=le(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(E(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(E(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${c(E(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${c(E(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${c(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${c(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function ni(t,a){const e=Tt(t,a.tramosGanancias);if(!e)return"";const o=a.config,s=a.flujos(t._id),n=L(o.dashboardStart),i=L(o.dashboardEnd),r=Math.max(0,(i.getTime()-n.getTime())/(30.44*864e5)),u=e.saldo+s.totalAportaciones-s.totalReembolsos,l=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,x=u>0&&r>0?Math.max(0,u*Math.pow(1+l,r)):Math.max(0,u),m=e.costBase+s.totalAportaciones,d=Math.max(0,x-m),g=Me(d,a.tramosGanancias),h=d>0?(g/d*100).toFixed(1):"0",$=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",M=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",f=(S,I,w)=>S.map(C=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${I} ${c(C.contraparte)}: ${c(C.concepto)}</span>
          <span class="num ${w}">${c(E(C.total))} · ${C.ocurrencias} mov.</span>
        </div>`).join(""),y=s.entradas.length>0||s.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${c(o.dashboardStart.slice(0,7))} → ${c(o.dashboardEnd.slice(0,7))})</div>
         ${f(s.entradas,"↓","pos")}
         ${f(s.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${s.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${c(E(s.totalAportaciones))}</span></div>`:""}
           ${s.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${c(E(s.totalReembolsos))}</span></div>`:""}
           ${s.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${c(E(s.retencion))}</span></div>`:s.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',A=a.invModo(t._id),v=S=>`padding:3px 10px;border-radius:20px;border:1px solid ${S?"var(--accent)":"var(--border)"};background:${S?"var(--accent-dim)":"transparent"};color:${S?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,p=A==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(E(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${c(E(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${c(E(e.neto))}</div><div class="stat-sub">${c(M)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${c(E(m))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${c(E(x))}</div><div class="stat-sub">${c($)} · ${c(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${c(E(x-g))}</div><div class="stat-sub">${c(h)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${c(t._id)}|real" style="${v(A==="real")}">Real</button>
          <button data-inv-modo="${c(t._id)}|proyeccion" style="${v(A==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${p}
      ${y}
    </div>`}function ii(t,a){const e=[...t.historicoSaldos||[]].sort((u,l)=>l.fecha.localeCompare(u.fecha)),o=e[0],s=it(t),n=ut(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",n==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",n==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",n==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${c((co[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(u=>`<span class="badge badge-yellow">🔭 ${c(a.nombreEscenario(u))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${c(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${c(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${c(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Zn}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Xn}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${c(E(t.saldoInicial||0))}</div><div class="stat-sub">${c(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${c(E(s))}</div>${o?`<div class="stat-sub">Registro: ${c(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${c(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${c(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${ai(t,a)}
    ${n==="beneficio"?oi(t,a):""}
    ${n==="pension"?si(t):""}
    ${n==="inversion"?ni(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${c(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${c(t.descripcion)}</div>`:""}
  </div>`}const ri=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function li(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${c(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${c(E(e.importe))} / ${c(e.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${c(e.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function ci(t,a){const e=t?ut(t):"cuenta",o=[...new Set(a.nominas.filter(n=>n.grupoNomina).map(n=>n.grupoNomina))],s=n=>n?"":' style="display:none"';return`
    <div class="grid-2">
      ${K("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Nt("ac-modelo","Tipo",ri,e)}
    </div>
    <div class="grid-2 mt-8">
      ${K("ac-saldo","Saldo actual (€)","number",a.saldoActual,"5000")}
      ${K("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${K("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${K("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="form-row mt-8">
      <label class="form-label">Activa</label>
      <label class="toggle"><input type="checkbox" id="ac-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
    </div>

    <details class="form-advanced mt-12"${t?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="mt-8">
          ${Nt("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${Nt("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
        ${ee(a.escenarios,(t==null?void 0:t.escenarioIds)??[],"ac-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function di(t,a,e){const o=()=>{const s=t.querySelector("#ac-aport-container");s&&(s.innerHTML=li(a))};U(t,"#ac-modelo",s=>{const n=s.value,i=(r,u)=>{const l=t.querySelector(r);l&&(l.style.display=u?"":"none")};i("#ac-inversion-hint",n==="inversion"),i("#ac-beneficio-fields",n==="beneficio")}),P(t,"[data-aport-anadir]",()=>{var n,i,r,u;const s=parseFloat(((n=t.querySelector("#aport-importe"))==null?void 0:n.value)??"")||0;if(!s)return R("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((u=t.querySelector("#aport-fin"))==null?void 0:u.value)||""}),o()}),P(t,"[data-aport-borrar]",s=>{a.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function ui(t,a,e,o,s){const n=h=>{var $;return(($=t.querySelector(h))==null?void 0:$.value)??""},i=(h,$=0)=>{const M=parseFloat(n(h));return Number.isFinite(M)?M:$},r=h=>{var $;return!!(($=t.querySelector(h))!=null&&$.checked)},u=n("#ac-nombre").trim();if(!u)return{datos:{},error:"Nombre obligatorio"};const l=n("#ac-modelo")||"cuenta",x=l==="beneficio",m=i("#ac-saldo"),d={nombre:u,saldo:m,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:n("#ac-fecha-ini")||s,interes:i("#ac-interes"),periodoCobro:n("#ac-periodo")||"mensual",descripcion:n("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(h=>h.value),modeloFondo:l,planAportaciones:a,tipoBeneficio:x?n("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:x?n("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&m<=0)return{datos:d};if(!(o===null||Math.abs(m-o)>.005))return{datos:d};if(l==="inversion"&&m>(o??0)){const h=Date.now().toString(36);d.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${h}a`,fecha:e?s:d.fechaInicialSaldo??s,cantidad:m-(o??0)}]}return{datos:d,punto:{fecha:s,saldo:m,nota:e?"Actualización manual":"Saldo inicial"}}}function He(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:at(a.saldoCts),nota:a.nota}))}function pi(t,a,e,o,s){const n=e.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${c(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${c(E(i.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${c(i.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${c(a)}|${c(i._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${c(a)}|${c(i._id)}">✕</button>
      </div>`).join("");return`
    <div class="card-title">Histórico — ${c(t)}</div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${e.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':n}
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
      <button class="btn-primary" data-hist-anadir="${c(a)}">Añadir</button>
    </div>`}const uo=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function mi(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Ct;function r(d,g){const h=o(),$=s();return!h||!$?null:($.innerHTML=`<div class="modal-title">${c(d)}</div>${g}`,h.classList.remove("hidden"),P($,"[data-cerrar]",n),$)}function u(){a=null;const d=[...t.store.get("tramosGananciasCapitalHistorico")].sort(($,M)=>$.año-M.año),g="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",h=r("Tramos — Ganancias de capital",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tramos marginales de la base del ahorro (art. 49 LIRPF): plusvalías de fondos, intereses y dividendos.
        Un ejercicio sin tabla propia usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${g}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(uo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${d.map($=>`<div style="${g}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(uo($.tramos))}</span>
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
      </div>`);h&&(P(h,"[data-editar-tg]",$=>{const M=$.getAttribute("data-editar-tg");m(M==="default"?"default":Number(M))}),P(h,"[data-borrar-tg]",$=>{const M=Number($.getAttribute("data-borrar-tg"));Z(`¿Eliminar la tabla del ejercicio ${M}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==M)),R(`Tabla ${M} eliminada`),t.onDatosCambiados(),u())}),P(h,"[data-anadir-anyo-tg]",()=>{var f;const $=parseInt(((f=h.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!$||$<2e3||$>2100)return R("Año inválido","err");const M=t.store.get("tramosGananciasCapitalHistorico");if(M.some(b=>b.año===$))return R("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...M,{_id:Date.now().toString(36),año:$,tramos:i().map(b=>[...b])}]),t.onDatosCambiados(),m($)}))}function l(){return e.map(([d,g],h)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${h}" value="${d}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${h}" value="${g}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${h}">✕</button>
          </div>
        </div>`).join("")}function x(d){e=[...d.querySelectorAll("[data-tg-min]")].map((g,h)=>{const $=d.querySelector(`[data-tg-pct="${h}"]`);return[parseFloat(g.value)||0,parseFloat(($==null?void 0:$.value)??"")||0]})}function m(d){var f;a=d;const g=t.store.get("tramosGananciasCapitalHistorico");e=(d==="default"?i():((f=g.find(b=>b.año===d))==null?void 0:f.tramos)??i()).map(b=>[...b]);const $=r(`Ganancias de capital — ${d==="default"?"Por defecto":d}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!$)return;const M=()=>{const b=$.querySelector("#tg-rows");b&&(b.innerHTML=l())};P($,"[data-volver-tg]",u),P($,"[data-tg-anadir]",()=>{x($),e.push([0,0]),M()}),P($,"[data-tg-borrar]",b=>{x($),e.splice(Number(b.getAttribute("data-tg-borrar")),1),M()}),P($,"[data-tg-guardar]",()=>{x($);const b=[...e].sort((y,A)=>y[0]-A[0]);if(b.length===0)return R("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:b}),R("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(y=>y.año===a?{...y,tramos:b}:y)),R(`Tabla ${a} guardada`)),t.onDatosCambiados(),u()})}return{abrir:u}}const Ge=["#00e5a0","#4d9fff","#ffd166","#ff4d6d","#a855f7","#fb923c"],fi="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z";function vi(t){const a=()=>document.getElementById("modal-overlay"),e=()=>document.getElementById("modal-content"),o=()=>{var l;return(l=a())==null?void 0:l.classList.add("hidden")};function s(l,x,m,d){const g=na(l,m,d),h=l.targetAmount||0,$=h>0?Math.min(100,g/h*100):0,M=!l.completado&&h>0&&g>=h,f=l.targetDate?Math.max(0,Math.round((L(l.targetDate).getTime()-L(t.hoy()).getTime())/(30.44*864e5))):null,b=f!==null&&f>0?Math.max(0,h-g)/f:null,y=!l.completado&&!M?ia(l,m,{extractoCuenta:t.extractoCuenta,colchonEnFecha:t.colchonEnFecha,hoy:L(t.hoy())}):null,A=(l.cuentaIds||[]).length>0?(l.cuentaIds||[]).map(w=>{var C;return((C=m.find(F=>F._id===w))==null?void 0:C.nombre)??w}).join(", "):"Todas las cuentas activas",v=[l.completado?'<span class="badge badge-active">✓ Completado</span>':"",M?'<span class="badge" style="background:rgba(0,229,160,0.2);color:var(--accent)">🎉 ¡Meta alcanzada!</span>':"",l.usarColchon!==!1?'<span class="badge badge-inactive" title="Colchón descontado del saldo">🛡 −colchón</span>':""].join(""),p=$>=100?"var(--accent)":$>=70?"var(--yellow)":"var(--text2)",S=["card mb-8",l.completado?"goal-completado":"",M?"goal-alcanzado":""].filter(Boolean).join(" "),I=[b!==null?`<span>Necesitas ${c(E(b))}/mes</span>`:"",l.targetDate?`<span>Meta fijada: ${c(l.targetDate)}</span>`:"",y?`<span style="color:var(--accent)">📈 Estimado: ${c(y)}</span>`:!l.completado&&!M?'<span style="color:var(--text3)">Sin proyección</span>':"",l.usarColchon!==!1?`<span>Colchón: ${c(E(d))}</span>`:"",`<span>Cuentas: ${c(A)}</span>`].join("");return`<div class="${S}" style="padding:14px;border:1px solid ${M?"var(--accent)":"var(--border)"}">
      <div class="flex justify-between items-center mb-8">
        <div class="flex gap-8 items-center flex-wrap">
          <span class="goal-priority-badge">#${c(l.prioridad||x+1)}</span>
          <span style="font-weight:600;font-size:14px${l.completado?";text-decoration:line-through;color:var(--text3)":""}">${c(l.nombre)}</span>
          ${v}
        </div>
        <div class="flex gap-8">
          ${M?`<button class="btn-primary btn-sm" data-completar-goal="${c(l._id)}">Marcar completado</button>`:""}
          <button class="btn-icon" data-editar-goal="${c(l._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${fi}"/></svg></button>
          <button class="btn-danger btn-sm" data-borrar-goal="${c(l._id)}">✕</button>
        </div>
      </div>
      <div class="flex justify-between mb-4">
        <span class="text-sm">${c(E(g))} / ${c(E(h))}</span>
        <span class="text-sm" style="color:${p}">${$.toFixed(0)}%${f!==null?` · ${f}m restantes`:""}</span>
      </div>
      <div class="goal-bar"><div class="goal-bar-fill" style="width:${$}%;background:${c(l.color||"var(--accent)")}"></div></div>
      <div class="flex gap-12 mt-8 flex-wrap" style="font-size:11px;color:var(--text3)">${I}</div>
    </div>`}function n(l){const x=[...t.store.get("goals")].sort((g,h)=>(g.prioridad||99)-(h.prioridad||99)),m=t.store.get("accounts"),d=t.colchonEnFecha(t.hoy());l.innerHTML=`
      <div class="flex justify-between items-center mb-12">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro</div>
        <button class="btn-primary btn-sm" data-nuevo-goal>+ Objetivo</button>
      </div>
      ${x.length===0?'<div class="text-sm" style="color:var(--text3)">Sin objetivos. Define metas de ahorro para seguirlas aquí y en el Dashboard.</div>':x.map((g,h)=>s(g,h,m,d)).join("")}`}function i(l){const x=t.store.get("accounts").filter($=>$.activo&&!$.simulacion),m=t.store.get("goals"),d=l?l.prioridad||1:Math.max(0,...m.map($=>$.prioridad||0))+1,g=(l==null?void 0:l.color)||Ge[0],h=x.map($=>`<label style="display:flex;gap:8px;align-items:center;font-size:13px;cursor:pointer">
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
            <input class="form-input" type="number" id="goal-prio" value="${c(d)}" placeholder="1"/></div>
          <div class="form-group mt-8">
            <label class="form-label">Cuentas a considerar (vacío = todas las activas)</label>
            <div style="display:flex;flex-direction:column;gap:6px;padding:8px;background:var(--bg3);border-radius:var(--radius)">
              ${h||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
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
              ${Ge.map($=>`<option value="${$}"${$===g?" selected":""}>${$}</option>`).join("")}
            </select></div>
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-goal="${c((l==null?void 0:l._id)??"")}">Guardar</button>
      </div>`}function r(l,x){const m=l?t.store.get("goals").find(h=>h._id===l)??null:null,d=a(),g=e();!d||!g||(g.innerHTML=`<div class="modal-title">${l?"Editar objetivo":"Nuevo objetivo"}</div>${i(m)}`,d.classList.remove("hidden"),P(g,"[data-cancelar]",o),P(g,"[data-guardar-goal]",h=>{var y,A;const $=v=>{var p;return((p=g.querySelector(v))==null?void 0:p.value)??""},M=$("#goal-nombre").trim();if(!M)return R("Nombre obligatorio","err");const f={nombre:M,targetAmount:parseFloat($("#goal-amount"))||0,targetDate:$("#goal-date")||null,prioridad:parseInt($("#goal-prio"),10)||1,color:$("#goal-color")||Ge[0],usarColchon:!!((y=g.querySelector("#goal-colchon"))!=null&&y.checked),completado:!!((A=g.querySelector("#goal-completado"))!=null&&A.checked),cuentaIds:[...g.querySelectorAll(".goal-acc-check:checked")].map(v=>v.value)},b=h.getAttribute("data-guardar-goal")||"";b?(t.store.updateItem("goals",b,f),R("Actualizado")):(t.store.addItem("goals",f),R("Objetivo creado")),t.onDatosCambiados(),o(),x()}))}function u(l,x){P(l,"[data-nuevo-goal]",()=>r(null,x)),P(l,"[data-editar-goal]",m=>r(m.getAttribute("data-editar-goal"),x)),P(l,"[data-borrar-goal]",m=>{Z("¿Eliminar objetivo?")&&(t.store.removeItem("goals",m.getAttribute("data-borrar-goal")),R("Objetivo eliminado"),t.onDatosCambiados(),x())}),P(l,"[data-completar-goal]",m=>{t.store.updateItem("goals",m.getAttribute("data-completar-goal"),{completado:!0}),R("Objetivo marcado como completado ✓"),t.onDatosCambiados(),x()})}return{render:n,wire:u}}const gi="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",bi=120;function hi(t){const a=t.hoy??V,e=()=>{var z;return(z=t.onDatosCambiados)==null?void 0:z.call(t)},o=t.mostrarObjetivos??(()=>!0),s=new Map,n=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),r=z=>{var j;return((j=i().find(_=>_._id===z))==null?void 0:j.nombre)??z},u=z=>{var j;return((j=t.store.get("accounts").find(_=>_._id===z))==null?void 0:j.nombre)??z},l=()=>gt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??vt)(Number(a().slice(0,4))),x=()=>gt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??Ct),m=()=>x()(Number(a().slice(0,4))),d=z=>Ca(t.store.get("expenses"),n(),t.store.get("loans"),z);function g(){const z=n(),j=t.store.get("accounts"),_=Ut({loans:[],expenses:t.store.get("expenses").filter(q=>q.tipo==="transferencia"),accounts:j,config:{dashboardStart:z.dashboardStart,dashboardEnd:z.dashboardEnd,fechaReferencia:z.dashboardStart},nominas:[],resolverTramosGanancias:x()}),D=new Map,N=q=>{let k=D.get(q);return k||(k={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},D.set(q,k)),k},B=(q,k)=>{const Y=`${k.sourceId}`,O=q.find(J=>J.concepto===Y),H=O??{concepto:Y,contraparte:"",total:0,ocurrencias:0};H.total+=Math.abs(k.cuantia),H.ocurrencias+=1,O||q.push(H)};for(const q of _){if(!q.cuenta)continue;const k=N(q.cuenta);q.sourceType==="transfer-in"||q.sourceType==="traspaso-in"?(k.totalAportaciones+=Math.abs(q.cuantia),B(k.entradas,q)):q.sourceType==="transfer-out"||q.sourceType==="traspaso-out"?(k.totalReembolsos+=Math.abs(q.cuantia),B(k.salidas,q)):q.sourceType==="investment-tax"&&(k.retencion+=Math.abs(q.cuantia))}const T=t.store.get("expenses");for(const q of D.values())for(const[k,Y]of[[q.entradas,"cuenta"],[q.salidas,"cuentaDestino"]])for(const O of k){const H=T.find(J=>J._id===O.concepto);O.contraparte=u((H==null?void 0:H[Y])??"default"),O.concepto=(H==null?void 0:H.concepto)||(Y==="cuenta"?"Aportación":"Reembolso")}return D}function h(){const z=new Map,j=n(),_=a(),D=new Date(Number(_.slice(0,4)),Number(_.slice(5,7))-1+bi+1,0),N=`${D.getFullYear()}-${String(D.getMonth()+1).padStart(2,"0")}-${String(D.getDate()).padStart(2,"0")}`;return B=>{const T=z.get(B._id);if(T)return T;const q=Ut({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...j,dashboardStart:_,dashboardEnd:N,fechaReferencia:_},filtroAccounts:[B._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:gt(t.store.get("tramosIRPFHistorico"),j.tramos_irpf??vt),resolverTramosGanancias:x()}).map(k=>({fecha:k.fecha,saldoAcum:k.saldoAcum}));return z.set(B._id,q),q}}const $=vi({store:t.store,colchonEnFecha:d,extractoCuenta:z=>M(z),hoy:a,onDatosCambiados:e});let M=h();function f(z){M=h();const _=t.store.get("accounts").filter(T=>ut(T)!=="pension"),D=g(),N={config:n(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:l(),tramosGanancias:m(),nombreEscenario:r,flujos:T=>D.get(T)??ti,invModo:T=>s.get(T)??"proyeccion"};z.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${ei(_,N.tramosGanancias)}
      <div class="grid-3">${_.map(T=>ii(T,N)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const B=z.querySelector("#goals-section");B&&$.render(B)}const b=()=>document.getElementById("modal-overlay"),y=()=>document.getElementById("modal-content"),A=()=>{var z;return(z=b())==null?void 0:z.classList.add("hidden")};function v(z,j){const _=b(),D=y();return!_||!D?null:(D.innerHTML=z?`<div class="modal-title">${c(z)}</div>${j}`:j,_.classList.remove("hidden"),P(D,"[data-cancelar]",A),D)}function p(z,j){const _=z?t.store.get("accounts").find(T=>T._id===z)??null:null,D=[...(_==null?void 0:_.planAportaciones)??[]].map(T=>({...T})),N=_?S(_):null,B=v(z?"Editar cuenta / fondo":"Nueva cuenta / fondo",ci(_,{escenarios:i(),nominas:t.store.get("nominas"),hoy:a(),saldoActual:N??0}));B&&(di(B,D,a()),P(B,"[data-guardar-acc]",T=>{const q=T.getAttribute("data-guardar-acc")||"",{datos:k,punto:Y,error:O}=ui(B,D,_,N,a());if(O)return R(O,"err");let H=q;q?t.store.updateItem("accounts",q,k):H=t.store.addItem("accounts",k)._id,Y&&t.ledger.registrarPuntoControl(H,Y.fecha,Y.saldo,Y.nota),R(q?"Actualizada":"Cuenta / fondo creado"),e(),A(),j()}))}function S(z){const j=t.ledger.puntosControl(z._id);return j.length>0?He(j)[0].saldo:z.saldo??null}function I(z,j){const _=t.store.get("accounts").find(B=>B._id===z);if(!_)return;const D=v("Histórico de saldos",pi(_.nombre,z,He(t.ledger.puntosControl(z)),_.saldoInicial||0,a()));if(!D)return;const N=()=>{j(),I(z,j)};P(D,"[data-hist-anadir]",()=>{var k,Y,O;const B=((k=D.querySelector("#hi-fecha"))==null?void 0:k.value)??"",T=parseFloat(((Y=D.querySelector("#hi-saldo"))==null?void 0:Y.value)??""),q=((O=D.querySelector("#hi-nota"))==null?void 0:O.value.trim())??"";if(!B||!Number.isFinite(T))return R("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(z,B,T,q||void 0),R("Punto añadido"),e(),N()}),P(D,"[data-hist-borrar]",B=>{const[,T]=(B.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(T),R("Eliminado"),e(),N()}),P(D,"[data-hist-inicial]",B=>{const[T,q]=(B.getAttribute("data-hist-inicial")||"").split("|"),k=t.ledger.puntosControl(T).find(O=>O._id===q);if(!k)return;const Y=He([k])[0].saldo;t.store.updateItem("accounts",T,{saldoInicial:Y,fechaInicialSaldo:k.fecha}),R(`Punto inicial → ${k.fecha} (${E(Y)})`),e(),N()})}function w(z){const j=t.store.get("accounts").filter(N=>N.activo);if(j.length===0)return R("No hay cuentas activas","err");const _=a(),D=j.map(N=>`• ${N.nombre}: ${E(S(N)??N.saldoInicial??0)}`).join(`
`);if(Z(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${_})?

${D}

Esto recalibra el punto de arranque del dashboard.`)){for(const N of j)t.store.updateItem("accounts",N._id,{saldoInicial:S(N)??N.saldoInicial??0,fechaInicialSaldo:_});R("Saldo base actualizado"),e(),z()}}function C(z,j,_){P(z,"[data-nueva-acc]",()=>p(null,j)),P(z,"[data-editar-acc]",D=>p(D.getAttribute("data-editar-acc"),j)),P(z,"[data-tramos-ganancias]",()=>_.abrir()),P(z,"[data-reset-base]",()=>w(j)),P(z,"[data-hist-acc]",D=>I(D.getAttribute("data-hist-acc"),j)),P(z,"[data-principal-acc]",D=>{const N=D.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(B=>({...B,esCuentaPrincipal:B._id===N}))),R("Cuenta marcada como principal"),e(),j()}),P(z,"[data-borrar-acc]",D=>{const N=D.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return R("Debe existir al menos una cuenta","err");if(!Z("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",N);const T=t.store.get("accounts");T.length>0&&!T.some(q=>q.esCuentaPrincipal)&&t.store.set("accounts",T.map((q,k)=>k===0?{...q,esCuentaPrincipal:!0}:q)),R("Cuenta eliminada"),e(),j()}),P(z,"[data-inv-modo]",D=>{const[N,B]=(D.getAttribute("data-inv-modo")||"").split("|");s.set(N,B==="real"?"real":"proyeccion"),j()}),$.wire(z,j)}let F=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:gi,mount(z){const j=()=>f(z);F??(F=mi({store:t.store,onDatosCambiados:()=>{e(),j()},año:()=>Number(a().slice(0,4))})),f(z),z.dataset.wired!=="1"&&(C(z,j,F),z.dataset.wired="1")}}}const et=(t,a,e="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${e};font-size:12px;padding:5px 10px">${c(E(a))}</td>
  </tr>`,Ve=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${c(t)}</td></tr>`;function po(t){const e=t.capMobiliario!==0||t.gananciasFondos!==0?`${et("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
       ${et("Ganancias patrimoniales (fondos/acciones)",t.gananciasFondos,t.gananciasFondos>=0?"var(--text)":"var(--green)",!0)}`:'<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>',o=t.resultado>0?"var(--red)":"var(--green)",s=t.resultado>0?"🔴 A PAGAR":"🟢 A DEVOLVER";return`
    <table style="width:100%;border-collapse:collapse">
      ${Ve("RENDIMIENTOS DEL TRABAJO")}
      ${et("Ingresos íntegros del trabajo",t.brutoTotal,"var(--text)",!0)}
      ${t.flexTotal>0?et("− Retribución flexible exenta (Art. 42 LIRPF)",-t.flexTotal,"var(--green)",!0):""}
      ${t.flexTotal>0?et("= Ingresos sujetos a IRPF",t.brutoIRPF):""}
      ${et("− Cotizaciones SS (≈6,35 %)",-t.cotizSS,"var(--red)",!0)}
      ${et("− Gastos deducibles (Art. 19.2 LIRPF)",-t.gastosArt19,"var(--red)",!0)}
      ${et("= Rendimiento neto trabajo",t.RNT)}
      ${et("− Reducción Art. 20 LIRPF",-t.reducArt20,"var(--green)",!0)}
      ${t.deducPP>0?et(`− Aportaciones a planes de pensiones (${c(E(t.aportPP))}, límite ${c(E(t.limPP))})`,-t.deducPP,"var(--green)",!0):""}
      ${t.otrosIngresos>0?et("+ Otros ingresos sujetos a IRPF",t.otrosIngresos,"var(--text)",!0):""}
      ${t.capInmobiliario!==0?et("+ Capital inmobiliario neto",t.capInmobiliario,t.capInmobiliario>=0?"var(--text)":"var(--green)",!0):""}
      ${t.otrasCorto!==0?et("± Otras ganancias a corto plazo",t.otrasCorto,"var(--text)",!0):""}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE GENERAL</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(E(t.baseGeneral))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota IRPF base general</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(E(t.cuotaGen))}</td>
      </tr>

      ${Ve("BASE DEL AHORRO")}
      ${e}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(E(t.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(E(t.cuotaAho))}</td>
      </tr>

      ${Ve("RESULTADO")}
      ${et("Cuota íntegra total",t.cuotaIntegra,"var(--red)")}
      ${et("− Retenciones en nómina",-t.retNomina,"var(--green)",!0)}
      ${t.retCapital!==0?et("− Retenciones de capital mobiliario",-t.retCapital,"var(--green)",!0):""}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${s}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${o}">${c(E(Math.abs(t.resultado)))}</td>
      </tr>
    </table>`}const ae=(t,a,e,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${c(a)}</label>
    <input type="number" id="${t}" class="form-input" value="${c(e)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${c(o)}</div>`:""}
  </div>`;function yi(t){const a=t.extras,e=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
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
          ${ae("rex-inmobiliario","Capital inmobiliario neto (alquileres − gastos)",a.capInmobiliario??0)}
          ${ae("rex-mobiliario","Capital mobiliario (dividendos, intereses)",a.capMobiliario??0)}
          ${ae("rex-ganancias","Ganancias / pérdidas patrimoniales (fondos, acciones)",a.gananciasFondos??0,"Positivo = ganancia · Negativo = pérdida compensable")}
          ${ae("rex-otras","Otras ganancias a corto plazo (menos de 1 año)",a.otrasCorto??0)}
          ${ae("rex-ret-cap","Retenciones de capital ya aplicadas",a.retCapital??0,"Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen")}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${t.nominas.length>0?t.nominas.map(o=>`• ${c(o.nombre)}: ${c(E(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${c(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${po(t.declaracion)}</div>
      </div>
    </div>`}function mo(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((e,o)=>e[0]-o[0]).map(([e,o],s,n)=>{const i=s<n.length-1?n[s+1][0]:null,r=i!==null?`${E(e)} – ${E(i)}`:`Más de ${E(e)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${c(r)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${c(o)}%</td>
      </tr>`}).join("")}
  </table>`}const xi=(t,a,e)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${c(a)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${e}</div>
  </div>`,lt=(t,a,e="")=>`<div class="stat-card"><div class="stat-label">${c(t)}</div><div class="stat-value ${e}">${c(a)}</div></div>`,ht=(t,a,e="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${c(t)}</span><span class="num ${e}">${c(a)}</span></div>`;function $i(t,a,e){const o=t.filter(u=>(u.modeloFondo||"cuenta")==="inversion");if(o.length===0)return xi("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let s=0,n=0,i=0;const r=o.map(u=>{const l=Tt(u,a);if(!l)return"";s+=l.saldo,n+=l.costBase,i+=l.impuesto;const x=l.costBase>0?l.plusvalia/l.costBase*100:0,m=(u.escenarioIds||[]).map(d=>`<span class="badge badge-yellow">🔭 ${c(e(d))}</span>`).join("");return`
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${c(u.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${m}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            ${lt("Valor actual",E(l.saldo))}
            ${lt("Coste base (aportado)",E(l.costBase))}
          </div>
          <div class="grid-2" style="gap:8px">
            ${lt(`Plusvalía latente (${x>=0?"+":""}${x.toFixed(1)}%)`,E(l.plusvalia),l.plusvalia>=0?"pos":"neg")}
            ${lt("Imp. ganancias de capital (est.)",E(l.impuesto),"neg")}
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${c(E(l.neto))}</span>
          </div>
        </div>`}).join("");return`
    <div class="card mb-16" style="border:1px solid rgba(99,102,241,0.3)">
      <div class="card-title">Cartera de fondos — resumen</div>
      <div class="grid-3" style="gap:8px;margin-bottom:10px">
        ${lt("Valor total de la cartera",E(s))}
        ${lt("Total aportado (coste base)",E(n))}
        ${lt("Plusvalía latente total",E(s-n),s-n>=0?"pos":"neg")}
      </div>
      <div class="grid-2" style="gap:8px">
        ${lt("Impuesto estimado si se liquida todo",E(i),"neg")}
        ${lt("Neto tras impuestos (cartera completa)",E(s-i),"pos")}
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
      ${mo(a)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function Ii(t){const{nominas:a,planes:e,tramos:o}=t,s=g=>g.grupoNomina?a.filter(h=>(h.grupoNomina||"")===g.grupoNomina):null,n=a.map(g=>({n:g,d:Fe(g,s(g),o)})),i=n.reduce((g,h)=>g+h.d.brutoAnual,0),r=n.reduce((g,h)=>g+h.d.irpfAnual,0),u=n.reduce((g,h)=>g+h.d.ssAnual,0),l=n.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':n.map(({n:g,d:h})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${c(g.nombre)}</div>
          ${ht("Bruto anual",E(h.brutoAnual))}
          ${h.flexAnual>0?ht("− Retribución flexible exenta",E(-h.flexAnual),"pos"):""}
          ${ht("− Cotización SS",E(-h.ssAnual),"neg")}
          ${ht(`− IRPF estimado (${h.irpfPct.toFixed(1)} %)`,E(-h.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${c(E(h.baseDineraria-h.ssAnual-h.irpfAnual))}</span>
          </div>
        </div>`).join(""),x=pa(a,o),m=`${t.hoy.slice(0,4)}-01-01`,d=e.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':e.map(g=>{const h=le(g);if(!h)return"";const $=(g.aportaciones||[]).filter(y=>y.fecha>=m).reduce((y,A)=>y+A.cantidad,0),f=Math.min($,zt)*x/100,b=$>zt;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${c(g.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${ht("Valor actual",E(h.saldo))}
          ${ht("Coste base (total aportado)",E(h.costBase))}
          ${ht("Revalorización",E(h.beneficio),h.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(t.hoy.slice(0,4))}</div>
            ${ht("Aportado",`${E($)}${b?" ⚠":""}`,b?"neg":"")}
            ${ht("Límite deducible",E(zt))}
            ${ht(`Ahorro IRPF est. (marginal ${x} %)`,E(f),"pos")}
            ${b?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${c(E(zt))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${h.proxDesbloqueo?`· Próx. desbloqueo: ${c(h.proxDesbloqueo)}`:""}
          </div>
        </div>`}).join("");return`
    <div class="card mb-16">
      <div class="card-title mb-10">Nóminas activas — importes anuales</div>
      <div class="grid-4" style="gap:8px;margin-bottom:14px">
        ${lt("Bruto anual total",E(i))}
        ${lt("Cotización SS anual",E(u),"neg")}
        ${lt("IRPF estimado anual",E(r),"neg")}
        ${lt("Neto anual",E(i-u-r),"pos")}
      </div>
      <div class="grid-3">${l}</div>
    </div>

    <div class="card-title mb-8">Planes de pensiones</div>
    <div class="auth-hint mb-14" style="border-color:var(--yellow)">
      💼 <strong>Diferencia clave frente a los fondos de inversión:</strong> el rescate de un plan de pensiones tributa en la
      <strong>base general del IRPF</strong> (tramos ordinarios hasta el 47 %), <em>no</em> en la base del ahorro. Las
      aportaciones son deducibles hasta <strong>${c(E(zt))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${d}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${mo(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const pe=(t,a)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${c(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${c(a)}</div>
  </div>`;function Ai(){return`
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
        ${pe("Rendimientos íntegros","Alquileres, subarriendos y cesión de derechos sobre inmuebles")}
        ${pe("Gastos deducibles","IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación")}
        ${pe("Reducción del 60 %","Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)")}
        ${pe("Base general del IRPF","Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.")}
      </div>
    </div>`}const fo=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],Mi="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function Si(t){const a=t.hoy??V;let e="declaracion",o={};const s=()=>t.store.get("config"),n=()=>Number(a().slice(0,4)),i=()=>t.store.get("nominas").filter(b=>b.activo),r=()=>t.store.get("accounts").filter(b=>(b.modeloFondo||"cuenta")==="pension"),u=b=>{var y;return((y=t.store.get("escenarios").find(A=>A._id===b))==null?void 0:y.nombre)??b},l=()=>gt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??vt)(n()),x=()=>gt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??Ct)(n());function m(){const b=`${n()}-01-01`,y=t.store.get("nominas").filter(p=>p.activo&&!p.simulacion),A=r().reduce((p,S)=>p+(S.aportaciones||[]).filter(I=>I.fecha>=b).reduce((I,w)=>I+w.cantidad,0),0),v=t.store.get("expenses").filter(p=>p.activo&&p.sujetoIRPF&&p.tipo==="ingreso").reduce((p,S)=>p+ma(S),0);return va({nominas:y,aportacionesPension:A,otrosIngresos:v,extras:o,tramosGeneral:l(),tramosAhorro:x()})}function d(){const b=l(),y=i(),A=j=>j.grupoNomina?y.filter(_=>(_.grupoNomina||"")===j.grupoNomina):null,v=y.map(j=>Fe(j,A(j),b)),p=v.reduce((j,_)=>j+_.brutoAnual,0),S=v.reduce((j,_)=>j+_.irpfAnual,0),I=v.reduce((j,_)=>j+_.ssAnual,0),w=t.store.get("accounts").filter(j=>(j.modeloFondo||"cuenta")==="inversion");let C=0,F=0;for(const j of w){const _=Tt(j,x());_&&(C+=_.plusvalia,F+=_.impuesto)}if(p<=0&&w.length===0)return"";const z=(j,_,D)=>`<div class="exec-item"><div class="exec-item-label">${c(j)}</div><div class="exec-item-val ${D}">${c(_)}</div></div>`;return`<div class="exec-summary mb-14">
      ${p>0?z("IRPF trabajo",`${E(S)}/año`,"neg"):""}
      ${p>0?z("Neto trabajo",`${E(p-I-S)}/año`,"pos"):""}
      ${w.length>0?z("Plusvalía latente",E(C),C>=0?"pos":"neg"):""}
      ${w.length>0?z("Imp. potencial (inversión)",E(F),"neg"):""}
    </div>`}function g(){return e==="mobiliario"?$i(t.store.get("accounts"),x(),u):e==="trabajo"?Ii({nominas:i(),planes:r(),tramos:l(),hoy:a()}):e==="inmobiliario"?Ai():yi({año:n(),extras:o,declaracion:m(),nominas:i().map(b=>({nombre:b.nombre,bruto:b.bruto||0})),planes:r().map(b=>b.nombre)})}function h(b,y){const A=e===b;return`<button data-tab-fisc="${b}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${A?"600":"400"};
      color:${A?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${A?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${c(y)}</button>`}function $(b){const y=b.querySelector("#fisc-tabs"),A=b.querySelector("#fisc-tab-content");y&&(y.innerHTML=fo.map(([v,p])=>h(v,p)).join("")),A&&(A.innerHTML=g())}function M(b){b.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${d()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${fo.map(([y,A])=>h(y,A)).join("")}
      </div>
      <div id="fisc-tab-content">${g()}</div>`}function f(b){P(b,"[data-tab-fisc]",y=>{e=y.getAttribute("data-tab-fisc")||"declaracion",$(b)}),b.addEventListener("input",y=>{var S;if(!((S=y.target)==null?void 0:S.closest("[data-rex]")))return;const v=I=>{var w;return((w=b.querySelector(`#${I}`))==null?void 0:w.value)??"0"};o={capInmobiliario:parseFloat(v("rex-inmobiliario"))||0,capMobiliario:parseFloat(v("rex-mobiliario"))||0,gananciasFondos:parseFloat(v("rex-ganancias"))||0,otrasCorto:parseFloat(v("rex-otras"))||0,retCapital:parseFloat(v("rex-ret-cap"))||0};const p=b.querySelector("#renta-cuadro");p&&(p.innerHTML=po(m()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:Mi,mount(b){M(b),b.dataset.wired!=="1"&&(f(b),b.dataset.wired="1")}}}const vo=()=>globalThis.Chart??null;function wi(t,a){const e=vo();if(!e)return null;const o=a.map(s=>({label:s.label,data:s.puntos.map(n=>({x:n.x,y:n.y})),borderColor:s.esBase?"#6b7280":s.color,backgroundColor:s.esBase?"transparent":`${s.color}18`,borderWidth:s.esBase?1.5:2,...s.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new e(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:s=>`${s.dataset.label}: ${E(s.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:s=>E(s)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const Ci=()=>vo()!==null,jt=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Fi="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function zi(t){const a=()=>{var p;return(p=t.onDatosCambiados)==null?void 0:p.call(t)},e=new Set;let o=null;const s=()=>t.store.get("config"),n=()=>t.store.get("escenarios"),i=p=>{var S;return p?((S=n().find(I=>I._id===p))==null?void 0:S.nombre)??p:"Base"};function r(p){const S=s(),I=la({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(p==null?void 0:p._id)??null),w=e.size>0?I.accounts.filter(j=>!e.has(j._id)):I.accounts,C=e.size>0?w.map(j=>j._id):null,F=p!=null&&p.fechaFin&&p.fechaFin>S.dashboardEnd?p.fechaFin:S.dashboardEnd;return{eventos:Ut({loans:I.loans,expenses:I.expenses,accounts:w,config:{...S,dashboardEnd:F},filtroAccounts:C,nominas:I.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:gt(t.store.get("tramosIRPFHistorico"),S.tramos_irpf??vt),resolverTramosGanancias:gt(t.store.get("tramosGananciasCapitalHistorico"),S.tramosGananciasCapital??Ct)}),horizonte:F}}function u(p){const S=t.store.get("loans"),I=z=>(z.escenarioIds||[]).includes(p),w=[[S.filter(I).length,"préstamo","préstamos"],[S.flatMap(z=>z.amortizaciones||[]).filter(I).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(I).length,"gasto","gastos"],[t.store.get("accounts").filter(I).length,"cuenta","cuentas"],[t.store.get("nominas").filter(I).length,"nómina","nóminas"]],C=w.reduce((z,[j])=>z+j,0),F=w.filter(([z])=>z>0).map(([z,j,_])=>`${z} ${z===1?j:_}`).join(" · ");return{total:C,texto:F}}function l(p,S){const I=S===p._id,w=p.color||jt[0],{total:C,texto:F}=u(p._id);return`<div class="card mb-12" style="border-left:3px solid ${c(w)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${c(w)};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${c(p.nombre)}</span>
        ${I?'<span class="badge badge-yellow">● Activo</span>':""}
        ${p.fechaFin?`<span class="badge badge-inactive">📅 ${c(p.fechaFin)}</span>`:""}
        <div class="flex gap-8">
          ${I?'<button class="btn-secondary btn-sm" data-desactivar-esc>Desactivar</button>':`<button class="btn-primary btn-sm" data-activar-esc="${c(p._id)}">Activar</button>`}
          <button class="btn-secondary btn-sm" data-editar-esc="${c(p._id)}">Editar</button>
          <button class="btn-danger btn-sm" data-borrar-esc="${c(p._id)}">✕</button>
        </div>
      </div>
      ${p.descripcion?`<div class="text-sm mb-8" style="color:var(--text2)">${c(p.descripcion)}</div>`:""}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${C===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${c(F)}</span>`}
      </div>
    </div>`}function x(p){const S=s().dashboardEnd,I=Ie(r(null).eventos,S);return`
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
        <tbody>${p.map(C=>{const{eventos:F}=r(C),z=C.fechaFin||S,j=Ie(F,z),_=j!==null&&I!==null?j-I:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c(C.color||jt[0])};margin-right:6px"></span>
            ${c(C.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${c(z)}</td>
          <td class="num" style="padding:6px 10px">${j!==null?c(E(j)):"—"}</td>
          <td class="num ${_===null?"":_>=0?"pos":"neg"}" style="padding:6px 10px">
            ${_===null?"—":`${_>=0?"+":""}${c(E(_))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function m(){const p=t.store.get("accounts");return p.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${p.map(I=>{const w=e.has(I._id);return`<button data-toggle-cuenta="${c(I._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${w?"var(--border)":"var(--accent)"};
          background:${w?"transparent":"rgba(99,102,241,0.1)"};
          color:${w?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${w?"text-decoration:line-through;":""}">${c(I.nombre)}</button>`}).join("")}
    </div>`}function d(){if(o){try{o.destroy()}catch{}o=null}}function g(p){const S=s(),I=r(null),w=[{label:"Base (sin escenario)",color:"#6b7280",esBase:!0,puntos:$e(I.eventos,S.dashboardStart,S.dashboardEnd)}];return p.forEach((C,F)=>{const{eventos:z,horizonte:j}=r(C);w.push({label:C.nombre,color:C.color||jt[F%jt.length],puntos:$e(z,S.dashboardStart,j)})}),w}function h(p,S){d();const I=p.querySelector("#chart-comparacion");I&&(o=wi(I,g(S)))}function $(p){d();const S=new Set(t.store.get("accounts").map(C=>C._id));for(const C of[...e])S.has(C)||e.delete(C);const I=n(),w=s().escenarioActivo||null;p.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Escenarios</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo escenario</button></div>
      </div>

      ${w?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${c(i(w))}</span>
                 <span style="font-size:12px;color:var(--text3);margin-left:8px">El dashboard muestra la proyección de este escenario</span>
               </div>
               <button class="btn-secondary btn-sm" data-desactivar-esc>Volver a base</button>
             </div>`:""}

      ${I.length===0?`<div class="card mb-14" style="padding:20px 24px">
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
             </div>`:`<div>${I.map(C=>l(C,w)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de escenarios</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${m()}</div>
               ${Ci()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${x(I)}</div>`}`,I.length>0&&h(p,I)}const M=()=>document.getElementById("modal-overlay"),f=()=>document.getElementById("modal-content"),b=()=>{var p;return(p=M())==null?void 0:p.classList.add("hidden")};function y(p,S){const I=p?n().find(z=>z._id===p)??null:null,w=M(),C=f();if(!w||!C)return;const F=(I==null?void 0:I.color)||jt[0];C.innerHTML=`
      <div class="modal-title">${p?"Editar escenario":"Nuevo escenario"}</div>
      <div class="form-group"><label class="form-label">Nombre del escenario</label>
        <input class="form-input" type="text" id="esc-nombre" value="${c((I==null?void 0:I.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${c((I==null?void 0:I.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${jt.map(z=>`<div data-color-esc="${z}" style="width:26px;height:26px;border-radius:50%;background:${z};cursor:pointer;
              border:2px solid ${z===F?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${c(F)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${c((I==null?void 0:I.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${c(p??"")}">${p?"Guardar cambios":"Crear escenario"}</button>
      </div>`,w.classList.remove("hidden"),P(C,"[data-cancelar]",b),P(C,"[data-color-esc]",z=>{const j=z.getAttribute("data-color-esc");C.querySelector("#esc-color").value=j;for(const _ of C.querySelectorAll("[data-color-esc]"))_.style.border=_.getAttribute("data-color-esc")===j?"2px solid white":"2px solid transparent"}),P(C,"[data-guardar-esc]",z=>{const j=C.querySelector("#esc-nombre").value.trim();if(!j)return R("El nombre es obligatorio","err");const _={nombre:j,fechaFin:C.querySelector("#esc-fecha-fin").value||null,color:C.querySelector("#esc-color").value||jt[0],descripcion:C.querySelector("#esc-desc").value.trim()},D=z.getAttribute("data-guardar-esc")||"";D?(t.store.updateItem("escenarios",D,_),R("Escenario actualizado")):(t.store.addItem("escenarios",_),R("Escenario creado")),a(),b(),S()})}function A(p,S){if(!Z("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const I=w=>w.map(C=>({...C,escenarioIds:(C.escenarioIds||[]).filter(F=>F!==p)}));t.store.set("loans",I(t.store.get("loans")).map(w=>({...w,amortizaciones:I(w.amortizaciones||[])}))),t.store.set("expenses",I(t.store.get("expenses"))),t.store.set("nominas",I(t.store.get("nominas"))),t.store.set("accounts",I(t.store.get("accounts"))),s().escenarioActivo===p&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",p),R("Escenario eliminado"),a(),S()}function v(p,S){P(p,"[data-nuevo-esc]",()=>y(null,S)),P(p,"[data-editar-esc]",I=>y(I.getAttribute("data-editar-esc"),S)),P(p,"[data-borrar-esc]",I=>A(I.getAttribute("data-borrar-esc"),S)),P(p,"[data-activar-esc]",I=>{const w=I.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:w}),R(`Escenario "${i(w)}" activado`),a(),S()}),P(p,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),R("Volviendo a la realidad base"),a(),S()}),P(p,"[data-toggle-cuenta]",I=>{const w=I.getAttribute("data-toggle-cuenta");e.has(w)?e.delete(w):e.add(w);const C=p.querySelector("#esc-pastillas");C&&(C.innerHTML=m());const F=n(),z=p.querySelector("#esc-comparativa");z&&(z.innerHTML=x(F)),h(p,F)})}return{id:"escenarios",route:"escenarios",nombre:"Escenarios",flagId:"supuestos",seccion:2,iconoPath:Fi,mount(p){const S=()=>$(p);$(p),p.dataset.wired!=="1"&&(v(p,S),p.dataset.wired="1")},unmount(){d()}}}const Ei=1e-12,go=t=>Math.abs(t)<Ei,bo=t=>t/12;function ji(t,a,e,o){if(e<=0)return Math.max(0,Math.ceil(t-a));const s=t-a;if(s<=0)return 0;const n=bo(o);if(go(n))return Math.ceil(s/e);const i=Math.pow(1+n,e),r=(t-a*i)*n/(i-1);return r<=0?0:Math.ceil(r)}function _i(t,a){const e=bo(a);return go(e)?0:Math.round(t*e)}function ho({rentaNetaMensual:t,tasaRetiroSeguro:a,tipoFiscalEfectivo:e}){if(a<=0)throw new RangeError("La tasa de retiro seguro tiene que ser mayor que cero.");if(e>=1)throw new RangeError("El tipo fiscal efectivo no puede llegar al 100 %.");const o=Math.round(t*12/(1-e));return{retiroBrutoAnual:o,capitalNecesario:Math.round(o/a)}}function yo(t,a){const[e,o]=t.split("-").map(Number),s=e*12+(o-1)+a,n=Math.floor(s/12),i=s%12+1;return`${n}-${String(i).padStart(2,"0")}`}function xo(t,a){const[e,o]=t.split("-").map(Number),[s,n]=a.split("-").map(Number);return(s-e)*12+(n-o)}const $o=t=>Number(t.slice(0,4));function me(t){return t.rentaDeseada?ho(t.rentaDeseada).capitalNecesario:t.importeObjetivo??0}const Pi={_id:"__sin_vehiculo__"};function Ti(t){var b,y,A;const a=Math.max(0,Math.floor(t.horizonteMeses)),e=new Map(t.vehiculos.map(v=>[v._id,v])),o=[...t.objetivos].sort((v,p)=>v.prioridad-p.prioridad).map(v=>({def:v,objetivo:me(v),saldo:v.saldoActual,estado:me(v)>0&&v.saldoActual>=me(v)&&v.modoAsignacion!=="ABSORBE_RESIDUAL"?"COMPLETADO":"PENDIENTE",vehiculo:e.get(v.vehiculoId),aportadoEnAño:0,añoEnCurso:$o(t.fechaInicio),ultimaSolicitud:0,solicitadoAcumulado:0,mesesReclamando:0})),s=new Map;for(const v of t.eventos){const p=s.get(v.fecha)??[];p.push(v),s.set(v.fecha,p)}const n=[],i=[],r=[];let u=t.perfil.netoMensual,l=t.perfil.gastosFijosMensuales,x=0,m=0;const d=[];for(let v=0;v<a;v++){const p=yo(t.fechaInicio,v),S=$o(p);for(const T of s.get(p)??[])if(T.tipo==="CAMBIO_INGRESOS")u=T.importe;else if(T.tipo==="CAMBIO_GASTOS_FIJOS")l=T.importe;else if(T.tipo==="NUEVA_DEUDA")l+=T.importe;else if(T.tipo==="INYECCION_CAPITAL"){const q=T.objetivoDestinoId?o.find(k=>k.def._id===T.objetivoDestinoId):void 0;q?q.saldo+=T.importe:u+=T.importe}for(const T of o)T.añoEnCurso!==S&&(T.añoEnCurso=S,T.aportadoEnAño=0);const I=Math.max(0,u-l),w=Math.round(I*Di(t.pctDisfrute));let C=I-w;const F=C,z=o.filter(T=>T.estado!=="COMPLETADO"),j=[];let _=0;const D=z.filter(T=>T.def.modoAsignacion==="ABSORBE_RESIDUAL"),N=z.filter(T=>T.def.modoAsignacion!=="ABSORBE_RESIDUAL");for(const T of N){const q=Ri(T,p,v,t);T.ultimaSolicitud=q,q>0&&(T.solicitadoAcumulado+=q,T.mesesReclamando+=1),(T.def.modoAsignacion==="CUOTA_POR_FECHA"||T.def.modoAsignacion==="FIJO")&&(_+=q);const k=Math.max(0,Math.min(q,C));C-=k,T.saldo+=k,T.aportadoEnAño+=k,x+=k,k>0&&T.estado==="PENDIENTE"&&(T.estado="EN_CURSO"),j.push({objetivoId:T.def._id,asignado:k,solicitado:q,saldoTrasMes:T.saldo})}if(D.length>0&&C>0){const T=D.map(Y=>Math.max(0,Y.def.pesoResidual??1)),q=T.reduce((Y,O)=>Y+O,0)||D.length;let k=0;D.forEach((Y,O)=>{const H=O===D.length-1?C-k:Math.floor(C*T[O]/q);k+=H,Y.saldo+=H,Y.aportadoEnAño+=H,x+=H,H>0&&Y.estado==="PENDIENTE"&&(Y.estado="EN_CURSO"),j.push({objetivoId:Y.def._id,asignado:H,solicitado:0,saldoTrasMes:Y.saldo})}),C-=k}else for(const T of D)j.push({objetivoId:T.def._id,asignado:0,solicitado:0,saldoTrasMes:T.saldo});_>F&&d.push({mes:p,deficit:_-F});for(const T of o)T.saldo<=0||(T.saldo+=_i(T.saldo,((b=T.vehiculo)==null?void 0:b.rentabilidadRealAnual)??0));for(const T of o)T.estado!=="COMPLETADO"&&(T.def.modoAsignacion==="ABSORBE_RESIDUAL"&&T.objetivo<=0||T.objetivo>0&&T.saldo>=T.objetivo&&(T.estado="COMPLETADO",i.push({objetivoId:T.def._id,nombre:T.def.nombre,mes:p,indice:v,importeFinal:T.saldo,cuotaLiberada:T.ultimaSolicitud})));for(const T of o)j.some(q=>q.objetivoId===T.def._id)||j.push({objetivoId:T.def._id,asignado:0,solicitado:0,saldoTrasMes:T.saldo});const B=o.reduce((T,q)=>T+q.saldo,0);if(m+=w,n.push({indice:v,mes:p,netoMensual:u,gastosFijos:l,sobrante:I,disfrute:w,disponible:F,sinAsignar:C,asignaciones:j.sort((T,q)=>Io(o,T.objetivoId)-Io(o,q.objetivoId)),patrimonioTotal:B}),o.length>0&&o.every(T=>T.estado==="COMPLETADO"))break}const g=[];if(d.length>0){const v=Math.round(d.reduce((p,S)=>p+S.deficit,0)/d.length);r.push({severidad:"error",codigo:"INVIABLE",mensaje:`El plan no cabe en el flujo de caja durante ${d.length} mes${d.length!==1?"es":""} (desde ${d[0].mes}). Déficit medio: ${(v/100).toFixed(2)} €/mes.`,mes:d[0].mes,deficitMensual:v});for(const p of o)p.estado!=="COMPLETADO"&&p.def.fechaLimite&&p.def.modoAsignacion==="CUOTA_POR_FECHA"&&(p.estado="INVIABLE");g.push(...Ni(o,t,v))}for(const v of o){const p=(y=v.vehiculo)==null?void 0:y.topeAportacionAnual;p&&v.def.modoAsignacion==="FIJO"&&(v.def.importeFijoMensual??0)*12>p&&r.push({severidad:"atencion",codigo:"TOPE_FISCAL",objetivoId:v.def._id,mensaje:`«${v.def.nombre}» pide ${((v.def.importeFijoMensual??0)/100).toFixed(2)} €/mes, que supera el tope anual de ${(p/100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`})}for(const v of o)v.estado!=="COMPLETADO"&&v.objetivo>0&&v.def.modoAsignacion!=="ABSORBE_RESIDUAL"&&r.push({severidad:"atencion",codigo:"NUNCA_COMPLETADO",objetivoId:v.def._id,mensaje:`«${v.def.nombre}» no se completa dentro del horizonte de ${a} meses.`});const h=o.find(v=>v.def.tipo==="INVERSION_PERPETUA"),$=h?i.find(v=>v.objetivoId===h.def._id):void 0,M={};for(const v of o){const p=((A=v.vehiculo)==null?void 0:A._id)??Pi._id;M[p]=(M[p]??0)+v.saldo}const f={};for(const v of o)f[v.def._id]=v.estado;return{viable:d.length===0,mesesSimulados:n.length,serieMensual:n,hitos:i,fases:Oi(n,i),avisos:r,propuestas:g,estadoFinal:f,resumen:{patrimonioFinal:o.reduce((v,p)=>v+p.saldo,0),patrimonioPorVehiculo:M,totalAportado:x,totalDisfrute:m,mesIndependencia:($==null?void 0:$.mes)??null}}}const Di=t=>Number.isFinite(t)?Math.min(1,Math.max(0,t)):0,Io=(t,a)=>t.findIndex(e=>e.def._id===a);function Ri(t,a,e,o){var n,i;const s=Math.max(0,t.objetivo-t.saldo);switch(t.def.modoAsignacion){case"ABSORBE_TODO":return s;case"FIJO":{const r=t.def.importeFijoMensual??0,u=(n=t.vehiculo)==null?void 0:n.topeAportacionAnual;if(!u)return t.objetivo>0?Math.min(r,s):r;const l=Math.max(0,u-t.aportadoEnAño),x=Math.min(r,l);return t.objetivo>0?Math.min(x,s):x}case"CUOTA_POR_FECHA":{if(s<=0)return 0;const r=t.def.fechaLimite?xo(a,t.def.fechaLimite):o.horizonteMeses-e;return ji(t.objetivo,t.saldo,Math.max(0,r),((i=t.vehiculo)==null?void 0:i.rentabilidadRealAnual)??0)}default:return 0}}function Oi(t,a){if(t.length===0)return[];const o=[0,...[...new Set(a.map(n=>n.indice))].sort((n,i)=>n-i).map(n=>n+1)].filter((n,i,r)=>r.indexOf(n)===i&&n<t.length),s=[];for(let n=0;n<o.length;n++){const i=o[n],r=(n+1<o.length?o[n+1]:t.length)-1;if(r<i)continue;const u=new Set;for(let l=i;l<=r;l++)for(const x of t[l].asignaciones)x.asignado>0&&u.add(x.objetivoId);s.push({desde:t[i].mes,hasta:t[r].mes,meses:r-i+1,objetivosActivos:[...u]})}return s}function Ni(t,a,e){const o=[],s=Math.max(0,a.perfil.netoMensual-a.perfil.gastosFijosMensuales);if(s>0&&a.pctDisfrute>0){const u=Math.ceil(Math.min(a.pctDisfrute,e/s)*100);if(u>0){const l=Math.round(a.pctDisfrute*100);o.push({clase:"REDUCIR_DISFRUTE",magnitud:u,mensaje:`Bajar el disfrute ${u} punto${u!==1?"s":""} (del ${l} % al ${Math.max(0,l-u)} %) libera ${(Math.min(e,s*a.pctDisfrute)/100).toFixed(0)} €/mes.`})}}const n=t.filter(u=>u.def.modoAsignacion==="CUOTA_POR_FECHA"&&u.def.fechaLimite&&u.estado!=="COMPLETADO"),i=u=>u.mesesReclamando>0?u.solicitadoAcumulado/u.mesesReclamando:0,r=[...n].sort((u,l)=>i(l)-i(u))[0];if(r){const u=Math.max(0,r.objetivo-r.saldo),l=i(r),x=Math.max(1,xo(a.fechaInicio,r.def.fechaLimite)),m=Math.max(1,l-e),d=Math.ceil(u/m),g=Math.max(1,d-x);o.push({clase:"RETRASAR_FECHA",objetivoId:r.def._id,magnitud:g,mensaje:`Retrasar «${r.def.nombre}» ${g} mes${g!==1?"es":""}, hasta ${yo(r.def.fechaLimite,g)}, baja su cuota a lo que cabe en el flujo.`});const h=Math.min(Math.round(e*x),Math.max(0,r.objetivo-1));h>0&&o.push({clase:"REDUCIR_IMPORTE",objetivoId:r.def._id,magnitud:h,mensaje:`O reducir «${r.def.nombre}» en ${(h/100).toFixed(0)} €, de ${(r.objetivo/100).toFixed(0)} € a ${((r.objetivo-h)/100).toFixed(0)} €.`})}return n.length>1&&o.push({clase:"REORDENAR",magnitud:n.length,mensaje:`Hay ${n.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`}),o.length===0&&o.push({clase:"REDUCIR_IMPORTE",magnitud:e,mensaje:`Faltan ${(e/100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`}),o}const qi=()=>globalThis.Chart??null,fe=["#00e5a0","#4d9fff","#a855f7","#f97316","#eab308","#22d3ee","#fb7185","#34d399"],Ao=new WeakMap;function Li(t,a,e){const o=qi();if(!o)return null;const s=Ao.get(t);if(s)try{s.destroy()}catch{}const n=new Map,i=new Map(a.objetivos.map(g=>[g._id,g.vehiculoId])),r=new Set(a.objetivos.map(g=>g.vehiculoId));for(const g of r)n.set(g,[]);for(const g of e.serieMensual){const h=new Map;for(const $ of g.asignaciones){const M=i.get($.objetivoId);M&&h.set(M,(h.get(M)??0)+$.saldoTrasMes)}for(const $ of r)n.get($).push((h.get($)??0)/100)}const u=g=>{var h;return((h=a.vehiculos.find($=>$._id===g))==null?void 0:h.nombre)??"Sin vehículo"},l=[...r],x=l.map((g,h)=>e.serieMensual.map(($,M)=>l.slice(0,h+1).reduce((f,b)=>f+(n.get(b)[M]??0),0))),m=l.map((g,h)=>({label:u(g),data:x[h],borderColor:fe[h%fe.length],backgroundColor:`${fe[h%fe.length]}33`,fill:h===0?"origin":"-1",borderWidth:1.5,pointRadius:0,tension:.25})),d=new o(t,{type:"line",data:{labels:e.serieMensual.map(g=>g.mes),datasets:m},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#8b92a8",font:{size:11},boxWidth:12}},tooltip:{backgroundColor:"#13161e",borderColor:"#252a38",borderWidth:1,titleColor:"#8b92a8",bodyColor:"#e8eaf2",callbacks:{label:g=>{const h=g.datasetIndex>0?g.chart.data.datasets[g.datasetIndex-1].data[g.dataIndex]??0:0;return` ${g.dataset.label}: ${E(g.parsed.y-h)}`}}}},scales:{x:{ticks:{color:"#555d77",maxTicksLimit:12},grid:{display:!1}},y:{ticks:{color:"#555d77",callback:g=>E(g)},grid:{color:"#252a38"}}}}});return Ao.set(t,d),d}const Ue=t=>E(t/100),ki={CUOTA_POR_FECHA:"Cuota para llegar a la fecha",ABSORBE_TODO:"Se lleva todo lo disponible",ABSORBE_RESIDUAL:"Recibe lo que sobre",FIJO:"Importe fijo al mes"},Bi={CUOTA_POR_FECHA:"Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.",ABSORBE_RESIDUAL:"No reclama nada; recoge lo que quede tras servir a los de prioridad superior.",FIJO:"Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene."},Mo={COMPLETADO:"var(--accent)",EN_CURSO:"var(--text)",PENDIENTE:"var(--text3)",INVIABLE:"var(--red)"};function Hi(t,a){if(t.objetivos.length===0)return`<div class="card" style="text-align:center;padding:34px 20px">
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
    ${e.map(n=>{var i;return Gi(n,a,o,(i=s(n.vehiculoId))==null?void 0:i.nombre)}).join("")}`}function Gi(t,a,e,o){const s=me(t),n=a.estadoFinal[t._id]??t.estado,i=e==null?void 0:e.asignaciones.find(m=>m.objetivoId===t._id),r=(i==null?void 0:i.solicitado)??0,u=a.hitos.find(m=>m.objetivoId===t._id),l=s>0?Math.min(100,t.saldoActual/s*100):0,x=a.avisos.filter(m=>m.objetivoId===t._id);return`
    <div class="card mb-10" draggable="true" data-pl-objetivo="${c(t._id)}"
         style="padding:14px 16px;border-left:3px solid ${Mo[n]??"var(--text3)"};cursor:grab">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span title="Arrastra para cambiar la prioridad" style="color:var(--text3);cursor:grab;user-select:none">⠿</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3)">#${c(t.prioridad)}</span>
            <span style="font-weight:700;font-size:14px">${c(t.nombre)}</span>
            <span class="badge" style="font-size:10px;background:var(--bg3);color:var(--text2)">${c(ki[t.modoAsignacion])}</span>
            ${n==="INVIABLE"?'<span class="badge badge-red" style="font-size:10px">no llega</span>':""}
            ${n==="COMPLETADO"?'<span class="badge badge-green" style="font-size:10px">completado</span>':""}
          </div>
          <div class="text-sm" style="color:var(--text3);margin-top:4px">${c(Bi[t.modoAsignacion])}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:17px;font-weight:700">${c(s>0?Ue(s):"— sin meta —")}</div>
          ${t.fechaLimite?`<div class="text-sm" style="color:var(--text3)">para ${c(t.fechaLimite)}</div>`:""}
          <button class="btn-secondary btn-sm" data-pl-editar-objetivo="${c(t._id)}" style="margin-top:6px;font-size:11px;padding:2px 9px">Editar</button>
        </div>
      </div>

      ${s>0?`<div class="goal-bar" style="margin-top:10px"><div class="goal-bar-fill" style="width:${l.toFixed(1)}%;background:${Mo[n]??"var(--accent)"}"></div></div>`:""}

      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:12px">
        <div><span style="color:var(--text3)">Pide ahora:</span> <strong style="font-family:var(--font-mono)">${c(Ue(r))}</strong>/mes</div>
        <div><span style="color:var(--text3)">Ya acumulado:</span> <span style="font-family:var(--font-mono)">${c(Ue(t.saldoActual))}</span></div>
        ${o?`<div><span style="color:var(--text3)">Vehículo:</span> ${c(o)}</div>`:""}
        ${u?`<div><span style="color:var(--text3)">Se completa:</span> <strong style="color:var(--accent)">${c(u.mes)}</strong></div>`:""}
      </div>

      ${x.length>0?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${x.map(m=>`⚠ ${c(m.mensaje)}`).join("<br>")}
             </div>`:""}
      ${t.notas?`<div class="text-sm" style="color:var(--text3);margin-top:8px;white-space:pre-wrap">${c(t.notas)}</div>`:""}
    </div>`}const It=t=>E(t/100);function Vi(t,a){return`
    ${Ui(a)}
    ${Yi(t,a)}
    <div class="card mb-14">
      <div class="card-title mb-12">Patrimonio por vehículo</div>
      <div class="chart-wrap-lg"><canvas id="pl-chart"></canvas></div>
    </div>
    ${Ji(a)}
    ${Wi(t,a)}
    ${Qi(t,a)}`}function Ui(t){if(t.avisos.length===0&&t.propuestas.length===0)return"";const a={error:"var(--red)",atencion:"var(--yellow)",info:"var(--text2)"},e=t.avisos.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:5px">
        <span style="color:${a[i.severidad]};flex-shrink:0">${i.severidad==="error"?"✕":"⚠"}</span>
        <span style="color:var(--text2)">${c(i.mensaje)}</span>
      </div>`).join(""),o=t.propuestas.length>0?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
           <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Cómo hacerlo encajar — elige una:</div>
           ${t.propuestas.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:4px">
             <span style="color:var(--accent);flex-shrink:0">→</span><span style="color:var(--text2)">${c(i.mensaje)}</span>
           </div>`).join("")}
         </div>`:"",s=t.viable?"rgba(255,209,102,0.28)":"rgba(255,77,109,0.3)";return`<div class="card mb-14" style="background:${t.viable?"rgba(255,209,102,0.05)":"rgba(255,77,109,0.05)"};border-color:${s}">
    <div class="card-title mb-8">${t.viable?"Cosas a revisar":"El plan no cabe en tu flujo de caja"}</div>
    ${e}${o}
  </div>`}function Yi(t,a){const e=(s,n,i="")=>`<div class="stat-card">
      <div class="stat-label">${c(s)}</div>
      <div class="stat-value" style="font-size:18px">${c(n)}</div>
      ${i?`<div class="stat-sub">${c(i)}</div>`:""}
    </div>`,o=a.serieMensual[a.serieMensual.length-1];return`<div class="grid-4 mb-14">
    ${e("Patrimonio final",It(a.resumen.patrimonioFinal),o?`en ${o.mes}`:"")}
    ${e("Total aportado",It(a.resumen.totalAportado),`${a.mesesSimulados} meses simulados`)}
    ${e("Total a disfrute",It(a.resumen.totalDisfrute),`${Math.round(t.pctDisfrute*100)} % del sobrante`)}
    ${e("Independencia",a.resumen.mesIndependencia??"—",a.resumen.mesIndependencia?"objetivo perpetuo cubierto":"sin objetivo de independencia")}
  </div>`}function Ji(t){return t.hitos.length===0?`<div class="card mb-14"><div class="card-title mb-8">Hitos</div>
      <div class="text-sm" style="color:var(--text3)">Ningún objetivo se completa dentro del horizonte.</div></div>`:`<div class="card mb-14">
    <div class="card-title mb-12">Hitos</div>
    ${t.hitos.map(a=>`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div style="display:flex;align-items:center;gap:9px">
          <span style="font-family:var(--font-mono);color:var(--accent);font-size:11px">${c(a.mes)}</span>
          <span style="font-weight:600">${c(a.nombre)}</span>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono)">${c(It(a.importeFinal))}</div>
          ${a.cuotaLiberada>0?`<div style="font-size:10px;color:var(--text3)">libera ${c(It(a.cuotaLiberada))}/mes</div>`:""}
        </div>
      </div>`).join("")}
  </div>`}function Wi(t,a){if(a.fases.length<=1)return"";const e=o=>{var s;return((s=t.objetivos.find(n=>n._id===o))==null?void 0:s.nombre)??o};return`<div class="card mb-14">
    <div class="card-title mb-12">Fases del plan</div>
    <div class="text-sm mb-10" style="color:var(--text3)">Tramos entre hitos: en cada uno el dinero se reparte de forma distinta.</div>
    ${a.fases.map((o,s)=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);flex-shrink:0;width:26px">${s+1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${c(o.desde)} → ${c(o.hasta)} <span style="color:var(--text3);font-weight:400">(${o.meses} mes${o.meses!==1?"es":""})</span></div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">${c(o.objetivosActivos.map(e).join(" · ")||"sin asignaciones")}</div>
        </div>
      </div>`).join("")}
  </div>`}const Ye=60;function Qi(t,a){if(a.serieMensual.length===0)return"";const e=[...t.objetivos].sort((r,u)=>r.prioridad-u.prioridad),o=a.serieMensual.slice(0,Ye),s=["Mes","Disponible",...e.map(r=>r.nombre),"Sin asignar","Patrimonio"].map(r=>`<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${c(r)}</th>`).join(""),n=o.map(r=>{const u=e.map(l=>{const x=r.asignaciones.find(d=>d.objetivoId===l._id),m=(x==null?void 0:x.asignado)??0;return`<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${m>0?"var(--text)":"var(--text3)"}">${c(m>0?It(m):"·")}</td>`}).join("");return`<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${c(r.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${c(It(r.disponible))}</td>
        ${u}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${c(r.sinAsignar>0?It(r.sinAsignar):"·")}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${c(It(r.patrimonioTotal))}</td>
      </tr>`}).join(""),i=a.serieMensual.length>Ye?`<div class="text-sm" style="color:var(--text3);margin-top:8px">Se muestran los primeros ${Ye} de ${a.serieMensual.length} meses. Exporta el CSV para verlos todos.</div>`:"";return`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Mes a mes</span>
      <button class="btn-secondary btn-sm" data-pl-csv>Exportar CSV</button>
    </div>
    <div style="overflow-x:auto">
      <table style="width:100%;border-collapse:collapse;font-size:11px">
        <thead><tr style="border-bottom:1px solid var(--border2)">${s}</tr></thead>
        <tbody>${n}</tbody>
      </table>
    </div>
    ${i}
  </div>`}function Ki(t,a){const e=[...t.objetivos].sort((i,r)=>i.prioridad-r.prioridad),o=i=>(i/100).toFixed(2).replace(".",","),s=["Mes","Neto","Gastos fijos","Disfrute","Disponible",...e.map(i=>i.nombre),"Sin asignar","Patrimonio"],n=a.serieMensual.map(i=>[i.mes,o(i.netoMensual),o(i.gastosFijos),o(i.disfrute),o(i.disponible),...e.map(r=>{var u;return o(((u=i.asignaciones.find(l=>l.objetivoId===r._id))==null?void 0:u.asignado)??0)}),o(i.sinAsignar),o(i.patrimonioTotal)].join(";"));return[s.join(";"),...n].join(`
`)}const Lt=t=>{const a=typeof t=="number"?t:parseFloat(String(t).replace(",","."));return Number.isFinite(a)?Math.round(a*100):0},oe=t=>(t/100).toFixed(2),So=t=>(t*100).toFixed(2),kt=t=>{const a=parseFloat(String(t).replace(",","."));return Number.isFinite(a)?a/100:0},Xi=[["AHORRO_OBJETIVO","Ahorrar una cantidad"],["AMORTIZAR_DEUDA","Amortizar deuda"],["INVERSION_PERPETUA","Independencia económica"],["APORTACION_FIJA","Aportación periódica"]],Zi=[["CUOTA_POR_FECHA","Cuota para llegar a la fecha"],["ABSORBE_TODO","Se lleva todo lo disponible"],["ABSORBE_RESIDUAL","Recibe lo que sobre"],["FIJO","Importe fijo al mes"]],tr=[["INMEDIATA","Inmediata"],["MEDIA","Media (con preaviso o penalización)"],["BLOQUEADA_HASTA_JUBILACION","Bloqueada hasta la jubilación"]],er=[["NULO","Nulo"],["BAJO","Bajo"],["MEDIO","Medio"],["ALTO","Alto"]],wo={AHORRO_OBJETIVO:"CUOTA_POR_FECHA",AMORTIZAR_DEUDA:"ABSORBE_TODO",INVERSION_PERPETUA:"ABSORBE_RESIDUAL",APORTACION_FIJA:"FIJO"},rt=(t,a,e,o,s="",n="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${a}</label>
    <input class="form-input" id="${t}" type="${e}" value="${c(o)}" ${n}>
    ${s?`<div class="text-sm mt-4" style="color:var(--text3)">${s}</div>`:""}
  </div>`,_t=(t,a,e,o,s="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${a}</label>
    <select class="form-input" id="${t}">
      ${e.map(([n,i])=>`<option value="${c(n)}"${n===o?" selected":""}>${c(i)}</option>`).join("")}
    </select>
    ${s?`<div class="text-sm mt-4" style="color:var(--text3)">${s}</div>`:""}
  </div>`;function ar(t,a,e){var u,l,x;const o=t===null,s=(t==null?void 0:t.tipo)??"AHORRO_OBJETIVO",n=(t==null?void 0:t.modoAsignacion)??wo[s],i=!!(t!=null&&t.rentaDeseada),r=a.length>0?a.map(m=>[m._id,m.nombre]):[["","— no hay vehículos: crea uno primero —"]];return`
    <div class="grid-2" style="gap:10px">
      ${rt("ob-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Entrada del piso"')}
      ${rt("ob-prioridad","Prioridad","number",(t==null?void 0:t.prioridad)??e,"Menor número = se sirve antes",'min="1"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${_t("ob-tipo","Tipo",Xi,s)}
      ${_t("ob-modo","Cómo pide dinero",Zi,n)}
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
            ${rt("ob-renta","Renta neta mensual (€)","number",oe(((u=t==null?void 0:t.rentaDeseada)==null?void 0:u.rentaNetaMensual)??2e5),"",'step="0.01"')}
            ${rt("ob-swr","Tasa de retiro seguro (%)","number",((((l=t==null?void 0:t.rentaDeseada)==null?void 0:l.tasaRetiroSeguro)??.04)*100).toFixed(2),"",'step="0.1"')}
          </div>
          ${rt("ob-fiscal","Tipo fiscal efectivo al retirar (%)","number",((((x=t==null?void 0:t.rentaDeseada)==null?void 0:x.tipoFiscalEfectivo)??.2)*100).toFixed(2),"",'step="0.5"')}
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
        ${rt("ob-importe","Importe objetivo (€)","number",oe((t==null?void 0:t.importeObjetivo)??0),"Deja 0 si no tiene meta (un cubo perpetuo)",'step="0.01"')}
      </div>
      ${rt("ob-fecha","Fecha límite","month",(t==null?void 0:t.fechaLimite)??"","Vacío = lo antes posible")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${rt("ob-saldo","Ya acumulado (€)","number",oe((t==null?void 0:t.saldoActual)??0),"Con lo que arranca el objetivo",'step="0.01"')}
      ${_t("ob-vehiculo","Vehículo",r,(t==null?void 0:t.vehiculoId)??r[0][0])}
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-fijo" style="display:${n==="FIJO"?"block":"none"}">
        ${rt("ob-fijo","Importe fijo mensual (€)","number",oe((t==null?void 0:t.importeFijoMensual)??0),"",'step="0.01"')}
      </div>
      <div id="ob-bloque-residual" style="display:${n==="ABSORBE_RESIDUAL"?"block":"none"}">
        ${rt("ob-peso","Peso del residual","number",(t==null?void 0:t.pesoResidual)??1,"Si hay varios, reparte en proporción",'min="0" step="0.5"')}
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
    </div>`}function or(t,a,e){var l;const o=x=>{var m;return((m=t.querySelector(`#${x}`))==null?void 0:m.value)??""},s=o("ob-nombre").trim();if(!s)return null;const n=o("ob-tipo"),i=o("ob-modo"),r=((l=t.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:l.value)==="renta",u=n==="INVERSION_PERPETUA"&&r;return{_id:(a==null?void 0:a._id)??`obj_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:s,tipo:n,importeObjetivo:u?null:Lt(o("ob-importe")),fechaLimite:o("ob-fecha")||null,prioridad:Math.max(1,Number(o("ob-prioridad"))||e),modoAsignacion:i,vehiculoId:o("ob-vehiculo"),saldoActual:Lt(o("ob-saldo")),estado:(a==null?void 0:a.estado)??"PENDIENTE",notas:o("ob-notas"),...i==="FIJO"?{importeFijoMensual:Lt(o("ob-fijo"))}:{},...i==="ABSORBE_RESIDUAL"?{pesoResidual:Math.max(0,Number(o("ob-peso"))||1)}:{},...u?{rentaDeseada:{rentaNetaMensual:Lt(o("ob-renta")),tasaRetiroSeguro:kt(o("ob-swr")),tipoFiscalEfectivo:kt(o("ob-fiscal"))}}:{rentaDeseada:null}}}function sr(t){const a=e=>{var o;return((o=t.querySelector(`#${e}`))==null?void 0:o.value)??""};try{const{capitalNecesario:e}=ho({rentaNetaMensual:Lt(a("ob-renta")),tasaRetiroSeguro:kt(a("ob-swr")),tipoFiscalEfectivo:kt(a("ob-fiscal"))});return`${(e/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0})} €`}catch{return"no calculable con esos parámetros"}}function nr(t,a,e){const o=t===null,s=!!(t!=null&&t.esDeuda),n=[["","— ninguna —"],...a.map(r=>[r._id,r.nombre])],i=[["","— ninguno —"],...e.map(r=>[r._id,`${r.nombre} (${r.tin} % TIN)`])];return`
    <div class="card mb-12" style="background:rgba(0,229,160,0.05);border-color:rgba(0,229,160,0.22);padding:12px">
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
      ${_t("ve-prestamo","Préstamo",i,(t==null?void 0:t.prestamoId)??"","Su TIN se usará como rentabilidad")}
    </div>

    ${rt("ve-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Fondo indexado"')}

    <div class="grid-2" style="gap:10px">
      ${rt("ve-rent","Rentabilidad REAL anual (%)","number",So((t==null?void 0:t.rentabilidadRealAnual)??0),"Nominal menos inflación. Un fondo al 7 % nominal con 2 % de inflación son 5 %",'step="0.1"')}
      ${rt("ve-fiscal","Fiscalidad al retirar (%)","number",So((t==null?void 0:t.fiscalidadRetirada)??0),"Tipo efectivo sobre la plusvalía",'step="0.5"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${_t("ve-liquidez","Liquidez",tr,(t==null?void 0:t.liquidez)??"INMEDIATA")}
      ${_t("ve-riesgo","Riesgo",er,(t==null?void 0:t.riesgo)??"NULO")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${rt("ve-tope","Tope de aportación anual (€)","number",t!=null&&t.topeAportacionAnual?oe(t.topeAportacionAnual):"","Vacío = sin tope. Pensiones: 1500",'step="0.01"')}
      ${_t("ve-cuenta","Cuenta asociada",n,(t==null?void 0:t.cuentaId)??"","Enlaza con una cuenta que ya tengas")}
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ve-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ve-cancelar>Cancelar</button>
      <button class="btn-primary" data-ve-guardar>${o?"Crear vehículo":"Guardar"}</button>
    </div>`}function ir(t,a){var i;const e=r=>{var u;return((u=t.querySelector(`#${r}`))==null?void 0:u.value)??""},o=e("ve-nombre").trim();if(!o)return null;const s=((i=t.querySelector("#ve-deuda"))==null?void 0:i.checked)??!1,n=e("ve-tope").trim();return{_id:(a==null?void 0:a._id)??`veh_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:o,rentabilidadRealAnual:kt(e("ve-rent")),liquidez:e("ve-liquidez"),fiscalidadRetirada:kt(e("ve-fiscal")),topeAportacionAnual:n?Lt(n):null,riesgo:e("ve-riesgo"),cuentaId:e("ve-cuenta")||null,prestamoId:s&&e("ve-prestamo")||null,esDeuda:s}}const rr={CUOTA_POR_FECHA:"Cada mes calcula lo que hace falta para llegar a la fecha, con el saldo que lleva. Si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo lo disponible hasta completarse. Los de menor prioridad no reciben nada mientras tanto.",ABSORBE_RESIDUAL:"No reclama nada: recoge lo que quede tras servir a los de arriba. Es el modo del cubo de largo plazo.",FIJO:"Aporta siempre lo mismo. Si el vehículo tiene tope anual, se aporta hasta agotarlo y se reanuda en enero."},lr="M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z",Co=t=>{const a=parseFloat(String(t).replace(",","."));return Number.isFinite(a)?Math.round(a*100):0},ve=t=>(t/100).toFixed(2);function cr(t){const a=t.hoy??V;let e="config",o=null;function s(){const p=t.store.get("planes");return p.find(S=>S.activo)??p[0]??null}function n(){const p=s();return p||t.store.addItem("planes",{nombre:"Plan base",fechaInicio:a().slice(0,7),horizonteMeses:480,pctDisfrute:0,activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:[],objetivos:[],eventos:[],creadoEn:a()})}function i(p){var I;const S=s();S&&(t.store.updateItem("planes",S._id,p),o=null,(I=t.onDatosCambiados)==null||I.call(t))}function r(){const S=t.store.get("nominas").filter(C=>C.activo).reduce((C,F)=>C+(F.bruto||0),0),I=Math.round(S*.75/12),w=t.store.get("expenses").filter(C=>C.activo&&C.basico&&C.tipo==="gasto").reduce((C,F)=>C+(F.cuantia||0),0);return{neto:Math.round(I*100),gastos:Math.round(w*100)}}function u(p){return o||(o=Ti(p)),o}function l(p){const S=r(),I=Math.max(0,p.perfil.netoMensual-p.perfil.gastosFijosMensuales),w=Math.round(p.pctDisfrute*100);return`
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${c(ve(p.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${c(E(S.neto/100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${c(ve(p.perfil.gastosFijosMensuales))}">
            <div class="text-sm mt-4" style="color:var(--text3)">Según tus gastos básicos: ~${c(E(S.gastos/100))}/mes</div>
          </div>
        </div>

        <div class="form-group mt-8">
          <label class="form-label">Disfrute: <span id="pl-pct-val" style="font-family:var(--font-mono);color:var(--accent)">${w} %</span> del sobrante</label>
          <input type="range" id="pl-disfrute" min="0" max="100" step="1" value="${w}" style="width:100%;accent-color:var(--accent)">
          <div class="text-sm mt-4" style="color:var(--text3)">
            Lo que NO se asigna a objetivos. Con ${c(E(Math.max(0,p.perfil.netoMensual-p.perfil.gastosFijosMensuales)/100))} de sobrante,
            quedan <strong id="pl-disponible">${c(E(I*(1-p.pctDisfrute)/100))}</strong>/mes para los objetivos.
          </div>
        </div>

        <div class="grid-2 mt-8" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Mes de inicio</label>
            <input class="form-input" type="month" id="pl-inicio" value="${c(p.fechaInicio)}">
          </div>
          <div class="form-group">
            <label class="form-label">Horizonte (meses)</label>
            <input class="form-input" type="number" id="pl-horizonte" min="1" max="600" value="${c(p.horizonteMeses)}">
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

      ${x(p)}`}function x(p){return`
      <div class="card">
        <div class="card-title mb-8">Notas del plan</div>
        <textarea class="form-input" id="pl-notas" rows="4" style="resize:vertical;font-family:var(--font-sans)"
          placeholder="Supuestos, decisiones tomadas, cosas a revisar…">${c(p.notas??"")}</textarea>
        <button class="btn-secondary btn-sm mt-8" data-pl-guardar-notas>Guardar notas</button>
      </div>`}const m=()=>document.getElementById("modal-overlay"),d=()=>document.getElementById("modal-content"),g=()=>{var p;return(p=m())==null?void 0:p.classList.add("hidden")};function h(p,S){const I=m(),w=d();return!I||!w?null:(w.innerHTML=`<div class="modal-title">${c(p)}</div>${S}`,I.classList.remove("hidden"),w)}function $(p){i({objetivos:p})}function M(p,S){const I=s();if(!I)return;const w=S?I.objetivos.find(_=>_._id===S)??null:null,C=I.objetivos.reduce((_,D)=>Math.max(_,D.prioridad),0)+1,F=h(w?`Editar «${w.nombre}»`:"Nuevo objetivo",ar(w,I.vehiculos,C));if(!F)return;const z=()=>{var B;const _=(B=F.querySelector("#ob-modo"))==null?void 0:B.value,D=F.querySelector("#ob-modo-ayuda");D&&_&&(D.textContent=rr[_]);const N=(T,q)=>{const k=F.querySelector(T);k&&(k.style.display=q?"block":"none")};N("#ob-bloque-fijo",_==="FIJO"),N("#ob-bloque-residual",_==="ABSORBE_RESIDUAL")};z();const j=()=>{const _=F.querySelector("#ob-capital-derivado");_&&(_.textContent=sr(F))};j(),U(F,"#ob-modo",z),U(F,"#ob-tipo",()=>{const _=F.querySelector("#ob-tipo").value,D=F.querySelector("#ob-modo");D&&(D.value=wo[_]);const N=F.querySelector("#ob-bloque-perpetua");N&&(N.style.display=_==="INVERSION_PERPETUA"?"block":"none"),z()}),U(F,'input[name="ob-derivar"]',()=>{var B;const _=((B=F.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:B.value)==="renta",D=F.querySelector("#ob-renta-campos"),N=F.querySelector("#ob-bloque-importe");D&&(D.style.display=_?"block":"none"),N&&(N.style.display=_?"none":"block"),j()}),U(F,"#ob-renta, #ob-swr, #ob-fiscal",j),P(F,"[data-ob-cancelar]",g),P(F,"[data-ob-guardar]",()=>{const _=or(F,w,C);if(!_){R("El objetivo necesita un nombre","err");return}if(!_.vehiculoId){R("Crea antes un vehículo donde meter el dinero","err");return}const D=I.objetivos.filter(N=>N._id!==_._id);$([...D,_]),g(),R(w?"Objetivo actualizado":`Objetivo «${_.nombre}» creado`),A(p)}),P(F,"[data-ob-borrar]",()=>{w&&Z(`¿Borrar «${w.nombre}»? Esto no se puede deshacer.`)&&($(I.objetivos.filter(_=>_._id!==w._id)),g(),R("Objetivo borrado"),A(p))})}function f(p,S){const I=s();if(!I)return;const w=S?I.vehiculos.find(j=>j._id===S)??null:null,C=t.store.get("accounts").filter(j=>j.activo).map(j=>({_id:j._id,nombre:j.nombre})),F=t.store.get("loans").filter(j=>j.activo&&!j.simulacion).map(j=>({_id:j._id,nombre:j.nombre,tin:j.tin})),z=h(w?`Editar «${w.nombre}»`:"Nuevo vehículo",nr(w,C,F));z&&(U(z,"#ve-deuda",()=>{const j=z.querySelector("#ve-deuda").checked,_=z.querySelector("#ve-bloque-prestamo");_&&(_.style.display=j?"block":"none")}),U(z,"#ve-prestamo",()=>{const j=z.querySelector("#ve-prestamo").value,_=F.find(B=>B._id===j);if(!_)return;const D=z.querySelector("#ve-rent"),N=z.querySelector("#ve-nombre");D&&(D.value=String(_.tin)),N&&!N.value.trim()&&(N.value=`Amortizar ${_.nombre}`)}),P(z,"[data-ve-cancelar]",g),P(z,"[data-ve-guardar]",()=>{const j=ir(z,w);if(!j){R("El vehículo necesita un nombre","err");return}const _=I.vehiculos.filter(D=>D._id!==j._id);i({vehiculos:[..._,j]}),g(),R(w?"Vehículo actualizado":`Vehículo «${j.nombre}» creado`),A(p)}),P(z,"[data-ve-borrar]",()=>{if(!w)return;const j=I.objetivos.filter(_=>_.vehiculoId===w._id);if(j.length>0){R(`No se puede borrar: lo usan ${j.length} objetivo${j.length!==1?"s":""}`,"err");return}Z(`¿Borrar el vehículo «${w.nombre}»?`)&&(i({vehiculos:I.vehiculos.filter(_=>_._id!==w._id)}),g(),R("Vehículo borrado"),A(p))}))}function b(p,S,I){const w=s();if(!w||S===I)return;const C=[...w.objetivos].sort((_,D)=>_.prioridad-D.prioridad),F=C.findIndex(_=>_._id===S),z=C.findIndex(_=>_._id===I);if(F<0||z<0)return;const[j]=C.splice(F,1);C.splice(z,0,j),$(C.map((_,D)=>({..._,prioridad:D+1}))),A(p)}function y(p){return p.vehiculos.length===0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.06);border-color:rgba(255,209,102,0.28)">
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          <strong style="color:var(--yellow)">No hay vehículos todavía.</strong>
          Un vehículo es dónde va el dinero —una cuenta, un fondo, un plan de pensiones o la amortización de un
          préstamo— y con qué rentabilidad crece. Hace falta al menos uno para poder crear objetivos.
        </div>
      </div>`:`<div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Vehículos</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${p.vehiculos.map(S=>{const I=p.objetivos.filter(w=>w.vehiculoId===S._id).length;return`<button class="btn-secondary btn-sm" data-pl-editar-vehiculo="${c(S._id)}"
              style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 11px;text-align:left">
              <span style="font-weight:600;font-size:12px">${c(S.nombre)}${S.esDeuda?" 🔒":""}</span>
              <span style="font-size:10px;color:var(--text3)">
                ${c((S.rentabilidadRealAnual*100).toFixed(2))} % real · ${I} objetivo${I!==1?"s":""}
              </span>
            </button>`}).join("")}
      </div>
    </div>`}function A(p){const S=n(),I=u(S),w=(F,z)=>`<button class="period-btn ${e===F?"active":""}" data-pl-tab="${F}">${z}</button>`,C=I.viable?'<span class="badge badge-green">Plan viable</span>':'<span class="badge badge-red">No cabe en el flujo</span>';if(p.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Objetivos <span>financieros</span></h1>
        <div class="page-actions">${C}</div>
      </div>

      <div class="period-selector mb-14">
        ${w("config","Plan")}
        ${w("objetivos",`Objetivos (${S.objetivos.length})`)}
        ${w("simulacion","Simulación")}
      </div>

      ${e==="objetivos"?`<div class="flex gap-8 mb-14 flex-wrap">
               <button class="btn-primary" data-pl-nuevo-objetivo>+ Nuevo objetivo</button>
               <button class="btn-secondary" data-pl-nuevo-vehiculo>+ Nuevo vehículo</button>
             </div>
             ${y(S)}`:""}

      <div id="pl-cuerpo">${e==="config"?l(S):e==="objetivos"?Hi(S,I):Vi(S,I)}</div>`,e==="simulacion"){const F=p.querySelector("#pl-chart");F&&Li(F,S,I)}v(p)}function v(p){P(p,"[data-pl-tab]",I=>{e=I.dataset.plTab,A(p)}),U(p,"#pl-disfrute",I=>{const w=Number(I.value)/100,C=p.querySelector("#pl-pct-val");C&&(C.textContent=`${Math.round(w*100)} %`);const F=s();if(!F)return;const z=Math.max(0,F.perfil.netoMensual-F.perfil.gastosFijosMensuales)*(1-w),j=p.querySelector("#pl-disponible");j&&(j.textContent=E(z/100))}),P(p,"[data-pl-usar-sugerido]",()=>{const I=r(),w=p.querySelector("#pl-neto"),C=p.querySelector("#pl-gastos");w&&(w.value=ve(I.neto)),C&&(C.value=ve(I.gastos))}),P(p,"[data-pl-guardar]",()=>{const I=w=>{var C;return((C=p.querySelector(w))==null?void 0:C.value)??""};i({perfil:{netoMensual:Co(I("#pl-neto")),gastosFijosMensuales:Co(I("#pl-gastos")),manual:!0},pctDisfrute:Math.min(1,Math.max(0,Number(I("#pl-disfrute"))/100)),fechaInicio:I("#pl-inicio")||a().slice(0,7),horizonteMeses:Math.min(600,Math.max(1,Number(I("#pl-horizonte"))||480))}),R("Plan guardado"),A(p)}),P(p,"[data-pl-nuevo-objetivo]",()=>M(p,null)),P(p,"[data-pl-nuevo-vehiculo]",()=>f(p,null)),P(p,"[data-pl-editar-vehiculo]",I=>f(p,I.dataset.plEditarVehiculo??null)),P(p,"[data-pl-editar-objetivo]",I=>M(p,I.dataset.plEditarObjetivo??null));let S=null;p.querySelectorAll("[data-pl-objetivo]").forEach(I=>{I.addEventListener("dragstart",()=>{S=I.dataset.plObjetivo??null,I.style.opacity="0.45"}),I.addEventListener("dragend",()=>{I.style.opacity="",p.querySelectorAll("[data-pl-objetivo]").forEach(w=>w.style.borderTop="")}),I.addEventListener("dragover",w=>{w.preventDefault(),S&&I.dataset.plObjetivo!==S&&(I.style.borderTop="2px solid var(--accent)")}),I.addEventListener("dragleave",()=>{I.style.borderTop=""}),I.addEventListener("drop",w=>{w.preventDefault(),I.style.borderTop="";const C=I.dataset.plObjetivo;S&&C&&b(p,S,C),S=null})}),P(p,"[data-pl-csv]",()=>{const I=s();if(!I||!o)return;const w=new Blob(["\uFEFF"+Ki(I,o)],{type:"text/csv;charset=utf-8"}),C=URL.createObjectURL(w),F=document.createElement("a");F.href=C,F.download=`plan-${I.nombre.replace(/[^\w-]+/g,"_")}-${a()}.csv`,F.click(),URL.revokeObjectURL(C),R(`CSV exportado (${o.serieMensual.length} meses)`)}),P(p,"[data-pl-guardar-notas]",()=>{var I;i({notas:((I=p.querySelector("#pl-notas"))==null?void 0:I.value)??""}),R("Notas guardadas")})}return{id:"planner",route:"planner",nombre:"Objetivos financieros",seccion:2,iconoPath:lr,mount:A}}function Fo(t,a,e=!1){const o=Math.abs($t(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function dr(t){function a(y){return`${y}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(y={}){var v;const A=(v=y.texto)==null?void 0:v.trim().toLowerCase();return t.get("transacciones").filter(p=>!(y.cuentaId&&p.cuentaId!==y.cuentaId||y.desde&&p.fecha<y.desde||y.hasta&&p.fecha>y.hasta||y.tipo&&p.tipo!==y.tipo||y.estimacionId&&p.estimacionId!==y.estimacionId||y.tags&&y.tags.length>0&&!y.tags.some(S=>p.tags.includes(S))||A&&!p.concepto.toLowerCase().includes(A))).sort((p,S)=>p.fecha.localeCompare(S.fecha)||p._id.localeCompare(S._id))}function o(y){const A={_id:a("tx"),fecha:y.fecha,cuentaId:y.cuentaId,importeCts:Fo(y.tipo,y.importe,y.negativo),concepto:y.concepto,tags:y.tags??[],estimacionId:y.estimacionId??null,tipo:y.tipo,origen:y.origen??"manual",...y.nota?{nota:y.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),A]),A}function s(y,A){t.set("transacciones",t.get("transacciones").map(v=>{if(v._id!==y)return v;const{importe:p,...S}=A,I={...v,...S};return p!==void 0&&(I.importeCts=Fo(I.tipo,p,I.importeCts<0)),I}))}function n(y){t.set("transacciones",t.get("transacciones").filter(A=>A._id!==y))}function i(y,A){s(y,{estimacionId:A})}function r(y){return t.get("puntosControl").filter(A=>!y||A.cuentaId===y).sort((A,v)=>A.fecha.localeCompare(v.fecha))}function u(y,A,v,p){const S={_id:a("pc"),fecha:A,cuentaId:y,saldoCts:$t(v),...p?{nota:p}:{}},I=t.get("puntosControl").filter(w=>!(w.cuentaId===y&&w.fecha===A));return t.set("puntosControl",[...I,S].sort((w,C)=>w.fecha.localeCompare(C.fecha))),x(y),S}function l(y){const A=t.get("puntosControl").find(v=>v._id===y);t.set("puntosControl",t.get("puntosControl").filter(v=>v._id!==y)),A&&x(A.cuentaId)}function x(y){const A=r(y),v=t.get("accounts");v.some(p=>p._id===y)&&t.set("accounts",v.map(p=>p._id===y?{...p,historicoSaldos:A.map(S=>({_id:S._id,fecha:S.fecha,saldo:at(S.saldoCts),...S.nota?{nota:S.nota}:{}}))}:p))}function m(y,A=V()){const v=r(y).filter(w=>w.fecha<=A).pop(),p=v==null?void 0:v.fecha,S=(v==null?void 0:v.saldoCts)??0;return t.get("transacciones").filter(w=>w.cuentaId===y&&w.fecha<=A&&(p===void 0||w.fecha>p)).reduce((w,C)=>w+C.importeCts,S)}function d(y,A){return at(m(y,A))}function g(y=V(),A){const v=A??t.get("accounts").filter(p=>p.activo).map(p=>p._id);return at(v.reduce((p,S)=>p+m(S,y),0))}function h(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function $(){const y=[...t.get("transacciones").map(A=>A.fecha),...t.get("puntosControl").map(A=>A.fecha)];return y.length>0?y.sort().pop()??null:null}function M(y={}){return at(e(y).reduce((A,v)=>A+v.importeCts,0))}function f(y={}){const A=new Map;for(const v of e(y)){const p=v.fecha.slice(0,7);A.set(p,(A.get(p)??0)+v.importeCts)}return new Map([...A.entries()].sort(([v],[p])=>v.localeCompare(p)).map(([v,p])=>[v,at(p)]))}function b(y={}){const A=new Map;for(const v of e(y))for(const p of v.tags.length>0?v.tags:["sin_tag"])A.set(p,(A.get(p)??0)+v.importeCts);return new Map([...A.entries()].map(([v,p])=>[v,at(p)]))}return{transacciones:e,registrar:o,actualizar:s,eliminar:n,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:u,eliminarPuntoControl:l,saldoCuenta:d,saldoCuentaCts:m,saldoTotal:g,tieneDatos:h,ultimaFecha:$,total:M,totalPorMes:f,totalPorTag:b}}function yt(t){return t.trim().toLowerCase()}function ur(t){function a(){const l=new Map,x=(m,d)=>{const g=yt(m);if(!g)return;const h=l.get(g)??{tag:g,estimaciones:0,reales:0,total:0};h[d]+=1,h.total+=1,l.set(g,h)};for(const m of t.get("expenses"))for(const d of m.tags??[])x(d,"estimaciones");for(const m of t.get("transacciones"))for(const d of m.tags??[])x(d,"reales");return[...l.values()].sort((m,d)=>d.total-m.total||m.tag.localeCompare(d.tag))}function e(){return a().map(l=>l.tag)}function o(l){return a().filter(x=>l==="estimaciones"?x.reales===0:x.estimaciones===0).map(x=>x.tag)}function s(l,x,m){const d=yt(x),g=(l??[]).map(yt);if(!g.includes(d))return l??[];const h=g.filter($=>$!==d);return m===null?[...new Set(h)]:[...new Set([...h,yt(m)])]}function n(l,x){const m=yt(x);if(!m)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return u(l,m)}function i(l,x){let m=0;for(const d of l)yt(d)!==yt(x)&&(m+=u(d,yt(x)).cambiados);return{cambiados:m}}function r(l){return u(l,null)}function u(l,x){let m=0;const d=t.get("expenses").map(S=>{const I=s(S.tags,l,x);return I!==S.tags&&(m+=1),I===S.tags?S:{...S,tags:I}});t.set("expenses",d);const g=t.get("transacciones").map(S=>{const I=s(S.tags,l,x);return I!==S.tags&&(m+=1),I===S.tags?S:{...S,tags:I}});t.set("transacciones",g);const h=t.get("loans").map(S=>{const I=s(S.tags,l,x);return I!==S.tags&&(m+=1),I===S.tags?S:{...S,tags:I}});t.set("loans",h);const $=t.get("nominas").map(S=>{const I=s(S.tags,l,x);return I!==S.tags&&(m+=1),I===S.tags?S:{...S,tags:I}});t.set("nominas",$);const M=t.get("config"),f=yt(l),b=S=>{const I=(S??[]).map(yt);if(!I.includes(f))return S??[];const w=I.filter(C=>C!==f);return x===null?[...new Set(w)]:[...new Set([...w,x])]},y={},A=b(M.activeTagsFilter),v=b(M.tagCategorias),p=b(M.tagGrupos);return A!==M.activeTagsFilter&&(y.activeTagsFilter=A),v!==M.tagCategorias&&(y.tagCategorias=v),p!==M.tagGrupos&&(y.tagGrupos=p),Object.keys(y).length>0&&t.patchConfig(y),{cambiados:m}}return{uso:a,todas:e,soloEn:o,renombrar:n,fusionar:i,eliminar:r}}function pr(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function mr(t,a){const e=L(t),o=[];for(let s=1;s<=a;s++){const n=new Date(e.getFullYear(),e.getMonth()-s,1);o.push(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function fr(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function vr(t,a){const{inicio:e,fin:o}=fr(a);return Vt([t],{start:e,end:o}).reduce((n,i)=>n+Math.abs(i.cuantia),0)}function gr(t){function a(s,n={}){var A;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:u=V()}=n,l=t.transacciones({estimacionId:s._id}),m=l.length===0&&(((A=s.tags)==null?void 0:A.length)??0)>0?t.transacciones({tags:s.tags}):l,d=new Map;for(const v of m){const p=v.fecha.slice(0,7);d.set(p,(d.get(p)??0)+Math.abs(v.importeCts)/100)}const g=[];for(const v of mr(u,i)){const p=d.get(v);if(p===void 0)continue;const S=ot(vr(s,v));g.push({mes:v,estimado:S,real:ot(p),desviacion:ot(p-S),precision:pr(S,p)})}const h=ot(g.reduce((v,p)=>v+p.estimado,0)),$=ot(g.reduce((v,p)=>v+p.real,0)),M=g.reduce((v,p)=>v+Math.abs(p.estimado),0),f=g.length===0?null:M>0?g.reduce((v,p)=>v+p.precision*Math.abs(p.estimado),0)/M:g.reduce((v,p)=>v+p.precision,0)/g.length,b=g.slice(-r),y=b.length>0?ot(b.reduce((v,p)=>v+p.real,0)/b.length):null;return{estimacionId:s._id,concepto:s.concepto,tags:s.tags??[],meses:g,estimadoTotal:h,realTotal:$,desviacionTotal:ot($-h),precision:f,mediaRealReciente:y,infraestimada:$>h}}function e(s,n={}){return s.filter(i=>i.tipo!=="transferencia").map(i=>a(i,n)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(s){const n=new Map;for(const i of s)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const u=n.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};u.estimado+=i.estimadoTotal,u.real+=i.realTotal,u.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),u.peso+=Math.abs(i.estimadoTotal),u.n+=1,n.set(r,u)}return[...n.entries()].map(([i,r])=>({tag:i,estimadoTotal:ot(r.estimado),realTotal:ot(r.real),desviacionTotal:ot(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}const Je="financeapp_session",br=["local","dropbox","firebase"];function hr(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!br.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function yr({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now()}={}){const o=()=>t??(typeof localStorage<"u"?localStorage:null);function s(d){const g=o();if(g)try{d?g.setItem(Je,JSON.stringify(d)):g.removeItem(Je)}catch{}}function n(){const d=o();if(!d)return null;try{return hr(d.getItem(Je))}catch{return null}}function i(){const d=n();return d?(e()-d.ultimoUso)/6e4:null}function r(){const d=a();if(!Number.isFinite(d)||d<=0)return!1;const g=i();return g!==null&&g>=d}function u(){const d=n();return d?r()?(s(null),null):d:null}function l(d){const g=e(),h={modo:d.modo,...d.email?{email:d.email}:{},...d.passphrase?{passphrase:d.passphrase}:{},creadaEn:g,ultimoUso:g};return s(h),h}function x(){const d=n();d&&s({...d,ultimoUso:e()})}function m(){s(null)}return{abrir:l,leer:u,tocar:x,cerrar:m,caducada:r,inactividadMinutos:i,get activa(){return u()!==null}}}const zo=["pointerdown","keydown","visibilitychange"];function xr({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:s=clearInterval,target:n=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const x of zo)n==null||n.addEventListener(x,r);const u=o(()=>{i&&t.caducada()&&(l(),t.cerrar(),a())},e);function l(){if(i){i=!1,s(u);for(const x of zo)n==null||n.removeEventListener(x,r)}}return l}const $r=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}];function Eo(){if(typeof localStorage<"u"){const d=qs();d.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${d.join(", ")}`)}const t=ks({adapter:Ns()}),{applied:a}=t.load();a.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${a.join(", ")} (esquema v${Wt})`);const e=Hs(t);is(d=>e.isEnabled(d));const o=yr({autoLogoutMinutos:()=>{var g,h;const d=(h=(g=globalThis.State)==null?void 0:g.get)==null?void 0:h.call(g,"config");return Number((d==null?void 0:d.autoLogoutMinutos)??t.get("config").autoLogoutMinutos??0)}}),s=dr(t),n=ur(t),i=gr(s),r=en(t),u=Ws({isEnabled:d=>e.isEnabled(d)}),l=Js({flags:e,rutasExtra:()=>u.flagPorRuta()}),x=Ys({flags:e,onChange:()=>{var d,g;u.attachToShell(),l.apply(),(g=(d=globalThis.Router)==null?void 0:d.rerender)==null||g.call(d)}}),m=()=>{var g,h,$,M,f,b;const d=globalThis;if((h=(g=d.State)==null?void 0:g.load)==null||h.call(g),((M=($=d.Router)==null?void 0:$.current)==null?void 0:M.call($))==="dashboard")try{(b=(f=d.DashboardModule)==null?void 0:f.render)==null||b.call(f)}catch(y){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",y)}};return u.register($n({store:t,onDatosCambiados:m})),u.register(_n({store:t,onDatosCambiados:m})),u.register(Kn({store:t,onDatosCambiados:m})),u.register(hi({store:t,ledger:s,mostrarObjetivos:()=>e.isEnabled("goals"),onDatosCambiados:m})),u.register(nn({ledger:s,tags:n,precision:i,adjuster:r,accounts:()=>t.get("accounts"),estimaciones:()=>t.get("expenses"),onDatosCambiados:m})),u.register(cr({store:t,onDatosCambiados:m})),u.register(zi({store:t,onDatosCambiados:m})),u.register(fn({store:t,onDatosCambiados:m})),u.register(Si({store:t})),u.register(ln({store:t,onDatosCambiados:m})),{version:Wt,core:Yo,engine:{generarExtracto:Ut,recomputarSaldoAcum:Qo,saldoHoy:Ko,sumarPorTags:Sa,providers:{proyectarGastos:Vt,proyectarPrestamos:ga,proyectarTransferencias:ba,proyectarNominas:$a,proyectarInteresesCuentas:ya,proyectarAportaciones:ha,proyectarRetencionesFiscales:xa,proyectarInflacionGastos:Ia,proyectarPerdidaAhorro:Aa},analysis:es,margins:ss,optimizer:rs,dashboard:$s},store:t,flags:e,featureRegistry:{all:wt,porGrupo:Va},ui:{openFeatures:x.open,applyGating:l.apply,watchGating:()=>l.observar()},app:u,session:Object.assign(o,{vigilar:d=>xr({sesion:o,onCaducada:d}),opciones:$r}),accounting:{ledger:s,tags:n,precision:i,adjuster:r,sugerirAjuste:Ka}}}function Ir(){try{const t=Eo();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const ge=typeof window<"u"?Ir():null;if(ge){let t=!1;const a=()=>{ge.app.attachToShell(),ge.ui.applyGating(),t||(t=!0,ge.ui.watchGating())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",e=>{const o=e.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(a,0)})}return xt.bootstrap=Eo,Object.defineProperty(xt,Symbol.toStringTag,{value:"Module"}),xt}({});
//# sourceMappingURL=financeapp-core.js.map

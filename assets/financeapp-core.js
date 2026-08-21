var FinanceAppBundle=function(yt){"use strict";var ir=Object.defineProperty;var rr=(yt,H,q)=>H in yt?ir(yt,H,{enumerable:!0,configurable:!0,writable:!0,value:q}):yt[H]=q;var wo=(yt,H,q)=>rr(yt,typeof H!="symbol"?H+"":H,q);function H(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function q(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function V(){return H(new Date)}function pe(t,a){return new Date(t,a+1,0).getDate()}function Ve(t,a,e){return H(new Date(t,a,Math.min(e,pe(t,a))))}function ee(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return H(new Date(t,a+1,0));const s=parseInt(o);if(!isNaN(s))return Ve(t,a,s)}if(e.startsWith("nthweekday:")){const o=e.split(":"),s=parseInt(o[1]),n=parseInt(o[2]);if(s===-1){const d=new Date(t,a+1,0);for(;d.getDay()!==n;)d.setDate(d.getDate()-1);return H(d)}const i=new Date(t,a,1);for(;i.getDay()!==n;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(s-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),H(i)}return null}function Ue(t,a){if(!a)return t;const e=q(t);return ee(e.getFullYear(),e.getMonth(),a)??t}const So=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],Co={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function me(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${Co[e]||e+"º"} ${So[o]} del mes`}return t}function ae(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function xt(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function at(t){return t/100}function ot(t){return at(xt(t))}function F(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function Ye(t){return(t||0).toFixed(2)+"%"}function Pt(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function We(t,a,e,o=0){const s=Pt(t,a,e),n=t*(1-o/100);let i=a/100/12;for(let d=0;d<200;d++){const r=s*(1-Math.pow(1+i,-e))/i-n,x=s*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),m=i-r/x;if(Math.abs(m-i)<1e-10){i=m;break}i=m}return(Math.pow(1+i,12)-1)*100}function Je(t,a,e,o,s=0,n=[],i={}){const d=[];let u=t;const r=q(o),x=a/100/12;let m=e,l=Pt(u,a,m);const p=[...n].sort(($,I)=>$.fecha.localeCompare(I.fecha));let v=0;for(let $=1;$<=e*2&&u>.01;$++){const I=new Date(r);r.setMonth(r.getMonth()+1);const f=Ue(H(I),i.diaPago||"");for(;v<p.length&&p[v].fecha<=f;){const A=p[v],b=A.cantidad*(s/100);if(u-=A.cantidad,u=Math.max(0,u),A.tipo==="plazo"?m=Math.ceil(-Math.log(1-u*x/l)/Math.log(1+x)):(m=e-$+1,l=Pt(u,a,m)),d.push({mes:"AMORT",fecha:A.fecha,cuota:0,interes:0,amortizacion:A.cantidad,comisionAmort:b,capitalPendiente:u,esAmortizacion:!0,simulacion:A.simulacion||!1}),v++,u<.01)break}if(u<.01)break;const g=u*x,h=Math.min(l-g,u);if(u-=h,u<.01&&(u=0),d.push({mes:$,fecha:f,cuota:l,interes:g,amortizacion:h,comisionAmort:0,capitalPendiente:u,esAmortizacion:!1,simulacion:!1}),m--,m<=0||u<.01)break}return d}const Ke=new Map;function Z(t){var I;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((f,g)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${g.fecha}|${g.cantidad}|${g.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=Ke.get(e);if(o)return o;const{capital:s,tin:n,meses:i,fechaInicio:d,comisionAmort:u,comisionApertura:r}=t,x=Je(s,n,i,d,u||0,a,t),m=x.reduce((f,g)=>f+g.interes,0),l=x.reduce((f,g)=>f+g.comisionAmort,0),p=s*((r||0)/100),v=x.filter(f=>!f.esAmortizacion),$={cuota:Pt(s,n,i),totalIntereses:m,tae:We(s,n,i,r||0),costoTotal:m+l+p,comAp:p,totalComAm:l,fechaFin:((I=v.slice(-1)[0])==null?void 0:I.fecha)||"",mesesReales:v.length,tabla:x};return Ke.set(e,$),$}function Qe(t){const a=Z(t),e=Z({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,s=e.mesesReales-a.mesesReales,n=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:s,costeTotalAmort:n,ahorroNeto:o-n,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function ct(t,a,e){if(!t||t.length===0)return 1;const o=q(a),s=q(e);if(s<=o)return 1;const n=[...t].sort((u,r)=>u.year-r.year);let i=1,d=new Date(o);for(;d<s;){const u=d.getFullYear(),r=n.filter($=>$.year<=u),x=r.length>0?r[r.length-1]:n[0],m=(x?x.tasa:0)/100,l=new Date(u+1,0,1),p=l<s?l:s,v=ae(d,p);i*=Math.pow(1+m,v/365.25),d=p}return i}function Xe(t,a,e,o=0){const s=q(a),n=q(e);if(n<=s)return o;const i=ae(s,n),d=t?[...t].sort((x,m)=>x.year-m.year):[];let u=0,r=new Date(s);for(;r<n;){const x=r.getFullYear(),m=new Date(x+1,0,1),l=m<n?m:n,p=ae(r,l),v=d.filter(f=>f.year<=x),$=v.length>0?v[v.length-1]:null,I=$!==null?$.tasa:o;u+=I*p,r=l}return i>0?u/i:o}function Ze(t,a){return((1+t/100)/(1+a/100)-1)*100}function Fo(t,a,e,o){const s=ct(a,e,o);return s>0?t/s:t}function zo(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,s=a.saludUmbralDTIVerde??30,n=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],d=a.saludExcluirHipoteca||!1,{ingresos:u=0,cuotas:r=0,cuotasHipoteca:x=0,gastosBasicos:m=0,gastosOtros:l=0,amortizaciones:p=0}=t,v=u-r-p-m-l,$=v,I=u>0?$/u*100:null,f=d?r-x:r,g=u>0?f/u*100:null,h=u>0?r/u*100:null,A=u>0?(m+r+p)/u*100:null,b=u>0?l/u*100:null,y=(w,S,C)=>w===null?"neutral":w>=S?"verde":w>=C?"amarillo":"rojo",M=(w,S,C)=>w===null?"neutral":w<=S?"verde":w<=C?"amarillo":"rojo";return{ingresos:u,cuotas:r,cuotasHipoteca:x,gastosBasicos:m,gastosOtros:l,amortizaciones:p,ahorroBruto:v,ahorroReal:$,tasaAhorro:I,dti:g,dtiTotal:h,excluyeHipoteca:d,pctNecesidades:A,pctDeseos:b,semAhorro:y(I,e,o),semDTI:M(g,s,n),semNecesidades:M(A,i[0],i[0]+15),semDeseos:M(b,i[1],i[1]+10),semAhorroRegla:y(I,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:s,umbralDTIAmarillo:n,regla:i}}function dt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function it(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Lt(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];e&&o.push({fecha:e,saldo:t.saldoInicial||0});for(const n of t.historicoSaldos||[])n.fecha>=e&&o.push(n);o.sort((n,i)=>i.fecha.localeCompare(n.fecha));const s=o.find(n=>n.fecha<=a);return s?s.saldo:t.saldoInicial||0}else{const s=[...t.historicoSaldos||[]].sort((n,i)=>i.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=a);return s?s.saldo:0}}function fe(t,a){const e=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return e?a.filter(o=>e.includes(o._id)):a.filter(o=>o.activo&&!o.simulacion)}function ta(t,a,e=0){const o=fe(t,a).reduce((s,n)=>s+it(n),0);return t.usarColchon!==!1?Math.max(0,o-e):o}function ea(t,a,e){if(!t.targetAmount||t.targetAmount<=0)return null;const o=fe(t,a);if(o.length===0)return null;const s=e.hoy??new Date,n=e.horizonteMeses??120,i=t.usarColchon!==!1,d=o.map(u=>({acc:u,eventos:e.extractoCuenta(u),cursor:0,saldo:it(u)}));for(let u=1;u<=n;u++){const r=new Date(s.getFullYear(),s.getMonth()+u,1),x=`${r.getFullYear()}-${String(r.getMonth()+1).padStart(2,"0")}`,m=H(new Date(r.getFullYear(),r.getMonth()+1,0));let l=0;for(const v of d){for(;v.cursor<v.eventos.length&&v.eventos[v.cursor].fecha<=m;)v.saldo=v.eventos[v.cursor].saldoAcum??v.saldo,v.cursor++;l+=v.saldo}const p=i?e.colchonEnFecha(m):0;if(l-p>=t.targetAmount)return x}return null}function aa(t,a){const e=t.escenarioIds||[];return e.length===0?!0:!!a&&e.includes(a)}function oa(t,a){const e=o=>aa(o,a);return{loans:t.loans.filter(e).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}const ve=t=>t.slice(0,7);function jo(t){const[a,e]=t.split("-").map(Number);return`${e===12?a+1:a}-${String(e===12?1:e+1).padStart(2,"0")}`}function ge(t,a,e){if(t.length===0)return[];const o=new Map;for(const r of t)r.saldoAcum!==void 0&&o.set(ve(r.fecha),r.saldoAcum);const s=t[0];let n=(s.saldoAcum??0)-(s.delta??0);const i=ve(a||s.fecha),d=ve(e||t[t.length-1].fecha);if(d<i)return[];const u=[];for(let r=i;r<=d;r=jo(r)){const x=o.get(r);x!==void 0&&(n=x);const[m,l]=r.split("-").map(Number);u.push({x:q(H(new Date(m,l-1,15))).getTime(),mes:r,y:n})}return u}function be(t,a){let e=null;for(const o of t){if(o.fecha>a)break;o.saldoAcum!==void 0&&(e=o.saldoAcum)}return e}function Po(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function Eo(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}const ft=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function lt(t,a){const e=[...a].sort((n,i)=>n[0]-i[0]);let o=0,s=t;for(let n=e.length-1;n>=0;n--){const[i,d]=e[n];s<=i||(o+=(s-i)*(d/100),s=i)}return o}function he(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,s=Math.min(2e3,e),n=Math.max(0,e-o-s),i=n<=15876?7302:n<=21622?Math.max(0,7302-1.75*(n-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:s,RNT:n,reducArt20:i,baseImponible:Math.max(0,n-i)}}function It(t,a){return he(t,a).baseImponible}function sa(t,a){return lt(t,a)/12}const St=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function ye(t,a){if(!t||t<=0)return 0;const e=a||St;let o=0,s=t;for(let n=0;n<e.length;n++){const[i,d]=e[n],u=n<e.length-1?e[n+1][0]:1/0,r=Math.min(s,u-i);if(!(r<=0)&&(o+=r*(d/100),s-=r,s<=0))break}return o}function Et(t,a){if(dt(t)!=="inversion")return null;const e=it(t),o=(t.aportaciones||[]).reduce((i,d)=>i+d.cantidad,0)||t.saldoInicial||0,s=Math.max(0,e-o),n=ye(s,a);return{saldo:e,costBase:o,plusvalia:s,impuesto:n,neto:e-n}}function oe(t,a=new Date){var l;if(dt(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=it(t),s=H(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),n=[...t.aportaciones||[]].sort((p,v)=>p.fecha.localeCompare(v.fecha));let i=0;const d=n.reduce((p,v)=>p+v.cantidad,0);for(const p of n)p.fecha<=s&&(i+=p.cantidad);const u=Math.max(0,o-d),r=d>0?i/d:0,x=Math.min(o,i+u*r),m=Math.max(0,o-x);return{saldo:o,disponible:x,bloqueado:m,costBase:d,beneficio:u,numAportaciones:n.length,proxDesbloqueo:((l=n.find(p=>p.fecha>s))==null?void 0:l.fecha)||null}}function na(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(dt(t)!=="pension"||!o)return 0;const s=it(t);if(s<=0)return 0;const n=(t.aportaciones||[]).reduce((r,x)=>r+x.cantidad,0),i=Math.max(0,s-n);if(i<=0)return 0;const d=i/s;return+(a*d*o/100).toFixed(2)}function xe(t,a,e){var u;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const n=(a||[]).filter(r=>(r.grupoNomina||"")===o&&r.activo!==!1).reduce((r,x)=>r+(x.bruto||0)*(x.nPagas||12),0),i=[...e||[]].sort((r,x)=>r[0]-x[0]);let d=((u=i[0])==null?void 0:u[1])||19;for(const[r,x]of i)if(n>=r)d=x;else break;return d}const $e=6.35;function Ct(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function ia(t){return Math.max(0,(t.bruto||0)-Ct(t))}function _o(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function To(t){const a=t.reduce((i,d)=>i+(d.bruto||0),0),e=t.reduce((i,d)=>i+Ct(d),0),o=Math.max(0,a-e),s=It(a,e),n=new Map;for(const i of t)n.set(i._id,o>0?s*(ia(i)/o):0);return n}function Ie(t,a,e){if(t.irpfModo==="manual")return ia(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return lt(It(t.bruto||0,Ct(t)),e);const o=_o(a.filter(i=>i.irpfModo!=="manual")),s=To(a);let n=0;for(const i of o){const d=s.get(i._id)??0;if(i._id===t._id)return lt(n+d,e)-lt(n,e);n+=d}return lt(It(t.bruto||0,Ct(t)),e)}function Do(t,a){return t.reduce((e,o)=>e+Ie(o,t,a),0)}function Ro(t,a){var s;const e=[...a||[]].sort((n,i)=>n[0]-i[0]);let o=((s=e[0])==null?void 0:s[1])??19;for(const[n,i]of e)if(t>=n)o=i;else break;return o}function ra(t,a){if(!t||t.length===0)return 0;const e=t.reduce((s,n)=>s+(n.bruto||0),0),o=t.reduce((s,n)=>s+Ct(n),0);return Ro(It(e,o),a)}function Ae(t,a,e){const o=t.bruto||0,s=Ct(t),n=Math.max(0,o-s),i=t.nPagas||12,d=t.ssPct??$e,u=n*(d/100),r=Ie(t,a,e);return{brutoAnual:o,flexAnual:s,baseDineraria:n,nPagas:i,ssPct:d,ssAnual:u,irpfAnual:r,irpfPct:n>0?r/n*100:0,netoPorPaga:(n-u-r)/i}}function No(t){const a=new Map,e=[];for(const o of t){const s=o.grupoNomina||"";if(!s){e.push(o);continue}const n=a.get(s)??[];n.push(o),a.set(s,n)}return{grupos:a,sueltas:e}}const Ft=1500;function la(t){const a=t.cuantia||0,e=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?a*12/e:t.tipoFrecuencia==="diaria"?a*365.25/e:a}const qt=t=>{const a=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(a)?a:0};function Oo(t,a){const e=t.grupoNomina||"";return e?a.filter(o=>(o.grupoNomina||"")===e):null}function ca(t,a){return t.reduce((e,o)=>e+Ie(o,Oo(o,t),a),0)}function da(t){const{nominas:a,tramosGeneral:e,tramosAhorro:o}=t,s=t.extras??{},n=a.reduce((w,S)=>w+(S.bruto||0),0),i=a.reduce((w,S)=>w+Ct(S),0),d=he(n,i),u=t.aportacionesPension,r=Ft,x=Math.min(u,r),m=Math.max(0,d.RNT-d.reducArt20-x),l=qt(s.capInmobiliario),p=qt(s.capMobiliario),v=qt(s.gananciasFondos),$=qt(s.otrasCorto),I=qt(s.retCapital),f=Math.max(0,m+t.otrosIngresos+l+$),g=Math.max(0,p+v),h=lt(f,e),A=lt(g,o),b=h+A,y=ca(a,e),M=y+I;return{brutoTotal:n,flexTotal:i,brutoIRPF:d.baseIRPF,cotizSS:d.cotizSS,gastosArt19:d.gastosArt19,RNT:d.RNT,reducArt20:d.reducArt20,aportPP:u,limPP:r,deducPP:x,RNTred:m,otrosIngresos:t.otrosIngresos,capInmobiliario:l,capMobiliario:p,gananciasFondos:v,otrasCorto:$,baseGeneral:f,baseAhorro:g,cuotaGen:h,cuotaAho:A,cuotaIntegra:b,retNomina:y,retCapital:I,totalRet:M,resultado:b-M}}const Lo=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:Ft,TRAMOS_AHORRO_DEFAULT:St,TRAMOS_IRPF_DEFAULT:ft,ajustarFechaPago:Ue,ajustarPrecioReal:Fo,calcBaseImponibleTrabajo:It,calcFactorInflacion:ct,calcFondoInversion:Et,calcFondosPension:oe,calcGananciasCapital:ye,calcIRPF:lt,calcImpuestoPension:na,calcInflacionMediaAnual:Xe,calcSaludFinanciera:zo,calcTAE:We,calcTipoMarginalPension:xe,calcTipoRealFisher:Ze,calcularDeclaracion:da,clampedDate:Ve,cuentasDelObjetivo:fe,cuotaMensual:Pt,desgloseBaseTrabajo:he,diasEntre:ae,filtrarPorEscenario:oa,formatEUR:F,formatLocalDate:H,formatPct:Ye,fromCents:at,haySimulaciones:Eo,ingresoAnual:la,labelDiaPago:me,lastDayOfMonth:pe,modeloFondoDe:dt,parseLocalDate:q,proyectarFechaCumplimiento:ea,resolverDiaEfectivo:ee,resumenPrestamo:Z,resumenPrestamoConAhorro:Qe,retencionMensual:sa,retencionesNomina:ca,roundMoney:ot,saldoEnFecha:Lt,saldoEnFechaExtracto:be,saldoParaObjetivo:ta,saldoRealCuenta:it,serieMensual:ge,sinSimulaciones:Po,tablaAmortizacion:Je,toCents:xt,todayISO:V,visibleEnEscenario:aa},Symbol.toStringTag,{value:"Module"}));function kt(t,a,e=null){const o=[],s=q(a.start),n=q(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const d=q(i.fechaInicio||a.start),u=i.fechaFin?q(i.fechaFin):n,r=i.cuantia,x=m=>o.push({fecha:m,concepto:i.concepto,cuantia:r,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")d>=s&&d<=n&&d<=u&&x(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const m=Math.max(1,i.frecuencia||1);let l=d.getFullYear(),p=d.getMonth();const v=Math.ceil(240/m)+2;for(let $=0;$<v;$++){const I=ee(l,p,i.diaPago||"")||(()=>{const g=d.getDate(),h=new Date(l,p+1,0).getDate();return H(new Date(l,p,Math.min(g,h)))})(),f=q(I);if(f>n||f>u)break;f>=s&&f>=d&&x(I),p+=m,p>=12&&(l+=Math.floor(p/12),p=p%12)}}else if(i.tipoFrecuencia==="diaria"){const m=Math.max(1,i.frecuencia||1)*864e5;let l=new Date(Math.max(d.getTime(),s.getTime()));if(d<s){const p=Math.ceil((s.getTime()-d.getTime())/m);l=new Date(d.getTime()+p*m)}for(;l<=n&&l<=u;)x(H(l)),l=new Date(l.getTime()+m)}}return o}function ua(t,a,e=null){const o=[];for(const s of t){if(!s.activo||e&&e.length>0&&!e.includes(s.cuenta||"default"))continue;const{tabla:n}=Z(s);for(const i of n)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${s.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${s.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan",simulacion:s.simulacion||!1}))}return o}function pa(t,a,e=null,o={accounts:[]}){const s=[],n=q(a.start),i=q(a.end),d=o.accounts||[],u=o.nominas||[],r=o.resolverTramosIRPF||(()=>ft),x=o.resolverTramosGanancias||(()=>St),m=l=>{var p;return((p=d.find(v=>v._id===l))==null?void 0:p.nombre)??l};for(const l of t){if(!l.activo||l.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(l.cuenta||"default")||e.includes(l.cuentaDestino||"default")))continue;const p=q(l.fechaInicio||a.start),v=l.fechaFin?q(l.fechaFin):i,$=I=>{const f=d.find(j=>j._id===(l.cuenta||"default")),g=d.find(j=>j._id===(l.cuentaDestino||"default")),h=dt(f),A=dt(g),b=h==="inversion"&&A==="inversion"||h==="pension"&&A==="pension",y=["transferencia",...b?["traspaso"]:[],...l.tags||[]],M=b?"traspaso-out":"transfer-out",w=b?"traspaso-in":"transfer-in",S=!e||e.length===0||e.includes(l.cuenta||"default"),C=!e||e.length===0||e.includes(l.cuentaDestino||"default");if(S&&s.push({fecha:I,concepto:`Transf. → ${m(l.cuentaDestino||"default")}: ${l.concepto}`,cuantia:l.cuantia,tipo:"gasto",tags:y,cuenta:l.cuenta||"default",sourceId:l._id,sourceType:M}),C&&s.push({fecha:I,concepto:`Transf. ← ${m(l.cuenta||"default")}: ${l.concepto}`,cuantia:l.cuantia,tipo:"ingreso",tags:y,cuenta:l.cuentaDestino||"default",sourceId:l._id,sourceType:w}),S&&!b&&f){if(h==="inversion"){const j=parseInt(I.slice(0,4)),z=Et(f,x(j));if(z&&z.saldo>0&&z.plusvalia>0){const P=Math.min(1,l.cuantia/z.saldo),N=z.plusvalia*P*.19;N>.01&&s.push({fecha:I,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:N,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:l.cuenta||"default",sourceId:l._id,sourceType:"investment-tax"})}}else if(h==="pension"){const j=r(parseInt(I.slice(0,4))),z=xe(f,u,j),P=na(f,l.cuantia,z||void 0);if(P>0){const _=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${z}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;s.push({fecha:I,concepto:_,cuantia:P,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:l.cuenta||"default",sourceId:l._id,sourceType:"pension-tax"})}}}};if(l.tipoFrecuencia==="extraordinario")p>=n&&p<=i&&p<=v&&$(l.fechaInicio);else if(l.tipoFrecuencia==="mensual"){const I=Math.max(1,l.frecuencia||1);let f=p.getFullYear(),g=p.getMonth();const h=Math.ceil(240/I)+2;for(let A=0;A<h;A++){const b=ee(f,g,l.diaPago||"")||(()=>{const M=p.getDate(),w=new Date(f,g+1,0).getDate();return H(new Date(f,g,Math.min(M,w)))})(),y=q(b);if(y>i||y>v)break;y>=n&&y>=p&&$(b),g+=I,g>=12&&(f+=Math.floor(g/12),g=g%12)}}else if(l.tipoFrecuencia==="diaria"){const I=Math.max(1,l.frecuencia||1)*864e5;let f=new Date(Math.max(p.getTime(),n.getTime()));if(p<n){const g=Math.ceil((n.getTime()-p.getTime())/I);f=new Date(p.getTime()+g*I)}for(;f<=i&&f<=v;)$(H(f)),f=new Date(f.getTime()+I)}}return s}function ma(t,a,e=null){const o=[],s=q(a.start),n=q(a.end);for(const i of t){const d=dt(i);if(d==="cuenta"||!i.activo)continue;const u=i.planAportaciones||[];for(const r of u){if(!r.importe||r.importe<=0)continue;const x=q(r.fechaInicio||a.start),m=r.fechaFin?q(r.fechaFin):n,l=r.cuentaOrigen||"default",p=!e||!e.length||e.includes(l),v=!e||!e.length||e.includes(i._id),$=d==="pension"?"pension":"capital-mobiliario",I=b=>{p&&o.push({fecha:b,concepto:`Aportación → ${i.nombre}`,cuantia:r.importe,tipo:"gasto",tags:["aportacion","transferencia",$],cuenta:l,sourceId:r._id,sourceType:"aportacion-out"}),v&&o.push({fecha:b,concepto:`Aportación ${i.nombre} (${r.periodicidad||"mensual"})`,cuantia:r.importe,tipo:"ingreso",tags:["aportacion","transferencia",$],cuenta:i._id,sourceId:r._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[r.periodicidad||"mensual"]||1;let g=x.getFullYear(),h=x.getMonth();const A=Math.ceil(240/f)+2;for(let b=0;b<A;b++){const y=new Date(g,h+1,0).getDate(),M=H(new Date(g,h,Math.min(x.getDate(),y))),w=q(M);if(w>n||w>m)break;w>=s&&w>=x&&I(M),h+=f,h>=12&&(g+=Math.floor(h/12),h=h%12)}}}return o}function fa(t,a,e=null,o=[]){const s=[];for(const n of t){if(!n.activo||!n.interes||n.interes<=0||e&&e.length>0&&!e.includes(n._id))continue;const i=q(a.start),d=q(a.end),u=n.periodoCobro||"mensual",r=u==="mensual",x=r?null:{diario:864e5,semanal:7*864e5}[u]||864e5,m=r?1/12:x/(365.25*864e5);let l=Lt(n,a.start);const p=o.filter(I=>I.cuenta===n._id).map(I=>({fecha:I.fecha,delta:I.tipo==="ingreso"?Math.abs(I.cuantia):-Math.abs(I.cuantia)})).sort((I,f)=>I.fecha.localeCompare(f.fecha));let v=0,$=new Date(i);for(;$<=d;){const I=r?new Date($.getFullYear(),$.getMonth()+1,$.getDate()):new Date($.getTime()+x),f=new Date(Math.min(I.getTime(),d.getTime()+1)),g=H(f);let h=0;for(;v<p.length&&p[v].fecha<g;)h+=p[v].delta,v++;const A=l,b=l+h,y=Math.max(0,(A+b)/2);l=b;const M=r?m:(f.getTime()-$.getTime())/(365.25*864e5),w=y*(Math.pow(1+n.interes/100,M)-1);w>.001&&s.push({fecha:H($),concepto:`Interés ${n.nombre}`,cuantia:w,tipo:"ingreso",tags:["interes","cuenta"],cuenta:n._id,sourceId:n._id,sourceType:"account-interest"}),$=I}}return s}function va(t,a,e,o=null){const s=[],n=a||ft;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const d=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),u=sa(d,n),r={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:u,tags:["irpf","fiscal"]};s.push(...kt([r],e,o))}return s}const qo=[5,11,2,8],ko={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function ga(t,a,e=null,o=[],s=()=>ft){const n=[],i=q(a.start),d=q(a.end),u=o.length>0,r={};for(const l of t){const p=l.grupoNomina||"";r[p]||(r[p]=[]),r[p].push(l)}for(const l of Object.keys(r))r[l].sort((p,v)=>(v.bruto||0)-(p.bruto||0));function x(l,p){if(!u||!l.mesActualizacionIPC)return l.bruto||0;const v=l.fechaInicio||a.start,$=q(v),I=q(p);let f=0;for(let h=$.getFullYear();h<=I.getFullYear();h++){const A=new Date(h,l.mesActualizacionIPC-1,1);A>$&&A<=I&&f++}if(f===0)return l.bruto||0;const g=H(new Date($.getFullYear()+f,0,1));return(l.bruto||0)*ct(o,v,g)}function m(l,p){const v=x(l,p),$=(l.retribucionFlexible||[]).reduce((j,z)=>j+(z.importe||0)*12,0),I=Math.max(0,v-$);if(l.irpfModo==="manual")return I*((l.irpfPct||0)/100);const f=s(parseInt(p.slice(0,4))),g=l.grupoNomina||"";if(!g)return lt(It(v,$),f);const h=r[g].filter(j=>j.activo),A=h.reduce((j,z)=>j+x(z,p),0),b=h.reduce((j,z)=>j+(z.retribucionFlexible||[]).reduce((P,_)=>P+(_.importe||0)*12,0),0),y=Math.max(0,A-b),M=It(A,b),w=Math.max(0,v-$),S=y>0?M*(w/y):0,C=h.filter(j=>j._id!==l._id&&(j.bruto||0)>(l.bruto||0)).reduce((j,z)=>{const P=(z.retribucionFlexible||[]).reduce((N,O)=>N+(O.importe||0)*12,0),_=Math.max(0,x(z,p)-P);return j+(y>0?M*(_/y):0)},0);return lt(C+S,f)-lt(C,f)}for(const l of t){if(!l.activo)continue;const p=l.cuenta||"default";if(e&&e.length>0&&!e.includes(p))continue;const v=Math.max(1,l.nPagas||12),$=q(l.fechaInicio||a.start),I=l.fechaFin?q(l.fechaFin):d,f=g=>{const h=x(l,g),A=m(l,g),b=(l.retribucionFlexible||[]).reduce((P,_)=>P+(_.importe||0)*12,0),y=Math.max(0,h-b),M=(l.ssPct??6.35)/100,w=y*M,S=y/v,C=A/v,j=w/v,z=l.representacion==="simplificado"?S-j-C:S;n.push({fecha:g,concepto:l.nombre,cuantia:z,tipo:"ingreso",cuenta:p,tags:l.tags||[],sourceId:l._id,sourceType:"nomina"}),l.representacion==="detallado"&&(j>0&&n.push({fecha:g,concepto:`SS ${l.nombre}`,cuantia:j,tipo:"gasto",cuenta:p,tags:["seguridad-social","fiscal"],sourceId:l._id+"_ss",sourceType:"nomina"}),C>0&&n.push({fecha:g,concepto:`IRPF ${l.nombre}`,cuantia:C,tipo:"gasto",cuenta:p,tags:["irpf","fiscal"],sourceId:l._id+"_irpf",sourceType:"nomina"}));for(const P of l.retribucionFlexible||[])!P.cuenta||!(P.importe>0)||e&&e.length>0&&!e.includes(P.cuenta)||n.push({fecha:g,concepto:`${l.nombre} — ${ko[P.tipo]||P.tipo}`,cuantia:P.importe,tipo:"ingreso",cuenta:P.cuenta,tags:["retribucion-flexible",P.tipo],sourceId:`${l._id}_flex_${P._id||P.tipo}`,sourceType:"nomina"})};if(v<=12){const g=v===12?1:Math.round(12/v),h=$.getDate();let A=$.getFullYear(),b=$.getMonth();for(let y=0;y<300;y++){const M=new Date(A,b+1,0).getDate(),w=new Date(A,b,Math.min(h,M));if(w>d||w>I)break;w>=i&&w>=$&&f(H(w)),b+=g,b>=12&&(A+=Math.floor(b/12),b=b%12)}}else{const g=v-12,h=$.getDate();let A=$.getFullYear(),b=$.getMonth();for(let w=0;w<300;w++){const S=new Date(A,b+1,0).getDate(),C=new Date(A,b,Math.min(h,S));if(C>d||C>I)break;C>=i&&C>=$&&f(H(C)),b++,b>=12&&(A++,b=0)}const y=Math.max($.getFullYear(),i.getFullYear()),M=Math.min((l.fechaFin?I:d).getFullYear(),d.getFullYear());for(let w=y;w<=M;w++)for(const S of qo.slice(0,g)){const C=new Date(w,S,15);C>=i&&C<=d&&C>=$&&C<=I&&f(H(C))}}}return n}function ba(t,a,e,o=null,s="default"){const n=[];if(!a||a.length===0)return n;const i=q(e.start),d=q(e.end),u=V(),r=t.filter(m=>m.activo&&m.tipo==="gasto"&&m.tipoFrecuencia==="mensual");let x=new Date(i.getFullYear(),i.getMonth(),1);for(;x<=d;){const m=x.getFullYear(),l=x.getMonth(),p=m+"-"+String(l+1).padStart(2,"0"),v=p+"-01",$=H(new Date(m,l+1,0)),I=H(new Date(m,l,15));let f=0;for(const g of r){if(o&&o.length>0&&!o.includes(g.cuenta||"default")||g.fechaInicio&&g.fechaInicio>$||g.fechaFin&&g.fechaFin<v)continue;const h=g.fechaInicio||u,A=ct(a,h,I);if(A<=1)continue;const b=Math.max(1,g.frecuencia||1);f+=g.cuantia*(A-1)/b}f>.01&&n.push({fecha:I,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:s,sourceId:"inflacion_vida_"+p,sourceType:"inflacion"}),x=new Date(m,l+1,1)}return n}function ha(t,a,e,o="default"){const s=[];if(!a||a.length===0||t<=0)return s;const n=q(e.start),i=q(e.end),d=[...a].sort((r,x)=>r.year-x.year);let u=new Date(n.getFullYear(),n.getMonth(),1);for(;u<=i;){const r=u.getFullYear(),x=u.getMonth(),m=r+"-"+String(x+1).padStart(2,"0"),l=H(new Date(r,x,15)),p=d.filter(g=>g.year<=r),v=p.length>0?p[p.length-1]:d[0],$=v?v.tasa/100:0,I=Math.pow(1+$,1/12)-1,f=t*I;f>.01&&s.push({fecha:l,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+m,sourceType:"inflacion"}),u=new Date(r,x+1,1)}return s}function ya(t,a,e){const o=e.fechaReferencia||e.dashboardStart,s=o<e.dashboardStart?e.dashboardStart:o>e.dashboardEnd?e.dashboardEnd:o,n=a.reduce((m,l)=>m+Lt(l,s),0),i=t.filter(m=>m.fecha<s),d=t.filter(m=>m.fecha>=s),u=[];let r=n;for(const m of[...i].reverse()){const l=m.tipo==="ingreso"?Math.abs(m.cuantia):-Math.abs(m.cuantia);u.unshift({...m,delta:l,saldoAcum:r}),r-=l}const x=[];r=n;for(const m of d){const l=m.tipo==="ingreso"?Math.abs(m.cuantia):-Math.abs(m.cuantia);r+=l,x.push({...m,delta:l,saldoAcum:r})}return[...u,...x]}function Bo(t,a,e,o=null){const s=a.filter(n=>n.activo&&(!o||o.length===0||o.includes(n._id)));return ya([...t].sort((n,i)=>n.fecha.localeCompare(i.fecha)),s,e)}function Bt(t){const{loans:a,expenses:e,accounts:o,config:s}=t,n=t.filtroAccounts??null,i=t.nominas??[],d=t.inflacionPeriodos??[],u={start:s.dashboardStart,end:s.dashboardEnd},r=e.filter($=>$.tipo!=="transferencia"),x=e.filter($=>$.tipo==="transferencia"),m={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let l=[];l=l.concat(kt(r,u,n)),l=l.concat(ua(a,u,n)),l=l.concat(pa(x,u,n,m)),l=l.concat(ma(o,u,n));const p=fa(o,u,n,l);if(l=l.concat(p),l=l.concat(va(e,s.tramos_irpf,u,n)),l=l.concat(ga(i,u,n,d,t.resolverTramosIRPF)),s.usarInflacion&&d.length>0){const $=(o.find(g=>g.activo&&g.esCuentaPrincipal)||o.find(g=>g.activo)||{_id:"default"})._id;l=l.concat(ba(r,d,u,n,$));const f=o.filter(g=>g.activo&&(!n||n.length===0||n.includes(g._id))).reduce((g,h)=>g+Lt(h,s.dashboardStart),0);l=l.concat(ha(f,d,u,$))}l.sort(($,I)=>$.fecha.localeCompare(I.fecha));const v=o.filter($=>$.activo&&(!n||n.length===0||n.includes($._id)));return ya(l,v,s)}function Ho(t,a,e=null){const o=V(),n=a.filter(d=>d.activo&&(!e||e.length===0||e.includes(d._id))).reduce((d,u)=>d+it(u),0),i=t.filter(d=>d.fecha<=o);return i.length===0?n:i[i.length-1].saldoAcum}function xa(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const s of o.tags||["sin_tag"])e.set(s,(e.get(s)||0)+Math.abs(o.cuantia));return e}function Go(t,a){const e=[];let o=!1;for(let s=0;s<t.length;s++){const n=t[s],i=n.saldoAcum;i<0&&(s===0||t[s-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:n.fecha,saldo:i,mensaje:`Saldo negativo (${F(i)}) a partir del ${n.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:n.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${F(i)} < ${F(a)}) desde ${n.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:n.fecha,saldo:i,mensaje:`Recuperación del colchón el ${n.fecha} (${F(i)})`})))}return e}function Vo(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,d)=>i+Math.abs(d.cuantia),0),o=q(a.dashboardStart),s=q(a.dashboardEnd),n=Math.max(1,(s.getTime()-o.getTime())/(30.44*864e5));return e/n}function Uo(t,a,e=V()){const o=new Set,s=a.map(d=>{const u=d.fechaInicialSaldo||"",r={};u&&u<=e&&(r[u]=d.saldoInicial||0);for(const x of d.historicoSaldos||[])x.fecha<=e&&(!u||x.fecha>=u)&&(r[x.fecha]=x.saldo);return Object.keys(r).forEach(x=>o.add(x)),r}),n={};for(const d of[...o].sort()){let u=0;for(let r=0;r<a.length;r++){const x=Object.entries(s[r]).filter(([m])=>m<=d);x.length>0?(x.sort(([m],[l])=>l.localeCompare(m)),u+=x[0][1]):u+=a[r].saldoInicial||0}n[d]=u}const i=[];for(const[d,u]of Object.entries(n).sort(([r],[x])=>r.localeCompare(x))){const r=t.filter(p=>p.fecha<=d),x=r.length>0?r[r.length-1].saldoAcum:null;if(x===null)continue;const m=u-x,l=x!==0?m/Math.abs(x)*100:0;i.push({cuenta:"Total",fecha:d,estimado:x,real:u,desv:m,pct:l})}return i}const Yo=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:Uo,detectarPuntosCriticos:Go,mediaMensualGastos:Vo},Symbol.toStringTag,{value:"Module"}));function Ht(t,a=new Date){const e=H(a),o=new Date(a);o.setMonth(o.getMonth()+1);const s=H(o),n=t.filter(d=>d.basico&&d.activo&&d.tipo==="gasto");return kt(n,{start:e,end:s}).reduce((d,u)=>d+Math.abs(u.cuantia),0)}function Me(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+Pt(e.capital,e.tin,e.meses),0)}function $a(t,a,e,o){return a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0?a.colchonFijo:(Ht(t,o)+Me(e))*(a.colchonMeses||6)}function Ia(t,a,e,o,s){const i=[...a.colchonPuntos||[]].sort((u,r)=>u.fecha.localeCompare(r.fecha)).filter(u=>u.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(Ht(t,s)+Me(e))*(i.meses||6):$a(t,a,e,s)}function se(t,a,e,o,s,n=!1,i){const d=[...t.puntos||[]].sort((x,m)=>x.fecha.localeCompare(m.fecha)),u=d.filter(x=>x.fecha<=s).pop()||(n?d[0]:null);return u?u.tipo==="fijo"?u.importe||0:(Ht(a,i)+Me(o))*(u.meses||1):0}function Wo(t,a){const e={};for(const o of a)e[o._id]=it(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=o.cuantia),{fecha:o.fecha,saldos:{...e}}))}function Jo(t,a,e,o,s,n,i){const d=[];for(const u of(t||[]).filter(r=>r.activo!==!1)){let r=!1;for(let x=0;x<a.length;x++){const m=a[x],l=se(u,o,s,n,m.fecha,!1,i);if(l<=0){r=!1;continue}const p=!u.cuentas||u.cuentas.length===0?m.saldoAcum:u.cuentas.reduce((v,$)=>{var I,f;return v+(((f=(I=e[x])==null?void 0:I.saldos)==null?void 0:f[$])||0)},0);p<l&&!r?(r=!0,d.push({tipo:"bajo_margen",fecha:m.fecha,saldo:p,target:l,nombre:u.nombre,mensaje:`⚠ ${u.nombre}: ${F(p)} < ${F(l)} desde ${m.fecha}`})):p>=l&&r&&(r=!1,d.push({tipo:"recuperacion_margen",fecha:m.fecha,saldo:p,target:l,nombre:u.nombre,mensaje:`✓ ${u.nombre}: recuperado el ${m.fecha}`}))}}return d}const Ko=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:$a,calcColchonEnFecha:Ia,calcGastoBasicoMensual:Ht,calcMargenEnFecha:se,detectarCrucesMargenes:Jo,saldosPorCuentaEnExtracto:Wo},Symbol.toStringTag,{value:"Module"}));class Qo extends Error{constructor(e,o){super(`La funcionalidad "${e}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);wo(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=e}}let Gt=null;function Xo(t){const a=Gt;return Gt=t,()=>{Gt=a}}function Aa(t){return Gt?Gt(t):!0}function Ma(t,a){if(!Aa(t))throw new Qo(t,a)}const wa=[];function we(){const t=new Map,a=new WeakMap;let e=1,o=0,s=0;const n=u=>{if(!u||typeof u!="object")return 0;const r=a.get(u);if(r)return r;const x=e++;return a.set(u,x),x},i=u=>u.map(r=>[r._id,r.capital,r.tin,r.meses,r.fechaInicio,r.comisionAmort||0,r.comisionApertura||0,r.diaPago||"",r.activo?1:0,r.cuenta||"",(r.amortizaciones||[]).map(x=>`${x.fecha}:${x.cantidad}:${x.tipo||""}`).sort().join(",")].join("|")).join(";");function d(u){const r=[i(u.loans),n(u.expenses),n(u.accounts),n(u.nominas),n(u.inflacionPeriodos),u.config.dashboardStart,u.config.dashboardEnd,u.config.fechaReferencia||"",u.config.usarInflacion?1:0,(u.filtroAccounts||[]).join(",")].join("#"),x=t.get(r);if(x)return s++,x;o++;const m=Bt(u);return t.set(r,m),m}return{statement:d,stats:()=>({hits:s,misses:o}),clear:()=>t.clear()}}function Se(t,a,e,o,s={},n=we()){Ma("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:d=36,minAmortizable:u=500,tipoAmort:r="plazo",fechaPrimeraAmort:x=null,loanIds:m=null,nominas:l=wa,sourceAccountId:p=null,selectedMarginIds:v=null,hoy:$=new Date}=s,I=H($),f=Math.min(120,Math.max(1,d)),g=e.filter(R=>R.activo),h=g.map(R=>R._id),A=g.find(R=>R.esCuentaPrincipal)||g[0],b=p&&h.includes(p)?g.find(R=>R._id===p):A,y=b==null?void 0:b._id,M=t.filter(R=>R.activo&&!R.simulacion&&(!m||m.includes(R._id))).sort((R,k)=>k.tin-R.tin),w=!!v&&v.length>0,S=(o.margenesSeguridad||[]).filter(R=>R.activo!==!1).filter(R=>!R.cuentas||R.cuentas.length===0||R.cuentas.includes(y)).filter(R=>!w||v.includes(R._id));if(M.length===0)return{plan:[],margenesAplicados:S.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const C={};for(const R of M)C[R._id]=[];const j=[];function z(R){const k=new Date($.getFullYear(),$.getMonth()+R,1),Y=k.getFullYear(),K=k.getMonth(),X=`${Y}-${String(K+1).padStart(2,"0")}`,pt=H(new Date(Y,K,Math.min(15,new Date(Y,K+1,0).getDate())));return{label:X,dia15:pt}}function P(R,k){const Y=[...R.amortizaciones||[],...C[R._id]],{tabla:K}=Z({...R,amortizaciones:Y}),X=K.filter(st=>st.fecha<=k);if(X.length>0)return X[X.length-1].capitalPendiente;const pt=Y.filter(st=>st.fecha<=k).reduce((st,mt)=>st+mt.cantidad,0);return Math.max(0,R.capital-pt)}function _(R){const k=t.map(nt=>({...nt,amortizaciones:[...nt.amortizaciones||[],...C[nt._id]||[]]})),Y={...o,dashboardStart:I,dashboardEnd:R},K=n.statement({loans:k,expenses:a,accounts:e,config:Y,filtroAccounts:null,nominas:l}),X=g.reduce((nt,Ot)=>nt+it(Ot),0),pt=b?it(b):0,st=X>0?pt/X:1;let mt=pt,Zt=X;for(const nt of K){const Ot=nt.delta??(nt.tipo==="ingreso"?Math.abs(nt.cuantia):-Math.abs(nt.cuantia));nt.cuenta===y?mt+=Ot:h.includes(nt.cuenta)||(mt+=Ot*st),Zt=nt.saldoAcum}return{source:mt,total:Zt}}function N(R){const{source:k}=_(R);if(k<=0)return k;let Y=0;for(const K of S){const X=se(K,a,o,t,R,!0,$);X>Y&&(Y=X)}return k-Y}const O=2;let G=0;if(x){for(let R=0;R<f;R++)if(z(R).dia15>=x){G=R;break}}for(let R=0;R<f;R++){if((R-G)%i!==0||R<G)continue;const{label:k,dia15:Y}=z(R);if(Y<I)continue;const K=N(Y)-O;if(K<u)continue;let X=K,pt=0;for(const st of M){if(X<u)break;const mt=P(st,Y);if(mt<1)continue;const Zt=st.comisionAmort||0,nt=1+Zt/100,Ot=Math.floor(X/nt),Ao=Math.min(Ot,mt);if(Ao<u)continue;const te=Math.min(Math.floor(Ao),Math.floor(mt)),Mo=+(te*Zt/100).toFixed(2),Ge=te+Mo;Ge>X||(C[st._id].push({_id:`opt_${k}_${st._id}`,fecha:Y,cantidad:te,tipo:r,simulacion:!0}),pt+=Ge,j.push({mes:k,fechaAmort:Y,loanId:st._id,loanNombre:st.nombre,tin:st.tin,capitalAntes:mt,cantidadAmort:te,comision:Mo,capitalDespues:Math.max(0,mt-te),saldoDisponible:K+O,excedente:K,saldoDespues:K+O-pt,tipoAmort:r}),X-=Ge)}}const T=j.reduce((R,k)=>R+k.cantidadAmort,0),L=j.reduce((R,k)=>R+k.comision,0),B=M.map(R=>{const k=C[R._id];if(!k.length)return null;const Y=Z(R),K=Z({...R,amortizaciones:[...R.amortizaciones||[],...k]});return{loanId:R._id,nombre:R.nombre,tin:R.tin,fechaFinSin:Y.fechaFin,fechaFinCon:K.fechaFin,mesesAhorrados:Y.mesesReales-K.mesesReales,interesesSin:Y.totalIntereses,interesesCon:K.totalIntereses,ahorroIntereses:Y.totalIntereses-K.totalIntereses,numAmortizaciones:k.length,totalAmortizado:k.reduce((X,pt)=>X+pt.cantidad,0)}}).filter(R=>R!==null),U=B.reduce((R,k)=>R+k.ahorroIntereses,0);return{plan:j,margenesAplicados:S.length,totalAmortizado:T,totalComisiones:L,totalAhorroIntereses:U,resumenPorLoan:B}}function Sa(t,a,e,o,s={},n){Ma("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:d=500,tipoAmort:u="plazo",fechaObjetivo:r=null,frecuencias:x=[1,2,3,6,12],fechaPrimeraAmort:m=null,loanIds:l=null,nominas:p=wa,sourceAccountId:v=null,selectedMarginIds:$=null,hoy:I=new Date}=s,f=n??we(),g=H(I),h=r||H(new Date(I.getFullYear(),I.getMonth()+i,1));function A(M){const w=t.map(z=>({...z,amortizaciones:[...z.amortizaciones||[],...M[z._id]||[]]})),S={...o,dashboardStart:g,dashboardEnd:h},C=f.statement({loans:w,expenses:a,accounts:e,config:S,filtroAccounts:null,nominas:p});if(C.length===0)return e.filter(z=>z.activo).reduce((z,P)=>z+it(P),0);const j=C.filter(z=>z.fecha<=h);return j.length>0?j[j.length-1].saldoAcum:C[0].saldoAcum}const b=A({}),y=x.map(M=>{const w=Se(t,a,e,o,{frecuencia:M,mesesHorizonte:i,minAmortizable:d,tipoAmort:u,fechaPrimeraAmort:m,loanIds:l,nominas:p,sourceAccountId:v,selectedMarginIds:$,hoy:I},f),S={};for(const j of t)S[j._id]=[];for(const j of w.plan)S[j.loanId].push({_id:j.mes+"_"+j.loanId,fecha:j.fechaAmort,cantidad:j.cantidadAmort,tipo:u,simulacion:!0});const C=A(S);return{frecuencia:M,label:M===1?"Mensual":`Cada ${M} meses`,numAmortizaciones:w.plan.length,totalAmortizado:w.totalAmortizado,totalComisiones:w.totalComisiones,ahorroIntereses:w.totalAhorroIntereses,saldoObjetivo:C,gananciaSaldo:C-b,valorTotal:w.totalAhorroIntereses+(C-b),plan:w.plan,resumenPorLoan:w.resumenPorLoan}}).filter(M=>M.numAmortizaciones>0);if(y.length>0){const M=Math.max(...y.map(C=>C.ahorroIntereses)),w=Math.max(...y.map(C=>C.saldoObjetivo)),S=Math.max(...y.map(C=>C.valorTotal));y.forEach(C=>{C.esMejorIntereses=C.ahorroIntereses===M,C.esMejorSaldo=C.saldoObjetivo===w,C.esMejorValor=C.valorTotal===S})}return{resultados:y,saldoBase:b,fechaObjetivo:h}}const Zo=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:Sa,createStatementMemo:we,defaultHoyISO:V,optimizarAmortizaciones:Se},Symbol.toStringTag,{value:"Module"})),ts=30.44*864e5;function Ca(t){const a=t.getFullYear(),e=t.getMonth();return{desde:H(new Date(a,e,1)),hasta:H(new Date(a,e,pe(a,e)))}}function Fa(t){const[a,e]=t.split("-").map(Number);return Ca(new Date(a,e-1,1))}function es(t,a){return Math.max(1,(q(a).getTime()-q(t).getTime())/ts)}const as=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),At=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function os(t,a){const e=new Map(a.map(n=>[n._id,n.clasificacion]));let o=0,s=0;for(const n of t){if(n.tipo!=="gasto"||n.sourceType!=="expense")continue;const i=e.get(n.sourceId??"");i!==null&&(i==="deseo"?s+=Math.abs(n.cuantia):o+=Math.abs(n.cuantia))}return{basicos:o,deseo:s}}function ss(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=l=>l.sourceType==="loan"&&l.tipo==="gasto",s=a.loanIdsIniciados,n=At(t.filter(l=>l.tipo==="ingreso")),i=At(t.filter(l=>o(l)&&(!s||s.has(l.sourceId??"")))),d=At(t.filter(l=>o(l)&&a.hipotecaIds.has(l.sourceId??""))),u=At(t.filter(l=>l.sourceType==="loan-amort")),r=At(t.filter(l=>l.sourceType==="account-interest")),{basicos:x,deseo:m}=os(t,a.expenses);return{ingresos:n/e,cuotas:i/e,cuotasHipoteca:d/e,amortizaciones:u/e,gastosBasicos:x/e,gastosDeseo:m/e,gastosTotales:(i+x+m)/e,intereses:r/e}}function za(t,a){return t.reduce((e,o)=>{const s=Z(o).tabla.filter(n=>!n.esAmortizacion&&n.fecha<=a);return e+(s.length>0?s[s.length-1].capitalPendiente:o.capital||0)},0)}function ns(t,a,e,o){const s=t.filter(r=>r.activo&&!r.simulacion&&(r.fechaInicio||"")<=e),n=s.reduce((r,x)=>{if((x.amortizaciones||[]).filter(v=>v.fecha>=a&&v.fecha<=e).length===0)return r;const l=Z(x).totalIntereses,p=Z({...x,amortizaciones:(x.amortizaciones||[]).filter(v=>v.fecha<a||v.fecha>e)}).totalIntereses;return r+Math.max(0,p-l)},0),i=s.filter(r=>r.mostrarFechaFinEnDashboard!==!1).map(r=>({loan:r,fechaFin:Z(r).fechaFin})).filter(r=>!!r.fechaFin&&r.fechaFin>=a&&r.fechaFin<=e),d=s.map(r=>Z(r).tabla),u=r=>{const{desde:x,hasta:m}=Fa(r);return d.reduce((l,p)=>{const v=p.find($=>!$.esAmortizacion&&$.fecha>=x&&$.fecha<=m);return l+(v?v.cuota:0)},0)};return{deudaInicio:za(s,a),deudaFin:za(s,e),ahorroIntereses:n,ahorroInteresesMes:o>0?n/o:0,cuotasInicio:u(a.slice(0,7)),cuotasFin:u(e.slice(0,7)),finEnPeriodo:i}}function is(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:At(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function ja(t,a=new Set,e="desglosado"){if(a.size===0)return xa(t,"gasto");const o=new Map;for(const s of t){if(s.tipo!=="gasto")continue;const n=s.tags||[],i=n.filter(r=>a.has(r)),d=n.filter(r=>!a.has(r)),u=e==="porgrupos"&&i.length>0?i:d;for(const r of u)o.set(r,(o.get(r)||0)+Math.abs(s.cuantia))}return o}function rs(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...ja(t,a.grupoTags,a.modo).entries()].filter(([s])=>!e||e.size===0||e.has(s)).map(([s,n])=>({tag:s,total:n/o})).sort((s,n)=>n.total-s.total)}function ls(t,a){const e=a.reduce((o,s)=>o+it(s),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:At(t.filter(o=>o.tipo==="gasto")),totalIngresos:At(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function cs(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function ds(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function us(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function ps(t,a){if(t.length===0)return[];const e=r=>a==="mes"?r.slice(0,7):r.slice(0,4),o=r=>a==="mes"?`${r}-01`:`${r}-01-01`,s=t[0],n=s.delta??(s.tipo==="ingreso"?Math.abs(s.cuantia):-Math.abs(s.cuantia));let i=(s.saldoAcum??0)-n;const d=[];let u=null;for(const r of t){const x=e(r.fecha),m=r.saldoAcum??i;(!u||u.periodo!==x)&&(u&&(i=u.cierre),u={periodo:x,inicio:o(x),apertura:i,cierre:m,maximo:Math.max(i,m),minimo:Math.min(i,m),eventos:0},d.push(u)),u.cierre=m,m>u.maximo&&(u.maximo=m),m<u.minimo&&(u.minimo=m),u.eventos+=1}return d}const ms=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:ps,cuentasVisibles:cs,gastoPorTagOrdenado:rs,idsHipoteca:ds,idsPrestamosIniciados:us,interesesPorCuenta:is,mesesDelPeriodo:es,metricasFlujo:ss,rangoMes:Fa,rangoMesDe:Ca,resumenPrestamosPeriodo:ns,sinTransferencias:as,sumarGastosPorTag:ja,totalesPeriodo:ls},Symbol.toStringTag,{value:"Module"}));function fs(t,a,e){const o=t||[];if(!o.length)return a;const s=o.find(i=>i.año===e);if(s)return s.tramos;const n=o.filter(i=>i.año<e).sort((i,d)=>d.año-i.año);return n.length?n[0].tramos:a}function vt(t,a){return e=>fs(t,a,e)}const Vt=8,Pa=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Ea=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Ce(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}function _a(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Pa,tramosGananciasCapital:Ea,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function vs(t,a){return{loans:[],expenses:[],accounts:[Ce(t)],nominas:[],goals:[],planes:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],config:_a(t,a)}}const gt=t=>Array.isArray(t)?t:[],gs=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Ut(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function Ta(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function Fe(t){const{varianza:a,inflacion:e,...o}=t;return o}function bs(t,a){const{hoyISO:e,finISO:o}=a,s={...t},n=gs(t.config),d={..._a(e,o)};for(const[x,m]of Object.entries(n))m!=null&&(d[x]=m);delete d.saldoInicial,delete d.saldoInicialFecha,delete d.inflacionGlobal,delete d.showMC,delete d.mcIteraciones,(!Array.isArray(d.tramos_irpf)||d.tramos_irpf.length===0)&&(d.tramos_irpf=Pa),(!Array.isArray(d.tramosGananciasCapital)||d.tramosGananciasCapital.length===0)&&(d.tramosGananciasCapital=Ea),(!Array.isArray(d.saludRegla)||d.saludRegla.length!==3)&&(d.saludRegla=[50,30,20]),(typeof d.features!="object"||d.features===null||Array.isArray(d.features))&&(d.features={}),s.config=d;let u=gt(t.accounts).map(x=>{const m={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...x};return m.modeloFondo||(m.modeloFondo=m.esFondoPension?"pension":"cuenta"),delete m.esFondoPension,Array.isArray(m.historicoSaldos)||(m.historicoSaldos=[]),Ut(m)});u.length===0&&(u=[Ce(e)]);const r=u.filter(x=>x.esCuentaPrincipal);if(r.length===0){const x=u.find(m=>m._id==="default")||u[0];u=u.map(m=>({...m,esCuentaPrincipal:m._id===x._id}))}else if(r.length>1){let x=!1;u=u.map(m=>m.esCuentaPrincipal?x?{...m,esCuentaPrincipal:!1}:(x=!0,m):m)}return s.accounts=u,s.expenses=gt(t.expenses).map(x=>{const m={basico:!1,activo:!0,tags:[],historialPrecios:[],...x};return Array.isArray(m.tags)||(m.tags=[]),Array.isArray(m.historialPrecios)||(m.historialPrecios=[]),m.diaPago=Ta(m.diaPago),Fe(Ut(m))}),s.loans=gt(t.loans).map(x=>{const m={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...x};return Array.isArray(m.tags)||(m.tags=[]),m.diaPago=Ta(m.diaPago),m.amortizaciones=gt(m.amortizaciones).map(l=>Ut(l)),Fe(Ut(m))}),s.nominas=gt(t.nominas).map(x=>{const m={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...x};return Array.isArray(m.tags)||(m.tags=[]),Array.isArray(m.retribucionFlexible)||(m.retribucionFlexible=[]),Fe(Ut(m))}),s.goals=gt(t.goals).map((x,m)=>{const l=Array.isArray(x.cuentaIds)?x.cuentaIds:x.cuentaId?[x.cuentaId]:[],{cuentaId:p,...v}=x;return{prioridad:m+1,completado:!1,usarColchon:!0,targetAmount:0,...v,cuentaIds:l}}),s.inflacion=gt(t.inflacion),s.tramosIRPFHistorico=gt(t.tramosIRPFHistorico),s.tramosGananciasCapitalHistorico=gt(t.tramosGananciasCapitalHistorico),s.escenarios=gt(t.escenarios).map(({inversiones:x,...m})=>m),s}const _t=t=>Array.isArray(t)?t:[];let ze=0;function hs(t){return ze+=1,`${t}_${ze.toString(36)}`}const ys=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),xs=t=>typeof t=="number"&&Number.isFinite(t);function $s(t,a){const e={...t};ze=0;const o=_t(t.transacciones),s=_t(t.puntosControl),n=[...s],i=new Set(s.map(r=>`${r.cuentaId}|${r.fecha}`)),d=(r,x,m,l)=>{if(!ys(x)||!xs(m))return;const p=`${r}|${x}`;i.has(p)||(i.add(p),n.push({_id:hs("pc"),fecha:x,cuentaId:r,saldoCts:xt(m),...typeof l=="string"&&l?{nota:l}:{}}))};for(const r of _t(t.accounts)){const x=typeof r._id=="string"?r._id:null;if(x)for(const m of _t(r.historicoSaldos))d(x,m.fecha,m.saldo,m.nota)}const u=_t(t.history);if(u.length>0){const r=_t(t.accounts),x=r.find(l=>l.esCuentaPrincipal)||r.find(l=>l.activo)||r[0],m=typeof(x==null?void 0:x._id)=="string"?x._id:"default";for(const l of u){const p=typeof l.cuenta=="string"?l.cuenta:typeof l.cuentaId=="string"?l.cuentaId:m;d(p,l.fecha,l.saldo,l.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=n.sort((r,x)=>String(r.fecha).localeCompare(String(x.fecha))),e}const je=t=>Array.isArray(t)?t:[],Is=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),As=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Pe=0;function Ms(){return Pe+=1,`tx_hp_${Pe.toString(36)}`}function ws(t,a){const e={...t};Pe=0;const o=[...je(t.transacciones)],s=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),n=je(t.expenses).map(i=>{const d=je(i.historialPrecios),u=typeof i._id=="string"?i._id:null,r=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",x=i.tipo==="ingreso"?"ingreso":"gasto",m=Array.isArray(i.tags)?i.tags.filter(v=>typeof v=="string"):[];if(u)for(const v of d){if(!v||!Is(v.fecha)||!As(v.cuantia))continue;const $=x==="ingreso"?xt(v.cuantia):-xt(v.cuantia),I=`${u}|${v.fecha}|${$}`;s.has(I)||(s.add(I),o.push({_id:Ms(),fecha:v.fecha,cuentaId:r,importeCts:$,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:m,estimacionId:u,tipo:x,origen:"importado",nota:typeof v.nota=="string"&&v.nota?v.nota:"Importado del historial de precios"}))}const{historialPrecios:l,...p}=i;return p});return e.expenses=n,e.transacciones=o.sort((i,d)=>String(i.fecha).localeCompare(String(d.fecha))),e}const Da=t=>Array.isArray(t)?t:[],Mt=(t,a="")=>typeof t=="string"&&t.trim()?t:a,Yt=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,Ss=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function Cs(t,a){var x;const e={...t};if(Array.isArray(e.planes))return e;const o=Da(e.goals),s=Da(e.accounts),n=s.map(m=>{const l=Yt(m.bloqueoMeses,0);return{_id:`veh_${Mt(m._id,"x")}`,nombre:Mt(m.nombre,"Cuenta"),rentabilidadRealAnual:Yt(m.interes,0)/100,liquidez:m.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":l>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Yt(m.impuestoRetirada,0)/100,topeAportacionAnual:m.modeloFondo==="pension"?xt(1500):null,riesgo:m.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:Mt(m._id,""),prestamoId:null,esDeuda:!1}}),i=new Map(s.map((m,l)=>[Mt(m._id,""),n[l]._id])),d=((x=n[0])==null?void 0:x._id)??"",u=o.map((m,l)=>{const p=Array.isArray(m.cuentaIds)?m.cuentaIds.map($=>Mt($,"")):[],v=Ss(m.targetDate);return{_id:Mt(m._id,`obj_mig_${l}`),nombre:Mt(m.nombre,`Objetivo ${l+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:xt(Yt(m.targetAmount,0)),fechaLimite:v,prioridad:Yt(m.prioridad,l+1),modoAsignacion:v?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(p[0])??d,saldoActual:0,estado:m.completado===!0?"COMPLETADO":"PENDIENTE",notas:Mt(m.notas,"")}}),r={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:n,objetivos:u,eventos:[],creadoEn:a.hoyISO};return e.planes=[r],e}const Fs=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:bs},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:$s},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:ws},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:Cs}],zs=["history"];function Ra(t,a,e){let o=t;const s=[];for(const n of[...Fs].sort((i,d)=>i.version-d.version))(a??0)>=n.version||(o=n.migrate(o,e),s.push(n.version));return{state:o,applied:s}}const ne="state_",Ee="state__schemaVersion",Na="financeapp_",Oa="state__modificadoEn";function js(t=localStorage,a=Na){const e=o=>`${a}${o}`;return{get(o){try{const s=t.getItem(e(o));return s===null?null:JSON.parse(s)}catch{return null}},set(o,s){try{t.setItem(e(o),JSON.stringify(s)),o!==Oa&&t.setItem(e(Oa),JSON.stringify(Date.now()))}catch(n){console.error("No se pudo guardar en localStorage:",o,n)}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(a)&&o.push(n.slice(a.length))}return o}}}function Ps(t=localStorage,a=Na){const e=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(ne)&&!n.startsWith(a)&&e.push(n)}const o=[];for(const s of e)try{const n=t.getItem(s);n!==null&&t.getItem(`${a}${s}`)===null&&(t.setItem(`${a}${s}`,n),o.push(s)),t.removeItem(s)}catch{}return o}function Es(t){return H(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function _s({adapter:t,hoy:a=new Date}){const e=H(a),o=Es(a);let s=vs(e,o);const n=new Set;let i=[];function d(S){for(const C of n)C(S)}function u(S){t.set(`${ne}${S}`,s[S])}function r(){const S={};for(const P of Object.keys(s)){const _=t.get(`${ne}${P}`);_!==null&&(S[P]=_)}for(const P of zs){const _=t.get(`${ne}${P}`);_!==null&&(S[P]=_)}const C=t.get(Ee),{state:j,applied:z}=Ra(S,C,{hoyISO:e,finISO:o});if(s=j,x(),z.length>0){for(const P of Object.keys(s))u(P);t.set(Ee,Vt)}return i=z,{applied:z}}function x(){if(!Array.isArray(s.accounts)||s.accounts.length===0){s.accounts=[Ce(e)],u("accounts");return}const S=s.accounts.filter(C=>C.esCuentaPrincipal);if(S.length===0)s.accounts=s.accounts.map((C,j)=>j===0?{...C,esCuentaPrincipal:!0}:C),u("accounts");else if(S.length>1){let C=!1;s.accounts=s.accounts.map(j=>j.esCuentaPrincipal?C?{...j,esCuentaPrincipal:!1}:(C=!0,j):j),u("accounts")}}function m(S){return s[S]}function l(S,C){s[S]=C,u(S),d(S)}function p(S){l("config",{...s.config,...S})}function v(S){return n.add(S),()=>n.delete(S)}function $(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function I(S,C){const j=[...s[S]],z={...C,_id:$()};return j.push(z),l(S,j),z}function f(S,C,j){const z=s[S].map(P=>P._id===C?{...P,...j}:P);l(S,z)}function g(S,C){const j=s[S].filter(z=>z._id!==C);l(S,j)}function h(){const S=s.accounts||[],C=S.find(j=>j.esCuentaPrincipal&&j.activo)||S.find(j=>j.activo);return C?C._id:"default"}function A(S){var C;return((C=s.accounts.find(j=>j._id===S))==null?void 0:C.nombre)??S}function b(){return vt(s.tramosIRPFHistorico,s.config.tramos_irpf)}function y(){return vt(s.tramosGananciasCapitalHistorico,s.config.tramosGananciasCapital)}function M(){return structuredClone(s)}function w(S,C=null){const{state:j,applied:z}=Ra(S,C,{hoyISO:e,finISO:o});s=j,x();for(const P of Object.keys(s))u(P);t.set(Ee,Vt);for(const P of Object.keys(s))d(P);return{applied:z}}return{load:r,get:m,set:l,patchConfig:p,subscribe:v,addItem:I,updateItem:f,removeItem:g,getPrincipalAccountId:h,accountName:A,resolverTramosIRPF:b,resolverTramosGanancias:y,snapshot:M,replaceAll:w,get schemaVersion(){return Vt},get migrationsApplied(){return[...i]},get today(){return e||V()}}}const J={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},wt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:J.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:J.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:J.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:J.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:J.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro",descripcion:"Metas con importe y fecha, con proyección de cumplimiento.",grupo:J.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:J.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:J.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:J.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:J.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:J.planificacion,porDefecto:!1},{id:"planner",nombre:"Objetivos financieros",descripcion:"Plan a largo plazo: objetivos que compiten por el flujo mensual y se encadenan al completarse.",grupo:J.planificacion,porDefecto:!0},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:J.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:J.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:J.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:J.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:J.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:J.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:J.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:J.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:J.datos,porDefecto:!1,dependencias:["sync-nube"]}],Ts=new Map(wt.map(t=>[t.id,t]));function Wt(t){return Ts.get(t)}function La(t){return wt.filter(a=>(a.dependencias||[]).includes(t))}function _e(){const t={};for(const a of wt)t[a.id]=a.porDefecto;return t}function qa(){const t=[],a=new Map;for(const e of wt)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function Ds(t){function a(){return{..._e(),...t.get("config").features||{}}}function e(m){t.patchConfig({features:m})}function o(m,l=a(),p=new Set){const v=Wt(m);if(!v)return!1;if(v.nucleo)return!0;if(l[m]===!1)return!1;if(p.has(m))return!0;p.add(m);for(const $ of v.dependencias||[])if(!o($,l,p))return!1;return!0}function s(m,l=a()){const p=Wt(m);return p?(p.dependencias||[]).filter(v=>!o(v,l)):[]}function n(m,l){var h;const p=Wt(m);if(!p)return{cambiadas:[]};if(p.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const v=a(),$=new Map(wt.map(A=>[A.id,o(A.id,v)])),I={...v,[m]:l};let f;if(l){const A=[...p.dependencias||[]];for(;A.length;){const b=A.pop();I[b]===!1&&(I[b]=!0,f="dependencias-activadas"),A.push(...((h=Wt(b))==null?void 0:h.dependencias)||[])}}else{const A=La(m).map(b=>b.id);for(;A.length;){const b=A.pop();I[b]!==!1&&(I[b]=!1,f="cascada-apagado"),A.push(...La(b).map(y=>y.id))}}return e(I),{cambiadas:wt.filter(A=>o(A.id,I)!==$.get(A.id)).map(A=>A.id),motivo:f}}function i(){const m=a();return wt.map(l=>{const p=s(l.id,m);return{...l,activa:o(l.id,m),...p.length>0&&m[l.id]!==!1?{bloqueadaPor:p}:{}}})}function d(){const m=a();return qa().map(({grupo:l,features:p})=>({grupo:l,features:p.map(v=>{const $=s(v.id,m);return{...v,activa:o(v.id,m),...$.length>0&&m[v.id]!==!1?{bloqueadaPor:$}:{}}})}))}function u(){e(_e())}function r(m){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...m?{nombre:m}:{},features:a()}}function x(m){const l=m,p=l&&typeof l=="object"&&l.features&&typeof l.features=="object"?l.features:null;if(!p)throw new Error('El perfil no tiene una sección "features" válida');const v=_e(),$=[],I=[];for(const[f,g]of Object.entries(p)){if(!Wt(f)){I.push(f);continue}if(typeof g!="boolean"){I.push(f);continue}v[f]=g,$.push(f)}return e(v),{aplicadas:$,ignoradas:I}}return{isEnabled:m=>o(m),setEnabled:n,estado:i,estadoPorGrupo:d,reset:u,exportProfile:r,importProfile:x,bloqueadaPor:m=>s(m)}}const Jt=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Tt(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Rs(t){var s,n;const e=(((s=t.bloqueadaPor)==null?void 0:s.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(n=t.bloqueadaPor)==null?void 0:n.map(Jt).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${Jt(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${Jt(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${Jt(t.descripcion)}</div>
        ${e}
      </div>
    </div>`}function Ns(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:s})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Jt(o)}</div>
        ${s.map(Rs).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Os(t){var s;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-feature-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function Ls(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Ns(e)}`,s(i)}function s(i){var u,r,x;i.querySelectorAll("[data-feature-toggle]").forEach(m=>{m.addEventListener("change",()=>{var v;const l=m.dataset.featureToggle,p=e.setEnabled(l,m.checked);p.motivo==="dependencias-activadas"&&Tt(t,"Se han activado también las funcionalidades necesarias"),p.motivo==="cascada-apagado"&&Tt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(v=t.onChange)==null||v.call(t,p.cambiadas),o(i)})});const d=i.querySelector("[data-feature-file]");(u=i.querySelector('[data-feature-action="export"]'))==null||u.addEventListener("click",()=>{const m=e.exportProfile(),l=new Blob([JSON.stringify(m,null,2)],{type:"application/json"}),p=URL.createObjectURL(l),v=a.createElement("a");v.href=p,v.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,v.click(),URL.revokeObjectURL(p),Tt(t,"Perfil de funcionalidades guardado")}),(r=i.querySelector('[data-feature-action="import"]'))==null||r.addEventListener("click",()=>d==null?void 0:d.click()),d==null||d.addEventListener("change",async()=>{var l,p;const m=(l=d.files)==null?void 0:l[0];if(m)try{const{aplicadas:v,ignoradas:$}=e.importProfile(JSON.parse(await m.text()));Tt(t,$.length>0?`Perfil cargado (${v.length} aplicadas, ${$.length} ignoradas por ser de otra versión)`:`Perfil cargado (${v.length} funcionalidades)`),(p=t.onChange)==null||p.call(t,v),o(i)}catch(v){Tt(t,"No se pudo cargar el perfil: "+v.message,"err")}finally{d.value=""}}),(x=i.querySelector('[data-feature-action="reset"]'))==null||x.addEventListener("click",()=>{var m;e.reset(),Tt(t,"Funcionalidades restablecidas"),(m=t.onChange)==null||m.call(t,[]),o(i)})}function n(){const i=Os(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:n,renderInto:o}}const ka={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function Ba(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const s=a(o);e.style.display=s?"":"none",s?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function qs({flags:t,document:a=document,router:e,rutasExtra:o}){function s(){const d=a.querySelector(".nav-btn.active[data-view]");return(d==null?void 0:d.dataset.view)??null}function n(){let d=!1;const u=Object.entries((o==null?void 0:o())??{}).map(([r,x])=>[x,r]);for(const[r,x]of[...Object.entries(ka),...u]){const m=t.isEnabled(r),l=a.querySelector(`.nav-btn[data-view="${x}"]`);l&&(l.style.display=m?"":"none"),!m&&s()===x&&(d=!0)}if(a.querySelectorAll(".nav-section").forEach(r=>{const x=[...r.querySelectorAll(".nav-btn[data-view]")];if(x.length===0)return;const m=x.some(l=>l.style.display!=="none");r.style.display=m?"":"none"}),Ba(a,r=>t.isEnabled(r)),d){const r=e??globalThis.Router;r==null||r.navigate("dashboard")}}function i(d=a.body){if(typeof MutationObserver>"u")return()=>{};let u=!1;const r=new MutationObserver(()=>{if(!u){u=!0;try{Ba(a,x=>t.isEnabled(x))}finally{u=!1}}});return r.observe(d,{childList:!0,subtree:!0}),()=>r.disconnect()}return{apply:n,observar:i,vistaPara:d=>ka[d]}}function ks({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function s(v){return`view-${v}`}function n(v){const $=t.getElementById(s(v.route));if($)return $;const I=t.querySelector(".view-container");if(!I)return null;const f=t.createElement("div");return f.id=s(v.route),f.className="view hidden",I.appendChild(f),f}function i(v){if(t.querySelector(`.nav-btn[data-view="${v.route}"]`))return;const $=t.querySelectorAll(".nav-section"),I=$[v.seccion??Math.max(0,$.length-1)];if(!I)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=v.route,f.innerHTML=`${v.iconoPath?`<svg viewBox="0 0 24 24"><path d="${v.iconoPath}"/></svg>`:""}<span>${v.nombre}</span>`,I.appendChild(f),f.addEventListener("click",()=>{const g=globalThis.Router;g==null||g.navigate(v.route)})}function d(v){e.set(v.route,v),n(v),i(v)}function u(){return[...e.keys()].filter(v=>{const $=e.get(v);return!a||a($.flagId??$.id)})}function r(v){return u().includes(v)}function x(v){const $=e.get(v);if(!$||a&&!a($.flagId??$.id))return!1;const I=n($);if(!I)return!1;if(o&&o!==v){const f=e.get(o),g=t.getElementById(s(o));f!=null&&f.unmount&&g&&f.unmount(g)}return $.mount(I),o=v,!0}function m(){o&&x(o)}function l(){const v={};for(const[$,I]of e)v[$]=I.flagId??I.id;return v}function p(){for(const v of e.values())n(v),i(v)}return{register:d,routes:u,has:r,mount:x,rerender:m,flagPorRuta:l,attachToShell:p,get activa(){return o}}}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Dt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${c(F(t))}</span>`}function Ha(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function Ga(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${c(a)}</span>`).join(" ")}const Bs=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Hs(t){const[a,e]=t.split("-").map(Number);return`${Bs[e-1]} ${a}`}function D(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function tt(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function E(t,a,e){t.addEventListener("click",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(a);s&&t.contains(s)&&e(s,o)})}function W(t,a,e){t.addEventListener("change",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(a);s&&t.contains(s)&&e(s,o)})}function ut(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function Va(t,a){const e=parseFloat(ut(t,a));return Number.isFinite(e)?e:0}function Gs(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Vs(t,a){const{ledger:e}=t,o=(t.hoy??V)(),s=t.accounts().filter(g=>g.activo),{desde:n,hasta:i}=Gs(a.mes),d={cuentaId:a.cuentaId||void 0,desde:n,hasta:i,texto:a.filtroTexto||void 0},u=e.transacciones(d),r=t.estimaciones().filter(g=>g.tipo!=="transferencia"),x=u.filter(g=>g.importeCts<0).reduce((g,h)=>g+h.importeCts,0),m=u.filter(g=>g.importeCts>0).reduce((g,h)=>g+h.importeCts,0),l=a.cuentaId?e.saldoCuenta(a.cuentaId,i):e.saldoTotal(i),p=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),v=s.map(g=>`<option value="${c(g._id)}"${g._id===a.cuentaId?" selected":""}>${c(g.nombre)}</option>`).join(""),$=g=>'<option value="">— sin asignar —</option>'+r.map(h=>`<option value="${c(h._id)}"${h._id===g?" selected":""}>${c(h.concepto)} (${c(F(h.cuantia))})</option>`).join(""),I=u.map(g=>{var h;return`
      <tr data-tx="${c(g._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${c(g.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${c(g.concepto)}</td>
        <td style="padding:7px 8px">${Ga(g.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${c(((h=t.accounts().find(A=>A._id===g.cuentaId))==null?void 0:h.nombre)??g.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${c(g._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${$(g.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Dt(at(g.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${c(g._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${c(g._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),f=p.slice().reverse().slice(0,8).map(g=>{var h;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${c(g.fecha)}</span>
        <span style="color:var(--text3)">${c(((h=t.accounts().find(A=>A._id===g.cuentaId))==null?void 0:h.nombre)??g.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${c(F(at(g.saldoCts)))}</span>
        ${g.nota?`<span style="color:var(--text3)">${c(g.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${c(g._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="card-title">Movimientos reales</div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${v}</select>
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
          <span>Gastos: ${Dt(at(x))}</span>
          <span>Ingresos: ${Dt(at(m))}</span>
          <span>Neto: ${Dt(at(m+x))}</span>
          <span style="margin-left:auto">Saldo a ${c(i)}: <strong>${c(F(l))}</strong></span>
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
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${v}</select></div>
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
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${v}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${f?`<div class="mt-12">${f}</div>`:""}
        </div>
      </div>
    </div>`}function Us(t,a,e,o){const{ledger:s}=a;W(t,"#acc-cuenta",i=>{e.cuentaId=i.value,o()}),W(t,"#acc-mes",i=>{e.mes=i.value||e.mes,o()});const n=t.querySelector("#acc-buscar");n==null||n.addEventListener("input",()=>{e.filtroTexto=n.value,clearTimeout(n._t),n._t=window.setTimeout(o,200)}),E(t,"#nt-guardar",()=>{const i=ut(t,"#nt-concepto").trim(),d=Va(t,"#nt-importe");if(!i)return D("Indica un concepto","err");if(!(d>0))return D("Indica un importe mayor que cero","err");const u=ut(t,"#nt-tags").split(",").map(r=>r.trim().toLowerCase()).filter(Boolean);s.registrar({fecha:ut(t,"#nt-fecha")||(a.hoy??V)(),cuentaId:ut(t,"#nt-cuenta"),importe:d,concepto:i,tags:u,tipo:ut(t,"#nt-tipo"),estimacionId:ut(t,"#nt-estimacion")||null}),D("Movimiento registrado"),a.onDatosCambiados(),o()}),E(t,"[data-tx-borrar]",i=>{const d=i.dataset.txBorrar;tt("¿Eliminar este movimiento?")&&(s.eliminar(d),D("Movimiento eliminado"),a.onDatosCambiados(),o())}),E(t,"[data-tx-editar]",i=>{const d=i.dataset.txEditar,u=s.transacciones().find(m=>m._id===d);if(!u)return;const r=window.prompt(`Importe de "${u.concepto}" (€)`,String(Math.abs(at(u.importeCts))));if(r===null)return;const x=parseFloat(r.replace(",","."));if(!Number.isFinite(x)||x<=0)return D("Importe no válido","err");s.actualizar(d,{importe:x}),D("Movimiento actualizado"),a.onDatosCambiados(),o()}),W(t,"[data-tx-estimacion]",i=>{const d=i.getAttribute("data-tx-estimacion");s.asignarEstimacion(d,i.value||null),D("Asignación actualizada"),a.onDatosCambiados()}),E(t,"#pc-guardar",()=>{if(ut(t,"#pc-saldo").trim()==="")return D("Indica el saldo","err");const d=Va(t,"#pc-saldo");s.registrarPuntoControl(ut(t,"#pc-cuenta"),ut(t,"#pc-fecha")||(a.hoy??V)(),d,ut(t,"#pc-nota").trim()||void 0),D("Saldo real registrado"),a.onDatosCambiados(),o()}),E(t,"[data-pc-borrar]",i=>{tt("¿Eliminar este punto de control?")&&(s.eliminarPuntoControl(i.dataset.pcBorrar),D("Punto de control eliminado"),a.onDatosCambiados(),o())})}function Ua(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:s=5}=e;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const n=ot(t.mediaRealReciente),i=ot(n-a),d=a!==0?i/Math.abs(a)*100:n!==0?100:0;if(Math.abs(d)<s)return null;const u=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:ot(a),cuantiaSugerida:n,diferencia:i,variacionPct:d,precision:t.precision,mesesConsiderados:u,motivo:i>0?`El gasto real de los últimos ${u} meses supera lo estimado`:`El gasto real de los últimos ${u} meses es inferior a lo estimado`}}function Ys(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(n,i,d={}){const u=d.hoy??V(),r=t.get("expenses"),x=r.find(v=>v._id===n);if(!x)throw new Error(`La estimación ${n} no existe`);const m={...x,fechaFin:u},l={...x,_id:a(),cuantia:ot(i),fechaInicio:u,fechaFin:x.fechaFin??null,ajustadaDesdeId:x._id,ajustadaEn:u},p=r.map(v=>v._id===n?m:v);return p.push(l),t.set("expenses",p),{estimacionCerrada:m,estimacionNueva:l}}function o(n,i={}){const d=[],u=[];for(const r of n)try{d.push(e(r.estimacionId,r.cuantiaSugerida,i))}catch(x){u.push({estimacionId:r.estimacionId,error:x.message})}return{aplicadas:d,errores:u}}function s(n){const i=t.get("expenses"),d=new Map(i.map($=>[$._id,$])),u=d.get(n);if(!u)return[];const r=[];let x=u;const m=new Set;for(;x!=null&&x.ajustadaDesdeId&&!m.has(x._id);){m.add(x._id);const $=d.get(x.ajustadaDesdeId);if(!$)break;r.unshift($),x=$}const l=[];let p=u;const v=new Set([u._id]);for(;;){const $=i.find(I=>I.ajustadaDesdeId===p._id&&!v.has(I._id));if(!$)break;v.add($._id),l.push($),p=$}return[...r,u,...l]}return{aplicar:e,aplicarTodas:o,cadena:s}}function Te(t){const a=t.estimaciones(),e=new Map(a.map(o=>[o._id,o]));return t.precision.analizarTodas(a).map(o=>{const s=e.get(o.estimacionId);return{analisis:o,estimacion:s,sugerencia:Ua(o,s.cuantia)}}).filter(o=>!!o.estimacion)}function Ws(t){const a=Te(t),e=a.filter(u=>u.analisis.precision!==null),o=a.filter(u=>u.sugerencia!==null),s=t.precision.analizarPorTag(a.map(u=>u.analisis));if(e.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const n=e.map(({analisis:u,estimacion:r,sugerencia:x})=>{const m=u.meses.slice(-6).map(l=>`${Hs(l.mes)}: ${F(l.estimado)} → ${F(l.real)} (${l.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${c(r.concepto)}</div>
          <div style="margin-top:3px">${Ga(u.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${c(m)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(F(u.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(F(u.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Dt(u.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${Ha(u.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${x?`<button class="btn-secondary" data-sugerir="${c(u.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${c(x.motivo)}">Sugerir ajuste → ${c(F(x.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=s.map(u=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${c(u.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${u.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(F(u.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(F(u.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Dt(u.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${Ha(u.precision)}</td>
      </tr>`).join(""),d=(u,r="left")=>`<th style="padding:7px 8px;text-align:${r};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${u}</th>`;return`
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
            ${d("Estimación")}${d("Estimado","right")}${d("Real","right")}${d("Desviación","right")}${d("Precisión","right")}${d("","right")}
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
            ${d("Etiqueta")}${d("Estimaciones","right")}${d("Estimado","right")}${d("Real","right")}${d("Desviación","right")}${d("Precisión","right")}
          </tr></thead>
          <tbody>${i||'<tr><td colspan="6" style="padding:14px;text-align:center;color:var(--text2);font-size:13px">Sin etiquetas comparables.</td></tr>'}</tbody>
        </table>
      </div>
    </div>`}function Js(t,a,e){E(t,"[data-sugerir]",o=>{const s=o.dataset.sugerir,n=Te(a).find(u=>u.analisis.estimacionId===s);if(!(n!=null&&n.sugerencia))return;const i=n.sugerencia,d=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${F(i.cuantiaActual)}
Nueva estimación: ${F(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;tt(d)&&(a.adjuster.aplicar(s,i.cuantiaSugerida,{hoy:a.hoy()}),D(`Estimación ajustada a ${F(i.cuantiaSugerida)}`),a.onDatosCambiados(),e())}),E(t,"#ajustar-todas",()=>{const o=Te(a).map(d=>d.sugerencia).filter(d=>d!==null);if(o.length===0)return;const s=o.map(d=>`• ${d.concepto}: ${F(d.cuantiaActual)} → ${F(d.cuantiaSugerida)}`).join(`
`);if(!tt(`Se van a ajustar ${o.length} estimaciones:

${s}

¿Continuar?`))return;const{aplicadas:n,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});D(i.length>0?`${n.length} ajustadas, ${i.length} con error`:`${n.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const Ks="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function Qs(t){const a={cuentaId:"",mes:(t.hoy??V)().slice(0,7),filtroTexto:""},e=()=>{var d;return(d=t.onDatosCambiados)==null?void 0:d.call(t)},o=t.hoy??V,s={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:o},n={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:e,hoy:o};function i(d){const u=t.ledger.saldoTotal(o()),r=t.ledger.ultimaFecha(),x=t.ledger.transacciones().length;d.innerHTML=`
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
          <div class="stat-value" style="font-size:1.3rem">${c(F(u))}</div>
          <div style="font-size:11px;color:var(--text3)">suma de cuentas activas</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Movimientos registrados</div>
          <div class="stat-value" style="font-size:1.3rem">${x}</div>
          <div style="font-size:11px;color:var(--text3)">${r?`último: ${c(r)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const m=d.querySelector("#acc-transacciones"),l=d.querySelector("#acc-precision");m.innerHTML=Vs(s,a),l.innerHTML=Ws(n);const p=()=>i(d);Us(m,s,a,p),Js(l,n,p)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:Ks,mount:i}}const Xs="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function De(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function Zs(t){const{store:a}=t,e=t.hoy??V,o=()=>q(e()),s=()=>a.get("config").margenesSeguridad??[];function n(p){var v;a.patchConfig({margenesSeguridad:p}),(v=t.onDatosCambiados)==null||v.call(t)}function i(p,v){const $=s().map(f=>({...f,puntos:(f.puntos??[]).map(g=>({...g}))})),I=$.find(f=>f._id===p);I&&(v(I),n($))}function d(p){const v=a.get("config"),$=se(p,a.get("expenses"),v,a.get("loans"),e(),!1,o());return F($)}function u(p,v,$){const I=v.tipo==="fijo",f=I?"":`<span class="text-sm" style="color:var(--text3)">${c(F((v.meses??0)*$))}</span>`;return`
      <tr data-punto="${c(v._id)}" data-margen="${c(p._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${c(v.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${I?" selected":""}>Fijo €</option>
            <option value="meses"${I?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${I?`<input type="number" class="form-input" style="width:90px" value="${v.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${I?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${v.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${f}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function r(p,v,$){const I=p.cuentas&&p.cuentas.length>0?p.cuentas.map(A=>{var b;return((b=v.find(y=>y._id===A))==null?void 0:b.nombre)??A}).join(", "):"Todas las cuentas activas",g=[...p.puntos??[]].sort((A,b)=>A.fecha.localeCompare(b.fecha)).map(A=>u(p,A,$)).join(""),h=p.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${c(I)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${c(d(p))}</strong>
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
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${c(p._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${c(p.nombre)}</span>
            <span class="badge ${p.activo?"badge-active":"badge-inactive"}">${p.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${p.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${p.activo?"checked":""} data-toggle-margen="${c(p._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${c(p._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${c(p._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${h}
      </div>`}function x(p,v){const $=v?s().find(h=>h._id===v):null,I=a.get("accounts").filter(h=>h.activo),f=new Set(($==null?void 0:$.cuentas)??[]),g=I.map(h=>`
        <label class="tag" data-chip="${c(h._id)}" style="cursor:pointer;${f.has(h._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${c(h._id)}" ${f.has(h._id)?"checked":""} style="display:none"/>
          ${c(h.nombre)}
        </label>`).join(" ");p.innerHTML=`
      <div class="modal-title">${v?"Editar margen":"Nuevo margen de seguridad"}</div>
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
        <button class="btn-primary" data-guardar-margen="${c(v??"")}">Guardar</button>
      </div>`}function m(p,v){const $=document.getElementById("modal-overlay"),I=document.getElementById("modal-content");!$||!I||(x(I,p),$.classList.remove("hidden"),W(I,".mg-acc-chip",f=>{const g=f,h=I.querySelector(`[data-chip="${g.value}"]`);h&&(h.style.cssText=`cursor:pointer;${g.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),W(I,"#mg-p-tipo",f=>{const g=f.value==="fijo",h=I.querySelector("#mg-p-importe-wrap"),A=I.querySelector("#mg-p-meses-wrap");h&&(h.style.display=g?"":"none"),A&&(A.style.display=g?"none":"")}),E(I,"[data-cerrar-form]",()=>$.classList.add("hidden")),E(I,"[data-guardar-margen]",f=>{var y,M,w,S,C;const g=f.getAttribute("data-guardar-margen")||"",h=((y=I.querySelector("#mg-nombre"))==null?void 0:y.value.trim())??"";if(!h)return D("El nombre es obligatorio","err");const A=[...I.querySelectorAll(".mg-acc-chip:checked")].map(j=>j.value),b=s().map(j=>({...j}));if(g){const j=b.findIndex(z=>z._id===g);if(j===-1)return D("Margen no encontrado","err");b[j]={...b[j],nombre:h,cuentas:A}}else{const j=((M=I.querySelector("#mg-p-tipo"))==null?void 0:M.value)??"fijo",z={_id:De(),fecha:((w=I.querySelector("#mg-p-fecha"))==null?void 0:w.value)||V(),tipo:j,importe:parseFloat(((S=I.querySelector("#mg-p-importe"))==null?void 0:S.value)??"0")||0,meses:parseFloat(((C=I.querySelector("#mg-p-meses"))==null?void 0:C.value)??"1")||1};b.push({_id:De(),nombre:h,activo:!0,cuentas:A,puntos:[z]})}n(b),D(g?"Margen actualizado":"Margen creado"),$.classList.add("hidden"),v()}))}function l(p){const v=s(),$=a.get("accounts"),I=Ht(a.get("expenses"),o());p.innerHTML=`
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
      ${v.length===0?`<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`:v.map(g=>r(g,$,I)).join("")}`;const f=()=>l(p);E(p,"[data-nuevo-margen]",()=>m(null,f)),E(p,"[data-editar-margen]",g=>m(g.getAttribute("data-editar-margen"),f)),E(p,"[data-borrar-margen]",g=>{tt("¿Eliminar este margen de seguridad?")&&(n(s().filter(h=>h._id!==g.getAttribute("data-borrar-margen"))),D("Margen eliminado"),f())}),W(p,"[data-toggle-margen]",g=>{const h=g.getAttribute("data-toggle-margen");i(h,A=>{A.activo=g.checked}),f()}),E(p,"[data-add-punto]",g=>{const h=g.getAttribute("data-add-punto");i(h,A=>{A.puntos=[...A.puntos??[],{_id:De(),fecha:V(),tipo:"fijo",importe:0,meses:1}]}),f()}),E(p,"[data-borrar-punto]",g=>{const h=g.closest("[data-punto]");if(!h)return;const A=h.dataset.margen,b=h.dataset.punto;i(A,y=>{y.puntos=(y.puntos??[]).filter(M=>M._id!==b)}),f()}),W(p,"[data-campo]",g=>{const h=g.closest("[data-punto]");if(!h)return;const A=g.getAttribute("data-campo"),b=g.value;i(h.dataset.margen,y=>{const M=(y.puntos??[]).find(w=>w._id===h.dataset.punto);M&&(A==="fecha"?M.fecha=b:A==="tipo"?M.tipo=b:A==="importe"?M.importe=parseFloat(b)||0:M.meses=parseFloat(b)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:Xs,mount:l}}const tn="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function en(t){const a=Array.isArray(t)?t[1]??[]:[];return Array.isArray(a)?a.filter(e=>e&&e.value!==null&&e.value!==void 0&&Number.isFinite(Number(e.value))).map(e=>({year:parseInt(e.date),tasa:parseFloat(Number(e.value).toFixed(2))})).filter(e=>Number.isFinite(e.year)).sort((e,o)=>e.year-o.year):[]}function an({fetchImpl:t,url:a=tn}={}){let e=null,o=!1;async function s(n=!1){if(e&&!n)return e;if(o)return null;o=!0;try{const d=await(t??fetch)(a);if(!d.ok)throw new Error(`HTTP ${d.status}`);return e=en(await d.json()),e}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:s,invalidar:()=>{e=null},get enCache(){return e}}}const on="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function sn(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function nn(t){const{store:a}=t,e=t.ipc??an(),o=()=>a.get("inflacion")??[];function s(){var m;(m=t.onDatosCambiados)==null||m.call(t)}function n(m,l){if(!m||m.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const p=new Set(o().map(g=>g.year)),v=m.filter(g=>g.year>=l).reverse(),$=v.filter(g=>!p.has(g.year)).length,I=[...new Set(m.map(g=>g.year))].sort((g,h)=>g-h),f=v.map(g=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${g.year}" data-tasa="${g.tasa}" ${p.has(g.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${g.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${sn(g.tasa)}">${g.tasa.toFixed(2)}%</span>
          ${p.has(g.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${I.map(g=>`<option value="${g}"${g===l?" selected":""}>${g}</option>`).join("")}
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
      </div>`}function i(m){return!m||m.length===0?2e3:Math.max(m[0].year,new Date().getFullYear()-25)}async function d(m){const l=document.getElementById("modal-overlay"),p=document.getElementById("modal-content");if(!l||!p)return;p.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,l.classList.remove("hidden");const v=(I,f)=>{const g=document.getElementById("ipc-body");g&&(g.innerHTML=n(I,f))},$=await e.obtener();v($,i($)),E(p,"[data-ipc-cerrar]",()=>l.classList.add("hidden")),W(p,"#ipc-desde",I=>{v(e.enCache,parseInt(I.value))}),E(p,"[data-ipc-recargar]",()=>{e.invalidar();const I=document.getElementById("ipc-body");I&&(I.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),e.obtener(!0).then(f=>v(f,i(f)))}),E(p,"[data-ipc-importar]",()=>{const I=[...p.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(I.length===0)return D("Nada seleccionado","err");const f=new Set(o().map(h=>h.year));let g=0;for(const h of I){const A=parseInt(h.dataset.year??""),b=parseFloat(h.dataset.tasa??"");!Number.isFinite(A)||!Number.isFinite(b)||f.has(A)||(a.addItem("inflacion",{year:A,tasa:b}),f.add(A),g++)}l.classList.add("hidden"),D(`${g} periodo${g!==1?"s":""} importado${g!==1?"s":""} correctamente`),s(),m()})}function u(m,l){var f;const p=document.getElementById("modal-overlay"),v=document.getElementById("modal-content");if(!p||!v)return;const $=m?o().find(g=>g._id===m):null;v.innerHTML=`
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
      </div>`,p.classList.remove("hidden");const I=()=>{var y;const g=parseFloat(((y=v.querySelector("#inf-tasa"))==null?void 0:y.value)??""),h=v.querySelector("#inf-preview");if(!h)return;if(!Number.isFinite(g)||g<=0){h.innerHTML="";return}const A=(Math.pow(1+g/100,1/12)-1)*100,b=Math.pow(1+g/100,5);h.innerHTML=`Con un ${g}% anual: <strong>${A.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${b.toFixed(3)}</strong> (+${((b-1)*100).toFixed(1)}%)`};(f=v.querySelector("#inf-tasa"))==null||f.addEventListener("input",I),I(),E(v,"[data-inf-cerrar]",()=>p.classList.add("hidden")),E(v,"[data-inf-guardar]",g=>{const h=g.getAttribute("data-inf-guardar")||"",A=parseInt(v.querySelector("#inf-year").value),b=parseFloat(v.querySelector("#inf-tasa").value);if(!Number.isFinite(A)||A<1900||A>2200)return D("Año inválido","err");if(!Number.isFinite(b)||b<0||b>100)return D("Tasa inválida (0–100%)","err");if(o().filter(M=>M._id!==h).some(M=>M.year===A))return D("Ya existe un periodo para ese año","err");h?(a.updateItem("inflacion",h,{year:A,tasa:b}),D("Periodo actualizado")):(a.addItem("inflacion",{year:A,tasa:b}),D("Periodo añadido")),p.classList.add("hidden"),s(),l()})}function r(m,l){const p=(Math.pow(1+m.tasa/100,.08333333333333333)-1)*100,v=`${m.year}-12-31`,$=v>l?ct([m],l,v):null;return`
      <div class="exp-table-row" data-periodo="${c(m._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${m.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${m.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${p.toFixed(3)}%/mes</div>
        <div class="num">${$!==null?`×${$.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${c(m._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${c(m._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function x(m){const l=o(),p=a.get("config").usarInflacion||!1,v=[...l].sort((y,M)=>M.year-y.year),$=V(),I=new Date().getFullYear(),f=H(new Date(I+5,0,1)),g=H(new Date(I+10,0,1)),h=p&&l.length>0?ct(l,$,f):null,A=p&&l.length>0?ct(l,$,g):null;m.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${!p&&l.length===0?`<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
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
            <input type="checkbox" data-toggle-inflacion ${p?"checked":""}/>
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${h!==null&&A!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${h.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((h-1)*100).toFixed(1)}%)</span></div>
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
        ${v.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':v.map(y=>r(y,$)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const b=()=>x(m);W(m,"[data-toggle-inflacion]",y=>{const M=y.checked;a.patchConfig({usarInflacion:M}),D(M?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),s(),b()}),E(m,"[data-nuevo-periodo]",()=>u(null,b)),E(m,"[data-editar-periodo]",y=>u(y.getAttribute("data-editar-periodo"),b)),E(m,"[data-importar-ipc]",()=>void d(b)),E(m,"[data-borrar-periodo]",y=>{tt("¿Eliminar este periodo de inflación?")&&(a.removeItem("inflacion",y.getAttribute("data-borrar-periodo")),D("Periodo eliminado"),s(),b())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:on,mount:x}}const rn=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],ln=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],cn=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function dn(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Re=(t,a)=>t.map(([e,o])=>`<option value="${c(e)}"${e===a?" selected":""}>${c(o)}</option>`).join("");function Ya(t,a="dp"){const{modo:e,dia:o,nth:s,wd:n}=dn(t),i=Re(rn.map(d=>[d,d==="ultimo"?"Último día":d]),o);return`<div class="form-group" data-diapago="${c(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Re(ln,s)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Re(cn,n)}</select>
        del mes
      </span>
    </div>
  </div>`}function Wa(t){var o,s,n;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(s=a.querySelector("[data-dp-dia]"))==null||s.style.setProperty("display",e==="dia"?"":"none"),(n=a.querySelector("[data-dp-nth]"))==null||n.style.setProperty("display",e==="nthweekday"?"":"none")}function Ja(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=s=>{var n;return((n=a.querySelector(s))==null?void 0:n.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const un="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",pn=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function mn(t){const a=t.hoy??V,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},s=()=>t.store.get("accounts"),n=f=>{var g;return((g=s().find(h=>h._id===(f||"default")))==null?void 0:g.nombre)??(f||"default")};function i(){const f=a();let g=[...t.store.get("expenses")];if(e.mostrarExpirados||(g=g.filter(h=>!h.fechaFin||h.fechaFin>=f)),e.tipo&&(g=g.filter(h=>h.tipo===e.tipo)),e.cuenta&&(g=g.filter(h=>(h.cuenta||"default")===e.cuenta)),e.desde&&(g=g.filter(h=>(h.fechaInicio??"")>=e.desde)),e.hasta&&(g=g.filter(h=>(h.fechaInicio??"")<=e.hasta)),e.busqueda){const h=e.busqueda.toLowerCase();g=g.filter(A=>A.concepto.toLowerCase().includes(h))}return e.tags.size>0&&(g=g.filter(h=>(h.tags||[]).some(A=>e.tags.has(A)))),g.sort((h,A)=>{const b=h[e.orden]??"",y=A[e.orden]??"";return typeof b=="number"&&typeof y=="number"?(b-y)*e.sentido:String(b).localeCompare(String(y))*e.sentido})}function d(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function u(f,g){const h=e.orden===f?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${c(g)} <span class="sort-arrow">${h}</span></span>`}function r(f,g=!1){return(g?'<option value="">Todas las cuentas</option>':"")+s().filter(A=>A.activo!==!1).map(A=>`<option value="${c(A._id)}"${A._id===f?" selected":""}>${c(A.nombre)}</option>`).join("")}function x(f){const g=f.tipo==="transferencia",h=me(f.diaPago??""),A=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${h?` · ${h}`:""}`,b=!!f.fechaFin&&f.fechaFin<a(),y=g?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',M=g?`${c(n(f.cuenta))} → ${c(n(f.cuentaDestino))}`:c(n(f.cuenta)),w=(f.tags||[]).map(S=>`<span class="tag${e.tags.has(S)?" active":""}" data-tag="${c(S)}" title="Filtrar por ${c(S)}">${c(S)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(f.concepto)}</div>
        <div class="tag-list mt-4">${w}</div>
      </div>
      <div>${y}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":g?"":"neg"}">${g?"⇄ ":""}${c(F(f.cuantia))}</div>
      <div class="text-sm">${c(A)}</div>
      <div class="text-sm exp-col-hide">${M}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${c(f._id)}"${f.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${f.tipo==="gasto"&&f.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffd166" title="Gasto clasificado como deseo">deseo</span>':""}
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
    </div>`}function m(f){const g=i(),h=d();f.innerHTML=`
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
        <select class="form-select" data-f-cuenta>${r(e.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${c(e.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${c(e.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${h.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${h.map(A=>`<span class="tag${e.tags.has(A)?" active":""}" data-tag="${c(A)}">${c(A)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${u("concepto","Concepto")} ${u("tipo","Tipo")} ${u("cuantia","Cuantía")} ${u("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${g.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':g.map(x).join("")}
      </div>`}function l(f){const g=(f==null?void 0:f.tipo)==="transferencia",h=t.store.get("escenarios"),A=(f==null?void 0:f.escenarioIds)||[],b=(y,M,w,S,C="")=>`<div class="form-group"><label class="form-label">${c(M)}</label>
       <input class="form-input" type="${w}" id="${y}" value="${c(S)}" placeholder="${c(C)}"/></div>`;return`
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
            ${pn.map(([y,M])=>`<option value="${y}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===y?" selected":""}>${c(M)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${b("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${r((f==null?void 0:f.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${g?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${r((f==null?void 0:f.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(f==null?void 0:f.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${f!=null&&f._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${b("ef-fecha-fin","Fecha fin (opcional)","date",(f==null?void 0:f.fechaFin)??"")}</div>
          <div class="mt-8">${Ya(f==null?void 0:f.diaPago,"exp")}</div>
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
          ${h.length>0?`<div class="form-group mt-8"><label class="form-label">Escenarios</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${h.map(y=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${A.includes(y._id)?c(y.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${c(y._id)}"${A.includes(y._id)?" checked":""}/>
                          ${c(y.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${c((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function p(f){var A;const g=((A=f.querySelector("#ef-tipo"))==null?void 0:A.value)??"gasto",h=(b,y)=>{const M=f.querySelector(b);M&&(M.style.display=y?"":"none")};h("#ef-destino-wrap",g==="transferencia"),h("#ef-basico-wrap",g!=="transferencia"),h("#ef-irpf-wrap",g==="ingreso"),h("#ef-clasificacion-wrap",g==="gasto")}function v(f,g,h){const A=document.getElementById("modal-overlay"),b=document.getElementById("modal-content");!A||!b||(b.innerHTML=`<div class="modal-title">${c(g)}</div>${l(f)}`,A.classList.remove("hidden"),W(b,"#ef-tipo",()=>p(b)),W(b,"[data-dp-modo]",()=>Wa(b)),E(b,"[data-cancelar]",()=>A.classList.add("hidden")),E(b,"[data-guardar]",y=>{$(b,y.getAttribute("data-guardar")||"")&&(A.classList.add("hidden"),h())}))}function $(f,g){const h=j=>{var z;return((z=f.querySelector(j))==null?void 0:z.value)??""},A=j=>{var z;return!!((z=f.querySelector(j))!=null&&z.checked)},b=h("#ef-tipo")||"gasto",y=b==="transferencia",M=h("#ef-concepto").trim(),w=parseFloat(h("#ef-cuantia"));if(!M||!Number.isFinite(w))return D("Concepto y cuantía obligatorios","err"),!1;const S=h("#ef-clasificacion"),C={concepto:M,tipo:b,cuantia:w,frecuencia:parseInt(h("#ef-frecuencia"),10)||1,tipoFrecuencia:h("#ef-tipo-frec")||"mensual",fechaInicio:h("#ef-fecha-ini"),fechaFin:h("#ef-fecha-fin")||null,diaPago:Ja(f),cuenta:h("#ef-cuenta"),cuentaDestino:y?h("#ef-cuenta-dest")||"default":void 0,activo:A("#ef-activo"),basico:!y&&A("#ef-basico"),sujetoIRPF:!y&&A("#ef-sujetoIRPF"),clasificacion:b==="gasto"?S||null:void 0,tags:y?["transferencia"]:h("#ef-tags").split(",").map(j=>j.trim()).filter(Boolean),escenarioIds:[...f.querySelectorAll(".ef-escenario:checked")].map(j=>j.value)};return g?(t.store.updateItem("expenses",g,C),D("Actualizado")):(t.store.addItem("expenses",C),D("Creado")),o(),!0}function I(f,g){const h=f.querySelector("[data-busqueda]");let A;h==null||h.addEventListener("input",()=>{clearTimeout(A),A=setTimeout(()=>{e.busqueda=h.value,g();const b=f.querySelector("[data-busqueda]");b==null||b.focus(),b==null||b.setSelectionRange(b.value.length,b.value.length)},250)}),W(f,"[data-expirados]",b=>{e.mostrarExpirados=b.checked,g()}),W(f,"[data-f-tipo]",b=>{e.tipo=b.value,g()}),W(f,"[data-f-cuenta]",b=>{e.cuenta=b.value,g()}),W(f,"[data-f-desde]",b=>{e.desde=b.value,g()}),W(f,"[data-f-hasta]",b=>{e.hasta=b.value,g()}),E(f,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,g()}),E(f,"[data-limpiar-tags]",()=>{e.tags=new Set,g()}),E(f,"[data-tag]",b=>{const y=b.getAttribute("data-tag");e.tags.has(y)?e.tags.delete(y):e.tags.add(y),g()}),E(f,"[data-orden]",b=>{const y=b.getAttribute("data-orden");e.orden===y?e.sentido=e.sentido===1?-1:1:(e.orden=y,e.sentido=1),g()}),E(f,"[data-nuevo]",()=>v(null,"Nuevo gasto/ingreso",g)),E(f,"[data-editar]",b=>{const y=t.store.get("expenses").find(M=>M._id===b.getAttribute("data-editar"));y&&v(y,"Editar",g)}),E(f,"[data-duplicar]",b=>{const y=t.store.get("expenses").find(S=>S._id===b.getAttribute("data-duplicar"));if(!y)return;const{_id:M,...w}=y;v({...w,concepto:`${y.concepto} (copia)`},"Duplicar movimiento",g)}),E(f,"[data-borrar]",b=>{tt("¿Eliminar?")&&(t.store.removeItem("expenses",b.getAttribute("data-borrar")),D("Eliminado"),o(),g())}),W(f,"[data-activo]",b=>{const y=b;t.store.updateItem("expenses",y.getAttribute("data-activo"),{activo:y.checked}),o(),g()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:un,mount(f){const g=()=>m(f);m(f),f.dataset.wired!=="1"&&(I(f,g),f.dataset.wired="1")}}}function ie(t,a,e){return t.reduce((o,s)=>{if(s.esAmortizacion)return o;const n=ct(a,e,s.fecha);return o+(n>0?s.interes/n:s.interes)},0)}function Ka(t,a,e,o){return t.reduce((s,n)=>{const i=ct(a,e,n.fecha),d=n.esAmortizacion?n.amortizacion+n.comisionAmort:n.cuota;return s+(i>0?d/i:d)},0)+o}function fn(t,a,e){const o=t.amortizaciones||[];return o.map((s,n)=>{const i=Z({...t,amortizaciones:o.slice(0,n)}),d=Z({...t,amortizaciones:o.slice(0,n+1)});return{nominal:i.totalIntereses-d.totalIntereses,real:ie(i.tabla,a,e)-ie(d.tabla,a,e)}})}const Ne=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${c(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function vn(t,a){const e=Qe(t),o=(t.amortizaciones||[]).length>0,s=a.periodos.length>0,n=a.usarInflacion&&s,i=s?Xe(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,d=s?Ze(t.tin||0,i):null,u=o&&s?fn(t,a.periodos,a.hoy):[],r=u.length?ie(e.sinAmort.tabla,a.periodos,a.hoy)-ie(e.tabla,a.periodos,a.hoy):null,x=r===null?null:r-e.costeTotalAmort,m=n?Ka(e.tabla,a.periodos,a.hoy,e.comAp):null,l=n&&o?Ka(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${c(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${c(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(0,229,160,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(t.tags||[]).map(p=>`<span class="tag">${c(p)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${c(t.tin)}%</span>
        <span class="text-sm">${c(F(t.capital))}</span>
        <span class="text-sm">${c(t.meses)}m</span>
        <button class="btn-icon" data-amort-loan="${c(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${c(t._id)}">

      <div class="grid-4 mb-12">
        ${Ne("Cuota mensual",c(F(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${c(F(a.cuotaMes))}</div>`:"")}
        ${Ne("Total intereses",c(F(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(F(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${c(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Ne("Total pagado",c(F(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${c(F(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${c(Ye(e.tae))}</div></div>
          <div><div class="stat-label">TIN</div><div class="stat-value">${c(t.tin)}%</div></div>
          ${d!==null?`<div title="Tipo de interés real (Fisher): TIN ajustado por la inflación media del ${i.toFixed(2)}% anual durante el préstamo">
                   <div class="stat-label">TIN real</div>
                   <div class="stat-value" style="color:${d<=0?"var(--accent)":d<t.tin?"var(--yellow)":"var(--text)"}">${d.toFixed(2)}%
                     <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${i.toFixed(1)}%)</span>
                   </div>
                 </div>`:""}
          <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${c(t.meses)} meses</div></div>
        </div>
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">Capital</div><div class="stat-value">${c(F(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${c(F(e.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${c(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${c(me(t.diaPago))}</div></div>`:""}
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
               ${r!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${c(F(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${c(F(r))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${c(F(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${c(F(e.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(x??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${c(F(x??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${c(F(e.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${c(F(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${c(F(e.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${m!==null?gn(t,e.totalPagado,m,l):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${n?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(p=>bn(p,n,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((p,v)=>hn(t._id,p,u[v]??null,a)).join("")}`:""}
    </div>
  </div>`}function gn(t,a,e,o){const s=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const d=o-e,u=d>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${c(F(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${c(F(e))}</div></div>
        <div><div class="stat-label">${u?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${u?"pos":"neg"}">${u?"−":"+"}${c(F(Math.abs(d)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${s}
    </div>`}const n=a-e,i=n>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${c(F(a))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${c(F(e))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${c(F(Math.abs(n)))}</div></div>
    </div>
    ${s}
  </div>`}function bn(t,a,e){let o="";if(a&&!t.esAmortizacion){const s=ct(e.periodos,e.hoy,t.fecha);o=c(F(s>0?t.cuota/s:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":c(t.mes)}</td>
    <td class="num">${c(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":c(F(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${c(F(t.interes))}</td>
    <td class="num">${c(F(t.amortizacion))}</td>
    <td class="num">${c(F(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function hn(t,a,e,o){const s=(a.escenarioIds||[]).map(n=>`<span class="badge badge-yellow">🔭 ${c(o.nombreEscenario(n))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${c(a.fecha)}</span>
    <span class="num">${c(F(a.cantidad))}</span>
    <span class="badge ${a.simulacion?"badge-sim":"badge-active"}">${a.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${a.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${s}
    ${e?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${c(F(e.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${c(F(e.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${c(t)}|${c(a._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${c(t)}|${c(a._id)}">✕</button>
  </div>`}const Q=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${c(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,Rt=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${c(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([s,n])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(n)}</option>`).join("")}
   </select></div>`,Kt=(t,a,e,o="")=>`<label class="form-label">${c(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${c(o)}</span>`:""}`;function Qt(t,a,e){return t.length===0?"":`<div class="form-group mt-8"><label class="form-label">Escenarios</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${t.map(o=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${a.includes(o._id)?c(o.color||"var(--accent)"):"var(--border)"}">
            <input type="checkbox" class="${c(e)}" value="${c(o._id)}"${a.includes(o._id)?" checked":""}/>
            ${c(o.nombre)}
          </label>`).join("")}
    </div></div>`}const yn=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${c(e._id)}"${e._id===a?" selected":""}>${c(e.nombre)}</option>`).join("");function xn(t,a,e,o=V()){return`
    <div class="grid-2">
      ${Q("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${Q("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${Q("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${Q("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${Q("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??o)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${yn(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${Ya(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Rt("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${Q("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${Q("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${c(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${Kt("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${Qt(e,(t==null?void 0:t.escenarioIds)??[],"loan-escenario")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${Kt("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${Kt("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${Kt("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function $n(t,a,e,o=V()){return`
    <div class="grid-2">
      ${Q("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??o)}
      ${Q("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Rt("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(a==null?void 0:a.tipo)??"cuota")}
    </div>
    ${Qt(e,(a==null?void 0:a.escenarioIds)??[],"amort-escenario")}
    <div class="form-row mt-8">
      ${Kt("am-sim","Simulación",!!(a!=null&&a.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${c(t)}|${c((a==null?void 0:a._id)??"")}">${a?"Guardar cambios":"Añadir"}</button>
    </div>`}const Qa="opt_",Xa=t=>String(t).startsWith(Qa);function In(t){let a=null,e=null;const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content");function n(h,A){const b=o(),y=s();return!b||!y?null:(y.innerHTML=`<div class="modal-title">${c(h)}</div>${A}`,b.classList.remove("hidden"),y)}const i=()=>{var h;return(h=o())==null?void 0:h.classList.add("hidden")};function d(){let h=!1;for(const A of t.loans()){const b=(A.amortizaciones||[]).filter(y=>!Xa(y._id));b.length!==(A.amortizaciones||[]).length&&(t.guardarAmortizaciones(A._id,b),h=!0)}return h}function u(h){try{return h()}catch(A){return D(A instanceof Error?A.message:"No se ha podido completar el cálculo","err"),null}}function r(){var S,C;if(!Aa("optimizador")){D("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const h=t.loans().filter(j=>j.activo&&!j.simulacion);if(h.length===0){D("No hay préstamos activos para optimizar","err");return}const A=t.config(),b=t.accounts().filter(j=>j.activo&&!j.simulacion),y=((S=b.find(j=>j.esCuentaPrincipal))==null?void 0:S._id)??((C=b[0])==null?void 0:C._id)??"",M=A.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,w=n("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${b.map(j=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${c(j._id)}"${j._id===y?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(j.nombre)}${j._id===y?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${c(F(it(j)))}</span>
              </label>`).join("")||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${h.map(j=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
              <input type="checkbox" class="opt-loan-check" value="${c(j._id)}"${j.tin>=5?" checked":""} style="accent-color:var(--accent)"/>
              <span style="font-size:13px;flex:1">${c(j.nombre)}</span>
              <span class="badge badge-yellow" style="font-size:11px">${c(j.tin)}% TIN</span>
            </label>`).join("")}
      </div>
      <button class="btn-secondary btn-sm mb-12" data-opt-todos>Seleccionar todo</button>

      <div class="grid-2" style="gap:10px">
        ${Q("opt-horizonte","Horizonte (meses)","number",60,"60")}
        ${Q("opt-frecuencia","Frecuencia manual (cada N meses)","number",1,"1")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${Q("opt-min","Importe mínimo por amortización (€)","number",500,"500")}
        ${Rt("opt-tipo","Efecto de la amortización",[["plazo","Reducir plazo (mantener cuota)"],["cuota","Reducir cuota (mantener plazo)"]],"plazo")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${Q("opt-fecha-primera","Fecha primera amortización","date","")}
        ${Q("opt-fecha-obj","Fecha objetivo para comparar saldo","date",M)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);w&&(x(w),W(w,".opt-acc-radio",()=>x(w)),E(w,"[data-opt-todos]",()=>{const j=[...w.querySelectorAll(".opt-loan-check")],z=j.every(P=>P.checked);j.forEach(P=>P.checked=!z)}),E(w,"[data-cancelar]",i),E(w,"[data-opt-calcular]",()=>v(w)),E(w,"[data-opt-comparar]",()=>$(w)))}function x(h){var w;const A=(w=h.querySelector(".opt-acc-radio:checked"))==null?void 0:w.value,y=(t.config().margenesSeguridad||[]).filter(S=>S.activo!==!1).filter(S=>!S.cuentas||S.cuentas.length===0||A&&S.cuentas.includes(A)),M=h.querySelector("#opt-margenes-wrap");M&&(M.innerHTML=y.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':y.map(S=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${c(S._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(S.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!S.cuentas||S.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function m(h){var M,w,S,C;const A=(j,z,P=0)=>{var N;const _=parseFloat(((N=h.querySelector(j))==null?void 0:N.value)??"");return Number.isFinite(_)?Math.max(P,_):z},b=[...h.querySelectorAll(".opt-loan-check")],y=b.filter(j=>j.checked).map(j=>j.value);return{horizonte:Math.round(A("#opt-horizonte",60,1)),frecuencia:Math.round(A("#opt-frecuencia",1,1)),minAmortizable:A("#opt-min",500),tipoAmort:((M=h.querySelector("#opt-tipo"))==null?void 0:M.value)||"plazo",fechaObjetivo:((w=h.querySelector("#opt-fecha-obj"))==null?void 0:w.value)||null,fechaPrimeraAmort:((S=h.querySelector("#opt-fecha-primera"))==null?void 0:S.value)||null,loanIds:b.length===0||y.length===b.length?null:y,sourceAccountId:((C=h.querySelector(".opt-acc-radio:checked"))==null?void 0:C.value)??null,selectedMarginIds:[...h.querySelectorAll(".opt-margin-check:checked")].map(j=>j.value)}}const l=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function p(h,A=""){const b=n("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${c(h)}</div>
        ${A?`<div class="text-sm mt-8" style="color:var(--text3)">${c(A)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);b&&(E(b,"[data-opt-volver]",r),E(b,"[data-cancelar]",i))}function v(h){const A=m(h);d()&&D("Plan anterior eliminado, recalculando…");const{loans:b,expenses:y,accounts:M,config:w,nominas:S}=l(),C=u(()=>Se(b,y,M,w,{frecuencia:A.frecuencia,mesesHorizonte:A.horizonte,minAmortizable:A.minAmortizable,tipoAmort:A.tipoAmort,fechaPrimeraAmort:A.fechaPrimeraAmort,loanIds:A.loanIds,nominas:S,sourceAccountId:A.sourceAccountId,selectedMarginIds:A.selectedMarginIds}));if(!C)return;if(C.plan.length===0){p(`No hay excedente suficiente respetando los ${C.margenesAplicados} márgenes de seguridad activos en los próximos ${A.horizonte} meses para generar amortizaciones por encima del mínimo de ${F(A.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}e={plan:C.plan,tipoAmort:A.tipoAmort};const j=`✨ Plan de optimización · ${A.frecuencia===1?"Mensual":`Cada ${A.frecuencia} meses`} · ${A.horizonte}m`,z=n(j,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(F(C.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${c(F(C.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${c(F(C.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${C.margenesAplicados}</div></div>
      </div>
      ${C.resumenPorLoan.map(to).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${C.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${C.plan.map(P=>Za(P,!0)).join("")}</tbody>
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
      </div>`);z&&(E(z,"[data-opt-volver]",r),E(z,"[data-cancelar]",i),E(z,"[data-opt-aplicar]",()=>{e&&f(e.plan,e.tipoAmort)}))}function $(h){const A=m(h);d();const{loans:b,expenses:y,accounts:M,config:w,nominas:S}=l(),C=u(()=>Sa(b,y,M,w,{horizonte:A.horizonte,minAmortizable:A.minAmortizable,tipoAmort:A.tipoAmort,fechaObjetivo:A.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:A.fechaPrimeraAmort,loanIds:A.loanIds,nominas:S,sourceAccountId:A.sourceAccountId,selectedMarginIds:A.selectedMarginIds}));if(!C)return;if(C.resultados.length===0){p("No hay excedente suficiente en ninguna frecuencia.");return}a=C;const{resultados:j,saldoBase:z,fechaObjetivo:P}=C,_=j.map(O=>{const G=[O.esMejorIntereses&&"💰 +intereses",O.esMejorSaldo&&"🏦 +saldo",O.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${O.esMejorValor?"background:rgba(0,229,160,0.06);":""}">
          <td style="font-weight:600">${c(O.label)}</td>
          <td class="num">${O.numAmortizaciones}</td>
          <td class="num neg">${c(F(O.totalAmortizado))}</td>
          <td class="num pos">${c(F(O.ahorroIntereses))}</td>
          <td class="num ${O.saldoObjetivo>=z?"pos":"neg"}">${c(F(O.saldoObjetivo))}</td>
          <td class="num pos">${c(F(O.valorTotal))}</td>
          <td style="font-size:11px">${G}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${O.frecuencia}">Usar</button></td>
        </tr>`}).join(""),N=n(`📊 Comparativa de frecuencias · hasta ${P}`,`
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${c(P)}: <strong>${c(F(z))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${c(P.slice(0,7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${_}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);N&&(E(N,"[data-opt-volver]",r),E(N,"[data-cancelar]",i),E(N,"[data-opt-usar]",O=>I(Number(O.getAttribute("data-opt-usar")))))}function I(h){var b;const A=a==null?void 0:a.resultados.find(y=>y.frecuencia===h);A&&(d(),f(A.plan,((b=A.plan[0])==null?void 0:b.tipoAmort)||"plazo",{titulo:`✨ Plan ${A.label} · aplicado`,resumen:A,fechaObjetivo:a==null?void 0:a.fechaObjetivo}))}function f(h,A,b){if(h.length===0)return;const y=new Map;for(const w of h){const S=y.get(w.loanId)??[];S.push({_id:`${Qa}${w.mes}_${w.loanId}`,fecha:w.fechaAmort,cantidad:w.cantidadAmort,tipo:A,simulacion:!0}),y.set(w.loanId,S)}let M=0;for(const w of t.loans()){const S=y.get(w._id);if(!S)continue;const C=(w.amortizaciones||[]).filter(j=>!Xa(j._id));t.guardarAmortizaciones(w._id,[...C,...S]),M+=1}D(`Plan aplicado: ${h.length} amortizaciones en ${M} préstamo${M!==1?"s":""} (simulación)`),b?g(b):i(),t.refrescar([...y.keys()])}function g({titulo:h,resumen:A,fechaObjetivo:b}){const y=n(h,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(F(A.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${c(F(A.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${c((b==null?void 0:b.slice(0,7))??"")}</div><div class="stat-value pos">${c(F(A.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${c(F(A.totalComisiones))}</div></div>
      </div>
      ${A.resumenPorLoan.map(to).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${A.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${A.plan.map(M=>Za(M,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);y&&E(y,"[data-cancelar]",i)}return{abrir:r,get planManual(){return e},get comparativa(){return a}}}function Za(t,a){const e=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${c(F(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${c(t.mes)}</td>
    <td>${c(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${c(F(t.capitalAntes))}</td>
    <td class="num neg">${c(F(t.cantidadAmort))}${e}</td>
    <td class="num">${c(F(t.capitalDespues))}</td>
    ${a?`<td class="num" style="color:var(--text3)">${c(F(t.saldoDisponible))} → ${c(F(t.saldoDespues))}</td>`:""}
  </tr>`}function to(t){return`<div class="card mb-8" style="padding:12px">
    <div class="flex justify-between items-center mb-8">
      <span style="font-weight:600">${c(t.nombre)}</span>
      <span class="badge badge-yellow">${c(t.tin)}% TIN</span>
    </div>
    <div class="grid-4" style="gap:8px;font-size:12px">
      <div><div class="stat-label">Fecha fin</div>
        <div class="num" style="text-decoration:line-through;color:var(--text3)">${c(t.fechaFinSin)}</div>
        <div class="num pos">${c(t.fechaFinCon)}</div></div>
      <div><div class="stat-label">Plazo ahorrado</div><div class="num pos">${t.mesesAhorrados>0?`${t.mesesAhorrados}m`:"—"}</div></div>
      <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${c(F(t.ahorroIntereses))}</div></div>
      <div><div class="stat-label">${t.numAmortizaciones} amorts.</div><div class="num">${c(F(t.totalAmortizado))}</div></div>
    </div>
  </div>`}const An="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Mn(t){const a=t.hoy??V;let e=!1;const o=new Set;let s=null;const n=()=>{var b;return(b=t.onDatosCambiados)==null?void 0:b.call(t)},i=()=>t.store.get("escenarios"),d=b=>{var y;return((y=i().find(M=>M._id===b))==null?void 0:y.nombre)??b};function u(b){if(!b.activo||b.simulacion)return!1;const y=Z(b).tabla.filter(M=>!M.esAmortizacion);return y.length===0?!0:y[y.length-1].fecha<a()}function r(b,y){const M=a(),w=M.slice(0,7),S=new Map;let C=0;for(const j of b){if(!j.activo||j.simulacion||y.has(j._id)||(j.fechaInicio||"")>M)continue;const z=Z(j).tabla.filter(_=>!_.esAmortizacion&&_.fecha.startsWith(w)),P=z.length>0?z[0].cuota:0;S.set(j._id,P),C+=P}return{porLoan:S,total:C,activos:[...S.values()].filter(j=>j>0).length}}function x(b){const y=t.store.get("config"),M=y.dashboardStart,w=y.dashboardEnd,S=Math.max(1,(q(w).getTime()-q(M).getTime())/(30.44*864e5));let C=0;for(const j of b)!j.activo||j.simulacion||(C+=Z(j).tabla.filter(z=>!z.esAmortizacion&&z.fecha>=M&&z.fecha<=w).reduce((z,P)=>z+P.cuota,0));return{media:C/S,desde:M,hasta:w}}function m(b){const y=[...t.store.get("loans")].sort((_,N)=>N.tin-_.tin),M=new Set(y.filter(u).map(_=>_._id)),w=e?y:y.filter(_=>!M.has(_._id)),S=r(y,M),C=x(y),j=t.store.get("config"),z=t.store.get("inflacion"),P=new Date(q(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});b.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${M.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${M.size})</button>`:""}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${S.total>0||C.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${S.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${c(P)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${c(F(S.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${S.activos} préstamo${S.activos!==1?"s":""} activo${S.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${C.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${c(F(C.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${c(C.desde)} → ${c(C.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${w.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':w.map(_=>vn(_,{periodos:z,usarInflacion:!!j.usarInflacion,hoy:a(),cuotaMes:S.porLoan.get(_._id)??0,completado:M.has(_._id),nombreEscenario:d})).join("")}
      </div>`;for(const _ of b.querySelectorAll("[data-body-loan]"))o.has(_.dataset.bodyLoan??"")&&_.classList.add("open")}const l=()=>document.getElementById("modal-overlay"),p=()=>document.getElementById("modal-content"),v=()=>{var b;return(b=l())==null?void 0:b.classList.add("hidden")};function $(b,y){const M=l(),w=p();return!M||!w?null:(w.innerHTML=`<div class="modal-title">${c(b)}</div>${y}`,M.classList.remove("hidden"),E(w,"[data-cancelar]",v),w)}function I(b,y){const M=b?t.store.get("loans").find(S=>S._id===b)??null:null,w=$(b?"Editar préstamo":"Nuevo préstamo",xn(M,t.store.get("accounts"),i(),a()));w&&(w.addEventListener("change",S=>{var C;(C=S.target)!=null&&C.matches("[data-dp-modo]")&&Wa(w)}),E(w,"[data-guardar-loan]",S=>{f(w,S.getAttribute("data-guardar-loan")||"")&&(v(),y())}))}function f(b,y){const M=_=>{var N;return((N=b.querySelector(_))==null?void 0:N.value)??""},w=_=>{var N;return!!((N=b.querySelector(_))!=null&&N.checked)},S=M("#f-nombre").trim(),C=parseFloat(M("#f-capital")),j=parseFloat(M("#f-tin")),z=parseInt(M("#f-meses"),10);if(!S||!Number.isFinite(C)||!Number.isFinite(j)||!Number.isFinite(z))return D("Completa los campos obligatorios","err"),!1;const P={nombre:S,capital:C,tin:j,meses:z,fechaInicio:M("#f-fecha"),comisionApertura:parseFloat(M("#f-com-ap"))||0,comisionAmort:parseFloat(M("#f-com-am"))||0,diaPago:Ja(b),cuenta:M("#f-cuenta"),simulacion:w("#f-sim"),activo:w("#f-activo"),mostrarFechaFinEnDashboard:w("#f-mostrar-fin"),tipoTasa:M("#f-tipo-tasa"),basico:w("#f-basico"),tags:M("#f-tags").split(",").map(_=>_.trim()).filter(Boolean),escenarioIds:[...b.querySelectorAll(".loan-escenario:checked")].map(_=>_.value)};return y?(t.store.updateItem("loans",y,P),D("Préstamo actualizado")):(t.store.addItem("loans",{...P,amortizaciones:[]}),D("Préstamo creado")),n(),!0}function g(b,y,M){const w=t.store.get("loans").find(j=>j._id===b);if(!w)return;const S=y?(w.amortizaciones||[]).find(j=>j._id===y)??null:null,C=$(y?"Editar amortización":"Añadir amortización",$n(b,S,i(),a()));C&&E(C,"[data-guardar-amort]",j=>{const[z,P]=(j.getAttribute("data-guardar-amort")||"").split("|");h(C,z,P)&&(v(),M([z]))})}function h(b,y,M){var N;const w=O=>{var G;return((G=b.querySelector(O))==null?void 0:G.value)??""},S=w("#am-fecha"),C=parseFloat(w("#am-cant"));if(!S||!Number.isFinite(C)||C<=0)return D("Fecha y cantidad requeridas","err"),!1;const j=t.store.get("loans").find(O=>O._id===y);if(!j)return!1;const z={fecha:S,cantidad:C,tipo:w("#am-tipo"),simulacion:!!((N=b.querySelector("#am-sim"))!=null&&N.checked),escenarioIds:[...b.querySelectorAll(".amort-escenario:checked")].map(O=>O.value)},P=j.amortizaciones||[],_=M?P.map(O=>O._id===M?{...O,...z}:O):[...P,{_id:Date.now().toString(36),...z}];return t.store.updateItem("loans",y,{amortizaciones:_}),D(M?"Amortización actualizada":"Amortización añadida"),n(),!0}function A(b,y,M){E(b,"[data-toggle-finalizados]",()=>{e=!e,y()}),E(b,"[data-nuevo-loan]",()=>I(null,y)),E(b,"[data-optimizar]",()=>M.abrir()),E(b,"[data-toggle-loan]",(w,S)=>{var P;if((P=S.target)!=null&&P.closest("button"))return;const C=w.getAttribute("data-toggle-loan"),j=[...b.querySelectorAll("[data-body-loan]")].find(_=>_.dataset.bodyLoan===C);(j==null?void 0:j.classList.toggle("open"))?o.add(C):o.delete(C)}),E(b,"[data-editar-loan]",w=>I(w.getAttribute("data-editar-loan"),y)),E(b,"[data-borrar-loan]",w=>{if(!tt("¿Eliminar préstamo?"))return;const S=w.getAttribute("data-borrar-loan");t.store.removeItem("loans",S),o.delete(S),D("Eliminado"),n(),y()}),E(b,"[data-amort-loan]",w=>{const S=w.getAttribute("data-amort-loan");o.add(S),g(S,null,y)}),E(b,"[data-editar-amort]",w=>{const[S,C]=(w.getAttribute("data-editar-amort")||"").split("|");o.add(S),g(S,C,y)}),E(b,"[data-borrar-amort]",w=>{const[S,C]=(w.getAttribute("data-borrar-amort")||"").split("|"),j=t.store.get("loans").find(z=>z._id===S);j&&(t.store.updateItem("loans",S,{amortizaciones:(j.amortizaciones||[]).filter(z=>z._id!==C)}),D("Amortización eliminada"),n(),y([S]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:An,mount(b){const y=(M=[])=>{for(const w of M)o.add(w);m(b)};s??(s=In({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(M,w)=>{t.store.updateItem("loans",M,{amortizaciones:w}),n()},hoy:a,refrescar:y})),m(b),b.dataset.wired!=="1"&&(A(b,y,s),b.dataset.wired="1")}}}const wn={transporte:125,restaurante:220,otros:null},Sn={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Cn=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Nt=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${c(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,Fn=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${c(e._id)}"${e._id===a?" selected":""}>${c(e.nombre)}</option>`).join("");function zn(t,a){const e=t.map((n,i)=>{const d=a.find(x=>x._id===n.cuenta),u=wn[n.tipo],r=u!=null&&n.importe>u;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${c(Sn[n.tipo]??n.tipo)}</span>
        <span style="flex:1;font-size:12px">${c(F(n.importe))}/mes${r?` <span style="color:var(--red)" title="Supera el límite orientativo de ${c(F(u))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${d?c(d.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function jn(t,a){const e=a.hoy??V(),o=(t==null?void 0:t.nPagas)??12,s=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Nt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Nt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(n=>`<option value="${n}"${s&&o===n?" selected":""}>${n} pagas</option>`).join("")}
          <option value="custom"${s?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${Fn(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Nt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??e)}
          ${Nt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Nt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${Cn.map((n,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${c(n)} (${i+1})</option>`).join("")}
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
          ${Nt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??$e).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${Qt(a.escenarios,(t==null?void 0:t.escenarioIds)??[],"nom-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function eo(t,a){const e=i=>{var d;return((d=t.querySelector(i))==null?void 0:d.value)??""},o=(i,d=0)=>{const u=parseFloat(e(i));return Number.isFinite(u)?u:d},s=e("#nf-npagas"),n=s==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(s,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:n,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",$e),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:a}}function Pn(t,a,e,o){const s=eo(t,a),n=a.reduce((f,g)=>f+(g.importe||0)*12,0),i=Math.max(0,s.bruto-n),d=i*(s.ssPct/100),u=s.irpfModo==="manual"?i*(s.irpfPct/100):lt(It(s.bruto,n),e.tramos),r=i-d-u,x=i/s.nPagas,m=d/s.nPagas,l=u/s.nPagas,p=x-m-l,v=s.grupoNomina?e.nominas.filter(f=>f.grupoNomina===s.grupoNomina&&f._id!==o):[],$=v.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${c(s.grupoNomina)}" con ${c(v.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",I=n>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${c(F(n))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${c(F(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${c(F(s.bruto))}</span>
      ${I}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${c(F(d))} (${s.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${c(F(u))} (${i>0?(u/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${c(F(r))}</span>
      ${n>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${c(F(n))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${c(F(p))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${s.representacion==="simplificado"?`ingreso ${c(F(p))}/paga`:`ingreso ${c(F(x))} − SS ${c(F(m))} − IRPF ${c(F(l))}`}${n>0?" + recargas flex":""}</span>
    </div>${$}`}function En(t,a,e,o){const s=()=>{const d=t.querySelector("#flex-comp-container");d&&(d.innerHTML=zn(a,e.accounts))},n=()=>{const d=t.querySelector("#nf-preview");d&&(d.innerHTML=Pn(t,a,e,o))},i=()=>{var u,r;const d=(x,m)=>{const l=t.querySelector(x);l&&(l.style.display=m?"":"none")};d("#nf-custom-pagas-wrap",((u=t.querySelector("#nf-npagas"))==null?void 0:u.value)==="custom"),d("#nf-irpfpct-wrap",((r=t.querySelector("#nf-irpfmodo"))==null?void 0:r.value)==="manual"),n()};t.addEventListener("input",d=>{var u;(u=d.target)!=null&&u.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&n()}),W(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),E(t,"[data-flex-anadir]",()=>{var r,x,m;const d=((r=t.querySelector("#fc-tipo"))==null?void 0:r.value)||"transporte",u=parseFloat(((x=t.querySelector("#fc-importe"))==null?void 0:x.value)??"")||0;if(!u)return D("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:d,importe:u,cuenta:((m=t.querySelector("#fc-cuenta"))==null?void 0:m.value)||""}),s(),n()}),E(t,"[data-flex-borrar]",d=>{a.splice(Number(d.getAttribute("data-flex-borrar")),1),s(),n()}),s(),n()}const ao=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function _n(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var l;return(l=o())==null?void 0:l.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??ft;function d(l,p){const v=o(),$=s();return!v||!$?null:($.innerHTML=`<div class="modal-title">${c(l)}</div>${p}`,v.classList.remove("hidden"),E($,"[data-cerrar]",n),$)}function u(){a=null;const l=[...t.store.get("tramosIRPFHistorico")].sort(($,I)=>$.año-I.año),p="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",v=d("Tramos IRPF por ejercicio",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
        Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${p}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(ao(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${l.map($=>`<div style="${p}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(ao($.tramos))}</span>
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
      </div>`);v&&(E(v,"[data-editar-tabla]",$=>{const I=$.getAttribute("data-editar-tabla");m(I==="default"?"default":Number(I))}),E(v,"[data-borrar-tabla]",$=>{const I=Number($.getAttribute("data-borrar-tabla"));tt(`¿Eliminar la tabla del ejercicio ${I}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==I)),D(`Tabla ${I} eliminada`),t.onDatosCambiados(),u())}),E(v,"[data-anadir-anyo]",()=>{var f;const $=parseInt(((f=v.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!$||$<2e3||$>2100)return D("Año inválido","err");const I=t.store.get("tramosIRPFHistorico");if(I.some(g=>g.año===$))return D("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...I,{_id:Date.now().toString(36),año:$,tramos:i().map(g=>[...g])}]),t.onDatosCambiados(),m($)}))}function r(){return e.map(([l,p],v)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${v}" value="${l}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${v}" value="${p}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${v}">✕</button>
          </div>
        </div>`).join("")}function x(l){e=[...l.querySelectorAll("[data-tr-min]")].map((v,$)=>{const I=l.querySelector(`[data-tr-pct="${$}"]`);return[parseFloat(v.value)||0,parseFloat((I==null?void 0:I.value)??"")||0]})}function m(l){var g;a=l;const p=t.store.get("tramosIRPFHistorico");e=(l==="default"?i():((g=p.find(h=>h.año===l))==null?void 0:g.tramos)??i()).map(h=>[...h]);const $=l==="default"?"tabla por defecto":`ejercicio ${l}`,I=d(`Tramos IRPF — ${l==="default"?"Por defecto":l}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${c($)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${r()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!I)return;const f=()=>{const h=I.querySelector("#irpf-tramos-rows");h&&(h.innerHTML=r())};E(I,"[data-volver]",u),E(I,"[data-tr-anadir]",()=>{x(I),e.push([0,0]),f()}),E(I,"[data-tr-borrar]",h=>{x(I),e.splice(Number(h.getAttribute("data-tr-borrar")),1),f()}),E(I,"[data-tr-guardar]",()=>{x(I);const h=[...e].sort((A,b)=>A[0]-b[0]);if(h.length===0)return D("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:h}),D("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(A=>A.año===a?{...A,tramos:h}:A)),D(`Tabla ${a} guardada`)),t.onDatosCambiados(),u()})}return{abrir:u}}const oo=1500,zt=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${c(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,Tn=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${c(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([s,n])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(n)}</option>`).join("")}
   </select></div>`,Dn=t=>(t.modeloFondo||"cuenta")==="pension";function Rn(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(s=>Nn(s,a,e,o)).join("")}</div>`}function Nn(t,a,e,o){const s=oe(t);if(!s)return"";const n=xe(t,a,e),i=o.slice(0,4),d=(t.aportaciones||[]).filter(r=>r.fecha>=`${i}-01-01`).reduce((r,x)=>r+x.cantidad,0),u=Math.min(d,oo)*(n/100);return`<div class="card">
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
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${c(F(s.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(F(s.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${s.beneficio>=0?"pos":"neg"}">${c(F(s.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(F(s.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(F(s.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${d>oo?"neg":""}">${c(F(d))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${c(F(u))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${c(t.grupoNomina)}": ${n}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${s.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${c(s.proxDesbloqueo)}</div>`:""}
  </div>`}function On(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${c(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${c(F(e.importe))} / ${c(e.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Ln(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,d)=>d.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,s=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],n=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${zt("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${zt("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${zt("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${zt("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${zt("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${Tn("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${zt("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${n?' style="display:none"':""}>
        ${zt("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
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
    ${Qt(a.escenarios,(t==null?void 0:t.escenarioIds)??[],"pen-escenario")}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function qn(t,a,e){const o=()=>{const s=t.querySelector("#pen-aport-container");s&&(s.innerHTML=On(a))};W(t,"#pen-grupo",s=>{const n=t.querySelector("#pen-impuesto-wrap");n&&(n.style.display=s.value?"none":"")}),E(t,"[data-aport-anadir]",()=>{var n,i,d,u;const s=parseFloat(((n=t.querySelector("#paport-importe"))==null?void 0:n.value)??"")||0;if(!s)return D("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((d=t.querySelector("#paport-inicio"))==null?void 0:d.value)||e,fechaFin:((u=t.querySelector("#paport-fin"))==null?void 0:u.value)||""}),o()}),E(t,"[data-aport-borrar]",s=>{a.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function kn(t,a,e,o){var I;const s=f=>{var g;return((g=t.querySelector(f))==null?void 0:g.value)??""},n=(f,g=0)=>{const h=parseFloat(s(f));return Number.isFinite(h)?h:g},i=f=>{var g;return!!((g=t.querySelector(f))!=null&&g.checked)},d=s("#pen-nombre").trim();if(!d)return{datos:{},error:"Nombre obligatorio"};const u=n("#pen-saldo"),r=s("#pen-grupo"),x={nombre:d,grupoNomina:r,saldo:u,saldoInicial:n("#pen-saldo-ini"),fechaInicialSaldo:s("#pen-fecha-ini")||o,interes:n("#pen-interes"),periodoCobro:s("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(s("#pen-bloqueo"),10)||120,impuestoRetirada:r?0:n("#pen-impuesto"),planAportaciones:a,descripcion:s("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(f=>f.value)},m=[...(e==null?void 0:e.historicoSaldos)??[]],l=[...(e==null?void 0:e.aportaciones)??[]],v=((I=[...m].sort((f,g)=>g.fecha.localeCompare(f.fecha))[0])==null?void 0:I.saldo)??(e==null?void 0:e.saldo)??null,$=Date.now().toString(36);return e?(v===null||Math.abs(u-v)>.005)&&(m.push({_id:$,fecha:o,saldo:u,nota:"Actualización manual"}),u>(v??0)&&l.push({_id:`${$}a`,fecha:o,cantidad:u-(v??0)})):u>0&&(m.push({_id:$,fecha:o,saldo:u,nota:"Saldo inicial"}),l.push({_id:`${$}a`,fecha:x.fechaInicialSaldo??o,cantidad:u})),{datos:{...x,historicoSaldos:m,aportaciones:l}}}const Bn="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Hn(t){const a=t.hoy??V,e=()=>{var I;return(I=t.onDatosCambiados)==null?void 0:I.call(t)};function o(){const I=t.store.get("config");return vt(t.store.get("tramosIRPFHistorico"),I.tramos_irpf??ft)(Number(a().slice(0,4)))}function s(I,f,g){const h=Ae(I,f,g),A=!!f&&I.irpfModo!=="manual",b=[I.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${I.mesActualizacionIPC}">IPC m${I.mesActualizacionIPC}</span>`:"",h.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${c(F(h.flexAnual))}/año</span>`:"",Math.abs(h.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${h.ssPct.toFixed(2)}%</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(I.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${b}</div>
      </div>
      <div class="num">${c(F(h.brutoAnual))}
        ${h.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${c(F(h.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${c(F(h.netoPorPaga))}/paga neto</div></div>
      <div class="text-sm">${h.nPagas} pagas</div>
      <div class="text-sm ${A?"neg":""}">${I.irpfModo==="manual"?`${c(I.irpfPct??0)}% (manual)`:`${h.irpfPct.toFixed(1)}% (auto)`}${A?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${I.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${c(n(I.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${c(I._id)}"${I.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${c(I._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${c(I._id)}">✕</button>
      </div>
    </div>`}const n=I=>{var f;return((f=t.store.get("accounts").find(g=>g._id===(I||"default")))==null?void 0:f.nombre)??(I||"default")};function i(I,f,g){const h=f.reduce((y,M)=>y+(M.bruto||0),0),A=Do(f,g),b=h>0?A/h*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${c(I)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${c(F(h))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${b.toFixed(1)}%</strong> (${c(F(A))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${f.map(y=>s(y,f,g)).join("")}
      </div>
    </div>`}function d(I){const f=o(),g=[...t.store.get("nominas")].sort((M,w)=>(w.bruto||0)-(M.bruto||0)),{grupos:h,sueltas:A}=No(g),b=t.store.get("accounts").filter(Dn),y=g.filter(M=>M.activo!==!1);I.innerHTML=`
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
      ${[...h.entries()].map(([M,w])=>i(M,w,f)).join("")}
      ${A.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${A.map(M=>s(M,null,f)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Rn(b,y,f,a())}</div>`}const u=()=>document.getElementById("modal-overlay"),r=()=>document.getElementById("modal-content"),x=()=>{var I;return(I=u())==null?void 0:I.classList.add("hidden")};function m(I,f){const g=u(),h=r();return!g||!h?null:(h.innerHTML=`<div class="modal-title">${c(I)}</div>${f}`,g.classList.remove("hidden"),E(h,"[data-cancelar]",x),h)}function l(I,f){const g=I?t.store.get("nominas").find(y=>y._id===I)??null:null,h=[...(g==null?void 0:g.retribucionFlexible)??[]].map(y=>({...y})),A={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:o(),hoy:a()},b=m(I?"Editar nómina":"Nueva nómina",jn(g,A));b&&(En(b,h,A,I??""),E(b,"[data-guardar-nomina]",y=>{const M=eo(b,h);if(!M.nombre||M.bruto<=0)return D("Nombre y bruto anual son obligatorios","err");const w=y.getAttribute("data-guardar-nomina")||"",S={...M,activo:!0,tags:["nomina"]};w?(t.store.updateItem("nominas",w,S),D("Nómina actualizada")):(t.store.addItem("nominas",S),D("Nómina creada")),e(),x(),f()}))}function p(I,f){const g=I?t.store.get("accounts").find(b=>b._id===I)??null:null,h=[...(g==null?void 0:g.planAportaciones)??[]].map(b=>({...b})),A=m(I?"Editar plan de pensiones":"Nuevo plan de pensiones",Ln(g,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:a()}));A&&(qn(A,h,a()),E(A,"[data-guardar-pension]",b=>{const{datos:y,error:M}=kn(A,h,g,a());if(M)return D(M,"err");const w=b.getAttribute("data-guardar-pension")||"";w?(t.store.updateItem("accounts",w,y),D("Plan actualizado")):(t.store.addItem("accounts",y),D("Plan creado")),e(),x(),f()}))}function v(I,f,g){E(I,"[data-nueva-nomina]",()=>l(null,f)),E(I,"[data-editar-nom]",h=>l(h.getAttribute("data-editar-nom"),f)),E(I,"[data-borrar-nom]",h=>{tt("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",h.getAttribute("data-borrar-nom")),D("Eliminada"),e(),f())}),W(I,"[data-activo-nom]",h=>{const A=h;t.store.updateItem("nominas",A.getAttribute("data-activo-nom"),{activo:A.checked}),e(),f()}),E(I,"[data-tramos]",()=>g.abrir()),E(I,"[data-nueva-pension]",()=>p(null,f)),E(I,"[data-editar-pension]",h=>p(h.getAttribute("data-editar-pension"),f)),E(I,"[data-borrar-pension]",h=>{tt("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",h.getAttribute("data-borrar-pension")),D("Plan eliminado"),e(),f())})}let $=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Bn,mount(I){const f=()=>d(I);$??($=_n({store:t.store,onDatosCambiados:()=>{e(),f()},año:()=>Number(a().slice(0,4))})),d(I),I.dataset.wired!=="1"&&(v(I,f,$),I.dataset.wired="1")}}}const Gn="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Vn="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",so={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Un={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Yn(t,a){const e=t.filter(u=>u.activo&&dt(u)==="inversion");if(e.length===0)return"";let o=0,s=0,n=0,i=0;for(const u of e){const r=Et(u,a);r&&(o+=r.saldo,s+=r.costBase,n+=r.plusvalia,i+=r.impuesto)}const d=s>0?(n/s*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${c(F(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${c(F(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${c(d)}%)</div><div class="stat-value ${n>=0?"pos":"neg"}">${c(F(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${c(F(i))}</div><div class="stat-sub">Neto: ${c(F(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function Wn(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,s=Math.max(1,(q(o).getTime()-q(e).getTime())/(30.44*864e5)),n=Lt(t,e),i=n*(Math.pow(1+t.interes/100,s/12)-1);let d="";if(a.config.usarInflacion&&a.inflacion.length>0){const u=n*(ct(a.inflacion,e,o)-1),r=i-u;d=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${c(F(u))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${r>=0?"var(--accent)":"var(--red)"};font-weight:600">${c(F(r))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${c(e.slice(0,7))} → ${c(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${c(F(i))}</span>
    </div>${d}
  </div>`}function Jn(t,a){const e=so[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,s=a.nominas.flatMap(p=>(p.retribucionFlexible??[]).filter(v=>v.cuenta===t._id).map(v=>({nomina:p,importe:v.importe}))),n=s.reduce((p,v)=>p+v.importe,0),i=n*12,d=o!==null&&i>o,u=o!==null?Math.min(i,o):i,r=t.grupoNomina?a.nominas.filter(p=>(p.grupoNomina||"")===t.grupoNomina&&p.activo!==!1):s.slice(0,1).map(p=>p.nomina),x=ra(r,a.tramosIRPF),m=u*x/100,l=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${x}%`:`tipo marginal ${x}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${c(e.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${c(F(n))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${d?"neg":"pos"}">${c(F(i))}/año${d?` ⚠ excede límite ${c(F(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${c(F(o))}/año</span></div>`:""}
    ${m>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${c(l)}">≈ ${c(F(m))}/año <span style="font-size:10px;color:var(--text3)">(${c(x)}%)</span></span></div>`:""}
    ${s.length>0?s.map(p=>`<div style="font-size:11px;color:var(--text3)">↩ ${c(p.nomina.nombre)}: ${c(F(p.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function Kn(t){const a=oe(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(F(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(F(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${c(F(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${c(F(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${c(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${c(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function Qn(t,a){const e=Et(t,a.tramosGanancias);if(!e)return"";const o=a.config,s=a.flujos(t._id),n=q(o.dashboardStart),i=q(o.dashboardEnd),d=Math.max(0,(i.getTime()-n.getTime())/(30.44*864e5)),u=e.saldo+s.totalAportaciones-s.totalReembolsos,r=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,x=u>0&&d>0?Math.max(0,u*Math.pow(1+r,d)):Math.max(0,u),m=e.costBase+s.totalAportaciones,l=Math.max(0,x-m),p=ye(l,a.tramosGanancias),v=l>0?(p/l*100).toFixed(1):"0",$=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",I=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",f=(M,w,S)=>M.map(C=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${w} ${c(C.contraparte)}: ${c(C.concepto)}</span>
          <span class="num ${S}">${c(F(C.total))} · ${C.ocurrencias} mov.</span>
        </div>`).join(""),h=s.entradas.length>0||s.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${c(o.dashboardStart.slice(0,7))} → ${c(o.dashboardEnd.slice(0,7))})</div>
         ${f(s.entradas,"↓","pos")}
         ${f(s.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${s.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${c(F(s.totalAportaciones))}</span></div>`:""}
           ${s.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${c(F(s.totalReembolsos))}</span></div>`:""}
           ${s.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${c(F(s.retencion))}</span></div>`:s.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',A=a.invModo(t._id),b=M=>`padding:3px 10px;border-radius:20px;border:1px solid ${M?"var(--accent)":"var(--border)"};background:${M?"var(--accent-dim)":"transparent"};color:${M?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,y=A==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(F(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${c(F(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${c(F(e.neto))}</div><div class="stat-sub">${c(I)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${c(F(m))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${c(F(x))}</div><div class="stat-sub">${c($)} · ${c(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${c(F(x-p))}</div><div class="stat-sub">${c(v)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${c(t._id)}|real" style="${b(A==="real")}">Real</button>
          <button data-inv-modo="${c(t._id)}|proyeccion" style="${b(A==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${y}
      ${h}
    </div>`}function Xn(t,a){const e=[...t.historicoSaldos||[]].sort((u,r)=>r.fecha.localeCompare(u.fecha)),o=e[0],s=it(t),n=dt(t),i=t.esCuentaPrincipal,d=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",n==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",n==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",n==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${c((so[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(u=>`<span class="badge badge-yellow">🔭 ${c(a.nombreEscenario(u))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${c(t.nombre)}</span>
        ${d}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${c(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${c(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Vn}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Gn}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${c(F(t.saldoInicial||0))}</div><div class="stat-sub">${c(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${c(F(s))}</div>${o?`<div class="stat-sub">Registro: ${c(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${c(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${c(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Wn(t,a)}
    ${n==="beneficio"?Jn(t,a):""}
    ${n==="pension"?Kn(t):""}
    ${n==="inversion"?Qn(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${c(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${c(t.descripcion)}</div>`:""}
  </div>`}const Zn=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function ti(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${c(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${c(F(e.importe))} / ${c(e.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function ei(t,a){const e=t?dt(t):"cuenta",o=[...new Set(a.nominas.filter(n=>n.grupoNomina).map(n=>n.grupoNomina))],s=n=>n?"":' style="display:none"';return`
    <div class="grid-2">
      ${Q("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Rt("ac-modelo","Tipo",Zn,e)}
    </div>
    <div class="grid-2 mt-8">
      ${Q("ac-saldo","Saldo actual (€)","number",a.saldoActual,"5000")}
      ${Q("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Q("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${Q("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="form-row mt-8">
      <label class="form-label">Activa</label>
      <label class="toggle"><input type="checkbox" id="ac-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
    </div>

    <details class="form-advanced mt-12"${t?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="mt-8">
          ${Rt("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${Rt("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
        ${Qt(a.escenarios,(t==null?void 0:t.escenarioIds)??[],"ac-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function ai(t,a,e){const o=()=>{const s=t.querySelector("#ac-aport-container");s&&(s.innerHTML=ti(a))};W(t,"#ac-modelo",s=>{const n=s.value,i=(d,u)=>{const r=t.querySelector(d);r&&(r.style.display=u?"":"none")};i("#ac-inversion-hint",n==="inversion"),i("#ac-beneficio-fields",n==="beneficio")}),E(t,"[data-aport-anadir]",()=>{var n,i,d,u;const s=parseFloat(((n=t.querySelector("#aport-importe"))==null?void 0:n.value)??"")||0;if(!s)return D("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((d=t.querySelector("#aport-inicio"))==null?void 0:d.value)||e,fechaFin:((u=t.querySelector("#aport-fin"))==null?void 0:u.value)||""}),o()}),E(t,"[data-aport-borrar]",s=>{a.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function oi(t,a,e,o,s){const n=v=>{var $;return(($=t.querySelector(v))==null?void 0:$.value)??""},i=(v,$=0)=>{const I=parseFloat(n(v));return Number.isFinite(I)?I:$},d=v=>{var $;return!!(($=t.querySelector(v))!=null&&$.checked)},u=n("#ac-nombre").trim();if(!u)return{datos:{},error:"Nombre obligatorio"};const r=n("#ac-modelo")||"cuenta",x=r==="beneficio",m=i("#ac-saldo"),l={nombre:u,saldo:m,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:n("#ac-fecha-ini")||s,interes:i("#ac-interes"),periodoCobro:n("#ac-periodo")||"mensual",descripcion:n("#ac-desc").trim(),activo:d("#ac-activo"),simulacion:d("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(v=>v.value),modeloFondo:r,planAportaciones:a,tipoBeneficio:x?n("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:x?n("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&m<=0)return{datos:l};if(!(o===null||Math.abs(m-o)>.005))return{datos:l};if(r==="inversion"&&m>(o??0)){const v=Date.now().toString(36);l.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${v}a`,fecha:e?s:l.fechaInicialSaldo??s,cantidad:m-(o??0)}]}return{datos:l,punto:{fecha:s,saldo:m,nota:e?"Actualización manual":"Saldo inicial"}}}function Oe(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:at(a.saldoCts),nota:a.nota}))}function si(t,a,e,o,s){const n=e.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${c(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${c(F(i.saldo))}</span>
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
    </div>`}const no=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function ni(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var l;return(l=o())==null?void 0:l.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??St;function d(l,p){const v=o(),$=s();return!v||!$?null:($.innerHTML=`<div class="modal-title">${c(l)}</div>${p}`,v.classList.remove("hidden"),E($,"[data-cerrar]",n),$)}function u(){a=null;const l=[...t.store.get("tramosGananciasCapitalHistorico")].sort(($,I)=>$.año-I.año),p="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",v=d("Tramos — Ganancias de capital",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tramos marginales de la base del ahorro (art. 49 LIRPF): plusvalías de fondos, intereses y dividendos.
        Un ejercicio sin tabla propia usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${p}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(no(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${l.map($=>`<div style="${p}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(no($.tramos))}</span>
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
      </div>`);v&&(E(v,"[data-editar-tg]",$=>{const I=$.getAttribute("data-editar-tg");m(I==="default"?"default":Number(I))}),E(v,"[data-borrar-tg]",$=>{const I=Number($.getAttribute("data-borrar-tg"));tt(`¿Eliminar la tabla del ejercicio ${I}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==I)),D(`Tabla ${I} eliminada`),t.onDatosCambiados(),u())}),E(v,"[data-anadir-anyo-tg]",()=>{var f;const $=parseInt(((f=v.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!$||$<2e3||$>2100)return D("Año inválido","err");const I=t.store.get("tramosGananciasCapitalHistorico");if(I.some(g=>g.año===$))return D("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...I,{_id:Date.now().toString(36),año:$,tramos:i().map(g=>[...g])}]),t.onDatosCambiados(),m($)}))}function r(){return e.map(([l,p],v)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${v}" value="${l}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${v}" value="${p}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${v}">✕</button>
          </div>
        </div>`).join("")}function x(l){e=[...l.querySelectorAll("[data-tg-min]")].map((p,v)=>{const $=l.querySelector(`[data-tg-pct="${v}"]`);return[parseFloat(p.value)||0,parseFloat(($==null?void 0:$.value)??"")||0]})}function m(l){var f;a=l;const p=t.store.get("tramosGananciasCapitalHistorico");e=(l==="default"?i():((f=p.find(g=>g.año===l))==null?void 0:f.tramos)??i()).map(g=>[...g]);const $=d(`Ganancias de capital — ${l==="default"?"Por defecto":l}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${r()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!$)return;const I=()=>{const g=$.querySelector("#tg-rows");g&&(g.innerHTML=r())};E($,"[data-volver-tg]",u),E($,"[data-tg-anadir]",()=>{x($),e.push([0,0]),I()}),E($,"[data-tg-borrar]",g=>{x($),e.splice(Number(g.getAttribute("data-tg-borrar")),1),I()}),E($,"[data-tg-guardar]",()=>{x($);const g=[...e].sort((h,A)=>h[0]-A[0]);if(g.length===0)return D("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:g}),D("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(h=>h.año===a?{...h,tramos:g}:h)),D(`Tabla ${a} guardada`)),t.onDatosCambiados(),u()})}return{abrir:u}}const Le=["#00e5a0","#4d9fff","#ffd166","#ff4d6d","#a855f7","#fb923c"],ii="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z";function ri(t){const a=()=>document.getElementById("modal-overlay"),e=()=>document.getElementById("modal-content"),o=()=>{var r;return(r=a())==null?void 0:r.classList.add("hidden")};function s(r,x,m,l){const p=ta(r,m,l),v=r.targetAmount||0,$=v>0?Math.min(100,p/v*100):0,I=!r.completado&&v>0&&p>=v,f=r.targetDate?Math.max(0,Math.round((q(r.targetDate).getTime()-q(t.hoy()).getTime())/(30.44*864e5))):null,g=f!==null&&f>0?Math.max(0,v-p)/f:null,h=!r.completado&&!I?ea(r,m,{extractoCuenta:t.extractoCuenta,colchonEnFecha:t.colchonEnFecha,hoy:q(t.hoy())}):null,A=(r.cuentaIds||[]).length>0?(r.cuentaIds||[]).map(S=>{var C;return((C=m.find(j=>j._id===S))==null?void 0:C.nombre)??S}).join(", "):"Todas las cuentas activas",b=[r.completado?'<span class="badge badge-active">✓ Completado</span>':"",I?'<span class="badge" style="background:rgba(0,229,160,0.2);color:var(--accent)">🎉 ¡Meta alcanzada!</span>':"",r.usarColchon!==!1?'<span class="badge badge-inactive" title="Colchón descontado del saldo">🛡 −colchón</span>':""].join(""),y=$>=100?"var(--accent)":$>=70?"var(--yellow)":"var(--text2)",M=["card mb-8",r.completado?"goal-completado":"",I?"goal-alcanzado":""].filter(Boolean).join(" "),w=[g!==null?`<span>Necesitas ${c(F(g))}/mes</span>`:"",r.targetDate?`<span>Meta fijada: ${c(r.targetDate)}</span>`:"",h?`<span style="color:var(--accent)">📈 Estimado: ${c(h)}</span>`:!r.completado&&!I?'<span style="color:var(--text3)">Sin proyección</span>':"",r.usarColchon!==!1?`<span>Colchón: ${c(F(l))}</span>`:"",`<span>Cuentas: ${c(A)}</span>`].join("");return`<div class="${M}" style="padding:14px;border:1px solid ${I?"var(--accent)":"var(--border)"}">
      <div class="flex justify-between items-center mb-8">
        <div class="flex gap-8 items-center flex-wrap">
          <span class="goal-priority-badge">#${c(r.prioridad||x+1)}</span>
          <span style="font-weight:600;font-size:14px${r.completado?";text-decoration:line-through;color:var(--text3)":""}">${c(r.nombre)}</span>
          ${b}
        </div>
        <div class="flex gap-8">
          ${I?`<button class="btn-primary btn-sm" data-completar-goal="${c(r._id)}">Marcar completado</button>`:""}
          <button class="btn-icon" data-editar-goal="${c(r._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${ii}"/></svg></button>
          <button class="btn-danger btn-sm" data-borrar-goal="${c(r._id)}">✕</button>
        </div>
      </div>
      <div class="flex justify-between mb-4">
        <span class="text-sm">${c(F(p))} / ${c(F(v))}</span>
        <span class="text-sm" style="color:${y}">${$.toFixed(0)}%${f!==null?` · ${f}m restantes`:""}</span>
      </div>
      <div class="goal-bar"><div class="goal-bar-fill" style="width:${$}%;background:${c(r.color||"var(--accent)")}"></div></div>
      <div class="flex gap-12 mt-8 flex-wrap" style="font-size:11px;color:var(--text3)">${w}</div>
    </div>`}function n(r){const x=[...t.store.get("goals")].sort((p,v)=>(p.prioridad||99)-(v.prioridad||99)),m=t.store.get("accounts"),l=t.colchonEnFecha(t.hoy());r.innerHTML=`
      <div class="flex justify-between items-center mb-12">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro</div>
        <button class="btn-primary btn-sm" data-nuevo-goal>+ Objetivo</button>
      </div>
      ${x.length===0?'<div class="text-sm" style="color:var(--text3)">Sin objetivos. Define metas de ahorro para seguirlas aquí y en el Dashboard.</div>':x.map((p,v)=>s(p,v,m,l)).join("")}`}function i(r){const x=t.store.get("accounts").filter($=>$.activo&&!$.simulacion),m=t.store.get("goals"),l=r?r.prioridad||1:Math.max(0,...m.map($=>$.prioridad||0))+1,p=(r==null?void 0:r.color)||Le[0],v=x.map($=>`<label style="display:flex;gap:8px;align-items:center;font-size:13px;cursor:pointer">
          <input type="checkbox" class="goal-acc-check" value="${c($._id)}"${((r==null?void 0:r.cuentaIds)||[]).includes($._id)?" checked":""}/>
          ${c($.nombre)}
        </label>`).join("");return`
      <div class="form-group"><label class="form-label">Nombre del objetivo</label>
        <input class="form-input" type="text" id="goal-nombre" value="${c((r==null?void 0:r.nombre)??"")}" placeholder="Ej: Fondo de emergencia"/></div>
      <div class="grid-2 mt-8">
        <div class="form-group"><label class="form-label">Importe objetivo (€)</label>
          <input class="form-input" type="number" id="goal-amount" value="${c((r==null?void 0:r.targetAmount)??"")}" placeholder="10000"/></div>
        <div class="form-group"><label class="form-label">Fecha límite (opcional)</label>
          <input class="form-input" type="date" id="goal-date" value="${c((r==null?void 0:r.targetDate)??"")}"/></div>
      </div>

      <details class="form-advanced mt-12"${r?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="form-group mt-8"><label class="form-label">Prioridad (1 = mayor)</label>
            <input class="form-input" type="number" id="goal-prio" value="${c(l)}" placeholder="1"/></div>
          <div class="form-group mt-8">
            <label class="form-label">Cuentas a considerar (vacío = todas las activas)</label>
            <div style="display:flex;flex-direction:column;gap:6px;padding:8px;background:var(--bg3);border-radius:var(--radius)">
              ${v||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
            </div>
          </div>
          <div class="form-row mt-8">
            <label class="form-label">Descontar colchón económico</label>
            <label class="toggle"><input type="checkbox" id="goal-colchon"${(r==null?void 0:r.usarColchon)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
            <span class="text-sm" style="margin-left:6px;color:var(--text3)">Muestra el excedente sobre el mínimo de seguridad</span>
          </div>
          <div class="form-row mt-8">
            <label class="form-label">Marcar como completado</label>
            <label class="toggle"><input type="checkbox" id="goal-completado"${r!=null&&r.completado?" checked":""}/><span class="toggle-slider"></span></label>
          </div>
          <div class="form-group mt-8"><label class="form-label">Color</label>
            <select class="form-select" id="goal-color">
              ${Le.map($=>`<option value="${$}"${$===p?" selected":""}>${$}</option>`).join("")}
            </select></div>
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-goal="${c((r==null?void 0:r._id)??"")}">Guardar</button>
      </div>`}function d(r,x){const m=r?t.store.get("goals").find(v=>v._id===r)??null:null,l=a(),p=e();!l||!p||(p.innerHTML=`<div class="modal-title">${r?"Editar objetivo":"Nuevo objetivo"}</div>${i(m)}`,l.classList.remove("hidden"),E(p,"[data-cancelar]",o),E(p,"[data-guardar-goal]",v=>{var h,A;const $=b=>{var y;return((y=p.querySelector(b))==null?void 0:y.value)??""},I=$("#goal-nombre").trim();if(!I)return D("Nombre obligatorio","err");const f={nombre:I,targetAmount:parseFloat($("#goal-amount"))||0,targetDate:$("#goal-date")||null,prioridad:parseInt($("#goal-prio"),10)||1,color:$("#goal-color")||Le[0],usarColchon:!!((h=p.querySelector("#goal-colchon"))!=null&&h.checked),completado:!!((A=p.querySelector("#goal-completado"))!=null&&A.checked),cuentaIds:[...p.querySelectorAll(".goal-acc-check:checked")].map(b=>b.value)},g=v.getAttribute("data-guardar-goal")||"";g?(t.store.updateItem("goals",g,f),D("Actualizado")):(t.store.addItem("goals",f),D("Objetivo creado")),t.onDatosCambiados(),o(),x()}))}function u(r,x){E(r,"[data-nuevo-goal]",()=>d(null,x)),E(r,"[data-editar-goal]",m=>d(m.getAttribute("data-editar-goal"),x)),E(r,"[data-borrar-goal]",m=>{tt("¿Eliminar objetivo?")&&(t.store.removeItem("goals",m.getAttribute("data-borrar-goal")),D("Objetivo eliminado"),t.onDatosCambiados(),x())}),E(r,"[data-completar-goal]",m=>{t.store.updateItem("goals",m.getAttribute("data-completar-goal"),{completado:!0}),D("Objetivo marcado como completado ✓"),t.onDatosCambiados(),x()})}return{render:n,wire:u}}const li="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",ci=120;function di(t){const a=t.hoy??V,e=()=>{var z;return(z=t.onDatosCambiados)==null?void 0:z.call(t)},o=t.mostrarObjetivos??(()=>!0),s=new Map,n=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),d=z=>{var P;return((P=i().find(_=>_._id===z))==null?void 0:P.nombre)??z},u=z=>{var P;return((P=t.store.get("accounts").find(_=>_._id===z))==null?void 0:P.nombre)??z},r=()=>vt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??ft)(Number(a().slice(0,4))),x=()=>vt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??St),m=()=>x()(Number(a().slice(0,4))),l=z=>Ia(t.store.get("expenses"),n(),t.store.get("loans"),z);function p(){const z=n(),P=t.store.get("accounts"),_=Bt({loans:[],expenses:t.store.get("expenses").filter(L=>L.tipo==="transferencia"),accounts:P,config:{dashboardStart:z.dashboardStart,dashboardEnd:z.dashboardEnd,fechaReferencia:z.dashboardStart},nominas:[],resolverTramosGanancias:x()}),N=new Map,O=L=>{let B=N.get(L);return B||(B={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},N.set(L,B)),B},G=(L,B)=>{const U=`${B.sourceId}`,R=L.find(Y=>Y.concepto===U),k=R??{concepto:U,contraparte:"",total:0,ocurrencias:0};k.total+=Math.abs(B.cuantia),k.ocurrencias+=1,R||L.push(k)};for(const L of _){if(!L.cuenta)continue;const B=O(L.cuenta);L.sourceType==="transfer-in"||L.sourceType==="traspaso-in"?(B.totalAportaciones+=Math.abs(L.cuantia),G(B.entradas,L)):L.sourceType==="transfer-out"||L.sourceType==="traspaso-out"?(B.totalReembolsos+=Math.abs(L.cuantia),G(B.salidas,L)):L.sourceType==="investment-tax"&&(B.retencion+=Math.abs(L.cuantia))}const T=t.store.get("expenses");for(const L of N.values())for(const[B,U]of[[L.entradas,"cuenta"],[L.salidas,"cuentaDestino"]])for(const R of B){const k=T.find(Y=>Y._id===R.concepto);R.contraparte=u((k==null?void 0:k[U])??"default"),R.concepto=(k==null?void 0:k.concepto)||(U==="cuenta"?"Aportación":"Reembolso")}return N}function v(){const z=new Map,P=n(),_=a(),N=new Date(Number(_.slice(0,4)),Number(_.slice(5,7))-1+ci+1,0),O=`${N.getFullYear()}-${String(N.getMonth()+1).padStart(2,"0")}-${String(N.getDate()).padStart(2,"0")}`;return G=>{const T=z.get(G._id);if(T)return T;const L=Bt({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...P,dashboardStart:_,dashboardEnd:O,fechaReferencia:_},filtroAccounts:[G._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:vt(t.store.get("tramosIRPFHistorico"),P.tramos_irpf??ft),resolverTramosGanancias:x()}).map(B=>({fecha:B.fecha,saldoAcum:B.saldoAcum}));return z.set(G._id,L),L}}const $=ri({store:t.store,colchonEnFecha:l,extractoCuenta:z=>I(z),hoy:a,onDatosCambiados:e});let I=v();function f(z){I=v();const _=t.store.get("accounts").filter(T=>dt(T)!=="pension"),N=p(),O={config:n(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:r(),tramosGanancias:m(),nombreEscenario:d,flujos:T=>N.get(T)??Un,invModo:T=>s.get(T)??"proyeccion"};z.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${Yn(_,O.tramosGanancias)}
      <div class="grid-3">${_.map(T=>Xn(T,O)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const G=z.querySelector("#goals-section");G&&$.render(G)}const g=()=>document.getElementById("modal-overlay"),h=()=>document.getElementById("modal-content"),A=()=>{var z;return(z=g())==null?void 0:z.classList.add("hidden")};function b(z,P){const _=g(),N=h();return!_||!N?null:(N.innerHTML=z?`<div class="modal-title">${c(z)}</div>${P}`:P,_.classList.remove("hidden"),E(N,"[data-cancelar]",A),N)}function y(z,P){const _=z?t.store.get("accounts").find(T=>T._id===z)??null:null,N=[...(_==null?void 0:_.planAportaciones)??[]].map(T=>({...T})),O=_?M(_):null,G=b(z?"Editar cuenta / fondo":"Nueva cuenta / fondo",ei(_,{escenarios:i(),nominas:t.store.get("nominas"),hoy:a(),saldoActual:O??0}));G&&(ai(G,N,a()),E(G,"[data-guardar-acc]",T=>{const L=T.getAttribute("data-guardar-acc")||"",{datos:B,punto:U,error:R}=oi(G,N,_,O,a());if(R)return D(R,"err");let k=L;L?t.store.updateItem("accounts",L,B):k=t.store.addItem("accounts",B)._id,U&&t.ledger.registrarPuntoControl(k,U.fecha,U.saldo,U.nota),D(L?"Actualizada":"Cuenta / fondo creado"),e(),A(),P()}))}function M(z){const P=t.ledger.puntosControl(z._id);return P.length>0?Oe(P)[0].saldo:z.saldo??null}function w(z,P){const _=t.store.get("accounts").find(G=>G._id===z);if(!_)return;const N=b("Histórico de saldos",si(_.nombre,z,Oe(t.ledger.puntosControl(z)),_.saldoInicial||0,a()));if(!N)return;const O=()=>{P(),w(z,P)};E(N,"[data-hist-anadir]",()=>{var B,U,R;const G=((B=N.querySelector("#hi-fecha"))==null?void 0:B.value)??"",T=parseFloat(((U=N.querySelector("#hi-saldo"))==null?void 0:U.value)??""),L=((R=N.querySelector("#hi-nota"))==null?void 0:R.value.trim())??"";if(!G||!Number.isFinite(T))return D("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(z,G,T,L||void 0),D("Punto añadido"),e(),O()}),E(N,"[data-hist-borrar]",G=>{const[,T]=(G.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(T),D("Eliminado"),e(),O()}),E(N,"[data-hist-inicial]",G=>{const[T,L]=(G.getAttribute("data-hist-inicial")||"").split("|"),B=t.ledger.puntosControl(T).find(R=>R._id===L);if(!B)return;const U=Oe([B])[0].saldo;t.store.updateItem("accounts",T,{saldoInicial:U,fechaInicialSaldo:B.fecha}),D(`Punto inicial → ${B.fecha} (${F(U)})`),e(),O()})}function S(z){const P=t.store.get("accounts").filter(O=>O.activo);if(P.length===0)return D("No hay cuentas activas","err");const _=a(),N=P.map(O=>`• ${O.nombre}: ${F(M(O)??O.saldoInicial??0)}`).join(`
`);if(tt(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${_})?

${N}

Esto recalibra el punto de arranque del dashboard.`)){for(const O of P)t.store.updateItem("accounts",O._id,{saldoInicial:M(O)??O.saldoInicial??0,fechaInicialSaldo:_});D("Saldo base actualizado"),e(),z()}}function C(z,P,_){E(z,"[data-nueva-acc]",()=>y(null,P)),E(z,"[data-editar-acc]",N=>y(N.getAttribute("data-editar-acc"),P)),E(z,"[data-tramos-ganancias]",()=>_.abrir()),E(z,"[data-reset-base]",()=>S(P)),E(z,"[data-hist-acc]",N=>w(N.getAttribute("data-hist-acc"),P)),E(z,"[data-principal-acc]",N=>{const O=N.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(G=>({...G,esCuentaPrincipal:G._id===O}))),D("Cuenta marcada como principal"),e(),P()}),E(z,"[data-borrar-acc]",N=>{const O=N.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return D("Debe existir al menos una cuenta","err");if(!tt("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",O);const T=t.store.get("accounts");T.length>0&&!T.some(L=>L.esCuentaPrincipal)&&t.store.set("accounts",T.map((L,B)=>B===0?{...L,esCuentaPrincipal:!0}:L)),D("Cuenta eliminada"),e(),P()}),E(z,"[data-inv-modo]",N=>{const[O,G]=(N.getAttribute("data-inv-modo")||"").split("|");s.set(O,G==="real"?"real":"proyeccion"),P()}),$.wire(z,P)}let j=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:li,mount(z){const P=()=>f(z);j??(j=ni({store:t.store,onDatosCambiados:()=>{e(),P()},año:()=>Number(a().slice(0,4))})),f(z),z.dataset.wired!=="1"&&(C(z,P,j),z.dataset.wired="1")}}}const et=(t,a,e="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${e};font-size:12px;padding:5px 10px">${c(F(a))}</td>
  </tr>`,qe=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${c(t)}</td></tr>`;function io(t){const e=t.capMobiliario!==0||t.gananciasFondos!==0?`${et("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
       ${et("Ganancias patrimoniales (fondos/acciones)",t.gananciasFondos,t.gananciasFondos>=0?"var(--text)":"var(--green)",!0)}`:'<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>',o=t.resultado>0?"var(--red)":"var(--green)",s=t.resultado>0?"🔴 A PAGAR":"🟢 A DEVOLVER";return`
    <table style="width:100%;border-collapse:collapse">
      ${qe("RENDIMIENTOS DEL TRABAJO")}
      ${et("Ingresos íntegros del trabajo",t.brutoTotal,"var(--text)",!0)}
      ${t.flexTotal>0?et("− Retribución flexible exenta (Art. 42 LIRPF)",-t.flexTotal,"var(--green)",!0):""}
      ${t.flexTotal>0?et("= Ingresos sujetos a IRPF",t.brutoIRPF):""}
      ${et("− Cotizaciones SS (≈6,35 %)",-t.cotizSS,"var(--red)",!0)}
      ${et("− Gastos deducibles (Art. 19.2 LIRPF)",-t.gastosArt19,"var(--red)",!0)}
      ${et("= Rendimiento neto trabajo",t.RNT)}
      ${et("− Reducción Art. 20 LIRPF",-t.reducArt20,"var(--green)",!0)}
      ${t.deducPP>0?et(`− Aportaciones a planes de pensiones (${c(F(t.aportPP))}, límite ${c(F(t.limPP))})`,-t.deducPP,"var(--green)",!0):""}
      ${t.otrosIngresos>0?et("+ Otros ingresos sujetos a IRPF",t.otrosIngresos,"var(--text)",!0):""}
      ${t.capInmobiliario!==0?et("+ Capital inmobiliario neto",t.capInmobiliario,t.capInmobiliario>=0?"var(--text)":"var(--green)",!0):""}
      ${t.otrasCorto!==0?et("± Otras ganancias a corto plazo",t.otrasCorto,"var(--text)",!0):""}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE GENERAL</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(F(t.baseGeneral))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota IRPF base general</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(F(t.cuotaGen))}</td>
      </tr>

      ${qe("BASE DEL AHORRO")}
      ${e}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(F(t.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(F(t.cuotaAho))}</td>
      </tr>

      ${qe("RESULTADO")}
      ${et("Cuota íntegra total",t.cuotaIntegra,"var(--red)")}
      ${et("− Retenciones en nómina",-t.retNomina,"var(--green)",!0)}
      ${t.retCapital!==0?et("− Retenciones de capital mobiliario",-t.retCapital,"var(--green)",!0):""}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${s}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${o}">${c(F(Math.abs(t.resultado)))}</td>
      </tr>
    </table>`}const Xt=(t,a,e,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${c(a)}</label>
    <input type="number" id="${t}" class="form-input" value="${c(e)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${c(o)}</div>`:""}
  </div>`;function ui(t){const a=t.extras,e=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
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
          ${Xt("rex-inmobiliario","Capital inmobiliario neto (alquileres − gastos)",a.capInmobiliario??0)}
          ${Xt("rex-mobiliario","Capital mobiliario (dividendos, intereses)",a.capMobiliario??0)}
          ${Xt("rex-ganancias","Ganancias / pérdidas patrimoniales (fondos, acciones)",a.gananciasFondos??0,"Positivo = ganancia · Negativo = pérdida compensable")}
          ${Xt("rex-otras","Otras ganancias a corto plazo (menos de 1 año)",a.otrasCorto??0)}
          ${Xt("rex-ret-cap","Retenciones de capital ya aplicadas",a.retCapital??0,"Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen")}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${t.nominas.length>0?t.nominas.map(o=>`• ${c(o.nombre)}: ${c(F(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${c(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${io(t.declaracion)}</div>
      </div>
    </div>`}function ro(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((e,o)=>e[0]-o[0]).map(([e,o],s,n)=>{const i=s<n.length-1?n[s+1][0]:null,d=i!==null?`${F(e)} – ${F(i)}`:`Más de ${F(e)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${c(d)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${c(o)}%</td>
      </tr>`}).join("")}
  </table>`}const pi=(t,a,e)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${c(a)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${e}</div>
  </div>`,rt=(t,a,e="")=>`<div class="stat-card"><div class="stat-label">${c(t)}</div><div class="stat-value ${e}">${c(a)}</div></div>`,bt=(t,a,e="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${c(t)}</span><span class="num ${e}">${c(a)}</span></div>`;function mi(t,a,e){const o=t.filter(u=>(u.modeloFondo||"cuenta")==="inversion");if(o.length===0)return pi("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let s=0,n=0,i=0;const d=o.map(u=>{const r=Et(u,a);if(!r)return"";s+=r.saldo,n+=r.costBase,i+=r.impuesto;const x=r.costBase>0?r.plusvalia/r.costBase*100:0,m=(u.escenarioIds||[]).map(l=>`<span class="badge badge-yellow">🔭 ${c(e(l))}</span>`).join("");return`
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${c(u.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${m}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            ${rt("Valor actual",F(r.saldo))}
            ${rt("Coste base (aportado)",F(r.costBase))}
          </div>
          <div class="grid-2" style="gap:8px">
            ${rt(`Plusvalía latente (${x>=0?"+":""}${x.toFixed(1)}%)`,F(r.plusvalia),r.plusvalia>=0?"pos":"neg")}
            ${rt("Imp. ganancias de capital (est.)",F(r.impuesto),"neg")}
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${c(F(r.neto))}</span>
          </div>
        </div>`}).join("");return`
    <div class="card mb-16" style="border:1px solid rgba(99,102,241,0.3)">
      <div class="card-title">Cartera de fondos — resumen</div>
      <div class="grid-3" style="gap:8px;margin-bottom:10px">
        ${rt("Valor total de la cartera",F(s))}
        ${rt("Total aportado (coste base)",F(n))}
        ${rt("Plusvalía latente total",F(s-n),s-n>=0?"pos":"neg")}
      </div>
      <div class="grid-2" style="gap:8px">
        ${rt("Impuesto estimado si se liquida todo",F(i),"neg")}
        ${rt("Neto tras impuestos (cartera completa)",F(s-i),"pos")}
      </div>
    </div>

    ${d}

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
      ${ro(a)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function fi(t){const{nominas:a,planes:e,tramos:o}=t,s=p=>p.grupoNomina?a.filter(v=>(v.grupoNomina||"")===p.grupoNomina):null,n=a.map(p=>({n:p,d:Ae(p,s(p),o)})),i=n.reduce((p,v)=>p+v.d.brutoAnual,0),d=n.reduce((p,v)=>p+v.d.irpfAnual,0),u=n.reduce((p,v)=>p+v.d.ssAnual,0),r=n.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':n.map(({n:p,d:v})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${c(p.nombre)}</div>
          ${bt("Bruto anual",F(v.brutoAnual))}
          ${v.flexAnual>0?bt("− Retribución flexible exenta",F(-v.flexAnual),"pos"):""}
          ${bt("− Cotización SS",F(-v.ssAnual),"neg")}
          ${bt(`− IRPF estimado (${v.irpfPct.toFixed(1)} %)`,F(-v.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${c(F(v.baseDineraria-v.ssAnual-v.irpfAnual))}</span>
          </div>
        </div>`).join(""),x=ra(a,o),m=`${t.hoy.slice(0,4)}-01-01`,l=e.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':e.map(p=>{const v=oe(p);if(!v)return"";const $=(p.aportaciones||[]).filter(h=>h.fecha>=m).reduce((h,A)=>h+A.cantidad,0),f=Math.min($,Ft)*x/100,g=$>Ft;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${c(p.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${bt("Valor actual",F(v.saldo))}
          ${bt("Coste base (total aportado)",F(v.costBase))}
          ${bt("Revalorización",F(v.beneficio),v.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(t.hoy.slice(0,4))}</div>
            ${bt("Aportado",`${F($)}${g?" ⚠":""}`,g?"neg":"")}
            ${bt("Límite deducible",F(Ft))}
            ${bt(`Ahorro IRPF est. (marginal ${x} %)`,F(f),"pos")}
            ${g?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${c(F(Ft))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${v.proxDesbloqueo?`· Próx. desbloqueo: ${c(v.proxDesbloqueo)}`:""}
          </div>
        </div>`}).join("");return`
    <div class="card mb-16">
      <div class="card-title mb-10">Nóminas activas — importes anuales</div>
      <div class="grid-4" style="gap:8px;margin-bottom:14px">
        ${rt("Bruto anual total",F(i))}
        ${rt("Cotización SS anual",F(u),"neg")}
        ${rt("IRPF estimado anual",F(d),"neg")}
        ${rt("Neto anual",F(i-u-d),"pos")}
      </div>
      <div class="grid-3">${r}</div>
    </div>

    <div class="card-title mb-8">Planes de pensiones</div>
    <div class="auth-hint mb-14" style="border-color:var(--yellow)">
      💼 <strong>Diferencia clave frente a los fondos de inversión:</strong> el rescate de un plan de pensiones tributa en la
      <strong>base general del IRPF</strong> (tramos ordinarios hasta el 47 %), <em>no</em> en la base del ahorro. Las
      aportaciones son deducibles hasta <strong>${c(F(Ft))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${l}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${ro(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const re=(t,a)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${c(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${c(a)}</div>
  </div>`;function vi(){return`
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
        ${re("Rendimientos íntegros","Alquileres, subarriendos y cesión de derechos sobre inmuebles")}
        ${re("Gastos deducibles","IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación")}
        ${re("Reducción del 60 %","Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)")}
        ${re("Base general del IRPF","Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.")}
      </div>
    </div>`}const lo=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],gi="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function bi(t){const a=t.hoy??V;let e="declaracion",o={};const s=()=>t.store.get("config"),n=()=>Number(a().slice(0,4)),i=()=>t.store.get("nominas").filter(g=>g.activo),d=()=>t.store.get("accounts").filter(g=>(g.modeloFondo||"cuenta")==="pension"),u=g=>{var h;return((h=t.store.get("escenarios").find(A=>A._id===g))==null?void 0:h.nombre)??g},r=()=>vt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??ft)(n()),x=()=>vt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??St)(n());function m(){const g=`${n()}-01-01`,h=t.store.get("nominas").filter(y=>y.activo&&!y.simulacion),A=d().reduce((y,M)=>y+(M.aportaciones||[]).filter(w=>w.fecha>=g).reduce((w,S)=>w+S.cantidad,0),0),b=t.store.get("expenses").filter(y=>y.activo&&y.sujetoIRPF&&y.tipo==="ingreso").reduce((y,M)=>y+la(M),0);return da({nominas:h,aportacionesPension:A,otrosIngresos:b,extras:o,tramosGeneral:r(),tramosAhorro:x()})}function l(){const g=r(),h=i(),A=P=>P.grupoNomina?h.filter(_=>(_.grupoNomina||"")===P.grupoNomina):null,b=h.map(P=>Ae(P,A(P),g)),y=b.reduce((P,_)=>P+_.brutoAnual,0),M=b.reduce((P,_)=>P+_.irpfAnual,0),w=b.reduce((P,_)=>P+_.ssAnual,0),S=t.store.get("accounts").filter(P=>(P.modeloFondo||"cuenta")==="inversion");let C=0,j=0;for(const P of S){const _=Et(P,x());_&&(C+=_.plusvalia,j+=_.impuesto)}if(y<=0&&S.length===0)return"";const z=(P,_,N)=>`<div class="exec-item"><div class="exec-item-label">${c(P)}</div><div class="exec-item-val ${N}">${c(_)}</div></div>`;return`<div class="exec-summary mb-14">
      ${y>0?z("IRPF trabajo",`${F(M)}/año`,"neg"):""}
      ${y>0?z("Neto trabajo",`${F(y-w-M)}/año`,"pos"):""}
      ${S.length>0?z("Plusvalía latente",F(C),C>=0?"pos":"neg"):""}
      ${S.length>0?z("Imp. potencial (inversión)",F(j),"neg"):""}
    </div>`}function p(){return e==="mobiliario"?mi(t.store.get("accounts"),x(),u):e==="trabajo"?fi({nominas:i(),planes:d(),tramos:r(),hoy:a()}):e==="inmobiliario"?vi():ui({año:n(),extras:o,declaracion:m(),nominas:i().map(g=>({nombre:g.nombre,bruto:g.bruto||0})),planes:d().map(g=>g.nombre)})}function v(g,h){const A=e===g;return`<button data-tab-fisc="${g}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${A?"600":"400"};
      color:${A?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${A?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${c(h)}</button>`}function $(g){const h=g.querySelector("#fisc-tabs"),A=g.querySelector("#fisc-tab-content");h&&(h.innerHTML=lo.map(([b,y])=>v(b,y)).join("")),A&&(A.innerHTML=p())}function I(g){g.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${l()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${lo.map(([h,A])=>v(h,A)).join("")}
      </div>
      <div id="fisc-tab-content">${p()}</div>`}function f(g){E(g,"[data-tab-fisc]",h=>{e=h.getAttribute("data-tab-fisc")||"declaracion",$(g)}),g.addEventListener("input",h=>{var M;if(!((M=h.target)==null?void 0:M.closest("[data-rex]")))return;const b=w=>{var S;return((S=g.querySelector(`#${w}`))==null?void 0:S.value)??"0"};o={capInmobiliario:parseFloat(b("rex-inmobiliario"))||0,capMobiliario:parseFloat(b("rex-mobiliario"))||0,gananciasFondos:parseFloat(b("rex-ganancias"))||0,otrasCorto:parseFloat(b("rex-otras"))||0,retCapital:parseFloat(b("rex-ret-cap"))||0};const y=g.querySelector("#renta-cuadro");y&&(y.innerHTML=io(m()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:gi,mount(g){I(g),g.dataset.wired!=="1"&&(f(g),g.dataset.wired="1")}}}const co=()=>globalThis.Chart??null;function hi(t,a){const e=co();if(!e)return null;const o=a.map(s=>({label:s.label,data:s.puntos.map(n=>({x:n.x,y:n.y})),borderColor:s.esBase?"#6b7280":s.color,backgroundColor:s.esBase?"transparent":`${s.color}18`,borderWidth:s.esBase?1.5:2,...s.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new e(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:s=>`${s.dataset.label}: ${F(s.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:s=>F(s)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const yi=()=>co()!==null,jt=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],xi="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function $i(t){const a=()=>{var y;return(y=t.onDatosCambiados)==null?void 0:y.call(t)},e=new Set;let o=null;const s=()=>t.store.get("config"),n=()=>t.store.get("escenarios"),i=y=>{var M;return y?((M=n().find(w=>w._id===y))==null?void 0:M.nombre)??y:"Base"};function d(y){const M=s(),w=oa({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(y==null?void 0:y._id)??null),S=e.size>0?w.accounts.filter(P=>!e.has(P._id)):w.accounts,C=e.size>0?S.map(P=>P._id):null,j=y!=null&&y.fechaFin&&y.fechaFin>M.dashboardEnd?y.fechaFin:M.dashboardEnd;return{eventos:Bt({loans:w.loans,expenses:w.expenses,accounts:S,config:{...M,dashboardEnd:j},filtroAccounts:C,nominas:w.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:vt(t.store.get("tramosIRPFHistorico"),M.tramos_irpf??ft),resolverTramosGanancias:vt(t.store.get("tramosGananciasCapitalHistorico"),M.tramosGananciasCapital??St)}),horizonte:j}}function u(y){const M=t.store.get("loans"),w=z=>(z.escenarioIds||[]).includes(y),S=[[M.filter(w).length,"préstamo","préstamos"],[M.flatMap(z=>z.amortizaciones||[]).filter(w).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(w).length,"gasto","gastos"],[t.store.get("accounts").filter(w).length,"cuenta","cuentas"],[t.store.get("nominas").filter(w).length,"nómina","nóminas"]],C=S.reduce((z,[P])=>z+P,0),j=S.filter(([z])=>z>0).map(([z,P,_])=>`${z} ${z===1?P:_}`).join(" · ");return{total:C,texto:j}}function r(y,M){const w=M===y._id,S=y.color||jt[0],{total:C,texto:j}=u(y._id);return`<div class="card mb-12" style="border-left:3px solid ${c(S)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${c(S)};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${c(y.nombre)}</span>
        ${w?'<span class="badge badge-yellow">● Activo</span>':""}
        ${y.fechaFin?`<span class="badge badge-inactive">📅 ${c(y.fechaFin)}</span>`:""}
        <div class="flex gap-8">
          ${w?'<button class="btn-secondary btn-sm" data-desactivar-esc>Desactivar</button>':`<button class="btn-primary btn-sm" data-activar-esc="${c(y._id)}">Activar</button>`}
          <button class="btn-secondary btn-sm" data-editar-esc="${c(y._id)}">Editar</button>
          <button class="btn-danger btn-sm" data-borrar-esc="${c(y._id)}">✕</button>
        </div>
      </div>
      ${y.descripcion?`<div class="text-sm mb-8" style="color:var(--text2)">${c(y.descripcion)}</div>`:""}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${C===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${c(j)}</span>`}
      </div>
    </div>`}function x(y){const M=s().dashboardEnd,w=be(d(null).eventos,M);return`
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
        <tbody>${y.map(C=>{const{eventos:j}=d(C),z=C.fechaFin||M,P=be(j,z),_=P!==null&&w!==null?P-w:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c(C.color||jt[0])};margin-right:6px"></span>
            ${c(C.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${c(z)}</td>
          <td class="num" style="padding:6px 10px">${P!==null?c(F(P)):"—"}</td>
          <td class="num ${_===null?"":_>=0?"pos":"neg"}" style="padding:6px 10px">
            ${_===null?"—":`${_>=0?"+":""}${c(F(_))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function m(){const y=t.store.get("accounts");return y.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${y.map(w=>{const S=e.has(w._id);return`<button data-toggle-cuenta="${c(w._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${S?"var(--border)":"var(--accent)"};
          background:${S?"transparent":"rgba(99,102,241,0.1)"};
          color:${S?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${S?"text-decoration:line-through;":""}">${c(w.nombre)}</button>`}).join("")}
    </div>`}function l(){if(o){try{o.destroy()}catch{}o=null}}function p(y){const M=s(),w=d(null),S=[{label:"Base (sin escenario)",color:"#6b7280",esBase:!0,puntos:ge(w.eventos,M.dashboardStart,M.dashboardEnd)}];return y.forEach((C,j)=>{const{eventos:z,horizonte:P}=d(C);S.push({label:C.nombre,color:C.color||jt[j%jt.length],puntos:ge(z,M.dashboardStart,P)})}),S}function v(y,M){l();const w=y.querySelector("#chart-comparacion");w&&(o=hi(w,p(M)))}function $(y){l();const M=new Set(t.store.get("accounts").map(C=>C._id));for(const C of[...e])M.has(C)||e.delete(C);const w=n(),S=s().escenarioActivo||null;y.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Escenarios</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo escenario</button></div>
      </div>

      ${S?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${c(i(S))}</span>
                 <span style="font-size:12px;color:var(--text3);margin-left:8px">El dashboard muestra la proyección de este escenario</span>
               </div>
               <button class="btn-secondary btn-sm" data-desactivar-esc>Volver a base</button>
             </div>`:""}

      ${w.length===0?`<div class="card mb-14" style="padding:20px 24px">
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
             </div>`:`<div>${w.map(C=>r(C,S)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de escenarios</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${m()}</div>
               ${yi()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${x(w)}</div>`}`,w.length>0&&v(y,w)}const I=()=>document.getElementById("modal-overlay"),f=()=>document.getElementById("modal-content"),g=()=>{var y;return(y=I())==null?void 0:y.classList.add("hidden")};function h(y,M){const w=y?n().find(z=>z._id===y)??null:null,S=I(),C=f();if(!S||!C)return;const j=(w==null?void 0:w.color)||jt[0];C.innerHTML=`
      <div class="modal-title">${y?"Editar escenario":"Nuevo escenario"}</div>
      <div class="form-group"><label class="form-label">Nombre del escenario</label>
        <input class="form-input" type="text" id="esc-nombre" value="${c((w==null?void 0:w.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${c((w==null?void 0:w.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${jt.map(z=>`<div data-color-esc="${z}" style="width:26px;height:26px;border-radius:50%;background:${z};cursor:pointer;
              border:2px solid ${z===j?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${c(j)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${c((w==null?void 0:w.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${c(y??"")}">${y?"Guardar cambios":"Crear escenario"}</button>
      </div>`,S.classList.remove("hidden"),E(C,"[data-cancelar]",g),E(C,"[data-color-esc]",z=>{const P=z.getAttribute("data-color-esc");C.querySelector("#esc-color").value=P;for(const _ of C.querySelectorAll("[data-color-esc]"))_.style.border=_.getAttribute("data-color-esc")===P?"2px solid white":"2px solid transparent"}),E(C,"[data-guardar-esc]",z=>{const P=C.querySelector("#esc-nombre").value.trim();if(!P)return D("El nombre es obligatorio","err");const _={nombre:P,fechaFin:C.querySelector("#esc-fecha-fin").value||null,color:C.querySelector("#esc-color").value||jt[0],descripcion:C.querySelector("#esc-desc").value.trim()},N=z.getAttribute("data-guardar-esc")||"";N?(t.store.updateItem("escenarios",N,_),D("Escenario actualizado")):(t.store.addItem("escenarios",_),D("Escenario creado")),a(),g(),M()})}function A(y,M){if(!tt("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const w=S=>S.map(C=>({...C,escenarioIds:(C.escenarioIds||[]).filter(j=>j!==y)}));t.store.set("loans",w(t.store.get("loans")).map(S=>({...S,amortizaciones:w(S.amortizaciones||[])}))),t.store.set("expenses",w(t.store.get("expenses"))),t.store.set("nominas",w(t.store.get("nominas"))),t.store.set("accounts",w(t.store.get("accounts"))),s().escenarioActivo===y&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",y),D("Escenario eliminado"),a(),M()}function b(y,M){E(y,"[data-nuevo-esc]",()=>h(null,M)),E(y,"[data-editar-esc]",w=>h(w.getAttribute("data-editar-esc"),M)),E(y,"[data-borrar-esc]",w=>A(w.getAttribute("data-borrar-esc"),M)),E(y,"[data-activar-esc]",w=>{const S=w.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:S}),D(`Escenario "${i(S)}" activado`),a(),M()}),E(y,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),D("Volviendo a la realidad base"),a(),M()}),E(y,"[data-toggle-cuenta]",w=>{const S=w.getAttribute("data-toggle-cuenta");e.has(S)?e.delete(S):e.add(S);const C=y.querySelector("#esc-pastillas");C&&(C.innerHTML=m());const j=n(),z=y.querySelector("#esc-comparativa");z&&(z.innerHTML=x(j)),v(y,j)})}return{id:"escenarios",route:"escenarios",nombre:"Escenarios",flagId:"supuestos",seccion:2,iconoPath:xi,mount(y){const M=()=>$(y);$(y),y.dataset.wired!=="1"&&(b(y,M),y.dataset.wired="1")},unmount(){l()}}}const Ii=1e-12,uo=t=>Math.abs(t)<Ii,po=t=>t/12;function Ai(t,a,e,o){if(e<=0)return Math.max(0,Math.ceil(t-a));const s=t-a;if(s<=0)return 0;const n=po(o);if(uo(n))return Math.ceil(s/e);const i=Math.pow(1+n,e),d=(t-a*i)*n/(i-1);return d<=0?0:Math.ceil(d)}function Mi(t,a){const e=po(a);return uo(e)?0:Math.round(t*e)}function wi({rentaNetaMensual:t,tasaRetiroSeguro:a,tipoFiscalEfectivo:e}){if(a<=0)throw new RangeError("La tasa de retiro seguro tiene que ser mayor que cero.");if(e>=1)throw new RangeError("El tipo fiscal efectivo no puede llegar al 100 %.");const o=Math.round(t*12/(1-e));return{retiroBrutoAnual:o,capitalNecesario:Math.round(o/a)}}function mo(t,a){const[e,o]=t.split("-").map(Number),s=e*12+(o-1)+a,n=Math.floor(s/12),i=s%12+1;return`${n}-${String(i).padStart(2,"0")}`}function fo(t,a){const[e,o]=t.split("-").map(Number),[s,n]=a.split("-").map(Number);return(s-e)*12+(n-o)}const vo=t=>Number(t.slice(0,4));function le(t){return t.rentaDeseada?wi(t.rentaDeseada).capitalNecesario:t.importeObjetivo??0}const Si={_id:"__sin_vehiculo__"};function Ci(t){var g,h,A;const a=Math.max(0,Math.floor(t.horizonteMeses)),e=new Map(t.vehiculos.map(b=>[b._id,b])),o=[...t.objetivos].sort((b,y)=>b.prioridad-y.prioridad).map(b=>({def:b,objetivo:le(b),saldo:b.saldoActual,estado:le(b)>0&&b.saldoActual>=le(b)&&b.modoAsignacion!=="ABSORBE_RESIDUAL"?"COMPLETADO":"PENDIENTE",vehiculo:e.get(b.vehiculoId),aportadoEnAño:0,añoEnCurso:vo(t.fechaInicio),ultimaSolicitud:0,solicitadoAcumulado:0,mesesReclamando:0})),s=new Map;for(const b of t.eventos){const y=s.get(b.fecha)??[];y.push(b),s.set(b.fecha,y)}const n=[],i=[],d=[];let u=t.perfil.netoMensual,r=t.perfil.gastosFijosMensuales,x=0,m=0;const l=[];for(let b=0;b<a;b++){const y=mo(t.fechaInicio,b),M=vo(y);for(const T of s.get(y)??[])if(T.tipo==="CAMBIO_INGRESOS")u=T.importe;else if(T.tipo==="CAMBIO_GASTOS_FIJOS")r=T.importe;else if(T.tipo==="NUEVA_DEUDA")r+=T.importe;else if(T.tipo==="INYECCION_CAPITAL"){const L=T.objetivoDestinoId?o.find(B=>B.def._id===T.objetivoDestinoId):void 0;L?L.saldo+=T.importe:u+=T.importe}for(const T of o)T.añoEnCurso!==M&&(T.añoEnCurso=M,T.aportadoEnAño=0);const w=Math.max(0,u-r),S=Math.round(w*Fi(t.pctDisfrute));let C=w-S;const j=C,z=o.filter(T=>T.estado!=="COMPLETADO"),P=[];let _=0;const N=z.filter(T=>T.def.modoAsignacion==="ABSORBE_RESIDUAL"),O=z.filter(T=>T.def.modoAsignacion!=="ABSORBE_RESIDUAL");for(const T of O){const L=zi(T,y,b,t);T.ultimaSolicitud=L,L>0&&(T.solicitadoAcumulado+=L,T.mesesReclamando+=1),(T.def.modoAsignacion==="CUOTA_POR_FECHA"||T.def.modoAsignacion==="FIJO")&&(_+=L);const B=Math.max(0,Math.min(L,C));C-=B,T.saldo+=B,T.aportadoEnAño+=B,x+=B,B>0&&T.estado==="PENDIENTE"&&(T.estado="EN_CURSO"),P.push({objetivoId:T.def._id,asignado:B,solicitado:L,saldoTrasMes:T.saldo})}if(N.length>0&&C>0){const T=N.map(U=>Math.max(0,U.def.pesoResidual??1)),L=T.reduce((U,R)=>U+R,0)||N.length;let B=0;N.forEach((U,R)=>{const k=R===N.length-1?C-B:Math.floor(C*T[R]/L);B+=k,U.saldo+=k,U.aportadoEnAño+=k,x+=k,k>0&&U.estado==="PENDIENTE"&&(U.estado="EN_CURSO"),P.push({objetivoId:U.def._id,asignado:k,solicitado:0,saldoTrasMes:U.saldo})}),C-=B}else for(const T of N)P.push({objetivoId:T.def._id,asignado:0,solicitado:0,saldoTrasMes:T.saldo});_>j&&l.push({mes:y,deficit:_-j});for(const T of o)T.saldo<=0||(T.saldo+=Mi(T.saldo,((g=T.vehiculo)==null?void 0:g.rentabilidadRealAnual)??0));for(const T of o)T.estado!=="COMPLETADO"&&(T.def.modoAsignacion==="ABSORBE_RESIDUAL"&&T.objetivo<=0||T.objetivo>0&&T.saldo>=T.objetivo&&(T.estado="COMPLETADO",i.push({objetivoId:T.def._id,nombre:T.def.nombre,mes:y,indice:b,importeFinal:T.saldo,cuotaLiberada:T.ultimaSolicitud})));for(const T of o)P.some(L=>L.objetivoId===T.def._id)||P.push({objetivoId:T.def._id,asignado:0,solicitado:0,saldoTrasMes:T.saldo});const G=o.reduce((T,L)=>T+L.saldo,0);if(m+=S,n.push({indice:b,mes:y,netoMensual:u,gastosFijos:r,sobrante:w,disfrute:S,disponible:j,sinAsignar:C,asignaciones:P.sort((T,L)=>go(o,T.objetivoId)-go(o,L.objetivoId)),patrimonioTotal:G}),o.length>0&&o.every(T=>T.estado==="COMPLETADO"))break}const p=[];if(l.length>0){const b=Math.round(l.reduce((y,M)=>y+M.deficit,0)/l.length);d.push({severidad:"error",codigo:"INVIABLE",mensaje:`El plan no cabe en el flujo de caja durante ${l.length} mes${l.length!==1?"es":""} (desde ${l[0].mes}). Déficit medio: ${(b/100).toFixed(2)} €/mes.`,mes:l[0].mes,deficitMensual:b});for(const y of o)y.estado!=="COMPLETADO"&&y.def.fechaLimite&&y.def.modoAsignacion==="CUOTA_POR_FECHA"&&(y.estado="INVIABLE");p.push(...Pi(o,t,b))}for(const b of o){const y=(h=b.vehiculo)==null?void 0:h.topeAportacionAnual;y&&b.def.modoAsignacion==="FIJO"&&(b.def.importeFijoMensual??0)*12>y&&d.push({severidad:"atencion",codigo:"TOPE_FISCAL",objetivoId:b.def._id,mensaje:`«${b.def.nombre}» pide ${((b.def.importeFijoMensual??0)/100).toFixed(2)} €/mes, que supera el tope anual de ${(y/100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`})}for(const b of o)b.estado!=="COMPLETADO"&&b.objetivo>0&&b.def.modoAsignacion!=="ABSORBE_RESIDUAL"&&d.push({severidad:"atencion",codigo:"NUNCA_COMPLETADO",objetivoId:b.def._id,mensaje:`«${b.def.nombre}» no se completa dentro del horizonte de ${a} meses.`});const v=o.find(b=>b.def.tipo==="INVERSION_PERPETUA"),$=v?i.find(b=>b.objetivoId===v.def._id):void 0,I={};for(const b of o){const y=((A=b.vehiculo)==null?void 0:A._id)??Si._id;I[y]=(I[y]??0)+b.saldo}const f={};for(const b of o)f[b.def._id]=b.estado;return{viable:l.length===0,mesesSimulados:n.length,serieMensual:n,hitos:i,fases:ji(n,i),avisos:d,propuestas:p,estadoFinal:f,resumen:{patrimonioFinal:o.reduce((b,y)=>b+y.saldo,0),patrimonioPorVehiculo:I,totalAportado:x,totalDisfrute:m,mesIndependencia:($==null?void 0:$.mes)??null}}}const Fi=t=>Number.isFinite(t)?Math.min(1,Math.max(0,t)):0,go=(t,a)=>t.findIndex(e=>e.def._id===a);function zi(t,a,e,o){var n,i;const s=Math.max(0,t.objetivo-t.saldo);switch(t.def.modoAsignacion){case"ABSORBE_TODO":return s;case"FIJO":{const d=t.def.importeFijoMensual??0,u=(n=t.vehiculo)==null?void 0:n.topeAportacionAnual;if(!u)return t.objetivo>0?Math.min(d,s):d;const r=Math.max(0,u-t.aportadoEnAño),x=Math.min(d,r);return t.objetivo>0?Math.min(x,s):x}case"CUOTA_POR_FECHA":{if(s<=0)return 0;const d=t.def.fechaLimite?fo(a,t.def.fechaLimite):o.horizonteMeses-e;return Ai(t.objetivo,t.saldo,Math.max(0,d),((i=t.vehiculo)==null?void 0:i.rentabilidadRealAnual)??0)}default:return 0}}function ji(t,a){if(t.length===0)return[];const o=[0,...[...new Set(a.map(n=>n.indice))].sort((n,i)=>n-i).map(n=>n+1)].filter((n,i,d)=>d.indexOf(n)===i&&n<t.length),s=[];for(let n=0;n<o.length;n++){const i=o[n],d=(n+1<o.length?o[n+1]:t.length)-1;if(d<i)continue;const u=new Set;for(let r=i;r<=d;r++)for(const x of t[r].asignaciones)x.asignado>0&&u.add(x.objetivoId);s.push({desde:t[i].mes,hasta:t[d].mes,meses:d-i+1,objetivosActivos:[...u]})}return s}function Pi(t,a,e){const o=[],s=Math.max(0,a.perfil.netoMensual-a.perfil.gastosFijosMensuales);if(s>0&&a.pctDisfrute>0){const u=Math.ceil(Math.min(a.pctDisfrute,e/s)*100);if(u>0){const r=Math.round(a.pctDisfrute*100);o.push({clase:"REDUCIR_DISFRUTE",magnitud:u,mensaje:`Bajar el disfrute ${u} punto${u!==1?"s":""} (del ${r} % al ${Math.max(0,r-u)} %) libera ${(Math.min(e,s*a.pctDisfrute)/100).toFixed(0)} €/mes.`})}}const n=t.filter(u=>u.def.modoAsignacion==="CUOTA_POR_FECHA"&&u.def.fechaLimite&&u.estado!=="COMPLETADO"),i=u=>u.mesesReclamando>0?u.solicitadoAcumulado/u.mesesReclamando:0,d=[...n].sort((u,r)=>i(r)-i(u))[0];if(d){const u=Math.max(0,d.objetivo-d.saldo),r=i(d),x=Math.max(1,fo(a.fechaInicio,d.def.fechaLimite)),m=Math.max(1,r-e),l=Math.ceil(u/m),p=Math.max(1,l-x);o.push({clase:"RETRASAR_FECHA",objetivoId:d.def._id,magnitud:p,mensaje:`Retrasar «${d.def.nombre}» ${p} mes${p!==1?"es":""}, hasta ${mo(d.def.fechaLimite,p)}, baja su cuota a lo que cabe en el flujo.`});const v=Math.min(Math.round(e*x),Math.max(0,d.objetivo-1));v>0&&o.push({clase:"REDUCIR_IMPORTE",objetivoId:d.def._id,magnitud:v,mensaje:`O reducir «${d.def.nombre}» en ${(v/100).toFixed(0)} €, de ${(d.objetivo/100).toFixed(0)} € a ${((d.objetivo-v)/100).toFixed(0)} €.`})}return n.length>1&&o.push({clase:"REORDENAR",magnitud:n.length,mensaje:`Hay ${n.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`}),o.length===0&&o.push({clase:"REDUCIR_IMPORTE",magnitud:e,mensaje:`Faltan ${(e/100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`}),o}const Ei=()=>globalThis.Chart??null,ce=["#00e5a0","#4d9fff","#a855f7","#f97316","#eab308","#22d3ee","#fb7185","#34d399"],bo=new WeakMap;function _i(t,a,e){const o=Ei();if(!o)return null;const s=bo.get(t);if(s)try{s.destroy()}catch{}const n=new Map,i=new Map(a.objetivos.map(p=>[p._id,p.vehiculoId])),d=new Set(a.objetivos.map(p=>p.vehiculoId));for(const p of d)n.set(p,[]);for(const p of e.serieMensual){const v=new Map;for(const $ of p.asignaciones){const I=i.get($.objetivoId);I&&v.set(I,(v.get(I)??0)+$.saldoTrasMes)}for(const $ of d)n.get($).push((v.get($)??0)/100)}const u=p=>{var v;return((v=a.vehiculos.find($=>$._id===p))==null?void 0:v.nombre)??"Sin vehículo"},r=[...d],x=r.map((p,v)=>e.serieMensual.map(($,I)=>r.slice(0,v+1).reduce((f,g)=>f+(n.get(g)[I]??0),0))),m=r.map((p,v)=>({label:u(p),data:x[v],borderColor:ce[v%ce.length],backgroundColor:`${ce[v%ce.length]}33`,fill:v===0?"origin":"-1",borderWidth:1.5,pointRadius:0,tension:.25})),l=new o(t,{type:"line",data:{labels:e.serieMensual.map(p=>p.mes),datasets:m},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#8b92a8",font:{size:11},boxWidth:12}},tooltip:{backgroundColor:"#13161e",borderColor:"#252a38",borderWidth:1,titleColor:"#8b92a8",bodyColor:"#e8eaf2",callbacks:{label:p=>{const v=p.datasetIndex>0?p.chart.data.datasets[p.datasetIndex-1].data[p.dataIndex]??0:0;return` ${p.dataset.label}: ${F(p.parsed.y-v)}`}}}},scales:{x:{ticks:{color:"#555d77",maxTicksLimit:12},grid:{display:!1}},y:{ticks:{color:"#555d77",callback:p=>F(p)},grid:{color:"#252a38"}}}}});return bo.set(t,l),l}const ke=t=>F(t/100),Ti={CUOTA_POR_FECHA:"Cuota para llegar a la fecha",ABSORBE_TODO:"Se lleva todo lo disponible",ABSORBE_RESIDUAL:"Recibe lo que sobre",FIJO:"Importe fijo al mes"},Di={CUOTA_POR_FECHA:"Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.",ABSORBE_RESIDUAL:"No reclama nada; recoge lo que quede tras servir a los de prioridad superior.",FIJO:"Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene."},ho={COMPLETADO:"var(--accent)",EN_CURSO:"var(--text)",PENDIENTE:"var(--text3)",INVIABLE:"var(--red)"};function Ri(t,a){if(t.objetivos.length===0)return`<div class="card" style="text-align:center;padding:34px 20px">
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
    </div>
    ${e.map(n=>{var i;return Ni(n,a,o,(i=s(n.vehiculoId))==null?void 0:i.nombre)}).join("")}`}function Ni(t,a,e,o){const s=le(t),n=a.estadoFinal[t._id]??t.estado,i=e==null?void 0:e.asignaciones.find(m=>m.objetivoId===t._id),d=(i==null?void 0:i.solicitado)??0,u=a.hitos.find(m=>m.objetivoId===t._id),r=s>0?Math.min(100,t.saldoActual/s*100):0,x=a.avisos.filter(m=>m.objetivoId===t._id);return`
    <div class="card mb-10" style="padding:14px 16px;border-left:3px solid ${ho[n]??"var(--text3)"}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3)">#${c(t.prioridad)}</span>
            <span style="font-weight:700;font-size:14px">${c(t.nombre)}</span>
            <span class="badge" style="font-size:10px;background:var(--bg3);color:var(--text2)">${c(Ti[t.modoAsignacion])}</span>
            ${n==="INVIABLE"?'<span class="badge badge-red" style="font-size:10px">no llega</span>':""}
            ${n==="COMPLETADO"?'<span class="badge badge-green" style="font-size:10px">completado</span>':""}
          </div>
          <div class="text-sm" style="color:var(--text3);margin-top:4px">${c(Di[t.modoAsignacion])}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:17px;font-weight:700">${c(s>0?ke(s):"— sin meta —")}</div>
          ${t.fechaLimite?`<div class="text-sm" style="color:var(--text3)">para ${c(t.fechaLimite)}</div>`:""}
        </div>
      </div>

      ${s>0?`<div class="goal-bar" style="margin-top:10px"><div class="goal-bar-fill" style="width:${r.toFixed(1)}%;background:${ho[n]??"var(--accent)"}"></div></div>`:""}

      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:12px">
        <div><span style="color:var(--text3)">Pide ahora:</span> <strong style="font-family:var(--font-mono)">${c(ke(d))}</strong>/mes</div>
        <div><span style="color:var(--text3)">Ya acumulado:</span> <span style="font-family:var(--font-mono)">${c(ke(t.saldoActual))}</span></div>
        ${o?`<div><span style="color:var(--text3)">Vehículo:</span> ${c(o)}</div>`:""}
        ${u?`<div><span style="color:var(--text3)">Se completa:</span> <strong style="color:var(--accent)">${c(u.mes)}</strong></div>`:""}
      </div>

      ${x.length>0?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${x.map(m=>`⚠ ${c(m.mensaje)}`).join("<br>")}
             </div>`:""}
      ${t.notas?`<div class="text-sm" style="color:var(--text3);margin-top:8px;white-space:pre-wrap">${c(t.notas)}</div>`:""}
    </div>`}const $t=t=>F(t/100);function Oi(t,a){return`
    ${Li(a)}
    ${qi(t,a)}
    <div class="card mb-14">
      <div class="card-title mb-12">Patrimonio por vehículo</div>
      <div class="chart-wrap-lg"><canvas id="pl-chart"></canvas></div>
    </div>
    ${ki(a)}
    ${Bi(t,a)}
    ${Hi(t,a)}`}function Li(t){if(t.avisos.length===0&&t.propuestas.length===0)return"";const a={error:"var(--red)",atencion:"var(--yellow)",info:"var(--text2)"},e=t.avisos.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:5px">
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
  </div>`}function qi(t,a){const e=(s,n,i="")=>`<div class="stat-card">
      <div class="stat-label">${c(s)}</div>
      <div class="stat-value" style="font-size:18px">${c(n)}</div>
      ${i?`<div class="stat-sub">${c(i)}</div>`:""}
    </div>`,o=a.serieMensual[a.serieMensual.length-1];return`<div class="grid-4 mb-14">
    ${e("Patrimonio final",$t(a.resumen.patrimonioFinal),o?`en ${o.mes}`:"")}
    ${e("Total aportado",$t(a.resumen.totalAportado),`${a.mesesSimulados} meses simulados`)}
    ${e("Total a disfrute",$t(a.resumen.totalDisfrute),`${Math.round(t.pctDisfrute*100)} % del sobrante`)}
    ${e("Independencia",a.resumen.mesIndependencia??"—",a.resumen.mesIndependencia?"objetivo perpetuo cubierto":"sin objetivo de independencia")}
  </div>`}function ki(t){return t.hitos.length===0?`<div class="card mb-14"><div class="card-title mb-8">Hitos</div>
      <div class="text-sm" style="color:var(--text3)">Ningún objetivo se completa dentro del horizonte.</div></div>`:`<div class="card mb-14">
    <div class="card-title mb-12">Hitos</div>
    ${t.hitos.map(a=>`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div style="display:flex;align-items:center;gap:9px">
          <span style="font-family:var(--font-mono);color:var(--accent);font-size:11px">${c(a.mes)}</span>
          <span style="font-weight:600">${c(a.nombre)}</span>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono)">${c($t(a.importeFinal))}</div>
          ${a.cuotaLiberada>0?`<div style="font-size:10px;color:var(--text3)">libera ${c($t(a.cuotaLiberada))}/mes</div>`:""}
        </div>
      </div>`).join("")}
  </div>`}function Bi(t,a){if(a.fases.length<=1)return"";const e=o=>{var s;return((s=t.objetivos.find(n=>n._id===o))==null?void 0:s.nombre)??o};return`<div class="card mb-14">
    <div class="card-title mb-12">Fases del plan</div>
    <div class="text-sm mb-10" style="color:var(--text3)">Tramos entre hitos: en cada uno el dinero se reparte de forma distinta.</div>
    ${a.fases.map((o,s)=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);flex-shrink:0;width:26px">${s+1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${c(o.desde)} → ${c(o.hasta)} <span style="color:var(--text3);font-weight:400">(${o.meses} mes${o.meses!==1?"es":""})</span></div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">${c(o.objetivosActivos.map(e).join(" · ")||"sin asignaciones")}</div>
        </div>
      </div>`).join("")}
  </div>`}const Be=60;function Hi(t,a){if(a.serieMensual.length===0)return"";const e=[...t.objetivos].sort((d,u)=>d.prioridad-u.prioridad),o=a.serieMensual.slice(0,Be),s=["Mes","Disponible",...e.map(d=>d.nombre),"Sin asignar","Patrimonio"].map(d=>`<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${c(d)}</th>`).join(""),n=o.map(d=>{const u=e.map(r=>{const x=d.asignaciones.find(l=>l.objetivoId===r._id),m=(x==null?void 0:x.asignado)??0;return`<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${m>0?"var(--text)":"var(--text3)"}">${c(m>0?$t(m):"·")}</td>`}).join("");return`<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${c(d.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${c($t(d.disponible))}</td>
        ${u}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${c(d.sinAsignar>0?$t(d.sinAsignar):"·")}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${c($t(d.patrimonioTotal))}</td>
      </tr>`}).join(""),i=a.serieMensual.length>Be?`<div class="text-sm" style="color:var(--text3);margin-top:8px">Se muestran los primeros ${Be} de ${a.serieMensual.length} meses. Exporta el CSV para verlos todos.</div>`:"";return`<div class="card">
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
  </div>`}function Gi(t,a){const e=[...t.objetivos].sort((i,d)=>i.prioridad-d.prioridad),o=i=>(i/100).toFixed(2).replace(".",","),s=["Mes","Neto","Gastos fijos","Disfrute","Disponible",...e.map(i=>i.nombre),"Sin asignar","Patrimonio"],n=a.serieMensual.map(i=>[i.mes,o(i.netoMensual),o(i.gastosFijos),o(i.disfrute),o(i.disponible),...e.map(d=>{var u;return o(((u=i.asignaciones.find(r=>r.objetivoId===d._id))==null?void 0:u.asignado)??0)}),o(i.sinAsignar),o(i.patrimonioTotal)].join(";"));return[s.join(";"),...n].join(`
`)}const Vi="M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z",yo=t=>{const a=parseFloat(String(t).replace(",","."));return Number.isFinite(a)?Math.round(a*100):0},de=t=>(t/100).toFixed(2);function Ui(t){const a=t.hoy??V;let e="config",o=null;function s(){const p=t.store.get("planes");return p.find(v=>v.activo)??p[0]??null}function n(){const p=s();return p||t.store.addItem("planes",{nombre:"Plan base",fechaInicio:a().slice(0,7),horizonteMeses:480,pctDisfrute:0,activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:[],objetivos:[],eventos:[],creadoEn:a()})}function i(p){var $;const v=s();v&&(t.store.updateItem("planes",v._id,p),o=null,($=t.onDatosCambiados)==null||$.call(t))}function d(){const v=t.store.get("nominas").filter(f=>f.activo).reduce((f,g)=>f+(g.bruto||0),0),$=Math.round(v*.75/12),I=t.store.get("expenses").filter(f=>f.activo&&f.basico&&f.tipo==="gasto").reduce((f,g)=>f+(g.cuantia||0),0);return{neto:Math.round($*100),gastos:Math.round(I*100)}}function u(p){return o||(o=Ci(p)),o}function r(p){const v=d(),$=Math.max(0,p.perfil.netoMensual-p.perfil.gastosFijosMensuales),I=Math.round(p.pctDisfrute*100);return`
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${c(de(p.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${c(F(v.neto/100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${c(de(p.perfil.gastosFijosMensuales))}">
            <div class="text-sm mt-4" style="color:var(--text3)">Según tus gastos básicos: ~${c(F(v.gastos/100))}/mes</div>
          </div>
        </div>

        <div class="form-group mt-8">
          <label class="form-label">Disfrute: <span id="pl-pct-val" style="font-family:var(--font-mono);color:var(--accent)">${I} %</span> del sobrante</label>
          <input type="range" id="pl-disfrute" min="0" max="100" step="1" value="${I}" style="width:100%;accent-color:var(--accent)">
          <div class="text-sm mt-4" style="color:var(--text3)">
            Lo que NO se asigna a objetivos. Con ${c(F(Math.max(0,p.perfil.netoMensual-p.perfil.gastosFijosMensuales)/100))} de sobrante,
            quedan <strong id="pl-disponible">${c(F($*(1-p.pctDisfrute)/100))}</strong>/mes para los objetivos.
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
      </div>`}function m(p){const v=n(),$=u(v),I=(g,h)=>`<button class="period-btn ${e===g?"active":""}" data-pl-tab="${g}">${h}</button>`,f=$.viable?'<span class="badge badge-green">Plan viable</span>':'<span class="badge badge-red">No cabe en el flujo</span>';if(p.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Objetivos <span>financieros</span></h1>
        <div class="page-actions">${f}</div>
      </div>

      <div class="period-selector mb-14">
        ${I("config","Plan")}
        ${I("objetivos",`Objetivos (${v.objetivos.length})`)}
        ${I("simulacion","Simulación")}
      </div>

      <div id="pl-cuerpo">${e==="config"?r(v):e==="objetivos"?Ri(v,$):Oi(v,$)}</div>`,e==="simulacion"){const g=p.querySelector("#pl-chart");g&&_i(g,v,$)}l(p)}function l(p){E(p,"[data-pl-tab]",v=>{e=v.dataset.plTab,m(p)}),W(p,"#pl-disfrute",v=>{const $=Number(v.value)/100,I=p.querySelector("#pl-pct-val");I&&(I.textContent=`${Math.round($*100)} %`);const f=s();if(!f)return;const g=Math.max(0,f.perfil.netoMensual-f.perfil.gastosFijosMensuales)*(1-$),h=p.querySelector("#pl-disponible");h&&(h.textContent=F(g/100))}),E(p,"[data-pl-usar-sugerido]",()=>{const v=d(),$=p.querySelector("#pl-neto"),I=p.querySelector("#pl-gastos");$&&($.value=de(v.neto)),I&&(I.value=de(v.gastos))}),E(p,"[data-pl-guardar]",()=>{const v=$=>{var I;return((I=p.querySelector($))==null?void 0:I.value)??""};i({perfil:{netoMensual:yo(v("#pl-neto")),gastosFijosMensuales:yo(v("#pl-gastos")),manual:!0},pctDisfrute:Math.min(1,Math.max(0,Number(v("#pl-disfrute"))/100)),fechaInicio:v("#pl-inicio")||a().slice(0,7),horizonteMeses:Math.min(600,Math.max(1,Number(v("#pl-horizonte"))||480))}),D("Plan guardado"),m(p)}),E(p,"[data-pl-csv]",()=>{const v=s();if(!v||!o)return;const $=new Blob(["\uFEFF"+Gi(v,o)],{type:"text/csv;charset=utf-8"}),I=URL.createObjectURL($),f=document.createElement("a");f.href=I,f.download=`plan-${v.nombre.replace(/[^\w-]+/g,"_")}-${a()}.csv`,f.click(),URL.revokeObjectURL(I),D(`CSV exportado (${o.serieMensual.length} meses)`)}),E(p,"[data-pl-guardar-notas]",()=>{var v;i({notas:((v=p.querySelector("#pl-notas"))==null?void 0:v.value)??""}),D("Notas guardadas")})}return{id:"planner",route:"planner",nombre:"Objetivos financieros",seccion:2,iconoPath:Vi,mount:m}}function xo(t,a,e=!1){const o=Math.abs(xt(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function Yi(t){function a(h){return`${h}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(h={}){var b;const A=(b=h.texto)==null?void 0:b.trim().toLowerCase();return t.get("transacciones").filter(y=>!(h.cuentaId&&y.cuentaId!==h.cuentaId||h.desde&&y.fecha<h.desde||h.hasta&&y.fecha>h.hasta||h.tipo&&y.tipo!==h.tipo||h.estimacionId&&y.estimacionId!==h.estimacionId||h.tags&&h.tags.length>0&&!h.tags.some(M=>y.tags.includes(M))||A&&!y.concepto.toLowerCase().includes(A))).sort((y,M)=>y.fecha.localeCompare(M.fecha)||y._id.localeCompare(M._id))}function o(h){const A={_id:a("tx"),fecha:h.fecha,cuentaId:h.cuentaId,importeCts:xo(h.tipo,h.importe,h.negativo),concepto:h.concepto,tags:h.tags??[],estimacionId:h.estimacionId??null,tipo:h.tipo,origen:h.origen??"manual",...h.nota?{nota:h.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),A]),A}function s(h,A){t.set("transacciones",t.get("transacciones").map(b=>{if(b._id!==h)return b;const{importe:y,...M}=A,w={...b,...M};return y!==void 0&&(w.importeCts=xo(w.tipo,y,w.importeCts<0)),w}))}function n(h){t.set("transacciones",t.get("transacciones").filter(A=>A._id!==h))}function i(h,A){s(h,{estimacionId:A})}function d(h){return t.get("puntosControl").filter(A=>!h||A.cuentaId===h).sort((A,b)=>A.fecha.localeCompare(b.fecha))}function u(h,A,b,y){const M={_id:a("pc"),fecha:A,cuentaId:h,saldoCts:xt(b),...y?{nota:y}:{}},w=t.get("puntosControl").filter(S=>!(S.cuentaId===h&&S.fecha===A));return t.set("puntosControl",[...w,M].sort((S,C)=>S.fecha.localeCompare(C.fecha))),x(h),M}function r(h){const A=t.get("puntosControl").find(b=>b._id===h);t.set("puntosControl",t.get("puntosControl").filter(b=>b._id!==h)),A&&x(A.cuentaId)}function x(h){const A=d(h),b=t.get("accounts");b.some(y=>y._id===h)&&t.set("accounts",b.map(y=>y._id===h?{...y,historicoSaldos:A.map(M=>({_id:M._id,fecha:M.fecha,saldo:at(M.saldoCts),...M.nota?{nota:M.nota}:{}}))}:y))}function m(h,A=V()){const b=d(h).filter(S=>S.fecha<=A).pop(),y=b==null?void 0:b.fecha,M=(b==null?void 0:b.saldoCts)??0;return t.get("transacciones").filter(S=>S.cuentaId===h&&S.fecha<=A&&(y===void 0||S.fecha>y)).reduce((S,C)=>S+C.importeCts,M)}function l(h,A){return at(m(h,A))}function p(h=V(),A){const b=A??t.get("accounts").filter(y=>y.activo).map(y=>y._id);return at(b.reduce((y,M)=>y+m(M,h),0))}function v(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function $(){const h=[...t.get("transacciones").map(A=>A.fecha),...t.get("puntosControl").map(A=>A.fecha)];return h.length>0?h.sort().pop()??null:null}function I(h={}){return at(e(h).reduce((A,b)=>A+b.importeCts,0))}function f(h={}){const A=new Map;for(const b of e(h)){const y=b.fecha.slice(0,7);A.set(y,(A.get(y)??0)+b.importeCts)}return new Map([...A.entries()].sort(([b],[y])=>b.localeCompare(y)).map(([b,y])=>[b,at(y)]))}function g(h={}){const A=new Map;for(const b of e(h))for(const y of b.tags.length>0?b.tags:["sin_tag"])A.set(y,(A.get(y)??0)+b.importeCts);return new Map([...A.entries()].map(([b,y])=>[b,at(y)]))}return{transacciones:e,registrar:o,actualizar:s,eliminar:n,asignarEstimacion:i,puntosControl:d,registrarPuntoControl:u,eliminarPuntoControl:r,saldoCuenta:l,saldoCuentaCts:m,saldoTotal:p,tieneDatos:v,ultimaFecha:$,total:I,totalPorMes:f,totalPorTag:g}}function ht(t){return t.trim().toLowerCase()}function Wi(t){function a(){const r=new Map,x=(m,l)=>{const p=ht(m);if(!p)return;const v=r.get(p)??{tag:p,estimaciones:0,reales:0,total:0};v[l]+=1,v.total+=1,r.set(p,v)};for(const m of t.get("expenses"))for(const l of m.tags??[])x(l,"estimaciones");for(const m of t.get("transacciones"))for(const l of m.tags??[])x(l,"reales");return[...r.values()].sort((m,l)=>l.total-m.total||m.tag.localeCompare(l.tag))}function e(){return a().map(r=>r.tag)}function o(r){return a().filter(x=>r==="estimaciones"?x.reales===0:x.estimaciones===0).map(x=>x.tag)}function s(r,x,m){const l=ht(x),p=(r??[]).map(ht);if(!p.includes(l))return r??[];const v=p.filter($=>$!==l);return m===null?[...new Set(v)]:[...new Set([...v,ht(m)])]}function n(r,x){const m=ht(x);if(!m)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return u(r,m)}function i(r,x){let m=0;for(const l of r)ht(l)!==ht(x)&&(m+=u(l,ht(x)).cambiados);return{cambiados:m}}function d(r){return u(r,null)}function u(r,x){let m=0;const l=t.get("expenses").map(M=>{const w=s(M.tags,r,x);return w!==M.tags&&(m+=1),w===M.tags?M:{...M,tags:w}});t.set("expenses",l);const p=t.get("transacciones").map(M=>{const w=s(M.tags,r,x);return w!==M.tags&&(m+=1),w===M.tags?M:{...M,tags:w}});t.set("transacciones",p);const v=t.get("loans").map(M=>{const w=s(M.tags,r,x);return w!==M.tags&&(m+=1),w===M.tags?M:{...M,tags:w}});t.set("loans",v);const $=t.get("nominas").map(M=>{const w=s(M.tags,r,x);return w!==M.tags&&(m+=1),w===M.tags?M:{...M,tags:w}});t.set("nominas",$);const I=t.get("config"),f=ht(r),g=M=>{const w=(M??[]).map(ht);if(!w.includes(f))return M??[];const S=w.filter(C=>C!==f);return x===null?[...new Set(S)]:[...new Set([...S,x])]},h={},A=g(I.activeTagsFilter),b=g(I.tagCategorias),y=g(I.tagGrupos);return A!==I.activeTagsFilter&&(h.activeTagsFilter=A),b!==I.tagCategorias&&(h.tagCategorias=b),y!==I.tagGrupos&&(h.tagGrupos=y),Object.keys(h).length>0&&t.patchConfig(h),{cambiados:m}}return{uso:a,todas:e,soloEn:o,renombrar:n,fusionar:i,eliminar:d}}function Ji(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function Ki(t,a){const e=q(t),o=[];for(let s=1;s<=a;s++){const n=new Date(e.getFullYear(),e.getMonth()-s,1);o.push(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Qi(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function Xi(t,a){const{inicio:e,fin:o}=Qi(a);return kt([t],{start:e,end:o}).reduce((n,i)=>n+Math.abs(i.cuantia),0)}function Zi(t){function a(s,n={}){var A;const{mesesHistorial:i=12,mesesMedia:d=3,hoy:u=V()}=n,r=t.transacciones({estimacionId:s._id}),m=r.length===0&&(((A=s.tags)==null?void 0:A.length)??0)>0?t.transacciones({tags:s.tags}):r,l=new Map;for(const b of m){const y=b.fecha.slice(0,7);l.set(y,(l.get(y)??0)+Math.abs(b.importeCts)/100)}const p=[];for(const b of Ki(u,i)){const y=l.get(b);if(y===void 0)continue;const M=ot(Xi(s,b));p.push({mes:b,estimado:M,real:ot(y),desviacion:ot(y-M),precision:Ji(M,y)})}const v=ot(p.reduce((b,y)=>b+y.estimado,0)),$=ot(p.reduce((b,y)=>b+y.real,0)),I=p.reduce((b,y)=>b+Math.abs(y.estimado),0),f=p.length===0?null:I>0?p.reduce((b,y)=>b+y.precision*Math.abs(y.estimado),0)/I:p.reduce((b,y)=>b+y.precision,0)/p.length,g=p.slice(-d),h=g.length>0?ot(g.reduce((b,y)=>b+y.real,0)/g.length):null;return{estimacionId:s._id,concepto:s.concepto,tags:s.tags??[],meses:p,estimadoTotal:v,realTotal:$,desviacionTotal:ot($-v),precision:f,mediaRealReciente:h,infraestimada:$>v}}function e(s,n={}){return s.filter(i=>i.tipo!=="transferencia").map(i=>a(i,n)).sort((i,d)=>i.precision===null&&d.precision===null?i.concepto.localeCompare(d.concepto):i.precision===null?1:d.precision===null?-1:i.precision-d.precision)}function o(s){const n=new Map;for(const i of s)if(i.precision!==null)for(const d of i.tags.length>0?i.tags:["sin_tag"]){const u=n.get(d)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};u.estimado+=i.estimadoTotal,u.real+=i.realTotal,u.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),u.peso+=Math.abs(i.estimadoTotal),u.n+=1,n.set(d,u)}return[...n.entries()].map(([i,d])=>({tag:i,estimadoTotal:ot(d.estimado),realTotal:ot(d.real),desviacionTotal:ot(d.real-d.estimado),precision:d.peso>0?d.pesoPrecision/d.peso:null,estimaciones:d.n})).sort((i,d)=>(i.precision??101)-(d.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}const He="financeapp_session",tr=["local","dropbox","firebase"];function er(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!tr.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function ar({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now()}={}){const o=()=>t??(typeof localStorage<"u"?localStorage:null);function s(l){const p=o();if(p)try{l?p.setItem(He,JSON.stringify(l)):p.removeItem(He)}catch{}}function n(){const l=o();if(!l)return null;try{return er(l.getItem(He))}catch{return null}}function i(){const l=n();return l?(e()-l.ultimoUso)/6e4:null}function d(){const l=a();if(!Number.isFinite(l)||l<=0)return!1;const p=i();return p!==null&&p>=l}function u(){const l=n();return l?d()?(s(null),null):l:null}function r(l){const p=e(),v={modo:l.modo,...l.email?{email:l.email}:{},...l.passphrase?{passphrase:l.passphrase}:{},creadaEn:p,ultimoUso:p};return s(v),v}function x(){const l=n();l&&s({...l,ultimoUso:e()})}function m(){s(null)}return{abrir:r,leer:u,tocar:x,cerrar:m,caducada:d,inactividadMinutos:i,get activa(){return u()!==null}}}const $o=["pointerdown","keydown","visibilitychange"];function or({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:s=clearInterval,target:n=typeof document<"u"?document:void 0}){let i=!0;const d=()=>{i&&t.tocar()};for(const x of $o)n==null||n.addEventListener(x,d);const u=o(()=>{i&&t.caducada()&&(r(),t.cerrar(),a())},e);function r(){if(i){i=!1,s(u);for(const x of $o)n==null||n.removeEventListener(x,d)}}return r}const sr=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}];function Io(){if(typeof localStorage<"u"){const l=Ps();l.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${l.join(", ")}`)}const t=_s({adapter:js()}),{applied:a}=t.load();a.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${a.join(", ")} (esquema v${Vt})`);const e=Ds(t);Xo(l=>e.isEnabled(l));const o=ar({autoLogoutMinutos:()=>{var p,v;const l=(v=(p=globalThis.State)==null?void 0:p.get)==null?void 0:v.call(p,"config");return Number((l==null?void 0:l.autoLogoutMinutos)??t.get("config").autoLogoutMinutos??0)}}),s=Yi(t),n=Wi(t),i=Zi(s),d=Ys(t),u=ks({isEnabled:l=>e.isEnabled(l)}),r=qs({flags:e,rutasExtra:()=>u.flagPorRuta()}),x=Ls({flags:e,onChange:()=>{var l,p;u.attachToShell(),r.apply(),(p=(l=globalThis.Router)==null?void 0:l.rerender)==null||p.call(l)}}),m=()=>{var p,v,$,I,f,g;const l=globalThis;if((v=(p=l.State)==null?void 0:p.load)==null||v.call(p),((I=($=l.Router)==null?void 0:$.current)==null?void 0:I.call($))==="dashboard")try{(g=(f=l.DashboardModule)==null?void 0:f.render)==null||g.call(f)}catch(h){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",h)}};return u.register(mn({store:t,onDatosCambiados:m})),u.register(Mn({store:t,onDatosCambiados:m})),u.register(Hn({store:t,onDatosCambiados:m})),u.register(di({store:t,ledger:s,mostrarObjetivos:()=>e.isEnabled("goals"),onDatosCambiados:m})),u.register(Qs({ledger:s,tags:n,precision:i,adjuster:d,accounts:()=>t.get("accounts"),estimaciones:()=>t.get("expenses"),onDatosCambiados:m})),u.register(Ui({store:t,onDatosCambiados:m})),u.register($i({store:t,onDatosCambiados:m})),u.register(nn({store:t,onDatosCambiados:m})),u.register(bi({store:t})),u.register(Zs({store:t,onDatosCambiados:m})),{version:Vt,core:Lo,engine:{generarExtracto:Bt,recomputarSaldoAcum:Bo,saldoHoy:Ho,sumarPorTags:xa,providers:{proyectarGastos:kt,proyectarPrestamos:ua,proyectarTransferencias:pa,proyectarNominas:ga,proyectarInteresesCuentas:fa,proyectarAportaciones:ma,proyectarRetencionesFiscales:va,proyectarInflacionGastos:ba,proyectarPerdidaAhorro:ha},analysis:Yo,margins:Ko,optimizer:Zo,dashboard:ms},store:t,flags:e,featureRegistry:{all:wt,porGrupo:qa},ui:{openFeatures:x.open,applyGating:r.apply,watchGating:()=>r.observar()},app:u,session:Object.assign(o,{vigilar:l=>or({sesion:o,onCaducada:l}),opciones:sr}),accounting:{ledger:s,tags:n,precision:i,adjuster:d,sugerirAjuste:Ua}}}function nr(){try{const t=Io();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const ue=typeof window<"u"?nr():null;if(ue){let t=!1;const a=()=>{ue.app.attachToShell(),ue.ui.applyGating(),t||(t=!0,ue.ui.watchGating())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",e=>{const o=e.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(a,0)})}return yt.bootstrap=Io,Object.defineProperty(yt,Symbol.toStringTag,{value:"Module"}),yt}({});
//# sourceMappingURL=financeapp-core.js.map

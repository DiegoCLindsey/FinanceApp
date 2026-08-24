var FinanceAppBundle=function($t){"use strict";var ql=Object.defineProperty;var Ll=($t,V,G)=>V in $t?ql($t,V,{enumerable:!0,configurable:!0,writable:!0,value:G}):$t[V]=G;var ts=($t,V,G)=>Ll($t,typeof V!="symbol"?V+"":V,G);function V(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function G(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function J(){return V(new Date)}function Me(t,e){return new Date(t,e+1,0).getDate()}function ca(t,e,a){return V(new Date(t,e,Math.min(a,Me(t,e))))}function ce(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return V(new Date(t,e+1,0));const n=parseInt(o);if(!isNaN(n))return ca(t,e,n)}if(a.startsWith("nthweekday:")){const o=a.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,e+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return V(r)}const i=new Date(t,e,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),V(i)}return null}function da(t,e){if(!e)return t;const a=G(t);return ce(a.getFullYear(),a.getMonth(),e)??t}const es=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],as={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function Se(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${as[a]||a+"º"} ${es[o]} del mes`}return t}function de(t,e){const a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((o-a)/864e5)}function It(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function et(t){return t/100}function W(t){return et(It(t))}function j(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function ua(t){return(t||0).toFixed(2)+"%"}function Tt(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function pa(t,e,a,o=0){const n=Tt(t,e,a),s=t*(1-o/100);let i=e/100/12;for(let r=0;r<200;r++){const u=n*(1-Math.pow(1+i,-a))/i-s,b=n*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),p=i-u/b;if(Math.abs(p-i)<1e-10){i=p;break}i=p}return(Math.pow(1+i,12)-1)*100}function ma(t,e,a,o,n=0,s=[],i={}){const r=[];let l=t;const u=G(o),b=e/100/12;let p=a,d=Tt(l,e,p);const h=[...s].sort((I,A)=>I.fecha.localeCompare(A.fecha));let y=0;for(let I=1;I<=a*2&&l>.01;I++){const A=new Date(u);u.setMonth(u.getMonth()+1);const f=da(V(A),i.diaPago||"");for(;y<h.length&&h[y].fecha<=f;){const $=h[y],v=$.cantidad*(n/100);if(l-=$.cantidad,l=Math.max(0,l),$.tipo==="plazo"?p=Math.ceil(-Math.log(1-l*b/d)/Math.log(1+b)):(p=a-I+1,d=Tt(l,e,p)),r.push({mes:"AMORT",fecha:$.fecha,cuota:0,interes:0,amortizacion:$.cantidad,comisionAmort:v,capitalPendiente:l,esAmortizacion:!0,simulacion:$.simulacion||!1}),y++,l<.01)break}if(l<.01)break;const g=l*b,m=Math.min(d-g,l);if(l-=m,l<.01&&(l=0),r.push({mes:I,fecha:f,cuota:d,interes:g,amortizacion:m,comisionAmort:0,capitalPendiente:l,esAmortizacion:!1,simulacion:!1}),p--,p<=0||l<.01)break}return r}const fa=new Map;function at(t){var A;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((f,g)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${g.fecha}|${g.cantidad}|${g.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=fa.get(a);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:l,comisionApertura:u}=t,b=ma(n,s,i,r,l||0,e,t),p=b.reduce((f,g)=>f+g.interes,0),d=b.reduce((f,g)=>f+g.comisionAmort,0),h=n*((u||0)/100),y=b.filter(f=>!f.esAmortizacion),I={cuota:Tt(n,s,i),totalIntereses:p,tae:pa(n,s,i,u||0),costoTotal:p+d+h,comAp:h,totalComAm:d,fechaFin:((A=y.slice(-1)[0])==null?void 0:A.fecha)||"",mesesReales:y.length,tabla:b};return fa.set(a,I),I}function va(t){const e=at(t),a=at({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,n=a.mesesReales-e.mesesReales,s=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function pt(t,e,a){if(!t||t.length===0)return 1;const o=G(e),n=G(a);if(n<=o)return 1;const s=[...t].sort((l,u)=>l.year-u.year);let i=1,r=new Date(o);for(;r<n;){const l=r.getFullYear(),u=s.filter(I=>I.year<=l),b=u.length>0?u[u.length-1]:s[0],p=(b?b.tasa:0)/100,d=new Date(l+1,0,1),h=d<n?d:n,y=de(r,h);i*=Math.pow(1+p,y/365.25),r=h}return i}function ga(t,e,a,o=0){const n=G(e),s=G(a);if(s<=n)return o;const i=de(n,s),r=t?[...t].sort((b,p)=>b.year-p.year):[];let l=0,u=new Date(n);for(;u<s;){const b=u.getFullYear(),p=new Date(b+1,0,1),d=p<s?p:s,h=de(u,d),y=r.filter(f=>f.year<=b),I=y.length>0?y[y.length-1]:null,A=I!==null?I.tasa:o;l+=A*h,u=d}return i>0?l/i:o}function ba(t,e){return((1+t/100)/(1+e/100)-1)*100}function os(t,e,a,o){const n=pt(e,a,o);return n>0?t/n:t}function ss(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,n=e.saludUmbralDTIVerde??30,s=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],r=e.saludExcluirHipoteca||!1,{ingresos:l=0,cuotas:u=0,cuotasHipoteca:b=0,gastosBasicos:p=0,gastosOtros:d=0,amortizaciones:h=0}=t,y=l-u-h-p-d,I=y,A=l>0?I/l*100:null,f=r?u-b:u,g=l>0?f/l*100:null,m=l>0?u/l*100:null,$=l>0?(p+u+h)/l*100:null,v=l>0?d/l*100:null,x=(S,C,z)=>S===null?"neutral":S>=C?"verde":S>=z?"amarillo":"rojo",M=(S,C,z)=>S===null?"neutral":S<=C?"verde":S<=z?"amarillo":"rojo";return{ingresos:l,cuotas:u,cuotasHipoteca:b,gastosBasicos:p,gastosOtros:d,amortizaciones:h,ahorroBruto:y,ahorroReal:I,tasaAhorro:A,dti:g,dtiTotal:m,excluyeHipoteca:r,pctNecesidades:$,pctDeseos:v,semAhorro:x(A,a,o),semDTI:M(g,n,s),semNecesidades:M($,i[0],i[0]+15),semDeseos:M(v,i[1],i[1]+10),semAhorroRegla:x(A,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function mt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function rt(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function Vt(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];a&&o.push({fecha:a,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,i)=>{s.fecha>=a&&o.push({...s,prioridad:i})}),o.sort((s,i)=>i.fecha.localeCompare(s.fecha)||i.prioridad-s.prioridad);const n=o.find(s=>s.fecha<=e);return n?n.saldo:t.saldoInicial||0}else{const n=[...t.historicoSaldos||[]].sort((s,i)=>i.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=e);return n?n.saldo:0}}function we(t,e){const a=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return a?e.filter(o=>a.includes(o._id)):e.filter(o=>o.activo&&!o.simulacion)}function ha(t,e,a=0){const o=we(t,e).reduce((n,s)=>n+rt(s),0);return t.usarColchon!==!1?Math.max(0,o-a):o}function ns(t,e,a){if(!t.targetAmount||t.targetAmount<=0)return null;const o=we(t,e);if(o.length===0)return null;const n=a.hoy??new Date,s=a.horizonteMeses??120,i=t.usarColchon!==!1,r=o.map(l=>({acc:l,eventos:a.extractoCuenta(l),cursor:0,saldo:rt(l)}));for(let l=1;l<=s;l++){const u=new Date(n.getFullYear(),n.getMonth()+l,1),b=`${u.getFullYear()}-${String(u.getMonth()+1).padStart(2,"0")}`,p=V(new Date(u.getFullYear(),u.getMonth()+1,0));let d=0;for(const y of r){for(;y.cursor<y.eventos.length&&y.eventos[y.cursor].fecha<=p;)y.saldo=y.eventos[y.cursor].saldoAcum??y.saldo,y.cursor++;d+=y.saldo}const h=i?a.colchonEnFecha(p):0;if(d-h>=t.targetAmount)return b}return null}function ya(t,e){const a=t.escenarioIds||[];return a.length===0?!0:!!e&&a.includes(e)}function xa(t,e){const a=o=>ya(o,e);return{loans:t.loans.filter(a).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}const Ce=t=>t.slice(0,7);function is(t){const[e,a]=t.split("-").map(Number);return`${a===12?e+1:e}-${String(a===12?1:a+1).padStart(2,"0")}`}function je(t,e,a){if(t.length===0)return[];const o=new Map;for(const u of t)u.saldoAcum!==void 0&&o.set(Ce(u.fecha),u.saldoAcum);const n=t[0];let s=(n.saldoAcum??0)-(n.delta??0);const i=Ce(e||n.fecha),r=Ce(a||t[t.length-1].fecha);if(r<i)return[];const l=[];for(let u=i;u<=r;u=is(u)){const b=o.get(u);b!==void 0&&(s=b);const[p,d]=u.split("-").map(Number);l.push({x:G(V(new Date(p,d-1,15))).getTime(),mes:u,y:s})}return l}function ze(t,e){let a=null;for(const o of t){if(o.fecha>e)break;o.saldoAcum!==void 0&&(a=o.saldoAcum)}return a}function rs(t){const e=a=>!a.simulacion;return{loans:t.loans.filter(e).map(a=>({...a,amortizaciones:(a.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}function ls(t){const e=a=>!!a.simulacion;return t.loans.some(a=>e(a)||(a.amortizaciones||[]).some(e))||t.expenses.some(e)||t.nominas.some(e)||t.accounts.some(e)}const gt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ut(t,e){const a=[...e].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=a.length-1;s>=0;s--){const[i,r]=a[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function Ee(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,n=Math.min(2e3,a),s=Math.max(0,a-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function Mt(t,e){return Ee(t,e).baseImponible}function $a(t,e){return ut(t,e)/12}const jt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Fe(t,e){if(!t||t<=0)return 0;const a=e||jt;let o=0,n=t;for(let s=0;s<a.length;s++){const[i,r]=a[s],l=s<a.length-1?a[s+1][0]:1/0,u=Math.min(n,l-i);if(!(u<=0)&&(o+=u*(r/100),n-=u,n<=0))break}return o}function Rt(t,e){if(mt(t)!=="inversion")return null;const a=rt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,a-o),s=Fe(n,e);return{saldo:a,costBase:o,plusvalia:n,impuesto:s,neto:a-s}}function ue(t,e=new Date){var d;if(mt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=rt(t),n=V(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),s=[...t.aportaciones||[]].sort((h,y)=>h.fecha.localeCompare(y.fecha));let i=0;const r=s.reduce((h,y)=>h+y.cantidad,0);for(const h of s)h.fecha<=n&&(i+=h.cantidad);const l=Math.max(0,o-r),u=r>0?i/r:0,b=Math.min(o,i+l*u),p=Math.max(0,o-b);return{saldo:o,disponible:b,bloqueado:p,costBase:r,beneficio:l,numAportaciones:s.length,proxDesbloqueo:((d=s.find(h=>h.fecha>n))==null?void 0:d.fecha)||null}}function Ia(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(mt(t)!=="pension"||!o)return 0;const n=rt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((u,b)=>u+b.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(e*r*o/100).toFixed(2)}function _e(t,e,a){var l;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(e||[]).filter(u=>(u.grupoNomina||"")===o&&u.activo!==!1).reduce((u,b)=>u+(b.bruto||0)*(b.nPagas||12),0),i=[...a||[]].sort((u,b)=>u[0]-b[0]);let r=((l=i[0])==null?void 0:l[1])||19;for(const[u,b]of i)if(s>=u)r=b;else break;return r}const Pe=6.35;function zt(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function Aa(t){return Math.max(0,(t.bruto||0)-zt(t))}function cs(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function ds(t){const e=t.reduce((i,r)=>i+(r.bruto||0),0),a=t.reduce((i,r)=>i+zt(r),0),o=Math.max(0,e-a),n=Mt(e,a),s=new Map;for(const i of t)s.set(i._id,o>0?n*(Aa(i)/o):0);return s}function De(t,e,a){if(t.irpfModo==="manual")return Aa(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return ut(Mt(t.bruto||0,zt(t)),a);const o=cs(e.filter(i=>i.irpfModo!=="manual")),n=ds(e);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return ut(s+r,a)-ut(s,a);s+=r}return ut(Mt(t.bruto||0,zt(t)),a)}function us(t,e){return t.reduce((a,o)=>a+De(o,t,e),0)}function ps(t,e){var n;const a=[...e||[]].sort((s,i)=>s[0]-i[0]);let o=((n=a[0])==null?void 0:n[1])??19;for(const[s,i]of a)if(t>=s)o=i;else break;return o}function Ma(t,e){if(!t||t.length===0)return 0;const a=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+zt(s),0);return ps(Mt(a,o),e)}function Te(t,e,a){const o=t.bruto||0,n=zt(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??Pe,l=s*(r/100),u=De(t,e,a);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:l,irpfAnual:u,irpfPct:s>0?u/s*100:0,netoPorPaga:(s-l-u)/i}}function ms(t){const e=new Map,a=[];for(const o of t){const n=o.grupoNomina||"";if(!n){a.push(o);continue}const s=e.get(n)??[];s.push(o),e.set(n,s)}return{grupos:e,sueltas:a}}const Et=1500;function Sa(t){const e=t.cuantia||0,a=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?e*12/a:t.tipoFrecuencia==="diaria"?e*365.25/a:e}const Ut=t=>{const e=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(e)?e:0};function fs(t,e){const a=t.grupoNomina||"";return a?e.filter(o=>(o.grupoNomina||"")===a):null}function wa(t,e){return t.reduce((a,o)=>a+De(o,fs(o,t),e),0)}function Ca(t){const{nominas:e,tramosGeneral:a,tramosAhorro:o}=t,n=t.extras??{},s=e.reduce((S,C)=>S+(C.bruto||0),0),i=e.reduce((S,C)=>S+zt(C),0),r=Ee(s,i),l=t.aportacionesPension,u=Et,b=Math.min(l,u),p=Math.max(0,r.RNT-r.reducArt20-b),d=Ut(n.capInmobiliario),h=Ut(n.capMobiliario),y=Ut(n.gananciasFondos),I=Ut(n.otrasCorto),A=Ut(n.retCapital),f=Math.max(0,p+t.otrosIngresos+d+I),g=Math.max(0,h+y),m=ut(f,a),$=ut(g,o),v=m+$,x=wa(e,a),M=x+A;return{brutoTotal:s,flexTotal:i,brutoIRPF:r.baseIRPF,cotizSS:r.cotizSS,gastosArt19:r.gastosArt19,RNT:r.RNT,reducArt20:r.reducArt20,aportPP:l,limPP:u,deducPP:b,RNTred:p,otrosIngresos:t.otrosIngresos,capInmobiliario:d,capMobiliario:h,gananciasFondos:y,otrasCorto:I,baseGeneral:f,baseAhorro:g,cuotaGen:m,cuotaAho:$,cuotaIntegra:v,retNomina:x,retCapital:A,totalRet:M,resultado:v-M}}const vs=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:Et,TRAMOS_AHORRO_DEFAULT:jt,TRAMOS_IRPF_DEFAULT:gt,ajustarFechaPago:da,ajustarPrecioReal:os,calcBaseImponibleTrabajo:Mt,calcFactorInflacion:pt,calcFondoInversion:Rt,calcFondosPension:ue,calcGananciasCapital:Fe,calcIRPF:ut,calcImpuestoPension:Ia,calcInflacionMediaAnual:ga,calcSaludFinanciera:ss,calcTAE:pa,calcTipoMarginalPension:_e,calcTipoRealFisher:ba,calcularDeclaracion:Ca,clampedDate:ca,cuentasDelObjetivo:we,cuotaMensual:Tt,desgloseBaseTrabajo:Ee,diasEntre:de,filtrarPorEscenario:xa,formatEUR:j,formatLocalDate:V,formatPct:ua,fromCents:et,haySimulaciones:ls,ingresoAnual:Sa,labelDiaPago:Se,lastDayOfMonth:Me,modeloFondoDe:mt,parseLocalDate:G,proyectarFechaCumplimiento:ns,resolverDiaEfectivo:ce,resumenPrestamo:at,resumenPrestamoConAhorro:va,retencionMensual:$a,retencionesNomina:wa,roundMoney:W,saldoEnFecha:Vt,saldoEnFechaExtracto:ze,saldoParaObjetivo:ha,saldoRealCuenta:rt,serieMensual:je,sinSimulaciones:rs,tablaAmortizacion:ma,toCents:It,todayISO:J,visibleEnEscenario:ya},Symbol.toStringTag,{value:"Module"}));function Yt(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const r=G(i.fechaInicio||e.start),l=i.fechaFin?G(i.fechaFin):s,u=i.cuantia,b=p=>o.push({fecha:p,concepto:i.concepto,cuantia:u,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=l&&b(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const p=Math.max(1,i.frecuencia||1);let d=r.getFullYear(),h=r.getMonth();const y=Math.ceil(240/p)+2;for(let I=0;I<y;I++){const A=ce(d,h,i.diaPago||"")||(()=>{const g=r.getDate(),m=new Date(d,h+1,0).getDate();return V(new Date(d,h,Math.min(g,m)))})(),f=G(A);if(f>s||f>l)break;f>=n&&f>=r&&b(A),h+=p,h>=12&&(d+=Math.floor(h/12),h=h%12)}}else if(i.tipoFrecuencia==="diaria"){const p=Math.max(1,i.frecuencia||1)*864e5;let d=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const h=Math.ceil((n.getTime()-r.getTime())/p);d=new Date(r.getTime()+h*p)}for(;d<=s&&d<=l;)b(V(d)),d=new Date(d.getTime()+p)}}return o}function ja(t,e,a=null){const o=[];for(const n of t){if(!n.activo||a&&a.length>0&&!a.includes(n.cuenta||"default"))continue;const{tabla:s}=at(n);for(const i of s)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function za(t,e,a=null,o={accounts:[]}){const n=[],s=G(e.start),i=G(e.end),r=o.accounts||[],l=o.nominas||[],u=o.resolverTramosIRPF||(()=>gt),b=o.resolverTramosGanancias||(()=>jt),p=d=>{var h;return((h=r.find(y=>y._id===d))==null?void 0:h.nombre)??d};for(const d of t){if(!d.activo||d.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(d.cuenta||"default")||a.includes(d.cuentaDestino||"default")))continue;const h=G(d.fechaInicio||e.start),y=d.fechaFin?G(d.fechaFin):i,I=A=>{const f=r.find(E=>E._id===(d.cuenta||"default")),g=r.find(E=>E._id===(d.cuentaDestino||"default")),m=mt(f),$=mt(g),v=m==="inversion"&&$==="inversion"||m==="pension"&&$==="pension",x=["transferencia",...v?["traspaso"]:[],...d.tags||[]],M=v?"traspaso-out":"transfer-out",S=v?"traspaso-in":"transfer-in",C=!a||a.length===0||a.includes(d.cuenta||"default"),z=!a||a.length===0||a.includes(d.cuentaDestino||"default");if(C&&n.push({fecha:A,concepto:`Transf. → ${p(d.cuentaDestino||"default")}: ${d.concepto}`,cuantia:d.cuantia,tipo:"gasto",tags:x,cuenta:d.cuenta||"default",sourceId:d._id,sourceType:M}),z&&n.push({fecha:A,concepto:`Transf. ← ${p(d.cuenta||"default")}: ${d.concepto}`,cuantia:d.cuantia,tipo:"ingreso",tags:x,cuenta:d.cuentaDestino||"default",sourceId:d._id,sourceType:S}),C&&!v&&f){if(m==="inversion"){const E=parseInt(A.slice(0,4)),F=Rt(f,b(E));if(F&&F.saldo>0&&F.plusvalia>0){const w=Math.min(1,d.cuantia/F.saldo),D=F.plusvalia*w*.19;D>.01&&n.push({fecha:A,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:D,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:d.cuenta||"default",sourceId:d._id,sourceType:"investment-tax"})}}else if(m==="pension"){const E=u(parseInt(A.slice(0,4))),F=_e(f,l,E),w=Ia(f,d.cuantia,F||void 0);if(w>0){const P=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${F}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;n.push({fecha:A,concepto:P,cuantia:w,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:d.cuenta||"default",sourceId:d._id,sourceType:"pension-tax"})}}}};if(d.tipoFrecuencia==="extraordinario")h>=s&&h<=i&&h<=y&&I(d.fechaInicio);else if(d.tipoFrecuencia==="mensual"){const A=Math.max(1,d.frecuencia||1);let f=h.getFullYear(),g=h.getMonth();const m=Math.ceil(240/A)+2;for(let $=0;$<m;$++){const v=ce(f,g,d.diaPago||"")||(()=>{const M=h.getDate(),S=new Date(f,g+1,0).getDate();return V(new Date(f,g,Math.min(M,S)))})(),x=G(v);if(x>i||x>y)break;x>=s&&x>=h&&I(v),g+=A,g>=12&&(f+=Math.floor(g/12),g=g%12)}}else if(d.tipoFrecuencia==="diaria"){const A=Math.max(1,d.frecuencia||1)*864e5;let f=new Date(Math.max(h.getTime(),s.getTime()));if(h<s){const g=Math.ceil((s.getTime()-h.getTime())/A);f=new Date(h.getTime()+g*A)}for(;f<=i&&f<=y;)I(V(f)),f=new Date(f.getTime()+A)}}return n}function Ea(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){const r=mt(i);if(r==="cuenta"||!i.activo)continue;const l=i.planAportaciones||[];for(const u of l){if(!u.importe||u.importe<=0)continue;const b=G(u.fechaInicio||e.start),p=u.fechaFin?G(u.fechaFin):s,d=u.cuentaOrigen||"default",h=!a||!a.length||a.includes(d),y=!a||!a.length||a.includes(i._id),I=r==="pension"?"pension":"capital-mobiliario",A=v=>{h&&o.push({fecha:v,concepto:`Aportación → ${i.nombre}`,cuantia:u.importe,tipo:"gasto",tags:["aportacion","transferencia",I],cuenta:d,sourceId:u._id,sourceType:"aportacion-out"}),y&&o.push({fecha:v,concepto:`Aportación ${i.nombre} (${u.periodicidad||"mensual"})`,cuantia:u.importe,tipo:"ingreso",tags:["aportacion","transferencia",I],cuenta:i._id,sourceId:u._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[u.periodicidad||"mensual"]||1;let g=b.getFullYear(),m=b.getMonth();const $=Math.ceil(240/f)+2;for(let v=0;v<$;v++){const x=new Date(g,m+1,0).getDate(),M=V(new Date(g,m,Math.min(b.getDate(),x))),S=G(M);if(S>s||S>p)break;S>=n&&S>=b&&A(M),m+=f,m>=12&&(g+=Math.floor(m/12),m=m%12)}}}return o}function Fa(t,e,a=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||a&&a.length>0&&!a.includes(s._id))continue;const i=G(e.start),r=G(e.end),l=s.periodoCobro||"mensual",u=l==="mensual",b=u?null:{diario:864e5,semanal:7*864e5}[l]||864e5,p=u?1/12:b/(365.25*864e5);let d=Vt(s,e.start);const h=o.filter(A=>A.cuenta===s._id).map(A=>({fecha:A.fecha,delta:A.tipo==="ingreso"?Math.abs(A.cuantia):-Math.abs(A.cuantia)})).sort((A,f)=>A.fecha.localeCompare(f.fecha));let y=0,I=new Date(i);for(;I<=r;){const A=u?new Date(I.getFullYear(),I.getMonth()+1,I.getDate()):new Date(I.getTime()+b),f=new Date(Math.min(A.getTime(),r.getTime()+1)),g=V(f);let m=0;for(;y<h.length&&h[y].fecha<g;)m+=h[y].delta,y++;const $=d,v=d+m,x=Math.max(0,($+v)/2);d=v;const M=u?p:(f.getTime()-I.getTime())/(365.25*864e5),S=x*(Math.pow(1+s.interes/100,M)-1);S>.001&&n.push({fecha:V(I),concepto:`Interés ${s.nombre}`,cuantia:S,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),I=A}}return n}function _a(t,e,a,o=null){const n=[],s=e||gt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),l=$a(r,s),u={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:l,tags:["irpf","fiscal"]};n.push(...Yt([u],a,o))}return n}const gs=[5,11,2,8],bs={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function Pa(t,e,a=null,o=[],n=()=>gt){const s=[],i=G(e.start),r=G(e.end),l=o.length>0,u={};for(const d of t){const h=d.grupoNomina||"";u[h]||(u[h]=[]),u[h].push(d)}for(const d of Object.keys(u))u[d].sort((h,y)=>(y.bruto||0)-(h.bruto||0));function b(d,h){if(!l||!d.mesActualizacionIPC)return d.bruto||0;const y=d.fechaInicio||e.start,I=G(y),A=G(h);let f=0;for(let m=I.getFullYear();m<=A.getFullYear();m++){const $=new Date(m,d.mesActualizacionIPC-1,1);$>I&&$<=A&&f++}if(f===0)return d.bruto||0;const g=V(new Date(I.getFullYear()+f,0,1));return(d.bruto||0)*pt(o,y,g)}function p(d,h){const y=b(d,h),I=(d.retribucionFlexible||[]).reduce((E,F)=>E+(F.importe||0)*12,0),A=Math.max(0,y-I);if(d.irpfModo==="manual")return A*((d.irpfPct||0)/100);const f=n(parseInt(h.slice(0,4))),g=d.grupoNomina||"";if(!g)return ut(Mt(y,I),f);const m=u[g].filter(E=>E.activo),$=m.reduce((E,F)=>E+b(F,h),0),v=m.reduce((E,F)=>E+(F.retribucionFlexible||[]).reduce((w,P)=>w+(P.importe||0)*12,0),0),x=Math.max(0,$-v),M=Mt($,v),S=Math.max(0,y-I),C=x>0?M*(S/x):0,z=m.filter(E=>E._id!==d._id&&(E.bruto||0)>(d.bruto||0)).reduce((E,F)=>{const w=(F.retribucionFlexible||[]).reduce((D,R)=>D+(R.importe||0)*12,0),P=Math.max(0,b(F,h)-w);return E+(x>0?M*(P/x):0)},0);return ut(z+C,f)-ut(z,f)}for(const d of t){if(!d.activo)continue;const h=d.cuenta||"default";if(a&&a.length>0&&!a.includes(h))continue;const y=Math.max(1,d.nPagas||12),I=G(d.fechaInicio||e.start),A=d.fechaFin?G(d.fechaFin):r,f=g=>{const m=b(d,g),$=p(d,g),v=(d.retribucionFlexible||[]).reduce((w,P)=>w+(P.importe||0)*12,0),x=Math.max(0,m-v),M=(d.ssPct??6.35)/100,S=x*M,C=x/y,z=$/y,E=S/y,F=d.representacion==="simplificado"?C-E-z:C;s.push({fecha:g,concepto:d.nombre,cuantia:F,tipo:"ingreso",cuenta:h,tags:d.tags||[],sourceId:d._id,sourceType:"nomina"}),d.representacion==="detallado"&&(E>0&&s.push({fecha:g,concepto:`SS ${d.nombre}`,cuantia:E,tipo:"gasto",cuenta:h,tags:["seguridad-social","fiscal"],sourceId:d._id+"_ss",sourceType:"nomina"}),z>0&&s.push({fecha:g,concepto:`IRPF ${d.nombre}`,cuantia:z,tipo:"gasto",cuenta:h,tags:["irpf","fiscal"],sourceId:d._id+"_irpf",sourceType:"nomina"}));for(const w of d.retribucionFlexible||[])!w.cuenta||!(w.importe>0)||a&&a.length>0&&!a.includes(w.cuenta)||s.push({fecha:g,concepto:`${d.nombre} — ${bs[w.tipo]||w.tipo}`,cuantia:w.importe,tipo:"ingreso",cuenta:w.cuenta,tags:["retribucion-flexible",w.tipo],sourceId:`${d._id}_flex_${w._id||w.tipo}`,sourceType:"nomina"})};if(y<=12){const g=y===12?1:Math.round(12/y),m=I.getDate();let $=I.getFullYear(),v=I.getMonth();for(let x=0;x<300;x++){const M=new Date($,v+1,0).getDate(),S=new Date($,v,Math.min(m,M));if(S>r||S>A)break;S>=i&&S>=I&&f(V(S)),v+=g,v>=12&&($+=Math.floor(v/12),v=v%12)}}else{const g=y-12,m=I.getDate();let $=I.getFullYear(),v=I.getMonth();for(let S=0;S<300;S++){const C=new Date($,v+1,0).getDate(),z=new Date($,v,Math.min(m,C));if(z>r||z>A)break;z>=i&&z>=I&&f(V(z)),v++,v>=12&&($++,v=0)}const x=Math.max(I.getFullYear(),i.getFullYear()),M=Math.min((d.fechaFin?A:r).getFullYear(),r.getFullYear());for(let S=x;S<=M;S++)for(const C of gs.slice(0,g)){const z=new Date(S,C,15);z>=i&&z<=r&&z>=I&&z<=A&&f(V(z))}}}return s}function Da(t,e,a,o=null,n="default"){const s=[];if(!e||e.length===0)return s;const i=G(a.start),r=G(a.end),l=J(),u=t.filter(p=>p.activo&&p.tipo==="gasto"&&p.tipoFrecuencia==="mensual");let b=new Date(i.getFullYear(),i.getMonth(),1);for(;b<=r;){const p=b.getFullYear(),d=b.getMonth(),h=p+"-"+String(d+1).padStart(2,"0"),y=h+"-01",I=V(new Date(p,d+1,0)),A=V(new Date(p,d,15));let f=0;for(const g of u){if(o&&o.length>0&&!o.includes(g.cuenta||"default")||g.fechaInicio&&g.fechaInicio>I||g.fechaFin&&g.fechaFin<y)continue;const m=g.fechaInicio||l,$=pt(e,m,A);if($<=1)continue;const v=Math.max(1,g.frecuencia||1);f+=g.cuantia*($-1)/v}f>.01&&s.push({fecha:A,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+h,sourceType:"inflacion"}),b=new Date(p,d+1,1)}return s}function Ta(t,e,a,o="default"){const n=[];if(!e||e.length===0||t<=0)return n;const s=G(a.start),i=G(a.end),r=[...e].sort((u,b)=>u.year-b.year);let l=new Date(s.getFullYear(),s.getMonth(),1);for(;l<=i;){const u=l.getFullYear(),b=l.getMonth(),p=u+"-"+String(b+1).padStart(2,"0"),d=V(new Date(u,b,15)),h=r.filter(g=>g.year<=u),y=h.length>0?h[h.length-1]:r[0],I=y?y.tasa/100:0,A=Math.pow(1+I,1/12)-1,f=t*A;f>.01&&n.push({fecha:d,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+p,sourceType:"inflacion"}),l=new Date(u,b+1,1)}return n}function Ra(t,e,a){const o=a.fechaReferencia||a.dashboardStart,n=o<a.dashboardStart?a.dashboardStart:o>a.dashboardEnd?a.dashboardEnd:o,s=e.reduce((p,d)=>p+Vt(d,n),0),i=t.filter(p=>p.fecha<n),r=t.filter(p=>p.fecha>=n),l=[];let u=s;for(const p of[...i].reverse()){const d=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);l.unshift({...p,delta:d,saldoAcum:u}),u-=d}const b=[];u=s;for(const p of r){const d=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);u+=d,b.push({...p,delta:d,saldoAcum:u})}return[...l,...b]}function hs(t,e,a,o=null){const n=e.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return Ra([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,a)}function Jt(t){const{loans:e,expenses:a,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],l={start:n.dashboardStart,end:n.dashboardEnd},u=a.filter(I=>I.tipo!=="transferencia"),b=a.filter(I=>I.tipo==="transferencia"),p={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let d=[];d=d.concat(Yt(u,l,s)),d=d.concat(ja(e,l,s)),d=d.concat(za(b,l,s,p)),d=d.concat(Ea(o,l,s));const h=Fa(o,l,s,d);if(d=d.concat(h),d=d.concat(_a(a,n.tramos_irpf,l,s)),d=d.concat(Pa(i,l,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const I=(o.find(g=>g.activo&&g.esCuentaPrincipal)||o.find(g=>g.activo)||{_id:"default"})._id;d=d.concat(Da(u,r,l,s,I));const f=o.filter(g=>g.activo&&(!s||s.length===0||s.includes(g._id))).reduce((g,m)=>g+Vt(m,n.dashboardStart),0);d=d.concat(Ta(f,r,l,I))}d.sort((I,A)=>I.fecha.localeCompare(A.fecha));const y=o.filter(I=>I.activo&&(!s||s.length===0||s.includes(I._id)));return Ra(d,y,n)}function ys(t,e,a=null){const o=J(),s=e.filter(r=>r.activo&&(!a||a.length===0||a.includes(r._id))).reduce((r,l)=>r+rt(l),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function Na(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])a.set(n,(a.get(n)||0)+Math.abs(o.cuantia));return a}function xs(t,e){const a=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${j(i)}) a partir del ${s.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${j(i)} < ${j(e)}) desde ${s.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${j(i)})`})))}return a}function $s(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=G(e.dashboardStart),n=G(e.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return a/s}function Is(t,e,a=J()){const o=new Set,n=e.map(r=>{const l=r.fechaInicialSaldo||"",u={};l&&l<=a&&(u[l]=r.saldoInicial||0);for(const b of r.historicoSaldos||[])b.fecha<=a&&(!l||b.fecha>=l)&&(u[b.fecha]=b.saldo);return Object.keys(u).forEach(b=>o.add(b)),u}),s={};for(const r of[...o].sort()){let l=0;for(let u=0;u<e.length;u++){const b=Object.entries(n[u]).filter(([p])=>p<=r);b.length>0?(b.sort(([p],[d])=>d.localeCompare(p)),l+=b[0][1]):l+=e[u].saldoInicial||0}s[r]=l}const i=[];for(const[r,l]of Object.entries(s).sort(([u],[b])=>u.localeCompare(b))){const u=t.filter(h=>h.fecha<=r),b=u.length>0?u[u.length-1].saldoAcum:null;if(b===null)continue;const p=l-b,d=b!==0?p/Math.abs(b)*100:0;i.push({cuenta:"Total",fecha:r,estimado:b,real:l,desv:p,pct:d})}return i}const As=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:Is,detectarPuntosCriticos:xs,mediaMensualGastos:$s},Symbol.toStringTag,{value:"Module"}));function Wt(t,e=new Date){const a=V(e),o=new Date(e);o.setMonth(o.getMonth()+1);const n=V(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Yt(s,{start:a,end:n}).reduce((r,l)=>r+Math.abs(l.cuantia),0)}function Re(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+Tt(a.capital,a.tin,a.meses),0)}function Oa(t,e,a,o){return e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0?e.colchonFijo:(Wt(t,o)+Re(a))*(e.colchonMeses||6)}function qa(t,e,a,o,n){const i=[...e.colchonPuntos||[]].sort((l,u)=>l.fecha.localeCompare(u.fecha)).filter(l=>l.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(Wt(t,n)+Re(a))*(i.meses||6):Oa(t,e,a,n)}function pe(t,e,a,o,n,s=!1,i){const r=[...t.puntos||[]].sort((b,p)=>b.fecha.localeCompare(p.fecha)),l=r.filter(b=>b.fecha<=n).pop()||(s?r[0]:null);return l?l.tipo==="fijo"?l.importe||0:(Wt(e,i)+Re(o))*(l.meses||1):0}function Ms(t,e){const a={};for(const o of e)a[o._id]=rt(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=o.cuantia),{fecha:o.fecha,saldos:{...a}}))}function Ss(t,e,a,o,n,s,i){const r=[];for(const l of(t||[]).filter(u=>u.activo!==!1)){let u=!1;for(let b=0;b<e.length;b++){const p=e[b],d=pe(l,o,n,s,p.fecha,!1,i);if(d<=0){u=!1;continue}const h=!l.cuentas||l.cuentas.length===0?p.saldoAcum:l.cuentas.reduce((y,I)=>{var A,f;return y+(((f=(A=a[b])==null?void 0:A.saldos)==null?void 0:f[I])||0)},0);h<d&&!u?(u=!0,r.push({tipo:"bajo_margen",fecha:p.fecha,saldo:h,target:d,nombre:l.nombre,mensaje:`⚠ ${l.nombre}: ${j(h)} < ${j(d)} desde ${p.fecha}`})):h>=d&&u&&(u=!1,r.push({tipo:"recuperacion_margen",fecha:p.fecha,saldo:h,target:d,nombre:l.nombre,mensaje:`✓ ${l.nombre}: recuperado el ${p.fecha}`}))}}return r}const ws=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Oa,calcColchonEnFecha:qa,calcGastoBasicoMensual:Wt,calcMargenEnFecha:pe,detectarCrucesMargenes:Ss,saldosPorCuentaEnExtracto:Ms},Symbol.toStringTag,{value:"Module"}));class Cs extends Error{constructor(a,o){super(`La funcionalidad "${a}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);ts(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=a}}let Qt=null;function js(t){const e=Qt;return Qt=t,()=>{Qt=e}}function La(t){return Qt?Qt(t):!0}function ka(t,e){if(!La(t))throw new Cs(t,e)}const Ba=[];function Ne(){const t=new Map,e=new WeakMap;let a=1,o=0,n=0;const s=l=>{if(!l||typeof l!="object")return 0;const u=e.get(l);if(u)return u;const b=a++;return e.set(l,b),b},i=l=>l.map(u=>[u._id,u.capital,u.tin,u.meses,u.fechaInicio,u.comisionAmort||0,u.comisionApertura||0,u.diaPago||"",u.activo?1:0,u.cuenta||"",(u.amortizaciones||[]).map(b=>`${b.fecha}:${b.cantidad}:${b.tipo||""}`).sort().join(",")].join("|")).join(";");function r(l){const u=[i(l.loans),s(l.expenses),s(l.accounts),s(l.nominas),s(l.inflacionPeriodos),l.config.dashboardStart,l.config.dashboardEnd,l.config.fechaReferencia||"",l.config.usarInflacion?1:0,(l.filtroAccounts||[]).join(",")].join("#"),b=t.get(u);if(b)return n++,b;o++;const p=Jt(l);return t.set(u,p),p}return{statement:r,stats:()=>({hits:n,misses:o}),clear:()=>t.clear()}}function Oe(t,e,a,o,n={},s=Ne()){ka("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:r=36,minAmortizable:l=500,tipoAmort:u="plazo",fechaPrimeraAmort:b=null,loanIds:p=null,nominas:d=Ba,sourceAccountId:h=null,selectedMarginIds:y=null,hoy:I=new Date}=n,A=V(I),f=Math.min(120,Math.max(1,r)),g=a.filter(N=>N.activo),m=g.map(N=>N._id),$=g.find(N=>N.esCuentaPrincipal)||g[0],v=h&&m.includes(h)?g.find(N=>N._id===h):$,x=v==null?void 0:v._id,M=t.filter(N=>N.activo&&!N.simulacion&&(!p||p.includes(N._id))).sort((N,H)=>H.tin-N.tin),S=!!y&&y.length>0,C=(o.margenesSeguridad||[]).filter(N=>N.activo!==!1).filter(N=>!N.cuentas||N.cuentas.length===0||N.cuentas.includes(x)).filter(N=>!S||y.includes(N._id));if(M.length===0)return{plan:[],margenesAplicados:C.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const z={};for(const N of M)z[N._id]=[];const E=[];function F(N){const H=new Date(I.getFullYear(),I.getMonth()+N,1),U=H.getFullYear(),Q=H.getMonth(),K=`${U}-${String(Q+1).padStart(2,"0")}`,st=V(new Date(U,Q,Math.min(15,new Date(U,Q+1,0).getDate())));return{label:K,dia15:st}}function w(N,H){const U=[...N.amortizaciones||[],...z[N._id]],{tabla:Q}=at({...N,amortizaciones:U}),K=Q.filter(nt=>nt.fecha<=H);if(K.length>0)return K[K.length-1].capitalPendiente;const st=U.filter(nt=>nt.fecha<=H).reduce((nt,vt)=>nt+vt.cantidad,0);return Math.max(0,N.capital-st)}function P(N){const H=t.map(it=>({...it,amortizaciones:[...it.amortizaciones||[],...z[it._id]||[]]})),U={...o,dashboardStart:A,dashboardEnd:N},Q=s.statement({loans:H,expenses:e,accounts:a,config:U,filtroAccounts:null,nominas:d}),K=g.reduce((it,Gt)=>it+rt(Gt),0),st=v?rt(v):0,nt=K>0?st/K:1;let vt=st,re=K;for(const it of Q){const Gt=it.delta??(it.tipo==="ingreso"?Math.abs(it.cuantia):-Math.abs(it.cuantia));it.cuenta===x?vt+=Gt:m.includes(it.cuenta)||(vt+=Gt*nt),re=it.saldoAcum}return{source:vt,total:re}}function D(N){const{source:H}=P(N);if(H<=0)return H;let U=0;for(const Q of C){const K=pe(Q,e,o,t,N,!0,I);K>U&&(U=K)}return H-U}const R=2;let O=0;if(b){for(let N=0;N<f;N++)if(F(N).dia15>=b){O=N;break}}for(let N=0;N<f;N++){if((N-O)%i!==0||N<O)continue;const{label:H,dia15:U}=F(N);if(U<A)continue;const Q=D(U)-R;if(Q<l)continue;let K=Q,st=0;for(const nt of M){if(K<l)break;const vt=w(nt,U);if(vt<1)continue;const re=nt.comisionAmort||0,it=1+re/100,Gt=Math.floor(K/it),Xo=Math.min(Gt,vt);if(Xo<l)continue;const le=Math.min(Math.floor(Xo),Math.floor(vt)),Zo=+(le*re/100).toFixed(2),la=le+Zo;la>K||(z[nt._id].push({_id:`opt_${H}_${nt._id}`,fecha:U,cantidad:le,tipo:u,simulacion:!0}),st+=la,E.push({mes:H,fechaAmort:U,loanId:nt._id,loanNombre:nt.nombre,tin:nt.tin,capitalAntes:vt,cantidadAmort:le,comision:Zo,capitalDespues:Math.max(0,vt-le),saldoDisponible:Q+R,excedente:Q,saldoDespues:Q+R-st,tipoAmort:u}),K-=la)}}const _=E.reduce((N,H)=>N+H.cantidadAmort,0),k=E.reduce((N,H)=>N+H.comision,0),L=M.map(N=>{const H=z[N._id];if(!H.length)return null;const U=at(N),Q=at({...N,amortizaciones:[...N.amortizaciones||[],...H]});return{loanId:N._id,nombre:N.nombre,tin:N.tin,fechaFinSin:U.fechaFin,fechaFinCon:Q.fechaFin,mesesAhorrados:U.mesesReales-Q.mesesReales,interesesSin:U.totalIntereses,interesesCon:Q.totalIntereses,ahorroIntereses:U.totalIntereses-Q.totalIntereses,numAmortizaciones:H.length,totalAmortizado:H.reduce((K,st)=>K+st.cantidad,0)}}).filter(N=>N!==null),B=L.reduce((N,H)=>N+H.ahorroIntereses,0);return{plan:E,margenesAplicados:C.length,totalAmortizado:_,totalComisiones:k,totalAhorroIntereses:B,resumenPorLoan:L}}function Ha(t,e,a,o,n={},s){ka("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:r=500,tipoAmort:l="plazo",fechaObjetivo:u=null,frecuencias:b=[1,2,3,6,12],fechaPrimeraAmort:p=null,loanIds:d=null,nominas:h=Ba,sourceAccountId:y=null,selectedMarginIds:I=null,hoy:A=new Date}=n,f=s??Ne(),g=V(A),m=u||V(new Date(A.getFullYear(),A.getMonth()+i,1));function $(M){const S=t.map(F=>({...F,amortizaciones:[...F.amortizaciones||[],...M[F._id]||[]]})),C={...o,dashboardStart:g,dashboardEnd:m},z=f.statement({loans:S,expenses:e,accounts:a,config:C,filtroAccounts:null,nominas:h});if(z.length===0)return a.filter(F=>F.activo).reduce((F,w)=>F+rt(w),0);const E=z.filter(F=>F.fecha<=m);return E.length>0?E[E.length-1].saldoAcum:z[0].saldoAcum}const v=$({}),x=b.map(M=>{const S=Oe(t,e,a,o,{frecuencia:M,mesesHorizonte:i,minAmortizable:r,tipoAmort:l,fechaPrimeraAmort:p,loanIds:d,nominas:h,sourceAccountId:y,selectedMarginIds:I,hoy:A},f),C={};for(const E of t)C[E._id]=[];for(const E of S.plan)C[E.loanId].push({_id:E.mes+"_"+E.loanId,fecha:E.fechaAmort,cantidad:E.cantidadAmort,tipo:l,simulacion:!0});const z=$(C);return{frecuencia:M,label:M===1?"Mensual":`Cada ${M} meses`,numAmortizaciones:S.plan.length,totalAmortizado:S.totalAmortizado,totalComisiones:S.totalComisiones,ahorroIntereses:S.totalAhorroIntereses,saldoObjetivo:z,gananciaSaldo:z-v,valorTotal:S.totalAhorroIntereses+(z-v),plan:S.plan,resumenPorLoan:S.resumenPorLoan}}).filter(M=>M.numAmortizaciones>0);if(x.length>0){const M=Math.max(...x.map(z=>z.ahorroIntereses)),S=Math.max(...x.map(z=>z.saldoObjetivo)),C=Math.max(...x.map(z=>z.valorTotal));x.forEach(z=>{z.esMejorIntereses=z.ahorroIntereses===M,z.esMejorSaldo=z.saldoObjetivo===S,z.esMejorValor=z.valorTotal===C})}return{resultados:x,saldoBase:v,fechaObjetivo:m}}const zs=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:Ha,createStatementMemo:Ne,defaultHoyISO:J,optimizarAmortizaciones:Oe},Symbol.toStringTag,{value:"Module"})),Es=30.44*864e5;function Ga(t){const e=t.getFullYear(),a=t.getMonth();return{desde:V(new Date(e,a,1)),hasta:V(new Date(e,a,Me(e,a)))}}function Va(t){const[e,a]=t.split("-").map(Number);return Ga(new Date(e,a-1,1))}function Fs(t,e){return Math.max(1,(G(e).getTime()-G(t).getTime())/Es)}const _s=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),St=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function Ps(t,e){const a=new Map(e.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=a.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function Ds(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=d=>d.sourceType==="loan"&&d.tipo==="gasto",n=e.loanIdsIniciados,s=St(t.filter(d=>d.tipo==="ingreso")),i=St(t.filter(d=>o(d)&&(!n||n.has(d.sourceId??"")))),r=St(t.filter(d=>o(d)&&e.hipotecaIds.has(d.sourceId??""))),l=St(t.filter(d=>d.sourceType==="loan-amort")),u=St(t.filter(d=>d.sourceType==="account-interest")),{basicos:b,deseo:p}=Ps(t,e.expenses);return{ingresos:s/a,cuotas:i/a,cuotasHipoteca:r/a,amortizaciones:l/a,gastosBasicos:b/a,gastosDeseo:p/a,gastosTotales:(i+b+p)/a,intereses:u/a}}function Ua(t,e){return t.reduce((a,o)=>{const n=at(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=e);return a+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function Ts(t,e,a,o){const n=t.filter(u=>u.activo&&!u.simulacion&&(u.fechaInicio||"")<=a),s=n.reduce((u,b)=>{if((b.amortizaciones||[]).filter(y=>y.fecha>=e&&y.fecha<=a).length===0)return u;const d=at(b).totalIntereses,h=at({...b,amortizaciones:(b.amortizaciones||[]).filter(y=>y.fecha<e||y.fecha>a)}).totalIntereses;return u+Math.max(0,h-d)},0),i=n.filter(u=>u.mostrarFechaFinEnDashboard!==!1).map(u=>({loan:u,fechaFin:at(u).fechaFin})).filter(u=>!!u.fechaFin&&u.fechaFin>=e&&u.fechaFin<=a),r=n.map(u=>at(u).tabla),l=u=>{const{desde:b,hasta:p}=Va(u);return r.reduce((d,h)=>{const y=h.find(I=>!I.esAmortizacion&&I.fecha>=b&&I.fecha<=p);return d+(y?y.cuota:0)},0)};return{deudaInicio:Ua(n,e),deudaFin:Ua(n,a),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:l(e.slice(0,7)),cuotasFin:l(a.slice(0,7)),finEnPeriodo:i}}function Rs(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:St(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function Ya(t,e=new Set,a="desglosado"){if(e.size===0)return Na(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(u=>e.has(u)),r=s.filter(u=>!e.has(u)),l=a==="porgrupos"&&i.length>0?i:r;for(const u of l)o.set(u,(o.get(u)||0)+Math.abs(n.cuantia))}return o}function Ns(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...Ya(t,e.grupoTags,e.modo).entries()].filter(([n])=>!a||a.size===0||a.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function Os(t,e){const a=e.reduce((o,n)=>o+rt(n),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:St(t.filter(o=>o.tipo==="gasto")),totalIngresos:St(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function qs(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function Ls(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function ks(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}function Bs(t,e){if(t.length===0)return[];const a=u=>e==="mes"?u.slice(0,7):u.slice(0,4),o=u=>e==="mes"?`${u}-01`:`${u}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let l=null;for(const u of t){const b=a(u.fecha),p=u.saldoAcum??i;(!l||l.periodo!==b)&&(l&&(i=l.cierre),l={periodo:b,inicio:o(b),apertura:i,cierre:p,maximo:Math.max(i,p),minimo:Math.min(i,p),eventos:0},r.push(l)),l.cierre=p,p>l.maximo&&(l.maximo=p),p<l.minimo&&(l.minimo=p),l.eventos+=1}return r}const Hs=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Bs,cuentasVisibles:qs,gastoPorTagOrdenado:Ns,idsHipoteca:Ls,idsPrestamosIniciados:ks,interesesPorCuenta:Rs,mesesDelPeriodo:Fs,metricasFlujo:Ds,rangoMes:Va,rangoMesDe:Ga,resumenPrestamosPeriodo:Ts,sinTransferencias:_s,sumarGastosPorTag:Ya,totalesPeriodo:Os},Symbol.toStringTag,{value:"Module"}));function Gs(t,e,a){const o=t||[];if(!o.length)return e;const n=o.find(i=>i.año===a);if(n)return n.tramos;const s=o.filter(i=>i.año<a).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:e}function bt(t,e){return a=>Gs(t,e,a)}const Kt=8,Ja=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Wa=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function qe(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}function Qa(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Ja,tramosGananciasCapital:Wa,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function Vs(t,e){return{loans:[],expenses:[],accounts:[qe(t)],nominas:[],goals:[],planes:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],config:Qa(t,e)}}const ht=t=>Array.isArray(t)?t:[],Us=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Xt(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function Ka(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function Le(t){const{varianza:e,inflacion:a,...o}=t;return o}function Ys(t,e){const{hoyISO:a,finISO:o}=e,n={...t},s=Us(t.config),r={...Qa(a,o)};for(const[b,p]of Object.entries(s))p!=null&&(r[b]=p);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Ja),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Wa),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let l=ht(t.accounts).map(b=>{const p={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...b};return p.modeloFondo||(p.modeloFondo=p.esFondoPension?"pension":"cuenta"),delete p.esFondoPension,Array.isArray(p.historicoSaldos)||(p.historicoSaldos=[]),Xt(p)});l.length===0&&(l=[qe(a)]);const u=l.filter(b=>b.esCuentaPrincipal);if(u.length===0){const b=l.find(p=>p._id==="default")||l[0];l=l.map(p=>({...p,esCuentaPrincipal:p._id===b._id}))}else if(u.length>1){let b=!1;l=l.map(p=>p.esCuentaPrincipal?b?{...p,esCuentaPrincipal:!1}:(b=!0,p):p)}return n.accounts=l,n.expenses=ht(t.expenses).map(b=>{const p={basico:!1,activo:!0,tags:[],historialPrecios:[],...b};return Array.isArray(p.tags)||(p.tags=[]),Array.isArray(p.historialPrecios)||(p.historialPrecios=[]),p.diaPago=Ka(p.diaPago),Le(Xt(p))}),n.loans=ht(t.loans).map(b=>{const p={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...b};return Array.isArray(p.tags)||(p.tags=[]),p.diaPago=Ka(p.diaPago),p.amortizaciones=ht(p.amortizaciones).map(d=>Xt(d)),Le(Xt(p))}),n.nominas=ht(t.nominas).map(b=>{const p={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...b};return Array.isArray(p.tags)||(p.tags=[]),Array.isArray(p.retribucionFlexible)||(p.retribucionFlexible=[]),Le(Xt(p))}),n.goals=ht(t.goals).map((b,p)=>{const d=Array.isArray(b.cuentaIds)?b.cuentaIds:b.cuentaId?[b.cuentaId]:[],{cuentaId:h,...y}=b;return{prioridad:p+1,completado:!1,usarColchon:!0,targetAmount:0,...y,cuentaIds:d}}),n.inflacion=ht(t.inflacion),n.tramosIRPFHistorico=ht(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=ht(t.tramosGananciasCapitalHistorico),n.escenarios=ht(t.escenarios).map(({inversiones:b,...p})=>p),n}const Nt=t=>Array.isArray(t)?t:[];let ke=0;function Js(t){return ke+=1,`${t}_${ke.toString(36)}`}const Ws=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Qs=t=>typeof t=="number"&&Number.isFinite(t);function Ks(t,e){const a={...t};ke=0;const o=Nt(t.transacciones),n=Nt(t.puntosControl),s=[...n],i=new Set(n.map(u=>`${u.cuentaId}|${u.fecha}`)),r=(u,b,p,d)=>{if(!Ws(b)||!Qs(p))return;const h=`${u}|${b}`;i.has(h)||(i.add(h),s.push({_id:Js("pc"),fecha:b,cuentaId:u,saldoCts:It(p),...typeof d=="string"&&d?{nota:d}:{}}))};for(const u of Nt(t.accounts)){const b=typeof u._id=="string"?u._id:null;if(b)for(const p of Nt(u.historicoSaldos))r(b,p.fecha,p.saldo,p.nota)}const l=Nt(t.history);if(l.length>0){const u=Nt(t.accounts),b=u.find(d=>d.esCuentaPrincipal)||u.find(d=>d.activo)||u[0],p=typeof(b==null?void 0:b._id)=="string"?b._id:"default";for(const d of l){const h=typeof d.cuenta=="string"?d.cuenta:typeof d.cuentaId=="string"?d.cuentaId:p;r(h,d.fecha,d.saldo,d.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=s.sort((u,b)=>String(u.fecha).localeCompare(String(b.fecha))),a}const Be=t=>Array.isArray(t)?t:[],Xs=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Zs=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let He=0;function tn(){return He+=1,`tx_hp_${He.toString(36)}`}function en(t,e){const a={...t};He=0;const o=[...Be(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Be(t.expenses).map(i=>{const r=Be(i.historialPrecios),l=typeof i._id=="string"?i._id:null,u=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",b=i.tipo==="ingreso"?"ingreso":"gasto",p=Array.isArray(i.tags)?i.tags.filter(y=>typeof y=="string"):[];if(l)for(const y of r){if(!y||!Xs(y.fecha)||!Zs(y.cuantia))continue;const I=b==="ingreso"?It(y.cuantia):-It(y.cuantia),A=`${l}|${y.fecha}|${I}`;n.has(A)||(n.add(A),o.push({_id:tn(),fecha:y.fecha,cuentaId:u,importeCts:I,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:p,estimacionId:l,tipo:b,origen:"importado",nota:typeof y.nota=="string"&&y.nota?y.nota:"Importado del historial de precios"}))}const{historialPrecios:d,...h}=i;return h});return a.expenses=s,a.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),a}const Xa=t=>Array.isArray(t)?t:[],wt=(t,e="")=>typeof t=="string"&&t.trim()?t:e,Ot=(t,e=0)=>typeof t=="number"&&Number.isFinite(t)?t:e,an=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function on(t,e){var b;const a={...t};if(Array.isArray(a.planes))return a;const o=Xa(a.goals),n=Xa(a.accounts),s=n.map(p=>{const d=Ot(p.bloqueoMeses,0);return{_id:`veh_${wt(p._id,"x")}`,nombre:wt(p.nombre,"Cuenta"),rentabilidadRealAnual:Ot(p.interes,0)/100,liquidez:p.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":d>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Ot(p.impuestoRetirada,0)/100,topeAportacionAnual:p.modeloFondo==="pension"?It(1500):null,riesgo:p.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:wt(p._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Ot(p.interes,0)>0}}),i=new Map(n.map((p,d)=>[wt(p._id,""),s[d]._id])),r=((b=s[0])==null?void 0:b._id)??"",l=o.map((p,d)=>{const h=Array.isArray(p.cuentaIds)?p.cuentaIds.map(I=>wt(I,"")):[],y=an(p.targetDate);return{_id:wt(p._id,`obj_mig_${d}`),nombre:wt(p.nombre,`Objetivo ${d+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:It(Ot(p.targetAmount,0)),fechaLimite:y,prioridad:Ot(p.prioridad,d+1),modoAsignacion:y?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(h[0])??r,saldoActual:0,estado:p.completado===!0?"COMPLETADO":"PENDIENTE",notas:wt(p.notas,"")}}),u={_id:"plan_base",nombre:"Plan base",fechaInicio:e.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:l,eventos:[],creadoEn:e.hoyISO};return a.planes=[u],a}const sn=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Ys},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Ks},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:en},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:on}],nn=["history"];function Za(t,e,a){let o=t;const n=[];for(const s of[...sn].sort((i,r)=>i.version-r.version))(e??0)>=s.version||(o=s.migrate(o,a),n.push(s.version));return{state:o,applied:n}}const me="state_",Ge="state__schemaVersion",to="financeapp_",eo="state__modificadoEn";function rn(t=localStorage,e=to){const a=o=>`${e}${o}`;return{get(o){try{const n=t.getItem(a(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(a(o),JSON.stringify(n)),o!==eo&&t.setItem(a(eo),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(e)&&o.push(s.slice(e.length))}return o}}}function ln(t=localStorage,e=to){const a=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(me)&&!s.startsWith(e)&&a.push(s)}const o=[];for(const n of a)try{const s=t.getItem(n);s!==null&&t.getItem(`${e}${n}`)===null&&(t.setItem(`${e}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function cn(t){return V(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function dn({adapter:t,hoy:e=new Date}){const a=V(e),o=cn(e);let n=Vs(a,o);const s=new Set;let i=[];function r(C){for(const z of s)z(C)}function l(C){t.set(`${me}${C}`,n[C])}function u(){const C={};for(const w of Object.keys(n)){const P=t.get(`${me}${w}`);P!==null&&(C[w]=P)}for(const w of nn){const P=t.get(`${me}${w}`);P!==null&&(C[w]=P)}const z=t.get(Ge),{state:E,applied:F}=Za(C,z,{hoyISO:a,finISO:o});if(n=E,b(),F.length>0){for(const w of Object.keys(n))l(w);t.set(Ge,Kt)}return i=F,{applied:F}}function b(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[qe(a)],l("accounts");return}const C=n.accounts.filter(z=>z.esCuentaPrincipal);if(C.length===0)n.accounts=n.accounts.map((z,E)=>E===0?{...z,esCuentaPrincipal:!0}:z),l("accounts");else if(C.length>1){let z=!1;n.accounts=n.accounts.map(E=>E.esCuentaPrincipal?z?{...E,esCuentaPrincipal:!1}:(z=!0,E):E),l("accounts")}}function p(C){return n[C]}function d(C,z){n[C]=z,l(C),r(C)}function h(C){d("config",{...n.config,...C})}function y(C){return s.add(C),()=>s.delete(C)}function I(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function A(C,z){const E=[...n[C]],F={...z,_id:I()};return E.push(F),d(C,E),F}function f(C,z,E){const F=n[C].map(w=>w._id===z?{...w,...E}:w);d(C,F)}function g(C,z){const E=n[C].filter(F=>F._id!==z);d(C,E)}function m(){const C=n.accounts||[],z=C.find(E=>E.esCuentaPrincipal&&E.activo)||C.find(E=>E.activo);return z?z._id:"default"}function $(C){var z;return((z=n.accounts.find(E=>E._id===C))==null?void 0:z.nombre)??C}function v(){return bt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function x(){return bt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function M(){return structuredClone(n)}function S(C,z=null){const{state:E,applied:F}=Za(C,z,{hoyISO:a,finISO:o});n=E,b();for(const w of Object.keys(n))l(w);t.set(Ge,Kt);for(const w of Object.keys(n))r(w);return{applied:F}}return{load:u,get:p,set:d,patchConfig:h,subscribe:y,addItem:A,updateItem:f,removeItem:g,getPrincipalAccountId:m,accountName:$,resolverTramosIRPF:v,resolverTramosGanancias:x,snapshot:M,replaceAll:S,get schemaVersion(){return Kt},get migrationsApplied(){return[...i]},get today(){return a||J()}}}const X={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},Ct=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:X.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:X.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:X.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:X.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:X.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro (antiguos)",descripcion:"Solo lectura: la copia previa al planificador. Los objetivos se gestionan en «Objetivos financieros». Apagada de fábrica; enciéndela si quieres revisar los antiguos antes de descartarlos.",grupo:X.dinero,porDefecto:!1,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:X.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:X.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:X.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:X.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:X.planificacion,porDefecto:!1},{id:"planner",nombre:"Objetivos financieros",descripcion:"Plan a largo plazo: objetivos que compiten por el flujo mensual y se encadenan al completarse.",grupo:X.planificacion,porDefecto:!0},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:X.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:X.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:X.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:X.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:X.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:X.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:X.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:X.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:X.datos,porDefecto:!1,dependencias:["sync-nube"]}],un=new Map(Ct.map(t=>[t.id,t]));function Zt(t){return un.get(t)}function ao(t){return Ct.filter(e=>(e.dependencias||[]).includes(t))}function Ve(){const t={};for(const e of Ct)t[e.id]=e.porDefecto;return t}function oo(){const t=[],e=new Map;for(const a of Ct)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function pn(t){function e(){return{...Ve(),...t.get("config").features||{}}}function a(p){t.patchConfig({features:p})}function o(p,d=e(),h=new Set){const y=Zt(p);if(!y)return!1;if(y.nucleo)return!0;if(d[p]===!1)return!1;if(h.has(p))return!0;h.add(p);for(const I of y.dependencias||[])if(!o(I,d,h))return!1;return!0}function n(p,d=e()){const h=Zt(p);return h?(h.dependencias||[]).filter(y=>!o(y,d)):[]}function s(p,d){var m;const h=Zt(p);if(!h)return{cambiadas:[]};if(h.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const y=e(),I=new Map(Ct.map($=>[$.id,o($.id,y)])),A={...y,[p]:d};let f;if(d){const $=[...h.dependencias||[]];for(;$.length;){const v=$.pop();A[v]===!1&&(A[v]=!0,f="dependencias-activadas"),$.push(...((m=Zt(v))==null?void 0:m.dependencias)||[])}}else{const $=ao(p).map(v=>v.id);for(;$.length;){const v=$.pop();A[v]!==!1&&(A[v]=!1,f="cascada-apagado"),$.push(...ao(v).map(x=>x.id))}}return a(A),{cambiadas:Ct.filter($=>o($.id,A)!==I.get($.id)).map($=>$.id),motivo:f}}function i(){const p=e();return Ct.map(d=>{const h=n(d.id,p);return{...d,activa:o(d.id,p),...h.length>0&&p[d.id]!==!1?{bloqueadaPor:h}:{}}})}function r(){const p=e();return oo().map(({grupo:d,features:h})=>({grupo:d,features:h.map(y=>{const I=n(y.id,p);return{...y,activa:o(y.id,p),...I.length>0&&p[y.id]!==!1?{bloqueadaPor:I}:{}}})}))}function l(){a(Ve())}function u(p){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...p?{nombre:p}:{},features:e()}}function b(p){const d=p,h=d&&typeof d=="object"&&d.features&&typeof d.features=="object"?d.features:null;if(!h)throw new Error('El perfil no tiene una sección "features" válida');const y=Ve(),I=[],A=[];for(const[f,g]of Object.entries(h)){if(!Zt(f)){A.push(f);continue}if(typeof g!="boolean"){A.push(f);continue}y[f]=g,I.push(f)}return a(y),{aplicadas:I,ignoradas:A}}return{isEnabled:p=>o(p),setEnabled:s,estado:i,estadoPorGrupo:r,reset:l,exportProfile:u,importProfile:b,bloqueadaPor:p=>n(p)}}const te=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function qt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function mn(t){var n,s;const a=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(te).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${te(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${te(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${te(t.descripcion)}</div>
        ${a}
      </div>
    </div>`}function fn(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${te(o)}</div>
        ${n.map(mn).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function vn(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function gn(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${fn(a)}`,n(i)}function n(i){var l,u,b;i.querySelectorAll("[data-feature-toggle]").forEach(p=>{p.addEventListener("change",()=>{var y;const d=p.dataset.featureToggle,h=a.setEnabled(d,p.checked);h.motivo==="dependencias-activadas"&&qt(t,"Se han activado también las funcionalidades necesarias"),h.motivo==="cascada-apagado"&&qt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(y=t.onChange)==null||y.call(t,h.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(l=i.querySelector('[data-feature-action="export"]'))==null||l.addEventListener("click",()=>{const p=a.exportProfile(),d=new Blob([JSON.stringify(p,null,2)],{type:"application/json"}),h=URL.createObjectURL(d),y=e.createElement("a");y.href=h,y.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,y.click(),URL.revokeObjectURL(h),qt(t,"Perfil de funcionalidades guardado")}),(u=i.querySelector('[data-feature-action="import"]'))==null||u.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var d,h;const p=(d=r.files)==null?void 0:d[0];if(p)try{const{aplicadas:y,ignoradas:I}=a.importProfile(JSON.parse(await p.text()));qt(t,I.length>0?`Perfil cargado (${y.length} aplicadas, ${I.length} ignoradas por ser de otra versión)`:`Perfil cargado (${y.length} funcionalidades)`),(h=t.onChange)==null||h.call(t,y),o(i)}catch(y){qt(t,"No se pudo cargar el perfil: "+y.message,"err")}finally{r.value=""}}),(b=i.querySelector('[data-feature-action="reset"]'))==null||b.addEventListener("click",()=>{var p;a.reset(),qt(t,"Funcionalidades restablecidas"),(p=t.onChange)==null||p.call(t,[]),o(i)})}function s(){const i=vn(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const so={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function no(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const n=e(o);a.style.display=n?"":"none",n?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function bn({flags:t,document:e=document,router:a,rutasExtra:o}){function n(){const r=e.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const l=Object.entries((o==null?void 0:o())??{}).map(([u,b])=>[b,u]);for(const[u,b]of[...Object.entries(so),...l]){const p=t.isEnabled(u),d=e.querySelector(`.nav-btn[data-view="${b}"]`);d&&(d.style.display=p?"":"none"),!p&&n()===b&&(r=!0)}if(e.querySelectorAll(".nav-section").forEach(u=>{const b=[...u.querySelectorAll(".nav-btn[data-view]")];if(b.length===0)return;const p=b.some(d=>d.style.display!=="none");u.style.display=p?"":"none"}),no(e,u=>t.isEnabled(u)),r){const u=a??globalThis.Router;u==null||u.navigate("dashboard")}}function i(r=e.body){if(typeof MutationObserver>"u")return()=>{};let l=!1;const u=new MutationObserver(()=>{if(!l){l=!0;try{no(e,b=>t.isEnabled(b))}finally{l=!1}}});return u.observe(r,{childList:!0,subtree:!0}),()=>u.disconnect()}return{apply:s,observar:i,vistaPara:r=>so[r]}}function hn({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function n(y){return`view-${y}`}function s(y){const I=t.getElementById(n(y.route));if(I)return I;const A=t.querySelector(".view-container");if(!A)return null;const f=t.createElement("div");return f.id=n(y.route),f.className="view hidden",A.appendChild(f),f}function i(y){if(t.querySelector(`.nav-btn[data-view="${y.route}"]`))return;const I=t.querySelectorAll(".nav-section"),A=I[y.seccion??Math.max(0,I.length-1)];if(!A)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=y.route,f.innerHTML=`${y.iconoPath?`<svg viewBox="0 0 24 24"><path d="${y.iconoPath}"/></svg>`:""}<span>${y.nombre}</span>`,A.appendChild(f),f.addEventListener("click",()=>{const g=globalThis.Router;g==null||g.navigate(y.route)})}function r(y){a.set(y.route,y),s(y),i(y)}function l(){return[...a.keys()].filter(y=>{const I=a.get(y);return!e||e(I.flagId??I.id)})}function u(y){return l().includes(y)}function b(y){const I=a.get(y);if(!I||e&&!e(I.flagId??I.id))return!1;const A=s(I);if(!A)return!1;if(o&&o!==y){const f=a.get(o),g=t.getElementById(n(o));f!=null&&f.unmount&&g&&f.unmount(g)}return I.mount(A),o=y,!0}function p(){o&&b(o)}function d(){const y={};for(const[I,A]of a)y[I]=A.flagId??A.id;return y}function h(){for(const y of a.values())s(y),i(y)}return{register:r,routes:l,has:u,mount:b,rerender:p,flagPorRuta:d,attachToShell:h,get activa(){return o}}}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ft(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${c(j(t))}</span>`}function io(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function ro(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${c(e)}</span>`).join(" ")}const yn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ue(t){const[e,a]=t.split("-").map(Number);return`${yn[a-1]} ${e}`}function q(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function Z(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function T(t,e,a){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function Y(t,e,a){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function ft(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function lo(t,e){const a=parseFloat(ft(t,e));return Number.isFinite(a)?a:0}function xn(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function $n(t,e){const{ledger:a}=t,o=(t.hoy??J)(),n=t.accounts().filter(g=>g.activo),{desde:s,hasta:i}=xn(e.mes),r={cuentaId:e.cuentaId||void 0,desde:s,hasta:i,texto:e.filtroTexto||void 0},l=a.transacciones(r),u=t.estimaciones().filter(g=>g.tipo!=="transferencia"),b=l.filter(g=>g.importeCts<0).reduce((g,m)=>g+m.importeCts,0),p=l.filter(g=>g.importeCts>0).reduce((g,m)=>g+m.importeCts,0),d=e.cuentaId?a.saldoCuenta(e.cuentaId,i):a.saldoTotal(i),h=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),y=n.map(g=>`<option value="${c(g._id)}"${g._id===e.cuentaId?" selected":""}>${c(g.nombre)}</option>`).join(""),I=g=>'<option value="">— sin asignar —</option>'+u.map(m=>`<option value="${c(m._id)}"${m._id===g?" selected":""}>${c(m.concepto)} (${c(j(m.cuantia))})</option>`).join(""),A=l.map(g=>{var m;return`
      <tr data-tx="${c(g._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${c(g.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${c(g.concepto)}</td>
        <td style="padding:7px 8px">${ro(g.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${c(((m=t.accounts().find($=>$._id===g.cuentaId))==null?void 0:m.nombre)??g.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${c(g._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${I(g.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Ft(et(g.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${c(g._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${c(g._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),f=h.slice().reverse().slice(0,8).map(g=>{var m;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${c(g.fecha)}</span>
        <span style="color:var(--text3)">${c(((m=t.accounts().find($=>$._id===g.cuentaId))==null?void 0:m.nombre)??g.cuentaId)}</span>
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
          <span>Gastos: ${Ft(et(b))}</span>
          <span>Ingresos: ${Ft(et(p))}</span>
          <span>Neto: ${Ft(et(p+b))}</span>
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
            <select class="form-input" id="nt-estimacion">${I(null)}</select>
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
    </div>`}function In(t,e,a,o){const{ledger:n}=e;Y(t,"#acc-cuenta",i=>{a.cuentaId=i.value,o()}),Y(t,"#acc-mes",i=>{a.mes=i.value||a.mes,o()});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{a.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),T(t,"#nt-guardar",()=>{const i=ft(t,"#nt-concepto").trim(),r=lo(t,"#nt-importe");if(!i)return q("Indica un concepto","err");if(!(r>0))return q("Indica un importe mayor que cero","err");const l=ft(t,"#nt-tags").split(",").map(u=>u.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:ft(t,"#nt-fecha")||(e.hoy??J)(),cuentaId:ft(t,"#nt-cuenta"),importe:r,concepto:i,tags:l,tipo:ft(t,"#nt-tipo"),estimacionId:ft(t,"#nt-estimacion")||null}),q("Movimiento registrado"),e.onDatosCambiados(),o()}),T(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;Z("¿Eliminar este movimiento?")&&(n.eliminar(r),q("Movimiento eliminado"),e.onDatosCambiados(),o())}),T(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,l=n.transacciones().find(p=>p._id===r);if(!l)return;const u=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(et(l.importeCts))));if(u===null)return;const b=parseFloat(u.replace(",","."));if(!Number.isFinite(b)||b<=0)return q("Importe no válido","err");n.actualizar(r,{importe:b}),q("Movimiento actualizado"),e.onDatosCambiados(),o()}),Y(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),q("Asignación actualizada"),e.onDatosCambiados()}),T(t,"#pc-guardar",()=>{if(ft(t,"#pc-saldo").trim()==="")return q("Indica el saldo","err");const r=lo(t,"#pc-saldo");n.registrarPuntoControl(ft(t,"#pc-cuenta"),ft(t,"#pc-fecha")||(e.hoy??J)(),r,ft(t,"#pc-nota").trim()||void 0),q("Saldo real registrado"),e.onDatosCambiados(),o()}),T(t,"[data-pc-borrar]",i=>{Z("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),q("Punto de control eliminado"),e.onDatosCambiados(),o())})}function Ye(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=W(t.mediaRealReciente),i=W(s-e),r=e!==0?i/Math.abs(e)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const l=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:W(e),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:l,motivo:i>0?`El gasto real de los últimos ${l} meses supera lo estimado`:`El gasto real de los últimos ${l} meses es inferior a lo estimado`}}function An(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(s,i,r={}){const l=r.hoy??J(),u=t.get("expenses"),b=u.find(y=>y._id===s);if(!b)throw new Error(`La estimación ${s} no existe`);const p={...b,fechaFin:l},d={...b,_id:e(),cuantia:W(i),fechaInicio:l,fechaFin:b.fechaFin??null,ajustadaDesdeId:b._id,ajustadaEn:l},h=u.map(y=>y._id===s?p:y);return h.push(d),t.set("expenses",h),{estimacionCerrada:p,estimacionNueva:d}}function o(s,i={}){const r=[],l=[];for(const u of s)try{r.push(a(u.estimacionId,u.cuantiaSugerida,i))}catch(b){l.push({estimacionId:u.estimacionId,error:b.message})}return{aplicadas:r,errores:l}}function n(s){const i=t.get("expenses"),r=new Map(i.map(I=>[I._id,I])),l=r.get(s);if(!l)return[];const u=[];let b=l;const p=new Set;for(;b!=null&&b.ajustadaDesdeId&&!p.has(b._id);){p.add(b._id);const I=r.get(b.ajustadaDesdeId);if(!I)break;u.unshift(I),b=I}const d=[];let h=l;const y=new Set([l._id]);for(;;){const I=i.find(A=>A.ajustadaDesdeId===h._id&&!y.has(A._id));if(!I)break;y.add(I._id),d.push(I),h=I}return[...u,l,...d]}return{aplicar:a,aplicarTodas:o,cadena:n}}function Je(t){const e=t.estimaciones(),a=new Map(e.map(o=>[o._id,o]));return t.precision.analizarTodas(e).map(o=>{const n=a.get(o.estimacionId);return{analisis:o,estimacion:n,sugerencia:Ye(o,n.cuantia)}}).filter(o=>!!o.estimacion)}function Mn(t){const e=Je(t),a=e.filter(l=>l.analisis.precision!==null),o=e.filter(l=>l.sugerencia!==null),n=t.precision.analizarPorTag(e.map(l=>l.analisis));if(a.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const s=a.map(({analisis:l,estimacion:u,sugerencia:b})=>{const p=l.meses.slice(-6).map(d=>`${Ue(d.mes)}: ${j(d.estimado)} → ${j(d.real)} (${d.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${c(u.concepto)}</div>
          <div style="margin-top:3px">${ro(l.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${c(p)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(j(l.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(j(l.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Ft(l.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${io(l.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${b?`<button class="btn-secondary" data-sugerir="${c(l.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${c(b.motivo)}">Sugerir ajuste → ${c(j(b.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=n.map(l=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${c(l.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${l.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(j(l.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(j(l.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Ft(l.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${io(l.precision)}</td>
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
    </div>`}function Sn(t,e,a){T(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=Je(e).find(l=>l.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${j(i.cuantiaActual)}
Nueva estimación: ${j(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;Z(r)&&(e.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:e.hoy()}),q(`Estimación ajustada a ${j(i.cuantiaSugerida)}`),e.onDatosCambiados(),a())}),T(t,"#ajustar-todas",()=>{const o=Je(e).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${j(r.cuantiaActual)} → ${j(r.cuantiaSugerida)}`).join(`
`);if(!Z(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});q(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const wn=[";",",","	","|"],Cn={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function fe(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ve(t,e){const a=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===e?(a.push(o.trim()),o=""):o+=i}return a.push(o.trim()),a}function jn(t){let e=";",a=-1;for(const o of wn){const n=t.slice(0,20).map(l=>ve(l,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(l=>l===s).length*10+s;r>a&&(a=r,e=o)}return e}function ee(t){let e=(t??"").trim();if(!e)return null;let a=!1;if(/^\(.*\)$/.test(e)&&(a=!0,e=e.slice(1,-1).trim()),e.endsWith("-")&&(a=!0,e=e.slice(0,-1).trim()),e.startsWith("-")&&(a=!0,e=e.slice(1).trim()),e.startsWith("+")&&(e=e.slice(1).trim()),e=e.replace(/[€$£\s  ]/g,""),!e)return null;const o=e.lastIndexOf(","),n=e.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(e)&&e.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(e)&&e.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const b=s===","?o:n;i=e.slice(0,b).replace(/[.,]/g,""),r=e.slice(b+1).replace(/[.,]/g,"")}else i=e.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const l=(r+"00").slice(0,2),u=Number(i||"0")*100+Number(l);return Number.isFinite(u)?a?-u:u:null}function We(t){const e=(t??"").trim();if(!e)return null;let a=e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a)return co(Number(a[1]),Number(a[2]),Number(a[3]));if(a=e.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),a){let o=Number(a[3]);return o<100&&(o+=o<70?2e3:1900),co(o,Number(a[2]),Number(a[1]))}return null}function co(t,e,a){if(e<1||e>12||a<1||a>31)return null;const o=new Date(t,e-1,a);return o.getFullYear()!==t||o.getMonth()!==e-1||o.getDate()!==a?null:`${t}-${String(e).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function uo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>We(a)!==null).length/e.length}function po(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>ee(a)!==null).length/e.length}function zn(t,e){const a={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>e.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=fe(t[i]);if(r&&Cn[s].some(l=>r===l||r.startsWith(l)||r.includes(l))){if(s==="importe"&&fe(t[i]).includes("saldo"))continue;a[s]=i,o.add(i);break}}if(a.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=uo(n(r));l>i&&(i=l,s=r)}s>=0&&(a.fecha=s,o.add(s))}if(a.importe<0&&a.debe<0&&a.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||fe(t[r]).includes("saldo"))continue;const l=po(n(r));l>i&&(i=l,s=r)}s>=0&&(a.importe=s,o.add(s))}if(a.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=n(r);if(po(l)>.5||uo(l)>.5)continue;const u=l.reduce((b,p)=>b+p.length,0)/Math.max(1,l.length);u>i&&(i=u,s=r)}s>=0&&(a.concepto=s)}return a}function En(t){const e=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(b=>b.trim()!=="");if(e.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const a=jn(e),o=e.map(b=>ve(b,a).length),n=Math.max(...o);let s=o.findIndex(b=>b===n);s<0&&(s=0);const i=ve(e[s],a);let r=e.slice(s+1).map(b=>ve(b,a));const l=We(i[0]??"")!==null||i.some(b=>ee(b)!==null&&/\d/.test(b));l&&(r=[i,...r]);const u=zn(l?i.map(()=>""):i,r.slice(0,40));return{separador:a,cabeceras:l?i.map((b,p)=>`Columna ${p+1}`):i,filas:r,lineaCabecera:s+1,mapeo:u}}function mo(t,e,a){return`${t}|${e}|${fe(a).replace(/\s+/g," ")}`}function Fn(t,e,a=[]){const o=new Set(a.map(s=>mo(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],l=e.fecha>=0?We(s[e.fecha]??""):null;e.fecha<0?r.push("sin columna de fecha"):l||r.push(`fecha ilegible: «${s[e.fecha]??""}»`);let u=null;if(e.importe>=0)u=ee(s[e.importe]??""),u===null&&r.push(`importe ilegible: «${s[e.importe]??""}»`);else if(e.debe>=0||e.haber>=0){const d=e.debe>=0?ee(s[e.debe]??""):null,h=e.haber>=0?ee(s[e.haber]??""):null;d===null&&h===null?r.push("sin importe en Debe ni en Haber"):d!==null&&d!==0?u=-Math.abs(d):h!==null&&h!==0?u=Math.abs(h):u=0}else r.push("sin columna de importe");u===0&&r.push("importe cero");const b=(e.concepto>=0?s[e.concepto]??"":"").trim()||"Movimiento importado";let p=!1;if(l&&u!==null){const d=mo(l,u,b);p=o.has(d)||n.has(d),n.add(d)}return{linea:t.lineaCabecera+1+i,fecha:l,concepto:b,importeCts:u,errores:r,duplicada:p}})}function _n(t,e){const a=t.filter(n=>n.errores.length===0&&(e||!n.duplicada)),o=a.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:a.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:a.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function ge(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const Pn=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function Qe(t,e){if(!e.analisis||!e.mapeo){e.filas=[];return}const a=t.ledger.transacciones(e.cuentaId?{cuentaId:e.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));e.filas=Fn(e.analisis,e.mapeo,a)}function Dn(t,e){const a=t.accounts().filter(n=>n.activo);if(!e.abierto)return`
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

      ${e.analisis&&e.mapeo?Rn(e,e.analisis,e.mapeo):Tn()}
    </div>`}function Tn(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function Rn(t,e,a){const o=_n(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+e.cabeceras.map((l,u)=>`<option value="${u}"${u===r?" selected":""}>${c(l||`Columna ${u+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${c(t.nombreFichero)}</strong> · ${e.filas.length} línea${e.filas.length!==1?"s":""}
      · separador <code>${c(e.separador==="	"?"tabulador":e.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${Pn.map(r=>`<div class="form-group">
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
          ${i.map(r=>{const l=r.errores.length>0,u=l?r.errores[0]:r.duplicada?"repetido":"se importa",b=l?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${l?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${c(r.fecha??"—")}</td>
                <td style="font-size:12px">${c(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":c(j(et(r.importeCts)))}</td>
                <td style="font-size:11px;color:${b}">${c(u)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function Nn(t,e,a,o){T(t,"[data-imp-abrir]",()=>{const s=e.accounts().filter(i=>i.activo);Object.assign(a,ge(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),T(t,"[data-imp-cerrar]",()=>{Object.assign(a,ge()),o()}),Y(t,"#imp-cuenta",s=>{a.cuentaId=s.value,Qe(e,a),o()}),Y(t,"#imp-duplicadas",s=>{a.incluirDuplicadas=s.checked,o()}),Y(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;a.mapeo&&(a.mapeo[r]=Number(i.value),Qe(e,a),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&On(s).then(r=>{const l=En(r);a.nombreFichero=s.name,a.error=l.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",a.analisis=l,a.mapeo={...l.mapeo},Qe(e,a),o()}).catch(r=>{a.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),T(t,"[data-imp-confirmar]",()=>{if(!a.cuentaId)return;const s=a.filas.filter(i=>i.errores.length===0&&(a.incluirDuplicadas||!i.duplicada));if(s.length!==0){for(const i of s)e.ledger.registrar({fecha:i.fecha,cuentaId:a.cuentaId,importe:Math.abs(et(i.importeCts)),tipo:i.importeCts<0?"gasto":"ingreso",concepto:i.concepto,origen:"importado"});q(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""}`),Object.assign(a,ge()),e.onDatosCambiados(),o()}})}function On(t){return t.arrayBuffer().then(e=>{const a=new TextDecoder("utf-8").decode(e);if(!a.includes("�"))return a;try{return new TextDecoder("iso-8859-1").decode(e)}catch{return a}})}function qn(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function Ln(t,e){const a=G(t),o=[];for(let n=1;n<=e;n++){const s=new Date(a.getFullYear(),a.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function kn(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function fo(t,e){const{inicio:a,fin:o}=kn(e);return Yt([t],{start:a,end:o}).reduce((s,i)=>s+Math.abs(i.cuantia),0)}function Bn(t){function e(n,s={}){var $;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:l=J()}=s,u=t.transacciones({estimacionId:n._id}),p=u.length===0&&((($=n.tags)==null?void 0:$.length)??0)>0?t.transacciones({tags:n.tags}):u,d=new Map;for(const v of p){const x=v.fecha.slice(0,7);d.set(x,(d.get(x)??0)+Math.abs(v.importeCts)/100)}const h=[];for(const v of Ln(l,i)){const x=d.get(v);if(x===void 0)continue;const M=W(fo(n,v));h.push({mes:v,estimado:M,real:W(x),desviacion:W(x-M),precision:qn(M,x)})}const y=W(h.reduce((v,x)=>v+x.estimado,0)),I=W(h.reduce((v,x)=>v+x.real,0)),A=h.reduce((v,x)=>v+Math.abs(x.estimado),0),f=h.length===0?null:A>0?h.reduce((v,x)=>v+x.precision*Math.abs(x.estimado),0)/A:h.reduce((v,x)=>v+x.precision,0)/h.length,g=h.slice(-r),m=g.length>0?W(g.reduce((v,x)=>v+x.real,0)/g.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:h,estimadoTotal:y,realTotal:I,desviacionTotal:W(I-y),precision:f,mediaRealReciente:m,infraestimada:I>y}}function a(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>e(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const l=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};l.estimado+=i.estimadoTotal,l.real+=i.realTotal,l.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),l.peso+=Math.abs(i.estimadoTotal),l.n+=1,s.set(r,l)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:W(r.estimado),realTotal:W(r.real),desviacionTotal:W(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}function Hn(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Gn(t){const[e,a]=t.slice(0,7).split("-").map(Number),o=new Date(e,a-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function Vn(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function Un(t,e,a){const o=new Map(e.map(s=>[s._id,[]])),n=e.filter(s=>{var i;return!a(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const l of n){const u=(l.tags??[]).filter(b=>s.tags.includes(b)).length;u!==0&&(u>r||u===r&&i&&l._id<i._id)&&(i=l,r=u)}i&&o.get(i._id).push(s)}return o}function Yn(t,e,a,o={}){const{desde:n,hasta:s}=Hn(a),i=t.transacciones({desde:n,hasta:s}),r=i.filter(m=>m.importeCts<0),l=i.filter(m=>m.importeCts>0),u=e.filter(m=>m.tipo==="gasto"&&m.activo!==!1),b=new Map((o.analisis??[]).map(m=>[m.estimacionId,m])),p=new Set(u.filter(m=>t.transacciones({estimacionId:m._id}).length>0).map(m=>m._id)),d=Un(r,u,m=>p.has(m)),h=new Set,y=u.map(m=>{const $=d.get(m._id)??[];for(const S of $)h.add(S._id);const v=W($.reduce((S,C)=>S+Math.abs(C.importeCts)/100,0)),x=W(fo(m,a)),M=b.get(m._id);return{estimacionId:m._id,concepto:m.concepto,tags:m.tags??[],estimado:x,real:v,desviacion:W(v-x),sinMovimiento:$.length===0,sugerencia:M?Ye(M,m.cuantia,{hoy:o.hoy}):null}}),I=new Map;for(const m of r){if(h.has(m._id))continue;const $=Vn(m.concepto),v=I.get($)??{concepto:m.concepto,total:0,movimientos:0};v.total=W(v.total+Math.abs(m.importeCts)/100),v.movimientos+=1,I.set($,v)}const A=[...I.values()].sort((m,$)=>$.total-m.total),f=W(y.reduce((m,$)=>m+$.estimado,0)),g=W(r.reduce((m,$)=>m+Math.abs($.importeCts)/100,0));return{mes:a,estimado:f,real:g,desviacion:W(g-f),ingresosReales:W(l.reduce((m,$)=>m+$.importeCts/100,0)),filas:y.sort((m,$)=>Math.abs($.desviacion)-Math.abs(m.desviacion)),sinEstimacion:A,totalSinEstimacion:W(A.reduce((m,$)=>m+$.total,0)),vacio:i.length===0}}function vo(t){const e=new Set;for(const a of t.transacciones())e.add(a.fecha.slice(0,7));return[...e].sort().reverse()}function Jn(){return{mes:""}}function Ke(t,e){if(e.mes)return e.mes;const a=vo(t.ledger),o=Gn((t.hoy??J)());return a.includes(o)?o:a[0]??o}function Xe(t,e){const a=(t.hoy??J)(),o=t.estimaciones(),n=t.precision.analizarTodas(o,{hoy:a});return Yn(t.ledger,o,e,{analisis:n,hoy:a})}function Wn(t,e){const a=Ke(t,e),o=vo(t.ledger);o.includes(a)||o.unshift(a);const n=Xe(t,a),s=`
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

      ${Qn(n)}
      ${Kn(n)}
    </div>`}function Qn(t){const e=t.filas.filter(o=>o.estimado>0||o.real>0);if(e.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas para este mes.</div>';const a=e.filter(o=>o.sugerencia);return`
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
           </div>`:""}`}function Kn(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function Xn(t,e,a,o){Y(t,"#cie-mes",n=>{a.mes=n.value,o()}),T(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=Xe(e,Ke(e,a)).filas.find(l=>l.estimacionId===s);r!=null&&r.sugerencia&&(e.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(e.hoy??J)()}),q(`«${r.concepto}» ajustada a ${j(r.sugerencia.cuantiaSugerida)}`),e.onDatosCambiados(),o())}),T(t,"[data-cie-ajustar-todas]",()=>{const s=Xe(e,Ke(e,a)).filas.map(l=>l.sugerencia).filter(l=>l!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=e.adjuster.aplicarTodas(s,{hoy:(e.hoy??J)()});q(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),e.onDatosCambiados(),o()})}const Zn="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function ti(t){const e={cuentaId:"",mes:(t.hoy??J)().slice(0,7),filtroTexto:""},a=ge(),o=Jn(),n=()=>{var p;return(p=t.onDatosCambiados)==null?void 0:p.call(t)},s=t.hoy??J,i={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:n,hoy:s},r={ledger:t.ledger,accounts:t.accounts,onDatosCambiados:n},l={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:n,hoy:s},u={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:n,hoy:s};function b(p){const d=t.ledger.saldoTotal(s()),h=t.ledger.ultimaFecha(),y=t.ledger.transacciones().length;p.innerHTML=`
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
          <div style="font-size:11px;color:var(--text3)">${h?`último: ${c(h)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-importar"></div>
      <div id="acc-cierre" data-feature="precision-estimaciones"></div>
      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const I=p.querySelector("#acc-importar"),A=p.querySelector("#acc-cierre"),f=p.querySelector("#acc-transacciones"),g=p.querySelector("#acc-precision");I.innerHTML=Dn(r,a),A.innerHTML=Wn(l,o),f.innerHTML=$n(i,e),g.innerHTML=Mn(u);const m=()=>b(p);Nn(I,r,a,m),Xn(A,l,o,m),In(f,i,e,m),Sn(g,u,m)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:Zn,mount:b}}const ei="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Ze(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function ai(t){const{store:e}=t,a=t.hoy??J,o=()=>G(a()),n=()=>e.get("config").margenesSeguridad??[];function s(h){var y;e.patchConfig({margenesSeguridad:h}),(y=t.onDatosCambiados)==null||y.call(t)}function i(h,y){const I=n().map(f=>({...f,puntos:(f.puntos??[]).map(g=>({...g}))})),A=I.find(f=>f._id===h);A&&(y(A),s(I))}function r(h){const y=e.get("config"),I=pe(h,e.get("expenses"),y,e.get("loans"),a(),!1,o());return j(I)}function l(h,y,I){const A=y.tipo==="fijo",f=A?"":`<span class="text-sm" style="color:var(--text3)">${c(j((y.meses??0)*I))}</span>`;return`
      <tr data-punto="${c(y._id)}" data-margen="${c(h._id)}">
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
      </tr>`}function u(h,y,I){const A=h.cuentas&&h.cuentas.length>0?h.cuentas.map($=>{var v;return((v=y.find(x=>x._id===$))==null?void 0:v.nombre)??$}).join(", "):"Todas las cuentas activas",g=[...h.puntos??[]].sort(($,v)=>$.fecha.localeCompare(v.fecha)).map($=>l(h,$,I)).join(""),m=h.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${c(A)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${c(r(h))}</strong>
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
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${c(h._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${c(h.nombre)}</span>
            <span class="badge ${h.activo?"badge-active":"badge-inactive"}">${h.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${h.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${h.activo?"checked":""} data-toggle-margen="${c(h._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${c(h._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${c(h._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${m}
      </div>`}function b(h,y){const I=y?n().find(m=>m._id===y):null,A=e.get("accounts").filter(m=>m.activo),f=new Set((I==null?void 0:I.cuentas)??[]),g=A.map(m=>`
        <label class="tag" data-chip="${c(m._id)}" style="cursor:pointer;${f.has(m._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${c(m._id)}" ${f.has(m._id)?"checked":""} style="display:none"/>
          ${c(m.nombre)}
        </label>`).join(" ");h.innerHTML=`
      <div class="modal-title">${y?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${c((I==null?void 0:I.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${g||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${I?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${c(J())}"/></div>
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
      </div>`}function p(h,y){const I=document.getElementById("modal-overlay"),A=document.getElementById("modal-content");!I||!A||(b(A,h),I.classList.remove("hidden"),Y(A,".mg-acc-chip",f=>{const g=f,m=A.querySelector(`[data-chip="${g.value}"]`);m&&(m.style.cssText=`cursor:pointer;${g.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),Y(A,"#mg-p-tipo",f=>{const g=f.value==="fijo",m=A.querySelector("#mg-p-importe-wrap"),$=A.querySelector("#mg-p-meses-wrap");m&&(m.style.display=g?"":"none"),$&&($.style.display=g?"none":"")}),T(A,"[data-cerrar-form]",()=>I.classList.add("hidden")),T(A,"[data-guardar-margen]",f=>{var x,M,S,C,z;const g=f.getAttribute("data-guardar-margen")||"",m=((x=A.querySelector("#mg-nombre"))==null?void 0:x.value.trim())??"";if(!m)return q("El nombre es obligatorio","err");const $=[...A.querySelectorAll(".mg-acc-chip:checked")].map(E=>E.value),v=n().map(E=>({...E}));if(g){const E=v.findIndex(F=>F._id===g);if(E===-1)return q("Margen no encontrado","err");v[E]={...v[E],nombre:m,cuentas:$}}else{const E=((M=A.querySelector("#mg-p-tipo"))==null?void 0:M.value)??"fijo",F={_id:Ze(),fecha:((S=A.querySelector("#mg-p-fecha"))==null?void 0:S.value)||J(),tipo:E,importe:parseFloat(((C=A.querySelector("#mg-p-importe"))==null?void 0:C.value)??"0")||0,meses:parseFloat(((z=A.querySelector("#mg-p-meses"))==null?void 0:z.value)??"1")||1};v.push({_id:Ze(),nombre:m,activo:!0,cuentas:$,puntos:[F]})}s(v),q(g?"Margen actualizado":"Margen creado"),I.classList.add("hidden"),y()}))}function d(h){const y=n(),I=e.get("accounts"),A=Wt(e.get("expenses"),o());h.innerHTML=`
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
             </div>`:y.map(g=>u(g,I,A)).join("")}`;const f=()=>d(h);T(h,"[data-nuevo-margen]",()=>p(null,f)),T(h,"[data-editar-margen]",g=>p(g.getAttribute("data-editar-margen"),f)),T(h,"[data-borrar-margen]",g=>{Z("¿Eliminar este margen de seguridad?")&&(s(n().filter(m=>m._id!==g.getAttribute("data-borrar-margen"))),q("Margen eliminado"),f())}),Y(h,"[data-toggle-margen]",g=>{const m=g.getAttribute("data-toggle-margen");i(m,$=>{$.activo=g.checked}),f()}),T(h,"[data-add-punto]",g=>{const m=g.getAttribute("data-add-punto");i(m,$=>{$.puntos=[...$.puntos??[],{_id:Ze(),fecha:J(),tipo:"fijo",importe:0,meses:1}]}),f()}),T(h,"[data-borrar-punto]",g=>{const m=g.closest("[data-punto]");if(!m)return;const $=m.dataset.margen,v=m.dataset.punto;i($,x=>{x.puntos=(x.puntos??[]).filter(M=>M._id!==v)}),f()}),Y(h,"[data-campo]",g=>{const m=g.closest("[data-punto]");if(!m)return;const $=g.getAttribute("data-campo"),v=g.value;i(m.dataset.margen,x=>{const M=(x.puntos??[]).find(S=>S._id===m.dataset.punto);M&&($==="fecha"?M.fecha=v:$==="tipo"?M.tipo=v:$==="importe"?M.importe=parseFloat(v)||0:M.meses=parseFloat(v)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:ei,mount:d}}const oi="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function si(t){const e=Array.isArray(t)?t[1]??[]:[];return Array.isArray(e)?e.filter(a=>a&&a.value!==null&&a.value!==void 0&&Number.isFinite(Number(a.value))).map(a=>({year:parseInt(a.date),tasa:parseFloat(Number(a.value).toFixed(2))})).filter(a=>Number.isFinite(a.year)).sort((a,o)=>a.year-o.year):[]}function ni({fetchImpl:t,url:e=oi}={}){let a=null,o=!1;async function n(s=!1){if(a&&!s)return a;if(o)return null;o=!0;try{const r=await(t??fetch)(e);if(!r.ok)throw new Error(`HTTP ${r.status}`);return a=si(await r.json()),a}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:n,invalidar:()=>{a=null},get enCache(){return a}}}const ii="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function ri(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function li(t){const{store:e}=t,a=t.ipc??ni(),o=()=>e.get("inflacion")??[];function n(){var p;(p=t.onDatosCambiados)==null||p.call(t)}function s(p,d){if(!p||p.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const h=new Set(o().map(g=>g.year)),y=p.filter(g=>g.year>=d).reverse(),I=y.filter(g=>!h.has(g.year)).length,A=[...new Set(p.map(g=>g.year))].sort((g,m)=>g-m),f=y.map(g=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${g.year}" data-tasa="${g.tasa}" ${h.has(g.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${g.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${ri(g.tasa)}">${g.tasa.toFixed(2)}%</span>
          ${h.has(g.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${A.map(g=>`<option value="${g}"${g===d?" selected":""}>${g}</option>`).join("")}
        </select>
        <span style="font-size:10px;color:var(--text3)">
          Fuente: Banco Mundial · FP.CPI.TOTL.ZG · ${p[0].year}–${p[p.length-1].year}
        </span>
        <button class="btn-secondary btn-sm" data-ipc-recargar title="Forzar recarga desde la API">↺</button>
      </div>
      <div style="max-height:300px;overflow-y:auto;margin-bottom:12px">${f}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="font-size:12px;color:var(--text3)">${I} periodo${I!==1?"s":""} nuevo${I!==1?"s":""} disponible${I!==1?"s":""}</span>
        <div class="flex gap-8">
          <button class="btn-secondary" data-ipc-cerrar>Cancelar</button>
          <button class="btn-primary" data-ipc-importar ${I===0?"disabled":""}>↓ Importar seleccionados</button>
        </div>
      </div>`}function i(p){return!p||p.length===0?2e3:Math.max(p[0].year,new Date().getFullYear()-25)}async function r(p){const d=document.getElementById("modal-overlay"),h=document.getElementById("modal-content");if(!d||!h)return;h.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,d.classList.remove("hidden");const y=(A,f)=>{const g=document.getElementById("ipc-body");g&&(g.innerHTML=s(A,f))},I=await a.obtener();y(I,i(I)),T(h,"[data-ipc-cerrar]",()=>d.classList.add("hidden")),Y(h,"#ipc-desde",A=>{y(a.enCache,parseInt(A.value))}),T(h,"[data-ipc-recargar]",()=>{a.invalidar();const A=document.getElementById("ipc-body");A&&(A.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),a.obtener(!0).then(f=>y(f,i(f)))}),T(h,"[data-ipc-importar]",()=>{const A=[...h.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(A.length===0)return q("Nada seleccionado","err");const f=new Set(o().map(m=>m.year));let g=0;for(const m of A){const $=parseInt(m.dataset.year??""),v=parseFloat(m.dataset.tasa??"");!Number.isFinite($)||!Number.isFinite(v)||f.has($)||(e.addItem("inflacion",{year:$,tasa:v}),f.add($),g++)}d.classList.add("hidden"),q(`${g} periodo${g!==1?"s":""} importado${g!==1?"s":""} correctamente`),n(),p()})}function l(p,d){var f;const h=document.getElementById("modal-overlay"),y=document.getElementById("modal-content");if(!h||!y)return;const I=p?o().find(g=>g._id===p):null;y.innerHTML=`
      <div class="modal-title">${p?"Editar periodo de inflación":"Nuevo periodo de inflación"}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Año</label>
          <input class="form-input" type="number" id="inf-year" value="${(I==null?void 0:I.year)??new Date().getFullYear()}" placeholder="2026"/></div>
        <div class="form-group"><label class="form-label">Tasa anual (%)</label>
          <input class="form-input" type="number" id="inf-tasa" step="0.01" value="${(I==null?void 0:I.tasa)??""}" placeholder="3.5"/></div>
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-inf-cerrar>Cancelar</button>
        <button class="btn-primary" data-inf-guardar="${c(p??"")}">Guardar</button>
      </div>`,h.classList.remove("hidden");const A=()=>{var x;const g=parseFloat(((x=y.querySelector("#inf-tasa"))==null?void 0:x.value)??""),m=y.querySelector("#inf-preview");if(!m)return;if(!Number.isFinite(g)||g<=0){m.innerHTML="";return}const $=(Math.pow(1+g/100,1/12)-1)*100,v=Math.pow(1+g/100,5);m.innerHTML=`Con un ${g}% anual: <strong>${$.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${v.toFixed(3)}</strong> (+${((v-1)*100).toFixed(1)}%)`};(f=y.querySelector("#inf-tasa"))==null||f.addEventListener("input",A),A(),T(y,"[data-inf-cerrar]",()=>h.classList.add("hidden")),T(y,"[data-inf-guardar]",g=>{const m=g.getAttribute("data-inf-guardar")||"",$=parseInt(y.querySelector("#inf-year").value),v=parseFloat(y.querySelector("#inf-tasa").value);if(!Number.isFinite($)||$<1900||$>2200)return q("Año inválido","err");if(!Number.isFinite(v)||v<0||v>100)return q("Tasa inválida (0–100%)","err");if(o().filter(M=>M._id!==m).some(M=>M.year===$))return q("Ya existe un periodo para ese año","err");m?(e.updateItem("inflacion",m,{year:$,tasa:v}),q("Periodo actualizado")):(e.addItem("inflacion",{year:$,tasa:v}),q("Periodo añadido")),h.classList.add("hidden"),n(),d()})}function u(p,d){const h=(Math.pow(1+p.tasa/100,.08333333333333333)-1)*100,y=`${p.year}-12-31`,I=y>d?pt([p],d,y):null;return`
      <div class="exp-table-row" data-periodo="${c(p._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${p.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${p.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${h.toFixed(3)}%/mes</div>
        <div class="num">${I!==null?`×${I.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${c(p._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${c(p._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function b(p){const d=o(),h=e.get("config").usarInflacion||!1,y=[...d].sort((x,M)=>M.year-x.year),I=J(),A=new Date().getFullYear(),f=V(new Date(A+5,0,1)),g=V(new Date(A+10,0,1)),m=h&&d.length>0?pt(d,I,f):null,$=h&&d.length>0?pt(d,I,g):null;p.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${!h&&d.length===0?`<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
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
            <input type="checkbox" data-toggle-inflacion ${h?"checked":""}/>
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${m!==null&&$!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${m.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((m-1)*100).toFixed(1)}%)</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +10 años</div>
            <div class="stat-value neg">×${$.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${(($-1)*100).toFixed(1)}%)</span></div>
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
        ${y.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':y.map(x=>u(x,I)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const v=()=>b(p);Y(p,"[data-toggle-inflacion]",x=>{const M=x.checked;e.patchConfig({usarInflacion:M}),q(M?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),n(),v()}),T(p,"[data-nuevo-periodo]",()=>l(null,v)),T(p,"[data-editar-periodo]",x=>l(x.getAttribute("data-editar-periodo"),v)),T(p,"[data-importar-ipc]",()=>void r(v)),T(p,"[data-borrar-periodo]",x=>{Z("¿Eliminar este periodo de inflación?")&&(e.removeItem("inflacion",x.getAttribute("data-borrar-periodo")),q("Periodo eliminado"),n(),v())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:ii,mount:b}}const ci=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],di=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],ui=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function pi(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const ta=(t,e)=>t.map(([a,o])=>`<option value="${c(a)}"${a===e?" selected":""}>${c(o)}</option>`).join("");function go(t,e="dp"){const{modo:a,dia:o,nth:n,wd:s}=pi(t),i=ta(ci.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${c(e)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${ta(di,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${ta(ui,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function bo(t){var o,n,s;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=e.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",a==="dia"?"":"none"),(s=e.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",a==="nthweekday"?"":"none")}function ho(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=n=>{var s;return((s=e.querySelector(n))==null?void 0:s.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const mi="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",fi=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function vi(t){const e=t.hoy??J,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},n=()=>t.store.get("accounts"),s=f=>{var g;return((g=n().find(m=>m._id===(f||"default")))==null?void 0:g.nombre)??(f||"default")};function i(){const f=e();let g=[...t.store.get("expenses")];if(a.mostrarExpirados||(g=g.filter(m=>!m.fechaFin||m.fechaFin>=f)),a.tipo&&(g=g.filter(m=>m.tipo===a.tipo)),a.cuenta&&(g=g.filter(m=>(m.cuenta||"default")===a.cuenta)),a.desde&&(g=g.filter(m=>(m.fechaInicio??"")>=a.desde)),a.hasta&&(g=g.filter(m=>(m.fechaInicio??"")<=a.hasta)),a.busqueda){const m=a.busqueda.toLowerCase();g=g.filter($=>$.concepto.toLowerCase().includes(m))}return a.tags.size>0&&(g=g.filter(m=>(m.tags||[]).some($=>a.tags.has($)))),g.sort((m,$)=>{const v=m[a.orden]??"",x=$[a.orden]??"";return typeof v=="number"&&typeof x=="number"?(v-x)*a.sentido:String(v).localeCompare(String(x))*a.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function l(f,g){const m=a.orden===f?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${c(g)} <span class="sort-arrow">${m}</span></span>`}function u(f,g=!1){return(g?'<option value="">Todas las cuentas</option>':"")+n().filter($=>$.activo!==!1).map($=>`<option value="${c($._id)}"${$._id===f?" selected":""}>${c($.nombre)}</option>`).join("")}function b(f){const g=f.tipo==="transferencia",m=Se(f.diaPago??""),$=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${m?` · ${m}`:""}`,v=!!f.fechaFin&&f.fechaFin<e(),x=g?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',M=g?`${c(s(f.cuenta))} → ${c(s(f.cuentaDestino))}`:c(s(f.cuenta)),S=(f.tags||[]).map(C=>`<span class="tag${a.tags.has(C)?" active":""}" data-tag="${c(C)}" title="Filtrar por ${c(C)}">${c(C)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(f.concepto)}</div>
        <div class="tag-list mt-4">${S}</div>
      </div>
      <div>${x}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":g?"":"neg"}">${g?"⇄ ":""}${c(j(f.cuantia))}</div>
      <div class="text-sm">${c($)}</div>
      <div class="text-sm exp-col-hide">${M}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${c(f._id)}"${f.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${f.tipo==="gasto"&&f.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
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
    </div>`}function p(f){const g=i(),m=r();f.innerHTML=`
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
      ${m.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${m.map($=>`<span class="tag${a.tags.has($)?" active":""}" data-tag="${c($)}">${c($)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${l("concepto","Concepto")} ${l("tipo","Tipo")} ${l("cuantia","Cuantía")} ${l("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${g.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':g.map(b).join("")}
      </div>`}function d(f){const g=(f==null?void 0:f.tipo)==="transferencia",m=t.store.get("escenarios"),$=(f==null?void 0:f.escenarioIds)||[],v=(x,M,S,C,z="")=>`<div class="form-group"><label class="form-label">${c(M)}</label>
       <input class="form-input" type="${S}" id="${x}" value="${c(C)}" placeholder="${c(z)}"/></div>`;return`
      <div class="grid-2">
        ${v("ef-concepto","Concepto","text",(f==null?void 0:f.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(f==null?void 0:f.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${g?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${v("ef-cuantia","Cuantía (€)","number",(f==null?void 0:f.cuantia)??"","500")}
        ${v("ef-frecuencia","Frecuencia","number",(f==null?void 0:f.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${fi.map(([x,M])=>`<option value="${x}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===x?" selected":""}>${c(M)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${v("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??e())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${u((f==null?void 0:f.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${g?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${u((f==null?void 0:f.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(f==null?void 0:f.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${f!=null&&f._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${v("ef-fecha-fin","Fecha fin (opcional)","date",(f==null?void 0:f.fechaFin)??"")}</div>
          <div class="mt-8">${go(f==null?void 0:f.diaPago,"exp")}</div>
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
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${$.includes(x._id)?c(x.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${c(x._id)}"${$.includes(x._id)?" checked":""}/>
                          ${c(x.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${c((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function h(f){var $;const g=(($=f.querySelector("#ef-tipo"))==null?void 0:$.value)??"gasto",m=(v,x)=>{const M=f.querySelector(v);M&&(M.style.display=x?"":"none")};m("#ef-destino-wrap",g==="transferencia"),m("#ef-basico-wrap",g!=="transferencia"),m("#ef-irpf-wrap",g==="ingreso"),m("#ef-clasificacion-wrap",g==="gasto")}function y(f,g,m){const $=document.getElementById("modal-overlay"),v=document.getElementById("modal-content");!$||!v||(v.innerHTML=`<div class="modal-title">${c(g)}</div>${d(f)}`,$.classList.remove("hidden"),Y(v,"#ef-tipo",()=>h(v)),Y(v,"[data-dp-modo]",()=>bo(v)),T(v,"[data-cancelar]",()=>$.classList.add("hidden")),T(v,"[data-guardar]",x=>{I(v,x.getAttribute("data-guardar")||"")&&($.classList.add("hidden"),m())}))}function I(f,g){const m=E=>{var F;return((F=f.querySelector(E))==null?void 0:F.value)??""},$=E=>{var F;return!!((F=f.querySelector(E))!=null&&F.checked)},v=m("#ef-tipo")||"gasto",x=v==="transferencia",M=m("#ef-concepto").trim(),S=parseFloat(m("#ef-cuantia"));if(!M||!Number.isFinite(S))return q("Concepto y cuantía obligatorios","err"),!1;const C=m("#ef-clasificacion"),z={concepto:M,tipo:v,cuantia:S,frecuencia:parseInt(m("#ef-frecuencia"),10)||1,tipoFrecuencia:m("#ef-tipo-frec")||"mensual",fechaInicio:m("#ef-fecha-ini"),fechaFin:m("#ef-fecha-fin")||null,diaPago:ho(f),cuenta:m("#ef-cuenta"),cuentaDestino:x?m("#ef-cuenta-dest")||"default":void 0,activo:$("#ef-activo"),basico:!x&&$("#ef-basico"),sujetoIRPF:!x&&$("#ef-sujetoIRPF"),clasificacion:v==="gasto"?C||null:void 0,tags:x?["transferencia"]:m("#ef-tags").split(",").map(E=>E.trim()).filter(Boolean),escenarioIds:[...f.querySelectorAll(".ef-escenario:checked")].map(E=>E.value)};return g?(t.store.updateItem("expenses",g,z),q("Actualizado")):(t.store.addItem("expenses",z),q("Creado")),o(),!0}function A(f,g){const m=f.querySelector("[data-busqueda]");let $;m==null||m.addEventListener("input",()=>{clearTimeout($),$=setTimeout(()=>{a.busqueda=m.value,g();const v=f.querySelector("[data-busqueda]");v==null||v.focus(),v==null||v.setSelectionRange(v.value.length,v.value.length)},250)}),Y(f,"[data-expirados]",v=>{a.mostrarExpirados=v.checked,g()}),Y(f,"[data-f-tipo]",v=>{a.tipo=v.value,g()}),Y(f,"[data-f-cuenta]",v=>{a.cuenta=v.value,g()}),Y(f,"[data-f-desde]",v=>{a.desde=v.value,g()}),Y(f,"[data-f-hasta]",v=>{a.hasta=v.value,g()}),T(f,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,g()}),T(f,"[data-limpiar-tags]",()=>{a.tags=new Set,g()}),T(f,"[data-tag]",v=>{const x=v.getAttribute("data-tag");a.tags.has(x)?a.tags.delete(x):a.tags.add(x),g()}),T(f,"[data-orden]",v=>{const x=v.getAttribute("data-orden");a.orden===x?a.sentido=a.sentido===1?-1:1:(a.orden=x,a.sentido=1),g()}),T(f,"[data-nuevo]",()=>y(null,"Nuevo gasto/ingreso",g)),T(f,"[data-editar]",v=>{const x=t.store.get("expenses").find(M=>M._id===v.getAttribute("data-editar"));x&&y(x,"Editar",g)}),T(f,"[data-duplicar]",v=>{const x=t.store.get("expenses").find(C=>C._id===v.getAttribute("data-duplicar"));if(!x)return;const{_id:M,...S}=x;y({...S,concepto:`${x.concepto} (copia)`},"Duplicar movimiento",g)}),T(f,"[data-borrar]",v=>{Z("¿Eliminar?")&&(t.store.removeItem("expenses",v.getAttribute("data-borrar")),q("Eliminado"),o(),g())}),Y(f,"[data-activo]",v=>{const x=v;t.store.updateItem("expenses",x.getAttribute("data-activo"),{activo:x.checked}),o(),g()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:mi,mount(f){const g=()=>p(f);p(f),f.dataset.wired!=="1"&&(A(f,g),f.dataset.wired="1")}}}function be(t,e,a){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=pt(e,a,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function yo(t,e,a,o){return t.reduce((n,s)=>{const i=pt(e,a,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function gi(t,e,a){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=at({...t,amortizaciones:o.slice(0,s)}),r=at({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:be(i.tabla,e,a)-be(r.tabla,e,a)}})}const ea=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${c(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function bi(t,e){const a=va(t),o=(t.amortizaciones||[]).length>0,n=e.periodos.length>0,s=e.usarInflacion&&n,i=n?ga(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,r=n?ba(t.tin||0,i):null,l=o&&n?gi(t,e.periodos,e.hoy):[],u=l.length?be(a.sinAmort.tabla,e.periodos,e.hoy)-be(a.tabla,e.periodos,e.hoy):null,b=u===null?null:u-a.costeTotalAmort,p=s?yo(a.tabla,e.periodos,e.hoy,a.comAp):null,d=s&&o?yo(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${c(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${c(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(t.tags||[]).map(h=>`<span class="tag">${c(h)}</span>`).join("")}
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
               ${u!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${c(j(a.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${c(j(u))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${c(j(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${c(j(a.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(b??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${c(j(b??0))}</div>
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

      ${p!==null?hi(t,a.totalPagado,p,d):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(h=>yi(h,s,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((h,y)=>xi(t._id,h,l[y]??null,e)).join("")}`:""}
    </div>
  </div>`}function hi(t,e,a,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-a,l=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
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
  </div>`}function yi(t,e,a){let o="";if(e&&!t.esAmortizacion){const n=pt(a.periodos,a.hoy,t.fecha);o=c(j(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":c(t.mes)}</td>
    <td class="num">${c(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":c(j(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${c(j(t.interes))}</td>
    <td class="num">${c(j(t.amortizacion))}</td>
    <td class="num">${c(j(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function xi(t,e,a,o){const n=(e.escenarioIds||[]).map(s=>`<span class="badge badge-yellow">🔭 ${c(o.nombreEscenario(s))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
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
   </select></div>`,ae=(t,e,a,o="")=>`<label class="form-label">${c(e)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${a?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${c(o)}</span>`:""}`;function oe(t,e,a){return t.length===0?"":`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${t.map(o=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${e.includes(o._id)?c(o.color||"var(--accent)"):"var(--border)"}">
            <input type="checkbox" class="${c(a)}" value="${c(o._id)}"${e.includes(o._id)?" checked":""}/>
            ${c(o.nombre)}
          </label>`).join("")}
    </div></div>`}const $i=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function Ii(t,e,a,o=J()){return`
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
            <select class="form-select" id="f-cuenta">${$i(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${go(t==null?void 0:t.diaPago,"loan")}
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
          ${ae("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${oe(a,(t==null?void 0:t.escenarioIds)??[],"loan-escenario")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${ae("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${ae("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${ae("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Ai(t,e,a,o=J()){return`
    <div class="grid-2">
      ${tt("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??o)}
      ${tt("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Lt("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(e==null?void 0:e.tipo)??"cuota")}
    </div>
    ${oe(a,(e==null?void 0:e.escenarioIds)??[],"amort-escenario")}
    <div class="form-row mt-8">
      ${ae("am-sim","Simulación",!!(e!=null&&e.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${c(t)}|${c((e==null?void 0:e._id)??"")}">${e?"Guardar cambios":"Añadir"}</button>
    </div>`}const xo="opt_",$o=t=>String(t).startsWith(xo);function Mi(t){let e=null,a=null;const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content");function s(m,$){const v=o(),x=n();return!v||!x?null:(x.innerHTML=`<div class="modal-title">${c(m)}</div>${$}`,v.classList.remove("hidden"),x)}const i=()=>{var m;return(m=o())==null?void 0:m.classList.add("hidden")};function r(){let m=!1;for(const $ of t.loans()){const v=($.amortizaciones||[]).filter(x=>!$o(x._id));v.length!==($.amortizaciones||[]).length&&(t.guardarAmortizaciones($._id,v),m=!0)}return m}function l(m){try{return m()}catch($){return q($ instanceof Error?$.message:"No se ha podido completar el cálculo","err"),null}}function u(){var C,z;if(!La("optimizador")){q("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const m=t.loans().filter(E=>E.activo&&!E.simulacion);if(m.length===0){q("No hay préstamos activos para optimizar","err");return}const $=t.config(),v=t.accounts().filter(E=>E.activo&&!E.simulacion),x=((C=v.find(E=>E.esCuentaPrincipal))==null?void 0:C._id)??((z=v[0])==null?void 0:z._id)??"",M=$.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,S=s("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${v.map(E=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${c(E._id)}"${E._id===x?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(E.nombre)}${E._id===x?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${c(j(rt(E)))}</span>
              </label>`).join("")||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${m.map(E=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
              <input type="checkbox" class="opt-loan-check" value="${c(E._id)}"${E.tin>=5?" checked":""} style="accent-color:var(--accent)"/>
              <span style="font-size:13px;flex:1">${c(E.nombre)}</span>
              <span class="badge badge-yellow" style="font-size:11px">${c(E.tin)}% TIN</span>
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
        ${tt("opt-fecha-obj","Fecha objetivo para comparar saldo","date",M)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);S&&(b(S),Y(S,".opt-acc-radio",()=>b(S)),T(S,"[data-opt-todos]",()=>{const E=[...S.querySelectorAll(".opt-loan-check")],F=E.every(w=>w.checked);E.forEach(w=>w.checked=!F)}),T(S,"[data-cancelar]",i),T(S,"[data-opt-calcular]",()=>y(S)),T(S,"[data-opt-comparar]",()=>I(S)))}function b(m){var S;const $=(S=m.querySelector(".opt-acc-radio:checked"))==null?void 0:S.value,x=(t.config().margenesSeguridad||[]).filter(C=>C.activo!==!1).filter(C=>!C.cuentas||C.cuentas.length===0||$&&C.cuentas.includes($)),M=m.querySelector("#opt-margenes-wrap");M&&(M.innerHTML=x.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':x.map(C=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${c(C._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(C.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!C.cuentas||C.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function p(m){var M,S,C,z;const $=(E,F,w=0)=>{var D;const P=parseFloat(((D=m.querySelector(E))==null?void 0:D.value)??"");return Number.isFinite(P)?Math.max(w,P):F},v=[...m.querySelectorAll(".opt-loan-check")],x=v.filter(E=>E.checked).map(E=>E.value);return{horizonte:Math.round($("#opt-horizonte",60,1)),frecuencia:Math.round($("#opt-frecuencia",1,1)),minAmortizable:$("#opt-min",500),tipoAmort:((M=m.querySelector("#opt-tipo"))==null?void 0:M.value)||"plazo",fechaObjetivo:((S=m.querySelector("#opt-fecha-obj"))==null?void 0:S.value)||null,fechaPrimeraAmort:((C=m.querySelector("#opt-fecha-primera"))==null?void 0:C.value)||null,loanIds:v.length===0||x.length===v.length?null:x,sourceAccountId:((z=m.querySelector(".opt-acc-radio:checked"))==null?void 0:z.value)??null,selectedMarginIds:[...m.querySelectorAll(".opt-margin-check:checked")].map(E=>E.value)}}const d=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function h(m,$=""){const v=s("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${c(m)}</div>
        ${$?`<div class="text-sm mt-8" style="color:var(--text3)">${c($)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);v&&(T(v,"[data-opt-volver]",u),T(v,"[data-cancelar]",i))}function y(m){const $=p(m);r()&&q("Plan anterior eliminado, recalculando…");const{loans:v,expenses:x,accounts:M,config:S,nominas:C}=d(),z=l(()=>Oe(v,x,M,S,{frecuencia:$.frecuencia,mesesHorizonte:$.horizonte,minAmortizable:$.minAmortizable,tipoAmort:$.tipoAmort,fechaPrimeraAmort:$.fechaPrimeraAmort,loanIds:$.loanIds,nominas:C,sourceAccountId:$.sourceAccountId,selectedMarginIds:$.selectedMarginIds}));if(!z)return;if(z.plan.length===0){h(`No hay excedente suficiente respetando los ${z.margenesAplicados} márgenes de seguridad activos en los próximos ${$.horizonte} meses para generar amortizaciones por encima del mínimo de ${j($.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}a={plan:z.plan,tipoAmort:$.tipoAmort};const E=`✨ Plan de optimización · ${$.frecuencia===1?"Mensual":`Cada ${$.frecuencia} meses`} · ${$.horizonte}m`,F=s(E,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(j(z.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${c(j(z.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${c(j(z.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${z.margenesAplicados}</div></div>
      </div>
      ${z.resumenPorLoan.map(Ao).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${z.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${z.plan.map(w=>Io(w,!0)).join("")}</tbody>
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
      </div>`);F&&(T(F,"[data-opt-volver]",u),T(F,"[data-cancelar]",i),T(F,"[data-opt-aplicar]",()=>{a&&f(a.plan,a.tipoAmort)}))}function I(m){const $=p(m);r();const{loans:v,expenses:x,accounts:M,config:S,nominas:C}=d(),z=l(()=>Ha(v,x,M,S,{horizonte:$.horizonte,minAmortizable:$.minAmortizable,tipoAmort:$.tipoAmort,fechaObjetivo:$.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:$.fechaPrimeraAmort,loanIds:$.loanIds,nominas:C,sourceAccountId:$.sourceAccountId,selectedMarginIds:$.selectedMarginIds}));if(!z)return;if(z.resultados.length===0){h("No hay excedente suficiente en ninguna frecuencia.");return}e=z;const{resultados:E,saldoBase:F,fechaObjetivo:w}=z,P=E.map(R=>{const O=[R.esMejorIntereses&&"💰 +intereses",R.esMejorSaldo&&"🏦 +saldo",R.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${R.esMejorValor?"background:rgba(46,230,168,0.06);":""}">
          <td style="font-weight:600">${c(R.label)}</td>
          <td class="num">${R.numAmortizaciones}</td>
          <td class="num neg">${c(j(R.totalAmortizado))}</td>
          <td class="num pos">${c(j(R.ahorroIntereses))}</td>
          <td class="num ${R.saldoObjetivo>=F?"pos":"neg"}">${c(j(R.saldoObjetivo))}</td>
          <td class="num pos">${c(j(R.valorTotal))}</td>
          <td style="font-size:11px">${O}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${R.frecuencia}">Usar</button></td>
        </tr>`}).join(""),D=s(`📊 Comparativa de frecuencias · hasta ${w}`,`
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${c(w)}: <strong>${c(j(F))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${c(w.slice(0,7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${P}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);D&&(T(D,"[data-opt-volver]",u),T(D,"[data-cancelar]",i),T(D,"[data-opt-usar]",R=>A(Number(R.getAttribute("data-opt-usar")))))}function A(m){var v;const $=e==null?void 0:e.resultados.find(x=>x.frecuencia===m);$&&(r(),f($.plan,((v=$.plan[0])==null?void 0:v.tipoAmort)||"plazo",{titulo:`✨ Plan ${$.label} · aplicado`,resumen:$,fechaObjetivo:e==null?void 0:e.fechaObjetivo}))}function f(m,$,v){if(m.length===0)return;const x=new Map;for(const S of m){const C=x.get(S.loanId)??[];C.push({_id:`${xo}${S.mes}_${S.loanId}`,fecha:S.fechaAmort,cantidad:S.cantidadAmort,tipo:$,simulacion:!0}),x.set(S.loanId,C)}let M=0;for(const S of t.loans()){const C=x.get(S._id);if(!C)continue;const z=(S.amortizaciones||[]).filter(E=>!$o(E._id));t.guardarAmortizaciones(S._id,[...z,...C]),M+=1}q(`Plan aplicado: ${m.length} amortizaciones en ${M} préstamo${M!==1?"s":""} (simulación)`),v?g(v):i(),t.refrescar([...x.keys()])}function g({titulo:m,resumen:$,fechaObjetivo:v}){const x=s(m,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(j($.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${c(j($.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${c((v==null?void 0:v.slice(0,7))??"")}</div><div class="stat-value pos">${c(j($.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${c(j($.totalComisiones))}</div></div>
      </div>
      ${$.resumenPorLoan.map(Ao).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${$.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${$.plan.map(M=>Io(M,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);x&&T(x,"[data-cancelar]",i)}return{abrir:u,get planManual(){return a},get comparativa(){return e}}}function Io(t,e){const a=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${c(j(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${c(t.mes)}</td>
    <td>${c(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${c(j(t.capitalAntes))}</td>
    <td class="num neg">${c(j(t.cantidadAmort))}${a}</td>
    <td class="num">${c(j(t.capitalDespues))}</td>
    ${e?`<td class="num" style="color:var(--text3)">${c(j(t.saldoDisponible))} → ${c(j(t.saldoDespues))}</td>`:""}
  </tr>`}function Ao(t){return`<div class="card mb-8" style="padding:12px">
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
  </div>`}const Si="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function wi(t){const e=t.hoy??J;let a=!1;const o=new Set;let n=null;const s=()=>{var v;return(v=t.onDatosCambiados)==null?void 0:v.call(t)},i=()=>t.store.get("escenarios"),r=v=>{var x;return((x=i().find(M=>M._id===v))==null?void 0:x.nombre)??v};function l(v){if(!v.activo||v.simulacion)return!1;const x=at(v).tabla.filter(M=>!M.esAmortizacion);return x.length===0?!0:x[x.length-1].fecha<e()}function u(v,x){const M=e(),S=M.slice(0,7),C=new Map;let z=0;for(const E of v){if(!E.activo||E.simulacion||x.has(E._id)||(E.fechaInicio||"")>M)continue;const F=at(E).tabla.filter(P=>!P.esAmortizacion&&P.fecha.startsWith(S)),w=F.length>0?F[0].cuota:0;C.set(E._id,w),z+=w}return{porLoan:C,total:z,activos:[...C.values()].filter(E=>E>0).length}}function b(v){const x=t.store.get("config"),M=x.dashboardStart,S=x.dashboardEnd,C=Math.max(1,(G(S).getTime()-G(M).getTime())/(30.44*864e5));let z=0;for(const E of v)!E.activo||E.simulacion||(z+=at(E).tabla.filter(F=>!F.esAmortizacion&&F.fecha>=M&&F.fecha<=S).reduce((F,w)=>F+w.cuota,0));return{media:z/C,desde:M,hasta:S}}function p(v){const x=[...t.store.get("loans")].sort((P,D)=>D.tin-P.tin),M=new Set(x.filter(l).map(P=>P._id)),S=a?x:x.filter(P=>!M.has(P._id)),C=u(x,M),z=b(x),E=t.store.get("config"),F=t.store.get("inflacion"),w=new Date(G(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});v.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${M.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${M.size})</button>`:""}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${C.total>0||z.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${C.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${c(w)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${c(j(C.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${C.activos} préstamo${C.activos!==1?"s":""} activo${C.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${z.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${c(j(z.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${c(z.desde)} → ${c(z.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${S.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':S.map(P=>bi(P,{periodos:F,usarInflacion:!!E.usarInflacion,hoy:e(),cuotaMes:C.porLoan.get(P._id)??0,completado:M.has(P._id),nombreEscenario:r})).join("")}
      </div>`;for(const P of v.querySelectorAll("[data-body-loan]"))o.has(P.dataset.bodyLoan??"")&&P.classList.add("open")}const d=()=>document.getElementById("modal-overlay"),h=()=>document.getElementById("modal-content"),y=()=>{var v;return(v=d())==null?void 0:v.classList.add("hidden")};function I(v,x){const M=d(),S=h();return!M||!S?null:(S.innerHTML=`<div class="modal-title">${c(v)}</div>${x}`,M.classList.remove("hidden"),T(S,"[data-cancelar]",y),S)}function A(v,x){const M=v?t.store.get("loans").find(C=>C._id===v)??null:null,S=I(v?"Editar préstamo":"Nuevo préstamo",Ii(M,t.store.get("accounts"),i(),e()));S&&(S.addEventListener("change",C=>{var z;(z=C.target)!=null&&z.matches("[data-dp-modo]")&&bo(S)}),T(S,"[data-guardar-loan]",C=>{f(S,C.getAttribute("data-guardar-loan")||"")&&(y(),x())}))}function f(v,x){const M=P=>{var D;return((D=v.querySelector(P))==null?void 0:D.value)??""},S=P=>{var D;return!!((D=v.querySelector(P))!=null&&D.checked)},C=M("#f-nombre").trim(),z=parseFloat(M("#f-capital")),E=parseFloat(M("#f-tin")),F=parseInt(M("#f-meses"),10);if(!C||!Number.isFinite(z)||!Number.isFinite(E)||!Number.isFinite(F))return q("Completa los campos obligatorios","err"),!1;const w={nombre:C,capital:z,tin:E,meses:F,fechaInicio:M("#f-fecha"),comisionApertura:parseFloat(M("#f-com-ap"))||0,comisionAmort:parseFloat(M("#f-com-am"))||0,diaPago:ho(v),cuenta:M("#f-cuenta"),simulacion:S("#f-sim"),activo:S("#f-activo"),mostrarFechaFinEnDashboard:S("#f-mostrar-fin"),tipoTasa:M("#f-tipo-tasa"),basico:S("#f-basico"),tags:M("#f-tags").split(",").map(P=>P.trim()).filter(Boolean),escenarioIds:[...v.querySelectorAll(".loan-escenario:checked")].map(P=>P.value)};return x?(t.store.updateItem("loans",x,w),q("Préstamo actualizado")):(t.store.addItem("loans",{...w,amortizaciones:[]}),q("Préstamo creado")),s(),!0}function g(v,x,M){const S=t.store.get("loans").find(E=>E._id===v);if(!S)return;const C=x?(S.amortizaciones||[]).find(E=>E._id===x)??null:null,z=I(x?"Editar amortización":"Añadir amortización",Ai(v,C,i(),e()));z&&T(z,"[data-guardar-amort]",E=>{const[F,w]=(E.getAttribute("data-guardar-amort")||"").split("|");m(z,F,w)&&(y(),M([F]))})}function m(v,x,M){var D;const S=R=>{var O;return((O=v.querySelector(R))==null?void 0:O.value)??""},C=S("#am-fecha"),z=parseFloat(S("#am-cant"));if(!C||!Number.isFinite(z)||z<=0)return q("Fecha y cantidad requeridas","err"),!1;const E=t.store.get("loans").find(R=>R._id===x);if(!E)return!1;const F={fecha:C,cantidad:z,tipo:S("#am-tipo"),simulacion:!!((D=v.querySelector("#am-sim"))!=null&&D.checked),escenarioIds:[...v.querySelectorAll(".amort-escenario:checked")].map(R=>R.value)},w=E.amortizaciones||[],P=M?w.map(R=>R._id===M?{...R,...F}:R):[...w,{_id:Date.now().toString(36),...F}];return t.store.updateItem("loans",x,{amortizaciones:P}),q(M?"Amortización actualizada":"Amortización añadida"),s(),!0}function $(v,x,M){T(v,"[data-toggle-finalizados]",()=>{a=!a,x()}),T(v,"[data-nuevo-loan]",()=>A(null,x)),T(v,"[data-optimizar]",()=>M.abrir()),T(v,"[data-toggle-loan]",(S,C)=>{var w;if((w=C.target)!=null&&w.closest("button"))return;const z=S.getAttribute("data-toggle-loan"),E=[...v.querySelectorAll("[data-body-loan]")].find(P=>P.dataset.bodyLoan===z);(E==null?void 0:E.classList.toggle("open"))?o.add(z):o.delete(z)}),T(v,"[data-editar-loan]",S=>A(S.getAttribute("data-editar-loan"),x)),T(v,"[data-borrar-loan]",S=>{if(!Z("¿Eliminar préstamo?"))return;const C=S.getAttribute("data-borrar-loan");t.store.removeItem("loans",C),o.delete(C),q("Eliminado"),s(),x()}),T(v,"[data-amort-loan]",S=>{const C=S.getAttribute("data-amort-loan");o.add(C),g(C,null,x)}),T(v,"[data-editar-amort]",S=>{const[C,z]=(S.getAttribute("data-editar-amort")||"").split("|");o.add(C),g(C,z,x)}),T(v,"[data-borrar-amort]",S=>{const[C,z]=(S.getAttribute("data-borrar-amort")||"").split("|"),E=t.store.get("loans").find(F=>F._id===C);E&&(t.store.updateItem("loans",C,{amortizaciones:(E.amortizaciones||[]).filter(F=>F._id!==z)}),q("Amortización eliminada"),s(),x([C]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Si,mount(v){const x=(M=[])=>{for(const S of M)o.add(S);p(v)};n??(n=Mi({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(M,S)=>{t.store.updateItem("loans",M,{amortizaciones:S}),s()},hoy:e,refrescar:x})),p(v),v.dataset.wired!=="1"&&($(v,x,n),v.dataset.wired="1")}}}const Ci={transporte:125,restaurante:220,otros:null},ji={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},zi=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],kt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(n)}"/></div>`,Ei=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function Fi(t,e){const a=t.map((s,i)=>{const r=e.find(b=>b._id===s.cuenta),l=Ci[s.tipo],u=l!=null&&s.importe>l;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${c(ji[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${c(j(s.importe))}/mes${u?` <span style="color:var(--red)" title="Supera el límite orientativo de ${c(j(l))}/mes">⚠</span>`:""}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function _i(t,e){const a=e.hoy??J(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${kt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${kt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(s=>`<option value="${s}"${n&&o===s?" selected":""}>${s} pagas</option>`).join("")}
          <option value="custom"${n?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${Ei(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${kt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??a)}
          ${kt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${kt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${zi.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${c(s)} (${i+1})</option>`).join("")}
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
        ${oe(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"nom-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Mo(t,e){const a=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const l=parseFloat(a(i));return Number.isFinite(l)?l:r},n=a("#nf-npagas"),s=n==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Pe),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:e}}function Pi(t,e,a,o){const n=Mo(t,e),s=e.reduce((f,g)=>f+(g.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),l=n.irpfModo==="manual"?i*(n.irpfPct/100):ut(Mt(n.bruto,s),a.tramos),u=i-r-l,b=i/n.nPagas,p=r/n.nPagas,d=l/n.nPagas,h=b-p-d,y=n.grupoNomina?a.nominas.filter(f=>f.grupoNomina===n.grupoNomina&&f._id!==o):[],I=y.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${c(n.grupoNomina)}" con ${c(y.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",A=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${c(j(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${c(j(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${c(j(n.bruto))}</span>
      ${A}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${c(j(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${c(j(l))} (${i>0?(l/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${c(j(u))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${c(j(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${c(j(h))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${c(j(h))}/paga`:`ingreso ${c(j(b))} − SS ${c(j(p))} − IRPF ${c(j(d))}`}${s>0?" + recargas flex":""}</span>
    </div>${I}`}function Di(t,e,a,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=Fi(e,a.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=Pi(t,e,a,o))},i=()=>{var l,u;const r=(b,p)=>{const d=t.querySelector(b);d&&(d.style.display=p?"":"none")};r("#nf-custom-pagas-wrap",((l=t.querySelector("#nf-npagas"))==null?void 0:l.value)==="custom"),r("#nf-irpfpct-wrap",((u=t.querySelector("#nf-irpfmodo"))==null?void 0:u.value)==="manual"),s()};t.addEventListener("input",r=>{var l;(l=r.target)!=null&&l.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),Y(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),T(t,"[data-flex-anadir]",()=>{var u,b,p;const r=((u=t.querySelector("#fc-tipo"))==null?void 0:u.value)||"transporte",l=parseFloat(((b=t.querySelector("#fc-importe"))==null?void 0:b.value)??"")||0;if(!l)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:r,importe:l,cuenta:((p=t.querySelector("#fc-cuenta"))==null?void 0:p.value)||""}),n(),s()}),T(t,"[data-flex-borrar]",r=>{e.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const So=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function Ti(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??gt;function r(d,h){const y=o(),I=n();return!y||!I?null:(I.innerHTML=`<div class="modal-title">${c(d)}</div>${h}`,y.classList.remove("hidden"),T(I,"[data-cerrar]",s),I)}function l(){e=null;const d=[...t.store.get("tramosIRPFHistorico")].sort((I,A)=>I.año-A.año),h="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",y=r("Tramos IRPF por ejercicio",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
        Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${h}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(So(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${d.map(I=>`<div style="${h}">
              <span style="font-weight:600;font-size:13px">${I.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(So(I.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tabla="${I.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tabla="${I.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="irpf-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);y&&(T(y,"[data-editar-tabla]",I=>{const A=I.getAttribute("data-editar-tabla");p(A==="default"?"default":Number(A))}),T(y,"[data-borrar-tabla]",I=>{const A=Number(I.getAttribute("data-borrar-tabla"));Z(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),T(y,"[data-anadir-anyo]",()=>{var f;const I=parseInt(((f=y.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!I||I<2e3||I>2100)return q("Año inválido","err");const A=t.store.get("tramosIRPFHistorico");if(A.some(g=>g.año===I))return q("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...A,{_id:Date.now().toString(36),año:I,tramos:i().map(g=>[...g])}]),t.onDatosCambiados(),p(I)}))}function u(){return a.map(([d,h],y)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${y}" value="${d}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${y}" value="${h}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${y}">✕</button>
          </div>
        </div>`).join("")}function b(d){a=[...d.querySelectorAll("[data-tr-min]")].map((y,I)=>{const A=d.querySelector(`[data-tr-pct="${I}"]`);return[parseFloat(y.value)||0,parseFloat((A==null?void 0:A.value)??"")||0]})}function p(d){var g;e=d;const h=t.store.get("tramosIRPFHistorico");a=(d==="default"?i():((g=h.find(m=>m.año===d))==null?void 0:g.tramos)??i()).map(m=>[...m]);const I=d==="default"?"tabla por defecto":`ejercicio ${d}`,A=r(`Tramos IRPF — ${d==="default"?"Por defecto":d}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${c(I)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!A)return;const f=()=>{const m=A.querySelector("#irpf-tramos-rows");m&&(m.innerHTML=u())};T(A,"[data-volver]",l),T(A,"[data-tr-anadir]",()=>{b(A),a.push([0,0]),f()}),T(A,"[data-tr-borrar]",m=>{b(A),a.splice(Number(m.getAttribute("data-tr-borrar")),1),f()}),T(A,"[data-tr-guardar]",()=>{b(A);const m=[...a].sort(($,v)=>$[0]-v[0]);if(m.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:m}),q("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map($=>$.año===e?{...$,tramos:m}:$)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}const wo=1500,_t=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(n)}"/></div>`,Ri=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${c(n)}"${n===o?" selected":""}>${c(s)}</option>`).join("")}
   </select></div>`,Ni=t=>(t.modeloFondo||"cuenta")==="pension";function Oi(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>qi(n,e,a,o)).join("")}</div>`}function qi(t,e,a,o){const n=ue(t);if(!n)return"";const s=_e(t,e,a),i=o.slice(0,4),r=(t.aportaciones||[]).filter(u=>u.fecha>=`${i}-01-01`).reduce((u,b)=>u+b.cantidad,0),l=Math.min(r,wo)*(s/100);return`<div class="card">
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
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>wo?"neg":""}">${c(j(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${c(j(l))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${c(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${c(n.proxDesbloqueo)}</div>`:""}
  </div>`}function Li(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function ki(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
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
      ${Ri("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
    ${oe(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"pen-escenario")}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Bi(t,e,a){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=Li(e))};Y(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),T(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#paport-fin"))==null?void 0:l.value)||""}),o()}),T(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Hi(t,e,a,o){var A;const n=f=>{var g;return((g=t.querySelector(f))==null?void 0:g.value)??""},s=(f,g=0)=>{const m=parseFloat(n(f));return Number.isFinite(m)?m:g},i=f=>{var g;return!!((g=t.querySelector(f))!=null&&g.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const l=s("#pen-saldo"),u=n("#pen-grupo"),b={nombre:r,grupoNomina:u,saldo:l,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:u?0:s("#pen-impuesto"),planAportaciones:e,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(f=>f.value)},p=[...(a==null?void 0:a.historicoSaldos)??[]],d=[...(a==null?void 0:a.aportaciones)??[]],y=((A=[...p].sort((f,g)=>g.fecha.localeCompare(f.fecha))[0])==null?void 0:A.saldo)??(a==null?void 0:a.saldo)??null,I=Date.now().toString(36);return a?(y===null||Math.abs(l-y)>.005)&&(p.push({_id:I,fecha:o,saldo:l,nota:"Actualización manual"}),l>(y??0)&&d.push({_id:`${I}a`,fecha:o,cantidad:l-(y??0)})):l>0&&(p.push({_id:I,fecha:o,saldo:l,nota:"Saldo inicial"}),d.push({_id:`${I}a`,fecha:b.fechaInicialSaldo??o,cantidad:l})),{datos:{...b,historicoSaldos:p,aportaciones:d}}}const Gi="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Vi(t){const e=t.hoy??J,a=()=>{var A;return(A=t.onDatosCambiados)==null?void 0:A.call(t)};function o(){const A=t.store.get("config");return bt(t.store.get("tramosIRPFHistorico"),A.tramos_irpf??gt)(Number(e().slice(0,4)))}function n(A,f,g){const m=Te(A,f,g),$=!!f&&A.irpfModo!=="manual",v=[A.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${A.mesActualizacionIPC}">IPC m${A.mesActualizacionIPC}</span>`:"",m.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${c(j(m.flexAnual))}/año</span>`:"",Math.abs(m.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${m.ssPct.toFixed(2)}%</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(A.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${v}</div>
      </div>
      <div class="num">${c(j(m.brutoAnual))}
        ${m.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${c(j(m.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${c(j(m.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${m.nPagas} pagas</div>
      <div class="text-sm ${$?"neg":""}">${A.irpfModo==="manual"?`${c(A.irpfPct??0)}% (manual)`:`${m.irpfPct.toFixed(1)}% (auto)`}${$?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${A.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${c(s(A.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${c(A._id)}"${A.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${c(A._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${c(A._id)}">✕</button>
      </div>
    </div>`}const s=A=>{var f;return((f=t.store.get("accounts").find(g=>g._id===(A||"default")))==null?void 0:f.nombre)??(A||"default")};function i(A,f,g){const m=f.reduce((x,M)=>x+(M.bruto||0),0),$=us(f,g),v=m>0?$/m*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${c(A)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${c(j(m))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${v.toFixed(1)}%</strong> (${c(j($))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${f.map(x=>n(x,f,g)).join("")}
      </div>
    </div>`}function r(A){const f=o(),g=[...t.store.get("nominas")].sort((M,S)=>(S.bruto||0)-(M.bruto||0)),{grupos:m,sueltas:$}=ms(g),v=t.store.get("accounts").filter(Ni),x=g.filter(M=>M.activo!==!1);A.innerHTML=`
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
      ${[...m.entries()].map(([M,S])=>i(M,S,f)).join("")}
      ${$.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${$.map(M=>n(M,null,f)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Oi(v,x,f,e())}</div>`}const l=()=>document.getElementById("modal-overlay"),u=()=>document.getElementById("modal-content"),b=()=>{var A;return(A=l())==null?void 0:A.classList.add("hidden")};function p(A,f){const g=l(),m=u();return!g||!m?null:(m.innerHTML=`<div class="modal-title">${c(A)}</div>${f}`,g.classList.remove("hidden"),T(m,"[data-cancelar]",b),m)}function d(A,f){const g=A?t.store.get("nominas").find(x=>x._id===A)??null:null,m=[...(g==null?void 0:g.retribucionFlexible)??[]].map(x=>({...x})),$={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:o(),hoy:e()},v=p(A?"Editar nómina":"Nueva nómina",_i(g,$));v&&(Di(v,m,$,A??""),T(v,"[data-guardar-nomina]",x=>{const M=Mo(v,m);if(!M.nombre||M.bruto<=0)return q("Nombre y bruto anual son obligatorios","err");const S=x.getAttribute("data-guardar-nomina")||"",C={...M,activo:!0,tags:["nomina"]};S?(t.store.updateItem("nominas",S,C),q("Nómina actualizada")):(t.store.addItem("nominas",C),q("Nómina creada")),a(),b(),f()}))}function h(A,f){const g=A?t.store.get("accounts").find(v=>v._id===A)??null:null,m=[...(g==null?void 0:g.planAportaciones)??[]].map(v=>({...v})),$=p(A?"Editar plan de pensiones":"Nuevo plan de pensiones",ki(g,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:e()}));$&&(Bi($,m,e()),T($,"[data-guardar-pension]",v=>{const{datos:x,error:M}=Hi($,m,g,e());if(M)return q(M,"err");const S=v.getAttribute("data-guardar-pension")||"";S?(t.store.updateItem("accounts",S,x),q("Plan actualizado")):(t.store.addItem("accounts",x),q("Plan creado")),a(),b(),f()}))}function y(A,f,g){T(A,"[data-nueva-nomina]",()=>d(null,f)),T(A,"[data-editar-nom]",m=>d(m.getAttribute("data-editar-nom"),f)),T(A,"[data-borrar-nom]",m=>{Z("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",m.getAttribute("data-borrar-nom")),q("Eliminada"),a(),f())}),Y(A,"[data-activo-nom]",m=>{const $=m;t.store.updateItem("nominas",$.getAttribute("data-activo-nom"),{activo:$.checked}),a(),f()}),T(A,"[data-tramos]",()=>g.abrir()),T(A,"[data-nueva-pension]",()=>h(null,f)),T(A,"[data-editar-pension]",m=>h(m.getAttribute("data-editar-pension"),f)),T(A,"[data-borrar-pension]",m=>{Z("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",m.getAttribute("data-borrar-pension")),q("Plan eliminado"),a(),f())})}let I=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Gi,mount(A){const f=()=>r(A);I??(I=Ti({store:t.store,onDatosCambiados:()=>{a(),f()},año:()=>Number(e().slice(0,4))})),r(A),A.dataset.wired!=="1"&&(y(A,f,I),A.dataset.wired="1")}}}const Ui="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Yi="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",Co={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Ji={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Wi(t,e){const a=t.filter(l=>l.activo&&mt(l)==="inversion");if(a.length===0)return"";let o=0,n=0,s=0,i=0;for(const l of a){const u=Rt(l,e);u&&(o+=u.saldo,n+=u.costBase,s+=u.plusvalia,i+=u.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
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
    </div>`}function Qi(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,n=Math.max(1,(G(o).getTime()-G(a).getTime())/(30.44*864e5)),s=Vt(t,a),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(e.config.usarInflacion&&e.inflacion.length>0){const l=s*(pt(e.inflacion,a,o)-1),u=i-l;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${c(j(l))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${u>=0?"var(--accent)":"var(--red)"};font-weight:600">${c(j(u))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${c(a.slice(0,7))} → ${c(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${c(j(i))}</span>
    </div>${r}
  </div>`}function Ki(t,e){const a=Co[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,n=e.nominas.flatMap(h=>(h.retribucionFlexible??[]).filter(y=>y.cuenta===t._id).map(y=>({nomina:h,importe:y.importe}))),s=n.reduce((h,y)=>h+y.importe,0),i=s*12,r=o!==null&&i>o,l=o!==null?Math.min(i,o):i,u=t.grupoNomina?e.nominas.filter(h=>(h.grupoNomina||"")===t.grupoNomina&&h.activo!==!1):n.slice(0,1).map(h=>h.nomina),b=Ma(u,e.tramosIRPF),p=l*b/100,d=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${b}%`:`tipo marginal ${b}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
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
    ${p>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${c(d)}">≈ ${c(j(p))}/año <span style="font-size:10px;color:var(--text3)">(${c(b)}%)</span></span></div>`:""}
    ${n.length>0?n.map(h=>`<div style="font-size:11px;color:var(--text3)">↩ ${c(h.nomina.nombre)}: ${c(j(h.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function Xi(t){const e=ue(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(j(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(j(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${c(j(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${c(j(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${c(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${c(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function Zi(t,e){const a=Rt(t,e.tramosGanancias);if(!a)return"";const o=e.config,n=e.flujos(t._id),s=G(o.dashboardStart),i=G(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),l=a.saldo+n.totalAportaciones-n.totalReembolsos,u=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,b=l>0&&r>0?Math.max(0,l*Math.pow(1+u,r)):Math.max(0,l),p=a.costBase+n.totalAportaciones,d=Math.max(0,b-p),h=Fe(d,e.tramosGanancias),y=d>0?(h/d*100).toFixed(1):"0",I=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",A=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",f=(M,S,C)=>M.map(z=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${S} ${c(z.contraparte)}: ${c(z.concepto)}</span>
          <span class="num ${C}">${c(j(z.total))} · ${z.ocurrencias} mov.</span>
        </div>`).join(""),m=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${c(o.dashboardStart.slice(0,7))} → ${c(o.dashboardEnd.slice(0,7))})</div>
         ${f(n.entradas,"↓","pos")}
         ${f(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${c(j(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${c(j(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${c(j(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',$=e.invModo(t._id),v=M=>`padding:3px 10px;border-radius:20px;border:1px solid ${M?"var(--accent)":"var(--border)"};background:${M?"var(--accent-dim)":"transparent"};color:${M?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,x=$==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(j(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${c(j(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${c(j(a.neto))}</div><div class="stat-sub">${c(A)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${c(j(p))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${c(j(b))}</div><div class="stat-sub">${c(I)} · ${c(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${c(j(b-h))}</div><div class="stat-sub">${c(y)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${c(t._id)}|real" style="${v($==="real")}">Real</button>
          <button data-inv-modo="${c(t._id)}|proyeccion" style="${v($==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${x}
      ${m}
    </div>`}function tr(t,e){const a=[...t.historicoSaldos||[]].sort((l,u)=>u.fecha.localeCompare(l.fecha)),o=a[0],n=rt(t),s=mt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${c((Co[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(l=>`<span class="badge badge-yellow">🔭 ${c(e.nombreEscenario(l))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${c(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${c(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${c(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Yi}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Ui}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${c(j(t.saldoInicial||0))}</div><div class="stat-sub">${c(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${c(j(n))}</div>${o?`<div class="stat-sub">Registro: ${c(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${c(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${c(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Qi(t,e)}
    ${s==="beneficio"?Ki(t,e):""}
    ${s==="pension"?Xi(t):""}
    ${s==="inversion"?Zi(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${c(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${c(t.descripcion)}</div>`:""}
  </div>`}const er=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function ar(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function or(t,e){const a=t?mt(t):"cuenta",o=[...new Set(e.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${tt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Lt("ac-modelo","Tipo",er,a)}
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
        ${oe(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"ac-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function sr(t,e,a){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=ar(e))};Y(t,"#ac-modelo",n=>{const s=n.value,i=(r,l)=>{const u=t.querySelector(r);u&&(u.style.display=l?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),T(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#aport-fin"))==null?void 0:l.value)||""}),o()}),T(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function nr(t,e,a,o,n){const s=y=>{var I;return((I=t.querySelector(y))==null?void 0:I.value)??""},i=(y,I=0)=>{const A=parseFloat(s(y));return Number.isFinite(A)?A:I},r=y=>{var I;return!!((I=t.querySelector(y))!=null&&I.checked)},l=s("#ac-nombre").trim();if(!l)return{datos:{},error:"Nombre obligatorio"};const u=s("#ac-modelo")||"cuenta",b=u==="beneficio",p=i("#ac-saldo"),d={nombre:l,saldo:p,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(y=>y.value),modeloFondo:u,planAportaciones:e,tipoBeneficio:b?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:b?s("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&p<=0)return{datos:d};if(!(o===null||Math.abs(p-o)>.005))return{datos:d};if(u==="inversion"&&p>(o??0)){const y=Date.now().toString(36);d.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${y}a`,fecha:a?n:d.fechaInicialSaldo??n,cantidad:p-(o??0)}]}return{datos:d,punto:{fecha:n,saldo:p,nota:a?"Actualización manual":"Saldo inicial"}}}function aa(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:et(e.saldoCts),nota:e.nota}))}function ir(t,e,a,o,n){const s=a.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
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
    </div>`}const jo=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function rr(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??jt;function r(d,h){const y=o(),I=n();return!y||!I?null:(I.innerHTML=`<div class="modal-title">${c(d)}</div>${h}`,y.classList.remove("hidden"),T(I,"[data-cerrar]",s),I)}function l(){e=null;const d=[...t.store.get("tramosGananciasCapitalHistorico")].sort((I,A)=>I.año-A.año),h="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",y=r("Tramos — Ganancias de capital",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tramos marginales de la base del ahorro (art. 49 LIRPF): plusvalías de fondos, intereses y dividendos.
        Un ejercicio sin tabla propia usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${h}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(jo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${d.map(I=>`<div style="${h}">
              <span style="font-weight:600;font-size:13px">${I.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(jo(I.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tg="${I.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tg="${I.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="tg-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo-tg>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);y&&(T(y,"[data-editar-tg]",I=>{const A=I.getAttribute("data-editar-tg");p(A==="default"?"default":Number(A))}),T(y,"[data-borrar-tg]",I=>{const A=Number(I.getAttribute("data-borrar-tg"));Z(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),T(y,"[data-anadir-anyo-tg]",()=>{var f;const I=parseInt(((f=y.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!I||I<2e3||I>2100)return q("Año inválido","err");const A=t.store.get("tramosGananciasCapitalHistorico");if(A.some(g=>g.año===I))return q("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...A,{_id:Date.now().toString(36),año:I,tramos:i().map(g=>[...g])}]),t.onDatosCambiados(),p(I)}))}function u(){return a.map(([d,h],y)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${y}" value="${d}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${y}" value="${h}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${y}">✕</button>
          </div>
        </div>`).join("")}function b(d){a=[...d.querySelectorAll("[data-tg-min]")].map((h,y)=>{const I=d.querySelector(`[data-tg-pct="${y}"]`);return[parseFloat(h.value)||0,parseFloat((I==null?void 0:I.value)??"")||0]})}function p(d){var f;e=d;const h=t.store.get("tramosGananciasCapitalHistorico");a=(d==="default"?i():((f=h.find(g=>g.año===d))==null?void 0:f.tramos)??i()).map(g=>[...g]);const I=r(`Ganancias de capital — ${d==="default"?"Por defecto":d}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!I)return;const A=()=>{const g=I.querySelector("#tg-rows");g&&(g.innerHTML=u())};T(I,"[data-volver-tg]",l),T(I,"[data-tg-anadir]",()=>{b(I),a.push([0,0]),A()}),T(I,"[data-tg-borrar]",g=>{b(I),a.splice(Number(g.getAttribute("data-tg-borrar")),1),A()}),T(I,"[data-tg-guardar]",()=>{b(I);const g=[...a].sort((m,$)=>m[0]-$[0]);if(g.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:g}),q("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(m=>m.año===e?{...m,tramos:g}:m)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}function lr(t){function e(){if(t.navegar)return t.navegar("planner");const s=globalThis.Router;s==null||s.navigate("planner")}function a(s,i,r){const l=ha(s,i,r),u=s.targetAmount||0,b=u>0?Math.min(100,l/u*100):0;return`
      <div style="padding:8px 0;border-bottom:1px solid var(--hairline-soft)">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:500">${c(s.nombre)}</span>
          <span class="num" style="font-size:11px;color:var(--text3)">
            ${c(j(l))} / ${c(j(u))}
          </span>
        </div>
        <div class="goal-bar"><div class="goal-bar-fill" style="width:${b}%;background:${c(s.color||"var(--accent)")}"></div></div>
      </div>`}function o(s){const i=t.store.get("goals");if(i.length===0){s.innerHTML="",s.style.display="none";return}s.style.display="";const r=t.store.get("accounts"),l=t.colchonEnFecha(t.hoy()),u=[...i].sort((b,p)=>(b.prioridad||99)-(p.prioridad||99));s.innerHTML=`
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro (antiguos)</div>
        <button class="btn-primary btn-sm" data-ir-planner>Ir a Objetivos financieros</button>
      </div>
      <div class="text-sm mb-12" style="color:var(--text2);line-height:1.6">
        Estos objetivos se gestionan ahora en <strong>Objetivos financieros</strong>, donde compiten por tu
        flujo mensual en vez de medir solo el saldo de unas cuentas. Ya se copiaron allí; esto es solo la
        copia antigua, en modo lectura.
      </div>
      ${u.map(b=>a(b,r,l)).join("")}
      <div class="mt-12">
        <button class="btn-secondary btn-sm" data-descartar-goals style="color:var(--red)">Descartar los antiguos</button>
        <div class="text-sm mt-4" style="color:var(--text3)">
          Comprueba antes que están en Objetivos financieros: esto no se puede deshacer.
        </div>
      </div>`}function n(s,i){T(s,"[data-ir-planner]",()=>e()),T(s,"[data-descartar-goals]",()=>{const r=t.store.get("goals").length;if(Z(`Se van a borrar ${r} objetivo${r!==1?"s":""} de ahorro antiguos. ¿Seguro?`)){for(const l of[...t.store.get("goals")])t.store.removeItem("goals",l._id);q("Objetivos antiguos descartados"),t.onDatosCambiados(),i()}})}return{render:o,wire:n}}const cr="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",dr=120;function ur(t){const e=t.hoy??J,a=()=>{var F;return(F=t.onDatosCambiados)==null?void 0:F.call(t)},o=t.mostrarObjetivos??(()=>!0),n=new Map,s=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),r=F=>{var w;return((w=i().find(P=>P._id===F))==null?void 0:w.nombre)??F},l=F=>{var w;return((w=t.store.get("accounts").find(P=>P._id===F))==null?void 0:w.nombre)??F},u=()=>bt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??gt)(Number(e().slice(0,4))),b=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??jt),p=()=>b()(Number(e().slice(0,4))),d=F=>qa(t.store.get("expenses"),s(),t.store.get("loans"),F);function h(){const F=s(),w=t.store.get("accounts"),P=Jt({loans:[],expenses:t.store.get("expenses").filter(k=>k.tipo==="transferencia"),accounts:w,config:{dashboardStart:F.dashboardStart,dashboardEnd:F.dashboardEnd,fechaReferencia:F.dashboardStart},nominas:[],resolverTramosGanancias:b()}),D=new Map,R=k=>{let L=D.get(k);return L||(L={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},D.set(k,L)),L},O=(k,L)=>{const B=`${L.sourceId}`,N=k.find(U=>U.concepto===B),H=N??{concepto:B,contraparte:"",total:0,ocurrencias:0};H.total+=Math.abs(L.cuantia),H.ocurrencias+=1,N||k.push(H)};for(const k of P){if(!k.cuenta)continue;const L=R(k.cuenta);k.sourceType==="transfer-in"||k.sourceType==="traspaso-in"?(L.totalAportaciones+=Math.abs(k.cuantia),O(L.entradas,k)):k.sourceType==="transfer-out"||k.sourceType==="traspaso-out"?(L.totalReembolsos+=Math.abs(k.cuantia),O(L.salidas,k)):k.sourceType==="investment-tax"&&(L.retencion+=Math.abs(k.cuantia))}const _=t.store.get("expenses");for(const k of D.values())for(const[L,B]of[[k.entradas,"cuenta"],[k.salidas,"cuentaDestino"]])for(const N of L){const H=_.find(U=>U._id===N.concepto);N.contraparte=l((H==null?void 0:H[B])??"default"),N.concepto=(H==null?void 0:H.concepto)||(B==="cuenta"?"Aportación":"Reembolso")}return D}function y(){const F=new Map,w=s(),P=e(),D=new Date(Number(P.slice(0,4)),Number(P.slice(5,7))-1+dr+1,0),R=`${D.getFullYear()}-${String(D.getMonth()+1).padStart(2,"0")}-${String(D.getDate()).padStart(2,"0")}`;return O=>{const _=F.get(O._id);if(_)return _;const k=Jt({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...w,dashboardStart:P,dashboardEnd:R,fechaReferencia:P},filtroAccounts:[O._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),w.tramos_irpf??gt),resolverTramosGanancias:b()}).map(L=>({fecha:L.fecha,saldoAcum:L.saldoAcum}));return F.set(O._id,k),k}}const I=lr({store:t.store,colchonEnFecha:d,extractoCuenta:F=>A(F),hoy:e,onDatosCambiados:a});let A=y();function f(F){A=y();const P=t.store.get("accounts").filter(_=>mt(_)!=="pension"),D=h(),R={config:s(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:u(),tramosGanancias:p(),nombreEscenario:r,flujos:_=>D.get(_)??Ji,invModo:_=>n.get(_)??"proyeccion"};F.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${Wi(P,R.tramosGanancias)}
      <div class="grid-3">${P.map(_=>tr(_,R)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const O=F.querySelector("#goals-section");O&&I.render(O)}const g=()=>document.getElementById("modal-overlay"),m=()=>document.getElementById("modal-content"),$=()=>{var F;return(F=g())==null?void 0:F.classList.add("hidden")};function v(F,w){const P=g(),D=m();return!P||!D?null:(D.innerHTML=F?`<div class="modal-title">${c(F)}</div>${w}`:w,P.classList.remove("hidden"),T(D,"[data-cancelar]",$),D)}function x(F,w){const P=F?t.store.get("accounts").find(_=>_._id===F)??null:null,D=[...(P==null?void 0:P.planAportaciones)??[]].map(_=>({..._})),R=P?M(P):null,O=v(F?"Editar cuenta / fondo":"Nueva cuenta / fondo",or(P,{escenarios:i(),nominas:t.store.get("nominas"),hoy:e(),saldoActual:R??0}));O&&(sr(O,D,e()),T(O,"[data-guardar-acc]",_=>{const k=_.getAttribute("data-guardar-acc")||"",{datos:L,punto:B,error:N}=nr(O,D,P,R,e());if(N)return q(N,"err");let H=k;k?t.store.updateItem("accounts",k,L):H=t.store.addItem("accounts",L)._id,B&&t.ledger.registrarPuntoControl(H,B.fecha,B.saldo,B.nota),q(k?"Actualizada":"Cuenta / fondo creado"),a(),$(),w()}))}function M(F){const w=t.ledger.puntosControl(F._id);return w.length>0?aa(w)[0].saldo:F.saldo??null}function S(F,w){const P=t.store.get("accounts").find(O=>O._id===F);if(!P)return;const D=v("Histórico de saldos",ir(P.nombre,F,aa(t.ledger.puntosControl(F)),P.saldoInicial||0,e()));if(!D)return;const R=()=>{w(),S(F,w)};T(D,"[data-hist-anadir]",()=>{var L,B,N;const O=((L=D.querySelector("#hi-fecha"))==null?void 0:L.value)??"",_=parseFloat(((B=D.querySelector("#hi-saldo"))==null?void 0:B.value)??""),k=((N=D.querySelector("#hi-nota"))==null?void 0:N.value.trim())??"";if(!O||!Number.isFinite(_))return q("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(F,O,_,k||void 0),q("Punto añadido"),a(),R()}),T(D,"[data-hist-borrar]",O=>{const[,_]=(O.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(_),q("Eliminado"),a(),R()}),T(D,"[data-hist-inicial]",O=>{const[_,k]=(O.getAttribute("data-hist-inicial")||"").split("|"),L=t.ledger.puntosControl(_).find(N=>N._id===k);if(!L)return;const B=aa([L])[0].saldo;t.store.updateItem("accounts",_,{saldoInicial:B,fechaInicialSaldo:L.fecha}),q(`Punto inicial → ${L.fecha} (${j(B)})`),a(),R()})}function C(F){const w=t.store.get("accounts").filter(R=>R.activo);if(w.length===0)return q("No hay cuentas activas","err");const P=e(),D=w.map(R=>`• ${R.nombre}: ${j(M(R)??R.saldoInicial??0)}`).join(`
`);if(Z(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${P})?

${D}

Esto recalibra el punto de arranque del dashboard.`)){for(const R of w)t.store.updateItem("accounts",R._id,{saldoInicial:M(R)??R.saldoInicial??0,fechaInicialSaldo:P});q("Saldo base actualizado"),a(),F()}}function z(F,w,P){T(F,"[data-nueva-acc]",()=>x(null,w)),T(F,"[data-editar-acc]",D=>x(D.getAttribute("data-editar-acc"),w)),T(F,"[data-tramos-ganancias]",()=>P.abrir()),T(F,"[data-reset-base]",()=>C(w)),T(F,"[data-hist-acc]",D=>S(D.getAttribute("data-hist-acc"),w)),T(F,"[data-principal-acc]",D=>{const R=D.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(O=>({...O,esCuentaPrincipal:O._id===R}))),q("Cuenta marcada como principal"),a(),w()}),T(F,"[data-borrar-acc]",D=>{const R=D.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return q("Debe existir al menos una cuenta","err");if(!Z("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",R);const _=t.store.get("accounts");_.length>0&&!_.some(k=>k.esCuentaPrincipal)&&t.store.set("accounts",_.map((k,L)=>L===0?{...k,esCuentaPrincipal:!0}:k)),q("Cuenta eliminada"),a(),w()}),T(F,"[data-inv-modo]",D=>{const[R,O]=(D.getAttribute("data-inv-modo")||"").split("|");n.set(R,O==="real"?"real":"proyeccion"),w()}),I.wire(F,w)}let E=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:cr,mount(F){const w=()=>f(F);E??(E=rr({store:t.store,onDatosCambiados:()=>{a(),w()},año:()=>Number(e().slice(0,4))})),f(F),F.dataset.wired!=="1"&&(z(F,w,E),F.dataset.wired="1")}}}const ot=(t,e,a="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${a};font-size:12px;padding:5px 10px">${c(j(e))}</td>
  </tr>`,oa=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${c(t)}</td></tr>`;function zo(t){const a=t.capMobiliario!==0||t.gananciasFondos!==0?`${ot("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
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
    </table>`}const se=(t,e,a,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${c(e)}</label>
    <input type="number" id="${t}" class="form-input" value="${c(a)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${c(o)}</div>`:""}
  </div>`;function pr(t){const e=t.extras,a=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
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
          ${se("rex-inmobiliario","Capital inmobiliario neto (alquileres − gastos)",e.capInmobiliario??0)}
          ${se("rex-mobiliario","Capital mobiliario (dividendos, intereses)",e.capMobiliario??0)}
          ${se("rex-ganancias","Ganancias / pérdidas patrimoniales (fondos, acciones)",e.gananciasFondos??0,"Positivo = ganancia · Negativo = pérdida compensable")}
          ${se("rex-otras","Otras ganancias a corto plazo (menos de 1 año)",e.otrasCorto??0)}
          ${se("rex-ret-cap","Retenciones de capital ya aplicadas",e.retCapital??0,"Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen")}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${t.nominas.length>0?t.nominas.map(o=>`• ${c(o.nombre)}: ${c(j(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${c(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${zo(t.declaracion)}</div>
      </div>
    </div>`}function Eo(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((a,o)=>a[0]-o[0]).map(([a,o],n,s)=>{const i=n<s.length-1?s[n+1][0]:null,r=i!==null?`${j(a)} – ${j(i)}`:`Más de ${j(a)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${c(r)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${c(o)}%</td>
      </tr>`}).join("")}
  </table>`}const mr=(t,e,a)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${c(e)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${a}</div>
  </div>`,ct=(t,e,a="")=>`<div class="stat-card"><div class="stat-label">${c(t)}</div><div class="stat-value ${a}">${c(e)}</div></div>`,yt=(t,e,a="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${c(t)}</span><span class="num ${a}">${c(e)}</span></div>`;function fr(t,e,a){const o=t.filter(l=>(l.modeloFondo||"cuenta")==="inversion");if(o.length===0)return mr("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let n=0,s=0,i=0;const r=o.map(l=>{const u=Rt(l,e);if(!u)return"";n+=u.saldo,s+=u.costBase,i+=u.impuesto;const b=u.costBase>0?u.plusvalia/u.costBase*100:0,p=(l.escenarioIds||[]).map(d=>`<span class="badge badge-yellow">🔭 ${c(a(d))}</span>`).join("");return`
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${c(l.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${p}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            ${ct("Valor actual",j(u.saldo))}
            ${ct("Coste base (aportado)",j(u.costBase))}
          </div>
          <div class="grid-2" style="gap:8px">
            ${ct(`Plusvalía latente (${b>=0?"+":""}${b.toFixed(1)}%)`,j(u.plusvalia),u.plusvalia>=0?"pos":"neg")}
            ${ct("Imp. ganancias de capital (est.)",j(u.impuesto),"neg")}
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${c(j(u.neto))}</span>
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
      ${Eo(e)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function vr(t){const{nominas:e,planes:a,tramos:o}=t,n=h=>h.grupoNomina?e.filter(y=>(y.grupoNomina||"")===h.grupoNomina):null,s=e.map(h=>({n:h,d:Te(h,n(h),o)})),i=s.reduce((h,y)=>h+y.d.brutoAnual,0),r=s.reduce((h,y)=>h+y.d.irpfAnual,0),l=s.reduce((h,y)=>h+y.d.ssAnual,0),u=s.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':s.map(({n:h,d:y})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${c(h.nombre)}</div>
          ${yt("Bruto anual",j(y.brutoAnual))}
          ${y.flexAnual>0?yt("− Retribución flexible exenta",j(-y.flexAnual),"pos"):""}
          ${yt("− Cotización SS",j(-y.ssAnual),"neg")}
          ${yt(`− IRPF estimado (${y.irpfPct.toFixed(1)} %)`,j(-y.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${c(j(y.baseDineraria-y.ssAnual-y.irpfAnual))}</span>
          </div>
        </div>`).join(""),b=Ma(e,o),p=`${t.hoy.slice(0,4)}-01-01`,d=a.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':a.map(h=>{const y=ue(h);if(!y)return"";const I=(h.aportaciones||[]).filter(m=>m.fecha>=p).reduce((m,$)=>m+$.cantidad,0),f=Math.min(I,Et)*b/100,g=I>Et;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${c(h.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${yt("Valor actual",j(y.saldo))}
          ${yt("Coste base (total aportado)",j(y.costBase))}
          ${yt("Revalorización",j(y.beneficio),y.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(t.hoy.slice(0,4))}</div>
            ${yt("Aportado",`${j(I)}${g?" ⚠":""}`,g?"neg":"")}
            ${yt("Límite deducible",j(Et))}
            ${yt(`Ahorro IRPF est. (marginal ${b} %)`,j(f),"pos")}
            ${g?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${c(j(Et))})</div>`:""}
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
      <div class="grid-3">${u}</div>
    </div>

    <div class="card-title mb-8">Planes de pensiones</div>
    <div class="auth-hint mb-14" style="border-color:var(--yellow)">
      💼 <strong>Diferencia clave frente a los fondos de inversión:</strong> el rescate de un plan de pensiones tributa en la
      <strong>base general del IRPF</strong> (tramos ordinarios hasta el 47 %), <em>no</em> en la base del ahorro. Las
      aportaciones son deducibles hasta <strong>${c(j(Et))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${d}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${Eo(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const he=(t,e)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${c(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${c(e)}</div>
  </div>`;function gr(){return`
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
        ${he("Rendimientos íntegros","Alquileres, subarriendos y cesión de derechos sobre inmuebles")}
        ${he("Gastos deducibles","IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación")}
        ${he("Reducción del 60 %","Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)")}
        ${he("Base general del IRPF","Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.")}
      </div>
    </div>`}const Fo=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],br="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function hr(t){const e=t.hoy??J;let a="declaracion",o={};const n=()=>t.store.get("config"),s=()=>Number(e().slice(0,4)),i=()=>t.store.get("nominas").filter(g=>g.activo),r=()=>t.store.get("accounts").filter(g=>(g.modeloFondo||"cuenta")==="pension"),l=g=>{var m;return((m=t.store.get("escenarios").find($=>$._id===g))==null?void 0:m.nombre)??g},u=()=>bt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??gt)(s()),b=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??jt)(s());function p(){const g=`${s()}-01-01`,m=t.store.get("nominas").filter(x=>x.activo&&!x.simulacion),$=r().reduce((x,M)=>x+(M.aportaciones||[]).filter(S=>S.fecha>=g).reduce((S,C)=>S+C.cantidad,0),0),v=t.store.get("expenses").filter(x=>x.activo&&x.sujetoIRPF&&x.tipo==="ingreso").reduce((x,M)=>x+Sa(M),0);return Ca({nominas:m,aportacionesPension:$,otrosIngresos:v,extras:o,tramosGeneral:u(),tramosAhorro:b()})}function d(){const g=u(),m=i(),$=w=>w.grupoNomina?m.filter(P=>(P.grupoNomina||"")===w.grupoNomina):null,v=m.map(w=>Te(w,$(w),g)),x=v.reduce((w,P)=>w+P.brutoAnual,0),M=v.reduce((w,P)=>w+P.irpfAnual,0),S=v.reduce((w,P)=>w+P.ssAnual,0),C=t.store.get("accounts").filter(w=>(w.modeloFondo||"cuenta")==="inversion");let z=0,E=0;for(const w of C){const P=Rt(w,b());P&&(z+=P.plusvalia,E+=P.impuesto)}if(x<=0&&C.length===0)return"";const F=(w,P,D)=>`<div class="exec-item"><div class="exec-item-label">${c(w)}</div><div class="exec-item-val ${D}">${c(P)}</div></div>`;return`<div class="exec-summary mb-14">
      ${x>0?F("IRPF trabajo",`${j(M)}/año`,"neg"):""}
      ${x>0?F("Neto trabajo",`${j(x-S-M)}/año`,"pos"):""}
      ${C.length>0?F("Plusvalía latente",j(z),z>=0?"pos":"neg"):""}
      ${C.length>0?F("Imp. potencial (inversión)",j(E),"neg"):""}
    </div>`}function h(){return a==="mobiliario"?fr(t.store.get("accounts"),b(),l):a==="trabajo"?vr({nominas:i(),planes:r(),tramos:u(),hoy:e()}):a==="inmobiliario"?gr():pr({año:s(),extras:o,declaracion:p(),nominas:i().map(g=>({nombre:g.nombre,bruto:g.bruto||0})),planes:r().map(g=>g.nombre)})}function y(g,m){const $=a===g;return`<button data-tab-fisc="${g}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${$?"600":"400"};
      color:${$?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${$?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${c(m)}</button>`}function I(g){const m=g.querySelector("#fisc-tabs"),$=g.querySelector("#fisc-tab-content");m&&(m.innerHTML=Fo.map(([v,x])=>y(v,x)).join("")),$&&($.innerHTML=h())}function A(g){g.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${d()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${Fo.map(([m,$])=>y(m,$)).join("")}
      </div>
      <div id="fisc-tab-content">${h()}</div>`}function f(g){T(g,"[data-tab-fisc]",m=>{a=m.getAttribute("data-tab-fisc")||"declaracion",I(g)}),g.addEventListener("input",m=>{var M;if(!((M=m.target)==null?void 0:M.closest("[data-rex]")))return;const v=S=>{var C;return((C=g.querySelector(`#${S}`))==null?void 0:C.value)??"0"};o={capInmobiliario:parseFloat(v("rex-inmobiliario"))||0,capMobiliario:parseFloat(v("rex-mobiliario"))||0,gananciasFondos:parseFloat(v("rex-ganancias"))||0,otrasCorto:parseFloat(v("rex-otras"))||0,retCapital:parseFloat(v("rex-ret-cap"))||0};const x=g.querySelector("#renta-cuadro");x&&(x.innerHTML=zo(p()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:br,mount(g){A(g),g.dataset.wired!=="1"&&(f(g),g.dataset.wired="1")}}}const _o=()=>globalThis.Chart??null;function yr(t,e){const a=_o();if(!a)return null;const o=e.map(n=>({label:n.label,data:n.puntos.map(s=>({x:s.x,y:s.y})),borderColor:n.esBase?"#6b7280":n.color,backgroundColor:n.esBase?"transparent":`${n.color}18`,borderWidth:n.esBase?1.5:2,...n.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new a(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:n=>`${n.dataset.label}: ${j(n.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:n=>j(n)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const xr=()=>_o()!==null,Pt=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],$r="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function Ir(t){const e=()=>{var x;return(x=t.onDatosCambiados)==null?void 0:x.call(t)},a=new Set;let o=null;const n=()=>t.store.get("config"),s=()=>t.store.get("escenarios"),i=x=>{var M;return x?((M=s().find(S=>S._id===x))==null?void 0:M.nombre)??x:"Base"};function r(x){const M=n(),S=xa({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(x==null?void 0:x._id)??null),C=a.size>0?S.accounts.filter(w=>!a.has(w._id)):S.accounts,z=a.size>0?C.map(w=>w._id):null,E=x!=null&&x.fechaFin&&x.fechaFin>M.dashboardEnd?x.fechaFin:M.dashboardEnd;return{eventos:Jt({loans:S.loans,expenses:S.expenses,accounts:C,config:{...M,dashboardEnd:E},filtroAccounts:z,nominas:S.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),M.tramos_irpf??gt),resolverTramosGanancias:bt(t.store.get("tramosGananciasCapitalHistorico"),M.tramosGananciasCapital??jt)}),horizonte:E}}function l(x){const M=t.store.get("loans"),S=F=>(F.escenarioIds||[]).includes(x),C=[[M.filter(S).length,"préstamo","préstamos"],[M.flatMap(F=>F.amortizaciones||[]).filter(S).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(S).length,"gasto","gastos"],[t.store.get("accounts").filter(S).length,"cuenta","cuentas"],[t.store.get("nominas").filter(S).length,"nómina","nóminas"]],z=C.reduce((F,[w])=>F+w,0),E=C.filter(([F])=>F>0).map(([F,w,P])=>`${F} ${F===1?w:P}`).join(" · ");return{total:z,texto:E}}function u(x,M){const S=M===x._id,C=x.color||Pt[0],{total:z,texto:E}=l(x._id);return`<div class="card mb-12" style="border-left:3px solid ${c(C)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${c(C)};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${c(x.nombre)}</span>
        ${S?'<span class="badge badge-yellow">● Activo</span>':""}
        ${x.fechaFin?`<span class="badge badge-inactive">📅 ${c(x.fechaFin)}</span>`:""}
        <div class="flex gap-8">
          ${S?'<button class="btn-secondary btn-sm" data-desactivar-esc>Desactivar</button>':`<button class="btn-primary btn-sm" data-activar-esc="${c(x._id)}">Activar</button>`}
          <button class="btn-secondary btn-sm" data-editar-esc="${c(x._id)}">Editar</button>
          <button class="btn-danger btn-sm" data-borrar-esc="${c(x._id)}">✕</button>
        </div>
      </div>
      ${x.descripcion?`<div class="text-sm mb-8" style="color:var(--text2)">${c(x.descripcion)}</div>`:""}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${z===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${c(E)}</span>`}
      </div>
    </div>`}function b(x){const M=n().dashboardEnd,S=ze(r(null).eventos,M);return`
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
        <tbody>${x.map(z=>{const{eventos:E}=r(z),F=z.fechaFin||M,w=ze(E,F),P=w!==null&&S!==null?w-S:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c(z.color||Pt[0])};margin-right:6px"></span>
            ${c(z.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${c(F)}</td>
          <td class="num" style="padding:6px 10px">${w!==null?c(j(w)):"—"}</td>
          <td class="num ${P===null?"":P>=0?"pos":"neg"}" style="padding:6px 10px">
            ${P===null?"—":`${P>=0?"+":""}${c(j(P))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function p(){const x=t.store.get("accounts");return x.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${x.map(S=>{const C=a.has(S._id);return`<button data-toggle-cuenta="${c(S._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${C?"var(--border)":"var(--accent)"};
          background:${C?"transparent":"rgba(99,102,241,0.1)"};
          color:${C?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${C?"text-decoration:line-through;":""}">${c(S.nombre)}</button>`}).join("")}
    </div>`}function d(){if(o){try{o.destroy()}catch{}o=null}}function h(x){const M=n(),S=r(null),C=[{label:"Base (sin supuesto)",color:"#6b7280",esBase:!0,puntos:je(S.eventos,M.dashboardStart,M.dashboardEnd)}];return x.forEach((z,E)=>{const{eventos:F,horizonte:w}=r(z);C.push({label:z.nombre,color:z.color||Pt[E%Pt.length],puntos:je(F,M.dashboardStart,w)})}),C}function y(x,M){d();const S=x.querySelector("#chart-comparacion");S&&(o=yr(S,h(M)))}function I(x){d();const M=new Set(t.store.get("accounts").map(z=>z._id));for(const z of[...a])M.has(z)||a.delete(z);const S=s(),C=n().escenarioActivo||null;x.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Supuestos</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo supuesto</button></div>
      </div>

      ${C?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${c(i(C))}</span>
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
             </div>`:`<div>${S.map(z=>u(z,C)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de supuestos</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${p()}</div>
               ${xr()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${b(S)}</div>`}`,S.length>0&&y(x,S)}const A=()=>document.getElementById("modal-overlay"),f=()=>document.getElementById("modal-content"),g=()=>{var x;return(x=A())==null?void 0:x.classList.add("hidden")};function m(x,M){const S=x?s().find(F=>F._id===x)??null:null,C=A(),z=f();if(!C||!z)return;const E=(S==null?void 0:S.color)||Pt[0];z.innerHTML=`
      <div class="modal-title">${x?"Editar supuesto":"Nuevo supuesto"}</div>
      <div class="form-group"><label class="form-label">Nombre del supuesto</label>
        <input class="form-input" type="text" id="esc-nombre" value="${c((S==null?void 0:S.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${c((S==null?void 0:S.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${Pt.map(F=>`<div data-color-esc="${F}" style="width:26px;height:26px;border-radius:50%;background:${F};cursor:pointer;
              border:2px solid ${F===E?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${c(E)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${c((S==null?void 0:S.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${c(x??"")}">${x?"Guardar cambios":"Crear escenario"}</button>
      </div>`,C.classList.remove("hidden"),T(z,"[data-cancelar]",g),T(z,"[data-color-esc]",F=>{const w=F.getAttribute("data-color-esc");z.querySelector("#esc-color").value=w;for(const P of z.querySelectorAll("[data-color-esc]"))P.style.border=P.getAttribute("data-color-esc")===w?"2px solid white":"2px solid transparent"}),T(z,"[data-guardar-esc]",F=>{const w=z.querySelector("#esc-nombre").value.trim();if(!w)return q("El nombre es obligatorio","err");const P={nombre:w,fechaFin:z.querySelector("#esc-fecha-fin").value||null,color:z.querySelector("#esc-color").value||Pt[0],descripcion:z.querySelector("#esc-desc").value.trim()},D=F.getAttribute("data-guardar-esc")||"";D?(t.store.updateItem("escenarios",D,P),q("Escenario actualizado")):(t.store.addItem("escenarios",P),q("Escenario creado")),e(),g(),M()})}function $(x,M){if(!Z("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const S=C=>C.map(z=>({...z,escenarioIds:(z.escenarioIds||[]).filter(E=>E!==x)}));t.store.set("loans",S(t.store.get("loans")).map(C=>({...C,amortizaciones:S(C.amortizaciones||[])}))),t.store.set("expenses",S(t.store.get("expenses"))),t.store.set("nominas",S(t.store.get("nominas"))),t.store.set("accounts",S(t.store.get("accounts"))),n().escenarioActivo===x&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",x),q("Escenario eliminado"),e(),M()}function v(x,M){T(x,"[data-nuevo-esc]",()=>m(null,M)),T(x,"[data-editar-esc]",S=>m(S.getAttribute("data-editar-esc"),M)),T(x,"[data-borrar-esc]",S=>$(S.getAttribute("data-borrar-esc"),M)),T(x,"[data-activar-esc]",S=>{const C=S.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:C}),q(`Escenario "${i(C)}" activado`),e(),M()}),T(x,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),q("Volviendo a la realidad base"),e(),M()}),T(x,"[data-toggle-cuenta]",S=>{const C=S.getAttribute("data-toggle-cuenta");a.has(C)?a.delete(C):a.add(C);const z=x.querySelector("#esc-pastillas");z&&(z.innerHTML=p());const E=s(),F=x.querySelector("#esc-comparativa");F&&(F.innerHTML=b(E)),y(x,E)})}return{id:"escenarios",route:"escenarios",nombre:"Supuestos",flagId:"supuestos",seccion:2,iconoPath:$r,mount(x){const M=()=>I(x);I(x),x.dataset.wired!=="1"&&(v(x,M),x.dataset.wired="1")},unmount(){d()}}}const Ar=1e-12,Po=t=>Math.abs(t)<Ar,Do=t=>t/12;function Mr(t,e,a,o){if(a<=0)return Math.max(0,Math.ceil(t-e));const n=t-e;if(n<=0)return 0;const s=Do(o);if(Po(s))return Math.ceil(n/a);const i=Math.pow(1+s,a),r=(t-e*i)*s/(i-1);return r<=0?0:Math.ceil(r)}function Sr(t,e){const a=Do(e);return Po(a)?0:Math.round(t*a)}function To({rentaNetaMensual:t,tasaRetiroSeguro:e,tipoFiscalEfectivo:a}){if(e<=0)throw new RangeError("La tasa de retiro seguro tiene que ser mayor que cero.");if(a>=1)throw new RangeError("El tipo fiscal efectivo no puede llegar al 100 %.");const o=Math.round(t*12/(1-a));return{retiroBrutoAnual:o,capitalNecesario:Math.round(o/e)}}function Ro(t,e){const[a,o]=t.split("-").map(Number),n=a*12+(o-1)+e,s=Math.floor(n/12),i=n%12+1;return`${s}-${String(i).padStart(2,"0")}`}function sa(t,e){const[a,o]=t.split("-").map(Number),[n,s]=e.split("-").map(Number);return(n-a)*12+(s-o)}const No=t=>Number(t.slice(0,4));function ye(t){return t.rentaDeseada?To(t.rentaDeseada).capitalNecesario:t.importeObjetivo??0}const wr={_id:"__sin_vehiculo__"};function xe(t){var g,m,$;const e=Math.max(0,Math.floor(t.horizonteMeses)),a=new Map(t.vehiculos.map(v=>[v._id,v])),o=[...t.objetivos].sort((v,x)=>v.prioridad-x.prioridad).map(v=>({def:v,objetivo:ye(v),saldo:v.saldoActual,estado:ye(v)>0&&v.saldoActual>=ye(v)&&v.modoAsignacion!=="ABSORBE_RESIDUAL"?"COMPLETADO":"PENDIENTE",vehiculo:a.get(v.vehiculoId),aportadoEnAño:0,añoEnCurso:No(t.fechaInicio),ultimaSolicitud:0,solicitadoAcumulado:0,mesesReclamando:0})),n=new Map;for(const v of t.eventos){const x=n.get(v.fecha)??[];x.push(v),n.set(v.fecha,x)}const s=[],i=[],r=[];let l=t.perfil.netoMensual,u=t.perfil.gastosFijosMensuales,b=0,p=0;const d=[];for(let v=0;v<e;v++){const x=Ro(t.fechaInicio,v),M=No(x);for(const _ of n.get(x)??[])if(_.tipo==="CAMBIO_INGRESOS")l=_.importe;else if(_.tipo==="CAMBIO_GASTOS_FIJOS")u=_.importe;else if(_.tipo==="NUEVA_DEUDA")u+=_.importe;else if(_.tipo==="INYECCION_CAPITAL"){const k=_.objetivoDestinoId?o.find(L=>L.def._id===_.objetivoDestinoId):void 0;k?k.saldo+=_.importe:l+=_.importe}for(const _ of o)_.añoEnCurso!==M&&(_.añoEnCurso=M,_.aportadoEnAño=0);const S=Math.max(0,l-u),C=Math.round(S*Cr(t.pctDisfrute));let z=S-C;const E=z,F=o.filter(_=>_.estado!=="COMPLETADO"),w=[];let P=0;const D=F.filter(_=>_.def.modoAsignacion==="ABSORBE_RESIDUAL"),R=F.filter(_=>_.def.modoAsignacion!=="ABSORBE_RESIDUAL");for(const _ of R){const k=jr(_,x,v,t);_.ultimaSolicitud=k,k>0&&(_.solicitadoAcumulado+=k,_.mesesReclamando+=1),(_.def.modoAsignacion==="CUOTA_POR_FECHA"||_.def.modoAsignacion==="FIJO")&&(P+=k);const L=Math.max(0,Math.min(k,z));z-=L,_.saldo+=L,_.aportadoEnAño+=L,b+=L,L>0&&_.estado==="PENDIENTE"&&(_.estado="EN_CURSO"),w.push({objetivoId:_.def._id,asignado:L,solicitado:k,saldoTrasMes:_.saldo})}if(D.length>0&&z>0){const _=D.map(B=>Math.max(0,B.def.pesoResidual??1)),k=_.reduce((B,N)=>B+N,0)||D.length;let L=0;D.forEach((B,N)=>{const H=N===D.length-1?z-L:Math.floor(z*_[N]/k);L+=H,B.saldo+=H,B.aportadoEnAño+=H,b+=H,H>0&&B.estado==="PENDIENTE"&&(B.estado="EN_CURSO"),w.push({objetivoId:B.def._id,asignado:H,solicitado:0,saldoTrasMes:B.saldo})}),z-=L}else for(const _ of D)w.push({objetivoId:_.def._id,asignado:0,solicitado:0,saldoTrasMes:_.saldo});P>E&&d.push({mes:x,deficit:P-E});for(const _ of o)_.saldo<=0||(_.saldo+=Sr(_.saldo,((g=_.vehiculo)==null?void 0:g.rentabilidadRealAnual)??0));for(const _ of o)_.estado!=="COMPLETADO"&&(_.def.modoAsignacion==="ABSORBE_RESIDUAL"&&_.objetivo<=0||_.objetivo>0&&_.saldo>=_.objetivo&&(_.estado="COMPLETADO",i.push({objetivoId:_.def._id,nombre:_.def.nombre,mes:x,indice:v,importeFinal:_.saldo,cuotaLiberada:_.ultimaSolicitud})));for(const _ of o)w.some(k=>k.objetivoId===_.def._id)||w.push({objetivoId:_.def._id,asignado:0,solicitado:0,saldoTrasMes:_.saldo});const O=o.reduce((_,k)=>_+k.saldo,0);if(p+=C,s.push({indice:v,mes:x,netoMensual:l,gastosFijos:u,sobrante:S,disfrute:C,disponible:E,sinAsignar:z,asignaciones:w.sort((_,k)=>Oo(o,_.objetivoId)-Oo(o,k.objetivoId)),patrimonioTotal:O}),o.length>0&&o.every(_=>_.estado==="COMPLETADO"))break}const h=[];if(d.length>0){const v=Math.round(d.reduce((x,M)=>x+M.deficit,0)/d.length);r.push({severidad:"error",codigo:"INVIABLE",mensaje:`El plan no cabe en el flujo de caja durante ${d.length} mes${d.length!==1?"es":""} (desde ${d[0].mes}). Déficit medio: ${(v/100).toFixed(2)} €/mes.`,mes:d[0].mes,deficitMensual:v});for(const x of o)x.estado!=="COMPLETADO"&&x.def.fechaLimite&&x.def.modoAsignacion==="CUOTA_POR_FECHA"&&(x.estado="INVIABLE");h.push(...Er(o,t,v))}for(const v of o){const x=(m=v.vehiculo)==null?void 0:m.topeAportacionAnual;x&&v.def.modoAsignacion==="FIJO"&&(v.def.importeFijoMensual??0)*12>x&&r.push({severidad:"atencion",codigo:"TOPE_FISCAL",objetivoId:v.def._id,mensaje:`«${v.def.nombre}» pide ${((v.def.importeFijoMensual??0)/100).toFixed(2)} €/mes, que supera el tope anual de ${(x/100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`})}for(const v of o)v.estado!=="COMPLETADO"&&v.objetivo>0&&v.def.modoAsignacion!=="ABSORBE_RESIDUAL"&&r.push({severidad:"atencion",codigo:"NUNCA_COMPLETADO",objetivoId:v.def._id,mensaje:`«${v.def.nombre}» no se completa dentro del horizonte de ${e} meses.`});const y=o.find(v=>v.def.tipo==="INVERSION_PERPETUA"),I=y?i.find(v=>v.objetivoId===y.def._id):void 0,A={};for(const v of o){const x=(($=v.vehiculo)==null?void 0:$._id)??wr._id;A[x]=(A[x]??0)+v.saldo}const f={};for(const v of o)f[v.def._id]=v.estado;return{viable:d.length===0,mesesSimulados:s.length,serieMensual:s,hitos:i,fases:zr(s,i),avisos:r,propuestas:h,estadoFinal:f,resumen:{patrimonioFinal:o.reduce((v,x)=>v+x.saldo,0),patrimonioPorVehiculo:A,totalAportado:b,totalDisfrute:p,mesIndependencia:(I==null?void 0:I.mes)??null}}}const Cr=t=>Number.isFinite(t)?Math.min(1,Math.max(0,t)):0,Oo=(t,e)=>t.findIndex(a=>a.def._id===e);function jr(t,e,a,o){var s,i;const n=Math.max(0,t.objetivo-t.saldo);switch(t.def.modoAsignacion){case"ABSORBE_TODO":return n;case"FIJO":{const r=t.def.importeFijoMensual??0,l=(s=t.vehiculo)==null?void 0:s.topeAportacionAnual;if(!l)return t.objetivo>0?Math.min(r,n):r;const u=Math.max(0,l-t.aportadoEnAño),b=Math.min(r,u);return t.objetivo>0?Math.min(b,n):b}case"CUOTA_POR_FECHA":{if(n<=0)return 0;const r=t.def.fechaLimite?sa(e,t.def.fechaLimite):o.horizonteMeses-a;return Mr(t.objetivo,t.saldo,Math.max(0,r),((i=t.vehiculo)==null?void 0:i.rentabilidadRealAnual)??0)}default:return 0}}function zr(t,e){if(t.length===0)return[];const o=[0,...[...new Set(e.map(s=>s.indice))].sort((s,i)=>s-i).map(s=>s+1)].filter((s,i,r)=>r.indexOf(s)===i&&s<t.length),n=[];for(let s=0;s<o.length;s++){const i=o[s],r=(s+1<o.length?o[s+1]:t.length)-1;if(r<i)continue;const l=new Set;for(let u=i;u<=r;u++)for(const b of t[u].asignaciones)b.asignado>0&&l.add(b.objetivoId);n.push({desde:t[i].mes,hasta:t[r].mes,meses:r-i+1,objetivosActivos:[...l]})}return n}function Er(t,e,a){const o=[],n=Math.max(0,e.perfil.netoMensual-e.perfil.gastosFijosMensuales);if(n>0&&e.pctDisfrute>0){const l=Math.ceil(Math.min(e.pctDisfrute,a/n)*100);if(l>0){const u=Math.round(e.pctDisfrute*100);o.push({clase:"REDUCIR_DISFRUTE",magnitud:l,mensaje:`Bajar el disfrute ${l} punto${l!==1?"s":""} (del ${u} % al ${Math.max(0,u-l)} %) libera ${(Math.min(a,n*e.pctDisfrute)/100).toFixed(0)} €/mes.`})}}const s=t.filter(l=>l.def.modoAsignacion==="CUOTA_POR_FECHA"&&l.def.fechaLimite&&l.estado!=="COMPLETADO"),i=l=>l.mesesReclamando>0?l.solicitadoAcumulado/l.mesesReclamando:0,r=[...s].sort((l,u)=>i(u)-i(l))[0];if(r){const l=Math.max(0,r.objetivo-r.saldo),u=i(r),b=Math.max(1,sa(e.fechaInicio,r.def.fechaLimite)),p=Math.max(1,u-a),d=Math.ceil(l/p),h=Math.max(1,d-b);o.push({clase:"RETRASAR_FECHA",objetivoId:r.def._id,magnitud:h,mensaje:`Retrasar «${r.def.nombre}» ${h} mes${h!==1?"es":""}, hasta ${Ro(r.def.fechaLimite,h)}, baja su cuota a lo que cabe en el flujo.`});const y=Math.min(Math.round(a*b),Math.max(0,r.objetivo-1));y>0&&o.push({clase:"REDUCIR_IMPORTE",objetivoId:r.def._id,magnitud:y,mensaje:`O reducir «${r.def.nombre}» en ${(y/100).toFixed(0)} €, de ${(r.objetivo/100).toFixed(0)} € a ${((r.objetivo-y)/100).toFixed(0)} €.`})}return s.length>1&&o.push({clase:"REORDENAR",magnitud:s.length,mensaje:`Hay ${s.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`}),o.length===0&&o.push({clase:"REDUCIR_IMPORTE",magnitud:a,mensaje:`Faltan ${(a/100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`}),o}const Fr=()=>globalThis.Chart??null,$e=["#2ee6a8","#4d9fff","#a855f7","#f97316","#eab308","#22d3ee","#fb7185","#34d399"],qo=new WeakMap;function _r(t,e,a){const o=Fr();if(!o)return null;const n=qo.get(t);if(n)try{n.destroy()}catch{}const s=new Map,i=new Map(e.objetivos.map(h=>[h._id,h.vehiculoId])),r=new Set(e.objetivos.map(h=>h.vehiculoId));for(const h of r)s.set(h,[]);for(const h of a.serieMensual){const y=new Map;for(const I of h.asignaciones){const A=i.get(I.objetivoId);A&&y.set(A,(y.get(A)??0)+I.saldoTrasMes)}for(const I of r)s.get(I).push((y.get(I)??0)/100)}const l=h=>{var y;return((y=e.vehiculos.find(I=>I._id===h))==null?void 0:y.nombre)??"Sin vehículo"},u=[...r],b=u.map((h,y)=>a.serieMensual.map((I,A)=>u.slice(0,y+1).reduce((f,g)=>f+(s.get(g)[A]??0),0))),p=u.map((h,y)=>({label:l(h),data:b[y],borderColor:$e[y%$e.length],backgroundColor:`${$e[y%$e.length]}33`,fill:y===0?"origin":"-1",borderWidth:1.5,pointRadius:0,tension:.25})),d=new o(t,{type:"line",data:{labels:a.serieMensual.map(h=>h.mes),datasets:p},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#a9b6cc",font:{size:11},boxWidth:12}},tooltip:{backgroundColor:"#111a28",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#a9b6cc",bodyColor:"#eef3fb",callbacks:{label:h=>{const y=h.datasetIndex>0?h.chart.data.datasets[h.datasetIndex-1].data[h.dataIndex]??0:0;return` ${h.dataset.label}: ${j(h.parsed.y-y)}`}}}},scales:{x:{ticks:{color:"#6b7b96",maxTicksLimit:12},grid:{display:!1}},y:{ticks:{color:"#6b7b96",callback:h=>j(h)},grid:{color:"rgba(255,255,255,0.07)"}}}}});return qo.set(t,d),d}const na=t=>j(t/100),Pr={CUOTA_POR_FECHA:"Cuota para llegar a la fecha",ABSORBE_TODO:"Se lleva todo lo disponible",ABSORBE_RESIDUAL:"Recibe lo que sobre",FIJO:"Importe fijo al mes"},Dr={CUOTA_POR_FECHA:"Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.",ABSORBE_RESIDUAL:"No reclama nada; recoge lo que quede tras servir a los de prioridad superior.",FIJO:"Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene."},Lo={COMPLETADO:"var(--accent)",EN_CURSO:"var(--text)",PENDIENTE:"var(--text3)",INVIABLE:"var(--red)"};function Tr(t,e){if(t.objetivos.length===0)return`<div class="card" style="text-align:center;padding:34px 20px">
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
    ${a.map(s=>{var i;return Rr(s,e,o,(i=n(s.vehiculoId))==null?void 0:i.nombre)}).join("")}`}function Rr(t,e,a,o){const n=ye(t),s=e.estadoFinal[t._id]??t.estado,i=a==null?void 0:a.asignaciones.find(p=>p.objetivoId===t._id),r=(i==null?void 0:i.solicitado)??0,l=e.hitos.find(p=>p.objetivoId===t._id),u=n>0?Math.min(100,t.saldoActual/n*100):0,b=e.avisos.filter(p=>p.objetivoId===t._id);return`
    <div class="card mb-10" draggable="true" data-pl-objetivo="${c(t._id)}"
         style="padding:14px 16px;border-left:3px solid ${Lo[s]??"var(--text3)"};cursor:grab">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span title="Arrastra para cambiar la prioridad" style="color:var(--text3);cursor:grab;user-select:none">⠿</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3)">#${c(t.prioridad)}</span>
            <span style="font-weight:700;font-size:14px">${c(t.nombre)}</span>
            <span class="badge" style="font-size:10px;background:var(--bg3);color:var(--text2)">${c(Pr[t.modoAsignacion])}</span>
            ${s==="INVIABLE"?'<span class="badge badge-red" style="font-size:10px">no llega</span>':""}
            ${s==="COMPLETADO"?'<span class="badge badge-green" style="font-size:10px">completado</span>':""}
          </div>
          <div class="text-sm" style="color:var(--text3);margin-top:4px">${c(Dr[t.modoAsignacion])}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:17px;font-weight:700">${c(n>0?na(n):"— sin meta —")}</div>
          ${t.fechaLimite?`<div class="text-sm" style="color:var(--text3)">para ${c(t.fechaLimite)}</div>`:""}
          <button class="btn-secondary btn-sm" data-pl-editar-objetivo="${c(t._id)}" style="margin-top:6px;font-size:11px;padding:2px 9px">Editar</button>
        </div>
      </div>

      ${n>0?`<div class="goal-bar" style="margin-top:10px"><div class="goal-bar-fill" style="width:${u.toFixed(1)}%;background:${Lo[s]??"var(--accent)"}"></div></div>`:""}

      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:12px">
        <div><span style="color:var(--text3)">Pide ahora:</span> <strong style="font-family:var(--font-mono)">${c(na(r))}</strong>/mes</div>
        <div><span style="color:var(--text3)">Ya acumulado:</span> <span style="font-family:var(--font-mono)">${c(na(t.saldoActual))}</span></div>
        ${o?`<div><span style="color:var(--text3)">Vehículo:</span> ${c(o)}</div>`:""}
        ${l?`<div><span style="color:var(--text3)">Se completa:</span> <strong style="color:var(--accent)">${c(l.mes)}</strong></div>`:""}
      </div>

      ${b.length>0?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${b.map(p=>`⚠ ${c(p.mensaje)}`).join("<br>")}
             </div>`:""}
      ${t.notas?`<div class="text-sm" style="color:var(--text3);margin-top:8px;white-space:pre-wrap">${c(t.notas)}</div>`:""}
    </div>`}const dt=t=>(t/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}),ko=[{id:"venta-vivienda",nombre:"Venta de vivienda",icono:"🏠",descripcion:"Lo que queda de verdad tras cancelar la hipoteca y pagar impuestos y gastos. Suele ser bastante menos que el precio de venta.",tipo:"INYECCION_CAPITAL",campos:[{id:"precio",etiqueta:"Precio de venta (€)",ayuda:"Lo que te paga el comprador"},{id:"hipoteca",etiqueta:"Hipoteca pendiente (€)",ayuda:"Capital vivo el día de la firma"},{id:"gastos",etiqueta:"Impuestos y gastos (€)",ayuda:"Plusvalía municipal, IRPF de la ganancia, agencia, notaría"}],calcular:t=>Math.max(0,(t.precio??0)-(t.hipoteca??0)-(t.gastos??0)),resumir:t=>`Venta ${dt(t.precio??0)} € − hipoteca ${dt(t.hipoteca??0)} € − gastos ${dt(t.gastos??0)} €`},{id:"nueva-hipoteca",nombre:"Nueva hipoteca",icono:"🔑",descripcion:"Sube tus gastos fijos con la cuota nueva. Normalmente va en la misma fecha que la venta.",tipo:"NUEVA_DEUDA",campos:[{id:"cuota",etiqueta:"Cuota mensual (€)",ayuda:"Se suma a tus gastos fijos a partir de ese mes"}],calcular:t=>t.cuota??0,resumir:t=>`Cuota de ${dt(t.cuota??0)} €/mes`},{id:"hijo",nombre:"Llegada de un hijo",icono:"👶",descripcion:"Fija tus gastos fijos en un valor nuevo. Si el gasto sube por etapas, crea varios eventos seguidos.",tipo:"CAMBIO_GASTOS_FIJOS",campos:[{id:"actuales",etiqueta:"Gastos fijos actuales (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"incremento",etiqueta:"Incremento mensual (€)",ayuda:"Guardería, ropa, sanidad…"}],calcular:t=>(t.actuales??0)+(t.incremento??0),resumir:t=>`Gastos fijos ${dt(t.actuales??0)} € → ${dt((t.actuales??0)+(t.incremento??0))} €/mes`},{id:"subida-sueldo",nombre:"Subida de sueldo",icono:"📈",descripcion:"Fija tu neto mensual en un valor nuevo desde ese mes.",tipo:"CAMBIO_INGRESOS",campos:[{id:"actual",etiqueta:"Neto mensual actual (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"subida",etiqueta:"Subida mensual neta (€)",ayuda:"Lo que te llega a la cuenta, no el bruto"}],calcular:t=>(t.actual??0)+(t.subida??0),resumir:t=>`Neto ${dt(t.actual??0)} € → ${dt((t.actual??0)+(t.subida??0))} €/mes`},{id:"inyeccion",nombre:"Entrada de dinero",icono:"💰",descripcion:"Una herencia, un bonus, la venta de un coche. Puede ir dirigida a un objetivo concreto.",tipo:"INYECCION_CAPITAL",campos:[{id:"importe",etiqueta:"Importe (€)"}],calcular:t=>t.importe??0,resumir:t=>`Entrada de ${dt(t.importe??0)} €`}],Nr=t=>ko.find(e=>e.id===t);function Or(t,e){switch(t.tipo){case"INYECCION_CAPITAL":return`Entra ${dt(t.importe)} €${e?` → «${e}»`:" al reparto general"}`;case"CAMBIO_INGRESOS":return`El neto mensual pasa a ${dt(t.importe)} €`;case"CAMBIO_GASTOS_FIJOS":return`Los gastos fijos pasan a ${dt(t.importe)} €/mes`;case"NUEVA_DEUDA":return`Los gastos fijos suben ${dt(t.importe)} €/mes`}}function qr(t,e,a,o){const n=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,s=new Map(t.vehiculos.map(r=>[r._id,`veh_${n()}`])),i=new Map(t.objetivos.map(r=>[r._id,`obj_${n()}`]));return{...t,_id:a,nombre:e,activo:!1,creadoEn:o,vehiculos:t.vehiculos.map(r=>({...r,_id:s.get(r._id)})),objetivos:t.objetivos.map(r=>({...r,_id:i.get(r._id),vehiculoId:s.get(r.vehiculoId)??r.vehiculoId})),eventos:t.eventos.map(r=>({...r,_id:`ev_${n()}`,objetivoDestinoId:r.objetivoDestinoId?i.get(r.objetivoDestinoId)??null:null}))}}function Lr(t){return[...new Set(t.flatMap(a=>a.hitos.map(o=>o.nombre)))].map(a=>{const o=t.map(i=>i.hitos.find(r=>r.nombre===a)??null),n=o.map(i=>i?i.indice:null),s=n[0];return{nombre:a,meses:o.map(i=>i?i.mes:null),diferencias:n.map(i=>i!==null&&s!==null?i-s:null)}})}const kr=t=>j(t/100),Br={INYECCION_CAPITAL:"💰",CAMBIO_GASTOS_FIJOS:"🏷️",CAMBIO_INGRESOS:"📈",NUEVA_DEUDA:"🔑"};function Hr(t){const e=[...t.eventos].sort((o,n)=>o.fecha.localeCompare(n.fecha)),a=o=>{var n;return o?(n=t.objetivos.find(s=>s._id===o))==null?void 0:n.nombre:void 0};return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      Los eventos son los cambios de vida que mueven el plan de verdad: una venta, una hipoteca nueva, un hijo,
      un ascenso. Se aplican <strong>al principio del mes</strong> que indiques.
    </div>

    <div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Añadir</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${ko.map(o=>`<button class="btn-secondary btn-sm" data-pl-plantilla="${c(o.id)}"
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
             ${e.map(o=>Gr(o,t,a(o.objetivoDestinoId))).join("")}
           </div>`}`}function Gr(t,e,a){const o=sa(e.fechaInicio,t.fecha),n=o<0?"antes del inicio del plan":o===0?"en el primer mes":`dentro de ${o} mes${o!==1?"es":""}`,s=o<0||o>=e.horizonteMeses;return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:16px;flex-shrink:0;width:24px;text-align:center">${Br[t.tipo]}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--accent)">${c(t.fecha)}</span>
          <span style="font-size:11px;color:var(--text3)">${c(n)}</span>
          ${s?'<span class="badge badge-yellow" style="font-size:10px">fuera del horizonte</span>':""}
        </div>
        <div style="font-size:12px;margin-top:3px">${c(Or(t,a))}</div>
        ${t.notas?`<div style="font-size:11px;color:var(--text3);margin-top:2px">${c(t.notas)}</div>`:""}
      </div>
      <div style="display:flex;gap:5px;flex-shrink:0">
        <button class="btn-secondary btn-sm" data-pl-editar-evento="${c(t._id)}" style="font-size:11px;padding:2px 9px">Editar</button>
      </div>
    </div>`}function Vr(t,e,a,o){const n=t.campos.map(i=>{const r=o[i.id];return`<div class="form-group">
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
    </div>`}function Bo(t,e){var o;const a={};for(const n of e.campos){const s=((o=t.querySelector(`#ev-${n.id}`))==null?void 0:o.value)??"",i=parseFloat(String(s).replace(",","."));a[n.id]=Number.isFinite(i)?Math.round(i*100):0}return a}const Ur=(t,e)=>kr(t.calcular(e)),Yr=[-2,-1,0,1,2],Jr=[-10,0,10],Wr=[-20,0,20];function Ho(t){return t.hitos.length===0?null:Math.max(...t.hitos.map(e=>e.indice))}function Qr(t,e,a,o,n){const s={};for(const l of o.hitos)s[l.objetivoId]=l.mes;const i=Ho(o),r=n?Ho(n):i;return{etiqueta:t,delta:e,esBase:a,viable:o.viable,hitos:s,desplazamientoMeses:i!==null&&r!==null?i-r:null,patrimonioFinal:o.resumen.patrimonioFinal}}function Kr(t,e,a){if(a===0)return t;switch(e){case"rentabilidad":return{...t,vehiculos:t.vehiculos.map(o=>({...o,rentabilidadRealAnual:Math.max(0,o.rentabilidadRealAnual+a/100)}))};case"disfrute":return{...t,pctDisfrute:Math.min(1,Math.max(0,t.pctDisfrute+a/100))};case"ingresos":return{...t,perfil:{...t.perfil,netoMensual:Math.max(0,Math.round(t.perfil.netoMensual*(1+a/100)))}}}}const Xr=t=>t>0?`+${t}`:String(t);function ia(t,e,a,o,n,s){const i=xe(t),r=n.map(l=>Qr(l===0?"Plan actual":`${Xr(l)} ${s}`,l,l===0,l===0?i:xe(Kr(t,e,l)),i));return{palanca:e,titulo:a,descripcion:o,variantes:r}}function Zr(t){return[ia(t,"rentabilidad","Rentabilidad de los vehículos","Mueve la rentabilidad real de todos los vehículos a la vez. Es la palanca que menos controlas.",Yr,"puntos"),ia(t,"disfrute","Porcentaje de disfrute","Lo que apartas para gastar en vez de asignar a objetivos. Es la palanca que más controlas.",Jr,"puntos"),ia(t,"ingresos","Ingresos","Un ascenso, un cambio de trabajo o una reducción de jornada.",Wr,"%")]}function tl(t){if(t===null)return"no comparable";if(t===0)return"sin cambio";const e=Math.abs(t),a=Math.floor(e/12),o=e%12,n=[a>0?`${a} año${a!==1?"s":""}`:"",o>0?`${o} mes${o!==1?"es":""}`:""].filter(Boolean).join(" y ");return t<0?`${n} antes`:`${n} más tarde`}const Go=t=>j(t/100);function el(t,e,a){return`
    ${al(t,e)}
    ${t.length>1?ol(t):""}
    ${sl(a)}`}function al(t,e){return`<div class="card mb-14">
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
  </div>`}function ol(t){const e=t.slice(0,3),a=e.map(r=>({plan:r,res:xe(r)})),o=Lr(a.map(({plan:r,res:l})=>({nombre:r.nombre,hitos:l.hitos}))),n=["Hito",...e.map(r=>r.nombre)].map((r,l)=>`<th style="text-align:${l===0?"left":"right"};padding:6px 8px;font-size:11px;color:var(--text3)">${c(r)}</th>`).join(""),s=o.map(r=>`<tr>
      <td style="padding:5px 8px;font-size:12px">${c(r.nombre)}</td>
      ${r.meses.map((l,u)=>{const b=r.diferencias[u],p=b===null||b===0?"var(--text2)":b<0?"var(--accent)":"var(--red)",d=u===0||b===null||b===0?"":`<div style="font-size:10px;color:${p}">${b>0?"+":""}${b} m</div>`;return`<td style="text-align:right;padding:5px 8px;font-family:var(--font-mono);font-size:11px;color:${p}">
            ${c(l??"no llega")}${d}
          </td>`}).join("")}
    </tr>`).join("");return`<div class="card mb-14">
    <div class="card-title mb-10">Comparativa</div>
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">${a.map(({plan:r,res:l})=>`<div style="flex:1;min-width:150px">
      <div style="font-size:11px;color:var(--text3)">${c(r.nombre)}</div>
      <div style="font-family:var(--font-mono);font-size:15px;font-weight:700">${c(Go(l.resumen.patrimonioFinal))}</div>
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
  </div>`}function sl(t){return t?`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Análisis de sensibilidad</span>
      <button class="btn-secondary btn-sm" data-pl-sensibilidad>Recalcular</button>
    </div>
    ${t.map(nl).join("")}
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
    </div>`}function nl(t){return`<div style="margin-bottom:18px">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px">${c(t.titulo)}</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px">${c(t.descripcion)}</div>
    ${t.variantes.map(e=>{const a=e.desplazamientoMeses,o=a===null?"var(--text3)":a===0?"var(--text2)":a<0?"var(--accent)":"var(--red)";return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 0;font-size:12px;${e.esBase?"border-top:1px solid var(--border);border-bottom:1px solid var(--border);":""}">
        <span style="${e.esBase?"font-weight:700":"color:var(--text2)"}">${c(e.etiqueta)}</span>
        <span style="display:flex;gap:14px;align-items:baseline">
          <span style="color:${o};font-size:11px">${c(tl(a))}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3);min-width:88px;text-align:right">${c(Go(e.patrimonioFinal))}</span>
        </span>
      </div>`}).join("")}
  </div>`}const At=t=>j(t/100);function il(t,e,a=0){return`
    ${rl(e)}
    ${ll(t,e)}
    <div class="card mb-14">
      <div class="card-title mb-12">Patrimonio por vehículo</div>
      <div class="chart-wrap-lg"><canvas id="pl-chart"></canvas></div>
    </div>
    ${cl(e)}
    ${dl(t,e)}
    ${ul(t,e,a)}`}function rl(t){if(t.avisos.length===0&&t.propuestas.length===0)return"";const e={error:"var(--red)",atencion:"var(--yellow)",info:"var(--text2)"},a=t.avisos.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:5px">
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
  </div>`}function ll(t,e){const a=(n,s,i="")=>`<div class="stat-card">
      <div class="stat-label">${c(n)}</div>
      <div class="stat-value" style="font-size:18px">${c(s)}</div>
      ${i?`<div class="stat-sub">${c(i)}</div>`:""}
    </div>`,o=e.serieMensual[e.serieMensual.length-1];return`<div class="grid-4 mb-14">
    ${a("Patrimonio final",At(e.resumen.patrimonioFinal),o?`en ${o.mes}`:"")}
    ${a("Total aportado",At(e.resumen.totalAportado),`${e.mesesSimulados} meses simulados`)}
    ${a("Total a disfrute",At(e.resumen.totalDisfrute),`${Math.round(t.pctDisfrute*100)} % del sobrante`)}
    ${a("Independencia",e.resumen.mesIndependencia??"—",e.resumen.mesIndependencia?"objetivo perpetuo cubierto":"sin objetivo de independencia")}
  </div>`}function cl(t){return t.hitos.length===0?`<div class="card mb-14"><div class="card-title mb-8">Hitos</div>
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
  </div>`}function dl(t,e){if(e.fases.length<=1)return"";const a=o=>{var n;return((n=t.objetivos.find(s=>s._id===o))==null?void 0:n.nombre)??o};return`<div class="card mb-14">
    <div class="card-title mb-12">Fases del plan</div>
    <div class="text-sm mb-10" style="color:var(--text3)">Tramos entre hitos: en cada uno el dinero se reparte de forma distinta.</div>
    ${e.fases.map((o,n)=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);flex-shrink:0;width:26px">${n+1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${c(o.desde)} → ${c(o.hasta)} <span style="color:var(--text3);font-weight:400">(${o.meses} mes${o.meses!==1?"es":""})</span></div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">${c(o.objetivosActivos.map(a).join(" · ")||"sin asignaciones")}</div>
        </div>
      </div>`).join("")}
  </div>`}const ne=60;function ul(t,e,a=0){if(e.serieMensual.length===0)return"";const o=[...t.objetivos].sort((b,p)=>b.prioridad-p.prioridad),n=Math.ceil(e.serieMensual.length/ne),s=Math.min(Math.max(0,a),n-1),i=e.serieMensual.slice(s*ne,(s+1)*ne),r=["Mes","Disponible",...o.map(b=>b.nombre),"Sin asignar","Patrimonio"].map(b=>`<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${c(b)}</th>`).join(""),l=i.map(b=>{const p=o.map(d=>{const h=b.asignaciones.find(I=>I.objetivoId===d._id),y=(h==null?void 0:h.asignado)??0;return`<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${y>0?"var(--text)":"var(--text3)"}">${c(y>0?At(y):"·")}</td>`}).join("");return`<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${c(b.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${c(At(b.disponible))}</td>
        ${p}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${c(b.sinAsignar>0?At(b.sinAsignar):"·")}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${c(At(b.patrimonioTotal))}</td>
      </tr>`}).join(""),u=n>1?`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap">
           <button class="btn-secondary btn-sm" data-pl-pagina="${s-1}"${s===0?" disabled":""}>← Anteriores</button>
           <span class="text-sm" style="color:var(--text3)">
             Meses ${s*ne+1}–${Math.min((s+1)*ne,e.serieMensual.length)} de ${e.serieMensual.length}
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
  </div>`}function pl(t,e){const a=[...t.objetivos].sort((i,r)=>i.prioridad-r.prioridad),o=i=>(i/100).toFixed(2).replace(".",","),n=["Mes","Neto","Gastos fijos","Disfrute","Disponible",...a.map(i=>i.nombre),"Sin asignar","Patrimonio"],s=e.serieMensual.map(i=>[i.mes,o(i.netoMensual),o(i.gastosFijos),o(i.disfrute),o(i.disponible),...a.map(r=>{var l;return o(((l=i.asignaciones.find(u=>u.objetivoId===r._id))==null?void 0:l.asignado)??0)}),o(i.sinAsignar),o(i.patrimonioTotal)].join(";"));return[n.join(";"),...s].join(`
`)}const Bt=t=>{const e=typeof t=="number"?t:parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},ie=t=>(t/100).toFixed(2),Vo=t=>(t*100).toFixed(2),Ht=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?e/100:0},ml=[["AHORRO_OBJETIVO","Ahorrar una cantidad"],["AMORTIZAR_DEUDA","Amortizar deuda"],["INVERSION_PERPETUA","Independencia económica"],["APORTACION_FIJA","Aportación periódica"]],fl=[["CUOTA_POR_FECHA","Cuota para llegar a la fecha"],["ABSORBE_TODO","Se lleva todo lo disponible"],["ABSORBE_RESIDUAL","Recibe lo que sobre"],["FIJO","Importe fijo al mes"]],vl=[["INMEDIATA","Inmediata"],["MEDIA","Media (con preaviso o penalización)"],["BLOQUEADA_HASTA_JUBILACION","Bloqueada hasta la jubilación"]],gl=[["NULO","Nulo"],["BAJO","Bajo"],["MEDIO","Medio"],["ALTO","Alto"]],Uo={AHORRO_OBJETIVO:"CUOTA_POR_FECHA",AMORTIZAR_DEUDA:"ABSORBE_TODO",INVERSION_PERPETUA:"ABSORBE_RESIDUAL",APORTACION_FIJA:"FIJO"},lt=(t,e,a,o,n="",s="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <input class="form-input" id="${t}" type="${a}" value="${c(o)}" ${s}>
    ${n?`<div class="text-sm mt-4" style="color:var(--text3)">${n}</div>`:""}
  </div>`,Dt=(t,e,a,o,n="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <select class="form-input" id="${t}">
      ${a.map(([s,i])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(i)}</option>`).join("")}
    </select>
    ${n?`<div class="text-sm mt-4" style="color:var(--text3)">${n}</div>`:""}
  </div>`;function bl(t,e,a){var l,u,b;const o=t===null,n=(t==null?void 0:t.tipo)??"AHORRO_OBJETIVO",s=(t==null?void 0:t.modoAsignacion)??Uo[n],i=!!(t!=null&&t.rentaDeseada),r=e.length>0?e.map(p=>[p._id,p.nombre]):[["","— no hay vehículos: crea uno primero —"]];return`
    <div class="grid-2" style="gap:10px">
      ${lt("ob-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Entrada del piso"')}
      ${lt("ob-prioridad","Prioridad","number",(t==null?void 0:t.prioridad)??a,"Menor número = se sirve antes",'min="1"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Dt("ob-tipo","Tipo",ml,n)}
      ${Dt("ob-modo","Cómo pide dinero",fl,s)}
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
            ${lt("ob-renta","Renta neta mensual (€)","number",ie(((l=t==null?void 0:t.rentaDeseada)==null?void 0:l.rentaNetaMensual)??2e5),"",'step="0.01"')}
            ${lt("ob-swr","Tasa de retiro seguro (%)","number",((((u=t==null?void 0:t.rentaDeseada)==null?void 0:u.tasaRetiroSeguro)??.04)*100).toFixed(2),"",'step="0.1"')}
          </div>
          ${lt("ob-fiscal","Tipo fiscal efectivo al retirar (%)","number",((((b=t==null?void 0:t.rentaDeseada)==null?void 0:b.tipoFiscalEfectivo)??.2)*100).toFixed(2),"",'step="0.5"')}
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
        ${lt("ob-importe","Importe objetivo (€)","number",ie((t==null?void 0:t.importeObjetivo)??0),"Deja 0 si no tiene meta (un cubo perpetuo)",'step="0.01"')}
      </div>
      ${lt("ob-fecha","Fecha límite","month",(t==null?void 0:t.fechaLimite)??"","Vacío = lo antes posible")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ob-saldo","Ya acumulado (€)","number",ie((t==null?void 0:t.saldoActual)??0),"Con lo que arranca el objetivo",'step="0.01"')}
      ${Dt("ob-vehiculo","Vehículo",r,(t==null?void 0:t.vehiculoId)??r[0][0])}
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-fijo" style="display:${s==="FIJO"?"block":"none"}">
        ${lt("ob-fijo","Importe fijo mensual (€)","number",ie((t==null?void 0:t.importeFijoMensual)??0),"",'step="0.01"')}
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
    </div>`}function hl(t,e,a){var u;const o=b=>{var p;return((p=t.querySelector(`#${b}`))==null?void 0:p.value)??""},n=o("ob-nombre").trim();if(!n)return null;const s=o("ob-tipo"),i=o("ob-modo"),r=((u=t.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:u.value)==="renta",l=s==="INVERSION_PERPETUA"&&r;return{_id:(e==null?void 0:e._id)??`obj_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:n,tipo:s,importeObjetivo:l?null:Bt(o("ob-importe")),fechaLimite:o("ob-fecha")||null,prioridad:Math.max(1,Number(o("ob-prioridad"))||a),modoAsignacion:i,vehiculoId:o("ob-vehiculo"),saldoActual:Bt(o("ob-saldo")),estado:(e==null?void 0:e.estado)??"PENDIENTE",notas:o("ob-notas"),...i==="FIJO"?{importeFijoMensual:Bt(o("ob-fijo"))}:{},...i==="ABSORBE_RESIDUAL"?{pesoResidual:Math.max(0,Number(o("ob-peso"))||1)}:{},...l?{rentaDeseada:{rentaNetaMensual:Bt(o("ob-renta")),tasaRetiroSeguro:Ht(o("ob-swr")),tipoFiscalEfectivo:Ht(o("ob-fiscal"))}}:{rentaDeseada:null}}}function yl(t){const e=a=>{var o;return((o=t.querySelector(`#${a}`))==null?void 0:o.value)??""};try{const{capitalNecesario:a}=To({rentaNetaMensual:Bt(e("ob-renta")),tasaRetiroSeguro:Ht(e("ob-swr")),tipoFiscalEfectivo:Ht(e("ob-fiscal"))});return`${(a/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0})} €`}catch{return"no calculable con esos parámetros"}}function xl(t,e,a){const o=t===null,n=!!(t!=null&&t.esDeuda),s=[["","— ninguna —"],...e.map(r=>[r._id,r.nombre])],i=[["","— ninguno —"],...a.map(r=>[r._id,`${r.nombre} (${r.tin} % TIN)`])];return`
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
      ${lt("ve-rent","Rentabilidad REAL anual (%)","number",Vo((t==null?void 0:t.rentabilidadRealAnual)??0),"Nominal menos inflación. Un fondo al 7 % nominal con 2 % de inflación son 5 %",'step="0.1"')}
      ${lt("ve-fiscal","Fiscalidad al retirar (%)","number",Vo((t==null?void 0:t.fiscalidadRetirada)??0),"Tipo efectivo sobre la plusvalía",'step="0.5"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Dt("ve-liquidez","Liquidez",vl,(t==null?void 0:t.liquidez)??"INMEDIATA")}
      ${Dt("ve-riesgo","Riesgo",gl,(t==null?void 0:t.riesgo)??"NULO")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ve-tope","Tope de aportación anual (€)","number",t!=null&&t.topeAportacionAnual?ie(t.topeAportacionAnual):"","Vacío = sin tope. Pensiones: 1500",'step="0.01"')}
      ${Dt("ve-cuenta","Cuenta asociada",s,(t==null?void 0:t.cuentaId)??"","Enlaza con una cuenta que ya tengas")}
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ve-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ve-cancelar>Cancelar</button>
      <button class="btn-primary" data-ve-guardar>${o?"Crear vehículo":"Guardar"}</button>
    </div>`}function $l(t,e){var i;const a=r=>{var l;return((l=t.querySelector(`#${r}`))==null?void 0:l.value)??""},o=a("ve-nombre").trim();if(!o)return null;const n=((i=t.querySelector("#ve-deuda"))==null?void 0:i.checked)??!1,s=a("ve-tope").trim();return{_id:(e==null?void 0:e._id)??`veh_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:o,rentabilidadRealAnual:Ht(a("ve-rent")),liquidez:a("ve-liquidez"),fiscalidadRetirada:Ht(a("ve-fiscal")),topeAportacionAnual:s?Bt(s):null,riesgo:a("ve-riesgo"),cuentaId:a("ve-cuenta")||null,prestamoId:n&&a("ve-prestamo")||null,esDeuda:n}}const Il={CUOTA_POR_FECHA:"Cada mes calcula lo que hace falta para llegar a la fecha, con el saldo que lleva. Si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo lo disponible hasta completarse. Los de menor prioridad no reciben nada mientras tanto.",ABSORBE_RESIDUAL:"No reclama nada: recoge lo que quede tras servir a los de arriba. Es el modo del cubo de largo plazo.",FIJO:"Aporta siempre lo mismo. Si el vehículo tiene tope anual, se aporta hasta agotarlo y se reanuda en enero."},Al="M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z",Yo=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},Ie=t=>(t/100).toFixed(2);function Ml(t){const e=t.hoy??J;let a="config",o=null,n=0,s=null;function i(){const w=t.store.get("planes");return w.find(P=>P.activo)??w[0]??null}function r(){const w=i();return w||t.store.addItem("planes",{nombre:"Plan base",fechaInicio:e().slice(0,7),horizonteMeses:480,pctDisfrute:0,activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:[],objetivos:[],eventos:[],creadoEn:e()})}function l(w){var D;const P=i();P&&(t.store.updateItem("planes",P._id,w),s=null,o=null,(D=t.onDatosCambiados)==null||D.call(t))}function u(){const P=t.store.get("nominas").filter(O=>O.activo).reduce((O,_)=>O+(_.bruto||0),0),D=Math.round(P*.75/12),R=t.store.get("expenses").filter(O=>O.activo&&O.basico&&O.tipo==="gasto").reduce((O,_)=>O+(_.cuantia||0),0);return{neto:Math.round(D*100),gastos:Math.round(R*100)}}function b(w){return s||(s=xe(w)),s}function p(w){const P=u(),D=Math.max(0,w.perfil.netoMensual-w.perfil.gastosFijosMensuales),R=Math.round(w.pctDisfrute*100);return`
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${c(Ie(w.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${c(j(P.neto/100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${c(Ie(w.perfil.gastosFijosMensuales))}">
            <div class="text-sm mt-4" style="color:var(--text3)">Según tus gastos básicos: ~${c(j(P.gastos/100))}/mes</div>
          </div>
        </div>

        <div class="form-group mt-8">
          <label class="form-label">Disfrute: <span id="pl-pct-val" style="font-family:var(--font-mono);color:var(--accent)">${R} %</span> del sobrante</label>
          <input type="range" id="pl-disfrute" min="0" max="100" step="1" value="${R}" style="width:100%;accent-color:var(--accent)">
          <div class="text-sm mt-4" style="color:var(--text3)">
            Lo que NO se asigna a objetivos. Con ${c(j(Math.max(0,w.perfil.netoMensual-w.perfil.gastosFijosMensuales)/100))} de sobrante,
            quedan <strong id="pl-disponible">${c(j(D*(1-w.pctDisfrute)/100))}</strong>/mes para los objetivos.
          </div>
        </div>

        <div class="grid-2 mt-8" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Mes de inicio</label>
            <input class="form-input" type="month" id="pl-inicio" value="${c(w.fechaInicio)}">
          </div>
          <div class="form-group">
            <label class="form-label">Horizonte (meses)</label>
            <input class="form-input" type="number" id="pl-horizonte" min="1" max="600" value="${c(w.horizonteMeses)}">
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

      ${d(w)}`}function d(w){return`
      <div class="card">
        <div class="card-title mb-8">Notas del plan</div>
        <textarea class="form-input" id="pl-notas" rows="4" style="resize:vertical;font-family:var(--font-sans)"
          placeholder="Supuestos, decisiones tomadas, cosas a revisar…">${c(w.notas??"")}</textarea>
        <button class="btn-secondary btn-sm mt-8" data-pl-guardar-notas>Guardar notas</button>
      </div>`}const h=()=>document.getElementById("modal-overlay"),y=()=>document.getElementById("modal-content"),I=()=>{var w;return(w=h())==null?void 0:w.classList.add("hidden")};function A(w,P){const D=h(),R=y();return!D||!R?null:(R.innerHTML=`<div class="modal-title">${c(w)}</div>${P}`,D.classList.remove("hidden"),R)}function f(w){l({objetivos:w})}function g(w,P){const D=i();if(!D)return;const R=P?D.objetivos.find(B=>B._id===P)??null:null,O=D.objetivos.reduce((B,N)=>Math.max(B,N.prioridad),0)+1,_=A(R?`Editar «${R.nombre}»`:"Nuevo objetivo",bl(R,D.vehiculos,O));if(!_)return;const k=()=>{var U;const B=(U=_.querySelector("#ob-modo"))==null?void 0:U.value,N=_.querySelector("#ob-modo-ayuda");N&&B&&(N.textContent=Il[B]);const H=(Q,K)=>{const st=_.querySelector(Q);st&&(st.style.display=K?"block":"none")};H("#ob-bloque-fijo",B==="FIJO"),H("#ob-bloque-residual",B==="ABSORBE_RESIDUAL")};k();const L=()=>{const B=_.querySelector("#ob-capital-derivado");B&&(B.textContent=yl(_))};L(),Y(_,"#ob-modo",k),Y(_,"#ob-tipo",()=>{const B=_.querySelector("#ob-tipo").value,N=_.querySelector("#ob-modo");N&&(N.value=Uo[B]);const H=_.querySelector("#ob-bloque-perpetua");H&&(H.style.display=B==="INVERSION_PERPETUA"?"block":"none"),k()}),Y(_,'input[name="ob-derivar"]',()=>{var U;const B=((U=_.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:U.value)==="renta",N=_.querySelector("#ob-renta-campos"),H=_.querySelector("#ob-bloque-importe");N&&(N.style.display=B?"block":"none"),H&&(H.style.display=B?"none":"block"),L()}),Y(_,"#ob-renta, #ob-swr, #ob-fiscal",L),T(_,"[data-ob-cancelar]",I),T(_,"[data-ob-guardar]",()=>{const B=hl(_,R,O);if(!B){q("El objetivo necesita un nombre","err");return}if(!B.vehiculoId){q("Crea antes un vehículo donde meter el dinero","err");return}const N=D.objetivos.filter(H=>H._id!==B._id);f([...N,B]),I(),q(R?"Objetivo actualizado":`Objetivo «${B.nombre}» creado`),E(w)}),T(_,"[data-ob-borrar]",()=>{R&&Z(`¿Borrar «${R.nombre}»? Esto no se puede deshacer.`)&&(f(D.objetivos.filter(B=>B._id!==R._id)),I(),q("Objetivo borrado"),E(w))})}function m(w,P){const D=i();if(!D)return;const R=P?D.vehiculos.find(L=>L._id===P)??null:null,O=t.store.get("accounts").filter(L=>L.activo).map(L=>({_id:L._id,nombre:L.nombre})),_=t.store.get("loans").filter(L=>L.activo&&!L.simulacion).map(L=>({_id:L._id,nombre:L.nombre,tin:L.tin})),k=A(R?`Editar «${R.nombre}»`:"Nuevo vehículo",xl(R,O,_));k&&(Y(k,"#ve-deuda",()=>{const L=k.querySelector("#ve-deuda").checked,B=k.querySelector("#ve-bloque-prestamo");B&&(B.style.display=L?"block":"none")}),Y(k,"#ve-prestamo",()=>{const L=k.querySelector("#ve-prestamo").value,B=_.find(U=>U._id===L);if(!B)return;const N=k.querySelector("#ve-rent"),H=k.querySelector("#ve-nombre");N&&(N.value=String(B.tin)),H&&!H.value.trim()&&(H.value=`Amortizar ${B.nombre}`)}),T(k,"[data-ve-cancelar]",I),T(k,"[data-ve-guardar]",()=>{const L=$l(k,R);if(!L){q("El vehículo necesita un nombre","err");return}const B=D.vehiculos.filter(N=>N._id!==L._id);l({vehiculos:[...B,L]}),I(),q(R?"Vehículo actualizado":`Vehículo «${L.nombre}» creado`),E(w)}),T(k,"[data-ve-borrar]",()=>{if(!R)return;const L=D.objetivos.filter(B=>B.vehiculoId===R._id);if(L.length>0){q(`No se puede borrar: lo usan ${L.length} objetivo${L.length!==1?"s":""}`,"err");return}Z(`¿Borrar el vehículo «${R.nombre}»?`)&&(l({vehiculos:D.vehiculos.filter(B=>B._id!==R._id)}),I(),q("Vehículo borrado"),E(w))}))}function $(w,P,D){const R=i();if(!R||P===D)return;const O=[...R.objetivos].sort((B,N)=>B.prioridad-N.prioridad),_=O.findIndex(B=>B._id===P),k=O.findIndex(B=>B._id===D);if(_<0||k<0)return;const[L]=O.splice(_,1);O.splice(k,0,L),f(O.map((B,N)=>({...B,prioridad:N+1}))),E(w)}function v(w){return w.vehiculos.length===0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.06);border-color:rgba(255,209,102,0.28)">
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          <strong style="color:var(--yellow)">No hay vehículos todavía.</strong>
          Un vehículo es dónde va el dinero —una cuenta, un fondo, un plan de pensiones o la amortización de un
          préstamo— y con qué rentabilidad crece. Hace falta al menos uno para poder crear objetivos.
        </div>
      </div>`:`<div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Vehículos</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${w.vehiculos.map(P=>{const D=w.objetivos.filter(R=>R.vehiculoId===P._id).length;return`<button class="btn-secondary btn-sm" data-pl-editar-vehiculo="${c(P._id)}"
              style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 11px;text-align:left${P.revisarRentabilidad?";border-color:rgba(255,209,102,0.45)":""}">
              <span style="font-weight:600;font-size:12px">${c(P.nombre)}${P.esDeuda?" 🔒":""}${P.revisarRentabilidad?" ⚠":""}</span>
              <span style="font-size:10px;color:var(--text3)">
                ${c((P.rentabilidadRealAnual*100).toFixed(2))} % real · ${D} objetivo${D!==1?"s":""}
              </span>
            </button>`}).join("")}
      </div>
      ${w.vehiculos.some(P=>P.revisarRentabilidad)?`<div class="text-sm mt-10" style="color:var(--yellow);line-height:1.7;padding-top:10px;border-top:1px solid var(--border)">
               ⚠ Los vehículos marcados traen la rentabilidad de tus cuentas, que es <strong>nominal</strong>.
               Este módulo trabaja en términos <strong>reales</strong>: réstale la inflación que esperes
               (unos 2 puntos) o la simulación te dirá que llegas antes de lo que llegarás. Al guardarlos
               desde su formulario el aviso desaparece.
             </div>`:""}
    </div>`}function x(w,P,D){const R=i(),O=Nr(P);if(!R||!O)return;const _=D?R.eventos.find(N=>N._id===D)??null:null,k={};O.id==="hijo"&&(k.actuales=R.perfil.gastosFijosMensuales),O.id==="subida-sueldo"&&(k.actual=R.perfil.netoMensual);const L=A(_?`Editar evento · ${O.nombre}`:O.nombre,Vr(O,_,R,k));if(!L)return;const B=()=>{const N=L.querySelector("#ev-resultado");N&&(N.textContent=Ur(O,Bo(L,O)))};B();for(const N of O.campos)Y(L,`#ev-${N.id}`,B);T(L,"[data-ev-cancelar]",I),T(L,"[data-ev-guardar]",()=>{var Q,K;const N=((Q=L.querySelector("#ev-fecha"))==null?void 0:Q.value)??"";if(!N){q("El evento necesita un mes","err");return}const H=Bo(L,O),U={_id:(_==null?void 0:_._id)??`ev_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,fecha:N,tipo:O.tipo,importe:O.calcular(H),objetivoDestinoId:((K=L.querySelector("#ev-destino"))==null?void 0:K.value)||null,notas:O.resumir(H)};l({eventos:[...R.eventos.filter(st=>st._id!==U._id),U]}),I(),q(_?"Evento actualizado":"Evento añadido"),E(w)}),T(L,"[data-ev-borrar]",()=>{!_||!Z("¿Borrar este evento?")||(l({eventos:R.eventos.filter(N=>N._id!==_._id)}),I(),q("Evento borrado"),E(w))})}function M(w){var P;switch(w.tipo){case"CAMBIO_GASTOS_FIJOS":return"hijo";case"CAMBIO_INGRESOS":return"subida-sueldo";case"NUEVA_DEUDA":return"nueva-hipoteca";case"INYECCION_CAPITAL":return(P=w.notas)!=null&&P.includes("hipoteca")?"venta-vivienda":"inyeccion"}}function S(){const w=i();if(!w)return;const P=new Blob([JSON.stringify(w,null,2)],{type:"application/json"}),D=URL.createObjectURL(P),R=document.createElement("a");R.href=D,R.download=`plan-${w.nombre.replace(/[^\w-]+/g,"_")}-${e()}.json`,R.click(),URL.revokeObjectURL(D),q("Plan exportado")}function C(w){const P=document.createElement("input");P.type="file",P.accept="application/json,.json",P.addEventListener("change",async()=>{var R,O;const D=(R=P.files)==null?void 0:R[0];if(D)try{const _=JSON.parse(await D.text());if(!_||!Array.isArray(_.objetivos)||!Array.isArray(_.vehiculos)||!_.perfil){q("Ese fichero no es un plan de objetivos","err");return}const k=`${_.nombre??"Importado"} (importado)`,L=t.store.addItem("planes",{..._,nombre:k,activo:!1,creadoEn:e()});s=null,o=null,(O=t.onDatosCambiados)==null||O.call(t),q(`Plan «${L.nombre}» importado`),E(w)}catch(_){console.error("[Planner] Importación fallida:",_),q("No se ha podido leer el fichero","err")}}),P.click()}function z(w,P){switch(a){case"config":return p(w);case"objetivos":return Tr(w,P);case"simulacion":return il(w,P,n);case"eventos":return Hr(w);case"escenarios":return el(t.store.get("planes"),w._id,o)}}function E(w){const P=r(),D=b(P),R=(_,k)=>`<button class="period-btn ${a===_?"active":""}" data-pl-tab="${_}">${k}</button>`,O=D.viable?'<span class="badge badge-green">Plan viable</span>':'<span class="badge badge-red">No cabe en el flujo</span>';if(w.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Objetivos <span>financieros</span></h1>
        <div class="page-actions">${O}</div>
      </div>

      <div class="period-selector mb-14">
        ${R("config","Plan")}
        ${R("objetivos",`Objetivos (${P.objetivos.length})`)}
        ${R("simulacion","Simulación")}
        ${R("eventos",`Eventos (${P.eventos.length})`)}
        ${R("escenarios","Comparar planes")}
      </div>

      ${a==="objetivos"?`<div class="flex gap-8 mb-14 flex-wrap">
               <button class="btn-primary" data-pl-nuevo-objetivo>+ Nuevo objetivo</button>
               <button class="btn-secondary" data-pl-nuevo-vehiculo>+ Nuevo vehículo</button>
             </div>
             ${v(P)}`:""}

      <div id="pl-cuerpo">${z(P,D)}</div>`,a==="simulacion"){const _=w.querySelector("#pl-chart");_&&_r(_,P,D)}F(w)}function F(w){T(w,"[data-pl-tab]",D=>{a=D.dataset.plTab,E(w)}),Y(w,"#pl-disfrute",D=>{const R=Number(D.value)/100,O=w.querySelector("#pl-pct-val");O&&(O.textContent=`${Math.round(R*100)} %`);const _=i();if(!_)return;const k=Math.max(0,_.perfil.netoMensual-_.perfil.gastosFijosMensuales)*(1-R),L=w.querySelector("#pl-disponible");L&&(L.textContent=j(k/100))}),T(w,"[data-pl-usar-sugerido]",()=>{const D=u(),R=w.querySelector("#pl-neto"),O=w.querySelector("#pl-gastos");R&&(R.value=Ie(D.neto)),O&&(O.value=Ie(D.gastos))}),T(w,"[data-pl-guardar]",()=>{const D=R=>{var O;return((O=w.querySelector(R))==null?void 0:O.value)??""};l({perfil:{netoMensual:Yo(D("#pl-neto")),gastosFijosMensuales:Yo(D("#pl-gastos")),manual:!0},pctDisfrute:Math.min(1,Math.max(0,Number(D("#pl-disfrute"))/100)),fechaInicio:D("#pl-inicio")||e().slice(0,7),horizonteMeses:Math.min(600,Math.max(1,Number(D("#pl-horizonte"))||480))}),q("Plan guardado"),E(w)}),T(w,"[data-pl-plantilla]",D=>x(w,D.dataset.plPlantilla??"",null)),T(w,"[data-pl-editar-evento]",D=>{var _;const R=D.dataset.plEditarEvento??"",O=(_=i())==null?void 0:_.eventos.find(k=>k._id===R);O&&x(w,M(O),R)}),T(w,"[data-pl-duplicar]",()=>{var _;const D=i();if(!D)return;const R=window.prompt("Nombre del plan nuevo:",`${D.nombre} (copia)`);if(!(R!=null&&R.trim()))return;const O=qr(D,R.trim(),`plan_${Date.now().toString(36)}`,e());t.store.addItem("planes",O),(_=t.onDatosCambiados)==null||_.call(t),q(`Plan «${O.nombre}» creado. Actívalo para editarlo.`),E(w)}),T(w,"[data-pl-activar]",D=>{var O;const R=D.dataset.plActivar;if(R){for(const _ of t.store.get("planes"))t.store.updateItem("planes",_._id,{activo:_._id===R});s=null,o=null,(O=t.onDatosCambiados)==null||O.call(t),q("Plan activo cambiado"),E(w)}}),T(w,"[data-pl-renombrar]",D=>{var k;const R=D.dataset.plRenombrar,O=t.store.get("planes").find(L=>L._id===R);if(!O)return;const _=window.prompt("Nuevo nombre:",O.nombre);_!=null&&_.trim()&&(t.store.updateItem("planes",O._id,{nombre:_.trim()}),(k=t.onDatosCambiados)==null||k.call(t),E(w))}),T(w,"[data-pl-borrar-plan]",D=>{var k;const R=D.dataset.plBorrarPlan,O=t.store.get("planes").find(L=>L._id===R);if(!O||!Z(`¿Borrar el plan «${O.nombre}» con sus ${O.objetivos.length} objetivos? No se puede deshacer.`))return;t.store.removeItem("planes",O._id);const _=t.store.get("planes");O.activo&&_.length>0&&t.store.updateItem("planes",_[0]._id,{activo:!0}),s=null,o=null,(k=t.onDatosCambiados)==null||k.call(t),q("Plan borrado"),E(w)}),T(w,"[data-pl-sensibilidad]",()=>{const D=i();D&&(o=Zr(D),E(w))}),T(w,"[data-pl-pagina]",D=>{n=Number(D.dataset.plPagina)||0,E(w)}),T(w,"[data-pl-exportar]",S),T(w,"[data-pl-importar]",()=>C(w)),T(w,"[data-pl-nuevo-objetivo]",()=>g(w,null)),T(w,"[data-pl-nuevo-vehiculo]",()=>m(w,null)),T(w,"[data-pl-editar-vehiculo]",D=>m(w,D.dataset.plEditarVehiculo??null)),T(w,"[data-pl-editar-objetivo]",D=>g(w,D.dataset.plEditarObjetivo??null));let P=null;w.querySelectorAll("[data-pl-objetivo]").forEach(D=>{D.addEventListener("dragstart",()=>{P=D.dataset.plObjetivo??null,D.style.opacity="0.45"}),D.addEventListener("dragend",()=>{D.style.opacity="",w.querySelectorAll("[data-pl-objetivo]").forEach(R=>R.style.borderTop="")}),D.addEventListener("dragover",R=>{R.preventDefault(),P&&D.dataset.plObjetivo!==P&&(D.style.borderTop="2px solid var(--accent)")}),D.addEventListener("dragleave",()=>{D.style.borderTop=""}),D.addEventListener("drop",R=>{R.preventDefault(),D.style.borderTop="";const O=D.dataset.plObjetivo;P&&O&&$(w,P,O),P=null})}),T(w,"[data-pl-csv]",()=>{const D=i();if(!D||!s)return;const R=new Blob(["\uFEFF"+pl(D,s)],{type:"text/csv;charset=utf-8"}),O=URL.createObjectURL(R),_=document.createElement("a");_.href=O,_.download=`plan-${D.nombre.replace(/[^\w-]+/g,"_")}-${e()}.csv`,_.click(),URL.revokeObjectURL(O),q(`CSV exportado (${s.serieMensual.length} meses)`)}),T(w,"[data-pl-guardar-notas]",()=>{var D;l({notas:((D=w.querySelector("#pl-notas"))==null?void 0:D.value)??""}),q("Notas guardadas")})}return{id:"planner",route:"planner",nombre:"Objetivos financieros",seccion:2,iconoPath:Al,mount:E}}function Jo(t,e,a=!1){const o=Math.abs(It(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function Sl(t){function e(m){return`${m}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(m={}){var v;const $=(v=m.texto)==null?void 0:v.trim().toLowerCase();return t.get("transacciones").filter(x=>!(m.cuentaId&&x.cuentaId!==m.cuentaId||m.desde&&x.fecha<m.desde||m.hasta&&x.fecha>m.hasta||m.tipo&&x.tipo!==m.tipo||m.estimacionId&&x.estimacionId!==m.estimacionId||m.tags&&m.tags.length>0&&!m.tags.some(M=>x.tags.includes(M))||$&&!x.concepto.toLowerCase().includes($))).sort((x,M)=>x.fecha.localeCompare(M.fecha)||x._id.localeCompare(M._id))}function o(m){const $={_id:e("tx"),fecha:m.fecha,cuentaId:m.cuentaId,importeCts:Jo(m.tipo,m.importe,m.negativo),concepto:m.concepto,tags:m.tags??[],estimacionId:m.estimacionId??null,tipo:m.tipo,origen:m.origen??"manual",...m.nota?{nota:m.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),$]),$}function n(m,$){t.set("transacciones",t.get("transacciones").map(v=>{if(v._id!==m)return v;const{importe:x,...M}=$,S={...v,...M};return x!==void 0&&(S.importeCts=Jo(S.tipo,x,S.importeCts<0)),S}))}function s(m){t.set("transacciones",t.get("transacciones").filter($=>$._id!==m))}function i(m,$){n(m,{estimacionId:$})}function r(m){return t.get("puntosControl").filter($=>!m||$.cuentaId===m).sort(($,v)=>$.fecha.localeCompare(v.fecha))}function l(m,$,v,x){const M={_id:e("pc"),fecha:$,cuentaId:m,saldoCts:It(v),...x?{nota:x}:{}},S=t.get("puntosControl").filter(C=>!(C.cuentaId===m&&C.fecha===$));return t.set("puntosControl",[...S,M].sort((C,z)=>C.fecha.localeCompare(z.fecha))),b(m),M}function u(m){const $=t.get("puntosControl").find(v=>v._id===m);t.set("puntosControl",t.get("puntosControl").filter(v=>v._id!==m)),$&&b($.cuentaId)}function b(m){const $=r(m),v=t.get("accounts");v.some(x=>x._id===m)&&t.set("accounts",v.map(x=>x._id===m?{...x,historicoSaldos:$.map(M=>({_id:M._id,fecha:M.fecha,saldo:et(M.saldoCts),...M.nota?{nota:M.nota}:{}}))}:x))}function p(m,$=J()){const v=r(m).filter(C=>C.fecha<=$).pop(),x=v==null?void 0:v.fecha,M=(v==null?void 0:v.saldoCts)??0;return t.get("transacciones").filter(C=>C.cuentaId===m&&C.fecha<=$&&(x===void 0||C.fecha>x)).reduce((C,z)=>C+z.importeCts,M)}function d(m,$){return et(p(m,$))}function h(m=J(),$){const v=$??t.get("accounts").filter(x=>x.activo).map(x=>x._id);return et(v.reduce((x,M)=>x+p(M,m),0))}function y(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function I(){const m=[...t.get("transacciones").map($=>$.fecha),...t.get("puntosControl").map($=>$.fecha)];return m.length>0?m.sort().pop()??null:null}function A(m={}){return et(a(m).reduce(($,v)=>$+v.importeCts,0))}function f(m={}){const $=new Map;for(const v of a(m)){const x=v.fecha.slice(0,7);$.set(x,($.get(x)??0)+v.importeCts)}return new Map([...$.entries()].sort(([v],[x])=>v.localeCompare(x)).map(([v,x])=>[v,et(x)]))}function g(m={}){const $=new Map;for(const v of a(m))for(const x of v.tags.length>0?v.tags:["sin_tag"])$.set(x,($.get(x)??0)+v.importeCts);return new Map([...$.entries()].map(([v,x])=>[v,et(x)]))}return{transacciones:a,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:u,saldoCuenta:d,saldoCuentaCts:p,saldoTotal:h,tieneDatos:y,ultimaFecha:I,total:A,totalPorMes:f,totalPorTag:g}}function xt(t){return t.trim().toLowerCase()}function wl(t){function e(){const u=new Map,b=(p,d)=>{const h=xt(p);if(!h)return;const y=u.get(h)??{tag:h,estimaciones:0,reales:0,total:0};y[d]+=1,y.total+=1,u.set(h,y)};for(const p of t.get("expenses"))for(const d of p.tags??[])b(d,"estimaciones");for(const p of t.get("transacciones"))for(const d of p.tags??[])b(d,"reales");return[...u.values()].sort((p,d)=>d.total-p.total||p.tag.localeCompare(d.tag))}function a(){return e().map(u=>u.tag)}function o(u){return e().filter(b=>u==="estimaciones"?b.reales===0:b.estimaciones===0).map(b=>b.tag)}function n(u,b,p){const d=xt(b),h=(u??[]).map(xt);if(!h.includes(d))return u??[];const y=h.filter(I=>I!==d);return p===null?[...new Set(y)]:[...new Set([...y,xt(p)])]}function s(u,b){const p=xt(b);if(!p)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return l(u,p)}function i(u,b){let p=0;for(const d of u)xt(d)!==xt(b)&&(p+=l(d,xt(b)).cambiados);return{cambiados:p}}function r(u){return l(u,null)}function l(u,b){let p=0;const d=t.get("expenses").map(M=>{const S=n(M.tags,u,b);return S!==M.tags&&(p+=1),S===M.tags?M:{...M,tags:S}});t.set("expenses",d);const h=t.get("transacciones").map(M=>{const S=n(M.tags,u,b);return S!==M.tags&&(p+=1),S===M.tags?M:{...M,tags:S}});t.set("transacciones",h);const y=t.get("loans").map(M=>{const S=n(M.tags,u,b);return S!==M.tags&&(p+=1),S===M.tags?M:{...M,tags:S}});t.set("loans",y);const I=t.get("nominas").map(M=>{const S=n(M.tags,u,b);return S!==M.tags&&(p+=1),S===M.tags?M:{...M,tags:S}});t.set("nominas",I);const A=t.get("config"),f=xt(u),g=M=>{const S=(M??[]).map(xt);if(!S.includes(f))return M??[];const C=S.filter(z=>z!==f);return b===null?[...new Set(C)]:[...new Set([...C,b])]},m={},$=g(A.activeTagsFilter),v=g(A.tagCategorias),x=g(A.tagGrupos);return $!==A.activeTagsFilter&&(m.activeTagsFilter=$),v!==A.tagCategorias&&(m.tagCategorias=v),x!==A.tagGrupos&&(m.tagGrupos=x),Object.keys(m).length>0&&t.patchConfig(m),{cambiados:p}}return{uso:e,todas:a,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const Cl=3;function Wo(t){return t<.005?0:t}function jl(t){if(t.length<2)return null;const e=t.reduce((o,n)=>o+n,0)/t.length,a=t.reduce((o,n)=>o+(n-e)**2,0)/(t.length-1);return Math.sqrt(a)}function zl(t){const e=[],a=[],o=[];for(const i of t){if(i.meses.length<Cl)continue;const r=jl(i.meses.map(l=>l.desviacion));r!==null&&(e.push(r),a.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(e.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(e.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(a.reduce((i,r)=>i+r*r,0));return{sigmaMensual:Wo(n),sigmaDeriva:Wo(s),estimaciones:e.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function El(t,e,a=1,o=0){if(e<=0)return 0;const n=Math.max(0,t)*Math.sqrt(e),s=Math.max(0,o)*e;return n===0&&s===0?0:W(a*Math.hypot(n,s))}function Fl(t,e,a={}){if(!e.fiable||t.length===0)return[];const{z:o=1}=a,n=a.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[l,u]=r.fecha.slice(0,7).split("-").map(Number),b=Math.max(0,(l-s)*12+(u-i)),p=El(e.sigmaMensual,b,o,e.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:W(r.saldoAcum+p),abajo:W(r.saldoAcum-p)}})}function _l(t,e=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const a=e>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${e} desviación${e!==1?"es":""} típica${e!==1?"s":""} (${a} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const ra="financeapp_session",Pl=["local","dropbox","firebase"];function Dl(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!Pl.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function Tl({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now()}={}){const o=()=>t??(typeof localStorage<"u"?localStorage:null);function n(d){const h=o();if(h)try{d?h.setItem(ra,JSON.stringify(d)):h.removeItem(ra)}catch{}}function s(){const d=o();if(!d)return null;try{return Dl(d.getItem(ra))}catch{return null}}function i(){const d=s();return d?(a()-d.ultimoUso)/6e4:null}function r(){const d=e();if(!Number.isFinite(d)||d<=0)return!1;const h=i();return h!==null&&h>=d}function l(){const d=s();return d?r()?(n(null),null):d:null}function u(d){const h=a(),y={modo:d.modo,...d.email?{email:d.email}:{},...d.passphrase?{passphrase:d.passphrase}:{},creadaEn:h,ultimoUso:h};return n(y),y}function b(){const d=s();d&&n({...d,ultimoUso:a()})}function p(){n(null)}return{abrir:u,leer:l,tocar:b,cerrar:p,caducada:r,inactividadMinutos:i,get activa(){return l()!==null}}}const Qo=["pointerdown","keydown","visibilitychange"];function Rl({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const b of Qo)s==null||s.addEventListener(b,r);const l=o(()=>{i&&t.caducada()&&(u(),t.cerrar(),e())},a);function u(){if(i){i=!1,n(l);for(const b of Qo)s==null||s.removeEventListener(b,r)}}return u}const Nl=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}];function Ko(){if(typeof localStorage<"u"){const d=ln();d.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${d.join(", ")}`)}const t=dn({adapter:rn()}),{applied:e}=t.load();e.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${e.join(", ")} (esquema v${Kt})`);const a=pn(t);js(d=>a.isEnabled(d));const o=Tl({autoLogoutMinutos:()=>{var h,y;const d=(y=(h=globalThis.State)==null?void 0:h.get)==null?void 0:y.call(h,"config");return Number((d==null?void 0:d.autoLogoutMinutos)??t.get("config").autoLogoutMinutos??0)}}),n=Sl(t),s=wl(t),i=Bn(n),r=An(t),l=hn({isEnabled:d=>a.isEnabled(d)}),u=bn({flags:a,rutasExtra:()=>l.flagPorRuta()}),b=gn({flags:a,onChange:()=>{var d,h;l.attachToShell(),u.apply(),(h=(d=globalThis.Router)==null?void 0:d.rerender)==null||h.call(d)}}),p=()=>{var h,y,I,A,f,g;const d=globalThis;if((y=(h=d.State)==null?void 0:h.load)==null||y.call(h),((A=(I=d.Router)==null?void 0:I.current)==null?void 0:A.call(I))==="dashboard")try{(g=(f=d.DashboardModule)==null?void 0:f.render)==null||g.call(f)}catch(m){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",m)}};return l.register(vi({store:t,onDatosCambiados:p})),l.register(wi({store:t,onDatosCambiados:p})),l.register(Vi({store:t,onDatosCambiados:p})),l.register(ur({store:t,ledger:n,mostrarObjetivos:()=>a.isEnabled("goals"),onDatosCambiados:p})),l.register(ti({ledger:n,tags:s,precision:i,adjuster:r,accounts:()=>t.get("accounts"),estimaciones:()=>t.get("expenses"),onDatosCambiados:p})),l.register(Ml({store:t,onDatosCambiados:p})),l.register(Ir({store:t,onDatosCambiados:p})),l.register(li({store:t,onDatosCambiados:p})),l.register(hr({store:t})),l.register(ai({store:t,onDatosCambiados:p})),{version:Kt,core:vs,engine:{generarExtracto:Jt,recomputarSaldoAcum:hs,saldoHoy:ys,sumarPorTags:Na,providers:{proyectarGastos:Yt,proyectarPrestamos:ja,proyectarTransferencias:za,proyectarNominas:Pa,proyectarInteresesCuentas:Fa,proyectarAportaciones:Ea,proyectarRetencionesFiscales:_a,proyectarInflacionGastos:Da,proyectarPerdidaAhorro:Ta},analysis:As,margins:ws,optimizer:zs,dashboard:Hs},store:t,flags:a,featureRegistry:{all:Ct,porGrupo:oo},ui:{openFeatures:b.open,applyGating:u.apply,watchGating:()=>u.observar()},app:l,session:Object.assign(o,{vigilar:d=>Rl({sesion:o,onCaducada:d}),opciones:Nl}),accounting:{ledger:n,tags:s,precision:i,adjuster:r,sugerirAjuste:Ye,medirVariabilidad:zl,bandaDeConfianza:Fl,describirBanda:_l}}}function Ol(){try{const t=Ko();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const Ae=typeof window<"u"?Ol():null;if(Ae){let t=!1;const e=()=>{Ae.app.attachToShell(),Ae.ui.applyGating(),t||(t=!0,Ae.ui.watchGating())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",a=>{const o=a.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(e,0)})}return $t.bootstrap=Ko,Object.defineProperty($t,Symbol.toStringTag,{value:"Module"}),$t}({});
//# sourceMappingURL=financeapp-core.js.map

var FinanceAppBundle=function($t){"use strict";var mc=Object.defineProperty;var fc=($t,V,G)=>V in $t?mc($t,V,{enumerable:!0,configurable:!0,writable:!0,value:G}):$t[V]=G;var us=($t,V,G)=>fc($t,typeof V!="symbol"?V+"":V,G);function V(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function G(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function Y(){return V(new Date)}function Ce(t,e){return new Date(t,e+1,0).getDate()}function ma(t,e,a){return V(new Date(t,e,Math.min(a,Ce(t,e))))}function me(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return V(new Date(t,e+1,0));const s=parseInt(o);if(!isNaN(s))return ma(t,e,s)}if(a.startsWith("nthweekday:")){const o=a.split(":"),s=parseInt(o[1]),n=parseInt(o[2]);if(s===-1){const r=new Date(t,e+1,0);for(;r.getDay()!==n;)r.setDate(r.getDate()-1);return V(r)}const i=new Date(t,e,1);for(;i.getDay()!==n;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(s-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),V(i)}return null}function fa(t,e){if(!e)return t;const a=G(t);return me(a.getFullYear(),a.getMonth(),e)??t}const ps=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],ms={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function je(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${ms[a]||a+"º"} ${ps[o]} del mes`}return t}function Jt(t,e){const a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((o-a)/864e5)}function It(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function et(t){return t/100}function W(t){return et(It(t))}function j(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function va(t){return(t||0).toFixed(2)+"%"}function Rt(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function ga(t,e,a,o=0){const s=Rt(t,e,a),n=t*(1-o/100);let i=e/100/12;for(let r=0;r<200;r++){const u=s*(1-Math.pow(1+i,-a))/i-n,b=s*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),d=i-u/b;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function ba(t,e,a,o,s=0,n=[],i={}){const r=[];let l=t;const u=G(o),b=e/100/12;let d=a,p=Rt(l,e,d);const y=[...n].sort((I,A)=>I.fecha.localeCompare(A.fecha));let g=0;for(let I=1;I<=a*2&&l>.01;I++){const A=new Date(u);u.setMonth(u.getMonth()+1);const v=fa(V(A),i.diaPago||"");for(;g<y.length&&y[g].fecha<=v;){const $=y[g],m=$.cantidad*(s/100);if(l-=$.cantidad,l=Math.max(0,l),$.tipo==="plazo"?d=Math.ceil(-Math.log(1-l*b/p)/Math.log(1+b)):(d=a-I+1,p=Rt(l,e,d)),r.push({mes:"AMORT",fecha:$.fecha,cuota:0,interes:0,amortizacion:$.cantidad,comisionAmort:m,capitalPendiente:l,esAmortizacion:!0,simulacion:$.simulacion||!1}),g++,l<.01)break}if(l<.01)break;const h=l*b,f=Math.min(p-h,l);if(l-=f,l<.01&&(l=0),r.push({mes:I,fecha:v,cuota:p,interes:h,amortizacion:f,comisionAmort:0,capitalPendiente:l,esAmortizacion:!1,simulacion:!1}),d--,d<=0||l<.01)break}return r}const ha=new Map;function at(t){var A;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((v,h)=>`${v.fecha}|${v.cantidad}|${v.tipo||""}`.localeCompare(`${h.fecha}|${h.cantidad}|${h.tipo||""}`)).map(v=>`${v.fecha}:${v.cantidad}:${v.tipo||""}`).join(";")}`,o=ha.get(a);if(o)return o;const{capital:s,tin:n,meses:i,fechaInicio:r,comisionAmort:l,comisionApertura:u}=t,b=ba(s,n,i,r,l||0,e,t),d=b.reduce((v,h)=>v+h.interes,0),p=b.reduce((v,h)=>v+h.comisionAmort,0),y=s*((u||0)/100),g=b.filter(v=>!v.esAmortizacion),I={cuota:Rt(s,n,i),totalIntereses:d,tae:ga(s,n,i,u||0),costoTotal:d+p+y,comAp:y,totalComAm:p,fechaFin:((A=g.slice(-1)[0])==null?void 0:A.fecha)||"",mesesReales:g.length,tabla:b};return ha.set(a,I),I}function ya(t){const e=at(t),a=at({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,s=a.mesesReales-e.mesesReales,n=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:s,costeTotalAmort:n,ahorroNeto:o-n,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function pt(t,e,a){if(!t||t.length===0)return 1;const o=G(e),s=G(a);if(s<=o)return 1;const n=[...t].sort((l,u)=>l.year-u.year);let i=1,r=new Date(o);for(;r<s;){const l=r.getFullYear(),u=n.filter(I=>I.year<=l),b=u.length>0?u[u.length-1]:n[0],d=(b?b.tasa:0)/100,p=new Date(l+1,0,1),y=p<s?p:s,g=Jt(r,y);i*=Math.pow(1+d,g/365.25),r=y}return i}function xa(t,e,a,o=0){const s=G(e),n=G(a);if(n<=s)return o;const i=Jt(s,n),r=t?[...t].sort((b,d)=>b.year-d.year):[];let l=0,u=new Date(s);for(;u<n;){const b=u.getFullYear(),d=new Date(b+1,0,1),p=d<n?d:n,y=Jt(u,p),g=r.filter(v=>v.year<=b),I=g.length>0?g[g.length-1]:null,A=I!==null?I.tasa:o;l+=A*y,u=p}return i>0?l/i:o}function $a(t,e){return((1+t/100)/(1+e/100)-1)*100}function fs(t,e,a,o){const s=pt(e,a,o);return s>0?t/s:t}function vs(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,s=e.saludUmbralDTIVerde??30,n=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],r=e.saludExcluirHipoteca||!1,{ingresos:l=0,cuotas:u=0,cuotasHipoteca:b=0,gastosBasicos:d=0,gastosOtros:p=0,amortizaciones:y=0}=t,g=l-u-y-d-p,I=g,A=l>0?I/l*100:null,v=r?u-b:u,h=l>0?v/l*100:null,f=l>0?u/l*100:null,$=l>0?(d+u+y)/l*100:null,m=l>0?p/l*100:null,x=(w,E,_)=>w===null?"neutral":w>=E?"verde":w>=_?"amarillo":"rojo",S=(w,E,_)=>w===null?"neutral":w<=E?"verde":w<=_?"amarillo":"rojo";return{ingresos:l,cuotas:u,cuotasHipoteca:b,gastosBasicos:d,gastosOtros:p,amortizaciones:y,ahorroBruto:g,ahorroReal:I,tasaAhorro:A,dti:h,dtiTotal:f,excluyeHipoteca:r,pctNecesidades:$,pctDeseos:m,semAhorro:x(A,a,o),semDTI:S(h,s,n),semNecesidades:S($,i[0],i[0]+15),semDeseos:S(m,i[1],i[1]+10),semAhorroRegla:x(A,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:s,umbralDTIAmarillo:n,regla:i}}function mt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function rt(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function Wt(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];a&&o.push({fecha:a,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((n,i)=>{n.fecha>=a&&o.push({...n,prioridad:i})}),o.sort((n,i)=>i.fecha.localeCompare(n.fecha)||i.prioridad-n.prioridad);const s=o.find(n=>n.fecha<=e);return s?s.saldo:t.saldoInicial||0}else{const s=[...t.historicoSaldos||[]].sort((n,i)=>i.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=e);return s?s.saldo:0}}function Ee(t,e){const a=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return a?e.filter(o=>a.includes(o._id)):e.filter(o=>o.activo&&!o.simulacion)}function Ia(t,e,a=0){const o=Ee(t,e).reduce((s,n)=>s+rt(n),0);return t.usarColchon!==!1?Math.max(0,o-a):o}function gs(t,e,a){if(!t.targetAmount||t.targetAmount<=0)return null;const o=Ee(t,e);if(o.length===0)return null;const s=a.hoy??new Date,n=a.horizonteMeses??120,i=t.usarColchon!==!1,r=o.map(l=>({acc:l,eventos:a.extractoCuenta(l),cursor:0,saldo:rt(l)}));for(let l=1;l<=n;l++){const u=new Date(s.getFullYear(),s.getMonth()+l,1),b=`${u.getFullYear()}-${String(u.getMonth()+1).padStart(2,"0")}`,d=V(new Date(u.getFullYear(),u.getMonth()+1,0));let p=0;for(const g of r){for(;g.cursor<g.eventos.length&&g.eventos[g.cursor].fecha<=d;)g.saldo=g.eventos[g.cursor].saldoAcum??g.saldo,g.cursor++;p+=g.saldo}const y=i?a.colchonEnFecha(d):0;if(p-y>=t.targetAmount)return b}return null}function Aa(t,e){const a=t.escenarioIds||[];return a.length===0?!0:!!e&&a.includes(e)}function Sa(t,e){const a=o=>Aa(o,e);return{loans:t.loans.filter(a).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}const ze=t=>t.slice(0,7);function bs(t){const[e,a]=t.split("-").map(Number);return`${a===12?e+1:e}-${String(a===12?1:a+1).padStart(2,"0")}`}function _e(t,e,a){if(t.length===0)return[];const o=new Map;for(const u of t)u.saldoAcum!==void 0&&o.set(ze(u.fecha),u.saldoAcum);const s=t[0];let n=(s.saldoAcum??0)-(s.delta??0);const i=ze(e||s.fecha),r=ze(a||t[t.length-1].fecha);if(r<i)return[];const l=[];for(let u=i;u<=r;u=bs(u)){const b=o.get(u);b!==void 0&&(n=b);const[d,p]=u.split("-").map(Number);l.push({x:G(V(new Date(d,p-1,15))).getTime(),mes:u,y:n})}return l}function Fe(t,e){let a=null;for(const o of t){if(o.fecha>e)break;o.saldoAcum!==void 0&&(a=o.saldoAcum)}return a}function hs(t){const e=a=>!a.simulacion;return{loans:t.loans.filter(e).map(a=>({...a,amortizaciones:(a.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}function ys(t){const e=a=>!!a.simulacion;return t.loans.some(a=>e(a)||(a.amortizaciones||[]).some(e))||t.expenses.some(e)||t.nominas.some(e)||t.accounts.some(e)}const gt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ut(t,e){const a=[...e].sort((n,i)=>n[0]-i[0]);let o=0,s=t;for(let n=a.length-1;n>=0;n--){const[i,r]=a[n];s<=i||(o+=(s-i)*(r/100),s=i)}return o}function Pe(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,s=Math.min(2e3,a),n=Math.max(0,a-o-s),i=n<=15876?7302:n<=21622?Math.max(0,7302-1.75*(n-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:s,RNT:n,reducArt20:i,baseImponible:Math.max(0,n-i)}}function St(t,e){return Pe(t,e).baseImponible}function Ma(t,e){return ut(t,e)/12}const Et=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function De(t,e){if(!t||t<=0)return 0;const a=e||Et;let o=0,s=t;for(let n=0;n<a.length;n++){const[i,r]=a[n],l=n<a.length-1?a[n+1][0]:1/0,u=Math.min(s,l-i);if(!(u<=0)&&(o+=u*(r/100),s-=u,s<=0))break}return o}function Ot(t,e){if(mt(t)!=="inversion")return null;const a=rt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,s=Math.max(0,a-o),n=De(s,e);return{saldo:a,costBase:o,plusvalia:s,impuesto:n,neto:a-n}}function fe(t,e=new Date){var p;if(mt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=rt(t),s=V(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),n=[...t.aportaciones||[]].sort((y,g)=>y.fecha.localeCompare(g.fecha));let i=0;const r=n.reduce((y,g)=>y+g.cantidad,0);for(const y of n)y.fecha<=s&&(i+=y.cantidad);const l=Math.max(0,o-r),u=r>0?i/r:0,b=Math.min(o,i+l*u),d=Math.max(0,o-b);return{saldo:o,disponible:b,bloqueado:d,costBase:r,beneficio:l,numAportaciones:n.length,proxDesbloqueo:((p=n.find(y=>y.fecha>s))==null?void 0:p.fecha)||null}}function wa(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(mt(t)!=="pension"||!o)return 0;const s=rt(t);if(s<=0)return 0;const n=(t.aportaciones||[]).reduce((u,b)=>u+b.cantidad,0),i=Math.max(0,s-n);if(i<=0)return 0;const r=i/s;return+(e*r*o/100).toFixed(2)}function Te(t,e,a){var l;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const n=(e||[]).filter(u=>(u.grupoNomina||"")===o&&u.activo!==!1).reduce((u,b)=>u+(b.bruto||0)*(b.nPagas||12),0),i=[...a||[]].sort((u,b)=>u[0]-b[0]);let r=((l=i[0])==null?void 0:l[1])||19;for(const[u,b]of i)if(n>=u)r=b;else break;return r}const Ne=6.35;function zt(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function Ca(t){return Math.max(0,(t.bruto||0)-zt(t))}function xs(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function $s(t){const e=t.reduce((i,r)=>i+(r.bruto||0),0),a=t.reduce((i,r)=>i+zt(r),0),o=Math.max(0,e-a),s=St(e,a),n=new Map;for(const i of t)n.set(i._id,o>0?s*(Ca(i)/o):0);return n}function Re(t,e,a){if(t.irpfModo==="manual")return Ca(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return ut(St(t.bruto||0,zt(t)),a);const o=xs(e.filter(i=>i.irpfModo!=="manual")),s=$s(e);let n=0;for(const i of o){const r=s.get(i._id)??0;if(i._id===t._id)return ut(n+r,a)-ut(n,a);n+=r}return ut(St(t.bruto||0,zt(t)),a)}function Is(t,e){return t.reduce((a,o)=>a+Re(o,t,e),0)}function As(t,e){var s;const a=[...e||[]].sort((n,i)=>n[0]-i[0]);let o=((s=a[0])==null?void 0:s[1])??19;for(const[n,i]of a)if(t>=n)o=i;else break;return o}function ja(t,e){if(!t||t.length===0)return 0;const a=t.reduce((s,n)=>s+(n.bruto||0),0),o=t.reduce((s,n)=>s+zt(n),0);return As(St(a,o),e)}function Oe(t,e,a){const o=t.bruto||0,s=zt(t),n=Math.max(0,o-s),i=t.nPagas||12,r=t.ssPct??Ne,l=n*(r/100),u=Re(t,e,a);return{brutoAnual:o,flexAnual:s,baseDineraria:n,nPagas:i,ssPct:r,ssAnual:l,irpfAnual:u,irpfPct:n>0?u/n*100:0,netoPorPaga:(n-l-u)/i}}function Ss(t){const e=new Map,a=[];for(const o of t){const s=o.grupoNomina||"";if(!s){a.push(o);continue}const n=e.get(s)??[];n.push(o),e.set(s,n)}return{grupos:e,sueltas:a}}const _t=1500;function Ea(t){const e=t.cuantia||0,a=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?e*12/a:t.tipoFrecuencia==="diaria"?e*365.25/a:e}const Kt=t=>{const e=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(e)?e:0};function Ms(t,e){const a=t.grupoNomina||"";return a?e.filter(o=>(o.grupoNomina||"")===a):null}function za(t,e){return t.reduce((a,o)=>a+Re(o,Ms(o,t),e),0)}function _a(t){const{nominas:e,tramosGeneral:a,tramosAhorro:o}=t,s=t.extras??{},n=e.reduce((w,E)=>w+(E.bruto||0),0),i=e.reduce((w,E)=>w+zt(E),0),r=Pe(n,i),l=t.aportacionesPension,u=_t,b=Math.min(l,u),d=Math.max(0,r.RNT-r.reducArt20-b),p=Kt(s.capInmobiliario),y=Kt(s.capMobiliario),g=Kt(s.gananciasFondos),I=Kt(s.otrasCorto),A=Kt(s.retCapital),v=Math.max(0,d+t.otrosIngresos+p+I),h=Math.max(0,y+g),f=ut(v,a),$=ut(h,o),m=f+$,x=za(e,a),S=x+A;return{brutoTotal:n,flexTotal:i,brutoIRPF:r.baseIRPF,cotizSS:r.cotizSS,gastosArt19:r.gastosArt19,RNT:r.RNT,reducArt20:r.reducArt20,aportPP:l,limPP:u,deducPP:b,RNTred:d,otrosIngresos:t.otrosIngresos,capInmobiliario:p,capMobiliario:y,gananciasFondos:g,otrasCorto:I,baseGeneral:v,baseAhorro:h,cuotaGen:f,cuotaAho:$,cuotaIntegra:m,retNomina:x,retCapital:A,totalRet:S,resultado:m-S}}const ws=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:_t,TRAMOS_AHORRO_DEFAULT:Et,TRAMOS_IRPF_DEFAULT:gt,ajustarFechaPago:fa,ajustarPrecioReal:fs,calcBaseImponibleTrabajo:St,calcFactorInflacion:pt,calcFondoInversion:Ot,calcFondosPension:fe,calcGananciasCapital:De,calcIRPF:ut,calcImpuestoPension:wa,calcInflacionMediaAnual:xa,calcSaludFinanciera:vs,calcTAE:ga,calcTipoMarginalPension:Te,calcTipoRealFisher:$a,calcularDeclaracion:_a,clampedDate:ma,cuentasDelObjetivo:Ee,cuotaMensual:Rt,desgloseBaseTrabajo:Pe,diasEntre:Jt,filtrarPorEscenario:Sa,formatEUR:j,formatLocalDate:V,formatPct:va,fromCents:et,haySimulaciones:ys,ingresoAnual:Ea,labelDiaPago:je,lastDayOfMonth:Ce,modeloFondoDe:mt,parseLocalDate:G,proyectarFechaCumplimiento:gs,resolverDiaEfectivo:me,resumenPrestamo:at,resumenPrestamoConAhorro:ya,retencionMensual:Ma,retencionesNomina:za,roundMoney:W,saldoEnFecha:Wt,saldoEnFechaExtracto:Fe,saldoParaObjetivo:Ia,saldoRealCuenta:rt,serieMensual:_e,sinSimulaciones:hs,tablaAmortizacion:ba,toCents:It,todayISO:Y,visibleEnEscenario:Aa},Symbol.toStringTag,{value:"Module"}));function Qt(t,e,a=null){const o=[],s=G(e.start),n=G(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const r=G(i.fechaInicio||e.start),l=i.fechaFin?G(i.fechaFin):n,u=i.cuantia,b=d=>o.push({fecha:d,concepto:i.concepto,cuantia:u,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=s&&r<=n&&r<=l&&b(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let p=r.getFullYear(),y=r.getMonth();const g=Math.ceil(240/d)+2;for(let I=0;I<g;I++){const A=me(p,y,i.diaPago||"")||(()=>{const h=r.getDate(),f=new Date(p,y+1,0).getDate();return V(new Date(p,y,Math.min(h,f)))})(),v=G(A);if(v>n||v>l)break;v>=s&&v>=r&&b(A),y+=d,y>=12&&(p+=Math.floor(y/12),y=y%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let p=new Date(Math.max(r.getTime(),s.getTime()));if(r<s){const y=Math.ceil((s.getTime()-r.getTime())/d);p=new Date(r.getTime()+y*d)}for(;p<=n&&p<=l;)b(V(p)),p=new Date(p.getTime()+d)}}return o}function Fa(t,e,a=null){const o=[];for(const s of t){if(!s.activo||a&&a.length>0&&!a.includes(s.cuenta||"default"))continue;const{tabla:n}=at(s);for(const i of n)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${s.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${s.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan",simulacion:s.simulacion||!1}))}return o}function Pa(t,e,a=null,o={accounts:[]}){const s=[],n=G(e.start),i=G(e.end),r=o.accounts||[],l=o.nominas||[],u=o.resolverTramosIRPF||(()=>gt),b=o.resolverTramosGanancias||(()=>Et),d=p=>{var y;return((y=r.find(g=>g._id===p))==null?void 0:y.nombre)??p};for(const p of t){if(!p.activo||p.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(p.cuenta||"default")||a.includes(p.cuentaDestino||"default")))continue;const y=G(p.fechaInicio||e.start),g=p.fechaFin?G(p.fechaFin):i,I=A=>{const v=r.find(D=>D._id===(p.cuenta||"default")),h=r.find(D=>D._id===(p.cuentaDestino||"default")),f=mt(v),$=mt(h),m=f==="inversion"&&$==="inversion"||f==="pension"&&$==="pension",x=["transferencia",...m?["traspaso"]:[],...p.tags||[]],S=m?"traspaso-out":"transfer-out",w=m?"traspaso-in":"transfer-in",E=!a||a.length===0||a.includes(p.cuenta||"default"),_=!a||a.length===0||a.includes(p.cuentaDestino||"default");if(E&&s.push({fecha:A,concepto:`Transf. → ${d(p.cuentaDestino||"default")}: ${p.concepto}`,cuantia:p.cuantia,tipo:"gasto",tags:x,cuenta:p.cuenta||"default",sourceId:p._id,sourceType:S}),_&&s.push({fecha:A,concepto:`Transf. ← ${d(p.cuenta||"default")}: ${p.concepto}`,cuantia:p.cuantia,tipo:"ingreso",tags:x,cuenta:p.cuentaDestino||"default",sourceId:p._id,sourceType:w}),E&&!m&&v){if(f==="inversion"){const D=parseInt(A.slice(0,4)),C=Ot(v,b(D));if(C&&C.saldo>0&&C.plusvalia>0){const M=Math.min(1,p.cuantia/C.saldo),F=C.plusvalia*M*.19;F>.01&&s.push({fecha:A,concepto:`Retención IRPF reembolso ${v.nombre} (19% s/plusvalía)`,cuantia:F,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:p.cuenta||"default",sourceId:p._id,sourceType:"investment-tax"})}}else if(f==="pension"){const D=u(parseInt(A.slice(0,4))),C=Te(v,l,D),M=wa(v,p.cuantia,C||void 0);if(M>0){const z=v.grupoNomina?`IRPF rescate ${v.nombre} (tipo marginal grupo "${v.grupoNomina}": ${C}%)`:`Retención rescate ${v.nombre} (${v.impuestoRetirada}% s/beneficio)`;s.push({fecha:A,concepto:z,cuantia:M,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:p.cuenta||"default",sourceId:p._id,sourceType:"pension-tax"})}}}};if(p.tipoFrecuencia==="extraordinario")y>=n&&y<=i&&y<=g&&I(p.fechaInicio);else if(p.tipoFrecuencia==="mensual"){const A=Math.max(1,p.frecuencia||1);let v=y.getFullYear(),h=y.getMonth();const f=Math.ceil(240/A)+2;for(let $=0;$<f;$++){const m=me(v,h,p.diaPago||"")||(()=>{const S=y.getDate(),w=new Date(v,h+1,0).getDate();return V(new Date(v,h,Math.min(S,w)))})(),x=G(m);if(x>i||x>g)break;x>=n&&x>=y&&I(m),h+=A,h>=12&&(v+=Math.floor(h/12),h=h%12)}}else if(p.tipoFrecuencia==="diaria"){const A=Math.max(1,p.frecuencia||1)*864e5;let v=new Date(Math.max(y.getTime(),n.getTime()));if(y<n){const h=Math.ceil((n.getTime()-y.getTime())/A);v=new Date(y.getTime()+h*A)}for(;v<=i&&v<=g;)I(V(v)),v=new Date(v.getTime()+A)}}return s}function Da(t,e,a=null){const o=[],s=G(e.start),n=G(e.end);for(const i of t){const r=mt(i);if(r==="cuenta"||!i.activo)continue;const l=i.planAportaciones||[];for(const u of l){if(!u.importe||u.importe<=0)continue;const b=G(u.fechaInicio||e.start),d=u.fechaFin?G(u.fechaFin):n,p=u.cuentaOrigen||"default",y=!a||!a.length||a.includes(p),g=!a||!a.length||a.includes(i._id),I=r==="pension"?"pension":"capital-mobiliario",A=m=>{y&&o.push({fecha:m,concepto:`Aportación → ${i.nombre}`,cuantia:u.importe,tipo:"gasto",tags:["aportacion","transferencia",I],cuenta:p,sourceId:u._id,sourceType:"aportacion-out"}),g&&o.push({fecha:m,concepto:`Aportación ${i.nombre} (${u.periodicidad||"mensual"})`,cuantia:u.importe,tipo:"ingreso",tags:["aportacion","transferencia",I],cuenta:i._id,sourceId:u._id,sourceType:"aportacion-in"})},v={mensual:1,trimestral:3,semestral:6,anual:12}[u.periodicidad||"mensual"]||1;let h=b.getFullYear(),f=b.getMonth();const $=Math.ceil(240/v)+2;for(let m=0;m<$;m++){const x=new Date(h,f+1,0).getDate(),S=V(new Date(h,f,Math.min(b.getDate(),x))),w=G(S);if(w>n||w>d)break;w>=s&&w>=b&&A(S),f+=v,f>=12&&(h+=Math.floor(f/12),f=f%12)}}}return o}function Ta(t,e,a=null,o=[]){const s=[];for(const n of t){if(!n.activo||!n.interes||n.interes<=0||a&&a.length>0&&!a.includes(n._id))continue;const i=G(e.start),r=G(e.end),l=n.periodoCobro||"mensual",u=l==="mensual",b=u?null:{diario:864e5,semanal:7*864e5}[l]||864e5,d=u?1/12:b/(365.25*864e5);let p=Wt(n,e.start);const y=o.filter(A=>A.cuenta===n._id).map(A=>({fecha:A.fecha,delta:A.tipo==="ingreso"?Math.abs(A.cuantia):-Math.abs(A.cuantia)})).sort((A,v)=>A.fecha.localeCompare(v.fecha));let g=0,I=new Date(i);for(;I<=r;){const A=u?new Date(I.getFullYear(),I.getMonth()+1,I.getDate()):new Date(I.getTime()+b),v=new Date(Math.min(A.getTime(),r.getTime()+1)),h=V(v);let f=0;for(;g<y.length&&y[g].fecha<h;)f+=y[g].delta,g++;const $=p,m=p+f,x=Math.max(0,($+m)/2);p=m;const S=u?d:(v.getTime()-I.getTime())/(365.25*864e5),w=x*(Math.pow(1+n.interes/100,S)-1);w>.001&&s.push({fecha:V(I),concepto:`Interés ${n.nombre}`,cuantia:w,tipo:"ingreso",tags:["interes","cuenta"],cuenta:n._id,sourceId:n._id,sourceType:"account-interest"}),I=A}}return s}function Na(t,e,a,o=null){const s=[],n=e||gt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),l=Ma(r,n),u={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:l,tags:["irpf","fiscal"]};s.push(...Qt([u],a,o))}return s}const Cs=[5,11,2,8],js={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function Ra(t,e,a=null,o=[],s=()=>gt){const n=[],i=G(e.start),r=G(e.end),l=o.length>0,u={};for(const p of t){const y=p.grupoNomina||"";u[y]||(u[y]=[]),u[y].push(p)}for(const p of Object.keys(u))u[p].sort((y,g)=>(g.bruto||0)-(y.bruto||0));function b(p,y){if(!l||!p.mesActualizacionIPC)return p.bruto||0;const g=p.fechaInicio||e.start,I=G(g),A=G(y);let v=0;for(let f=I.getFullYear();f<=A.getFullYear();f++){const $=new Date(f,p.mesActualizacionIPC-1,1);$>I&&$<=A&&v++}if(v===0)return p.bruto||0;const h=V(new Date(I.getFullYear()+v,0,1));return(p.bruto||0)*pt(o,g,h)}function d(p,y){const g=b(p,y),I=(p.retribucionFlexible||[]).reduce((D,C)=>D+(C.importe||0)*12,0),A=Math.max(0,g-I);if(p.irpfModo==="manual")return A*((p.irpfPct||0)/100);const v=s(parseInt(y.slice(0,4))),h=p.grupoNomina||"";if(!h)return ut(St(g,I),v);const f=u[h].filter(D=>D.activo),$=f.reduce((D,C)=>D+b(C,y),0),m=f.reduce((D,C)=>D+(C.retribucionFlexible||[]).reduce((M,z)=>M+(z.importe||0)*12,0),0),x=Math.max(0,$-m),S=St($,m),w=Math.max(0,g-I),E=x>0?S*(w/x):0,_=f.filter(D=>D._id!==p._id&&(D.bruto||0)>(p.bruto||0)).reduce((D,C)=>{const M=(C.retribucionFlexible||[]).reduce((F,T)=>F+(T.importe||0)*12,0),z=Math.max(0,b(C,y)-M);return D+(x>0?S*(z/x):0)},0);return ut(_+E,v)-ut(_,v)}for(const p of t){if(!p.activo)continue;const y=p.cuenta||"default";if(a&&a.length>0&&!a.includes(y))continue;const g=Math.max(1,p.nPagas||12),I=G(p.fechaInicio||e.start),A=p.fechaFin?G(p.fechaFin):r,v=h=>{const f=b(p,h),$=d(p,h),m=(p.retribucionFlexible||[]).reduce((M,z)=>M+(z.importe||0)*12,0),x=Math.max(0,f-m),S=(p.ssPct??6.35)/100,w=x*S,E=x/g,_=$/g,D=w/g,C=p.representacion==="simplificado"?E-D-_:E;n.push({fecha:h,concepto:p.nombre,cuantia:C,tipo:"ingreso",cuenta:y,tags:p.tags||[],sourceId:p._id,sourceType:"nomina"}),p.representacion==="detallado"&&(D>0&&n.push({fecha:h,concepto:`SS ${p.nombre}`,cuantia:D,tipo:"gasto",cuenta:y,tags:["seguridad-social","fiscal"],sourceId:p._id+"_ss",sourceType:"nomina"}),_>0&&n.push({fecha:h,concepto:`IRPF ${p.nombre}`,cuantia:_,tipo:"gasto",cuenta:y,tags:["irpf","fiscal"],sourceId:p._id+"_irpf",sourceType:"nomina"}));for(const M of p.retribucionFlexible||[])!M.cuenta||!(M.importe>0)||a&&a.length>0&&!a.includes(M.cuenta)||n.push({fecha:h,concepto:`${p.nombre} — ${js[M.tipo]||M.tipo}`,cuantia:M.importe,tipo:"ingreso",cuenta:M.cuenta,tags:["retribucion-flexible",M.tipo],sourceId:`${p._id}_flex_${M._id||M.tipo}`,sourceType:"nomina"})};if(g<=12){const h=g===12?1:Math.round(12/g),f=I.getDate();let $=I.getFullYear(),m=I.getMonth();for(let x=0;x<300;x++){const S=new Date($,m+1,0).getDate(),w=new Date($,m,Math.min(f,S));if(w>r||w>A)break;w>=i&&w>=I&&v(V(w)),m+=h,m>=12&&($+=Math.floor(m/12),m=m%12)}}else{const h=g-12,f=I.getDate();let $=I.getFullYear(),m=I.getMonth();for(let w=0;w<300;w++){const E=new Date($,m+1,0).getDate(),_=new Date($,m,Math.min(f,E));if(_>r||_>A)break;_>=i&&_>=I&&v(V(_)),m++,m>=12&&($++,m=0)}const x=Math.max(I.getFullYear(),i.getFullYear()),S=Math.min((p.fechaFin?A:r).getFullYear(),r.getFullYear());for(let w=x;w<=S;w++)for(const E of Cs.slice(0,h)){const _=new Date(w,E,15);_>=i&&_<=r&&_>=I&&_<=A&&v(V(_))}}}return n}function Oa(t,e,a,o=null,s="default"){const n=[];if(!e||e.length===0)return n;const i=G(a.start),r=G(a.end),l=Y(),u=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let b=new Date(i.getFullYear(),i.getMonth(),1);for(;b<=r;){const d=b.getFullYear(),p=b.getMonth(),y=d+"-"+String(p+1).padStart(2,"0"),g=y+"-01",I=V(new Date(d,p+1,0)),A=V(new Date(d,p,15));let v=0;for(const h of u){if(o&&o.length>0&&!o.includes(h.cuenta||"default")||h.fechaInicio&&h.fechaInicio>I||h.fechaFin&&h.fechaFin<g)continue;const f=h.fechaInicio||l,$=pt(e,f,A);if($<=1)continue;const m=Math.max(1,h.frecuencia||1);v+=h.cuantia*($-1)/m}v>.01&&n.push({fecha:A,concepto:"Incremento coste de vida",cuantia:v,tipo:"gasto",tags:["inflacion"],cuenta:s,sourceId:"inflacion_vida_"+y,sourceType:"inflacion"}),b=new Date(d,p+1,1)}return n}function qa(t,e,a,o="default"){const s=[];if(!e||e.length===0||t<=0)return s;const n=G(a.start),i=G(a.end),r=[...e].sort((u,b)=>u.year-b.year);let l=new Date(n.getFullYear(),n.getMonth(),1);for(;l<=i;){const u=l.getFullYear(),b=l.getMonth(),d=u+"-"+String(b+1).padStart(2,"0"),p=V(new Date(u,b,15)),y=r.filter(h=>h.year<=u),g=y.length>0?y[y.length-1]:r[0],I=g?g.tasa/100:0,A=Math.pow(1+I,1/12)-1,v=t*A;v>.01&&s.push({fecha:p,concepto:"Pérdida ahorro por inflación",cuantia:v,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),l=new Date(u,b+1,1)}return s}function La(t,e,a){const o=a.fechaReferencia||a.dashboardStart,s=o<a.dashboardStart?a.dashboardStart:o>a.dashboardEnd?a.dashboardEnd:o,n=e.reduce((d,p)=>d+Wt(p,s),0),i=t.filter(d=>d.fecha<s),r=t.filter(d=>d.fecha>=s),l=[];let u=n;for(const d of[...i].reverse()){const p=d.tipo==="ingreso"?Math.abs(d.cuantia):-Math.abs(d.cuantia);l.unshift({...d,delta:p,saldoAcum:u}),u-=p}const b=[];u=n;for(const d of r){const p=d.tipo==="ingreso"?Math.abs(d.cuantia):-Math.abs(d.cuantia);u+=p,b.push({...d,delta:p,saldoAcum:u})}return[...l,...b]}function Es(t,e,a,o=null){const s=e.filter(n=>n.activo&&(!o||o.length===0||o.includes(n._id)));return La([...t].sort((n,i)=>n.fecha.localeCompare(i.fecha)),s,a)}function Xt(t){const{loans:e,expenses:a,accounts:o,config:s}=t,n=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],l={start:s.dashboardStart,end:s.dashboardEnd},u=a.filter(I=>I.tipo!=="transferencia"),b=a.filter(I=>I.tipo==="transferencia"),d={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let p=[];p=p.concat(Qt(u,l,n)),p=p.concat(Fa(e,l,n)),p=p.concat(Pa(b,l,n,d)),p=p.concat(Da(o,l,n));const y=Ta(o,l,n,p);if(p=p.concat(y),p=p.concat(Na(a,s.tramos_irpf,l,n)),p=p.concat(Ra(i,l,n,r,t.resolverTramosIRPF)),s.usarInflacion&&r.length>0){const I=(o.find(h=>h.activo&&h.esCuentaPrincipal)||o.find(h=>h.activo)||{_id:"default"})._id;p=p.concat(Oa(u,r,l,n,I));const v=o.filter(h=>h.activo&&(!n||n.length===0||n.includes(h._id))).reduce((h,f)=>h+Wt(f,s.dashboardStart),0);p=p.concat(qa(v,r,l,I))}p.sort((I,A)=>I.fecha.localeCompare(A.fecha));const g=o.filter(I=>I.activo&&(!n||n.length===0||n.includes(I._id)));return La(p,g,s)}function zs(t,e,a=null){const o=Y(),n=e.filter(r=>r.activo&&(!a||a.length===0||a.includes(r._id))).reduce((r,l)=>r+rt(l),0),i=t.filter(r=>r.fecha<=o);return i.length===0?n:i[i.length-1].saldoAcum}function Ba(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const s of o.tags||["sin_tag"])a.set(s,(a.get(s)||0)+Math.abs(o.cuantia));return a}function _s(t,e){const a=[];let o=!1;for(let s=0;s<t.length;s++){const n=t[s],i=n.saldoAcum;i<0&&(s===0||t[s-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:n.fecha,saldo:i,mensaje:`Saldo negativo (${j(i)}) a partir del ${n.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:n.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${j(i)} < ${j(e)}) desde ${n.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:n.fecha,saldo:i,mensaje:`Recuperación del colchón el ${n.fecha} (${j(i)})`})))}return a}function Fs(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=G(e.dashboardStart),s=G(e.dashboardEnd),n=Math.max(1,(s.getTime()-o.getTime())/(30.44*864e5));return a/n}function Ps(t,e,a=Y()){const o=new Set,s=e.map(r=>{const l=r.fechaInicialSaldo||"",u={};l&&l<=a&&(u[l]=r.saldoInicial||0);for(const b of r.historicoSaldos||[])b.fecha<=a&&(!l||b.fecha>=l)&&(u[b.fecha]=b.saldo);return Object.keys(u).forEach(b=>o.add(b)),u}),n={};for(const r of[...o].sort()){let l=0;for(let u=0;u<e.length;u++){const b=Object.entries(s[u]).filter(([d])=>d<=r);b.length>0?(b.sort(([d],[p])=>p.localeCompare(d)),l+=b[0][1]):l+=e[u].saldoInicial||0}n[r]=l}const i=[];for(const[r,l]of Object.entries(n).sort(([u],[b])=>u.localeCompare(b))){const u=t.filter(y=>y.fecha<=r),b=u.length>0?u[u.length-1].saldoAcum:null;if(b===null)continue;const d=l-b,p=b!==0?d/Math.abs(b)*100:0;i.push({cuenta:"Total",fecha:r,estimado:b,real:l,desv:d,pct:p})}return i}const Ds=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:Ps,detectarPuntosCriticos:_s,mediaMensualGastos:Fs},Symbol.toStringTag,{value:"Module"}));function Zt(t,e=new Date){const a=V(e),o=new Date(e);o.setMonth(o.getMonth()+1);const s=V(o),n=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Qt(n,{start:a,end:s}).reduce((r,l)=>r+Math.abs(l.cuantia),0)}function qe(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+Rt(a.capital,a.tin,a.meses),0)}function ka(t,e,a,o){return e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0?e.colchonFijo:(Zt(t,o)+qe(a))*(e.colchonMeses||6)}function Ha(t,e,a,o,s){const i=[...e.colchonPuntos||[]].sort((l,u)=>l.fecha.localeCompare(u.fecha)).filter(l=>l.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(Zt(t,s)+qe(a))*(i.meses||6):ka(t,e,a,s)}function ve(t,e,a,o,s,n=!1,i){const r=[...t.puntos||[]].sort((b,d)=>b.fecha.localeCompare(d.fecha)),l=r.filter(b=>b.fecha<=s).pop()||(n?r[0]:null);return l?l.tipo==="fijo"?l.importe||0:(Zt(e,i)+qe(o))*(l.meses||1):0}function Ts(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function Ns(t,e){const a={};for(const o of e)a[o._id]=rt(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=Ts(o)),{fecha:o.fecha,saldos:{...a}}))}function Rs(t,e,a,o,s,n,i){const r=[];for(const l of(t||[]).filter(u=>u.activo!==!1)){let u=!1;for(let b=0;b<e.length;b++){const d=e[b],p=ve(l,o,s,n,d.fecha,!1,i);if(p<=0){u=!1;continue}const y=!l.cuentas||l.cuentas.length===0?d.saldoAcum:l.cuentas.reduce((g,I)=>{var A,v;return g+(((v=(A=a[b])==null?void 0:A.saldos)==null?void 0:v[I])||0)},0);y<p&&!u?(u=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:y,target:p,nombre:l.nombre,mensaje:`⚠ ${l.nombre}: ${j(y)} < ${j(p)} desde ${d.fecha}`})):y>=p&&u&&(u=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:y,target:p,nombre:l.nombre,mensaje:`✓ ${l.nombre}: recuperado el ${d.fecha}`}))}}return r}const Os=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:ka,calcColchonEnFecha:Ha,calcGastoBasicoMensual:Zt,calcMargenEnFecha:ve,detectarCrucesMargenes:Rs,saldosPorCuentaEnExtracto:Ns},Symbol.toStringTag,{value:"Module"}));function qs(t){if(!t||t.showColchon===!1)return null;const e=t.colchonPuntos??[];return e.length>0?{nombre:"Colchón",puntos:[...e]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function Ga(t,e){return Jt(G(t),G(e))}const Ls=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Va(t,e){const[a,o,s]=t.split("-").map(Number),n=t.slice(0,4)===e.slice(0,4);return`${s} de ${Ls[o-1]}${n?"":` de ${a}`}`}function Ua(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Bs(t,e={}){const{hoy:a=Y(),horizonteCritico:o=365,horizonteAviso:s=120,maximo:n=4,incertidumbre:i}=e,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:p=>p?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:p=>`El ${p} el saldo proyectado baja a ${j(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:p=>p?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:p=>`El ${p} el saldo queda en ${j(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:p=>p?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:p=>`El ${p} tendrías ${j(d.saldo)}, y el margen pide ${j(d.target)}.`});const l=new Map;for(const d of r){const p=l.get(d.id);(!p||d.fecha<p.fecha)&&l.set(d.id,d)}const u=[];for(const d of l.values()){const p=Ga(a,d.fecha);if(p<0||p>(d.gravedad==="critico"?o:s))continue;const y=i?i(p):0,g=y>0&&d.distancia<y;u.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:p,plazo:Ua(p),titulo:d.titulo(g),detalle:d.detalle(Va(d.fecha,a)),incierto:g})}const b={critico:0,aviso:1};return u.sort((d,p)=>d.fecha.localeCompare(p.fecha)||b[d.gravedad]-b[p.gravedad]),u.slice(0,n)}const ks=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:qs,construirAvisos:Bs,describirPlazo:Ua,diasEntreISO:Ga,fechaEnPalabras:Va},Symbol.toStringTag,{value:"Module"}));class Hs extends Error{constructor(a,o){super(`La funcionalidad "${a}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);us(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=a}}let te=null;function Gs(t){const e=te;return te=t,()=>{te=e}}function Ya(t){return te?te(t):!0}function Ja(t,e){if(!Ya(t))throw new Hs(t,e)}const Wa=[];function Le(){const t=new Map,e=new WeakMap;let a=1,o=0,s=0;const n=l=>{if(!l||typeof l!="object")return 0;const u=e.get(l);if(u)return u;const b=a++;return e.set(l,b),b},i=l=>l.map(u=>[u._id,u.capital,u.tin,u.meses,u.fechaInicio,u.comisionAmort||0,u.comisionApertura||0,u.diaPago||"",u.activo?1:0,u.cuenta||"",(u.amortizaciones||[]).map(b=>`${b.fecha}:${b.cantidad}:${b.tipo||""}`).sort().join(",")].join("|")).join(";");function r(l){const u=[i(l.loans),n(l.expenses),n(l.accounts),n(l.nominas),n(l.inflacionPeriodos),l.config.dashboardStart,l.config.dashboardEnd,l.config.fechaReferencia||"",l.config.usarInflacion?1:0,(l.filtroAccounts||[]).join(",")].join("#"),b=t.get(u);if(b)return s++,b;o++;const d=Xt(l);return t.set(u,d),d}return{statement:r,stats:()=>({hits:s,misses:o}),clear:()=>t.clear()}}function Be(t,e,a,o,s={},n=Le()){Ja("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:r=36,minAmortizable:l=500,tipoAmort:u="plazo",fechaPrimeraAmort:b=null,loanIds:d=null,nominas:p=Wa,sourceAccountId:y=null,selectedMarginIds:g=null,hoy:I=new Date}=s,A=V(I),v=Math.min(120,Math.max(1,r)),h=a.filter(O=>O.activo),f=h.map(O=>O._id),$=h.find(O=>O.esCuentaPrincipal)||h[0],m=y&&f.includes(y)?h.find(O=>O._id===y):$,x=m==null?void 0:m._id,S=t.filter(O=>O.activo&&!O.simulacion&&(!d||d.includes(O._id))).sort((O,H)=>H.tin-O.tin),w=!!g&&g.length>0,E=(o.margenesSeguridad||[]).filter(O=>O.activo!==!1).filter(O=>!O.cuentas||O.cuentas.length===0||O.cuentas.includes(x)).filter(O=>!w||g.includes(O._id));if(S.length===0)return{plan:[],margenesAplicados:E.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const _={};for(const O of S)_[O._id]=[];const D=[];function C(O){const H=new Date(I.getFullYear(),I.getMonth()+O,1),U=H.getFullYear(),K=H.getMonth(),Q=`${U}-${String(K+1).padStart(2,"0")}`,st=V(new Date(U,K,Math.min(15,new Date(U,K+1,0).getDate())));return{label:Q,dia15:st}}function M(O,H){const U=[...O.amortizaciones||[],..._[O._id]],{tabla:K}=at({...O,amortizaciones:U}),Q=K.filter(nt=>nt.fecha<=H);if(Q.length>0)return Q[Q.length-1].capitalPendiente;const st=U.filter(nt=>nt.fecha<=H).reduce((nt,vt)=>nt+vt.cantidad,0);return Math.max(0,O.capital-st)}function z(O){const H=t.map(it=>({...it,amortizaciones:[...it.amortizaciones||[],..._[it._id]||[]]})),U={...o,dashboardStart:A,dashboardEnd:O},K=n.statement({loans:H,expenses:e,accounts:a,config:U,filtroAccounts:null,nominas:p}),Q=h.reduce((it,Yt)=>it+rt(Yt),0),st=m?rt(m):0,nt=Q>0?st/Q:1;let vt=st,ue=Q;for(const it of K){const Yt=it.delta??(it.tipo==="ingreso"?Math.abs(it.cuantia):-Math.abs(it.cuantia));it.cuenta===x?vt+=Yt:f.includes(it.cuenta)||(vt+=Yt*nt),ue=it.saldoAcum}return{source:vt,total:ue}}function F(O){const{source:H}=z(O);if(H<=0)return H;let U=0;for(const K of E){const Q=ve(K,e,o,t,O,!0,I);Q>U&&(U=Q)}return H-U}const T=2;let R=0;if(b){for(let O=0;O<v;O++)if(C(O).dia15>=b){R=O;break}}for(let O=0;O<v;O++){if((O-R)%i!==0||O<R)continue;const{label:H,dia15:U}=C(O);if(U<A)continue;const K=F(U)-T;if(K<l)continue;let Q=K,st=0;for(const nt of S){if(Q<l)break;const vt=M(nt,U);if(vt<1)continue;const ue=nt.comisionAmort||0,it=1+ue/100,Yt=Math.floor(Q/it),cs=Math.min(Yt,vt);if(cs<l)continue;const pe=Math.min(Math.floor(cs),Math.floor(vt)),ds=+(pe*ue/100).toFixed(2),pa=pe+ds;pa>Q||(_[nt._id].push({_id:`opt_${H}_${nt._id}`,fecha:U,cantidad:pe,tipo:u,simulacion:!0}),st+=pa,D.push({mes:H,fechaAmort:U,loanId:nt._id,loanNombre:nt.nombre,tin:nt.tin,capitalAntes:vt,cantidadAmort:pe,comision:ds,capitalDespues:Math.max(0,vt-pe),saldoDisponible:K+T,excedente:K,saldoDespues:K+T-st,tipoAmort:u}),Q-=pa)}}const P=D.reduce((O,H)=>O+H.cantidadAmort,0),B=D.reduce((O,H)=>O+H.comision,0),L=S.map(O=>{const H=_[O._id];if(!H.length)return null;const U=at(O),K=at({...O,amortizaciones:[...O.amortizaciones||[],...H]});return{loanId:O._id,nombre:O.nombre,tin:O.tin,fechaFinSin:U.fechaFin,fechaFinCon:K.fechaFin,mesesAhorrados:U.mesesReales-K.mesesReales,interesesSin:U.totalIntereses,interesesCon:K.totalIntereses,ahorroIntereses:U.totalIntereses-K.totalIntereses,numAmortizaciones:H.length,totalAmortizado:H.reduce((Q,st)=>Q+st.cantidad,0)}}).filter(O=>O!==null),k=L.reduce((O,H)=>O+H.ahorroIntereses,0);return{plan:D,margenesAplicados:E.length,totalAmortizado:P,totalComisiones:B,totalAhorroIntereses:k,resumenPorLoan:L}}function Ka(t,e,a,o,s={},n){Ja("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:r=500,tipoAmort:l="plazo",fechaObjetivo:u=null,frecuencias:b=[1,2,3,6,12],fechaPrimeraAmort:d=null,loanIds:p=null,nominas:y=Wa,sourceAccountId:g=null,selectedMarginIds:I=null,hoy:A=new Date}=s,v=n??Le(),h=V(A),f=u||V(new Date(A.getFullYear(),A.getMonth()+i,1));function $(S){const w=t.map(C=>({...C,amortizaciones:[...C.amortizaciones||[],...S[C._id]||[]]})),E={...o,dashboardStart:h,dashboardEnd:f},_=v.statement({loans:w,expenses:e,accounts:a,config:E,filtroAccounts:null,nominas:y});if(_.length===0)return a.filter(C=>C.activo).reduce((C,M)=>C+rt(M),0);const D=_.filter(C=>C.fecha<=f);return D.length>0?D[D.length-1].saldoAcum:_[0].saldoAcum}const m=$({}),x=b.map(S=>{const w=Be(t,e,a,o,{frecuencia:S,mesesHorizonte:i,minAmortizable:r,tipoAmort:l,fechaPrimeraAmort:d,loanIds:p,nominas:y,sourceAccountId:g,selectedMarginIds:I,hoy:A},v),E={};for(const D of t)E[D._id]=[];for(const D of w.plan)E[D.loanId].push({_id:D.mes+"_"+D.loanId,fecha:D.fechaAmort,cantidad:D.cantidadAmort,tipo:l,simulacion:!0});const _=$(E);return{frecuencia:S,label:S===1?"Mensual":`Cada ${S} meses`,numAmortizaciones:w.plan.length,totalAmortizado:w.totalAmortizado,totalComisiones:w.totalComisiones,ahorroIntereses:w.totalAhorroIntereses,saldoObjetivo:_,gananciaSaldo:_-m,valorTotal:w.totalAhorroIntereses+(_-m),plan:w.plan,resumenPorLoan:w.resumenPorLoan}}).filter(S=>S.numAmortizaciones>0);if(x.length>0){const S=Math.max(...x.map(_=>_.ahorroIntereses)),w=Math.max(...x.map(_=>_.saldoObjetivo)),E=Math.max(...x.map(_=>_.valorTotal));x.forEach(_=>{_.esMejorIntereses=_.ahorroIntereses===S,_.esMejorSaldo=_.saldoObjetivo===w,_.esMejorValor=_.valorTotal===E})}return{resultados:x,saldoBase:m,fechaObjetivo:f}}const Vs=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:Ka,createStatementMemo:Le,defaultHoyISO:Y,optimizarAmortizaciones:Be},Symbol.toStringTag,{value:"Module"})),Us=30.44*864e5;function Qa(t){const e=t.getFullYear(),a=t.getMonth();return{desde:V(new Date(e,a,1)),hasta:V(new Date(e,a,Ce(e,a)))}}function Xa(t){const[e,a]=t.split("-").map(Number);return Qa(new Date(e,a-1,1))}function Ys(t,e){return Math.max(1,(G(e).getTime()-G(t).getTime())/Us)}const Js=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),Mt=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function Ws(t,e){const a=new Map(e.map(n=>[n._id,n.clasificacion]));let o=0,s=0;for(const n of t){if(n.tipo!=="gasto"||n.sourceType!=="expense")continue;const i=a.get(n.sourceId??"");i!==null&&(i==="deseo"?s+=Math.abs(n.cuantia):o+=Math.abs(n.cuantia))}return{basicos:o,deseo:s}}function Ks(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=p=>p.sourceType==="loan"&&p.tipo==="gasto",s=e.loanIdsIniciados,n=Mt(t.filter(p=>p.tipo==="ingreso")),i=Mt(t.filter(p=>o(p)&&(!s||s.has(p.sourceId??"")))),r=Mt(t.filter(p=>o(p)&&e.hipotecaIds.has(p.sourceId??""))),l=Mt(t.filter(p=>p.sourceType==="loan-amort")),u=Mt(t.filter(p=>p.sourceType==="account-interest")),{basicos:b,deseo:d}=Ws(t,e.expenses);return{ingresos:n/a,cuotas:i/a,cuotasHipoteca:r/a,amortizaciones:l/a,gastosBasicos:b/a,gastosDeseo:d/a,gastosTotales:(i+b+d)/a,intereses:u/a}}function Za(t,e){return t.reduce((a,o)=>{const s=at(o).tabla.filter(n=>!n.esAmortizacion&&n.fecha<=e);return a+(s.length>0?s[s.length-1].capitalPendiente:o.capital||0)},0)}function Qs(t,e,a,o){const s=t.filter(u=>u.activo&&!u.simulacion&&(u.fechaInicio||"")<=a),n=s.reduce((u,b)=>{if((b.amortizaciones||[]).filter(g=>g.fecha>=e&&g.fecha<=a).length===0)return u;const p=at(b).totalIntereses,y=at({...b,amortizaciones:(b.amortizaciones||[]).filter(g=>g.fecha<e||g.fecha>a)}).totalIntereses;return u+Math.max(0,y-p)},0),i=s.filter(u=>u.mostrarFechaFinEnDashboard!==!1).map(u=>({loan:u,fechaFin:at(u).fechaFin})).filter(u=>!!u.fechaFin&&u.fechaFin>=e&&u.fechaFin<=a),r=s.map(u=>at(u).tabla),l=u=>{const{desde:b,hasta:d}=Xa(u);return r.reduce((p,y)=>{const g=y.find(I=>!I.esAmortizacion&&I.fecha>=b&&I.fecha<=d);return p+(g?g.cuota:0)},0)};return{deudaInicio:Za(s,e),deudaFin:Za(s,a),ahorroIntereses:n,ahorroInteresesMes:o>0?n/o:0,cuotasInicio:l(e.slice(0,7)),cuotasFin:l(a.slice(0,7)),finEnPeriodo:i}}function Xs(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:Mt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function to(t,e=new Set,a="desglosado"){if(e.size===0)return Ba(t,"gasto");const o=new Map;for(const s of t){if(s.tipo!=="gasto")continue;const n=s.tags||[],i=n.filter(u=>e.has(u)),r=n.filter(u=>!e.has(u)),l=a==="porgrupos"&&i.length>0?i:r;for(const u of l)o.set(u,(o.get(u)||0)+Math.abs(s.cuantia))}return o}function Zs(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...to(t,e.grupoTags,e.modo).entries()].filter(([s])=>!a||a.size===0||a.has(s)).map(([s,n])=>({tag:s,total:n/o})).sort((s,n)=>n.total-s.total)}function tn(t,e){const a=e.reduce((o,s)=>o+rt(s),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:Mt(t.filter(o=>o.tipo==="gasto")),totalIngresos:Mt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function en(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function an(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function on(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}function sn(t,e){if(t.length===0)return[];const a=u=>e==="mes"?u.slice(0,7):u.slice(0,4),o=u=>e==="mes"?`${u}-01`:`${u}-01-01`,s=t[0],n=s.delta??(s.tipo==="ingreso"?Math.abs(s.cuantia):-Math.abs(s.cuantia));let i=(s.saldoAcum??0)-n;const r=[];let l=null;for(const u of t){const b=a(u.fecha),d=u.saldoAcum??i;(!l||l.periodo!==b)&&(l&&(i=l.cierre),l={periodo:b,inicio:o(b),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(l)),l.cierre=d,d>l.maximo&&(l.maximo=d),d<l.minimo&&(l.minimo=d),l.eventos+=1}return r}const nn=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:sn,cuentasVisibles:en,gastoPorTagOrdenado:Zs,idsHipoteca:an,idsPrestamosIniciados:on,interesesPorCuenta:Xs,mesesDelPeriodo:Ys,metricasFlujo:Ks,rangoMes:Xa,rangoMesDe:Qa,resumenPrestamosPeriodo:Qs,sinTransferencias:Js,sumarGastosPorTag:to,totalesPeriodo:tn},Symbol.toStringTag,{value:"Module"}));function rn(t,e,a){const o=t||[];if(!o.length)return e;const s=o.find(i=>i.año===a);if(s)return s.tramos;const n=o.filter(i=>i.año<a).sort((i,r)=>r.año-i.año);return n.length?n[0].tramos:e}function bt(t,e){return a=>rn(t,e,a)}const ee=8,eo=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],ao=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function ke(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}function oo(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:eo,tramosGananciasCapital:ao,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function so(t,e){return{loans:[],expenses:[],accounts:[ke(t)],nominas:[],goals:[],planes:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],config:oo(t,e)}}const ht=t=>Array.isArray(t)?t:[],ln=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function ae(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function no(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function He(t){const{varianza:e,inflacion:a,...o}=t;return o}function cn(t,e){const{hoyISO:a,finISO:o}=e,s={...t},n=ln(t.config),r={...oo(a,o)};for(const[b,d]of Object.entries(n))d!=null&&(r[b]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=eo),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=ao),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),s.config=r;let l=ht(t.accounts).map(b=>{const d={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...b};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),ae(d)});l.length===0&&(l=[ke(a)]);const u=l.filter(b=>b.esCuentaPrincipal);if(u.length===0){const b=l.find(d=>d._id==="default")||l[0];l=l.map(d=>({...d,esCuentaPrincipal:d._id===b._id}))}else if(u.length>1){let b=!1;l=l.map(d=>d.esCuentaPrincipal?b?{...d,esCuentaPrincipal:!1}:(b=!0,d):d)}return s.accounts=l,s.expenses=ht(t.expenses).map(b=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...b};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=no(d.diaPago),He(ae(d))}),s.loans=ht(t.loans).map(b=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...b};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=no(d.diaPago),d.amortizaciones=ht(d.amortizaciones).map(p=>ae(p)),He(ae(d))}),s.nominas=ht(t.nominas).map(b=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...b};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),He(ae(d))}),s.goals=ht(t.goals).map((b,d)=>{const p=Array.isArray(b.cuentaIds)?b.cuentaIds:b.cuentaId?[b.cuentaId]:[],{cuentaId:y,...g}=b;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...g,cuentaIds:p}}),s.inflacion=ht(t.inflacion),s.tramosIRPFHistorico=ht(t.tramosIRPFHistorico),s.tramosGananciasCapitalHistorico=ht(t.tramosGananciasCapitalHistorico),s.escenarios=ht(t.escenarios).map(({inversiones:b,...d})=>d),s}const qt=t=>Array.isArray(t)?t:[];let Ge=0;function dn(t){return Ge+=1,`${t}_${Ge.toString(36)}`}const un=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),pn=t=>typeof t=="number"&&Number.isFinite(t);function mn(t,e){const a={...t};Ge=0;const o=qt(t.transacciones),s=qt(t.puntosControl),n=[...s],i=new Set(s.map(u=>`${u.cuentaId}|${u.fecha}`)),r=(u,b,d,p)=>{if(!un(b)||!pn(d))return;const y=`${u}|${b}`;i.has(y)||(i.add(y),n.push({_id:dn("pc"),fecha:b,cuentaId:u,saldoCts:It(d),...typeof p=="string"&&p?{nota:p}:{}}))};for(const u of qt(t.accounts)){const b=typeof u._id=="string"?u._id:null;if(b)for(const d of qt(u.historicoSaldos))r(b,d.fecha,d.saldo,d.nota)}const l=qt(t.history);if(l.length>0){const u=qt(t.accounts),b=u.find(p=>p.esCuentaPrincipal)||u.find(p=>p.activo)||u[0],d=typeof(b==null?void 0:b._id)=="string"?b._id:"default";for(const p of l){const y=typeof p.cuenta=="string"?p.cuenta:typeof p.cuentaId=="string"?p.cuentaId:d;r(y,p.fecha,p.saldo,p.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=n.sort((u,b)=>String(u.fecha).localeCompare(String(b.fecha))),a}const Ve=t=>Array.isArray(t)?t:[],fn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),vn=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Ue=0;function gn(){return Ue+=1,`tx_hp_${Ue.toString(36)}`}function bn(t,e){const a={...t};Ue=0;const o=[...Ve(t.transacciones)],s=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),n=Ve(t.expenses).map(i=>{const r=Ve(i.historialPrecios),l=typeof i._id=="string"?i._id:null,u=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",b=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(g=>typeof g=="string"):[];if(l)for(const g of r){if(!g||!fn(g.fecha)||!vn(g.cuantia))continue;const I=b==="ingreso"?It(g.cuantia):-It(g.cuantia),A=`${l}|${g.fecha}|${I}`;s.has(A)||(s.add(A),o.push({_id:gn(),fecha:g.fecha,cuentaId:u,importeCts:I,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:l,tipo:b,origen:"importado",nota:typeof g.nota=="string"&&g.nota?g.nota:"Importado del historial de precios"}))}const{historialPrecios:p,...y}=i;return y});return a.expenses=n,a.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),a}const io=t=>Array.isArray(t)?t:[],wt=(t,e="")=>typeof t=="string"&&t.trim()?t:e,Lt=(t,e=0)=>typeof t=="number"&&Number.isFinite(t)?t:e,hn=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function yn(t,e){var b;const a={...t};if(Array.isArray(a.planes))return a;const o=io(a.goals),s=io(a.accounts),n=s.map(d=>{const p=Lt(d.bloqueoMeses,0);return{_id:`veh_${wt(d._id,"x")}`,nombre:wt(d.nombre,"Cuenta"),rentabilidadRealAnual:Lt(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":p>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Lt(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?It(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:wt(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Lt(d.interes,0)>0}}),i=new Map(s.map((d,p)=>[wt(d._id,""),n[p]._id])),r=((b=n[0])==null?void 0:b._id)??"",l=o.map((d,p)=>{const y=Array.isArray(d.cuentaIds)?d.cuentaIds.map(I=>wt(I,"")):[],g=hn(d.targetDate);return{_id:wt(d._id,`obj_mig_${p}`),nombre:wt(d.nombre,`Objetivo ${p+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:It(Lt(d.targetAmount,0)),fechaLimite:g,prioridad:Lt(d.prioridad,p+1),modoAsignacion:g?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(y[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:wt(d.notas,"")}}),u={_id:"plan_base",nombre:"Plan base",fechaInicio:e.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:n,objetivos:l,eventos:[],creadoEn:e.hoyISO};return a.planes=[u],a}const xn=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:cn},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:mn},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:bn},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:yn}],$n=["history"];function ro(t,e,a){let o=t;const s=[];for(const n of[...xn].sort((i,r)=>i.version-r.version))(e??0)>=n.version||(o=n.migrate(o,a),s.push(n.version));return{state:o,applied:s}}const Bt="state_",Ye="state__schemaVersion",lo="financeapp_",co="state__modificadoEn";function In(t=localStorage,e=lo){const a=o=>`${e}${o}`;return{get(o){try{const s=t.getItem(a(o));return s===null?null:JSON.parse(s)}catch{return null}},set(o,s){try{t.setItem(a(o),JSON.stringify(s)),o!==co&&t.setItem(a(co),JSON.stringify(Date.now()))}catch(n){console.error("No se pudo guardar en localStorage:",o,n)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(e)&&o.push(n.slice(e.length))}return o}}}function An(t=localStorage,e=lo){const a=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(Bt)&&!n.startsWith(e)&&a.push(n)}const o=[];for(const s of a)try{const n=t.getItem(s);n!==null&&t.getItem(`${e}${s}`)===null&&(t.setItem(`${e}${s}`,n),o.push(s)),t.removeItem(s)}catch{}return o}function Sn({ventanaMs:t=15e3,ahora:e=()=>Date.now()}={}){let a=null;function o(){return a?e()-a.cuando>t?(a=null,null):a:null}return{registrar(s){a={...s,cuando:e()}},pendiente:o,tomar(){const s=o();return a=null,s},limpiar(){a=null}}}const Mn={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},escenarios:{articulo:"El",que:"supuesto"},planes:{articulo:"El",que:"plan"},goals:{articulo:"El",que:"objetivo"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function wn(t,e){const a=Mn[t]??{articulo:"El",que:"elemento"},o=e.concepto??e.nombre??e.titulo??(e.year!==void 0?String(e.year):null);return o?`${a.articulo} ${a.que} «${String(o)}»`:`${a.articulo} ${a.que}`}function Cn(t){return V(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function jn({adapter:t,hoy:e=new Date}){const a=V(e),o=Cn(e);let s=so(a,o);const n=new Set;let i=[];const r=Sn();function l(C){for(const M of n)M(C)}function u(C){t.set(`${Bt}${C}`,s[C])}function b(){const C={};for(const T of Object.keys(s)){const R=t.get(`${Bt}${T}`);R!==null&&(C[T]=R)}for(const T of $n){const R=t.get(`${Bt}${T}`);R!==null&&(C[T]=R)}const M=t.get(Ye),{state:z,applied:F}=ro(C,M,{hoyISO:a,finISO:o});if(s=z,d(),F.length>0){for(const T of Object.keys(s))u(T);t.set(Ye,ee)}return i=F,{applied:F}}function d(){if(!Array.isArray(s.accounts)||s.accounts.length===0){s.accounts=[ke(a)],u("accounts");return}const C=s.accounts.filter(M=>M.esCuentaPrincipal);if(C.length===0)s.accounts=s.accounts.map((M,z)=>z===0?{...M,esCuentaPrincipal:!0}:M),u("accounts");else if(C.length>1){let M=!1;s.accounts=s.accounts.map(z=>z.esCuentaPrincipal?M?{...z,esCuentaPrincipal:!1}:(M=!0,z):z),u("accounts")}}function p(C){return s[C]}function y(C,M){s[C]=M,u(C),l(C)}function g(C){y("config",{...s.config,...C})}function I(C){return n.add(C),()=>n.delete(C)}function A(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function v(C,M){const z=[...s[C]],F={...M,_id:A()};return z.push(F),y(C,z),F}function h(C,M,z){const F=s[C].map(T=>T._id===M?{...T,...z}:T);y(C,F)}function f(C,M){const z=s[C],F=z.findIndex(T=>T._id===M);F<0||(r.registrar({col:C,item:z[F],indice:F}),y(C,z.filter((T,R)=>R!==F)))}function $(){const C=r.tomar();if(!C)return null;const M=[...s[C.col]];return M.splice(Math.min(C.indice,M.length),0,C.item),y(C.col,M),C}function m(){return r.pendiente()}function x(){const C=s.accounts||[],M=C.find(z=>z.esCuentaPrincipal&&z.activo)||C.find(z=>z.activo);return M?M._id:"default"}function S(C){var M;return((M=s.accounts.find(z=>z._id===C))==null?void 0:M.nombre)??C}function w(){return bt(s.tramosIRPFHistorico,s.config.tramos_irpf)}function E(){return bt(s.tramosGananciasCapitalHistorico,s.config.tramosGananciasCapital)}function _(){return structuredClone(s)}function D(C,M=null){const{state:z,applied:F}=ro(C,M,{hoyISO:a,finISO:o});s=z,d();for(const T of Object.keys(s))u(T);t.set(Ye,ee);for(const T of Object.keys(s))l(T);return{applied:F}}return{load:b,get:p,set:y,patchConfig:g,subscribe:I,addItem:v,updateItem:h,removeItem:f,deshacerBorrado:$,borradoPendiente:m,getPrincipalAccountId:x,accountName:S,resolverTramosIRPF:w,resolverTramosGanancias:E,snapshot:_,replaceAll:D,get schemaVersion(){return ee},get migrationsApplied(){return[...i]},get today(){return a||Y()}}}function En(){let t=0,e=null;const a=new Set;function o(s){t+=1,e=s;for(const n of a)try{n(t,s)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>e,marcar:o,suscribir(s){return a.add(s),()=>a.delete(s)},crearMarca(s){let n=t;return{nombre:s,pendiente:()=>t>n,alDia:i=>{n=Math.max(n,i??t)},vista:()=>n}}}}const ge=Object.keys(so("1970-01-01","1970-01-01"));function zn(t){const e={};for(const a of ge){const o=t.get(`${Bt}${a}`);o!=null&&(e[a]=o)}return e}function _n(t,e){const a=[];for(const o of ge){const s=e[o];s!=null&&(t(`${Bt}${o}`,s),a.push(o))}return a}function Fn(t){return ge.filter(e=>t[e]===void 0||t[e]===null)}const X={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},Ct=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:X.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:X.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:X.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:X.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:X.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro (antiguos)",descripcion:"Solo lectura: la copia previa al planificador. Los objetivos se gestionan en «Objetivos financieros». Apagada de fábrica; enciéndela si quieres revisar los antiguos antes de descartarlos.",grupo:X.dinero,porDefecto:!1,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:X.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:X.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:X.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:X.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:X.planificacion,porDefecto:!1},{id:"planner",nombre:"Objetivos financieros",descripcion:"Plan a largo plazo: objetivos que compiten por el flujo mensual y se encadenan al completarse.",grupo:X.planificacion,porDefecto:!0},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:X.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:X.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:X.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:X.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:X.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:X.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:X.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:X.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:X.datos,porDefecto:!1,dependencias:["sync-nube"]}],Pn=new Map(Ct.map(t=>[t.id,t]));function oe(t){return Pn.get(t)}function uo(t){return Ct.filter(e=>(e.dependencias||[]).includes(t))}function Je(){const t={};for(const e of Ct)t[e.id]=e.porDefecto;return t}function po(){const t=[],e=new Map;for(const a of Ct)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function Dn(t){function e(){return{...Je(),...t.get("config").features||{}}}function a(d){t.patchConfig({features:d})}function o(d,p=e(),y=new Set){const g=oe(d);if(!g)return!1;if(g.nucleo)return!0;if(p[d]===!1)return!1;if(y.has(d))return!0;y.add(d);for(const I of g.dependencias||[])if(!o(I,p,y))return!1;return!0}function s(d,p=e()){const y=oe(d);return y?(y.dependencias||[]).filter(g=>!o(g,p)):[]}function n(d,p){var f;const y=oe(d);if(!y)return{cambiadas:[]};if(y.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const g=e(),I=new Map(Ct.map($=>[$.id,o($.id,g)])),A={...g,[d]:p};let v;if(p){const $=[...y.dependencias||[]];for(;$.length;){const m=$.pop();A[m]===!1&&(A[m]=!0,v="dependencias-activadas"),$.push(...((f=oe(m))==null?void 0:f.dependencias)||[])}}else{const $=uo(d).map(m=>m.id);for(;$.length;){const m=$.pop();A[m]!==!1&&(A[m]=!1,v="cascada-apagado"),$.push(...uo(m).map(x=>x.id))}}return a(A),{cambiadas:Ct.filter($=>o($.id,A)!==I.get($.id)).map($=>$.id),motivo:v}}function i(){const d=e();return Ct.map(p=>{const y=s(p.id,d);return{...p,activa:o(p.id,d),...y.length>0&&d[p.id]!==!1?{bloqueadaPor:y}:{}}})}function r(){const d=e();return po().map(({grupo:p,features:y})=>({grupo:p,features:y.map(g=>{const I=s(g.id,d);return{...g,activa:o(g.id,d),...I.length>0&&d[g.id]!==!1?{bloqueadaPor:I}:{}}})}))}function l(){a(Je())}function u(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:e()}}function b(d){const p=d,y=p&&typeof p=="object"&&p.features&&typeof p.features=="object"?p.features:null;if(!y)throw new Error('El perfil no tiene una sección "features" válida');const g=Je(),I=[],A=[];for(const[v,h]of Object.entries(y)){if(!oe(v)){A.push(v);continue}if(typeof h!="boolean"){A.push(v);continue}g[v]=h,I.push(v)}return a(g),{aplicadas:I,ignoradas:A}}return{isEnabled:d=>o(d),setEnabled:n,estado:i,estadoPorGrupo:r,reset:l,exportProfile:u,importProfile:b,bloqueadaPor:d=>s(d)}}const se=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function kt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Tn(t){var s,n;const a=(((s=t.bloqueadaPor)==null?void 0:s.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(n=t.bloqueadaPor)==null?void 0:n.map(se).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
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
    </div>`}function Nn(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:s})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${se(o)}</div>
        ${s.map(Tn).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Rn(t){var s;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-feature-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function On(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Nn(a)}`,s(i)}function s(i){var l,u,b;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var g;const p=d.dataset.featureToggle,y=a.setEnabled(p,d.checked);y.motivo==="dependencias-activadas"&&kt(t,"Se han activado también las funcionalidades necesarias"),y.motivo==="cascada-apagado"&&kt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(g=t.onChange)==null||g.call(t,y.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(l=i.querySelector('[data-feature-action="export"]'))==null||l.addEventListener("click",()=>{const d=a.exportProfile(),p=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),y=URL.createObjectURL(p),g=e.createElement("a");g.href=y,g.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,g.click(),URL.revokeObjectURL(y),kt(t,"Perfil de funcionalidades guardado")}),(u=i.querySelector('[data-feature-action="import"]'))==null||u.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var p,y;const d=(p=r.files)==null?void 0:p[0];if(d)try{const{aplicadas:g,ignoradas:I}=a.importProfile(JSON.parse(await d.text()));kt(t,I.length>0?`Perfil cargado (${g.length} aplicadas, ${I.length} ignoradas por ser de otra versión)`:`Perfil cargado (${g.length} funcionalidades)`),(y=t.onChange)==null||y.call(t,g),o(i)}catch(g){kt(t,"No se pudo cargar el perfil: "+g.message,"err")}finally{r.value=""}}),(b=i.querySelector('[data-feature-action="reset"]'))==null||b.addEventListener("click",()=>{var d;a.reset(),kt(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function n(){const i=Rn(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:n,renderInto:o}}const mo={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function fo(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const s=e(o);a.style.display=s?"":"none",s?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function qn({flags:t,document:e=document,router:a,rutasExtra:o}){function s(){const r=e.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function n(){let r=!1;const l=Object.entries((o==null?void 0:o())??{}).map(([u,b])=>[b,u]);for(const[u,b]of[...Object.entries(mo),...l]){const d=t.isEnabled(u),p=e.querySelector(`.nav-btn[data-view="${b}"]`);p&&(p.style.display=d?"":"none"),!d&&s()===b&&(r=!0)}if(e.querySelectorAll(".nav-section").forEach(u=>{const b=[...u.querySelectorAll(".nav-btn[data-view]")];if(b.length===0)return;const d=b.some(p=>p.style.display!=="none");u.style.display=d?"":"none"}),fo(e,u=>t.isEnabled(u)),r){const u=a??globalThis.Router;u==null||u.navigate("dashboard")}}function i(r=e.body){if(typeof MutationObserver>"u")return()=>{};let l=!1;const u=new MutationObserver(()=>{if(!l){l=!0;try{fo(e,b=>t.isEnabled(b))}finally{l=!1}}});return u.observe(r,{childList:!0,subtree:!0}),()=>u.disconnect()}return{apply:n,observar:i,vistaPara:r=>mo[r]}}const Ln="toast toast-deshacer";function Bn(t){const{store:e,rerender:a,duracionMs:o=12e3}=t,s=t.contenedor??(()=>document.getElementById("toast-container"));let n=null,i=null,r=null;function l(){i&&clearTimeout(i),i=null,n==null||n.remove(),n=null}function u(d){const p=s();if(!p)return;l();const y=document.createElement("div");y.className=Ln,y.style.display="flex",y.style.alignItems="center",y.style.gap="12px";const g=document.createElement("span");g.textContent=`${wn(d.col,d.item)} se ha eliminado.`,g.style.flex="1";const I=document.createElement("button");I.type="button",I.className="btn-secondary btn-sm",I.textContent="Deshacer",I.style.flexShrink="0",I.addEventListener("click",()=>{const A=e.deshacerBorrado();if(l(),!A)return;const v=s();if(v){const h=document.createElement("div");h.className="toast toast-ok",h.textContent="Deshecho.",v.appendChild(h),setTimeout(()=>h.remove(),2500)}a==null||a()}),y.appendChild(g),y.appendChild(I),p.appendChild(y),n=y,i=setTimeout(l,o)}const b=e.subscribe(()=>{const d=e.borradoPendiente();if(!d){r=null,l();return}d!==r&&(r=d,u(d))});return()=>{b(),l()}}function be(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function vo(t,e){const a=be(t),o=be(e);if(!o)return-1;const s=a.indexOf(o);return s<0?-1:s===0?0:/[\s\-/_(«"']/.test(a[s-1])?1:2}const Ft=t=>{const e=Number(t);return Number.isFinite(e)?`${e.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function kn(t){const e=[],a=o=>{var s,n;return((n=(s=t.accounts)==null?void 0:s.find(i=>i._id===o))==null?void 0:n.nombre)??""};for(const o of t.expenses??[]){const s=o.tipo==="ingreso";e.push({tipo:s?"ingreso":"gasto",etiqueta:s?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[Ft(o.cuantia),a(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],a(o.cuenta)].join(" ")})}for(const o of t.accounts??[])e.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:Ft(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])e.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:Ft(o.capital),ruta:"loans",extra:[...o.tags??[],a(o.cuenta)].join(" ")});for(const o of t.nominas??[])e.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${Ft(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.escenarios??[])e.push({tipo:"supuesto",etiqueta:"Supuesto",id:o._id,titulo:o.nombre,detalle:o.descripcion??"",ruta:"escenarios"});for(const o of t.planes??[]){e.push({tipo:"plan",etiqueta:"Plan",id:o._id,titulo:o.nombre,detalle:o.notas??"",ruta:"planner"});for(const s of o.objetivos??[])e.push({tipo:"objetivo",etiqueta:"Objetivo",id:s._id,titulo:s.nombre,detalle:[s.importeObjetivo!==null?Ft(s.importeObjetivo/100):"",o.nombre].filter(Boolean).join(" · "),ruta:"planner"})}for(const o of t.goals??[])e.push({tipo:"objetivo",etiqueta:"Objetivo",id:o._id,titulo:o.nombre,detalle:Ft(o.targetAmount),ruta:"accounts"});for(const o of t.transacciones??[])e.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,Ft(o.importeCts/100),a(o.cuentaId)].filter(Boolean).join(" · "),ruta:"contabilidad",extra:(o.tags??[]).join(" ")});return e}function Hn(t,e,a={}){const{maximo:o=12,rutasDisponibles:s=null}=a,n=be(e);if(n.length<2)return[];const i=l=>s===null||s.includes(l),r=[];for(const l of kn(t)){if(!i(l.ruta))continue;const u=vo(l.titulo,n),b=u>=0?-1:Math.min(vo(l.extra??"",n),2);if(u<0&&b<0)continue;const d=u>=0?u:3;r.push({tipo:l.tipo,etiqueta:l.etiqueta,id:l.id,titulo:l.titulo,detalle:l.detalle,ruta:l.ruta,peso:d*1e3+Math.min(999,be(l.titulo).length)})}return r.sort((l,u)=>l.peso-u.peso||l.titulo.localeCompare(u.titulo,"es")),r.slice(0,o)}const Gn="buscador-overlay",go="btn-buscador";function Vn(t){const e=t.doc??document,a=t.rutasDisponibles??(()=>null);let o=null,s=null,n=null,i=[],r=0;function l(){const $=e.createElement("div");$.id=Gn,$.className="modal-overlay",$.style.alignItems="flex-start",$.style.paddingTop="10vh";const m=e.createElement("div");m.className="modal-box",m.style.maxWidth="560px",m.style.padding="14px";const x=e.createElement("input");x.type="search",x.className="form-input",x.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",x.setAttribute("aria-label","Buscar en toda la aplicación"),x.autocomplete="off";const S=e.createElement("div");return S.style.marginTop="10px",S.style.maxHeight="52vh",S.style.overflowY="auto",m.appendChild(x),m.appendChild(S),$.appendChild(m),e.body.appendChild($),$.addEventListener("click",w=>{w.target===$&&I()}),x.addEventListener("input",()=>{r=0,b()}),x.addEventListener("keydown",y),o=$,s=x,n=S,$}function u(){if(n){if(n.textContent="",i.length===0){const $=e.createElement("div");$.style.padding="14px 4px",$.style.fontSize="13px",$.style.color="var(--text3)";const m=(s==null?void 0:s.value.trim())??"";$.textContent=m.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",n.appendChild($);return}i.forEach(($,m)=>{const x=e.createElement("button");x.type="button",x.className="buscador-fila",x.dataset.indice=String(m),m===r&&x.classList.add("activa");const S=e.createElement("div");S.style.minWidth="0";const w=e.createElement("div");w.textContent=$.titulo,w.style.fontSize="13px",w.style.overflow="hidden",w.style.textOverflow="ellipsis",w.style.whiteSpace="nowrap";const E=e.createElement("div");E.textContent=$.detalle,E.style.fontSize="11px",E.style.color="var(--text3)",E.style.overflow="hidden",E.style.textOverflow="ellipsis",E.style.whiteSpace="nowrap",S.appendChild(w),$.detalle&&S.appendChild(E);const _=e.createElement("span");_.className="tag",_.textContent=$.etiqueta,_.style.flexShrink="0",x.appendChild(S),x.appendChild(_),x.addEventListener("click",()=>p(m)),n.appendChild(x)})}}function b(){const $=(s==null?void 0:s.value)??"";i=Hn(t.estado(),$,{rutasDisponibles:a()}),r>=i.length&&(r=Math.max(0,i.length-1)),u()}function d($){var m,x;i.length!==0&&(r=(r+$+i.length)%i.length,u(),(x=(m=n==null?void 0:n.querySelector(".buscador-fila.activa"))==null?void 0:m.scrollIntoView)==null||x.call(m,{block:"nearest"}))}function p($){const m=i[$];m&&(I(),t.navegar(m.ruta))}function y($){$.key==="Escape"?($.preventDefault(),I()):$.key==="ArrowDown"?($.preventDefault(),d(1)):$.key==="ArrowUp"?($.preventDefault(),d(-1)):$.key==="Enter"&&($.preventDefault(),p(r))}function g(){const $=o??l();$.classList.remove("hidden"),$.style.display="",r=0,s&&(s.value="",s.focus()),b()}function I(){o&&(o.style.display="none",i=[])}function A(){return!!o&&o.style.display!=="none"}function v($){($.ctrlKey||$.metaKey)&&($.key==="k"||$.key==="K")&&($.preventDefault(),A()?I():g())}e.addEventListener("keydown",v);let h=null;function f(){const $=e.getElementById("period-bar");if(!$||e.getElementById(go))return;const m=e.createElement("button");m.id=go,m.type="button",m.className="btn-secondary",m.title="Buscar en toda la aplicación (Ctrl+K)",m.setAttribute("aria-label","Buscar"),m.textContent="🔍 Buscar",m.style.marginLeft="auto",m.addEventListener("click",g),$.appendChild(m),h=m}return f(),()=>{e.removeEventListener("keydown",v),h==null||h.remove(),o==null||o.remove(),o=null,s=null,n=null}}const We="aviso-guardado";function Un(t){const e=t.doc??document,a=t.contenedor??(()=>e.getElementById("toast-container")),o=t.msExito??1800,s=t.cambios.crearMarca("guardado");let n="oculto",i=!1,r=null,l=null;function u(){var g;r&&clearTimeout(r),r=null,(g=e.getElementById(We))==null||g.remove()}function b(){if(n==="oculto")return u();const g=a();if(!g)return;let I=e.getElementById(We);I||(I=e.createElement("div"),I.id=We,g.appendChild(I)),I.className=`toast toast-guardado toast-guardado--${n}`,I.style.display="flex",I.style.alignItems="center",I.style.gap="12px",I.textContent="";const A=e.createElement("span");if(A.style.flex="1",I.appendChild(A),n==="pendiente")A.textContent="Tienes cambios sin guardar.",I.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void p())),I.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,n="oculto",b()}));else if(n==="subiendo"){A.textContent="Subiendo…";const v=e.createElement("span");v.className="guardado-giro",v.setAttribute("aria-hidden","true"),I.appendChild(v)}else n==="guardado"?A.textContent="¡Guardado!":n==="error"&&(A.textContent="No se ha podido guardar.",I.appendChild(d("Reintentar","btn-primary btn-sm",()=>void p())))}function d(g,I,A){const v=e.createElement("button");return v.type="button",v.className=I,v.textContent=g,v.style.flexShrink="0",v.addEventListener("click",A),v}async function p(){if(l)return l;r&&clearTimeout(r);const g=t.cambios.revision();return n="subiendo",b(),l=(async()=>{try{await t.guardar(),s.alDia(g),n="guardado",b(),r=setTimeout(()=>{n=s.pendiente()?"pendiente":"oculto",n==="pendiente"&&(i=!1),b()},o)}catch(I){console.error("[guardado] no se ha podido subir la copia:",I),n="error",b()}finally{l=null}})(),l}const y=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,n!=="subiendo"&&(n="pendiente",b()))});return{estado:()=>i&&n==="oculto"?"oculto":n,guardarAhora:p,detener(){y(),u()}}}function Yn({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function s(g){return`view-${g}`}function n(g){const I=t.getElementById(s(g.route));if(I)return I;const A=t.querySelector(".view-container");if(!A)return null;const v=t.createElement("div");return v.id=s(g.route),v.className="view hidden",A.appendChild(v),v}function i(g){if(t.querySelector(`.nav-btn[data-view="${g.route}"]`))return;const I=t.querySelectorAll(".nav-section"),A=I[g.seccion??Math.max(0,I.length-1)];if(!A)return;const v=t.createElement("button");v.className="nav-btn",v.dataset.view=g.route,v.innerHTML=`${g.iconoPath?`<svg viewBox="0 0 24 24"><path d="${g.iconoPath}"/></svg>`:""}<span>${g.nombre}</span>`,A.appendChild(v),v.addEventListener("click",()=>{const h=globalThis.Router;h==null||h.navigate(g.route)})}function r(g){a.set(g.route,g),n(g),i(g)}function l(){return[...a.keys()].filter(g=>{const I=a.get(g);return!e||e(I.flagId??I.id)})}function u(g){return l().includes(g)}function b(g){const I=a.get(g);if(!I||e&&!e(I.flagId??I.id))return!1;const A=n(I);if(!A)return!1;if(o&&o!==g){const v=a.get(o),h=t.getElementById(s(o));v!=null&&v.unmount&&h&&v.unmount(h)}return I.mount(A),o=g,!0}function d(){o&&b(o)}function p(){const g={};for(const[I,A]of a)g[I]=A.flagId??A.id;return g}function y(){for(const g of a.values())n(g),i(g)}return{register:r,routes:l,has:u,mount:b,rerender:d,flagPorRuta:p,attachToShell:y,get activa(){return o}}}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Pt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${c(j(t))}</span>`}function bo(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function ho(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${c(e)}</span>`).join(" ")}const Jn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ke(t){const[e,a]=t.split("-").map(Number);return`${Jn[a-1]} ${e}`}function q(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function Z(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function N(t,e,a){t.addEventListener("click",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(e);s&&t.contains(s)&&a(s,o)})}function J(t,e,a){t.addEventListener("change",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(e);s&&t.contains(s)&&a(s,o)})}function ft(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function yo(t,e){const a=parseFloat(ft(t,e));return Number.isFinite(a)?a:0}function Wn(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Kn(t,e){const{ledger:a}=t,o=(t.hoy??Y)(),s=t.accounts().filter(h=>h.activo),{desde:n,hasta:i}=Wn(e.mes),r={cuentaId:e.cuentaId||void 0,desde:n,hasta:i,texto:e.filtroTexto||void 0},l=a.transacciones(r),u=t.estimaciones().filter(h=>h.tipo!=="transferencia"),b=l.filter(h=>h.importeCts<0).reduce((h,f)=>h+f.importeCts,0),d=l.filter(h=>h.importeCts>0).reduce((h,f)=>h+f.importeCts,0),p=e.cuentaId?a.saldoCuenta(e.cuentaId,i):a.saldoTotal(i),y=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),g=s.map(h=>`<option value="${c(h._id)}"${h._id===e.cuentaId?" selected":""}>${c(h.nombre)}</option>`).join(""),I=h=>'<option value="">— sin asignar —</option>'+u.map(f=>`<option value="${c(f._id)}"${f._id===h?" selected":""}>${c(f.concepto)} (${c(j(f.cuantia))})</option>`).join(""),A=l.map(h=>{var f;return`
      <tr data-tx="${c(h._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${c(h.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${c(h.concepto)}</td>
        <td style="padding:7px 8px">${ho(h.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${c(((f=t.accounts().find($=>$._id===h.cuentaId))==null?void 0:f.nombre)??h.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${c(h._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${I(h.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Pt(et(h.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${c(h._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${c(h._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),v=y.slice().reverse().slice(0,8).map(h=>{var f;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${c(h.fecha)}</span>
        <span style="color:var(--text3)">${c(((f=t.accounts().find($=>$._id===h.cuentaId))==null?void 0:f.nombre)??h.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${c(j(et(h.saldoCts)))}</span>
        ${h.nota?`<span style="color:var(--text3)">${c(h.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${c(h._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
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
          <span>Gastos: ${Pt(et(b))}</span>
          <span>Ingresos: ${Pt(et(d))}</span>
          <span>Neto: ${Pt(et(d+b))}</span>
          <span style="margin-left:auto">Saldo a ${c(i)}: <strong>${c(j(p))}</strong></span>
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
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${g}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(h=>`<option value="${c(h)}"></option>`).join("")}</datalist>
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
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${g}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${v?`<div class="mt-12">${v}</div>`:""}
        </div>
      </div>
    </div>`}function Qn(t,e,a,o){const{ledger:s}=e;J(t,"#acc-cuenta",i=>{a.cuentaId=i.value,o()}),J(t,"#acc-mes",i=>{a.mes=i.value||a.mes,o()});const n=t.querySelector("#acc-buscar");n==null||n.addEventListener("input",()=>{a.filtroTexto=n.value,clearTimeout(n._t),n._t=window.setTimeout(o,200)}),N(t,"#nt-guardar",()=>{const i=ft(t,"#nt-concepto").trim(),r=yo(t,"#nt-importe");if(!i)return q("Indica un concepto","err");if(!(r>0))return q("Indica un importe mayor que cero","err");const l=ft(t,"#nt-tags").split(",").map(u=>u.trim().toLowerCase()).filter(Boolean);s.registrar({fecha:ft(t,"#nt-fecha")||(e.hoy??Y)(),cuentaId:ft(t,"#nt-cuenta"),importe:r,concepto:i,tags:l,tipo:ft(t,"#nt-tipo"),estimacionId:ft(t,"#nt-estimacion")||null}),q("Movimiento registrado"),e.onDatosCambiados(),o()}),N(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;Z("¿Eliminar este movimiento?")&&(s.eliminar(r),q("Movimiento eliminado"),e.onDatosCambiados(),o())}),N(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,l=s.transacciones().find(d=>d._id===r);if(!l)return;const u=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(et(l.importeCts))));if(u===null)return;const b=parseFloat(u.replace(",","."));if(!Number.isFinite(b)||b<=0)return q("Importe no válido","err");s.actualizar(r,{importe:b}),q("Movimiento actualizado"),e.onDatosCambiados(),o()}),J(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");s.asignarEstimacion(r,i.value||null),q("Asignación actualizada"),e.onDatosCambiados()}),N(t,"#pc-guardar",()=>{if(ft(t,"#pc-saldo").trim()==="")return q("Indica el saldo","err");const r=yo(t,"#pc-saldo");s.registrarPuntoControl(ft(t,"#pc-cuenta"),ft(t,"#pc-fecha")||(e.hoy??Y)(),r,ft(t,"#pc-nota").trim()||void 0),q("Saldo real registrado"),e.onDatosCambiados(),o()}),N(t,"[data-pc-borrar]",i=>{Z("¿Eliminar este punto de control?")&&(s.eliminarPuntoControl(i.dataset.pcBorrar),q("Punto de control eliminado"),e.onDatosCambiados(),o())})}function Qe(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:s=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const n=W(t.mediaRealReciente),i=W(n-e),r=e!==0?i/Math.abs(e)*100:n!==0?100:0;if(Math.abs(r)<s)return null;const l=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:W(e),cuantiaSugerida:n,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:l,motivo:i>0?`El gasto real de los últimos ${l} meses supera lo estimado`:`El gasto real de los últimos ${l} meses es inferior a lo estimado`}}function Xn(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(n,i,r={}){const l=r.hoy??Y(),u=t.get("expenses"),b=u.find(g=>g._id===n);if(!b)throw new Error(`La estimación ${n} no existe`);const d={...b,fechaFin:l},p={...b,_id:e(),cuantia:W(i),fechaInicio:l,fechaFin:b.fechaFin??null,ajustadaDesdeId:b._id,ajustadaEn:l},y=u.map(g=>g._id===n?d:g);return y.push(p),t.set("expenses",y),{estimacionCerrada:d,estimacionNueva:p}}function o(n,i={}){const r=[],l=[];for(const u of n)try{r.push(a(u.estimacionId,u.cuantiaSugerida,i))}catch(b){l.push({estimacionId:u.estimacionId,error:b.message})}return{aplicadas:r,errores:l}}function s(n){const i=t.get("expenses"),r=new Map(i.map(I=>[I._id,I])),l=r.get(n);if(!l)return[];const u=[];let b=l;const d=new Set;for(;b!=null&&b.ajustadaDesdeId&&!d.has(b._id);){d.add(b._id);const I=r.get(b.ajustadaDesdeId);if(!I)break;u.unshift(I),b=I}const p=[];let y=l;const g=new Set([l._id]);for(;;){const I=i.find(A=>A.ajustadaDesdeId===y._id&&!g.has(A._id));if(!I)break;g.add(I._id),p.push(I),y=I}return[...u,l,...p]}return{aplicar:a,aplicarTodas:o,cadena:s}}function Xe(t){const e=t.estimaciones(),a=new Map(e.map(o=>[o._id,o]));return t.precision.analizarTodas(e).map(o=>{const s=a.get(o.estimacionId);return{analisis:o,estimacion:s,sugerencia:Qe(o,s.cuantia)}}).filter(o=>!!o.estimacion)}function Zn(t){const e=Xe(t),a=e.filter(l=>l.analisis.precision!==null),o=e.filter(l=>l.sugerencia!==null),s=t.precision.analizarPorTag(e.map(l=>l.analisis));if(a.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const n=a.map(({analisis:l,estimacion:u,sugerencia:b})=>{const d=l.meses.slice(-6).map(p=>`${Ke(p.mes)}: ${j(p.estimado)} → ${j(p.real)} (${p.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${c(u.concepto)}</div>
          <div style="margin-top:3px">${ho(l.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${c(d)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(j(l.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(j(l.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Pt(l.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${bo(l.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${b?`<button class="btn-secondary" data-sugerir="${c(l.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${c(b.motivo)}">Sugerir ajuste → ${c(j(b.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=s.map(l=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${c(l.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${l.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(j(l.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(j(l.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Pt(l.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${bo(l.precision)}</td>
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
    </div>`}function ti(t,e,a){N(t,"[data-sugerir]",o=>{const s=o.dataset.sugerir,n=Xe(e).find(l=>l.analisis.estimacionId===s);if(!(n!=null&&n.sugerencia))return;const i=n.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${j(i.cuantiaActual)}
Nueva estimación: ${j(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;Z(r)&&(e.adjuster.aplicar(s,i.cuantiaSugerida,{hoy:e.hoy()}),q(`Estimación ajustada a ${j(i.cuantiaSugerida)}`),e.onDatosCambiados(),a())}),N(t,"#ajustar-todas",()=>{const o=Xe(e).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const s=o.map(r=>`• ${r.concepto}: ${j(r.cuantiaActual)} → ${j(r.cuantiaSugerida)}`).join(`
`);if(!Z(`Se van a ajustar ${o.length} estimaciones:

${s}

¿Continuar?`))return;const{aplicadas:n,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});q(i.length>0?`${n.length} ajustadas, ${i.length} con error`:`${n.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const ei=[";",",","	","|"],ai={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function he(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ye(t,e){const a=[];let o="",s=!1;for(let n=0;n<t.length;n++){const i=t[n];s?i==='"'?t[n+1]==='"'?(o+='"',n++):s=!1:o+=i:i==='"'?s=!0:i===e?(a.push(o.trim()),o=""):o+=i}return a.push(o.trim()),a}function oi(t){let e=";",a=-1;for(const o of ei){const s=t.slice(0,20).map(l=>ye(l,o).length),n=Math.max(...s);if(n<2)continue;const r=s.filter(l=>l===n).length*10+n;r>a&&(a=r,e=o)}return e}function ne(t){let e=(t??"").trim();if(!e)return null;let a=!1;if(/^\(.*\)$/.test(e)&&(a=!0,e=e.slice(1,-1).trim()),e.endsWith("-")&&(a=!0,e=e.slice(0,-1).trim()),e.startsWith("-")&&(a=!0,e=e.slice(1).trim()),e.startsWith("+")&&(e=e.slice(1).trim()),e=e.replace(/[€$£\s  ]/g,""),!e)return null;const o=e.lastIndexOf(","),s=e.lastIndexOf(".");let n="";o>=0&&s>=0?n=o>s?",":".":o>=0?n=/,\d{3}$/.test(e)&&e.replace(/,/g,"").length>3?"":",":s>=0&&(n=/\.\d{3}$/.test(e)&&e.replace(/\./g,"").length>3?"":".");let i,r="0";if(n){const b=n===","?o:s;i=e.slice(0,b).replace(/[.,]/g,""),r=e.slice(b+1).replace(/[.,]/g,"")}else i=e.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const l=(r+"00").slice(0,2),u=Number(i||"0")*100+Number(l);return Number.isFinite(u)?a?-u:u:null}function Ze(t){const e=(t??"").trim();if(!e)return null;let a=e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a)return xo(Number(a[1]),Number(a[2]),Number(a[3]));if(a=e.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),a){let o=Number(a[3]);return o<100&&(o+=o<70?2e3:1900),xo(o,Number(a[2]),Number(a[1]))}return null}function xo(t,e,a){if(e<1||e>12||a<1||a>31)return null;const o=new Date(t,e-1,a);return o.getFullYear()!==t||o.getMonth()!==e-1||o.getDate()!==a?null:`${t}-${String(e).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function $o(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>Ze(a)!==null).length/e.length}function Io(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>ne(a)!==null).length/e.length}function si(t,e){const a={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,s=n=>e.map(i=>i[n]??"");for(const n of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=he(t[i]);if(r&&ai[n].some(l=>r===l||r.startsWith(l)||r.includes(l))){if(n==="importe"&&he(t[i]).includes("saldo"))continue;a[n]=i,o.add(i);break}}if(a.fecha<0){let n=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=$o(s(r));l>i&&(i=l,n=r)}n>=0&&(a.fecha=n,o.add(n))}if(a.importe<0&&a.debe<0&&a.haber<0){let n=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||he(t[r]).includes("saldo"))continue;const l=Io(s(r));l>i&&(i=l,n=r)}n>=0&&(a.importe=n,o.add(n))}if(a.concepto<0){let n=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=s(r);if(Io(l)>.5||$o(l)>.5)continue;const u=l.reduce((b,d)=>b+d.length,0)/Math.max(1,l.length);u>i&&(i=u,n=r)}n>=0&&(a.concepto=n)}return a}function ni(t){const e=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(b=>b.trim()!=="");if(e.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const a=oi(e),o=e.map(b=>ye(b,a).length),s=Math.max(...o);let n=o.findIndex(b=>b===s);n<0&&(n=0);const i=ye(e[n],a);let r=e.slice(n+1).map(b=>ye(b,a));const l=Ze(i[0]??"")!==null||i.some(b=>ne(b)!==null&&/\d/.test(b));l&&(r=[i,...r]);const u=si(l?i.map(()=>""):i,r.slice(0,40));return{separador:a,cabeceras:l?i.map((b,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:n+1,mapeo:u}}function Ao(t,e,a){return`${t}|${e}|${he(a).replace(/\s+/g," ")}`}function ii(t,e,a=[]){const o=new Set(a.map(n=>Ao(n.fecha,n.importeCts,n.concepto))),s=new Set;return t.filas.map((n,i)=>{const r=[],l=e.fecha>=0?Ze(n[e.fecha]??""):null;e.fecha<0?r.push("sin columna de fecha"):l||r.push(`fecha ilegible: «${n[e.fecha]??""}»`);let u=null;if(e.importe>=0)u=ne(n[e.importe]??""),u===null&&r.push(`importe ilegible: «${n[e.importe]??""}»`);else if(e.debe>=0||e.haber>=0){const p=e.debe>=0?ne(n[e.debe]??""):null,y=e.haber>=0?ne(n[e.haber]??""):null;p===null&&y===null?r.push("sin importe en Debe ni en Haber"):p!==null&&p!==0?u=-Math.abs(p):y!==null&&y!==0?u=Math.abs(y):u=0}else r.push("sin columna de importe");u===0&&r.push("importe cero");const b=(e.concepto>=0?n[e.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(l&&u!==null){const p=Ao(l,u,b);d=o.has(p)||s.has(p),s.add(p)}return{linea:t.lineaCabecera+1+i,fecha:l,concepto:b,importeCts:u,errores:r,duplicada:d}})}function ri(t,e){const a=t.filter(s=>s.errores.length===0&&(e||!s.duplicada)),o=a.map(s=>s.fecha).filter(s=>!!s).sort();return{total:t.length,importables:a.length,conError:t.filter(s=>s.errores.length>0).length,duplicadas:t.filter(s=>s.duplicada).length,sumaCts:a.reduce((s,n)=>s+(n.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function xe(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const li=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function ta(t,e){if(!e.analisis||!e.mapeo){e.filas=[];return}const a=t.ledger.transacciones(e.cuentaId?{cuentaId:e.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));e.filas=ii(e.analisis,e.mapeo,a)}function ci(t,e){const a=t.accounts().filter(s=>s.activo);if(!e.abierto)return`
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
      </div>`;const o=a.map(s=>`<option value="${c(s._id)}"${s._id===e.cuentaId?" selected":""}>${c(s.nombre)}</option>`).join("");return`
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

      ${e.analisis&&e.mapeo?ui(e,e.analisis,e.mapeo):di()}
    </div>`}function di(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function ui(t,e,a){const o=ri(t.filas,t.incluirDuplicadas),s=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+e.cabeceras.map((l,u)=>`<option value="${u}"${u===r?" selected":""}>${c(l||`Columna ${u+1}`)}</option>`).join(""),n=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${c(t.nombreFichero)}</strong> · ${e.filas.length} línea${e.filas.length!==1?"s":""}
      · separador <code>${c(e.separador==="	"?"tabulador":e.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${li.map(r=>`<div class="form-group">
          <label class="form-label" for="imp-col-${r.clave}">${c(r.etiqueta)}</label>
          <select class="form-select" id="imp-col-${r.clave}" data-imp-col="${r.clave}">${s(a[r.clave])}</select>
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

    ${n.length>0?`<div class="alert-card alert-warning mb-12">
             <div class="alert-icon">⚠️</div>
             <div class="alert-body">
               <div class="alert-title">${n.length} línea${n.length!==1?"s":""} no se puede${n.length!==1?"n":""} importar</div>
               <div class="alert-sub">${n.slice(0,4).map(r=>`línea ${r.linea}: ${c(r.errores[0])}`).join(" · ")}${n.length>4?" …":""}</div>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function pi(t,e,a,o){N(t,"[data-imp-abrir]",()=>{const n=e.accounts().filter(i=>i.activo);Object.assign(a,xe(),{abierto:!0,cuentaId:n.length===1?n[0]._id:""}),o()}),N(t,"[data-imp-cerrar]",()=>{Object.assign(a,xe()),o()}),J(t,"#imp-cuenta",n=>{a.cuentaId=n.value,ta(e,a),o()}),J(t,"#imp-duplicadas",n=>{a.incluirDuplicadas=n.checked,o()}),J(t,"[data-imp-col]",n=>{const i=n,r=i.dataset.impCol;a.mapeo&&(a.mapeo[r]=Number(i.value),ta(e,a),o())});const s=t.querySelector("#imp-fichero");s==null||s.addEventListener("change",()=>{var i;const n=(i=s.files)==null?void 0:i[0];n&&mi(n).then(r=>{const l=ni(r);a.nombreFichero=n.name,a.error=l.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",a.analisis=l,a.mapeo={...l.mapeo},ta(e,a),o()}).catch(r=>{a.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),N(t,"[data-imp-confirmar]",()=>{if(!a.cuentaId)return;const n=a.filas.filter(i=>i.errores.length===0&&(a.incluirDuplicadas||!i.duplicada));if(n.length!==0){for(const i of n)e.ledger.registrar({fecha:i.fecha,cuentaId:a.cuentaId,importe:Math.abs(et(i.importeCts)),tipo:i.importeCts<0?"gasto":"ingreso",concepto:i.concepto,origen:"importado"});q(`${n.length} movimiento${n.length!==1?"s":""} importado${n.length!==1?"s":""}`),Object.assign(a,xe()),e.onDatosCambiados(),o()}})}function mi(t){return t.arrayBuffer().then(e=>{const a=new TextDecoder("utf-8").decode(e);if(!a.includes("�"))return a;try{return new TextDecoder("iso-8859-1").decode(e)}catch{return a}})}function fi(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function vi(t,e){const a=G(t),o=[];for(let s=1;s<=e;s++){const n=new Date(a.getFullYear(),a.getMonth()-s,1);o.push(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function gi(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function So(t,e){const{inicio:a,fin:o}=gi(e);return Qt([t],{start:a,end:o}).reduce((n,i)=>n+Math.abs(i.cuantia),0)}function bi(t){function e(s,n={}){var $;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:l=Y()}=n,u=t.transacciones({estimacionId:s._id}),d=u.length===0&&((($=s.tags)==null?void 0:$.length)??0)>0?t.transacciones({tags:s.tags}):u,p=new Map;for(const m of d){const x=m.fecha.slice(0,7);p.set(x,(p.get(x)??0)+Math.abs(m.importeCts)/100)}const y=[];for(const m of vi(l,i)){const x=p.get(m);if(x===void 0)continue;const S=W(So(s,m));y.push({mes:m,estimado:S,real:W(x),desviacion:W(x-S),precision:fi(S,x)})}const g=W(y.reduce((m,x)=>m+x.estimado,0)),I=W(y.reduce((m,x)=>m+x.real,0)),A=y.reduce((m,x)=>m+Math.abs(x.estimado),0),v=y.length===0?null:A>0?y.reduce((m,x)=>m+x.precision*Math.abs(x.estimado),0)/A:y.reduce((m,x)=>m+x.precision,0)/y.length,h=y.slice(-r),f=h.length>0?W(h.reduce((m,x)=>m+x.real,0)/h.length):null;return{estimacionId:s._id,concepto:s.concepto,tags:s.tags??[],meses:y,estimadoTotal:g,realTotal:I,desviacionTotal:W(I-g),precision:v,mediaRealReciente:f,infraestimada:I>g}}function a(s,n={}){return s.filter(i=>i.tipo!=="transferencia").map(i=>e(i,n)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(s){const n=new Map;for(const i of s)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const l=n.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};l.estimado+=i.estimadoTotal,l.real+=i.realTotal,l.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),l.peso+=Math.abs(i.estimadoTotal),l.n+=1,n.set(r,l)}return[...n.entries()].map(([i,r])=>({tag:i,estimadoTotal:W(r.estimado),realTotal:W(r.real),desviacionTotal:W(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}function hi(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function yi(t){const[e,a]=t.slice(0,7).split("-").map(Number),o=new Date(e,a-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function xi(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function $i(t,e,a){const o=new Map(e.map(n=>[n._id,[]])),s=e.filter(n=>{var i;return!a(n._id)&&(((i=n.tags)==null?void 0:i.length)??0)>0});for(const n of t){if(n.estimacionId&&o.has(n.estimacionId)){o.get(n.estimacionId).push(n);continue}if(n.estimacionId)continue;let i=null,r=0;for(const l of s){const u=(l.tags??[]).filter(b=>n.tags.includes(b)).length;u!==0&&(u>r||u===r&&i&&l._id<i._id)&&(i=l,r=u)}i&&o.get(i._id).push(n)}return o}function Ii(t,e,a,o={}){const{desde:s,hasta:n}=hi(a),i=t.transacciones({desde:s,hasta:n}),r=i.filter(f=>f.importeCts<0),l=i.filter(f=>f.importeCts>0),u=e.filter(f=>f.tipo==="gasto"&&f.activo!==!1),b=new Map((o.analisis??[]).map(f=>[f.estimacionId,f])),d=new Set(u.filter(f=>t.transacciones({estimacionId:f._id}).length>0).map(f=>f._id)),p=$i(r,u,f=>d.has(f)),y=new Set,g=u.map(f=>{const $=p.get(f._id)??[];for(const w of $)y.add(w._id);const m=W($.reduce((w,E)=>w+Math.abs(E.importeCts)/100,0)),x=W(So(f,a)),S=b.get(f._id);return{estimacionId:f._id,concepto:f.concepto,tags:f.tags??[],estimado:x,real:m,desviacion:W(m-x),sinMovimiento:$.length===0,sugerencia:S?Qe(S,f.cuantia,{hoy:o.hoy}):null}}),I=new Map;for(const f of r){if(y.has(f._id))continue;const $=xi(f.concepto),m=I.get($)??{concepto:f.concepto,total:0,movimientos:0};m.total=W(m.total+Math.abs(f.importeCts)/100),m.movimientos+=1,I.set($,m)}const A=[...I.values()].sort((f,$)=>$.total-f.total),v=W(g.reduce((f,$)=>f+$.estimado,0)),h=W(r.reduce((f,$)=>f+Math.abs($.importeCts)/100,0));return{mes:a,estimado:v,real:h,desviacion:W(h-v),ingresosReales:W(l.reduce((f,$)=>f+$.importeCts/100,0)),filas:g.sort((f,$)=>Math.abs($.desviacion)-Math.abs(f.desviacion)),sinEstimacion:A,totalSinEstimacion:W(A.reduce((f,$)=>f+$.total,0)),vacio:i.length===0}}function Mo(t){const e=new Set;for(const a of t.transacciones())e.add(a.fecha.slice(0,7));return[...e].sort().reverse()}function Ai(){return{mes:""}}function ea(t,e){if(e.mes)return e.mes;const a=Mo(t.ledger),o=yi((t.hoy??Y)());return a.includes(o)?o:a[0]??o}function aa(t,e){const a=(t.hoy??Y)(),o=t.estimaciones(),s=t.precision.analizarTodas(o,{hoy:a});return Ii(t.ledger,o,e,{analisis:s,hoy:a})}function Si(t,e){const a=ea(t,e),o=Mo(t.ledger);o.includes(a)||o.unshift(a);const s=aa(t,a),n=`
    <select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
      ${o.map(l=>`<option value="${c(l)}"${l===a?" selected":""}>${c(Ke(l))}</option>`).join("")}
    </select>`;if(s.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">Cierre de mes</div>
          ${n}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados en ${c(Ke(a))}. Importa el extracto del banco o
          registra los movimientos a mano y aquí verás en qué se desvió el mes respecto a lo que habías previsto.
        </div>
      </div>`;const i=l=>l>0?"+":"",r=s.desviacion>0?"var(--red)":s.desviacion<0?"var(--accent)":"var(--text2)";return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Cierre de mes</div>
        ${n}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin-bottom:14px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Habías previsto</div>
          <div class="stat-value" style="font-size:1.15rem">${c(j(s.estimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Has gastado</div>
          <div class="stat-value" style="font-size:1.15rem">${c(j(s.real))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación</div>
          <div class="stat-value" style="font-size:1.15rem;color:${r}">${i(s.desviacion)}${c(j(s.desviacion))}</div>
          <div class="stat-sub">${s.desviacion>0?"de más":s.desviacion<0?"de menos":"clavado"}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${s.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${c(j(s.totalSinEstimacion))}</div>
          <div class="stat-sub">${s.sinEstimacion.length} concepto${s.sinEstimacion.length!==1?"s":""}</div>
        </div>
      </div>

      ${Mi(s)}
      ${wi(s)}
    </div>`}function Mi(t){const e=t.filas.filter(o=>o.estimado>0||o.real>0);if(e.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas para este mes.</div>';const a=e.filter(o=>o.sugerencia);return`
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
          ${e.map(o=>{const s=o.desviacion>0?"var(--red)":o.desviacion<0?"var(--accent)":"var(--text2)",n=o.sugerencia;return`<tr>
                <td style="font-size:12px">
                  ${c(o.concepto)}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${c(j(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${c(j(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${s}">
                  ${o.desviacion>0?"+":""}${c(j(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${n?`<button class="btn-secondary btn-sm" data-cie-ajustar="${c(o.estimacionId)}"
                           title="Pasar la estimación de ${c(j(n.cuantiaActual))} a ${c(j(n.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${c(j(n.cuantiaSugerida))}</button>`:""}
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
           </div>`:""}`}function wi(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function Ci(t,e,a,o){J(t,"#cie-mes",s=>{a.mes=s.value,o()}),N(t,"[data-cie-ajustar]",s=>{const n=s.dataset.cieAjustar,r=aa(e,ea(e,a)).filas.find(l=>l.estimacionId===n);r!=null&&r.sugerencia&&(e.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(e.hoy??Y)()}),q(`«${r.concepto}» ajustada a ${j(r.sugerencia.cuantiaSugerida)}`),e.onDatosCambiados(),o())}),N(t,"[data-cie-ajustar-todas]",()=>{const n=aa(e,ea(e,a)).filas.map(l=>l.sugerencia).filter(l=>l!==null);if(n.length===0)return;const{aplicadas:i,errores:r}=e.adjuster.aplicarTodas(n,{hoy:(e.hoy??Y)()});q(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),e.onDatosCambiados(),o()})}const ji="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function Ei(t){const e={cuentaId:"",mes:(t.hoy??Y)().slice(0,7),filtroTexto:""},a=xe(),o=Ai(),s=()=>{var d;return(d=t.onDatosCambiados)==null?void 0:d.call(t)},n=t.hoy??Y,i={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:s,hoy:n},r={ledger:t.ledger,accounts:t.accounts,onDatosCambiados:s},l={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:s,hoy:n},u={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:s,hoy:n};function b(d){const p=t.ledger.saldoTotal(n()),y=t.ledger.ultimaFecha(),g=t.ledger.transacciones().length;d.innerHTML=`
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
          <div class="stat-value" style="font-size:1.3rem">${c(j(p))}</div>
          <div style="font-size:11px;color:var(--text3)">suma de cuentas activas</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Movimientos registrados</div>
          <div class="stat-value" style="font-size:1.3rem">${g}</div>
          <div style="font-size:11px;color:var(--text3)">${y?`último: ${c(y)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-importar"></div>
      <div id="acc-cierre" data-feature="precision-estimaciones"></div>
      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const I=d.querySelector("#acc-importar"),A=d.querySelector("#acc-cierre"),v=d.querySelector("#acc-transacciones"),h=d.querySelector("#acc-precision");I.innerHTML=ci(r,a),A.innerHTML=Si(l,o),v.innerHTML=Kn(i,e),h.innerHTML=Zn(u);const f=()=>b(d);pi(I,r,a,f),Ci(A,l,o,f),Qn(v,i,e,f),ti(h,u,f)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:ji,mount:b}}const zi="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function oa(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function _i(t){const{store:e}=t,a=t.hoy??Y,o=()=>G(a()),s=()=>e.get("config").margenesSeguridad??[];function n(y){var g;e.patchConfig({margenesSeguridad:y}),(g=t.onDatosCambiados)==null||g.call(t)}function i(y,g){const I=s().map(v=>({...v,puntos:(v.puntos??[]).map(h=>({...h}))})),A=I.find(v=>v._id===y);A&&(g(A),n(I))}function r(y){const g=e.get("config"),I=ve(y,e.get("expenses"),g,e.get("loans"),a(),!1,o());return j(I)}function l(y,g,I){const A=g.tipo==="fijo",v=A?"":`<span class="text-sm" style="color:var(--text3)">${c(j((g.meses??0)*I))}</span>`;return`
      <tr data-punto="${c(g._id)}" data-margen="${c(y._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${c(g.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${A?" selected":""}>Fijo €</option>
            <option value="meses"${A?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${A?`<input type="number" class="form-input" style="width:90px" value="${g.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${A?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${g.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${v}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function u(y,g,I){const A=y.cuentas&&y.cuentas.length>0?y.cuentas.map($=>{var m;return((m=g.find(x=>x._id===$))==null?void 0:m.nombre)??$}).join(", "):"Todas las cuentas activas",h=[...y.puntos??[]].sort(($,m)=>$.fecha.localeCompare(m.fecha)).map($=>l(y,$,I)).join(""),f=y.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${c(A)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${c(r(y))}</strong>
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
            ${h||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${c(y._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${c(y.nombre)}</span>
            <span class="badge ${y.activo?"badge-active":"badge-inactive"}">${y.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${y.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${y.activo?"checked":""} data-toggle-margen="${c(y._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${c(y._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${c(y._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${f}
      </div>`}function b(y,g){const I=g?s().find(f=>f._id===g):null,A=e.get("accounts").filter(f=>f.activo),v=new Set((I==null?void 0:I.cuentas)??[]),h=A.map(f=>`
        <label class="tag" data-chip="${c(f._id)}" style="cursor:pointer;${v.has(f._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${c(f._id)}" ${v.has(f._id)?"checked":""} style="display:none"/>
          ${c(f.nombre)}
        </label>`).join(" ");y.innerHTML=`
      <div class="modal-title">${g?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${c((I==null?void 0:I.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${h||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${I?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
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
        <button class="btn-primary" data-guardar-margen="${c(g??"")}">Guardar</button>
      </div>`}function d(y,g){const I=document.getElementById("modal-overlay"),A=document.getElementById("modal-content");!I||!A||(b(A,y),I.classList.remove("hidden"),J(A,".mg-acc-chip",v=>{const h=v,f=A.querySelector(`[data-chip="${h.value}"]`);f&&(f.style.cssText=`cursor:pointer;${h.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),J(A,"#mg-p-tipo",v=>{const h=v.value==="fijo",f=A.querySelector("#mg-p-importe-wrap"),$=A.querySelector("#mg-p-meses-wrap");f&&(f.style.display=h?"":"none"),$&&($.style.display=h?"none":"")}),N(A,"[data-cerrar-form]",()=>I.classList.add("hidden")),N(A,"[data-guardar-margen]",v=>{var x,S,w,E,_;const h=v.getAttribute("data-guardar-margen")||"",f=((x=A.querySelector("#mg-nombre"))==null?void 0:x.value.trim())??"";if(!f)return q("El nombre es obligatorio","err");const $=[...A.querySelectorAll(".mg-acc-chip:checked")].map(D=>D.value),m=s().map(D=>({...D}));if(h){const D=m.findIndex(C=>C._id===h);if(D===-1)return q("Margen no encontrado","err");m[D]={...m[D],nombre:f,cuentas:$}}else{const D=((S=A.querySelector("#mg-p-tipo"))==null?void 0:S.value)??"fijo",C={_id:oa(),fecha:((w=A.querySelector("#mg-p-fecha"))==null?void 0:w.value)||Y(),tipo:D,importe:parseFloat(((E=A.querySelector("#mg-p-importe"))==null?void 0:E.value)??"0")||0,meses:parseFloat(((_=A.querySelector("#mg-p-meses"))==null?void 0:_.value)??"1")||1};m.push({_id:oa(),nombre:f,activo:!0,cuentas:$,puntos:[C]})}n(m),q(h?"Margen actualizado":"Margen creado"),I.classList.add("hidden"),g()}))}function p(y){const g=s(),I=e.get("accounts"),A=Zt(e.get("expenses"),o());y.innerHTML=`
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
             </div>`:g.map(h=>u(h,I,A)).join("")}`;const v=()=>p(y);N(y,"[data-nuevo-margen]",()=>d(null,v)),N(y,"[data-editar-margen]",h=>d(h.getAttribute("data-editar-margen"),v)),N(y,"[data-borrar-margen]",h=>{Z("¿Eliminar este margen de seguridad?")&&(n(s().filter(f=>f._id!==h.getAttribute("data-borrar-margen"))),q("Margen eliminado"),v())}),J(y,"[data-toggle-margen]",h=>{const f=h.getAttribute("data-toggle-margen");i(f,$=>{$.activo=h.checked}),v()}),N(y,"[data-add-punto]",h=>{const f=h.getAttribute("data-add-punto");i(f,$=>{$.puntos=[...$.puntos??[],{_id:oa(),fecha:Y(),tipo:"fijo",importe:0,meses:1}]}),v()}),N(y,"[data-borrar-punto]",h=>{const f=h.closest("[data-punto]");if(!f)return;const $=f.dataset.margen,m=f.dataset.punto;i($,x=>{x.puntos=(x.puntos??[]).filter(S=>S._id!==m)}),v()}),J(y,"[data-campo]",h=>{const f=h.closest("[data-punto]");if(!f)return;const $=h.getAttribute("data-campo"),m=h.value;i(f.dataset.margen,x=>{const S=(x.puntos??[]).find(w=>w._id===f.dataset.punto);S&&($==="fecha"?S.fecha=m:$==="tipo"?S.tipo=m:$==="importe"?S.importe=parseFloat(m)||0:S.meses=parseFloat(m)||0)}),v()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:zi,mount:p}}const Fi="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function Pi(t){const e=Array.isArray(t)?t[1]??[]:[];return Array.isArray(e)?e.filter(a=>a&&a.value!==null&&a.value!==void 0&&Number.isFinite(Number(a.value))).map(a=>({year:parseInt(a.date),tasa:parseFloat(Number(a.value).toFixed(2))})).filter(a=>Number.isFinite(a.year)).sort((a,o)=>a.year-o.year):[]}function Di({fetchImpl:t,url:e=Fi}={}){let a=null,o=!1;async function s(n=!1){if(a&&!n)return a;if(o)return null;o=!0;try{const r=await(t??fetch)(e);if(!r.ok)throw new Error(`HTTP ${r.status}`);return a=Pi(await r.json()),a}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:s,invalidar:()=>{a=null},get enCache(){return a}}}const Ti="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function Ni(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function Ri(t){const{store:e}=t,a=t.ipc??Di(),o=()=>e.get("inflacion")??[];function s(){var d;(d=t.onDatosCambiados)==null||d.call(t)}function n(d,p){if(!d||d.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const y=new Set(o().map(h=>h.year)),g=d.filter(h=>h.year>=p).reverse(),I=g.filter(h=>!y.has(h.year)).length,A=[...new Set(d.map(h=>h.year))].sort((h,f)=>h-f),v=g.map(h=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${h.year}" data-tasa="${h.tasa}" ${y.has(h.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${h.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${Ni(h.tasa)}">${h.tasa.toFixed(2)}%</span>
          ${y.has(h.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${A.map(h=>`<option value="${h}"${h===p?" selected":""}>${h}</option>`).join("")}
        </select>
        <span style="font-size:10px;color:var(--text3)">
          Fuente: Banco Mundial · FP.CPI.TOTL.ZG · ${d[0].year}–${d[d.length-1].year}
        </span>
        <button class="btn-secondary btn-sm" data-ipc-recargar title="Forzar recarga desde la API">↺</button>
      </div>
      <div style="max-height:300px;overflow-y:auto;margin-bottom:12px">${v}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="font-size:12px;color:var(--text3)">${I} periodo${I!==1?"s":""} nuevo${I!==1?"s":""} disponible${I!==1?"s":""}</span>
        <div class="flex gap-8">
          <button class="btn-secondary" data-ipc-cerrar>Cancelar</button>
          <button class="btn-primary" data-ipc-importar ${I===0?"disabled":""}>↓ Importar seleccionados</button>
        </div>
      </div>`}function i(d){return!d||d.length===0?2e3:Math.max(d[0].year,new Date().getFullYear()-25)}async function r(d){const p=document.getElementById("modal-overlay"),y=document.getElementById("modal-content");if(!p||!y)return;y.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,p.classList.remove("hidden");const g=(A,v)=>{const h=document.getElementById("ipc-body");h&&(h.innerHTML=n(A,v))},I=await a.obtener();g(I,i(I)),N(y,"[data-ipc-cerrar]",()=>p.classList.add("hidden")),J(y,"#ipc-desde",A=>{g(a.enCache,parseInt(A.value))}),N(y,"[data-ipc-recargar]",()=>{a.invalidar();const A=document.getElementById("ipc-body");A&&(A.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),a.obtener(!0).then(v=>g(v,i(v)))}),N(y,"[data-ipc-importar]",()=>{const A=[...y.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(A.length===0)return q("Nada seleccionado","err");const v=new Set(o().map(f=>f.year));let h=0;for(const f of A){const $=parseInt(f.dataset.year??""),m=parseFloat(f.dataset.tasa??"");!Number.isFinite($)||!Number.isFinite(m)||v.has($)||(e.addItem("inflacion",{year:$,tasa:m}),v.add($),h++)}p.classList.add("hidden"),q(`${h} periodo${h!==1?"s":""} importado${h!==1?"s":""} correctamente`),s(),d()})}function l(d,p){var v;const y=document.getElementById("modal-overlay"),g=document.getElementById("modal-content");if(!y||!g)return;const I=d?o().find(h=>h._id===d):null;g.innerHTML=`
      <div class="modal-title">${d?"Editar periodo de inflación":"Nuevo periodo de inflación"}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Año</label>
          <input class="form-input" type="number" id="inf-year" value="${(I==null?void 0:I.year)??new Date().getFullYear()}" placeholder="2026"/></div>
        <div class="form-group"><label class="form-label">Tasa anual (%)</label>
          <input class="form-input" type="number" id="inf-tasa" step="0.01" value="${(I==null?void 0:I.tasa)??""}" placeholder="3.5"/></div>
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-inf-cerrar>Cancelar</button>
        <button class="btn-primary" data-inf-guardar="${c(d??"")}">Guardar</button>
      </div>`,y.classList.remove("hidden");const A=()=>{var x;const h=parseFloat(((x=g.querySelector("#inf-tasa"))==null?void 0:x.value)??""),f=g.querySelector("#inf-preview");if(!f)return;if(!Number.isFinite(h)||h<=0){f.innerHTML="";return}const $=(Math.pow(1+h/100,1/12)-1)*100,m=Math.pow(1+h/100,5);f.innerHTML=`Con un ${h}% anual: <strong>${$.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${m.toFixed(3)}</strong> (+${((m-1)*100).toFixed(1)}%)`};(v=g.querySelector("#inf-tasa"))==null||v.addEventListener("input",A),A(),N(g,"[data-inf-cerrar]",()=>y.classList.add("hidden")),N(g,"[data-inf-guardar]",h=>{const f=h.getAttribute("data-inf-guardar")||"",$=parseInt(g.querySelector("#inf-year").value),m=parseFloat(g.querySelector("#inf-tasa").value);if(!Number.isFinite($)||$<1900||$>2200)return q("Año inválido","err");if(!Number.isFinite(m)||m<0||m>100)return q("Tasa inválida (0–100%)","err");if(o().filter(S=>S._id!==f).some(S=>S.year===$))return q("Ya existe un periodo para ese año","err");f?(e.updateItem("inflacion",f,{year:$,tasa:m}),q("Periodo actualizado")):(e.addItem("inflacion",{year:$,tasa:m}),q("Periodo añadido")),y.classList.add("hidden"),s(),p()})}function u(d,p){const y=(Math.pow(1+d.tasa/100,.08333333333333333)-1)*100,g=`${d.year}-12-31`,I=g>p?pt([d],p,g):null;return`
      <div class="exp-table-row" data-periodo="${c(d._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${d.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${d.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${y.toFixed(3)}%/mes</div>
        <div class="num">${I!==null?`×${I.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${c(d._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${c(d._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function b(d){const p=o(),y=e.get("config").usarInflacion||!1,g=[...p].sort((x,S)=>S.year-x.year),I=Y(),A=new Date().getFullYear(),v=V(new Date(A+5,0,1)),h=V(new Date(A+10,0,1)),f=y&&p.length>0?pt(p,I,v):null,$=y&&p.length>0?pt(p,I,h):null;d.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${!y&&p.length===0?`<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
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
            <input type="checkbox" data-toggle-inflacion ${y?"checked":""}/>
            <span class="toggle-slider"></span>
          </label>
        </div>
        ${f!==null&&$!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${f.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((f-1)*100).toFixed(1)}%)</span></div>
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
        ${g.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':g.map(x=>u(x,I)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const m=()=>b(d);J(d,"[data-toggle-inflacion]",x=>{const S=x.checked;e.patchConfig({usarInflacion:S}),q(S?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),s(),m()}),N(d,"[data-nuevo-periodo]",()=>l(null,m)),N(d,"[data-editar-periodo]",x=>l(x.getAttribute("data-editar-periodo"),m)),N(d,"[data-importar-ipc]",()=>void r(m)),N(d,"[data-borrar-periodo]",x=>{Z("¿Eliminar este periodo de inflación?")&&(e.removeItem("inflacion",x.getAttribute("data-borrar-periodo")),q("Periodo eliminado"),s(),m())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:Ti,mount:b}}const Oi=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],qi=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Li=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function Bi(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const sa=(t,e)=>t.map(([a,o])=>`<option value="${c(a)}"${a===e?" selected":""}>${c(o)}</option>`).join("");function wo(t,e="dp"){const{modo:a,dia:o,nth:s,wd:n}=Bi(t),i=sa(Oi.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${c(e)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${sa(qi,s)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${sa(Li,n)}</select>
        del mes
      </span>
    </div>
  </div>`}function Co(t){var o,s,n;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(s=e.querySelector("[data-dp-dia]"))==null||s.style.setProperty("display",a==="dia"?"":"none"),(n=e.querySelector("[data-dp-nth]"))==null||n.style.setProperty("display",a==="nthweekday"?"":"none")}function jo(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=s=>{var n;return((n=e.querySelector(s))==null?void 0:n.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const ki="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Hi=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Gi(t){const e=t.hoy??Y,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var v;return(v=t.onDatosCambiados)==null?void 0:v.call(t)},s=()=>t.store.get("accounts"),n=v=>{var h;return((h=s().find(f=>f._id===(v||"default")))==null?void 0:h.nombre)??(v||"default")};function i(){const v=e();let h=[...t.store.get("expenses")];if(a.mostrarExpirados||(h=h.filter(f=>!f.fechaFin||f.fechaFin>=v)),a.tipo&&(h=h.filter(f=>f.tipo===a.tipo)),a.cuenta&&(h=h.filter(f=>(f.cuenta||"default")===a.cuenta)),a.desde&&(h=h.filter(f=>(f.fechaInicio??"")>=a.desde)),a.hasta&&(h=h.filter(f=>(f.fechaInicio??"")<=a.hasta)),a.busqueda){const f=a.busqueda.toLowerCase();h=h.filter($=>$.concepto.toLowerCase().includes(f))}return a.tags.size>0&&(h=h.filter(f=>(f.tags||[]).some($=>a.tags.has($)))),h.sort((f,$)=>{const m=f[a.orden]??"",x=$[a.orden]??"";return typeof m=="number"&&typeof x=="number"?(m-x)*a.sentido:String(m).localeCompare(String(x))*a.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(v=>v.tags||[]))].filter(Boolean).sort()}function l(v,h){const f=a.orden===v?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${v}">${c(h)} <span class="sort-arrow">${f}</span></span>`}function u(v,h=!1){return(h?'<option value="">Todas las cuentas</option>':"")+s().filter($=>$.activo!==!1).map($=>`<option value="${c($._id)}"${$._id===v?" selected":""}>${c($.nombre)}</option>`).join("")}function b(v){const h=v.tipo==="transferencia",f=je(v.diaPago??""),$=v.tipoFrecuencia==="extraordinario"?"Único":`Cada ${v.frecuencia??1} ${v.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${f?` · ${f}`:""}`,m=!!v.fechaFin&&v.fechaFin<e(),x=h?'<span class="badge badge-purple">⇄ transf.</span>':v.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',S=h?`${c(n(v.cuenta))} → ${c(n(v.cuentaDestino))}`:c(n(v.cuenta)),w=(v.tags||[]).map(E=>`<span class="tag${a.tags.has(E)?" active":""}" data-tag="${c(E)}" title="Filtrar por ${c(E)}">${c(E)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(v.concepto)}</div>
        <div class="tag-list mt-4">${w}</div>
      </div>
      <div>${x}</div>
      <div class="num ${v.tipo==="ingreso"?"pos":h?"":"neg"}">${h?"⇄ ":""}${c(j(v.cuantia))}</div>
      <div class="text-sm">${c($)}</div>
      <div class="text-sm exp-col-hide">${S}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${c(v._id)}"${v.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${v.tipo==="gasto"&&v.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${v.tipo==="gasto"&&v.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${v.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${v.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${c(v.ajustadaEn??"")}">ajustada</span>`:""}
        ${m?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${c(v._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${c(v._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${c(v._id)}">✕</button>
      </div>
    </div>`}function d(v){const h=i(),f=r();v.innerHTML=`
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
              ${f.map($=>`<span class="tag${a.tags.has($)?" active":""}" data-tag="${c($)}">${c($)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${l("concepto","Concepto")} ${l("tipo","Tipo")} ${l("cuantia","Cuantía")} ${l("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${h.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':h.map(b).join("")}
      </div>`}function p(v){const h=(v==null?void 0:v.tipo)==="transferencia",f=t.store.get("escenarios"),$=(v==null?void 0:v.escenarioIds)||[],m=(x,S,w,E,_="")=>`<div class="form-group"><label class="form-label">${c(S)}</label>
       <input class="form-input" type="${w}" id="${x}" value="${c(E)}" placeholder="${c(_)}"/></div>`;return`
      <div class="grid-2">
        ${m("ef-concepto","Concepto","text",(v==null?void 0:v.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(v==null?void 0:v.tipo)==="gasto"||!(v!=null&&v.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(v==null?void 0:v.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${h?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${m("ef-cuantia","Cuantía (€)","number",(v==null?void 0:v.cuantia)??"","500")}
        ${m("ef-frecuencia","Frecuencia","number",(v==null?void 0:v.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${Hi.map(([x,S])=>`<option value="${x}"${((v==null?void 0:v.tipoFrecuencia)??"mensual")===x?" selected":""}>${c(S)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${m("ef-fecha-ini","Fecha inicio","date",(v==null?void 0:v.fechaInicio)??e())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${u((v==null?void 0:v.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${h?"":' style="display:none"'}>
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
          <div class="mt-8">${m("ef-fecha-fin","Fecha fin (opcional)","date",(v==null?void 0:v.fechaFin)??"")}</div>
          <div class="mt-8">${wo(v==null?void 0:v.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${h?' style="display:none"':""}>
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
                    ${f.map(x=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${$.includes(x._id)?c(x.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${c(x._id)}"${$.includes(x._id)?" checked":""}/>
                          ${c(x.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${c((v==null?void 0:v._id)??"")}">Guardar</button>
      </div>`}function y(v){var $;const h=(($=v.querySelector("#ef-tipo"))==null?void 0:$.value)??"gasto",f=(m,x)=>{const S=v.querySelector(m);S&&(S.style.display=x?"":"none")};f("#ef-destino-wrap",h==="transferencia"),f("#ef-basico-wrap",h!=="transferencia"),f("#ef-irpf-wrap",h==="ingreso"),f("#ef-clasificacion-wrap",h==="gasto")}function g(v,h,f){const $=document.getElementById("modal-overlay"),m=document.getElementById("modal-content");!$||!m||(m.innerHTML=`<div class="modal-title">${c(h)}</div>${p(v)}`,$.classList.remove("hidden"),J(m,"#ef-tipo",()=>y(m)),J(m,"[data-dp-modo]",()=>Co(m)),N(m,"[data-cancelar]",()=>$.classList.add("hidden")),N(m,"[data-guardar]",x=>{I(m,x.getAttribute("data-guardar")||"")&&($.classList.add("hidden"),f())}))}function I(v,h){const f=D=>{var C;return((C=v.querySelector(D))==null?void 0:C.value)??""},$=D=>{var C;return!!((C=v.querySelector(D))!=null&&C.checked)},m=f("#ef-tipo")||"gasto",x=m==="transferencia",S=f("#ef-concepto").trim(),w=parseFloat(f("#ef-cuantia"));if(!S||!Number.isFinite(w))return q("Concepto y cuantía obligatorios","err"),!1;const E=f("#ef-clasificacion"),_={concepto:S,tipo:m,cuantia:w,frecuencia:parseInt(f("#ef-frecuencia"),10)||1,tipoFrecuencia:f("#ef-tipo-frec")||"mensual",fechaInicio:f("#ef-fecha-ini"),fechaFin:f("#ef-fecha-fin")||null,diaPago:jo(v),cuenta:f("#ef-cuenta"),cuentaDestino:x?f("#ef-cuenta-dest")||"default":void 0,activo:$("#ef-activo"),basico:!x&&$("#ef-basico"),sujetoIRPF:!x&&$("#ef-sujetoIRPF"),clasificacion:m==="gasto"?E||null:void 0,tags:x?["transferencia"]:f("#ef-tags").split(",").map(D=>D.trim()).filter(Boolean),escenarioIds:[...v.querySelectorAll(".ef-escenario:checked")].map(D=>D.value)};return h?(t.store.updateItem("expenses",h,_),q("Actualizado")):(t.store.addItem("expenses",_),q("Creado")),o(),!0}function A(v,h){const f=v.querySelector("[data-busqueda]");let $;f==null||f.addEventListener("input",()=>{clearTimeout($),$=setTimeout(()=>{a.busqueda=f.value,h();const m=v.querySelector("[data-busqueda]");m==null||m.focus(),m==null||m.setSelectionRange(m.value.length,m.value.length)},250)}),J(v,"[data-expirados]",m=>{a.mostrarExpirados=m.checked,h()}),J(v,"[data-f-tipo]",m=>{a.tipo=m.value,h()}),J(v,"[data-f-cuenta]",m=>{a.cuenta=m.value,h()}),J(v,"[data-f-desde]",m=>{a.desde=m.value,h()}),J(v,"[data-f-hasta]",m=>{a.hasta=m.value,h()}),N(v,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,h()}),N(v,"[data-limpiar-tags]",()=>{a.tags=new Set,h()}),N(v,"[data-tag]",m=>{const x=m.getAttribute("data-tag");a.tags.has(x)?a.tags.delete(x):a.tags.add(x),h()}),N(v,"[data-orden]",m=>{const x=m.getAttribute("data-orden");a.orden===x?a.sentido=a.sentido===1?-1:1:(a.orden=x,a.sentido=1),h()}),N(v,"[data-nuevo]",()=>g(null,"Nuevo gasto/ingreso",h)),N(v,"[data-editar]",m=>{const x=t.store.get("expenses").find(S=>S._id===m.getAttribute("data-editar"));x&&g(x,"Editar",h)}),N(v,"[data-duplicar]",m=>{const x=t.store.get("expenses").find(E=>E._id===m.getAttribute("data-duplicar"));if(!x)return;const{_id:S,...w}=x;g({...w,concepto:`${x.concepto} (copia)`},"Duplicar movimiento",h)}),N(v,"[data-borrar]",m=>{Z("¿Eliminar?")&&(t.store.removeItem("expenses",m.getAttribute("data-borrar")),q("Eliminado"),o(),h())}),J(v,"[data-activo]",m=>{const x=m;t.store.updateItem("expenses",x.getAttribute("data-activo"),{activo:x.checked}),o(),h()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:ki,mount(v){const h=()=>d(v);d(v),v.dataset.wired!=="1"&&(A(v,h),v.dataset.wired="1")}}}function $e(t,e,a){return t.reduce((o,s)=>{if(s.esAmortizacion)return o;const n=pt(e,a,s.fecha);return o+(n>0?s.interes/n:s.interes)},0)}function Eo(t,e,a,o){return t.reduce((s,n)=>{const i=pt(e,a,n.fecha),r=n.esAmortizacion?n.amortizacion+n.comisionAmort:n.cuota;return s+(i>0?r/i:r)},0)+o}function Vi(t,e,a){const o=t.amortizaciones||[];return o.map((s,n)=>{const i=at({...t,amortizaciones:o.slice(0,n)}),r=at({...t,amortizaciones:o.slice(0,n+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:$e(i.tabla,e,a)-$e(r.tabla,e,a)}})}const na=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${c(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function Ui(t,e){const a=ya(t),o=(t.amortizaciones||[]).length>0,s=e.periodos.length>0,n=e.usarInflacion&&s,i=s?xa(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,r=s?$a(t.tin||0,i):null,l=o&&s?Vi(t,e.periodos,e.hoy):[],u=l.length?$e(a.sinAmort.tabla,e.periodos,e.hoy)-$e(a.tabla,e.periodos,e.hoy):null,b=u===null?null:u-a.costeTotalAmort,d=n?Eo(a.tabla,e.periodos,e.hoy,a.comAp):null,p=n&&o?Eo(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${c(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${c(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(t.tags||[]).map(y=>`<span class="tag">${c(y)}</span>`).join("")}
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
        ${na("Cuota mensual",c(j(a.cuota)),e.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${c(j(e.cuotaMes))}</div>`:"")}
        ${na("Total intereses",c(j(a.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(j(a.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${c(a.fechaFin||"—")}</div>
          ${o&&a.fechaFin!==a.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(a.sinAmort.fechaFin||"—")}${a.ahorroTiempo>0?` (−${a.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${na("Total pagado",c(j(a.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${c(j(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${c(va(a.tae))}</div></div>
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
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${c(je(t.diaPago))}</div></div>`:""}
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

      ${d!==null?Yi(t,a.totalPagado,d,p):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${n?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(y=>Ji(y,n,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((y,g)=>Wi(t._id,y,l[g]??null,e)).join("")}`:""}
    </div>
  </div>`}function Yi(t,e,a,o){const s=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-a,l=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${c(j(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${c(j(a))}</div></div>
        <div><div class="stat-label">${l?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${l?"pos":"neg"}">${l?"−":"+"}${c(j(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${s}
    </div>`}const n=e-a,i=n>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${c(j(e))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${c(j(a))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${c(j(Math.abs(n)))}</div></div>
    </div>
    ${s}
  </div>`}function Ji(t,e,a){let o="";if(e&&!t.esAmortizacion){const s=pt(a.periodos,a.hoy,t.fecha);o=c(j(s>0?t.cuota/s:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":c(t.mes)}</td>
    <td class="num">${c(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":c(j(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${c(j(t.interes))}</td>
    <td class="num">${c(j(t.amortizacion))}</td>
    <td class="num">${c(j(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Wi(t,e,a,o){const s=(e.escenarioIds||[]).map(n=>`<span class="badge badge-yellow">🔭 ${c(o.nombreEscenario(n))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${c(e.fecha)}</span>
    <span class="num">${c(j(e.cantidad))}</span>
    <span class="badge ${e.simulacion?"badge-sim":"badge-active"}">${e.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${e.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${s}
    ${a?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${c(j(a.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${c(j(a.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${c(t)}|${c(e._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${c(t)}|${c(e._id)}">✕</button>
  </div>`}const tt=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,Ht=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([s,n])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(n)}</option>`).join("")}
   </select></div>`,ie=(t,e,a,o="")=>`<label class="form-label">${c(e)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${a?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${c(o)}</span>`:""}`;function re(t,e,a){return t.length===0?"":`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${t.map(o=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${e.includes(o._id)?c(o.color||"var(--accent)"):"var(--border)"}">
            <input type="checkbox" class="${c(a)}" value="${c(o._id)}"${e.includes(o._id)?" checked":""}/>
            ${c(o.nombre)}
          </label>`).join("")}
    </div></div>`}const Ki=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function Qi(t,e,a,o=Y()){return`
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
            <select class="form-select" id="f-cuenta">${Ki(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${wo(t==null?void 0:t.diaPago,"loan")}
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
          ${ie("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${re(a,(t==null?void 0:t.escenarioIds)??[],"loan-escenario")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${ie("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${ie("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${ie("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Xi(t,e,a,o=Y()){return`
    <div class="grid-2">
      ${tt("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??o)}
      ${tt("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Ht("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(e==null?void 0:e.tipo)??"cuota")}
    </div>
    ${re(a,(e==null?void 0:e.escenarioIds)??[],"amort-escenario")}
    <div class="form-row mt-8">
      ${ie("am-sim","Simulación",!!(e!=null&&e.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${c(t)}|${c((e==null?void 0:e._id)??"")}">${e?"Guardar cambios":"Añadir"}</button>
    </div>`}const zo="opt_",_o=t=>String(t).startsWith(zo);function Zi(t){let e=null,a=null;const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content");function n(f,$){const m=o(),x=s();return!m||!x?null:(x.innerHTML=`<div class="modal-title">${c(f)}</div>${$}`,m.classList.remove("hidden"),x)}const i=()=>{var f;return(f=o())==null?void 0:f.classList.add("hidden")};function r(){let f=!1;for(const $ of t.loans()){const m=($.amortizaciones||[]).filter(x=>!_o(x._id));m.length!==($.amortizaciones||[]).length&&(t.guardarAmortizaciones($._id,m),f=!0)}return f}function l(f){try{return f()}catch($){return q($ instanceof Error?$.message:"No se ha podido completar el cálculo","err"),null}}function u(){var E,_;if(!Ya("optimizador")){q("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const f=t.loans().filter(D=>D.activo&&!D.simulacion);if(f.length===0){q("No hay préstamos activos para optimizar","err");return}const $=t.config(),m=t.accounts().filter(D=>D.activo&&!D.simulacion),x=((E=m.find(D=>D.esCuentaPrincipal))==null?void 0:E._id)??((_=m[0])==null?void 0:_._id)??"",S=$.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,w=n("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${m.map(D=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${c(D._id)}"${D._id===x?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(D.nombre)}${D._id===x?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${c(j(rt(D)))}</span>
              </label>`).join("")||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${f.map(D=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
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
        ${Ht("opt-tipo","Efecto de la amortización",[["plazo","Reducir plazo (mantener cuota)"],["cuota","Reducir cuota (mantener plazo)"]],"plazo")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${tt("opt-fecha-primera","Fecha primera amortización","date","")}
        ${tt("opt-fecha-obj","Fecha objetivo para comparar saldo","date",S)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);w&&(b(w),J(w,".opt-acc-radio",()=>b(w)),N(w,"[data-opt-todos]",()=>{const D=[...w.querySelectorAll(".opt-loan-check")],C=D.every(M=>M.checked);D.forEach(M=>M.checked=!C)}),N(w,"[data-cancelar]",i),N(w,"[data-opt-calcular]",()=>g(w)),N(w,"[data-opt-comparar]",()=>I(w)))}function b(f){var w;const $=(w=f.querySelector(".opt-acc-radio:checked"))==null?void 0:w.value,x=(t.config().margenesSeguridad||[]).filter(E=>E.activo!==!1).filter(E=>!E.cuentas||E.cuentas.length===0||$&&E.cuentas.includes($)),S=f.querySelector("#opt-margenes-wrap");S&&(S.innerHTML=x.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':x.map(E=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${c(E._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(E.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!E.cuentas||E.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function d(f){var S,w,E,_;const $=(D,C,M=0)=>{var F;const z=parseFloat(((F=f.querySelector(D))==null?void 0:F.value)??"");return Number.isFinite(z)?Math.max(M,z):C},m=[...f.querySelectorAll(".opt-loan-check")],x=m.filter(D=>D.checked).map(D=>D.value);return{horizonte:Math.round($("#opt-horizonte",60,1)),frecuencia:Math.round($("#opt-frecuencia",1,1)),minAmortizable:$("#opt-min",500),tipoAmort:((S=f.querySelector("#opt-tipo"))==null?void 0:S.value)||"plazo",fechaObjetivo:((w=f.querySelector("#opt-fecha-obj"))==null?void 0:w.value)||null,fechaPrimeraAmort:((E=f.querySelector("#opt-fecha-primera"))==null?void 0:E.value)||null,loanIds:m.length===0||x.length===m.length?null:x,sourceAccountId:((_=f.querySelector(".opt-acc-radio:checked"))==null?void 0:_.value)??null,selectedMarginIds:[...f.querySelectorAll(".opt-margin-check:checked")].map(D=>D.value)}}const p=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function y(f,$=""){const m=n("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${c(f)}</div>
        ${$?`<div class="text-sm mt-8" style="color:var(--text3)">${c($)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);m&&(N(m,"[data-opt-volver]",u),N(m,"[data-cancelar]",i))}function g(f){const $=d(f);r()&&q("Plan anterior eliminado, recalculando…");const{loans:m,expenses:x,accounts:S,config:w,nominas:E}=p(),_=l(()=>Be(m,x,S,w,{frecuencia:$.frecuencia,mesesHorizonte:$.horizonte,minAmortizable:$.minAmortizable,tipoAmort:$.tipoAmort,fechaPrimeraAmort:$.fechaPrimeraAmort,loanIds:$.loanIds,nominas:E,sourceAccountId:$.sourceAccountId,selectedMarginIds:$.selectedMarginIds}));if(!_)return;if(_.plan.length===0){y(`No hay excedente suficiente respetando los ${_.margenesAplicados} márgenes de seguridad activos en los próximos ${$.horizonte} meses para generar amortizaciones por encima del mínimo de ${j($.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}a={plan:_.plan,tipoAmort:$.tipoAmort};const D=`✨ Plan de optimización · ${$.frecuencia===1?"Mensual":`Cada ${$.frecuencia} meses`} · ${$.horizonte}m`,C=n(D,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(j(_.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${c(j(_.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${c(j(_.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${_.margenesAplicados}</div></div>
      </div>
      ${_.resumenPorLoan.map(Po).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${_.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${_.plan.map(M=>Fo(M,!0)).join("")}</tbody>
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
      </div>`);C&&(N(C,"[data-opt-volver]",u),N(C,"[data-cancelar]",i),N(C,"[data-opt-aplicar]",()=>{a&&v(a.plan,a.tipoAmort)}))}function I(f){const $=d(f);r();const{loans:m,expenses:x,accounts:S,config:w,nominas:E}=p(),_=l(()=>Ka(m,x,S,w,{horizonte:$.horizonte,minAmortizable:$.minAmortizable,tipoAmort:$.tipoAmort,fechaObjetivo:$.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:$.fechaPrimeraAmort,loanIds:$.loanIds,nominas:E,sourceAccountId:$.sourceAccountId,selectedMarginIds:$.selectedMarginIds}));if(!_)return;if(_.resultados.length===0){y("No hay excedente suficiente en ninguna frecuencia.");return}e=_;const{resultados:D,saldoBase:C,fechaObjetivo:M}=_,z=D.map(T=>{const R=[T.esMejorIntereses&&"💰 +intereses",T.esMejorSaldo&&"🏦 +saldo",T.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${T.esMejorValor?"background:rgba(46,230,168,0.06);":""}">
          <td style="font-weight:600">${c(T.label)}</td>
          <td class="num">${T.numAmortizaciones}</td>
          <td class="num neg">${c(j(T.totalAmortizado))}</td>
          <td class="num pos">${c(j(T.ahorroIntereses))}</td>
          <td class="num ${T.saldoObjetivo>=C?"pos":"neg"}">${c(j(T.saldoObjetivo))}</td>
          <td class="num pos">${c(j(T.valorTotal))}</td>
          <td style="font-size:11px">${R}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${T.frecuencia}">Usar</button></td>
        </tr>`}).join(""),F=n(`📊 Comparativa de frecuencias · hasta ${M}`,`
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
          <tbody>${z}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);F&&(N(F,"[data-opt-volver]",u),N(F,"[data-cancelar]",i),N(F,"[data-opt-usar]",T=>A(Number(T.getAttribute("data-opt-usar")))))}function A(f){var m;const $=e==null?void 0:e.resultados.find(x=>x.frecuencia===f);$&&(r(),v($.plan,((m=$.plan[0])==null?void 0:m.tipoAmort)||"plazo",{titulo:`✨ Plan ${$.label} · aplicado`,resumen:$,fechaObjetivo:e==null?void 0:e.fechaObjetivo}))}function v(f,$,m){if(f.length===0)return;const x=new Map;for(const w of f){const E=x.get(w.loanId)??[];E.push({_id:`${zo}${w.mes}_${w.loanId}`,fecha:w.fechaAmort,cantidad:w.cantidadAmort,tipo:$,simulacion:!0}),x.set(w.loanId,E)}let S=0;for(const w of t.loans()){const E=x.get(w._id);if(!E)continue;const _=(w.amortizaciones||[]).filter(D=>!_o(D._id));t.guardarAmortizaciones(w._id,[..._,...E]),S+=1}q(`Plan aplicado: ${f.length} amortizaciones en ${S} préstamo${S!==1?"s":""} (simulación)`),m?h(m):i(),t.refrescar([...x.keys()])}function h({titulo:f,resumen:$,fechaObjetivo:m}){const x=n(f,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(j($.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${c(j($.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${c((m==null?void 0:m.slice(0,7))??"")}</div><div class="stat-value pos">${c(j($.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${c(j($.totalComisiones))}</div></div>
      </div>
      ${$.resumenPorLoan.map(Po).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${$.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${$.plan.map(S=>Fo(S,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);x&&N(x,"[data-cancelar]",i)}return{abrir:u,get planManual(){return a},get comparativa(){return e}}}function Fo(t,e){const a=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${c(j(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${c(t.mes)}</td>
    <td>${c(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${c(j(t.capitalAntes))}</td>
    <td class="num neg">${c(j(t.cantidadAmort))}${a}</td>
    <td class="num">${c(j(t.capitalDespues))}</td>
    ${e?`<td class="num" style="color:var(--text3)">${c(j(t.saldoDisponible))} → ${c(j(t.saldoDespues))}</td>`:""}
  </tr>`}function Po(t){return`<div class="card mb-8" style="padding:12px">
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
  </div>`}const tr="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function er(t){const e=t.hoy??Y;let a=!1;const o=new Set;let s=null;const n=()=>{var m;return(m=t.onDatosCambiados)==null?void 0:m.call(t)},i=()=>t.store.get("escenarios"),r=m=>{var x;return((x=i().find(S=>S._id===m))==null?void 0:x.nombre)??m};function l(m){if(!m.activo||m.simulacion)return!1;const x=at(m).tabla.filter(S=>!S.esAmortizacion);return x.length===0?!0:x[x.length-1].fecha<e()}function u(m,x){const S=e(),w=S.slice(0,7),E=new Map;let _=0;for(const D of m){if(!D.activo||D.simulacion||x.has(D._id)||(D.fechaInicio||"")>S)continue;const C=at(D).tabla.filter(z=>!z.esAmortizacion&&z.fecha.startsWith(w)),M=C.length>0?C[0].cuota:0;E.set(D._id,M),_+=M}return{porLoan:E,total:_,activos:[...E.values()].filter(D=>D>0).length}}function b(m){const x=t.store.get("config"),S=x.dashboardStart,w=x.dashboardEnd,E=Math.max(1,(G(w).getTime()-G(S).getTime())/(30.44*864e5));let _=0;for(const D of m)!D.activo||D.simulacion||(_+=at(D).tabla.filter(C=>!C.esAmortizacion&&C.fecha>=S&&C.fecha<=w).reduce((C,M)=>C+M.cuota,0));return{media:_/E,desde:S,hasta:w}}function d(m){const x=[...t.store.get("loans")].sort((z,F)=>F.tin-z.tin),S=new Set(x.filter(l).map(z=>z._id)),w=a?x:x.filter(z=>!S.has(z._id)),E=u(x,S),_=b(x),D=t.store.get("config"),C=t.store.get("inflacion"),M=new Date(G(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});m.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${S.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${S.size})</button>`:""}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${E.total>0||_.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${E.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${c(M)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${c(j(E.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${E.activos} préstamo${E.activos!==1?"s":""} activo${E.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${_.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${c(j(_.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${c(_.desde)} → ${c(_.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${w.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':w.map(z=>Ui(z,{periodos:C,usarInflacion:!!D.usarInflacion,hoy:e(),cuotaMes:E.porLoan.get(z._id)??0,completado:S.has(z._id),nombreEscenario:r})).join("")}
      </div>`;for(const z of m.querySelectorAll("[data-body-loan]"))o.has(z.dataset.bodyLoan??"")&&z.classList.add("open")}const p=()=>document.getElementById("modal-overlay"),y=()=>document.getElementById("modal-content"),g=()=>{var m;return(m=p())==null?void 0:m.classList.add("hidden")};function I(m,x){const S=p(),w=y();return!S||!w?null:(w.innerHTML=`<div class="modal-title">${c(m)}</div>${x}`,S.classList.remove("hidden"),N(w,"[data-cancelar]",g),w)}function A(m,x){const S=m?t.store.get("loans").find(E=>E._id===m)??null:null,w=I(m?"Editar préstamo":"Nuevo préstamo",Qi(S,t.store.get("accounts"),i(),e()));w&&(w.addEventListener("change",E=>{var _;(_=E.target)!=null&&_.matches("[data-dp-modo]")&&Co(w)}),N(w,"[data-guardar-loan]",E=>{v(w,E.getAttribute("data-guardar-loan")||"")&&(g(),x())}))}function v(m,x){const S=z=>{var F;return((F=m.querySelector(z))==null?void 0:F.value)??""},w=z=>{var F;return!!((F=m.querySelector(z))!=null&&F.checked)},E=S("#f-nombre").trim(),_=parseFloat(S("#f-capital")),D=parseFloat(S("#f-tin")),C=parseInt(S("#f-meses"),10);if(!E||!Number.isFinite(_)||!Number.isFinite(D)||!Number.isFinite(C))return q("Completa los campos obligatorios","err"),!1;const M={nombre:E,capital:_,tin:D,meses:C,fechaInicio:S("#f-fecha"),comisionApertura:parseFloat(S("#f-com-ap"))||0,comisionAmort:parseFloat(S("#f-com-am"))||0,diaPago:jo(m),cuenta:S("#f-cuenta"),simulacion:w("#f-sim"),activo:w("#f-activo"),mostrarFechaFinEnDashboard:w("#f-mostrar-fin"),tipoTasa:S("#f-tipo-tasa"),basico:w("#f-basico"),tags:S("#f-tags").split(",").map(z=>z.trim()).filter(Boolean),escenarioIds:[...m.querySelectorAll(".loan-escenario:checked")].map(z=>z.value)};return x?(t.store.updateItem("loans",x,M),q("Préstamo actualizado")):(t.store.addItem("loans",{...M,amortizaciones:[]}),q("Préstamo creado")),n(),!0}function h(m,x,S){const w=t.store.get("loans").find(D=>D._id===m);if(!w)return;const E=x?(w.amortizaciones||[]).find(D=>D._id===x)??null:null,_=I(x?"Editar amortización":"Añadir amortización",Xi(m,E,i(),e()));_&&N(_,"[data-guardar-amort]",D=>{const[C,M]=(D.getAttribute("data-guardar-amort")||"").split("|");f(_,C,M)&&(g(),S([C]))})}function f(m,x,S){var F;const w=T=>{var R;return((R=m.querySelector(T))==null?void 0:R.value)??""},E=w("#am-fecha"),_=parseFloat(w("#am-cant"));if(!E||!Number.isFinite(_)||_<=0)return q("Fecha y cantidad requeridas","err"),!1;const D=t.store.get("loans").find(T=>T._id===x);if(!D)return!1;const C={fecha:E,cantidad:_,tipo:w("#am-tipo"),simulacion:!!((F=m.querySelector("#am-sim"))!=null&&F.checked),escenarioIds:[...m.querySelectorAll(".amort-escenario:checked")].map(T=>T.value)},M=D.amortizaciones||[],z=S?M.map(T=>T._id===S?{...T,...C}:T):[...M,{_id:Date.now().toString(36),...C}];return t.store.updateItem("loans",x,{amortizaciones:z}),q(S?"Amortización actualizada":"Amortización añadida"),n(),!0}function $(m,x,S){N(m,"[data-toggle-finalizados]",()=>{a=!a,x()}),N(m,"[data-nuevo-loan]",()=>A(null,x)),N(m,"[data-optimizar]",()=>S.abrir()),N(m,"[data-toggle-loan]",(w,E)=>{var M;if((M=E.target)!=null&&M.closest("button"))return;const _=w.getAttribute("data-toggle-loan"),D=[...m.querySelectorAll("[data-body-loan]")].find(z=>z.dataset.bodyLoan===_);(D==null?void 0:D.classList.toggle("open"))?o.add(_):o.delete(_)}),N(m,"[data-editar-loan]",w=>A(w.getAttribute("data-editar-loan"),x)),N(m,"[data-borrar-loan]",w=>{if(!Z("¿Eliminar préstamo?"))return;const E=w.getAttribute("data-borrar-loan");t.store.removeItem("loans",E),o.delete(E),q("Eliminado"),n(),x()}),N(m,"[data-amort-loan]",w=>{const E=w.getAttribute("data-amort-loan");o.add(E),h(E,null,x)}),N(m,"[data-editar-amort]",w=>{const[E,_]=(w.getAttribute("data-editar-amort")||"").split("|");o.add(E),h(E,_,x)}),N(m,"[data-borrar-amort]",w=>{const[E,_]=(w.getAttribute("data-borrar-amort")||"").split("|"),D=t.store.get("loans").find(C=>C._id===E);D&&(t.store.updateItem("loans",E,{amortizaciones:(D.amortizaciones||[]).filter(C=>C._id!==_)}),q("Amortización eliminada"),n(),x([E]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:tr,mount(m){const x=(S=[])=>{for(const w of S)o.add(w);d(m)};s??(s=Zi({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(S,w)=>{t.store.updateItem("loans",S,{amortizaciones:w}),n()},hoy:e,refrescar:x})),d(m),m.dataset.wired!=="1"&&($(m,x,s),m.dataset.wired="1")}}}const ar={transporte:125,restaurante:220,otros:null},or={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},sr=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Gt=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,nr=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function ir(t,e){const a=t.map((n,i)=>{const r=e.find(b=>b._id===n.cuenta),l=ar[n.tipo],u=l!=null&&n.importe>l;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${c(or[n.tipo]??n.tipo)}</span>
        <span style="flex:1;font-size:12px">${c(j(n.importe))}/mes${u?` <span style="color:var(--red)" title="Supera el límite orientativo de ${c(j(l))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?c(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function rr(t,e){const a=e.hoy??Y(),o=(t==null?void 0:t.nPagas)??12,s=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Gt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Gt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(n=>`<option value="${n}"${s&&o===n?" selected":""}>${n} pagas</option>`).join("")}
          <option value="custom"${s?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${nr(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
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
              ${sr.map((n,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${c(n)} (${i+1})</option>`).join("")}
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
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??Ne).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${re(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"nom-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Do(t,e){const a=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const l=parseFloat(a(i));return Number.isFinite(l)?l:r},s=a("#nf-npagas"),n=s==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(s,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:n,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Ne),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:e}}function lr(t,e,a,o){const s=Do(t,e),n=e.reduce((v,h)=>v+(h.importe||0)*12,0),i=Math.max(0,s.bruto-n),r=i*(s.ssPct/100),l=s.irpfModo==="manual"?i*(s.irpfPct/100):ut(St(s.bruto,n),a.tramos),u=i-r-l,b=i/s.nPagas,d=r/s.nPagas,p=l/s.nPagas,y=b-d-p,g=s.grupoNomina?a.nominas.filter(v=>v.grupoNomina===s.grupoNomina&&v._id!==o):[],I=g.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${c(s.grupoNomina)}" con ${c(g.map(v=>v.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",A=n>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${c(j(n))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${c(j(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${c(j(s.bruto))}</span>
      ${A}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${c(j(r))} (${s.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${c(j(l))} (${i>0?(l/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${c(j(u))}</span>
      ${n>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${c(j(n))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${c(j(y))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${s.representacion==="simplificado"?`ingreso ${c(j(y))}/paga`:`ingreso ${c(j(b))} − SS ${c(j(d))} − IRPF ${c(j(p))}`}${n>0?" + recargas flex":""}</span>
    </div>${I}`}function cr(t,e,a,o){const s=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=ir(e,a.accounts))},n=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=lr(t,e,a,o))},i=()=>{var l,u;const r=(b,d)=>{const p=t.querySelector(b);p&&(p.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((l=t.querySelector("#nf-npagas"))==null?void 0:l.value)==="custom"),r("#nf-irpfpct-wrap",((u=t.querySelector("#nf-irpfmodo"))==null?void 0:u.value)==="manual"),n()};t.addEventListener("input",r=>{var l;(l=r.target)!=null&&l.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&n()}),J(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),N(t,"[data-flex-anadir]",()=>{var u,b,d;const r=((u=t.querySelector("#fc-tipo"))==null?void 0:u.value)||"transporte",l=parseFloat(((b=t.querySelector("#fc-importe"))==null?void 0:b.value)??"")||0;if(!l)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:r,importe:l,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),s(),n()}),N(t,"[data-flex-borrar]",r=>{e.splice(Number(r.getAttribute("data-flex-borrar")),1),s(),n()}),s(),n()}const To=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function dr(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var p;return(p=o())==null?void 0:p.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??gt;function r(p,y){const g=o(),I=s();return!g||!I?null:(I.innerHTML=`<div class="modal-title">${c(p)}</div>${y}`,g.classList.remove("hidden"),N(I,"[data-cerrar]",n),I)}function l(){e=null;const p=[...t.store.get("tramosIRPFHistorico")].sort((I,A)=>I.año-A.año),y="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos IRPF por ejercicio",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tabla de tramos marginales del IRPF (rendimientos del trabajo) por ejercicio fiscal.
        Si un año no tiene tabla específica se usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${y}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(To(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${p.map(I=>`<div style="${y}">
              <span style="font-weight:600;font-size:13px">${I.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(To(I.tramos))}</span>
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
      </div>`);g&&(N(g,"[data-editar-tabla]",I=>{const A=I.getAttribute("data-editar-tabla");d(A==="default"?"default":Number(A))}),N(g,"[data-borrar-tabla]",I=>{const A=Number(I.getAttribute("data-borrar-tabla"));Z(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(v=>v.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),N(g,"[data-anadir-anyo]",()=>{var v;const I=parseInt(((v=g.querySelector("#irpf-new-year"))==null?void 0:v.value)??"",10);if(!I||I<2e3||I>2100)return q("Año inválido","err");const A=t.store.get("tramosIRPFHistorico");if(A.some(h=>h.año===I))return q("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...A,{_id:Date.now().toString(36),año:I,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(I)}))}function u(){return a.map(([p,y],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${g}" value="${p}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${g}" value="${y}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function b(p){a=[...p.querySelectorAll("[data-tr-min]")].map((g,I)=>{const A=p.querySelector(`[data-tr-pct="${I}"]`);return[parseFloat(g.value)||0,parseFloat((A==null?void 0:A.value)??"")||0]})}function d(p){var h;e=p;const y=t.store.get("tramosIRPFHistorico");a=(p==="default"?i():((h=y.find(f=>f.año===p))==null?void 0:h.tramos)??i()).map(f=>[...f]);const I=p==="default"?"tabla por defecto":`ejercicio ${p}`,A=r(`Tramos IRPF — ${p==="default"?"Por defecto":p}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${c(I)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!A)return;const v=()=>{const f=A.querySelector("#irpf-tramos-rows");f&&(f.innerHTML=u())};N(A,"[data-volver]",l),N(A,"[data-tr-anadir]",()=>{b(A),a.push([0,0]),v()}),N(A,"[data-tr-borrar]",f=>{b(A),a.splice(Number(f.getAttribute("data-tr-borrar")),1),v()}),N(A,"[data-tr-guardar]",()=>{b(A);const f=[...a].sort(($,m)=>$[0]-m[0]);if(f.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:f}),q("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map($=>$.año===e?{...$,tramos:f}:$)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}const No=1500,Dt=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,ur=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([s,n])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(n)}</option>`).join("")}
   </select></div>`,pr=t=>(t.modeloFondo||"cuenta")==="pension";function mr(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(s=>fr(s,e,a,o)).join("")}</div>`}function fr(t,e,a,o){const s=fe(t);if(!s)return"";const n=Te(t,e,a),i=o.slice(0,4),r=(t.aportaciones||[]).filter(u=>u.fecha>=`${i}-01-01`).reduce((u,b)=>u+b.cantidad,0),l=Math.min(r,No)*(n/100);return`<div class="card">
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
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${c(j(s.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(j(s.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${s.beneficio>=0?"pos":"neg"}">${c(j(s.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(j(s.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(j(s.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>No?"neg":""}">${c(j(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${c(j(l))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${c(t.grupoNomina)}": ${n}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${s.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${c(s.proxDesbloqueo)}</div>`:""}
  </div>`}function vr(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function gr(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,s=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],n=!!(t!=null&&t.grupoNomina);return`
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
      ${ur("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${Dt("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${n?' style="display:none"':""}>
        ${Dt("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
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
    ${re(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"pen-escenario")}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function br(t,e,a){const o=()=>{const s=t.querySelector("#pen-aport-container");s&&(s.innerHTML=vr(e))};J(t,"#pen-grupo",s=>{const n=t.querySelector("#pen-impuesto-wrap");n&&(n.style.display=s.value?"none":"")}),N(t,"[data-aport-anadir]",()=>{var n,i,r,l;const s=parseFloat(((n=t.querySelector("#paport-importe"))==null?void 0:n.value)??"")||0;if(!s)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#paport-fin"))==null?void 0:l.value)||""}),o()}),N(t,"[data-aport-borrar]",s=>{e.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function hr(t,e,a,o){var A;const s=v=>{var h;return((h=t.querySelector(v))==null?void 0:h.value)??""},n=(v,h=0)=>{const f=parseFloat(s(v));return Number.isFinite(f)?f:h},i=v=>{var h;return!!((h=t.querySelector(v))!=null&&h.checked)},r=s("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const l=n("#pen-saldo"),u=s("#pen-grupo"),b={nombre:r,grupoNomina:u,saldo:l,saldoInicial:n("#pen-saldo-ini"),fechaInicialSaldo:s("#pen-fecha-ini")||o,interes:n("#pen-interes"),periodoCobro:s("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(s("#pen-bloqueo"),10)||120,impuestoRetirada:u?0:n("#pen-impuesto"),planAportaciones:e,descripcion:s("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(v=>v.value)},d=[...(a==null?void 0:a.historicoSaldos)??[]],p=[...(a==null?void 0:a.aportaciones)??[]],g=((A=[...d].sort((v,h)=>h.fecha.localeCompare(v.fecha))[0])==null?void 0:A.saldo)??(a==null?void 0:a.saldo)??null,I=Date.now().toString(36);return a?(g===null||Math.abs(l-g)>.005)&&(d.push({_id:I,fecha:o,saldo:l,nota:"Actualización manual"}),l>(g??0)&&p.push({_id:`${I}a`,fecha:o,cantidad:l-(g??0)})):l>0&&(d.push({_id:I,fecha:o,saldo:l,nota:"Saldo inicial"}),p.push({_id:`${I}a`,fecha:b.fechaInicialSaldo??o,cantidad:l})),{datos:{...b,historicoSaldos:d,aportaciones:p}}}const yr="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function xr(t){const e=t.hoy??Y,a=()=>{var A;return(A=t.onDatosCambiados)==null?void 0:A.call(t)};function o(){const A=t.store.get("config");return bt(t.store.get("tramosIRPFHistorico"),A.tramos_irpf??gt)(Number(e().slice(0,4)))}function s(A,v,h){const f=Oe(A,v,h),$=!!v&&A.irpfModo!=="manual",m=[A.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${A.mesActualizacionIPC}">IPC m${A.mesActualizacionIPC}</span>`:"",f.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${c(j(f.flexAnual))}/año</span>`:"",Math.abs(f.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${f.ssPct.toFixed(2)}%</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(A.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${m}</div>
      </div>
      <div class="num">${c(j(f.brutoAnual))}
        ${f.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${c(j(f.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${c(j(f.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${f.nPagas} pagas</div>
      <div class="text-sm ${$?"neg":""}">${A.irpfModo==="manual"?`${c(A.irpfPct??0)}% (manual)`:`${f.irpfPct.toFixed(1)}% (auto)`}${$?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${A.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${c(n(A.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${c(A._id)}"${A.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${c(A._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${c(A._id)}">✕</button>
      </div>
    </div>`}const n=A=>{var v;return((v=t.store.get("accounts").find(h=>h._id===(A||"default")))==null?void 0:v.nombre)??(A||"default")};function i(A,v,h){const f=v.reduce((x,S)=>x+(S.bruto||0),0),$=Is(v,h),m=f>0?$/f*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${c(A)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${c(j(f))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${m.toFixed(1)}%</strong> (${c(j($))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${v.map(x=>s(x,v,h)).join("")}
      </div>
    </div>`}function r(A){const v=o(),h=[...t.store.get("nominas")].sort((S,w)=>(w.bruto||0)-(S.bruto||0)),{grupos:f,sueltas:$}=Ss(h),m=t.store.get("accounts").filter(pr),x=h.filter(S=>S.activo!==!1);A.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${h.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...f.entries()].map(([S,w])=>i(S,w,v)).join("")}
      ${$.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${$.map(S=>s(S,null,v)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${mr(m,x,v,e())}</div>`}const l=()=>document.getElementById("modal-overlay"),u=()=>document.getElementById("modal-content"),b=()=>{var A;return(A=l())==null?void 0:A.classList.add("hidden")};function d(A,v){const h=l(),f=u();return!h||!f?null:(f.innerHTML=`<div class="modal-title">${c(A)}</div>${v}`,h.classList.remove("hidden"),N(f,"[data-cancelar]",b),f)}function p(A,v){const h=A?t.store.get("nominas").find(x=>x._id===A)??null:null,f=[...(h==null?void 0:h.retribucionFlexible)??[]].map(x=>({...x})),$={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:o(),hoy:e()},m=d(A?"Editar nómina":"Nueva nómina",rr(h,$));m&&(cr(m,f,$,A??""),N(m,"[data-guardar-nomina]",x=>{const S=Do(m,f);if(!S.nombre||S.bruto<=0)return q("Nombre y bruto anual son obligatorios","err");const w=x.getAttribute("data-guardar-nomina")||"",E={...S,activo:!0,tags:["nomina"]};w?(t.store.updateItem("nominas",w,E),q("Nómina actualizada")):(t.store.addItem("nominas",E),q("Nómina creada")),a(),b(),v()}))}function y(A,v){const h=A?t.store.get("accounts").find(m=>m._id===A)??null:null,f=[...(h==null?void 0:h.planAportaciones)??[]].map(m=>({...m})),$=d(A?"Editar plan de pensiones":"Nuevo plan de pensiones",gr(h,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:e()}));$&&(br($,f,e()),N($,"[data-guardar-pension]",m=>{const{datos:x,error:S}=hr($,f,h,e());if(S)return q(S,"err");const w=m.getAttribute("data-guardar-pension")||"";w?(t.store.updateItem("accounts",w,x),q("Plan actualizado")):(t.store.addItem("accounts",x),q("Plan creado")),a(),b(),v()}))}function g(A,v,h){N(A,"[data-nueva-nomina]",()=>p(null,v)),N(A,"[data-editar-nom]",f=>p(f.getAttribute("data-editar-nom"),v)),N(A,"[data-borrar-nom]",f=>{Z("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",f.getAttribute("data-borrar-nom")),q("Eliminada"),a(),v())}),J(A,"[data-activo-nom]",f=>{const $=f;t.store.updateItem("nominas",$.getAttribute("data-activo-nom"),{activo:$.checked}),a(),v()}),N(A,"[data-tramos]",()=>h.abrir()),N(A,"[data-nueva-pension]",()=>y(null,v)),N(A,"[data-editar-pension]",f=>y(f.getAttribute("data-editar-pension"),v)),N(A,"[data-borrar-pension]",f=>{Z("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",f.getAttribute("data-borrar-pension")),q("Plan eliminado"),a(),v())})}let I=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:yr,mount(A){const v=()=>r(A);I??(I=dr({store:t.store,onDatosCambiados:()=>{a(),v()},año:()=>Number(e().slice(0,4))})),r(A),A.dataset.wired!=="1"&&(g(A,v,I),A.dataset.wired="1")}}}const $r="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Ir="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",Ro={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Ar={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Sr(t,e){const a=t.filter(l=>l.activo&&mt(l)==="inversion");if(a.length===0)return"";let o=0,s=0,n=0,i=0;for(const l of a){const u=Ot(l,e);u&&(o+=u.saldo,s+=u.costBase,n+=u.plusvalia,i+=u.impuesto)}const r=s>0?(n/s*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${c(j(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${c(j(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${c(r)}%)</div><div class="stat-value ${n>=0?"pos":"neg"}">${c(j(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${c(j(i))}</div><div class="stat-sub">Neto: ${c(j(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function Mr(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,s=Math.max(1,(G(o).getTime()-G(a).getTime())/(30.44*864e5)),n=Wt(t,a),i=n*(Math.pow(1+t.interes/100,s/12)-1);let r="";if(e.config.usarInflacion&&e.inflacion.length>0){const l=n*(pt(e.inflacion,a,o)-1),u=i-l;r=`
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
  </div>`}function wr(t,e){const a=Ro[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,s=e.nominas.flatMap(y=>(y.retribucionFlexible??[]).filter(g=>g.cuenta===t._id).map(g=>({nomina:y,importe:g.importe}))),n=s.reduce((y,g)=>y+g.importe,0),i=n*12,r=o!==null&&i>o,l=o!==null?Math.min(i,o):i,u=t.grupoNomina?e.nominas.filter(y=>(y.grupoNomina||"")===t.grupoNomina&&y.activo!==!1):s.slice(0,1).map(y=>y.nomina),b=ja(u,e.tramosIRPF),d=l*b/100,p=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${b}%`:`tipo marginal ${b}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${c(a.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${c(j(n))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${c(j(i))}/año${r?` ⚠ excede límite ${c(j(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${c(j(o))}/año</span></div>`:""}
    ${d>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${c(p)}">≈ ${c(j(d))}/año <span style="font-size:10px;color:var(--text3)">(${c(b)}%)</span></span></div>`:""}
    ${s.length>0?s.map(y=>`<div style="font-size:11px;color:var(--text3)">↩ ${c(y.nomina.nombre)}: ${c(j(y.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function Cr(t){const e=fe(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(j(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(j(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${c(j(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${c(j(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${c(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${c(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function jr(t,e){const a=Ot(t,e.tramosGanancias);if(!a)return"";const o=e.config,s=e.flujos(t._id),n=G(o.dashboardStart),i=G(o.dashboardEnd),r=Math.max(0,(i.getTime()-n.getTime())/(30.44*864e5)),l=a.saldo+s.totalAportaciones-s.totalReembolsos,u=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,b=l>0&&r>0?Math.max(0,l*Math.pow(1+u,r)):Math.max(0,l),d=a.costBase+s.totalAportaciones,p=Math.max(0,b-d),y=De(p,e.tramosGanancias),g=p>0?(y/p*100).toFixed(1):"0",I=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",A=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",v=(S,w,E)=>S.map(_=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${w} ${c(_.contraparte)}: ${c(_.concepto)}</span>
          <span class="num ${E}">${c(j(_.total))} · ${_.ocurrencias} mov.</span>
        </div>`).join(""),f=s.entradas.length>0||s.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${c(o.dashboardStart.slice(0,7))} → ${c(o.dashboardEnd.slice(0,7))})</div>
         ${v(s.entradas,"↓","pos")}
         ${v(s.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${s.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${c(j(s.totalAportaciones))}</span></div>`:""}
           ${s.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${c(j(s.totalReembolsos))}</span></div>`:""}
           ${s.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${c(j(s.retencion))}</span></div>`:s.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',$=e.invModo(t._id),m=S=>`padding:3px 10px;border-radius:20px;border:1px solid ${S?"var(--accent)":"var(--border)"};background:${S?"var(--accent-dim)":"transparent"};color:${S?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,x=$==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(j(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${c(j(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${c(j(a.neto))}</div><div class="stat-sub">${c(A)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${c(j(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${c(j(b))}</div><div class="stat-sub">${c(I)} · ${c(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${c(j(b-y))}</div><div class="stat-sub">${c(g)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${c(t._id)}|real" style="${m($==="real")}">Real</button>
          <button data-inv-modo="${c(t._id)}|proyeccion" style="${m($==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${x}
      ${f}
    </div>`}function Er(t,e){const a=[...t.historicoSaldos||[]].sort((l,u)=>u.fecha.localeCompare(l.fecha)),o=a[0],s=rt(t),n=mt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",n==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",n==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",n==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${c((Ro[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(l=>`<span class="badge badge-yellow">🔭 ${c(e.nombreEscenario(l))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${c(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${c(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${c(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Ir}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${$r}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${c(j(t.saldoInicial||0))}</div><div class="stat-sub">${c(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${c(j(s))}</div>${o?`<div class="stat-sub">Registro: ${c(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${c(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${c(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Mr(t,e)}
    ${n==="beneficio"?wr(t,e):""}
    ${n==="pension"?Cr(t):""}
    ${n==="inversion"?jr(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${c(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${c(t.descripcion)}</div>`:""}
  </div>`}const zr=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function _r(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Fr(t,e){const a=t?mt(t):"cuenta",o=[...new Set(e.nominas.filter(n=>n.grupoNomina).map(n=>n.grupoNomina))],s=n=>n?"":' style="display:none"';return`
    <div class="grid-2">
      ${tt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Ht("ac-modelo","Tipo",zr,a)}
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
            ${Ht("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
        ${re(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"ac-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Pr(t,e,a){const o=()=>{const s=t.querySelector("#ac-aport-container");s&&(s.innerHTML=_r(e))};J(t,"#ac-modelo",s=>{const n=s.value,i=(r,l)=>{const u=t.querySelector(r);u&&(u.style.display=l?"":"none")};i("#ac-inversion-hint",n==="inversion"),i("#ac-beneficio-fields",n==="beneficio")}),N(t,"[data-aport-anadir]",()=>{var n,i,r,l;const s=parseFloat(((n=t.querySelector("#aport-importe"))==null?void 0:n.value)??"")||0;if(!s)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#aport-fin"))==null?void 0:l.value)||""}),o()}),N(t,"[data-aport-borrar]",s=>{e.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function Dr(t,e,a,o,s){const n=g=>{var I;return((I=t.querySelector(g))==null?void 0:I.value)??""},i=(g,I=0)=>{const A=parseFloat(n(g));return Number.isFinite(A)?A:I},r=g=>{var I;return!!((I=t.querySelector(g))!=null&&I.checked)},l=n("#ac-nombre").trim();if(!l)return{datos:{},error:"Nombre obligatorio"};const u=n("#ac-modelo")||"cuenta",b=u==="beneficio",d=i("#ac-saldo"),p={nombre:l,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:n("#ac-fecha-ini")||s,interes:i("#ac-interes"),periodoCobro:n("#ac-periodo")||"mensual",descripcion:n("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(g=>g.value),modeloFondo:u,planAportaciones:e,tipoBeneficio:b?n("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:b?n("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&d<=0)return{datos:p};if(!(o===null||Math.abs(d-o)>.005))return{datos:p};if(u==="inversion"&&d>(o??0)){const g=Date.now().toString(36);p.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${g}a`,fecha:a?s:p.fechaInicialSaldo??s,cantidad:d-(o??0)}]}return{datos:p,punto:{fecha:s,saldo:d,nota:a?"Actualización manual":"Saldo inicial"}}}function ia(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:et(e.saldoCts),nota:e.nota}))}function Tr(t,e,a,o,s){const n=a.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${c(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${c(j(i.saldo))}</span>
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
    </div>`}const Oo=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function Nr(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var p;return(p=o())==null?void 0:p.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Et;function r(p,y){const g=o(),I=s();return!g||!I?null:(I.innerHTML=`<div class="modal-title">${c(p)}</div>${y}`,g.classList.remove("hidden"),N(I,"[data-cerrar]",n),I)}function l(){e=null;const p=[...t.store.get("tramosGananciasCapitalHistorico")].sort((I,A)=>I.año-A.año),y="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos — Ganancias de capital",`
      <div class="text-sm mb-12" style="color:var(--text2)">
        Tramos marginales de la base del ahorro (art. 49 LIRPF): plusvalías de fondos, intereses y dividendos.
        Un ejercicio sin tabla propia usa la más reciente anterior, o la tabla por defecto.
      </div>
      <div style="border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:90px 1fr auto;background:var(--bg3);padding:8px 12px;font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">
          <span>Ejercicio</span><span>Tramos (resumen)</span><span></span>
        </div>
        <div style="${y}">
          <span style="font-weight:600;font-size:13px">Por defecto</span>
          <span class="text-sm" style="color:var(--text2)">${c(Oo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${p.map(I=>`<div style="${y}">
              <span style="font-weight:600;font-size:13px">${I.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(Oo(I.tramos))}</span>
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
      </div>`);g&&(N(g,"[data-editar-tg]",I=>{const A=I.getAttribute("data-editar-tg");d(A==="default"?"default":Number(A))}),N(g,"[data-borrar-tg]",I=>{const A=Number(I.getAttribute("data-borrar-tg"));Z(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(v=>v.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),N(g,"[data-anadir-anyo-tg]",()=>{var v;const I=parseInt(((v=g.querySelector("#tg-new-year"))==null?void 0:v.value)??"",10);if(!I||I<2e3||I>2100)return q("Año inválido","err");const A=t.store.get("tramosGananciasCapitalHistorico");if(A.some(h=>h.año===I))return q("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...A,{_id:Date.now().toString(36),año:I,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(I)}))}function u(){return a.map(([p,y],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${g}" value="${p}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${g}" value="${y}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function b(p){a=[...p.querySelectorAll("[data-tg-min]")].map((y,g)=>{const I=p.querySelector(`[data-tg-pct="${g}"]`);return[parseFloat(y.value)||0,parseFloat((I==null?void 0:I.value)??"")||0]})}function d(p){var v;e=p;const y=t.store.get("tramosGananciasCapitalHistorico");a=(p==="default"?i():((v=y.find(h=>h.año===p))==null?void 0:v.tramos)??i()).map(h=>[...h]);const I=r(`Ganancias de capital — ${p==="default"?"Por defecto":p}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!I)return;const A=()=>{const h=I.querySelector("#tg-rows");h&&(h.innerHTML=u())};N(I,"[data-volver-tg]",l),N(I,"[data-tg-anadir]",()=>{b(I),a.push([0,0]),A()}),N(I,"[data-tg-borrar]",h=>{b(I),a.splice(Number(h.getAttribute("data-tg-borrar")),1),A()}),N(I,"[data-tg-guardar]",()=>{b(I);const h=[...a].sort((f,$)=>f[0]-$[0]);if(h.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:h}),q("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(f=>f.año===e?{...f,tramos:h}:f)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}function Rr(t){function e(){if(t.navegar)return t.navegar("planner");const n=globalThis.Router;n==null||n.navigate("planner")}function a(n,i,r){const l=Ia(n,i,r),u=n.targetAmount||0,b=u>0?Math.min(100,l/u*100):0;return`
      <div style="padding:8px 0;border-bottom:1px solid var(--hairline-soft)">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:500">${c(n.nombre)}</span>
          <span class="num" style="font-size:11px;color:var(--text3)">
            ${c(j(l))} / ${c(j(u))}
          </span>
        </div>
        <div class="goal-bar"><div class="goal-bar-fill" style="width:${b}%;background:${c(n.color||"var(--accent)")}"></div></div>
      </div>`}function o(n){const i=t.store.get("goals");if(i.length===0){n.innerHTML="",n.style.display="none";return}n.style.display="";const r=t.store.get("accounts"),l=t.colchonEnFecha(t.hoy()),u=[...i].sort((b,d)=>(b.prioridad||99)-(d.prioridad||99));n.innerHTML=`
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
      </div>`}function s(n,i){N(n,"[data-ir-planner]",()=>e()),N(n,"[data-descartar-goals]",()=>{const r=t.store.get("goals").length;if(Z(`Se van a borrar ${r} objetivo${r!==1?"s":""} de ahorro antiguos. ¿Seguro?`)){for(const l of[...t.store.get("goals")])t.store.removeItem("goals",l._id);q("Objetivos antiguos descartados"),t.onDatosCambiados(),i()}})}return{render:o,wire:s}}const Or="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",qr=120;function Lr(t){const e=t.hoy??Y,a=()=>{var C;return(C=t.onDatosCambiados)==null?void 0:C.call(t)},o=t.mostrarObjetivos??(()=>!0),s=new Map,n=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),r=C=>{var M;return((M=i().find(z=>z._id===C))==null?void 0:M.nombre)??C},l=C=>{var M;return((M=t.store.get("accounts").find(z=>z._id===C))==null?void 0:M.nombre)??C},u=()=>bt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??gt)(Number(e().slice(0,4))),b=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??Et),d=()=>b()(Number(e().slice(0,4))),p=C=>Ha(t.store.get("expenses"),n(),t.store.get("loans"),C);function y(){const C=n(),M=t.store.get("accounts"),z=Xt({loans:[],expenses:t.store.get("expenses").filter(B=>B.tipo==="transferencia"),accounts:M,config:{dashboardStart:C.dashboardStart,dashboardEnd:C.dashboardEnd,fechaReferencia:C.dashboardStart},nominas:[],resolverTramosGanancias:b()}),F=new Map,T=B=>{let L=F.get(B);return L||(L={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},F.set(B,L)),L},R=(B,L)=>{const k=`${L.sourceId}`,O=B.find(U=>U.concepto===k),H=O??{concepto:k,contraparte:"",total:0,ocurrencias:0};H.total+=Math.abs(L.cuantia),H.ocurrencias+=1,O||B.push(H)};for(const B of z){if(!B.cuenta)continue;const L=T(B.cuenta);B.sourceType==="transfer-in"||B.sourceType==="traspaso-in"?(L.totalAportaciones+=Math.abs(B.cuantia),R(L.entradas,B)):B.sourceType==="transfer-out"||B.sourceType==="traspaso-out"?(L.totalReembolsos+=Math.abs(B.cuantia),R(L.salidas,B)):B.sourceType==="investment-tax"&&(L.retencion+=Math.abs(B.cuantia))}const P=t.store.get("expenses");for(const B of F.values())for(const[L,k]of[[B.entradas,"cuenta"],[B.salidas,"cuentaDestino"]])for(const O of L){const H=P.find(U=>U._id===O.concepto);O.contraparte=l((H==null?void 0:H[k])??"default"),O.concepto=(H==null?void 0:H.concepto)||(k==="cuenta"?"Aportación":"Reembolso")}return F}function g(){const C=new Map,M=n(),z=e(),F=new Date(Number(z.slice(0,4)),Number(z.slice(5,7))-1+qr+1,0),T=`${F.getFullYear()}-${String(F.getMonth()+1).padStart(2,"0")}-${String(F.getDate()).padStart(2,"0")}`;return R=>{const P=C.get(R._id);if(P)return P;const B=Xt({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...M,dashboardStart:z,dashboardEnd:T,fechaReferencia:z},filtroAccounts:[R._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),M.tramos_irpf??gt),resolverTramosGanancias:b()}).map(L=>({fecha:L.fecha,saldoAcum:L.saldoAcum}));return C.set(R._id,B),B}}const I=Rr({store:t.store,colchonEnFecha:p,extractoCuenta:C=>A(C),hoy:e,onDatosCambiados:a});let A=g();function v(C){A=g();const z=t.store.get("accounts").filter(P=>mt(P)!=="pension"),F=y(),T={config:n(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:u(),tramosGanancias:d(),nombreEscenario:r,flujos:P=>F.get(P)??Ar,invModo:P=>s.get(P)??"proyeccion"};C.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${Sr(z,T.tramosGanancias)}
      <div class="grid-3">${z.map(P=>Er(P,T)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const R=C.querySelector("#goals-section");R&&I.render(R)}const h=()=>document.getElementById("modal-overlay"),f=()=>document.getElementById("modal-content"),$=()=>{var C;return(C=h())==null?void 0:C.classList.add("hidden")};function m(C,M){const z=h(),F=f();return!z||!F?null:(F.innerHTML=C?`<div class="modal-title">${c(C)}</div>${M}`:M,z.classList.remove("hidden"),N(F,"[data-cancelar]",$),F)}function x(C,M){const z=C?t.store.get("accounts").find(P=>P._id===C)??null:null,F=[...(z==null?void 0:z.planAportaciones)??[]].map(P=>({...P})),T=z?S(z):null,R=m(C?"Editar cuenta / fondo":"Nueva cuenta / fondo",Fr(z,{escenarios:i(),nominas:t.store.get("nominas"),hoy:e(),saldoActual:T??0}));R&&(Pr(R,F,e()),N(R,"[data-guardar-acc]",P=>{const B=P.getAttribute("data-guardar-acc")||"",{datos:L,punto:k,error:O}=Dr(R,F,z,T,e());if(O)return q(O,"err");let H=B;B?t.store.updateItem("accounts",B,L):H=t.store.addItem("accounts",L)._id,k&&t.ledger.registrarPuntoControl(H,k.fecha,k.saldo,k.nota),q(B?"Actualizada":"Cuenta / fondo creado"),a(),$(),M()}))}function S(C){const M=t.ledger.puntosControl(C._id);return M.length>0?ia(M)[0].saldo:C.saldo??null}function w(C,M){const z=t.store.get("accounts").find(R=>R._id===C);if(!z)return;const F=m("Histórico de saldos",Tr(z.nombre,C,ia(t.ledger.puntosControl(C)),z.saldoInicial||0,e()));if(!F)return;const T=()=>{M(),w(C,M)};N(F,"[data-hist-anadir]",()=>{var L,k,O;const R=((L=F.querySelector("#hi-fecha"))==null?void 0:L.value)??"",P=parseFloat(((k=F.querySelector("#hi-saldo"))==null?void 0:k.value)??""),B=((O=F.querySelector("#hi-nota"))==null?void 0:O.value.trim())??"";if(!R||!Number.isFinite(P))return q("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(C,R,P,B||void 0),q("Punto añadido"),a(),T()}),N(F,"[data-hist-borrar]",R=>{const[,P]=(R.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(P),q("Eliminado"),a(),T()}),N(F,"[data-hist-inicial]",R=>{const[P,B]=(R.getAttribute("data-hist-inicial")||"").split("|"),L=t.ledger.puntosControl(P).find(O=>O._id===B);if(!L)return;const k=ia([L])[0].saldo;t.store.updateItem("accounts",P,{saldoInicial:k,fechaInicialSaldo:L.fecha}),q(`Punto inicial → ${L.fecha} (${j(k)})`),a(),T()})}function E(C){const M=t.store.get("accounts").filter(T=>T.activo);if(M.length===0)return q("No hay cuentas activas","err");const z=e(),F=M.map(T=>`• ${T.nombre}: ${j(S(T)??T.saldoInicial??0)}`).join(`
`);if(Z(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${z})?

${F}

Esto recalibra el punto de arranque del dashboard.`)){for(const T of M)t.store.updateItem("accounts",T._id,{saldoInicial:S(T)??T.saldoInicial??0,fechaInicialSaldo:z});q("Saldo base actualizado"),a(),C()}}function _(C,M,z){N(C,"[data-nueva-acc]",()=>x(null,M)),N(C,"[data-editar-acc]",F=>x(F.getAttribute("data-editar-acc"),M)),N(C,"[data-tramos-ganancias]",()=>z.abrir()),N(C,"[data-reset-base]",()=>E(M)),N(C,"[data-hist-acc]",F=>w(F.getAttribute("data-hist-acc"),M)),N(C,"[data-principal-acc]",F=>{const T=F.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(R=>({...R,esCuentaPrincipal:R._id===T}))),q("Cuenta marcada como principal"),a(),M()}),N(C,"[data-borrar-acc]",F=>{const T=F.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return q("Debe existir al menos una cuenta","err");if(!Z("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",T);const P=t.store.get("accounts");P.length>0&&!P.some(B=>B.esCuentaPrincipal)&&t.store.set("accounts",P.map((B,L)=>L===0?{...B,esCuentaPrincipal:!0}:B)),q("Cuenta eliminada"),a(),M()}),N(C,"[data-inv-modo]",F=>{const[T,R]=(F.getAttribute("data-inv-modo")||"").split("|");s.set(T,R==="real"?"real":"proyeccion"),M()}),I.wire(C,M)}let D=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:Or,mount(C){const M=()=>v(C);D??(D=Nr({store:t.store,onDatosCambiados:()=>{a(),M()},año:()=>Number(e().slice(0,4))})),v(C),C.dataset.wired!=="1"&&(_(C,M,D),C.dataset.wired="1")}}}const ot=(t,e,a="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${a};font-size:12px;padding:5px 10px">${c(j(e))}</td>
  </tr>`,ra=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${c(t)}</td></tr>`;function qo(t){const a=t.capMobiliario!==0||t.gananciasFondos!==0?`${ot("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
       ${ot("Ganancias patrimoniales (fondos/acciones)",t.gananciasFondos,t.gananciasFondos>=0?"var(--text)":"var(--green)",!0)}`:'<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>',o=t.resultado>0?"var(--red)":"var(--green)",s=t.resultado>0?"🔴 A PAGAR":"🟢 A DEVOLVER";return`
    <table style="width:100%;border-collapse:collapse">
      ${ra("RENDIMIENTOS DEL TRABAJO")}
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

      ${ra("BASE DEL AHORRO")}
      ${a}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(j(t.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(j(t.cuotaAho))}</td>
      </tr>

      ${ra("RESULTADO")}
      ${ot("Cuota íntegra total",t.cuotaIntegra,"var(--red)")}
      ${ot("− Retenciones en nómina",-t.retNomina,"var(--green)",!0)}
      ${t.retCapital!==0?ot("− Retenciones de capital mobiliario",-t.retCapital,"var(--green)",!0):""}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${s}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${o}">${c(j(Math.abs(t.resultado)))}</td>
      </tr>
    </table>`}const le=(t,e,a,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${c(e)}</label>
    <input type="number" id="${t}" class="form-input" value="${c(a)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${c(o)}</div>`:""}
  </div>`;function Br(t){const e=t.extras,a=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
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
          ${le("rex-inmobiliario","Capital inmobiliario neto (alquileres − gastos)",e.capInmobiliario??0)}
          ${le("rex-mobiliario","Capital mobiliario (dividendos, intereses)",e.capMobiliario??0)}
          ${le("rex-ganancias","Ganancias / pérdidas patrimoniales (fondos, acciones)",e.gananciasFondos??0,"Positivo = ganancia · Negativo = pérdida compensable")}
          ${le("rex-otras","Otras ganancias a corto plazo (menos de 1 año)",e.otrasCorto??0)}
          ${le("rex-ret-cap","Retenciones de capital ya aplicadas",e.retCapital??0,"Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen")}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${t.nominas.length>0?t.nominas.map(o=>`• ${c(o.nombre)}: ${c(j(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${c(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${qo(t.declaracion)}</div>
      </div>
    </div>`}function Lo(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((a,o)=>a[0]-o[0]).map(([a,o],s,n)=>{const i=s<n.length-1?n[s+1][0]:null,r=i!==null?`${j(a)} – ${j(i)}`:`Más de ${j(a)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${c(r)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${c(o)}%</td>
      </tr>`}).join("")}
  </table>`}const kr=(t,e,a)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${c(e)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${a}</div>
  </div>`,ct=(t,e,a="")=>`<div class="stat-card"><div class="stat-label">${c(t)}</div><div class="stat-value ${a}">${c(e)}</div></div>`,yt=(t,e,a="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${c(t)}</span><span class="num ${a}">${c(e)}</span></div>`;function Hr(t,e,a){const o=t.filter(l=>(l.modeloFondo||"cuenta")==="inversion");if(o.length===0)return kr("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let s=0,n=0,i=0;const r=o.map(l=>{const u=Ot(l,e);if(!u)return"";s+=u.saldo,n+=u.costBase,i+=u.impuesto;const b=u.costBase>0?u.plusvalia/u.costBase*100:0,d=(l.escenarioIds||[]).map(p=>`<span class="badge badge-yellow">🔭 ${c(a(p))}</span>`).join("");return`
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${c(l.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${d}
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
        ${ct("Valor total de la cartera",j(s))}
        ${ct("Total aportado (coste base)",j(n))}
        ${ct("Plusvalía latente total",j(s-n),s-n>=0?"pos":"neg")}
      </div>
      <div class="grid-2" style="gap:8px">
        ${ct("Impuesto estimado si se liquida todo",j(i),"neg")}
        ${ct("Neto tras impuestos (cartera completa)",j(s-i),"pos")}
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
      ${Lo(e)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function Gr(t){const{nominas:e,planes:a,tramos:o}=t,s=y=>y.grupoNomina?e.filter(g=>(g.grupoNomina||"")===y.grupoNomina):null,n=e.map(y=>({n:y,d:Oe(y,s(y),o)})),i=n.reduce((y,g)=>y+g.d.brutoAnual,0),r=n.reduce((y,g)=>y+g.d.irpfAnual,0),l=n.reduce((y,g)=>y+g.d.ssAnual,0),u=n.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':n.map(({n:y,d:g})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${c(y.nombre)}</div>
          ${yt("Bruto anual",j(g.brutoAnual))}
          ${g.flexAnual>0?yt("− Retribución flexible exenta",j(-g.flexAnual),"pos"):""}
          ${yt("− Cotización SS",j(-g.ssAnual),"neg")}
          ${yt(`− IRPF estimado (${g.irpfPct.toFixed(1)} %)`,j(-g.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${c(j(g.baseDineraria-g.ssAnual-g.irpfAnual))}</span>
          </div>
        </div>`).join(""),b=ja(e,o),d=`${t.hoy.slice(0,4)}-01-01`,p=a.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':a.map(y=>{const g=fe(y);if(!g)return"";const I=(y.aportaciones||[]).filter(f=>f.fecha>=d).reduce((f,$)=>f+$.cantidad,0),v=Math.min(I,_t)*b/100,h=I>_t;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${c(y.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${yt("Valor actual",j(g.saldo))}
          ${yt("Coste base (total aportado)",j(g.costBase))}
          ${yt("Revalorización",j(g.beneficio),g.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(t.hoy.slice(0,4))}</div>
            ${yt("Aportado",`${j(I)}${h?" ⚠":""}`,h?"neg":"")}
            ${yt("Límite deducible",j(_t))}
            ${yt(`Ahorro IRPF est. (marginal ${b} %)`,j(v),"pos")}
            ${h?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${c(j(_t))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${g.proxDesbloqueo?`· Próx. desbloqueo: ${c(g.proxDesbloqueo)}`:""}
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
      aportaciones son deducibles hasta <strong>${c(j(_t))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${p}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${Lo(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const Ie=(t,e)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${c(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${c(e)}</div>
  </div>`;function Vr(){return`
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
    </div>`}const Bo=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],Ur="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function Yr(t){const e=t.hoy??Y;let a="declaracion",o={};const s=()=>t.store.get("config"),n=()=>Number(e().slice(0,4)),i=()=>t.store.get("nominas").filter(h=>h.activo),r=()=>t.store.get("accounts").filter(h=>(h.modeloFondo||"cuenta")==="pension"),l=h=>{var f;return((f=t.store.get("escenarios").find($=>$._id===h))==null?void 0:f.nombre)??h},u=()=>bt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??gt)(n()),b=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??Et)(n());function d(){const h=`${n()}-01-01`,f=t.store.get("nominas").filter(x=>x.activo&&!x.simulacion),$=r().reduce((x,S)=>x+(S.aportaciones||[]).filter(w=>w.fecha>=h).reduce((w,E)=>w+E.cantidad,0),0),m=t.store.get("expenses").filter(x=>x.activo&&x.sujetoIRPF&&x.tipo==="ingreso").reduce((x,S)=>x+Ea(S),0);return _a({nominas:f,aportacionesPension:$,otrosIngresos:m,extras:o,tramosGeneral:u(),tramosAhorro:b()})}function p(){const h=u(),f=i(),$=M=>M.grupoNomina?f.filter(z=>(z.grupoNomina||"")===M.grupoNomina):null,m=f.map(M=>Oe(M,$(M),h)),x=m.reduce((M,z)=>M+z.brutoAnual,0),S=m.reduce((M,z)=>M+z.irpfAnual,0),w=m.reduce((M,z)=>M+z.ssAnual,0),E=t.store.get("accounts").filter(M=>(M.modeloFondo||"cuenta")==="inversion");let _=0,D=0;for(const M of E){const z=Ot(M,b());z&&(_+=z.plusvalia,D+=z.impuesto)}if(x<=0&&E.length===0)return"";const C=(M,z,F)=>`<div class="exec-item"><div class="exec-item-label">${c(M)}</div><div class="exec-item-val ${F}">${c(z)}</div></div>`;return`<div class="exec-summary mb-14">
      ${x>0?C("IRPF trabajo",`${j(S)}/año`,"neg"):""}
      ${x>0?C("Neto trabajo",`${j(x-w-S)}/año`,"pos"):""}
      ${E.length>0?C("Plusvalía latente",j(_),_>=0?"pos":"neg"):""}
      ${E.length>0?C("Imp. potencial (inversión)",j(D),"neg"):""}
    </div>`}function y(){return a==="mobiliario"?Hr(t.store.get("accounts"),b(),l):a==="trabajo"?Gr({nominas:i(),planes:r(),tramos:u(),hoy:e()}):a==="inmobiliario"?Vr():Br({año:n(),extras:o,declaracion:d(),nominas:i().map(h=>({nombre:h.nombre,bruto:h.bruto||0})),planes:r().map(h=>h.nombre)})}function g(h,f){const $=a===h;return`<button data-tab-fisc="${h}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${$?"600":"400"};
      color:${$?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${$?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${c(f)}</button>`}function I(h){const f=h.querySelector("#fisc-tabs"),$=h.querySelector("#fisc-tab-content");f&&(f.innerHTML=Bo.map(([m,x])=>g(m,x)).join("")),$&&($.innerHTML=y())}function A(h){h.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${p()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${Bo.map(([f,$])=>g(f,$)).join("")}
      </div>
      <div id="fisc-tab-content">${y()}</div>`}function v(h){N(h,"[data-tab-fisc]",f=>{a=f.getAttribute("data-tab-fisc")||"declaracion",I(h)}),h.addEventListener("input",f=>{var S;if(!((S=f.target)==null?void 0:S.closest("[data-rex]")))return;const m=w=>{var E;return((E=h.querySelector(`#${w}`))==null?void 0:E.value)??"0"};o={capInmobiliario:parseFloat(m("rex-inmobiliario"))||0,capMobiliario:parseFloat(m("rex-mobiliario"))||0,gananciasFondos:parseFloat(m("rex-ganancias"))||0,otrasCorto:parseFloat(m("rex-otras"))||0,retCapital:parseFloat(m("rex-ret-cap"))||0};const x=h.querySelector("#renta-cuadro");x&&(x.innerHTML=qo(d()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:Ur,mount(h){A(h),h.dataset.wired!=="1"&&(v(h),h.dataset.wired="1")}}}const ko=()=>globalThis.Chart??null;function Jr(t,e){const a=ko();if(!a)return null;const o=e.map(s=>({label:s.label,data:s.puntos.map(n=>({x:n.x,y:n.y})),borderColor:s.esBase?"#6b7280":s.color,backgroundColor:s.esBase?"transparent":`${s.color}18`,borderWidth:s.esBase?1.5:2,...s.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new a(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:s=>`${s.dataset.label}: ${j(s.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:s=>j(s)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const Wr=()=>ko()!==null,Tt=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Kr="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function Qr(t){const e=()=>{var x;return(x=t.onDatosCambiados)==null?void 0:x.call(t)},a=new Set;let o=null;const s=()=>t.store.get("config"),n=()=>t.store.get("escenarios"),i=x=>{var S;return x?((S=n().find(w=>w._id===x))==null?void 0:S.nombre)??x:"Base"};function r(x){const S=s(),w=Sa({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(x==null?void 0:x._id)??null),E=a.size>0?w.accounts.filter(M=>!a.has(M._id)):w.accounts,_=a.size>0?E.map(M=>M._id):null,D=x!=null&&x.fechaFin&&x.fechaFin>S.dashboardEnd?x.fechaFin:S.dashboardEnd;return{eventos:Xt({loans:w.loans,expenses:w.expenses,accounts:E,config:{...S,dashboardEnd:D},filtroAccounts:_,nominas:w.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),S.tramos_irpf??gt),resolverTramosGanancias:bt(t.store.get("tramosGananciasCapitalHistorico"),S.tramosGananciasCapital??Et)}),horizonte:D}}function l(x){const S=t.store.get("loans"),w=C=>(C.escenarioIds||[]).includes(x),E=[[S.filter(w).length,"préstamo","préstamos"],[S.flatMap(C=>C.amortizaciones||[]).filter(w).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(w).length,"gasto","gastos"],[t.store.get("accounts").filter(w).length,"cuenta","cuentas"],[t.store.get("nominas").filter(w).length,"nómina","nóminas"]],_=E.reduce((C,[M])=>C+M,0),D=E.filter(([C])=>C>0).map(([C,M,z])=>`${C} ${C===1?M:z}`).join(" · ");return{total:_,texto:D}}function u(x,S){const w=S===x._id,E=x.color||Tt[0],{total:_,texto:D}=l(x._id);return`<div class="card mb-12" style="border-left:3px solid ${c(E)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${c(E)};flex-shrink:0"></div>
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
    </div>`}function b(x){const S=s().dashboardEnd,w=Fe(r(null).eventos,S);return`
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
        <tbody>${x.map(_=>{const{eventos:D}=r(_),C=_.fechaFin||S,M=Fe(D,C),z=M!==null&&w!==null?M-w:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c(_.color||Tt[0])};margin-right:6px"></span>
            ${c(_.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${c(C)}</td>
          <td class="num" style="padding:6px 10px">${M!==null?c(j(M)):"—"}</td>
          <td class="num ${z===null?"":z>=0?"pos":"neg"}" style="padding:6px 10px">
            ${z===null?"—":`${z>=0?"+":""}${c(j(z))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function d(){const x=t.store.get("accounts");return x.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${x.map(w=>{const E=a.has(w._id);return`<button data-toggle-cuenta="${c(w._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${E?"var(--border)":"var(--accent)"};
          background:${E?"transparent":"rgba(99,102,241,0.1)"};
          color:${E?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${E?"text-decoration:line-through;":""}">${c(w.nombre)}</button>`}).join("")}
    </div>`}function p(){if(o){try{o.destroy()}catch{}o=null}}function y(x){const S=s(),w=r(null),E=[{label:"Base (sin supuesto)",color:"#6b7280",esBase:!0,puntos:_e(w.eventos,S.dashboardStart,S.dashboardEnd)}];return x.forEach((_,D)=>{const{eventos:C,horizonte:M}=r(_);E.push({label:_.nombre,color:_.color||Tt[D%Tt.length],puntos:_e(C,S.dashboardStart,M)})}),E}function g(x,S){p();const w=x.querySelector("#chart-comparacion");w&&(o=Jr(w,y(S)))}function I(x){p();const S=new Set(t.store.get("accounts").map(_=>_._id));for(const _ of[...a])S.has(_)||a.delete(_);const w=n(),E=s().escenarioActivo||null;x.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Supuestos</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo supuesto</button></div>
      </div>

      ${E?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${c(i(E))}</span>
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
             </div>`:`<div>${w.map(_=>u(_,E)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de supuestos</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${d()}</div>
               ${Wr()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${b(w)}</div>`}`,w.length>0&&g(x,w)}const A=()=>document.getElementById("modal-overlay"),v=()=>document.getElementById("modal-content"),h=()=>{var x;return(x=A())==null?void 0:x.classList.add("hidden")};function f(x,S){const w=x?n().find(C=>C._id===x)??null:null,E=A(),_=v();if(!E||!_)return;const D=(w==null?void 0:w.color)||Tt[0];_.innerHTML=`
      <div class="modal-title">${x?"Editar supuesto":"Nuevo supuesto"}</div>
      <div class="form-group"><label class="form-label">Nombre del supuesto</label>
        <input class="form-input" type="text" id="esc-nombre" value="${c((w==null?void 0:w.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${c((w==null?void 0:w.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${Tt.map(C=>`<div data-color-esc="${C}" style="width:26px;height:26px;border-radius:50%;background:${C};cursor:pointer;
              border:2px solid ${C===D?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${c(D)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${c((w==null?void 0:w.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${c(x??"")}">${x?"Guardar cambios":"Crear escenario"}</button>
      </div>`,E.classList.remove("hidden"),N(_,"[data-cancelar]",h),N(_,"[data-color-esc]",C=>{const M=C.getAttribute("data-color-esc");_.querySelector("#esc-color").value=M;for(const z of _.querySelectorAll("[data-color-esc]"))z.style.border=z.getAttribute("data-color-esc")===M?"2px solid white":"2px solid transparent"}),N(_,"[data-guardar-esc]",C=>{const M=_.querySelector("#esc-nombre").value.trim();if(!M)return q("El nombre es obligatorio","err");const z={nombre:M,fechaFin:_.querySelector("#esc-fecha-fin").value||null,color:_.querySelector("#esc-color").value||Tt[0],descripcion:_.querySelector("#esc-desc").value.trim()},F=C.getAttribute("data-guardar-esc")||"";F?(t.store.updateItem("escenarios",F,z),q("Escenario actualizado")):(t.store.addItem("escenarios",z),q("Escenario creado")),e(),h(),S()})}function $(x,S){if(!Z("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const w=E=>E.map(_=>({..._,escenarioIds:(_.escenarioIds||[]).filter(D=>D!==x)}));t.store.set("loans",w(t.store.get("loans")).map(E=>({...E,amortizaciones:w(E.amortizaciones||[])}))),t.store.set("expenses",w(t.store.get("expenses"))),t.store.set("nominas",w(t.store.get("nominas"))),t.store.set("accounts",w(t.store.get("accounts"))),s().escenarioActivo===x&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",x),q("Escenario eliminado"),e(),S()}function m(x,S){N(x,"[data-nuevo-esc]",()=>f(null,S)),N(x,"[data-editar-esc]",w=>f(w.getAttribute("data-editar-esc"),S)),N(x,"[data-borrar-esc]",w=>$(w.getAttribute("data-borrar-esc"),S)),N(x,"[data-activar-esc]",w=>{const E=w.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:E}),q(`Escenario "${i(E)}" activado`),e(),S()}),N(x,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),q("Volviendo a la realidad base"),e(),S()}),N(x,"[data-toggle-cuenta]",w=>{const E=w.getAttribute("data-toggle-cuenta");a.has(E)?a.delete(E):a.add(E);const _=x.querySelector("#esc-pastillas");_&&(_.innerHTML=d());const D=n(),C=x.querySelector("#esc-comparativa");C&&(C.innerHTML=b(D)),g(x,D)})}return{id:"escenarios",route:"escenarios",nombre:"Supuestos",flagId:"supuestos",seccion:2,iconoPath:Kr,mount(x){const S=()=>I(x);I(x),x.dataset.wired!=="1"&&(m(x,S),x.dataset.wired="1")},unmount(){p()}}}const Xr=1e-12,Ho=t=>Math.abs(t)<Xr,Go=t=>t/12;function Zr(t,e,a,o){if(a<=0)return Math.max(0,Math.ceil(t-e));const s=t-e;if(s<=0)return 0;const n=Go(o);if(Ho(n))return Math.ceil(s/a);const i=Math.pow(1+n,a),r=(t-e*i)*n/(i-1);return r<=0?0:Math.ceil(r)}function tl(t,e){const a=Go(e);return Ho(a)?0:Math.round(t*a)}function Vo({rentaNetaMensual:t,tasaRetiroSeguro:e,tipoFiscalEfectivo:a}){if(e<=0)throw new RangeError("La tasa de retiro seguro tiene que ser mayor que cero.");if(a>=1)throw new RangeError("El tipo fiscal efectivo no puede llegar al 100 %.");const o=Math.round(t*12/(1-a));return{retiroBrutoAnual:o,capitalNecesario:Math.round(o/e)}}function Uo(t,e){const[a,o]=t.split("-").map(Number),s=a*12+(o-1)+e,n=Math.floor(s/12),i=s%12+1;return`${n}-${String(i).padStart(2,"0")}`}function la(t,e){const[a,o]=t.split("-").map(Number),[s,n]=e.split("-").map(Number);return(s-a)*12+(n-o)}const Yo=t=>Number(t.slice(0,4));function Ae(t){return t.rentaDeseada?Vo(t.rentaDeseada).capitalNecesario:t.importeObjetivo??0}const el={_id:"__sin_vehiculo__"};function Se(t){var h,f,$;const e=Math.max(0,Math.floor(t.horizonteMeses)),a=new Map(t.vehiculos.map(m=>[m._id,m])),o=[...t.objetivos].sort((m,x)=>m.prioridad-x.prioridad).map(m=>({def:m,objetivo:Ae(m),saldo:m.saldoActual,estado:Ae(m)>0&&m.saldoActual>=Ae(m)&&m.modoAsignacion!=="ABSORBE_RESIDUAL"?"COMPLETADO":"PENDIENTE",vehiculo:a.get(m.vehiculoId),aportadoEnAño:0,añoEnCurso:Yo(t.fechaInicio),ultimaSolicitud:0,solicitadoAcumulado:0,mesesReclamando:0})),s=new Map;for(const m of t.eventos){const x=s.get(m.fecha)??[];x.push(m),s.set(m.fecha,x)}const n=[],i=[],r=[];let l=t.perfil.netoMensual,u=t.perfil.gastosFijosMensuales,b=0,d=0;const p=[];for(let m=0;m<e;m++){const x=Uo(t.fechaInicio,m),S=Yo(x);for(const P of s.get(x)??[])if(P.tipo==="CAMBIO_INGRESOS")l=P.importe;else if(P.tipo==="CAMBIO_GASTOS_FIJOS")u=P.importe;else if(P.tipo==="NUEVA_DEUDA")u+=P.importe;else if(P.tipo==="INYECCION_CAPITAL"){const B=P.objetivoDestinoId?o.find(L=>L.def._id===P.objetivoDestinoId):void 0;B?B.saldo+=P.importe:l+=P.importe}for(const P of o)P.añoEnCurso!==S&&(P.añoEnCurso=S,P.aportadoEnAño=0);const w=Math.max(0,l-u),E=Math.round(w*al(t.pctDisfrute));let _=w-E;const D=_,C=o.filter(P=>P.estado!=="COMPLETADO"),M=[];let z=0;const F=C.filter(P=>P.def.modoAsignacion==="ABSORBE_RESIDUAL"),T=C.filter(P=>P.def.modoAsignacion!=="ABSORBE_RESIDUAL");for(const P of T){const B=ol(P,x,m,t);P.ultimaSolicitud=B,B>0&&(P.solicitadoAcumulado+=B,P.mesesReclamando+=1),(P.def.modoAsignacion==="CUOTA_POR_FECHA"||P.def.modoAsignacion==="FIJO")&&(z+=B);const L=Math.max(0,Math.min(B,_));_-=L,P.saldo+=L,P.aportadoEnAño+=L,b+=L,L>0&&P.estado==="PENDIENTE"&&(P.estado="EN_CURSO"),M.push({objetivoId:P.def._id,asignado:L,solicitado:B,saldoTrasMes:P.saldo})}if(F.length>0&&_>0){const P=F.map(k=>Math.max(0,k.def.pesoResidual??1)),B=P.reduce((k,O)=>k+O,0)||F.length;let L=0;F.forEach((k,O)=>{const H=O===F.length-1?_-L:Math.floor(_*P[O]/B);L+=H,k.saldo+=H,k.aportadoEnAño+=H,b+=H,H>0&&k.estado==="PENDIENTE"&&(k.estado="EN_CURSO"),M.push({objetivoId:k.def._id,asignado:H,solicitado:0,saldoTrasMes:k.saldo})}),_-=L}else for(const P of F)M.push({objetivoId:P.def._id,asignado:0,solicitado:0,saldoTrasMes:P.saldo});z>D&&p.push({mes:x,deficit:z-D});for(const P of o)P.saldo<=0||(P.saldo+=tl(P.saldo,((h=P.vehiculo)==null?void 0:h.rentabilidadRealAnual)??0));for(const P of o)P.estado!=="COMPLETADO"&&(P.def.modoAsignacion==="ABSORBE_RESIDUAL"&&P.objetivo<=0||P.objetivo>0&&P.saldo>=P.objetivo&&(P.estado="COMPLETADO",i.push({objetivoId:P.def._id,nombre:P.def.nombre,mes:x,indice:m,importeFinal:P.saldo,cuotaLiberada:P.ultimaSolicitud})));for(const P of o)M.some(B=>B.objetivoId===P.def._id)||M.push({objetivoId:P.def._id,asignado:0,solicitado:0,saldoTrasMes:P.saldo});const R=o.reduce((P,B)=>P+B.saldo,0);if(d+=E,n.push({indice:m,mes:x,netoMensual:l,gastosFijos:u,sobrante:w,disfrute:E,disponible:D,sinAsignar:_,asignaciones:M.sort((P,B)=>Jo(o,P.objetivoId)-Jo(o,B.objetivoId)),patrimonioTotal:R}),o.length>0&&o.every(P=>P.estado==="COMPLETADO"))break}const y=[];if(p.length>0){const m=Math.round(p.reduce((x,S)=>x+S.deficit,0)/p.length);r.push({severidad:"error",codigo:"INVIABLE",mensaje:`El plan no cabe en el flujo de caja durante ${p.length} mes${p.length!==1?"es":""} (desde ${p[0].mes}). Déficit medio: ${(m/100).toFixed(2)} €/mes.`,mes:p[0].mes,deficitMensual:m});for(const x of o)x.estado!=="COMPLETADO"&&x.def.fechaLimite&&x.def.modoAsignacion==="CUOTA_POR_FECHA"&&(x.estado="INVIABLE");y.push(...nl(o,t,m))}for(const m of o){const x=(f=m.vehiculo)==null?void 0:f.topeAportacionAnual;x&&m.def.modoAsignacion==="FIJO"&&(m.def.importeFijoMensual??0)*12>x&&r.push({severidad:"atencion",codigo:"TOPE_FISCAL",objetivoId:m.def._id,mensaje:`«${m.def.nombre}» pide ${((m.def.importeFijoMensual??0)/100).toFixed(2)} €/mes, que supera el tope anual de ${(x/100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`})}for(const m of o)m.estado!=="COMPLETADO"&&m.objetivo>0&&m.def.modoAsignacion!=="ABSORBE_RESIDUAL"&&r.push({severidad:"atencion",codigo:"NUNCA_COMPLETADO",objetivoId:m.def._id,mensaje:`«${m.def.nombre}» no se completa dentro del horizonte de ${e} meses.`});const g=o.find(m=>m.def.tipo==="INVERSION_PERPETUA"),I=g?i.find(m=>m.objetivoId===g.def._id):void 0,A={};for(const m of o){const x=(($=m.vehiculo)==null?void 0:$._id)??el._id;A[x]=(A[x]??0)+m.saldo}const v={};for(const m of o)v[m.def._id]=m.estado;return{viable:p.length===0,mesesSimulados:n.length,serieMensual:n,hitos:i,fases:sl(n,i),avisos:r,propuestas:y,estadoFinal:v,resumen:{patrimonioFinal:o.reduce((m,x)=>m+x.saldo,0),patrimonioPorVehiculo:A,totalAportado:b,totalDisfrute:d,mesIndependencia:(I==null?void 0:I.mes)??null}}}const al=t=>Number.isFinite(t)?Math.min(1,Math.max(0,t)):0,Jo=(t,e)=>t.findIndex(a=>a.def._id===e);function ol(t,e,a,o){var n,i;const s=Math.max(0,t.objetivo-t.saldo);switch(t.def.modoAsignacion){case"ABSORBE_TODO":return s;case"FIJO":{const r=t.def.importeFijoMensual??0,l=(n=t.vehiculo)==null?void 0:n.topeAportacionAnual;if(!l)return t.objetivo>0?Math.min(r,s):r;const u=Math.max(0,l-t.aportadoEnAño),b=Math.min(r,u);return t.objetivo>0?Math.min(b,s):b}case"CUOTA_POR_FECHA":{if(s<=0)return 0;const r=t.def.fechaLimite?la(e,t.def.fechaLimite):o.horizonteMeses-a;return Zr(t.objetivo,t.saldo,Math.max(0,r),((i=t.vehiculo)==null?void 0:i.rentabilidadRealAnual)??0)}default:return 0}}function sl(t,e){if(t.length===0)return[];const o=[0,...[...new Set(e.map(n=>n.indice))].sort((n,i)=>n-i).map(n=>n+1)].filter((n,i,r)=>r.indexOf(n)===i&&n<t.length),s=[];for(let n=0;n<o.length;n++){const i=o[n],r=(n+1<o.length?o[n+1]:t.length)-1;if(r<i)continue;const l=new Set;for(let u=i;u<=r;u++)for(const b of t[u].asignaciones)b.asignado>0&&l.add(b.objetivoId);s.push({desde:t[i].mes,hasta:t[r].mes,meses:r-i+1,objetivosActivos:[...l]})}return s}function nl(t,e,a){const o=[],s=Math.max(0,e.perfil.netoMensual-e.perfil.gastosFijosMensuales);if(s>0&&e.pctDisfrute>0){const l=Math.ceil(Math.min(e.pctDisfrute,a/s)*100);if(l>0){const u=Math.round(e.pctDisfrute*100);o.push({clase:"REDUCIR_DISFRUTE",magnitud:l,mensaje:`Bajar el disfrute ${l} punto${l!==1?"s":""} (del ${u} % al ${Math.max(0,u-l)} %) libera ${(Math.min(a,s*e.pctDisfrute)/100).toFixed(0)} €/mes.`})}}const n=t.filter(l=>l.def.modoAsignacion==="CUOTA_POR_FECHA"&&l.def.fechaLimite&&l.estado!=="COMPLETADO"),i=l=>l.mesesReclamando>0?l.solicitadoAcumulado/l.mesesReclamando:0,r=[...n].sort((l,u)=>i(u)-i(l))[0];if(r){const l=Math.max(0,r.objetivo-r.saldo),u=i(r),b=Math.max(1,la(e.fechaInicio,r.def.fechaLimite)),d=Math.max(1,u-a),p=Math.ceil(l/d),y=Math.max(1,p-b);o.push({clase:"RETRASAR_FECHA",objetivoId:r.def._id,magnitud:y,mensaje:`Retrasar «${r.def.nombre}» ${y} mes${y!==1?"es":""}, hasta ${Uo(r.def.fechaLimite,y)}, baja su cuota a lo que cabe en el flujo.`});const g=Math.min(Math.round(a*b),Math.max(0,r.objetivo-1));g>0&&o.push({clase:"REDUCIR_IMPORTE",objetivoId:r.def._id,magnitud:g,mensaje:`O reducir «${r.def.nombre}» en ${(g/100).toFixed(0)} €, de ${(r.objetivo/100).toFixed(0)} € a ${((r.objetivo-g)/100).toFixed(0)} €.`})}return n.length>1&&o.push({clase:"REORDENAR",magnitud:n.length,mensaje:`Hay ${n.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`}),o.length===0&&o.push({clase:"REDUCIR_IMPORTE",magnitud:a,mensaje:`Faltan ${(a/100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`}),o}const il=()=>globalThis.Chart??null,Me=["#2ee6a8","#4d9fff","#a855f7","#f97316","#eab308","#22d3ee","#fb7185","#34d399"],Wo=new WeakMap;function rl(t,e,a){const o=il();if(!o)return null;const s=Wo.get(t);if(s)try{s.destroy()}catch{}const n=new Map,i=new Map(e.objetivos.map(y=>[y._id,y.vehiculoId])),r=new Set(e.objetivos.map(y=>y.vehiculoId));for(const y of r)n.set(y,[]);for(const y of a.serieMensual){const g=new Map;for(const I of y.asignaciones){const A=i.get(I.objetivoId);A&&g.set(A,(g.get(A)??0)+I.saldoTrasMes)}for(const I of r)n.get(I).push((g.get(I)??0)/100)}const l=y=>{var g;return((g=e.vehiculos.find(I=>I._id===y))==null?void 0:g.nombre)??"Sin vehículo"},u=[...r],b=u.map((y,g)=>a.serieMensual.map((I,A)=>u.slice(0,g+1).reduce((v,h)=>v+(n.get(h)[A]??0),0))),d=u.map((y,g)=>({label:l(y),data:b[g],borderColor:Me[g%Me.length],backgroundColor:`${Me[g%Me.length]}33`,fill:g===0?"origin":"-1",borderWidth:1.5,pointRadius:0,tension:.25})),p=new o(t,{type:"line",data:{labels:a.serieMensual.map(y=>y.mes),datasets:d},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#a9b6cc",font:{size:11},boxWidth:12}},tooltip:{backgroundColor:"#111a28",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#a9b6cc",bodyColor:"#eef3fb",callbacks:{label:y=>{const g=y.datasetIndex>0?y.chart.data.datasets[y.datasetIndex-1].data[y.dataIndex]??0:0;return` ${y.dataset.label}: ${j(y.parsed.y-g)}`}}}},scales:{x:{ticks:{color:"#6b7b96",maxTicksLimit:12},grid:{display:!1}},y:{ticks:{color:"#6b7b96",callback:y=>j(y)},grid:{color:"rgba(255,255,255,0.07)"}}}}});return Wo.set(t,p),p}const ca=t=>j(t/100),ll={CUOTA_POR_FECHA:"Cuota para llegar a la fecha",ABSORBE_TODO:"Se lleva todo lo disponible",ABSORBE_RESIDUAL:"Recibe lo que sobre",FIJO:"Importe fijo al mes"},cl={CUOTA_POR_FECHA:"Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.",ABSORBE_RESIDUAL:"No reclama nada; recoge lo que quede tras servir a los de prioridad superior.",FIJO:"Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene."},Ko={COMPLETADO:"var(--accent)",EN_CURSO:"var(--text)",PENDIENTE:"var(--text3)",INVIABLE:"var(--red)"};function dl(t,e){if(t.objetivos.length===0)return`<div class="card" style="text-align:center;padding:34px 20px">
      <div style="font-size:26px;margin-bottom:10px">🎯</div>
      <div class="card-title" style="margin-bottom:6px">Todavía no hay objetivos</div>
      <div class="text-sm" style="color:var(--text2);max-width:52ch;margin:0 auto;line-height:1.7">
        Un objetivo es algo a lo que quieres llegar —amortizar el coche, la entrada de un piso, un colchón—
        con un importe y, si la tiene, una fecha. Compiten por el mismo dinero cada mes, y cuando uno se
        completa su cuota pasa sola al siguiente.
      </div>
    </div>`;const a=[...t.objetivos].sort((n,i)=>n.prioridad-i.prioridad),o=e.serieMensual[0],s=n=>t.vehiculos.find(i=>i._id===n);return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      El orden es la <strong>prioridad</strong>: el de arriba se sirve primero y los de abajo reciben lo que quede.
      La columna «pide ahora» es lo que cada objetivo está reclamando este mes.
      <br>Arrastra las tarjetas para reordenarlas.
    </div>
    ${a.map(n=>{var i;return ul(n,e,o,(i=s(n.vehiculoId))==null?void 0:i.nombre)}).join("")}`}function ul(t,e,a,o){const s=Ae(t),n=e.estadoFinal[t._id]??t.estado,i=a==null?void 0:a.asignaciones.find(d=>d.objetivoId===t._id),r=(i==null?void 0:i.solicitado)??0,l=e.hitos.find(d=>d.objetivoId===t._id),u=s>0?Math.min(100,t.saldoActual/s*100):0,b=e.avisos.filter(d=>d.objetivoId===t._id);return`
    <div class="card mb-10" draggable="true" data-pl-objetivo="${c(t._id)}"
         style="padding:14px 16px;border-left:3px solid ${Ko[n]??"var(--text3)"};cursor:grab">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span title="Arrastra para cambiar la prioridad" style="color:var(--text3);cursor:grab;user-select:none">⠿</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3)">#${c(t.prioridad)}</span>
            <span style="font-weight:700;font-size:14px">${c(t.nombre)}</span>
            <span class="badge" style="font-size:10px;background:var(--bg3);color:var(--text2)">${c(ll[t.modoAsignacion])}</span>
            ${n==="INVIABLE"?'<span class="badge badge-red" style="font-size:10px">no llega</span>':""}
            ${n==="COMPLETADO"?'<span class="badge badge-green" style="font-size:10px">completado</span>':""}
          </div>
          <div class="text-sm" style="color:var(--text3);margin-top:4px">${c(cl[t.modoAsignacion])}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:17px;font-weight:700">${c(s>0?ca(s):"— sin meta —")}</div>
          ${t.fechaLimite?`<div class="text-sm" style="color:var(--text3)">para ${c(t.fechaLimite)}</div>`:""}
          <button class="btn-secondary btn-sm" data-pl-editar-objetivo="${c(t._id)}" style="margin-top:6px;font-size:11px;padding:2px 9px">Editar</button>
        </div>
      </div>

      ${s>0?`<div class="goal-bar" style="margin-top:10px"><div class="goal-bar-fill" style="width:${u.toFixed(1)}%;background:${Ko[n]??"var(--accent)"}"></div></div>`:""}

      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:12px">
        <div><span style="color:var(--text3)">Pide ahora:</span> <strong style="font-family:var(--font-mono)">${c(ca(r))}</strong>/mes</div>
        <div><span style="color:var(--text3)">Ya acumulado:</span> <span style="font-family:var(--font-mono)">${c(ca(t.saldoActual))}</span></div>
        ${o?`<div><span style="color:var(--text3)">Vehículo:</span> ${c(o)}</div>`:""}
        ${l?`<div><span style="color:var(--text3)">Se completa:</span> <strong style="color:var(--accent)">${c(l.mes)}</strong></div>`:""}
      </div>

      ${b.length>0?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${b.map(d=>`⚠ ${c(d.mensaje)}`).join("<br>")}
             </div>`:""}
      ${t.notas?`<div class="text-sm" style="color:var(--text3);margin-top:8px;white-space:pre-wrap">${c(t.notas)}</div>`:""}
    </div>`}const dt=t=>(t/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}),Qo=[{id:"venta-vivienda",nombre:"Venta de vivienda",icono:"🏠",descripcion:"Lo que queda de verdad tras cancelar la hipoteca y pagar impuestos y gastos. Suele ser bastante menos que el precio de venta.",tipo:"INYECCION_CAPITAL",campos:[{id:"precio",etiqueta:"Precio de venta (€)",ayuda:"Lo que te paga el comprador"},{id:"hipoteca",etiqueta:"Hipoteca pendiente (€)",ayuda:"Capital vivo el día de la firma"},{id:"gastos",etiqueta:"Impuestos y gastos (€)",ayuda:"Plusvalía municipal, IRPF de la ganancia, agencia, notaría"}],calcular:t=>Math.max(0,(t.precio??0)-(t.hipoteca??0)-(t.gastos??0)),resumir:t=>`Venta ${dt(t.precio??0)} € − hipoteca ${dt(t.hipoteca??0)} € − gastos ${dt(t.gastos??0)} €`},{id:"nueva-hipoteca",nombre:"Nueva hipoteca",icono:"🔑",descripcion:"Sube tus gastos fijos con la cuota nueva. Normalmente va en la misma fecha que la venta.",tipo:"NUEVA_DEUDA",campos:[{id:"cuota",etiqueta:"Cuota mensual (€)",ayuda:"Se suma a tus gastos fijos a partir de ese mes"}],calcular:t=>t.cuota??0,resumir:t=>`Cuota de ${dt(t.cuota??0)} €/mes`},{id:"hijo",nombre:"Llegada de un hijo",icono:"👶",descripcion:"Fija tus gastos fijos en un valor nuevo. Si el gasto sube por etapas, crea varios eventos seguidos.",tipo:"CAMBIO_GASTOS_FIJOS",campos:[{id:"actuales",etiqueta:"Gastos fijos actuales (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"incremento",etiqueta:"Incremento mensual (€)",ayuda:"Guardería, ropa, sanidad…"}],calcular:t=>(t.actuales??0)+(t.incremento??0),resumir:t=>`Gastos fijos ${dt(t.actuales??0)} € → ${dt((t.actuales??0)+(t.incremento??0))} €/mes`},{id:"subida-sueldo",nombre:"Subida de sueldo",icono:"📈",descripcion:"Fija tu neto mensual en un valor nuevo desde ese mes.",tipo:"CAMBIO_INGRESOS",campos:[{id:"actual",etiqueta:"Neto mensual actual (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"subida",etiqueta:"Subida mensual neta (€)",ayuda:"Lo que te llega a la cuenta, no el bruto"}],calcular:t=>(t.actual??0)+(t.subida??0),resumir:t=>`Neto ${dt(t.actual??0)} € → ${dt((t.actual??0)+(t.subida??0))} €/mes`},{id:"inyeccion",nombre:"Entrada de dinero",icono:"💰",descripcion:"Una herencia, un bonus, la venta de un coche. Puede ir dirigida a un objetivo concreto.",tipo:"INYECCION_CAPITAL",campos:[{id:"importe",etiqueta:"Importe (€)"}],calcular:t=>t.importe??0,resumir:t=>`Entrada de ${dt(t.importe??0)} €`}],pl=t=>Qo.find(e=>e.id===t);function ml(t,e){switch(t.tipo){case"INYECCION_CAPITAL":return`Entra ${dt(t.importe)} €${e?` → «${e}»`:" al reparto general"}`;case"CAMBIO_INGRESOS":return`El neto mensual pasa a ${dt(t.importe)} €`;case"CAMBIO_GASTOS_FIJOS":return`Los gastos fijos pasan a ${dt(t.importe)} €/mes`;case"NUEVA_DEUDA":return`Los gastos fijos suben ${dt(t.importe)} €/mes`}}function fl(t,e,a,o){const s=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,n=new Map(t.vehiculos.map(r=>[r._id,`veh_${s()}`])),i=new Map(t.objetivos.map(r=>[r._id,`obj_${s()}`]));return{...t,_id:a,nombre:e,activo:!1,creadoEn:o,vehiculos:t.vehiculos.map(r=>({...r,_id:n.get(r._id)})),objetivos:t.objetivos.map(r=>({...r,_id:i.get(r._id),vehiculoId:n.get(r.vehiculoId)??r.vehiculoId})),eventos:t.eventos.map(r=>({...r,_id:`ev_${s()}`,objetivoDestinoId:r.objetivoDestinoId?i.get(r.objetivoDestinoId)??null:null}))}}function vl(t){return[...new Set(t.flatMap(a=>a.hitos.map(o=>o.nombre)))].map(a=>{const o=t.map(i=>i.hitos.find(r=>r.nombre===a)??null),s=o.map(i=>i?i.indice:null),n=s[0];return{nombre:a,meses:o.map(i=>i?i.mes:null),diferencias:s.map(i=>i!==null&&n!==null?i-n:null)}})}const gl=t=>j(t/100),bl={INYECCION_CAPITAL:"💰",CAMBIO_GASTOS_FIJOS:"🏷️",CAMBIO_INGRESOS:"📈",NUEVA_DEUDA:"🔑"};function hl(t){const e=[...t.eventos].sort((o,s)=>o.fecha.localeCompare(s.fecha)),a=o=>{var s;return o?(s=t.objetivos.find(n=>n._id===o))==null?void 0:s.nombre:void 0};return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      Los eventos son los cambios de vida que mueven el plan de verdad: una venta, una hipoteca nueva, un hijo,
      un ascenso. Se aplican <strong>al principio del mes</strong> que indiques.
    </div>

    <div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Añadir</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${Qo.map(o=>`<button class="btn-secondary btn-sm" data-pl-plantilla="${c(o.id)}"
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
             ${e.map(o=>yl(o,t,a(o.objetivoDestinoId))).join("")}
           </div>`}`}function yl(t,e,a){const o=la(e.fechaInicio,t.fecha),s=o<0?"antes del inicio del plan":o===0?"en el primer mes":`dentro de ${o} mes${o!==1?"es":""}`,n=o<0||o>=e.horizonteMeses;return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:16px;flex-shrink:0;width:24px;text-align:center">${bl[t.tipo]}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--accent)">${c(t.fecha)}</span>
          <span style="font-size:11px;color:var(--text3)">${c(s)}</span>
          ${n?'<span class="badge badge-yellow" style="font-size:10px">fuera del horizonte</span>':""}
        </div>
        <div style="font-size:12px;margin-top:3px">${c(ml(t,a))}</div>
        ${t.notas?`<div style="font-size:11px;color:var(--text3);margin-top:2px">${c(t.notas)}</div>`:""}
      </div>
      <div style="display:flex;gap:5px;flex-shrink:0">
        <button class="btn-secondary btn-sm" data-pl-editar-evento="${c(t._id)}" style="font-size:11px;padding:2px 9px">Editar</button>
      </div>
    </div>`}function xl(t,e,a,o){const s=t.campos.map(i=>{const r=o[i.id];return`<div class="form-group">
        <label class="form-label" for="ev-${c(i.id)}">${c(i.etiqueta)}</label>
        <input class="form-input" type="number" step="0.01" id="ev-${c(i.id)}" value="${r!==void 0?(r/100).toFixed(2):""}">
        ${i.ayuda?`<div class="text-sm mt-4" style="color:var(--text3)">${c(i.ayuda)}</div>`:""}
      </div>`}).join(""),n=[["","— al reparto general —"],...a.objetivos.map(i=>[i._id,i.nombre])];return`
    <div class="text-sm mb-14" style="color:var(--text2);line-height:1.7">${t.icono} ${c(t.descripcion)}</div>

    <div class="form-group">
      <label class="form-label" for="ev-fecha">Mes en que ocurre</label>
      <input class="form-input" type="month" id="ev-fecha" value="${c((e==null?void 0:e.fecha)??a.fechaInicio)}">
    </div>

    ${s}

    <div class="card mb-12" style="background:var(--bg3);padding:10px 12px">
      <div class="text-sm" style="color:var(--text3)">Importe que se aplicará</div>
      <div id="ev-resultado" style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--accent);margin-top:2px">—</div>
    </div>

    ${t.tipo==="INYECCION_CAPITAL"?`<div class="form-group">
             <label class="form-label" for="ev-destino">¿A qué objetivo va?</label>
             <select class="form-input" id="ev-destino">
               ${n.map(([i,r])=>`<option value="${c(i)}"${i===((e==null?void 0:e.objetivoDestinoId)??"")?" selected":""}>${c(r)}</option>`).join("")}
             </select>
             <div class="text-sm mt-4" style="color:var(--text3)">
               Dirigida a un objetivo lo completa antes y libera su cuota; al reparto general entra como ingreso extra de ese mes.
             </div>
           </div>`:""}

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${e?'<button class="btn-secondary" data-ev-borrar style="color:var(--red)">Borrar</button>':""}
      <button class="btn-secondary" data-ev-cancelar>Cancelar</button>
      <button class="btn-primary" data-ev-guardar>${e?"Guardar":"Añadir evento"}</button>
    </div>`}function Xo(t,e){var o;const a={};for(const s of e.campos){const n=((o=t.querySelector(`#ev-${s.id}`))==null?void 0:o.value)??"",i=parseFloat(String(n).replace(",","."));a[s.id]=Number.isFinite(i)?Math.round(i*100):0}return a}const $l=(t,e)=>gl(t.calcular(e)),Il=[-2,-1,0,1,2],Al=[-10,0,10],Sl=[-20,0,20];function Zo(t){return t.hitos.length===0?null:Math.max(...t.hitos.map(e=>e.indice))}function Ml(t,e,a,o,s){const n={};for(const l of o.hitos)n[l.objetivoId]=l.mes;const i=Zo(o),r=s?Zo(s):i;return{etiqueta:t,delta:e,esBase:a,viable:o.viable,hitos:n,desplazamientoMeses:i!==null&&r!==null?i-r:null,patrimonioFinal:o.resumen.patrimonioFinal}}function wl(t,e,a){if(a===0)return t;switch(e){case"rentabilidad":return{...t,vehiculos:t.vehiculos.map(o=>({...o,rentabilidadRealAnual:Math.max(0,o.rentabilidadRealAnual+a/100)}))};case"disfrute":return{...t,pctDisfrute:Math.min(1,Math.max(0,t.pctDisfrute+a/100))};case"ingresos":return{...t,perfil:{...t.perfil,netoMensual:Math.max(0,Math.round(t.perfil.netoMensual*(1+a/100)))}}}}const Cl=t=>t>0?`+${t}`:String(t);function da(t,e,a,o,s,n){const i=Se(t),r=s.map(l=>Ml(l===0?"Plan actual":`${Cl(l)} ${n}`,l,l===0,l===0?i:Se(wl(t,e,l)),i));return{palanca:e,titulo:a,descripcion:o,variantes:r}}function jl(t){return[da(t,"rentabilidad","Rentabilidad de los vehículos","Mueve la rentabilidad real de todos los vehículos a la vez. Es la palanca que menos controlas.",Il,"puntos"),da(t,"disfrute","Porcentaje de disfrute","Lo que apartas para gastar en vez de asignar a objetivos. Es la palanca que más controlas.",Al,"puntos"),da(t,"ingresos","Ingresos","Un ascenso, un cambio de trabajo o una reducción de jornada.",Sl,"%")]}function El(t){if(t===null)return"no comparable";if(t===0)return"sin cambio";const e=Math.abs(t),a=Math.floor(e/12),o=e%12,s=[a>0?`${a} año${a!==1?"s":""}`:"",o>0?`${o} mes${o!==1?"es":""}`:""].filter(Boolean).join(" y ");return t<0?`${s} antes`:`${s} más tarde`}const ts=t=>j(t/100);function zl(t,e,a){return`
    ${_l(t,e)}
    ${t.length>1?Fl(t):""}
    ${Pl(a)}`}function _l(t,e){return`<div class="card mb-14">
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
  </div>`}function Fl(t){const e=t.slice(0,3),a=e.map(r=>({plan:r,res:Se(r)})),o=vl(a.map(({plan:r,res:l})=>({nombre:r.nombre,hitos:l.hitos}))),s=["Hito",...e.map(r=>r.nombre)].map((r,l)=>`<th style="text-align:${l===0?"left":"right"};padding:6px 8px;font-size:11px;color:var(--text3)">${c(r)}</th>`).join(""),n=o.map(r=>`<tr>
      <td style="padding:5px 8px;font-size:12px">${c(r.nombre)}</td>
      ${r.meses.map((l,u)=>{const b=r.diferencias[u],d=b===null||b===0?"var(--text2)":b<0?"var(--accent)":"var(--red)",p=u===0||b===null||b===0?"":`<div style="font-size:10px;color:${d}">${b>0?"+":""}${b} m</div>`;return`<td style="text-align:right;padding:5px 8px;font-family:var(--font-mono);font-size:11px;color:${d}">
            ${c(l??"no llega")}${p}
          </td>`}).join("")}
    </tr>`).join("");return`<div class="card mb-14">
    <div class="card-title mb-10">Comparativa</div>
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">${a.map(({plan:r,res:l})=>`<div style="flex:1;min-width:150px">
      <div style="font-size:11px;color:var(--text3)">${c(r.nombre)}</div>
      <div style="font-family:var(--font-mono);font-size:15px;font-weight:700">${c(ts(l.resumen.patrimonioFinal))}</div>
      <div style="font-size:10px;color:${l.viable?"var(--accent)":"var(--red)"}">${l.viable?"viable":"no cabe en el flujo"}</div>
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
  </div>`}function Pl(t){return t?`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Análisis de sensibilidad</span>
      <button class="btn-secondary btn-sm" data-pl-sensibilidad>Recalcular</button>
    </div>
    ${t.map(Dl).join("")}
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
    </div>`}function Dl(t){return`<div style="margin-bottom:18px">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px">${c(t.titulo)}</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px">${c(t.descripcion)}</div>
    ${t.variantes.map(e=>{const a=e.desplazamientoMeses,o=a===null?"var(--text3)":a===0?"var(--text2)":a<0?"var(--accent)":"var(--red)";return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 0;font-size:12px;${e.esBase?"border-top:1px solid var(--border);border-bottom:1px solid var(--border);":""}">
        <span style="${e.esBase?"font-weight:700":"color:var(--text2)"}">${c(e.etiqueta)}</span>
        <span style="display:flex;gap:14px;align-items:baseline">
          <span style="color:${o};font-size:11px">${c(El(a))}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3);min-width:88px;text-align:right">${c(ts(e.patrimonioFinal))}</span>
        </span>
      </div>`}).join("")}
  </div>`}const At=t=>j(t/100);function Tl(t,e,a=0){return`
    ${Nl(e)}
    ${Rl(t,e)}
    <div class="card mb-14">
      <div class="card-title mb-12">Patrimonio por vehículo</div>
      <div class="chart-wrap-lg"><canvas id="pl-chart"></canvas></div>
    </div>
    ${Ol(e)}
    ${ql(t,e)}
    ${Ll(t,e,a)}`}function Nl(t){if(t.avisos.length===0&&t.propuestas.length===0)return"";const e={error:"var(--red)",atencion:"var(--yellow)",info:"var(--text2)"},a=t.avisos.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:5px">
        <span style="color:${e[i.severidad]};flex-shrink:0">${i.severidad==="error"?"✕":"⚠"}</span>
        <span style="color:var(--text2)">${c(i.mensaje)}</span>
      </div>`).join(""),o=t.propuestas.length>0?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
           <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Cómo hacerlo encajar — elige una:</div>
           ${t.propuestas.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:4px">
             <span style="color:var(--accent);flex-shrink:0">→</span><span style="color:var(--text2)">${c(i.mensaje)}</span>
           </div>`).join("")}
         </div>`:"",s=t.viable?"rgba(255,209,102,0.28)":"rgba(255,77,109,0.3)";return`<div class="card mb-14" style="background:${t.viable?"rgba(255,209,102,0.05)":"rgba(255,77,109,0.05)"};border-color:${s}">
    <div class="card-title mb-8">${t.viable?"Cosas a revisar":"El plan no cabe en tu flujo de caja"}</div>
    ${a}${o}
  </div>`}function Rl(t,e){const a=(s,n,i="")=>`<div class="stat-card">
      <div class="stat-label">${c(s)}</div>
      <div class="stat-value" style="font-size:18px">${c(n)}</div>
      ${i?`<div class="stat-sub">${c(i)}</div>`:""}
    </div>`,o=e.serieMensual[e.serieMensual.length-1];return`<div class="grid-4 mb-14">
    ${a("Patrimonio final",At(e.resumen.patrimonioFinal),o?`en ${o.mes}`:"")}
    ${a("Total aportado",At(e.resumen.totalAportado),`${e.mesesSimulados} meses simulados`)}
    ${a("Total a disfrute",At(e.resumen.totalDisfrute),`${Math.round(t.pctDisfrute*100)} % del sobrante`)}
    ${a("Independencia",e.resumen.mesIndependencia??"—",e.resumen.mesIndependencia?"objetivo perpetuo cubierto":"sin objetivo de independencia")}
  </div>`}function Ol(t){return t.hitos.length===0?`<div class="card mb-14"><div class="card-title mb-8">Hitos</div>
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
  </div>`}function ql(t,e){if(e.fases.length<=1)return"";const a=o=>{var s;return((s=t.objetivos.find(n=>n._id===o))==null?void 0:s.nombre)??o};return`<div class="card mb-14">
    <div class="card-title mb-12">Fases del plan</div>
    <div class="text-sm mb-10" style="color:var(--text3)">Tramos entre hitos: en cada uno el dinero se reparte de forma distinta.</div>
    ${e.fases.map((o,s)=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);flex-shrink:0;width:26px">${s+1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${c(o.desde)} → ${c(o.hasta)} <span style="color:var(--text3);font-weight:400">(${o.meses} mes${o.meses!==1?"es":""})</span></div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">${c(o.objetivosActivos.map(a).join(" · ")||"sin asignaciones")}</div>
        </div>
      </div>`).join("")}
  </div>`}const ce=60;function Ll(t,e,a=0){if(e.serieMensual.length===0)return"";const o=[...t.objetivos].sort((b,d)=>b.prioridad-d.prioridad),s=Math.ceil(e.serieMensual.length/ce),n=Math.min(Math.max(0,a),s-1),i=e.serieMensual.slice(n*ce,(n+1)*ce),r=["Mes","Disponible",...o.map(b=>b.nombre),"Sin asignar","Patrimonio"].map(b=>`<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${c(b)}</th>`).join(""),l=i.map(b=>{const d=o.map(p=>{const y=b.asignaciones.find(I=>I.objetivoId===p._id),g=(y==null?void 0:y.asignado)??0;return`<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${g>0?"var(--text)":"var(--text3)"}">${c(g>0?At(g):"·")}</td>`}).join("");return`<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${c(b.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${c(At(b.disponible))}</td>
        ${d}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${c(b.sinAsignar>0?At(b.sinAsignar):"·")}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${c(At(b.patrimonioTotal))}</td>
      </tr>`}).join(""),u=s>1?`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap">
           <button class="btn-secondary btn-sm" data-pl-pagina="${n-1}"${n===0?" disabled":""}>← Anteriores</button>
           <span class="text-sm" style="color:var(--text3)">
             Meses ${n*ce+1}–${Math.min((n+1)*ce,e.serieMensual.length)} de ${e.serieMensual.length}
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
        <tbody>${l}</tbody>
      </table>
    </div>
    ${u}
  </div>`}function Bl(t,e){const a=[...t.objetivos].sort((i,r)=>i.prioridad-r.prioridad),o=i=>(i/100).toFixed(2).replace(".",","),s=["Mes","Neto","Gastos fijos","Disfrute","Disponible",...a.map(i=>i.nombre),"Sin asignar","Patrimonio"],n=e.serieMensual.map(i=>[i.mes,o(i.netoMensual),o(i.gastosFijos),o(i.disfrute),o(i.disponible),...a.map(r=>{var l;return o(((l=i.asignaciones.find(u=>u.objetivoId===r._id))==null?void 0:l.asignado)??0)}),o(i.sinAsignar),o(i.patrimonioTotal)].join(";"));return[s.join(";"),...n].join(`
`)}const Vt=t=>{const e=typeof t=="number"?t:parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},de=t=>(t/100).toFixed(2),es=t=>(t*100).toFixed(2),Ut=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?e/100:0},kl=[["AHORRO_OBJETIVO","Ahorrar una cantidad"],["AMORTIZAR_DEUDA","Amortizar deuda"],["INVERSION_PERPETUA","Independencia económica"],["APORTACION_FIJA","Aportación periódica"]],Hl=[["CUOTA_POR_FECHA","Cuota para llegar a la fecha"],["ABSORBE_TODO","Se lleva todo lo disponible"],["ABSORBE_RESIDUAL","Recibe lo que sobre"],["FIJO","Importe fijo al mes"]],Gl=[["INMEDIATA","Inmediata"],["MEDIA","Media (con preaviso o penalización)"],["BLOQUEADA_HASTA_JUBILACION","Bloqueada hasta la jubilación"]],Vl=[["NULO","Nulo"],["BAJO","Bajo"],["MEDIO","Medio"],["ALTO","Alto"]],as={AHORRO_OBJETIVO:"CUOTA_POR_FECHA",AMORTIZAR_DEUDA:"ABSORBE_TODO",INVERSION_PERPETUA:"ABSORBE_RESIDUAL",APORTACION_FIJA:"FIJO"},lt=(t,e,a,o,s="",n="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <input class="form-input" id="${t}" type="${a}" value="${c(o)}" ${n}>
    ${s?`<div class="text-sm mt-4" style="color:var(--text3)">${s}</div>`:""}
  </div>`,Nt=(t,e,a,o,s="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <select class="form-input" id="${t}">
      ${a.map(([n,i])=>`<option value="${c(n)}"${n===o?" selected":""}>${c(i)}</option>`).join("")}
    </select>
    ${s?`<div class="text-sm mt-4" style="color:var(--text3)">${s}</div>`:""}
  </div>`;function Ul(t,e,a){var l,u,b;const o=t===null,s=(t==null?void 0:t.tipo)??"AHORRO_OBJETIVO",n=(t==null?void 0:t.modoAsignacion)??as[s],i=!!(t!=null&&t.rentaDeseada),r=e.length>0?e.map(d=>[d._id,d.nombre]):[["","— no hay vehículos: crea uno primero —"]];return`
    <div class="grid-2" style="gap:10px">
      ${lt("ob-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Entrada del piso"')}
      ${lt("ob-prioridad","Prioridad","number",(t==null?void 0:t.prioridad)??a,"Menor número = se sirve antes",'min="1"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Nt("ob-tipo","Tipo",kl,s)}
      ${Nt("ob-modo","Cómo pide dinero",Hl,n)}
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
            ${lt("ob-renta","Renta neta mensual (€)","number",de(((l=t==null?void 0:t.rentaDeseada)==null?void 0:l.rentaNetaMensual)??2e5),"",'step="0.01"')}
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
        ${lt("ob-importe","Importe objetivo (€)","number",de((t==null?void 0:t.importeObjetivo)??0),"Deja 0 si no tiene meta (un cubo perpetuo)",'step="0.01"')}
      </div>
      ${lt("ob-fecha","Fecha límite","month",(t==null?void 0:t.fechaLimite)??"","Vacío = lo antes posible")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ob-saldo","Ya acumulado (€)","number",de((t==null?void 0:t.saldoActual)??0),"Con lo que arranca el objetivo",'step="0.01"')}
      ${Nt("ob-vehiculo","Vehículo",r,(t==null?void 0:t.vehiculoId)??r[0][0])}
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-fijo" style="display:${n==="FIJO"?"block":"none"}">
        ${lt("ob-fijo","Importe fijo mensual (€)","number",de((t==null?void 0:t.importeFijoMensual)??0),"",'step="0.01"')}
      </div>
      <div id="ob-bloque-residual" style="display:${n==="ABSORBE_RESIDUAL"?"block":"none"}">
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
    </div>`}function Yl(t,e,a){var u;const o=b=>{var d;return((d=t.querySelector(`#${b}`))==null?void 0:d.value)??""},s=o("ob-nombre").trim();if(!s)return null;const n=o("ob-tipo"),i=o("ob-modo"),r=((u=t.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:u.value)==="renta",l=n==="INVERSION_PERPETUA"&&r;return{_id:(e==null?void 0:e._id)??`obj_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:s,tipo:n,importeObjetivo:l?null:Vt(o("ob-importe")),fechaLimite:o("ob-fecha")||null,prioridad:Math.max(1,Number(o("ob-prioridad"))||a),modoAsignacion:i,vehiculoId:o("ob-vehiculo"),saldoActual:Vt(o("ob-saldo")),estado:(e==null?void 0:e.estado)??"PENDIENTE",notas:o("ob-notas"),...i==="FIJO"?{importeFijoMensual:Vt(o("ob-fijo"))}:{},...i==="ABSORBE_RESIDUAL"?{pesoResidual:Math.max(0,Number(o("ob-peso"))||1)}:{},...l?{rentaDeseada:{rentaNetaMensual:Vt(o("ob-renta")),tasaRetiroSeguro:Ut(o("ob-swr")),tipoFiscalEfectivo:Ut(o("ob-fiscal"))}}:{rentaDeseada:null}}}function Jl(t){const e=a=>{var o;return((o=t.querySelector(`#${a}`))==null?void 0:o.value)??""};try{const{capitalNecesario:a}=Vo({rentaNetaMensual:Vt(e("ob-renta")),tasaRetiroSeguro:Ut(e("ob-swr")),tipoFiscalEfectivo:Ut(e("ob-fiscal"))});return`${(a/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0})} €`}catch{return"no calculable con esos parámetros"}}function Wl(t,e,a){const o=t===null,s=!!(t!=null&&t.esDeuda),n=[["","— ninguna —"],...e.map(r=>[r._id,r.nombre])],i=[["","— ninguno —"],...a.map(r=>[r._id,`${r.nombre} (${r.tin} % TIN)`])];return`
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
      ${Nt("ve-prestamo","Préstamo",i,(t==null?void 0:t.prestamoId)??"","Su TIN se usará como rentabilidad")}
    </div>

    ${lt("ve-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Fondo indexado"')}

    <div class="grid-2" style="gap:10px">
      ${lt("ve-rent","Rentabilidad REAL anual (%)","number",es((t==null?void 0:t.rentabilidadRealAnual)??0),"Nominal menos inflación. Un fondo al 7 % nominal con 2 % de inflación son 5 %",'step="0.1"')}
      ${lt("ve-fiscal","Fiscalidad al retirar (%)","number",es((t==null?void 0:t.fiscalidadRetirada)??0),"Tipo efectivo sobre la plusvalía",'step="0.5"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Nt("ve-liquidez","Liquidez",Gl,(t==null?void 0:t.liquidez)??"INMEDIATA")}
      ${Nt("ve-riesgo","Riesgo",Vl,(t==null?void 0:t.riesgo)??"NULO")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ve-tope","Tope de aportación anual (€)","number",t!=null&&t.topeAportacionAnual?de(t.topeAportacionAnual):"","Vacío = sin tope. Pensiones: 1500",'step="0.01"')}
      ${Nt("ve-cuenta","Cuenta asociada",n,(t==null?void 0:t.cuentaId)??"","Enlaza con una cuenta que ya tengas")}
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ve-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ve-cancelar>Cancelar</button>
      <button class="btn-primary" data-ve-guardar>${o?"Crear vehículo":"Guardar"}</button>
    </div>`}function Kl(t,e){var i;const a=r=>{var l;return((l=t.querySelector(`#${r}`))==null?void 0:l.value)??""},o=a("ve-nombre").trim();if(!o)return null;const s=((i=t.querySelector("#ve-deuda"))==null?void 0:i.checked)??!1,n=a("ve-tope").trim();return{_id:(e==null?void 0:e._id)??`veh_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:o,rentabilidadRealAnual:Ut(a("ve-rent")),liquidez:a("ve-liquidez"),fiscalidadRetirada:Ut(a("ve-fiscal")),topeAportacionAnual:n?Vt(n):null,riesgo:a("ve-riesgo"),cuentaId:a("ve-cuenta")||null,prestamoId:s&&a("ve-prestamo")||null,esDeuda:s}}const Ql={CUOTA_POR_FECHA:"Cada mes calcula lo que hace falta para llegar a la fecha, con el saldo que lleva. Si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo lo disponible hasta completarse. Los de menor prioridad no reciben nada mientras tanto.",ABSORBE_RESIDUAL:"No reclama nada: recoge lo que quede tras servir a los de arriba. Es el modo del cubo de largo plazo.",FIJO:"Aporta siempre lo mismo. Si el vehículo tiene tope anual, se aporta hasta agotarlo y se reanuda en enero."},Xl="M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z",os=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},we=t=>(t/100).toFixed(2);function Zl(t){const e=t.hoy??Y;let a="config",o=null,s=0,n=null;function i(){const M=t.store.get("planes");return M.find(z=>z.activo)??M[0]??null}function r(){const M=i();return M||t.store.addItem("planes",{nombre:"Plan base",fechaInicio:e().slice(0,7),horizonteMeses:480,pctDisfrute:0,activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:[],objetivos:[],eventos:[],creadoEn:e()})}function l(M){var F;const z=i();z&&(t.store.updateItem("planes",z._id,M),n=null,o=null,(F=t.onDatosCambiados)==null||F.call(t))}function u(){const z=t.store.get("nominas").filter(R=>R.activo).reduce((R,P)=>R+(P.bruto||0),0),F=Math.round(z*.75/12),T=t.store.get("expenses").filter(R=>R.activo&&R.basico&&R.tipo==="gasto").reduce((R,P)=>R+(P.cuantia||0),0);return{neto:Math.round(F*100),gastos:Math.round(T*100)}}function b(M){return n||(n=Se(M)),n}function d(M){const z=u(),F=Math.max(0,M.perfil.netoMensual-M.perfil.gastosFijosMensuales),T=Math.round(M.pctDisfrute*100);return`
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${c(we(M.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${c(j(z.neto/100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${c(we(M.perfil.gastosFijosMensuales))}">
            <div class="text-sm mt-4" style="color:var(--text3)">Según tus gastos básicos: ~${c(j(z.gastos/100))}/mes</div>
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

      ${p(M)}`}function p(M){return`
      <div class="card">
        <div class="card-title mb-8">Notas del plan</div>
        <textarea class="form-input" id="pl-notas" rows="4" style="resize:vertical;font-family:var(--font-sans)"
          placeholder="Supuestos, decisiones tomadas, cosas a revisar…">${c(M.notas??"")}</textarea>
        <button class="btn-secondary btn-sm mt-8" data-pl-guardar-notas>Guardar notas</button>
      </div>`}const y=()=>document.getElementById("modal-overlay"),g=()=>document.getElementById("modal-content"),I=()=>{var M;return(M=y())==null?void 0:M.classList.add("hidden")};function A(M,z){const F=y(),T=g();return!F||!T?null:(T.innerHTML=`<div class="modal-title">${c(M)}</div>${z}`,F.classList.remove("hidden"),T)}function v(M){l({objetivos:M})}function h(M,z){const F=i();if(!F)return;const T=z?F.objetivos.find(k=>k._id===z)??null:null,R=F.objetivos.reduce((k,O)=>Math.max(k,O.prioridad),0)+1,P=A(T?`Editar «${T.nombre}»`:"Nuevo objetivo",Ul(T,F.vehiculos,R));if(!P)return;const B=()=>{var U;const k=(U=P.querySelector("#ob-modo"))==null?void 0:U.value,O=P.querySelector("#ob-modo-ayuda");O&&k&&(O.textContent=Ql[k]);const H=(K,Q)=>{const st=P.querySelector(K);st&&(st.style.display=Q?"block":"none")};H("#ob-bloque-fijo",k==="FIJO"),H("#ob-bloque-residual",k==="ABSORBE_RESIDUAL")};B();const L=()=>{const k=P.querySelector("#ob-capital-derivado");k&&(k.textContent=Jl(P))};L(),J(P,"#ob-modo",B),J(P,"#ob-tipo",()=>{const k=P.querySelector("#ob-tipo").value,O=P.querySelector("#ob-modo");O&&(O.value=as[k]);const H=P.querySelector("#ob-bloque-perpetua");H&&(H.style.display=k==="INVERSION_PERPETUA"?"block":"none"),B()}),J(P,'input[name="ob-derivar"]',()=>{var U;const k=((U=P.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:U.value)==="renta",O=P.querySelector("#ob-renta-campos"),H=P.querySelector("#ob-bloque-importe");O&&(O.style.display=k?"block":"none"),H&&(H.style.display=k?"none":"block"),L()}),J(P,"#ob-renta, #ob-swr, #ob-fiscal",L),N(P,"[data-ob-cancelar]",I),N(P,"[data-ob-guardar]",()=>{const k=Yl(P,T,R);if(!k){q("El objetivo necesita un nombre","err");return}if(!k.vehiculoId){q("Crea antes un vehículo donde meter el dinero","err");return}const O=F.objetivos.filter(H=>H._id!==k._id);v([...O,k]),I(),q(T?"Objetivo actualizado":`Objetivo «${k.nombre}» creado`),D(M)}),N(P,"[data-ob-borrar]",()=>{T&&Z(`¿Borrar «${T.nombre}»? Esto no se puede deshacer.`)&&(v(F.objetivos.filter(k=>k._id!==T._id)),I(),q("Objetivo borrado"),D(M))})}function f(M,z){const F=i();if(!F)return;const T=z?F.vehiculos.find(L=>L._id===z)??null:null,R=t.store.get("accounts").filter(L=>L.activo).map(L=>({_id:L._id,nombre:L.nombre})),P=t.store.get("loans").filter(L=>L.activo&&!L.simulacion).map(L=>({_id:L._id,nombre:L.nombre,tin:L.tin})),B=A(T?`Editar «${T.nombre}»`:"Nuevo vehículo",Wl(T,R,P));B&&(J(B,"#ve-deuda",()=>{const L=B.querySelector("#ve-deuda").checked,k=B.querySelector("#ve-bloque-prestamo");k&&(k.style.display=L?"block":"none")}),J(B,"#ve-prestamo",()=>{const L=B.querySelector("#ve-prestamo").value,k=P.find(U=>U._id===L);if(!k)return;const O=B.querySelector("#ve-rent"),H=B.querySelector("#ve-nombre");O&&(O.value=String(k.tin)),H&&!H.value.trim()&&(H.value=`Amortizar ${k.nombre}`)}),N(B,"[data-ve-cancelar]",I),N(B,"[data-ve-guardar]",()=>{const L=Kl(B,T);if(!L){q("El vehículo necesita un nombre","err");return}const k=F.vehiculos.filter(O=>O._id!==L._id);l({vehiculos:[...k,L]}),I(),q(T?"Vehículo actualizado":`Vehículo «${L.nombre}» creado`),D(M)}),N(B,"[data-ve-borrar]",()=>{if(!T)return;const L=F.objetivos.filter(k=>k.vehiculoId===T._id);if(L.length>0){q(`No se puede borrar: lo usan ${L.length} objetivo${L.length!==1?"s":""}`,"err");return}Z(`¿Borrar el vehículo «${T.nombre}»?`)&&(l({vehiculos:F.vehiculos.filter(k=>k._id!==T._id)}),I(),q("Vehículo borrado"),D(M))}))}function $(M,z,F){const T=i();if(!T||z===F)return;const R=[...T.objetivos].sort((k,O)=>k.prioridad-O.prioridad),P=R.findIndex(k=>k._id===z),B=R.findIndex(k=>k._id===F);if(P<0||B<0)return;const[L]=R.splice(P,1);R.splice(B,0,L),v(R.map((k,O)=>({...k,prioridad:O+1}))),D(M)}function m(M){return M.vehiculos.length===0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.06);border-color:rgba(255,209,102,0.28)">
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
    </div>`}function x(M,z,F){const T=i(),R=pl(z);if(!T||!R)return;const P=F?T.eventos.find(O=>O._id===F)??null:null,B={};R.id==="hijo"&&(B.actuales=T.perfil.gastosFijosMensuales),R.id==="subida-sueldo"&&(B.actual=T.perfil.netoMensual);const L=A(P?`Editar evento · ${R.nombre}`:R.nombre,xl(R,P,T,B));if(!L)return;const k=()=>{const O=L.querySelector("#ev-resultado");O&&(O.textContent=$l(R,Xo(L,R)))};k();for(const O of R.campos)J(L,`#ev-${O.id}`,k);N(L,"[data-ev-cancelar]",I),N(L,"[data-ev-guardar]",()=>{var K,Q;const O=((K=L.querySelector("#ev-fecha"))==null?void 0:K.value)??"";if(!O){q("El evento necesita un mes","err");return}const H=Xo(L,R),U={_id:(P==null?void 0:P._id)??`ev_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,fecha:O,tipo:R.tipo,importe:R.calcular(H),objetivoDestinoId:((Q=L.querySelector("#ev-destino"))==null?void 0:Q.value)||null,notas:R.resumir(H)};l({eventos:[...T.eventos.filter(st=>st._id!==U._id),U]}),I(),q(P?"Evento actualizado":"Evento añadido"),D(M)}),N(L,"[data-ev-borrar]",()=>{!P||!Z("¿Borrar este evento?")||(l({eventos:T.eventos.filter(O=>O._id!==P._id)}),I(),q("Evento borrado"),D(M))})}function S(M){var z;switch(M.tipo){case"CAMBIO_GASTOS_FIJOS":return"hijo";case"CAMBIO_INGRESOS":return"subida-sueldo";case"NUEVA_DEUDA":return"nueva-hipoteca";case"INYECCION_CAPITAL":return(z=M.notas)!=null&&z.includes("hipoteca")?"venta-vivienda":"inyeccion"}}function w(){const M=i();if(!M)return;const z=new Blob([JSON.stringify(M,null,2)],{type:"application/json"}),F=URL.createObjectURL(z),T=document.createElement("a");T.href=F,T.download=`plan-${M.nombre.replace(/[^\w-]+/g,"_")}-${e()}.json`,T.click(),URL.revokeObjectURL(F),q("Plan exportado")}function E(M){const z=document.createElement("input");z.type="file",z.accept="application/json,.json",z.addEventListener("change",async()=>{var T,R;const F=(T=z.files)==null?void 0:T[0];if(F)try{const P=JSON.parse(await F.text());if(!P||!Array.isArray(P.objetivos)||!Array.isArray(P.vehiculos)||!P.perfil){q("Ese fichero no es un plan de objetivos","err");return}const B=`${P.nombre??"Importado"} (importado)`,L=t.store.addItem("planes",{...P,nombre:B,activo:!1,creadoEn:e()});n=null,o=null,(R=t.onDatosCambiados)==null||R.call(t),q(`Plan «${L.nombre}» importado`),D(M)}catch(P){console.error("[Planner] Importación fallida:",P),q("No se ha podido leer el fichero","err")}}),z.click()}function _(M,z){switch(a){case"config":return d(M);case"objetivos":return dl(M,z);case"simulacion":return Tl(M,z,s);case"eventos":return hl(M);case"escenarios":return zl(t.store.get("planes"),M._id,o)}}function D(M){const z=r(),F=b(z),T=(P,B)=>`<button class="period-btn ${a===P?"active":""}" data-pl-tab="${P}">${B}</button>`,R=F.viable?'<span class="badge badge-green">Plan viable</span>':'<span class="badge badge-red">No cabe en el flujo</span>';if(M.innerHTML=`
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
             ${m(z)}`:""}

      <div id="pl-cuerpo">${_(z,F)}</div>`,a==="simulacion"){const P=M.querySelector("#pl-chart");P&&rl(P,z,F)}C(M)}function C(M){N(M,"[data-pl-tab]",F=>{a=F.dataset.plTab,D(M)}),J(M,"#pl-disfrute",F=>{const T=Number(F.value)/100,R=M.querySelector("#pl-pct-val");R&&(R.textContent=`${Math.round(T*100)} %`);const P=i();if(!P)return;const B=Math.max(0,P.perfil.netoMensual-P.perfil.gastosFijosMensuales)*(1-T),L=M.querySelector("#pl-disponible");L&&(L.textContent=j(B/100))}),N(M,"[data-pl-usar-sugerido]",()=>{const F=u(),T=M.querySelector("#pl-neto"),R=M.querySelector("#pl-gastos");T&&(T.value=we(F.neto)),R&&(R.value=we(F.gastos))}),N(M,"[data-pl-guardar]",()=>{const F=T=>{var R;return((R=M.querySelector(T))==null?void 0:R.value)??""};l({perfil:{netoMensual:os(F("#pl-neto")),gastosFijosMensuales:os(F("#pl-gastos")),manual:!0},pctDisfrute:Math.min(1,Math.max(0,Number(F("#pl-disfrute"))/100)),fechaInicio:F("#pl-inicio")||e().slice(0,7),horizonteMeses:Math.min(600,Math.max(1,Number(F("#pl-horizonte"))||480))}),q("Plan guardado"),D(M)}),N(M,"[data-pl-plantilla]",F=>x(M,F.dataset.plPlantilla??"",null)),N(M,"[data-pl-editar-evento]",F=>{var P;const T=F.dataset.plEditarEvento??"",R=(P=i())==null?void 0:P.eventos.find(B=>B._id===T);R&&x(M,S(R),T)}),N(M,"[data-pl-duplicar]",()=>{var P;const F=i();if(!F)return;const T=window.prompt("Nombre del plan nuevo:",`${F.nombre} (copia)`);if(!(T!=null&&T.trim()))return;const R=fl(F,T.trim(),`plan_${Date.now().toString(36)}`,e());t.store.addItem("planes",R),(P=t.onDatosCambiados)==null||P.call(t),q(`Plan «${R.nombre}» creado. Actívalo para editarlo.`),D(M)}),N(M,"[data-pl-activar]",F=>{var R;const T=F.dataset.plActivar;if(T){for(const P of t.store.get("planes"))t.store.updateItem("planes",P._id,{activo:P._id===T});n=null,o=null,(R=t.onDatosCambiados)==null||R.call(t),q("Plan activo cambiado"),D(M)}}),N(M,"[data-pl-renombrar]",F=>{var B;const T=F.dataset.plRenombrar,R=t.store.get("planes").find(L=>L._id===T);if(!R)return;const P=window.prompt("Nuevo nombre:",R.nombre);P!=null&&P.trim()&&(t.store.updateItem("planes",R._id,{nombre:P.trim()}),(B=t.onDatosCambiados)==null||B.call(t),D(M))}),N(M,"[data-pl-borrar-plan]",F=>{var B;const T=F.dataset.plBorrarPlan,R=t.store.get("planes").find(L=>L._id===T);if(!R||!Z(`¿Borrar el plan «${R.nombre}» con sus ${R.objetivos.length} objetivos? No se puede deshacer.`))return;t.store.removeItem("planes",R._id);const P=t.store.get("planes");R.activo&&P.length>0&&t.store.updateItem("planes",P[0]._id,{activo:!0}),n=null,o=null,(B=t.onDatosCambiados)==null||B.call(t),q("Plan borrado"),D(M)}),N(M,"[data-pl-sensibilidad]",()=>{const F=i();F&&(o=jl(F),D(M))}),N(M,"[data-pl-pagina]",F=>{s=Number(F.dataset.plPagina)||0,D(M)}),N(M,"[data-pl-exportar]",w),N(M,"[data-pl-importar]",()=>E(M)),N(M,"[data-pl-nuevo-objetivo]",()=>h(M,null)),N(M,"[data-pl-nuevo-vehiculo]",()=>f(M,null)),N(M,"[data-pl-editar-vehiculo]",F=>f(M,F.dataset.plEditarVehiculo??null)),N(M,"[data-pl-editar-objetivo]",F=>h(M,F.dataset.plEditarObjetivo??null));let z=null;M.querySelectorAll("[data-pl-objetivo]").forEach(F=>{F.addEventListener("dragstart",()=>{z=F.dataset.plObjetivo??null,F.style.opacity="0.45"}),F.addEventListener("dragend",()=>{F.style.opacity="",M.querySelectorAll("[data-pl-objetivo]").forEach(T=>T.style.borderTop="")}),F.addEventListener("dragover",T=>{T.preventDefault(),z&&F.dataset.plObjetivo!==z&&(F.style.borderTop="2px solid var(--accent)")}),F.addEventListener("dragleave",()=>{F.style.borderTop=""}),F.addEventListener("drop",T=>{T.preventDefault(),F.style.borderTop="";const R=F.dataset.plObjetivo;z&&R&&$(M,z,R),z=null})}),N(M,"[data-pl-csv]",()=>{const F=i();if(!F||!n)return;const T=new Blob(["\uFEFF"+Bl(F,n)],{type:"text/csv;charset=utf-8"}),R=URL.createObjectURL(T),P=document.createElement("a");P.href=R,P.download=`plan-${F.nombre.replace(/[^\w-]+/g,"_")}-${e()}.csv`,P.click(),URL.revokeObjectURL(R),q(`CSV exportado (${n.serieMensual.length} meses)`)}),N(M,"[data-pl-guardar-notas]",()=>{var F;l({notas:((F=M.querySelector("#pl-notas"))==null?void 0:F.value)??""}),q("Notas guardadas")})}return{id:"planner",route:"planner",nombre:"Objetivos financieros",seccion:2,iconoPath:Xl,mount:D}}function ss(t,e,a=!1){const o=Math.abs(It(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function tc(t){function e(f){return`${f}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(f={}){var m;const $=(m=f.texto)==null?void 0:m.trim().toLowerCase();return t.get("transacciones").filter(x=>!(f.cuentaId&&x.cuentaId!==f.cuentaId||f.desde&&x.fecha<f.desde||f.hasta&&x.fecha>f.hasta||f.tipo&&x.tipo!==f.tipo||f.estimacionId&&x.estimacionId!==f.estimacionId||f.tags&&f.tags.length>0&&!f.tags.some(S=>x.tags.includes(S))||$&&!x.concepto.toLowerCase().includes($))).sort((x,S)=>x.fecha.localeCompare(S.fecha)||x._id.localeCompare(S._id))}function o(f){const $={_id:e("tx"),fecha:f.fecha,cuentaId:f.cuentaId,importeCts:ss(f.tipo,f.importe,f.negativo),concepto:f.concepto,tags:f.tags??[],estimacionId:f.estimacionId??null,tipo:f.tipo,origen:f.origen??"manual",...f.nota?{nota:f.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),$]),$}function s(f,$){t.set("transacciones",t.get("transacciones").map(m=>{if(m._id!==f)return m;const{importe:x,...S}=$,w={...m,...S};return x!==void 0&&(w.importeCts=ss(w.tipo,x,w.importeCts<0)),w}))}function n(f){t.set("transacciones",t.get("transacciones").filter($=>$._id!==f))}function i(f,$){s(f,{estimacionId:$})}function r(f){return t.get("puntosControl").filter($=>!f||$.cuentaId===f).sort(($,m)=>$.fecha.localeCompare(m.fecha))}function l(f,$,m,x){const S={_id:e("pc"),fecha:$,cuentaId:f,saldoCts:It(m),...x?{nota:x}:{}},w=t.get("puntosControl").filter(E=>!(E.cuentaId===f&&E.fecha===$));return t.set("puntosControl",[...w,S].sort((E,_)=>E.fecha.localeCompare(_.fecha))),b(f),S}function u(f){const $=t.get("puntosControl").find(m=>m._id===f);t.set("puntosControl",t.get("puntosControl").filter(m=>m._id!==f)),$&&b($.cuentaId)}function b(f){const $=r(f),m=t.get("accounts");m.some(x=>x._id===f)&&t.set("accounts",m.map(x=>x._id===f?{...x,historicoSaldos:$.map(S=>({_id:S._id,fecha:S.fecha,saldo:et(S.saldoCts),...S.nota?{nota:S.nota}:{}}))}:x))}function d(f,$=Y()){const m=r(f).filter(E=>E.fecha<=$).pop(),x=m==null?void 0:m.fecha,S=(m==null?void 0:m.saldoCts)??0;return t.get("transacciones").filter(E=>E.cuentaId===f&&E.fecha<=$&&(x===void 0||E.fecha>x)).reduce((E,_)=>E+_.importeCts,S)}function p(f,$){return et(d(f,$))}function y(f=Y(),$){const m=$??t.get("accounts").filter(x=>x.activo).map(x=>x._id);return et(m.reduce((x,S)=>x+d(S,f),0))}function g(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function I(){const f=[...t.get("transacciones").map($=>$.fecha),...t.get("puntosControl").map($=>$.fecha)];return f.length>0?f.sort().pop()??null:null}function A(f={}){return et(a(f).reduce(($,m)=>$+m.importeCts,0))}function v(f={}){const $=new Map;for(const m of a(f)){const x=m.fecha.slice(0,7);$.set(x,($.get(x)??0)+m.importeCts)}return new Map([...$.entries()].sort(([m],[x])=>m.localeCompare(x)).map(([m,x])=>[m,et(x)]))}function h(f={}){const $=new Map;for(const m of a(f))for(const x of m.tags.length>0?m.tags:["sin_tag"])$.set(x,($.get(x)??0)+m.importeCts);return new Map([...$.entries()].map(([m,x])=>[m,et(x)]))}return{transacciones:a,registrar:o,actualizar:s,eliminar:n,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:u,saldoCuenta:p,saldoCuentaCts:d,saldoTotal:y,tieneDatos:g,ultimaFecha:I,total:A,totalPorMes:v,totalPorTag:h}}function xt(t){return t.trim().toLowerCase()}function ec(t){function e(){const u=new Map,b=(d,p)=>{const y=xt(d);if(!y)return;const g=u.get(y)??{tag:y,estimaciones:0,reales:0,total:0};g[p]+=1,g.total+=1,u.set(y,g)};for(const d of t.get("expenses"))for(const p of d.tags??[])b(p,"estimaciones");for(const d of t.get("transacciones"))for(const p of d.tags??[])b(p,"reales");return[...u.values()].sort((d,p)=>p.total-d.total||d.tag.localeCompare(p.tag))}function a(){return e().map(u=>u.tag)}function o(u){return e().filter(b=>u==="estimaciones"?b.reales===0:b.estimaciones===0).map(b=>b.tag)}function s(u,b,d){const p=xt(b),y=(u??[]).map(xt);if(!y.includes(p))return u??[];const g=y.filter(I=>I!==p);return d===null?[...new Set(g)]:[...new Set([...g,xt(d)])]}function n(u,b){const d=xt(b);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return l(u,d)}function i(u,b){let d=0;for(const p of u)xt(p)!==xt(b)&&(d+=l(p,xt(b)).cambiados);return{cambiados:d}}function r(u){return l(u,null)}function l(u,b){let d=0;const p=t.get("expenses").map(S=>{const w=s(S.tags,u,b);return w!==S.tags&&(d+=1),w===S.tags?S:{...S,tags:w}});t.set("expenses",p);const y=t.get("transacciones").map(S=>{const w=s(S.tags,u,b);return w!==S.tags&&(d+=1),w===S.tags?S:{...S,tags:w}});t.set("transacciones",y);const g=t.get("loans").map(S=>{const w=s(S.tags,u,b);return w!==S.tags&&(d+=1),w===S.tags?S:{...S,tags:w}});t.set("loans",g);const I=t.get("nominas").map(S=>{const w=s(S.tags,u,b);return w!==S.tags&&(d+=1),w===S.tags?S:{...S,tags:w}});t.set("nominas",I);const A=t.get("config"),v=xt(u),h=S=>{const w=(S??[]).map(xt);if(!w.includes(v))return S??[];const E=w.filter(_=>_!==v);return b===null?[...new Set(E)]:[...new Set([...E,b])]},f={},$=h(A.activeTagsFilter),m=h(A.tagCategorias),x=h(A.tagGrupos);return $!==A.activeTagsFilter&&(f.activeTagsFilter=$),m!==A.tagCategorias&&(f.tagCategorias=m),x!==A.tagGrupos&&(f.tagGrupos=x),Object.keys(f).length>0&&t.patchConfig(f),{cambiados:d}}return{uso:e,todas:a,soloEn:o,renombrar:n,fusionar:i,eliminar:r}}const ac=3;function ns(t){return t<.005?0:t}function oc(t){if(t.length<2)return null;const e=t.reduce((o,s)=>o+s,0)/t.length,a=t.reduce((o,s)=>o+(s-e)**2,0)/(t.length-1);return Math.sqrt(a)}function sc(t){const e=[],a=[],o=[];for(const i of t){if(i.meses.length<ac)continue;const r=oc(i.meses.map(l=>l.desviacion));r!==null&&(e.push(r),a.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(e.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const s=Math.sqrt(e.reduce((i,r)=>i+r*r,0)),n=Math.sqrt(a.reduce((i,r)=>i+r*r,0));return{sigmaMensual:ns(s),sigmaDeriva:ns(n),estimaciones:e.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function is(t,e,a=1,o=0){if(e<=0)return 0;const s=Math.max(0,t)*Math.sqrt(e),n=Math.max(0,o)*e;return s===0&&n===0?0:W(a*Math.hypot(s,n))}function nc(t,e,a={}){if(!e.fiable||t.length===0)return[];const{z:o=1}=a,s=a.desde??t[0].fecha,[n,i]=s.slice(0,7).split("-").map(Number);return t.map(r=>{const[l,u]=r.fecha.slice(0,7).split("-").map(Number),b=Math.max(0,(l-n)*12+(u-i)),d=is(e.sigmaMensual,b,o,e.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:W(r.saldoAcum+d),abajo:W(r.saldoAcum-d)}})}function ic(t,e=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const a=e>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${e} desviación${e!==1?"es":""} típica${e!==1?"s":""} (${a} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const ua="financeapp_session",rc=["local","dropbox","firebase"];function lc(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!rc.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function cc({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now()}={}){const o=()=>t??(typeof localStorage<"u"?localStorage:null);function s(p){const y=o();if(y)try{p?y.setItem(ua,JSON.stringify(p)):y.removeItem(ua)}catch{}}function n(){const p=o();if(!p)return null;try{return lc(p.getItem(ua))}catch{return null}}function i(){const p=n();return p?(a()-p.ultimoUso)/6e4:null}function r(){const p=e();if(!Number.isFinite(p)||p<=0)return!1;const y=i();return y!==null&&y>=p}function l(){const p=n();return p?r()?(s(null),null):p:null}function u(p){const y=a(),g={modo:p.modo,...p.email?{email:p.email}:{},...p.passphrase?{passphrase:p.passphrase}:{},creadaEn:y,ultimoUso:y};return s(g),g}function b(){const p=n();p&&s({...p,ultimoUso:a()})}function d(){s(null)}return{abrir:u,leer:l,tocar:b,cerrar:d,caducada:r,inactividadMinutos:i,get activa(){return l()!==null}}}const rs=["pointerdown","keydown","visibilitychange"];function dc({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:s=clearInterval,target:n=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const b of rs)n==null||n.addEventListener(b,r);const l=o(()=>{i&&t.caducada()&&(u(),t.cerrar(),e())},a);function u(){if(i){i=!1,s(l);for(const b of rs)n==null||n.removeEventListener(b,r)}}return u}const uc=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}];function ls(){if(typeof localStorage<"u"){const g=An();g.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${g.join(", ")}`)}const t=In(),e=jn({adapter:t}),a=En(),{applied:o}=e.load();o.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${o.join(", ")} (esquema v${ee})`),e.subscribe(g=>a.marcar(g));const s=Dn(e);Gs(g=>s.isEnabled(g));const n=cc({autoLogoutMinutos:()=>{var I,A;const g=(A=(I=globalThis.State)==null?void 0:I.get)==null?void 0:A.call(I,"config");return Number((g==null?void 0:g.autoLogoutMinutos)??e.get("config").autoLogoutMinutos??0)}}),i=tc(e),r=ec(e),l=bi(i),u=Xn(e),b=Yn({isEnabled:g=>s.isEnabled(g)}),d=qn({flags:s,rutasExtra:()=>b.flagPorRuta()}),p=On({flags:s,onChange:()=>{var g,I;b.attachToShell(),d.apply(),(I=(g=globalThis.Router)==null?void 0:g.rerender)==null||I.call(g)}}),y=()=>{var I,A,v,h,f,$;const g=globalThis;if((A=(I=g.State)==null?void 0:I.load)==null||A.call(I),((h=(v=g.Router)==null?void 0:v.current)==null?void 0:h.call(v))==="dashboard")try{($=(f=g.DashboardModule)==null?void 0:f.render)==null||$.call(f)}catch(m){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",m)}};return b.register(Gi({store:e,onDatosCambiados:y})),b.register(er({store:e,onDatosCambiados:y})),b.register(xr({store:e,onDatosCambiados:y})),b.register(Lr({store:e,ledger:i,mostrarObjetivos:()=>s.isEnabled("goals"),onDatosCambiados:y})),b.register(Ei({ledger:i,tags:r,precision:l,adjuster:u,accounts:()=>e.get("accounts"),estimaciones:()=>e.get("expenses"),onDatosCambiados:y})),b.register(Zl({store:e,onDatosCambiados:y})),b.register(Qr({store:e,onDatosCambiados:y})),b.register(Ri({store:e,onDatosCambiados:y})),b.register(Yr({store:e})),b.register(_i({store:e,onDatosCambiados:y})),{version:ee,core:ws,engine:{generarExtracto:Xt,recomputarSaldoAcum:Es,saldoHoy:zs,sumarPorTags:Ba,providers:{proyectarGastos:Qt,proyectarPrestamos:Fa,proyectarTransferencias:Pa,proyectarNominas:Ra,proyectarInteresesCuentas:Ta,proyectarAportaciones:Da,proyectarRetencionesFiscales:Na,proyectarInflacionGastos:Oa,proyectarPerdidaAhorro:qa},analysis:Ds,margins:Os,avisos:ks,optimizer:Vs,dashboard:nn},store:e,flags:s,featureRegistry:{all:Ct,porGrupo:po},ui:{openFeatures:p.open,applyGating:d.apply,watchGating:()=>d.observar(),instalarDeshacer:()=>Bn({store:e,rerender:()=>{var I,A,v,h;const g=globalThis;(A=(I=g.State)==null?void 0:I.load)==null||A.call(I),(h=(v=g.Router)==null?void 0:v.rerender)==null||h.call(v)}}),avisoGuardado:null,instalarBuscador:()=>Vn({estado:()=>({accounts:e.get("accounts"),expenses:e.get("expenses"),loans:e.get("loans"),nominas:e.get("nominas"),escenarios:e.get("escenarios"),planes:e.get("planes"),goals:e.get("goals"),transacciones:e.get("transacciones")}),rutasDisponibles:()=>b.routes(),navegar:g=>{var I,A;return(A=(I=globalThis.Router)==null?void 0:I.navigate)==null?void 0:A.call(I,g)}})},app:b,session:Object.assign(n,{vigilar:g=>dc({sesion:n,onCaducada:g}),opciones:uc}),cambios:a,datos:{colecciones:ge,snapshot:()=>zn(t),aplicar:(g,{sellar:I=!0}={})=>{const v=_n(I?(h,f)=>t.set(h,f):(h,f)=>{const $=globalThis.StorageAdapter;$!=null&&$.setRestaurando?$.setRestaurando(h,f):t.set(h,f)},g);return e.load(),a.marcar("copia-restaurada"),v},faltantes:g=>Fn(g),recargar:()=>{e.load(),a.marcar("recarga-externa")}},accounting:{ledger:i,tags:r,precision:l,adjuster:u,sugerirAjuste:Qe,medirVariabilidad:sc,bandaDeConfianza:nc,bandaAcumulada:is,describirBanda:ic}}}function pc(){try{const t=ls();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const jt=typeof window<"u"?pc():null;if(jt){let t=!1;const e=()=>{if(jt.app.attachToShell(),jt.ui.applyGating(),!t){t=!0,jt.ui.watchGating(),jt.ui.instalarDeshacer(),jt.ui.instalarBuscador();const a=globalThis,o=()=>{var s,n,i,r;return(n=(s=a.FirebaseService)==null?void 0:s.isConnected)!=null&&n.call(s)?a.FirebaseService:(r=(i=a.DropboxService)==null?void 0:i.isConnected)!=null&&r.call(i)?a.DropboxService:null};jt.ui.avisoGuardado=Un({cambios:jt.cambios,hayDestino:()=>o()!==null,guardar:async()=>{const s=o();if(!(s!=null&&s.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await s.uploadBackup()}})}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",a=>{const o=a.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(e,0)})}return $t.bootstrap=ls,Object.defineProperty($t,Symbol.toStringTag,{value:"Module"}),$t}({});
//# sourceMappingURL=financeapp-core.js.map

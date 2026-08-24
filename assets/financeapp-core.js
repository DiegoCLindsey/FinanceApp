var FinanceAppBundle=function($t){"use strict";var ic=Object.defineProperty;var rc=($t,V,G)=>V in $t?ic($t,V,{enumerable:!0,configurable:!0,writable:!0,value:G}):$t[V]=G;var ls=($t,V,G)=>rc($t,typeof V!="symbol"?V+"":V,G);function V(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function G(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function Y(){return V(new Date)}function we(t,e){return new Date(t,e+1,0).getDate()}function ua(t,e,a){return V(new Date(t,e,Math.min(a,we(t,e))))}function pe(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return V(new Date(t,e+1,0));const s=parseInt(o);if(!isNaN(s))return ua(t,e,s)}if(a.startsWith("nthweekday:")){const o=a.split(":"),s=parseInt(o[1]),n=parseInt(o[2]);if(s===-1){const r=new Date(t,e+1,0);for(;r.getDay()!==n;)r.setDate(r.getDate()-1);return V(r)}const i=new Date(t,e,1);for(;i.getDay()!==n;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(s-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),V(i)}return null}function pa(t,e){if(!e)return t;const a=G(t);return pe(a.getFullYear(),a.getMonth(),e)??t}const cs=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],ds={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function Ce(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${ds[a]||a+"º"} ${cs[o]} del mes`}return t}function Yt(t,e){const a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((o-a)/864e5)}function It(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function et(t){return t/100}function W(t){return et(It(t))}function j(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function ma(t){return(t||0).toFixed(2)+"%"}function Nt(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function fa(t,e,a,o=0){const s=Nt(t,e,a),n=t*(1-o/100);let i=e/100/12;for(let r=0;r<200;r++){const p=s*(1-Math.pow(1+i,-a))/i-n,h=s*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),u=i-p/h;if(Math.abs(u-i)<1e-10){i=u;break}i=u}return(Math.pow(1+i,12)-1)*100}function va(t,e,a,o,s=0,n=[],i={}){const r=[];let l=t;const p=G(o),h=e/100/12;let u=a,d=Nt(l,e,u);const v=[...n].sort((I,A)=>I.fecha.localeCompare(A.fecha));let x=0;for(let I=1;I<=a*2&&l>.01;I++){const A=new Date(p);p.setMonth(p.getMonth()+1);const g=pa(V(A),i.diaPago||"");for(;x<v.length&&v[x].fecha<=g;){const $=v[x],m=$.cantidad*(s/100);if(l-=$.cantidad,l=Math.max(0,l),$.tipo==="plazo"?u=Math.ceil(-Math.log(1-l*h/d)/Math.log(1+h)):(u=a-I+1,d=Nt(l,e,u)),r.push({mes:"AMORT",fecha:$.fecha,cuota:0,interes:0,amortizacion:$.cantidad,comisionAmort:m,capitalPendiente:l,esAmortizacion:!0,simulacion:$.simulacion||!1}),x++,l<.01)break}if(l<.01)break;const b=l*h,f=Math.min(d-b,l);if(l-=f,l<.01&&(l=0),r.push({mes:I,fecha:g,cuota:d,interes:b,amortizacion:f,comisionAmort:0,capitalPendiente:l,esAmortizacion:!1,simulacion:!1}),u--,u<=0||l<.01)break}return r}const ga=new Map;function at(t){var A;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((g,b)=>`${g.fecha}|${g.cantidad}|${g.tipo||""}`.localeCompare(`${b.fecha}|${b.cantidad}|${b.tipo||""}`)).map(g=>`${g.fecha}:${g.cantidad}:${g.tipo||""}`).join(";")}`,o=ga.get(a);if(o)return o;const{capital:s,tin:n,meses:i,fechaInicio:r,comisionAmort:l,comisionApertura:p}=t,h=va(s,n,i,r,l||0,e,t),u=h.reduce((g,b)=>g+b.interes,0),d=h.reduce((g,b)=>g+b.comisionAmort,0),v=s*((p||0)/100),x=h.filter(g=>!g.esAmortizacion),I={cuota:Nt(s,n,i),totalIntereses:u,tae:fa(s,n,i,p||0),costoTotal:u+d+v,comAp:v,totalComAm:d,fechaFin:((A=x.slice(-1)[0])==null?void 0:A.fecha)||"",mesesReales:x.length,tabla:h};return ga.set(a,I),I}function ba(t){const e=at(t),a=at({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,s=a.mesesReales-e.mesesReales,n=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:s,costeTotalAmort:n,ahorroNeto:o-n,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function pt(t,e,a){if(!t||t.length===0)return 1;const o=G(e),s=G(a);if(s<=o)return 1;const n=[...t].sort((l,p)=>l.year-p.year);let i=1,r=new Date(o);for(;r<s;){const l=r.getFullYear(),p=n.filter(I=>I.year<=l),h=p.length>0?p[p.length-1]:n[0],u=(h?h.tasa:0)/100,d=new Date(l+1,0,1),v=d<s?d:s,x=Yt(r,v);i*=Math.pow(1+u,x/365.25),r=v}return i}function ha(t,e,a,o=0){const s=G(e),n=G(a);if(n<=s)return o;const i=Yt(s,n),r=t?[...t].sort((h,u)=>h.year-u.year):[];let l=0,p=new Date(s);for(;p<n;){const h=p.getFullYear(),u=new Date(h+1,0,1),d=u<n?u:n,v=Yt(p,d),x=r.filter(g=>g.year<=h),I=x.length>0?x[x.length-1]:null,A=I!==null?I.tasa:o;l+=A*v,p=d}return i>0?l/i:o}function ya(t,e){return((1+t/100)/(1+e/100)-1)*100}function us(t,e,a,o){const s=pt(e,a,o);return s>0?t/s:t}function ps(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,s=e.saludUmbralDTIVerde??30,n=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],r=e.saludExcluirHipoteca||!1,{ingresos:l=0,cuotas:p=0,cuotasHipoteca:h=0,gastosBasicos:u=0,gastosOtros:d=0,amortizaciones:v=0}=t,x=l-p-v-u-d,I=x,A=l>0?I/l*100:null,g=r?p-h:p,b=l>0?g/l*100:null,f=l>0?p/l*100:null,$=l>0?(u+p+v)/l*100:null,m=l>0?d/l*100:null,y=(w,E,_)=>w===null?"neutral":w>=E?"verde":w>=_?"amarillo":"rojo",S=(w,E,_)=>w===null?"neutral":w<=E?"verde":w<=_?"amarillo":"rojo";return{ingresos:l,cuotas:p,cuotasHipoteca:h,gastosBasicos:u,gastosOtros:d,amortizaciones:v,ahorroBruto:x,ahorroReal:I,tasaAhorro:A,dti:b,dtiTotal:f,excluyeHipoteca:r,pctNecesidades:$,pctDeseos:m,semAhorro:y(A,a,o),semDTI:S(b,s,n),semNecesidades:S($,i[0],i[0]+15),semDeseos:S(m,i[1],i[1]+10),semAhorroRegla:y(A,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:s,umbralDTIAmarillo:n,regla:i}}function mt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function rt(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function Jt(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];a&&o.push({fecha:a,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((n,i)=>{n.fecha>=a&&o.push({...n,prioridad:i})}),o.sort((n,i)=>i.fecha.localeCompare(n.fecha)||i.prioridad-n.prioridad);const s=o.find(n=>n.fecha<=e);return s?s.saldo:t.saldoInicial||0}else{const s=[...t.historicoSaldos||[]].sort((n,i)=>i.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=e);return s?s.saldo:0}}function je(t,e){const a=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return a?e.filter(o=>a.includes(o._id)):e.filter(o=>o.activo&&!o.simulacion)}function xa(t,e,a=0){const o=je(t,e).reduce((s,n)=>s+rt(n),0);return t.usarColchon!==!1?Math.max(0,o-a):o}function ms(t,e,a){if(!t.targetAmount||t.targetAmount<=0)return null;const o=je(t,e);if(o.length===0)return null;const s=a.hoy??new Date,n=a.horizonteMeses??120,i=t.usarColchon!==!1,r=o.map(l=>({acc:l,eventos:a.extractoCuenta(l),cursor:0,saldo:rt(l)}));for(let l=1;l<=n;l++){const p=new Date(s.getFullYear(),s.getMonth()+l,1),h=`${p.getFullYear()}-${String(p.getMonth()+1).padStart(2,"0")}`,u=V(new Date(p.getFullYear(),p.getMonth()+1,0));let d=0;for(const x of r){for(;x.cursor<x.eventos.length&&x.eventos[x.cursor].fecha<=u;)x.saldo=x.eventos[x.cursor].saldoAcum??x.saldo,x.cursor++;d+=x.saldo}const v=i?a.colchonEnFecha(u):0;if(d-v>=t.targetAmount)return h}return null}function $a(t,e){const a=t.escenarioIds||[];return a.length===0?!0:!!e&&a.includes(e)}function Ia(t,e){const a=o=>$a(o,e);return{loans:t.loans.filter(a).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}const Ee=t=>t.slice(0,7);function fs(t){const[e,a]=t.split("-").map(Number);return`${a===12?e+1:e}-${String(a===12?1:a+1).padStart(2,"0")}`}function ze(t,e,a){if(t.length===0)return[];const o=new Map;for(const p of t)p.saldoAcum!==void 0&&o.set(Ee(p.fecha),p.saldoAcum);const s=t[0];let n=(s.saldoAcum??0)-(s.delta??0);const i=Ee(e||s.fecha),r=Ee(a||t[t.length-1].fecha);if(r<i)return[];const l=[];for(let p=i;p<=r;p=fs(p)){const h=o.get(p);h!==void 0&&(n=h);const[u,d]=p.split("-").map(Number);l.push({x:G(V(new Date(u,d-1,15))).getTime(),mes:p,y:n})}return l}function _e(t,e){let a=null;for(const o of t){if(o.fecha>e)break;o.saldoAcum!==void 0&&(a=o.saldoAcum)}return a}function vs(t){const e=a=>!a.simulacion;return{loans:t.loans.filter(e).map(a=>({...a,amortizaciones:(a.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}function gs(t){const e=a=>!!a.simulacion;return t.loans.some(a=>e(a)||(a.amortizaciones||[]).some(e))||t.expenses.some(e)||t.nominas.some(e)||t.accounts.some(e)}const gt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ut(t,e){const a=[...e].sort((n,i)=>n[0]-i[0]);let o=0,s=t;for(let n=a.length-1;n>=0;n--){const[i,r]=a[n];s<=i||(o+=(s-i)*(r/100),s=i)}return o}function Fe(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,s=Math.min(2e3,a),n=Math.max(0,a-o-s),i=n<=15876?7302:n<=21622?Math.max(0,7302-1.75*(n-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:s,RNT:n,reducArt20:i,baseImponible:Math.max(0,n-i)}}function St(t,e){return Fe(t,e).baseImponible}function Aa(t,e){return ut(t,e)/12}const jt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Pe(t,e){if(!t||t<=0)return 0;const a=e||jt;let o=0,s=t;for(let n=0;n<a.length;n++){const[i,r]=a[n],l=n<a.length-1?a[n+1][0]:1/0,p=Math.min(s,l-i);if(!(p<=0)&&(o+=p*(r/100),s-=p,s<=0))break}return o}function Rt(t,e){if(mt(t)!=="inversion")return null;const a=rt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,s=Math.max(0,a-o),n=Pe(s,e);return{saldo:a,costBase:o,plusvalia:s,impuesto:n,neto:a-n}}function me(t,e=new Date){var d;if(mt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=rt(t),s=V(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),n=[...t.aportaciones||[]].sort((v,x)=>v.fecha.localeCompare(x.fecha));let i=0;const r=n.reduce((v,x)=>v+x.cantidad,0);for(const v of n)v.fecha<=s&&(i+=v.cantidad);const l=Math.max(0,o-r),p=r>0?i/r:0,h=Math.min(o,i+l*p),u=Math.max(0,o-h);return{saldo:o,disponible:h,bloqueado:u,costBase:r,beneficio:l,numAportaciones:n.length,proxDesbloqueo:((d=n.find(v=>v.fecha>s))==null?void 0:d.fecha)||null}}function Sa(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(mt(t)!=="pension"||!o)return 0;const s=rt(t);if(s<=0)return 0;const n=(t.aportaciones||[]).reduce((p,h)=>p+h.cantidad,0),i=Math.max(0,s-n);if(i<=0)return 0;const r=i/s;return+(e*r*o/100).toFixed(2)}function De(t,e,a){var l;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const n=(e||[]).filter(p=>(p.grupoNomina||"")===o&&p.activo!==!1).reduce((p,h)=>p+(h.bruto||0)*(h.nPagas||12),0),i=[...a||[]].sort((p,h)=>p[0]-h[0]);let r=((l=i[0])==null?void 0:l[1])||19;for(const[p,h]of i)if(n>=p)r=h;else break;return r}const Te=6.35;function Et(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function Ma(t){return Math.max(0,(t.bruto||0)-Et(t))}function bs(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function hs(t){const e=t.reduce((i,r)=>i+(r.bruto||0),0),a=t.reduce((i,r)=>i+Et(r),0),o=Math.max(0,e-a),s=St(e,a),n=new Map;for(const i of t)n.set(i._id,o>0?s*(Ma(i)/o):0);return n}function Ne(t,e,a){if(t.irpfModo==="manual")return Ma(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return ut(St(t.bruto||0,Et(t)),a);const o=bs(e.filter(i=>i.irpfModo!=="manual")),s=hs(e);let n=0;for(const i of o){const r=s.get(i._id)??0;if(i._id===t._id)return ut(n+r,a)-ut(n,a);n+=r}return ut(St(t.bruto||0,Et(t)),a)}function ys(t,e){return t.reduce((a,o)=>a+Ne(o,t,e),0)}function xs(t,e){var s;const a=[...e||[]].sort((n,i)=>n[0]-i[0]);let o=((s=a[0])==null?void 0:s[1])??19;for(const[n,i]of a)if(t>=n)o=i;else break;return o}function wa(t,e){if(!t||t.length===0)return 0;const a=t.reduce((s,n)=>s+(n.bruto||0),0),o=t.reduce((s,n)=>s+Et(n),0);return xs(St(a,o),e)}function Re(t,e,a){const o=t.bruto||0,s=Et(t),n=Math.max(0,o-s),i=t.nPagas||12,r=t.ssPct??Te,l=n*(r/100),p=Ne(t,e,a);return{brutoAnual:o,flexAnual:s,baseDineraria:n,nPagas:i,ssPct:r,ssAnual:l,irpfAnual:p,irpfPct:n>0?p/n*100:0,netoPorPaga:(n-l-p)/i}}function $s(t){const e=new Map,a=[];for(const o of t){const s=o.grupoNomina||"";if(!s){a.push(o);continue}const n=e.get(s)??[];n.push(o),e.set(s,n)}return{grupos:e,sueltas:a}}const zt=1500;function Ca(t){const e=t.cuantia||0,a=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?e*12/a:t.tipoFrecuencia==="diaria"?e*365.25/a:e}const Wt=t=>{const e=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(e)?e:0};function Is(t,e){const a=t.grupoNomina||"";return a?e.filter(o=>(o.grupoNomina||"")===a):null}function ja(t,e){return t.reduce((a,o)=>a+Ne(o,Is(o,t),e),0)}function Ea(t){const{nominas:e,tramosGeneral:a,tramosAhorro:o}=t,s=t.extras??{},n=e.reduce((w,E)=>w+(E.bruto||0),0),i=e.reduce((w,E)=>w+Et(E),0),r=Fe(n,i),l=t.aportacionesPension,p=zt,h=Math.min(l,p),u=Math.max(0,r.RNT-r.reducArt20-h),d=Wt(s.capInmobiliario),v=Wt(s.capMobiliario),x=Wt(s.gananciasFondos),I=Wt(s.otrasCorto),A=Wt(s.retCapital),g=Math.max(0,u+t.otrosIngresos+d+I),b=Math.max(0,v+x),f=ut(g,a),$=ut(b,o),m=f+$,y=ja(e,a),S=y+A;return{brutoTotal:n,flexTotal:i,brutoIRPF:r.baseIRPF,cotizSS:r.cotizSS,gastosArt19:r.gastosArt19,RNT:r.RNT,reducArt20:r.reducArt20,aportPP:l,limPP:p,deducPP:h,RNTred:u,otrosIngresos:t.otrosIngresos,capInmobiliario:d,capMobiliario:v,gananciasFondos:x,otrasCorto:I,baseGeneral:g,baseAhorro:b,cuotaGen:f,cuotaAho:$,cuotaIntegra:m,retNomina:y,retCapital:A,totalRet:S,resultado:m-S}}const As=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:zt,TRAMOS_AHORRO_DEFAULT:jt,TRAMOS_IRPF_DEFAULT:gt,ajustarFechaPago:pa,ajustarPrecioReal:us,calcBaseImponibleTrabajo:St,calcFactorInflacion:pt,calcFondoInversion:Rt,calcFondosPension:me,calcGananciasCapital:Pe,calcIRPF:ut,calcImpuestoPension:Sa,calcInflacionMediaAnual:ha,calcSaludFinanciera:ps,calcTAE:fa,calcTipoMarginalPension:De,calcTipoRealFisher:ya,calcularDeclaracion:Ea,clampedDate:ua,cuentasDelObjetivo:je,cuotaMensual:Nt,desgloseBaseTrabajo:Fe,diasEntre:Yt,filtrarPorEscenario:Ia,formatEUR:j,formatLocalDate:V,formatPct:ma,fromCents:et,haySimulaciones:gs,ingresoAnual:Ca,labelDiaPago:Ce,lastDayOfMonth:we,modeloFondoDe:mt,parseLocalDate:G,proyectarFechaCumplimiento:ms,resolverDiaEfectivo:pe,resumenPrestamo:at,resumenPrestamoConAhorro:ba,retencionMensual:Aa,retencionesNomina:ja,roundMoney:W,saldoEnFecha:Jt,saldoEnFechaExtracto:_e,saldoParaObjetivo:xa,saldoRealCuenta:rt,serieMensual:ze,sinSimulaciones:vs,tablaAmortizacion:va,toCents:It,todayISO:Y,visibleEnEscenario:$a},Symbol.toStringTag,{value:"Module"}));function Kt(t,e,a=null){const o=[],s=G(e.start),n=G(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const r=G(i.fechaInicio||e.start),l=i.fechaFin?G(i.fechaFin):n,p=i.cuantia,h=u=>o.push({fecha:u,concepto:i.concepto,cuantia:p,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=s&&r<=n&&r<=l&&h(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const u=Math.max(1,i.frecuencia||1);let d=r.getFullYear(),v=r.getMonth();const x=Math.ceil(240/u)+2;for(let I=0;I<x;I++){const A=pe(d,v,i.diaPago||"")||(()=>{const b=r.getDate(),f=new Date(d,v+1,0).getDate();return V(new Date(d,v,Math.min(b,f)))})(),g=G(A);if(g>n||g>l)break;g>=s&&g>=r&&h(A),v+=u,v>=12&&(d+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const u=Math.max(1,i.frecuencia||1)*864e5;let d=new Date(Math.max(r.getTime(),s.getTime()));if(r<s){const v=Math.ceil((s.getTime()-r.getTime())/u);d=new Date(r.getTime()+v*u)}for(;d<=n&&d<=l;)h(V(d)),d=new Date(d.getTime()+u)}}return o}function za(t,e,a=null){const o=[];for(const s of t){if(!s.activo||a&&a.length>0&&!a.includes(s.cuenta||"default"))continue;const{tabla:n}=at(s);for(const i of n)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${s.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${s.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan",simulacion:s.simulacion||!1}))}return o}function _a(t,e,a=null,o={accounts:[]}){const s=[],n=G(e.start),i=G(e.end),r=o.accounts||[],l=o.nominas||[],p=o.resolverTramosIRPF||(()=>gt),h=o.resolverTramosGanancias||(()=>jt),u=d=>{var v;return((v=r.find(x=>x._id===d))==null?void 0:v.nombre)??d};for(const d of t){if(!d.activo||d.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(d.cuenta||"default")||a.includes(d.cuentaDestino||"default")))continue;const v=G(d.fechaInicio||e.start),x=d.fechaFin?G(d.fechaFin):i,I=A=>{const g=r.find(D=>D._id===(d.cuenta||"default")),b=r.find(D=>D._id===(d.cuentaDestino||"default")),f=mt(g),$=mt(b),m=f==="inversion"&&$==="inversion"||f==="pension"&&$==="pension",y=["transferencia",...m?["traspaso"]:[],...d.tags||[]],S=m?"traspaso-out":"transfer-out",w=m?"traspaso-in":"transfer-in",E=!a||a.length===0||a.includes(d.cuenta||"default"),_=!a||a.length===0||a.includes(d.cuentaDestino||"default");if(E&&s.push({fecha:A,concepto:`Transf. → ${u(d.cuentaDestino||"default")}: ${d.concepto}`,cuantia:d.cuantia,tipo:"gasto",tags:y,cuenta:d.cuenta||"default",sourceId:d._id,sourceType:S}),_&&s.push({fecha:A,concepto:`Transf. ← ${u(d.cuenta||"default")}: ${d.concepto}`,cuantia:d.cuantia,tipo:"ingreso",tags:y,cuenta:d.cuentaDestino||"default",sourceId:d._id,sourceType:w}),E&&!m&&g){if(f==="inversion"){const D=parseInt(A.slice(0,4)),C=Rt(g,h(D));if(C&&C.saldo>0&&C.plusvalia>0){const M=Math.min(1,d.cuantia/C.saldo),F=C.plusvalia*M*.19;F>.01&&s.push({fecha:A,concepto:`Retención IRPF reembolso ${g.nombre} (19% s/plusvalía)`,cuantia:F,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:d.cuenta||"default",sourceId:d._id,sourceType:"investment-tax"})}}else if(f==="pension"){const D=p(parseInt(A.slice(0,4))),C=De(g,l,D),M=Sa(g,d.cuantia,C||void 0);if(M>0){const z=g.grupoNomina?`IRPF rescate ${g.nombre} (tipo marginal grupo "${g.grupoNomina}": ${C}%)`:`Retención rescate ${g.nombre} (${g.impuestoRetirada}% s/beneficio)`;s.push({fecha:A,concepto:z,cuantia:M,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:d.cuenta||"default",sourceId:d._id,sourceType:"pension-tax"})}}}};if(d.tipoFrecuencia==="extraordinario")v>=n&&v<=i&&v<=x&&I(d.fechaInicio);else if(d.tipoFrecuencia==="mensual"){const A=Math.max(1,d.frecuencia||1);let g=v.getFullYear(),b=v.getMonth();const f=Math.ceil(240/A)+2;for(let $=0;$<f;$++){const m=pe(g,b,d.diaPago||"")||(()=>{const S=v.getDate(),w=new Date(g,b+1,0).getDate();return V(new Date(g,b,Math.min(S,w)))})(),y=G(m);if(y>i||y>x)break;y>=n&&y>=v&&I(m),b+=A,b>=12&&(g+=Math.floor(b/12),b=b%12)}}else if(d.tipoFrecuencia==="diaria"){const A=Math.max(1,d.frecuencia||1)*864e5;let g=new Date(Math.max(v.getTime(),n.getTime()));if(v<n){const b=Math.ceil((n.getTime()-v.getTime())/A);g=new Date(v.getTime()+b*A)}for(;g<=i&&g<=x;)I(V(g)),g=new Date(g.getTime()+A)}}return s}function Fa(t,e,a=null){const o=[],s=G(e.start),n=G(e.end);for(const i of t){const r=mt(i);if(r==="cuenta"||!i.activo)continue;const l=i.planAportaciones||[];for(const p of l){if(!p.importe||p.importe<=0)continue;const h=G(p.fechaInicio||e.start),u=p.fechaFin?G(p.fechaFin):n,d=p.cuentaOrigen||"default",v=!a||!a.length||a.includes(d),x=!a||!a.length||a.includes(i._id),I=r==="pension"?"pension":"capital-mobiliario",A=m=>{v&&o.push({fecha:m,concepto:`Aportación → ${i.nombre}`,cuantia:p.importe,tipo:"gasto",tags:["aportacion","transferencia",I],cuenta:d,sourceId:p._id,sourceType:"aportacion-out"}),x&&o.push({fecha:m,concepto:`Aportación ${i.nombre} (${p.periodicidad||"mensual"})`,cuantia:p.importe,tipo:"ingreso",tags:["aportacion","transferencia",I],cuenta:i._id,sourceId:p._id,sourceType:"aportacion-in"})},g={mensual:1,trimestral:3,semestral:6,anual:12}[p.periodicidad||"mensual"]||1;let b=h.getFullYear(),f=h.getMonth();const $=Math.ceil(240/g)+2;for(let m=0;m<$;m++){const y=new Date(b,f+1,0).getDate(),S=V(new Date(b,f,Math.min(h.getDate(),y))),w=G(S);if(w>n||w>u)break;w>=s&&w>=h&&A(S),f+=g,f>=12&&(b+=Math.floor(f/12),f=f%12)}}}return o}function Pa(t,e,a=null,o=[]){const s=[];for(const n of t){if(!n.activo||!n.interes||n.interes<=0||a&&a.length>0&&!a.includes(n._id))continue;const i=G(e.start),r=G(e.end),l=n.periodoCobro||"mensual",p=l==="mensual",h=p?null:{diario:864e5,semanal:7*864e5}[l]||864e5,u=p?1/12:h/(365.25*864e5);let d=Jt(n,e.start);const v=o.filter(A=>A.cuenta===n._id).map(A=>({fecha:A.fecha,delta:A.tipo==="ingreso"?Math.abs(A.cuantia):-Math.abs(A.cuantia)})).sort((A,g)=>A.fecha.localeCompare(g.fecha));let x=0,I=new Date(i);for(;I<=r;){const A=p?new Date(I.getFullYear(),I.getMonth()+1,I.getDate()):new Date(I.getTime()+h),g=new Date(Math.min(A.getTime(),r.getTime()+1)),b=V(g);let f=0;for(;x<v.length&&v[x].fecha<b;)f+=v[x].delta,x++;const $=d,m=d+f,y=Math.max(0,($+m)/2);d=m;const S=p?u:(g.getTime()-I.getTime())/(365.25*864e5),w=y*(Math.pow(1+n.interes/100,S)-1);w>.001&&s.push({fecha:V(I),concepto:`Interés ${n.nombre}`,cuantia:w,tipo:"ingreso",tags:["interes","cuenta"],cuenta:n._id,sourceId:n._id,sourceType:"account-interest"}),I=A}}return s}function Da(t,e,a,o=null){const s=[],n=e||gt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),l=Aa(r,n),p={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:l,tags:["irpf","fiscal"]};s.push(...Kt([p],a,o))}return s}const Ss=[5,11,2,8],Ms={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function Ta(t,e,a=null,o=[],s=()=>gt){const n=[],i=G(e.start),r=G(e.end),l=o.length>0,p={};for(const d of t){const v=d.grupoNomina||"";p[v]||(p[v]=[]),p[v].push(d)}for(const d of Object.keys(p))p[d].sort((v,x)=>(x.bruto||0)-(v.bruto||0));function h(d,v){if(!l||!d.mesActualizacionIPC)return d.bruto||0;const x=d.fechaInicio||e.start,I=G(x),A=G(v);let g=0;for(let f=I.getFullYear();f<=A.getFullYear();f++){const $=new Date(f,d.mesActualizacionIPC-1,1);$>I&&$<=A&&g++}if(g===0)return d.bruto||0;const b=V(new Date(I.getFullYear()+g,0,1));return(d.bruto||0)*pt(o,x,b)}function u(d,v){const x=h(d,v),I=(d.retribucionFlexible||[]).reduce((D,C)=>D+(C.importe||0)*12,0),A=Math.max(0,x-I);if(d.irpfModo==="manual")return A*((d.irpfPct||0)/100);const g=s(parseInt(v.slice(0,4))),b=d.grupoNomina||"";if(!b)return ut(St(x,I),g);const f=p[b].filter(D=>D.activo),$=f.reduce((D,C)=>D+h(C,v),0),m=f.reduce((D,C)=>D+(C.retribucionFlexible||[]).reduce((M,z)=>M+(z.importe||0)*12,0),0),y=Math.max(0,$-m),S=St($,m),w=Math.max(0,x-I),E=y>0?S*(w/y):0,_=f.filter(D=>D._id!==d._id&&(D.bruto||0)>(d.bruto||0)).reduce((D,C)=>{const M=(C.retribucionFlexible||[]).reduce((F,T)=>F+(T.importe||0)*12,0),z=Math.max(0,h(C,v)-M);return D+(y>0?S*(z/y):0)},0);return ut(_+E,g)-ut(_,g)}for(const d of t){if(!d.activo)continue;const v=d.cuenta||"default";if(a&&a.length>0&&!a.includes(v))continue;const x=Math.max(1,d.nPagas||12),I=G(d.fechaInicio||e.start),A=d.fechaFin?G(d.fechaFin):r,g=b=>{const f=h(d,b),$=u(d,b),m=(d.retribucionFlexible||[]).reduce((M,z)=>M+(z.importe||0)*12,0),y=Math.max(0,f-m),S=(d.ssPct??6.35)/100,w=y*S,E=y/x,_=$/x,D=w/x,C=d.representacion==="simplificado"?E-D-_:E;n.push({fecha:b,concepto:d.nombre,cuantia:C,tipo:"ingreso",cuenta:v,tags:d.tags||[],sourceId:d._id,sourceType:"nomina"}),d.representacion==="detallado"&&(D>0&&n.push({fecha:b,concepto:`SS ${d.nombre}`,cuantia:D,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:d._id+"_ss",sourceType:"nomina"}),_>0&&n.push({fecha:b,concepto:`IRPF ${d.nombre}`,cuantia:_,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:d._id+"_irpf",sourceType:"nomina"}));for(const M of d.retribucionFlexible||[])!M.cuenta||!(M.importe>0)||a&&a.length>0&&!a.includes(M.cuenta)||n.push({fecha:b,concepto:`${d.nombre} — ${Ms[M.tipo]||M.tipo}`,cuantia:M.importe,tipo:"ingreso",cuenta:M.cuenta,tags:["retribucion-flexible",M.tipo],sourceId:`${d._id}_flex_${M._id||M.tipo}`,sourceType:"nomina"})};if(x<=12){const b=x===12?1:Math.round(12/x),f=I.getDate();let $=I.getFullYear(),m=I.getMonth();for(let y=0;y<300;y++){const S=new Date($,m+1,0).getDate(),w=new Date($,m,Math.min(f,S));if(w>r||w>A)break;w>=i&&w>=I&&g(V(w)),m+=b,m>=12&&($+=Math.floor(m/12),m=m%12)}}else{const b=x-12,f=I.getDate();let $=I.getFullYear(),m=I.getMonth();for(let w=0;w<300;w++){const E=new Date($,m+1,0).getDate(),_=new Date($,m,Math.min(f,E));if(_>r||_>A)break;_>=i&&_>=I&&g(V(_)),m++,m>=12&&($++,m=0)}const y=Math.max(I.getFullYear(),i.getFullYear()),S=Math.min((d.fechaFin?A:r).getFullYear(),r.getFullYear());for(let w=y;w<=S;w++)for(const E of Ss.slice(0,b)){const _=new Date(w,E,15);_>=i&&_<=r&&_>=I&&_<=A&&g(V(_))}}}return n}function Na(t,e,a,o=null,s="default"){const n=[];if(!e||e.length===0)return n;const i=G(a.start),r=G(a.end),l=Y(),p=t.filter(u=>u.activo&&u.tipo==="gasto"&&u.tipoFrecuencia==="mensual");let h=new Date(i.getFullYear(),i.getMonth(),1);for(;h<=r;){const u=h.getFullYear(),d=h.getMonth(),v=u+"-"+String(d+1).padStart(2,"0"),x=v+"-01",I=V(new Date(u,d+1,0)),A=V(new Date(u,d,15));let g=0;for(const b of p){if(o&&o.length>0&&!o.includes(b.cuenta||"default")||b.fechaInicio&&b.fechaInicio>I||b.fechaFin&&b.fechaFin<x)continue;const f=b.fechaInicio||l,$=pt(e,f,A);if($<=1)continue;const m=Math.max(1,b.frecuencia||1);g+=b.cuantia*($-1)/m}g>.01&&n.push({fecha:A,concepto:"Incremento coste de vida",cuantia:g,tipo:"gasto",tags:["inflacion"],cuenta:s,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),h=new Date(u,d+1,1)}return n}function Ra(t,e,a,o="default"){const s=[];if(!e||e.length===0||t<=0)return s;const n=G(a.start),i=G(a.end),r=[...e].sort((p,h)=>p.year-h.year);let l=new Date(n.getFullYear(),n.getMonth(),1);for(;l<=i;){const p=l.getFullYear(),h=l.getMonth(),u=p+"-"+String(h+1).padStart(2,"0"),d=V(new Date(p,h,15)),v=r.filter(b=>b.year<=p),x=v.length>0?v[v.length-1]:r[0],I=x?x.tasa/100:0,A=Math.pow(1+I,1/12)-1,g=t*A;g>.01&&s.push({fecha:d,concepto:"Pérdida ahorro por inflación",cuantia:g,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+u,sourceType:"inflacion"}),l=new Date(p,h+1,1)}return s}function Oa(t,e,a){const o=a.fechaReferencia||a.dashboardStart,s=o<a.dashboardStart?a.dashboardStart:o>a.dashboardEnd?a.dashboardEnd:o,n=e.reduce((u,d)=>u+Jt(d,s),0),i=t.filter(u=>u.fecha<s),r=t.filter(u=>u.fecha>=s),l=[];let p=n;for(const u of[...i].reverse()){const d=u.tipo==="ingreso"?Math.abs(u.cuantia):-Math.abs(u.cuantia);l.unshift({...u,delta:d,saldoAcum:p}),p-=d}const h=[];p=n;for(const u of r){const d=u.tipo==="ingreso"?Math.abs(u.cuantia):-Math.abs(u.cuantia);p+=d,h.push({...u,delta:d,saldoAcum:p})}return[...l,...h]}function ws(t,e,a,o=null){const s=e.filter(n=>n.activo&&(!o||o.length===0||o.includes(n._id)));return Oa([...t].sort((n,i)=>n.fecha.localeCompare(i.fecha)),s,a)}function Qt(t){const{loans:e,expenses:a,accounts:o,config:s}=t,n=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],l={start:s.dashboardStart,end:s.dashboardEnd},p=a.filter(I=>I.tipo!=="transferencia"),h=a.filter(I=>I.tipo==="transferencia"),u={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let d=[];d=d.concat(Kt(p,l,n)),d=d.concat(za(e,l,n)),d=d.concat(_a(h,l,n,u)),d=d.concat(Fa(o,l,n));const v=Pa(o,l,n,d);if(d=d.concat(v),d=d.concat(Da(a,s.tramos_irpf,l,n)),d=d.concat(Ta(i,l,n,r,t.resolverTramosIRPF)),s.usarInflacion&&r.length>0){const I=(o.find(b=>b.activo&&b.esCuentaPrincipal)||o.find(b=>b.activo)||{_id:"default"})._id;d=d.concat(Na(p,r,l,n,I));const g=o.filter(b=>b.activo&&(!n||n.length===0||n.includes(b._id))).reduce((b,f)=>b+Jt(f,s.dashboardStart),0);d=d.concat(Ra(g,r,l,I))}d.sort((I,A)=>I.fecha.localeCompare(A.fecha));const x=o.filter(I=>I.activo&&(!n||n.length===0||n.includes(I._id)));return Oa(d,x,s)}function Cs(t,e,a=null){const o=Y(),n=e.filter(r=>r.activo&&(!a||a.length===0||a.includes(r._id))).reduce((r,l)=>r+rt(l),0),i=t.filter(r=>r.fecha<=o);return i.length===0?n:i[i.length-1].saldoAcum}function qa(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const s of o.tags||["sin_tag"])a.set(s,(a.get(s)||0)+Math.abs(o.cuantia));return a}function js(t,e){const a=[];let o=!1;for(let s=0;s<t.length;s++){const n=t[s],i=n.saldoAcum;i<0&&(s===0||t[s-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:n.fecha,saldo:i,mensaje:`Saldo negativo (${j(i)}) a partir del ${n.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:n.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${j(i)} < ${j(e)}) desde ${n.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:n.fecha,saldo:i,mensaje:`Recuperación del colchón el ${n.fecha} (${j(i)})`})))}return a}function Es(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=G(e.dashboardStart),s=G(e.dashboardEnd),n=Math.max(1,(s.getTime()-o.getTime())/(30.44*864e5));return a/n}function zs(t,e,a=Y()){const o=new Set,s=e.map(r=>{const l=r.fechaInicialSaldo||"",p={};l&&l<=a&&(p[l]=r.saldoInicial||0);for(const h of r.historicoSaldos||[])h.fecha<=a&&(!l||h.fecha>=l)&&(p[h.fecha]=h.saldo);return Object.keys(p).forEach(h=>o.add(h)),p}),n={};for(const r of[...o].sort()){let l=0;for(let p=0;p<e.length;p++){const h=Object.entries(s[p]).filter(([u])=>u<=r);h.length>0?(h.sort(([u],[d])=>d.localeCompare(u)),l+=h[0][1]):l+=e[p].saldoInicial||0}n[r]=l}const i=[];for(const[r,l]of Object.entries(n).sort(([p],[h])=>p.localeCompare(h))){const p=t.filter(v=>v.fecha<=r),h=p.length>0?p[p.length-1].saldoAcum:null;if(h===null)continue;const u=l-h,d=h!==0?u/Math.abs(h)*100:0;i.push({cuenta:"Total",fecha:r,estimado:h,real:l,desv:u,pct:d})}return i}const _s=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:zs,detectarPuntosCriticos:js,mediaMensualGastos:Es},Symbol.toStringTag,{value:"Module"}));function Xt(t,e=new Date){const a=V(e),o=new Date(e);o.setMonth(o.getMonth()+1);const s=V(o),n=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Kt(n,{start:a,end:s}).reduce((r,l)=>r+Math.abs(l.cuantia),0)}function Oe(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+Nt(a.capital,a.tin,a.meses),0)}function La(t,e,a,o){return e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0?e.colchonFijo:(Xt(t,o)+Oe(a))*(e.colchonMeses||6)}function Ba(t,e,a,o,s){const i=[...e.colchonPuntos||[]].sort((l,p)=>l.fecha.localeCompare(p.fecha)).filter(l=>l.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(Xt(t,s)+Oe(a))*(i.meses||6):La(t,e,a,s)}function fe(t,e,a,o,s,n=!1,i){const r=[...t.puntos||[]].sort((h,u)=>h.fecha.localeCompare(u.fecha)),l=r.filter(h=>h.fecha<=s).pop()||(n?r[0]:null);return l?l.tipo==="fijo"?l.importe||0:(Xt(e,i)+Oe(o))*(l.meses||1):0}function Fs(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function Ps(t,e){const a={};for(const o of e)a[o._id]=rt(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=Fs(o)),{fecha:o.fecha,saldos:{...a}}))}function Ds(t,e,a,o,s,n,i){const r=[];for(const l of(t||[]).filter(p=>p.activo!==!1)){let p=!1;for(let h=0;h<e.length;h++){const u=e[h],d=fe(l,o,s,n,u.fecha,!1,i);if(d<=0){p=!1;continue}const v=!l.cuentas||l.cuentas.length===0?u.saldoAcum:l.cuentas.reduce((x,I)=>{var A,g;return x+(((g=(A=a[h])==null?void 0:A.saldos)==null?void 0:g[I])||0)},0);v<d&&!p?(p=!0,r.push({tipo:"bajo_margen",fecha:u.fecha,saldo:v,target:d,nombre:l.nombre,mensaje:`⚠ ${l.nombre}: ${j(v)} < ${j(d)} desde ${u.fecha}`})):v>=d&&p&&(p=!1,r.push({tipo:"recuperacion_margen",fecha:u.fecha,saldo:v,target:d,nombre:l.nombre,mensaje:`✓ ${l.nombre}: recuperado el ${u.fecha}`}))}}return r}const Ts=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:La,calcColchonEnFecha:Ba,calcGastoBasicoMensual:Xt,calcMargenEnFecha:fe,detectarCrucesMargenes:Ds,saldosPorCuentaEnExtracto:Ps},Symbol.toStringTag,{value:"Module"}));function Ns(t){if(!t||t.showColchon===!1)return null;const e=t.colchonPuntos??[];return e.length>0?{nombre:"Colchón",puntos:[...e]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function ka(t,e){return Yt(G(t),G(e))}const Rs=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ha(t,e){const[a,o,s]=t.split("-").map(Number),n=t.slice(0,4)===e.slice(0,4);return`${s} de ${Rs[o-1]}${n?"":` de ${a}`}`}function Ga(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Os(t,e={}){const{hoy:a=Y(),horizonteCritico:o=365,horizonteAviso:s=120,maximo:n=4,incertidumbre:i}=e,r=[];for(const u of t.puntosCriticos??[])u.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:u.fecha,distancia:Math.abs(u.saldo),titulo:d=>d?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:d=>`El ${d} el saldo proyectado baja a ${j(u.saldo)}.`}):u.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:u.fecha,distancia:Math.abs(u.saldo),titulo:d=>d?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:d=>`El ${d} el saldo queda en ${j(u.saldo)}, por debajo del colchón.`});for(const u of t.crucesMargenes??[])u.tipo==="bajo_margen"&&r.push({id:`margen:${u.nombre}`,gravedad:"aviso",fecha:u.fecha,distancia:Math.max(0,u.target-u.saldo),titulo:d=>d?`Podrías bajar de «${u.nombre}»`:`Bajas de «${u.nombre}»`,detalle:d=>`El ${d} tendrías ${j(u.saldo)}, y el margen pide ${j(u.target)}.`});const l=new Map;for(const u of r){const d=l.get(u.id);(!d||u.fecha<d.fecha)&&l.set(u.id,u)}const p=[];for(const u of l.values()){const d=ka(a,u.fecha);if(d<0||d>(u.gravedad==="critico"?o:s))continue;const v=i?i(d):0,x=v>0&&u.distancia<v;p.push({id:u.id,gravedad:u.gravedad,fecha:u.fecha,dias:d,plazo:Ga(d),titulo:u.titulo(x),detalle:u.detalle(Ha(u.fecha,a)),incierto:x})}const h={critico:0,aviso:1};return p.sort((u,d)=>u.fecha.localeCompare(d.fecha)||h[u.gravedad]-h[d.gravedad]),p.slice(0,n)}const qs=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:Ns,construirAvisos:Os,describirPlazo:Ga,diasEntreISO:ka,fechaEnPalabras:Ha},Symbol.toStringTag,{value:"Module"}));class Ls extends Error{constructor(a,o){super(`La funcionalidad "${a}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);ls(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=a}}let Zt=null;function Bs(t){const e=Zt;return Zt=t,()=>{Zt=e}}function Va(t){return Zt?Zt(t):!0}function Ua(t,e){if(!Va(t))throw new Ls(t,e)}const Ya=[];function qe(){const t=new Map,e=new WeakMap;let a=1,o=0,s=0;const n=l=>{if(!l||typeof l!="object")return 0;const p=e.get(l);if(p)return p;const h=a++;return e.set(l,h),h},i=l=>l.map(p=>[p._id,p.capital,p.tin,p.meses,p.fechaInicio,p.comisionAmort||0,p.comisionApertura||0,p.diaPago||"",p.activo?1:0,p.cuenta||"",(p.amortizaciones||[]).map(h=>`${h.fecha}:${h.cantidad}:${h.tipo||""}`).sort().join(",")].join("|")).join(";");function r(l){const p=[i(l.loans),n(l.expenses),n(l.accounts),n(l.nominas),n(l.inflacionPeriodos),l.config.dashboardStart,l.config.dashboardEnd,l.config.fechaReferencia||"",l.config.usarInflacion?1:0,(l.filtroAccounts||[]).join(",")].join("#"),h=t.get(p);if(h)return s++,h;o++;const u=Qt(l);return t.set(p,u),u}return{statement:r,stats:()=>({hits:s,misses:o}),clear:()=>t.clear()}}function Le(t,e,a,o,s={},n=qe()){Ua("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:r=36,minAmortizable:l=500,tipoAmort:p="plazo",fechaPrimeraAmort:h=null,loanIds:u=null,nominas:d=Ya,sourceAccountId:v=null,selectedMarginIds:x=null,hoy:I=new Date}=s,A=V(I),g=Math.min(120,Math.max(1,r)),b=a.filter(O=>O.activo),f=b.map(O=>O._id),$=b.find(O=>O.esCuentaPrincipal)||b[0],m=v&&f.includes(v)?b.find(O=>O._id===v):$,y=m==null?void 0:m._id,S=t.filter(O=>O.activo&&!O.simulacion&&(!u||u.includes(O._id))).sort((O,H)=>H.tin-O.tin),w=!!x&&x.length>0,E=(o.margenesSeguridad||[]).filter(O=>O.activo!==!1).filter(O=>!O.cuentas||O.cuentas.length===0||O.cuentas.includes(y)).filter(O=>!w||x.includes(O._id));if(S.length===0)return{plan:[],margenesAplicados:E.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const _={};for(const O of S)_[O._id]=[];const D=[];function C(O){const H=new Date(I.getFullYear(),I.getMonth()+O,1),U=H.getFullYear(),K=H.getMonth(),Q=`${U}-${String(K+1).padStart(2,"0")}`,st=V(new Date(U,K,Math.min(15,new Date(U,K+1,0).getDate())));return{label:Q,dia15:st}}function M(O,H){const U=[...O.amortizaciones||[],..._[O._id]],{tabla:K}=at({...O,amortizaciones:U}),Q=K.filter(nt=>nt.fecha<=H);if(Q.length>0)return Q[Q.length-1].capitalPendiente;const st=U.filter(nt=>nt.fecha<=H).reduce((nt,vt)=>nt+vt.cantidad,0);return Math.max(0,O.capital-st)}function z(O){const H=t.map(it=>({...it,amortizaciones:[...it.amortizaciones||[],..._[it._id]||[]]})),U={...o,dashboardStart:A,dashboardEnd:O},K=n.statement({loans:H,expenses:e,accounts:a,config:U,filtroAccounts:null,nominas:d}),Q=b.reduce((it,Ut)=>it+rt(Ut),0),st=m?rt(m):0,nt=Q>0?st/Q:1;let vt=st,de=Q;for(const it of K){const Ut=it.delta??(it.tipo==="ingreso"?Math.abs(it.cuantia):-Math.abs(it.cuantia));it.cuenta===y?vt+=Ut:f.includes(it.cuenta)||(vt+=Ut*nt),de=it.saldoAcum}return{source:vt,total:de}}function F(O){const{source:H}=z(O);if(H<=0)return H;let U=0;for(const K of E){const Q=fe(K,e,o,t,O,!0,I);Q>U&&(U=Q)}return H-U}const T=2;let R=0;if(h){for(let O=0;O<g;O++)if(C(O).dia15>=h){R=O;break}}for(let O=0;O<g;O++){if((O-R)%i!==0||O<R)continue;const{label:H,dia15:U}=C(O);if(U<A)continue;const K=F(U)-T;if(K<l)continue;let Q=K,st=0;for(const nt of S){if(Q<l)break;const vt=M(nt,U);if(vt<1)continue;const de=nt.comisionAmort||0,it=1+de/100,Ut=Math.floor(Q/it),is=Math.min(Ut,vt);if(is<l)continue;const ue=Math.min(Math.floor(is),Math.floor(vt)),rs=+(ue*de/100).toFixed(2),da=ue+rs;da>Q||(_[nt._id].push({_id:`opt_${H}_${nt._id}`,fecha:U,cantidad:ue,tipo:p,simulacion:!0}),st+=da,D.push({mes:H,fechaAmort:U,loanId:nt._id,loanNombre:nt.nombre,tin:nt.tin,capitalAntes:vt,cantidadAmort:ue,comision:rs,capitalDespues:Math.max(0,vt-ue),saldoDisponible:K+T,excedente:K,saldoDespues:K+T-st,tipoAmort:p}),Q-=da)}}const P=D.reduce((O,H)=>O+H.cantidadAmort,0),B=D.reduce((O,H)=>O+H.comision,0),L=S.map(O=>{const H=_[O._id];if(!H.length)return null;const U=at(O),K=at({...O,amortizaciones:[...O.amortizaciones||[],...H]});return{loanId:O._id,nombre:O.nombre,tin:O.tin,fechaFinSin:U.fechaFin,fechaFinCon:K.fechaFin,mesesAhorrados:U.mesesReales-K.mesesReales,interesesSin:U.totalIntereses,interesesCon:K.totalIntereses,ahorroIntereses:U.totalIntereses-K.totalIntereses,numAmortizaciones:H.length,totalAmortizado:H.reduce((Q,st)=>Q+st.cantidad,0)}}).filter(O=>O!==null),k=L.reduce((O,H)=>O+H.ahorroIntereses,0);return{plan:D,margenesAplicados:E.length,totalAmortizado:P,totalComisiones:B,totalAhorroIntereses:k,resumenPorLoan:L}}function Ja(t,e,a,o,s={},n){Ua("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:r=500,tipoAmort:l="plazo",fechaObjetivo:p=null,frecuencias:h=[1,2,3,6,12],fechaPrimeraAmort:u=null,loanIds:d=null,nominas:v=Ya,sourceAccountId:x=null,selectedMarginIds:I=null,hoy:A=new Date}=s,g=n??qe(),b=V(A),f=p||V(new Date(A.getFullYear(),A.getMonth()+i,1));function $(S){const w=t.map(C=>({...C,amortizaciones:[...C.amortizaciones||[],...S[C._id]||[]]})),E={...o,dashboardStart:b,dashboardEnd:f},_=g.statement({loans:w,expenses:e,accounts:a,config:E,filtroAccounts:null,nominas:v});if(_.length===0)return a.filter(C=>C.activo).reduce((C,M)=>C+rt(M),0);const D=_.filter(C=>C.fecha<=f);return D.length>0?D[D.length-1].saldoAcum:_[0].saldoAcum}const m=$({}),y=h.map(S=>{const w=Le(t,e,a,o,{frecuencia:S,mesesHorizonte:i,minAmortizable:r,tipoAmort:l,fechaPrimeraAmort:u,loanIds:d,nominas:v,sourceAccountId:x,selectedMarginIds:I,hoy:A},g),E={};for(const D of t)E[D._id]=[];for(const D of w.plan)E[D.loanId].push({_id:D.mes+"_"+D.loanId,fecha:D.fechaAmort,cantidad:D.cantidadAmort,tipo:l,simulacion:!0});const _=$(E);return{frecuencia:S,label:S===1?"Mensual":`Cada ${S} meses`,numAmortizaciones:w.plan.length,totalAmortizado:w.totalAmortizado,totalComisiones:w.totalComisiones,ahorroIntereses:w.totalAhorroIntereses,saldoObjetivo:_,gananciaSaldo:_-m,valorTotal:w.totalAhorroIntereses+(_-m),plan:w.plan,resumenPorLoan:w.resumenPorLoan}}).filter(S=>S.numAmortizaciones>0);if(y.length>0){const S=Math.max(...y.map(_=>_.ahorroIntereses)),w=Math.max(...y.map(_=>_.saldoObjetivo)),E=Math.max(...y.map(_=>_.valorTotal));y.forEach(_=>{_.esMejorIntereses=_.ahorroIntereses===S,_.esMejorSaldo=_.saldoObjetivo===w,_.esMejorValor=_.valorTotal===E})}return{resultados:y,saldoBase:m,fechaObjetivo:f}}const ks=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:Ja,createStatementMemo:qe,defaultHoyISO:Y,optimizarAmortizaciones:Le},Symbol.toStringTag,{value:"Module"})),Hs=30.44*864e5;function Wa(t){const e=t.getFullYear(),a=t.getMonth();return{desde:V(new Date(e,a,1)),hasta:V(new Date(e,a,we(e,a)))}}function Ka(t){const[e,a]=t.split("-").map(Number);return Wa(new Date(e,a-1,1))}function Gs(t,e){return Math.max(1,(G(e).getTime()-G(t).getTime())/Hs)}const Vs=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),Mt=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function Us(t,e){const a=new Map(e.map(n=>[n._id,n.clasificacion]));let o=0,s=0;for(const n of t){if(n.tipo!=="gasto"||n.sourceType!=="expense")continue;const i=a.get(n.sourceId??"");i!==null&&(i==="deseo"?s+=Math.abs(n.cuantia):o+=Math.abs(n.cuantia))}return{basicos:o,deseo:s}}function Ys(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=d=>d.sourceType==="loan"&&d.tipo==="gasto",s=e.loanIdsIniciados,n=Mt(t.filter(d=>d.tipo==="ingreso")),i=Mt(t.filter(d=>o(d)&&(!s||s.has(d.sourceId??"")))),r=Mt(t.filter(d=>o(d)&&e.hipotecaIds.has(d.sourceId??""))),l=Mt(t.filter(d=>d.sourceType==="loan-amort")),p=Mt(t.filter(d=>d.sourceType==="account-interest")),{basicos:h,deseo:u}=Us(t,e.expenses);return{ingresos:n/a,cuotas:i/a,cuotasHipoteca:r/a,amortizaciones:l/a,gastosBasicos:h/a,gastosDeseo:u/a,gastosTotales:(i+h+u)/a,intereses:p/a}}function Qa(t,e){return t.reduce((a,o)=>{const s=at(o).tabla.filter(n=>!n.esAmortizacion&&n.fecha<=e);return a+(s.length>0?s[s.length-1].capitalPendiente:o.capital||0)},0)}function Js(t,e,a,o){const s=t.filter(p=>p.activo&&!p.simulacion&&(p.fechaInicio||"")<=a),n=s.reduce((p,h)=>{if((h.amortizaciones||[]).filter(x=>x.fecha>=e&&x.fecha<=a).length===0)return p;const d=at(h).totalIntereses,v=at({...h,amortizaciones:(h.amortizaciones||[]).filter(x=>x.fecha<e||x.fecha>a)}).totalIntereses;return p+Math.max(0,v-d)},0),i=s.filter(p=>p.mostrarFechaFinEnDashboard!==!1).map(p=>({loan:p,fechaFin:at(p).fechaFin})).filter(p=>!!p.fechaFin&&p.fechaFin>=e&&p.fechaFin<=a),r=s.map(p=>at(p).tabla),l=p=>{const{desde:h,hasta:u}=Ka(p);return r.reduce((d,v)=>{const x=v.find(I=>!I.esAmortizacion&&I.fecha>=h&&I.fecha<=u);return d+(x?x.cuota:0)},0)};return{deudaInicio:Qa(s,e),deudaFin:Qa(s,a),ahorroIntereses:n,ahorroInteresesMes:o>0?n/o:0,cuotasInicio:l(e.slice(0,7)),cuotasFin:l(a.slice(0,7)),finEnPeriodo:i}}function Ws(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:Mt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function Xa(t,e=new Set,a="desglosado"){if(e.size===0)return qa(t,"gasto");const o=new Map;for(const s of t){if(s.tipo!=="gasto")continue;const n=s.tags||[],i=n.filter(p=>e.has(p)),r=n.filter(p=>!e.has(p)),l=a==="porgrupos"&&i.length>0?i:r;for(const p of l)o.set(p,(o.get(p)||0)+Math.abs(s.cuantia))}return o}function Ks(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...Xa(t,e.grupoTags,e.modo).entries()].filter(([s])=>!a||a.size===0||a.has(s)).map(([s,n])=>({tag:s,total:n/o})).sort((s,n)=>n.total-s.total)}function Qs(t,e){const a=e.reduce((o,s)=>o+rt(s),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:Mt(t.filter(o=>o.tipo==="gasto")),totalIngresos:Mt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Xs(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function Zs(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function tn(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}function en(t,e){if(t.length===0)return[];const a=p=>e==="mes"?p.slice(0,7):p.slice(0,4),o=p=>e==="mes"?`${p}-01`:`${p}-01-01`,s=t[0],n=s.delta??(s.tipo==="ingreso"?Math.abs(s.cuantia):-Math.abs(s.cuantia));let i=(s.saldoAcum??0)-n;const r=[];let l=null;for(const p of t){const h=a(p.fecha),u=p.saldoAcum??i;(!l||l.periodo!==h)&&(l&&(i=l.cierre),l={periodo:h,inicio:o(h),apertura:i,cierre:u,maximo:Math.max(i,u),minimo:Math.min(i,u),eventos:0},r.push(l)),l.cierre=u,u>l.maximo&&(l.maximo=u),u<l.minimo&&(l.minimo=u),l.eventos+=1}return r}const an=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:en,cuentasVisibles:Xs,gastoPorTagOrdenado:Ks,idsHipoteca:Zs,idsPrestamosIniciados:tn,interesesPorCuenta:Ws,mesesDelPeriodo:Gs,metricasFlujo:Ys,rangoMes:Ka,rangoMesDe:Wa,resumenPrestamosPeriodo:Js,sinTransferencias:Vs,sumarGastosPorTag:Xa,totalesPeriodo:Qs},Symbol.toStringTag,{value:"Module"}));function on(t,e,a){const o=t||[];if(!o.length)return e;const s=o.find(i=>i.año===a);if(s)return s.tramos;const n=o.filter(i=>i.año<a).sort((i,r)=>r.año-i.año);return n.length?n[0].tramos:e}function bt(t,e){return a=>on(t,e,a)}const te=8,Za=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],to=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Be(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}function eo(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Za,tramosGananciasCapital:to,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function sn(t,e){return{loans:[],expenses:[],accounts:[Be(t)],nominas:[],goals:[],planes:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],config:eo(t,e)}}const ht=t=>Array.isArray(t)?t:[],nn=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function ee(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function ao(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function ke(t){const{varianza:e,inflacion:a,...o}=t;return o}function rn(t,e){const{hoyISO:a,finISO:o}=e,s={...t},n=nn(t.config),r={...eo(a,o)};for(const[h,u]of Object.entries(n))u!=null&&(r[h]=u);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Za),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=to),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),s.config=r;let l=ht(t.accounts).map(h=>{const u={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...h};return u.modeloFondo||(u.modeloFondo=u.esFondoPension?"pension":"cuenta"),delete u.esFondoPension,Array.isArray(u.historicoSaldos)||(u.historicoSaldos=[]),ee(u)});l.length===0&&(l=[Be(a)]);const p=l.filter(h=>h.esCuentaPrincipal);if(p.length===0){const h=l.find(u=>u._id==="default")||l[0];l=l.map(u=>({...u,esCuentaPrincipal:u._id===h._id}))}else if(p.length>1){let h=!1;l=l.map(u=>u.esCuentaPrincipal?h?{...u,esCuentaPrincipal:!1}:(h=!0,u):u)}return s.accounts=l,s.expenses=ht(t.expenses).map(h=>{const u={basico:!1,activo:!0,tags:[],historialPrecios:[],...h};return Array.isArray(u.tags)||(u.tags=[]),Array.isArray(u.historialPrecios)||(u.historialPrecios=[]),u.diaPago=ao(u.diaPago),ke(ee(u))}),s.loans=ht(t.loans).map(h=>{const u={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...h};return Array.isArray(u.tags)||(u.tags=[]),u.diaPago=ao(u.diaPago),u.amortizaciones=ht(u.amortizaciones).map(d=>ee(d)),ke(ee(u))}),s.nominas=ht(t.nominas).map(h=>{const u={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...h};return Array.isArray(u.tags)||(u.tags=[]),Array.isArray(u.retribucionFlexible)||(u.retribucionFlexible=[]),ke(ee(u))}),s.goals=ht(t.goals).map((h,u)=>{const d=Array.isArray(h.cuentaIds)?h.cuentaIds:h.cuentaId?[h.cuentaId]:[],{cuentaId:v,...x}=h;return{prioridad:u+1,completado:!1,usarColchon:!0,targetAmount:0,...x,cuentaIds:d}}),s.inflacion=ht(t.inflacion),s.tramosIRPFHistorico=ht(t.tramosIRPFHistorico),s.tramosGananciasCapitalHistorico=ht(t.tramosGananciasCapitalHistorico),s.escenarios=ht(t.escenarios).map(({inversiones:h,...u})=>u),s}const Ot=t=>Array.isArray(t)?t:[];let He=0;function ln(t){return He+=1,`${t}_${He.toString(36)}`}const cn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),dn=t=>typeof t=="number"&&Number.isFinite(t);function un(t,e){const a={...t};He=0;const o=Ot(t.transacciones),s=Ot(t.puntosControl),n=[...s],i=new Set(s.map(p=>`${p.cuentaId}|${p.fecha}`)),r=(p,h,u,d)=>{if(!cn(h)||!dn(u))return;const v=`${p}|${h}`;i.has(v)||(i.add(v),n.push({_id:ln("pc"),fecha:h,cuentaId:p,saldoCts:It(u),...typeof d=="string"&&d?{nota:d}:{}}))};for(const p of Ot(t.accounts)){const h=typeof p._id=="string"?p._id:null;if(h)for(const u of Ot(p.historicoSaldos))r(h,u.fecha,u.saldo,u.nota)}const l=Ot(t.history);if(l.length>0){const p=Ot(t.accounts),h=p.find(d=>d.esCuentaPrincipal)||p.find(d=>d.activo)||p[0],u=typeof(h==null?void 0:h._id)=="string"?h._id:"default";for(const d of l){const v=typeof d.cuenta=="string"?d.cuenta:typeof d.cuentaId=="string"?d.cuentaId:u;r(v,d.fecha,d.saldo,d.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=n.sort((p,h)=>String(p.fecha).localeCompare(String(h.fecha))),a}const Ge=t=>Array.isArray(t)?t:[],pn=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),mn=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Ve=0;function fn(){return Ve+=1,`tx_hp_${Ve.toString(36)}`}function vn(t,e){const a={...t};Ve=0;const o=[...Ge(t.transacciones)],s=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),n=Ge(t.expenses).map(i=>{const r=Ge(i.historialPrecios),l=typeof i._id=="string"?i._id:null,p=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",h=i.tipo==="ingreso"?"ingreso":"gasto",u=Array.isArray(i.tags)?i.tags.filter(x=>typeof x=="string"):[];if(l)for(const x of r){if(!x||!pn(x.fecha)||!mn(x.cuantia))continue;const I=h==="ingreso"?It(x.cuantia):-It(x.cuantia),A=`${l}|${x.fecha}|${I}`;s.has(A)||(s.add(A),o.push({_id:fn(),fecha:x.fecha,cuentaId:p,importeCts:I,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:u,estimacionId:l,tipo:h,origen:"importado",nota:typeof x.nota=="string"&&x.nota?x.nota:"Importado del historial de precios"}))}const{historialPrecios:d,...v}=i;return v});return a.expenses=n,a.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),a}const oo=t=>Array.isArray(t)?t:[],wt=(t,e="")=>typeof t=="string"&&t.trim()?t:e,qt=(t,e=0)=>typeof t=="number"&&Number.isFinite(t)?t:e,gn=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function bn(t,e){var h;const a={...t};if(Array.isArray(a.planes))return a;const o=oo(a.goals),s=oo(a.accounts),n=s.map(u=>{const d=qt(u.bloqueoMeses,0);return{_id:`veh_${wt(u._id,"x")}`,nombre:wt(u.nombre,"Cuenta"),rentabilidadRealAnual:qt(u.interes,0)/100,liquidez:u.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":d>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:qt(u.impuestoRetirada,0)/100,topeAportacionAnual:u.modeloFondo==="pension"?It(1500):null,riesgo:u.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:wt(u._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:qt(u.interes,0)>0}}),i=new Map(s.map((u,d)=>[wt(u._id,""),n[d]._id])),r=((h=n[0])==null?void 0:h._id)??"",l=o.map((u,d)=>{const v=Array.isArray(u.cuentaIds)?u.cuentaIds.map(I=>wt(I,"")):[],x=gn(u.targetDate);return{_id:wt(u._id,`obj_mig_${d}`),nombre:wt(u.nombre,`Objetivo ${d+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:It(qt(u.targetAmount,0)),fechaLimite:x,prioridad:qt(u.prioridad,d+1),modoAsignacion:x?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:u.completado===!0?"COMPLETADO":"PENDIENTE",notas:wt(u.notas,"")}}),p={_id:"plan_base",nombre:"Plan base",fechaInicio:e.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:n,objetivos:l,eventos:[],creadoEn:e.hoyISO};return a.planes=[p],a}const hn=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:rn},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:un},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:vn},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:bn}],yn=["history"];function so(t,e,a){let o=t;const s=[];for(const n of[...hn].sort((i,r)=>i.version-r.version))(e??0)>=n.version||(o=n.migrate(o,a),s.push(n.version));return{state:o,applied:s}}const ve="state_",Ue="state__schemaVersion",no="financeapp_",io="state__modificadoEn";function xn(t=localStorage,e=no){const a=o=>`${e}${o}`;return{get(o){try{const s=t.getItem(a(o));return s===null?null:JSON.parse(s)}catch{return null}},set(o,s){try{t.setItem(a(o),JSON.stringify(s)),o!==io&&t.setItem(a(io),JSON.stringify(Date.now()))}catch(n){console.error("No se pudo guardar en localStorage:",o,n)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(e)&&o.push(n.slice(e.length))}return o}}}function $n(t=localStorage,e=no){const a=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(ve)&&!n.startsWith(e)&&a.push(n)}const o=[];for(const s of a)try{const n=t.getItem(s);n!==null&&t.getItem(`${e}${s}`)===null&&(t.setItem(`${e}${s}`,n),o.push(s)),t.removeItem(s)}catch{}return o}function In({ventanaMs:t=15e3,ahora:e=()=>Date.now()}={}){let a=null;function o(){return a?e()-a.cuando>t?(a=null,null):a:null}return{registrar(s){a={...s,cuando:e()}},pendiente:o,tomar(){const s=o();return a=null,s},limpiar(){a=null}}}const An={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},escenarios:{articulo:"El",que:"supuesto"},planes:{articulo:"El",que:"plan"},goals:{articulo:"El",que:"objetivo"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function Sn(t,e){const a=An[t]??{articulo:"El",que:"elemento"},o=e.concepto??e.nombre??e.titulo??(e.year!==void 0?String(e.year):null);return o?`${a.articulo} ${a.que} «${String(o)}»`:`${a.articulo} ${a.que}`}function Mn(t){return V(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function wn({adapter:t,hoy:e=new Date}){const a=V(e),o=Mn(e);let s=sn(a,o);const n=new Set;let i=[];const r=In();function l(C){for(const M of n)M(C)}function p(C){t.set(`${ve}${C}`,s[C])}function h(){const C={};for(const T of Object.keys(s)){const R=t.get(`${ve}${T}`);R!==null&&(C[T]=R)}for(const T of yn){const R=t.get(`${ve}${T}`);R!==null&&(C[T]=R)}const M=t.get(Ue),{state:z,applied:F}=so(C,M,{hoyISO:a,finISO:o});if(s=z,u(),F.length>0){for(const T of Object.keys(s))p(T);t.set(Ue,te)}return i=F,{applied:F}}function u(){if(!Array.isArray(s.accounts)||s.accounts.length===0){s.accounts=[Be(a)],p("accounts");return}const C=s.accounts.filter(M=>M.esCuentaPrincipal);if(C.length===0)s.accounts=s.accounts.map((M,z)=>z===0?{...M,esCuentaPrincipal:!0}:M),p("accounts");else if(C.length>1){let M=!1;s.accounts=s.accounts.map(z=>z.esCuentaPrincipal?M?{...z,esCuentaPrincipal:!1}:(M=!0,z):z),p("accounts")}}function d(C){return s[C]}function v(C,M){s[C]=M,p(C),l(C)}function x(C){v("config",{...s.config,...C})}function I(C){return n.add(C),()=>n.delete(C)}function A(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function g(C,M){const z=[...s[C]],F={...M,_id:A()};return z.push(F),v(C,z),F}function b(C,M,z){const F=s[C].map(T=>T._id===M?{...T,...z}:T);v(C,F)}function f(C,M){const z=s[C],F=z.findIndex(T=>T._id===M);F<0||(r.registrar({col:C,item:z[F],indice:F}),v(C,z.filter((T,R)=>R!==F)))}function $(){const C=r.tomar();if(!C)return null;const M=[...s[C.col]];return M.splice(Math.min(C.indice,M.length),0,C.item),v(C.col,M),C}function m(){return r.pendiente()}function y(){const C=s.accounts||[],M=C.find(z=>z.esCuentaPrincipal&&z.activo)||C.find(z=>z.activo);return M?M._id:"default"}function S(C){var M;return((M=s.accounts.find(z=>z._id===C))==null?void 0:M.nombre)??C}function w(){return bt(s.tramosIRPFHistorico,s.config.tramos_irpf)}function E(){return bt(s.tramosGananciasCapitalHistorico,s.config.tramosGananciasCapital)}function _(){return structuredClone(s)}function D(C,M=null){const{state:z,applied:F}=so(C,M,{hoyISO:a,finISO:o});s=z,u();for(const T of Object.keys(s))p(T);t.set(Ue,te);for(const T of Object.keys(s))l(T);return{applied:F}}return{load:h,get:d,set:v,patchConfig:x,subscribe:I,addItem:g,updateItem:b,removeItem:f,deshacerBorrado:$,borradoPendiente:m,getPrincipalAccountId:y,accountName:S,resolverTramosIRPF:w,resolverTramosGanancias:E,snapshot:_,replaceAll:D,get schemaVersion(){return te},get migrationsApplied(){return[...i]},get today(){return a||Y()}}}const X={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},Ct=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:X.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:X.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:X.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:X.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:X.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro (antiguos)",descripcion:"Solo lectura: la copia previa al planificador. Los objetivos se gestionan en «Objetivos financieros». Apagada de fábrica; enciéndela si quieres revisar los antiguos antes de descartarlos.",grupo:X.dinero,porDefecto:!1,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:X.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:X.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:X.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:X.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:X.planificacion,porDefecto:!1},{id:"planner",nombre:"Objetivos financieros",descripcion:"Plan a largo plazo: objetivos que compiten por el flujo mensual y se encadenan al completarse.",grupo:X.planificacion,porDefecto:!0},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:X.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:X.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:X.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:X.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:X.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:X.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:X.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:X.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:X.datos,porDefecto:!1,dependencias:["sync-nube"]}],Cn=new Map(Ct.map(t=>[t.id,t]));function ae(t){return Cn.get(t)}function ro(t){return Ct.filter(e=>(e.dependencias||[]).includes(t))}function Ye(){const t={};for(const e of Ct)t[e.id]=e.porDefecto;return t}function lo(){const t=[],e=new Map;for(const a of Ct)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function jn(t){function e(){return{...Ye(),...t.get("config").features||{}}}function a(u){t.patchConfig({features:u})}function o(u,d=e(),v=new Set){const x=ae(u);if(!x)return!1;if(x.nucleo)return!0;if(d[u]===!1)return!1;if(v.has(u))return!0;v.add(u);for(const I of x.dependencias||[])if(!o(I,d,v))return!1;return!0}function s(u,d=e()){const v=ae(u);return v?(v.dependencias||[]).filter(x=>!o(x,d)):[]}function n(u,d){var f;const v=ae(u);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const x=e(),I=new Map(Ct.map($=>[$.id,o($.id,x)])),A={...x,[u]:d};let g;if(d){const $=[...v.dependencias||[]];for(;$.length;){const m=$.pop();A[m]===!1&&(A[m]=!0,g="dependencias-activadas"),$.push(...((f=ae(m))==null?void 0:f.dependencias)||[])}}else{const $=ro(u).map(m=>m.id);for(;$.length;){const m=$.pop();A[m]!==!1&&(A[m]=!1,g="cascada-apagado"),$.push(...ro(m).map(y=>y.id))}}return a(A),{cambiadas:Ct.filter($=>o($.id,A)!==I.get($.id)).map($=>$.id),motivo:g}}function i(){const u=e();return Ct.map(d=>{const v=s(d.id,u);return{...d,activa:o(d.id,u),...v.length>0&&u[d.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const u=e();return lo().map(({grupo:d,features:v})=>({grupo:d,features:v.map(x=>{const I=s(x.id,u);return{...x,activa:o(x.id,u),...I.length>0&&u[x.id]!==!1?{bloqueadaPor:I}:{}}})}))}function l(){a(Ye())}function p(u){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...u?{nombre:u}:{},features:e()}}function h(u){const d=u,v=d&&typeof d=="object"&&d.features&&typeof d.features=="object"?d.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const x=Ye(),I=[],A=[];for(const[g,b]of Object.entries(v)){if(!ae(g)){A.push(g);continue}if(typeof b!="boolean"){A.push(g);continue}x[g]=b,I.push(g)}return a(x),{aplicadas:I,ignoradas:A}}return{isEnabled:u=>o(u),setEnabled:n,estado:i,estadoPorGrupo:r,reset:l,exportProfile:p,importProfile:h,bloqueadaPor:u=>s(u)}}const oe=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Lt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function En(t){var s,n;const a=(((s=t.bloqueadaPor)==null?void 0:s.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(n=t.bloqueadaPor)==null?void 0:n.map(oe).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${oe(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${oe(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${oe(t.descripcion)}</div>
        ${a}
      </div>
    </div>`}function zn(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:s})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${oe(o)}</div>
        ${s.map(En).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function _n(t){var s;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-feature-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function Fn(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${zn(a)}`,s(i)}function s(i){var l,p,h;i.querySelectorAll("[data-feature-toggle]").forEach(u=>{u.addEventListener("change",()=>{var x;const d=u.dataset.featureToggle,v=a.setEnabled(d,u.checked);v.motivo==="dependencias-activadas"&&Lt(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&Lt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(x=t.onChange)==null||x.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(l=i.querySelector('[data-feature-action="export"]'))==null||l.addEventListener("click",()=>{const u=a.exportProfile(),d=new Blob([JSON.stringify(u,null,2)],{type:"application/json"}),v=URL.createObjectURL(d),x=e.createElement("a");x.href=v,x.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,x.click(),URL.revokeObjectURL(v),Lt(t,"Perfil de funcionalidades guardado")}),(p=i.querySelector('[data-feature-action="import"]'))==null||p.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var d,v;const u=(d=r.files)==null?void 0:d[0];if(u)try{const{aplicadas:x,ignoradas:I}=a.importProfile(JSON.parse(await u.text()));Lt(t,I.length>0?`Perfil cargado (${x.length} aplicadas, ${I.length} ignoradas por ser de otra versión)`:`Perfil cargado (${x.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,x),o(i)}catch(x){Lt(t,"No se pudo cargar el perfil: "+x.message,"err")}finally{r.value=""}}),(h=i.querySelector('[data-feature-action="reset"]'))==null||h.addEventListener("click",()=>{var u;a.reset(),Lt(t,"Funcionalidades restablecidas"),(u=t.onChange)==null||u.call(t,[]),o(i)})}function n(){const i=_n(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:n,renderInto:o}}const co={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function uo(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const s=e(o);a.style.display=s?"":"none",s?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function Pn({flags:t,document:e=document,router:a,rutasExtra:o}){function s(){const r=e.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function n(){let r=!1;const l=Object.entries((o==null?void 0:o())??{}).map(([p,h])=>[h,p]);for(const[p,h]of[...Object.entries(co),...l]){const u=t.isEnabled(p),d=e.querySelector(`.nav-btn[data-view="${h}"]`);d&&(d.style.display=u?"":"none"),!u&&s()===h&&(r=!0)}if(e.querySelectorAll(".nav-section").forEach(p=>{const h=[...p.querySelectorAll(".nav-btn[data-view]")];if(h.length===0)return;const u=h.some(d=>d.style.display!=="none");p.style.display=u?"":"none"}),uo(e,p=>t.isEnabled(p)),r){const p=a??globalThis.Router;p==null||p.navigate("dashboard")}}function i(r=e.body){if(typeof MutationObserver>"u")return()=>{};let l=!1;const p=new MutationObserver(()=>{if(!l){l=!0;try{uo(e,h=>t.isEnabled(h))}finally{l=!1}}});return p.observe(r,{childList:!0,subtree:!0}),()=>p.disconnect()}return{apply:n,observar:i,vistaPara:r=>co[r]}}const Dn="toast toast-deshacer";function Tn(t){const{store:e,rerender:a,duracionMs:o=12e3}=t,s=t.contenedor??(()=>document.getElementById("toast-container"));let n=null,i=null,r=null;function l(){i&&clearTimeout(i),i=null,n==null||n.remove(),n=null}function p(u){const d=s();if(!d)return;l();const v=document.createElement("div");v.className=Dn,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const x=document.createElement("span");x.textContent=`${Sn(u.col,u.item)} se ha eliminado.`,x.style.flex="1";const I=document.createElement("button");I.type="button",I.className="btn-secondary btn-sm",I.textContent="Deshacer",I.style.flexShrink="0",I.addEventListener("click",()=>{const A=e.deshacerBorrado();if(l(),!A)return;const g=s();if(g){const b=document.createElement("div");b.className="toast toast-ok",b.textContent="Deshecho.",g.appendChild(b),setTimeout(()=>b.remove(),2500)}a==null||a()}),v.appendChild(x),v.appendChild(I),d.appendChild(v),n=v,i=setTimeout(l,o)}const h=e.subscribe(()=>{const u=e.borradoPendiente();if(!u){r=null,l();return}u!==r&&(r=u,p(u))});return()=>{h(),l()}}function ge(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function po(t,e){const a=ge(t),o=ge(e);if(!o)return-1;const s=a.indexOf(o);return s<0?-1:s===0?0:/[\s\-/_(«"']/.test(a[s-1])?1:2}const _t=t=>{const e=Number(t);return Number.isFinite(e)?`${e.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function Nn(t){const e=[],a=o=>{var s,n;return((n=(s=t.accounts)==null?void 0:s.find(i=>i._id===o))==null?void 0:n.nombre)??""};for(const o of t.expenses??[]){const s=o.tipo==="ingreso";e.push({tipo:s?"ingreso":"gasto",etiqueta:s?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[_t(o.cuantia),a(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],a(o.cuenta)].join(" ")})}for(const o of t.accounts??[])e.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:_t(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])e.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:_t(o.capital),ruta:"loans",extra:[...o.tags??[],a(o.cuenta)].join(" ")});for(const o of t.nominas??[])e.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${_t(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.escenarios??[])e.push({tipo:"supuesto",etiqueta:"Supuesto",id:o._id,titulo:o.nombre,detalle:o.descripcion??"",ruta:"escenarios"});for(const o of t.planes??[]){e.push({tipo:"plan",etiqueta:"Plan",id:o._id,titulo:o.nombre,detalle:o.notas??"",ruta:"planner"});for(const s of o.objetivos??[])e.push({tipo:"objetivo",etiqueta:"Objetivo",id:s._id,titulo:s.nombre,detalle:[s.importeObjetivo!==null?_t(s.importeObjetivo/100):"",o.nombre].filter(Boolean).join(" · "),ruta:"planner"})}for(const o of t.goals??[])e.push({tipo:"objetivo",etiqueta:"Objetivo",id:o._id,titulo:o.nombre,detalle:_t(o.targetAmount),ruta:"accounts"});for(const o of t.transacciones??[])e.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,_t(o.importeCts/100),a(o.cuentaId)].filter(Boolean).join(" · "),ruta:"contabilidad",extra:(o.tags??[]).join(" ")});return e}function Rn(t,e,a={}){const{maximo:o=12,rutasDisponibles:s=null}=a,n=ge(e);if(n.length<2)return[];const i=l=>s===null||s.includes(l),r=[];for(const l of Nn(t)){if(!i(l.ruta))continue;const p=po(l.titulo,n),h=p>=0?-1:Math.min(po(l.extra??"",n),2);if(p<0&&h<0)continue;const u=p>=0?p:3;r.push({tipo:l.tipo,etiqueta:l.etiqueta,id:l.id,titulo:l.titulo,detalle:l.detalle,ruta:l.ruta,peso:u*1e3+Math.min(999,ge(l.titulo).length)})}return r.sort((l,p)=>l.peso-p.peso||l.titulo.localeCompare(p.titulo,"es")),r.slice(0,o)}const On="buscador-overlay",mo="btn-buscador";function qn(t){const e=t.doc??document,a=t.rutasDisponibles??(()=>null);let o=null,s=null,n=null,i=[],r=0;function l(){const $=e.createElement("div");$.id=On,$.className="modal-overlay",$.style.alignItems="flex-start",$.style.paddingTop="10vh";const m=e.createElement("div");m.className="modal-box",m.style.maxWidth="560px",m.style.padding="14px";const y=e.createElement("input");y.type="search",y.className="form-input",y.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",y.setAttribute("aria-label","Buscar en toda la aplicación"),y.autocomplete="off";const S=e.createElement("div");return S.style.marginTop="10px",S.style.maxHeight="52vh",S.style.overflowY="auto",m.appendChild(y),m.appendChild(S),$.appendChild(m),e.body.appendChild($),$.addEventListener("click",w=>{w.target===$&&I()}),y.addEventListener("input",()=>{r=0,h()}),y.addEventListener("keydown",v),o=$,s=y,n=S,$}function p(){if(n){if(n.textContent="",i.length===0){const $=e.createElement("div");$.style.padding="14px 4px",$.style.fontSize="13px",$.style.color="var(--text3)";const m=(s==null?void 0:s.value.trim())??"";$.textContent=m.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",n.appendChild($);return}i.forEach(($,m)=>{const y=e.createElement("button");y.type="button",y.className="buscador-fila",y.dataset.indice=String(m),m===r&&y.classList.add("activa");const S=e.createElement("div");S.style.minWidth="0";const w=e.createElement("div");w.textContent=$.titulo,w.style.fontSize="13px",w.style.overflow="hidden",w.style.textOverflow="ellipsis",w.style.whiteSpace="nowrap";const E=e.createElement("div");E.textContent=$.detalle,E.style.fontSize="11px",E.style.color="var(--text3)",E.style.overflow="hidden",E.style.textOverflow="ellipsis",E.style.whiteSpace="nowrap",S.appendChild(w),$.detalle&&S.appendChild(E);const _=e.createElement("span");_.className="tag",_.textContent=$.etiqueta,_.style.flexShrink="0",y.appendChild(S),y.appendChild(_),y.addEventListener("click",()=>d(m)),n.appendChild(y)})}}function h(){const $=(s==null?void 0:s.value)??"";i=Rn(t.estado(),$,{rutasDisponibles:a()}),r>=i.length&&(r=Math.max(0,i.length-1)),p()}function u($){var m,y;i.length!==0&&(r=(r+$+i.length)%i.length,p(),(y=(m=n==null?void 0:n.querySelector(".buscador-fila.activa"))==null?void 0:m.scrollIntoView)==null||y.call(m,{block:"nearest"}))}function d($){const m=i[$];m&&(I(),t.navegar(m.ruta))}function v($){$.key==="Escape"?($.preventDefault(),I()):$.key==="ArrowDown"?($.preventDefault(),u(1)):$.key==="ArrowUp"?($.preventDefault(),u(-1)):$.key==="Enter"&&($.preventDefault(),d(r))}function x(){const $=o??l();$.classList.remove("hidden"),$.style.display="",r=0,s&&(s.value="",s.focus()),h()}function I(){o&&(o.style.display="none",i=[])}function A(){return!!o&&o.style.display!=="none"}function g($){($.ctrlKey||$.metaKey)&&($.key==="k"||$.key==="K")&&($.preventDefault(),A()?I():x())}e.addEventListener("keydown",g);let b=null;function f(){const $=e.getElementById("period-bar");if(!$||e.getElementById(mo))return;const m=e.createElement("button");m.id=mo,m.type="button",m.className="btn-secondary",m.title="Buscar en toda la aplicación (Ctrl+K)",m.setAttribute("aria-label","Buscar"),m.textContent="🔍 Buscar",m.style.marginLeft="auto",m.addEventListener("click",x),$.appendChild(m),b=m}return f(),()=>{e.removeEventListener("keydown",g),b==null||b.remove(),o==null||o.remove(),o=null,s=null,n=null}}function Ln({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function s(x){return`view-${x}`}function n(x){const I=t.getElementById(s(x.route));if(I)return I;const A=t.querySelector(".view-container");if(!A)return null;const g=t.createElement("div");return g.id=s(x.route),g.className="view hidden",A.appendChild(g),g}function i(x){if(t.querySelector(`.nav-btn[data-view="${x.route}"]`))return;const I=t.querySelectorAll(".nav-section"),A=I[x.seccion??Math.max(0,I.length-1)];if(!A)return;const g=t.createElement("button");g.className="nav-btn",g.dataset.view=x.route,g.innerHTML=`${x.iconoPath?`<svg viewBox="0 0 24 24"><path d="${x.iconoPath}"/></svg>`:""}<span>${x.nombre}</span>`,A.appendChild(g),g.addEventListener("click",()=>{const b=globalThis.Router;b==null||b.navigate(x.route)})}function r(x){a.set(x.route,x),n(x),i(x)}function l(){return[...a.keys()].filter(x=>{const I=a.get(x);return!e||e(I.flagId??I.id)})}function p(x){return l().includes(x)}function h(x){const I=a.get(x);if(!I||e&&!e(I.flagId??I.id))return!1;const A=n(I);if(!A)return!1;if(o&&o!==x){const g=a.get(o),b=t.getElementById(s(o));g!=null&&g.unmount&&b&&g.unmount(b)}return I.mount(A),o=x,!0}function u(){o&&h(o)}function d(){const x={};for(const[I,A]of a)x[I]=A.flagId??A.id;return x}function v(){for(const x of a.values())n(x),i(x)}return{register:r,routes:l,has:p,mount:h,rerender:u,flagPorRuta:d,attachToShell:v,get activa(){return o}}}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ft(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${c(j(t))}</span>`}function fo(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function vo(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${c(e)}</span>`).join(" ")}const Bn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Je(t){const[e,a]=t.split("-").map(Number);return`${Bn[a-1]} ${e}`}function q(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function Z(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function N(t,e,a){t.addEventListener("click",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(e);s&&t.contains(s)&&a(s,o)})}function J(t,e,a){t.addEventListener("change",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(e);s&&t.contains(s)&&a(s,o)})}function ft(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function go(t,e){const a=parseFloat(ft(t,e));return Number.isFinite(a)?a:0}function kn(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Hn(t,e){const{ledger:a}=t,o=(t.hoy??Y)(),s=t.accounts().filter(b=>b.activo),{desde:n,hasta:i}=kn(e.mes),r={cuentaId:e.cuentaId||void 0,desde:n,hasta:i,texto:e.filtroTexto||void 0},l=a.transacciones(r),p=t.estimaciones().filter(b=>b.tipo!=="transferencia"),h=l.filter(b=>b.importeCts<0).reduce((b,f)=>b+f.importeCts,0),u=l.filter(b=>b.importeCts>0).reduce((b,f)=>b+f.importeCts,0),d=e.cuentaId?a.saldoCuenta(e.cuentaId,i):a.saldoTotal(i),v=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),x=s.map(b=>`<option value="${c(b._id)}"${b._id===e.cuentaId?" selected":""}>${c(b.nombre)}</option>`).join(""),I=b=>'<option value="">— sin asignar —</option>'+p.map(f=>`<option value="${c(f._id)}"${f._id===b?" selected":""}>${c(f.concepto)} (${c(j(f.cuantia))})</option>`).join(""),A=l.map(b=>{var f;return`
      <tr data-tx="${c(b._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${c(b.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${c(b.concepto)}</td>
        <td style="padding:7px 8px">${vo(b.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${c(((f=t.accounts().find($=>$._id===b.cuentaId))==null?void 0:f.nombre)??b.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${c(b._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${I(b.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Ft(et(b.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${c(b._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${c(b._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),g=v.slice().reverse().slice(0,8).map(b=>{var f;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${c(b.fecha)}</span>
        <span style="color:var(--text3)">${c(((f=t.accounts().find($=>$._id===b.cuentaId))==null?void 0:f.nombre)??b.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${c(j(et(b.saldoCts)))}</span>
        ${b.nota?`<span style="color:var(--text3)">${c(b.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${c(b._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="card-title">Movimientos reales</div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${x}</select>
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
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${x}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(b=>`<option value="${c(b)}"></option>`).join("")}</datalist>
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
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${x}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${g?`<div class="mt-12">${g}</div>`:""}
        </div>
      </div>
    </div>`}function Gn(t,e,a,o){const{ledger:s}=e;J(t,"#acc-cuenta",i=>{a.cuentaId=i.value,o()}),J(t,"#acc-mes",i=>{a.mes=i.value||a.mes,o()});const n=t.querySelector("#acc-buscar");n==null||n.addEventListener("input",()=>{a.filtroTexto=n.value,clearTimeout(n._t),n._t=window.setTimeout(o,200)}),N(t,"#nt-guardar",()=>{const i=ft(t,"#nt-concepto").trim(),r=go(t,"#nt-importe");if(!i)return q("Indica un concepto","err");if(!(r>0))return q("Indica un importe mayor que cero","err");const l=ft(t,"#nt-tags").split(",").map(p=>p.trim().toLowerCase()).filter(Boolean);s.registrar({fecha:ft(t,"#nt-fecha")||(e.hoy??Y)(),cuentaId:ft(t,"#nt-cuenta"),importe:r,concepto:i,tags:l,tipo:ft(t,"#nt-tipo"),estimacionId:ft(t,"#nt-estimacion")||null}),q("Movimiento registrado"),e.onDatosCambiados(),o()}),N(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;Z("¿Eliminar este movimiento?")&&(s.eliminar(r),q("Movimiento eliminado"),e.onDatosCambiados(),o())}),N(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,l=s.transacciones().find(u=>u._id===r);if(!l)return;const p=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(et(l.importeCts))));if(p===null)return;const h=parseFloat(p.replace(",","."));if(!Number.isFinite(h)||h<=0)return q("Importe no válido","err");s.actualizar(r,{importe:h}),q("Movimiento actualizado"),e.onDatosCambiados(),o()}),J(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");s.asignarEstimacion(r,i.value||null),q("Asignación actualizada"),e.onDatosCambiados()}),N(t,"#pc-guardar",()=>{if(ft(t,"#pc-saldo").trim()==="")return q("Indica el saldo","err");const r=go(t,"#pc-saldo");s.registrarPuntoControl(ft(t,"#pc-cuenta"),ft(t,"#pc-fecha")||(e.hoy??Y)(),r,ft(t,"#pc-nota").trim()||void 0),q("Saldo real registrado"),e.onDatosCambiados(),o()}),N(t,"[data-pc-borrar]",i=>{Z("¿Eliminar este punto de control?")&&(s.eliminarPuntoControl(i.dataset.pcBorrar),q("Punto de control eliminado"),e.onDatosCambiados(),o())})}function We(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:s=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const n=W(t.mediaRealReciente),i=W(n-e),r=e!==0?i/Math.abs(e)*100:n!==0?100:0;if(Math.abs(r)<s)return null;const l=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:W(e),cuantiaSugerida:n,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:l,motivo:i>0?`El gasto real de los últimos ${l} meses supera lo estimado`:`El gasto real de los últimos ${l} meses es inferior a lo estimado`}}function Vn(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(n,i,r={}){const l=r.hoy??Y(),p=t.get("expenses"),h=p.find(x=>x._id===n);if(!h)throw new Error(`La estimación ${n} no existe`);const u={...h,fechaFin:l},d={...h,_id:e(),cuantia:W(i),fechaInicio:l,fechaFin:h.fechaFin??null,ajustadaDesdeId:h._id,ajustadaEn:l},v=p.map(x=>x._id===n?u:x);return v.push(d),t.set("expenses",v),{estimacionCerrada:u,estimacionNueva:d}}function o(n,i={}){const r=[],l=[];for(const p of n)try{r.push(a(p.estimacionId,p.cuantiaSugerida,i))}catch(h){l.push({estimacionId:p.estimacionId,error:h.message})}return{aplicadas:r,errores:l}}function s(n){const i=t.get("expenses"),r=new Map(i.map(I=>[I._id,I])),l=r.get(n);if(!l)return[];const p=[];let h=l;const u=new Set;for(;h!=null&&h.ajustadaDesdeId&&!u.has(h._id);){u.add(h._id);const I=r.get(h.ajustadaDesdeId);if(!I)break;p.unshift(I),h=I}const d=[];let v=l;const x=new Set([l._id]);for(;;){const I=i.find(A=>A.ajustadaDesdeId===v._id&&!x.has(A._id));if(!I)break;x.add(I._id),d.push(I),v=I}return[...p,l,...d]}return{aplicar:a,aplicarTodas:o,cadena:s}}function Ke(t){const e=t.estimaciones(),a=new Map(e.map(o=>[o._id,o]));return t.precision.analizarTodas(e).map(o=>{const s=a.get(o.estimacionId);return{analisis:o,estimacion:s,sugerencia:We(o,s.cuantia)}}).filter(o=>!!o.estimacion)}function Un(t){const e=Ke(t),a=e.filter(l=>l.analisis.precision!==null),o=e.filter(l=>l.sugerencia!==null),s=t.precision.analizarPorTag(e.map(l=>l.analisis));if(a.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const n=a.map(({analisis:l,estimacion:p,sugerencia:h})=>{const u=l.meses.slice(-6).map(d=>`${Je(d.mes)}: ${j(d.estimado)} → ${j(d.real)} (${d.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${c(p.concepto)}</div>
          <div style="margin-top:3px">${vo(l.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${c(u)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(j(l.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(j(l.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Ft(l.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${fo(l.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${h?`<button class="btn-secondary" data-sugerir="${c(l.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${c(h.motivo)}">Sugerir ajuste → ${c(j(h.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=s.map(l=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${c(l.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${l.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(j(l.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(j(l.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Ft(l.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${fo(l.precision)}</td>
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
    </div>`}function Yn(t,e,a){N(t,"[data-sugerir]",o=>{const s=o.dataset.sugerir,n=Ke(e).find(l=>l.analisis.estimacionId===s);if(!(n!=null&&n.sugerencia))return;const i=n.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${j(i.cuantiaActual)}
Nueva estimación: ${j(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;Z(r)&&(e.adjuster.aplicar(s,i.cuantiaSugerida,{hoy:e.hoy()}),q(`Estimación ajustada a ${j(i.cuantiaSugerida)}`),e.onDatosCambiados(),a())}),N(t,"#ajustar-todas",()=>{const o=Ke(e).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const s=o.map(r=>`• ${r.concepto}: ${j(r.cuantiaActual)} → ${j(r.cuantiaSugerida)}`).join(`
`);if(!Z(`Se van a ajustar ${o.length} estimaciones:

${s}

¿Continuar?`))return;const{aplicadas:n,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});q(i.length>0?`${n.length} ajustadas, ${i.length} con error`:`${n.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const Jn=[";",",","	","|"],Wn={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function be(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function he(t,e){const a=[];let o="",s=!1;for(let n=0;n<t.length;n++){const i=t[n];s?i==='"'?t[n+1]==='"'?(o+='"',n++):s=!1:o+=i:i==='"'?s=!0:i===e?(a.push(o.trim()),o=""):o+=i}return a.push(o.trim()),a}function Kn(t){let e=";",a=-1;for(const o of Jn){const s=t.slice(0,20).map(l=>he(l,o).length),n=Math.max(...s);if(n<2)continue;const r=s.filter(l=>l===n).length*10+n;r>a&&(a=r,e=o)}return e}function se(t){let e=(t??"").trim();if(!e)return null;let a=!1;if(/^\(.*\)$/.test(e)&&(a=!0,e=e.slice(1,-1).trim()),e.endsWith("-")&&(a=!0,e=e.slice(0,-1).trim()),e.startsWith("-")&&(a=!0,e=e.slice(1).trim()),e.startsWith("+")&&(e=e.slice(1).trim()),e=e.replace(/[€$£\s  ]/g,""),!e)return null;const o=e.lastIndexOf(","),s=e.lastIndexOf(".");let n="";o>=0&&s>=0?n=o>s?",":".":o>=0?n=/,\d{3}$/.test(e)&&e.replace(/,/g,"").length>3?"":",":s>=0&&(n=/\.\d{3}$/.test(e)&&e.replace(/\./g,"").length>3?"":".");let i,r="0";if(n){const h=n===","?o:s;i=e.slice(0,h).replace(/[.,]/g,""),r=e.slice(h+1).replace(/[.,]/g,"")}else i=e.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const l=(r+"00").slice(0,2),p=Number(i||"0")*100+Number(l);return Number.isFinite(p)?a?-p:p:null}function Qe(t){const e=(t??"").trim();if(!e)return null;let a=e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a)return bo(Number(a[1]),Number(a[2]),Number(a[3]));if(a=e.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),a){let o=Number(a[3]);return o<100&&(o+=o<70?2e3:1900),bo(o,Number(a[2]),Number(a[1]))}return null}function bo(t,e,a){if(e<1||e>12||a<1||a>31)return null;const o=new Date(t,e-1,a);return o.getFullYear()!==t||o.getMonth()!==e-1||o.getDate()!==a?null:`${t}-${String(e).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function ho(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>Qe(a)!==null).length/e.length}function yo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>se(a)!==null).length/e.length}function Qn(t,e){const a={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,s=n=>e.map(i=>i[n]??"");for(const n of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=be(t[i]);if(r&&Wn[n].some(l=>r===l||r.startsWith(l)||r.includes(l))){if(n==="importe"&&be(t[i]).includes("saldo"))continue;a[n]=i,o.add(i);break}}if(a.fecha<0){let n=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=ho(s(r));l>i&&(i=l,n=r)}n>=0&&(a.fecha=n,o.add(n))}if(a.importe<0&&a.debe<0&&a.haber<0){let n=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||be(t[r]).includes("saldo"))continue;const l=yo(s(r));l>i&&(i=l,n=r)}n>=0&&(a.importe=n,o.add(n))}if(a.concepto<0){let n=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=s(r);if(yo(l)>.5||ho(l)>.5)continue;const p=l.reduce((h,u)=>h+u.length,0)/Math.max(1,l.length);p>i&&(i=p,n=r)}n>=0&&(a.concepto=n)}return a}function Xn(t){const e=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(h=>h.trim()!=="");if(e.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const a=Kn(e),o=e.map(h=>he(h,a).length),s=Math.max(...o);let n=o.findIndex(h=>h===s);n<0&&(n=0);const i=he(e[n],a);let r=e.slice(n+1).map(h=>he(h,a));const l=Qe(i[0]??"")!==null||i.some(h=>se(h)!==null&&/\d/.test(h));l&&(r=[i,...r]);const p=Qn(l?i.map(()=>""):i,r.slice(0,40));return{separador:a,cabeceras:l?i.map((h,u)=>`Columna ${u+1}`):i,filas:r,lineaCabecera:n+1,mapeo:p}}function xo(t,e,a){return`${t}|${e}|${be(a).replace(/\s+/g," ")}`}function Zn(t,e,a=[]){const o=new Set(a.map(n=>xo(n.fecha,n.importeCts,n.concepto))),s=new Set;return t.filas.map((n,i)=>{const r=[],l=e.fecha>=0?Qe(n[e.fecha]??""):null;e.fecha<0?r.push("sin columna de fecha"):l||r.push(`fecha ilegible: «${n[e.fecha]??""}»`);let p=null;if(e.importe>=0)p=se(n[e.importe]??""),p===null&&r.push(`importe ilegible: «${n[e.importe]??""}»`);else if(e.debe>=0||e.haber>=0){const d=e.debe>=0?se(n[e.debe]??""):null,v=e.haber>=0?se(n[e.haber]??""):null;d===null&&v===null?r.push("sin importe en Debe ni en Haber"):d!==null&&d!==0?p=-Math.abs(d):v!==null&&v!==0?p=Math.abs(v):p=0}else r.push("sin columna de importe");p===0&&r.push("importe cero");const h=(e.concepto>=0?n[e.concepto]??"":"").trim()||"Movimiento importado";let u=!1;if(l&&p!==null){const d=xo(l,p,h);u=o.has(d)||s.has(d),s.add(d)}return{linea:t.lineaCabecera+1+i,fecha:l,concepto:h,importeCts:p,errores:r,duplicada:u}})}function ti(t,e){const a=t.filter(s=>s.errores.length===0&&(e||!s.duplicada)),o=a.map(s=>s.fecha).filter(s=>!!s).sort();return{total:t.length,importables:a.length,conError:t.filter(s=>s.errores.length>0).length,duplicadas:t.filter(s=>s.duplicada).length,sumaCts:a.reduce((s,n)=>s+(n.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function ye(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const ei=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function Xe(t,e){if(!e.analisis||!e.mapeo){e.filas=[];return}const a=t.ledger.transacciones(e.cuentaId?{cuentaId:e.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));e.filas=Zn(e.analisis,e.mapeo,a)}function ai(t,e){const a=t.accounts().filter(s=>s.activo);if(!e.abierto)return`
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

      ${e.analisis&&e.mapeo?si(e,e.analisis,e.mapeo):oi()}
    </div>`}function oi(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function si(t,e,a){const o=ti(t.filas,t.incluirDuplicadas),s=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+e.cabeceras.map((l,p)=>`<option value="${p}"${p===r?" selected":""}>${c(l||`Columna ${p+1}`)}</option>`).join(""),n=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${c(t.nombreFichero)}</strong> · ${e.filas.length} línea${e.filas.length!==1?"s":""}
      · separador <code>${c(e.separador==="	"?"tabulador":e.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${ei.map(r=>`<div class="form-group">
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function ni(t,e,a,o){N(t,"[data-imp-abrir]",()=>{const n=e.accounts().filter(i=>i.activo);Object.assign(a,ye(),{abierto:!0,cuentaId:n.length===1?n[0]._id:""}),o()}),N(t,"[data-imp-cerrar]",()=>{Object.assign(a,ye()),o()}),J(t,"#imp-cuenta",n=>{a.cuentaId=n.value,Xe(e,a),o()}),J(t,"#imp-duplicadas",n=>{a.incluirDuplicadas=n.checked,o()}),J(t,"[data-imp-col]",n=>{const i=n,r=i.dataset.impCol;a.mapeo&&(a.mapeo[r]=Number(i.value),Xe(e,a),o())});const s=t.querySelector("#imp-fichero");s==null||s.addEventListener("change",()=>{var i;const n=(i=s.files)==null?void 0:i[0];n&&ii(n).then(r=>{const l=Xn(r);a.nombreFichero=n.name,a.error=l.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",a.analisis=l,a.mapeo={...l.mapeo},Xe(e,a),o()}).catch(r=>{a.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),N(t,"[data-imp-confirmar]",()=>{if(!a.cuentaId)return;const n=a.filas.filter(i=>i.errores.length===0&&(a.incluirDuplicadas||!i.duplicada));if(n.length!==0){for(const i of n)e.ledger.registrar({fecha:i.fecha,cuentaId:a.cuentaId,importe:Math.abs(et(i.importeCts)),tipo:i.importeCts<0?"gasto":"ingreso",concepto:i.concepto,origen:"importado"});q(`${n.length} movimiento${n.length!==1?"s":""} importado${n.length!==1?"s":""}`),Object.assign(a,ye()),e.onDatosCambiados(),o()}})}function ii(t){return t.arrayBuffer().then(e=>{const a=new TextDecoder("utf-8").decode(e);if(!a.includes("�"))return a;try{return new TextDecoder("iso-8859-1").decode(e)}catch{return a}})}function ri(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function li(t,e){const a=G(t),o=[];for(let s=1;s<=e;s++){const n=new Date(a.getFullYear(),a.getMonth()-s,1);o.push(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function ci(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function $o(t,e){const{inicio:a,fin:o}=ci(e);return Kt([t],{start:a,end:o}).reduce((n,i)=>n+Math.abs(i.cuantia),0)}function di(t){function e(s,n={}){var $;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:l=Y()}=n,p=t.transacciones({estimacionId:s._id}),u=p.length===0&&((($=s.tags)==null?void 0:$.length)??0)>0?t.transacciones({tags:s.tags}):p,d=new Map;for(const m of u){const y=m.fecha.slice(0,7);d.set(y,(d.get(y)??0)+Math.abs(m.importeCts)/100)}const v=[];for(const m of li(l,i)){const y=d.get(m);if(y===void 0)continue;const S=W($o(s,m));v.push({mes:m,estimado:S,real:W(y),desviacion:W(y-S),precision:ri(S,y)})}const x=W(v.reduce((m,y)=>m+y.estimado,0)),I=W(v.reduce((m,y)=>m+y.real,0)),A=v.reduce((m,y)=>m+Math.abs(y.estimado),0),g=v.length===0?null:A>0?v.reduce((m,y)=>m+y.precision*Math.abs(y.estimado),0)/A:v.reduce((m,y)=>m+y.precision,0)/v.length,b=v.slice(-r),f=b.length>0?W(b.reduce((m,y)=>m+y.real,0)/b.length):null;return{estimacionId:s._id,concepto:s.concepto,tags:s.tags??[],meses:v,estimadoTotal:x,realTotal:I,desviacionTotal:W(I-x),precision:g,mediaRealReciente:f,infraestimada:I>x}}function a(s,n={}){return s.filter(i=>i.tipo!=="transferencia").map(i=>e(i,n)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(s){const n=new Map;for(const i of s)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const l=n.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};l.estimado+=i.estimadoTotal,l.real+=i.realTotal,l.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),l.peso+=Math.abs(i.estimadoTotal),l.n+=1,n.set(r,l)}return[...n.entries()].map(([i,r])=>({tag:i,estimadoTotal:W(r.estimado),realTotal:W(r.real),desviacionTotal:W(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}function ui(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function pi(t){const[e,a]=t.slice(0,7).split("-").map(Number),o=new Date(e,a-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function mi(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function fi(t,e,a){const o=new Map(e.map(n=>[n._id,[]])),s=e.filter(n=>{var i;return!a(n._id)&&(((i=n.tags)==null?void 0:i.length)??0)>0});for(const n of t){if(n.estimacionId&&o.has(n.estimacionId)){o.get(n.estimacionId).push(n);continue}if(n.estimacionId)continue;let i=null,r=0;for(const l of s){const p=(l.tags??[]).filter(h=>n.tags.includes(h)).length;p!==0&&(p>r||p===r&&i&&l._id<i._id)&&(i=l,r=p)}i&&o.get(i._id).push(n)}return o}function vi(t,e,a,o={}){const{desde:s,hasta:n}=ui(a),i=t.transacciones({desde:s,hasta:n}),r=i.filter(f=>f.importeCts<0),l=i.filter(f=>f.importeCts>0),p=e.filter(f=>f.tipo==="gasto"&&f.activo!==!1),h=new Map((o.analisis??[]).map(f=>[f.estimacionId,f])),u=new Set(p.filter(f=>t.transacciones({estimacionId:f._id}).length>0).map(f=>f._id)),d=fi(r,p,f=>u.has(f)),v=new Set,x=p.map(f=>{const $=d.get(f._id)??[];for(const w of $)v.add(w._id);const m=W($.reduce((w,E)=>w+Math.abs(E.importeCts)/100,0)),y=W($o(f,a)),S=h.get(f._id);return{estimacionId:f._id,concepto:f.concepto,tags:f.tags??[],estimado:y,real:m,desviacion:W(m-y),sinMovimiento:$.length===0,sugerencia:S?We(S,f.cuantia,{hoy:o.hoy}):null}}),I=new Map;for(const f of r){if(v.has(f._id))continue;const $=mi(f.concepto),m=I.get($)??{concepto:f.concepto,total:0,movimientos:0};m.total=W(m.total+Math.abs(f.importeCts)/100),m.movimientos+=1,I.set($,m)}const A=[...I.values()].sort((f,$)=>$.total-f.total),g=W(x.reduce((f,$)=>f+$.estimado,0)),b=W(r.reduce((f,$)=>f+Math.abs($.importeCts)/100,0));return{mes:a,estimado:g,real:b,desviacion:W(b-g),ingresosReales:W(l.reduce((f,$)=>f+$.importeCts/100,0)),filas:x.sort((f,$)=>Math.abs($.desviacion)-Math.abs(f.desviacion)),sinEstimacion:A,totalSinEstimacion:W(A.reduce((f,$)=>f+$.total,0)),vacio:i.length===0}}function Io(t){const e=new Set;for(const a of t.transacciones())e.add(a.fecha.slice(0,7));return[...e].sort().reverse()}function gi(){return{mes:""}}function Ze(t,e){if(e.mes)return e.mes;const a=Io(t.ledger),o=pi((t.hoy??Y)());return a.includes(o)?o:a[0]??o}function ta(t,e){const a=(t.hoy??Y)(),o=t.estimaciones(),s=t.precision.analizarTodas(o,{hoy:a});return vi(t.ledger,o,e,{analisis:s,hoy:a})}function bi(t,e){const a=Ze(t,e),o=Io(t.ledger);o.includes(a)||o.unshift(a);const s=ta(t,a),n=`
    <select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
      ${o.map(l=>`<option value="${c(l)}"${l===a?" selected":""}>${c(Je(l))}</option>`).join("")}
    </select>`;if(s.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">Cierre de mes</div>
          ${n}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados en ${c(Je(a))}. Importa el extracto del banco o
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

      ${hi(s)}
      ${yi(s)}
    </div>`}function hi(t){const e=t.filas.filter(o=>o.estimado>0||o.real>0);if(e.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas para este mes.</div>';const a=e.filter(o=>o.sugerencia);return`
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
           </div>`:""}`}function yi(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function xi(t,e,a,o){J(t,"#cie-mes",s=>{a.mes=s.value,o()}),N(t,"[data-cie-ajustar]",s=>{const n=s.dataset.cieAjustar,r=ta(e,Ze(e,a)).filas.find(l=>l.estimacionId===n);r!=null&&r.sugerencia&&(e.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(e.hoy??Y)()}),q(`«${r.concepto}» ajustada a ${j(r.sugerencia.cuantiaSugerida)}`),e.onDatosCambiados(),o())}),N(t,"[data-cie-ajustar-todas]",()=>{const n=ta(e,Ze(e,a)).filas.map(l=>l.sugerencia).filter(l=>l!==null);if(n.length===0)return;const{aplicadas:i,errores:r}=e.adjuster.aplicarTodas(n,{hoy:(e.hoy??Y)()});q(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),e.onDatosCambiados(),o()})}const $i="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function Ii(t){const e={cuentaId:"",mes:(t.hoy??Y)().slice(0,7),filtroTexto:""},a=ye(),o=gi(),s=()=>{var u;return(u=t.onDatosCambiados)==null?void 0:u.call(t)},n=t.hoy??Y,i={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:s,hoy:n},r={ledger:t.ledger,accounts:t.accounts,onDatosCambiados:s},l={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:s,hoy:n},p={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:s,hoy:n};function h(u){const d=t.ledger.saldoTotal(n()),v=t.ledger.ultimaFecha(),x=t.ledger.transacciones().length;u.innerHTML=`
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
          <div class="stat-value" style="font-size:1.3rem">${x}</div>
          <div style="font-size:11px;color:var(--text3)">${v?`último: ${c(v)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-importar"></div>
      <div id="acc-cierre" data-feature="precision-estimaciones"></div>
      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const I=u.querySelector("#acc-importar"),A=u.querySelector("#acc-cierre"),g=u.querySelector("#acc-transacciones"),b=u.querySelector("#acc-precision");I.innerHTML=ai(r,a),A.innerHTML=bi(l,o),g.innerHTML=Hn(i,e),b.innerHTML=Un(p);const f=()=>h(u);ni(I,r,a,f),xi(A,l,o,f),Gn(g,i,e,f),Yn(b,p,f)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:$i,mount:h}}const Ai="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function ea(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function Si(t){const{store:e}=t,a=t.hoy??Y,o=()=>G(a()),s=()=>e.get("config").margenesSeguridad??[];function n(v){var x;e.patchConfig({margenesSeguridad:v}),(x=t.onDatosCambiados)==null||x.call(t)}function i(v,x){const I=s().map(g=>({...g,puntos:(g.puntos??[]).map(b=>({...b}))})),A=I.find(g=>g._id===v);A&&(x(A),n(I))}function r(v){const x=e.get("config"),I=fe(v,e.get("expenses"),x,e.get("loans"),a(),!1,o());return j(I)}function l(v,x,I){const A=x.tipo==="fijo",g=A?"":`<span class="text-sm" style="color:var(--text3)">${c(j((x.meses??0)*I))}</span>`;return`
      <tr data-punto="${c(x._id)}" data-margen="${c(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${c(x.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${A?" selected":""}>Fijo €</option>
            <option value="meses"${A?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${A?`<input type="number" class="form-input" style="width:90px" value="${x.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${A?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${x.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${g}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function p(v,x,I){const A=v.cuentas&&v.cuentas.length>0?v.cuentas.map($=>{var m;return((m=x.find(y=>y._id===$))==null?void 0:m.nombre)??$}).join(", "):"Todas las cuentas activas",b=[...v.puntos??[]].sort(($,m)=>$.fecha.localeCompare(m.fecha)).map($=>l(v,$,I)).join(""),f=v.activo?`
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
            ${b||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
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
        ${f}
      </div>`}function h(v,x){const I=x?s().find(f=>f._id===x):null,A=e.get("accounts").filter(f=>f.activo),g=new Set((I==null?void 0:I.cuentas)??[]),b=A.map(f=>`
        <label class="tag" data-chip="${c(f._id)}" style="cursor:pointer;${g.has(f._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${c(f._id)}" ${g.has(f._id)?"checked":""} style="display:none"/>
          ${c(f.nombre)}
        </label>`).join(" ");v.innerHTML=`
      <div class="modal-title">${x?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${c((I==null?void 0:I.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${b||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
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
        <button class="btn-primary" data-guardar-margen="${c(x??"")}">Guardar</button>
      </div>`}function u(v,x){const I=document.getElementById("modal-overlay"),A=document.getElementById("modal-content");!I||!A||(h(A,v),I.classList.remove("hidden"),J(A,".mg-acc-chip",g=>{const b=g,f=A.querySelector(`[data-chip="${b.value}"]`);f&&(f.style.cssText=`cursor:pointer;${b.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),J(A,"#mg-p-tipo",g=>{const b=g.value==="fijo",f=A.querySelector("#mg-p-importe-wrap"),$=A.querySelector("#mg-p-meses-wrap");f&&(f.style.display=b?"":"none"),$&&($.style.display=b?"none":"")}),N(A,"[data-cerrar-form]",()=>I.classList.add("hidden")),N(A,"[data-guardar-margen]",g=>{var y,S,w,E,_;const b=g.getAttribute("data-guardar-margen")||"",f=((y=A.querySelector("#mg-nombre"))==null?void 0:y.value.trim())??"";if(!f)return q("El nombre es obligatorio","err");const $=[...A.querySelectorAll(".mg-acc-chip:checked")].map(D=>D.value),m=s().map(D=>({...D}));if(b){const D=m.findIndex(C=>C._id===b);if(D===-1)return q("Margen no encontrado","err");m[D]={...m[D],nombre:f,cuentas:$}}else{const D=((S=A.querySelector("#mg-p-tipo"))==null?void 0:S.value)??"fijo",C={_id:ea(),fecha:((w=A.querySelector("#mg-p-fecha"))==null?void 0:w.value)||Y(),tipo:D,importe:parseFloat(((E=A.querySelector("#mg-p-importe"))==null?void 0:E.value)??"0")||0,meses:parseFloat(((_=A.querySelector("#mg-p-meses"))==null?void 0:_.value)??"1")||1};m.push({_id:ea(),nombre:f,activo:!0,cuentas:$,puntos:[C]})}n(m),q(b?"Margen actualizado":"Margen creado"),I.classList.add("hidden"),x()}))}function d(v){const x=s(),I=e.get("accounts"),A=Xt(e.get("expenses"),o());v.innerHTML=`
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
      ${x.length===0?`<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`:x.map(b=>p(b,I,A)).join("")}`;const g=()=>d(v);N(v,"[data-nuevo-margen]",()=>u(null,g)),N(v,"[data-editar-margen]",b=>u(b.getAttribute("data-editar-margen"),g)),N(v,"[data-borrar-margen]",b=>{Z("¿Eliminar este margen de seguridad?")&&(n(s().filter(f=>f._id!==b.getAttribute("data-borrar-margen"))),q("Margen eliminado"),g())}),J(v,"[data-toggle-margen]",b=>{const f=b.getAttribute("data-toggle-margen");i(f,$=>{$.activo=b.checked}),g()}),N(v,"[data-add-punto]",b=>{const f=b.getAttribute("data-add-punto");i(f,$=>{$.puntos=[...$.puntos??[],{_id:ea(),fecha:Y(),tipo:"fijo",importe:0,meses:1}]}),g()}),N(v,"[data-borrar-punto]",b=>{const f=b.closest("[data-punto]");if(!f)return;const $=f.dataset.margen,m=f.dataset.punto;i($,y=>{y.puntos=(y.puntos??[]).filter(S=>S._id!==m)}),g()}),J(v,"[data-campo]",b=>{const f=b.closest("[data-punto]");if(!f)return;const $=b.getAttribute("data-campo"),m=b.value;i(f.dataset.margen,y=>{const S=(y.puntos??[]).find(w=>w._id===f.dataset.punto);S&&($==="fecha"?S.fecha=m:$==="tipo"?S.tipo=m:$==="importe"?S.importe=parseFloat(m)||0:S.meses=parseFloat(m)||0)}),g()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:Ai,mount:d}}const Mi="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function wi(t){const e=Array.isArray(t)?t[1]??[]:[];return Array.isArray(e)?e.filter(a=>a&&a.value!==null&&a.value!==void 0&&Number.isFinite(Number(a.value))).map(a=>({year:parseInt(a.date),tasa:parseFloat(Number(a.value).toFixed(2))})).filter(a=>Number.isFinite(a.year)).sort((a,o)=>a.year-o.year):[]}function Ci({fetchImpl:t,url:e=Mi}={}){let a=null,o=!1;async function s(n=!1){if(a&&!n)return a;if(o)return null;o=!0;try{const r=await(t??fetch)(e);if(!r.ok)throw new Error(`HTTP ${r.status}`);return a=wi(await r.json()),a}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:s,invalidar:()=>{a=null},get enCache(){return a}}}const ji="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function Ei(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function zi(t){const{store:e}=t,a=t.ipc??Ci(),o=()=>e.get("inflacion")??[];function s(){var u;(u=t.onDatosCambiados)==null||u.call(t)}function n(u,d){if(!u||u.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const v=new Set(o().map(b=>b.year)),x=u.filter(b=>b.year>=d).reverse(),I=x.filter(b=>!v.has(b.year)).length,A=[...new Set(u.map(b=>b.year))].sort((b,f)=>b-f),g=x.map(b=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${b.year}" data-tasa="${b.tasa}" ${v.has(b.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${b.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${Ei(b.tasa)}">${b.tasa.toFixed(2)}%</span>
          ${v.has(b.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${A.map(b=>`<option value="${b}"${b===d?" selected":""}>${b}</option>`).join("")}
        </select>
        <span style="font-size:10px;color:var(--text3)">
          Fuente: Banco Mundial · FP.CPI.TOTL.ZG · ${u[0].year}–${u[u.length-1].year}
        </span>
        <button class="btn-secondary btn-sm" data-ipc-recargar title="Forzar recarga desde la API">↺</button>
      </div>
      <div style="max-height:300px;overflow-y:auto;margin-bottom:12px">${g}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="font-size:12px;color:var(--text3)">${I} periodo${I!==1?"s":""} nuevo${I!==1?"s":""} disponible${I!==1?"s":""}</span>
        <div class="flex gap-8">
          <button class="btn-secondary" data-ipc-cerrar>Cancelar</button>
          <button class="btn-primary" data-ipc-importar ${I===0?"disabled":""}>↓ Importar seleccionados</button>
        </div>
      </div>`}function i(u){return!u||u.length===0?2e3:Math.max(u[0].year,new Date().getFullYear()-25)}async function r(u){const d=document.getElementById("modal-overlay"),v=document.getElementById("modal-content");if(!d||!v)return;v.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,d.classList.remove("hidden");const x=(A,g)=>{const b=document.getElementById("ipc-body");b&&(b.innerHTML=n(A,g))},I=await a.obtener();x(I,i(I)),N(v,"[data-ipc-cerrar]",()=>d.classList.add("hidden")),J(v,"#ipc-desde",A=>{x(a.enCache,parseInt(A.value))}),N(v,"[data-ipc-recargar]",()=>{a.invalidar();const A=document.getElementById("ipc-body");A&&(A.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),a.obtener(!0).then(g=>x(g,i(g)))}),N(v,"[data-ipc-importar]",()=>{const A=[...v.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(A.length===0)return q("Nada seleccionado","err");const g=new Set(o().map(f=>f.year));let b=0;for(const f of A){const $=parseInt(f.dataset.year??""),m=parseFloat(f.dataset.tasa??"");!Number.isFinite($)||!Number.isFinite(m)||g.has($)||(e.addItem("inflacion",{year:$,tasa:m}),g.add($),b++)}d.classList.add("hidden"),q(`${b} periodo${b!==1?"s":""} importado${b!==1?"s":""} correctamente`),s(),u()})}function l(u,d){var g;const v=document.getElementById("modal-overlay"),x=document.getElementById("modal-content");if(!v||!x)return;const I=u?o().find(b=>b._id===u):null;x.innerHTML=`
      <div class="modal-title">${u?"Editar periodo de inflación":"Nuevo periodo de inflación"}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Año</label>
          <input class="form-input" type="number" id="inf-year" value="${(I==null?void 0:I.year)??new Date().getFullYear()}" placeholder="2026"/></div>
        <div class="form-group"><label class="form-label">Tasa anual (%)</label>
          <input class="form-input" type="number" id="inf-tasa" step="0.01" value="${(I==null?void 0:I.tasa)??""}" placeholder="3.5"/></div>
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-inf-cerrar>Cancelar</button>
        <button class="btn-primary" data-inf-guardar="${c(u??"")}">Guardar</button>
      </div>`,v.classList.remove("hidden");const A=()=>{var y;const b=parseFloat(((y=x.querySelector("#inf-tasa"))==null?void 0:y.value)??""),f=x.querySelector("#inf-preview");if(!f)return;if(!Number.isFinite(b)||b<=0){f.innerHTML="";return}const $=(Math.pow(1+b/100,1/12)-1)*100,m=Math.pow(1+b/100,5);f.innerHTML=`Con un ${b}% anual: <strong>${$.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${m.toFixed(3)}</strong> (+${((m-1)*100).toFixed(1)}%)`};(g=x.querySelector("#inf-tasa"))==null||g.addEventListener("input",A),A(),N(x,"[data-inf-cerrar]",()=>v.classList.add("hidden")),N(x,"[data-inf-guardar]",b=>{const f=b.getAttribute("data-inf-guardar")||"",$=parseInt(x.querySelector("#inf-year").value),m=parseFloat(x.querySelector("#inf-tasa").value);if(!Number.isFinite($)||$<1900||$>2200)return q("Año inválido","err");if(!Number.isFinite(m)||m<0||m>100)return q("Tasa inválida (0–100%)","err");if(o().filter(S=>S._id!==f).some(S=>S.year===$))return q("Ya existe un periodo para ese año","err");f?(e.updateItem("inflacion",f,{year:$,tasa:m}),q("Periodo actualizado")):(e.addItem("inflacion",{year:$,tasa:m}),q("Periodo añadido")),v.classList.add("hidden"),s(),d()})}function p(u,d){const v=(Math.pow(1+u.tasa/100,.08333333333333333)-1)*100,x=`${u.year}-12-31`,I=x>d?pt([u],d,x):null;return`
      <div class="exp-table-row" data-periodo="${c(u._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${u.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${u.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${v.toFixed(3)}%/mes</div>
        <div class="num">${I!==null?`×${I.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${c(u._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${c(u._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function h(u){const d=o(),v=e.get("config").usarInflacion||!1,x=[...d].sort((y,S)=>S.year-y.year),I=Y(),A=new Date().getFullYear(),g=V(new Date(A+5,0,1)),b=V(new Date(A+10,0,1)),f=v&&d.length>0?pt(d,I,g):null,$=v&&d.length>0?pt(d,I,b):null;u.innerHTML=`
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
        ${x.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':x.map(y=>p(y,I)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const m=()=>h(u);J(u,"[data-toggle-inflacion]",y=>{const S=y.checked;e.patchConfig({usarInflacion:S}),q(S?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),s(),m()}),N(u,"[data-nuevo-periodo]",()=>l(null,m)),N(u,"[data-editar-periodo]",y=>l(y.getAttribute("data-editar-periodo"),m)),N(u,"[data-importar-ipc]",()=>void r(m)),N(u,"[data-borrar-periodo]",y=>{Z("¿Eliminar este periodo de inflación?")&&(e.removeItem("inflacion",y.getAttribute("data-borrar-periodo")),q("Periodo eliminado"),s(),m())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:ji,mount:h}}const _i=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],Fi=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Pi=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function Di(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const aa=(t,e)=>t.map(([a,o])=>`<option value="${c(a)}"${a===e?" selected":""}>${c(o)}</option>`).join("");function Ao(t,e="dp"){const{modo:a,dia:o,nth:s,wd:n}=Di(t),i=aa(_i.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${c(e)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${aa(Fi,s)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${aa(Pi,n)}</select>
        del mes
      </span>
    </div>
  </div>`}function So(t){var o,s,n;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(s=e.querySelector("[data-dp-dia]"))==null||s.style.setProperty("display",a==="dia"?"":"none"),(n=e.querySelector("[data-dp-nth]"))==null||n.style.setProperty("display",a==="nthweekday"?"":"none")}function Mo(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=s=>{var n;return((n=e.querySelector(s))==null?void 0:n.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const Ti="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Ni=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Ri(t){const e=t.hoy??Y,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var g;return(g=t.onDatosCambiados)==null?void 0:g.call(t)},s=()=>t.store.get("accounts"),n=g=>{var b;return((b=s().find(f=>f._id===(g||"default")))==null?void 0:b.nombre)??(g||"default")};function i(){const g=e();let b=[...t.store.get("expenses")];if(a.mostrarExpirados||(b=b.filter(f=>!f.fechaFin||f.fechaFin>=g)),a.tipo&&(b=b.filter(f=>f.tipo===a.tipo)),a.cuenta&&(b=b.filter(f=>(f.cuenta||"default")===a.cuenta)),a.desde&&(b=b.filter(f=>(f.fechaInicio??"")>=a.desde)),a.hasta&&(b=b.filter(f=>(f.fechaInicio??"")<=a.hasta)),a.busqueda){const f=a.busqueda.toLowerCase();b=b.filter($=>$.concepto.toLowerCase().includes(f))}return a.tags.size>0&&(b=b.filter(f=>(f.tags||[]).some($=>a.tags.has($)))),b.sort((f,$)=>{const m=f[a.orden]??"",y=$[a.orden]??"";return typeof m=="number"&&typeof y=="number"?(m-y)*a.sentido:String(m).localeCompare(String(y))*a.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(g=>g.tags||[]))].filter(Boolean).sort()}function l(g,b){const f=a.orden===g?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${g}">${c(b)} <span class="sort-arrow">${f}</span></span>`}function p(g,b=!1){return(b?'<option value="">Todas las cuentas</option>':"")+s().filter($=>$.activo!==!1).map($=>`<option value="${c($._id)}"${$._id===g?" selected":""}>${c($.nombre)}</option>`).join("")}function h(g){const b=g.tipo==="transferencia",f=Ce(g.diaPago??""),$=g.tipoFrecuencia==="extraordinario"?"Único":`Cada ${g.frecuencia??1} ${g.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${f?` · ${f}`:""}`,m=!!g.fechaFin&&g.fechaFin<e(),y=b?'<span class="badge badge-purple">⇄ transf.</span>':g.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',S=b?`${c(n(g.cuenta))} → ${c(n(g.cuentaDestino))}`:c(n(g.cuenta)),w=(g.tags||[]).map(E=>`<span class="tag${a.tags.has(E)?" active":""}" data-tag="${c(E)}" title="Filtrar por ${c(E)}">${c(E)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(g.concepto)}</div>
        <div class="tag-list mt-4">${w}</div>
      </div>
      <div>${y}</div>
      <div class="num ${g.tipo==="ingreso"?"pos":b?"":"neg"}">${b?"⇄ ":""}${c(j(g.cuantia))}</div>
      <div class="text-sm">${c($)}</div>
      <div class="text-sm exp-col-hide">${S}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${c(g._id)}"${g.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${g.tipo==="gasto"&&g.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${g.tipo==="gasto"&&g.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${g.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${g.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${c(g.ajustadaEn??"")}">ajustada</span>`:""}
        ${m?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${c(g._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${c(g._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${c(g._id)}">✕</button>
      </div>
    </div>`}function u(g){const b=i(),f=r();g.innerHTML=`
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
        ${b.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':b.map(h).join("")}
      </div>`}function d(g){const b=(g==null?void 0:g.tipo)==="transferencia",f=t.store.get("escenarios"),$=(g==null?void 0:g.escenarioIds)||[],m=(y,S,w,E,_="")=>`<div class="form-group"><label class="form-label">${c(S)}</label>
       <input class="form-input" type="${w}" id="${y}" value="${c(E)}" placeholder="${c(_)}"/></div>`;return`
      <div class="grid-2">
        ${m("ef-concepto","Concepto","text",(g==null?void 0:g.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(g==null?void 0:g.tipo)==="gasto"||!(g!=null&&g.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(g==null?void 0:g.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${b?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${m("ef-cuantia","Cuantía (€)","number",(g==null?void 0:g.cuantia)??"","500")}
        ${m("ef-frecuencia","Frecuencia","number",(g==null?void 0:g.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${Ni.map(([y,S])=>`<option value="${y}"${((g==null?void 0:g.tipoFrecuencia)??"mensual")===y?" selected":""}>${c(S)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${m("ef-fecha-ini","Fecha inicio","date",(g==null?void 0:g.fechaInicio)??e())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${p((g==null?void 0:g.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${b?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${p((g==null?void 0:g.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(g==null?void 0:g.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${g!=null&&g._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${m("ef-fecha-fin","Fecha fin (opcional)","date",(g==null?void 0:g.fechaFin)??"")}</div>
          <div class="mt-8">${Ao(g==null?void 0:g.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${b?' style="display:none"':""}>
            <div class="mt-8" id="ef-clasificacion-wrap"${(g==null?void 0:g.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${((g==null?void 0:g.clasificacion)??"necesidad")==="necesidad"?" selected":""}>Necesidad</option>
                  <option value="deseo"${(g==null?void 0:g.clasificacion)==="deseo"?" selected":""}>Deseo</option>
                  <option value=""${(g==null?void 0:g.clasificacion)===null?" selected":""}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label>
              <input class="form-input" type="text" id="ef-tags" value="${c(((g==null?void 0:g.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
            <div class="form-row mt-8">
              <label class="form-label">Gasto básico</label>
              <label class="toggle"><input type="checkbox" id="ef-basico"${g!=null&&g.basico?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Incluir en el cálculo del colchón económico</span>
            </div>
            <div class="form-row mt-8" id="ef-irpf-wrap"${(g==null?void 0:g.tipo)==="ingreso"?"":' style="display:none"'}>
              <label class="form-label">Sujeto a retención IRPF</label>
              <label class="toggle"><input type="checkbox" id="ef-sujetoIRPF"${g!=null&&g.sujetoIRPF?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Calcula y proyecta la retención mensual</span>
            </div>
          </div>
          ${f.length>0?`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${f.map(y=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${$.includes(y._id)?c(y.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${c(y._id)}"${$.includes(y._id)?" checked":""}/>
                          ${c(y.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${c((g==null?void 0:g._id)??"")}">Guardar</button>
      </div>`}function v(g){var $;const b=(($=g.querySelector("#ef-tipo"))==null?void 0:$.value)??"gasto",f=(m,y)=>{const S=g.querySelector(m);S&&(S.style.display=y?"":"none")};f("#ef-destino-wrap",b==="transferencia"),f("#ef-basico-wrap",b!=="transferencia"),f("#ef-irpf-wrap",b==="ingreso"),f("#ef-clasificacion-wrap",b==="gasto")}function x(g,b,f){const $=document.getElementById("modal-overlay"),m=document.getElementById("modal-content");!$||!m||(m.innerHTML=`<div class="modal-title">${c(b)}</div>${d(g)}`,$.classList.remove("hidden"),J(m,"#ef-tipo",()=>v(m)),J(m,"[data-dp-modo]",()=>So(m)),N(m,"[data-cancelar]",()=>$.classList.add("hidden")),N(m,"[data-guardar]",y=>{I(m,y.getAttribute("data-guardar")||"")&&($.classList.add("hidden"),f())}))}function I(g,b){const f=D=>{var C;return((C=g.querySelector(D))==null?void 0:C.value)??""},$=D=>{var C;return!!((C=g.querySelector(D))!=null&&C.checked)},m=f("#ef-tipo")||"gasto",y=m==="transferencia",S=f("#ef-concepto").trim(),w=parseFloat(f("#ef-cuantia"));if(!S||!Number.isFinite(w))return q("Concepto y cuantía obligatorios","err"),!1;const E=f("#ef-clasificacion"),_={concepto:S,tipo:m,cuantia:w,frecuencia:parseInt(f("#ef-frecuencia"),10)||1,tipoFrecuencia:f("#ef-tipo-frec")||"mensual",fechaInicio:f("#ef-fecha-ini"),fechaFin:f("#ef-fecha-fin")||null,diaPago:Mo(g),cuenta:f("#ef-cuenta"),cuentaDestino:y?f("#ef-cuenta-dest")||"default":void 0,activo:$("#ef-activo"),basico:!y&&$("#ef-basico"),sujetoIRPF:!y&&$("#ef-sujetoIRPF"),clasificacion:m==="gasto"?E||null:void 0,tags:y?["transferencia"]:f("#ef-tags").split(",").map(D=>D.trim()).filter(Boolean),escenarioIds:[...g.querySelectorAll(".ef-escenario:checked")].map(D=>D.value)};return b?(t.store.updateItem("expenses",b,_),q("Actualizado")):(t.store.addItem("expenses",_),q("Creado")),o(),!0}function A(g,b){const f=g.querySelector("[data-busqueda]");let $;f==null||f.addEventListener("input",()=>{clearTimeout($),$=setTimeout(()=>{a.busqueda=f.value,b();const m=g.querySelector("[data-busqueda]");m==null||m.focus(),m==null||m.setSelectionRange(m.value.length,m.value.length)},250)}),J(g,"[data-expirados]",m=>{a.mostrarExpirados=m.checked,b()}),J(g,"[data-f-tipo]",m=>{a.tipo=m.value,b()}),J(g,"[data-f-cuenta]",m=>{a.cuenta=m.value,b()}),J(g,"[data-f-desde]",m=>{a.desde=m.value,b()}),J(g,"[data-f-hasta]",m=>{a.hasta=m.value,b()}),N(g,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,b()}),N(g,"[data-limpiar-tags]",()=>{a.tags=new Set,b()}),N(g,"[data-tag]",m=>{const y=m.getAttribute("data-tag");a.tags.has(y)?a.tags.delete(y):a.tags.add(y),b()}),N(g,"[data-orden]",m=>{const y=m.getAttribute("data-orden");a.orden===y?a.sentido=a.sentido===1?-1:1:(a.orden=y,a.sentido=1),b()}),N(g,"[data-nuevo]",()=>x(null,"Nuevo gasto/ingreso",b)),N(g,"[data-editar]",m=>{const y=t.store.get("expenses").find(S=>S._id===m.getAttribute("data-editar"));y&&x(y,"Editar",b)}),N(g,"[data-duplicar]",m=>{const y=t.store.get("expenses").find(E=>E._id===m.getAttribute("data-duplicar"));if(!y)return;const{_id:S,...w}=y;x({...w,concepto:`${y.concepto} (copia)`},"Duplicar movimiento",b)}),N(g,"[data-borrar]",m=>{Z("¿Eliminar?")&&(t.store.removeItem("expenses",m.getAttribute("data-borrar")),q("Eliminado"),o(),b())}),J(g,"[data-activo]",m=>{const y=m;t.store.updateItem("expenses",y.getAttribute("data-activo"),{activo:y.checked}),o(),b()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:Ti,mount(g){const b=()=>u(g);u(g),g.dataset.wired!=="1"&&(A(g,b),g.dataset.wired="1")}}}function xe(t,e,a){return t.reduce((o,s)=>{if(s.esAmortizacion)return o;const n=pt(e,a,s.fecha);return o+(n>0?s.interes/n:s.interes)},0)}function wo(t,e,a,o){return t.reduce((s,n)=>{const i=pt(e,a,n.fecha),r=n.esAmortizacion?n.amortizacion+n.comisionAmort:n.cuota;return s+(i>0?r/i:r)},0)+o}function Oi(t,e,a){const o=t.amortizaciones||[];return o.map((s,n)=>{const i=at({...t,amortizaciones:o.slice(0,n)}),r=at({...t,amortizaciones:o.slice(0,n+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:xe(i.tabla,e,a)-xe(r.tabla,e,a)}})}const oa=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${c(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function qi(t,e){const a=ba(t),o=(t.amortizaciones||[]).length>0,s=e.periodos.length>0,n=e.usarInflacion&&s,i=s?ha(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,r=s?ya(t.tin||0,i):null,l=o&&s?Oi(t,e.periodos,e.hoy):[],p=l.length?xe(a.sinAmort.tabla,e.periodos,e.hoy)-xe(a.tabla,e.periodos,e.hoy):null,h=p===null?null:p-a.costeTotalAmort,u=n?wo(a.tabla,e.periodos,e.hoy,a.comAp):null,d=n&&o?wo(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
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
        ${oa("Cuota mensual",c(j(a.cuota)),e.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${c(j(e.cuotaMes))}</div>`:"")}
        ${oa("Total intereses",c(j(a.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(j(a.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${c(a.fechaFin||"—")}</div>
          ${o&&a.fechaFin!==a.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(a.sinAmort.fechaFin||"—")}${a.ahorroTiempo>0?` (−${a.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${oa("Total pagado",c(j(a.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${c(j(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${c(ma(a.tae))}</div></div>
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
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${c(Ce(t.diaPago))}</div></div>`:""}
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

      ${u!==null?Li(t,a.totalPagado,u,d):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${n?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(v=>Bi(v,n,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,x)=>ki(t._id,v,l[x]??null,e)).join("")}`:""}
    </div>
  </div>`}function Li(t,e,a,o){const s=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-a,l=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
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
  </div>`}function Bi(t,e,a){let o="";if(e&&!t.esAmortizacion){const s=pt(a.periodos,a.hoy,t.fecha);o=c(j(s>0?t.cuota/s:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":c(t.mes)}</td>
    <td class="num">${c(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":c(j(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${c(j(t.interes))}</td>
    <td class="num">${c(j(t.amortizacion))}</td>
    <td class="num">${c(j(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function ki(t,e,a,o){const s=(e.escenarioIds||[]).map(n=>`<span class="badge badge-yellow">🔭 ${c(o.nombreEscenario(n))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
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
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,Bt=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([s,n])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(n)}</option>`).join("")}
   </select></div>`,ne=(t,e,a,o="")=>`<label class="form-label">${c(e)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${a?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${c(o)}</span>`:""}`;function ie(t,e,a){return t.length===0?"":`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${t.map(o=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${e.includes(o._id)?c(o.color||"var(--accent)"):"var(--border)"}">
            <input type="checkbox" class="${c(a)}" value="${c(o._id)}"${e.includes(o._id)?" checked":""}/>
            ${c(o.nombre)}
          </label>`).join("")}
    </div></div>`}const Hi=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function Gi(t,e,a,o=Y()){return`
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
            <select class="form-select" id="f-cuenta">${Hi(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${Ao(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Bt("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
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
          ${ne("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${ie(a,(t==null?void 0:t.escenarioIds)??[],"loan-escenario")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${ne("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${ne("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${ne("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Vi(t,e,a,o=Y()){return`
    <div class="grid-2">
      ${tt("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??o)}
      ${tt("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Bt("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(e==null?void 0:e.tipo)??"cuota")}
    </div>
    ${ie(a,(e==null?void 0:e.escenarioIds)??[],"amort-escenario")}
    <div class="form-row mt-8">
      ${ne("am-sim","Simulación",!!(e!=null&&e.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${c(t)}|${c((e==null?void 0:e._id)??"")}">${e?"Guardar cambios":"Añadir"}</button>
    </div>`}const Co="opt_",jo=t=>String(t).startsWith(Co);function Ui(t){let e=null,a=null;const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content");function n(f,$){const m=o(),y=s();return!m||!y?null:(y.innerHTML=`<div class="modal-title">${c(f)}</div>${$}`,m.classList.remove("hidden"),y)}const i=()=>{var f;return(f=o())==null?void 0:f.classList.add("hidden")};function r(){let f=!1;for(const $ of t.loans()){const m=($.amortizaciones||[]).filter(y=>!jo(y._id));m.length!==($.amortizaciones||[]).length&&(t.guardarAmortizaciones($._id,m),f=!0)}return f}function l(f){try{return f()}catch($){return q($ instanceof Error?$.message:"No se ha podido completar el cálculo","err"),null}}function p(){var E,_;if(!Va("optimizador")){q("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const f=t.loans().filter(D=>D.activo&&!D.simulacion);if(f.length===0){q("No hay préstamos activos para optimizar","err");return}const $=t.config(),m=t.accounts().filter(D=>D.activo&&!D.simulacion),y=((E=m.find(D=>D.esCuentaPrincipal))==null?void 0:E._id)??((_=m[0])==null?void 0:_._id)??"",S=$.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,w=n("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${m.map(D=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${c(D._id)}"${D._id===y?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(D.nombre)}${D._id===y?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
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
        ${Bt("opt-tipo","Efecto de la amortización",[["plazo","Reducir plazo (mantener cuota)"],["cuota","Reducir cuota (mantener plazo)"]],"plazo")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${tt("opt-fecha-primera","Fecha primera amortización","date","")}
        ${tt("opt-fecha-obj","Fecha objetivo para comparar saldo","date",S)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);w&&(h(w),J(w,".opt-acc-radio",()=>h(w)),N(w,"[data-opt-todos]",()=>{const D=[...w.querySelectorAll(".opt-loan-check")],C=D.every(M=>M.checked);D.forEach(M=>M.checked=!C)}),N(w,"[data-cancelar]",i),N(w,"[data-opt-calcular]",()=>x(w)),N(w,"[data-opt-comparar]",()=>I(w)))}function h(f){var w;const $=(w=f.querySelector(".opt-acc-radio:checked"))==null?void 0:w.value,y=(t.config().margenesSeguridad||[]).filter(E=>E.activo!==!1).filter(E=>!E.cuentas||E.cuentas.length===0||$&&E.cuentas.includes($)),S=f.querySelector("#opt-margenes-wrap");S&&(S.innerHTML=y.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':y.map(E=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${c(E._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(E.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!E.cuentas||E.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function u(f){var S,w,E,_;const $=(D,C,M=0)=>{var F;const z=parseFloat(((F=f.querySelector(D))==null?void 0:F.value)??"");return Number.isFinite(z)?Math.max(M,z):C},m=[...f.querySelectorAll(".opt-loan-check")],y=m.filter(D=>D.checked).map(D=>D.value);return{horizonte:Math.round($("#opt-horizonte",60,1)),frecuencia:Math.round($("#opt-frecuencia",1,1)),minAmortizable:$("#opt-min",500),tipoAmort:((S=f.querySelector("#opt-tipo"))==null?void 0:S.value)||"plazo",fechaObjetivo:((w=f.querySelector("#opt-fecha-obj"))==null?void 0:w.value)||null,fechaPrimeraAmort:((E=f.querySelector("#opt-fecha-primera"))==null?void 0:E.value)||null,loanIds:m.length===0||y.length===m.length?null:y,sourceAccountId:((_=f.querySelector(".opt-acc-radio:checked"))==null?void 0:_.value)??null,selectedMarginIds:[...f.querySelectorAll(".opt-margin-check:checked")].map(D=>D.value)}}const d=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function v(f,$=""){const m=n("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${c(f)}</div>
        ${$?`<div class="text-sm mt-8" style="color:var(--text3)">${c($)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);m&&(N(m,"[data-opt-volver]",p),N(m,"[data-cancelar]",i))}function x(f){const $=u(f);r()&&q("Plan anterior eliminado, recalculando…");const{loans:m,expenses:y,accounts:S,config:w,nominas:E}=d(),_=l(()=>Le(m,y,S,w,{frecuencia:$.frecuencia,mesesHorizonte:$.horizonte,minAmortizable:$.minAmortizable,tipoAmort:$.tipoAmort,fechaPrimeraAmort:$.fechaPrimeraAmort,loanIds:$.loanIds,nominas:E,sourceAccountId:$.sourceAccountId,selectedMarginIds:$.selectedMarginIds}));if(!_)return;if(_.plan.length===0){v(`No hay excedente suficiente respetando los ${_.margenesAplicados} márgenes de seguridad activos en los próximos ${$.horizonte} meses para generar amortizaciones por encima del mínimo de ${j($.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}a={plan:_.plan,tipoAmort:$.tipoAmort};const D=`✨ Plan de optimización · ${$.frecuencia===1?"Mensual":`Cada ${$.frecuencia} meses`} · ${$.horizonte}m`,C=n(D,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(j(_.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${c(j(_.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${c(j(_.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${_.margenesAplicados}</div></div>
      </div>
      ${_.resumenPorLoan.map(zo).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${_.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${_.plan.map(M=>Eo(M,!0)).join("")}</tbody>
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
      </div>`);C&&(N(C,"[data-opt-volver]",p),N(C,"[data-cancelar]",i),N(C,"[data-opt-aplicar]",()=>{a&&g(a.plan,a.tipoAmort)}))}function I(f){const $=u(f);r();const{loans:m,expenses:y,accounts:S,config:w,nominas:E}=d(),_=l(()=>Ja(m,y,S,w,{horizonte:$.horizonte,minAmortizable:$.minAmortizable,tipoAmort:$.tipoAmort,fechaObjetivo:$.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:$.fechaPrimeraAmort,loanIds:$.loanIds,nominas:E,sourceAccountId:$.sourceAccountId,selectedMarginIds:$.selectedMarginIds}));if(!_)return;if(_.resultados.length===0){v("No hay excedente suficiente en ninguna frecuencia.");return}e=_;const{resultados:D,saldoBase:C,fechaObjetivo:M}=_,z=D.map(T=>{const R=[T.esMejorIntereses&&"💰 +intereses",T.esMejorSaldo&&"🏦 +saldo",T.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${T.esMejorValor?"background:rgba(46,230,168,0.06);":""}">
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
      </div>`);F&&(N(F,"[data-opt-volver]",p),N(F,"[data-cancelar]",i),N(F,"[data-opt-usar]",T=>A(Number(T.getAttribute("data-opt-usar")))))}function A(f){var m;const $=e==null?void 0:e.resultados.find(y=>y.frecuencia===f);$&&(r(),g($.plan,((m=$.plan[0])==null?void 0:m.tipoAmort)||"plazo",{titulo:`✨ Plan ${$.label} · aplicado`,resumen:$,fechaObjetivo:e==null?void 0:e.fechaObjetivo}))}function g(f,$,m){if(f.length===0)return;const y=new Map;for(const w of f){const E=y.get(w.loanId)??[];E.push({_id:`${Co}${w.mes}_${w.loanId}`,fecha:w.fechaAmort,cantidad:w.cantidadAmort,tipo:$,simulacion:!0}),y.set(w.loanId,E)}let S=0;for(const w of t.loans()){const E=y.get(w._id);if(!E)continue;const _=(w.amortizaciones||[]).filter(D=>!jo(D._id));t.guardarAmortizaciones(w._id,[..._,...E]),S+=1}q(`Plan aplicado: ${f.length} amortizaciones en ${S} préstamo${S!==1?"s":""} (simulación)`),m?b(m):i(),t.refrescar([...y.keys()])}function b({titulo:f,resumen:$,fechaObjetivo:m}){const y=n(f,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(j($.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${c(j($.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${c((m==null?void 0:m.slice(0,7))??"")}</div><div class="stat-value pos">${c(j($.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${c(j($.totalComisiones))}</div></div>
      </div>
      ${$.resumenPorLoan.map(zo).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${$.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${$.plan.map(S=>Eo(S,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);y&&N(y,"[data-cancelar]",i)}return{abrir:p,get planManual(){return a},get comparativa(){return e}}}function Eo(t,e){const a=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${c(j(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${c(t.mes)}</td>
    <td>${c(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${c(j(t.capitalAntes))}</td>
    <td class="num neg">${c(j(t.cantidadAmort))}${a}</td>
    <td class="num">${c(j(t.capitalDespues))}</td>
    ${e?`<td class="num" style="color:var(--text3)">${c(j(t.saldoDisponible))} → ${c(j(t.saldoDespues))}</td>`:""}
  </tr>`}function zo(t){return`<div class="card mb-8" style="padding:12px">
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
  </div>`}const Yi="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Ji(t){const e=t.hoy??Y;let a=!1;const o=new Set;let s=null;const n=()=>{var m;return(m=t.onDatosCambiados)==null?void 0:m.call(t)},i=()=>t.store.get("escenarios"),r=m=>{var y;return((y=i().find(S=>S._id===m))==null?void 0:y.nombre)??m};function l(m){if(!m.activo||m.simulacion)return!1;const y=at(m).tabla.filter(S=>!S.esAmortizacion);return y.length===0?!0:y[y.length-1].fecha<e()}function p(m,y){const S=e(),w=S.slice(0,7),E=new Map;let _=0;for(const D of m){if(!D.activo||D.simulacion||y.has(D._id)||(D.fechaInicio||"")>S)continue;const C=at(D).tabla.filter(z=>!z.esAmortizacion&&z.fecha.startsWith(w)),M=C.length>0?C[0].cuota:0;E.set(D._id,M),_+=M}return{porLoan:E,total:_,activos:[...E.values()].filter(D=>D>0).length}}function h(m){const y=t.store.get("config"),S=y.dashboardStart,w=y.dashboardEnd,E=Math.max(1,(G(w).getTime()-G(S).getTime())/(30.44*864e5));let _=0;for(const D of m)!D.activo||D.simulacion||(_+=at(D).tabla.filter(C=>!C.esAmortizacion&&C.fecha>=S&&C.fecha<=w).reduce((C,M)=>C+M.cuota,0));return{media:_/E,desde:S,hasta:w}}function u(m){const y=[...t.store.get("loans")].sort((z,F)=>F.tin-z.tin),S=new Set(y.filter(l).map(z=>z._id)),w=a?y:y.filter(z=>!S.has(z._id)),E=p(y,S),_=h(y),D=t.store.get("config"),C=t.store.get("inflacion"),M=new Date(G(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});m.innerHTML=`
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
        ${w.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':w.map(z=>qi(z,{periodos:C,usarInflacion:!!D.usarInflacion,hoy:e(),cuotaMes:E.porLoan.get(z._id)??0,completado:S.has(z._id),nombreEscenario:r})).join("")}
      </div>`;for(const z of m.querySelectorAll("[data-body-loan]"))o.has(z.dataset.bodyLoan??"")&&z.classList.add("open")}const d=()=>document.getElementById("modal-overlay"),v=()=>document.getElementById("modal-content"),x=()=>{var m;return(m=d())==null?void 0:m.classList.add("hidden")};function I(m,y){const S=d(),w=v();return!S||!w?null:(w.innerHTML=`<div class="modal-title">${c(m)}</div>${y}`,S.classList.remove("hidden"),N(w,"[data-cancelar]",x),w)}function A(m,y){const S=m?t.store.get("loans").find(E=>E._id===m)??null:null,w=I(m?"Editar préstamo":"Nuevo préstamo",Gi(S,t.store.get("accounts"),i(),e()));w&&(w.addEventListener("change",E=>{var _;(_=E.target)!=null&&_.matches("[data-dp-modo]")&&So(w)}),N(w,"[data-guardar-loan]",E=>{g(w,E.getAttribute("data-guardar-loan")||"")&&(x(),y())}))}function g(m,y){const S=z=>{var F;return((F=m.querySelector(z))==null?void 0:F.value)??""},w=z=>{var F;return!!((F=m.querySelector(z))!=null&&F.checked)},E=S("#f-nombre").trim(),_=parseFloat(S("#f-capital")),D=parseFloat(S("#f-tin")),C=parseInt(S("#f-meses"),10);if(!E||!Number.isFinite(_)||!Number.isFinite(D)||!Number.isFinite(C))return q("Completa los campos obligatorios","err"),!1;const M={nombre:E,capital:_,tin:D,meses:C,fechaInicio:S("#f-fecha"),comisionApertura:parseFloat(S("#f-com-ap"))||0,comisionAmort:parseFloat(S("#f-com-am"))||0,diaPago:Mo(m),cuenta:S("#f-cuenta"),simulacion:w("#f-sim"),activo:w("#f-activo"),mostrarFechaFinEnDashboard:w("#f-mostrar-fin"),tipoTasa:S("#f-tipo-tasa"),basico:w("#f-basico"),tags:S("#f-tags").split(",").map(z=>z.trim()).filter(Boolean),escenarioIds:[...m.querySelectorAll(".loan-escenario:checked")].map(z=>z.value)};return y?(t.store.updateItem("loans",y,M),q("Préstamo actualizado")):(t.store.addItem("loans",{...M,amortizaciones:[]}),q("Préstamo creado")),n(),!0}function b(m,y,S){const w=t.store.get("loans").find(D=>D._id===m);if(!w)return;const E=y?(w.amortizaciones||[]).find(D=>D._id===y)??null:null,_=I(y?"Editar amortización":"Añadir amortización",Vi(m,E,i(),e()));_&&N(_,"[data-guardar-amort]",D=>{const[C,M]=(D.getAttribute("data-guardar-amort")||"").split("|");f(_,C,M)&&(x(),S([C]))})}function f(m,y,S){var F;const w=T=>{var R;return((R=m.querySelector(T))==null?void 0:R.value)??""},E=w("#am-fecha"),_=parseFloat(w("#am-cant"));if(!E||!Number.isFinite(_)||_<=0)return q("Fecha y cantidad requeridas","err"),!1;const D=t.store.get("loans").find(T=>T._id===y);if(!D)return!1;const C={fecha:E,cantidad:_,tipo:w("#am-tipo"),simulacion:!!((F=m.querySelector("#am-sim"))!=null&&F.checked),escenarioIds:[...m.querySelectorAll(".amort-escenario:checked")].map(T=>T.value)},M=D.amortizaciones||[],z=S?M.map(T=>T._id===S?{...T,...C}:T):[...M,{_id:Date.now().toString(36),...C}];return t.store.updateItem("loans",y,{amortizaciones:z}),q(S?"Amortización actualizada":"Amortización añadida"),n(),!0}function $(m,y,S){N(m,"[data-toggle-finalizados]",()=>{a=!a,y()}),N(m,"[data-nuevo-loan]",()=>A(null,y)),N(m,"[data-optimizar]",()=>S.abrir()),N(m,"[data-toggle-loan]",(w,E)=>{var M;if((M=E.target)!=null&&M.closest("button"))return;const _=w.getAttribute("data-toggle-loan"),D=[...m.querySelectorAll("[data-body-loan]")].find(z=>z.dataset.bodyLoan===_);(D==null?void 0:D.classList.toggle("open"))?o.add(_):o.delete(_)}),N(m,"[data-editar-loan]",w=>A(w.getAttribute("data-editar-loan"),y)),N(m,"[data-borrar-loan]",w=>{if(!Z("¿Eliminar préstamo?"))return;const E=w.getAttribute("data-borrar-loan");t.store.removeItem("loans",E),o.delete(E),q("Eliminado"),n(),y()}),N(m,"[data-amort-loan]",w=>{const E=w.getAttribute("data-amort-loan");o.add(E),b(E,null,y)}),N(m,"[data-editar-amort]",w=>{const[E,_]=(w.getAttribute("data-editar-amort")||"").split("|");o.add(E),b(E,_,y)}),N(m,"[data-borrar-amort]",w=>{const[E,_]=(w.getAttribute("data-borrar-amort")||"").split("|"),D=t.store.get("loans").find(C=>C._id===E);D&&(t.store.updateItem("loans",E,{amortizaciones:(D.amortizaciones||[]).filter(C=>C._id!==_)}),q("Amortización eliminada"),n(),y([E]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Yi,mount(m){const y=(S=[])=>{for(const w of S)o.add(w);u(m)};s??(s=Ui({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(S,w)=>{t.store.updateItem("loans",S,{amortizaciones:w}),n()},hoy:e,refrescar:y})),u(m),m.dataset.wired!=="1"&&($(m,y,s),m.dataset.wired="1")}}}const Wi={transporte:125,restaurante:220,otros:null},Ki={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Qi=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],kt=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,Xi=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function Zi(t,e){const a=t.map((n,i)=>{const r=e.find(h=>h._id===n.cuenta),l=Wi[n.tipo],p=l!=null&&n.importe>l;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${c(Ki[n.tipo]??n.tipo)}</span>
        <span style="flex:1;font-size:12px">${c(j(n.importe))}/mes${p?` <span style="color:var(--red)" title="Supera el límite orientativo de ${c(j(l))}/mes">⚠</span>`:""}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function tr(t,e){const a=e.hoy??Y(),o=(t==null?void 0:t.nPagas)??12,s=[12,14,16].includes(o);return`
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
        <select class="form-select" id="nf-cuenta">${Xi(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
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
              ${Qi.map((n,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${c(n)} (${i+1})</option>`).join("")}
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
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??Te).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${ie(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"nom-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function _o(t,e){const a=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const l=parseFloat(a(i));return Number.isFinite(l)?l:r},s=a("#nf-npagas"),n=s==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(s,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:n,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Te),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:e}}function er(t,e,a,o){const s=_o(t,e),n=e.reduce((g,b)=>g+(b.importe||0)*12,0),i=Math.max(0,s.bruto-n),r=i*(s.ssPct/100),l=s.irpfModo==="manual"?i*(s.irpfPct/100):ut(St(s.bruto,n),a.tramos),p=i-r-l,h=i/s.nPagas,u=r/s.nPagas,d=l/s.nPagas,v=h-u-d,x=s.grupoNomina?a.nominas.filter(g=>g.grupoNomina===s.grupoNomina&&g._id!==o):[],I=x.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${c(s.grupoNomina)}" con ${c(x.map(g=>g.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",A=n>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${c(j(n))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${c(j(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${c(j(s.bruto))}</span>
      ${A}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${c(j(r))} (${s.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${c(j(l))} (${i>0?(l/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${c(j(p))}</span>
      ${n>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${c(j(n))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${c(j(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${s.representacion==="simplificado"?`ingreso ${c(j(v))}/paga`:`ingreso ${c(j(h))} − SS ${c(j(u))} − IRPF ${c(j(d))}`}${n>0?" + recargas flex":""}</span>
    </div>${I}`}function ar(t,e,a,o){const s=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=Zi(e,a.accounts))},n=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=er(t,e,a,o))},i=()=>{var l,p;const r=(h,u)=>{const d=t.querySelector(h);d&&(d.style.display=u?"":"none")};r("#nf-custom-pagas-wrap",((l=t.querySelector("#nf-npagas"))==null?void 0:l.value)==="custom"),r("#nf-irpfpct-wrap",((p=t.querySelector("#nf-irpfmodo"))==null?void 0:p.value)==="manual"),n()};t.addEventListener("input",r=>{var l;(l=r.target)!=null&&l.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&n()}),J(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),N(t,"[data-flex-anadir]",()=>{var p,h,u;const r=((p=t.querySelector("#fc-tipo"))==null?void 0:p.value)||"transporte",l=parseFloat(((h=t.querySelector("#fc-importe"))==null?void 0:h.value)??"")||0;if(!l)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:r,importe:l,cuenta:((u=t.querySelector("#fc-cuenta"))==null?void 0:u.value)||""}),s(),n()}),N(t,"[data-flex-borrar]",r=>{e.splice(Number(r.getAttribute("data-flex-borrar")),1),s(),n()}),s(),n()}const Fo=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function or(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??gt;function r(d,v){const x=o(),I=s();return!x||!I?null:(I.innerHTML=`<div class="modal-title">${c(d)}</div>${v}`,x.classList.remove("hidden"),N(I,"[data-cerrar]",n),I)}function l(){e=null;const d=[...t.store.get("tramosIRPFHistorico")].sort((I,A)=>I.año-A.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",x=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${c(Fo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${d.map(I=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${I.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(Fo(I.tramos))}</span>
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
      </div>`);x&&(N(x,"[data-editar-tabla]",I=>{const A=I.getAttribute("data-editar-tabla");u(A==="default"?"default":Number(A))}),N(x,"[data-borrar-tabla]",I=>{const A=Number(I.getAttribute("data-borrar-tabla"));Z(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(g=>g.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),N(x,"[data-anadir-anyo]",()=>{var g;const I=parseInt(((g=x.querySelector("#irpf-new-year"))==null?void 0:g.value)??"",10);if(!I||I<2e3||I>2100)return q("Año inválido","err");const A=t.store.get("tramosIRPFHistorico");if(A.some(b=>b.año===I))return q("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...A,{_id:Date.now().toString(36),año:I,tramos:i().map(b=>[...b])}]),t.onDatosCambiados(),u(I)}))}function p(){return a.map(([d,v],x)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${x}" value="${d}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${x}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${x}">✕</button>
          </div>
        </div>`).join("")}function h(d){a=[...d.querySelectorAll("[data-tr-min]")].map((x,I)=>{const A=d.querySelector(`[data-tr-pct="${I}"]`);return[parseFloat(x.value)||0,parseFloat((A==null?void 0:A.value)??"")||0]})}function u(d){var b;e=d;const v=t.store.get("tramosIRPFHistorico");a=(d==="default"?i():((b=v.find(f=>f.año===d))==null?void 0:b.tramos)??i()).map(f=>[...f]);const I=d==="default"?"tabla por defecto":`ejercicio ${d}`,A=r(`Tramos IRPF — ${d==="default"?"Por defecto":d}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${c(I)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${p()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!A)return;const g=()=>{const f=A.querySelector("#irpf-tramos-rows");f&&(f.innerHTML=p())};N(A,"[data-volver]",l),N(A,"[data-tr-anadir]",()=>{h(A),a.push([0,0]),g()}),N(A,"[data-tr-borrar]",f=>{h(A),a.splice(Number(f.getAttribute("data-tr-borrar")),1),g()}),N(A,"[data-tr-guardar]",()=>{h(A);const f=[...a].sort(($,m)=>$[0]-m[0]);if(f.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:f}),q("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map($=>$.año===e?{...$,tramos:f}:$)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}const Po=1500,Pt=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(s)}"/></div>`,sr=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([s,n])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(n)}</option>`).join("")}
   </select></div>`,nr=t=>(t.modeloFondo||"cuenta")==="pension";function ir(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(s=>rr(s,e,a,o)).join("")}</div>`}function rr(t,e,a,o){const s=me(t);if(!s)return"";const n=De(t,e,a),i=o.slice(0,4),r=(t.aportaciones||[]).filter(p=>p.fecha>=`${i}-01-01`).reduce((p,h)=>p+h.cantidad,0),l=Math.min(r,Po)*(n/100);return`<div class="card">
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
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>Po?"neg":""}">${c(j(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${c(j(l))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${c(t.grupoNomina)}": ${n}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${s.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${c(s.proxDesbloqueo)}</div>`:""}
  </div>`}function lr(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function cr(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,s=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],n=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${Pt("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${Pt("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Pt("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${Pt("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${Pt("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${sr("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${Pt("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${n?' style="display:none"':""}>
        ${Pt("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
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
    ${ie(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"pen-escenario")}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function dr(t,e,a){const o=()=>{const s=t.querySelector("#pen-aport-container");s&&(s.innerHTML=lr(e))};J(t,"#pen-grupo",s=>{const n=t.querySelector("#pen-impuesto-wrap");n&&(n.style.display=s.value?"none":"")}),N(t,"[data-aport-anadir]",()=>{var n,i,r,l;const s=parseFloat(((n=t.querySelector("#paport-importe"))==null?void 0:n.value)??"")||0;if(!s)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#paport-fin"))==null?void 0:l.value)||""}),o()}),N(t,"[data-aport-borrar]",s=>{e.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function ur(t,e,a,o){var A;const s=g=>{var b;return((b=t.querySelector(g))==null?void 0:b.value)??""},n=(g,b=0)=>{const f=parseFloat(s(g));return Number.isFinite(f)?f:b},i=g=>{var b;return!!((b=t.querySelector(g))!=null&&b.checked)},r=s("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const l=n("#pen-saldo"),p=s("#pen-grupo"),h={nombre:r,grupoNomina:p,saldo:l,saldoInicial:n("#pen-saldo-ini"),fechaInicialSaldo:s("#pen-fecha-ini")||o,interes:n("#pen-interes"),periodoCobro:s("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(s("#pen-bloqueo"),10)||120,impuestoRetirada:p?0:n("#pen-impuesto"),planAportaciones:e,descripcion:s("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(g=>g.value)},u=[...(a==null?void 0:a.historicoSaldos)??[]],d=[...(a==null?void 0:a.aportaciones)??[]],x=((A=[...u].sort((g,b)=>b.fecha.localeCompare(g.fecha))[0])==null?void 0:A.saldo)??(a==null?void 0:a.saldo)??null,I=Date.now().toString(36);return a?(x===null||Math.abs(l-x)>.005)&&(u.push({_id:I,fecha:o,saldo:l,nota:"Actualización manual"}),l>(x??0)&&d.push({_id:`${I}a`,fecha:o,cantidad:l-(x??0)})):l>0&&(u.push({_id:I,fecha:o,saldo:l,nota:"Saldo inicial"}),d.push({_id:`${I}a`,fecha:h.fechaInicialSaldo??o,cantidad:l})),{datos:{...h,historicoSaldos:u,aportaciones:d}}}const pr="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function mr(t){const e=t.hoy??Y,a=()=>{var A;return(A=t.onDatosCambiados)==null?void 0:A.call(t)};function o(){const A=t.store.get("config");return bt(t.store.get("tramosIRPFHistorico"),A.tramos_irpf??gt)(Number(e().slice(0,4)))}function s(A,g,b){const f=Re(A,g,b),$=!!g&&A.irpfModo!=="manual",m=[A.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${A.mesActualizacionIPC}">IPC m${A.mesActualizacionIPC}</span>`:"",f.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${c(j(f.flexAnual))}/año</span>`:"",Math.abs(f.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${f.ssPct.toFixed(2)}%</span>`:""].join("");return`<div class="exp-table-row">
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
    </div>`}const n=A=>{var g;return((g=t.store.get("accounts").find(b=>b._id===(A||"default")))==null?void 0:g.nombre)??(A||"default")};function i(A,g,b){const f=g.reduce((y,S)=>y+(S.bruto||0),0),$=ys(g,b),m=f>0?$/f*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${c(A)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${c(j(f))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${m.toFixed(1)}%</strong> (${c(j($))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${g.map(y=>s(y,g,b)).join("")}
      </div>
    </div>`}function r(A){const g=o(),b=[...t.store.get("nominas")].sort((S,w)=>(w.bruto||0)-(S.bruto||0)),{grupos:f,sueltas:$}=$s(b),m=t.store.get("accounts").filter(nr),y=b.filter(S=>S.activo!==!1);A.innerHTML=`
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
      ${[...f.entries()].map(([S,w])=>i(S,w,g)).join("")}
      ${$.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${$.map(S=>s(S,null,g)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${ir(m,y,g,e())}</div>`}const l=()=>document.getElementById("modal-overlay"),p=()=>document.getElementById("modal-content"),h=()=>{var A;return(A=l())==null?void 0:A.classList.add("hidden")};function u(A,g){const b=l(),f=p();return!b||!f?null:(f.innerHTML=`<div class="modal-title">${c(A)}</div>${g}`,b.classList.remove("hidden"),N(f,"[data-cancelar]",h),f)}function d(A,g){const b=A?t.store.get("nominas").find(y=>y._id===A)??null:null,f=[...(b==null?void 0:b.retribucionFlexible)??[]].map(y=>({...y})),$={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:o(),hoy:e()},m=u(A?"Editar nómina":"Nueva nómina",tr(b,$));m&&(ar(m,f,$,A??""),N(m,"[data-guardar-nomina]",y=>{const S=_o(m,f);if(!S.nombre||S.bruto<=0)return q("Nombre y bruto anual son obligatorios","err");const w=y.getAttribute("data-guardar-nomina")||"",E={...S,activo:!0,tags:["nomina"]};w?(t.store.updateItem("nominas",w,E),q("Nómina actualizada")):(t.store.addItem("nominas",E),q("Nómina creada")),a(),h(),g()}))}function v(A,g){const b=A?t.store.get("accounts").find(m=>m._id===A)??null:null,f=[...(b==null?void 0:b.planAportaciones)??[]].map(m=>({...m})),$=u(A?"Editar plan de pensiones":"Nuevo plan de pensiones",cr(b,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:e()}));$&&(dr($,f,e()),N($,"[data-guardar-pension]",m=>{const{datos:y,error:S}=ur($,f,b,e());if(S)return q(S,"err");const w=m.getAttribute("data-guardar-pension")||"";w?(t.store.updateItem("accounts",w,y),q("Plan actualizado")):(t.store.addItem("accounts",y),q("Plan creado")),a(),h(),g()}))}function x(A,g,b){N(A,"[data-nueva-nomina]",()=>d(null,g)),N(A,"[data-editar-nom]",f=>d(f.getAttribute("data-editar-nom"),g)),N(A,"[data-borrar-nom]",f=>{Z("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",f.getAttribute("data-borrar-nom")),q("Eliminada"),a(),g())}),J(A,"[data-activo-nom]",f=>{const $=f;t.store.updateItem("nominas",$.getAttribute("data-activo-nom"),{activo:$.checked}),a(),g()}),N(A,"[data-tramos]",()=>b.abrir()),N(A,"[data-nueva-pension]",()=>v(null,g)),N(A,"[data-editar-pension]",f=>v(f.getAttribute("data-editar-pension"),g)),N(A,"[data-borrar-pension]",f=>{Z("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",f.getAttribute("data-borrar-pension")),q("Plan eliminado"),a(),g())})}let I=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:pr,mount(A){const g=()=>r(A);I??(I=or({store:t.store,onDatosCambiados:()=>{a(),g()},año:()=>Number(e().slice(0,4))})),r(A),A.dataset.wired!=="1"&&(x(A,g,I),A.dataset.wired="1")}}}const fr="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",vr="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",Do={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},gr={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function br(t,e){const a=t.filter(l=>l.activo&&mt(l)==="inversion");if(a.length===0)return"";let o=0,s=0,n=0,i=0;for(const l of a){const p=Rt(l,e);p&&(o+=p.saldo,s+=p.costBase,n+=p.plusvalia,i+=p.impuesto)}const r=s>0?(n/s*100).toFixed(1):"0";return`
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
    </div>`}function hr(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,s=Math.max(1,(G(o).getTime()-G(a).getTime())/(30.44*864e5)),n=Jt(t,a),i=n*(Math.pow(1+t.interes/100,s/12)-1);let r="";if(e.config.usarInflacion&&e.inflacion.length>0){const l=n*(pt(e.inflacion,a,o)-1),p=i-l;r=`
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
  </div>`}function yr(t,e){const a=Do[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,s=e.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(x=>x.cuenta===t._id).map(x=>({nomina:v,importe:x.importe}))),n=s.reduce((v,x)=>v+x.importe,0),i=n*12,r=o!==null&&i>o,l=o!==null?Math.min(i,o):i,p=t.grupoNomina?e.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):s.slice(0,1).map(v=>v.nomina),h=wa(p,e.tramosIRPF),u=l*h/100,d=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${h}%`:`tipo marginal ${h}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
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
    ${u>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${c(d)}">≈ ${c(j(u))}/año <span style="font-size:10px;color:var(--text3)">(${c(h)}%)</span></span></div>`:""}
    ${s.length>0?s.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${c(v.nomina.nombre)}: ${c(j(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function xr(t){const e=me(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(j(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(j(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${c(j(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${c(j(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${c(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${c(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function $r(t,e){const a=Rt(t,e.tramosGanancias);if(!a)return"";const o=e.config,s=e.flujos(t._id),n=G(o.dashboardStart),i=G(o.dashboardEnd),r=Math.max(0,(i.getTime()-n.getTime())/(30.44*864e5)),l=a.saldo+s.totalAportaciones-s.totalReembolsos,p=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,h=l>0&&r>0?Math.max(0,l*Math.pow(1+p,r)):Math.max(0,l),u=a.costBase+s.totalAportaciones,d=Math.max(0,h-u),v=Pe(d,e.tramosGanancias),x=d>0?(v/d*100).toFixed(1):"0",I=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",A=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",g=(S,w,E)=>S.map(_=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${w} ${c(_.contraparte)}: ${c(_.concepto)}</span>
          <span class="num ${E}">${c(j(_.total))} · ${_.ocurrencias} mov.</span>
        </div>`).join(""),f=s.entradas.length>0||s.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${c(o.dashboardStart.slice(0,7))} → ${c(o.dashboardEnd.slice(0,7))})</div>
         ${g(s.entradas,"↓","pos")}
         ${g(s.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${s.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${c(j(s.totalAportaciones))}</span></div>`:""}
           ${s.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${c(j(s.totalReembolsos))}</span></div>`:""}
           ${s.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${c(j(s.retencion))}</span></div>`:s.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',$=e.invModo(t._id),m=S=>`padding:3px 10px;border-radius:20px;border:1px solid ${S?"var(--accent)":"var(--border)"};background:${S?"var(--accent-dim)":"transparent"};color:${S?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,y=$==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(j(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${c(j(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${c(j(a.neto))}</div><div class="stat-sub">${c(A)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${c(j(u))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${c(j(h))}</div><div class="stat-sub">${c(I)} · ${c(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${c(j(h-v))}</div><div class="stat-sub">${c(x)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${c(t._id)}|real" style="${m($==="real")}">Real</button>
          <button data-inv-modo="${c(t._id)}|proyeccion" style="${m($==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${y}
      ${f}
    </div>`}function Ir(t,e){const a=[...t.historicoSaldos||[]].sort((l,p)=>p.fecha.localeCompare(l.fecha)),o=a[0],s=rt(t),n=mt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",n==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",n==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",n==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${c((Do[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(l=>`<span class="badge badge-yellow">🔭 ${c(e.nombreEscenario(l))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${c(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${c(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${c(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${vr}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${fr}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${c(j(t.saldoInicial||0))}</div><div class="stat-sub">${c(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${c(j(s))}</div>${o?`<div class="stat-sub">Registro: ${c(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${c(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${c(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${hr(t,e)}
    ${n==="beneficio"?yr(t,e):""}
    ${n==="pension"?xr(t):""}
    ${n==="inversion"?$r(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${c(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${c(t.descripcion)}</div>`:""}
  </div>`}const Ar=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function Sr(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Mr(t,e){const a=t?mt(t):"cuenta",o=[...new Set(e.nominas.filter(n=>n.grupoNomina).map(n=>n.grupoNomina))],s=n=>n?"":' style="display:none"';return`
    <div class="grid-2">
      ${tt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Bt("ac-modelo","Tipo",Ar,a)}
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
          ${Bt("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${Bt("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
        ${ie(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"ac-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${c((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function wr(t,e,a){const o=()=>{const s=t.querySelector("#ac-aport-container");s&&(s.innerHTML=Sr(e))};J(t,"#ac-modelo",s=>{const n=s.value,i=(r,l)=>{const p=t.querySelector(r);p&&(p.style.display=l?"":"none")};i("#ac-inversion-hint",n==="inversion"),i("#ac-beneficio-fields",n==="beneficio")}),N(t,"[data-aport-anadir]",()=>{var n,i,r,l;const s=parseFloat(((n=t.querySelector("#aport-importe"))==null?void 0:n.value)??"")||0;if(!s)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#aport-fin"))==null?void 0:l.value)||""}),o()}),N(t,"[data-aport-borrar]",s=>{e.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function Cr(t,e,a,o,s){const n=x=>{var I;return((I=t.querySelector(x))==null?void 0:I.value)??""},i=(x,I=0)=>{const A=parseFloat(n(x));return Number.isFinite(A)?A:I},r=x=>{var I;return!!((I=t.querySelector(x))!=null&&I.checked)},l=n("#ac-nombre").trim();if(!l)return{datos:{},error:"Nombre obligatorio"};const p=n("#ac-modelo")||"cuenta",h=p==="beneficio",u=i("#ac-saldo"),d={nombre:l,saldo:u,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:n("#ac-fecha-ini")||s,interes:i("#ac-interes"),periodoCobro:n("#ac-periodo")||"mensual",descripcion:n("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(x=>x.value),modeloFondo:p,planAportaciones:e,tipoBeneficio:h?n("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:h?n("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&u<=0)return{datos:d};if(!(o===null||Math.abs(u-o)>.005))return{datos:d};if(p==="inversion"&&u>(o??0)){const x=Date.now().toString(36);d.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${x}a`,fecha:a?s:d.fechaInicialSaldo??s,cantidad:u-(o??0)}]}return{datos:d,punto:{fecha:s,saldo:u,nota:a?"Actualización manual":"Saldo inicial"}}}function sa(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:et(e.saldoCts),nota:e.nota}))}function jr(t,e,a,o,s){const n=a.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
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
    </div>`}const To=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function Er(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??jt;function r(d,v){const x=o(),I=s();return!x||!I?null:(I.innerHTML=`<div class="modal-title">${c(d)}</div>${v}`,x.classList.remove("hidden"),N(I,"[data-cerrar]",n),I)}function l(){e=null;const d=[...t.store.get("tramosGananciasCapitalHistorico")].sort((I,A)=>I.año-A.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",x=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${c(To(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${d.map(I=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${I.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(To(I.tramos))}</span>
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
      </div>`);x&&(N(x,"[data-editar-tg]",I=>{const A=I.getAttribute("data-editar-tg");u(A==="default"?"default":Number(A))}),N(x,"[data-borrar-tg]",I=>{const A=Number(I.getAttribute("data-borrar-tg"));Z(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(g=>g.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),N(x,"[data-anadir-anyo-tg]",()=>{var g;const I=parseInt(((g=x.querySelector("#tg-new-year"))==null?void 0:g.value)??"",10);if(!I||I<2e3||I>2100)return q("Año inválido","err");const A=t.store.get("tramosGananciasCapitalHistorico");if(A.some(b=>b.año===I))return q("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...A,{_id:Date.now().toString(36),año:I,tramos:i().map(b=>[...b])}]),t.onDatosCambiados(),u(I)}))}function p(){return a.map(([d,v],x)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${x}" value="${d}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${x}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${x}">✕</button>
          </div>
        </div>`).join("")}function h(d){a=[...d.querySelectorAll("[data-tg-min]")].map((v,x)=>{const I=d.querySelector(`[data-tg-pct="${x}"]`);return[parseFloat(v.value)||0,parseFloat((I==null?void 0:I.value)??"")||0]})}function u(d){var g;e=d;const v=t.store.get("tramosGananciasCapitalHistorico");a=(d==="default"?i():((g=v.find(b=>b.año===d))==null?void 0:g.tramos)??i()).map(b=>[...b]);const I=r(`Ganancias de capital — ${d==="default"?"Por defecto":d}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${p()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!I)return;const A=()=>{const b=I.querySelector("#tg-rows");b&&(b.innerHTML=p())};N(I,"[data-volver-tg]",l),N(I,"[data-tg-anadir]",()=>{h(I),a.push([0,0]),A()}),N(I,"[data-tg-borrar]",b=>{h(I),a.splice(Number(b.getAttribute("data-tg-borrar")),1),A()}),N(I,"[data-tg-guardar]",()=>{h(I);const b=[...a].sort((f,$)=>f[0]-$[0]);if(b.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:b}),q("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(f=>f.año===e?{...f,tramos:b}:f)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}function zr(t){function e(){if(t.navegar)return t.navegar("planner");const n=globalThis.Router;n==null||n.navigate("planner")}function a(n,i,r){const l=xa(n,i,r),p=n.targetAmount||0,h=p>0?Math.min(100,l/p*100):0;return`
      <div style="padding:8px 0;border-bottom:1px solid var(--hairline-soft)">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:500">${c(n.nombre)}</span>
          <span class="num" style="font-size:11px;color:var(--text3)">
            ${c(j(l))} / ${c(j(p))}
          </span>
        </div>
        <div class="goal-bar"><div class="goal-bar-fill" style="width:${h}%;background:${c(n.color||"var(--accent)")}"></div></div>
      </div>`}function o(n){const i=t.store.get("goals");if(i.length===0){n.innerHTML="",n.style.display="none";return}n.style.display="";const r=t.store.get("accounts"),l=t.colchonEnFecha(t.hoy()),p=[...i].sort((h,u)=>(h.prioridad||99)-(u.prioridad||99));n.innerHTML=`
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
      </div>`}function s(n,i){N(n,"[data-ir-planner]",()=>e()),N(n,"[data-descartar-goals]",()=>{const r=t.store.get("goals").length;if(Z(`Se van a borrar ${r} objetivo${r!==1?"s":""} de ahorro antiguos. ¿Seguro?`)){for(const l of[...t.store.get("goals")])t.store.removeItem("goals",l._id);q("Objetivos antiguos descartados"),t.onDatosCambiados(),i()}})}return{render:o,wire:s}}const _r="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Fr=120;function Pr(t){const e=t.hoy??Y,a=()=>{var C;return(C=t.onDatosCambiados)==null?void 0:C.call(t)},o=t.mostrarObjetivos??(()=>!0),s=new Map,n=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),r=C=>{var M;return((M=i().find(z=>z._id===C))==null?void 0:M.nombre)??C},l=C=>{var M;return((M=t.store.get("accounts").find(z=>z._id===C))==null?void 0:M.nombre)??C},p=()=>bt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??gt)(Number(e().slice(0,4))),h=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??jt),u=()=>h()(Number(e().slice(0,4))),d=C=>Ba(t.store.get("expenses"),n(),t.store.get("loans"),C);function v(){const C=n(),M=t.store.get("accounts"),z=Qt({loans:[],expenses:t.store.get("expenses").filter(B=>B.tipo==="transferencia"),accounts:M,config:{dashboardStart:C.dashboardStart,dashboardEnd:C.dashboardEnd,fechaReferencia:C.dashboardStart},nominas:[],resolverTramosGanancias:h()}),F=new Map,T=B=>{let L=F.get(B);return L||(L={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},F.set(B,L)),L},R=(B,L)=>{const k=`${L.sourceId}`,O=B.find(U=>U.concepto===k),H=O??{concepto:k,contraparte:"",total:0,ocurrencias:0};H.total+=Math.abs(L.cuantia),H.ocurrencias+=1,O||B.push(H)};for(const B of z){if(!B.cuenta)continue;const L=T(B.cuenta);B.sourceType==="transfer-in"||B.sourceType==="traspaso-in"?(L.totalAportaciones+=Math.abs(B.cuantia),R(L.entradas,B)):B.sourceType==="transfer-out"||B.sourceType==="traspaso-out"?(L.totalReembolsos+=Math.abs(B.cuantia),R(L.salidas,B)):B.sourceType==="investment-tax"&&(L.retencion+=Math.abs(B.cuantia))}const P=t.store.get("expenses");for(const B of F.values())for(const[L,k]of[[B.entradas,"cuenta"],[B.salidas,"cuentaDestino"]])for(const O of L){const H=P.find(U=>U._id===O.concepto);O.contraparte=l((H==null?void 0:H[k])??"default"),O.concepto=(H==null?void 0:H.concepto)||(k==="cuenta"?"Aportación":"Reembolso")}return F}function x(){const C=new Map,M=n(),z=e(),F=new Date(Number(z.slice(0,4)),Number(z.slice(5,7))-1+Fr+1,0),T=`${F.getFullYear()}-${String(F.getMonth()+1).padStart(2,"0")}-${String(F.getDate()).padStart(2,"0")}`;return R=>{const P=C.get(R._id);if(P)return P;const B=Qt({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...M,dashboardStart:z,dashboardEnd:T,fechaReferencia:z},filtroAccounts:[R._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),M.tramos_irpf??gt),resolverTramosGanancias:h()}).map(L=>({fecha:L.fecha,saldoAcum:L.saldoAcum}));return C.set(R._id,B),B}}const I=zr({store:t.store,colchonEnFecha:d,extractoCuenta:C=>A(C),hoy:e,onDatosCambiados:a});let A=x();function g(C){A=x();const z=t.store.get("accounts").filter(P=>mt(P)!=="pension"),F=v(),T={config:n(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:p(),tramosGanancias:u(),nombreEscenario:r,flujos:P=>F.get(P)??gr,invModo:P=>s.get(P)??"proyeccion"};C.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${br(z,T.tramosGanancias)}
      <div class="grid-3">${z.map(P=>Ir(P,T)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const R=C.querySelector("#goals-section");R&&I.render(R)}const b=()=>document.getElementById("modal-overlay"),f=()=>document.getElementById("modal-content"),$=()=>{var C;return(C=b())==null?void 0:C.classList.add("hidden")};function m(C,M){const z=b(),F=f();return!z||!F?null:(F.innerHTML=C?`<div class="modal-title">${c(C)}</div>${M}`:M,z.classList.remove("hidden"),N(F,"[data-cancelar]",$),F)}function y(C,M){const z=C?t.store.get("accounts").find(P=>P._id===C)??null:null,F=[...(z==null?void 0:z.planAportaciones)??[]].map(P=>({...P})),T=z?S(z):null,R=m(C?"Editar cuenta / fondo":"Nueva cuenta / fondo",Mr(z,{escenarios:i(),nominas:t.store.get("nominas"),hoy:e(),saldoActual:T??0}));R&&(wr(R,F,e()),N(R,"[data-guardar-acc]",P=>{const B=P.getAttribute("data-guardar-acc")||"",{datos:L,punto:k,error:O}=Cr(R,F,z,T,e());if(O)return q(O,"err");let H=B;B?t.store.updateItem("accounts",B,L):H=t.store.addItem("accounts",L)._id,k&&t.ledger.registrarPuntoControl(H,k.fecha,k.saldo,k.nota),q(B?"Actualizada":"Cuenta / fondo creado"),a(),$(),M()}))}function S(C){const M=t.ledger.puntosControl(C._id);return M.length>0?sa(M)[0].saldo:C.saldo??null}function w(C,M){const z=t.store.get("accounts").find(R=>R._id===C);if(!z)return;const F=m("Histórico de saldos",jr(z.nombre,C,sa(t.ledger.puntosControl(C)),z.saldoInicial||0,e()));if(!F)return;const T=()=>{M(),w(C,M)};N(F,"[data-hist-anadir]",()=>{var L,k,O;const R=((L=F.querySelector("#hi-fecha"))==null?void 0:L.value)??"",P=parseFloat(((k=F.querySelector("#hi-saldo"))==null?void 0:k.value)??""),B=((O=F.querySelector("#hi-nota"))==null?void 0:O.value.trim())??"";if(!R||!Number.isFinite(P))return q("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(C,R,P,B||void 0),q("Punto añadido"),a(),T()}),N(F,"[data-hist-borrar]",R=>{const[,P]=(R.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(P),q("Eliminado"),a(),T()}),N(F,"[data-hist-inicial]",R=>{const[P,B]=(R.getAttribute("data-hist-inicial")||"").split("|"),L=t.ledger.puntosControl(P).find(O=>O._id===B);if(!L)return;const k=sa([L])[0].saldo;t.store.updateItem("accounts",P,{saldoInicial:k,fechaInicialSaldo:L.fecha}),q(`Punto inicial → ${L.fecha} (${j(k)})`),a(),T()})}function E(C){const M=t.store.get("accounts").filter(T=>T.activo);if(M.length===0)return q("No hay cuentas activas","err");const z=e(),F=M.map(T=>`• ${T.nombre}: ${j(S(T)??T.saldoInicial??0)}`).join(`
`);if(Z(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${z})?

${F}

Esto recalibra el punto de arranque del dashboard.`)){for(const T of M)t.store.updateItem("accounts",T._id,{saldoInicial:S(T)??T.saldoInicial??0,fechaInicialSaldo:z});q("Saldo base actualizado"),a(),C()}}function _(C,M,z){N(C,"[data-nueva-acc]",()=>y(null,M)),N(C,"[data-editar-acc]",F=>y(F.getAttribute("data-editar-acc"),M)),N(C,"[data-tramos-ganancias]",()=>z.abrir()),N(C,"[data-reset-base]",()=>E(M)),N(C,"[data-hist-acc]",F=>w(F.getAttribute("data-hist-acc"),M)),N(C,"[data-principal-acc]",F=>{const T=F.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(R=>({...R,esCuentaPrincipal:R._id===T}))),q("Cuenta marcada como principal"),a(),M()}),N(C,"[data-borrar-acc]",F=>{const T=F.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return q("Debe existir al menos una cuenta","err");if(!Z("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",T);const P=t.store.get("accounts");P.length>0&&!P.some(B=>B.esCuentaPrincipal)&&t.store.set("accounts",P.map((B,L)=>L===0?{...B,esCuentaPrincipal:!0}:B)),q("Cuenta eliminada"),a(),M()}),N(C,"[data-inv-modo]",F=>{const[T,R]=(F.getAttribute("data-inv-modo")||"").split("|");s.set(T,R==="real"?"real":"proyeccion"),M()}),I.wire(C,M)}let D=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:_r,mount(C){const M=()=>g(C);D??(D=Er({store:t.store,onDatosCambiados:()=>{a(),M()},año:()=>Number(e().slice(0,4))})),g(C),C.dataset.wired!=="1"&&(_(C,M,D),C.dataset.wired="1")}}}const ot=(t,e,a="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${a};font-size:12px;padding:5px 10px">${c(j(e))}</td>
  </tr>`,na=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${c(t)}</td></tr>`;function No(t){const a=t.capMobiliario!==0||t.gananciasFondos!==0?`${ot("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
       ${ot("Ganancias patrimoniales (fondos/acciones)",t.gananciasFondos,t.gananciasFondos>=0?"var(--text)":"var(--green)",!0)}`:'<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>',o=t.resultado>0?"var(--red)":"var(--green)",s=t.resultado>0?"🔴 A PAGAR":"🟢 A DEVOLVER";return`
    <table style="width:100%;border-collapse:collapse">
      ${na("RENDIMIENTOS DEL TRABAJO")}
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

      ${na("BASE DEL AHORRO")}
      ${a}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(j(t.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(j(t.cuotaAho))}</td>
      </tr>

      ${na("RESULTADO")}
      ${ot("Cuota íntegra total",t.cuotaIntegra,"var(--red)")}
      ${ot("− Retenciones en nómina",-t.retNomina,"var(--green)",!0)}
      ${t.retCapital!==0?ot("− Retenciones de capital mobiliario",-t.retCapital,"var(--green)",!0):""}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${s}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${o}">${c(j(Math.abs(t.resultado)))}</td>
      </tr>
    </table>`}const re=(t,e,a,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${c(e)}</label>
    <input type="number" id="${t}" class="form-input" value="${c(a)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${c(o)}</div>`:""}
  </div>`;function Dr(t){const e=t.extras,a=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
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
          ${re("rex-inmobiliario","Capital inmobiliario neto (alquileres − gastos)",e.capInmobiliario??0)}
          ${re("rex-mobiliario","Capital mobiliario (dividendos, intereses)",e.capMobiliario??0)}
          ${re("rex-ganancias","Ganancias / pérdidas patrimoniales (fondos, acciones)",e.gananciasFondos??0,"Positivo = ganancia · Negativo = pérdida compensable")}
          ${re("rex-otras","Otras ganancias a corto plazo (menos de 1 año)",e.otrasCorto??0)}
          ${re("rex-ret-cap","Retenciones de capital ya aplicadas",e.retCapital??0,"Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen")}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${t.nominas.length>0?t.nominas.map(o=>`• ${c(o.nombre)}: ${c(j(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${c(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${No(t.declaracion)}</div>
      </div>
    </div>`}function Ro(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((a,o)=>a[0]-o[0]).map(([a,o],s,n)=>{const i=s<n.length-1?n[s+1][0]:null,r=i!==null?`${j(a)} – ${j(i)}`:`Más de ${j(a)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${c(r)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${c(o)}%</td>
      </tr>`}).join("")}
  </table>`}const Tr=(t,e,a)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${c(e)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${a}</div>
  </div>`,ct=(t,e,a="")=>`<div class="stat-card"><div class="stat-label">${c(t)}</div><div class="stat-value ${a}">${c(e)}</div></div>`,yt=(t,e,a="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${c(t)}</span><span class="num ${a}">${c(e)}</span></div>`;function Nr(t,e,a){const o=t.filter(l=>(l.modeloFondo||"cuenta")==="inversion");if(o.length===0)return Tr("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let s=0,n=0,i=0;const r=o.map(l=>{const p=Rt(l,e);if(!p)return"";s+=p.saldo,n+=p.costBase,i+=p.impuesto;const h=p.costBase>0?p.plusvalia/p.costBase*100:0,u=(l.escenarioIds||[]).map(d=>`<span class="badge badge-yellow">🔭 ${c(a(d))}</span>`).join("");return`
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
      ${Ro(e)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function Rr(t){const{nominas:e,planes:a,tramos:o}=t,s=v=>v.grupoNomina?e.filter(x=>(x.grupoNomina||"")===v.grupoNomina):null,n=e.map(v=>({n:v,d:Re(v,s(v),o)})),i=n.reduce((v,x)=>v+x.d.brutoAnual,0),r=n.reduce((v,x)=>v+x.d.irpfAnual,0),l=n.reduce((v,x)=>v+x.d.ssAnual,0),p=n.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':n.map(({n:v,d:x})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${c(v.nombre)}</div>
          ${yt("Bruto anual",j(x.brutoAnual))}
          ${x.flexAnual>0?yt("− Retribución flexible exenta",j(-x.flexAnual),"pos"):""}
          ${yt("− Cotización SS",j(-x.ssAnual),"neg")}
          ${yt(`− IRPF estimado (${x.irpfPct.toFixed(1)} %)`,j(-x.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${c(j(x.baseDineraria-x.ssAnual-x.irpfAnual))}</span>
          </div>
        </div>`).join(""),h=wa(e,o),u=`${t.hoy.slice(0,4)}-01-01`,d=a.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':a.map(v=>{const x=me(v);if(!x)return"";const I=(v.aportaciones||[]).filter(f=>f.fecha>=u).reduce((f,$)=>f+$.cantidad,0),g=Math.min(I,zt)*h/100,b=I>zt;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${c(v.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${yt("Valor actual",j(x.saldo))}
          ${yt("Coste base (total aportado)",j(x.costBase))}
          ${yt("Revalorización",j(x.beneficio),x.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(t.hoy.slice(0,4))}</div>
            ${yt("Aportado",`${j(I)}${b?" ⚠":""}`,b?"neg":"")}
            ${yt("Límite deducible",j(zt))}
            ${yt(`Ahorro IRPF est. (marginal ${h} %)`,j(g),"pos")}
            ${b?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${c(j(zt))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${x.proxDesbloqueo?`· Próx. desbloqueo: ${c(x.proxDesbloqueo)}`:""}
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
      ${Ro(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const $e=(t,e)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${c(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${c(e)}</div>
  </div>`;function Or(){return`
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
        ${$e("Rendimientos íntegros","Alquileres, subarriendos y cesión de derechos sobre inmuebles")}
        ${$e("Gastos deducibles","IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación")}
        ${$e("Reducción del 60 %","Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)")}
        ${$e("Base general del IRPF","Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.")}
      </div>
    </div>`}const Oo=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],qr="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function Lr(t){const e=t.hoy??Y;let a="declaracion",o={};const s=()=>t.store.get("config"),n=()=>Number(e().slice(0,4)),i=()=>t.store.get("nominas").filter(b=>b.activo),r=()=>t.store.get("accounts").filter(b=>(b.modeloFondo||"cuenta")==="pension"),l=b=>{var f;return((f=t.store.get("escenarios").find($=>$._id===b))==null?void 0:f.nombre)??b},p=()=>bt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??gt)(n()),h=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??jt)(n());function u(){const b=`${n()}-01-01`,f=t.store.get("nominas").filter(y=>y.activo&&!y.simulacion),$=r().reduce((y,S)=>y+(S.aportaciones||[]).filter(w=>w.fecha>=b).reduce((w,E)=>w+E.cantidad,0),0),m=t.store.get("expenses").filter(y=>y.activo&&y.sujetoIRPF&&y.tipo==="ingreso").reduce((y,S)=>y+Ca(S),0);return Ea({nominas:f,aportacionesPension:$,otrosIngresos:m,extras:o,tramosGeneral:p(),tramosAhorro:h()})}function d(){const b=p(),f=i(),$=M=>M.grupoNomina?f.filter(z=>(z.grupoNomina||"")===M.grupoNomina):null,m=f.map(M=>Re(M,$(M),b)),y=m.reduce((M,z)=>M+z.brutoAnual,0),S=m.reduce((M,z)=>M+z.irpfAnual,0),w=m.reduce((M,z)=>M+z.ssAnual,0),E=t.store.get("accounts").filter(M=>(M.modeloFondo||"cuenta")==="inversion");let _=0,D=0;for(const M of E){const z=Rt(M,h());z&&(_+=z.plusvalia,D+=z.impuesto)}if(y<=0&&E.length===0)return"";const C=(M,z,F)=>`<div class="exec-item"><div class="exec-item-label">${c(M)}</div><div class="exec-item-val ${F}">${c(z)}</div></div>`;return`<div class="exec-summary mb-14">
      ${y>0?C("IRPF trabajo",`${j(S)}/año`,"neg"):""}
      ${y>0?C("Neto trabajo",`${j(y-w-S)}/año`,"pos"):""}
      ${E.length>0?C("Plusvalía latente",j(_),_>=0?"pos":"neg"):""}
      ${E.length>0?C("Imp. potencial (inversión)",j(D),"neg"):""}
    </div>`}function v(){return a==="mobiliario"?Nr(t.store.get("accounts"),h(),l):a==="trabajo"?Rr({nominas:i(),planes:r(),tramos:p(),hoy:e()}):a==="inmobiliario"?Or():Dr({año:n(),extras:o,declaracion:u(),nominas:i().map(b=>({nombre:b.nombre,bruto:b.bruto||0})),planes:r().map(b=>b.nombre)})}function x(b,f){const $=a===b;return`<button data-tab-fisc="${b}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${$?"600":"400"};
      color:${$?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${$?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${c(f)}</button>`}function I(b){const f=b.querySelector("#fisc-tabs"),$=b.querySelector("#fisc-tab-content");f&&(f.innerHTML=Oo.map(([m,y])=>x(m,y)).join("")),$&&($.innerHTML=v())}function A(b){b.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${d()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${Oo.map(([f,$])=>x(f,$)).join("")}
      </div>
      <div id="fisc-tab-content">${v()}</div>`}function g(b){N(b,"[data-tab-fisc]",f=>{a=f.getAttribute("data-tab-fisc")||"declaracion",I(b)}),b.addEventListener("input",f=>{var S;if(!((S=f.target)==null?void 0:S.closest("[data-rex]")))return;const m=w=>{var E;return((E=b.querySelector(`#${w}`))==null?void 0:E.value)??"0"};o={capInmobiliario:parseFloat(m("rex-inmobiliario"))||0,capMobiliario:parseFloat(m("rex-mobiliario"))||0,gananciasFondos:parseFloat(m("rex-ganancias"))||0,otrasCorto:parseFloat(m("rex-otras"))||0,retCapital:parseFloat(m("rex-ret-cap"))||0};const y=b.querySelector("#renta-cuadro");y&&(y.innerHTML=No(u()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:qr,mount(b){A(b),b.dataset.wired!=="1"&&(g(b),b.dataset.wired="1")}}}const qo=()=>globalThis.Chart??null;function Br(t,e){const a=qo();if(!a)return null;const o=e.map(s=>({label:s.label,data:s.puntos.map(n=>({x:n.x,y:n.y})),borderColor:s.esBase?"#6b7280":s.color,backgroundColor:s.esBase?"transparent":`${s.color}18`,borderWidth:s.esBase?1.5:2,...s.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new a(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:s=>`${s.dataset.label}: ${j(s.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:s=>j(s)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const kr=()=>qo()!==null,Dt=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Hr="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function Gr(t){const e=()=>{var y;return(y=t.onDatosCambiados)==null?void 0:y.call(t)},a=new Set;let o=null;const s=()=>t.store.get("config"),n=()=>t.store.get("escenarios"),i=y=>{var S;return y?((S=n().find(w=>w._id===y))==null?void 0:S.nombre)??y:"Base"};function r(y){const S=s(),w=Ia({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(y==null?void 0:y._id)??null),E=a.size>0?w.accounts.filter(M=>!a.has(M._id)):w.accounts,_=a.size>0?E.map(M=>M._id):null,D=y!=null&&y.fechaFin&&y.fechaFin>S.dashboardEnd?y.fechaFin:S.dashboardEnd;return{eventos:Qt({loans:w.loans,expenses:w.expenses,accounts:E,config:{...S,dashboardEnd:D},filtroAccounts:_,nominas:w.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),S.tramos_irpf??gt),resolverTramosGanancias:bt(t.store.get("tramosGananciasCapitalHistorico"),S.tramosGananciasCapital??jt)}),horizonte:D}}function l(y){const S=t.store.get("loans"),w=C=>(C.escenarioIds||[]).includes(y),E=[[S.filter(w).length,"préstamo","préstamos"],[S.flatMap(C=>C.amortizaciones||[]).filter(w).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(w).length,"gasto","gastos"],[t.store.get("accounts").filter(w).length,"cuenta","cuentas"],[t.store.get("nominas").filter(w).length,"nómina","nóminas"]],_=E.reduce((C,[M])=>C+M,0),D=E.filter(([C])=>C>0).map(([C,M,z])=>`${C} ${C===1?M:z}`).join(" · ");return{total:_,texto:D}}function p(y,S){const w=S===y._id,E=y.color||Dt[0],{total:_,texto:D}=l(y._id);return`<div class="card mb-12" style="border-left:3px solid ${c(E)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${c(E)};flex-shrink:0"></div>
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
        ${_===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${c(D)}</span>`}
      </div>
    </div>`}function h(y){const S=s().dashboardEnd,w=_e(r(null).eventos,S);return`
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
        <tbody>${y.map(_=>{const{eventos:D}=r(_),C=_.fechaFin||S,M=_e(D,C),z=M!==null&&w!==null?M-w:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c(_.color||Dt[0])};margin-right:6px"></span>
            ${c(_.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${c(C)}</td>
          <td class="num" style="padding:6px 10px">${M!==null?c(j(M)):"—"}</td>
          <td class="num ${z===null?"":z>=0?"pos":"neg"}" style="padding:6px 10px">
            ${z===null?"—":`${z>=0?"+":""}${c(j(z))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function u(){const y=t.store.get("accounts");return y.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${y.map(w=>{const E=a.has(w._id);return`<button data-toggle-cuenta="${c(w._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${E?"var(--border)":"var(--accent)"};
          background:${E?"transparent":"rgba(99,102,241,0.1)"};
          color:${E?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${E?"text-decoration:line-through;":""}">${c(w.nombre)}</button>`}).join("")}
    </div>`}function d(){if(o){try{o.destroy()}catch{}o=null}}function v(y){const S=s(),w=r(null),E=[{label:"Base (sin supuesto)",color:"#6b7280",esBase:!0,puntos:ze(w.eventos,S.dashboardStart,S.dashboardEnd)}];return y.forEach((_,D)=>{const{eventos:C,horizonte:M}=r(_);E.push({label:_.nombre,color:_.color||Dt[D%Dt.length],puntos:ze(C,S.dashboardStart,M)})}),E}function x(y,S){d();const w=y.querySelector("#chart-comparacion");w&&(o=Br(w,v(S)))}function I(y){d();const S=new Set(t.store.get("accounts").map(_=>_._id));for(const _ of[...a])S.has(_)||a.delete(_);const w=n(),E=s().escenarioActivo||null;y.innerHTML=`
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
             </div>`:`<div>${w.map(_=>p(_,E)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de supuestos</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${u()}</div>
               ${kr()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${h(w)}</div>`}`,w.length>0&&x(y,w)}const A=()=>document.getElementById("modal-overlay"),g=()=>document.getElementById("modal-content"),b=()=>{var y;return(y=A())==null?void 0:y.classList.add("hidden")};function f(y,S){const w=y?n().find(C=>C._id===y)??null:null,E=A(),_=g();if(!E||!_)return;const D=(w==null?void 0:w.color)||Dt[0];_.innerHTML=`
      <div class="modal-title">${y?"Editar supuesto":"Nuevo supuesto"}</div>
      <div class="form-group"><label class="form-label">Nombre del supuesto</label>
        <input class="form-input" type="text" id="esc-nombre" value="${c((w==null?void 0:w.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${c((w==null?void 0:w.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${Dt.map(C=>`<div data-color-esc="${C}" style="width:26px;height:26px;border-radius:50%;background:${C};cursor:pointer;
              border:2px solid ${C===D?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${c(D)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${c((w==null?void 0:w.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${c(y??"")}">${y?"Guardar cambios":"Crear escenario"}</button>
      </div>`,E.classList.remove("hidden"),N(_,"[data-cancelar]",b),N(_,"[data-color-esc]",C=>{const M=C.getAttribute("data-color-esc");_.querySelector("#esc-color").value=M;for(const z of _.querySelectorAll("[data-color-esc]"))z.style.border=z.getAttribute("data-color-esc")===M?"2px solid white":"2px solid transparent"}),N(_,"[data-guardar-esc]",C=>{const M=_.querySelector("#esc-nombre").value.trim();if(!M)return q("El nombre es obligatorio","err");const z={nombre:M,fechaFin:_.querySelector("#esc-fecha-fin").value||null,color:_.querySelector("#esc-color").value||Dt[0],descripcion:_.querySelector("#esc-desc").value.trim()},F=C.getAttribute("data-guardar-esc")||"";F?(t.store.updateItem("escenarios",F,z),q("Escenario actualizado")):(t.store.addItem("escenarios",z),q("Escenario creado")),e(),b(),S()})}function $(y,S){if(!Z("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const w=E=>E.map(_=>({..._,escenarioIds:(_.escenarioIds||[]).filter(D=>D!==y)}));t.store.set("loans",w(t.store.get("loans")).map(E=>({...E,amortizaciones:w(E.amortizaciones||[])}))),t.store.set("expenses",w(t.store.get("expenses"))),t.store.set("nominas",w(t.store.get("nominas"))),t.store.set("accounts",w(t.store.get("accounts"))),s().escenarioActivo===y&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",y),q("Escenario eliminado"),e(),S()}function m(y,S){N(y,"[data-nuevo-esc]",()=>f(null,S)),N(y,"[data-editar-esc]",w=>f(w.getAttribute("data-editar-esc"),S)),N(y,"[data-borrar-esc]",w=>$(w.getAttribute("data-borrar-esc"),S)),N(y,"[data-activar-esc]",w=>{const E=w.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:E}),q(`Escenario "${i(E)}" activado`),e(),S()}),N(y,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),q("Volviendo a la realidad base"),e(),S()}),N(y,"[data-toggle-cuenta]",w=>{const E=w.getAttribute("data-toggle-cuenta");a.has(E)?a.delete(E):a.add(E);const _=y.querySelector("#esc-pastillas");_&&(_.innerHTML=u());const D=n(),C=y.querySelector("#esc-comparativa");C&&(C.innerHTML=h(D)),x(y,D)})}return{id:"escenarios",route:"escenarios",nombre:"Supuestos",flagId:"supuestos",seccion:2,iconoPath:Hr,mount(y){const S=()=>I(y);I(y),y.dataset.wired!=="1"&&(m(y,S),y.dataset.wired="1")},unmount(){d()}}}const Vr=1e-12,Lo=t=>Math.abs(t)<Vr,Bo=t=>t/12;function Ur(t,e,a,o){if(a<=0)return Math.max(0,Math.ceil(t-e));const s=t-e;if(s<=0)return 0;const n=Bo(o);if(Lo(n))return Math.ceil(s/a);const i=Math.pow(1+n,a),r=(t-e*i)*n/(i-1);return r<=0?0:Math.ceil(r)}function Yr(t,e){const a=Bo(e);return Lo(a)?0:Math.round(t*a)}function ko({rentaNetaMensual:t,tasaRetiroSeguro:e,tipoFiscalEfectivo:a}){if(e<=0)throw new RangeError("La tasa de retiro seguro tiene que ser mayor que cero.");if(a>=1)throw new RangeError("El tipo fiscal efectivo no puede llegar al 100 %.");const o=Math.round(t*12/(1-a));return{retiroBrutoAnual:o,capitalNecesario:Math.round(o/e)}}function Ho(t,e){const[a,o]=t.split("-").map(Number),s=a*12+(o-1)+e,n=Math.floor(s/12),i=s%12+1;return`${n}-${String(i).padStart(2,"0")}`}function ia(t,e){const[a,o]=t.split("-").map(Number),[s,n]=e.split("-").map(Number);return(s-a)*12+(n-o)}const Go=t=>Number(t.slice(0,4));function Ie(t){return t.rentaDeseada?ko(t.rentaDeseada).capitalNecesario:t.importeObjetivo??0}const Jr={_id:"__sin_vehiculo__"};function Ae(t){var b,f,$;const e=Math.max(0,Math.floor(t.horizonteMeses)),a=new Map(t.vehiculos.map(m=>[m._id,m])),o=[...t.objetivos].sort((m,y)=>m.prioridad-y.prioridad).map(m=>({def:m,objetivo:Ie(m),saldo:m.saldoActual,estado:Ie(m)>0&&m.saldoActual>=Ie(m)&&m.modoAsignacion!=="ABSORBE_RESIDUAL"?"COMPLETADO":"PENDIENTE",vehiculo:a.get(m.vehiculoId),aportadoEnAño:0,añoEnCurso:Go(t.fechaInicio),ultimaSolicitud:0,solicitadoAcumulado:0,mesesReclamando:0})),s=new Map;for(const m of t.eventos){const y=s.get(m.fecha)??[];y.push(m),s.set(m.fecha,y)}const n=[],i=[],r=[];let l=t.perfil.netoMensual,p=t.perfil.gastosFijosMensuales,h=0,u=0;const d=[];for(let m=0;m<e;m++){const y=Ho(t.fechaInicio,m),S=Go(y);for(const P of s.get(y)??[])if(P.tipo==="CAMBIO_INGRESOS")l=P.importe;else if(P.tipo==="CAMBIO_GASTOS_FIJOS")p=P.importe;else if(P.tipo==="NUEVA_DEUDA")p+=P.importe;else if(P.tipo==="INYECCION_CAPITAL"){const B=P.objetivoDestinoId?o.find(L=>L.def._id===P.objetivoDestinoId):void 0;B?B.saldo+=P.importe:l+=P.importe}for(const P of o)P.añoEnCurso!==S&&(P.añoEnCurso=S,P.aportadoEnAño=0);const w=Math.max(0,l-p),E=Math.round(w*Wr(t.pctDisfrute));let _=w-E;const D=_,C=o.filter(P=>P.estado!=="COMPLETADO"),M=[];let z=0;const F=C.filter(P=>P.def.modoAsignacion==="ABSORBE_RESIDUAL"),T=C.filter(P=>P.def.modoAsignacion!=="ABSORBE_RESIDUAL");for(const P of T){const B=Kr(P,y,m,t);P.ultimaSolicitud=B,B>0&&(P.solicitadoAcumulado+=B,P.mesesReclamando+=1),(P.def.modoAsignacion==="CUOTA_POR_FECHA"||P.def.modoAsignacion==="FIJO")&&(z+=B);const L=Math.max(0,Math.min(B,_));_-=L,P.saldo+=L,P.aportadoEnAño+=L,h+=L,L>0&&P.estado==="PENDIENTE"&&(P.estado="EN_CURSO"),M.push({objetivoId:P.def._id,asignado:L,solicitado:B,saldoTrasMes:P.saldo})}if(F.length>0&&_>0){const P=F.map(k=>Math.max(0,k.def.pesoResidual??1)),B=P.reduce((k,O)=>k+O,0)||F.length;let L=0;F.forEach((k,O)=>{const H=O===F.length-1?_-L:Math.floor(_*P[O]/B);L+=H,k.saldo+=H,k.aportadoEnAño+=H,h+=H,H>0&&k.estado==="PENDIENTE"&&(k.estado="EN_CURSO"),M.push({objetivoId:k.def._id,asignado:H,solicitado:0,saldoTrasMes:k.saldo})}),_-=L}else for(const P of F)M.push({objetivoId:P.def._id,asignado:0,solicitado:0,saldoTrasMes:P.saldo});z>D&&d.push({mes:y,deficit:z-D});for(const P of o)P.saldo<=0||(P.saldo+=Yr(P.saldo,((b=P.vehiculo)==null?void 0:b.rentabilidadRealAnual)??0));for(const P of o)P.estado!=="COMPLETADO"&&(P.def.modoAsignacion==="ABSORBE_RESIDUAL"&&P.objetivo<=0||P.objetivo>0&&P.saldo>=P.objetivo&&(P.estado="COMPLETADO",i.push({objetivoId:P.def._id,nombre:P.def.nombre,mes:y,indice:m,importeFinal:P.saldo,cuotaLiberada:P.ultimaSolicitud})));for(const P of o)M.some(B=>B.objetivoId===P.def._id)||M.push({objetivoId:P.def._id,asignado:0,solicitado:0,saldoTrasMes:P.saldo});const R=o.reduce((P,B)=>P+B.saldo,0);if(u+=E,n.push({indice:m,mes:y,netoMensual:l,gastosFijos:p,sobrante:w,disfrute:E,disponible:D,sinAsignar:_,asignaciones:M.sort((P,B)=>Vo(o,P.objetivoId)-Vo(o,B.objetivoId)),patrimonioTotal:R}),o.length>0&&o.every(P=>P.estado==="COMPLETADO"))break}const v=[];if(d.length>0){const m=Math.round(d.reduce((y,S)=>y+S.deficit,0)/d.length);r.push({severidad:"error",codigo:"INVIABLE",mensaje:`El plan no cabe en el flujo de caja durante ${d.length} mes${d.length!==1?"es":""} (desde ${d[0].mes}). Déficit medio: ${(m/100).toFixed(2)} €/mes.`,mes:d[0].mes,deficitMensual:m});for(const y of o)y.estado!=="COMPLETADO"&&y.def.fechaLimite&&y.def.modoAsignacion==="CUOTA_POR_FECHA"&&(y.estado="INVIABLE");v.push(...Xr(o,t,m))}for(const m of o){const y=(f=m.vehiculo)==null?void 0:f.topeAportacionAnual;y&&m.def.modoAsignacion==="FIJO"&&(m.def.importeFijoMensual??0)*12>y&&r.push({severidad:"atencion",codigo:"TOPE_FISCAL",objetivoId:m.def._id,mensaje:`«${m.def.nombre}» pide ${((m.def.importeFijoMensual??0)/100).toFixed(2)} €/mes, que supera el tope anual de ${(y/100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`})}for(const m of o)m.estado!=="COMPLETADO"&&m.objetivo>0&&m.def.modoAsignacion!=="ABSORBE_RESIDUAL"&&r.push({severidad:"atencion",codigo:"NUNCA_COMPLETADO",objetivoId:m.def._id,mensaje:`«${m.def.nombre}» no se completa dentro del horizonte de ${e} meses.`});const x=o.find(m=>m.def.tipo==="INVERSION_PERPETUA"),I=x?i.find(m=>m.objetivoId===x.def._id):void 0,A={};for(const m of o){const y=(($=m.vehiculo)==null?void 0:$._id)??Jr._id;A[y]=(A[y]??0)+m.saldo}const g={};for(const m of o)g[m.def._id]=m.estado;return{viable:d.length===0,mesesSimulados:n.length,serieMensual:n,hitos:i,fases:Qr(n,i),avisos:r,propuestas:v,estadoFinal:g,resumen:{patrimonioFinal:o.reduce((m,y)=>m+y.saldo,0),patrimonioPorVehiculo:A,totalAportado:h,totalDisfrute:u,mesIndependencia:(I==null?void 0:I.mes)??null}}}const Wr=t=>Number.isFinite(t)?Math.min(1,Math.max(0,t)):0,Vo=(t,e)=>t.findIndex(a=>a.def._id===e);function Kr(t,e,a,o){var n,i;const s=Math.max(0,t.objetivo-t.saldo);switch(t.def.modoAsignacion){case"ABSORBE_TODO":return s;case"FIJO":{const r=t.def.importeFijoMensual??0,l=(n=t.vehiculo)==null?void 0:n.topeAportacionAnual;if(!l)return t.objetivo>0?Math.min(r,s):r;const p=Math.max(0,l-t.aportadoEnAño),h=Math.min(r,p);return t.objetivo>0?Math.min(h,s):h}case"CUOTA_POR_FECHA":{if(s<=0)return 0;const r=t.def.fechaLimite?ia(e,t.def.fechaLimite):o.horizonteMeses-a;return Ur(t.objetivo,t.saldo,Math.max(0,r),((i=t.vehiculo)==null?void 0:i.rentabilidadRealAnual)??0)}default:return 0}}function Qr(t,e){if(t.length===0)return[];const o=[0,...[...new Set(e.map(n=>n.indice))].sort((n,i)=>n-i).map(n=>n+1)].filter((n,i,r)=>r.indexOf(n)===i&&n<t.length),s=[];for(let n=0;n<o.length;n++){const i=o[n],r=(n+1<o.length?o[n+1]:t.length)-1;if(r<i)continue;const l=new Set;for(let p=i;p<=r;p++)for(const h of t[p].asignaciones)h.asignado>0&&l.add(h.objetivoId);s.push({desde:t[i].mes,hasta:t[r].mes,meses:r-i+1,objetivosActivos:[...l]})}return s}function Xr(t,e,a){const o=[],s=Math.max(0,e.perfil.netoMensual-e.perfil.gastosFijosMensuales);if(s>0&&e.pctDisfrute>0){const l=Math.ceil(Math.min(e.pctDisfrute,a/s)*100);if(l>0){const p=Math.round(e.pctDisfrute*100);o.push({clase:"REDUCIR_DISFRUTE",magnitud:l,mensaje:`Bajar el disfrute ${l} punto${l!==1?"s":""} (del ${p} % al ${Math.max(0,p-l)} %) libera ${(Math.min(a,s*e.pctDisfrute)/100).toFixed(0)} €/mes.`})}}const n=t.filter(l=>l.def.modoAsignacion==="CUOTA_POR_FECHA"&&l.def.fechaLimite&&l.estado!=="COMPLETADO"),i=l=>l.mesesReclamando>0?l.solicitadoAcumulado/l.mesesReclamando:0,r=[...n].sort((l,p)=>i(p)-i(l))[0];if(r){const l=Math.max(0,r.objetivo-r.saldo),p=i(r),h=Math.max(1,ia(e.fechaInicio,r.def.fechaLimite)),u=Math.max(1,p-a),d=Math.ceil(l/u),v=Math.max(1,d-h);o.push({clase:"RETRASAR_FECHA",objetivoId:r.def._id,magnitud:v,mensaje:`Retrasar «${r.def.nombre}» ${v} mes${v!==1?"es":""}, hasta ${Ho(r.def.fechaLimite,v)}, baja su cuota a lo que cabe en el flujo.`});const x=Math.min(Math.round(a*h),Math.max(0,r.objetivo-1));x>0&&o.push({clase:"REDUCIR_IMPORTE",objetivoId:r.def._id,magnitud:x,mensaje:`O reducir «${r.def.nombre}» en ${(x/100).toFixed(0)} €, de ${(r.objetivo/100).toFixed(0)} € a ${((r.objetivo-x)/100).toFixed(0)} €.`})}return n.length>1&&o.push({clase:"REORDENAR",magnitud:n.length,mensaje:`Hay ${n.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`}),o.length===0&&o.push({clase:"REDUCIR_IMPORTE",magnitud:a,mensaje:`Faltan ${(a/100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`}),o}const Zr=()=>globalThis.Chart??null,Se=["#2ee6a8","#4d9fff","#a855f7","#f97316","#eab308","#22d3ee","#fb7185","#34d399"],Uo=new WeakMap;function tl(t,e,a){const o=Zr();if(!o)return null;const s=Uo.get(t);if(s)try{s.destroy()}catch{}const n=new Map,i=new Map(e.objetivos.map(v=>[v._id,v.vehiculoId])),r=new Set(e.objetivos.map(v=>v.vehiculoId));for(const v of r)n.set(v,[]);for(const v of a.serieMensual){const x=new Map;for(const I of v.asignaciones){const A=i.get(I.objetivoId);A&&x.set(A,(x.get(A)??0)+I.saldoTrasMes)}for(const I of r)n.get(I).push((x.get(I)??0)/100)}const l=v=>{var x;return((x=e.vehiculos.find(I=>I._id===v))==null?void 0:x.nombre)??"Sin vehículo"},p=[...r],h=p.map((v,x)=>a.serieMensual.map((I,A)=>p.slice(0,x+1).reduce((g,b)=>g+(n.get(b)[A]??0),0))),u=p.map((v,x)=>({label:l(v),data:h[x],borderColor:Se[x%Se.length],backgroundColor:`${Se[x%Se.length]}33`,fill:x===0?"origin":"-1",borderWidth:1.5,pointRadius:0,tension:.25})),d=new o(t,{type:"line",data:{labels:a.serieMensual.map(v=>v.mes),datasets:u},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#a9b6cc",font:{size:11},boxWidth:12}},tooltip:{backgroundColor:"#111a28",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#a9b6cc",bodyColor:"#eef3fb",callbacks:{label:v=>{const x=v.datasetIndex>0?v.chart.data.datasets[v.datasetIndex-1].data[v.dataIndex]??0:0;return` ${v.dataset.label}: ${j(v.parsed.y-x)}`}}}},scales:{x:{ticks:{color:"#6b7b96",maxTicksLimit:12},grid:{display:!1}},y:{ticks:{color:"#6b7b96",callback:v=>j(v)},grid:{color:"rgba(255,255,255,0.07)"}}}}});return Uo.set(t,d),d}const ra=t=>j(t/100),el={CUOTA_POR_FECHA:"Cuota para llegar a la fecha",ABSORBE_TODO:"Se lleva todo lo disponible",ABSORBE_RESIDUAL:"Recibe lo que sobre",FIJO:"Importe fijo al mes"},al={CUOTA_POR_FECHA:"Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.",ABSORBE_RESIDUAL:"No reclama nada; recoge lo que quede tras servir a los de prioridad superior.",FIJO:"Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene."},Yo={COMPLETADO:"var(--accent)",EN_CURSO:"var(--text)",PENDIENTE:"var(--text3)",INVIABLE:"var(--red)"};function ol(t,e){if(t.objetivos.length===0)return`<div class="card" style="text-align:center;padding:34px 20px">
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
    ${a.map(n=>{var i;return sl(n,e,o,(i=s(n.vehiculoId))==null?void 0:i.nombre)}).join("")}`}function sl(t,e,a,o){const s=Ie(t),n=e.estadoFinal[t._id]??t.estado,i=a==null?void 0:a.asignaciones.find(u=>u.objetivoId===t._id),r=(i==null?void 0:i.solicitado)??0,l=e.hitos.find(u=>u.objetivoId===t._id),p=s>0?Math.min(100,t.saldoActual/s*100):0,h=e.avisos.filter(u=>u.objetivoId===t._id);return`
    <div class="card mb-10" draggable="true" data-pl-objetivo="${c(t._id)}"
         style="padding:14px 16px;border-left:3px solid ${Yo[n]??"var(--text3)"};cursor:grab">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span title="Arrastra para cambiar la prioridad" style="color:var(--text3);cursor:grab;user-select:none">⠿</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3)">#${c(t.prioridad)}</span>
            <span style="font-weight:700;font-size:14px">${c(t.nombre)}</span>
            <span class="badge" style="font-size:10px;background:var(--bg3);color:var(--text2)">${c(el[t.modoAsignacion])}</span>
            ${n==="INVIABLE"?'<span class="badge badge-red" style="font-size:10px">no llega</span>':""}
            ${n==="COMPLETADO"?'<span class="badge badge-green" style="font-size:10px">completado</span>':""}
          </div>
          <div class="text-sm" style="color:var(--text3);margin-top:4px">${c(al[t.modoAsignacion])}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:17px;font-weight:700">${c(s>0?ra(s):"— sin meta —")}</div>
          ${t.fechaLimite?`<div class="text-sm" style="color:var(--text3)">para ${c(t.fechaLimite)}</div>`:""}
          <button class="btn-secondary btn-sm" data-pl-editar-objetivo="${c(t._id)}" style="margin-top:6px;font-size:11px;padding:2px 9px">Editar</button>
        </div>
      </div>

      ${s>0?`<div class="goal-bar" style="margin-top:10px"><div class="goal-bar-fill" style="width:${p.toFixed(1)}%;background:${Yo[n]??"var(--accent)"}"></div></div>`:""}

      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:12px">
        <div><span style="color:var(--text3)">Pide ahora:</span> <strong style="font-family:var(--font-mono)">${c(ra(r))}</strong>/mes</div>
        <div><span style="color:var(--text3)">Ya acumulado:</span> <span style="font-family:var(--font-mono)">${c(ra(t.saldoActual))}</span></div>
        ${o?`<div><span style="color:var(--text3)">Vehículo:</span> ${c(o)}</div>`:""}
        ${l?`<div><span style="color:var(--text3)">Se completa:</span> <strong style="color:var(--accent)">${c(l.mes)}</strong></div>`:""}
      </div>

      ${h.length>0?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${h.map(u=>`⚠ ${c(u.mensaje)}`).join("<br>")}
             </div>`:""}
      ${t.notas?`<div class="text-sm" style="color:var(--text3);margin-top:8px;white-space:pre-wrap">${c(t.notas)}</div>`:""}
    </div>`}const dt=t=>(t/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}),Jo=[{id:"venta-vivienda",nombre:"Venta de vivienda",icono:"🏠",descripcion:"Lo que queda de verdad tras cancelar la hipoteca y pagar impuestos y gastos. Suele ser bastante menos que el precio de venta.",tipo:"INYECCION_CAPITAL",campos:[{id:"precio",etiqueta:"Precio de venta (€)",ayuda:"Lo que te paga el comprador"},{id:"hipoteca",etiqueta:"Hipoteca pendiente (€)",ayuda:"Capital vivo el día de la firma"},{id:"gastos",etiqueta:"Impuestos y gastos (€)",ayuda:"Plusvalía municipal, IRPF de la ganancia, agencia, notaría"}],calcular:t=>Math.max(0,(t.precio??0)-(t.hipoteca??0)-(t.gastos??0)),resumir:t=>`Venta ${dt(t.precio??0)} € − hipoteca ${dt(t.hipoteca??0)} € − gastos ${dt(t.gastos??0)} €`},{id:"nueva-hipoteca",nombre:"Nueva hipoteca",icono:"🔑",descripcion:"Sube tus gastos fijos con la cuota nueva. Normalmente va en la misma fecha que la venta.",tipo:"NUEVA_DEUDA",campos:[{id:"cuota",etiqueta:"Cuota mensual (€)",ayuda:"Se suma a tus gastos fijos a partir de ese mes"}],calcular:t=>t.cuota??0,resumir:t=>`Cuota de ${dt(t.cuota??0)} €/mes`},{id:"hijo",nombre:"Llegada de un hijo",icono:"👶",descripcion:"Fija tus gastos fijos en un valor nuevo. Si el gasto sube por etapas, crea varios eventos seguidos.",tipo:"CAMBIO_GASTOS_FIJOS",campos:[{id:"actuales",etiqueta:"Gastos fijos actuales (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"incremento",etiqueta:"Incremento mensual (€)",ayuda:"Guardería, ropa, sanidad…"}],calcular:t=>(t.actuales??0)+(t.incremento??0),resumir:t=>`Gastos fijos ${dt(t.actuales??0)} € → ${dt((t.actuales??0)+(t.incremento??0))} €/mes`},{id:"subida-sueldo",nombre:"Subida de sueldo",icono:"📈",descripcion:"Fija tu neto mensual en un valor nuevo desde ese mes.",tipo:"CAMBIO_INGRESOS",campos:[{id:"actual",etiqueta:"Neto mensual actual (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"subida",etiqueta:"Subida mensual neta (€)",ayuda:"Lo que te llega a la cuenta, no el bruto"}],calcular:t=>(t.actual??0)+(t.subida??0),resumir:t=>`Neto ${dt(t.actual??0)} € → ${dt((t.actual??0)+(t.subida??0))} €/mes`},{id:"inyeccion",nombre:"Entrada de dinero",icono:"💰",descripcion:"Una herencia, un bonus, la venta de un coche. Puede ir dirigida a un objetivo concreto.",tipo:"INYECCION_CAPITAL",campos:[{id:"importe",etiqueta:"Importe (€)"}],calcular:t=>t.importe??0,resumir:t=>`Entrada de ${dt(t.importe??0)} €`}],nl=t=>Jo.find(e=>e.id===t);function il(t,e){switch(t.tipo){case"INYECCION_CAPITAL":return`Entra ${dt(t.importe)} €${e?` → «${e}»`:" al reparto general"}`;case"CAMBIO_INGRESOS":return`El neto mensual pasa a ${dt(t.importe)} €`;case"CAMBIO_GASTOS_FIJOS":return`Los gastos fijos pasan a ${dt(t.importe)} €/mes`;case"NUEVA_DEUDA":return`Los gastos fijos suben ${dt(t.importe)} €/mes`}}function rl(t,e,a,o){const s=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,n=new Map(t.vehiculos.map(r=>[r._id,`veh_${s()}`])),i=new Map(t.objetivos.map(r=>[r._id,`obj_${s()}`]));return{...t,_id:a,nombre:e,activo:!1,creadoEn:o,vehiculos:t.vehiculos.map(r=>({...r,_id:n.get(r._id)})),objetivos:t.objetivos.map(r=>({...r,_id:i.get(r._id),vehiculoId:n.get(r.vehiculoId)??r.vehiculoId})),eventos:t.eventos.map(r=>({...r,_id:`ev_${s()}`,objetivoDestinoId:r.objetivoDestinoId?i.get(r.objetivoDestinoId)??null:null}))}}function ll(t){return[...new Set(t.flatMap(a=>a.hitos.map(o=>o.nombre)))].map(a=>{const o=t.map(i=>i.hitos.find(r=>r.nombre===a)??null),s=o.map(i=>i?i.indice:null),n=s[0];return{nombre:a,meses:o.map(i=>i?i.mes:null),diferencias:s.map(i=>i!==null&&n!==null?i-n:null)}})}const cl=t=>j(t/100),dl={INYECCION_CAPITAL:"💰",CAMBIO_GASTOS_FIJOS:"🏷️",CAMBIO_INGRESOS:"📈",NUEVA_DEUDA:"🔑"};function ul(t){const e=[...t.eventos].sort((o,s)=>o.fecha.localeCompare(s.fecha)),a=o=>{var s;return o?(s=t.objetivos.find(n=>n._id===o))==null?void 0:s.nombre:void 0};return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      Los eventos son los cambios de vida que mueven el plan de verdad: una venta, una hipoteca nueva, un hijo,
      un ascenso. Se aplican <strong>al principio del mes</strong> que indiques.
    </div>

    <div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Añadir</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${Jo.map(o=>`<button class="btn-secondary btn-sm" data-pl-plantilla="${c(o.id)}"
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
             ${e.map(o=>pl(o,t,a(o.objetivoDestinoId))).join("")}
           </div>`}`}function pl(t,e,a){const o=ia(e.fechaInicio,t.fecha),s=o<0?"antes del inicio del plan":o===0?"en el primer mes":`dentro de ${o} mes${o!==1?"es":""}`,n=o<0||o>=e.horizonteMeses;return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:16px;flex-shrink:0;width:24px;text-align:center">${dl[t.tipo]}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--accent)">${c(t.fecha)}</span>
          <span style="font-size:11px;color:var(--text3)">${c(s)}</span>
          ${n?'<span class="badge badge-yellow" style="font-size:10px">fuera del horizonte</span>':""}
        </div>
        <div style="font-size:12px;margin-top:3px">${c(il(t,a))}</div>
        ${t.notas?`<div style="font-size:11px;color:var(--text3);margin-top:2px">${c(t.notas)}</div>`:""}
      </div>
      <div style="display:flex;gap:5px;flex-shrink:0">
        <button class="btn-secondary btn-sm" data-pl-editar-evento="${c(t._id)}" style="font-size:11px;padding:2px 9px">Editar</button>
      </div>
    </div>`}function ml(t,e,a,o){const s=t.campos.map(i=>{const r=o[i.id];return`<div class="form-group">
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
    </div>`}function Wo(t,e){var o;const a={};for(const s of e.campos){const n=((o=t.querySelector(`#ev-${s.id}`))==null?void 0:o.value)??"",i=parseFloat(String(n).replace(",","."));a[s.id]=Number.isFinite(i)?Math.round(i*100):0}return a}const fl=(t,e)=>cl(t.calcular(e)),vl=[-2,-1,0,1,2],gl=[-10,0,10],bl=[-20,0,20];function Ko(t){return t.hitos.length===0?null:Math.max(...t.hitos.map(e=>e.indice))}function hl(t,e,a,o,s){const n={};for(const l of o.hitos)n[l.objetivoId]=l.mes;const i=Ko(o),r=s?Ko(s):i;return{etiqueta:t,delta:e,esBase:a,viable:o.viable,hitos:n,desplazamientoMeses:i!==null&&r!==null?i-r:null,patrimonioFinal:o.resumen.patrimonioFinal}}function yl(t,e,a){if(a===0)return t;switch(e){case"rentabilidad":return{...t,vehiculos:t.vehiculos.map(o=>({...o,rentabilidadRealAnual:Math.max(0,o.rentabilidadRealAnual+a/100)}))};case"disfrute":return{...t,pctDisfrute:Math.min(1,Math.max(0,t.pctDisfrute+a/100))};case"ingresos":return{...t,perfil:{...t.perfil,netoMensual:Math.max(0,Math.round(t.perfil.netoMensual*(1+a/100)))}}}}const xl=t=>t>0?`+${t}`:String(t);function la(t,e,a,o,s,n){const i=Ae(t),r=s.map(l=>hl(l===0?"Plan actual":`${xl(l)} ${n}`,l,l===0,l===0?i:Ae(yl(t,e,l)),i));return{palanca:e,titulo:a,descripcion:o,variantes:r}}function $l(t){return[la(t,"rentabilidad","Rentabilidad de los vehículos","Mueve la rentabilidad real de todos los vehículos a la vez. Es la palanca que menos controlas.",vl,"puntos"),la(t,"disfrute","Porcentaje de disfrute","Lo que apartas para gastar en vez de asignar a objetivos. Es la palanca que más controlas.",gl,"puntos"),la(t,"ingresos","Ingresos","Un ascenso, un cambio de trabajo o una reducción de jornada.",bl,"%")]}function Il(t){if(t===null)return"no comparable";if(t===0)return"sin cambio";const e=Math.abs(t),a=Math.floor(e/12),o=e%12,s=[a>0?`${a} año${a!==1?"s":""}`:"",o>0?`${o} mes${o!==1?"es":""}`:""].filter(Boolean).join(" y ");return t<0?`${s} antes`:`${s} más tarde`}const Qo=t=>j(t/100);function Al(t,e,a){return`
    ${Sl(t,e)}
    ${t.length>1?Ml(t):""}
    ${wl(a)}`}function Sl(t,e){return`<div class="card mb-14">
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
  </div>`}function Ml(t){const e=t.slice(0,3),a=e.map(r=>({plan:r,res:Ae(r)})),o=ll(a.map(({plan:r,res:l})=>({nombre:r.nombre,hitos:l.hitos}))),s=["Hito",...e.map(r=>r.nombre)].map((r,l)=>`<th style="text-align:${l===0?"left":"right"};padding:6px 8px;font-size:11px;color:var(--text3)">${c(r)}</th>`).join(""),n=o.map(r=>`<tr>
      <td style="padding:5px 8px;font-size:12px">${c(r.nombre)}</td>
      ${r.meses.map((l,p)=>{const h=r.diferencias[p],u=h===null||h===0?"var(--text2)":h<0?"var(--accent)":"var(--red)",d=p===0||h===null||h===0?"":`<div style="font-size:10px;color:${u}">${h>0?"+":""}${h} m</div>`;return`<td style="text-align:right;padding:5px 8px;font-family:var(--font-mono);font-size:11px;color:${u}">
            ${c(l??"no llega")}${d}
          </td>`}).join("")}
    </tr>`).join("");return`<div class="card mb-14">
    <div class="card-title mb-10">Comparativa</div>
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">${a.map(({plan:r,res:l})=>`<div style="flex:1;min-width:150px">
      <div style="font-size:11px;color:var(--text3)">${c(r.nombre)}</div>
      <div style="font-family:var(--font-mono);font-size:15px;font-weight:700">${c(Qo(l.resumen.patrimonioFinal))}</div>
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
  </div>`}function wl(t){return t?`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Análisis de sensibilidad</span>
      <button class="btn-secondary btn-sm" data-pl-sensibilidad>Recalcular</button>
    </div>
    ${t.map(Cl).join("")}
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
    </div>`}function Cl(t){return`<div style="margin-bottom:18px">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px">${c(t.titulo)}</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px">${c(t.descripcion)}</div>
    ${t.variantes.map(e=>{const a=e.desplazamientoMeses,o=a===null?"var(--text3)":a===0?"var(--text2)":a<0?"var(--accent)":"var(--red)";return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 0;font-size:12px;${e.esBase?"border-top:1px solid var(--border);border-bottom:1px solid var(--border);":""}">
        <span style="${e.esBase?"font-weight:700":"color:var(--text2)"}">${c(e.etiqueta)}</span>
        <span style="display:flex;gap:14px;align-items:baseline">
          <span style="color:${o};font-size:11px">${c(Il(a))}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3);min-width:88px;text-align:right">${c(Qo(e.patrimonioFinal))}</span>
        </span>
      </div>`}).join("")}
  </div>`}const At=t=>j(t/100);function jl(t,e,a=0){return`
    ${El(e)}
    ${zl(t,e)}
    <div class="card mb-14">
      <div class="card-title mb-12">Patrimonio por vehículo</div>
      <div class="chart-wrap-lg"><canvas id="pl-chart"></canvas></div>
    </div>
    ${_l(e)}
    ${Fl(t,e)}
    ${Pl(t,e,a)}`}function El(t){if(t.avisos.length===0&&t.propuestas.length===0)return"";const e={error:"var(--red)",atencion:"var(--yellow)",info:"var(--text2)"},a=t.avisos.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:5px">
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
  </div>`}function zl(t,e){const a=(s,n,i="")=>`<div class="stat-card">
      <div class="stat-label">${c(s)}</div>
      <div class="stat-value" style="font-size:18px">${c(n)}</div>
      ${i?`<div class="stat-sub">${c(i)}</div>`:""}
    </div>`,o=e.serieMensual[e.serieMensual.length-1];return`<div class="grid-4 mb-14">
    ${a("Patrimonio final",At(e.resumen.patrimonioFinal),o?`en ${o.mes}`:"")}
    ${a("Total aportado",At(e.resumen.totalAportado),`${e.mesesSimulados} meses simulados`)}
    ${a("Total a disfrute",At(e.resumen.totalDisfrute),`${Math.round(t.pctDisfrute*100)} % del sobrante`)}
    ${a("Independencia",e.resumen.mesIndependencia??"—",e.resumen.mesIndependencia?"objetivo perpetuo cubierto":"sin objetivo de independencia")}
  </div>`}function _l(t){return t.hitos.length===0?`<div class="card mb-14"><div class="card-title mb-8">Hitos</div>
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
  </div>`}function Fl(t,e){if(e.fases.length<=1)return"";const a=o=>{var s;return((s=t.objetivos.find(n=>n._id===o))==null?void 0:s.nombre)??o};return`<div class="card mb-14">
    <div class="card-title mb-12">Fases del plan</div>
    <div class="text-sm mb-10" style="color:var(--text3)">Tramos entre hitos: en cada uno el dinero se reparte de forma distinta.</div>
    ${e.fases.map((o,s)=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);flex-shrink:0;width:26px">${s+1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${c(o.desde)} → ${c(o.hasta)} <span style="color:var(--text3);font-weight:400">(${o.meses} mes${o.meses!==1?"es":""})</span></div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">${c(o.objetivosActivos.map(a).join(" · ")||"sin asignaciones")}</div>
        </div>
      </div>`).join("")}
  </div>`}const le=60;function Pl(t,e,a=0){if(e.serieMensual.length===0)return"";const o=[...t.objetivos].sort((h,u)=>h.prioridad-u.prioridad),s=Math.ceil(e.serieMensual.length/le),n=Math.min(Math.max(0,a),s-1),i=e.serieMensual.slice(n*le,(n+1)*le),r=["Mes","Disponible",...o.map(h=>h.nombre),"Sin asignar","Patrimonio"].map(h=>`<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${c(h)}</th>`).join(""),l=i.map(h=>{const u=o.map(d=>{const v=h.asignaciones.find(I=>I.objetivoId===d._id),x=(v==null?void 0:v.asignado)??0;return`<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${x>0?"var(--text)":"var(--text3)"}">${c(x>0?At(x):"·")}</td>`}).join("");return`<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${c(h.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${c(At(h.disponible))}</td>
        ${u}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${c(h.sinAsignar>0?At(h.sinAsignar):"·")}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${c(At(h.patrimonioTotal))}</td>
      </tr>`}).join(""),p=s>1?`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap">
           <button class="btn-secondary btn-sm" data-pl-pagina="${n-1}"${n===0?" disabled":""}>← Anteriores</button>
           <span class="text-sm" style="color:var(--text3)">
             Meses ${n*le+1}–${Math.min((n+1)*le,e.serieMensual.length)} de ${e.serieMensual.length}
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
    ${p}
  </div>`}function Dl(t,e){const a=[...t.objetivos].sort((i,r)=>i.prioridad-r.prioridad),o=i=>(i/100).toFixed(2).replace(".",","),s=["Mes","Neto","Gastos fijos","Disfrute","Disponible",...a.map(i=>i.nombre),"Sin asignar","Patrimonio"],n=e.serieMensual.map(i=>[i.mes,o(i.netoMensual),o(i.gastosFijos),o(i.disfrute),o(i.disponible),...a.map(r=>{var l;return o(((l=i.asignaciones.find(p=>p.objetivoId===r._id))==null?void 0:l.asignado)??0)}),o(i.sinAsignar),o(i.patrimonioTotal)].join(";"));return[s.join(";"),...n].join(`
`)}const Ht=t=>{const e=typeof t=="number"?t:parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},ce=t=>(t/100).toFixed(2),Xo=t=>(t*100).toFixed(2),Gt=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?e/100:0},Tl=[["AHORRO_OBJETIVO","Ahorrar una cantidad"],["AMORTIZAR_DEUDA","Amortizar deuda"],["INVERSION_PERPETUA","Independencia económica"],["APORTACION_FIJA","Aportación periódica"]],Nl=[["CUOTA_POR_FECHA","Cuota para llegar a la fecha"],["ABSORBE_TODO","Se lleva todo lo disponible"],["ABSORBE_RESIDUAL","Recibe lo que sobre"],["FIJO","Importe fijo al mes"]],Rl=[["INMEDIATA","Inmediata"],["MEDIA","Media (con preaviso o penalización)"],["BLOQUEADA_HASTA_JUBILACION","Bloqueada hasta la jubilación"]],Ol=[["NULO","Nulo"],["BAJO","Bajo"],["MEDIO","Medio"],["ALTO","Alto"]],Zo={AHORRO_OBJETIVO:"CUOTA_POR_FECHA",AMORTIZAR_DEUDA:"ABSORBE_TODO",INVERSION_PERPETUA:"ABSORBE_RESIDUAL",APORTACION_FIJA:"FIJO"},lt=(t,e,a,o,s="",n="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <input class="form-input" id="${t}" type="${a}" value="${c(o)}" ${n}>
    ${s?`<div class="text-sm mt-4" style="color:var(--text3)">${s}</div>`:""}
  </div>`,Tt=(t,e,a,o,s="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <select class="form-input" id="${t}">
      ${a.map(([n,i])=>`<option value="${c(n)}"${n===o?" selected":""}>${c(i)}</option>`).join("")}
    </select>
    ${s?`<div class="text-sm mt-4" style="color:var(--text3)">${s}</div>`:""}
  </div>`;function ql(t,e,a){var l,p,h;const o=t===null,s=(t==null?void 0:t.tipo)??"AHORRO_OBJETIVO",n=(t==null?void 0:t.modoAsignacion)??Zo[s],i=!!(t!=null&&t.rentaDeseada),r=e.length>0?e.map(u=>[u._id,u.nombre]):[["","— no hay vehículos: crea uno primero —"]];return`
    <div class="grid-2" style="gap:10px">
      ${lt("ob-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Entrada del piso"')}
      ${lt("ob-prioridad","Prioridad","number",(t==null?void 0:t.prioridad)??a,"Menor número = se sirve antes",'min="1"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Tt("ob-tipo","Tipo",Tl,s)}
      ${Tt("ob-modo","Cómo pide dinero",Nl,n)}
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
            ${lt("ob-renta","Renta neta mensual (€)","number",ce(((l=t==null?void 0:t.rentaDeseada)==null?void 0:l.rentaNetaMensual)??2e5),"",'step="0.01"')}
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
        ${lt("ob-importe","Importe objetivo (€)","number",ce((t==null?void 0:t.importeObjetivo)??0),"Deja 0 si no tiene meta (un cubo perpetuo)",'step="0.01"')}
      </div>
      ${lt("ob-fecha","Fecha límite","month",(t==null?void 0:t.fechaLimite)??"","Vacío = lo antes posible")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ob-saldo","Ya acumulado (€)","number",ce((t==null?void 0:t.saldoActual)??0),"Con lo que arranca el objetivo",'step="0.01"')}
      ${Tt("ob-vehiculo","Vehículo",r,(t==null?void 0:t.vehiculoId)??r[0][0])}
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-fijo" style="display:${n==="FIJO"?"block":"none"}">
        ${lt("ob-fijo","Importe fijo mensual (€)","number",ce((t==null?void 0:t.importeFijoMensual)??0),"",'step="0.01"')}
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
    </div>`}function Ll(t,e,a){var p;const o=h=>{var u;return((u=t.querySelector(`#${h}`))==null?void 0:u.value)??""},s=o("ob-nombre").trim();if(!s)return null;const n=o("ob-tipo"),i=o("ob-modo"),r=((p=t.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:p.value)==="renta",l=n==="INVERSION_PERPETUA"&&r;return{_id:(e==null?void 0:e._id)??`obj_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:s,tipo:n,importeObjetivo:l?null:Ht(o("ob-importe")),fechaLimite:o("ob-fecha")||null,prioridad:Math.max(1,Number(o("ob-prioridad"))||a),modoAsignacion:i,vehiculoId:o("ob-vehiculo"),saldoActual:Ht(o("ob-saldo")),estado:(e==null?void 0:e.estado)??"PENDIENTE",notas:o("ob-notas"),...i==="FIJO"?{importeFijoMensual:Ht(o("ob-fijo"))}:{},...i==="ABSORBE_RESIDUAL"?{pesoResidual:Math.max(0,Number(o("ob-peso"))||1)}:{},...l?{rentaDeseada:{rentaNetaMensual:Ht(o("ob-renta")),tasaRetiroSeguro:Gt(o("ob-swr")),tipoFiscalEfectivo:Gt(o("ob-fiscal"))}}:{rentaDeseada:null}}}function Bl(t){const e=a=>{var o;return((o=t.querySelector(`#${a}`))==null?void 0:o.value)??""};try{const{capitalNecesario:a}=ko({rentaNetaMensual:Ht(e("ob-renta")),tasaRetiroSeguro:Gt(e("ob-swr")),tipoFiscalEfectivo:Gt(e("ob-fiscal"))});return`${(a/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0})} €`}catch{return"no calculable con esos parámetros"}}function kl(t,e,a){const o=t===null,s=!!(t!=null&&t.esDeuda),n=[["","— ninguna —"],...e.map(r=>[r._id,r.nombre])],i=[["","— ninguno —"],...a.map(r=>[r._id,`${r.nombre} (${r.tin} % TIN)`])];return`
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
      ${Tt("ve-prestamo","Préstamo",i,(t==null?void 0:t.prestamoId)??"","Su TIN se usará como rentabilidad")}
    </div>

    ${lt("ve-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Fondo indexado"')}

    <div class="grid-2" style="gap:10px">
      ${lt("ve-rent","Rentabilidad REAL anual (%)","number",Xo((t==null?void 0:t.rentabilidadRealAnual)??0),"Nominal menos inflación. Un fondo al 7 % nominal con 2 % de inflación son 5 %",'step="0.1"')}
      ${lt("ve-fiscal","Fiscalidad al retirar (%)","number",Xo((t==null?void 0:t.fiscalidadRetirada)??0),"Tipo efectivo sobre la plusvalía",'step="0.5"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Tt("ve-liquidez","Liquidez",Rl,(t==null?void 0:t.liquidez)??"INMEDIATA")}
      ${Tt("ve-riesgo","Riesgo",Ol,(t==null?void 0:t.riesgo)??"NULO")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ve-tope","Tope de aportación anual (€)","number",t!=null&&t.topeAportacionAnual?ce(t.topeAportacionAnual):"","Vacío = sin tope. Pensiones: 1500",'step="0.01"')}
      ${Tt("ve-cuenta","Cuenta asociada",n,(t==null?void 0:t.cuentaId)??"","Enlaza con una cuenta que ya tengas")}
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ve-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ve-cancelar>Cancelar</button>
      <button class="btn-primary" data-ve-guardar>${o?"Crear vehículo":"Guardar"}</button>
    </div>`}function Hl(t,e){var i;const a=r=>{var l;return((l=t.querySelector(`#${r}`))==null?void 0:l.value)??""},o=a("ve-nombre").trim();if(!o)return null;const s=((i=t.querySelector("#ve-deuda"))==null?void 0:i.checked)??!1,n=a("ve-tope").trim();return{_id:(e==null?void 0:e._id)??`veh_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:o,rentabilidadRealAnual:Gt(a("ve-rent")),liquidez:a("ve-liquidez"),fiscalidadRetirada:Gt(a("ve-fiscal")),topeAportacionAnual:n?Ht(n):null,riesgo:a("ve-riesgo"),cuentaId:a("ve-cuenta")||null,prestamoId:s&&a("ve-prestamo")||null,esDeuda:s}}const Gl={CUOTA_POR_FECHA:"Cada mes calcula lo que hace falta para llegar a la fecha, con el saldo que lleva. Si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo lo disponible hasta completarse. Los de menor prioridad no reciben nada mientras tanto.",ABSORBE_RESIDUAL:"No reclama nada: recoge lo que quede tras servir a los de arriba. Es el modo del cubo de largo plazo.",FIJO:"Aporta siempre lo mismo. Si el vehículo tiene tope anual, se aporta hasta agotarlo y se reanuda en enero."},Vl="M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z",ts=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},Me=t=>(t/100).toFixed(2);function Ul(t){const e=t.hoy??Y;let a="config",o=null,s=0,n=null;function i(){const M=t.store.get("planes");return M.find(z=>z.activo)??M[0]??null}function r(){const M=i();return M||t.store.addItem("planes",{nombre:"Plan base",fechaInicio:e().slice(0,7),horizonteMeses:480,pctDisfrute:0,activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:[],objetivos:[],eventos:[],creadoEn:e()})}function l(M){var F;const z=i();z&&(t.store.updateItem("planes",z._id,M),n=null,o=null,(F=t.onDatosCambiados)==null||F.call(t))}function p(){const z=t.store.get("nominas").filter(R=>R.activo).reduce((R,P)=>R+(P.bruto||0),0),F=Math.round(z*.75/12),T=t.store.get("expenses").filter(R=>R.activo&&R.basico&&R.tipo==="gasto").reduce((R,P)=>R+(P.cuantia||0),0);return{neto:Math.round(F*100),gastos:Math.round(T*100)}}function h(M){return n||(n=Ae(M)),n}function u(M){const z=p(),F=Math.max(0,M.perfil.netoMensual-M.perfil.gastosFijosMensuales),T=Math.round(M.pctDisfrute*100);return`
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${c(Me(M.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${c(j(z.neto/100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${c(Me(M.perfil.gastosFijosMensuales))}">
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

      ${d(M)}`}function d(M){return`
      <div class="card">
        <div class="card-title mb-8">Notas del plan</div>
        <textarea class="form-input" id="pl-notas" rows="4" style="resize:vertical;font-family:var(--font-sans)"
          placeholder="Supuestos, decisiones tomadas, cosas a revisar…">${c(M.notas??"")}</textarea>
        <button class="btn-secondary btn-sm mt-8" data-pl-guardar-notas>Guardar notas</button>
      </div>`}const v=()=>document.getElementById("modal-overlay"),x=()=>document.getElementById("modal-content"),I=()=>{var M;return(M=v())==null?void 0:M.classList.add("hidden")};function A(M,z){const F=v(),T=x();return!F||!T?null:(T.innerHTML=`<div class="modal-title">${c(M)}</div>${z}`,F.classList.remove("hidden"),T)}function g(M){l({objetivos:M})}function b(M,z){const F=i();if(!F)return;const T=z?F.objetivos.find(k=>k._id===z)??null:null,R=F.objetivos.reduce((k,O)=>Math.max(k,O.prioridad),0)+1,P=A(T?`Editar «${T.nombre}»`:"Nuevo objetivo",ql(T,F.vehiculos,R));if(!P)return;const B=()=>{var U;const k=(U=P.querySelector("#ob-modo"))==null?void 0:U.value,O=P.querySelector("#ob-modo-ayuda");O&&k&&(O.textContent=Gl[k]);const H=(K,Q)=>{const st=P.querySelector(K);st&&(st.style.display=Q?"block":"none")};H("#ob-bloque-fijo",k==="FIJO"),H("#ob-bloque-residual",k==="ABSORBE_RESIDUAL")};B();const L=()=>{const k=P.querySelector("#ob-capital-derivado");k&&(k.textContent=Bl(P))};L(),J(P,"#ob-modo",B),J(P,"#ob-tipo",()=>{const k=P.querySelector("#ob-tipo").value,O=P.querySelector("#ob-modo");O&&(O.value=Zo[k]);const H=P.querySelector("#ob-bloque-perpetua");H&&(H.style.display=k==="INVERSION_PERPETUA"?"block":"none"),B()}),J(P,'input[name="ob-derivar"]',()=>{var U;const k=((U=P.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:U.value)==="renta",O=P.querySelector("#ob-renta-campos"),H=P.querySelector("#ob-bloque-importe");O&&(O.style.display=k?"block":"none"),H&&(H.style.display=k?"none":"block"),L()}),J(P,"#ob-renta, #ob-swr, #ob-fiscal",L),N(P,"[data-ob-cancelar]",I),N(P,"[data-ob-guardar]",()=>{const k=Ll(P,T,R);if(!k){q("El objetivo necesita un nombre","err");return}if(!k.vehiculoId){q("Crea antes un vehículo donde meter el dinero","err");return}const O=F.objetivos.filter(H=>H._id!==k._id);g([...O,k]),I(),q(T?"Objetivo actualizado":`Objetivo «${k.nombre}» creado`),D(M)}),N(P,"[data-ob-borrar]",()=>{T&&Z(`¿Borrar «${T.nombre}»? Esto no se puede deshacer.`)&&(g(F.objetivos.filter(k=>k._id!==T._id)),I(),q("Objetivo borrado"),D(M))})}function f(M,z){const F=i();if(!F)return;const T=z?F.vehiculos.find(L=>L._id===z)??null:null,R=t.store.get("accounts").filter(L=>L.activo).map(L=>({_id:L._id,nombre:L.nombre})),P=t.store.get("loans").filter(L=>L.activo&&!L.simulacion).map(L=>({_id:L._id,nombre:L.nombre,tin:L.tin})),B=A(T?`Editar «${T.nombre}»`:"Nuevo vehículo",kl(T,R,P));B&&(J(B,"#ve-deuda",()=>{const L=B.querySelector("#ve-deuda").checked,k=B.querySelector("#ve-bloque-prestamo");k&&(k.style.display=L?"block":"none")}),J(B,"#ve-prestamo",()=>{const L=B.querySelector("#ve-prestamo").value,k=P.find(U=>U._id===L);if(!k)return;const O=B.querySelector("#ve-rent"),H=B.querySelector("#ve-nombre");O&&(O.value=String(k.tin)),H&&!H.value.trim()&&(H.value=`Amortizar ${k.nombre}`)}),N(B,"[data-ve-cancelar]",I),N(B,"[data-ve-guardar]",()=>{const L=Hl(B,T);if(!L){q("El vehículo necesita un nombre","err");return}const k=F.vehiculos.filter(O=>O._id!==L._id);l({vehiculos:[...k,L]}),I(),q(T?"Vehículo actualizado":`Vehículo «${L.nombre}» creado`),D(M)}),N(B,"[data-ve-borrar]",()=>{if(!T)return;const L=F.objetivos.filter(k=>k.vehiculoId===T._id);if(L.length>0){q(`No se puede borrar: lo usan ${L.length} objetivo${L.length!==1?"s":""}`,"err");return}Z(`¿Borrar el vehículo «${T.nombre}»?`)&&(l({vehiculos:F.vehiculos.filter(k=>k._id!==T._id)}),I(),q("Vehículo borrado"),D(M))}))}function $(M,z,F){const T=i();if(!T||z===F)return;const R=[...T.objetivos].sort((k,O)=>k.prioridad-O.prioridad),P=R.findIndex(k=>k._id===z),B=R.findIndex(k=>k._id===F);if(P<0||B<0)return;const[L]=R.splice(P,1);R.splice(B,0,L),g(R.map((k,O)=>({...k,prioridad:O+1}))),D(M)}function m(M){return M.vehiculos.length===0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.06);border-color:rgba(255,209,102,0.28)">
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
    </div>`}function y(M,z,F){const T=i(),R=nl(z);if(!T||!R)return;const P=F?T.eventos.find(O=>O._id===F)??null:null,B={};R.id==="hijo"&&(B.actuales=T.perfil.gastosFijosMensuales),R.id==="subida-sueldo"&&(B.actual=T.perfil.netoMensual);const L=A(P?`Editar evento · ${R.nombre}`:R.nombre,ml(R,P,T,B));if(!L)return;const k=()=>{const O=L.querySelector("#ev-resultado");O&&(O.textContent=fl(R,Wo(L,R)))};k();for(const O of R.campos)J(L,`#ev-${O.id}`,k);N(L,"[data-ev-cancelar]",I),N(L,"[data-ev-guardar]",()=>{var K,Q;const O=((K=L.querySelector("#ev-fecha"))==null?void 0:K.value)??"";if(!O){q("El evento necesita un mes","err");return}const H=Wo(L,R),U={_id:(P==null?void 0:P._id)??`ev_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,fecha:O,tipo:R.tipo,importe:R.calcular(H),objetivoDestinoId:((Q=L.querySelector("#ev-destino"))==null?void 0:Q.value)||null,notas:R.resumir(H)};l({eventos:[...T.eventos.filter(st=>st._id!==U._id),U]}),I(),q(P?"Evento actualizado":"Evento añadido"),D(M)}),N(L,"[data-ev-borrar]",()=>{!P||!Z("¿Borrar este evento?")||(l({eventos:T.eventos.filter(O=>O._id!==P._id)}),I(),q("Evento borrado"),D(M))})}function S(M){var z;switch(M.tipo){case"CAMBIO_GASTOS_FIJOS":return"hijo";case"CAMBIO_INGRESOS":return"subida-sueldo";case"NUEVA_DEUDA":return"nueva-hipoteca";case"INYECCION_CAPITAL":return(z=M.notas)!=null&&z.includes("hipoteca")?"venta-vivienda":"inyeccion"}}function w(){const M=i();if(!M)return;const z=new Blob([JSON.stringify(M,null,2)],{type:"application/json"}),F=URL.createObjectURL(z),T=document.createElement("a");T.href=F,T.download=`plan-${M.nombre.replace(/[^\w-]+/g,"_")}-${e()}.json`,T.click(),URL.revokeObjectURL(F),q("Plan exportado")}function E(M){const z=document.createElement("input");z.type="file",z.accept="application/json,.json",z.addEventListener("change",async()=>{var T,R;const F=(T=z.files)==null?void 0:T[0];if(F)try{const P=JSON.parse(await F.text());if(!P||!Array.isArray(P.objetivos)||!Array.isArray(P.vehiculos)||!P.perfil){q("Ese fichero no es un plan de objetivos","err");return}const B=`${P.nombre??"Importado"} (importado)`,L=t.store.addItem("planes",{...P,nombre:B,activo:!1,creadoEn:e()});n=null,o=null,(R=t.onDatosCambiados)==null||R.call(t),q(`Plan «${L.nombre}» importado`),D(M)}catch(P){console.error("[Planner] Importación fallida:",P),q("No se ha podido leer el fichero","err")}}),z.click()}function _(M,z){switch(a){case"config":return u(M);case"objetivos":return ol(M,z);case"simulacion":return jl(M,z,s);case"eventos":return ul(M);case"escenarios":return Al(t.store.get("planes"),M._id,o)}}function D(M){const z=r(),F=h(z),T=(P,B)=>`<button class="period-btn ${a===P?"active":""}" data-pl-tab="${P}">${B}</button>`,R=F.viable?'<span class="badge badge-green">Plan viable</span>':'<span class="badge badge-red">No cabe en el flujo</span>';if(M.innerHTML=`
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

      <div id="pl-cuerpo">${_(z,F)}</div>`,a==="simulacion"){const P=M.querySelector("#pl-chart");P&&tl(P,z,F)}C(M)}function C(M){N(M,"[data-pl-tab]",F=>{a=F.dataset.plTab,D(M)}),J(M,"#pl-disfrute",F=>{const T=Number(F.value)/100,R=M.querySelector("#pl-pct-val");R&&(R.textContent=`${Math.round(T*100)} %`);const P=i();if(!P)return;const B=Math.max(0,P.perfil.netoMensual-P.perfil.gastosFijosMensuales)*(1-T),L=M.querySelector("#pl-disponible");L&&(L.textContent=j(B/100))}),N(M,"[data-pl-usar-sugerido]",()=>{const F=p(),T=M.querySelector("#pl-neto"),R=M.querySelector("#pl-gastos");T&&(T.value=Me(F.neto)),R&&(R.value=Me(F.gastos))}),N(M,"[data-pl-guardar]",()=>{const F=T=>{var R;return((R=M.querySelector(T))==null?void 0:R.value)??""};l({perfil:{netoMensual:ts(F("#pl-neto")),gastosFijosMensuales:ts(F("#pl-gastos")),manual:!0},pctDisfrute:Math.min(1,Math.max(0,Number(F("#pl-disfrute"))/100)),fechaInicio:F("#pl-inicio")||e().slice(0,7),horizonteMeses:Math.min(600,Math.max(1,Number(F("#pl-horizonte"))||480))}),q("Plan guardado"),D(M)}),N(M,"[data-pl-plantilla]",F=>y(M,F.dataset.plPlantilla??"",null)),N(M,"[data-pl-editar-evento]",F=>{var P;const T=F.dataset.plEditarEvento??"",R=(P=i())==null?void 0:P.eventos.find(B=>B._id===T);R&&y(M,S(R),T)}),N(M,"[data-pl-duplicar]",()=>{var P;const F=i();if(!F)return;const T=window.prompt("Nombre del plan nuevo:",`${F.nombre} (copia)`);if(!(T!=null&&T.trim()))return;const R=rl(F,T.trim(),`plan_${Date.now().toString(36)}`,e());t.store.addItem("planes",R),(P=t.onDatosCambiados)==null||P.call(t),q(`Plan «${R.nombre}» creado. Actívalo para editarlo.`),D(M)}),N(M,"[data-pl-activar]",F=>{var R;const T=F.dataset.plActivar;if(T){for(const P of t.store.get("planes"))t.store.updateItem("planes",P._id,{activo:P._id===T});n=null,o=null,(R=t.onDatosCambiados)==null||R.call(t),q("Plan activo cambiado"),D(M)}}),N(M,"[data-pl-renombrar]",F=>{var B;const T=F.dataset.plRenombrar,R=t.store.get("planes").find(L=>L._id===T);if(!R)return;const P=window.prompt("Nuevo nombre:",R.nombre);P!=null&&P.trim()&&(t.store.updateItem("planes",R._id,{nombre:P.trim()}),(B=t.onDatosCambiados)==null||B.call(t),D(M))}),N(M,"[data-pl-borrar-plan]",F=>{var B;const T=F.dataset.plBorrarPlan,R=t.store.get("planes").find(L=>L._id===T);if(!R||!Z(`¿Borrar el plan «${R.nombre}» con sus ${R.objetivos.length} objetivos? No se puede deshacer.`))return;t.store.removeItem("planes",R._id);const P=t.store.get("planes");R.activo&&P.length>0&&t.store.updateItem("planes",P[0]._id,{activo:!0}),n=null,o=null,(B=t.onDatosCambiados)==null||B.call(t),q("Plan borrado"),D(M)}),N(M,"[data-pl-sensibilidad]",()=>{const F=i();F&&(o=$l(F),D(M))}),N(M,"[data-pl-pagina]",F=>{s=Number(F.dataset.plPagina)||0,D(M)}),N(M,"[data-pl-exportar]",w),N(M,"[data-pl-importar]",()=>E(M)),N(M,"[data-pl-nuevo-objetivo]",()=>b(M,null)),N(M,"[data-pl-nuevo-vehiculo]",()=>f(M,null)),N(M,"[data-pl-editar-vehiculo]",F=>f(M,F.dataset.plEditarVehiculo??null)),N(M,"[data-pl-editar-objetivo]",F=>b(M,F.dataset.plEditarObjetivo??null));let z=null;M.querySelectorAll("[data-pl-objetivo]").forEach(F=>{F.addEventListener("dragstart",()=>{z=F.dataset.plObjetivo??null,F.style.opacity="0.45"}),F.addEventListener("dragend",()=>{F.style.opacity="",M.querySelectorAll("[data-pl-objetivo]").forEach(T=>T.style.borderTop="")}),F.addEventListener("dragover",T=>{T.preventDefault(),z&&F.dataset.plObjetivo!==z&&(F.style.borderTop="2px solid var(--accent)")}),F.addEventListener("dragleave",()=>{F.style.borderTop=""}),F.addEventListener("drop",T=>{T.preventDefault(),F.style.borderTop="";const R=F.dataset.plObjetivo;z&&R&&$(M,z,R),z=null})}),N(M,"[data-pl-csv]",()=>{const F=i();if(!F||!n)return;const T=new Blob(["\uFEFF"+Dl(F,n)],{type:"text/csv;charset=utf-8"}),R=URL.createObjectURL(T),P=document.createElement("a");P.href=R,P.download=`plan-${F.nombre.replace(/[^\w-]+/g,"_")}-${e()}.csv`,P.click(),URL.revokeObjectURL(R),q(`CSV exportado (${n.serieMensual.length} meses)`)}),N(M,"[data-pl-guardar-notas]",()=>{var F;l({notas:((F=M.querySelector("#pl-notas"))==null?void 0:F.value)??""}),q("Notas guardadas")})}return{id:"planner",route:"planner",nombre:"Objetivos financieros",seccion:2,iconoPath:Vl,mount:D}}function es(t,e,a=!1){const o=Math.abs(It(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function Yl(t){function e(f){return`${f}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(f={}){var m;const $=(m=f.texto)==null?void 0:m.trim().toLowerCase();return t.get("transacciones").filter(y=>!(f.cuentaId&&y.cuentaId!==f.cuentaId||f.desde&&y.fecha<f.desde||f.hasta&&y.fecha>f.hasta||f.tipo&&y.tipo!==f.tipo||f.estimacionId&&y.estimacionId!==f.estimacionId||f.tags&&f.tags.length>0&&!f.tags.some(S=>y.tags.includes(S))||$&&!y.concepto.toLowerCase().includes($))).sort((y,S)=>y.fecha.localeCompare(S.fecha)||y._id.localeCompare(S._id))}function o(f){const $={_id:e("tx"),fecha:f.fecha,cuentaId:f.cuentaId,importeCts:es(f.tipo,f.importe,f.negativo),concepto:f.concepto,tags:f.tags??[],estimacionId:f.estimacionId??null,tipo:f.tipo,origen:f.origen??"manual",...f.nota?{nota:f.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),$]),$}function s(f,$){t.set("transacciones",t.get("transacciones").map(m=>{if(m._id!==f)return m;const{importe:y,...S}=$,w={...m,...S};return y!==void 0&&(w.importeCts=es(w.tipo,y,w.importeCts<0)),w}))}function n(f){t.set("transacciones",t.get("transacciones").filter($=>$._id!==f))}function i(f,$){s(f,{estimacionId:$})}function r(f){return t.get("puntosControl").filter($=>!f||$.cuentaId===f).sort(($,m)=>$.fecha.localeCompare(m.fecha))}function l(f,$,m,y){const S={_id:e("pc"),fecha:$,cuentaId:f,saldoCts:It(m),...y?{nota:y}:{}},w=t.get("puntosControl").filter(E=>!(E.cuentaId===f&&E.fecha===$));return t.set("puntosControl",[...w,S].sort((E,_)=>E.fecha.localeCompare(_.fecha))),h(f),S}function p(f){const $=t.get("puntosControl").find(m=>m._id===f);t.set("puntosControl",t.get("puntosControl").filter(m=>m._id!==f)),$&&h($.cuentaId)}function h(f){const $=r(f),m=t.get("accounts");m.some(y=>y._id===f)&&t.set("accounts",m.map(y=>y._id===f?{...y,historicoSaldos:$.map(S=>({_id:S._id,fecha:S.fecha,saldo:et(S.saldoCts),...S.nota?{nota:S.nota}:{}}))}:y))}function u(f,$=Y()){const m=r(f).filter(E=>E.fecha<=$).pop(),y=m==null?void 0:m.fecha,S=(m==null?void 0:m.saldoCts)??0;return t.get("transacciones").filter(E=>E.cuentaId===f&&E.fecha<=$&&(y===void 0||E.fecha>y)).reduce((E,_)=>E+_.importeCts,S)}function d(f,$){return et(u(f,$))}function v(f=Y(),$){const m=$??t.get("accounts").filter(y=>y.activo).map(y=>y._id);return et(m.reduce((y,S)=>y+u(S,f),0))}function x(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function I(){const f=[...t.get("transacciones").map($=>$.fecha),...t.get("puntosControl").map($=>$.fecha)];return f.length>0?f.sort().pop()??null:null}function A(f={}){return et(a(f).reduce(($,m)=>$+m.importeCts,0))}function g(f={}){const $=new Map;for(const m of a(f)){const y=m.fecha.slice(0,7);$.set(y,($.get(y)??0)+m.importeCts)}return new Map([...$.entries()].sort(([m],[y])=>m.localeCompare(y)).map(([m,y])=>[m,et(y)]))}function b(f={}){const $=new Map;for(const m of a(f))for(const y of m.tags.length>0?m.tags:["sin_tag"])$.set(y,($.get(y)??0)+m.importeCts);return new Map([...$.entries()].map(([m,y])=>[m,et(y)]))}return{transacciones:a,registrar:o,actualizar:s,eliminar:n,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:p,saldoCuenta:d,saldoCuentaCts:u,saldoTotal:v,tieneDatos:x,ultimaFecha:I,total:A,totalPorMes:g,totalPorTag:b}}function xt(t){return t.trim().toLowerCase()}function Jl(t){function e(){const p=new Map,h=(u,d)=>{const v=xt(u);if(!v)return;const x=p.get(v)??{tag:v,estimaciones:0,reales:0,total:0};x[d]+=1,x.total+=1,p.set(v,x)};for(const u of t.get("expenses"))for(const d of u.tags??[])h(d,"estimaciones");for(const u of t.get("transacciones"))for(const d of u.tags??[])h(d,"reales");return[...p.values()].sort((u,d)=>d.total-u.total||u.tag.localeCompare(d.tag))}function a(){return e().map(p=>p.tag)}function o(p){return e().filter(h=>p==="estimaciones"?h.reales===0:h.estimaciones===0).map(h=>h.tag)}function s(p,h,u){const d=xt(h),v=(p??[]).map(xt);if(!v.includes(d))return p??[];const x=v.filter(I=>I!==d);return u===null?[...new Set(x)]:[...new Set([...x,xt(u)])]}function n(p,h){const u=xt(h);if(!u)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return l(p,u)}function i(p,h){let u=0;for(const d of p)xt(d)!==xt(h)&&(u+=l(d,xt(h)).cambiados);return{cambiados:u}}function r(p){return l(p,null)}function l(p,h){let u=0;const d=t.get("expenses").map(S=>{const w=s(S.tags,p,h);return w!==S.tags&&(u+=1),w===S.tags?S:{...S,tags:w}});t.set("expenses",d);const v=t.get("transacciones").map(S=>{const w=s(S.tags,p,h);return w!==S.tags&&(u+=1),w===S.tags?S:{...S,tags:w}});t.set("transacciones",v);const x=t.get("loans").map(S=>{const w=s(S.tags,p,h);return w!==S.tags&&(u+=1),w===S.tags?S:{...S,tags:w}});t.set("loans",x);const I=t.get("nominas").map(S=>{const w=s(S.tags,p,h);return w!==S.tags&&(u+=1),w===S.tags?S:{...S,tags:w}});t.set("nominas",I);const A=t.get("config"),g=xt(p),b=S=>{const w=(S??[]).map(xt);if(!w.includes(g))return S??[];const E=w.filter(_=>_!==g);return h===null?[...new Set(E)]:[...new Set([...E,h])]},f={},$=b(A.activeTagsFilter),m=b(A.tagCategorias),y=b(A.tagGrupos);return $!==A.activeTagsFilter&&(f.activeTagsFilter=$),m!==A.tagCategorias&&(f.tagCategorias=m),y!==A.tagGrupos&&(f.tagGrupos=y),Object.keys(f).length>0&&t.patchConfig(f),{cambiados:u}}return{uso:e,todas:a,soloEn:o,renombrar:n,fusionar:i,eliminar:r}}const Wl=3;function as(t){return t<.005?0:t}function Kl(t){if(t.length<2)return null;const e=t.reduce((o,s)=>o+s,0)/t.length,a=t.reduce((o,s)=>o+(s-e)**2,0)/(t.length-1);return Math.sqrt(a)}function Ql(t){const e=[],a=[],o=[];for(const i of t){if(i.meses.length<Wl)continue;const r=Kl(i.meses.map(l=>l.desviacion));r!==null&&(e.push(r),a.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(e.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const s=Math.sqrt(e.reduce((i,r)=>i+r*r,0)),n=Math.sqrt(a.reduce((i,r)=>i+r*r,0));return{sigmaMensual:as(s),sigmaDeriva:as(n),estimaciones:e.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function os(t,e,a=1,o=0){if(e<=0)return 0;const s=Math.max(0,t)*Math.sqrt(e),n=Math.max(0,o)*e;return s===0&&n===0?0:W(a*Math.hypot(s,n))}function Xl(t,e,a={}){if(!e.fiable||t.length===0)return[];const{z:o=1}=a,s=a.desde??t[0].fecha,[n,i]=s.slice(0,7).split("-").map(Number);return t.map(r=>{const[l,p]=r.fecha.slice(0,7).split("-").map(Number),h=Math.max(0,(l-n)*12+(p-i)),u=os(e.sigmaMensual,h,o,e.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:W(r.saldoAcum+u),abajo:W(r.saldoAcum-u)}})}function Zl(t,e=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const a=e>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${e} desviación${e!==1?"es":""} típica${e!==1?"s":""} (${a} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const ca="financeapp_session",tc=["local","dropbox","firebase"];function ec(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!tc.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function ac({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now()}={}){const o=()=>t??(typeof localStorage<"u"?localStorage:null);function s(d){const v=o();if(v)try{d?v.setItem(ca,JSON.stringify(d)):v.removeItem(ca)}catch{}}function n(){const d=o();if(!d)return null;try{return ec(d.getItem(ca))}catch{return null}}function i(){const d=n();return d?(a()-d.ultimoUso)/6e4:null}function r(){const d=e();if(!Number.isFinite(d)||d<=0)return!1;const v=i();return v!==null&&v>=d}function l(){const d=n();return d?r()?(s(null),null):d:null}function p(d){const v=a(),x={modo:d.modo,...d.email?{email:d.email}:{},...d.passphrase?{passphrase:d.passphrase}:{},creadaEn:v,ultimoUso:v};return s(x),x}function h(){const d=n();d&&s({...d,ultimoUso:a()})}function u(){s(null)}return{abrir:p,leer:l,tocar:h,cerrar:u,caducada:r,inactividadMinutos:i,get activa(){return l()!==null}}}const ss=["pointerdown","keydown","visibilitychange"];function oc({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:s=clearInterval,target:n=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const h of ss)n==null||n.addEventListener(h,r);const l=o(()=>{i&&t.caducada()&&(p(),t.cerrar(),e())},a);function p(){if(i){i=!1,s(l);for(const h of ss)n==null||n.removeEventListener(h,r)}}return p}const sc=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}];function ns(){if(typeof localStorage<"u"){const d=$n();d.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${d.join(", ")}`)}const t=wn({adapter:xn()}),{applied:e}=t.load();e.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${e.join(", ")} (esquema v${te})`);const a=jn(t);Bs(d=>a.isEnabled(d));const o=ac({autoLogoutMinutos:()=>{var v,x;const d=(x=(v=globalThis.State)==null?void 0:v.get)==null?void 0:x.call(v,"config");return Number((d==null?void 0:d.autoLogoutMinutos)??t.get("config").autoLogoutMinutos??0)}}),s=Yl(t),n=Jl(t),i=di(s),r=Vn(t),l=Ln({isEnabled:d=>a.isEnabled(d)}),p=Pn({flags:a,rutasExtra:()=>l.flagPorRuta()}),h=Fn({flags:a,onChange:()=>{var d,v;l.attachToShell(),p.apply(),(v=(d=globalThis.Router)==null?void 0:d.rerender)==null||v.call(d)}}),u=()=>{var v,x,I,A,g,b;const d=globalThis;if((x=(v=d.State)==null?void 0:v.load)==null||x.call(v),((A=(I=d.Router)==null?void 0:I.current)==null?void 0:A.call(I))==="dashboard")try{(b=(g=d.DashboardModule)==null?void 0:g.render)==null||b.call(g)}catch(f){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",f)}};return l.register(Ri({store:t,onDatosCambiados:u})),l.register(Ji({store:t,onDatosCambiados:u})),l.register(mr({store:t,onDatosCambiados:u})),l.register(Pr({store:t,ledger:s,mostrarObjetivos:()=>a.isEnabled("goals"),onDatosCambiados:u})),l.register(Ii({ledger:s,tags:n,precision:i,adjuster:r,accounts:()=>t.get("accounts"),estimaciones:()=>t.get("expenses"),onDatosCambiados:u})),l.register(Ul({store:t,onDatosCambiados:u})),l.register(Gr({store:t,onDatosCambiados:u})),l.register(zi({store:t,onDatosCambiados:u})),l.register(Lr({store:t})),l.register(Si({store:t,onDatosCambiados:u})),{version:te,core:As,engine:{generarExtracto:Qt,recomputarSaldoAcum:ws,saldoHoy:Cs,sumarPorTags:qa,providers:{proyectarGastos:Kt,proyectarPrestamos:za,proyectarTransferencias:_a,proyectarNominas:Ta,proyectarInteresesCuentas:Pa,proyectarAportaciones:Fa,proyectarRetencionesFiscales:Da,proyectarInflacionGastos:Na,proyectarPerdidaAhorro:Ra},analysis:_s,margins:Ts,avisos:qs,optimizer:ks,dashboard:an},store:t,flags:a,featureRegistry:{all:Ct,porGrupo:lo},ui:{openFeatures:h.open,applyGating:p.apply,watchGating:()=>p.observar(),instalarDeshacer:()=>Tn({store:t,rerender:()=>{var v,x,I,A;const d=globalThis;(x=(v=d.State)==null?void 0:v.load)==null||x.call(v),(A=(I=d.Router)==null?void 0:I.rerender)==null||A.call(I)}}),instalarBuscador:()=>qn({estado:()=>({accounts:t.get("accounts"),expenses:t.get("expenses"),loans:t.get("loans"),nominas:t.get("nominas"),escenarios:t.get("escenarios"),planes:t.get("planes"),goals:t.get("goals"),transacciones:t.get("transacciones")}),rutasDisponibles:()=>l.routes(),navegar:d=>{var v,x;return(x=(v=globalThis.Router)==null?void 0:v.navigate)==null?void 0:x.call(v,d)}})},app:l,session:Object.assign(o,{vigilar:d=>oc({sesion:o,onCaducada:d}),opciones:sc}),accounting:{ledger:s,tags:n,precision:i,adjuster:r,sugerirAjuste:We,medirVariabilidad:Ql,bandaDeConfianza:Xl,bandaAcumulada:os,describirBanda:Zl}}}function nc(){try{const t=ns();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const Vt=typeof window<"u"?nc():null;if(Vt){let t=!1;const e=()=>{Vt.app.attachToShell(),Vt.ui.applyGating(),t||(t=!0,Vt.ui.watchGating(),Vt.ui.instalarDeshacer(),Vt.ui.instalarBuscador())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",a=>{const o=a.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(e,0)})}return $t.bootstrap=ns,Object.defineProperty($t,Symbol.toStringTag,{value:"Module"}),$t}({});
//# sourceMappingURL=financeapp-core.js.map

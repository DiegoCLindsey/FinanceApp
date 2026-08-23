var FinanceAppBundle=function($t){"use strict";var yl=Object.defineProperty;var xl=($t,V,G)=>V in $t?yl($t,V,{enumerable:!0,configurable:!0,writable:!0,value:G}):$t[V]=G;var Jo=($t,V,G)=>xl($t,typeof V!="symbol"?V+"":V,G);function V(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function G(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function J(){return V(new Date)}function Se(t,e){return new Date(t,e+1,0).getDate()}function na(t,e,a){return V(new Date(t,e,Math.min(a,Se(t,e))))}function ce(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return V(new Date(t,e+1,0));const n=parseInt(o);if(!isNaN(n))return na(t,e,n)}if(a.startsWith("nthweekday:")){const o=a.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,e+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return V(r)}const i=new Date(t,e,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),V(i)}return null}function ia(t,e){if(!e)return t;const a=G(t);return ce(a.getFullYear(),a.getMonth(),e)??t}const Wo=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],Qo={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function we(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${Qo[a]||a+"º"} ${Wo[o]} del mes`}return t}function de(t,e){const a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((o-a)/864e5)}function It(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function tt(t){return t/100}function st(t){return tt(It(t))}function z(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function ra(t){return(t||0).toFixed(2)+"%"}function Dt(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function la(t,e,a,o=0){const n=Dt(t,e,a),s=t*(1-o/100);let i=e/100/12;for(let r=0;r<200;r++){const u=n*(1-Math.pow(1+i,-a))/i-s,g=n*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),p=i-u/g;if(Math.abs(p-i)<1e-10){i=p;break}i=p}return(Math.pow(1+i,12)-1)*100}function ca(t,e,a,o,n=0,s=[],i={}){const r=[];let l=t;const u=G(o),g=e/100/12;let p=a,d=Dt(l,e,p);const b=[...s].sort(($,A)=>$.fecha.localeCompare(A.fecha));let h=0;for(let $=1;$<=a*2&&l>.01;$++){const A=new Date(u);u.setMonth(u.getMonth()+1);const m=ia(V(A),i.diaPago||"");for(;h<b.length&&b[h].fecha<=m;){const I=b[h],f=I.cantidad*(n/100);if(l-=I.cantidad,l=Math.max(0,l),I.tipo==="plazo"?p=Math.ceil(-Math.log(1-l*g/d)/Math.log(1+g)):(p=a-$+1,d=Dt(l,e,p)),r.push({mes:"AMORT",fecha:I.fecha,cuota:0,interes:0,amortizacion:I.cantidad,comisionAmort:f,capitalPendiente:l,esAmortizacion:!0,simulacion:I.simulacion||!1}),h++,l<.01)break}if(l<.01)break;const v=l*g,y=Math.min(d-v,l);if(l-=y,l<.01&&(l=0),r.push({mes:$,fecha:m,cuota:d,interes:v,amortizacion:y,comisionAmort:0,capitalPendiente:l,esAmortizacion:!1,simulacion:!1}),p--,p<=0||l<.01)break}return r}const da=new Map;function et(t){var A;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((m,v)=>`${m.fecha}|${m.cantidad}|${m.tipo||""}`.localeCompare(`${v.fecha}|${v.cantidad}|${v.tipo||""}`)).map(m=>`${m.fecha}:${m.cantidad}:${m.tipo||""}`).join(";")}`,o=da.get(a);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:l,comisionApertura:u}=t,g=ca(n,s,i,r,l||0,e,t),p=g.reduce((m,v)=>m+v.interes,0),d=g.reduce((m,v)=>m+v.comisionAmort,0),b=n*((u||0)/100),h=g.filter(m=>!m.esAmortizacion),$={cuota:Dt(n,s,i),totalIntereses:p,tae:la(n,s,i,u||0),costoTotal:p+d+b,comAp:b,totalComAm:d,fechaFin:((A=h.slice(-1)[0])==null?void 0:A.fecha)||"",mesesReales:h.length,tabla:g};return da.set(a,$),$}function ua(t){const e=et(t),a=et({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,n=a.mesesReales-e.mesesReales,s=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function pt(t,e,a){if(!t||t.length===0)return 1;const o=G(e),n=G(a);if(n<=o)return 1;const s=[...t].sort((l,u)=>l.year-u.year);let i=1,r=new Date(o);for(;r<n;){const l=r.getFullYear(),u=s.filter($=>$.year<=l),g=u.length>0?u[u.length-1]:s[0],p=(g?g.tasa:0)/100,d=new Date(l+1,0,1),b=d<n?d:n,h=de(r,b);i*=Math.pow(1+p,h/365.25),r=b}return i}function pa(t,e,a,o=0){const n=G(e),s=G(a);if(s<=n)return o;const i=de(n,s),r=t?[...t].sort((g,p)=>g.year-p.year):[];let l=0,u=new Date(n);for(;u<s;){const g=u.getFullYear(),p=new Date(g+1,0,1),d=p<s?p:s,b=de(u,d),h=r.filter(m=>m.year<=g),$=h.length>0?h[h.length-1]:null,A=$!==null?$.tasa:o;l+=A*b,u=d}return i>0?l/i:o}function ma(t,e){return((1+t/100)/(1+e/100)-1)*100}function Ko(t,e,a,o){const n=pt(e,a,o);return n>0?t/n:t}function Xo(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,n=e.saludUmbralDTIVerde??30,s=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],r=e.saludExcluirHipoteca||!1,{ingresos:l=0,cuotas:u=0,cuotasHipoteca:g=0,gastosBasicos:p=0,gastosOtros:d=0,amortizaciones:b=0}=t,h=l-u-b-p-d,$=h,A=l>0?$/l*100:null,m=r?u-g:u,v=l>0?m/l*100:null,y=l>0?u/l*100:null,I=l>0?(p+u+b)/l*100:null,f=l>0?d/l*100:null,x=(w,C,j)=>w===null?"neutral":w>=C?"verde":w>=j?"amarillo":"rojo",S=(w,C,j)=>w===null?"neutral":w<=C?"verde":w<=j?"amarillo":"rojo";return{ingresos:l,cuotas:u,cuotasHipoteca:g,gastosBasicos:p,gastosOtros:d,amortizaciones:b,ahorroBruto:h,ahorroReal:$,tasaAhorro:A,dti:v,dtiTotal:y,excluyeHipoteca:r,pctNecesidades:I,pctDeseos:f,semAhorro:x(A,a,o),semDTI:S(v,n,s),semNecesidades:S(I,i[0],i[0]+15),semDeseos:S(f,i[1],i[1]+10),semAhorroRegla:x(A,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function mt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function rt(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function Vt(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];a&&o.push({fecha:a,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,i)=>{s.fecha>=a&&o.push({...s,prioridad:i})}),o.sort((s,i)=>i.fecha.localeCompare(s.fecha)||i.prioridad-s.prioridad);const n=o.find(s=>s.fecha<=e);return n?n.saldo:t.saldoInicial||0}else{const n=[...t.historicoSaldos||[]].sort((s,i)=>i.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=e);return n?n.saldo:0}}function Me(t,e){const a=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return a?e.filter(o=>a.includes(o._id)):e.filter(o=>o.activo&&!o.simulacion)}function fa(t,e,a=0){const o=Me(t,e).reduce((n,s)=>n+rt(s),0);return t.usarColchon!==!1?Math.max(0,o-a):o}function Zo(t,e,a){if(!t.targetAmount||t.targetAmount<=0)return null;const o=Me(t,e);if(o.length===0)return null;const n=a.hoy??new Date,s=a.horizonteMeses??120,i=t.usarColchon!==!1,r=o.map(l=>({acc:l,eventos:a.extractoCuenta(l),cursor:0,saldo:rt(l)}));for(let l=1;l<=s;l++){const u=new Date(n.getFullYear(),n.getMonth()+l,1),g=`${u.getFullYear()}-${String(u.getMonth()+1).padStart(2,"0")}`,p=V(new Date(u.getFullYear(),u.getMonth()+1,0));let d=0;for(const h of r){for(;h.cursor<h.eventos.length&&h.eventos[h.cursor].fecha<=p;)h.saldo=h.eventos[h.cursor].saldoAcum??h.saldo,h.cursor++;d+=h.saldo}const b=i?a.colchonEnFecha(p):0;if(d-b>=t.targetAmount)return g}return null}function va(t,e){const a=t.escenarioIds||[];return a.length===0?!0:!!e&&a.includes(e)}function ga(t,e){const a=o=>va(o,e);return{loans:t.loans.filter(a).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}const Ce=t=>t.slice(0,7);function ts(t){const[e,a]=t.split("-").map(Number);return`${a===12?e+1:e}-${String(a===12?1:a+1).padStart(2,"0")}`}function je(t,e,a){if(t.length===0)return[];const o=new Map;for(const u of t)u.saldoAcum!==void 0&&o.set(Ce(u.fecha),u.saldoAcum);const n=t[0];let s=(n.saldoAcum??0)-(n.delta??0);const i=Ce(e||n.fecha),r=Ce(a||t[t.length-1].fecha);if(r<i)return[];const l=[];for(let u=i;u<=r;u=ts(u)){const g=o.get(u);g!==void 0&&(s=g);const[p,d]=u.split("-").map(Number);l.push({x:G(V(new Date(p,d-1,15))).getTime(),mes:u,y:s})}return l}function ze(t,e){let a=null;for(const o of t){if(o.fecha>e)break;o.saldoAcum!==void 0&&(a=o.saldoAcum)}return a}function es(t){const e=a=>!a.simulacion;return{loans:t.loans.filter(e).map(a=>({...a,amortizaciones:(a.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}function as(t){const e=a=>!!a.simulacion;return t.loans.some(a=>e(a)||(a.amortizaciones||[]).some(e))||t.expenses.some(e)||t.nominas.some(e)||t.accounts.some(e)}const gt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ut(t,e){const a=[...e].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=a.length-1;s>=0;s--){const[i,r]=a[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function Fe(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,n=Math.min(2e3,a),s=Math.max(0,a-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function St(t,e){return Fe(t,e).baseImponible}function ba(t,e){return ut(t,e)/12}const jt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Ee(t,e){if(!t||t<=0)return 0;const a=e||jt;let o=0,n=t;for(let s=0;s<a.length;s++){const[i,r]=a[s],l=s<a.length-1?a[s+1][0]:1/0,u=Math.min(n,l-i);if(!(u<=0)&&(o+=u*(r/100),n-=u,n<=0))break}return o}function Rt(t,e){if(mt(t)!=="inversion")return null;const a=rt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,a-o),s=Ee(n,e);return{saldo:a,costBase:o,plusvalia:n,impuesto:s,neto:a-s}}function ue(t,e=new Date){var d;if(mt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=rt(t),n=V(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),s=[...t.aportaciones||[]].sort((b,h)=>b.fecha.localeCompare(h.fecha));let i=0;const r=s.reduce((b,h)=>b+h.cantidad,0);for(const b of s)b.fecha<=n&&(i+=b.cantidad);const l=Math.max(0,o-r),u=r>0?i/r:0,g=Math.min(o,i+l*u),p=Math.max(0,o-g);return{saldo:o,disponible:g,bloqueado:p,costBase:r,beneficio:l,numAportaciones:s.length,proxDesbloqueo:((d=s.find(b=>b.fecha>n))==null?void 0:d.fecha)||null}}function ha(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(mt(t)!=="pension"||!o)return 0;const n=rt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((u,g)=>u+g.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(e*r*o/100).toFixed(2)}function _e(t,e,a){var l;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(e||[]).filter(u=>(u.grupoNomina||"")===o&&u.activo!==!1).reduce((u,g)=>u+(g.bruto||0)*(g.nPagas||12),0),i=[...a||[]].sort((u,g)=>u[0]-g[0]);let r=((l=i[0])==null?void 0:l[1])||19;for(const[u,g]of i)if(s>=u)r=g;else break;return r}const Pe=6.35;function zt(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function ya(t){return Math.max(0,(t.bruto||0)-zt(t))}function os(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function ss(t){const e=t.reduce((i,r)=>i+(r.bruto||0),0),a=t.reduce((i,r)=>i+zt(r),0),o=Math.max(0,e-a),n=St(e,a),s=new Map;for(const i of t)s.set(i._id,o>0?n*(ya(i)/o):0);return s}function Te(t,e,a){if(t.irpfModo==="manual")return ya(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return ut(St(t.bruto||0,zt(t)),a);const o=os(e.filter(i=>i.irpfModo!=="manual")),n=ss(e);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return ut(s+r,a)-ut(s,a);s+=r}return ut(St(t.bruto||0,zt(t)),a)}function ns(t,e){return t.reduce((a,o)=>a+Te(o,t,e),0)}function is(t,e){var n;const a=[...e||[]].sort((s,i)=>s[0]-i[0]);let o=((n=a[0])==null?void 0:n[1])??19;for(const[s,i]of a)if(t>=s)o=i;else break;return o}function xa(t,e){if(!t||t.length===0)return 0;const a=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+zt(s),0);return is(St(a,o),e)}function De(t,e,a){const o=t.bruto||0,n=zt(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??Pe,l=s*(r/100),u=Te(t,e,a);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:l,irpfAnual:u,irpfPct:s>0?u/s*100:0,netoPorPaga:(s-l-u)/i}}function rs(t){const e=new Map,a=[];for(const o of t){const n=o.grupoNomina||"";if(!n){a.push(o);continue}const s=e.get(n)??[];s.push(o),e.set(n,s)}return{grupos:e,sueltas:a}}const Ft=1500;function $a(t){const e=t.cuantia||0,a=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?e*12/a:t.tipoFrecuencia==="diaria"?e*365.25/a:e}const Ut=t=>{const e=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(e)?e:0};function ls(t,e){const a=t.grupoNomina||"";return a?e.filter(o=>(o.grupoNomina||"")===a):null}function Ia(t,e){return t.reduce((a,o)=>a+Te(o,ls(o,t),e),0)}function Aa(t){const{nominas:e,tramosGeneral:a,tramosAhorro:o}=t,n=t.extras??{},s=e.reduce((w,C)=>w+(C.bruto||0),0),i=e.reduce((w,C)=>w+zt(C),0),r=Fe(s,i),l=t.aportacionesPension,u=Ft,g=Math.min(l,u),p=Math.max(0,r.RNT-r.reducArt20-g),d=Ut(n.capInmobiliario),b=Ut(n.capMobiliario),h=Ut(n.gananciasFondos),$=Ut(n.otrasCorto),A=Ut(n.retCapital),m=Math.max(0,p+t.otrosIngresos+d+$),v=Math.max(0,b+h),y=ut(m,a),I=ut(v,o),f=y+I,x=Ia(e,a),S=x+A;return{brutoTotal:s,flexTotal:i,brutoIRPF:r.baseIRPF,cotizSS:r.cotizSS,gastosArt19:r.gastosArt19,RNT:r.RNT,reducArt20:r.reducArt20,aportPP:l,limPP:u,deducPP:g,RNTred:p,otrosIngresos:t.otrosIngresos,capInmobiliario:d,capMobiliario:b,gananciasFondos:h,otrasCorto:$,baseGeneral:m,baseAhorro:v,cuotaGen:y,cuotaAho:I,cuotaIntegra:f,retNomina:x,retCapital:A,totalRet:S,resultado:f-S}}const cs=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:Ft,TRAMOS_AHORRO_DEFAULT:jt,TRAMOS_IRPF_DEFAULT:gt,ajustarFechaPago:ia,ajustarPrecioReal:Ko,calcBaseImponibleTrabajo:St,calcFactorInflacion:pt,calcFondoInversion:Rt,calcFondosPension:ue,calcGananciasCapital:Ee,calcIRPF:ut,calcImpuestoPension:ha,calcInflacionMediaAnual:pa,calcSaludFinanciera:Xo,calcTAE:la,calcTipoMarginalPension:_e,calcTipoRealFisher:ma,calcularDeclaracion:Aa,clampedDate:na,cuentasDelObjetivo:Me,cuotaMensual:Dt,desgloseBaseTrabajo:Fe,diasEntre:de,filtrarPorEscenario:ga,formatEUR:z,formatLocalDate:V,formatPct:ra,fromCents:tt,haySimulaciones:as,ingresoAnual:$a,labelDiaPago:we,lastDayOfMonth:Se,modeloFondoDe:mt,parseLocalDate:G,proyectarFechaCumplimiento:Zo,resolverDiaEfectivo:ce,resumenPrestamo:et,resumenPrestamoConAhorro:ua,retencionMensual:ba,retencionesNomina:Ia,roundMoney:st,saldoEnFecha:Vt,saldoEnFechaExtracto:ze,saldoParaObjetivo:fa,saldoRealCuenta:rt,serieMensual:je,sinSimulaciones:es,tablaAmortizacion:ca,toCents:It,todayISO:J,visibleEnEscenario:va},Symbol.toStringTag,{value:"Module"}));function Yt(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const r=G(i.fechaInicio||e.start),l=i.fechaFin?G(i.fechaFin):s,u=i.cuantia,g=p=>o.push({fecha:p,concepto:i.concepto,cuantia:u,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=l&&g(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const p=Math.max(1,i.frecuencia||1);let d=r.getFullYear(),b=r.getMonth();const h=Math.ceil(240/p)+2;for(let $=0;$<h;$++){const A=ce(d,b,i.diaPago||"")||(()=>{const v=r.getDate(),y=new Date(d,b+1,0).getDate();return V(new Date(d,b,Math.min(v,y)))})(),m=G(A);if(m>s||m>l)break;m>=n&&m>=r&&g(A),b+=p,b>=12&&(d+=Math.floor(b/12),b=b%12)}}else if(i.tipoFrecuencia==="diaria"){const p=Math.max(1,i.frecuencia||1)*864e5;let d=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const b=Math.ceil((n.getTime()-r.getTime())/p);d=new Date(r.getTime()+b*p)}for(;d<=s&&d<=l;)g(V(d)),d=new Date(d.getTime()+p)}}return o}function Sa(t,e,a=null){const o=[];for(const n of t){if(!n.activo||a&&a.length>0&&!a.includes(n.cuenta||"default"))continue;const{tabla:s}=et(n);for(const i of s)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function wa(t,e,a=null,o={accounts:[]}){const n=[],s=G(e.start),i=G(e.end),r=o.accounts||[],l=o.nominas||[],u=o.resolverTramosIRPF||(()=>gt),g=o.resolverTramosGanancias||(()=>jt),p=d=>{var b;return((b=r.find(h=>h._id===d))==null?void 0:b.nombre)??d};for(const d of t){if(!d.activo||d.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(d.cuenta||"default")||a.includes(d.cuentaDestino||"default")))continue;const b=G(d.fechaInicio||e.start),h=d.fechaFin?G(d.fechaFin):i,$=A=>{const m=r.find(F=>F._id===(d.cuenta||"default")),v=r.find(F=>F._id===(d.cuentaDestino||"default")),y=mt(m),I=mt(v),f=y==="inversion"&&I==="inversion"||y==="pension"&&I==="pension",x=["transferencia",...f?["traspaso"]:[],...d.tags||[]],S=f?"traspaso-out":"transfer-out",w=f?"traspaso-in":"transfer-in",C=!a||a.length===0||a.includes(d.cuenta||"default"),j=!a||a.length===0||a.includes(d.cuentaDestino||"default");if(C&&n.push({fecha:A,concepto:`Transf. → ${p(d.cuentaDestino||"default")}: ${d.concepto}`,cuantia:d.cuantia,tipo:"gasto",tags:x,cuenta:d.cuenta||"default",sourceId:d._id,sourceType:S}),j&&n.push({fecha:A,concepto:`Transf. ← ${p(d.cuenta||"default")}: ${d.concepto}`,cuantia:d.cuantia,tipo:"ingreso",tags:x,cuenta:d.cuentaDestino||"default",sourceId:d._id,sourceType:w}),C&&!f&&m){if(y==="inversion"){const F=parseInt(A.slice(0,4)),E=Rt(m,g(F));if(E&&E.saldo>0&&E.plusvalia>0){const M=Math.min(1,d.cuantia/E.saldo),T=E.plusvalia*M*.19;T>.01&&n.push({fecha:A,concepto:`Retención IRPF reembolso ${m.nombre} (19% s/plusvalía)`,cuantia:T,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:d.cuenta||"default",sourceId:d._id,sourceType:"investment-tax"})}}else if(y==="pension"){const F=u(parseInt(A.slice(0,4))),E=_e(m,l,F),M=ha(m,d.cuantia,E||void 0);if(M>0){const P=m.grupoNomina?`IRPF rescate ${m.nombre} (tipo marginal grupo "${m.grupoNomina}": ${E}%)`:`Retención rescate ${m.nombre} (${m.impuestoRetirada}% s/beneficio)`;n.push({fecha:A,concepto:P,cuantia:M,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:d.cuenta||"default",sourceId:d._id,sourceType:"pension-tax"})}}}};if(d.tipoFrecuencia==="extraordinario")b>=s&&b<=i&&b<=h&&$(d.fechaInicio);else if(d.tipoFrecuencia==="mensual"){const A=Math.max(1,d.frecuencia||1);let m=b.getFullYear(),v=b.getMonth();const y=Math.ceil(240/A)+2;for(let I=0;I<y;I++){const f=ce(m,v,d.diaPago||"")||(()=>{const S=b.getDate(),w=new Date(m,v+1,0).getDate();return V(new Date(m,v,Math.min(S,w)))})(),x=G(f);if(x>i||x>h)break;x>=s&&x>=b&&$(f),v+=A,v>=12&&(m+=Math.floor(v/12),v=v%12)}}else if(d.tipoFrecuencia==="diaria"){const A=Math.max(1,d.frecuencia||1)*864e5;let m=new Date(Math.max(b.getTime(),s.getTime()));if(b<s){const v=Math.ceil((s.getTime()-b.getTime())/A);m=new Date(b.getTime()+v*A)}for(;m<=i&&m<=h;)$(V(m)),m=new Date(m.getTime()+A)}}return n}function Ma(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){const r=mt(i);if(r==="cuenta"||!i.activo)continue;const l=i.planAportaciones||[];for(const u of l){if(!u.importe||u.importe<=0)continue;const g=G(u.fechaInicio||e.start),p=u.fechaFin?G(u.fechaFin):s,d=u.cuentaOrigen||"default",b=!a||!a.length||a.includes(d),h=!a||!a.length||a.includes(i._id),$=r==="pension"?"pension":"capital-mobiliario",A=f=>{b&&o.push({fecha:f,concepto:`Aportación → ${i.nombre}`,cuantia:u.importe,tipo:"gasto",tags:["aportacion","transferencia",$],cuenta:d,sourceId:u._id,sourceType:"aportacion-out"}),h&&o.push({fecha:f,concepto:`Aportación ${i.nombre} (${u.periodicidad||"mensual"})`,cuantia:u.importe,tipo:"ingreso",tags:["aportacion","transferencia",$],cuenta:i._id,sourceId:u._id,sourceType:"aportacion-in"})},m={mensual:1,trimestral:3,semestral:6,anual:12}[u.periodicidad||"mensual"]||1;let v=g.getFullYear(),y=g.getMonth();const I=Math.ceil(240/m)+2;for(let f=0;f<I;f++){const x=new Date(v,y+1,0).getDate(),S=V(new Date(v,y,Math.min(g.getDate(),x))),w=G(S);if(w>s||w>p)break;w>=n&&w>=g&&A(S),y+=m,y>=12&&(v+=Math.floor(y/12),y=y%12)}}}return o}function Ca(t,e,a=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||a&&a.length>0&&!a.includes(s._id))continue;const i=G(e.start),r=G(e.end),l=s.periodoCobro||"mensual",u=l==="mensual",g=u?null:{diario:864e5,semanal:7*864e5}[l]||864e5,p=u?1/12:g/(365.25*864e5);let d=Vt(s,e.start);const b=o.filter(A=>A.cuenta===s._id).map(A=>({fecha:A.fecha,delta:A.tipo==="ingreso"?Math.abs(A.cuantia):-Math.abs(A.cuantia)})).sort((A,m)=>A.fecha.localeCompare(m.fecha));let h=0,$=new Date(i);for(;$<=r;){const A=u?new Date($.getFullYear(),$.getMonth()+1,$.getDate()):new Date($.getTime()+g),m=new Date(Math.min(A.getTime(),r.getTime()+1)),v=V(m);let y=0;for(;h<b.length&&b[h].fecha<v;)y+=b[h].delta,h++;const I=d,f=d+y,x=Math.max(0,(I+f)/2);d=f;const S=u?p:(m.getTime()-$.getTime())/(365.25*864e5),w=x*(Math.pow(1+s.interes/100,S)-1);w>.001&&n.push({fecha:V($),concepto:`Interés ${s.nombre}`,cuantia:w,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),$=A}}return n}function ja(t,e,a,o=null){const n=[],s=e||gt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),l=ba(r,s),u={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:l,tags:["irpf","fiscal"]};n.push(...Yt([u],a,o))}return n}const ds=[5,11,2,8],us={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function za(t,e,a=null,o=[],n=()=>gt){const s=[],i=G(e.start),r=G(e.end),l=o.length>0,u={};for(const d of t){const b=d.grupoNomina||"";u[b]||(u[b]=[]),u[b].push(d)}for(const d of Object.keys(u))u[d].sort((b,h)=>(h.bruto||0)-(b.bruto||0));function g(d,b){if(!l||!d.mesActualizacionIPC)return d.bruto||0;const h=d.fechaInicio||e.start,$=G(h),A=G(b);let m=0;for(let y=$.getFullYear();y<=A.getFullYear();y++){const I=new Date(y,d.mesActualizacionIPC-1,1);I>$&&I<=A&&m++}if(m===0)return d.bruto||0;const v=V(new Date($.getFullYear()+m,0,1));return(d.bruto||0)*pt(o,h,v)}function p(d,b){const h=g(d,b),$=(d.retribucionFlexible||[]).reduce((F,E)=>F+(E.importe||0)*12,0),A=Math.max(0,h-$);if(d.irpfModo==="manual")return A*((d.irpfPct||0)/100);const m=n(parseInt(b.slice(0,4))),v=d.grupoNomina||"";if(!v)return ut(St(h,$),m);const y=u[v].filter(F=>F.activo),I=y.reduce((F,E)=>F+g(E,b),0),f=y.reduce((F,E)=>F+(E.retribucionFlexible||[]).reduce((M,P)=>M+(P.importe||0)*12,0),0),x=Math.max(0,I-f),S=St(I,f),w=Math.max(0,h-$),C=x>0?S*(w/x):0,j=y.filter(F=>F._id!==d._id&&(F.bruto||0)>(d.bruto||0)).reduce((F,E)=>{const M=(E.retribucionFlexible||[]).reduce((T,D)=>T+(D.importe||0)*12,0),P=Math.max(0,g(E,b)-M);return F+(x>0?S*(P/x):0)},0);return ut(j+C,m)-ut(j,m)}for(const d of t){if(!d.activo)continue;const b=d.cuenta||"default";if(a&&a.length>0&&!a.includes(b))continue;const h=Math.max(1,d.nPagas||12),$=G(d.fechaInicio||e.start),A=d.fechaFin?G(d.fechaFin):r,m=v=>{const y=g(d,v),I=p(d,v),f=(d.retribucionFlexible||[]).reduce((M,P)=>M+(P.importe||0)*12,0),x=Math.max(0,y-f),S=(d.ssPct??6.35)/100,w=x*S,C=x/h,j=I/h,F=w/h,E=d.representacion==="simplificado"?C-F-j:C;s.push({fecha:v,concepto:d.nombre,cuantia:E,tipo:"ingreso",cuenta:b,tags:d.tags||[],sourceId:d._id,sourceType:"nomina"}),d.representacion==="detallado"&&(F>0&&s.push({fecha:v,concepto:`SS ${d.nombre}`,cuantia:F,tipo:"gasto",cuenta:b,tags:["seguridad-social","fiscal"],sourceId:d._id+"_ss",sourceType:"nomina"}),j>0&&s.push({fecha:v,concepto:`IRPF ${d.nombre}`,cuantia:j,tipo:"gasto",cuenta:b,tags:["irpf","fiscal"],sourceId:d._id+"_irpf",sourceType:"nomina"}));for(const M of d.retribucionFlexible||[])!M.cuenta||!(M.importe>0)||a&&a.length>0&&!a.includes(M.cuenta)||s.push({fecha:v,concepto:`${d.nombre} — ${us[M.tipo]||M.tipo}`,cuantia:M.importe,tipo:"ingreso",cuenta:M.cuenta,tags:["retribucion-flexible",M.tipo],sourceId:`${d._id}_flex_${M._id||M.tipo}`,sourceType:"nomina"})};if(h<=12){const v=h===12?1:Math.round(12/h),y=$.getDate();let I=$.getFullYear(),f=$.getMonth();for(let x=0;x<300;x++){const S=new Date(I,f+1,0).getDate(),w=new Date(I,f,Math.min(y,S));if(w>r||w>A)break;w>=i&&w>=$&&m(V(w)),f+=v,f>=12&&(I+=Math.floor(f/12),f=f%12)}}else{const v=h-12,y=$.getDate();let I=$.getFullYear(),f=$.getMonth();for(let w=0;w<300;w++){const C=new Date(I,f+1,0).getDate(),j=new Date(I,f,Math.min(y,C));if(j>r||j>A)break;j>=i&&j>=$&&m(V(j)),f++,f>=12&&(I++,f=0)}const x=Math.max($.getFullYear(),i.getFullYear()),S=Math.min((d.fechaFin?A:r).getFullYear(),r.getFullYear());for(let w=x;w<=S;w++)for(const C of ds.slice(0,v)){const j=new Date(w,C,15);j>=i&&j<=r&&j>=$&&j<=A&&m(V(j))}}}return s}function Fa(t,e,a,o=null,n="default"){const s=[];if(!e||e.length===0)return s;const i=G(a.start),r=G(a.end),l=J(),u=t.filter(p=>p.activo&&p.tipo==="gasto"&&p.tipoFrecuencia==="mensual");let g=new Date(i.getFullYear(),i.getMonth(),1);for(;g<=r;){const p=g.getFullYear(),d=g.getMonth(),b=p+"-"+String(d+1).padStart(2,"0"),h=b+"-01",$=V(new Date(p,d+1,0)),A=V(new Date(p,d,15));let m=0;for(const v of u){if(o&&o.length>0&&!o.includes(v.cuenta||"default")||v.fechaInicio&&v.fechaInicio>$||v.fechaFin&&v.fechaFin<h)continue;const y=v.fechaInicio||l,I=pt(e,y,A);if(I<=1)continue;const f=Math.max(1,v.frecuencia||1);m+=v.cuantia*(I-1)/f}m>.01&&s.push({fecha:A,concepto:"Incremento coste de vida",cuantia:m,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+b,sourceType:"inflacion"}),g=new Date(p,d+1,1)}return s}function Ea(t,e,a,o="default"){const n=[];if(!e||e.length===0||t<=0)return n;const s=G(a.start),i=G(a.end),r=[...e].sort((u,g)=>u.year-g.year);let l=new Date(s.getFullYear(),s.getMonth(),1);for(;l<=i;){const u=l.getFullYear(),g=l.getMonth(),p=u+"-"+String(g+1).padStart(2,"0"),d=V(new Date(u,g,15)),b=r.filter(v=>v.year<=u),h=b.length>0?b[b.length-1]:r[0],$=h?h.tasa/100:0,A=Math.pow(1+$,1/12)-1,m=t*A;m>.01&&n.push({fecha:d,concepto:"Pérdida ahorro por inflación",cuantia:m,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+p,sourceType:"inflacion"}),l=new Date(u,g+1,1)}return n}function _a(t,e,a){const o=a.fechaReferencia||a.dashboardStart,n=o<a.dashboardStart?a.dashboardStart:o>a.dashboardEnd?a.dashboardEnd:o,s=e.reduce((p,d)=>p+Vt(d,n),0),i=t.filter(p=>p.fecha<n),r=t.filter(p=>p.fecha>=n),l=[];let u=s;for(const p of[...i].reverse()){const d=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);l.unshift({...p,delta:d,saldoAcum:u}),u-=d}const g=[];u=s;for(const p of r){const d=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);u+=d,g.push({...p,delta:d,saldoAcum:u})}return[...l,...g]}function ps(t,e,a,o=null){const n=e.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return _a([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,a)}function Jt(t){const{loans:e,expenses:a,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],l={start:n.dashboardStart,end:n.dashboardEnd},u=a.filter($=>$.tipo!=="transferencia"),g=a.filter($=>$.tipo==="transferencia"),p={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let d=[];d=d.concat(Yt(u,l,s)),d=d.concat(Sa(e,l,s)),d=d.concat(wa(g,l,s,p)),d=d.concat(Ma(o,l,s));const b=Ca(o,l,s,d);if(d=d.concat(b),d=d.concat(ja(a,n.tramos_irpf,l,s)),d=d.concat(za(i,l,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const $=(o.find(v=>v.activo&&v.esCuentaPrincipal)||o.find(v=>v.activo)||{_id:"default"})._id;d=d.concat(Fa(u,r,l,s,$));const m=o.filter(v=>v.activo&&(!s||s.length===0||s.includes(v._id))).reduce((v,y)=>v+Vt(y,n.dashboardStart),0);d=d.concat(Ea(m,r,l,$))}d.sort(($,A)=>$.fecha.localeCompare(A.fecha));const h=o.filter($=>$.activo&&(!s||s.length===0||s.includes($._id)));return _a(d,h,n)}function ms(t,e,a=null){const o=J(),s=e.filter(r=>r.activo&&(!a||a.length===0||a.includes(r._id))).reduce((r,l)=>r+rt(l),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function Pa(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])a.set(n,(a.get(n)||0)+Math.abs(o.cuantia));return a}function fs(t,e){const a=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${z(i)}) a partir del ${s.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${z(i)} < ${z(e)}) desde ${s.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${z(i)})`})))}return a}function vs(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=G(e.dashboardStart),n=G(e.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return a/s}function gs(t,e,a=J()){const o=new Set,n=e.map(r=>{const l=r.fechaInicialSaldo||"",u={};l&&l<=a&&(u[l]=r.saldoInicial||0);for(const g of r.historicoSaldos||[])g.fecha<=a&&(!l||g.fecha>=l)&&(u[g.fecha]=g.saldo);return Object.keys(u).forEach(g=>o.add(g)),u}),s={};for(const r of[...o].sort()){let l=0;for(let u=0;u<e.length;u++){const g=Object.entries(n[u]).filter(([p])=>p<=r);g.length>0?(g.sort(([p],[d])=>d.localeCompare(p)),l+=g[0][1]):l+=e[u].saldoInicial||0}s[r]=l}const i=[];for(const[r,l]of Object.entries(s).sort(([u],[g])=>u.localeCompare(g))){const u=t.filter(b=>b.fecha<=r),g=u.length>0?u[u.length-1].saldoAcum:null;if(g===null)continue;const p=l-g,d=g!==0?p/Math.abs(g)*100:0;i.push({cuenta:"Total",fecha:r,estimado:g,real:l,desv:p,pct:d})}return i}const bs=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:gs,detectarPuntosCriticos:fs,mediaMensualGastos:vs},Symbol.toStringTag,{value:"Module"}));function Wt(t,e=new Date){const a=V(e),o=new Date(e);o.setMonth(o.getMonth()+1);const n=V(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Yt(s,{start:a,end:n}).reduce((r,l)=>r+Math.abs(l.cuantia),0)}function Re(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+Dt(a.capital,a.tin,a.meses),0)}function Ta(t,e,a,o){return e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0?e.colchonFijo:(Wt(t,o)+Re(a))*(e.colchonMeses||6)}function Da(t,e,a,o,n){const i=[...e.colchonPuntos||[]].sort((l,u)=>l.fecha.localeCompare(u.fecha)).filter(l=>l.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(Wt(t,n)+Re(a))*(i.meses||6):Ta(t,e,a,n)}function pe(t,e,a,o,n,s=!1,i){const r=[...t.puntos||[]].sort((g,p)=>g.fecha.localeCompare(p.fecha)),l=r.filter(g=>g.fecha<=n).pop()||(s?r[0]:null);return l?l.tipo==="fijo"?l.importe||0:(Wt(e,i)+Re(o))*(l.meses||1):0}function hs(t,e){const a={};for(const o of e)a[o._id]=rt(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=o.cuantia),{fecha:o.fecha,saldos:{...a}}))}function ys(t,e,a,o,n,s,i){const r=[];for(const l of(t||[]).filter(u=>u.activo!==!1)){let u=!1;for(let g=0;g<e.length;g++){const p=e[g],d=pe(l,o,n,s,p.fecha,!1,i);if(d<=0){u=!1;continue}const b=!l.cuentas||l.cuentas.length===0?p.saldoAcum:l.cuentas.reduce((h,$)=>{var A,m;return h+(((m=(A=a[g])==null?void 0:A.saldos)==null?void 0:m[$])||0)},0);b<d&&!u?(u=!0,r.push({tipo:"bajo_margen",fecha:p.fecha,saldo:b,target:d,nombre:l.nombre,mensaje:`⚠ ${l.nombre}: ${z(b)} < ${z(d)} desde ${p.fecha}`})):b>=d&&u&&(u=!1,r.push({tipo:"recuperacion_margen",fecha:p.fecha,saldo:b,target:d,nombre:l.nombre,mensaje:`✓ ${l.nombre}: recuperado el ${p.fecha}`}))}}return r}const xs=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Ta,calcColchonEnFecha:Da,calcGastoBasicoMensual:Wt,calcMargenEnFecha:pe,detectarCrucesMargenes:ys,saldosPorCuentaEnExtracto:hs},Symbol.toStringTag,{value:"Module"}));class $s extends Error{constructor(a,o){super(`La funcionalidad "${a}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);Jo(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=a}}let Qt=null;function Is(t){const e=Qt;return Qt=t,()=>{Qt=e}}function Ra(t){return Qt?Qt(t):!0}function Oa(t,e){if(!Ra(t))throw new $s(t,e)}const Na=[];function Oe(){const t=new Map,e=new WeakMap;let a=1,o=0,n=0;const s=l=>{if(!l||typeof l!="object")return 0;const u=e.get(l);if(u)return u;const g=a++;return e.set(l,g),g},i=l=>l.map(u=>[u._id,u.capital,u.tin,u.meses,u.fechaInicio,u.comisionAmort||0,u.comisionApertura||0,u.diaPago||"",u.activo?1:0,u.cuenta||"",(u.amortizaciones||[]).map(g=>`${g.fecha}:${g.cantidad}:${g.tipo||""}`).sort().join(",")].join("|")).join(";");function r(l){const u=[i(l.loans),s(l.expenses),s(l.accounts),s(l.nominas),s(l.inflacionPeriodos),l.config.dashboardStart,l.config.dashboardEnd,l.config.fechaReferencia||"",l.config.usarInflacion?1:0,(l.filtroAccounts||[]).join(",")].join("#"),g=t.get(u);if(g)return n++,g;o++;const p=Jt(l);return t.set(u,p),p}return{statement:r,stats:()=>({hits:n,misses:o}),clear:()=>t.clear()}}function Ne(t,e,a,o,n={},s=Oe()){Oa("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:r=36,minAmortizable:l=500,tipoAmort:u="plazo",fechaPrimeraAmort:g=null,loanIds:p=null,nominas:d=Na,sourceAccountId:b=null,selectedMarginIds:h=null,hoy:$=new Date}=n,A=V($),m=Math.min(120,Math.max(1,r)),v=a.filter(O=>O.activo),y=v.map(O=>O._id),I=v.find(O=>O.esCuentaPrincipal)||v[0],f=b&&y.includes(b)?v.find(O=>O._id===b):I,x=f==null?void 0:f._id,S=t.filter(O=>O.activo&&!O.simulacion&&(!p||p.includes(O._id))).sort((O,H)=>H.tin-O.tin),w=!!h&&h.length>0,C=(o.margenesSeguridad||[]).filter(O=>O.activo!==!1).filter(O=>!O.cuentas||O.cuentas.length===0||O.cuentas.includes(x)).filter(O=>!w||h.includes(O._id));if(S.length===0)return{plan:[],margenesAplicados:C.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const j={};for(const O of S)j[O._id]=[];const F=[];function E(O){const H=new Date($.getFullYear(),$.getMonth()+O,1),U=H.getFullYear(),W=H.getMonth(),Q=`${U}-${String(W+1).padStart(2,"0")}`,ot=V(new Date(U,W,Math.min(15,new Date(U,W+1,0).getDate())));return{label:Q,dia15:ot}}function M(O,H){const U=[...O.amortizaciones||[],...j[O._id]],{tabla:W}=et({...O,amortizaciones:U}),Q=W.filter(nt=>nt.fecha<=H);if(Q.length>0)return Q[Q.length-1].capitalPendiente;const ot=U.filter(nt=>nt.fecha<=H).reduce((nt,vt)=>nt+vt.cantidad,0);return Math.max(0,O.capital-ot)}function P(O){const H=t.map(it=>({...it,amortizaciones:[...it.amortizaciones||[],...j[it._id]||[]]})),U={...o,dashboardStart:A,dashboardEnd:O},W=s.statement({loans:H,expenses:e,accounts:a,config:U,filtroAccounts:null,nominas:d}),Q=v.reduce((it,Gt)=>it+rt(Gt),0),ot=f?rt(f):0,nt=Q>0?ot/Q:1;let vt=ot,re=Q;for(const it of W){const Gt=it.delta??(it.tipo==="ingreso"?Math.abs(it.cuantia):-Math.abs(it.cuantia));it.cuenta===x?vt+=Gt:y.includes(it.cuenta)||(vt+=Gt*nt),re=it.saldoAcum}return{source:vt,total:re}}function T(O){const{source:H}=P(O);if(H<=0)return H;let U=0;for(const W of C){const Q=pe(W,e,o,t,O,!0,$);Q>U&&(U=Q)}return H-U}const D=2;let N=0;if(g){for(let O=0;O<m;O++)if(E(O).dia15>=g){N=O;break}}for(let O=0;O<m;O++){if((O-N)%i!==0||O<N)continue;const{label:H,dia15:U}=E(O);if(U<A)continue;const W=T(U)-D;if(W<l)continue;let Q=W,ot=0;for(const nt of S){if(Q<l)break;const vt=M(nt,U);if(vt<1)continue;const re=nt.comisionAmort||0,it=1+re/100,Gt=Math.floor(Q/it),Uo=Math.min(Gt,vt);if(Uo<l)continue;const le=Math.min(Math.floor(Uo),Math.floor(vt)),Yo=+(le*re/100).toFixed(2),sa=le+Yo;sa>Q||(j[nt._id].push({_id:`opt_${H}_${nt._id}`,fecha:U,cantidad:le,tipo:u,simulacion:!0}),ot+=sa,F.push({mes:H,fechaAmort:U,loanId:nt._id,loanNombre:nt.nombre,tin:nt.tin,capitalAntes:vt,cantidadAmort:le,comision:Yo,capitalDespues:Math.max(0,vt-le),saldoDisponible:W+D,excedente:W,saldoDespues:W+D-ot,tipoAmort:u}),Q-=sa)}}const _=F.reduce((O,H)=>O+H.cantidadAmort,0),k=F.reduce((O,H)=>O+H.comision,0),L=S.map(O=>{const H=j[O._id];if(!H.length)return null;const U=et(O),W=et({...O,amortizaciones:[...O.amortizaciones||[],...H]});return{loanId:O._id,nombre:O.nombre,tin:O.tin,fechaFinSin:U.fechaFin,fechaFinCon:W.fechaFin,mesesAhorrados:U.mesesReales-W.mesesReales,interesesSin:U.totalIntereses,interesesCon:W.totalIntereses,ahorroIntereses:U.totalIntereses-W.totalIntereses,numAmortizaciones:H.length,totalAmortizado:H.reduce((Q,ot)=>Q+ot.cantidad,0)}}).filter(O=>O!==null),B=L.reduce((O,H)=>O+H.ahorroIntereses,0);return{plan:F,margenesAplicados:C.length,totalAmortizado:_,totalComisiones:k,totalAhorroIntereses:B,resumenPorLoan:L}}function qa(t,e,a,o,n={},s){Oa("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:r=500,tipoAmort:l="plazo",fechaObjetivo:u=null,frecuencias:g=[1,2,3,6,12],fechaPrimeraAmort:p=null,loanIds:d=null,nominas:b=Na,sourceAccountId:h=null,selectedMarginIds:$=null,hoy:A=new Date}=n,m=s??Oe(),v=V(A),y=u||V(new Date(A.getFullYear(),A.getMonth()+i,1));function I(S){const w=t.map(E=>({...E,amortizaciones:[...E.amortizaciones||[],...S[E._id]||[]]})),C={...o,dashboardStart:v,dashboardEnd:y},j=m.statement({loans:w,expenses:e,accounts:a,config:C,filtroAccounts:null,nominas:b});if(j.length===0)return a.filter(E=>E.activo).reduce((E,M)=>E+rt(M),0);const F=j.filter(E=>E.fecha<=y);return F.length>0?F[F.length-1].saldoAcum:j[0].saldoAcum}const f=I({}),x=g.map(S=>{const w=Ne(t,e,a,o,{frecuencia:S,mesesHorizonte:i,minAmortizable:r,tipoAmort:l,fechaPrimeraAmort:p,loanIds:d,nominas:b,sourceAccountId:h,selectedMarginIds:$,hoy:A},m),C={};for(const F of t)C[F._id]=[];for(const F of w.plan)C[F.loanId].push({_id:F.mes+"_"+F.loanId,fecha:F.fechaAmort,cantidad:F.cantidadAmort,tipo:l,simulacion:!0});const j=I(C);return{frecuencia:S,label:S===1?"Mensual":`Cada ${S} meses`,numAmortizaciones:w.plan.length,totalAmortizado:w.totalAmortizado,totalComisiones:w.totalComisiones,ahorroIntereses:w.totalAhorroIntereses,saldoObjetivo:j,gananciaSaldo:j-f,valorTotal:w.totalAhorroIntereses+(j-f),plan:w.plan,resumenPorLoan:w.resumenPorLoan}}).filter(S=>S.numAmortizaciones>0);if(x.length>0){const S=Math.max(...x.map(j=>j.ahorroIntereses)),w=Math.max(...x.map(j=>j.saldoObjetivo)),C=Math.max(...x.map(j=>j.valorTotal));x.forEach(j=>{j.esMejorIntereses=j.ahorroIntereses===S,j.esMejorSaldo=j.saldoObjetivo===w,j.esMejorValor=j.valorTotal===C})}return{resultados:x,saldoBase:f,fechaObjetivo:y}}const As=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:qa,createStatementMemo:Oe,defaultHoyISO:J,optimizarAmortizaciones:Ne},Symbol.toStringTag,{value:"Module"})),Ss=30.44*864e5;function La(t){const e=t.getFullYear(),a=t.getMonth();return{desde:V(new Date(e,a,1)),hasta:V(new Date(e,a,Se(e,a)))}}function ka(t){const[e,a]=t.split("-").map(Number);return La(new Date(e,a-1,1))}function ws(t,e){return Math.max(1,(G(e).getTime()-G(t).getTime())/Ss)}const Ms=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),wt=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function Cs(t,e){const a=new Map(e.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=a.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function js(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=d=>d.sourceType==="loan"&&d.tipo==="gasto",n=e.loanIdsIniciados,s=wt(t.filter(d=>d.tipo==="ingreso")),i=wt(t.filter(d=>o(d)&&(!n||n.has(d.sourceId??"")))),r=wt(t.filter(d=>o(d)&&e.hipotecaIds.has(d.sourceId??""))),l=wt(t.filter(d=>d.sourceType==="loan-amort")),u=wt(t.filter(d=>d.sourceType==="account-interest")),{basicos:g,deseo:p}=Cs(t,e.expenses);return{ingresos:s/a,cuotas:i/a,cuotasHipoteca:r/a,amortizaciones:l/a,gastosBasicos:g/a,gastosDeseo:p/a,gastosTotales:(i+g+p)/a,intereses:u/a}}function Ba(t,e){return t.reduce((a,o)=>{const n=et(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=e);return a+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function zs(t,e,a,o){const n=t.filter(u=>u.activo&&!u.simulacion&&(u.fechaInicio||"")<=a),s=n.reduce((u,g)=>{if((g.amortizaciones||[]).filter(h=>h.fecha>=e&&h.fecha<=a).length===0)return u;const d=et(g).totalIntereses,b=et({...g,amortizaciones:(g.amortizaciones||[]).filter(h=>h.fecha<e||h.fecha>a)}).totalIntereses;return u+Math.max(0,b-d)},0),i=n.filter(u=>u.mostrarFechaFinEnDashboard!==!1).map(u=>({loan:u,fechaFin:et(u).fechaFin})).filter(u=>!!u.fechaFin&&u.fechaFin>=e&&u.fechaFin<=a),r=n.map(u=>et(u).tabla),l=u=>{const{desde:g,hasta:p}=ka(u);return r.reduce((d,b)=>{const h=b.find($=>!$.esAmortizacion&&$.fecha>=g&&$.fecha<=p);return d+(h?h.cuota:0)},0)};return{deudaInicio:Ba(n,e),deudaFin:Ba(n,a),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:l(e.slice(0,7)),cuotasFin:l(a.slice(0,7)),finEnPeriodo:i}}function Fs(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:wt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function Ha(t,e=new Set,a="desglosado"){if(e.size===0)return Pa(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(u=>e.has(u)),r=s.filter(u=>!e.has(u)),l=a==="porgrupos"&&i.length>0?i:r;for(const u of l)o.set(u,(o.get(u)||0)+Math.abs(n.cuantia))}return o}function Es(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...Ha(t,e.grupoTags,e.modo).entries()].filter(([n])=>!a||a.size===0||a.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function _s(t,e){const a=e.reduce((o,n)=>o+rt(n),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:wt(t.filter(o=>o.tipo==="gasto")),totalIngresos:wt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Ps(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function Ts(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function Ds(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}function Rs(t,e){if(t.length===0)return[];const a=u=>e==="mes"?u.slice(0,7):u.slice(0,4),o=u=>e==="mes"?`${u}-01`:`${u}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let l=null;for(const u of t){const g=a(u.fecha),p=u.saldoAcum??i;(!l||l.periodo!==g)&&(l&&(i=l.cierre),l={periodo:g,inicio:o(g),apertura:i,cierre:p,maximo:Math.max(i,p),minimo:Math.min(i,p),eventos:0},r.push(l)),l.cierre=p,p>l.maximo&&(l.maximo=p),p<l.minimo&&(l.minimo=p),l.eventos+=1}return r}const Os=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Rs,cuentasVisibles:Ps,gastoPorTagOrdenado:Es,idsHipoteca:Ts,idsPrestamosIniciados:Ds,interesesPorCuenta:Fs,mesesDelPeriodo:ws,metricasFlujo:js,rangoMes:ka,rangoMesDe:La,resumenPrestamosPeriodo:zs,sinTransferencias:Ms,sumarGastosPorTag:Ha,totalesPeriodo:_s},Symbol.toStringTag,{value:"Module"}));function Ns(t,e,a){const o=t||[];if(!o.length)return e;const n=o.find(i=>i.año===a);if(n)return n.tramos;const s=o.filter(i=>i.año<a).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:e}function bt(t,e){return a=>Ns(t,e,a)}const Kt=8,Ga=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Va=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function qe(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}function Ua(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Ga,tramosGananciasCapital:Va,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function qs(t,e){return{loans:[],expenses:[],accounts:[qe(t)],nominas:[],goals:[],planes:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],config:Ua(t,e)}}const ht=t=>Array.isArray(t)?t:[],Ls=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Xt(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function Ya(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function Le(t){const{varianza:e,inflacion:a,...o}=t;return o}function ks(t,e){const{hoyISO:a,finISO:o}=e,n={...t},s=Ls(t.config),r={...Ua(a,o)};for(const[g,p]of Object.entries(s))p!=null&&(r[g]=p);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=Ga),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=Va),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let l=ht(t.accounts).map(g=>{const p={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...g};return p.modeloFondo||(p.modeloFondo=p.esFondoPension?"pension":"cuenta"),delete p.esFondoPension,Array.isArray(p.historicoSaldos)||(p.historicoSaldos=[]),Xt(p)});l.length===0&&(l=[qe(a)]);const u=l.filter(g=>g.esCuentaPrincipal);if(u.length===0){const g=l.find(p=>p._id==="default")||l[0];l=l.map(p=>({...p,esCuentaPrincipal:p._id===g._id}))}else if(u.length>1){let g=!1;l=l.map(p=>p.esCuentaPrincipal?g?{...p,esCuentaPrincipal:!1}:(g=!0,p):p)}return n.accounts=l,n.expenses=ht(t.expenses).map(g=>{const p={basico:!1,activo:!0,tags:[],historialPrecios:[],...g};return Array.isArray(p.tags)||(p.tags=[]),Array.isArray(p.historialPrecios)||(p.historialPrecios=[]),p.diaPago=Ya(p.diaPago),Le(Xt(p))}),n.loans=ht(t.loans).map(g=>{const p={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...g};return Array.isArray(p.tags)||(p.tags=[]),p.diaPago=Ya(p.diaPago),p.amortizaciones=ht(p.amortizaciones).map(d=>Xt(d)),Le(Xt(p))}),n.nominas=ht(t.nominas).map(g=>{const p={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...g};return Array.isArray(p.tags)||(p.tags=[]),Array.isArray(p.retribucionFlexible)||(p.retribucionFlexible=[]),Le(Xt(p))}),n.goals=ht(t.goals).map((g,p)=>{const d=Array.isArray(g.cuentaIds)?g.cuentaIds:g.cuentaId?[g.cuentaId]:[],{cuentaId:b,...h}=g;return{prioridad:p+1,completado:!1,usarColchon:!0,targetAmount:0,...h,cuentaIds:d}}),n.inflacion=ht(t.inflacion),n.tramosIRPFHistorico=ht(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=ht(t.tramosGananciasCapitalHistorico),n.escenarios=ht(t.escenarios).map(({inversiones:g,...p})=>p),n}const Ot=t=>Array.isArray(t)?t:[];let ke=0;function Bs(t){return ke+=1,`${t}_${ke.toString(36)}`}const Hs=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Gs=t=>typeof t=="number"&&Number.isFinite(t);function Vs(t,e){const a={...t};ke=0;const o=Ot(t.transacciones),n=Ot(t.puntosControl),s=[...n],i=new Set(n.map(u=>`${u.cuentaId}|${u.fecha}`)),r=(u,g,p,d)=>{if(!Hs(g)||!Gs(p))return;const b=`${u}|${g}`;i.has(b)||(i.add(b),s.push({_id:Bs("pc"),fecha:g,cuentaId:u,saldoCts:It(p),...typeof d=="string"&&d?{nota:d}:{}}))};for(const u of Ot(t.accounts)){const g=typeof u._id=="string"?u._id:null;if(g)for(const p of Ot(u.historicoSaldos))r(g,p.fecha,p.saldo,p.nota)}const l=Ot(t.history);if(l.length>0){const u=Ot(t.accounts),g=u.find(d=>d.esCuentaPrincipal)||u.find(d=>d.activo)||u[0],p=typeof(g==null?void 0:g._id)=="string"?g._id:"default";for(const d of l){const b=typeof d.cuenta=="string"?d.cuenta:typeof d.cuentaId=="string"?d.cuentaId:p;r(b,d.fecha,d.saldo,d.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=s.sort((u,g)=>String(u.fecha).localeCompare(String(g.fecha))),a}const Be=t=>Array.isArray(t)?t:[],Us=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Ys=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let He=0;function Js(){return He+=1,`tx_hp_${He.toString(36)}`}function Ws(t,e){const a={...t};He=0;const o=[...Be(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Be(t.expenses).map(i=>{const r=Be(i.historialPrecios),l=typeof i._id=="string"?i._id:null,u=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",g=i.tipo==="ingreso"?"ingreso":"gasto",p=Array.isArray(i.tags)?i.tags.filter(h=>typeof h=="string"):[];if(l)for(const h of r){if(!h||!Us(h.fecha)||!Ys(h.cuantia))continue;const $=g==="ingreso"?It(h.cuantia):-It(h.cuantia),A=`${l}|${h.fecha}|${$}`;n.has(A)||(n.add(A),o.push({_id:Js(),fecha:h.fecha,cuentaId:u,importeCts:$,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:p,estimacionId:l,tipo:g,origen:"importado",nota:typeof h.nota=="string"&&h.nota?h.nota:"Importado del historial de precios"}))}const{historialPrecios:d,...b}=i;return b});return a.expenses=s,a.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),a}const Ja=t=>Array.isArray(t)?t:[],Mt=(t,e="")=>typeof t=="string"&&t.trim()?t:e,Nt=(t,e=0)=>typeof t=="number"&&Number.isFinite(t)?t:e,Qs=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function Ks(t,e){var g;const a={...t};if(Array.isArray(a.planes))return a;const o=Ja(a.goals),n=Ja(a.accounts),s=n.map(p=>{const d=Nt(p.bloqueoMeses,0);return{_id:`veh_${Mt(p._id,"x")}`,nombre:Mt(p.nombre,"Cuenta"),rentabilidadRealAnual:Nt(p.interes,0)/100,liquidez:p.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":d>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Nt(p.impuestoRetirada,0)/100,topeAportacionAnual:p.modeloFondo==="pension"?It(1500):null,riesgo:p.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:Mt(p._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Nt(p.interes,0)>0}}),i=new Map(n.map((p,d)=>[Mt(p._id,""),s[d]._id])),r=((g=s[0])==null?void 0:g._id)??"",l=o.map((p,d)=>{const b=Array.isArray(p.cuentaIds)?p.cuentaIds.map($=>Mt($,"")):[],h=Qs(p.targetDate);return{_id:Mt(p._id,`obj_mig_${d}`),nombre:Mt(p.nombre,`Objetivo ${d+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:It(Nt(p.targetAmount,0)),fechaLimite:h,prioridad:Nt(p.prioridad,d+1),modoAsignacion:h?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(b[0])??r,saldoActual:0,estado:p.completado===!0?"COMPLETADO":"PENDIENTE",notas:Mt(p.notas,"")}}),u={_id:"plan_base",nombre:"Plan base",fechaInicio:e.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:l,eventos:[],creadoEn:e.hoyISO};return a.planes=[u],a}const Xs=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:ks},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Vs},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:Ws},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:Ks}],Zs=["history"];function Wa(t,e,a){let o=t;const n=[];for(const s of[...Xs].sort((i,r)=>i.version-r.version))(e??0)>=s.version||(o=s.migrate(o,a),n.push(s.version));return{state:o,applied:n}}const me="state_",Ge="state__schemaVersion",Qa="financeapp_",Ka="state__modificadoEn";function tn(t=localStorage,e=Qa){const a=o=>`${e}${o}`;return{get(o){try{const n=t.getItem(a(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(a(o),JSON.stringify(n)),o!==Ka&&t.setItem(a(Ka),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(e)&&o.push(s.slice(e.length))}return o}}}function en(t=localStorage,e=Qa){const a=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(me)&&!s.startsWith(e)&&a.push(s)}const o=[];for(const n of a)try{const s=t.getItem(n);s!==null&&t.getItem(`${e}${n}`)===null&&(t.setItem(`${e}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function an(t){return V(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function on({adapter:t,hoy:e=new Date}){const a=V(e),o=an(e);let n=qs(a,o);const s=new Set;let i=[];function r(C){for(const j of s)j(C)}function l(C){t.set(`${me}${C}`,n[C])}function u(){const C={};for(const M of Object.keys(n)){const P=t.get(`${me}${M}`);P!==null&&(C[M]=P)}for(const M of Zs){const P=t.get(`${me}${M}`);P!==null&&(C[M]=P)}const j=t.get(Ge),{state:F,applied:E}=Wa(C,j,{hoyISO:a,finISO:o});if(n=F,g(),E.length>0){for(const M of Object.keys(n))l(M);t.set(Ge,Kt)}return i=E,{applied:E}}function g(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[qe(a)],l("accounts");return}const C=n.accounts.filter(j=>j.esCuentaPrincipal);if(C.length===0)n.accounts=n.accounts.map((j,F)=>F===0?{...j,esCuentaPrincipal:!0}:j),l("accounts");else if(C.length>1){let j=!1;n.accounts=n.accounts.map(F=>F.esCuentaPrincipal?j?{...F,esCuentaPrincipal:!1}:(j=!0,F):F),l("accounts")}}function p(C){return n[C]}function d(C,j){n[C]=j,l(C),r(C)}function b(C){d("config",{...n.config,...C})}function h(C){return s.add(C),()=>s.delete(C)}function $(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function A(C,j){const F=[...n[C]],E={...j,_id:$()};return F.push(E),d(C,F),E}function m(C,j,F){const E=n[C].map(M=>M._id===j?{...M,...F}:M);d(C,E)}function v(C,j){const F=n[C].filter(E=>E._id!==j);d(C,F)}function y(){const C=n.accounts||[],j=C.find(F=>F.esCuentaPrincipal&&F.activo)||C.find(F=>F.activo);return j?j._id:"default"}function I(C){var j;return((j=n.accounts.find(F=>F._id===C))==null?void 0:j.nombre)??C}function f(){return bt(n.tramosIRPFHistorico,n.config.tramos_irpf)}function x(){return bt(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function S(){return structuredClone(n)}function w(C,j=null){const{state:F,applied:E}=Wa(C,j,{hoyISO:a,finISO:o});n=F,g();for(const M of Object.keys(n))l(M);t.set(Ge,Kt);for(const M of Object.keys(n))r(M);return{applied:E}}return{load:u,get:p,set:d,patchConfig:b,subscribe:h,addItem:A,updateItem:m,removeItem:v,getPrincipalAccountId:y,accountName:I,resolverTramosIRPF:f,resolverTramosGanancias:x,snapshot:S,replaceAll:w,get schemaVersion(){return Kt},get migrationsApplied(){return[...i]},get today(){return a||J()}}}const K={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},Ct=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:K.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:K.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:K.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:K.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:K.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro (antiguos)",descripcion:"Solo lectura: la copia previa al planificador. Los objetivos se gestionan en «Objetivos financieros». Apagada de fábrica; enciéndela si quieres revisar los antiguos antes de descartarlos.",grupo:K.dinero,porDefecto:!1,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:K.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:K.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:K.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:K.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:K.planificacion,porDefecto:!1},{id:"planner",nombre:"Objetivos financieros",descripcion:"Plan a largo plazo: objetivos que compiten por el flujo mensual y se encadenan al completarse.",grupo:K.planificacion,porDefecto:!0},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:K.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:K.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:K.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:K.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:K.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:K.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:K.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:K.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:K.datos,porDefecto:!1,dependencias:["sync-nube"]}],sn=new Map(Ct.map(t=>[t.id,t]));function Zt(t){return sn.get(t)}function Xa(t){return Ct.filter(e=>(e.dependencias||[]).includes(t))}function Ve(){const t={};for(const e of Ct)t[e.id]=e.porDefecto;return t}function Za(){const t=[],e=new Map;for(const a of Ct)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function nn(t){function e(){return{...Ve(),...t.get("config").features||{}}}function a(p){t.patchConfig({features:p})}function o(p,d=e(),b=new Set){const h=Zt(p);if(!h)return!1;if(h.nucleo)return!0;if(d[p]===!1)return!1;if(b.has(p))return!0;b.add(p);for(const $ of h.dependencias||[])if(!o($,d,b))return!1;return!0}function n(p,d=e()){const b=Zt(p);return b?(b.dependencias||[]).filter(h=>!o(h,d)):[]}function s(p,d){var y;const b=Zt(p);if(!b)return{cambiadas:[]};if(b.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const h=e(),$=new Map(Ct.map(I=>[I.id,o(I.id,h)])),A={...h,[p]:d};let m;if(d){const I=[...b.dependencias||[]];for(;I.length;){const f=I.pop();A[f]===!1&&(A[f]=!0,m="dependencias-activadas"),I.push(...((y=Zt(f))==null?void 0:y.dependencias)||[])}}else{const I=Xa(p).map(f=>f.id);for(;I.length;){const f=I.pop();A[f]!==!1&&(A[f]=!1,m="cascada-apagado"),I.push(...Xa(f).map(x=>x.id))}}return a(A),{cambiadas:Ct.filter(I=>o(I.id,A)!==$.get(I.id)).map(I=>I.id),motivo:m}}function i(){const p=e();return Ct.map(d=>{const b=n(d.id,p);return{...d,activa:o(d.id,p),...b.length>0&&p[d.id]!==!1?{bloqueadaPor:b}:{}}})}function r(){const p=e();return Za().map(({grupo:d,features:b})=>({grupo:d,features:b.map(h=>{const $=n(h.id,p);return{...h,activa:o(h.id,p),...$.length>0&&p[h.id]!==!1?{bloqueadaPor:$}:{}}})}))}function l(){a(Ve())}function u(p){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...p?{nombre:p}:{},features:e()}}function g(p){const d=p,b=d&&typeof d=="object"&&d.features&&typeof d.features=="object"?d.features:null;if(!b)throw new Error('El perfil no tiene una sección "features" válida');const h=Ve(),$=[],A=[];for(const[m,v]of Object.entries(b)){if(!Zt(m)){A.push(m);continue}if(typeof v!="boolean"){A.push(m);continue}h[m]=v,$.push(m)}return a(h),{aplicadas:$,ignoradas:A}}return{isEnabled:p=>o(p),setEnabled:s,estado:i,estadoPorGrupo:r,reset:l,exportProfile:u,importProfile:g,bloqueadaPor:p=>n(p)}}const te=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function qt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function rn(t){var n,s;const a=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(te).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
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
    </div>`}function ln(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${te(o)}</div>
        ${n.map(rn).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function cn(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function dn(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${ln(a)}`,n(i)}function n(i){var l,u,g;i.querySelectorAll("[data-feature-toggle]").forEach(p=>{p.addEventListener("change",()=>{var h;const d=p.dataset.featureToggle,b=a.setEnabled(d,p.checked);b.motivo==="dependencias-activadas"&&qt(t,"Se han activado también las funcionalidades necesarias"),b.motivo==="cascada-apagado"&&qt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(h=t.onChange)==null||h.call(t,b.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(l=i.querySelector('[data-feature-action="export"]'))==null||l.addEventListener("click",()=>{const p=a.exportProfile(),d=new Blob([JSON.stringify(p,null,2)],{type:"application/json"}),b=URL.createObjectURL(d),h=e.createElement("a");h.href=b,h.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,h.click(),URL.revokeObjectURL(b),qt(t,"Perfil de funcionalidades guardado")}),(u=i.querySelector('[data-feature-action="import"]'))==null||u.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var d,b;const p=(d=r.files)==null?void 0:d[0];if(p)try{const{aplicadas:h,ignoradas:$}=a.importProfile(JSON.parse(await p.text()));qt(t,$.length>0?`Perfil cargado (${h.length} aplicadas, ${$.length} ignoradas por ser de otra versión)`:`Perfil cargado (${h.length} funcionalidades)`),(b=t.onChange)==null||b.call(t,h),o(i)}catch(h){qt(t,"No se pudo cargar el perfil: "+h.message,"err")}finally{r.value=""}}),(g=i.querySelector('[data-feature-action="reset"]'))==null||g.addEventListener("click",()=>{var p;a.reset(),qt(t,"Funcionalidades restablecidas"),(p=t.onChange)==null||p.call(t,[]),o(i)})}function s(){const i=cn(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const to={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function eo(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const n=e(o);a.style.display=n?"":"none",n?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function un({flags:t,document:e=document,router:a,rutasExtra:o}){function n(){const r=e.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const l=Object.entries((o==null?void 0:o())??{}).map(([u,g])=>[g,u]);for(const[u,g]of[...Object.entries(to),...l]){const p=t.isEnabled(u),d=e.querySelector(`.nav-btn[data-view="${g}"]`);d&&(d.style.display=p?"":"none"),!p&&n()===g&&(r=!0)}if(e.querySelectorAll(".nav-section").forEach(u=>{const g=[...u.querySelectorAll(".nav-btn[data-view]")];if(g.length===0)return;const p=g.some(d=>d.style.display!=="none");u.style.display=p?"":"none"}),eo(e,u=>t.isEnabled(u)),r){const u=a??globalThis.Router;u==null||u.navigate("dashboard")}}function i(r=e.body){if(typeof MutationObserver>"u")return()=>{};let l=!1;const u=new MutationObserver(()=>{if(!l){l=!0;try{eo(e,g=>t.isEnabled(g))}finally{l=!1}}});return u.observe(r,{childList:!0,subtree:!0}),()=>u.disconnect()}return{apply:s,observar:i,vistaPara:r=>to[r]}}function pn({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function n(h){return`view-${h}`}function s(h){const $=t.getElementById(n(h.route));if($)return $;const A=t.querySelector(".view-container");if(!A)return null;const m=t.createElement("div");return m.id=n(h.route),m.className="view hidden",A.appendChild(m),m}function i(h){if(t.querySelector(`.nav-btn[data-view="${h.route}"]`))return;const $=t.querySelectorAll(".nav-section"),A=$[h.seccion??Math.max(0,$.length-1)];if(!A)return;const m=t.createElement("button");m.className="nav-btn",m.dataset.view=h.route,m.innerHTML=`${h.iconoPath?`<svg viewBox="0 0 24 24"><path d="${h.iconoPath}"/></svg>`:""}<span>${h.nombre}</span>`,A.appendChild(m),m.addEventListener("click",()=>{const v=globalThis.Router;v==null||v.navigate(h.route)})}function r(h){a.set(h.route,h),s(h),i(h)}function l(){return[...a.keys()].filter(h=>{const $=a.get(h);return!e||e($.flagId??$.id)})}function u(h){return l().includes(h)}function g(h){const $=a.get(h);if(!$||e&&!e($.flagId??$.id))return!1;const A=s($);if(!A)return!1;if(o&&o!==h){const m=a.get(o),v=t.getElementById(n(o));m!=null&&m.unmount&&v&&m.unmount(v)}return $.mount(A),o=h,!0}function p(){o&&g(o)}function d(){const h={};for(const[$,A]of a)h[$]=A.flagId??A.id;return h}function b(){for(const h of a.values())s(h),i(h)}return{register:r,routes:l,has:u,mount:g,rerender:p,flagPorRuta:d,attachToShell:b,get activa(){return o}}}function c(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Et(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${c(z(t))}</span>`}function ao(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function oo(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${c(e)}</span>`).join(" ")}const mn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function fn(t){const[e,a]=t.split("-").map(Number);return`${mn[a-1]} ${e}`}function q(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function X(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function R(t,e,a){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function Y(t,e,a){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function ft(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function so(t,e){const a=parseFloat(ft(t,e));return Number.isFinite(a)?a:0}function vn(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function gn(t,e){const{ledger:a}=t,o=(t.hoy??J)(),n=t.accounts().filter(v=>v.activo),{desde:s,hasta:i}=vn(e.mes),r={cuentaId:e.cuentaId||void 0,desde:s,hasta:i,texto:e.filtroTexto||void 0},l=a.transacciones(r),u=t.estimaciones().filter(v=>v.tipo!=="transferencia"),g=l.filter(v=>v.importeCts<0).reduce((v,y)=>v+y.importeCts,0),p=l.filter(v=>v.importeCts>0).reduce((v,y)=>v+y.importeCts,0),d=e.cuentaId?a.saldoCuenta(e.cuentaId,i):a.saldoTotal(i),b=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),h=n.map(v=>`<option value="${c(v._id)}"${v._id===e.cuentaId?" selected":""}>${c(v.nombre)}</option>`).join(""),$=v=>'<option value="">— sin asignar —</option>'+u.map(y=>`<option value="${c(y._id)}"${y._id===v?" selected":""}>${c(y.concepto)} (${c(z(y.cuantia))})</option>`).join(""),A=l.map(v=>{var y;return`
      <tr data-tx="${c(v._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${c(v.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${c(v.concepto)}</td>
        <td style="padding:7px 8px">${oo(v.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${c(((y=t.accounts().find(I=>I._id===v.cuentaId))==null?void 0:y.nombre)??v.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${c(v._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${$(v.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Et(tt(v.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${c(v._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${c(v._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),m=b.slice().reverse().slice(0,8).map(v=>{var y;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${c(v.fecha)}</span>
        <span style="color:var(--text3)">${c(((y=t.accounts().find(I=>I._id===v.cuentaId))==null?void 0:y.nombre)??v.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${c(z(tt(v.saldoCts)))}</span>
        ${v.nota?`<span style="color:var(--text3)">${c(v.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${c(v._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
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
            <input class="form-input" type="month" id="acc-mes" value="${c(e.mes)}" style="width:140px"/>
          </div>
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${c(e.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${Et(tt(g))}</span>
          <span>Ingresos: ${Et(tt(p))}</span>
          <span>Neto: ${Et(tt(p+g))}</span>
          <span style="margin-left:auto">Saldo a ${c(i)}: <strong>${c(z(d))}</strong></span>
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
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${h}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(v=>`<option value="${c(v)}"></option>`).join("")}</datalist>
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
          ${m?`<div class="mt-12">${m}</div>`:""}
        </div>
      </div>
    </div>`}function bn(t,e,a,o){const{ledger:n}=e;Y(t,"#acc-cuenta",i=>{a.cuentaId=i.value,o()}),Y(t,"#acc-mes",i=>{a.mes=i.value||a.mes,o()});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{a.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),R(t,"#nt-guardar",()=>{const i=ft(t,"#nt-concepto").trim(),r=so(t,"#nt-importe");if(!i)return q("Indica un concepto","err");if(!(r>0))return q("Indica un importe mayor que cero","err");const l=ft(t,"#nt-tags").split(",").map(u=>u.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:ft(t,"#nt-fecha")||(e.hoy??J)(),cuentaId:ft(t,"#nt-cuenta"),importe:r,concepto:i,tags:l,tipo:ft(t,"#nt-tipo"),estimacionId:ft(t,"#nt-estimacion")||null}),q("Movimiento registrado"),e.onDatosCambiados(),o()}),R(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;X("¿Eliminar este movimiento?")&&(n.eliminar(r),q("Movimiento eliminado"),e.onDatosCambiados(),o())}),R(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,l=n.transacciones().find(p=>p._id===r);if(!l)return;const u=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(tt(l.importeCts))));if(u===null)return;const g=parseFloat(u.replace(",","."));if(!Number.isFinite(g)||g<=0)return q("Importe no válido","err");n.actualizar(r,{importe:g}),q("Movimiento actualizado"),e.onDatosCambiados(),o()}),Y(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),q("Asignación actualizada"),e.onDatosCambiados()}),R(t,"#pc-guardar",()=>{if(ft(t,"#pc-saldo").trim()==="")return q("Indica el saldo","err");const r=so(t,"#pc-saldo");n.registrarPuntoControl(ft(t,"#pc-cuenta"),ft(t,"#pc-fecha")||(e.hoy??J)(),r,ft(t,"#pc-nota").trim()||void 0),q("Saldo real registrado"),e.onDatosCambiados(),o()}),R(t,"[data-pc-borrar]",i=>{X("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),q("Punto de control eliminado"),e.onDatosCambiados(),o())})}function no(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=st(t.mediaRealReciente),i=st(s-e),r=e!==0?i/Math.abs(e)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const l=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:st(e),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:l,motivo:i>0?`El gasto real de los últimos ${l} meses supera lo estimado`:`El gasto real de los últimos ${l} meses es inferior a lo estimado`}}function hn(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(s,i,r={}){const l=r.hoy??J(),u=t.get("expenses"),g=u.find(h=>h._id===s);if(!g)throw new Error(`La estimación ${s} no existe`);const p={...g,fechaFin:l},d={...g,_id:e(),cuantia:st(i),fechaInicio:l,fechaFin:g.fechaFin??null,ajustadaDesdeId:g._id,ajustadaEn:l},b=u.map(h=>h._id===s?p:h);return b.push(d),t.set("expenses",b),{estimacionCerrada:p,estimacionNueva:d}}function o(s,i={}){const r=[],l=[];for(const u of s)try{r.push(a(u.estimacionId,u.cuantiaSugerida,i))}catch(g){l.push({estimacionId:u.estimacionId,error:g.message})}return{aplicadas:r,errores:l}}function n(s){const i=t.get("expenses"),r=new Map(i.map($=>[$._id,$])),l=r.get(s);if(!l)return[];const u=[];let g=l;const p=new Set;for(;g!=null&&g.ajustadaDesdeId&&!p.has(g._id);){p.add(g._id);const $=r.get(g.ajustadaDesdeId);if(!$)break;u.unshift($),g=$}const d=[];let b=l;const h=new Set([l._id]);for(;;){const $=i.find(A=>A.ajustadaDesdeId===b._id&&!h.has(A._id));if(!$)break;h.add($._id),d.push($),b=$}return[...u,l,...d]}return{aplicar:a,aplicarTodas:o,cadena:n}}function Ue(t){const e=t.estimaciones(),a=new Map(e.map(o=>[o._id,o]));return t.precision.analizarTodas(e).map(o=>{const n=a.get(o.estimacionId);return{analisis:o,estimacion:n,sugerencia:no(o,n.cuantia)}}).filter(o=>!!o.estimacion)}function yn(t){const e=Ue(t),a=e.filter(l=>l.analisis.precision!==null),o=e.filter(l=>l.sugerencia!==null),n=t.precision.analizarPorTag(e.map(l=>l.analisis));if(a.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const s=a.map(({analisis:l,estimacion:u,sugerencia:g})=>{const p=l.meses.slice(-6).map(d=>`${fn(d.mes)}: ${z(d.estimado)} → ${z(d.real)} (${d.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${c(u.concepto)}</div>
          <div style="margin-top:3px">${oo(l.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${c(p)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(z(l.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${c(z(l.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Et(l.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${ao(l.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${g?`<button class="btn-secondary" data-sugerir="${c(l.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${c(g.motivo)}">Sugerir ajuste → ${c(z(g.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=n.map(l=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${c(l.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${l.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(z(l.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${c(z(l.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Et(l.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${ao(l.precision)}</td>
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
    </div>`}function xn(t,e,a){R(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=Ue(e).find(l=>l.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${z(i.cuantiaActual)}
Nueva estimación: ${z(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;X(r)&&(e.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:e.hoy()}),q(`Estimación ajustada a ${z(i.cuantiaSugerida)}`),e.onDatosCambiados(),a())}),R(t,"#ajustar-todas",()=>{const o=Ue(e).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${z(r.cuantiaActual)} → ${z(r.cuantiaSugerida)}`).join(`
`);if(!X(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});q(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const $n=[";",",","	","|"],In={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function fe(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ve(t,e){const a=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===e?(a.push(o.trim()),o=""):o+=i}return a.push(o.trim()),a}function An(t){let e=";",a=-1;for(const o of $n){const n=t.slice(0,20).map(l=>ve(l,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(l=>l===s).length*10+s;r>a&&(a=r,e=o)}return e}function ee(t){let e=(t??"").trim();if(!e)return null;let a=!1;if(/^\(.*\)$/.test(e)&&(a=!0,e=e.slice(1,-1).trim()),e.endsWith("-")&&(a=!0,e=e.slice(0,-1).trim()),e.startsWith("-")&&(a=!0,e=e.slice(1).trim()),e.startsWith("+")&&(e=e.slice(1).trim()),e=e.replace(/[€$£\s  ]/g,""),!e)return null;const o=e.lastIndexOf(","),n=e.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(e)&&e.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(e)&&e.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const g=s===","?o:n;i=e.slice(0,g).replace(/[.,]/g,""),r=e.slice(g+1).replace(/[.,]/g,"")}else i=e.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const l=(r+"00").slice(0,2),u=Number(i||"0")*100+Number(l);return Number.isFinite(u)?a?-u:u:null}function Ye(t){const e=(t??"").trim();if(!e)return null;let a=e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a)return io(Number(a[1]),Number(a[2]),Number(a[3]));if(a=e.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),a){let o=Number(a[3]);return o<100&&(o+=o<70?2e3:1900),io(o,Number(a[2]),Number(a[1]))}return null}function io(t,e,a){if(e<1||e>12||a<1||a>31)return null;const o=new Date(t,e-1,a);return o.getFullYear()!==t||o.getMonth()!==e-1||o.getDate()!==a?null:`${t}-${String(e).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function ro(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>Ye(a)!==null).length/e.length}function lo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>ee(a)!==null).length/e.length}function Sn(t,e){const a={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>e.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=fe(t[i]);if(r&&In[s].some(l=>r===l||r.startsWith(l)||r.includes(l))){if(s==="importe"&&fe(t[i]).includes("saldo"))continue;a[s]=i,o.add(i);break}}if(a.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=ro(n(r));l>i&&(i=l,s=r)}s>=0&&(a.fecha=s,o.add(s))}if(a.importe<0&&a.debe<0&&a.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||fe(t[r]).includes("saldo"))continue;const l=lo(n(r));l>i&&(i=l,s=r)}s>=0&&(a.importe=s,o.add(s))}if(a.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=n(r);if(lo(l)>.5||ro(l)>.5)continue;const u=l.reduce((g,p)=>g+p.length,0)/Math.max(1,l.length);u>i&&(i=u,s=r)}s>=0&&(a.concepto=s)}return a}function wn(t){const e=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(g=>g.trim()!=="");if(e.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const a=An(e),o=e.map(g=>ve(g,a).length),n=Math.max(...o);let s=o.findIndex(g=>g===n);s<0&&(s=0);const i=ve(e[s],a);let r=e.slice(s+1).map(g=>ve(g,a));const l=Ye(i[0]??"")!==null||i.some(g=>ee(g)!==null&&/\d/.test(g));l&&(r=[i,...r]);const u=Sn(l?i.map(()=>""):i,r.slice(0,40));return{separador:a,cabeceras:l?i.map((g,p)=>`Columna ${p+1}`):i,filas:r,lineaCabecera:s+1,mapeo:u}}function co(t,e,a){return`${t}|${e}|${fe(a).replace(/\s+/g," ")}`}function Mn(t,e,a=[]){const o=new Set(a.map(s=>co(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],l=e.fecha>=0?Ye(s[e.fecha]??""):null;e.fecha<0?r.push("sin columna de fecha"):l||r.push(`fecha ilegible: «${s[e.fecha]??""}»`);let u=null;if(e.importe>=0)u=ee(s[e.importe]??""),u===null&&r.push(`importe ilegible: «${s[e.importe]??""}»`);else if(e.debe>=0||e.haber>=0){const d=e.debe>=0?ee(s[e.debe]??""):null,b=e.haber>=0?ee(s[e.haber]??""):null;d===null&&b===null?r.push("sin importe en Debe ni en Haber"):d!==null&&d!==0?u=-Math.abs(d):b!==null&&b!==0?u=Math.abs(b):u=0}else r.push("sin columna de importe");u===0&&r.push("importe cero");const g=(e.concepto>=0?s[e.concepto]??"":"").trim()||"Movimiento importado";let p=!1;if(l&&u!==null){const d=co(l,u,g);p=o.has(d)||n.has(d),n.add(d)}return{linea:t.lineaCabecera+1+i,fecha:l,concepto:g,importeCts:u,errores:r,duplicada:p}})}function Cn(t,e){const a=t.filter(n=>n.errores.length===0&&(e||!n.duplicada)),o=a.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:a.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:a.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function ge(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const jn=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function Je(t,e){if(!e.analisis||!e.mapeo){e.filas=[];return}const a=t.ledger.transacciones(e.cuentaId?{cuentaId:e.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));e.filas=Mn(e.analisis,e.mapeo,a)}function zn(t,e){const a=t.accounts().filter(n=>n.activo);if(!e.abierto)return`
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

      ${e.analisis&&e.mapeo?En(e,e.analisis,e.mapeo):Fn()}
    </div>`}function Fn(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function En(t,e,a){const o=Cn(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+e.cabeceras.map((l,u)=>`<option value="${u}"${u===r?" selected":""}>${c(l||`Columna ${u+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${c(t.nombreFichero)}</strong> · ${e.filas.length} línea${e.filas.length!==1?"s":""}
      · separador <code>${c(e.separador==="	"?"tabulador":e.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${jn.map(r=>`<div class="form-group">
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
        <div class="stat-value" style="font-size:1.15rem">${Et(tt(o.sumaCts))}</div>
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
          ${i.map(r=>{const l=r.errores.length>0,u=l?r.errores[0]:r.duplicada?"repetido":"se importa",g=l?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${l?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${c(r.fecha??"—")}</td>
                <td style="font-size:12px">${c(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":c(z(tt(r.importeCts)))}</td>
                <td style="font-size:11px;color:${g}">${c(u)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function _n(t,e,a,o){R(t,"[data-imp-abrir]",()=>{const s=e.accounts().filter(i=>i.activo);Object.assign(a,ge(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),R(t,"[data-imp-cerrar]",()=>{Object.assign(a,ge()),o()}),Y(t,"#imp-cuenta",s=>{a.cuentaId=s.value,Je(e,a),o()}),Y(t,"#imp-duplicadas",s=>{a.incluirDuplicadas=s.checked,o()}),Y(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;a.mapeo&&(a.mapeo[r]=Number(i.value),Je(e,a),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&Pn(s).then(r=>{const l=wn(r);a.nombreFichero=s.name,a.error=l.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",a.analisis=l,a.mapeo={...l.mapeo},Je(e,a),o()}).catch(r=>{a.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),R(t,"[data-imp-confirmar]",()=>{if(!a.cuentaId)return;const s=a.filas.filter(i=>i.errores.length===0&&(a.incluirDuplicadas||!i.duplicada));if(s.length!==0){for(const i of s)e.ledger.registrar({fecha:i.fecha,cuentaId:a.cuentaId,importe:Math.abs(tt(i.importeCts)),tipo:i.importeCts<0?"gasto":"ingreso",concepto:i.concepto,origen:"importado"});q(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""}`),Object.assign(a,ge()),e.onDatosCambiados(),o()}})}function Pn(t){return t.arrayBuffer().then(e=>{const a=new TextDecoder("utf-8").decode(e);if(!a.includes("�"))return a;try{return new TextDecoder("iso-8859-1").decode(e)}catch{return a}})}const Tn="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function Dn(t){const e={cuentaId:"",mes:(t.hoy??J)().slice(0,7),filtroTexto:""},a=ge(),o=()=>{var u;return(u=t.onDatosCambiados)==null?void 0:u.call(t)},n=t.hoy??J,s={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:o,hoy:n},i={ledger:t.ledger,accounts:t.accounts,onDatosCambiados:o},r={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:o,hoy:n};function l(u){const g=t.ledger.saldoTotal(n()),p=t.ledger.ultimaFecha(),d=t.ledger.transacciones().length;u.innerHTML=`
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
          <div class="stat-value" style="font-size:1.3rem">${c(z(g))}</div>
          <div style="font-size:11px;color:var(--text3)">suma de cuentas activas</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Movimientos registrados</div>
          <div class="stat-value" style="font-size:1.3rem">${d}</div>
          <div style="font-size:11px;color:var(--text3)">${p?`último: ${c(p)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-importar"></div>
      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const b=u.querySelector("#acc-importar"),h=u.querySelector("#acc-transacciones"),$=u.querySelector("#acc-precision");b.innerHTML=zn(i,a),h.innerHTML=gn(s,e),$.innerHTML=yn(r);const A=()=>l(u);_n(b,i,a,A),bn(h,s,e,A),xn($,r,A)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:Tn,mount:l}}const Rn="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function We(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function On(t){const{store:e}=t,a=t.hoy??J,o=()=>G(a()),n=()=>e.get("config").margenesSeguridad??[];function s(b){var h;e.patchConfig({margenesSeguridad:b}),(h=t.onDatosCambiados)==null||h.call(t)}function i(b,h){const $=n().map(m=>({...m,puntos:(m.puntos??[]).map(v=>({...v}))})),A=$.find(m=>m._id===b);A&&(h(A),s($))}function r(b){const h=e.get("config"),$=pe(b,e.get("expenses"),h,e.get("loans"),a(),!1,o());return z($)}function l(b,h,$){const A=h.tipo==="fijo",m=A?"":`<span class="text-sm" style="color:var(--text3)">${c(z((h.meses??0)*$))}</span>`;return`
      <tr data-punto="${c(h._id)}" data-margen="${c(b._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${c(h.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${A?" selected":""}>Fijo €</option>
            <option value="meses"${A?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${A?`<input type="number" class="form-input" style="width:90px" value="${h.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${A?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${h.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${m}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function u(b,h,$){const A=b.cuentas&&b.cuentas.length>0?b.cuentas.map(I=>{var f;return((f=h.find(x=>x._id===I))==null?void 0:f.nombre)??I}).join(", "):"Todas las cuentas activas",v=[...b.puntos??[]].sort((I,f)=>I.fecha.localeCompare(f.fecha)).map(I=>l(b,I,$)).join(""),y=b.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${c(A)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${c(r(b))}</strong>
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
            ${v||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
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
        ${y}
      </div>`}function g(b,h){const $=h?n().find(y=>y._id===h):null,A=e.get("accounts").filter(y=>y.activo),m=new Set(($==null?void 0:$.cuentas)??[]),v=A.map(y=>`
        <label class="tag" data-chip="${c(y._id)}" style="cursor:pointer;${m.has(y._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${c(y._id)}" ${m.has(y._id)?"checked":""} style="display:none"/>
          ${c(y.nombre)}
        </label>`).join(" ");b.innerHTML=`
      <div class="modal-title">${h?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${c(($==null?void 0:$.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${v||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${$?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
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
        <button class="btn-primary" data-guardar-margen="${c(h??"")}">Guardar</button>
      </div>`}function p(b,h){const $=document.getElementById("modal-overlay"),A=document.getElementById("modal-content");!$||!A||(g(A,b),$.classList.remove("hidden"),Y(A,".mg-acc-chip",m=>{const v=m,y=A.querySelector(`[data-chip="${v.value}"]`);y&&(y.style.cssText=`cursor:pointer;${v.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),Y(A,"#mg-p-tipo",m=>{const v=m.value==="fijo",y=A.querySelector("#mg-p-importe-wrap"),I=A.querySelector("#mg-p-meses-wrap");y&&(y.style.display=v?"":"none"),I&&(I.style.display=v?"none":"")}),R(A,"[data-cerrar-form]",()=>$.classList.add("hidden")),R(A,"[data-guardar-margen]",m=>{var x,S,w,C,j;const v=m.getAttribute("data-guardar-margen")||"",y=((x=A.querySelector("#mg-nombre"))==null?void 0:x.value.trim())??"";if(!y)return q("El nombre es obligatorio","err");const I=[...A.querySelectorAll(".mg-acc-chip:checked")].map(F=>F.value),f=n().map(F=>({...F}));if(v){const F=f.findIndex(E=>E._id===v);if(F===-1)return q("Margen no encontrado","err");f[F]={...f[F],nombre:y,cuentas:I}}else{const F=((S=A.querySelector("#mg-p-tipo"))==null?void 0:S.value)??"fijo",E={_id:We(),fecha:((w=A.querySelector("#mg-p-fecha"))==null?void 0:w.value)||J(),tipo:F,importe:parseFloat(((C=A.querySelector("#mg-p-importe"))==null?void 0:C.value)??"0")||0,meses:parseFloat(((j=A.querySelector("#mg-p-meses"))==null?void 0:j.value)??"1")||1};f.push({_id:We(),nombre:y,activo:!0,cuentas:I,puntos:[E]})}s(f),q(v?"Margen actualizado":"Margen creado"),$.classList.add("hidden"),h()}))}function d(b){const h=n(),$=e.get("accounts"),A=Wt(e.get("expenses"),o());b.innerHTML=`
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
             </div>`:h.map(v=>u(v,$,A)).join("")}`;const m=()=>d(b);R(b,"[data-nuevo-margen]",()=>p(null,m)),R(b,"[data-editar-margen]",v=>p(v.getAttribute("data-editar-margen"),m)),R(b,"[data-borrar-margen]",v=>{X("¿Eliminar este margen de seguridad?")&&(s(n().filter(y=>y._id!==v.getAttribute("data-borrar-margen"))),q("Margen eliminado"),m())}),Y(b,"[data-toggle-margen]",v=>{const y=v.getAttribute("data-toggle-margen");i(y,I=>{I.activo=v.checked}),m()}),R(b,"[data-add-punto]",v=>{const y=v.getAttribute("data-add-punto");i(y,I=>{I.puntos=[...I.puntos??[],{_id:We(),fecha:J(),tipo:"fijo",importe:0,meses:1}]}),m()}),R(b,"[data-borrar-punto]",v=>{const y=v.closest("[data-punto]");if(!y)return;const I=y.dataset.margen,f=y.dataset.punto;i(I,x=>{x.puntos=(x.puntos??[]).filter(S=>S._id!==f)}),m()}),Y(b,"[data-campo]",v=>{const y=v.closest("[data-punto]");if(!y)return;const I=v.getAttribute("data-campo"),f=v.value;i(y.dataset.margen,x=>{const S=(x.puntos??[]).find(w=>w._id===y.dataset.punto);S&&(I==="fecha"?S.fecha=f:I==="tipo"?S.tipo=f:I==="importe"?S.importe=parseFloat(f)||0:S.meses=parseFloat(f)||0)}),m()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:Rn,mount:d}}const Nn="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function qn(t){const e=Array.isArray(t)?t[1]??[]:[];return Array.isArray(e)?e.filter(a=>a&&a.value!==null&&a.value!==void 0&&Number.isFinite(Number(a.value))).map(a=>({year:parseInt(a.date),tasa:parseFloat(Number(a.value).toFixed(2))})).filter(a=>Number.isFinite(a.year)).sort((a,o)=>a.year-o.year):[]}function Ln({fetchImpl:t,url:e=Nn}={}){let a=null,o=!1;async function n(s=!1){if(a&&!s)return a;if(o)return null;o=!0;try{const r=await(t??fetch)(e);if(!r.ok)throw new Error(`HTTP ${r.status}`);return a=qn(await r.json()),a}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:n,invalidar:()=>{a=null},get enCache(){return a}}}const kn="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function Bn(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function Hn(t){const{store:e}=t,a=t.ipc??Ln(),o=()=>e.get("inflacion")??[];function n(){var p;(p=t.onDatosCambiados)==null||p.call(t)}function s(p,d){if(!p||p.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const b=new Set(o().map(v=>v.year)),h=p.filter(v=>v.year>=d).reverse(),$=h.filter(v=>!b.has(v.year)).length,A=[...new Set(p.map(v=>v.year))].sort((v,y)=>v-y),m=h.map(v=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${v.year}" data-tasa="${v.tasa}" ${b.has(v.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${v.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${Bn(v.tasa)}">${v.tasa.toFixed(2)}%</span>
          ${b.has(v.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${A.map(v=>`<option value="${v}"${v===d?" selected":""}>${v}</option>`).join("")}
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
      </div>`}function i(p){return!p||p.length===0?2e3:Math.max(p[0].year,new Date().getFullYear()-25)}async function r(p){const d=document.getElementById("modal-overlay"),b=document.getElementById("modal-content");if(!d||!b)return;b.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,d.classList.remove("hidden");const h=(A,m)=>{const v=document.getElementById("ipc-body");v&&(v.innerHTML=s(A,m))},$=await a.obtener();h($,i($)),R(b,"[data-ipc-cerrar]",()=>d.classList.add("hidden")),Y(b,"#ipc-desde",A=>{h(a.enCache,parseInt(A.value))}),R(b,"[data-ipc-recargar]",()=>{a.invalidar();const A=document.getElementById("ipc-body");A&&(A.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),a.obtener(!0).then(m=>h(m,i(m)))}),R(b,"[data-ipc-importar]",()=>{const A=[...b.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(A.length===0)return q("Nada seleccionado","err");const m=new Set(o().map(y=>y.year));let v=0;for(const y of A){const I=parseInt(y.dataset.year??""),f=parseFloat(y.dataset.tasa??"");!Number.isFinite(I)||!Number.isFinite(f)||m.has(I)||(e.addItem("inflacion",{year:I,tasa:f}),m.add(I),v++)}d.classList.add("hidden"),q(`${v} periodo${v!==1?"s":""} importado${v!==1?"s":""} correctamente`),n(),p()})}function l(p,d){var m;const b=document.getElementById("modal-overlay"),h=document.getElementById("modal-content");if(!b||!h)return;const $=p?o().find(v=>v._id===p):null;h.innerHTML=`
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
        <button class="btn-primary" data-inf-guardar="${c(p??"")}">Guardar</button>
      </div>`,b.classList.remove("hidden");const A=()=>{var x;const v=parseFloat(((x=h.querySelector("#inf-tasa"))==null?void 0:x.value)??""),y=h.querySelector("#inf-preview");if(!y)return;if(!Number.isFinite(v)||v<=0){y.innerHTML="";return}const I=(Math.pow(1+v/100,1/12)-1)*100,f=Math.pow(1+v/100,5);y.innerHTML=`Con un ${v}% anual: <strong>${I.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${f.toFixed(3)}</strong> (+${((f-1)*100).toFixed(1)}%)`};(m=h.querySelector("#inf-tasa"))==null||m.addEventListener("input",A),A(),R(h,"[data-inf-cerrar]",()=>b.classList.add("hidden")),R(h,"[data-inf-guardar]",v=>{const y=v.getAttribute("data-inf-guardar")||"",I=parseInt(h.querySelector("#inf-year").value),f=parseFloat(h.querySelector("#inf-tasa").value);if(!Number.isFinite(I)||I<1900||I>2200)return q("Año inválido","err");if(!Number.isFinite(f)||f<0||f>100)return q("Tasa inválida (0–100%)","err");if(o().filter(S=>S._id!==y).some(S=>S.year===I))return q("Ya existe un periodo para ese año","err");y?(e.updateItem("inflacion",y,{year:I,tasa:f}),q("Periodo actualizado")):(e.addItem("inflacion",{year:I,tasa:f}),q("Periodo añadido")),b.classList.add("hidden"),n(),d()})}function u(p,d){const b=(Math.pow(1+p.tasa/100,.08333333333333333)-1)*100,h=`${p.year}-12-31`,$=h>d?pt([p],d,h):null;return`
      <div class="exp-table-row" data-periodo="${c(p._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${p.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${p.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${b.toFixed(3)}%/mes</div>
        <div class="num">${$!==null?`×${$.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${c(p._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${c(p._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function g(p){const d=o(),b=e.get("config").usarInflacion||!1,h=[...d].sort((x,S)=>S.year-x.year),$=J(),A=new Date().getFullYear(),m=V(new Date(A+5,0,1)),v=V(new Date(A+10,0,1)),y=b&&d.length>0?pt(d,$,m):null,I=b&&d.length>0?pt(d,$,v):null;p.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${!b&&d.length===0?`<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
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
        ${y!==null&&I!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${y.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((y-1)*100).toFixed(1)}%)</span></div>
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
        ${h.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':h.map(x=>u(x,$)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const f=()=>g(p);Y(p,"[data-toggle-inflacion]",x=>{const S=x.checked;e.patchConfig({usarInflacion:S}),q(S?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),n(),f()}),R(p,"[data-nuevo-periodo]",()=>l(null,f)),R(p,"[data-editar-periodo]",x=>l(x.getAttribute("data-editar-periodo"),f)),R(p,"[data-importar-ipc]",()=>void r(f)),R(p,"[data-borrar-periodo]",x=>{X("¿Eliminar este periodo de inflación?")&&(e.removeItem("inflacion",x.getAttribute("data-borrar-periodo")),q("Periodo eliminado"),n(),f())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:kn,mount:g}}const Gn=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],Vn=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Un=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function Yn(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Qe=(t,e)=>t.map(([a,o])=>`<option value="${c(a)}"${a===e?" selected":""}>${c(o)}</option>`).join("");function uo(t,e="dp"){const{modo:a,dia:o,nth:n,wd:s}=Yn(t),i=Qe(Gn.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${c(e)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Qe(Vn,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Qe(Un,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function po(t){var o,n,s;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=e.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",a==="dia"?"":"none"),(s=e.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",a==="nthweekday"?"":"none")}function mo(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=n=>{var s;return((s=e.querySelector(n))==null?void 0:s.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const Jn="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Wn=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Qn(t){const e=t.hoy??J,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var m;return(m=t.onDatosCambiados)==null?void 0:m.call(t)},n=()=>t.store.get("accounts"),s=m=>{var v;return((v=n().find(y=>y._id===(m||"default")))==null?void 0:v.nombre)??(m||"default")};function i(){const m=e();let v=[...t.store.get("expenses")];if(a.mostrarExpirados||(v=v.filter(y=>!y.fechaFin||y.fechaFin>=m)),a.tipo&&(v=v.filter(y=>y.tipo===a.tipo)),a.cuenta&&(v=v.filter(y=>(y.cuenta||"default")===a.cuenta)),a.desde&&(v=v.filter(y=>(y.fechaInicio??"")>=a.desde)),a.hasta&&(v=v.filter(y=>(y.fechaInicio??"")<=a.hasta)),a.busqueda){const y=a.busqueda.toLowerCase();v=v.filter(I=>I.concepto.toLowerCase().includes(y))}return a.tags.size>0&&(v=v.filter(y=>(y.tags||[]).some(I=>a.tags.has(I)))),v.sort((y,I)=>{const f=y[a.orden]??"",x=I[a.orden]??"";return typeof f=="number"&&typeof x=="number"?(f-x)*a.sentido:String(f).localeCompare(String(x))*a.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(m=>m.tags||[]))].filter(Boolean).sort()}function l(m,v){const y=a.orden===m?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${m}">${c(v)} <span class="sort-arrow">${y}</span></span>`}function u(m,v=!1){return(v?'<option value="">Todas las cuentas</option>':"")+n().filter(I=>I.activo!==!1).map(I=>`<option value="${c(I._id)}"${I._id===m?" selected":""}>${c(I.nombre)}</option>`).join("")}function g(m){const v=m.tipo==="transferencia",y=we(m.diaPago??""),I=m.tipoFrecuencia==="extraordinario"?"Único":`Cada ${m.frecuencia??1} ${m.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${y?` · ${y}`:""}`,f=!!m.fechaFin&&m.fechaFin<e(),x=v?'<span class="badge badge-purple">⇄ transf.</span>':m.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',S=v?`${c(s(m.cuenta))} → ${c(s(m.cuentaDestino))}`:c(s(m.cuenta)),w=(m.tags||[]).map(C=>`<span class="tag${a.tags.has(C)?" active":""}" data-tag="${c(C)}" title="Filtrar por ${c(C)}">${c(C)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(m.concepto)}</div>
        <div class="tag-list mt-4">${w}</div>
      </div>
      <div>${x}</div>
      <div class="num ${m.tipo==="ingreso"?"pos":v?"":"neg"}">${v?"⇄ ":""}${c(z(m.cuantia))}</div>
      <div class="text-sm">${c(I)}</div>
      <div class="text-sm exp-col-hide">${S}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${c(m._id)}"${m.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${m.tipo==="gasto"&&m.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${m.tipo==="gasto"&&m.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${m.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${m.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${c(m.ajustadaEn??"")}">ajustada</span>`:""}
        ${f?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${c(m._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${c(m._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${c(m._id)}">✕</button>
      </div>
    </div>`}function p(m){const v=i(),y=r();m.innerHTML=`
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
      ${y.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${y.map(I=>`<span class="tag${a.tags.has(I)?" active":""}" data-tag="${c(I)}">${c(I)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${l("concepto","Concepto")} ${l("tipo","Tipo")} ${l("cuantia","Cuantía")} ${l("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${v.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':v.map(g).join("")}
      </div>`}function d(m){const v=(m==null?void 0:m.tipo)==="transferencia",y=t.store.get("escenarios"),I=(m==null?void 0:m.escenarioIds)||[],f=(x,S,w,C,j="")=>`<div class="form-group"><label class="form-label">${c(S)}</label>
       <input class="form-input" type="${w}" id="${x}" value="${c(C)}" placeholder="${c(j)}"/></div>`;return`
      <div class="grid-2">
        ${f("ef-concepto","Concepto","text",(m==null?void 0:m.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(m==null?void 0:m.tipo)==="gasto"||!(m!=null&&m.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(m==null?void 0:m.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${v?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${f("ef-cuantia","Cuantía (€)","number",(m==null?void 0:m.cuantia)??"","500")}
        ${f("ef-frecuencia","Frecuencia","number",(m==null?void 0:m.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${Wn.map(([x,S])=>`<option value="${x}"${((m==null?void 0:m.tipoFrecuencia)??"mensual")===x?" selected":""}>${c(S)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${f("ef-fecha-ini","Fecha inicio","date",(m==null?void 0:m.fechaInicio)??e())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${u((m==null?void 0:m.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${v?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${u((m==null?void 0:m.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(m==null?void 0:m.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${m!=null&&m._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${f("ef-fecha-fin","Fecha fin (opcional)","date",(m==null?void 0:m.fechaFin)??"")}</div>
          <div class="mt-8">${uo(m==null?void 0:m.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${v?' style="display:none"':""}>
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
          ${y.length>0?`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${y.map(x=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${I.includes(x._id)?c(x.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${c(x._id)}"${I.includes(x._id)?" checked":""}/>
                          ${c(x.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${c((m==null?void 0:m._id)??"")}">Guardar</button>
      </div>`}function b(m){var I;const v=((I=m.querySelector("#ef-tipo"))==null?void 0:I.value)??"gasto",y=(f,x)=>{const S=m.querySelector(f);S&&(S.style.display=x?"":"none")};y("#ef-destino-wrap",v==="transferencia"),y("#ef-basico-wrap",v!=="transferencia"),y("#ef-irpf-wrap",v==="ingreso"),y("#ef-clasificacion-wrap",v==="gasto")}function h(m,v,y){const I=document.getElementById("modal-overlay"),f=document.getElementById("modal-content");!I||!f||(f.innerHTML=`<div class="modal-title">${c(v)}</div>${d(m)}`,I.classList.remove("hidden"),Y(f,"#ef-tipo",()=>b(f)),Y(f,"[data-dp-modo]",()=>po(f)),R(f,"[data-cancelar]",()=>I.classList.add("hidden")),R(f,"[data-guardar]",x=>{$(f,x.getAttribute("data-guardar")||"")&&(I.classList.add("hidden"),y())}))}function $(m,v){const y=F=>{var E;return((E=m.querySelector(F))==null?void 0:E.value)??""},I=F=>{var E;return!!((E=m.querySelector(F))!=null&&E.checked)},f=y("#ef-tipo")||"gasto",x=f==="transferencia",S=y("#ef-concepto").trim(),w=parseFloat(y("#ef-cuantia"));if(!S||!Number.isFinite(w))return q("Concepto y cuantía obligatorios","err"),!1;const C=y("#ef-clasificacion"),j={concepto:S,tipo:f,cuantia:w,frecuencia:parseInt(y("#ef-frecuencia"),10)||1,tipoFrecuencia:y("#ef-tipo-frec")||"mensual",fechaInicio:y("#ef-fecha-ini"),fechaFin:y("#ef-fecha-fin")||null,diaPago:mo(m),cuenta:y("#ef-cuenta"),cuentaDestino:x?y("#ef-cuenta-dest")||"default":void 0,activo:I("#ef-activo"),basico:!x&&I("#ef-basico"),sujetoIRPF:!x&&I("#ef-sujetoIRPF"),clasificacion:f==="gasto"?C||null:void 0,tags:x?["transferencia"]:y("#ef-tags").split(",").map(F=>F.trim()).filter(Boolean),escenarioIds:[...m.querySelectorAll(".ef-escenario:checked")].map(F=>F.value)};return v?(t.store.updateItem("expenses",v,j),q("Actualizado")):(t.store.addItem("expenses",j),q("Creado")),o(),!0}function A(m,v){const y=m.querySelector("[data-busqueda]");let I;y==null||y.addEventListener("input",()=>{clearTimeout(I),I=setTimeout(()=>{a.busqueda=y.value,v();const f=m.querySelector("[data-busqueda]");f==null||f.focus(),f==null||f.setSelectionRange(f.value.length,f.value.length)},250)}),Y(m,"[data-expirados]",f=>{a.mostrarExpirados=f.checked,v()}),Y(m,"[data-f-tipo]",f=>{a.tipo=f.value,v()}),Y(m,"[data-f-cuenta]",f=>{a.cuenta=f.value,v()}),Y(m,"[data-f-desde]",f=>{a.desde=f.value,v()}),Y(m,"[data-f-hasta]",f=>{a.hasta=f.value,v()}),R(m,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,v()}),R(m,"[data-limpiar-tags]",()=>{a.tags=new Set,v()}),R(m,"[data-tag]",f=>{const x=f.getAttribute("data-tag");a.tags.has(x)?a.tags.delete(x):a.tags.add(x),v()}),R(m,"[data-orden]",f=>{const x=f.getAttribute("data-orden");a.orden===x?a.sentido=a.sentido===1?-1:1:(a.orden=x,a.sentido=1),v()}),R(m,"[data-nuevo]",()=>h(null,"Nuevo gasto/ingreso",v)),R(m,"[data-editar]",f=>{const x=t.store.get("expenses").find(S=>S._id===f.getAttribute("data-editar"));x&&h(x,"Editar",v)}),R(m,"[data-duplicar]",f=>{const x=t.store.get("expenses").find(C=>C._id===f.getAttribute("data-duplicar"));if(!x)return;const{_id:S,...w}=x;h({...w,concepto:`${x.concepto} (copia)`},"Duplicar movimiento",v)}),R(m,"[data-borrar]",f=>{X("¿Eliminar?")&&(t.store.removeItem("expenses",f.getAttribute("data-borrar")),q("Eliminado"),o(),v())}),Y(m,"[data-activo]",f=>{const x=f;t.store.updateItem("expenses",x.getAttribute("data-activo"),{activo:x.checked}),o(),v()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:Jn,mount(m){const v=()=>p(m);p(m),m.dataset.wired!=="1"&&(A(m,v),m.dataset.wired="1")}}}function be(t,e,a){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=pt(e,a,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function fo(t,e,a,o){return t.reduce((n,s)=>{const i=pt(e,a,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function Kn(t,e,a){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=et({...t,amortizaciones:o.slice(0,s)}),r=et({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:be(i.tabla,e,a)-be(r.tabla,e,a)}})}const Ke=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${c(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function Xn(t,e){const a=ua(t),o=(t.amortizaciones||[]).length>0,n=e.periodos.length>0,s=e.usarInflacion&&n,i=n?pa(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,r=n?ma(t.tin||0,i):null,l=o&&n?Kn(t,e.periodos,e.hoy):[],u=l.length?be(a.sinAmort.tabla,e.periodos,e.hoy)-be(a.tabla,e.periodos,e.hoy):null,g=u===null?null:u-a.costeTotalAmort,p=s?fo(a.tabla,e.periodos,e.hoy,a.comAp):null,d=s&&o?fo(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${c(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${c(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
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
        ${Ke("Cuota mensual",c(z(a.cuota)),e.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${c(z(e.cuotaMes))}</div>`:"")}
        ${Ke("Total intereses",c(z(a.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(z(a.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${c(a.fechaFin||"—")}</div>
          ${o&&a.fechaFin!==a.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${c(a.sinAmort.fechaFin||"—")}${a.ahorroTiempo>0?` (−${a.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Ke("Total pagado",c(z(a.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${c(z(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${c(ra(a.tae))}</div></div>
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
          <div><div class="stat-label">Capital</div><div class="stat-value">${c(z(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${c(z(a.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${c(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${c(we(t.diaPago))}</div></div>`:""}
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
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${c(z(a.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${c(z(u))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${c(z(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${c(z(a.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(g??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${c(z(g??0))}</div>
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

      ${p!==null?Zn(t,a.totalPagado,p,d):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(b=>ti(b,s,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((b,h)=>ei(t._id,b,l[h]??null,e)).join("")}`:""}
    </div>
  </div>`}function Zn(t,e,a,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-a,l=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${c(z(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${c(z(a))}</div></div>
        <div><div class="stat-label">${l?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${l?"pos":"neg"}">${l?"−":"+"}${c(z(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=e-a,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${c(z(e))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${c(z(a))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${c(z(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function ti(t,e,a){let o="";if(e&&!t.esAmortizacion){const n=pt(a.periodos,a.hoy,t.fecha);o=c(z(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":c(t.mes)}</td>
    <td class="num">${c(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":c(z(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${c(z(t.interes))}</td>
    <td class="num">${c(z(t.amortizacion))}</td>
    <td class="num">${c(z(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function ei(t,e,a,o){const n=(e.escenarioIds||[]).map(s=>`<span class="badge badge-yellow">🔭 ${c(o.nombreEscenario(s))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${c(e.fecha)}</span>
    <span class="num">${c(z(e.cantidad))}</span>
    <span class="badge ${e.simulacion?"badge-sim":"badge-active"}">${e.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${e.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${n}
    ${a?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${c(z(a.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${c(z(a.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${c(t)}|${c(e._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${c(t)}|${c(e._id)}">✕</button>
  </div>`}const Z=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
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
    </div></div>`}const ai=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function oi(t,e,a,o=J()){return`
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
            <select class="form-select" id="f-cuenta">${ai(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${uo(t==null?void 0:t.diaPago,"loan")}
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
    </div>`}function si(t,e,a,o=J()){return`
    <div class="grid-2">
      ${Z("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??o)}
      ${Z("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
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
    </div>`}const vo="opt_",go=t=>String(t).startsWith(vo);function ni(t){let e=null,a=null;const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content");function s(y,I){const f=o(),x=n();return!f||!x?null:(x.innerHTML=`<div class="modal-title">${c(y)}</div>${I}`,f.classList.remove("hidden"),x)}const i=()=>{var y;return(y=o())==null?void 0:y.classList.add("hidden")};function r(){let y=!1;for(const I of t.loans()){const f=(I.amortizaciones||[]).filter(x=>!go(x._id));f.length!==(I.amortizaciones||[]).length&&(t.guardarAmortizaciones(I._id,f),y=!0)}return y}function l(y){try{return y()}catch(I){return q(I instanceof Error?I.message:"No se ha podido completar el cálculo","err"),null}}function u(){var C,j;if(!Ra("optimizador")){q("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const y=t.loans().filter(F=>F.activo&&!F.simulacion);if(y.length===0){q("No hay préstamos activos para optimizar","err");return}const I=t.config(),f=t.accounts().filter(F=>F.activo&&!F.simulacion),x=((C=f.find(F=>F.esCuentaPrincipal))==null?void 0:C._id)??((j=f[0])==null?void 0:j._id)??"",S=I.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,w=s("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${f.map(F=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${c(F._id)}"${F._id===x?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(F.nombre)}${F._id===x?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${c(z(rt(F)))}</span>
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
        ${Z("opt-horizonte","Horizonte (meses)","number",60,"60")}
        ${Z("opt-frecuencia","Frecuencia manual (cada N meses)","number",1,"1")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${Z("opt-min","Importe mínimo por amortización (€)","number",500,"500")}
        ${Lt("opt-tipo","Efecto de la amortización",[["plazo","Reducir plazo (mantener cuota)"],["cuota","Reducir cuota (mantener plazo)"]],"plazo")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${Z("opt-fecha-primera","Fecha primera amortización","date","")}
        ${Z("opt-fecha-obj","Fecha objetivo para comparar saldo","date",S)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);w&&(g(w),Y(w,".opt-acc-radio",()=>g(w)),R(w,"[data-opt-todos]",()=>{const F=[...w.querySelectorAll(".opt-loan-check")],E=F.every(M=>M.checked);F.forEach(M=>M.checked=!E)}),R(w,"[data-cancelar]",i),R(w,"[data-opt-calcular]",()=>h(w)),R(w,"[data-opt-comparar]",()=>$(w)))}function g(y){var w;const I=(w=y.querySelector(".opt-acc-radio:checked"))==null?void 0:w.value,x=(t.config().margenesSeguridad||[]).filter(C=>C.activo!==!1).filter(C=>!C.cuentas||C.cuentas.length===0||I&&C.cuentas.includes(I)),S=y.querySelector("#opt-margenes-wrap");S&&(S.innerHTML=x.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':x.map(C=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${c(C._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${c(C.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!C.cuentas||C.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function p(y){var S,w,C,j;const I=(F,E,M=0)=>{var T;const P=parseFloat(((T=y.querySelector(F))==null?void 0:T.value)??"");return Number.isFinite(P)?Math.max(M,P):E},f=[...y.querySelectorAll(".opt-loan-check")],x=f.filter(F=>F.checked).map(F=>F.value);return{horizonte:Math.round(I("#opt-horizonte",60,1)),frecuencia:Math.round(I("#opt-frecuencia",1,1)),minAmortizable:I("#opt-min",500),tipoAmort:((S=y.querySelector("#opt-tipo"))==null?void 0:S.value)||"plazo",fechaObjetivo:((w=y.querySelector("#opt-fecha-obj"))==null?void 0:w.value)||null,fechaPrimeraAmort:((C=y.querySelector("#opt-fecha-primera"))==null?void 0:C.value)||null,loanIds:f.length===0||x.length===f.length?null:x,sourceAccountId:((j=y.querySelector(".opt-acc-radio:checked"))==null?void 0:j.value)??null,selectedMarginIds:[...y.querySelectorAll(".opt-margin-check:checked")].map(F=>F.value)}}const d=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function b(y,I=""){const f=s("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${c(y)}</div>
        ${I?`<div class="text-sm mt-8" style="color:var(--text3)">${c(I)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);f&&(R(f,"[data-opt-volver]",u),R(f,"[data-cancelar]",i))}function h(y){const I=p(y);r()&&q("Plan anterior eliminado, recalculando…");const{loans:f,expenses:x,accounts:S,config:w,nominas:C}=d(),j=l(()=>Ne(f,x,S,w,{frecuencia:I.frecuencia,mesesHorizonte:I.horizonte,minAmortizable:I.minAmortizable,tipoAmort:I.tipoAmort,fechaPrimeraAmort:I.fechaPrimeraAmort,loanIds:I.loanIds,nominas:C,sourceAccountId:I.sourceAccountId,selectedMarginIds:I.selectedMarginIds}));if(!j)return;if(j.plan.length===0){b(`No hay excedente suficiente respetando los ${j.margenesAplicados} márgenes de seguridad activos en los próximos ${I.horizonte} meses para generar amortizaciones por encima del mínimo de ${z(I.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}a={plan:j.plan,tipoAmort:I.tipoAmort};const F=`✨ Plan de optimización · ${I.frecuencia===1?"Mensual":`Cada ${I.frecuencia} meses`} · ${I.horizonte}m`,E=s(F,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(z(j.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${c(z(j.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${c(z(j.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${j.margenesAplicados}</div></div>
      </div>
      ${j.resumenPorLoan.map(ho).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${j.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${j.plan.map(M=>bo(M,!0)).join("")}</tbody>
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
      </div>`);E&&(R(E,"[data-opt-volver]",u),R(E,"[data-cancelar]",i),R(E,"[data-opt-aplicar]",()=>{a&&m(a.plan,a.tipoAmort)}))}function $(y){const I=p(y);r();const{loans:f,expenses:x,accounts:S,config:w,nominas:C}=d(),j=l(()=>qa(f,x,S,w,{horizonte:I.horizonte,minAmortizable:I.minAmortizable,tipoAmort:I.tipoAmort,fechaObjetivo:I.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:I.fechaPrimeraAmort,loanIds:I.loanIds,nominas:C,sourceAccountId:I.sourceAccountId,selectedMarginIds:I.selectedMarginIds}));if(!j)return;if(j.resultados.length===0){b("No hay excedente suficiente en ninguna frecuencia.");return}e=j;const{resultados:F,saldoBase:E,fechaObjetivo:M}=j,P=F.map(D=>{const N=[D.esMejorIntereses&&"💰 +intereses",D.esMejorSaldo&&"🏦 +saldo",D.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${D.esMejorValor?"background:rgba(46,230,168,0.06);":""}">
          <td style="font-weight:600">${c(D.label)}</td>
          <td class="num">${D.numAmortizaciones}</td>
          <td class="num neg">${c(z(D.totalAmortizado))}</td>
          <td class="num pos">${c(z(D.ahorroIntereses))}</td>
          <td class="num ${D.saldoObjetivo>=E?"pos":"neg"}">${c(z(D.saldoObjetivo))}</td>
          <td class="num pos">${c(z(D.valorTotal))}</td>
          <td style="font-size:11px">${N}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${D.frecuencia}">Usar</button></td>
        </tr>`}).join(""),T=s(`📊 Comparativa de frecuencias · hasta ${M}`,`
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${c(M)}: <strong>${c(z(E))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${c(M.slice(0,7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${P}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);T&&(R(T,"[data-opt-volver]",u),R(T,"[data-cancelar]",i),R(T,"[data-opt-usar]",D=>A(Number(D.getAttribute("data-opt-usar")))))}function A(y){var f;const I=e==null?void 0:e.resultados.find(x=>x.frecuencia===y);I&&(r(),m(I.plan,((f=I.plan[0])==null?void 0:f.tipoAmort)||"plazo",{titulo:`✨ Plan ${I.label} · aplicado`,resumen:I,fechaObjetivo:e==null?void 0:e.fechaObjetivo}))}function m(y,I,f){if(y.length===0)return;const x=new Map;for(const w of y){const C=x.get(w.loanId)??[];C.push({_id:`${vo}${w.mes}_${w.loanId}`,fecha:w.fechaAmort,cantidad:w.cantidadAmort,tipo:I,simulacion:!0}),x.set(w.loanId,C)}let S=0;for(const w of t.loans()){const C=x.get(w._id);if(!C)continue;const j=(w.amortizaciones||[]).filter(F=>!go(F._id));t.guardarAmortizaciones(w._id,[...j,...C]),S+=1}q(`Plan aplicado: ${y.length} amortizaciones en ${S} préstamo${S!==1?"s":""} (simulación)`),f?v(f):i(),t.refrescar([...x.keys()])}function v({titulo:y,resumen:I,fechaObjetivo:f}){const x=s(y,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${c(z(I.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${c(z(I.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${c((f==null?void 0:f.slice(0,7))??"")}</div><div class="stat-value pos">${c(z(I.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${c(z(I.totalComisiones))}</div></div>
      </div>
      ${I.resumenPorLoan.map(ho).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${I.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${I.plan.map(S=>bo(S,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);x&&R(x,"[data-cancelar]",i)}return{abrir:u,get planManual(){return a},get comparativa(){return e}}}function bo(t,e){const a=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${c(z(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${c(t.mes)}</td>
    <td>${c(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${c(z(t.capitalAntes))}</td>
    <td class="num neg">${c(z(t.cantidadAmort))}${a}</td>
    <td class="num">${c(z(t.capitalDespues))}</td>
    ${e?`<td class="num" style="color:var(--text3)">${c(z(t.saldoDisponible))} → ${c(z(t.saldoDespues))}</td>`:""}
  </tr>`}function ho(t){return`<div class="card mb-8" style="padding:12px">
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
  </div>`}const ii="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function ri(t){const e=t.hoy??J;let a=!1;const o=new Set;let n=null;const s=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},i=()=>t.store.get("escenarios"),r=f=>{var x;return((x=i().find(S=>S._id===f))==null?void 0:x.nombre)??f};function l(f){if(!f.activo||f.simulacion)return!1;const x=et(f).tabla.filter(S=>!S.esAmortizacion);return x.length===0?!0:x[x.length-1].fecha<e()}function u(f,x){const S=e(),w=S.slice(0,7),C=new Map;let j=0;for(const F of f){if(!F.activo||F.simulacion||x.has(F._id)||(F.fechaInicio||"")>S)continue;const E=et(F).tabla.filter(P=>!P.esAmortizacion&&P.fecha.startsWith(w)),M=E.length>0?E[0].cuota:0;C.set(F._id,M),j+=M}return{porLoan:C,total:j,activos:[...C.values()].filter(F=>F>0).length}}function g(f){const x=t.store.get("config"),S=x.dashboardStart,w=x.dashboardEnd,C=Math.max(1,(G(w).getTime()-G(S).getTime())/(30.44*864e5));let j=0;for(const F of f)!F.activo||F.simulacion||(j+=et(F).tabla.filter(E=>!E.esAmortizacion&&E.fecha>=S&&E.fecha<=w).reduce((E,M)=>E+M.cuota,0));return{media:j/C,desde:S,hasta:w}}function p(f){const x=[...t.store.get("loans")].sort((P,T)=>T.tin-P.tin),S=new Set(x.filter(l).map(P=>P._id)),w=a?x:x.filter(P=>!S.has(P._id)),C=u(x,S),j=g(x),F=t.store.get("config"),E=t.store.get("inflacion"),M=new Date(G(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});f.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${S.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${S.size})</button>`:""}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${C.total>0||j.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${C.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${c(M)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${c(z(C.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${C.activos} préstamo${C.activos!==1?"s":""} activo${C.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${j.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${c(z(j.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${c(j.desde)} → ${c(j.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${w.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':w.map(P=>Xn(P,{periodos:E,usarInflacion:!!F.usarInflacion,hoy:e(),cuotaMes:C.porLoan.get(P._id)??0,completado:S.has(P._id),nombreEscenario:r})).join("")}
      </div>`;for(const P of f.querySelectorAll("[data-body-loan]"))o.has(P.dataset.bodyLoan??"")&&P.classList.add("open")}const d=()=>document.getElementById("modal-overlay"),b=()=>document.getElementById("modal-content"),h=()=>{var f;return(f=d())==null?void 0:f.classList.add("hidden")};function $(f,x){const S=d(),w=b();return!S||!w?null:(w.innerHTML=`<div class="modal-title">${c(f)}</div>${x}`,S.classList.remove("hidden"),R(w,"[data-cancelar]",h),w)}function A(f,x){const S=f?t.store.get("loans").find(C=>C._id===f)??null:null,w=$(f?"Editar préstamo":"Nuevo préstamo",oi(S,t.store.get("accounts"),i(),e()));w&&(w.addEventListener("change",C=>{var j;(j=C.target)!=null&&j.matches("[data-dp-modo]")&&po(w)}),R(w,"[data-guardar-loan]",C=>{m(w,C.getAttribute("data-guardar-loan")||"")&&(h(),x())}))}function m(f,x){const S=P=>{var T;return((T=f.querySelector(P))==null?void 0:T.value)??""},w=P=>{var T;return!!((T=f.querySelector(P))!=null&&T.checked)},C=S("#f-nombre").trim(),j=parseFloat(S("#f-capital")),F=parseFloat(S("#f-tin")),E=parseInt(S("#f-meses"),10);if(!C||!Number.isFinite(j)||!Number.isFinite(F)||!Number.isFinite(E))return q("Completa los campos obligatorios","err"),!1;const M={nombre:C,capital:j,tin:F,meses:E,fechaInicio:S("#f-fecha"),comisionApertura:parseFloat(S("#f-com-ap"))||0,comisionAmort:parseFloat(S("#f-com-am"))||0,diaPago:mo(f),cuenta:S("#f-cuenta"),simulacion:w("#f-sim"),activo:w("#f-activo"),mostrarFechaFinEnDashboard:w("#f-mostrar-fin"),tipoTasa:S("#f-tipo-tasa"),basico:w("#f-basico"),tags:S("#f-tags").split(",").map(P=>P.trim()).filter(Boolean),escenarioIds:[...f.querySelectorAll(".loan-escenario:checked")].map(P=>P.value)};return x?(t.store.updateItem("loans",x,M),q("Préstamo actualizado")):(t.store.addItem("loans",{...M,amortizaciones:[]}),q("Préstamo creado")),s(),!0}function v(f,x,S){const w=t.store.get("loans").find(F=>F._id===f);if(!w)return;const C=x?(w.amortizaciones||[]).find(F=>F._id===x)??null:null,j=$(x?"Editar amortización":"Añadir amortización",si(f,C,i(),e()));j&&R(j,"[data-guardar-amort]",F=>{const[E,M]=(F.getAttribute("data-guardar-amort")||"").split("|");y(j,E,M)&&(h(),S([E]))})}function y(f,x,S){var T;const w=D=>{var N;return((N=f.querySelector(D))==null?void 0:N.value)??""},C=w("#am-fecha"),j=parseFloat(w("#am-cant"));if(!C||!Number.isFinite(j)||j<=0)return q("Fecha y cantidad requeridas","err"),!1;const F=t.store.get("loans").find(D=>D._id===x);if(!F)return!1;const E={fecha:C,cantidad:j,tipo:w("#am-tipo"),simulacion:!!((T=f.querySelector("#am-sim"))!=null&&T.checked),escenarioIds:[...f.querySelectorAll(".amort-escenario:checked")].map(D=>D.value)},M=F.amortizaciones||[],P=S?M.map(D=>D._id===S?{...D,...E}:D):[...M,{_id:Date.now().toString(36),...E}];return t.store.updateItem("loans",x,{amortizaciones:P}),q(S?"Amortización actualizada":"Amortización añadida"),s(),!0}function I(f,x,S){R(f,"[data-toggle-finalizados]",()=>{a=!a,x()}),R(f,"[data-nuevo-loan]",()=>A(null,x)),R(f,"[data-optimizar]",()=>S.abrir()),R(f,"[data-toggle-loan]",(w,C)=>{var M;if((M=C.target)!=null&&M.closest("button"))return;const j=w.getAttribute("data-toggle-loan"),F=[...f.querySelectorAll("[data-body-loan]")].find(P=>P.dataset.bodyLoan===j);(F==null?void 0:F.classList.toggle("open"))?o.add(j):o.delete(j)}),R(f,"[data-editar-loan]",w=>A(w.getAttribute("data-editar-loan"),x)),R(f,"[data-borrar-loan]",w=>{if(!X("¿Eliminar préstamo?"))return;const C=w.getAttribute("data-borrar-loan");t.store.removeItem("loans",C),o.delete(C),q("Eliminado"),s(),x()}),R(f,"[data-amort-loan]",w=>{const C=w.getAttribute("data-amort-loan");o.add(C),v(C,null,x)}),R(f,"[data-editar-amort]",w=>{const[C,j]=(w.getAttribute("data-editar-amort")||"").split("|");o.add(C),v(C,j,x)}),R(f,"[data-borrar-amort]",w=>{const[C,j]=(w.getAttribute("data-borrar-amort")||"").split("|"),F=t.store.get("loans").find(E=>E._id===C);F&&(t.store.updateItem("loans",C,{amortizaciones:(F.amortizaciones||[]).filter(E=>E._id!==j)}),q("Amortización eliminada"),s(),x([C]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:ii,mount(f){const x=(S=[])=>{for(const w of S)o.add(w);p(f)};n??(n=ni({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(S,w)=>{t.store.updateItem("loans",S,{amortizaciones:w}),s()},hoy:e,refrescar:x})),p(f),f.dataset.wired!=="1"&&(I(f,x,n),f.dataset.wired="1")}}}const li={transporte:125,restaurante:220,otros:null},ci={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},di=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],kt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(n)}"/></div>`,ui=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${c(a._id)}"${a._id===e?" selected":""}>${c(a.nombre)}</option>`).join("");function pi(t,e){const a=t.map((s,i)=>{const r=e.find(g=>g._id===s.cuenta),l=li[s.tipo],u=l!=null&&s.importe>l;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${c(ci[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${c(z(s.importe))}/mes${u?` <span style="color:var(--red)" title="Supera el límite orientativo de ${c(z(l))}/mes">⚠</span>`:""}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function mi(t,e){const a=e.hoy??J(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
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
        <select class="form-select" id="nf-cuenta">${ui(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
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
              ${di.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${c(s)} (${i+1})</option>`).join("")}
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
    </div>`}function yo(t,e){const a=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const l=parseFloat(a(i));return Number.isFinite(l)?l:r},n=a("#nf-npagas"),s=n==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Pe),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:e}}function fi(t,e,a,o){const n=yo(t,e),s=e.reduce((m,v)=>m+(v.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),l=n.irpfModo==="manual"?i*(n.irpfPct/100):ut(St(n.bruto,s),a.tramos),u=i-r-l,g=i/n.nPagas,p=r/n.nPagas,d=l/n.nPagas,b=g-p-d,h=n.grupoNomina?a.nominas.filter(m=>m.grupoNomina===n.grupoNomina&&m._id!==o):[],$=h.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${c(n.grupoNomina)}" con ${c(h.map(m=>m.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",A=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${c(z(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${c(z(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${c(z(n.bruto))}</span>
      ${A}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${c(z(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${c(z(l))} (${i>0?(l/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${c(z(u))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${c(z(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${c(z(b))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${c(z(b))}/paga`:`ingreso ${c(z(g))} − SS ${c(z(p))} − IRPF ${c(z(d))}`}${s>0?" + recargas flex":""}</span>
    </div>${$}`}function vi(t,e,a,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=pi(e,a.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=fi(t,e,a,o))},i=()=>{var l,u;const r=(g,p)=>{const d=t.querySelector(g);d&&(d.style.display=p?"":"none")};r("#nf-custom-pagas-wrap",((l=t.querySelector("#nf-npagas"))==null?void 0:l.value)==="custom"),r("#nf-irpfpct-wrap",((u=t.querySelector("#nf-irpfmodo"))==null?void 0:u.value)==="manual"),s()};t.addEventListener("input",r=>{var l;(l=r.target)!=null&&l.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),Y(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),R(t,"[data-flex-anadir]",()=>{var u,g,p;const r=((u=t.querySelector("#fc-tipo"))==null?void 0:u.value)||"transporte",l=parseFloat(((g=t.querySelector("#fc-importe"))==null?void 0:g.value)??"")||0;if(!l)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:r,importe:l,cuenta:((p=t.querySelector("#fc-cuenta"))==null?void 0:p.value)||""}),n(),s()}),R(t,"[data-flex-borrar]",r=>{e.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const xo=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function gi(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??gt;function r(d,b){const h=o(),$=n();return!h||!$?null:($.innerHTML=`<div class="modal-title">${c(d)}</div>${b}`,h.classList.remove("hidden"),R($,"[data-cerrar]",s),$)}function l(){e=null;const d=[...t.store.get("tramosIRPFHistorico")].sort(($,A)=>$.año-A.año),b="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",h=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${c(xo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${d.map($=>`<div style="${b}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(xo($.tramos))}</span>
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
      </div>`);h&&(R(h,"[data-editar-tabla]",$=>{const A=$.getAttribute("data-editar-tabla");p(A==="default"?"default":Number(A))}),R(h,"[data-borrar-tabla]",$=>{const A=Number($.getAttribute("data-borrar-tabla"));X(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(m=>m.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),R(h,"[data-anadir-anyo]",()=>{var m;const $=parseInt(((m=h.querySelector("#irpf-new-year"))==null?void 0:m.value)??"",10);if(!$||$<2e3||$>2100)return q("Año inválido","err");const A=t.store.get("tramosIRPFHistorico");if(A.some(v=>v.año===$))return q("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...A,{_id:Date.now().toString(36),año:$,tramos:i().map(v=>[...v])}]),t.onDatosCambiados(),p($)}))}function u(){return a.map(([d,b],h)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${h}" value="${d}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${h}" value="${b}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${h}">✕</button>
          </div>
        </div>`).join("")}function g(d){a=[...d.querySelectorAll("[data-tr-min]")].map((h,$)=>{const A=d.querySelector(`[data-tr-pct="${$}"]`);return[parseFloat(h.value)||0,parseFloat((A==null?void 0:A.value)??"")||0]})}function p(d){var v;e=d;const b=t.store.get("tramosIRPFHistorico");a=(d==="default"?i():((v=b.find(y=>y.año===d))==null?void 0:v.tramos)??i()).map(y=>[...y]);const $=d==="default"?"tabla por defecto":`ejercicio ${d}`,A=r(`Tramos IRPF — ${d==="default"?"Por defecto":d}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${c($)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!A)return;const m=()=>{const y=A.querySelector("#irpf-tramos-rows");y&&(y.innerHTML=u())};R(A,"[data-volver]",l),R(A,"[data-tr-anadir]",()=>{g(A),a.push([0,0]),m()}),R(A,"[data-tr-borrar]",y=>{g(A),a.splice(Number(y.getAttribute("data-tr-borrar")),1),m()}),R(A,"[data-tr-guardar]",()=>{g(A);const y=[...a].sort((I,f)=>I[0]-f[0]);if(y.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:y}),q("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(I=>I.año===e?{...I,tramos:y}:I)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}const $o=1500,_t=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${c(o)}" placeholder="${c(n)}"/></div>`,bi=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${c(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${c(n)}"${n===o?" selected":""}>${c(s)}</option>`).join("")}
   </select></div>`,hi=t=>(t.modeloFondo||"cuenta")==="pension";function yi(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>xi(n,e,a,o)).join("")}</div>`}function xi(t,e,a,o){const n=ue(t);if(!n)return"";const s=_e(t,e,a),i=o.slice(0,4),r=(t.aportaciones||[]).filter(u=>u.fecha>=`${i}-01-01`).reduce((u,g)=>u+g.cantidad,0),l=Math.min(r,$o)*(s/100);return`<div class="card">
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
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${c(z(n.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(z(n.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${n.beneficio>=0?"pos":"neg"}">${c(z(n.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(z(n.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(z(n.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>$o?"neg":""}">${c(z(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${c(z(l))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${c(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${c(n.proxDesbloqueo)}</div>`:""}
  </div>`}function $i(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Ii(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
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
      ${bi("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
    </div>`}function Ai(t,e,a){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=$i(e))};Y(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),R(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#paport-fin"))==null?void 0:l.value)||""}),o()}),R(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Si(t,e,a,o){var A;const n=m=>{var v;return((v=t.querySelector(m))==null?void 0:v.value)??""},s=(m,v=0)=>{const y=parseFloat(n(m));return Number.isFinite(y)?y:v},i=m=>{var v;return!!((v=t.querySelector(m))!=null&&v.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const l=s("#pen-saldo"),u=n("#pen-grupo"),g={nombre:r,grupoNomina:u,saldo:l,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:u?0:s("#pen-impuesto"),planAportaciones:e,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(m=>m.value)},p=[...(a==null?void 0:a.historicoSaldos)??[]],d=[...(a==null?void 0:a.aportaciones)??[]],h=((A=[...p].sort((m,v)=>v.fecha.localeCompare(m.fecha))[0])==null?void 0:A.saldo)??(a==null?void 0:a.saldo)??null,$=Date.now().toString(36);return a?(h===null||Math.abs(l-h)>.005)&&(p.push({_id:$,fecha:o,saldo:l,nota:"Actualización manual"}),l>(h??0)&&d.push({_id:`${$}a`,fecha:o,cantidad:l-(h??0)})):l>0&&(p.push({_id:$,fecha:o,saldo:l,nota:"Saldo inicial"}),d.push({_id:`${$}a`,fecha:g.fechaInicialSaldo??o,cantidad:l})),{datos:{...g,historicoSaldos:p,aportaciones:d}}}const wi="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Mi(t){const e=t.hoy??J,a=()=>{var A;return(A=t.onDatosCambiados)==null?void 0:A.call(t)};function o(){const A=t.store.get("config");return bt(t.store.get("tramosIRPFHistorico"),A.tramos_irpf??gt)(Number(e().slice(0,4)))}function n(A,m,v){const y=De(A,m,v),I=!!m&&A.irpfModo!=="manual",f=[A.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${A.mesActualizacionIPC}">IPC m${A.mesActualizacionIPC}</span>`:"",y.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${c(z(y.flexAnual))}/año</span>`:"",Math.abs(y.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${y.ssPct.toFixed(2)}%</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${c(A.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${f}</div>
      </div>
      <div class="num">${c(z(y.brutoAnual))}
        ${y.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${c(z(y.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${c(z(y.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${y.nPagas} pagas</div>
      <div class="text-sm ${I?"neg":""}">${A.irpfModo==="manual"?`${c(A.irpfPct??0)}% (manual)`:`${y.irpfPct.toFixed(1)}% (auto)`}${I?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${A.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${c(s(A.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${c(A._id)}"${A.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${c(A._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${c(A._id)}">✕</button>
      </div>
    </div>`}const s=A=>{var m;return((m=t.store.get("accounts").find(v=>v._id===(A||"default")))==null?void 0:m.nombre)??(A||"default")};function i(A,m,v){const y=m.reduce((x,S)=>x+(S.bruto||0),0),I=ns(m,v),f=y>0?I/y*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${c(A)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${c(z(y))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${f.toFixed(1)}%</strong> (${c(z(I))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${m.map(x=>n(x,m,v)).join("")}
      </div>
    </div>`}function r(A){const m=o(),v=[...t.store.get("nominas")].sort((S,w)=>(w.bruto||0)-(S.bruto||0)),{grupos:y,sueltas:I}=rs(v),f=t.store.get("accounts").filter(hi),x=v.filter(S=>S.activo!==!1);A.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${v.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...y.entries()].map(([S,w])=>i(S,w,m)).join("")}
      ${I.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${I.map(S=>n(S,null,m)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${yi(f,x,m,e())}</div>`}const l=()=>document.getElementById("modal-overlay"),u=()=>document.getElementById("modal-content"),g=()=>{var A;return(A=l())==null?void 0:A.classList.add("hidden")};function p(A,m){const v=l(),y=u();return!v||!y?null:(y.innerHTML=`<div class="modal-title">${c(A)}</div>${m}`,v.classList.remove("hidden"),R(y,"[data-cancelar]",g),y)}function d(A,m){const v=A?t.store.get("nominas").find(x=>x._id===A)??null:null,y=[...(v==null?void 0:v.retribucionFlexible)??[]].map(x=>({...x})),I={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:o(),hoy:e()},f=p(A?"Editar nómina":"Nueva nómina",mi(v,I));f&&(vi(f,y,I,A??""),R(f,"[data-guardar-nomina]",x=>{const S=yo(f,y);if(!S.nombre||S.bruto<=0)return q("Nombre y bruto anual son obligatorios","err");const w=x.getAttribute("data-guardar-nomina")||"",C={...S,activo:!0,tags:["nomina"]};w?(t.store.updateItem("nominas",w,C),q("Nómina actualizada")):(t.store.addItem("nominas",C),q("Nómina creada")),a(),g(),m()}))}function b(A,m){const v=A?t.store.get("accounts").find(f=>f._id===A)??null:null,y=[...(v==null?void 0:v.planAportaciones)??[]].map(f=>({...f})),I=p(A?"Editar plan de pensiones":"Nuevo plan de pensiones",Ii(v,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:e()}));I&&(Ai(I,y,e()),R(I,"[data-guardar-pension]",f=>{const{datos:x,error:S}=Si(I,y,v,e());if(S)return q(S,"err");const w=f.getAttribute("data-guardar-pension")||"";w?(t.store.updateItem("accounts",w,x),q("Plan actualizado")):(t.store.addItem("accounts",x),q("Plan creado")),a(),g(),m()}))}function h(A,m,v){R(A,"[data-nueva-nomina]",()=>d(null,m)),R(A,"[data-editar-nom]",y=>d(y.getAttribute("data-editar-nom"),m)),R(A,"[data-borrar-nom]",y=>{X("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",y.getAttribute("data-borrar-nom")),q("Eliminada"),a(),m())}),Y(A,"[data-activo-nom]",y=>{const I=y;t.store.updateItem("nominas",I.getAttribute("data-activo-nom"),{activo:I.checked}),a(),m()}),R(A,"[data-tramos]",()=>v.abrir()),R(A,"[data-nueva-pension]",()=>b(null,m)),R(A,"[data-editar-pension]",y=>b(y.getAttribute("data-editar-pension"),m)),R(A,"[data-borrar-pension]",y=>{X("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",y.getAttribute("data-borrar-pension")),q("Plan eliminado"),a(),m())})}let $=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:wi,mount(A){const m=()=>r(A);$??($=gi({store:t.store,onDatosCambiados:()=>{a(),m()},año:()=>Number(e().slice(0,4))})),r(A),A.dataset.wired!=="1"&&(h(A,m,$),A.dataset.wired="1")}}}const Ci="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",ji="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",Io={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},zi={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function Fi(t,e){const a=t.filter(l=>l.activo&&mt(l)==="inversion");if(a.length===0)return"";let o=0,n=0,s=0,i=0;for(const l of a){const u=Rt(l,e);u&&(o+=u.saldo,n+=u.costBase,s+=u.plusvalia,i+=u.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${c(z(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${c(z(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${c(r)}%)</div><div class="stat-value ${s>=0?"pos":"neg"}">${c(z(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${c(z(i))}</div><div class="stat-sub">Neto: ${c(z(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function Ei(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,n=Math.max(1,(G(o).getTime()-G(a).getTime())/(30.44*864e5)),s=Vt(t,a),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(e.config.usarInflacion&&e.inflacion.length>0){const l=s*(pt(e.inflacion,a,o)-1),u=i-l;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${c(z(l))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${u>=0?"var(--accent)":"var(--red)"};font-weight:600">${c(z(u))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${c(a.slice(0,7))} → ${c(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${c(z(i))}</span>
    </div>${r}
  </div>`}function _i(t,e){const a=Io[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,n=e.nominas.flatMap(b=>(b.retribucionFlexible??[]).filter(h=>h.cuenta===t._id).map(h=>({nomina:b,importe:h.importe}))),s=n.reduce((b,h)=>b+h.importe,0),i=s*12,r=o!==null&&i>o,l=o!==null?Math.min(i,o):i,u=t.grupoNomina?e.nominas.filter(b=>(b.grupoNomina||"")===t.grupoNomina&&b.activo!==!1):n.slice(0,1).map(b=>b.nomina),g=xa(u,e.tramosIRPF),p=l*g/100,d=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${g}%`:`tipo marginal ${g}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${c(a.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${c(z(s))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${c(z(i))}/año${r?` ⚠ excede límite ${c(z(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${c(z(o))}/año</span></div>`:""}
    ${p>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${c(d)}">≈ ${c(z(p))}/año <span style="font-size:10px;color:var(--text3)">(${c(g)}%)</span></span></div>`:""}
    ${n.length>0?n.map(b=>`<div style="font-size:11px;color:var(--text3)">↩ ${c(b.nomina.nombre)}: ${c(z(b.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function Pi(t){const e=ue(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${c(z(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${c(z(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${c(z(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${c(z(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${c(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${c(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function Ti(t,e){const a=Rt(t,e.tramosGanancias);if(!a)return"";const o=e.config,n=e.flujos(t._id),s=G(o.dashboardStart),i=G(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),l=a.saldo+n.totalAportaciones-n.totalReembolsos,u=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,g=l>0&&r>0?Math.max(0,l*Math.pow(1+u,r)):Math.max(0,l),p=a.costBase+n.totalAportaciones,d=Math.max(0,g-p),b=Ee(d,e.tramosGanancias),h=d>0?(b/d*100).toFixed(1):"0",$=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",A=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",m=(S,w,C)=>S.map(j=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${w} ${c(j.contraparte)}: ${c(j.concepto)}</span>
          <span class="num ${C}">${c(z(j.total))} · ${j.ocurrencias} mov.</span>
        </div>`).join(""),y=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${c(o.dashboardStart.slice(0,7))} → ${c(o.dashboardEnd.slice(0,7))})</div>
         ${m(n.entradas,"↓","pos")}
         ${m(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${c(z(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${c(z(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${c(z(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',I=e.invModo(t._id),f=S=>`padding:3px 10px;border-radius:20px;border:1px solid ${S?"var(--accent)":"var(--border)"};background:${S?"var(--accent-dim)":"transparent"};color:${S?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,x=I==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${c(z(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${c(z(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${c(z(a.neto))}</div><div class="stat-sub">${c(A)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${c(z(p))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${c(z(g))}</div><div class="stat-sub">${c($)} · ${c(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${c(z(g-b))}</div><div class="stat-sub">${c(h)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${c(t._id)}|real" style="${f(I==="real")}">Real</button>
          <button data-inv-modo="${c(t._id)}|proyeccion" style="${f(I==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${x}
      ${y}
    </div>`}function Di(t,e){const a=[...t.historicoSaldos||[]].sort((l,u)=>u.fecha.localeCompare(l.fecha)),o=a[0],n=rt(t),s=mt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${c((Io[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(l=>`<span class="badge badge-yellow">🔭 ${c(e.nombreEscenario(l))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${c(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${c(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${c(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${ji}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${c(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Ci}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${c(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${c(z(t.saldoInicial||0))}</div><div class="stat-sub">${c(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${c(z(n))}</div>${o?`<div class="stat-sub">Registro: ${c(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${c(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${c(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${Ei(t,e)}
    ${s==="beneficio"?_i(t,e):""}
    ${s==="pension"?Pi(t):""}
    ${s==="inversion"?Ti(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${c(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${c(t.descripcion)}</div>`:""}
  </div>`}const Ri=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function Oi(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Ni(t,e){const a=t?mt(t):"cuenta",o=[...new Set(e.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${Z("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Lt("ac-modelo","Tipo",Ri,a)}
    </div>
    <div class="grid-2 mt-8">
      ${Z("ac-saldo","Saldo actual (€)","number",e.saldoActual,"5000")}
      ${Z("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Z("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${Z("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
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
    </div>`}function qi(t,e,a){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=Oi(e))};Y(t,"#ac-modelo",n=>{const s=n.value,i=(r,l)=>{const u=t.querySelector(r);u&&(u.style.display=l?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),R(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#aport-fin"))==null?void 0:l.value)||""}),o()}),R(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Li(t,e,a,o,n){const s=h=>{var $;return(($=t.querySelector(h))==null?void 0:$.value)??""},i=(h,$=0)=>{const A=parseFloat(s(h));return Number.isFinite(A)?A:$},r=h=>{var $;return!!(($=t.querySelector(h))!=null&&$.checked)},l=s("#ac-nombre").trim();if(!l)return{datos:{},error:"Nombre obligatorio"};const u=s("#ac-modelo")||"cuenta",g=u==="beneficio",p=i("#ac-saldo"),d={nombre:l,saldo:p,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(h=>h.value),modeloFondo:u,planAportaciones:e,tipoBeneficio:g?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:g?s("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&p<=0)return{datos:d};if(!(o===null||Math.abs(p-o)>.005))return{datos:d};if(u==="inversion"&&p>(o??0)){const h=Date.now().toString(36);d.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${h}a`,fecha:a?n:d.fechaInicialSaldo??n,cantidad:p-(o??0)}]}return{datos:d,punto:{fecha:n,saldo:p,nota:a?"Actualización manual":"Saldo inicial"}}}function Xe(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:tt(e.saldoCts),nota:e.nota}))}function ki(t,e,a,o,n){const s=a.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${c(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${c(z(i.saldo))}</span>
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
    </div>`}const Ao=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function Bi(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var d;return(d=o())==null?void 0:d.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??jt;function r(d,b){const h=o(),$=n();return!h||!$?null:($.innerHTML=`<div class="modal-title">${c(d)}</div>${b}`,h.classList.remove("hidden"),R($,"[data-cerrar]",s),$)}function l(){e=null;const d=[...t.store.get("tramosGananciasCapitalHistorico")].sort(($,A)=>$.año-A.año),b="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",h=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${c(Ao(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${d.map($=>`<div style="${b}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${c(Ao($.tramos))}</span>
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
      </div>`);h&&(R(h,"[data-editar-tg]",$=>{const A=$.getAttribute("data-editar-tg");p(A==="default"?"default":Number(A))}),R(h,"[data-borrar-tg]",$=>{const A=Number($.getAttribute("data-borrar-tg"));X(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(m=>m.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),R(h,"[data-anadir-anyo-tg]",()=>{var m;const $=parseInt(((m=h.querySelector("#tg-new-year"))==null?void 0:m.value)??"",10);if(!$||$<2e3||$>2100)return q("Año inválido","err");const A=t.store.get("tramosGananciasCapitalHistorico");if(A.some(v=>v.año===$))return q("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...A,{_id:Date.now().toString(36),año:$,tramos:i().map(v=>[...v])}]),t.onDatosCambiados(),p($)}))}function u(){return a.map(([d,b],h)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${h}" value="${d}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${h}" value="${b}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${h}">✕</button>
          </div>
        </div>`).join("")}function g(d){a=[...d.querySelectorAll("[data-tg-min]")].map((b,h)=>{const $=d.querySelector(`[data-tg-pct="${h}"]`);return[parseFloat(b.value)||0,parseFloat(($==null?void 0:$.value)??"")||0]})}function p(d){var m;e=d;const b=t.store.get("tramosGananciasCapitalHistorico");a=(d==="default"?i():((m=b.find(v=>v.año===d))==null?void 0:m.tramos)??i()).map(v=>[...v]);const $=r(`Ganancias de capital — ${d==="default"?"Por defecto":d}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!$)return;const A=()=>{const v=$.querySelector("#tg-rows");v&&(v.innerHTML=u())};R($,"[data-volver-tg]",l),R($,"[data-tg-anadir]",()=>{g($),a.push([0,0]),A()}),R($,"[data-tg-borrar]",v=>{g($),a.splice(Number(v.getAttribute("data-tg-borrar")),1),A()}),R($,"[data-tg-guardar]",()=>{g($);const v=[...a].sort((y,I)=>y[0]-I[0]);if(v.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:v}),q("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(y=>y.año===e?{...y,tramos:v}:y)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}function Hi(t){function e(){if(t.navegar)return t.navegar("planner");const s=globalThis.Router;s==null||s.navigate("planner")}function a(s,i,r){const l=fa(s,i,r),u=s.targetAmount||0,g=u>0?Math.min(100,l/u*100):0;return`
      <div style="padding:8px 0;border-bottom:1px solid var(--hairline-soft)">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:500">${c(s.nombre)}</span>
          <span class="num" style="font-size:11px;color:var(--text3)">
            ${c(z(l))} / ${c(z(u))}
          </span>
        </div>
        <div class="goal-bar"><div class="goal-bar-fill" style="width:${g}%;background:${c(s.color||"var(--accent)")}"></div></div>
      </div>`}function o(s){const i=t.store.get("goals");if(i.length===0){s.innerHTML="",s.style.display="none";return}s.style.display="";const r=t.store.get("accounts"),l=t.colchonEnFecha(t.hoy()),u=[...i].sort((g,p)=>(g.prioridad||99)-(p.prioridad||99));s.innerHTML=`
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro (antiguos)</div>
        <button class="btn-primary btn-sm" data-ir-planner>Ir a Objetivos financieros</button>
      </div>
      <div class="text-sm mb-12" style="color:var(--text2);line-height:1.6">
        Estos objetivos se gestionan ahora en <strong>Objetivos financieros</strong>, donde compiten por tu
        flujo mensual en vez de medir solo el saldo de unas cuentas. Ya se copiaron allí; esto es solo la
        copia antigua, en modo lectura.
      </div>
      ${u.map(g=>a(g,r,l)).join("")}
      <div class="mt-12">
        <button class="btn-secondary btn-sm" data-descartar-goals style="color:var(--red)">Descartar los antiguos</button>
        <div class="text-sm mt-4" style="color:var(--text3)">
          Comprueba antes que están en Objetivos financieros: esto no se puede deshacer.
        </div>
      </div>`}function n(s,i){R(s,"[data-ir-planner]",()=>e()),R(s,"[data-descartar-goals]",()=>{const r=t.store.get("goals").length;if(X(`Se van a borrar ${r} objetivo${r!==1?"s":""} de ahorro antiguos. ¿Seguro?`)){for(const l of[...t.store.get("goals")])t.store.removeItem("goals",l._id);q("Objetivos antiguos descartados"),t.onDatosCambiados(),i()}})}return{render:o,wire:n}}const Gi="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",Vi=120;function Ui(t){const e=t.hoy??J,a=()=>{var E;return(E=t.onDatosCambiados)==null?void 0:E.call(t)},o=t.mostrarObjetivos??(()=>!0),n=new Map,s=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),r=E=>{var M;return((M=i().find(P=>P._id===E))==null?void 0:M.nombre)??E},l=E=>{var M;return((M=t.store.get("accounts").find(P=>P._id===E))==null?void 0:M.nombre)??E},u=()=>bt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??gt)(Number(e().slice(0,4))),g=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??jt),p=()=>g()(Number(e().slice(0,4))),d=E=>Da(t.store.get("expenses"),s(),t.store.get("loans"),E);function b(){const E=s(),M=t.store.get("accounts"),P=Jt({loans:[],expenses:t.store.get("expenses").filter(k=>k.tipo==="transferencia"),accounts:M,config:{dashboardStart:E.dashboardStart,dashboardEnd:E.dashboardEnd,fechaReferencia:E.dashboardStart},nominas:[],resolverTramosGanancias:g()}),T=new Map,D=k=>{let L=T.get(k);return L||(L={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},T.set(k,L)),L},N=(k,L)=>{const B=`${L.sourceId}`,O=k.find(U=>U.concepto===B),H=O??{concepto:B,contraparte:"",total:0,ocurrencias:0};H.total+=Math.abs(L.cuantia),H.ocurrencias+=1,O||k.push(H)};for(const k of P){if(!k.cuenta)continue;const L=D(k.cuenta);k.sourceType==="transfer-in"||k.sourceType==="traspaso-in"?(L.totalAportaciones+=Math.abs(k.cuantia),N(L.entradas,k)):k.sourceType==="transfer-out"||k.sourceType==="traspaso-out"?(L.totalReembolsos+=Math.abs(k.cuantia),N(L.salidas,k)):k.sourceType==="investment-tax"&&(L.retencion+=Math.abs(k.cuantia))}const _=t.store.get("expenses");for(const k of T.values())for(const[L,B]of[[k.entradas,"cuenta"],[k.salidas,"cuentaDestino"]])for(const O of L){const H=_.find(U=>U._id===O.concepto);O.contraparte=l((H==null?void 0:H[B])??"default"),O.concepto=(H==null?void 0:H.concepto)||(B==="cuenta"?"Aportación":"Reembolso")}return T}function h(){const E=new Map,M=s(),P=e(),T=new Date(Number(P.slice(0,4)),Number(P.slice(5,7))-1+Vi+1,0),D=`${T.getFullYear()}-${String(T.getMonth()+1).padStart(2,"0")}-${String(T.getDate()).padStart(2,"0")}`;return N=>{const _=E.get(N._id);if(_)return _;const k=Jt({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...M,dashboardStart:P,dashboardEnd:D,fechaReferencia:P},filtroAccounts:[N._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),M.tramos_irpf??gt),resolverTramosGanancias:g()}).map(L=>({fecha:L.fecha,saldoAcum:L.saldoAcum}));return E.set(N._id,k),k}}const $=Hi({store:t.store,colchonEnFecha:d,extractoCuenta:E=>A(E),hoy:e,onDatosCambiados:a});let A=h();function m(E){A=h();const P=t.store.get("accounts").filter(_=>mt(_)!=="pension"),T=b(),D={config:s(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:u(),tramosGanancias:p(),nombreEscenario:r,flujos:_=>T.get(_)??zi,invModo:_=>n.get(_)??"proyeccion"};E.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${Fi(P,D.tramosGanancias)}
      <div class="grid-3">${P.map(_=>Di(_,D)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const N=E.querySelector("#goals-section");N&&$.render(N)}const v=()=>document.getElementById("modal-overlay"),y=()=>document.getElementById("modal-content"),I=()=>{var E;return(E=v())==null?void 0:E.classList.add("hidden")};function f(E,M){const P=v(),T=y();return!P||!T?null:(T.innerHTML=E?`<div class="modal-title">${c(E)}</div>${M}`:M,P.classList.remove("hidden"),R(T,"[data-cancelar]",I),T)}function x(E,M){const P=E?t.store.get("accounts").find(_=>_._id===E)??null:null,T=[...(P==null?void 0:P.planAportaciones)??[]].map(_=>({..._})),D=P?S(P):null,N=f(E?"Editar cuenta / fondo":"Nueva cuenta / fondo",Ni(P,{escenarios:i(),nominas:t.store.get("nominas"),hoy:e(),saldoActual:D??0}));N&&(qi(N,T,e()),R(N,"[data-guardar-acc]",_=>{const k=_.getAttribute("data-guardar-acc")||"",{datos:L,punto:B,error:O}=Li(N,T,P,D,e());if(O)return q(O,"err");let H=k;k?t.store.updateItem("accounts",k,L):H=t.store.addItem("accounts",L)._id,B&&t.ledger.registrarPuntoControl(H,B.fecha,B.saldo,B.nota),q(k?"Actualizada":"Cuenta / fondo creado"),a(),I(),M()}))}function S(E){const M=t.ledger.puntosControl(E._id);return M.length>0?Xe(M)[0].saldo:E.saldo??null}function w(E,M){const P=t.store.get("accounts").find(N=>N._id===E);if(!P)return;const T=f("Histórico de saldos",ki(P.nombre,E,Xe(t.ledger.puntosControl(E)),P.saldoInicial||0,e()));if(!T)return;const D=()=>{M(),w(E,M)};R(T,"[data-hist-anadir]",()=>{var L,B,O;const N=((L=T.querySelector("#hi-fecha"))==null?void 0:L.value)??"",_=parseFloat(((B=T.querySelector("#hi-saldo"))==null?void 0:B.value)??""),k=((O=T.querySelector("#hi-nota"))==null?void 0:O.value.trim())??"";if(!N||!Number.isFinite(_))return q("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(E,N,_,k||void 0),q("Punto añadido"),a(),D()}),R(T,"[data-hist-borrar]",N=>{const[,_]=(N.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(_),q("Eliminado"),a(),D()}),R(T,"[data-hist-inicial]",N=>{const[_,k]=(N.getAttribute("data-hist-inicial")||"").split("|"),L=t.ledger.puntosControl(_).find(O=>O._id===k);if(!L)return;const B=Xe([L])[0].saldo;t.store.updateItem("accounts",_,{saldoInicial:B,fechaInicialSaldo:L.fecha}),q(`Punto inicial → ${L.fecha} (${z(B)})`),a(),D()})}function C(E){const M=t.store.get("accounts").filter(D=>D.activo);if(M.length===0)return q("No hay cuentas activas","err");const P=e(),T=M.map(D=>`• ${D.nombre}: ${z(S(D)??D.saldoInicial??0)}`).join(`
`);if(X(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${P})?

${T}

Esto recalibra el punto de arranque del dashboard.`)){for(const D of M)t.store.updateItem("accounts",D._id,{saldoInicial:S(D)??D.saldoInicial??0,fechaInicialSaldo:P});q("Saldo base actualizado"),a(),E()}}function j(E,M,P){R(E,"[data-nueva-acc]",()=>x(null,M)),R(E,"[data-editar-acc]",T=>x(T.getAttribute("data-editar-acc"),M)),R(E,"[data-tramos-ganancias]",()=>P.abrir()),R(E,"[data-reset-base]",()=>C(M)),R(E,"[data-hist-acc]",T=>w(T.getAttribute("data-hist-acc"),M)),R(E,"[data-principal-acc]",T=>{const D=T.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(N=>({...N,esCuentaPrincipal:N._id===D}))),q("Cuenta marcada como principal"),a(),M()}),R(E,"[data-borrar-acc]",T=>{const D=T.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return q("Debe existir al menos una cuenta","err");if(!X("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",D);const _=t.store.get("accounts");_.length>0&&!_.some(k=>k.esCuentaPrincipal)&&t.store.set("accounts",_.map((k,L)=>L===0?{...k,esCuentaPrincipal:!0}:k)),q("Cuenta eliminada"),a(),M()}),R(E,"[data-inv-modo]",T=>{const[D,N]=(T.getAttribute("data-inv-modo")||"").split("|");n.set(D,N==="real"?"real":"proyeccion"),M()}),$.wire(E,M)}let F=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:Gi,mount(E){const M=()=>m(E);F??(F=Bi({store:t.store,onDatosCambiados:()=>{a(),M()},año:()=>Number(e().slice(0,4))})),m(E),E.dataset.wired!=="1"&&(j(E,M,F),E.dataset.wired="1")}}}const at=(t,e,a="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${a};font-size:12px;padding:5px 10px">${c(z(e))}</td>
  </tr>`,Ze=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${c(t)}</td></tr>`;function So(t){const a=t.capMobiliario!==0||t.gananciasFondos!==0?`${at("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
       ${at("Ganancias patrimoniales (fondos/acciones)",t.gananciasFondos,t.gananciasFondos>=0?"var(--text)":"var(--green)",!0)}`:'<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>',o=t.resultado>0?"var(--red)":"var(--green)",n=t.resultado>0?"🔴 A PAGAR":"🟢 A DEVOLVER";return`
    <table style="width:100%;border-collapse:collapse">
      ${Ze("RENDIMIENTOS DEL TRABAJO")}
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

      ${Ze("BASE DEL AHORRO")}
      ${a}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${c(z(t.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${c(z(t.cuotaAho))}</td>
      </tr>

      ${Ze("RESULTADO")}
      ${at("Cuota íntegra total",t.cuotaIntegra,"var(--red)")}
      ${at("− Retenciones en nómina",-t.retNomina,"var(--green)",!0)}
      ${t.retCapital!==0?at("− Retenciones de capital mobiliario",-t.retCapital,"var(--green)",!0):""}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${n}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${o}">${c(z(Math.abs(t.resultado)))}</td>
      </tr>
    </table>`}const se=(t,e,a,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${c(e)}</label>
    <input type="number" id="${t}" class="form-input" value="${c(a)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${c(o)}</div>`:""}
  </div>`;function Yi(t){const e=t.extras,a=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
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
          ${t.nominas.length>0?t.nominas.map(o=>`• ${c(o.nombre)}: ${c(z(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${c(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${So(t.declaracion)}</div>
      </div>
    </div>`}function wo(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((a,o)=>a[0]-o[0]).map(([a,o],n,s)=>{const i=n<s.length-1?s[n+1][0]:null,r=i!==null?`${z(a)} – ${z(i)}`:`Más de ${z(a)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${c(r)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${c(o)}%</td>
      </tr>`}).join("")}
  </table>`}const Ji=(t,e,a)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${c(e)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${a}</div>
  </div>`,ct=(t,e,a="")=>`<div class="stat-card"><div class="stat-label">${c(t)}</div><div class="stat-value ${a}">${c(e)}</div></div>`,yt=(t,e,a="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${c(t)}</span><span class="num ${a}">${c(e)}</span></div>`;function Wi(t,e,a){const o=t.filter(l=>(l.modeloFondo||"cuenta")==="inversion");if(o.length===0)return Ji("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let n=0,s=0,i=0;const r=o.map(l=>{const u=Rt(l,e);if(!u)return"";n+=u.saldo,s+=u.costBase,i+=u.impuesto;const g=u.costBase>0?u.plusvalia/u.costBase*100:0,p=(l.escenarioIds||[]).map(d=>`<span class="badge badge-yellow">🔭 ${c(a(d))}</span>`).join("");return`
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${c(l.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${p}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            ${ct("Valor actual",z(u.saldo))}
            ${ct("Coste base (aportado)",z(u.costBase))}
          </div>
          <div class="grid-2" style="gap:8px">
            ${ct(`Plusvalía latente (${g>=0?"+":""}${g.toFixed(1)}%)`,z(u.plusvalia),u.plusvalia>=0?"pos":"neg")}
            ${ct("Imp. ganancias de capital (est.)",z(u.impuesto),"neg")}
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${c(z(u.neto))}</span>
          </div>
        </div>`}).join("");return`
    <div class="card mb-16" style="border:1px solid rgba(99,102,241,0.3)">
      <div class="card-title">Cartera de fondos — resumen</div>
      <div class="grid-3" style="gap:8px;margin-bottom:10px">
        ${ct("Valor total de la cartera",z(n))}
        ${ct("Total aportado (coste base)",z(s))}
        ${ct("Plusvalía latente total",z(n-s),n-s>=0?"pos":"neg")}
      </div>
      <div class="grid-2" style="gap:8px">
        ${ct("Impuesto estimado si se liquida todo",z(i),"neg")}
        ${ct("Neto tras impuestos (cartera completa)",z(n-i),"pos")}
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
      ${wo(e)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function Qi(t){const{nominas:e,planes:a,tramos:o}=t,n=b=>b.grupoNomina?e.filter(h=>(h.grupoNomina||"")===b.grupoNomina):null,s=e.map(b=>({n:b,d:De(b,n(b),o)})),i=s.reduce((b,h)=>b+h.d.brutoAnual,0),r=s.reduce((b,h)=>b+h.d.irpfAnual,0),l=s.reduce((b,h)=>b+h.d.ssAnual,0),u=s.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':s.map(({n:b,d:h})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${c(b.nombre)}</div>
          ${yt("Bruto anual",z(h.brutoAnual))}
          ${h.flexAnual>0?yt("− Retribución flexible exenta",z(-h.flexAnual),"pos"):""}
          ${yt("− Cotización SS",z(-h.ssAnual),"neg")}
          ${yt(`− IRPF estimado (${h.irpfPct.toFixed(1)} %)`,z(-h.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${c(z(h.baseDineraria-h.ssAnual-h.irpfAnual))}</span>
          </div>
        </div>`).join(""),g=xa(e,o),p=`${t.hoy.slice(0,4)}-01-01`,d=a.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':a.map(b=>{const h=ue(b);if(!h)return"";const $=(b.aportaciones||[]).filter(y=>y.fecha>=p).reduce((y,I)=>y+I.cantidad,0),m=Math.min($,Ft)*g/100,v=$>Ft;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${c(b.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${yt("Valor actual",z(h.saldo))}
          ${yt("Coste base (total aportado)",z(h.costBase))}
          ${yt("Revalorización",z(h.beneficio),h.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${c(t.hoy.slice(0,4))}</div>
            ${yt("Aportado",`${z($)}${v?" ⚠":""}`,v?"neg":"")}
            ${yt("Límite deducible",z(Ft))}
            ${yt(`Ahorro IRPF est. (marginal ${g} %)`,z(m),"pos")}
            ${v?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${c(z(Ft))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${h.proxDesbloqueo?`· Próx. desbloqueo: ${c(h.proxDesbloqueo)}`:""}
          </div>
        </div>`}).join("");return`
    <div class="card mb-16">
      <div class="card-title mb-10">Nóminas activas — importes anuales</div>
      <div class="grid-4" style="gap:8px;margin-bottom:14px">
        ${ct("Bruto anual total",z(i))}
        ${ct("Cotización SS anual",z(l),"neg")}
        ${ct("IRPF estimado anual",z(r),"neg")}
        ${ct("Neto anual",z(i-l-r),"pos")}
      </div>
      <div class="grid-3">${u}</div>
    </div>

    <div class="card-title mb-8">Planes de pensiones</div>
    <div class="auth-hint mb-14" style="border-color:var(--yellow)">
      💼 <strong>Diferencia clave frente a los fondos de inversión:</strong> el rescate de un plan de pensiones tributa en la
      <strong>base general del IRPF</strong> (tramos ordinarios hasta el 47 %), <em>no</em> en la base del ahorro. Las
      aportaciones son deducibles hasta <strong>${c(z(Ft))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${d}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${wo(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const he=(t,e)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${c(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${c(e)}</div>
  </div>`;function Ki(){return`
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
    </div>`}const Mo=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],Xi="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function Zi(t){const e=t.hoy??J;let a="declaracion",o={};const n=()=>t.store.get("config"),s=()=>Number(e().slice(0,4)),i=()=>t.store.get("nominas").filter(v=>v.activo),r=()=>t.store.get("accounts").filter(v=>(v.modeloFondo||"cuenta")==="pension"),l=v=>{var y;return((y=t.store.get("escenarios").find(I=>I._id===v))==null?void 0:y.nombre)??v},u=()=>bt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??gt)(s()),g=()=>bt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??jt)(s());function p(){const v=`${s()}-01-01`,y=t.store.get("nominas").filter(x=>x.activo&&!x.simulacion),I=r().reduce((x,S)=>x+(S.aportaciones||[]).filter(w=>w.fecha>=v).reduce((w,C)=>w+C.cantidad,0),0),f=t.store.get("expenses").filter(x=>x.activo&&x.sujetoIRPF&&x.tipo==="ingreso").reduce((x,S)=>x+$a(S),0);return Aa({nominas:y,aportacionesPension:I,otrosIngresos:f,extras:o,tramosGeneral:u(),tramosAhorro:g()})}function d(){const v=u(),y=i(),I=M=>M.grupoNomina?y.filter(P=>(P.grupoNomina||"")===M.grupoNomina):null,f=y.map(M=>De(M,I(M),v)),x=f.reduce((M,P)=>M+P.brutoAnual,0),S=f.reduce((M,P)=>M+P.irpfAnual,0),w=f.reduce((M,P)=>M+P.ssAnual,0),C=t.store.get("accounts").filter(M=>(M.modeloFondo||"cuenta")==="inversion");let j=0,F=0;for(const M of C){const P=Rt(M,g());P&&(j+=P.plusvalia,F+=P.impuesto)}if(x<=0&&C.length===0)return"";const E=(M,P,T)=>`<div class="exec-item"><div class="exec-item-label">${c(M)}</div><div class="exec-item-val ${T}">${c(P)}</div></div>`;return`<div class="exec-summary mb-14">
      ${x>0?E("IRPF trabajo",`${z(S)}/año`,"neg"):""}
      ${x>0?E("Neto trabajo",`${z(x-w-S)}/año`,"pos"):""}
      ${C.length>0?E("Plusvalía latente",z(j),j>=0?"pos":"neg"):""}
      ${C.length>0?E("Imp. potencial (inversión)",z(F),"neg"):""}
    </div>`}function b(){return a==="mobiliario"?Wi(t.store.get("accounts"),g(),l):a==="trabajo"?Qi({nominas:i(),planes:r(),tramos:u(),hoy:e()}):a==="inmobiliario"?Ki():Yi({año:s(),extras:o,declaracion:p(),nominas:i().map(v=>({nombre:v.nombre,bruto:v.bruto||0})),planes:r().map(v=>v.nombre)})}function h(v,y){const I=a===v;return`<button data-tab-fisc="${v}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${I?"600":"400"};
      color:${I?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${I?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${c(y)}</button>`}function $(v){const y=v.querySelector("#fisc-tabs"),I=v.querySelector("#fisc-tab-content");y&&(y.innerHTML=Mo.map(([f,x])=>h(f,x)).join("")),I&&(I.innerHTML=b())}function A(v){v.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${d()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${Mo.map(([y,I])=>h(y,I)).join("")}
      </div>
      <div id="fisc-tab-content">${b()}</div>`}function m(v){R(v,"[data-tab-fisc]",y=>{a=y.getAttribute("data-tab-fisc")||"declaracion",$(v)}),v.addEventListener("input",y=>{var S;if(!((S=y.target)==null?void 0:S.closest("[data-rex]")))return;const f=w=>{var C;return((C=v.querySelector(`#${w}`))==null?void 0:C.value)??"0"};o={capInmobiliario:parseFloat(f("rex-inmobiliario"))||0,capMobiliario:parseFloat(f("rex-mobiliario"))||0,gananciasFondos:parseFloat(f("rex-ganancias"))||0,otrasCorto:parseFloat(f("rex-otras"))||0,retCapital:parseFloat(f("rex-ret-cap"))||0};const x=v.querySelector("#renta-cuadro");x&&(x.innerHTML=So(p()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:Xi,mount(v){A(v),v.dataset.wired!=="1"&&(m(v),v.dataset.wired="1")}}}const Co=()=>globalThis.Chart??null;function tr(t,e){const a=Co();if(!a)return null;const o=e.map(n=>({label:n.label,data:n.puntos.map(s=>({x:s.x,y:s.y})),borderColor:n.esBase?"#6b7280":n.color,backgroundColor:n.esBase?"transparent":`${n.color}18`,borderWidth:n.esBase?1.5:2,...n.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new a(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:n=>`${n.dataset.label}: ${z(n.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:n=>z(n)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const er=()=>Co()!==null,Pt=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],ar="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function or(t){const e=()=>{var x;return(x=t.onDatosCambiados)==null?void 0:x.call(t)},a=new Set;let o=null;const n=()=>t.store.get("config"),s=()=>t.store.get("escenarios"),i=x=>{var S;return x?((S=s().find(w=>w._id===x))==null?void 0:S.nombre)??x:"Base"};function r(x){const S=n(),w=ga({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(x==null?void 0:x._id)??null),C=a.size>0?w.accounts.filter(M=>!a.has(M._id)):w.accounts,j=a.size>0?C.map(M=>M._id):null,F=x!=null&&x.fechaFin&&x.fechaFin>S.dashboardEnd?x.fechaFin:S.dashboardEnd;return{eventos:Jt({loans:w.loans,expenses:w.expenses,accounts:C,config:{...S,dashboardEnd:F},filtroAccounts:j,nominas:w.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:bt(t.store.get("tramosIRPFHistorico"),S.tramos_irpf??gt),resolverTramosGanancias:bt(t.store.get("tramosGananciasCapitalHistorico"),S.tramosGananciasCapital??jt)}),horizonte:F}}function l(x){const S=t.store.get("loans"),w=E=>(E.escenarioIds||[]).includes(x),C=[[S.filter(w).length,"préstamo","préstamos"],[S.flatMap(E=>E.amortizaciones||[]).filter(w).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(w).length,"gasto","gastos"],[t.store.get("accounts").filter(w).length,"cuenta","cuentas"],[t.store.get("nominas").filter(w).length,"nómina","nóminas"]],j=C.reduce((E,[M])=>E+M,0),F=C.filter(([E])=>E>0).map(([E,M,P])=>`${E} ${E===1?M:P}`).join(" · ");return{total:j,texto:F}}function u(x,S){const w=S===x._id,C=x.color||Pt[0],{total:j,texto:F}=l(x._id);return`<div class="card mb-12" style="border-left:3px solid ${c(C)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${c(C)};flex-shrink:0"></div>
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
        ${j===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${c(F)}</span>`}
      </div>
    </div>`}function g(x){const S=n().dashboardEnd,w=ze(r(null).eventos,S);return`
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
        <tbody>${x.map(j=>{const{eventos:F}=r(j),E=j.fechaFin||S,M=ze(F,E),P=M!==null&&w!==null?M-w:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c(j.color||Pt[0])};margin-right:6px"></span>
            ${c(j.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${c(E)}</td>
          <td class="num" style="padding:6px 10px">${M!==null?c(z(M)):"—"}</td>
          <td class="num ${P===null?"":P>=0?"pos":"neg"}" style="padding:6px 10px">
            ${P===null?"—":`${P>=0?"+":""}${c(z(P))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function p(){const x=t.store.get("accounts");return x.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${x.map(w=>{const C=a.has(w._id);return`<button data-toggle-cuenta="${c(w._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${C?"var(--border)":"var(--accent)"};
          background:${C?"transparent":"rgba(99,102,241,0.1)"};
          color:${C?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${C?"text-decoration:line-through;":""}">${c(w.nombre)}</button>`}).join("")}
    </div>`}function d(){if(o){try{o.destroy()}catch{}o=null}}function b(x){const S=n(),w=r(null),C=[{label:"Base (sin supuesto)",color:"#6b7280",esBase:!0,puntos:je(w.eventos,S.dashboardStart,S.dashboardEnd)}];return x.forEach((j,F)=>{const{eventos:E,horizonte:M}=r(j);C.push({label:j.nombre,color:j.color||Pt[F%Pt.length],puntos:je(E,S.dashboardStart,M)})}),C}function h(x,S){d();const w=x.querySelector("#chart-comparacion");w&&(o=tr(w,b(S)))}function $(x){d();const S=new Set(t.store.get("accounts").map(j=>j._id));for(const j of[...a])S.has(j)||a.delete(j);const w=s(),C=n().escenarioActivo||null;x.innerHTML=`
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
             </div>`:`<div>${w.map(j=>u(j,C)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de supuestos</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${p()}</div>
               ${er()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${g(w)}</div>`}`,w.length>0&&h(x,w)}const A=()=>document.getElementById("modal-overlay"),m=()=>document.getElementById("modal-content"),v=()=>{var x;return(x=A())==null?void 0:x.classList.add("hidden")};function y(x,S){const w=x?s().find(E=>E._id===x)??null:null,C=A(),j=m();if(!C||!j)return;const F=(w==null?void 0:w.color)||Pt[0];j.innerHTML=`
      <div class="modal-title">${x?"Editar supuesto":"Nuevo supuesto"}</div>
      <div class="form-group"><label class="form-label">Nombre del supuesto</label>
        <input class="form-input" type="text" id="esc-nombre" value="${c((w==null?void 0:w.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${c((w==null?void 0:w.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${Pt.map(E=>`<div data-color-esc="${E}" style="width:26px;height:26px;border-radius:50%;background:${E};cursor:pointer;
              border:2px solid ${E===F?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${c(F)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${c((w==null?void 0:w.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${c(x??"")}">${x?"Guardar cambios":"Crear escenario"}</button>
      </div>`,C.classList.remove("hidden"),R(j,"[data-cancelar]",v),R(j,"[data-color-esc]",E=>{const M=E.getAttribute("data-color-esc");j.querySelector("#esc-color").value=M;for(const P of j.querySelectorAll("[data-color-esc]"))P.style.border=P.getAttribute("data-color-esc")===M?"2px solid white":"2px solid transparent"}),R(j,"[data-guardar-esc]",E=>{const M=j.querySelector("#esc-nombre").value.trim();if(!M)return q("El nombre es obligatorio","err");const P={nombre:M,fechaFin:j.querySelector("#esc-fecha-fin").value||null,color:j.querySelector("#esc-color").value||Pt[0],descripcion:j.querySelector("#esc-desc").value.trim()},T=E.getAttribute("data-guardar-esc")||"";T?(t.store.updateItem("escenarios",T,P),q("Escenario actualizado")):(t.store.addItem("escenarios",P),q("Escenario creado")),e(),v(),S()})}function I(x,S){if(!X("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const w=C=>C.map(j=>({...j,escenarioIds:(j.escenarioIds||[]).filter(F=>F!==x)}));t.store.set("loans",w(t.store.get("loans")).map(C=>({...C,amortizaciones:w(C.amortizaciones||[])}))),t.store.set("expenses",w(t.store.get("expenses"))),t.store.set("nominas",w(t.store.get("nominas"))),t.store.set("accounts",w(t.store.get("accounts"))),n().escenarioActivo===x&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",x),q("Escenario eliminado"),e(),S()}function f(x,S){R(x,"[data-nuevo-esc]",()=>y(null,S)),R(x,"[data-editar-esc]",w=>y(w.getAttribute("data-editar-esc"),S)),R(x,"[data-borrar-esc]",w=>I(w.getAttribute("data-borrar-esc"),S)),R(x,"[data-activar-esc]",w=>{const C=w.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:C}),q(`Escenario "${i(C)}" activado`),e(),S()}),R(x,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),q("Volviendo a la realidad base"),e(),S()}),R(x,"[data-toggle-cuenta]",w=>{const C=w.getAttribute("data-toggle-cuenta");a.has(C)?a.delete(C):a.add(C);const j=x.querySelector("#esc-pastillas");j&&(j.innerHTML=p());const F=s(),E=x.querySelector("#esc-comparativa");E&&(E.innerHTML=g(F)),h(x,F)})}return{id:"escenarios",route:"escenarios",nombre:"Supuestos",flagId:"supuestos",seccion:2,iconoPath:ar,mount(x){const S=()=>$(x);$(x),x.dataset.wired!=="1"&&(f(x,S),x.dataset.wired="1")},unmount(){d()}}}const sr=1e-12,jo=t=>Math.abs(t)<sr,zo=t=>t/12;function nr(t,e,a,o){if(a<=0)return Math.max(0,Math.ceil(t-e));const n=t-e;if(n<=0)return 0;const s=zo(o);if(jo(s))return Math.ceil(n/a);const i=Math.pow(1+s,a),r=(t-e*i)*s/(i-1);return r<=0?0:Math.ceil(r)}function ir(t,e){const a=zo(e);return jo(a)?0:Math.round(t*a)}function Fo({rentaNetaMensual:t,tasaRetiroSeguro:e,tipoFiscalEfectivo:a}){if(e<=0)throw new RangeError("La tasa de retiro seguro tiene que ser mayor que cero.");if(a>=1)throw new RangeError("El tipo fiscal efectivo no puede llegar al 100 %.");const o=Math.round(t*12/(1-a));return{retiroBrutoAnual:o,capitalNecesario:Math.round(o/e)}}function Eo(t,e){const[a,o]=t.split("-").map(Number),n=a*12+(o-1)+e,s=Math.floor(n/12),i=n%12+1;return`${s}-${String(i).padStart(2,"0")}`}function ta(t,e){const[a,o]=t.split("-").map(Number),[n,s]=e.split("-").map(Number);return(n-a)*12+(s-o)}const _o=t=>Number(t.slice(0,4));function ye(t){return t.rentaDeseada?Fo(t.rentaDeseada).capitalNecesario:t.importeObjetivo??0}const rr={_id:"__sin_vehiculo__"};function xe(t){var v,y,I;const e=Math.max(0,Math.floor(t.horizonteMeses)),a=new Map(t.vehiculos.map(f=>[f._id,f])),o=[...t.objetivos].sort((f,x)=>f.prioridad-x.prioridad).map(f=>({def:f,objetivo:ye(f),saldo:f.saldoActual,estado:ye(f)>0&&f.saldoActual>=ye(f)&&f.modoAsignacion!=="ABSORBE_RESIDUAL"?"COMPLETADO":"PENDIENTE",vehiculo:a.get(f.vehiculoId),aportadoEnAño:0,añoEnCurso:_o(t.fechaInicio),ultimaSolicitud:0,solicitadoAcumulado:0,mesesReclamando:0})),n=new Map;for(const f of t.eventos){const x=n.get(f.fecha)??[];x.push(f),n.set(f.fecha,x)}const s=[],i=[],r=[];let l=t.perfil.netoMensual,u=t.perfil.gastosFijosMensuales,g=0,p=0;const d=[];for(let f=0;f<e;f++){const x=Eo(t.fechaInicio,f),S=_o(x);for(const _ of n.get(x)??[])if(_.tipo==="CAMBIO_INGRESOS")l=_.importe;else if(_.tipo==="CAMBIO_GASTOS_FIJOS")u=_.importe;else if(_.tipo==="NUEVA_DEUDA")u+=_.importe;else if(_.tipo==="INYECCION_CAPITAL"){const k=_.objetivoDestinoId?o.find(L=>L.def._id===_.objetivoDestinoId):void 0;k?k.saldo+=_.importe:l+=_.importe}for(const _ of o)_.añoEnCurso!==S&&(_.añoEnCurso=S,_.aportadoEnAño=0);const w=Math.max(0,l-u),C=Math.round(w*lr(t.pctDisfrute));let j=w-C;const F=j,E=o.filter(_=>_.estado!=="COMPLETADO"),M=[];let P=0;const T=E.filter(_=>_.def.modoAsignacion==="ABSORBE_RESIDUAL"),D=E.filter(_=>_.def.modoAsignacion!=="ABSORBE_RESIDUAL");for(const _ of D){const k=cr(_,x,f,t);_.ultimaSolicitud=k,k>0&&(_.solicitadoAcumulado+=k,_.mesesReclamando+=1),(_.def.modoAsignacion==="CUOTA_POR_FECHA"||_.def.modoAsignacion==="FIJO")&&(P+=k);const L=Math.max(0,Math.min(k,j));j-=L,_.saldo+=L,_.aportadoEnAño+=L,g+=L,L>0&&_.estado==="PENDIENTE"&&(_.estado="EN_CURSO"),M.push({objetivoId:_.def._id,asignado:L,solicitado:k,saldoTrasMes:_.saldo})}if(T.length>0&&j>0){const _=T.map(B=>Math.max(0,B.def.pesoResidual??1)),k=_.reduce((B,O)=>B+O,0)||T.length;let L=0;T.forEach((B,O)=>{const H=O===T.length-1?j-L:Math.floor(j*_[O]/k);L+=H,B.saldo+=H,B.aportadoEnAño+=H,g+=H,H>0&&B.estado==="PENDIENTE"&&(B.estado="EN_CURSO"),M.push({objetivoId:B.def._id,asignado:H,solicitado:0,saldoTrasMes:B.saldo})}),j-=L}else for(const _ of T)M.push({objetivoId:_.def._id,asignado:0,solicitado:0,saldoTrasMes:_.saldo});P>F&&d.push({mes:x,deficit:P-F});for(const _ of o)_.saldo<=0||(_.saldo+=ir(_.saldo,((v=_.vehiculo)==null?void 0:v.rentabilidadRealAnual)??0));for(const _ of o)_.estado!=="COMPLETADO"&&(_.def.modoAsignacion==="ABSORBE_RESIDUAL"&&_.objetivo<=0||_.objetivo>0&&_.saldo>=_.objetivo&&(_.estado="COMPLETADO",i.push({objetivoId:_.def._id,nombre:_.def.nombre,mes:x,indice:f,importeFinal:_.saldo,cuotaLiberada:_.ultimaSolicitud})));for(const _ of o)M.some(k=>k.objetivoId===_.def._id)||M.push({objetivoId:_.def._id,asignado:0,solicitado:0,saldoTrasMes:_.saldo});const N=o.reduce((_,k)=>_+k.saldo,0);if(p+=C,s.push({indice:f,mes:x,netoMensual:l,gastosFijos:u,sobrante:w,disfrute:C,disponible:F,sinAsignar:j,asignaciones:M.sort((_,k)=>Po(o,_.objetivoId)-Po(o,k.objetivoId)),patrimonioTotal:N}),o.length>0&&o.every(_=>_.estado==="COMPLETADO"))break}const b=[];if(d.length>0){const f=Math.round(d.reduce((x,S)=>x+S.deficit,0)/d.length);r.push({severidad:"error",codigo:"INVIABLE",mensaje:`El plan no cabe en el flujo de caja durante ${d.length} mes${d.length!==1?"es":""} (desde ${d[0].mes}). Déficit medio: ${(f/100).toFixed(2)} €/mes.`,mes:d[0].mes,deficitMensual:f});for(const x of o)x.estado!=="COMPLETADO"&&x.def.fechaLimite&&x.def.modoAsignacion==="CUOTA_POR_FECHA"&&(x.estado="INVIABLE");b.push(...ur(o,t,f))}for(const f of o){const x=(y=f.vehiculo)==null?void 0:y.topeAportacionAnual;x&&f.def.modoAsignacion==="FIJO"&&(f.def.importeFijoMensual??0)*12>x&&r.push({severidad:"atencion",codigo:"TOPE_FISCAL",objetivoId:f.def._id,mensaje:`«${f.def.nombre}» pide ${((f.def.importeFijoMensual??0)/100).toFixed(2)} €/mes, que supera el tope anual de ${(x/100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`})}for(const f of o)f.estado!=="COMPLETADO"&&f.objetivo>0&&f.def.modoAsignacion!=="ABSORBE_RESIDUAL"&&r.push({severidad:"atencion",codigo:"NUNCA_COMPLETADO",objetivoId:f.def._id,mensaje:`«${f.def.nombre}» no se completa dentro del horizonte de ${e} meses.`});const h=o.find(f=>f.def.tipo==="INVERSION_PERPETUA"),$=h?i.find(f=>f.objetivoId===h.def._id):void 0,A={};for(const f of o){const x=((I=f.vehiculo)==null?void 0:I._id)??rr._id;A[x]=(A[x]??0)+f.saldo}const m={};for(const f of o)m[f.def._id]=f.estado;return{viable:d.length===0,mesesSimulados:s.length,serieMensual:s,hitos:i,fases:dr(s,i),avisos:r,propuestas:b,estadoFinal:m,resumen:{patrimonioFinal:o.reduce((f,x)=>f+x.saldo,0),patrimonioPorVehiculo:A,totalAportado:g,totalDisfrute:p,mesIndependencia:($==null?void 0:$.mes)??null}}}const lr=t=>Number.isFinite(t)?Math.min(1,Math.max(0,t)):0,Po=(t,e)=>t.findIndex(a=>a.def._id===e);function cr(t,e,a,o){var s,i;const n=Math.max(0,t.objetivo-t.saldo);switch(t.def.modoAsignacion){case"ABSORBE_TODO":return n;case"FIJO":{const r=t.def.importeFijoMensual??0,l=(s=t.vehiculo)==null?void 0:s.topeAportacionAnual;if(!l)return t.objetivo>0?Math.min(r,n):r;const u=Math.max(0,l-t.aportadoEnAño),g=Math.min(r,u);return t.objetivo>0?Math.min(g,n):g}case"CUOTA_POR_FECHA":{if(n<=0)return 0;const r=t.def.fechaLimite?ta(e,t.def.fechaLimite):o.horizonteMeses-a;return nr(t.objetivo,t.saldo,Math.max(0,r),((i=t.vehiculo)==null?void 0:i.rentabilidadRealAnual)??0)}default:return 0}}function dr(t,e){if(t.length===0)return[];const o=[0,...[...new Set(e.map(s=>s.indice))].sort((s,i)=>s-i).map(s=>s+1)].filter((s,i,r)=>r.indexOf(s)===i&&s<t.length),n=[];for(let s=0;s<o.length;s++){const i=o[s],r=(s+1<o.length?o[s+1]:t.length)-1;if(r<i)continue;const l=new Set;for(let u=i;u<=r;u++)for(const g of t[u].asignaciones)g.asignado>0&&l.add(g.objetivoId);n.push({desde:t[i].mes,hasta:t[r].mes,meses:r-i+1,objetivosActivos:[...l]})}return n}function ur(t,e,a){const o=[],n=Math.max(0,e.perfil.netoMensual-e.perfil.gastosFijosMensuales);if(n>0&&e.pctDisfrute>0){const l=Math.ceil(Math.min(e.pctDisfrute,a/n)*100);if(l>0){const u=Math.round(e.pctDisfrute*100);o.push({clase:"REDUCIR_DISFRUTE",magnitud:l,mensaje:`Bajar el disfrute ${l} punto${l!==1?"s":""} (del ${u} % al ${Math.max(0,u-l)} %) libera ${(Math.min(a,n*e.pctDisfrute)/100).toFixed(0)} €/mes.`})}}const s=t.filter(l=>l.def.modoAsignacion==="CUOTA_POR_FECHA"&&l.def.fechaLimite&&l.estado!=="COMPLETADO"),i=l=>l.mesesReclamando>0?l.solicitadoAcumulado/l.mesesReclamando:0,r=[...s].sort((l,u)=>i(u)-i(l))[0];if(r){const l=Math.max(0,r.objetivo-r.saldo),u=i(r),g=Math.max(1,ta(e.fechaInicio,r.def.fechaLimite)),p=Math.max(1,u-a),d=Math.ceil(l/p),b=Math.max(1,d-g);o.push({clase:"RETRASAR_FECHA",objetivoId:r.def._id,magnitud:b,mensaje:`Retrasar «${r.def.nombre}» ${b} mes${b!==1?"es":""}, hasta ${Eo(r.def.fechaLimite,b)}, baja su cuota a lo que cabe en el flujo.`});const h=Math.min(Math.round(a*g),Math.max(0,r.objetivo-1));h>0&&o.push({clase:"REDUCIR_IMPORTE",objetivoId:r.def._id,magnitud:h,mensaje:`O reducir «${r.def.nombre}» en ${(h/100).toFixed(0)} €, de ${(r.objetivo/100).toFixed(0)} € a ${((r.objetivo-h)/100).toFixed(0)} €.`})}return s.length>1&&o.push({clase:"REORDENAR",magnitud:s.length,mensaje:`Hay ${s.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`}),o.length===0&&o.push({clase:"REDUCIR_IMPORTE",magnitud:a,mensaje:`Faltan ${(a/100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`}),o}const pr=()=>globalThis.Chart??null,$e=["#2ee6a8","#4d9fff","#a855f7","#f97316","#eab308","#22d3ee","#fb7185","#34d399"],To=new WeakMap;function mr(t,e,a){const o=pr();if(!o)return null;const n=To.get(t);if(n)try{n.destroy()}catch{}const s=new Map,i=new Map(e.objetivos.map(b=>[b._id,b.vehiculoId])),r=new Set(e.objetivos.map(b=>b.vehiculoId));for(const b of r)s.set(b,[]);for(const b of a.serieMensual){const h=new Map;for(const $ of b.asignaciones){const A=i.get($.objetivoId);A&&h.set(A,(h.get(A)??0)+$.saldoTrasMes)}for(const $ of r)s.get($).push((h.get($)??0)/100)}const l=b=>{var h;return((h=e.vehiculos.find($=>$._id===b))==null?void 0:h.nombre)??"Sin vehículo"},u=[...r],g=u.map((b,h)=>a.serieMensual.map(($,A)=>u.slice(0,h+1).reduce((m,v)=>m+(s.get(v)[A]??0),0))),p=u.map((b,h)=>({label:l(b),data:g[h],borderColor:$e[h%$e.length],backgroundColor:`${$e[h%$e.length]}33`,fill:h===0?"origin":"-1",borderWidth:1.5,pointRadius:0,tension:.25})),d=new o(t,{type:"line",data:{labels:a.serieMensual.map(b=>b.mes),datasets:p},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#a9b6cc",font:{size:11},boxWidth:12}},tooltip:{backgroundColor:"#111a28",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#a9b6cc",bodyColor:"#eef3fb",callbacks:{label:b=>{const h=b.datasetIndex>0?b.chart.data.datasets[b.datasetIndex-1].data[b.dataIndex]??0:0;return` ${b.dataset.label}: ${z(b.parsed.y-h)}`}}}},scales:{x:{ticks:{color:"#6b7b96",maxTicksLimit:12},grid:{display:!1}},y:{ticks:{color:"#6b7b96",callback:b=>z(b)},grid:{color:"rgba(255,255,255,0.07)"}}}}});return To.set(t,d),d}const ea=t=>z(t/100),fr={CUOTA_POR_FECHA:"Cuota para llegar a la fecha",ABSORBE_TODO:"Se lleva todo lo disponible",ABSORBE_RESIDUAL:"Recibe lo que sobre",FIJO:"Importe fijo al mes"},vr={CUOTA_POR_FECHA:"Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.",ABSORBE_RESIDUAL:"No reclama nada; recoge lo que quede tras servir a los de prioridad superior.",FIJO:"Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene."},Do={COMPLETADO:"var(--accent)",EN_CURSO:"var(--text)",PENDIENTE:"var(--text3)",INVIABLE:"var(--red)"};function gr(t,e){if(t.objetivos.length===0)return`<div class="card" style="text-align:center;padding:34px 20px">
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
    ${a.map(s=>{var i;return br(s,e,o,(i=n(s.vehiculoId))==null?void 0:i.nombre)}).join("")}`}function br(t,e,a,o){const n=ye(t),s=e.estadoFinal[t._id]??t.estado,i=a==null?void 0:a.asignaciones.find(p=>p.objetivoId===t._id),r=(i==null?void 0:i.solicitado)??0,l=e.hitos.find(p=>p.objetivoId===t._id),u=n>0?Math.min(100,t.saldoActual/n*100):0,g=e.avisos.filter(p=>p.objetivoId===t._id);return`
    <div class="card mb-10" draggable="true" data-pl-objetivo="${c(t._id)}"
         style="padding:14px 16px;border-left:3px solid ${Do[s]??"var(--text3)"};cursor:grab">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span title="Arrastra para cambiar la prioridad" style="color:var(--text3);cursor:grab;user-select:none">⠿</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3)">#${c(t.prioridad)}</span>
            <span style="font-weight:700;font-size:14px">${c(t.nombre)}</span>
            <span class="badge" style="font-size:10px;background:var(--bg3);color:var(--text2)">${c(fr[t.modoAsignacion])}</span>
            ${s==="INVIABLE"?'<span class="badge badge-red" style="font-size:10px">no llega</span>':""}
            ${s==="COMPLETADO"?'<span class="badge badge-green" style="font-size:10px">completado</span>':""}
          </div>
          <div class="text-sm" style="color:var(--text3);margin-top:4px">${c(vr[t.modoAsignacion])}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:17px;font-weight:700">${c(n>0?ea(n):"— sin meta —")}</div>
          ${t.fechaLimite?`<div class="text-sm" style="color:var(--text3)">para ${c(t.fechaLimite)}</div>`:""}
          <button class="btn-secondary btn-sm" data-pl-editar-objetivo="${c(t._id)}" style="margin-top:6px;font-size:11px;padding:2px 9px">Editar</button>
        </div>
      </div>

      ${n>0?`<div class="goal-bar" style="margin-top:10px"><div class="goal-bar-fill" style="width:${u.toFixed(1)}%;background:${Do[s]??"var(--accent)"}"></div></div>`:""}

      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:12px">
        <div><span style="color:var(--text3)">Pide ahora:</span> <strong style="font-family:var(--font-mono)">${c(ea(r))}</strong>/mes</div>
        <div><span style="color:var(--text3)">Ya acumulado:</span> <span style="font-family:var(--font-mono)">${c(ea(t.saldoActual))}</span></div>
        ${o?`<div><span style="color:var(--text3)">Vehículo:</span> ${c(o)}</div>`:""}
        ${l?`<div><span style="color:var(--text3)">Se completa:</span> <strong style="color:var(--accent)">${c(l.mes)}</strong></div>`:""}
      </div>

      ${g.length>0?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${g.map(p=>`⚠ ${c(p.mensaje)}`).join("<br>")}
             </div>`:""}
      ${t.notas?`<div class="text-sm" style="color:var(--text3);margin-top:8px;white-space:pre-wrap">${c(t.notas)}</div>`:""}
    </div>`}const dt=t=>(t/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}),Ro=[{id:"venta-vivienda",nombre:"Venta de vivienda",icono:"🏠",descripcion:"Lo que queda de verdad tras cancelar la hipoteca y pagar impuestos y gastos. Suele ser bastante menos que el precio de venta.",tipo:"INYECCION_CAPITAL",campos:[{id:"precio",etiqueta:"Precio de venta (€)",ayuda:"Lo que te paga el comprador"},{id:"hipoteca",etiqueta:"Hipoteca pendiente (€)",ayuda:"Capital vivo el día de la firma"},{id:"gastos",etiqueta:"Impuestos y gastos (€)",ayuda:"Plusvalía municipal, IRPF de la ganancia, agencia, notaría"}],calcular:t=>Math.max(0,(t.precio??0)-(t.hipoteca??0)-(t.gastos??0)),resumir:t=>`Venta ${dt(t.precio??0)} € − hipoteca ${dt(t.hipoteca??0)} € − gastos ${dt(t.gastos??0)} €`},{id:"nueva-hipoteca",nombre:"Nueva hipoteca",icono:"🔑",descripcion:"Sube tus gastos fijos con la cuota nueva. Normalmente va en la misma fecha que la venta.",tipo:"NUEVA_DEUDA",campos:[{id:"cuota",etiqueta:"Cuota mensual (€)",ayuda:"Se suma a tus gastos fijos a partir de ese mes"}],calcular:t=>t.cuota??0,resumir:t=>`Cuota de ${dt(t.cuota??0)} €/mes`},{id:"hijo",nombre:"Llegada de un hijo",icono:"👶",descripcion:"Fija tus gastos fijos en un valor nuevo. Si el gasto sube por etapas, crea varios eventos seguidos.",tipo:"CAMBIO_GASTOS_FIJOS",campos:[{id:"actuales",etiqueta:"Gastos fijos actuales (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"incremento",etiqueta:"Incremento mensual (€)",ayuda:"Guardería, ropa, sanidad…"}],calcular:t=>(t.actuales??0)+(t.incremento??0),resumir:t=>`Gastos fijos ${dt(t.actuales??0)} € → ${dt((t.actuales??0)+(t.incremento??0))} €/mes`},{id:"subida-sueldo",nombre:"Subida de sueldo",icono:"📈",descripcion:"Fija tu neto mensual en un valor nuevo desde ese mes.",tipo:"CAMBIO_INGRESOS",campos:[{id:"actual",etiqueta:"Neto mensual actual (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"subida",etiqueta:"Subida mensual neta (€)",ayuda:"Lo que te llega a la cuenta, no el bruto"}],calcular:t=>(t.actual??0)+(t.subida??0),resumir:t=>`Neto ${dt(t.actual??0)} € → ${dt((t.actual??0)+(t.subida??0))} €/mes`},{id:"inyeccion",nombre:"Entrada de dinero",icono:"💰",descripcion:"Una herencia, un bonus, la venta de un coche. Puede ir dirigida a un objetivo concreto.",tipo:"INYECCION_CAPITAL",campos:[{id:"importe",etiqueta:"Importe (€)"}],calcular:t=>t.importe??0,resumir:t=>`Entrada de ${dt(t.importe??0)} €`}],hr=t=>Ro.find(e=>e.id===t);function yr(t,e){switch(t.tipo){case"INYECCION_CAPITAL":return`Entra ${dt(t.importe)} €${e?` → «${e}»`:" al reparto general"}`;case"CAMBIO_INGRESOS":return`El neto mensual pasa a ${dt(t.importe)} €`;case"CAMBIO_GASTOS_FIJOS":return`Los gastos fijos pasan a ${dt(t.importe)} €/mes`;case"NUEVA_DEUDA":return`Los gastos fijos suben ${dt(t.importe)} €/mes`}}function xr(t,e,a,o){const n=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,s=new Map(t.vehiculos.map(r=>[r._id,`veh_${n()}`])),i=new Map(t.objetivos.map(r=>[r._id,`obj_${n()}`]));return{...t,_id:a,nombre:e,activo:!1,creadoEn:o,vehiculos:t.vehiculos.map(r=>({...r,_id:s.get(r._id)})),objetivos:t.objetivos.map(r=>({...r,_id:i.get(r._id),vehiculoId:s.get(r.vehiculoId)??r.vehiculoId})),eventos:t.eventos.map(r=>({...r,_id:`ev_${n()}`,objetivoDestinoId:r.objetivoDestinoId?i.get(r.objetivoDestinoId)??null:null}))}}function $r(t){return[...new Set(t.flatMap(a=>a.hitos.map(o=>o.nombre)))].map(a=>{const o=t.map(i=>i.hitos.find(r=>r.nombre===a)??null),n=o.map(i=>i?i.indice:null),s=n[0];return{nombre:a,meses:o.map(i=>i?i.mes:null),diferencias:n.map(i=>i!==null&&s!==null?i-s:null)}})}const Ir=t=>z(t/100),Ar={INYECCION_CAPITAL:"💰",CAMBIO_GASTOS_FIJOS:"🏷️",CAMBIO_INGRESOS:"📈",NUEVA_DEUDA:"🔑"};function Sr(t){const e=[...t.eventos].sort((o,n)=>o.fecha.localeCompare(n.fecha)),a=o=>{var n;return o?(n=t.objetivos.find(s=>s._id===o))==null?void 0:n.nombre:void 0};return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      Los eventos son los cambios de vida que mueven el plan de verdad: una venta, una hipoteca nueva, un hijo,
      un ascenso. Se aplican <strong>al principio del mes</strong> que indiques.
    </div>

    <div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Añadir</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${Ro.map(o=>`<button class="btn-secondary btn-sm" data-pl-plantilla="${c(o.id)}"
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
             ${e.map(o=>wr(o,t,a(o.objetivoDestinoId))).join("")}
           </div>`}`}function wr(t,e,a){const o=ta(e.fechaInicio,t.fecha),n=o<0?"antes del inicio del plan":o===0?"en el primer mes":`dentro de ${o} mes${o!==1?"es":""}`,s=o<0||o>=e.horizonteMeses;return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:16px;flex-shrink:0;width:24px;text-align:center">${Ar[t.tipo]}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--accent)">${c(t.fecha)}</span>
          <span style="font-size:11px;color:var(--text3)">${c(n)}</span>
          ${s?'<span class="badge badge-yellow" style="font-size:10px">fuera del horizonte</span>':""}
        </div>
        <div style="font-size:12px;margin-top:3px">${c(yr(t,a))}</div>
        ${t.notas?`<div style="font-size:11px;color:var(--text3);margin-top:2px">${c(t.notas)}</div>`:""}
      </div>
      <div style="display:flex;gap:5px;flex-shrink:0">
        <button class="btn-secondary btn-sm" data-pl-editar-evento="${c(t._id)}" style="font-size:11px;padding:2px 9px">Editar</button>
      </div>
    </div>`}function Mr(t,e,a,o){const n=t.campos.map(i=>{const r=o[i.id];return`<div class="form-group">
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
    </div>`}function Oo(t,e){var o;const a={};for(const n of e.campos){const s=((o=t.querySelector(`#ev-${n.id}`))==null?void 0:o.value)??"",i=parseFloat(String(s).replace(",","."));a[n.id]=Number.isFinite(i)?Math.round(i*100):0}return a}const Cr=(t,e)=>Ir(t.calcular(e)),jr=[-2,-1,0,1,2],zr=[-10,0,10],Fr=[-20,0,20];function No(t){return t.hitos.length===0?null:Math.max(...t.hitos.map(e=>e.indice))}function Er(t,e,a,o,n){const s={};for(const l of o.hitos)s[l.objetivoId]=l.mes;const i=No(o),r=n?No(n):i;return{etiqueta:t,delta:e,esBase:a,viable:o.viable,hitos:s,desplazamientoMeses:i!==null&&r!==null?i-r:null,patrimonioFinal:o.resumen.patrimonioFinal}}function _r(t,e,a){if(a===0)return t;switch(e){case"rentabilidad":return{...t,vehiculos:t.vehiculos.map(o=>({...o,rentabilidadRealAnual:Math.max(0,o.rentabilidadRealAnual+a/100)}))};case"disfrute":return{...t,pctDisfrute:Math.min(1,Math.max(0,t.pctDisfrute+a/100))};case"ingresos":return{...t,perfil:{...t.perfil,netoMensual:Math.max(0,Math.round(t.perfil.netoMensual*(1+a/100)))}}}}const Pr=t=>t>0?`+${t}`:String(t);function aa(t,e,a,o,n,s){const i=xe(t),r=n.map(l=>Er(l===0?"Plan actual":`${Pr(l)} ${s}`,l,l===0,l===0?i:xe(_r(t,e,l)),i));return{palanca:e,titulo:a,descripcion:o,variantes:r}}function Tr(t){return[aa(t,"rentabilidad","Rentabilidad de los vehículos","Mueve la rentabilidad real de todos los vehículos a la vez. Es la palanca que menos controlas.",jr,"puntos"),aa(t,"disfrute","Porcentaje de disfrute","Lo que apartas para gastar en vez de asignar a objetivos. Es la palanca que más controlas.",zr,"puntos"),aa(t,"ingresos","Ingresos","Un ascenso, un cambio de trabajo o una reducción de jornada.",Fr,"%")]}function Dr(t){if(t===null)return"no comparable";if(t===0)return"sin cambio";const e=Math.abs(t),a=Math.floor(e/12),o=e%12,n=[a>0?`${a} año${a!==1?"s":""}`:"",o>0?`${o} mes${o!==1?"es":""}`:""].filter(Boolean).join(" y ");return t<0?`${n} antes`:`${n} más tarde`}const qo=t=>z(t/100);function Rr(t,e,a){return`
    ${Or(t,e)}
    ${t.length>1?Nr(t):""}
    ${qr(a)}`}function Or(t,e){return`<div class="card mb-14">
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
  </div>`}function Nr(t){const e=t.slice(0,3),a=e.map(r=>({plan:r,res:xe(r)})),o=$r(a.map(({plan:r,res:l})=>({nombre:r.nombre,hitos:l.hitos}))),n=["Hito",...e.map(r=>r.nombre)].map((r,l)=>`<th style="text-align:${l===0?"left":"right"};padding:6px 8px;font-size:11px;color:var(--text3)">${c(r)}</th>`).join(""),s=o.map(r=>`<tr>
      <td style="padding:5px 8px;font-size:12px">${c(r.nombre)}</td>
      ${r.meses.map((l,u)=>{const g=r.diferencias[u],p=g===null||g===0?"var(--text2)":g<0?"var(--accent)":"var(--red)",d=u===0||g===null||g===0?"":`<div style="font-size:10px;color:${p}">${g>0?"+":""}${g} m</div>`;return`<td style="text-align:right;padding:5px 8px;font-family:var(--font-mono);font-size:11px;color:${p}">
            ${c(l??"no llega")}${d}
          </td>`}).join("")}
    </tr>`).join("");return`<div class="card mb-14">
    <div class="card-title mb-10">Comparativa</div>
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">${a.map(({plan:r,res:l})=>`<div style="flex:1;min-width:150px">
      <div style="font-size:11px;color:var(--text3)">${c(r.nombre)}</div>
      <div style="font-family:var(--font-mono);font-size:15px;font-weight:700">${c(qo(l.resumen.patrimonioFinal))}</div>
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
  </div>`}function qr(t){return t?`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Análisis de sensibilidad</span>
      <button class="btn-secondary btn-sm" data-pl-sensibilidad>Recalcular</button>
    </div>
    ${t.map(Lr).join("")}
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
    </div>`}function Lr(t){return`<div style="margin-bottom:18px">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px">${c(t.titulo)}</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px">${c(t.descripcion)}</div>
    ${t.variantes.map(e=>{const a=e.desplazamientoMeses,o=a===null?"var(--text3)":a===0?"var(--text2)":a<0?"var(--accent)":"var(--red)";return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 0;font-size:12px;${e.esBase?"border-top:1px solid var(--border);border-bottom:1px solid var(--border);":""}">
        <span style="${e.esBase?"font-weight:700":"color:var(--text2)"}">${c(e.etiqueta)}</span>
        <span style="display:flex;gap:14px;align-items:baseline">
          <span style="color:${o};font-size:11px">${c(Dr(a))}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3);min-width:88px;text-align:right">${c(qo(e.patrimonioFinal))}</span>
        </span>
      </div>`}).join("")}
  </div>`}const At=t=>z(t/100);function kr(t,e,a=0){return`
    ${Br(e)}
    ${Hr(t,e)}
    <div class="card mb-14">
      <div class="card-title mb-12">Patrimonio por vehículo</div>
      <div class="chart-wrap-lg"><canvas id="pl-chart"></canvas></div>
    </div>
    ${Gr(e)}
    ${Vr(t,e)}
    ${Ur(t,e,a)}`}function Br(t){if(t.avisos.length===0&&t.propuestas.length===0)return"";const e={error:"var(--red)",atencion:"var(--yellow)",info:"var(--text2)"},a=t.avisos.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:5px">
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
  </div>`}function Hr(t,e){const a=(n,s,i="")=>`<div class="stat-card">
      <div class="stat-label">${c(n)}</div>
      <div class="stat-value" style="font-size:18px">${c(s)}</div>
      ${i?`<div class="stat-sub">${c(i)}</div>`:""}
    </div>`,o=e.serieMensual[e.serieMensual.length-1];return`<div class="grid-4 mb-14">
    ${a("Patrimonio final",At(e.resumen.patrimonioFinal),o?`en ${o.mes}`:"")}
    ${a("Total aportado",At(e.resumen.totalAportado),`${e.mesesSimulados} meses simulados`)}
    ${a("Total a disfrute",At(e.resumen.totalDisfrute),`${Math.round(t.pctDisfrute*100)} % del sobrante`)}
    ${a("Independencia",e.resumen.mesIndependencia??"—",e.resumen.mesIndependencia?"objetivo perpetuo cubierto":"sin objetivo de independencia")}
  </div>`}function Gr(t){return t.hitos.length===0?`<div class="card mb-14"><div class="card-title mb-8">Hitos</div>
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
  </div>`}function Vr(t,e){if(e.fases.length<=1)return"";const a=o=>{var n;return((n=t.objetivos.find(s=>s._id===o))==null?void 0:n.nombre)??o};return`<div class="card mb-14">
    <div class="card-title mb-12">Fases del plan</div>
    <div class="text-sm mb-10" style="color:var(--text3)">Tramos entre hitos: en cada uno el dinero se reparte de forma distinta.</div>
    ${e.fases.map((o,n)=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);flex-shrink:0;width:26px">${n+1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${c(o.desde)} → ${c(o.hasta)} <span style="color:var(--text3);font-weight:400">(${o.meses} mes${o.meses!==1?"es":""})</span></div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">${c(o.objetivosActivos.map(a).join(" · ")||"sin asignaciones")}</div>
        </div>
      </div>`).join("")}
  </div>`}const ne=60;function Ur(t,e,a=0){if(e.serieMensual.length===0)return"";const o=[...t.objetivos].sort((g,p)=>g.prioridad-p.prioridad),n=Math.ceil(e.serieMensual.length/ne),s=Math.min(Math.max(0,a),n-1),i=e.serieMensual.slice(s*ne,(s+1)*ne),r=["Mes","Disponible",...o.map(g=>g.nombre),"Sin asignar","Patrimonio"].map(g=>`<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${c(g)}</th>`).join(""),l=i.map(g=>{const p=o.map(d=>{const b=g.asignaciones.find($=>$.objetivoId===d._id),h=(b==null?void 0:b.asignado)??0;return`<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${h>0?"var(--text)":"var(--text3)"}">${c(h>0?At(h):"·")}</td>`}).join("");return`<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${c(g.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${c(At(g.disponible))}</td>
        ${p}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${c(g.sinAsignar>0?At(g.sinAsignar):"·")}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${c(At(g.patrimonioTotal))}</td>
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
  </div>`}function Yr(t,e){const a=[...t.objetivos].sort((i,r)=>i.prioridad-r.prioridad),o=i=>(i/100).toFixed(2).replace(".",","),n=["Mes","Neto","Gastos fijos","Disfrute","Disponible",...a.map(i=>i.nombre),"Sin asignar","Patrimonio"],s=e.serieMensual.map(i=>[i.mes,o(i.netoMensual),o(i.gastosFijos),o(i.disfrute),o(i.disponible),...a.map(r=>{var l;return o(((l=i.asignaciones.find(u=>u.objetivoId===r._id))==null?void 0:l.asignado)??0)}),o(i.sinAsignar),o(i.patrimonioTotal)].join(";"));return[n.join(";"),...s].join(`
`)}const Bt=t=>{const e=typeof t=="number"?t:parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},ie=t=>(t/100).toFixed(2),Lo=t=>(t*100).toFixed(2),Ht=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?e/100:0},Jr=[["AHORRO_OBJETIVO","Ahorrar una cantidad"],["AMORTIZAR_DEUDA","Amortizar deuda"],["INVERSION_PERPETUA","Independencia económica"],["APORTACION_FIJA","Aportación periódica"]],Wr=[["CUOTA_POR_FECHA","Cuota para llegar a la fecha"],["ABSORBE_TODO","Se lleva todo lo disponible"],["ABSORBE_RESIDUAL","Recibe lo que sobre"],["FIJO","Importe fijo al mes"]],Qr=[["INMEDIATA","Inmediata"],["MEDIA","Media (con preaviso o penalización)"],["BLOQUEADA_HASTA_JUBILACION","Bloqueada hasta la jubilación"]],Kr=[["NULO","Nulo"],["BAJO","Bajo"],["MEDIO","Medio"],["ALTO","Alto"]],ko={AHORRO_OBJETIVO:"CUOTA_POR_FECHA",AMORTIZAR_DEUDA:"ABSORBE_TODO",INVERSION_PERPETUA:"ABSORBE_RESIDUAL",APORTACION_FIJA:"FIJO"},lt=(t,e,a,o,n="",s="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <input class="form-input" id="${t}" type="${a}" value="${c(o)}" ${s}>
    ${n?`<div class="text-sm mt-4" style="color:var(--text3)">${n}</div>`:""}
  </div>`,Tt=(t,e,a,o,n="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <select class="form-input" id="${t}">
      ${a.map(([s,i])=>`<option value="${c(s)}"${s===o?" selected":""}>${c(i)}</option>`).join("")}
    </select>
    ${n?`<div class="text-sm mt-4" style="color:var(--text3)">${n}</div>`:""}
  </div>`;function Xr(t,e,a){var l,u,g;const o=t===null,n=(t==null?void 0:t.tipo)??"AHORRO_OBJETIVO",s=(t==null?void 0:t.modoAsignacion)??ko[n],i=!!(t!=null&&t.rentaDeseada),r=e.length>0?e.map(p=>[p._id,p.nombre]):[["","— no hay vehículos: crea uno primero —"]];return`
    <div class="grid-2" style="gap:10px">
      ${lt("ob-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Entrada del piso"')}
      ${lt("ob-prioridad","Prioridad","number",(t==null?void 0:t.prioridad)??a,"Menor número = se sirve antes",'min="1"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Tt("ob-tipo","Tipo",Jr,n)}
      ${Tt("ob-modo","Cómo pide dinero",Wr,s)}
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
          ${lt("ob-fiscal","Tipo fiscal efectivo al retirar (%)","number",((((g=t==null?void 0:t.rentaDeseada)==null?void 0:g.tipoFiscalEfectivo)??.2)*100).toFixed(2),"",'step="0.5"')}
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
      ${Tt("ob-vehiculo","Vehículo",r,(t==null?void 0:t.vehiculoId)??r[0][0])}
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
    </div>`}function Zr(t,e,a){var u;const o=g=>{var p;return((p=t.querySelector(`#${g}`))==null?void 0:p.value)??""},n=o("ob-nombre").trim();if(!n)return null;const s=o("ob-tipo"),i=o("ob-modo"),r=((u=t.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:u.value)==="renta",l=s==="INVERSION_PERPETUA"&&r;return{_id:(e==null?void 0:e._id)??`obj_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:n,tipo:s,importeObjetivo:l?null:Bt(o("ob-importe")),fechaLimite:o("ob-fecha")||null,prioridad:Math.max(1,Number(o("ob-prioridad"))||a),modoAsignacion:i,vehiculoId:o("ob-vehiculo"),saldoActual:Bt(o("ob-saldo")),estado:(e==null?void 0:e.estado)??"PENDIENTE",notas:o("ob-notas"),...i==="FIJO"?{importeFijoMensual:Bt(o("ob-fijo"))}:{},...i==="ABSORBE_RESIDUAL"?{pesoResidual:Math.max(0,Number(o("ob-peso"))||1)}:{},...l?{rentaDeseada:{rentaNetaMensual:Bt(o("ob-renta")),tasaRetiroSeguro:Ht(o("ob-swr")),tipoFiscalEfectivo:Ht(o("ob-fiscal"))}}:{rentaDeseada:null}}}function tl(t){const e=a=>{var o;return((o=t.querySelector(`#${a}`))==null?void 0:o.value)??""};try{const{capitalNecesario:a}=Fo({rentaNetaMensual:Bt(e("ob-renta")),tasaRetiroSeguro:Ht(e("ob-swr")),tipoFiscalEfectivo:Ht(e("ob-fiscal"))});return`${(a/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0})} €`}catch{return"no calculable con esos parámetros"}}function el(t,e,a){const o=t===null,n=!!(t!=null&&t.esDeuda),s=[["","— ninguna —"],...e.map(r=>[r._id,r.nombre])],i=[["","— ninguno —"],...a.map(r=>[r._id,`${r.nombre} (${r.tin} % TIN)`])];return`
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
      ${Tt("ve-prestamo","Préstamo",i,(t==null?void 0:t.prestamoId)??"","Su TIN se usará como rentabilidad")}
    </div>

    ${lt("ve-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Fondo indexado"')}

    <div class="grid-2" style="gap:10px">
      ${lt("ve-rent","Rentabilidad REAL anual (%)","number",Lo((t==null?void 0:t.rentabilidadRealAnual)??0),"Nominal menos inflación. Un fondo al 7 % nominal con 2 % de inflación son 5 %",'step="0.1"')}
      ${lt("ve-fiscal","Fiscalidad al retirar (%)","number",Lo((t==null?void 0:t.fiscalidadRetirada)??0),"Tipo efectivo sobre la plusvalía",'step="0.5"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Tt("ve-liquidez","Liquidez",Qr,(t==null?void 0:t.liquidez)??"INMEDIATA")}
      ${Tt("ve-riesgo","Riesgo",Kr,(t==null?void 0:t.riesgo)??"NULO")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ve-tope","Tope de aportación anual (€)","number",t!=null&&t.topeAportacionAnual?ie(t.topeAportacionAnual):"","Vacío = sin tope. Pensiones: 1500",'step="0.01"')}
      ${Tt("ve-cuenta","Cuenta asociada",s,(t==null?void 0:t.cuentaId)??"","Enlaza con una cuenta que ya tengas")}
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ve-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ve-cancelar>Cancelar</button>
      <button class="btn-primary" data-ve-guardar>${o?"Crear vehículo":"Guardar"}</button>
    </div>`}function al(t,e){var i;const a=r=>{var l;return((l=t.querySelector(`#${r}`))==null?void 0:l.value)??""},o=a("ve-nombre").trim();if(!o)return null;const n=((i=t.querySelector("#ve-deuda"))==null?void 0:i.checked)??!1,s=a("ve-tope").trim();return{_id:(e==null?void 0:e._id)??`veh_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:o,rentabilidadRealAnual:Ht(a("ve-rent")),liquidez:a("ve-liquidez"),fiscalidadRetirada:Ht(a("ve-fiscal")),topeAportacionAnual:s?Bt(s):null,riesgo:a("ve-riesgo"),cuentaId:a("ve-cuenta")||null,prestamoId:n&&a("ve-prestamo")||null,esDeuda:n}}const ol={CUOTA_POR_FECHA:"Cada mes calcula lo que hace falta para llegar a la fecha, con el saldo que lleva. Si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo lo disponible hasta completarse. Los de menor prioridad no reciben nada mientras tanto.",ABSORBE_RESIDUAL:"No reclama nada: recoge lo que quede tras servir a los de arriba. Es el modo del cubo de largo plazo.",FIJO:"Aporta siempre lo mismo. Si el vehículo tiene tope anual, se aporta hasta agotarlo y se reanuda en enero."},sl="M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z",Bo=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},Ie=t=>(t/100).toFixed(2);function nl(t){const e=t.hoy??J;let a="config",o=null,n=0,s=null;function i(){const M=t.store.get("planes");return M.find(P=>P.activo)??M[0]??null}function r(){const M=i();return M||t.store.addItem("planes",{nombre:"Plan base",fechaInicio:e().slice(0,7),horizonteMeses:480,pctDisfrute:0,activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:[],objetivos:[],eventos:[],creadoEn:e()})}function l(M){var T;const P=i();P&&(t.store.updateItem("planes",P._id,M),s=null,o=null,(T=t.onDatosCambiados)==null||T.call(t))}function u(){const P=t.store.get("nominas").filter(N=>N.activo).reduce((N,_)=>N+(_.bruto||0),0),T=Math.round(P*.75/12),D=t.store.get("expenses").filter(N=>N.activo&&N.basico&&N.tipo==="gasto").reduce((N,_)=>N+(_.cuantia||0),0);return{neto:Math.round(T*100),gastos:Math.round(D*100)}}function g(M){return s||(s=xe(M)),s}function p(M){const P=u(),T=Math.max(0,M.perfil.netoMensual-M.perfil.gastosFijosMensuales),D=Math.round(M.pctDisfrute*100);return`
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${c(Ie(M.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${c(z(P.neto/100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${c(Ie(M.perfil.gastosFijosMensuales))}">
            <div class="text-sm mt-4" style="color:var(--text3)">Según tus gastos básicos: ~${c(z(P.gastos/100))}/mes</div>
          </div>
        </div>

        <div class="form-group mt-8">
          <label class="form-label">Disfrute: <span id="pl-pct-val" style="font-family:var(--font-mono);color:var(--accent)">${D} %</span> del sobrante</label>
          <input type="range" id="pl-disfrute" min="0" max="100" step="1" value="${D}" style="width:100%;accent-color:var(--accent)">
          <div class="text-sm mt-4" style="color:var(--text3)">
            Lo que NO se asigna a objetivos. Con ${c(z(Math.max(0,M.perfil.netoMensual-M.perfil.gastosFijosMensuales)/100))} de sobrante,
            quedan <strong id="pl-disponible">${c(z(T*(1-M.pctDisfrute)/100))}</strong>/mes para los objetivos.
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
      </div>`}const b=()=>document.getElementById("modal-overlay"),h=()=>document.getElementById("modal-content"),$=()=>{var M;return(M=b())==null?void 0:M.classList.add("hidden")};function A(M,P){const T=b(),D=h();return!T||!D?null:(D.innerHTML=`<div class="modal-title">${c(M)}</div>${P}`,T.classList.remove("hidden"),D)}function m(M){l({objetivos:M})}function v(M,P){const T=i();if(!T)return;const D=P?T.objetivos.find(B=>B._id===P)??null:null,N=T.objetivos.reduce((B,O)=>Math.max(B,O.prioridad),0)+1,_=A(D?`Editar «${D.nombre}»`:"Nuevo objetivo",Xr(D,T.vehiculos,N));if(!_)return;const k=()=>{var U;const B=(U=_.querySelector("#ob-modo"))==null?void 0:U.value,O=_.querySelector("#ob-modo-ayuda");O&&B&&(O.textContent=ol[B]);const H=(W,Q)=>{const ot=_.querySelector(W);ot&&(ot.style.display=Q?"block":"none")};H("#ob-bloque-fijo",B==="FIJO"),H("#ob-bloque-residual",B==="ABSORBE_RESIDUAL")};k();const L=()=>{const B=_.querySelector("#ob-capital-derivado");B&&(B.textContent=tl(_))};L(),Y(_,"#ob-modo",k),Y(_,"#ob-tipo",()=>{const B=_.querySelector("#ob-tipo").value,O=_.querySelector("#ob-modo");O&&(O.value=ko[B]);const H=_.querySelector("#ob-bloque-perpetua");H&&(H.style.display=B==="INVERSION_PERPETUA"?"block":"none"),k()}),Y(_,'input[name="ob-derivar"]',()=>{var U;const B=((U=_.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:U.value)==="renta",O=_.querySelector("#ob-renta-campos"),H=_.querySelector("#ob-bloque-importe");O&&(O.style.display=B?"block":"none"),H&&(H.style.display=B?"none":"block"),L()}),Y(_,"#ob-renta, #ob-swr, #ob-fiscal",L),R(_,"[data-ob-cancelar]",$),R(_,"[data-ob-guardar]",()=>{const B=Zr(_,D,N);if(!B){q("El objetivo necesita un nombre","err");return}if(!B.vehiculoId){q("Crea antes un vehículo donde meter el dinero","err");return}const O=T.objetivos.filter(H=>H._id!==B._id);m([...O,B]),$(),q(D?"Objetivo actualizado":`Objetivo «${B.nombre}» creado`),F(M)}),R(_,"[data-ob-borrar]",()=>{D&&X(`¿Borrar «${D.nombre}»? Esto no se puede deshacer.`)&&(m(T.objetivos.filter(B=>B._id!==D._id)),$(),q("Objetivo borrado"),F(M))})}function y(M,P){const T=i();if(!T)return;const D=P?T.vehiculos.find(L=>L._id===P)??null:null,N=t.store.get("accounts").filter(L=>L.activo).map(L=>({_id:L._id,nombre:L.nombre})),_=t.store.get("loans").filter(L=>L.activo&&!L.simulacion).map(L=>({_id:L._id,nombre:L.nombre,tin:L.tin})),k=A(D?`Editar «${D.nombre}»`:"Nuevo vehículo",el(D,N,_));k&&(Y(k,"#ve-deuda",()=>{const L=k.querySelector("#ve-deuda").checked,B=k.querySelector("#ve-bloque-prestamo");B&&(B.style.display=L?"block":"none")}),Y(k,"#ve-prestamo",()=>{const L=k.querySelector("#ve-prestamo").value,B=_.find(U=>U._id===L);if(!B)return;const O=k.querySelector("#ve-rent"),H=k.querySelector("#ve-nombre");O&&(O.value=String(B.tin)),H&&!H.value.trim()&&(H.value=`Amortizar ${B.nombre}`)}),R(k,"[data-ve-cancelar]",$),R(k,"[data-ve-guardar]",()=>{const L=al(k,D);if(!L){q("El vehículo necesita un nombre","err");return}const B=T.vehiculos.filter(O=>O._id!==L._id);l({vehiculos:[...B,L]}),$(),q(D?"Vehículo actualizado":`Vehículo «${L.nombre}» creado`),F(M)}),R(k,"[data-ve-borrar]",()=>{if(!D)return;const L=T.objetivos.filter(B=>B.vehiculoId===D._id);if(L.length>0){q(`No se puede borrar: lo usan ${L.length} objetivo${L.length!==1?"s":""}`,"err");return}X(`¿Borrar el vehículo «${D.nombre}»?`)&&(l({vehiculos:T.vehiculos.filter(B=>B._id!==D._id)}),$(),q("Vehículo borrado"),F(M))}))}function I(M,P,T){const D=i();if(!D||P===T)return;const N=[...D.objetivos].sort((B,O)=>B.prioridad-O.prioridad),_=N.findIndex(B=>B._id===P),k=N.findIndex(B=>B._id===T);if(_<0||k<0)return;const[L]=N.splice(_,1);N.splice(k,0,L),m(N.map((B,O)=>({...B,prioridad:O+1}))),F(M)}function f(M){return M.vehiculos.length===0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.06);border-color:rgba(255,209,102,0.28)">
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          <strong style="color:var(--yellow)">No hay vehículos todavía.</strong>
          Un vehículo es dónde va el dinero —una cuenta, un fondo, un plan de pensiones o la amortización de un
          préstamo— y con qué rentabilidad crece. Hace falta al menos uno para poder crear objetivos.
        </div>
      </div>`:`<div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Vehículos</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${M.vehiculos.map(P=>{const T=M.objetivos.filter(D=>D.vehiculoId===P._id).length;return`<button class="btn-secondary btn-sm" data-pl-editar-vehiculo="${c(P._id)}"
              style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 11px;text-align:left${P.revisarRentabilidad?";border-color:rgba(255,209,102,0.45)":""}">
              <span style="font-weight:600;font-size:12px">${c(P.nombre)}${P.esDeuda?" 🔒":""}${P.revisarRentabilidad?" ⚠":""}</span>
              <span style="font-size:10px;color:var(--text3)">
                ${c((P.rentabilidadRealAnual*100).toFixed(2))} % real · ${T} objetivo${T!==1?"s":""}
              </span>
            </button>`}).join("")}
      </div>
      ${M.vehiculos.some(P=>P.revisarRentabilidad)?`<div class="text-sm mt-10" style="color:var(--yellow);line-height:1.7;padding-top:10px;border-top:1px solid var(--border)">
               ⚠ Los vehículos marcados traen la rentabilidad de tus cuentas, que es <strong>nominal</strong>.
               Este módulo trabaja en términos <strong>reales</strong>: réstale la inflación que esperes
               (unos 2 puntos) o la simulación te dirá que llegas antes de lo que llegarás. Al guardarlos
               desde su formulario el aviso desaparece.
             </div>`:""}
    </div>`}function x(M,P,T){const D=i(),N=hr(P);if(!D||!N)return;const _=T?D.eventos.find(O=>O._id===T)??null:null,k={};N.id==="hijo"&&(k.actuales=D.perfil.gastosFijosMensuales),N.id==="subida-sueldo"&&(k.actual=D.perfil.netoMensual);const L=A(_?`Editar evento · ${N.nombre}`:N.nombre,Mr(N,_,D,k));if(!L)return;const B=()=>{const O=L.querySelector("#ev-resultado");O&&(O.textContent=Cr(N,Oo(L,N)))};B();for(const O of N.campos)Y(L,`#ev-${O.id}`,B);R(L,"[data-ev-cancelar]",$),R(L,"[data-ev-guardar]",()=>{var W,Q;const O=((W=L.querySelector("#ev-fecha"))==null?void 0:W.value)??"";if(!O){q("El evento necesita un mes","err");return}const H=Oo(L,N),U={_id:(_==null?void 0:_._id)??`ev_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,fecha:O,tipo:N.tipo,importe:N.calcular(H),objetivoDestinoId:((Q=L.querySelector("#ev-destino"))==null?void 0:Q.value)||null,notas:N.resumir(H)};l({eventos:[...D.eventos.filter(ot=>ot._id!==U._id),U]}),$(),q(_?"Evento actualizado":"Evento añadido"),F(M)}),R(L,"[data-ev-borrar]",()=>{!_||!X("¿Borrar este evento?")||(l({eventos:D.eventos.filter(O=>O._id!==_._id)}),$(),q("Evento borrado"),F(M))})}function S(M){var P;switch(M.tipo){case"CAMBIO_GASTOS_FIJOS":return"hijo";case"CAMBIO_INGRESOS":return"subida-sueldo";case"NUEVA_DEUDA":return"nueva-hipoteca";case"INYECCION_CAPITAL":return(P=M.notas)!=null&&P.includes("hipoteca")?"venta-vivienda":"inyeccion"}}function w(){const M=i();if(!M)return;const P=new Blob([JSON.stringify(M,null,2)],{type:"application/json"}),T=URL.createObjectURL(P),D=document.createElement("a");D.href=T,D.download=`plan-${M.nombre.replace(/[^\w-]+/g,"_")}-${e()}.json`,D.click(),URL.revokeObjectURL(T),q("Plan exportado")}function C(M){const P=document.createElement("input");P.type="file",P.accept="application/json,.json",P.addEventListener("change",async()=>{var D,N;const T=(D=P.files)==null?void 0:D[0];if(T)try{const _=JSON.parse(await T.text());if(!_||!Array.isArray(_.objetivos)||!Array.isArray(_.vehiculos)||!_.perfil){q("Ese fichero no es un plan de objetivos","err");return}const k=`${_.nombre??"Importado"} (importado)`,L=t.store.addItem("planes",{..._,nombre:k,activo:!1,creadoEn:e()});s=null,o=null,(N=t.onDatosCambiados)==null||N.call(t),q(`Plan «${L.nombre}» importado`),F(M)}catch(_){console.error("[Planner] Importación fallida:",_),q("No se ha podido leer el fichero","err")}}),P.click()}function j(M,P){switch(a){case"config":return p(M);case"objetivos":return gr(M,P);case"simulacion":return kr(M,P,n);case"eventos":return Sr(M);case"escenarios":return Rr(t.store.get("planes"),M._id,o)}}function F(M){const P=r(),T=g(P),D=(_,k)=>`<button class="period-btn ${a===_?"active":""}" data-pl-tab="${_}">${k}</button>`,N=T.viable?'<span class="badge badge-green">Plan viable</span>':'<span class="badge badge-red">No cabe en el flujo</span>';if(M.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Objetivos <span>financieros</span></h1>
        <div class="page-actions">${N}</div>
      </div>

      <div class="period-selector mb-14">
        ${D("config","Plan")}
        ${D("objetivos",`Objetivos (${P.objetivos.length})`)}
        ${D("simulacion","Simulación")}
        ${D("eventos",`Eventos (${P.eventos.length})`)}
        ${D("escenarios","Comparar planes")}
      </div>

      ${a==="objetivos"?`<div class="flex gap-8 mb-14 flex-wrap">
               <button class="btn-primary" data-pl-nuevo-objetivo>+ Nuevo objetivo</button>
               <button class="btn-secondary" data-pl-nuevo-vehiculo>+ Nuevo vehículo</button>
             </div>
             ${f(P)}`:""}

      <div id="pl-cuerpo">${j(P,T)}</div>`,a==="simulacion"){const _=M.querySelector("#pl-chart");_&&mr(_,P,T)}E(M)}function E(M){R(M,"[data-pl-tab]",T=>{a=T.dataset.plTab,F(M)}),Y(M,"#pl-disfrute",T=>{const D=Number(T.value)/100,N=M.querySelector("#pl-pct-val");N&&(N.textContent=`${Math.round(D*100)} %`);const _=i();if(!_)return;const k=Math.max(0,_.perfil.netoMensual-_.perfil.gastosFijosMensuales)*(1-D),L=M.querySelector("#pl-disponible");L&&(L.textContent=z(k/100))}),R(M,"[data-pl-usar-sugerido]",()=>{const T=u(),D=M.querySelector("#pl-neto"),N=M.querySelector("#pl-gastos");D&&(D.value=Ie(T.neto)),N&&(N.value=Ie(T.gastos))}),R(M,"[data-pl-guardar]",()=>{const T=D=>{var N;return((N=M.querySelector(D))==null?void 0:N.value)??""};l({perfil:{netoMensual:Bo(T("#pl-neto")),gastosFijosMensuales:Bo(T("#pl-gastos")),manual:!0},pctDisfrute:Math.min(1,Math.max(0,Number(T("#pl-disfrute"))/100)),fechaInicio:T("#pl-inicio")||e().slice(0,7),horizonteMeses:Math.min(600,Math.max(1,Number(T("#pl-horizonte"))||480))}),q("Plan guardado"),F(M)}),R(M,"[data-pl-plantilla]",T=>x(M,T.dataset.plPlantilla??"",null)),R(M,"[data-pl-editar-evento]",T=>{var _;const D=T.dataset.plEditarEvento??"",N=(_=i())==null?void 0:_.eventos.find(k=>k._id===D);N&&x(M,S(N),D)}),R(M,"[data-pl-duplicar]",()=>{var _;const T=i();if(!T)return;const D=window.prompt("Nombre del plan nuevo:",`${T.nombre} (copia)`);if(!(D!=null&&D.trim()))return;const N=xr(T,D.trim(),`plan_${Date.now().toString(36)}`,e());t.store.addItem("planes",N),(_=t.onDatosCambiados)==null||_.call(t),q(`Plan «${N.nombre}» creado. Actívalo para editarlo.`),F(M)}),R(M,"[data-pl-activar]",T=>{var N;const D=T.dataset.plActivar;if(D){for(const _ of t.store.get("planes"))t.store.updateItem("planes",_._id,{activo:_._id===D});s=null,o=null,(N=t.onDatosCambiados)==null||N.call(t),q("Plan activo cambiado"),F(M)}}),R(M,"[data-pl-renombrar]",T=>{var k;const D=T.dataset.plRenombrar,N=t.store.get("planes").find(L=>L._id===D);if(!N)return;const _=window.prompt("Nuevo nombre:",N.nombre);_!=null&&_.trim()&&(t.store.updateItem("planes",N._id,{nombre:_.trim()}),(k=t.onDatosCambiados)==null||k.call(t),F(M))}),R(M,"[data-pl-borrar-plan]",T=>{var k;const D=T.dataset.plBorrarPlan,N=t.store.get("planes").find(L=>L._id===D);if(!N||!X(`¿Borrar el plan «${N.nombre}» con sus ${N.objetivos.length} objetivos? No se puede deshacer.`))return;t.store.removeItem("planes",N._id);const _=t.store.get("planes");N.activo&&_.length>0&&t.store.updateItem("planes",_[0]._id,{activo:!0}),s=null,o=null,(k=t.onDatosCambiados)==null||k.call(t),q("Plan borrado"),F(M)}),R(M,"[data-pl-sensibilidad]",()=>{const T=i();T&&(o=Tr(T),F(M))}),R(M,"[data-pl-pagina]",T=>{n=Number(T.dataset.plPagina)||0,F(M)}),R(M,"[data-pl-exportar]",w),R(M,"[data-pl-importar]",()=>C(M)),R(M,"[data-pl-nuevo-objetivo]",()=>v(M,null)),R(M,"[data-pl-nuevo-vehiculo]",()=>y(M,null)),R(M,"[data-pl-editar-vehiculo]",T=>y(M,T.dataset.plEditarVehiculo??null)),R(M,"[data-pl-editar-objetivo]",T=>v(M,T.dataset.plEditarObjetivo??null));let P=null;M.querySelectorAll("[data-pl-objetivo]").forEach(T=>{T.addEventListener("dragstart",()=>{P=T.dataset.plObjetivo??null,T.style.opacity="0.45"}),T.addEventListener("dragend",()=>{T.style.opacity="",M.querySelectorAll("[data-pl-objetivo]").forEach(D=>D.style.borderTop="")}),T.addEventListener("dragover",D=>{D.preventDefault(),P&&T.dataset.plObjetivo!==P&&(T.style.borderTop="2px solid var(--accent)")}),T.addEventListener("dragleave",()=>{T.style.borderTop=""}),T.addEventListener("drop",D=>{D.preventDefault(),T.style.borderTop="";const N=T.dataset.plObjetivo;P&&N&&I(M,P,N),P=null})}),R(M,"[data-pl-csv]",()=>{const T=i();if(!T||!s)return;const D=new Blob(["\uFEFF"+Yr(T,s)],{type:"text/csv;charset=utf-8"}),N=URL.createObjectURL(D),_=document.createElement("a");_.href=N,_.download=`plan-${T.nombre.replace(/[^\w-]+/g,"_")}-${e()}.csv`,_.click(),URL.revokeObjectURL(N),q(`CSV exportado (${s.serieMensual.length} meses)`)}),R(M,"[data-pl-guardar-notas]",()=>{var T;l({notas:((T=M.querySelector("#pl-notas"))==null?void 0:T.value)??""}),q("Notas guardadas")})}return{id:"planner",route:"planner",nombre:"Objetivos financieros",seccion:2,iconoPath:sl,mount:F}}function Ho(t,e,a=!1){const o=Math.abs(It(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function il(t){function e(y){return`${y}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(y={}){var f;const I=(f=y.texto)==null?void 0:f.trim().toLowerCase();return t.get("transacciones").filter(x=>!(y.cuentaId&&x.cuentaId!==y.cuentaId||y.desde&&x.fecha<y.desde||y.hasta&&x.fecha>y.hasta||y.tipo&&x.tipo!==y.tipo||y.estimacionId&&x.estimacionId!==y.estimacionId||y.tags&&y.tags.length>0&&!y.tags.some(S=>x.tags.includes(S))||I&&!x.concepto.toLowerCase().includes(I))).sort((x,S)=>x.fecha.localeCompare(S.fecha)||x._id.localeCompare(S._id))}function o(y){const I={_id:e("tx"),fecha:y.fecha,cuentaId:y.cuentaId,importeCts:Ho(y.tipo,y.importe,y.negativo),concepto:y.concepto,tags:y.tags??[],estimacionId:y.estimacionId??null,tipo:y.tipo,origen:y.origen??"manual",...y.nota?{nota:y.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),I]),I}function n(y,I){t.set("transacciones",t.get("transacciones").map(f=>{if(f._id!==y)return f;const{importe:x,...S}=I,w={...f,...S};return x!==void 0&&(w.importeCts=Ho(w.tipo,x,w.importeCts<0)),w}))}function s(y){t.set("transacciones",t.get("transacciones").filter(I=>I._id!==y))}function i(y,I){n(y,{estimacionId:I})}function r(y){return t.get("puntosControl").filter(I=>!y||I.cuentaId===y).sort((I,f)=>I.fecha.localeCompare(f.fecha))}function l(y,I,f,x){const S={_id:e("pc"),fecha:I,cuentaId:y,saldoCts:It(f),...x?{nota:x}:{}},w=t.get("puntosControl").filter(C=>!(C.cuentaId===y&&C.fecha===I));return t.set("puntosControl",[...w,S].sort((C,j)=>C.fecha.localeCompare(j.fecha))),g(y),S}function u(y){const I=t.get("puntosControl").find(f=>f._id===y);t.set("puntosControl",t.get("puntosControl").filter(f=>f._id!==y)),I&&g(I.cuentaId)}function g(y){const I=r(y),f=t.get("accounts");f.some(x=>x._id===y)&&t.set("accounts",f.map(x=>x._id===y?{...x,historicoSaldos:I.map(S=>({_id:S._id,fecha:S.fecha,saldo:tt(S.saldoCts),...S.nota?{nota:S.nota}:{}}))}:x))}function p(y,I=J()){const f=r(y).filter(C=>C.fecha<=I).pop(),x=f==null?void 0:f.fecha,S=(f==null?void 0:f.saldoCts)??0;return t.get("transacciones").filter(C=>C.cuentaId===y&&C.fecha<=I&&(x===void 0||C.fecha>x)).reduce((C,j)=>C+j.importeCts,S)}function d(y,I){return tt(p(y,I))}function b(y=J(),I){const f=I??t.get("accounts").filter(x=>x.activo).map(x=>x._id);return tt(f.reduce((x,S)=>x+p(S,y),0))}function h(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function $(){const y=[...t.get("transacciones").map(I=>I.fecha),...t.get("puntosControl").map(I=>I.fecha)];return y.length>0?y.sort().pop()??null:null}function A(y={}){return tt(a(y).reduce((I,f)=>I+f.importeCts,0))}function m(y={}){const I=new Map;for(const f of a(y)){const x=f.fecha.slice(0,7);I.set(x,(I.get(x)??0)+f.importeCts)}return new Map([...I.entries()].sort(([f],[x])=>f.localeCompare(x)).map(([f,x])=>[f,tt(x)]))}function v(y={}){const I=new Map;for(const f of a(y))for(const x of f.tags.length>0?f.tags:["sin_tag"])I.set(x,(I.get(x)??0)+f.importeCts);return new Map([...I.entries()].map(([f,x])=>[f,tt(x)]))}return{transacciones:a,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:u,saldoCuenta:d,saldoCuentaCts:p,saldoTotal:b,tieneDatos:h,ultimaFecha:$,total:A,totalPorMes:m,totalPorTag:v}}function xt(t){return t.trim().toLowerCase()}function rl(t){function e(){const u=new Map,g=(p,d)=>{const b=xt(p);if(!b)return;const h=u.get(b)??{tag:b,estimaciones:0,reales:0,total:0};h[d]+=1,h.total+=1,u.set(b,h)};for(const p of t.get("expenses"))for(const d of p.tags??[])g(d,"estimaciones");for(const p of t.get("transacciones"))for(const d of p.tags??[])g(d,"reales");return[...u.values()].sort((p,d)=>d.total-p.total||p.tag.localeCompare(d.tag))}function a(){return e().map(u=>u.tag)}function o(u){return e().filter(g=>u==="estimaciones"?g.reales===0:g.estimaciones===0).map(g=>g.tag)}function n(u,g,p){const d=xt(g),b=(u??[]).map(xt);if(!b.includes(d))return u??[];const h=b.filter($=>$!==d);return p===null?[...new Set(h)]:[...new Set([...h,xt(p)])]}function s(u,g){const p=xt(g);if(!p)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return l(u,p)}function i(u,g){let p=0;for(const d of u)xt(d)!==xt(g)&&(p+=l(d,xt(g)).cambiados);return{cambiados:p}}function r(u){return l(u,null)}function l(u,g){let p=0;const d=t.get("expenses").map(S=>{const w=n(S.tags,u,g);return w!==S.tags&&(p+=1),w===S.tags?S:{...S,tags:w}});t.set("expenses",d);const b=t.get("transacciones").map(S=>{const w=n(S.tags,u,g);return w!==S.tags&&(p+=1),w===S.tags?S:{...S,tags:w}});t.set("transacciones",b);const h=t.get("loans").map(S=>{const w=n(S.tags,u,g);return w!==S.tags&&(p+=1),w===S.tags?S:{...S,tags:w}});t.set("loans",h);const $=t.get("nominas").map(S=>{const w=n(S.tags,u,g);return w!==S.tags&&(p+=1),w===S.tags?S:{...S,tags:w}});t.set("nominas",$);const A=t.get("config"),m=xt(u),v=S=>{const w=(S??[]).map(xt);if(!w.includes(m))return S??[];const C=w.filter(j=>j!==m);return g===null?[...new Set(C)]:[...new Set([...C,g])]},y={},I=v(A.activeTagsFilter),f=v(A.tagCategorias),x=v(A.tagGrupos);return I!==A.activeTagsFilter&&(y.activeTagsFilter=I),f!==A.tagCategorias&&(y.tagCategorias=f),x!==A.tagGrupos&&(y.tagGrupos=x),Object.keys(y).length>0&&t.patchConfig(y),{cambiados:p}}return{uso:e,todas:a,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}function ll(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function cl(t,e){const a=G(t),o=[];for(let n=1;n<=e;n++){const s=new Date(a.getFullYear(),a.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function dl(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function ul(t,e){const{inicio:a,fin:o}=dl(e);return Yt([t],{start:a,end:o}).reduce((s,i)=>s+Math.abs(i.cuantia),0)}function pl(t){function e(n,s={}){var I;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:l=J()}=s,u=t.transacciones({estimacionId:n._id}),p=u.length===0&&(((I=n.tags)==null?void 0:I.length)??0)>0?t.transacciones({tags:n.tags}):u,d=new Map;for(const f of p){const x=f.fecha.slice(0,7);d.set(x,(d.get(x)??0)+Math.abs(f.importeCts)/100)}const b=[];for(const f of cl(l,i)){const x=d.get(f);if(x===void 0)continue;const S=st(ul(n,f));b.push({mes:f,estimado:S,real:st(x),desviacion:st(x-S),precision:ll(S,x)})}const h=st(b.reduce((f,x)=>f+x.estimado,0)),$=st(b.reduce((f,x)=>f+x.real,0)),A=b.reduce((f,x)=>f+Math.abs(x.estimado),0),m=b.length===0?null:A>0?b.reduce((f,x)=>f+x.precision*Math.abs(x.estimado),0)/A:b.reduce((f,x)=>f+x.precision,0)/b.length,v=b.slice(-r),y=v.length>0?st(v.reduce((f,x)=>f+x.real,0)/v.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:b,estimadoTotal:h,realTotal:$,desviacionTotal:st($-h),precision:m,mediaRealReciente:y,infraestimada:$>h}}function a(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>e(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const l=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};l.estimado+=i.estimadoTotal,l.real+=i.realTotal,l.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),l.peso+=Math.abs(i.estimadoTotal),l.n+=1,s.set(r,l)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:st(r.estimado),realTotal:st(r.real),desviacionTotal:st(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}const oa="financeapp_session",ml=["local","dropbox","firebase"];function fl(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!ml.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function vl({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now()}={}){const o=()=>t??(typeof localStorage<"u"?localStorage:null);function n(d){const b=o();if(b)try{d?b.setItem(oa,JSON.stringify(d)):b.removeItem(oa)}catch{}}function s(){const d=o();if(!d)return null;try{return fl(d.getItem(oa))}catch{return null}}function i(){const d=s();return d?(a()-d.ultimoUso)/6e4:null}function r(){const d=e();if(!Number.isFinite(d)||d<=0)return!1;const b=i();return b!==null&&b>=d}function l(){const d=s();return d?r()?(n(null),null):d:null}function u(d){const b=a(),h={modo:d.modo,...d.email?{email:d.email}:{},...d.passphrase?{passphrase:d.passphrase}:{},creadaEn:b,ultimoUso:b};return n(h),h}function g(){const d=s();d&&n({...d,ultimoUso:a()})}function p(){n(null)}return{abrir:u,leer:l,tocar:g,cerrar:p,caducada:r,inactividadMinutos:i,get activa(){return l()!==null}}}const Go=["pointerdown","keydown","visibilitychange"];function gl({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const g of Go)s==null||s.addEventListener(g,r);const l=o(()=>{i&&t.caducada()&&(u(),t.cerrar(),e())},a);function u(){if(i){i=!1,n(l);for(const g of Go)s==null||s.removeEventListener(g,r)}}return u}const bl=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}];function Vo(){if(typeof localStorage<"u"){const d=en();d.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${d.join(", ")}`)}const t=on({adapter:tn()}),{applied:e}=t.load();e.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${e.join(", ")} (esquema v${Kt})`);const a=nn(t);Is(d=>a.isEnabled(d));const o=vl({autoLogoutMinutos:()=>{var b,h;const d=(h=(b=globalThis.State)==null?void 0:b.get)==null?void 0:h.call(b,"config");return Number((d==null?void 0:d.autoLogoutMinutos)??t.get("config").autoLogoutMinutos??0)}}),n=il(t),s=rl(t),i=pl(n),r=hn(t),l=pn({isEnabled:d=>a.isEnabled(d)}),u=un({flags:a,rutasExtra:()=>l.flagPorRuta()}),g=dn({flags:a,onChange:()=>{var d,b;l.attachToShell(),u.apply(),(b=(d=globalThis.Router)==null?void 0:d.rerender)==null||b.call(d)}}),p=()=>{var b,h,$,A,m,v;const d=globalThis;if((h=(b=d.State)==null?void 0:b.load)==null||h.call(b),((A=($=d.Router)==null?void 0:$.current)==null?void 0:A.call($))==="dashboard")try{(v=(m=d.DashboardModule)==null?void 0:m.render)==null||v.call(m)}catch(y){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",y)}};return l.register(Qn({store:t,onDatosCambiados:p})),l.register(ri({store:t,onDatosCambiados:p})),l.register(Mi({store:t,onDatosCambiados:p})),l.register(Ui({store:t,ledger:n,mostrarObjetivos:()=>a.isEnabled("goals"),onDatosCambiados:p})),l.register(Dn({ledger:n,tags:s,precision:i,adjuster:r,accounts:()=>t.get("accounts"),estimaciones:()=>t.get("expenses"),onDatosCambiados:p})),l.register(nl({store:t,onDatosCambiados:p})),l.register(or({store:t,onDatosCambiados:p})),l.register(Hn({store:t,onDatosCambiados:p})),l.register(Zi({store:t})),l.register(On({store:t,onDatosCambiados:p})),{version:Kt,core:cs,engine:{generarExtracto:Jt,recomputarSaldoAcum:ps,saldoHoy:ms,sumarPorTags:Pa,providers:{proyectarGastos:Yt,proyectarPrestamos:Sa,proyectarTransferencias:wa,proyectarNominas:za,proyectarInteresesCuentas:Ca,proyectarAportaciones:Ma,proyectarRetencionesFiscales:ja,proyectarInflacionGastos:Fa,proyectarPerdidaAhorro:Ea},analysis:bs,margins:xs,optimizer:As,dashboard:Os},store:t,flags:a,featureRegistry:{all:Ct,porGrupo:Za},ui:{openFeatures:g.open,applyGating:u.apply,watchGating:()=>u.observar()},app:l,session:Object.assign(o,{vigilar:d=>gl({sesion:o,onCaducada:d}),opciones:bl}),accounting:{ledger:n,tags:s,precision:i,adjuster:r,sugerirAjuste:no}}}function hl(){try{const t=Vo();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const Ae=typeof window<"u"?hl():null;if(Ae){let t=!1;const e=()=>{Ae.app.attachToShell(),Ae.ui.applyGating(),t||(t=!0,Ae.ui.watchGating())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",a=>{const o=a.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(e,0)})}return $t.bootstrap=Vo,Object.defineProperty($t,Symbol.toStringTag,{value:"Module"}),$t}({});
//# sourceMappingURL=financeapp-core.js.map

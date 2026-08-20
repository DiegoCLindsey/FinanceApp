var FinanceAppBundle=function(yt){"use strict";var di=Object.defineProperty;var ui=(yt,L,q)=>L in yt?di(yt,L,{enumerable:!0,configurable:!0,writable:!0,value:q}):yt[L]=q;var so=(yt,L,q)=>ui(yt,typeof L!="symbol"?L+"":L,q);function L(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function q(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function V(){return L(new Date)}function na(t,e){return new Date(t,e+1,0).getDate()}function Ra(t,e,a){return L(new Date(t,e,Math.min(a,na(t,e))))}function Qt(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return L(new Date(t,e+1,0));const s=parseInt(o);if(!isNaN(s))return Ra(t,e,s)}if(a.startsWith("nthweekday:")){const o=a.split(":"),s=parseInt(o[1]),n=parseInt(o[2]);if(s===-1){const d=new Date(t,e+1,0);for(;d.getDay()!==n;)d.setDate(d.getDate()-1);return L(d)}const i=new Date(t,e,1);for(;i.getDay()!==n;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(s-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),L(i)}return null}function Na(t,e){if(!e)return t;const a=q(t);return Qt(a.getFullYear(),a.getMonth(),e)??t}const no=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],io={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function ia(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${io[a]||a+"º"} ${no[o]} del mes`}return t}function At(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function et(t){return t/100}function ot(t){return et(At(t))}function z(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function qa(t){return(t||0).toFixed(2)+"%"}function Ft(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function La(t,e,a,o=0){const s=Ft(t,e,a),n=t*(1-o/100);let i=e/100/12;for(let d=0;d<200;d++){const c=s*(1-Math.pow(1+i,-a))/i-n,x=s*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),f=i-c/x;if(Math.abs(f-i)<1e-10){i=f;break}i=f}return(Math.pow(1+i,12)-1)*100}function ka(t,e,a,o,s=0,n=[],i={}){const d=[];let p=t;const c=q(o),x=e/100/12;let f=a,r=Ft(p,e,f);const b=[...n].sort(($,A)=>$.fecha.localeCompare(A.fecha));let g=0;for(let $=1;$<=a*2&&p>.01;$++){const A=new Date(c);c.setMonth(c.getMonth()+1);const u=Na(L(A),i.diaPago||"");for(;g<b.length&&b[g].fecha<=u;){const I=b[g],y=I.cantidad*(s/100);if(p-=I.cantidad,p=Math.max(0,p),I.tipo==="plazo"?f=Math.ceil(-Math.log(1-p*x/r)/Math.log(1+x)):(f=a-$+1,r=Ft(p,e,f)),d.push({mes:"AMORT",fecha:I.fecha,cuota:0,interes:0,amortizacion:I.cantidad,comisionAmort:y,capitalPendiente:p,esAmortizacion:!0,simulacion:I.simulacion||!1}),g++,p<.01)break}if(p<.01)break;const m=p*x,v=Math.min(r-m,p);if(p-=v,p<.01&&(p=0),d.push({mes:$,fecha:u,cuota:r,interes:m,amortizacion:v,comisionAmort:0,capitalPendiente:p,esAmortizacion:!1,simulacion:!1}),f--,f<=0||p<.01)break}return d}const Oa=new Map;function Z(t){var A;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((u,m)=>`${u.fecha}|${u.cantidad}|${u.tipo||""}`.localeCompare(`${m.fecha}|${m.cantidad}|${m.tipo||""}`)).map(u=>`${u.fecha}:${u.cantidad}:${u.tipo||""}`).join(";")}`,o=Oa.get(a);if(o)return o;const{capital:s,tin:n,meses:i,fechaInicio:d,comisionAmort:p,comisionApertura:c}=t,x=ka(s,n,i,d,p||0,e,t),f=x.reduce((u,m)=>u+m.interes,0),r=x.reduce((u,m)=>u+m.comisionAmort,0),b=s*((c||0)/100),g=x.filter(u=>!u.esAmortizacion),$={cuota:Ft(s,n,i),totalIntereses:f,tae:La(s,n,i,c||0),costoTotal:f+r+b,comAp:b,totalComAm:r,fechaFin:((A=g.slice(-1)[0])==null?void 0:A.fecha)||"",mesesReales:g.length,tabla:x};return Oa.set(a,$),$}function Ba(t){const e=Z(t),a=Z({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,s=a.mesesReales-e.mesesReales,n=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:s,costeTotalAmort:n,ahorroNeto:o-n,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function lt(t,e,a){if(!t||t.length===0)return 1;const o=q(e),s=q(a);if(s<=o)return 1;const n=[...t].sort((p,c)=>p.year-c.year);let i=1,d=new Date(o);for(;d<s;){const p=d.getFullYear(),c=n.filter($=>$.year<=p),x=c.length>0?c[c.length-1]:n[0],f=(x?x.tasa:0)/100,r=new Date(p+1,0,1),b=r<s?r:s,g=(b.getTime()-d.getTime())/(1e3*60*60*24);i*=Math.pow(1+f,g/365.25),d=b}return i}function Ha(t,e,a,o=0){const s=q(e),n=q(a);if(n<=s)return o;const i=(n.getTime()-s.getTime())/864e5,d=t?[...t].sort((x,f)=>x.year-f.year):[];let p=0,c=new Date(s);for(;c<n;){const x=c.getFullYear(),f=new Date(x+1,0,1),r=f<n?f:n,b=(r.getTime()-c.getTime())/864e5,g=d.filter(u=>u.year<=x),$=g.length>0?g[g.length-1]:null,A=$!==null?$.tasa:o;p+=A*b,c=r}return i>0?p/i:o}function Ga(t,e){return((1+t/100)/(1+e/100)-1)*100}function ro(t,e,a,o){const s=lt(e,a,o);return s>0?t/s:t}function co(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,s=e.saludUmbralDTIVerde??30,n=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],d=e.saludExcluirHipoteca||!1,{ingresos:p=0,cuotas:c=0,cuotasHipoteca:x=0,gastosBasicos:f=0,gastosOtros:r=0,amortizaciones:b=0}=t,g=p-c-b-f-r,$=g,A=p>0?$/p*100:null,u=d?c-x:c,m=p>0?u/p*100:null,v=p>0?c/p*100:null,I=p>0?(f+c+b)/p*100:null,y=p>0?r/p*100:null,h=(S,M,C)=>S===null?"neutral":S>=M?"verde":S>=C?"amarillo":"rojo",w=(S,M,C)=>S===null?"neutral":S<=M?"verde":S<=C?"amarillo":"rojo";return{ingresos:p,cuotas:c,cuotasHipoteca:x,gastosBasicos:f,gastosOtros:r,amortizaciones:b,ahorroBruto:g,ahorroReal:$,tasaAhorro:A,dti:m,dtiTotal:v,excluyeHipoteca:d,pctNecesidades:I,pctDeseos:y,semAhorro:h(A,a,o),semDTI:w(m,s,n),semNecesidades:w(I,i[0],i[0]+15),semDeseos:w(y,i[1],i[1]+10),semAhorroRegla:h(A,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:s,umbralDTIAmarillo:n,regla:i}}function dt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function it(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function Nt(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];a&&o.push({fecha:a,saldo:t.saldoInicial||0});for(const n of t.historicoSaldos||[])n.fecha>=a&&o.push(n);o.sort((n,i)=>i.fecha.localeCompare(n.fecha));const s=o.find(n=>n.fecha<=e);return s?s.saldo:t.saldoInicial||0}else{const s=[...t.historicoSaldos||[]].sort((n,i)=>i.fecha.localeCompare(n.fecha)).find(n=>n.fecha<=e);return s?s.saldo:0}}function ra(t,e){const a=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return a?e.filter(o=>a.includes(o._id)):e.filter(o=>o.activo&&!o.simulacion)}function Va(t,e,a=0){const o=ra(t,e).reduce((s,n)=>s+it(n),0);return t.usarColchon!==!1?Math.max(0,o-a):o}function Ua(t,e,a){if(!t.targetAmount||t.targetAmount<=0)return null;const o=ra(t,e);if(o.length===0)return null;const s=a.hoy??new Date,n=a.horizonteMeses??120,i=t.usarColchon!==!1,d=o.map(p=>({acc:p,eventos:a.extractoCuenta(p),cursor:0,saldo:it(p)}));for(let p=1;p<=n;p++){const c=new Date(s.getFullYear(),s.getMonth()+p,1),x=`${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,"0")}`,f=L(new Date(c.getFullYear(),c.getMonth()+1,0));let r=0;for(const g of d){for(;g.cursor<g.eventos.length&&g.eventos[g.cursor].fecha<=f;)g.saldo=g.eventos[g.cursor].saldoAcum??g.saldo,g.cursor++;r+=g.saldo}const b=i?a.colchonEnFecha(f):0;if(r-b>=t.targetAmount)return x}return null}function Ya(t,e){const a=t.escenarioIds||[];return a.length===0?!0:!!e&&a.includes(e)}function Wa(t,e){const a=o=>Ya(o,e);return{loans:t.loans.filter(a).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}const ca=t=>t.slice(0,7);function lo(t){const[e,a]=t.split("-").map(Number);return`${a===12?e+1:e}-${String(a===12?1:a+1).padStart(2,"0")}`}function la(t,e,a){if(t.length===0)return[];const o=new Map;for(const c of t)c.saldoAcum!==void 0&&o.set(ca(c.fecha),c.saldoAcum);const s=t[0];let n=(s.saldoAcum??0)-(s.delta??0);const i=ca(e||s.fecha),d=ca(a||t[t.length-1].fecha);if(d<i)return[];const p=[];for(let c=i;c<=d;c=lo(c)){const x=o.get(c);x!==void 0&&(n=x);const[f,r]=c.split("-").map(Number);p.push({x:q(L(new Date(f,r-1,15))).getTime(),mes:c,y:n})}return p}function da(t,e){let a=null;for(const o of t){if(o.fecha>e)break;o.saldoAcum!==void 0&&(a=o.saldoAcum)}return a}const ft=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ct(t,e){const a=[...e].sort((n,i)=>n[0]-i[0]);let o=0,s=t;for(let n=a.length-1;n>=0;n--){const[i,d]=a[n];s<=i||(o+=(s-i)*(d/100),s=i)}return o}function ua(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,s=Math.min(2e3,a),n=Math.max(0,a-o-s),i=n<=15876?7302:n<=21622?Math.max(0,7302-1.75*(n-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:s,RNT:n,reducArt20:i,baseImponible:Math.max(0,n-i)}}function xt(t,e){return ua(t,e).baseImponible}function Ja(t,e){return ct(t,e)/12}const wt=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function pa(t,e){if(!t||t<=0)return 0;const a=e||wt;let o=0,s=t;for(let n=0;n<a.length;n++){const[i,d]=a[n],p=n<a.length-1?a[n+1][0]:1/0,c=Math.min(s,p-i);if(!(c<=0)&&(o+=c*(d/100),s-=c,s<=0))break}return o}function Pt(t,e){if(dt(t)!=="inversion")return null;const a=it(t),o=(t.aportaciones||[]).reduce((i,d)=>i+d.cantidad,0)||t.saldoInicial||0,s=Math.max(0,a-o),n=pa(s,e);return{saldo:a,costBase:o,plusvalia:s,impuesto:n,neto:a-n}}function Zt(t,e=new Date){var r;if(dt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=it(t),s=L(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),n=[...t.aportaciones||[]].sort((b,g)=>b.fecha.localeCompare(g.fecha));let i=0;const d=n.reduce((b,g)=>b+g.cantidad,0);for(const b of n)b.fecha<=s&&(i+=b.cantidad);const p=Math.max(0,o-d),c=d>0?i/d:0,x=Math.min(o,i+p*c),f=Math.max(0,o-x);return{saldo:o,disponible:x,bloqueado:f,costBase:d,beneficio:p,numAportaciones:n.length,proxDesbloqueo:((r=n.find(b=>b.fecha>s))==null?void 0:r.fecha)||null}}function Ka(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(dt(t)!=="pension"||!o)return 0;const s=it(t);if(s<=0)return 0;const n=(t.aportaciones||[]).reduce((c,x)=>c+x.cantidad,0),i=Math.max(0,s-n);if(i<=0)return 0;const d=i/s;return+(e*d*o/100).toFixed(2)}function ma(t,e,a){var p;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const n=(e||[]).filter(c=>(c.grupoNomina||"")===o&&c.activo!==!1).reduce((c,x)=>c+(x.bruto||0)*(x.nPagas||12),0),i=[...a||[]].sort((c,x)=>c[0]-x[0]);let d=((p=i[0])==null?void 0:p[1])||19;for(const[c,x]of i)if(n>=c)d=x;else break;return d}const fa=6.35;function St(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function Xa(t){return Math.max(0,(t.bruto||0)-St(t))}function uo(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function po(t){const e=t.reduce((i,d)=>i+(d.bruto||0),0),a=t.reduce((i,d)=>i+St(d),0),o=Math.max(0,e-a),s=xt(e,a),n=new Map;for(const i of t)n.set(i._id,o>0?s*(Xa(i)/o):0);return n}function va(t,e,a){if(t.irpfModo==="manual")return Xa(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return ct(xt(t.bruto||0,St(t)),a);const o=uo(e.filter(i=>i.irpfModo!=="manual")),s=po(e);let n=0;for(const i of o){const d=s.get(i._id)??0;if(i._id===t._id)return ct(n+d,a)-ct(n,a);n+=d}return ct(xt(t.bruto||0,St(t)),a)}function mo(t,e){return t.reduce((a,o)=>a+va(o,t,e),0)}function fo(t,e){var s;const a=[...e||[]].sort((n,i)=>n[0]-i[0]);let o=((s=a[0])==null?void 0:s[1])??19;for(const[n,i]of a)if(t>=n)o=i;else break;return o}function Qa(t,e){if(!t||t.length===0)return 0;const a=t.reduce((s,n)=>s+(n.bruto||0),0),o=t.reduce((s,n)=>s+St(n),0);return fo(xt(a,o),e)}function ga(t,e,a){const o=t.bruto||0,s=St(t),n=Math.max(0,o-s),i=t.nPagas||12,d=t.ssPct??fa,p=n*(d/100),c=va(t,e,a);return{brutoAnual:o,flexAnual:s,baseDineraria:n,nPagas:i,ssPct:d,ssAnual:p,irpfAnual:c,irpfPct:n>0?c/n*100:0,netoPorPaga:(n-p-c)/i}}function vo(t){const e=new Map,a=[];for(const o of t){const s=o.grupoNomina||"";if(!s){a.push(o);continue}const n=e.get(s)??[];n.push(o),e.set(s,n)}return{grupos:e,sueltas:a}}const Mt=1500;function Za(t){const e=t.cuantia||0,a=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?e*12/a:t.tipoFrecuencia==="diaria"?e*365.25/a:e}const qt=t=>{const e=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(e)?e:0};function go(t,e){const a=t.grupoNomina||"";return a?e.filter(o=>(o.grupoNomina||"")===a):null}function te(t,e){return t.reduce((a,o)=>a+va(o,go(o,t),e),0)}function ae(t){const{nominas:e,tramosGeneral:a,tramosAhorro:o}=t,s=t.extras??{},n=e.reduce((S,M)=>S+(M.bruto||0),0),i=e.reduce((S,M)=>S+St(M),0),d=ua(n,i),p=t.aportacionesPension,c=Mt,x=Math.min(p,c),f=Math.max(0,d.RNT-d.reducArt20-x),r=qt(s.capInmobiliario),b=qt(s.capMobiliario),g=qt(s.gananciasFondos),$=qt(s.otrasCorto),A=qt(s.retCapital),u=Math.max(0,f+t.otrosIngresos+r+$),m=Math.max(0,b+g),v=ct(u,a),I=ct(m,o),y=v+I,h=te(e,a),w=h+A;return{brutoTotal:n,flexTotal:i,brutoIRPF:d.baseIRPF,cotizSS:d.cotizSS,gastosArt19:d.gastosArt19,RNT:d.RNT,reducArt20:d.reducArt20,aportPP:p,limPP:c,deducPP:x,RNTred:f,otrosIngresos:t.otrosIngresos,capInmobiliario:r,capMobiliario:b,gananciasFondos:g,otrasCorto:$,baseGeneral:u,baseAhorro:m,cuotaGen:v,cuotaAho:I,cuotaIntegra:y,retNomina:h,retCapital:A,totalRet:w,resultado:y-w}}const bo=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:Mt,TRAMOS_AHORRO_DEFAULT:wt,TRAMOS_IRPF_DEFAULT:ft,ajustarFechaPago:Na,ajustarPrecioReal:ro,calcBaseImponibleTrabajo:xt,calcFactorInflacion:lt,calcFondoInversion:Pt,calcFondosPension:Zt,calcGananciasCapital:pa,calcIRPF:ct,calcImpuestoPension:Ka,calcInflacionMediaAnual:Ha,calcSaludFinanciera:co,calcTAE:La,calcTipoMarginalPension:ma,calcTipoRealFisher:Ga,calcularDeclaracion:ae,clampedDate:Ra,cuentasDelObjetivo:ra,cuotaMensual:Ft,desgloseBaseTrabajo:ua,filtrarPorEscenario:Wa,formatEUR:z,formatLocalDate:L,formatPct:qa,fromCents:et,ingresoAnual:Za,labelDiaPago:ia,lastDayOfMonth:na,modeloFondoDe:dt,parseLocalDate:q,proyectarFechaCumplimiento:Ua,resolverDiaEfectivo:Qt,resumenPrestamo:Z,resumenPrestamoConAhorro:Ba,retencionMensual:Ja,retencionesNomina:te,roundMoney:ot,saldoEnFecha:Nt,saldoEnFechaExtracto:da,saldoParaObjetivo:Va,saldoRealCuenta:it,serieMensual:la,tablaAmortizacion:ka,toCents:At,todayISO:V,visibleEnEscenario:Ya},Symbol.toStringTag,{value:"Module"}));function Lt(t,e,a=null){const o=[],s=q(e.start),n=q(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const d=q(i.fechaInicio||e.start),p=i.fechaFin?q(i.fechaFin):n,c=i.cuantia,x=f=>o.push({fecha:f,concepto:i.concepto,cuantia:c,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")d>=s&&d<=n&&d<=p&&x(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const f=Math.max(1,i.frecuencia||1);let r=d.getFullYear(),b=d.getMonth();const g=Math.ceil(240/f)+2;for(let $=0;$<g;$++){const A=Qt(r,b,i.diaPago||"")||(()=>{const m=d.getDate(),v=new Date(r,b+1,0).getDate();return L(new Date(r,b,Math.min(m,v)))})(),u=q(A);if(u>n||u>p)break;u>=s&&u>=d&&x(A),b+=f,b>=12&&(r+=Math.floor(b/12),b=b%12)}}else if(i.tipoFrecuencia==="diaria"){const f=Math.max(1,i.frecuencia||1)*864e5;let r=new Date(Math.max(d.getTime(),s.getTime()));if(d<s){const b=Math.ceil((s.getTime()-d.getTime())/f);r=new Date(d.getTime()+b*f)}for(;r<=n&&r<=p;)x(L(r)),r=new Date(r.getTime()+f)}}return o}function ee(t,e,a=null){const o=[];for(const s of t){if(!s.activo||a&&a.length>0&&!a.includes(s.cuenta||"default"))continue;const{tabla:n}=Z(s);for(const i of n)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${s.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${s.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan",simulacion:s.simulacion||!1}))}return o}function oe(t,e,a=null,o={accounts:[]}){const s=[],n=q(e.start),i=q(e.end),d=o.accounts||[],p=o.nominas||[],c=o.resolverTramosIRPF||(()=>ft),x=o.resolverTramosGanancias||(()=>wt),f=r=>{var b;return((b=d.find(g=>g._id===r))==null?void 0:b.nombre)??r};for(const r of t){if(!r.activo||r.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(r.cuenta||"default")||a.includes(r.cuentaDestino||"default")))continue;const b=q(r.fechaInicio||e.start),g=r.fechaFin?q(r.fechaFin):i,$=A=>{const u=d.find(P=>P._id===(r.cuenta||"default")),m=d.find(P=>P._id===(r.cuentaDestino||"default")),v=dt(u),I=dt(m),y=v==="inversion"&&I==="inversion"||v==="pension"&&I==="pension",h=["transferencia",...y?["traspaso"]:[],...r.tags||[]],w=y?"traspaso-out":"transfer-out",S=y?"traspaso-in":"transfer-in",M=!a||a.length===0||a.includes(r.cuenta||"default"),C=!a||a.length===0||a.includes(r.cuentaDestino||"default");if(M&&s.push({fecha:A,concepto:`Transf. → ${f(r.cuentaDestino||"default")}: ${r.concepto}`,cuantia:r.cuantia,tipo:"gasto",tags:h,cuenta:r.cuenta||"default",sourceId:r._id,sourceType:w}),C&&s.push({fecha:A,concepto:`Transf. ← ${f(r.cuenta||"default")}: ${r.concepto}`,cuantia:r.cuantia,tipo:"ingreso",tags:h,cuenta:r.cuentaDestino||"default",sourceId:r._id,sourceType:S}),M&&!y&&u){if(v==="inversion"){const P=parseInt(A.slice(0,4)),F=Pt(u,x(P));if(F&&F.saldo>0&&F.plusvalia>0){const T=Math.min(1,r.cuantia/F.saldo),R=F.plusvalia*T*.19;R>.01&&s.push({fecha:A,concepto:`Retención IRPF reembolso ${u.nombre} (19% s/plusvalía)`,cuantia:R,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:r.cuenta||"default",sourceId:r._id,sourceType:"investment-tax"})}}else if(v==="pension"){const P=c(parseInt(A.slice(0,4))),F=ma(u,p,P),T=Ka(u,r.cuantia,F||void 0);if(T>0){const _=u.grupoNomina?`IRPF rescate ${u.nombre} (tipo marginal grupo "${u.grupoNomina}": ${F}%)`:`Retención rescate ${u.nombre} (${u.impuestoRetirada}% s/beneficio)`;s.push({fecha:A,concepto:_,cuantia:T,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:r.cuenta||"default",sourceId:r._id,sourceType:"pension-tax"})}}}};if(r.tipoFrecuencia==="extraordinario")b>=n&&b<=i&&b<=g&&$(r.fechaInicio);else if(r.tipoFrecuencia==="mensual"){const A=Math.max(1,r.frecuencia||1);let u=b.getFullYear(),m=b.getMonth();const v=Math.ceil(240/A)+2;for(let I=0;I<v;I++){const y=Qt(u,m,r.diaPago||"")||(()=>{const w=b.getDate(),S=new Date(u,m+1,0).getDate();return L(new Date(u,m,Math.min(w,S)))})(),h=q(y);if(h>i||h>g)break;h>=n&&h>=b&&$(y),m+=A,m>=12&&(u+=Math.floor(m/12),m=m%12)}}else if(r.tipoFrecuencia==="diaria"){const A=Math.max(1,r.frecuencia||1)*864e5;let u=new Date(Math.max(b.getTime(),n.getTime()));if(b<n){const m=Math.ceil((n.getTime()-b.getTime())/A);u=new Date(b.getTime()+m*A)}for(;u<=i&&u<=g;)$(L(u)),u=new Date(u.getTime()+A)}}return s}function se(t,e,a=null){const o=[],s=q(e.start),n=q(e.end);for(const i of t){const d=dt(i);if(d==="cuenta"||!i.activo)continue;const p=i.planAportaciones||[];for(const c of p){if(!c.importe||c.importe<=0)continue;const x=q(c.fechaInicio||e.start),f=c.fechaFin?q(c.fechaFin):n,r=c.cuentaOrigen||"default",b=!a||!a.length||a.includes(r),g=!a||!a.length||a.includes(i._id),$=d==="pension"?"pension":"capital-mobiliario",A=y=>{b&&o.push({fecha:y,concepto:`Aportación → ${i.nombre}`,cuantia:c.importe,tipo:"gasto",tags:["aportacion","transferencia",$],cuenta:r,sourceId:c._id,sourceType:"aportacion-out"}),g&&o.push({fecha:y,concepto:`Aportación ${i.nombre} (${c.periodicidad||"mensual"})`,cuantia:c.importe,tipo:"ingreso",tags:["aportacion","transferencia",$],cuenta:i._id,sourceId:c._id,sourceType:"aportacion-in"})},u={mensual:1,trimestral:3,semestral:6,anual:12}[c.periodicidad||"mensual"]||1;let m=x.getFullYear(),v=x.getMonth();const I=Math.ceil(240/u)+2;for(let y=0;y<I;y++){const h=new Date(m,v+1,0).getDate(),w=L(new Date(m,v,Math.min(x.getDate(),h))),S=q(w);if(S>n||S>f)break;S>=s&&S>=x&&A(w),v+=u,v>=12&&(m+=Math.floor(v/12),v=v%12)}}}return o}function ne(t,e,a=null,o=[]){const s=[];for(const n of t){if(!n.activo||!n.interes||n.interes<=0||a&&a.length>0&&!a.includes(n._id))continue;const i=q(e.start),d=q(e.end),p=n.periodoCobro||"mensual",c=p==="mensual",x=c?null:{diario:864e5,semanal:7*864e5}[p]||864e5,f=c?1/12:x/(365.25*864e5);let r=Nt(n,e.start);const b=o.filter(A=>A.cuenta===n._id).map(A=>({fecha:A.fecha,delta:A.tipo==="ingreso"?Math.abs(A.cuantia):-Math.abs(A.cuantia)})).sort((A,u)=>A.fecha.localeCompare(u.fecha));let g=0,$=new Date(i);for(;$<=d;){const A=c?new Date($.getFullYear(),$.getMonth()+1,$.getDate()):new Date($.getTime()+x),u=new Date(Math.min(A.getTime(),d.getTime()+1)),m=L(u);let v=0;for(;g<b.length&&b[g].fecha<m;)v+=b[g].delta,g++;const I=r,y=r+v,h=Math.max(0,(I+y)/2);r=y;const w=c?f:(u.getTime()-$.getTime())/(365.25*864e5),S=h*(Math.pow(1+n.interes/100,w)-1);S>.001&&s.push({fecha:L($),concepto:`Interés ${n.nombre}`,cuantia:S,tipo:"ingreso",tags:["interes","cuenta"],cuenta:n._id,sourceId:n._id,sourceType:"account-interest"}),$=A}}return s}function ie(t,e,a,o=null){const s=[],n=e||ft;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const d=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),p=Ja(d,n),c={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:p,tags:["irpf","fiscal"]};s.push(...Lt([c],a,o))}return s}const ho=[5,11,2,8],yo={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function re(t,e,a=null,o=[],s=()=>ft){const n=[],i=q(e.start),d=q(e.end),p=o.length>0,c={};for(const r of t){const b=r.grupoNomina||"";c[b]||(c[b]=[]),c[b].push(r)}for(const r of Object.keys(c))c[r].sort((b,g)=>(g.bruto||0)-(b.bruto||0));function x(r,b){if(!p||!r.mesActualizacionIPC)return r.bruto||0;const g=r.fechaInicio||e.start,$=q(g),A=q(b);let u=0;for(let v=$.getFullYear();v<=A.getFullYear();v++){const I=new Date(v,r.mesActualizacionIPC-1,1);I>$&&I<=A&&u++}if(u===0)return r.bruto||0;const m=L(new Date($.getFullYear()+u,0,1));return(r.bruto||0)*lt(o,g,m)}function f(r,b){const g=x(r,b),$=(r.retribucionFlexible||[]).reduce((P,F)=>P+(F.importe||0)*12,0),A=Math.max(0,g-$);if(r.irpfModo==="manual")return A*((r.irpfPct||0)/100);const u=s(parseInt(b.slice(0,4))),m=r.grupoNomina||"";if(!m)return ct(xt(g,$),u);const v=c[m].filter(P=>P.activo),I=v.reduce((P,F)=>P+x(F,b),0),y=v.reduce((P,F)=>P+(F.retribucionFlexible||[]).reduce((T,_)=>T+(_.importe||0)*12,0),0),h=Math.max(0,I-y),w=xt(I,y),S=Math.max(0,g-$),M=h>0?w*(S/h):0,C=v.filter(P=>P._id!==r._id&&(P.bruto||0)>(r.bruto||0)).reduce((P,F)=>{const T=(F.retribucionFlexible||[]).reduce((R,N)=>R+(N.importe||0)*12,0),_=Math.max(0,x(F,b)-T);return P+(h>0?w*(_/h):0)},0);return ct(C+M,u)-ct(C,u)}for(const r of t){if(!r.activo)continue;const b=r.cuenta||"default";if(a&&a.length>0&&!a.includes(b))continue;const g=Math.max(1,r.nPagas||12),$=q(r.fechaInicio||e.start),A=r.fechaFin?q(r.fechaFin):d,u=m=>{const v=x(r,m),I=f(r,m),y=(r.retribucionFlexible||[]).reduce((T,_)=>T+(_.importe||0)*12,0),h=Math.max(0,v-y),w=(r.ssPct??6.35)/100,S=h*w,M=h/g,C=I/g,P=S/g,F=r.representacion==="simplificado"?M-P-C:M;n.push({fecha:m,concepto:r.nombre,cuantia:F,tipo:"ingreso",cuenta:b,tags:r.tags||[],sourceId:r._id,sourceType:"nomina"}),r.representacion==="detallado"&&(P>0&&n.push({fecha:m,concepto:`SS ${r.nombre}`,cuantia:P,tipo:"gasto",cuenta:b,tags:["seguridad-social","fiscal"],sourceId:r._id+"_ss",sourceType:"nomina"}),C>0&&n.push({fecha:m,concepto:`IRPF ${r.nombre}`,cuantia:C,tipo:"gasto",cuenta:b,tags:["irpf","fiscal"],sourceId:r._id+"_irpf",sourceType:"nomina"}));for(const T of r.retribucionFlexible||[])!T.cuenta||!(T.importe>0)||a&&a.length>0&&!a.includes(T.cuenta)||n.push({fecha:m,concepto:`${r.nombre} — ${yo[T.tipo]||T.tipo}`,cuantia:T.importe,tipo:"ingreso",cuenta:T.cuenta,tags:["retribucion-flexible",T.tipo],sourceId:`${r._id}_flex_${T._id||T.tipo}`,sourceType:"nomina"})};if(g<=12){const m=g===12?1:Math.round(12/g),v=$.getDate();let I=$.getFullYear(),y=$.getMonth();for(let h=0;h<300;h++){const w=new Date(I,y+1,0).getDate(),S=new Date(I,y,Math.min(v,w));if(S>d||S>A)break;S>=i&&S>=$&&u(L(S)),y+=m,y>=12&&(I+=Math.floor(y/12),y=y%12)}}else{const m=g-12,v=$.getDate();let I=$.getFullYear(),y=$.getMonth();for(let S=0;S<300;S++){const M=new Date(I,y+1,0).getDate(),C=new Date(I,y,Math.min(v,M));if(C>d||C>A)break;C>=i&&C>=$&&u(L(C)),y++,y>=12&&(I++,y=0)}const h=Math.max($.getFullYear(),i.getFullYear()),w=Math.min((r.fechaFin?A:d).getFullYear(),d.getFullYear());for(let S=h;S<=w;S++)for(const M of ho.slice(0,m)){const C=new Date(S,M,15);C>=i&&C<=d&&C>=$&&C<=A&&u(L(C))}}}return n}function ce(t,e,a,o=null,s="default"){const n=[];if(!e||e.length===0)return n;const i=q(a.start),d=q(a.end),p=V(),c=t.filter(f=>f.activo&&f.tipo==="gasto"&&f.tipoFrecuencia==="mensual");let x=new Date(i.getFullYear(),i.getMonth(),1);for(;x<=d;){const f=x.getFullYear(),r=x.getMonth(),b=f+"-"+String(r+1).padStart(2,"0"),g=b+"-01",$=L(new Date(f,r+1,0)),A=L(new Date(f,r,15));let u=0;for(const m of c){if(o&&o.length>0&&!o.includes(m.cuenta||"default")||m.fechaInicio&&m.fechaInicio>$||m.fechaFin&&m.fechaFin<g)continue;const v=m.fechaInicio||p,I=lt(e,v,A);if(I<=1)continue;const y=Math.max(1,m.frecuencia||1);u+=m.cuantia*(I-1)/y}u>.01&&n.push({fecha:A,concepto:"Incremento coste de vida",cuantia:u,tipo:"gasto",tags:["inflacion"],cuenta:s,sourceId:"inflacion_vida_"+b,sourceType:"inflacion"}),x=new Date(f,r+1,1)}return n}function le(t,e,a,o="default"){const s=[];if(!e||e.length===0||t<=0)return s;const n=q(a.start),i=q(a.end),d=[...e].sort((c,x)=>c.year-x.year);let p=new Date(n.getFullYear(),n.getMonth(),1);for(;p<=i;){const c=p.getFullYear(),x=p.getMonth(),f=c+"-"+String(x+1).padStart(2,"0"),r=L(new Date(c,x,15)),b=d.filter(m=>m.year<=c),g=b.length>0?b[b.length-1]:d[0],$=g?g.tasa/100:0,A=Math.pow(1+$,1/12)-1,u=t*A;u>.01&&s.push({fecha:r,concepto:"Pérdida ahorro por inflación",cuantia:u,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+f,sourceType:"inflacion"}),p=new Date(c,x+1,1)}return s}function de(t,e,a){const o=a.fechaReferencia||a.dashboardStart,s=o<a.dashboardStart?a.dashboardStart:o>a.dashboardEnd?a.dashboardEnd:o,n=e.reduce((f,r)=>f+Nt(r,s),0),i=t.filter(f=>f.fecha<s),d=t.filter(f=>f.fecha>=s),p=[];let c=n;for(const f of[...i].reverse()){const r=f.tipo==="ingreso"?Math.abs(f.cuantia):-Math.abs(f.cuantia);p.unshift({...f,delta:r,saldoAcum:c}),c-=r}const x=[];c=n;for(const f of d){const r=f.tipo==="ingreso"?Math.abs(f.cuantia):-Math.abs(f.cuantia);c+=r,x.push({...f,delta:r,saldoAcum:c})}return[...p,...x]}function xo(t,e,a,o=null){const s=e.filter(n=>n.activo&&(!o||o.length===0||o.includes(n._id)));return de([...t].sort((n,i)=>n.fecha.localeCompare(i.fecha)),s,a)}function kt(t){const{loans:e,expenses:a,accounts:o,config:s}=t,n=t.filtroAccounts??null,i=t.nominas??[],d=t.inflacionPeriodos??[],p={start:s.dashboardStart,end:s.dashboardEnd},c=a.filter($=>$.tipo!=="transferencia"),x=a.filter($=>$.tipo==="transferencia"),f={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let r=[];r=r.concat(Lt(c,p,n)),r=r.concat(ee(e,p,n)),r=r.concat(oe(x,p,n,f)),r=r.concat(se(o,p,n));const b=ne(o,p,n,r);if(r=r.concat(b),r=r.concat(ie(a,s.tramos_irpf,p,n)),r=r.concat(re(i,p,n,d,t.resolverTramosIRPF)),s.usarInflacion&&d.length>0){const $=(o.find(m=>m.activo&&m.esCuentaPrincipal)||o.find(m=>m.activo)||{_id:"default"})._id;r=r.concat(ce(c,d,p,n,$));const u=o.filter(m=>m.activo&&(!n||n.length===0||n.includes(m._id))).reduce((m,v)=>m+Nt(v,s.dashboardStart),0);r=r.concat(le(u,d,p,$))}r.sort(($,A)=>$.fecha.localeCompare(A.fecha));const g=o.filter($=>$.activo&&(!n||n.length===0||n.includes($._id)));return de(r,g,s)}function $o(t,e,a=null){const o=V(),n=e.filter(d=>d.activo&&(!a||a.length===0||a.includes(d._id))).reduce((d,p)=>d+it(p),0),i=t.filter(d=>d.fecha<=o);return i.length===0?n:i[i.length-1].saldoAcum}function ue(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const s of o.tags||["sin_tag"])a.set(s,(a.get(s)||0)+Math.abs(o.cuantia));return a}function Io(t,e){const a=[];let o=!1;for(let s=0;s<t.length;s++){const n=t[s],i=n.saldoAcum;i<0&&(s===0||t[s-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:n.fecha,saldo:i,mensaje:`Saldo negativo (${z(i)}) a partir del ${n.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:n.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${z(i)} < ${z(e)}) desde ${n.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:n.fecha,saldo:i,mensaje:`Recuperación del colchón el ${n.fecha} (${z(i)})`})))}return a}function Ao(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,d)=>i+Math.abs(d.cuantia),0),o=q(e.dashboardStart),s=q(e.dashboardEnd),n=Math.max(1,(s.getTime()-o.getTime())/(30.44*864e5));return a/n}function wo(t,e,a=V()){const o=new Set,s=e.map(d=>{const p=d.fechaInicialSaldo||"",c={};p&&p<=a&&(c[p]=d.saldoInicial||0);for(const x of d.historicoSaldos||[])x.fecha<=a&&(!p||x.fecha>=p)&&(c[x.fecha]=x.saldo);return Object.keys(c).forEach(x=>o.add(x)),c}),n={};for(const d of[...o].sort()){let p=0;for(let c=0;c<e.length;c++){const x=Object.entries(s[c]).filter(([f])=>f<=d);x.length>0?(x.sort(([f],[r])=>r.localeCompare(f)),p+=x[0][1]):p+=e[c].saldoInicial||0}n[d]=p}const i=[];for(const[d,p]of Object.entries(n).sort(([c],[x])=>c.localeCompare(x))){const c=t.filter(b=>b.fecha<=d),x=c.length>0?c[c.length-1].saldoAcum:null;if(x===null)continue;const f=p-x,r=x!==0?f/Math.abs(x)*100:0;i.push({cuenta:"Total",fecha:d,estimado:x,real:p,desv:f,pct:r})}return i}const So=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:wo,detectarPuntosCriticos:Io,mediaMensualGastos:Ao},Symbol.toStringTag,{value:"Module"}));function Ot(t,e=new Date){const a=L(e),o=new Date(e);o.setMonth(o.getMonth()+1);const s=L(o),n=t.filter(d=>d.basico&&d.activo&&d.tipo==="gasto");return Lt(n,{start:a,end:s}).reduce((d,p)=>d+Math.abs(p.cuantia),0)}function ba(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+Ft(a.capital,a.tin,a.meses),0)}function pe(t,e,a,o){return e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0?e.colchonFijo:(Ot(t,o)+ba(a))*(e.colchonMeses||6)}function me(t,e,a,o,s){const i=[...e.colchonPuntos||[]].sort((p,c)=>p.fecha.localeCompare(c.fecha)).filter(p=>p.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(Ot(t,s)+ba(a))*(i.meses||6):pe(t,e,a,s)}function ta(t,e,a,o,s,n=!1,i){const d=[...t.puntos||[]].sort((x,f)=>x.fecha.localeCompare(f.fecha)),p=d.filter(x=>x.fecha<=s).pop()||(n?d[0]:null);return p?p.tipo==="fijo"?p.importe||0:(Ot(e,i)+ba(o))*(p.meses||1):0}function Mo(t,e){const a={};for(const o of e)a[o._id]=it(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=o.cuantia),{fecha:o.fecha,saldos:{...a}}))}function Co(t,e,a,o,s,n,i){const d=[];for(const p of(t||[]).filter(c=>c.activo!==!1)){let c=!1;for(let x=0;x<e.length;x++){const f=e[x],r=ta(p,o,s,n,f.fecha,!1,i);if(r<=0){c=!1;continue}const b=!p.cuentas||p.cuentas.length===0?f.saldoAcum:p.cuentas.reduce((g,$)=>{var A,u;return g+(((u=(A=a[x])==null?void 0:A.saldos)==null?void 0:u[$])||0)},0);b<r&&!c?(c=!0,d.push({tipo:"bajo_margen",fecha:f.fecha,saldo:b,target:r,nombre:p.nombre,mensaje:`⚠ ${p.nombre}: ${z(b)} < ${z(r)} desde ${f.fecha}`})):b>=r&&c&&(c=!1,d.push({tipo:"recuperacion_margen",fecha:f.fecha,saldo:b,target:r,nombre:p.nombre,mensaje:`✓ ${p.nombre}: recuperado el ${f.fecha}`}))}}return d}const zo=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:pe,calcColchonEnFecha:me,calcGastoBasicoMensual:Ot,calcMargenEnFecha:ta,detectarCrucesMargenes:Co,saldosPorCuentaEnExtracto:Mo},Symbol.toStringTag,{value:"Module"}));class Fo extends Error{constructor(a,o){super(`La funcionalidad "${a}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);so(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=a}}let Bt=null;function Po(t){const e=Bt;return Bt=t,()=>{Bt=e}}function fe(t){return Bt?Bt(t):!0}function ve(t,e){if(!fe(t))throw new Fo(t,e)}const ge=[];function ha(){const t=new Map,e=new WeakMap;let a=1,o=0,s=0;const n=p=>{if(!p||typeof p!="object")return 0;const c=e.get(p);if(c)return c;const x=a++;return e.set(p,x),x},i=p=>p.map(c=>[c._id,c.capital,c.tin,c.meses,c.fechaInicio,c.comisionAmort||0,c.comisionApertura||0,c.diaPago||"",c.activo?1:0,c.cuenta||"",(c.amortizaciones||[]).map(x=>`${x.fecha}:${x.cantidad}:${x.tipo||""}`).sort().join(",")].join("|")).join(";");function d(p){const c=[i(p.loans),n(p.expenses),n(p.accounts),n(p.nominas),n(p.inflacionPeriodos),p.config.dashboardStart,p.config.dashboardEnd,p.config.fechaReferencia||"",p.config.usarInflacion?1:0,(p.filtroAccounts||[]).join(",")].join("#"),x=t.get(c);if(x)return s++,x;o++;const f=kt(p);return t.set(c,f),f}return{statement:d,stats:()=>({hits:s,misses:o}),clear:()=>t.clear()}}function ya(t,e,a,o,s={},n=ha()){ve("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:d=36,minAmortizable:p=500,tipoAmort:c="plazo",fechaPrimeraAmort:x=null,loanIds:f=null,nominas:r=ge,sourceAccountId:b=null,selectedMarginIds:g=null,hoy:$=new Date}=s,A=L($),u=Math.min(120,Math.max(1,d)),m=a.filter(D=>D.activo),v=m.map(D=>D._id),I=m.find(D=>D.esCuentaPrincipal)||m[0],y=b&&v.includes(b)?m.find(D=>D._id===b):I,h=y==null?void 0:y._id,w=t.filter(D=>D.activo&&!D.simulacion&&(!f||f.includes(D._id))).sort((D,O)=>O.tin-D.tin),S=!!g&&g.length>0,M=(o.margenesSeguridad||[]).filter(D=>D.activo!==!1).filter(D=>!D.cuentas||D.cuentas.length===0||D.cuentas.includes(h)).filter(D=>!S||g.includes(D._id));if(w.length===0)return{plan:[],margenesAplicados:M.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const C={};for(const D of w)C[D._id]=[];const P=[];function F(D){const O=new Date($.getFullYear(),$.getMonth()+D,1),U=O.getFullYear(),J=O.getMonth(),X=`${U}-${String(J+1).padStart(2,"0")}`,pt=L(new Date(U,J,Math.min(15,new Date(U,J+1,0).getDate())));return{label:X,dia15:pt}}function T(D,O){const U=[...D.amortizaciones||[],...C[D._id]],{tabla:J}=Z({...D,amortizaciones:U}),X=J.filter(st=>st.fecha<=O);if(X.length>0)return X[X.length-1].capitalPendiente;const pt=U.filter(st=>st.fecha<=O).reduce((st,mt)=>st+mt.cantidad,0);return Math.max(0,D.capital-pt)}function _(D){const O=t.map(nt=>({...nt,amortizaciones:[...nt.amortizaciones||[],...C[nt._id]||[]]})),U={...o,dashboardStart:A,dashboardEnd:D},J=n.statement({loans:O,expenses:e,accounts:a,config:U,filtroAccounts:null,nominas:r}),X=m.reduce((nt,Rt)=>nt+it(Rt),0),pt=y?it(y):0,st=X>0?pt/X:1;let mt=pt,Kt=X;for(const nt of J){const Rt=nt.delta??(nt.tipo==="ingreso"?Math.abs(nt.cuantia):-Math.abs(nt.cuantia));nt.cuenta===h?mt+=Rt:v.includes(nt.cuenta)||(mt+=Rt*st),Kt=nt.saldoAcum}return{source:mt,total:Kt}}function R(D){const{source:O}=_(D);if(O<=0)return O;let U=0;for(const J of M){const X=ta(J,e,o,t,D,!0,$);X>U&&(U=X)}return O-U}const N=2;let B=0;if(x){for(let D=0;D<u;D++)if(F(D).dia15>=x){B=D;break}}for(let D=0;D<u;D++){if((D-B)%i!==0||D<B)continue;const{label:O,dia15:U}=F(D);if(U<A)continue;const J=R(U)-N;if(J<p)continue;let X=J,pt=0;for(const st of w){if(X<p)break;const mt=T(st,U);if(mt<1)continue;const Kt=st.comisionAmort||0,nt=1+Kt/100,Rt=Math.floor(X/nt),eo=Math.min(Rt,mt);if(eo<p)continue;const Xt=Math.min(Math.floor(eo),Math.floor(mt)),oo=+(Xt*Kt/100).toFixed(2),Da=Xt+oo;Da>X||(C[st._id].push({_id:`opt_${O}_${st._id}`,fecha:U,cantidad:Xt,tipo:c,simulacion:!0}),pt+=Da,P.push({mes:O,fechaAmort:U,loanId:st._id,loanNombre:st.nombre,tin:st.tin,capitalAntes:mt,cantidadAmort:Xt,comision:oo,capitalDespues:Math.max(0,mt-Xt),saldoDisponible:J+N,excedente:J,saldoDespues:J+N-pt,tipoAmort:c}),X-=Da)}}const G=P.reduce((D,O)=>D+O.cantidadAmort,0),k=P.reduce((D,O)=>D+O.comision,0),H=w.map(D=>{const O=C[D._id];if(!O.length)return null;const U=Z(D),J=Z({...D,amortizaciones:[...D.amortizaciones||[],...O]});return{loanId:D._id,nombre:D.nombre,tin:D.tin,fechaFinSin:U.fechaFin,fechaFinCon:J.fechaFin,mesesAhorrados:U.mesesReales-J.mesesReales,interesesSin:U.totalIntereses,interesesCon:J.totalIntereses,ahorroIntereses:U.totalIntereses-J.totalIntereses,numAmortizaciones:O.length,totalAmortizado:O.reduce((X,pt)=>X+pt.cantidad,0)}}).filter(D=>D!==null),Q=H.reduce((D,O)=>D+O.ahorroIntereses,0);return{plan:P,margenesAplicados:M.length,totalAmortizado:G,totalComisiones:k,totalAhorroIntereses:Q,resumenPorLoan:H}}function be(t,e,a,o,s={},n){ve("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:d=500,tipoAmort:p="plazo",fechaObjetivo:c=null,frecuencias:x=[1,2,3,6,12],fechaPrimeraAmort:f=null,loanIds:r=null,nominas:b=ge,sourceAccountId:g=null,selectedMarginIds:$=null,hoy:A=new Date}=s,u=n??ha(),m=L(A),v=c||L(new Date(A.getFullYear(),A.getMonth()+i,1));function I(w){const S=t.map(F=>({...F,amortizaciones:[...F.amortizaciones||[],...w[F._id]||[]]})),M={...o,dashboardStart:m,dashboardEnd:v},C=u.statement({loans:S,expenses:e,accounts:a,config:M,filtroAccounts:null,nominas:b});if(C.length===0)return a.filter(F=>F.activo).reduce((F,T)=>F+it(T),0);const P=C.filter(F=>F.fecha<=v);return P.length>0?P[P.length-1].saldoAcum:C[0].saldoAcum}const y=I({}),h=x.map(w=>{const S=ya(t,e,a,o,{frecuencia:w,mesesHorizonte:i,minAmortizable:d,tipoAmort:p,fechaPrimeraAmort:f,loanIds:r,nominas:b,sourceAccountId:g,selectedMarginIds:$,hoy:A},u),M={};for(const P of t)M[P._id]=[];for(const P of S.plan)M[P.loanId].push({_id:P.mes+"_"+P.loanId,fecha:P.fechaAmort,cantidad:P.cantidadAmort,tipo:p,simulacion:!0});const C=I(M);return{frecuencia:w,label:w===1?"Mensual":`Cada ${w} meses`,numAmortizaciones:S.plan.length,totalAmortizado:S.totalAmortizado,totalComisiones:S.totalComisiones,ahorroIntereses:S.totalAhorroIntereses,saldoObjetivo:C,gananciaSaldo:C-y,valorTotal:S.totalAhorroIntereses+(C-y),plan:S.plan,resumenPorLoan:S.resumenPorLoan}}).filter(w=>w.numAmortizaciones>0);if(h.length>0){const w=Math.max(...h.map(C=>C.ahorroIntereses)),S=Math.max(...h.map(C=>C.saldoObjetivo)),M=Math.max(...h.map(C=>C.valorTotal));h.forEach(C=>{C.esMejorIntereses=C.ahorroIntereses===w,C.esMejorSaldo=C.saldoObjetivo===S,C.esMejorValor=C.valorTotal===M})}return{resultados:h,saldoBase:y,fechaObjetivo:v}}const To=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:be,createStatementMemo:ha,defaultHoyISO:V,optimizarAmortizaciones:ya},Symbol.toStringTag,{value:"Module"})),jo=30.44*864e5;function he(t){const e=t.getFullYear(),a=t.getMonth();return{desde:L(new Date(e,a,1)),hasta:L(new Date(e,a,na(e,a)))}}function ye(t){const[e,a]=t.split("-").map(Number);return he(new Date(e,a-1,1))}function _o(t,e){return Math.max(1,(q(e).getTime()-q(t).getTime())/jo)}const Eo=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),$t=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function Do(t,e){const a=new Map(e.map(n=>[n._id,n.clasificacion]));let o=0,s=0;for(const n of t){if(n.tipo!=="gasto"||n.sourceType!=="expense")continue;const i=a.get(n.sourceId??"");i!==null&&(i==="deseo"?s+=Math.abs(n.cuantia):o+=Math.abs(n.cuantia))}return{basicos:o,deseo:s}}function Ro(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=r=>r.sourceType==="loan"&&r.tipo==="gasto",s=e.loanIdsIniciados,n=$t(t.filter(r=>r.tipo==="ingreso")),i=$t(t.filter(r=>o(r)&&(!s||s.has(r.sourceId??"")))),d=$t(t.filter(r=>o(r)&&e.hipotecaIds.has(r.sourceId??""))),p=$t(t.filter(r=>r.sourceType==="loan-amort")),c=$t(t.filter(r=>r.sourceType==="account-interest")),{basicos:x,deseo:f}=Do(t,e.expenses);return{ingresos:n/a,cuotas:i/a,cuotasHipoteca:d/a,amortizaciones:p/a,gastosBasicos:x/a,gastosDeseo:f/a,gastosTotales:(i+x+f)/a,intereses:c/a}}function xe(t,e){return t.reduce((a,o)=>{const s=Z(o).tabla.filter(n=>!n.esAmortizacion&&n.fecha<=e);return a+(s.length>0?s[s.length-1].capitalPendiente:o.capital||0)},0)}function No(t,e,a,o){const s=t.filter(c=>c.activo&&!c.simulacion&&(c.fechaInicio||"")<=a),n=s.reduce((c,x)=>{if((x.amortizaciones||[]).filter(g=>g.fecha>=e&&g.fecha<=a).length===0)return c;const r=Z(x).totalIntereses,b=Z({...x,amortizaciones:(x.amortizaciones||[]).filter(g=>g.fecha<e||g.fecha>a)}).totalIntereses;return c+Math.max(0,b-r)},0),i=s.filter(c=>c.mostrarFechaFinEnDashboard!==!1).map(c=>({loan:c,fechaFin:Z(c).fechaFin})).filter(c=>!!c.fechaFin&&c.fechaFin>=e&&c.fechaFin<=a),d=s.map(c=>Z(c).tabla),p=c=>{const{desde:x,hasta:f}=ye(c);return d.reduce((r,b)=>{const g=b.find($=>!$.esAmortizacion&&$.fecha>=x&&$.fecha<=f);return r+(g?g.cuota:0)},0)};return{deudaInicio:xe(s,e),deudaFin:xe(s,a),ahorroIntereses:n,ahorroInteresesMes:o>0?n/o:0,cuotasInicio:p(e.slice(0,7)),cuotasFin:p(a.slice(0,7)),finEnPeriodo:i}}function qo(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:$t(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function $e(t,e=new Set,a="desglosado"){if(e.size===0)return ue(t,"gasto");const o=new Map;for(const s of t){if(s.tipo!=="gasto")continue;const n=s.tags||[],i=n.filter(c=>e.has(c)),d=n.filter(c=>!e.has(c)),p=a==="porgrupos"&&i.length>0?i:d;for(const c of p)o.set(c,(o.get(c)||0)+Math.abs(s.cuantia))}return o}function Lo(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...$e(t,e.grupoTags,e.modo).entries()].filter(([s])=>!a||a.size===0||a.has(s)).map(([s,n])=>({tag:s,total:n/o})).sort((s,n)=>n.total-s.total)}function ko(t,e){const a=e.reduce((o,s)=>o+it(s),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:$t(t.filter(o=>o.tipo==="gasto")),totalIngresos:$t(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Oo(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function Bo(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function Ho(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}const Go=Object.freeze(Object.defineProperty({__proto__:null,cuentasVisibles:Oo,gastoPorTagOrdenado:Lo,idsHipoteca:Bo,idsPrestamosIniciados:Ho,interesesPorCuenta:qo,mesesDelPeriodo:_o,metricasFlujo:Ro,rangoMes:ye,rangoMesDe:he,resumenPrestamosPeriodo:No,sinTransferencias:Eo,sumarGastosPorTag:$e,totalesPeriodo:ko},Symbol.toStringTag,{value:"Module"}));function Vo(t,e,a){const o=t||[];if(!o.length)return e;const s=o.find(i=>i.año===a);if(s)return s.tramos;const n=o.filter(i=>i.año<a).sort((i,d)=>d.año-i.año);return n.length?n[0].tramos:e}function vt(t,e){return a=>Vo(t,e,a)}const Ht=7,Ie=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],Ae=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function xa(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}function we(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:Ie,tramosGananciasCapital:Ae,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function Uo(t,e){return{loans:[],expenses:[],accounts:[xa(t)],nominas:[],goals:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],config:we(t,e)}}const gt=t=>Array.isArray(t)?t:[],Yo=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Gt(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function Se(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function $a(t){const{varianza:e,inflacion:a,...o}=t;return o}function Wo(t,e){const{hoyISO:a,finISO:o}=e,s={...t},n=Yo(t.config),d={...we(a,o)};for(const[x,f]of Object.entries(n))f!=null&&(d[x]=f);delete d.saldoInicial,delete d.saldoInicialFecha,delete d.inflacionGlobal,delete d.showMC,delete d.mcIteraciones,(!Array.isArray(d.tramos_irpf)||d.tramos_irpf.length===0)&&(d.tramos_irpf=Ie),(!Array.isArray(d.tramosGananciasCapital)||d.tramosGananciasCapital.length===0)&&(d.tramosGananciasCapital=Ae),(!Array.isArray(d.saludRegla)||d.saludRegla.length!==3)&&(d.saludRegla=[50,30,20]),(typeof d.features!="object"||d.features===null||Array.isArray(d.features))&&(d.features={}),s.config=d;let p=gt(t.accounts).map(x=>{const f={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...x};return f.modeloFondo||(f.modeloFondo=f.esFondoPension?"pension":"cuenta"),delete f.esFondoPension,Array.isArray(f.historicoSaldos)||(f.historicoSaldos=[]),Gt(f)});p.length===0&&(p=[xa(a)]);const c=p.filter(x=>x.esCuentaPrincipal);if(c.length===0){const x=p.find(f=>f._id==="default")||p[0];p=p.map(f=>({...f,esCuentaPrincipal:f._id===x._id}))}else if(c.length>1){let x=!1;p=p.map(f=>f.esCuentaPrincipal?x?{...f,esCuentaPrincipal:!1}:(x=!0,f):f)}return s.accounts=p,s.expenses=gt(t.expenses).map(x=>{const f={basico:!1,activo:!0,tags:[],historialPrecios:[],...x};return Array.isArray(f.tags)||(f.tags=[]),Array.isArray(f.historialPrecios)||(f.historialPrecios=[]),f.diaPago=Se(f.diaPago),$a(Gt(f))}),s.loans=gt(t.loans).map(x=>{const f={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...x};return Array.isArray(f.tags)||(f.tags=[]),f.diaPago=Se(f.diaPago),f.amortizaciones=gt(f.amortizaciones).map(r=>Gt(r)),$a(Gt(f))}),s.nominas=gt(t.nominas).map(x=>{const f={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...x};return Array.isArray(f.tags)||(f.tags=[]),Array.isArray(f.retribucionFlexible)||(f.retribucionFlexible=[]),$a(Gt(f))}),s.goals=gt(t.goals).map((x,f)=>{const r=Array.isArray(x.cuentaIds)?x.cuentaIds:x.cuentaId?[x.cuentaId]:[],{cuentaId:b,...g}=x;return{prioridad:f+1,completado:!1,usarColchon:!0,targetAmount:0,...g,cuentaIds:r}}),s.inflacion=gt(t.inflacion),s.tramosIRPFHistorico=gt(t.tramosIRPFHistorico),s.tramosGananciasCapitalHistorico=gt(t.tramosGananciasCapitalHistorico),s.escenarios=gt(t.escenarios).map(({inversiones:x,...f})=>f),s}const Tt=t=>Array.isArray(t)?t:[];let Ia=0;function Jo(t){return Ia+=1,`${t}_${Ia.toString(36)}`}const Ko=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Xo=t=>typeof t=="number"&&Number.isFinite(t);function Qo(t,e){const a={...t};Ia=0;const o=Tt(t.transacciones),s=Tt(t.puntosControl),n=[...s],i=new Set(s.map(c=>`${c.cuentaId}|${c.fecha}`)),d=(c,x,f,r)=>{if(!Ko(x)||!Xo(f))return;const b=`${c}|${x}`;i.has(b)||(i.add(b),n.push({_id:Jo("pc"),fecha:x,cuentaId:c,saldoCts:At(f),...typeof r=="string"&&r?{nota:r}:{}}))};for(const c of Tt(t.accounts)){const x=typeof c._id=="string"?c._id:null;if(x)for(const f of Tt(c.historicoSaldos))d(x,f.fecha,f.saldo,f.nota)}const p=Tt(t.history);if(p.length>0){const c=Tt(t.accounts),x=c.find(r=>r.esCuentaPrincipal)||c.find(r=>r.activo)||c[0],f=typeof(x==null?void 0:x._id)=="string"?x._id:"default";for(const r of p){const b=typeof r.cuenta=="string"?r.cuenta:typeof r.cuentaId=="string"?r.cuentaId:f;d(b,r.fecha,r.saldo,r.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=n.sort((c,x)=>String(c.fecha).localeCompare(String(x.fecha))),a}const Aa=t=>Array.isArray(t)?t:[],Zo=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),ts=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let wa=0;function as(){return wa+=1,`tx_hp_${wa.toString(36)}`}function es(t,e){const a={...t};wa=0;const o=[...Aa(t.transacciones)],s=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),n=Aa(t.expenses).map(i=>{const d=Aa(i.historialPrecios),p=typeof i._id=="string"?i._id:null,c=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",x=i.tipo==="ingreso"?"ingreso":"gasto",f=Array.isArray(i.tags)?i.tags.filter(g=>typeof g=="string"):[];if(p)for(const g of d){if(!g||!Zo(g.fecha)||!ts(g.cuantia))continue;const $=x==="ingreso"?At(g.cuantia):-At(g.cuantia),A=`${p}|${g.fecha}|${$}`;s.has(A)||(s.add(A),o.push({_id:as(),fecha:g.fecha,cuentaId:c,importeCts:$,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:f,estimacionId:p,tipo:x,origen:"importado",nota:typeof g.nota=="string"&&g.nota?g.nota:"Importado del historial de precios"}))}const{historialPrecios:r,...b}=i;return b});return a.expenses=n,a.transacciones=o.sort((i,d)=>String(i.fecha).localeCompare(String(d.fecha))),a}const os=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Wo},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Qo},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:es}],ss=["history"];function Me(t,e,a){let o=t;const s=[];for(const n of[...os].sort((i,d)=>i.version-d.version))(e??0)>=n.version||(o=n.migrate(o,a),s.push(n.version));return{state:o,applied:s}}const aa="state_",Sa="state__schemaVersion",Ce="financeapp_";function ns(t=localStorage,e=Ce){const a=o=>`${e}${o}`;return{get(o){try{const s=t.getItem(a(o));return s===null?null:JSON.parse(s)}catch{return null}},set(o,s){try{t.setItem(a(o),JSON.stringify(s))}catch(n){console.error("No se pudo guardar en localStorage:",o,n)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(e)&&o.push(n.slice(e.length))}return o}}}function is(t=localStorage,e=Ce){const a=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(aa)&&!n.startsWith(e)&&a.push(n)}const o=[];for(const s of a)try{const n=t.getItem(s);n!==null&&t.getItem(`${e}${s}`)===null&&(t.setItem(`${e}${s}`,n),o.push(s)),t.removeItem(s)}catch{}return o}function rs(t){return L(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function cs({adapter:t,hoy:e=new Date}){const a=L(e),o=rs(e);let s=Uo(a,o);const n=new Set;let i=[];function d(M){for(const C of n)C(M)}function p(M){t.set(`${aa}${M}`,s[M])}function c(){const M={};for(const T of Object.keys(s)){const _=t.get(`${aa}${T}`);_!==null&&(M[T]=_)}for(const T of ss){const _=t.get(`${aa}${T}`);_!==null&&(M[T]=_)}const C=t.get(Sa),{state:P,applied:F}=Me(M,C,{hoyISO:a,finISO:o});if(s=P,x(),F.length>0){for(const T of Object.keys(s))p(T);t.set(Sa,Ht)}return i=F,{applied:F}}function x(){if(!Array.isArray(s.accounts)||s.accounts.length===0){s.accounts=[xa(a)],p("accounts");return}const M=s.accounts.filter(C=>C.esCuentaPrincipal);if(M.length===0)s.accounts=s.accounts.map((C,P)=>P===0?{...C,esCuentaPrincipal:!0}:C),p("accounts");else if(M.length>1){let C=!1;s.accounts=s.accounts.map(P=>P.esCuentaPrincipal?C?{...P,esCuentaPrincipal:!1}:(C=!0,P):P),p("accounts")}}function f(M){return s[M]}function r(M,C){s[M]=C,p(M),d(M)}function b(M){r("config",{...s.config,...M})}function g(M){return n.add(M),()=>n.delete(M)}function $(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function A(M,C){const P=[...s[M]],F={...C,_id:$()};return P.push(F),r(M,P),F}function u(M,C,P){const F=s[M].map(T=>T._id===C?{...T,...P}:T);r(M,F)}function m(M,C){const P=s[M].filter(F=>F._id!==C);r(M,P)}function v(){const M=s.accounts||[],C=M.find(P=>P.esCuentaPrincipal&&P.activo)||M.find(P=>P.activo);return C?C._id:"default"}function I(M){var C;return((C=s.accounts.find(P=>P._id===M))==null?void 0:C.nombre)??M}function y(){return vt(s.tramosIRPFHistorico,s.config.tramos_irpf)}function h(){return vt(s.tramosGananciasCapitalHistorico,s.config.tramosGananciasCapital)}function w(){return structuredClone(s)}function S(M,C=null){const{state:P,applied:F}=Me(M,C,{hoyISO:a,finISO:o});s=P,x();for(const T of Object.keys(s))p(T);t.set(Sa,Ht);for(const T of Object.keys(s))d(T);return{applied:F}}return{load:c,get:f,set:r,patchConfig:b,subscribe:g,addItem:A,updateItem:u,removeItem:m,getPrincipalAccountId:v,accountName:I,resolverTramosIRPF:y,resolverTramosGanancias:h,snapshot:w,replaceAll:S,get schemaVersion(){return Ht},get migrationsApplied(){return[...i]},get today(){return a||V()}}}const Y={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},It=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:Y.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:Y.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:Y.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:Y.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:Y.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro",descripcion:"Metas con importe y fecha, con proyección de cumplimiento.",grupo:Y.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:Y.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:Y.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:Y.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:Y.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:Y.planificacion,porDefecto:!1},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:Y.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:Y.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"salud-financiera",nombre:"Salud financiera",descripcion:"Tasa de ahorro, ratio de endeudamiento y regla 50/30/20 con semáforos.",grupo:Y.analisis,porDefecto:!0},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:Y.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:Y.analisis,porDefecto:!0},{id:"flujo-mensual",nombre:"Flujo de caja mensual",descripcion:"Entradas y salidas mes a mes del periodo analizado.",grupo:Y.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:Y.analisis,porDefecto:!0},{id:"desviacion",nombre:"Desviación real vs estimado",descripcion:"Compara el saldo real registrado con el proyectado en cada fecha.",grupo:Y.analisis,porDefecto:!0,dependencias:["contabilidad"]},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:Y.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:Y.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:Y.datos,porDefecto:!1,dependencias:["sync-nube"]}],ls=new Map(It.map(t=>[t.id,t]));function Vt(t){return ls.get(t)}function ze(t){return It.filter(e=>(e.dependencias||[]).includes(t))}function Ma(){const t={};for(const e of It)t[e.id]=e.porDefecto;return t}function Fe(){const t=[],e=new Map;for(const a of It)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function ds(t){function e(){return{...Ma(),...t.get("config").features||{}}}function a(f){t.patchConfig({features:f})}function o(f,r=e(),b=new Set){const g=Vt(f);if(!g)return!1;if(g.nucleo)return!0;if(r[f]===!1)return!1;if(b.has(f))return!0;b.add(f);for(const $ of g.dependencias||[])if(!o($,r,b))return!1;return!0}function s(f,r=e()){const b=Vt(f);return b?(b.dependencias||[]).filter(g=>!o(g,r)):[]}function n(f,r){var v;const b=Vt(f);if(!b)return{cambiadas:[]};if(b.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const g=e(),$=new Map(It.map(I=>[I.id,o(I.id,g)])),A={...g,[f]:r};let u;if(r){const I=[...b.dependencias||[]];for(;I.length;){const y=I.pop();A[y]===!1&&(A[y]=!0,u="dependencias-activadas"),I.push(...((v=Vt(y))==null?void 0:v.dependencias)||[])}}else{const I=ze(f).map(y=>y.id);for(;I.length;){const y=I.pop();A[y]!==!1&&(A[y]=!1,u="cascada-apagado"),I.push(...ze(y).map(h=>h.id))}}return a(A),{cambiadas:It.filter(I=>o(I.id,A)!==$.get(I.id)).map(I=>I.id),motivo:u}}function i(){const f=e();return It.map(r=>{const b=s(r.id,f);return{...r,activa:o(r.id,f),...b.length>0&&f[r.id]!==!1?{bloqueadaPor:b}:{}}})}function d(){const f=e();return Fe().map(({grupo:r,features:b})=>({grupo:r,features:b.map(g=>{const $=s(g.id,f);return{...g,activa:o(g.id,f),...$.length>0&&f[g.id]!==!1?{bloqueadaPor:$}:{}}})}))}function p(){a(Ma())}function c(f){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...f?{nombre:f}:{},features:e()}}function x(f){const r=f,b=r&&typeof r=="object"&&r.features&&typeof r.features=="object"?r.features:null;if(!b)throw new Error('El perfil no tiene una sección "features" válida');const g=Ma(),$=[],A=[];for(const[u,m]of Object.entries(b)){if(!Vt(u)){A.push(u);continue}if(typeof m!="boolean"){A.push(u);continue}g[u]=m,$.push(u)}return a(g),{aplicadas:$,ignoradas:A}}return{isEnabled:f=>o(f),setEnabled:n,estado:i,estadoPorGrupo:d,reset:p,exportProfile:c,importProfile:x,bloqueadaPor:f=>s(f)}}const Ut=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function jt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function us(t){var s,n;const a=(((s=t.bloqueadaPor)==null?void 0:s.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(n=t.bloqueadaPor)==null?void 0:n.map(Ut).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${Ut(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${Ut(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${Ut(t.descripcion)}</div>
        ${a}
      </div>
    </div>`}function ps(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:s})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Ut(o)}</div>
        ${s.map(us).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function ms(t){var s;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-feature-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function fs(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${ps(a)}`,s(i)}function s(i){var p,c,x;i.querySelectorAll("[data-feature-toggle]").forEach(f=>{f.addEventListener("change",()=>{var g;const r=f.dataset.featureToggle,b=a.setEnabled(r,f.checked);b.motivo==="dependencias-activadas"&&jt(t,"Se han activado también las funcionalidades necesarias"),b.motivo==="cascada-apagado"&&jt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(g=t.onChange)==null||g.call(t,b.cambiadas),o(i)})});const d=i.querySelector("[data-feature-file]");(p=i.querySelector('[data-feature-action="export"]'))==null||p.addEventListener("click",()=>{const f=a.exportProfile(),r=new Blob([JSON.stringify(f,null,2)],{type:"application/json"}),b=URL.createObjectURL(r),g=e.createElement("a");g.href=b,g.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,g.click(),URL.revokeObjectURL(b),jt(t,"Perfil de funcionalidades guardado")}),(c=i.querySelector('[data-feature-action="import"]'))==null||c.addEventListener("click",()=>d==null?void 0:d.click()),d==null||d.addEventListener("change",async()=>{var r,b;const f=(r=d.files)==null?void 0:r[0];if(f)try{const{aplicadas:g,ignoradas:$}=a.importProfile(JSON.parse(await f.text()));jt(t,$.length>0?`Perfil cargado (${g.length} aplicadas, ${$.length} ignoradas por ser de otra versión)`:`Perfil cargado (${g.length} funcionalidades)`),(b=t.onChange)==null||b.call(t,g),o(i)}catch(g){jt(t,"No se pudo cargar el perfil: "+g.message,"err")}finally{d.value=""}}),(x=i.querySelector('[data-feature-action="reset"]'))==null||x.addEventListener("click",()=>{var f;a.reset(),jt(t,"Funcionalidades restablecidas"),(f=t.onChange)==null||f.call(t,[]),o(i)})}function n(){const i=ms(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:n,renderInto:o}}const Pe={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function Te(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const s=e(o);a.style.display=s?"":"none",s?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function vs({flags:t,document:e=document,router:a,rutasExtra:o}){function s(){const d=e.querySelector(".nav-btn.active[data-view]");return(d==null?void 0:d.dataset.view)??null}function n(){let d=!1;const p=Object.entries((o==null?void 0:o())??{}).map(([c,x])=>[x,c]);for(const[c,x]of[...Object.entries(Pe),...p]){const f=t.isEnabled(c),r=e.querySelector(`.nav-btn[data-view="${x}"]`);r&&(r.style.display=f?"":"none"),!f&&s()===x&&(d=!0)}if(e.querySelectorAll(".nav-section").forEach(c=>{const x=[...c.querySelectorAll(".nav-btn[data-view]")];if(x.length===0)return;const f=x.some(r=>r.style.display!=="none");c.style.display=f?"":"none"}),Te(e,c=>t.isEnabled(c)),d){const c=a??globalThis.Router;c==null||c.navigate("dashboard")}}function i(d=e.body){if(typeof MutationObserver>"u")return()=>{};let p=!1;const c=new MutationObserver(()=>{if(!p){p=!0;try{Te(e,x=>t.isEnabled(x))}finally{p=!1}}});return c.observe(d,{childList:!0,subtree:!0}),()=>c.disconnect()}return{apply:n,observar:i,vistaPara:d=>Pe[d]}}function gs({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function s(g){return`view-${g}`}function n(g){const $=t.getElementById(s(g.route));if($)return $;const A=t.querySelector(".view-container");if(!A)return null;const u=t.createElement("div");return u.id=s(g.route),u.className="view hidden",A.appendChild(u),u}function i(g){if(t.querySelector(`.nav-btn[data-view="${g.route}"]`))return;const $=t.querySelectorAll(".nav-section"),A=$[g.seccion??Math.max(0,$.length-1)];if(!A)return;const u=t.createElement("button");u.className="nav-btn",u.dataset.view=g.route,u.innerHTML=`${g.iconoPath?`<svg viewBox="0 0 24 24"><path d="${g.iconoPath}"/></svg>`:""}<span>${g.nombre}</span>`,A.appendChild(u),u.addEventListener("click",()=>{const m=globalThis.Router;m==null||m.navigate(g.route)})}function d(g){a.set(g.route,g),n(g),i(g)}function p(){return[...a.keys()].filter(g=>{const $=a.get(g);return!e||e($.flagId??$.id)})}function c(g){return p().includes(g)}function x(g){const $=a.get(g);if(!$||e&&!e($.flagId??$.id))return!1;const A=n($);if(!A)return!1;if(o&&o!==g){const u=a.get(o),m=t.getElementById(s(o));u!=null&&u.unmount&&m&&u.unmount(m)}return $.mount(A),o=g,!0}function f(){o&&x(o)}function r(){const g={};for(const[$,A]of a)g[$]=A.flagId??A.id;return g}function b(){for(const g of a.values())n(g),i(g)}return{register:d,routes:p,has:c,mount:x,rerender:f,flagPorRuta:r,attachToShell:b,get activa(){return o}}}function l(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function _t(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${l(z(t))}</span>`}function je(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function _e(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${l(e)}</span>`).join(" ")}const bs=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function hs(t){const[e,a]=t.split("-").map(Number);return`${bs[a-1]} ${e}`}function E(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function tt(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function j(t,e,a){t.addEventListener("click",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(e);s&&t.contains(s)&&a(s,o)})}function W(t,e,a){t.addEventListener("change",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(e);s&&t.contains(s)&&a(s,o)})}function ut(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function Ee(t,e){const a=parseFloat(ut(t,e));return Number.isFinite(a)?a:0}function ys(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function xs(t,e){const{ledger:a}=t,o=(t.hoy??V)(),s=t.accounts().filter(m=>m.activo),{desde:n,hasta:i}=ys(e.mes),d={cuentaId:e.cuentaId||void 0,desde:n,hasta:i,texto:e.filtroTexto||void 0},p=a.transacciones(d),c=t.estimaciones().filter(m=>m.tipo!=="transferencia"),x=p.filter(m=>m.importeCts<0).reduce((m,v)=>m+v.importeCts,0),f=p.filter(m=>m.importeCts>0).reduce((m,v)=>m+v.importeCts,0),r=e.cuentaId?a.saldoCuenta(e.cuentaId,i):a.saldoTotal(i),b=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),g=s.map(m=>`<option value="${l(m._id)}"${m._id===e.cuentaId?" selected":""}>${l(m.nombre)}</option>`).join(""),$=m=>'<option value="">— sin asignar —</option>'+c.map(v=>`<option value="${l(v._id)}"${v._id===m?" selected":""}>${l(v.concepto)} (${l(z(v.cuantia))})</option>`).join(""),A=p.map(m=>{var v;return`
      <tr data-tx="${l(m._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${l(m.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${l(m.concepto)}</td>
        <td style="padding:7px 8px">${_e(m.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${l(((v=t.accounts().find(I=>I._id===m.cuentaId))==null?void 0:v.nombre)??m.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${l(m._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${$(m.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${_t(et(m.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${l(m._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${l(m._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),u=b.slice().reverse().slice(0,8).map(m=>{var v;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${l(m.fecha)}</span>
        <span style="color:var(--text3)">${l(((v=t.accounts().find(I=>I._id===m.cuentaId))==null?void 0:v.nombre)??m.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${l(z(et(m.saldoCts)))}</span>
        ${m.nota?`<span style="color:var(--text3)">${l(m.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${l(m._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
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
            <input class="form-input" type="month" id="acc-mes" value="${l(e.mes)}" style="width:140px"/>
          </div>
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${l(e.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${_t(et(x))}</span>
          <span>Ingresos: ${_t(et(f))}</span>
          <span>Neto: ${_t(et(f+x))}</span>
          <span style="margin-left:auto">Saldo a ${l(i)}: <strong>${l(z(r))}</strong></span>
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
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${g}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(m=>`<option value="${l(m)}"></option>`).join("")}</datalist>
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
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${g}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${u?`<div class="mt-12">${u}</div>`:""}
        </div>
      </div>
    </div>`}function $s(t,e,a,o){const{ledger:s}=e;W(t,"#acc-cuenta",i=>{a.cuentaId=i.value,o()}),W(t,"#acc-mes",i=>{a.mes=i.value||a.mes,o()});const n=t.querySelector("#acc-buscar");n==null||n.addEventListener("input",()=>{a.filtroTexto=n.value,clearTimeout(n._t),n._t=window.setTimeout(o,200)}),j(t,"#nt-guardar",()=>{const i=ut(t,"#nt-concepto").trim(),d=Ee(t,"#nt-importe");if(!i)return E("Indica un concepto","err");if(!(d>0))return E("Indica un importe mayor que cero","err");const p=ut(t,"#nt-tags").split(",").map(c=>c.trim().toLowerCase()).filter(Boolean);s.registrar({fecha:ut(t,"#nt-fecha")||(e.hoy??V)(),cuentaId:ut(t,"#nt-cuenta"),importe:d,concepto:i,tags:p,tipo:ut(t,"#nt-tipo"),estimacionId:ut(t,"#nt-estimacion")||null}),E("Movimiento registrado"),e.onDatosCambiados(),o()}),j(t,"[data-tx-borrar]",i=>{const d=i.dataset.txBorrar;tt("¿Eliminar este movimiento?")&&(s.eliminar(d),E("Movimiento eliminado"),e.onDatosCambiados(),o())}),j(t,"[data-tx-editar]",i=>{const d=i.dataset.txEditar,p=s.transacciones().find(f=>f._id===d);if(!p)return;const c=window.prompt(`Importe de "${p.concepto}" (€)`,String(Math.abs(et(p.importeCts))));if(c===null)return;const x=parseFloat(c.replace(",","."));if(!Number.isFinite(x)||x<=0)return E("Importe no válido","err");s.actualizar(d,{importe:x}),E("Movimiento actualizado"),e.onDatosCambiados(),o()}),W(t,"[data-tx-estimacion]",i=>{const d=i.getAttribute("data-tx-estimacion");s.asignarEstimacion(d,i.value||null),E("Asignación actualizada"),e.onDatosCambiados()}),j(t,"#pc-guardar",()=>{if(ut(t,"#pc-saldo").trim()==="")return E("Indica el saldo","err");const d=Ee(t,"#pc-saldo");s.registrarPuntoControl(ut(t,"#pc-cuenta"),ut(t,"#pc-fecha")||(e.hoy??V)(),d,ut(t,"#pc-nota").trim()||void 0),E("Saldo real registrado"),e.onDatosCambiados(),o()}),j(t,"[data-pc-borrar]",i=>{tt("¿Eliminar este punto de control?")&&(s.eliminarPuntoControl(i.dataset.pcBorrar),E("Punto de control eliminado"),e.onDatosCambiados(),o())})}function De(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:s=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const n=ot(t.mediaRealReciente),i=ot(n-e),d=e!==0?i/Math.abs(e)*100:n!==0?100:0;if(Math.abs(d)<s)return null;const p=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:ot(e),cuantiaSugerida:n,diferencia:i,variacionPct:d,precision:t.precision,mesesConsiderados:p,motivo:i>0?`El gasto real de los últimos ${p} meses supera lo estimado`:`El gasto real de los últimos ${p} meses es inferior a lo estimado`}}function Is(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(n,i,d={}){const p=d.hoy??V(),c=t.get("expenses"),x=c.find(g=>g._id===n);if(!x)throw new Error(`La estimación ${n} no existe`);const f={...x,fechaFin:p},r={...x,_id:e(),cuantia:ot(i),fechaInicio:p,fechaFin:x.fechaFin??null,ajustadaDesdeId:x._id,ajustadaEn:p},b=c.map(g=>g._id===n?f:g);return b.push(r),t.set("expenses",b),{estimacionCerrada:f,estimacionNueva:r}}function o(n,i={}){const d=[],p=[];for(const c of n)try{d.push(a(c.estimacionId,c.cuantiaSugerida,i))}catch(x){p.push({estimacionId:c.estimacionId,error:x.message})}return{aplicadas:d,errores:p}}function s(n){const i=t.get("expenses"),d=new Map(i.map($=>[$._id,$])),p=d.get(n);if(!p)return[];const c=[];let x=p;const f=new Set;for(;x!=null&&x.ajustadaDesdeId&&!f.has(x._id);){f.add(x._id);const $=d.get(x.ajustadaDesdeId);if(!$)break;c.unshift($),x=$}const r=[];let b=p;const g=new Set([p._id]);for(;;){const $=i.find(A=>A.ajustadaDesdeId===b._id&&!g.has(A._id));if(!$)break;g.add($._id),r.push($),b=$}return[...c,p,...r]}return{aplicar:a,aplicarTodas:o,cadena:s}}function Ca(t){const e=t.estimaciones(),a=new Map(e.map(o=>[o._id,o]));return t.precision.analizarTodas(e).map(o=>{const s=a.get(o.estimacionId);return{analisis:o,estimacion:s,sugerencia:De(o,s.cuantia)}}).filter(o=>!!o.estimacion)}function As(t){const e=Ca(t),a=e.filter(p=>p.analisis.precision!==null),o=e.filter(p=>p.sugerencia!==null),s=t.precision.analizarPorTag(e.map(p=>p.analisis));if(a.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const n=a.map(({analisis:p,estimacion:c,sugerencia:x})=>{const f=p.meses.slice(-6).map(r=>`${hs(r.mes)}: ${z(r.estimado)} → ${z(r.real)} (${r.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${l(c.concepto)}</div>
          <div style="margin-top:3px">${_e(p.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${l(f)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${l(z(p.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${l(z(p.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${_t(p.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${je(p.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${x?`<button class="btn-secondary" data-sugerir="${l(p.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${l(x.motivo)}">Sugerir ajuste → ${l(z(x.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=s.map(p=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${l(p.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${p.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${l(z(p.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${l(z(p.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${_t(p.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${je(p.precision)}</td>
      </tr>`).join(""),d=(p,c="left")=>`<th style="padding:7px 8px;text-align:${c};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${p}</th>`;return`
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
    </div>`}function ws(t,e,a){j(t,"[data-sugerir]",o=>{const s=o.dataset.sugerir,n=Ca(e).find(p=>p.analisis.estimacionId===s);if(!(n!=null&&n.sugerencia))return;const i=n.sugerencia,d=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${z(i.cuantiaActual)}
Nueva estimación: ${z(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;tt(d)&&(e.adjuster.aplicar(s,i.cuantiaSugerida,{hoy:e.hoy()}),E(`Estimación ajustada a ${z(i.cuantiaSugerida)}`),e.onDatosCambiados(),a())}),j(t,"#ajustar-todas",()=>{const o=Ca(e).map(d=>d.sugerencia).filter(d=>d!==null);if(o.length===0)return;const s=o.map(d=>`• ${d.concepto}: ${z(d.cuantiaActual)} → ${z(d.cuantiaSugerida)}`).join(`
`);if(!tt(`Se van a ajustar ${o.length} estimaciones:

${s}

¿Continuar?`))return;const{aplicadas:n,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});E(i.length>0?`${n.length} ajustadas, ${i.length} con error`:`${n.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const Ss="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function Ms(t){const e={cuentaId:"",mes:(t.hoy??V)().slice(0,7),filtroTexto:""},a=()=>{var d;return(d=t.onDatosCambiados)==null?void 0:d.call(t)},o=t.hoy??V,s={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:a,hoy:o},n={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:a,hoy:o};function i(d){const p=t.ledger.saldoTotal(o()),c=t.ledger.ultimaFecha(),x=t.ledger.transacciones().length;d.innerHTML=`
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
          <div class="stat-value" style="font-size:1.3rem">${l(z(p))}</div>
          <div style="font-size:11px;color:var(--text3)">suma de cuentas activas</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Movimientos registrados</div>
          <div class="stat-value" style="font-size:1.3rem">${x}</div>
          <div style="font-size:11px;color:var(--text3)">${c?`último: ${l(c)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const f=d.querySelector("#acc-transacciones"),r=d.querySelector("#acc-precision");f.innerHTML=xs(s,e),r.innerHTML=As(n);const b=()=>i(d);$s(f,s,e,b),ws(r,n,b)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:Ss,mount:i}}const Cs="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function za(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function zs(t){const{store:e}=t,a=t.hoy??V,o=()=>q(a()),s=()=>e.get("config").margenesSeguridad??[];function n(b){var g;e.patchConfig({margenesSeguridad:b}),(g=t.onDatosCambiados)==null||g.call(t)}function i(b,g){const $=s().map(u=>({...u,puntos:(u.puntos??[]).map(m=>({...m}))})),A=$.find(u=>u._id===b);A&&(g(A),n($))}function d(b){const g=e.get("config"),$=ta(b,e.get("expenses"),g,e.get("loans"),a(),!1,o());return z($)}function p(b,g,$){const A=g.tipo==="fijo",u=A?"":`<span class="text-sm" style="color:var(--text3)">${l(z((g.meses??0)*$))}</span>`;return`
      <tr data-punto="${l(g._id)}" data-margen="${l(b._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${l(g.fecha)}" data-campo="fecha"/>
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
        <td style="padding:4px 6px">${u}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function c(b,g,$){const A=b.cuentas&&b.cuentas.length>0?b.cuentas.map(I=>{var y;return((y=g.find(h=>h._id===I))==null?void 0:y.nombre)??I}).join(", "):"Todas las cuentas activas",m=[...b.puntos??[]].sort((I,y)=>I.fecha.localeCompare(y.fecha)).map(I=>p(b,I,$)).join(""),v=b.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${l(A)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${l(d(b))}</strong>
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
            ${m||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${l(b._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${l(b.nombre)}</span>
            <span class="badge ${b.activo?"badge-active":"badge-inactive"}">${b.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${b.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${b.activo?"checked":""} data-toggle-margen="${l(b._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${l(b._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${l(b._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${v}
      </div>`}function x(b,g){const $=g?s().find(v=>v._id===g):null,A=e.get("accounts").filter(v=>v.activo),u=new Set(($==null?void 0:$.cuentas)??[]),m=A.map(v=>`
        <label class="tag" data-chip="${l(v._id)}" style="cursor:pointer;${u.has(v._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${l(v._id)}" ${u.has(v._id)?"checked":""} style="display:none"/>
          ${l(v.nombre)}
        </label>`).join(" ");b.innerHTML=`
      <div class="modal-title">${g?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${l(($==null?void 0:$.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${m||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${$?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${l(V())}"/></div>
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
        <button class="btn-primary" data-guardar-margen="${l(g??"")}">Guardar</button>
      </div>`}function f(b,g){const $=document.getElementById("modal-overlay"),A=document.getElementById("modal-content");!$||!A||(x(A,b),$.classList.remove("hidden"),W(A,".mg-acc-chip",u=>{const m=u,v=A.querySelector(`[data-chip="${m.value}"]`);v&&(v.style.cssText=`cursor:pointer;${m.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),W(A,"#mg-p-tipo",u=>{const m=u.value==="fijo",v=A.querySelector("#mg-p-importe-wrap"),I=A.querySelector("#mg-p-meses-wrap");v&&(v.style.display=m?"":"none"),I&&(I.style.display=m?"none":"")}),j(A,"[data-cerrar-form]",()=>$.classList.add("hidden")),j(A,"[data-guardar-margen]",u=>{var h,w,S,M,C;const m=u.getAttribute("data-guardar-margen")||"",v=((h=A.querySelector("#mg-nombre"))==null?void 0:h.value.trim())??"";if(!v)return E("El nombre es obligatorio","err");const I=[...A.querySelectorAll(".mg-acc-chip:checked")].map(P=>P.value),y=s().map(P=>({...P}));if(m){const P=y.findIndex(F=>F._id===m);if(P===-1)return E("Margen no encontrado","err");y[P]={...y[P],nombre:v,cuentas:I}}else{const P=((w=A.querySelector("#mg-p-tipo"))==null?void 0:w.value)??"fijo",F={_id:za(),fecha:((S=A.querySelector("#mg-p-fecha"))==null?void 0:S.value)||V(),tipo:P,importe:parseFloat(((M=A.querySelector("#mg-p-importe"))==null?void 0:M.value)??"0")||0,meses:parseFloat(((C=A.querySelector("#mg-p-meses"))==null?void 0:C.value)??"1")||1};y.push({_id:za(),nombre:v,activo:!0,cuentas:I,puntos:[F]})}n(y),E(m?"Margen actualizado":"Margen creado"),$.classList.add("hidden"),g()}))}function r(b){const g=s(),$=e.get("accounts"),A=Ot(e.get("expenses"),o());b.innerHTML=`
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
             </div>`:g.map(m=>c(m,$,A)).join("")}`;const u=()=>r(b);j(b,"[data-nuevo-margen]",()=>f(null,u)),j(b,"[data-editar-margen]",m=>f(m.getAttribute("data-editar-margen"),u)),j(b,"[data-borrar-margen]",m=>{tt("¿Eliminar este margen de seguridad?")&&(n(s().filter(v=>v._id!==m.getAttribute("data-borrar-margen"))),E("Margen eliminado"),u())}),W(b,"[data-toggle-margen]",m=>{const v=m.getAttribute("data-toggle-margen");i(v,I=>{I.activo=m.checked}),u()}),j(b,"[data-add-punto]",m=>{const v=m.getAttribute("data-add-punto");i(v,I=>{I.puntos=[...I.puntos??[],{_id:za(),fecha:V(),tipo:"fijo",importe:0,meses:1}]}),u()}),j(b,"[data-borrar-punto]",m=>{const v=m.closest("[data-punto]");if(!v)return;const I=v.dataset.margen,y=v.dataset.punto;i(I,h=>{h.puntos=(h.puntos??[]).filter(w=>w._id!==y)}),u()}),W(b,"[data-campo]",m=>{const v=m.closest("[data-punto]");if(!v)return;const I=m.getAttribute("data-campo"),y=m.value;i(v.dataset.margen,h=>{const w=(h.puntos??[]).find(S=>S._id===v.dataset.punto);w&&(I==="fecha"?w.fecha=y:I==="tipo"?w.tipo=y:I==="importe"?w.importe=parseFloat(y)||0:w.meses=parseFloat(y)||0)}),u()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:Cs,mount:r}}const Fs="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function Ps(t){const e=Array.isArray(t)?t[1]??[]:[];return Array.isArray(e)?e.filter(a=>a&&a.value!==null&&a.value!==void 0&&Number.isFinite(Number(a.value))).map(a=>({year:parseInt(a.date),tasa:parseFloat(Number(a.value).toFixed(2))})).filter(a=>Number.isFinite(a.year)).sort((a,o)=>a.year-o.year):[]}function Ts({fetchImpl:t,url:e=Fs}={}){let a=null,o=!1;async function s(n=!1){if(a&&!n)return a;if(o)return null;o=!0;try{const d=await(t??fetch)(e);if(!d.ok)throw new Error(`HTTP ${d.status}`);return a=Ps(await d.json()),a}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:s,invalidar:()=>{a=null},get enCache(){return a}}}const js="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function _s(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function Es(t){const{store:e}=t,a=t.ipc??Ts(),o=()=>e.get("inflacion")??[];function s(){var f;(f=t.onDatosCambiados)==null||f.call(t)}function n(f,r){if(!f||f.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const b=new Set(o().map(m=>m.year)),g=f.filter(m=>m.year>=r).reverse(),$=g.filter(m=>!b.has(m.year)).length,A=[...new Set(f.map(m=>m.year))].sort((m,v)=>m-v),u=g.map(m=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${m.year}" data-tasa="${m.tasa}" ${b.has(m.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${m.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${_s(m.tasa)}">${m.tasa.toFixed(2)}%</span>
          ${b.has(m.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${A.map(m=>`<option value="${m}"${m===r?" selected":""}>${m}</option>`).join("")}
        </select>
        <span style="font-size:10px;color:var(--text3)">
          Fuente: Banco Mundial · FP.CPI.TOTL.ZG · ${f[0].year}–${f[f.length-1].year}
        </span>
        <button class="btn-secondary btn-sm" data-ipc-recargar title="Forzar recarga desde la API">↺</button>
      </div>
      <div style="max-height:300px;overflow-y:auto;margin-bottom:12px">${u}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="font-size:12px;color:var(--text3)">${$} periodo${$!==1?"s":""} nuevo${$!==1?"s":""} disponible${$!==1?"s":""}</span>
        <div class="flex gap-8">
          <button class="btn-secondary" data-ipc-cerrar>Cancelar</button>
          <button class="btn-primary" data-ipc-importar ${$===0?"disabled":""}>↓ Importar seleccionados</button>
        </div>
      </div>`}function i(f){return!f||f.length===0?2e3:Math.max(f[0].year,new Date().getFullYear()-25)}async function d(f){const r=document.getElementById("modal-overlay"),b=document.getElementById("modal-content");if(!r||!b)return;b.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,r.classList.remove("hidden");const g=(A,u)=>{const m=document.getElementById("ipc-body");m&&(m.innerHTML=n(A,u))},$=await a.obtener();g($,i($)),j(b,"[data-ipc-cerrar]",()=>r.classList.add("hidden")),W(b,"#ipc-desde",A=>{g(a.enCache,parseInt(A.value))}),j(b,"[data-ipc-recargar]",()=>{a.invalidar();const A=document.getElementById("ipc-body");A&&(A.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),a.obtener(!0).then(u=>g(u,i(u)))}),j(b,"[data-ipc-importar]",()=>{const A=[...b.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(A.length===0)return E("Nada seleccionado","err");const u=new Set(o().map(v=>v.year));let m=0;for(const v of A){const I=parseInt(v.dataset.year??""),y=parseFloat(v.dataset.tasa??"");!Number.isFinite(I)||!Number.isFinite(y)||u.has(I)||(e.addItem("inflacion",{year:I,tasa:y}),u.add(I),m++)}r.classList.add("hidden"),E(`${m} periodo${m!==1?"s":""} importado${m!==1?"s":""} correctamente`),s(),f()})}function p(f,r){var u;const b=document.getElementById("modal-overlay"),g=document.getElementById("modal-content");if(!b||!g)return;const $=f?o().find(m=>m._id===f):null;g.innerHTML=`
      <div class="modal-title">${f?"Editar periodo de inflación":"Nuevo periodo de inflación"}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Año</label>
          <input class="form-input" type="number" id="inf-year" value="${($==null?void 0:$.year)??new Date().getFullYear()}" placeholder="2026"/></div>
        <div class="form-group"><label class="form-label">Tasa anual (%)</label>
          <input class="form-input" type="number" id="inf-tasa" step="0.01" value="${($==null?void 0:$.tasa)??""}" placeholder="3.5"/></div>
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-inf-cerrar>Cancelar</button>
        <button class="btn-primary" data-inf-guardar="${l(f??"")}">Guardar</button>
      </div>`,b.classList.remove("hidden");const A=()=>{var h;const m=parseFloat(((h=g.querySelector("#inf-tasa"))==null?void 0:h.value)??""),v=g.querySelector("#inf-preview");if(!v)return;if(!Number.isFinite(m)||m<=0){v.innerHTML="";return}const I=(Math.pow(1+m/100,1/12)-1)*100,y=Math.pow(1+m/100,5);v.innerHTML=`Con un ${m}% anual: <strong>${I.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${y.toFixed(3)}</strong> (+${((y-1)*100).toFixed(1)}%)`};(u=g.querySelector("#inf-tasa"))==null||u.addEventListener("input",A),A(),j(g,"[data-inf-cerrar]",()=>b.classList.add("hidden")),j(g,"[data-inf-guardar]",m=>{const v=m.getAttribute("data-inf-guardar")||"",I=parseInt(g.querySelector("#inf-year").value),y=parseFloat(g.querySelector("#inf-tasa").value);if(!Number.isFinite(I)||I<1900||I>2200)return E("Año inválido","err");if(!Number.isFinite(y)||y<0||y>100)return E("Tasa inválida (0–100%)","err");if(o().filter(w=>w._id!==v).some(w=>w.year===I))return E("Ya existe un periodo para ese año","err");v?(e.updateItem("inflacion",v,{year:I,tasa:y}),E("Periodo actualizado")):(e.addItem("inflacion",{year:I,tasa:y}),E("Periodo añadido")),b.classList.add("hidden"),s(),r()})}function c(f,r){const b=(Math.pow(1+f.tasa/100,.08333333333333333)-1)*100,g=`${f.year}-12-31`,$=g>r?lt([f],r,g):null;return`
      <div class="exp-table-row" data-periodo="${l(f._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${f.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${f.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${b.toFixed(3)}%/mes</div>
        <div class="num">${$!==null?`×${$.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${l(f._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${l(f._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function x(f){const r=o(),b=e.get("config").usarInflacion||!1,g=[...r].sort((h,w)=>w.year-h.year),$=V(),A=new Date().getFullYear(),u=L(new Date(A+5,0,1)),m=L(new Date(A+10,0,1)),v=b&&r.length>0?lt(r,$,u):null,I=b&&r.length>0?lt(r,$,m):null;f.innerHTML=`
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
        ${v!==null&&I!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${v.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((v-1)*100).toFixed(1)}%)</span></div>
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
        ${g.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':g.map(h=>c(h,$)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const y=()=>x(f);W(f,"[data-toggle-inflacion]",h=>{const w=h.checked;e.patchConfig({usarInflacion:w}),E(w?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),s(),y()}),j(f,"[data-nuevo-periodo]",()=>p(null,y)),j(f,"[data-editar-periodo]",h=>p(h.getAttribute("data-editar-periodo"),y)),j(f,"[data-importar-ipc]",()=>void d(y)),j(f,"[data-borrar-periodo]",h=>{tt("¿Eliminar este periodo de inflación?")&&(e.removeItem("inflacion",h.getAttribute("data-borrar-periodo")),E("Periodo eliminado"),s(),y())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:js,mount:x}}const Ds=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],Rs=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],Ns=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function qs(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Fa=(t,e)=>t.map(([a,o])=>`<option value="${l(a)}"${a===e?" selected":""}>${l(o)}</option>`).join("");function Re(t,e="dp"){const{modo:a,dia:o,nth:s,wd:n}=qs(t),i=Fa(Ds.map(d=>[d,d==="ultimo"?"Último día":d]),o);return`<div class="form-group" data-diapago="${l(e)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Fa(Rs,s)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Fa(Ns,n)}</select>
        del mes
      </span>
    </div>
  </div>`}function Ne(t){var o,s,n;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(s=e.querySelector("[data-dp-dia]"))==null||s.style.setProperty("display",a==="dia"?"":"none"),(n=e.querySelector("[data-dp-nth]"))==null||n.style.setProperty("display",a==="nthweekday"?"":"none")}function qe(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=s=>{var n;return((n=e.querySelector(s))==null?void 0:n.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const Ls="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",ks=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Os(t){const e=t.hoy??V,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var u;return(u=t.onDatosCambiados)==null?void 0:u.call(t)},s=()=>t.store.get("accounts"),n=u=>{var m;return((m=s().find(v=>v._id===(u||"default")))==null?void 0:m.nombre)??(u||"default")};function i(){const u=e();let m=[...t.store.get("expenses")];if(a.mostrarExpirados||(m=m.filter(v=>!v.fechaFin||v.fechaFin>=u)),a.tipo&&(m=m.filter(v=>v.tipo===a.tipo)),a.cuenta&&(m=m.filter(v=>(v.cuenta||"default")===a.cuenta)),a.desde&&(m=m.filter(v=>(v.fechaInicio??"")>=a.desde)),a.hasta&&(m=m.filter(v=>(v.fechaInicio??"")<=a.hasta)),a.busqueda){const v=a.busqueda.toLowerCase();m=m.filter(I=>I.concepto.toLowerCase().includes(v))}return a.tags.size>0&&(m=m.filter(v=>(v.tags||[]).some(I=>a.tags.has(I)))),m.sort((v,I)=>{const y=v[a.orden]??"",h=I[a.orden]??"";return typeof y=="number"&&typeof h=="number"?(y-h)*a.sentido:String(y).localeCompare(String(h))*a.sentido})}function d(){return[...new Set(t.store.get("expenses").flatMap(u=>u.tags||[]))].filter(Boolean).sort()}function p(u,m){const v=a.orden===u?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${u}">${l(m)} <span class="sort-arrow">${v}</span></span>`}function c(u,m=!1){return(m?'<option value="">Todas las cuentas</option>':"")+s().filter(I=>I.activo!==!1).map(I=>`<option value="${l(I._id)}"${I._id===u?" selected":""}>${l(I.nombre)}</option>`).join("")}function x(u){const m=u.tipo==="transferencia",v=ia(u.diaPago??""),I=u.tipoFrecuencia==="extraordinario"?"Único":`Cada ${u.frecuencia??1} ${u.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${v?` · ${v}`:""}`,y=!!u.fechaFin&&u.fechaFin<e(),h=m?'<span class="badge badge-purple">⇄ transf.</span>':u.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',w=m?`${l(n(u.cuenta))} → ${l(n(u.cuentaDestino))}`:l(n(u.cuenta)),S=(u.tags||[]).map(M=>`<span class="tag${a.tags.has(M)?" active":""}" data-tag="${l(M)}" title="Filtrar por ${l(M)}">${l(M)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${l(u.concepto)}</div>
        <div class="tag-list mt-4">${S}</div>
      </div>
      <div>${h}</div>
      <div class="num ${u.tipo==="ingreso"?"pos":m?"":"neg"}">${m?"⇄ ":""}${l(z(u.cuantia))}</div>
      <div class="text-sm">${l(I)}</div>
      <div class="text-sm exp-col-hide">${w}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${l(u._id)}"${u.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${u.tipo==="gasto"&&u.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffd166" title="Gasto clasificado como deseo">deseo</span>':""}
        ${u.tipo==="gasto"&&u.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${u.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${u.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${l(u.ajustadaEn??"")}">ajustada</span>`:""}
        ${y?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${l(u._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${l(u._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${l(u._id)}">✕</button>
      </div>
    </div>`}function f(u){const m=i(),v=d();u.innerHTML=`
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
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${l(a.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${a.tipo==="gasto"?" selected":""}>Gastos</option>
          <option value="ingreso"${a.tipo==="ingreso"?" selected":""}>Ingresos</option>
          <option value="transferencia"${a.tipo==="transferencia"?" selected":""}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${c(a.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${l(a.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${l(a.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${v.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${v.map(I=>`<span class="tag${a.tags.has(I)?" active":""}" data-tag="${l(I)}">${l(I)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${p("concepto","Concepto")} ${p("tipo","Tipo")} ${p("cuantia","Cuantía")} ${p("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${m.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':m.map(x).join("")}
      </div>`}function r(u){const m=(u==null?void 0:u.tipo)==="transferencia",v=t.store.get("escenarios"),I=(u==null?void 0:u.escenarioIds)||[],y=(h,w,S,M,C="")=>`<div class="form-group"><label class="form-label">${l(w)}</label>
       <input class="form-input" type="${S}" id="${h}" value="${l(M)}" placeholder="${l(C)}"/></div>`;return`
      <div class="grid-2">
        ${y("ef-concepto","Concepto","text",(u==null?void 0:u.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(u==null?void 0:u.tipo)==="gasto"||!(u!=null&&u.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(u==null?void 0:u.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${m?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${y("ef-cuantia","Cuantía (€)","number",(u==null?void 0:u.cuantia)??"","500")}
        ${y("ef-frecuencia","Frecuencia","number",(u==null?void 0:u.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${ks.map(([h,w])=>`<option value="${h}"${((u==null?void 0:u.tipoFrecuencia)??"mensual")===h?" selected":""}>${l(w)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${y("ef-fecha-ini","Fecha inicio","date",(u==null?void 0:u.fechaInicio)??e())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${c((u==null?void 0:u.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${m?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${c((u==null?void 0:u.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(u==null?void 0:u.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${u!=null&&u._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${y("ef-fecha-fin","Fecha fin (opcional)","date",(u==null?void 0:u.fechaFin)??"")}</div>
          <div class="mt-8">${Re(u==null?void 0:u.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${m?' style="display:none"':""}>
            <div class="mt-8" id="ef-clasificacion-wrap"${(u==null?void 0:u.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${((u==null?void 0:u.clasificacion)??"necesidad")==="necesidad"?" selected":""}>Necesidad</option>
                  <option value="deseo"${(u==null?void 0:u.clasificacion)==="deseo"?" selected":""}>Deseo</option>
                  <option value=""${(u==null?void 0:u.clasificacion)===null?" selected":""}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label>
              <input class="form-input" type="text" id="ef-tags" value="${l(((u==null?void 0:u.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
            <div class="form-row mt-8">
              <label class="form-label">Gasto básico</label>
              <label class="toggle"><input type="checkbox" id="ef-basico"${u!=null&&u.basico?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Incluir en el cálculo del colchón económico</span>
            </div>
            <div class="form-row mt-8" id="ef-irpf-wrap"${(u==null?void 0:u.tipo)==="ingreso"?"":' style="display:none"'}>
              <label class="form-label">Sujeto a retención IRPF</label>
              <label class="toggle"><input type="checkbox" id="ef-sujetoIRPF"${u!=null&&u.sujetoIRPF?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Calcula y proyecta la retención mensual</span>
            </div>
          </div>
          ${v.length>0?`<div class="form-group mt-8"><label class="form-label">Escenarios</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${v.map(h=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${I.includes(h._id)?l(h.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${l(h._id)}"${I.includes(h._id)?" checked":""}/>
                          ${l(h.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${l((u==null?void 0:u._id)??"")}">Guardar</button>
      </div>`}function b(u){var I;const m=((I=u.querySelector("#ef-tipo"))==null?void 0:I.value)??"gasto",v=(y,h)=>{const w=u.querySelector(y);w&&(w.style.display=h?"":"none")};v("#ef-destino-wrap",m==="transferencia"),v("#ef-basico-wrap",m!=="transferencia"),v("#ef-irpf-wrap",m==="ingreso"),v("#ef-clasificacion-wrap",m==="gasto")}function g(u,m,v){const I=document.getElementById("modal-overlay"),y=document.getElementById("modal-content");!I||!y||(y.innerHTML=`<div class="modal-title">${l(m)}</div>${r(u)}`,I.classList.remove("hidden"),W(y,"#ef-tipo",()=>b(y)),W(y,"[data-dp-modo]",()=>Ne(y)),j(y,"[data-cancelar]",()=>I.classList.add("hidden")),j(y,"[data-guardar]",h=>{$(y,h.getAttribute("data-guardar")||"")&&(I.classList.add("hidden"),v())}))}function $(u,m){const v=P=>{var F;return((F=u.querySelector(P))==null?void 0:F.value)??""},I=P=>{var F;return!!((F=u.querySelector(P))!=null&&F.checked)},y=v("#ef-tipo")||"gasto",h=y==="transferencia",w=v("#ef-concepto").trim(),S=parseFloat(v("#ef-cuantia"));if(!w||!Number.isFinite(S))return E("Concepto y cuantía obligatorios","err"),!1;const M=v("#ef-clasificacion"),C={concepto:w,tipo:y,cuantia:S,frecuencia:parseInt(v("#ef-frecuencia"),10)||1,tipoFrecuencia:v("#ef-tipo-frec")||"mensual",fechaInicio:v("#ef-fecha-ini"),fechaFin:v("#ef-fecha-fin")||null,diaPago:qe(u),cuenta:v("#ef-cuenta"),cuentaDestino:h?v("#ef-cuenta-dest")||"default":void 0,activo:I("#ef-activo"),basico:!h&&I("#ef-basico"),sujetoIRPF:!h&&I("#ef-sujetoIRPF"),clasificacion:y==="gasto"?M||null:void 0,tags:h?["transferencia"]:v("#ef-tags").split(",").map(P=>P.trim()).filter(Boolean),escenarioIds:[...u.querySelectorAll(".ef-escenario:checked")].map(P=>P.value)};return m?(t.store.updateItem("expenses",m,C),E("Actualizado")):(t.store.addItem("expenses",C),E("Creado")),o(),!0}function A(u,m){const v=u.querySelector("[data-busqueda]");let I;v==null||v.addEventListener("input",()=>{clearTimeout(I),I=setTimeout(()=>{a.busqueda=v.value,m();const y=u.querySelector("[data-busqueda]");y==null||y.focus(),y==null||y.setSelectionRange(y.value.length,y.value.length)},250)}),W(u,"[data-expirados]",y=>{a.mostrarExpirados=y.checked,m()}),W(u,"[data-f-tipo]",y=>{a.tipo=y.value,m()}),W(u,"[data-f-cuenta]",y=>{a.cuenta=y.value,m()}),W(u,"[data-f-desde]",y=>{a.desde=y.value,m()}),W(u,"[data-f-hasta]",y=>{a.hasta=y.value,m()}),j(u,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,m()}),j(u,"[data-limpiar-tags]",()=>{a.tags=new Set,m()}),j(u,"[data-tag]",y=>{const h=y.getAttribute("data-tag");a.tags.has(h)?a.tags.delete(h):a.tags.add(h),m()}),j(u,"[data-orden]",y=>{const h=y.getAttribute("data-orden");a.orden===h?a.sentido=a.sentido===1?-1:1:(a.orden=h,a.sentido=1),m()}),j(u,"[data-nuevo]",()=>g(null,"Nuevo gasto/ingreso",m)),j(u,"[data-editar]",y=>{const h=t.store.get("expenses").find(w=>w._id===y.getAttribute("data-editar"));h&&g(h,"Editar",m)}),j(u,"[data-duplicar]",y=>{const h=t.store.get("expenses").find(M=>M._id===y.getAttribute("data-duplicar"));if(!h)return;const{_id:w,...S}=h;g({...S,concepto:`${h.concepto} (copia)`},"Duplicar movimiento",m)}),j(u,"[data-borrar]",y=>{tt("¿Eliminar?")&&(t.store.removeItem("expenses",y.getAttribute("data-borrar")),E("Eliminado"),o(),m())}),W(u,"[data-activo]",y=>{const h=y;t.store.updateItem("expenses",h.getAttribute("data-activo"),{activo:h.checked}),o(),m()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:Ls,mount(u){const m=()=>f(u);f(u),u.dataset.wired!=="1"&&(A(u,m),u.dataset.wired="1")}}}function ea(t,e,a){return t.reduce((o,s)=>{if(s.esAmortizacion)return o;const n=lt(e,a,s.fecha);return o+(n>0?s.interes/n:s.interes)},0)}function Le(t,e,a,o){return t.reduce((s,n)=>{const i=lt(e,a,n.fecha),d=n.esAmortizacion?n.amortizacion+n.comisionAmort:n.cuota;return s+(i>0?d/i:d)},0)+o}function Bs(t,e,a){const o=t.amortizaciones||[];return o.map((s,n)=>{const i=Z({...t,amortizaciones:o.slice(0,n)}),d=Z({...t,amortizaciones:o.slice(0,n+1)});return{nominal:i.totalIntereses-d.totalIntereses,real:ea(i.tabla,e,a)-ea(d.tabla,e,a)}})}const Pa=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${l(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function Hs(t,e){const a=Ba(t),o=(t.amortizaciones||[]).length>0,s=e.periodos.length>0,n=e.usarInflacion&&s,i=s?Ha(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,d=s?Ga(t.tin||0,i):null,p=o&&s?Bs(t,e.periodos,e.hoy):[],c=p.length?ea(a.sinAmort.tabla,e.periodos,e.hoy)-ea(a.tabla,e.periodos,e.hoy):null,x=c===null?null:c-a.costeTotalAmort,f=n?Le(a.tabla,e.periodos,e.hoy,a.comAp):null,r=n&&o?Le(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${l(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${l(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(0,229,160,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(t.tags||[]).map(b=>`<span class="tag">${l(b)}</span>`).join("")}
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
        ${Pa("Cuota mensual",l(z(a.cuota)),e.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${l(z(e.cuotaMes))}</div>`:"")}
        ${Pa("Total intereses",l(z(a.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${l(z(a.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${l(a.fechaFin||"—")}</div>
          ${o&&a.fechaFin!==a.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${l(a.sinAmort.fechaFin||"—")}${a.ahorroTiempo>0?` (−${a.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Pa("Total pagado",l(z(a.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${l(z(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${l(qa(a.tae))}</div></div>
          <div><div class="stat-label">TIN</div><div class="stat-value">${l(t.tin)}%</div></div>
          ${d!==null?`<div title="Tipo de interés real (Fisher): TIN ajustado por la inflación media del ${i.toFixed(2)}% anual durante el préstamo">
                   <div class="stat-label">TIN real</div>
                   <div class="stat-value" style="color:${d<=0?"var(--accent)":d<t.tin?"var(--yellow)":"var(--text)"}">${d.toFixed(2)}%
                     <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${i.toFixed(1)}%)</span>
                   </div>
                 </div>`:""}
          <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${l(t.meses)} meses</div></div>
        </div>
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">Capital</div><div class="stat-value">${l(z(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${l(z(a.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${l(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${l(ia(t.diaPago))}</div></div>`:""}
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
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${l(z(a.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${l(z(c))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${l(z(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${l(z(a.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(x??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${l(z(x??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${l(z(a.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${l(z(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${l(z(a.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${f!==null?Gs(t,a.totalPagado,f,r):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${n?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(b=>Vs(b,n,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((b,g)=>Us(t._id,b,p[g]??null,e)).join("")}`:""}
    </div>
  </div>`}function Gs(t,e,a,o){const s=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const d=o-a,p=d>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${l(z(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${l(z(a))}</div></div>
        <div><div class="stat-label">${p?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${p?"pos":"neg"}">${p?"−":"+"}${l(z(Math.abs(d)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${s}
    </div>`}const n=e-a,i=n>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${l(z(e))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${l(z(a))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${l(z(Math.abs(n)))}</div></div>
    </div>
    ${s}
  </div>`}function Vs(t,e,a){let o="";if(e&&!t.esAmortizacion){const s=lt(a.periodos,a.hoy,t.fecha);o=l(z(s>0?t.cuota/s:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":l(t.mes)}</td>
    <td class="num">${l(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":l(z(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${l(z(t.interes))}</td>
    <td class="num">${l(z(t.amortizacion))}</td>
    <td class="num">${l(z(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Us(t,e,a,o){const s=(e.escenarioIds||[]).map(n=>`<span class="badge badge-yellow">🔭 ${l(o.nombreEscenario(n))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${l(e.fecha)}</span>
    <span class="num">${l(z(e.cantidad))}</span>
    <span class="badge ${e.simulacion?"badge-sim":"badge-active"}">${e.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${e.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${s}
    ${a?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${l(z(a.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${l(z(a.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${l(t)}|${l(e._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${l(t)}|${l(e._id)}">✕</button>
  </div>`}const K=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${l(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${l(o)}" placeholder="${l(s)}"/></div>`,Et=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${l(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([s,n])=>`<option value="${l(s)}"${s===o?" selected":""}>${l(n)}</option>`).join("")}
   </select></div>`,Yt=(t,e,a,o="")=>`<label class="form-label">${l(e)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${a?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${l(o)}</span>`:""}`;function Wt(t,e,a){return t.length===0?"":`<div class="form-group mt-8"><label class="form-label">Escenarios</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${t.map(o=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${e.includes(o._id)?l(o.color||"var(--accent)"):"var(--border)"}">
            <input type="checkbox" class="${l(a)}" value="${l(o._id)}"${e.includes(o._id)?" checked":""}/>
            ${l(o.nombre)}
          </label>`).join("")}
    </div></div>`}const Ys=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${l(a._id)}"${a._id===e?" selected":""}>${l(a.nombre)}</option>`).join("");function Ws(t,e,a,o=V()){return`
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
            <select class="form-select" id="f-cuenta">${Ys(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${Re(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Et("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${K("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${K("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${l(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${Yt("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${Wt(a,(t==null?void 0:t.escenarioIds)??[],"loan-escenario")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${Yt("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${Yt("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${Yt("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${l((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Js(t,e,a,o=V()){return`
    <div class="grid-2">
      ${K("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??o)}
      ${K("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Et("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(e==null?void 0:e.tipo)??"cuota")}
    </div>
    ${Wt(a,(e==null?void 0:e.escenarioIds)??[],"amort-escenario")}
    <div class="form-row mt-8">
      ${Yt("am-sim","Simulación",!!(e!=null&&e.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${l(t)}|${l((e==null?void 0:e._id)??"")}">${e?"Guardar cambios":"Añadir"}</button>
    </div>`}const ke="opt_",Oe=t=>String(t).startsWith(ke);function Ks(t){let e=null,a=null;const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content");function n(v,I){const y=o(),h=s();return!y||!h?null:(h.innerHTML=`<div class="modal-title">${l(v)}</div>${I}`,y.classList.remove("hidden"),h)}const i=()=>{var v;return(v=o())==null?void 0:v.classList.add("hidden")};function d(){let v=!1;for(const I of t.loans()){const y=(I.amortizaciones||[]).filter(h=>!Oe(h._id));y.length!==(I.amortizaciones||[]).length&&(t.guardarAmortizaciones(I._id,y),v=!0)}return v}function p(v){try{return v()}catch(I){return E(I instanceof Error?I.message:"No se ha podido completar el cálculo","err"),null}}function c(){var M,C;if(!fe("optimizador")){E("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const v=t.loans().filter(P=>P.activo&&!P.simulacion);if(v.length===0){E("No hay préstamos activos para optimizar","err");return}const I=t.config(),y=t.accounts().filter(P=>P.activo&&!P.simulacion),h=((M=y.find(P=>P.esCuentaPrincipal))==null?void 0:M._id)??((C=y[0])==null?void 0:C._id)??"",w=I.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,S=n("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${y.map(P=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${l(P._id)}"${P._id===h?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${l(P.nombre)}${P._id===h?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${l(z(it(P)))}</span>
              </label>`).join("")||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${v.map(P=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
              <input type="checkbox" class="opt-loan-check" value="${l(P._id)}"${P.tin>=5?" checked":""} style="accent-color:var(--accent)"/>
              <span style="font-size:13px;flex:1">${l(P.nombre)}</span>
              <span class="badge badge-yellow" style="font-size:11px">${l(P.tin)}% TIN</span>
            </label>`).join("")}
      </div>
      <button class="btn-secondary btn-sm mb-12" data-opt-todos>Seleccionar todo</button>

      <div class="grid-2" style="gap:10px">
        ${K("opt-horizonte","Horizonte (meses)","number",60,"60")}
        ${K("opt-frecuencia","Frecuencia manual (cada N meses)","number",1,"1")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${K("opt-min","Importe mínimo por amortización (€)","number",500,"500")}
        ${Et("opt-tipo","Efecto de la amortización",[["plazo","Reducir plazo (mantener cuota)"],["cuota","Reducir cuota (mantener plazo)"]],"plazo")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${K("opt-fecha-primera","Fecha primera amortización","date","")}
        ${K("opt-fecha-obj","Fecha objetivo para comparar saldo","date",w)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);S&&(x(S),W(S,".opt-acc-radio",()=>x(S)),j(S,"[data-opt-todos]",()=>{const P=[...S.querySelectorAll(".opt-loan-check")],F=P.every(T=>T.checked);P.forEach(T=>T.checked=!F)}),j(S,"[data-cancelar]",i),j(S,"[data-opt-calcular]",()=>g(S)),j(S,"[data-opt-comparar]",()=>$(S)))}function x(v){var S;const I=(S=v.querySelector(".opt-acc-radio:checked"))==null?void 0:S.value,h=(t.config().margenesSeguridad||[]).filter(M=>M.activo!==!1).filter(M=>!M.cuentas||M.cuentas.length===0||I&&M.cuentas.includes(I)),w=v.querySelector("#opt-margenes-wrap");w&&(w.innerHTML=h.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':h.map(M=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${l(M._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${l(M.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!M.cuentas||M.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function f(v){var w,S,M,C;const I=(P,F,T=0)=>{var R;const _=parseFloat(((R=v.querySelector(P))==null?void 0:R.value)??"");return Number.isFinite(_)?Math.max(T,_):F},y=[...v.querySelectorAll(".opt-loan-check")],h=y.filter(P=>P.checked).map(P=>P.value);return{horizonte:Math.round(I("#opt-horizonte",60,1)),frecuencia:Math.round(I("#opt-frecuencia",1,1)),minAmortizable:I("#opt-min",500),tipoAmort:((w=v.querySelector("#opt-tipo"))==null?void 0:w.value)||"plazo",fechaObjetivo:((S=v.querySelector("#opt-fecha-obj"))==null?void 0:S.value)||null,fechaPrimeraAmort:((M=v.querySelector("#opt-fecha-primera"))==null?void 0:M.value)||null,loanIds:y.length===0||h.length===y.length?null:h,sourceAccountId:((C=v.querySelector(".opt-acc-radio:checked"))==null?void 0:C.value)??null,selectedMarginIds:[...v.querySelectorAll(".opt-margin-check:checked")].map(P=>P.value)}}const r=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function b(v,I=""){const y=n("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${l(v)}</div>
        ${I?`<div class="text-sm mt-8" style="color:var(--text3)">${l(I)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);y&&(j(y,"[data-opt-volver]",c),j(y,"[data-cancelar]",i))}function g(v){const I=f(v);d()&&E("Plan anterior eliminado, recalculando…");const{loans:y,expenses:h,accounts:w,config:S,nominas:M}=r(),C=p(()=>ya(y,h,w,S,{frecuencia:I.frecuencia,mesesHorizonte:I.horizonte,minAmortizable:I.minAmortizable,tipoAmort:I.tipoAmort,fechaPrimeraAmort:I.fechaPrimeraAmort,loanIds:I.loanIds,nominas:M,sourceAccountId:I.sourceAccountId,selectedMarginIds:I.selectedMarginIds}));if(!C)return;if(C.plan.length===0){b(`No hay excedente suficiente respetando los ${C.margenesAplicados} márgenes de seguridad activos en los próximos ${I.horizonte} meses para generar amortizaciones por encima del mínimo de ${z(I.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}a={plan:C.plan,tipoAmort:I.tipoAmort};const P=`✨ Plan de optimización · ${I.frecuencia===1?"Mensual":`Cada ${I.frecuencia} meses`} · ${I.horizonte}m`,F=n(P,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${l(z(C.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${l(z(C.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${l(z(C.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${C.margenesAplicados}</div></div>
      </div>
      ${C.resumenPorLoan.map(He).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${C.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${C.plan.map(T=>Be(T,!0)).join("")}</tbody>
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
      </div>`);F&&(j(F,"[data-opt-volver]",c),j(F,"[data-cancelar]",i),j(F,"[data-opt-aplicar]",()=>{a&&u(a.plan,a.tipoAmort)}))}function $(v){const I=f(v);d();const{loans:y,expenses:h,accounts:w,config:S,nominas:M}=r(),C=p(()=>be(y,h,w,S,{horizonte:I.horizonte,minAmortizable:I.minAmortizable,tipoAmort:I.tipoAmort,fechaObjetivo:I.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:I.fechaPrimeraAmort,loanIds:I.loanIds,nominas:M,sourceAccountId:I.sourceAccountId,selectedMarginIds:I.selectedMarginIds}));if(!C)return;if(C.resultados.length===0){b("No hay excedente suficiente en ninguna frecuencia.");return}e=C;const{resultados:P,saldoBase:F,fechaObjetivo:T}=C,_=P.map(N=>{const B=[N.esMejorIntereses&&"💰 +intereses",N.esMejorSaldo&&"🏦 +saldo",N.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${N.esMejorValor?"background:rgba(0,229,160,0.06);":""}">
          <td style="font-weight:600">${l(N.label)}</td>
          <td class="num">${N.numAmortizaciones}</td>
          <td class="num neg">${l(z(N.totalAmortizado))}</td>
          <td class="num pos">${l(z(N.ahorroIntereses))}</td>
          <td class="num ${N.saldoObjetivo>=F?"pos":"neg"}">${l(z(N.saldoObjetivo))}</td>
          <td class="num pos">${l(z(N.valorTotal))}</td>
          <td style="font-size:11px">${B}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${N.frecuencia}">Usar</button></td>
        </tr>`}).join(""),R=n(`📊 Comparativa de frecuencias · hasta ${T}`,`
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${l(T)}: <strong>${l(z(F))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${l(T.slice(0,7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${_}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);R&&(j(R,"[data-opt-volver]",c),j(R,"[data-cancelar]",i),j(R,"[data-opt-usar]",N=>A(Number(N.getAttribute("data-opt-usar")))))}function A(v){var y;const I=e==null?void 0:e.resultados.find(h=>h.frecuencia===v);I&&(d(),u(I.plan,((y=I.plan[0])==null?void 0:y.tipoAmort)||"plazo",{titulo:`✨ Plan ${I.label} · aplicado`,resumen:I,fechaObjetivo:e==null?void 0:e.fechaObjetivo}))}function u(v,I,y){if(v.length===0)return;const h=new Map;for(const S of v){const M=h.get(S.loanId)??[];M.push({_id:`${ke}${S.mes}_${S.loanId}`,fecha:S.fechaAmort,cantidad:S.cantidadAmort,tipo:I,simulacion:!0}),h.set(S.loanId,M)}let w=0;for(const S of t.loans()){const M=h.get(S._id);if(!M)continue;const C=(S.amortizaciones||[]).filter(P=>!Oe(P._id));t.guardarAmortizaciones(S._id,[...C,...M]),w+=1}E(`Plan aplicado: ${v.length} amortizaciones en ${w} préstamo${w!==1?"s":""} (simulación)`),y?m(y):i(),t.refrescar([...h.keys()])}function m({titulo:v,resumen:I,fechaObjetivo:y}){const h=n(v,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${l(z(I.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${l(z(I.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${l((y==null?void 0:y.slice(0,7))??"")}</div><div class="stat-value pos">${l(z(I.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${l(z(I.totalComisiones))}</div></div>
      </div>
      ${I.resumenPorLoan.map(He).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${I.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${I.plan.map(w=>Be(w,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);h&&j(h,"[data-cancelar]",i)}return{abrir:c,get planManual(){return a},get comparativa(){return e}}}function Be(t,e){const a=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${l(z(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${l(t.mes)}</td>
    <td>${l(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${l(z(t.capitalAntes))}</td>
    <td class="num neg">${l(z(t.cantidadAmort))}${a}</td>
    <td class="num">${l(z(t.capitalDespues))}</td>
    ${e?`<td class="num" style="color:var(--text3)">${l(z(t.saldoDisponible))} → ${l(z(t.saldoDespues))}</td>`:""}
  </tr>`}function He(t){return`<div class="card mb-8" style="padding:12px">
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
  </div>`}const Xs="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Qs(t){const e=t.hoy??V;let a=!1;const o=new Set;let s=null;const n=()=>{var y;return(y=t.onDatosCambiados)==null?void 0:y.call(t)},i=()=>t.store.get("escenarios"),d=y=>{var h;return((h=i().find(w=>w._id===y))==null?void 0:h.nombre)??y};function p(y){if(!y.activo||y.simulacion)return!1;const h=Z(y).tabla.filter(w=>!w.esAmortizacion);return h.length===0?!0:h[h.length-1].fecha<e()}function c(y,h){const w=e(),S=w.slice(0,7),M=new Map;let C=0;for(const P of y){if(!P.activo||P.simulacion||h.has(P._id)||(P.fechaInicio||"")>w)continue;const F=Z(P).tabla.filter(_=>!_.esAmortizacion&&_.fecha.startsWith(S)),T=F.length>0?F[0].cuota:0;M.set(P._id,T),C+=T}return{porLoan:M,total:C,activos:[...M.values()].filter(P=>P>0).length}}function x(y){const h=t.store.get("config"),w=h.dashboardStart,S=h.dashboardEnd,M=Math.max(1,(q(S).getTime()-q(w).getTime())/(30.44*864e5));let C=0;for(const P of y)!P.activo||P.simulacion||(C+=Z(P).tabla.filter(F=>!F.esAmortizacion&&F.fecha>=w&&F.fecha<=S).reduce((F,T)=>F+T.cuota,0));return{media:C/M,desde:w,hasta:S}}function f(y){const h=[...t.store.get("loans")].sort((_,R)=>R.tin-_.tin),w=new Set(h.filter(p).map(_=>_._id)),S=a?h:h.filter(_=>!w.has(_._id)),M=c(h,w),C=x(h),P=t.store.get("config"),F=t.store.get("inflacion"),T=new Date(q(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});y.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${w.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${w.size})</button>`:""}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${M.total>0||C.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${M.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${l(T)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${l(z(M.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${M.activos} préstamo${M.activos!==1?"s":""} activo${M.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${C.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${l(z(C.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${l(C.desde)} → ${l(C.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${S.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':S.map(_=>Hs(_,{periodos:F,usarInflacion:!!P.usarInflacion,hoy:e(),cuotaMes:M.porLoan.get(_._id)??0,completado:w.has(_._id),nombreEscenario:d})).join("")}
      </div>`;for(const _ of y.querySelectorAll("[data-body-loan]"))o.has(_.dataset.bodyLoan??"")&&_.classList.add("open")}const r=()=>document.getElementById("modal-overlay"),b=()=>document.getElementById("modal-content"),g=()=>{var y;return(y=r())==null?void 0:y.classList.add("hidden")};function $(y,h){const w=r(),S=b();return!w||!S?null:(S.innerHTML=`<div class="modal-title">${l(y)}</div>${h}`,w.classList.remove("hidden"),j(S,"[data-cancelar]",g),S)}function A(y,h){const w=y?t.store.get("loans").find(M=>M._id===y)??null:null,S=$(y?"Editar préstamo":"Nuevo préstamo",Ws(w,t.store.get("accounts"),i(),e()));S&&(S.addEventListener("change",M=>{var C;(C=M.target)!=null&&C.matches("[data-dp-modo]")&&Ne(S)}),j(S,"[data-guardar-loan]",M=>{u(S,M.getAttribute("data-guardar-loan")||"")&&(g(),h())}))}function u(y,h){const w=_=>{var R;return((R=y.querySelector(_))==null?void 0:R.value)??""},S=_=>{var R;return!!((R=y.querySelector(_))!=null&&R.checked)},M=w("#f-nombre").trim(),C=parseFloat(w("#f-capital")),P=parseFloat(w("#f-tin")),F=parseInt(w("#f-meses"),10);if(!M||!Number.isFinite(C)||!Number.isFinite(P)||!Number.isFinite(F))return E("Completa los campos obligatorios","err"),!1;const T={nombre:M,capital:C,tin:P,meses:F,fechaInicio:w("#f-fecha"),comisionApertura:parseFloat(w("#f-com-ap"))||0,comisionAmort:parseFloat(w("#f-com-am"))||0,diaPago:qe(y),cuenta:w("#f-cuenta"),simulacion:S("#f-sim"),activo:S("#f-activo"),mostrarFechaFinEnDashboard:S("#f-mostrar-fin"),tipoTasa:w("#f-tipo-tasa"),basico:S("#f-basico"),tags:w("#f-tags").split(",").map(_=>_.trim()).filter(Boolean),escenarioIds:[...y.querySelectorAll(".loan-escenario:checked")].map(_=>_.value)};return h?(t.store.updateItem("loans",h,T),E("Préstamo actualizado")):(t.store.addItem("loans",{...T,amortizaciones:[]}),E("Préstamo creado")),n(),!0}function m(y,h,w){const S=t.store.get("loans").find(P=>P._id===y);if(!S)return;const M=h?(S.amortizaciones||[]).find(P=>P._id===h)??null:null,C=$(h?"Editar amortización":"Añadir amortización",Js(y,M,i(),e()));C&&j(C,"[data-guardar-amort]",P=>{const[F,T]=(P.getAttribute("data-guardar-amort")||"").split("|");v(C,F,T)&&(g(),w([F]))})}function v(y,h,w){var R;const S=N=>{var B;return((B=y.querySelector(N))==null?void 0:B.value)??""},M=S("#am-fecha"),C=parseFloat(S("#am-cant"));if(!M||!Number.isFinite(C)||C<=0)return E("Fecha y cantidad requeridas","err"),!1;const P=t.store.get("loans").find(N=>N._id===h);if(!P)return!1;const F={fecha:M,cantidad:C,tipo:S("#am-tipo"),simulacion:!!((R=y.querySelector("#am-sim"))!=null&&R.checked),escenarioIds:[...y.querySelectorAll(".amort-escenario:checked")].map(N=>N.value)},T=P.amortizaciones||[],_=w?T.map(N=>N._id===w?{...N,...F}:N):[...T,{_id:Date.now().toString(36),...F}];return t.store.updateItem("loans",h,{amortizaciones:_}),E(w?"Amortización actualizada":"Amortización añadida"),n(),!0}function I(y,h,w){j(y,"[data-toggle-finalizados]",()=>{a=!a,h()}),j(y,"[data-nuevo-loan]",()=>A(null,h)),j(y,"[data-optimizar]",()=>w.abrir()),j(y,"[data-toggle-loan]",(S,M)=>{var T;if((T=M.target)!=null&&T.closest("button"))return;const C=S.getAttribute("data-toggle-loan"),P=[...y.querySelectorAll("[data-body-loan]")].find(_=>_.dataset.bodyLoan===C);(P==null?void 0:P.classList.toggle("open"))?o.add(C):o.delete(C)}),j(y,"[data-editar-loan]",S=>A(S.getAttribute("data-editar-loan"),h)),j(y,"[data-borrar-loan]",S=>{if(!tt("¿Eliminar préstamo?"))return;const M=S.getAttribute("data-borrar-loan");t.store.removeItem("loans",M),o.delete(M),E("Eliminado"),n(),h()}),j(y,"[data-amort-loan]",S=>{const M=S.getAttribute("data-amort-loan");o.add(M),m(M,null,h)}),j(y,"[data-editar-amort]",S=>{const[M,C]=(S.getAttribute("data-editar-amort")||"").split("|");o.add(M),m(M,C,h)}),j(y,"[data-borrar-amort]",S=>{const[M,C]=(S.getAttribute("data-borrar-amort")||"").split("|"),P=t.store.get("loans").find(F=>F._id===M);P&&(t.store.updateItem("loans",M,{amortizaciones:(P.amortizaciones||[]).filter(F=>F._id!==C)}),E("Amortización eliminada"),n(),h([M]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Xs,mount(y){const h=(w=[])=>{for(const S of w)o.add(S);f(y)};s??(s=Ks({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(w,S)=>{t.store.updateItem("loans",w,{amortizaciones:S}),n()},hoy:e,refrescar:h})),f(y),y.dataset.wired!=="1"&&(I(y,h,s),y.dataset.wired="1")}}}const Zs={transporte:125,restaurante:220,otros:null},tn={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},an=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Dt=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${l(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${l(o)}" placeholder="${l(s)}"/></div>`,en=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${l(a._id)}"${a._id===e?" selected":""}>${l(a.nombre)}</option>`).join("");function on(t,e){const a=t.map((n,i)=>{const d=e.find(x=>x._id===n.cuenta),p=Zs[n.tipo],c=p!=null&&n.importe>p;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${l(tn[n.tipo]??n.tipo)}</span>
        <span style="flex:1;font-size:12px">${l(z(n.importe))}/mes${c?` <span style="color:var(--red)" title="Supera el límite orientativo de ${l(z(p))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${d?l(d.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
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
        ${o.map(n=>`<option value="${l(n._id)}">${l(n.nombre)}${(n.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${s.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function sn(t,e){const a=e.hoy??V(),o=(t==null?void 0:t.nPagas)??12,s=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Dt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Dt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(n=>`<option value="${n}"${s&&o===n?" selected":""}>${n} pagas</option>`).join("")}
          <option value="custom"${s?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${en(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Dt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??a)}
          ${Dt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Dt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${an.map((n,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${l(n)} (${i+1})</option>`).join("")}
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
          ${Dt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??fa).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${Wt(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"nom-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${l((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Ge(t,e){const a=i=>{var d;return((d=t.querySelector(i))==null?void 0:d.value)??""},o=(i,d=0)=>{const p=parseFloat(a(i));return Number.isFinite(p)?p:d},s=a("#nf-npagas"),n=s==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(s,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:n,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",fa),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:e}}function nn(t,e,a,o){const s=Ge(t,e),n=e.reduce((u,m)=>u+(m.importe||0)*12,0),i=Math.max(0,s.bruto-n),d=i*(s.ssPct/100),p=s.irpfModo==="manual"?i*(s.irpfPct/100):ct(xt(s.bruto,n),a.tramos),c=i-d-p,x=i/s.nPagas,f=d/s.nPagas,r=p/s.nPagas,b=x-f-r,g=s.grupoNomina?a.nominas.filter(u=>u.grupoNomina===s.grupoNomina&&u._id!==o):[],$=g.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${l(s.grupoNomina)}" con ${l(g.map(u=>u.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",A=n>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${l(z(n))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${l(z(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${l(z(s.bruto))}</span>
      ${A}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${l(z(d))} (${s.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${l(z(p))} (${i>0?(p/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${l(z(c))}</span>
      ${n>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${l(z(n))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${l(z(b))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${s.representacion==="simplificado"?`ingreso ${l(z(b))}/paga`:`ingreso ${l(z(x))} − SS ${l(z(f))} − IRPF ${l(z(r))}`}${n>0?" + recargas flex":""}</span>
    </div>${$}`}function rn(t,e,a,o){const s=()=>{const d=t.querySelector("#flex-comp-container");d&&(d.innerHTML=on(e,a.accounts))},n=()=>{const d=t.querySelector("#nf-preview");d&&(d.innerHTML=nn(t,e,a,o))},i=()=>{var p,c;const d=(x,f)=>{const r=t.querySelector(x);r&&(r.style.display=f?"":"none")};d("#nf-custom-pagas-wrap",((p=t.querySelector("#nf-npagas"))==null?void 0:p.value)==="custom"),d("#nf-irpfpct-wrap",((c=t.querySelector("#nf-irpfmodo"))==null?void 0:c.value)==="manual"),n()};t.addEventListener("input",d=>{var p;(p=d.target)!=null&&p.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&n()}),W(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),j(t,"[data-flex-anadir]",()=>{var c,x,f;const d=((c=t.querySelector("#fc-tipo"))==null?void 0:c.value)||"transporte",p=parseFloat(((x=t.querySelector("#fc-importe"))==null?void 0:x.value)??"")||0;if(!p)return E("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:d,importe:p,cuenta:((f=t.querySelector("#fc-cuenta"))==null?void 0:f.value)||""}),s(),n()}),j(t,"[data-flex-borrar]",d=>{e.splice(Number(d.getAttribute("data-flex-borrar")),1),s(),n()}),s(),n()}const Ve=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function cn(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var r;return(r=o())==null?void 0:r.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??ft;function d(r,b){const g=o(),$=s();return!g||!$?null:($.innerHTML=`<div class="modal-title">${l(r)}</div>${b}`,g.classList.remove("hidden"),j($,"[data-cerrar]",n),$)}function p(){e=null;const r=[...t.store.get("tramosIRPFHistorico")].sort(($,A)=>$.año-A.año),b="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=d("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${l(Ve(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${r.map($=>`<div style="${b}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${l(Ve($.tramos))}</span>
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
      </div>`);g&&(j(g,"[data-editar-tabla]",$=>{const A=$.getAttribute("data-editar-tabla");f(A==="default"?"default":Number(A))}),j(g,"[data-borrar-tabla]",$=>{const A=Number($.getAttribute("data-borrar-tabla"));tt(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(u=>u.año!==A)),E(`Tabla ${A} eliminada`),t.onDatosCambiados(),p())}),j(g,"[data-anadir-anyo]",()=>{var u;const $=parseInt(((u=g.querySelector("#irpf-new-year"))==null?void 0:u.value)??"",10);if(!$||$<2e3||$>2100)return E("Año inválido","err");const A=t.store.get("tramosIRPFHistorico");if(A.some(m=>m.año===$))return E("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...A,{_id:Date.now().toString(36),año:$,tramos:i().map(m=>[...m])}]),t.onDatosCambiados(),f($)}))}function c(){return a.map(([r,b],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${g}" value="${r}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${g}" value="${b}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function x(r){a=[...r.querySelectorAll("[data-tr-min]")].map((g,$)=>{const A=r.querySelector(`[data-tr-pct="${$}"]`);return[parseFloat(g.value)||0,parseFloat((A==null?void 0:A.value)??"")||0]})}function f(r){var m;e=r;const b=t.store.get("tramosIRPFHistorico");a=(r==="default"?i():((m=b.find(v=>v.año===r))==null?void 0:m.tramos)??i()).map(v=>[...v]);const $=r==="default"?"tabla por defecto":`ejercicio ${r}`,A=d(`Tramos IRPF — ${r==="default"?"Por defecto":r}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${l($)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${c()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!A)return;const u=()=>{const v=A.querySelector("#irpf-tramos-rows");v&&(v.innerHTML=c())};j(A,"[data-volver]",p),j(A,"[data-tr-anadir]",()=>{x(A),a.push([0,0]),u()}),j(A,"[data-tr-borrar]",v=>{x(A),a.splice(Number(v.getAttribute("data-tr-borrar")),1),u()}),j(A,"[data-tr-guardar]",()=>{x(A);const v=[...a].sort((I,y)=>I[0]-y[0]);if(v.length===0)return E("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:v}),E("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(I=>I.año===e?{...I,tramos:v}:I)),E(`Tabla ${e} guardada`)),t.onDatosCambiados(),p()})}return{abrir:p}}const Ue=1500,Ct=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${l(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${l(o)}" placeholder="${l(s)}"/></div>`,ln=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${l(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([s,n])=>`<option value="${l(s)}"${s===o?" selected":""}>${l(n)}</option>`).join("")}
   </select></div>`,dn=t=>(t.modeloFondo||"cuenta")==="pension";function un(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(s=>pn(s,e,a,o)).join("")}</div>`}function pn(t,e,a,o){const s=Zt(t);if(!s)return"";const n=ma(t,e,a),i=o.slice(0,4),d=(t.aportaciones||[]).filter(c=>c.fecha>=`${i}-01-01`).reduce((c,x)=>c+x.cantidad,0),p=Math.min(d,Ue)*(n/100);return`<div class="card">
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
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${d>Ue?"neg":""}">${l(z(d))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${l(z(p))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${l(t.grupoNomina)}": ${n}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${s.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${l(s.proxDesbloqueo)}</div>`:""}
  </div>`}function mn(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${l(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${l(z(a.importe))} / ${l(a.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${l(a.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function fn(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,d)=>d.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,s=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],n=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${Ct("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${Ct("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Ct("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${Ct("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${Ct("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${ln("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${Ct("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${n?' style="display:none"':""}>
        ${Ct("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
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
    ${Wt(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"pen-escenario")}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${l((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function vn(t,e,a){const o=()=>{const s=t.querySelector("#pen-aport-container");s&&(s.innerHTML=mn(e))};W(t,"#pen-grupo",s=>{const n=t.querySelector("#pen-impuesto-wrap");n&&(n.style.display=s.value?"none":"")}),j(t,"[data-aport-anadir]",()=>{var n,i,d,p;const s=parseFloat(((n=t.querySelector("#paport-importe"))==null?void 0:n.value)??"")||0;if(!s)return E("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((d=t.querySelector("#paport-inicio"))==null?void 0:d.value)||a,fechaFin:((p=t.querySelector("#paport-fin"))==null?void 0:p.value)||""}),o()}),j(t,"[data-aport-borrar]",s=>{e.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function gn(t,e,a,o){var A;const s=u=>{var m;return((m=t.querySelector(u))==null?void 0:m.value)??""},n=(u,m=0)=>{const v=parseFloat(s(u));return Number.isFinite(v)?v:m},i=u=>{var m;return!!((m=t.querySelector(u))!=null&&m.checked)},d=s("#pen-nombre").trim();if(!d)return{datos:{},error:"Nombre obligatorio"};const p=n("#pen-saldo"),c=s("#pen-grupo"),x={nombre:d,grupoNomina:c,saldo:p,saldoInicial:n("#pen-saldo-ini"),fechaInicialSaldo:s("#pen-fecha-ini")||o,interes:n("#pen-interes"),periodoCobro:s("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(s("#pen-bloqueo"),10)||120,impuestoRetirada:c?0:n("#pen-impuesto"),planAportaciones:e,descripcion:s("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(u=>u.value)},f=[...(a==null?void 0:a.historicoSaldos)??[]],r=[...(a==null?void 0:a.aportaciones)??[]],g=((A=[...f].sort((u,m)=>m.fecha.localeCompare(u.fecha))[0])==null?void 0:A.saldo)??(a==null?void 0:a.saldo)??null,$=Date.now().toString(36);return a?(g===null||Math.abs(p-g)>.005)&&(f.push({_id:$,fecha:o,saldo:p,nota:"Actualización manual"}),p>(g??0)&&r.push({_id:`${$}a`,fecha:o,cantidad:p-(g??0)})):p>0&&(f.push({_id:$,fecha:o,saldo:p,nota:"Saldo inicial"}),r.push({_id:`${$}a`,fecha:x.fechaInicialSaldo??o,cantidad:p})),{datos:{...x,historicoSaldos:f,aportaciones:r}}}const bn="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function hn(t){const e=t.hoy??V,a=()=>{var A;return(A=t.onDatosCambiados)==null?void 0:A.call(t)};function o(){const A=t.store.get("config");return vt(t.store.get("tramosIRPFHistorico"),A.tramos_irpf??ft)(Number(e().slice(0,4)))}function s(A,u,m){const v=ga(A,u,m),I=!!u&&A.irpfModo!=="manual",y=[A.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${A.mesActualizacionIPC}">IPC m${A.mesActualizacionIPC}</span>`:"",v.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${l(z(v.flexAnual))}/año</span>`:"",Math.abs(v.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${v.ssPct.toFixed(2)}%</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${l(A.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${y}</div>
      </div>
      <div class="num">${l(z(v.brutoAnual))}
        ${v.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${l(z(v.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${l(z(v.netoPorPaga))}/paga neto</div></div>
      <div class="text-sm">${v.nPagas} pagas</div>
      <div class="text-sm ${I?"neg":""}">${A.irpfModo==="manual"?`${l(A.irpfPct??0)}% (manual)`:`${v.irpfPct.toFixed(1)}% (auto)`}${I?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${A.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${l(n(A.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${l(A._id)}"${A.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${l(A._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${l(A._id)}">✕</button>
      </div>
    </div>`}const n=A=>{var u;return((u=t.store.get("accounts").find(m=>m._id===(A||"default")))==null?void 0:u.nombre)??(A||"default")};function i(A,u,m){const v=u.reduce((h,w)=>h+(w.bruto||0),0),I=mo(u,m),y=v>0?I/v*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${l(A)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${l(z(v))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${y.toFixed(1)}%</strong> (${l(z(I))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${u.map(h=>s(h,u,m)).join("")}
      </div>
    </div>`}function d(A){const u=o(),m=[...t.store.get("nominas")].sort((w,S)=>(S.bruto||0)-(w.bruto||0)),{grupos:v,sueltas:I}=vo(m),y=t.store.get("accounts").filter(dn),h=m.filter(w=>w.activo!==!1);A.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${m.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...v.entries()].map(([w,S])=>i(w,S,u)).join("")}
      ${I.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${I.map(w=>s(w,null,u)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${un(y,h,u,e())}</div>`}const p=()=>document.getElementById("modal-overlay"),c=()=>document.getElementById("modal-content"),x=()=>{var A;return(A=p())==null?void 0:A.classList.add("hidden")};function f(A,u){const m=p(),v=c();return!m||!v?null:(v.innerHTML=`<div class="modal-title">${l(A)}</div>${u}`,m.classList.remove("hidden"),j(v,"[data-cancelar]",x),v)}function r(A,u){const m=A?t.store.get("nominas").find(h=>h._id===A)??null:null,v=[...(m==null?void 0:m.retribucionFlexible)??[]].map(h=>({...h})),I={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:o(),hoy:e()},y=f(A?"Editar nómina":"Nueva nómina",sn(m,I));y&&(rn(y,v,I,A??""),j(y,"[data-guardar-nomina]",h=>{const w=Ge(y,v);if(!w.nombre||w.bruto<=0)return E("Nombre y bruto anual son obligatorios","err");const S=h.getAttribute("data-guardar-nomina")||"",M={...w,activo:!0,tags:["nomina"]};S?(t.store.updateItem("nominas",S,M),E("Nómina actualizada")):(t.store.addItem("nominas",M),E("Nómina creada")),a(),x(),u()}))}function b(A,u){const m=A?t.store.get("accounts").find(y=>y._id===A)??null:null,v=[...(m==null?void 0:m.planAportaciones)??[]].map(y=>({...y})),I=f(A?"Editar plan de pensiones":"Nuevo plan de pensiones",fn(m,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:e()}));I&&(vn(I,v,e()),j(I,"[data-guardar-pension]",y=>{const{datos:h,error:w}=gn(I,v,m,e());if(w)return E(w,"err");const S=y.getAttribute("data-guardar-pension")||"";S?(t.store.updateItem("accounts",S,h),E("Plan actualizado")):(t.store.addItem("accounts",h),E("Plan creado")),a(),x(),u()}))}function g(A,u,m){j(A,"[data-nueva-nomina]",()=>r(null,u)),j(A,"[data-editar-nom]",v=>r(v.getAttribute("data-editar-nom"),u)),j(A,"[data-borrar-nom]",v=>{tt("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",v.getAttribute("data-borrar-nom")),E("Eliminada"),a(),u())}),W(A,"[data-activo-nom]",v=>{const I=v;t.store.updateItem("nominas",I.getAttribute("data-activo-nom"),{activo:I.checked}),a(),u()}),j(A,"[data-tramos]",()=>m.abrir()),j(A,"[data-nueva-pension]",()=>b(null,u)),j(A,"[data-editar-pension]",v=>b(v.getAttribute("data-editar-pension"),u)),j(A,"[data-borrar-pension]",v=>{tt("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",v.getAttribute("data-borrar-pension")),E("Plan eliminado"),a(),u())})}let $=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:bn,mount(A){const u=()=>d(A);$??($=cn({store:t.store,onDatosCambiados:()=>{a(),u()},año:()=>Number(e().slice(0,4))})),d(A),A.dataset.wired!=="1"&&(g(A,u,$),A.dataset.wired="1")}}}const yn="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",xn="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",Ye={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},$n={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function In(t,e){const a=t.filter(p=>p.activo&&dt(p)==="inversion");if(a.length===0)return"";let o=0,s=0,n=0,i=0;for(const p of a){const c=Pt(p,e);c&&(o+=c.saldo,s+=c.costBase,n+=c.plusvalia,i+=c.impuesto)}const d=s>0?(n/s*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${l(z(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${l(z(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${l(d)}%)</div><div class="stat-value ${n>=0?"pos":"neg"}">${l(z(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${l(z(i))}</div><div class="stat-sub">Neto: ${l(z(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function An(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,s=Math.max(1,(q(o).getTime()-q(a).getTime())/(30.44*864e5)),n=Nt(t,a),i=n*(Math.pow(1+t.interes/100,s/12)-1);let d="";if(e.config.usarInflacion&&e.inflacion.length>0){const p=n*(lt(e.inflacion,a,o)-1),c=i-p;d=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${l(z(p))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${c>=0?"var(--accent)":"var(--red)"};font-weight:600">${l(z(c))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${l(a.slice(0,7))} → ${l(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${l(z(i))}</span>
    </div>${d}
  </div>`}function wn(t,e){const a=Ye[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,s=e.nominas.flatMap(b=>(b.retribucionFlexible??[]).filter(g=>g.cuenta===t._id).map(g=>({nomina:b,importe:g.importe}))),n=s.reduce((b,g)=>b+g.importe,0),i=n*12,d=o!==null&&i>o,p=o!==null?Math.min(i,o):i,c=t.grupoNomina?e.nominas.filter(b=>(b.grupoNomina||"")===t.grupoNomina&&b.activo!==!1):s.slice(0,1).map(b=>b.nomina),x=Qa(c,e.tramosIRPF),f=p*x/100,r=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${x}%`:`tipo marginal ${x}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${l(a.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${l(z(n))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${d?"neg":"pos"}">${l(z(i))}/año${d?` ⚠ excede límite ${l(z(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${l(z(o))}/año</span></div>`:""}
    ${f>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${l(r)}">≈ ${l(z(f))}/año <span style="font-size:10px;color:var(--text3)">(${l(x)}%)</span></span></div>`:""}
    ${s.length>0?s.map(b=>`<div style="font-size:11px;color:var(--text3)">↩ ${l(b.nomina.nombre)}: ${l(z(b.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function Sn(t){const e=Zt(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${l(z(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${l(z(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${l(z(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${l(z(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${l(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${l(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function Mn(t,e){const a=Pt(t,e.tramosGanancias);if(!a)return"";const o=e.config,s=e.flujos(t._id),n=q(o.dashboardStart),i=q(o.dashboardEnd),d=Math.max(0,(i.getTime()-n.getTime())/(30.44*864e5)),p=a.saldo+s.totalAportaciones-s.totalReembolsos,c=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,x=p>0&&d>0?Math.max(0,p*Math.pow(1+c,d)):Math.max(0,p),f=a.costBase+s.totalAportaciones,r=Math.max(0,x-f),b=pa(r,e.tramosGanancias),g=r>0?(b/r*100).toFixed(1):"0",$=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",A=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",u=(w,S,M)=>w.map(C=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${S} ${l(C.contraparte)}: ${l(C.concepto)}</span>
          <span class="num ${M}">${l(z(C.total))} · ${C.ocurrencias} mov.</span>
        </div>`).join(""),v=s.entradas.length>0||s.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${l(o.dashboardStart.slice(0,7))} → ${l(o.dashboardEnd.slice(0,7))})</div>
         ${u(s.entradas,"↓","pos")}
         ${u(s.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${s.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${l(z(s.totalAportaciones))}</span></div>`:""}
           ${s.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${l(z(s.totalReembolsos))}</span></div>`:""}
           ${s.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${l(z(s.retencion))}</span></div>`:s.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',I=e.invModo(t._id),y=w=>`padding:3px 10px;border-radius:20px;border:1px solid ${w?"var(--accent)":"var(--border)"};background:${w?"var(--accent-dim)":"transparent"};color:${w?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,h=I==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${l(z(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${l(z(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${l(z(a.neto))}</div><div class="stat-sub">${l(A)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${l(z(f))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${l(z(x))}</div><div class="stat-sub">${l($)} · ${l(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${l(z(x-b))}</div><div class="stat-sub">${l(g)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${l(t._id)}|real" style="${y(I==="real")}">Real</button>
          <button data-inv-modo="${l(t._id)}|proyeccion" style="${y(I==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${h}
      ${v}
    </div>`}function Cn(t,e){const a=[...t.historicoSaldos||[]].sort((p,c)=>c.fecha.localeCompare(p.fecha)),o=a[0],s=it(t),n=dt(t),i=t.esCuentaPrincipal,d=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",n==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",n==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",n==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${l((Ye[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(p=>`<span class="badge badge-yellow">🔭 ${l(e.nombreEscenario(p))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${l(t.nombre)}</span>
        ${d}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${l(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${l(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${xn}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${l(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${yn}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${l(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${l(z(t.saldoInicial||0))}</div><div class="stat-sub">${l(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${l(z(s))}</div>${o?`<div class="stat-sub">Registro: ${l(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${l(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${l(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${An(t,e)}
    ${n==="beneficio"?wn(t,e):""}
    ${n==="pension"?Sn(t):""}
    ${n==="inversion"?Mn(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${l(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${l(t.descripcion)}</div>`:""}
  </div>`}const zn=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function Fn(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${l(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${l(z(a.importe))} / ${l(a.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${l(a.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Pn(t,e){const a=t?dt(t):"cuenta",o=[...new Set(e.nominas.filter(n=>n.grupoNomina).map(n=>n.grupoNomina))],s=n=>n?"":' style="display:none"';return`
    <div class="grid-2">
      ${K("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Et("ac-modelo","Tipo",zn,a)}
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
          ${Et("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${Et("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
        ${Wt(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"ac-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${l((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Tn(t,e,a){const o=()=>{const s=t.querySelector("#ac-aport-container");s&&(s.innerHTML=Fn(e))};W(t,"#ac-modelo",s=>{const n=s.value,i=(d,p)=>{const c=t.querySelector(d);c&&(c.style.display=p?"":"none")};i("#ac-inversion-hint",n==="inversion"),i("#ac-beneficio-fields",n==="beneficio")}),j(t,"[data-aport-anadir]",()=>{var n,i,d,p;const s=parseFloat(((n=t.querySelector("#aport-importe"))==null?void 0:n.value)??"")||0;if(!s)return E("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((d=t.querySelector("#aport-inicio"))==null?void 0:d.value)||a,fechaFin:((p=t.querySelector("#aport-fin"))==null?void 0:p.value)||""}),o()}),j(t,"[data-aport-borrar]",s=>{e.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function jn(t,e,a,o,s){const n=g=>{var $;return(($=t.querySelector(g))==null?void 0:$.value)??""},i=(g,$=0)=>{const A=parseFloat(n(g));return Number.isFinite(A)?A:$},d=g=>{var $;return!!(($=t.querySelector(g))!=null&&$.checked)},p=n("#ac-nombre").trim();if(!p)return{datos:{},error:"Nombre obligatorio"};const c=n("#ac-modelo")||"cuenta",x=c==="beneficio",f=i("#ac-saldo"),r={nombre:p,saldo:f,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:n("#ac-fecha-ini")||s,interes:i("#ac-interes"),periodoCobro:n("#ac-periodo")||"mensual",descripcion:n("#ac-desc").trim(),activo:d("#ac-activo"),simulacion:d("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(g=>g.value),modeloFondo:c,planAportaciones:e,tipoBeneficio:x?n("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:x?n("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&f<=0)return{datos:r};if(!(o===null||Math.abs(f-o)>.005))return{datos:r};if(c==="inversion"&&f>(o??0)){const g=Date.now().toString(36);r.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${g}a`,fecha:a?s:r.fechaInicialSaldo??s,cantidad:f-(o??0)}]}return{datos:r,punto:{fecha:s,saldo:f,nota:a?"Actualización manual":"Saldo inicial"}}}function Ta(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:et(e.saldoCts),nota:e.nota}))}function _n(t,e,a,o,s){const n=a.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${l(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${l(z(i.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${l(i.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${l(e)}|${l(i._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${l(e)}|${l(i._id)}">✕</button>
      </div>`).join("");return`
    <div class="card-title">Histórico — ${l(t)}</div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${a.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':n}
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
      <button class="btn-primary" data-hist-anadir="${l(e)}">Añadir</button>
    </div>`}const We=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function En(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),s=()=>document.getElementById("modal-content"),n=()=>{var r;return(r=o())==null?void 0:r.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??wt;function d(r,b){const g=o(),$=s();return!g||!$?null:($.innerHTML=`<div class="modal-title">${l(r)}</div>${b}`,g.classList.remove("hidden"),j($,"[data-cerrar]",n),$)}function p(){e=null;const r=[...t.store.get("tramosGananciasCapitalHistorico")].sort(($,A)=>$.año-A.año),b="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=d("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${l(We(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${r.map($=>`<div style="${b}">
              <span style="font-weight:600;font-size:13px">${$.año}</span>
              <span class="text-sm" style="color:var(--text2)">${l(We($.tramos))}</span>
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
      </div>`);g&&(j(g,"[data-editar-tg]",$=>{const A=$.getAttribute("data-editar-tg");f(A==="default"?"default":Number(A))}),j(g,"[data-borrar-tg]",$=>{const A=Number($.getAttribute("data-borrar-tg"));tt(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(u=>u.año!==A)),E(`Tabla ${A} eliminada`),t.onDatosCambiados(),p())}),j(g,"[data-anadir-anyo-tg]",()=>{var u;const $=parseInt(((u=g.querySelector("#tg-new-year"))==null?void 0:u.value)??"",10);if(!$||$<2e3||$>2100)return E("Año inválido","err");const A=t.store.get("tramosGananciasCapitalHistorico");if(A.some(m=>m.año===$))return E("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...A,{_id:Date.now().toString(36),año:$,tramos:i().map(m=>[...m])}]),t.onDatosCambiados(),f($)}))}function c(){return a.map(([r,b],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${g}" value="${r}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${g}" value="${b}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function x(r){a=[...r.querySelectorAll("[data-tg-min]")].map((b,g)=>{const $=r.querySelector(`[data-tg-pct="${g}"]`);return[parseFloat(b.value)||0,parseFloat(($==null?void 0:$.value)??"")||0]})}function f(r){var u;e=r;const b=t.store.get("tramosGananciasCapitalHistorico");a=(r==="default"?i():((u=b.find(m=>m.año===r))==null?void 0:u.tramos)??i()).map(m=>[...m]);const $=d(`Ganancias de capital — ${r==="default"?"Por defecto":r}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${c()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!$)return;const A=()=>{const m=$.querySelector("#tg-rows");m&&(m.innerHTML=c())};j($,"[data-volver-tg]",p),j($,"[data-tg-anadir]",()=>{x($),a.push([0,0]),A()}),j($,"[data-tg-borrar]",m=>{x($),a.splice(Number(m.getAttribute("data-tg-borrar")),1),A()}),j($,"[data-tg-guardar]",()=>{x($);const m=[...a].sort((v,I)=>v[0]-I[0]);if(m.length===0)return E("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:m}),E("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(v=>v.año===e?{...v,tramos:m}:v)),E(`Tabla ${e} guardada`)),t.onDatosCambiados(),p()})}return{abrir:p}}const ja=["#00e5a0","#4d9fff","#ffd166","#ff4d6d","#a855f7","#fb923c"],Dn="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z";function Rn(t){const e=()=>document.getElementById("modal-overlay"),a=()=>document.getElementById("modal-content"),o=()=>{var c;return(c=e())==null?void 0:c.classList.add("hidden")};function s(c,x,f,r){const b=Va(c,f,r),g=c.targetAmount||0,$=g>0?Math.min(100,b/g*100):0,A=!c.completado&&g>0&&b>=g,u=c.targetDate?Math.max(0,Math.round((q(c.targetDate).getTime()-q(t.hoy()).getTime())/(30.44*864e5))):null,m=u!==null&&u>0?Math.max(0,g-b)/u:null,v=!c.completado&&!A?Ua(c,f,{extractoCuenta:t.extractoCuenta,colchonEnFecha:t.colchonEnFecha,hoy:q(t.hoy())}):null,I=(c.cuentaIds||[]).length>0?(c.cuentaIds||[]).map(M=>{var C;return((C=f.find(P=>P._id===M))==null?void 0:C.nombre)??M}).join(", "):"Todas las cuentas activas",y=[c.completado?'<span class="badge badge-active">✓ Completado</span>':"",A?'<span class="badge" style="background:rgba(0,229,160,0.2);color:var(--accent)">🎉 ¡Meta alcanzada!</span>':"",c.usarColchon!==!1?'<span class="badge badge-inactive" title="Colchón descontado del saldo">🛡 −colchón</span>':""].join(""),h=$>=100?"var(--accent)":$>=70?"var(--yellow)":"var(--text2)",w=["card mb-8",c.completado?"goal-completado":"",A?"goal-alcanzado":""].filter(Boolean).join(" "),S=[m!==null?`<span>Necesitas ${l(z(m))}/mes</span>`:"",c.targetDate?`<span>Meta fijada: ${l(c.targetDate)}</span>`:"",v?`<span style="color:var(--accent)">📈 Estimado: ${l(v)}</span>`:!c.completado&&!A?'<span style="color:var(--text3)">Sin proyección</span>':"",c.usarColchon!==!1?`<span>Colchón: ${l(z(r))}</span>`:"",`<span>Cuentas: ${l(I)}</span>`].join("");return`<div class="${w}" style="padding:14px;border:1px solid ${A?"var(--accent)":"var(--border)"}">
      <div class="flex justify-between items-center mb-8">
        <div class="flex gap-8 items-center flex-wrap">
          <span class="goal-priority-badge">#${l(c.prioridad||x+1)}</span>
          <span style="font-weight:600;font-size:14px${c.completado?";text-decoration:line-through;color:var(--text3)":""}">${l(c.nombre)}</span>
          ${y}
        </div>
        <div class="flex gap-8">
          ${A?`<button class="btn-primary btn-sm" data-completar-goal="${l(c._id)}">Marcar completado</button>`:""}
          <button class="btn-icon" data-editar-goal="${l(c._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Dn}"/></svg></button>
          <button class="btn-danger btn-sm" data-borrar-goal="${l(c._id)}">✕</button>
        </div>
      </div>
      <div class="flex justify-between mb-4">
        <span class="text-sm">${l(z(b))} / ${l(z(g))}</span>
        <span class="text-sm" style="color:${h}">${$.toFixed(0)}%${u!==null?` · ${u}m restantes`:""}</span>
      </div>
      <div class="goal-bar"><div class="goal-bar-fill" style="width:${$}%;background:${l(c.color||"var(--accent)")}"></div></div>
      <div class="flex gap-12 mt-8 flex-wrap" style="font-size:11px;color:var(--text3)">${S}</div>
    </div>`}function n(c){const x=[...t.store.get("goals")].sort((b,g)=>(b.prioridad||99)-(g.prioridad||99)),f=t.store.get("accounts"),r=t.colchonEnFecha(t.hoy());c.innerHTML=`
      <div class="flex justify-between items-center mb-12">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro</div>
        <button class="btn-primary btn-sm" data-nuevo-goal>+ Objetivo</button>
      </div>
      ${x.length===0?'<div class="text-sm" style="color:var(--text3)">Sin objetivos. Define metas de ahorro para seguirlas aquí y en el Dashboard.</div>':x.map((b,g)=>s(b,g,f,r)).join("")}`}function i(c){const x=t.store.get("accounts").filter($=>$.activo&&!$.simulacion),f=t.store.get("goals"),r=c?c.prioridad||1:Math.max(0,...f.map($=>$.prioridad||0))+1,b=(c==null?void 0:c.color)||ja[0],g=x.map($=>`<label style="display:flex;gap:8px;align-items:center;font-size:13px;cursor:pointer">
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
            <input class="form-input" type="number" id="goal-prio" value="${l(r)}" placeholder="1"/></div>
          <div class="form-group mt-8">
            <label class="form-label">Cuentas a considerar (vacío = todas las activas)</label>
            <div style="display:flex;flex-direction:column;gap:6px;padding:8px;background:var(--bg3);border-radius:var(--radius)">
              ${g||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
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
              ${ja.map($=>`<option value="${$}"${$===b?" selected":""}>${$}</option>`).join("")}
            </select></div>
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-goal="${l((c==null?void 0:c._id)??"")}">Guardar</button>
      </div>`}function d(c,x){const f=c?t.store.get("goals").find(g=>g._id===c)??null:null,r=e(),b=a();!r||!b||(b.innerHTML=`<div class="modal-title">${c?"Editar objetivo":"Nuevo objetivo"}</div>${i(f)}`,r.classList.remove("hidden"),j(b,"[data-cancelar]",o),j(b,"[data-guardar-goal]",g=>{var v,I;const $=y=>{var h;return((h=b.querySelector(y))==null?void 0:h.value)??""},A=$("#goal-nombre").trim();if(!A)return E("Nombre obligatorio","err");const u={nombre:A,targetAmount:parseFloat($("#goal-amount"))||0,targetDate:$("#goal-date")||null,prioridad:parseInt($("#goal-prio"),10)||1,color:$("#goal-color")||ja[0],usarColchon:!!((v=b.querySelector("#goal-colchon"))!=null&&v.checked),completado:!!((I=b.querySelector("#goal-completado"))!=null&&I.checked),cuentaIds:[...b.querySelectorAll(".goal-acc-check:checked")].map(y=>y.value)},m=g.getAttribute("data-guardar-goal")||"";m?(t.store.updateItem("goals",m,u),E("Actualizado")):(t.store.addItem("goals",u),E("Objetivo creado")),t.onDatosCambiados(),o(),x()}))}function p(c,x){j(c,"[data-nuevo-goal]",()=>d(null,x)),j(c,"[data-editar-goal]",f=>d(f.getAttribute("data-editar-goal"),x)),j(c,"[data-borrar-goal]",f=>{tt("¿Eliminar objetivo?")&&(t.store.removeItem("goals",f.getAttribute("data-borrar-goal")),E("Objetivo eliminado"),t.onDatosCambiados(),x())}),j(c,"[data-completar-goal]",f=>{t.store.updateItem("goals",f.getAttribute("data-completar-goal"),{completado:!0}),E("Objetivo marcado como completado ✓"),t.onDatosCambiados(),x()})}return{render:n,wire:p}}const Nn="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",qn=120;function Ln(t){const e=t.hoy??V,a=()=>{var F;return(F=t.onDatosCambiados)==null?void 0:F.call(t)},o=t.mostrarObjetivos??(()=>!0),s=new Map,n=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),d=F=>{var T;return((T=i().find(_=>_._id===F))==null?void 0:T.nombre)??F},p=F=>{var T;return((T=t.store.get("accounts").find(_=>_._id===F))==null?void 0:T.nombre)??F},c=()=>vt(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??ft)(Number(e().slice(0,4))),x=()=>vt(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??wt),f=()=>x()(Number(e().slice(0,4))),r=F=>me(t.store.get("expenses"),n(),t.store.get("loans"),F);function b(){const F=n(),T=t.store.get("accounts"),_=kt({loans:[],expenses:t.store.get("expenses").filter(k=>k.tipo==="transferencia"),accounts:T,config:{dashboardStart:F.dashboardStart,dashboardEnd:F.dashboardEnd,fechaReferencia:F.dashboardStart},nominas:[],resolverTramosGanancias:x()}),R=new Map,N=k=>{let H=R.get(k);return H||(H={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},R.set(k,H)),H},B=(k,H)=>{const Q=`${H.sourceId}`,D=k.find(U=>U.concepto===Q),O=D??{concepto:Q,contraparte:"",total:0,ocurrencias:0};O.total+=Math.abs(H.cuantia),O.ocurrencias+=1,D||k.push(O)};for(const k of _){if(!k.cuenta)continue;const H=N(k.cuenta);k.sourceType==="transfer-in"||k.sourceType==="traspaso-in"?(H.totalAportaciones+=Math.abs(k.cuantia),B(H.entradas,k)):k.sourceType==="transfer-out"||k.sourceType==="traspaso-out"?(H.totalReembolsos+=Math.abs(k.cuantia),B(H.salidas,k)):k.sourceType==="investment-tax"&&(H.retencion+=Math.abs(k.cuantia))}const G=t.store.get("expenses");for(const k of R.values())for(const[H,Q]of[[k.entradas,"cuenta"],[k.salidas,"cuentaDestino"]])for(const D of H){const O=G.find(U=>U._id===D.concepto);D.contraparte=p((O==null?void 0:O[Q])??"default"),D.concepto=(O==null?void 0:O.concepto)||(Q==="cuenta"?"Aportación":"Reembolso")}return R}function g(){const F=new Map,T=n(),_=e(),R=new Date(Number(_.slice(0,4)),Number(_.slice(5,7))-1+qn+1,0),N=`${R.getFullYear()}-${String(R.getMonth()+1).padStart(2,"0")}-${String(R.getDate()).padStart(2,"0")}`;return B=>{const G=F.get(B._id);if(G)return G;const k=kt({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...T,dashboardStart:_,dashboardEnd:N,fechaReferencia:_},filtroAccounts:[B._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:vt(t.store.get("tramosIRPFHistorico"),T.tramos_irpf??ft),resolverTramosGanancias:x()}).map(H=>({fecha:H.fecha,saldoAcum:H.saldoAcum}));return F.set(B._id,k),k}}const $=Rn({store:t.store,colchonEnFecha:r,extractoCuenta:F=>A(F),hoy:e,onDatosCambiados:a});let A=g();function u(F){A=g();const _=t.store.get("accounts").filter(G=>dt(G)!=="pension"),R=b(),N={config:n(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:c(),tramosGanancias:f(),nombreEscenario:d,flujos:G=>R.get(G)??$n,invModo:G=>s.get(G)??"proyeccion"};F.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${In(_,N.tramosGanancias)}
      <div class="grid-3">${_.map(G=>Cn(G,N)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const B=F.querySelector("#goals-section");B&&$.render(B)}const m=()=>document.getElementById("modal-overlay"),v=()=>document.getElementById("modal-content"),I=()=>{var F;return(F=m())==null?void 0:F.classList.add("hidden")};function y(F,T){const _=m(),R=v();return!_||!R?null:(R.innerHTML=F?`<div class="modal-title">${l(F)}</div>${T}`:T,_.classList.remove("hidden"),j(R,"[data-cancelar]",I),R)}function h(F,T){const _=F?t.store.get("accounts").find(G=>G._id===F)??null:null,R=[...(_==null?void 0:_.planAportaciones)??[]].map(G=>({...G})),N=_?w(_):null,B=y(F?"Editar cuenta / fondo":"Nueva cuenta / fondo",Pn(_,{escenarios:i(),nominas:t.store.get("nominas"),hoy:e(),saldoActual:N??0}));B&&(Tn(B,R,e()),j(B,"[data-guardar-acc]",G=>{const k=G.getAttribute("data-guardar-acc")||"",{datos:H,punto:Q,error:D}=jn(B,R,_,N,e());if(D)return E(D,"err");let O=k;k?t.store.updateItem("accounts",k,H):O=t.store.addItem("accounts",H)._id,Q&&t.ledger.registrarPuntoControl(O,Q.fecha,Q.saldo,Q.nota),E(k?"Actualizada":"Cuenta / fondo creado"),a(),I(),T()}))}function w(F){const T=t.ledger.puntosControl(F._id);return T.length>0?Ta(T)[0].saldo:F.saldo??null}function S(F,T){const _=t.store.get("accounts").find(B=>B._id===F);if(!_)return;const R=y("Histórico de saldos",_n(_.nombre,F,Ta(t.ledger.puntosControl(F)),_.saldoInicial||0,e()));if(!R)return;const N=()=>{T(),S(F,T)};j(R,"[data-hist-anadir]",()=>{var H,Q,D;const B=((H=R.querySelector("#hi-fecha"))==null?void 0:H.value)??"",G=parseFloat(((Q=R.querySelector("#hi-saldo"))==null?void 0:Q.value)??""),k=((D=R.querySelector("#hi-nota"))==null?void 0:D.value.trim())??"";if(!B||!Number.isFinite(G))return E("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(F,B,G,k||void 0),E("Punto añadido"),a(),N()}),j(R,"[data-hist-borrar]",B=>{const[,G]=(B.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(G),E("Eliminado"),a(),N()}),j(R,"[data-hist-inicial]",B=>{const[G,k]=(B.getAttribute("data-hist-inicial")||"").split("|"),H=t.ledger.puntosControl(G).find(D=>D._id===k);if(!H)return;const Q=Ta([H])[0].saldo;t.store.updateItem("accounts",G,{saldoInicial:Q,fechaInicialSaldo:H.fecha}),E(`Punto inicial → ${H.fecha} (${z(Q)})`),a(),N()})}function M(F){const T=t.store.get("accounts").filter(N=>N.activo);if(T.length===0)return E("No hay cuentas activas","err");const _=e(),R=T.map(N=>`• ${N.nombre}: ${z(w(N)??N.saldoInicial??0)}`).join(`
`);if(tt(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${_})?

${R}

Esto recalibra el punto de arranque del dashboard.`)){for(const N of T)t.store.updateItem("accounts",N._id,{saldoInicial:w(N)??N.saldoInicial??0,fechaInicialSaldo:_});E("Saldo base actualizado"),a(),F()}}function C(F,T,_){j(F,"[data-nueva-acc]",()=>h(null,T)),j(F,"[data-editar-acc]",R=>h(R.getAttribute("data-editar-acc"),T)),j(F,"[data-tramos-ganancias]",()=>_.abrir()),j(F,"[data-reset-base]",()=>M(T)),j(F,"[data-hist-acc]",R=>S(R.getAttribute("data-hist-acc"),T)),j(F,"[data-principal-acc]",R=>{const N=R.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(B=>({...B,esCuentaPrincipal:B._id===N}))),E("Cuenta marcada como principal"),a(),T()}),j(F,"[data-borrar-acc]",R=>{const N=R.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return E("Debe existir al menos una cuenta","err");if(!tt("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",N);const G=t.store.get("accounts");G.length>0&&!G.some(k=>k.esCuentaPrincipal)&&t.store.set("accounts",G.map((k,H)=>H===0?{...k,esCuentaPrincipal:!0}:k)),E("Cuenta eliminada"),a(),T()}),j(F,"[data-inv-modo]",R=>{const[N,B]=(R.getAttribute("data-inv-modo")||"").split("|");s.set(N,B==="real"?"real":"proyeccion"),T()}),$.wire(F,T)}let P=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:Nn,mount(F){const T=()=>u(F);P??(P=En({store:t.store,onDatosCambiados:()=>{a(),T()},año:()=>Number(e().slice(0,4))})),u(F),F.dataset.wired!=="1"&&(C(F,T,P),F.dataset.wired="1")}}}const at=(t,e,a="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${a};font-size:12px;padding:5px 10px">${l(z(e))}</td>
  </tr>`,_a=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${l(t)}</td></tr>`;function Je(t){const a=t.capMobiliario!==0||t.gananciasFondos!==0?`${at("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
       ${at("Ganancias patrimoniales (fondos/acciones)",t.gananciasFondos,t.gananciasFondos>=0?"var(--text)":"var(--green)",!0)}`:'<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>',o=t.resultado>0?"var(--red)":"var(--green)",s=t.resultado>0?"🔴 A PAGAR":"🟢 A DEVOLVER";return`
    <table style="width:100%;border-collapse:collapse">
      ${_a("RENDIMIENTOS DEL TRABAJO")}
      ${at("Ingresos íntegros del trabajo",t.brutoTotal,"var(--text)",!0)}
      ${t.flexTotal>0?at("− Retribución flexible exenta (Art. 42 LIRPF)",-t.flexTotal,"var(--green)",!0):""}
      ${t.flexTotal>0?at("= Ingresos sujetos a IRPF",t.brutoIRPF):""}
      ${at("− Cotizaciones SS (≈6,35 %)",-t.cotizSS,"var(--red)",!0)}
      ${at("− Gastos deducibles (Art. 19.2 LIRPF)",-t.gastosArt19,"var(--red)",!0)}
      ${at("= Rendimiento neto trabajo",t.RNT)}
      ${at("− Reducción Art. 20 LIRPF",-t.reducArt20,"var(--green)",!0)}
      ${t.deducPP>0?at(`− Aportaciones a planes de pensiones (${l(z(t.aportPP))}, límite ${l(z(t.limPP))})`,-t.deducPP,"var(--green)",!0):""}
      ${t.otrosIngresos>0?at("+ Otros ingresos sujetos a IRPF",t.otrosIngresos,"var(--text)",!0):""}
      ${t.capInmobiliario!==0?at("+ Capital inmobiliario neto",t.capInmobiliario,t.capInmobiliario>=0?"var(--text)":"var(--green)",!0):""}
      ${t.otrasCorto!==0?at("± Otras ganancias a corto plazo",t.otrasCorto,"var(--text)",!0):""}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE GENERAL</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${l(z(t.baseGeneral))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota IRPF base general</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${l(z(t.cuotaGen))}</td>
      </tr>

      ${_a("BASE DEL AHORRO")}
      ${a}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${l(z(t.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${l(z(t.cuotaAho))}</td>
      </tr>

      ${_a("RESULTADO")}
      ${at("Cuota íntegra total",t.cuotaIntegra,"var(--red)")}
      ${at("− Retenciones en nómina",-t.retNomina,"var(--green)",!0)}
      ${t.retCapital!==0?at("− Retenciones de capital mobiliario",-t.retCapital,"var(--green)",!0):""}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${s}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${o}">${l(z(Math.abs(t.resultado)))}</td>
      </tr>
    </table>`}const Jt=(t,e,a,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${l(e)}</label>
    <input type="number" id="${t}" class="form-input" value="${l(a)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${l(o)}</div>`:""}
  </div>`;function kn(t){const e=t.extras,a=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
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
          ${Jt("rex-inmobiliario","Capital inmobiliario neto (alquileres − gastos)",e.capInmobiliario??0)}
          ${Jt("rex-mobiliario","Capital mobiliario (dividendos, intereses)",e.capMobiliario??0)}
          ${Jt("rex-ganancias","Ganancias / pérdidas patrimoniales (fondos, acciones)",e.gananciasFondos??0,"Positivo = ganancia · Negativo = pérdida compensable")}
          ${Jt("rex-otras","Otras ganancias a corto plazo (menos de 1 año)",e.otrasCorto??0)}
          ${Jt("rex-ret-cap","Retenciones de capital ya aplicadas",e.retCapital??0,"Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen")}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${t.nominas.length>0?t.nominas.map(o=>`• ${l(o.nombre)}: ${l(z(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${l(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${Je(t.declaracion)}</div>
      </div>
    </div>`}function Ke(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((a,o)=>a[0]-o[0]).map(([a,o],s,n)=>{const i=s<n.length-1?n[s+1][0]:null,d=i!==null?`${z(a)} – ${z(i)}`:`Más de ${z(a)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${l(d)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${l(o)}%</td>
      </tr>`}).join("")}
  </table>`}const On=(t,e,a)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${l(e)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${a}</div>
  </div>`,rt=(t,e,a="")=>`<div class="stat-card"><div class="stat-label">${l(t)}</div><div class="stat-value ${a}">${l(e)}</div></div>`,bt=(t,e,a="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${l(t)}</span><span class="num ${a}">${l(e)}</span></div>`;function Bn(t,e,a){const o=t.filter(p=>(p.modeloFondo||"cuenta")==="inversion");if(o.length===0)return On("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let s=0,n=0,i=0;const d=o.map(p=>{const c=Pt(p,e);if(!c)return"";s+=c.saldo,n+=c.costBase,i+=c.impuesto;const x=c.costBase>0?c.plusvalia/c.costBase*100:0,f=(p.escenarioIds||[]).map(r=>`<span class="badge badge-yellow">🔭 ${l(a(r))}</span>`).join("");return`
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${l(p.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${f}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            ${rt("Valor actual",z(c.saldo))}
            ${rt("Coste base (aportado)",z(c.costBase))}
          </div>
          <div class="grid-2" style="gap:8px">
            ${rt(`Plusvalía latente (${x>=0?"+":""}${x.toFixed(1)}%)`,z(c.plusvalia),c.plusvalia>=0?"pos":"neg")}
            ${rt("Imp. ganancias de capital (est.)",z(c.impuesto),"neg")}
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${l(z(c.neto))}</span>
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
      ${Ke(e)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function Hn(t){const{nominas:e,planes:a,tramos:o}=t,s=b=>b.grupoNomina?e.filter(g=>(g.grupoNomina||"")===b.grupoNomina):null,n=e.map(b=>({n:b,d:ga(b,s(b),o)})),i=n.reduce((b,g)=>b+g.d.brutoAnual,0),d=n.reduce((b,g)=>b+g.d.irpfAnual,0),p=n.reduce((b,g)=>b+g.d.ssAnual,0),c=n.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':n.map(({n:b,d:g})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${l(b.nombre)}</div>
          ${bt("Bruto anual",z(g.brutoAnual))}
          ${g.flexAnual>0?bt("− Retribución flexible exenta",z(-g.flexAnual),"pos"):""}
          ${bt("− Cotización SS",z(-g.ssAnual),"neg")}
          ${bt(`− IRPF estimado (${g.irpfPct.toFixed(1)} %)`,z(-g.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${l(z(g.baseDineraria-g.ssAnual-g.irpfAnual))}</span>
          </div>
        </div>`).join(""),x=Qa(e,o),f=`${t.hoy.slice(0,4)}-01-01`,r=a.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':a.map(b=>{const g=Zt(b);if(!g)return"";const $=(b.aportaciones||[]).filter(v=>v.fecha>=f).reduce((v,I)=>v+I.cantidad,0),u=Math.min($,Mt)*x/100,m=$>Mt;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${l(b.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${bt("Valor actual",z(g.saldo))}
          ${bt("Coste base (total aportado)",z(g.costBase))}
          ${bt("Revalorización",z(g.beneficio),g.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${l(t.hoy.slice(0,4))}</div>
            ${bt("Aportado",`${z($)}${m?" ⚠":""}`,m?"neg":"")}
            ${bt("Límite deducible",z(Mt))}
            ${bt(`Ahorro IRPF est. (marginal ${x} %)`,z(u),"pos")}
            ${m?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${l(z(Mt))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${g.proxDesbloqueo?`· Próx. desbloqueo: ${l(g.proxDesbloqueo)}`:""}
          </div>
        </div>`}).join("");return`
    <div class="card mb-16">
      <div class="card-title mb-10">Nóminas activas — importes anuales</div>
      <div class="grid-4" style="gap:8px;margin-bottom:14px">
        ${rt("Bruto anual total",z(i))}
        ${rt("Cotización SS anual",z(p),"neg")}
        ${rt("IRPF estimado anual",z(d),"neg")}
        ${rt("Neto anual",z(i-p-d),"pos")}
      </div>
      <div class="grid-3">${c}</div>
    </div>

    <div class="card-title mb-8">Planes de pensiones</div>
    <div class="auth-hint mb-14" style="border-color:var(--yellow)">
      💼 <strong>Diferencia clave frente a los fondos de inversión:</strong> el rescate de un plan de pensiones tributa en la
      <strong>base general del IRPF</strong> (tramos ordinarios hasta el 47 %), <em>no</em> en la base del ahorro. Las
      aportaciones son deducibles hasta <strong>${l(z(Mt))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${r}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${Ke(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const oa=(t,e)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${l(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${l(e)}</div>
  </div>`;function Gn(){return`
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
        ${oa("Rendimientos íntegros","Alquileres, subarriendos y cesión de derechos sobre inmuebles")}
        ${oa("Gastos deducibles","IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación")}
        ${oa("Reducción del 60 %","Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)")}
        ${oa("Base general del IRPF","Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.")}
      </div>
    </div>`}const Xe=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],Vn="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function Un(t){const e=t.hoy??V;let a="declaracion",o={};const s=()=>t.store.get("config"),n=()=>Number(e().slice(0,4)),i=()=>t.store.get("nominas").filter(m=>m.activo),d=()=>t.store.get("accounts").filter(m=>(m.modeloFondo||"cuenta")==="pension"),p=m=>{var v;return((v=t.store.get("escenarios").find(I=>I._id===m))==null?void 0:v.nombre)??m},c=()=>vt(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??ft)(n()),x=()=>vt(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??wt)(n());function f(){const m=`${n()}-01-01`,v=t.store.get("nominas").filter(h=>h.activo&&!h.simulacion),I=d().reduce((h,w)=>h+(w.aportaciones||[]).filter(S=>S.fecha>=m).reduce((S,M)=>S+M.cantidad,0),0),y=t.store.get("expenses").filter(h=>h.activo&&h.sujetoIRPF&&h.tipo==="ingreso").reduce((h,w)=>h+Za(w),0);return ae({nominas:v,aportacionesPension:I,otrosIngresos:y,extras:o,tramosGeneral:c(),tramosAhorro:x()})}function r(){const m=c(),v=i(),I=T=>T.grupoNomina?v.filter(_=>(_.grupoNomina||"")===T.grupoNomina):null,y=v.map(T=>ga(T,I(T),m)),h=y.reduce((T,_)=>T+_.brutoAnual,0),w=y.reduce((T,_)=>T+_.irpfAnual,0),S=y.reduce((T,_)=>T+_.ssAnual,0),M=t.store.get("accounts").filter(T=>(T.modeloFondo||"cuenta")==="inversion");let C=0,P=0;for(const T of M){const _=Pt(T,x());_&&(C+=_.plusvalia,P+=_.impuesto)}if(h<=0&&M.length===0)return"";const F=(T,_,R)=>`<div class="exec-item"><div class="exec-item-label">${l(T)}</div><div class="exec-item-val ${R}">${l(_)}</div></div>`;return`<div class="exec-summary mb-14">
      ${h>0?F("IRPF trabajo",`${z(w)}/año`,"neg"):""}
      ${h>0?F("Neto trabajo",`${z(h-S-w)}/año`,"pos"):""}
      ${M.length>0?F("Plusvalía latente",z(C),C>=0?"pos":"neg"):""}
      ${M.length>0?F("Imp. potencial (inversión)",z(P),"neg"):""}
    </div>`}function b(){return a==="mobiliario"?Bn(t.store.get("accounts"),x(),p):a==="trabajo"?Hn({nominas:i(),planes:d(),tramos:c(),hoy:e()}):a==="inmobiliario"?Gn():kn({año:n(),extras:o,declaracion:f(),nominas:i().map(m=>({nombre:m.nombre,bruto:m.bruto||0})),planes:d().map(m=>m.nombre)})}function g(m,v){const I=a===m;return`<button data-tab-fisc="${m}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${I?"600":"400"};
      color:${I?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${I?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${l(v)}</button>`}function $(m){const v=m.querySelector("#fisc-tabs"),I=m.querySelector("#fisc-tab-content");v&&(v.innerHTML=Xe.map(([y,h])=>g(y,h)).join("")),I&&(I.innerHTML=b())}function A(m){m.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${r()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${Xe.map(([v,I])=>g(v,I)).join("")}
      </div>
      <div id="fisc-tab-content">${b()}</div>`}function u(m){j(m,"[data-tab-fisc]",v=>{a=v.getAttribute("data-tab-fisc")||"declaracion",$(m)}),m.addEventListener("input",v=>{var w;if(!((w=v.target)==null?void 0:w.closest("[data-rex]")))return;const y=S=>{var M;return((M=m.querySelector(`#${S}`))==null?void 0:M.value)??"0"};o={capInmobiliario:parseFloat(y("rex-inmobiliario"))||0,capMobiliario:parseFloat(y("rex-mobiliario"))||0,gananciasFondos:parseFloat(y("rex-ganancias"))||0,otrasCorto:parseFloat(y("rex-otras"))||0,retCapital:parseFloat(y("rex-ret-cap"))||0};const h=m.querySelector("#renta-cuadro");h&&(h.innerHTML=Je(f()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:Vn,mount(m){A(m),m.dataset.wired!=="1"&&(u(m),m.dataset.wired="1")}}}const Qe=()=>globalThis.Chart??null;function Yn(t,e){const a=Qe();if(!a)return null;const o=e.map(s=>({label:s.label,data:s.puntos.map(n=>({x:n.x,y:n.y})),borderColor:s.esBase?"#6b7280":s.color,backgroundColor:s.esBase?"transparent":`${s.color}18`,borderWidth:s.esBase?1.5:2,...s.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new a(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:s=>`${s.dataset.label}: ${z(s.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:s=>z(s)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const Wn=()=>Qe()!==null,zt=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Jn="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function Kn(t){const e=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)},a=new Set;let o=null;const s=()=>t.store.get("config"),n=()=>t.store.get("escenarios"),i=h=>{var w;return h?((w=n().find(S=>S._id===h))==null?void 0:w.nombre)??h:"Base"};function d(h){const w=s(),S=Wa({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(h==null?void 0:h._id)??null),M=a.size>0?S.accounts.filter(T=>!a.has(T._id)):S.accounts,C=a.size>0?M.map(T=>T._id):null,P=h!=null&&h.fechaFin&&h.fechaFin>w.dashboardEnd?h.fechaFin:w.dashboardEnd;return{eventos:kt({loans:S.loans,expenses:S.expenses,accounts:M,config:{...w,dashboardEnd:P},filtroAccounts:C,nominas:S.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:vt(t.store.get("tramosIRPFHistorico"),w.tramos_irpf??ft),resolverTramosGanancias:vt(t.store.get("tramosGananciasCapitalHistorico"),w.tramosGananciasCapital??wt)}),horizonte:P}}function p(h){const w=t.store.get("loans"),S=F=>(F.escenarioIds||[]).includes(h),M=[[w.filter(S).length,"préstamo","préstamos"],[w.flatMap(F=>F.amortizaciones||[]).filter(S).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(S).length,"gasto","gastos"],[t.store.get("accounts").filter(S).length,"cuenta","cuentas"],[t.store.get("nominas").filter(S).length,"nómina","nóminas"]],C=M.reduce((F,[T])=>F+T,0),P=M.filter(([F])=>F>0).map(([F,T,_])=>`${F} ${F===1?T:_}`).join(" · ");return{total:C,texto:P}}function c(h,w){const S=w===h._id,M=h.color||zt[0],{total:C,texto:P}=p(h._id);return`<div class="card mb-12" style="border-left:3px solid ${l(M)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${l(M)};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${l(h.nombre)}</span>
        ${S?'<span class="badge badge-yellow">● Activo</span>':""}
        ${h.fechaFin?`<span class="badge badge-inactive">📅 ${l(h.fechaFin)}</span>`:""}
        <div class="flex gap-8">
          ${S?'<button class="btn-secondary btn-sm" data-desactivar-esc>Desactivar</button>':`<button class="btn-primary btn-sm" data-activar-esc="${l(h._id)}">Activar</button>`}
          <button class="btn-secondary btn-sm" data-editar-esc="${l(h._id)}">Editar</button>
          <button class="btn-danger btn-sm" data-borrar-esc="${l(h._id)}">✕</button>
        </div>
      </div>
      ${h.descripcion?`<div class="text-sm mb-8" style="color:var(--text2)">${l(h.descripcion)}</div>`:""}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${C===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${l(P)}</span>`}
      </div>
    </div>`}function x(h){const w=s().dashboardEnd,S=da(d(null).eventos,w);return`
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
        <tbody>${h.map(C=>{const{eventos:P}=d(C),F=C.fechaFin||w,T=da(P,F),_=T!==null&&S!==null?T-S:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${l(C.color||zt[0])};margin-right:6px"></span>
            ${l(C.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${l(F)}</td>
          <td class="num" style="padding:6px 10px">${T!==null?l(z(T)):"—"}</td>
          <td class="num ${_===null?"":_>=0?"pos":"neg"}" style="padding:6px 10px">
            ${_===null?"—":`${_>=0?"+":""}${l(z(_))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function f(){const h=t.store.get("accounts");return h.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${h.map(S=>{const M=a.has(S._id);return`<button data-toggle-cuenta="${l(S._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${M?"var(--border)":"var(--accent)"};
          background:${M?"transparent":"rgba(99,102,241,0.1)"};
          color:${M?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${M?"text-decoration:line-through;":""}">${l(S.nombre)}</button>`}).join("")}
    </div>`}function r(){if(o){try{o.destroy()}catch{}o=null}}function b(h){const w=s(),S=d(null),M=[{label:"Base (sin escenario)",color:"#6b7280",esBase:!0,puntos:la(S.eventos,w.dashboardStart,w.dashboardEnd)}];return h.forEach((C,P)=>{const{eventos:F,horizonte:T}=d(C);M.push({label:C.nombre,color:C.color||zt[P%zt.length],puntos:la(F,w.dashboardStart,T)})}),M}function g(h,w){r();const S=h.querySelector("#chart-comparacion");S&&(o=Yn(S,b(w)))}function $(h){r();const w=new Set(t.store.get("accounts").map(C=>C._id));for(const C of[...a])w.has(C)||a.delete(C);const S=n(),M=s().escenarioActivo||null;h.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Escenarios</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo escenario</button></div>
      </div>

      ${M?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${l(i(M))}</span>
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
             </div>`:`<div>${S.map(C=>c(C,M)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de escenarios</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${f()}</div>
               ${Wn()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${x(S)}</div>`}`,S.length>0&&g(h,S)}const A=()=>document.getElementById("modal-overlay"),u=()=>document.getElementById("modal-content"),m=()=>{var h;return(h=A())==null?void 0:h.classList.add("hidden")};function v(h,w){const S=h?n().find(F=>F._id===h)??null:null,M=A(),C=u();if(!M||!C)return;const P=(S==null?void 0:S.color)||zt[0];C.innerHTML=`
      <div class="modal-title">${h?"Editar escenario":"Nuevo escenario"}</div>
      <div class="form-group"><label class="form-label">Nombre del escenario</label>
        <input class="form-input" type="text" id="esc-nombre" value="${l((S==null?void 0:S.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${l((S==null?void 0:S.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${zt.map(F=>`<div data-color-esc="${F}" style="width:26px;height:26px;border-radius:50%;background:${F};cursor:pointer;
              border:2px solid ${F===P?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${l(P)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${l((S==null?void 0:S.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${l(h??"")}">${h?"Guardar cambios":"Crear escenario"}</button>
      </div>`,M.classList.remove("hidden"),j(C,"[data-cancelar]",m),j(C,"[data-color-esc]",F=>{const T=F.getAttribute("data-color-esc");C.querySelector("#esc-color").value=T;for(const _ of C.querySelectorAll("[data-color-esc]"))_.style.border=_.getAttribute("data-color-esc")===T?"2px solid white":"2px solid transparent"}),j(C,"[data-guardar-esc]",F=>{const T=C.querySelector("#esc-nombre").value.trim();if(!T)return E("El nombre es obligatorio","err");const _={nombre:T,fechaFin:C.querySelector("#esc-fecha-fin").value||null,color:C.querySelector("#esc-color").value||zt[0],descripcion:C.querySelector("#esc-desc").value.trim()},R=F.getAttribute("data-guardar-esc")||"";R?(t.store.updateItem("escenarios",R,_),E("Escenario actualizado")):(t.store.addItem("escenarios",_),E("Escenario creado")),e(),m(),w()})}function I(h,w){if(!tt("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const S=M=>M.map(C=>({...C,escenarioIds:(C.escenarioIds||[]).filter(P=>P!==h)}));t.store.set("loans",S(t.store.get("loans")).map(M=>({...M,amortizaciones:S(M.amortizaciones||[])}))),t.store.set("expenses",S(t.store.get("expenses"))),t.store.set("nominas",S(t.store.get("nominas"))),t.store.set("accounts",S(t.store.get("accounts"))),s().escenarioActivo===h&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",h),E("Escenario eliminado"),e(),w()}function y(h,w){j(h,"[data-nuevo-esc]",()=>v(null,w)),j(h,"[data-editar-esc]",S=>v(S.getAttribute("data-editar-esc"),w)),j(h,"[data-borrar-esc]",S=>I(S.getAttribute("data-borrar-esc"),w)),j(h,"[data-activar-esc]",S=>{const M=S.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:M}),E(`Escenario "${i(M)}" activado`),e(),w()}),j(h,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),E("Volviendo a la realidad base"),e(),w()}),j(h,"[data-toggle-cuenta]",S=>{const M=S.getAttribute("data-toggle-cuenta");a.has(M)?a.delete(M):a.add(M);const C=h.querySelector("#esc-pastillas");C&&(C.innerHTML=f());const P=n(),F=h.querySelector("#esc-comparativa");F&&(F.innerHTML=x(P)),g(h,P)})}return{id:"escenarios",route:"escenarios",nombre:"Escenarios",flagId:"supuestos",seccion:2,iconoPath:Jn,mount(h){const w=()=>$(h);$(h),h.dataset.wired!=="1"&&(y(h,w),h.dataset.wired="1")},unmount(){r()}}}function Ze(t,e,a=!1){const o=Math.abs(At(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function Xn(t){function e(v){return`${v}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(v={}){var y;const I=(y=v.texto)==null?void 0:y.trim().toLowerCase();return t.get("transacciones").filter(h=>!(v.cuentaId&&h.cuentaId!==v.cuentaId||v.desde&&h.fecha<v.desde||v.hasta&&h.fecha>v.hasta||v.tipo&&h.tipo!==v.tipo||v.estimacionId&&h.estimacionId!==v.estimacionId||v.tags&&v.tags.length>0&&!v.tags.some(w=>h.tags.includes(w))||I&&!h.concepto.toLowerCase().includes(I))).sort((h,w)=>h.fecha.localeCompare(w.fecha)||h._id.localeCompare(w._id))}function o(v){const I={_id:e("tx"),fecha:v.fecha,cuentaId:v.cuentaId,importeCts:Ze(v.tipo,v.importe,v.negativo),concepto:v.concepto,tags:v.tags??[],estimacionId:v.estimacionId??null,tipo:v.tipo,origen:v.origen??"manual",...v.nota?{nota:v.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),I]),I}function s(v,I){t.set("transacciones",t.get("transacciones").map(y=>{if(y._id!==v)return y;const{importe:h,...w}=I,S={...y,...w};return h!==void 0&&(S.importeCts=Ze(S.tipo,h,S.importeCts<0)),S}))}function n(v){t.set("transacciones",t.get("transacciones").filter(I=>I._id!==v))}function i(v,I){s(v,{estimacionId:I})}function d(v){return t.get("puntosControl").filter(I=>!v||I.cuentaId===v).sort((I,y)=>I.fecha.localeCompare(y.fecha))}function p(v,I,y,h){const w={_id:e("pc"),fecha:I,cuentaId:v,saldoCts:At(y),...h?{nota:h}:{}},S=t.get("puntosControl").filter(M=>!(M.cuentaId===v&&M.fecha===I));return t.set("puntosControl",[...S,w].sort((M,C)=>M.fecha.localeCompare(C.fecha))),x(v),w}function c(v){const I=t.get("puntosControl").find(y=>y._id===v);t.set("puntosControl",t.get("puntosControl").filter(y=>y._id!==v)),I&&x(I.cuentaId)}function x(v){const I=d(v),y=t.get("accounts");y.some(h=>h._id===v)&&t.set("accounts",y.map(h=>h._id===v?{...h,historicoSaldos:I.map(w=>({_id:w._id,fecha:w.fecha,saldo:et(w.saldoCts),...w.nota?{nota:w.nota}:{}}))}:h))}function f(v,I=V()){const y=d(v).filter(M=>M.fecha<=I).pop(),h=y==null?void 0:y.fecha,w=(y==null?void 0:y.saldoCts)??0;return t.get("transacciones").filter(M=>M.cuentaId===v&&M.fecha<=I&&(h===void 0||M.fecha>h)).reduce((M,C)=>M+C.importeCts,w)}function r(v,I){return et(f(v,I))}function b(v=V(),I){const y=I??t.get("accounts").filter(h=>h.activo).map(h=>h._id);return et(y.reduce((h,w)=>h+f(w,v),0))}function g(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function $(){const v=[...t.get("transacciones").map(I=>I.fecha),...t.get("puntosControl").map(I=>I.fecha)];return v.length>0?v.sort().pop()??null:null}function A(v={}){return et(a(v).reduce((I,y)=>I+y.importeCts,0))}function u(v={}){const I=new Map;for(const y of a(v)){const h=y.fecha.slice(0,7);I.set(h,(I.get(h)??0)+y.importeCts)}return new Map([...I.entries()].sort(([y],[h])=>y.localeCompare(h)).map(([y,h])=>[y,et(h)]))}function m(v={}){const I=new Map;for(const y of a(v))for(const h of y.tags.length>0?y.tags:["sin_tag"])I.set(h,(I.get(h)??0)+y.importeCts);return new Map([...I.entries()].map(([y,h])=>[y,et(h)]))}return{transacciones:a,registrar:o,actualizar:s,eliminar:n,asignarEstimacion:i,puntosControl:d,registrarPuntoControl:p,eliminarPuntoControl:c,saldoCuenta:r,saldoCuentaCts:f,saldoTotal:b,tieneDatos:g,ultimaFecha:$,total:A,totalPorMes:u,totalPorTag:m}}function ht(t){return t.trim().toLowerCase()}function Qn(t){function e(){const c=new Map,x=(f,r)=>{const b=ht(f);if(!b)return;const g=c.get(b)??{tag:b,estimaciones:0,reales:0,total:0};g[r]+=1,g.total+=1,c.set(b,g)};for(const f of t.get("expenses"))for(const r of f.tags??[])x(r,"estimaciones");for(const f of t.get("transacciones"))for(const r of f.tags??[])x(r,"reales");return[...c.values()].sort((f,r)=>r.total-f.total||f.tag.localeCompare(r.tag))}function a(){return e().map(c=>c.tag)}function o(c){return e().filter(x=>c==="estimaciones"?x.reales===0:x.estimaciones===0).map(x=>x.tag)}function s(c,x,f){const r=ht(x),b=(c??[]).map(ht);if(!b.includes(r))return c??[];const g=b.filter($=>$!==r);return f===null?[...new Set(g)]:[...new Set([...g,ht(f)])]}function n(c,x){const f=ht(x);if(!f)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return p(c,f)}function i(c,x){let f=0;for(const r of c)ht(r)!==ht(x)&&(f+=p(r,ht(x)).cambiados);return{cambiados:f}}function d(c){return p(c,null)}function p(c,x){let f=0;const r=t.get("expenses").map(w=>{const S=s(w.tags,c,x);return S!==w.tags&&(f+=1),S===w.tags?w:{...w,tags:S}});t.set("expenses",r);const b=t.get("transacciones").map(w=>{const S=s(w.tags,c,x);return S!==w.tags&&(f+=1),S===w.tags?w:{...w,tags:S}});t.set("transacciones",b);const g=t.get("loans").map(w=>{const S=s(w.tags,c,x);return S!==w.tags&&(f+=1),S===w.tags?w:{...w,tags:S}});t.set("loans",g);const $=t.get("nominas").map(w=>{const S=s(w.tags,c,x);return S!==w.tags&&(f+=1),S===w.tags?w:{...w,tags:S}});t.set("nominas",$);const A=t.get("config"),u=ht(c),m=w=>{const S=(w??[]).map(ht);if(!S.includes(u))return w??[];const M=S.filter(C=>C!==u);return x===null?[...new Set(M)]:[...new Set([...M,x])]},v={},I=m(A.activeTagsFilter),y=m(A.tagCategorias),h=m(A.tagGrupos);return I!==A.activeTagsFilter&&(v.activeTagsFilter=I),y!==A.tagCategorias&&(v.tagCategorias=y),h!==A.tagGrupos&&(v.tagGrupos=h),Object.keys(v).length>0&&t.patchConfig(v),{cambiados:f}}return{uso:e,todas:a,soloEn:o,renombrar:n,fusionar:i,eliminar:d}}function Zn(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function ti(t,e){const a=q(t),o=[];for(let s=1;s<=e;s++){const n=new Date(a.getFullYear(),a.getMonth()-s,1);o.push(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function ai(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function ei(t,e){const{inicio:a,fin:o}=ai(e);return Lt([t],{start:a,end:o}).reduce((n,i)=>n+Math.abs(i.cuantia),0)}function oi(t){function e(s,n={}){var I;const{mesesHistorial:i=12,mesesMedia:d=3,hoy:p=V()}=n,c=t.transacciones({estimacionId:s._id}),f=c.length===0&&(((I=s.tags)==null?void 0:I.length)??0)>0?t.transacciones({tags:s.tags}):c,r=new Map;for(const y of f){const h=y.fecha.slice(0,7);r.set(h,(r.get(h)??0)+Math.abs(y.importeCts)/100)}const b=[];for(const y of ti(p,i)){const h=r.get(y);if(h===void 0)continue;const w=ot(ei(s,y));b.push({mes:y,estimado:w,real:ot(h),desviacion:ot(h-w),precision:Zn(w,h)})}const g=ot(b.reduce((y,h)=>y+h.estimado,0)),$=ot(b.reduce((y,h)=>y+h.real,0)),A=b.reduce((y,h)=>y+Math.abs(h.estimado),0),u=b.length===0?null:A>0?b.reduce((y,h)=>y+h.precision*Math.abs(h.estimado),0)/A:b.reduce((y,h)=>y+h.precision,0)/b.length,m=b.slice(-d),v=m.length>0?ot(m.reduce((y,h)=>y+h.real,0)/m.length):null;return{estimacionId:s._id,concepto:s.concepto,tags:s.tags??[],meses:b,estimadoTotal:g,realTotal:$,desviacionTotal:ot($-g),precision:u,mediaRealReciente:v,infraestimada:$>g}}function a(s,n={}){return s.filter(i=>i.tipo!=="transferencia").map(i=>e(i,n)).sort((i,d)=>i.precision===null&&d.precision===null?i.concepto.localeCompare(d.concepto):i.precision===null?1:d.precision===null?-1:i.precision-d.precision)}function o(s){const n=new Map;for(const i of s)if(i.precision!==null)for(const d of i.tags.length>0?i.tags:["sin_tag"]){const p=n.get(d)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};p.estimado+=i.estimadoTotal,p.real+=i.realTotal,p.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),p.peso+=Math.abs(i.estimadoTotal),p.n+=1,n.set(d,p)}return[...n.entries()].map(([i,d])=>({tag:i,estimadoTotal:ot(d.estimado),realTotal:ot(d.real),desviacionTotal:ot(d.real-d.estimado),precision:d.peso>0?d.pesoPrecision/d.peso:null,estimaciones:d.n})).sort((i,d)=>(i.precision??101)-(d.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}const Ea="financeapp_session",si=["local","dropbox","firebase"];function ni(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!si.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function ii({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now()}={}){const o=()=>t??(typeof localStorage<"u"?localStorage:null);function s(r){const b=o();if(b)try{r?b.setItem(Ea,JSON.stringify(r)):b.removeItem(Ea)}catch{}}function n(){const r=o();if(!r)return null;try{return ni(r.getItem(Ea))}catch{return null}}function i(){const r=n();return r?(a()-r.ultimoUso)/6e4:null}function d(){const r=e();if(!Number.isFinite(r)||r<=0)return!1;const b=i();return b!==null&&b>=r}function p(){const r=n();return r?d()?(s(null),null):r:null}function c(r){const b=a(),g={modo:r.modo,...r.email?{email:r.email}:{},...r.passphrase?{passphrase:r.passphrase}:{},creadaEn:b,ultimoUso:b};return s(g),g}function x(){const r=n();r&&s({...r,ultimoUso:a()})}function f(){s(null)}return{abrir:c,leer:p,tocar:x,cerrar:f,caducada:d,inactividadMinutos:i,get activa(){return p()!==null}}}const to=["pointerdown","keydown","visibilitychange"];function ri({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:s=clearInterval,target:n=typeof document<"u"?document:void 0}){let i=!0;const d=()=>{i&&t.tocar()};for(const x of to)n==null||n.addEventListener(x,d);const p=o(()=>{i&&t.caducada()&&(c(),t.cerrar(),e())},a);function c(){if(i){i=!1,s(p);for(const x of to)n==null||n.removeEventListener(x,d)}}return c}const ci=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}];function ao(){if(typeof localStorage<"u"){const r=is();r.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${r.join(", ")}`)}const t=cs({adapter:ns()}),{applied:e}=t.load();e.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${e.join(", ")} (esquema v${Ht})`);const a=ds(t);Po(r=>a.isEnabled(r));const o=ii({autoLogoutMinutos:()=>{var b,g;const r=(g=(b=globalThis.State)==null?void 0:b.get)==null?void 0:g.call(b,"config");return Number((r==null?void 0:r.autoLogoutMinutos)??t.get("config").autoLogoutMinutos??0)}}),s=Xn(t),n=Qn(t),i=oi(s),d=Is(t),p=gs({isEnabled:r=>a.isEnabled(r)}),c=vs({flags:a,rutasExtra:()=>p.flagPorRuta()}),x=fs({flags:a,onChange:()=>{var r,b;p.attachToShell(),c.apply(),(b=(r=globalThis.Router)==null?void 0:r.rerender)==null||b.call(r)}}),f=()=>{var b,g,$,A,u,m;const r=globalThis;if((g=(b=r.State)==null?void 0:b.load)==null||g.call(b),((A=($=r.Router)==null?void 0:$.current)==null?void 0:A.call($))==="dashboard")try{(m=(u=r.DashboardModule)==null?void 0:u.render)==null||m.call(u)}catch(v){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",v)}};return p.register(Os({store:t,onDatosCambiados:f})),p.register(Qs({store:t,onDatosCambiados:f})),p.register(hn({store:t,onDatosCambiados:f})),p.register(Ln({store:t,ledger:s,mostrarObjetivos:()=>a.isEnabled("goals"),onDatosCambiados:f})),p.register(Ms({ledger:s,tags:n,precision:i,adjuster:d,accounts:()=>t.get("accounts"),estimaciones:()=>t.get("expenses"),onDatosCambiados:f})),p.register(Kn({store:t,onDatosCambiados:f})),p.register(Es({store:t,onDatosCambiados:f})),p.register(Un({store:t})),p.register(zs({store:t,onDatosCambiados:f})),{version:Ht,core:bo,engine:{generarExtracto:kt,recomputarSaldoAcum:xo,saldoHoy:$o,sumarPorTags:ue,providers:{proyectarGastos:Lt,proyectarPrestamos:ee,proyectarTransferencias:oe,proyectarNominas:re,proyectarInteresesCuentas:ne,proyectarAportaciones:se,proyectarRetencionesFiscales:ie,proyectarInflacionGastos:ce,proyectarPerdidaAhorro:le},analysis:So,margins:zo,optimizer:To,dashboard:Go},store:t,flags:a,featureRegistry:{all:It,porGrupo:Fe},ui:{openFeatures:x.open,applyGating:c.apply,watchGating:()=>c.observar()},app:p,session:Object.assign(o,{vigilar:r=>ri({sesion:o,onCaducada:r}),opciones:ci}),accounting:{ledger:s,tags:n,precision:i,adjuster:d,sugerirAjuste:De}}}function li(){try{const t=ao();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const sa=typeof window<"u"?li():null;if(sa){let t=!1;const e=()=>{sa.app.attachToShell(),sa.ui.applyGating(),t||(t=!0,sa.ui.watchGating())};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",a=>{const o=a.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(e,0)})}return yt.bootstrap=ao,Object.defineProperty(yt,Symbol.toStringTag,{value:"Module"}),yt}({});
//# sourceMappingURL=financeapp-core.js.map

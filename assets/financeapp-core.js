var FinanceAppBundle=function(At){"use strict";var Qc=Object.defineProperty;var Xc=(At,V,G)=>V in At?Qc(At,V,{enumerable:!0,configurable:!0,writable:!0,value:G}):At[V]=G;var Fn=(At,V,G)=>Xc(At,typeof V!="symbol"?V+"":V,G);function V(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function G(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function Y(){return V(new Date)}function Te(t,e){return new Date(t,e+1,0).getDate()}function Sa(t,e,a){return V(new Date(t,e,Math.min(a,Te(t,e))))}function ye(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return V(new Date(t,e+1,0));const n=parseInt(o);if(!isNaN(n))return Sa(t,e,n)}if(a.startsWith("nthweekday:")){const o=a.split(":"),n=parseInt(o[1]),s=parseInt(o[2]);if(n===-1){const r=new Date(t,e+1,0);for(;r.getDay()!==s;)r.setDate(r.getDate()-1);return V(r)}const i=new Date(t,e,1);for(;i.getDay()!==s;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(n-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),V(i)}return null}function Ma(t,e){if(!e)return t;const a=G(t);return ye(a.getFullYear(),a.getMonth(),e)??t}const Pn=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],Dn={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function Ne(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${Dn[a]||a+"º"} ${Pn[o]} del mes`}return t}function Zt(t,e){const a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((o-a)/864e5)}function wt(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function et(t){return t/100}function W(t){return et(wt(t))}function j(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function Ca(t){return(t||0).toFixed(2)+"%"}function kt(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function Ea(t,e,a,o=0){const n=kt(t,e,a),s=t*(1-o/100);let i=e/100/12;for(let r=0;r<200;r++){const u=n*(1-Math.pow(1+i,-a))/i-s,f=n*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),c=i-u/f;if(Math.abs(c-i)<1e-10){i=c;break}i=c}return(Math.pow(1+i,12)-1)*100}function ja(t,e,a,o,n=0,s=[],i={}){const r=[];let l=t;const u=G(o),f=e/100/12;let c=a,m=kt(l,e,c);const v=[...s].sort((I,A)=>I.fecha.localeCompare(A.fecha));let h=0;for(let I=1;I<=a*2&&l>.01;I++){const A=new Date(u);u.setMonth(u.getMonth()+1);const y=Ma(V(A),i.diaPago||"");for(;h<v.length&&v[h].fecha<=y;){const x=v[h],p=x.cantidad*(n/100);if(l-=x.cantidad,l=Math.max(0,l),x.tipo==="plazo"?c=Math.ceil(-Math.log(1-l*f/m)/Math.log(1+f)):(c=a-I+1,m=kt(l,e,c)),r.push({mes:"AMORT",fecha:x.fecha,cuota:0,interes:0,amortizacion:x.cantidad,comisionAmort:p,capitalPendiente:l,esAmortizacion:!0,simulacion:x.simulacion||!1}),h++,l<.01)break}if(l<.01)break;const $=l*f,b=Math.min(m-$,l);if(l-=b,l<.01&&(l=0),r.push({mes:I,fecha:y,cuota:m,interes:$,amortizacion:b,comisionAmort:0,capitalPendiente:l,esAmortizacion:!1,simulacion:!1}),c--,c<=0||l<.01)break}return r}const _a=new Map;function at(t){var A;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((y,$)=>`${y.fecha}|${y.cantidad}|${y.tipo||""}`.localeCompare(`${$.fecha}|${$.cantidad}|${$.tipo||""}`)).map(y=>`${y.fecha}:${y.cantidad}:${y.tipo||""}`).join(";")}`,o=_a.get(a);if(o)return o;const{capital:n,tin:s,meses:i,fechaInicio:r,comisionAmort:l,comisionApertura:u}=t,f=ja(n,s,i,r,l||0,e,t),c=f.reduce((y,$)=>y+$.interes,0),m=f.reduce((y,$)=>y+$.comisionAmort,0),v=n*((u||0)/100),h=f.filter(y=>!y.esAmortizacion),I={cuota:kt(n,s,i),totalIntereses:c,tae:Ea(n,s,i,u||0),costoTotal:c+m+v,comAp:v,totalComAm:m,fechaFin:((A=h.slice(-1)[0])==null?void 0:A.fecha)||"",mesesReales:h.length,tabla:f};return _a.set(a,I),I}function za(t){const e=at(t),a=at({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,n=a.mesesReales-e.mesesReales,s=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:n,costeTotalAmort:s,ahorroNeto:o-s,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function pt(t,e,a){if(!t||t.length===0)return 1;const o=G(e),n=G(a);if(n<=o)return 1;const s=[...t].sort((l,u)=>l.year-u.year);let i=1,r=new Date(o);for(;r<n;){const l=r.getFullYear(),u=s.filter(I=>I.year<=l),f=u.length>0?u[u.length-1]:s[0],c=(f?f.tasa:0)/100,m=new Date(l+1,0,1),v=m<n?m:n,h=Zt(r,v);i*=Math.pow(1+c,h/365.25),r=v}return i}function Fa(t,e,a,o=0){const n=G(e),s=G(a);if(s<=n)return o;const i=Zt(n,s),r=t?[...t].sort((f,c)=>f.year-c.year):[];let l=0,u=new Date(n);for(;u<s;){const f=u.getFullYear(),c=new Date(f+1,0,1),m=c<s?c:s,v=Zt(u,m),h=r.filter(y=>y.year<=f),I=h.length>0?h[h.length-1]:null,A=I!==null?I.tasa:o;l+=A*v,u=m}return i>0?l/i:o}function Pa(t,e){return((1+t/100)/(1+e/100)-1)*100}function Tn(t,e,a,o){const n=pt(e,a,o);return n>0?t/n:t}function Nn(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,n=e.saludUmbralDTIVerde??30,s=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],r=e.saludExcluirHipoteca||!1,{ingresos:l=0,cuotas:u=0,cuotasHipoteca:f=0,gastosBasicos:c=0,gastosOtros:m=0,amortizaciones:v=0}=t,h=l-u-v-c-m,I=h,A=l>0?I/l*100:null,y=r?u-f:u,$=l>0?y/l*100:null,b=l>0?u/l*100:null,x=l>0?(c+u+v)/l*100:null,p=l>0?m/l*100:null,g=(S,E,_)=>S===null?"neutral":S>=E?"verde":S>=_?"amarillo":"rojo",w=(S,E,_)=>S===null?"neutral":S<=E?"verde":S<=_?"amarillo":"rojo";return{ingresos:l,cuotas:u,cuotasHipoteca:f,gastosBasicos:c,gastosOtros:m,amortizaciones:v,ahorroBruto:h,ahorroReal:I,tasaAhorro:A,dti:$,dtiTotal:b,excluyeHipoteca:r,pctNecesidades:x,pctDeseos:p,semAhorro:g(A,a,o),semDTI:w($,n,s),semNecesidades:w(x,i[0],i[0]+15),semDeseos:w(p,i[1],i[1]+10),semAhorroRegla:g(A,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:n,umbralDTIAmarillo:s,regla:i}}function mt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function rt(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function te(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];a&&o.push({fecha:a,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,i)=>{s.fecha>=a&&o.push({...s,prioridad:i})}),o.sort((s,i)=>i.fecha.localeCompare(s.fecha)||i.prioridad-s.prioridad);const n=o.find(s=>s.fecha<=e);return n?n.saldo:t.saldoInicial||0}else{const n=[...t.historicoSaldos||[]].sort((s,i)=>i.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=e);return n?n.saldo:0}}function Oe(t,e){const a=t.cuentaIds&&t.cuentaIds.length>0?t.cuentaIds:null;return a?e.filter(o=>a.includes(o._id)):e.filter(o=>o.activo&&!o.simulacion)}function Da(t,e,a=0){const o=Oe(t,e).reduce((n,s)=>n+rt(s),0);return t.usarColchon!==!1?Math.max(0,o-a):o}function On(t,e,a){if(!t.targetAmount||t.targetAmount<=0)return null;const o=Oe(t,e);if(o.length===0)return null;const n=a.hoy??new Date,s=a.horizonteMeses??120,i=t.usarColchon!==!1,r=o.map(l=>({acc:l,eventos:a.extractoCuenta(l),cursor:0,saldo:rt(l)}));for(let l=1;l<=s;l++){const u=new Date(n.getFullYear(),n.getMonth()+l,1),f=`${u.getFullYear()}-${String(u.getMonth()+1).padStart(2,"0")}`,c=V(new Date(u.getFullYear(),u.getMonth()+1,0));let m=0;for(const h of r){for(;h.cursor<h.eventos.length&&h.eventos[h.cursor].fecha<=c;)h.saldo=h.eventos[h.cursor].saldoAcum??h.saldo,h.cursor++;m+=h.saldo}const v=i?a.colchonEnFecha(c):0;if(m-v>=t.targetAmount)return f}return null}function Ta(t,e){const a=t.escenarioIds||[];return a.length===0?!0:!!e&&a.includes(e)}function Na(t,e){const a=o=>Ta(o,e);return{loans:t.loans.filter(a).map(o=>({...o,amortizaciones:(o.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}const Re=t=>t.slice(0,7);function Rn(t){const[e,a]=t.split("-").map(Number);return`${a===12?e+1:e}-${String(a===12?1:a+1).padStart(2,"0")}`}function qe(t,e,a){if(t.length===0)return[];const o=new Map;for(const u of t)u.saldoAcum!==void 0&&o.set(Re(u.fecha),u.saldoAcum);const n=t[0];let s=(n.saldoAcum??0)-(n.delta??0);const i=Re(e||n.fecha),r=Re(a||t[t.length-1].fecha);if(r<i)return[];const l=[];for(let u=i;u<=r;u=Rn(u)){const f=o.get(u);f!==void 0&&(s=f);const[c,m]=u.split("-").map(Number);l.push({x:G(V(new Date(c,m-1,15))).getTime(),mes:u,y:s})}return l}function Le(t,e){let a=null;for(const o of t){if(o.fecha>e)break;o.saldoAcum!==void 0&&(a=o.saldoAcum)}return a}function qn(t){const e=a=>!a.simulacion;return{loans:t.loans.filter(e).map(a=>({...a,amortizaciones:(a.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}function Ln(t){const e=a=>!!a.simulacion;return t.loans.some(a=>e(a)||(a.amortizaciones||[]).some(e))||t.expenses.some(e)||t.nominas.some(e)||t.accounts.some(e)}const bt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function ut(t,e){const a=[...e].sort((s,i)=>s[0]-i[0]);let o=0,n=t;for(let s=a.length-1;s>=0;s--){const[i,r]=a[s];n<=i||(o+=(n-i)*(r/100),n=i)}return o}function Be(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,n=Math.min(2e3,a),s=Math.max(0,a-o-n),i=s<=15876?7302:s<=21622?Math.max(0,7302-1.75*(s-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:n,RNT:s,reducArt20:i,baseImponible:Math.max(0,s-i)}}function Ct(t,e){return Be(t,e).baseImponible}function Oa(t,e){return ut(t,e)/12}const Ft=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function ke(t,e){if(!t||t<=0)return 0;const a=e||Ft;let o=0,n=t;for(let s=0;s<a.length;s++){const[i,r]=a[s],l=s<a.length-1?a[s+1][0]:1/0,u=Math.min(n,l-i);if(!(u<=0)&&(o+=u*(r/100),n-=u,n<=0))break}return o}function Ht(t,e){if(mt(t)!=="inversion")return null;const a=rt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,n=Math.max(0,a-o),s=ke(n,e);return{saldo:a,costBase:o,plusvalia:n,impuesto:s,neto:a-s}}function xe(t,e=new Date){var m;if(mt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=rt(t),n=V(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),s=[...t.aportaciones||[]].sort((v,h)=>v.fecha.localeCompare(h.fecha));let i=0;const r=s.reduce((v,h)=>v+h.cantidad,0);for(const v of s)v.fecha<=n&&(i+=v.cantidad);const l=Math.max(0,o-r),u=r>0?i/r:0,f=Math.min(o,i+l*u),c=Math.max(0,o-f);return{saldo:o,disponible:f,bloqueado:c,costBase:r,beneficio:l,numAportaciones:s.length,proxDesbloqueo:((m=s.find(v=>v.fecha>n))==null?void 0:m.fecha)||null}}function Ra(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(mt(t)!=="pension"||!o)return 0;const n=rt(t);if(n<=0)return 0;const s=(t.aportaciones||[]).reduce((u,f)=>u+f.cantidad,0),i=Math.max(0,n-s);if(i<=0)return 0;const r=i/n;return+(e*r*o/100).toFixed(2)}function He(t,e,a){var l;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const s=(e||[]).filter(u=>(u.grupoNomina||"")===o&&u.activo!==!1).reduce((u,f)=>u+(f.bruto||0)*(f.nPagas||12),0),i=[...a||[]].sort((u,f)=>u[0]-f[0]);let r=((l=i[0])==null?void 0:l[1])||19;for(const[u,f]of i)if(s>=u)r=f;else break;return r}const Ge=6.35;function Pt(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function qa(t){return Math.max(0,(t.bruto||0)-Pt(t))}function Bn(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function kn(t){const e=t.reduce((i,r)=>i+(r.bruto||0),0),a=t.reduce((i,r)=>i+Pt(r),0),o=Math.max(0,e-a),n=Ct(e,a),s=new Map;for(const i of t)s.set(i._id,o>0?n*(qa(i)/o):0);return s}function Ve(t,e,a){if(t.irpfModo==="manual")return qa(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return ut(Ct(t.bruto||0,Pt(t)),a);const o=Bn(e.filter(i=>i.irpfModo!=="manual")),n=kn(e);let s=0;for(const i of o){const r=n.get(i._id)??0;if(i._id===t._id)return ut(s+r,a)-ut(s,a);s+=r}return ut(Ct(t.bruto||0,Pt(t)),a)}function Hn(t,e){return t.reduce((a,o)=>a+Ve(o,t,e),0)}function Gn(t,e){var n;const a=[...e||[]].sort((s,i)=>s[0]-i[0]);let o=((n=a[0])==null?void 0:n[1])??19;for(const[s,i]of a)if(t>=s)o=i;else break;return o}function La(t,e){if(!t||t.length===0)return 0;const a=t.reduce((n,s)=>n+(s.bruto||0),0),o=t.reduce((n,s)=>n+Pt(s),0);return Gn(Ct(a,o),e)}function Ue(t,e,a){const o=t.bruto||0,n=Pt(t),s=Math.max(0,o-n),i=t.nPagas||12,r=t.ssPct??Ge,l=s*(r/100),u=Ve(t,e,a);return{brutoAnual:o,flexAnual:n,baseDineraria:s,nPagas:i,ssPct:r,ssAnual:l,irpfAnual:u,irpfPct:s>0?u/s*100:0,netoPorPaga:(s-l-u)/i}}function Vn(t){const e=new Map,a=[];for(const o of t){const n=o.grupoNomina||"";if(!n){a.push(o);continue}const s=e.get(n)??[];s.push(o),e.set(n,s)}return{grupos:e,sueltas:a}}const Dt=1500;function Ba(t){const e=t.cuantia||0,a=Math.max(1,t.frecuencia||1);return t.tipoFrecuencia==="mensual"?e*12/a:t.tipoFrecuencia==="diaria"?e*365.25/a:e}const ee=t=>{const e=typeof t=="number"?t:parseFloat(String(t??""));return Number.isFinite(e)?e:0};function Un(t,e){const a=t.grupoNomina||"";return a?e.filter(o=>(o.grupoNomina||"")===a):null}function ka(t,e){return t.reduce((a,o)=>a+Ve(o,Un(o,t),e),0)}function Ha(t){const{nominas:e,tramosGeneral:a,tramosAhorro:o}=t,n=t.extras??{},s=e.reduce((S,E)=>S+(E.bruto||0),0),i=e.reduce((S,E)=>S+Pt(E),0),r=Be(s,i),l=t.aportacionesPension,u=Dt,f=Math.min(l,u),c=Math.max(0,r.RNT-r.reducArt20-f),m=ee(n.capInmobiliario),v=ee(n.capMobiliario),h=ee(n.gananciasFondos),I=ee(n.otrasCorto),A=ee(n.retCapital),y=Math.max(0,c+t.otrosIngresos+m+I),$=Math.max(0,v+h),b=ut(y,a),x=ut($,o),p=b+x,g=ka(e,a),w=g+A;return{brutoTotal:s,flexTotal:i,brutoIRPF:r.baseIRPF,cotizSS:r.cotizSS,gastosArt19:r.gastosArt19,RNT:r.RNT,reducArt20:r.reducArt20,aportPP:l,limPP:u,deducPP:f,RNTred:c,otrosIngresos:t.otrosIngresos,capInmobiliario:m,capMobiliario:v,gananciasFondos:h,otrasCorto:I,baseGeneral:y,baseAhorro:$,cuotaGen:b,cuotaAho:x,cuotaIntegra:p,retNomina:g,retCapital:A,totalRet:w,resultado:p-w}}const Yn=Object.freeze(Object.defineProperty({__proto__:null,LIMITE_APORTACION_PENSION:Dt,TRAMOS_AHORRO_DEFAULT:Ft,TRAMOS_IRPF_DEFAULT:bt,ajustarFechaPago:Ma,ajustarPrecioReal:Tn,calcBaseImponibleTrabajo:Ct,calcFactorInflacion:pt,calcFondoInversion:Ht,calcFondosPension:xe,calcGananciasCapital:ke,calcIRPF:ut,calcImpuestoPension:Ra,calcInflacionMediaAnual:Fa,calcSaludFinanciera:Nn,calcTAE:Ea,calcTipoMarginalPension:He,calcTipoRealFisher:Pa,calcularDeclaracion:Ha,clampedDate:Sa,cuentasDelObjetivo:Oe,cuotaMensual:kt,desgloseBaseTrabajo:Be,diasEntre:Zt,filtrarPorEscenario:Na,formatEUR:j,formatLocalDate:V,formatPct:Ca,fromCents:et,haySimulaciones:Ln,ingresoAnual:Ba,labelDiaPago:Ne,lastDayOfMonth:Te,modeloFondoDe:mt,parseLocalDate:G,proyectarFechaCumplimiento:On,resolverDiaEfectivo:ye,resumenPrestamo:at,resumenPrestamoConAhorro:za,retencionMensual:Oa,retencionesNomina:ka,roundMoney:W,saldoEnFecha:te,saldoEnFechaExtracto:Le,saldoParaObjetivo:Da,saldoRealCuenta:rt,serieMensual:qe,sinSimulaciones:qn,tablaAmortizacion:ja,toCents:wt,todayISO:Y,visibleEnEscenario:Ta},Symbol.toStringTag,{value:"Module"}));function ae(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const r=G(i.fechaInicio||e.start),l=i.fechaFin?G(i.fechaFin):s,u=i.cuantia,f=c=>o.push({fecha:c,concepto:i.concepto,cuantia:u,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=n&&r<=s&&r<=l&&f(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const c=Math.max(1,i.frecuencia||1);let m=r.getFullYear(),v=r.getMonth();const h=Math.ceil(240/c)+2;for(let I=0;I<h;I++){const A=ye(m,v,i.diaPago||"")||(()=>{const $=r.getDate(),b=new Date(m,v+1,0).getDate();return V(new Date(m,v,Math.min($,b)))})(),y=G(A);if(y>s||y>l)break;y>=n&&y>=r&&f(A),v+=c,v>=12&&(m+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const c=Math.max(1,i.frecuencia||1)*864e5;let m=new Date(Math.max(r.getTime(),n.getTime()));if(r<n){const v=Math.ceil((n.getTime()-r.getTime())/c);m=new Date(r.getTime()+v*c)}for(;m<=s&&m<=l;)f(V(m)),m=new Date(m.getTime()+c)}}return o}function Ga(t,e,a=null){const o=[];for(const n of t){if(!n.activo||a&&a.length>0&&!a.includes(n.cuenta||"default"))continue;const{tabla:s}=at(n);for(const i of s)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${n.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${n.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...n.tags||[]],cuenta:n.cuenta||"default",sourceId:n._id,sourceType:"loan",simulacion:n.simulacion||!1}))}return o}function Va(t,e,a=null,o={accounts:[]}){const n=[],s=G(e.start),i=G(e.end),r=o.accounts||[],l=o.nominas||[],u=o.resolverTramosIRPF||(()=>bt),f=o.resolverTramosGanancias||(()=>Ft),c=m=>{var v;return((v=r.find(h=>h._id===m))==null?void 0:v.nombre)??m};for(const m of t){if(!m.activo||m.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(m.cuenta||"default")||a.includes(m.cuentaDestino||"default")))continue;const v=G(m.fechaInicio||e.start),h=m.fechaFin?G(m.fechaFin):i,I=A=>{const y=r.find(P=>P._id===(m.cuenta||"default")),$=r.find(P=>P._id===(m.cuentaDestino||"default")),b=mt(y),x=mt($),p=b==="inversion"&&x==="inversion"||b==="pension"&&x==="pension",g=["transferencia",...p?["traspaso"]:[],...m.tags||[]],w=p?"traspaso-out":"transfer-out",S=p?"traspaso-in":"transfer-in",E=!a||a.length===0||a.includes(m.cuenta||"default"),_=!a||a.length===0||a.includes(m.cuentaDestino||"default");if(E&&n.push({fecha:A,concepto:`Transf. → ${c(m.cuentaDestino||"default")}: ${m.concepto}`,cuantia:m.cuantia,tipo:"gasto",tags:g,cuenta:m.cuenta||"default",sourceId:m._id,sourceType:w}),_&&n.push({fecha:A,concepto:`Transf. ← ${c(m.cuenta||"default")}: ${m.concepto}`,cuantia:m.cuantia,tipo:"ingreso",tags:g,cuenta:m.cuentaDestino||"default",sourceId:m._id,sourceType:S}),E&&!p&&y){if(b==="inversion"){const P=parseInt(A.slice(0,4)),C=Ht(y,f(P));if(C&&C.saldo>0&&C.plusvalia>0){const M=Math.min(1,m.cuantia/C.saldo),F=C.plusvalia*M*.19;F>.01&&n.push({fecha:A,concepto:`Retención IRPF reembolso ${y.nombre} (19% s/plusvalía)`,cuantia:F,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:m.cuenta||"default",sourceId:m._id,sourceType:"investment-tax"})}}else if(b==="pension"){const P=u(parseInt(A.slice(0,4))),C=He(y,l,P),M=Ra(y,m.cuantia,C||void 0);if(M>0){const z=y.grupoNomina?`IRPF rescate ${y.nombre} (tipo marginal grupo "${y.grupoNomina}": ${C}%)`:`Retención rescate ${y.nombre} (${y.impuestoRetirada}% s/beneficio)`;n.push({fecha:A,concepto:z,cuantia:M,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:m.cuenta||"default",sourceId:m._id,sourceType:"pension-tax"})}}}};if(m.tipoFrecuencia==="extraordinario")v>=s&&v<=i&&v<=h&&I(m.fechaInicio);else if(m.tipoFrecuencia==="mensual"){const A=Math.max(1,m.frecuencia||1);let y=v.getFullYear(),$=v.getMonth();const b=Math.ceil(240/A)+2;for(let x=0;x<b;x++){const p=ye(y,$,m.diaPago||"")||(()=>{const w=v.getDate(),S=new Date(y,$+1,0).getDate();return V(new Date(y,$,Math.min(w,S)))})(),g=G(p);if(g>i||g>h)break;g>=s&&g>=v&&I(p),$+=A,$>=12&&(y+=Math.floor($/12),$=$%12)}}else if(m.tipoFrecuencia==="diaria"){const A=Math.max(1,m.frecuencia||1)*864e5;let y=new Date(Math.max(v.getTime(),s.getTime()));if(v<s){const $=Math.ceil((s.getTime()-v.getTime())/A);y=new Date(v.getTime()+$*A)}for(;y<=i&&y<=h;)I(V(y)),y=new Date(y.getTime()+A)}}return n}function Ua(t,e,a=null){const o=[],n=G(e.start),s=G(e.end);for(const i of t){const r=mt(i);if(r==="cuenta"||!i.activo)continue;const l=i.planAportaciones||[];for(const u of l){if(!u.importe||u.importe<=0)continue;const f=G(u.fechaInicio||e.start),c=u.fechaFin?G(u.fechaFin):s,m=u.cuentaOrigen||"default",v=!a||!a.length||a.includes(m),h=!a||!a.length||a.includes(i._id),I=r==="pension"?"pension":"capital-mobiliario",A=p=>{v&&o.push({fecha:p,concepto:`Aportación → ${i.nombre}`,cuantia:u.importe,tipo:"gasto",tags:["aportacion","transferencia",I],cuenta:m,sourceId:u._id,sourceType:"aportacion-out"}),h&&o.push({fecha:p,concepto:`Aportación ${i.nombre} (${u.periodicidad||"mensual"})`,cuantia:u.importe,tipo:"ingreso",tags:["aportacion","transferencia",I],cuenta:i._id,sourceId:u._id,sourceType:"aportacion-in"})},y={mensual:1,trimestral:3,semestral:6,anual:12}[u.periodicidad||"mensual"]||1;let $=f.getFullYear(),b=f.getMonth();const x=Math.ceil(240/y)+2;for(let p=0;p<x;p++){const g=new Date($,b+1,0).getDate(),w=V(new Date($,b,Math.min(f.getDate(),g))),S=G(w);if(S>s||S>c)break;S>=n&&S>=f&&A(w),b+=y,b>=12&&($+=Math.floor(b/12),b=b%12)}}}return o}function Ya(t,e,a=null,o=[]){const n=[];for(const s of t){if(!s.activo||!s.interes||s.interes<=0||a&&a.length>0&&!a.includes(s._id))continue;const i=G(e.start),r=G(e.end),l=s.periodoCobro||"mensual",u=l==="mensual",f=u?null:{diario:864e5,semanal:7*864e5}[l]||864e5,c=u?1/12:f/(365.25*864e5);let m=te(s,e.start);const v=o.filter(A=>A.cuenta===s._id).map(A=>({fecha:A.fecha,delta:A.tipo==="ingreso"?Math.abs(A.cuantia):-Math.abs(A.cuantia)})).sort((A,y)=>A.fecha.localeCompare(y.fecha));let h=0,I=new Date(i);for(;I<=r;){const A=u?new Date(I.getFullYear(),I.getMonth()+1,I.getDate()):new Date(I.getTime()+f),y=new Date(Math.min(A.getTime(),r.getTime()+1)),$=V(y);let b=0;for(;h<v.length&&v[h].fecha<$;)b+=v[h].delta,h++;const x=m,p=m+b,g=Math.max(0,(x+p)/2);m=p;const w=u?c:(y.getTime()-I.getTime())/(365.25*864e5),S=g*(Math.pow(1+s.interes/100,w)-1);S>.001&&n.push({fecha:V(I),concepto:`Interés ${s.nombre}`,cuantia:S,tipo:"ingreso",tags:["interes","cuenta"],cuenta:s._id,sourceId:s._id,sourceType:"account-interest"}),I=A}}return n}function Ja(t,e,a,o=null){const n=[],s=e||bt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),l=Oa(r,s),u={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:l,tags:["irpf","fiscal"]};n.push(...ae([u],a,o))}return n}const Jn=[5,11,2,8],Wn={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function Wa(t,e,a=null,o=[],n=()=>bt){const s=[],i=G(e.start),r=G(e.end),l=o.length>0,u={};for(const m of t){const v=m.grupoNomina||"";u[v]||(u[v]=[]),u[v].push(m)}for(const m of Object.keys(u))u[m].sort((v,h)=>(h.bruto||0)-(v.bruto||0));function f(m,v){if(!l||!m.mesActualizacionIPC)return m.bruto||0;const h=m.fechaInicio||e.start,I=G(h),A=G(v);let y=0;for(let b=I.getFullYear();b<=A.getFullYear();b++){const x=new Date(b,m.mesActualizacionIPC-1,1);x>I&&x<=A&&y++}if(y===0)return m.bruto||0;const $=V(new Date(I.getFullYear()+y,0,1));return(m.bruto||0)*pt(o,h,$)}function c(m,v){const h=f(m,v),I=(m.retribucionFlexible||[]).reduce((P,C)=>P+(C.importe||0)*12,0),A=Math.max(0,h-I);if(m.irpfModo==="manual")return A*((m.irpfPct||0)/100);const y=n(parseInt(v.slice(0,4))),$=m.grupoNomina||"";if(!$)return ut(Ct(h,I),y);const b=u[$].filter(P=>P.activo),x=b.reduce((P,C)=>P+f(C,v),0),p=b.reduce((P,C)=>P+(C.retribucionFlexible||[]).reduce((M,z)=>M+(z.importe||0)*12,0),0),g=Math.max(0,x-p),w=Ct(x,p),S=Math.max(0,h-I),E=g>0?w*(S/g):0,_=b.filter(P=>P._id!==m._id&&(P.bruto||0)>(m.bruto||0)).reduce((P,C)=>{const M=(C.retribucionFlexible||[]).reduce((F,T)=>F+(T.importe||0)*12,0),z=Math.max(0,f(C,v)-M);return P+(g>0?w*(z/g):0)},0);return ut(_+E,y)-ut(_,y)}for(const m of t){if(!m.activo)continue;const v=m.cuenta||"default";if(a&&a.length>0&&!a.includes(v))continue;const h=Math.max(1,m.nPagas||12),I=G(m.fechaInicio||e.start),A=m.fechaFin?G(m.fechaFin):r,y=$=>{const b=f(m,$),x=c(m,$),p=(m.retribucionFlexible||[]).reduce((M,z)=>M+(z.importe||0)*12,0),g=Math.max(0,b-p),w=(m.ssPct??6.35)/100,S=g*w,E=g/h,_=x/h,P=S/h,C=m.representacion==="simplificado"?E-P-_:E;s.push({fecha:$,concepto:m.nombre,cuantia:C,tipo:"ingreso",cuenta:v,tags:m.tags||[],sourceId:m._id,sourceType:"nomina"}),m.representacion==="detallado"&&(P>0&&s.push({fecha:$,concepto:`SS ${m.nombre}`,cuantia:P,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:m._id+"_ss",sourceType:"nomina"}),_>0&&s.push({fecha:$,concepto:`IRPF ${m.nombre}`,cuantia:_,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:m._id+"_irpf",sourceType:"nomina"}));for(const M of m.retribucionFlexible||[])!M.cuenta||!(M.importe>0)||a&&a.length>0&&!a.includes(M.cuenta)||s.push({fecha:$,concepto:`${m.nombre} — ${Wn[M.tipo]||M.tipo}`,cuantia:M.importe,tipo:"ingreso",cuenta:M.cuenta,tags:["retribucion-flexible",M.tipo],sourceId:`${m._id}_flex_${M._id||M.tipo}`,sourceType:"nomina"})};if(h<=12){const $=h===12?1:Math.round(12/h),b=I.getDate();let x=I.getFullYear(),p=I.getMonth();for(let g=0;g<300;g++){const w=new Date(x,p+1,0).getDate(),S=new Date(x,p,Math.min(b,w));if(S>r||S>A)break;S>=i&&S>=I&&y(V(S)),p+=$,p>=12&&(x+=Math.floor(p/12),p=p%12)}}else{const $=h-12,b=I.getDate();let x=I.getFullYear(),p=I.getMonth();for(let S=0;S<300;S++){const E=new Date(x,p+1,0).getDate(),_=new Date(x,p,Math.min(b,E));if(_>r||_>A)break;_>=i&&_>=I&&y(V(_)),p++,p>=12&&(x++,p=0)}const g=Math.max(I.getFullYear(),i.getFullYear()),w=Math.min((m.fechaFin?A:r).getFullYear(),r.getFullYear());for(let S=g;S<=w;S++)for(const E of Jn.slice(0,$)){const _=new Date(S,E,15);_>=i&&_<=r&&_>=I&&_<=A&&y(V(_))}}}return s}function Ka(t,e,a,o=null,n="default"){const s=[];if(!e||e.length===0)return s;const i=G(a.start),r=G(a.end),l=Y(),u=t.filter(c=>c.activo&&c.tipo==="gasto"&&c.tipoFrecuencia==="mensual");let f=new Date(i.getFullYear(),i.getMonth(),1);for(;f<=r;){const c=f.getFullYear(),m=f.getMonth(),v=c+"-"+String(m+1).padStart(2,"0"),h=v+"-01",I=V(new Date(c,m+1,0)),A=V(new Date(c,m,15));let y=0;for(const $ of u){if(o&&o.length>0&&!o.includes($.cuenta||"default")||$.fechaInicio&&$.fechaInicio>I||$.fechaFin&&$.fechaFin<h)continue;const b=$.fechaInicio||l,x=pt(e,b,A);if(x<=1)continue;const p=Math.max(1,$.frecuencia||1);y+=$.cuantia*(x-1)/p}y>.01&&s.push({fecha:A,concepto:"Incremento coste de vida",cuantia:y,tipo:"gasto",tags:["inflacion"],cuenta:n,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),f=new Date(c,m+1,1)}return s}function Qa(t,e,a,o="default"){const n=[];if(!e||e.length===0||t<=0)return n;const s=G(a.start),i=G(a.end),r=[...e].sort((u,f)=>u.year-f.year);let l=new Date(s.getFullYear(),s.getMonth(),1);for(;l<=i;){const u=l.getFullYear(),f=l.getMonth(),c=u+"-"+String(f+1).padStart(2,"0"),m=V(new Date(u,f,15)),v=r.filter($=>$.year<=u),h=v.length>0?v[v.length-1]:r[0],I=h?h.tasa/100:0,A=Math.pow(1+I,1/12)-1,y=t*A;y>.01&&n.push({fecha:m,concepto:"Pérdida ahorro por inflación",cuantia:y,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+c,sourceType:"inflacion"}),l=new Date(u,f+1,1)}return n}function Xa(t,e,a){const o=a.fechaReferencia||a.dashboardStart,n=o<a.dashboardStart?a.dashboardStart:o>a.dashboardEnd?a.dashboardEnd:o,s=e.reduce((c,m)=>c+te(m,n),0),i=t.filter(c=>c.fecha<n),r=t.filter(c=>c.fecha>=n),l=[];let u=s;for(const c of[...i].reverse()){const m=c.tipo==="ingreso"?Math.abs(c.cuantia):-Math.abs(c.cuantia);l.unshift({...c,delta:m,saldoAcum:u}),u-=m}const f=[];u=s;for(const c of r){const m=c.tipo==="ingreso"?Math.abs(c.cuantia):-Math.abs(c.cuantia);u+=m,f.push({...c,delta:m,saldoAcum:u})}return[...l,...f]}function Kn(t,e,a,o=null){const n=e.filter(s=>s.activo&&(!o||o.length===0||o.includes(s._id)));return Xa([...t].sort((s,i)=>s.fecha.localeCompare(i.fecha)),n,a)}function oe(t){const{loans:e,expenses:a,accounts:o,config:n}=t,s=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],l={start:n.dashboardStart,end:n.dashboardEnd},u=a.filter(I=>I.tipo!=="transferencia"),f=a.filter(I=>I.tipo==="transferencia"),c={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let m=[];m=m.concat(ae(u,l,s)),m=m.concat(Ga(e,l,s)),m=m.concat(Va(f,l,s,c)),m=m.concat(Ua(o,l,s));const v=Ya(o,l,s,m);if(m=m.concat(v),m=m.concat(Ja(a,n.tramos_irpf,l,s)),m=m.concat(Wa(i,l,s,r,t.resolverTramosIRPF)),n.usarInflacion&&r.length>0){const I=(o.find($=>$.activo&&$.esCuentaPrincipal)||o.find($=>$.activo)||{_id:"default"})._id;m=m.concat(Ka(u,r,l,s,I));const y=o.filter($=>$.activo&&(!s||s.length===0||s.includes($._id))).reduce(($,b)=>$+te(b,n.dashboardStart),0);m=m.concat(Qa(y,r,l,I))}m.sort((I,A)=>I.fecha.localeCompare(A.fecha));const h=o.filter(I=>I.activo&&(!s||s.length===0||s.includes(I._id)));return Xa(m,h,n)}function Qn(t,e,a=null){const o=Y(),s=e.filter(r=>r.activo&&(!a||a.length===0||a.includes(r._id))).reduce((r,l)=>r+rt(l),0),i=t.filter(r=>r.fecha<=o);return i.length===0?s:i[i.length-1].saldoAcum}function Za(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const n of o.tags||["sin_tag"])a.set(n,(a.get(n)||0)+Math.abs(o.cuantia));return a}function Xn(t,e){const a=[];let o=!1;for(let n=0;n<t.length;n++){const s=t[n],i=s.saldoAcum;i<0&&(n===0||t[n-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:s.fecha,saldo:i,mensaje:`Saldo negativo (${j(i)}) a partir del ${s.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:s.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${j(i)} < ${j(e)}) desde ${s.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:s.fecha,saldo:i,mensaje:`Recuperación del colchón el ${s.fecha} (${j(i)})`})))}return a}function Zn(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=G(e.dashboardStart),n=G(e.dashboardEnd),s=Math.max(1,(n.getTime()-o.getTime())/(30.44*864e5));return a/s}function ts(t,e,a=Y()){const o=new Set,n=e.map(r=>{const l=r.fechaInicialSaldo||"",u={};l&&l<=a&&(u[l]=r.saldoInicial||0);for(const f of r.historicoSaldos||[])f.fecha<=a&&(!l||f.fecha>=l)&&(u[f.fecha]=f.saldo);return Object.keys(u).forEach(f=>o.add(f)),u}),s={};for(const r of[...o].sort()){let l=0;for(let u=0;u<e.length;u++){const f=Object.entries(n[u]).filter(([c])=>c<=r);f.length>0?(f.sort(([c],[m])=>m.localeCompare(c)),l+=f[0][1]):l+=e[u].saldoInicial||0}s[r]=l}const i=[];for(const[r,l]of Object.entries(s).sort(([u],[f])=>u.localeCompare(f))){const u=t.filter(v=>v.fecha<=r),f=u.length>0?u[u.length-1].saldoAcum:null;if(f===null)continue;const c=l-f,m=f!==0?c/Math.abs(f)*100:0;i.push({cuenta:"Total",fecha:r,estimado:f,real:l,desv:c,pct:m})}return i}const es=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:ts,detectarPuntosCriticos:Xn,mediaMensualGastos:Zn},Symbol.toStringTag,{value:"Module"}));function ne(t,e=new Date){const a=V(e),o=new Date(e);o.setMonth(o.getMonth()+1);const n=V(o),s=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return ae(s,{start:a,end:n}).reduce((r,l)=>r+Math.abs(l.cuantia),0)}function Ye(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+kt(a.capital,a.tin,a.meses),0)}function to(t,e,a,o){return e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0?e.colchonFijo:(ne(t,o)+Ye(a))*(e.colchonMeses||6)}function eo(t,e,a,o,n){const i=[...e.colchonPuntos||[]].sort((l,u)=>l.fecha.localeCompare(u.fecha)).filter(l=>l.fecha<=o).pop();return i?i.tipo==="fijo"?i.importe||0:(ne(t,n)+Ye(a))*(i.meses||6):to(t,e,a,n)}function $e(t,e,a,o,n,s=!1,i){const r=[...t.puntos||[]].sort((f,c)=>f.fecha.localeCompare(c.fecha)),l=r.filter(f=>f.fecha<=n).pop()||(s?r[0]:null);return l?l.tipo==="fijo"?l.importe||0:(ne(e,i)+Ye(o))*(l.meses||1):0}function as(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function os(t,e){const a={};for(const o of e)a[o._id]=rt(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=as(o)),{fecha:o.fecha,saldos:{...a}}))}function ns(t,e,a,o,n,s,i){const r=[];for(const l of(t||[]).filter(u=>u.activo!==!1)){let u=!1;for(let f=0;f<e.length;f++){const c=e[f],m=$e(l,o,n,s,c.fecha,!1,i);if(m<=0){u=!1;continue}const v=!l.cuentas||l.cuentas.length===0?c.saldoAcum:l.cuentas.reduce((h,I)=>{var A,y;return h+(((y=(A=a[f])==null?void 0:A.saldos)==null?void 0:y[I])||0)},0);v<m&&!u?(u=!0,r.push({tipo:"bajo_margen",fecha:c.fecha,saldo:v,target:m,nombre:l.nombre,mensaje:`⚠ ${l.nombre}: ${j(v)} < ${j(m)} desde ${c.fecha}`})):v>=m&&u&&(u=!1,r.push({tipo:"recuperacion_margen",fecha:c.fecha,saldo:v,target:m,nombre:l.nombre,mensaje:`✓ ${l.nombre}: recuperado el ${c.fecha}`}))}}return r}const ss=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:to,calcColchonEnFecha:eo,calcGastoBasicoMensual:ne,calcMargenEnFecha:$e,detectarCrucesMargenes:ns,saldosPorCuentaEnExtracto:os},Symbol.toStringTag,{value:"Module"}));function is(t){if(!t||t.showColchon===!1)return null;const e=t.colchonPuntos??[];return e.length>0?{nombre:"Colchón",puntos:[...e]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function ao(t,e){return Zt(G(t),G(e))}const rs=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function oo(t,e){const[a,o,n]=t.split("-").map(Number),s=t.slice(0,4)===e.slice(0,4);return`${n} de ${rs[o-1]}${s?"":` de ${a}`}`}function no(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function ls(t,e={}){const{hoy:a=Y(),horizonteCritico:o=365,horizonteAviso:n=120,maximo:s=4,incertidumbre:i}=e,r=[];for(const c of t.puntosCriticos??[])c.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:c.fecha,distancia:Math.abs(c.saldo),titulo:m=>m?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:m=>`El ${m} el saldo proyectado baja a ${j(c.saldo)}.`}):c.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:c.fecha,distancia:Math.abs(c.saldo),titulo:m=>m?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:m=>`El ${m} el saldo queda en ${j(c.saldo)}, por debajo del colchón.`});for(const c of t.crucesMargenes??[])c.tipo==="bajo_margen"&&r.push({id:`margen:${c.nombre}`,gravedad:"aviso",fecha:c.fecha,distancia:Math.max(0,c.target-c.saldo),titulo:m=>m?`Podrías bajar de «${c.nombre}»`:`Bajas de «${c.nombre}»`,detalle:m=>`El ${m} tendrías ${j(c.saldo)}, y el margen pide ${j(c.target)}.`});const l=new Map;for(const c of r){const m=l.get(c.id);(!m||c.fecha<m.fecha)&&l.set(c.id,c)}const u=[];for(const c of l.values()){const m=ao(a,c.fecha);if(m<0||m>(c.gravedad==="critico"?o:n))continue;const v=i?i(m):0,h=v>0&&c.distancia<v;u.push({id:c.id,gravedad:c.gravedad,fecha:c.fecha,dias:m,plazo:no(m),titulo:c.titulo(h),detalle:c.detalle(oo(c.fecha,a)),incierto:h})}const f={critico:0,aviso:1};return u.sort((c,m)=>c.fecha.localeCompare(m.fecha)||f[c.gravedad]-f[m.gravedad]),u.slice(0,s)}const cs=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:is,construirAvisos:ls,describirPlazo:no,diasEntreISO:ao,fechaEnPalabras:oo},Symbol.toStringTag,{value:"Module"}));class ds extends Error{constructor(a,o){super(`La funcionalidad "${a}" está desactivada; no se puede ${o}. Actívala en ⚙ Funcionalidades.`);Fn(this,"featureId");this.name="FeatureDeshabilitadaError",this.featureId=a}}let se=null;function us(t){const e=se;return se=t,()=>{se=e}}function so(t){return se?se(t):!0}function io(t,e){if(!so(t))throw new ds(t,e)}const ro=[];function Je(){const t=new Map,e=new WeakMap;let a=1,o=0,n=0;const s=l=>{if(!l||typeof l!="object")return 0;const u=e.get(l);if(u)return u;const f=a++;return e.set(l,f),f},i=l=>l.map(u=>[u._id,u.capital,u.tin,u.meses,u.fechaInicio,u.comisionAmort||0,u.comisionApertura||0,u.diaPago||"",u.activo?1:0,u.cuenta||"",(u.amortizaciones||[]).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).sort().join(",")].join("|")).join(";");function r(l){const u=[i(l.loans),s(l.expenses),s(l.accounts),s(l.nominas),s(l.inflacionPeriodos),l.config.dashboardStart,l.config.dashboardEnd,l.config.fechaReferencia||"",l.config.usarInflacion?1:0,(l.filtroAccounts||[]).join(",")].join("#"),f=t.get(u);if(f)return n++,f;o++;const c=oe(l);return t.set(u,c),c}return{statement:r,stats:()=>({hits:n,misses:o}),clear:()=>t.clear()}}function We(t,e,a,o,n={},s=Je()){io("optimizador","calcular el plan de amortizaciones");const{frecuencia:i=1,mesesHorizonte:r=36,minAmortizable:l=500,tipoAmort:u="plazo",fechaPrimeraAmort:f=null,loanIds:c=null,nominas:m=ro,sourceAccountId:v=null,selectedMarginIds:h=null,hoy:I=new Date}=n,A=V(I),y=Math.min(120,Math.max(1,r)),$=a.filter(R=>R.activo),b=$.map(R=>R._id),x=$.find(R=>R.esCuentaPrincipal)||$[0],p=v&&b.includes(v)?$.find(R=>R._id===v):x,g=p==null?void 0:p._id,w=t.filter(R=>R.activo&&!R.simulacion&&(!c||c.includes(R._id))).sort((R,H)=>H.tin-R.tin),S=!!h&&h.length>0,E=(o.margenesSeguridad||[]).filter(R=>R.activo!==!1).filter(R=>!R.cuentas||R.cuentas.length===0||R.cuentas.includes(g)).filter(R=>!S||h.includes(R._id));if(w.length===0)return{plan:[],margenesAplicados:E.length,totalAmortizado:0,totalComisiones:0,totalAhorroIntereses:0,resumenPorLoan:[]};const _={};for(const R of w)_[R._id]=[];const P=[];function C(R){const H=new Date(I.getFullYear(),I.getMonth()+R,1),U=H.getFullYear(),K=H.getMonth(),Q=`${U}-${String(K+1).padStart(2,"0")}`,nt=V(new Date(U,K,Math.min(15,new Date(U,K+1,0).getDate())));return{label:Q,dia15:nt}}function M(R,H){const U=[...R.amortizaciones||[],..._[R._id]],{tabla:K}=at({...R,amortizaciones:U}),Q=K.filter(st=>st.fecha<=H);if(Q.length>0)return Q[Q.length-1].capitalPendiente;const nt=U.filter(st=>st.fecha<=H).reduce((st,gt)=>st+gt.cantidad,0);return Math.max(0,R.capital-nt)}function z(R){const H=t.map(it=>({...it,amortizaciones:[...it.amortizaciones||[],..._[it._id]||[]]})),U={...o,dashboardStart:A,dashboardEnd:R},K=s.statement({loans:H,expenses:e,accounts:a,config:U,filtroAccounts:null,nominas:m}),Q=$.reduce((it,Xt)=>it+rt(Xt),0),nt=p?rt(p):0,st=Q>0?nt/Q:1;let gt=nt,be=Q;for(const it of K){const Xt=it.delta??(it.tipo==="ingreso"?Math.abs(it.cuantia):-Math.abs(it.cuantia));it.cuenta===g?gt+=Xt:b.includes(it.cuenta)||(gt+=Xt*st),be=it.saldoAcum}return{source:gt,total:be}}function F(R){const{source:H}=z(R);if(H<=0)return H;let U=0;for(const K of E){const Q=$e(K,e,o,t,R,!0,I);Q>U&&(U=Q)}return H-U}const T=2;let O=0;if(f){for(let R=0;R<y;R++)if(C(R).dia15>=f){O=R;break}}for(let R=0;R<y;R++){if((R-O)%i!==0||R<O)continue;const{label:H,dia15:U}=C(R);if(U<A)continue;const K=F(U)-T;if(K<l)continue;let Q=K,nt=0;for(const st of w){if(Q<l)break;const gt=M(st,U);if(gt<1)continue;const be=st.comisionAmort||0,it=1+be/100,Xt=Math.floor(Q/it),_n=Math.min(Xt,gt);if(_n<l)continue;const he=Math.min(Math.floor(_n),Math.floor(gt)),zn=+(he*be/100).toFixed(2),wa=he+zn;wa>Q||(_[st._id].push({_id:`opt_${H}_${st._id}`,fecha:U,cantidad:he,tipo:u,simulacion:!0}),nt+=wa,P.push({mes:H,fechaAmort:U,loanId:st._id,loanNombre:st.nombre,tin:st.tin,capitalAntes:gt,cantidadAmort:he,comision:zn,capitalDespues:Math.max(0,gt-he),saldoDisponible:K+T,excedente:K,saldoDespues:K+T-nt,tipoAmort:u}),Q-=wa)}}const D=P.reduce((R,H)=>R+H.cantidadAmort,0),B=P.reduce((R,H)=>R+H.comision,0),L=w.map(R=>{const H=_[R._id];if(!H.length)return null;const U=at(R),K=at({...R,amortizaciones:[...R.amortizaciones||[],...H]});return{loanId:R._id,nombre:R.nombre,tin:R.tin,fechaFinSin:U.fechaFin,fechaFinCon:K.fechaFin,mesesAhorrados:U.mesesReales-K.mesesReales,interesesSin:U.totalIntereses,interesesCon:K.totalIntereses,ahorroIntereses:U.totalIntereses-K.totalIntereses,numAmortizaciones:H.length,totalAmortizado:H.reduce((Q,nt)=>Q+nt.cantidad,0)}}).filter(R=>R!==null),k=L.reduce((R,H)=>R+H.ahorroIntereses,0);return{plan:P,margenesAplicados:E.length,totalAmortizado:D,totalComisiones:B,totalAhorroIntereses:k,resumenPorLoan:L}}function lo(t,e,a,o,n={},s){io("comparador-frecuencias","comparar frecuencias de amortización");const{horizonte:i=60,minAmortizable:r=500,tipoAmort:l="plazo",fechaObjetivo:u=null,frecuencias:f=[1,2,3,6,12],fechaPrimeraAmort:c=null,loanIds:m=null,nominas:v=ro,sourceAccountId:h=null,selectedMarginIds:I=null,hoy:A=new Date}=n,y=s??Je(),$=V(A),b=u||V(new Date(A.getFullYear(),A.getMonth()+i,1));function x(w){const S=t.map(C=>({...C,amortizaciones:[...C.amortizaciones||[],...w[C._id]||[]]})),E={...o,dashboardStart:$,dashboardEnd:b},_=y.statement({loans:S,expenses:e,accounts:a,config:E,filtroAccounts:null,nominas:v});if(_.length===0)return a.filter(C=>C.activo).reduce((C,M)=>C+rt(M),0);const P=_.filter(C=>C.fecha<=b);return P.length>0?P[P.length-1].saldoAcum:_[0].saldoAcum}const p=x({}),g=f.map(w=>{const S=We(t,e,a,o,{frecuencia:w,mesesHorizonte:i,minAmortizable:r,tipoAmort:l,fechaPrimeraAmort:c,loanIds:m,nominas:v,sourceAccountId:h,selectedMarginIds:I,hoy:A},y),E={};for(const P of t)E[P._id]=[];for(const P of S.plan)E[P.loanId].push({_id:P.mes+"_"+P.loanId,fecha:P.fechaAmort,cantidad:P.cantidadAmort,tipo:l,simulacion:!0});const _=x(E);return{frecuencia:w,label:w===1?"Mensual":`Cada ${w} meses`,numAmortizaciones:S.plan.length,totalAmortizado:S.totalAmortizado,totalComisiones:S.totalComisiones,ahorroIntereses:S.totalAhorroIntereses,saldoObjetivo:_,gananciaSaldo:_-p,valorTotal:S.totalAhorroIntereses+(_-p),plan:S.plan,resumenPorLoan:S.resumenPorLoan}}).filter(w=>w.numAmortizaciones>0);if(g.length>0){const w=Math.max(...g.map(_=>_.ahorroIntereses)),S=Math.max(...g.map(_=>_.saldoObjetivo)),E=Math.max(...g.map(_=>_.valorTotal));g.forEach(_=>{_.esMejorIntereses=_.ahorroIntereses===w,_.esMejorSaldo=_.saldoObjetivo===S,_.esMejorValor=_.valorTotal===E})}return{resultados:g,saldoBase:p,fechaObjetivo:b}}const ps=Object.freeze(Object.defineProperty({__proto__:null,compararFrecuencias:lo,createStatementMemo:Je,defaultHoyISO:Y,optimizarAmortizaciones:We},Symbol.toStringTag,{value:"Module"})),ms=30.44*864e5;function co(t){const e=t.getFullYear(),a=t.getMonth();return{desde:V(new Date(e,a,1)),hasta:V(new Date(e,a,Te(e,a)))}}function uo(t){const[e,a]=t.split("-").map(Number);return co(new Date(e,a-1,1))}function fs(t,e){return Math.max(1,(G(e).getTime()-G(t).getTime())/ms)}const vs=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),Et=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function gs(t,e){const a=new Map(e.map(s=>[s._id,s.clasificacion]));let o=0,n=0;for(const s of t){if(s.tipo!=="gasto"||s.sourceType!=="expense")continue;const i=a.get(s.sourceId??"");i!==null&&(i==="deseo"?n+=Math.abs(s.cuantia):o+=Math.abs(s.cuantia))}return{basicos:o,deseo:n}}function bs(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=m=>m.sourceType==="loan"&&m.tipo==="gasto",n=e.loanIdsIniciados,s=Et(t.filter(m=>m.tipo==="ingreso")),i=Et(t.filter(m=>o(m)&&(!n||n.has(m.sourceId??"")))),r=Et(t.filter(m=>o(m)&&e.hipotecaIds.has(m.sourceId??""))),l=Et(t.filter(m=>m.sourceType==="loan-amort")),u=Et(t.filter(m=>m.sourceType==="account-interest")),{basicos:f,deseo:c}=gs(t,e.expenses);return{ingresos:s/a,cuotas:i/a,cuotasHipoteca:r/a,amortizaciones:l/a,gastosBasicos:f/a,gastosDeseo:c/a,gastosTotales:(i+f+c)/a,intereses:u/a}}function po(t,e){return t.reduce((a,o)=>{const n=at(o).tabla.filter(s=>!s.esAmortizacion&&s.fecha<=e);return a+(n.length>0?n[n.length-1].capitalPendiente:o.capital||0)},0)}function hs(t,e,a,o){const n=t.filter(u=>u.activo&&!u.simulacion&&(u.fechaInicio||"")<=a),s=n.reduce((u,f)=>{if((f.amortizaciones||[]).filter(h=>h.fecha>=e&&h.fecha<=a).length===0)return u;const m=at(f).totalIntereses,v=at({...f,amortizaciones:(f.amortizaciones||[]).filter(h=>h.fecha<e||h.fecha>a)}).totalIntereses;return u+Math.max(0,v-m)},0),i=n.filter(u=>u.mostrarFechaFinEnDashboard!==!1).map(u=>({loan:u,fechaFin:at(u).fechaFin})).filter(u=>!!u.fechaFin&&u.fechaFin>=e&&u.fechaFin<=a),r=n.map(u=>at(u).tabla),l=u=>{const{desde:f,hasta:c}=uo(u);return r.reduce((m,v)=>{const h=v.find(I=>!I.esAmortizacion&&I.fecha>=f&&I.fecha<=c);return m+(h?h.cuota:0)},0)};return{deudaInicio:po(n,e),deudaFin:po(n,a),ahorroIntereses:s,ahorroInteresesMes:o>0?s/o:0,cuotasInicio:l(e.slice(0,7)),cuotasFin:l(a.slice(0,7)),finEnPeriodo:i}}function ys(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:Et(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function mo(t,e=new Set,a="desglosado"){if(e.size===0)return Za(t,"gasto");const o=new Map;for(const n of t){if(n.tipo!=="gasto")continue;const s=n.tags||[],i=s.filter(u=>e.has(u)),r=s.filter(u=>!e.has(u)),l=a==="porgrupos"&&i.length>0?i:r;for(const u of l)o.set(u,(o.get(u)||0)+Math.abs(n.cuantia))}return o}function xs(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...mo(t,e.grupoTags,e.modo).entries()].filter(([n])=>!a||a.size===0||a.has(n)).map(([n,s])=>({tag:n,total:s/o})).sort((n,s)=>s.total-n.total)}function $s(t,e){const a=e.reduce((o,n)=>o+rt(n),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:Et(t.filter(o=>o.tipo==="gasto")),totalIngresos:Et(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function Is(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function As(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function ws(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}function Ss(t,e){if(t.length===0)return[];const a=u=>e==="mes"?u.slice(0,7):u.slice(0,4),o=u=>e==="mes"?`${u}-01`:`${u}-01-01`,n=t[0],s=n.delta??(n.tipo==="ingreso"?Math.abs(n.cuantia):-Math.abs(n.cuantia));let i=(n.saldoAcum??0)-s;const r=[];let l=null;for(const u of t){const f=a(u.fecha),c=u.saldoAcum??i;(!l||l.periodo!==f)&&(l&&(i=l.cierre),l={periodo:f,inicio:o(f),apertura:i,cierre:c,maximo:Math.max(i,c),minimo:Math.min(i,c),eventos:0},r.push(l)),l.cierre=c,c>l.maximo&&(l.maximo=c),c<l.minimo&&(l.minimo=c),l.eventos+=1}return r}const Ms=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:Ss,cuentasVisibles:Is,gastoPorTagOrdenado:xs,idsHipoteca:As,idsPrestamosIniciados:ws,interesesPorCuenta:ys,mesesDelPeriodo:fs,metricasFlujo:bs,rangoMes:uo,rangoMesDe:co,resumenPrestamosPeriodo:hs,sinTransferencias:vs,sumarGastosPorTag:mo,totalesPeriodo:$s},Symbol.toStringTag,{value:"Module"}));function Cs(t,e,a){const o=t||[];if(!o.length)return e;const n=o.find(i=>i.año===a);if(n)return n.tramos;const s=o.filter(i=>i.año<a).sort((i,r)=>r.año-i.año);return s.length?s[0].tramos:e}function ht(t,e){return a=>Cs(t,e,a)}const ie=8,fo=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],vo=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Ke(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[],escenarioIds:[]}}function go(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:fo,tramosGananciasCapital:vo,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,escenarioActivo:null,features:{}}}function bo(t,e){return{loans:[],expenses:[],accounts:[Ke(t)],nominas:[],goals:[],planes:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],escenarios:[],config:go(t,e)}}const yt=t=>Array.isArray(t)?t:[],Es=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function re(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function ho(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function Qe(t){const{varianza:e,inflacion:a,...o}=t;return o}function js(t,e){const{hoyISO:a,finISO:o}=e,n={...t},s=Es(t.config),r={...go(a,o)};for(const[f,c]of Object.entries(s))c!=null&&(r[f]=c);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=fo),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=vo),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),n.config=r;let l=yt(t.accounts).map(f=>{const c={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...f};return c.modeloFondo||(c.modeloFondo=c.esFondoPension?"pension":"cuenta"),delete c.esFondoPension,Array.isArray(c.historicoSaldos)||(c.historicoSaldos=[]),re(c)});l.length===0&&(l=[Ke(a)]);const u=l.filter(f=>f.esCuentaPrincipal);if(u.length===0){const f=l.find(c=>c._id==="default")||l[0];l=l.map(c=>({...c,esCuentaPrincipal:c._id===f._id}))}else if(u.length>1){let f=!1;l=l.map(c=>c.esCuentaPrincipal?f?{...c,esCuentaPrincipal:!1}:(f=!0,c):c)}return n.accounts=l,n.expenses=yt(t.expenses).map(f=>{const c={basico:!1,activo:!0,tags:[],historialPrecios:[],...f};return Array.isArray(c.tags)||(c.tags=[]),Array.isArray(c.historialPrecios)||(c.historialPrecios=[]),c.diaPago=ho(c.diaPago),Qe(re(c))}),n.loans=yt(t.loans).map(f=>{const c={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...f};return Array.isArray(c.tags)||(c.tags=[]),c.diaPago=ho(c.diaPago),c.amortizaciones=yt(c.amortizaciones).map(m=>re(m)),Qe(re(c))}),n.nominas=yt(t.nominas).map(f=>{const c={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...f};return Array.isArray(c.tags)||(c.tags=[]),Array.isArray(c.retribucionFlexible)||(c.retribucionFlexible=[]),Qe(re(c))}),n.goals=yt(t.goals).map((f,c)=>{const m=Array.isArray(f.cuentaIds)?f.cuentaIds:f.cuentaId?[f.cuentaId]:[],{cuentaId:v,...h}=f;return{prioridad:c+1,completado:!1,usarColchon:!0,targetAmount:0,...h,cuentaIds:m}}),n.inflacion=yt(t.inflacion),n.tramosIRPFHistorico=yt(t.tramosIRPFHistorico),n.tramosGananciasCapitalHistorico=yt(t.tramosGananciasCapitalHistorico),n.escenarios=yt(t.escenarios).map(({inversiones:f,...c})=>c),n}const Gt=t=>Array.isArray(t)?t:[];let Xe=0;function _s(t){return Xe+=1,`${t}_${Xe.toString(36)}`}const zs=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Fs=t=>typeof t=="number"&&Number.isFinite(t);function Ps(t,e){const a={...t};Xe=0;const o=Gt(t.transacciones),n=Gt(t.puntosControl),s=[...n],i=new Set(n.map(u=>`${u.cuentaId}|${u.fecha}`)),r=(u,f,c,m)=>{if(!zs(f)||!Fs(c))return;const v=`${u}|${f}`;i.has(v)||(i.add(v),s.push({_id:_s("pc"),fecha:f,cuentaId:u,saldoCts:wt(c),...typeof m=="string"&&m?{nota:m}:{}}))};for(const u of Gt(t.accounts)){const f=typeof u._id=="string"?u._id:null;if(f)for(const c of Gt(u.historicoSaldos))r(f,c.fecha,c.saldo,c.nota)}const l=Gt(t.history);if(l.length>0){const u=Gt(t.accounts),f=u.find(m=>m.esCuentaPrincipal)||u.find(m=>m.activo)||u[0],c=typeof(f==null?void 0:f._id)=="string"?f._id:"default";for(const m of l){const v=typeof m.cuenta=="string"?m.cuenta:typeof m.cuentaId=="string"?m.cuentaId:c;r(v,m.fecha,m.saldo,m.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=s.sort((u,f)=>String(u.fecha).localeCompare(String(f.fecha))),a}const Ze=t=>Array.isArray(t)?t:[],Ds=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Ts=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let ta=0;function Ns(){return ta+=1,`tx_hp_${ta.toString(36)}`}function Os(t,e){const a={...t};ta=0;const o=[...Ze(t.transacciones)],n=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),s=Ze(t.expenses).map(i=>{const r=Ze(i.historialPrecios),l=typeof i._id=="string"?i._id:null,u=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",f=i.tipo==="ingreso"?"ingreso":"gasto",c=Array.isArray(i.tags)?i.tags.filter(h=>typeof h=="string"):[];if(l)for(const h of r){if(!h||!Ds(h.fecha)||!Ts(h.cuantia))continue;const I=f==="ingreso"?wt(h.cuantia):-wt(h.cuantia),A=`${l}|${h.fecha}|${I}`;n.has(A)||(n.add(A),o.push({_id:Ns(),fecha:h.fecha,cuentaId:u,importeCts:I,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:c,estimacionId:l,tipo:f,origen:"importado",nota:typeof h.nota=="string"&&h.nota?h.nota:"Importado del historial de precios"}))}const{historialPrecios:m,...v}=i;return v});return a.expenses=s,a.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),a}const yo=t=>Array.isArray(t)?t:[],jt=(t,e="")=>typeof t=="string"&&t.trim()?t:e,Vt=(t,e=0)=>typeof t=="number"&&Number.isFinite(t)?t:e,Rs=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function qs(t,e){var f;const a={...t};if(Array.isArray(a.planes))return a;const o=yo(a.goals),n=yo(a.accounts),s=n.map(c=>{const m=Vt(c.bloqueoMeses,0);return{_id:`veh_${jt(c._id,"x")}`,nombre:jt(c.nombre,"Cuenta"),rentabilidadRealAnual:Vt(c.interes,0)/100,liquidez:c.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":m>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:Vt(c.impuestoRetirada,0)/100,topeAportacionAnual:c.modeloFondo==="pension"?wt(1500):null,riesgo:c.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:jt(c._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:Vt(c.interes,0)>0}}),i=new Map(n.map((c,m)=>[jt(c._id,""),s[m]._id])),r=((f=s[0])==null?void 0:f._id)??"",l=o.map((c,m)=>{const v=Array.isArray(c.cuentaIds)?c.cuentaIds.map(I=>jt(I,"")):[],h=Rs(c.targetDate);return{_id:jt(c._id,`obj_mig_${m}`),nombre:jt(c.nombre,`Objetivo ${m+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:wt(Vt(c.targetAmount,0)),fechaLimite:h,prioridad:Vt(c.prioridad,m+1),modoAsignacion:h?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:c.completado===!0?"COMPLETADO":"PENDIENTE",notas:jt(c.notas,"")}}),u={_id:"plan_base",nombre:"Plan base",fechaInicio:e.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:s,objetivos:l,eventos:[],creadoEn:e.hoyISO};return a.planes=[u],a}const Ls=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:js},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:Ps},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:Os},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:qs}],Bs=["history"];function xo(t,e,a){let o=t;const n=[];for(const s of[...Ls].sort((i,r)=>i.version-r.version))(e??0)>=s.version||(o=s.migrate(o,a),n.push(s.version));return{state:o,applied:n}}const _t="state_",Ie="state__schemaVersion",Ut="financeapp_",ea="state__modificadoEn";function $o(t=localStorage,e=Ut){const a=o=>`${e}${o}`;return{get(o){try{const n=t.getItem(a(o));return n===null?null:JSON.parse(n)}catch{return null}},set(o,n){try{t.setItem(a(o),JSON.stringify(n)),o!==ea&&t.setItem(a(ea),JSON.stringify(Date.now()))}catch(s){console.error("No se pudo guardar en localStorage:",o,s)}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(e)&&o.push(s.slice(e.length))}return o}}}function ks(t=localStorage,e=Ut){const a=[];for(let n=0;n<t.length;n++){const s=t.key(n);s!=null&&s.startsWith(_t)&&!s.startsWith(e)&&a.push(s)}const o=[];for(const n of a)try{const s=t.getItem(n);s!==null&&t.getItem(`${e}${n}`)===null&&(t.setItem(`${e}${n}`,s),o.push(n)),t.removeItem(n)}catch{}return o}function Hs({ventanaMs:t=15e3,ahora:e=()=>Date.now()}={}){let a=null;function o(){return a?e()-a.cuando>t?(a=null,null):a:null}return{registrar(n){a={...n,cuando:e()}},pendiente:o,tomar(){const n=o();return a=null,n},limpiar(){a=null}}}const Gs={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},escenarios:{articulo:"El",que:"supuesto"},planes:{articulo:"El",que:"plan"},goals:{articulo:"El",que:"objetivo"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function Vs(t,e){const a=Gs[t]??{articulo:"El",que:"elemento"},o=e.concepto??e.nombre??e.titulo??(e.year!==void 0?String(e.year):null);return o?`${a.articulo} ${a.que} «${String(o)}»`:`${a.articulo} ${a.que}`}function Us(t){return V(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function Ys({adapter:t,hoy:e=new Date}){const a=V(e),o=Us(e);let n=bo(a,o);const s=new Set;let i=[];const r=Hs();function l(C){for(const M of s)M(C)}function u(C){t.set(`${_t}${C}`,n[C])}function f(){const C={};for(const T of Object.keys(n)){const O=t.get(`${_t}${T}`);O!==null&&(C[T]=O)}for(const T of Bs){const O=t.get(`${_t}${T}`);O!==null&&(C[T]=O)}const M=t.get(Ie),{state:z,applied:F}=xo(C,M,{hoyISO:a,finISO:o});if(n=z,c(),F.length>0){for(const T of Object.keys(n))u(T);t.set(Ie,ie)}return i=F,{applied:F}}function c(){if(!Array.isArray(n.accounts)||n.accounts.length===0){n.accounts=[Ke(a)],u("accounts");return}const C=n.accounts.filter(M=>M.esCuentaPrincipal);if(C.length===0)n.accounts=n.accounts.map((M,z)=>z===0?{...M,esCuentaPrincipal:!0}:M),u("accounts");else if(C.length>1){let M=!1;n.accounts=n.accounts.map(z=>z.esCuentaPrincipal?M?{...z,esCuentaPrincipal:!1}:(M=!0,z):z),u("accounts")}}function m(C){return n[C]}function v(C,M){n[C]=M,u(C),l(C)}function h(C){v("config",{...n.config,...C})}function I(C){return s.add(C),()=>s.delete(C)}function A(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function y(C,M){const z=[...n[C]],F={...M,_id:A()};return z.push(F),v(C,z),F}function $(C,M,z){const F=n[C].map(T=>T._id===M?{...T,...z}:T);v(C,F)}function b(C,M){const z=n[C],F=z.findIndex(T=>T._id===M);F<0||(r.registrar({col:C,item:z[F],indice:F}),v(C,z.filter((T,O)=>O!==F)))}function x(){const C=r.tomar();if(!C)return null;const M=[...n[C.col]];return M.splice(Math.min(C.indice,M.length),0,C.item),v(C.col,M),C}function p(){return r.pendiente()}function g(){const C=n.accounts||[],M=C.find(z=>z.esCuentaPrincipal&&z.activo)||C.find(z=>z.activo);return M?M._id:"default"}function w(C){var M;return((M=n.accounts.find(z=>z._id===C))==null?void 0:M.nombre)??C}function S(){return ht(n.tramosIRPFHistorico,n.config.tramos_irpf)}function E(){return ht(n.tramosGananciasCapitalHistorico,n.config.tramosGananciasCapital)}function _(){return structuredClone(n)}function P(C,M=null){const{state:z,applied:F}=xo(C,M,{hoyISO:a,finISO:o});n=z,c();for(const T of Object.keys(n))u(T);t.set(Ie,ie);for(const T of Object.keys(n))l(T);return{applied:F}}return{load:f,get:m,set:v,patchConfig:h,subscribe:I,addItem:y,updateItem:$,removeItem:b,deshacerBorrado:x,borradoPendiente:p,getPrincipalAccountId:g,accountName:w,resolverTramosIRPF:S,resolverTramosGanancias:E,snapshot:_,replaceAll:P,get schemaVersion(){return ie},get migrationsApplied(){return[...i]},get today(){return a||Y()}}}function Js(){let t=0,e=null;const a=new Set;function o(n){t+=1,e=n;for(const s of a)try{s(t,n)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>e,marcar:o,suscribir(n){return a.add(n),()=>a.delete(n)},crearMarca(n){let s=t;return{nombre:n,pendiente:()=>t>s,alDia:i=>{s=Math.max(s,i??t)},vista:()=>s}}}}const Tt=Object.keys(bo("1970-01-01","1970-01-01"));function Io(t){const e={};for(const a of Tt){const o=t.get(`${_t}${a}`);o!=null&&(e[a]=o)}return e}function Ws(t,e){const a=[];for(const o of Tt){const n=e[o];n!=null&&(t(`${_t}${o}`,n),a.push(o))}return a}function Ks(t){return Tt.filter(e=>t[e]===void 0||t[e]===null)}function Qs(t){var i,r;const e=l=>{const u=t[l];return Array.isArray(u)?u:[]};if(!Tt.filter(l=>l!=="config"&&l!=="accounts"&&l!=="planes").every(l=>e(l).length===0))return!1;const o=e("planes");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="plan_base"&&!(Array.isArray((r=o[0])==null?void 0:r.objetivos)&&o[0].objetivos.length>0)?e("accounts").every(l=>l._id==="default"&&!(typeof l.saldoInicial=="number"&&l.saldoInicial!==0)&&!(Array.isArray(l.historicoSaldos)&&l.historicoSaldos.length>0)):!1}const Ao=`${Ut}meta_proyectos`,wo=`${Ut}meta_proyectoActivo`,Nt="default",Xs="Mis finanzas";function aa(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function le(t){return t===Nt?Ut:`${Ut}p_${t}_`}function So(){return[...Tt.map(t=>`${_t}${t}`),Ie,ea]}function Zs(t=localStorage){function e(){try{const f=t.getItem(Ao);if(!f)return[];const c=JSON.parse(f);return Array.isArray(c)?c:[]}catch{return[]}}function a(f){t.setItem(Ao,JSON.stringify(f))}function o(){const f=e();if(f.some(v=>v._id===Nt))return f;const c=Date.now(),m=[{_id:Nt,nombre:Xs,creadoEn:c,actualizadoEn:c},...f];return a(m),m}function n(){try{const f=t.getItem(wo);if(!f)return Nt;const c=JSON.parse(f);return typeof c=="string"&&c?c:Nt}catch{return Nt}}function s(f){t.setItem(wo,JSON.stringify(f))}function i(f){const c=f.trim()||"Proyecto sin nombre",m=Date.now(),v={_id:aa(),nombre:c,creadoEn:m,actualizadoEn:m};return a([...o(),v]),v}function r(f,c){const m=c.trim();m&&a(o().map(v=>v._id===f?{...v,nombre:m,actualizadoEn:Date.now()}:v))}function l(f,c){const m=o().find(A=>A._id===f);if(!m)throw new Error("Proyecto no encontrado.");const v=le(f),h={_id:aa(),nombre:(c==null?void 0:c.trim())||`${m.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},I=le(h._id);for(const A of So()){const y=t.getItem(`${v}${A}`);y!==null&&t.setItem(`${I}${A}`,y)}return a([...o(),h]),h}function u(f){if(f===Nt)throw new Error("No se puede eliminar el proyecto original.");if(f===n())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const c=o();if(!c.some(v=>v._id===f))return;const m=le(f);for(const v of So())t.removeItem(`${m}${v}`);a(c.filter(v=>v._id!==f))}return{listar:o,activo:n,establecerActivo:s,crear:i,renombrar:r,duplicar:l,eliminar:u}}function ti(t,e,a){const o=$o(t,le(e)),n={};for(const s of a){const i=o.get(`${_t}${s}`);n[s]=Array.isArray(i)?i:[]}return n}function ei(t){const e=new Map;for(const n of Object.values(t))for(const s of n){const i=s==null?void 0:s._id;typeof i=="string"&&!e.has(i)&&e.set(i,aa())}function a(n){if(typeof n=="string")return e.get(n)??n;if(Array.isArray(n))return n.map(a);if(n&&typeof n=="object"){const s={};for(const[i,r]of Object.entries(n))s[i]=a(r);return s}return n}const o={};for(const[n,s]of Object.entries(t))o[n]=s.map(a);return o}const X={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},zt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:X.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:X.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:X.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:X.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y ahorro",descripcion:"Cuentas, fondos de inversión, planes de pensiones y puntos de control de saldo.",grupo:X.dinero,porDefecto:!0},{id:"goals",nombre:"Objetivos de ahorro (antiguos)",descripcion:"Solo lectura: la copia previa al planificador. Los objetivos se gestionan en «Objetivos financieros». Apagada de fábrica; enciéndela si quieres revisar los antiguos antes de descartarlos.",grupo:X.dinero,porDefecto:!1,dependencias:["accounts"]},{id:"contabilidad",nombre:"Contabilidad real",descripcion:"Registro de gastos e ingresos reales y análisis de precisión de las estimaciones.",grupo:X.dinero,porDefecto:!0,dependencias:["accounts"]},{id:"supuestos",nombre:"Supuestos",descripcion:"Puntos de guardado sobre los que probar cambios, con biblioteca revisitable.",grupo:X.planificacion,porDefecto:!0},{id:"inflacion",nombre:"Inflación",descripcion:"Tasas anuales de IPC que encarecen los gastos y erosionan el ahorro.",grupo:X.planificacion,porDefecto:!1},{id:"fiscalidad",nombre:"Fiscalidad",descripcion:"Simulador de la declaración de la renta y tablas de tramos por ejercicio.",grupo:X.planificacion,porDefecto:!1},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:X.planificacion,porDefecto:!1},{id:"planner",nombre:"Objetivos financieros",descripcion:"Plan a largo plazo: objetivos que compiten por el flujo mensual y se encadenan al completarse.",grupo:X.planificacion,porDefecto:!0},{id:"optimizador",nombre:"Optimizador de amortizaciones",descripcion:"Planifica amortizaciones anticipadas con el excedente disponible cada mes.",grupo:X.planificacion,porDefecto:!1,dependencias:["loans"]},{id:"comparador-frecuencias",nombre:"Comparador de frecuencias",descripcion:"Compara amortizar cada mes, cada trimestre, etc. por ahorro de intereses.",grupo:X.planificacion,porDefecto:!1,dependencias:["optimizador"]},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:X.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:X.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:X.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:X.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:X.analisis,porDefecto:!0,dependencias:["contabilidad","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:X.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:X.datos,porDefecto:!1,dependencias:["sync-nube"]}],ai=new Map(zt.map(t=>[t.id,t]));function ce(t){return ai.get(t)}function Mo(t){return zt.filter(e=>(e.dependencias||[]).includes(t))}function oa(){const t={};for(const e of zt)t[e.id]=e.porDefecto;return t}function Co(){const t=[],e=new Map;for(const a of zt)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function oi(t){function e(){return{...oa(),...t.get("config").features||{}}}function a(c){t.patchConfig({features:c})}function o(c,m=e(),v=new Set){const h=ce(c);if(!h)return!1;if(h.nucleo)return!0;if(m[c]===!1)return!1;if(v.has(c))return!0;v.add(c);for(const I of h.dependencias||[])if(!o(I,m,v))return!1;return!0}function n(c,m=e()){const v=ce(c);return v?(v.dependencias||[]).filter(h=>!o(h,m)):[]}function s(c,m){var b;const v=ce(c);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const h=e(),I=new Map(zt.map(x=>[x.id,o(x.id,h)])),A={...h,[c]:m};let y;if(m){const x=[...v.dependencias||[]];for(;x.length;){const p=x.pop();A[p]===!1&&(A[p]=!0,y="dependencias-activadas"),x.push(...((b=ce(p))==null?void 0:b.dependencias)||[])}}else{const x=Mo(c).map(p=>p.id);for(;x.length;){const p=x.pop();A[p]!==!1&&(A[p]=!1,y="cascada-apagado"),x.push(...Mo(p).map(g=>g.id))}}return a(A),{cambiadas:zt.filter(x=>o(x.id,A)!==I.get(x.id)).map(x=>x.id),motivo:y}}function i(){const c=e();return zt.map(m=>{const v=n(m.id,c);return{...m,activa:o(m.id,c),...v.length>0&&c[m.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const c=e();return Co().map(({grupo:m,features:v})=>({grupo:m,features:v.map(h=>{const I=n(h.id,c);return{...h,activa:o(h.id,c),...I.length>0&&c[h.id]!==!1?{bloqueadaPor:I}:{}}})}))}function l(){a(oa())}function u(c){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...c?{nombre:c}:{},features:e()}}function f(c){const m=c,v=m&&typeof m=="object"&&m.features&&typeof m.features=="object"?m.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const h=oa(),I=[],A=[];for(const[y,$]of Object.entries(v)){if(!ce(y)){A.push(y);continue}if(typeof $!="boolean"){A.push(y);continue}h[y]=$,I.push(y)}return a(h),{aplicadas:I,ignoradas:A}}return{isEnabled:c=>o(c),setEnabled:s,estado:i,estadoPorGrupo:r,reset:l,exportProfile:u,importProfile:f,bloqueadaPor:c=>n(c)}}const de=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function Yt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function ni(t){var n,s;const a=(((n=t.bloqueadaPor)==null?void 0:n.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(s=t.bloqueadaPor)==null?void 0:s.map(de).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${de(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${de(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${de(t.descripcion)}</div>
        ${a}
      </div>
    </div>`}function si(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:n})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${de(o)}</div>
        ${n.map(ni).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function ii(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-feature-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function ri(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${si(a)}`,n(i)}function n(i){var l,u,f;i.querySelectorAll("[data-feature-toggle]").forEach(c=>{c.addEventListener("change",()=>{var h;const m=c.dataset.featureToggle,v=a.setEnabled(m,c.checked);v.motivo==="dependencias-activadas"&&Yt(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&Yt(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(h=t.onChange)==null||h.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(l=i.querySelector('[data-feature-action="export"]'))==null||l.addEventListener("click",()=>{const c=a.exportProfile(),m=new Blob([JSON.stringify(c,null,2)],{type:"application/json"}),v=URL.createObjectURL(m),h=e.createElement("a");h.href=v,h.download=`financeapp-funcionalidades-${new Date().toISOString().slice(0,10)}.json`,h.click(),URL.revokeObjectURL(v),Yt(t,"Perfil de funcionalidades guardado")}),(u=i.querySelector('[data-feature-action="import"]'))==null||u.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var m,v;const c=(m=r.files)==null?void 0:m[0];if(c)try{const{aplicadas:h,ignoradas:I}=a.importProfile(JSON.parse(await c.text()));Yt(t,I.length>0?`Perfil cargado (${h.length} aplicadas, ${I.length} ignoradas por ser de otra versión)`:`Perfil cargado (${h.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,h),o(i)}catch(h){Yt(t,"No se pudo cargar el perfil: "+h.message,"err")}finally{r.value=""}}),(f=i.querySelector('[data-feature-action="reset"]'))==null||f.addEventListener("click",()=>{var c;a.reset(),Yt(t,"Funcionalidades restablecidas"),(c=t.onChange)==null||c.call(t,[]),o(i)})}function s(){const i=ii(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:s,renderInto:o}}const xt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),li={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",goals:"Objetivos (antiguo)",planes:"Planes (objetivos financieros)",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",escenarios:"Supuestos"};function Eo(t){return li[t]??t}function St(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function jo(t,e){if(t.confirmar)return t.confirmar(e);const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(e):typeof confirm=="function"?confirm(e):!0}function ci(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function di(){var e,a,o,n;const t=globalThis;(a=(e=t.State)==null?void 0:e.load)==null||a.call(e),(n=(o=t.Router)==null?void 0:o.rerender)==null||n.call(o)}function ui(t){var n;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",s=>{s.target===o&&(o==null||o.classList.add("hidden"))}),(n=o.querySelector("[data-proyectos-close]"))==null||n.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function pi(t,e){const a=t._id===e,o=t._id==="default";return`
    <div class="dm-section" data-proyecto-fila="${xt(t._id)}" style="padding:12px 15px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${xt(t.nombre)}
        </div>
        ${a?'<span class="dm-badge dm-badge--local">Activo</span>':""}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${a?"":`<button class="btn-primary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="cambiar" data-proyecto-id="${xt(t._id)}">Cambiar a este</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="renombrar" data-proyecto-id="${xt(t._id)}">Renombrar</button>
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="duplicar" data-proyecto-id="${xt(t._id)}">Duplicar</button>
        ${o||a?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-proyecto-accion="eliminar" data-proyecto-id="${xt(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function mi(t,e,a){const o=t.filter(i=>i._id!==e);if(o.length===0)return"";const n=o.map(i=>`<option value="${xt(i._id)}">${xt(i.nombre)}</option>`).join(""),s=a.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${xt(i)}"/> ${xt(Eo(i))}
      </label>`).join("");return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Importar de otro proyecto</span></div>
      <div style="font-size:11px;color:var(--text3);line-height:1.5;margin-bottom:10px">
        Trae colecciones de otro proyecto al activo, con ids nuevos — se añaden a
        lo que ya hay, no lo sustituyen. Si importas gastos o préstamos que
        dependen de una cuenta, importa también esa cuenta para que la
        referencia no se quede suelta.
      </div>
      <label class="form-label" style="font-size:11px">Desde</label>
      <select id="proyecto-import-origen" class="auth-input" style="margin:4px 0 10px">${n}</select>
      <div style="max-height:180px;overflow-y:auto;border:1px solid var(--hairline-soft);border-radius:8px;padding:6px 10px;margin-bottom:10px">
        ${s}
      </div>
      <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-import-btn">Importar</button>
    </div>`}function fi(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function vi(t){const e=t.document??document,{proyectos:a}=t;function o(){const r=a.listar(),l=a.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(u=>pi(u,l)).join("")}
      </div>
      ${fi()}
      ${mi(r,l,a.colecciones)}`}function n(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,s(r)}function s(r){var l,u;r.querySelectorAll("[data-proyecto-accion]").forEach(f=>{f.addEventListener("click",()=>{const c=f.dataset.proyectoId,m=f.dataset.proyectoAccion,v=a.listar().find(h=>h._id===c);if(v){if(m==="cambiar"){if(!jo(t,`¿Cambiar a "${v.nombre}"? Se recargará la página.`))return;a.cambiarA(c),ci(t);return}if(m==="renombrar"){const h=typeof prompt=="function"?prompt("Nuevo nombre",v.nombre):null;if(!h||!h.trim())return;a.renombrar(c,h.trim()),St(t,"Proyecto renombrado"),n(r);return}if(m==="duplicar"){const h=`${v.nombre} (copia)`,I=typeof prompt=="function"?prompt("Nombre de la copia",h):h;if(I===null)return;const A=a.duplicar(c,I.trim()||h);St(t,`"${A.nombre}" creado como copia de "${v.nombre}" ✓`),n(r);return}if(m==="eliminar"){if(!jo(t,`¿Eliminar "${v.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{a.eliminar(c),St(t,`"${v.nombre}" eliminado`),n(r)}catch(h){St(t,h.message,"err")}}}})}),(l=r.querySelector("#proyecto-nuevo-btn"))==null||l.addEventListener("click",()=>{const f=r.querySelector("#proyecto-nuevo-nombre"),c=f==null?void 0:f.value.trim();if(!c){St(t,"Ponle un nombre al proyecto","warn");return}const m=a.crear(c);St(t,`"${m.nombre}" creado ✓`),n(r)}),(u=r.querySelector("#proyecto-import-btn"))==null||u.addEventListener("click",()=>{var v;const f=(v=r.querySelector("#proyecto-import-origen"))==null?void 0:v.value;if(!f)return;const c=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(h=>h.dataset.proyectoImportCol);if(c.length===0){St(t,"Elige al menos una colección para importar","warn");return}const{importadas:m}=a.importarDesde(f,c);if(m.length===0){St(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}St(t,`Importado: ${m.map(Eo).join(", ")} ✓`),di(),n(r)})}function i(){const r=ui(e);n(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:n}}const _o={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",supuestos:"escenarios",inflacion:"inflacion",fiscalidad:"rentas",margenes:"margenes"};function zo(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const n=e(o);a.style.display=n?"":"none",n?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function gi({flags:t,document:e=document,router:a,rutasExtra:o}){function n(){const r=e.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function s(){let r=!1;const l=Object.entries((o==null?void 0:o())??{}).map(([u,f])=>[f,u]);for(const[u,f]of[...Object.entries(_o),...l]){const c=t.isEnabled(u),m=e.querySelector(`.nav-btn[data-view="${f}"]`);m&&(m.style.display=c?"":"none"),!c&&n()===f&&(r=!0)}if(e.querySelectorAll(".nav-section").forEach(u=>{const f=[...u.querySelectorAll(".nav-btn[data-view]")];if(f.length===0)return;const c=f.some(m=>m.style.display!=="none");u.style.display=c?"":"none"}),zo(e,u=>t.isEnabled(u)),r){const u=a??globalThis.Router;u==null||u.navigate("dashboard")}}function i(r=e.body){if(typeof MutationObserver>"u")return()=>{};let l=!1;const u=new MutationObserver(()=>{if(!l){l=!0;try{zo(e,f=>t.isEnabled(f))}finally{l=!1}}});return u.observe(r,{childList:!0,subtree:!0}),()=>u.disconnect()}return{apply:s,observar:i,vistaPara:r=>_o[r]}}const bi="toast toast-deshacer";function hi(t){const{store:e,rerender:a,duracionMs:o=12e3}=t,n=t.contenedor??(()=>document.getElementById("toast-container"));let s=null,i=null,r=null;function l(){i&&clearTimeout(i),i=null,s==null||s.remove(),s=null}function u(c){const m=n();if(!m)return;l();const v=document.createElement("div");v.className=bi,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const h=document.createElement("span");h.textContent=`${Vs(c.col,c.item)} se ha eliminado.`,h.style.flex="1";const I=document.createElement("button");I.type="button",I.className="btn-secondary btn-sm",I.textContent="Deshacer",I.style.flexShrink="0",I.addEventListener("click",()=>{const A=e.deshacerBorrado();if(l(),!A)return;const y=n();if(y){const $=document.createElement("div");$.className="toast toast-ok",$.textContent="Deshecho.",y.appendChild($),setTimeout(()=>$.remove(),2500)}a==null||a()}),v.appendChild(h),v.appendChild(I),m.appendChild(v),s=v,i=setTimeout(l,o)}const f=e.subscribe(()=>{const c=e.borradoPendiente();if(!c){r=null,l();return}c!==r&&(r=c,u(c))});return()=>{f(),l()}}function Ae(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function Fo(t,e){const a=Ae(t),o=Ae(e);if(!o)return-1;const n=a.indexOf(o);return n<0?-1:n===0?0:/[\s\-/_(«"']/.test(a[n-1])?1:2}const Ot=t=>{const e=Number(t);return Number.isFinite(e)?`${e.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function yi(t){const e=[],a=o=>{var n,s;return((s=(n=t.accounts)==null?void 0:n.find(i=>i._id===o))==null?void 0:s.nombre)??""};for(const o of t.expenses??[]){const n=o.tipo==="ingreso";e.push({tipo:n?"ingreso":"gasto",etiqueta:n?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[Ot(o.cuantia),a(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],a(o.cuenta)].join(" ")})}for(const o of t.accounts??[])e.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:Ot(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])e.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:Ot(o.capital),ruta:"loans",extra:[...o.tags??[],a(o.cuenta)].join(" ")});for(const o of t.nominas??[])e.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${Ot(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.escenarios??[])e.push({tipo:"supuesto",etiqueta:"Supuesto",id:o._id,titulo:o.nombre,detalle:o.descripcion??"",ruta:"escenarios"});for(const o of t.planes??[]){e.push({tipo:"plan",etiqueta:"Plan",id:o._id,titulo:o.nombre,detalle:o.notas??"",ruta:"planner"});for(const n of o.objetivos??[])e.push({tipo:"objetivo",etiqueta:"Objetivo",id:n._id,titulo:n.nombre,detalle:[n.importeObjetivo!==null?Ot(n.importeObjetivo/100):"",o.nombre].filter(Boolean).join(" · "),ruta:"planner"})}for(const o of t.goals??[])e.push({tipo:"objetivo",etiqueta:"Objetivo",id:o._id,titulo:o.nombre,detalle:Ot(o.targetAmount),ruta:"accounts"});for(const o of t.transacciones??[])e.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,Ot(o.importeCts/100),a(o.cuentaId)].filter(Boolean).join(" · "),ruta:"contabilidad",extra:(o.tags??[]).join(" ")});return e}function xi(t,e,a={}){const{maximo:o=12,rutasDisponibles:n=null}=a,s=Ae(e);if(s.length<2)return[];const i=l=>n===null||n.includes(l),r=[];for(const l of yi(t)){if(!i(l.ruta))continue;const u=Fo(l.titulo,s),f=u>=0?-1:Math.min(Fo(l.extra??"",s),2);if(u<0&&f<0)continue;const c=u>=0?u:3;r.push({tipo:l.tipo,etiqueta:l.etiqueta,id:l.id,titulo:l.titulo,detalle:l.detalle,ruta:l.ruta,peso:c*1e3+Math.min(999,Ae(l.titulo).length)})}return r.sort((l,u)=>l.peso-u.peso||l.titulo.localeCompare(u.titulo,"es")),r.slice(0,o)}const $i="buscador-overlay",Po="btn-buscador";function Ii(t){const e=t.doc??document,a=t.rutasDisponibles??(()=>null);let o=null,n=null,s=null,i=[],r=0;function l(){const x=e.createElement("div");x.id=$i,x.className="modal-overlay",x.style.alignItems="flex-start",x.style.paddingTop="10vh";const p=e.createElement("div");p.className="modal-box",p.style.maxWidth="560px",p.style.padding="14px";const g=e.createElement("input");g.type="search",g.className="form-input",g.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",g.setAttribute("aria-label","Buscar en toda la aplicación"),g.autocomplete="off";const w=e.createElement("div");return w.style.marginTop="10px",w.style.maxHeight="52vh",w.style.overflowY="auto",p.appendChild(g),p.appendChild(w),x.appendChild(p),e.body.appendChild(x),x.addEventListener("click",S=>{S.target===x&&I()}),g.addEventListener("input",()=>{r=0,f()}),g.addEventListener("keydown",v),o=x,n=g,s=w,x}function u(){if(s){if(s.textContent="",i.length===0){const x=e.createElement("div");x.style.padding="14px 4px",x.style.fontSize="13px",x.style.color="var(--text3)";const p=(n==null?void 0:n.value.trim())??"";x.textContent=p.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",s.appendChild(x);return}i.forEach((x,p)=>{const g=e.createElement("button");g.type="button",g.className="buscador-fila",g.dataset.indice=String(p),p===r&&g.classList.add("activa");const w=e.createElement("div");w.style.minWidth="0";const S=e.createElement("div");S.textContent=x.titulo,S.style.fontSize="13px",S.style.overflow="hidden",S.style.textOverflow="ellipsis",S.style.whiteSpace="nowrap";const E=e.createElement("div");E.textContent=x.detalle,E.style.fontSize="11px",E.style.color="var(--text3)",E.style.overflow="hidden",E.style.textOverflow="ellipsis",E.style.whiteSpace="nowrap",w.appendChild(S),x.detalle&&w.appendChild(E);const _=e.createElement("span");_.className="tag",_.textContent=x.etiqueta,_.style.flexShrink="0",g.appendChild(w),g.appendChild(_),g.addEventListener("click",()=>m(p)),s.appendChild(g)})}}function f(){const x=(n==null?void 0:n.value)??"";i=xi(t.estado(),x,{rutasDisponibles:a()}),r>=i.length&&(r=Math.max(0,i.length-1)),u()}function c(x){var p,g;i.length!==0&&(r=(r+x+i.length)%i.length,u(),(g=(p=s==null?void 0:s.querySelector(".buscador-fila.activa"))==null?void 0:p.scrollIntoView)==null||g.call(p,{block:"nearest"}))}function m(x){const p=i[x];p&&(I(),t.navegar(p.ruta))}function v(x){x.key==="Escape"?(x.preventDefault(),I()):x.key==="ArrowDown"?(x.preventDefault(),c(1)):x.key==="ArrowUp"?(x.preventDefault(),c(-1)):x.key==="Enter"&&(x.preventDefault(),m(r))}function h(){const x=o??l();x.classList.remove("hidden"),x.style.display="",r=0,n&&(n.value="",n.focus()),f()}function I(){o&&(o.style.display="none",i=[])}function A(){return!!o&&o.style.display!=="none"}function y(x){(x.ctrlKey||x.metaKey)&&(x.key==="k"||x.key==="K")&&(x.preventDefault(),A()?I():h())}e.addEventListener("keydown",y);let $=null;function b(){const x=e.getElementById("period-bar");if(!x||e.getElementById(Po))return;const p=e.createElement("button");p.id=Po,p.type="button",p.className="btn-secondary",p.title="Buscar en toda la aplicación (Ctrl+K)",p.setAttribute("aria-label","Buscar"),p.textContent="🔍 Buscar",p.style.marginLeft="auto",p.addEventListener("click",h),x.appendChild(p),$=p}return b(),()=>{e.removeEventListener("keydown",y),$==null||$.remove(),o==null||o.remove(),o=null,n=null,s=null}}const na="aviso-guardado";function Ai(t){const e=t.doc??document,a=t.contenedor??(()=>e.getElementById("toast-container")),o=t.msExito??1800,n=t.cambios.crearMarca("guardado");let s="oculto",i=!1,r=null,l=null;function u(){var h;r&&clearTimeout(r),r=null,(h=e.getElementById(na))==null||h.remove()}function f(){if(s==="oculto")return u();const h=a();if(!h)return;let I=e.getElementById(na);I||(I=e.createElement("div"),I.id=na,h.appendChild(I)),I.className=`toast toast-guardado toast-guardado--${s}`,I.style.display="flex",I.style.alignItems="center",I.style.gap="12px",I.textContent="";const A=e.createElement("span");if(A.style.flex="1",I.appendChild(A),s==="pendiente")A.textContent="Tienes cambios sin guardar.",I.appendChild(c("Guardar ahora","btn-primary btn-sm",()=>void m())),I.appendChild(c("Ocultar","btn-secondary btn-sm",()=>{i=!0,s="oculto",f()}));else if(s==="subiendo"){A.textContent="Subiendo…";const y=e.createElement("span");y.className="guardado-giro",y.setAttribute("aria-hidden","true"),I.appendChild(y)}else s==="guardado"?A.textContent="¡Guardado!":s==="error"&&(A.textContent="No se ha podido guardar.",I.appendChild(c("Reintentar","btn-primary btn-sm",()=>void m())))}function c(h,I,A){const y=e.createElement("button");return y.type="button",y.className=I,y.textContent=h,y.style.flexShrink="0",y.addEventListener("click",A),y}async function m(){if(l)return l;r&&clearTimeout(r);const h=t.cambios.revision();return s="subiendo",f(),l=(async()=>{try{await t.guardar(),n.alDia(h),s="guardado",f(),r=setTimeout(()=>{s=n.pendiente()?"pendiente":"oculto",s==="pendiente"&&(i=!1),f()},o)}catch(I){console.error("[guardado] no se ha podido subir la copia:",I),s="error",f()}finally{l=null}})(),l}const v=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,s!=="subiendo"&&(s="pendiente",f()))});return{estado:()=>i&&s==="oculto"?"oculto":s,guardarAhora:m,detener(){v(),u()}}}function wi({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function n(h){return`view-${h}`}function s(h){const I=t.getElementById(n(h.route));if(I)return I;const A=t.querySelector(".view-container");if(!A)return null;const y=t.createElement("div");return y.id=n(h.route),y.className="view hidden",A.appendChild(y),y}function i(h){if(t.querySelector(`.nav-btn[data-view="${h.route}"]`))return;const I=t.querySelectorAll(".nav-section"),A=I[h.seccion??Math.max(0,I.length-1)];if(!A)return;const y=t.createElement("button");y.className="nav-btn",y.dataset.view=h.route,y.innerHTML=`${h.iconoPath?`<svg viewBox="0 0 24 24"><path d="${h.iconoPath}"/></svg>`:""}<span>${h.nombre}</span>`,A.appendChild(y),y.addEventListener("click",()=>{const $=globalThis.Router;$==null||$.navigate(h.route)})}function r(h){a.set(h.route,h),s(h),i(h)}function l(){return[...a.keys()].filter(h=>{const I=a.get(h);return!e||e(I.flagId??I.id)})}function u(h){return l().includes(h)}function f(h){const I=a.get(h);if(!I||e&&!e(I.flagId??I.id))return!1;const A=s(I);if(!A)return!1;if(o&&o!==h){const y=a.get(o),$=t.getElementById(n(o));y!=null&&y.unmount&&$&&y.unmount($)}return I.mount(A),o=h,!0}function c(){o&&f(o)}function m(){const h={};for(const[I,A]of a)h[I]=A.flagId??A.id;return h}function v(){for(const h of a.values())s(h),i(h)}return{register:r,routes:l,has:u,mount:f,rerender:c,flagPorRuta:m,attachToShell:v,get activa(){return o}}}function d(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Rt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${d(j(t))}</span>`}function Do(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function To(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${d(e)}</span>`).join(" ")}const Si=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function sa(t){const[e,a]=t.split("-").map(Number);return`${Si[a-1]} ${e}`}function q(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function Z(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function N(t,e,a){t.addEventListener("click",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function J(t,e,a){t.addEventListener("change",o=>{var s;const n=(s=o.target)==null?void 0:s.closest(e);n&&t.contains(n)&&a(n,o)})}function ft(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function No(t,e){const a=parseFloat(ft(t,e));return Number.isFinite(a)?a:0}function Mi(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Ci(t,e){const{ledger:a}=t,o=(t.hoy??Y)(),n=t.accounts().filter($=>$.activo),{desde:s,hasta:i}=Mi(e.mes),r={cuentaId:e.cuentaId||void 0,desde:s,hasta:i,texto:e.filtroTexto||void 0},l=a.transacciones(r),u=t.estimaciones().filter($=>$.tipo!=="transferencia"),f=l.filter($=>$.importeCts<0).reduce(($,b)=>$+b.importeCts,0),c=l.filter($=>$.importeCts>0).reduce(($,b)=>$+b.importeCts,0),m=e.cuentaId?a.saldoCuenta(e.cuentaId,i):a.saldoTotal(i),v=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),h=n.map($=>`<option value="${d($._id)}"${$._id===e.cuentaId?" selected":""}>${d($.nombre)}</option>`).join(""),I=$=>'<option value="">— sin asignar —</option>'+u.map(b=>`<option value="${d(b._id)}"${b._id===$?" selected":""}>${d(b.concepto)} (${d(j(b.cuantia))})</option>`).join(""),A=l.map($=>{var b;return`
      <tr data-tx="${d($._id)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${d($.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${d($.concepto)}</td>
        <td style="padding:7px 8px">${To($.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${d(((b=t.accounts().find(x=>x._id===$.cuentaId))==null?void 0:b.nombre)??$.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${d($._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${I($.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Rt(et($.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          <button class="btn-secondary" data-tx-editar="${d($._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${d($._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`}).join(""),y=v.slice().reverse().slice(0,8).map($=>{var b;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${d($.fecha)}</span>
        <span style="color:var(--text3)">${d(((b=t.accounts().find(x=>x._id===$.cuentaId))==null?void 0:b.nombre)??$.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${d(j(et($.saldoCts)))}</span>
        ${$.nota?`<span style="color:var(--text3)">${d($.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${d($._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
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
            <input class="form-input" type="month" id="acc-mes" value="${d(e.mes)}" style="width:140px"/>
          </div>
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${d(e.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${Rt(et(f))}</span>
          <span>Ingresos: ${Rt(et(c))}</span>
          <span>Neto: ${Rt(et(c+f))}</span>
          <span style="margin-left:auto">Saldo a ${d(i)}: <strong>${d(j(m))}</strong></span>
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
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="nt-fecha" value="${d(o)}"/></div>
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
            <datalist id="acc-tags-list">${t.tagsConocidas().map($=>`<option value="${d($)}"></option>`).join("")}</datalist>
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
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="pc-fecha" value="${d(o)}"/></div>
            <div class="form-group"><label class="form-label">Saldo (€)</label><input class="form-input" type="number" id="pc-saldo" step="0.01" placeholder="0,00"/></div>
          </div>
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${h}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${y?`<div class="mt-12">${y}</div>`:""}
        </div>
      </div>
    </div>`}function Ei(t,e,a,o){const{ledger:n}=e;J(t,"#acc-cuenta",i=>{a.cuentaId=i.value,o()}),J(t,"#acc-mes",i=>{a.mes=i.value||a.mes,o()});const s=t.querySelector("#acc-buscar");s==null||s.addEventListener("input",()=>{a.filtroTexto=s.value,clearTimeout(s._t),s._t=window.setTimeout(o,200)}),N(t,"#nt-guardar",()=>{const i=ft(t,"#nt-concepto").trim(),r=No(t,"#nt-importe");if(!i)return q("Indica un concepto","err");if(!(r>0))return q("Indica un importe mayor que cero","err");const l=ft(t,"#nt-tags").split(",").map(u=>u.trim().toLowerCase()).filter(Boolean);n.registrar({fecha:ft(t,"#nt-fecha")||(e.hoy??Y)(),cuentaId:ft(t,"#nt-cuenta"),importe:r,concepto:i,tags:l,tipo:ft(t,"#nt-tipo"),estimacionId:ft(t,"#nt-estimacion")||null}),q("Movimiento registrado"),e.onDatosCambiados(),o()}),N(t,"[data-tx-borrar]",i=>{const r=i.dataset.txBorrar;Z("¿Eliminar este movimiento?")&&(n.eliminar(r),q("Movimiento eliminado"),e.onDatosCambiados(),o())}),N(t,"[data-tx-editar]",i=>{const r=i.dataset.txEditar,l=n.transacciones().find(c=>c._id===r);if(!l)return;const u=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(et(l.importeCts))));if(u===null)return;const f=parseFloat(u.replace(",","."));if(!Number.isFinite(f)||f<=0)return q("Importe no válido","err");n.actualizar(r,{importe:f}),q("Movimiento actualizado"),e.onDatosCambiados(),o()}),J(t,"[data-tx-estimacion]",i=>{const r=i.getAttribute("data-tx-estimacion");n.asignarEstimacion(r,i.value||null),q("Asignación actualizada"),e.onDatosCambiados()}),N(t,"#pc-guardar",()=>{if(ft(t,"#pc-saldo").trim()==="")return q("Indica el saldo","err");const r=No(t,"#pc-saldo");n.registrarPuntoControl(ft(t,"#pc-cuenta"),ft(t,"#pc-fecha")||(e.hoy??Y)(),r,ft(t,"#pc-nota").trim()||void 0),q("Saldo real registrado"),e.onDatosCambiados(),o()}),N(t,"[data-pc-borrar]",i=>{Z("¿Eliminar este punto de control?")&&(n.eliminarPuntoControl(i.dataset.pcBorrar),q("Punto de control eliminado"),e.onDatosCambiados(),o())})}function ia(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:n=5}=a;if(t.precision===null||t.mediaRealReciente===null||t.meses.length===0||t.precision>=o)return null;const s=W(t.mediaRealReciente),i=W(s-e),r=e!==0?i/Math.abs(e)*100:s!==0?100:0;if(Math.abs(r)<n)return null;const l=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:W(e),cuantiaSugerida:s,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:l,motivo:i>0?`El gasto real de los últimos ${l} meses supera lo estimado`:`El gasto real de los últimos ${l} meses es inferior a lo estimado`}}function ji(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(s,i,r={}){const l=r.hoy??Y(),u=t.get("expenses"),f=u.find(h=>h._id===s);if(!f)throw new Error(`La estimación ${s} no existe`);const c={...f,fechaFin:l},m={...f,_id:e(),cuantia:W(i),fechaInicio:l,fechaFin:f.fechaFin??null,ajustadaDesdeId:f._id,ajustadaEn:l},v=u.map(h=>h._id===s?c:h);return v.push(m),t.set("expenses",v),{estimacionCerrada:c,estimacionNueva:m}}function o(s,i={}){const r=[],l=[];for(const u of s)try{r.push(a(u.estimacionId,u.cuantiaSugerida,i))}catch(f){l.push({estimacionId:u.estimacionId,error:f.message})}return{aplicadas:r,errores:l}}function n(s){const i=t.get("expenses"),r=new Map(i.map(I=>[I._id,I])),l=r.get(s);if(!l)return[];const u=[];let f=l;const c=new Set;for(;f!=null&&f.ajustadaDesdeId&&!c.has(f._id);){c.add(f._id);const I=r.get(f.ajustadaDesdeId);if(!I)break;u.unshift(I),f=I}const m=[];let v=l;const h=new Set([l._id]);for(;;){const I=i.find(A=>A.ajustadaDesdeId===v._id&&!h.has(A._id));if(!I)break;h.add(I._id),m.push(I),v=I}return[...u,l,...m]}return{aplicar:a,aplicarTodas:o,cadena:n}}function ra(t){const e=t.estimaciones(),a=new Map(e.map(o=>[o._id,o]));return t.precision.analizarTodas(e).map(o=>{const n=a.get(o.estimacionId);return{analisis:o,estimacion:n,sugerencia:ia(o,n.cuantia)}}).filter(o=>!!o.estimacion)}function _i(t){const e=ra(t),a=e.filter(l=>l.analisis.precision!==null),o=e.filter(l=>l.sugerencia!==null),n=t.precision.analizarPorTag(e.map(l=>l.analisis));if(a.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar. Registra movimientos y asígnalos a una
          estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada previsión,
          con la opción de ajustarla.
        </div>
      </div>`;const s=a.map(({analisis:l,estimacion:u,sugerencia:f})=>{const c=l.meses.slice(-6).map(m=>`${sa(m.mes)}: ${j(m.estimado)} → ${j(m.real)} (${m.precision.toFixed(0)}%)`).join(" · ");return`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:8px">
          <div style="font-size:13px;color:var(--text)">${d(u.concepto)}</div>
          <div style="margin-top:3px">${To(l.tags)}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:3px">${d(c)}</div>
        </td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${d(j(l.estimadoTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${d(j(l.realTotal))}</td>
        <td style="padding:8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Rt(l.desviacionTotal)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">${Do(l.precision)}</td>
        <td style="padding:8px;text-align:right;white-space:nowrap">
          ${f?`<button class="btn-secondary" data-sugerir="${d(l.estimacionId)}" style="padding:4px 9px;font-size:11px"
                   title="${d(f.motivo)}">Sugerir ajuste → ${d(j(f.cuantiaSugerida))}</button>`:'<span style="font-size:11px;color:var(--text3)">sin ajuste necesario</span>'}
        </td>
      </tr>`}).join(""),i=n.map(l=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${d(l.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${l.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${d(j(l.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${d(j(l.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Rt(l.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${Do(l.precision)}</td>
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
    </div>`}function zi(t,e,a){N(t,"[data-sugerir]",o=>{const n=o.dataset.sugerir,s=ra(e).find(l=>l.analisis.estimacionId===n);if(!(s!=null&&s.sugerencia))return;const i=s.sugerencia,r=`${i.concepto}

${i.motivo} (precisión ${i.precision.toFixed(1)}%).

Estimación actual: ${j(i.cuantiaActual)}
Nueva estimación: ${j(i.cuantiaSugerida)}

La estimación actual se cerrará hoy y se creará su continuación con el nuevo importe. ¿Aplicar?`;Z(r)&&(e.adjuster.aplicar(n,i.cuantiaSugerida,{hoy:e.hoy()}),q(`Estimación ajustada a ${j(i.cuantiaSugerida)}`),e.onDatosCambiados(),a())}),N(t,"#ajustar-todas",()=>{const o=ra(e).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const n=o.map(r=>`• ${r.concepto}: ${j(r.cuantiaActual)} → ${j(r.cuantiaSugerida)}`).join(`
`);if(!Z(`Se van a ajustar ${o.length} estimaciones:

${n}

¿Continuar?`))return;const{aplicadas:s,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});q(i.length>0?`${s.length} ajustadas, ${i.length} con error`:`${s.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const Fi=[";",",","	","|"],Pi={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function we(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function Se(t,e){const a=[];let o="",n=!1;for(let s=0;s<t.length;s++){const i=t[s];n?i==='"'?t[s+1]==='"'?(o+='"',s++):n=!1:o+=i:i==='"'?n=!0:i===e?(a.push(o.trim()),o=""):o+=i}return a.push(o.trim()),a}function Di(t){let e=";",a=-1;for(const o of Fi){const n=t.slice(0,20).map(l=>Se(l,o).length),s=Math.max(...n);if(s<2)continue;const r=n.filter(l=>l===s).length*10+s;r>a&&(a=r,e=o)}return e}function ue(t){let e=(t??"").trim();if(!e)return null;let a=!1;if(/^\(.*\)$/.test(e)&&(a=!0,e=e.slice(1,-1).trim()),e.endsWith("-")&&(a=!0,e=e.slice(0,-1).trim()),e.startsWith("-")&&(a=!0,e=e.slice(1).trim()),e.startsWith("+")&&(e=e.slice(1).trim()),e=e.replace(/[€$£\s  ]/g,""),!e)return null;const o=e.lastIndexOf(","),n=e.lastIndexOf(".");let s="";o>=0&&n>=0?s=o>n?",":".":o>=0?s=/,\d{3}$/.test(e)&&e.replace(/,/g,"").length>3?"":",":n>=0&&(s=/\.\d{3}$/.test(e)&&e.replace(/\./g,"").length>3?"":".");let i,r="0";if(s){const f=s===","?o:n;i=e.slice(0,f).replace(/[.,]/g,""),r=e.slice(f+1).replace(/[.,]/g,"")}else i=e.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const l=(r+"00").slice(0,2),u=Number(i||"0")*100+Number(l);return Number.isFinite(u)?a?-u:u:null}function la(t){const e=(t??"").trim();if(!e)return null;let a=e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a)return Oo(Number(a[1]),Number(a[2]),Number(a[3]));if(a=e.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),a){let o=Number(a[3]);return o<100&&(o+=o<70?2e3:1900),Oo(o,Number(a[2]),Number(a[1]))}return null}function Oo(t,e,a){if(e<1||e>12||a<1||a>31)return null;const o=new Date(t,e-1,a);return o.getFullYear()!==t||o.getMonth()!==e-1||o.getDate()!==a?null:`${t}-${String(e).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function Ro(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>la(a)!==null).length/e.length}function qo(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>ue(a)!==null).length/e.length}function Ti(t,e){const a={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,n=s=>e.map(i=>i[s]??"");for(const s of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=we(t[i]);if(r&&Pi[s].some(l=>r===l||r.startsWith(l)||r.includes(l))){if(s==="importe"&&we(t[i]).includes("saldo"))continue;a[s]=i,o.add(i);break}}if(a.fecha<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=Ro(n(r));l>i&&(i=l,s=r)}s>=0&&(a.fecha=s,o.add(s))}if(a.importe<0&&a.debe<0&&a.haber<0){let s=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||we(t[r]).includes("saldo"))continue;const l=qo(n(r));l>i&&(i=l,s=r)}s>=0&&(a.importe=s,o.add(s))}if(a.concepto<0){let s=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const l=n(r);if(qo(l)>.5||Ro(l)>.5)continue;const u=l.reduce((f,c)=>f+c.length,0)/Math.max(1,l.length);u>i&&(i=u,s=r)}s>=0&&(a.concepto=s)}return a}function Ni(t){const e=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(f=>f.trim()!=="");if(e.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const a=Di(e),o=e.map(f=>Se(f,a).length),n=Math.max(...o);let s=o.findIndex(f=>f===n);s<0&&(s=0);const i=Se(e[s],a);let r=e.slice(s+1).map(f=>Se(f,a));const l=la(i[0]??"")!==null||i.some(f=>ue(f)!==null&&/\d/.test(f));l&&(r=[i,...r]);const u=Ti(l?i.map(()=>""):i,r.slice(0,40));return{separador:a,cabeceras:l?i.map((f,c)=>`Columna ${c+1}`):i,filas:r,lineaCabecera:s+1,mapeo:u}}function Lo(t,e,a){return`${t}|${e}|${we(a).replace(/\s+/g," ")}`}function Oi(t,e,a=[]){const o=new Set(a.map(s=>Lo(s.fecha,s.importeCts,s.concepto))),n=new Set;return t.filas.map((s,i)=>{const r=[],l=e.fecha>=0?la(s[e.fecha]??""):null;e.fecha<0?r.push("sin columna de fecha"):l||r.push(`fecha ilegible: «${s[e.fecha]??""}»`);let u=null;if(e.importe>=0)u=ue(s[e.importe]??""),u===null&&r.push(`importe ilegible: «${s[e.importe]??""}»`);else if(e.debe>=0||e.haber>=0){const m=e.debe>=0?ue(s[e.debe]??""):null,v=e.haber>=0?ue(s[e.haber]??""):null;m===null&&v===null?r.push("sin importe en Debe ni en Haber"):m!==null&&m!==0?u=-Math.abs(m):v!==null&&v!==0?u=Math.abs(v):u=0}else r.push("sin columna de importe");u===0&&r.push("importe cero");const f=(e.concepto>=0?s[e.concepto]??"":"").trim()||"Movimiento importado";let c=!1;if(l&&u!==null){const m=Lo(l,u,f);c=o.has(m)||n.has(m),n.add(m)}return{linea:t.lineaCabecera+1+i,fecha:l,concepto:f,importeCts:u,errores:r,duplicada:c}})}function Ri(t,e){const a=t.filter(n=>n.errores.length===0&&(e||!n.duplicada)),o=a.map(n=>n.fecha).filter(n=>!!n).sort();return{total:t.length,importables:a.length,conError:t.filter(n=>n.errores.length>0).length,duplicadas:t.filter(n=>n.duplicada).length,sumaCts:a.reduce((n,s)=>n+(s.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function Me(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const qi=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function ca(t,e){if(!e.analisis||!e.mapeo){e.filas=[];return}const a=t.ledger.transacciones(e.cuentaId?{cuentaId:e.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));e.filas=Oi(e.analisis,e.mapeo,a)}function Li(t,e){const a=t.accounts().filter(n=>n.activo);if(!e.abierto)return`
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
      </div>`;const o=a.map(n=>`<option value="${d(n._id)}"${n._id===e.cuentaId?" selected":""}>${d(n.nombre)}</option>`).join("");return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Importar extracto</div>
        <button class="btn-secondary btn-sm" data-imp-cerrar>Cancelar</button>
      </div>

      ${e.error?`<div class="alert-card alert-danger mb-12"><div class="alert-body">${d(e.error)}</div></div>`:""}

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

      ${e.analisis&&e.mapeo?ki(e,e.analisis,e.mapeo):Bi()}
    </div>`}function Bi(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function ki(t,e,a){const o=Ri(t.filas,t.incluirDuplicadas),n=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+e.cabeceras.map((l,u)=>`<option value="${u}"${u===r?" selected":""}>${d(l||`Columna ${u+1}`)}</option>`).join(""),s=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${d(t.nombreFichero)}</strong> · ${e.filas.length} línea${e.filas.length!==1?"s":""}
      · separador <code>${d(e.separador==="	"?"tabulador":e.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${qi.map(r=>`<div class="form-group">
          <label class="form-label" for="imp-col-${r.clave}">${d(r.etiqueta)}</label>
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
        <div class="stat-value" style="font-size:1.15rem">${Rt(et(o.sumaCts))}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Periodo</div>
        <div class="stat-value" style="font-size:0.95rem">${o.desde?`${d(o.desde)} → ${d(o.hasta??"")}`:"—"}</div>
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
               <div class="alert-sub">${s.slice(0,4).map(r=>`línea ${r.linea}: ${d(r.errores[0])}`).join(" · ")}${s.length>4?" …":""}</div>
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
          ${i.map(r=>{const l=r.errores.length>0,u=l?r.errores[0]:r.duplicada?"repetido":"se importa",f=l?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${l?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${d(r.fecha??"—")}</td>
                <td style="font-size:12px">${d(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":d(j(et(r.importeCts)))}</td>
                <td style="font-size:11px;color:${f}">${d(u)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function Hi(t,e,a,o){N(t,"[data-imp-abrir]",()=>{const s=e.accounts().filter(i=>i.activo);Object.assign(a,Me(),{abierto:!0,cuentaId:s.length===1?s[0]._id:""}),o()}),N(t,"[data-imp-cerrar]",()=>{Object.assign(a,Me()),o()}),J(t,"#imp-cuenta",s=>{a.cuentaId=s.value,ca(e,a),o()}),J(t,"#imp-duplicadas",s=>{a.incluirDuplicadas=s.checked,o()}),J(t,"[data-imp-col]",s=>{const i=s,r=i.dataset.impCol;a.mapeo&&(a.mapeo[r]=Number(i.value),ca(e,a),o())});const n=t.querySelector("#imp-fichero");n==null||n.addEventListener("change",()=>{var i;const s=(i=n.files)==null?void 0:i[0];s&&Gi(s).then(r=>{const l=Ni(r);a.nombreFichero=s.name,a.error=l.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",a.analisis=l,a.mapeo={...l.mapeo},ca(e,a),o()}).catch(r=>{a.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),N(t,"[data-imp-confirmar]",()=>{if(!a.cuentaId)return;const s=a.filas.filter(i=>i.errores.length===0&&(a.incluirDuplicadas||!i.duplicada));if(s.length!==0){for(const i of s)e.ledger.registrar({fecha:i.fecha,cuentaId:a.cuentaId,importe:Math.abs(et(i.importeCts)),tipo:i.importeCts<0?"gasto":"ingreso",concepto:i.concepto,origen:"importado"});q(`${s.length} movimiento${s.length!==1?"s":""} importado${s.length!==1?"s":""}`),Object.assign(a,Me()),e.onDatosCambiados(),o()}})}function Gi(t){return t.arrayBuffer().then(e=>{const a=new TextDecoder("utf-8").decode(e);if(!a.includes("�"))return a;try{return new TextDecoder("iso-8859-1").decode(e)}catch{return a}})}function Vi(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function Ui(t,e){const a=G(t),o=[];for(let n=1;n<=e;n++){const s=new Date(a.getFullYear(),a.getMonth()-n,1);o.push(`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Yi(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function Bo(t,e){const{inicio:a,fin:o}=Yi(e);return ae([t],{start:a,end:o}).reduce((s,i)=>s+Math.abs(i.cuantia),0)}function Ji(t){function e(n,s={}){var x;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:l=Y()}=s,u=t.transacciones({estimacionId:n._id}),c=u.length===0&&(((x=n.tags)==null?void 0:x.length)??0)>0?t.transacciones({tags:n.tags}):u,m=new Map;for(const p of c){const g=p.fecha.slice(0,7);m.set(g,(m.get(g)??0)+Math.abs(p.importeCts)/100)}const v=[];for(const p of Ui(l,i)){const g=m.get(p);if(g===void 0)continue;const w=W(Bo(n,p));v.push({mes:p,estimado:w,real:W(g),desviacion:W(g-w),precision:Vi(w,g)})}const h=W(v.reduce((p,g)=>p+g.estimado,0)),I=W(v.reduce((p,g)=>p+g.real,0)),A=v.reduce((p,g)=>p+Math.abs(g.estimado),0),y=v.length===0?null:A>0?v.reduce((p,g)=>p+g.precision*Math.abs(g.estimado),0)/A:v.reduce((p,g)=>p+g.precision,0)/v.length,$=v.slice(-r),b=$.length>0?W($.reduce((p,g)=>p+g.real,0)/$.length):null;return{estimacionId:n._id,concepto:n.concepto,tags:n.tags??[],meses:v,estimadoTotal:h,realTotal:I,desviacionTotal:W(I-h),precision:y,mediaRealReciente:b,infraestimada:I>h}}function a(n,s={}){return n.filter(i=>i.tipo!=="transferencia").map(i=>e(i,s)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(n){const s=new Map;for(const i of n)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const l=s.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};l.estimado+=i.estimadoTotal,l.real+=i.realTotal,l.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),l.peso+=Math.abs(i.estimadoTotal),l.n+=1,s.set(r,l)}return[...s.entries()].map(([i,r])=>({tag:i,estimadoTotal:W(r.estimado),realTotal:W(r.real),desviacionTotal:W(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}function Wi(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Ki(t){const[e,a]=t.slice(0,7).split("-").map(Number),o=new Date(e,a-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function Qi(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function Xi(t,e,a){const o=new Map(e.map(s=>[s._id,[]])),n=e.filter(s=>{var i;return!a(s._id)&&(((i=s.tags)==null?void 0:i.length)??0)>0});for(const s of t){if(s.estimacionId&&o.has(s.estimacionId)){o.get(s.estimacionId).push(s);continue}if(s.estimacionId)continue;let i=null,r=0;for(const l of n){const u=(l.tags??[]).filter(f=>s.tags.includes(f)).length;u!==0&&(u>r||u===r&&i&&l._id<i._id)&&(i=l,r=u)}i&&o.get(i._id).push(s)}return o}function Zi(t,e,a,o={}){const{desde:n,hasta:s}=Wi(a),i=t.transacciones({desde:n,hasta:s}),r=i.filter(b=>b.importeCts<0),l=i.filter(b=>b.importeCts>0),u=e.filter(b=>b.tipo==="gasto"&&b.activo!==!1),f=new Map((o.analisis??[]).map(b=>[b.estimacionId,b])),c=new Set(u.filter(b=>t.transacciones({estimacionId:b._id}).length>0).map(b=>b._id)),m=Xi(r,u,b=>c.has(b)),v=new Set,h=u.map(b=>{const x=m.get(b._id)??[];for(const S of x)v.add(S._id);const p=W(x.reduce((S,E)=>S+Math.abs(E.importeCts)/100,0)),g=W(Bo(b,a)),w=f.get(b._id);return{estimacionId:b._id,concepto:b.concepto,tags:b.tags??[],estimado:g,real:p,desviacion:W(p-g),sinMovimiento:x.length===0,sugerencia:w?ia(w,b.cuantia,{hoy:o.hoy}):null}}),I=new Map;for(const b of r){if(v.has(b._id))continue;const x=Qi(b.concepto),p=I.get(x)??{concepto:b.concepto,total:0,movimientos:0};p.total=W(p.total+Math.abs(b.importeCts)/100),p.movimientos+=1,I.set(x,p)}const A=[...I.values()].sort((b,x)=>x.total-b.total),y=W(h.reduce((b,x)=>b+x.estimado,0)),$=W(r.reduce((b,x)=>b+Math.abs(x.importeCts)/100,0));return{mes:a,estimado:y,real:$,desviacion:W($-y),ingresosReales:W(l.reduce((b,x)=>b+x.importeCts/100,0)),filas:h.sort((b,x)=>Math.abs(x.desviacion)-Math.abs(b.desviacion)),sinEstimacion:A,totalSinEstimacion:W(A.reduce((b,x)=>b+x.total,0)),vacio:i.length===0}}function ko(t){const e=new Set;for(const a of t.transacciones())e.add(a.fecha.slice(0,7));return[...e].sort().reverse()}function tr(){return{mes:""}}function da(t,e){if(e.mes)return e.mes;const a=ko(t.ledger),o=Ki((t.hoy??Y)());return a.includes(o)?o:a[0]??o}function ua(t,e){const a=(t.hoy??Y)(),o=t.estimaciones(),n=t.precision.analizarTodas(o,{hoy:a});return Zi(t.ledger,o,e,{analisis:n,hoy:a})}function er(t,e){const a=da(t,e),o=ko(t.ledger);o.includes(a)||o.unshift(a);const n=ua(t,a),s=`
    <select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
      ${o.map(l=>`<option value="${d(l)}"${l===a?" selected":""}>${d(sa(l))}</option>`).join("")}
    </select>`;if(n.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">Cierre de mes</div>
          ${s}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados en ${d(sa(a))}. Importa el extracto del banco o
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
          <div class="stat-value" style="font-size:1.15rem">${d(j(n.estimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Has gastado</div>
          <div class="stat-value" style="font-size:1.15rem">${d(j(n.real))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación</div>
          <div class="stat-value" style="font-size:1.15rem;color:${r}">${i(n.desviacion)}${d(j(n.desviacion))}</div>
          <div class="stat-sub">${n.desviacion>0?"de más":n.desviacion<0?"de menos":"clavado"}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${n.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${d(j(n.totalSinEstimacion))}</div>
          <div class="stat-sub">${n.sinEstimacion.length} concepto${n.sinEstimacion.length!==1?"s":""}</div>
        </div>
      </div>

      ${ar(n)}
      ${or(n)}
    </div>`}function ar(t){const e=t.filas.filter(o=>o.estimado>0||o.real>0);if(e.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas para este mes.</div>';const a=e.filter(o=>o.sugerencia);return`
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
                  ${d(o.concepto)}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${d(j(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${d(j(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${n}">
                  ${o.desviacion>0?"+":""}${d(j(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${s?`<button class="btn-secondary btn-sm" data-cie-ajustar="${d(o.estimacionId)}"
                           title="Pasar la estimación de ${d(j(s.cuantiaActual))} a ${d(j(s.cuantiaSugerida))}"
                           style="font-size:11px;padding:2px 9px">→ ${d(j(s.cuantiaSugerida))}</button>`:""}
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
           </div>`:""}`}function or(t){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
                <td style="font-size:12px">${d(e.concepto)}</td>
                <td style="text-align:right;font-size:12px;color:var(--text3)">${e.movimientos}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:var(--yellow)">${d(j(e.total))}</td>
              </tr>`).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function nr(t,e,a,o){J(t,"#cie-mes",n=>{a.mes=n.value,o()}),N(t,"[data-cie-ajustar]",n=>{const s=n.dataset.cieAjustar,r=ua(e,da(e,a)).filas.find(l=>l.estimacionId===s);r!=null&&r.sugerencia&&(e.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(e.hoy??Y)()}),q(`«${r.concepto}» ajustada a ${j(r.sugerencia.cuantiaSugerida)}`),e.onDatosCambiados(),o())}),N(t,"[data-cie-ajustar-todas]",()=>{const s=ua(e,da(e,a)).filas.map(l=>l.sugerencia).filter(l=>l!==null);if(s.length===0)return;const{aplicadas:i,errores:r}=e.adjuster.aplicarTodas(s,{hoy:(e.hoy??Y)()});q(`${i.length} estimación${i.length!==1?"es":""} ajustada${i.length!==1?"s":""}`+(r.length>0?` · ${r.length} con error`:"")),e.onDatosCambiados(),o()})}const sr="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h5v2H6v-2zm0 4h8v2H6v-2z";function ir(t){const e={cuentaId:"",mes:(t.hoy??Y)().slice(0,7),filtroTexto:""},a=Me(),o=tr(),n=()=>{var c;return(c=t.onDatosCambiados)==null?void 0:c.call(t)},s=t.hoy??Y,i={ledger:t.ledger,accounts:t.accounts,estimaciones:t.estimaciones,tagsConocidas:()=>t.tags.todas(),onDatosCambiados:n,hoy:s},r={ledger:t.ledger,accounts:t.accounts,onDatosCambiados:n},l={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:n,hoy:s},u={precision:t.precision,adjuster:t.adjuster,estimaciones:t.estimaciones,onDatosCambiados:n,hoy:s};function f(c){const m=t.ledger.saldoTotal(s()),v=t.ledger.ultimaFecha(),h=t.ledger.transacciones().length;c.innerHTML=`
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
          <div class="stat-value" style="font-size:1.3rem">${d(j(m))}</div>
          <div style="font-size:11px;color:var(--text3)">suma de cuentas activas</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Movimientos registrados</div>
          <div class="stat-value" style="font-size:1.3rem">${h}</div>
          <div style="font-size:11px;color:var(--text3)">${v?`último: ${d(v)}`:"ninguno todavía"}</div>
        </div>
      </div>

      <div id="acc-importar"></div>
      <div id="acc-cierre" data-feature="precision-estimaciones"></div>
      <div id="acc-transacciones"></div>
      <div id="acc-precision" data-feature="precision-estimaciones"></div>`;const I=c.querySelector("#acc-importar"),A=c.querySelector("#acc-cierre"),y=c.querySelector("#acc-transacciones"),$=c.querySelector("#acc-precision");I.innerHTML=Li(r,a),A.innerHTML=er(l,o),y.innerHTML=Ci(i,e),$.innerHTML=_i(u);const b=()=>f(c);Hi(I,r,a,b),nr(A,l,o,b),Ei(y,i,e,b),zi($,u,b)}return{id:"contabilidad",route:"contabilidad",nombre:"Contabilidad",flagId:"contabilidad",seccion:1,iconoPath:sr,mount:f}}const rr="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function pa(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function lr(t){const{store:e}=t,a=t.hoy??Y,o=()=>G(a()),n=()=>e.get("config").margenesSeguridad??[];function s(v){var h;e.patchConfig({margenesSeguridad:v}),(h=t.onDatosCambiados)==null||h.call(t)}function i(v,h){const I=n().map(y=>({...y,puntos:(y.puntos??[]).map($=>({...$}))})),A=I.find(y=>y._id===v);A&&(h(A),s(I))}function r(v){const h=e.get("config"),I=$e(v,e.get("expenses"),h,e.get("loans"),a(),!1,o());return j(I)}function l(v,h,I){const A=h.tipo==="fijo",y=A?"":`<span class="text-sm" style="color:var(--text3)">${d(j((h.meses??0)*I))}</span>`;return`
      <tr data-punto="${d(h._id)}" data-margen="${d(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${d(h.fecha)}" data-campo="fecha"/>
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
        <td style="padding:4px 6px">${y}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function u(v,h,I){const A=v.cuentas&&v.cuentas.length>0?v.cuentas.map(x=>{var p;return((p=h.find(g=>g._id===x))==null?void 0:p.nombre)??x}).join(", "):"Todas las cuentas activas",$=[...v.puntos??[]].sort((x,p)=>x.fecha.localeCompare(p.fecha)).map(x=>l(v,x,I)).join(""),b=v.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${d(A)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${d(r(v))}</strong>
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
            ${$||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
          </tbody>
        </table>
      </div>
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${d(v._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${d(v.nombre)}</span>
            <span class="badge ${v.activo?"badge-active":"badge-inactive"}">${v.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${v.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${v.activo?"checked":""} data-toggle-margen="${d(v._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${d(v._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${d(v._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${b}
      </div>`}function f(v,h){const I=h?n().find(b=>b._id===h):null,A=e.get("accounts").filter(b=>b.activo),y=new Set((I==null?void 0:I.cuentas)??[]),$=A.map(b=>`
        <label class="tag" data-chip="${d(b._id)}" style="cursor:pointer;${y.has(b._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${d(b._id)}" ${y.has(b._id)?"checked":""} style="display:none"/>
          ${d(b.nombre)}
        </label>`).join(" ");v.innerHTML=`
      <div class="modal-title">${h?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${d((I==null?void 0:I.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${$||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${I?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${d(Y())}"/></div>
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
        <button class="btn-primary" data-guardar-margen="${d(h??"")}">Guardar</button>
      </div>`}function c(v,h){const I=document.getElementById("modal-overlay"),A=document.getElementById("modal-content");!I||!A||(f(A,v),I.classList.remove("hidden"),J(A,".mg-acc-chip",y=>{const $=y,b=A.querySelector(`[data-chip="${$.value}"]`);b&&(b.style.cssText=`cursor:pointer;${$.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),J(A,"#mg-p-tipo",y=>{const $=y.value==="fijo",b=A.querySelector("#mg-p-importe-wrap"),x=A.querySelector("#mg-p-meses-wrap");b&&(b.style.display=$?"":"none"),x&&(x.style.display=$?"none":"")}),N(A,"[data-cerrar-form]",()=>I.classList.add("hidden")),N(A,"[data-guardar-margen]",y=>{var g,w,S,E,_;const $=y.getAttribute("data-guardar-margen")||"",b=((g=A.querySelector("#mg-nombre"))==null?void 0:g.value.trim())??"";if(!b)return q("El nombre es obligatorio","err");const x=[...A.querySelectorAll(".mg-acc-chip:checked")].map(P=>P.value),p=n().map(P=>({...P}));if($){const P=p.findIndex(C=>C._id===$);if(P===-1)return q("Margen no encontrado","err");p[P]={...p[P],nombre:b,cuentas:x}}else{const P=((w=A.querySelector("#mg-p-tipo"))==null?void 0:w.value)??"fijo",C={_id:pa(),fecha:((S=A.querySelector("#mg-p-fecha"))==null?void 0:S.value)||Y(),tipo:P,importe:parseFloat(((E=A.querySelector("#mg-p-importe"))==null?void 0:E.value)??"0")||0,meses:parseFloat(((_=A.querySelector("#mg-p-meses"))==null?void 0:_.value)??"1")||1};p.push({_id:pa(),nombre:b,activo:!0,cuentas:x,puntos:[C]})}s(p),q($?"Margen actualizado":"Margen creado"),I.classList.add("hidden"),h()}))}function m(v){const h=n(),I=e.get("accounts"),A=ne(e.get("expenses"),o());v.innerHTML=`
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
             </div>`:h.map($=>u($,I,A)).join("")}`;const y=()=>m(v);N(v,"[data-nuevo-margen]",()=>c(null,y)),N(v,"[data-editar-margen]",$=>c($.getAttribute("data-editar-margen"),y)),N(v,"[data-borrar-margen]",$=>{Z("¿Eliminar este margen de seguridad?")&&(s(n().filter(b=>b._id!==$.getAttribute("data-borrar-margen"))),q("Margen eliminado"),y())}),J(v,"[data-toggle-margen]",$=>{const b=$.getAttribute("data-toggle-margen");i(b,x=>{x.activo=$.checked}),y()}),N(v,"[data-add-punto]",$=>{const b=$.getAttribute("data-add-punto");i(b,x=>{x.puntos=[...x.puntos??[],{_id:pa(),fecha:Y(),tipo:"fijo",importe:0,meses:1}]}),y()}),N(v,"[data-borrar-punto]",$=>{const b=$.closest("[data-punto]");if(!b)return;const x=b.dataset.margen,p=b.dataset.punto;i(x,g=>{g.puntos=(g.puntos??[]).filter(w=>w._id!==p)}),y()}),J(v,"[data-campo]",$=>{const b=$.closest("[data-punto]");if(!b)return;const x=$.getAttribute("data-campo"),p=$.value;i(b.dataset.margen,g=>{const w=(g.puntos??[]).find(S=>S._id===b.dataset.punto);w&&(x==="fecha"?w.fecha=p:x==="tipo"?w.tipo=p:x==="importe"?w.importe=parseFloat(p)||0:w.meses=parseFloat(p)||0)}),y()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:rr,mount:m}}const cr="https://api.worldbank.org/v2/country/ES/indicator/FP.CPI.TOTL.ZG?format=json&mrv=65&per_page=65";function dr(t){const e=Array.isArray(t)?t[1]??[]:[];return Array.isArray(e)?e.filter(a=>a&&a.value!==null&&a.value!==void 0&&Number.isFinite(Number(a.value))).map(a=>({year:parseInt(a.date),tasa:parseFloat(Number(a.value).toFixed(2))})).filter(a=>Number.isFinite(a.year)).sort((a,o)=>a.year-o.year):[]}function ur({fetchImpl:t,url:e=cr}={}){let a=null,o=!1;async function n(s=!1){if(a&&!s)return a;if(o)return null;o=!0;try{const r=await(t??fetch)(e);if(!r.ok)throw new Error(`HTTP ${r.status}`);return a=dr(await r.json()),a}catch(i){return console.error("[inflacion] No se pudo cargar el IPC del Banco Mundial:",i),null}finally{o=!1}}return{obtener:n,invalidar:()=>{a=null},get enCache(){return a}}}const pr="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z";function mr(t){return t>5?"var(--red)":t>2.5?"var(--yellow)":"var(--accent)"}function fr(t){const{store:e}=t,a=t.ipc??ur(),o=()=>e.get("inflacion")??[];function n(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function s(c,m){if(!c||c.length===0)return`
        <div class="auth-hint" style="border-color:var(--red);color:var(--red);margin-bottom:12px">
          ⚠ No se pudo conectar con la API del Banco Mundial. Comprueba tu conexión a internet.
        </div>
        <div class="flex" style="justify-content:flex-end">
          <button class="btn-secondary" data-ipc-cerrar>Cerrar</button>
        </div>`;const v=new Set(o().map($=>$.year)),h=c.filter($=>$.year>=m).reverse(),I=h.filter($=>!v.has($.year)).length,A=[...new Set(c.map($=>$.year))].sort(($,b)=>$-b),y=h.map($=>`
        <div style="display:grid;grid-template-columns:20px 60px 80px 1fr;gap:10px;align-items:center;padding:5px 0;border-bottom:1px solid var(--border)">
          <input type="checkbox" class="ipc-chk" data-year="${$.year}" data-tasa="${$.tasa}" ${v.has($.year)?"disabled":"checked"}/>
          <span style="font-family:var(--font-mono);font-weight:600">${$.year}</span>
          <span style="font-family:var(--font-mono);font-weight:600;color:${mr($.tasa)}">${$.tasa.toFixed(2)}%</span>
          ${v.has($.year)?'<span style="font-size:10px;color:var(--text3)">ya guardado</span>':'<span style="font-size:10px;color:var(--accent)">nuevo</span>'}
        </div>`).join("");return`
      <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap">
        <label class="form-label" style="white-space:nowrap">Desde el año:</label>
        <select class="form-input" id="ipc-desde" style="width:auto;padding:4px 8px;font-size:12px">
          ${A.map($=>`<option value="${$}"${$===m?" selected":""}>${$}</option>`).join("")}
        </select>
        <span style="font-size:10px;color:var(--text3)">
          Fuente: Banco Mundial · FP.CPI.TOTL.ZG · ${c[0].year}–${c[c.length-1].year}
        </span>
        <button class="btn-secondary btn-sm" data-ipc-recargar title="Forzar recarga desde la API">↺</button>
      </div>
      <div style="max-height:300px;overflow-y:auto;margin-bottom:12px">${y}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
        <span style="font-size:12px;color:var(--text3)">${I} periodo${I!==1?"s":""} nuevo${I!==1?"s":""} disponible${I!==1?"s":""}</span>
        <div class="flex gap-8">
          <button class="btn-secondary" data-ipc-cerrar>Cancelar</button>
          <button class="btn-primary" data-ipc-importar ${I===0?"disabled":""}>↓ Importar seleccionados</button>
        </div>
      </div>`}function i(c){return!c||c.length===0?2e3:Math.max(c[0].year,new Date().getFullYear()-25)}async function r(c){const m=document.getElementById("modal-overlay"),v=document.getElementById("modal-content");if(!m||!v)return;v.innerHTML=`
      <div class="modal-title">Importar IPC histórico — España</div>
      <div id="ipc-body" style="text-align:center;padding:24px 0">
        <div style="font-size:13px;color:var(--text3)">Consultando Banco Mundial…</div>
      </div>`,m.classList.remove("hidden");const h=(A,y)=>{const $=document.getElementById("ipc-body");$&&($.innerHTML=s(A,y))},I=await a.obtener();h(I,i(I)),N(v,"[data-ipc-cerrar]",()=>m.classList.add("hidden")),J(v,"#ipc-desde",A=>{h(a.enCache,parseInt(A.value))}),N(v,"[data-ipc-recargar]",()=>{a.invalidar();const A=document.getElementById("ipc-body");A&&(A.innerHTML='<div style="text-align:center;padding:20px;color:var(--text3)">Recargando…</div>'),a.obtener(!0).then(y=>h(y,i(y)))}),N(v,"[data-ipc-importar]",()=>{const A=[...v.querySelectorAll(".ipc-chk:checked:not(:disabled)")];if(A.length===0)return q("Nada seleccionado","err");const y=new Set(o().map(b=>b.year));let $=0;for(const b of A){const x=parseInt(b.dataset.year??""),p=parseFloat(b.dataset.tasa??"");!Number.isFinite(x)||!Number.isFinite(p)||y.has(x)||(e.addItem("inflacion",{year:x,tasa:p}),y.add(x),$++)}m.classList.add("hidden"),q(`${$} periodo${$!==1?"s":""} importado${$!==1?"s":""} correctamente`),n(),c()})}function l(c,m){var y;const v=document.getElementById("modal-overlay"),h=document.getElementById("modal-content");if(!v||!h)return;const I=c?o().find($=>$._id===c):null;h.innerHTML=`
      <div class="modal-title">${c?"Editar periodo de inflación":"Nuevo periodo de inflación"}</div>
      <div class="grid-2">
        <div class="form-group"><label class="form-label">Año</label>
          <input class="form-input" type="number" id="inf-year" value="${(I==null?void 0:I.year)??new Date().getFullYear()}" placeholder="2026"/></div>
        <div class="form-group"><label class="form-label">Tasa anual (%)</label>
          <input class="form-input" type="number" id="inf-tasa" step="0.01" value="${(I==null?void 0:I.tasa)??""}" placeholder="3.5"/></div>
      </div>
      <div id="inf-preview" class="auth-hint mt-12" style="font-size:12px"></div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-inf-cerrar>Cancelar</button>
        <button class="btn-primary" data-inf-guardar="${d(c??"")}">Guardar</button>
      </div>`,v.classList.remove("hidden");const A=()=>{var g;const $=parseFloat(((g=h.querySelector("#inf-tasa"))==null?void 0:g.value)??""),b=h.querySelector("#inf-preview");if(!b)return;if(!Number.isFinite($)||$<=0){b.innerHTML="";return}const x=(Math.pow(1+$/100,1/12)-1)*100,p=Math.pow(1+$/100,5);b.innerHTML=`Con un ${$}% anual: <strong>${x.toFixed(3)}%/mes</strong> · factor acumulado a 5 años: <strong>×${p.toFixed(3)}</strong> (+${((p-1)*100).toFixed(1)}%)`};(y=h.querySelector("#inf-tasa"))==null||y.addEventListener("input",A),A(),N(h,"[data-inf-cerrar]",()=>v.classList.add("hidden")),N(h,"[data-inf-guardar]",$=>{const b=$.getAttribute("data-inf-guardar")||"",x=parseInt(h.querySelector("#inf-year").value),p=parseFloat(h.querySelector("#inf-tasa").value);if(!Number.isFinite(x)||x<1900||x>2200)return q("Año inválido","err");if(!Number.isFinite(p)||p<0||p>100)return q("Tasa inválida (0–100%)","err");if(o().filter(w=>w._id!==b).some(w=>w.year===x))return q("Ya existe un periodo para ese año","err");b?(e.updateItem("inflacion",b,{year:x,tasa:p}),q("Periodo actualizado")):(e.addItem("inflacion",{year:x,tasa:p}),q("Periodo añadido")),v.classList.add("hidden"),n(),m()})}function u(c,m){const v=(Math.pow(1+c.tasa/100,.08333333333333333)-1)*100,h=`${c.year}-12-31`,I=h>m?pt([c],m,h):null;return`
      <div class="exp-table-row" data-periodo="${d(c._id??"")}">
        <div style="font-weight:600;font-family:var(--font-mono)">${c.year}</div>
        <div class="num" style="color:var(--yellow);font-weight:600">${c.tasa.toFixed(2)}%</div>
        <div class="text-sm" style="color:var(--text2)">${v.toFixed(3)}%/mes</div>
        <div class="num">${I!==null?`×${I.toFixed(3)}`:"—"}</div>
        <div class="flex gap-8 items-center">
          <button class="btn-icon" data-editar-periodo="${d(c._id??"")}" title="Editar">
            <svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button class="btn-danger" data-borrar-periodo="${d(c._id??"")}" title="Eliminar">✕</button>
        </div>
      </div>`}function f(c){const m=o(),v=e.get("config").usarInflacion||!1,h=[...m].sort((g,w)=>w.year-g.year),I=Y(),A=new Date().getFullYear(),y=V(new Date(A+5,0,1)),$=V(new Date(A+10,0,1)),b=v&&m.length>0?pt(m,I,y):null,x=v&&m.length>0?pt(m,I,$):null;c.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Estimaciones de <span>inflación</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-importar-ipc title="Descarga el IPC histórico de España del Banco Mundial">↓ Cargar IPC histórico</button>
          <button class="btn-primary" data-nuevo-periodo>+ Añadir periodo</button>
        </div>
      </div>

      ${!v&&m.length===0?`<div class="card mb-14" style="padding:16px 20px;border-color:var(--border2)">
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
        ${b!==null&&x!==null?`<div class="grid-2 mt-14" style="gap:10px">
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +5 años</div>
            <div class="stat-value neg">×${b.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((b-1)*100).toFixed(1)}%)</span></div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Inflación acumulada +10 años</div>
            <div class="stat-value neg">×${x.toFixed(3)} <span style="font-size:13px;font-weight:400">(+${((x-1)*100).toFixed(1)}%)</span></div>
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
        ${h.length===0?'<div class="text-sm" style="text-align:center;padding:30px;color:var(--text2)">Sin periodos configurados. Añade el primer registro.</div>':h.map(g=>u(g,I)).join("")}
      </div>

      <div class="auth-hint mt-14">
        <strong>¿Cómo funciona?</strong> Para cada movimiento futuro se calcula el factor de inflación
        acumulada desde su fecha de inicio hasta la del movimiento, con el tipo del periodo
        correspondiente. Si falta el tipo de un año, se aplica el último conocido.
      </div>`;const p=()=>f(c);J(c,"[data-toggle-inflacion]",g=>{const w=g.checked;e.patchConfig({usarInflacion:w}),q(w?"Estimaciones de inflación activadas":"Estimaciones de inflación desactivadas"),n(),p()}),N(c,"[data-nuevo-periodo]",()=>l(null,p)),N(c,"[data-editar-periodo]",g=>l(g.getAttribute("data-editar-periodo"),p)),N(c,"[data-importar-ipc]",()=>void r(p)),N(c,"[data-borrar-periodo]",g=>{Z("¿Eliminar este periodo de inflación?")&&(e.removeItem("inflacion",g.getAttribute("data-borrar-periodo")),q("Periodo eliminado"),n(),p())})}return{id:"inflacion",route:"inflacion",nombre:"Inflación",flagId:"inflacion",seccion:2,iconoPath:pr,mount:f}}const vr=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],gr=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],br=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function hr(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const ma=(t,e)=>t.map(([a,o])=>`<option value="${d(a)}"${a===e?" selected":""}>${d(o)}</option>`).join("");function Ho(t,e="dp"){const{modo:a,dia:o,nth:n,wd:s}=hr(t),i=ma(vr.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${d(e)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${ma(gr,n)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${ma(br,s)}</select>
        del mes
      </span>
    </div>
  </div>`}function Go(t){var o,n,s;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(n=e.querySelector("[data-dp-dia]"))==null||n.style.setProperty("display",a==="dia"?"":"none"),(s=e.querySelector("[data-dp-nth]"))==null||s.style.setProperty("display",a==="nthweekday"?"":"none")}function Vo(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=n=>{var s;return((s=e.querySelector(n))==null?void 0:s.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const yr="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",xr=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function $r(t){const e=t.hoy??Y,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var y;return(y=t.onDatosCambiados)==null?void 0:y.call(t)},n=()=>t.store.get("accounts"),s=y=>{var $;return(($=n().find(b=>b._id===(y||"default")))==null?void 0:$.nombre)??(y||"default")};function i(){const y=e();let $=[...t.store.get("expenses")];if(a.mostrarExpirados||($=$.filter(b=>!b.fechaFin||b.fechaFin>=y)),a.tipo&&($=$.filter(b=>b.tipo===a.tipo)),a.cuenta&&($=$.filter(b=>(b.cuenta||"default")===a.cuenta)),a.desde&&($=$.filter(b=>(b.fechaInicio??"")>=a.desde)),a.hasta&&($=$.filter(b=>(b.fechaInicio??"")<=a.hasta)),a.busqueda){const b=a.busqueda.toLowerCase();$=$.filter(x=>x.concepto.toLowerCase().includes(b))}return a.tags.size>0&&($=$.filter(b=>(b.tags||[]).some(x=>a.tags.has(x)))),$.sort((b,x)=>{const p=b[a.orden]??"",g=x[a.orden]??"";return typeof p=="number"&&typeof g=="number"?(p-g)*a.sentido:String(p).localeCompare(String(g))*a.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(y=>y.tags||[]))].filter(Boolean).sort()}function l(y,$){const b=a.orden===y?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${y}">${d($)} <span class="sort-arrow">${b}</span></span>`}function u(y,$=!1){return($?'<option value="">Todas las cuentas</option>':"")+n().filter(x=>x.activo!==!1).map(x=>`<option value="${d(x._id)}"${x._id===y?" selected":""}>${d(x.nombre)}</option>`).join("")}function f(y){const $=y.tipo==="transferencia",b=Ne(y.diaPago??""),x=y.tipoFrecuencia==="extraordinario"?"Único":`Cada ${y.frecuencia??1} ${y.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${b?` · ${b}`:""}`,p=!!y.fechaFin&&y.fechaFin<e(),g=$?'<span class="badge badge-purple">⇄ transf.</span>':y.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',w=$?`${d(s(y.cuenta))} → ${d(s(y.cuentaDestino))}`:d(s(y.cuenta)),S=(y.tags||[]).map(E=>`<span class="tag${a.tags.has(E)?" active":""}" data-tag="${d(E)}" title="Filtrar por ${d(E)}">${d(E)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${d(y.concepto)}</div>
        <div class="tag-list mt-4">${S}</div>
      </div>
      <div>${g}</div>
      <div class="num ${y.tipo==="ingreso"?"pos":$?"":"neg"}">${$?"⇄ ":""}${d(j(y.cuantia))}</div>
      <div class="text-sm">${d(x)}</div>
      <div class="text-sm exp-col-hide">${w}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${d(y._id)}"${y.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${y.tipo==="gasto"&&y.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${y.tipo==="gasto"&&y.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${y.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${y.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${d(y.ajustadaEn??"")}">ajustada</span>`:""}
        ${p?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${d(y._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${d(y._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${d(y._id)}">✕</button>
      </div>
    </div>`}function c(y){const $=i(),b=r();y.innerHTML=`
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
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${d(a.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${a.tipo==="gasto"?" selected":""}>Gastos</option>
          <option value="ingreso"${a.tipo==="ingreso"?" selected":""}>Ingresos</option>
          <option value="transferencia"${a.tipo==="transferencia"?" selected":""}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${u(a.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${d(a.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${d(a.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${b.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${b.map(x=>`<span class="tag${a.tags.has(x)?" active":""}" data-tag="${d(x)}">${d(x)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${l("concepto","Concepto")} ${l("tipo","Tipo")} ${l("cuantia","Cuantía")} ${l("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${$.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':$.map(f).join("")}
      </div>`}function m(y){const $=(y==null?void 0:y.tipo)==="transferencia",b=t.store.get("escenarios"),x=(y==null?void 0:y.escenarioIds)||[],p=(g,w,S,E,_="")=>`<div class="form-group"><label class="form-label">${d(w)}</label>
       <input class="form-input" type="${S}" id="${g}" value="${d(E)}" placeholder="${d(_)}"/></div>`;return`
      <div class="grid-2">
        ${p("ef-concepto","Concepto","text",(y==null?void 0:y.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(y==null?void 0:y.tipo)==="gasto"||!(y!=null&&y.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(y==null?void 0:y.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${$?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${p("ef-cuantia","Cuantía (€)","number",(y==null?void 0:y.cuantia)??"","500")}
        ${p("ef-frecuencia","Frecuencia","number",(y==null?void 0:y.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${xr.map(([g,w])=>`<option value="${g}"${((y==null?void 0:y.tipoFrecuencia)??"mensual")===g?" selected":""}>${d(w)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${p("ef-fecha-ini","Fecha inicio","date",(y==null?void 0:y.fechaInicio)??e())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${u((y==null?void 0:y.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${$?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${u((y==null?void 0:y.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(y==null?void 0:y.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${y!=null&&y._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${p("ef-fecha-fin","Fecha fin (opcional)","date",(y==null?void 0:y.fechaFin)??"")}</div>
          <div class="mt-8">${Ho(y==null?void 0:y.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${$?' style="display:none"':""}>
            <div class="mt-8" id="ef-clasificacion-wrap"${(y==null?void 0:y.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${((y==null?void 0:y.clasificacion)??"necesidad")==="necesidad"?" selected":""}>Necesidad</option>
                  <option value="deseo"${(y==null?void 0:y.clasificacion)==="deseo"?" selected":""}>Deseo</option>
                  <option value=""${(y==null?void 0:y.clasificacion)===null?" selected":""}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label>
              <input class="form-input" type="text" id="ef-tags" value="${d(((y==null?void 0:y.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
            <div class="form-row mt-8">
              <label class="form-label">Gasto básico</label>
              <label class="toggle"><input type="checkbox" id="ef-basico"${y!=null&&y.basico?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Incluir en el cálculo del colchón económico</span>
            </div>
            <div class="form-row mt-8" id="ef-irpf-wrap"${(y==null?void 0:y.tipo)==="ingreso"?"":' style="display:none"'}>
              <label class="form-label">Sujeto a retención IRPF</label>
              <label class="toggle"><input type="checkbox" id="ef-sujetoIRPF"${y!=null&&y.sujetoIRPF?" checked":""}/><span class="toggle-slider"></span></label>
              <span class="text-sm" style="margin-left:6px">Calcula y proyecta la retención mensual</span>
            </div>
          </div>
          ${b.length>0?`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
                    ${b.map(g=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                                border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${x.includes(g._id)?d(g.color||"var(--accent)"):"var(--border)"}">
                          <input type="checkbox" class="ef-escenario" value="${d(g._id)}"${x.includes(g._id)?" checked":""}/>
                          ${d(g.nombre)}
                        </label>`).join("")}
                  </div></div>`:""}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${d((y==null?void 0:y._id)??"")}">Guardar</button>
      </div>`}function v(y){var x;const $=((x=y.querySelector("#ef-tipo"))==null?void 0:x.value)??"gasto",b=(p,g)=>{const w=y.querySelector(p);w&&(w.style.display=g?"":"none")};b("#ef-destino-wrap",$==="transferencia"),b("#ef-basico-wrap",$!=="transferencia"),b("#ef-irpf-wrap",$==="ingreso"),b("#ef-clasificacion-wrap",$==="gasto")}function h(y,$,b){const x=document.getElementById("modal-overlay"),p=document.getElementById("modal-content");!x||!p||(p.innerHTML=`<div class="modal-title">${d($)}</div>${m(y)}`,x.classList.remove("hidden"),J(p,"#ef-tipo",()=>v(p)),J(p,"[data-dp-modo]",()=>Go(p)),N(p,"[data-cancelar]",()=>x.classList.add("hidden")),N(p,"[data-guardar]",g=>{I(p,g.getAttribute("data-guardar")||"")&&(x.classList.add("hidden"),b())}))}function I(y,$){const b=P=>{var C;return((C=y.querySelector(P))==null?void 0:C.value)??""},x=P=>{var C;return!!((C=y.querySelector(P))!=null&&C.checked)},p=b("#ef-tipo")||"gasto",g=p==="transferencia",w=b("#ef-concepto").trim(),S=parseFloat(b("#ef-cuantia"));if(!w||!Number.isFinite(S))return q("Concepto y cuantía obligatorios","err"),!1;const E=b("#ef-clasificacion"),_={concepto:w,tipo:p,cuantia:S,frecuencia:parseInt(b("#ef-frecuencia"),10)||1,tipoFrecuencia:b("#ef-tipo-frec")||"mensual",fechaInicio:b("#ef-fecha-ini"),fechaFin:b("#ef-fecha-fin")||null,diaPago:Vo(y),cuenta:b("#ef-cuenta"),cuentaDestino:g?b("#ef-cuenta-dest")||"default":void 0,activo:x("#ef-activo"),basico:!g&&x("#ef-basico"),sujetoIRPF:!g&&x("#ef-sujetoIRPF"),clasificacion:p==="gasto"?E||null:void 0,tags:g?["transferencia"]:b("#ef-tags").split(",").map(P=>P.trim()).filter(Boolean),escenarioIds:[...y.querySelectorAll(".ef-escenario:checked")].map(P=>P.value)};return $?(t.store.updateItem("expenses",$,_),q("Actualizado")):(t.store.addItem("expenses",_),q("Creado")),o(),!0}function A(y,$){const b=y.querySelector("[data-busqueda]");let x;b==null||b.addEventListener("input",()=>{clearTimeout(x),x=setTimeout(()=>{a.busqueda=b.value,$();const p=y.querySelector("[data-busqueda]");p==null||p.focus(),p==null||p.setSelectionRange(p.value.length,p.value.length)},250)}),J(y,"[data-expirados]",p=>{a.mostrarExpirados=p.checked,$()}),J(y,"[data-f-tipo]",p=>{a.tipo=p.value,$()}),J(y,"[data-f-cuenta]",p=>{a.cuenta=p.value,$()}),J(y,"[data-f-desde]",p=>{a.desde=p.value,$()}),J(y,"[data-f-hasta]",p=>{a.hasta=p.value,$()}),N(y,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,$()}),N(y,"[data-limpiar-tags]",()=>{a.tags=new Set,$()}),N(y,"[data-tag]",p=>{const g=p.getAttribute("data-tag");a.tags.has(g)?a.tags.delete(g):a.tags.add(g),$()}),N(y,"[data-orden]",p=>{const g=p.getAttribute("data-orden");a.orden===g?a.sentido=a.sentido===1?-1:1:(a.orden=g,a.sentido=1),$()}),N(y,"[data-nuevo]",()=>h(null,"Nuevo gasto/ingreso",$)),N(y,"[data-editar]",p=>{const g=t.store.get("expenses").find(w=>w._id===p.getAttribute("data-editar"));g&&h(g,"Editar",$)}),N(y,"[data-duplicar]",p=>{const g=t.store.get("expenses").find(E=>E._id===p.getAttribute("data-duplicar"));if(!g)return;const{_id:w,...S}=g;h({...S,concepto:`${g.concepto} (copia)`},"Duplicar movimiento",$)}),N(y,"[data-borrar]",p=>{Z("¿Eliminar?")&&(t.store.removeItem("expenses",p.getAttribute("data-borrar")),q("Eliminado"),o(),$())}),J(y,"[data-activo]",p=>{const g=p;t.store.updateItem("expenses",g.getAttribute("data-activo"),{activo:g.checked}),o(),$()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:yr,mount(y){const $=()=>c(y);c(y),y.dataset.wired!=="1"&&(A(y,$),y.dataset.wired="1")}}}function Ce(t,e,a){return t.reduce((o,n)=>{if(n.esAmortizacion)return o;const s=pt(e,a,n.fecha);return o+(s>0?n.interes/s:n.interes)},0)}function Uo(t,e,a,o){return t.reduce((n,s)=>{const i=pt(e,a,s.fecha),r=s.esAmortizacion?s.amortizacion+s.comisionAmort:s.cuota;return n+(i>0?r/i:r)},0)+o}function Ir(t,e,a){const o=t.amortizaciones||[];return o.map((n,s)=>{const i=at({...t,amortizaciones:o.slice(0,s)}),r=at({...t,amortizaciones:o.slice(0,s+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:Ce(i.tabla,e,a)-Ce(r.tabla,e,a)}})}const fa=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${d(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function Ar(t,e){const a=za(t),o=(t.amortizaciones||[]).length>0,n=e.periodos.length>0,s=e.usarInflacion&&n,i=n?Fa(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,r=n?Pa(t.tin||0,i):null,l=o&&n?Ir(t,e.periodos,e.hoy):[],u=l.length?Ce(a.sinAmort.tabla,e.periodos,e.hoy)-Ce(a.tabla,e.periodos,e.hoy):null,f=u===null?null:u-a.costeTotalAmort,c=s?Uo(a.tabla,e.periodos,e.hoy,a.comAp):null,m=s&&o?Uo(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${d(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${d(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(t.tags||[]).map(v=>`<span class="tag">${d(v)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${d(t.tin)}%</span>
        <span class="text-sm">${d(j(t.capital))}</span>
        <span class="text-sm">${d(t.meses)}m</span>
        <button class="btn-icon" data-amort-loan="${d(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${d(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${d(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${d(t._id)}">

      <div class="grid-4 mb-12">
        ${fa("Cuota mensual",d(j(a.cuota)),e.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${d(j(e.cuotaMes))}</div>`:"")}
        ${fa("Total intereses",d(j(a.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${d(j(a.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${d(a.fechaFin||"—")}</div>
          ${o&&a.fechaFin!==a.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${d(a.sinAmort.fechaFin||"—")}${a.ahorroTiempo>0?` (−${a.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${fa("Total pagado",d(j(a.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${d(j(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${d(Ca(a.tae))}</div></div>
          <div><div class="stat-label">TIN</div><div class="stat-value">${d(t.tin)}%</div></div>
          ${r!==null?`<div title="Tipo de interés real (Fisher): TIN ajustado por la inflación media del ${i.toFixed(2)}% anual durante el préstamo">
                   <div class="stat-label">TIN real</div>
                   <div class="stat-value" style="color:${r<=0?"var(--accent)":r<t.tin?"var(--yellow)":"var(--text)"}">${r.toFixed(2)}%
                     <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${i.toFixed(1)}%)</span>
                   </div>
                 </div>`:""}
          <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${d(t.meses)} meses</div></div>
        </div>
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">Capital</div><div class="stat-value">${d(j(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${d(j(a.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${d(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${d(Ne(t.diaPago))}</div></div>`:""}
        </div>
      </div>

      ${o?"":`<div class="loan-optim-cta">
               <div class="loan-optim-cta-text">
                 <strong>¿Quieres pagar menos intereses?</strong>
                 Simula amortizaciones anticipadas y descubre cuánto puedes ahorrar.
               </div>
               <button class="btn-primary btn-sm" data-amort-loan="${d(t._id)}">+ Amortizar</button>
               <button class="btn-secondary btn-sm" data-optimizar data-feature="optimizador">✨ Optimizar</button>
             </div>`}

      ${o?`<div class="card" style="background:var(--bg3);padding:12px;margin-bottom:12px">
               <div class="card-title" style="margin-bottom:8px;color:var(--accent)">💰 Ahorro por amortizaciones</div>
               ${u!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${d(j(a.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${d(j(u))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${d(j(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${d(j(a.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(f??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${d(j(f??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${d(j(a.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${d(j(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${d(j(a.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${c!==null?wr(t,a.totalPagado,c,m):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${s?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(v=>Sr(v,s,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,h)=>Mr(t._id,v,l[h]??null,e)).join("")}`:""}
    </div>
  </div>`}function wr(t,e,a,o){const n=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-a,l=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${d(j(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${d(j(a))}</div></div>
        <div><div class="stat-label">${l?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${l?"pos":"neg"}">${l?"−":"+"}${d(j(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${n}
    </div>`}const s=e-a,i=s>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${d(j(e))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${d(j(a))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${d(j(Math.abs(s)))}</div></div>
    </div>
    ${n}
  </div>`}function Sr(t,e,a){let o="";if(e&&!t.esAmortizacion){const n=pt(a.periodos,a.hoy,t.fecha);o=d(j(n>0?t.cuota/n:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":d(t.mes)}</td>
    <td class="num">${d(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":d(j(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${d(j(t.interes))}</td>
    <td class="num">${d(j(t.amortizacion))}</td>
    <td class="num">${d(j(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Mr(t,e,a,o){const n=(e.escenarioIds||[]).map(s=>`<span class="badge badge-yellow">🔭 ${d(o.nombreEscenario(s))}</span>`).join("");return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${d(e.fecha)}</span>
    <span class="num">${d(j(e.cantidad))}</span>
    <span class="badge ${e.simulacion?"badge-sim":"badge-active"}">${e.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${e.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${n}
    ${a?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${d(j(a.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${d(j(a.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-editar-amort="${d(t)}|${d(e._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${d(t)}|${d(e._id)}">✕</button>
  </div>`}const tt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${d(o)}" placeholder="${d(n)}"/></div>`,Jt=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${d(n)}"${n===o?" selected":""}>${d(s)}</option>`).join("")}
   </select></div>`,pe=(t,e,a,o="")=>`<label class="form-label">${d(e)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${a?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${d(o)}</span>`:""}`;function me(t,e,a){return t.length===0?"":`<div class="form-group mt-8"><label class="form-label">Supuestos</label>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:6px">
      ${t.map(o=>`<label style="display:inline-flex;align-items:center;gap:5px;padding:4px 10px;background:var(--bg2);
                   border-radius:20px;cursor:pointer;font-size:12px;border:1px solid ${e.includes(o._id)?d(o.color||"var(--accent)"):"var(--border)"}">
            <input type="checkbox" class="${d(a)}" value="${d(o._id)}"${e.includes(o._id)?" checked":""}/>
            ${d(o.nombre)}
          </label>`).join("")}
    </div></div>`}const Cr=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${d(a._id)}"${a._id===e?" selected":""}>${d(a.nombre)}</option>`).join("");function Er(t,e,a,o=Y()){return`
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
            <select class="form-select" id="f-cuenta">${Cr(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${Ho(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Jt("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${tt("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${tt("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${d(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${pe("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${me(a,(t==null?void 0:t.escenarioIds)??[],"loan-escenario")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${pe("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${pe("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${pe("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${d((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function jr(t,e,a,o=Y()){return`
    <div class="grid-2">
      ${tt("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??o)}
      ${tt("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Jt("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(e==null?void 0:e.tipo)??"cuota")}
    </div>
    ${me(a,(e==null?void 0:e.escenarioIds)??[],"amort-escenario")}
    <div class="form-row mt-8">
      ${pe("am-sim","Simulación",!!(e!=null&&e.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${d(t)}|${d((e==null?void 0:e._id)??"")}">${e?"Guardar cambios":"Añadir"}</button>
    </div>`}const Yo="opt_",Jo=t=>String(t).startsWith(Yo);function _r(t){let e=null,a=null;const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content");function s(b,x){const p=o(),g=n();return!p||!g?null:(g.innerHTML=`<div class="modal-title">${d(b)}</div>${x}`,p.classList.remove("hidden"),g)}const i=()=>{var b;return(b=o())==null?void 0:b.classList.add("hidden")};function r(){let b=!1;for(const x of t.loans()){const p=(x.amortizaciones||[]).filter(g=>!Jo(g._id));p.length!==(x.amortizaciones||[]).length&&(t.guardarAmortizaciones(x._id,p),b=!0)}return b}function l(b){try{return b()}catch(x){return q(x instanceof Error?x.message:"No se ha podido completar el cálculo","err"),null}}function u(){var E,_;if(!so("optimizador")){q("El optimizador de amortizaciones está desactivado. Actívalo en ⚙ Funcionalidades.","err");return}const b=t.loans().filter(P=>P.activo&&!P.simulacion);if(b.length===0){q("No hay préstamos activos para optimizar","err");return}const x=t.config(),p=t.accounts().filter(P=>P.activo&&!P.simulacion),g=((E=p.find(P=>P.esCuentaPrincipal))==null?void 0:E._id)??((_=p[0])==null?void 0:_._id)??"",w=x.dashboardEnd||`${Number(t.hoy().slice(0,4))+5}-01-01`,S=s("✨ Optimizar amortizaciones",`
      <div class="auth-hint mb-12">
        El optimizador calcula cuándo y cuánto amortizar garantizando que el saldo de la cuenta de origen
        nunca baje de los límites configurados. Las amortizaciones se aplican primero al préstamo con mayor interés.
      </div>

      <div class="card-title mb-6">Cuenta de origen</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px">
        ${p.map(P=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="radio" name="opt-src-acc" class="opt-acc-radio" value="${d(P._id)}"${P._id===g?" checked":""} style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${d(P.nombre)}${P._id===g?' <span class="badge badge-blue" style="font-size:10px">principal</span>':""}</span>
                <span class="text-sm" style="color:var(--text3)">${d(j(rt(P)))}</span>
              </label>`).join("")||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
      </div>

      <div class="card-title mb-6">Límites a respetar</div>
      <div id="opt-margenes-wrap" style="display:flex;flex-direction:column;gap:4px;margin-bottom:12px"></div>

      <div class="card-title mb-6">Préstamos a amortizar</div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">
        ${b.map(P=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
              <input type="checkbox" class="opt-loan-check" value="${d(P._id)}"${P.tin>=5?" checked":""} style="accent-color:var(--accent)"/>
              <span style="font-size:13px;flex:1">${d(P.nombre)}</span>
              <span class="badge badge-yellow" style="font-size:11px">${d(P.tin)}% TIN</span>
            </label>`).join("")}
      </div>
      <button class="btn-secondary btn-sm mb-12" data-opt-todos>Seleccionar todo</button>

      <div class="grid-2" style="gap:10px">
        ${tt("opt-horizonte","Horizonte (meses)","number",60,"60")}
        ${tt("opt-frecuencia","Frecuencia manual (cada N meses)","number",1,"1")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${tt("opt-min","Importe mínimo por amortización (€)","number",500,"500")}
        ${Jt("opt-tipo","Efecto de la amortización",[["plazo","Reducir plazo (mantener cuota)"],["cuota","Reducir cuota (mantener plazo)"]],"plazo")}
      </div>
      <div class="grid-2 mt-8" style="gap:10px">
        ${tt("opt-fecha-primera","Fecha primera amortización","date","")}
        ${tt("opt-fecha-obj","Fecha objetivo para comparar saldo","date",w)}
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-secondary" data-opt-comparar data-feature="comparador-frecuencias">📊 Comparar frecuencias</button>
        <button class="btn-primary" data-opt-calcular>Calcular plan manual</button>
      </div>`);S&&(f(S),J(S,".opt-acc-radio",()=>f(S)),N(S,"[data-opt-todos]",()=>{const P=[...S.querySelectorAll(".opt-loan-check")],C=P.every(M=>M.checked);P.forEach(M=>M.checked=!C)}),N(S,"[data-cancelar]",i),N(S,"[data-opt-calcular]",()=>h(S)),N(S,"[data-opt-comparar]",()=>I(S)))}function f(b){var S;const x=(S=b.querySelector(".opt-acc-radio:checked"))==null?void 0:S.value,g=(t.config().margenesSeguridad||[]).filter(E=>E.activo!==!1).filter(E=>!E.cuentas||E.cuentas.length===0||x&&E.cuentas.includes(x)),w=b.querySelector("#opt-margenes-wrap");w&&(w.innerHTML=g.length===0?'<span class="text-sm" style="color:var(--yellow)">Sin márgenes configurados para esta cuenta. Define límites en <strong>Márgenes de seguridad</strong>.</span>':g.map(E=>`<label style="display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:6px;cursor:pointer;background:var(--bg2)">
                <input type="checkbox" class="opt-margin-check" value="${d(E._id)}" checked style="accent-color:var(--accent)"/>
                <span style="font-size:13px;flex:1">${d(E.nombre)}</span>
                <span class="text-sm" style="color:var(--text3)">${!E.cuentas||E.cuentas.length===0?"Todas las cuentas":"Esta cuenta"}</span>
              </label>`).join(""))}function c(b){var w,S,E,_;const x=(P,C,M=0)=>{var F;const z=parseFloat(((F=b.querySelector(P))==null?void 0:F.value)??"");return Number.isFinite(z)?Math.max(M,z):C},p=[...b.querySelectorAll(".opt-loan-check")],g=p.filter(P=>P.checked).map(P=>P.value);return{horizonte:Math.round(x("#opt-horizonte",60,1)),frecuencia:Math.round(x("#opt-frecuencia",1,1)),minAmortizable:x("#opt-min",500),tipoAmort:((w=b.querySelector("#opt-tipo"))==null?void 0:w.value)||"plazo",fechaObjetivo:((S=b.querySelector("#opt-fecha-obj"))==null?void 0:S.value)||null,fechaPrimeraAmort:((E=b.querySelector("#opt-fecha-primera"))==null?void 0:E.value)||null,loanIds:p.length===0||g.length===p.length?null:g,sourceAccountId:((_=b.querySelector(".opt-acc-radio:checked"))==null?void 0:_.value)??null,selectedMarginIds:[...b.querySelectorAll(".opt-margin-check:checked")].map(P=>P.value)}}const m=()=>({loans:t.loans(),expenses:t.expenses(),accounts:t.accounts(),config:t.config(),nominas:t.nominas()});function v(b,x=""){const p=s("Sin resultados",`<div style="text-align:center;padding:20px">
        <div style="font-size:32px;margin-bottom:12px">🔍</div>
        <div class="card-title">Sin excedente disponible</div>
        <div class="text-sm mt-8">${d(b)}</div>
        ${x?`<div class="text-sm mt-8" style="color:var(--text3)">${d(x)}</div>`:""}
        <div class="flex gap-8 mt-16" style="justify-content:center">
          <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
          <button class="btn-secondary" data-cancelar>Cerrar</button>
        </div>
      </div>`);p&&(N(p,"[data-opt-volver]",u),N(p,"[data-cancelar]",i))}function h(b){const x=c(b);r()&&q("Plan anterior eliminado, recalculando…");const{loans:p,expenses:g,accounts:w,config:S,nominas:E}=m(),_=l(()=>We(p,g,w,S,{frecuencia:x.frecuencia,mesesHorizonte:x.horizonte,minAmortizable:x.minAmortizable,tipoAmort:x.tipoAmort,fechaPrimeraAmort:x.fechaPrimeraAmort,loanIds:x.loanIds,nominas:E,sourceAccountId:x.sourceAccountId,selectedMarginIds:x.selectedMarginIds}));if(!_)return;if(_.plan.length===0){v(`No hay excedente suficiente respetando los ${_.margenesAplicados} márgenes de seguridad activos en los próximos ${x.horizonte} meses para generar amortizaciones por encima del mínimo de ${j(x.minAmortizable)}.`,"Prueba a revisar los márgenes de seguridad, reducir el mínimo de amortización, o ampliar el horizonte.");return}a={plan:_.plan,tipoAmort:x.tipoAmort};const P=`✨ Plan de optimización · ${x.frecuencia===1?"Mensual":`Cada ${x.frecuencia} meses`} · ${x.horizonte}m`,C=s(P,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${d(j(_.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro en intereses</div><div class="stat-value pos">${d(j(_.totalAhorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones estimadas</div><div class="stat-value neg">${d(j(_.totalComisiones))}</div></div>
        <div class="stat-card"><div class="stat-label">Márgenes verificados</div><div class="stat-value">${_.margenesAplicados}</div></div>
      </div>
      ${_.resumenPorLoan.map(Ko).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${_.plan.length} amortizaciones)</div>
      <div style="max-height:300px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th><th>Saldo mín. → tras amort.</th></tr></thead>
          <tbody>${_.plan.map(M=>Wo(M,!0)).join("")}</tbody>
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
      </div>`);C&&(N(C,"[data-opt-volver]",u),N(C,"[data-cancelar]",i),N(C,"[data-opt-aplicar]",()=>{a&&y(a.plan,a.tipoAmort)}))}function I(b){const x=c(b);r();const{loans:p,expenses:g,accounts:w,config:S,nominas:E}=m(),_=l(()=>lo(p,g,w,S,{horizonte:x.horizonte,minAmortizable:x.minAmortizable,tipoAmort:x.tipoAmort,fechaObjetivo:x.fechaObjetivo,frecuencias:[1,2,3,6,12],fechaPrimeraAmort:x.fechaPrimeraAmort,loanIds:x.loanIds,nominas:E,sourceAccountId:x.sourceAccountId,selectedMarginIds:x.selectedMarginIds}));if(!_)return;if(_.resultados.length===0){v("No hay excedente suficiente en ninguna frecuencia.");return}e=_;const{resultados:P,saldoBase:C,fechaObjetivo:M}=_,z=P.map(T=>{const O=[T.esMejorIntereses&&"💰 +intereses",T.esMejorSaldo&&"🏦 +saldo",T.esMejorValor&&"⭐ +valor total"].filter(Boolean).join(" ");return`<tr style="${T.esMejorValor?"background:rgba(46,230,168,0.06);":""}">
          <td style="font-weight:600">${d(T.label)}</td>
          <td class="num">${T.numAmortizaciones}</td>
          <td class="num neg">${d(j(T.totalAmortizado))}</td>
          <td class="num pos">${d(j(T.ahorroIntereses))}</td>
          <td class="num ${T.saldoObjetivo>=C?"pos":"neg"}">${d(j(T.saldoObjetivo))}</td>
          <td class="num pos">${d(j(T.valorTotal))}</td>
          <td style="font-size:11px">${O}</td>
          <td><button class="btn-secondary btn-sm" data-opt-usar="${T.frecuencia}">Usar</button></td>
        </tr>`}).join(""),F=s(`📊 Comparativa de frecuencias · hasta ${M}`,`
      <div class="auth-hint mb-12">
        Saldo base sin amortizaciones a ${d(M)}: <strong>${d(j(C))}</strong>.
        "Valor total" = ahorro de intereses + ganancia de saldo frente a no amortizar.
        ⭐ marca la frecuencia que maximiza el valor total.
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;font-size:12px">
          <thead><tr style="font-family:var(--font-mono);font-size:10px;color:var(--text3);text-transform:uppercase">
            <th>Frecuencia</th><th>Amorts.</th><th>Total amort.</th><th>Ahorro int.</th>
            <th>Saldo ${d(M.slice(0,7))}</th><th>Valor total</th><th>Mejor en</th><th></th>
          </tr></thead>
          <tbody>${z}</tbody>
        </table>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-opt-volver>← Cambiar parámetros</button>
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);F&&(N(F,"[data-opt-volver]",u),N(F,"[data-cancelar]",i),N(F,"[data-opt-usar]",T=>A(Number(T.getAttribute("data-opt-usar")))))}function A(b){var p;const x=e==null?void 0:e.resultados.find(g=>g.frecuencia===b);x&&(r(),y(x.plan,((p=x.plan[0])==null?void 0:p.tipoAmort)||"plazo",{titulo:`✨ Plan ${x.label} · aplicado`,resumen:x,fechaObjetivo:e==null?void 0:e.fechaObjetivo}))}function y(b,x,p){if(b.length===0)return;const g=new Map;for(const S of b){const E=g.get(S.loanId)??[];E.push({_id:`${Yo}${S.mes}_${S.loanId}`,fecha:S.fechaAmort,cantidad:S.cantidadAmort,tipo:x,simulacion:!0}),g.set(S.loanId,E)}let w=0;for(const S of t.loans()){const E=g.get(S._id);if(!E)continue;const _=(S.amortizaciones||[]).filter(P=>!Jo(P._id));t.guardarAmortizaciones(S._id,[..._,...E]),w+=1}q(`Plan aplicado: ${b.length} amortizaciones en ${w} préstamo${w!==1?"s":""} (simulación)`),p?$(p):i(),t.refrescar([...g.keys()])}function $({titulo:b,resumen:x,fechaObjetivo:p}){const g=s(b,`
      <div class="grid-4 mb-14" style="gap:10px">
        <div class="stat-card"><div class="stat-label">Total amortizado</div><div class="stat-value neg">${d(j(x.totalAmortizado))}</div></div>
        <div class="stat-card"><div class="stat-label">Ahorro intereses</div><div class="stat-value pos">${d(j(x.ahorroIntereses))}</div></div>
        <div class="stat-card"><div class="stat-label">Saldo ${d((p==null?void 0:p.slice(0,7))??"")}</div><div class="stat-value pos">${d(j(x.saldoObjetivo))}</div></div>
        <div class="stat-card"><div class="stat-label">Comisiones</div><div class="stat-value neg">${d(j(x.totalComisiones))}</div></div>
      </div>
      ${x.resumenPorLoan.map(Ko).join("")}
      <div class="card-title mt-12 mb-8">Plan mes a mes (${x.plan.length} amortizaciones)</div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="table-wrap" style="width:100%">
          <thead><tr><th>Mes</th><th>Préstamo</th><th>TIN</th><th>Cap. antes</th><th>Amortizar</th><th>Cap. después</th></tr></thead>
          <tbody>${x.plan.map(w=>Wo(w,!1)).join("")}</tbody>
        </table>
      </div>
      <div class="auth-hint mt-12">Plan aplicado como simulación. Edita desde cada préstamo para convertirlo en real.</div>
      <div class="flex gap-8 mt-12" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cerrar</button>
      </div>`);g&&N(g,"[data-cancelar]",i)}return{abrir:u,get planManual(){return a},get comparativa(){return e}}}function Wo(t,e){const a=t.comision>0?`<br><span style="font-size:9px;color:var(--text3)">+${d(j(t.comision))} com.</span>`:"";return`<tr>
    <td class="num">${d(t.mes)}</td>
    <td>${d(t.loanNombre)}</td>
    <td class="num" style="color:var(--yellow)">${t.tin.toFixed(2)}%</td>
    <td class="num">${d(j(t.capitalAntes))}</td>
    <td class="num neg">${d(j(t.cantidadAmort))}${a}</td>
    <td class="num">${d(j(t.capitalDespues))}</td>
    ${e?`<td class="num" style="color:var(--text3)">${d(j(t.saldoDisponible))} → ${d(j(t.saldoDespues))}</td>`:""}
  </tr>`}function Ko(t){return`<div class="card mb-8" style="padding:12px">
    <div class="flex justify-between items-center mb-8">
      <span style="font-weight:600">${d(t.nombre)}</span>
      <span class="badge badge-yellow">${d(t.tin)}% TIN</span>
    </div>
    <div class="grid-4" style="gap:8px;font-size:12px">
      <div><div class="stat-label">Fecha fin</div>
        <div class="num" style="text-decoration:line-through;color:var(--text3)">${d(t.fechaFinSin)}</div>
        <div class="num pos">${d(t.fechaFinCon)}</div></div>
      <div><div class="stat-label">Plazo ahorrado</div><div class="num pos">${t.mesesAhorrados>0?`${t.mesesAhorrados}m`:"—"}</div></div>
      <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${d(j(t.ahorroIntereses))}</div></div>
      <div><div class="stat-label">${t.numAmortizaciones} amorts.</div><div class="num">${d(j(t.totalAmortizado))}</div></div>
    </div>
  </div>`}const zr="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Fr(t){const e=t.hoy??Y;let a=!1;const o=new Set;let n=null;const s=()=>{var p;return(p=t.onDatosCambiados)==null?void 0:p.call(t)},i=()=>t.store.get("escenarios"),r=p=>{var g;return((g=i().find(w=>w._id===p))==null?void 0:g.nombre)??p};function l(p){if(!p.activo||p.simulacion)return!1;const g=at(p).tabla.filter(w=>!w.esAmortizacion);return g.length===0?!0:g[g.length-1].fecha<e()}function u(p,g){const w=e(),S=w.slice(0,7),E=new Map;let _=0;for(const P of p){if(!P.activo||P.simulacion||g.has(P._id)||(P.fechaInicio||"")>w)continue;const C=at(P).tabla.filter(z=>!z.esAmortizacion&&z.fecha.startsWith(S)),M=C.length>0?C[0].cuota:0;E.set(P._id,M),_+=M}return{porLoan:E,total:_,activos:[...E.values()].filter(P=>P>0).length}}function f(p){const g=t.store.get("config"),w=g.dashboardStart,S=g.dashboardEnd,E=Math.max(1,(G(S).getTime()-G(w).getTime())/(30.44*864e5));let _=0;for(const P of p)!P.activo||P.simulacion||(_+=at(P).tabla.filter(C=>!C.esAmortizacion&&C.fecha>=w&&C.fecha<=S).reduce((C,M)=>C+M.cuota,0));return{media:_/E,desde:w,hasta:S}}function c(p){const g=[...t.store.get("loans")].sort((z,F)=>F.tin-z.tin),w=new Set(g.filter(l).map(z=>z._id)),S=a?g:g.filter(z=>!w.has(z._id)),E=u(g,w),_=f(g),P=t.store.get("config"),C=t.store.get("inflacion"),M=new Date(G(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});p.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${w.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${w.size})</button>`:""}
          <button class="btn-secondary" data-optimizar data-feature="optimizador">✨ Optimizar amortizaciones</button>
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${E.total>0||_.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${E.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${d(M)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${d(j(E.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${E.activos} préstamo${E.activos!==1?"s":""} activo${E.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${_.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${d(j(_.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${d(_.desde)} → ${d(_.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${S.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':S.map(z=>Ar(z,{periodos:C,usarInflacion:!!P.usarInflacion,hoy:e(),cuotaMes:E.porLoan.get(z._id)??0,completado:w.has(z._id),nombreEscenario:r})).join("")}
      </div>`;for(const z of p.querySelectorAll("[data-body-loan]"))o.has(z.dataset.bodyLoan??"")&&z.classList.add("open")}const m=()=>document.getElementById("modal-overlay"),v=()=>document.getElementById("modal-content"),h=()=>{var p;return(p=m())==null?void 0:p.classList.add("hidden")};function I(p,g){const w=m(),S=v();return!w||!S?null:(S.innerHTML=`<div class="modal-title">${d(p)}</div>${g}`,w.classList.remove("hidden"),N(S,"[data-cancelar]",h),S)}function A(p,g){const w=p?t.store.get("loans").find(E=>E._id===p)??null:null,S=I(p?"Editar préstamo":"Nuevo préstamo",Er(w,t.store.get("accounts"),i(),e()));S&&(S.addEventListener("change",E=>{var _;(_=E.target)!=null&&_.matches("[data-dp-modo]")&&Go(S)}),N(S,"[data-guardar-loan]",E=>{y(S,E.getAttribute("data-guardar-loan")||"")&&(h(),g())}))}function y(p,g){const w=z=>{var F;return((F=p.querySelector(z))==null?void 0:F.value)??""},S=z=>{var F;return!!((F=p.querySelector(z))!=null&&F.checked)},E=w("#f-nombre").trim(),_=parseFloat(w("#f-capital")),P=parseFloat(w("#f-tin")),C=parseInt(w("#f-meses"),10);if(!E||!Number.isFinite(_)||!Number.isFinite(P)||!Number.isFinite(C))return q("Completa los campos obligatorios","err"),!1;const M={nombre:E,capital:_,tin:P,meses:C,fechaInicio:w("#f-fecha"),comisionApertura:parseFloat(w("#f-com-ap"))||0,comisionAmort:parseFloat(w("#f-com-am"))||0,diaPago:Vo(p),cuenta:w("#f-cuenta"),simulacion:S("#f-sim"),activo:S("#f-activo"),mostrarFechaFinEnDashboard:S("#f-mostrar-fin"),tipoTasa:w("#f-tipo-tasa"),basico:S("#f-basico"),tags:w("#f-tags").split(",").map(z=>z.trim()).filter(Boolean),escenarioIds:[...p.querySelectorAll(".loan-escenario:checked")].map(z=>z.value)};return g?(t.store.updateItem("loans",g,M),q("Préstamo actualizado")):(t.store.addItem("loans",{...M,amortizaciones:[]}),q("Préstamo creado")),s(),!0}function $(p,g,w){const S=t.store.get("loans").find(P=>P._id===p);if(!S)return;const E=g?(S.amortizaciones||[]).find(P=>P._id===g)??null:null,_=I(g?"Editar amortización":"Añadir amortización",jr(p,E,i(),e()));_&&N(_,"[data-guardar-amort]",P=>{const[C,M]=(P.getAttribute("data-guardar-amort")||"").split("|");b(_,C,M)&&(h(),w([C]))})}function b(p,g,w){var F;const S=T=>{var O;return((O=p.querySelector(T))==null?void 0:O.value)??""},E=S("#am-fecha"),_=parseFloat(S("#am-cant"));if(!E||!Number.isFinite(_)||_<=0)return q("Fecha y cantidad requeridas","err"),!1;const P=t.store.get("loans").find(T=>T._id===g);if(!P)return!1;const C={fecha:E,cantidad:_,tipo:S("#am-tipo"),simulacion:!!((F=p.querySelector("#am-sim"))!=null&&F.checked),escenarioIds:[...p.querySelectorAll(".amort-escenario:checked")].map(T=>T.value)},M=P.amortizaciones||[],z=w?M.map(T=>T._id===w?{...T,...C}:T):[...M,{_id:Date.now().toString(36),...C}];return t.store.updateItem("loans",g,{amortizaciones:z}),q(w?"Amortización actualizada":"Amortización añadida"),s(),!0}function x(p,g,w){N(p,"[data-toggle-finalizados]",()=>{a=!a,g()}),N(p,"[data-nuevo-loan]",()=>A(null,g)),N(p,"[data-optimizar]",()=>w.abrir()),N(p,"[data-toggle-loan]",(S,E)=>{var M;if((M=E.target)!=null&&M.closest("button"))return;const _=S.getAttribute("data-toggle-loan"),P=[...p.querySelectorAll("[data-body-loan]")].find(z=>z.dataset.bodyLoan===_);(P==null?void 0:P.classList.toggle("open"))?o.add(_):o.delete(_)}),N(p,"[data-editar-loan]",S=>A(S.getAttribute("data-editar-loan"),g)),N(p,"[data-borrar-loan]",S=>{if(!Z("¿Eliminar préstamo?"))return;const E=S.getAttribute("data-borrar-loan");t.store.removeItem("loans",E),o.delete(E),q("Eliminado"),s(),g()}),N(p,"[data-amort-loan]",S=>{const E=S.getAttribute("data-amort-loan");o.add(E),$(E,null,g)}),N(p,"[data-editar-amort]",S=>{const[E,_]=(S.getAttribute("data-editar-amort")||"").split("|");o.add(E),$(E,_,g)}),N(p,"[data-borrar-amort]",S=>{const[E,_]=(S.getAttribute("data-borrar-amort")||"").split("|"),P=t.store.get("loans").find(C=>C._id===E);P&&(t.store.updateItem("loans",E,{amortizaciones:(P.amortizaciones||[]).filter(C=>C._id!==_)}),q("Amortización eliminada"),s(),g([E]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:zr,mount(p){const g=(w=[])=>{for(const S of w)o.add(S);c(p)};n??(n=_r({loans:()=>t.store.get("loans"),expenses:()=>t.store.get("expenses"),accounts:()=>t.store.get("accounts"),nominas:()=>t.store.get("nominas"),config:()=>t.store.get("config"),guardarAmortizaciones:(w,S)=>{t.store.updateItem("loans",w,{amortizaciones:S}),s()},hoy:e,refrescar:g})),c(p),p.dataset.wired!=="1"&&(x(p,g,n),p.dataset.wired="1")}}}const Pr={transporte:125,restaurante:220,otros:null},Dr={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Tr=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Wt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${d(o)}" placeholder="${d(n)}"/></div>`,Nr=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${d(a._id)}"${a._id===e?" selected":""}>${d(a.nombre)}</option>`).join("");function Or(t,e){const a=t.map((s,i)=>{const r=e.find(f=>f._id===s.cuenta),l=Pr[s.tipo],u=l!=null&&s.importe>l;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${d(Dr[s.tipo]??s.tipo)}</span>
        <span style="flex:1;font-size:12px">${d(j(s.importe))}/mes${u?` <span style="color:var(--red)" title="Supera el límite orientativo de ${d(j(l))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?d(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
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
        ${o.map(s=>`<option value="${d(s._id)}">${d(s.nombre)}${(s.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function Rr(t,e){const a=e.hoy??Y(),o=(t==null?void 0:t.nPagas)??12,n=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Wt("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Wt("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(s=>`<option value="${s}"${n&&o===s?" selected":""}>${s} pagas</option>`).join("")}
          <option value="custom"${n?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${Nr(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Wt("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??a)}
          ${Wt("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Wt("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${Tr.map((s,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${d(s)} (${i+1})</option>`).join("")}
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
          ${Wt("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??Ge).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${me(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"nom-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${d((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Qo(t,e){const a=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const l=parseFloat(a(i));return Number.isFinite(l)?l:r},n=a("#nf-npagas"),s=n==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(n,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:s,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Ge),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,escenarioIds:[...t.querySelectorAll(".nom-escenario:checked")].map(i=>i.value),retribucionFlexible:e}}function qr(t,e,a,o){const n=Qo(t,e),s=e.reduce((y,$)=>y+($.importe||0)*12,0),i=Math.max(0,n.bruto-s),r=i*(n.ssPct/100),l=n.irpfModo==="manual"?i*(n.irpfPct/100):ut(Ct(n.bruto,s),a.tramos),u=i-r-l,f=i/n.nPagas,c=r/n.nPagas,m=l/n.nPagas,v=f-c-m,h=n.grupoNomina?a.nominas.filter(y=>y.grupoNomina===n.grupoNomina&&y._id!==o):[],I=h.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${d(n.grupoNomina)}" con ${d(h.map(y=>y.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",A=s>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${d(j(s))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${d(j(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${d(j(n.bruto))}</span>
      ${A}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${d(j(r))} (${n.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${d(j(l))} (${i>0?(l/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${d(j(u))}</span>
      ${s>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${d(j(s))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${d(j(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${n.representacion==="simplificado"?`ingreso ${d(j(v))}/paga`:`ingreso ${d(j(f))} − SS ${d(j(c))} − IRPF ${d(j(m))}`}${s>0?" + recargas flex":""}</span>
    </div>${I}`}function Lr(t,e,a,o){const n=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=Or(e,a.accounts))},s=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=qr(t,e,a,o))},i=()=>{var l,u;const r=(f,c)=>{const m=t.querySelector(f);m&&(m.style.display=c?"":"none")};r("#nf-custom-pagas-wrap",((l=t.querySelector("#nf-npagas"))==null?void 0:l.value)==="custom"),r("#nf-irpfpct-wrap",((u=t.querySelector("#nf-irpfmodo"))==null?void 0:u.value)==="manual"),s()};t.addEventListener("input",r=>{var l;(l=r.target)!=null&&l.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&s()}),J(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),N(t,"[data-flex-anadir]",()=>{var u,f,c;const r=((u=t.querySelector("#fc-tipo"))==null?void 0:u.value)||"transporte",l=parseFloat(((f=t.querySelector("#fc-importe"))==null?void 0:f.value)??"")||0;if(!l)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:r,importe:l,cuenta:((c=t.querySelector("#fc-cuenta"))==null?void 0:c.value)||""}),n(),s()}),N(t,"[data-flex-borrar]",r=>{e.splice(Number(r.getAttribute("data-flex-borrar")),1),n(),s()}),n(),s()}const Xo=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function Br(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var m;return(m=o())==null?void 0:m.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??bt;function r(m,v){const h=o(),I=n();return!h||!I?null:(I.innerHTML=`<div class="modal-title">${d(m)}</div>${v}`,h.classList.remove("hidden"),N(I,"[data-cerrar]",s),I)}function l(){e=null;const m=[...t.store.get("tramosIRPFHistorico")].sort((I,A)=>I.año-A.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",h=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${d(Xo(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${m.map(I=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${I.año}</span>
              <span class="text-sm" style="color:var(--text2)">${d(Xo(I.tramos))}</span>
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
      </div>`);h&&(N(h,"[data-editar-tabla]",I=>{const A=I.getAttribute("data-editar-tabla");c(A==="default"?"default":Number(A))}),N(h,"[data-borrar-tabla]",I=>{const A=Number(I.getAttribute("data-borrar-tabla"));Z(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(y=>y.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),N(h,"[data-anadir-anyo]",()=>{var y;const I=parseInt(((y=h.querySelector("#irpf-new-year"))==null?void 0:y.value)??"",10);if(!I||I<2e3||I>2100)return q("Año inválido","err");const A=t.store.get("tramosIRPFHistorico");if(A.some($=>$.año===I))return q("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...A,{_id:Date.now().toString(36),año:I,tramos:i().map($=>[...$])}]),t.onDatosCambiados(),c(I)}))}function u(){return a.map(([m,v],h)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${h}" value="${m}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${h}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${h}">✕</button>
          </div>
        </div>`).join("")}function f(m){a=[...m.querySelectorAll("[data-tr-min]")].map((h,I)=>{const A=m.querySelector(`[data-tr-pct="${I}"]`);return[parseFloat(h.value)||0,parseFloat((A==null?void 0:A.value)??"")||0]})}function c(m){var $;e=m;const v=t.store.get("tramosIRPFHistorico");a=(m==="default"?i():(($=v.find(b=>b.año===m))==null?void 0:$.tramos)??i()).map(b=>[...b]);const I=m==="default"?"tabla por defecto":`ejercicio ${m}`,A=r(`Tramos IRPF — ${m==="default"?"Por defecto":m}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${d(I)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!A)return;const y=()=>{const b=A.querySelector("#irpf-tramos-rows");b&&(b.innerHTML=u())};N(A,"[data-volver]",l),N(A,"[data-tr-anadir]",()=>{f(A),a.push([0,0]),y()}),N(A,"[data-tr-borrar]",b=>{f(A),a.splice(Number(b.getAttribute("data-tr-borrar")),1),y()}),N(A,"[data-tr-guardar]",()=>{f(A);const b=[...a].sort((x,p)=>x[0]-p[0]);if(b.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:b}),q("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(x=>x.año===e?{...x,tramos:b}:x)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}const Zo=1500,qt=(t,e,a,o,n="")=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${d(o)}" placeholder="${d(n)}"/></div>`,kr=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${d(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([n,s])=>`<option value="${d(n)}"${n===o?" selected":""}>${d(s)}</option>`).join("")}
   </select></div>`,Hr=t=>(t.modeloFondo||"cuenta")==="pension";function Gr(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(n=>Vr(n,e,a,o)).join("")}</div>`}function Vr(t,e,a,o){const n=xe(t);if(!n)return"";const s=He(t,e,a),i=o.slice(0,4),r=(t.aportaciones||[]).filter(u=>u.fecha>=`${i}-01-01`).reduce((u,f)=>u+f.cantidad,0),l=Math.min(r,Zo)*(s/100);return`<div class="card">
    <div class="flex justify-between items-center mb-10">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${d(t.nombre)}</span>
        <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
        ${t.grupoNomina?`<span class="badge badge-blue">Grupo: ${d(t.grupoNomina)}</span>`:""}
      </div>
      <div class="flex gap-8">
        <button class="btn-icon" data-editar-pension="${d(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger btn-sm" data-borrar-pension="${d(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2" style="gap:6px;margin-bottom:8px">
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${d(j(n.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${d(j(n.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${n.beneficio>=0?"pos":"neg"}">${d(j(n.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${d(j(n.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${d(j(n.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${d(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>Zo?"neg":""}">${d(j(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${d(j(l))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${d(t.grupoNomina)}": ${s}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${n.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${d(n.proxDesbloqueo)}</div>`:""}
  </div>`}function Ur(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${d(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${d(j(a.importe))} / ${d(a.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${d(a.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Yr(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,n=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],s=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${qt("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${qt("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${qt("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${qt("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${qt("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${kr("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${qt("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${s?' style="display:none"':""}>
        ${qt("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
      </div>
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Grupo (para IRPF marginal real)</label>
      <select class="form-select" id="pen-grupo">
        <option value="">Sin grupo — usar tipo fijo</option>
        ${n.map(i=>`<option value="${d(i)}"${(t==null?void 0:t.grupoNomina)===i?" selected":""}>${d(i)}</option>`).join("")}
      </select>
      ${n.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Crea grupos en las nóminas para poder seleccionarlos aquí.</div>':""}
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Aportaciones programadas</label>
      <div id="pen-aport-container"></div>
    </div>
    <div class="form-group mt-8"><label class="form-label">Descripción</label>
      <input class="form-input" type="text" id="pen-desc" value="${d((t==null?void 0:t.descripcion)??"")}" placeholder="Plan de pensiones..."/></div>
    <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
      <label class="form-label">Activo</label>
      <label class="toggle"><input type="checkbox" id="pen-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      <label class="form-label" style="margin-left:12px">Simulación</label>
      <label class="toggle"><input type="checkbox" id="pen-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
    </div>
    ${me(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"pen-escenario")}
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${d((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Jr(t,e,a){const o=()=>{const n=t.querySelector("#pen-aport-container");n&&(n.innerHTML=Ur(e))};J(t,"#pen-grupo",n=>{const s=t.querySelector("#pen-impuesto-wrap");s&&(s.style.display=n.value?"none":"")}),N(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#paport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#paport-fin"))==null?void 0:l.value)||""}),o()}),N(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function Wr(t,e,a,o){var A;const n=y=>{var $;return(($=t.querySelector(y))==null?void 0:$.value)??""},s=(y,$=0)=>{const b=parseFloat(n(y));return Number.isFinite(b)?b:$},i=y=>{var $;return!!(($=t.querySelector(y))!=null&&$.checked)},r=n("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const l=s("#pen-saldo"),u=n("#pen-grupo"),f={nombre:r,grupoNomina:u,saldo:l,saldoInicial:s("#pen-saldo-ini"),fechaInicialSaldo:n("#pen-fecha-ini")||o,interes:s("#pen-interes"),periodoCobro:n("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(n("#pen-bloqueo"),10)||120,impuestoRetirada:u?0:s("#pen-impuesto"),planAportaciones:e,descripcion:n("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim"),escenarioIds:[...t.querySelectorAll(".pen-escenario:checked")].map(y=>y.value)},c=[...(a==null?void 0:a.historicoSaldos)??[]],m=[...(a==null?void 0:a.aportaciones)??[]],h=((A=[...c].sort((y,$)=>$.fecha.localeCompare(y.fecha))[0])==null?void 0:A.saldo)??(a==null?void 0:a.saldo)??null,I=Date.now().toString(36);return a?(h===null||Math.abs(l-h)>.005)&&(c.push({_id:I,fecha:o,saldo:l,nota:"Actualización manual"}),l>(h??0)&&m.push({_id:`${I}a`,fecha:o,cantidad:l-(h??0)})):l>0&&(c.push({_id:I,fecha:o,saldo:l,nota:"Saldo inicial"}),m.push({_id:`${I}a`,fecha:f.fechaInicialSaldo??o,cantidad:l})),{datos:{...f,historicoSaldos:c,aportaciones:m}}}const Kr="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Qr(t){const e=t.hoy??Y,a=()=>{var A;return(A=t.onDatosCambiados)==null?void 0:A.call(t)};function o(){const A=t.store.get("config");return ht(t.store.get("tramosIRPFHistorico"),A.tramos_irpf??bt)(Number(e().slice(0,4)))}function n(A,y,$){const b=Ue(A,y,$),x=!!y&&A.irpfModo!=="manual",p=[A.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${A.mesActualizacionIPC}">IPC m${A.mesActualizacionIPC}</span>`:"",b.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${d(j(b.flexAnual))}/año</span>`:"",Math.abs(b.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${b.ssPct.toFixed(2)}%</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${d(A.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${p}</div>
      </div>
      <div class="num">${d(j(b.brutoAnual))}
        ${b.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${d(j(b.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${d(j(b.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${b.nPagas} pagas</div>
      <div class="text-sm ${x?"neg":""}">${A.irpfModo==="manual"?`${d(A.irpfPct??0)}% (manual)`:`${b.irpfPct.toFixed(1)}% (auto)`}${x?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${A.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${d(s(A.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${d(A._id)}"${A.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${d(A._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${d(A._id)}">✕</button>
      </div>
    </div>`}const s=A=>{var y;return((y=t.store.get("accounts").find($=>$._id===(A||"default")))==null?void 0:y.nombre)??(A||"default")};function i(A,y,$){const b=y.reduce((g,w)=>g+(w.bruto||0),0),x=Hn(y,$),p=b>0?x/b*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${d(A)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${d(j(b))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${p.toFixed(1)}%</strong> (${d(j(x))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${y.map(g=>n(g,y,$)).join("")}
      </div>
    </div>`}function r(A){const y=o(),$=[...t.store.get("nominas")].sort((w,S)=>(S.bruto||0)-(w.bruto||0)),{grupos:b,sueltas:x}=Vn($),p=t.store.get("accounts").filter(Hr),g=$.filter(w=>w.activo!==!1);A.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${$.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...b.entries()].map(([w,S])=>i(w,S,y)).join("")}
      ${x.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${x.map(w=>n(w,null,y)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Gr(p,g,y,e())}</div>`}const l=()=>document.getElementById("modal-overlay"),u=()=>document.getElementById("modal-content"),f=()=>{var A;return(A=l())==null?void 0:A.classList.add("hidden")};function c(A,y){const $=l(),b=u();return!$||!b?null:(b.innerHTML=`<div class="modal-title">${d(A)}</div>${y}`,$.classList.remove("hidden"),N(b,"[data-cancelar]",f),b)}function m(A,y){const $=A?t.store.get("nominas").find(g=>g._id===A)??null:null,b=[...($==null?void 0:$.retribucionFlexible)??[]].map(g=>({...g})),x={accounts:t.store.get("accounts"),escenarios:t.store.get("escenarios"),nominas:t.store.get("nominas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:o(),hoy:e()},p=c(A?"Editar nómina":"Nueva nómina",Rr($,x));p&&(Lr(p,b,x,A??""),N(p,"[data-guardar-nomina]",g=>{const w=Qo(p,b);if(!w.nombre||w.bruto<=0)return q("Nombre y bruto anual son obligatorios","err");const S=g.getAttribute("data-guardar-nomina")||"",E={...w,activo:!0,tags:["nomina"]};S?(t.store.updateItem("nominas",S,E),q("Nómina actualizada")):(t.store.addItem("nominas",E),q("Nómina creada")),a(),f(),y()}))}function v(A,y){const $=A?t.store.get("accounts").find(p=>p._id===A)??null:null,b=[...($==null?void 0:$.planAportaciones)??[]].map(p=>({...p})),x=c(A?"Editar plan de pensiones":"Nuevo plan de pensiones",Yr($,{nominas:t.store.get("nominas"),escenarios:t.store.get("escenarios"),hoy:e()}));x&&(Jr(x,b,e()),N(x,"[data-guardar-pension]",p=>{const{datos:g,error:w}=Wr(x,b,$,e());if(w)return q(w,"err");const S=p.getAttribute("data-guardar-pension")||"";S?(t.store.updateItem("accounts",S,g),q("Plan actualizado")):(t.store.addItem("accounts",g),q("Plan creado")),a(),f(),y()}))}function h(A,y,$){N(A,"[data-nueva-nomina]",()=>m(null,y)),N(A,"[data-editar-nom]",b=>m(b.getAttribute("data-editar-nom"),y)),N(A,"[data-borrar-nom]",b=>{Z("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",b.getAttribute("data-borrar-nom")),q("Eliminada"),a(),y())}),J(A,"[data-activo-nom]",b=>{const x=b;t.store.updateItem("nominas",x.getAttribute("data-activo-nom"),{activo:x.checked}),a(),y()}),N(A,"[data-tramos]",()=>$.abrir()),N(A,"[data-nueva-pension]",()=>v(null,y)),N(A,"[data-editar-pension]",b=>v(b.getAttribute("data-editar-pension"),y)),N(A,"[data-borrar-pension]",b=>{Z("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",b.getAttribute("data-borrar-pension")),q("Plan eliminado"),a(),y())})}let I=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Kr,mount(A){const y=()=>r(A);I??(I=Br({store:t.store,onDatosCambiados:()=>{a(),y()},año:()=>Number(e().slice(0,4))})),r(A),A.dataset.wired!=="1"&&(h(A,y,I),A.dataset.wired="1")}}}const Xr="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Zr="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",tn={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},tl={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function el(t,e){const a=t.filter(l=>l.activo&&mt(l)==="inversion");if(a.length===0)return"";let o=0,n=0,s=0,i=0;for(const l of a){const u=Ht(l,e);u&&(o+=u.saldo,n+=u.costBase,s+=u.plusvalia,i+=u.impuesto)}const r=n>0?(s/n*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${d(j(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${d(j(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${d(r)}%)</div><div class="stat-value ${s>=0?"pos":"neg"}">${d(j(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${d(j(i))}</div><div class="stat-sub">Neto: ${d(j(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function al(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,n=Math.max(1,(G(o).getTime()-G(a).getTime())/(30.44*864e5)),s=te(t,a),i=s*(Math.pow(1+t.interes/100,n/12)-1);let r="";if(e.config.usarInflacion&&e.inflacion.length>0){const l=s*(pt(e.inflacion,a,o)-1),u=i-l;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${d(j(l))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${u>=0?"var(--accent)":"var(--red)"};font-weight:600">${d(j(u))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${d(a.slice(0,7))} → ${d(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${d(j(i))}</span>
    </div>${r}
  </div>`}function ol(t,e){const a=tn[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,n=e.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(h=>h.cuenta===t._id).map(h=>({nomina:v,importe:h.importe}))),s=n.reduce((v,h)=>v+h.importe,0),i=s*12,r=o!==null&&i>o,l=o!==null?Math.min(i,o):i,u=t.grupoNomina?e.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):n.slice(0,1).map(v=>v.nomina),f=La(u,e.tramosIRPF),c=l*f/100,m=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${f}%`:`tipo marginal ${f}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${d(a.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${d(j(s))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${d(j(i))}/año${r?` ⚠ excede límite ${d(j(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${d(j(o))}/año</span></div>`:""}
    ${c>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${d(m)}">≈ ${d(j(c))}/año <span style="font-size:10px;color:var(--text3)">(${d(f)}%)</span></span></div>`:""}
    ${n.length>0?n.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${d(v.nomina.nombre)}: ${d(j(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function nl(t){const e=xe(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${d(j(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${d(j(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${d(j(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${d(j(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${d(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${d(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function sl(t,e){const a=Ht(t,e.tramosGanancias);if(!a)return"";const o=e.config,n=e.flujos(t._id),s=G(o.dashboardStart),i=G(o.dashboardEnd),r=Math.max(0,(i.getTime()-s.getTime())/(30.44*864e5)),l=a.saldo+n.totalAportaciones-n.totalReembolsos,u=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,f=l>0&&r>0?Math.max(0,l*Math.pow(1+u,r)):Math.max(0,l),c=a.costBase+n.totalAportaciones,m=Math.max(0,f-c),v=ke(m,e.tramosGanancias),h=m>0?(v/m*100).toFixed(1):"0",I=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",A=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",y=(w,S,E)=>w.map(_=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${S} ${d(_.contraparte)}: ${d(_.concepto)}</span>
          <span class="num ${E}">${d(j(_.total))} · ${_.ocurrencias} mov.</span>
        </div>`).join(""),b=n.entradas.length>0||n.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${d(o.dashboardStart.slice(0,7))} → ${d(o.dashboardEnd.slice(0,7))})</div>
         ${y(n.entradas,"↓","pos")}
         ${y(n.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${n.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${d(j(n.totalAportaciones))}</span></div>`:""}
           ${n.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${d(j(n.totalReembolsos))}</span></div>`:""}
           ${n.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${d(j(n.retencion))}</span></div>`:n.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',x=e.invModo(t._id),p=w=>`padding:3px 10px;border-radius:20px;border:1px solid ${w?"var(--accent)":"var(--border)"};background:${w?"var(--accent-dim)":"transparent"};color:${w?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,g=x==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${d(j(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${d(j(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${d(j(a.neto))}</div><div class="stat-sub">${d(A)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${d(j(c))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${d(j(f))}</div><div class="stat-sub">${d(I)} · ${d(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${d(j(f-v))}</div><div class="stat-sub">${d(h)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${d(t._id)}|real" style="${p(x==="real")}">Real</button>
          <button data-inv-modo="${d(t._id)}|proyeccion" style="${p(x==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${g}
      ${b}
    </div>`}function il(t,e){const a=[...t.historicoSaldos||[]].sort((l,u)=>u.fecha.localeCompare(l.fecha)),o=a[0],n=rt(t),s=mt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",s==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",s==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",s==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${d((tn[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':"",...(t.escenarioIds||[]).map(l=>`<span class="badge badge-yellow">🔭 ${d(e.nombreEscenario(l))}</span>`)].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${d(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${d(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${d(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Zr}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${d(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Xr}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${d(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${d(j(t.saldoInicial||0))}</div><div class="stat-sub">${d(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${d(j(n))}</div>${o?`<div class="stat-sub">Registro: ${d(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${d(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${d(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${al(t,e)}
    ${s==="beneficio"?ol(t,e):""}
    ${s==="pension"?nl(t):""}
    ${s==="inversion"?sl(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${d(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${d(t.descripcion)}</div>`:""}
  </div>`}const rl=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function ll(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${d(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${d(j(a.importe))} / ${d(a.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${d(a.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function cl(t,e){const a=t?mt(t):"cuenta",o=[...new Set(e.nominas.filter(s=>s.grupoNomina).map(s=>s.grupoNomina))],n=s=>s?"":' style="display:none"';return`
    <div class="grid-2">
      ${tt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Jt("ac-modelo","Tipo",rl,a)}
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
          ${Jt("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${Jt("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
          </div>
          <div class="form-group mt-8">
            <label class="form-label">Grupo de nóminas (para el tipo marginal de IRPF)</label>
            <select class="form-select" id="ac-beneficio-grupo">
              <option value="">Sin grupo — usar la primera nómina vinculada</option>
              ${o.map(s=>`<option value="${d(s)}"${(t==null?void 0:t.grupoNomina)===s?" selected":""}>${d(s)}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Aportaciones programadas</label>
          <div id="ac-aport-container"></div>
        </div>
        <div class="form-group mt-8"><label class="form-label">Descripción</label>
          <input class="form-input" type="text" id="ac-desc" value="${d((t==null?void 0:t.descripcion)??"")}" placeholder="Fondo indexado global..."/></div>
        <div class="form-row mt-8">
          <label class="form-label">Simulación</label>
          <label class="toggle"><input type="checkbox" id="ac-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
        </div>
        ${me(e.escenarios,(t==null?void 0:t.escenarioIds)??[],"ac-escenario")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${d((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function dl(t,e,a){const o=()=>{const n=t.querySelector("#ac-aport-container");n&&(n.innerHTML=ll(e))};J(t,"#ac-modelo",n=>{const s=n.value,i=(r,l)=>{const u=t.querySelector(r);u&&(u.style.display=l?"":"none")};i("#ac-inversion-hint",s==="inversion"),i("#ac-beneficio-fields",s==="beneficio")}),N(t,"[data-aport-anadir]",()=>{var s,i,r,l;const n=parseFloat(((s=t.querySelector("#aport-importe"))==null?void 0:s.value)??"")||0;if(!n)return q("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:n,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||a,fechaFin:((l=t.querySelector("#aport-fin"))==null?void 0:l.value)||""}),o()}),N(t,"[data-aport-borrar]",n=>{e.splice(Number(n.getAttribute("data-aport-borrar")),1),o()}),o()}function ul(t,e,a,o,n){const s=h=>{var I;return((I=t.querySelector(h))==null?void 0:I.value)??""},i=(h,I=0)=>{const A=parseFloat(s(h));return Number.isFinite(A)?A:I},r=h=>{var I;return!!((I=t.querySelector(h))!=null&&I.checked)},l=s("#ac-nombre").trim();if(!l)return{datos:{},error:"Nombre obligatorio"};const u=s("#ac-modelo")||"cuenta",f=u==="beneficio",c=i("#ac-saldo"),m={nombre:l,saldo:c,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:s("#ac-fecha-ini")||n,interes:i("#ac-interes"),periodoCobro:s("#ac-periodo")||"mensual",descripcion:s("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),escenarioIds:[...t.querySelectorAll(".ac-escenario:checked")].map(h=>h.value),modeloFondo:u,planAportaciones:e,tipoBeneficio:f?s("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:f?s("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&c<=0)return{datos:m};if(!(o===null||Math.abs(c-o)>.005))return{datos:m};if(u==="inversion"&&c>(o??0)){const h=Date.now().toString(36);m.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${h}a`,fecha:a?n:m.fechaInicialSaldo??n,cantidad:c-(o??0)}]}return{datos:m,punto:{fecha:n,saldo:c,nota:a?"Actualización manual":"Saldo inicial"}}}function va(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:et(e.saldoCts),nota:e.nota}))}function pl(t,e,a,o,n){const s=a.map(i=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <span class="num" style="min-width:110px">${d(i.fecha)}</span>
        <span class="num" style="flex:1;color:${i.saldo>=o?"var(--accent)":"var(--red)"}">${d(j(i.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${d(i.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${d(e)}|${d(i._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${d(e)}|${d(i._id)}">✕</button>
      </div>`).join("");return`
    <div class="card-title">Histórico — ${d(t)}</div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${a.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':s}
    </div>
    <div class="divider"></div>
    <div class="card-title">Añadir punto de control</div>
    <div class="grid-3">
      <div class="form-group"><label class="form-label">Fecha</label>
        <input class="form-input" type="date" id="hi-fecha" value="${d(n)}"/></div>
      <div class="form-group"><label class="form-label">Saldo real (€)</label>
        <input class="form-input" type="number" id="hi-saldo" placeholder="5000"/></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="hi-nota" placeholder="Extracto enero..."/></div>
    </div>
    <div class="flex gap-8 mt-12" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cerrar</button>
      <button class="btn-primary" data-hist-anadir="${d(e)}">Añadir</button>
    </div>`}const en=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function ml(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),n=()=>document.getElementById("modal-content"),s=()=>{var m;return(m=o())==null?void 0:m.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??Ft;function r(m,v){const h=o(),I=n();return!h||!I?null:(I.innerHTML=`<div class="modal-title">${d(m)}</div>${v}`,h.classList.remove("hidden"),N(I,"[data-cerrar]",s),I)}function l(){e=null;const m=[...t.store.get("tramosGananciasCapitalHistorico")].sort((I,A)=>I.año-A.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",h=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${d(en(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${m.map(I=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${I.año}</span>
              <span class="text-sm" style="color:var(--text2)">${d(en(I.tramos))}</span>
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
      </div>`);h&&(N(h,"[data-editar-tg]",I=>{const A=I.getAttribute("data-editar-tg");c(A==="default"?"default":Number(A))}),N(h,"[data-borrar-tg]",I=>{const A=Number(I.getAttribute("data-borrar-tg"));Z(`¿Eliminar la tabla del ejercicio ${A}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(y=>y.año!==A)),q(`Tabla ${A} eliminada`),t.onDatosCambiados(),l())}),N(h,"[data-anadir-anyo-tg]",()=>{var y;const I=parseInt(((y=h.querySelector("#tg-new-year"))==null?void 0:y.value)??"",10);if(!I||I<2e3||I>2100)return q("Año inválido","err");const A=t.store.get("tramosGananciasCapitalHistorico");if(A.some($=>$.año===I))return q("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...A,{_id:Date.now().toString(36),año:I,tramos:i().map($=>[...$])}]),t.onDatosCambiados(),c(I)}))}function u(){return a.map(([m,v],h)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${h}" value="${m}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${h}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${h}">✕</button>
          </div>
        </div>`).join("")}function f(m){a=[...m.querySelectorAll("[data-tg-min]")].map((v,h)=>{const I=m.querySelector(`[data-tg-pct="${h}"]`);return[parseFloat(v.value)||0,parseFloat((I==null?void 0:I.value)??"")||0]})}function c(m){var y;e=m;const v=t.store.get("tramosGananciasCapitalHistorico");a=(m==="default"?i():((y=v.find($=>$.año===m))==null?void 0:y.tramos)??i()).map($=>[...$]);const I=r(`Ganancias de capital — ${m==="default"?"Por defecto":m}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${u()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!I)return;const A=()=>{const $=I.querySelector("#tg-rows");$&&($.innerHTML=u())};N(I,"[data-volver-tg]",l),N(I,"[data-tg-anadir]",()=>{f(I),a.push([0,0]),A()}),N(I,"[data-tg-borrar]",$=>{f(I),a.splice(Number($.getAttribute("data-tg-borrar")),1),A()}),N(I,"[data-tg-guardar]",()=>{f(I);const $=[...a].sort((b,x)=>b[0]-x[0]);if($.length===0)return q("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:$}),q("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(b=>b.año===e?{...b,tramos:$}:b)),q(`Tabla ${e} guardada`)),t.onDatosCambiados(),l()})}return{abrir:l}}function fl(t){function e(){if(t.navegar)return t.navegar("planner");const s=globalThis.Router;s==null||s.navigate("planner")}function a(s,i,r){const l=Da(s,i,r),u=s.targetAmount||0,f=u>0?Math.min(100,l/u*100):0;return`
      <div style="padding:8px 0;border-bottom:1px solid var(--hairline-soft)">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:500">${d(s.nombre)}</span>
          <span class="num" style="font-size:11px;color:var(--text3)">
            ${d(j(l))} / ${d(j(u))}
          </span>
        </div>
        <div class="goal-bar"><div class="goal-bar-fill" style="width:${f}%;background:${d(s.color||"var(--accent)")}"></div></div>
      </div>`}function o(s){const i=t.store.get("goals");if(i.length===0){s.innerHTML="",s.style.display="none";return}s.style.display="";const r=t.store.get("accounts"),l=t.colchonEnFecha(t.hoy()),u=[...i].sort((f,c)=>(f.prioridad||99)-(c.prioridad||99));s.innerHTML=`
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">🎯 Objetivos de ahorro (antiguos)</div>
        <button class="btn-primary btn-sm" data-ir-planner>Ir a Objetivos financieros</button>
      </div>
      <div class="text-sm mb-12" style="color:var(--text2);line-height:1.6">
        Estos objetivos se gestionan ahora en <strong>Objetivos financieros</strong>, donde compiten por tu
        flujo mensual en vez de medir solo el saldo de unas cuentas. Ya se copiaron allí; esto es solo la
        copia antigua, en modo lectura.
      </div>
      ${u.map(f=>a(f,r,l)).join("")}
      <div class="mt-12">
        <button class="btn-secondary btn-sm" data-descartar-goals style="color:var(--red)">Descartar los antiguos</button>
        <div class="text-sm mt-4" style="color:var(--text3)">
          Comprueba antes que están en Objetivos financieros: esto no se puede deshacer.
        </div>
      </div>`}function n(s,i){N(s,"[data-ir-planner]",()=>e()),N(s,"[data-descartar-goals]",()=>{const r=t.store.get("goals").length;if(Z(`Se van a borrar ${r} objetivo${r!==1?"s":""} de ahorro antiguos. ¿Seguro?`)){for(const l of[...t.store.get("goals")])t.store.removeItem("goals",l._id);q("Objetivos antiguos descartados"),t.onDatosCambiados(),i()}})}return{render:o,wire:n}}const vl="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",gl=120;function bl(t){const e=t.hoy??Y,a=()=>{var C;return(C=t.onDatosCambiados)==null?void 0:C.call(t)},o=t.mostrarObjetivos??(()=>!0),n=new Map,s=()=>t.store.get("config"),i=()=>t.store.get("escenarios"),r=C=>{var M;return((M=i().find(z=>z._id===C))==null?void 0:M.nombre)??C},l=C=>{var M;return((M=t.store.get("accounts").find(z=>z._id===C))==null?void 0:M.nombre)??C},u=()=>ht(t.store.get("tramosIRPFHistorico"),s().tramos_irpf??bt)(Number(e().slice(0,4))),f=()=>ht(t.store.get("tramosGananciasCapitalHistorico"),s().tramosGananciasCapital??Ft),c=()=>f()(Number(e().slice(0,4))),m=C=>eo(t.store.get("expenses"),s(),t.store.get("loans"),C);function v(){const C=s(),M=t.store.get("accounts"),z=oe({loans:[],expenses:t.store.get("expenses").filter(B=>B.tipo==="transferencia"),accounts:M,config:{dashboardStart:C.dashboardStart,dashboardEnd:C.dashboardEnd,fechaReferencia:C.dashboardStart},nominas:[],resolverTramosGanancias:f()}),F=new Map,T=B=>{let L=F.get(B);return L||(L={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},F.set(B,L)),L},O=(B,L)=>{const k=`${L.sourceId}`,R=B.find(U=>U.concepto===k),H=R??{concepto:k,contraparte:"",total:0,ocurrencias:0};H.total+=Math.abs(L.cuantia),H.ocurrencias+=1,R||B.push(H)};for(const B of z){if(!B.cuenta)continue;const L=T(B.cuenta);B.sourceType==="transfer-in"||B.sourceType==="traspaso-in"?(L.totalAportaciones+=Math.abs(B.cuantia),O(L.entradas,B)):B.sourceType==="transfer-out"||B.sourceType==="traspaso-out"?(L.totalReembolsos+=Math.abs(B.cuantia),O(L.salidas,B)):B.sourceType==="investment-tax"&&(L.retencion+=Math.abs(B.cuantia))}const D=t.store.get("expenses");for(const B of F.values())for(const[L,k]of[[B.entradas,"cuenta"],[B.salidas,"cuentaDestino"]])for(const R of L){const H=D.find(U=>U._id===R.concepto);R.contraparte=l((H==null?void 0:H[k])??"default"),R.concepto=(H==null?void 0:H.concepto)||(k==="cuenta"?"Aportación":"Reembolso")}return F}function h(){const C=new Map,M=s(),z=e(),F=new Date(Number(z.slice(0,4)),Number(z.slice(5,7))-1+gl+1,0),T=`${F.getFullYear()}-${String(F.getMonth()+1).padStart(2,"0")}-${String(F.getDate()).padStart(2,"0")}`;return O=>{const D=C.get(O._id);if(D)return D;const B=oe({loans:t.store.get("loans"),expenses:t.store.get("expenses"),accounts:t.store.get("accounts"),config:{...M,dashboardStart:z,dashboardEnd:T,fechaReferencia:z},filtroAccounts:[O._id],nominas:t.store.get("nominas"),inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:ht(t.store.get("tramosIRPFHistorico"),M.tramos_irpf??bt),resolverTramosGanancias:f()}).map(L=>({fecha:L.fecha,saldoAcum:L.saldoAcum}));return C.set(O._id,B),B}}const I=fl({store:t.store,colchonEnFecha:m,extractoCuenta:C=>A(C),hoy:e,onDatosCambiados:a});let A=h();function y(C){A=h();const z=t.store.get("accounts").filter(D=>mt(D)!=="pension"),F=v(),T={config:s(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:u(),tramosGanancias:c(),nombreEscenario:r,flujos:D=>F.get(D)??tl,invModo:D=>n.get(D)??"proyeccion"};C.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Ahorro</span></h1>
        <div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>
      </div>
      ${el(z,T.tramosGanancias)}
      <div class="grid-3">${z.map(D=>il(D,T)).join("")}</div>
      ${o()?'<div class="card mt-14" id="goals-section"></div>':""}`;const O=C.querySelector("#goals-section");O&&I.render(O)}const $=()=>document.getElementById("modal-overlay"),b=()=>document.getElementById("modal-content"),x=()=>{var C;return(C=$())==null?void 0:C.classList.add("hidden")};function p(C,M){const z=$(),F=b();return!z||!F?null:(F.innerHTML=C?`<div class="modal-title">${d(C)}</div>${M}`:M,z.classList.remove("hidden"),N(F,"[data-cancelar]",x),F)}function g(C,M){const z=C?t.store.get("accounts").find(D=>D._id===C)??null:null,F=[...(z==null?void 0:z.planAportaciones)??[]].map(D=>({...D})),T=z?w(z):null,O=p(C?"Editar cuenta / fondo":"Nueva cuenta / fondo",cl(z,{escenarios:i(),nominas:t.store.get("nominas"),hoy:e(),saldoActual:T??0}));O&&(dl(O,F,e()),N(O,"[data-guardar-acc]",D=>{const B=D.getAttribute("data-guardar-acc")||"",{datos:L,punto:k,error:R}=ul(O,F,z,T,e());if(R)return q(R,"err");let H=B;B?t.store.updateItem("accounts",B,L):H=t.store.addItem("accounts",L)._id,k&&t.ledger.registrarPuntoControl(H,k.fecha,k.saldo,k.nota),q(B?"Actualizada":"Cuenta / fondo creado"),a(),x(),M()}))}function w(C){const M=t.ledger.puntosControl(C._id);return M.length>0?va(M)[0].saldo:C.saldo??null}function S(C,M){const z=t.store.get("accounts").find(O=>O._id===C);if(!z)return;const F=p("Histórico de saldos",pl(z.nombre,C,va(t.ledger.puntosControl(C)),z.saldoInicial||0,e()));if(!F)return;const T=()=>{M(),S(C,M)};N(F,"[data-hist-anadir]",()=>{var L,k,R;const O=((L=F.querySelector("#hi-fecha"))==null?void 0:L.value)??"",D=parseFloat(((k=F.querySelector("#hi-saldo"))==null?void 0:k.value)??""),B=((R=F.querySelector("#hi-nota"))==null?void 0:R.value.trim())??"";if(!O||!Number.isFinite(D))return q("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(C,O,D,B||void 0),q("Punto añadido"),a(),T()}),N(F,"[data-hist-borrar]",O=>{const[,D]=(O.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(D),q("Eliminado"),a(),T()}),N(F,"[data-hist-inicial]",O=>{const[D,B]=(O.getAttribute("data-hist-inicial")||"").split("|"),L=t.ledger.puntosControl(D).find(R=>R._id===B);if(!L)return;const k=va([L])[0].saldo;t.store.updateItem("accounts",D,{saldoInicial:k,fechaInicialSaldo:L.fecha}),q(`Punto inicial → ${L.fecha} (${j(k)})`),a(),T()})}function E(C){const M=t.store.get("accounts").filter(T=>T.activo);if(M.length===0)return q("No hay cuentas activas","err");const z=e(),F=M.map(T=>`• ${T.nombre}: ${j(w(T)??T.saldoInicial??0)}`).join(`
`);if(Z(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${z})?

${F}

Esto recalibra el punto de arranque del dashboard.`)){for(const T of M)t.store.updateItem("accounts",T._id,{saldoInicial:w(T)??T.saldoInicial??0,fechaInicialSaldo:z});q("Saldo base actualizado"),a(),C()}}function _(C,M,z){N(C,"[data-nueva-acc]",()=>g(null,M)),N(C,"[data-editar-acc]",F=>g(F.getAttribute("data-editar-acc"),M)),N(C,"[data-tramos-ganancias]",()=>z.abrir()),N(C,"[data-reset-base]",()=>E(M)),N(C,"[data-hist-acc]",F=>S(F.getAttribute("data-hist-acc"),M)),N(C,"[data-principal-acc]",F=>{const T=F.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(O=>({...O,esCuentaPrincipal:O._id===T}))),q("Cuenta marcada como principal"),a(),M()}),N(C,"[data-borrar-acc]",F=>{const T=F.getAttribute("data-borrar-acc");if(t.store.get("accounts").length<=1)return q("Debe existir al menos una cuenta","err");if(!Z("¿Eliminar cuenta?"))return;t.store.removeItem("accounts",T);const D=t.store.get("accounts");D.length>0&&!D.some(B=>B.esCuentaPrincipal)&&t.store.set("accounts",D.map((B,L)=>L===0?{...B,esCuentaPrincipal:!0}:B)),q("Cuenta eliminada"),a(),M()}),N(C,"[data-inv-modo]",F=>{const[T,O]=(F.getAttribute("data-inv-modo")||"").split("|");n.set(T,O==="real"?"real":"proyeccion"),M()}),I.wire(C,M)}let P=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y ahorro",flagId:"accounts",seccion:1,iconoPath:vl,mount(C){const M=()=>y(C);P??(P=ml({store:t.store,onDatosCambiados:()=>{a(),M()},año:()=>Number(e().slice(0,4))})),y(C),C.dataset.wired!=="1"&&(_(C,M,P),C.dataset.wired="1")}}}const ot=(t,e,a="var(--text)",o=!1)=>`<tr>
    <td style="padding:5px ${o?"20px":"10px"} 5px 10px;font-size:12px;color:var(--text2)">${t}</td>
    <td style="text-align:right;font-weight:600;color:${a};font-size:12px;padding:5px 10px">${d(j(e))}</td>
  </tr>`,ga=t=>`<tr><td colspan="2" style="padding:12px 10px 4px;font-size:11px;font-weight:700;color:var(--text3);letter-spacing:.5px;border-top:1px solid var(--border)">${d(t)}</td></tr>`;function an(t){const a=t.capMobiliario!==0||t.gananciasFondos!==0?`${ot("Capital mobiliario (dividendos, intereses)",t.capMobiliario,"var(--text)",!0)}
       ${ot("Ganancias patrimoniales (fondos/acciones)",t.gananciasFondos,t.gananciasFondos>=0?"var(--text)":"var(--green)",!0)}`:'<tr><td colspan="2" style="padding:5px 10px;font-size:12px;color:var(--text3);font-style:italic">Sin datos — introduce importes en el formulario</td></tr>',o=t.resultado>0?"var(--red)":"var(--green)",n=t.resultado>0?"🔴 A PAGAR":"🟢 A DEVOLVER";return`
    <table style="width:100%;border-collapse:collapse">
      ${ga("RENDIMIENTOS DEL TRABAJO")}
      ${ot("Ingresos íntegros del trabajo",t.brutoTotal,"var(--text)",!0)}
      ${t.flexTotal>0?ot("− Retribución flexible exenta (Art. 42 LIRPF)",-t.flexTotal,"var(--green)",!0):""}
      ${t.flexTotal>0?ot("= Ingresos sujetos a IRPF",t.brutoIRPF):""}
      ${ot("− Cotizaciones SS (≈6,35 %)",-t.cotizSS,"var(--red)",!0)}
      ${ot("− Gastos deducibles (Art. 19.2 LIRPF)",-t.gastosArt19,"var(--red)",!0)}
      ${ot("= Rendimiento neto trabajo",t.RNT)}
      ${ot("− Reducción Art. 20 LIRPF",-t.reducArt20,"var(--green)",!0)}
      ${t.deducPP>0?ot(`− Aportaciones a planes de pensiones (${d(j(t.aportPP))}, límite ${d(j(t.limPP))})`,-t.deducPP,"var(--green)",!0):""}
      ${t.otrosIngresos>0?ot("+ Otros ingresos sujetos a IRPF",t.otrosIngresos,"var(--text)",!0):""}
      ${t.capInmobiliario!==0?ot("+ Capital inmobiliario neto",t.capInmobiliario,t.capInmobiliario>=0?"var(--text)":"var(--green)",!0):""}
      ${t.otrasCorto!==0?ot("± Otras ganancias a corto plazo",t.otrasCorto,"var(--text)",!0):""}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE GENERAL</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${d(j(t.baseGeneral))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota IRPF base general</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${d(j(t.cuotaGen))}</td>
      </tr>

      ${ga("BASE DEL AHORRO")}
      ${a}
      <tr style="background:var(--bg3)">
        <td style="padding:7px 10px;font-weight:700;font-size:12px">BASE IMPONIBLE DEL AHORRO</td>
        <td style="text-align:right;font-weight:700;font-size:14px;padding:7px 10px">${d(j(t.baseAhorro))}</td>
      </tr>
      <tr>
        <td style="padding:4px 10px 10px;font-size:11px;color:var(--text3)">→ Cuota base del ahorro (ganancias de capital)</td>
        <td style="text-align:right;padding:4px 10px 10px;font-size:11px;color:var(--red)">${d(j(t.cuotaAho))}</td>
      </tr>

      ${ga("RESULTADO")}
      ${ot("Cuota íntegra total",t.cuotaIntegra,"var(--red)")}
      ${ot("− Retenciones en nómina",-t.retNomina,"var(--green)",!0)}
      ${t.retCapital!==0?ot("− Retenciones de capital mobiliario",-t.retCapital,"var(--green)",!0):""}
      <tr style="border-top:2px solid var(--border)">
        <td style="padding:10px;font-weight:700;font-size:14px">${n}</td>
        <td style="text-align:right;font-weight:700;font-size:18px;padding:10px;color:${o}">${d(j(Math.abs(t.resultado)))}</td>
      </tr>
    </table>`}const fe=(t,e,a,o="")=>`<div class="form-group mt-8">
    <label class="form-label">${d(e)}</label>
    <input type="number" id="${t}" class="form-input" value="${d(a)}" placeholder="0" data-rex/>
    ${o?`<div style="font-size:11px;color:var(--text3);margin-top:4px">${d(o)}</div>`:""}
  </div>`;function hl(t){const e=t.extras,a=t.nominas.length===0?`<div class="auth-hint mb-12" style="border-color:var(--yellow)">
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
          ${fe("rex-inmobiliario","Capital inmobiliario neto (alquileres − gastos)",e.capInmobiliario??0)}
          ${fe("rex-mobiliario","Capital mobiliario (dividendos, intereses)",e.capMobiliario??0)}
          ${fe("rex-ganancias","Ganancias / pérdidas patrimoniales (fondos, acciones)",e.gananciasFondos??0,"Positivo = ganancia · Negativo = pérdida compensable")}
          ${fe("rex-otras","Otras ganancias a corto plazo (menos de 1 año)",e.otrasCorto??0)}
          ${fe("rex-ret-cap","Retenciones de capital ya aplicadas",e.retCapital??0,"Retenciones del 19 % sobre dividendos, intereses y fondos ya practicadas en origen")}
        </div>
        <div class="card" style="padding:16px;font-size:12px;color:var(--text3);line-height:1.6">
          <strong style="color:var(--text2)">Detectado en la aplicación:</strong><br>
          ${t.nominas.length>0?t.nominas.map(o=>`• ${d(o.nombre)}: ${d(j(o.bruto))} brutos/año`).join("<br>"):"— Sin nóminas —"}
          ${t.planes.length>0?`<br><br><strong style="color:var(--text2)">Planes de pensiones:</strong><br>${t.planes.map(o=>`• ${d(o)}`).join("<br>")}`:""}
        </div>
      </div>

      <div class="card" style="padding:16px">
        <div class="card-title mb-12">Borrador — Ejercicio ${t.año}</div>
        <div id="renta-cuadro">${an(t.declaracion)}</div>
      </div>
    </div>`}function on(t){return`<table style="border-collapse:collapse;min-width:280px">
    <tr style="color:var(--text3)">
      <th style="text-align:left;padding:5px 10px;font-size:11px">Tramo</th>
      <th style="text-align:right;padding:5px 10px;font-size:11px">Tipo marginal</th>
    </tr>
    ${[...t].sort((a,o)=>a[0]-o[0]).map(([a,o],n,s)=>{const i=n<s.length-1?s[n+1][0]:null,r=i!==null?`${j(a)} – ${j(i)}`:`Más de ${j(a)}`;return`<tr>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);font-size:12px">${d(r)}</td>
        <td style="padding:5px 10px;border-bottom:1px solid var(--border);text-align:right;font-size:12px;font-weight:600;color:var(--red)">${d(o)}%</td>
      </tr>`}).join("")}
  </table>`}const yl=(t,e,a)=>`<div class="card" style="text-align:center;padding:48px">
    <div style="font-size:36px;margin-bottom:12px">${t}</div>
    <div style="font-size:15px;font-weight:600;margin-bottom:8px">${d(e)}</div>
    <div class="text-sm" style="color:var(--text2);max-width:380px;margin:0 auto">${a}</div>
  </div>`,ct=(t,e,a="")=>`<div class="stat-card"><div class="stat-label">${d(t)}</div><div class="stat-value ${a}">${d(e)}</div></div>`,$t=(t,e,a="")=>`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">${d(t)}</span><span class="num ${a}">${d(e)}</span></div>`;function xl(t,e,a){const o=t.filter(l=>(l.modeloFondo||"cuenta")==="inversion");if(o.length===0)return yl("📈","Sin fondos de inversión",'Ve a <strong>Cuentas y Ahorro</strong> y crea una cuenta de tipo "Fondo de inversión" para ver aquí su análisis fiscal.');let n=0,s=0,i=0;const r=o.map(l=>{const u=Ht(l,e);if(!u)return"";n+=u.saldo,s+=u.costBase,i+=u.impuesto;const f=u.costBase>0?u.plusvalia/u.costBase*100:0,c=(l.escenarioIds||[]).map(m=>`<span class="badge badge-yellow">🔭 ${d(a(m))}</span>`).join("");return`
        <div class="card mb-10">
          <div class="flex justify-between items-center mb-10">
            <div class="flex gap-8 items-center" style="flex-wrap:wrap">
              <span class="card-title" style="margin:0">${d(l.nombre)}</span>
              <span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>
              ${c}
            </div>
          </div>
          <div class="grid-2" style="gap:8px;margin-bottom:8px">
            ${ct("Valor actual",j(u.saldo))}
            ${ct("Coste base (aportado)",j(u.costBase))}
          </div>
          <div class="grid-2" style="gap:8px">
            ${ct(`Plusvalía latente (${f>=0?"+":""}${f.toFixed(1)}%)`,j(u.plusvalia),u.plusvalia>=0?"pos":"neg")}
            ${ct("Imp. ganancias de capital (est.)",j(u.impuesto),"neg")}
          </div>
          <div class="flex justify-between mt-10" style="padding-top:8px;border-top:1px solid var(--border)">
            <span class="text-sm" style="font-weight:600">Neto tras liquidar</span>
            <span class="num pos" style="font-weight:700;font-size:15px">${d(j(u.neto))}</span>
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
      ${on(e)}
      <div class="text-sm mt-8" style="color:var(--text3)">
        Configura los tramos en <strong>Cuentas y Ahorro → ⚙ Tramos ganancias capital</strong>.
      </div>
    </div>`}function $l(t){const{nominas:e,planes:a,tramos:o}=t,n=v=>v.grupoNomina?e.filter(h=>(h.grupoNomina||"")===v.grupoNomina):null,s=e.map(v=>({n:v,d:Ue(v,n(v),o)})),i=s.reduce((v,h)=>v+h.d.brutoAnual,0),r=s.reduce((v,h)=>v+h.d.irpfAnual,0),l=s.reduce((v,h)=>v+h.d.ssAnual,0),u=s.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin nóminas activas. Configúralas en el módulo <strong>Nóminas</strong>.</div>':s.map(({n:v,d:h})=>`
        <div class="card">
          <div class="card-title" style="margin-bottom:10px">${d(v.nombre)}</div>
          ${$t("Bruto anual",j(h.brutoAnual))}
          ${h.flexAnual>0?$t("− Retribución flexible exenta",j(-h.flexAnual),"pos"):""}
          ${$t("− Cotización SS",j(-h.ssAnual),"neg")}
          ${$t(`− IRPF estimado (${h.irpfPct.toFixed(1)} %)`,j(-h.irpfAnual),"neg")}
          <div class="flex justify-between" style="border-top:1px solid var(--border);padding-top:6px;margin-top:4px">
            <span class="text-sm" style="font-weight:600">Neto anual</span>
            <span class="num pos">${d(j(h.baseDineraria-h.ssAnual-h.irpfAnual))}</span>
          </div>
        </div>`).join(""),f=La(e,o),c=`${t.hoy.slice(0,4)}-01-01`,m=a.length===0?'<div class="text-sm" style="color:var(--text3);padding:12px 0">Sin planes de pensiones. Créalos en <strong>Nóminas</strong>.</div>':a.map(v=>{const h=xe(v);if(!h)return"";const I=(v.aportaciones||[]).filter(b=>b.fecha>=c).reduce((b,x)=>b+x.cantidad,0),y=Math.min(I,Dt)*f/100,$=I>Dt;return`
        <div class="card">
          <div class="flex gap-8 items-center mb-10">
            <span class="card-title" style="margin:0">${d(v.nombre)}</span>
            <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
          </div>
          ${$t("Valor actual",j(h.saldo))}
          ${$t("Coste base (total aportado)",j(h.costBase))}
          ${$t("Revalorización",j(h.beneficio),h.beneficio>=0?"pos":"neg")}
          <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
            <div style="font-size:11px;color:var(--text3);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">Año ${d(t.hoy.slice(0,4))}</div>
            ${$t("Aportado",`${j(I)}${$?" ⚠":""}`,$?"neg":"")}
            ${$t("Límite deducible",j(Dt))}
            ${$t(`Ahorro IRPF est. (marginal ${f} %)`,j(y),"pos")}
            ${$?`<div class="text-sm mt-6" style="color:var(--red)">⚠ La aportación supera el límite deducible (${d(j(Dt))})</div>`:""}
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text3);line-height:1.5">
            Al rescatar tributa como <strong>rendimiento del trabajo</strong> (tramos generales del IRPF), no en la base del ahorro.
            ${h.proxDesbloqueo?`· Próx. desbloqueo: ${d(h.proxDesbloqueo)}`:""}
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
      aportaciones son deducibles hasta <strong>${d(j(Dt))}/año</strong> (plan individual).
    </div>
    <div class="grid-3 mb-16">${m}</div>

    <div class="card">
      <div class="card-title mb-8">Tramos IRPF — base general del trabajo</div>
      ${on(o)}
      <div class="text-sm mt-8" style="color:var(--text3)">Configura los tramos en <strong>Nóminas → ⚙ Tramos IRPF</strong>.</div>
    </div>`}const Ee=(t,e)=>`<div style="padding:12px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
    <div style="font-weight:600;margin-bottom:4px;font-size:13px">${d(t)}</div>
    <div class="text-sm" style="color:var(--text3)">${d(e)}</div>
  </div>`;function Il(){return`
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
        ${Ee("Rendimientos íntegros","Alquileres, subarriendos y cesión de derechos sobre inmuebles")}
        ${Ee("Gastos deducibles","IBI, seguros, reparaciones, amortización (3 %/año sobre el valor de construcción) y financiación")}
        ${Ee("Reducción del 60 %","Arrendamiento de vivienda habitual del inquilino (art. 23.2 LIRPF)")}
        ${Ee("Base general del IRPF","Tributa a tramos ordinarios, no en la base del ahorro. Sin diferimiento fiscal.")}
      </div>
    </div>`}const nn=[["declaracion","Declaración Renta"],["mobiliario","Capital Mobiliario"],["trabajo","Rendimientos del Trabajo"],["inmobiliario","Capital Inmobiliario"]],Al="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15h8v2H8v-2zm0-4h8v2H8v-2zm0-4h4v2H8V7z";function wl(t){const e=t.hoy??Y;let a="declaracion",o={};const n=()=>t.store.get("config"),s=()=>Number(e().slice(0,4)),i=()=>t.store.get("nominas").filter($=>$.activo),r=()=>t.store.get("accounts").filter($=>($.modeloFondo||"cuenta")==="pension"),l=$=>{var b;return((b=t.store.get("escenarios").find(x=>x._id===$))==null?void 0:b.nombre)??$},u=()=>ht(t.store.get("tramosIRPFHistorico"),n().tramos_irpf??bt)(s()),f=()=>ht(t.store.get("tramosGananciasCapitalHistorico"),n().tramosGananciasCapital??Ft)(s());function c(){const $=`${s()}-01-01`,b=t.store.get("nominas").filter(g=>g.activo&&!g.simulacion),x=r().reduce((g,w)=>g+(w.aportaciones||[]).filter(S=>S.fecha>=$).reduce((S,E)=>S+E.cantidad,0),0),p=t.store.get("expenses").filter(g=>g.activo&&g.sujetoIRPF&&g.tipo==="ingreso").reduce((g,w)=>g+Ba(w),0);return Ha({nominas:b,aportacionesPension:x,otrosIngresos:p,extras:o,tramosGeneral:u(),tramosAhorro:f()})}function m(){const $=u(),b=i(),x=M=>M.grupoNomina?b.filter(z=>(z.grupoNomina||"")===M.grupoNomina):null,p=b.map(M=>Ue(M,x(M),$)),g=p.reduce((M,z)=>M+z.brutoAnual,0),w=p.reduce((M,z)=>M+z.irpfAnual,0),S=p.reduce((M,z)=>M+z.ssAnual,0),E=t.store.get("accounts").filter(M=>(M.modeloFondo||"cuenta")==="inversion");let _=0,P=0;for(const M of E){const z=Ht(M,f());z&&(_+=z.plusvalia,P+=z.impuesto)}if(g<=0&&E.length===0)return"";const C=(M,z,F)=>`<div class="exec-item"><div class="exec-item-label">${d(M)}</div><div class="exec-item-val ${F}">${d(z)}</div></div>`;return`<div class="exec-summary mb-14">
      ${g>0?C("IRPF trabajo",`${j(w)}/año`,"neg"):""}
      ${g>0?C("Neto trabajo",`${j(g-S-w)}/año`,"pos"):""}
      ${E.length>0?C("Plusvalía latente",j(_),_>=0?"pos":"neg"):""}
      ${E.length>0?C("Imp. potencial (inversión)",j(P),"neg"):""}
    </div>`}function v(){return a==="mobiliario"?xl(t.store.get("accounts"),f(),l):a==="trabajo"?$l({nominas:i(),planes:r(),tramos:u(),hoy:e()}):a==="inmobiliario"?Il():hl({año:s(),extras:o,declaracion:c(),nominas:i().map($=>({nombre:$.nombre,bruto:$.bruto||0})),planes:r().map($=>$.nombre)})}function h($,b){const x=a===$;return`<button data-tab-fisc="${$}" style="
      padding:10px 18px;border:none;background:transparent;cursor:pointer;
      font-size:13px;font-weight:${x?"600":"400"};
      color:${x?"var(--accent)":"var(--text2)"};
      border-bottom:2px solid ${x?"var(--accent)":"transparent"};
      margin-bottom:-1px;transition:all .15s;white-space:nowrap;
    ">${d(b)}</button>`}function I($){const b=$.querySelector("#fisc-tabs"),x=$.querySelector("#fisc-tab-content");b&&(b.innerHTML=nn.map(([p,g])=>h(p,g)).join("")),x&&(x.innerHTML=v())}function A($){$.innerHTML=`
      <div class="page-header"><h1 class="page-title">Fiscalidad</h1></div>
      ${m()}
      <div id="fisc-tabs" style="display:flex;gap:0;margin-bottom:24px;border-bottom:1px solid var(--border);overflow-x:auto">
        ${nn.map(([b,x])=>h(b,x)).join("")}
      </div>
      <div id="fisc-tab-content">${v()}</div>`}function y($){N($,"[data-tab-fisc]",b=>{a=b.getAttribute("data-tab-fisc")||"declaracion",I($)}),$.addEventListener("input",b=>{var w;if(!((w=b.target)==null?void 0:w.closest("[data-rex]")))return;const p=S=>{var E;return((E=$.querySelector(`#${S}`))==null?void 0:E.value)??"0"};o={capInmobiliario:parseFloat(p("rex-inmobiliario"))||0,capMobiliario:parseFloat(p("rex-mobiliario"))||0,gananciasFondos:parseFloat(p("rex-ganancias"))||0,otrasCorto:parseFloat(p("rex-otras"))||0,retCapital:parseFloat(p("rex-ret-cap"))||0};const g=$.querySelector("#renta-cuadro");g&&(g.innerHTML=an(c()))})}return{id:"fiscalidad",route:"rentas",nombre:"Fiscalidad",flagId:"fiscalidad",seccion:2,iconoPath:Al,mount($){A($),$.dataset.wired!=="1"&&(y($),$.dataset.wired="1")}}}const sn=()=>globalThis.Chart??null;function Sl(t,e){const a=sn();if(!a)return null;const o=e.map(n=>({label:n.label,data:n.puntos.map(s=>({x:s.x,y:s.y})),borderColor:n.esBase?"#6b7280":n.color,backgroundColor:n.esBase?"transparent":`${n.color}18`,borderWidth:n.esBase?1.5:2,...n.esBase?{borderDash:[4,3]}:{fill:!1},pointRadius:2,tension:.3}));return new a(t,{type:"line",data:{datasets:o},options:{responsive:!0,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"var(--text2)",font:{size:11}}},tooltip:{callbacks:{label:n=>`${n.dataset.label}: ${j(n.parsed.y)}`}}},scales:{x:{type:"time",time:{unit:"month",displayFormats:{month:"MMM yy"}},ticks:{color:"var(--text3)",maxTicksLimit:12},grid:{color:"rgba(255,255,255,0.04)"}},y:{ticks:{color:"var(--text3)",callback:n=>j(n)},grid:{color:"rgba(255,255,255,0.04)"}}}}})}const Ml=()=>sn()!==null,Lt=["#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],Cl="M17 8C8 10 5.9 16.17 3.82 21h2.24c.38-1.35.86-2.63 1.47-3.8C9.44 16.16 12.05 15 16 15c-.02 3.31-.02 6 0 9h2V9l-1-1zm-4.5 3.5l-1.5 1.5L12.5 14H10v-2.5L8.5 10 10 8.5V6h2.5l1.5-1.5L15.5 6H18v2.5L19.5 10 18 11.5V14h-2.5l-1-1z";function El(t){const e=()=>{var g;return(g=t.onDatosCambiados)==null?void 0:g.call(t)},a=new Set;let o=null;const n=()=>t.store.get("config"),s=()=>t.store.get("escenarios"),i=g=>{var w;return g?((w=s().find(S=>S._id===g))==null?void 0:w.nombre)??g:"Base"};function r(g){const w=n(),S=Na({loans:t.store.get("loans"),expenses:t.store.get("expenses"),nominas:t.store.get("nominas"),accounts:t.store.get("accounts")},(g==null?void 0:g._id)??null),E=a.size>0?S.accounts.filter(M=>!a.has(M._id)):S.accounts,_=a.size>0?E.map(M=>M._id):null,P=g!=null&&g.fechaFin&&g.fechaFin>w.dashboardEnd?g.fechaFin:w.dashboardEnd;return{eventos:oe({loans:S.loans,expenses:S.expenses,accounts:E,config:{...w,dashboardEnd:P},filtroAccounts:_,nominas:S.nominas,inflacionPeriodos:t.store.get("inflacion"),resolverTramosIRPF:ht(t.store.get("tramosIRPFHistorico"),w.tramos_irpf??bt),resolverTramosGanancias:ht(t.store.get("tramosGananciasCapitalHistorico"),w.tramosGananciasCapital??Ft)}),horizonte:P}}function l(g){const w=t.store.get("loans"),S=C=>(C.escenarioIds||[]).includes(g),E=[[w.filter(S).length,"préstamo","préstamos"],[w.flatMap(C=>C.amortizaciones||[]).filter(S).length,"amortización","amortizaciones"],[t.store.get("expenses").filter(S).length,"gasto","gastos"],[t.store.get("accounts").filter(S).length,"cuenta","cuentas"],[t.store.get("nominas").filter(S).length,"nómina","nóminas"]],_=E.reduce((C,[M])=>C+M,0),P=E.filter(([C])=>C>0).map(([C,M,z])=>`${C} ${C===1?M:z}`).join(" · ");return{total:_,texto:P}}function u(g,w){const S=w===g._id,E=g.color||Lt[0],{total:_,texto:P}=l(g._id);return`<div class="card mb-12" style="border-left:3px solid ${d(E)};padding:14px 16px">
      <div class="flex gap-12 items-center" style="flex-wrap:wrap;margin-bottom:10px">
        <div style="width:12px;height:12px;border-radius:50%;background:${d(E)};flex-shrink:0"></div>
        <span style="font-weight:600;font-size:15px;flex:1">${d(g.nombre)}</span>
        ${S?'<span class="badge badge-yellow">● Activo</span>':""}
        ${g.fechaFin?`<span class="badge badge-inactive">📅 ${d(g.fechaFin)}</span>`:""}
        <div class="flex gap-8">
          ${S?'<button class="btn-secondary btn-sm" data-desactivar-esc>Desactivar</button>':`<button class="btn-primary btn-sm" data-activar-esc="${d(g._id)}">Activar</button>`}
          <button class="btn-secondary btn-sm" data-editar-esc="${d(g._id)}">Editar</button>
          <button class="btn-danger btn-sm" data-borrar-esc="${d(g._id)}">✕</button>
        </div>
      </div>
      ${g.descripcion?`<div class="text-sm mb-8" style="color:var(--text2)">${d(g.descripcion)}</div>`:""}
      <div class="flex gap-16 flex-wrap" style="font-size:12px;color:var(--text3)">
        ${_===0?"<span>Sin elementos asignados. Asígnalos desde Préstamos, Gastos e Ingresos, Cuentas o Nóminas.</span>":`<span>${d(P)}</span>`}
      </div>
    </div>`}function f(g){const w=n().dashboardEnd,S=Le(r(null).eventos,w);return`
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
        <tbody>${g.map(_=>{const{eventos:P}=r(_),C=_.fechaFin||w,M=Le(P,C),z=M!==null&&S!==null?M-S:null;return`<tr>
          <td style="padding:6px 10px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${d(_.color||Lt[0])};margin-right:6px"></span>
            ${d(_.nombre)}
          </td>
          <td class="num" style="padding:6px 10px">${d(C)}</td>
          <td class="num" style="padding:6px 10px">${M!==null?d(j(M)):"—"}</td>
          <td class="num ${z===null?"":z>=0?"pos":"neg"}" style="padding:6px 10px">
            ${z===null?"—":`${z>=0?"+":""}${d(j(z))}`}
          </td>
        </tr>`}).join("")}</tbody>
      </table>`}function c(){const g=t.store.get("accounts");return g.length<=1?"":`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:12px">
      <span style="font-size:12px;color:var(--text3);margin-right:4px">Cuentas:</span>${g.map(S=>{const E=a.has(S._id);return`<button data-toggle-cuenta="${d(S._id)}" style="padding:4px 10px;border-radius:20px;
          border:1px solid ${E?"var(--border)":"var(--accent)"};
          background:${E?"transparent":"rgba(99,102,241,0.1)"};
          color:${E?"var(--text3)":"var(--text1)"};cursor:pointer;font-size:12px;
          ${E?"text-decoration:line-through;":""}">${d(S.nombre)}</button>`}).join("")}
    </div>`}function m(){if(o){try{o.destroy()}catch{}o=null}}function v(g){const w=n(),S=r(null),E=[{label:"Base (sin supuesto)",color:"#6b7280",esBase:!0,puntos:qe(S.eventos,w.dashboardStart,w.dashboardEnd)}];return g.forEach((_,P)=>{const{eventos:C,horizonte:M}=r(_);E.push({label:_.nombre,color:_.color||Lt[P%Lt.length],puntos:qe(C,w.dashboardStart,M)})}),E}function h(g,w){m();const S=g.querySelector("#chart-comparacion");S&&(o=Sl(S,v(w)))}function I(g){m();const w=new Set(t.store.get("accounts").map(_=>_._id));for(const _ of[...a])w.has(_)||a.delete(_);const S=s(),E=n().escenarioActivo||null;g.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Supuestos</span></h1>
        <div class="page-actions"><button class="btn-primary" data-nuevo-esc>+ Nuevo supuesto</button></div>
      </div>

      ${E?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.08);border:1px solid rgba(255,209,102,0.25);display:flex;align-items:center;gap:12px">
               <span style="font-size:18px">🔭</span>
               <div style="flex:1">
                 <span style="font-weight:600;color:var(--yellow)">Escenario activo: ${d(i(E))}</span>
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
             </div>`:`<div>${S.map(_=>u(_,E)).join("")}</div>
             <div class="card-title mt-24" style="margin-bottom:12px">Comparativa de supuestos</div>
             <div class="card" style="padding:16px">
               <div id="esc-pastillas">${c()}</div>
               ${Ml()?'<canvas id="chart-comparacion" height="160"></canvas>':'<div class="text-sm" style="color:var(--text3);padding:12px 0">El gráfico necesita Chart.js, que no se ha podido cargar. La tabla de abajo tiene los mismos datos.</div>'}
             </div>
             <div class="card mt-12" style="padding:14px" id="esc-comparativa">${f(S)}</div>`}`,S.length>0&&h(g,S)}const A=()=>document.getElementById("modal-overlay"),y=()=>document.getElementById("modal-content"),$=()=>{var g;return(g=A())==null?void 0:g.classList.add("hidden")};function b(g,w){const S=g?s().find(C=>C._id===g)??null:null,E=A(),_=y();if(!E||!_)return;const P=(S==null?void 0:S.color)||Lt[0];_.innerHTML=`
      <div class="modal-title">${g?"Editar supuesto":"Nuevo supuesto"}</div>
      <div class="form-group"><label class="form-label">Nombre del supuesto</label>
        <input class="form-input" type="text" id="esc-nombre" value="${d((S==null?void 0:S.nombre)??"")}" placeholder="Ej: Amortizo agresivo"/></div>
      <div class="form-group mt-8"><label class="form-label">Fecha objetivo de comparación</label>
        <input class="form-input" type="date" id="esc-fecha-fin" value="${d((S==null?void 0:S.fechaFin)??"")}"/></div>
      <div class="form-group mt-8">
        <label class="form-label">Color</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">
          ${Lt.map(C=>`<div data-color-esc="${C}" style="width:26px;height:26px;border-radius:50%;background:${C};cursor:pointer;
              border:2px solid ${C===P?"white":"transparent"};transition:border .15s"></div>`).join("")}
        </div>
        <input type="hidden" id="esc-color" value="${d(P)}"/>
      </div>
      <div class="form-group mt-8"><label class="form-label">Descripción (opcional)</label>
        <input class="form-input" type="text" id="esc-desc" value="${d((S==null?void 0:S.descripcion)??"")}" placeholder="Qué evalúa este escenario"/></div>
      <div class="flex gap-8 mt-20" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar-esc="${d(g??"")}">${g?"Guardar cambios":"Crear escenario"}</button>
      </div>`,E.classList.remove("hidden"),N(_,"[data-cancelar]",$),N(_,"[data-color-esc]",C=>{const M=C.getAttribute("data-color-esc");_.querySelector("#esc-color").value=M;for(const z of _.querySelectorAll("[data-color-esc]"))z.style.border=z.getAttribute("data-color-esc")===M?"2px solid white":"2px solid transparent"}),N(_,"[data-guardar-esc]",C=>{const M=_.querySelector("#esc-nombre").value.trim();if(!M)return q("El nombre es obligatorio","err");const z={nombre:M,fechaFin:_.querySelector("#esc-fecha-fin").value||null,color:_.querySelector("#esc-color").value||Lt[0],descripcion:_.querySelector("#esc-desc").value.trim()},F=C.getAttribute("data-guardar-esc")||"";F?(t.store.updateItem("escenarios",F,z),q("Escenario actualizado")):(t.store.addItem("escenarios",z),q("Escenario creado")),e(),$(),w()})}function x(g,w){if(!Z("¿Eliminar este escenario? Los elementos asignados perderán esta asignación."))return;const S=E=>E.map(_=>({..._,escenarioIds:(_.escenarioIds||[]).filter(P=>P!==g)}));t.store.set("loans",S(t.store.get("loans")).map(E=>({...E,amortizaciones:S(E.amortizaciones||[])}))),t.store.set("expenses",S(t.store.get("expenses"))),t.store.set("nominas",S(t.store.get("nominas"))),t.store.set("accounts",S(t.store.get("accounts"))),n().escenarioActivo===g&&t.store.patchConfig({escenarioActivo:null}),t.store.removeItem("escenarios",g),q("Escenario eliminado"),e(),w()}function p(g,w){N(g,"[data-nuevo-esc]",()=>b(null,w)),N(g,"[data-editar-esc]",S=>b(S.getAttribute("data-editar-esc"),w)),N(g,"[data-borrar-esc]",S=>x(S.getAttribute("data-borrar-esc"),w)),N(g,"[data-activar-esc]",S=>{const E=S.getAttribute("data-activar-esc");t.store.patchConfig({escenarioActivo:E}),q(`Escenario "${i(E)}" activado`),e(),w()}),N(g,"[data-desactivar-esc]",()=>{t.store.patchConfig({escenarioActivo:null}),q("Volviendo a la realidad base"),e(),w()}),N(g,"[data-toggle-cuenta]",S=>{const E=S.getAttribute("data-toggle-cuenta");a.has(E)?a.delete(E):a.add(E);const _=g.querySelector("#esc-pastillas");_&&(_.innerHTML=c());const P=s(),C=g.querySelector("#esc-comparativa");C&&(C.innerHTML=f(P)),h(g,P)})}return{id:"escenarios",route:"escenarios",nombre:"Supuestos",flagId:"supuestos",seccion:2,iconoPath:Cl,mount(g){const w=()=>I(g);I(g),g.dataset.wired!=="1"&&(p(g,w),g.dataset.wired="1")},unmount(){m()}}}const jl=1e-12,rn=t=>Math.abs(t)<jl,ln=t=>t/12;function _l(t,e,a,o){if(a<=0)return Math.max(0,Math.ceil(t-e));const n=t-e;if(n<=0)return 0;const s=ln(o);if(rn(s))return Math.ceil(n/a);const i=Math.pow(1+s,a),r=(t-e*i)*s/(i-1);return r<=0?0:Math.ceil(r)}function zl(t,e){const a=ln(e);return rn(a)?0:Math.round(t*a)}function cn({rentaNetaMensual:t,tasaRetiroSeguro:e,tipoFiscalEfectivo:a}){if(e<=0)throw new RangeError("La tasa de retiro seguro tiene que ser mayor que cero.");if(a>=1)throw new RangeError("El tipo fiscal efectivo no puede llegar al 100 %.");const o=Math.round(t*12/(1-a));return{retiroBrutoAnual:o,capitalNecesario:Math.round(o/e)}}function dn(t,e){const[a,o]=t.split("-").map(Number),n=a*12+(o-1)+e,s=Math.floor(n/12),i=n%12+1;return`${s}-${String(i).padStart(2,"0")}`}function ba(t,e){const[a,o]=t.split("-").map(Number),[n,s]=e.split("-").map(Number);return(n-a)*12+(s-o)}const un=t=>Number(t.slice(0,4));function je(t){return t.rentaDeseada?cn(t.rentaDeseada).capitalNecesario:t.importeObjetivo??0}const Fl={_id:"__sin_vehiculo__"};function _e(t){var $,b,x;const e=Math.max(0,Math.floor(t.horizonteMeses)),a=new Map(t.vehiculos.map(p=>[p._id,p])),o=[...t.objetivos].sort((p,g)=>p.prioridad-g.prioridad).map(p=>({def:p,objetivo:je(p),saldo:p.saldoActual,estado:je(p)>0&&p.saldoActual>=je(p)&&p.modoAsignacion!=="ABSORBE_RESIDUAL"?"COMPLETADO":"PENDIENTE",vehiculo:a.get(p.vehiculoId),aportadoEnAño:0,añoEnCurso:un(t.fechaInicio),ultimaSolicitud:0,solicitadoAcumulado:0,mesesReclamando:0})),n=new Map;for(const p of t.eventos){const g=n.get(p.fecha)??[];g.push(p),n.set(p.fecha,g)}const s=[],i=[],r=[];let l=t.perfil.netoMensual,u=t.perfil.gastosFijosMensuales,f=0,c=0;const m=[];for(let p=0;p<e;p++){const g=dn(t.fechaInicio,p),w=un(g);for(const D of n.get(g)??[])if(D.tipo==="CAMBIO_INGRESOS")l=D.importe;else if(D.tipo==="CAMBIO_GASTOS_FIJOS")u=D.importe;else if(D.tipo==="NUEVA_DEUDA")u+=D.importe;else if(D.tipo==="INYECCION_CAPITAL"){const B=D.objetivoDestinoId?o.find(L=>L.def._id===D.objetivoDestinoId):void 0;B?B.saldo+=D.importe:l+=D.importe}for(const D of o)D.añoEnCurso!==w&&(D.añoEnCurso=w,D.aportadoEnAño=0);const S=Math.max(0,l-u),E=Math.round(S*Pl(t.pctDisfrute));let _=S-E;const P=_,C=o.filter(D=>D.estado!=="COMPLETADO"),M=[];let z=0;const F=C.filter(D=>D.def.modoAsignacion==="ABSORBE_RESIDUAL"),T=C.filter(D=>D.def.modoAsignacion!=="ABSORBE_RESIDUAL");for(const D of T){const B=Dl(D,g,p,t);D.ultimaSolicitud=B,B>0&&(D.solicitadoAcumulado+=B,D.mesesReclamando+=1),(D.def.modoAsignacion==="CUOTA_POR_FECHA"||D.def.modoAsignacion==="FIJO")&&(z+=B);const L=Math.max(0,Math.min(B,_));_-=L,D.saldo+=L,D.aportadoEnAño+=L,f+=L,L>0&&D.estado==="PENDIENTE"&&(D.estado="EN_CURSO"),M.push({objetivoId:D.def._id,asignado:L,solicitado:B,saldoTrasMes:D.saldo})}if(F.length>0&&_>0){const D=F.map(k=>Math.max(0,k.def.pesoResidual??1)),B=D.reduce((k,R)=>k+R,0)||F.length;let L=0;F.forEach((k,R)=>{const H=R===F.length-1?_-L:Math.floor(_*D[R]/B);L+=H,k.saldo+=H,k.aportadoEnAño+=H,f+=H,H>0&&k.estado==="PENDIENTE"&&(k.estado="EN_CURSO"),M.push({objetivoId:k.def._id,asignado:H,solicitado:0,saldoTrasMes:k.saldo})}),_-=L}else for(const D of F)M.push({objetivoId:D.def._id,asignado:0,solicitado:0,saldoTrasMes:D.saldo});z>P&&m.push({mes:g,deficit:z-P});for(const D of o)D.saldo<=0||(D.saldo+=zl(D.saldo,(($=D.vehiculo)==null?void 0:$.rentabilidadRealAnual)??0));for(const D of o)D.estado!=="COMPLETADO"&&(D.def.modoAsignacion==="ABSORBE_RESIDUAL"&&D.objetivo<=0||D.objetivo>0&&D.saldo>=D.objetivo&&(D.estado="COMPLETADO",i.push({objetivoId:D.def._id,nombre:D.def.nombre,mes:g,indice:p,importeFinal:D.saldo,cuotaLiberada:D.ultimaSolicitud})));for(const D of o)M.some(B=>B.objetivoId===D.def._id)||M.push({objetivoId:D.def._id,asignado:0,solicitado:0,saldoTrasMes:D.saldo});const O=o.reduce((D,B)=>D+B.saldo,0);if(c+=E,s.push({indice:p,mes:g,netoMensual:l,gastosFijos:u,sobrante:S,disfrute:E,disponible:P,sinAsignar:_,asignaciones:M.sort((D,B)=>pn(o,D.objetivoId)-pn(o,B.objetivoId)),patrimonioTotal:O}),o.length>0&&o.every(D=>D.estado==="COMPLETADO"))break}const v=[];if(m.length>0){const p=Math.round(m.reduce((g,w)=>g+w.deficit,0)/m.length);r.push({severidad:"error",codigo:"INVIABLE",mensaje:`El plan no cabe en el flujo de caja durante ${m.length} mes${m.length!==1?"es":""} (desde ${m[0].mes}). Déficit medio: ${(p/100).toFixed(2)} €/mes.`,mes:m[0].mes,deficitMensual:p});for(const g of o)g.estado!=="COMPLETADO"&&g.def.fechaLimite&&g.def.modoAsignacion==="CUOTA_POR_FECHA"&&(g.estado="INVIABLE");v.push(...Nl(o,t,p))}for(const p of o){const g=(b=p.vehiculo)==null?void 0:b.topeAportacionAnual;g&&p.def.modoAsignacion==="FIJO"&&(p.def.importeFijoMensual??0)*12>g&&r.push({severidad:"atencion",codigo:"TOPE_FISCAL",objetivoId:p.def._id,mensaje:`«${p.def.nombre}» pide ${((p.def.importeFijoMensual??0)/100).toFixed(2)} €/mes, que supera el tope anual de ${(g/100).toFixed(2)} €. Se aporta hasta el tope y se reanuda en enero.`})}for(const p of o)p.estado!=="COMPLETADO"&&p.objetivo>0&&p.def.modoAsignacion!=="ABSORBE_RESIDUAL"&&r.push({severidad:"atencion",codigo:"NUNCA_COMPLETADO",objetivoId:p.def._id,mensaje:`«${p.def.nombre}» no se completa dentro del horizonte de ${e} meses.`});const h=o.find(p=>p.def.tipo==="INVERSION_PERPETUA"),I=h?i.find(p=>p.objetivoId===h.def._id):void 0,A={};for(const p of o){const g=((x=p.vehiculo)==null?void 0:x._id)??Fl._id;A[g]=(A[g]??0)+p.saldo}const y={};for(const p of o)y[p.def._id]=p.estado;return{viable:m.length===0,mesesSimulados:s.length,serieMensual:s,hitos:i,fases:Tl(s,i),avisos:r,propuestas:v,estadoFinal:y,resumen:{patrimonioFinal:o.reduce((p,g)=>p+g.saldo,0),patrimonioPorVehiculo:A,totalAportado:f,totalDisfrute:c,mesIndependencia:(I==null?void 0:I.mes)??null}}}const Pl=t=>Number.isFinite(t)?Math.min(1,Math.max(0,t)):0,pn=(t,e)=>t.findIndex(a=>a.def._id===e);function Dl(t,e,a,o){var s,i;const n=Math.max(0,t.objetivo-t.saldo);switch(t.def.modoAsignacion){case"ABSORBE_TODO":return n;case"FIJO":{const r=t.def.importeFijoMensual??0,l=(s=t.vehiculo)==null?void 0:s.topeAportacionAnual;if(!l)return t.objetivo>0?Math.min(r,n):r;const u=Math.max(0,l-t.aportadoEnAño),f=Math.min(r,u);return t.objetivo>0?Math.min(f,n):f}case"CUOTA_POR_FECHA":{if(n<=0)return 0;const r=t.def.fechaLimite?ba(e,t.def.fechaLimite):o.horizonteMeses-a;return _l(t.objetivo,t.saldo,Math.max(0,r),((i=t.vehiculo)==null?void 0:i.rentabilidadRealAnual)??0)}default:return 0}}function Tl(t,e){if(t.length===0)return[];const o=[0,...[...new Set(e.map(s=>s.indice))].sort((s,i)=>s-i).map(s=>s+1)].filter((s,i,r)=>r.indexOf(s)===i&&s<t.length),n=[];for(let s=0;s<o.length;s++){const i=o[s],r=(s+1<o.length?o[s+1]:t.length)-1;if(r<i)continue;const l=new Set;for(let u=i;u<=r;u++)for(const f of t[u].asignaciones)f.asignado>0&&l.add(f.objetivoId);n.push({desde:t[i].mes,hasta:t[r].mes,meses:r-i+1,objetivosActivos:[...l]})}return n}function Nl(t,e,a){const o=[],n=Math.max(0,e.perfil.netoMensual-e.perfil.gastosFijosMensuales);if(n>0&&e.pctDisfrute>0){const l=Math.ceil(Math.min(e.pctDisfrute,a/n)*100);if(l>0){const u=Math.round(e.pctDisfrute*100);o.push({clase:"REDUCIR_DISFRUTE",magnitud:l,mensaje:`Bajar el disfrute ${l} punto${l!==1?"s":""} (del ${u} % al ${Math.max(0,u-l)} %) libera ${(Math.min(a,n*e.pctDisfrute)/100).toFixed(0)} €/mes.`})}}const s=t.filter(l=>l.def.modoAsignacion==="CUOTA_POR_FECHA"&&l.def.fechaLimite&&l.estado!=="COMPLETADO"),i=l=>l.mesesReclamando>0?l.solicitadoAcumulado/l.mesesReclamando:0,r=[...s].sort((l,u)=>i(u)-i(l))[0];if(r){const l=Math.max(0,r.objetivo-r.saldo),u=i(r),f=Math.max(1,ba(e.fechaInicio,r.def.fechaLimite)),c=Math.max(1,u-a),m=Math.ceil(l/c),v=Math.max(1,m-f);o.push({clase:"RETRASAR_FECHA",objetivoId:r.def._id,magnitud:v,mensaje:`Retrasar «${r.def.nombre}» ${v} mes${v!==1?"es":""}, hasta ${dn(r.def.fechaLimite,v)}, baja su cuota a lo que cabe en el flujo.`});const h=Math.min(Math.round(a*f),Math.max(0,r.objetivo-1));h>0&&o.push({clase:"REDUCIR_IMPORTE",objetivoId:r.def._id,magnitud:h,mensaje:`O reducir «${r.def.nombre}» en ${(h/100).toFixed(0)} €, de ${(r.objetivo/100).toFixed(0)} € a ${((r.objetivo-h)/100).toFixed(0)} €.`})}return s.length>1&&o.push({clase:"REORDENAR",magnitud:s.length,mensaje:`Hay ${s.length} objetivos con fecha compitiendo a la vez. Escalonarlos reparte la carga en vez de acumularla.`}),o.length===0&&o.push({clase:"REDUCIR_IMPORTE",magnitud:a,mensaje:`Faltan ${(a/100).toFixed(0)} €/mes. Hay que recortar aportaciones fijas, subir ingresos o bajar gastos por esa cantidad.`}),o}const Ol=()=>globalThis.Chart??null,ze=["#2ee6a8","#4d9fff","#a855f7","#f97316","#eab308","#22d3ee","#fb7185","#34d399"],mn=new WeakMap;function Rl(t,e,a){const o=Ol();if(!o)return null;const n=mn.get(t);if(n)try{n.destroy()}catch{}const s=new Map,i=new Map(e.objetivos.map(v=>[v._id,v.vehiculoId])),r=new Set(e.objetivos.map(v=>v.vehiculoId));for(const v of r)s.set(v,[]);for(const v of a.serieMensual){const h=new Map;for(const I of v.asignaciones){const A=i.get(I.objetivoId);A&&h.set(A,(h.get(A)??0)+I.saldoTrasMes)}for(const I of r)s.get(I).push((h.get(I)??0)/100)}const l=v=>{var h;return((h=e.vehiculos.find(I=>I._id===v))==null?void 0:h.nombre)??"Sin vehículo"},u=[...r],f=u.map((v,h)=>a.serieMensual.map((I,A)=>u.slice(0,h+1).reduce((y,$)=>y+(s.get($)[A]??0),0))),c=u.map((v,h)=>({label:l(v),data:f[h],borderColor:ze[h%ze.length],backgroundColor:`${ze[h%ze.length]}33`,fill:h===0?"origin":"-1",borderWidth:1.5,pointRadius:0,tension:.25})),m=new o(t,{type:"line",data:{labels:a.serieMensual.map(v=>v.mes),datasets:c},options:{responsive:!0,maintainAspectRatio:!1,interaction:{mode:"index",intersect:!1},plugins:{legend:{labels:{color:"#a9b6cc",font:{size:11},boxWidth:12}},tooltip:{backgroundColor:"#111a28",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#a9b6cc",bodyColor:"#eef3fb",callbacks:{label:v=>{const h=v.datasetIndex>0?v.chart.data.datasets[v.datasetIndex-1].data[v.dataIndex]??0:0;return` ${v.dataset.label}: ${j(v.parsed.y-h)}`}}}},scales:{x:{ticks:{color:"#6b7b96",maxTicksLimit:12},grid:{display:!1}},y:{ticks:{color:"#6b7b96",callback:v=>j(v)},grid:{color:"rgba(255,255,255,0.07)"}}}}});return mn.set(t,m),m}const ha=t=>j(t/100),ql={CUOTA_POR_FECHA:"Cuota para llegar a la fecha",ABSORBE_TODO:"Se lleva todo lo disponible",ABSORBE_RESIDUAL:"Recibe lo que sobre",FIJO:"Importe fijo al mes"},Ll={CUOTA_POR_FECHA:"Se recalcula cada mes con el saldo real: si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo el capital disponible hasta completarse. Es el modo típico de amortizar deuda.",ABSORBE_RESIDUAL:"No reclama nada; recoge lo que quede tras servir a los de prioridad superior.",FIJO:"Aporta siempre lo mismo, respetando el tope anual del vehículo si lo tiene."},fn={COMPLETADO:"var(--accent)",EN_CURSO:"var(--text)",PENDIENTE:"var(--text3)",INVIABLE:"var(--red)"};function Bl(t,e){if(t.objetivos.length===0)return`<div class="card" style="text-align:center;padding:34px 20px">
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
    ${a.map(s=>{var i;return kl(s,e,o,(i=n(s.vehiculoId))==null?void 0:i.nombre)}).join("")}`}function kl(t,e,a,o){const n=je(t),s=e.estadoFinal[t._id]??t.estado,i=a==null?void 0:a.asignaciones.find(c=>c.objetivoId===t._id),r=(i==null?void 0:i.solicitado)??0,l=e.hitos.find(c=>c.objetivoId===t._id),u=n>0?Math.min(100,t.saldoActual/n*100):0,f=e.avisos.filter(c=>c.objetivoId===t._id);return`
    <div class="card mb-10" draggable="true" data-pl-objetivo="${d(t._id)}"
         style="padding:14px 16px;border-left:3px solid ${fn[s]??"var(--text3)"};cursor:grab">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <span title="Arrastra para cambiar la prioridad" style="color:var(--text3);cursor:grab;user-select:none">⠿</span>
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3)">#${d(t.prioridad)}</span>
            <span style="font-weight:700;font-size:14px">${d(t.nombre)}</span>
            <span class="badge" style="font-size:10px;background:var(--bg3);color:var(--text2)">${d(ql[t.modoAsignacion])}</span>
            ${s==="INVIABLE"?'<span class="badge badge-red" style="font-size:10px">no llega</span>':""}
            ${s==="COMPLETADO"?'<span class="badge badge-green" style="font-size:10px">completado</span>':""}
          </div>
          <div class="text-sm" style="color:var(--text3);margin-top:4px">${d(Ll[t.modoAsignacion])}</div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono);font-size:17px;font-weight:700">${d(n>0?ha(n):"— sin meta —")}</div>
          ${t.fechaLimite?`<div class="text-sm" style="color:var(--text3)">para ${d(t.fechaLimite)}</div>`:""}
          <button class="btn-secondary btn-sm" data-pl-editar-objetivo="${d(t._id)}" style="margin-top:6px;font-size:11px;padding:2px 9px">Editar</button>
        </div>
      </div>

      ${n>0?`<div class="goal-bar" style="margin-top:10px"><div class="goal-bar-fill" style="width:${u.toFixed(1)}%;background:${fn[s]??"var(--accent)"}"></div></div>`:""}

      <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:12px">
        <div><span style="color:var(--text3)">Pide ahora:</span> <strong style="font-family:var(--font-mono)">${d(ha(r))}</strong>/mes</div>
        <div><span style="color:var(--text3)">Ya acumulado:</span> <span style="font-family:var(--font-mono)">${d(ha(t.saldoActual))}</span></div>
        ${o?`<div><span style="color:var(--text3)">Vehículo:</span> ${d(o)}</div>`:""}
        ${l?`<div><span style="color:var(--text3)">Se completa:</span> <strong style="color:var(--accent)">${d(l.mes)}</strong></div>`:""}
      </div>

      ${f.length>0?`<div style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-size:11px;color:var(--yellow);line-height:1.6">
               ${f.map(c=>`⚠ ${d(c.mensaje)}`).join("<br>")}
             </div>`:""}
      ${t.notas?`<div class="text-sm" style="color:var(--text3);margin-top:8px;white-space:pre-wrap">${d(t.notas)}</div>`:""}
    </div>`}const dt=t=>(t/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0}),vn=[{id:"venta-vivienda",nombre:"Venta de vivienda",icono:"🏠",descripcion:"Lo que queda de verdad tras cancelar la hipoteca y pagar impuestos y gastos. Suele ser bastante menos que el precio de venta.",tipo:"INYECCION_CAPITAL",campos:[{id:"precio",etiqueta:"Precio de venta (€)",ayuda:"Lo que te paga el comprador"},{id:"hipoteca",etiqueta:"Hipoteca pendiente (€)",ayuda:"Capital vivo el día de la firma"},{id:"gastos",etiqueta:"Impuestos y gastos (€)",ayuda:"Plusvalía municipal, IRPF de la ganancia, agencia, notaría"}],calcular:t=>Math.max(0,(t.precio??0)-(t.hipoteca??0)-(t.gastos??0)),resumir:t=>`Venta ${dt(t.precio??0)} € − hipoteca ${dt(t.hipoteca??0)} € − gastos ${dt(t.gastos??0)} €`},{id:"nueva-hipoteca",nombre:"Nueva hipoteca",icono:"🔑",descripcion:"Sube tus gastos fijos con la cuota nueva. Normalmente va en la misma fecha que la venta.",tipo:"NUEVA_DEUDA",campos:[{id:"cuota",etiqueta:"Cuota mensual (€)",ayuda:"Se suma a tus gastos fijos a partir de ese mes"}],calcular:t=>t.cuota??0,resumir:t=>`Cuota de ${dt(t.cuota??0)} €/mes`},{id:"hijo",nombre:"Llegada de un hijo",icono:"👶",descripcion:"Fija tus gastos fijos en un valor nuevo. Si el gasto sube por etapas, crea varios eventos seguidos.",tipo:"CAMBIO_GASTOS_FIJOS",campos:[{id:"actuales",etiqueta:"Gastos fijos actuales (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"incremento",etiqueta:"Incremento mensual (€)",ayuda:"Guardería, ropa, sanidad…"}],calcular:t=>(t.actuales??0)+(t.incremento??0),resumir:t=>`Gastos fijos ${dt(t.actuales??0)} € → ${dt((t.actuales??0)+(t.incremento??0))} €/mes`},{id:"subida-sueldo",nombre:"Subida de sueldo",icono:"📈",descripcion:"Fija tu neto mensual en un valor nuevo desde ese mes.",tipo:"CAMBIO_INGRESOS",campos:[{id:"actual",etiqueta:"Neto mensual actual (€)",ayuda:"Se rellena con lo que tengas en el plan"},{id:"subida",etiqueta:"Subida mensual neta (€)",ayuda:"Lo que te llega a la cuenta, no el bruto"}],calcular:t=>(t.actual??0)+(t.subida??0),resumir:t=>`Neto ${dt(t.actual??0)} € → ${dt((t.actual??0)+(t.subida??0))} €/mes`},{id:"inyeccion",nombre:"Entrada de dinero",icono:"💰",descripcion:"Una herencia, un bonus, la venta de un coche. Puede ir dirigida a un objetivo concreto.",tipo:"INYECCION_CAPITAL",campos:[{id:"importe",etiqueta:"Importe (€)"}],calcular:t=>t.importe??0,resumir:t=>`Entrada de ${dt(t.importe??0)} €`}],Hl=t=>vn.find(e=>e.id===t);function Gl(t,e){switch(t.tipo){case"INYECCION_CAPITAL":return`Entra ${dt(t.importe)} €${e?` → «${e}»`:" al reparto general"}`;case"CAMBIO_INGRESOS":return`El neto mensual pasa a ${dt(t.importe)} €`;case"CAMBIO_GASTOS_FIJOS":return`Los gastos fijos pasan a ${dt(t.importe)} €/mes`;case"NUEVA_DEUDA":return`Los gastos fijos suben ${dt(t.importe)} €/mes`}}function Vl(t,e,a,o){const n=()=>`${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,s=new Map(t.vehiculos.map(r=>[r._id,`veh_${n()}`])),i=new Map(t.objetivos.map(r=>[r._id,`obj_${n()}`]));return{...t,_id:a,nombre:e,activo:!1,creadoEn:o,vehiculos:t.vehiculos.map(r=>({...r,_id:s.get(r._id)})),objetivos:t.objetivos.map(r=>({...r,_id:i.get(r._id),vehiculoId:s.get(r.vehiculoId)??r.vehiculoId})),eventos:t.eventos.map(r=>({...r,_id:`ev_${n()}`,objetivoDestinoId:r.objetivoDestinoId?i.get(r.objetivoDestinoId)??null:null}))}}function Ul(t){return[...new Set(t.flatMap(a=>a.hitos.map(o=>o.nombre)))].map(a=>{const o=t.map(i=>i.hitos.find(r=>r.nombre===a)??null),n=o.map(i=>i?i.indice:null),s=n[0];return{nombre:a,meses:o.map(i=>i?i.mes:null),diferencias:n.map(i=>i!==null&&s!==null?i-s:null)}})}const Yl=t=>j(t/100),Jl={INYECCION_CAPITAL:"💰",CAMBIO_GASTOS_FIJOS:"🏷️",CAMBIO_INGRESOS:"📈",NUEVA_DEUDA:"🔑"};function Wl(t){const e=[...t.eventos].sort((o,n)=>o.fecha.localeCompare(n.fecha)),a=o=>{var n;return o?(n=t.objetivos.find(s=>s._id===o))==null?void 0:n.nombre:void 0};return`
    <div class="text-sm mb-12" style="color:var(--text3);line-height:1.7">
      Los eventos son los cambios de vida que mueven el plan de verdad: una venta, una hipoteca nueva, un hijo,
      un ascenso. Se aplican <strong>al principio del mes</strong> que indiques.
    </div>

    <div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Añadir</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${vn.map(o=>`<button class="btn-secondary btn-sm" data-pl-plantilla="${d(o.id)}"
            style="display:flex;align-items:center;gap:6px;padding:7px 12px">
            <span style="font-size:14px">${o.icono}</span>
            <span style="font-size:12px">${d(o.nombre)}</span>
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
             ${e.map(o=>Kl(o,t,a(o.objetivoDestinoId))).join("")}
           </div>`}`}function Kl(t,e,a){const o=ba(e.fechaInicio,t.fecha),n=o<0?"antes del inicio del plan":o===0?"en el primer mes":`dentro de ${o} mes${o!==1?"es":""}`,s=o<0||o>=e.horizonteMeses;return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="font-size:16px;flex-shrink:0;width:24px;text-align:center">${Jl[t.tipo]}</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-family:var(--font-mono);font-size:12px;color:var(--accent)">${d(t.fecha)}</span>
          <span style="font-size:11px;color:var(--text3)">${d(n)}</span>
          ${s?'<span class="badge badge-yellow" style="font-size:10px">fuera del horizonte</span>':""}
        </div>
        <div style="font-size:12px;margin-top:3px">${d(Gl(t,a))}</div>
        ${t.notas?`<div style="font-size:11px;color:var(--text3);margin-top:2px">${d(t.notas)}</div>`:""}
      </div>
      <div style="display:flex;gap:5px;flex-shrink:0">
        <button class="btn-secondary btn-sm" data-pl-editar-evento="${d(t._id)}" style="font-size:11px;padding:2px 9px">Editar</button>
      </div>
    </div>`}function Ql(t,e,a,o){const n=t.campos.map(i=>{const r=o[i.id];return`<div class="form-group">
        <label class="form-label" for="ev-${d(i.id)}">${d(i.etiqueta)}</label>
        <input class="form-input" type="number" step="0.01" id="ev-${d(i.id)}" value="${r!==void 0?(r/100).toFixed(2):""}">
        ${i.ayuda?`<div class="text-sm mt-4" style="color:var(--text3)">${d(i.ayuda)}</div>`:""}
      </div>`}).join(""),s=[["","— al reparto general —"],...a.objetivos.map(i=>[i._id,i.nombre])];return`
    <div class="text-sm mb-14" style="color:var(--text2);line-height:1.7">${t.icono} ${d(t.descripcion)}</div>

    <div class="form-group">
      <label class="form-label" for="ev-fecha">Mes en que ocurre</label>
      <input class="form-input" type="month" id="ev-fecha" value="${d((e==null?void 0:e.fecha)??a.fechaInicio)}">
    </div>

    ${n}

    <div class="card mb-12" style="background:var(--bg3);padding:10px 12px">
      <div class="text-sm" style="color:var(--text3)">Importe que se aplicará</div>
      <div id="ev-resultado" style="font-family:var(--font-mono);font-size:18px;font-weight:700;color:var(--accent);margin-top:2px">—</div>
    </div>

    ${t.tipo==="INYECCION_CAPITAL"?`<div class="form-group">
             <label class="form-label" for="ev-destino">¿A qué objetivo va?</label>
             <select class="form-input" id="ev-destino">
               ${s.map(([i,r])=>`<option value="${d(i)}"${i===((e==null?void 0:e.objetivoDestinoId)??"")?" selected":""}>${d(r)}</option>`).join("")}
             </select>
             <div class="text-sm mt-4" style="color:var(--text3)">
               Dirigida a un objetivo lo completa antes y libera su cuota; al reparto general entra como ingreso extra de ese mes.
             </div>
           </div>`:""}

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${e?'<button class="btn-secondary" data-ev-borrar style="color:var(--red)">Borrar</button>':""}
      <button class="btn-secondary" data-ev-cancelar>Cancelar</button>
      <button class="btn-primary" data-ev-guardar>${e?"Guardar":"Añadir evento"}</button>
    </div>`}function gn(t,e){var o;const a={};for(const n of e.campos){const s=((o=t.querySelector(`#ev-${n.id}`))==null?void 0:o.value)??"",i=parseFloat(String(s).replace(",","."));a[n.id]=Number.isFinite(i)?Math.round(i*100):0}return a}const Xl=(t,e)=>Yl(t.calcular(e)),Zl=[-2,-1,0,1,2],tc=[-10,0,10],ec=[-20,0,20];function bn(t){return t.hitos.length===0?null:Math.max(...t.hitos.map(e=>e.indice))}function ac(t,e,a,o,n){const s={};for(const l of o.hitos)s[l.objetivoId]=l.mes;const i=bn(o),r=n?bn(n):i;return{etiqueta:t,delta:e,esBase:a,viable:o.viable,hitos:s,desplazamientoMeses:i!==null&&r!==null?i-r:null,patrimonioFinal:o.resumen.patrimonioFinal}}function oc(t,e,a){if(a===0)return t;switch(e){case"rentabilidad":return{...t,vehiculos:t.vehiculos.map(o=>({...o,rentabilidadRealAnual:Math.max(0,o.rentabilidadRealAnual+a/100)}))};case"disfrute":return{...t,pctDisfrute:Math.min(1,Math.max(0,t.pctDisfrute+a/100))};case"ingresos":return{...t,perfil:{...t.perfil,netoMensual:Math.max(0,Math.round(t.perfil.netoMensual*(1+a/100)))}}}}const nc=t=>t>0?`+${t}`:String(t);function ya(t,e,a,o,n,s){const i=_e(t),r=n.map(l=>ac(l===0?"Plan actual":`${nc(l)} ${s}`,l,l===0,l===0?i:_e(oc(t,e,l)),i));return{palanca:e,titulo:a,descripcion:o,variantes:r}}function sc(t){return[ya(t,"rentabilidad","Rentabilidad de los vehículos","Mueve la rentabilidad real de todos los vehículos a la vez. Es la palanca que menos controlas.",Zl,"puntos"),ya(t,"disfrute","Porcentaje de disfrute","Lo que apartas para gastar en vez de asignar a objetivos. Es la palanca que más controlas.",tc,"puntos"),ya(t,"ingresos","Ingresos","Un ascenso, un cambio de trabajo o una reducción de jornada.",ec,"%")]}function ic(t){if(t===null)return"no comparable";if(t===0)return"sin cambio";const e=Math.abs(t),a=Math.floor(e/12),o=e%12,n=[a>0?`${a} año${a!==1?"s":""}`:"",o>0?`${o} mes${o!==1?"es":""}`:""].filter(Boolean).join(" y ");return t<0?`${n} antes`:`${n} más tarde`}const hn=t=>j(t/100);function rc(t,e,a){return`
    ${lc(t,e)}
    ${t.length>1?cc(t):""}
    ${dc(a)}`}function lc(t,e){return`<div class="card mb-14">
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
            <span style="font-weight:600;font-size:13px">${d(a.nombre)}</span>
            ${o?'<span class="badge badge-green" style="font-size:10px">activo</span>':""}
          </div>
          <div style="font-size:11px;color:var(--text3);margin-top:2px">
            ${a.objetivos.length} objetivo${a.objetivos.length!==1?"s":""} ·
            ${a.eventos.length} evento${a.eventos.length!==1?"s":""} ·
            desde ${d(a.fechaInicio)}${a.creadoEn?` · creado ${d(a.creadoEn)}`:""}
          </div>
        </div>
        <div class="flex gap-5 flex-wrap">
          ${o?"":`<button class="btn-secondary btn-sm" data-pl-activar="${d(a._id)}" style="font-size:11px;padding:2px 9px">Usar este</button>`}
          <button class="btn-secondary btn-sm" data-pl-renombrar="${d(a._id)}" style="font-size:11px;padding:2px 9px">Renombrar</button>
          ${t.length>1?`<button class="btn-secondary btn-sm" data-pl-borrar-plan="${d(a._id)}" style="font-size:11px;padding:2px 9px;color:var(--red)">Borrar</button>`:""}
        </div>
      </div>`}).join("")}
  </div>`}function cc(t){const e=t.slice(0,3),a=e.map(r=>({plan:r,res:_e(r)})),o=Ul(a.map(({plan:r,res:l})=>({nombre:r.nombre,hitos:l.hitos}))),n=["Hito",...e.map(r=>r.nombre)].map((r,l)=>`<th style="text-align:${l===0?"left":"right"};padding:6px 8px;font-size:11px;color:var(--text3)">${d(r)}</th>`).join(""),s=o.map(r=>`<tr>
      <td style="padding:5px 8px;font-size:12px">${d(r.nombre)}</td>
      ${r.meses.map((l,u)=>{const f=r.diferencias[u],c=f===null||f===0?"var(--text2)":f<0?"var(--accent)":"var(--red)",m=u===0||f===null||f===0?"":`<div style="font-size:10px;color:${c}">${f>0?"+":""}${f} m</div>`;return`<td style="text-align:right;padding:5px 8px;font-family:var(--font-mono);font-size:11px;color:${c}">
            ${d(l??"no llega")}${m}
          </td>`}).join("")}
    </tr>`).join("");return`<div class="card mb-14">
    <div class="card-title mb-10">Comparativa</div>
    <div style="display:flex;gap:18px;flex-wrap:wrap;margin-bottom:14px">${a.map(({plan:r,res:l})=>`<div style="flex:1;min-width:150px">
      <div style="font-size:11px;color:var(--text3)">${d(r.nombre)}</div>
      <div style="font-family:var(--font-mono);font-size:15px;font-weight:700">${d(hn(l.resumen.patrimonioFinal))}</div>
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
  </div>`}function dc(t){return t?`<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
      <span class="card-title" style="margin:0">Análisis de sensibilidad</span>
      <button class="btn-secondary btn-sm" data-pl-sensibilidad>Recalcular</button>
    </div>
    ${t.map(uc).join("")}
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
    </div>`}function uc(t){return`<div style="margin-bottom:18px">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px">${d(t.titulo)}</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:8px">${d(t.descripcion)}</div>
    ${t.variantes.map(e=>{const a=e.desplazamientoMeses,o=a===null?"var(--text3)":a===0?"var(--text2)":a<0?"var(--accent)":"var(--red)";return`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:5px 0;font-size:12px;${e.esBase?"border-top:1px solid var(--border);border-bottom:1px solid var(--border);":""}">
        <span style="${e.esBase?"font-weight:700":"color:var(--text2)"}">${d(e.etiqueta)}</span>
        <span style="display:flex;gap:14px;align-items:baseline">
          <span style="color:${o};font-size:11px">${d(ic(a))}</span>
          <span style="font-family:var(--font-mono);font-size:11px;color:var(--text3);min-width:88px;text-align:right">${d(hn(e.patrimonioFinal))}</span>
        </span>
      </div>`}).join("")}
  </div>`}const Mt=t=>j(t/100);function pc(t,e,a=0){return`
    ${mc(e)}
    ${fc(t,e)}
    <div class="card mb-14">
      <div class="card-title mb-12">Patrimonio por vehículo</div>
      <div class="chart-wrap-lg"><canvas id="pl-chart"></canvas></div>
    </div>
    ${vc(e)}
    ${gc(t,e)}
    ${bc(t,e,a)}`}function mc(t){if(t.avisos.length===0&&t.propuestas.length===0)return"";const e={error:"var(--red)",atencion:"var(--yellow)",info:"var(--text2)"},a=t.avisos.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:5px">
        <span style="color:${e[i.severidad]};flex-shrink:0">${i.severidad==="error"?"✕":"⚠"}</span>
        <span style="color:var(--text2)">${d(i.mensaje)}</span>
      </div>`).join(""),o=t.propuestas.length>0?`<div style="margin-top:10px;padding-top:10px;border-top:1px solid var(--border)">
           <div style="font-size:11px;color:var(--text3);margin-bottom:6px">Cómo hacerlo encajar — elige una:</div>
           ${t.propuestas.map(i=>`<div style="display:flex;gap:8px;font-size:12px;line-height:1.6;margin-bottom:4px">
             <span style="color:var(--accent);flex-shrink:0">→</span><span style="color:var(--text2)">${d(i.mensaje)}</span>
           </div>`).join("")}
         </div>`:"",n=t.viable?"rgba(255,209,102,0.28)":"rgba(255,77,109,0.3)";return`<div class="card mb-14" style="background:${t.viable?"rgba(255,209,102,0.05)":"rgba(255,77,109,0.05)"};border-color:${n}">
    <div class="card-title mb-8">${t.viable?"Cosas a revisar":"El plan no cabe en tu flujo de caja"}</div>
    ${a}${o}
  </div>`}function fc(t,e){const a=(n,s,i="")=>`<div class="stat-card">
      <div class="stat-label">${d(n)}</div>
      <div class="stat-value" style="font-size:18px">${d(s)}</div>
      ${i?`<div class="stat-sub">${d(i)}</div>`:""}
    </div>`,o=e.serieMensual[e.serieMensual.length-1];return`<div class="grid-4 mb-14">
    ${a("Patrimonio final",Mt(e.resumen.patrimonioFinal),o?`en ${o.mes}`:"")}
    ${a("Total aportado",Mt(e.resumen.totalAportado),`${e.mesesSimulados} meses simulados`)}
    ${a("Total a disfrute",Mt(e.resumen.totalDisfrute),`${Math.round(t.pctDisfrute*100)} % del sobrante`)}
    ${a("Independencia",e.resumen.mesIndependencia??"—",e.resumen.mesIndependencia?"objetivo perpetuo cubierto":"sin objetivo de independencia")}
  </div>`}function vc(t){return t.hitos.length===0?`<div class="card mb-14"><div class="card-title mb-8">Hitos</div>
      <div class="text-sm" style="color:var(--text3)">Ningún objetivo se completa dentro del horizonte.</div></div>`:`<div class="card mb-14">
    <div class="card-title mb-12">Hitos</div>
    ${t.hitos.map(e=>`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid var(--border);font-size:12px">
        <div style="display:flex;align-items:center;gap:9px">
          <span style="font-family:var(--font-mono);color:var(--accent);font-size:11px">${d(e.mes)}</span>
          <span style="font-weight:600">${d(e.nombre)}</span>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--font-mono)">${d(Mt(e.importeFinal))}</div>
          ${e.cuotaLiberada>0?`<div style="font-size:10px;color:var(--text3)">libera ${d(Mt(e.cuotaLiberada))}/mes</div>`:""}
        </div>
      </div>`).join("")}
  </div>`}function gc(t,e){if(e.fases.length<=1)return"";const a=o=>{var n;return((n=t.objetivos.find(s=>s._id===o))==null?void 0:n.nombre)??o};return`<div class="card mb-14">
    <div class="card-title mb-12">Fases del plan</div>
    <div class="text-sm mb-10" style="color:var(--text3)">Tramos entre hitos: en cada uno el dinero se reparte de forma distinta.</div>
    ${e.fases.map((o,n)=>`<div style="display:flex;gap:12px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--border)">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--accent);flex-shrink:0;width:26px">${n+1}</div>
        <div style="flex:1">
          <div style="font-size:12px;font-weight:600">${d(o.desde)} → ${d(o.hasta)} <span style="color:var(--text3);font-weight:400">(${o.meses} mes${o.meses!==1?"es":""})</span></div>
          <div style="font-size:11px;color:var(--text2);margin-top:3px">${d(o.objetivosActivos.map(a).join(" · ")||"sin asignaciones")}</div>
        </div>
      </div>`).join("")}
  </div>`}const ve=60;function bc(t,e,a=0){if(e.serieMensual.length===0)return"";const o=[...t.objetivos].sort((f,c)=>f.prioridad-c.prioridad),n=Math.ceil(e.serieMensual.length/ve),s=Math.min(Math.max(0,a),n-1),i=e.serieMensual.slice(s*ve,(s+1)*ve),r=["Mes","Disponible",...o.map(f=>f.nombre),"Sin asignar","Patrimonio"].map(f=>`<th style="text-align:right;padding:5px 8px;font-size:10px;color:var(--text3);font-weight:600;white-space:nowrap">${d(f)}</th>`).join(""),l=i.map(f=>{const c=o.map(m=>{const v=f.asignaciones.find(I=>I.objetivoId===m._id),h=(v==null?void 0:v.asignado)??0;return`<td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:${h>0?"var(--text)":"var(--text3)"}">${d(h>0?Mt(h):"·")}</td>`}).join("");return`<tr>
        <td style="padding:4px 8px;font-family:var(--font-mono);color:var(--text2)">${d(f.mes)}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono)">${d(Mt(f.disponible))}</td>
        ${c}
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--text3)">${d(f.sinAsignar>0?Mt(f.sinAsignar):"·")}</td>
        <td style="text-align:right;padding:4px 8px;font-family:var(--font-mono);color:var(--accent)">${d(Mt(f.patrimonioTotal))}</td>
      </tr>`}).join(""),u=n>1?`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap">
           <button class="btn-secondary btn-sm" data-pl-pagina="${s-1}"${s===0?" disabled":""}>← Anteriores</button>
           <span class="text-sm" style="color:var(--text3)">
             Meses ${s*ve+1}–${Math.min((s+1)*ve,e.serieMensual.length)} de ${e.serieMensual.length}
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
  </div>`}function hc(t,e){const a=[...t.objetivos].sort((i,r)=>i.prioridad-r.prioridad),o=i=>(i/100).toFixed(2).replace(".",","),n=["Mes","Neto","Gastos fijos","Disfrute","Disponible",...a.map(i=>i.nombre),"Sin asignar","Patrimonio"],s=e.serieMensual.map(i=>[i.mes,o(i.netoMensual),o(i.gastosFijos),o(i.disfrute),o(i.disponible),...a.map(r=>{var l;return o(((l=i.asignaciones.find(u=>u.objetivoId===r._id))==null?void 0:l.asignado)??0)}),o(i.sinAsignar),o(i.patrimonioTotal)].join(";"));return[n.join(";"),...s].join(`
`)}const Kt=t=>{const e=typeof t=="number"?t:parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},ge=t=>(t/100).toFixed(2),yn=t=>(t*100).toFixed(2),Qt=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?e/100:0},yc=[["AHORRO_OBJETIVO","Ahorrar una cantidad"],["AMORTIZAR_DEUDA","Amortizar deuda"],["INVERSION_PERPETUA","Independencia económica"],["APORTACION_FIJA","Aportación periódica"]],xc=[["CUOTA_POR_FECHA","Cuota para llegar a la fecha"],["ABSORBE_TODO","Se lleva todo lo disponible"],["ABSORBE_RESIDUAL","Recibe lo que sobre"],["FIJO","Importe fijo al mes"]],$c=[["INMEDIATA","Inmediata"],["MEDIA","Media (con preaviso o penalización)"],["BLOQUEADA_HASTA_JUBILACION","Bloqueada hasta la jubilación"]],Ic=[["NULO","Nulo"],["BAJO","Bajo"],["MEDIO","Medio"],["ALTO","Alto"]],xn={AHORRO_OBJETIVO:"CUOTA_POR_FECHA",AMORTIZAR_DEUDA:"ABSORBE_TODO",INVERSION_PERPETUA:"ABSORBE_RESIDUAL",APORTACION_FIJA:"FIJO"},lt=(t,e,a,o,n="",s="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <input class="form-input" id="${t}" type="${a}" value="${d(o)}" ${s}>
    ${n?`<div class="text-sm mt-4" style="color:var(--text3)">${n}</div>`:""}
  </div>`,Bt=(t,e,a,o,n="")=>`<div class="form-group">
    <label class="form-label" for="${t}">${e}</label>
    <select class="form-input" id="${t}">
      ${a.map(([s,i])=>`<option value="${d(s)}"${s===o?" selected":""}>${d(i)}</option>`).join("")}
    </select>
    ${n?`<div class="text-sm mt-4" style="color:var(--text3)">${n}</div>`:""}
  </div>`;function Ac(t,e,a){var l,u,f;const o=t===null,n=(t==null?void 0:t.tipo)??"AHORRO_OBJETIVO",s=(t==null?void 0:t.modoAsignacion)??xn[n],i=!!(t!=null&&t.rentaDeseada),r=e.length>0?e.map(c=>[c._id,c.nombre]):[["","— no hay vehículos: crea uno primero —"]];return`
    <div class="grid-2" style="gap:10px">
      ${lt("ob-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Entrada del piso"')}
      ${lt("ob-prioridad","Prioridad","number",(t==null?void 0:t.prioridad)??a,"Menor número = se sirve antes",'min="1"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Bt("ob-tipo","Tipo",yc,n)}
      ${Bt("ob-modo","Cómo pide dinero",xc,s)}
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
            ${lt("ob-renta","Renta neta mensual (€)","number",ge(((l=t==null?void 0:t.rentaDeseada)==null?void 0:l.rentaNetaMensual)??2e5),"",'step="0.01"')}
            ${lt("ob-swr","Tasa de retiro seguro (%)","number",((((u=t==null?void 0:t.rentaDeseada)==null?void 0:u.tasaRetiroSeguro)??.04)*100).toFixed(2),"",'step="0.1"')}
          </div>
          ${lt("ob-fiscal","Tipo fiscal efectivo al retirar (%)","number",((((f=t==null?void 0:t.rentaDeseada)==null?void 0:f.tipoFiscalEfectivo)??.2)*100).toFixed(2),"",'step="0.5"')}
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
        ${lt("ob-importe","Importe objetivo (€)","number",ge((t==null?void 0:t.importeObjetivo)??0),"Deja 0 si no tiene meta (un cubo perpetuo)",'step="0.01"')}
      </div>
      ${lt("ob-fecha","Fecha límite","month",(t==null?void 0:t.fechaLimite)??"","Vacío = lo antes posible")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ob-saldo","Ya acumulado (€)","number",ge((t==null?void 0:t.saldoActual)??0),"Con lo que arranca el objetivo",'step="0.01"')}
      ${Bt("ob-vehiculo","Vehículo",r,(t==null?void 0:t.vehiculoId)??r[0][0])}
    </div>

    <div class="grid-2" style="gap:10px">
      <div id="ob-bloque-fijo" style="display:${s==="FIJO"?"block":"none"}">
        ${lt("ob-fijo","Importe fijo mensual (€)","number",ge((t==null?void 0:t.importeFijoMensual)??0),"",'step="0.01"')}
      </div>
      <div id="ob-bloque-residual" style="display:${s==="ABSORBE_RESIDUAL"?"block":"none"}">
        ${lt("ob-peso","Peso del residual","number",(t==null?void 0:t.pesoResidual)??1,"Si hay varios, reparte en proporción",'min="0" step="0.5"')}
      </div>
    </div>

    <div class="form-group">
      <label class="form-label" for="ob-notas">Notas</label>
      <textarea class="form-input" id="ob-notas" rows="2" style="resize:vertical;font-family:var(--font-sans)">${d((t==null?void 0:t.notas)??"")}</textarea>
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ob-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ob-cancelar>Cancelar</button>
      <button class="btn-primary" data-ob-guardar>${o?"Crear objetivo":"Guardar"}</button>
    </div>`}function wc(t,e,a){var u;const o=f=>{var c;return((c=t.querySelector(`#${f}`))==null?void 0:c.value)??""},n=o("ob-nombre").trim();if(!n)return null;const s=o("ob-tipo"),i=o("ob-modo"),r=((u=t.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:u.value)==="renta",l=s==="INVERSION_PERPETUA"&&r;return{_id:(e==null?void 0:e._id)??`obj_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:n,tipo:s,importeObjetivo:l?null:Kt(o("ob-importe")),fechaLimite:o("ob-fecha")||null,prioridad:Math.max(1,Number(o("ob-prioridad"))||a),modoAsignacion:i,vehiculoId:o("ob-vehiculo"),saldoActual:Kt(o("ob-saldo")),estado:(e==null?void 0:e.estado)??"PENDIENTE",notas:o("ob-notas"),...i==="FIJO"?{importeFijoMensual:Kt(o("ob-fijo"))}:{},...i==="ABSORBE_RESIDUAL"?{pesoResidual:Math.max(0,Number(o("ob-peso"))||1)}:{},...l?{rentaDeseada:{rentaNetaMensual:Kt(o("ob-renta")),tasaRetiroSeguro:Qt(o("ob-swr")),tipoFiscalEfectivo:Qt(o("ob-fiscal"))}}:{rentaDeseada:null}}}function Sc(t){const e=a=>{var o;return((o=t.querySelector(`#${a}`))==null?void 0:o.value)??""};try{const{capitalNecesario:a}=cn({rentaNetaMensual:Kt(e("ob-renta")),tasaRetiroSeguro:Qt(e("ob-swr")),tipoFiscalEfectivo:Qt(e("ob-fiscal"))});return`${(a/100).toLocaleString("es-ES",{minimumFractionDigits:0,maximumFractionDigits:0})} €`}catch{return"no calculable con esos parámetros"}}function Mc(t,e,a){const o=t===null,n=!!(t!=null&&t.esDeuda),s=[["","— ninguna —"],...e.map(r=>[r._id,r.nombre])],i=[["","— ninguno —"],...a.map(r=>[r._id,`${r.nombre} (${r.tin} % TIN)`])];return`
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
      ${Bt("ve-prestamo","Préstamo",i,(t==null?void 0:t.prestamoId)??"","Su TIN se usará como rentabilidad")}
    </div>

    ${lt("ve-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","",'placeholder="Fondo indexado"')}

    <div class="grid-2" style="gap:10px">
      ${lt("ve-rent","Rentabilidad REAL anual (%)","number",yn((t==null?void 0:t.rentabilidadRealAnual)??0),"Nominal menos inflación. Un fondo al 7 % nominal con 2 % de inflación son 5 %",'step="0.1"')}
      ${lt("ve-fiscal","Fiscalidad al retirar (%)","number",yn((t==null?void 0:t.fiscalidadRetirada)??0),"Tipo efectivo sobre la plusvalía",'step="0.5"')}
    </div>

    <div class="grid-2" style="gap:10px">
      ${Bt("ve-liquidez","Liquidez",$c,(t==null?void 0:t.liquidez)??"INMEDIATA")}
      ${Bt("ve-riesgo","Riesgo",Ic,(t==null?void 0:t.riesgo)??"NULO")}
    </div>

    <div class="grid-2" style="gap:10px">
      ${lt("ve-tope","Tope de aportación anual (€)","number",t!=null&&t.topeAportacionAnual?ge(t.topeAportacionAnual):"","Vacío = sin tope. Pensiones: 1500",'step="0.01"')}
      ${Bt("ve-cuenta","Cuenta asociada",s,(t==null?void 0:t.cuentaId)??"","Enlaza con una cuenta que ya tengas")}
    </div>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
      ${o?"":'<button class="btn-secondary" data-ve-borrar style="color:var(--red)">Borrar</button>'}
      <button class="btn-secondary" data-ve-cancelar>Cancelar</button>
      <button class="btn-primary" data-ve-guardar>${o?"Crear vehículo":"Guardar"}</button>
    </div>`}function Cc(t,e){var i;const a=r=>{var l;return((l=t.querySelector(`#${r}`))==null?void 0:l.value)??""},o=a("ve-nombre").trim();if(!o)return null;const n=((i=t.querySelector("#ve-deuda"))==null?void 0:i.checked)??!1,s=a("ve-tope").trim();return{_id:(e==null?void 0:e._id)??`veh_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,nombre:o,rentabilidadRealAnual:Qt(a("ve-rent")),liquidez:a("ve-liquidez"),fiscalidadRetirada:Qt(a("ve-fiscal")),topeAportacionAnual:s?Kt(s):null,riesgo:a("ve-riesgo"),cuentaId:a("ve-cuenta")||null,prestamoId:n&&a("ve-prestamo")||null,esDeuda:n}}const Ec={CUOTA_POR_FECHA:"Cada mes calcula lo que hace falta para llegar a la fecha, con el saldo que lleva. Si un mes va sobrado, el siguiente pide menos.",ABSORBE_TODO:"Reclama todo lo disponible hasta completarse. Los de menor prioridad no reciben nada mientras tanto.",ABSORBE_RESIDUAL:"No reclama nada: recoge lo que quede tras servir a los de arriba. Es el modo del cubo de largo plazo.",FIJO:"Aporta siempre lo mismo. Si el vehículo tiene tope anual, se aporta hasta agotarlo y se reanuda en enero."},jc="M3 3v18h18v-2H5V3H3zm4 12h2v-5H7v5zm4 0h2V7h-2v8zm4 0h2v-3h-2v3z",$n=t=>{const e=parseFloat(String(t).replace(",","."));return Number.isFinite(e)?Math.round(e*100):0},Fe=t=>(t/100).toFixed(2);function _c(t){const e=t.hoy??Y;let a="config",o=null,n=0,s=null;function i(){const M=t.store.get("planes");return M.find(z=>z.activo)??M[0]??null}function r(){const M=i();return M||t.store.addItem("planes",{nombre:"Plan base",fechaInicio:e().slice(0,7),horizonteMeses:480,pctDisfrute:0,activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:[],objetivos:[],eventos:[],creadoEn:e()})}function l(M){var F;const z=i();z&&(t.store.updateItem("planes",z._id,M),s=null,o=null,(F=t.onDatosCambiados)==null||F.call(t))}function u(){const z=t.store.get("nominas").filter(O=>O.activo).reduce((O,D)=>O+(D.bruto||0),0),F=Math.round(z*.75/12),T=t.store.get("expenses").filter(O=>O.activo&&O.basico&&O.tipo==="gasto").reduce((O,D)=>O+(D.cuantia||0),0);return{neto:Math.round(F*100),gastos:Math.round(T*100)}}function f(M){return s||(s=_e(M)),s}function c(M){const z=u(),F=Math.max(0,M.perfil.netoMensual-M.perfil.gastosFijosMensuales),T=Math.round(M.pctDisfrute*100);return`
      <div class="card mb-14">
        <div class="card-title mb-12">Perfil financiero</div>
        <div class="grid-2" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Neto mensual (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-neto" value="${d(Fe(M.perfil.netoMensual))}">
            <div class="text-sm mt-4" style="color:var(--text3)">
              Según tus nóminas: ~${d(j(z.neto/100))}/mes
              <button class="btn-secondary btn-sm" data-pl-usar-sugerido style="margin-left:6px;padding:1px 7px;font-size:10px">usar</button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Gastos fijos mensuales (€)</label>
            <input class="form-input" type="number" step="0.01" id="pl-gastos" value="${d(Fe(M.perfil.gastosFijosMensuales))}">
            <div class="text-sm mt-4" style="color:var(--text3)">Según tus gastos básicos: ~${d(j(z.gastos/100))}/mes</div>
          </div>
        </div>

        <div class="form-group mt-8">
          <label class="form-label">Disfrute: <span id="pl-pct-val" style="font-family:var(--font-mono);color:var(--accent)">${T} %</span> del sobrante</label>
          <input type="range" id="pl-disfrute" min="0" max="100" step="1" value="${T}" style="width:100%;accent-color:var(--accent)">
          <div class="text-sm mt-4" style="color:var(--text3)">
            Lo que NO se asigna a objetivos. Con ${d(j(Math.max(0,M.perfil.netoMensual-M.perfil.gastosFijosMensuales)/100))} de sobrante,
            quedan <strong id="pl-disponible">${d(j(F*(1-M.pctDisfrute)/100))}</strong>/mes para los objetivos.
          </div>
        </div>

        <div class="grid-2 mt-8" style="gap:12px">
          <div class="form-group">
            <label class="form-label">Mes de inicio</label>
            <input class="form-input" type="month" id="pl-inicio" value="${d(M.fechaInicio)}">
          </div>
          <div class="form-group">
            <label class="form-label">Horizonte (meses)</label>
            <input class="form-input" type="number" id="pl-horizonte" min="1" max="600" value="${d(M.horizonteMeses)}">
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
          placeholder="Supuestos, decisiones tomadas, cosas a revisar…">${d(M.notas??"")}</textarea>
        <button class="btn-secondary btn-sm mt-8" data-pl-guardar-notas>Guardar notas</button>
      </div>`}const v=()=>document.getElementById("modal-overlay"),h=()=>document.getElementById("modal-content"),I=()=>{var M;return(M=v())==null?void 0:M.classList.add("hidden")};function A(M,z){const F=v(),T=h();return!F||!T?null:(T.innerHTML=`<div class="modal-title">${d(M)}</div>${z}`,F.classList.remove("hidden"),T)}function y(M){l({objetivos:M})}function $(M,z){const F=i();if(!F)return;const T=z?F.objetivos.find(k=>k._id===z)??null:null,O=F.objetivos.reduce((k,R)=>Math.max(k,R.prioridad),0)+1,D=A(T?`Editar «${T.nombre}»`:"Nuevo objetivo",Ac(T,F.vehiculos,O));if(!D)return;const B=()=>{var U;const k=(U=D.querySelector("#ob-modo"))==null?void 0:U.value,R=D.querySelector("#ob-modo-ayuda");R&&k&&(R.textContent=Ec[k]);const H=(K,Q)=>{const nt=D.querySelector(K);nt&&(nt.style.display=Q?"block":"none")};H("#ob-bloque-fijo",k==="FIJO"),H("#ob-bloque-residual",k==="ABSORBE_RESIDUAL")};B();const L=()=>{const k=D.querySelector("#ob-capital-derivado");k&&(k.textContent=Sc(D))};L(),J(D,"#ob-modo",B),J(D,"#ob-tipo",()=>{const k=D.querySelector("#ob-tipo").value,R=D.querySelector("#ob-modo");R&&(R.value=xn[k]);const H=D.querySelector("#ob-bloque-perpetua");H&&(H.style.display=k==="INVERSION_PERPETUA"?"block":"none"),B()}),J(D,'input[name="ob-derivar"]',()=>{var U;const k=((U=D.querySelector('input[name="ob-derivar"]:checked'))==null?void 0:U.value)==="renta",R=D.querySelector("#ob-renta-campos"),H=D.querySelector("#ob-bloque-importe");R&&(R.style.display=k?"block":"none"),H&&(H.style.display=k?"none":"block"),L()}),J(D,"#ob-renta, #ob-swr, #ob-fiscal",L),N(D,"[data-ob-cancelar]",I),N(D,"[data-ob-guardar]",()=>{const k=wc(D,T,O);if(!k){q("El objetivo necesita un nombre","err");return}if(!k.vehiculoId){q("Crea antes un vehículo donde meter el dinero","err");return}const R=F.objetivos.filter(H=>H._id!==k._id);y([...R,k]),I(),q(T?"Objetivo actualizado":`Objetivo «${k.nombre}» creado`),P(M)}),N(D,"[data-ob-borrar]",()=>{T&&Z(`¿Borrar «${T.nombre}»? Esto no se puede deshacer.`)&&(y(F.objetivos.filter(k=>k._id!==T._id)),I(),q("Objetivo borrado"),P(M))})}function b(M,z){const F=i();if(!F)return;const T=z?F.vehiculos.find(L=>L._id===z)??null:null,O=t.store.get("accounts").filter(L=>L.activo).map(L=>({_id:L._id,nombre:L.nombre})),D=t.store.get("loans").filter(L=>L.activo&&!L.simulacion).map(L=>({_id:L._id,nombre:L.nombre,tin:L.tin})),B=A(T?`Editar «${T.nombre}»`:"Nuevo vehículo",Mc(T,O,D));B&&(J(B,"#ve-deuda",()=>{const L=B.querySelector("#ve-deuda").checked,k=B.querySelector("#ve-bloque-prestamo");k&&(k.style.display=L?"block":"none")}),J(B,"#ve-prestamo",()=>{const L=B.querySelector("#ve-prestamo").value,k=D.find(U=>U._id===L);if(!k)return;const R=B.querySelector("#ve-rent"),H=B.querySelector("#ve-nombre");R&&(R.value=String(k.tin)),H&&!H.value.trim()&&(H.value=`Amortizar ${k.nombre}`)}),N(B,"[data-ve-cancelar]",I),N(B,"[data-ve-guardar]",()=>{const L=Cc(B,T);if(!L){q("El vehículo necesita un nombre","err");return}const k=F.vehiculos.filter(R=>R._id!==L._id);l({vehiculos:[...k,L]}),I(),q(T?"Vehículo actualizado":`Vehículo «${L.nombre}» creado`),P(M)}),N(B,"[data-ve-borrar]",()=>{if(!T)return;const L=F.objetivos.filter(k=>k.vehiculoId===T._id);if(L.length>0){q(`No se puede borrar: lo usan ${L.length} objetivo${L.length!==1?"s":""}`,"err");return}Z(`¿Borrar el vehículo «${T.nombre}»?`)&&(l({vehiculos:F.vehiculos.filter(k=>k._id!==T._id)}),I(),q("Vehículo borrado"),P(M))}))}function x(M,z,F){const T=i();if(!T||z===F)return;const O=[...T.objetivos].sort((k,R)=>k.prioridad-R.prioridad),D=O.findIndex(k=>k._id===z),B=O.findIndex(k=>k._id===F);if(D<0||B<0)return;const[L]=O.splice(D,1);O.splice(B,0,L),y(O.map((k,R)=>({...k,prioridad:R+1}))),P(M)}function p(M){return M.vehiculos.length===0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(255,209,102,0.06);border-color:rgba(255,209,102,0.28)">
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          <strong style="color:var(--yellow)">No hay vehículos todavía.</strong>
          Un vehículo es dónde va el dinero —una cuenta, un fondo, un plan de pensiones o la amortización de un
          préstamo— y con qué rentabilidad crece. Hace falta al menos uno para poder crear objetivos.
        </div>
      </div>`:`<div class="card mb-14" style="padding:12px 16px">
      <div class="card-title mb-10">Vehículos</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${M.vehiculos.map(z=>{const F=M.objetivos.filter(T=>T.vehiculoId===z._id).length;return`<button class="btn-secondary btn-sm" data-pl-editar-vehiculo="${d(z._id)}"
              style="display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:6px 11px;text-align:left${z.revisarRentabilidad?";border-color:rgba(255,209,102,0.45)":""}">
              <span style="font-weight:600;font-size:12px">${d(z.nombre)}${z.esDeuda?" 🔒":""}${z.revisarRentabilidad?" ⚠":""}</span>
              <span style="font-size:10px;color:var(--text3)">
                ${d((z.rentabilidadRealAnual*100).toFixed(2))} % real · ${F} objetivo${F!==1?"s":""}
              </span>
            </button>`}).join("")}
      </div>
      ${M.vehiculos.some(z=>z.revisarRentabilidad)?`<div class="text-sm mt-10" style="color:var(--yellow);line-height:1.7;padding-top:10px;border-top:1px solid var(--border)">
               ⚠ Los vehículos marcados traen la rentabilidad de tus cuentas, que es <strong>nominal</strong>.
               Este módulo trabaja en términos <strong>reales</strong>: réstale la inflación que esperes
               (unos 2 puntos) o la simulación te dirá que llegas antes de lo que llegarás. Al guardarlos
               desde su formulario el aviso desaparece.
             </div>`:""}
    </div>`}function g(M,z,F){const T=i(),O=Hl(z);if(!T||!O)return;const D=F?T.eventos.find(R=>R._id===F)??null:null,B={};O.id==="hijo"&&(B.actuales=T.perfil.gastosFijosMensuales),O.id==="subida-sueldo"&&(B.actual=T.perfil.netoMensual);const L=A(D?`Editar evento · ${O.nombre}`:O.nombre,Ql(O,D,T,B));if(!L)return;const k=()=>{const R=L.querySelector("#ev-resultado");R&&(R.textContent=Xl(O,gn(L,O)))};k();for(const R of O.campos)J(L,`#ev-${R.id}`,k);N(L,"[data-ev-cancelar]",I),N(L,"[data-ev-guardar]",()=>{var K,Q;const R=((K=L.querySelector("#ev-fecha"))==null?void 0:K.value)??"";if(!R){q("El evento necesita un mes","err");return}const H=gn(L,O),U={_id:(D==null?void 0:D._id)??`ev_${Date.now().toString(36)}${Math.random().toString(36).slice(2,6)}`,fecha:R,tipo:O.tipo,importe:O.calcular(H),objetivoDestinoId:((Q=L.querySelector("#ev-destino"))==null?void 0:Q.value)||null,notas:O.resumir(H)};l({eventos:[...T.eventos.filter(nt=>nt._id!==U._id),U]}),I(),q(D?"Evento actualizado":"Evento añadido"),P(M)}),N(L,"[data-ev-borrar]",()=>{!D||!Z("¿Borrar este evento?")||(l({eventos:T.eventos.filter(R=>R._id!==D._id)}),I(),q("Evento borrado"),P(M))})}function w(M){var z;switch(M.tipo){case"CAMBIO_GASTOS_FIJOS":return"hijo";case"CAMBIO_INGRESOS":return"subida-sueldo";case"NUEVA_DEUDA":return"nueva-hipoteca";case"INYECCION_CAPITAL":return(z=M.notas)!=null&&z.includes("hipoteca")?"venta-vivienda":"inyeccion"}}function S(){const M=i();if(!M)return;const z=new Blob([JSON.stringify(M,null,2)],{type:"application/json"}),F=URL.createObjectURL(z),T=document.createElement("a");T.href=F,T.download=`plan-${M.nombre.replace(/[^\w-]+/g,"_")}-${e()}.json`,T.click(),URL.revokeObjectURL(F),q("Plan exportado")}function E(M){const z=document.createElement("input");z.type="file",z.accept="application/json,.json",z.addEventListener("change",async()=>{var T,O;const F=(T=z.files)==null?void 0:T[0];if(F)try{const D=JSON.parse(await F.text());if(!D||!Array.isArray(D.objetivos)||!Array.isArray(D.vehiculos)||!D.perfil){q("Ese fichero no es un plan de objetivos","err");return}const B=`${D.nombre??"Importado"} (importado)`,L=t.store.addItem("planes",{...D,nombre:B,activo:!1,creadoEn:e()});s=null,o=null,(O=t.onDatosCambiados)==null||O.call(t),q(`Plan «${L.nombre}» importado`),P(M)}catch(D){console.error("[Planner] Importación fallida:",D),q("No se ha podido leer el fichero","err")}}),z.click()}function _(M,z){switch(a){case"config":return c(M);case"objetivos":return Bl(M,z);case"simulacion":return pc(M,z,n);case"eventos":return Wl(M);case"escenarios":return rc(t.store.get("planes"),M._id,o)}}function P(M){const z=r(),F=f(z),T=(D,B)=>`<button class="period-btn ${a===D?"active":""}" data-pl-tab="${D}">${B}</button>`,O=F.viable?'<span class="badge badge-green">Plan viable</span>':'<span class="badge badge-red">No cabe en el flujo</span>';if(M.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Objetivos <span>financieros</span></h1>
        <div class="page-actions">${O}</div>
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

      <div id="pl-cuerpo">${_(z,F)}</div>`,a==="simulacion"){const D=M.querySelector("#pl-chart");D&&Rl(D,z,F)}C(M)}function C(M){N(M,"[data-pl-tab]",F=>{a=F.dataset.plTab,P(M)}),J(M,"#pl-disfrute",F=>{const T=Number(F.value)/100,O=M.querySelector("#pl-pct-val");O&&(O.textContent=`${Math.round(T*100)} %`);const D=i();if(!D)return;const B=Math.max(0,D.perfil.netoMensual-D.perfil.gastosFijosMensuales)*(1-T),L=M.querySelector("#pl-disponible");L&&(L.textContent=j(B/100))}),N(M,"[data-pl-usar-sugerido]",()=>{const F=u(),T=M.querySelector("#pl-neto"),O=M.querySelector("#pl-gastos");T&&(T.value=Fe(F.neto)),O&&(O.value=Fe(F.gastos))}),N(M,"[data-pl-guardar]",()=>{const F=T=>{var O;return((O=M.querySelector(T))==null?void 0:O.value)??""};l({perfil:{netoMensual:$n(F("#pl-neto")),gastosFijosMensuales:$n(F("#pl-gastos")),manual:!0},pctDisfrute:Math.min(1,Math.max(0,Number(F("#pl-disfrute"))/100)),fechaInicio:F("#pl-inicio")||e().slice(0,7),horizonteMeses:Math.min(600,Math.max(1,Number(F("#pl-horizonte"))||480))}),q("Plan guardado"),P(M)}),N(M,"[data-pl-plantilla]",F=>g(M,F.dataset.plPlantilla??"",null)),N(M,"[data-pl-editar-evento]",F=>{var D;const T=F.dataset.plEditarEvento??"",O=(D=i())==null?void 0:D.eventos.find(B=>B._id===T);O&&g(M,w(O),T)}),N(M,"[data-pl-duplicar]",()=>{var D;const F=i();if(!F)return;const T=window.prompt("Nombre del plan nuevo:",`${F.nombre} (copia)`);if(!(T!=null&&T.trim()))return;const O=Vl(F,T.trim(),`plan_${Date.now().toString(36)}`,e());t.store.addItem("planes",O),(D=t.onDatosCambiados)==null||D.call(t),q(`Plan «${O.nombre}» creado. Actívalo para editarlo.`),P(M)}),N(M,"[data-pl-activar]",F=>{var O;const T=F.dataset.plActivar;if(T){for(const D of t.store.get("planes"))t.store.updateItem("planes",D._id,{activo:D._id===T});s=null,o=null,(O=t.onDatosCambiados)==null||O.call(t),q("Plan activo cambiado"),P(M)}}),N(M,"[data-pl-renombrar]",F=>{var B;const T=F.dataset.plRenombrar,O=t.store.get("planes").find(L=>L._id===T);if(!O)return;const D=window.prompt("Nuevo nombre:",O.nombre);D!=null&&D.trim()&&(t.store.updateItem("planes",O._id,{nombre:D.trim()}),(B=t.onDatosCambiados)==null||B.call(t),P(M))}),N(M,"[data-pl-borrar-plan]",F=>{var B;const T=F.dataset.plBorrarPlan,O=t.store.get("planes").find(L=>L._id===T);if(!O||!Z(`¿Borrar el plan «${O.nombre}» con sus ${O.objetivos.length} objetivos? No se puede deshacer.`))return;t.store.removeItem("planes",O._id);const D=t.store.get("planes");O.activo&&D.length>0&&t.store.updateItem("planes",D[0]._id,{activo:!0}),s=null,o=null,(B=t.onDatosCambiados)==null||B.call(t),q("Plan borrado"),P(M)}),N(M,"[data-pl-sensibilidad]",()=>{const F=i();F&&(o=sc(F),P(M))}),N(M,"[data-pl-pagina]",F=>{n=Number(F.dataset.plPagina)||0,P(M)}),N(M,"[data-pl-exportar]",S),N(M,"[data-pl-importar]",()=>E(M)),N(M,"[data-pl-nuevo-objetivo]",()=>$(M,null)),N(M,"[data-pl-nuevo-vehiculo]",()=>b(M,null)),N(M,"[data-pl-editar-vehiculo]",F=>b(M,F.dataset.plEditarVehiculo??null)),N(M,"[data-pl-editar-objetivo]",F=>$(M,F.dataset.plEditarObjetivo??null));let z=null;M.querySelectorAll("[data-pl-objetivo]").forEach(F=>{F.addEventListener("dragstart",()=>{z=F.dataset.plObjetivo??null,F.style.opacity="0.45"}),F.addEventListener("dragend",()=>{F.style.opacity="",M.querySelectorAll("[data-pl-objetivo]").forEach(T=>T.style.borderTop="")}),F.addEventListener("dragover",T=>{T.preventDefault(),z&&F.dataset.plObjetivo!==z&&(F.style.borderTop="2px solid var(--accent)")}),F.addEventListener("dragleave",()=>{F.style.borderTop=""}),F.addEventListener("drop",T=>{T.preventDefault(),F.style.borderTop="";const O=F.dataset.plObjetivo;z&&O&&x(M,z,O),z=null})}),N(M,"[data-pl-csv]",()=>{const F=i();if(!F||!s)return;const T=new Blob(["\uFEFF"+hc(F,s)],{type:"text/csv;charset=utf-8"}),O=URL.createObjectURL(T),D=document.createElement("a");D.href=O,D.download=`plan-${F.nombre.replace(/[^\w-]+/g,"_")}-${e()}.csv`,D.click(),URL.revokeObjectURL(O),q(`CSV exportado (${s.serieMensual.length} meses)`)}),N(M,"[data-pl-guardar-notas]",()=>{var F;l({notas:((F=M.querySelector("#pl-notas"))==null?void 0:F.value)??""}),q("Notas guardadas")})}return{id:"planner",route:"planner",nombre:"Objetivos financieros",seccion:2,iconoPath:jc,mount:P}}function In(t,e,a=!1){const o=Math.abs(wt(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function zc(t){function e(b){return`${b}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(b={}){var p;const x=(p=b.texto)==null?void 0:p.trim().toLowerCase();return t.get("transacciones").filter(g=>!(b.cuentaId&&g.cuentaId!==b.cuentaId||b.desde&&g.fecha<b.desde||b.hasta&&g.fecha>b.hasta||b.tipo&&g.tipo!==b.tipo||b.estimacionId&&g.estimacionId!==b.estimacionId||b.tags&&b.tags.length>0&&!b.tags.some(w=>g.tags.includes(w))||x&&!g.concepto.toLowerCase().includes(x))).sort((g,w)=>g.fecha.localeCompare(w.fecha)||g._id.localeCompare(w._id))}function o(b){const x={_id:e("tx"),fecha:b.fecha,cuentaId:b.cuentaId,importeCts:In(b.tipo,b.importe,b.negativo),concepto:b.concepto,tags:b.tags??[],estimacionId:b.estimacionId??null,tipo:b.tipo,origen:b.origen??"manual",...b.nota?{nota:b.nota}:{}};return t.set("transacciones",[...t.get("transacciones"),x]),x}function n(b,x){t.set("transacciones",t.get("transacciones").map(p=>{if(p._id!==b)return p;const{importe:g,...w}=x,S={...p,...w};return g!==void 0&&(S.importeCts=In(S.tipo,g,S.importeCts<0)),S}))}function s(b){t.set("transacciones",t.get("transacciones").filter(x=>x._id!==b))}function i(b,x){n(b,{estimacionId:x})}function r(b){return t.get("puntosControl").filter(x=>!b||x.cuentaId===b).sort((x,p)=>x.fecha.localeCompare(p.fecha))}function l(b,x,p,g){const w={_id:e("pc"),fecha:x,cuentaId:b,saldoCts:wt(p),...g?{nota:g}:{}},S=t.get("puntosControl").filter(E=>!(E.cuentaId===b&&E.fecha===x));return t.set("puntosControl",[...S,w].sort((E,_)=>E.fecha.localeCompare(_.fecha))),f(b),w}function u(b){const x=t.get("puntosControl").find(p=>p._id===b);t.set("puntosControl",t.get("puntosControl").filter(p=>p._id!==b)),x&&f(x.cuentaId)}function f(b){const x=r(b),p=t.get("accounts");p.some(g=>g._id===b)&&t.set("accounts",p.map(g=>g._id===b?{...g,historicoSaldos:x.map(w=>({_id:w._id,fecha:w.fecha,saldo:et(w.saldoCts),...w.nota?{nota:w.nota}:{}}))}:g))}function c(b,x=Y()){const p=r(b).filter(E=>E.fecha<=x).pop(),g=p==null?void 0:p.fecha,w=(p==null?void 0:p.saldoCts)??0;return t.get("transacciones").filter(E=>E.cuentaId===b&&E.fecha<=x&&(g===void 0||E.fecha>g)).reduce((E,_)=>E+_.importeCts,w)}function m(b,x){return et(c(b,x))}function v(b=Y(),x){const p=x??t.get("accounts").filter(g=>g.activo).map(g=>g._id);return et(p.reduce((g,w)=>g+c(w,b),0))}function h(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function I(){const b=[...t.get("transacciones").map(x=>x.fecha),...t.get("puntosControl").map(x=>x.fecha)];return b.length>0?b.sort().pop()??null:null}function A(b={}){return et(a(b).reduce((x,p)=>x+p.importeCts,0))}function y(b={}){const x=new Map;for(const p of a(b)){const g=p.fecha.slice(0,7);x.set(g,(x.get(g)??0)+p.importeCts)}return new Map([...x.entries()].sort(([p],[g])=>p.localeCompare(g)).map(([p,g])=>[p,et(g)]))}function $(b={}){const x=new Map;for(const p of a(b))for(const g of p.tags.length>0?p.tags:["sin_tag"])x.set(g,(x.get(g)??0)+p.importeCts);return new Map([...x.entries()].map(([p,g])=>[p,et(g)]))}return{transacciones:a,registrar:o,actualizar:n,eliminar:s,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:u,saldoCuenta:m,saldoCuentaCts:c,saldoTotal:v,tieneDatos:h,ultimaFecha:I,total:A,totalPorMes:y,totalPorTag:$}}function It(t){return t.trim().toLowerCase()}function Fc(t){function e(){const u=new Map,f=(c,m)=>{const v=It(c);if(!v)return;const h=u.get(v)??{tag:v,estimaciones:0,reales:0,total:0};h[m]+=1,h.total+=1,u.set(v,h)};for(const c of t.get("expenses"))for(const m of c.tags??[])f(m,"estimaciones");for(const c of t.get("transacciones"))for(const m of c.tags??[])f(m,"reales");return[...u.values()].sort((c,m)=>m.total-c.total||c.tag.localeCompare(m.tag))}function a(){return e().map(u=>u.tag)}function o(u){return e().filter(f=>u==="estimaciones"?f.reales===0:f.estimaciones===0).map(f=>f.tag)}function n(u,f,c){const m=It(f),v=(u??[]).map(It);if(!v.includes(m))return u??[];const h=v.filter(I=>I!==m);return c===null?[...new Set(h)]:[...new Set([...h,It(c)])]}function s(u,f){const c=It(f);if(!c)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return l(u,c)}function i(u,f){let c=0;for(const m of u)It(m)!==It(f)&&(c+=l(m,It(f)).cambiados);return{cambiados:c}}function r(u){return l(u,null)}function l(u,f){let c=0;const m=t.get("expenses").map(w=>{const S=n(w.tags,u,f);return S!==w.tags&&(c+=1),S===w.tags?w:{...w,tags:S}});t.set("expenses",m);const v=t.get("transacciones").map(w=>{const S=n(w.tags,u,f);return S!==w.tags&&(c+=1),S===w.tags?w:{...w,tags:S}});t.set("transacciones",v);const h=t.get("loans").map(w=>{const S=n(w.tags,u,f);return S!==w.tags&&(c+=1),S===w.tags?w:{...w,tags:S}});t.set("loans",h);const I=t.get("nominas").map(w=>{const S=n(w.tags,u,f);return S!==w.tags&&(c+=1),S===w.tags?w:{...w,tags:S}});t.set("nominas",I);const A=t.get("config"),y=It(u),$=w=>{const S=(w??[]).map(It);if(!S.includes(y))return w??[];const E=S.filter(_=>_!==y);return f===null?[...new Set(E)]:[...new Set([...E,f])]},b={},x=$(A.activeTagsFilter),p=$(A.tagCategorias),g=$(A.tagGrupos);return x!==A.activeTagsFilter&&(b.activeTagsFilter=x),p!==A.tagCategorias&&(b.tagCategorias=p),g!==A.tagGrupos&&(b.tagGrupos=g),Object.keys(b).length>0&&t.patchConfig(b),{cambiados:c}}return{uso:e,todas:a,soloEn:o,renombrar:s,fusionar:i,eliminar:r}}const Pc=3;function An(t){return t<.005?0:t}function Dc(t){if(t.length<2)return null;const e=t.reduce((o,n)=>o+n,0)/t.length,a=t.reduce((o,n)=>o+(n-e)**2,0)/(t.length-1);return Math.sqrt(a)}function Tc(t){const e=[],a=[],o=[];for(const i of t){if(i.meses.length<Pc)continue;const r=Dc(i.meses.map(l=>l.desviacion));r!==null&&(e.push(r),a.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(e.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const n=Math.sqrt(e.reduce((i,r)=>i+r*r,0)),s=Math.sqrt(a.reduce((i,r)=>i+r*r,0));return{sigmaMensual:An(n),sigmaDeriva:An(s),estimaciones:e.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function wn(t,e,a=1,o=0){if(e<=0)return 0;const n=Math.max(0,t)*Math.sqrt(e),s=Math.max(0,o)*e;return n===0&&s===0?0:W(a*Math.hypot(n,s))}function Nc(t,e,a={}){if(!e.fiable||t.length===0)return[];const{z:o=1}=a,n=a.desde??t[0].fecha,[s,i]=n.slice(0,7).split("-").map(Number);return t.map(r=>{const[l,u]=r.fecha.slice(0,7).split("-").map(Number),f=Math.max(0,(l-s)*12+(u-i)),c=wn(e.sigmaMensual,f,o,e.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:W(r.saldoAcum+c),abajo:W(r.saldoAcum-c)}})}function Oc(t,e=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const a=e>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${e} desviación${e!==1?"es":""} típica${e!==1?"s":""} (${a} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const xa="financeapp_session",Rc=["local","dropbox","firebase"];function qc(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!Rc.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function Lc({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now(),graciaActiva:o=()=>!1}={}){const n=()=>t??(typeof localStorage<"u"?localStorage:null);function s(v){const h=n();if(h)try{v?h.setItem(xa,JSON.stringify(v)):h.removeItem(xa)}catch{}}function i(){const v=n();if(!v)return null;try{return qc(v.getItem(xa))}catch{return null}}function r(){const v=i();return v?(a()-v.ultimoUso)/6e4:null}function l(){const v=e();if(!Number.isFinite(v)||v<=0||o())return!1;const h=r();return h!==null&&h>=v}function u(){const v=i();return v?l()?(s(null),null):v:null}function f(v){const h=a(),I={modo:v.modo,...v.email?{email:v.email}:{},...v.passphrase?{passphrase:v.passphrase}:{},creadaEn:h,ultimoUso:h};return s(I),I}function c(){const v=i();v&&s({...v,ultimoUso:a()})}function m(){s(null)}return{abrir:f,leer:u,tocar:c,cerrar:m,caducada:l,inactividadMinutos:r,get activa(){return u()!==null}}}const Sn=["pointerdown","keydown","visibilitychange"];function Bc({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:n=clearInterval,target:s=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const f of Sn)s==null||s.addEventListener(f,r);const l=o(()=>{i&&t.caducada()&&(u(),t.cerrar(),e())},a);function u(){if(i){i=!1,n(l);for(const f of Sn)s==null||s.removeEventListener(f,r)}}return u}const kc=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],Hc="FinanceApp",Gc=new TextEncoder().encode("financeapp-bio-passphrase-v1");function Mn(t){return new Uint8Array(new ArrayBuffer(t))}const $a="financeapp_bio_credencial",Ia="financeapp_bio_secreto",Aa="financeapp_bio_ultimo_desbloqueo",Cn="financeapp_bio_gracia_min",Vc=5;function Uc(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function Pe(t){const e=t instanceof Uint8Array?t:new Uint8Array(t);let a="";for(const o of e)a+=String.fromCharCode(o);return btoa(a)}function De(t){const e=atob(t),a=Mn(e.length);for(let o=0;o<e.length;o++)a[o]=e.charCodeAt(o);return a}function Yc(t){return Pe(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Jc(t){const e=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return De(e)}function En(t){return t.getClientExtensionResults()}function Wc(t={}){const e=t.webauthn??Uc(),a=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),n=t.ahora??(()=>Date.now()),s=t.randomBytes??(p=>crypto.getRandomValues(Mn(p)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return e.disponiblePlataforma()}function l(){const p=o==null?void 0:o.getItem($a);if(!p)return null;try{const g=JSON.parse(p);return typeof g.credencialId!="string"||typeof g.salt!="string"?null:g}catch{return null}}function u(){return l()!==null}async function f(p){const g=await a.importKey("raw",p,"HKDF",!1,["deriveKey"]);return a.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:Gc},g,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function c(p,g){const w=s(12),S=await a.encrypt({name:"AES-GCM",iv:w},p,new TextEncoder().encode(g));return`${Pe(w)}:${Pe(S)}`}async function m(p,g){const[w,S]=g.split(":"),E=De(w),_=De(S),P=await a.decrypt({name:"AES-GCM",iv:E},p,_);return new TextDecoder().decode(P)}async function v(p,g){var O,D;if(!p)throw new Error("No hay clave de cifrado que envolver.");const w=s(32),S=s(32),E=s(16),_=await e.create({publicKey:{challenge:S,rp:{name:Hc},user:{id:E,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:w}}},timeout:6e4}});if(!_)throw new Error("No se ha podido crear la credencial biométrica.");const P=En(_);if(!((O=P.prf)!=null&&O.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let C=((D=P.prf.results)==null?void 0:D.first)??null;if(C||(C=await h(_.rawId,w)),!C)throw new Error("El sensor no ha devuelto material de cifrado.");const M=await f(C),z=await c(M,p),F={credencialId:Yc(_.rawId),salt:Pe(w),modo:g,creadaEn:n()},T=i();T.setItem($a,JSON.stringify(F)),T.setItem(Ia,z)}async function h(p,g){var S,E;const w=await e.get({publicKey:{challenge:s(32),allowCredentials:[{id:p,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:g}}},timeout:6e4}});return w?((E=(S=En(w).prf)==null?void 0:S.results)==null?void 0:E.first)??null:null}async function I(){const p=l();if(!p)throw new Error("No hay huella configurada en este dispositivo.");const g=o==null?void 0:o.getItem(Ia);if(!g)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const w=await h(Jc(p.credencialId).buffer,De(p.salt));if(!w)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const S=await f(w),E=await m(S,g);return y(),E}function A(){o==null||o.removeItem($a),o==null||o.removeItem(Ia),o==null||o.removeItem(Aa)}function y(){o==null||o.setItem(Aa,String(n()))}function $(){const p=o==null?void 0:o.getItem(Cn);if(p==null)return Vc;const g=Number(p);return Number.isFinite(g)&&g>0?g:0}function b(p){o==null||o.setItem(Cn,String(Math.max(0,Math.floor(p)||0)))}function x(){if(!u())return!1;const p=$();if(p<=0)return!1;const g=o==null?void 0:o.getItem(Aa),w=g?Number(g):NaN;return Number.isFinite(w)?n()-w<p*6e4:!1}return{disponible:r,registrada:u,leerCredencial:l,registrar:v,desbloquear:I,olvidar:A,marcarDesbloqueo:y,dentroDeGracia:x,graciaMinutos:$,configurarGracia:b}}function jn(){if(typeof localStorage<"u"){const x=ks();x.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${x.join(", ")}`)}const t=Zs(),e=t.activo(),a=le(e),o=$o(localStorage,a),n=Ys({adapter:o}),s=Js(),{applied:i}=n.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${ie})`),n.subscribe(x=>s.marcar(x));const r={listar:()=>t.listar(),activo:()=>t.listar().find(x=>x._id===e)??t.listar()[0],colecciones:Tt.filter(x=>x!=="config"),crear:x=>t.crear(x),renombrar:(x,p)=>t.renombrar(x,p),duplicar:(x,p)=>t.duplicar(x,p),eliminar:x=>t.eliminar(x),cambiarA:x=>t.establecerActivo(x),importarDesde:(x,p)=>{const g=ti(localStorage,x,p),w=ei(g),S=[];for(const E of p){const _=w[E];if(!Array.isArray(_)||_.length===0)continue;const P=n.get(E);n.set(E,[...P,..._]),S.push(E)}return S.length>0&&s.marcar("importado-de-otro-proyecto"),{importadas:S}}},l=oi(n);us(x=>l.isEnabled(x));const u=Wc(),f=Lc({autoLogoutMinutos:()=>{var p,g;const x=(g=(p=globalThis.State)==null?void 0:p.get)==null?void 0:g.call(p,"config");return Number((x==null?void 0:x.autoLogoutMinutos)??n.get("config").autoLogoutMinutos??0)},graciaActiva:()=>u.dentroDeGracia()}),c=zc(n),m=Fc(n),v=Ji(c),h=ji(n),I=wi({isEnabled:x=>l.isEnabled(x)}),A=gi({flags:l,rutasExtra:()=>I.flagPorRuta()}),y=ri({flags:l,onChange:()=>{var x,p;I.attachToShell(),A.apply(),(p=(x=globalThis.Router)==null?void 0:x.rerender)==null||p.call(x)}}),$=vi({proyectos:r}),b=()=>{var p,g,w,S,E,_;const x=globalThis;if((g=(p=x.State)==null?void 0:p.load)==null||g.call(p),((S=(w=x.Router)==null?void 0:w.current)==null?void 0:S.call(w))==="dashboard")try{(_=(E=x.DashboardModule)==null?void 0:E.render)==null||_.call(E)}catch(P){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",P)}};return I.register($r({store:n,onDatosCambiados:b})),I.register(Fr({store:n,onDatosCambiados:b})),I.register(Qr({store:n,onDatosCambiados:b})),I.register(bl({store:n,ledger:c,mostrarObjetivos:()=>l.isEnabled("goals"),onDatosCambiados:b})),I.register(ir({ledger:c,tags:m,precision:v,adjuster:h,accounts:()=>n.get("accounts"),estimaciones:()=>n.get("expenses"),onDatosCambiados:b})),I.register(_c({store:n,onDatosCambiados:b})),I.register(El({store:n,onDatosCambiados:b})),I.register(fr({store:n,onDatosCambiados:b})),I.register(wl({store:n})),I.register(lr({store:n,onDatosCambiados:b})),{version:ie,core:Yn,engine:{generarExtracto:oe,recomputarSaldoAcum:Kn,saldoHoy:Qn,sumarPorTags:Za,providers:{proyectarGastos:ae,proyectarPrestamos:Ga,proyectarTransferencias:Va,proyectarNominas:Wa,proyectarInteresesCuentas:Ya,proyectarAportaciones:Ua,proyectarRetencionesFiscales:Ja,proyectarInflacionGastos:Ka,proyectarPerdidaAhorro:Qa},analysis:es,margins:ss,avisos:cs,optimizer:ps,dashboard:Ms},store:n,flags:l,featureRegistry:{all:zt,porGrupo:Co},ui:{openFeatures:y.open,openProyectos:$.open,applyGating:A.apply,watchGating:()=>A.observar(),instalarDeshacer:()=>hi({store:n,rerender:()=>{var p,g,w,S;const x=globalThis;(g=(p=x.State)==null?void 0:p.load)==null||g.call(p),(S=(w=x.Router)==null?void 0:w.rerender)==null||S.call(w)}}),avisoGuardado:null,instalarBuscador:()=>Ii({estado:()=>({accounts:n.get("accounts"),expenses:n.get("expenses"),loans:n.get("loans"),nominas:n.get("nominas"),escenarios:n.get("escenarios"),planes:n.get("planes"),goals:n.get("goals"),transacciones:n.get("transacciones")}),rutasDisponibles:()=>I.routes(),navegar:x=>{var p,g;return(g=(p=globalThis.Router)==null?void 0:p.navigate)==null?void 0:g.call(p,x)}})},app:I,session:Object.assign(f,{vigilar:x=>Bc({sesion:f,onCaducada:x}),opciones:kc}),biometria:u,cambios:s,datos:{colecciones:Tt,snapshot:()=>Io(o),aplicar:(x,{sellar:p=!0}={})=>{const w=Ws(p?(S,E)=>o.set(S,E):(S,E)=>{const _=globalThis.StorageAdapter;_!=null&&_.setRestaurando?_.setRestaurando(S,E):o.set(S,E)},x);return n.load(),s.marcar("copia-restaurada"),w},faltantes:x=>Ks(x),esVacioOPorDefecto:()=>Qs(Io(o)),recargar:()=>{n.load(),s.marcar("recarga-externa")}},proyectos:r,accounting:{ledger:c,tags:m,precision:v,adjuster:h,sugerirAjuste:ia,medirVariabilidad:Tc,bandaDeConfianza:Nc,bandaAcumulada:wn,describirBanda:Oc}}}function Kc(){try{const t=jn();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const vt=typeof window<"u"?Kc():null;if(vt){let t=!1;const e=()=>{var a;if(vt.app.attachToShell(),vt.ui.applyGating(),!t){t=!0,vt.ui.watchGating(),vt.ui.instalarDeshacer(),vt.ui.instalarBuscador();const o=globalThis,n=()=>{var r,l,u,f;return(l=(r=o.FirebaseService)==null?void 0:r.isConnected)!=null&&l.call(r)?o.FirebaseService:(f=(u=o.DropboxService)==null?void 0:u.isConnected)!=null&&f.call(u)?o.DropboxService:null};vt.ui.avisoGuardado=Ai({cambios:vt.cambios,hayDestino:()=>n()!==null,guardar:async()=>{const r=n();if(!(r!=null&&r.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");await r.uploadBackup()}});const s=document.getElementById("sidebar-proyecto-activo"),i=document.getElementById("sidebar-proyecto-activo-nombre");s&&i&&(i.textContent=vt.proyectos.activo().nombre,s.classList.remove("hidden"),s.addEventListener("click",()=>vt.ui.openProyectos())),(a=document.getElementById("btn-proyectos"))==null||a.addEventListener("click",()=>vt.ui.openProyectos())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",a=>{const o=a.target;o!=null&&o.closest(".nav-btn[data-view]")&&setTimeout(e,0)})}return At.bootstrap=jn,Object.defineProperty(At,Symbol.toStringTag,{value:"Module"}),At}({});
//# sourceMappingURL=financeapp-core.js.map

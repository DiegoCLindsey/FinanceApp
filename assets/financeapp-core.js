var FinanceAppBundle=function($a){"use strict";function ot(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function U(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function st(){return ot(new Date)}function xa(t,a){return new Date(t,a+1,0).getDate()}function vo(t,a,e){return ot(new Date(t,a,Math.min(e,xa(t,a))))}function We(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return ot(new Date(t,a+1,0));const s=parseInt(o);if(!isNaN(s))return vo(t,a,s)}if(e.startsWith("nthweekday:")){const o=e.split(":"),s=parseInt(o[1]),n=parseInt(o[2]);if(s===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==n;)r.setDate(r.getDate()-1);return ot(r)}const i=new Date(t,a,1);for(;i.getDay()!==n;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(s-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),ot(i)}return null}function bo(t,a){if(!a)return t;const e=U(t);return We(e.getFullYear(),e.getMonth(),a)??t}const yn=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],$n={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function Ia(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${$n[e]||e+"º"} ${yn[o]} del mes`}return t}function Ae(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function Ee(t){const a=U(t),e=a.getDay()===0?0:7-a.getDay();return a.setDate(a.getDate()+e),ot(a)}function ce(t,a){const e=U(t);return e.setDate(e.getDate()+a),ot(e)}function le(t,a,e){const o=Math.max(1,e),s=t.getFullYear(),n=t.getMonth(),i=(a.getFullYear()-s)*12+(a.getMonth()-n);if(i<=0)return{year:s,month:n};const r=n+Math.floor(i/o)*o;return{year:s+Math.floor(r/12),month:r%12}}function Ke(t,a,e,o){return!(t&&t>o||a&&a<e)}function ho(t,a){const e=Math.max(1,Math.round(a??1));return t==="extraordinario"?"una vez":t==="diaria"?e===1?"cada día":e===7?"cada semana":e===14?"cada 2 semanas":`cada ${e} días`:e===1?"cada mes":e===3?"cada trimestre":e===6?"cada semestre":e===12?"cada año":`cada ${e} meses`}function Pt(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function ct(t){return t/100}function X(t){return ct(Pt(t))}function D(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function yo(t){return(t||0).toFixed(2)+"%"}function te(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function $o(t,a,e,o=0){const s=te(t,a,e),n=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const l=s*(1-Math.pow(1+i,-e))/i-n,p=s*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),d=i-l/p;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function xo(t,a,e,o,s=0,n=[],i={}){const r=[];let c=t;const l=U(o),p=a/100/12;let d=e,u=te(c,a,d);const v=[...n].sort((b,$)=>b.fecha.localeCompare($.fecha));let g=0;for(let b=1;b<=e*2&&c>.01;b++){const $=new Date(l);l.setMonth(l.getMonth()+1);const f=bo(ot($),i.diaPago||"");for(;g<v.length&&v[g].fecha<=f;){const w=v[g],I=w.cantidad*(s/100);if(c-=w.cantidad,c=Math.max(0,c),w.tipo==="plazo"?d=Math.ceil(-Math.log(1-c*p/u)/Math.log(1+p)):(d=e-b+1,u=te(c,a,d)),r.push({mes:"AMORT",fecha:w.fecha,cuota:0,interes:0,amortizacion:w.cantidad,comisionAmort:I,capitalPendiente:c,esAmortizacion:!0,simulacion:w.simulacion||!1}),g++,c<.01)break}if(c<.01)break;const h=c*p,S=Math.min(u-h,c);if(c-=S,c<.01&&(c=0),r.push({mes:b,fecha:f,cuota:u,interes:h,amortizacion:S,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),d--,d<=0||c<.01)break}return r}const Io=new Map;function $t(t){var $;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((f,h)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${h.fecha}|${h.cantidad}|${h.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=Io.get(e);if(o)return o;const{capital:s,tin:n,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:l}=t,p=xo(s,n,i,r,c||0,a,t),d=p.reduce((f,h)=>f+h.interes,0),u=p.reduce((f,h)=>f+h.comisionAmort,0),v=s*((l||0)/100),g=p.filter(f=>!f.esAmortizacion),b={cuota:te(s,n,i),totalIntereses:d,tae:$o(s,n,i,l||0),costoTotal:d+u+v,comAp:v,totalComAm:u,fechaFin:(($=g.slice(-1)[0])==null?void 0:$.fecha)||"",mesesReales:g.length,tabla:p};return Io.set(e,b),b}function wo(t){const a=$t(t),e=$t({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,s=e.mesesReales-a.mesesReales,n=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:s,costeTotalAmort:n,ahorroNeto:o-n,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function Ut(t,a,e){if(!t||t.length===0)return 1;const o=U(a),s=U(e);if(s<=o)return 1;const n=[...t].sort((c,l)=>c.year-l.year);let i=1,r=new Date(o);for(;r<s;){const c=r.getFullYear(),l=n.filter(b=>b.year<=c),p=l.length>0?l[l.length-1]:n[0],d=(p?p.tasa:0)/100,u=new Date(c+1,0,1),v=u<s?u:s,g=Ae(r,v);i*=Math.pow(1+d,g/365.25),r=v}return i}function Co(t,a,e,o=0){const s=U(a),n=U(e);if(n<=s)return o;const i=Ae(s,n),r=t?[...t].sort((p,d)=>p.year-d.year):[];let c=0,l=new Date(s);for(;l<n;){const p=l.getFullYear(),d=new Date(p+1,0,1),u=d<n?d:n,v=Ae(l,u),g=r.filter(f=>f.year<=p),b=g.length>0?g[g.length-1]:null,$=b!==null?b.tasa:o;c+=$*v,l=u}return i>0?c/i:o}function So(t,a){return((1+t/100)/(1+a/100)-1)*100}function xn(t,a,e,o){const s=Ut(a,e,o);return s>0?t/s:t}function In(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,s=a.saludUmbralDTIVerde??30,n=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:l=0,cuotasHipoteca:p=0,gastosBasicos:d=0,gastosOtros:u=0,amortizaciones:v=0}=t,g=c-l-v-d-u,b=g,$=c>0?b/c*100:null,f=r?l-p:l,h=c>0?f/c*100:null,S=c>0?l/c*100:null,w=c>0?(d+l+v)/c*100:null,I=c>0?u/c*100:null,A=(C,y,E)=>C===null?"neutral":C>=y?"verde":C>=E?"amarillo":"rojo",M=(C,y,E)=>C===null?"neutral":C<=y?"verde":C<=E?"amarillo":"rojo";return{ingresos:c,cuotas:l,cuotasHipoteca:p,gastosBasicos:d,gastosOtros:u,amortizaciones:v,ahorroBruto:g,ahorroReal:b,tasaAhorro:$,dti:h,dtiTotal:S,excluyeHipoteca:r,pctNecesidades:w,pctDeseos:I,semAhorro:A($,e,o),semDTI:M(h,s,n),semNecesidades:M(w,i[0],i[0]+15),semDeseos:M(I,i[1],i[1]+10),semAhorroRegla:A($,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:s,umbralDTIAmarillo:n,regla:i}}function _t(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function Yt(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Pe(t,a){const e=wa(t,a);return e?e.saldo:a>=(t.fechaInicialSaldo||"")&&t.saldoInicial||0}function wa(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];return e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,n)=>{s.fecha>=e&&o.push({...s,prioridad:n})}),o.sort((s,n)=>n.fecha.localeCompare(s.fecha)||n.prioridad-s.prioridad),o.find(s=>s.fecha<=a)??null}else return[...t.historicoSaldos||[]].sort((s,n)=>n.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=a)??null}function Mo(t,a){let e="";for(const o of t){const s=wa(o,a);s&&s.fecha>e&&(e=s.fecha)}return e}function wn(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function Cn(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}function Je(t){var a,e;return((a=t.find(o=>o.esPorDefecto))==null?void 0:a._id)??((e=t[0])==null?void 0:e._id)??"default"}function Sn(t,a){if(a<=0)return[];const e=t<0?-1:1,o=Math.abs(t),s=Math.floor(o/a),n=o-s*a;return Array.from({length:a},(i,r)=>e*(s+(r<n?1:0)))}function Mn(t,a,e,o){if(e===0)return{ids:t,cts:a};const s=t.indexOf(o);if(s>=0){const n=[...a];return n[s]+=e,{ids:t,cts:n}}return{ids:[...t,o],cts:[...a,e]}}function de(t,a,e){const o=Pt(t);if(!a||a.participantes.length===0)return[{personaId:e,importe:ct(o)}];const s=a.participantes.map(d=>d.personaId);if(a.modo==="partesIguales"){const d=Sn(o,s.length);return s.map((u,v)=>({personaId:u,importe:ct(d[v])}))}const n=a.participantes.map(d=>{const u=Math.max(0,d.valor??0);return a.modo==="porcentaje"?Math.round(o*u/100):Pt(u)}),i=n.reduce((d,u)=>d+u,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const d=o/i,u=n.map(g=>Math.round(g*d)),v=u.reduce((g,b)=>g+b,0);return u.length>0&&(u[0]+=o-v),s.map((g,b)=>({personaId:g,importe:ct(u[b])}))}const c=o-i,{ids:l,cts:p}=Mn(s,n,c,e);return l.map((d,u)=>({personaId:d,importe:ct(p[u])}))}function Ca(t,a){return t.find(e=>e._id===a||a.startsWith(`${e._id}_`))}function An(t,a,e){const o=Je(e),s=new Map,n=i=>{let r=s.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},s.set(i,r)),r};for(const i of e)n(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=Ca(a.expenses,i.sourceId);for(const l of de(r,c==null?void 0:c.repartoPago,o))n(l.personaId).pago+=l.importe;for(const l of de(r,c==null?void 0:c.repartoConsumo,o))n(l.personaId).consumo+=l.importe}else if(i.sourceType==="loan"){const c=Ca(a.loans,i.sourceId);for(const l of de(r,c==null?void 0:c.repartoPago,o))n(l.personaId).pago+=l.importe;for(const l of de(r,c==null?void 0:c.repartoConsumo,o))n(l.personaId).consumo+=l.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=Ca(a.nominas,i.sourceId);for(const l of de(r,c==null?void 0:c.repartoConsumo,o))n(l.personaId).ingresos+=l.importe}}}return[...s.values()]}function Sa(t,a,e){const o=s=>!s||s.participantes.length===0?[e]:s.participantes.map(n=>n.personaId);return new Set([...o(t),...o(a)])}const Wt=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function jt(t,a){const e=[...a].sort((n,i)=>n[0]-i[0]);let o=0,s=t;for(let n=e.length-1;n>=0;n--){const[i,r]=e[n];s<=i||(o+=(s-i)*(r/100),s=i)}return o}function Ao(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,s=Math.min(2e3,e),n=Math.max(0,e-o-s),i=n<=15876?7302:n<=21622?Math.max(0,7302-1.75*(n-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:s,RNT:n,reducArt20:i,baseImponible:Math.max(0,n-i)}}function Kt(t,a){return Ao(t,a).baseImponible}function Eo(t,a){return jt(t,a)/12}const _e=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Ma(t,a){if(!t||t<=0)return 0;const e=a||_e;let o=0,s=t;for(let n=0;n<e.length;n++){const[i,r]=e[n],c=n<e.length-1?e[n+1][0]:1/0,l=Math.min(s,c-i);if(!(l<=0)&&(o+=l*(r/100),s-=l,s<=0))break}return o}function Qe(t,a){if(_t(t)!=="inversion")return null;const e=Yt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,s=Math.max(0,e-o),n=Ma(s,a);return{saldo:e,costBase:o,plusvalia:s,impuesto:n,neto:e-n}}function Aa(t,a=new Date){var u;if(_t(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=Yt(t),s=ot(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),n=[...t.aportaciones||[]].sort((v,g)=>v.fecha.localeCompare(g.fecha));let i=0;const r=n.reduce((v,g)=>v+g.cantidad,0);for(const v of n)v.fecha<=s&&(i+=v.cantidad);const c=Math.max(0,o-r),l=r>0?i/r:0,p=Math.min(o,i+c*l),d=Math.max(0,o-p);return{saldo:o,disponible:p,bloqueado:d,costBase:r,beneficio:c,numAportaciones:n.length,proxDesbloqueo:((u=n.find(v=>v.fecha>s))==null?void 0:u.fecha)||null}}function Po(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(_t(t)!=="pension"||!o)return 0;const s=Yt(t);if(s<=0)return 0;const n=(t.aportaciones||[]).reduce((l,p)=>l+p.cantidad,0),i=Math.max(0,s-n);if(i<=0)return 0;const r=i/s;return+(a*r*o/100).toFixed(2)}function Ea(t,a,e){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const n=(a||[]).filter(l=>(l.grupoNomina||"")===o&&l.activo!==!1).reduce((l,p)=>l+(p.bruto||0)*(p.nPagas||12),0),i=[...e||[]].sort((l,p)=>l[0]-p[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[l,p]of i)if(n>=l)r=p;else break;return r}const En=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:_e,TRAMOS_IRPF_DEFAULT:Wt,agregarPorPersona:An,ajustarFechaPago:bo,ajustarPrecioReal:xn,arranqueMensual:le,calcBaseImponibleTrabajo:Kt,calcFactorInflacion:Ut,calcFondoInversion:Qe,calcFondosPension:Aa,calcGananciasCapital:Ma,calcIRPF:jt,calcImpuestoPension:Po,calcInflacionMediaAnual:Co,calcSaludFinanciera:In,calcTAE:$o,calcTipoMarginalPension:Ea,calcTipoRealFisher:So,calcularReparto:de,clampedDate:vo,cuotaMensual:te,desgloseBaseTrabajo:Ao,diasEntre:Ae,entradaSaldo:wa,etiquetaPeriodicidad:ho,fechaUltimoSaldoConocido:Mo,finDeSemana:Ee,formatEUR:D,formatLocalDate:ot,formatPct:yo,fromCents:ct,haySimulaciones:Cn,idPersonaPorDefecto:Je,labelDiaPago:Ia,lastDayOfMonth:xa,modeloFondoDe:_t,parseLocalDate:U,personasImplicadas:Sa,resolverDiaEfectivo:We,resumenPrestamo:$t,resumenPrestamoConAhorro:wo,retencionMensual:Eo,roundMoney:X,saldoEnFecha:Pe,saldoRealCuenta:Yt,sinSimulaciones:wn,sumarDias:ce,tablaAmortizacion:xo,toCents:Pt,todayISO:st,vigenteEnRango:Ke},Symbol.toStringTag,{value:"Module"}));function Fe(t,a,e=null){const o=[],s=U(a.start),n=U(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=U(i.fechaInicio||a.start),c=i.fechaFin?U(i.fechaFin):n,l=i.cuantia,p=d=>o.push({fecha:d,concepto:i.concepto,cuantia:l,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=s&&r<=n&&r<=c&&p(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let{year:u,month:v}=le(r,s,d);const g=Math.ceil(240/d)+2;for(let b=0;b<g;b++){const $=We(u,v,i.diaPago||"")||(()=>{const h=r.getDate(),S=new Date(u,v+1,0).getDate();return ot(new Date(u,v,Math.min(h,S)))})(),f=U($);if(f>n||f>c)break;f>=s&&f>=r&&p($),v+=d,v>=12&&(u+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let u=new Date(Math.max(r.getTime(),s.getTime()));if(r<s){const v=Math.ceil((s.getTime()-r.getTime())/d);u=new Date(r.getTime()+v*d)}for(;u<=n&&u<=c;)p(ot(u)),u=new Date(u.getTime()+d)}}return o}function Pa(t,a,e=null){const o=[];for(const s of t){if(!s.activo||e&&e.length>0&&!e.includes(s.cuenta||"default"))continue;const{tabla:n}=$t(s);for(const i of n)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${s.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${s.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan",simulacion:s.simulacion||!1}))}return o}function _o(t,a,e=null,o={accounts:[]}){const s=[],n=U(a.start),i=U(a.end),r=o.accounts||[],c=o.nominas||[],l=o.resolverTramosIRPF||(()=>Wt),p=o.resolverTramosGanancias||(()=>_e),d=u=>{var v;return((v=r.find(g=>g._id===u))==null?void 0:v.nombre)??u};for(const u of t){if(!u.activo||u.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(u.cuenta||"default")||e.includes(u.cuentaDestino||"default")))continue;const v=U(u.fechaInicio||a.start),g=u.fechaFin?U(u.fechaFin):i,b=$=>{const f=r.find(_=>_._id===(u.cuenta||"default")),h=r.find(_=>_._id===(u.cuentaDestino||"default")),S=_t(f),w=_t(h),I=S==="inversion"&&w==="inversion"||S==="pension"&&w==="pension",A=["transferencia",...I?["traspaso"]:[],...u.tags||[]],M=I?"traspaso-out":"transfer-out",C=I?"traspaso-in":"transfer-in",y=!e||e.length===0||e.includes(u.cuenta||"default"),E=!e||e.length===0||e.includes(u.cuentaDestino||"default");if(y&&s.push({fecha:$,concepto:`Transf. → ${d(u.cuentaDestino||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"gasto",tags:A,cuenta:u.cuenta||"default",sourceId:u._id,sourceType:M}),E&&s.push({fecha:$,concepto:`Transf. ← ${d(u.cuenta||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"ingreso",tags:A,cuenta:u.cuentaDestino||"default",sourceId:u._id,sourceType:C}),y&&!I&&f){if(S==="inversion"){const _=parseInt($.slice(0,4)),P=Qe(f,p(_));if(P&&P.saldo>0&&P.plusvalia>0){const x=Math.min(1,u.cuantia/P.saldo),T=P.plusvalia*x*.19;T>.01&&s.push({fecha:$,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:T,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"investment-tax"})}}else if(S==="pension"){const _=l(parseInt($.slice(0,4))),P=Ea(f,c,_),x=Po(f,u.cuantia,P||void 0);if(x>0){const z=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${P}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;s.push({fecha:$,concepto:z,cuantia:x,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"pension-tax"})}}}};if(u.tipoFrecuencia==="extraordinario")v>=n&&v<=i&&v<=g&&b(u.fechaInicio);else if(u.tipoFrecuencia==="mensual"){const $=Math.max(1,u.frecuencia||1);let{year:f,month:h}=le(v,n,$);const S=Math.ceil(240/$)+2;for(let w=0;w<S;w++){const I=We(f,h,u.diaPago||"")||(()=>{const M=v.getDate(),C=new Date(f,h+1,0).getDate();return ot(new Date(f,h,Math.min(M,C)))})(),A=U(I);if(A>i||A>g)break;A>=n&&A>=v&&b(I),h+=$,h>=12&&(f+=Math.floor(h/12),h=h%12)}}else if(u.tipoFrecuencia==="diaria"){const $=Math.max(1,u.frecuencia||1)*864e5;let f=new Date(Math.max(v.getTime(),n.getTime()));if(v<n){const h=Math.ceil((n.getTime()-v.getTime())/$);f=new Date(v.getTime()+h*$)}for(;f<=i&&f<=g;)b(ot(f)),f=new Date(f.getTime()+$)}}return s}function Fo(t,a,e=null){const o=[],s=U(a.start),n=U(a.end);for(const i of t){const r=_t(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const l of c){if(!l.importe||l.importe<=0)continue;const p=U(l.fechaInicio||a.start),d=l.fechaFin?U(l.fechaFin):n,u=l.cuentaOrigen||"default",v=!e||!e.length||e.includes(u),g=!e||!e.length||e.includes(i._id),b=r==="pension"?"pension":"capital-mobiliario",$=I=>{v&&o.push({fecha:I,concepto:`Aportación → ${i.nombre}`,cuantia:l.importe,tipo:"gasto",tags:["aportacion","transferencia",b],cuenta:u,sourceId:l._id,sourceType:"aportacion-out"}),g&&o.push({fecha:I,concepto:`Aportación ${i.nombre} (${l.periodicidad||"mensual"})`,cuantia:l.importe,tipo:"ingreso",tags:["aportacion","transferencia",b],cuenta:i._id,sourceId:l._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[l.periodicidad||"mensual"]||1;let{year:h,month:S}=le(p,s,f);const w=Math.ceil(240/f)+2;for(let I=0;I<w;I++){const A=new Date(h,S+1,0).getDate(),M=ot(new Date(h,S,Math.min(p.getDate(),A))),C=U(M);if(C>n||C>d)break;C>=s&&C>=p&&$(M),S+=f,S>=12&&(h+=Math.floor(S/12),S=S%12)}}}return o}function Do(t,a,e=null,o=[]){const s=[];for(const n of t){if(!n.activo||!n.interes||n.interes<=0||e&&e.length>0&&!e.includes(n._id))continue;const i=U(a.start),r=U(a.end),c=n.periodoCobro||"mensual",l=c==="mensual",p=l?null:{diario:864e5,semanal:7*864e5}[c]||864e5,d=l?1/12:p/(365.25*864e5);let u=Pe(n,a.start);const v=o.filter($=>$.cuenta===n._id).map($=>({fecha:$.fecha,delta:$.tipo==="ingreso"?Math.abs($.cuantia):-Math.abs($.cuantia)})).sort(($,f)=>$.fecha.localeCompare(f.fecha));let g=0,b=new Date(i);for(;b<=r;){const $=l?new Date(b.getFullYear(),b.getMonth()+1,b.getDate()):new Date(b.getTime()+p),f=new Date(Math.min($.getTime(),r.getTime()+1)),h=ot(f);let S=0;for(;g<v.length&&v[g].fecha<h;)S+=v[g].delta,g++;const w=u,I=u+S,A=Math.max(0,(w+I)/2);u=I;const M=l?d:(f.getTime()-b.getTime())/(365.25*864e5),C=A*(Math.pow(1+n.interes/100,M)-1);C>.001&&s.push({fecha:ot(b),concepto:`Interés ${n.nombre}`,cuantia:C,tipo:"ingreso",tags:["interes","cuenta"],cuenta:n._id,sourceId:n._id,sourceType:"account-interest"}),b=$}}return s}function To(t,a,e,o=null){const s=[],n=a||Wt;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=Eo(r,n),l={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};s.push(...Fe([l],e,o))}return s}const Pn=[5,11,2,8],_n={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function _a(t,a,e=null,o=[],s=()=>Wt){const n=[],i=U(a.start),r=U(a.end),c=o.length>0,l={};for(const u of t){const v=u.grupoNomina||"";l[v]||(l[v]=[]),l[v].push(u)}for(const u of Object.keys(l))l[u].sort((v,g)=>(g.bruto||0)-(v.bruto||0));function p(u,v){if(!c||!u.mesActualizacionIPC)return u.bruto||0;const g=u.fechaInicio||a.start,b=U(g),$=U(v);let f=0;for(let S=b.getFullYear();S<=$.getFullYear();S++){const w=new Date(S,u.mesActualizacionIPC-1,1);w>b&&w<=$&&f++}if(f===0)return u.bruto||0;const h=ot(new Date(b.getFullYear()+f,0,1));return(u.bruto||0)*Ut(o,g,h)}function d(u,v){const g=p(u,v),b=(u.retribucionFlexible||[]).reduce((_,P)=>_+(P.importe||0)*12,0),$=Math.max(0,g-b);if(u.irpfModo==="manual")return $*((u.irpfPct||0)/100);const f=s(parseInt(v.slice(0,4))),h=u.grupoNomina||"";if(!h)return jt(Kt(g,b),f);const S=l[h].filter(_=>_.activo),w=S.reduce((_,P)=>_+p(P,v),0),I=S.reduce((_,P)=>_+(P.retribucionFlexible||[]).reduce((x,z)=>x+(z.importe||0)*12,0),0),A=Math.max(0,w-I),M=Kt(w,I),C=Math.max(0,g-b),y=A>0?M*(C/A):0,E=S.filter(_=>_._id!==u._id&&(_.bruto||0)>(u.bruto||0)).reduce((_,P)=>{const x=(P.retribucionFlexible||[]).reduce((T,q)=>T+(q.importe||0)*12,0),z=Math.max(0,p(P,v)-x);return _+(A>0?M*(z/A):0)},0);return jt(E+y,f)-jt(E,f)}for(const u of t){if(!u.activo)continue;const v=u.cuenta||"default";if(e&&e.length>0&&!e.includes(v))continue;const g=Math.max(1,u.nPagas||12),b=U(u.fechaInicio||a.start),$=u.fechaFin?U(u.fechaFin):r,f=h=>{const S=p(u,h),w=d(u,h),I=(u.retribucionFlexible||[]).reduce((x,z)=>x+(z.importe||0)*12,0),A=Math.max(0,S-I),M=(u.ssPct??6.35)/100,C=A*M,y=A/g,E=w/g,_=C/g,P=u.representacion==="simplificado"?y-_-E:y;n.push({fecha:h,concepto:u.nombre,cuantia:P,tipo:"ingreso",cuenta:v,tags:u.tags||[],sourceId:u._id,sourceType:"nomina"}),u.representacion==="detallado"&&(_>0&&n.push({fecha:h,concepto:`SS ${u.nombre}`,cuantia:_,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:u._id+"_ss",sourceType:"nomina"}),E>0&&n.push({fecha:h,concepto:`IRPF ${u.nombre}`,cuantia:E,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:u._id+"_irpf",sourceType:"nomina"}));for(const x of u.retribucionFlexible||[])!x.cuenta||!(x.importe>0)||e&&e.length>0&&!e.includes(x.cuenta)||n.push({fecha:h,concepto:`${u.nombre} — ${_n[x.tipo]||x.tipo}`,cuantia:x.importe,tipo:"ingreso",cuenta:x.cuenta,tags:["retribucion-flexible",x.tipo],sourceId:`${u._id}_flex_${x._id||x.tipo}`,sourceType:"nomina"})};if(g<=12){const h=g===12?1:Math.round(12/g),S=b.getDate();let{year:w,month:I}=le(b,i,h);for(let A=0;A<300;A++){const M=new Date(w,I+1,0).getDate(),C=new Date(w,I,Math.min(S,M));if(C>r||C>$)break;C>=i&&C>=b&&f(ot(C)),I+=h,I>=12&&(w+=Math.floor(I/12),I=I%12)}}else{const h=g-12,S=b.getDate();let{year:w,month:I}=le(b,i,1);for(let C=0;C<300;C++){const y=new Date(w,I+1,0).getDate(),E=new Date(w,I,Math.min(S,y));if(E>r||E>$)break;E>=i&&E>=b&&f(ot(E)),I++,I>=12&&(w++,I=0)}const A=Math.max(b.getFullYear(),i.getFullYear()),M=Math.min((u.fechaFin?$:r).getFullYear(),r.getFullYear());for(let C=A;C<=M;C++)for(const y of Pn.slice(0,h)){const E=new Date(C,y,15);E>=i&&E<=r&&E>=b&&E<=$&&f(ot(E))}}}return n}function zo(t,a,e,o=null,s="default"){const n=[];if(!a||a.length===0)return n;const i=U(e.start),r=U(e.end),c=st(),l=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let p=new Date(i.getFullYear(),i.getMonth(),1);for(;p<=r;){const d=p.getFullYear(),u=p.getMonth(),v=d+"-"+String(u+1).padStart(2,"0"),g=v+"-01",b=ot(new Date(d,u+1,0)),$=ot(new Date(d,u,15));let f=0;for(const h of l){if(o&&o.length>0&&!o.includes(h.cuenta||"default")||h.fechaInicio&&h.fechaInicio>b||h.fechaFin&&h.fechaFin<g)continue;const S=h.fechaInicio||c,w=Ut(a,S,$);if(w<=1)continue;const I=Math.max(1,h.frecuencia||1);f+=h.cuantia*(w-1)/I}f>.01&&n.push({fecha:$,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:s,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),p=new Date(d,u+1,1)}return n}function jo(t,a,e,o="default"){const s=[];if(!a||a.length===0||t<=0)return s;const n=U(e.start),i=U(e.end),r=[...a].sort((l,p)=>l.year-p.year);let c=new Date(n.getFullYear(),n.getMonth(),1);for(;c<=i;){const l=c.getFullYear(),p=c.getMonth(),d=l+"-"+String(p+1).padStart(2,"0"),u=ot(new Date(l,p,15)),v=r.filter(h=>h.year<=l),g=v.length>0?v[v.length-1]:r[0],b=g?g.tasa/100:0,$=Math.pow(1+b,1/12)-1,f=t*$;f>.01&&s.push({fecha:u,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),c=new Date(l,p+1,1)}return s}function qo(t,a){const e=a.fechaReferencia||a.dashboardStart,o=e<a.dashboardStart?a.dashboardStart:e>a.dashboardEnd?a.dashboardEnd:e,s=t.reduce((i,r)=>i+Pe(r,o),0),n=Mo(t,o);return{fecha:n&&n<o?n:o,saldo:s,pedida:o}}function No(t,a,e){const{fecha:o,saldo:s}=qo(a,e),n=t.filter(p=>p.fecha<o),i=t.filter(p=>p.fecha>=o),r=[];let c=s;for(const p of[...n].reverse()){const d=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);r.unshift({...p,delta:d,saldoAcum:c}),c-=d}const l=[];c=s;for(const p of i){const d=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);c+=d,l.push({...p,delta:d,saldoAcum:c})}return[...r,...l]}function Fn(t,a,e,o=null){const s=a.filter(n=>n.activo&&(!o||o.length===0||o.includes(n._id)));return No([...t].sort((n,i)=>n.fecha.localeCompare(i.fecha)),s,e)}function Ro(t){const{loans:a,expenses:e,accounts:o,config:s}=t,n=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c=o.filter($=>$.activo&&(!n||n.length===0||n.includes($._id))),l=qo(c,s),p={start:l.fecha<s.dashboardStart?l.fecha:s.dashboardStart,end:s.dashboardEnd},d=e.filter($=>$.tipo!=="transferencia"),u=e.filter($=>$.tipo==="transferencia"),v={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let g=[];g=g.concat(Fe(d,p,n)),g=g.concat(Pa(a,p,n)),g=g.concat(_o(u,p,n,v)),g=g.concat(Fo(o,p,n));const b=Do(o,p,n,g);if(g=g.concat(b),g=g.concat(To(e,s.tramos_irpf,p,n)),g=g.concat(_a(i,p,n,r,t.resolverTramosIRPF)),s.usarInflacion&&r.length>0){const $=(o.find(S=>S.activo&&S.esCuentaPrincipal)||o.find(S=>S.activo)||{_id:"default"})._id;g=g.concat(zo(d,r,p,n,$));const h=o.filter(S=>S.activo&&(!n||n.length===0||n.includes(S._id))).reduce((S,w)=>S+Pe(w,s.dashboardStart),0);g=g.concat(jo(h,r,p,$))}return g.sort(($,f)=>$.fecha.localeCompare(f.fecha)),No(g,c,s).filter($=>$.fecha>=s.dashboardStart)}function Dn(t,a,e=null){const o=st(),n=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,c)=>r+Yt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?n:i[i.length-1].saldoAcum}function ko(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const s of o.tags||["sin_tag"])e.set(s,(e.get(s)||0)+Math.abs(o.cuantia));return e}function Tn(t,a){const e=[];let o=!1;for(let s=0;s<t.length;s++){const n=t[s],i=n.saldoAcum;i<0&&(s===0||t[s-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:n.fecha,saldo:i,mensaje:`Saldo negativo (${D(i)}) a partir del ${n.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:n.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${D(i)} < ${D(a)}) desde ${n.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:n.fecha,saldo:i,mensaje:`Recuperación del colchón el ${n.fecha} (${D(i)})`})))}return e}function zn(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=U(a.dashboardStart),s=U(a.dashboardEnd),n=Math.max(1,(s.getTime()-o.getTime())/(30.44*864e5));return e/n}function jn(t,a,e=st()){const o=new Set,s=a.map(r=>{const c=r.fechaInicialSaldo||"",l={};c&&c<=e&&(l[c]=r.saldoInicial||0);for(const p of r.historicoSaldos||[])p.fecha<=e&&(!c||p.fecha>=c)&&(l[p.fecha]=p.saldo);return Object.keys(l).forEach(p=>o.add(p)),l}),n={};for(const r of[...o].sort()){let c=0;for(let l=0;l<a.length;l++){const p=Object.entries(s[l]).filter(([d])=>d<=r);p.length>0?(p.sort(([d],[u])=>u.localeCompare(d)),c+=p[0][1]):c+=a[l].saldoInicial||0}n[r]=c}const i=[];for(const[r,c]of Object.entries(n).sort(([l],[p])=>l.localeCompare(p))){const l=t.filter(v=>v.fecha<=r),p=l.length>0?l[l.length-1].saldoAcum:null;if(p===null)continue;const d=c-p,u=p!==0?d/Math.abs(p)*100:0;i.push({cuenta:"Total",fecha:r,estimado:p,real:c,desv:d,pct:u})}return i}const qn=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:jn,detectarPuntosCriticos:Tn,mediaMensualGastos:zn},Symbol.toStringTag,{value:"Module"}));function De(t,a=new Date){const e=ot(a),o=new Date(a);o.setMonth(o.getMonth()+1);const s=ot(o),n=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Fe(n,{start:e,end:s}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function Nn(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+te(e.capital,e.tin,e.meses),0)}function Rn(t,a){return $t(t).tabla.filter(e=>!e.esAmortizacion&&e.fecha>=a).length}function Lo(t,a,e){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,s)=>o+te(s.capital,s.tin,s.meses)*Math.min(a,Rn(s,e)),0)}function Oo(t,a,e,o=new Date){if(a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0)return a.colchonFijo;const s=De(t,o),n=a.colchonMeses||6;return s*n+Lo(e,n,ot(o))}function kn(t,a,e,o,s){const i=[...a.colchonPuntos||[]].sort((l,p)=>l.fecha.localeCompare(p.fecha)).filter(l=>l.fecha<=o).pop();if(!i)return Oo(t,a,e,s);if(i.tipo==="fijo")return i.importe||0;const r=De(t,s),c=i.meses||6;return r*c+Lo(e,c,o)}function Fa(t,a,e,o,s,n=!1,i){const r=[...t.puntos||[]].sort((p,d)=>p.fecha.localeCompare(d.fecha)),c=r.filter(p=>p.fecha<=s).pop()||(n?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(De(a,i)+Nn(o))*(c.meses||1):0}function Ln(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function On(t,a){const e={};for(const o of a)e[o._id]=Yt(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=Ln(o)),{fecha:o.fecha,saldos:{...e}}))}function Hn(t,a,e,o,s,n,i){const r=[];for(const c of(t||[]).filter(l=>l.activo!==!1)){let l=!1;for(let p=0;p<a.length;p++){const d=a[p],u=Fa(c,o,s,n,d.fecha,!1,i);if(u<=0){l=!1;continue}const v=!c.cuentas||c.cuentas.length===0?d.saldoAcum:c.cuentas.reduce((g,b)=>{var $,f;return g+(((f=($=e[p])==null?void 0:$.saldos)==null?void 0:f[b])||0)},0);v<u&&!l?(l=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${D(v)} < ${D(u)} desde ${d.fecha}`})):v>=u&&l&&(l=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${d.fecha}`}))}}return r}const Bn=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Oo,calcColchonEnFecha:kn,calcGastoBasicoMensual:De,calcMargenEnFecha:Fa,detectarCrucesMargenes:Hn,saldosPorCuentaEnExtracto:On},Symbol.toStringTag,{value:"Module"}));function Gn(t){if(!t||t.showColchon===!1)return null;const a=t.colchonPuntos??[];return a.length>0?{nombre:"Colchón",puntos:[...a]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function Ho(t,a){return Ae(U(t),U(a))}const Vn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Bo(t,a){const[e,o,s]=t.split("-").map(Number),n=t.slice(0,4)===a.slice(0,4);return`${s} de ${Vn[o-1]}${n?"":` de ${e}`}`}function Go(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Un(t,a={}){const{hoy:e=st(),horizonteCritico:o=365,horizonteAviso:s=120,maximo:n=4,incertidumbre:i}=a,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:u=>`El ${u} el saldo proyectado baja a ${D(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:u=>`El ${u} el saldo queda en ${D(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:u=>u?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:u=>`El ${u} tendrías ${D(d.saldo)}, y el margen pide ${D(d.target)}.`});const c=new Map;for(const d of r){const u=c.get(d.id);(!u||d.fecha<u.fecha)&&c.set(d.id,d)}const l=[];for(const d of c.values()){const u=Ho(e,d.fecha);if(u<0||u>(d.gravedad==="critico"?o:s))continue;const v=i?i(u):0,g=v>0&&d.distancia<v;l.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:u,plazo:Go(u),titulo:d.titulo(g),detalle:d.detalle(Bo(d.fecha,e)),incierto:g})}const p={critico:0,aviso:1};return l.sort((d,u)=>d.fecha.localeCompare(u.fecha)||p[d.gravedad]-p[u.gravedad]),l.slice(0,n)}const Yn=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:Gn,construirAvisos:Un,describirPlazo:Go,diasEntreISO:Ho,fechaEnPalabras:Bo},Symbol.toStringTag,{value:"Module"})),Wn=30.44*864e5;function Vo(t){const a=t.getFullYear(),e=t.getMonth();return{desde:ot(new Date(a,e,1)),hasta:ot(new Date(a,e,xa(a,e)))}}function Uo(t){const[a,e]=t.split("-").map(Number);return Vo(new Date(a,e-1,1))}function Kn(t,a){return Math.max(1,(U(a).getTime()-U(t).getTime())/Wn)}const Jn=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),Jt=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function Qn(t,a){const e=new Map(a.map(n=>[n._id,n.clasificacion]));let o=0,s=0;for(const n of t){if(n.tipo!=="gasto"||n.sourceType!=="expense")continue;const i=e.get(n.sourceId??"");i!==null&&(i==="deseo"?s+=Math.abs(n.cuantia):o+=Math.abs(n.cuantia))}return{basicos:o,deseo:s}}function Xn(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=u=>u.sourceType==="loan"&&u.tipo==="gasto",s=a.loanIdsIniciados,n=Jt(t.filter(u=>u.tipo==="ingreso")),i=Jt(t.filter(u=>o(u)&&(!s||s.has(u.sourceId??"")))),r=Jt(t.filter(u=>o(u)&&a.hipotecaIds.has(u.sourceId??""))),c=Jt(t.filter(u=>u.sourceType==="loan-amort")),l=Jt(t.filter(u=>u.sourceType==="account-interest")),{basicos:p,deseo:d}=Qn(t,a.expenses);return{ingresos:n/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:c/e,gastosBasicos:p/e,gastosDeseo:d/e,gastosTotales:(i+p+d)/e,intereses:l/e}}function Yo(t,a){return t.reduce((e,o)=>{const s=$t(o).tabla.filter(n=>!n.esAmortizacion&&n.fecha<=a);return e+(s.length>0?s[s.length-1].capitalPendiente:o.capital||0)},0)}function Zn(t,a,e,o){const s=t.filter(l=>l.activo&&!l.simulacion&&(l.fechaInicio||"")<=e),n=s.reduce((l,p)=>{if((p.amortizaciones||[]).filter(g=>g.fecha>=a&&g.fecha<=e).length===0)return l;const u=$t(p).totalIntereses,v=$t({...p,amortizaciones:(p.amortizaciones||[]).filter(g=>g.fecha<a||g.fecha>e)}).totalIntereses;return l+Math.max(0,v-u)},0),i=s.filter(l=>l.mostrarFechaFinEnDashboard!==!1).map(l=>({loan:l,fechaFin:$t(l).fechaFin})).filter(l=>!!l.fechaFin&&l.fechaFin>=a&&l.fechaFin<=e),r=s.map(l=>$t(l).tabla),c=l=>{const{desde:p,hasta:d}=Uo(l);return r.reduce((u,v)=>{const g=v.find(b=>!b.esAmortizacion&&b.fecha>=p&&b.fecha<=d);return u+(g?g.cuota:0)},0)};return{deudaInicio:Yo(s,a),deudaFin:Yo(s,e),ahorroIntereses:n,ahorroInteresesMes:o>0?n/o:0,cuotasInicio:c(a.slice(0,7)),cuotasFin:c(e.slice(0,7)),finEnPeriodo:i}}function ti(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:Jt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function Wo(t,a=new Set,e="desglosado"){if(a.size===0)return ko(t,"gasto");const o=new Map;for(const s of t){if(s.tipo!=="gasto")continue;const n=s.tags||[],i=n.filter(l=>a.has(l)),r=n.filter(l=>!a.has(l)),c=e==="porgrupos"&&i.length>0?i:r;for(const l of c)o.set(l,(o.get(l)||0)+Math.abs(s.cuantia))}return o}function ei(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...Wo(t,a.grupoTags,a.modo).entries()].filter(([s])=>!e||e.size===0||e.has(s)).map(([s,n])=>({tag:s,total:n/o})).sort((s,n)=>n.total-s.total)}function ai(t,a){const e=a.reduce((o,s)=>o+Yt(s),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:Jt(t.filter(o=>o.tipo==="gasto")),totalIngresos:Jt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function oi(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function si(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function ni(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function ii(t,a){if(t.length===0)return[];const e=l=>a==="mes"?l.slice(0,7):l.slice(0,4),o=l=>a==="mes"?`${l}-01`:`${l}-01-01`,s=t[0],n=s.delta??(s.tipo==="ingreso"?Math.abs(s.cuantia):-Math.abs(s.cuantia));let i=(s.saldoAcum??0)-n;const r=[];let c=null;for(const l of t){const p=e(l.fecha),d=l.saldoAcum??i;(!c||c.periodo!==p)&&(c&&(i=c.cierre),c={periodo:p,inicio:o(p),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(c)),c.cierre=d,d>c.maximo&&(c.maximo=d),d<c.minimo&&(c.minimo=d),c.eventos+=1}return r}const ri=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:ii,cuentasVisibles:oi,gastoPorTagOrdenado:ei,idsHipoteca:si,idsPrestamosIniciados:ni,interesesPorCuenta:ti,mesesDelPeriodo:Kn,metricasFlujo:Xn,rangoMes:Uo,rangoMesDe:Vo,resumenPrestamosPeriodo:Zn,sinTransferencias:Jn,sumarGastosPorTag:Wo,totalesPeriodo:ai},Symbol.toStringTag,{value:"Module"}));function Ko(t){return t.imprevisto===!0&&t.importeCts<0&&t.tipo!=="transferencia"&&!t.estimacionId}const ci=["luz","electricidad","gas","agua","internet","fibra","movil","telefono","telefonia","seguro","seguros","comunidad","alquiler","ibi","basura","basuras","suscripcion","suscripciones","recibo","recibos","factura","facturas","suministro","suministros","colegio","guarderia","academia","gimnasio","cuota","mutua","hipoteca","netflix","spotify","hbo","disney","prime","icloud","youtube","iberdrola","endesa","naturgy","repsol","movistar","vodafone","orange","digi","yoigo","masmovil","pepephone","calefaccion","alarma","parking","garaje"],Jo=t=>t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase(),li=new Set(ci);function di(t){return Jo([t.concepto??"",...t.tags??[]].join(" ")).split(/[^a-z0-9]+/).some(e=>li.has(e))}function Te(t){return t?t.esFactura===!0?!0:t.esFactura===!1||(t.tipoFrecuencia??"mensual")!=="mensual"?!1:di(t)?!0:!!t.diaPago&&t.diaPago!==""&&(t.basico===!0||t.clasificacion==="necesidad"):!1}const ui=new Set(["transfer-out","transfer-in","aportacion-out","aportacion-in"]),pi=new Set(["account-interest"]),Qo=t=>t.sourceType==="nomina"&&t.tipo==="gasto",pt=t=>Math.round(Math.abs(t)*100);function Xe(t,a,e){const o=new Map;for(const r of t){const c=r.sourceId??r.concepto,l=o.get(c)??{concepto:e(r),total:0,vencido:0,fechas:[]},p=pt(r.cuantia);l.total+=p,r.fecha<=a&&(l.vencido+=p),l.fechas.push(r.fecha),o.set(c,l)}const s=[...o.entries()].map(([r,c])=>({id:r,concepto:c.concepto,total:c.total/100,vencido:c.vencido/100,fechas:c.fechas.sort()})).sort((r,c)=>c.total-r.total||r.concepto.localeCompare(c.concepto)),n=[...o.values()].reduce((r,c)=>r+c.total,0),i=[...o.values()].reduce((r,c)=>r+c.vencido,0);return{total:n/100,vencido:i/100,pendiente:(n-i)/100,partidas:s}}function Ze(t,a,e,o,s={}){const n=new Map(a.map(y=>[y._id,y])),i=new Map(e.map(y=>[y._id,y])),r=t.filter(y=>!ui.has(y.sourceType??"")&&!pi.has(y.sourceType??"")),c=r.filter(y=>y.tipo==="ingreso").reduce((y,E)=>y+pt(E.cuantia),0),l=r.filter(Qo).reduce((y,E)=>y+pt(E.cuantia),0),p=[],d=[],u=[],v=[];for(const y of r){if(y.tipo!=="gasto"||Qo(y))continue;const E=y.sourceType==="expense"?n.get(y.sourceId??""):void 0;y.sourceType==="loan"||y.sourceType==="loan-amort"?p.push(y):E!=null&&E.imprevisto?u.push(y):E&&Te(E)?d.push(y):v.push(y)}for(const y of s.movimientos??[]){if(!Ko(y))continue;const E=Jo(y.concepto).replace(/\s+/g," ").trim();u.push({fecha:y.fecha,concepto:y.concepto,cuantia:y.importeCts/100,tipo:"gasto",tags:[],cuenta:"",sourceId:`mov:${E}`,sourceType:"movimiento"})}const g=y=>{var E;return((E=n.get(y.sourceId??""))==null?void 0:E.concepto)??y.concepto},b=Xe(p,o,y=>{var E;return((E=i.get(y.sourceId??""))==null?void 0:E.nombre)??y.concepto}),$=Xe(d,o,g),f=Xe(v,o,g),h=Xe(u,o,g),S=c-l,w=pt(b.total)+pt($.total)+pt(f.total)+pt(h.total),I=s.estimacionImprevistos??null,A=I!==null?Math.max(0,pt(I)-pt(h.total)):0,M=S/100,C=(S-w-A)/100;return{ingresosNetos:M,prestamos:b,facturas:$,otros:f,imprevistos:h,gastosTotales:w/100,estimacionImprevistos:I,reservaImprevistos:A/100,margen:C,margenPct:M>0?C/M*100:null}}function mi(t,a){const[e,o,s]=t.split("-").map(Number),[n,i,r]=a.split("-").map(Number);if(![e,o,s,n,i,r].every(Number.isFinite)||a<t)return 1;const c=new Date(n,i-1,r+1);let l=(c.getFullYear()-e)*12+(c.getMonth()+1-o);const p=g=>{const b=new Date(e,o-1+g,1),$=new Date(b.getFullYear(),b.getMonth()+1,0).getDate();return new Date(b.getFullYear(),b.getMonth(),Math.min(s,$))};p(l).getTime()>c.getTime()&&(l-=1);const d=p(l),u=Math.round((c.getTime()-d.getTime())/864e5),v=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();return Math.max(.03225806451612903,l+u/v)}function Ft(t,a){const[e,o]=t.split("-").map(Number),[s,n]=a.split("-").map(Number);if(![e,o,s,n].every(Number.isFinite))return[];const i=[];for(let r=e,c=o;(r<s||r===s&&c<=n)&&(i.push(`${r}-${String(c).padStart(2,"0")}`),!(i.length>240));c===12?(c=1,r++):c++);return i}function mt(t,a){const[e,o]=t.split("-").map(Number),s=new Date(e,o-1+a,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function Da(t,a,e,o,s,n={}){var c,l;const i=new Map(o.map(p=>[p,[]]));for(const p of t)(c=i.get(p.fecha.slice(0,7)))==null||c.push(p);const r=new Map(o.map(p=>[p,[]]));for(const p of n.movimientos??[])(l=r.get(p.fecha.slice(0,7)))==null||l.push(p);return o.map(p=>{var d;return{mes:p,desglose:Ze(i.get(p)??[],a,e,s,{movimientos:r.get(p),estimacionImprevistos:n.estimacionPorMes?n.estimacionPorMes(p):((d=n.estimacion)==null?void 0:d.mes)===p?n.estimacion.importe:null})}})}function ta(t){const a=new Map;for(const n of t)for(const i of n.partidas){const r=a.get(i.id)??{concepto:i.concepto,total:0,vencido:0,fechas:[]};r.total+=pt(i.total),r.vencido+=pt(i.vencido),r.fechas.push(...i.fechas),a.set(i.id,r)}const e=[...a.entries()].map(([n,i])=>({id:n,concepto:i.concepto,total:i.total/100,vencido:i.vencido/100,fechas:i.fechas.sort()})).sort((n,i)=>i.total-n.total||n.concepto.localeCompare(i.concepto)),o=[...a.values()].reduce((n,i)=>n+i.total,0),s=[...a.values()].reduce((n,i)=>n+i.vencido,0);return{total:o/100,vencido:s/100,pendiente:(o-s)/100,partidas:e}}function ue(t){const a=ta(t.map(p=>p.prestamos)),e=ta(t.map(p=>p.facturas)),o=ta(t.map(p=>p.otros)),s=ta(t.map(p=>p.imprevistos)),n=t.reduce((p,d)=>p+Math.round(d.ingresosNetos*100),0),i=pt(a.total)+pt(e.total)+pt(o.total)+pt(s.total),r=t.reduce((p,d)=>p+pt(d.reservaImprevistos),0),c=n/100,l=(n-i-r)/100;return{ingresosNetos:c,prestamos:a,facturas:e,otros:o,imprevistos:s,gastosTotales:i/100,estimacionImprevistos:null,reservaImprevistos:r/100,margen:l,margenPct:c>0?l/c*100:null}}function Xo(t){const a=ue(t),e=t.length;if(e<=1)return a;const o=g=>Math.round(g*100/e)/100,s=g=>{const b=o(g.total),$=o(g.vencido);return{total:b,vencido:$,pendiente:Math.round((b-$)*100)/100,partidas:g.partidas.map(f=>({...f,total:o(f.total),vencido:o(f.vencido)}))}},n=s(a.prestamos),i=s(a.facturas),r=s(a.otros),c=s(a.imprevistos),l=pt(o(a.ingresosNetos)),p=pt(n.total)+pt(i.total)+pt(r.total)+pt(c.total),d=pt(o(a.reservaImprevistos)),u=l/100,v=(l-p-d)/100;return{ingresosNetos:u,prestamos:n,facturas:i,otros:r,imprevistos:c,gastosTotales:p/100,estimacionImprevistos:null,reservaImprevistos:d/100,margen:v,margenPct:u>0?v/u*100:null}}function Zo(t,a,e){const o={mediaMensual:0,total:0,meses:0,desde:null,hasta:null};if(!e)return o;const s=mt(a,-12),n=mt(a,-1),i=e.slice(0,7)>s?e.slice(0,7):s;if(i>n)return o;const r=Ft(i,n),c=t.filter(l=>l.mes>=i&&l.mes<=n).reduce((l,p)=>l+pt(p.desglose.imprevistos.total),0);return{mediaMensual:Math.round(c/r.length)/100,total:c/100,meses:r.length,desde:i,hasta:n}}function qt(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function ts(t){let a=null;for(const e of t.movimientos)(!a||e.fecha<a)&&(a=e.fecha);for(const e of t.gastos)e.imprevisto&&e.fechaInicio&&(!a||e.fechaInicio<a)&&(a=e.fechaInicio);return a}function Ta(t,a){const e=Ft(mt(t,-12),mt(t,-1)),o=a.generarExtracto(`${e[0]}-01`,qt(e[e.length-1])),s=Da(o,a.gastos,a.prestamos,e,a.hoy,{movimientos:a.movimientos});return Zo(s,t,ts(a))}function es(t,a){const e=t.hoy.slice(0,7),o=Ta(e,t),s=t.movimientos.filter(i=>i.fecha.startsWith(e));return{desglose:Ze(a,t.gastos,t.prestamos,t.hoy,{movimientos:s,estimacionImprevistos:o.meses>0?o.mediaMensual:null}),estimacion:o}}const fi=Object.freeze(Object.defineProperty({__proto__:null,desgloseDelMes:Ze,desglosePorMeses:Da,esFactura:Te,esMovimientoImprevisto:Ko,estimacionImprevistosPara:Ta,estimarImprevistos:Zo,finDeMes:qt,mediaDeDesgloses:Xo,mesEnCurso:es,mesesDeCalendario:mi,mesesEntre:Ft,primerDatoDeSeguimiento:ts,sumarDesgloses:ue,sumarMesesA:mt},Symbol.toStringTag,{value:"Module"}));function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Qt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${m(D(t))}</span>`}function gi(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function as(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${m(a)}</span>`).join(" ")}const vi=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function xt(t){const[a,e]=t.split("-").map(Number);return`${vi[e-1]} ${a}`}function H(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function St(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function Lt(t=document){var o;const a=t.getElementById("modal-content");if(!a)return null;const e=a.cloneNode(!1);return a.replaceWith(e),(o=t.getElementById("modal-box"))==null||o.classList.remove("modal-box--ancho"),e}function k(t,a,e){t.addEventListener("click",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(a);s&&t.contains(s)&&e(s,o)})}function tt(t,a,e){t.addEventListener("change",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(a);s&&t.contains(s)&&e(s,o)})}function Dt(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function os(t,a){const e=parseFloat(Dt(t,a));return Number.isFinite(e)?e:0}const It={prestamos:"#9085e9",facturas:"#d95926",otros:"#3987e5",imprevistos:"#d55181"},bi=t=>String(Number(t.slice(8,10)));function ss(t,a){if(t.partidas.length===0)return"";const e=t.partidas.map(o=>{const s=a.meses!==void 0||a.media?`${o.fechas.length} ${o.fechas.length===1?"cargo":"cargos"}`:o.fechas.length>4?`${o.fechas.length} cargos`:`día ${o.fechas.map(bi).join(", ")}`;return`<div class="mes-fila${a.meses===void 0&&!a.media&&o.fechas.every(i=>i<=a.hoy)?" mes-fila--hecha":""}">
        <span class="mes-fila-nombre" title="${m(o.concepto)}">${m(o.concepto)}</span>
        <span class="mes-fila-dia">${m(s)}</span>
        <span class="mes-fila-importe">${m(D(o.total))}</span>
      </div>`}).join("");return`<details class="mes-detalle"${a.abierto?" open":""}><summary>${t.partidas.length} ${t.partidas.length===1?"concepto":"conceptos"}</summary>${e}</details>`}function ea(t,a,e,o,s,n,i=""){const r=e.total>0?Math.min(100,e.vencido/e.total*100):0;let c;e.total<=0?c="<span>Nada previsto</span>":o.media&&n?c=`<span>Al mes · <strong>${m(D(o.media.acumulado[n].total))}</strong> en ${o.media.meses} meses</span>`:o.meses!==void 0?c=`<span>Media <strong>${m(D(e.total/Math.max(1,o.meses)))}</strong>/mes</span>`:e.pendiente<=.004?c="<span>Ya cargado todo</span>":c=`<span>Quedan <strong>${m(D(e.pendiente))}</strong></span><span>cargado ${m(D(e.vencido))}</span>`;const l=o.meses!==void 0||o.media?"":`<div class="mes-barra" role="img" aria-label="${Math.round(r)} % ya cargado"><span style="width:${r.toFixed(1)}%"></span></div>`;return`<section class="mes-bloque ${s}" aria-label="${m(t)}">
    <div class="mes-bloque-titulo" title="${m(a)}"><span class="mes-punto" aria-hidden="true"></span>${m(t)}</div>
    <div class="mes-bloque-total">${m(D(e.total))}</div>
    ${l}
    <div class="mes-bloque-pie">${c}</div>
    ${i}
    ${ss(e,o)}
  </section>`}function hi(t,a){const e=t.imprevistos,o=a.estimacion;if(!(a.meses===void 0&&!a.media&&o&&o.meses>0)){const p=t.reservaImprevistos>0?`<div class="mes-bloque-pie mes-bloque-nota"><span>+ ${m(D(t.reservaImprevistos))}${a.media?"/mes":""} reservados para los que aún no han llegado</span></div>`:"";return ea("Imprevistos","Gastos marcados como imprevisto: en el gasto o en el movimiento real",e,a,"mes-bloque--imprevistos","imprevistos",p)}const n=o.mediaMensual,i=n>0?Math.min(100,e.total/n*100):e.total>0?100:0,r=e.total>n+.004,c=r?`<span>Te has pasado <strong>${m(D(e.total-n))}</strong></span>`:t.reservaImprevistos>0?`<span>Reservado <strong>${m(D(t.reservaImprevistos))}</strong></span>`:"<span>Sin imprevistos previstos</span>",l=`Estimación ${D(n)}/mes · media de ${o.meses} ${o.meses===1?"mes":"meses"}`;return`<section class="mes-bloque mes-bloque--imprevistos${r?" es-excedido":""}" aria-label="Imprevistos">
    <div class="mes-bloque-titulo" title="Gastos marcados como imprevisto: en el gasto o en el movimiento real. La estimación es la media de lo marcado en los últimos 12 meses."><span class="mes-punto" aria-hidden="true"></span>Imprevistos</div>
    <div class="mes-bloque-total">${m(D(e.total))}<span class="mes-bloque-de"> de ${m(D(n))}</span></div>
    <div class="mes-barra" role="img" aria-label="${Math.round(i)} % de la estimación"><span style="width:${i.toFixed(1)}%"></span></div>
    <div class="mes-bloque-pie">${c}</div>
    <div class="mes-bloque-pie mes-bloque-nota"><span>${m(l)}</span></div>
    ${ss(e,a)}
  </section>`}function aa(t,a){const e=t.margen>=0,o=t.margenPct===null?"":` · ${Math.abs(t.margenPct).toFixed(0)} % de lo que entra`,s=a.meses!==void 0&&a.meses>1?`<div class="mes-bloque-pie"><span>Media ${e?"+":"−"}${m(D(Math.abs(t.margen)/a.meses))}/mes</span></div>`:"",n=t.reservaImprevistos>0?`<div class="mes-bloque-pie"><span>${a.media?"Incluye":"Ya descontados"} ${m(D(t.reservaImprevistos))}${a.media?"/mes":""} para imprevistos</span></div>`:"",i=a.media?`<div class="mes-bloque-pie"><span>En ${a.media.meses} meses: <strong>${a.media.acumulado.margen>=0?"+":"−"}${m(D(Math.abs(a.media.acumulado.margen)))}</strong></span></div>`:"";return`<div class="mes-rejilla">
      ${ea("Préstamos","Cuotas y amortizaciones previstas",t.prestamos,a,"mes-bloque--prestamos","prestamos")}
      ${ea("Facturas","Gastos fijos y recurrentes: recibos, alquiler, seguros, suscripciones. Se puede marcar a mano en cada gasto.",t.facturas,a,"mes-bloque--facturas","facturas")}
      ${ea("Otros gastos","El resto de gastos previstos: compra, ocio, puntuales",t.otros,a,"mes-bloque--otros","otros")}
      ${hi(t,a)}
      <section class="mes-bloque mes-bloque--margen ${e?"es-positivo":"es-negativo"}" aria-label="Margen de ahorro esperado">
        <div class="mes-bloque-titulo" title="Ingresos netos menos préstamos, facturas, otros gastos e imprevistos, y menos lo que queda por reservar para imprevistos">Margen de ahorro</div>
        <div class="mes-bloque-total">${e?"+":"−"}${m(D(Math.abs(t.margen)))}</div>
        <div class="mes-bloque-pie"><span>${e?"Te sobra":"Te falta"}${m(o)}</span></div>
        ${s}
        ${i}
        ${n}
        <div class="mes-bloque-pie"><span>Gastos previstos: ${m(D(t.gastosTotales))}${a.media?"/mes":""}</span></div>
      </section>
    </div>`}function yi(t,a,e,o=null){return`<div class="card mes-card" data-mes-card>
    <div class="mes-cabecera">
      <div class="card-title" style="margin:0">Este mes · ${m(xt(a))}</div>
      <div class="mes-cabecera-der">
        <span class="mes-ingresos">Entran <strong>${m(D(t.ingresosNetos))}</strong> netos</span>
        <button type="button" class="btn-secondary btn-sm" data-mes-historico title="Meses anteriores y previsión de los próximos">Otros meses</button>
      </div>
    </div>
    ${aa(t,{hoy:e,estimacion:o})}
  </div>`}const lt={preset:"6",vista:"mes"},ns=36,$i=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],za=t=>`${$i[Number(t.slice(5,7))-1]} ${t.slice(2,4)}`,xi=new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",notation:"compact",maximumFractionDigits:1}),ze=t=>`${t>=0?"+":"−"}${D(Math.abs(t))}`;let je=[];function Ii(){for(const t of je)try{t.destroy()}catch{}je=[]}function wi(t,a,e,o){const s=a.slice(0,4);switch(t){case"anio":return Ft(`${s}-01`,a);case"aniocompleto":return Ft(`${s}-01`,`${s}-12`);case"f3":case"f6":case"f12":return Ft(mt(a,1),mt(a,Number(t.slice(1))));case"personalizado":if(e&&o){const[n,i]=e<=o?[e,o]:[o,e],r=Ft(n,i);return n>a?r.slice(0,ns):r.slice(-ns)}return Ft(mt(a,-5),a);default:{const n=Number(t)||6;return Ft(mt(a,-(n-1)),a)}}}function Ci(t){var q;const a=t.doc??document,e=a.getElementById("modal-overlay"),o=Lt(a);if(!e||!o)return null;const s=o;(q=a.getElementById("modal-box"))==null||q.classList.add("modal-box--ancho");const n=t.hoy.slice(0,7);let i=[],r=mt(n,-1);const c=t.movimientos??[];let l=null;try{l=Ta(n,{...t,movimientos:c})}catch(F){console.error("[Otros meses] No se ha podido estimar los imprevistos:",F)}function p(){const F=wi(lt.preset,n,lt.desde,lt.hasta);if(F.length===0){i=[];return}const R=F[F.length-1],[j,N]=R.split("-").map(Number),L=`${R}-${String(new Date(j,N,0).getDate()).padStart(2,"0")}`,G=t.generarExtracto(`${F[0]}-01`,L);if(i=Da(G,t.gastos,t.prestamos,F,t.hoy,{movimientos:c,estimacionPorMes:B=>l&&l.meses>0&&B>=n?l.mediaMensual:null}),!F.includes(r)){const B=F.filter(V=>V<n);r=B.length?B[B.length-1]:F[0]}}function d(){const F=(j,N)=>`<button type="button" class="period-btn${lt.preset===j?" active":""}" data-hist-preset="${j}" aria-pressed="${lt.preset===j}">${N}</button>`,R=lt.preset==="personalizado"?`<div class="hist-rango">
            <label>Desde <input class="form-input" type="month" data-hist-desde value="${m(lt.desde??"")}"/></label>
            <label>Hasta <input class="form-input" type="month" data-hist-hasta value="${m(lt.hasta??n)}"/></label>
          </div>`:"";return`<div class="hist-periodos">
        <div class="hist-filtros" role="group" aria-label="Periodo pasado">
          <span class="hist-filtros-etq">Pasado</span>
          ${F("3","3 meses")}${F("6","6 meses")}${F("12","12 meses")}${F("anio","Este año")}
        </div>
        <div class="hist-filtros" role="group" aria-label="Previsión">
          <span class="hist-filtros-etq">Previsión</span>
          ${F("f3","Próximos 3")}${F("f6","Próximos 6")}${F("f12","Próximos 12")}${F("aniocompleto",`Todo ${n.slice(0,4)}`)}
          ${F("personalizado","Elegir…")}
        </div>
      </div>${R}`}function u(){return i.map(({mes:F,desglose:R})=>{const j=lt.vista==="mes"&&F===r,N=F===n,L=F>n;return`<button type="button" class="hist-ficha${j?" activa":""}${L?" es-futuro":""}" data-hist-mes="${F}" aria-pressed="${j}"
            title="${m(xt(F))}${N?" (en curso)":L?" (previsión)":""}: gastos ${m(D(R.gastosTotales))}, margen ${m(ze(R.margen))}">
          <span class="hist-ficha-mes">${m(za(F))}${N?"*":""}</span>
          <span class="hist-ficha-margen ${R.margen>=0?"es-positivo":"es-negativo"}">${m(ze(R.margen))}</span>
        </button>`}).join("")}function v(){if(i.length===0)return"";if(lt.vista==="media"){const N=i.map(V=>V.desglose),L=Xo(N),G=ue(N),B=`${xt(i[0].mes)} – ${xt(i[i.length-1].mes)}`;return`<div class="hist-detalle-cab">
          <div><div class="card-title" style="margin:0">Media mensual · ${i.length} ${i.length===1?"mes":"meses"}</div>
          <div class="text-sm" style="color:var(--text3)">${m(B)}${g()}</div></div>
          <span class="mes-ingresos">Entran <strong>${m(D(L.ingresosNetos))}</strong> netos al mes</span>
        </div>
        ${aa(L,{hoy:t.hoy,media:{meses:i.length,acumulado:G}})}`}if(lt.vista==="acumulado"){const N=ue(i.map(G=>G.desglose)),L=`${xt(i[0].mes)} – ${xt(i[i.length-1].mes)}`;return`<div class="hist-detalle-cab">
          <div><div class="card-title" style="margin:0">Acumulado · ${i.length} ${i.length===1?"mes":"meses"}</div>
          <div class="text-sm" style="color:var(--text3)">${m(L)}${g()}</div></div>
          <span class="mes-ingresos">${i.every(G=>G.mes>n)?"Entrarán":"Entran"} <strong>${m(D(N.ingresosNetos))}</strong> netos</span>
        </div>
        ${aa(N,{hoy:t.hoy,meses:i.length})}`}const F=i.find(N=>N.mes===r)??i[i.length-1],R=F.mes===n,j=F.mes>n;return`<div class="hist-detalle-cab">
        <div class="card-title" style="margin:0">${m(xt(F.mes))}${R?" · en curso":j?" · previsión":""}</div>
        <span class="mes-ingresos">${j?"Entrarán":R?"Entran":"Entraron"} <strong>${m(D(F.desglose.ingresosNetos))}</strong> netos</span>
      </div>
      ${aa(F.desglose,{hoy:t.hoy,abierto:!0,estimacion:R||j?l:null})}`}function g(){const F=i.filter(N=>N.mes>n).length,R=i.some(N=>N.mes===n);if(F===i.length)return" · todo previsión";const j=[R?"incluye el mes en curso":"",F?`${F} ${F===1?"mes":"meses"} de previsión`:""].filter(Boolean);return j.length?` · ${j.join(" y ")}`:""}function b(){if(i.length===0)return{gastos:"",ahorro:""};const F=ue(i.map(N=>N.desglose)),R=i.reduce((N,L)=>L.desglose.margen<N.desglose.margen?L:N),j=i.reduce((N,L)=>L.desglose.gastosTotales>N.desglose.gastosTotales?L:N);return{gastos:`Gastos por mes, de ${xt(i[0].mes)} a ${xt(i[i.length-1].mes)}. El mes de más gasto es ${xt(j.mes)}, con ${D(j.desglose.gastosTotales)}.`,ahorro:`Margen de ahorro de cada mes y acumulado. En el periodo: ${ze(F.margen)}. El peor mes es ${xt(R.mes)}, con ${ze(R.desglose.margen)}.`}}function $(){Ii(),p();const F=b(),R=i.length?ue(i.map(N=>N.desglose)):null,j=typeof globalThis.Chart=="function";s.innerHTML=`
      <div class="modal-title">Otros meses</div>
      ${d()}
      ${i.length===0?'<p class="text-sm" style="margin-top:14px">Elige un mes de inicio anterior o igual al de fin.</p>':`
      <section class="hist-grafica">
        <div class="hist-grafica-cab">
          <h3 class="hist-titulo">Gastos por mes</h3>
          <span class="text-sm" style="color:var(--text3)">Toca un mes para ver su desglose</span>
        </div>
        <div class="hist-estimacion">${l&&l.meses>0?`<span class="mes-punto" style="--grupo:${It.imprevistos}" aria-hidden="true"></span>Imprevistos estimados: <strong>${m(D(l.mediaMensual))}/mes</strong> · media de lo marcado en ${l.meses} ${l.meses===1?"mes":"meses"} (${m(D(l.total))} en total)`:"Marca gastos o movimientos como «Imprevisto» y aquí aparecerá cuánto suelen costarte al mes."}
        </div>
        ${j?`<div class="hist-lienzo"><canvas data-hist-gastos role="img" aria-label="${m(F.gastos)}"></canvas></div>`:""}
      </section>
      <section class="hist-grafica">
        <div class="hist-grafica-cab">
          <h3 class="hist-titulo">Impacto en el ahorro</h3>
          <span class="hist-total ${R&&R.margen>=0?"es-positivo":"es-negativo"}">Acumulado ${m(ze((R==null?void 0:R.margen)??0))}</span>
        </div>
        ${j?`<div class="hist-lienzo hist-lienzo--bajo"><canvas data-hist-ahorro role="img" aria-label="${m(F.ahorro)}"></canvas></div>`:""}
      </section>
      <div class="hist-fichas" role="group" aria-label="Meses del periodo">${u()}</div>
      ${i.some(N=>N.mes===n)?'<div class="text-sm" style="color:var(--text3);margin-top:4px">* Mes en curso: incluye lo que queda por cargar.</div>':""}
      ${i.some(N=>N.mes>n)?`<div class="text-sm" style="color:var(--text3);margin-top:4px">Los meses de la zona «Previsión» salen de lo que tienes configurado (gastos, nóminas y préstamos)${l&&l.meses>0?`, y cada uno reserva ${m(D(l.mediaMensual))} para imprevistos`:""}.</div>`:""}
      <div class="hist-filtros hist-vista" role="group" aria-label="Qué desglose ver">
        <button type="button" class="period-btn${lt.vista==="mes"?" active":""}" data-hist-vista="mes" aria-pressed="${lt.vista==="mes"}">Mes seleccionado</button>
        <button type="button" class="period-btn${lt.vista==="media"?" active":""}" data-hist-vista="media" aria-pressed="${lt.vista==="media"}">Media del periodo</button>
        <button type="button" class="period-btn${lt.vista==="acumulado"?" active":""}" data-hist-vista="acumulado" aria-pressed="${lt.vista==="acumulado"}">Acumulado del periodo</button>
      </div>
      <div data-hist-detalle>${v()}</div>`}`,j&&i.length>0&&T()}function f(F){r=F,lt.vista="mes";const R=s.querySelector(".hist-fichas");R&&(R.innerHTML=u()),s.querySelectorAll("[data-hist-vista]").forEach(N=>{const L=N.dataset.histVista==="mes";N.classList.toggle("active",L),N.setAttribute("aria-pressed",String(L))});const j=s.querySelector("[data-hist-detalle]");j&&(j.innerHTML=v()),P()}const h="#8b98ad",S="rgba(255,255,255,0.06)",w="#141b27",I="#2ee6a8",A="#ff6b6b",M="#c9d3e3",C=(F,R)=>{const j=parseInt(F.slice(1),16);return`rgba(${j>>16&255}, ${j>>8&255}, ${j&255}, ${R})`},y=(F,R,j=1)=>{var N;return lt.vista!=="mes"||((N=i[R])==null?void 0:N.mes)===r?C(F,j):C(F,j*.4)},E=.38,_=()=>i.some(F=>F.desglose.reservaImprevistos>0);function P(){const[F,R]=je;if(F){const j=[It.prestamos,It.facturas,It.otros,It.imprevistos,It.imprevistos],N=[1,1,1,1,E];F.data.datasets.forEach((L,G)=>L.backgroundColor=i.map((B,V)=>y(j[G],V,N[G]))),F.update("none")}if(R){const j=R.data.datasets[0];j.backgroundColor=i.map((N,L)=>y(N.desglose.margen>=0?I:A,L)),R.update("none")}}const x=F=>({position:"top",align:"start",labels:{color:"#c9d3e3",boxWidth:10,boxHeight:10,usePointStyle:!0,font:{size:12},generateLabels:R=>R.data.datasets.map((j,N)=>({text:j.label??"",fillStyle:F[N],strokeStyle:F[N],lineWidth:0,pointStyle:"rectRounded",fontColor:"#c9d3e3",hidden:!R.isDatasetVisible(N),datasetIndex:N}))}}),z={id:"zonaPrevision",beforeDatasetsDraw(F){const R=i.findIndex(B=>B.mes>n);if(R<0)return;const{ctx:j,chartArea:N,scales:L}=F,G=R===0?N.left:(L.x.getPixelForValue(R-1)+L.x.getPixelForValue(R))/2;j.save(),j.fillStyle="rgba(255,255,255,0.035)",j.fillRect(G,N.top,N.right-G,N.bottom-N.top),j.strokeStyle="rgba(255,255,255,0.18)",j.setLineDash([3,3]),j.beginPath(),j.moveTo(G,N.top),j.lineTo(G,N.bottom),j.stroke(),j.setLineDash([]),j.fillStyle=h,j.font="11px system-ui, sans-serif",j.textBaseline="bottom",j.fillText("Previsión",G+6,N.bottom-4),j.restore()}};function T(){const F=globalThis.Chart,R=i.map(Y=>Y.mes===n?`${za(Y.mes)}*`:za(Y.mes)),j=Y=>({x:{stacked:Y,grid:{display:!1},ticks:{color:h,font:{size:11}},border:{color:S}},y:{stacked:Y,grid:{color:S},border:{display:!1},ticks:{color:h,font:{size:11},maxTicksLimit:5,callback:K=>xi.format(K)}}}),L={responsive:!0,maintainAspectRatio:!1,animation:{duration:250},interaction:{mode:"index",intersect:!1},onClick:(Y,K,Z)=>{const W=Z.getElementsAtEventForMode(Y,"index",{intersect:!1},!0);W.length>0&&i[W[0].index]&&f(i[W[0].index].mes)},onHover:(Y,K)=>{var W;const Z=(W=Y.native)==null?void 0:W.target;Z&&(Z.style.cursor=K.length?"pointer":"default")}},G=Y=>({backgroundColor:"#0d131d",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#eef3fb",bodyColor:"#c9d3e3",footerColor:"#8b98ad",padding:10,callbacks:{title:K=>xt(i[K[0].dataIndex].mes),label:K=>` ${K.dataset.label}: ${D(K.raw)}`,...Y?{footer:K=>Y(K[0].dataIndex)}:{}}}),B=s.querySelector("[data-hist-gastos]");if(B){const Y=(K,Z,W,gt,vt=1)=>({label:K,data:W,backgroundColor:i.map((Gt,ha)=>y(Z,ha,vt)),borderColor:w,borderWidth:{top:2},borderSkipped:"bottom",borderRadius:gt?{topLeft:4,topRight:4}:0,maxBarThickness:38});je.push(new F(B,{type:"bar",data:{labels:R,datasets:[Y("Préstamos",It.prestamos,i.map(K=>K.desglose.prestamos.total),!1),Y("Facturas",It.facturas,i.map(K=>K.desglose.facturas.total),!1),Y("Otros gastos",It.otros,i.map(K=>K.desglose.otros.total),!1),Y("Imprevistos",It.imprevistos,i.map(K=>K.desglose.imprevistos.total),!_()),..._()?[Y("Imprevistos estimados",It.imprevistos,i.map(K=>K.desglose.reservaImprevistos),!0,E)]:[]]},plugins:[z],options:{...L,scales:j(!0),plugins:{legend:x([It.prestamos,It.facturas,It.otros,It.imprevistos,C(It.imprevistos,E)]),tooltip:G(K=>`Total: ${D(i[K].desglose.gastosTotales+i[K].desglose.reservaImprevistos)}`)}}}))}const V=s.querySelector("[data-hist-ahorro]");if(V){let Y=0;const K=i.map(Z=>Y=Math.round((Y+Z.desglose.margen)*100)/100);je.push(new F(V,{type:"bar",data:{labels:R,datasets:[{type:"bar",label:"Margen del mes",data:i.map(Z=>Z.desglose.margen),backgroundColor:i.map((Z,W)=>y(Z.desglose.margen>=0?I:A,W)),borderRadius:4,borderSkipped:!1,maxBarThickness:38,order:2},{type:"line",label:"Ahorro acumulado",data:K,borderColor:M,backgroundColor:M,borderWidth:2,pointRadius:4,pointHoverRadius:6,pointBorderColor:w,pointBorderWidth:2,tension:0,order:1}]},plugins:[z],options:{...L,scales:j(!1),plugins:{legend:x([I,M]),tooltip:G(Z=>{const W=i[Z].desglose,gt=W.margenPct===null?"":`${W.margenPct.toFixed(0)} % de lo que ${i[Z].mes>n?"entrará":"entra"}`;return W.reservaImprevistos>0?`${gt}
Descontados ${D(W.reservaImprevistos)} para imprevistos`:gt})}}}))}}return k(s,"[data-hist-preset]",F=>{const R=F.getAttribute("data-hist-preset");if(lt.preset=R,R==="personalizado"){const j=i.map(N=>N.mes);lt.desde=lt.desde??j[0]??mt(n,-5),lt.hasta=lt.hasta??j[j.length-1]??mt(n,6)}$()}),tt(s,"[data-hist-desde], [data-hist-hasta]",()=>{var j,N;const F=(j=s.querySelector("[data-hist-desde]"))==null?void 0:j.value,R=(N=s.querySelector("[data-hist-hasta]"))==null?void 0:N.value;F&&(lt.desde=F),R&&(lt.hasta=R),$()}),k(s,"[data-hist-mes]",F=>f(F.getAttribute("data-hist-mes"))),k(s,"[data-hist-vista]",F=>{lt.vista=F.getAttribute("data-hist-vista"),s.querySelectorAll("[data-hist-vista]").forEach(N=>{const L=N.dataset.histVista===lt.vista;N.classList.toggle("active",L),N.setAttribute("aria-pressed",String(L))});const R=s.querySelector(".hist-fichas");R&&(R.innerHTML=u());const j=s.querySelector("[data-hist-detalle]");j&&(j.innerHTML=v()),P()}),$(),e.classList.remove("hidden"),s}const ft={preset:"alrededor"};function ja(t,a,e,o){const s=a.slice(0,7);switch(t){case"ultimos12":return{desde:`${mt(s,-11)}-01`,hasta:a};case"anio":return{desde:`${a.slice(0,4)}-01-01`,hasta:`${a.slice(0,4)}-12-31`};case"proximos12":return{desde:ce(a,1),hasta:qt(mt(s,12))};case"personalizado":return e&&o?e<=o?{desde:e,hasta:o}:{desde:o,hasta:e}:{desde:`${mt(s,-6)}-01`,hasta:qt(mt(s,6))};default:return{desde:`${mt(s,-6)}-01`,hasta:qt(mt(s,6))}}}const Si=(t,a,e)=>`informe-${t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"financeapp"}-${a}-a-${e}.html`;function Mi(t){const a=t.doc??document,e=t.win??window,o=a.getElementById("modal-overlay"),s=Lt(a);if(!o||!s)return null;const n=s;function i(){const l=ja(ft.preset,t.hoy,ft.desde,ft.hasta),p=(d,u,v)=>`<label class="inf-opcion${ft.preset===d?" activa":""}">
        <input type="radio" name="inf-periodo" value="${d}"${ft.preset===d?" checked":""}/>
        <span><strong>${u}</strong><em>${v}</em></span>
      </label>`;n.innerHTML=`
      <div class="modal-title">Crear informe</div>
      <p class="text-sm" style="color:var(--text2);line-height:1.6;margin:0 0 14px">
        Un documento para leer con calma o imprimir: une lo que ha pasado en tus cuentas con lo que está previsto,
        cuadrado al céntimo, y compara lo que preveías con lo que pasó de verdad.
      </p>
      <fieldset class="inf-opciones">
        <legend class="form-label">Periodo</legend>
        ${p("alrededor","Seis meses atrás y seis adelante","El pasado real y la previsión, con hoy en medio")}
        ${p("ultimos12","Los últimos 12 meses","Solo pasado: lo previsto frente a lo real")}
        ${p("anio",`Todo ${t.hoy.slice(0,4)}`,"Del 1 de enero al 31 de diciembre")}
        ${p("proximos12","Los próximos 12 meses","Solo previsión, desde mañana")}
        ${p("personalizado","Elegir fechas","Cualquier periodo, antes o después de hoy")}
      </fieldset>
      ${ft.preset==="personalizado"?`<div class="grid-2 mt-8">
              <div class="form-group"><label class="form-label" for="inf-desde">Desde</label><input class="form-input" type="date" id="inf-desde" value="${m(l.desde)}"/></div>
              <div class="form-group"><label class="form-label" for="inf-hasta">Hasta</label><input class="form-input" type="date" id="inf-hasta" value="${m(l.hasta)}"/></div>
            </div>`:`<p class="text-sm mt-8" style="color:var(--text3)">Del ${m(l.desde)} al ${m(l.hasta)}</p>`}
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button type="button" class="btn-secondary" data-inf-descargar>Descargar</button>
        <button type="button" class="btn-primary" data-inf-ver>Ver informe</button>
      </div>`}function r(){const l=ja(ft.preset,t.hoy,ft.desde,ft.hasta);try{return{html:t.construir(l.desde,l.hasta),...l}}catch(p){return console.error("[informe] No se ha podido generar:",p),H("No se ha podido generar el informe","err"),null}}function c(l){const p=URL.createObjectURL(new Blob([l.html],{type:"text/html;charset=utf-8"})),d=a.createElement("a");d.href=p,d.download=Si(t.proyecto,l.desde,l.hasta),a.body.appendChild(d),d.click(),d.remove(),setTimeout(()=>URL.revokeObjectURL(p),6e4)}return tt(n,'input[name="inf-periodo"]',l=>{if(ft.preset=l.value,ft.preset==="personalizado"&&!ft.desde){const p=ja("alrededor",t.hoy);ft.desde=p.desde,ft.hasta=p.hasta}i()}),tt(n,"#inf-desde, #inf-hasta",()=>{var l,p;ft.desde=((l=n.querySelector("#inf-desde"))==null?void 0:l.value)||ft.desde,ft.hasta=((p=n.querySelector("#inf-hasta"))==null?void 0:p.value)||ft.hasta}),k(n,"[data-inf-ver]",()=>{const l=r();if(!l)return;const p=URL.createObjectURL(new Blob([l.html],{type:"text/html;charset=utf-8"}));e.open(p,"_blank")||(c(l),H("El navegador no ha dejado abrir una pestaña: el informe se ha descargado")),setTimeout(()=>URL.revokeObjectURL(p),6e4)}),k(n,"[data-inf-descargar]",()=>{const l=r();l&&(c(l),H("Informe descargado"))}),i(),o.classList.remove("hidden"),n}function Ai(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function is(t,a){const e=U(t),o=[];for(let s=1;s<=a;s++){const n=new Date(e.getFullYear(),e.getMonth()-s,1);o.push(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Ei(t,a,e){const o=is(e,1)[0],s=a.slice(0,7)<o?a.slice(0,7):o,n=[];let[i,r]=t.slice(0,7).split("-").map(Number);for(;`${i}-${String(r).padStart(2,"0")}`<=s;)n.push(`${i}-${String(r).padStart(2,"0")}`),++r>12&&(r=1,i++);return n}function qa(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function Pi(t,a){const{inicio:e,fin:o}=qa(a);return Na(t,e,o)}function Na(t,a,e){return Fe([t],{start:a,end:e}).reduce((s,n)=>s+Math.abs(n.cuantia),0)}function _i(t,a){const{inicio:e,fin:o}=qa(a);return Ke(t.fechaInicio,t.fechaFin,e,o)}function Fi(t){function a(s,n={}){var _;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=st(),desde:l,hasta:p}=n,d=t.transacciones({estimacionId:s._id}),v=d.length===0&&(((_=s.tags)==null?void 0:_.length)??0)>0?t.transacciones({tags:s.tags}):d,g=l&&p?Ei(l,p,c):is(c,i),b=new Map(g.map(P=>{const{inicio:x,fin:z}=qa(P);return[P,{inicio:l&&l>x?l:x,fin:p&&p<z?p:z}]})),$=new Map;for(const P of v){const x=b.get(P.fecha.slice(0,7));if(!x||P.fecha<x.inicio||P.fecha>x.fin)continue;const z=P.fecha.slice(0,7);$.set(z,($.get(z)??0)+Math.abs(P.importeCts)/100)}const f=[];for(const P of g){const x=$.get(P);if(x===void 0||!_i(s,P))continue;const z=b.get(P),T=X(Na(s,z.inicio,z.fin));f.push({mes:P,estimado:T,real:X(x),desviacion:X(x-T),precision:Ai(T,x)})}const h=X(f.reduce((P,x)=>P+x.estimado,0)),S=X(f.reduce((P,x)=>P+x.real,0)),w=f.reduce((P,x)=>P+Math.abs(x.estimado),0),I=f.length===0?null:w>0?f.reduce((P,x)=>P+x.precision*Math.abs(x.estimado),0)/w:f.reduce((P,x)=>P+x.precision,0)/f.length,A=f.slice(-r),M=A.length>0?X(A.reduce((P,x)=>P+x.real,0)/A.length):null,C=A.reduce((P,x)=>P+x.estimado,0),y=A.reduce((P,x)=>P+x.real,0),E=C>0?y/C:null;return{estimacionId:s._id,concepto:s.concepto,tags:s.tags??[],meses:f,estimadoTotal:h,realTotal:S,desviacionTotal:X(S-h),precision:I,mediaRealReciente:M,factorReciente:E,infraestimada:S>h}}function e(s,n={}){return s.filter(i=>i.tipo!=="transferencia").map(i=>a(i,n)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(s){const n=new Map;for(const i of s)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=n.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,n.set(r,c)}return[...n.entries()].map(([i,r])=>({tag:i,estimadoTotal:X(r.estimado),realTotal:X(r.real),desviacionTotal:X(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}function Ra(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:s=5}=e;if(t.precision===null||t.factorReciente===null||t.meses.length===0||t.precision>=o)return null;const n=X(a*t.factorReciente),i=X(n-a),r=a!==0?i/Math.abs(a)*100:n!==0?100:0;if(Math.abs(r)<s)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:X(a),cuantiaSugerida:n,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo previsto en un ${Math.round((t.factorReciente-1)*100)} %`:`El gasto real de los últimos ${c} meses se queda un ${Math.round((1-t.factorReciente)*100)} % por debajo de lo previsto`}}function Di(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(n,i,r={}){const c=r.hoy??st(),l=t.get("expenses"),p=l.find(g=>g._id===n);if(!p)throw new Error(`La estimación ${n} no existe`);const d={...p,fechaFin:c},u={...p,_id:a(),cuantia:X(i),fechaInicio:c,fechaFin:p.fechaFin??null,ajustadaDesdeId:p._id,ajustadaEn:c},v=l.map(g=>g._id===n?d:g);return v.push(u),t.set("expenses",v),{estimacionCerrada:d,estimacionNueva:u}}function o(n,i={}){const r=[],c=[];for(const l of n)try{r.push(e(l.estimacionId,l.cuantiaSugerida,i))}catch(p){c.push({estimacionId:l.estimacionId,error:p.message})}return{aplicadas:r,errores:c}}function s(n){const i=t.get("expenses"),r=new Map(i.map(b=>[b._id,b])),c=r.get(n);if(!c)return[];const l=[];let p=c;const d=new Set;for(;p!=null&&p.ajustadaDesdeId&&!d.has(p._id);){d.add(p._id);const b=r.get(p.ajustadaDesdeId);if(!b)break;l.unshift(b),p=b}const u=[];let v=c;const g=new Set([c._id]);for(;;){const b=i.find($=>$.ajustadaDesdeId===v._id&&!g.has($._id));if(!b)break;g.add(b._id),u.push(b),v=b}return[...l,c,...u]}return{aplicar:e,aplicarTodas:o,cadena:s}}function Ti(t,a){if(a<t)return 0;let e=0,[o,s]=t.slice(0,7).split("-").map(Number);for(;`${o}-${String(s).padStart(2,"0")}`<=a.slice(0,7);){const n=new Date(o,s,0).getDate(),i=`${o}-${String(s).padStart(2,"0")}-01`,r=`${o}-${String(s).padStart(2,"0")}-${String(n).padStart(2,"0")}`,c=t>i?t:i,l=a<r?a:r,p=(U(l).getTime()-U(c).getTime())/864e5+1;e+=p/n,++s>12&&(s=1,o++)}return e}function zi(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function ji(t){const[a,e]=t.slice(0,7).split("-").map(Number),o=new Date(a,e-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function oa(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function rs(t,a,e){const o=new Map(a.map(n=>[n._id,[]])),s=a.filter(n=>{var i;return!e(n._id)&&(((i=n.tags)==null?void 0:i.length)??0)>0});for(const n of t){if(n.estimacionId&&o.has(n.estimacionId)){o.get(n.estimacionId).push(n);continue}if(n.estimacionId)continue;let i=null,r=0;for(const c of s){const l=(c.tags??[]).filter(p=>n.tags.includes(p)).length;l!==0&&(l>r||l===r&&i&&c._id<i._id)&&(i=c,r=l)}i&&o.get(i._id).push(n)}return o}function cs(t,a,e,o={}){const n=t.filter(c=>c.tipo!=="transferencia"&&c.activo!==!1&&Ke(c.fechaInicio,c.fechaFin,a,e)).map(c=>({_id:c._id,concepto:c.concepto,tipo:c.tipo==="ingreso"?"ingreso":"gasto",tags:c.tags??[],estimado:X(Na(c,a,e)),origen:"estimacion",periodicidad:ho(c.tipoFrecuencia,c.frecuencia),cuantia:c.cuantia})),i=(o.nominas??[]).filter(c=>c.activo!==!1&&Ke(c.fechaInicio,c.fechaFin,a,e));if(i.length>0){const c=_a(i,{start:a,end:e},null,[],o.resolverTramosIRPF);for(const l of i){const d=c.filter(u=>u.sourceId===l._id||u.sourceId.startsWith(`${l._id}_`)).reduce((u,v)=>u+(v.tipo==="ingreso"?Math.abs(v.cuantia):-Math.abs(v.cuantia)),0);n.push({_id:l._id,concepto:l.nombre,tipo:"ingreso",tags:l.tags??[],estimado:X(d),origen:"nomina",periodicidad:`${l.nPagas} pagas al año`})}}const r=(o.loans??[]).filter(c=>c.activo!==!1);if(r.length>0){const c=Pa(r,{start:a,end:e});for(const l of r){const p=c.filter(d=>d.sourceId===l._id);p.length!==0&&n.push({_id:l._id,concepto:`Cuota ${l.nombre}`,tipo:"gasto",tags:l.tags??[],estimado:X(p.reduce((d,u)=>d+Math.abs(u.cuantia),0)),origen:"prestamo",periodicidad:"cuota mensual"})}}return n}function qi(t,a,e,o={}){const{desde:s,hasta:n}=zi(e);return{...sa(t,a,s,n,o),mes:e}}function sa(t,a,e,o,s={}){const n=t.transacciones({desde:e,hasta:o}),i=new Set(s.omitidos??[]),r=T=>T.tipo!=="transferencia"&&!i.has(oa(T.concepto)),c=n.filter(T=>r(T)&&T.importeCts<0),l=n.filter(T=>r(T)&&T.importeCts>0),p=n.filter(T=>T.tipo!=="transferencia"&&i.has(oa(T.concepto))),d=new Map((s.analisis??[]).map(T=>[T.estimacionId,T])),u=cs(a,e,o,s),v=T=>new Set(T.filter(q=>t.transacciones({estimacionId:q._id}).length>0).map(q=>q._id)),g=u.filter(T=>T.tipo==="gasto"),b=u.filter(T=>T.tipo==="ingreso"),$=rs(c,g,T=>v(g).has(T)),f=rs(l,b,T=>v(b).has(T)),h=new Set,S=new Set,w=(T,q,F)=>{for(const N of q)F.add(N._id);const R=X(q.reduce((N,L)=>N+Math.abs(L.importeCts)/100,0)),j=T.origen==="estimacion"?d.get(T._id):void 0;return{estimacionId:T._id,concepto:T.concepto,tipo:T.tipo,origen:T.origen,periodicidad:T.periodicidad,tags:T.tags,estimado:T.estimado,real:R,desviacion:X(R-T.estimado),sinMovimiento:q.length===0,sugerencia:j?Ra(j,T.cuantia??0,{hoy:s.hoy}):null}},I=g.map(T=>w(T,$.get(T._id)??[],h)),A=b.map(T=>w(T,f.get(T._id)??[],S)),M=(T,q)=>{const F=new Map;for(const R of T){if(q.has(R._id))continue;const j=oa(R.concepto),N=F.get(j)??{concepto:R.concepto,clave:j,total:0,movimientos:0,ids:[]};N.total=X(N.total+Math.abs(R.importeCts)/100),N.movimientos+=1,N.ids.push(R._id),F.set(j,N)}return[...F.values()].sort((R,j)=>j.total-R.total)},C=M(c,h),y=M(l,S),E=M(p,new Set),_=X(I.reduce((T,q)=>T+q.estimado,0)),P=X(c.reduce((T,q)=>T+Math.abs(q.importeCts)/100,0)),x=X(A.reduce((T,q)=>T+q.estimado,0)),z=X(l.reduce((T,q)=>T+q.importeCts/100,0));return{mes:e.slice(0,7),desde:e,hasta:o,estimado:_,real:P,desviacion:X(P-_),ingresosEstimados:x,ingresosReales:z,desviacionIngresos:X(z-x),netoEstimado:X(x-_),netoReal:X(z-P),desviacionNeta:X(z-P-(x-_)),filas:[...I,...A].sort((T,q)=>Math.abs(q.desviacion)-Math.abs(T.desviacion)),sinEstimacion:C,totalSinEstimacion:X(C.reduce((T,q)=>T+q.total,0)),ingresosSinPrever:y,totalIngresosSinPrever:X(y.reduce((T,q)=>T+q.total,0)),porTag:Ni(g,c),meses:Ti(e,o),omitidos:E,totalOmitido:X(E.reduce((T,q)=>T+q.total,0)),vacio:n.length===0}}function Ni(t,a){const e=new Map,o=(s,n,i)=>{for(const r of s.length>0?s:["sin etiqueta"]){const c=e.get(r)??{estimado:0,real:0};c[n]+=i,e.set(r,c)}};for(const s of t)o(s.tags,"estimado",s.estimado);for(const s of a)o(s.tags,"real",Math.abs(s.importeCts)/100);return[...e.entries()].map(([s,n])=>({tag:s,estimado:X(n.estimado),real:X(n.real),desviacion:X(n.real-n.estimado)})).filter(s=>s.estimado>0||s.real>0).sort((s,n)=>n.real-s.real||n.estimado-s.estimado)}function ls(t){const a=new Set;for(const e of t.transacciones())a.add(e.fecha.slice(0,7));return[...a].sort().reverse()}const Q=t=>Math.round(t*100),nt=t=>t/100,pe=t=>t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia),qe=(t,a)=>t<a?t:a,na=(t,a)=>t>a?t:a,Ri=new Set(["transfer-out","transfer-in","aportacion-out","aportacion-in"]);function ki(t,a){return{...t,transacciones:(e={})=>t.transacciones(e).filter(o=>a.has(o.cuentaId))}}function Li(t){const a=t.hoy??st(),e=t.desde,o=t.hasta<t.desde?t.desde:t.hasta,s=ce(e,-1),n=a<e?s:qe(a,o),i=n>=e,r=n<o,c=new Set(t.cuentas.map(O=>O._id)),l=ki(t.ledger,c),p=new Set(t.opcionesCierre.omitidos??[]),d=new Set(t.cuentas.filter(O=>t.ledger.puntosControl(O._id).length>0||t.ledger.transacciones({cuentaId:O._id}).length>0).map(O=>O._id)),u=(O,J)=>d.has(O._id)?t.ledger.saldoCuenta(O._id,J):t.saldoSinLibro(O,J),v=O=>nt(t.cuentas.reduce((J,et)=>J+Q(u(et,O)),0)),g=(O,J)=>{if(!d.has(O._id))return O.fechaInicialSaldo||null;const et=[...t.ledger.puntosControl(O._id).filter(it=>it.origen!=="derivado"&&it.fecha<=J).map(it=>it.fecha),...t.ledger.transacciones({cuentaId:O._id,hasta:J}).map(it=>it.fecha)];return et.length?et.sort().pop():null},b=v(s),$=i?v(n):b,f=O=>{let J=0,et=0,it=0,Ct=0;for(const at of O)at.tipo==="transferencia"?it+=at.importeCts:p.has(oa(at.concepto))?Ct+=at.importeCts:at.importeCts>0?J+=at.importeCts:et-=at.importeCts;return{ingresos:J,gastos:et,traspasos:it,omitido:Ct}},h=i?l.transacciones({desde:e,hasta:n}):[],S=f(h),w=i?sa(l,t.gastos,e,n,{...t.opcionesCierre,hoy:a}):null,I=r?na(ce(n,1),e):o,A=r?t.generarExtracto(I,o,I).filter(O=>O.fecha>=I&&O.fecha<=o&&(!O.cuenta||c.has(O.cuenta)||!O.cuenta)):[],M=A.reduce((O,J)=>O+Q(pe(J)),0),C=nt(Q($)+M),y=O=>{const J=Ze(O,t.gastos,t.opcionesCierre.loans??[],a),et=O.reduce((bt,Vt)=>bt+Q(pe(Vt)),0),it=Q(J.ingresosNetos),Ct=Q(J.gastosTotales),at=O.filter(bt=>bt.sourceType==="account-interest").reduce((bt,Vt)=>bt+Q(pe(Vt)),0),ut=O.filter(bt=>Ri.has(bt.sourceType)).reduce((bt,Vt)=>bt+Q(pe(Vt)),0);return{d:J,total:et,ingresos:it,gastos:Ct,rentabilidad:at,internos:ut,resto:et-(it-Ct)-at-ut}},E=y(A);let _=0;const P=t.imprevistos&&t.imprevistos.meses>0?t.imprevistos.mediaMensual:0;if(r&&P>0)for(const O of Ft(I.slice(0,7),o.slice(0,7))){if(O===a.slice(0,7)){_+=Math.max(0,Q(P)-Q(t.imprevistosMesEnCurso??0));continue}const J=na(`${O}-01`,I),et=qe(qt(O),o),it=Number(qt(O).slice(8,10)),Ct=Math.round((U(et).getTime()-U(J).getTime())/864e5)+1;_+=Math.round(Q(P)*Ct/it)}const x=nt(_),z=w?Q(w.netoEstimado):0,T=nt(Q(b)+z),q=Q($)-(Q(b)+S.ingresos-S.gastos+S.traspasos+S.omitido),F=[{concepto:`Saldo real al empezar (${s})`,importe:b,saldo:!0}];i&&(F.push({concepto:"Ingresos reales",importe:nt(S.ingresos)},{concepto:"Gastos reales",importe:-nt(S.gastos)}),S.traspasos&&F.push({concepto:"Traspasos entre cuentas",nota:"deberían sumar cero; si no, falta un lado",importe:nt(S.traspasos)}),S.omitido&&F.push({concepto:"Conceptos omitidos en el cierre",importe:nt(S.omitido)}),q&&F.push({concepto:"Ajuste por saldos anotados",nota:"saldos reales anotados a mano y cuentas sin movimientos: lo que no explican los movimientos registrados",importe:nt(q)}),F.push({concepto:`Saldo real hoy (${n})`,importe:$,saldo:!0})),r&&(F.push({concepto:"Ingresos previstos",nota:"netos de retenciones de nómina",importe:nt(E.ingresos)},{concepto:"Gastos previstos",importe:-nt(E.gastos)}),E.rentabilidad&&F.push({concepto:"Intereses y rentabilidad previstos",importe:nt(E.rentabilidad)}),E.internos&&F.push({concepto:"Movimientos entre cuentas previstos",importe:nt(E.internos)}),E.resto&&F.push({concepto:"Otros movimientos previstos",importe:nt(E.resto)}),F.push({concepto:`Saldo previsto al final (${o})`,importe:C,saldo:!0}),_>0&&F.push({concepto:"Reserva para imprevistos",nota:t.imprevistos?`media de ${t.imprevistos.meses} meses`:void 0,importe:-x},{concepto:"Saldo previsto con la reserva",importe:nt(Q(C)-_),saldo:!0}));const R=[];let j=Q(b);for(const O of Ft(e.slice(0,7),o.slice(0,7))){const J=na(`${O}-01`,e),et=qe(qt(O),o),it=j;let Ct=0,at=0,ut,bt;const Vt=J<=n,fo=et>n;if(Vt){const ya=qe(et,n),re=sa(l,t.gastos,J,ya,{...t.opcionesCierre,hoy:a});Ct+=Q(re.ingresosReales),at+=Q(re.real),bt=Q(re.netoEstimado),ut=Q(v(ya))}else ut=it;if(fo){const ya=A.filter(hn=>hn.fecha>=na(J,I)&&hn.fecha<=et),re=y(ya);Ct+=re.ingresos,at+=re.gastos,ut+=re.total}const go=Ct-at;R.push({mes:O,tipo:Vt&&fo?"en-curso":Vt?"real":"previsto",saldoInicial:nt(it),ingresos:nt(Ct),gastos:nt(at),neto:nt(go),otros:nt(ut-it-go),saldoFinal:nt(ut),...bt!==void 0&&!fo?{netoPrevisto:nt(bt),desviacion:nt(go-bt)}:{}}),j=ut}const N=[];if(w){const O=new Map(t.gastos.map(at=>[at._id,at])),J=at=>{if(at.tipo==="ingreso")return"ingresos";if(at.origen==="prestamo")return"prestamos";const ut=O.get(at.estimacionId);return ut!=null&&ut.imprevisto?"imprevistos":ut&&Te(ut)?"facturas":"otros"},et={ingresos:"Ingresos",prestamos:"Préstamos",facturas:"Facturas",otros:"Otros gastos",imprevistos:"Imprevistos previstos",sinPrever:"Gasto sin prever"},it=new Map;for(const at of w.filas){const ut=J(at),bt=it.get(ut)??{previsto:0,real:0};bt.previsto+=Q(at.estimado),bt.real+=Q(at.real),it.set(ut,bt)}it.set("sinPrever",{previsto:0,real:Q(w.totalSinEstimacion)});const Ct=Q(w.totalIngresosSinPrever);if(Ct){const at=it.get("ingresos")??{previsto:0,real:0};at.real+=Ct,it.set("ingresos",at)}for(const at of["ingresos","prestamos","facturas","otros","imprevistos","sinPrever"]){const ut=it.get(at);!ut||ut.previsto===0&&ut.real===0||N.push({grupo:at,nombre:et[at],previsto:nt(ut.previsto),real:nt(ut.real),desviacion:nt(ut.real-ut.previsto)})}}const L=new Map;for(const O of A)L.set(O.cuenta||"",(L.get(O.cuenta||"")??0)+Q(pe(O)));const G=t.cuentas.map(O=>{const J=u(O,s),et=i?u(O,n):J;return{_id:O._id,nombre:O.nombre,saldoInicio:X(J),saldoHoy:X(et),saldoFinal:nt(Q(et)+(L.get(O._id)??0)),ultimoDato:g(O,n),fuente:d.has(O._id)?"movimientos":"saldo inicial"}}),B=L.get("")??0;let V=null;if(r){let O=Q($);V={saldo:$,fecha:n<e?e:n};for(const J of[...A].sort((et,it)=>et.fecha.localeCompare(it.fecha)))O+=Q(pe(J)),nt(O)<V.saldo&&(V={saldo:nt(O),fecha:J.fecha})}const Y=[{fecha:s,real:b,...i?{previstoInicio:b}:{prevision:b}}];let K=Q(b);for(const O of R){const J=qe(qt(O.mes),o);O.tipo==="real"?(K+=Q(O.netoPrevisto??0),Y.push({fecha:J,real:O.saldoFinal,previstoInicio:nt(K)})):O.tipo==="en-curso"?(Y.push({fecha:n,real:$,previstoInicio:T,prevision:$}),Y.push({fecha:J,prevision:O.saldoFinal})):Y.push({fecha:J,prevision:O.saldoFinal})}const Z=[...Y].reverse().find(O=>O.real!==void 0);Z&&r&&Z.prevision===void 0&&(Z.prevision=Z.real);const W=O=>O.reduce((J,et)=>J+(et.saldo?0:Q(et.importe)),0),gt=F.slice(F.findIndex(O=>O.concepto.startsWith("Saldo real hoy"))+1||1,F.findIndex(O=>O.concepto.startsWith("Saldo previsto al final"))),vt=[],Gt=(O,J)=>Math.abs(O-J)<=1;if(i){const O=F.slice(1,F.findIndex(J=>J.concepto.startsWith("Saldo real hoy")));vt.push({ok:Gt(Q(b)+W(O),Q($)),texto:"El saldo inicial más los movimientos del pasado da el saldo real de hoy."}),vt.push({ok:Gt(Q((w==null?void 0:w.ingresosReales)??0),S.ingresos)&&Gt(Q((w==null?void 0:w.real)??0),S.gastos),texto:"Los ingresos y gastos reales del puente son los mismos que los del cierre de mes."})}if(r&&vt.push({ok:Gt(Q($)+W(gt),Q(C)),texto:"El saldo de hoy más lo previsto da el saldo final."}),t.cuadroDeMando&&r){const O=t.cuadroDeMando,J=Gt(Q(O.saldoFinal),Q(C)),et=it=>`${it<0?"−":""}${D(Math.abs(it))}`;vt.push({ok:J,texto:J?"El saldo final coincide con el del cuadro de mando.":`El cuadro de mando prevé ${et(O.saldoFinal)} al final, ${et(O.saldoFinal-C)} de diferencia. Parte de ${et(O.saldoHoy)} como saldo de hoy y el informe de ${et($)}, el de tus cuentas: actualiza el saldo de las cuentas en Cuentas para que coincidan.`})}const ha=R[R.length-1];if(vt.push({ok:!ha||Gt(Q(ha.saldoFinal),Q(C)),texto:"La tabla mes a mes acaba en el mismo saldo que el puente."}),vt.push({ok:Gt(G.reduce((O,J)=>O+Q(J.saldoFinal),0)+B,Q(C)),texto:"La suma de las cuentas da el saldo total, hoy y al final."}),w){const O=N.filter(J=>J.grupo!=="ingresos").reduce((J,et)=>J+Q(et.real),0);vt.push({ok:Gt(O,Q(w.real)),texto:"Los grupos de gasto suman el gasto real del pasado."})}const ie=[],wd=ce(n,-30);for(const O of G)O.ultimoDato?i&&O.ultimoDato<wd&&ie.push(`«${O.nombre}»: el último dato real es del ${O.ultimoDato}. Lo que pasó después no está en el informe.`):ie.push(`«${O.nombre}» no tiene ningún dato real: su saldo es el inicial.`);return i&&h.length===0&&ie.push("No hay movimientos registrados en el pasado del periodo: lo «real» sale solo de los saldos anotados."),w&&w.sinEstimacion.length>0&&ie.push(`${w.sinEstimacion.length} conceptos de gasto (${D(w.totalSinEstimacion)}) no están asignados a ninguna estimación. Asígnalos u omítelos en Cuentas → Cierre y precisión.`),Math.abs(q)>1e4&&ie.push("El ajuste por saldos anotados es grande: faltan movimientos por registrar o importar entre esos saldos."),S.traspasos&&Math.abs(S.traspasos)>100&&ie.push("Los traspasos entre cuentas no suman cero: probablemente falta el otro lado de alguno (una cuenta sin importar)."),{proyecto:t.proyecto,generadoEl:ot(new Date),desde:e,hasta:o,hoy:a,corte:n,tienePasado:i,tieneFuturo:r,saldoInicio:b,saldoHoy:$,saldoFinal:C,reservaImprevistos:x,saldoFinalConReserva:nt(Q(C)-_),saldoHoyPrevisto:T,puente:F,meses:R,grupos:N,desviaciones:((w==null?void 0:w.filas)??[]).filter(O=>Math.abs(O.desviacion)>=.01).slice(0,10),sinPrever:((w==null?void 0:w.sinEstimacion)??[]).slice(0,10),totalSinPrever:(w==null?void 0:w.totalSinEstimacion)??0,cuentas:G,minimo:V,serie:Y,comprobaciones:vt,avisos:ie,imprevistos:t.imprevistos??null,cierre:w}}const dt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Oi=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],ds=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],Et=t=>{const[a,e,o]=t.split("-").map(Number);return`${o} ${ds[e-1]} ${a}`},Hi=t=>{const[a,e]=t.split("-").map(Number);return`${Oi[e-1]} ${a}`},rt=t=>dt(D(t)),wt=t=>`${t>.004?"+":t<-.004?"−":""}${dt(D(Math.abs(t)))}`,Tt=t=>t>.004?"pos":t<-.004?"neg":"",Ot={real:"#1f6fd1",previstoInicio:"#8a94a6",prevision:"#0f9d6b",hoy:"#b4232c"};function Bi(t){const a=t.serie;if(a.length<2)return"";const e=760,o=260,s={izq:70,der:16,arr:14,aba:30},n=C=>new Date(`${C}T00:00:00`).getTime(),i=n(a[0].fecha),r=n(a[a.length-1].fecha),c=a.flatMap(C=>[C.real,C.previstoInicio,C.prevision].filter(y=>y!==void 0));t.minimo&&c.push(t.minimo.saldo);let l=Math.min(...c),p=Math.max(...c);const d=(p-l)*.08||Math.abs(p)*.05||1;l-=d,p+=d;const u=C=>s.izq+(n(C)-i)/Math.max(1,r-i)*(e-s.izq-s.der),v=C=>s.arr+(1-(C-l)/(p-l))*(o-s.arr-s.aba),g=(C,y)=>{const E=a.filter(x=>x[C]!==void 0);if(E.length<2)return"";const _=E.map((x,z)=>`${z?"L":"M"}${u(x.fecha).toFixed(1)},${v(x[C]).toFixed(1)}`).join(" "),P=E.map(x=>`<circle cx="${u(x.fecha).toFixed(1)}" cy="${v(x[C]).toFixed(1)}" r="3" fill="${Ot[C]}"/>`).join("");return`<path d="${_}" fill="none" stroke="${Ot[C]}" stroke-width="2" ${y}/>${P}`},b=new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",notation:"compact",maximumFractionDigits:1}),f=Array.from({length:5},(C,y)=>l+(p-l)*y/4).map(C=>`<line x1="${s.izq}" x2="${e-s.der}" y1="${v(C).toFixed(1)}" y2="${v(C).toFixed(1)}" stroke="#e6e9ef"/><text x="${s.izq-8}" y="${(v(C)+4).toFixed(1)}" text-anchor="end" class="eje">${dt(b.format(C))}</text>`).join(""),h=a.map(C=>C.fecha),S=Math.max(1,Math.ceil(h.length/8)),w=h.filter((C,y)=>y%S===0||y===h.length-1).map(C=>{const[y,E]=C.split("-").map(Number);return`<text x="${u(C).toFixed(1)}" y="${o-8}" text-anchor="middle" class="eje">${ds[E-1]} ${String(y).slice(2)}</text>`}).join(""),I=t.tienePasado&&t.tieneFuturo?`<line x1="${u(t.corte).toFixed(1)}" x2="${u(t.corte).toFixed(1)}" y1="${s.arr}" y2="${o-s.aba}" stroke="${Ot.hoy}" stroke-dasharray="3 3"/><text x="${(u(t.corte)+4).toFixed(1)}" y="${s.arr+10}" class="eje" fill="${Ot.hoy}">hoy</text>`:"",A=t.minimo?`<circle cx="${u(t.minimo.fecha).toFixed(1)}" cy="${v(t.minimo.saldo).toFixed(1)}" r="5" fill="none" stroke="${Ot.hoy}" stroke-width="2"/>`:"",M=`Saldo real de ${rt(t.saldoInicio)} a ${rt(t.saldoHoy)} hoy y previsto ${rt(t.saldoFinal)} al final.`;return`<figure class="grafica">
    <svg viewBox="0 0 ${e} ${o}" role="img" aria-label="${M}">
      ${f}${w}${I}
      ${g("previstoInicio",'stroke-dasharray="2 4"')}
      ${g("real","")}
      ${g("prevision",'stroke-dasharray="7 4"')}
      ${A}
    </svg>
    <figcaption>
      <span><i style="background:${Ot.real}"></i>Saldo real</span>
      ${t.tienePasado?`<span><i class="punteada" style="border-color:${Ot.previstoInicio}"></i>Lo previsto al empezar el periodo</span>`:""}
      ${t.tieneFuturo?`<span><i class="discontinua" style="border-color:${Ot.prevision}"></i>Previsión desde hoy</span>`:""}
      ${t.minimo?'<span><i class="anillo"></i>Saldo mínimo previsto</span>':""}
    </figcaption>
  </figure>`}function Gi(t){return`<table class="puente"><tbody>${t.map(e=>e.saldo?`<tr class="saldo"><th scope="row">${dt(e.concepto)}</th><td class="num">${rt(e.importe)}</td></tr>`:`<tr><th scope="row">${dt(e.concepto)}${e.nota?`<span class="nota">${dt(e.nota)}</span>`:""}</th><td class="num ${Tt(e.importe)}">${wt(e.importe)}</td></tr>`).join("")}</tbody></table></div>`}function Vi(t){const a={real:"Real","en-curso":"Real + previsto",previsto:"Previsto"};return`<div class="tabla-ancha"><table class="datos meses">
    <thead><tr>
      <th>Mes</th><th class="num">Saldo inicial</th><th class="num">Ingresos</th><th class="num">Gastos</th>
      <th class="num">Neto</th><th class="num" title="Traspasos, saldos anotados, intereses: lo que mueve el saldo sin ser ingreso ni gasto">Otros</th>
      <th class="num">Saldo final</th><th class="num">Neto previsto</th><th class="num">Desviación</th>
    </tr></thead>
    <tbody>${t.map(o=>`<tr class="${o.tipo}">
      <th scope="row">${dt(Hi(o.mes))}<span class="nota">${a[o.tipo]}</span></th>
      <td class="num">${rt(o.saldoInicial)}</td>
      <td class="num pos">${rt(o.ingresos)}</td>
      <td class="num neg">${rt(o.gastos)}</td>
      <td class="num ${Tt(o.neto)}">${wt(o.neto)}</td>
      <td class="num tenue">${wt(o.otros)}</td>
      <td class="num fuerte">${rt(o.saldoFinal)}</td>
      <td class="num">${o.netoPrevisto!==void 0?wt(o.netoPrevisto):"—"}</td>
      <td class="num ${o.desviacion!==void 0?Tt(o.desviacion):""}">${o.desviacion!==void 0?wt(o.desviacion):"—"}</td>
    </tr>`).join("")}</tbody>
  </table></div>
  <p class="pie-tabla">En cada fila, saldo inicial + neto + otros = saldo final. «Neto previsto» y «Desviación» solo existen en los meses ya cerrados: es lo que se preveía para ese mes frente a lo que registran las cuentas.</p>`}function Ui(t){if(!t.tienePasado||!t.cierre)return"";const a=t.cierre,e=t.saldoHoy-t.saldoHoyPrevisto,o=t.grupos.map(i=>`<tr><th scope="row">${dt(i.nombre)}</th><td class="num">${rt(i.previsto)}</td><td class="num">${rt(i.real)}</td>
      <td class="num ${i.grupo==="ingresos"?Tt(i.desviacion):Tt(-i.desviacion)}">${wt(i.desviacion)}</td></tr>`).join(""),s=t.desviaciones.map(i=>`<tr><th scope="row">${dt(i.concepto)}<span class="nota">${dt(i.periodicidad)}${i.sinMovimiento?" · sin ningún movimiento":""}</span></th>
      <td class="num">${rt(i.estimado)}</td><td class="num">${rt(i.real)}</td>
      <td class="num ${i.tipo==="ingreso"?Tt(i.desviacion):Tt(-i.desviacion)}">${wt(i.desviacion)}</td></tr>`).join(""),n=t.sinPrever.map(i=>`<tr><th scope="row">${dt(i.concepto)}</th><td class="num">${i.movimientos}</td><td class="num">${rt(i.total)}</td></tr>`).join("");return`<section>
    <h2>2 · El pasado: lo previsto frente a lo real</h2>
    <p class="intro">Del ${dt(Et(t.desde))} al ${dt(Et(t.corte))}. Lo previsto son tus estimaciones, nóminas y cuotas de préstamo; lo real, lo que registran tus cuentas. Es el mismo cálculo que Cuentas → Cierre y precisión.</p>
    <div class="cifras">
      <div><span>Debías tener hoy</span><strong>${rt(t.saldoHoyPrevisto)}</strong><em>saldo inicial + neto previsto</em></div>
      <div><span>Tienes hoy</span><strong>${rt(t.saldoHoy)}</strong><em>según tus cuentas</em></div>
      <div class="${Tt(e)}"><span>Diferencia</span><strong>${wt(e)}</strong><em>${e>=0?"mejor de lo previsto":"peor de lo previsto"}</em></div>
    </div>
    ${Math.abs(e-a.desviacionNeta)>=.01?`<p class="pie-tabla">De esa diferencia, ${wt(a.desviacionNeta)} es lo que se ingresó y gastó distinto de lo previsto (la tabla de abajo) y ${wt(e-a.desviacionNeta)} es lo que mueve el saldo sin ser ingreso ni gasto: traspasos, conceptos omitidos y saldos anotados (ver el puente).</p>`:""}
    <div class="tabla-ancha"><table class="datos"><thead><tr><th>Grupo</th><th class="num">Previsto</th><th class="num">Real</th><th class="num">Diferencia</th></tr></thead>
      <tbody>${o}</tbody>
      <tfoot><tr><th scope="row">Neto (ingresos − gastos)</th><td class="num">${wt(a.netoEstimado)}</td><td class="num">${wt(a.netoReal)}</td><td class="num ${Tt(a.desviacionNeta)}">${wt(a.desviacionNeta)}</td></tr></tfoot>
    </table></div>
    <p class="pie-tabla">En los gastos, una diferencia en rojo es gasto de más; en los ingresos, ha entrado menos. «Gasto sin prever» es lo que se pagó sin ninguna estimación que lo cubriera.</p>
    ${s?`<h3>Las estimaciones que más se desviaron</h3><div class="tabla-ancha"><table class="datos"><thead><tr><th>Estimación</th><th class="num">Previsto</th><th class="num">Real</th><th class="num">Diferencia</th></tr></thead><tbody>${s}</tbody></table></div>`:""}
    ${n?`<h3>Gasto sin prever · ${rt(t.totalSinPrever)}</h3><div class="tabla-ancha"><table class="datos"><thead><tr><th>Concepto</th><th class="num">Movimientos</th><th class="num">Total</th></tr></thead><tbody>${n}</tbody></table></div>`:""}
  </section>`}function Yi(t){return`<section>
    <h2>4 · Cuentas</h2>
    <div class="tabla-ancha"><table class="datos"><thead><tr><th>Cuenta</th><th class="num">Al empezar</th><th class="num">Hoy</th><th class="num">Variación</th><th class="num">Al final (previsto)</th><th>Último dato real</th></tr></thead>
      <tbody>${t.cuentas.map(e=>`<tr><th scope="row">${dt(e.nombre)}<span class="nota">${e.fuente==="movimientos"?"según movimientos y saldos anotados":"sin movimientos: saldo inicial"}</span></th>
      <td class="num">${rt(e.saldoInicio)}</td><td class="num">${rt(e.saldoHoy)}</td>
      <td class="num ${Tt(e.saldoHoy-e.saldoInicio)}">${wt(e.saldoHoy-e.saldoInicio)}</td>
      <td class="num">${t.tieneFuturo?rt(e.saldoFinal):"—"}</td>
      <td>${e.ultimoDato?dt(Et(e.ultimoDato)):"—"}</td></tr>`).join("")}</tbody>
      <tfoot><tr><th scope="row">Total</th><td class="num">${rt(t.saldoInicio)}</td><td class="num">${rt(t.saldoHoy)}</td><td class="num ${Tt(t.saldoHoy-t.saldoInicio)}">${wt(t.saldoHoy-t.saldoInicio)}</td><td class="num">${t.tieneFuturo?rt(t.saldoFinal):"—"}</td><td></td></tr></tfoot>
    </table>
  </section>`}function Wi(t){const a=`Informe · ${t.proyecto} · ${Et(t.desde)} – ${Et(t.hasta)}`,e=t.comprobaciones.map(n=>`<li class="${n.ok?"ok":"mal"}"><span aria-hidden="true">${n.ok?"✓":"✗"}</span> ${dt(n.texto)}${n.ok?"":" <strong>No cuadra.</strong>"}</li>`).join(""),o=t.avisos.map(n=>`<li>${dt(n)}</li>`).join(""),s=t.tieneFuturo?`<div><span>Previsto al final</span><strong>${rt(t.saldoFinal)}</strong><em>${dt(Et(t.hasta))}</em></div>
       ${t.reservaImprevistos>0?`<div><span>Con reserva para imprevistos</span><strong>${rt(t.saldoFinalConReserva)}</strong><em>reservando ${rt(t.reservaImprevistos)}</em></div>`:""}
       ${t.minimo?`<div class="${t.minimo.saldo<0?"neg":""}"><span>Saldo mínimo previsto</span><strong>${rt(t.minimo.saldo)}</strong><em>${dt(Et(t.minimo.fecha))}</em></div>`:""}`:"";return`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${dt(a)}</title>
<style>
  :root { --tinta:#1b2330; --suave:#5b6577; --tenue:#8a94a6; --linea:#e3e7ee; --fondo:#ffffff; --zona:#f5f7fa; --pos:#0f7a52; --neg:#b4232c; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #eef1f5; color: var(--tinta); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .hoja { max-width: 900px; margin: 24px auto; background: var(--fondo); padding: 40px 44px; border-radius: 10px; box-shadow: 0 2px 18px rgba(20,30,50,.08); }
  .acciones { max-width: 900px; margin: 16px auto 0; display: flex; gap: 8px; justify-content: flex-end; padding: 0 16px; }
  .acciones button { font: inherit; padding: 8px 14px; border-radius: 8px; border: 1px solid #c9d1dd; background: #fff; cursor: pointer; }
  .acciones button.principal { background: #1b2330; color: #fff; border-color: #1b2330; }
  header { border-bottom: 2px solid var(--tinta); padding-bottom: 14px; margin-bottom: 22px; }
  header h1 { font-size: 24px; margin: 0 0 4px; letter-spacing: -.01em; }
  header p { margin: 0; color: var(--suave); }
  h2 { font-size: 17px; margin: 30px 0 8px; padding-top: 8px; border-top: 1px solid var(--linea); }
  h3 { font-size: 14px; margin: 20px 0 6px; }
  .intro, .pie-tabla { color: var(--suave); font-size: 12.5px; margin: 4px 0 12px; }
  .pie-tabla { margin-top: 6px; }
  .cifras { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; margin: 12px 0 16px; }
  .cifras div { background: var(--zona); border-radius: 8px; padding: 10px 12px; display: flex; flex-direction: column; }
  .cifras span { font-size: 11.5px; color: var(--suave); text-transform: uppercase; letter-spacing: .04em; }
  .cifras strong { font-size: 20px; font-variant-numeric: tabular-nums; margin: 2px 0; }
  .cifras em { font-style: normal; font-size: 12px; color: var(--tenue); }
  .cifras .pos strong { color: var(--pos); } .cifras .neg strong { color: var(--neg); }
  table { width: 100%; border-collapse: collapse; font-variant-numeric: tabular-nums; }
  th, td { padding: 6px 8px; text-align: left; vertical-align: top; }
  thead th { font-size: 11.5px; color: var(--suave); text-transform: uppercase; letter-spacing: .03em; border-bottom: 1px solid var(--tinta); font-weight: 600; }
  tbody tr { border-bottom: 1px solid var(--linea); }
  tbody th { font-weight: 500; }
  tfoot th, tfoot td { border-top: 2px solid var(--tinta); font-weight: 700; }
  .num { text-align: right; white-space: nowrap; }
  .pos { color: var(--pos); } .neg { color: var(--neg); } .tenue { color: var(--tenue); } .fuerte { font-weight: 700; }
  .nota { display: block; font-size: 11.5px; color: var(--tenue); font-weight: 400; }
  .puente { max-width: 620px; }
  .puente tr.saldo th, .puente tr.saldo td { font-weight: 700; background: var(--zona); border-top: 1px solid var(--tinta); }
  .meses tr.previsto th, .meses tr.previsto td { color: #3d4757; background: #fafbfc; }
  .meses tr.en-curso { background: #fff8e8; }
  .meses td, .meses th { font-size: 12.5px; padding: 5px 6px; }
  .grafica { margin: 8px 0 4px; }
  .grafica svg { width: 100%; height: auto; display: block; }
  .grafica .eje { font-size: 11px; fill: var(--suave); }
  figcaption { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; color: var(--suave); margin-top: 4px; }
  figcaption i { display: inline-block; width: 18px; height: 3px; vertical-align: middle; margin-right: 6px; }
  figcaption i.punteada { height: 0; border-top: 2px dotted; } figcaption i.discontinua { height: 0; border-top: 2px dashed; }
  figcaption i.anillo { width: 10px; height: 10px; border: 2px solid ${Ot.hoy}; border-radius: 50%; }
  ul.comprobaciones { list-style: none; padding: 0; margin: 8px 0; }
  ul.comprobaciones li { padding: 3px 0; } ul.comprobaciones li.ok span { color: var(--pos); font-weight: 700; } ul.comprobaciones li.mal { color: var(--neg); }
  ul.avisos { margin: 8px 0; padding-left: 20px; color: #6b4e00; }
  footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid var(--linea); font-size: 11.5px; color: var(--tenue); }
  .tabla-ancha { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  @media (max-width: 640px) {
    .hoja { margin: 0; padding: 22px 16px; border-radius: 0; }
    th, td { padding: 5px 5px; font-size: 12px; }
    .cifras strong { font-size: 17px; }
    h2 { font-size: 16px; }
  }
  @media print {
    body { background: #fff; } .hoja { box-shadow: none; margin: 0; padding: 0; max-width: none; } .acciones { display: none; }
    h2 { break-after: avoid; } table, figure, .cifras { break-inside: avoid; } @page { margin: 16mm 14mm; }
  }
</style>
</head>
<body>
<div class="acciones"><button type="button" class="principal" onclick="window.print()">Imprimir o guardar como PDF</button></div>
<main class="hoja">
  <header>
    <h1>Informe financiero · ${dt(t.proyecto)}</h1>
    <p>Del ${dt(Et(t.desde))} al ${dt(Et(t.hasta))} · ${t.tienePasado&&t.tieneFuturo?`pasado real hasta el ${dt(Et(t.corte))}, previsión desde entonces`:t.tieneFuturo?"todo el periodo es previsión":"todo el periodo es pasado real"} · generado el ${dt(Et(t.generadoEl))}</p>
  </header>

  <section>
    <h2 style="border-top:0;margin-top:0">1 · Resumen: del saldo inicial al final</h2>
    <div class="cifras">
      <div><span>Saldo al empezar</span><strong>${rt(t.saldoInicio)}</strong><em>real</em></div>
      ${t.tienePasado?`<div><span>Saldo hoy</span><strong>${rt(t.saldoHoy)}</strong><em>real · ${dt(Et(t.corte))}</em></div>`:""}
      ${s}
    </div>
    ${Bi(t)}
    <h3>El puente de saldo</h3>
    <p class="intro">Cada línea suma a la anterior. El pasado sale de tus cuentas reales; el futuro, de tus estimaciones, nóminas y préstamos. El saldo real de hoy cierra uno y abre el otro.</p>
    ${Gi(t.puente)}
  </section>

  ${Ui(t)}

  <section>
    <h2>3 · Mes a mes</h2>
    ${Vi(t.meses)}
  </section>

  ${Yi(t)}

  <section>
    <h2>5 · Comprobaciones</h2>
    <ul class="comprobaciones">${e}</ul>
    ${o?`<h3>A tener en cuenta</h3><ul class="avisos">${o}</ul>`:""}
  </section>

  <footer>Generado con FinanceApp. Las cifras previstas son estimaciones: dependen de los gastos, nóminas y préstamos que tengas dados de alta.${t.imprevistos&&t.imprevistos.meses>0?` La reserva para imprevistos usa la media de lo marcado como imprevisto en ${t.imprevistos.meses} meses (${rt(t.imprevistos.mediaMensual)}/mes).`:""}</footer>
</main>
</body>
</html>`}function Ki(t,a,e){const o=t||[];if(!o.length)return a;const s=o.find(i=>i.año===e);if(s)return s.tramos;const n=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return n.length?n[0].tramos:a}function me(t,a){return e=>Ki(t,a,e)}const ee=11,us=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],ps=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function ka(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const ms="default";function fs(){return{_id:ms,nombre:"Yo",esPorDefecto:!0,activo:!0}}function La(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:us,tramosGananciasCapital:ps,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],cierreOmitidos:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function Oa(t,a){return{loans:[],expenses:[],accounts:[ka(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[fs()],config:La(t,a)}}const Nt=t=>Array.isArray(t)?t:[],Ji=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Ne(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function gs(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function Ha(t){const{varianza:a,inflacion:e,...o}=t;return o}function Qi(t,a){const{hoyISO:e,finISO:o}=a,s={...t},n=Ji(t.config),r={...La(e,o)};for(const[p,d]of Object.entries(n))d!=null&&(r[p]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=us),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=ps),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),s.config=r;let c=Nt(t.accounts).map(p=>{const d={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...p};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),Ne(d)});c.length===0&&(c=[ka(e)]);const l=c.filter(p=>p.esCuentaPrincipal);if(l.length===0){const p=c.find(d=>d._id==="default")||c[0];c=c.map(d=>({...d,esCuentaPrincipal:d._id===p._id}))}else if(l.length>1){let p=!1;c=c.map(d=>d.esCuentaPrincipal?p?{...d,esCuentaPrincipal:!1}:(p=!0,d):d)}return s.accounts=c,s.expenses=Nt(t.expenses).map(p=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...p};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=gs(d.diaPago),Ha(Ne(d))}),s.loans=Nt(t.loans).map(p=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...p};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=gs(d.diaPago),d.amortizaciones=Nt(d.amortizaciones).map(u=>Ne(u)),Ha(Ne(d))}),s.nominas=Nt(t.nominas).map(p=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...p};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),Ha(Ne(d))}),s.goals=Nt(t.goals).map((p,d)=>{const u=Array.isArray(p.cuentaIds)?p.cuentaIds:p.cuentaId?[p.cuentaId]:[],{cuentaId:v,...g}=p;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...g,cuentaIds:u}}),s.inflacion=Nt(t.inflacion),s.tramosIRPFHistorico=Nt(t.tramosIRPFHistorico),s.tramosGananciasCapitalHistorico=Nt(t.tramosGananciasCapitalHistorico),s.escenarios=Nt(t.escenarios).map(({inversiones:p,...d})=>d),s}const fe=t=>Array.isArray(t)?t:[];let Ba=0;function Xi(t){return Ba+=1,`${t}_${Ba.toString(36)}`}const Zi=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),tr=t=>typeof t=="number"&&Number.isFinite(t);function er(t,a){const e={...t};Ba=0;const o=fe(t.transacciones),s=fe(t.puntosControl),n=[...s],i=new Set(s.map(l=>`${l.cuentaId}|${l.fecha}`)),r=(l,p,d,u)=>{if(!Zi(p)||!tr(d))return;const v=`${l}|${p}`;i.has(v)||(i.add(v),n.push({_id:Xi("pc"),fecha:p,cuentaId:l,saldoCts:Pt(d),...typeof u=="string"&&u?{nota:u}:{}}))};for(const l of fe(t.accounts)){const p=typeof l._id=="string"?l._id:null;if(p)for(const d of fe(l.historicoSaldos))r(p,d.fecha,d.saldo,d.nota)}const c=fe(t.history);if(c.length>0){const l=fe(t.accounts),p=l.find(u=>u.esCuentaPrincipal)||l.find(u=>u.activo)||l[0],d=typeof(p==null?void 0:p._id)=="string"?p._id:"default";for(const u of c){const v=typeof u.cuenta=="string"?u.cuenta:typeof u.cuentaId=="string"?u.cuentaId:d;r(v,u.fecha,u.saldo,u.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=n.sort((l,p)=>String(l.fecha).localeCompare(String(p.fecha))),e}const Ga=t=>Array.isArray(t)?t:[],ar=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),or=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Va=0;function sr(){return Va+=1,`tx_hp_${Va.toString(36)}`}function nr(t,a){const e={...t};Va=0;const o=[...Ga(t.transacciones)],s=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),n=Ga(t.expenses).map(i=>{const r=Ga(i.historialPrecios),c=typeof i._id=="string"?i._id:null,l=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",p=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(g=>typeof g=="string"):[];if(c)for(const g of r){if(!g||!ar(g.fecha)||!or(g.cuantia))continue;const b=p==="ingreso"?Pt(g.cuantia):-Pt(g.cuantia),$=`${c}|${g.fecha}|${b}`;s.has($)||(s.add($),o.push({_id:sr(),fecha:g.fecha,cuentaId:l,importeCts:b,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:c,tipo:p,origen:"importado",nota:typeof g.nota=="string"&&g.nota?g.nota:"Importado del historial de precios"}))}const{historialPrecios:u,...v}=i;return v});return e.expenses=n,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const vs=t=>Array.isArray(t)?t:[],Xt=(t,a="")=>typeof t=="string"&&t.trim()?t:a,ge=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,ir=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function rr(t,a){var p;const e={...t};if(Array.isArray(e.planes))return e;const o=vs(e.goals),s=vs(e.accounts),n=s.map(d=>{const u=ge(d.bloqueoMeses,0);return{_id:`veh_${Xt(d._id,"x")}`,nombre:Xt(d.nombre,"Cuenta"),rentabilidadRealAnual:ge(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":u>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:ge(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?Pt(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:Xt(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:ge(d.interes,0)>0}}),i=new Map(s.map((d,u)=>[Xt(d._id,""),n[u]._id])),r=((p=n[0])==null?void 0:p._id)??"",c=o.map((d,u)=>{const v=Array.isArray(d.cuentaIds)?d.cuentaIds.map(b=>Xt(b,"")):[],g=ir(d.targetDate);return{_id:Xt(d._id,`obj_mig_${u}`),nombre:Xt(d.nombre,`Objetivo ${u+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:Pt(ge(d.targetAmount,0)),fechaLimite:g,prioridad:ge(d.prioridad,u+1),modoAsignacion:g?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:Xt(d.notas,"")}}),l={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:n,objetivos:c,eventos:[],creadoEn:a.hoyISO};return e.planes=[l],e}function cr(t,a){const e={...t},o=Array.isArray(e.personas)?e.personas:[];return o.some(s=>(s==null?void 0:s._id)===ms)||(e.personas=[fs(),...o]),e}const Re=t=>Array.isArray(t)?t:[];function ia(t){const{escenarioIds:a,...e}=t;return Array.isArray(e.amortizaciones)&&(e.amortizaciones=e.amortizaciones.map(o=>{const{escenarioIds:s,...n}=o;return n})),e}function lr(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function dr(t,a){const e={...t};if(e.escenarios===void 0&&e.planes===void 0&&e.goals===void 0)return e;if(e.loans=Re(e.loans).map(ia),e.expenses=Re(e.expenses).map(ia),e.nominas=Re(e.nominas).map(ia),e.accounts=Re(e.accounts).map(ia),delete e.escenarios,e.config&&typeof e.config=="object"){const{escenarioActivo:s,...n}=e.config;e.config=n}delete e.goals;const o=Re(e.planes).filter(lr);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),e._migracion010_planesArchivados=o),delete e.planes,e}const bs="supuesto-archivado",ve=t=>Array.isArray(t)?t:[],hs=t=>Array.isArray(t.escenarioIds)&&t.escenarioIds.length>0;function ur(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function pr(t,a){const e={...t};let o=0;const s=[],n=c=>{const{escenarioIds:l,...p}=c;if(!hs(c))return p;o+=1;const d=Array.isArray(p.tags)?p.tags:[];return{...p,activo:!1,tags:d.includes(bs)?d:[...d,bs]}};e.expenses=ve(e.expenses).map(n),e.nominas=ve(e.nominas).map(n),e.accounts=ve(e.accounts).map(c=>{if(c._id==="default"||c.esCuentaPrincipal){const{escenarioIds:l,...p}=c;return p}return n(c)}),e.loans=ve(e.loans).map(c=>{const l=n(c);if(Array.isArray(l.amortizaciones)){const p=[];for(const d of l.amortizaciones){const{escenarioIds:u,...v}=d;hs(d)?s.push({...v,loanId:String(c._id??""),loanNombre:c.nombre}):p.push(v)}l.amortizaciones=p}return l});const i=[...ve(e._migracion010_planesArchivados),...ve(e.planes).filter(ur)];delete e._migracion010_planesArchivados,delete e.planes,delete e.goals,delete e.escenarios;const r=e.config&&typeof e.config=="object"?{...e.config}:{};if(delete r.escenarioActivo,i.length>0||s.length>0||o>0){const c=r.archivoMigracion011??{},l={planes:[...c.planes??[],...i],amortizaciones:[...c.amortizaciones??[],...s],desactivados:(c.desactivados??0)+o};r.archivoMigracion011=l}return(e.config!==void 0||r.archivoMigracion011)&&(e.config=r),e}const mr=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Qi},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:er},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:nr},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:rr},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:cr},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:dr},{version:11,describe:"Termina la 010: desactiva lo que solo existía en un supuesto, archiva planes y retira las claves huérfanas",migrate:pr}],ys=["history","escenarios","planes","goals"],fr=["escenarios","planes","goals"];function $s(t,a,e){let o=t;const s=[];for(const n of[...mr].sort((i,r)=>i.version-r.version))(a??0)>=n.version||(o=n.migrate(o,e),s.push(n.version));return{state:o,applied:s}}const zt="state_",ke="state__schemaVersion",be="financeapp_",Ua="state__modificadoEn",xs="financeapp:sin-espacio";function gr(){try{typeof window<"u"&&window.dispatchEvent(new CustomEvent(xs))}catch{}}function Is(t=localStorage,a=be){const e=o=>`${a}${o}`;return{get(o){try{const s=t.getItem(e(o));return s===null?null:JSON.parse(s)}catch{return null}},set(o,s){try{t.setItem(e(o),JSON.stringify(s)),o!==Ua&&t.setItem(e(Ua),JSON.stringify(Date.now()))}catch(n){console.error("No se pudo guardar en localStorage:",o,n),gr()}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(a)&&o.push(n.slice(a.length))}return o}}}function vr(t=localStorage,a=be){const e=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(zt)&&!n.startsWith(a)&&e.push(n)}const o=[];for(const s of e)try{const n=t.getItem(s);n!==null&&t.getItem(`${a}${s}`)===null&&(t.setItem(`${a}${s}`,n),o.push(s)),t.removeItem(s)}catch{}return o}function br({ventanaMs:t=15e3,ahora:a=()=>Date.now()}={}){let e=null;function o(){return e?a()-e.cuando>t?(e=null,null):e:null}return{registrar(s){e={...s,cuando:a()}},pendiente:o,tomar(){const s=o();return e=null,s},limpiar(){e=null}}}const hr={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function yr(t,a){const e=hr[t]??{articulo:"El",que:"elemento"},o=a.concepto??a.nombre??a.titulo??(a.year!==void 0?String(a.year):null);return o?`${e.articulo} ${e.que} «${String(o)}»`:`${e.articulo} ${e.que}`}function $r(t){return ot(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function xr({adapter:t,hoy:a=new Date}){const e=ot(a),o=$r(a);let s=Oa(e,o);const n=new Set;let i=[];const r=br();function c(x){for(const z of n)z(x)}function l(x){t.set(`${zt}${x}`,s[x])}function p(){const x={};for(const F of Object.keys(s)){const R=t.get(`${zt}${F}`);R!==null&&(x[F]=R)}for(const F of ys){const R=t.get(`${zt}${F}`);R!==null&&(x[F]=R)}const z=t.get(ke),{state:T,applied:q}=$s(x,z,{hoyISO:e,finISO:o});if(s=d(T),u(),q.length>0){for(const F of Object.keys(s))l(F);t.set(ke,ee);for(const F of fr)t.remove(`${zt}${F}`)}return i=q,{applied:q}}function d(x){const z=Oa(e,o),T={...z,...x};for(const F of Object.keys(z))F!=="config"&&(Array.isArray(T[F])||(T[F]=z[F]));const q=x.config&&typeof x.config=="object"?x.config:{};return T.config={...La(e,o),...q},T}function u(){if(!Array.isArray(s.accounts)||s.accounts.length===0){s.accounts=[ka(e)],l("accounts");return}const x=s.accounts.filter(z=>z.esCuentaPrincipal);if(x.length===0)s.accounts=s.accounts.map((z,T)=>T===0?{...z,esCuentaPrincipal:!0}:z),l("accounts");else if(x.length>1){let z=!1;s.accounts=s.accounts.map(T=>T.esCuentaPrincipal?z?{...T,esCuentaPrincipal:!1}:(z=!0,T):T),l("accounts")}}function v(x){return s[x]}function g(x,z){s[x]=z,l(x),c(x)}function b(x){g("config",{...s.config,...x})}function $(x){return n.add(x),()=>n.delete(x)}function f(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function h(x,z){const T=[...s[x]],q={...z,_id:f()};return T.push(q),g(x,T),q}function S(x,z,T){const q=s[x].map(F=>F._id===z?{...F,...T}:F);g(x,q)}function w(x,z){const T=s[x],q=T.findIndex(F=>F._id===z);q<0||(r.registrar({col:x,item:T[q],indice:q}),g(x,T.filter((F,R)=>R!==q)))}function I(){const x=r.tomar();if(!x)return null;const z=[...s[x.col]];return z.splice(Math.min(x.indice,z.length),0,x.item),g(x.col,z),x}function A(){return r.pendiente()}function M(){const x=s.accounts||[],z=x.find(T=>T.esCuentaPrincipal&&T.activo)||x.find(T=>T.activo);return z?z._id:"default"}function C(x){var z;return((z=s.accounts.find(T=>T._id===x))==null?void 0:z.nombre)??x}function y(){return me(s.tramosIRPFHistorico,s.config.tramos_irpf)}function E(){return me(s.tramosGananciasCapitalHistorico,s.config.tramosGananciasCapital)}function _(){return structuredClone(s)}function P(x,z=null){const{state:T,applied:q}=$s(x,z,{hoyISO:e,finISO:o});s=d(T),u();for(const F of Object.keys(s))l(F);t.set(ke,ee);for(const F of Object.keys(s))c(F);return{applied:q}}return{load:p,get:v,set:g,patchConfig:b,subscribe:$,addItem:h,updateItem:S,removeItem:w,deshacerBorrado:I,borradoPendiente:A,getPrincipalAccountId:M,accountName:C,resolverTramosIRPF:y,resolverTramosGanancias:E,snapshot:_,replaceAll:P,get schemaVersion(){return ee},get migrationsApplied(){return[...i]},get today(){return e||st()}}}function Ir(){let t=0,a=null;const e=new Set;function o(s){t+=1,a=s;for(const n of e)try{n(t,s)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>a,marcar:o,suscribir(s){return e.add(s),()=>e.delete(s)},crearMarca(s){let n=t;return{nombre:s,pendiente:()=>t>n,alDia:i=>{n=Math.max(n,i??t)},vista:()=>n}}}}const ae=Object.keys(Oa("1970-01-01","1970-01-01"));function ws(t){const a={};for(const e of ae){const o=t.get(`${zt}${e}`);o!=null&&(a[e]=o)}return a}function wr(t,a){const e=[];for(const o of ae){const s=a[o];s!=null&&(t(`${zt}${o}`,s),e.push(o))}return e}function Cr(t){return ae.filter(a=>t[a]===void 0||t[a]===null)}function Sr(t){var i;const a=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!ae.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>a(r).length===0))return!1;const o=a("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?a("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const Cs="_schemaVersion";function Mr(t,a){const e=t[Cs];if(typeof e=="number"&&Number.isFinite(e))return Math.min(e,a);const o=r=>Array.isArray(t[r])?t[r]:[],s=t.config&&typeof t.config=="object"?t.config:null;if(s&&s.features===void 0)return 4;if(t.transacciones===void 0&&t.expenses!==void 0)return 5;if(o("expenses").some(r=>Array.isArray(r.historialPrecios)&&r.historialPrecios.length>0))return 6;if(t.personas===void 0&&t.expenses!==void 0)return 8;const n=r=>r.some(c=>Array.isArray(c.escenarioIds)&&c.escenarioIds.length>0);return t.escenarios!==void 0||t.planes!==void 0||t.goals!==void 0||n(o("expenses"))||n(o("loans"))||n(o("nominas"))||n(o("accounts"))||o("loans").some(r=>n(Array.isArray(r.amortizaciones)?r.amortizaciones:[]))?Math.min(10,a):a}const Ss=`${be}meta_proyectos`,Ms=`${be}meta_proyectoActivo`,oe="default",Ar="Mis finanzas";function Ya(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function he(t){return t===oe?be:`${be}p_${t}_`}function As(){return[...ae.map(t=>`${zt}${t}`),ke,Ua]}function Er(t=localStorage){function a(){try{const d=t.getItem(Ss);if(!d)return[];const u=JSON.parse(d);return Array.isArray(u)?u:[]}catch{return[]}}function e(d){t.setItem(Ss,JSON.stringify(d))}function o(){const d=a();if(d.some(g=>g._id===oe))return d;const u=Date.now(),v=[{_id:oe,nombre:Ar,creadoEn:u,actualizadoEn:u},...d];return e(v),v}function s(){try{const d=t.getItem(Ms);if(!d)return oe;const u=JSON.parse(d);return typeof u=="string"&&u?u:oe}catch{return oe}}function n(d){t.setItem(Ms,JSON.stringify(d))}function i(d){const u=d.trim()||"Proyecto sin nombre",v=Date.now(),g={_id:Ya(),nombre:u,creadoEn:v,actualizadoEn:v};return e([...o(),g]),g}function r(d,u){const v=u.trim();v&&e(o().map(g=>g._id===d?{...g,nombre:v,actualizadoEn:Date.now()}:g))}function c(d,u){const v=o().find(f=>f._id===d);if(!v)throw new Error("Proyecto no encontrado.");const g=he(d),b={_id:Ya(),nombre:(u==null?void 0:u.trim())||`${v.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},$=he(b._id);for(const f of As()){const h=t.getItem(`${g}${f}`);h!==null&&t.setItem(`${$}${f}`,h)}return e([...o(),b]),b}function l(d){if(d===oe)throw new Error("No se puede eliminar el proyecto original.");if(d===s())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const u=o();if(!u.some(g=>g._id===d))return;const v=he(d);for(const g of As())t.removeItem(`${v}${g}`);e(u.filter(g=>g._id!==d))}function p(d){const u=new Map(o().map(g=>[g._id,g]));for(const g of d){if(!g||typeof g._id!="string")continue;const b=u.get(g._id);(!b||(g.actualizadoEn??0)>b.actualizadoEn)&&u.set(g._id,g)}const v=[...u.values()];return e(v),v}return{listar:o,activo:s,establecerActivo:n,crear:i,renombrar:r,duplicar:c,eliminar:l,fusionarRemotos:p}}function Pr(t,a,e){const o=Is(t,he(a)),s={};for(const n of e){const i=o.get(`${zt}${n}`);s[n]=Array.isArray(i)?i:[]}return s}function _r(t){const a=new Map;for(const s of Object.values(t))for(const n of s){const i=n==null?void 0:n._id;typeof i=="string"&&!a.has(i)&&a.set(i,Ya())}function e(s){if(typeof s=="string")return a.get(s)??s;if(Array.isArray(s))return s.map(e);if(s&&typeof s=="object"){const n={};for(const[i,r]of Object.entries(s))n[i]=e(r);return n}return s}const o={};for(const[s,n]of Object.entries(t))o[s]=n.map(e);return o}const At={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},Zt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:At.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:At.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:At.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:At.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:At.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:At.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:At.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:At.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:At.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:At.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:At.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:At.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:At.datos,porDefecto:!1,dependencias:["sync-nube"]}],Fr=new Map(Zt.map(t=>[t.id,t]));function Le(t){return Fr.get(t)}function Es(t){return Zt.filter(a=>(a.dependencias||[]).includes(t))}function Wa(){const t={};for(const a of Zt)t[a.id]=a.porDefecto;return t}function Ps(){const t=[],a=new Map;for(const e of Zt)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function Dr(t){function a(){return{...Wa(),...t.get("config").features||{}}}function e(d){t.patchConfig({features:d})}function o(d,u=a(),v=new Set){const g=Le(d);if(!g)return!1;if(g.nucleo)return!0;if(u[d]===!1)return!1;if(v.has(d))return!0;v.add(d);for(const b of g.dependencias||[])if(!o(b,u,v))return!1;return!0}function s(d,u=a()){const v=Le(d);return v?(v.dependencias||[]).filter(g=>!o(g,u)):[]}function n(d,u){var S;const v=Le(d);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const g=a(),b=new Map(Zt.map(w=>[w.id,o(w.id,g)])),$={...g,[d]:u};let f;if(u){const w=[...v.dependencias||[]];for(;w.length;){const I=w.pop();$[I]===!1&&($[I]=!0,f="dependencias-activadas"),w.push(...((S=Le(I))==null?void 0:S.dependencias)||[])}}else{const w=Es(d).map(I=>I.id);for(;w.length;){const I=w.pop();$[I]!==!1&&($[I]=!1,f="cascada-apagado"),w.push(...Es(I).map(A=>A.id))}}return e($),{cambiadas:Zt.filter(w=>o(w.id,$)!==b.get(w.id)).map(w=>w.id),motivo:f}}function i(){const d=a();return Zt.map(u=>{const v=s(u.id,d);return{...u,activa:o(u.id,d),...v.length>0&&d[u.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const d=a();return Ps().map(({grupo:u,features:v})=>({grupo:u,features:v.map(g=>{const b=s(g.id,d);return{...g,activa:o(g.id,d),...b.length>0&&d[g.id]!==!1?{bloqueadaPor:b}:{}}})}))}function c(){e(Wa())}function l(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:a()}}function p(d){const u=d,v=u&&typeof u=="object"&&u.features&&typeof u.features=="object"?u.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const g=Wa(),b=[],$=[];for(const[f,h]of Object.entries(v)){if(!Le(f)){$.push(f);continue}if(typeof h!="boolean"){$.push(f);continue}g[f]=h,b.push(f)}return e(g),{aplicadas:b,ignoradas:$}}return{isEnabled:d=>o(d),setEnabled:n,estado:i,estadoPorGrupo:r,reset:c,exportProfile:l,importProfile:p,bloqueadaPor:d=>s(d)}}const Oe=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function ye(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Tr(t){var s,n;const e=(((s=t.bloqueadaPor)==null?void 0:s.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(n=t.bloqueadaPor)==null?void 0:n.map(Oe).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${Oe(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${Oe(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${Oe(t.descripcion)}</div>
        ${e}
      </div>
    </div>`}function zr(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:s})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Oe(o)}</div>
        ${s.map(Tr).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function jr(t){var s;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-feature-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function qr(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${zr(e)}`,s(i)}function s(i){var c,l,p;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var g;const u=d.dataset.featureToggle,v=e.setEnabled(u,d.checked);v.motivo==="dependencias-activadas"&&ye(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&ye(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(g=t.onChange)==null||g.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const d=e.exportProfile(),u=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),v=URL.createObjectURL(u),g=a.createElement("a");g.href=v,g.download=`financeapp-funcionalidades-${st()}.json`,g.click(),URL.revokeObjectURL(v),ye(t,"Perfil de funcionalidades guardado")}),(l=i.querySelector('[data-feature-action="import"]'))==null||l.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var u,v;const d=(u=r.files)==null?void 0:u[0];if(d)try{const{aplicadas:g,ignoradas:b}=e.importProfile(JSON.parse(await d.text()));ye(t,b.length>0?`Perfil cargado (${g.length} aplicadas, ${b.length} ignoradas por ser de otra versión)`:`Perfil cargado (${g.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,g),o(i)}catch(g){ye(t,"No se pudo cargar el perfil: "+g.message,"err")}finally{r.value=""}}),(p=i.querySelector('[data-feature-action="reset"]'))==null||p.addEventListener("click",()=>{var d;e.reset(),ye(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function n(){const i=jr(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:n,renderInto:o}}const Rt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Nr={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function _s(t){return Nr[t]??t}function Ht(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Fs(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function Rr(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function kr(){var a,e,o,s;const t=globalThis;(e=(a=t.State)==null?void 0:a.load)==null||e.call(a),(s=(o=t.Router)==null?void 0:o.rerender)==null||s.call(o)}function Lr(t){var s;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-proyectos-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function Or(t,a){const e=t._id===a,o=t._id==="default";return`
    <div class="dm-section" data-proyecto-fila="${Rt(t._id)}" style="padding:12px 15px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${Rt(t.nombre)}
        </div>
        ${e?'<span class="dm-badge dm-badge--local">Activo</span>':""}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${e?"":`<button class="btn-primary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="cambiar" data-proyecto-id="${Rt(t._id)}">Cambiar a este</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="renombrar" data-proyecto-id="${Rt(t._id)}">Renombrar</button>
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="duplicar" data-proyecto-id="${Rt(t._id)}">Duplicar</button>
        ${o||e?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-proyecto-accion="eliminar" data-proyecto-id="${Rt(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Hr(t,a,e){const o=t.filter(i=>i._id!==a);if(o.length===0)return"";const s=o.map(i=>`<option value="${Rt(i._id)}">${Rt(i.nombre)}</option>`).join(""),n=e.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${Rt(i)}"/> ${Rt(_s(i))}
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
      <select id="proyecto-import-origen" class="auth-input" style="margin:4px 0 10px">${s}</select>
      <div style="max-height:180px;overflow-y:auto;border:1px solid var(--hairline-soft);border-radius:8px;padding:6px 10px;margin-bottom:10px">
        ${n}
      </div>
      <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-import-btn">Importar</button>
    </div>`}function Br(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function Gr(t){const a=t.document??document,{proyectos:e}=t;function o(){const r=e.listar(),c=e.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(l=>Or(l,c)).join("")}
      </div>
      ${Br()}
      ${Hr(r,c,e.colecciones)}`}function s(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,n(r)}function n(r){var c,l;r.querySelectorAll("[data-proyecto-accion]").forEach(p=>{p.addEventListener("click",()=>{const d=p.dataset.proyectoId,u=p.dataset.proyectoAccion,v=e.listar().find(g=>g._id===d);if(v){if(u==="cambiar"){if(!Fs(t,`¿Cambiar a "${v.nombre}"? Se recargará la página.`))return;e.cambiarA(d),Rr(t);return}if(u==="renombrar"){const g=typeof prompt=="function"?prompt("Nuevo nombre",v.nombre):null;if(!g||!g.trim())return;e.renombrar(d,g.trim()),Ht(t,"Proyecto renombrado"),s(r);return}if(u==="duplicar"){const g=`${v.nombre} (copia)`,b=typeof prompt=="function"?prompt("Nombre de la copia",g):g;if(b===null)return;const $=e.duplicar(d,b.trim()||g);Ht(t,`"${$.nombre}" creado como copia de "${v.nombre}" ✓`),s(r);return}if(u==="eliminar"){if(!Fs(t,`¿Eliminar "${v.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{e.eliminar(d),Ht(t,`"${v.nombre}" eliminado`),s(r)}catch(g){Ht(t,g.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const p=r.querySelector("#proyecto-nuevo-nombre"),d=p==null?void 0:p.value.trim();if(!d){Ht(t,"Ponle un nombre al proyecto","warn");return}const u=e.crear(d);Ht(t,`"${u.nombre}" creado ✓`),s(r)}),(l=r.querySelector("#proyecto-import-btn"))==null||l.addEventListener("click",()=>{var v;const p=(v=r.querySelector("#proyecto-import-origen"))==null?void 0:v.value;if(!p)return;const d=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(g=>g.dataset.proyectoImportCol);if(d.length===0){Ht(t,"Elige al menos una colección para importar","warn");return}const{importadas:u}=e.importarDesde(p,d);if(u.length===0){Ht(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}Ht(t,`Importado: ${u.map(_s).join(", ")} ✓`),kr(),s(r)})}function i(){const r=Lr(a);s(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:s}}const ra=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],se=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function $e(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Vr(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function Ur(t){var s;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-personas-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function Yr(t){const a=t.color||ra[0];return`
    <div class="dm-section" data-persona-fila="${se(t._id)}" style="padding:12px 15px;${t.activo?"":"opacity:.55"}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${se(a)};flex:none"></span>
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${se(t.nombre)}
        </div>
        ${t.esPorDefecto?'<span class="dm-badge dm-badge--local">Por defecto</span>':""}
        ${t.activo?"":'<span class="dm-badge">Inactiva</span>'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="renombrar" data-persona-id="${se(t._id)}">Renombrar</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="defecto" data-persona-id="${se(t._id)}">Hacer por defecto</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="activo" data-persona-id="${se(t._id)}">${t.activo?"Desactivar":"Activar"}</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-persona-accion="eliminar" data-persona-id="${se(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Wr(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${ra.map((t,a)=>`<div data-persona-color="${t}" style="width:22px;height:22px;border-radius:50%;background:${t};cursor:pointer;
                border:2px solid ${a===0?"white":"transparent"}"></div>`).join("")}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${ra[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`}function Kr(t){const a=t.document??document,{store:e}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${e.get("personas").map(Yr).join("")}
      </div>
      ${Wr()}`}function s(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function n(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var p;c.querySelectorAll("[data-persona-accion]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.personaId,v=d.dataset.personaAccion,g=e.get("personas"),b=g.find($=>$._id===u);if(b){if(v==="renombrar"){const $=typeof prompt=="function"?prompt("Nuevo nombre",b.nombre):null;if(!$||!$.trim())return;e.updateItem("personas",u,{nombre:$.trim()}),$e(t,"Persona renombrada"),n(),s(c);return}if(v==="defecto"){e.set("personas",g.map($=>({...$,esPorDefecto:$._id===u}))),$e(t,`"${b.nombre}" es ahora la persona por defecto`),n(),s(c);return}if(v==="activo"){e.updateItem("personas",u,{activo:!b.activo}),n(),s(c);return}if(v==="eliminar"){if(g.length<=1){$e(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!Vr(t,`¿Eliminar "${b.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;e.removeItem("personas",u),$e(t,`"${b.nombre}" eliminada`),n(),s(c)}}})});const l=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(d=>{d.addEventListener("click",()=>{const u=d.getAttribute("data-persona-color");l&&(l.value=u),c.querySelectorAll("[data-persona-color]").forEach(v=>{v.style.border=v.getAttribute("data-persona-color")===u?"2px solid white":"2px solid transparent"})})}),(p=c.querySelector("#persona-nuevo-btn"))==null||p.addEventListener("click",()=>{const d=c.querySelector("#persona-nuevo-nombre"),u=d==null?void 0:d.value.trim();if(!u){$e(t,"Ponle un nombre a la persona","warn");return}const v=(l==null?void 0:l.value)||ra[0],g=e.addItem("personas",{nombre:u,color:v,esPorDefecto:!1,activo:!0});$e(t,`"${g.nombre}" creada ✓`),n(),s(c)})}function r(){const c=Ur(a);s(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:s}}const Ds={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function Ts(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const s=a(o);e.style.display=s?"":"none",s?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function Jr({flags:t,document:a=document,router:e,rutasExtra:o}){function s(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function n(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([l,p])=>[p,l]);for(const[l,p]of[...Object.entries(Ds),...c]){const d=t.isEnabled(l),u=a.querySelector(`.nav-btn[data-view="${p}"]`);u&&(u.style.display=d?"":"none"),!d&&s()===p&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(l=>{const p=[...l.querySelectorAll(".nav-btn[data-view]")];if(p.length===0)return;const d=p.some(u=>u.style.display!=="none");l.style.display=d?"":"none"}),Ts(a,l=>t.isEnabled(l)),r){const l=e??globalThis.Router;l==null||l.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const l=new MutationObserver(()=>{if(!c){c=!0;try{Ts(a,p=>t.isEnabled(p))}finally{c=!1}}});return l.observe(r,{childList:!0,subtree:!0}),()=>l.disconnect()}return{apply:n,observar:i,vistaPara:r=>Ds[r]}}const Qr="toast toast-deshacer";function Xr(t){const{store:a,rerender:e,duracionMs:o=12e3}=t,s=t.contenedor??(()=>document.getElementById("toast-container"));let n=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,n==null||n.remove(),n=null}function l(d){const u=s();if(!u)return;c();const v=document.createElement("div");v.className=Qr,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const g=document.createElement("span");g.textContent=`${yr(d.col,d.item)} se ha eliminado.`,g.style.flex="1";const b=document.createElement("button");b.type="button",b.className="btn-secondary btn-sm",b.textContent="Deshacer",b.style.flexShrink="0",b.addEventListener("click",()=>{const $=a.deshacerBorrado();if(c(),!$)return;const f=s();if(f){const h=document.createElement("div");h.className="toast toast-ok",h.textContent="Deshecho.",f.appendChild(h),setTimeout(()=>h.remove(),2500)}e==null||e()}),v.appendChild(g),v.appendChild(b),u.appendChild(v),n=v,i=setTimeout(c,o)}const p=a.subscribe(()=>{const d=a.borradoPendiente();if(!d){r=null,c();return}d!==r&&(r=d,l(d))});return()=>{p(),c()}}function ca(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function zs(t,a){const e=ca(t),o=ca(a);if(!o)return-1;const s=e.indexOf(o);return s<0?-1:s===0?0:/[\s\-/_(«"']/.test(e[s-1])?1:2}const He=t=>{const a=Number(t);return Number.isFinite(a)?`${a.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function Zr(t){const a=[],e=o=>{var s,n;return((n=(s=t.accounts)==null?void 0:s.find(i=>i._id===o))==null?void 0:n.nombre)??""};for(const o of t.expenses??[]){const s=o.tipo==="ingreso";a.push({tipo:s?"ingreso":"gasto",etiqueta:s?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[He(o.cuantia),e(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],e(o.cuenta)].join(" ")})}for(const o of t.accounts??[])a.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:He(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])a.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:He(o.capital),ruta:"loans",extra:[...o.tags??[],e(o.cuenta)].join(" ")});for(const o of t.nominas??[])a.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${He(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])a.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,He(o.importeCts/100),e(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return a}function tc(t,a,e={}){const{maximo:o=12,rutasDisponibles:s=null}=e,n=ca(a);if(n.length<2)return[];const i=c=>s===null||s.includes(c),r=[];for(const c of Zr(t)){if(!i(c.ruta))continue;const l=zs(c.titulo,n),p=l>=0?-1:Math.min(zs(c.extra??"",n),2);if(l<0&&p<0)continue;const d=l>=0?l:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:d*1e3+Math.min(999,ca(c.titulo).length)})}return r.sort((c,l)=>c.peso-l.peso||c.titulo.localeCompare(l.titulo,"es")),r.slice(0,o)}const ec="buscador-overlay",js="btn-buscador";function ac(t){const a=t.doc??document,e=t.rutasDisponibles??(()=>null);let o=null,s=null,n=null,i=[],r=0;function c(){const w=a.createElement("div");w.id=ec,w.className="modal-overlay",w.style.alignItems="flex-start",w.style.paddingTop="10vh";const I=a.createElement("div");I.className="modal-box",I.style.maxWidth="560px",I.style.padding="14px";const A=a.createElement("input");A.type="search",A.className="form-input",A.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",A.setAttribute("aria-label","Buscar en toda la aplicación"),A.autocomplete="off";const M=a.createElement("div");return M.style.marginTop="10px",M.style.maxHeight="52vh",M.style.overflowY="auto",I.appendChild(A),I.appendChild(M),w.appendChild(I),a.body.appendChild(w),w.addEventListener("click",C=>{C.target===w&&b()}),A.addEventListener("input",()=>{r=0,p()}),A.addEventListener("keydown",v),o=w,s=A,n=M,w}function l(){if(n){if(n.textContent="",i.length===0){const w=a.createElement("div");w.style.padding="14px 4px",w.style.fontSize="13px",w.style.color="var(--text3)";const I=(s==null?void 0:s.value.trim())??"";w.textContent=I.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",n.appendChild(w);return}i.forEach((w,I)=>{const A=a.createElement("button");A.type="button",A.className="buscador-fila",A.dataset.indice=String(I),I===r&&A.classList.add("activa");const M=a.createElement("div");M.style.minWidth="0";const C=a.createElement("div");C.textContent=w.titulo,C.style.fontSize="13px",C.style.overflow="hidden",C.style.textOverflow="ellipsis",C.style.whiteSpace="nowrap";const y=a.createElement("div");y.textContent=w.detalle,y.style.fontSize="11px",y.style.color="var(--text3)",y.style.overflow="hidden",y.style.textOverflow="ellipsis",y.style.whiteSpace="nowrap",M.appendChild(C),w.detalle&&M.appendChild(y);const E=a.createElement("span");E.className="tag",E.textContent=w.etiqueta,E.style.flexShrink="0",A.appendChild(M),A.appendChild(E),A.addEventListener("click",()=>u(I)),n.appendChild(A)})}}function p(){const w=(s==null?void 0:s.value)??"";i=tc(t.estado(),w,{rutasDisponibles:e()}),r>=i.length&&(r=Math.max(0,i.length-1)),l()}function d(w){var I,A;i.length!==0&&(r=(r+w+i.length)%i.length,l(),(A=(I=n==null?void 0:n.querySelector(".buscador-fila.activa"))==null?void 0:I.scrollIntoView)==null||A.call(I,{block:"nearest"}))}function u(w){const I=i[w];I&&(b(),t.navegar(I.ruta))}function v(w){w.key==="Escape"?(w.preventDefault(),b()):w.key==="ArrowDown"?(w.preventDefault(),d(1)):w.key==="ArrowUp"?(w.preventDefault(),d(-1)):w.key==="Enter"&&(w.preventDefault(),u(r))}function g(){const w=o??c();w.classList.remove("hidden"),w.style.display="",r=0,s&&(s.value="",s.focus()),p()}function b(){o&&(o.style.display="none",i=[])}function $(){return!!o&&o.style.display!=="none"}function f(w){(w.ctrlKey||w.metaKey)&&(w.key==="k"||w.key==="K")&&(w.preventDefault(),$()?b():g())}a.addEventListener("keydown",f);let h=null;function S(){const w=a.getElementById("period-bar");if(!w||a.getElementById(js))return;const I=a.createElement("button");I.id=js,I.type="button",I.className="btn-secondary",I.title="Buscar en toda la aplicación (Ctrl+K)",I.setAttribute("aria-label","Buscar"),I.textContent="🔍 Buscar",I.style.marginLeft="auto",I.addEventListener("click",g),w.appendChild(I),h=I}return S(),()=>{a.removeEventListener("keydown",f),h==null||h.remove(),o==null||o.remove(),o=null,s=null,n=null}}const Ka="aviso-guardado";function oc(t){const a=t.doc??document,e=t.contenedor??(()=>a.getElementById("toast-container")),o=t.msExito??1800,s=t.cambios.crearMarca("guardado");let n="oculto",i=!1,r=null,c=null;function l(){var g;r&&clearTimeout(r),r=null,(g=a.getElementById(Ka))==null||g.remove()}function p(){if(n==="oculto")return l();const g=e();if(!g)return;let b=a.getElementById(Ka);b||(b=a.createElement("div"),b.id=Ka,g.appendChild(b)),b.className=`toast toast-guardado toast-guardado--${n}`,b.style.display="flex",b.style.alignItems="center",b.style.gap="12px",b.textContent="";const $=a.createElement("span");if($.style.flex="1",b.appendChild($),n==="pendiente")$.textContent="Tienes cambios sin guardar.",b.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void u())),b.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,n="oculto",p()}));else if(n==="subiendo"){$.textContent="Subiendo…";const f=a.createElement("span");f.className="guardado-giro",f.setAttribute("aria-hidden","true"),b.appendChild(f)}else n==="guardado"?$.textContent="¡Guardado!":n==="error"&&($.textContent="No se ha podido guardar.",b.appendChild(d("Reintentar","btn-primary btn-sm",()=>void u())))}function d(g,b,$){const f=a.createElement("button");return f.type="button",f.className=b,f.textContent=g,f.style.flexShrink="0",f.addEventListener("click",$),f}async function u(){if(c)return c;r&&clearTimeout(r);const g=t.cambios.revision();return n="subiendo",p(),c=(async()=>{try{await t.guardar(),s.alDia(g),n="guardado",p(),r=setTimeout(()=>{n=s.pendiente()?"pendiente":"oculto",n==="pendiente"&&(i=!1),p()},o)}catch(b){console.error("[guardado] no se ha podido subir la copia:",b),n=t.hayDestino()?"error":"oculto",p()}finally{c=null}})(),c}const v=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,n!=="subiendo"&&(n="pendiente",p()))});return{estado:()=>i&&n==="oculto"?"oculto":n,guardarAhora:u,hayPendiente:()=>s.pendiente(),detener(){v(),l()}}}function sc({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function s(g){return`view-${g}`}function n(g){const b=t.getElementById(s(g.route));if(b)return b;const $=t.querySelector(".view-container");if(!$)return null;const f=t.createElement("div");return f.id=s(g.route),f.className="view hidden",$.appendChild(f),f}function i(g){if(t.querySelector(`.nav-btn[data-view="${g.route}"]`))return;const b=t.querySelectorAll(".nav-section"),$=b[g.seccion??Math.max(0,b.length-1)];if(!$)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=g.route,f.innerHTML=`${g.iconoPath?`<svg viewBox="0 0 24 24"><path d="${g.iconoPath}"/></svg>`:""}<span>${g.nombre}</span>`,$.appendChild(f),f.addEventListener("click",()=>{const h=globalThis.Router;h==null||h.navigate(g.route)})}function r(g){e.set(g.route,g),n(g),i(g)}function c(){return[...e.keys()].filter(g=>{const b=e.get(g);return!a||a(b.flagId??b.id)})}function l(g){return c().includes(g)}function p(g){const b=e.get(g);if(!b||a&&!a(b.flagId??b.id))return!1;const $=n(b);if(!$)return!1;if(o&&o!==g){const f=e.get(o),h=t.getElementById(s(o));f!=null&&f.unmount&&h&&f.unmount(h)}return b.mount($),o=g,!0}function d(){o&&p(o)}function u(){const g={};for(const[b,$]of e)g[b]=$.flagId??$.id;return g}function v(){for(const g of e.values())n(g),i(g)}return{register:r,routes:c,has:l,mount:p,rerender:d,flagPorRuta:u,attachToShell:v,get activa(){return o}}}const nc="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Ja(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function ic(t){const{store:a}=t,e=t.hoy??st,o=()=>U(e()),s=()=>a.get("config").margenesSeguridad??[];function n(v){var g;a.patchConfig({margenesSeguridad:v}),(g=t.onDatosCambiados)==null||g.call(t)}function i(v,g){const b=s().map(f=>({...f,puntos:(f.puntos??[]).map(h=>({...h}))})),$=b.find(f=>f._id===v);$&&(g($),n(b))}function r(v){const g=a.get("config"),b=Fa(v,a.get("expenses"),g,a.get("loans"),e(),!1,o());return D(b)}function c(v,g,b){const $=g.tipo==="fijo",f=$?"":`<span class="text-sm" style="color:var(--text3)">${m(D((g.meses??0)*b))}</span>`;return`
      <tr data-punto="${m(g._id)}" data-margen="${m(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${m(g.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${$?" selected":""}>Fijo €</option>
            <option value="meses"${$?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${$?`<input type="number" class="form-input" style="width:90px" value="${g.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${$?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${g.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${f}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function l(v,g,b){const $=v.cuentas&&v.cuentas.length>0?v.cuentas.map(w=>{var I;return((I=g.find(A=>A._id===w))==null?void 0:I.nombre)??w}).join(", "):"Todas las cuentas activas",h=[...v.puntos??[]].sort((w,I)=>w.fecha.localeCompare(I.fecha)).map(w=>c(v,w,b)).join(""),S=v.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${m($)}</div>
      <div class="mt-8 text-sm flex gap-8 items-center">
        <span style="color:var(--text3)">Umbral hoy:</span>
        <strong style="color:var(--accent)">${m(r(v))}</strong>
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
      <div class="mt-8"><button class="btn-secondary btn-sm" data-add-punto="${m(v._id)}">+ Añadir punto</button></div>`:"";return`
      <div class="card mb-8" style="padding:14px;border:1px solid var(--border)">
        <div class="flex justify-between items-center">
          <div class="flex gap-8 items-center flex-wrap">
            <span style="font-weight:600;font-size:14px">${m(v.nombre)}</span>
            <span class="badge ${v.activo?"badge-active":"badge-inactive"}">${v.activo?"Activo":"Inactivo"}</span>
          </div>
          <div class="flex gap-8 items-center">
            <label class="toggle" title="${v.activo?"Desactivar":"Activar"}">
              <input type="checkbox" ${v.activo?"checked":""} data-toggle-margen="${m(v._id)}"/>
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-icon" data-editar-margen="${m(v._id)}" title="Editar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
            </button>
            <button class="btn-icon" style="color:var(--red)" data-borrar-margen="${m(v._id)}" title="Eliminar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
            </button>
          </div>
        </div>
        ${S}
      </div>`}function p(v,g){const b=g?s().find(S=>S._id===g):null,$=a.get("accounts").filter(S=>S.activo),f=new Set((b==null?void 0:b.cuentas)??[]),h=$.map(S=>`
        <label class="tag" data-chip="${m(S._id)}" style="cursor:pointer;${f.has(S._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${m(S._id)}" ${f.has(S._id)?"checked":""} style="display:none"/>
          ${m(S.nombre)}
        </label>`).join(" ");v.innerHTML=`
      <div class="modal-title">${g?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${m((b==null?void 0:b.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${h||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${b?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${m(st())}"/></div>
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
        <button class="btn-primary" data-guardar-margen="${m(g??"")}">Guardar</button>
      </div>`}function d(v,g){const b=document.getElementById("modal-overlay"),$=Lt();!b||!$||(p($,v),b.classList.remove("hidden"),tt($,".mg-acc-chip",f=>{const h=f,S=$.querySelector(`[data-chip="${h.value}"]`);S&&(S.style.cssText=`cursor:pointer;${h.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),tt($,"#mg-p-tipo",f=>{const h=f.value==="fijo",S=$.querySelector("#mg-p-importe-wrap"),w=$.querySelector("#mg-p-meses-wrap");S&&(S.style.display=h?"":"none"),w&&(w.style.display=h?"none":"")}),k($,"[data-cerrar-form]",()=>b.classList.add("hidden")),k($,"[data-guardar-margen]",f=>{var A,M,C,y,E;const h=f.getAttribute("data-guardar-margen")||"",S=((A=$.querySelector("#mg-nombre"))==null?void 0:A.value.trim())??"";if(!S)return H("El nombre es obligatorio","err");const w=[...$.querySelectorAll(".mg-acc-chip:checked")].map(_=>_.value),I=s().map(_=>({..._}));if(h){const _=I.findIndex(P=>P._id===h);if(_===-1)return H("Margen no encontrado","err");I[_]={...I[_],nombre:S,cuentas:w}}else{const _=((M=$.querySelector("#mg-p-tipo"))==null?void 0:M.value)??"fijo",P={_id:Ja(),fecha:((C=$.querySelector("#mg-p-fecha"))==null?void 0:C.value)||st(),tipo:_,importe:parseFloat(((y=$.querySelector("#mg-p-importe"))==null?void 0:y.value)??"0")||0,meses:parseFloat(((E=$.querySelector("#mg-p-meses"))==null?void 0:E.value)??"1")||1};I.push({_id:Ja(),nombre:S,activo:!0,cuentas:w,puntos:[P]})}n(I),H(h?"Margen actualizado":"Margen creado"),b.classList.add("hidden"),g()}))}function u(v){const g=s(),b=a.get("accounts"),$=De(a.get("expenses"),o());v.innerHTML=`
      <div class="page-header">
        <div>
          <h1 class="page-title">Márgenes de <span>seguridad</span></h1>
          <p class="text-sm" style="color:var(--text3);margin:4px 0 0">
            Umbrales de saldo mínimo por cuenta o grupo de cuentas. El dashboard avisa cuando la
            proyección los cruza.
          </p>
        </div>
        <button class="btn-primary" data-nuevo-margen>+ Añadir margen</button>
      </div>
      ${g.length===0?`<div class="card" style="padding:24px;text-align:center">
               <p class="text-sm" style="color:var(--text3);margin:0">
                 Sin márgenes definidos. Crea uno para recibir alertas cuando el saldo baje del umbral.
               </p>
             </div>`:g.map(h=>l(h,b,$)).join("")}`;const f=()=>u(v);k(v,"[data-nuevo-margen]",()=>d(null,f)),k(v,"[data-editar-margen]",h=>d(h.getAttribute("data-editar-margen"),f)),k(v,"[data-borrar-margen]",h=>{St("¿Eliminar este margen de seguridad?")&&(n(s().filter(S=>S._id!==h.getAttribute("data-borrar-margen"))),H("Margen eliminado"),f())}),tt(v,"[data-toggle-margen]",h=>{const S=h.getAttribute("data-toggle-margen");i(S,w=>{w.activo=h.checked}),f()}),k(v,"[data-add-punto]",h=>{const S=h.getAttribute("data-add-punto");i(S,w=>{w.puntos=[...w.puntos??[],{_id:Ja(),fecha:st(),tipo:"fijo",importe:0,meses:1}]}),f()}),k(v,"[data-borrar-punto]",h=>{const S=h.closest("[data-punto]");if(!S)return;const w=S.dataset.margen,I=S.dataset.punto;i(w,A=>{A.puntos=(A.puntos??[]).filter(M=>M._id!==I)}),f()}),tt(v,"[data-campo]",h=>{const S=h.closest("[data-punto]");if(!S)return;const w=h.getAttribute("data-campo"),I=h.value;i(S.dataset.margen,A=>{const M=(A.puntos??[]).find(C=>C._id===S.dataset.punto);M&&(w==="fecha"?M.fecha=I:w==="tipo"?M.tipo=I:w==="importe"?M.importe=parseFloat(I)||0:M.meses=parseFloat(I)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:nc,mount:u}}const rc=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],cc=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],lc=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function dc(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Qa=(t,a)=>t.map(([e,o])=>`<option value="${m(e)}"${e===a?" selected":""}>${m(o)}</option>`).join("");function qs(t,a="dp"){const{modo:e,dia:o,nth:s,wd:n}=dc(t),i=Qa(rc.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${m(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Qa(cc,s)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Qa(lc,n)}</select>
        del mes
      </span>
    </div>
  </div>`}function Ns(t){var o,s,n;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(s=a.querySelector("[data-dp-dia]"))==null||s.style.setProperty("display",e==="dia"?"":"none"),(n=a.querySelector("[data-dp-nth]"))==null||n.style.setProperty("display",e==="nthweekday"?"":"none")}function Rs(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=s=>{var n;return((n=a.querySelector(s))==null?void 0:n.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const uc={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function pc(t,a){const e=new Set(((a==null?void 0:a.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||e.has(o._id))}function xe(t,a,e,o){if(e.filter(c=>c.activo).length<2)return"";const s=(a==null?void 0:a.modo)??"",n=new Map(((a==null?void 0:a.participantes)??[]).map(c=>[c.personaId,c.valor])),i=s==="porcentaje"||s==="importe",r=c=>{const l=n.has(c._id),p=n.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${m(o)}" value="${m(c._id)}"${l?" checked":""}/>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m(c.nombre)}</span>
      <input type="number" class="auth-input" data-reparto-valor="${m(o)}" data-persona="${m(c._id)}"
             value="${p??""}" step="0.01" min="0" placeholder="${s==="porcentaje"?"%":"€"}"
             style="width:64px;padding:4px 6px;${i?"":"display:none"}"/>
    </label>`};return`<div class="form-group mt-8" data-reparto="${m(o)}">
    <label class="form-label">${m(t)}</label>
    <select class="form-select" data-reparto-modo="${m(o)}">
      <option value=""${s?"":" selected"}>Sin reparto (100% persona por defecto)</option>
      <option value="partesIguales"${s==="partesIguales"?" selected":""}>Partes iguales</option>
      <option value="porcentaje"${s==="porcentaje"?" selected":""}>Porcentaje</option>
      <option value="importe"${s==="importe"?" selected":""}>Importe exacto</option>
    </select>
    <div data-reparto-participantes="${m(o)}" style="margin-top:6px;${s?"":"display:none"}">
      ${pc(e,a).map(r).join("")}
    </div>
  </div>`}function Ie(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"",s=e.querySelector(`[data-reparto-participantes="${a}"]`);s&&(s.style.display=o?"":"none");const n=o==="porcentaje"||o==="importe";e.querySelectorAll(`[data-reparto-valor="${a}"]`).forEach(r=>{r.style.display=n?"":"none"})}function we(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"";if(!o)return;const s=[...e.querySelectorAll(".reparto-persona:checked")];if(s.length===0)return;const n=s.map(r=>{const c=r.value,l=e.querySelector(`[data-reparto-valor="${a}"][data-persona="${c}"]`),p=l?parseFloat(l.value):NaN;return Number.isFinite(p)?{personaId:c,valor:p}:{personaId:c}});return{modo:o,participantes:n}}function ks(t,a){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var s;return((s=a.find(n=>n._id===o.personaId))==null?void 0:s.nombre)??"?"}).join(", ")} (${uc[t.modo]})`}function Xa(t,a,e){const o=ks(t,e),s=ks(a,e);return!o&&!s?"":o===s?`Reparto: ${o}`:[s&&`Paga: ${s}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const mc="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",fc=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function gc(t){const a=t.hoy??st,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},s=()=>t.store.get("accounts"),n=f=>{var h;return((h=s().find(S=>S._id===(f||"default")))==null?void 0:h.nombre)??(f||"default")};function i(){const f=a();let h=[...t.store.get("expenses")];if(e.mostrarExpirados||(h=h.filter(S=>!S.fechaFin||S.fechaFin>=f)),e.tipo&&(h=h.filter(S=>S.tipo===e.tipo)),e.cuenta&&(h=h.filter(S=>(S.cuenta||"default")===e.cuenta)),e.desde&&(h=h.filter(S=>(S.fechaInicio??"")>=e.desde)),e.hasta&&(h=h.filter(S=>(S.fechaInicio??"")<=e.hasta)),e.busqueda){const S=e.busqueda.toLowerCase();h=h.filter(w=>w.concepto.toLowerCase().includes(S))}return e.tags.size>0&&(h=h.filter(S=>(S.tags||[]).some(w=>e.tags.has(w)))),h.sort((S,w)=>{const I=S[e.orden]??"",A=w[e.orden]??"";return typeof I=="number"&&typeof A=="number"?(I-A)*e.sentido:String(I).localeCompare(String(A))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function c(f,h){const S=e.orden===f?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${m(h)} <span class="sort-arrow">${S}</span></span>`}function l(f,h=!1){return(h?'<option value="">Todas las cuentas</option>':"")+s().filter(w=>w.activo!==!1).map(w=>`<option value="${m(w._id)}"${w._id===f?" selected":""}>${m(w.nombre)}</option>`).join("")}function p(f){const h=f.tipo==="transferencia",S=Xa(f.repartoConsumo,f.repartoPago,t.store.get("personas")),w=Ia(f.diaPago??""),I=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${w?` · ${w}`:""}`,A=!!f.fechaFin&&f.fechaFin<a(),M=h?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',C=h?`${m(n(f.cuenta))} → ${m(n(f.cuentaDestino))}`:m(n(f.cuenta)),y=(f.tags||[]).map(E=>`<span class="tag${e.tags.has(E)?" active":""}" data-tag="${m(E)}" title="Filtrar por ${m(E)}">${m(E)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(f.concepto)}</div>
        <div class="tag-list mt-4">${y}</div>
      </div>
      <div>${M}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":h?"":"neg"}">${h?"⇄ ":""}${m(D(f.cuantia))}</div>
      <div class="text-sm">${m(I)}</div>
      <div class="text-sm exp-col-hide">${C}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${m(f._id)}"${f.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${f.tipo==="gasto"&&f.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${f.tipo==="gasto"&&f.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${f.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${f.tipo==="gasto"&&f.imprevisto?'<span class="badge" style="background:rgba(213,81,129,0.14);color:#e87ba4" title="Cuenta como imprevisto en «Este mes»">imprevisto</span>':""}
        ${f.tipo==="gasto"&&!f.imprevisto&&Te(f)?'<span class="badge" style="background:rgba(77,159,255,0.12);color:#4d9fff" title="Cuenta como factura en «Este mes»">factura</span>':""}
        ${f.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${m(f.ajustadaEn??"")}">ajustada</span>`:""}
        ${S?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(S)}">👥 reparto</span>`:""}
        ${A?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${m(f._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${m(f._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${m(f._id)}">✕</button>
      </div>
    </div>`}function d(f){const h=i(),S=r();f.innerHTML=`
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
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${m(e.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${e.tipo==="gasto"?" selected":""}>Gastos</option>
          <option value="ingreso"${e.tipo==="ingreso"?" selected":""}>Ingresos</option>
          <option value="transferencia"${e.tipo==="transferencia"?" selected":""}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${l(e.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${m(e.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${m(e.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${S.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${S.map(w=>`<span class="tag${e.tags.has(w)?" active":""}" data-tag="${m(w)}">${m(w)}</span>`).join("")}
              ${e.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${h.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':h.map(p).join("")}
      </div>`}function u(f){const h=(f==null?void 0:f.tipo)==="transferencia",S=t.store.get("personas"),w=(I,A,M,C,y="")=>`<div class="form-group"><label class="form-label">${m(A)}</label>
       <input class="form-input" type="${M}" id="${I}" value="${m(C)}" placeholder="${m(y)}"/></div>`;return`
      <div class="grid-2">
        ${w("ef-concepto","Concepto","text",(f==null?void 0:f.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(f==null?void 0:f.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${h?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${w("ef-cuantia","Cuantía (€)","number",(f==null?void 0:f.cuantia)??"","500")}
        ${w("ef-frecuencia","Frecuencia","number",(f==null?void 0:f.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${fc.map(([I,A])=>`<option value="${I}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===I?" selected":""}>${m(A)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${w("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${l((f==null?void 0:f.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${h?"":' style="display:none"'}>
        <div class="form-group"><label class="form-label">Cuenta destino</label>
          <select class="form-select" id="ef-cuenta-dest">${l((f==null?void 0:f.cuentaDestino)??"default")}</select></div>
      </div>
      <div class="form-row mt-8" id="ef-imprevisto-wrap"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?"":' style="display:none"'}>
        <label class="form-label" for="ef-imprevisto">Imprevisto</label>
        <label class="toggle"><input type="checkbox" id="ef-imprevisto"${f!=null&&f.imprevisto?" checked":""}/><span class="toggle-slider"></span></label>
        <span class="text-sm" style="margin-left:6px">Una avería, el dentista… Se sigue aparte y entra en la estimación de imprevistos</span>
      </div>
      <div class="form-row mt-8">
        <label class="form-label">Activo</label>
        <label class="toggle"><input type="checkbox" id="ef-activo"${(f==null?void 0:f.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      </div>

      <details class="form-advanced mt-12"${f!=null&&f._id?" open":""}>
        <summary class="form-advanced-summary">Opciones</summary>
        <div class="form-advanced-body">
          <div class="mt-8">${w("ef-fecha-fin","Fecha fin (opcional)","date",(f==null?void 0:f.fechaFin)??"")}</div>
          <div class="mt-8">${qs(f==null?void 0:f.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${h?' style="display:none"':""}>
            <div class="mt-8" id="ef-clasificacion-wrap"${(f==null?void 0:f.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label">Clasificación del gasto</label>
                <select class="form-select" id="ef-clasificacion">
                  <option value="necesidad"${((f==null?void 0:f.clasificacion)??"necesidad")==="necesidad"?" selected":""}>Necesidad</option>
                  <option value="deseo"${(f==null?void 0:f.clasificacion)==="deseo"?" selected":""}>Deseo</option>
                  <option value=""${(f==null?void 0:f.clasificacion)===null?" selected":""}>Sin clasificar (excluido del análisis)</option>
                </select>
              </div>
            </div>
            <div class="mt-8" id="ef-factura-wrap"${(f==null?void 0:f.tipo)==="ingreso"?' style="display:none"':""}>
              <div class="form-group"><label class="form-label" for="ef-factura">¿Es una factura o recibo?</label>
                <select class="form-select" id="ef-factura">
                  <option value=""${(f==null?void 0:f.esFactura)===void 0?" selected":""}>Automático${f?` (ahora: ${Te({...f,esFactura:void 0})?"sí":"no"})`:""}</option>
                  <option value="si"${(f==null?void 0:f.esFactura)===!0?" selected":""}>Sí: cargo fijo que llega solo</option>
                  <option value="no"${(f==null?void 0:f.esFactura)===!1?" selected":""}>No</option>
                </select>
                <div class="text-sm mt-4" style="color:var(--text3)">Decide en qué bloque de «Este mes» aparece en el cuadro de mando.</div>
              </div>
            </div>
            <div class="form-group mt-8"><label class="form-label">Etiquetas (separadas por coma)</label>
              <input class="form-input" type="text" id="ef-tags" value="${m(((f==null?void 0:f.tags)||[]).join(", "))}" placeholder="alquiler, vivienda"/></div>
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
          ${h?"":`${xe("Reparto de consumo",f==null?void 0:f.repartoConsumo,S,"consumo")}
                 ${xe("Reparto de pago",f==null?void 0:f.repartoPago,S,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${m((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function v(f){var w;const h=((w=f.querySelector("#ef-tipo"))==null?void 0:w.value)??"gasto",S=(I,A)=>{const M=f.querySelector(I);M&&(M.style.display=A?"":"none")};S("#ef-destino-wrap",h==="transferencia"),S("#ef-basico-wrap",h!=="transferencia"),S("#ef-irpf-wrap",h==="ingreso"),S("#ef-clasificacion-wrap",h==="gasto"),S("#ef-factura-wrap",h==="gasto"),S("#ef-imprevisto-wrap",h==="gasto")}function g(f,h,S){const w=document.getElementById("modal-overlay"),I=Lt();!w||!I||(I.innerHTML=`<div class="modal-title">${m(h)}</div>${u(f)}`,w.classList.remove("hidden"),tt(I,"#ef-tipo",()=>v(I)),tt(I,"[data-dp-modo]",()=>Ns(I)),tt(I,'[data-reparto-modo="consumo"]',()=>Ie(I,"consumo")),tt(I,'[data-reparto-modo="pago"]',()=>Ie(I,"pago")),k(I,"[data-cancelar]",()=>w.classList.add("hidden")),k(I,"[data-guardar]",A=>{b(I,A.getAttribute("data-guardar")||"")&&(w.classList.add("hidden"),S())}))}function b(f,h){const S=q=>{var F;return((F=f.querySelector(q))==null?void 0:F.value)??""},w=q=>{var F;return!!((F=f.querySelector(q))!=null&&F.checked)},I=S("#ef-tipo")||"gasto",A=I==="transferencia",M=S("#ef-concepto").trim(),C=parseFloat(S("#ef-cuantia").replace(",",".")),y=S("#ef-fecha-ini"),E=S("#ef-fecha-fin")||null,_=M?!Number.isFinite(C)||C<=0?"La cuantía debe ser mayor que 0 (el signo lo pone el tipo: gasto o ingreso)":y?E&&E<y?"La fecha de fin no puede ser anterior a la de inicio":A&&S("#ef-cuenta")===(S("#ef-cuenta-dest")||"default")?"En una transferencia, la cuenta de destino tiene que ser distinta de la de origen":"":"Indica la fecha de inicio":"Escribe un concepto";if(_)return H(_,"err"),!1;const P=S("#ef-tags").split(",").map(q=>q.trim()).filter(q=>q&&q!=="transferencia"),x=A?[...new Set([...P,"transferencia"])]:[...new Set(P)],z=S("#ef-clasificacion"),T={concepto:M,tipo:I,cuantia:C,frecuencia:parseInt(S("#ef-frecuencia"),10)||1,tipoFrecuencia:S("#ef-tipo-frec")||"mensual",fechaInicio:y,fechaFin:E,diaPago:Rs(f),cuenta:S("#ef-cuenta"),cuentaDestino:A?S("#ef-cuenta-dest")||"default":void 0,activo:w("#ef-activo"),basico:!A&&w("#ef-basico"),sujetoIRPF:!A&&w("#ef-sujetoIRPF"),clasificacion:I==="gasto"?z||null:void 0,esFactura:I==="gasto"?S("#ef-factura")==="si"?!0:S("#ef-factura")==="no"?!1:void 0:void 0,imprevisto:I==="gasto"&&w("#ef-imprevisto")?!0:void 0,tags:x,repartoConsumo:A?void 0:we(f,"consumo"),repartoPago:A?void 0:we(f,"pago")};return h?(t.store.updateItem("expenses",h,T),H("Actualizado")):(t.store.addItem("expenses",T),H("Creado")),o(),!0}function $(f,h){const S=f.querySelector("[data-busqueda]");let w;S==null||S.addEventListener("input",()=>{clearTimeout(w),w=setTimeout(()=>{e.busqueda=S.value,h();const I=f.querySelector("[data-busqueda]");I==null||I.focus(),I==null||I.setSelectionRange(I.value.length,I.value.length)},250)}),tt(f,"[data-expirados]",I=>{e.mostrarExpirados=I.checked,h()}),tt(f,"[data-f-tipo]",I=>{e.tipo=I.value,h()}),tt(f,"[data-f-cuenta]",I=>{e.cuenta=I.value,h()}),tt(f,"[data-f-desde]",I=>{e.desde=I.value,h()}),tt(f,"[data-f-hasta]",I=>{e.hasta=I.value,h()}),k(f,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,h()}),k(f,"[data-limpiar-tags]",()=>{e.tags=new Set,h()}),k(f,"[data-tag]",I=>{const A=I.getAttribute("data-tag");e.tags.has(A)?e.tags.delete(A):e.tags.add(A),h()}),k(f,"[data-orden]",I=>{const A=I.getAttribute("data-orden");e.orden===A?e.sentido=e.sentido===1?-1:1:(e.orden=A,e.sentido=1),h()}),k(f,"[data-nuevo]",()=>g(null,"Nuevo gasto/ingreso",h)),k(f,"[data-editar]",I=>{const A=t.store.get("expenses").find(M=>M._id===I.getAttribute("data-editar"));A&&g(A,"Editar",h)}),k(f,"[data-duplicar]",I=>{const A=t.store.get("expenses").find(y=>y._id===I.getAttribute("data-duplicar"));if(!A)return;const{_id:M,...C}=A;g({...C,concepto:`${A.concepto} (copia)`},"Duplicar movimiento",h)}),k(f,"[data-borrar]",I=>{St("¿Eliminar?")&&(t.store.removeItem("expenses",I.getAttribute("data-borrar")),H("Eliminado"),o(),h())}),tt(f,"[data-activo]",I=>{const A=I;t.store.updateItem("expenses",A.getAttribute("data-activo"),{activo:A.checked}),o(),h()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:mc,mount(f){const h=()=>d(f);d(f),f.dataset.wired!=="1"&&($(f,h),f.dataset.wired="1")}}}function la(t,a,e){return t.reduce((o,s)=>{if(s.esAmortizacion)return o;const n=Ut(a,e,s.fecha);return o+(n>0?s.interes/n:s.interes)},0)}function Ls(t,a,e,o){return t.reduce((s,n)=>{const i=Ut(a,e,n.fecha),r=n.esAmortizacion?n.amortizacion+n.comisionAmort:n.cuota;return s+(i>0?r/i:r)},0)+o}function vc(t,a,e){const o=t.amortizaciones||[];return o.map((s,n)=>{const i=$t({...t,amortizaciones:o.slice(0,n)}),r=$t({...t,amortizaciones:o.slice(0,n+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:la(i.tabla,a,e)-la(r.tabla,a,e)}})}const Za=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${m(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function bc(t,a){const e=wo(t),o=(t.amortizaciones||[]).length>0,s=a.periodos.length>0,n=a.usarInflacion&&s,i=s?Co(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=s?So(t.tin||0,i):null,c=o&&s?vc(t,a.periodos,a.hoy):[],l=c.length?la(e.sinAmort.tabla,a.periodos,a.hoy)-la(e.tabla,a.periodos,a.hoy):null,p=l===null?null:l-e.costeTotalAmort,d=n?Ls(e.tabla,a.periodos,a.hoy,e.comAp):null,u=n&&o?Ls(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${m(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${m(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const v=Xa(t.repartoConsumo,t.repartoPago,a.personas);return v?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(v)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(v=>`<span class="tag">${m(v)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${m(t.tin)}%</span>
        <span class="text-sm">${m(D(e.cuota))}/mes</span>
        <span class="text-sm">${m(e.fechaFin||"—")}</span>
        <button class="btn-icon" data-amort-loan="${m(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${m(t._id)}">

      <div class="grid-4 mb-12">
        ${Za("Cuota mensual",m(D(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${m(D(a.cuotaMes))}</div>`:"")}
        ${Za("Total intereses",m(D(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(D(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${m(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Za("Total pagado",m(D(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${m(D(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${m(yo(e.tae))}</div></div>
          <div><div class="stat-label">TIN</div><div class="stat-value">${m(t.tin)}%</div></div>
          ${r!==null?`<div title="Tipo de interés real (Fisher): TIN ajustado por la inflación media del ${i.toFixed(2)}% anual durante el préstamo">
                   <div class="stat-label">TIN real</div>
                   <div class="stat-value" style="color:${r<=0?"var(--accent)":r<t.tin?"var(--yellow)":"var(--text)"}">${r.toFixed(2)}%
                     <span style="font-size:10px;color:var(--text3);font-weight:400">(inf. ${i.toFixed(1)}%)</span>
                   </div>
                 </div>`:""}
          <div><div class="stat-label">Plazo original</div><div class="stat-value" style="font-size:14px">${m(t.meses)} meses</div></div>
        </div>
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">Capital</div><div class="stat-value">${m(D(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${m(D(e.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${m(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${m(Ia(t.diaPago))}</div></div>`:""}
        </div>
      </div>

      ${o?"":`<div class="loan-optim-cta">
               <div class="loan-optim-cta-text">
                 <strong>¿Quieres pagar menos intereses?</strong>
                 Simula amortizaciones anticipadas y descubre cuánto puedes ahorrar.
               </div>
               <button class="btn-primary btn-sm" data-amort-loan="${m(t._id)}">+ Amortizar</button>
             </div>`}

      ${o?`<div class="card" style="background:var(--bg3);padding:12px;margin-bottom:12px">
               <div class="card-title" style="margin-bottom:8px;color:var(--accent)">💰 Ahorro por amortizaciones</div>
               ${l!==null?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px">
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${m(D(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${m(D(l))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(D(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${m(D(e.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(p??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${m(D(p??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${m(D(e.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(D(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${m(D(e.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${d!==null?hc(t,e.totalPagado,d,u):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${n?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(v=>yc(v,n,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,g)=>$c(t._id,v,c[g]??null)).join("")}`:""}
    </div>
  </div>`}function hc(t,a,e,o){const s=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${m(D(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${m(D(e))}</div></div>
        <div><div class="stat-label">${c?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${c?"pos":"neg"}">${c?"−":"+"}${m(D(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${s}
    </div>`}const n=a-e,i=n>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${m(D(a))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${m(D(e))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${m(D(Math.abs(n)))}</div></div>
    </div>
    ${s}
  </div>`}function yc(t,a,e){let o="";if(a&&!t.esAmortizacion){const s=Ut(e.periodos,e.hoy,t.fecha);o=m(D(s>0?t.cuota/s:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":m(t.mes)}</td>
    <td class="num">${m(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":m(D(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${m(D(t.interes))}</td>
    <td class="num">${m(D(t.amortizacion))}</td>
    <td class="num">${m(D(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function $c(t,a,e){return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${m(a.fecha)}</span>
    <span class="num">${m(D(a.cantidad))}</span>
    <span class="badge ${a.simulacion?"badge-sim":"badge-active"}">${a.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${a.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${e?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${m(D(e.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${m(D(e.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-duplicar-amort="${m(t)}|${m(a._id)}" title="Duplicar" aria-label="Duplicar amortización"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
    <button class="btn-icon" data-editar-amort="${m(t)}|${m(a._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${m(t)}|${m(a._id)}">✕</button>
  </div>`}const Mt=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(s)}"/></div>`,Be=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([s,n])=>`<option value="${m(s)}"${s===o?" selected":""}>${m(n)}</option>`).join("")}
   </select></div>`,Ge=(t,a,e,o="")=>`<label class="form-label">${m(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${m(o)}</span>`:""}`,xc=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function Ic(t,a,e,o=st()){return`
    <div class="grid-2">
      ${Mt("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${Mt("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${Mt("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${Mt("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${Mt("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??o)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${xc(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${qs(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Be("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${Mt("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${Mt("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${m(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${Ge("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${xe("Reparto de consumo",t==null?void 0:t.repartoConsumo,e,"consumo")}
        ${xe("Reparto de pago",t==null?void 0:t.repartoPago,e,"pago")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${Ge("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${Ge("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${Ge("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function wc(t,a,e=st()){return`
    <div class="grid-2">
      ${Mt("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??e)}
      ${Mt("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Be("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(a==null?void 0:a.tipo)??"cuota")}
    </div>
    <div class="form-row mt-8">
      ${Ge("am-sim","Simulación",!!(a!=null&&a.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${m(t)}|${m((a==null?void 0:a._id)??"")}">${a!=null&&a._id?"Guardar cambios":"Añadir"}</button>
    </div>`}const Cc="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Sc(t){const a=t.hoy??st;let e=!1;const o=new Set;let s=null;const n=()=>{var A;return(A=t.onDatosCambiados)==null?void 0:A.call(t)};function i(A){const M=A.filter(y=>y.activo);if(M.length<2)return"";const C=(y,E)=>`<button class="btn-secondary btn-sm" data-persona-tab="${y===null?"":m(y)}"
               style="${s===y?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(E)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${C(null,"Todas")}
      ${M.map(y=>C(y._id,y.nombre)).join("")}
    </div>`}function r(A){if(!A.activo||A.simulacion)return!1;const M=$t(A).tabla.filter(C=>!C.esAmortizacion);return M.length===0?!0:M[M.length-1].fecha<a()}function c(A,M){const C=a(),y=C.slice(0,7),E=new Map;let _=0;for(const P of A){if(!P.activo||P.simulacion||M.has(P._id)||(P.fechaInicio||"")>C)continue;const x=$t(P).tabla.filter(T=>!T.esAmortizacion&&T.fecha.startsWith(y)),z=x.length>0?x[0].cuota:0;E.set(P._id,z),_+=z}return{porLoan:E,total:_,activos:[...E.values()].filter(P=>P>0).length}}function l(A){const M=a().slice(0,7),C=[];for(const y of A){if(!y.activo||y.simulacion)continue;const E=$t(y).tabla.filter(P=>!P.esAmortizacion),_=E[E.length-1];_&&_.fecha.slice(0,7)===M&&C.push({loan:y,cuota:_.cuota})}return C}function p(A){return A.length<=1?A[0]??"":`${A.slice(0,-1).join(", ")} y ${A[A.length-1]}`}function d(A){const M=t.store.get("config"),C=M.dashboardStart,y=M.dashboardEnd,E=Math.max(1,(U(y).getTime()-U(C).getTime())/(30.44*864e5));let _=0;for(const P of A)!P.activo||P.simulacion||(_+=$t(P).tabla.filter(x=>!x.esAmortizacion&&x.fecha>=C&&x.fecha<=y).reduce((x,z)=>x+z.cuota,0));return{media:_/E,desde:C,hasta:y}}function u(A){const M=t.store.get("personas"),C=Je(M),y=[...t.store.get("loans")].sort((j,N)=>N.tin-j.tin),E=s?y.filter(j=>Sa(j.repartoConsumo,j.repartoPago,C).has(s)):y,_=new Set(E.filter(r).map(j=>j._id)),P=e?E:E.filter(j=>!_.has(j._id)),x=c(y,new Set(y.filter(r).map(j=>j._id))),z=d(y),T=l(y),q=t.store.get("config"),F=t.store.get("inflacion"),R=new Date(U(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});A.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${_.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${_.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(M)}
      ${T.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${T.length===1?"acaba":"acaban"} ${m(p(T.map(j=>j.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${m(D(T.reduce((j,N)=>j+N.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${x.total>0||z.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${x.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${m(R)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${m(D(x.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${x.activos} préstamo${x.activos!==1?"s":""} activo${x.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${z.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${m(D(z.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${m(z.desde)} → ${m(z.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${P.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':P.map(j=>bc(j,{periodos:F,usarInflacion:!!q.usarInflacion,hoy:a(),cuotaMes:x.porLoan.get(j._id)??0,completado:_.has(j._id),personas:M})).join("")}
      </div>`;for(const j of A.querySelectorAll("[data-body-loan]"))o.has(j.dataset.bodyLoan??"")&&j.classList.add("open")}const v=()=>document.getElementById("modal-overlay"),g=()=>Lt(),b=()=>{var A;return(A=v())==null?void 0:A.classList.add("hidden")};function $(A,M){const C=v(),y=g();return!C||!y?null:(y.innerHTML=`<div class="modal-title">${m(A)}</div>${M}`,C.classList.remove("hidden"),k(y,"[data-cancelar]",b),y)}function f(A,M){const C=A?t.store.get("loans").find(E=>E._id===A)??null:null,y=$(A?"Editar préstamo":"Nuevo préstamo",Ic(C,t.store.get("accounts"),t.store.get("personas"),a()));y&&(y.addEventListener("change",E=>{const _=E.target;_!=null&&_.matches("[data-dp-modo]")&&Ns(y),_!=null&&_.matches('[data-reparto-modo="consumo"]')&&Ie(y,"consumo"),_!=null&&_.matches('[data-reparto-modo="pago"]')&&Ie(y,"pago")}),k(y,"[data-guardar-loan]",E=>{h(y,E.getAttribute("data-guardar-loan")||"")&&(b(),M())}))}function h(A,M){const C=T=>{var q;return((q=A.querySelector(T))==null?void 0:q.value)??""},y=T=>{var q;return!!((q=A.querySelector(T))!=null&&q.checked)},E=C("#f-nombre").trim(),_=parseFloat(C("#f-capital")),P=parseFloat(C("#f-tin")),x=parseInt(C("#f-meses"),10);if(!E||!Number.isFinite(_)||!Number.isFinite(P)||!Number.isFinite(x))return H("Completa los campos obligatorios","err"),!1;const z={nombre:E,capital:_,tin:P,meses:x,fechaInicio:C("#f-fecha"),comisionApertura:parseFloat(C("#f-com-ap"))||0,comisionAmort:parseFloat(C("#f-com-am"))||0,diaPago:Rs(A),cuenta:C("#f-cuenta"),simulacion:y("#f-sim"),activo:y("#f-activo"),mostrarFechaFinEnDashboard:y("#f-mostrar-fin"),tipoTasa:C("#f-tipo-tasa"),basico:y("#f-basico"),tags:C("#f-tags").split(",").map(T=>T.trim()).filter(Boolean),repartoConsumo:we(A,"consumo"),repartoPago:we(A,"pago")};return M?(t.store.updateItem("loans",M,z),H("Préstamo actualizado")):(t.store.addItem("loans",{...z,amortizaciones:[]}),H("Préstamo creado")),n(),!0}function S(A,M,C,{duplicar:y=!1}={}){const E=t.store.get("loans").find(T=>T._id===A);if(!E)return;const _=M?(E.amortizaciones||[]).find(T=>T._id===M)??null:null;if(y&&!_)return;const P=y&&_?{..._,_id:""}:_,z=$(y?"Duplicar amortización":M?"Editar amortización":"Añadir amortización",wc(A,P,a()));z&&k(z,"[data-guardar-amort]",T=>{const[q,F]=(T.getAttribute("data-guardar-amort")||"").split("|");w(z,q,F)&&(b(),C([q]))})}function w(A,M,C){var q;const y=F=>{var R;return((R=A.querySelector(F))==null?void 0:R.value)??""},E=y("#am-fecha"),_=parseFloat(y("#am-cant"));if(!E||!Number.isFinite(_)||_<=0)return H("Fecha y cantidad requeridas","err"),!1;const P=t.store.get("loans").find(F=>F._id===M);if(!P)return!1;const x={fecha:E,cantidad:_,tipo:y("#am-tipo"),simulacion:!!((q=A.querySelector("#am-sim"))!=null&&q.checked)},z=P.amortizaciones||[],T=C?z.map(F=>F._id===C?{...F,...x}:F):[...z,{_id:Date.now().toString(36),...x}];return t.store.updateItem("loans",M,{amortizaciones:T}),H(C?"Amortización actualizada":"Amortización añadida"),n(),!0}function I(A,M){k(A,"[data-toggle-finalizados]",()=>{e=!e,M()}),k(A,"[data-persona-tab]",C=>{s=C.getAttribute("data-persona-tab")||null,M()}),k(A,"[data-nuevo-loan]",()=>f(null,M)),k(A,"[data-toggle-loan]",(C,y)=>{var x;if((x=y.target)!=null&&x.closest("button"))return;const E=C.getAttribute("data-toggle-loan"),_=[...A.querySelectorAll("[data-body-loan]")].find(z=>z.dataset.bodyLoan===E);(_==null?void 0:_.classList.toggle("open"))?o.add(E):o.delete(E)}),k(A,"[data-editar-loan]",C=>f(C.getAttribute("data-editar-loan"),M)),k(A,"[data-borrar-loan]",C=>{if(!St("¿Eliminar préstamo?"))return;const y=C.getAttribute("data-borrar-loan");t.store.removeItem("loans",y),o.delete(y),H("Eliminado"),n(),M()}),k(A,"[data-amort-loan]",C=>{const y=C.getAttribute("data-amort-loan");o.add(y),S(y,null,M)}),k(A,"[data-duplicar-amort]",C=>{const[y,E]=(C.getAttribute("data-duplicar-amort")||"").split("|");o.add(y),S(y,E,M,{duplicar:!0})}),k(A,"[data-editar-amort]",C=>{const[y,E]=(C.getAttribute("data-editar-amort")||"").split("|");o.add(y),S(y,E,M)}),k(A,"[data-borrar-amort]",C=>{const[y,E]=(C.getAttribute("data-borrar-amort")||"").split("|"),_=t.store.get("loans").find(P=>P._id===y);_&&(t.store.updateItem("loans",y,{amortizaciones:(_.amortizaciones||[]).filter(P=>P._id!==E)}),H("Amortización eliminada"),n(),M([y]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Cc,mount(A){const M=(C=[])=>{for(const y of C)o.add(y);u(A)};u(A),A.dataset.wired!=="1"&&(I(A,M),A.dataset.wired="1")}}}const to=6.35;function Ce(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function Os(t){return Math.max(0,(t.bruto||0)-Ce(t))}function Mc(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function Ac(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+Ce(r),0),o=Math.max(0,a-e),s=Kt(a,e),n=new Map;for(const i of t)n.set(i._id,o>0?s*(Os(i)/o):0);return n}function Hs(t,a,e){if(t.irpfModo==="manual")return Os(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return jt(Kt(t.bruto||0,Ce(t)),e);const o=Mc(a.filter(i=>i.irpfModo!=="manual")),s=Ac(a);let n=0;for(const i of o){const r=s.get(i._id)??0;if(i._id===t._id)return jt(n+r,e)-jt(n,e);n+=r}return jt(Kt(t.bruto||0,Ce(t)),e)}function Ec(t,a){return t.reduce((e,o)=>e+Hs(o,t,a),0)}function Pc(t,a){var s;const e=[...a||[]].sort((n,i)=>n[0]-i[0]);let o=((s=e[0])==null?void 0:s[1])??19;for(const[n,i]of e)if(t>=n)o=i;else break;return o}function _c(t,a){if(!t||t.length===0)return 0;const e=t.reduce((s,n)=>s+(n.bruto||0),0),o=t.reduce((s,n)=>s+Ce(n),0);return Pc(Kt(e,o),a)}function Fc(t,a,e){const o=t.bruto||0,s=Ce(t),n=Math.max(0,o-s),i=t.nPagas||12,r=t.ssPct??to,c=n*(r/100),l=Hs(t,a,e);return{brutoAnual:o,flexAnual:s,baseDineraria:n,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:l,irpfPct:n>0?l/n*100:0,netoPorPaga:(n-c-l)/i}}function Dc(t){const a=new Map,e=[];for(const o of t){const s=o.grupoNomina||"";if(!s){e.push(o);continue}const n=a.get(s)??[];n.push(o),a.set(s,n)}return{grupos:a,sueltas:e}}const Tc={transporte:125,restaurante:220,otros:null},zc={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},jc=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Se=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(s)}"/></div>`,qc=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function Nc(t,a){const e=t.map((n,i)=>{const r=a.find(p=>p._id===n.cuenta),c=Tc[n.tipo],l=c!=null&&n.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${m(zc[n.tipo]??n.tipo)}</span>
        <span style="flex:1;font-size:12px">${m(D(n.importe))}/mes${l?` <span style="color:var(--red)" title="Supera el límite orientativo de ${m(D(c))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?m(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
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
        ${o.map(n=>`<option value="${m(n._id)}">${m(n.nombre)}${(n.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${s.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function Rc(t,a){const e=a.hoy??st(),o=(t==null?void 0:t.nPagas)??12,s=[12,14,16].includes(o);return`
    <div class="grid-2">
      ${Se("nf-nombre","Nombre / Empresa","text",(t==null?void 0:t.nombre)??"","Ej: Empresa S.A.")}
      ${Se("nf-bruto","Bruto anual (€)","number",(t==null?void 0:t.bruto)??"","30000")}
    </div>
    <div class="grid-2 mt-8">
      <div class="form-group"><label class="form-label">Número de pagas</label>
        <select class="form-select" id="nf-npagas">
          ${[12,14,16].map(n=>`<option value="${n}"${s&&o===n?" selected":""}>${n} pagas</option>`).join("")}
          <option value="custom"${s?"":" selected"}>Personalizado</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Cuenta</label>
        <select class="form-select" id="nf-cuenta">${qc(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Se("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??e)}
          ${Se("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Se("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${jc.map((n,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${m(n)} (${i+1})</option>`).join("")}
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
          ${Se("nf-irpfpct","Retención IRPF (%)","number",(t==null?void 0:t.irpfPct)??0,"20")}
        </div>
        <div class="grid-3 mt-8">
          <div class="form-group"><label class="form-label">Representación en predicciones</label>
            <select class="form-select" id="nf-representacion">
              <option value="detallado"${((t==null?void 0:t.representacion)??"detallado")==="detallado"?" selected":""}>Detallado (bruto + gastos SS/IRPF)</option>
              <option value="simplificado"${(t==null?void 0:t.representacion)==="simplificado"?" selected":""}>Simplificado (neto directo)</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Cotización SS empleado (%)</label>
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??to).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
        ${xe("Reparto de consumo",t==null?void 0:t.repartoConsumo,a.personas,"consumo")}
        ${xe("Reparto de pago",t==null?void 0:t.repartoPago,a.personas,"pago")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Bs(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(e(i));return Number.isFinite(c)?c:r},s=e("#nf-npagas"),n=s==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(s,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:n,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",to),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,retribucionFlexible:a,repartoConsumo:we(t,"consumo"),repartoPago:we(t,"pago")}}function kc(t,a,e,o){const s=Bs(t,a),n=a.reduce((f,h)=>f+(h.importe||0)*12,0),i=Math.max(0,s.bruto-n),r=i*(s.ssPct/100),c=s.irpfModo==="manual"?i*(s.irpfPct/100):jt(Kt(s.bruto,n),e.tramos),l=i-r-c,p=i/s.nPagas,d=r/s.nPagas,u=c/s.nPagas,v=p-d-u,g=s.grupoNomina?e.nominas.filter(f=>f.grupoNomina===s.grupoNomina&&f._id!==o):[],b=g.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${m(s.grupoNomina)}" con ${m(g.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",$=n>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${m(D(n))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${m(D(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${m(D(s.bruto))}</span>
      ${$}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${m(D(r))} (${s.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${m(D(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${m(D(l))}</span>
      ${n>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${m(D(n))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${m(D(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${s.representacion==="simplificado"?`ingreso ${m(D(v))}/paga`:`ingreso ${m(D(p))} − SS ${m(D(d))} − IRPF ${m(D(u))}`}${n>0?" + recargas flex":""}</span>
    </div>${b}`}function Lc(t,a,e,o){const s=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=Nc(a,e.accounts))},n=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=kc(t,a,e,o))},i=()=>{var c,l;const r=(p,d)=>{const u=t.querySelector(p);u&&(u.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((l=t.querySelector("#nf-irpfmodo"))==null?void 0:l.value)==="manual"),n()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&n()}),tt(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),tt(t,'[data-reparto-modo="consumo"]',()=>Ie(t,"consumo")),tt(t,'[data-reparto-modo="pago"]',()=>Ie(t,"pago")),k(t,"[data-flex-anadir]",()=>{var l,p,d;const r=((l=t.querySelector("#fc-tipo"))==null?void 0:l.value)||"transporte",c=parseFloat(((p=t.querySelector("#fc-importe"))==null?void 0:p.value)??"")||0;if(!c)return H("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),s(),n()}),k(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),s(),n()}),s(),n()}const Gs=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Oc(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),s=()=>Lt(),n=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??Wt;function r(u,v){const g=o(),b=s();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${m(u)}</div>${v}`,g.classList.remove("hidden"),k(b,"[data-cerrar]",n),b)}function c(){a=null;const u=[...t.store.get("tramosIRPFHistorico")].sort((b,$)=>b.año-$.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${m(Gs(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(Gs(b.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tabla="${b.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tabla="${b.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="irpf-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);g&&(k(g,"[data-editar-tabla]",b=>{const $=b.getAttribute("data-editar-tabla");d($==="default"?"default":Number($))}),k(g,"[data-borrar-tabla]",b=>{const $=Number(b.getAttribute("data-borrar-tabla"));St(`¿Eliminar la tabla del ejercicio ${$}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==$)),H(`Tabla ${$} eliminada`),t.onDatosCambiados(),c())}),k(g,"[data-anadir-anyo]",()=>{var f;const b=parseInt(((f=g.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return H("Año inválido","err");const $=t.store.get("tramosIRPFHistorico");if($.some(h=>h.año===b))return H("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...$,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function l(){return e.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function p(u){e=[...u.querySelectorAll("[data-tr-min]")].map((g,b)=>{const $=u.querySelector(`[data-tr-pct="${b}"]`);return[parseFloat(g.value)||0,parseFloat(($==null?void 0:$.value)??"")||0]})}function d(u){var h;a=u;const v=t.store.get("tramosIRPFHistorico");e=(u==="default"?i():((h=v.find(S=>S.año===u))==null?void 0:h.tramos)??i()).map(S=>[...S]);const b=u==="default"?"tabla por defecto":`ejercicio ${u}`,$=r(`Tramos IRPF — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${m(b)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!$)return;const f=()=>{const S=$.querySelector("#irpf-tramos-rows");S&&(S.innerHTML=l())};k($,"[data-volver]",c),k($,"[data-tr-anadir]",()=>{p($),e.push([0,0]),f()}),k($,"[data-tr-borrar]",S=>{p($),e.splice(Number(S.getAttribute("data-tr-borrar")),1),f()}),k($,"[data-tr-guardar]",()=>{p($);const S=[...e].sort((w,I)=>w[0]-I[0]);if(S.length===0)return H("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:S}),H("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(w=>w.año===a?{...w,tramos:S}:w)),H(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const Vs=1500,ne=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(s)}"/></div>`,Hc=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([s,n])=>`<option value="${m(s)}"${s===o?" selected":""}>${m(n)}</option>`).join("")}
   </select></div>`,Bc=t=>(t.modeloFondo||"cuenta")==="pension";function Gc(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(s=>Vc(s,a,e,o)).join("")}</div>`}function Vc(t,a,e,o){const s=Aa(t);if(!s)return"";const n=Ea(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(l=>l.fecha>=`${i}-01-01`).reduce((l,p)=>l+p.cantidad,0),c=Math.min(r,Vs)*(n/100);return`<div class="card">
    <div class="flex justify-between items-center mb-10">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${m(t.nombre)}</span>
        <span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>
        ${t.grupoNomina?`<span class="badge badge-blue">Grupo: ${m(t.grupoNomina)}</span>`:""}
      </div>
      <div class="flex gap-8">
        <button class="btn-icon" data-editar-pension="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger btn-sm" data-borrar-pension="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2" style="gap:6px;margin-bottom:8px">
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${m(D(s.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(D(s.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${s.beneficio>=0?"pos":"neg"}">${m(D(s.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(D(s.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(D(s.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${m(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>Vs?"neg":""}">${m(D(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${m(D(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${m(t.grupoNomina)}": ${n}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${s.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${m(s.proxDesbloqueo)}</div>`:""}
  </div>`}function Uc(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${m(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${m(D(e.importe))} / ${m(e.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${m(e.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Yc(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,s=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],n=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${ne("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${ne("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${ne("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${ne("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${ne("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${Hc("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${ne("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${n?' style="display:none"':""}>
        ${ne("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
      </div>
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Grupo (para IRPF marginal real)</label>
      <select class="form-select" id="pen-grupo">
        <option value="">Sin grupo — usar tipo fijo</option>
        ${s.map(i=>`<option value="${m(i)}"${(t==null?void 0:t.grupoNomina)===i?" selected":""}>${m(i)}</option>`).join("")}
      </select>
      ${s.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Crea grupos en las nóminas para poder seleccionarlos aquí.</div>':""}
    </div>
    <div class="form-group mt-8">
      <label class="form-label">Aportaciones programadas</label>
      <div id="pen-aport-container"></div>
    </div>
    <div class="form-group mt-8"><label class="form-label">Descripción</label>
      <input class="form-input" type="text" id="pen-desc" value="${m((t==null?void 0:t.descripcion)??"")}" placeholder="Plan de pensiones..."/></div>
    <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
      <label class="form-label">Activo</label>
      <label class="toggle"><input type="checkbox" id="pen-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
      <label class="form-label" style="margin-left:12px">Simulación</label>
      <label class="toggle"><input type="checkbox" id="pen-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-pension="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Wc(t,a,e){const o=()=>{const s=t.querySelector("#pen-aport-container");s&&(s.innerHTML=Uc(a))};tt(t,"#pen-grupo",s=>{const n=t.querySelector("#pen-impuesto-wrap");n&&(n.style.display=s.value?"none":"")}),k(t,"[data-aport-anadir]",()=>{var n,i,r,c;const s=parseFloat(((n=t.querySelector("#paport-importe"))==null?void 0:n.value)??"")||0;if(!s)return H("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),k(t,"[data-aport-borrar]",s=>{a.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function Kc(t,a,e,o){var $;const s=f=>{var h;return((h=t.querySelector(f))==null?void 0:h.value)??""},n=(f,h=0)=>{const S=parseFloat(s(f));return Number.isFinite(S)?S:h},i=f=>{var h;return!!((h=t.querySelector(f))!=null&&h.checked)},r=s("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=n("#pen-saldo"),l=s("#pen-grupo"),p={nombre:r,grupoNomina:l,saldo:c,saldoInicial:n("#pen-saldo-ini"),fechaInicialSaldo:s("#pen-fecha-ini")||o,interes:n("#pen-interes"),periodoCobro:s("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(s("#pen-bloqueo"),10)||120,impuestoRetirada:l?0:n("#pen-impuesto"),planAportaciones:a,descripcion:s("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},d=[...(e==null?void 0:e.historicoSaldos)??[]],u=[...(e==null?void 0:e.aportaciones)??[]],g=(($=[...d].sort((f,h)=>h.fecha.localeCompare(f.fecha))[0])==null?void 0:$.saldo)??(e==null?void 0:e.saldo)??null,b=Date.now().toString(36);return e?(g===null||Math.abs(c-g)>.005)&&(d.push({_id:b,fecha:o,saldo:c,nota:"Actualización manual"}),c>(g??0)&&u.push({_id:`${b}a`,fecha:o,cantidad:c-(g??0)})):c>0&&(d.push({_id:b,fecha:o,saldo:c,nota:"Saldo inicial"}),u.push({_id:`${b}a`,fecha:p.fechaInicialSaldo??o,cantidad:c})),{datos:{...p,historicoSaldos:d,aportaciones:u}}}const Jc="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Qc(t){const a=t.hoy??st,e=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)};let o=null;function s(h){const S=h.filter(I=>I.activo);if(S.length<2)return"";const w=(I,A)=>`<button class="btn-secondary btn-sm" data-persona-tab="${I===null?"":m(I)}"
               style="${o===I?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(A)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${w(null,"Todas")}
      ${S.map(I=>w(I._id,I.nombre)).join("")}
    </div>`}function n(){const h=t.store.get("config");return me(t.store.get("tramosIRPFHistorico"),h.tramos_irpf??Wt)(Number(a().slice(0,4)))}function i(h,S,w){const I=Fc(h,S,w),A=!!S&&h.irpfModo!=="manual",M=Xa(h.repartoConsumo,h.repartoPago,t.store.get("personas")),C=[h.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${h.mesActualizacionIPC}">IPC m${h.mesActualizacionIPC}</span>`:"",I.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${m(D(I.flexAnual))}/año</span>`:"",Math.abs(I.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${I.ssPct.toFixed(2)}%</span>`:"",M?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(M)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(h.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${C}</div>
      </div>
      <div class="num">${m(D(I.brutoAnual))}
        ${I.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${m(D(I.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${m(D(I.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${I.nPagas} pagas</div>
      <div class="text-sm ${A?"neg":""}">${h.irpfModo==="manual"?`${m(h.irpfPct??0)}% (manual)`:`${I.irpfPct.toFixed(1)}% (auto)`}${A?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${h.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${m(r(h.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${m(h._id)}"${h.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${m(h._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${m(h._id)}">✕</button>
      </div>
    </div>`}const r=h=>{var S;return((S=t.store.get("accounts").find(w=>w._id===(h||"default")))==null?void 0:S.nombre)??(h||"default")};function c(h,S,w){const I=S.reduce((C,y)=>C+(y.bruto||0),0),A=Ec(S,w),M=I>0?A/I*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${m(h)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${m(D(I))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${M.toFixed(1)}%</strong> (${m(D(A))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${S.map(C=>i(C,S,w)).join("")}
      </div>
    </div>`}function l(h){const S=n(),w=t.store.get("personas"),I=Je(w),A=[...t.store.get("nominas")].sort((P,x)=>(x.bruto||0)-(P.bruto||0)),M=o?A.filter(P=>Sa(P.repartoConsumo,P.repartoPago,I).has(o)):A,{grupos:C,sueltas:y}=Dc(M),E=t.store.get("accounts").filter(Bc),_=A.filter(P=>P.activo!==!1);h.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${s(w)}
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${M.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...C.entries()].map(([P,x])=>c(P,x,S)).join("")}
      ${y.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${y.map(P=>i(P,null,S)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Gc(E,_,S,a())}</div>`}const p=()=>document.getElementById("modal-overlay"),d=()=>Lt(),u=()=>{var h;return(h=p())==null?void 0:h.classList.add("hidden")};function v(h,S){const w=p(),I=d();return!w||!I?null:(I.innerHTML=`<div class="modal-title">${m(h)}</div>${S}`,w.classList.remove("hidden"),k(I,"[data-cancelar]",u),I)}function g(h,S){const w=h?t.store.get("nominas").find(C=>C._id===h)??null:null,I=[...(w==null?void 0:w.retribucionFlexible)??[]].map(C=>({...C})),A={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:n(),hoy:a()},M=v(h?"Editar nómina":"Nueva nómina",Rc(w,A));M&&(Lc(M,I,A,h??""),k(M,"[data-guardar-nomina]",C=>{const y=Bs(M,I);if(!y.nombre||y.bruto<=0)return H("Nombre y bruto anual son obligatorios","err");const E=C.getAttribute("data-guardar-nomina")||"",_={...y,activo:!0,tags:["nomina"]};E?(t.store.updateItem("nominas",E,_),H("Nómina actualizada")):(t.store.addItem("nominas",_),H("Nómina creada")),e(),u(),S()}))}function b(h,S){const w=h?t.store.get("accounts").find(M=>M._id===h)??null:null,I=[...(w==null?void 0:w.planAportaciones)??[]].map(M=>({...M})),A=v(h?"Editar plan de pensiones":"Nuevo plan de pensiones",Yc(w,{nominas:t.store.get("nominas"),hoy:a()}));A&&(Wc(A,I,a()),k(A,"[data-guardar-pension]",M=>{const{datos:C,error:y}=Kc(A,I,w,a());if(y)return H(y,"err");const E=M.getAttribute("data-guardar-pension")||"";E?(t.store.updateItem("accounts",E,C),H("Plan actualizado")):(t.store.addItem("accounts",C),H("Plan creado")),e(),u(),S()}))}function $(h,S,w){k(h,"[data-persona-tab]",I=>{o=I.getAttribute("data-persona-tab")||null,S()}),k(h,"[data-nueva-nomina]",()=>g(null,S)),k(h,"[data-editar-nom]",I=>g(I.getAttribute("data-editar-nom"),S)),k(h,"[data-borrar-nom]",I=>{St("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",I.getAttribute("data-borrar-nom")),H("Eliminada"),e(),S())}),tt(h,"[data-activo-nom]",I=>{const A=I;t.store.updateItem("nominas",A.getAttribute("data-activo-nom"),{activo:A.checked}),e(),S()}),k(h,"[data-tramos]",()=>w.abrir()),k(h,"[data-nueva-pension]",()=>b(null,S)),k(h,"[data-editar-pension]",I=>b(I.getAttribute("data-editar-pension"),S)),k(h,"[data-borrar-pension]",I=>{St("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",I.getAttribute("data-borrar-pension")),H("Plan eliminado"),e(),S())})}let f=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Jc,mount(h){const S=()=>l(h);f??(f=Oc({store:t.store,onDatosCambiados:()=>{e(),S()},año:()=>Number(a().slice(0,4))})),l(h),h.dataset.wired!=="1"&&($(h,S,f),h.dataset.wired="1")}}}const Xc="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Zc="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",Us={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},tl={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function el(t,a){const e=t.filter(c=>c.activo&&_t(c)==="inversion");if(e.length===0)return"";let o=0,s=0,n=0,i=0;for(const c of e){const l=Qe(c,a);l&&(o+=l.saldo,s+=l.costBase,n+=l.plusvalia,i+=l.impuesto)}const r=s>0?(n/s*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${m(D(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${m(D(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${m(r)}%)</div><div class="stat-value ${n>=0?"pos":"neg"}">${m(D(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${m(D(i))}</div><div class="stat-sub">Neto: ${m(D(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function al(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,s=Math.max(1,(U(o).getTime()-U(e).getTime())/(30.44*864e5)),n=Pe(t,e),i=n*(Math.pow(1+t.interes/100,s/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const c=n*(Ut(a.inflacion,e,o)-1),l=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${m(D(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${l>=0?"var(--accent)":"var(--red)"};font-weight:600">${m(D(l))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${m(e.slice(0,7))} → ${m(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${m(D(i))}</span>
    </div>${r}
  </div>`}function ol(t,a){const e=Us[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,s=a.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(g=>g.cuenta===t._id).map(g=>({nomina:v,importe:g.importe}))),n=s.reduce((v,g)=>v+g.importe,0),i=n*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,l=t.grupoNomina?a.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):s.slice(0,1).map(v=>v.nomina),p=_c(l,a.tramosIRPF),d=c*p/100,u=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${p}%`:`tipo marginal ${p}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${m(e.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${m(D(n))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${m(D(i))}/año${r?` ⚠ excede límite ${m(D(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${m(D(o))}/año</span></div>`:""}
    ${d>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${m(u)}">≈ ${m(D(d))}/año <span style="font-size:10px;color:var(--text3)">(${m(p)}%)</span></span></div>`:""}
    ${s.length>0?s.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${m(v.nomina.nombre)}: ${m(D(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function sl(t){const a=Aa(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(D(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(D(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${m(D(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${m(D(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${m(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${m(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function nl(t,a){const e=Qe(t,a.tramosGanancias);if(!e)return"";const o=a.config,s=a.flujos(t._id),n=U(o.dashboardStart),i=U(o.dashboardEnd),r=Math.max(0,(i.getTime()-n.getTime())/(30.44*864e5)),c=e.saldo+s.totalAportaciones-s.totalReembolsos,l=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,p=c>0&&r>0?Math.max(0,c*Math.pow(1+l,r)):Math.max(0,c),d=e.costBase+s.totalAportaciones,u=Math.max(0,p-d),v=Ma(u,a.tramosGanancias),g=u>0?(v/u*100).toFixed(1):"0",b=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",$=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",f=(M,C,y)=>M.map(E=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${C} ${m(E.contraparte)}: ${m(E.concepto)}</span>
          <span class="num ${y}">${m(D(E.total))} · ${E.ocurrencias} mov.</span>
        </div>`).join(""),S=s.entradas.length>0||s.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${m(o.dashboardStart.slice(0,7))} → ${m(o.dashboardEnd.slice(0,7))})</div>
         ${f(s.entradas,"↓","pos")}
         ${f(s.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${s.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${m(D(s.totalAportaciones))}</span></div>`:""}
           ${s.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${m(D(s.totalReembolsos))}</span></div>`:""}
           ${s.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${m(D(s.retencion))}</span></div>`:s.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',w=a.invModo(t._id),I=M=>`padding:3px 10px;border-radius:20px;border:1px solid ${M?"var(--accent)":"var(--border)"};background:${M?"var(--accent-dim)":"transparent"};color:${M?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,A=w==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(D(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${m(D(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${m(D(e.neto))}</div><div class="stat-sub">${m($)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${m(D(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${m(D(p))}</div><div class="stat-sub">${m(b)} · ${m(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${m(D(p-v))}</div><div class="stat-sub">${m(g)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${m(t._id)}|real" style="${I(w==="real")}">Real</button>
          <button data-inv-modo="${m(t._id)}|proyeccion" style="${I(w==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${A}
      ${S}
    </div>`}function il(t,a){const e=[...t.historicoSaldos||[]].sort((c,l)=>l.fecha.localeCompare(c.fecha)),o=e[0],s=Yt(t),n=_t(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",n==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",n==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",n==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${m((Us[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${m(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${m(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${m(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Zc}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Xc}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${m(D(t.saldoInicial||0))}</div><div class="stat-sub">${m(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${m(D(s))}</div>${o?`<div class="stat-sub">Registro: ${m(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${m(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${m(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${al(t,a)}
    ${n==="beneficio"?ol(t,a):""}
    ${n==="pension"?sl(t):""}
    ${n==="inversion"?nl(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${m(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${m(t.descripcion)}</div>`:""}
  </div>`}const rl=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function cl(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${m(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${m(D(e.importe))} / ${m(e.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${m(e.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function ll(t,a){const e=t?_t(t):"cuenta",o=[...new Set(a.nominas.filter(n=>n.grupoNomina).map(n=>n.grupoNomina))],s=n=>n?"":' style="display:none"';return`
    <div class="grid-2">
      ${Mt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Be("ac-modelo","Tipo",rl,e)}
    </div>
    <div class="grid-2 mt-8">
      ${Mt("ac-saldo","Saldo actual (€)","number",a.saldoActual,"5000")}
      ${Mt("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Mt("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${Mt("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
    </div>
    <div class="form-row mt-8">
      <label class="form-label">Activa</label>
      <label class="toggle"><input type="checkbox" id="ac-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
    </div>

    <details class="form-advanced mt-12"${t?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="mt-8">
          ${Be("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${Be("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
          </div>
          <div class="form-group mt-8">
            <label class="form-label">Grupo de nóminas (para el tipo marginal de IRPF)</label>
            <select class="form-select" id="ac-beneficio-grupo">
              <option value="">Sin grupo — usar la primera nómina vinculada</option>
              ${o.map(n=>`<option value="${m(n)}"${(t==null?void 0:t.grupoNomina)===n?" selected":""}>${m(n)}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Aportaciones programadas</label>
          <div id="ac-aport-container"></div>
        </div>
        <div class="form-group mt-8"><label class="form-label">Descripción</label>
          <input class="form-input" type="text" id="ac-desc" value="${m((t==null?void 0:t.descripcion)??"")}" placeholder="Fondo indexado global..."/></div>
        <div class="form-row mt-8">
          <label class="form-label">Simulación</label>
          <label class="toggle"><input type="checkbox" id="ac-sim"${t!=null&&t.simulacion?" checked":""}/><span class="toggle-slider"></span></label>
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-acc="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function dl(t,a,e){const o=()=>{const s=t.querySelector("#ac-aport-container");s&&(s.innerHTML=cl(a))};tt(t,"#ac-modelo",s=>{const n=s.value,i=(r,c)=>{const l=t.querySelector(r);l&&(l.style.display=c?"":"none")};i("#ac-inversion-hint",n==="inversion"),i("#ac-beneficio-fields",n==="beneficio")}),k(t,"[data-aport-anadir]",()=>{var n,i,r,c;const s=parseFloat(((n=t.querySelector("#aport-importe"))==null?void 0:n.value)??"")||0;if(!s)return H("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),k(t,"[data-aport-borrar]",s=>{a.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function ul(t,a,e,o,s){const n=g=>{var b;return((b=t.querySelector(g))==null?void 0:b.value)??""},i=(g,b=0)=>{const $=parseFloat(n(g));return Number.isFinite($)?$:b},r=g=>{var b;return!!((b=t.querySelector(g))!=null&&b.checked)},c=n("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const l=n("#ac-modelo")||"cuenta",p=l==="beneficio",d=i("#ac-saldo"),u={nombre:c,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:n("#ac-fecha-ini")||s,interes:i("#ac-interes"),periodoCobro:n("#ac-periodo")||"mensual",descripcion:n("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:l,planAportaciones:a,tipoBeneficio:p?n("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:p?n("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&d<=0)return{datos:u};if(!(o===null||Math.abs(d-o)>.005))return{datos:u};if(l==="inversion"&&d>(o??0)){const g=Date.now().toString(36);u.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${g}a`,fecha:e?s:u.fechaInicialSaldo??s,cantidad:d-(o??0)}]}return{datos:u,punto:{fecha:s,saldo:d,nota:e?"Actualización manual":"Saldo inicial"}}}function eo(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:ct(a.saldoCts),nota:a.nota,derivado:a.origen==="derivado"}))}function pl(t,a,e,o,s){const n=e.map(r=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${r.derivado?";opacity:0.75":""}">
        <span class="num" style="min-width:110px">${m(r.fecha)}</span>
        <span class="num" style="flex:1;color:${r.saldo>=o?"var(--accent)":"var(--red)"}">${m(D(r.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${r.derivado?'<span class="badge">semanal · calculado</span>':m(r.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${m(a)}|${m(r._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${m(a)}|${m(r._id)}">✕</button>
      </div>`).join(""),i=e.filter(r=>r.derivado).length;return`
    <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
      <div class="card-title" style="margin:0">Histórico — ${m(t)}</div>
      <button class="btn-secondary btn-sm" data-hist-semanal="${m(a)}"
        title="Recalcula un punto por semana con el saldo al cierre de cada una, a partir de los movimientos. Si el arranque de la cuenta es posterior al primer movimiento, lo retrasa hasta él para que no tape la curva.">↻ Recalcular semanal</button>
    </div>
    <div class="text-sm mt-4 mb-8" style="color:var(--text3)">
      ${i>0?`${i} de los puntos son semanales calculados del ledger; el resto los has registrado tú y mandan sobre el saldo.`:"Los puntos que registras aquí anclan el saldo. «Recalcular semanal» añade además un punto por semana con lo que dicen los movimientos."}
    </div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${e.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':n}
    </div>
    <div class="divider"></div>
    <div class="card-title">Añadir punto de control</div>
    <div class="grid-3">
      <div class="form-group"><label class="form-label">Fecha</label>
        <input class="form-input" type="date" id="hi-fecha" value="${m(s)}"/></div>
      <div class="form-group"><label class="form-label">Saldo real (€)</label>
        <input class="form-input" type="number" id="hi-saldo" placeholder="5000"/></div>
      <div class="form-group"><label class="form-label">Nota (opcional)</label>
        <input class="form-input" type="text" id="hi-nota" placeholder="Extracto enero..."/></div>
    </div>
    <div class="flex gap-8 mt-12" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cerrar</button>
      <button class="btn-primary" data-hist-anadir="${m(a)}">Añadir</button>
    </div>`}const Ys=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function ml(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),s=()=>Lt(),n=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??_e;function r(u,v){const g=o(),b=s();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${m(u)}</div>${v}`,g.classList.remove("hidden"),k(b,"[data-cerrar]",n),b)}function c(){a=null;const u=[...t.store.get("tramosGananciasCapitalHistorico")].sort((b,$)=>b.año-$.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${m(Ys(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${u.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(Ys(b.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tg="${b.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tg="${b.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="tg-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo-tg>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);g&&(k(g,"[data-editar-tg]",b=>{const $=b.getAttribute("data-editar-tg");d($==="default"?"default":Number($))}),k(g,"[data-borrar-tg]",b=>{const $=Number(b.getAttribute("data-borrar-tg"));St(`¿Eliminar la tabla del ejercicio ${$}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==$)),H(`Tabla ${$} eliminada`),t.onDatosCambiados(),c())}),k(g,"[data-anadir-anyo-tg]",()=>{var f;const b=parseInt(((f=g.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return H("Año inválido","err");const $=t.store.get("tramosGananciasCapitalHistorico");if($.some(h=>h.año===b))return H("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...$,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function l(){return e.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function p(u){e=[...u.querySelectorAll("[data-tg-min]")].map((v,g)=>{const b=u.querySelector(`[data-tg-pct="${g}"]`);return[parseFloat(v.value)||0,parseFloat((b==null?void 0:b.value)??"")||0]})}function d(u){var f;a=u;const v=t.store.get("tramosGananciasCapitalHistorico");e=(u==="default"?i():((f=v.find(h=>h.año===u))==null?void 0:f.tramos)??i()).map(h=>[...h]);const b=r(`Ganancias de capital — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!b)return;const $=()=>{const h=b.querySelector("#tg-rows");h&&(h.innerHTML=l())};k(b,"[data-volver-tg]",c),k(b,"[data-tg-anadir]",()=>{p(b),e.push([0,0]),$()}),k(b,"[data-tg-borrar]",h=>{p(b),e.splice(Number(h.getAttribute("data-tg-borrar")),1),$()}),k(b,"[data-tg-guardar]",()=>{p(b);const h=[...e].sort((S,w)=>S[0]-w[0]);if(h.length===0)return H("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:h}),H("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(S=>S.año===a?{...S,tramos:h}:S)),H(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const fl=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function gl(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${fl.map(a=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${a.id}" style="${a.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${a.etiqueta}</button>`).join("")}
  </div>`}function vl(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function bl(t,a){const e=[];let[o,s]=t.slice(0,7).split("-").map(Number);const[n,i]=a.slice(0,7).split("-").map(Number);for(;o<n||o===n&&s<=i;)e.push(`${o}-${String(s).padStart(2,"0")}`),s+=1,s>12&&(s=1,o+=1);return e}function hl(t,a,e,o){const s=r=>a.filter(c=>c.tipo===r&&c.activo!==!1),n=s("gasto"),i=s("ingreso");return bl(e,o).map(r=>{const c={desde:`${r}-01`,hasta:vl(r)},l=b=>X(t.transacciones({...c,tipo:b}).reduce(($,f)=>$+Math.abs(f.importeCts)/100,0)),p=b=>X(b.reduce(($,f)=>$+Pi(f,r),0)),d=p(n),u=l("gasto"),v=p(i),g=l("ingreso");return{mes:r,estimado:d,real:u,ingresosEstimados:v,ingresosReales:g,netoEstimado:X(v-d),netoReal:X(g-u)}})}const da=640,Me=200,ht={top:14,right:16,bottom:26,left:54};function yl(t){return xt(t).slice(0,3)}const $l={gasto:t=>({estimado:t.estimado,real:t.real}),ingreso:t=>({estimado:t.ingresosEstimados,real:t.ingresosReales}),neto:t=>({estimado:t.netoEstimado,real:t.netoReal})};function xl(t,a="gasto"){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const e=$l[a],o=t.flatMap($=>[e($).estimado,e($).real]),s=da-ht.left-ht.right,n=Me-ht.top-ht.bottom,i=Math.max(1,...o),r=Math.min(0,...o),c=i-r||1,l=$=>ht.left+(t.length===1?s/2:$/(t.length-1)*s),p=$=>ht.top+n-($-r)/c*n,d=t.map(($,f)=>`${l(f)},${p(e($).estimado)}`).join(" "),u=t.map(($,f)=>`${l(f)},${p(e($).real)}`).join(" "),v=r<0?`<line x1="${ht.left}" y1="${p(0).toFixed(1)}" x2="${da-ht.right}" y2="${p(0).toFixed(1)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,3"/>`:"",g=t.map(($,f)=>`<circle cx="${l(f).toFixed(1)}" cy="${p(e($).real).toFixed(1)}" r="3" fill="var(--accent)"><title>${m(xt($.mes))}: ${m(D(e($).real))}</title></circle>`).join(""),b=t.map(($,f)=>`<text x="${l(f).toFixed(1)}" y="${Me-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${m(yl($.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${da} ${Me}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Real frente a estimado por mes">
      <line x1="${ht.left}" y1="${ht.top}" x2="${ht.left}" y2="${Me-ht.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${ht.left}" y1="${Me-ht.bottom}" x2="${da-ht.right}" y2="${Me-ht.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${ht.top+8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${m(D(i))}</text>
      ${v}
      <polyline points="${d}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${u}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${g}
      ${b}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`}const Ws={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"},Il=[25,50,100,250,0];function wl(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:Js(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:Ve(Js(t,5)).desde,intervaloHasta:Ve(t).hasta,comparativa:"neto",pagina:1,porPagina:50}}function Ks(t,a,e){const o=t.length;if(e<=0)return{pagina:t,actual:1,paginas:1,total:o,desde:o>0?1:0,hasta:o};const s=Math.max(1,Math.ceil(o/e)),n=Math.min(Math.max(1,a),s),i=(n-1)*e;return{pagina:t.slice(i,i+e),actual:n,paginas:s,total:o,desde:o>0?i+1:0,hasta:Math.min(i+e,o)}}function ua(t,a,e){if(t.total===0)return"";const o=(n,i,r,c)=>`<button class="btn-secondary btn-sm" data-acc-pagina="${n}" ${r?"":"disabled"} title="${m(c)}"
             style="padding:2px 9px;font-size:11px${r?"":";opacity:0.4;cursor:default"}">${i}</button>`,s=Il.map(n=>`<option value="${n}"${n===a?" selected":""}>${n===0?"todos":`${n} por página`}</option>`).join("");return`
    <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin:8px 0">
      <div class="text-sm" style="color:var(--text3)">
        ${t.desde}–${t.hasta} de ${t.total} ${m(e)}${t.paginas>1?` · página ${t.actual} de ${t.paginas}`:""}
      </div>
      <div class="flex gap-6 items-center">
        ${o(1,"«",t.actual>1,"Primera")}
        ${o(t.actual-1,"‹ Anterior",t.actual>1,"Página anterior")}
        ${o(t.actual+1,"Siguiente ›",t.actual<t.paginas,"Página siguiente")}
        ${o(t.paginas,"»",t.actual<t.paginas,"Última")}
        <select class="form-select" data-acc-por-pagina style="font-size:11px;padding:2px 6px;width:auto">${s}</select>
      </div>
    </div>`}function ao(t,a,e,o){const s=t===a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-acc-comparativa="${t}" title="${m(o)}" style="${s}">${m(e)}</button>`}function Ve(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Js(t,a){const[e,o]=t.split("-").map(Number),s=new Date(e,o-1-a,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function oo(t,a){const[e,o]=t<=a?[t,a]:[a,t];return{desde:Ve(e).desde,hasta:Ve(o).hasta}}function Cl(t,a){return t<=a?{desde:t,hasta:a}:{desde:a,hasta:t}}function so(t){const a=new Map;for(const e of t){const o=e.concepto.trim(),s=a.get(o);s?s.push(e):a.set(o,[e])}return[...a.entries()].filter(([,e])=>e.length>1).map(([e,o])=>{const s=new Set(o.map(n=>n.estimacionId??null));return{concepto:e,movimientos:o.slice().sort((n,i)=>n.fecha.localeCompare(i.fecha)),total:o.reduce((n,i)=>n+i.importeCts,0),estimacionComun:s.size===1?s.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(n=>n.tags))].sort()}}).sort((e,o)=>o.movimientos.length-e.movimientos.length||e.concepto.localeCompare(o.concepto))}function Sl(t,a){if(t.tagsComunes.length===0)return null;const e=new Set(t.movimientos.map(n=>n._id)),o=a.filter(n=>!e.has(n._id)&&n.tipo==="gasto"&&n.tags.some(i=>t.tagsComunes.includes(i))).reduce((n,i)=>n+Math.abs(i.importeCts),0),s=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:s,gastadoCts:o,diferenciaCts:o-s}}function Ml(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const a=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",e=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${m(D(ct(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${m(D(ct(t.gastadoCts)))}</strong></span>
      <span style="color:${a}">Diferencia: <strong style="font-family:var(--font-mono)">${e}${m(D(ct(t.diferenciaCts)))}</strong></span>
    </div>`}function Al(t,a){const{ledger:e}=t,o=(t.hoy??st)(),s=t.accounts().filter(x=>x.activo),n=a.vista==="agrupado",i=a.vista==="intervalo",{desde:r,hasta:c}=n?oo(a.periodoDesde,a.periodoHasta):i?Cl(a.intervaloDesde,a.intervaloHasta):Ve(a.mes),l={cuentaId:a.cuentaId||void 0,desde:r,hasta:c,texto:a.filtroTexto||void 0},p=e.transacciones(l),d=t.estimaciones().filter(x=>x.tipo!=="transferencia"),u=[...d.map(x=>({_id:x._id,etiqueta:`${m(x.concepto)} (${m(D(x.cuantia))})`})),...t.loans().filter(x=>x.activo).map(x=>({_id:x._id,etiqueta:`Préstamo: ${m(x.nombre)}`})),...t.nominas().filter(x=>x.activo).map(x=>({_id:x._id,etiqueta:`Nómina: ${m(x.nombre)}`}))],v=p.filter(x=>x.tipo!=="transferencia"&&x.importeCts<0).reduce((x,z)=>x+z.importeCts,0),g=p.filter(x=>x.tipo!=="transferencia"&&x.importeCts>0).reduce((x,z)=>x+z.importeCts,0),b=a.cuentaId?e.saldoCuenta(a.cuentaId,c):e.saldoTotal(c),$=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),f=s.map(x=>`<option value="${m(x._id)}"${x._id===a.cuentaId?" selected":""}>${m(x.nombre)}</option>`).join(""),h=x=>'<option value="">— sin asignar —</option>'+u.map(z=>`<option value="${m(z._id)}"${z._id===x?" selected":""}>${z.etiqueta}</option>`).join(""),S=x=>Object.keys(Ws).map(z=>`<option value="${z}"${z===x?" selected":""}>${Ws[z]}</option>`).join(""),w=Ks(p,a.pagina,a.porPagina),I=new Map(t.accounts().map(x=>[x._id,x.nombre])),A=w.pagina.map(x=>`
      <tr data-tx="${m(x._id)}" style="border-bottom:1px solid var(--border)${x.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${m(x.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${m(x.concepto)}</td>
        <td style="padding:7px 8px">${as(x.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${m(I.get(x.cuentaId)??x.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${m(x._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${S(x.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${m(x._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${h(x.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Qt(ct(x.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          ${x.importeCts<0&&x.tipo!=="transferencia"?`<button type="button" class="btn-secondary tx-imprevisto${x.imprevisto?" activo":""}" data-tx-imprevisto="${m(x._id)}" aria-pressed="${x.imprevisto?"true":"false"}"
                  title="${x.imprevisto?x.estimacionId?"Marcado como imprevisto, pero cuenta a través de su estimación":"Marcado como imprevisto. Pulsa para quitar la marca":"Marcar como imprevisto"}">⚡${x.imprevisto?" Imprevisto":""}</button>`:""}
          <button class="btn-secondary" data-tx-editar="${m(x._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${m(x._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`).join(""),M=i?hl(e,d,r,c):[],C=n?e.transacciones({desde:r,hasta:c}):[],y=n?so(p):[],E=Ks(y,a.pagina,a.porPagina),_=E.pagina.map(x=>{const z=a.detalleAbierto.has(x.concepto),T=z?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${as(x.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${m(x.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${m(x.concepto)}">Asignar</button>
               </div>
               ${Ml(Sl(x,C))}
             </td>
           </tr>`:"",q=z?x.movimientos.map(F=>{var R;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${m(F.fecha)}</span> · ${m(((R=t.accounts().find(j=>j._id===F.cuentaId))==null?void 0:R.nombre)??F.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${m(F._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${h(F.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Qt(ct(F.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${m(x.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${m(x.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${z?"▾":"▸"}</button>
          <span style="font-size:13px">${m(x.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${x.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${m(x.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${x.movimientos.length} movimientos del grupo de golpe">${h(x.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Qt(ct(x.total))}</td>
        <td></td>
      </tr>${T}${q}`}).join(""),P=$.slice().reverse().slice(0,8).map(x=>{var z;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${m(x.fecha)}</span>
        <span style="color:var(--text3)">${m(((z=t.accounts().find(T=>T._id===x.cuentaId))==null?void 0:z.nombre)??x.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${m(D(ct(x.saldoCts)))}</span>
        ${x.nota?`<span style="color:var(--text3)">${m(x.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${m(x._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin-bottom:10px">
          <div class="card-title" style="margin:0">Movimientos reales</div>
          <div class="flex gap-6">
            <button class="btn-secondary btn-sm" data-acc-vista="mensual" style="${a.vista==="mensual"?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">Mes</button>
            <button class="btn-secondary btn-sm" data-acc-vista="intervalo" style="${i?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}" title="Elige un rango de fechas concreto, aunque cruce varios meses">Intervalo</button>
            <button class="btn-secondary btn-sm" data-acc-vista="agrupado" style="${n?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}" title="Agrupa los gastos que se repiten con el mismo concepto en un periodo, para asignarles la estimación de golpe">Agrupar por concepto</button>
          </div>
        </div>
        <div class="flex gap-8 flex-wrap mb-10" style="align-items:flex-end">
          <div class="form-group" style="margin:0">
            <label class="form-label">Cuenta</label>
            <select class="form-input" id="acc-cuenta" style="min-width:150px"><option value="">Todas</option>${f}</select>
          </div>
          ${n?`<div class="form-group" style="margin:0">
                   <label class="form-label">Desde</label>
                   <input class="form-input" type="month" id="acc-periodo-desde" value="${m(a.periodoDesde)}" style="width:140px"/>
                 </div>
                 <div class="form-group" style="margin:0">
                   <label class="form-label">Hasta</label>
                   <input class="form-input" type="month" id="acc-periodo-hasta" value="${m(a.periodoHasta)}" style="width:140px"/>
                 </div>`:i?`<div class="form-group" style="margin:0">
                     <label class="form-label">Desde</label>
                     <input class="form-input" type="date" id="acc-intervalo-desde" value="${m(a.intervaloDesde)}" style="width:150px"/>
                   </div>
                   <div class="form-group" style="margin:0">
                     <label class="form-label">Hasta</label>
                     <input class="form-input" type="date" id="acc-intervalo-hasta" value="${m(a.intervaloHasta)}" style="width:150px"/>
                   </div>`:`<div class="form-group" style="margin:0">
                     <label class="form-label">Mes</label>
                     <input class="form-input" type="month" id="acc-mes" value="${m(a.mes)}" style="width:140px"/>
                   </div>`}
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${m(a.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${Qt(ct(v))}</span>
          <span>Ingresos: ${Qt(ct(g))}</span>
          <span>Neto: ${Qt(ct(g+v))}</span>
          <span style="margin-left:auto">Saldo a ${m(c)}: <strong>${m(D(b))}</strong></span>
        </div>

        ${n?`<div class="text-sm mb-8" style="color:var(--text3)">Conceptos idénticos repetidos entre ${m(a.periodoDesde)} y ${m(a.periodoHasta)}. Cambia la estimación de la fila para asignarla a todos los movimientos del grupo a la vez.</div>
               ${ua(E,a.porPagina,"conceptos")}
               <div style="overflow-x:auto" data-acc-tabla>
                 <table style="width:100%;border-collapse:collapse">
                   <thead>
                     <tr style="background:var(--bg3)">
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Concepto</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Repeticiones</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Estimación relacionada</th>
                       <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Total</th>
                       <th></th>
                     </tr>
                   </thead>
                   <tbody>
                     ${_||'<tr><td colspan="5" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Ningún concepto se repite en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${ua(E,a.porPagina,"conceptos")}`:`${ua(w,a.porPagina,"movimientos")}
               <div style="overflow-x:auto" data-acc-tabla>
                 <table style="width:100%;border-collapse:collapse">
                   <thead>
                     <tr style="background:var(--bg3)">
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Fecha</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Concepto</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Etiquetas</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Cuenta</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Tipo</th>
                       <th style="padding:7px 8px;text-align:left;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Estimación relacionada</th>
                       <th style="padding:7px 8px;text-align:right;font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">Importe</th>
                       <th></th>
                     </tr>
                   </thead>
                   <tbody>
                     ${A||'<tr><td colspan="8" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${ua(w,a.porPagina,"movimientos")}
               ${i?`<div class="divider"></div>
                      <div class="flex justify-between items-center flex-wrap mb-8" style="gap:8px">
                        <div class="card-title" style="margin:0">Real frente a estimado — ${m(r)} → ${m(c)}</div>
                        <div class="flex gap-6">
                          ${ao("neto",a.comparativa,"Neto","Ingresos menos gastos: no se descuadra por un traspaso entre tus cuentas")}
                          ${ao("gasto",a.comparativa,"Gasto","Solo el gasto")}
                          ${ao("ingreso",a.comparativa,"Ingresos","Solo lo que entra")}
                        </div>
                      </div>
                      ${xl(M,a.comparativa)}`:""}`}
      </div>

      <div>
        <div class="card mb-14">
          <div class="card-title">Registrar movimiento</div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="nt-fecha" value="${m(o)}"/></div>
            <div class="form-group"><label class="form-label">Tipo</label>
              <select class="form-input" id="nt-tipo">
                <option value="gasto">Gasto</option>
                <option value="ingreso">Ingreso</option>
                <option value="ajuste">Ajuste</option>
                <option value="transferencia">Transferencia entre mis cuentas</option>
              </select>
            </div>
          </div>
          <div class="form-group"><label class="form-label">Concepto</label><input class="form-input" type="text" id="nt-concepto" placeholder="Compra supermercado"/></div>
          <div class="grid-2">
            <div class="form-group"><label class="form-label">Importe (€)</label><input class="form-input" type="number" id="nt-importe" step="0.01" min="0" placeholder="0,00"/></div>
            <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="nt-cuenta">${f}</select></div>
          </div>
          <div class="form-group">
            <label class="form-label">Etiquetas (separadas por comas)</label>
            <input class="form-input" type="text" id="nt-tags" list="acc-tags-list" placeholder="casa, luz"/>
            <datalist id="acc-tags-list">${t.tagsConocidas().map(x=>`<option value="${m(x)}"></option>`).join("")}</datalist>
          </div>
          <label class="flex gap-8 items-center mb-8" style="font-size:12px;color:var(--text2)">
            <label class="toggle"><input type="checkbox" id="nt-imprevisto"/><span class="toggle-slider"></span></label>
            Imprevisto (una avería, el dentista…)
          </label>
          <div class="form-group">
            <label class="form-label">Estimación relacionada</label>
            <select class="form-input" id="nt-estimacion">${h(null)}</select>
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
            <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="pc-fecha" value="${m(o)}"/></div>
            <div class="form-group"><label class="form-label">Saldo (€)</label><input class="form-input" type="number" id="pc-saldo" step="0.01" placeholder="0,00"/></div>
          </div>
          <div class="form-group"><label class="form-label">Cuenta</label><select class="form-input" id="pc-cuenta">${f}</select></div>
          <div class="form-group"><label class="form-label">Nota (opcional)</label><input class="form-input" type="text" id="pc-nota" placeholder="extracto del banco"/></div>
          <button class="btn-secondary full-width" id="pc-guardar">Registrar saldo</button>
          ${P?`<div class="mt-12">${P}</div>`:""}
        </div>
      </div>
    </div>`}function El(t,a,e,o){const{ledger:s}=a,n=()=>{e.pagina=1,o()};tt(t,"#acc-cuenta",r=>{e.cuentaId=r.value,n()}),tt(t,"#acc-mes",r=>{e.mes=r.value||e.mes,n()}),k(t,"[data-acc-vista]",r=>{e.vista=r.getAttribute("data-acc-vista")||"mensual",n()}),tt(t,"#acc-periodo-desde",r=>{e.periodoDesde=r.value||e.periodoDesde,n()}),tt(t,"#acc-periodo-hasta",r=>{e.periodoHasta=r.value||e.periodoHasta,n()}),k(t,"[data-acc-pagina]",r=>{var c;r.disabled||(e.pagina=Number(r.getAttribute("data-acc-pagina"))||1,o(),(c=t.querySelector("[data-acc-tabla]"))==null||c.scrollIntoView({block:"start"}))}),tt(t,"[data-acc-por-pagina]",r=>{const c=Number(r.value);e.porPagina=Number.isFinite(c)&&c>=0?c:50,e.pagina=1,o()}),k(t,"[data-acc-comparativa]",r=>{e.comparativa=r.getAttribute("data-acc-comparativa")||"neto",o()}),tt(t,"#acc-intervalo-desde",r=>{e.intervaloDesde=r.value||e.intervaloDesde,n()}),tt(t,"#acc-intervalo-hasta",r=>{e.intervaloHasta=r.value||e.intervaloHasta,n()}),k(t,"[data-grp-detalle]",r=>{const c=r.getAttribute("data-grp-detalle");e.detalleAbierto.has(c)?e.detalleAbierto.delete(c):e.detalleAbierto.add(c),o()}),tt(t,"[data-grp-estimacion]",r=>{const c=r.getAttribute("data-grp-estimacion"),l=r.value||null,{desde:p,hasta:d}=oo(e.periodoDesde,e.periodoHasta),u=s.transacciones({cuentaId:e.cuentaId||void 0,desde:p,hasta:d,texto:e.filtroTexto||void 0}),v=so(u).find(g=>g.concepto===c);if(v){for(const g of v.movimientos)s.asignarEstimacion(g._id,l);H(`Estimación asignada a ${v.movimientos.length} movimientos`),a.onDatosCambiados(),o()}}),k(t,"[data-grp-tags-asignar]",r=>{var b;const c=r.getAttribute("data-grp-tags-asignar"),l=((b=r.closest("tr"))==null?void 0:b.querySelector("[data-grp-tags]"))??null,p=((l==null?void 0:l.value)??"").split(",").map($=>$.trim().toLowerCase()).filter(Boolean);if(p.length===0)return H("Escribe al menos una etiqueta","err");const{desde:d,hasta:u}=oo(e.periodoDesde,e.periodoHasta),v=s.transacciones({cuentaId:e.cuentaId||void 0,desde:d,hasta:u,texto:e.filtroTexto||void 0}),g=so(v).find($=>$.concepto===c);if(g){for(const $ of g.movimientos)s.actualizar($._id,{tags:[...new Set([...$.tags,...p])]});H(`Etiquetas añadidas a ${g.movimientos.length} movimientos`),a.onDatosCambiados(),o()}});const i=t.querySelector("#acc-buscar");i==null||i.addEventListener("input",()=>{e.filtroTexto=i.value,clearTimeout(i._t),i._t=window.setTimeout(()=>{n();const r=document.getElementById("acc-buscar");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},200)}),k(t,"#nt-guardar",()=>{var p;const r=Dt(t,"#nt-concepto").trim(),c=os(t,"#nt-importe");if(!r)return H("Indica un concepto","err");if(!(c>0))return H("Indica un importe mayor que cero","err");const l=Dt(t,"#nt-tags").split(",").map(d=>d.trim().toLowerCase()).filter(Boolean);s.registrar({fecha:Dt(t,"#nt-fecha")||(a.hoy??st)(),cuentaId:Dt(t,"#nt-cuenta"),importe:c,concepto:r,tags:l,tipo:Dt(t,"#nt-tipo"),estimacionId:Dt(t,"#nt-estimacion")||null,imprevisto:((p=t.querySelector("#nt-imprevisto"))==null?void 0:p.checked)||void 0}),H("Movimiento registrado"),a.onDatosCambiados(),o()}),k(t,"[data-tx-borrar]",r=>{const c=r.dataset.txBorrar;St("¿Eliminar este movimiento?")&&(s.eliminar(c),H("Movimiento eliminado"),a.onDatosCambiados(),o())}),k(t,"[data-tx-editar]",r=>{const c=r.dataset.txEditar,l=s.transacciones().find(u=>u._id===c);if(!l)return;const p=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(ct(l.importeCts))));if(p===null)return;const d=parseFloat(p.replace(",","."));if(!Number.isFinite(d)||d<=0)return H("Importe no válido","err");s.actualizar(c,{importe:d}),H("Movimiento actualizado"),a.onDatosCambiados(),o()}),k(t,"[data-tx-imprevisto]",r=>{const c=r.getAttribute("data-tx-imprevisto"),l=s.transacciones().find(d=>d._id===c);if(!l)return;const p=!l.imprevisto;s.actualizar(c,{imprevisto:p||void 0}),H(p?l.estimacionId?"Marcado como imprevisto. Ojo: está asignado a una estimación y cuenta a través de ella":"Marcado como imprevisto":"Ya no es un imprevisto"),a.onDatosCambiados(),o()}),tt(t,"[data-tx-estimacion]",r=>{const c=r.getAttribute("data-tx-estimacion");s.asignarEstimacion(c,r.value||null),H("Asignación actualizada"),a.onDatosCambiados()}),tt(t,"[data-tx-tipo]",r=>{const c=r.getAttribute("data-tx-tipo");s.actualizar(c,{tipo:r.value}),H("Tipo actualizado"),a.onDatosCambiados(),o()}),k(t,"#pc-guardar",()=>{if(Dt(t,"#pc-saldo").trim()==="")return H("Indica el saldo","err");const c=os(t,"#pc-saldo");s.registrarPuntoControl(Dt(t,"#pc-cuenta"),Dt(t,"#pc-fecha")||(a.hoy??st)(),c,Dt(t,"#pc-nota").trim()||void 0),H("Saldo real registrado"),a.onDatosCambiados(),o()}),k(t,"[data-pc-borrar]",r=>{St("¿Eliminar este punto de control?")&&(s.eliminarPuntoControl(r.dataset.pcBorrar),H("Punto de control eliminado"),a.onDatosCambiados(),o())})}function Qs(t){var s;const a=t.estimaciones(),e=((s=t.rango)==null?void 0:s.call(t))??null,o=new Map(a.map(n=>[n._id,n]));return t.precision.analizarTodas(a,e?{desde:e.desde,hasta:e.hasta}:{}).map(n=>{const i=o.get(n.estimacionId);return{analisis:n,estimacion:i,sugerencia:Ra(n,i.cuantia)}}).filter(n=>!!n.estimacion)}function Pl(t){var e;const a=((e=t.rango)==null?void 0:e.call(t))??null;return a?m(`Limitado al periodo de la cabecera (${a.desde} → ${a.hasta}): se comparan los meses ya cerrados que caen dentro, recortados al intervalo. El mes en curso nunca entra.`):"Se comparan solo los meses ya cerrados que tengan movimientos reales."}function _l(t){var r;const a=Qs(t),e=a.filter(c=>c.analisis.precision!==null),o=a.filter(c=>c.sugerencia!==null),s=t.precision.analizarPorTag(a.map(c=>c.analisis));if(e.length===0)return`
      <div class="card mb-14">
        <div class="card-title">Precisión de las estimaciones</div>
        <div class="text-sm" style="color:var(--text2);line-height:1.6">
          Todavía no hay datos reales que comparar${(r=t.rango)!=null&&r.call(t)?" en el periodo de la cabecera":""}. Registra movimientos
          y asígnalos a una estimación (o etiquétalos igual) y aquí verás qué acierto tiene cada
          previsión, con la opción de ajustarla.
        </div>
      </div>`;const n=s.map(c=>`
      <tr style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px"><span class="tag">${m(c.tag)}</span></td>
        <td style="padding:7px 8px;text-align:right;font-size:12px;color:var(--text2)">${c.estimaciones}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(D(c.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(D(c.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Qt(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${gi(c.precision)}</td>
      </tr>`).join(""),i=(c,l="left")=>`<th style="padding:7px 8px;text-align:${l};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${c}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Ajuste de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm" style="color:var(--text2);line-height:1.6">
        ${Pl(t)}
        ${o.length>0?`Hay ${o.length} estimación(es) que se desvían de forma sistemática. Al ajustar, la
               estimación actual se cierra hoy y se crea su continuación con el importe corregido: el pasado se
               mantiene tal como lo estimaste.`:"Ninguna estimación se desvía lo bastante como para proponer un cambio de importe."}
      </div>
    </div>

    <div class="card mb-14">
      <div class="card-title">Precisión conjunta por etiqueta</div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse">
          <thead><tr style="background:var(--bg3)">
            ${i("Etiqueta")}${i("Estimaciones","right")}${i("Estimado","right")}${i("Real","right")}${i("Desviación","right")}${i("Precisión","right")}
          </tr></thead>
          <tbody>${n||'<tr><td colspan="6" style="padding:14px;text-align:center;color:var(--text2);font-size:13px">Sin etiquetas comparables.</td></tr>'}</tbody>
        </table>
      </div>
    </div>`}function Fl(t,a,e){k(t,"#ajustar-todas",()=>{const o=Qs(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const s=o.map(r=>`• ${r.concepto}: ${D(r.cuantiaActual)} → ${D(r.cuantiaSugerida)}`).join(`
`);if(!St(`Se van a ajustar ${o.length} estimaciones:

${s}

¿Continuar?`))return;const{aplicadas:n,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});H(i.length>0?`${n.length} ajustadas, ${i.length} con error`:`${n.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const Dl=[";",",","	","|"],Tl={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function pa(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ma(t,a){const e=[];let o="",s=!1;for(let n=0;n<t.length;n++){const i=t[n];s?i==='"'?t[n+1]==='"'?(o+='"',n++):s=!1:o+=i:i==='"'?s=!0:i===a?(e.push(o.trim()),o=""):o+=i}return e.push(o.trim()),e}function zl(t){let a=";",e=-1;for(const o of Dl){const s=t.slice(0,20).map(c=>ma(c,o).length),n=Math.max(...s);if(n<2)continue;const r=s.filter(c=>c===n).length*10+n;r>e&&(e=r,a=o)}return a}function Ue(t){let a=(t??"").trim();if(!a)return null;let e=!1;if(/^\(.*\)$/.test(a)&&(e=!0,a=a.slice(1,-1).trim()),a.endsWith("-")&&(e=!0,a=a.slice(0,-1).trim()),a.startsWith("-")&&(e=!0,a=a.slice(1).trim()),a.startsWith("+")&&(a=a.slice(1).trim()),a=a.replace(/[€$£\s  ]/g,""),!a)return null;const o=a.lastIndexOf(","),s=a.lastIndexOf(".");let n="";o>=0&&s>=0?n=o>s?",":".":o>=0?n=/,\d{3}$/.test(a)&&a.replace(/,/g,"").length>3?"":",":s>=0&&(n=/\.\d{3}$/.test(a)&&a.replace(/\./g,"").length>3?"":".");let i,r="0";if(n){const p=n===","?o:s;i=a.slice(0,p).replace(/[.,]/g,""),r=a.slice(p+1).replace(/[.,]/g,"")}else i=a.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),l=Number(i||"0")*100+Number(c);return Number.isFinite(l)?e?-l:l:null}function no(t){const a=(t??"").trim();if(!a)return null;let e=a.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(e)return Xs(Number(e[1]),Number(e[2]),Number(e[3]));if(e=a.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),e){let o=Number(e[3]);return o<100&&(o+=o<70?2e3:1900),Xs(o,Number(e[2]),Number(e[1]))}return null}function Xs(t,a,e){if(a<1||a>12||e<1||e>31)return null;const o=new Date(t,a-1,e);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==e?null:`${t}-${String(a).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function Zs(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>no(e)!==null).length/a.length}function tn(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>Ue(e)!==null).length/a.length}function jl(t,a){const e={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,s=n=>a.map(i=>i[n]??"");for(const n of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=pa(t[i]);if(r&&Tl[n].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(n==="importe"&&pa(t[i]).includes("saldo"))continue;e[n]=i,o.add(i);break}}if(e.fecha<0){let n=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=Zs(s(r));c>i&&(i=c,n=r)}n>=0&&(e.fecha=n,o.add(n))}if(e.importe<0&&e.debe<0&&e.haber<0){let n=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||pa(t[r]).includes("saldo"))continue;const c=tn(s(r));c>i&&(i=c,n=r)}n>=0&&(e.importe=n,o.add(n))}if(e.concepto<0){let n=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=s(r);if(tn(c)>.5||Zs(c)>.5)continue;const l=c.reduce((p,d)=>p+d.length,0)/Math.max(1,c.length);l>i&&(i=l,n=r)}n>=0&&(e.concepto=n)}return e}function ql(t){const a=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(p=>p.trim()!=="");if(a.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const e=zl(a),o=a.map(p=>ma(p,e).length),s=Math.max(...o);let n=o.findIndex(p=>p===s);n<0&&(n=0);const i=ma(a[n],e);let r=a.slice(n+1).map(p=>ma(p,e));const c=no(i[0]??"")!==null||i.some(p=>Ue(p)!==null&&/\d/.test(p));c&&(r=[i,...r]);const l=jl(c?i.map(()=>""):i,r.slice(0,40));return{separador:e,cabeceras:c?i.map((p,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:n+1,mapeo:l}}function en(t,a,e){return`${t}|${a}|${pa(e).replace(/\s+/g," ")}`}function Nl(t,a,e=[]){const o=new Map;for(const n of e){const i=en(n.fecha,n.importeCts,n.concepto);o.set(i,(o.get(i)??0)+1)}const s=new Map;return t.filas.map((n,i)=>{const r=[],c=a.fecha>=0?no(n[a.fecha]??""):null;a.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${n[a.fecha]??""}»`);let l=null;if(a.importe>=0)l=Ue(n[a.importe]??""),l===null&&r.push(`importe ilegible: «${n[a.importe]??""}»`);else if(a.debe>=0||a.haber>=0){const u=a.debe>=0?Ue(n[a.debe]??""):null,v=a.haber>=0?Ue(n[a.haber]??""):null;u===null&&v===null?r.push("sin importe en Debe ni en Haber"):u!==null&&u!==0?l=-Math.abs(u):v!==null&&v!==0?l=Math.abs(v):l=0}else r.push("sin columna de importe");l===0&&r.push("importe cero");const p=(a.concepto>=0?n[a.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(c&&l!==null){const u=en(c,l,p),v=(s.get(u)??0)+1;s.set(u,v),d=v<=(o.get(u)??0)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:p,importeCts:l,errores:r,duplicada:d}})}function Rl(t,a){const e=t.filter(s=>s.errores.length===0&&(a||!s.duplicada)),o=e.map(s=>s.fecha).filter(s=>!!s).sort();return{total:t.length,importables:e.length,conError:t.filter(s=>s.errores.length>0).length,duplicadas:t.filter(s=>s.duplicada).length,sumaCts:e.reduce((s,n)=>s+(n.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function fa(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const kl=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function io(t,a){if(!a.analisis||!a.mapeo){a.filas=[];return}const e=t.ledger.transacciones(a.cuentaId?{cuentaId:a.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));a.filas=Nl(a.analisis,a.mapeo,e)}function Ll(t,a){const e=t.accounts().filter(s=>s.activo);if(!a.abierto)return`
      <div class="card">
        <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
          <div>
            <div class="card-title" style="margin:0">Importar extracto</div>
            <div class="text-sm mt-4" style="color:var(--text3)">
              Sube el CSV que descargas del banco en vez de teclear los movimientos.
            </div>
          </div>
          <div class="flex gap-8">
            <button class="btn-secondary btn-sm" data-imp-sincronizar title="Vuelve a borrar los históricos manuales dentro del rango ya importado de cada cuenta, sin subir nada nuevo">↻ Sincronizar históricos</button>
            <button class="btn-secondary btn-sm" data-imp-abrir>Importar CSV</button>
          </div>
        </div>
      </div>`;const o=e.map(s=>`<option value="${m(s._id)}"${s._id===a.cuentaId?" selected":""}>${m(s.nombre)}</option>`).join("");return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Importar extracto</div>
        <button class="btn-secondary btn-sm" data-imp-cerrar>Cancelar</button>
      </div>

      ${a.error?`<div class="alert-card alert-danger mb-12"><div class="alert-body">${m(a.error)}</div></div>`:""}

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

      ${a.analisis&&a.mapeo?Hl(a,a.analisis,a.mapeo):Ol()}
    </div>`}function Ol(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function Hl(t,a,e){const o=Rl(t.filas,t.incluirDuplicadas),s=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+a.cabeceras.map((c,l)=>`<option value="${l}"${l===r?" selected":""}>${m(c||`Columna ${l+1}`)}</option>`).join(""),n=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${m(t.nombreFichero)}</strong> · ${a.filas.length} línea${a.filas.length!==1?"s":""}
      · separador <code>${m(a.separador==="	"?"tabulador":a.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${kl.map(r=>`<div class="form-group">
          <label class="form-label" for="imp-col-${r.clave}">${m(r.etiqueta)}</label>
          <select class="form-select" id="imp-col-${r.clave}" data-imp-col="${r.clave}">${s(e[r.clave])}</select>
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
        <div class="stat-value" style="font-size:1.15rem">${Qt(ct(o.sumaCts))}</div>
      </div>
      <div class="stat-card" style="padding:11px">
        <div class="stat-label">Periodo</div>
        <div class="stat-value" style="font-size:0.95rem">${o.desde?`${m(o.desde)} → ${m(o.hasta??"")}`:"—"}</div>
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
               <div class="alert-sub">${n.slice(0,4).map(r=>`línea ${r.linea}: ${m(r.errores[0])}`).join(" · ")}${n.length>4?" …":""}</div>
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
          ${i.map(r=>{const c=r.errores.length>0,l=c?r.errores[0]:r.duplicada?"repetido":"se importa",p=c?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${c?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${m(r.fecha??"—")}</td>
                <td style="font-size:12px">${m(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":m(D(ct(r.importeCts)))}</td>
                <td style="font-size:11px;color:${p}">${m(l)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function Bl(t,a,e,o){k(t,"[data-imp-sincronizar]",()=>{const n=a.ledger.sincronizarHistoricoImportado();if(n.length===0)return H("Nada que sincronizar: no hay movimientos importados todavía");const i=p=>{var d;return((d=a.accounts().find(u=>u._id===p))==null?void 0:d.nombre)??p},r=n.reduce((p,d)=>p+d.eliminados,0),c=n.reduce((p,d)=>p+d.semanales,0),l=n.map(p=>`${i(p.cuentaId)} (${p.semanales})`).join(", ");H(`Histórico al día: ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""} · ${l}`+(r>0?` · ${r} manual${r!==1?"es":""} sustituido${r!==1?"s":""}`:"")),a.onDatosCambiados(),o()}),k(t,"[data-imp-abrir]",()=>{const n=a.accounts().filter(i=>i.activo);Object.assign(e,fa(),{abierto:!0,cuentaId:n.length===1?n[0]._id:""}),o()}),k(t,"[data-imp-cerrar]",()=>{Object.assign(e,fa()),o()}),tt(t,"#imp-cuenta",n=>{e.cuentaId=n.value,io(a,e),o()}),tt(t,"#imp-duplicadas",n=>{e.incluirDuplicadas=n.checked,o()}),tt(t,"[data-imp-col]",n=>{const i=n,r=i.dataset.impCol;e.mapeo&&(e.mapeo[r]=Number(i.value),io(a,e),o())});const s=t.querySelector("#imp-fichero");s==null||s.addEventListener("change",()=>{var i;const n=(i=s.files)==null?void 0:i[0];n&&Gl(n).then(r=>{const c=ql(r);e.nombreFichero=n.name,e.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",e.analisis=c,e.mapeo={...c.mapeo},io(a,e),o()}).catch(r=>{e.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),k(t,"[data-imp-confirmar]",()=>{if(!e.cuentaId)return;const n=e.filas.filter(l=>l.errores.length===0&&(e.incluirDuplicadas||!l.duplicada));if(n.length===0)return;for(const l of n)a.ledger.registrar({fecha:l.fecha,cuentaId:e.cuentaId,importe:Math.abs(ct(l.importeCts)),tipo:l.importeCts<0?"gasto":"ingreso",concepto:l.concepto,origen:"importado"});const i=n.map(l=>l.fecha).sort(),r=a.ledger.eliminarPuntosControlEnRango(e.cuentaId,i[0],i[i.length-1]),c=a.ledger.generarPuntosSemanales(e.cuentaId);H(`${n.length} movimiento${n.length!==1?"s":""} importado${n.length!==1?"s":""} · histórico con ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(e,fa()),a.onDatosCambiados(),o()})}function Gl(t){return t.arrayBuffer().then(a=>{const e=new TextDecoder("utf-8").decode(a);if(!e.includes("�"))return e;try{return new TextDecoder("iso-8859-1").decode(a)}catch{return e}})}const ga=26,ro=7,co=(ga+ro)*2,an=2*Math.PI*ga,on=12;function Vl(t){if(t.estimado<=0)return t.real>0?{color:"var(--yellow)",fraccion:1,etiqueta:["sin","prever"]}:{color:"var(--text3)",fraccion:0,etiqueta:["—"]};const a=t.real/t.estimado*100;return{color:a>110?"var(--red)":a>100?"var(--yellow)":"var(--accent)",fraccion:Math.min(1,t.real/t.estimado),etiqueta:[`${Math.round(a)}%`]}}function Ul(t){const{color:a,fraccion:e,etiqueta:o}=Vl(t),s=co/2,n=`${t.tag}: real ${D(t.real)} de ${D(t.estimado)} previsto (${t.desviacion>=0?"+":""}${D(t.desviacion)})`;return`
    <div style="text-align:center;min-width:96px">
      <svg viewBox="0 0 ${co} ${co}" style="width:78px;height:78px" role="img" aria-label="${m(n)}">
        <title>${m(n)}</title>
        <circle cx="${s}" cy="${s}" r="${ga}" fill="none" stroke="var(--bg3)" stroke-width="${ro}"/>
        <circle cx="${s}" cy="${s}" r="${ga}" fill="none" stroke="${a}" stroke-width="${ro}"
                stroke-linecap="round" stroke-dasharray="${(an*e).toFixed(2)} ${an.toFixed(2)}"
                transform="rotate(-90 ${s} ${s})"/>
        ${o.map((i,r)=>{const c=o.length>1?9:12,l=s+(o.length>1?r*10-1:4);return`<text x="${s}" y="${l}" text-anchor="middle" font-size="${c}" font-family="var(--font-mono)" fill="var(--text2)">${m(i)}</text>`}).join("")}
      </svg>
      <div style="font-size:11px;color:var(--text);margin-top:2px;word-break:break-word">${m(t.tag)}</div>
      <div style="font-size:10px;color:var(--text2);font-family:var(--font-mono)">${m(D(t.real))}</div>
      <div style="font-size:10px;color:var(--text3);font-family:var(--font-mono)">de ${m(D(t.estimado))}</div>
    </div>`}function Yl(t){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin gasto etiquetado en este periodo.</div>';const a=t.slice(0,on),e=t.slice(on),o=e.reduce((s,n)=>s+n.real,0);return`
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start">
      ${a.map(Ul).join("")}
    </div>
    <div class="flex flex-wrap" style="gap:6px 18px;font-size:11px;color:var(--text2);margin-top:10px">
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent);margin-right:4px"></span>dentro de lo previsto</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--yellow);margin-right:4px"></span>pasado o sin prever</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--red);margin-right:4px"></span>más de un 10 % por encima</span>
      ${e.length>0?`<span style="color:var(--text3)">y ${e.length} etiqueta(s) más, ${m(D(o))}</span>`:""}
    </div>`}function Wl(){return{mes:"",modo:"mes"}}function sn(t,a){if(a.mes)return a.mes;const e=ls(t.ledger),o=ji((t.hoy??st)());return e.includes(o)?o:e[0]??o}function Ye(t,a){var i;const e=(t.hoy??st)(),o=t.estimaciones(),s={hoy:e,nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(i=t.resolverTramosIRPF)==null?void 0:i.call(t),omitidos:t.omitidos()};if(a.modo==="periodo"){const{desde:r,hasta:c}=t.periodo(),l=t.precision.analizarTodas(o,{hoy:e,desde:r,hasta:c});return sa(t.ledger,o,r,c,{...s,analisis:l})}const n=t.precision.analizarTodas(o,{hoy:e});return qi(t.ledger,o,sn(t,a),{...s,analisis:n})}function nn(t){var s;const a=(t.hoy??st)(),e=cs(t.estimaciones(),a,a,{nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(s=t.resolverTramosIRPF)==null?void 0:s.call(t)}),o=n=>e.filter(i=>i.tipo===n).map(i=>`<option value="${m(i._id)}">${m(i.concepto)}</option>`).join("");return{gasto:o("gasto"),ingreso:o("ingreso")}}function Bt(t,a){return a<=0?"—":`${m(D(t/a))}/mes`}function rn(t,a,e,o){const s=a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-cie-modo="${t}" title="${m(o)}" style="${s}">${m(e)}</button>`}function Kl(t,a){const e=a.modo==="periodo",o=sn(t,a),s=ls(t.ledger);s.includes(o)||s.unshift(o);const n=Ye(t,a),i=e?"Cierre del periodo":"Cierre de mes",r=e?`del ${m(n.desde)} al ${m(n.hasta)}`:m(xt(o)),c=`
    <div class="flex gap-6 items-center flex-wrap">
      ${rn("mes",!e,"Mes","Cierra un mes natural completo")}
      ${rn("periodo",e,"Periodo del header","Cierra el intervalo configurado arriba, aunque cruce varios meses o corte uno por la mitad")}
      ${e?`<span class="text-sm" style="color:var(--text2);font-family:var(--font-mono);margin-left:4px">${m(n.desde)} → ${m(n.hasta)}</span>`:`<select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
               ${s.map(d=>`<option value="${m(d)}"${d===o?" selected":""}>${m(xt(d))}</option>`).join("")}
             </select>`}
    </div>`;if(n.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">${i}</div>
          ${c}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados ${e?"":"en "}${r}. Importa el extracto del banco o
          registra los movimientos a mano y aquí verás en qué te desviaste respecto a lo que habías previsto.
        </div>
      </div>`;const l=d=>d>0?"+":"",p=n.desviacionNeta<0?"var(--red)":n.desviacionNeta>0?"var(--accent)":"var(--text2)";return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">${i}</div>
        ${c}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:6px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Gasto</div>
          <div class="stat-value" style="font-size:1.15rem">${m(D(n.real))}</div>
          <div class="stat-sub">${Bt(n.real,n.meses)} · previsto ${m(D(n.estimado))} (${Bt(n.estimado,n.meses)})</div>
          <div class="stat-sub">${l(n.desviacion)}${m(D(n.desviacion))} · ${l(n.desviacion)}${Bt(n.desviacion,n.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Ingresos</div>
          <div class="stat-value" style="font-size:1.15rem">${m(D(n.ingresosReales))}</div>
          <div class="stat-sub">${Bt(n.ingresosReales,n.meses)} · previsto ${m(D(n.ingresosEstimados))} (${Bt(n.ingresosEstimados,n.meses)})</div>
          <div class="stat-sub">${l(n.desviacionIngresos)}${m(D(n.desviacionIngresos))} · ${l(n.desviacionIngresos)}${Bt(n.desviacionIngresos,n.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación neta</div>
          <div class="stat-value" style="font-size:1.15rem;color:${p}">${l(n.desviacionNeta)}${m(D(n.desviacionNeta))}</div>
          <div class="stat-sub">${l(n.desviacionNeta)}${Bt(n.desviacionNeta,n.meses)}</div>
          <div class="stat-sub">neto real ${m(D(n.netoReal))} · previsto ${m(D(n.netoEstimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${n.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${m(D(n.totalSinEstimacion))}</div>
          <div class="stat-sub">${Bt(n.totalSinEstimacion,n.meses)} · ${n.sinEstimacion.length} concepto${n.sinEstimacion.length!==1?"s":""} de gasto</div>
          <div class="stat-sub">${n.totalIngresosSinPrever>0?`${m(D(n.totalIngresosSinPrever))} de ingreso`:"sin ingresos sueltos"}</div>
        </div>
      </div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        El periodo son ${m(n.meses.toFixed(1).replace(".",","))} meses; «/mes» es el total repartido entre ellos.
      </div>

      ${Jl(n)}
      ${Ql(n,nn(t))}
      ${Zl(n,nn(t))}
      ${Xl(n)}
    </div>

    <div class="card mb-14">
      <div class="card-title mb-8">Real frente a previsto por etiqueta</div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        Cada anillo es una etiqueta: cuánto llevas gastado de lo que tenías previsto en el periodo.
        Un movimiento con varias etiquetas cuenta en todas, así que los anillos no reparten el total.
      </div>
      ${Yl(n.porTag)}
    </div>`}function Jl(t){const a=t.filas.filter(o=>o.estimado>0||o.real>0);if(a.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas en este periodo.</div>';const e=a.filter(o=>o.sugerencia);return`
    <div class="card-title mb-8">Dónde te desviaste (gastos e ingresos)</div>
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
          ${a.map(o=>{const s=o.tipo==="gasto"?o.desviacion>0:o.desviacion<0,n=o.desviacion===0?"var(--text2)":s?"var(--red)":"var(--accent)",i=o.sugerencia;return`<tr>
                <td style="font-size:12px">
                  ${m(o.concepto)}
                  ${o.tipo==="ingreso"?'<span class="badge" style="margin-left:6px">ingreso</span>':""}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                  <div style="font-size:10px;color:var(--text3)">${m(o.periodicidad)}</div>
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(D(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(D(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${n}">
                  ${o.desviacion>0?"+":""}${m(D(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${i?`<button class="btn-secondary btn-sm" data-cie-ajustar="${m(o.estimacionId)}"
                           title="Pasar el importe de cada pago (${m(o.periodicidad)}) de ${m(D(i.cuantiaActual))} a ${m(D(i.cuantiaSugerida))} · ${m(i.motivo)}"
                           style="font-size:11px;padding:2px 9px">→ ${m(D(i.cuantiaSugerida))}/pago</button>`:""}
                </td>
              </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    ${e.length>0?`<div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
             <div class="text-sm" style="color:var(--text2)">
               ${e.length===1?"1 estimación se desvía":`${e.length} estimaciones se desvían`}
               de forma sistemática. El importe propuesto es el de CADA pago, con la periodicidad de la estimación:
               ajustarla cierra la de hoy y abre una nueva con ese importe corregido.
             </div>
             <button class="btn-primary btn-sm" data-cie-ajustar-todas>Ajustar todas</button>
           </div>`:""}`}function cn(t,a,e,o){return`<tr>
    <td style="font-size:12px">${m(t.concepto)}</td>
    <td style="text-align:right;font-size:12px;color:var(--text3)">${t.movimientos}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${o}">${m(D(t.total))}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--text3)">${Bt(t.total,a)}</td>
    <td style="text-align:right;white-space:nowrap">
      <select class="form-select" data-cie-asignar="${m(t.clave)}" style="font-size:11px;padding:2px 6px;max-width:150px">
        <option value="">Asignar a…</option>
        ${e}
      </select>
      <button class="btn-secondary btn-sm" data-cie-imprevisto="${m(t.clave)}" title="Marcar estos movimientos como imprevisto: se siguen aparte en «Este mes» y entran en la estimación de imprevistos"
              style="font-size:11px;padding:2px 8px;margin-left:4px">⚡ Imprevisto</button>
      <button class="btn-secondary btn-sm" data-cie-omitir="${m(t.clave)}" title="No contar este concepto en el cierre"
              style="font-size:11px;padding:2px 8px;margin-left:4px">Omitir</button>
    </td>
  </tr>`}const ln=`<thead><tr>
  <th style="cursor:default">Concepto</th>
  <th style="cursor:default;text-align:right">Movimientos</th>
  <th style="cursor:default;text-align:right">Total</th>
  <th style="cursor:default;text-align:right">Al mes</th>
  <th style="cursor:default"></th>
</tr></thead>`;function Ql(t,a){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
      <div class="alert-icon">✓</div>
      <div class="alert-body">
        <div class="alert-title">Todo el gasto estaba previsto</div>
        <div class="alert-sub">Ningún movimiento se queda fuera de tus estimaciones.</div>
      </div>
    </div>`:`
    <div class="card-title mb-8">Gasto que no tenías previsto</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Movimientos que no cuadran con ninguna previsión. Asigna el grupo entero a una estimación
      (o a un préstamo) si es eso, u omítelo si no es gasto tuyo — un traspaso interno, por ejemplo.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${ln}
        <tbody>
          ${t.sinEstimacion.slice(0,10).map(e=>cn(e,t.meses,a.gasto,"var(--yellow)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function Xl(t){return t.omitidos.length===0?"":`
    <div class="card-title mb-8 mt-14">No se cuentan</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      ${t.omitidos.length} concepto(s) omitido(s), ${m(D(t.totalOmitido))} en el periodo. No suman ni en gasto ni en ingresos.
    </div>
    <div class="flex gap-6 flex-wrap">
      ${t.omitidos.map(a=>`<button class="btn-secondary btn-sm" data-cie-restaurar="${m(a.clave)}" title="Volver a contarlo"
                    style="font-size:11px;padding:2px 9px">${m(a.concepto)} · ${m(D(a.total))} ✕</button>`).join("")}
    </div>`}function Zl(t,a){return t.ingresosSinPrever.length===0?"":`
    <div class="card-title mb-8 mt-14">Ingresos que no tenías previstos</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Si alguno es el otro lado de un traspaso entre tus cuentas, márcalo como transferencia en Movimientos
      y dejará de contar en los dos sitios.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${ln}
        <tbody>
          ${t.ingresosSinPrever.slice(0,10).map(e=>cn(e,t.meses,a.ingreso,"var(--accent)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.ingresosSinPrever.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.ingresosSinPrever.length-10} concepto(s) más.</div>`:""}`}function td(t,a,e,o){tt(t,"#cie-mes",s=>{e.mes=s.value,o()}),k(t,"[data-cie-modo]",s=>{e.modo=s.getAttribute("data-cie-modo")||"mes",o()}),k(t,"[data-cie-omitir]",s=>{const n=s.getAttribute("data-cie-omitir"),i=a.omitidos();i.includes(n)||(a.setOmitidos([...i,n]),H("Concepto omitido: deja de contar en el cierre"),o())}),k(t,"[data-cie-imprevisto]",s=>{var c;const n=s.getAttribute("data-cie-imprevisto"),r=Ye(a,e).sinEstimacion.find(l=>l.clave===n);if(r){for(const l of r.ids)a.ledger.actualizar(l,{imprevisto:!0});H(`${r.ids.length} movimiento${r.ids.length===1?"":"s"} marcado${r.ids.length===1?"":"s"} como imprevisto`),(c=a.onDatosCambiados)==null||c.call(a),o()}}),k(t,"[data-cie-restaurar]",s=>{const n=s.getAttribute("data-cie-restaurar");a.setOmitidos(a.omitidos().filter(i=>i!==n)),o()}),tt(t,"[data-cie-asignar]",s=>{const n=s,i=n.getAttribute("data-cie-asignar"),r=n.value;if(!r)return;const c=Ye(a,e),l=[...c.sinEstimacion,...c.ingresosSinPrever].find(p=>p.clave===i);if(l){if(!St(`Se van a asignar ${l.movimientos} movimiento(s) de «${l.concepto}». ¿Continuar?`)){n.value="";return}for(const p of l.ids)a.ledger.asignarEstimacion(p,r);H(`${l.movimientos} movimiento(s) asignados`),a.onDatosCambiados(),o()}}),k(t,"[data-cie-ajustar]",s=>{const n=s.dataset.cieAjustar,r=Ye(a,e).filas.find(c=>c.estimacionId===n);r!=null&&r.sugerencia&&(a.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(a.hoy??st)()}),H(`«${r.concepto}» ajustada a ${D(r.sugerencia.cuantiaSugerida)}`),a.onDatosCambiados(),o())}),k(t,"[data-cie-ajustar-todas]",()=>{const n=Ye(a,e).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(n.length===0)return;const{aplicadas:i,errores:r}=a.adjuster.aplicarTodas(n,{hoy:(a.hoy??st)()});H((i.length===1?"1 estimación ajustada":`${i.length} estimaciones ajustadas`)+(r.length>0?` · ${r.length} con error`:"")),a.onDatosCambiados(),o()})}const ed="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function ad(t){const a=t.hoy??st,e=()=>{var q;return(q=t.onDatosCambiados)==null?void 0:q.call(t)},o=new Map;let s="cuentas";const n=wl(a().slice(0,7)),i=fa(),r=Wl(),c=()=>t.store.get("expenses"),l=()=>t.store.get("accounts"),p={ledger:t.ledger,accounts:l,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:a},d={ledger:t.ledger,accounts:l,onDatosCambiados:e},u=()=>t.store.get("config"),v=()=>({desde:u().dashboardStart,hasta:u().dashboardEnd}),g={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,nominas:()=>t.store.get("nominas"),loans:()=>t.store.get("loans"),resolverTramosIRPF:()=>me(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??Wt),omitidos:()=>u().cierreOmitidos??[],setOmitidos:q=>t.store.patchConfig({cierreOmitidos:q}),onDatosCambiados:e,periodo:v,hoy:a},b={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,rango:()=>r.modo==="periodo"?v():null,hoy:a},$=q=>{var F;return((F=t.store.get("accounts").find(R=>R._id===q))==null?void 0:F.nombre)??q},f=()=>me(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??Wt)(Number(a().slice(0,4))),h=()=>me(t.store.get("tramosGananciasCapitalHistorico"),u().tramosGananciasCapital??_e),S=()=>h()(Number(a().slice(0,4)));function w(){const q=u(),F=t.store.get("accounts"),R=Ro({loans:[],expenses:t.store.get("expenses").filter(B=>B.tipo==="transferencia"),accounts:F,config:{dashboardStart:q.dashboardStart,dashboardEnd:q.dashboardEnd,fechaReferencia:q.dashboardStart},nominas:[],resolverTramosGanancias:h()}),j=new Map,N=B=>{let V=j.get(B);return V||(V={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},j.set(B,V)),V},L=(B,V)=>{const Y=`${V.sourceId}`,K=B.find(W=>W.concepto===Y),Z=K??{concepto:Y,contraparte:"",total:0,ocurrencias:0};Z.total+=Math.abs(V.cuantia),Z.ocurrencias+=1,K||B.push(Z)};for(const B of R){if(!B.cuenta)continue;const V=N(B.cuenta);B.sourceType==="transfer-in"||B.sourceType==="traspaso-in"?(V.totalAportaciones+=Math.abs(B.cuantia),L(V.entradas,B)):B.sourceType==="transfer-out"||B.sourceType==="traspaso-out"?(V.totalReembolsos+=Math.abs(B.cuantia),L(V.salidas,B)):B.sourceType==="investment-tax"&&(V.retencion+=Math.abs(B.cuantia))}const G=t.store.get("expenses");for(const B of j.values())for(const[V,Y]of[[B.entradas,"cuenta"],[B.salidas,"cuentaDestino"]])for(const K of V){const Z=G.find(W=>W._id===K.concepto);K.contraparte=$((Z==null?void 0:Z[Y])??"default"),K.concepto=(Z==null?void 0:Z.concepto)||(Y==="cuenta"?"Aportación":"Reembolso")}return j}function I(q){const F=s==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let R;if(s==="cuentas"){const L=t.store.get("accounts").filter(V=>_t(V)!=="pension"),G=w(),B={config:u(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:f(),tramosGanancias:S(),flujos:V=>G.get(V)??tl,invModo:V=>o.get(V)??"proyeccion"};R=`${el(L,B.tramosGanancias)}<div class="grid-3">${L.map(V=>il(V,B)).join("")}</div>`}else s==="movimientos"?R='<div id="acc-tx"></div>':s==="importar"?R='<div id="acc-import"></div>':R='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';q.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${F}
      </div>
      ${gl(s)}
      ${R}`;const j=()=>I(q);if(s==="movimientos"){const N=q.querySelector("#acc-tx");N.innerHTML=Al(p,n),El(N,p,n,j)}else if(s==="importar"){const N=q.querySelector("#acc-import");N.innerHTML=Ll(d,i),Bl(N,d,i,j)}else if(s==="cierre"){const N=q.querySelector("#acc-cierre"),L=q.querySelector("#acc-precision");N.innerHTML=Kl(g,r),L.innerHTML=_l(b),td(N,g,r,j),Fl(L,b,j)}}const A=()=>document.getElementById("modal-overlay"),M=()=>Lt(),C=()=>{var q;return(q=A())==null?void 0:q.classList.add("hidden")};function y(q,F){const R=A(),j=M();return!R||!j?null:(j.innerHTML=q?`<div class="modal-title">${m(q)}</div>${F}`:F,R.classList.remove("hidden"),k(j,"[data-cancelar]",C),j)}function E(q,F){const R=q?t.store.get("accounts").find(G=>G._id===q)??null:null,j=[...(R==null?void 0:R.planAportaciones)??[]].map(G=>({...G})),N=R?_(R):null,L=y(q?"Editar cuenta / fondo":"Nueva cuenta / fondo",ll(R,{nominas:t.store.get("nominas"),hoy:a(),saldoActual:N??0}));L&&(dl(L,j,a()),k(L,"[data-guardar-acc]",G=>{const B=G.getAttribute("data-guardar-acc")||"",{datos:V,punto:Y,error:K}=ul(L,j,R,N,a());if(K)return H(K,"err");let Z=B;B?t.store.updateItem("accounts",B,V):Z=t.store.addItem("accounts",V)._id,Y&&t.ledger.registrarPuntoControl(Z,Y.fecha,Y.saldo,Y.nota),H(B?"Actualizada":"Cuenta / fondo creado"),e(),C(),F()}))}function _(q){const F=t.ledger.puntosControl(q._id);return F.length>0?eo(F)[0].saldo:q.saldo??null}function P(q,F){const R=t.store.get("accounts").find(L=>L._id===q);if(!R)return;const j=y("Histórico de saldos",pl(R.nombre,q,eo(t.ledger.puntosControl(q)),R.saldoInicial||0,a()));if(!j)return;const N=()=>{F(),P(q,F)};k(j,"[data-hist-anadir]",()=>{var V,Y,K;const L=((V=j.querySelector("#hi-fecha"))==null?void 0:V.value)??"",G=parseFloat(((Y=j.querySelector("#hi-saldo"))==null?void 0:Y.value)??""),B=((K=j.querySelector("#hi-nota"))==null?void 0:K.value.trim())??"";if(!L||!Number.isFinite(G))return H("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(q,L,G,B||void 0),H("Punto añadido"),e(),N()}),k(j,"[data-hist-borrar]",L=>{const[,G]=(L.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(G),H("Eliminado"),e(),N()}),k(j,"[data-hist-semanal]",L=>{const G=L.getAttribute("data-hist-semanal"),B=t.ledger.generarPuntosSemanales(G);H(B>0?`Histórico con ${B} punto${B!==1?"s":""} semanal${B!==1?"es":""}`:"Sin movimientos con los que calcular el histórico"),e(),N()}),k(j,"[data-hist-inicial]",L=>{const[G,B]=(L.getAttribute("data-hist-inicial")||"").split("|"),V=t.ledger.puntosControl(G).find(K=>K._id===B);if(!V)return;const Y=eo([V])[0].saldo;t.store.updateItem("accounts",G,{saldoInicial:Y,fechaInicialSaldo:V.fecha}),H(`Punto inicial → ${V.fecha} (${D(Y)})`),e(),N()})}function x(q){const F=t.store.get("accounts").filter(N=>N.activo);if(F.length===0)return H("No hay cuentas activas","err");const R=a(),j=F.map(N=>`• ${N.nombre}: ${D(_(N)??N.saldoInicial??0)}`).join(`
`);if(St(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${R})?

${j}

Esto recalibra el punto de arranque del dashboard.`)){for(const N of F)t.store.updateItem("accounts",N._id,{saldoInicial:_(N)??N.saldoInicial??0,fechaInicialSaldo:R});H("Saldo base actualizado"),e(),q()}}function z(q,F,R){k(q,"[data-cuentas-tab]",j=>{s=j.getAttribute("data-cuentas-tab")||"cuentas",F()}),k(q,"[data-nueva-acc]",()=>E(null,F)),k(q,"[data-editar-acc]",j=>E(j.getAttribute("data-editar-acc"),F)),k(q,"[data-tramos-ganancias]",()=>R.abrir()),k(q,"[data-reset-base]",()=>x(F)),k(q,"[data-hist-acc]",j=>P(j.getAttribute("data-hist-acc"),F)),k(q,"[data-principal-acc]",j=>{const N=j.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(L=>({...L,esCuentaPrincipal:L._id===N}))),H("Cuenta marcada como principal"),e(),F()}),k(q,"[data-borrar-acc]",j=>{var K,Z;const N=j.getAttribute("data-borrar-acc"),L=t.store.get("accounts");if(L.length<=1)return H("Debe existir al menos una cuenta","err");const G=L.find(W=>W._id===N);if(!G)return;const V=[[((K=t.ledger)==null?void 0:K.transacciones({cuentaId:N}).length)??0,"movimiento","movimientos"],[((Z=t.ledger)==null?void 0:Z.puntosControl(N).filter(W=>W.origen!=="derivado").length)??0,"saldo anotado","saldos anotados"],[t.store.get("expenses").filter(W=>(W.cuenta||"default")===N||W.cuentaDestino===N).length,"gasto o ingreso","gastos o ingresos"],[t.store.get("nominas").filter(W=>W.cuenta===N).length,"nómina","nóminas"],[t.store.get("loans").filter(W=>(W.cuenta||"default")===N).length,"préstamo","préstamos"]].filter(([W])=>W>0).map(([W,gt,vt])=>`${W} ${W===1?gt:vt}`);if(V.length>0){if(G.activo===!1)return H("Esta cuenta ya está desactivada y tiene datos: no se puede eliminar","warn");if(!St(`«${G.nombre}» tiene ${V.join(", ")}.

No se puede eliminar sin dejar esos datos sueltos. ¿Desactivarla? Dejará de contar en la proyección y conservará su historial; puedes reactivarla al editarla.`))return;let W=t.store.get("accounts").map(gt=>gt._id===N?{...gt,activo:!1,esCuentaPrincipal:!1}:gt);if(!W.some(gt=>gt.esCuentaPrincipal)){const gt=W.find(vt=>vt.activo!==!1)??W[0];W=W.map(vt=>vt._id===gt._id?{...vt,esCuentaPrincipal:!0}:vt)}t.store.set("accounts",W),H("Cuenta desactivada"),e(),F();return}if(!St(`¿Eliminar la cuenta «${G.nombre}»? No tiene movimientos ni nada asociado.`))return;t.store.removeItem("accounts",N);const Y=t.store.get("accounts");Y.length>0&&!Y.some(W=>W.esCuentaPrincipal)&&t.store.set("accounts",Y.map((W,gt)=>gt===0?{...W,esCuentaPrincipal:!0}:W)),H("Cuenta eliminada"),e(),F()}),k(q,"[data-inv-modo]",j=>{const[N,L]=(j.getAttribute("data-inv-modo")||"").split("|");o.set(N,L==="real"?"real":"proyeccion"),F()})}let T=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:ed,mount(q){const F=()=>I(q);T??(T=ml({store:t.store,onDatosCambiados:()=>{e(),F()},año:()=>Number(a().slice(0,4))})),I(q),q.dataset.wired!=="1"&&(z(q,F,T),q.dataset.wired="1")}}}function dn(t,a,e=!1){const o=Math.abs(Pt(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function od(t){function a(y){return`${y}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(y={}){var _;const E=(_=y.texto)==null?void 0:_.trim().toLowerCase();return t.get("transacciones").filter(P=>!(y.cuentaId&&P.cuentaId!==y.cuentaId||y.desde&&P.fecha<y.desde||y.hasta&&P.fecha>y.hasta||y.tipo&&P.tipo!==y.tipo||y.estimacionId&&P.estimacionId!==y.estimacionId||y.tags&&y.tags.length>0&&!y.tags.some(x=>P.tags.includes(x))||E&&!P.concepto.toLowerCase().includes(E))).sort((P,x)=>P.fecha.localeCompare(x.fecha)||P._id.localeCompare(x._id))}function o(y){const E={_id:a("tx"),fecha:y.fecha,cuentaId:y.cuentaId,importeCts:dn(y.tipo,y.importe,y.negativo),concepto:y.concepto,tags:y.tags??[],estimacionId:y.estimacionId??null,tipo:y.tipo,origen:y.origen??"manual",...y.nota?{nota:y.nota}:{},...y.imprevisto?{imprevisto:!0}:{}};return t.set("transacciones",[...t.get("transacciones"),E]),E}function s(y,E){t.set("transacciones",t.get("transacciones").map(_=>{if(_._id!==y)return _;const{importe:P,...x}=E,z={..._,...x};return P!==void 0&&(z.importeCts=dn(z.tipo,P,z.importeCts<0)),z}))}function n(y){t.set("transacciones",t.get("transacciones").filter(E=>E._id!==y))}function i(y,E){s(y,{estimacionId:E})}function r(y){return t.get("puntosControl").filter(E=>!y||E.cuentaId===y).sort((E,_)=>E.fecha.localeCompare(_.fecha))}function c(y){return r(y).filter(E=>E.origen!=="derivado")}function l(y,E,_,P){const x={_id:a("pc"),fecha:E,cuentaId:y,saldoCts:Pt(_),...P?{nota:P}:{}},z=t.get("puntosControl").filter(T=>!(T.cuentaId===y&&T.fecha===E));return t.set("puntosControl",[...z,x].sort((T,q)=>T.fecha.localeCompare(q.fecha))),u(y),x}function p(y){const E=t.get("puntosControl").find(_=>_._id===y);t.set("puntosControl",t.get("puntosControl").filter(_=>_._id!==y)),E&&(E.origen==="derivado"?$(E.cuentaId):u(E.cuentaId))}function d(y,E,_){const P=z=>z.cuentaId===y&&z.origen!=="derivado"&&z.fecha>=E&&z.fecha<=_,x=t.get("puntosControl").filter(P).length;return x===0?0:(t.set("puntosControl",t.get("puntosControl").filter(z=>!P(z))),$(y),x)}function u(y){var j,N;const E=c(y),_=t.get("transacciones").filter(L=>L.cuentaId===y).sort((L,G)=>L.fecha.localeCompare(G.fecha)),P=(j=_[0])==null?void 0:j.fecha,x=(N=_[_.length-1])==null?void 0:N.fecha,z=t.get("puntosControl").filter(L=>!(L.cuentaId===y&&L.origen==="derivado"));if(!P)return t.set("puntosControl",z),$(y),0;const T=[];for(let L=Ee(P);L<=x;L=Ee(ce(L,1)))T.push(L);T[T.length-1]!==x&&T.push(x);const q=new Set(E.map(L=>Ee(L.fecha))),F=L=>{const G=E.filter(B=>B.fecha<=L).pop();return _.filter(B=>B.fecha<=L&&(!G||B.fecha>G.fecha)).reduce((B,V)=>B+V.importeCts,(G==null?void 0:G.saldoCts)??0)},R=T.filter(L=>!q.has(Ee(L))).map(L=>({_id:a("pcd"),fecha:L,cuentaId:y,saldoCts:F(L),origen:"derivado"}));return t.set("puntosControl",[...z,...R].sort((L,G)=>L.fecha.localeCompare(G.fecha))),v(y,P,F(P)),$(y),R.length}function v(y,E,_){const P=t.get("accounts"),x=P.find(z=>z._id===y);!x||x.fechaInicialSaldo&&x.fechaInicialSaldo<=E||t.set("accounts",P.map(z=>z._id===y?{...z,saldoInicial:ct(_),fechaInicialSaldo:E}:z))}function g(y){return(y??[...new Set(t.get("transacciones").map(_=>_.cuentaId))]).reduce((_,P)=>_+u(P),0)}function b(y){const E=t.get("transacciones").filter(x=>x.origen==="importado"&&(!y||x.cuentaId===y)),_=new Map;for(const x of E){const z=_.get(x.cuentaId);z?z.push(x.fecha):_.set(x.cuentaId,[x.fecha])}const P=[];for(const[x,z]of _){z.sort();const T=d(x,z[0],z[z.length-1]);P.push({cuentaId:x,eliminados:T,semanales:u(x)})}return P}function $(y){const E=r(y),_=t.get("accounts");_.some(P=>P._id===y)&&t.set("accounts",_.map(P=>P._id===y?{...P,historicoSaldos:E.map(x=>({_id:x._id,fecha:x.fecha,saldo:ct(x.saldoCts),...x.nota?{nota:x.nota}:{}}))}:P))}function f(y,E=st()){const _=c(y).filter(T=>T.fecha<=E).pop(),P=_==null?void 0:_.fecha,x=(_==null?void 0:_.saldoCts)??0;return t.get("transacciones").filter(T=>T.cuentaId===y&&T.fecha<=E&&(P===void 0||T.fecha>P)).reduce((T,q)=>T+q.importeCts,x)}function h(y,E){return ct(f(y,E))}function S(y=st(),E){const _=E??t.get("accounts").filter(P=>P.activo).map(P=>P._id);return ct(_.reduce((P,x)=>P+f(x,y),0))}function w(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function I(){const y=[...t.get("transacciones").map(E=>E.fecha),...t.get("puntosControl").map(E=>E.fecha)];return y.length>0?y.sort().pop()??null:null}function A(y={}){return ct(e(y).reduce((E,_)=>E+_.importeCts,0))}function M(y={}){const E=new Map;for(const _ of e(y)){const P=_.fecha.slice(0,7);E.set(P,(E.get(P)??0)+_.importeCts)}return new Map([...E.entries()].sort(([_],[P])=>_.localeCompare(P)).map(([_,P])=>[_,ct(P)]))}function C(y={}){const E=new Map;for(const _ of e(y))for(const P of _.tags.length>0?_.tags:["sin_tag"])E.set(P,(E.get(P)??0)+_.importeCts);return new Map([...E.entries()].map(([_,P])=>[_,ct(P)]))}return{transacciones:e,registrar:o,actualizar:s,eliminar:n,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:p,eliminarPuntosControlEnRango:d,sincronizarHistoricoImportado:b,generarPuntosSemanales:u,generarPuntosSemanalesTodas:g,saldoCuenta:h,saldoCuentaCts:f,saldoTotal:S,tieneDatos:w,ultimaFecha:I,total:A,totalPorMes:M,totalPorTag:C}}function kt(t){return t.trim().toLowerCase()}function sd(t){function a(){const l=new Map,p=(d,u)=>{const v=kt(d);if(!v)return;const g=l.get(v)??{tag:v,estimaciones:0,reales:0,total:0};g[u]+=1,g.total+=1,l.set(v,g)};for(const d of t.get("expenses"))for(const u of d.tags??[])p(u,"estimaciones");for(const d of t.get("transacciones"))for(const u of d.tags??[])p(u,"reales");return[...l.values()].sort((d,u)=>u.total-d.total||d.tag.localeCompare(u.tag))}function e(){return a().map(l=>l.tag)}function o(l){return a().filter(p=>l==="estimaciones"?p.reales===0:p.estimaciones===0).map(p=>p.tag)}function s(l,p,d){const u=kt(p),v=(l??[]).map(kt);if(!v.includes(u))return l??[];const g=v.filter(b=>b!==u);return d===null?[...new Set(g)]:[...new Set([...g,kt(d)])]}function n(l,p){const d=kt(p);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(l,d)}function i(l,p){let d=0;for(const u of l)kt(u)!==kt(p)&&(d+=c(u,kt(p)).cambiados);return{cambiados:d}}function r(l){return c(l,null)}function c(l,p){let d=0;const u=t.get("expenses").map(M=>{const C=s(M.tags,l,p);return C!==M.tags&&(d+=1),C===M.tags?M:{...M,tags:C}});t.set("expenses",u);const v=t.get("transacciones").map(M=>{const C=s(M.tags,l,p);return C!==M.tags&&(d+=1),C===M.tags?M:{...M,tags:C}});t.set("transacciones",v);const g=t.get("loans").map(M=>{const C=s(M.tags,l,p);return C!==M.tags&&(d+=1),C===M.tags?M:{...M,tags:C}});t.set("loans",g);const b=t.get("nominas").map(M=>{const C=s(M.tags,l,p);return C!==M.tags&&(d+=1),C===M.tags?M:{...M,tags:C}});t.set("nominas",b);const $=t.get("config"),f=kt(l),h=M=>{const C=(M??[]).map(kt);if(!C.includes(f))return M??[];const y=C.filter(E=>E!==f);return p===null?[...new Set(y)]:[...new Set([...y,p])]},S={},w=h($.activeTagsFilter),I=h($.tagCategorias),A=h($.tagGrupos);return w!==$.activeTagsFilter&&(S.activeTagsFilter=w),I!==$.tagCategorias&&(S.tagCategorias=I),A!==$.tagGrupos&&(S.tagGrupos=A),Object.keys(S).length>0&&t.patchConfig(S),{cambiados:d}}return{uso:a,todas:e,soloEn:o,renombrar:n,fusionar:i,eliminar:r}}const nd=3;function un(t){return t<.005?0:t}function id(t){if(t.length<2)return null;const a=t.reduce((o,s)=>o+s,0)/t.length,e=t.reduce((o,s)=>o+(s-a)**2,0)/(t.length-1);return Math.sqrt(e)}function rd(t){const a=[],e=[],o=[];for(const i of t){if(i.meses.length<nd)continue;const r=id(i.meses.map(c=>c.desviacion));r!==null&&(a.push(r),e.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(a.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const s=Math.sqrt(a.reduce((i,r)=>i+r*r,0)),n=Math.sqrt(e.reduce((i,r)=>i+r*r,0));return{sigmaMensual:un(s),sigmaDeriva:un(n),estimaciones:a.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function pn(t,a,e=1,o=0){if(a<=0)return 0;const s=Math.max(0,t)*Math.sqrt(a),n=Math.max(0,o)*a;return s===0&&n===0?0:X(e*Math.hypot(s,n))}function cd(t,a,e={}){if(!a.fiable||t.length===0)return[];const{z:o=1}=e,s=e.desde??t[0].fecha,[n,i]=s.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,l]=r.fecha.slice(0,7).split("-").map(Number),p=Math.max(0,(c-n)*12+(l-i)),d=pn(a.sigmaMensual,p,o,a.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:X(r.saldoAcum+d),abajo:X(r.saldoAcum-d)}})}function ld(t,a=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const e=a>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${a} desviación${a!==1?"es":""} típica${a!==1?"s":""} (${e} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const lo="financeapp_session",dd=["local","dropbox","firebase"];function ud(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!dd.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function pd({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now(),graciaActiva:o=()=>!1}={}){const s=()=>t??(typeof localStorage<"u"?localStorage:null);function n(v){const g=s();if(g)try{v?g.setItem(lo,JSON.stringify(v)):g.removeItem(lo)}catch{}}function i(){const v=s();if(!v)return null;try{return ud(v.getItem(lo))}catch{return null}}function r(){const v=i();return v?(e()-v.ultimoUso)/6e4:null}function c(){const v=a();if(!Number.isFinite(v)||v<=0||o())return!1;const g=r();return g!==null&&g>=v}function l(){const v=i();return v?c()?(n(null),null):v:null}function p(v){const g=e(),b={modo:v.modo,...v.email?{email:v.email}:{},...v.passphrase?{passphrase:v.passphrase}:{},creadaEn:g,ultimoUso:g};return n(b),b}function d(){const v=i();v&&n({...v,ultimoUso:e()})}function u(){n(null)}return{abrir:p,leer:l,tocar:d,cerrar:u,caducada:c,inactividadMinutos:r,get activa(){return l()!==null}}}const mn=["pointerdown","keydown","visibilitychange"];function md({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:s=clearInterval,target:n=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const p of mn)n==null||n.addEventListener(p,r);const c=o(()=>{i&&t.caducada()&&(l(),t.cerrar(),a())},e);function l(){if(i){i=!1,s(c);for(const p of mn)n==null||n.removeEventListener(p,r)}}return l}const fd=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],gd="FinanceApp",vd=new TextEncoder().encode("financeapp-bio-passphrase-v1");function fn(t){return new Uint8Array(new ArrayBuffer(t))}const uo="financeapp_bio_credencial",po="financeapp_bio_secreto",mo="financeapp_bio_ultimo_desbloqueo",gn="financeapp_bio_gracia_min",bd=5;function hd(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function va(t){const a=t instanceof Uint8Array?t:new Uint8Array(t);let e="";for(const o of a)e+=String.fromCharCode(o);return btoa(e)}function ba(t){const a=atob(t),e=fn(a.length);for(let o=0;o<a.length;o++)e[o]=a.charCodeAt(o);return e}function yd(t){return va(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function $d(t){const a=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return ba(a)}function vn(t){return t.getClientExtensionResults()}function xd(t={}){const a=t.webauthn??hd(),e=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),s=t.ahora??(()=>Date.now()),n=t.randomBytes??(I=>crypto.getRandomValues(fn(I)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return a.disponiblePlataforma()}function c(){const I=o==null?void 0:o.getItem(uo);if(!I)return null;try{const A=JSON.parse(I);return typeof A.credencialId!="string"||typeof A.salt!="string"?null:A}catch{return null}}function l(){return c()!==null}async function p(I){const A=await e.importKey("raw",I,"HKDF",!1,["deriveKey"]);return e.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:vd},A,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d(I,A){const M=n(12),C=await e.encrypt({name:"AES-GCM",iv:M},I,new TextEncoder().encode(A));return`${va(M)}:${va(C)}`}async function u(I,A){const[M,C]=A.split(":"),y=ba(M),E=ba(C),_=await e.decrypt({name:"AES-GCM",iv:y},I,E);return new TextDecoder().decode(_)}async function v(I,A){var F,R;if(!I)throw new Error("No hay clave de cifrado que envolver.");const M=n(32),C=n(32),y=n(16),E=await a.create({publicKey:{challenge:C,rp:{name:gd},user:{id:y,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:M}}},timeout:6e4}});if(!E)throw new Error("No se ha podido crear la credencial biométrica.");const _=vn(E);if(!((F=_.prf)!=null&&F.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let P=((R=_.prf.results)==null?void 0:R.first)??null;if(P||(P=await g(E.rawId,M)),!P)throw new Error("El sensor no ha devuelto material de cifrado.");const x=await p(P),z=await d(x,I),T={credencialId:yd(E.rawId),salt:va(M),modo:A,creadaEn:s()},q=i();q.setItem(uo,JSON.stringify(T)),q.setItem(po,z)}async function g(I,A){var C,y;const M=await a.get({publicKey:{challenge:n(32),allowCredentials:[{id:I,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:A}}},timeout:6e4}});return M?((y=(C=vn(M).prf)==null?void 0:C.results)==null?void 0:y.first)??null:null}async function b(){const I=c();if(!I)throw new Error("No hay huella configurada en este dispositivo.");const A=o==null?void 0:o.getItem(po);if(!A)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const M=await g($d(I.credencialId).buffer,ba(I.salt));if(!M)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const C=await p(M),y=await u(C,A);return f(),y}function $(){o==null||o.removeItem(uo),o==null||o.removeItem(po),o==null||o.removeItem(mo)}function f(){o==null||o.setItem(mo,String(s()))}function h(){const I=o==null?void 0:o.getItem(gn);if(I==null)return bd;const A=Number(I);return Number.isFinite(A)&&A>0?A:0}function S(I){o==null||o.setItem(gn,String(Math.max(0,Math.floor(I)||0)))}function w(){if(!l())return!1;const I=h();if(I<=0)return!1;const A=o==null?void 0:o.getItem(mo),M=A?Number(A):NaN;return Number.isFinite(M)?s()-M<I*6e4:!1}return{disponible:r,registrada:l,leerCredencial:c,registrar:v,desbloquear:b,olvidar:$,marcarDesbloqueo:f,dentroDeGracia:w,graciaMinutos:h,configurarGracia:S}}function bn(){if(typeof localStorage<"u"){const M=vr();M.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${M.join(", ")}`)}const t=Er(),a=t.activo(),e=he(a),o=Is(localStorage,e),s=xr({adapter:o}),n=Ir(),{applied:i}=s.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${ee})`),s.subscribe(M=>n.marcar(M));function r(){var C,y,E,_,P;const M=globalThis;(y=(C=M.FirebaseService)==null?void 0:C.isConnected)!=null&&y.call(C)&&((P=(_=(E=M.FirebaseService).uploadRegistroProyectos)==null?void 0:_.call(E))==null||P.catch(x=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",x instanceof Error?x.message:x)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find(M=>M._id===a)??t.listar()[0],colecciones:ae.filter(M=>M!=="config"),crear:M=>{const C=t.crear(M);return r(),C},renombrar:(M,C)=>{t.renombrar(M,C),r()},duplicar:(M,C)=>{const y=t.duplicar(M,C);return r(),y},eliminar:M=>{t.eliminar(M),r()},cambiarA:M=>t.establecerActivo(M),fusionarRemotos:M=>t.fusionarRemotos(M),importarDesde:(M,C)=>{const y=Pr(localStorage,M,C),E=_r(y),_=[];for(const P of C){const x=E[P];if(!Array.isArray(x)||x.length===0)continue;const z=s.get(P);s.set(P,[...z,...x]),_.push(P)}return _.length>0&&n.marcar("importado-de-otro-proyecto"),{importadas:_}}},l=Dr(s),p=xd(),d=pd({autoLogoutMinutos:()=>{var C,y;const M=(y=(C=globalThis.State)==null?void 0:C.get)==null?void 0:y.call(C,"config");return Number((M==null?void 0:M.autoLogoutMinutos)??s.get("config").autoLogoutMinutos??0)},graciaActiva:()=>p.dentroDeGracia()}),u=od(s),v=sd(s),g=Fi(u),b=Di(s),$=sc({isEnabled:M=>l.isEnabled(M)}),f=Jr({flags:l,rutasExtra:()=>$.flagPorRuta()}),h=qr({flags:l,onChange:()=>{var M,C;$.attachToShell(),f.apply(),(C=(M=globalThis.Router)==null?void 0:M.rerender)==null||C.call(M)}}),S=Gr({proyectos:c}),w=()=>{var C,y,E,_,P,x;const M=globalThis;if((y=(C=M.State)==null?void 0:C.load)==null||y.call(C),((_=(E=M.Router)==null?void 0:E.current)==null?void 0:_.call(E))==="dashboard")try{(x=(P=M.DashboardModule)==null?void 0:P.render)==null||x.call(P)}catch(z){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",z)}};function I(){const C=globalThis.FinanceMath;if(!C){console.error("[informe] FinanceMath no está cargado");return}const y=st(),E=s.get("config"),_=s.get("accounts").filter(N=>N.activo),P=s.get("expenses"),x=s.get("loans"),z=s.get("nominas"),T=(N,L,G=y)=>C.generarExtracto(x,P,s.get("accounts"),{...E,dashboardStart:N,dashboardEnd:L,fechaReferencia:G},null,z,s.get("inflacion")),q={generarExtracto:T,gastos:P,prestamos:x,movimientos:s.get("transacciones"),hoy:y};let F=null,R=0;try{const N=es(q,T(`${y.slice(0,7)}-01`,qt(y.slice(0,7))));F=N.estimacion,R=N.desglose.imprevistos.total}catch(N){console.error("[informe] Sin estimación de imprevistos:",N)}const j=c.activo().nombre;Mi({hoy:y,proyecto:j,construir:(N,L)=>Wi(Li({desde:N,hasta:L,hoy:y,proyecto:j,cuentas:_,gastos:P,ledger:u,generarExtracto:T,saldoSinLibro:(G,B)=>C.saldoEnFecha(G,B),opcionesCierre:{hoy:y,nominas:z,loans:x,resolverTramosIRPF:s.resolverTramosIRPF(),omitidos:E.cierreOmitidos??[]},imprevistos:F,imprevistosMesEnCurso:R,cuadroDeMando:(()=>{try{const G=T(N,L,y);if(G.length===0)return null;const B=G.filter(Z=>Z.fecha<=y),V=Z=>{var W;return Number(((W=Z[Z.length-1])==null?void 0:W.saldoAcum)??NaN)},Y=V(G),K=B.length?V(B):Y;return Number.isFinite(Y)&&Number.isFinite(K)?{saldoHoy:K,saldoFinal:Y}:null}catch{return null}})()}))})}const A=Kr({store:s,onDatosCambiados:w});return $.register(gc({store:s,onDatosCambiados:w})),$.register(Sc({store:s,onDatosCambiados:w})),$.register(Qc({store:s,onDatosCambiados:w})),$.register(ad({store:s,ledger:u,tags:v,precision:g,adjuster:b,onDatosCambiados:w})),$.register(ic({store:s,onDatosCambiados:w})),{version:ee,core:En,engine:{generarExtracto:Ro,recomputarSaldoAcum:Fn,saldoHoy:Dn,sumarPorTags:ko,providers:{proyectarGastos:Fe,proyectarPrestamos:Pa,proyectarTransferencias:_o,proyectarNominas:_a,proyectarInteresesCuentas:Do,proyectarAportaciones:Fo,proyectarRetencionesFiscales:To,proyectarInflacionGastos:zo,proyectarPerdidaAhorro:jo},analysis:qn,margins:Bn,avisos:Yn,dashboard:ri,mes:fi},store:s,flags:l,featureRegistry:{all:Zt,porGrupo:Ps},ui:{tarjetaMes:yi,abrirHistoricoMeses:Ci,abrirCrearInforme:()=>I(),openFeatures:h.open,openProyectos:S.open,openPersonas:A.open,applyGating:f.apply,watchGating:()=>f.observar(),instalarDeshacer:()=>Xr({store:s,rerender:()=>{var C,y,E,_;const M=globalThis;(y=(C=M.State)==null?void 0:C.load)==null||y.call(C),(_=(E=M.Router)==null?void 0:E.rerender)==null||_.call(E)}}),avisoGuardado:null,instalarBuscador:()=>ac({estado:()=>({accounts:s.get("accounts"),expenses:s.get("expenses"),loans:s.get("loans"),nominas:s.get("nominas"),transacciones:s.get("transacciones")}),rutasDisponibles:()=>$.routes(),navegar:M=>{var C,y;return(y=(C=globalThis.Router)==null?void 0:C.navigate)==null?void 0:y.call(C,M)}})},app:$,session:Object.assign(d,{vigilar:M=>md({sesion:d,onCaducada:M}),opciones:fd}),biometria:p,cambios:n,datos:{colecciones:ae,snapshot:()=>({...ws(o),[Cs]:ee}),aplicar:(M,{sellar:C=!0}={})=>{const y=C?(_,P)=>o.set(_,P):(_,P)=>{const x=globalThis.StorageAdapter;x!=null&&x.setRestaurando?x.setRestaurando(_,P):o.set(_,P)},E=wr(y,M);for(const _ of ys)M[_]!==void 0&&M[_]!==null&&y(`${zt}${_}`,M[_]);return E.length>0&&y(ke,Mr(M,ee)),s.load(),n.marcar("copia-restaurada"),E},faltantes:M=>Cr(M),esVacioOPorDefecto:()=>Sr(ws(o)),recargar:()=>{s.load(),n.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:u,tags:v,precision:g,adjuster:b,sugerirAjuste:Ra,medirVariabilidad:rd,bandaDeConfianza:cd,bandaAcumulada:pn,describirBanda:ld}}}function Id(){try{const t=bn();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const yt=typeof window<"u"?Id():null;if(yt){let t=!1;const a=()=>{var s,n,i;if(yt.app.attachToShell(),yt.ui.applyGating(),!t){t=!0,yt.ui.watchGating(),yt.ui.instalarDeshacer(),yt.ui.instalarBuscador();const r=globalThis,c=()=>{var u,v,g,b;return(v=(u=r.FirebaseService)==null?void 0:u.isConnected)!=null&&v.call(u)?r.FirebaseService:(b=(g=r.DropboxService)==null?void 0:g.isConnected)!=null&&b.call(g)?r.DropboxService:null};yt.ui.avisoGuardado=oc({cambios:yt.cambios,hayDestino:()=>c()!==null,guardar:async()=>{const u=c();if(!(u!=null&&u.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");const v=globalThis.AuthModule;v!=null&&v.guardarEnNube?await v.guardarEnNube():await u.uploadBackup()}});const l=document.getElementById("sidebar-proyecto-activo"),p=document.getElementById("sidebar-proyecto-activo-nombre");l&&p&&(p.textContent=yt.proyectos.activo().nombre,l.classList.remove("hidden"),l.addEventListener("click",()=>yt.ui.openProyectos())),(s=document.getElementById("btn-proyectos"))==null||s.addEventListener("click",()=>yt.ui.openProyectos());const d=yt.store.get("config").archivoMigracion011;if(d&&!d.avisado&&d.desactivados+d.amortizaciones.length>0){const u=d.desactivados+d.amortizaciones.length,v=globalThis.UI;setTimeout(()=>{var g;return(g=v==null?void 0:v.toast)==null?void 0:g.call(v,`Se han desactivado ${u} elemento${u===1?"":"s"} que venía${u===1?"":"n"} de un supuesto. Búscalos con la etiqueta «supuesto-archivado».`,"warn")},1500),yt.store.patchConfig({archivoMigracion011:{...d,avisado:!0}})}(n=document.getElementById("btn-personas"))==null||n.addEventListener("click",()=>yt.ui.openPersonas()),(i=document.getElementById("btn-informe"))==null||i.addEventListener("click",()=>yt.ui.abrirCrearInforme())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",s=>{const n=s.target;n!=null&&n.closest(".nav-btn[data-view]")&&setTimeout(a,0)}),window.addEventListener(xs,()=>{if(document.getElementById("aviso-sin-espacio"))return;const s=document.querySelector(".view-container");if(!(s!=null&&s.parentElement))return;const n=document.createElement("div");n.id="aviso-sin-espacio",n.setAttribute("role","alert"),n.className="card",n.style.cssText="border:1px solid var(--red);background:rgba(255,77,109,0.09);padding:10px 16px;margin:10px 20px 0;font-size:13px;display:flex;gap:12px;align-items:center;flex-wrap:wrap";const i=document.createElement("span");i.style.flex="1",i.textContent="No se ha podido guardar: el almacenamiento de este navegador está lleno o bloqueado. Los últimos cambios pueden perderse al recargar. Exporta una copia ahora.";const r=document.createElement("button");r.className="btn-primary btn-sm",r.textContent="Exportar copia",r.addEventListener("click",()=>{var c,l;return(l=(c=globalThis.DataIO)==null?void 0:c.exportJSON)==null?void 0:l.call(c)}),n.append(i,r),s.parentElement.insertBefore(n,s)});let e=null;const o=`${he(yt.proyectos.activo()._id)}${zt}`;window.addEventListener("storage",s=>{!s.key||!s.key.startsWith(o)||s.key.endsWith("_modificadoEn")||s.key.endsWith("_schemaVersion")||(e&&clearTimeout(e),e=setTimeout(()=>{var i,r,c;e=null,yt.store.load(),((i=document.getElementById("modal-overlay"))==null?void 0:i.classList.contains("hidden"))===!1||(c=(r=globalThis.Router)==null?void 0:r.rerender)==null||c.call(r)},150))})}return $a.bootstrap=bn,Object.defineProperty($a,Symbol.toStringTag,{value:"Module"}),$a}({});
//# sourceMappingURL=financeapp-core.js.map

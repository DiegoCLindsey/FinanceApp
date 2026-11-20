var FinanceAppBundle=function(ya){"use strict";function tt(t){const a=t.getFullYear(),e=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${a}-${e}-${o}`}function V(t){const[a,e,o]=t.split("-").map(Number);return new Date(a,e-1,o)}function et(){return tt(new Date)}function $a(t,a){return new Date(t,a+1,0).getDate()}function go(t,a,e){return tt(new Date(t,a,Math.min(e,$a(t,a))))}function We(t,a,e){if(!e)return null;if(e.startsWith("dia:")){const o=e.slice(4);if(o==="ultimo")return tt(new Date(t,a+1,0));const s=parseInt(o);if(!isNaN(s))return go(t,a,s)}if(e.startsWith("nthweekday:")){const o=e.split(":"),s=parseInt(o[1]),n=parseInt(o[2]);if(s===-1){const r=new Date(t,a+1,0);for(;r.getDay()!==n;)r.setDate(r.getDate()-1);return tt(r)}const i=new Date(t,a,1);for(;i.getDay()!==n;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(s-1)*7),i.getMonth()!==a&&i.setDate(i.getDate()-7),tt(i)}return null}function vo(t,a){if(!a)return t;const e=V(t);return We(e.getFullYear(),e.getMonth(),a)??t}const hn=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],yn={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function xa(t){if(!t)return"";if(t.startsWith("dia:")){const a=t.slice(4);return a==="ultimo"?"Último día del mes":`Día ${a} del mes`}if(t.startsWith("nthweekday:")){const a=t.split(":"),e=a[1],o=parseInt(a[2]);return`${yn[e]||e+"º"} ${hn[o]} del mes`}return t}function Ae(t,a){const e=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate());return Math.round((o-e)/864e5)}function Ee(t){const a=V(t),e=a.getDay()===0?0:7-a.getDay();return a.setDate(a.getDate()+e),tt(a)}function ce(t,a){const e=V(t);return e.setDate(e.getDate()+a),tt(e)}function le(t,a,e){const o=Math.max(1,e),s=t.getFullYear(),n=t.getMonth(),i=(a.getFullYear()-s)*12+(a.getMonth()-n);if(i<=0)return{year:s,month:n};const r=n+Math.floor(i/o)*o;return{year:s+Math.floor(r/12),month:r%12}}function Ke(t,a,e,o){return!(t&&t>o||a&&a<e)}function bo(t,a){const e=Math.max(1,Math.round(a??1));return t==="extraordinario"?"una vez":t==="diaria"?e===1?"cada día":e===7?"cada semana":e===14?"cada 2 semanas":`cada ${e} días`:e===1?"cada mes":e===3?"cada trimestre":e===6?"cada semestre":e===12?"cada año":`cada ${e} meses`}function Pt(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function it(t){return t/100}function K(t){return it(Pt(t))}function T(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function ho(t){return(t||0).toFixed(2)+"%"}function te(t,a,e){const o=a/100/12;return o===0?t/e:t*o*Math.pow(1+o,e)/(Math.pow(1+o,e)-1)}function yo(t,a,e,o=0){const s=te(t,a,e),n=t*(1-o/100);let i=a/100/12;for(let r=0;r<200;r++){const l=s*(1-Math.pow(1+i,-e))/i-n,p=s*(e*Math.pow(1+i,-(e+1))/i-(1-Math.pow(1+i,-e))/(i*i)),d=i-l/p;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function $o(t,a,e,o,s=0,n=[],i={}){const r=[];let c=t;const l=V(o),p=a/100/12;let d=e,u=te(c,a,d);const v=[...n].sort((h,x)=>h.fecha.localeCompare(x.fecha));let g=0;for(let h=1;h<=e*2&&c>.01;h++){const x=new Date(l);l.setMonth(l.getMonth()+1);const f=vo(tt(x),i.diaPago||"");for(;g<v.length&&v[g].fecha<=f;){const w=v[g],I=w.cantidad*(s/100);if(c-=w.cantidad,c=Math.max(0,c),w.tipo==="plazo"?d=Math.ceil(-Math.log(1-c*p/u)/Math.log(1+p)):(d=e-h+1,u=te(c,a,d)),r.push({mes:"AMORT",fecha:w.fecha,cuota:0,interes:0,amortizacion:w.cantidad,comisionAmort:I,capitalPendiente:c,esAmortizacion:!0,simulacion:w.simulacion||!1}),g++,c<.01)break}if(c<.01)break;const y=c*p,S=Math.min(u-y,c);if(c-=S,c<.01&&(c=0),r.push({mes:h,fecha:f,cuota:u,interes:y,amortizacion:S,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),d--,d<=0||c<.01)break}return r}const xo=new Map;function bt(t){var x;const a=t.amortizaciones||[],e=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${a.slice().sort((f,y)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${y.fecha}|${y.cantidad}|${y.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=xo.get(e);if(o)return o;const{capital:s,tin:n,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:l}=t,p=$o(s,n,i,r,c||0,a,t),d=p.reduce((f,y)=>f+y.interes,0),u=p.reduce((f,y)=>f+y.comisionAmort,0),v=s*((l||0)/100),g=p.filter(f=>!f.esAmortizacion),h={cuota:te(s,n,i),totalIntereses:d,tae:yo(s,n,i,l||0),costoTotal:d+u+v,comAp:v,totalComAm:u,fechaFin:((x=g.slice(-1)[0])==null?void 0:x.fecha)||"",mesesReales:g.length,tabla:p};return xo.set(e,h),h}function Io(t){const a=bt(t),e=bt({...t,amortizaciones:[]}),o=e.totalIntereses-a.totalIntereses,s=e.mesesReales-a.mesesReales,n=a.totalComAm;return{...a,sinAmort:e,ahorroIntereses:o,ahorroTiempo:s,costeTotalAmort:n,ahorroNeto:o-n,totalPagado:t.capital+a.totalIntereses+a.comAp+a.totalComAm}}function Gt(t,a,e){if(!t||t.length===0)return 1;const o=V(a),s=V(e);if(s<=o)return 1;const n=[...t].sort((c,l)=>c.year-l.year);let i=1,r=new Date(o);for(;r<s;){const c=r.getFullYear(),l=n.filter(h=>h.year<=c),p=l.length>0?l[l.length-1]:n[0],d=(p?p.tasa:0)/100,u=new Date(c+1,0,1),v=u<s?u:s,g=Ae(r,v);i*=Math.pow(1+d,g/365.25),r=v}return i}function wo(t,a,e,o=0){const s=V(a),n=V(e);if(n<=s)return o;const i=Ae(s,n),r=t?[...t].sort((p,d)=>p.year-d.year):[];let c=0,l=new Date(s);for(;l<n;){const p=l.getFullYear(),d=new Date(p+1,0,1),u=d<n?d:n,v=Ae(l,u),g=r.filter(f=>f.year<=p),h=g.length>0?g[g.length-1]:null,x=h!==null?h.tasa:o;c+=x*v,l=u}return i>0?c/i:o}function Co(t,a){return((1+t/100)/(1+a/100)-1)*100}function $n(t,a,e,o){const s=Gt(a,e,o);return s>0?t/s:t}function xn(t,a){const e=a.saludUmbralAhorroVerde??20,o=a.saludUmbralAhorroAmarillo??10,s=a.saludUmbralDTIVerde??30,n=a.saludUmbralDTIAmarillo??40,i=a.saludRegla||[50,30,20],r=a.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:l=0,cuotasHipoteca:p=0,gastosBasicos:d=0,gastosOtros:u=0,amortizaciones:v=0}=t,g=c-l-v-d-u,h=g,x=c>0?h/c*100:null,f=r?l-p:l,y=c>0?f/c*100:null,S=c>0?l/c*100:null,w=c>0?(d+l+v)/c*100:null,I=c>0?u/c*100:null,E=(C,$,P)=>C===null?"neutral":C>=$?"verde":C>=P?"amarillo":"rojo",A=(C,$,P)=>C===null?"neutral":C<=$?"verde":C<=P?"amarillo":"rojo";return{ingresos:c,cuotas:l,cuotasHipoteca:p,gastosBasicos:d,gastosOtros:u,amortizaciones:v,ahorroBruto:g,ahorroReal:h,tasaAhorro:x,dti:y,dtiTotal:S,excluyeHipoteca:r,pctNecesidades:w,pctDeseos:I,semAhorro:E(x,e,o),semDTI:A(y,s,n),semNecesidades:A(w,i[0],i[0]+15),semDeseos:A(I,i[1],i[1]+10),semAhorroRegla:E(x,i[2],i[2]*.5),umbralAhorroVerde:e,umbralAhorroAmarillo:o,umbralDTIVerde:s,umbralDTIAmarillo:n,regla:i}}function _t(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function Vt(t){const a=[...t.historicoSaldos||[]].sort((e,o)=>o.fecha.localeCompare(e.fecha));return a.length>0?a[0].saldo:t.saldoInicial||0}function Pe(t,a){const e=Ia(t,a);return e?e.saldo:a>=(t.fechaInicialSaldo||"")&&t.saldoInicial||0}function Ia(t,a){const e=t.fechaInicialSaldo||"";if(!e||a>=e){const o=[];return e&&o.push({fecha:e,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,n)=>{s.fecha>=e&&o.push({...s,prioridad:n})}),o.sort((s,n)=>n.fecha.localeCompare(s.fecha)||n.prioridad-s.prioridad),o.find(s=>s.fecha<=a)??null}else return[...t.historicoSaldos||[]].sort((s,n)=>n.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=a)??null}function So(t,a){let e="";for(const o of t){const s=Ia(o,a);s&&s.fecha>e&&(e=s.fecha)}return e}function In(t){const a=e=>!e.simulacion;return{loans:t.loans.filter(a).map(e=>({...e,amortizaciones:(e.amortizaciones||[]).filter(a)})),expenses:t.expenses.filter(a),nominas:t.nominas.filter(a),accounts:t.accounts.filter(a)}}function wn(t){const a=e=>!!e.simulacion;return t.loans.some(e=>a(e)||(e.amortizaciones||[]).some(a))||t.expenses.some(a)||t.nominas.some(a)||t.accounts.some(a)}function Je(t){var a,e;return((a=t.find(o=>o.esPorDefecto))==null?void 0:a._id)??((e=t[0])==null?void 0:e._id)??"default"}function Cn(t,a){if(a<=0)return[];const e=t<0?-1:1,o=Math.abs(t),s=Math.floor(o/a),n=o-s*a;return Array.from({length:a},(i,r)=>e*(s+(r<n?1:0)))}function Sn(t,a,e,o){if(e===0)return{ids:t,cts:a};const s=t.indexOf(o);if(s>=0){const n=[...a];return n[s]+=e,{ids:t,cts:n}}return{ids:[...t,o],cts:[...a,e]}}function de(t,a,e){const o=Pt(t);if(!a||a.participantes.length===0)return[{personaId:e,importe:it(o)}];const s=a.participantes.map(d=>d.personaId);if(a.modo==="partesIguales"){const d=Cn(o,s.length);return s.map((u,v)=>({personaId:u,importe:it(d[v])}))}const n=a.participantes.map(d=>{const u=Math.max(0,d.valor??0);return a.modo==="porcentaje"?Math.round(o*u/100):Pt(u)}),i=n.reduce((d,u)=>d+u,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const d=o/i,u=n.map(g=>Math.round(g*d)),v=u.reduce((g,h)=>g+h,0);return u.length>0&&(u[0]+=o-v),s.map((g,h)=>({personaId:g,importe:it(u[h])}))}const c=o-i,{ids:l,cts:p}=Sn(s,n,c,e);return l.map((d,u)=>({personaId:d,importe:it(p[u])}))}function wa(t,a){return t.find(e=>e._id===a||a.startsWith(`${e._id}_`))}function Mn(t,a,e){const o=Je(e),s=new Map,n=i=>{let r=s.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},s.set(i,r)),r};for(const i of e)n(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=wa(a.expenses,i.sourceId);for(const l of de(r,c==null?void 0:c.repartoPago,o))n(l.personaId).pago+=l.importe;for(const l of de(r,c==null?void 0:c.repartoConsumo,o))n(l.personaId).consumo+=l.importe}else if(i.sourceType==="loan"){const c=wa(a.loans,i.sourceId);for(const l of de(r,c==null?void 0:c.repartoPago,o))n(l.personaId).pago+=l.importe;for(const l of de(r,c==null?void 0:c.repartoConsumo,o))n(l.personaId).consumo+=l.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=wa(a.nominas,i.sourceId);for(const l of de(r,c==null?void 0:c.repartoConsumo,o))n(l.personaId).ingresos+=l.importe}}}return[...s.values()]}function Ca(t,a,e){const o=s=>!s||s.participantes.length===0?[e]:s.participantes.map(n=>n.personaId);return new Set([...o(t),...o(a)])}const Ut=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function zt(t,a){const e=[...a].sort((n,i)=>n[0]-i[0]);let o=0,s=t;for(let n=e.length-1;n>=0;n--){const[i,r]=e[n];s<=i||(o+=(s-i)*(r/100),s=i)}return o}function Mo(t,a){const e=Math.max(0,t-(a||0)),o=t*.0635,s=Math.min(2e3,e),n=Math.max(0,e-o-s),i=n<=15876?7302:n<=21622?Math.max(0,7302-1.75*(n-15876)):0;return{baseIRPF:e,cotizSS:o,gastosArt19:s,RNT:n,reducArt20:i,baseImponible:Math.max(0,n-i)}}function Yt(t,a){return Mo(t,a).baseImponible}function Ao(t,a){return zt(t,a)/12}const _e=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Sa(t,a){if(!t||t<=0)return 0;const e=a||_e;let o=0,s=t;for(let n=0;n<e.length;n++){const[i,r]=e[n],c=n<e.length-1?e[n+1][0]:1/0,l=Math.min(s,c-i);if(!(l<=0)&&(o+=l*(r/100),s-=l,s<=0))break}return o}function Qe(t,a){if(_t(t)!=="inversion")return null;const e=Vt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,s=Math.max(0,e-o),n=Sa(s,a);return{saldo:e,costBase:o,plusvalia:s,impuesto:n,neto:e-n}}function Ma(t,a=new Date){var u;if(_t(t)!=="pension")return null;const e=t.bloqueoMeses||120,o=Vt(t),s=tt(new Date(a.getFullYear(),a.getMonth()-e,a.getDate())),n=[...t.aportaciones||[]].sort((v,g)=>v.fecha.localeCompare(g.fecha));let i=0;const r=n.reduce((v,g)=>v+g.cantidad,0);for(const v of n)v.fecha<=s&&(i+=v.cantidad);const c=Math.max(0,o-r),l=r>0?i/r:0,p=Math.min(o,i+c*l),d=Math.max(0,o-p);return{saldo:o,disponible:p,bloqueado:d,costBase:r,beneficio:c,numAportaciones:n.length,proxDesbloqueo:((u=n.find(v=>v.fecha>s))==null?void 0:u.fecha)||null}}function Eo(t,a,e){const o=e!==void 0?e:t.impuestoRetirada;if(_t(t)!=="pension"||!o)return 0;const s=Vt(t);if(s<=0)return 0;const n=(t.aportaciones||[]).reduce((l,p)=>l+p.cantidad,0),i=Math.max(0,s-n);if(i<=0)return 0;const r=i/s;return+(a*r*o/100).toFixed(2)}function Aa(t,a,e){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const n=(a||[]).filter(l=>(l.grupoNomina||"")===o&&l.activo!==!1).reduce((l,p)=>l+(p.bruto||0)*(p.nPagas||12),0),i=[...e||[]].sort((l,p)=>l[0]-p[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[l,p]of i)if(n>=l)r=p;else break;return r}const An=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:_e,TRAMOS_IRPF_DEFAULT:Ut,agregarPorPersona:Mn,ajustarFechaPago:vo,ajustarPrecioReal:$n,arranqueMensual:le,calcBaseImponibleTrabajo:Yt,calcFactorInflacion:Gt,calcFondoInversion:Qe,calcFondosPension:Ma,calcGananciasCapital:Sa,calcIRPF:zt,calcImpuestoPension:Eo,calcInflacionMediaAnual:wo,calcSaludFinanciera:xn,calcTAE:yo,calcTipoMarginalPension:Aa,calcTipoRealFisher:Co,calcularReparto:de,clampedDate:go,cuotaMensual:te,desgloseBaseTrabajo:Mo,diasEntre:Ae,entradaSaldo:Ia,etiquetaPeriodicidad:bo,fechaUltimoSaldoConocido:So,finDeSemana:Ee,formatEUR:T,formatLocalDate:tt,formatPct:ho,fromCents:it,haySimulaciones:wn,idPersonaPorDefecto:Je,labelDiaPago:xa,lastDayOfMonth:$a,modeloFondoDe:_t,parseLocalDate:V,personasImplicadas:Ca,resolverDiaEfectivo:We,resumenPrestamo:bt,resumenPrestamoConAhorro:Io,retencionMensual:Ao,roundMoney:K,saldoEnFecha:Pe,saldoRealCuenta:Vt,sinSimulaciones:In,sumarDias:ce,tablaAmortizacion:$o,toCents:Pt,todayISO:et,vigenteEnRango:Ke},Symbol.toStringTag,{value:"Module"}));function Fe(t,a,e=null){const o=[],s=V(a.start),n=V(a.end);for(const i of t){if(!i.activo||e&&e.length>0&&!e.includes(i.cuenta||"default"))continue;const r=V(i.fechaInicio||a.start),c=i.fechaFin?V(i.fechaFin):n,l=i.cuantia,p=d=>o.push({fecha:d,concepto:i.concepto,cuantia:l,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=s&&r<=n&&r<=c&&p(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let{year:u,month:v}=le(r,s,d);const g=Math.ceil(240/d)+2;for(let h=0;h<g;h++){const x=We(u,v,i.diaPago||"")||(()=>{const y=r.getDate(),S=new Date(u,v+1,0).getDate();return tt(new Date(u,v,Math.min(y,S)))})(),f=V(x);if(f>n||f>c)break;f>=s&&f>=r&&p(x),v+=d,v>=12&&(u+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let u=new Date(Math.max(r.getTime(),s.getTime()));if(r<s){const v=Math.ceil((s.getTime()-r.getTime())/d);u=new Date(r.getTime()+v*d)}for(;u<=n&&u<=c;)p(tt(u)),u=new Date(u.getTime()+d)}}return o}function Ea(t,a,e=null){const o=[];for(const s of t){if(!s.activo||e&&e.length>0&&!e.includes(s.cuenta||"default"))continue;const{tabla:n}=bt(s);for(const i of n)i.fecha>=a.start&&i.fecha<=a.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${s.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${s.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan",simulacion:s.simulacion||!1}))}return o}function Po(t,a,e=null,o={accounts:[]}){const s=[],n=V(a.start),i=V(a.end),r=o.accounts||[],c=o.nominas||[],l=o.resolverTramosIRPF||(()=>Ut),p=o.resolverTramosGanancias||(()=>_e),d=u=>{var v;return((v=r.find(g=>g._id===u))==null?void 0:v.nombre)??u};for(const u of t){if(!u.activo||u.tipo!=="transferencia"||e&&e.length>0&&!(e.includes(u.cuenta||"default")||e.includes(u.cuentaDestino||"default")))continue;const v=V(u.fechaInicio||a.start),g=u.fechaFin?V(u.fechaFin):i,h=x=>{const f=r.find(F=>F._id===(u.cuenta||"default")),y=r.find(F=>F._id===(u.cuentaDestino||"default")),S=_t(f),w=_t(y),I=S==="inversion"&&w==="inversion"||S==="pension"&&w==="pension",E=["transferencia",...I?["traspaso"]:[],...u.tags||[]],A=I?"traspaso-out":"transfer-out",C=I?"traspaso-in":"transfer-in",$=!e||e.length===0||e.includes(u.cuenta||"default"),P=!e||e.length===0||e.includes(u.cuentaDestino||"default");if($&&s.push({fecha:x,concepto:`Transf. → ${d(u.cuentaDestino||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"gasto",tags:E,cuenta:u.cuenta||"default",sourceId:u._id,sourceType:A}),P&&s.push({fecha:x,concepto:`Transf. ← ${d(u.cuenta||"default")}: ${u.concepto}`,cuantia:u.cuantia,tipo:"ingreso",tags:E,cuenta:u.cuentaDestino||"default",sourceId:u._id,sourceType:C}),$&&!I&&f){if(S==="inversion"){const F=parseInt(x.slice(0,4)),M=Qe(f,p(F));if(M&&M.saldo>0&&M.plusvalia>0){const b=Math.min(1,u.cuantia/M.saldo),_=M.plusvalia*b*.19;_>.01&&s.push({fecha:x,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:_,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"investment-tax"})}}else if(S==="pension"){const F=l(parseInt(x.slice(0,4))),M=Aa(f,c,F),b=Eo(f,u.cuantia,M||void 0);if(b>0){const D=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${M}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;s.push({fecha:x,concepto:D,cuantia:b,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:u.cuenta||"default",sourceId:u._id,sourceType:"pension-tax"})}}}};if(u.tipoFrecuencia==="extraordinario")v>=n&&v<=i&&v<=g&&h(u.fechaInicio);else if(u.tipoFrecuencia==="mensual"){const x=Math.max(1,u.frecuencia||1);let{year:f,month:y}=le(v,n,x);const S=Math.ceil(240/x)+2;for(let w=0;w<S;w++){const I=We(f,y,u.diaPago||"")||(()=>{const A=v.getDate(),C=new Date(f,y+1,0).getDate();return tt(new Date(f,y,Math.min(A,C)))})(),E=V(I);if(E>i||E>g)break;E>=n&&E>=v&&h(I),y+=x,y>=12&&(f+=Math.floor(y/12),y=y%12)}}else if(u.tipoFrecuencia==="diaria"){const x=Math.max(1,u.frecuencia||1)*864e5;let f=new Date(Math.max(v.getTime(),n.getTime()));if(v<n){const y=Math.ceil((n.getTime()-v.getTime())/x);f=new Date(v.getTime()+y*x)}for(;f<=i&&f<=g;)h(tt(f)),f=new Date(f.getTime()+x)}}return s}function _o(t,a,e=null){const o=[],s=V(a.start),n=V(a.end);for(const i of t){const r=_t(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const l of c){if(!l.importe||l.importe<=0)continue;const p=V(l.fechaInicio||a.start),d=l.fechaFin?V(l.fechaFin):n,u=l.cuentaOrigen||"default",v=!e||!e.length||e.includes(u),g=!e||!e.length||e.includes(i._id),h=r==="pension"?"pension":"capital-mobiliario",x=I=>{v&&o.push({fecha:I,concepto:`Aportación → ${i.nombre}`,cuantia:l.importe,tipo:"gasto",tags:["aportacion","transferencia",h],cuenta:u,sourceId:l._id,sourceType:"aportacion-out"}),g&&o.push({fecha:I,concepto:`Aportación ${i.nombre} (${l.periodicidad||"mensual"})`,cuantia:l.importe,tipo:"ingreso",tags:["aportacion","transferencia",h],cuenta:i._id,sourceId:l._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[l.periodicidad||"mensual"]||1;let{year:y,month:S}=le(p,s,f);const w=Math.ceil(240/f)+2;for(let I=0;I<w;I++){const E=new Date(y,S+1,0).getDate(),A=tt(new Date(y,S,Math.min(p.getDate(),E))),C=V(A);if(C>n||C>d)break;C>=s&&C>=p&&x(A),S+=f,S>=12&&(y+=Math.floor(S/12),S=S%12)}}}return o}function Fo(t,a,e=null,o=[]){const s=[];for(const n of t){if(!n.activo||!n.interes||n.interes<=0||e&&e.length>0&&!e.includes(n._id))continue;const i=V(a.start),r=V(a.end),c=n.periodoCobro||"mensual",l=c==="mensual",p=l?null:{diario:864e5,semanal:7*864e5}[c]||864e5,d=l?1/12:p/(365.25*864e5);let u=Pe(n,a.start);const v=o.filter(x=>x.cuenta===n._id).map(x=>({fecha:x.fecha,delta:x.tipo==="ingreso"?Math.abs(x.cuantia):-Math.abs(x.cuantia)})).sort((x,f)=>x.fecha.localeCompare(f.fecha));let g=0,h=new Date(i);for(;h<=r;){const x=l?new Date(h.getFullYear(),h.getMonth()+1,h.getDate()):new Date(h.getTime()+p),f=new Date(Math.min(x.getTime(),r.getTime()+1)),y=tt(f);let S=0;for(;g<v.length&&v[g].fecha<y;)S+=v[g].delta,g++;const w=u,I=u+S,E=Math.max(0,(w+I)/2);u=I;const A=l?d:(f.getTime()-h.getTime())/(365.25*864e5),C=E*(Math.pow(1+n.interes/100,A)-1);C>.001&&s.push({fecha:tt(h),concepto:`Interés ${n.nombre}`,cuantia:C,tipo:"ingreso",tags:["interes","cuenta"],cuenta:n._id,sourceId:n._id,sourceType:"account-interest"}),h=x}}return s}function Do(t,a,e,o=null){const s=[],n=a||Ut;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=Ao(r,n),l={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};s.push(...Fe([l],e,o))}return s}const En=[5,11,2,8],Pn={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function Pa(t,a,e=null,o=[],s=()=>Ut){const n=[],i=V(a.start),r=V(a.end),c=o.length>0,l={};for(const u of t){const v=u.grupoNomina||"";l[v]||(l[v]=[]),l[v].push(u)}for(const u of Object.keys(l))l[u].sort((v,g)=>(g.bruto||0)-(v.bruto||0));function p(u,v){if(!c||!u.mesActualizacionIPC)return u.bruto||0;const g=u.fechaInicio||a.start,h=V(g),x=V(v);let f=0;for(let S=h.getFullYear();S<=x.getFullYear();S++){const w=new Date(S,u.mesActualizacionIPC-1,1);w>h&&w<=x&&f++}if(f===0)return u.bruto||0;const y=tt(new Date(h.getFullYear()+f,0,1));return(u.bruto||0)*Gt(o,g,y)}function d(u,v){const g=p(u,v),h=(u.retribucionFlexible||[]).reduce((F,M)=>F+(M.importe||0)*12,0),x=Math.max(0,g-h);if(u.irpfModo==="manual")return x*((u.irpfPct||0)/100);const f=s(parseInt(v.slice(0,4))),y=u.grupoNomina||"";if(!y)return zt(Yt(g,h),f);const S=l[y].filter(F=>F.activo),w=S.reduce((F,M)=>F+p(M,v),0),I=S.reduce((F,M)=>F+(M.retribucionFlexible||[]).reduce((b,D)=>b+(D.importe||0)*12,0),0),E=Math.max(0,w-I),A=Yt(w,I),C=Math.max(0,g-h),$=E>0?A*(C/E):0,P=S.filter(F=>F._id!==u._id&&(F.bruto||0)>(u.bruto||0)).reduce((F,M)=>{const b=(M.retribucionFlexible||[]).reduce((_,z)=>_+(z.importe||0)*12,0),D=Math.max(0,p(M,v)-b);return F+(E>0?A*(D/E):0)},0);return zt(P+$,f)-zt(P,f)}for(const u of t){if(!u.activo)continue;const v=u.cuenta||"default";if(e&&e.length>0&&!e.includes(v))continue;const g=Math.max(1,u.nPagas||12),h=V(u.fechaInicio||a.start),x=u.fechaFin?V(u.fechaFin):r,f=y=>{const S=p(u,y),w=d(u,y),I=(u.retribucionFlexible||[]).reduce((b,D)=>b+(D.importe||0)*12,0),E=Math.max(0,S-I),A=(u.ssPct??6.35)/100,C=E*A,$=E/g,P=w/g,F=C/g,M=u.representacion==="simplificado"?$-F-P:$;n.push({fecha:y,concepto:u.nombre,cuantia:M,tipo:"ingreso",cuenta:v,tags:u.tags||[],sourceId:u._id,sourceType:"nomina"}),u.representacion==="detallado"&&(F>0&&n.push({fecha:y,concepto:`SS ${u.nombre}`,cuantia:F,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:u._id+"_ss",sourceType:"nomina"}),P>0&&n.push({fecha:y,concepto:`IRPF ${u.nombre}`,cuantia:P,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:u._id+"_irpf",sourceType:"nomina"}));for(const b of u.retribucionFlexible||[])!b.cuenta||!(b.importe>0)||e&&e.length>0&&!e.includes(b.cuenta)||n.push({fecha:y,concepto:`${u.nombre} — ${Pn[b.tipo]||b.tipo}`,cuantia:b.importe,tipo:"ingreso",cuenta:b.cuenta,tags:["retribucion-flexible",b.tipo],sourceId:`${u._id}_flex_${b._id||b.tipo}`,sourceType:"nomina"})};if(g<=12){const y=g===12?1:Math.round(12/g),S=h.getDate();let{year:w,month:I}=le(h,i,y);for(let E=0;E<300;E++){const A=new Date(w,I+1,0).getDate(),C=new Date(w,I,Math.min(S,A));if(C>r||C>x)break;C>=i&&C>=h&&f(tt(C)),I+=y,I>=12&&(w+=Math.floor(I/12),I=I%12)}}else{const y=g-12,S=h.getDate();let{year:w,month:I}=le(h,i,1);for(let C=0;C<300;C++){const $=new Date(w,I+1,0).getDate(),P=new Date(w,I,Math.min(S,$));if(P>r||P>x)break;P>=i&&P>=h&&f(tt(P)),I++,I>=12&&(w++,I=0)}const E=Math.max(h.getFullYear(),i.getFullYear()),A=Math.min((u.fechaFin?x:r).getFullYear(),r.getFullYear());for(let C=E;C<=A;C++)for(const $ of En.slice(0,y)){const P=new Date(C,$,15);P>=i&&P<=r&&P>=h&&P<=x&&f(tt(P))}}}return n}function To(t,a,e,o=null,s="default"){const n=[];if(!a||a.length===0)return n;const i=V(e.start),r=V(e.end),c=et(),l=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let p=new Date(i.getFullYear(),i.getMonth(),1);for(;p<=r;){const d=p.getFullYear(),u=p.getMonth(),v=d+"-"+String(u+1).padStart(2,"0"),g=v+"-01",h=tt(new Date(d,u+1,0)),x=tt(new Date(d,u,15));let f=0;for(const y of l){if(o&&o.length>0&&!o.includes(y.cuenta||"default")||y.fechaInicio&&y.fechaInicio>h||y.fechaFin&&y.fechaFin<g)continue;const S=y.fechaInicio||c,w=Gt(a,S,x);if(w<=1)continue;const I=Math.max(1,y.frecuencia||1);f+=y.cuantia*(w-1)/I}f>.01&&n.push({fecha:x,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:s,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),p=new Date(d,u+1,1)}return n}function zo(t,a,e,o="default"){const s=[];if(!a||a.length===0||t<=0)return s;const n=V(e.start),i=V(e.end),r=[...a].sort((l,p)=>l.year-p.year);let c=new Date(n.getFullYear(),n.getMonth(),1);for(;c<=i;){const l=c.getFullYear(),p=c.getMonth(),d=l+"-"+String(p+1).padStart(2,"0"),u=tt(new Date(l,p,15)),v=r.filter(y=>y.year<=l),g=v.length>0?v[v.length-1]:r[0],h=g?g.tasa/100:0,x=Math.pow(1+h,1/12)-1,f=t*x;f>.01&&s.push({fecha:u,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),c=new Date(l,p+1,1)}return s}function jo(t,a){const e=a.fechaReferencia||a.dashboardStart,o=e<a.dashboardStart?a.dashboardStart:e>a.dashboardEnd?a.dashboardEnd:e,s=t.reduce((i,r)=>i+Pe(r,o),0),n=So(t,o);return{fecha:n&&n<o?n:o,saldo:s,pedida:o}}function qo(t,a,e){const{fecha:o,saldo:s}=jo(a,e),n=t.filter(p=>p.fecha<o),i=t.filter(p=>p.fecha>=o),r=[];let c=s;for(const p of[...n].reverse()){const d=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);r.unshift({...p,delta:d,saldoAcum:c}),c-=d}const l=[];c=s;for(const p of i){const d=p.tipo==="ingreso"?Math.abs(p.cuantia):-Math.abs(p.cuantia);c+=d,l.push({...p,delta:d,saldoAcum:c})}return[...r,...l]}function _n(t,a,e,o=null){const s=a.filter(n=>n.activo&&(!o||o.length===0||o.includes(n._id)));return qo([...t].sort((n,i)=>n.fecha.localeCompare(i.fecha)),s,e)}function No(t){const{loans:a,expenses:e,accounts:o,config:s}=t,n=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c=o.filter(x=>x.activo&&(!n||n.length===0||n.includes(x._id))),l=jo(c,s),p={start:l.fecha<s.dashboardStart?l.fecha:s.dashboardStart,end:s.dashboardEnd},d=e.filter(x=>x.tipo!=="transferencia"),u=e.filter(x=>x.tipo==="transferencia"),v={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let g=[];g=g.concat(Fe(d,p,n)),g=g.concat(Ea(a,p,n)),g=g.concat(Po(u,p,n,v)),g=g.concat(_o(o,p,n));const h=Fo(o,p,n,g);if(g=g.concat(h),g=g.concat(Do(e,s.tramos_irpf,p,n)),g=g.concat(Pa(i,p,n,r,t.resolverTramosIRPF)),s.usarInflacion&&r.length>0){const x=(o.find(S=>S.activo&&S.esCuentaPrincipal)||o.find(S=>S.activo)||{_id:"default"})._id;g=g.concat(To(d,r,p,n,x));const y=o.filter(S=>S.activo&&(!n||n.length===0||n.includes(S._id))).reduce((S,w)=>S+Pe(w,s.dashboardStart),0);g=g.concat(zo(y,r,p,x))}return g.sort((x,f)=>x.fecha.localeCompare(f.fecha)),qo(g,c,s).filter(x=>x.fecha>=s.dashboardStart)}function Fn(t,a,e=null){const o=et(),n=a.filter(r=>r.activo&&(!e||e.length===0||e.includes(r._id))).reduce((r,c)=>r+Vt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?n:i[i.length-1].saldoAcum}function Ro(t,a){const e=new Map;for(const o of t)if(o.tipo===a&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const s of o.tags||["sin_tag"])e.set(s,(e.get(s)||0)+Math.abs(o.cuantia));return e}function Dn(t,a){const e=[];let o=!1;for(let s=0;s<t.length;s++){const n=t[s],i=n.saldoAcum;i<0&&(s===0||t[s-1].saldoAcum>=0)&&e.push({tipo:"saldo_negativo",fecha:n.fecha,saldo:i,mensaje:`Saldo negativo (${T(i)}) a partir del ${n.fecha}`}),a>0&&(i<a&&!o?(o=!0,e.push({tipo:"bajo_colchon",fecha:n.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${T(i)} < ${T(a)}) desde ${n.fecha}`})):i>=a&&o&&(o=!1,e.push({tipo:"recuperacion_colchon",fecha:n.fecha,saldo:i,mensaje:`Recuperación del colchón el ${n.fecha} (${T(i)})`})))}return e}function Tn(t,a){const e=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=V(a.dashboardStart),s=V(a.dashboardEnd),n=Math.max(1,(s.getTime()-o.getTime())/(30.44*864e5));return e/n}function zn(t,a,e=et()){const o=new Set,s=a.map(r=>{const c=r.fechaInicialSaldo||"",l={};c&&c<=e&&(l[c]=r.saldoInicial||0);for(const p of r.historicoSaldos||[])p.fecha<=e&&(!c||p.fecha>=c)&&(l[p.fecha]=p.saldo);return Object.keys(l).forEach(p=>o.add(p)),l}),n={};for(const r of[...o].sort()){let c=0;for(let l=0;l<a.length;l++){const p=Object.entries(s[l]).filter(([d])=>d<=r);p.length>0?(p.sort(([d],[u])=>u.localeCompare(d)),c+=p[0][1]):c+=a[l].saldoInicial||0}n[r]=c}const i=[];for(const[r,c]of Object.entries(n).sort(([l],[p])=>l.localeCompare(p))){const l=t.filter(v=>v.fecha<=r),p=l.length>0?l[l.length-1].saldoAcum:null;if(p===null)continue;const d=c-p,u=p!==0?d/Math.abs(p)*100:0;i.push({cuenta:"Total",fecha:r,estimado:p,real:c,desv:d,pct:u})}return i}const jn=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:zn,detectarPuntosCriticos:Dn,mediaMensualGastos:Tn},Symbol.toStringTag,{value:"Module"}));function De(t,a=new Date){const e=tt(a),o=new Date(a);o.setMonth(o.getMonth()+1);const s=tt(o),n=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Fe(n,{start:e,end:s}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function qn(t){return(t||[]).filter(a=>a.basico&&a.activo&&!a.simulacion).reduce((a,e)=>a+te(e.capital,e.tin,e.meses),0)}function Nn(t,a){return bt(t).tabla.filter(e=>!e.esAmortizacion&&e.fecha>=a).length}function ko(t,a,e){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,s)=>o+te(s.capital,s.tin,s.meses)*Math.min(a,Nn(s,e)),0)}function Lo(t,a,e,o=new Date){if(a.colchonTipo==="fijo"&&(a.colchonFijo||0)>0)return a.colchonFijo;const s=De(t,o),n=a.colchonMeses||6;return s*n+ko(e,n,tt(o))}function Rn(t,a,e,o,s){const i=[...a.colchonPuntos||[]].sort((l,p)=>l.fecha.localeCompare(p.fecha)).filter(l=>l.fecha<=o).pop();if(!i)return Lo(t,a,e,s);if(i.tipo==="fijo")return i.importe||0;const r=De(t,s),c=i.meses||6;return r*c+ko(e,c,o)}function _a(t,a,e,o,s,n=!1,i){const r=[...t.puntos||[]].sort((p,d)=>p.fecha.localeCompare(d.fecha)),c=r.filter(p=>p.fecha<=s).pop()||(n?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(De(a,i)+qn(o))*(c.meses||1):0}function kn(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function Ln(t,a){const e={};for(const o of a)e[o._id]=Vt(o);return t.map(o=>(o.cuenta&&e[o.cuenta]!==void 0&&(e[o.cuenta]+=kn(o)),{fecha:o.fecha,saldos:{...e}}))}function On(t,a,e,o,s,n,i){const r=[];for(const c of(t||[]).filter(l=>l.activo!==!1)){let l=!1;for(let p=0;p<a.length;p++){const d=a[p],u=_a(c,o,s,n,d.fecha,!1,i);if(u<=0){l=!1;continue}const v=!c.cuentas||c.cuentas.length===0?d.saldoAcum:c.cuentas.reduce((g,h)=>{var x,f;return g+(((f=(x=e[p])==null?void 0:x.saldos)==null?void 0:f[h])||0)},0);v<u&&!l?(l=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${T(v)} < ${T(u)} desde ${d.fecha}`})):v>=u&&l&&(l=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:v,target:u,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${d.fecha}`}))}}return r}const Hn=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Lo,calcColchonEnFecha:Rn,calcGastoBasicoMensual:De,calcMargenEnFecha:_a,detectarCrucesMargenes:On,saldosPorCuentaEnExtracto:Ln},Symbol.toStringTag,{value:"Module"}));function Bn(t){if(!t||t.showColchon===!1)return null;const a=t.colchonPuntos??[];return a.length>0?{nombre:"Colchón",puntos:[...a]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function Oo(t,a){return Ae(V(t),V(a))}const Gn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Ho(t,a){const[e,o,s]=t.split("-").map(Number),n=t.slice(0,4)===a.slice(0,4);return`${s} de ${Gn[o-1]}${n?"":` de ${e}`}`}function Bo(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Vn(t,a={}){const{hoy:e=et(),horizonteCritico:o=365,horizonteAviso:s=120,maximo:n=4,incertidumbre:i}=a,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:u=>`El ${u} el saldo proyectado baja a ${T(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:u=>u?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:u=>`El ${u} el saldo queda en ${T(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:u=>u?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:u=>`El ${u} tendrías ${T(d.saldo)}, y el margen pide ${T(d.target)}.`});const c=new Map;for(const d of r){const u=c.get(d.id);(!u||d.fecha<u.fecha)&&c.set(d.id,d)}const l=[];for(const d of c.values()){const u=Oo(e,d.fecha);if(u<0||u>(d.gravedad==="critico"?o:s))continue;const v=i?i(u):0,g=v>0&&d.distancia<v;l.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:u,plazo:Bo(u),titulo:d.titulo(g),detalle:d.detalle(Ho(d.fecha,e)),incierto:g})}const p={critico:0,aviso:1};return l.sort((d,u)=>d.fecha.localeCompare(u.fecha)||p[d.gravedad]-p[u.gravedad]),l.slice(0,n)}const Un=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:Bn,construirAvisos:Vn,describirPlazo:Bo,diasEntreISO:Oo,fechaEnPalabras:Ho},Symbol.toStringTag,{value:"Module"})),Yn=30.44*864e5;function Go(t){const a=t.getFullYear(),e=t.getMonth();return{desde:tt(new Date(a,e,1)),hasta:tt(new Date(a,e,$a(a,e)))}}function Vo(t){const[a,e]=t.split("-").map(Number);return Go(new Date(a,e-1,1))}function Wn(t,a){return Math.max(1,(V(a).getTime()-V(t).getTime())/Yn)}const Kn=t=>t.filter(a=>a.sourceType!=="transfer-out"&&a.sourceType!=="transfer-in"),Wt=t=>t.reduce((a,e)=>a+Math.abs(e.cuantia),0);function Jn(t,a){const e=new Map(a.map(n=>[n._id,n.clasificacion]));let o=0,s=0;for(const n of t){if(n.tipo!=="gasto"||n.sourceType!=="expense")continue;const i=e.get(n.sourceId??"");i!==null&&(i==="deseo"?s+=Math.abs(n.cuantia):o+=Math.abs(n.cuantia))}return{basicos:o,deseo:s}}function Qn(t,a){const e=a.entreMeses&&a.entreMeses>0?a.entreMeses:1,o=u=>u.sourceType==="loan"&&u.tipo==="gasto",s=a.loanIdsIniciados,n=Wt(t.filter(u=>u.tipo==="ingreso")),i=Wt(t.filter(u=>o(u)&&(!s||s.has(u.sourceId??"")))),r=Wt(t.filter(u=>o(u)&&a.hipotecaIds.has(u.sourceId??""))),c=Wt(t.filter(u=>u.sourceType==="loan-amort")),l=Wt(t.filter(u=>u.sourceType==="account-interest")),{basicos:p,deseo:d}=Jn(t,a.expenses);return{ingresos:n/e,cuotas:i/e,cuotasHipoteca:r/e,amortizaciones:c/e,gastosBasicos:p/e,gastosDeseo:d/e,gastosTotales:(i+p+d)/e,intereses:l/e}}function Uo(t,a){return t.reduce((e,o)=>{const s=bt(o).tabla.filter(n=>!n.esAmortizacion&&n.fecha<=a);return e+(s.length>0?s[s.length-1].capitalPendiente:o.capital||0)},0)}function Xn(t,a,e,o){const s=t.filter(l=>l.activo&&!l.simulacion&&(l.fechaInicio||"")<=e),n=s.reduce((l,p)=>{if((p.amortizaciones||[]).filter(g=>g.fecha>=a&&g.fecha<=e).length===0)return l;const u=bt(p).totalIntereses,v=bt({...p,amortizaciones:(p.amortizaciones||[]).filter(g=>g.fecha<a||g.fecha>e)}).totalIntereses;return l+Math.max(0,v-u)},0),i=s.filter(l=>l.mostrarFechaFinEnDashboard!==!1).map(l=>({loan:l,fechaFin:bt(l).fechaFin})).filter(l=>!!l.fechaFin&&l.fechaFin>=a&&l.fechaFin<=e),r=s.map(l=>bt(l).tabla),c=l=>{const{desde:p,hasta:d}=Vo(l);return r.reduce((u,v)=>{const g=v.find(h=>!h.esAmortizacion&&h.fecha>=p&&h.fecha<=d);return u+(g?g.cuota:0)},0)};return{deudaInicio:Uo(s,a),deudaFin:Uo(s,e),ahorroIntereses:n,ahorroInteresesMes:o>0?n/o:0,cuotasInicio:c(a.slice(0,7)),cuotasFin:c(e.slice(0,7)),finEnPeriodo:i}}function Zn(t,a){return a.filter(e=>e.activo&&(e.interes??0)>0).map(e=>({nombre:e.nombre,interes:e.interes,total:Wt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===e._id))})).filter(e=>e.total>0).sort((e,o)=>o.total-e.total)}function Yo(t,a=new Set,e="desglosado"){if(a.size===0)return Ro(t,"gasto");const o=new Map;for(const s of t){if(s.tipo!=="gasto")continue;const n=s.tags||[],i=n.filter(l=>a.has(l)),r=n.filter(l=>!a.has(l)),c=e==="porgrupos"&&i.length>0?i:r;for(const l of c)o.set(l,(o.get(l)||0)+Math.abs(s.cuantia))}return o}function ti(t,a={}){const e=a.activos,o=a.entreMeses&&a.entreMeses>0?a.entreMeses:1;return[...Yo(t,a.grupoTags,a.modo).entries()].filter(([s])=>!e||e.size===0||e.has(s)).map(([s,n])=>({tag:s,total:n/o})).sort((s,n)=>n.total-s.total)}function ei(t,a){const e=a.reduce((o,s)=>o+Vt(s),0);return{saldoBase:e,saldoFinal:t.length>0?t[t.length-1].saldoAcum??e:e,totalGastos:Wt(t.filter(o=>o.tipo==="gasto")),totalIngresos:Wt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function ai(t,a){return t.filter(e=>e.activo&&(!a||a.length===0||a.includes(e._id)))}function oi(t,a="hipoteca"){return new Set(t.filter(e=>(e.tags||[]).includes(a)).map(e=>e._id))}function si(t,a){return new Set(t.filter(e=>(e.fechaInicio||"")<=a).map(e=>e._id))}function ni(t,a){if(t.length===0)return[];const e=l=>a==="mes"?l.slice(0,7):l.slice(0,4),o=l=>a==="mes"?`${l}-01`:`${l}-01-01`,s=t[0],n=s.delta??(s.tipo==="ingreso"?Math.abs(s.cuantia):-Math.abs(s.cuantia));let i=(s.saldoAcum??0)-n;const r=[];let c=null;for(const l of t){const p=e(l.fecha),d=l.saldoAcum??i;(!c||c.periodo!==p)&&(c&&(i=c.cierre),c={periodo:p,inicio:o(p),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(c)),c.cierre=d,d>c.maximo&&(c.maximo=d),d<c.minimo&&(c.minimo=d),c.eventos+=1}return r}const ii=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:ni,cuentasVisibles:ai,gastoPorTagOrdenado:ti,idsHipoteca:oi,idsPrestamosIniciados:si,interesesPorCuenta:Zn,mesesDelPeriodo:Wn,metricasFlujo:Qn,rangoMes:Vo,rangoMesDe:Go,resumenPrestamosPeriodo:Xn,sinTransferencias:Kn,sumarGastosPorTag:Yo,totalesPeriodo:ei},Symbol.toStringTag,{value:"Module"}));function Wo(t){return t.imprevisto===!0&&t.importeCts<0&&t.tipo!=="transferencia"&&!t.estimacionId}const ri=["luz","electricidad","gas","agua","internet","fibra","movil","telefono","telefonia","seguro","seguros","comunidad","alquiler","ibi","basura","basuras","suscripcion","suscripciones","recibo","recibos","factura","facturas","suministro","suministros","colegio","guarderia","academia","gimnasio","cuota","mutua","hipoteca","netflix","spotify","hbo","disney","prime","icloud","youtube","iberdrola","endesa","naturgy","repsol","movistar","vodafone","orange","digi","yoigo","masmovil","pepephone","calefaccion","alarma","parking","garaje"],Ko=t=>t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase(),ci=new Set(ri);function li(t){return Ko([t.concepto??"",...t.tags??[]].join(" ")).split(/[^a-z0-9]+/).some(e=>ci.has(e))}function Te(t){return t?t.esFactura===!0?!0:t.esFactura===!1||(t.tipoFrecuencia??"mensual")!=="mensual"?!1:li(t)?!0:!!t.diaPago&&t.diaPago!==""&&(t.basico===!0||t.clasificacion==="necesidad"):!1}const di=new Set(["transfer-out","transfer-in","aportacion-out","aportacion-in"]),ui=new Set(["account-interest"]),Jo=t=>t.sourceType==="nomina"&&t.tipo==="gasto",pt=t=>Math.round(Math.abs(t)*100);function Xe(t,a,e){const o=new Map;for(const r of t){const c=r.sourceId??r.concepto,l=o.get(c)??{concepto:e(r),total:0,vencido:0,fechas:[]},p=pt(r.cuantia);l.total+=p,r.fecha<=a&&(l.vencido+=p),l.fechas.push(r.fecha),o.set(c,l)}const s=[...o.entries()].map(([r,c])=>({id:r,concepto:c.concepto,total:c.total/100,vencido:c.vencido/100,fechas:c.fechas.sort()})).sort((r,c)=>c.total-r.total||r.concepto.localeCompare(c.concepto)),n=[...o.values()].reduce((r,c)=>r+c.total,0),i=[...o.values()].reduce((r,c)=>r+c.vencido,0);return{total:n/100,vencido:i/100,pendiente:(n-i)/100,partidas:s}}function Ze(t,a,e,o,s={}){const n=new Map(a.map($=>[$._id,$])),i=new Map(e.map($=>[$._id,$])),r=t.filter($=>!di.has($.sourceType??"")&&!ui.has($.sourceType??"")),c=r.filter($=>$.tipo==="ingreso").reduce(($,P)=>$+pt(P.cuantia),0),l=r.filter(Jo).reduce(($,P)=>$+pt(P.cuantia),0),p=[],d=[],u=[],v=[];for(const $ of r){if($.tipo!=="gasto"||Jo($))continue;const P=$.sourceType==="expense"?n.get($.sourceId??""):void 0;$.sourceType==="loan"||$.sourceType==="loan-amort"?p.push($):P!=null&&P.imprevisto?u.push($):P&&Te(P)?d.push($):v.push($)}for(const $ of s.movimientos??[]){if(!Wo($))continue;const P=Ko($.concepto).replace(/\s+/g," ").trim();u.push({fecha:$.fecha,concepto:$.concepto,cuantia:$.importeCts/100,tipo:"gasto",tags:[],cuenta:"",sourceId:`mov:${P}`,sourceType:"movimiento"})}const g=$=>{var P;return((P=n.get($.sourceId??""))==null?void 0:P.concepto)??$.concepto},h=Xe(p,o,$=>{var P;return((P=i.get($.sourceId??""))==null?void 0:P.nombre)??$.concepto}),x=Xe(d,o,g),f=Xe(v,o,g),y=Xe(u,o,g),S=c-l,w=pt(h.total)+pt(x.total)+pt(f.total)+pt(y.total),I=s.estimacionImprevistos??null,E=I!==null?Math.max(0,pt(I)-pt(y.total)):0,A=S/100,C=(S-w-E)/100;return{ingresosNetos:A,prestamos:h,facturas:x,otros:f,imprevistos:y,gastosTotales:w/100,estimacionImprevistos:I,reservaImprevistos:E/100,margen:C,margenPct:A>0?C/A*100:null}}function pi(t,a){const[e,o,s]=t.split("-").map(Number),[n,i,r]=a.split("-").map(Number);if(![e,o,s,n,i,r].every(Number.isFinite)||a<t)return 1;const c=new Date(n,i-1,r+1);let l=(c.getFullYear()-e)*12+(c.getMonth()+1-o);const p=g=>{const h=new Date(e,o-1+g,1),x=new Date(h.getFullYear(),h.getMonth()+1,0).getDate();return new Date(h.getFullYear(),h.getMonth(),Math.min(s,x))};p(l).getTime()>c.getTime()&&(l-=1);const d=p(l),u=Math.round((c.getTime()-d.getTime())/864e5),v=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();return Math.max(.03225806451612903,l+u/v)}function Kt(t,a){const[e,o]=t.split("-").map(Number),[s,n]=a.split("-").map(Number);if(![e,o,s,n].every(Number.isFinite))return[];const i=[];for(let r=e,c=o;(r<s||r===s&&c<=n)&&(i.push(`${r}-${String(c).padStart(2,"0")}`),!(i.length>240));c===12?(c=1,r++):c++);return i}function It(t,a){const[e,o]=t.split("-").map(Number),s=new Date(e,o-1+a,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function Fa(t,a,e,o,s,n={}){var c,l;const i=new Map(o.map(p=>[p,[]]));for(const p of t)(c=i.get(p.fecha.slice(0,7)))==null||c.push(p);const r=new Map(o.map(p=>[p,[]]));for(const p of n.movimientos??[])(l=r.get(p.fecha.slice(0,7)))==null||l.push(p);return o.map(p=>{var d;return{mes:p,desglose:Ze(i.get(p)??[],a,e,s,{movimientos:r.get(p),estimacionImprevistos:((d=n.estimacion)==null?void 0:d.mes)===p?n.estimacion.importe:null})}})}function ta(t){const a=new Map;for(const n of t)for(const i of n.partidas){const r=a.get(i.id)??{concepto:i.concepto,total:0,vencido:0,fechas:[]};r.total+=pt(i.total),r.vencido+=pt(i.vencido),r.fechas.push(...i.fechas),a.set(i.id,r)}const e=[...a.entries()].map(([n,i])=>({id:n,concepto:i.concepto,total:i.total/100,vencido:i.vencido/100,fechas:i.fechas.sort()})).sort((n,i)=>i.total-n.total||n.concepto.localeCompare(i.concepto)),o=[...a.values()].reduce((n,i)=>n+i.total,0),s=[...a.values()].reduce((n,i)=>n+i.vencido,0);return{total:o/100,vencido:s/100,pendiente:(o-s)/100,partidas:e}}function ue(t){const a=ta(t.map(p=>p.prestamos)),e=ta(t.map(p=>p.facturas)),o=ta(t.map(p=>p.otros)),s=ta(t.map(p=>p.imprevistos)),n=t.reduce((p,d)=>p+Math.round(d.ingresosNetos*100),0),i=pt(a.total)+pt(e.total)+pt(o.total)+pt(s.total),r=t.reduce((p,d)=>p+pt(d.reservaImprevistos),0),c=n/100,l=(n-i-r)/100;return{ingresosNetos:c,prestamos:a,facturas:e,otros:o,imprevistos:s,gastosTotales:i/100,estimacionImprevistos:null,reservaImprevistos:r/100,margen:l,margenPct:c>0?l/c*100:null}}function Qo(t){const a=ue(t),e=t.length;if(e<=1)return a;const o=g=>Math.round(g*100/e)/100,s=g=>{const h=o(g.total),x=o(g.vencido);return{total:h,vencido:x,pendiente:Math.round((h-x)*100)/100,partidas:g.partidas.map(f=>({...f,total:o(f.total),vencido:o(f.vencido)}))}},n=s(a.prestamos),i=s(a.facturas),r=s(a.otros),c=s(a.imprevistos),l=pt(o(a.ingresosNetos)),p=pt(n.total)+pt(i.total)+pt(r.total)+pt(c.total),d=pt(o(a.reservaImprevistos)),u=l/100,v=(l-p-d)/100;return{ingresosNetos:u,prestamos:n,facturas:i,otros:r,imprevistos:c,gastosTotales:p/100,estimacionImprevistos:null,reservaImprevistos:d/100,margen:v,margenPct:u>0?v/u*100:null}}function Xo(t,a,e){const o={mediaMensual:0,total:0,meses:0,desde:null,hasta:null};if(!e)return o;const s=It(a,-12),n=It(a,-1),i=e.slice(0,7)>s?e.slice(0,7):s;if(i>n)return o;const r=Kt(i,n),c=t.filter(l=>l.mes>=i&&l.mes<=n).reduce((l,p)=>l+pt(p.desglose.imprevistos.total),0);return{mediaMensual:Math.round(c/r.length)/100,total:c/100,meses:r.length,desde:i,hasta:n}}function jt(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function Zo(t){let a=null;for(const e of t.movimientos)(!a||e.fecha<a)&&(a=e.fecha);for(const e of t.gastos)e.imprevisto&&e.fechaInicio&&(!a||e.fechaInicio<a)&&(a=e.fechaInicio);return a}function Da(t,a){const e=Kt(It(t,-12),It(t,-1)),o=a.generarExtracto(`${e[0]}-01`,jt(e[e.length-1])),s=Fa(o,a.gastos,a.prestamos,e,a.hoy,{movimientos:a.movimientos});return Xo(s,t,Zo(a))}function ts(t,a){const e=t.hoy.slice(0,7),o=Da(e,t),s=t.movimientos.filter(i=>i.fecha.startsWith(e));return{desglose:Ze(a,t.gastos,t.prestamos,t.hoy,{movimientos:s,estimacionImprevistos:o.meses>0?o.mediaMensual:null}),estimacion:o}}const mi=Object.freeze(Object.defineProperty({__proto__:null,desgloseDelMes:Ze,desglosePorMeses:Fa,esFactura:Te,esMovimientoImprevisto:Wo,estimacionImprevistosPara:Da,estimarImprevistos:Xo,finDeMes:jt,mediaDeDesgloses:Qo,mesEnCurso:ts,mesesDeCalendario:pi,mesesEntre:Kt,primerDatoDeSeguimiento:Zo,sumarDesgloses:ue,sumarMesesA:It},Symbol.toStringTag,{value:"Module"}));function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Jt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${m(T(t))}</span>`}function fi(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function es(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(a=>`<span class="tag">${m(a)}</span>`).join(" ")}const gi=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function ht(t){const[a,e]=t.split("-").map(Number);return`${gi[e-1]} ${a}`}function O(t,a="ok"){const e=globalThis.UI;if(e!=null&&e.toast)return e.toast(t,a);console.info("[FinanceApp]",t)}function wt(t){const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(t):typeof confirm=="function"?confirm(t):!0}function kt(t=document){var o;const a=t.getElementById("modal-content");if(!a)return null;const e=a.cloneNode(!1);return a.replaceWith(e),(o=t.getElementById("modal-box"))==null||o.classList.remove("modal-box--ancho"),e}function q(t,a,e){t.addEventListener("click",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(a);s&&t.contains(s)&&e(s,o)})}function J(t,a,e){t.addEventListener("change",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(a);s&&t.contains(s)&&e(s,o)})}function Ft(t,a){var e;return((e=t.querySelector(a))==null?void 0:e.value)??""}function as(t,a){const e=parseFloat(Ft(t,a));return Number.isFinite(e)?e:0}const St={prestamos:"#9085e9",facturas:"#d95926",otros:"#3987e5",imprevistos:"#d55181"},vi=t=>String(Number(t.slice(8,10)));function os(t,a){if(t.partidas.length===0)return"";const e=t.partidas.map(o=>{const s=a.meses!==void 0||a.media?`${o.fechas.length} ${o.fechas.length===1?"cargo":"cargos"}`:o.fechas.length>4?`${o.fechas.length} cargos`:`día ${o.fechas.map(vi).join(", ")}`;return`<div class="mes-fila${a.meses===void 0&&!a.media&&o.fechas.every(i=>i<=a.hoy)?" mes-fila--hecha":""}">
        <span class="mes-fila-nombre" title="${m(o.concepto)}">${m(o.concepto)}</span>
        <span class="mes-fila-dia">${m(s)}</span>
        <span class="mes-fila-importe">${m(T(o.total))}</span>
      </div>`}).join("");return`<details class="mes-detalle"${a.abierto?" open":""}><summary>${t.partidas.length} ${t.partidas.length===1?"concepto":"conceptos"}</summary>${e}</details>`}function ea(t,a,e,o,s,n){const i=e.total>0?Math.min(100,e.vencido/e.total*100):0;let r;e.total<=0?r="<span>Nada previsto</span>":o.media&&n?r=`<span>Al mes · <strong>${m(T(o.media.acumulado[n].total))}</strong> en ${o.media.meses} meses</span>`:o.meses!==void 0?r=`<span>Media <strong>${m(T(e.total/Math.max(1,o.meses)))}</strong>/mes</span>`:e.pendiente<=.004?r="<span>Ya cargado todo</span>":r=`<span>Quedan <strong>${m(T(e.pendiente))}</strong></span><span>cargado ${m(T(e.vencido))}</span>`;const c=o.meses!==void 0||o.media?"":`<div class="mes-barra" role="img" aria-label="${Math.round(i)} % ya cargado"><span style="width:${i.toFixed(1)}%"></span></div>`;return`<section class="mes-bloque ${s}" aria-label="${m(t)}">
    <div class="mes-bloque-titulo" title="${m(a)}"><span class="mes-punto" aria-hidden="true"></span>${m(t)}</div>
    <div class="mes-bloque-total">${m(T(e.total))}</div>
    ${c}
    <div class="mes-bloque-pie">${r}</div>
    ${os(e,o)}
  </section>`}function bi(t,a){const e=t.imprevistos,o=a.estimacion;if(!(a.meses===void 0&&!a.media&&o&&o.meses>0))return ea("Imprevistos","Gastos marcados como imprevisto: en el gasto o en el movimiento real",e,a,"mes-bloque--imprevistos","imprevistos");const n=o.mediaMensual,i=n>0?Math.min(100,e.total/n*100):e.total>0?100:0,r=e.total>n+.004,c=r?`<span>Te has pasado <strong>${m(T(e.total-n))}</strong></span>`:t.reservaImprevistos>0?`<span>Reservado <strong>${m(T(t.reservaImprevistos))}</strong></span>`:"<span>Sin imprevistos previstos</span>",l=`Estimación ${T(n)}/mes · media de ${o.meses} ${o.meses===1?"mes":"meses"}`;return`<section class="mes-bloque mes-bloque--imprevistos${r?" es-excedido":""}" aria-label="Imprevistos">
    <div class="mes-bloque-titulo" title="Gastos marcados como imprevisto: en el gasto o en el movimiento real. La estimación es la media de lo marcado en los últimos 12 meses."><span class="mes-punto" aria-hidden="true"></span>Imprevistos</div>
    <div class="mes-bloque-total">${m(T(e.total))}<span class="mes-bloque-de"> de ${m(T(n))}</span></div>
    <div class="mes-barra" role="img" aria-label="${Math.round(i)} % de la estimación"><span style="width:${i.toFixed(1)}%"></span></div>
    <div class="mes-bloque-pie">${c}</div>
    <div class="mes-bloque-pie mes-bloque-nota"><span>${m(l)}</span></div>
    ${os(e,a)}
  </section>`}function aa(t,a){const e=t.margen>=0,o=t.margenPct===null?"":` · ${Math.abs(t.margenPct).toFixed(0)} % de lo que entra`,s=a.meses!==void 0&&a.meses>1?`<div class="mes-bloque-pie"><span>Media ${e?"+":"−"}${m(T(Math.abs(t.margen)/a.meses))}/mes</span></div>`:"",n=t.reservaImprevistos>0?`<div class="mes-bloque-pie"><span>${a.media?"Incluye":"Ya descontados"} ${m(T(t.reservaImprevistos))}${a.media?"/mes":""} para imprevistos</span></div>`:"",i=a.media?`<div class="mes-bloque-pie"><span>En ${a.media.meses} meses: <strong>${a.media.acumulado.margen>=0?"+":"−"}${m(T(Math.abs(a.media.acumulado.margen)))}</strong></span></div>`:"";return`<div class="mes-rejilla">
      ${ea("Préstamos","Cuotas y amortizaciones previstas",t.prestamos,a,"mes-bloque--prestamos","prestamos")}
      ${ea("Facturas","Gastos fijos y recurrentes: recibos, alquiler, seguros, suscripciones. Se puede marcar a mano en cada gasto.",t.facturas,a,"mes-bloque--facturas","facturas")}
      ${ea("Otros gastos","El resto de gastos previstos: compra, ocio, puntuales",t.otros,a,"mes-bloque--otros","otros")}
      ${bi(t,a)}
      <section class="mes-bloque mes-bloque--margen ${e?"es-positivo":"es-negativo"}" aria-label="Margen de ahorro esperado">
        <div class="mes-bloque-titulo" title="Ingresos netos menos préstamos, facturas, otros gastos e imprevistos, y menos lo que queda por reservar para imprevistos">Margen de ahorro</div>
        <div class="mes-bloque-total">${e?"+":"−"}${m(T(Math.abs(t.margen)))}</div>
        <div class="mes-bloque-pie"><span>${e?"Te sobra":"Te falta"}${m(o)}</span></div>
        ${s}
        ${i}
        ${n}
        <div class="mes-bloque-pie"><span>Gastos previstos: ${m(T(t.gastosTotales))}${a.media?"/mes":""}</span></div>
      </section>
    </div>`}function hi(t,a,e,o=null){return`<div class="card mes-card" data-mes-card>
    <div class="mes-cabecera">
      <div class="card-title" style="margin:0">Este mes · ${m(ht(a))}</div>
      <div class="mes-cabecera-der">
        <span class="mes-ingresos">Entran <strong>${m(T(t.ingresosNetos))}</strong> netos</span>
        <button type="button" class="btn-secondary btn-sm" data-mes-historico>Meses anteriores</button>
      </div>
    </div>
    ${aa(t,{hoy:e,estimacion:o})}
  </div>`}const rt={preset:"6",vista:"mes"},yi=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],Ta=t=>`${yi[Number(t.slice(5,7))-1]} ${t.slice(2,4)}`,$i=new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",notation:"compact",maximumFractionDigits:1}),ze=t=>`${t>=0?"+":"−"}${T(Math.abs(t))}`;let je=[];function xi(){for(const t of je)try{t.destroy()}catch{}je=[]}function Ii(t,a,e,o){if(t==="anio")return Kt(`${a.slice(0,4)}-01`,a);if(t==="personalizado"&&e&&o){const n=o>a?a:o;return Kt(e<=n?e:n,n).slice(-36)}const s=Number(t)||6;return Kt(It(a,-(s-1)),a)}function wi(t){var F;const a=t.doc??document,e=a.getElementById("modal-overlay"),o=kt(a);if(!e||!o)return null;const s=o;(F=a.getElementById("modal-box"))==null||F.classList.add("modal-box--ancho");const n=t.hoy.slice(0,7);let i=[],r=It(n,-1);const c=t.movimientos??[];let l=null;try{l=Da(n,{...t,movimientos:c})}catch(M){console.error("[Meses anteriores] No se ha podido estimar los imprevistos:",M)}function p(){const M=Ii(rt.preset,n,rt.desde,rt.hasta);if(M.length===0){i=[];return}const b=M[M.length-1],[D,_]=b.split("-").map(Number),z=`${b}-${String(new Date(D,_,0).getDate()).padStart(2,"0")}`,j=t.generarExtracto(`${M[0]}-01`,z);i=Fa(j,t.gastos,t.prestamos,M,t.hoy,{movimientos:c,estimacion:l&&l.meses>0?{mes:n,importe:l.mediaMensual}:null}),M.includes(r)||(r=M.length>1?M[M.length-2]:M[0])}function d(){const M=(D,_)=>`<button type="button" class="period-btn${rt.preset===D?" active":""}" data-hist-preset="${D}" aria-pressed="${rt.preset===D}">${_}</button>`,b=rt.preset==="personalizado"?`<div class="hist-rango">
            <label>Desde <input class="form-input" type="month" data-hist-desde value="${m(rt.desde??"")}" max="${n}"/></label>
            <label>Hasta <input class="form-input" type="month" data-hist-hasta value="${m(rt.hasta??n)}" max="${n}"/></label>
          </div>`:"";return`<div class="hist-filtros" role="group" aria-label="Periodo">
        ${M("3","3 meses")}${M("6","6 meses")}${M("12","12 meses")}${M("anio","Este año")}${M("personalizado","Elegir…")}
      </div>${b}`}function u(){return i.map(({mes:M,desglose:b})=>{const D=rt.vista==="mes"&&M===r,_=M===n;return`<button type="button" class="hist-ficha${D?" activa":""}" data-hist-mes="${M}" aria-pressed="${D}"
            title="${m(ht(M))}${_?" (en curso)":""}: gastos ${m(T(b.gastosTotales))}, margen ${m(ze(b.margen))}">
          <span class="hist-ficha-mes">${m(Ta(M))}${_?"*":""}</span>
          <span class="hist-ficha-margen ${b.margen>=0?"es-positivo":"es-negativo"}">${m(ze(b.margen))}</span>
        </button>`}).join("")}function v(){if(i.length===0)return"";if(rt.vista==="media"){const D=i.map(L=>L.desglose),_=Qo(D),z=ue(D),j=`${ht(i[0].mes)} – ${ht(i[i.length-1].mes)}`,H=i.some(L=>L.mes===n);return`<div class="hist-detalle-cab">
          <div><div class="card-title" style="margin:0">Media mensual · ${i.length} ${i.length===1?"mes":"meses"}</div>
          <div class="text-sm" style="color:var(--text3)">${m(j)}${H?" · incluye el mes en curso":""}</div></div>
          <span class="mes-ingresos">Entran <strong>${m(T(_.ingresosNetos))}</strong> netos al mes</span>
        </div>
        ${aa(_,{hoy:t.hoy,media:{meses:i.length,acumulado:z}})}`}if(rt.vista==="acumulado"){const D=ue(i.map(z=>z.desglose)),_=`${ht(i[0].mes)} – ${ht(i[i.length-1].mes)}`;return`<div class="hist-detalle-cab">
          <div><div class="card-title" style="margin:0">Acumulado · ${i.length} ${i.length===1?"mes":"meses"}</div>
          <div class="text-sm" style="color:var(--text3)">${m(_)}</div></div>
          <span class="mes-ingresos">Entraron <strong>${m(T(D.ingresosNetos))}</strong> netos</span>
        </div>
        ${aa(D,{hoy:t.hoy,meses:i.length})}`}const M=i.find(D=>D.mes===r)??i[i.length-1],b=M.mes===n;return`<div class="hist-detalle-cab">
        <div class="card-title" style="margin:0">${m(ht(M.mes))}${b?" · en curso":""}</div>
        <span class="mes-ingresos">Entraron <strong>${m(T(M.desglose.ingresosNetos))}</strong> netos</span>
      </div>
      ${aa(M.desglose,{hoy:t.hoy,abierto:!0,estimacion:b?l:null})}`}function g(){if(i.length===0)return{gastos:"",ahorro:""};const M=ue(i.map(_=>_.desglose)),b=i.reduce((_,z)=>z.desglose.margen<_.desglose.margen?z:_),D=i.reduce((_,z)=>z.desglose.gastosTotales>_.desglose.gastosTotales?z:_);return{gastos:`Gastos previstos por mes, de ${ht(i[0].mes)} a ${ht(i[i.length-1].mes)}. El mes de más gasto fue ${ht(D.mes)}, con ${T(D.desglose.gastosTotales)}.`,ahorro:`Margen de ahorro de cada mes y acumulado. En el periodo: ${ze(M.margen)}. El peor mes fue ${ht(b.mes)}, con ${ze(b.desglose.margen)}.`}}function h(){xi(),p();const M=g(),b=i.length?ue(i.map(_=>_.desglose)):null,D=typeof globalThis.Chart=="function";s.innerHTML=`
      <div class="modal-title">Meses anteriores</div>
      ${d()}
      ${i.length===0?'<p class="text-sm" style="margin-top:14px">Elige un mes de inicio anterior o igual al de fin.</p>':`
      <section class="hist-grafica">
        <div class="hist-grafica-cab">
          <h3 class="hist-titulo">Gastos por mes</h3>
          <span class="text-sm" style="color:var(--text3)">Toca un mes para ver su desglose</span>
        </div>
        <div class="hist-estimacion">${l&&l.meses>0?`<span class="mes-punto" style="--grupo:${St.imprevistos}" aria-hidden="true"></span>Imprevistos estimados: <strong>${m(T(l.mediaMensual))}/mes</strong> · media de lo marcado en ${l.meses} ${l.meses===1?"mes":"meses"} (${m(T(l.total))} en total)`:"Marca gastos o movimientos como «Imprevisto» y aquí aparecerá cuánto suelen costarte al mes."}
        </div>
        ${D?`<div class="hist-lienzo"><canvas data-hist-gastos role="img" aria-label="${m(M.gastos)}"></canvas></div>`:""}
      </section>
      <section class="hist-grafica">
        <div class="hist-grafica-cab">
          <h3 class="hist-titulo">Impacto en el ahorro</h3>
          <span class="hist-total ${b&&b.margen>=0?"es-positivo":"es-negativo"}">Acumulado ${m(ze((b==null?void 0:b.margen)??0))}</span>
        </div>
        ${D?`<div class="hist-lienzo hist-lienzo--bajo"><canvas data-hist-ahorro role="img" aria-label="${m(M.ahorro)}"></canvas></div>`:""}
      </section>
      <div class="hist-fichas" role="group" aria-label="Meses del periodo">${u()}</div>
      ${i.some(_=>_.mes===n)?'<div class="text-sm" style="color:var(--text3);margin-top:4px">* Mes en curso: incluye lo que queda por cargar.</div>':""}
      <div class="hist-filtros hist-vista" role="group" aria-label="Qué desglose ver">
        <button type="button" class="period-btn${rt.vista==="mes"?" active":""}" data-hist-vista="mes" aria-pressed="${rt.vista==="mes"}">Mes seleccionado</button>
        <button type="button" class="period-btn${rt.vista==="media"?" active":""}" data-hist-vista="media" aria-pressed="${rt.vista==="media"}">Media del periodo</button>
        <button type="button" class="period-btn${rt.vista==="acumulado"?" active":""}" data-hist-vista="acumulado" aria-pressed="${rt.vista==="acumulado"}">Acumulado del periodo</button>
      </div>
      <div data-hist-detalle>${v()}</div>`}`,D&&i.length>0&&P()}function x(M){r=M,rt.vista="mes";const b=s.querySelector(".hist-fichas");b&&(b.innerHTML=u()),s.querySelectorAll("[data-hist-vista]").forEach(_=>{const z=_.dataset.histVista==="mes";_.classList.toggle("active",z),_.setAttribute("aria-pressed",String(z))});const D=s.querySelector("[data-hist-detalle]");D&&(D.innerHTML=v()),C()}const f="#8b98ad",y="rgba(255,255,255,0.06)",S="#141b27",w="#2ee6a8",I="#ff6b6b",E="#c9d3e3",A=(M,b)=>{var D;return rt.vista!=="mes"||((D=i[b])==null?void 0:D.mes)===r?M:`${M}66`};function C(){const[M,b]=je;if(M){const D=[St.prestamos,St.facturas,St.otros,St.imprevistos];M.data.datasets.forEach((_,z)=>_.backgroundColor=i.map((j,H)=>A(D[z],H))),M.update("none")}if(b){const D=b.data.datasets[0];D.backgroundColor=i.map((_,z)=>A(_.desglose.margen>=0?w:I,z)),b.update("none")}}const $=M=>({position:"top",align:"start",labels:{color:"#c9d3e3",boxWidth:10,boxHeight:10,usePointStyle:!0,font:{size:12},generateLabels:b=>b.data.datasets.map((D,_)=>({text:D.label??"",fillStyle:M[_],strokeStyle:M[_],lineWidth:0,pointStyle:"rectRounded",fontColor:"#c9d3e3",hidden:!b.isDatasetVisible(_),datasetIndex:_}))}});function P(){const M=globalThis.Chart,b=i.map(N=>N.mes===n?`${Ta(N.mes)}*`:Ta(N.mes)),D=N=>({x:{stacked:N,grid:{display:!1},ticks:{color:f,font:{size:11}},border:{color:y}},y:{stacked:N,grid:{color:y},border:{display:!1},ticks:{color:f,font:{size:11},maxTicksLimit:5,callback:k=>$i.format(k)}}}),z={responsive:!0,maintainAspectRatio:!1,animation:{duration:250},interaction:{mode:"index",intersect:!1},onClick:(N,k,G)=>{const B=G.getElementsAtEventForMode(N,"index",{intersect:!1},!0);B.length>0&&i[B[0].index]&&x(i[B[0].index].mes)},onHover:(N,k)=>{var B;const G=(B=N.native)==null?void 0:B.target;G&&(G.style.cursor=k.length?"pointer":"default")}},j=N=>({backgroundColor:"#0d131d",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#eef3fb",bodyColor:"#c9d3e3",footerColor:"#8b98ad",padding:10,callbacks:{title:k=>ht(i[k[0].dataIndex].mes),label:k=>` ${k.dataset.label}: ${T(k.raw)}`,...N?{footer:k=>N(k[0].dataIndex)}:{}}}),H=s.querySelector("[data-hist-gastos]");if(H){const N=(k,G,B,U)=>({label:k,data:B,backgroundColor:i.map((at,ut)=>A(G,ut)),borderColor:S,borderWidth:{top:2},borderSkipped:"bottom",borderRadius:U?{topLeft:4,topRight:4}:0,maxBarThickness:38});je.push(new M(H,{type:"bar",data:{labels:b,datasets:[N("Préstamos",St.prestamos,i.map(k=>k.desglose.prestamos.total),!1),N("Facturas",St.facturas,i.map(k=>k.desglose.facturas.total),!1),N("Otros gastos",St.otros,i.map(k=>k.desglose.otros.total),!1),N("Imprevistos",St.imprevistos,i.map(k=>k.desglose.imprevistos.total),!0)]},options:{...z,scales:D(!0),plugins:{legend:$([St.prestamos,St.facturas,St.otros,St.imprevistos]),tooltip:j(k=>`Total: ${T(i[k].desglose.gastosTotales)}`)}}}))}const L=s.querySelector("[data-hist-ahorro]");if(L){let N=0;const k=i.map(G=>N=Math.round((N+G.desglose.margen)*100)/100);je.push(new M(L,{type:"bar",data:{labels:b,datasets:[{type:"bar",label:"Margen del mes",data:i.map(G=>G.desglose.margen),backgroundColor:i.map((G,B)=>A(G.desglose.margen>=0?w:I,B)),borderRadius:4,borderSkipped:!1,maxBarThickness:38,order:2},{type:"line",label:"Ahorro acumulado",data:k,borderColor:E,backgroundColor:E,borderWidth:2,pointRadius:4,pointHoverRadius:6,pointBorderColor:S,pointBorderWidth:2,tension:0,order:1}]},options:{...z,scales:D(!1),plugins:{legend:$([w,E]),tooltip:j(G=>{const B=i[G].desglose;return B.margenPct===null?"":`${B.margenPct.toFixed(0)} % de lo que entró`})}}}))}}return q(s,"[data-hist-preset]",M=>{const b=M.getAttribute("data-hist-preset");if(rt.preset=b,b==="personalizado"){const D=i.map(_=>_.mes);rt.desde=rt.desde??D[0]??It(n,-5),rt.hasta=rt.hasta??D[D.length-1]??n}h()}),J(s,"[data-hist-desde], [data-hist-hasta]",()=>{var D,_;const M=(D=s.querySelector("[data-hist-desde]"))==null?void 0:D.value,b=(_=s.querySelector("[data-hist-hasta]"))==null?void 0:_.value;M&&(rt.desde=M),b&&(rt.hasta=b),h()}),q(s,"[data-hist-mes]",M=>x(M.getAttribute("data-hist-mes"))),q(s,"[data-hist-vista]",M=>{rt.vista=M.getAttribute("data-hist-vista"),s.querySelectorAll("[data-hist-vista]").forEach(_=>{const z=_.dataset.histVista===rt.vista;_.classList.toggle("active",z),_.setAttribute("aria-pressed",String(z))});const b=s.querySelector(".hist-fichas");b&&(b.innerHTML=u());const D=s.querySelector("[data-hist-detalle]");D&&(D.innerHTML=v()),C()}),h(),e.classList.remove("hidden"),s}const mt={preset:"alrededor"};function za(t,a,e,o){const s=a.slice(0,7);switch(t){case"ultimos12":return{desde:`${It(s,-11)}-01`,hasta:a};case"anio":return{desde:`${a.slice(0,4)}-01-01`,hasta:`${a.slice(0,4)}-12-31`};case"proximos12":return{desde:ce(a,1),hasta:jt(It(s,12))};case"personalizado":return e&&o?e<=o?{desde:e,hasta:o}:{desde:o,hasta:e}:{desde:`${It(s,-6)}-01`,hasta:jt(It(s,6))};default:return{desde:`${It(s,-6)}-01`,hasta:jt(It(s,6))}}}const Ci=(t,a,e)=>`informe-${t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"financeapp"}-${a}-a-${e}.html`;function Si(t){const a=t.doc??document,e=t.win??window,o=a.getElementById("modal-overlay"),s=kt(a);if(!o||!s)return null;const n=s;function i(){const l=za(mt.preset,t.hoy,mt.desde,mt.hasta),p=(d,u,v)=>`<label class="inf-opcion${mt.preset===d?" activa":""}">
        <input type="radio" name="inf-periodo" value="${d}"${mt.preset===d?" checked":""}/>
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
      ${mt.preset==="personalizado"?`<div class="grid-2 mt-8">
              <div class="form-group"><label class="form-label" for="inf-desde">Desde</label><input class="form-input" type="date" id="inf-desde" value="${m(l.desde)}"/></div>
              <div class="form-group"><label class="form-label" for="inf-hasta">Hasta</label><input class="form-input" type="date" id="inf-hasta" value="${m(l.hasta)}"/></div>
            </div>`:`<p class="text-sm mt-8" style="color:var(--text3)">Del ${m(l.desde)} al ${m(l.hasta)}</p>`}
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button type="button" class="btn-secondary" data-inf-descargar>Descargar</button>
        <button type="button" class="btn-primary" data-inf-ver>Ver informe</button>
      </div>`}function r(){const l=za(mt.preset,t.hoy,mt.desde,mt.hasta);try{return{html:t.construir(l.desde,l.hasta),...l}}catch(p){return console.error("[informe] No se ha podido generar:",p),O("No se ha podido generar el informe","err"),null}}function c(l){const p=URL.createObjectURL(new Blob([l.html],{type:"text/html;charset=utf-8"})),d=a.createElement("a");d.href=p,d.download=Ci(t.proyecto,l.desde,l.hasta),a.body.appendChild(d),d.click(),d.remove(),setTimeout(()=>URL.revokeObjectURL(p),6e4)}return J(n,'input[name="inf-periodo"]',l=>{if(mt.preset=l.value,mt.preset==="personalizado"&&!mt.desde){const p=za("alrededor",t.hoy);mt.desde=p.desde,mt.hasta=p.hasta}i()}),J(n,"#inf-desde, #inf-hasta",()=>{var l,p;mt.desde=((l=n.querySelector("#inf-desde"))==null?void 0:l.value)||mt.desde,mt.hasta=((p=n.querySelector("#inf-hasta"))==null?void 0:p.value)||mt.hasta}),q(n,"[data-inf-ver]",()=>{const l=r();if(!l)return;const p=URL.createObjectURL(new Blob([l.html],{type:"text/html;charset=utf-8"}));e.open(p,"_blank")||(c(l),O("El navegador no ha dejado abrir una pestaña: el informe se ha descargado")),setTimeout(()=>URL.revokeObjectURL(p),6e4)}),q(n,"[data-inf-descargar]",()=>{const l=r();l&&(c(l),O("Informe descargado"))}),i(),o.classList.remove("hidden"),n}function Mi(t,a){if(t===0)return a===0?100:0;const e=Math.abs(a-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-e)*100))}function ss(t,a){const e=V(t),o=[];for(let s=1;s<=a;s++){const n=new Date(e.getFullYear(),e.getMonth()-s,1);o.push(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Ai(t,a,e){const o=ss(e,1)[0],s=a.slice(0,7)<o?a.slice(0,7):o,n=[];let[i,r]=t.slice(0,7).split("-").map(Number);for(;`${i}-${String(r).padStart(2,"0")}`<=s;)n.push(`${i}-${String(r).padStart(2,"0")}`),++r>12&&(r=1,i++);return n}function ja(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function Ei(t,a){const{inicio:e,fin:o}=ja(a);return qa(t,e,o)}function qa(t,a,e){return Fe([t],{start:a,end:e}).reduce((s,n)=>s+Math.abs(n.cuantia),0)}function Pi(t,a){const{inicio:e,fin:o}=ja(a);return Ke(t.fechaInicio,t.fechaFin,e,o)}function _i(t){function a(s,n={}){var F;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=et(),desde:l,hasta:p}=n,d=t.transacciones({estimacionId:s._id}),v=d.length===0&&(((F=s.tags)==null?void 0:F.length)??0)>0?t.transacciones({tags:s.tags}):d,g=l&&p?Ai(l,p,c):ss(c,i),h=new Map(g.map(M=>{const{inicio:b,fin:D}=ja(M);return[M,{inicio:l&&l>b?l:b,fin:p&&p<D?p:D}]})),x=new Map;for(const M of v){const b=h.get(M.fecha.slice(0,7));if(!b||M.fecha<b.inicio||M.fecha>b.fin)continue;const D=M.fecha.slice(0,7);x.set(D,(x.get(D)??0)+Math.abs(M.importeCts)/100)}const f=[];for(const M of g){const b=x.get(M);if(b===void 0||!Pi(s,M))continue;const D=h.get(M),_=K(qa(s,D.inicio,D.fin));f.push({mes:M,estimado:_,real:K(b),desviacion:K(b-_),precision:Mi(_,b)})}const y=K(f.reduce((M,b)=>M+b.estimado,0)),S=K(f.reduce((M,b)=>M+b.real,0)),w=f.reduce((M,b)=>M+Math.abs(b.estimado),0),I=f.length===0?null:w>0?f.reduce((M,b)=>M+b.precision*Math.abs(b.estimado),0)/w:f.reduce((M,b)=>M+b.precision,0)/f.length,E=f.slice(-r),A=E.length>0?K(E.reduce((M,b)=>M+b.real,0)/E.length):null,C=E.reduce((M,b)=>M+b.estimado,0),$=E.reduce((M,b)=>M+b.real,0),P=C>0?$/C:null;return{estimacionId:s._id,concepto:s.concepto,tags:s.tags??[],meses:f,estimadoTotal:y,realTotal:S,desviacionTotal:K(S-y),precision:I,mediaRealReciente:A,factorReciente:P,infraestimada:S>y}}function e(s,n={}){return s.filter(i=>i.tipo!=="transferencia").map(i=>a(i,n)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(s){const n=new Map;for(const i of s)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=n.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,n.set(r,c)}return[...n.entries()].map(([i,r])=>({tag:i,estimadoTotal:K(r.estimado),realTotal:K(r.real),desviacionTotal:K(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:a,analizarTodas:e,analizarPorTag:o}}function Na(t,a,e={}){const{umbralPrecision:o=90,variacionMinimaPct:s=5}=e;if(t.precision===null||t.factorReciente===null||t.meses.length===0||t.precision>=o)return null;const n=K(a*t.factorReciente),i=K(n-a),r=a!==0?i/Math.abs(a)*100:n!==0?100:0;if(Math.abs(r)<s)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:K(a),cuantiaSugerida:n,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo previsto en un ${Math.round((t.factorReciente-1)*100)} %`:`El gasto real de los últimos ${c} meses se queda un ${Math.round((1-t.factorReciente)*100)} % por debajo de lo previsto`}}function Fi(t){function a(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e(n,i,r={}){const c=r.hoy??et(),l=t.get("expenses"),p=l.find(g=>g._id===n);if(!p)throw new Error(`La estimación ${n} no existe`);const d={...p,fechaFin:c},u={...p,_id:a(),cuantia:K(i),fechaInicio:c,fechaFin:p.fechaFin??null,ajustadaDesdeId:p._id,ajustadaEn:c},v=l.map(g=>g._id===n?d:g);return v.push(u),t.set("expenses",v),{estimacionCerrada:d,estimacionNueva:u}}function o(n,i={}){const r=[],c=[];for(const l of n)try{r.push(e(l.estimacionId,l.cuantiaSugerida,i))}catch(p){c.push({estimacionId:l.estimacionId,error:p.message})}return{aplicadas:r,errores:c}}function s(n){const i=t.get("expenses"),r=new Map(i.map(h=>[h._id,h])),c=r.get(n);if(!c)return[];const l=[];let p=c;const d=new Set;for(;p!=null&&p.ajustadaDesdeId&&!d.has(p._id);){d.add(p._id);const h=r.get(p.ajustadaDesdeId);if(!h)break;l.unshift(h),p=h}const u=[];let v=c;const g=new Set([c._id]);for(;;){const h=i.find(x=>x.ajustadaDesdeId===v._id&&!g.has(x._id));if(!h)break;g.add(h._id),u.push(h),v=h}return[...l,c,...u]}return{aplicar:e,aplicarTodas:o,cadena:s}}function Di(t,a){if(a<t)return 0;let e=0,[o,s]=t.slice(0,7).split("-").map(Number);for(;`${o}-${String(s).padStart(2,"0")}`<=a.slice(0,7);){const n=new Date(o,s,0).getDate(),i=`${o}-${String(s).padStart(2,"0")}-01`,r=`${o}-${String(s).padStart(2,"0")}-${String(n).padStart(2,"0")}`,c=t>i?t:i,l=a<r?a:r,p=(V(l).getTime()-V(c).getTime())/864e5+1;e+=p/n,++s>12&&(s=1,o++)}return e}function Ti(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function zi(t){const[a,e]=t.slice(0,7).split("-").map(Number),o=new Date(a,e-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function oa(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function ns(t,a,e){const o=new Map(a.map(n=>[n._id,[]])),s=a.filter(n=>{var i;return!e(n._id)&&(((i=n.tags)==null?void 0:i.length)??0)>0});for(const n of t){if(n.estimacionId&&o.has(n.estimacionId)){o.get(n.estimacionId).push(n);continue}if(n.estimacionId)continue;let i=null,r=0;for(const c of s){const l=(c.tags??[]).filter(p=>n.tags.includes(p)).length;l!==0&&(l>r||l===r&&i&&c._id<i._id)&&(i=c,r=l)}i&&o.get(i._id).push(n)}return o}function is(t,a,e,o={}){const n=t.filter(c=>c.tipo!=="transferencia"&&c.activo!==!1&&Ke(c.fechaInicio,c.fechaFin,a,e)).map(c=>({_id:c._id,concepto:c.concepto,tipo:c.tipo==="ingreso"?"ingreso":"gasto",tags:c.tags??[],estimado:K(qa(c,a,e)),origen:"estimacion",periodicidad:bo(c.tipoFrecuencia,c.frecuencia),cuantia:c.cuantia})),i=(o.nominas??[]).filter(c=>c.activo!==!1&&Ke(c.fechaInicio,c.fechaFin,a,e));if(i.length>0){const c=Pa(i,{start:a,end:e},null,[],o.resolverTramosIRPF);for(const l of i){const d=c.filter(u=>u.sourceId===l._id||u.sourceId.startsWith(`${l._id}_`)).reduce((u,v)=>u+(v.tipo==="ingreso"?Math.abs(v.cuantia):-Math.abs(v.cuantia)),0);n.push({_id:l._id,concepto:l.nombre,tipo:"ingreso",tags:l.tags??[],estimado:K(d),origen:"nomina",periodicidad:`${l.nPagas} pagas al año`})}}const r=(o.loans??[]).filter(c=>c.activo!==!1);if(r.length>0){const c=Ea(r,{start:a,end:e});for(const l of r){const p=c.filter(d=>d.sourceId===l._id);p.length!==0&&n.push({_id:l._id,concepto:`Cuota ${l.nombre}`,tipo:"gasto",tags:l.tags??[],estimado:K(p.reduce((d,u)=>d+Math.abs(u.cuantia),0)),origen:"prestamo",periodicidad:"cuota mensual"})}}return n}function ji(t,a,e,o={}){const{desde:s,hasta:n}=Ti(e);return{...sa(t,a,s,n,o),mes:e}}function sa(t,a,e,o,s={}){const n=t.transacciones({desde:e,hasta:o}),i=new Set(s.omitidos??[]),r=_=>_.tipo!=="transferencia"&&!i.has(oa(_.concepto)),c=n.filter(_=>r(_)&&_.importeCts<0),l=n.filter(_=>r(_)&&_.importeCts>0),p=n.filter(_=>_.tipo!=="transferencia"&&i.has(oa(_.concepto))),d=new Map((s.analisis??[]).map(_=>[_.estimacionId,_])),u=is(a,e,o,s),v=_=>new Set(_.filter(z=>t.transacciones({estimacionId:z._id}).length>0).map(z=>z._id)),g=u.filter(_=>_.tipo==="gasto"),h=u.filter(_=>_.tipo==="ingreso"),x=ns(c,g,_=>v(g).has(_)),f=ns(l,h,_=>v(h).has(_)),y=new Set,S=new Set,w=(_,z,j)=>{for(const N of z)j.add(N._id);const H=K(z.reduce((N,k)=>N+Math.abs(k.importeCts)/100,0)),L=_.origen==="estimacion"?d.get(_._id):void 0;return{estimacionId:_._id,concepto:_.concepto,tipo:_.tipo,origen:_.origen,periodicidad:_.periodicidad,tags:_.tags,estimado:_.estimado,real:H,desviacion:K(H-_.estimado),sinMovimiento:z.length===0,sugerencia:L?Na(L,_.cuantia??0,{hoy:s.hoy}):null}},I=g.map(_=>w(_,x.get(_._id)??[],y)),E=h.map(_=>w(_,f.get(_._id)??[],S)),A=(_,z)=>{const j=new Map;for(const H of _){if(z.has(H._id))continue;const L=oa(H.concepto),N=j.get(L)??{concepto:H.concepto,clave:L,total:0,movimientos:0,ids:[]};N.total=K(N.total+Math.abs(H.importeCts)/100),N.movimientos+=1,N.ids.push(H._id),j.set(L,N)}return[...j.values()].sort((H,L)=>L.total-H.total)},C=A(c,y),$=A(l,S),P=A(p,new Set),F=K(I.reduce((_,z)=>_+z.estimado,0)),M=K(c.reduce((_,z)=>_+Math.abs(z.importeCts)/100,0)),b=K(E.reduce((_,z)=>_+z.estimado,0)),D=K(l.reduce((_,z)=>_+z.importeCts/100,0));return{mes:e.slice(0,7),desde:e,hasta:o,estimado:F,real:M,desviacion:K(M-F),ingresosEstimados:b,ingresosReales:D,desviacionIngresos:K(D-b),netoEstimado:K(b-F),netoReal:K(D-M),desviacionNeta:K(D-M-(b-F)),filas:[...I,...E].sort((_,z)=>Math.abs(z.desviacion)-Math.abs(_.desviacion)),sinEstimacion:C,totalSinEstimacion:K(C.reduce((_,z)=>_+z.total,0)),ingresosSinPrever:$,totalIngresosSinPrever:K($.reduce((_,z)=>_+z.total,0)),porTag:qi(g,c),meses:Di(e,o),omitidos:P,totalOmitido:K(P.reduce((_,z)=>_+z.total,0)),vacio:n.length===0}}function qi(t,a){const e=new Map,o=(s,n,i)=>{for(const r of s.length>0?s:["sin etiqueta"]){const c=e.get(r)??{estimado:0,real:0};c[n]+=i,e.set(r,c)}};for(const s of t)o(s.tags,"estimado",s.estimado);for(const s of a)o(s.tags,"real",Math.abs(s.importeCts)/100);return[...e.entries()].map(([s,n])=>({tag:s,estimado:K(n.estimado),real:K(n.real),desviacion:K(n.real-n.estimado)})).filter(s=>s.estimado>0||s.real>0).sort((s,n)=>n.real-s.real||n.estimado-s.estimado)}function rs(t){const a=new Set;for(const e of t.transacciones())a.add(e.fecha.slice(0,7));return[...a].sort().reverse()}const W=t=>Math.round(t*100),ot=t=>t/100,pe=t=>t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia),qe=(t,a)=>t<a?t:a,na=(t,a)=>t>a?t:a,Ni=new Set(["transfer-out","transfer-in","aportacion-out","aportacion-in"]);function Ri(t,a){return{...t,transacciones:(e={})=>t.transacciones(e).filter(o=>a.has(o.cuentaId))}}function ki(t){const a=t.hoy??et(),e=t.desde,o=t.hasta<t.desde?t.desde:t.hasta,s=ce(e,-1),n=a<e?s:qe(a,o),i=n>=e,r=n<o,c=new Set(t.cuentas.map(R=>R._id)),l=Ri(t.ledger,c),p=new Set(t.opcionesCierre.omitidos??[]),d=new Set(t.cuentas.filter(R=>t.ledger.puntosControl(R._id).length>0||t.ledger.transacciones({cuentaId:R._id}).length>0).map(R=>R._id)),u=(R,Y)=>d.has(R._id)?t.ledger.saldoCuenta(R._id,Y):t.saldoSinLibro(R,Y),v=R=>ot(t.cuentas.reduce((Y,X)=>Y+W(u(X,R)),0)),g=(R,Y)=>{if(!d.has(R._id))return R.fechaInicialSaldo||null;const X=[...t.ledger.puntosControl(R._id).filter(st=>st.origen!=="derivado"&&st.fecha<=Y).map(st=>st.fecha),...t.ledger.transacciones({cuentaId:R._id,hasta:Y}).map(st=>st.fecha)];return X.length?X.sort().pop():null},h=v(s),x=i?v(n):h,f=R=>{let Y=0,X=0,st=0,xt=0;for(const Z of R)Z.tipo==="transferencia"?st+=Z.importeCts:p.has(oa(Z.concepto))?xt+=Z.importeCts:Z.importeCts>0?Y+=Z.importeCts:X-=Z.importeCts;return{ingresos:Y,gastos:X,traspasos:st,omitido:xt}},y=i?l.transacciones({desde:e,hasta:n}):[],S=f(y),w=i?sa(l,t.gastos,e,n,{...t.opcionesCierre,hoy:a}):null,I=r?na(ce(n,1),e):o,E=r?t.generarExtracto(I,o,I).filter(R=>R.fecha>=I&&R.fecha<=o&&(!R.cuenta||c.has(R.cuenta)||!R.cuenta)):[],A=E.reduce((R,Y)=>R+W(pe(Y)),0),C=ot(W(x)+A),$=R=>{const Y=Ze(R,t.gastos,t.opcionesCierre.loans??[],a),X=R.reduce((ft,Bt)=>ft+W(pe(Bt)),0),st=W(Y.ingresosNetos),xt=W(Y.gastosTotales),Z=R.filter(ft=>ft.sourceType==="account-interest").reduce((ft,Bt)=>ft+W(pe(Bt)),0),dt=R.filter(ft=>Ni.has(ft.sourceType)).reduce((ft,Bt)=>ft+W(pe(Bt)),0);return{d:Y,total:X,ingresos:st,gastos:xt,rentabilidad:Z,internos:dt,resto:X-(st-xt)-Z-dt}},P=$(E);let F=0;const M=t.imprevistos&&t.imprevistos.meses>0?t.imprevistos.mediaMensual:0;if(r&&M>0)for(const R of Kt(I.slice(0,7),o.slice(0,7))){if(R===a.slice(0,7)){F+=Math.max(0,W(M)-W(t.imprevistosMesEnCurso??0));continue}const Y=na(`${R}-01`,I),X=qe(jt(R),o),st=Number(jt(R).slice(8,10)),xt=Math.round((V(X).getTime()-V(Y).getTime())/864e5)+1;F+=Math.round(W(M)*xt/st)}const b=ot(F),D=w?W(w.netoEstimado):0,_=ot(W(h)+D),z=W(x)-(W(h)+S.ingresos-S.gastos+S.traspasos+S.omitido),j=[{concepto:`Saldo real al empezar (${s})`,importe:h,saldo:!0}];i&&(j.push({concepto:"Ingresos reales",importe:ot(S.ingresos)},{concepto:"Gastos reales",importe:-ot(S.gastos)}),S.traspasos&&j.push({concepto:"Traspasos entre cuentas",nota:"deberían sumar cero; si no, falta un lado",importe:ot(S.traspasos)}),S.omitido&&j.push({concepto:"Conceptos omitidos en el cierre",importe:ot(S.omitido)}),z&&j.push({concepto:"Ajuste por saldos anotados",nota:"saldos reales anotados a mano y cuentas sin movimientos: lo que no explican los movimientos registrados",importe:ot(z)}),j.push({concepto:`Saldo real hoy (${n})`,importe:x,saldo:!0})),r&&(j.push({concepto:"Ingresos previstos",nota:"netos de retenciones de nómina",importe:ot(P.ingresos)},{concepto:"Gastos previstos",importe:-ot(P.gastos)}),P.rentabilidad&&j.push({concepto:"Intereses y rentabilidad previstos",importe:ot(P.rentabilidad)}),P.internos&&j.push({concepto:"Movimientos entre cuentas previstos",importe:ot(P.internos)}),P.resto&&j.push({concepto:"Otros movimientos previstos",importe:ot(P.resto)}),j.push({concepto:`Saldo previsto al final (${o})`,importe:C,saldo:!0}),F>0&&j.push({concepto:"Reserva para imprevistos",nota:t.imprevistos?`media de ${t.imprevistos.meses} meses`:void 0,importe:-b},{concepto:"Saldo previsto con la reserva",importe:ot(W(C)-F),saldo:!0}));const H=[];let L=W(h);for(const R of Kt(e.slice(0,7),o.slice(0,7))){const Y=na(`${R}-01`,e),X=qe(jt(R),o),st=L;let xt=0,Z=0,dt,ft;const Bt=Y<=n,mo=X>n;if(Bt){const ha=qe(X,n),re=sa(l,t.gastos,Y,ha,{...t.opcionesCierre,hoy:a});xt+=W(re.ingresosReales),Z+=W(re.real),ft=W(re.netoEstimado),dt=W(v(ha))}else dt=st;if(mo){const ha=E.filter(bn=>bn.fecha>=na(Y,I)&&bn.fecha<=X),re=$(ha);xt+=re.ingresos,Z+=re.gastos,dt+=re.total}const fo=xt-Z;H.push({mes:R,tipo:Bt&&mo?"en-curso":Bt?"real":"previsto",saldoInicial:ot(st),ingresos:ot(xt),gastos:ot(Z),neto:ot(fo),otros:ot(dt-st-fo),saldoFinal:ot(dt),...ft!==void 0&&!mo?{netoPrevisto:ot(ft),desviacion:ot(fo-ft)}:{}}),L=dt}const N=[];if(w){const R=new Map(t.gastos.map(Z=>[Z._id,Z])),Y=Z=>{if(Z.tipo==="ingreso")return"ingresos";if(Z.origen==="prestamo")return"prestamos";const dt=R.get(Z.estimacionId);return dt!=null&&dt.imprevisto?"imprevistos":dt&&Te(dt)?"facturas":"otros"},X={ingresos:"Ingresos",prestamos:"Préstamos",facturas:"Facturas",otros:"Otros gastos",imprevistos:"Imprevistos previstos",sinPrever:"Gasto sin prever"},st=new Map;for(const Z of w.filas){const dt=Y(Z),ft=st.get(dt)??{previsto:0,real:0};ft.previsto+=W(Z.estimado),ft.real+=W(Z.real),st.set(dt,ft)}st.set("sinPrever",{previsto:0,real:W(w.totalSinEstimacion)});const xt=W(w.totalIngresosSinPrever);if(xt){const Z=st.get("ingresos")??{previsto:0,real:0};Z.real+=xt,st.set("ingresos",Z)}for(const Z of["ingresos","prestamos","facturas","otros","imprevistos","sinPrever"]){const dt=st.get(Z);!dt||dt.previsto===0&&dt.real===0||N.push({grupo:Z,nombre:X[Z],previsto:ot(dt.previsto),real:ot(dt.real),desviacion:ot(dt.real-dt.previsto)})}}const k=new Map;for(const R of E)k.set(R.cuenta||"",(k.get(R.cuenta||"")??0)+W(pe(R)));const G=t.cuentas.map(R=>{const Y=u(R,s),X=i?u(R,n):Y;return{_id:R._id,nombre:R.nombre,saldoInicio:K(Y),saldoHoy:K(X),saldoFinal:ot(W(X)+(k.get(R._id)??0)),ultimoDato:g(R,n),fuente:d.has(R._id)?"movimientos":"saldo inicial"}}),B=k.get("")??0;let U=null;if(r){let R=W(x);U={saldo:x,fecha:n<e?e:n};for(const Y of[...E].sort((X,st)=>X.fecha.localeCompare(st.fecha)))R+=W(pe(Y)),ot(R)<U.saldo&&(U={saldo:ot(R),fecha:Y.fecha})}const at=[{fecha:s,real:h,...i?{previstoInicio:h}:{prevision:h}}];let ut=W(h);for(const R of H){const Y=qe(jt(R.mes),o);R.tipo==="real"?(ut+=W(R.netoPrevisto??0),at.push({fecha:Y,real:R.saldoFinal,previstoInicio:ot(ut)})):R.tipo==="en-curso"?(at.push({fecha:n,real:x,previstoInicio:_,prevision:x}),at.push({fecha:Y,prevision:R.saldoFinal})):at.push({fecha:Y,prevision:R.saldoFinal})}const lt=[...at].reverse().find(R=>R.real!==void 0);lt&&r&&lt.prevision===void 0&&(lt.prevision=lt.real);const Q=R=>R.reduce((Y,X)=>Y+(X.saldo?0:W(X.importe)),0),At=j.slice(j.findIndex(R=>R.concepto.startsWith("Saldo real hoy"))+1||1,j.findIndex(R=>R.concepto.startsWith("Saldo previsto al final"))),yt=[],Zt=(R,Y)=>Math.abs(R-Y)<=1;if(i){const R=j.slice(1,j.findIndex(Y=>Y.concepto.startsWith("Saldo real hoy")));yt.push({ok:Zt(W(h)+Q(R),W(x)),texto:"El saldo inicial más los movimientos del pasado da el saldo real de hoy."}),yt.push({ok:Zt(W((w==null?void 0:w.ingresosReales)??0),S.ingresos)&&Zt(W((w==null?void 0:w.real)??0),S.gastos),texto:"Los ingresos y gastos reales del puente son los mismos que los del cierre de mes."})}if(r&&yt.push({ok:Zt(W(x)+Q(At),W(C)),texto:"El saldo de hoy más lo previsto da el saldo final."}),t.cuadroDeMando&&r){const R=t.cuadroDeMando,Y=Zt(W(R.saldoFinal),W(C)),X=st=>`${st<0?"−":""}${T(Math.abs(st))}`;yt.push({ok:Y,texto:Y?"El saldo final coincide con el del cuadro de mando.":`El cuadro de mando prevé ${X(R.saldoFinal)} al final, ${X(R.saldoFinal-C)} de diferencia. Parte de ${X(R.saldoHoy)} como saldo de hoy y el informe de ${X(x)}, el de tus cuentas: actualiza el saldo de las cuentas en Cuentas para que coincidan.`})}const vn=H[H.length-1];if(yt.push({ok:!vn||Zt(W(vn.saldoFinal),W(C)),texto:"La tabla mes a mes acaba en el mismo saldo que el puente."}),yt.push({ok:Zt(G.reduce((R,Y)=>R+W(Y.saldoFinal),0)+B,W(C)),texto:"La suma de las cuentas da el saldo total, hoy y al final."}),w){const R=N.filter(Y=>Y.grupo!=="ingresos").reduce((Y,X)=>Y+W(X.real),0);yt.push({ok:Zt(R,W(w.real)),texto:"Los grupos de gasto suman el gasto real del pasado."})}const ie=[],Id=ce(n,-30);for(const R of G)R.ultimoDato?i&&R.ultimoDato<Id&&ie.push(`«${R.nombre}»: el último dato real es del ${R.ultimoDato}. Lo que pasó después no está en el informe.`):ie.push(`«${R.nombre}» no tiene ningún dato real: su saldo es el inicial.`);return i&&y.length===0&&ie.push("No hay movimientos registrados en el pasado del periodo: lo «real» sale solo de los saldos anotados."),w&&w.sinEstimacion.length>0&&ie.push(`${w.sinEstimacion.length} conceptos de gasto (${T(w.totalSinEstimacion)}) no están asignados a ninguna estimación. Asígnalos u omítelos en Cuentas → Cierre y precisión.`),Math.abs(z)>1e4&&ie.push("El ajuste por saldos anotados es grande: faltan movimientos por registrar o importar entre esos saldos."),S.traspasos&&Math.abs(S.traspasos)>100&&ie.push("Los traspasos entre cuentas no suman cero: probablemente falta el otro lado de alguno (una cuenta sin importar)."),{proyecto:t.proyecto,generadoEl:tt(new Date),desde:e,hasta:o,hoy:a,corte:n,tienePasado:i,tieneFuturo:r,saldoInicio:h,saldoHoy:x,saldoFinal:C,reservaImprevistos:b,saldoFinalConReserva:ot(W(C)-F),saldoHoyPrevisto:_,puente:j,meses:H,grupos:N,desviaciones:((w==null?void 0:w.filas)??[]).filter(R=>Math.abs(R.desviacion)>=.01).slice(0,10),sinPrever:((w==null?void 0:w.sinEstimacion)??[]).slice(0,10),totalSinPrever:(w==null?void 0:w.totalSinEstimacion)??0,cuentas:G,minimo:U,serie:at,comprobaciones:yt,avisos:ie,imprevistos:t.imprevistos??null,cierre:w}}const ct=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Li=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],cs=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],Et=t=>{const[a,e,o]=t.split("-").map(Number);return`${o} ${cs[e-1]} ${a}`},Oi=t=>{const[a,e]=t.split("-").map(Number);return`${Li[e-1]} ${a}`},nt=t=>ct(T(t)),$t=t=>`${t>.004?"+":t<-.004?"−":""}${ct(T(Math.abs(t)))}`,Dt=t=>t>.004?"pos":t<-.004?"neg":"",Lt={real:"#1f6fd1",previstoInicio:"#8a94a6",prevision:"#0f9d6b",hoy:"#b4232c"};function Hi(t){const a=t.serie;if(a.length<2)return"";const e=760,o=260,s={izq:70,der:16,arr:14,aba:30},n=C=>new Date(`${C}T00:00:00`).getTime(),i=n(a[0].fecha),r=n(a[a.length-1].fecha),c=a.flatMap(C=>[C.real,C.previstoInicio,C.prevision].filter($=>$!==void 0));t.minimo&&c.push(t.minimo.saldo);let l=Math.min(...c),p=Math.max(...c);const d=(p-l)*.08||Math.abs(p)*.05||1;l-=d,p+=d;const u=C=>s.izq+(n(C)-i)/Math.max(1,r-i)*(e-s.izq-s.der),v=C=>s.arr+(1-(C-l)/(p-l))*(o-s.arr-s.aba),g=(C,$)=>{const P=a.filter(b=>b[C]!==void 0);if(P.length<2)return"";const F=P.map((b,D)=>`${D?"L":"M"}${u(b.fecha).toFixed(1)},${v(b[C]).toFixed(1)}`).join(" "),M=P.map(b=>`<circle cx="${u(b.fecha).toFixed(1)}" cy="${v(b[C]).toFixed(1)}" r="3" fill="${Lt[C]}"/>`).join("");return`<path d="${F}" fill="none" stroke="${Lt[C]}" stroke-width="2" ${$}/>${M}`},h=new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",notation:"compact",maximumFractionDigits:1}),f=Array.from({length:5},(C,$)=>l+(p-l)*$/4).map(C=>`<line x1="${s.izq}" x2="${e-s.der}" y1="${v(C).toFixed(1)}" y2="${v(C).toFixed(1)}" stroke="#e6e9ef"/><text x="${s.izq-8}" y="${(v(C)+4).toFixed(1)}" text-anchor="end" class="eje">${ct(h.format(C))}</text>`).join(""),y=a.map(C=>C.fecha),S=Math.max(1,Math.ceil(y.length/8)),w=y.filter((C,$)=>$%S===0||$===y.length-1).map(C=>{const[$,P]=C.split("-").map(Number);return`<text x="${u(C).toFixed(1)}" y="${o-8}" text-anchor="middle" class="eje">${cs[P-1]} ${String($).slice(2)}</text>`}).join(""),I=t.tienePasado&&t.tieneFuturo?`<line x1="${u(t.corte).toFixed(1)}" x2="${u(t.corte).toFixed(1)}" y1="${s.arr}" y2="${o-s.aba}" stroke="${Lt.hoy}" stroke-dasharray="3 3"/><text x="${(u(t.corte)+4).toFixed(1)}" y="${s.arr+10}" class="eje" fill="${Lt.hoy}">hoy</text>`:"",E=t.minimo?`<circle cx="${u(t.minimo.fecha).toFixed(1)}" cy="${v(t.minimo.saldo).toFixed(1)}" r="5" fill="none" stroke="${Lt.hoy}" stroke-width="2"/>`:"",A=`Saldo real de ${nt(t.saldoInicio)} a ${nt(t.saldoHoy)} hoy y previsto ${nt(t.saldoFinal)} al final.`;return`<figure class="grafica">
    <svg viewBox="0 0 ${e} ${o}" role="img" aria-label="${A}">
      ${f}${w}${I}
      ${g("previstoInicio",'stroke-dasharray="2 4"')}
      ${g("real","")}
      ${g("prevision",'stroke-dasharray="7 4"')}
      ${E}
    </svg>
    <figcaption>
      <span><i style="background:${Lt.real}"></i>Saldo real</span>
      ${t.tienePasado?`<span><i class="punteada" style="border-color:${Lt.previstoInicio}"></i>Lo previsto al empezar el periodo</span>`:""}
      ${t.tieneFuturo?`<span><i class="discontinua" style="border-color:${Lt.prevision}"></i>Previsión desde hoy</span>`:""}
      ${t.minimo?'<span><i class="anillo"></i>Saldo mínimo previsto</span>':""}
    </figcaption>
  </figure>`}function Bi(t){return`<table class="puente"><tbody>${t.map(e=>e.saldo?`<tr class="saldo"><th scope="row">${ct(e.concepto)}</th><td class="num">${nt(e.importe)}</td></tr>`:`<tr><th scope="row">${ct(e.concepto)}${e.nota?`<span class="nota">${ct(e.nota)}</span>`:""}</th><td class="num ${Dt(e.importe)}">${$t(e.importe)}</td></tr>`).join("")}</tbody></table></div>`}function Gi(t){const a={real:"Real","en-curso":"Real + previsto",previsto:"Previsto"};return`<div class="tabla-ancha"><table class="datos meses">
    <thead><tr>
      <th>Mes</th><th class="num">Saldo inicial</th><th class="num">Ingresos</th><th class="num">Gastos</th>
      <th class="num">Neto</th><th class="num" title="Traspasos, saldos anotados, intereses: lo que mueve el saldo sin ser ingreso ni gasto">Otros</th>
      <th class="num">Saldo final</th><th class="num">Neto previsto</th><th class="num">Desviación</th>
    </tr></thead>
    <tbody>${t.map(o=>`<tr class="${o.tipo}">
      <th scope="row">${ct(Oi(o.mes))}<span class="nota">${a[o.tipo]}</span></th>
      <td class="num">${nt(o.saldoInicial)}</td>
      <td class="num pos">${nt(o.ingresos)}</td>
      <td class="num neg">${nt(o.gastos)}</td>
      <td class="num ${Dt(o.neto)}">${$t(o.neto)}</td>
      <td class="num tenue">${$t(o.otros)}</td>
      <td class="num fuerte">${nt(o.saldoFinal)}</td>
      <td class="num">${o.netoPrevisto!==void 0?$t(o.netoPrevisto):"—"}</td>
      <td class="num ${o.desviacion!==void 0?Dt(o.desviacion):""}">${o.desviacion!==void 0?$t(o.desviacion):"—"}</td>
    </tr>`).join("")}</tbody>
  </table></div>
  <p class="pie-tabla">En cada fila, saldo inicial + neto + otros = saldo final. «Neto previsto» y «Desviación» solo existen en los meses ya cerrados: es lo que se preveía para ese mes frente a lo que registran las cuentas.</p>`}function Vi(t){if(!t.tienePasado||!t.cierre)return"";const a=t.cierre,e=t.saldoHoy-t.saldoHoyPrevisto,o=t.grupos.map(i=>`<tr><th scope="row">${ct(i.nombre)}</th><td class="num">${nt(i.previsto)}</td><td class="num">${nt(i.real)}</td>
      <td class="num ${i.grupo==="ingresos"?Dt(i.desviacion):Dt(-i.desviacion)}">${$t(i.desviacion)}</td></tr>`).join(""),s=t.desviaciones.map(i=>`<tr><th scope="row">${ct(i.concepto)}<span class="nota">${ct(i.periodicidad)}${i.sinMovimiento?" · sin ningún movimiento":""}</span></th>
      <td class="num">${nt(i.estimado)}</td><td class="num">${nt(i.real)}</td>
      <td class="num ${i.tipo==="ingreso"?Dt(i.desviacion):Dt(-i.desviacion)}">${$t(i.desviacion)}</td></tr>`).join(""),n=t.sinPrever.map(i=>`<tr><th scope="row">${ct(i.concepto)}</th><td class="num">${i.movimientos}</td><td class="num">${nt(i.total)}</td></tr>`).join("");return`<section>
    <h2>2 · El pasado: lo previsto frente a lo real</h2>
    <p class="intro">Del ${ct(Et(t.desde))} al ${ct(Et(t.corte))}. Lo previsto son tus estimaciones, nóminas y cuotas de préstamo; lo real, lo que registran tus cuentas. Es el mismo cálculo que Cuentas → Cierre y precisión.</p>
    <div class="cifras">
      <div><span>Debías tener hoy</span><strong>${nt(t.saldoHoyPrevisto)}</strong><em>saldo inicial + neto previsto</em></div>
      <div><span>Tienes hoy</span><strong>${nt(t.saldoHoy)}</strong><em>según tus cuentas</em></div>
      <div class="${Dt(e)}"><span>Diferencia</span><strong>${$t(e)}</strong><em>${e>=0?"mejor de lo previsto":"peor de lo previsto"}</em></div>
    </div>
    ${Math.abs(e-a.desviacionNeta)>=.01?`<p class="pie-tabla">De esa diferencia, ${$t(a.desviacionNeta)} es lo que se ingresó y gastó distinto de lo previsto (la tabla de abajo) y ${$t(e-a.desviacionNeta)} es lo que mueve el saldo sin ser ingreso ni gasto: traspasos, conceptos omitidos y saldos anotados (ver el puente).</p>`:""}
    <div class="tabla-ancha"><table class="datos"><thead><tr><th>Grupo</th><th class="num">Previsto</th><th class="num">Real</th><th class="num">Diferencia</th></tr></thead>
      <tbody>${o}</tbody>
      <tfoot><tr><th scope="row">Neto (ingresos − gastos)</th><td class="num">${$t(a.netoEstimado)}</td><td class="num">${$t(a.netoReal)}</td><td class="num ${Dt(a.desviacionNeta)}">${$t(a.desviacionNeta)}</td></tr></tfoot>
    </table></div>
    <p class="pie-tabla">En los gastos, una diferencia en rojo es gasto de más; en los ingresos, ha entrado menos. «Gasto sin prever» es lo que se pagó sin ninguna estimación que lo cubriera.</p>
    ${s?`<h3>Las estimaciones que más se desviaron</h3><div class="tabla-ancha"><table class="datos"><thead><tr><th>Estimación</th><th class="num">Previsto</th><th class="num">Real</th><th class="num">Diferencia</th></tr></thead><tbody>${s}</tbody></table></div>`:""}
    ${n?`<h3>Gasto sin prever · ${nt(t.totalSinPrever)}</h3><div class="tabla-ancha"><table class="datos"><thead><tr><th>Concepto</th><th class="num">Movimientos</th><th class="num">Total</th></tr></thead><tbody>${n}</tbody></table></div>`:""}
  </section>`}function Ui(t){return`<section>
    <h2>4 · Cuentas</h2>
    <div class="tabla-ancha"><table class="datos"><thead><tr><th>Cuenta</th><th class="num">Al empezar</th><th class="num">Hoy</th><th class="num">Variación</th><th class="num">Al final (previsto)</th><th>Último dato real</th></tr></thead>
      <tbody>${t.cuentas.map(e=>`<tr><th scope="row">${ct(e.nombre)}<span class="nota">${e.fuente==="movimientos"?"según movimientos y saldos anotados":"sin movimientos: saldo inicial"}</span></th>
      <td class="num">${nt(e.saldoInicio)}</td><td class="num">${nt(e.saldoHoy)}</td>
      <td class="num ${Dt(e.saldoHoy-e.saldoInicio)}">${$t(e.saldoHoy-e.saldoInicio)}</td>
      <td class="num">${t.tieneFuturo?nt(e.saldoFinal):"—"}</td>
      <td>${e.ultimoDato?ct(Et(e.ultimoDato)):"—"}</td></tr>`).join("")}</tbody>
      <tfoot><tr><th scope="row">Total</th><td class="num">${nt(t.saldoInicio)}</td><td class="num">${nt(t.saldoHoy)}</td><td class="num ${Dt(t.saldoHoy-t.saldoInicio)}">${$t(t.saldoHoy-t.saldoInicio)}</td><td class="num">${t.tieneFuturo?nt(t.saldoFinal):"—"}</td><td></td></tr></tfoot>
    </table>
  </section>`}function Yi(t){const a=`Informe · ${t.proyecto} · ${Et(t.desde)} – ${Et(t.hasta)}`,e=t.comprobaciones.map(n=>`<li class="${n.ok?"ok":"mal"}"><span aria-hidden="true">${n.ok?"✓":"✗"}</span> ${ct(n.texto)}${n.ok?"":" <strong>No cuadra.</strong>"}</li>`).join(""),o=t.avisos.map(n=>`<li>${ct(n)}</li>`).join(""),s=t.tieneFuturo?`<div><span>Previsto al final</span><strong>${nt(t.saldoFinal)}</strong><em>${ct(Et(t.hasta))}</em></div>
       ${t.reservaImprevistos>0?`<div><span>Con reserva para imprevistos</span><strong>${nt(t.saldoFinalConReserva)}</strong><em>reservando ${nt(t.reservaImprevistos)}</em></div>`:""}
       ${t.minimo?`<div class="${t.minimo.saldo<0?"neg":""}"><span>Saldo mínimo previsto</span><strong>${nt(t.minimo.saldo)}</strong><em>${ct(Et(t.minimo.fecha))}</em></div>`:""}`:"";return`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${ct(a)}</title>
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
  figcaption i.anillo { width: 10px; height: 10px; border: 2px solid ${Lt.hoy}; border-radius: 50%; }
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
    <h1>Informe financiero · ${ct(t.proyecto)}</h1>
    <p>Del ${ct(Et(t.desde))} al ${ct(Et(t.hasta))} · ${t.tienePasado&&t.tieneFuturo?`pasado real hasta el ${ct(Et(t.corte))}, previsión desde entonces`:t.tieneFuturo?"todo el periodo es previsión":"todo el periodo es pasado real"} · generado el ${ct(Et(t.generadoEl))}</p>
  </header>

  <section>
    <h2 style="border-top:0;margin-top:0">1 · Resumen: del saldo inicial al final</h2>
    <div class="cifras">
      <div><span>Saldo al empezar</span><strong>${nt(t.saldoInicio)}</strong><em>real</em></div>
      ${t.tienePasado?`<div><span>Saldo hoy</span><strong>${nt(t.saldoHoy)}</strong><em>real · ${ct(Et(t.corte))}</em></div>`:""}
      ${s}
    </div>
    ${Hi(t)}
    <h3>El puente de saldo</h3>
    <p class="intro">Cada línea suma a la anterior. El pasado sale de tus cuentas reales; el futuro, de tus estimaciones, nóminas y préstamos. El saldo real de hoy cierra uno y abre el otro.</p>
    ${Bi(t.puente)}
  </section>

  ${Vi(t)}

  <section>
    <h2>3 · Mes a mes</h2>
    ${Gi(t.meses)}
  </section>

  ${Ui(t)}

  <section>
    <h2>5 · Comprobaciones</h2>
    <ul class="comprobaciones">${e}</ul>
    ${o?`<h3>A tener en cuenta</h3><ul class="avisos">${o}</ul>`:""}
  </section>

  <footer>Generado con FinanceApp. Las cifras previstas son estimaciones: dependen de los gastos, nóminas y préstamos que tengas dados de alta.${t.imprevistos&&t.imprevistos.meses>0?` La reserva para imprevistos usa la media de lo marcado como imprevisto en ${t.imprevistos.meses} meses (${nt(t.imprevistos.mediaMensual)}/mes).`:""}</footer>
</main>
</body>
</html>`}function Wi(t,a,e){const o=t||[];if(!o.length)return a;const s=o.find(i=>i.año===e);if(s)return s.tramos;const n=o.filter(i=>i.año<e).sort((i,r)=>r.año-i.año);return n.length?n[0].tramos:a}function me(t,a){return e=>Wi(t,a,e)}const ee=11,ls=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],ds=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Ra(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const us="default";function ps(){return{_id:us,nombre:"Yo",esPorDefecto:!0,activo:!0}}function ka(t,a){return{dashboardStart:t,dashboardEnd:a,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:ls,tramosGananciasCapital:ds,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],cierreOmitidos:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function La(t,a){return{loans:[],expenses:[],accounts:[Ra(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[ps()],config:ka(t,a)}}const qt=t=>Array.isArray(t)?t:[],Ki=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function Ne(t){if(Array.isArray(t.escenarioIds))return t;const a=t.escenarioId?[t.escenarioId]:[],{escenarioId:e,...o}=t;return{...o,escenarioIds:a}}function ms(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const a=parseInt(t);return isNaN(a)?"":`dia:${a}`}function Oa(t){const{varianza:a,inflacion:e,...o}=t;return o}function Ji(t,a){const{hoyISO:e,finISO:o}=a,s={...t},n=Ki(t.config),r={...ka(e,o)};for(const[p,d]of Object.entries(n))d!=null&&(r[p]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=ls),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=ds),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),s.config=r;let c=qt(t.accounts).map(p=>{const d={saldoInicial:0,fechaInicialSaldo:e,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...p};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),Ne(d)});c.length===0&&(c=[Ra(e)]);const l=c.filter(p=>p.esCuentaPrincipal);if(l.length===0){const p=c.find(d=>d._id==="default")||c[0];c=c.map(d=>({...d,esCuentaPrincipal:d._id===p._id}))}else if(l.length>1){let p=!1;c=c.map(d=>d.esCuentaPrincipal?p?{...d,esCuentaPrincipal:!1}:(p=!0,d):d)}return s.accounts=c,s.expenses=qt(t.expenses).map(p=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...p};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=ms(d.diaPago),Oa(Ne(d))}),s.loans=qt(t.loans).map(p=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...p};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=ms(d.diaPago),d.amortizaciones=qt(d.amortizaciones).map(u=>Ne(u)),Oa(Ne(d))}),s.nominas=qt(t.nominas).map(p=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...p};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),Oa(Ne(d))}),s.goals=qt(t.goals).map((p,d)=>{const u=Array.isArray(p.cuentaIds)?p.cuentaIds:p.cuentaId?[p.cuentaId]:[],{cuentaId:v,...g}=p;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...g,cuentaIds:u}}),s.inflacion=qt(t.inflacion),s.tramosIRPFHistorico=qt(t.tramosIRPFHistorico),s.tramosGananciasCapitalHistorico=qt(t.tramosGananciasCapitalHistorico),s.escenarios=qt(t.escenarios).map(({inversiones:p,...d})=>d),s}const fe=t=>Array.isArray(t)?t:[];let Ha=0;function Qi(t){return Ha+=1,`${t}_${Ha.toString(36)}`}const Xi=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),Zi=t=>typeof t=="number"&&Number.isFinite(t);function tr(t,a){const e={...t};Ha=0;const o=fe(t.transacciones),s=fe(t.puntosControl),n=[...s],i=new Set(s.map(l=>`${l.cuentaId}|${l.fecha}`)),r=(l,p,d,u)=>{if(!Xi(p)||!Zi(d))return;const v=`${l}|${p}`;i.has(v)||(i.add(v),n.push({_id:Qi("pc"),fecha:p,cuentaId:l,saldoCts:Pt(d),...typeof u=="string"&&u?{nota:u}:{}}))};for(const l of fe(t.accounts)){const p=typeof l._id=="string"?l._id:null;if(p)for(const d of fe(l.historicoSaldos))r(p,d.fecha,d.saldo,d.nota)}const c=fe(t.history);if(c.length>0){const l=fe(t.accounts),p=l.find(u=>u.esCuentaPrincipal)||l.find(u=>u.activo)||l[0],d=typeof(p==null?void 0:p._id)=="string"?p._id:"default";for(const u of c){const v=typeof u.cuenta=="string"?u.cuenta:typeof u.cuentaId=="string"?u.cuentaId:d;r(v,u.fecha,u.saldo,u.nota)}}return delete e.history,e.transacciones=o,e.puntosControl=n.sort((l,p)=>String(l.fecha).localeCompare(String(p.fecha))),e}const Ba=t=>Array.isArray(t)?t:[],er=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),ar=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Ga=0;function or(){return Ga+=1,`tx_hp_${Ga.toString(36)}`}function sr(t,a){const e={...t};Ga=0;const o=[...Ba(t.transacciones)],s=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),n=Ba(t.expenses).map(i=>{const r=Ba(i.historialPrecios),c=typeof i._id=="string"?i._id:null,l=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",p=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(g=>typeof g=="string"):[];if(c)for(const g of r){if(!g||!er(g.fecha)||!ar(g.cuantia))continue;const h=p==="ingreso"?Pt(g.cuantia):-Pt(g.cuantia),x=`${c}|${g.fecha}|${h}`;s.has(x)||(s.add(x),o.push({_id:or(),fecha:g.fecha,cuentaId:l,importeCts:h,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:c,tipo:p,origen:"importado",nota:typeof g.nota=="string"&&g.nota?g.nota:"Importado del historial de precios"}))}const{historialPrecios:u,...v}=i;return v});return e.expenses=n,e.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),e}const fs=t=>Array.isArray(t)?t:[],Qt=(t,a="")=>typeof t=="string"&&t.trim()?t:a,ge=(t,a=0)=>typeof t=="number"&&Number.isFinite(t)?t:a,nr=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function ir(t,a){var p;const e={...t};if(Array.isArray(e.planes))return e;const o=fs(e.goals),s=fs(e.accounts),n=s.map(d=>{const u=ge(d.bloqueoMeses,0);return{_id:`veh_${Qt(d._id,"x")}`,nombre:Qt(d.nombre,"Cuenta"),rentabilidadRealAnual:ge(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":u>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:ge(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?Pt(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:Qt(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:ge(d.interes,0)>0}}),i=new Map(s.map((d,u)=>[Qt(d._id,""),n[u]._id])),r=((p=n[0])==null?void 0:p._id)??"",c=o.map((d,u)=>{const v=Array.isArray(d.cuentaIds)?d.cuentaIds.map(h=>Qt(h,"")):[],g=nr(d.targetDate);return{_id:Qt(d._id,`obj_mig_${u}`),nombre:Qt(d.nombre,`Objetivo ${u+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:Pt(ge(d.targetAmount,0)),fechaLimite:g,prioridad:ge(d.prioridad,u+1),modoAsignacion:g?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:Qt(d.notas,"")}}),l={_id:"plan_base",nombre:"Plan base",fechaInicio:a.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:n,objetivos:c,eventos:[],creadoEn:a.hoyISO};return e.planes=[l],e}function rr(t,a){const e={...t},o=Array.isArray(e.personas)?e.personas:[];return o.some(s=>(s==null?void 0:s._id)===us)||(e.personas=[ps(),...o]),e}const Re=t=>Array.isArray(t)?t:[];function ia(t){const{escenarioIds:a,...e}=t;return Array.isArray(e.amortizaciones)&&(e.amortizaciones=e.amortizaciones.map(o=>{const{escenarioIds:s,...n}=o;return n})),e}function cr(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function lr(t,a){const e={...t};if(e.escenarios===void 0&&e.planes===void 0&&e.goals===void 0)return e;if(e.loans=Re(e.loans).map(ia),e.expenses=Re(e.expenses).map(ia),e.nominas=Re(e.nominas).map(ia),e.accounts=Re(e.accounts).map(ia),delete e.escenarios,e.config&&typeof e.config=="object"){const{escenarioActivo:s,...n}=e.config;e.config=n}delete e.goals;const o=Re(e.planes).filter(cr);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),e._migracion010_planesArchivados=o),delete e.planes,e}const gs="supuesto-archivado",ve=t=>Array.isArray(t)?t:[],vs=t=>Array.isArray(t.escenarioIds)&&t.escenarioIds.length>0;function dr(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function ur(t,a){const e={...t};let o=0;const s=[],n=c=>{const{escenarioIds:l,...p}=c;if(!vs(c))return p;o+=1;const d=Array.isArray(p.tags)?p.tags:[];return{...p,activo:!1,tags:d.includes(gs)?d:[...d,gs]}};e.expenses=ve(e.expenses).map(n),e.nominas=ve(e.nominas).map(n),e.accounts=ve(e.accounts).map(c=>{if(c._id==="default"||c.esCuentaPrincipal){const{escenarioIds:l,...p}=c;return p}return n(c)}),e.loans=ve(e.loans).map(c=>{const l=n(c);if(Array.isArray(l.amortizaciones)){const p=[];for(const d of l.amortizaciones){const{escenarioIds:u,...v}=d;vs(d)?s.push({...v,loanId:String(c._id??""),loanNombre:c.nombre}):p.push(v)}l.amortizaciones=p}return l});const i=[...ve(e._migracion010_planesArchivados),...ve(e.planes).filter(dr)];delete e._migracion010_planesArchivados,delete e.planes,delete e.goals,delete e.escenarios;const r=e.config&&typeof e.config=="object"?{...e.config}:{};if(delete r.escenarioActivo,i.length>0||s.length>0||o>0){const c=r.archivoMigracion011??{},l={planes:[...c.planes??[],...i],amortizaciones:[...c.amortizaciones??[],...s],desactivados:(c.desactivados??0)+o};r.archivoMigracion011=l}return(e.config!==void 0||r.archivoMigracion011)&&(e.config=r),e}const pr=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:Ji},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:tr},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:sr},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:ir},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:rr},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:lr},{version:11,describe:"Termina la 010: desactiva lo que solo existía en un supuesto, archiva planes y retira las claves huérfanas",migrate:ur}],bs=["history","escenarios","planes","goals"],mr=["escenarios","planes","goals"];function hs(t,a,e){let o=t;const s=[];for(const n of[...pr].sort((i,r)=>i.version-r.version))(a??0)>=n.version||(o=n.migrate(o,e),s.push(n.version));return{state:o,applied:s}}const Tt="state_",ke="state__schemaVersion",be="financeapp_",Va="state__modificadoEn",ys="financeapp:sin-espacio";function fr(){try{typeof window<"u"&&window.dispatchEvent(new CustomEvent(ys))}catch{}}function $s(t=localStorage,a=be){const e=o=>`${a}${o}`;return{get(o){try{const s=t.getItem(e(o));return s===null?null:JSON.parse(s)}catch{return null}},set(o,s){try{t.setItem(e(o),JSON.stringify(s)),o!==Va&&t.setItem(e(Va),JSON.stringify(Date.now()))}catch(n){console.error("No se pudo guardar en localStorage:",o,n),fr()}},remove(o){try{t.removeItem(e(o))}catch{}},keys(){const o=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(a)&&o.push(n.slice(a.length))}return o}}}function gr(t=localStorage,a=be){const e=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(Tt)&&!n.startsWith(a)&&e.push(n)}const o=[];for(const s of e)try{const n=t.getItem(s);n!==null&&t.getItem(`${a}${s}`)===null&&(t.setItem(`${a}${s}`,n),o.push(s)),t.removeItem(s)}catch{}return o}function vr({ventanaMs:t=15e3,ahora:a=()=>Date.now()}={}){let e=null;function o(){return e?a()-e.cuando>t?(e=null,null):e:null}return{registrar(s){e={...s,cuando:a()}},pendiente:o,tomar(){const s=o();return e=null,s},limpiar(){e=null}}}const br={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function hr(t,a){const e=br[t]??{articulo:"El",que:"elemento"},o=a.concepto??a.nombre??a.titulo??(a.year!==void 0?String(a.year):null);return o?`${e.articulo} ${e.que} «${String(o)}»`:`${e.articulo} ${e.que}`}function yr(t){return tt(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function $r({adapter:t,hoy:a=new Date}){const e=tt(a),o=yr(a);let s=La(e,o);const n=new Set;let i=[];const r=vr();function c(b){for(const D of n)D(b)}function l(b){t.set(`${Tt}${b}`,s[b])}function p(){const b={};for(const j of Object.keys(s)){const H=t.get(`${Tt}${j}`);H!==null&&(b[j]=H)}for(const j of bs){const H=t.get(`${Tt}${j}`);H!==null&&(b[j]=H)}const D=t.get(ke),{state:_,applied:z}=hs(b,D,{hoyISO:e,finISO:o});if(s=d(_),u(),z.length>0){for(const j of Object.keys(s))l(j);t.set(ke,ee);for(const j of mr)t.remove(`${Tt}${j}`)}return i=z,{applied:z}}function d(b){const D=La(e,o),_={...D,...b};for(const j of Object.keys(D))j!=="config"&&(Array.isArray(_[j])||(_[j]=D[j]));const z=b.config&&typeof b.config=="object"?b.config:{};return _.config={...ka(e,o),...z},_}function u(){if(!Array.isArray(s.accounts)||s.accounts.length===0){s.accounts=[Ra(e)],l("accounts");return}const b=s.accounts.filter(D=>D.esCuentaPrincipal);if(b.length===0)s.accounts=s.accounts.map((D,_)=>_===0?{...D,esCuentaPrincipal:!0}:D),l("accounts");else if(b.length>1){let D=!1;s.accounts=s.accounts.map(_=>_.esCuentaPrincipal?D?{..._,esCuentaPrincipal:!1}:(D=!0,_):_),l("accounts")}}function v(b){return s[b]}function g(b,D){s[b]=D,l(b),c(b)}function h(b){g("config",{...s.config,...b})}function x(b){return n.add(b),()=>n.delete(b)}function f(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function y(b,D){const _=[...s[b]],z={...D,_id:f()};return _.push(z),g(b,_),z}function S(b,D,_){const z=s[b].map(j=>j._id===D?{...j,..._}:j);g(b,z)}function w(b,D){const _=s[b],z=_.findIndex(j=>j._id===D);z<0||(r.registrar({col:b,item:_[z],indice:z}),g(b,_.filter((j,H)=>H!==z)))}function I(){const b=r.tomar();if(!b)return null;const D=[...s[b.col]];return D.splice(Math.min(b.indice,D.length),0,b.item),g(b.col,D),b}function E(){return r.pendiente()}function A(){const b=s.accounts||[],D=b.find(_=>_.esCuentaPrincipal&&_.activo)||b.find(_=>_.activo);return D?D._id:"default"}function C(b){var D;return((D=s.accounts.find(_=>_._id===b))==null?void 0:D.nombre)??b}function $(){return me(s.tramosIRPFHistorico,s.config.tramos_irpf)}function P(){return me(s.tramosGananciasCapitalHistorico,s.config.tramosGananciasCapital)}function F(){return structuredClone(s)}function M(b,D=null){const{state:_,applied:z}=hs(b,D,{hoyISO:e,finISO:o});s=d(_),u();for(const j of Object.keys(s))l(j);t.set(ke,ee);for(const j of Object.keys(s))c(j);return{applied:z}}return{load:p,get:v,set:g,patchConfig:h,subscribe:x,addItem:y,updateItem:S,removeItem:w,deshacerBorrado:I,borradoPendiente:E,getPrincipalAccountId:A,accountName:C,resolverTramosIRPF:$,resolverTramosGanancias:P,snapshot:F,replaceAll:M,get schemaVersion(){return ee},get migrationsApplied(){return[...i]},get today(){return e||et()}}}function xr(){let t=0,a=null;const e=new Set;function o(s){t+=1,a=s;for(const n of e)try{n(t,s)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>a,marcar:o,suscribir(s){return e.add(s),()=>e.delete(s)},crearMarca(s){let n=t;return{nombre:s,pendiente:()=>t>n,alDia:i=>{n=Math.max(n,i??t)},vista:()=>n}}}}const ae=Object.keys(La("1970-01-01","1970-01-01"));function xs(t){const a={};for(const e of ae){const o=t.get(`${Tt}${e}`);o!=null&&(a[e]=o)}return a}function Ir(t,a){const e=[];for(const o of ae){const s=a[o];s!=null&&(t(`${Tt}${o}`,s),e.push(o))}return e}function wr(t){return ae.filter(a=>t[a]===void 0||t[a]===null)}function Cr(t){var i;const a=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!ae.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>a(r).length===0))return!1;const o=a("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?a("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const Is="_schemaVersion";function Sr(t,a){const e=t[Is];if(typeof e=="number"&&Number.isFinite(e))return Math.min(e,a);const o=r=>Array.isArray(t[r])?t[r]:[],s=t.config&&typeof t.config=="object"?t.config:null;if(s&&s.features===void 0)return 4;if(t.transacciones===void 0&&t.expenses!==void 0)return 5;if(o("expenses").some(r=>Array.isArray(r.historialPrecios)&&r.historialPrecios.length>0))return 6;if(t.personas===void 0&&t.expenses!==void 0)return 8;const n=r=>r.some(c=>Array.isArray(c.escenarioIds)&&c.escenarioIds.length>0);return t.escenarios!==void 0||t.planes!==void 0||t.goals!==void 0||n(o("expenses"))||n(o("loans"))||n(o("nominas"))||n(o("accounts"))||o("loans").some(r=>n(Array.isArray(r.amortizaciones)?r.amortizaciones:[]))?Math.min(10,a):a}const ws=`${be}meta_proyectos`,Cs=`${be}meta_proyectoActivo`,oe="default",Mr="Mis finanzas";function Ua(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function he(t){return t===oe?be:`${be}p_${t}_`}function Ss(){return[...ae.map(t=>`${Tt}${t}`),ke,Va]}function Ar(t=localStorage){function a(){try{const d=t.getItem(ws);if(!d)return[];const u=JSON.parse(d);return Array.isArray(u)?u:[]}catch{return[]}}function e(d){t.setItem(ws,JSON.stringify(d))}function o(){const d=a();if(d.some(g=>g._id===oe))return d;const u=Date.now(),v=[{_id:oe,nombre:Mr,creadoEn:u,actualizadoEn:u},...d];return e(v),v}function s(){try{const d=t.getItem(Cs);if(!d)return oe;const u=JSON.parse(d);return typeof u=="string"&&u?u:oe}catch{return oe}}function n(d){t.setItem(Cs,JSON.stringify(d))}function i(d){const u=d.trim()||"Proyecto sin nombre",v=Date.now(),g={_id:Ua(),nombre:u,creadoEn:v,actualizadoEn:v};return e([...o(),g]),g}function r(d,u){const v=u.trim();v&&e(o().map(g=>g._id===d?{...g,nombre:v,actualizadoEn:Date.now()}:g))}function c(d,u){const v=o().find(f=>f._id===d);if(!v)throw new Error("Proyecto no encontrado.");const g=he(d),h={_id:Ua(),nombre:(u==null?void 0:u.trim())||`${v.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},x=he(h._id);for(const f of Ss()){const y=t.getItem(`${g}${f}`);y!==null&&t.setItem(`${x}${f}`,y)}return e([...o(),h]),h}function l(d){if(d===oe)throw new Error("No se puede eliminar el proyecto original.");if(d===s())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const u=o();if(!u.some(g=>g._id===d))return;const v=he(d);for(const g of Ss())t.removeItem(`${v}${g}`);e(u.filter(g=>g._id!==d))}function p(d){const u=new Map(o().map(g=>[g._id,g]));for(const g of d){if(!g||typeof g._id!="string")continue;const h=u.get(g._id);(!h||(g.actualizadoEn??0)>h.actualizadoEn)&&u.set(g._id,g)}const v=[...u.values()];return e(v),v}return{listar:o,activo:s,establecerActivo:n,crear:i,renombrar:r,duplicar:c,eliminar:l,fusionarRemotos:p}}function Er(t,a,e){const o=$s(t,he(a)),s={};for(const n of e){const i=o.get(`${Tt}${n}`);s[n]=Array.isArray(i)?i:[]}return s}function Pr(t){const a=new Map;for(const s of Object.values(t))for(const n of s){const i=n==null?void 0:n._id;typeof i=="string"&&!a.has(i)&&a.set(i,Ua())}function e(s){if(typeof s=="string")return a.get(s)??s;if(Array.isArray(s))return s.map(e);if(s&&typeof s=="object"){const n={};for(const[i,r]of Object.entries(s))n[i]=e(r);return n}return s}const o={};for(const[s,n]of Object.entries(t))o[s]=n.map(e);return o}const Mt={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},Xt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:Mt.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:Mt.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:Mt.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:Mt.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:Mt.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:Mt.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:Mt.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:Mt.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:Mt.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:Mt.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:Mt.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:Mt.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:Mt.datos,porDefecto:!1,dependencias:["sync-nube"]}],_r=new Map(Xt.map(t=>[t.id,t]));function Le(t){return _r.get(t)}function Ms(t){return Xt.filter(a=>(a.dependencias||[]).includes(t))}function Ya(){const t={};for(const a of Xt)t[a.id]=a.porDefecto;return t}function As(){const t=[],a=new Map;for(const e of Xt)a.has(e.grupo)||(a.set(e.grupo,[]),t.push(e.grupo)),a.get(e.grupo).push(e);return t.map(e=>({grupo:e,features:a.get(e)}))}function Fr(t){function a(){return{...Ya(),...t.get("config").features||{}}}function e(d){t.patchConfig({features:d})}function o(d,u=a(),v=new Set){const g=Le(d);if(!g)return!1;if(g.nucleo)return!0;if(u[d]===!1)return!1;if(v.has(d))return!0;v.add(d);for(const h of g.dependencias||[])if(!o(h,u,v))return!1;return!0}function s(d,u=a()){const v=Le(d);return v?(v.dependencias||[]).filter(g=>!o(g,u)):[]}function n(d,u){var S;const v=Le(d);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const g=a(),h=new Map(Xt.map(w=>[w.id,o(w.id,g)])),x={...g,[d]:u};let f;if(u){const w=[...v.dependencias||[]];for(;w.length;){const I=w.pop();x[I]===!1&&(x[I]=!0,f="dependencias-activadas"),w.push(...((S=Le(I))==null?void 0:S.dependencias)||[])}}else{const w=Ms(d).map(I=>I.id);for(;w.length;){const I=w.pop();x[I]!==!1&&(x[I]=!1,f="cascada-apagado"),w.push(...Ms(I).map(E=>E.id))}}return e(x),{cambiadas:Xt.filter(w=>o(w.id,x)!==h.get(w.id)).map(w=>w.id),motivo:f}}function i(){const d=a();return Xt.map(u=>{const v=s(u.id,d);return{...u,activa:o(u.id,d),...v.length>0&&d[u.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const d=a();return As().map(({grupo:u,features:v})=>({grupo:u,features:v.map(g=>{const h=s(g.id,d);return{...g,activa:o(g.id,d),...h.length>0&&d[g.id]!==!1?{bloqueadaPor:h}:{}}})}))}function c(){e(Ya())}function l(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:a()}}function p(d){const u=d,v=u&&typeof u=="object"&&u.features&&typeof u.features=="object"?u.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const g=Ya(),h=[],x=[];for(const[f,y]of Object.entries(v)){if(!Le(f)){x.push(f);continue}if(typeof y!="boolean"){x.push(f);continue}g[f]=y,h.push(f)}return e(g),{aplicadas:h,ignoradas:x}}return{isEnabled:d=>o(d),setEnabled:n,estado:i,estadoPorGrupo:r,reset:c,exportProfile:l,importProfile:p,bloqueadaPor:d=>s(d)}}const Oe=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function ye(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Dr(t){var s,n;const e=(((s=t.bloqueadaPor)==null?void 0:s.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(n=t.bloqueadaPor)==null?void 0:n.map(Oe).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
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
    </div>`}function Tr(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:s})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${Oe(o)}</div>
        ${s.map(Dr).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function zr(t){var s;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e,cerrar:()=>a.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-feature-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function jr(t){const a=t.document??document,{flags:e}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Tr(e)}`,s(i)}function s(i){var c,l,p;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var g;const u=d.dataset.featureToggle,v=e.setEnabled(u,d.checked);v.motivo==="dependencias-activadas"&&ye(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&ye(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(g=t.onChange)==null||g.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const d=e.exportProfile(),u=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),v=URL.createObjectURL(u),g=a.createElement("a");g.href=v,g.download=`financeapp-funcionalidades-${et()}.json`,g.click(),URL.revokeObjectURL(v),ye(t,"Perfil de funcionalidades guardado")}),(l=i.querySelector('[data-feature-action="import"]'))==null||l.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var u,v;const d=(u=r.files)==null?void 0:u[0];if(d)try{const{aplicadas:g,ignoradas:h}=e.importProfile(JSON.parse(await d.text()));ye(t,h.length>0?`Perfil cargado (${g.length} aplicadas, ${h.length} ignoradas por ser de otra versión)`:`Perfil cargado (${g.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,g),o(i)}catch(g){ye(t,"No se pudo cargar el perfil: "+g.message,"err")}finally{r.value=""}}),(p=i.querySelector('[data-feature-action="reset"]'))==null||p.addEventListener("click",()=>{var d;e.reset(),ye(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function n(){const i=zr(a);o(i.content),i.overlay.classList.remove("hidden")}return{open:n,renderInto:o}}const Nt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),qr={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function Es(t){return qr[t]??t}function Ot(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Ps(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function Nr(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function Rr(){var a,e,o,s;const t=globalThis;(e=(a=t.State)==null?void 0:a.load)==null||e.call(a),(s=(o=t.Router)==null?void 0:o.rerender)==null||s.call(o)}function kr(t){var s;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-proyectos-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function Lr(t,a){const e=t._id===a,o=t._id==="default";return`
    <div class="dm-section" data-proyecto-fila="${Nt(t._id)}" style="padding:12px 15px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${Nt(t.nombre)}
        </div>
        ${e?'<span class="dm-badge dm-badge--local">Activo</span>':""}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${e?"":`<button class="btn-primary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="cambiar" data-proyecto-id="${Nt(t._id)}">Cambiar a este</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="renombrar" data-proyecto-id="${Nt(t._id)}">Renombrar</button>
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="duplicar" data-proyecto-id="${Nt(t._id)}">Duplicar</button>
        ${o||e?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-proyecto-accion="eliminar" data-proyecto-id="${Nt(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Or(t,a,e){const o=t.filter(i=>i._id!==a);if(o.length===0)return"";const s=o.map(i=>`<option value="${Nt(i._id)}">${Nt(i.nombre)}</option>`).join(""),n=e.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${Nt(i)}"/> ${Nt(Es(i))}
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
    </div>`}function Hr(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function Br(t){const a=t.document??document,{proyectos:e}=t;function o(){const r=e.listar(),c=e.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(l=>Lr(l,c)).join("")}
      </div>
      ${Hr()}
      ${Or(r,c,e.colecciones)}`}function s(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,n(r)}function n(r){var c,l;r.querySelectorAll("[data-proyecto-accion]").forEach(p=>{p.addEventListener("click",()=>{const d=p.dataset.proyectoId,u=p.dataset.proyectoAccion,v=e.listar().find(g=>g._id===d);if(v){if(u==="cambiar"){if(!Ps(t,`¿Cambiar a "${v.nombre}"? Se recargará la página.`))return;e.cambiarA(d),Nr(t);return}if(u==="renombrar"){const g=typeof prompt=="function"?prompt("Nuevo nombre",v.nombre):null;if(!g||!g.trim())return;e.renombrar(d,g.trim()),Ot(t,"Proyecto renombrado"),s(r);return}if(u==="duplicar"){const g=`${v.nombre} (copia)`,h=typeof prompt=="function"?prompt("Nombre de la copia",g):g;if(h===null)return;const x=e.duplicar(d,h.trim()||g);Ot(t,`"${x.nombre}" creado como copia de "${v.nombre}" ✓`),s(r);return}if(u==="eliminar"){if(!Ps(t,`¿Eliminar "${v.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{e.eliminar(d),Ot(t,`"${v.nombre}" eliminado`),s(r)}catch(g){Ot(t,g.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const p=r.querySelector("#proyecto-nuevo-nombre"),d=p==null?void 0:p.value.trim();if(!d){Ot(t,"Ponle un nombre al proyecto","warn");return}const u=e.crear(d);Ot(t,`"${u.nombre}" creado ✓`),s(r)}),(l=r.querySelector("#proyecto-import-btn"))==null||l.addEventListener("click",()=>{var v;const p=(v=r.querySelector("#proyecto-import-origen"))==null?void 0:v.value;if(!p)return;const d=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(g=>g.dataset.proyectoImportCol);if(d.length===0){Ot(t,"Elige al menos una colección para importar","warn");return}const{importadas:u}=e.importarDesde(p,d);if(u.length===0){Ot(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}Ot(t,`Importado: ${u.map(Es).join(", ")} ✓`),Rr(),s(r)})}function i(){const r=kr(a);s(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:s}}const ra=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],se=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function $e(t,a,e="ok"){if(t.notify)return t.notify(a,e);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(a,e);console.info("[FinanceApp]",a)}function Gr(t,a){if(t.confirmar)return t.confirmar(a);const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(a):typeof confirm=="function"?confirm(a):!0}function Vr(t){var s;const a=t.getElementById("modal-overlay"),e=t.getElementById("modal-content");if(a&&e)return{overlay:a,content:e};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-personas-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function Ur(t){const a=t.color||ra[0];return`
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
    </div>`}function Yr(){return`
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
    </div>`}function Wr(t){const a=t.document??document,{store:e}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${e.get("personas").map(Ur).join("")}
      </div>
      ${Yr()}`}function s(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function n(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var p;c.querySelectorAll("[data-persona-accion]").forEach(d=>{d.addEventListener("click",()=>{const u=d.dataset.personaId,v=d.dataset.personaAccion,g=e.get("personas"),h=g.find(x=>x._id===u);if(h){if(v==="renombrar"){const x=typeof prompt=="function"?prompt("Nuevo nombre",h.nombre):null;if(!x||!x.trim())return;e.updateItem("personas",u,{nombre:x.trim()}),$e(t,"Persona renombrada"),n(),s(c);return}if(v==="defecto"){e.set("personas",g.map(x=>({...x,esPorDefecto:x._id===u}))),$e(t,`"${h.nombre}" es ahora la persona por defecto`),n(),s(c);return}if(v==="activo"){e.updateItem("personas",u,{activo:!h.activo}),n(),s(c);return}if(v==="eliminar"){if(g.length<=1){$e(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!Gr(t,`¿Eliminar "${h.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;e.removeItem("personas",u),$e(t,`"${h.nombre}" eliminada`),n(),s(c)}}})});const l=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(d=>{d.addEventListener("click",()=>{const u=d.getAttribute("data-persona-color");l&&(l.value=u),c.querySelectorAll("[data-persona-color]").forEach(v=>{v.style.border=v.getAttribute("data-persona-color")===u?"2px solid white":"2px solid transparent"})})}),(p=c.querySelector("#persona-nuevo-btn"))==null||p.addEventListener("click",()=>{const d=c.querySelector("#persona-nuevo-nombre"),u=d==null?void 0:d.value.trim();if(!u){$e(t,"Ponle un nombre a la persona","warn");return}const v=(l==null?void 0:l.value)||ra[0],g=e.addItem("personas",{nombre:u,color:v,esPorDefecto:!1,activo:!0});$e(t,`"${g.nombre}" creada ✓`),n(),s(c)})}function r(){const c=Vr(a);s(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:s}}const _s={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function Fs(t,a){t.querySelectorAll("[data-feature]").forEach(e=>{const o=e.dataset.feature;if(!o)return;const s=a(o);e.style.display=s?"":"none",s?(e.removeAttribute("aria-hidden"),"disabled"in e&&(e.disabled=!1)):(e.setAttribute("aria-hidden","true"),"disabled"in e&&(e.disabled=!0))})}function Kr({flags:t,document:a=document,router:e,rutasExtra:o}){function s(){const r=a.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function n(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([l,p])=>[p,l]);for(const[l,p]of[...Object.entries(_s),...c]){const d=t.isEnabled(l),u=a.querySelector(`.nav-btn[data-view="${p}"]`);u&&(u.style.display=d?"":"none"),!d&&s()===p&&(r=!0)}if(a.querySelectorAll(".nav-section").forEach(l=>{const p=[...l.querySelectorAll(".nav-btn[data-view]")];if(p.length===0)return;const d=p.some(u=>u.style.display!=="none");l.style.display=d?"":"none"}),Fs(a,l=>t.isEnabled(l)),r){const l=e??globalThis.Router;l==null||l.navigate("dashboard")}}function i(r=a.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const l=new MutationObserver(()=>{if(!c){c=!0;try{Fs(a,p=>t.isEnabled(p))}finally{c=!1}}});return l.observe(r,{childList:!0,subtree:!0}),()=>l.disconnect()}return{apply:n,observar:i,vistaPara:r=>_s[r]}}const Jr="toast toast-deshacer";function Qr(t){const{store:a,rerender:e,duracionMs:o=12e3}=t,s=t.contenedor??(()=>document.getElementById("toast-container"));let n=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,n==null||n.remove(),n=null}function l(d){const u=s();if(!u)return;c();const v=document.createElement("div");v.className=Jr,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const g=document.createElement("span");g.textContent=`${hr(d.col,d.item)} se ha eliminado.`,g.style.flex="1";const h=document.createElement("button");h.type="button",h.className="btn-secondary btn-sm",h.textContent="Deshacer",h.style.flexShrink="0",h.addEventListener("click",()=>{const x=a.deshacerBorrado();if(c(),!x)return;const f=s();if(f){const y=document.createElement("div");y.className="toast toast-ok",y.textContent="Deshecho.",f.appendChild(y),setTimeout(()=>y.remove(),2500)}e==null||e()}),v.appendChild(g),v.appendChild(h),u.appendChild(v),n=v,i=setTimeout(c,o)}const p=a.subscribe(()=>{const d=a.borradoPendiente();if(!d){r=null,c();return}d!==r&&(r=d,l(d))});return()=>{p(),c()}}function ca(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function Ds(t,a){const e=ca(t),o=ca(a);if(!o)return-1;const s=e.indexOf(o);return s<0?-1:s===0?0:/[\s\-/_(«"']/.test(e[s-1])?1:2}const He=t=>{const a=Number(t);return Number.isFinite(a)?`${a.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function Xr(t){const a=[],e=o=>{var s,n;return((n=(s=t.accounts)==null?void 0:s.find(i=>i._id===o))==null?void 0:n.nombre)??""};for(const o of t.expenses??[]){const s=o.tipo==="ingreso";a.push({tipo:s?"ingreso":"gasto",etiqueta:s?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[He(o.cuantia),e(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],e(o.cuenta)].join(" ")})}for(const o of t.accounts??[])a.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:He(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])a.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:He(o.capital),ruta:"loans",extra:[...o.tags??[],e(o.cuenta)].join(" ")});for(const o of t.nominas??[])a.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${He(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])a.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,He(o.importeCts/100),e(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return a}function Zr(t,a,e={}){const{maximo:o=12,rutasDisponibles:s=null}=e,n=ca(a);if(n.length<2)return[];const i=c=>s===null||s.includes(c),r=[];for(const c of Xr(t)){if(!i(c.ruta))continue;const l=Ds(c.titulo,n),p=l>=0?-1:Math.min(Ds(c.extra??"",n),2);if(l<0&&p<0)continue;const d=l>=0?l:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:d*1e3+Math.min(999,ca(c.titulo).length)})}return r.sort((c,l)=>c.peso-l.peso||c.titulo.localeCompare(l.titulo,"es")),r.slice(0,o)}const tc="buscador-overlay",Ts="btn-buscador";function ec(t){const a=t.doc??document,e=t.rutasDisponibles??(()=>null);let o=null,s=null,n=null,i=[],r=0;function c(){const w=a.createElement("div");w.id=tc,w.className="modal-overlay",w.style.alignItems="flex-start",w.style.paddingTop="10vh";const I=a.createElement("div");I.className="modal-box",I.style.maxWidth="560px",I.style.padding="14px";const E=a.createElement("input");E.type="search",E.className="form-input",E.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",E.setAttribute("aria-label","Buscar en toda la aplicación"),E.autocomplete="off";const A=a.createElement("div");return A.style.marginTop="10px",A.style.maxHeight="52vh",A.style.overflowY="auto",I.appendChild(E),I.appendChild(A),w.appendChild(I),a.body.appendChild(w),w.addEventListener("click",C=>{C.target===w&&h()}),E.addEventListener("input",()=>{r=0,p()}),E.addEventListener("keydown",v),o=w,s=E,n=A,w}function l(){if(n){if(n.textContent="",i.length===0){const w=a.createElement("div");w.style.padding="14px 4px",w.style.fontSize="13px",w.style.color="var(--text3)";const I=(s==null?void 0:s.value.trim())??"";w.textContent=I.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",n.appendChild(w);return}i.forEach((w,I)=>{const E=a.createElement("button");E.type="button",E.className="buscador-fila",E.dataset.indice=String(I),I===r&&E.classList.add("activa");const A=a.createElement("div");A.style.minWidth="0";const C=a.createElement("div");C.textContent=w.titulo,C.style.fontSize="13px",C.style.overflow="hidden",C.style.textOverflow="ellipsis",C.style.whiteSpace="nowrap";const $=a.createElement("div");$.textContent=w.detalle,$.style.fontSize="11px",$.style.color="var(--text3)",$.style.overflow="hidden",$.style.textOverflow="ellipsis",$.style.whiteSpace="nowrap",A.appendChild(C),w.detalle&&A.appendChild($);const P=a.createElement("span");P.className="tag",P.textContent=w.etiqueta,P.style.flexShrink="0",E.appendChild(A),E.appendChild(P),E.addEventListener("click",()=>u(I)),n.appendChild(E)})}}function p(){const w=(s==null?void 0:s.value)??"";i=Zr(t.estado(),w,{rutasDisponibles:e()}),r>=i.length&&(r=Math.max(0,i.length-1)),l()}function d(w){var I,E;i.length!==0&&(r=(r+w+i.length)%i.length,l(),(E=(I=n==null?void 0:n.querySelector(".buscador-fila.activa"))==null?void 0:I.scrollIntoView)==null||E.call(I,{block:"nearest"}))}function u(w){const I=i[w];I&&(h(),t.navegar(I.ruta))}function v(w){w.key==="Escape"?(w.preventDefault(),h()):w.key==="ArrowDown"?(w.preventDefault(),d(1)):w.key==="ArrowUp"?(w.preventDefault(),d(-1)):w.key==="Enter"&&(w.preventDefault(),u(r))}function g(){const w=o??c();w.classList.remove("hidden"),w.style.display="",r=0,s&&(s.value="",s.focus()),p()}function h(){o&&(o.style.display="none",i=[])}function x(){return!!o&&o.style.display!=="none"}function f(w){(w.ctrlKey||w.metaKey)&&(w.key==="k"||w.key==="K")&&(w.preventDefault(),x()?h():g())}a.addEventListener("keydown",f);let y=null;function S(){const w=a.getElementById("period-bar");if(!w||a.getElementById(Ts))return;const I=a.createElement("button");I.id=Ts,I.type="button",I.className="btn-secondary",I.title="Buscar en toda la aplicación (Ctrl+K)",I.setAttribute("aria-label","Buscar"),I.textContent="🔍 Buscar",I.style.marginLeft="auto",I.addEventListener("click",g),w.appendChild(I),y=I}return S(),()=>{a.removeEventListener("keydown",f),y==null||y.remove(),o==null||o.remove(),o=null,s=null,n=null}}const Wa="aviso-guardado";function ac(t){const a=t.doc??document,e=t.contenedor??(()=>a.getElementById("toast-container")),o=t.msExito??1800,s=t.cambios.crearMarca("guardado");let n="oculto",i=!1,r=null,c=null;function l(){var g;r&&clearTimeout(r),r=null,(g=a.getElementById(Wa))==null||g.remove()}function p(){if(n==="oculto")return l();const g=e();if(!g)return;let h=a.getElementById(Wa);h||(h=a.createElement("div"),h.id=Wa,g.appendChild(h)),h.className=`toast toast-guardado toast-guardado--${n}`,h.style.display="flex",h.style.alignItems="center",h.style.gap="12px",h.textContent="";const x=a.createElement("span");if(x.style.flex="1",h.appendChild(x),n==="pendiente")x.textContent="Tienes cambios sin guardar.",h.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void u())),h.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,n="oculto",p()}));else if(n==="subiendo"){x.textContent="Subiendo…";const f=a.createElement("span");f.className="guardado-giro",f.setAttribute("aria-hidden","true"),h.appendChild(f)}else n==="guardado"?x.textContent="¡Guardado!":n==="error"&&(x.textContent="No se ha podido guardar.",h.appendChild(d("Reintentar","btn-primary btn-sm",()=>void u())))}function d(g,h,x){const f=a.createElement("button");return f.type="button",f.className=h,f.textContent=g,f.style.flexShrink="0",f.addEventListener("click",x),f}async function u(){if(c)return c;r&&clearTimeout(r);const g=t.cambios.revision();return n="subiendo",p(),c=(async()=>{try{await t.guardar(),s.alDia(g),n="guardado",p(),r=setTimeout(()=>{n=s.pendiente()?"pendiente":"oculto",n==="pendiente"&&(i=!1),p()},o)}catch(h){console.error("[guardado] no se ha podido subir la copia:",h),n=t.hayDestino()?"error":"oculto",p()}finally{c=null}})(),c}const v=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,n!=="subiendo"&&(n="pendiente",p()))});return{estado:()=>i&&n==="oculto"?"oculto":n,guardarAhora:u,hayPendiente:()=>s.pendiente(),detener(){v(),l()}}}function oc({document:t=document,isEnabled:a}={}){const e=new Map;let o=null;function s(g){return`view-${g}`}function n(g){const h=t.getElementById(s(g.route));if(h)return h;const x=t.querySelector(".view-container");if(!x)return null;const f=t.createElement("div");return f.id=s(g.route),f.className="view hidden",x.appendChild(f),f}function i(g){if(t.querySelector(`.nav-btn[data-view="${g.route}"]`))return;const h=t.querySelectorAll(".nav-section"),x=h[g.seccion??Math.max(0,h.length-1)];if(!x)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=g.route,f.innerHTML=`${g.iconoPath?`<svg viewBox="0 0 24 24"><path d="${g.iconoPath}"/></svg>`:""}<span>${g.nombre}</span>`,x.appendChild(f),f.addEventListener("click",()=>{const y=globalThis.Router;y==null||y.navigate(g.route)})}function r(g){e.set(g.route,g),n(g),i(g)}function c(){return[...e.keys()].filter(g=>{const h=e.get(g);return!a||a(h.flagId??h.id)})}function l(g){return c().includes(g)}function p(g){const h=e.get(g);if(!h||a&&!a(h.flagId??h.id))return!1;const x=n(h);if(!x)return!1;if(o&&o!==g){const f=e.get(o),y=t.getElementById(s(o));f!=null&&f.unmount&&y&&f.unmount(y)}return h.mount(x),o=g,!0}function d(){o&&p(o)}function u(){const g={};for(const[h,x]of e)g[h]=x.flagId??x.id;return g}function v(){for(const g of e.values())n(g),i(g)}return{register:r,routes:c,has:l,mount:p,rerender:d,flagPorRuta:u,attachToShell:v,get activa(){return o}}}const sc="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Ka(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function nc(t){const{store:a}=t,e=t.hoy??et,o=()=>V(e()),s=()=>a.get("config").margenesSeguridad??[];function n(v){var g;a.patchConfig({margenesSeguridad:v}),(g=t.onDatosCambiados)==null||g.call(t)}function i(v,g){const h=s().map(f=>({...f,puntos:(f.puntos??[]).map(y=>({...y}))})),x=h.find(f=>f._id===v);x&&(g(x),n(h))}function r(v){const g=a.get("config"),h=_a(v,a.get("expenses"),g,a.get("loans"),e(),!1,o());return T(h)}function c(v,g,h){const x=g.tipo==="fijo",f=x?"":`<span class="text-sm" style="color:var(--text3)">${m(T((g.meses??0)*h))}</span>`;return`
      <tr data-punto="${m(g._id)}" data-margen="${m(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${m(g.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${x?" selected":""}>Fijo €</option>
            <option value="meses"${x?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${x?`<input type="number" class="form-input" style="width:90px" value="${g.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${x?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${g.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${f}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function l(v,g,h){const x=v.cuentas&&v.cuentas.length>0?v.cuentas.map(w=>{var I;return((I=g.find(E=>E._id===w))==null?void 0:I.nombre)??w}).join(", "):"Todas las cuentas activas",y=[...v.puntos??[]].sort((w,I)=>w.fecha.localeCompare(I.fecha)).map(w=>c(v,w,h)).join(""),S=v.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${m(x)}</div>
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
            ${y||'<tr><td colspan="6" style="padding:10px 6px;color:var(--text3);font-size:12px">Sin waypoints. Añade un punto para definir el umbral.</td></tr>'}
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
      </div>`}function p(v,g){const h=g?s().find(S=>S._id===g):null,x=a.get("accounts").filter(S=>S.activo),f=new Set((h==null?void 0:h.cuentas)??[]),y=x.map(S=>`
        <label class="tag" data-chip="${m(S._id)}" style="cursor:pointer;${f.has(S._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${m(S._id)}" ${f.has(S._id)?"checked":""} style="display:none"/>
          ${m(S.nombre)}
        </label>`).join(" ");v.innerHTML=`
      <div class="modal-title">${g?"Editar margen":"Nuevo margen de seguridad"}</div>
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <input class="form-input" type="text" id="mg-nombre" value="${m((h==null?void 0:h.nombre)??"")}" placeholder="Ej: reserva mínima cuenta corriente"/>
      </div>
      <div class="form-group mt-8">
        <label class="form-label">Cuentas (vacío = todas las activas)</label>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
          ${y||'<span class="text-sm" style="color:var(--text3)">Sin cuentas activas</span>'}
        </div>
      </div>
      ${h?"":`<div class="mt-12" style="border-top:1px solid var(--border);padding-top:12px">
        <div class="text-sm" style="color:var(--text2);margin-bottom:8px;font-weight:500">Punto inicial</div>
        <div class="grid-2">
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${m(et())}"/></div>
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
      </div>`}function d(v,g){const h=document.getElementById("modal-overlay"),x=kt();!h||!x||(p(x,v),h.classList.remove("hidden"),J(x,".mg-acc-chip",f=>{const y=f,S=x.querySelector(`[data-chip="${y.value}"]`);S&&(S.style.cssText=`cursor:pointer;${y.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),J(x,"#mg-p-tipo",f=>{const y=f.value==="fijo",S=x.querySelector("#mg-p-importe-wrap"),w=x.querySelector("#mg-p-meses-wrap");S&&(S.style.display=y?"":"none"),w&&(w.style.display=y?"none":"")}),q(x,"[data-cerrar-form]",()=>h.classList.add("hidden")),q(x,"[data-guardar-margen]",f=>{var E,A,C,$,P;const y=f.getAttribute("data-guardar-margen")||"",S=((E=x.querySelector("#mg-nombre"))==null?void 0:E.value.trim())??"";if(!S)return O("El nombre es obligatorio","err");const w=[...x.querySelectorAll(".mg-acc-chip:checked")].map(F=>F.value),I=s().map(F=>({...F}));if(y){const F=I.findIndex(M=>M._id===y);if(F===-1)return O("Margen no encontrado","err");I[F]={...I[F],nombre:S,cuentas:w}}else{const F=((A=x.querySelector("#mg-p-tipo"))==null?void 0:A.value)??"fijo",M={_id:Ka(),fecha:((C=x.querySelector("#mg-p-fecha"))==null?void 0:C.value)||et(),tipo:F,importe:parseFloat((($=x.querySelector("#mg-p-importe"))==null?void 0:$.value)??"0")||0,meses:parseFloat(((P=x.querySelector("#mg-p-meses"))==null?void 0:P.value)??"1")||1};I.push({_id:Ka(),nombre:S,activo:!0,cuentas:w,puntos:[M]})}n(I),O(y?"Margen actualizado":"Margen creado"),h.classList.add("hidden"),g()}))}function u(v){const g=s(),h=a.get("accounts"),x=De(a.get("expenses"),o());v.innerHTML=`
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
             </div>`:g.map(y=>l(y,h,x)).join("")}`;const f=()=>u(v);q(v,"[data-nuevo-margen]",()=>d(null,f)),q(v,"[data-editar-margen]",y=>d(y.getAttribute("data-editar-margen"),f)),q(v,"[data-borrar-margen]",y=>{wt("¿Eliminar este margen de seguridad?")&&(n(s().filter(S=>S._id!==y.getAttribute("data-borrar-margen"))),O("Margen eliminado"),f())}),J(v,"[data-toggle-margen]",y=>{const S=y.getAttribute("data-toggle-margen");i(S,w=>{w.activo=y.checked}),f()}),q(v,"[data-add-punto]",y=>{const S=y.getAttribute("data-add-punto");i(S,w=>{w.puntos=[...w.puntos??[],{_id:Ka(),fecha:et(),tipo:"fijo",importe:0,meses:1}]}),f()}),q(v,"[data-borrar-punto]",y=>{const S=y.closest("[data-punto]");if(!S)return;const w=S.dataset.margen,I=S.dataset.punto;i(w,E=>{E.puntos=(E.puntos??[]).filter(A=>A._id!==I)}),f()}),J(v,"[data-campo]",y=>{const S=y.closest("[data-punto]");if(!S)return;const w=y.getAttribute("data-campo"),I=y.value;i(S.dataset.margen,E=>{const A=(E.puntos??[]).find(C=>C._id===S.dataset.punto);A&&(w==="fecha"?A.fecha=I:w==="tipo"?A.tipo=I:w==="importe"?A.importe=parseFloat(I)||0:A.meses=parseFloat(I)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:sc,mount:u}}const ic=[...Array.from({length:31},(t,a)=>String(a+1)),"ultimo"],rc=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],cc=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function lc(t){const a=t||"";if(a.startsWith("dia:"))return{modo:"dia",dia:a.slice(4)||"1",nth:"1",wd:"1"};if(a.startsWith("nthweekday:")){const[,e="1",o="1"]=a.split(":");return{modo:"nthweekday",dia:"1",nth:e,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Ja=(t,a)=>t.map(([e,o])=>`<option value="${m(e)}"${e===a?" selected":""}>${m(o)}</option>`).join("");function zs(t,a="dp"){const{modo:e,dia:o,nth:s,wd:n}=lc(t),i=Ja(ic.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${m(a)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Ja(rc,s)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Ja(cc,n)}</select>
        del mes
      </span>
    </div>
  </div>`}function js(t){var o,s,n;const a=t.querySelector("[data-diapago]");if(!a)return;const e=((o=a.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(s=a.querySelector("[data-dp-dia]"))==null||s.style.setProperty("display",e==="dia"?"":"none"),(n=a.querySelector("[data-dp-nth]"))==null||n.style.setProperty("display",e==="nthweekday"?"":"none")}function qs(t){const a=t.querySelector("[data-diapago]");if(!a)return"";const e=s=>{var n;return((n=a.querySelector(s))==null?void 0:n.value)??""},o=e("[data-dp-modo]");return o==="dia"?`dia:${e("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${e("[data-dp-n]")}:${e("[data-dp-wd]")}`:""}const dc={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function uc(t,a){const e=new Set(((a==null?void 0:a.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||e.has(o._id))}function xe(t,a,e,o){if(e.filter(c=>c.activo).length<2)return"";const s=(a==null?void 0:a.modo)??"",n=new Map(((a==null?void 0:a.participantes)??[]).map(c=>[c.personaId,c.valor])),i=s==="porcentaje"||s==="importe",r=c=>{const l=n.has(c._id),p=n.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
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
      ${uc(e,a).map(r).join("")}
    </div>
  </div>`}function Ie(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"",s=e.querySelector(`[data-reparto-participantes="${a}"]`);s&&(s.style.display=o?"":"none");const n=o==="porcentaje"||o==="importe";e.querySelectorAll(`[data-reparto-valor="${a}"]`).forEach(r=>{r.style.display=n?"":"none"})}function we(t,a){var i;const e=t.querySelector(`[data-reparto="${a}"]`);if(!e)return;const o=((i=e.querySelector(`[data-reparto-modo="${a}"]`))==null?void 0:i.value)??"";if(!o)return;const s=[...e.querySelectorAll(".reparto-persona:checked")];if(s.length===0)return;const n=s.map(r=>{const c=r.value,l=e.querySelector(`[data-reparto-valor="${a}"][data-persona="${c}"]`),p=l?parseFloat(l.value):NaN;return Number.isFinite(p)?{personaId:c,valor:p}:{personaId:c}});return{modo:o,participantes:n}}function Ns(t,a){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var s;return((s=a.find(n=>n._id===o.personaId))==null?void 0:s.nombre)??"?"}).join(", ")} (${dc[t.modo]})`}function Qa(t,a,e){const o=Ns(t,e),s=Ns(a,e);return!o&&!s?"":o===s?`Reparto: ${o}`:[s&&`Paga: ${s}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const pc="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",mc=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function fc(t){const a=t.hoy??et,e={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},s=()=>t.store.get("accounts"),n=f=>{var y;return((y=s().find(S=>S._id===(f||"default")))==null?void 0:y.nombre)??(f||"default")};function i(){const f=a();let y=[...t.store.get("expenses")];if(e.mostrarExpirados||(y=y.filter(S=>!S.fechaFin||S.fechaFin>=f)),e.tipo&&(y=y.filter(S=>S.tipo===e.tipo)),e.cuenta&&(y=y.filter(S=>(S.cuenta||"default")===e.cuenta)),e.desde&&(y=y.filter(S=>(S.fechaInicio??"")>=e.desde)),e.hasta&&(y=y.filter(S=>(S.fechaInicio??"")<=e.hasta)),e.busqueda){const S=e.busqueda.toLowerCase();y=y.filter(w=>w.concepto.toLowerCase().includes(S))}return e.tags.size>0&&(y=y.filter(S=>(S.tags||[]).some(w=>e.tags.has(w)))),y.sort((S,w)=>{const I=S[e.orden]??"",E=w[e.orden]??"";return typeof I=="number"&&typeof E=="number"?(I-E)*e.sentido:String(I).localeCompare(String(E))*e.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function c(f,y){const S=e.orden===f?e.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${m(y)} <span class="sort-arrow">${S}</span></span>`}function l(f,y=!1){return(y?'<option value="">Todas las cuentas</option>':"")+s().filter(w=>w.activo!==!1).map(w=>`<option value="${m(w._id)}"${w._id===f?" selected":""}>${m(w.nombre)}</option>`).join("")}function p(f){const y=f.tipo==="transferencia",S=Qa(f.repartoConsumo,f.repartoPago,t.store.get("personas")),w=xa(f.diaPago??""),I=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${w?` · ${w}`:""}`,E=!!f.fechaFin&&f.fechaFin<a(),A=y?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',C=y?`${m(n(f.cuenta))} → ${m(n(f.cuentaDestino))}`:m(n(f.cuenta)),$=(f.tags||[]).map(P=>`<span class="tag${e.tags.has(P)?" active":""}" data-tag="${m(P)}" title="Filtrar por ${m(P)}">${m(P)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(f.concepto)}</div>
        <div class="tag-list mt-4">${$}</div>
      </div>
      <div>${A}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":y?"":"neg"}">${y?"⇄ ":""}${m(T(f.cuantia))}</div>
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
        ${E?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${m(f._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${m(f._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${m(f._id)}">✕</button>
      </div>
    </div>`}function d(f){const y=i(),S=r();f.innerHTML=`
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
        ${y.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':y.map(p).join("")}
      </div>`}function u(f){const y=(f==null?void 0:f.tipo)==="transferencia",S=t.store.get("personas"),w=(I,E,A,C,$="")=>`<div class="form-group"><label class="form-label">${m(E)}</label>
       <input class="form-input" type="${A}" id="${I}" value="${m(C)}" placeholder="${m($)}"/></div>`;return`
      <div class="grid-2">
        ${w("ef-concepto","Concepto","text",(f==null?void 0:f.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(f==null?void 0:f.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${y?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${w("ef-cuantia","Cuantía (€)","number",(f==null?void 0:f.cuantia)??"","500")}
        ${w("ef-frecuencia","Frecuencia","number",(f==null?void 0:f.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${mc.map(([I,E])=>`<option value="${I}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===I?" selected":""}>${m(E)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${w("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??a())}
        <div class="form-group"><label class="form-label">Cuenta</label>
          <select class="form-select" id="ef-cuenta">${l((f==null?void 0:f.cuenta)??"default")}</select></div>
      </div>
      <div id="ef-destino-wrap" class="mt-8"${y?"":' style="display:none"'}>
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
          <div class="mt-8">${zs(f==null?void 0:f.diaPago,"exp")}</div>
          <div id="ef-basico-wrap"${y?' style="display:none"':""}>
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
          ${y?"":`${xe("Reparto de consumo",f==null?void 0:f.repartoConsumo,S,"consumo")}
                 ${xe("Reparto de pago",f==null?void 0:f.repartoPago,S,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${m((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function v(f){var w;const y=((w=f.querySelector("#ef-tipo"))==null?void 0:w.value)??"gasto",S=(I,E)=>{const A=f.querySelector(I);A&&(A.style.display=E?"":"none")};S("#ef-destino-wrap",y==="transferencia"),S("#ef-basico-wrap",y!=="transferencia"),S("#ef-irpf-wrap",y==="ingreso"),S("#ef-clasificacion-wrap",y==="gasto"),S("#ef-factura-wrap",y==="gasto"),S("#ef-imprevisto-wrap",y==="gasto")}function g(f,y,S){const w=document.getElementById("modal-overlay"),I=kt();!w||!I||(I.innerHTML=`<div class="modal-title">${m(y)}</div>${u(f)}`,w.classList.remove("hidden"),J(I,"#ef-tipo",()=>v(I)),J(I,"[data-dp-modo]",()=>js(I)),J(I,'[data-reparto-modo="consumo"]',()=>Ie(I,"consumo")),J(I,'[data-reparto-modo="pago"]',()=>Ie(I,"pago")),q(I,"[data-cancelar]",()=>w.classList.add("hidden")),q(I,"[data-guardar]",E=>{h(I,E.getAttribute("data-guardar")||"")&&(w.classList.add("hidden"),S())}))}function h(f,y){const S=z=>{var j;return((j=f.querySelector(z))==null?void 0:j.value)??""},w=z=>{var j;return!!((j=f.querySelector(z))!=null&&j.checked)},I=S("#ef-tipo")||"gasto",E=I==="transferencia",A=S("#ef-concepto").trim(),C=parseFloat(S("#ef-cuantia").replace(",",".")),$=S("#ef-fecha-ini"),P=S("#ef-fecha-fin")||null,F=A?!Number.isFinite(C)||C<=0?"La cuantía debe ser mayor que 0 (el signo lo pone el tipo: gasto o ingreso)":$?P&&P<$?"La fecha de fin no puede ser anterior a la de inicio":E&&S("#ef-cuenta")===(S("#ef-cuenta-dest")||"default")?"En una transferencia, la cuenta de destino tiene que ser distinta de la de origen":"":"Indica la fecha de inicio":"Escribe un concepto";if(F)return O(F,"err"),!1;const M=S("#ef-tags").split(",").map(z=>z.trim()).filter(z=>z&&z!=="transferencia"),b=E?[...new Set([...M,"transferencia"])]:[...new Set(M)],D=S("#ef-clasificacion"),_={concepto:A,tipo:I,cuantia:C,frecuencia:parseInt(S("#ef-frecuencia"),10)||1,tipoFrecuencia:S("#ef-tipo-frec")||"mensual",fechaInicio:$,fechaFin:P,diaPago:qs(f),cuenta:S("#ef-cuenta"),cuentaDestino:E?S("#ef-cuenta-dest")||"default":void 0,activo:w("#ef-activo"),basico:!E&&w("#ef-basico"),sujetoIRPF:!E&&w("#ef-sujetoIRPF"),clasificacion:I==="gasto"?D||null:void 0,esFactura:I==="gasto"?S("#ef-factura")==="si"?!0:S("#ef-factura")==="no"?!1:void 0:void 0,imprevisto:I==="gasto"&&w("#ef-imprevisto")?!0:void 0,tags:b,repartoConsumo:E?void 0:we(f,"consumo"),repartoPago:E?void 0:we(f,"pago")};return y?(t.store.updateItem("expenses",y,_),O("Actualizado")):(t.store.addItem("expenses",_),O("Creado")),o(),!0}function x(f,y){const S=f.querySelector("[data-busqueda]");let w;S==null||S.addEventListener("input",()=>{clearTimeout(w),w=setTimeout(()=>{e.busqueda=S.value,y();const I=f.querySelector("[data-busqueda]");I==null||I.focus(),I==null||I.setSelectionRange(I.value.length,I.value.length)},250)}),J(f,"[data-expirados]",I=>{e.mostrarExpirados=I.checked,y()}),J(f,"[data-f-tipo]",I=>{e.tipo=I.value,y()}),J(f,"[data-f-cuenta]",I=>{e.cuenta=I.value,y()}),J(f,"[data-f-desde]",I=>{e.desde=I.value,y()}),J(f,"[data-f-hasta]",I=>{e.hasta=I.value,y()}),q(f,"[data-limpiar]",()=>{e.tipo="",e.cuenta="",e.desde="",e.hasta="",e.busqueda="",e.tags=new Set,y()}),q(f,"[data-limpiar-tags]",()=>{e.tags=new Set,y()}),q(f,"[data-tag]",I=>{const E=I.getAttribute("data-tag");e.tags.has(E)?e.tags.delete(E):e.tags.add(E),y()}),q(f,"[data-orden]",I=>{const E=I.getAttribute("data-orden");e.orden===E?e.sentido=e.sentido===1?-1:1:(e.orden=E,e.sentido=1),y()}),q(f,"[data-nuevo]",()=>g(null,"Nuevo gasto/ingreso",y)),q(f,"[data-editar]",I=>{const E=t.store.get("expenses").find(A=>A._id===I.getAttribute("data-editar"));E&&g(E,"Editar",y)}),q(f,"[data-duplicar]",I=>{const E=t.store.get("expenses").find($=>$._id===I.getAttribute("data-duplicar"));if(!E)return;const{_id:A,...C}=E;g({...C,concepto:`${E.concepto} (copia)`},"Duplicar movimiento",y)}),q(f,"[data-borrar]",I=>{wt("¿Eliminar?")&&(t.store.removeItem("expenses",I.getAttribute("data-borrar")),O("Eliminado"),o(),y())}),J(f,"[data-activo]",I=>{const E=I;t.store.updateItem("expenses",E.getAttribute("data-activo"),{activo:E.checked}),o(),y()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:pc,mount(f){const y=()=>d(f);d(f),f.dataset.wired!=="1"&&(x(f,y),f.dataset.wired="1")}}}function la(t,a,e){return t.reduce((o,s)=>{if(s.esAmortizacion)return o;const n=Gt(a,e,s.fecha);return o+(n>0?s.interes/n:s.interes)},0)}function Rs(t,a,e,o){return t.reduce((s,n)=>{const i=Gt(a,e,n.fecha),r=n.esAmortizacion?n.amortizacion+n.comisionAmort:n.cuota;return s+(i>0?r/i:r)},0)+o}function gc(t,a,e){const o=t.amortizaciones||[];return o.map((s,n)=>{const i=bt({...t,amortizaciones:o.slice(0,n)}),r=bt({...t,amortizaciones:o.slice(0,n+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:la(i.tabla,a,e)-la(r.tabla,a,e)}})}const Xa=(t,a,e="",o="")=>`<div class="stat-card">
     <div class="stat-label">${m(t)}</div>
     <div class="stat-value ${o}">${a}</div>
     ${e}
   </div>`;function vc(t,a){const e=Io(t),o=(t.amortizaciones||[]).length>0,s=a.periodos.length>0,n=a.usarInflacion&&s,i=s?wo(a.periodos,t.fechaInicio||a.hoy,e.fechaFin||a.hoy,0):0,r=s?Co(t.tin||0,i):null,c=o&&s?gc(t,a.periodos,a.hoy):[],l=c.length?la(e.sinAmort.tabla,a.periodos,a.hoy)-la(e.tabla,a.periodos,a.hoy):null,p=l===null?null:l-e.costeTotalAmort,d=n?Rs(e.tabla,a.periodos,a.hoy,e.comAp):null,u=n&&o?Rs(e.sinAmort.tabla,a.periodos,a.hoy,e.comAp):null;return`<div class="loan-card" style="${a.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${m(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${m(t.nombre)}</span>
        ${a.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const v=Qa(t.repartoConsumo,t.repartoPago,a.personas);return v?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(v)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(v=>`<span class="tag">${m(v)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${m(t.tin)}%</span>
        <span class="text-sm">${m(T(e.cuota))}/mes</span>
        <span class="text-sm">${m(e.fechaFin||"—")}</span>
        <button class="btn-icon" data-amort-loan="${m(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${m(t._id)}">

      <div class="grid-4 mb-12">
        ${Xa("Cuota mensual",m(T(e.cuota)),a.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${m(T(a.cuotaMes))}</div>`:"")}
        ${Xa("Total intereses",m(T(e.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(T(e.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${m(e.fechaFin||"—")}</div>
          ${o&&e.fechaFin!==e.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(e.sinAmort.fechaFin||"—")}${e.ahorroTiempo>0?` (−${e.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Xa("Total pagado",m(T(e.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${m(T(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${m(ho(e.tae))}</div></div>
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
          <div><div class="stat-label">Capital</div><div class="stat-value">${m(T(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${m(T(e.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${m(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${m(xa(t.diaPago))}</div></div>`:""}
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
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${m(T(e.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${m(T(l))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(T(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${m(T(e.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(p??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${m(T(p??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${m(T(e.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(T(e.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${e.ahorroNeto>=0?"pos":"neg"}">${m(T(e.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${e.ahorroTiempo>0?`${e.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${d!==null?bc(t,e.totalPagado,d,u):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${n?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${e.tabla.map(v=>hc(v,n,a)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,g)=>yc(t._id,v,c[g]??null)).join("")}`:""}
    </div>
  </div>`}function bc(t,a,e,o){const s=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-e,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${m(T(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${m(T(e))}</div></div>
        <div><div class="stat-label">${c?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${c?"pos":"neg"}">${c?"−":"+"}${m(T(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${s}
    </div>`}const n=a-e,i=n>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${m(T(a))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${m(T(e))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${m(T(Math.abs(n)))}</div></div>
    </div>
    ${s}
  </div>`}function hc(t,a,e){let o="";if(a&&!t.esAmortizacion){const s=Gt(e.periodos,e.hoy,t.fecha);o=m(T(s>0?t.cuota/s:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":m(t.mes)}</td>
    <td class="num">${m(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":m(T(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${m(T(t.interes))}</td>
    <td class="num">${m(T(t.amortizacion))}</td>
    <td class="num">${m(T(t.capitalPendiente))}</td>
    ${a?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function yc(t,a,e){return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${m(a.fecha)}</span>
    <span class="num">${m(T(a.cantidad))}</span>
    <span class="badge ${a.simulacion?"badge-sim":"badge-active"}">${a.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${a.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${e?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${m(T(e.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${m(T(e.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-duplicar-amort="${m(t)}|${m(a._id)}" title="Duplicar" aria-label="Duplicar amortización"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
    <button class="btn-icon" data-editar-amort="${m(t)}|${m(a._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${m(t)}|${m(a._id)}">✕</button>
  </div>`}const Ct=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(s)}"/></div>`,Be=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([s,n])=>`<option value="${m(s)}"${s===o?" selected":""}>${m(n)}</option>`).join("")}
   </select></div>`,Ge=(t,a,e,o="")=>`<label class="form-label">${m(a)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${e?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${m(o)}</span>`:""}`,$c=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function xc(t,a,e,o=et()){return`
    <div class="grid-2">
      ${Ct("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${Ct("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${Ct("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${Ct("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${Ct("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??o)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${$c(a,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${zs(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Be("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${Ct("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${Ct("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
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
    </div>`}function Ic(t,a,e=et()){return`
    <div class="grid-2">
      ${Ct("am-fecha","Fecha","date",(a==null?void 0:a.fecha)??e)}
      ${Ct("am-cant","Cantidad (€)","number",(a==null?void 0:a.cantidad)??"","10000")}
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
    </div>`}const wc="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Cc(t){const a=t.hoy??et;let e=!1;const o=new Set;let s=null;const n=()=>{var E;return(E=t.onDatosCambiados)==null?void 0:E.call(t)};function i(E){const A=E.filter($=>$.activo);if(A.length<2)return"";const C=($,P)=>`<button class="btn-secondary btn-sm" data-persona-tab="${$===null?"":m($)}"
               style="${s===$?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(P)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${C(null,"Todas")}
      ${A.map($=>C($._id,$.nombre)).join("")}
    </div>`}function r(E){if(!E.activo||E.simulacion)return!1;const A=bt(E).tabla.filter(C=>!C.esAmortizacion);return A.length===0?!0:A[A.length-1].fecha<a()}function c(E,A){const C=a(),$=C.slice(0,7),P=new Map;let F=0;for(const M of E){if(!M.activo||M.simulacion||A.has(M._id)||(M.fechaInicio||"")>C)continue;const b=bt(M).tabla.filter(_=>!_.esAmortizacion&&_.fecha.startsWith($)),D=b.length>0?b[0].cuota:0;P.set(M._id,D),F+=D}return{porLoan:P,total:F,activos:[...P.values()].filter(M=>M>0).length}}function l(E){const A=a().slice(0,7),C=[];for(const $ of E){if(!$.activo||$.simulacion)continue;const P=bt($).tabla.filter(M=>!M.esAmortizacion),F=P[P.length-1];F&&F.fecha.slice(0,7)===A&&C.push({loan:$,cuota:F.cuota})}return C}function p(E){return E.length<=1?E[0]??"":`${E.slice(0,-1).join(", ")} y ${E[E.length-1]}`}function d(E){const A=t.store.get("config"),C=A.dashboardStart,$=A.dashboardEnd,P=Math.max(1,(V($).getTime()-V(C).getTime())/(30.44*864e5));let F=0;for(const M of E)!M.activo||M.simulacion||(F+=bt(M).tabla.filter(b=>!b.esAmortizacion&&b.fecha>=C&&b.fecha<=$).reduce((b,D)=>b+D.cuota,0));return{media:F/P,desde:C,hasta:$}}function u(E){const A=t.store.get("personas"),C=Je(A),$=[...t.store.get("loans")].sort((L,N)=>N.tin-L.tin),P=s?$.filter(L=>Ca(L.repartoConsumo,L.repartoPago,C).has(s)):$,F=new Set(P.filter(r).map(L=>L._id)),M=e?P:P.filter(L=>!F.has(L._id)),b=c($,new Set($.filter(r).map(L=>L._id))),D=d($),_=l($),z=t.store.get("config"),j=t.store.get("inflacion"),H=new Date(V(a())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});E.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${F.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${e?"Ocultar":"Mostrar"} finalizados (${F.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(A)}
      ${_.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${_.length===1?"acaba":"acaban"} ${m(p(_.map(L=>L.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${m(T(_.reduce((L,N)=>L+N.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${b.total>0||D.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${b.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${m(H)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${m(T(b.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${b.activos} préstamo${b.activos!==1?"s":""} activo${b.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${D.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${m(T(D.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${m(D.desde)} → ${m(D.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${M.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':M.map(L=>vc(L,{periodos:j,usarInflacion:!!z.usarInflacion,hoy:a(),cuotaMes:b.porLoan.get(L._id)??0,completado:F.has(L._id),personas:A})).join("")}
      </div>`;for(const L of E.querySelectorAll("[data-body-loan]"))o.has(L.dataset.bodyLoan??"")&&L.classList.add("open")}const v=()=>document.getElementById("modal-overlay"),g=()=>kt(),h=()=>{var E;return(E=v())==null?void 0:E.classList.add("hidden")};function x(E,A){const C=v(),$=g();return!C||!$?null:($.innerHTML=`<div class="modal-title">${m(E)}</div>${A}`,C.classList.remove("hidden"),q($,"[data-cancelar]",h),$)}function f(E,A){const C=E?t.store.get("loans").find(P=>P._id===E)??null:null,$=x(E?"Editar préstamo":"Nuevo préstamo",xc(C,t.store.get("accounts"),t.store.get("personas"),a()));$&&($.addEventListener("change",P=>{const F=P.target;F!=null&&F.matches("[data-dp-modo]")&&js($),F!=null&&F.matches('[data-reparto-modo="consumo"]')&&Ie($,"consumo"),F!=null&&F.matches('[data-reparto-modo="pago"]')&&Ie($,"pago")}),q($,"[data-guardar-loan]",P=>{y($,P.getAttribute("data-guardar-loan")||"")&&(h(),A())}))}function y(E,A){const C=_=>{var z;return((z=E.querySelector(_))==null?void 0:z.value)??""},$=_=>{var z;return!!((z=E.querySelector(_))!=null&&z.checked)},P=C("#f-nombre").trim(),F=parseFloat(C("#f-capital")),M=parseFloat(C("#f-tin")),b=parseInt(C("#f-meses"),10);if(!P||!Number.isFinite(F)||!Number.isFinite(M)||!Number.isFinite(b))return O("Completa los campos obligatorios","err"),!1;const D={nombre:P,capital:F,tin:M,meses:b,fechaInicio:C("#f-fecha"),comisionApertura:parseFloat(C("#f-com-ap"))||0,comisionAmort:parseFloat(C("#f-com-am"))||0,diaPago:qs(E),cuenta:C("#f-cuenta"),simulacion:$("#f-sim"),activo:$("#f-activo"),mostrarFechaFinEnDashboard:$("#f-mostrar-fin"),tipoTasa:C("#f-tipo-tasa"),basico:$("#f-basico"),tags:C("#f-tags").split(",").map(_=>_.trim()).filter(Boolean),repartoConsumo:we(E,"consumo"),repartoPago:we(E,"pago")};return A?(t.store.updateItem("loans",A,D),O("Préstamo actualizado")):(t.store.addItem("loans",{...D,amortizaciones:[]}),O("Préstamo creado")),n(),!0}function S(E,A,C,{duplicar:$=!1}={}){const P=t.store.get("loans").find(_=>_._id===E);if(!P)return;const F=A?(P.amortizaciones||[]).find(_=>_._id===A)??null:null;if($&&!F)return;const M=$&&F?{...F,_id:""}:F,D=x($?"Duplicar amortización":A?"Editar amortización":"Añadir amortización",Ic(E,M,a()));D&&q(D,"[data-guardar-amort]",_=>{const[z,j]=(_.getAttribute("data-guardar-amort")||"").split("|");w(D,z,j)&&(h(),C([z]))})}function w(E,A,C){var z;const $=j=>{var H;return((H=E.querySelector(j))==null?void 0:H.value)??""},P=$("#am-fecha"),F=parseFloat($("#am-cant"));if(!P||!Number.isFinite(F)||F<=0)return O("Fecha y cantidad requeridas","err"),!1;const M=t.store.get("loans").find(j=>j._id===A);if(!M)return!1;const b={fecha:P,cantidad:F,tipo:$("#am-tipo"),simulacion:!!((z=E.querySelector("#am-sim"))!=null&&z.checked)},D=M.amortizaciones||[],_=C?D.map(j=>j._id===C?{...j,...b}:j):[...D,{_id:Date.now().toString(36),...b}];return t.store.updateItem("loans",A,{amortizaciones:_}),O(C?"Amortización actualizada":"Amortización añadida"),n(),!0}function I(E,A){q(E,"[data-toggle-finalizados]",()=>{e=!e,A()}),q(E,"[data-persona-tab]",C=>{s=C.getAttribute("data-persona-tab")||null,A()}),q(E,"[data-nuevo-loan]",()=>f(null,A)),q(E,"[data-toggle-loan]",(C,$)=>{var b;if((b=$.target)!=null&&b.closest("button"))return;const P=C.getAttribute("data-toggle-loan"),F=[...E.querySelectorAll("[data-body-loan]")].find(D=>D.dataset.bodyLoan===P);(F==null?void 0:F.classList.toggle("open"))?o.add(P):o.delete(P)}),q(E,"[data-editar-loan]",C=>f(C.getAttribute("data-editar-loan"),A)),q(E,"[data-borrar-loan]",C=>{if(!wt("¿Eliminar préstamo?"))return;const $=C.getAttribute("data-borrar-loan");t.store.removeItem("loans",$),o.delete($),O("Eliminado"),n(),A()}),q(E,"[data-amort-loan]",C=>{const $=C.getAttribute("data-amort-loan");o.add($),S($,null,A)}),q(E,"[data-duplicar-amort]",C=>{const[$,P]=(C.getAttribute("data-duplicar-amort")||"").split("|");o.add($),S($,P,A,{duplicar:!0})}),q(E,"[data-editar-amort]",C=>{const[$,P]=(C.getAttribute("data-editar-amort")||"").split("|");o.add($),S($,P,A)}),q(E,"[data-borrar-amort]",C=>{const[$,P]=(C.getAttribute("data-borrar-amort")||"").split("|"),F=t.store.get("loans").find(M=>M._id===$);F&&(t.store.updateItem("loans",$,{amortizaciones:(F.amortizaciones||[]).filter(M=>M._id!==P)}),O("Amortización eliminada"),n(),A([$]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:wc,mount(E){const A=(C=[])=>{for(const $ of C)o.add($);u(E)};u(E),E.dataset.wired!=="1"&&(I(E,A),E.dataset.wired="1")}}}const Za=6.35;function Ce(t){return(t.retribucionFlexible||[]).reduce((a,e)=>a+(e.importe||0)*12,0)}function ks(t){return Math.max(0,(t.bruto||0)-Ce(t))}function Sc(t){return[...t].sort((a,e)=>(e.bruto||0)-(a.bruto||0)||String(a._id).localeCompare(String(e._id)))}function Mc(t){const a=t.reduce((i,r)=>i+(r.bruto||0),0),e=t.reduce((i,r)=>i+Ce(r),0),o=Math.max(0,a-e),s=Yt(a,e),n=new Map;for(const i of t)n.set(i._id,o>0?s*(ks(i)/o):0);return n}function Ls(t,a,e){if(t.irpfModo==="manual")return ks(t)*((t.irpfPct||0)/100);if(!a||a.length===0)return zt(Yt(t.bruto||0,Ce(t)),e);const o=Sc(a.filter(i=>i.irpfModo!=="manual")),s=Mc(a);let n=0;for(const i of o){const r=s.get(i._id)??0;if(i._id===t._id)return zt(n+r,e)-zt(n,e);n+=r}return zt(Yt(t.bruto||0,Ce(t)),e)}function Ac(t,a){return t.reduce((e,o)=>e+Ls(o,t,a),0)}function Ec(t,a){var s;const e=[...a||[]].sort((n,i)=>n[0]-i[0]);let o=((s=e[0])==null?void 0:s[1])??19;for(const[n,i]of e)if(t>=n)o=i;else break;return o}function Pc(t,a){if(!t||t.length===0)return 0;const e=t.reduce((s,n)=>s+(n.bruto||0),0),o=t.reduce((s,n)=>s+Ce(n),0);return Ec(Yt(e,o),a)}function _c(t,a,e){const o=t.bruto||0,s=Ce(t),n=Math.max(0,o-s),i=t.nPagas||12,r=t.ssPct??Za,c=n*(r/100),l=Ls(t,a,e);return{brutoAnual:o,flexAnual:s,baseDineraria:n,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:l,irpfPct:n>0?l/n*100:0,netoPorPaga:(n-c-l)/i}}function Fc(t){const a=new Map,e=[];for(const o of t){const s=o.grupoNomina||"";if(!s){e.push(o);continue}const n=a.get(s)??[];n.push(o),a.set(s,n)}return{grupos:a,sueltas:e}}const Dc={transporte:125,restaurante:220,otros:null},Tc={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},zc=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Se=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(s)}"/></div>`,jc=(t,a)=>t.filter(e=>e.activo!==!1).map(e=>`<option value="${m(e._id)}"${e._id===a?" selected":""}>${m(e.nombre)}</option>`).join("");function qc(t,a){const e=t.map((n,i)=>{const r=a.find(p=>p._id===n.cuenta),c=Dc[n.tipo],l=c!=null&&n.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${m(Tc[n.tipo]??n.tipo)}</span>
        <span style="flex:1;font-size:12px">${m(T(n.importe))}/mes${l?` <span style="color:var(--red)" title="Supera el límite orientativo de ${m(T(c))}/mes">⚠</span>`:""}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function Nc(t,a){const e=a.hoy??et(),o=(t==null?void 0:t.nPagas)??12,s=[12,14,16].includes(o);return`
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
        <select class="form-select" id="nf-cuenta">${jc(a.accounts,(t==null?void 0:t.cuenta)??a.cuentaPrincipal)}</select></div>
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
              ${zc.map((n,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${m(n)} (${i+1})</option>`).join("")}
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
            <input class="form-input" type="number" id="nf-sspct" value="${((t==null?void 0:t.ssPct)??Za).toFixed(2)}" min="0" max="50" step="0.01" placeholder="6.35"/>
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
    </div>`}function Os(t,a){const e=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(e(i));return Number.isFinite(c)?c:r},s=e("#nf-npagas"),n=s==="custom"?parseInt(e("#nf-npagas-custom"),10)||12:parseInt(s,10)||12;return{nombre:e("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:n,irpfModo:e("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Za),representacion:e("#nf-representacion")||"detallado",fechaInicio:e("#nf-fecha-ini"),fechaFin:e("#nf-fecha-fin")||null,cuenta:e("#nf-cuenta"),grupoNomina:e("#nf-grupo").trim(),mesActualizacionIPC:parseInt(e("#nf-mes-ipc"),10)||null,retribucionFlexible:a,repartoConsumo:we(t,"consumo"),repartoPago:we(t,"pago")}}function Rc(t,a,e,o){const s=Os(t,a),n=a.reduce((f,y)=>f+(y.importe||0)*12,0),i=Math.max(0,s.bruto-n),r=i*(s.ssPct/100),c=s.irpfModo==="manual"?i*(s.irpfPct/100):zt(Yt(s.bruto,n),e.tramos),l=i-r-c,p=i/s.nPagas,d=r/s.nPagas,u=c/s.nPagas,v=p-d-u,g=s.grupoNomina?e.nominas.filter(f=>f.grupoNomina===s.grupoNomina&&f._id!==o):[],h=g.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${m(s.grupoNomina)}" con ${m(g.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",x=n>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${m(T(n))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${m(T(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${m(T(s.bruto))}</span>
      ${x}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${m(T(r))} (${s.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${m(T(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${m(T(l))}</span>
      ${n>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${m(T(n))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${m(T(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${s.representacion==="simplificado"?`ingreso ${m(T(v))}/paga`:`ingreso ${m(T(p))} − SS ${m(T(d))} − IRPF ${m(T(u))}`}${n>0?" + recargas flex":""}</span>
    </div>${h}`}function kc(t,a,e,o){const s=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=qc(a,e.accounts))},n=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=Rc(t,a,e,o))},i=()=>{var c,l;const r=(p,d)=>{const u=t.querySelector(p);u&&(u.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((l=t.querySelector("#nf-irpfmodo"))==null?void 0:l.value)==="manual"),n()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&n()}),J(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),J(t,'[data-reparto-modo="consumo"]',()=>Ie(t,"consumo")),J(t,'[data-reparto-modo="pago"]',()=>Ie(t,"pago")),q(t,"[data-flex-anadir]",()=>{var l,p,d;const r=((l=t.querySelector("#fc-tipo"))==null?void 0:l.value)||"transporte",c=parseFloat(((p=t.querySelector("#fc-importe"))==null?void 0:p.value)??"")||0;if(!c)return O("Importe requerido","err");a.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),s(),n()}),q(t,"[data-flex-borrar]",r=>{a.splice(Number(r.getAttribute("data-flex-borrar")),1),s(),n()}),s(),n()}const Hs=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function Lc(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),s=()=>kt(),n=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??Ut;function r(u,v){const g=o(),h=s();return!g||!h?null:(h.innerHTML=`<div class="modal-title">${m(u)}</div>${v}`,g.classList.remove("hidden"),q(h,"[data-cerrar]",n),h)}function c(){a=null;const u=[...t.store.get("tramosIRPFHistorico")].sort((h,x)=>h.año-x.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${m(Hs(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${u.map(h=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${h.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(Hs(h.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tabla="${h.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tabla="${h.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="irpf-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);g&&(q(g,"[data-editar-tabla]",h=>{const x=h.getAttribute("data-editar-tabla");d(x==="default"?"default":Number(x))}),q(g,"[data-borrar-tabla]",h=>{const x=Number(h.getAttribute("data-borrar-tabla"));wt(`¿Eliminar la tabla del ejercicio ${x}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==x)),O(`Tabla ${x} eliminada`),t.onDatosCambiados(),c())}),q(g,"[data-anadir-anyo]",()=>{var f;const h=parseInt(((f=g.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!h||h<2e3||h>2100)return O("Año inválido","err");const x=t.store.get("tramosIRPFHistorico");if(x.some(y=>y.año===h))return O("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...x,{_id:Date.now().toString(36),año:h,tramos:i().map(y=>[...y])}]),t.onDatosCambiados(),d(h)}))}function l(){return e.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function p(u){e=[...u.querySelectorAll("[data-tr-min]")].map((g,h)=>{const x=u.querySelector(`[data-tr-pct="${h}"]`);return[parseFloat(g.value)||0,parseFloat((x==null?void 0:x.value)??"")||0]})}function d(u){var y;a=u;const v=t.store.get("tramosIRPFHistorico");e=(u==="default"?i():((y=v.find(S=>S.año===u))==null?void 0:y.tramos)??i()).map(S=>[...S]);const h=u==="default"?"tabla por defecto":`ejercicio ${u}`,x=r(`Tramos IRPF — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${m(h)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!x)return;const f=()=>{const S=x.querySelector("#irpf-tramos-rows");S&&(S.innerHTML=l())};q(x,"[data-volver]",c),q(x,"[data-tr-anadir]",()=>{p(x),e.push([0,0]),f()}),q(x,"[data-tr-borrar]",S=>{p(x),e.splice(Number(S.getAttribute("data-tr-borrar")),1),f()}),q(x,"[data-tr-guardar]",()=>{p(x);const S=[...e].sort((w,I)=>w[0]-I[0]);if(S.length===0)return O("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramos_irpf:S}),O("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(w=>w.año===a?{...w,tramos:S}:w)),O(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const Bs=1500,ne=(t,a,e,o,s="")=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <input class="form-input" type="${e}" id="${t}" value="${m(o)}" placeholder="${m(s)}"/></div>`,Oc=(t,a,e,o)=>`<div class="form-group"><label class="form-label">${m(a)}</label>
   <select class="form-select" id="${t}">
     ${e.map(([s,n])=>`<option value="${m(s)}"${s===o?" selected":""}>${m(n)}</option>`).join("")}
   </select></div>`,Hc=t=>(t.modeloFondo||"cuenta")==="pension";function Bc(t,a,e,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(s=>Gc(s,a,e,o)).join("")}</div>`}function Gc(t,a,e,o){const s=Ma(t);if(!s)return"";const n=Aa(t,a,e),i=o.slice(0,4),r=(t.aportaciones||[]).filter(l=>l.fecha>=`${i}-01-01`).reduce((l,p)=>l+p.cantidad,0),c=Math.min(r,Bs)*(n/100);return`<div class="card">
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
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${m(T(s.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(T(s.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${s.beneficio>=0?"pos":"neg"}">${m(T(s.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(T(s.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(T(s.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${m(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>Bs?"neg":""}">${m(T(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${m(T(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${m(t.grupoNomina)}": ${n}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${s.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${m(s.proxDesbloqueo)}</div>`:""}
  </div>`}function Vc(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${m(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${m(T(e.importe))} / ${m(e.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function Uc(t,a){const e=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=e[0]?e[0].saldo:(t==null?void 0:t.saldo)??0,s=[...new Set(a.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],n=!!(t!=null&&t.grupoNomina);return`
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
      ${Oc("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
    </div>`}function Yc(t,a,e){const o=()=>{const s=t.querySelector("#pen-aport-container");s&&(s.innerHTML=Vc(a))};J(t,"#pen-grupo",s=>{const n=t.querySelector("#pen-impuesto-wrap");n&&(n.style.display=s.value?"none":"")}),q(t,"[data-aport-anadir]",()=>{var n,i,r,c;const s=parseFloat(((n=t.querySelector("#paport-importe"))==null?void 0:n.value)??"")||0;if(!s)return O("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),q(t,"[data-aport-borrar]",s=>{a.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function Wc(t,a,e,o){var x;const s=f=>{var y;return((y=t.querySelector(f))==null?void 0:y.value)??""},n=(f,y=0)=>{const S=parseFloat(s(f));return Number.isFinite(S)?S:y},i=f=>{var y;return!!((y=t.querySelector(f))!=null&&y.checked)},r=s("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=n("#pen-saldo"),l=s("#pen-grupo"),p={nombre:r,grupoNomina:l,saldo:c,saldoInicial:n("#pen-saldo-ini"),fechaInicialSaldo:s("#pen-fecha-ini")||o,interes:n("#pen-interes"),periodoCobro:s("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(s("#pen-bloqueo"),10)||120,impuestoRetirada:l?0:n("#pen-impuesto"),planAportaciones:a,descripcion:s("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},d=[...(e==null?void 0:e.historicoSaldos)??[]],u=[...(e==null?void 0:e.aportaciones)??[]],g=((x=[...d].sort((f,y)=>y.fecha.localeCompare(f.fecha))[0])==null?void 0:x.saldo)??(e==null?void 0:e.saldo)??null,h=Date.now().toString(36);return e?(g===null||Math.abs(c-g)>.005)&&(d.push({_id:h,fecha:o,saldo:c,nota:"Actualización manual"}),c>(g??0)&&u.push({_id:`${h}a`,fecha:o,cantidad:c-(g??0)})):c>0&&(d.push({_id:h,fecha:o,saldo:c,nota:"Saldo inicial"}),u.push({_id:`${h}a`,fecha:p.fechaInicialSaldo??o,cantidad:c})),{datos:{...p,historicoSaldos:d,aportaciones:u}}}const Kc="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function Jc(t){const a=t.hoy??et,e=()=>{var y;return(y=t.onDatosCambiados)==null?void 0:y.call(t)};let o=null;function s(y){const S=y.filter(I=>I.activo);if(S.length<2)return"";const w=(I,E)=>`<button class="btn-secondary btn-sm" data-persona-tab="${I===null?"":m(I)}"
               style="${o===I?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(E)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${w(null,"Todas")}
      ${S.map(I=>w(I._id,I.nombre)).join("")}
    </div>`}function n(){const y=t.store.get("config");return me(t.store.get("tramosIRPFHistorico"),y.tramos_irpf??Ut)(Number(a().slice(0,4)))}function i(y,S,w){const I=_c(y,S,w),E=!!S&&y.irpfModo!=="manual",A=Qa(y.repartoConsumo,y.repartoPago,t.store.get("personas")),C=[y.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${y.mesActualizacionIPC}">IPC m${y.mesActualizacionIPC}</span>`:"",I.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${m(T(I.flexAnual))}/año</span>`:"",Math.abs(I.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${I.ssPct.toFixed(2)}%</span>`:"",A?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(A)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(y.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${C}</div>
      </div>
      <div class="num">${m(T(I.brutoAnual))}
        ${I.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${m(T(I.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${m(T(I.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${I.nPagas} pagas</div>
      <div class="text-sm ${E?"neg":""}">${y.irpfModo==="manual"?`${m(y.irpfPct??0)}% (manual)`:`${I.irpfPct.toFixed(1)}% (auto)`}${E?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${y.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${m(r(y.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${m(y._id)}"${y.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${m(y._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${m(y._id)}">✕</button>
      </div>
    </div>`}const r=y=>{var S;return((S=t.store.get("accounts").find(w=>w._id===(y||"default")))==null?void 0:S.nombre)??(y||"default")};function c(y,S,w){const I=S.reduce((C,$)=>C+($.bruto||0),0),E=Ac(S,w),A=I>0?E/I*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${m(y)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${m(T(I))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${A.toFixed(1)}%</strong> (${m(T(E))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${S.map(C=>i(C,S,w)).join("")}
      </div>
    </div>`}function l(y){const S=n(),w=t.store.get("personas"),I=Je(w),E=[...t.store.get("nominas")].sort((M,b)=>(b.bruto||0)-(M.bruto||0)),A=o?E.filter(M=>Ca(M.repartoConsumo,M.repartoPago,I).has(o)):E,{grupos:C,sueltas:$}=Fc(A),P=t.store.get("accounts").filter(Hc),F=E.filter(M=>M.activo!==!1);y.innerHTML=`
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
      ${A.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...C.entries()].map(([M,b])=>c(M,b,S)).join("")}
      ${$.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${$.map(M=>i(M,null,S)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Bc(P,F,S,a())}</div>`}const p=()=>document.getElementById("modal-overlay"),d=()=>kt(),u=()=>{var y;return(y=p())==null?void 0:y.classList.add("hidden")};function v(y,S){const w=p(),I=d();return!w||!I?null:(I.innerHTML=`<div class="modal-title">${m(y)}</div>${S}`,w.classList.remove("hidden"),q(I,"[data-cancelar]",u),I)}function g(y,S){const w=y?t.store.get("nominas").find(C=>C._id===y)??null:null,I=[...(w==null?void 0:w.retribucionFlexible)??[]].map(C=>({...C})),E={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:n(),hoy:a()},A=v(y?"Editar nómina":"Nueva nómina",Nc(w,E));A&&(kc(A,I,E,y??""),q(A,"[data-guardar-nomina]",C=>{const $=Os(A,I);if(!$.nombre||$.bruto<=0)return O("Nombre y bruto anual son obligatorios","err");const P=C.getAttribute("data-guardar-nomina")||"",F={...$,activo:!0,tags:["nomina"]};P?(t.store.updateItem("nominas",P,F),O("Nómina actualizada")):(t.store.addItem("nominas",F),O("Nómina creada")),e(),u(),S()}))}function h(y,S){const w=y?t.store.get("accounts").find(A=>A._id===y)??null:null,I=[...(w==null?void 0:w.planAportaciones)??[]].map(A=>({...A})),E=v(y?"Editar plan de pensiones":"Nuevo plan de pensiones",Uc(w,{nominas:t.store.get("nominas"),hoy:a()}));E&&(Yc(E,I,a()),q(E,"[data-guardar-pension]",A=>{const{datos:C,error:$}=Wc(E,I,w,a());if($)return O($,"err");const P=A.getAttribute("data-guardar-pension")||"";P?(t.store.updateItem("accounts",P,C),O("Plan actualizado")):(t.store.addItem("accounts",C),O("Plan creado")),e(),u(),S()}))}function x(y,S,w){q(y,"[data-persona-tab]",I=>{o=I.getAttribute("data-persona-tab")||null,S()}),q(y,"[data-nueva-nomina]",()=>g(null,S)),q(y,"[data-editar-nom]",I=>g(I.getAttribute("data-editar-nom"),S)),q(y,"[data-borrar-nom]",I=>{wt("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",I.getAttribute("data-borrar-nom")),O("Eliminada"),e(),S())}),J(y,"[data-activo-nom]",I=>{const E=I;t.store.updateItem("nominas",E.getAttribute("data-activo-nom"),{activo:E.checked}),e(),S()}),q(y,"[data-tramos]",()=>w.abrir()),q(y,"[data-nueva-pension]",()=>h(null,S)),q(y,"[data-editar-pension]",I=>h(I.getAttribute("data-editar-pension"),S)),q(y,"[data-borrar-pension]",I=>{wt("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",I.getAttribute("data-borrar-pension")),O("Plan eliminado"),e(),S())})}let f=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:Kc,mount(y){const S=()=>l(y);f??(f=Lc({store:t.store,onDatosCambiados:()=>{e(),S()},año:()=>Number(a().slice(0,4))})),l(y),y.dataset.wired!=="1"&&(x(y,S,f),y.dataset.wired="1")}}}const Qc="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",Xc="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",Gs={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},Zc={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function tl(t,a){const e=t.filter(c=>c.activo&&_t(c)==="inversion");if(e.length===0)return"";let o=0,s=0,n=0,i=0;for(const c of e){const l=Qe(c,a);l&&(o+=l.saldo,s+=l.costBase,n+=l.plusvalia,i+=l.impuesto)}const r=s>0?(n/s*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${m(T(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${m(T(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${m(r)}%)</div><div class="stat-value ${n>=0?"pos":"neg"}">${m(T(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${m(T(i))}</div><div class="stat-sub">Neto: ${m(T(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function el(t,a){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:e,dashboardEnd:o}=a.config,s=Math.max(1,(V(o).getTime()-V(e).getTime())/(30.44*864e5)),n=Pe(t,e),i=n*(Math.pow(1+t.interes/100,s/12)-1);let r="";if(a.config.usarInflacion&&a.inflacion.length>0){const c=n*(Gt(a.inflacion,e,o)-1),l=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${m(T(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${l>=0?"var(--accent)":"var(--red)"};font-weight:600">${m(T(l))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${m(e.slice(0,7))} → ${m(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${m(T(i))}</span>
    </div>${r}
  </div>`}function al(t,a){const e=Gs[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=e,s=a.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(g=>g.cuenta===t._id).map(g=>({nomina:v,importe:g.importe}))),n=s.reduce((v,g)=>v+g.importe,0),i=n*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,l=t.grupoNomina?a.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):s.slice(0,1).map(v=>v.nomina),p=Pc(l,a.tramosIRPF),d=c*p/100,u=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${p}%`:`tipo marginal ${p}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${m(e.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${m(T(n))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${m(T(i))}/año${r?` ⚠ excede límite ${m(T(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${m(T(o))}/año</span></div>`:""}
    ${d>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${m(u)}">≈ ${m(T(d))}/año <span style="font-size:10px;color:var(--text3)">(${m(p)}%)</span></span></div>`:""}
    ${s.length>0?s.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${m(v.nomina.nombre)}: ${m(T(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function ol(t){const a=Ma(t);return a?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(T(a.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(T(a.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${a.beneficio>=0?"pos":"neg"}">${m(T(a.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${m(T(a.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${a.proxDesbloqueo?`Próx. desbloqueo: ${m(a.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${m(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${a.numAportaciones} aportaciones
    </div>
  </div>`:""}function sl(t,a){const e=Qe(t,a.tramosGanancias);if(!e)return"";const o=a.config,s=a.flujos(t._id),n=V(o.dashboardStart),i=V(o.dashboardEnd),r=Math.max(0,(i.getTime()-n.getTime())/(30.44*864e5)),c=e.saldo+s.totalAportaciones-s.totalReembolsos,l=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,p=c>0&&r>0?Math.max(0,c*Math.pow(1+l,r)):Math.max(0,c),d=e.costBase+s.totalAportaciones,u=Math.max(0,p-d),v=Sa(u,a.tramosGanancias),g=u>0?(v/u*100).toFixed(1):"0",h=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",x=e.saldo>0?(e.plusvalia/e.saldo*100).toFixed(1):"0",f=(A,C,$)=>A.map(P=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${C} ${m(P.contraparte)}: ${m(P.concepto)}</span>
          <span class="num ${$}">${m(T(P.total))} · ${P.ocurrencias} mov.</span>
        </div>`).join(""),S=s.entradas.length>0||s.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${m(o.dashboardStart.slice(0,7))} → ${m(o.dashboardEnd.slice(0,7))})</div>
         ${f(s.entradas,"↓","pos")}
         ${f(s.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${s.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${m(T(s.totalAportaciones))}</span></div>`:""}
           ${s.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${m(T(s.totalReembolsos))}</span></div>`:""}
           ${s.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${m(T(s.retencion))}</span></div>`:s.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',w=a.invModo(t._id),I=A=>`padding:3px 10px;border-radius:20px;border:1px solid ${A?"var(--accent)":"var(--border)"};background:${A?"var(--accent-dim)":"transparent"};color:${A?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,E=w==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(T(e.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${m(T(e.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${m(T(e.neto))}</div><div class="stat-sub">${m(x)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${m(T(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${m(T(p))}</div><div class="stat-sub">${m(h)} · ${m(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${m(T(p-v))}</div><div class="stat-sub">${m(g)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${m(t._id)}|real" style="${I(w==="real")}">Real</button>
          <button data-inv-modo="${m(t._id)}|proyeccion" style="${I(w==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${E}
      ${S}
    </div>`}function nl(t,a){const e=[...t.historicoSaldos||[]].sort((c,l)=>l.fecha.localeCompare(c.fecha)),o=e[0],s=Vt(t),n=_t(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",n==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",n==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",n==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${m((Gs[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${m(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${m(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${m(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${Xc}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${Qc}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${m(T(t.saldoInicial||0))}</div><div class="stat-sub">${m(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${m(T(s))}</div>${o?`<div class="stat-sub">Registro: ${m(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${m(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${m(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${el(t,a)}
    ${n==="beneficio"?al(t,a):""}
    ${n==="pension"?ol(t):""}
    ${n==="inversion"?sl(t,a):""}
    ${e.length>0?`<div class="text-sm mt-8">${e.length} punto${e.length>1?"s":""} en histórico · último ${m(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${m(t.descripcion)}</div>`:""}
  </div>`}const il=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function rl(t){return`<div>${t.map((e,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${m(e.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${m(T(e.importe))} / ${m(e.periodicidad)}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function cl(t,a){const e=t?_t(t):"cuenta",o=[...new Set(a.nominas.filter(n=>n.grupoNomina).map(n=>n.grupoNomina))],s=n=>n?"":' style="display:none"';return`
    <div class="grid-2">
      ${Ct("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Be("ac-modelo","Tipo",il,e)}
    </div>
    <div class="grid-2 mt-8">
      ${Ct("ac-saldo","Saldo actual (€)","number",a.saldoActual,"5000")}
      ${Ct("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${Ct("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${Ct("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??a.hoy)}
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
    </div>`}function ll(t,a,e){const o=()=>{const s=t.querySelector("#ac-aport-container");s&&(s.innerHTML=rl(a))};J(t,"#ac-modelo",s=>{const n=s.value,i=(r,c)=>{const l=t.querySelector(r);l&&(l.style.display=c?"":"none")};i("#ac-inversion-hint",n==="inversion"),i("#ac-beneficio-fields",n==="beneficio")}),q(t,"[data-aport-anadir]",()=>{var n,i,r,c;const s=parseFloat(((n=t.querySelector("#aport-importe"))==null?void 0:n.value)??"")||0;if(!s)return O("Importe requerido","err");a.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||e,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),q(t,"[data-aport-borrar]",s=>{a.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function dl(t,a,e,o,s){const n=g=>{var h;return((h=t.querySelector(g))==null?void 0:h.value)??""},i=(g,h=0)=>{const x=parseFloat(n(g));return Number.isFinite(x)?x:h},r=g=>{var h;return!!((h=t.querySelector(g))!=null&&h.checked)},c=n("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const l=n("#ac-modelo")||"cuenta",p=l==="beneficio",d=i("#ac-saldo"),u={nombre:c,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:n("#ac-fecha-ini")||s,interes:i("#ac-interes"),periodoCobro:n("#ac-periodo")||"mensual",descripcion:n("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:l,planAportaciones:a,tipoBeneficio:p?n("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:p?n("#ac-beneficio-grupo"):(e==null?void 0:e.grupoNomina)??"",...e?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!e&&d<=0)return{datos:u};if(!(o===null||Math.abs(d-o)>.005))return{datos:u};if(l==="inversion"&&d>(o??0)){const g=Date.now().toString(36);u.aportaciones=[...(e==null?void 0:e.aportaciones)??[],{_id:`${g}a`,fecha:e?s:u.fechaInicialSaldo??s,cantidad:d-(o??0)}]}return{datos:u,punto:{fecha:s,saldo:d,nota:e?"Actualización manual":"Saldo inicial"}}}function to(t){return[...t].sort((a,e)=>e.fecha.localeCompare(a.fecha)).map(a=>({_id:a._id,fecha:a.fecha,saldo:it(a.saldoCts),nota:a.nota,derivado:a.origen==="derivado"}))}function ul(t,a,e,o,s){const n=e.map(r=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${r.derivado?";opacity:0.75":""}">
        <span class="num" style="min-width:110px">${m(r.fecha)}</span>
        <span class="num" style="flex:1;color:${r.saldo>=o?"var(--accent)":"var(--red)"}">${m(T(r.saldo))}</span>
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
    </div>`}const Vs=t=>t.slice(0,3).map(([,a])=>`${a}%`).join(" · ")+(t.length>3?" …":"");function pl(t){let a=null,e=[];const o=()=>document.getElementById("modal-overlay"),s=()=>kt(),n=()=>{var u;return(u=o())==null?void 0:u.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??_e;function r(u,v){const g=o(),h=s();return!g||!h?null:(h.innerHTML=`<div class="modal-title">${m(u)}</div>${v}`,g.classList.remove("hidden"),q(h,"[data-cerrar]",n),h)}function c(){a=null;const u=[...t.store.get("tramosGananciasCapitalHistorico")].sort((h,x)=>h.año-x.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${m(Vs(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${u.map(h=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${h.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(Vs(h.tramos))}</span>
              <div class="flex gap-6">
                <button class="btn-secondary btn-sm" data-editar-tg="${h.año}">Editar</button>
                <button class="btn-danger btn-sm" data-borrar-tg="${h.año}">✕</button>
              </div>
            </div>`).join("")}
      </div>
      <div class="flex gap-8 items-center mt-4">
        <input class="form-input" type="number" id="tg-new-year" placeholder="Año (ej: ${t.año()})" style="width:130px;flex:none" min="2000" max="2100"/>
        <button class="btn-secondary" data-anadir-anyo-tg>+ Añadir tabla para año</button>
      </div>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cerrar>Cerrar</button>
      </div>`);g&&(q(g,"[data-editar-tg]",h=>{const x=h.getAttribute("data-editar-tg");d(x==="default"?"default":Number(x))}),q(g,"[data-borrar-tg]",h=>{const x=Number(h.getAttribute("data-borrar-tg"));wt(`¿Eliminar la tabla del ejercicio ${x}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==x)),O(`Tabla ${x} eliminada`),t.onDatosCambiados(),c())}),q(g,"[data-anadir-anyo-tg]",()=>{var f;const h=parseInt(((f=g.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!h||h<2e3||h>2100)return O("Año inválido","err");const x=t.store.get("tramosGananciasCapitalHistorico");if(x.some(y=>y.año===h))return O("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...x,{_id:Date.now().toString(36),año:h,tramos:i().map(y=>[...y])}]),t.onDatosCambiados(),d(h)}))}function l(){return e.map(([u,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${g}" value="${u}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function p(u){e=[...u.querySelectorAll("[data-tg-min]")].map((v,g)=>{const h=u.querySelector(`[data-tg-pct="${g}"]`);return[parseFloat(v.value)||0,parseFloat((h==null?void 0:h.value)??"")||0]})}function d(u){var f;a=u;const v=t.store.get("tramosGananciasCapitalHistorico");e=(u==="default"?i():((f=v.find(y=>y.año===u))==null?void 0:f.tramos)??i()).map(y=>[...y]);const h=r(`Ganancias de capital — ${u==="default"?"Por defecto":u}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!h)return;const x=()=>{const y=h.querySelector("#tg-rows");y&&(y.innerHTML=l())};q(h,"[data-volver-tg]",c),q(h,"[data-tg-anadir]",()=>{p(h),e.push([0,0]),x()}),q(h,"[data-tg-borrar]",y=>{p(h),e.splice(Number(y.getAttribute("data-tg-borrar")),1),x()}),q(h,"[data-tg-guardar]",()=>{p(h);const y=[...e].sort((S,w)=>S[0]-w[0]);if(y.length===0)return O("Añade al menos un tramo","err");a==="default"?(t.store.patchConfig({tramosGananciasCapital:y}),O("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(S=>S.año===a?{...S,tramos:y}:S)),O(`Tabla ${a} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const ml=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function fl(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${ml.map(a=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${a.id}" style="${a.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${a.etiqueta}</button>`).join("")}
  </div>`}function gl(t){const[a,e]=t.split("-").map(Number);return`${t}-${String(new Date(a,e,0).getDate()).padStart(2,"0")}`}function vl(t,a){const e=[];let[o,s]=t.slice(0,7).split("-").map(Number);const[n,i]=a.slice(0,7).split("-").map(Number);for(;o<n||o===n&&s<=i;)e.push(`${o}-${String(s).padStart(2,"0")}`),s+=1,s>12&&(s=1,o+=1);return e}function bl(t,a,e,o){const s=r=>a.filter(c=>c.tipo===r&&c.activo!==!1),n=s("gasto"),i=s("ingreso");return vl(e,o).map(r=>{const c={desde:`${r}-01`,hasta:gl(r)},l=h=>K(t.transacciones({...c,tipo:h}).reduce((x,f)=>x+Math.abs(f.importeCts)/100,0)),p=h=>K(h.reduce((x,f)=>x+Ei(f,r),0)),d=p(n),u=l("gasto"),v=p(i),g=l("ingreso");return{mes:r,estimado:d,real:u,ingresosEstimados:v,ingresosReales:g,netoEstimado:K(v-d),netoReal:K(g-u)}})}const da=640,Me=200,gt={top:14,right:16,bottom:26,left:54};function hl(t){return ht(t).slice(0,3)}const yl={gasto:t=>({estimado:t.estimado,real:t.real}),ingreso:t=>({estimado:t.ingresosEstimados,real:t.ingresosReales}),neto:t=>({estimado:t.netoEstimado,real:t.netoReal})};function $l(t,a="gasto"){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const e=yl[a],o=t.flatMap(x=>[e(x).estimado,e(x).real]),s=da-gt.left-gt.right,n=Me-gt.top-gt.bottom,i=Math.max(1,...o),r=Math.min(0,...o),c=i-r||1,l=x=>gt.left+(t.length===1?s/2:x/(t.length-1)*s),p=x=>gt.top+n-(x-r)/c*n,d=t.map((x,f)=>`${l(f)},${p(e(x).estimado)}`).join(" "),u=t.map((x,f)=>`${l(f)},${p(e(x).real)}`).join(" "),v=r<0?`<line x1="${gt.left}" y1="${p(0).toFixed(1)}" x2="${da-gt.right}" y2="${p(0).toFixed(1)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,3"/>`:"",g=t.map((x,f)=>`<circle cx="${l(f).toFixed(1)}" cy="${p(e(x).real).toFixed(1)}" r="3" fill="var(--accent)"><title>${m(ht(x.mes))}: ${m(T(e(x).real))}</title></circle>`).join(""),h=t.map((x,f)=>`<text x="${l(f).toFixed(1)}" y="${Me-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${m(hl(x.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${da} ${Me}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Real frente a estimado por mes">
      <line x1="${gt.left}" y1="${gt.top}" x2="${gt.left}" y2="${Me-gt.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${gt.left}" y1="${Me-gt.bottom}" x2="${da-gt.right}" y2="${Me-gt.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${gt.top+8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${m(T(i))}</text>
      ${v}
      <polyline points="${d}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${u}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${g}
      ${h}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`}const Us={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"},xl=[25,50,100,250,0];function Il(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:Ws(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:Ve(Ws(t,5)).desde,intervaloHasta:Ve(t).hasta,comparativa:"neto",pagina:1,porPagina:50}}function Ys(t,a,e){const o=t.length;if(e<=0)return{pagina:t,actual:1,paginas:1,total:o,desde:o>0?1:0,hasta:o};const s=Math.max(1,Math.ceil(o/e)),n=Math.min(Math.max(1,a),s),i=(n-1)*e;return{pagina:t.slice(i,i+e),actual:n,paginas:s,total:o,desde:o>0?i+1:0,hasta:Math.min(i+e,o)}}function ua(t,a,e){if(t.total===0)return"";const o=(n,i,r,c)=>`<button class="btn-secondary btn-sm" data-acc-pagina="${n}" ${r?"":"disabled"} title="${m(c)}"
             style="padding:2px 9px;font-size:11px${r?"":";opacity:0.4;cursor:default"}">${i}</button>`,s=xl.map(n=>`<option value="${n}"${n===a?" selected":""}>${n===0?"todos":`${n} por página`}</option>`).join("");return`
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
    </div>`}function eo(t,a,e,o){const s=t===a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-acc-comparativa="${t}" title="${m(o)}" style="${s}">${m(e)}</button>`}function Ve(t){const[a,e]=t.split("-").map(Number),o=new Date(a,e,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Ws(t,a){const[e,o]=t.split("-").map(Number),s=new Date(e,o-1-a,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function ao(t,a){const[e,o]=t<=a?[t,a]:[a,t];return{desde:Ve(e).desde,hasta:Ve(o).hasta}}function wl(t,a){return t<=a?{desde:t,hasta:a}:{desde:a,hasta:t}}function oo(t){const a=new Map;for(const e of t){const o=e.concepto.trim(),s=a.get(o);s?s.push(e):a.set(o,[e])}return[...a.entries()].filter(([,e])=>e.length>1).map(([e,o])=>{const s=new Set(o.map(n=>n.estimacionId??null));return{concepto:e,movimientos:o.slice().sort((n,i)=>n.fecha.localeCompare(i.fecha)),total:o.reduce((n,i)=>n+i.importeCts,0),estimacionComun:s.size===1?s.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(n=>n.tags))].sort()}}).sort((e,o)=>o.movimientos.length-e.movimientos.length||e.concepto.localeCompare(o.concepto))}function Cl(t,a){if(t.tagsComunes.length===0)return null;const e=new Set(t.movimientos.map(n=>n._id)),o=a.filter(n=>!e.has(n._id)&&n.tipo==="gasto"&&n.tags.some(i=>t.tagsComunes.includes(i))).reduce((n,i)=>n+Math.abs(i.importeCts),0),s=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:s,gastadoCts:o,diferenciaCts:o-s}}function Sl(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const a=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",e=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${m(T(it(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${m(T(it(t.gastadoCts)))}</strong></span>
      <span style="color:${a}">Diferencia: <strong style="font-family:var(--font-mono)">${e}${m(T(it(t.diferenciaCts)))}</strong></span>
    </div>`}function Ml(t,a){const{ledger:e}=t,o=(t.hoy??et)(),s=t.accounts().filter(b=>b.activo),n=a.vista==="agrupado",i=a.vista==="intervalo",{desde:r,hasta:c}=n?ao(a.periodoDesde,a.periodoHasta):i?wl(a.intervaloDesde,a.intervaloHasta):Ve(a.mes),l={cuentaId:a.cuentaId||void 0,desde:r,hasta:c,texto:a.filtroTexto||void 0},p=e.transacciones(l),d=t.estimaciones().filter(b=>b.tipo!=="transferencia"),u=[...d.map(b=>({_id:b._id,etiqueta:`${m(b.concepto)} (${m(T(b.cuantia))})`})),...t.loans().filter(b=>b.activo).map(b=>({_id:b._id,etiqueta:`Préstamo: ${m(b.nombre)}`})),...t.nominas().filter(b=>b.activo).map(b=>({_id:b._id,etiqueta:`Nómina: ${m(b.nombre)}`}))],v=p.filter(b=>b.tipo!=="transferencia"&&b.importeCts<0).reduce((b,D)=>b+D.importeCts,0),g=p.filter(b=>b.tipo!=="transferencia"&&b.importeCts>0).reduce((b,D)=>b+D.importeCts,0),h=a.cuentaId?e.saldoCuenta(a.cuentaId,c):e.saldoTotal(c),x=a.cuentaId?e.puntosControl(a.cuentaId):e.puntosControl(),f=s.map(b=>`<option value="${m(b._id)}"${b._id===a.cuentaId?" selected":""}>${m(b.nombre)}</option>`).join(""),y=b=>'<option value="">— sin asignar —</option>'+u.map(D=>`<option value="${m(D._id)}"${D._id===b?" selected":""}>${D.etiqueta}</option>`).join(""),S=b=>Object.keys(Us).map(D=>`<option value="${D}"${D===b?" selected":""}>${Us[D]}</option>`).join(""),w=Ys(p,a.pagina,a.porPagina),I=new Map(t.accounts().map(b=>[b._id,b.nombre])),E=w.pagina.map(b=>`
      <tr data-tx="${m(b._id)}" style="border-bottom:1px solid var(--border)${b.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${m(b.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${m(b.concepto)}</td>
        <td style="padding:7px 8px">${es(b.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${m(I.get(b.cuentaId)??b.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${m(b._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${S(b.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${m(b._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${y(b.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Jt(it(b.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          ${b.importeCts<0&&b.tipo!=="transferencia"?`<button type="button" class="btn-secondary tx-imprevisto${b.imprevisto?" activo":""}" data-tx-imprevisto="${m(b._id)}" aria-pressed="${b.imprevisto?"true":"false"}"
                  title="${b.imprevisto?b.estimacionId?"Marcado como imprevisto, pero cuenta a través de su estimación":"Marcado como imprevisto. Pulsa para quitar la marca":"Marcar como imprevisto"}">⚡${b.imprevisto?" Imprevisto":""}</button>`:""}
          <button class="btn-secondary" data-tx-editar="${m(b._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${m(b._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`).join(""),A=i?bl(e,d,r,c):[],C=n?e.transacciones({desde:r,hasta:c}):[],$=n?oo(p):[],P=Ys($,a.pagina,a.porPagina),F=P.pagina.map(b=>{const D=a.detalleAbierto.has(b.concepto),_=D?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${es(b.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${m(b.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${m(b.concepto)}">Asignar</button>
               </div>
               ${Sl(Cl(b,C))}
             </td>
           </tr>`:"",z=D?b.movimientos.map(j=>{var H;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${m(j.fecha)}</span> · ${m(((H=t.accounts().find(L=>L._id===j.cuentaId))==null?void 0:H.nombre)??j.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${m(j._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${y(j.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Jt(it(j.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${m(b.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${m(b.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${D?"▾":"▸"}</button>
          <span style="font-size:13px">${m(b.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${b.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${m(b.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${b.movimientos.length} movimientos del grupo de golpe">${y(b.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Jt(it(b.total))}</td>
        <td></td>
      </tr>${_}${z}`}).join(""),M=x.slice().reverse().slice(0,8).map(b=>{var D;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${m(b.fecha)}</span>
        <span style="color:var(--text3)">${m(((D=t.accounts().find(_=>_._id===b.cuentaId))==null?void 0:D.nombre)??b.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${m(T(it(b.saldoCts)))}</span>
        ${b.nota?`<span style="color:var(--text3)">${m(b.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${m(b._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
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
          <span>Gastos: ${Jt(it(v))}</span>
          <span>Ingresos: ${Jt(it(g))}</span>
          <span>Neto: ${Jt(it(g+v))}</span>
          <span style="margin-left:auto">Saldo a ${m(c)}: <strong>${m(T(h))}</strong></span>
        </div>

        ${n?`<div class="text-sm mb-8" style="color:var(--text3)">Conceptos idénticos repetidos entre ${m(a.periodoDesde)} y ${m(a.periodoHasta)}. Cambia la estimación de la fila para asignarla a todos los movimientos del grupo a la vez.</div>
               ${ua(P,a.porPagina,"conceptos")}
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
                     ${F||'<tr><td colspan="5" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Ningún concepto se repite en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${ua(P,a.porPagina,"conceptos")}`:`${ua(w,a.porPagina,"movimientos")}
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
                     ${E||'<tr><td colspan="8" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Sin movimientos en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${ua(w,a.porPagina,"movimientos")}
               ${i?`<div class="divider"></div>
                      <div class="flex justify-between items-center flex-wrap mb-8" style="gap:8px">
                        <div class="card-title" style="margin:0">Real frente a estimado — ${m(r)} → ${m(c)}</div>
                        <div class="flex gap-6">
                          ${eo("neto",a.comparativa,"Neto","Ingresos menos gastos: no se descuadra por un traspaso entre tus cuentas")}
                          ${eo("gasto",a.comparativa,"Gasto","Solo el gasto")}
                          ${eo("ingreso",a.comparativa,"Ingresos","Solo lo que entra")}
                        </div>
                      </div>
                      ${$l(A,a.comparativa)}`:""}`}
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
            <datalist id="acc-tags-list">${t.tagsConocidas().map(b=>`<option value="${m(b)}"></option>`).join("")}</datalist>
          </div>
          <label class="flex gap-8 items-center mb-8" style="font-size:12px;color:var(--text2)">
            <label class="toggle"><input type="checkbox" id="nt-imprevisto"/><span class="toggle-slider"></span></label>
            Imprevisto (una avería, el dentista…)
          </label>
          <div class="form-group">
            <label class="form-label">Estimación relacionada</label>
            <select class="form-input" id="nt-estimacion">${y(null)}</select>
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
          ${M?`<div class="mt-12">${M}</div>`:""}
        </div>
      </div>
    </div>`}function Al(t,a,e,o){const{ledger:s}=a,n=()=>{e.pagina=1,o()};J(t,"#acc-cuenta",r=>{e.cuentaId=r.value,n()}),J(t,"#acc-mes",r=>{e.mes=r.value||e.mes,n()}),q(t,"[data-acc-vista]",r=>{e.vista=r.getAttribute("data-acc-vista")||"mensual",n()}),J(t,"#acc-periodo-desde",r=>{e.periodoDesde=r.value||e.periodoDesde,n()}),J(t,"#acc-periodo-hasta",r=>{e.periodoHasta=r.value||e.periodoHasta,n()}),q(t,"[data-acc-pagina]",r=>{var c;r.disabled||(e.pagina=Number(r.getAttribute("data-acc-pagina"))||1,o(),(c=t.querySelector("[data-acc-tabla]"))==null||c.scrollIntoView({block:"start"}))}),J(t,"[data-acc-por-pagina]",r=>{const c=Number(r.value);e.porPagina=Number.isFinite(c)&&c>=0?c:50,e.pagina=1,o()}),q(t,"[data-acc-comparativa]",r=>{e.comparativa=r.getAttribute("data-acc-comparativa")||"neto",o()}),J(t,"#acc-intervalo-desde",r=>{e.intervaloDesde=r.value||e.intervaloDesde,n()}),J(t,"#acc-intervalo-hasta",r=>{e.intervaloHasta=r.value||e.intervaloHasta,n()}),q(t,"[data-grp-detalle]",r=>{const c=r.getAttribute("data-grp-detalle");e.detalleAbierto.has(c)?e.detalleAbierto.delete(c):e.detalleAbierto.add(c),o()}),J(t,"[data-grp-estimacion]",r=>{const c=r.getAttribute("data-grp-estimacion"),l=r.value||null,{desde:p,hasta:d}=ao(e.periodoDesde,e.periodoHasta),u=s.transacciones({cuentaId:e.cuentaId||void 0,desde:p,hasta:d,texto:e.filtroTexto||void 0}),v=oo(u).find(g=>g.concepto===c);if(v){for(const g of v.movimientos)s.asignarEstimacion(g._id,l);O(`Estimación asignada a ${v.movimientos.length} movimientos`),a.onDatosCambiados(),o()}}),q(t,"[data-grp-tags-asignar]",r=>{var h;const c=r.getAttribute("data-grp-tags-asignar"),l=((h=r.closest("tr"))==null?void 0:h.querySelector("[data-grp-tags]"))??null,p=((l==null?void 0:l.value)??"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean);if(p.length===0)return O("Escribe al menos una etiqueta","err");const{desde:d,hasta:u}=ao(e.periodoDesde,e.periodoHasta),v=s.transacciones({cuentaId:e.cuentaId||void 0,desde:d,hasta:u,texto:e.filtroTexto||void 0}),g=oo(v).find(x=>x.concepto===c);if(g){for(const x of g.movimientos)s.actualizar(x._id,{tags:[...new Set([...x.tags,...p])]});O(`Etiquetas añadidas a ${g.movimientos.length} movimientos`),a.onDatosCambiados(),o()}});const i=t.querySelector("#acc-buscar");i==null||i.addEventListener("input",()=>{e.filtroTexto=i.value,clearTimeout(i._t),i._t=window.setTimeout(()=>{n();const r=document.getElementById("acc-buscar");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},200)}),q(t,"#nt-guardar",()=>{var p;const r=Ft(t,"#nt-concepto").trim(),c=as(t,"#nt-importe");if(!r)return O("Indica un concepto","err");if(!(c>0))return O("Indica un importe mayor que cero","err");const l=Ft(t,"#nt-tags").split(",").map(d=>d.trim().toLowerCase()).filter(Boolean);s.registrar({fecha:Ft(t,"#nt-fecha")||(a.hoy??et)(),cuentaId:Ft(t,"#nt-cuenta"),importe:c,concepto:r,tags:l,tipo:Ft(t,"#nt-tipo"),estimacionId:Ft(t,"#nt-estimacion")||null,imprevisto:((p=t.querySelector("#nt-imprevisto"))==null?void 0:p.checked)||void 0}),O("Movimiento registrado"),a.onDatosCambiados(),o()}),q(t,"[data-tx-borrar]",r=>{const c=r.dataset.txBorrar;wt("¿Eliminar este movimiento?")&&(s.eliminar(c),O("Movimiento eliminado"),a.onDatosCambiados(),o())}),q(t,"[data-tx-editar]",r=>{const c=r.dataset.txEditar,l=s.transacciones().find(u=>u._id===c);if(!l)return;const p=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(it(l.importeCts))));if(p===null)return;const d=parseFloat(p.replace(",","."));if(!Number.isFinite(d)||d<=0)return O("Importe no válido","err");s.actualizar(c,{importe:d}),O("Movimiento actualizado"),a.onDatosCambiados(),o()}),q(t,"[data-tx-imprevisto]",r=>{const c=r.getAttribute("data-tx-imprevisto"),l=s.transacciones().find(d=>d._id===c);if(!l)return;const p=!l.imprevisto;s.actualizar(c,{imprevisto:p||void 0}),O(p?l.estimacionId?"Marcado como imprevisto. Ojo: está asignado a una estimación y cuenta a través de ella":"Marcado como imprevisto":"Ya no es un imprevisto"),a.onDatosCambiados(),o()}),J(t,"[data-tx-estimacion]",r=>{const c=r.getAttribute("data-tx-estimacion");s.asignarEstimacion(c,r.value||null),O("Asignación actualizada"),a.onDatosCambiados()}),J(t,"[data-tx-tipo]",r=>{const c=r.getAttribute("data-tx-tipo");s.actualizar(c,{tipo:r.value}),O("Tipo actualizado"),a.onDatosCambiados(),o()}),q(t,"#pc-guardar",()=>{if(Ft(t,"#pc-saldo").trim()==="")return O("Indica el saldo","err");const c=as(t,"#pc-saldo");s.registrarPuntoControl(Ft(t,"#pc-cuenta"),Ft(t,"#pc-fecha")||(a.hoy??et)(),c,Ft(t,"#pc-nota").trim()||void 0),O("Saldo real registrado"),a.onDatosCambiados(),o()}),q(t,"[data-pc-borrar]",r=>{wt("¿Eliminar este punto de control?")&&(s.eliminarPuntoControl(r.dataset.pcBorrar),O("Punto de control eliminado"),a.onDatosCambiados(),o())})}function Ks(t){var s;const a=t.estimaciones(),e=((s=t.rango)==null?void 0:s.call(t))??null,o=new Map(a.map(n=>[n._id,n]));return t.precision.analizarTodas(a,e?{desde:e.desde,hasta:e.hasta}:{}).map(n=>{const i=o.get(n.estimacionId);return{analisis:n,estimacion:i,sugerencia:Na(n,i.cuantia)}}).filter(n=>!!n.estimacion)}function El(t){var e;const a=((e=t.rango)==null?void 0:e.call(t))??null;return a?m(`Limitado al periodo de la cabecera (${a.desde} → ${a.hasta}): se comparan los meses ya cerrados que caen dentro, recortados al intervalo. El mes en curso nunca entra.`):"Se comparan solo los meses ya cerrados que tengan movimientos reales."}function Pl(t){var r;const a=Ks(t),e=a.filter(c=>c.analisis.precision!==null),o=a.filter(c=>c.sugerencia!==null),s=t.precision.analizarPorTag(a.map(c=>c.analisis));if(e.length===0)return`
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
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(T(c.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(T(c.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Jt(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${fi(c.precision)}</td>
      </tr>`).join(""),i=(c,l="left")=>`<th style="padding:7px 8px;text-align:${l};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${c}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Ajuste de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm" style="color:var(--text2);line-height:1.6">
        ${El(t)}
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
    </div>`}function _l(t,a,e){q(t,"#ajustar-todas",()=>{const o=Ks(a).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const s=o.map(r=>`• ${r.concepto}: ${T(r.cuantiaActual)} → ${T(r.cuantiaSugerida)}`).join(`
`);if(!wt(`Se van a ajustar ${o.length} estimaciones:

${s}

¿Continuar?`))return;const{aplicadas:n,errores:i}=a.adjuster.aplicarTodas(o,{hoy:a.hoy()});O(i.length>0?`${n.length} ajustadas, ${i.length} con error`:`${n.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),a.onDatosCambiados(),e()})}const Fl=[";",",","	","|"],Dl={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function pa(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ma(t,a){const e=[];let o="",s=!1;for(let n=0;n<t.length;n++){const i=t[n];s?i==='"'?t[n+1]==='"'?(o+='"',n++):s=!1:o+=i:i==='"'?s=!0:i===a?(e.push(o.trim()),o=""):o+=i}return e.push(o.trim()),e}function Tl(t){let a=";",e=-1;for(const o of Fl){const s=t.slice(0,20).map(c=>ma(c,o).length),n=Math.max(...s);if(n<2)continue;const r=s.filter(c=>c===n).length*10+n;r>e&&(e=r,a=o)}return a}function Ue(t){let a=(t??"").trim();if(!a)return null;let e=!1;if(/^\(.*\)$/.test(a)&&(e=!0,a=a.slice(1,-1).trim()),a.endsWith("-")&&(e=!0,a=a.slice(0,-1).trim()),a.startsWith("-")&&(e=!0,a=a.slice(1).trim()),a.startsWith("+")&&(a=a.slice(1).trim()),a=a.replace(/[€$£\s  ]/g,""),!a)return null;const o=a.lastIndexOf(","),s=a.lastIndexOf(".");let n="";o>=0&&s>=0?n=o>s?",":".":o>=0?n=/,\d{3}$/.test(a)&&a.replace(/,/g,"").length>3?"":",":s>=0&&(n=/\.\d{3}$/.test(a)&&a.replace(/\./g,"").length>3?"":".");let i,r="0";if(n){const p=n===","?o:s;i=a.slice(0,p).replace(/[.,]/g,""),r=a.slice(p+1).replace(/[.,]/g,"")}else i=a.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),l=Number(i||"0")*100+Number(c);return Number.isFinite(l)?e?-l:l:null}function so(t){const a=(t??"").trim();if(!a)return null;let e=a.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(e)return Js(Number(e[1]),Number(e[2]),Number(e[3]));if(e=a.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),e){let o=Number(e[3]);return o<100&&(o+=o<70?2e3:1900),Js(o,Number(e[2]),Number(e[1]))}return null}function Js(t,a,e){if(a<1||a>12||e<1||e>31)return null;const o=new Date(t,a-1,e);return o.getFullYear()!==t||o.getMonth()!==a-1||o.getDate()!==e?null:`${t}-${String(a).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function Qs(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>so(e)!==null).length/a.length}function Xs(t){const a=t.filter(e=>e.trim());return a.length===0?0:a.filter(e=>Ue(e)!==null).length/a.length}function zl(t,a){const e={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,s=n=>a.map(i=>i[n]??"");for(const n of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=pa(t[i]);if(r&&Dl[n].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(n==="importe"&&pa(t[i]).includes("saldo"))continue;e[n]=i,o.add(i);break}}if(e.fecha<0){let n=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=Qs(s(r));c>i&&(i=c,n=r)}n>=0&&(e.fecha=n,o.add(n))}if(e.importe<0&&e.debe<0&&e.haber<0){let n=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||pa(t[r]).includes("saldo"))continue;const c=Xs(s(r));c>i&&(i=c,n=r)}n>=0&&(e.importe=n,o.add(n))}if(e.concepto<0){let n=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=s(r);if(Xs(c)>.5||Qs(c)>.5)continue;const l=c.reduce((p,d)=>p+d.length,0)/Math.max(1,c.length);l>i&&(i=l,n=r)}n>=0&&(e.concepto=n)}return e}function jl(t){const a=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(p=>p.trim()!=="");if(a.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const e=Tl(a),o=a.map(p=>ma(p,e).length),s=Math.max(...o);let n=o.findIndex(p=>p===s);n<0&&(n=0);const i=ma(a[n],e);let r=a.slice(n+1).map(p=>ma(p,e));const c=so(i[0]??"")!==null||i.some(p=>Ue(p)!==null&&/\d/.test(p));c&&(r=[i,...r]);const l=zl(c?i.map(()=>""):i,r.slice(0,40));return{separador:e,cabeceras:c?i.map((p,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:n+1,mapeo:l}}function Zs(t,a,e){return`${t}|${a}|${pa(e).replace(/\s+/g," ")}`}function ql(t,a,e=[]){const o=new Map;for(const n of e){const i=Zs(n.fecha,n.importeCts,n.concepto);o.set(i,(o.get(i)??0)+1)}const s=new Map;return t.filas.map((n,i)=>{const r=[],c=a.fecha>=0?so(n[a.fecha]??""):null;a.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${n[a.fecha]??""}»`);let l=null;if(a.importe>=0)l=Ue(n[a.importe]??""),l===null&&r.push(`importe ilegible: «${n[a.importe]??""}»`);else if(a.debe>=0||a.haber>=0){const u=a.debe>=0?Ue(n[a.debe]??""):null,v=a.haber>=0?Ue(n[a.haber]??""):null;u===null&&v===null?r.push("sin importe en Debe ni en Haber"):u!==null&&u!==0?l=-Math.abs(u):v!==null&&v!==0?l=Math.abs(v):l=0}else r.push("sin columna de importe");l===0&&r.push("importe cero");const p=(a.concepto>=0?n[a.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(c&&l!==null){const u=Zs(c,l,p),v=(s.get(u)??0)+1;s.set(u,v),d=v<=(o.get(u)??0)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:p,importeCts:l,errores:r,duplicada:d}})}function Nl(t,a){const e=t.filter(s=>s.errores.length===0&&(a||!s.duplicada)),o=e.map(s=>s.fecha).filter(s=>!!s).sort();return{total:t.length,importables:e.length,conError:t.filter(s=>s.errores.length>0).length,duplicadas:t.filter(s=>s.duplicada).length,sumaCts:e.reduce((s,n)=>s+(n.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function fa(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const Rl=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function no(t,a){if(!a.analisis||!a.mapeo){a.filas=[];return}const e=t.ledger.transacciones(a.cuentaId?{cuentaId:a.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));a.filas=ql(a.analisis,a.mapeo,e)}function kl(t,a){const e=t.accounts().filter(s=>s.activo);if(!a.abierto)return`
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

      ${a.analisis&&a.mapeo?Ol(a,a.analisis,a.mapeo):Ll()}
    </div>`}function Ll(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function Ol(t,a,e){const o=Nl(t.filas,t.incluirDuplicadas),s=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+a.cabeceras.map((c,l)=>`<option value="${l}"${l===r?" selected":""}>${m(c||`Columna ${l+1}`)}</option>`).join(""),n=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${m(t.nombreFichero)}</strong> · ${a.filas.length} línea${a.filas.length!==1?"s":""}
      · separador <code>${m(a.separador==="	"?"tabulador":a.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${Rl.map(r=>`<div class="form-group">
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
        <div class="stat-value" style="font-size:1.15rem">${Jt(it(o.sumaCts))}</div>
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
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":m(T(it(r.importeCts)))}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function Hl(t,a,e,o){q(t,"[data-imp-sincronizar]",()=>{const n=a.ledger.sincronizarHistoricoImportado();if(n.length===0)return O("Nada que sincronizar: no hay movimientos importados todavía");const i=p=>{var d;return((d=a.accounts().find(u=>u._id===p))==null?void 0:d.nombre)??p},r=n.reduce((p,d)=>p+d.eliminados,0),c=n.reduce((p,d)=>p+d.semanales,0),l=n.map(p=>`${i(p.cuentaId)} (${p.semanales})`).join(", ");O(`Histórico al día: ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""} · ${l}`+(r>0?` · ${r} manual${r!==1?"es":""} sustituido${r!==1?"s":""}`:"")),a.onDatosCambiados(),o()}),q(t,"[data-imp-abrir]",()=>{const n=a.accounts().filter(i=>i.activo);Object.assign(e,fa(),{abierto:!0,cuentaId:n.length===1?n[0]._id:""}),o()}),q(t,"[data-imp-cerrar]",()=>{Object.assign(e,fa()),o()}),J(t,"#imp-cuenta",n=>{e.cuentaId=n.value,no(a,e),o()}),J(t,"#imp-duplicadas",n=>{e.incluirDuplicadas=n.checked,o()}),J(t,"[data-imp-col]",n=>{const i=n,r=i.dataset.impCol;e.mapeo&&(e.mapeo[r]=Number(i.value),no(a,e),o())});const s=t.querySelector("#imp-fichero");s==null||s.addEventListener("change",()=>{var i;const n=(i=s.files)==null?void 0:i[0];n&&Bl(n).then(r=>{const c=jl(r);e.nombreFichero=n.name,e.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",e.analisis=c,e.mapeo={...c.mapeo},no(a,e),o()}).catch(r=>{e.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),q(t,"[data-imp-confirmar]",()=>{if(!e.cuentaId)return;const n=e.filas.filter(l=>l.errores.length===0&&(e.incluirDuplicadas||!l.duplicada));if(n.length===0)return;for(const l of n)a.ledger.registrar({fecha:l.fecha,cuentaId:e.cuentaId,importe:Math.abs(it(l.importeCts)),tipo:l.importeCts<0?"gasto":"ingreso",concepto:l.concepto,origen:"importado"});const i=n.map(l=>l.fecha).sort(),r=a.ledger.eliminarPuntosControlEnRango(e.cuentaId,i[0],i[i.length-1]),c=a.ledger.generarPuntosSemanales(e.cuentaId);O(`${n.length} movimiento${n.length!==1?"s":""} importado${n.length!==1?"s":""} · histórico con ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(e,fa()),a.onDatosCambiados(),o()})}function Bl(t){return t.arrayBuffer().then(a=>{const e=new TextDecoder("utf-8").decode(a);if(!e.includes("�"))return e;try{return new TextDecoder("iso-8859-1").decode(a)}catch{return e}})}const ga=26,io=7,ro=(ga+io)*2,tn=2*Math.PI*ga,en=12;function Gl(t){if(t.estimado<=0)return t.real>0?{color:"var(--yellow)",fraccion:1,etiqueta:["sin","prever"]}:{color:"var(--text3)",fraccion:0,etiqueta:["—"]};const a=t.real/t.estimado*100;return{color:a>110?"var(--red)":a>100?"var(--yellow)":"var(--accent)",fraccion:Math.min(1,t.real/t.estimado),etiqueta:[`${Math.round(a)}%`]}}function Vl(t){const{color:a,fraccion:e,etiqueta:o}=Gl(t),s=ro/2,n=`${t.tag}: real ${T(t.real)} de ${T(t.estimado)} previsto (${t.desviacion>=0?"+":""}${T(t.desviacion)})`;return`
    <div style="text-align:center;min-width:96px">
      <svg viewBox="0 0 ${ro} ${ro}" style="width:78px;height:78px" role="img" aria-label="${m(n)}">
        <title>${m(n)}</title>
        <circle cx="${s}" cy="${s}" r="${ga}" fill="none" stroke="var(--bg3)" stroke-width="${io}"/>
        <circle cx="${s}" cy="${s}" r="${ga}" fill="none" stroke="${a}" stroke-width="${io}"
                stroke-linecap="round" stroke-dasharray="${(tn*e).toFixed(2)} ${tn.toFixed(2)}"
                transform="rotate(-90 ${s} ${s})"/>
        ${o.map((i,r)=>{const c=o.length>1?9:12,l=s+(o.length>1?r*10-1:4);return`<text x="${s}" y="${l}" text-anchor="middle" font-size="${c}" font-family="var(--font-mono)" fill="var(--text2)">${m(i)}</text>`}).join("")}
      </svg>
      <div style="font-size:11px;color:var(--text);margin-top:2px;word-break:break-word">${m(t.tag)}</div>
      <div style="font-size:10px;color:var(--text2);font-family:var(--font-mono)">${m(T(t.real))}</div>
      <div style="font-size:10px;color:var(--text3);font-family:var(--font-mono)">de ${m(T(t.estimado))}</div>
    </div>`}function Ul(t){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin gasto etiquetado en este periodo.</div>';const a=t.slice(0,en),e=t.slice(en),o=e.reduce((s,n)=>s+n.real,0);return`
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start">
      ${a.map(Vl).join("")}
    </div>
    <div class="flex flex-wrap" style="gap:6px 18px;font-size:11px;color:var(--text2);margin-top:10px">
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent);margin-right:4px"></span>dentro de lo previsto</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--yellow);margin-right:4px"></span>pasado o sin prever</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--red);margin-right:4px"></span>más de un 10 % por encima</span>
      ${e.length>0?`<span style="color:var(--text3)">y ${e.length} etiqueta(s) más, ${m(T(o))}</span>`:""}
    </div>`}function Yl(){return{mes:"",modo:"mes"}}function an(t,a){if(a.mes)return a.mes;const e=rs(t.ledger),o=zi((t.hoy??et)());return e.includes(o)?o:e[0]??o}function Ye(t,a){var i;const e=(t.hoy??et)(),o=t.estimaciones(),s={hoy:e,nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(i=t.resolverTramosIRPF)==null?void 0:i.call(t),omitidos:t.omitidos()};if(a.modo==="periodo"){const{desde:r,hasta:c}=t.periodo(),l=t.precision.analizarTodas(o,{hoy:e,desde:r,hasta:c});return sa(t.ledger,o,r,c,{...s,analisis:l})}const n=t.precision.analizarTodas(o,{hoy:e});return ji(t.ledger,o,an(t,a),{...s,analisis:n})}function on(t){var s;const a=(t.hoy??et)(),e=is(t.estimaciones(),a,a,{nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(s=t.resolverTramosIRPF)==null?void 0:s.call(t)}),o=n=>e.filter(i=>i.tipo===n).map(i=>`<option value="${m(i._id)}">${m(i.concepto)}</option>`).join("");return{gasto:o("gasto"),ingreso:o("ingreso")}}function Ht(t,a){return a<=0?"—":`${m(T(t/a))}/mes`}function sn(t,a,e,o){const s=a?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-cie-modo="${t}" title="${m(o)}" style="${s}">${m(e)}</button>`}function Wl(t,a){const e=a.modo==="periodo",o=an(t,a),s=rs(t.ledger);s.includes(o)||s.unshift(o);const n=Ye(t,a),i=e?"Cierre del periodo":"Cierre de mes",r=e?`del ${m(n.desde)} al ${m(n.hasta)}`:m(ht(o)),c=`
    <div class="flex gap-6 items-center flex-wrap">
      ${sn("mes",!e,"Mes","Cierra un mes natural completo")}
      ${sn("periodo",e,"Periodo del header","Cierra el intervalo configurado arriba, aunque cruce varios meses o corte uno por la mitad")}
      ${e?`<span class="text-sm" style="color:var(--text2);font-family:var(--font-mono);margin-left:4px">${m(n.desde)} → ${m(n.hasta)}</span>`:`<select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
               ${s.map(d=>`<option value="${m(d)}"${d===o?" selected":""}>${m(ht(d))}</option>`).join("")}
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
          <div class="stat-value" style="font-size:1.15rem">${m(T(n.real))}</div>
          <div class="stat-sub">${Ht(n.real,n.meses)} · previsto ${m(T(n.estimado))} (${Ht(n.estimado,n.meses)})</div>
          <div class="stat-sub">${l(n.desviacion)}${m(T(n.desviacion))} · ${l(n.desviacion)}${Ht(n.desviacion,n.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Ingresos</div>
          <div class="stat-value" style="font-size:1.15rem">${m(T(n.ingresosReales))}</div>
          <div class="stat-sub">${Ht(n.ingresosReales,n.meses)} · previsto ${m(T(n.ingresosEstimados))} (${Ht(n.ingresosEstimados,n.meses)})</div>
          <div class="stat-sub">${l(n.desviacionIngresos)}${m(T(n.desviacionIngresos))} · ${l(n.desviacionIngresos)}${Ht(n.desviacionIngresos,n.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación neta</div>
          <div class="stat-value" style="font-size:1.15rem;color:${p}">${l(n.desviacionNeta)}${m(T(n.desviacionNeta))}</div>
          <div class="stat-sub">${l(n.desviacionNeta)}${Ht(n.desviacionNeta,n.meses)}</div>
          <div class="stat-sub">neto real ${m(T(n.netoReal))} · previsto ${m(T(n.netoEstimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${n.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${m(T(n.totalSinEstimacion))}</div>
          <div class="stat-sub">${Ht(n.totalSinEstimacion,n.meses)} · ${n.sinEstimacion.length} concepto${n.sinEstimacion.length!==1?"s":""} de gasto</div>
          <div class="stat-sub">${n.totalIngresosSinPrever>0?`${m(T(n.totalIngresosSinPrever))} de ingreso`:"sin ingresos sueltos"}</div>
        </div>
      </div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        El periodo son ${m(n.meses.toFixed(1).replace(".",","))} meses; «/mes» es el total repartido entre ellos.
      </div>

      ${Kl(n)}
      ${Jl(n,on(t))}
      ${Xl(n,on(t))}
      ${Ql(n)}
    </div>

    <div class="card mb-14">
      <div class="card-title mb-8">Real frente a previsto por etiqueta</div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        Cada anillo es una etiqueta: cuánto llevas gastado de lo que tenías previsto en el periodo.
        Un movimiento con varias etiquetas cuenta en todas, así que los anillos no reparten el total.
      </div>
      ${Ul(n.porTag)}
    </div>`}function Kl(t){const a=t.filas.filter(o=>o.estimado>0||o.real>0);if(a.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas en este periodo.</div>';const e=a.filter(o=>o.sugerencia);return`
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
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(T(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(T(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${n}">
                  ${o.desviacion>0?"+":""}${m(T(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${i?`<button class="btn-secondary btn-sm" data-cie-ajustar="${m(o.estimacionId)}"
                           title="Pasar el importe de cada pago (${m(o.periodicidad)}) de ${m(T(i.cuantiaActual))} a ${m(T(i.cuantiaSugerida))} · ${m(i.motivo)}"
                           style="font-size:11px;padding:2px 9px">→ ${m(T(i.cuantiaSugerida))}/pago</button>`:""}
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
           </div>`:""}`}function nn(t,a,e,o){return`<tr>
    <td style="font-size:12px">${m(t.concepto)}</td>
    <td style="text-align:right;font-size:12px;color:var(--text3)">${t.movimientos}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${o}">${m(T(t.total))}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--text3)">${Ht(t.total,a)}</td>
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
  </tr>`}const rn=`<thead><tr>
  <th style="cursor:default">Concepto</th>
  <th style="cursor:default;text-align:right">Movimientos</th>
  <th style="cursor:default;text-align:right">Total</th>
  <th style="cursor:default;text-align:right">Al mes</th>
  <th style="cursor:default"></th>
</tr></thead>`;function Jl(t,a){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
        ${rn}
        <tbody>
          ${t.sinEstimacion.slice(0,10).map(e=>nn(e,t.meses,a.gasto,"var(--yellow)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function Ql(t){return t.omitidos.length===0?"":`
    <div class="card-title mb-8 mt-14">No se cuentan</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      ${t.omitidos.length} concepto(s) omitido(s), ${m(T(t.totalOmitido))} en el periodo. No suman ni en gasto ni en ingresos.
    </div>
    <div class="flex gap-6 flex-wrap">
      ${t.omitidos.map(a=>`<button class="btn-secondary btn-sm" data-cie-restaurar="${m(a.clave)}" title="Volver a contarlo"
                    style="font-size:11px;padding:2px 9px">${m(a.concepto)} · ${m(T(a.total))} ✕</button>`).join("")}
    </div>`}function Xl(t,a){return t.ingresosSinPrever.length===0?"":`
    <div class="card-title mb-8 mt-14">Ingresos que no tenías previstos</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Si alguno es el otro lado de un traspaso entre tus cuentas, márcalo como transferencia en Movimientos
      y dejará de contar en los dos sitios.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${rn}
        <tbody>
          ${t.ingresosSinPrever.slice(0,10).map(e=>nn(e,t.meses,a.ingreso,"var(--accent)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.ingresosSinPrever.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.ingresosSinPrever.length-10} concepto(s) más.</div>`:""}`}function Zl(t,a,e,o){J(t,"#cie-mes",s=>{e.mes=s.value,o()}),q(t,"[data-cie-modo]",s=>{e.modo=s.getAttribute("data-cie-modo")||"mes",o()}),q(t,"[data-cie-omitir]",s=>{const n=s.getAttribute("data-cie-omitir"),i=a.omitidos();i.includes(n)||(a.setOmitidos([...i,n]),O("Concepto omitido: deja de contar en el cierre"),o())}),q(t,"[data-cie-imprevisto]",s=>{var c;const n=s.getAttribute("data-cie-imprevisto"),r=Ye(a,e).sinEstimacion.find(l=>l.clave===n);if(r){for(const l of r.ids)a.ledger.actualizar(l,{imprevisto:!0});O(`${r.ids.length} movimiento${r.ids.length===1?"":"s"} marcado${r.ids.length===1?"":"s"} como imprevisto`),(c=a.onDatosCambiados)==null||c.call(a),o()}}),q(t,"[data-cie-restaurar]",s=>{const n=s.getAttribute("data-cie-restaurar");a.setOmitidos(a.omitidos().filter(i=>i!==n)),o()}),J(t,"[data-cie-asignar]",s=>{const n=s,i=n.getAttribute("data-cie-asignar"),r=n.value;if(!r)return;const c=Ye(a,e),l=[...c.sinEstimacion,...c.ingresosSinPrever].find(p=>p.clave===i);if(l){if(!wt(`Se van a asignar ${l.movimientos} movimiento(s) de «${l.concepto}». ¿Continuar?`)){n.value="";return}for(const p of l.ids)a.ledger.asignarEstimacion(p,r);O(`${l.movimientos} movimiento(s) asignados`),a.onDatosCambiados(),o()}}),q(t,"[data-cie-ajustar]",s=>{const n=s.dataset.cieAjustar,r=Ye(a,e).filas.find(c=>c.estimacionId===n);r!=null&&r.sugerencia&&(a.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(a.hoy??et)()}),O(`«${r.concepto}» ajustada a ${T(r.sugerencia.cuantiaSugerida)}`),a.onDatosCambiados(),o())}),q(t,"[data-cie-ajustar-todas]",()=>{const n=Ye(a,e).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(n.length===0)return;const{aplicadas:i,errores:r}=a.adjuster.aplicarTodas(n,{hoy:(a.hoy??et)()});O((i.length===1?"1 estimación ajustada":`${i.length} estimaciones ajustadas`)+(r.length>0?` · ${r.length} con error`:"")),a.onDatosCambiados(),o()})}const td="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function ed(t){const a=t.hoy??et,e=()=>{var z;return(z=t.onDatosCambiados)==null?void 0:z.call(t)},o=new Map;let s="cuentas";const n=Il(a().slice(0,7)),i=fa(),r=Yl(),c=()=>t.store.get("expenses"),l=()=>t.store.get("accounts"),p={ledger:t.ledger,accounts:l,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:e,hoy:a},d={ledger:t.ledger,accounts:l,onDatosCambiados:e},u=()=>t.store.get("config"),v=()=>({desde:u().dashboardStart,hasta:u().dashboardEnd}),g={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,nominas:()=>t.store.get("nominas"),loans:()=>t.store.get("loans"),resolverTramosIRPF:()=>me(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??Ut),omitidos:()=>u().cierreOmitidos??[],setOmitidos:z=>t.store.patchConfig({cierreOmitidos:z}),onDatosCambiados:e,periodo:v,hoy:a},h={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:e,rango:()=>r.modo==="periodo"?v():null,hoy:a},x=z=>{var j;return((j=t.store.get("accounts").find(H=>H._id===z))==null?void 0:j.nombre)??z},f=()=>me(t.store.get("tramosIRPFHistorico"),u().tramos_irpf??Ut)(Number(a().slice(0,4))),y=()=>me(t.store.get("tramosGananciasCapitalHistorico"),u().tramosGananciasCapital??_e),S=()=>y()(Number(a().slice(0,4)));function w(){const z=u(),j=t.store.get("accounts"),H=No({loans:[],expenses:t.store.get("expenses").filter(B=>B.tipo==="transferencia"),accounts:j,config:{dashboardStart:z.dashboardStart,dashboardEnd:z.dashboardEnd,fechaReferencia:z.dashboardStart},nominas:[],resolverTramosGanancias:y()}),L=new Map,N=B=>{let U=L.get(B);return U||(U={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},L.set(B,U)),U},k=(B,U)=>{const at=`${U.sourceId}`,ut=B.find(Q=>Q.concepto===at),lt=ut??{concepto:at,contraparte:"",total:0,ocurrencias:0};lt.total+=Math.abs(U.cuantia),lt.ocurrencias+=1,ut||B.push(lt)};for(const B of H){if(!B.cuenta)continue;const U=N(B.cuenta);B.sourceType==="transfer-in"||B.sourceType==="traspaso-in"?(U.totalAportaciones+=Math.abs(B.cuantia),k(U.entradas,B)):B.sourceType==="transfer-out"||B.sourceType==="traspaso-out"?(U.totalReembolsos+=Math.abs(B.cuantia),k(U.salidas,B)):B.sourceType==="investment-tax"&&(U.retencion+=Math.abs(B.cuantia))}const G=t.store.get("expenses");for(const B of L.values())for(const[U,at]of[[B.entradas,"cuenta"],[B.salidas,"cuentaDestino"]])for(const ut of U){const lt=G.find(Q=>Q._id===ut.concepto);ut.contraparte=x((lt==null?void 0:lt[at])??"default"),ut.concepto=(lt==null?void 0:lt.concepto)||(at==="cuenta"?"Aportación":"Reembolso")}return L}function I(z){const j=s==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let H;if(s==="cuentas"){const k=t.store.get("accounts").filter(U=>_t(U)!=="pension"),G=w(),B={config:u(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:f(),tramosGanancias:S(),flujos:U=>G.get(U)??Zc,invModo:U=>o.get(U)??"proyeccion"};H=`${tl(k,B.tramosGanancias)}<div class="grid-3">${k.map(U=>nl(U,B)).join("")}</div>`}else s==="movimientos"?H='<div id="acc-tx"></div>':s==="importar"?H='<div id="acc-import"></div>':H='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';z.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${j}
      </div>
      ${fl(s)}
      ${H}`;const L=()=>I(z);if(s==="movimientos"){const N=z.querySelector("#acc-tx");N.innerHTML=Ml(p,n),Al(N,p,n,L)}else if(s==="importar"){const N=z.querySelector("#acc-import");N.innerHTML=kl(d,i),Hl(N,d,i,L)}else if(s==="cierre"){const N=z.querySelector("#acc-cierre"),k=z.querySelector("#acc-precision");N.innerHTML=Wl(g,r),k.innerHTML=Pl(h),Zl(N,g,r,L),_l(k,h,L)}}const E=()=>document.getElementById("modal-overlay"),A=()=>kt(),C=()=>{var z;return(z=E())==null?void 0:z.classList.add("hidden")};function $(z,j){const H=E(),L=A();return!H||!L?null:(L.innerHTML=z?`<div class="modal-title">${m(z)}</div>${j}`:j,H.classList.remove("hidden"),q(L,"[data-cancelar]",C),L)}function P(z,j){const H=z?t.store.get("accounts").find(G=>G._id===z)??null:null,L=[...(H==null?void 0:H.planAportaciones)??[]].map(G=>({...G})),N=H?F(H):null,k=$(z?"Editar cuenta / fondo":"Nueva cuenta / fondo",cl(H,{nominas:t.store.get("nominas"),hoy:a(),saldoActual:N??0}));k&&(ll(k,L,a()),q(k,"[data-guardar-acc]",G=>{const B=G.getAttribute("data-guardar-acc")||"",{datos:U,punto:at,error:ut}=dl(k,L,H,N,a());if(ut)return O(ut,"err");let lt=B;B?t.store.updateItem("accounts",B,U):lt=t.store.addItem("accounts",U)._id,at&&t.ledger.registrarPuntoControl(lt,at.fecha,at.saldo,at.nota),O(B?"Actualizada":"Cuenta / fondo creado"),e(),C(),j()}))}function F(z){const j=t.ledger.puntosControl(z._id);return j.length>0?to(j)[0].saldo:z.saldo??null}function M(z,j){const H=t.store.get("accounts").find(k=>k._id===z);if(!H)return;const L=$("Histórico de saldos",ul(H.nombre,z,to(t.ledger.puntosControl(z)),H.saldoInicial||0,a()));if(!L)return;const N=()=>{j(),M(z,j)};q(L,"[data-hist-anadir]",()=>{var U,at,ut;const k=((U=L.querySelector("#hi-fecha"))==null?void 0:U.value)??"",G=parseFloat(((at=L.querySelector("#hi-saldo"))==null?void 0:at.value)??""),B=((ut=L.querySelector("#hi-nota"))==null?void 0:ut.value.trim())??"";if(!k||!Number.isFinite(G))return O("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(z,k,G,B||void 0),O("Punto añadido"),e(),N()}),q(L,"[data-hist-borrar]",k=>{const[,G]=(k.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(G),O("Eliminado"),e(),N()}),q(L,"[data-hist-semanal]",k=>{const G=k.getAttribute("data-hist-semanal"),B=t.ledger.generarPuntosSemanales(G);O(B>0?`Histórico con ${B} punto${B!==1?"s":""} semanal${B!==1?"es":""}`:"Sin movimientos con los que calcular el histórico"),e(),N()}),q(L,"[data-hist-inicial]",k=>{const[G,B]=(k.getAttribute("data-hist-inicial")||"").split("|"),U=t.ledger.puntosControl(G).find(ut=>ut._id===B);if(!U)return;const at=to([U])[0].saldo;t.store.updateItem("accounts",G,{saldoInicial:at,fechaInicialSaldo:U.fecha}),O(`Punto inicial → ${U.fecha} (${T(at)})`),e(),N()})}function b(z){const j=t.store.get("accounts").filter(N=>N.activo);if(j.length===0)return O("No hay cuentas activas","err");const H=a(),L=j.map(N=>`• ${N.nombre}: ${T(F(N)??N.saldoInicial??0)}`).join(`
`);if(wt(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${H})?

${L}

Esto recalibra el punto de arranque del dashboard.`)){for(const N of j)t.store.updateItem("accounts",N._id,{saldoInicial:F(N)??N.saldoInicial??0,fechaInicialSaldo:H});O("Saldo base actualizado"),e(),z()}}function D(z,j,H){q(z,"[data-cuentas-tab]",L=>{s=L.getAttribute("data-cuentas-tab")||"cuentas",j()}),q(z,"[data-nueva-acc]",()=>P(null,j)),q(z,"[data-editar-acc]",L=>P(L.getAttribute("data-editar-acc"),j)),q(z,"[data-tramos-ganancias]",()=>H.abrir()),q(z,"[data-reset-base]",()=>b(j)),q(z,"[data-hist-acc]",L=>M(L.getAttribute("data-hist-acc"),j)),q(z,"[data-principal-acc]",L=>{const N=L.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(k=>({...k,esCuentaPrincipal:k._id===N}))),O("Cuenta marcada como principal"),e(),j()}),q(z,"[data-borrar-acc]",L=>{var ut,lt;const N=L.getAttribute("data-borrar-acc"),k=t.store.get("accounts");if(k.length<=1)return O("Debe existir al menos una cuenta","err");const G=k.find(Q=>Q._id===N);if(!G)return;const U=[[((ut=t.ledger)==null?void 0:ut.transacciones({cuentaId:N}).length)??0,"movimiento","movimientos"],[((lt=t.ledger)==null?void 0:lt.puntosControl(N).filter(Q=>Q.origen!=="derivado").length)??0,"saldo anotado","saldos anotados"],[t.store.get("expenses").filter(Q=>(Q.cuenta||"default")===N||Q.cuentaDestino===N).length,"gasto o ingreso","gastos o ingresos"],[t.store.get("nominas").filter(Q=>Q.cuenta===N).length,"nómina","nóminas"],[t.store.get("loans").filter(Q=>(Q.cuenta||"default")===N).length,"préstamo","préstamos"]].filter(([Q])=>Q>0).map(([Q,At,yt])=>`${Q} ${Q===1?At:yt}`);if(U.length>0){if(G.activo===!1)return O("Esta cuenta ya está desactivada y tiene datos: no se puede eliminar","warn");if(!wt(`«${G.nombre}» tiene ${U.join(", ")}.

No se puede eliminar sin dejar esos datos sueltos. ¿Desactivarla? Dejará de contar en la proyección y conservará su historial; puedes reactivarla al editarla.`))return;let Q=t.store.get("accounts").map(At=>At._id===N?{...At,activo:!1,esCuentaPrincipal:!1}:At);if(!Q.some(At=>At.esCuentaPrincipal)){const At=Q.find(yt=>yt.activo!==!1)??Q[0];Q=Q.map(yt=>yt._id===At._id?{...yt,esCuentaPrincipal:!0}:yt)}t.store.set("accounts",Q),O("Cuenta desactivada"),e(),j();return}if(!wt(`¿Eliminar la cuenta «${G.nombre}»? No tiene movimientos ni nada asociado.`))return;t.store.removeItem("accounts",N);const at=t.store.get("accounts");at.length>0&&!at.some(Q=>Q.esCuentaPrincipal)&&t.store.set("accounts",at.map((Q,At)=>At===0?{...Q,esCuentaPrincipal:!0}:Q)),O("Cuenta eliminada"),e(),j()}),q(z,"[data-inv-modo]",L=>{const[N,k]=(L.getAttribute("data-inv-modo")||"").split("|");o.set(N,k==="real"?"real":"proyeccion"),j()})}let _=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:td,mount(z){const j=()=>I(z);_??(_=pl({store:t.store,onDatosCambiados:()=>{e(),j()},año:()=>Number(a().slice(0,4))})),I(z),z.dataset.wired!=="1"&&(D(z,j,_),z.dataset.wired="1")}}}function cn(t,a,e=!1){const o=Math.abs(Pt(a));return t==="ingreso"?o:t==="gasto"||e?-o:o}function ad(t){function a($){return`${$}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function e($={}){var F;const P=(F=$.texto)==null?void 0:F.trim().toLowerCase();return t.get("transacciones").filter(M=>!($.cuentaId&&M.cuentaId!==$.cuentaId||$.desde&&M.fecha<$.desde||$.hasta&&M.fecha>$.hasta||$.tipo&&M.tipo!==$.tipo||$.estimacionId&&M.estimacionId!==$.estimacionId||$.tags&&$.tags.length>0&&!$.tags.some(b=>M.tags.includes(b))||P&&!M.concepto.toLowerCase().includes(P))).sort((M,b)=>M.fecha.localeCompare(b.fecha)||M._id.localeCompare(b._id))}function o($){const P={_id:a("tx"),fecha:$.fecha,cuentaId:$.cuentaId,importeCts:cn($.tipo,$.importe,$.negativo),concepto:$.concepto,tags:$.tags??[],estimacionId:$.estimacionId??null,tipo:$.tipo,origen:$.origen??"manual",...$.nota?{nota:$.nota}:{},...$.imprevisto?{imprevisto:!0}:{}};return t.set("transacciones",[...t.get("transacciones"),P]),P}function s($,P){t.set("transacciones",t.get("transacciones").map(F=>{if(F._id!==$)return F;const{importe:M,...b}=P,D={...F,...b};return M!==void 0&&(D.importeCts=cn(D.tipo,M,D.importeCts<0)),D}))}function n($){t.set("transacciones",t.get("transacciones").filter(P=>P._id!==$))}function i($,P){s($,{estimacionId:P})}function r($){return t.get("puntosControl").filter(P=>!$||P.cuentaId===$).sort((P,F)=>P.fecha.localeCompare(F.fecha))}function c($){return r($).filter(P=>P.origen!=="derivado")}function l($,P,F,M){const b={_id:a("pc"),fecha:P,cuentaId:$,saldoCts:Pt(F),...M?{nota:M}:{}},D=t.get("puntosControl").filter(_=>!(_.cuentaId===$&&_.fecha===P));return t.set("puntosControl",[...D,b].sort((_,z)=>_.fecha.localeCompare(z.fecha))),u($),b}function p($){const P=t.get("puntosControl").find(F=>F._id===$);t.set("puntosControl",t.get("puntosControl").filter(F=>F._id!==$)),P&&(P.origen==="derivado"?x(P.cuentaId):u(P.cuentaId))}function d($,P,F){const M=D=>D.cuentaId===$&&D.origen!=="derivado"&&D.fecha>=P&&D.fecha<=F,b=t.get("puntosControl").filter(M).length;return b===0?0:(t.set("puntosControl",t.get("puntosControl").filter(D=>!M(D))),x($),b)}function u($){var L,N;const P=c($),F=t.get("transacciones").filter(k=>k.cuentaId===$).sort((k,G)=>k.fecha.localeCompare(G.fecha)),M=(L=F[0])==null?void 0:L.fecha,b=(N=F[F.length-1])==null?void 0:N.fecha,D=t.get("puntosControl").filter(k=>!(k.cuentaId===$&&k.origen==="derivado"));if(!M)return t.set("puntosControl",D),x($),0;const _=[];for(let k=Ee(M);k<=b;k=Ee(ce(k,1)))_.push(k);_[_.length-1]!==b&&_.push(b);const z=new Set(P.map(k=>Ee(k.fecha))),j=k=>{const G=P.filter(B=>B.fecha<=k).pop();return F.filter(B=>B.fecha<=k&&(!G||B.fecha>G.fecha)).reduce((B,U)=>B+U.importeCts,(G==null?void 0:G.saldoCts)??0)},H=_.filter(k=>!z.has(Ee(k))).map(k=>({_id:a("pcd"),fecha:k,cuentaId:$,saldoCts:j(k),origen:"derivado"}));return t.set("puntosControl",[...D,...H].sort((k,G)=>k.fecha.localeCompare(G.fecha))),v($,M,j(M)),x($),H.length}function v($,P,F){const M=t.get("accounts"),b=M.find(D=>D._id===$);!b||b.fechaInicialSaldo&&b.fechaInicialSaldo<=P||t.set("accounts",M.map(D=>D._id===$?{...D,saldoInicial:it(F),fechaInicialSaldo:P}:D))}function g($){return($??[...new Set(t.get("transacciones").map(F=>F.cuentaId))]).reduce((F,M)=>F+u(M),0)}function h($){const P=t.get("transacciones").filter(b=>b.origen==="importado"&&(!$||b.cuentaId===$)),F=new Map;for(const b of P){const D=F.get(b.cuentaId);D?D.push(b.fecha):F.set(b.cuentaId,[b.fecha])}const M=[];for(const[b,D]of F){D.sort();const _=d(b,D[0],D[D.length-1]);M.push({cuentaId:b,eliminados:_,semanales:u(b)})}return M}function x($){const P=r($),F=t.get("accounts");F.some(M=>M._id===$)&&t.set("accounts",F.map(M=>M._id===$?{...M,historicoSaldos:P.map(b=>({_id:b._id,fecha:b.fecha,saldo:it(b.saldoCts),...b.nota?{nota:b.nota}:{}}))}:M))}function f($,P=et()){const F=c($).filter(_=>_.fecha<=P).pop(),M=F==null?void 0:F.fecha,b=(F==null?void 0:F.saldoCts)??0;return t.get("transacciones").filter(_=>_.cuentaId===$&&_.fecha<=P&&(M===void 0||_.fecha>M)).reduce((_,z)=>_+z.importeCts,b)}function y($,P){return it(f($,P))}function S($=et(),P){const F=P??t.get("accounts").filter(M=>M.activo).map(M=>M._id);return it(F.reduce((M,b)=>M+f(b,$),0))}function w(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function I(){const $=[...t.get("transacciones").map(P=>P.fecha),...t.get("puntosControl").map(P=>P.fecha)];return $.length>0?$.sort().pop()??null:null}function E($={}){return it(e($).reduce((P,F)=>P+F.importeCts,0))}function A($={}){const P=new Map;for(const F of e($)){const M=F.fecha.slice(0,7);P.set(M,(P.get(M)??0)+F.importeCts)}return new Map([...P.entries()].sort(([F],[M])=>F.localeCompare(M)).map(([F,M])=>[F,it(M)]))}function C($={}){const P=new Map;for(const F of e($))for(const M of F.tags.length>0?F.tags:["sin_tag"])P.set(M,(P.get(M)??0)+F.importeCts);return new Map([...P.entries()].map(([F,M])=>[F,it(M)]))}return{transacciones:e,registrar:o,actualizar:s,eliminar:n,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:p,eliminarPuntosControlEnRango:d,sincronizarHistoricoImportado:h,generarPuntosSemanales:u,generarPuntosSemanalesTodas:g,saldoCuenta:y,saldoCuentaCts:f,saldoTotal:S,tieneDatos:w,ultimaFecha:I,total:E,totalPorMes:A,totalPorTag:C}}function Rt(t){return t.trim().toLowerCase()}function od(t){function a(){const l=new Map,p=(d,u)=>{const v=Rt(d);if(!v)return;const g=l.get(v)??{tag:v,estimaciones:0,reales:0,total:0};g[u]+=1,g.total+=1,l.set(v,g)};for(const d of t.get("expenses"))for(const u of d.tags??[])p(u,"estimaciones");for(const d of t.get("transacciones"))for(const u of d.tags??[])p(u,"reales");return[...l.values()].sort((d,u)=>u.total-d.total||d.tag.localeCompare(u.tag))}function e(){return a().map(l=>l.tag)}function o(l){return a().filter(p=>l==="estimaciones"?p.reales===0:p.estimaciones===0).map(p=>p.tag)}function s(l,p,d){const u=Rt(p),v=(l??[]).map(Rt);if(!v.includes(u))return l??[];const g=v.filter(h=>h!==u);return d===null?[...new Set(g)]:[...new Set([...g,Rt(d)])]}function n(l,p){const d=Rt(p);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(l,d)}function i(l,p){let d=0;for(const u of l)Rt(u)!==Rt(p)&&(d+=c(u,Rt(p)).cambiados);return{cambiados:d}}function r(l){return c(l,null)}function c(l,p){let d=0;const u=t.get("expenses").map(A=>{const C=s(A.tags,l,p);return C!==A.tags&&(d+=1),C===A.tags?A:{...A,tags:C}});t.set("expenses",u);const v=t.get("transacciones").map(A=>{const C=s(A.tags,l,p);return C!==A.tags&&(d+=1),C===A.tags?A:{...A,tags:C}});t.set("transacciones",v);const g=t.get("loans").map(A=>{const C=s(A.tags,l,p);return C!==A.tags&&(d+=1),C===A.tags?A:{...A,tags:C}});t.set("loans",g);const h=t.get("nominas").map(A=>{const C=s(A.tags,l,p);return C!==A.tags&&(d+=1),C===A.tags?A:{...A,tags:C}});t.set("nominas",h);const x=t.get("config"),f=Rt(l),y=A=>{const C=(A??[]).map(Rt);if(!C.includes(f))return A??[];const $=C.filter(P=>P!==f);return p===null?[...new Set($)]:[...new Set([...$,p])]},S={},w=y(x.activeTagsFilter),I=y(x.tagCategorias),E=y(x.tagGrupos);return w!==x.activeTagsFilter&&(S.activeTagsFilter=w),I!==x.tagCategorias&&(S.tagCategorias=I),E!==x.tagGrupos&&(S.tagGrupos=E),Object.keys(S).length>0&&t.patchConfig(S),{cambiados:d}}return{uso:a,todas:e,soloEn:o,renombrar:n,fusionar:i,eliminar:r}}const sd=3;function ln(t){return t<.005?0:t}function nd(t){if(t.length<2)return null;const a=t.reduce((o,s)=>o+s,0)/t.length,e=t.reduce((o,s)=>o+(s-a)**2,0)/(t.length-1);return Math.sqrt(e)}function id(t){const a=[],e=[],o=[];for(const i of t){if(i.meses.length<sd)continue;const r=nd(i.meses.map(c=>c.desviacion));r!==null&&(a.push(r),e.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(a.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const s=Math.sqrt(a.reduce((i,r)=>i+r*r,0)),n=Math.sqrt(e.reduce((i,r)=>i+r*r,0));return{sigmaMensual:ln(s),sigmaDeriva:ln(n),estimaciones:a.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function dn(t,a,e=1,o=0){if(a<=0)return 0;const s=Math.max(0,t)*Math.sqrt(a),n=Math.max(0,o)*a;return s===0&&n===0?0:K(e*Math.hypot(s,n))}function rd(t,a,e={}){if(!a.fiable||t.length===0)return[];const{z:o=1}=e,s=e.desde??t[0].fecha,[n,i]=s.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,l]=r.fecha.slice(0,7).split("-").map(Number),p=Math.max(0,(c-n)*12+(l-i)),d=dn(a.sigmaMensual,p,o,a.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:K(r.saldoAcum+d),abajo:K(r.saldoAcum-d)}})}function cd(t,a=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const e=a>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${a} desviación${a!==1?"es":""} típica${a!==1?"s":""} (${e} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const co="financeapp_session",ld=["local","dropbox","firebase"];function dd(t){if(!t)return null;try{const a=JSON.parse(t);if(!a||!ld.includes(a.modo))return null;const e=Number(a.creadaEn),o=Number(a.ultimoUso);return!Number.isFinite(e)||!Number.isFinite(o)?null:{modo:a.modo,...typeof a.email=="string"?{email:a.email}:{},...typeof a.passphrase=="string"?{passphrase:a.passphrase}:{},creadaEn:e,ultimoUso:o}}catch{return null}}function ud({storage:t,autoLogoutMinutos:a=()=>0,ahora:e=()=>Date.now(),graciaActiva:o=()=>!1}={}){const s=()=>t??(typeof localStorage<"u"?localStorage:null);function n(v){const g=s();if(g)try{v?g.setItem(co,JSON.stringify(v)):g.removeItem(co)}catch{}}function i(){const v=s();if(!v)return null;try{return dd(v.getItem(co))}catch{return null}}function r(){const v=i();return v?(e()-v.ultimoUso)/6e4:null}function c(){const v=a();if(!Number.isFinite(v)||v<=0||o())return!1;const g=r();return g!==null&&g>=v}function l(){const v=i();return v?c()?(n(null),null):v:null}function p(v){const g=e(),h={modo:v.modo,...v.email?{email:v.email}:{},...v.passphrase?{passphrase:v.passphrase}:{},creadaEn:g,ultimoUso:g};return n(h),h}function d(){const v=i();v&&n({...v,ultimoUso:e()})}function u(){n(null)}return{abrir:p,leer:l,tocar:d,cerrar:u,caducada:c,inactividadMinutos:r,get activa(){return l()!==null}}}const un=["pointerdown","keydown","visibilitychange"];function pd({sesion:t,onCaducada:a,intervaloMs:e=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:s=clearInterval,target:n=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const p of un)n==null||n.addEventListener(p,r);const c=o(()=>{i&&t.caducada()&&(l(),t.cerrar(),a())},e);function l(){if(i){i=!1,s(c);for(const p of un)n==null||n.removeEventListener(p,r)}}return l}const md=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],fd="FinanceApp",gd=new TextEncoder().encode("financeapp-bio-passphrase-v1");function pn(t){return new Uint8Array(new ArrayBuffer(t))}const lo="financeapp_bio_credencial",uo="financeapp_bio_secreto",po="financeapp_bio_ultimo_desbloqueo",mn="financeapp_bio_gracia_min",vd=5;function bd(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function va(t){const a=t instanceof Uint8Array?t:new Uint8Array(t);let e="";for(const o of a)e+=String.fromCharCode(o);return btoa(e)}function ba(t){const a=atob(t),e=pn(a.length);for(let o=0;o<a.length;o++)e[o]=a.charCodeAt(o);return e}function hd(t){return va(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function yd(t){const a=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return ba(a)}function fn(t){return t.getClientExtensionResults()}function $d(t={}){const a=t.webauthn??bd(),e=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),s=t.ahora??(()=>Date.now()),n=t.randomBytes??(I=>crypto.getRandomValues(pn(I)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return a.disponiblePlataforma()}function c(){const I=o==null?void 0:o.getItem(lo);if(!I)return null;try{const E=JSON.parse(I);return typeof E.credencialId!="string"||typeof E.salt!="string"?null:E}catch{return null}}function l(){return c()!==null}async function p(I){const E=await e.importKey("raw",I,"HKDF",!1,["deriveKey"]);return e.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:gd},E,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d(I,E){const A=n(12),C=await e.encrypt({name:"AES-GCM",iv:A},I,new TextEncoder().encode(E));return`${va(A)}:${va(C)}`}async function u(I,E){const[A,C]=E.split(":"),$=ba(A),P=ba(C),F=await e.decrypt({name:"AES-GCM",iv:$},I,P);return new TextDecoder().decode(F)}async function v(I,E){var j,H;if(!I)throw new Error("No hay clave de cifrado que envolver.");const A=n(32),C=n(32),$=n(16),P=await a.create({publicKey:{challenge:C,rp:{name:fd},user:{id:$,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:A}}},timeout:6e4}});if(!P)throw new Error("No se ha podido crear la credencial biométrica.");const F=fn(P);if(!((j=F.prf)!=null&&j.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let M=((H=F.prf.results)==null?void 0:H.first)??null;if(M||(M=await g(P.rawId,A)),!M)throw new Error("El sensor no ha devuelto material de cifrado.");const b=await p(M),D=await d(b,I),_={credencialId:hd(P.rawId),salt:va(A),modo:E,creadaEn:s()},z=i();z.setItem(lo,JSON.stringify(_)),z.setItem(uo,D)}async function g(I,E){var C,$;const A=await a.get({publicKey:{challenge:n(32),allowCredentials:[{id:I,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:E}}},timeout:6e4}});return A?(($=(C=fn(A).prf)==null?void 0:C.results)==null?void 0:$.first)??null:null}async function h(){const I=c();if(!I)throw new Error("No hay huella configurada en este dispositivo.");const E=o==null?void 0:o.getItem(uo);if(!E)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const A=await g(yd(I.credencialId).buffer,ba(I.salt));if(!A)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const C=await p(A),$=await u(C,E);return f(),$}function x(){o==null||o.removeItem(lo),o==null||o.removeItem(uo),o==null||o.removeItem(po)}function f(){o==null||o.setItem(po,String(s()))}function y(){const I=o==null?void 0:o.getItem(mn);if(I==null)return vd;const E=Number(I);return Number.isFinite(E)&&E>0?E:0}function S(I){o==null||o.setItem(mn,String(Math.max(0,Math.floor(I)||0)))}function w(){if(!l())return!1;const I=y();if(I<=0)return!1;const E=o==null?void 0:o.getItem(po),A=E?Number(E):NaN;return Number.isFinite(A)?s()-A<I*6e4:!1}return{disponible:r,registrada:l,leerCredencial:c,registrar:v,desbloquear:h,olvidar:x,marcarDesbloqueo:f,dentroDeGracia:w,graciaMinutos:y,configurarGracia:S}}function gn(){if(typeof localStorage<"u"){const A=gr();A.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${A.join(", ")}`)}const t=Ar(),a=t.activo(),e=he(a),o=$s(localStorage,e),s=$r({adapter:o}),n=xr(),{applied:i}=s.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${ee})`),s.subscribe(A=>n.marcar(A));function r(){var C,$,P,F,M;const A=globalThis;($=(C=A.FirebaseService)==null?void 0:C.isConnected)!=null&&$.call(C)&&((M=(F=(P=A.FirebaseService).uploadRegistroProyectos)==null?void 0:F.call(P))==null||M.catch(b=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",b instanceof Error?b.message:b)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find(A=>A._id===a)??t.listar()[0],colecciones:ae.filter(A=>A!=="config"),crear:A=>{const C=t.crear(A);return r(),C},renombrar:(A,C)=>{t.renombrar(A,C),r()},duplicar:(A,C)=>{const $=t.duplicar(A,C);return r(),$},eliminar:A=>{t.eliminar(A),r()},cambiarA:A=>t.establecerActivo(A),fusionarRemotos:A=>t.fusionarRemotos(A),importarDesde:(A,C)=>{const $=Er(localStorage,A,C),P=Pr($),F=[];for(const M of C){const b=P[M];if(!Array.isArray(b)||b.length===0)continue;const D=s.get(M);s.set(M,[...D,...b]),F.push(M)}return F.length>0&&n.marcar("importado-de-otro-proyecto"),{importadas:F}}},l=Fr(s),p=$d(),d=ud({autoLogoutMinutos:()=>{var C,$;const A=($=(C=globalThis.State)==null?void 0:C.get)==null?void 0:$.call(C,"config");return Number((A==null?void 0:A.autoLogoutMinutos)??s.get("config").autoLogoutMinutos??0)},graciaActiva:()=>p.dentroDeGracia()}),u=ad(s),v=od(s),g=_i(u),h=Fi(s),x=oc({isEnabled:A=>l.isEnabled(A)}),f=Kr({flags:l,rutasExtra:()=>x.flagPorRuta()}),y=jr({flags:l,onChange:()=>{var A,C;x.attachToShell(),f.apply(),(C=(A=globalThis.Router)==null?void 0:A.rerender)==null||C.call(A)}}),S=Br({proyectos:c}),w=()=>{var C,$,P,F,M,b;const A=globalThis;if(($=(C=A.State)==null?void 0:C.load)==null||$.call(C),((F=(P=A.Router)==null?void 0:P.current)==null?void 0:F.call(P))==="dashboard")try{(b=(M=A.DashboardModule)==null?void 0:M.render)==null||b.call(M)}catch(D){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",D)}};function I(){const C=globalThis.FinanceMath;if(!C){console.error("[informe] FinanceMath no está cargado");return}const $=et(),P=s.get("config"),F=s.get("accounts").filter(N=>N.activo),M=s.get("expenses"),b=s.get("loans"),D=s.get("nominas"),_=(N,k,G=$)=>C.generarExtracto(b,M,s.get("accounts"),{...P,dashboardStart:N,dashboardEnd:k,fechaReferencia:G},null,D,s.get("inflacion")),z={generarExtracto:_,gastos:M,prestamos:b,movimientos:s.get("transacciones"),hoy:$};let j=null,H=0;try{const N=ts(z,_(`${$.slice(0,7)}-01`,jt($.slice(0,7))));j=N.estimacion,H=N.desglose.imprevistos.total}catch(N){console.error("[informe] Sin estimación de imprevistos:",N)}const L=c.activo().nombre;Si({hoy:$,proyecto:L,construir:(N,k)=>Yi(ki({desde:N,hasta:k,hoy:$,proyecto:L,cuentas:F,gastos:M,ledger:u,generarExtracto:_,saldoSinLibro:(G,B)=>C.saldoEnFecha(G,B),opcionesCierre:{hoy:$,nominas:D,loans:b,resolverTramosIRPF:s.resolverTramosIRPF(),omitidos:P.cierreOmitidos??[]},imprevistos:j,imprevistosMesEnCurso:H,cuadroDeMando:(()=>{try{const G=_(N,k,$);if(G.length===0)return null;const B=G.filter(lt=>lt.fecha<=$),U=lt=>{var Q;return Number(((Q=lt[lt.length-1])==null?void 0:Q.saldoAcum)??NaN)},at=U(G),ut=B.length?U(B):at;return Number.isFinite(at)&&Number.isFinite(ut)?{saldoHoy:ut,saldoFinal:at}:null}catch{return null}})()}))})}const E=Wr({store:s,onDatosCambiados:w});return x.register(fc({store:s,onDatosCambiados:w})),x.register(Cc({store:s,onDatosCambiados:w})),x.register(Jc({store:s,onDatosCambiados:w})),x.register(ed({store:s,ledger:u,tags:v,precision:g,adjuster:h,onDatosCambiados:w})),x.register(nc({store:s,onDatosCambiados:w})),{version:ee,core:An,engine:{generarExtracto:No,recomputarSaldoAcum:_n,saldoHoy:Fn,sumarPorTags:Ro,providers:{proyectarGastos:Fe,proyectarPrestamos:Ea,proyectarTransferencias:Po,proyectarNominas:Pa,proyectarInteresesCuentas:Fo,proyectarAportaciones:_o,proyectarRetencionesFiscales:Do,proyectarInflacionGastos:To,proyectarPerdidaAhorro:zo},analysis:jn,margins:Hn,avisos:Un,dashboard:ii,mes:mi},store:s,flags:l,featureRegistry:{all:Xt,porGrupo:As},ui:{tarjetaMes:hi,abrirHistoricoMeses:wi,abrirCrearInforme:()=>I(),openFeatures:y.open,openProyectos:S.open,openPersonas:E.open,applyGating:f.apply,watchGating:()=>f.observar(),instalarDeshacer:()=>Qr({store:s,rerender:()=>{var C,$,P,F;const A=globalThis;($=(C=A.State)==null?void 0:C.load)==null||$.call(C),(F=(P=A.Router)==null?void 0:P.rerender)==null||F.call(P)}}),avisoGuardado:null,instalarBuscador:()=>ec({estado:()=>({accounts:s.get("accounts"),expenses:s.get("expenses"),loans:s.get("loans"),nominas:s.get("nominas"),transacciones:s.get("transacciones")}),rutasDisponibles:()=>x.routes(),navegar:A=>{var C,$;return($=(C=globalThis.Router)==null?void 0:C.navigate)==null?void 0:$.call(C,A)}})},app:x,session:Object.assign(d,{vigilar:A=>pd({sesion:d,onCaducada:A}),opciones:md}),biometria:p,cambios:n,datos:{colecciones:ae,snapshot:()=>({...xs(o),[Is]:ee}),aplicar:(A,{sellar:C=!0}={})=>{const $=C?(F,M)=>o.set(F,M):(F,M)=>{const b=globalThis.StorageAdapter;b!=null&&b.setRestaurando?b.setRestaurando(F,M):o.set(F,M)},P=Ir($,A);for(const F of bs)A[F]!==void 0&&A[F]!==null&&$(`${Tt}${F}`,A[F]);return P.length>0&&$(ke,Sr(A,ee)),s.load(),n.marcar("copia-restaurada"),P},faltantes:A=>wr(A),esVacioOPorDefecto:()=>Cr(xs(o)),recargar:()=>{s.load(),n.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:u,tags:v,precision:g,adjuster:h,sugerirAjuste:Na,medirVariabilidad:id,bandaDeConfianza:rd,bandaAcumulada:dn,describirBanda:cd}}}function xd(){try{const t=gn();return window.FinanceApp=t,t}catch(t){const a=t;return window.FinanceAppError={mensaje:(a==null?void 0:a.message)??String(t),stack:a==null?void 0:a.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const vt=typeof window<"u"?xd():null;if(vt){let t=!1;const a=()=>{var s,n,i;if(vt.app.attachToShell(),vt.ui.applyGating(),!t){t=!0,vt.ui.watchGating(),vt.ui.instalarDeshacer(),vt.ui.instalarBuscador();const r=globalThis,c=()=>{var u,v,g,h;return(v=(u=r.FirebaseService)==null?void 0:u.isConnected)!=null&&v.call(u)?r.FirebaseService:(h=(g=r.DropboxService)==null?void 0:g.isConnected)!=null&&h.call(g)?r.DropboxService:null};vt.ui.avisoGuardado=ac({cambios:vt.cambios,hayDestino:()=>c()!==null,guardar:async()=>{const u=c();if(!(u!=null&&u.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");const v=globalThis.AuthModule;v!=null&&v.guardarEnNube?await v.guardarEnNube():await u.uploadBackup()}});const l=document.getElementById("sidebar-proyecto-activo"),p=document.getElementById("sidebar-proyecto-activo-nombre");l&&p&&(p.textContent=vt.proyectos.activo().nombre,l.classList.remove("hidden"),l.addEventListener("click",()=>vt.ui.openProyectos())),(s=document.getElementById("btn-proyectos"))==null||s.addEventListener("click",()=>vt.ui.openProyectos());const d=vt.store.get("config").archivoMigracion011;if(d&&!d.avisado&&d.desactivados+d.amortizaciones.length>0){const u=d.desactivados+d.amortizaciones.length,v=globalThis.UI;setTimeout(()=>{var g;return(g=v==null?void 0:v.toast)==null?void 0:g.call(v,`Se han desactivado ${u} elemento${u===1?"":"s"} que venía${u===1?"":"n"} de un supuesto. Búscalos con la etiqueta «supuesto-archivado».`,"warn")},1500),vt.store.patchConfig({archivoMigracion011:{...d,avisado:!0}})}(n=document.getElementById("btn-personas"))==null||n.addEventListener("click",()=>vt.ui.openPersonas()),(i=document.getElementById("btn-informe"))==null||i.addEventListener("click",()=>vt.ui.abrirCrearInforme())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",a,{once:!0}):a(),document.addEventListener("click",s=>{const n=s.target;n!=null&&n.closest(".nav-btn[data-view]")&&setTimeout(a,0)}),window.addEventListener(ys,()=>{if(document.getElementById("aviso-sin-espacio"))return;const s=document.querySelector(".view-container");if(!(s!=null&&s.parentElement))return;const n=document.createElement("div");n.id="aviso-sin-espacio",n.setAttribute("role","alert"),n.className="card",n.style.cssText="border:1px solid var(--red);background:rgba(255,77,109,0.09);padding:10px 16px;margin:10px 20px 0;font-size:13px;display:flex;gap:12px;align-items:center;flex-wrap:wrap";const i=document.createElement("span");i.style.flex="1",i.textContent="No se ha podido guardar: el almacenamiento de este navegador está lleno o bloqueado. Los últimos cambios pueden perderse al recargar. Exporta una copia ahora.";const r=document.createElement("button");r.className="btn-primary btn-sm",r.textContent="Exportar copia",r.addEventListener("click",()=>{var c,l;return(l=(c=globalThis.DataIO)==null?void 0:c.exportJSON)==null?void 0:l.call(c)}),n.append(i,r),s.parentElement.insertBefore(n,s)});let e=null;const o=`${he(vt.proyectos.activo()._id)}${Tt}`;window.addEventListener("storage",s=>{!s.key||!s.key.startsWith(o)||s.key.endsWith("_modificadoEn")||s.key.endsWith("_schemaVersion")||(e&&clearTimeout(e),e=setTimeout(()=>{var i,r,c;e=null,vt.store.load(),((i=document.getElementById("modal-overlay"))==null?void 0:i.classList.contains("hidden"))===!1||(c=(r=globalThis.Router)==null?void 0:r.rerender)==null||c.call(r)},150))})}return ya.bootstrap=gn,Object.defineProperty(ya,Symbol.toStringTag,{value:"Module"}),ya}({});
//# sourceMappingURL=financeapp-core.js.map

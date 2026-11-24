var FinanceAppBundle=function(ba){"use strict";function st(t){const e=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),o=String(t.getDate()).padStart(2,"0");return`${e}-${a}-${o}`}function K(t){const[e,a,o]=t.split("-").map(Number);return new Date(e,a-1,o)}function ot(){return st(new Date)}function ha(t,e){return new Date(t,e+1,0).getDate()}function ho(t,e,a){return st(new Date(t,e,Math.min(a,ha(t,e))))}function Ue(t,e,a){if(!a)return null;if(a.startsWith("dia:")){const o=a.slice(4);if(o==="ultimo")return st(new Date(t,e+1,0));const s=parseInt(o);if(!isNaN(s))return ho(t,e,s)}if(a.startsWith("nthweekday:")){const o=a.split(":"),s=parseInt(o[1]),n=parseInt(o[2]);if(s===-1){const r=new Date(t,e+1,0);for(;r.getDay()!==n;)r.setDate(r.getDate()-1);return st(r)}const i=new Date(t,e,1);for(;i.getDay()!==n;)i.setDate(i.getDate()+1);return i.setDate(i.getDate()+(s-1)*7),i.getMonth()!==e&&i.setDate(i.getDate()-7),st(i)}return null}function yo(t,e){if(!e)return t;const a=K(t);return Ue(a.getFullYear(),a.getMonth(),e)??t}const Cn=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],Mn={"-1":"último",1:"1º",2:"2º",3:"3º",4:"4º",5:"5º"};function ya(t){if(!t)return"";if(t.startsWith("dia:")){const e=t.slice(4);return e==="ultimo"?"Último día del mes":`Día ${e} del mes`}if(t.startsWith("nthweekday:")){const e=t.split(":"),a=e[1],o=parseInt(e[2]);return`${Mn[a]||a+"º"} ${Cn[o]} del mes`}return t}function Ee(t,e){const a=Date.UTC(t.getFullYear(),t.getMonth(),t.getDate()),o=Date.UTC(e.getFullYear(),e.getMonth(),e.getDate());return Math.round((o-a)/864e5)}function Ae(t){const e=K(t),a=e.getDay()===0?0:7-e.getDay();return e.setDate(e.getDate()+a),st(e)}function Lt(t,e){const a=K(t);return a.setDate(a.getDate()+e),st(a)}function ie(t,e,a){const o=Math.max(1,a),s=t.getFullYear(),n=t.getMonth(),i=(e.getFullYear()-s)*12+(e.getMonth()-n);if(i<=0)return{year:s,month:n};const r=n+Math.floor(i/o)*o;return{year:s+Math.floor(r/12),month:r%12}}function Ye(t,e,a,o){return!(t&&t>o||e&&e<a)}function $o(t,e){const a=Math.max(1,Math.round(e??1));return t==="extraordinario"?"una vez":t==="diaria"?a===1?"cada día":a===7?"cada semana":a===14?"cada 2 semanas":`cada ${a} días`:a===1?"cada mes":a===3?"cada trimestre":a===6?"cada semestre":a===12?"cada año":`cada ${a} meses`}function Ct(t){return Math.sign(t)*Math.round(Math.abs(t)*100)}function nt(t){return t/100}function Q(t){return nt(Ct(t))}function F(t){return new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR"}).format(t||0)}function xo(t){return(t||0).toFixed(2)+"%"}function Xt(t,e,a){const o=e/100/12;return o===0?t/a:t*o*Math.pow(1+o,a)/(Math.pow(1+o,a)-1)}function Io(t,e,a,o=0){const s=Xt(t,e,a),n=t*(1-o/100);let i=e/100/12;for(let r=0;r<200;r++){const l=s*(1-Math.pow(1+i,-a))/i-n,u=s*(a*Math.pow(1+i,-(a+1))/i-(1-Math.pow(1+i,-a))/(i*i)),d=i-l/u;if(Math.abs(d-i)<1e-10){i=d;break}i=d}return(Math.pow(1+i,12)-1)*100}function wo(t,e,a,o,s=0,n=[],i={}){const r=[];let c=t;const l=K(o),u=e/100/12;let d=a,p=Xt(c,e,d);const v=[...n].sort((b,y)=>b.fecha.localeCompare(y.fecha));let g=0;for(let b=1;b<=a*2&&c>.01;b++){const y=new Date(l);l.setMonth(l.getMonth()+1);const f=yo(st(y),i.diaPago||"");for(;g<v.length&&v[g].fecha<=f;){const S=v[g],I=S.cantidad*(s/100);if(c-=S.cantidad,c=Math.max(0,c),S.tipo==="plazo"?d=Math.ceil(-Math.log(1-c*u/p)/Math.log(1+u)):(d=a-b+1,p=Xt(c,e,d)),r.push({mes:"AMORT",fecha:S.fecha,cuota:0,interes:0,amortizacion:S.cantidad,comisionAmort:I,capitalPendiente:c,esAmortizacion:!0,simulacion:S.simulacion||!1}),g++,c<.01)break}if(c<.01)break;const h=c*u,C=Math.min(p-h,c);if(c-=C,c<.01&&(c=0),r.push({mes:b,fecha:f,cuota:p,interes:h,amortizacion:C,comisionAmort:0,capitalPendiente:c,esAmortizacion:!1,simulacion:!1}),d--,d<=0||c<.01)break}return r}const So=new Map;function vt(t){var y;const e=t.amortizaciones||[],a=`${t.capital}|${t.tin}|${t.meses}|${t.fechaInicio}|${t.comisionAmort||0}|${t.comisionApertura||0}|${t.diaPago||""}|${e.slice().sort((f,h)=>`${f.fecha}|${f.cantidad}|${f.tipo||""}`.localeCompare(`${h.fecha}|${h.cantidad}|${h.tipo||""}`)).map(f=>`${f.fecha}:${f.cantidad}:${f.tipo||""}`).join(";")}`,o=So.get(a);if(o)return o;const{capital:s,tin:n,meses:i,fechaInicio:r,comisionAmort:c,comisionApertura:l}=t,u=wo(s,n,i,r,c||0,e,t),d=u.reduce((f,h)=>f+h.interes,0),p=u.reduce((f,h)=>f+h.comisionAmort,0),v=s*((l||0)/100),g=u.filter(f=>!f.esAmortizacion),b={cuota:Xt(s,n,i),totalIntereses:d,tae:Io(s,n,i,l||0),costoTotal:d+p+v,comAp:v,totalComAm:p,fechaFin:((y=g.slice(-1)[0])==null?void 0:y.fecha)||"",mesesReales:g.length,tabla:u};return So.set(a,b),b}function Co(t){const e=vt(t),a=vt({...t,amortizaciones:[]}),o=a.totalIntereses-e.totalIntereses,s=a.mesesReales-e.mesesReales,n=e.totalComAm;return{...e,sinAmort:a,ahorroIntereses:o,ahorroTiempo:s,costeTotalAmort:n,ahorroNeto:o-n,totalPagado:t.capital+e.totalIntereses+e.comAp+e.totalComAm}}function Ot(t,e,a){if(!t||t.length===0)return 1;const o=K(e),s=K(a);if(s<=o)return 1;const n=[...t].sort((c,l)=>c.year-l.year);let i=1,r=new Date(o);for(;r<s;){const c=r.getFullYear(),l=n.filter(b=>b.year<=c),u=l.length>0?l[l.length-1]:n[0],d=(u?u.tasa:0)/100,p=new Date(c+1,0,1),v=p<s?p:s,g=Ee(r,v);i*=Math.pow(1+d,g/365.25),r=v}return i}function Mo(t,e,a,o=0){const s=K(e),n=K(a);if(n<=s)return o;const i=Ee(s,n),r=t?[...t].sort((u,d)=>u.year-d.year):[];let c=0,l=new Date(s);for(;l<n;){const u=l.getFullYear(),d=new Date(u+1,0,1),p=d<n?d:n,v=Ee(l,p),g=r.filter(f=>f.year<=u),b=g.length>0?g[g.length-1]:null,y=b!==null?b.tasa:o;c+=y*v,l=p}return i>0?c/i:o}function Eo(t,e){return((1+t/100)/(1+e/100)-1)*100}function En(t,e,a,o){const s=Ot(e,a,o);return s>0?t/s:t}function An(t,e){const a=e.saludUmbralAhorroVerde??20,o=e.saludUmbralAhorroAmarillo??10,s=e.saludUmbralDTIVerde??30,n=e.saludUmbralDTIAmarillo??40,i=e.saludRegla||[50,30,20],r=e.saludExcluirHipoteca||!1,{ingresos:c=0,cuotas:l=0,cuotasHipoteca:u=0,gastosBasicos:d=0,gastosOtros:p=0,amortizaciones:v=0}=t,g=c-l-v-d-p,b=g,y=c>0?b/c*100:null,f=r?l-u:l,h=c>0?f/c*100:null,C=c>0?l/c*100:null,S=c>0?(d+l+v)/c*100:null,I=c>0?p/c*100:null,E=(w,x,_)=>w===null?"neutral":w>=x?"verde":w>=_?"amarillo":"rojo",M=(w,x,_)=>w===null?"neutral":w<=x?"verde":w<=_?"amarillo":"rojo";return{ingresos:c,cuotas:l,cuotasHipoteca:u,gastosBasicos:d,gastosOtros:p,amortizaciones:v,ahorroBruto:g,ahorroReal:b,tasaAhorro:y,dti:h,dtiTotal:C,excluyeHipoteca:r,pctNecesidades:S,pctDeseos:I,semAhorro:E(y,a,o),semDTI:M(h,s,n),semNecesidades:M(S,i[0],i[0]+15),semDeseos:M(I,i[1],i[1]+10),semAhorroRegla:E(y,i[2],i[2]*.5),umbralAhorroVerde:a,umbralAhorroAmarillo:o,umbralDTIVerde:s,umbralDTIAmarillo:n,regla:i}}function Mt(t){return(t==null?void 0:t.modeloFondo)||(t!=null&&t.esFondoPension?"pension":"cuenta")}function Bt(t){const e=[...t.historicoSaldos||[]].sort((a,o)=>o.fecha.localeCompare(a.fecha));return e.length>0?e[0].saldo:t.saldoInicial||0}function Pe(t,e){const a=$a(t,e);return a?a.saldo:e>=(t.fechaInicialSaldo||"")&&t.saldoInicial||0}function $a(t,e){const a=t.fechaInicialSaldo||"";if(!a||e>=a){const o=[];return a&&o.push({fecha:a,saldo:t.saldoInicial||0,prioridad:-1}),(t.historicoSaldos||[]).forEach((s,n)=>{s.fecha>=a&&o.push({...s,prioridad:n})}),o.sort((s,n)=>n.fecha.localeCompare(s.fecha)||n.prioridad-s.prioridad),o.find(s=>s.fecha<=e)??null}else return[...t.historicoSaldos||[]].sort((s,n)=>n.fecha.localeCompare(s.fecha)).find(s=>s.fecha<=e)??null}function Ao(t,e){let a="";for(const o of t){const s=$a(o,e);s&&s.fecha>a&&(a=s.fecha)}return a}function Pn(t){const e=a=>!a.simulacion;return{loans:t.loans.filter(e).map(a=>({...a,amortizaciones:(a.amortizaciones||[]).filter(e)})),expenses:t.expenses.filter(e),nominas:t.nominas.filter(e),accounts:t.accounts.filter(e)}}function _n(t){const e=a=>!!a.simulacion;return t.loans.some(a=>e(a)||(a.amortizaciones||[]).some(e))||t.expenses.some(e)||t.nominas.some(e)||t.accounts.some(e)}function We(t){var e,a;return((e=t.find(o=>o.esPorDefecto))==null?void 0:e._id)??((a=t[0])==null?void 0:a._id)??"default"}function Fn(t,e){if(e<=0)return[];const a=t<0?-1:1,o=Math.abs(t),s=Math.floor(o/e),n=o-s*e;return Array.from({length:e},(i,r)=>a*(s+(r<n?1:0)))}function Dn(t,e,a,o){if(a===0)return{ids:t,cts:e};const s=t.indexOf(o);if(s>=0){const n=[...e];return n[s]+=a,{ids:t,cts:n}}return{ids:[...t,o],cts:[...e,a]}}function re(t,e,a){const o=Ct(t);if(!e||e.participantes.length===0)return[{personaId:a,importe:nt(o)}];const s=e.participantes.map(d=>d.personaId);if(e.modo==="partesIguales"){const d=Fn(o,s.length);return s.map((p,v)=>({personaId:p,importe:nt(d[v])}))}const n=e.participantes.map(d=>{const p=Math.max(0,d.valor??0);return e.modo==="porcentaje"?Math.round(o*p/100):Ct(p)}),i=n.reduce((d,p)=>d+p,0);if(Math.abs(i)>Math.abs(o)&&i!==0){const d=o/i,p=n.map(g=>Math.round(g*d)),v=p.reduce((g,b)=>g+b,0);return p.length>0&&(p[0]+=o-v),s.map((g,b)=>({personaId:g,importe:nt(p[b])}))}const c=o-i,{ids:l,cts:u}=Dn(s,n,c,a);return l.map((d,p)=>({personaId:d,importe:nt(u[p])}))}function xa(t,e){return t.find(a=>a._id===e||e.startsWith(`${a._id}_`))}function Tn(t,e,a){const o=We(a),s=new Map,n=i=>{let r=s.get(i);return r||(r={personaId:i,pago:0,consumo:0,ingresos:0},s.set(i,r)),r};for(const i of a)n(i._id);for(const i of t){const r=Math.abs(i.cuantia);if(r!==0){if(i.sourceType==="expense"&&i.tipo==="gasto"){const c=xa(e.expenses,i.sourceId);for(const l of re(r,c==null?void 0:c.repartoPago,o))n(l.personaId).pago+=l.importe;for(const l of re(r,c==null?void 0:c.repartoConsumo,o))n(l.personaId).consumo+=l.importe}else if(i.sourceType==="loan"){const c=xa(e.loans,i.sourceId);for(const l of re(r,c==null?void 0:c.repartoPago,o))n(l.personaId).pago+=l.importe;for(const l of re(r,c==null?void 0:c.repartoConsumo,o))n(l.personaId).consumo+=l.importe}else if(i.sourceType==="nomina"&&i.tipo==="ingreso"){const c=xa(e.nominas,i.sourceId);for(const l of re(r,c==null?void 0:c.repartoConsumo,o))n(l.personaId).ingresos+=l.importe}}}return[...s.values()]}function Ia(t,e,a){const o=s=>!s||s.participantes.length===0?[a]:s.participantes.map(n=>n.personaId);return new Set([...o(t),...o(e)])}const Ht=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]];function Pt(t,e){const a=[...e].sort((n,i)=>n[0]-i[0]);let o=0,s=t;for(let n=a.length-1;n>=0;n--){const[i,r]=a[n];s<=i||(o+=(s-i)*(r/100),s=i)}return o}function Po(t,e){const a=Math.max(0,t-(e||0)),o=t*.0635,s=Math.min(2e3,a),n=Math.max(0,a-o-s),i=n<=15876?7302:n<=21622?Math.max(0,7302-1.75*(n-15876)):0;return{baseIRPF:a,cotizSS:o,gastosArt19:s,RNT:n,reducArt20:i,baseImponible:Math.max(0,n-i)}}function Gt(t,e){return Po(t,e).baseImponible}function _o(t,e){return Pt(t,e)/12}const _e=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function wa(t,e){if(!t||t<=0)return 0;const a=e||_e;let o=0,s=t;for(let n=0;n<a.length;n++){const[i,r]=a[n],c=n<a.length-1?a[n+1][0]:1/0,l=Math.min(s,c-i);if(!(l<=0)&&(o+=l*(r/100),s-=l,s<=0))break}return o}function Ke(t,e){if(Mt(t)!=="inversion")return null;const a=Bt(t),o=(t.aportaciones||[]).reduce((i,r)=>i+r.cantidad,0)||t.saldoInicial||0,s=Math.max(0,a-o),n=wa(s,e);return{saldo:a,costBase:o,plusvalia:s,impuesto:n,neto:a-n}}function Sa(t,e=new Date){var p;if(Mt(t)!=="pension")return null;const a=t.bloqueoMeses||120,o=Bt(t),s=st(new Date(e.getFullYear(),e.getMonth()-a,e.getDate())),n=[...t.aportaciones||[]].sort((v,g)=>v.fecha.localeCompare(g.fecha));let i=0;const r=n.reduce((v,g)=>v+g.cantidad,0);for(const v of n)v.fecha<=s&&(i+=v.cantidad);const c=Math.max(0,o-r),l=r>0?i/r:0,u=Math.min(o,i+c*l),d=Math.max(0,o-u);return{saldo:o,disponible:u,bloqueado:d,costBase:r,beneficio:c,numAportaciones:n.length,proxDesbloqueo:((p=n.find(v=>v.fecha>s))==null?void 0:p.fecha)||null}}function Fo(t,e,a){const o=a!==void 0?a:t.impuestoRetirada;if(Mt(t)!=="pension"||!o)return 0;const s=Bt(t);if(s<=0)return 0;const n=(t.aportaciones||[]).reduce((l,u)=>l+u.cantidad,0),i=Math.max(0,s-n);if(i<=0)return 0;const r=i/s;return+(e*r*o/100).toFixed(2)}function Ca(t,e,a){var c;const o=t.grupoNomina;if(!o)return t.impuestoRetirada||0;const n=(e||[]).filter(l=>(l.grupoNomina||"")===o&&l.activo!==!1).reduce((l,u)=>l+(u.bruto||0)*(u.nPagas||12),0),i=[...a||[]].sort((l,u)=>l[0]-u[0]);let r=((c=i[0])==null?void 0:c[1])||19;for(const[l,u]of i)if(n>=l)r=u;else break;return r}const zn=Object.freeze(Object.defineProperty({__proto__:null,TRAMOS_AHORRO_DEFAULT:_e,TRAMOS_IRPF_DEFAULT:Ht,agregarPorPersona:Tn,ajustarFechaPago:yo,ajustarPrecioReal:En,arranqueMensual:ie,calcBaseImponibleTrabajo:Gt,calcFactorInflacion:Ot,calcFondoInversion:Ke,calcFondosPension:Sa,calcGananciasCapital:wa,calcIRPF:Pt,calcImpuestoPension:Fo,calcInflacionMediaAnual:Mo,calcSaludFinanciera:An,calcTAE:Io,calcTipoMarginalPension:Ca,calcTipoRealFisher:Eo,calcularReparto:re,clampedDate:ho,cuotaMensual:Xt,desgloseBaseTrabajo:Po,diasEntre:Ee,entradaSaldo:$a,etiquetaPeriodicidad:$o,fechaUltimoSaldoConocido:Ao,finDeSemana:Ae,formatEUR:F,formatLocalDate:st,formatPct:xo,fromCents:nt,haySimulaciones:_n,idPersonaPorDefecto:We,labelDiaPago:ya,lastDayOfMonth:ha,modeloFondoDe:Mt,parseLocalDate:K,personasImplicadas:Ia,resolverDiaEfectivo:Ue,resumenPrestamo:vt,resumenPrestamoConAhorro:Co,retencionMensual:_o,roundMoney:Q,saldoEnFecha:Pe,saldoRealCuenta:Bt,sinSimulaciones:Pn,sumarDias:Lt,tablaAmortizacion:wo,toCents:Ct,todayISO:ot,vigenteEnRango:Ye},Symbol.toStringTag,{value:"Module"}));function Fe(t,e,a=null){const o=[],s=K(e.start),n=K(e.end);for(const i of t){if(!i.activo||a&&a.length>0&&!a.includes(i.cuenta||"default"))continue;const r=K(i.fechaInicio||e.start),c=i.fechaFin?K(i.fechaFin):n,l=i.cuantia,u=d=>o.push({fecha:d,concepto:i.concepto,cuantia:l,tipo:i.tipo,tags:i.tags||[],cuenta:i.cuenta||"default",sourceId:i._id,sourceType:"expense"});if(i.tipoFrecuencia==="extraordinario")r>=s&&r<=n&&r<=c&&u(i.fechaInicio);else if(i.tipoFrecuencia==="mensual"){const d=Math.max(1,i.frecuencia||1);let{year:p,month:v}=ie(r,s,d);const g=Math.ceil(240/d)+2;for(let b=0;b<g;b++){const y=Ue(p,v,i.diaPago||"")||(()=>{const h=r.getDate(),C=new Date(p,v+1,0).getDate();return st(new Date(p,v,Math.min(h,C)))})(),f=K(y);if(f>n||f>c)break;f>=s&&f>=r&&u(y),v+=d,v>=12&&(p+=Math.floor(v/12),v=v%12)}}else if(i.tipoFrecuencia==="diaria"){const d=Math.max(1,i.frecuencia||1)*864e5;let p=new Date(Math.max(r.getTime(),s.getTime()));if(r<s){const v=Math.ceil((s.getTime()-r.getTime())/d);p=new Date(r.getTime()+v*d)}for(;p<=n&&p<=c;)u(st(p)),p=new Date(p.getTime()+d)}}return o}function Ma(t,e,a=null){const o=[];for(const s of t){if(!s.activo||a&&a.length>0&&!a.includes(s.cuenta||"default"))continue;const{tabla:n}=vt(s);for(const i of n)i.fecha>=e.start&&i.fecha<=e.end&&(i.esAmortizacion?o.push({fecha:i.fecha,concepto:`Amort. ${s.nombre}`,cuantia:-(i.amortizacion+i.comisionAmort),tipo:"gasto",tags:["amortizacion",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan-amort",simulacion:i.simulacion||!1}):o.push({fecha:i.fecha,concepto:`Cuota ${s.nombre}`,cuantia:-i.cuota,tipo:"gasto",tags:["prestamo",...s.tags||[]],cuenta:s.cuenta||"default",sourceId:s._id,sourceType:"loan",simulacion:s.simulacion||!1}))}return o}function Do(t,e,a=null,o={accounts:[]}){const s=[],n=K(e.start),i=K(e.end),r=o.accounts||[],c=o.nominas||[],l=o.resolverTramosIRPF||(()=>Ht),u=o.resolverTramosGanancias||(()=>_e),d=p=>{var v;return((v=r.find(g=>g._id===p))==null?void 0:v.nombre)??p};for(const p of t){if(!p.activo||p.tipo!=="transferencia"||a&&a.length>0&&!(a.includes(p.cuenta||"default")||a.includes(p.cuentaDestino||"default")))continue;const v=K(p.fechaInicio||e.start),g=p.fechaFin?K(p.fechaFin):i,b=y=>{const f=r.find(A=>A._id===(p.cuenta||"default")),h=r.find(A=>A._id===(p.cuentaDestino||"default")),C=Mt(f),S=Mt(h),I=C==="inversion"&&S==="inversion"||C==="pension"&&S==="pension",E=["transferencia",...I?["traspaso"]:[],...p.tags||[]],M=I?"traspaso-out":"transfer-out",w=I?"traspaso-in":"transfer-in",x=!a||a.length===0||a.includes(p.cuenta||"default"),_=!a||a.length===0||a.includes(p.cuentaDestino||"default");if(x&&s.push({fecha:y,concepto:`Transf. → ${d(p.cuentaDestino||"default")}: ${p.concepto}`,cuantia:p.cuantia,tipo:"gasto",tags:E,cuenta:p.cuenta||"default",sourceId:p._id,sourceType:M}),_&&s.push({fecha:y,concepto:`Transf. ← ${d(p.cuenta||"default")}: ${p.concepto}`,cuantia:p.cuantia,tipo:"ingreso",tags:E,cuenta:p.cuentaDestino||"default",sourceId:p._id,sourceType:w}),x&&!I&&f){if(C==="inversion"){const A=parseInt(y.slice(0,4)),P=Ke(f,u(A));if(P&&P.saldo>0&&P.plusvalia>0){const $=Math.min(1,p.cuantia/P.saldo),D=P.plusvalia*$*.19;D>.01&&s.push({fecha:y,concepto:`Retención IRPF reembolso ${f.nombre} (19% s/plusvalía)`,cuantia:D,tipo:"gasto",tags:["impuesto","capital-mobiliario","retencion"],cuenta:p.cuenta||"default",sourceId:p._id,sourceType:"investment-tax"})}}else if(C==="pension"){const A=l(parseInt(y.slice(0,4))),P=Ca(f,c,A),$=Fo(f,p.cuantia,P||void 0);if($>0){const T=f.grupoNomina?`IRPF rescate ${f.nombre} (tipo marginal grupo "${f.grupoNomina}": ${P}%)`:`Retención rescate ${f.nombre} (${f.impuestoRetirada}% s/beneficio)`;s.push({fecha:y,concepto:T,cuantia:$,tipo:"gasto",tags:["impuesto","rendimientos-trabajo","pension"],cuenta:p.cuenta||"default",sourceId:p._id,sourceType:"pension-tax"})}}}};if(p.tipoFrecuencia==="extraordinario")v>=n&&v<=i&&v<=g&&b(p.fechaInicio);else if(p.tipoFrecuencia==="mensual"){const y=Math.max(1,p.frecuencia||1);let{year:f,month:h}=ie(v,n,y);const C=Math.ceil(240/y)+2;for(let S=0;S<C;S++){const I=Ue(f,h,p.diaPago||"")||(()=>{const M=v.getDate(),w=new Date(f,h+1,0).getDate();return st(new Date(f,h,Math.min(M,w)))})(),E=K(I);if(E>i||E>g)break;E>=n&&E>=v&&b(I),h+=y,h>=12&&(f+=Math.floor(h/12),h=h%12)}}else if(p.tipoFrecuencia==="diaria"){const y=Math.max(1,p.frecuencia||1)*864e5;let f=new Date(Math.max(v.getTime(),n.getTime()));if(v<n){const h=Math.ceil((n.getTime()-v.getTime())/y);f=new Date(v.getTime()+h*y)}for(;f<=i&&f<=g;)b(st(f)),f=new Date(f.getTime()+y)}}return s}function To(t,e,a=null){const o=[],s=K(e.start),n=K(e.end);for(const i of t){const r=Mt(i);if(r==="cuenta"||!i.activo)continue;const c=i.planAportaciones||[];for(const l of c){if(!l.importe||l.importe<=0)continue;const u=K(l.fechaInicio||e.start),d=l.fechaFin?K(l.fechaFin):n,p=l.cuentaOrigen||"default",v=!a||!a.length||a.includes(p),g=!a||!a.length||a.includes(i._id),b=r==="pension"?"pension":"capital-mobiliario",y=I=>{v&&o.push({fecha:I,concepto:`Aportación → ${i.nombre}`,cuantia:l.importe,tipo:"gasto",tags:["aportacion","transferencia",b],cuenta:p,sourceId:l._id,sourceType:"aportacion-out"}),g&&o.push({fecha:I,concepto:`Aportación ${i.nombre} (${l.periodicidad||"mensual"})`,cuantia:l.importe,tipo:"ingreso",tags:["aportacion","transferencia",b],cuenta:i._id,sourceId:l._id,sourceType:"aportacion-in"})},f={mensual:1,trimestral:3,semestral:6,anual:12}[l.periodicidad||"mensual"]||1;let{year:h,month:C}=ie(u,s,f);const S=Math.ceil(240/f)+2;for(let I=0;I<S;I++){const E=new Date(h,C+1,0).getDate(),M=st(new Date(h,C,Math.min(u.getDate(),E))),w=K(M);if(w>n||w>d)break;w>=s&&w>=u&&y(M),C+=f,C>=12&&(h+=Math.floor(C/12),C=C%12)}}}return o}function zo(t,e,a=null,o=[]){const s=[];for(const n of t){if(!n.activo||!n.interes||n.interes<=0||a&&a.length>0&&!a.includes(n._id))continue;const i=K(e.start),r=K(e.end),c=n.periodoCobro||"mensual",l=c==="mensual",u=l?null:{diario:864e5,semanal:7*864e5}[c]||864e5,d=l?1/12:u/(365.25*864e5);let p=Pe(n,e.start);const v=o.filter(y=>y.cuenta===n._id).map(y=>({fecha:y.fecha,delta:y.tipo==="ingreso"?Math.abs(y.cuantia):-Math.abs(y.cuantia)})).sort((y,f)=>y.fecha.localeCompare(f.fecha));let g=0,b=new Date(i);for(;b<=r;){const y=l?new Date(b.getFullYear(),b.getMonth()+1,b.getDate()):new Date(b.getTime()+u),f=new Date(Math.min(y.getTime(),r.getTime()+1)),h=st(f);let C=0;for(;g<v.length&&v[g].fecha<h;)C+=v[g].delta,g++;const S=p,I=p+C,E=Math.max(0,(S+I)/2);p=I;const M=l?d:(f.getTime()-b.getTime())/(365.25*864e5),w=E*(Math.pow(1+n.interes/100,M)-1);w>.001&&s.push({fecha:st(b),concepto:`Interés ${n.nombre}`,cuantia:w,tipo:"ingreso",tags:["interes","cuenta"],cuenta:n._id,sourceId:n._id,sourceType:"account-interest"}),b=y}}return s}function jo(t,e,a,o=null){const s=[],n=e||Ht;for(const i of t){if(!i.activo||i.tipo!=="ingreso"||!i.sujetoIRPF)continue;const r=i.cuantia*(i.tipoFrecuencia==="mensual"?12:1),c=_o(r,n),l={...i,_id:i._id+"_irpf",concepto:`IRPF salario ${i.concepto}`,tipo:"gasto",cuantia:c,tags:["irpf","fiscal"]};s.push(...Fe([l],a,o))}return s}const jn=[5,11,2,8],qn={transporte:"Transporte",restaurante:"Restaurante",otros:"Beneficio"};function Ea(t,e,a=null,o=[],s=()=>Ht){const n=[],i=K(e.start),r=K(e.end),c=o.length>0,l={};for(const p of t){const v=p.grupoNomina||"";l[v]||(l[v]=[]),l[v].push(p)}for(const p of Object.keys(l))l[p].sort((v,g)=>(g.bruto||0)-(v.bruto||0));function u(p,v){if(!c||!p.mesActualizacionIPC)return p.bruto||0;const g=p.fechaInicio||e.start,b=K(g),y=K(v);let f=0;for(let C=b.getFullYear();C<=y.getFullYear();C++){const S=new Date(C,p.mesActualizacionIPC-1,1);S>b&&S<=y&&f++}if(f===0)return p.bruto||0;const h=st(new Date(b.getFullYear()+f,0,1));return(p.bruto||0)*Ot(o,g,h)}function d(p,v){const g=u(p,v),b=(p.retribucionFlexible||[]).reduce((A,P)=>A+(P.importe||0)*12,0),y=Math.max(0,g-b);if(p.irpfModo==="manual")return y*((p.irpfPct||0)/100);const f=s(parseInt(v.slice(0,4))),h=p.grupoNomina||"";if(!h)return Pt(Gt(g,b),f);const C=l[h].filter(A=>A.activo),S=C.reduce((A,P)=>A+u(P,v),0),I=C.reduce((A,P)=>A+(P.retribucionFlexible||[]).reduce(($,T)=>$+(T.importe||0)*12,0),0),E=Math.max(0,S-I),M=Gt(S,I),w=Math.max(0,g-b),x=E>0?M*(w/E):0,_=C.filter(A=>A._id!==p._id&&(A.bruto||0)>(p.bruto||0)).reduce((A,P)=>{const $=(P.retribucionFlexible||[]).reduce((D,z)=>D+(z.importe||0)*12,0),T=Math.max(0,u(P,v)-$);return A+(E>0?M*(T/E):0)},0);return Pt(_+x,f)-Pt(_,f)}for(const p of t){if(!p.activo)continue;const v=p.cuenta||"default";if(a&&a.length>0&&!a.includes(v))continue;const g=Math.max(1,p.nPagas||12),b=K(p.fechaInicio||e.start),y=p.fechaFin?K(p.fechaFin):r,f=h=>{const C=u(p,h),S=d(p,h),I=(p.retribucionFlexible||[]).reduce(($,T)=>$+(T.importe||0)*12,0),E=Math.max(0,C-I),M=(p.ssPct??6.35)/100,w=E*M,x=E/g,_=S/g,A=w/g,P=p.representacion==="simplificado"?x-A-_:x;n.push({fecha:h,concepto:p.nombre,cuantia:P,tipo:"ingreso",cuenta:v,tags:p.tags||[],sourceId:p._id,sourceType:"nomina"}),p.representacion==="detallado"&&(A>0&&n.push({fecha:h,concepto:`SS ${p.nombre}`,cuantia:A,tipo:"gasto",cuenta:v,tags:["seguridad-social","fiscal"],sourceId:p._id+"_ss",sourceType:"nomina"}),_>0&&n.push({fecha:h,concepto:`IRPF ${p.nombre}`,cuantia:_,tipo:"gasto",cuenta:v,tags:["irpf","fiscal"],sourceId:p._id+"_irpf",sourceType:"nomina"}));for(const $ of p.retribucionFlexible||[])!$.cuenta||!($.importe>0)||a&&a.length>0&&!a.includes($.cuenta)||n.push({fecha:h,concepto:`${p.nombre} — ${qn[$.tipo]||$.tipo}`,cuantia:$.importe,tipo:"ingreso",cuenta:$.cuenta,tags:["retribucion-flexible",$.tipo],sourceId:`${p._id}_flex_${$._id||$.tipo}`,sourceType:"nomina"})};if(g<=12){const h=g===12?1:Math.round(12/g),C=b.getDate();let{year:S,month:I}=ie(b,i,h);for(let E=0;E<300;E++){const M=new Date(S,I+1,0).getDate(),w=new Date(S,I,Math.min(C,M));if(w>r||w>y)break;w>=i&&w>=b&&f(st(w)),I+=h,I>=12&&(S+=Math.floor(I/12),I=I%12)}}else{const h=g-12,C=b.getDate();let{year:S,month:I}=ie(b,i,1);for(let w=0;w<300;w++){const x=new Date(S,I+1,0).getDate(),_=new Date(S,I,Math.min(C,x));if(_>r||_>y)break;_>=i&&_>=b&&f(st(_)),I++,I>=12&&(S++,I=0)}const E=Math.max(b.getFullYear(),i.getFullYear()),M=Math.min((p.fechaFin?y:r).getFullYear(),r.getFullYear());for(let w=E;w<=M;w++)for(const x of jn.slice(0,h)){const _=new Date(w,x,15);_>=i&&_<=r&&_>=b&&_<=y&&f(st(_))}}}return n}function qo(t,e,a,o=null,s="default"){const n=[];if(!e||e.length===0)return n;const i=K(a.start),r=K(a.end),c=ot(),l=t.filter(d=>d.activo&&d.tipo==="gasto"&&d.tipoFrecuencia==="mensual");let u=new Date(i.getFullYear(),i.getMonth(),1);for(;u<=r;){const d=u.getFullYear(),p=u.getMonth(),v=d+"-"+String(p+1).padStart(2,"0"),g=v+"-01",b=st(new Date(d,p+1,0)),y=st(new Date(d,p,15));let f=0;for(const h of l){if(o&&o.length>0&&!o.includes(h.cuenta||"default")||h.fechaInicio&&h.fechaInicio>b||h.fechaFin&&h.fechaFin<g)continue;const C=h.fechaInicio||c,S=Ot(e,C,y);if(S<=1)continue;const I=Math.max(1,h.frecuencia||1);f+=h.cuantia*(S-1)/I}f>.01&&n.push({fecha:y,concepto:"Incremento coste de vida",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:s,sourceId:"inflacion_vida_"+v,sourceType:"inflacion"}),u=new Date(d,p+1,1)}return n}function No(t,e,a,o="default"){const s=[];if(!e||e.length===0||t<=0)return s;const n=K(a.start),i=K(a.end),r=[...e].sort((l,u)=>l.year-u.year);let c=new Date(n.getFullYear(),n.getMonth(),1);for(;c<=i;){const l=c.getFullYear(),u=c.getMonth(),d=l+"-"+String(u+1).padStart(2,"0"),p=st(new Date(l,u,15)),v=r.filter(h=>h.year<=l),g=v.length>0?v[v.length-1]:r[0],b=g?g.tasa/100:0,y=Math.pow(1+b,1/12)-1,f=t*y;f>.01&&s.push({fecha:p,concepto:"Pérdida ahorro por inflación",cuantia:f,tipo:"gasto",tags:["inflacion"],cuenta:o,sourceId:"inflacion_ahorro_"+d,sourceType:"inflacion"}),c=new Date(l,u+1,1)}return s}function Ro(t,e){const a=e.fechaReferencia||e.dashboardStart,o=a<e.dashboardStart?e.dashboardStart:a>e.dashboardEnd?e.dashboardEnd:a,s=t.reduce((i,r)=>i+Pe(r,o),0),n=Ao(t,o);return{fecha:n&&n<o?n:o,saldo:s,pedida:o}}function ko(t,e,a){const{fecha:o,saldo:s}=Ro(e,a),n=t.filter(u=>u.fecha<o),i=t.filter(u=>u.fecha>=o),r=[];let c=s;for(const u of[...n].reverse()){const d=u.tipo==="ingreso"?Math.abs(u.cuantia):-Math.abs(u.cuantia);r.unshift({...u,delta:d,saldoAcum:c}),c-=d}const l=[];c=s;for(const u of i){const d=u.tipo==="ingreso"?Math.abs(u.cuantia):-Math.abs(u.cuantia);c+=d,l.push({...u,delta:d,saldoAcum:c})}return[...r,...l]}function Nn(t,e,a,o=null){const s=e.filter(n=>n.activo&&(!o||o.length===0||o.includes(n._id)));return ko([...t].sort((n,i)=>n.fecha.localeCompare(i.fecha)),s,a)}function Lo(t){const{loans:e,expenses:a,accounts:o,config:s}=t,n=t.filtroAccounts??null,i=t.nominas??[],r=t.inflacionPeriodos??[],c=o.filter(y=>y.activo&&(!n||n.length===0||n.includes(y._id))),l=Ro(c,s),u={start:l.fecha<s.dashboardStart?l.fecha:s.dashboardStart,end:s.dashboardEnd},d=a.filter(y=>y.tipo!=="transferencia"),p=a.filter(y=>y.tipo==="transferencia"),v={accounts:o,nominas:i,resolverTramosIRPF:t.resolverTramosIRPF,resolverTramosGanancias:t.resolverTramosGanancias};let g=[];g=g.concat(Fe(d,u,n)),g=g.concat(Ma(e,u,n)),g=g.concat(Do(p,u,n,v)),g=g.concat(To(o,u,n));const b=zo(o,u,n,g);if(g=g.concat(b),g=g.concat(jo(a,s.tramos_irpf,u,n)),g=g.concat(Ea(i,u,n,r,t.resolverTramosIRPF)),s.usarInflacion&&r.length>0){const y=(o.find(C=>C.activo&&C.esCuentaPrincipal)||o.find(C=>C.activo)||{_id:"default"})._id;g=g.concat(qo(d,r,u,n,y));const h=o.filter(C=>C.activo&&(!n||n.length===0||n.includes(C._id))).reduce((C,S)=>C+Pe(S,s.dashboardStart),0);g=g.concat(No(h,r,u,y))}return g.sort((y,f)=>y.fecha.localeCompare(f.fecha)),ko(g,c,s).filter(y=>y.fecha>=s.dashboardStart)}function Rn(t,e,a=null){const o=ot(),n=e.filter(r=>r.activo&&(!a||a.length===0||a.includes(r._id))).reduce((r,c)=>r+Bt(c),0),i=t.filter(r=>r.fecha<=o);return i.length===0?n:i[i.length-1].saldoAcum}function Oo(t,e){const a=new Map;for(const o of t)if(o.tipo===e&&!(o.sourceType==="transfer-out"||o.sourceType==="transfer-in"||o.sourceType==="loan-amort"))for(const s of o.tags||["sin_tag"])a.set(s,(a.get(s)||0)+Math.abs(o.cuantia));return a}function kn(t,e){const a=[];let o=!1;for(let s=0;s<t.length;s++){const n=t[s],i=n.saldoAcum;i<0&&(s===0||t[s-1].saldoAcum>=0)&&a.push({tipo:"saldo_negativo",fecha:n.fecha,saldo:i,mensaje:`Saldo negativo (${F(i)}) a partir del ${n.fecha}`}),e>0&&(i<e&&!o?(o=!0,a.push({tipo:"bajo_colchon",fecha:n.fecha,saldo:i,mensaje:`Saldo por debajo del colchón (${F(i)} < ${F(e)}) desde ${n.fecha}`})):i>=e&&o&&(o=!1,a.push({tipo:"recuperacion_colchon",fecha:n.fecha,saldo:i,mensaje:`Recuperación del colchón el ${n.fecha} (${F(i)})`})))}return a}function Ln(t,e){const a=t.filter(i=>i.tipo==="gasto"&&i.sourceType!=="loan-amort").reduce((i,r)=>i+Math.abs(r.cuantia),0),o=K(e.dashboardStart),s=K(e.dashboardEnd),n=Math.max(1,(s.getTime()-o.getTime())/(30.44*864e5));return a/n}function On(t,e,a=ot()){const o=new Set,s=e.map(r=>{const c=r.fechaInicialSaldo||"",l={};c&&c<=a&&(l[c]=r.saldoInicial||0);for(const u of r.historicoSaldos||[])u.fecha<=a&&(!c||u.fecha>=c)&&(l[u.fecha]=u.saldo);return Object.keys(l).forEach(u=>o.add(u)),l}),n={};for(const r of[...o].sort()){let c=0;for(let l=0;l<e.length;l++){const u=Object.entries(s[l]).filter(([d])=>d<=r);u.length>0?(u.sort(([d],[p])=>p.localeCompare(d)),c+=u[0][1]):c+=e[l].saldoInicial||0}n[r]=c}const i=[];for(const[r,c]of Object.entries(n).sort(([l],[u])=>l.localeCompare(u))){const l=t.filter(v=>v.fecha<=r),u=l.length>0?l[l.length-1].saldoAcum:null;if(u===null)continue;const d=c-u,p=u!==0?d/Math.abs(u)*100:0;i.push({cuenta:"Total",fecha:r,estimado:u,real:c,desv:d,pct:p})}return i}const Bn=Object.freeze(Object.defineProperty({__proto__:null,calcDesviacion:On,detectarPuntosCriticos:kn,mediaMensualGastos:Ln},Symbol.toStringTag,{value:"Module"}));function De(t,e=new Date){const a=st(e),o=new Date(e);o.setMonth(o.getMonth()+1);const s=st(o),n=t.filter(r=>r.basico&&r.activo&&r.tipo==="gasto");return Fe(n,{start:a,end:s}).reduce((r,c)=>r+Math.abs(c.cuantia),0)}function Hn(t){return(t||[]).filter(e=>e.basico&&e.activo&&!e.simulacion).reduce((e,a)=>e+Xt(a.capital,a.tin,a.meses),0)}function Gn(t,e){return vt(t).tabla.filter(a=>!a.esAmortizacion&&a.fecha>=e).length}function Bo(t,e,a){return(t||[]).filter(o=>o.basico&&o.activo&&!o.simulacion).reduce((o,s)=>o+Xt(s.capital,s.tin,s.meses)*Math.min(e,Gn(s,a)),0)}function Ho(t,e,a,o=new Date){if(e.colchonTipo==="fijo"&&(e.colchonFijo||0)>0)return e.colchonFijo;const s=De(t,o),n=e.colchonMeses||6;return s*n+Bo(a,n,st(o))}function Vn(t,e,a,o,s){const i=[...e.colchonPuntos||[]].sort((l,u)=>l.fecha.localeCompare(u.fecha)).filter(l=>l.fecha<=o).pop();if(!i)return Ho(t,e,a,s);if(i.tipo==="fijo")return i.importe||0;const r=De(t,s),c=i.meses||6;return r*c+Bo(a,c,o)}function Aa(t,e,a,o,s,n=!1,i){const r=[...t.puntos||[]].sort((u,d)=>u.fecha.localeCompare(d.fecha)),c=r.filter(u=>u.fecha<=s).pop()||(n?r[0]:null);return c?c.tipo==="fijo"?c.importe||0:(De(e,i)+Hn(o))*(c.meses||1):0}function Un(t){return typeof t.delta=="number"?t.delta:t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia)}function Yn(t,e){const a={};for(const o of e)a[o._id]=Bt(o);return t.map(o=>(o.cuenta&&a[o.cuenta]!==void 0&&(a[o.cuenta]+=Un(o)),{fecha:o.fecha,saldos:{...a}}))}function Wn(t,e,a,o,s,n,i){const r=[];for(const c of(t||[]).filter(l=>l.activo!==!1)){let l=!1;for(let u=0;u<e.length;u++){const d=e[u],p=Aa(c,o,s,n,d.fecha,!1,i);if(p<=0){l=!1;continue}const v=!c.cuentas||c.cuentas.length===0?d.saldoAcum:c.cuentas.reduce((g,b)=>{var y,f;return g+(((f=(y=a[u])==null?void 0:y.saldos)==null?void 0:f[b])||0)},0);v<p&&!l?(l=!0,r.push({tipo:"bajo_margen",fecha:d.fecha,saldo:v,target:p,nombre:c.nombre,mensaje:`⚠ ${c.nombre}: ${F(v)} < ${F(p)} desde ${d.fecha}`})):v>=p&&l&&(l=!1,r.push({tipo:"recuperacion_margen",fecha:d.fecha,saldo:v,target:p,nombre:c.nombre,mensaje:`✓ ${c.nombre}: recuperado el ${d.fecha}`}))}}return r}const Kn=Object.freeze(Object.defineProperty({__proto__:null,calcColchon:Ho,calcColchonEnFecha:Vn,calcGastoBasicoMensual:De,calcMargenEnFecha:Aa,detectarCrucesMargenes:Wn,saldosPorCuentaEnExtracto:Yn},Symbol.toStringTag,{value:"Module"}));function Jn(t){if(!t||t.showColchon===!1)return null;const e=t.colchonPuntos??[];return e.length>0?{nombre:"Colchón",puntos:[...e]}:t.colchonTipo==="fijo"&&(t.colchonFijo||0)>0?{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"fijo",importe:t.colchonFijo}]}:{nombre:"Colchón",puntos:[{fecha:"1970-01-01",tipo:"meses",meses:t.colchonMeses||6}]}}function Go(t,e){return Ee(K(t),K(e))}const Xn=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function Vo(t,e){const[a,o,s]=t.split("-").map(Number),n=t.slice(0,4)===e.slice(0,4);return`${s} de ${Xn[o-1]}${n?"":` de ${a}`}`}function Uo(t){return t<=0?"hoy":t===1?"mañana":t<7?`en ${t} días`:t<14?"en una semana":t<31?`en ${Math.round(t/7)} semanas`:t<45?"en un mes":`en ${Math.round(t/30)} meses`}function Qn(t,e={}){const{hoy:a=ot(),horizonteCritico:o=365,horizonteAviso:s=120,maximo:n=4,incertidumbre:i}=e,r=[];for(const d of t.puntosCriticos??[])d.tipo==="saldo_negativo"?r.push({id:"saldo-negativo",gravedad:"critico",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:p=>p?"Podrías quedarte en números rojos":"Te quedas en números rojos",detalle:p=>`El ${p} el saldo proyectado baja a ${F(d.saldo)}.`}):d.tipo==="bajo_colchon"&&r.push({id:"bajo-colchon",gravedad:"aviso",fecha:d.fecha,distancia:Math.abs(d.saldo),titulo:p=>p?"Podrías bajar de tu colchón":"Bajas de tu colchón",detalle:p=>`El ${p} el saldo queda en ${F(d.saldo)}, por debajo del colchón.`});for(const d of t.crucesMargenes??[])d.tipo==="bajo_margen"&&r.push({id:`margen:${d.nombre}`,gravedad:"aviso",fecha:d.fecha,distancia:Math.max(0,d.target-d.saldo),titulo:p=>p?`Podrías bajar de «${d.nombre}»`:`Bajas de «${d.nombre}»`,detalle:p=>`El ${p} tendrías ${F(d.saldo)}, y el margen pide ${F(d.target)}.`});const c=new Map;for(const d of r){const p=c.get(d.id);(!p||d.fecha<p.fecha)&&c.set(d.id,d)}const l=[];for(const d of c.values()){const p=Go(a,d.fecha);if(p<0||p>(d.gravedad==="critico"?o:s))continue;const v=i?i(p):0,g=v>0&&d.distancia<v;l.push({id:d.id,gravedad:d.gravedad,fecha:d.fecha,dias:p,plazo:Uo(p),titulo:d.titulo(g),detalle:d.detalle(Vo(d.fecha,a)),incierto:g})}const u={critico:0,aviso:1};return l.sort((d,p)=>d.fecha.localeCompare(p.fecha)||u[d.gravedad]-u[p.gravedad]),l.slice(0,n)}const Zn=Object.freeze(Object.defineProperty({__proto__:null,colchonComoMargen:Jn,construirAvisos:Qn,describirPlazo:Uo,diasEntreISO:Go,fechaEnPalabras:Vo},Symbol.toStringTag,{value:"Module"})),ti=30.44*864e5;function Yo(t){const e=t.getFullYear(),a=t.getMonth();return{desde:st(new Date(e,a,1)),hasta:st(new Date(e,a,ha(e,a)))}}function Wo(t){const[e,a]=t.split("-").map(Number);return Yo(new Date(e,a-1,1))}function ei(t,e){return Math.max(1,(K(e).getTime()-K(t).getTime())/ti)}const ai=t=>t.filter(e=>e.sourceType!=="transfer-out"&&e.sourceType!=="transfer-in"),Vt=t=>t.reduce((e,a)=>e+Math.abs(a.cuantia),0);function oi(t,e){const a=new Map(e.map(n=>[n._id,n.clasificacion]));let o=0,s=0;for(const n of t){if(n.tipo!=="gasto"||n.sourceType!=="expense")continue;const i=a.get(n.sourceId??"");i!==null&&(i==="deseo"?s+=Math.abs(n.cuantia):o+=Math.abs(n.cuantia))}return{basicos:o,deseo:s}}function si(t,e){const a=e.entreMeses&&e.entreMeses>0?e.entreMeses:1,o=p=>p.sourceType==="loan"&&p.tipo==="gasto",s=e.loanIdsIniciados,n=Vt(t.filter(p=>p.tipo==="ingreso")),i=Vt(t.filter(p=>o(p)&&(!s||s.has(p.sourceId??"")))),r=Vt(t.filter(p=>o(p)&&e.hipotecaIds.has(p.sourceId??""))),c=Vt(t.filter(p=>p.sourceType==="loan-amort")),l=Vt(t.filter(p=>p.sourceType==="account-interest")),{basicos:u,deseo:d}=oi(t,e.expenses);return{ingresos:n/a,cuotas:i/a,cuotasHipoteca:r/a,amortizaciones:c/a,gastosBasicos:u/a,gastosDeseo:d/a,gastosTotales:(i+u+d)/a,intereses:l/a}}function Ko(t,e){return t.reduce((a,o)=>{const s=vt(o).tabla.filter(n=>!n.esAmortizacion&&n.fecha<=e);return a+(s.length>0?s[s.length-1].capitalPendiente:o.capital||0)},0)}function ni(t,e,a,o){const s=t.filter(l=>l.activo&&!l.simulacion&&(l.fechaInicio||"")<=a),n=s.reduce((l,u)=>{if((u.amortizaciones||[]).filter(g=>g.fecha>=e&&g.fecha<=a).length===0)return l;const p=vt(u).totalIntereses,v=vt({...u,amortizaciones:(u.amortizaciones||[]).filter(g=>g.fecha<e||g.fecha>a)}).totalIntereses;return l+Math.max(0,v-p)},0),i=s.filter(l=>l.mostrarFechaFinEnDashboard!==!1).map(l=>({loan:l,fechaFin:vt(l).fechaFin})).filter(l=>!!l.fechaFin&&l.fechaFin>=e&&l.fechaFin<=a),r=s.map(l=>vt(l).tabla),c=l=>{const{desde:u,hasta:d}=Wo(l);return r.reduce((p,v)=>{const g=v.find(b=>!b.esAmortizacion&&b.fecha>=u&&b.fecha<=d);return p+(g?g.cuota:0)},0)};return{deudaInicio:Ko(s,e),deudaFin:Ko(s,a),ahorroIntereses:n,ahorroInteresesMes:o>0?n/o:0,cuotasInicio:c(e.slice(0,7)),cuotasFin:c(a.slice(0,7)),finEnPeriodo:i}}function ii(t,e){return e.filter(a=>a.activo&&(a.interes??0)>0).map(a=>({nombre:a.nombre,interes:a.interes,total:Vt(t.filter(o=>o.sourceType==="account-interest"&&o.sourceId===a._id))})).filter(a=>a.total>0).sort((a,o)=>o.total-a.total)}function Jo(t,e=new Set,a="desglosado"){if(e.size===0)return Oo(t,"gasto");const o=new Map;for(const s of t){if(s.tipo!=="gasto")continue;const n=s.tags||[],i=n.filter(l=>e.has(l)),r=n.filter(l=>!e.has(l)),c=a==="porgrupos"&&i.length>0?i:r;for(const l of c)o.set(l,(o.get(l)||0)+Math.abs(s.cuantia))}return o}function ri(t,e={}){const a=e.activos,o=e.entreMeses&&e.entreMeses>0?e.entreMeses:1;return[...Jo(t,e.grupoTags,e.modo).entries()].filter(([s])=>!a||a.size===0||a.has(s)).map(([s,n])=>({tag:s,total:n/o})).sort((s,n)=>n.total-s.total)}function ci(t,e){const a=e.reduce((o,s)=>o+Bt(s),0);return{saldoBase:a,saldoFinal:t.length>0?t[t.length-1].saldoAcum??a:a,totalGastos:Vt(t.filter(o=>o.tipo==="gasto")),totalIngresos:Vt(t.filter(o=>o.tipo==="ingreso")),tags:[...new Set(t.flatMap(o=>o.tags||[]))]}}function li(t,e){return t.filter(a=>a.activo&&(!e||e.length===0||e.includes(a._id)))}function di(t,e="hipoteca"){return new Set(t.filter(a=>(a.tags||[]).includes(e)).map(a=>a._id))}function ui(t,e){return new Set(t.filter(a=>(a.fechaInicio||"")<=e).map(a=>a._id))}function pi(t,e){if(t.length===0)return[];const a=l=>e==="mes"?l.slice(0,7):l.slice(0,4),o=l=>e==="mes"?`${l}-01`:`${l}-01-01`,s=t[0],n=s.delta??(s.tipo==="ingreso"?Math.abs(s.cuantia):-Math.abs(s.cuantia));let i=(s.saldoAcum??0)-n;const r=[];let c=null;for(const l of t){const u=a(l.fecha),d=l.saldoAcum??i;(!c||c.periodo!==u)&&(c&&(i=c.cierre),c={periodo:u,inicio:o(u),apertura:i,cierre:d,maximo:Math.max(i,d),minimo:Math.min(i,d),eventos:0},r.push(c)),c.cierre=d,d>c.maximo&&(c.maximo=d),d<c.minimo&&(c.minimo=d),c.eventos+=1}return r}const mi=Object.freeze(Object.defineProperty({__proto__:null,agruparOHLC:pi,cuentasVisibles:li,gastoPorTagOrdenado:ri,idsHipoteca:di,idsPrestamosIniciados:ui,interesesPorCuenta:ii,mesesDelPeriodo:ei,metricasFlujo:si,rangoMes:Wo,rangoMesDe:Yo,resumenPrestamosPeriodo:ni,sinTransferencias:ai,sumarGastosPorTag:Jo,totalesPeriodo:ci},Symbol.toStringTag,{value:"Module"}));function Xo(t){return t.imprevisto===!0&&t.importeCts<0&&t.tipo!=="transferencia"&&!t.estimacionId}const fi=["luz","electricidad","gas","agua","internet","fibra","movil","telefono","telefonia","seguro","seguros","comunidad","alquiler","ibi","basura","basuras","suscripcion","suscripciones","recibo","recibos","factura","facturas","suministro","suministros","colegio","guarderia","academia","gimnasio","cuota","mutua","hipoteca","netflix","spotify","hbo","disney","prime","icloud","youtube","iberdrola","endesa","naturgy","repsol","movistar","vodafone","orange","digi","yoigo","masmovil","pepephone","calefaccion","alarma","parking","garaje"],Qo=t=>t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase(),gi=new Set(fi);function vi(t){return Qo([t.concepto??"",...t.tags??[]].join(" ")).split(/[^a-z0-9]+/).some(a=>gi.has(a))}function Je(t){return t?t.esFactura===!0?!0:t.esFactura===!1||(t.tipoFrecuencia??"mensual")!=="mensual"?!1:vi(t)?!0:!!t.diaPago&&t.diaPago!==""&&(t.basico===!0||t.clasificacion==="necesidad"):!1}const bi=new Set(["transfer-out","transfer-in","aportacion-out","aportacion-in"]),Zo=new Set(["account-interest"]),ce="imprevisto-estimado",ts=t=>t.sourceType==="nomina"&&t.tipo==="gasto",ct=t=>Math.round(Math.abs(t)*100);function Xe(t,e,a){const o=new Map;for(const r of t){const c=r.sourceId??r.concepto,l=o.get(c)??{concepto:a(r),total:0,vencido:0,fechas:[]},u=ct(r.cuantia);l.total+=u,r.fecha<=e&&(l.vencido+=u),l.fechas.push(r.fecha),o.set(c,l)}const s=[...o.entries()].map(([r,c])=>({id:r,concepto:c.concepto,total:c.total/100,vencido:c.vencido/100,fechas:c.fechas.sort()})).sort((r,c)=>c.total-r.total||r.concepto.localeCompare(c.concepto)),n=[...o.values()].reduce((r,c)=>r+c.total,0),i=[...o.values()].reduce((r,c)=>r+c.vencido,0);return{total:n/100,vencido:i/100,pendiente:(n-i)/100,partidas:s}}function Qe(t,e,a,o,s={}){const n=new Map(e.map(A=>[A._id,A])),i=new Map(a.map(A=>[A._id,A])),r=t.filter(A=>!bi.has(A.sourceType??"")&&!Zo.has(A.sourceType??"")&&A.sourceType!==ce),c=t.filter(A=>Zo.has(A.sourceType??"")).reduce((A,P)=>A+(P.tipo==="ingreso"?ct(P.cuantia):-ct(P.cuantia)),0),l=t.filter(A=>A.sourceType===ce),u=r.filter(A=>A.tipo==="ingreso").reduce((A,P)=>A+ct(P.cuantia),0),d=r.filter(ts).reduce((A,P)=>A+ct(P.cuantia),0),p=[],v=[],g=[],b=[];for(const A of r){if(A.tipo!=="gasto"||ts(A))continue;const P=A.sourceType==="expense"?n.get(A.sourceId??""):void 0;A.sourceType==="loan"||A.sourceType==="loan-amort"?p.push(A):P!=null&&P.imprevisto?g.push(A):P&&Je(P)?v.push(A):b.push(A)}for(const A of s.movimientos??[]){if(!Xo(A))continue;const P=Qo(A.concepto).replace(/\s+/g," ").trim();g.push({fecha:A.fecha,concepto:A.concepto,cuantia:A.importeCts/100,tipo:"gasto",tags:[],cuenta:"",sourceId:`mov:${P}`,sourceType:"movimiento"})}const y=A=>{var P;return((P=n.get(A.sourceId??""))==null?void 0:P.concepto)??A.concepto},f=Xe(p,o,A=>{var P;return((P=i.get(A.sourceId??""))==null?void 0:P.nombre)??A.concepto}),h=Xe(v,o,y),C=Xe(b,o,y),S=Xe(g,o,y),I=u-d,E=ct(f.total)+ct(h.total)+ct(C.total)+ct(S.total),M=s.estimacionImprevistos??null,w=l.length>0?l.reduce((A,P)=>A+ct(P.cuantia),0):M!==null?Math.max(0,ct(M)-ct(S.total)):0,x=I/100,_=(I-E-w)/100;return{ingresosNetos:x,prestamos:f,facturas:h,otros:C,imprevistos:S,gastosTotales:E/100,estimacionImprevistos:M,reservaImprevistos:w/100,margen:_,margenPct:x>0?_/x*100:null,rendimientos:c/100}}function hi(t,e){const[a,o,s]=t.split("-").map(Number),[n,i,r]=e.split("-").map(Number);if(![a,o,s,n,i,r].every(Number.isFinite)||e<t)return 1;const c=new Date(n,i-1,r+1);let l=(c.getFullYear()-a)*12+(c.getMonth()+1-o);const u=g=>{const b=new Date(a,o-1+g,1),y=new Date(b.getFullYear(),b.getMonth()+1,0).getDate();return new Date(b.getFullYear(),b.getMonth(),Math.min(s,y))};u(l).getTime()>c.getTime()&&(l-=1);const d=u(l),p=Math.round((c.getTime()-d.getTime())/864e5),v=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();return Math.max(.03225806451612903,l+p/v)}function _t(t,e){const[a,o]=t.split("-").map(Number),[s,n]=e.split("-").map(Number);if(![a,o,s,n].every(Number.isFinite))return[];const i=[];for(let r=a,c=o;(r<s||r===s&&c<=n)&&(i.push(`${r}-${String(c).padStart(2,"0")}`),!(i.length>240));c===12?(c=1,r++):c++);return i}function pt(t,e){const[a,o]=t.split("-").map(Number),s=new Date(a,o-1+e,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function Pa(t,e,a,o,s,n={}){var c,l;const i=new Map(o.map(u=>[u,[]]));for(const u of t)(c=i.get(u.fecha.slice(0,7)))==null||c.push(u);const r=new Map(o.map(u=>[u,[]]));for(const u of n.movimientos??[])(l=r.get(u.fecha.slice(0,7)))==null||l.push(u);return o.map(u=>{var d;return{mes:u,desglose:Qe(i.get(u)??[],e,a,s,{movimientos:r.get(u),estimacionImprevistos:n.estimacionPorMes?n.estimacionPorMes(u):((d=n.estimacion)==null?void 0:d.mes)===u?n.estimacion.importe:null})}})}function Ze(t){const e=new Map;for(const n of t)for(const i of n.partidas){const r=e.get(i.id)??{concepto:i.concepto,total:0,vencido:0,fechas:[]};r.total+=ct(i.total),r.vencido+=ct(i.vencido),r.fechas.push(...i.fechas),e.set(i.id,r)}const a=[...e.entries()].map(([n,i])=>({id:n,concepto:i.concepto,total:i.total/100,vencido:i.vencido/100,fechas:i.fechas.sort()})).sort((n,i)=>i.total-n.total||n.concepto.localeCompare(i.concepto)),o=[...e.values()].reduce((n,i)=>n+i.total,0),s=[...e.values()].reduce((n,i)=>n+i.vencido,0);return{total:o/100,vencido:s/100,pendiente:(o-s)/100,partidas:a}}function le(t){const e=Ze(t.map(d=>d.prestamos)),a=Ze(t.map(d=>d.facturas)),o=Ze(t.map(d=>d.otros)),s=Ze(t.map(d=>d.imprevistos)),n=t.reduce((d,p)=>d+Math.round(p.ingresosNetos*100),0),i=ct(e.total)+ct(a.total)+ct(o.total)+ct(s.total),r=t.reduce((d,p)=>d+ct(p.reservaImprevistos),0),c=t.reduce((d,p)=>d+Math.round((p.rendimientos??0)*100),0),l=n/100,u=(n-i-r)/100;return{ingresosNetos:l,prestamos:e,facturas:a,otros:o,imprevistos:s,gastosTotales:i/100,estimacionImprevistos:null,reservaImprevistos:r/100,margen:u,margenPct:l>0?u/l*100:null,rendimientos:c/100}}function es(t){const e=le(t),a=t.length;if(a<=1)return e;const o=g=>Math.round(g*100/a)/100,s=g=>{const b=o(g.total),y=o(g.vencido);return{total:b,vencido:y,pendiente:Math.round((b-y)*100)/100,partidas:g.partidas.map(f=>({...f,total:o(f.total),vencido:o(f.vencido)}))}},n=s(e.prestamos),i=s(e.facturas),r=s(e.otros),c=s(e.imprevistos),l=ct(o(e.ingresosNetos)),u=ct(n.total)+ct(i.total)+ct(r.total)+ct(c.total),d=ct(o(e.reservaImprevistos)),p=l/100,v=(l-u-d)/100;return{ingresosNetos:p,prestamos:n,facturas:i,otros:r,imprevistos:c,gastosTotales:u/100,estimacionImprevistos:null,reservaImprevistos:d/100,margen:v,margenPct:p>0?v/p*100:null,rendimientos:Math.round(e.rendimientos*100/a)/100}}function as(t,e,a){const o={mediaMensual:0,total:0,meses:0,desde:null,hasta:null};if(!a)return o;const s=pt(e,-12),n=pt(e,-1),i=a.slice(0,7)>s?a.slice(0,7):s;if(i>n)return o;const r=_t(i,n),c=t.filter(l=>l.mes>=i&&l.mes<=n).reduce((l,u)=>l+ct(u.desglose.imprevistos.total),0);return{mediaMensual:Math.round(c/r.length)/100,total:c/100,meses:r.length,desde:i,hasta:n}}function Ut(t){const[e,a]=t.split("-").map(Number);return`${t}-${String(new Date(e,a,0).getDate()).padStart(2,"0")}`}function os(t){let e=null;for(const a of t.movimientos)(!e||a.fecha<e)&&(e=a.fecha);for(const a of t.gastos)a.imprevisto&&a.fechaInicio&&(!e||a.fechaInicio<e)&&(e=a.fechaInicio);return e}function _a(t,e){const a=_t(pt(t,-12),pt(t,-1)),o=e.generarExtracto(`${a[0]}-01`,Ut(a[a.length-1])),s=Pa(o,e.gastos,e.prestamos,a,e.hoy,{movimientos:e.movimientos});return as(s,t,os(e))}function Fa(t,e,a=!0){const o=t.hoy.slice(0,7),s=_a(o,t),n=t.movimientos.filter(r=>r.fecha.startsWith(o));return{desglose:Qe(a?e:e.filter(r=>r.sourceType!==ce),t.gastos,t.prestamos,t.hoy,{movimientos:n,estimacionImprevistos:a&&s.meses>0?s.mediaMensual:null}),estimacion:s}}function ss(t,e){const a=e.filter(n=>n.sourceType!==ce),{desglose:o,estimacion:s}=Fa(t,a);return s.meses<=0||s.mediaMensual<=0?null:{mediaMensual:s.mediaMensual,hoy:t.hoy,pendienteMesActual:o.reservaImprevistos}}const yi=Object.freeze(Object.defineProperty({__proto__:null,RESERVA_IMPREVISTOS:ce,desgloseDelMes:Qe,desglosePorMeses:Pa,esFactura:Je,esMovimientoImprevisto:Xo,estimacionImprevistosPara:_a,estimarImprevistos:as,finDeMes:Ut,mediaDeDesgloses:es,mesEnCurso:Fa,mesesDeCalendario:hi,mesesEntre:_t,primerDatoDeSeguimiento:os,reservaParaProyeccion:ss,sumarDesgloses:le,sumarMesesA:pt},Symbol.toStringTag,{value:"Module"})),Da=3,$i=20,xi=45,Ii=3.5,wi=.3,Si=100,ns=new Set(["transfer-out","transfer-in","aportacion-out","aportacion-in","ajuste-saldo-real"]),de=t=>Date.UTC(Number(t.slice(0,4)),Number(t.slice(5,7))-1,Number(t.slice(8,10)))/864e5,is=t=>{const e=[...t].sort((o,s)=>o-s),a=e.length>>1;return e.length%2?e[a]:(e[a-1]+e[a])/2},Te=t=>Math.round(t*100)/100;function Ci(t,e){const a=[];for(const l of t){if(l.sourceType!=="ajuste-saldo-real"||!l.desdeSaldoReal||l.fecha>e)continue;const u=de(l.fecha)-de(l.desdeSaldoReal);u<$i||u>xi||a.push({fecha:l.fecha,desde:l.desdeSaldoReal,dias:u,previsto:Te(l.saldoPrevisto??0),real:Te(l.saldoReal??0),error:Te(l.delta??0)})}const o=[];let s=a;if(a.length>=4){const l=is(a.map(b=>b.error)),u=1.4826*is(a.map(b=>Math.abs(b.error-l))),d=t.map(b=>b.fecha).sort(),p=d.length?Math.max(1,(de(d[d.length-1])-de(d[0]))/30.44):1,v=t.filter(b=>b.tipo==="ingreso"&&!ns.has(b.sourceType??"")&&b.sourceType!=="account-interest").reduce((b,y)=>b+Math.abs(y.cuantia??0),0),g=Math.max(Ii*u,wi*(v/p),Si);s=[];for(const b of a){if(Math.abs(b.error-l)<=g){s.push(b);continue}const y=t.filter(f=>!ns.has(f.sourceType??"")&&(f.tipo==="ingreso"||f.tipo==="gasto")&&Math.abs(de(f.fecha)-de(b.fecha))<=3&&Math.abs(f.cuantia??0)>=Math.abs(b.error-l)*.5).sort((f,h)=>Math.abs(h.cuantia??0)-Math.abs(f.cuantia??0))[0];o.push({...b,descartado:y?`posible desfase de fechas con «${y.concepto??"un movimiento"}» (previsto el ${y.fecha})`:"mes atípico"})}}const n=s.length,i=n?s.reduce((l,u)=>l+u.error,0)/n:0,r=n>=2?Math.sqrt(s.reduce((l,u)=>l+(u.error-i)**2,0)/(n-1)):0,c=n>=Da;return{errores:s,atipicos:o,sesgo:Te(i),dispersion:Te(r),variabilidad:{sigmaMensual:c?r:0,sigmaDeriva:c?Math.sqrt(i**2+r**2/n):0,estimaciones:n,mesesMinimos:n,mesesMaximos:n,fiable:c}}}const Ta=t=>new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(Math.abs(t));function Mi(t){const e=t.errores.length;if(!t.variabilidad.fiable)return`Para medir cuánto se desvía la previsión hacen falta al menos ${Da} meses seguidos con saldo real anotado${e?` (hay ${e})`:""}: se compara lo que se preveía a un mes con el saldo que hubo.`;const a=Math.abs(t.sesgo)<.5?"de media, acabas el mes justo en lo previsto":`de media, acabas el mes ${Ta(t.sesgo)} ${t.sesgo>0?"mejor":"peor"} de lo previsto`,o=t.atipicos.length?` Se apartan ${t.atipicos.length} ${t.atipicos.length===1?"mes atípico":"meses atípicos"}: ${t.atipicos.map(s=>`${s.fecha} (${s.error>0?"+":"−"}${Ta(s.error)}, ${s.descartado})`).join("; ")}.`:"";return`Margen de error medido con tu saldo real en ${e} meses: ${a}, con una dispersión de ±${Ta(t.dispersion)} al mes. La banda (±1 desviación típica, el 68 % de los casos) se ensancha con el tiempo, y más deprisa si hay sesgo: un error que se repite se acumula cada mes.`+o}const Ei=Object.freeze(Object.defineProperty({__proto__:null,MESES_MINIMOS_SALDO:Da,describirPrecisionSaldo:Mi,medirPrecisionConSaldo:Ci},Symbol.toStringTag,{value:"Module"}));function m(t){return String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Yt(t){return`<span style="color:${t<0?"var(--red)":t>0?"var(--accent)":"var(--text2)"}">${m(F(t))}</span>`}function Ai(t){return t===null?'<span style="color:var(--text3);font-size:12px">sin datos</span>':`<span style="color:${t>=90?"var(--accent)":t>=70?"var(--yellow)":"var(--red)"};font-weight:600">${t.toFixed(1)}%</span>`}function rs(t){return t.length===0?'<span style="color:var(--text3);font-size:11px">—</span>':t.map(e=>`<span class="tag">${m(e)}</span>`).join(" ")}const Pi=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];function bt(t){const[e,a]=t.split("-").map(Number);return`${Pi[a-1]} ${e}`}function G(t,e="ok"){const a=globalThis.UI;if(a!=null&&a.toast)return a.toast(t,e);console.info("[FinanceApp]",t)}function $t(t){const e=globalThis.UI;return e!=null&&e.confirm?e.confirm(t):typeof confirm=="function"?confirm(t):!0}function zt(t=document){var o;const e=t.getElementById("modal-content");if(!e)return null;const a=e.cloneNode(!1);return e.replaceWith(a),(o=t.getElementById("modal-box"))==null||o.classList.remove("modal-box--ancho"),a}function L(t,e,a){t.addEventListener("click",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(e);s&&t.contains(s)&&a(s,o)})}function tt(t,e,a){t.addEventListener("change",o=>{var n;const s=(n=o.target)==null?void 0:n.closest(e);s&&t.contains(s)&&a(s,o)})}function Et(t,e){var a;return((a=t.querySelector(e))==null?void 0:a.value)??""}function cs(t,e){const a=parseFloat(Et(t,e));return Number.isFinite(a)?a:0}const ht={prestamos:"#9085e9",facturas:"#d95926",otros:"#3987e5",imprevistos:"#d55181"},_i=t=>String(Number(t.slice(8,10))),Fi=t=>`${t>=0?"+":"−"}${F(Math.abs(t))}`;function ls(t){return`<label class="mes-toggle-imp" title="Si está activo, la previsión aparta cada mes, desde hoy, la media de lo que has marcado como imprevisto en los últimos 12 meses: baja el margen y también la línea de saldo del cuadro de mando.">
    <span class="toggle"><input type="checkbox" data-contar-imprevistos${t?" checked":""} aria-label="Contar con la estimación de imprevistos"/><span class="toggle-slider"></span></span>
    <span>Contar imprevistos</span>
  </label>`}function ds(t,e){if(t.partidas.length===0)return"";const a=t.partidas.map(o=>{const s=e.meses!==void 0||e.media?`${o.fechas.length} ${o.fechas.length===1?"cargo":"cargos"}`:o.fechas.length>4?`${o.fechas.length} cargos`:`día ${o.fechas.map(_i).join(", ")}`;return`<div class="mes-fila${e.meses===void 0&&!e.media&&o.fechas.every(i=>i<=e.hoy)?" mes-fila--hecha":""}">
        <span class="mes-fila-nombre" title="${m(o.concepto)}">${m(o.concepto)}</span>
        <span class="mes-fila-dia">${m(s)}</span>
        <span class="mes-fila-importe">${m(F(o.total))}</span>
      </div>`}).join("");return`<details class="mes-detalle"${e.abierto?" open":""}><summary>${t.partidas.length} ${t.partidas.length===1?"concepto":"conceptos"}</summary>${a}</details>`}function ta(t,e,a,o,s,n,i=""){const r=a.total>0?Math.min(100,a.vencido/a.total*100):0;let c;a.total<=0?c="<span>Nada previsto</span>":o.media&&n?c=`<span>Al mes · <strong>${m(F(o.media.acumulado[n].total))}</strong> en ${o.media.meses} meses</span>`:o.meses!==void 0?c=`<span>Media <strong>${m(F(a.total/Math.max(1,o.meses)))}</strong>/mes</span>`:a.pendiente<=.004?c="<span>Ya cargado todo</span>":c=`<span>Quedan <strong>${m(F(a.pendiente))}</strong></span><span>cargado ${m(F(a.vencido))}</span>`;const l=o.meses!==void 0||o.media?"":`<div class="mes-barra" role="img" aria-label="${Math.round(r)} % ya cargado"><span style="width:${r.toFixed(1)}%"></span></div>`;return`<section class="mes-bloque ${s}" aria-label="${m(t)}">
    <div class="mes-bloque-titulo" title="${m(e)}"><span class="mes-punto" aria-hidden="true"></span>${m(t)}</div>
    <div class="mes-bloque-total">${m(F(a.total))}</div>
    ${l}
    <div class="mes-bloque-pie">${c}</div>
    ${i}
    ${ds(a,o)}
  </section>`}function Di(t,e){const a=t.imprevistos,o=e.estimacion;if(!(e.meses===void 0&&!e.media&&o&&o.meses>0)){const u=t.reservaImprevistos>0?`<div class="mes-bloque-pie mes-bloque-nota"><span>+ ${m(F(t.reservaImprevistos))}${e.media?"/mes":""} reservados para los que aún no han llegado</span></div>`:"",d=a.partidas.filter(v=>v.id.startsWith("mov:")).reduce((v,g)=>v+g.total,0),p=d>.004&&e.meses===void 0&&!e.media?`<div class="mes-bloque-pie mes-bloque-nota" title="Son movimientos registrados en Cuentas y marcados como imprevisto. La previsión del cuadro de mando sale de tus gastos configurados, así que no los incluye."><span>${m(F(d))} son movimientos reales: no están en la previsión del cuadro de mando</span></div>`:"";return ta("Imprevistos","Gastos marcados como imprevisto: en el gasto o en el movimiento real",a,e,"mes-bloque--imprevistos","imprevistos",u+p)}const n=o.mediaMensual,i=n>0?Math.min(100,a.total/n*100):a.total>0?100:0,r=a.total>n+.004,c=r?`<span>Te has pasado <strong>${m(F(a.total-n))}</strong></span>`:e.contarImprevistos===!1?"<span>No se aparta nada: «Contar imprevistos» está apagado</span>":t.reservaImprevistos>0?`<span>Reservado <strong>${m(F(t.reservaImprevistos))}</strong></span>`:"<span>Sin imprevistos previstos</span>",l=`Estimación ${F(n)}/mes · media de ${o.meses} ${o.meses===1?"mes":"meses"}`;return`<section class="mes-bloque mes-bloque--imprevistos${r?" es-excedido":""}" aria-label="Imprevistos">
    <div class="mes-bloque-titulo" title="Gastos marcados como imprevisto: en el gasto o en el movimiento real. La estimación es la media de lo marcado en los últimos 12 meses."><span class="mes-punto" aria-hidden="true"></span>Imprevistos</div>
    <div class="mes-bloque-total">${m(F(a.total))}<span class="mes-bloque-de"> de ${m(F(n))}</span></div>
    <div class="mes-barra" role="img" aria-label="${Math.round(i)} % de la estimación"><span style="width:${i.toFixed(1)}%"></span></div>
    <div class="mes-bloque-pie">${c}</div>
    <div class="mes-bloque-pie mes-bloque-nota"><span>${m(l)}</span></div>
    ${ds(a,e)}
  </section>`}function ea(t,e){const a=t.margen>=0,o=t.margenPct===null?"":` · ${Math.abs(t.margenPct).toFixed(0)} % de lo que entra`,s=e.meses!==void 0&&e.meses>1?`<div class="mes-bloque-pie"><span>Media ${a?"+":"−"}${m(F(Math.abs(t.margen)/e.meses))}/mes</span></div>`:"",n=t.reservaImprevistos>0?`<div class="mes-bloque-pie"><span>${e.media?"Incluye":"Ya descontados"} ${m(F(t.reservaImprevistos))}${e.media?"/mes":""} para imprevistos</span></div>`:"",i=e.media?`<div class="mes-bloque-pie"><span>En ${e.media.meses} meses: <strong>${e.media.acumulado.margen>=0?"+":"−"}${m(F(Math.abs(e.media.acumulado.margen)))}</strong></span></div>`:"",r=Math.abs(t.rendimientos??0)>=.005?t.rendimientos:0,c=t.margen+r,l=r?`<div class="mes-bloque-pie mes-bloque-nota" title="Intereses de cuentas y rentabilidad de fondos: no cuentan en el margen (no es dinero para gastar), pero sí mueven el saldo. Es la cifra que verás en la gráfica de saldo."><span>Con ${m(Fi(r))}${e.media?"/mes":""} de intereses y rentabilidad, el saldo ${c>=0?"sube":"baja"} <strong>${m(F(Math.abs(c)))}</strong>${e.media?"/mes":""}</span></div>`:"";return`<div class="mes-rejilla">
      ${ta("Préstamos","Cuotas y amortizaciones previstas",t.prestamos,e,"mes-bloque--prestamos","prestamos")}
      ${ta("Facturas","Gastos fijos y recurrentes: recibos, alquiler, seguros, suscripciones. Se puede marcar a mano en cada gasto.",t.facturas,e,"mes-bloque--facturas","facturas")}
      ${ta("Otros gastos","El resto de gastos previstos: compra, ocio, puntuales",t.otros,e,"mes-bloque--otros","otros")}
      ${Di(t,e)}
      <section class="mes-bloque mes-bloque--margen ${a?"es-positivo":"es-negativo"}" aria-label="Margen de ahorro esperado">
        <div class="mes-bloque-titulo" title="Ingresos netos menos préstamos, facturas, otros gastos e imprevistos, y menos lo que queda por reservar para imprevistos">Margen de ahorro</div>
        <div class="mes-bloque-total">${a?"+":"−"}${m(F(Math.abs(t.margen)))}</div>
        <div class="mes-bloque-pie"><span>${a?"Te sobra":"Te falta"}${m(o)}</span></div>
        ${s}
        ${i}
        ${n}
        <div class="mes-bloque-pie"><span>Gastos previstos: ${m(F(t.gastosTotales))}${e.media?"/mes":""}</span></div>
        ${l}
      </section>
    </div>`}function Ti(t,e,a,o=null,s=!0){return`<div class="card mes-card" data-mes-card>
    <div class="mes-cabecera">
      <div class="card-title" style="margin:0">Este mes · ${m(bt(e))}</div>
      <div class="mes-cabecera-der">
        <span class="mes-ingresos">Entran <strong>${m(F(t.ingresosNetos))}</strong> netos</span>
        ${ls(s)}
        <button type="button" class="btn-secondary btn-sm" data-mes-historico title="Meses anteriores y previsión de los próximos">Otros meses</button>
      </div>
    </div>
    ${ea(t,{hoy:a,estimacion:o,contarImprevistos:s})}
  </div>`}const it={preset:"6",vista:"mes"},us=36,zi=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],za=t=>`${zi[Number(t.slice(5,7))-1]} ${t.slice(2,4)}`,ji=new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",notation:"compact",maximumFractionDigits:1}),ue=t=>`${t>=0?"+":"−"}${F(Math.abs(t))}`;let ze=[];function qi(){for(const t of ze)try{t.destroy()}catch{}ze=[]}function Ni(t,e,a,o){const s=e.slice(0,4);switch(t){case"anio":return _t(`${s}-01`,e);case"aniocompleto":return _t(`${s}-01`,`${s}-12`);case"f3":case"f6":case"f12":return _t(pt(e,1),pt(e,Number(t.slice(1))));case"personalizado":if(a&&o){const[n,i]=a<=o?[a,o]:[o,a],r=_t(n,i);return n>e?r.slice(0,us):r.slice(-us)}return _t(pt(e,-5),e);default:{const n=Number(t)||6;return _t(pt(e,-(n-1)),e)}}}function Ri(t){var H;let e=t;const a=()=>e.contarImprevistos!==!1,o=e.doc??document,s=o.getElementById("modal-overlay"),n=zt(o);if(!s||!n)return null;const i=n;(H=o.getElementById("modal-box"))==null||H.classList.add("modal-box--ancho");const r=e.hoy.slice(0,7);let c=[],l=pt(r,-1),u=e.movimientos??[],d=null;try{d=_a(r,{...e,movimientos:u})}catch(j){console.error("[Otros meses] No se ha podido estimar los imprevistos:",j)}function p(){const j=Ni(it.preset,r,it.desde,it.hasta);if(j.length===0){c=[];return}const N=j[j.length-1],[R,q]=N.split("-").map(Number),B=`${N}-${String(new Date(R,q,0).getDate()).padStart(2,"0")}`,Y=e.generarExtracto(`${j[0]}-01`,B);if(c=Pa(Y,e.gastos,e.prestamos,j,e.hoy,{movimientos:u,estimacionPorMes:J=>a()&&d&&d.meses>0&&J>=r?d.mediaMensual:null}),!j.includes(l)){const J=j.filter(at=>at<r);l=J.length?J[J.length-1]:j[0]}}function v(){const j=(R,q)=>`<button type="button" class="period-btn${it.preset===R?" active":""}" data-hist-preset="${R}" aria-pressed="${it.preset===R}">${q}</button>`,N=it.preset==="personalizado"?`<div class="hist-rango">
            <label>Desde <input class="form-input" type="month" data-hist-desde value="${m(it.desde??"")}"/></label>
            <label>Hasta <input class="form-input" type="month" data-hist-hasta value="${m(it.hasta??r)}"/></label>
          </div>`:"";return`<div class="hist-periodos">
        <div class="hist-filtros" role="group" aria-label="Periodo pasado">
          <span class="hist-filtros-etq">Pasado</span>
          ${j("3","3 meses")}${j("6","6 meses")}${j("12","12 meses")}${j("anio","Este año")}
        </div>
        <div class="hist-filtros" role="group" aria-label="Previsión">
          <span class="hist-filtros-etq">Previsión</span>
          ${j("f3","Próximos 3")}${j("f6","Próximos 6")}${j("f12","Próximos 12")}${j("aniocompleto",`Todo ${r.slice(0,4)}`)}
          ${j("personalizado","Elegir…")}
        </div>
      </div>${N}`}function g(){return c.map(({mes:j,desglose:N})=>{const R=it.vista==="mes"&&j===l,q=j===r,B=j>r;return`<button type="button" class="hist-ficha${R?" activa":""}${B?" es-futuro":""}" data-hist-mes="${j}" aria-pressed="${R}"
            title="${m(bt(j))}${q?" (en curso)":B?" (previsión)":""}: gastos ${m(F(N.gastosTotales))}, margen ${m(ue(N.margen))}">
          <span class="hist-ficha-mes">${m(za(j))}${q?"*":""}</span>
          <span class="hist-ficha-margen ${N.margen>=0?"es-positivo":"es-negativo"}">${m(ue(N.margen))}</span>
        </button>`}).join("")}function b(){if(c.length===0)return"";if(it.vista==="media"){const q=c.map(at=>at.desglose),B=es(q),Y=le(q),J=`${bt(c[0].mes)} – ${bt(c[c.length-1].mes)}`;return`<div class="hist-detalle-cab">
          <div><div class="card-title" style="margin:0">Media mensual · ${c.length} ${c.length===1?"mes":"meses"}</div>
          <div class="text-sm" style="color:var(--text3)">${m(J)}${y()}</div></div>
          <span class="mes-ingresos">Entran <strong>${m(F(B.ingresosNetos))}</strong> netos al mes</span>
        </div>
        ${ea(B,{hoy:e.hoy,media:{meses:c.length,acumulado:Y},contarImprevistos:a()})}`}if(it.vista==="acumulado"){const q=le(c.map(Y=>Y.desglose)),B=`${bt(c[0].mes)} – ${bt(c[c.length-1].mes)}`;return`<div class="hist-detalle-cab">
          <div><div class="card-title" style="margin:0">Acumulado · ${c.length} ${c.length===1?"mes":"meses"}</div>
          <div class="text-sm" style="color:var(--text3)">${m(B)}${y()}</div></div>
          <span class="mes-ingresos">${c.every(Y=>Y.mes>r)?"Entrarán":"Entran"} <strong>${m(F(q.ingresosNetos))}</strong> netos</span>
        </div>
        ${ea(q,{hoy:e.hoy,meses:c.length,contarImprevistos:a()})}`}const j=c.find(q=>q.mes===l)??c[c.length-1],N=j.mes===r,R=j.mes>r;return`<div class="hist-detalle-cab">
        <div class="card-title" style="margin:0">${m(bt(j.mes))}${N?" · en curso":R?" · previsión":""}</div>
        <span class="mes-ingresos">${R?"Entrarán":N?"Entran":"Entraron"} <strong>${m(F(j.desglose.ingresosNetos))}</strong> netos</span>
      </div>
      ${ea(j.desglose,{hoy:e.hoy,abierto:!0,estimacion:N||R?d:null,contarImprevistos:a()})}`}function y(){const j=c.filter(q=>q.mes>r).length,N=c.some(q=>q.mes===r);if(j===c.length)return" · todo previsión";const R=[N?"incluye el mes en curso":"",j?`${j} ${j===1?"mes":"meses"} de previsión`:""].filter(Boolean);return R.length?` · ${R.join(" y ")}`:""}function f(){if(c.length===0)return{gastos:"",ahorro:""};const j=le(c.map(q=>q.desglose)),N=c.reduce((q,B)=>B.desglose.margen<q.desglose.margen?B:q),R=c.reduce((q,B)=>B.desglose.gastosTotales>q.desglose.gastosTotales?B:q);return{gastos:`Gastos por mes, de ${bt(c[0].mes)} a ${bt(c[c.length-1].mes)}. El mes de más gasto es ${bt(R.mes)}, con ${F(R.desglose.gastosTotales)}.`,ahorro:`Margen de ahorro de cada mes y acumulado. En el periodo: ${ue(j.margen)}. El peor mes es ${bt(N.mes)}, con ${ue(N.desglose.margen)}.`}}function h(){qi(),p();const j=f(),N=c.length?le(c.map(q=>q.desglose)):null,R=typeof globalThis.Chart=="function";i.innerHTML=`
      <div class="modal-title">Otros meses</div>
      ${v()}
      ${c.length===0?'<p class="text-sm" style="margin-top:14px">Elige un mes de inicio anterior o igual al de fin.</p>':`
      <section class="hist-grafica">
        <div class="hist-grafica-cab">
          <h3 class="hist-titulo">Gastos por mes</h3>
          <span class="text-sm" style="color:var(--text3)">Toca un mes para ver su desglose</span>
        </div>
        <div class="hist-estimacion">${d&&d.meses>0?`<span><span class="mes-punto" style="--grupo:${ht.imprevistos}" aria-hidden="true"></span>Imprevistos estimados: <strong>${m(F(d.mediaMensual))}/mes</strong> · media de lo marcado en ${d.meses} ${d.meses===1?"mes":"meses"} (${m(F(d.total))} en total)</span>${ls(a())}`:"Marca gastos o movimientos como «Imprevisto» y aquí aparecerá cuánto suelen costarte al mes."}
        </div>
        ${R?`<div class="hist-lienzo"><canvas data-hist-gastos role="img" aria-label="${m(j.gastos)}"></canvas></div>`:""}
      </section>
      <section class="hist-grafica">
        <div class="hist-grafica-cab">
          <h3 class="hist-titulo">Impacto en el ahorro</h3>
          <span class="hist-total ${N&&N.margen>=0?"es-positivo":"es-negativo"}">Acumulado ${m(ue((N==null?void 0:N.margen)??0))}</span>
        </div>
        ${R?`<div class="hist-lienzo hist-lienzo--bajo"><canvas data-hist-ahorro role="img" aria-label="${m(j.ahorro)}"></canvas></div>`:""}
      </section>
      <div class="hist-fichas" role="group" aria-label="Meses del periodo">${g()}</div>
      ${c.some(q=>q.mes===r)?'<div class="text-sm" style="color:var(--text3);margin-top:4px">* Mes en curso: incluye lo que queda por cargar.</div>':""}
      ${c.some(q=>q.mes>r)?`<div class="text-sm" style="color:var(--text3);margin-top:4px">Los meses de la zona «Previsión» salen de lo que tienes configurado (gastos, nóminas y préstamos)${a()&&d&&d.meses>0?`, y cada uno reserva ${m(F(d.mediaMensual))} para imprevistos`:""}.</div>`:""}
      <div class="hist-filtros hist-vista" role="group" aria-label="Qué desglose ver">
        <button type="button" class="period-btn${it.vista==="mes"?" active":""}" data-hist-vista="mes" aria-pressed="${it.vista==="mes"}">Mes seleccionado</button>
        <button type="button" class="period-btn${it.vista==="media"?" active":""}" data-hist-vista="media" aria-pressed="${it.vista==="media"}">Media del periodo</button>
        <button type="button" class="period-btn${it.vista==="acumulado"?" active":""}" data-hist-vista="acumulado" aria-pressed="${it.vista==="acumulado"}">Acumulado del periodo</button>
      </div>
      <div data-hist-detalle>${b()}</div>`}`,R&&c.length>0&&V()}function C(j){l=j,it.vista="mes";const N=i.querySelector(".hist-fichas");N&&(N.innerHTML=g()),i.querySelectorAll("[data-hist-vista]").forEach(q=>{const B=q.dataset.histVista==="mes";q.classList.toggle("active",B),q.setAttribute("aria-pressed",String(B))});const R=i.querySelector("[data-hist-detalle]");R&&(R.innerHTML=b()),D()}const S="#8b98ad",I="rgba(255,255,255,0.06)",E="#141b27",M="#2ee6a8",w="#ff6b6b",x="#c9d3e3",_="#e5b73b",A=(j,N)=>{const R=parseInt(j.slice(1),16);return`rgba(${R>>16&255}, ${R>>8&255}, ${R&255}, ${N})`},P=(j,N,R=1)=>{var q;return it.vista!=="mes"||((q=c[N])==null?void 0:q.mes)===l?A(j,R):A(j,R*.4)},$=.38,T=()=>c.some(j=>j.desglose.reservaImprevistos>0);function D(){const[j,N]=ze;if(j){const R=[ht.prestamos,ht.facturas,ht.otros,ht.imprevistos,ht.imprevistos],q=[1,1,1,1,$];j.data.datasets.forEach((B,Y)=>B.backgroundColor=c.map((J,at)=>P(R[Y],at,q[Y]))),j.update("none")}if(N){const R=N.data.datasets[0];R.backgroundColor=c.map((q,B)=>P(q.desglose.margen>=0?M:w,B)),N.update("none")}}const z=j=>({position:"top",align:"start",labels:{color:"#c9d3e3",boxWidth:10,boxHeight:10,usePointStyle:!0,font:{size:12},generateLabels:N=>N.data.datasets.map((R,q)=>({text:R.label??"",fillStyle:j[q],strokeStyle:j[q],lineWidth:0,pointStyle:"rectRounded",fontColor:"#c9d3e3",hidden:!N.isDatasetVisible(q),datasetIndex:q}))}}),k={id:"zonaPrevision",beforeDatasetsDraw(j){const N=c.findIndex(J=>J.mes>r);if(N<0)return;const{ctx:R,chartArea:q,scales:B}=j,Y=N===0?q.left:(B.x.getPixelForValue(N-1)+B.x.getPixelForValue(N))/2;R.save(),R.fillStyle="rgba(255,255,255,0.035)",R.fillRect(Y,q.top,q.right-Y,q.bottom-q.top),R.strokeStyle="rgba(255,255,255,0.18)",R.setLineDash([3,3]),R.beginPath(),R.moveTo(Y,q.top),R.lineTo(Y,q.bottom),R.stroke(),R.setLineDash([]),R.fillStyle=S,R.font="11px system-ui, sans-serif",R.textBaseline="bottom",R.fillText("Previsión",Y+6,q.bottom-4),R.restore()}};function V(){const j=globalThis.Chart,N=c.map(W=>W.mes===r?`${za(W.mes)}*`:za(W.mes)),R=W=>({x:{stacked:W,grid:{display:!1},ticks:{color:S,font:{size:11}},border:{color:I}},y:{stacked:W,grid:{color:I},border:{display:!1},ticks:{color:S,font:{size:11},maxTicksLimit:5,callback:X=>ji.format(X)}}}),B={responsive:!0,maintainAspectRatio:!1,animation:{duration:250},interaction:{mode:"index",intersect:!1},onClick:(W,X,dt)=>{const wt=dt.getElementsAtEventForMode(W,"index",{intersect:!1},!0);wt.length>0&&c[wt[0].index]&&C(c[wt[0].index].mes)},onHover:(W,X)=>{var wt;const dt=(wt=W.native)==null?void 0:wt.target;dt&&(dt.style.cursor=X.length?"pointer":"default")}},Y=W=>({backgroundColor:"#0d131d",borderColor:"rgba(255,255,255,0.12)",borderWidth:1,titleColor:"#eef3fb",bodyColor:"#c9d3e3",footerColor:"#8b98ad",padding:10,callbacks:{title:X=>bt(c[X[0].dataIndex].mes),label:X=>` ${X.dataset.label}: ${F(X.raw)}`,...W?{footer:X=>W(X[0].dataIndex)}:{}}}),J=i.querySelector("[data-hist-gastos]");if(J){const W=(X,dt,wt,oe,O=1)=>({label:X,data:wt,backgroundColor:c.map((U,Z)=>P(dt,Z,O)),borderColor:E,borderWidth:{top:2},borderSkipped:"bottom",borderRadius:oe?{topLeft:4,topRight:4}:0,maxBarThickness:38});ze.push(new j(J,{type:"bar",data:{labels:N,datasets:[W("Préstamos",ht.prestamos,c.map(X=>X.desglose.prestamos.total),!1),W("Facturas",ht.facturas,c.map(X=>X.desglose.facturas.total),!1),W("Otros gastos",ht.otros,c.map(X=>X.desglose.otros.total),!1),W("Imprevistos",ht.imprevistos,c.map(X=>X.desglose.imprevistos.total),!T()),...T()?[W("Imprevistos estimados",ht.imprevistos,c.map(X=>X.desglose.reservaImprevistos),!0,$)]:[]]},plugins:[k],options:{...B,scales:R(!0),plugins:{legend:z([ht.prestamos,ht.facturas,ht.otros,ht.imprevistos,A(ht.imprevistos,$)]),tooltip:Y(X=>`Total: ${F(c[X].desglose.gastosTotales+c[X].desglose.reservaImprevistos)}`)}}}))}const at=i.querySelector("[data-hist-ahorro]");if(at){let W=0;const X=c.map(O=>W=Math.round((W+O.desglose.margen)*100)/100),dt=c.some(O=>Math.abs(O.desglose.rendimientos??0)>=.005);let wt=0;const oe=c.map(O=>wt=Math.round((wt+O.desglose.margen+(O.desglose.rendimientos??0))*100)/100);ze.push(new j(at,{type:"bar",data:{labels:N,datasets:[{type:"bar",label:"Margen del mes",data:c.map(O=>O.desglose.margen),backgroundColor:c.map((O,U)=>P(O.desglose.margen>=0?M:w,U)),borderRadius:4,borderSkipped:!1,maxBarThickness:38,order:2},{type:"line",label:"Ahorro acumulado",data:X,borderColor:x,backgroundColor:x,borderWidth:2,pointRadius:4,pointHoverRadius:6,pointBorderColor:E,pointBorderWidth:2,tension:0,order:1},...dt?[{type:"line",label:"Saldo (con intereses)",data:oe,borderColor:_,backgroundColor:_,borderWidth:2,borderDash:[6,4],pointRadius:3,pointHoverRadius:5,pointBorderColor:E,pointBorderWidth:2,tension:0,order:0}]:[]]},plugins:[k],options:{...B,scales:R(!1),plugins:{legend:z([M,x,_]),tooltip:Y(O=>{const U=c[O].desglose,ut=[U.margenPct===null?"":`${U.margenPct.toFixed(0)} % de lo que ${c[O].mes>r?"entrará":"entra"}`];return U.reservaImprevistos>0&&ut.push(`Descontados ${F(U.reservaImprevistos)} para imprevistos`),Math.abs(U.rendimientos??0)>=.005&&ut.push(`Intereses y rentabilidad: ${ue(U.rendimientos)} (fuera del margen)`),ut.filter(Boolean).join(`
`)})}}}))}}return L(i,"[data-hist-preset]",j=>{const N=j.getAttribute("data-hist-preset");if(it.preset=N,N==="personalizado"){const R=c.map(q=>q.mes);it.desde=it.desde??R[0]??pt(r,-5),it.hasta=it.hasta??R[R.length-1]??pt(r,6)}h()}),tt(i,"[data-hist-desde], [data-hist-hasta]",()=>{var R,q;const j=(R=i.querySelector("[data-hist-desde]"))==null?void 0:R.value,N=(q=i.querySelector("[data-hist-hasta]"))==null?void 0:q.value;j&&(it.desde=j),N&&(it.hasta=N),h()}),tt(i,"[data-contar-imprevistos]",j=>{var q;const N=j.checked;let R=null;try{R=(q=e.onContarImprevistos)==null?void 0:q.call(e,N)}catch(B){console.error("[Otros meses] No se ha podido cambiar «Contar imprevistos»:",B)}e=R?{...R,doc:e.doc}:{...e,contarImprevistos:N},u=e.movimientos??[],h()}),L(i,"[data-hist-mes]",j=>C(j.getAttribute("data-hist-mes"))),L(i,"[data-hist-vista]",j=>{it.vista=j.getAttribute("data-hist-vista"),i.querySelectorAll("[data-hist-vista]").forEach(q=>{const B=q.dataset.histVista===it.vista;q.classList.toggle("active",B),q.setAttribute("aria-pressed",String(B))});const N=i.querySelector(".hist-fichas");N&&(N.innerHTML=g());const R=i.querySelector("[data-hist-detalle]");R&&(R.innerHTML=b()),D()}),h(),s.classList.remove("hidden"),i}const mt={preset:"alrededor"};function ja(t,e,a,o){const s=e.slice(0,7);switch(t){case"ultimos12":return{desde:`${pt(s,-11)}-01`,hasta:e};case"anio":return{desde:`${e.slice(0,4)}-01-01`,hasta:`${e.slice(0,4)}-12-31`};case"proximos12":return{desde:Lt(e,1),hasta:Ut(pt(s,12))};case"personalizado":return a&&o?a<=o?{desde:a,hasta:o}:{desde:o,hasta:a}:{desde:`${pt(s,-6)}-01`,hasta:Ut(pt(s,6))};default:return{desde:`${pt(s,-6)}-01`,hasta:Ut(pt(s,6))}}}const ki=(t,e,a)=>`informe-${t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"financeapp"}-${e}-a-${a}.html`;function Li(t){const e=t.doc??document,a=t.win??window,o=e.getElementById("modal-overlay"),s=zt(e);if(!o||!s)return null;const n=s;function i(){const l=ja(mt.preset,t.hoy,mt.desde,mt.hasta),u=(d,p,v)=>`<label class="inf-opcion${mt.preset===d?" activa":""}">
        <input type="radio" name="inf-periodo" value="${d}"${mt.preset===d?" checked":""}/>
        <span><strong>${p}</strong><em>${v}</em></span>
      </label>`;n.innerHTML=`
      <div class="modal-title">Crear informe</div>
      <p class="text-sm" style="color:var(--text2);line-height:1.6;margin:0 0 14px">
        Un documento para leer con calma o imprimir: une lo que ha pasado en tus cuentas con lo que está previsto,
        cuadrado al céntimo, y compara lo que preveías con lo que pasó de verdad.
      </p>
      <fieldset class="inf-opciones">
        <legend class="form-label">Periodo</legend>
        ${u("alrededor","Seis meses atrás y seis adelante","El pasado real y la previsión, con hoy en medio")}
        ${u("ultimos12","Los últimos 12 meses","Solo pasado: lo previsto frente a lo real")}
        ${u("anio",`Todo ${t.hoy.slice(0,4)}`,"Del 1 de enero al 31 de diciembre")}
        ${u("proximos12","Los próximos 12 meses","Solo previsión, desde mañana")}
        ${u("personalizado","Elegir fechas","Cualquier periodo, antes o después de hoy")}
      </fieldset>
      ${mt.preset==="personalizado"?`<div class="grid-2 mt-8">
              <div class="form-group"><label class="form-label" for="inf-desde">Desde</label><input class="form-input" type="date" id="inf-desde" value="${m(l.desde)}"/></div>
              <div class="form-group"><label class="form-label" for="inf-hasta">Hasta</label><input class="form-input" type="date" id="inf-hasta" value="${m(l.hasta)}"/></div>
            </div>`:`<p class="text-sm mt-8" style="color:var(--text3)">Del ${m(l.desde)} al ${m(l.hasta)}</p>`}
      <div class="flex gap-8 mt-16" style="justify-content:flex-end;flex-wrap:wrap">
        <button type="button" class="btn-secondary" data-inf-descargar>Descargar</button>
        <button type="button" class="btn-primary" data-inf-ver>Ver informe</button>
      </div>`}function r(){const l=ja(mt.preset,t.hoy,mt.desde,mt.hasta);try{return{html:t.construir(l.desde,l.hasta),...l}}catch(u){return console.error("[informe] No se ha podido generar:",u),G("No se ha podido generar el informe","err"),null}}function c(l){const u=URL.createObjectURL(new Blob([l.html],{type:"text/html;charset=utf-8"})),d=e.createElement("a");d.href=u,d.download=ki(t.proyecto,l.desde,l.hasta),e.body.appendChild(d),d.click(),d.remove(),setTimeout(()=>URL.revokeObjectURL(u),6e4)}return tt(n,'input[name="inf-periodo"]',l=>{if(mt.preset=l.value,mt.preset==="personalizado"&&!mt.desde){const u=ja("alrededor",t.hoy);mt.desde=u.desde,mt.hasta=u.hasta}i()}),tt(n,"#inf-desde, #inf-hasta",()=>{var l,u;mt.desde=((l=n.querySelector("#inf-desde"))==null?void 0:l.value)||mt.desde,mt.hasta=((u=n.querySelector("#inf-hasta"))==null?void 0:u.value)||mt.hasta}),L(n,"[data-inf-ver]",()=>{const l=r();if(!l)return;const u=URL.createObjectURL(new Blob([l.html],{type:"text/html;charset=utf-8"}));a.open(u,"_blank")||(c(l),G("El navegador no ha dejado abrir una pestaña: el informe se ha descargado")),setTimeout(()=>URL.revokeObjectURL(u),6e4)}),L(n,"[data-inf-descargar]",()=>{const l=r();l&&(c(l),G("Informe descargado"))}),i(),o.classList.remove("hidden"),n}const St=t=>Math.round(t*100),et=t=>t/100,qa=t=>t.tipo==="ingreso"?Math.abs(t.cuantia):-Math.abs(t.cuantia),aa=(t,e)=>t<e?t:e,Oi=(t,e)=>t>e?t:e,Bi=t=>`${t<0?"−":"+"}${F(Math.abs(t))}`;function Hi(t){const e=t.hoy??ot(),a=t.desde,o=t.hasta<t.desde?t.desde:t.hasta,s=Lt(o,1),n=(O,U)=>St(t.saldoEnFecha(O,U)),i=O=>t.cuentas.reduce((U,Z)=>U+n(Z,O),0),r=(O,U)=>t.ultimoSaldoConocido(O,U)||null,c=t.cuentas.map(O=>r(O,e)??"").reduce((O,U)=>U>O?U:O,""),l=!c||c<a?a:aa(c,s),u=l>a,d=l<=o,p=t.generarExtracto(a,o,e).filter(O=>O.fecha>=a&&O.fecha<=o).sort((O,U)=>O.fecha.localeCompare(U.fecha)),v=O=>O.reduce((U,Z)=>U+St(qa(Z)),0),g=(O,U)=>p.filter(Z=>Z.fecha>=O&&Z.fecha<U),b=O=>{const U=Qe(O,t.gastos,t.prestamos,e),Z=v(O),ut=St(U.ingresosNetos),se=St(U.gastosTotales),kt=O.filter(ne=>ne.sourceType===ce).reduce((ne,Me)=>ne+St(Math.abs(Me.cuantia)),0);return{d:U,total:Z,ingresos:ut,gastos:se,reserva:kt,otros:Z-(ut-se-kt)}},y=i(a),f=b(g(a,l)),h=b(g(l,s)),C=y+f.total,S=u?i(l):y,I=u?S-C:0,E=S+h.total,M=h.reserva,w=[{concepto:`Saldo real al empezar (${a})`,importe:et(y),saldo:!0}],x=(O,U)=>{const Z=U?` ${U}`:"";w.push({concepto:`Ingresos previstos${Z}`,nota:"netos de retenciones de nómina",importe:et(O.ingresos)},{concepto:`Gastos previstos${Z}`,importe:-et(O.gastos)}),O.otros&&w.push({concepto:`Intereses y traspasos previstos${Z}`,importe:et(O.otros)}),O.reserva&&w.push({concepto:"Reserva para imprevistos",nota:t.imprevistos&&t.imprevistos.meses>0?`media de ${t.imprevistos.meses} ${t.imprevistos.meses===1?"mes":"meses"}`:void 0,importe:-et(O.reserva)})};let _=0;u&&(x(f,"hasta el corte"),w.push({concepto:`Saldo previsto al ${l}`,importe:et(C),saldo:!0}),w.push({concepto:"Diferencia con el saldo real",nota:I>=0?"tienes más de lo que preveías":"tienes menos de lo que preveías",importe:et(I)}),_=w.length,w.push({concepto:`Saldo real al ${l}`,nota:"último saldo real conocido",importe:et(S),saldo:!0}));let A=w.length;d&&(x(h,u?"desde el corte":""),A=w.length,w.push({concepto:`Saldo previsto al final (${o})`,importe:et(E),saldo:!0}));const P=u?[{nombre:"Ingresos netos",importe:et(f.ingresos)},{nombre:"Préstamos",importe:-f.d.prestamos.total},{nombre:"Facturas",importe:-f.d.facturas.total},{nombre:"Otros gastos",importe:-f.d.otros.total},{nombre:"Imprevistos",importe:-f.d.imprevistos.total},{nombre:"Intereses y traspasos",importe:et(f.otros)}].filter(O=>St(O.importe)!==0):[],$=[];let T=y,D=y;for(const O of _t(a.slice(0,7),o.slice(0,7))){const U=Oi(`${O}-01`,a),Z=aa(Lt(Ut(O),1),s),ut=b(g(U,Z)),se=T;let kt,ne=0,Me;if(Z<=l)Me="real",kt=i(Z),ne=kt-se-ut.total;else if(U>=l)Me="previsto",kt=se+ut.total;else{Me="en-curso";const va=v(g(U,l));ne=S-(se+va),kt=S+(ut.total-va)}D+=ut.total;const Od=Lt(Z,-1);$.push({mes:O,tipo:Me,saldoInicial:et(se),ingresos:et(ut.ingresos),gastos:et(ut.gastos+ut.reserva),reserva:et(ut.reserva),otros:et(ut.otros),desviacion:et(ne),saldoFinal:et(kt),saldoPrevistoDesdeInicio:et(D),conSaldoReal:t.cuentas.some(va=>{const bo=r(va,aa(Z,l));return!!bo&&bo>U&&bo<=Lt(Od,1)})}),T=kt}const z=O=>{const U=new Map;for(const Z of O)U.set(Z.cuenta||"",(U.get(Z.cuenta||"")??0)+St(qa(Z)));return U},k=z(g(a,l)),V=z(g(l,s)),H=new Set(t.cuentas.map(O=>O._id)),j=O=>[...O].filter(([U])=>!H.has(U)).reduce((U,[,Z])=>U+Z,0),N=t.cuentas.map(O=>{const U=n(O,a),Z=u?n(O,l):U,ut=U+(k.get(O._id)??0);return{_id:O._id,nombre:O.nombre,saldoInicio:et(U),saldoReal:et(Z),saldoPrevisto:et(u?ut:U),diferencia:u?et(Z-ut):0,saldoFinal:et(Z+(V.get(O._id)??0)),ultimoDato:r(O,e)}});let R=null;if(d){let O=S,U={saldo:O,fecha:l};for(const Z of g(l,s))O+=St(qa(Z)),O<U.saldo&&(U={saldo:O,fecha:Z.fecha});R={saldo:et(U.saldo),fecha:U.fecha}}const q=[{fecha:a,real:et(y),previstoInicio:et(y)}];u||(q[0]={fecha:a,prevision:et(y)});for(const O of $){const U=aa(Ut(O.mes),o);O.tipo==="real"?q.push({fecha:U,real:O.saldoFinal,previstoInicio:O.saldoPrevistoDesdeInicio}):O.tipo==="en-curso"?(q.push({fecha:l,real:et(S),previstoInicio:et(C),prevision:et(S)}),q.push({fecha:U,previstoInicio:O.saldoPrevistoDesdeInicio,prevision:O.saldoFinal})):q.push({fecha:U,prevision:O.saldoFinal})}const B=[...q].reverse().find(O=>O.real!==void 0);B&&d&&B.prevision===void 0&&(B.prevision=B.real);const Y=(O,U)=>Math.abs(O-U)<=1,J=O=>O.reduce((U,Z)=>U+(Z.saldo?0:St(Z.importe)),0),at=[];u&&at.push({ok:Y(y+J(w.slice(1,_)),S),texto:"El saldo real al empezar más lo previsto y la diferencia da el saldo real del corte."}),d&&at.push({ok:Y(S+J(w.slice(_+1,A)),E),texto:`El saldo ${u?"real del corte":"real al empezar"} más lo previsto da el saldo final.`});const W=$[$.length-1];at.push({ok:!W||Y(St(W.saldoFinal),E),texto:"La tabla mes a mes acaba en el mismo saldo que el puente."});const X=O=>N.reduce((U,Z)=>U+St(Z[O]),0);if(at.push({ok:Y(X("saldoReal"),S)&&Y(X("saldoPrevisto")+(u?j(k):0),C)&&Y(X("saldoFinal")+j(V),E),texto:"La suma de las cuentas da el saldo total: el real, el previsto y el final."}),t.cuadroDeMando&&d){const O=t.cuadroDeMando,U=Y(St(O.saldoFinal),E);at.push({ok:U,texto:U?"El saldo final coincide con el del cuadro de mando.":`El cuadro de mando prevé ${F(O.saldoFinal)} al final (${Bi(O.saldoFinal-et(E))} respecto al informe).`})}const dt=[],wt=Lt(e,-30);for(const O of N)O.ultimoDato?O.ultimoDato<wt&&dt.push(`«${O.nombre}»: el último saldo real es del ${O.ultimoDato}. Actualízalo en Cuentas para que la comparación llegue hasta hoy.`):dt.push(`«${O.nombre}» no tiene ningún saldo real: cuenta como 0 €.`);const oe=$.filter(O=>O.tipo==="real"&&!O.conSaldoReal).map(O=>O.mes);return oe.length&&u&&dt.push(`Sin ningún saldo real anotado en ${oe.join(", ")}: la diferencia de ${oe.length===1?"ese mes":"esos meses"} aparece en el siguiente que sí lo tiene.`),u&&l<e&&l<=o&&dt.push(`El último saldo real es del ${l}: desde ese día hasta hoy el informe ya es previsión.`),{proyecto:t.proyecto,generadoEl:ot(),desde:a,hasta:o,hoy:e,corte:l,tienePasado:u,tieneFuturo:d,saldoInicio:et(y),saldoPrevistoCorte:et(C),saldoCorte:et(S),diferencia:et(I),saldoFinal:et(E),reservaImprevistos:et(M),puente:w,previstoPasado:P,meses:$,cuentas:N,minimo:R,serie:q,comprobaciones:at,avisos:dt,imprevistos:t.imprevistos??null,contarImprevistos:t.contarImprevistos!==!1}}const rt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Gi=["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"],ps=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"],yt=t=>{const[e,a,o]=t.split("-").map(Number);return`${o} ${ps[a-1]} ${e}`},Vi=t=>{const[e,a]=t.split("-").map(Number);return`${Gi[a-1]} ${e}`},lt=t=>rt(F(t)),jt=t=>`${t>.004?"+":t<-.004?"−":""}${rt(F(Math.abs(t)))}`,Wt=t=>t>.004?"pos":t<-.004?"neg":"",qt={real:"#1f6fd1",previstoInicio:"#8a94a6",prevision:"#0f9d6b",hoy:"#b4232c"};function Ui(t){const e=t.serie;if(e.length<2)return"";const a=760,o=260,s={izq:70,der:16,arr:14,aba:30},n=w=>new Date(`${w}T00:00:00`).getTime(),i=n(e[0].fecha),r=n(e[e.length-1].fecha),c=e.flatMap(w=>[w.real,w.previstoInicio,w.prevision].filter(x=>x!==void 0));t.minimo&&c.push(t.minimo.saldo);let l=Math.min(...c),u=Math.max(...c);const d=(u-l)*.08||Math.abs(u)*.05||1;l-=d,u+=d;const p=w=>s.izq+(n(w)-i)/Math.max(1,r-i)*(a-s.izq-s.der),v=w=>s.arr+(1-(w-l)/(u-l))*(o-s.arr-s.aba),g=(w,x)=>{const _=e.filter($=>$[w]!==void 0);if(_.length<2)return"";const A=_.map(($,T)=>`${T?"L":"M"}${p($.fecha).toFixed(1)},${v($[w]).toFixed(1)}`).join(" "),P=_.map($=>`<circle cx="${p($.fecha).toFixed(1)}" cy="${v($[w]).toFixed(1)}" r="3" fill="${qt[w]}"/>`).join("");return`<path d="${A}" fill="none" stroke="${qt[w]}" stroke-width="2" ${x}/>${P}`},b=new Intl.NumberFormat("es-ES",{style:"currency",currency:"EUR",notation:"compact",maximumFractionDigits:1}),f=Array.from({length:5},(w,x)=>l+(u-l)*x/4).map(w=>`<line x1="${s.izq}" x2="${a-s.der}" y1="${v(w).toFixed(1)}" y2="${v(w).toFixed(1)}" stroke="#e6e9ef"/><text x="${s.izq-8}" y="${(v(w)+4).toFixed(1)}" text-anchor="end" class="eje">${rt(b.format(w))}</text>`).join(""),h=e.map(w=>w.fecha),C=Math.max(1,Math.ceil(h.length/8)),S=h.filter((w,x)=>x%C===0||x===h.length-1).map(w=>{const[x,_]=w.split("-").map(Number);return`<text x="${p(w).toFixed(1)}" y="${o-8}" text-anchor="middle" class="eje">${ps[_-1]} ${String(x).slice(2)}</text>`}).join(""),I=t.tienePasado&&t.tieneFuturo?`<line x1="${p(t.corte).toFixed(1)}" x2="${p(t.corte).toFixed(1)}" y1="${s.arr}" y2="${o-s.aba}" stroke="${qt.hoy}" stroke-dasharray="3 3"/><text x="${(p(t.corte)+4).toFixed(1)}" y="${s.arr+10}" class="eje" fill="${qt.hoy}">último saldo real</text>`:"",E=t.minimo?`<circle cx="${p(t.minimo.fecha).toFixed(1)}" cy="${v(t.minimo.saldo).toFixed(1)}" r="5" fill="none" stroke="${qt.hoy}" stroke-width="2"/>`:"",M=`Saldo real de ${lt(t.saldoInicio)} al empezar${t.tienePasado?` y ${lt(t.saldoCorte)} el ${rt(yt(t.corte))}`:""}; previsto ${lt(t.saldoFinal)} al final.`;return`<figure class="grafica">
    <svg viewBox="0 0 ${a} ${o}" role="img" aria-label="${M}">
      ${f}${S}${I}
      ${g("previstoInicio",'stroke-dasharray="2 4"')}
      ${g("real","")}
      ${g("prevision",'stroke-dasharray="7 4"')}
      ${E}
    </svg>
    <figcaption>
      <span><i style="background:${qt.real}"></i>Saldo real</span>
      ${t.tienePasado?`<span><i class="punteada" style="border-color:${qt.previstoInicio}"></i>Lo previsto al empezar el periodo</span>`:""}
      ${t.tieneFuturo?`<span><i class="discontinua" style="border-color:${qt.prevision}"></i>Previsión desde el último saldo real</span>`:""}
      ${t.minimo?'<span><i class="anillo"></i>Saldo mínimo previsto</span>':""}
    </figcaption>
  </figure>`}function Yi(t){return`<div class="tabla-ancha"><table class="puente"><tbody>${t.map(a=>a.saldo?`<tr class="saldo"><th scope="row">${rt(a.concepto)}</th><td class="num">${lt(a.importe)}</td></tr>`:`<tr><th scope="row">${rt(a.concepto)}${a.nota?`<span class="nota">${rt(a.nota)}</span>`:""}</th><td class="num ${Wt(a.importe)}">${jt(a.importe)}</td></tr>`).join("")}</tbody></table></div>`}function Wi(t){const e={real:"Real","en-curso":"Real + previsto",previsto:"Previsto"},a=t.some(s=>s.tipo!=="previsto"),o=t.map(s=>`<tr class="${s.tipo}">
      <th scope="row">${rt(Vi(s.mes))}<span class="nota">${e[s.tipo]}${s.tipo!=="previsto"&&!s.conSaldoReal?" · sin saldo anotado":""}${s.reserva>0?` · gastos con ${lt(s.reserva)} de reserva para imprevistos`:""}</span></th>
      <td class="num">${lt(s.saldoInicial)}</td>
      <td class="num pos">${lt(s.ingresos)}</td>
      <td class="num neg">${lt(s.gastos)}</td>
      <td class="num tenue">${jt(s.otros)}</td>
      ${a?`<td class="num ${Wt(s.desviacion)}">${s.tipo==="previsto"?"—":jt(s.desviacion)}</td>`:""}
      <td class="num fuerte">${lt(s.saldoFinal)}</td>
    </tr>`).join("");return`<div class="tabla-ancha"><table class="datos meses">
    <thead><tr>
      <th>Mes</th><th class="num">Saldo inicial</th><th class="num" title="Ingresos previstos, netos">Ingresos</th><th class="num" title="Gastos previstos">Gastos</th>
      <th class="num" title="Intereses y traspasos previstos: lo que mueve el saldo sin ser ingreso ni gasto">Otros</th>
      ${a?'<th class="num" title="Saldo real menos el saldo que daban las previsiones">Diferencia</th>':""}
      <th class="num">Saldo final</th>
    </tr></thead>
    <tbody>${o}</tbody>
  </table></div>
  <p class="pie-tabla">Ingresos y gastos son siempre los previstos. En cada fila, saldo inicial + ingresos − gastos + otros${a?" + diferencia":""} = saldo final. ${a?"En los meses pasados el saldo final es el real de tus cuentas, y la diferencia es lo que no explican las previsiones.":""} En los meses de previsión, el saldo final es el previsto.</p>`}function Ki(t){if(!t.tienePasado)return"";const e=t.previstoPasado.map(o=>`<tr><th scope="row">${rt(o.nombre)}</th><td class="num ${Wt(o.importe)}">${jt(o.importe)}</td></tr>`).join(""),a=t.saldoPrevistoCorte-t.saldoInicio;return`<section>
    <h2>2 · El pasado: saldo previsto frente a saldo real</h2>
    <p class="intro">Del ${rt(yt(t.desde))} al ${rt(yt(t.corte))}, el último saldo real que tienes anotado. Lo real es el saldo de tus cuentas; lo previsto, lo que tus estimaciones, nóminas y préstamos decían que pasaría con él. No se mira movimiento a movimiento: solo si el saldo cuadra.</p>
    <div class="cifras">
      <div><span>Debías tener</span><strong>${lt(t.saldoPrevistoCorte)}</strong><em>saldo al empezar + lo previsto</em></div>
      <div><span>Tienes</span><strong>${lt(t.saldoCorte)}</strong><em>saldo real · ${rt(yt(t.corte))}</em></div>
      <div class="${Wt(t.diferencia)}"><span>Diferencia</span><strong>${jt(t.diferencia)}</strong><em>${t.diferencia>=0?"mejor de lo previsto":"peor de lo previsto"}</em></div>
    </div>
    ${e?`<h3>Lo que estaba previsto en ese tramo</h3>
    <div class="tabla-ancha"><table class="datos"><thead><tr><th>Grupo</th><th class="num">Previsto</th></tr></thead>
      <tbody>${e}</tbody>
      <tfoot><tr><th scope="row">Total previsto</th><td class="num ${Wt(a)}">${jt(a)}</td></tr></tfoot>
    </table></div>
    <p class="pie-tabla">Solo previsto: el informe no reparte la diferencia entre grupos, porque se hace contra el saldo de las cuentas. Mira en la tabla mes a mes en qué meses aparece.</p>`:""}
  </section>`}function Ji(t){const e=t.tienePasado,a=t.cuentas.map(i=>`<tr><th scope="row">${rt(i.nombre)}</th>
      <td class="num">${lt(i.saldoInicio)}</td>
      ${e?`<td class="num">${lt(i.saldoPrevisto)}</td><td class="num">${lt(i.saldoReal)}</td><td class="num ${Wt(i.diferencia)}">${jt(i.diferencia)}</td>`:""}
      <td class="num">${t.tieneFuturo?lt(i.saldoFinal):"—"}</td>
      <td>${i.ultimoDato?rt(yt(i.ultimoDato)):"ninguno"}</td></tr>`).join(""),o=t.cuentas.reduce((i,r)=>i+r.saldoPrevisto,0),s=t.cuentas.reduce((i,r)=>i+r.saldoFinal,0),n=e&&Math.abs(o-t.saldoPrevistoCorte)>=.01||Math.abs(s-t.saldoFinal)>=.01;return`<section>
    <h2>4 · Cuentas</h2>
    <div class="tabla-ancha"><table class="datos"><thead><tr><th>Cuenta</th><th class="num">Al empezar</th>
      ${e?`<th class="num">Previsto al ${rt(yt(t.corte))}</th><th class="num">Real al ${rt(yt(t.corte))}</th><th class="num">Diferencia</th>`:""}
      <th class="num">Al final (previsto)</th><th>Último saldo anotado</th></tr></thead>
      <tbody>${a}</tbody>
      <tfoot><tr><th scope="row">Total</th><td class="num">${lt(t.saldoInicio)}</td>
      ${e?`<td class="num">${lt(t.saldoPrevistoCorte)}</td><td class="num">${lt(t.saldoCorte)}</td><td class="num ${Wt(t.diferencia)}">${jt(t.diferencia)}</td>`:""}
      <td class="num">${t.tieneFuturo?lt(t.saldoFinal):"—"}</td><td></td></tr></tfoot>
    </table></div>
    ${n?'<p class="pie-tabla">El total no es la suma de las filas porque hay previsiones sin cuenta asignada o de cuentas archivadas: cuentan en el total, no en ninguna fila.</p>':""}
  </section>`}function Xi(t){const e=`Informe · ${t.proyecto} · ${yt(t.desde)} – ${yt(t.hasta)}`,a=t.comprobaciones.map(n=>`<li class="${n.ok?"ok":"mal"}"><span aria-hidden="true">${n.ok?"✓":"✗"}</span> ${rt(n.texto)}${n.ok?"":" <strong>No cuadra.</strong>"}</li>`).join(""),o=t.avisos.map(n=>`<li>${rt(n)}</li>`).join(""),s=t.tieneFuturo?`<div><span>Previsto al final</span><strong>${lt(t.saldoFinal)}</strong><em>${rt(yt(t.hasta))}${t.reservaImprevistos>0?` · apartados ${lt(t.reservaImprevistos)} para imprevistos`:""}</em></div>

       ${t.minimo?`<div class="${t.minimo.saldo<0?"neg":""}"><span>Saldo mínimo previsto</span><strong>${lt(t.minimo.saldo)}</strong><em>${rt(yt(t.minimo.fecha))}</em></div>`:""}`:"";return`<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${rt(e)}</title>
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
  figcaption i.anillo { width: 10px; height: 10px; border: 2px solid ${qt.hoy}; border-radius: 50%; }
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
    <h1>Informe financiero · ${rt(t.proyecto)}</h1>
    <p>Del ${rt(yt(t.desde))} al ${rt(yt(t.hasta))} · ${t.tienePasado&&t.tieneFuturo?`saldo real hasta el ${rt(yt(t.corte))}, previsión desde entonces`:t.tieneFuturo?"todo el periodo es previsión":"todo el periodo tiene saldo real"} · generado el ${rt(yt(t.generadoEl))}</p>
  </header>

  <section>
    <h2 style="border-top:0;margin-top:0">1 · Resumen: del saldo inicial al final</h2>
    <div class="cifras">
      <div><span>Saldo al empezar</span><strong>${lt(t.saldoInicio)}</strong><em>real</em></div>
      ${t.tienePasado?`<div><span>Último saldo real</span><strong>${lt(t.saldoCorte)}</strong><em>${rt(yt(t.corte))}</em></div><div class="${Wt(t.diferencia)}"><span>Frente a lo previsto</span><strong>${jt(t.diferencia)}</strong><em>${t.diferencia>=0?"mejor":"peor"} de lo previsto</em></div>`:""}
      ${s}
    </div>
    ${Ui(t)}
    <h3>El puente de saldo</h3>
    <p class="intro">Cada línea suma a la anterior. Lo real es el saldo de tus cuentas; lo previsto, tus estimaciones, nóminas y préstamos. El último saldo real anotado cierra el pasado y abre la previsión.</p>
    ${Yi(t.puente)}
  </section>

  ${Ki(t)}

  <section>
    <h2>3 · Mes a mes</h2>
    ${Wi(t.meses)}
  </section>

  ${Ji(t)}

  <section>
    <h2>5 · Comprobaciones</h2>
    <ul class="comprobaciones">${a}</ul>
    ${o?`<h3>A tener en cuenta</h3><ul class="avisos">${o}</ul>`:""}
  </section>

  <footer>Generado con FinanceApp. Las cifras previstas son estimaciones: dependen de los gastos, nóminas y préstamos que tengas dados de alta.${t.imprevistos&&t.imprevistos.meses>0&&t.tieneFuturo?` ${t.contarImprevistos?`La previsión aparta para imprevistos la media de lo marcado como imprevisto en ${t.imprevistos.meses} meses (${lt(t.imprevistos.mediaMensual)}/mes).`:`«Contar imprevistos» está apagado: la previsión no aparta nada para imprevistos (la media de lo marcado es ${lt(t.imprevistos.mediaMensual)}/mes).`}`:""}</footer>
</main>
</body>
</html>`}function Qi(t,e,a){const o=t||[];if(!o.length)return e;const s=o.find(i=>i.año===a);if(s)return s.tramos;const n=o.filter(i=>i.año<a).sort((i,r)=>r.año-i.año);return n.length?n[0].tramos:e}function pe(t,e){return a=>Qi(t,e,a)}const Qt=11,ms=[[0,19],[12450,24],[20200,30],[35200,37],[6e4,45],[3e5,47]],fs=[[0,19],[6e3,21],[5e4,23],[2e5,27],[3e5,28]];function Na(t){return{_id:"default",nombre:"Default",descripcion:"Cuenta principal",saldo:0,saldoInicial:0,fechaInicialSaldo:t,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!0,modeloFondo:"cuenta",aportaciones:[],planAportaciones:[]}}const gs="default";function vs(){return{_id:gs,nombre:"Yo",esPorDefecto:!0,activo:!0}}function Ra(t,e){return{dashboardStart:t,dashboardEnd:e,fechaReferencia:t,colchonMeses:6,colchonTipo:"meses",colchonFijo:0,colchonPuntos:[],showColchon:!0,margenesSeguridad:[],usarInflacion:!1,tramos_irpf:ms,tramosGananciasCapital:fs,showExecSummary:!0,showCriticos:!0,showHistorico:!0,histCuenta:"",analisisCollapsed:!1,activeTagsFilter:[],cierreOmitidos:[],tagCategorias:[],tagGrupos:[],saludUmbralAhorroVerde:20,saludUmbralAhorroAmarillo:10,saludUmbralDTIVerde:30,saludUmbralDTIAmarillo:40,saludRegla:[50,30,20],saludExcluirHipoteca:!1,saludTagHipoteca:"hipoteca",storageMode:"local",autoSave:!1,autoSaveInterval:15,autoLogoutMinutos:0,onboardingDone:!1,features:{}}}function ka(t,e){return{loans:[],expenses:[],accounts:[Na(t)],nominas:[],transacciones:[],puntosControl:[],inflacion:[],tramosIRPFHistorico:[],tramosGananciasCapitalHistorico:[],personas:[vs()],config:Ra(t,e)}}const Ft=t=>Array.isArray(t)?t:[],Zi=t=>t&&typeof t=="object"&&!Array.isArray(t)?t:{};function je(t){if(Array.isArray(t.escenarioIds))return t;const e=t.escenarioId?[t.escenarioId]:[],{escenarioId:a,...o}=t;return{...o,escenarioIds:e}}function bs(t){if(!t||typeof t!="string")return"";if(t.startsWith("dia:")||t.startsWith("nthweekday:"))return t;if(t==="ultimo")return"dia:ultimo";if(t==="primer-lunes")return"nthweekday:1:1";const e=parseInt(t);return isNaN(e)?"":`dia:${e}`}function La(t){const{varianza:e,inflacion:a,...o}=t;return o}function tr(t,e){const{hoyISO:a,finISO:o}=e,s={...t},n=Zi(t.config),r={...Ra(a,o)};for(const[u,d]of Object.entries(n))d!=null&&(r[u]=d);delete r.saldoInicial,delete r.saldoInicialFecha,delete r.inflacionGlobal,delete r.showMC,delete r.mcIteraciones,(!Array.isArray(r.tramos_irpf)||r.tramos_irpf.length===0)&&(r.tramos_irpf=ms),(!Array.isArray(r.tramosGananciasCapital)||r.tramosGananciasCapital.length===0)&&(r.tramosGananciasCapital=fs),(!Array.isArray(r.saludRegla)||r.saludRegla.length!==3)&&(r.saludRegla=[50,30,20]),(typeof r.features!="object"||r.features===null||Array.isArray(r.features))&&(r.features={}),s.config=r;let c=Ft(t.accounts).map(u=>{const d={saldoInicial:0,fechaInicialSaldo:a,historicoSaldos:[],interes:0,periodoCobro:"mensual",activo:!0,simulacion:!1,esCuentaPrincipal:!1,aportaciones:[],planAportaciones:[],bloqueoMeses:120,impuestoRetirada:0,grupoNomina:"",...u};return d.modeloFondo||(d.modeloFondo=d.esFondoPension?"pension":"cuenta"),delete d.esFondoPension,Array.isArray(d.historicoSaldos)||(d.historicoSaldos=[]),je(d)});c.length===0&&(c=[Na(a)]);const l=c.filter(u=>u.esCuentaPrincipal);if(l.length===0){const u=c.find(d=>d._id==="default")||c[0];c=c.map(d=>({...d,esCuentaPrincipal:d._id===u._id}))}else if(l.length>1){let u=!1;c=c.map(d=>d.esCuentaPrincipal?u?{...d,esCuentaPrincipal:!1}:(u=!0,d):d)}return s.accounts=c,s.expenses=Ft(t.expenses).map(u=>{const d={basico:!1,activo:!0,tags:[],historialPrecios:[],...u};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.historialPrecios)||(d.historialPrecios=[]),d.diaPago=bs(d.diaPago),La(je(d))}),s.loans=Ft(t.loans).map(u=>{const d={tipoTasa:"fijo",mostrarFechaFinEnDashboard:!0,basico:!0,tags:[],activo:!0,amortizaciones:[],...u};return Array.isArray(d.tags)||(d.tags=[]),d.diaPago=bs(d.diaPago),d.amortizaciones=Ft(d.amortizaciones).map(p=>je(p)),La(je(d))}),s.nominas=Ft(t.nominas).map(u=>{const d={activo:!0,nPagas:12,irpfModo:"auto",irpfPct:0,bruto:0,representacion:"detallado",tags:[],fechaFin:null,cuenta:"default",grupoNomina:"",mesActualizacionIPC:null,retribucionFlexible:[],...u};return Array.isArray(d.tags)||(d.tags=[]),Array.isArray(d.retribucionFlexible)||(d.retribucionFlexible=[]),La(je(d))}),s.goals=Ft(t.goals).map((u,d)=>{const p=Array.isArray(u.cuentaIds)?u.cuentaIds:u.cuentaId?[u.cuentaId]:[],{cuentaId:v,...g}=u;return{prioridad:d+1,completado:!1,usarColchon:!0,targetAmount:0,...g,cuentaIds:p}}),s.inflacion=Ft(t.inflacion),s.tramosIRPFHistorico=Ft(t.tramosIRPFHistorico),s.tramosGananciasCapitalHistorico=Ft(t.tramosGananciasCapitalHistorico),s.escenarios=Ft(t.escenarios).map(({inversiones:u,...d})=>d),s}const me=t=>Array.isArray(t)?t:[];let Oa=0;function er(t){return Oa+=1,`${t}_${Oa.toString(36)}`}const ar=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),or=t=>typeof t=="number"&&Number.isFinite(t);function sr(t,e){const a={...t};Oa=0;const o=me(t.transacciones),s=me(t.puntosControl),n=[...s],i=new Set(s.map(l=>`${l.cuentaId}|${l.fecha}`)),r=(l,u,d,p)=>{if(!ar(u)||!or(d))return;const v=`${l}|${u}`;i.has(v)||(i.add(v),n.push({_id:er("pc"),fecha:u,cuentaId:l,saldoCts:Ct(d),...typeof p=="string"&&p?{nota:p}:{}}))};for(const l of me(t.accounts)){const u=typeof l._id=="string"?l._id:null;if(u)for(const d of me(l.historicoSaldos))r(u,d.fecha,d.saldo,d.nota)}const c=me(t.history);if(c.length>0){const l=me(t.accounts),u=l.find(p=>p.esCuentaPrincipal)||l.find(p=>p.activo)||l[0],d=typeof(u==null?void 0:u._id)=="string"?u._id:"default";for(const p of c){const v=typeof p.cuenta=="string"?p.cuenta:typeof p.cuentaId=="string"?p.cuentaId:d;r(v,p.fecha,p.saldo,p.nota)}}return delete a.history,a.transacciones=o,a.puntosControl=n.sort((l,u)=>String(l.fecha).localeCompare(String(u.fecha))),a}const Ba=t=>Array.isArray(t)?t:[],nr=t=>typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t),ir=t=>typeof t=="number"&&Number.isFinite(t)&&t>0;let Ha=0;function rr(){return Ha+=1,`tx_hp_${Ha.toString(36)}`}function cr(t,e){const a={...t};Ha=0;const o=[...Ba(t.transacciones)],s=new Set(o.map(i=>`${i.estimacionId}|${i.fecha}|${i.importeCts}`)),n=Ba(t.expenses).map(i=>{const r=Ba(i.historialPrecios),c=typeof i._id=="string"?i._id:null,l=typeof i.cuenta=="string"&&i.cuenta?i.cuenta:"default",u=i.tipo==="ingreso"?"ingreso":"gasto",d=Array.isArray(i.tags)?i.tags.filter(g=>typeof g=="string"):[];if(c)for(const g of r){if(!g||!nr(g.fecha)||!ir(g.cuantia))continue;const b=u==="ingreso"?Ct(g.cuantia):-Ct(g.cuantia),y=`${c}|${g.fecha}|${b}`;s.has(y)||(s.add(y),o.push({_id:rr(),fecha:g.fecha,cuentaId:l,importeCts:b,concepto:typeof i.concepto=="string"?i.concepto:"Movimiento",tags:d,estimacionId:c,tipo:u,origen:"importado",nota:typeof g.nota=="string"&&g.nota?g.nota:"Importado del historial de precios"}))}const{historialPrecios:p,...v}=i;return v});return a.expenses=n,a.transacciones=o.sort((i,r)=>String(i.fecha).localeCompare(String(r.fecha))),a}const hs=t=>Array.isArray(t)?t:[],Kt=(t,e="")=>typeof t=="string"&&t.trim()?t:e,fe=(t,e=0)=>typeof t=="number"&&Number.isFinite(t)?t:e,lr=t=>typeof t=="string"&&/^\d{4}-\d{2}/.test(t)?t.slice(0,7):null;function dr(t,e){var u;const a={...t};if(Array.isArray(a.planes))return a;const o=hs(a.goals),s=hs(a.accounts),n=s.map(d=>{const p=fe(d.bloqueoMeses,0);return{_id:`veh_${Kt(d._id,"x")}`,nombre:Kt(d.nombre,"Cuenta"),rentabilidadRealAnual:fe(d.interes,0)/100,liquidez:d.modeloFondo==="pension"?"BLOQUEADA_HASTA_JUBILACION":p>0?"MEDIA":"INMEDIATA",fiscalidadRetirada:fe(d.impuestoRetirada,0)/100,topeAportacionAnual:d.modeloFondo==="pension"?Ct(1500):null,riesgo:d.modeloFondo==="pension"?"MEDIO":"NULO",cuentaId:Kt(d._id,""),prestamoId:null,esDeuda:!1,revisarRentabilidad:fe(d.interes,0)>0}}),i=new Map(s.map((d,p)=>[Kt(d._id,""),n[p]._id])),r=((u=n[0])==null?void 0:u._id)??"",c=o.map((d,p)=>{const v=Array.isArray(d.cuentaIds)?d.cuentaIds.map(b=>Kt(b,"")):[],g=lr(d.targetDate);return{_id:Kt(d._id,`obj_mig_${p}`),nombre:Kt(d.nombre,`Objetivo ${p+1}`),tipo:"AHORRO_OBJETIVO",importeObjetivo:Ct(fe(d.targetAmount,0)),fechaLimite:g,prioridad:fe(d.prioridad,p+1),modoAsignacion:g?"CUOTA_POR_FECHA":"ABSORBE_TODO",vehiculoId:i.get(v[0])??r,saldoActual:0,estado:d.completado===!0?"COMPLETADO":"PENDIENTE",notas:Kt(d.notas,"")}}),l={_id:"plan_base",nombre:"Plan base",fechaInicio:e.hoyISO.slice(0,7),horizonteMeses:480,pctDisfrute:0,notas:o.length>0?"Creado al migrar los objetivos de ahorro anteriores. Revisa los saldos de partida y las rentabilidades reales.":"",activo:!0,perfil:{netoMensual:0,gastosFijosMensuales:0,manual:!1},vehiculos:n,objetivos:c,eventos:[],creadoEn:e.hoyISO};return a.planes=[l],a}function ur(t,e){const a={...t},o=Array.isArray(a.personas)?a.personas:[];return o.some(s=>(s==null?void 0:s._id)===gs)||(a.personas=[vs(),...o]),a}const qe=t=>Array.isArray(t)?t:[];function oa(t){const{escenarioIds:e,...a}=t;return Array.isArray(a.amortizaciones)&&(a.amortizaciones=a.amortizaciones.map(o=>{const{escenarioIds:s,...n}=o;return n})),a}function pr(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function mr(t,e){const a={...t};if(a.escenarios===void 0&&a.planes===void 0&&a.goals===void 0)return a;if(a.loans=qe(a.loans).map(oa),a.expenses=qe(a.expenses).map(oa),a.nominas=qe(a.nominas).map(oa),a.accounts=qe(a.accounts).map(oa),delete a.escenarios,a.config&&typeof a.config=="object"){const{escenarioActivo:s,...n}=a.config;a.config=n}delete a.goals;const o=qe(a.planes).filter(pr);return o.length>0&&(console.warn(`[migración 010] Se archivan ${o.length} plan(es) del planificador retirado en _migracion010_planesArchivados.`),a._migracion010_planesArchivados=o),delete a.planes,a}const ys="supuesto-archivado",ge=t=>Array.isArray(t)?t:[],$s=t=>Array.isArray(t.escenarioIds)&&t.escenarioIds.length>0;function fr(t){return t._id!=="plan_base"?!0:Array.isArray(t.objetivos)&&t.objetivos.length>0}function gr(t,e){const a={...t};let o=0;const s=[],n=c=>{const{escenarioIds:l,...u}=c;if(!$s(c))return u;o+=1;const d=Array.isArray(u.tags)?u.tags:[];return{...u,activo:!1,tags:d.includes(ys)?d:[...d,ys]}};a.expenses=ge(a.expenses).map(n),a.nominas=ge(a.nominas).map(n),a.accounts=ge(a.accounts).map(c=>{if(c._id==="default"||c.esCuentaPrincipal){const{escenarioIds:l,...u}=c;return u}return n(c)}),a.loans=ge(a.loans).map(c=>{const l=n(c);if(Array.isArray(l.amortizaciones)){const u=[];for(const d of l.amortizaciones){const{escenarioIds:p,...v}=d;$s(d)?s.push({...v,loanId:String(c._id??""),loanNombre:c.nombre}):u.push(v)}l.amortizaciones=u}return l});const i=[...ge(a._migracion010_planesArchivados),...ge(a.planes).filter(fr)];delete a._migracion010_planesArchivados,delete a.planes,delete a.goals,delete a.escenarios;const r=a.config&&typeof a.config=="object"?{...a.config}:{};if(delete r.escenarioActivo,i.length>0||s.length>0||o>0){const c=r.archivoMigracion011??{},l={planes:[...c.planes??[],...i],amortizaciones:[...c.amortizaciones??[],...s],desactivados:(c.desactivados??0)+o};r.archivoMigracion011=l}return(a.config!==void 0||r.archivoMigracion011)&&(a.config=r),a}const vr=[{version:5,describe:"Formaliza el esquema; limpia restos de features eliminadas; añade config.features",migrate:tr},{version:6,describe:"Contabilidad real: crea transacciones y puntosControl (importa historicoSaldos y la clave history)",migrate:sr},{version:7,describe:"Retira historialPrecios: cada entrada pasa a ser una transacción real enlazada a su estimación",migrate:cr},{version:8,describe:"Gestor de objetivos: absorbe `goals` dentro de un Plan, con un vehículo por cuenta",migrate:dr},{version:9,describe:"Personas: siembra la persona por defecto («Yo») donde ya caía todo implícitamente",migrate:ur},{version:10,describe:"Simplificación: retira escenarios/supuestos, objetivos de ahorro antiguos y el planificador financiero",migrate:mr},{version:11,describe:"Termina la 010: desactiva lo que solo existía en un supuesto, archiva planes y retira las claves huérfanas",migrate:gr}],xs=["history","escenarios","planes","goals"],br=["escenarios","planes","goals"];function Is(t,e,a){let o=t;const s=[];for(const n of[...vr].sort((i,r)=>i.version-r.version))(e??0)>=n.version||(o=n.migrate(o,a),s.push(n.version));return{state:o,applied:s}}const At="state_",Ne="state__schemaVersion",ve="financeapp_",Ga="state__modificadoEn",ws="financeapp:sin-espacio";function hr(){try{typeof window<"u"&&window.dispatchEvent(new CustomEvent(ws))}catch{}}function Ss(t=localStorage,e=ve){const a=o=>`${e}${o}`;return{get(o){try{const s=t.getItem(a(o));return s===null?null:JSON.parse(s)}catch{return null}},set(o,s){try{t.setItem(a(o),JSON.stringify(s)),o!==Ga&&t.setItem(a(Ga),JSON.stringify(Date.now()))}catch(n){console.error("No se pudo guardar en localStorage:",o,n),hr()}},remove(o){try{t.removeItem(a(o))}catch{}},keys(){const o=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(e)&&o.push(n.slice(e.length))}return o}}}function yr(t=localStorage,e=ve){const a=[];for(let s=0;s<t.length;s++){const n=t.key(s);n!=null&&n.startsWith(At)&&!n.startsWith(e)&&a.push(n)}const o=[];for(const s of a)try{const n=t.getItem(s);n!==null&&t.getItem(`${e}${s}`)===null&&(t.setItem(`${e}${s}`,n),o.push(s)),t.removeItem(s)}catch{}return o}function $r({ventanaMs:t=15e3,ahora:e=()=>Date.now()}={}){let a=null;function o(){return a?e()-a.cuando>t?(a=null,null):a:null}return{registrar(s){a={...s,cuando:e()}},pendiente:o,tomar(){const s=o();return a=null,s},limpiar(){a=null}}}const xr={expenses:{articulo:"El",que:"gasto"},accounts:{articulo:"La",que:"cuenta"},loans:{articulo:"El",que:"préstamo"},nominas:{articulo:"La",que:"nómina"},inflacion:{articulo:"El",que:"periodo de inflación"},transacciones:{articulo:"El",que:"movimiento"},puntosControl:{articulo:"El",que:"punto de control"}};function Ir(t,e){const a=xr[t]??{articulo:"El",que:"elemento"},o=e.concepto??e.nombre??e.titulo??(e.year!==void 0?String(e.year):null);return o?`${a.articulo} ${a.que} «${String(o)}»`:`${a.articulo} ${a.que}`}function wr(t){return st(new Date(t.getFullYear()+1,t.getMonth(),t.getDate()))}function Sr({adapter:t,hoy:e=new Date}){const a=st(e),o=wr(e);let s=ka(a,o);const n=new Set;let i=[];const r=$r();function c($){for(const T of n)T($)}function l($){t.set(`${At}${$}`,s[$])}function u(){const $={};for(const k of Object.keys(s)){const V=t.get(`${At}${k}`);V!==null&&($[k]=V)}for(const k of xs){const V=t.get(`${At}${k}`);V!==null&&($[k]=V)}const T=t.get(Ne),{state:D,applied:z}=Is($,T,{hoyISO:a,finISO:o});if(s=d(D),p(),z.length>0){for(const k of Object.keys(s))l(k);t.set(Ne,Qt);for(const k of br)t.remove(`${At}${k}`)}return i=z,{applied:z}}function d($){const T=ka(a,o),D={...T,...$};for(const k of Object.keys(T))k!=="config"&&(Array.isArray(D[k])||(D[k]=T[k]));const z=$.config&&typeof $.config=="object"?$.config:{};return D.config={...Ra(a,o),...z},D}function p(){if(!Array.isArray(s.accounts)||s.accounts.length===0){s.accounts=[Na(a)],l("accounts");return}const $=s.accounts.filter(T=>T.esCuentaPrincipal);if($.length===0)s.accounts=s.accounts.map((T,D)=>D===0?{...T,esCuentaPrincipal:!0}:T),l("accounts");else if($.length>1){let T=!1;s.accounts=s.accounts.map(D=>D.esCuentaPrincipal?T?{...D,esCuentaPrincipal:!1}:(T=!0,D):D),l("accounts")}}function v($){return s[$]}function g($,T){s[$]=T,l($),c($)}function b($){g("config",{...s.config,...$})}function y($){return n.add($),()=>n.delete($)}function f(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function h($,T){const D=[...s[$]],z={...T,_id:f()};return D.push(z),g($,D),z}function C($,T,D){const z=s[$].map(k=>k._id===T?{...k,...D}:k);g($,z)}function S($,T){const D=s[$],z=D.findIndex(k=>k._id===T);z<0||(r.registrar({col:$,item:D[z],indice:z}),g($,D.filter((k,V)=>V!==z)))}function I(){const $=r.tomar();if(!$)return null;const T=[...s[$.col]];return T.splice(Math.min($.indice,T.length),0,$.item),g($.col,T),$}function E(){return r.pendiente()}function M(){const $=s.accounts||[],T=$.find(D=>D.esCuentaPrincipal&&D.activo)||$.find(D=>D.activo);return T?T._id:"default"}function w($){var T;return((T=s.accounts.find(D=>D._id===$))==null?void 0:T.nombre)??$}function x(){return pe(s.tramosIRPFHistorico,s.config.tramos_irpf)}function _(){return pe(s.tramosGananciasCapitalHistorico,s.config.tramosGananciasCapital)}function A(){return structuredClone(s)}function P($,T=null){const{state:D,applied:z}=Is($,T,{hoyISO:a,finISO:o});s=d(D),p();for(const k of Object.keys(s))l(k);t.set(Ne,Qt);for(const k of Object.keys(s))c(k);return{applied:z}}return{load:u,get:v,set:g,patchConfig:b,subscribe:y,addItem:h,updateItem:C,removeItem:S,deshacerBorrado:I,borradoPendiente:E,getPrincipalAccountId:M,accountName:w,resolverTramosIRPF:x,resolverTramosGanancias:_,snapshot:A,replaceAll:P,get schemaVersion(){return Qt},get migrationsApplied(){return[...i]},get today(){return a||ot()}}}function Cr(){let t=0,e=null;const a=new Set;function o(s){t+=1,e=s;for(const n of a)try{n(t,s)}catch(i){console.error("[cambios] un suscriptor ha fallado:",i)}return t}return{revision:()=>t,ultimoOrigen:()=>e,marcar:o,suscribir(s){return a.add(s),()=>a.delete(s)},crearMarca(s){let n=t;return{nombre:s,pendiente:()=>t>n,alDia:i=>{n=Math.max(n,i??t)},vista:()=>n}}}}const Zt=Object.keys(ka("1970-01-01","1970-01-01"));function Cs(t){const e={};for(const a of Zt){const o=t.get(`${At}${a}`);o!=null&&(e[a]=o)}return e}function Mr(t,e){const a=[];for(const o of Zt){const s=e[o];s!=null&&(t(`${At}${o}`,s),a.push(o))}return a}function Er(t){return Zt.filter(e=>t[e]===void 0||t[e]===null)}function Ar(t){var i;const e=r=>{const c=t[r];return Array.isArray(c)?c:[]};if(!Zt.filter(r=>r!=="config"&&r!=="accounts"&&r!=="personas").every(r=>e(r).length===0))return!1;const o=e("personas");return o.length===0||o.length===1&&((i=o[0])==null?void 0:i._id)==="default"?e("accounts").every(r=>r._id==="default"&&!(typeof r.saldoInicial=="number"&&r.saldoInicial!==0)&&!(Array.isArray(r.historicoSaldos)&&r.historicoSaldos.length>0)):!1}const Ms="_schemaVersion";function Pr(t,e){const a=t[Ms];if(typeof a=="number"&&Number.isFinite(a))return Math.min(a,e);const o=r=>Array.isArray(t[r])?t[r]:[],s=t.config&&typeof t.config=="object"?t.config:null;if(s&&s.features===void 0)return 4;if(t.transacciones===void 0&&t.expenses!==void 0)return 5;if(o("expenses").some(r=>Array.isArray(r.historialPrecios)&&r.historialPrecios.length>0))return 6;if(t.personas===void 0&&t.expenses!==void 0)return 8;const n=r=>r.some(c=>Array.isArray(c.escenarioIds)&&c.escenarioIds.length>0);return t.escenarios!==void 0||t.planes!==void 0||t.goals!==void 0||n(o("expenses"))||n(o("loans"))||n(o("nominas"))||n(o("accounts"))||o("loans").some(r=>n(Array.isArray(r.amortizaciones)?r.amortizaciones:[]))?Math.min(10,e):e}const Es=`${ve}meta_proyectos`,As=`${ve}meta_proyectoActivo`,te="default",_r="Mis finanzas";function Va(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}function be(t){return t===te?ve:`${ve}p_${t}_`}function Ps(){return[...Zt.map(t=>`${At}${t}`),Ne,Ga]}function Fr(t=localStorage){function e(){try{const d=t.getItem(Es);if(!d)return[];const p=JSON.parse(d);return Array.isArray(p)?p:[]}catch{return[]}}function a(d){t.setItem(Es,JSON.stringify(d))}function o(){const d=e();if(d.some(g=>g._id===te))return d;const p=Date.now(),v=[{_id:te,nombre:_r,creadoEn:p,actualizadoEn:p},...d];return a(v),v}function s(){try{const d=t.getItem(As);if(!d)return te;const p=JSON.parse(d);return typeof p=="string"&&p?p:te}catch{return te}}function n(d){t.setItem(As,JSON.stringify(d))}function i(d){const p=d.trim()||"Proyecto sin nombre",v=Date.now(),g={_id:Va(),nombre:p,creadoEn:v,actualizadoEn:v};return a([...o(),g]),g}function r(d,p){const v=p.trim();v&&a(o().map(g=>g._id===d?{...g,nombre:v,actualizadoEn:Date.now()}:g))}function c(d,p){const v=o().find(f=>f._id===d);if(!v)throw new Error("Proyecto no encontrado.");const g=be(d),b={_id:Va(),nombre:(p==null?void 0:p.trim())||`${v.nombre} (copia)`,creadoEn:Date.now(),actualizadoEn:Date.now()},y=be(b._id);for(const f of Ps()){const h=t.getItem(`${g}${f}`);h!==null&&t.setItem(`${y}${f}`,h)}return a([...o(),b]),b}function l(d){if(d===te)throw new Error("No se puede eliminar el proyecto original.");if(d===s())throw new Error("No se puede eliminar el proyecto activo. Cambia a otro primero.");const p=o();if(!p.some(g=>g._id===d))return;const v=be(d);for(const g of Ps())t.removeItem(`${v}${g}`);a(p.filter(g=>g._id!==d))}function u(d){const p=new Map(o().map(g=>[g._id,g]));for(const g of d){if(!g||typeof g._id!="string")continue;const b=p.get(g._id);(!b||(g.actualizadoEn??0)>b.actualizadoEn)&&p.set(g._id,g)}const v=[...p.values()];return a(v),v}return{listar:o,activo:s,establecerActivo:n,crear:i,renombrar:r,duplicar:c,eliminar:l,fusionarRemotos:u}}function Dr(t,e,a){const o=Ss(t,be(e)),s={};for(const n of a){const i=o.get(`${At}${n}`);s[n]=Array.isArray(i)?i:[]}return s}function Tr(t){const e=new Map;for(const s of Object.values(t))for(const n of s){const i=n==null?void 0:n._id;typeof i=="string"&&!e.has(i)&&e.set(i,Va())}function a(s){if(typeof s=="string")return e.get(s)??s;if(Array.isArray(s))return s.map(a);if(s&&typeof s=="object"){const n={};for(const[i,r]of Object.entries(s))n[i]=a(r);return n}return s}const o={};for(const[s,n]of Object.entries(t))o[s]=n.map(a);return o}const It={nucleo:"Esenciales",dinero:"Mi dinero",planificacion:"Planificación",analisis:"Análisis del dashboard",datos:"Datos y sincronización"},Jt=[{id:"dashboard",nombre:"Dashboard",descripcion:"Saldo actual, extracto proyectado y evolución. No se puede desactivar.",grupo:It.nucleo,porDefecto:!0,nucleo:!0},{id:"expenses",nombre:"Gastos e ingresos",descripcion:"Estimaciones recurrentes y extraordinarias, transferencias entre cuentas y etiquetas.",grupo:It.dinero,porDefecto:!0},{id:"loans",nombre:"Préstamos",descripcion:"Tablas de amortización, TAE y amortizaciones anticipadas.",grupo:It.dinero,porDefecto:!0},{id:"nominas",nombre:"Nóminas",descripcion:"Salarios con IRPF por tramos, pagas extra y retribución flexible.",grupo:It.dinero,porDefecto:!0},{id:"accounts",nombre:"Cuentas y contabilidad",descripcion:"Cuentas, fondos de inversión, planes de pensiones, puntos de control de saldo, registro de movimientos reales, importación de extractos y análisis de precisión de las estimaciones.",grupo:It.dinero,porDefecto:!0},{id:"margenes",nombre:"Márgenes de seguridad",descripcion:"Umbrales mínimos de saldo por cuenta, con avisos al cruzarlos.",grupo:It.planificacion,porDefecto:!1},{id:"resumen-ejecutivo",nombre:"Resumen ejecutivo",descripcion:"Titulares del periodo: ingresos, gastos, ahorro y saldo final estimado.",grupo:It.analisis,porDefecto:!0},{id:"velas-saldo",nombre:"Velas del saldo",descripcion:"Apertura, cierre, máximo y mínimo del saldo por mes o por año.",grupo:It.analisis,porDefecto:!0},{id:"graficos-etiquetas",nombre:"Gráficos por etiqueta",descripcion:"Reparto y media mensual del gasto por etiqueta, con grupos de etiquetas.",grupo:It.analisis,porDefecto:!0},{id:"puntos-criticos",nombre:"Puntos críticos",descripcion:"Avisos de saldo negativo o por debajo del colchón en la proyección.",grupo:It.analisis,porDefecto:!0},{id:"precision-estimaciones",nombre:"Precisión de estimaciones",descripcion:"Acierto de cada estimación frente al gasto real, con ajuste sugerido.",grupo:It.analisis,porDefecto:!0,dependencias:["accounts","expenses"]},{id:"sync-nube",nombre:"Sincronización en la nube",descripcion:"Copia cifrada en Firebase o Dropbox, además del almacenamiento local.",grupo:It.datos,porDefecto:!0},{id:"autoguardado",nombre:"Autoguardado",descripcion:"Sube una copia a la nube cada cierto intervalo automáticamente.",grupo:It.datos,porDefecto:!1,dependencias:["sync-nube"]}],zr=new Map(Jt.map(t=>[t.id,t]));function Re(t){return zr.get(t)}function _s(t){return Jt.filter(e=>(e.dependencias||[]).includes(t))}function Ua(){const t={};for(const e of Jt)t[e.id]=e.porDefecto;return t}function Fs(){const t=[],e=new Map;for(const a of Jt)e.has(a.grupo)||(e.set(a.grupo,[]),t.push(a.grupo)),e.get(a.grupo).push(a);return t.map(a=>({grupo:a,features:e.get(a)}))}function jr(t){function e(){return{...Ua(),...t.get("config").features||{}}}function a(d){t.patchConfig({features:d})}function o(d,p=e(),v=new Set){const g=Re(d);if(!g)return!1;if(g.nucleo)return!0;if(p[d]===!1)return!1;if(v.has(d))return!0;v.add(d);for(const b of g.dependencias||[])if(!o(b,p,v))return!1;return!0}function s(d,p=e()){const v=Re(d);return v?(v.dependencias||[]).filter(g=>!o(g,p)):[]}function n(d,p){var C;const v=Re(d);if(!v)return{cambiadas:[]};if(v.nucleo)return{cambiadas:[],motivo:"nucleo-inmutable"};const g=e(),b=new Map(Jt.map(S=>[S.id,o(S.id,g)])),y={...g,[d]:p};let f;if(p){const S=[...v.dependencias||[]];for(;S.length;){const I=S.pop();y[I]===!1&&(y[I]=!0,f="dependencias-activadas"),S.push(...((C=Re(I))==null?void 0:C.dependencias)||[])}}else{const S=_s(d).map(I=>I.id);for(;S.length;){const I=S.pop();y[I]!==!1&&(y[I]=!1,f="cascada-apagado"),S.push(..._s(I).map(E=>E.id))}}return a(y),{cambiadas:Jt.filter(S=>o(S.id,y)!==b.get(S.id)).map(S=>S.id),motivo:f}}function i(){const d=e();return Jt.map(p=>{const v=s(p.id,d);return{...p,activa:o(p.id,d),...v.length>0&&d[p.id]!==!1?{bloqueadaPor:v}:{}}})}function r(){const d=e();return Fs().map(({grupo:p,features:v})=>({grupo:p,features:v.map(g=>{const b=s(g.id,d);return{...g,activa:o(g.id,d),...b.length>0&&d[g.id]!==!1?{bloqueadaPor:b}:{}}})}))}function c(){a(Ua())}function l(d){return{_app:"financeapp",_tipo:"feature-profile",_v:1,...d?{nombre:d}:{},features:e()}}function u(d){const p=d,v=p&&typeof p=="object"&&p.features&&typeof p.features=="object"?p.features:null;if(!v)throw new Error('El perfil no tiene una sección "features" válida');const g=Ua(),b=[],y=[];for(const[f,h]of Object.entries(v)){if(!Re(f)){y.push(f);continue}if(typeof h!="boolean"){y.push(f);continue}g[f]=h,b.push(f)}return a(g),{aplicadas:b,ignoradas:y}}return{isEnabled:d=>o(d),setEnabled:n,estado:i,estadoPorGrupo:r,reset:c,exportProfile:l,importProfile:u,bloqueadaPor:d=>s(d)}}const ke=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function he(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function qr(t){var s,n;const a=(((s=t.bloqueadaPor)==null?void 0:s.length)??0)>0?`<div style="font-size:11px;color:var(--yellow);margin-top:3px">Requiere: ${(n=t.bloqueadaPor)==null?void 0:n.map(ke).join(", ")}</div>`:"",o=t.nucleo?'<span style="font-size:10px;color:var(--text3);border:1px solid var(--border2);border-radius:3px;padding:1px 5px;margin-left:6px">siempre activa</span>':"";return`
    <div style="display:flex;gap:12px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)">
      <label class="toggle" style="margin-top:2px">
        <input type="checkbox" data-feature-toggle="${ke(t.id)}" ${t.activa?"checked":""} ${t.nucleo?"disabled":""}/>
        <span class="toggle-slider"></span>
      </label>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;color:var(--text);font-weight:500">${ke(t.nombre)}${o}</div>
        <div style="font-size:12px;color:var(--text2);line-height:1.5;margin-top:2px">${ke(t.descripcion)}</div>
        ${a}
      </div>
    </div>`}function Nr(t){return`
    <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:16px">
      Activa solo lo que uses. Se guarda con tus datos, así que se mantiene entre
      sesiones y viaja en las copias de seguridad. Al desactivar algo se apaga
      también lo que dependa de ello.
    </div>
    <div style="max-height:min(58vh,520px);overflow-y:auto;padding-right:4px">${t.estadoPorGrupo().map(({grupo:o,features:s})=>`
      <div style="margin-bottom:18px">
        <div class="card-title" style="margin-bottom:6px">${ke(o)}</div>
        ${s.map(qr).join("")}
      </div>`).join("")}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;padding-top:14px;border-top:1px solid var(--border2)">
      <button class="btn-secondary" data-feature-action="export">Guardar perfil</button>
      <button class="btn-secondary" data-feature-action="import">Cargar perfil</button>
      <button class="btn-secondary" data-feature-action="reset" style="margin-left:auto">Restablecer</button>
    </div>
    <input type="file" data-feature-file accept=".json" style="display:none"/>`}function Rr(t){var s;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a,cerrar:()=>e.classList.add("hidden")};let o=t.getElementById("fa-features-overlay");return o||(o=t.createElement("div"),o.id="fa-features-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-feature-close>×</button><div id="fa-features-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-feature-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-features-content"),cerrar:()=>o==null?void 0:o.classList.add("hidden")}}function kr(t){const e=t.document??document,{flags:a}=t;function o(i){i.innerHTML=`<div class="modal-title">Funcionalidades</div>${Nr(a)}`,s(i)}function s(i){var c,l,u;i.querySelectorAll("[data-feature-toggle]").forEach(d=>{d.addEventListener("change",()=>{var g;const p=d.dataset.featureToggle,v=a.setEnabled(p,d.checked);v.motivo==="dependencias-activadas"&&he(t,"Se han activado también las funcionalidades necesarias"),v.motivo==="cascada-apagado"&&he(t,"Se han desactivado las funcionalidades que dependían de esta","warn"),(g=t.onChange)==null||g.call(t,v.cambiadas),o(i)})});const r=i.querySelector("[data-feature-file]");(c=i.querySelector('[data-feature-action="export"]'))==null||c.addEventListener("click",()=>{const d=a.exportProfile(),p=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),v=URL.createObjectURL(p),g=e.createElement("a");g.href=v,g.download=`financeapp-funcionalidades-${ot()}.json`,g.click(),URL.revokeObjectURL(v),he(t,"Perfil de funcionalidades guardado")}),(l=i.querySelector('[data-feature-action="import"]'))==null||l.addEventListener("click",()=>r==null?void 0:r.click()),r==null||r.addEventListener("change",async()=>{var p,v;const d=(p=r.files)==null?void 0:p[0];if(d)try{const{aplicadas:g,ignoradas:b}=a.importProfile(JSON.parse(await d.text()));he(t,b.length>0?`Perfil cargado (${g.length} aplicadas, ${b.length} ignoradas por ser de otra versión)`:`Perfil cargado (${g.length} funcionalidades)`),(v=t.onChange)==null||v.call(t,g),o(i)}catch(g){he(t,"No se pudo cargar el perfil: "+g.message,"err")}finally{r.value=""}}),(u=i.querySelector('[data-feature-action="reset"]'))==null||u.addEventListener("click",()=>{var d;a.reset(),he(t,"Funcionalidades restablecidas"),(d=t.onChange)==null||d.call(t,[]),o(i)})}function n(){const i=Rr(e);o(i.content),i.overlay.classList.remove("hidden")}return{open:n,renderInto:o}}const Dt=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),Lr={loans:"Préstamos",expenses:"Gastos e ingresos",accounts:"Cuentas",nominas:"Nóminas",transacciones:"Contabilidad",puntosControl:"Puntos de control",inflacion:"Inflación",tramosIRPFHistorico:"Tramos IRPF históricos",tramosGananciasCapitalHistorico:"Tramos de ganancias históricos",personas:"Personas"};function Ds(t){return Lr[t]??t}function Nt(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Ts(t,e){if(t.confirmar)return t.confirmar(e);const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(e):typeof confirm=="function"?confirm(e):!0}function Or(t){if(t.recargarPagina)return t.recargarPagina();location.reload()}function Br(){var e,a,o,s;const t=globalThis;(a=(e=t.State)==null?void 0:e.load)==null||a.call(e),(s=(o=t.Router)==null?void 0:o.rerender)==null||s.call(o)}function Hr(t){var s;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a};let o=t.getElementById("fa-proyectos-overlay");return o||(o=t.createElement("div"),o.id="fa-proyectos-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-proyectos-close>×</button><div id="fa-proyectos-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-proyectos-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-proyectos-content")}}function Gr(t,e){const a=t._id===e,o=t._id==="default";return`
    <div class="dm-section" data-proyecto-fila="${Dt(t._id)}" style="padding:12px 15px">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${Dt(t.nombre)}
        </div>
        ${a?'<span class="dm-badge dm-badge--local">Activo</span>':""}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        ${a?"":`<button class="btn-primary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="cambiar" data-proyecto-id="${Dt(t._id)}">Cambiar a este</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="renombrar" data-proyecto-id="${Dt(t._id)}">Renombrar</button>
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-proyecto-accion="duplicar" data-proyecto-id="${Dt(t._id)}">Duplicar</button>
        ${o||a?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-proyecto-accion="eliminar" data-proyecto-id="${Dt(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Vr(t,e,a){const o=t.filter(i=>i._id!==e);if(o.length===0)return"";const s=o.map(i=>`<option value="${Dt(i._id)}">${Dt(i.nombre)}</option>`).join(""),n=a.map(i=>`
      <label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:4px 0">
        <input type="checkbox" data-proyecto-import-col="${Dt(i)}"/> ${Dt(Ds(i))}
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
    </div>`}function Ur(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nuevo proyecto</span></div>
      <div style="display:flex;gap:8px">
        <input type="text" id="proyecto-nuevo-nombre" class="auth-input" placeholder="Nombre del proyecto" style="flex:1"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="proyecto-nuevo-btn">Crear</button>
      </div>
    </div>`}function Yr(t){const e=t.document??document,{proyectos:a}=t;function o(){const r=a.listar(),c=a.activo()._id;return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Cada proyecto es una instancia separada: sus propias cuentas, gastos,
        préstamos, todo. Cambiar de proyecto recarga la página.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${r.map(l=>Gr(l,c)).join("")}
      </div>
      ${Ur()}
      ${Vr(r,c,a.colecciones)}`}function s(r){r.innerHTML=`<div class="modal-title">Proyectos</div>${o()}`,n(r)}function n(r){var c,l;r.querySelectorAll("[data-proyecto-accion]").forEach(u=>{u.addEventListener("click",()=>{const d=u.dataset.proyectoId,p=u.dataset.proyectoAccion,v=a.listar().find(g=>g._id===d);if(v){if(p==="cambiar"){if(!Ts(t,`¿Cambiar a "${v.nombre}"? Se recargará la página.`))return;a.cambiarA(d),Or(t);return}if(p==="renombrar"){const g=typeof prompt=="function"?prompt("Nuevo nombre",v.nombre):null;if(!g||!g.trim())return;a.renombrar(d,g.trim()),Nt(t,"Proyecto renombrado"),s(r);return}if(p==="duplicar"){const g=`${v.nombre} (copia)`,b=typeof prompt=="function"?prompt("Nombre de la copia",g):g;if(b===null)return;const y=a.duplicar(d,b.trim()||g);Nt(t,`"${y.nombre}" creado como copia de "${v.nombre}" ✓`),s(r);return}if(p==="eliminar"){if(!Ts(t,`¿Eliminar "${v.nombre}"? Se borran todos sus datos y no se puede deshacer.`))return;try{a.eliminar(d),Nt(t,`"${v.nombre}" eliminado`),s(r)}catch(g){Nt(t,g.message,"err")}}}})}),(c=r.querySelector("#proyecto-nuevo-btn"))==null||c.addEventListener("click",()=>{const u=r.querySelector("#proyecto-nuevo-nombre"),d=u==null?void 0:u.value.trim();if(!d){Nt(t,"Ponle un nombre al proyecto","warn");return}const p=a.crear(d);Nt(t,`"${p.nombre}" creado ✓`),s(r)}),(l=r.querySelector("#proyecto-import-btn"))==null||l.addEventListener("click",()=>{var v;const u=(v=r.querySelector("#proyecto-import-origen"))==null?void 0:v.value;if(!u)return;const d=[...r.querySelectorAll("[data-proyecto-import-col]:checked")].map(g=>g.dataset.proyectoImportCol);if(d.length===0){Nt(t,"Elige al menos una colección para importar","warn");return}const{importadas:p}=a.importarDesde(u,d);if(p.length===0){Nt(t,"El proyecto de origen no tenía nada en esas colecciones","warn");return}Nt(t,`Importado: ${p.map(Ds).join(", ")} ✓`),Br(),s(r)})}function i(){const r=Hr(e);s(r.content),r.overlay.classList.remove("hidden")}return{open:i,renderInto:s}}const sa=["#2ee6a8","#6366f1","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899"],ee=t=>String(t??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");function ye(t,e,a="ok"){if(t.notify)return t.notify(e,a);const o=globalThis.UI;if(o!=null&&o.toast)return o.toast(e,a);console.info("[FinanceApp]",e)}function Wr(t,e){if(t.confirmar)return t.confirmar(e);const a=globalThis.UI;return a!=null&&a.confirm?a.confirm(e):typeof confirm=="function"?confirm(e):!0}function Kr(t){var s;const e=t.getElementById("modal-overlay"),a=t.getElementById("modal-content");if(e&&a)return{overlay:e,content:a};let o=t.getElementById("fa-personas-overlay");return o||(o=t.createElement("div"),o.id="fa-personas-overlay",o.className="modal-overlay",o.innerHTML='<div class="modal-box"><button class="modal-close" data-personas-close>×</button><div id="fa-personas-content"></div></div>',t.body.appendChild(o),o.addEventListener("click",n=>{n.target===o&&(o==null||o.classList.add("hidden"))}),(s=o.querySelector("[data-personas-close]"))==null||s.addEventListener("click",()=>o==null?void 0:o.classList.add("hidden"))),{overlay:o,content:t.getElementById("fa-personas-content")}}function Jr(t){const e=t.color||sa[0];return`
    <div class="dm-section" data-persona-fila="${ee(t._id)}" style="padding:12px 15px;${t.activo?"":"opacity:.55"}">
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        <span style="width:12px;height:12px;border-radius:50%;background:${ee(e)};flex:none"></span>
        <div style="flex:1;min-width:0;font-weight:600;font-size:13px;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
          ${ee(t.nombre)}
        </div>
        ${t.esPorDefecto?'<span class="dm-badge dm-badge--local">Por defecto</span>':""}
        ${t.activo?"":'<span class="dm-badge">Inactiva</span>'}
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="renombrar" data-persona-id="${ee(t._id)}">Renombrar</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="defecto" data-persona-id="${ee(t._id)}">Hacer por defecto</button>`}
        <button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px" data-persona-accion="activo" data-persona-id="${ee(t._id)}">${t.activo?"Desactivar":"Activar"}</button>
        ${t.esPorDefecto?"":`<button class="btn-secondary dm-btn" style="width:auto;padding:6px 12px;color:var(--red)" data-persona-accion="eliminar" data-persona-id="${ee(t._id)}">Eliminar</button>`}
      </div>
    </div>`}function Xr(){return`
    <div class="dm-section">
      <div class="dm-section-head"><span class="dm-badge dm-badge--local">Nueva persona</span></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <input type="text" id="persona-nuevo-nombre" class="auth-input" placeholder="Nombre" style="flex:1;min-width:120px"/>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${sa.map((t,e)=>`<div data-persona-color="${t}" style="width:22px;height:22px;border-radius:50%;background:${t};cursor:pointer;
                border:2px solid ${e===0?"white":"transparent"}"></div>`).join("")}
        </div>
        <input type="hidden" id="persona-nuevo-color" value="${sa[0]}"/>
        <button class="btn-primary dm-btn" style="width:auto;padding:8px 14px" id="persona-nuevo-btn">Crear</button>
      </div>
    </div>`}function Qr(t){const e=t.document??document,{store:a}=t;function o(){return`
      <div style="font-size:12px;color:var(--text2);line-height:1.6;margin-bottom:14px">
        Un gasto, una nómina o un préstamo sin reparto es siempre 100% de la
        persona por defecto. Añade más personas solo si quieres repartir algo
        entre varias.
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;max-height:min(46vh,420px);overflow-y:auto;padding-right:2px;margin-bottom:14px">
        ${a.get("personas").map(Jr).join("")}
      </div>
      ${Xr()}`}function s(c){c.innerHTML=`<div class="modal-title">Personas</div>${o()}`,i(c)}function n(){var c;(c=t.onDatosCambiados)==null||c.call(t)}function i(c){var u;c.querySelectorAll("[data-persona-accion]").forEach(d=>{d.addEventListener("click",()=>{const p=d.dataset.personaId,v=d.dataset.personaAccion,g=a.get("personas"),b=g.find(y=>y._id===p);if(b){if(v==="renombrar"){const y=typeof prompt=="function"?prompt("Nuevo nombre",b.nombre):null;if(!y||!y.trim())return;a.updateItem("personas",p,{nombre:y.trim()}),ye(t,"Persona renombrada"),n(),s(c);return}if(v==="defecto"){a.set("personas",g.map(y=>({...y,esPorDefecto:y._id===p}))),ye(t,`"${b.nombre}" es ahora la persona por defecto`),n(),s(c);return}if(v==="activo"){a.updateItem("personas",p,{activo:!b.activo}),n(),s(c);return}if(v==="eliminar"){if(g.length<=1){ye(t,"No se puede eliminar la única persona del proyecto.","err");return}if(!Wr(t,`¿Eliminar "${b.nombre}"? Lo que tuviera repartido con ella queda sin esa referencia.`))return;a.removeItem("personas",p),ye(t,`"${b.nombre}" eliminada`),n(),s(c)}}})});const l=c.querySelector("#persona-nuevo-color");c.querySelectorAll("[data-persona-color]").forEach(d=>{d.addEventListener("click",()=>{const p=d.getAttribute("data-persona-color");l&&(l.value=p),c.querySelectorAll("[data-persona-color]").forEach(v=>{v.style.border=v.getAttribute("data-persona-color")===p?"2px solid white":"2px solid transparent"})})}),(u=c.querySelector("#persona-nuevo-btn"))==null||u.addEventListener("click",()=>{const d=c.querySelector("#persona-nuevo-nombre"),p=d==null?void 0:d.value.trim();if(!p){ye(t,"Ponle un nombre a la persona","warn");return}const v=(l==null?void 0:l.value)||sa[0],g=a.addItem("personas",{nombre:p,color:v,esPorDefecto:!1,activo:!0});ye(t,`"${g.nombre}" creada ✓`),n(),s(c)})}function r(){const c=Kr(e);s(c.content),c.overlay.classList.remove("hidden")}return{open:r,renderInto:s}}const zs={expenses:"expenses",loans:"loans",nominas:"nominas",accounts:"accounts",margenes:"margenes"};function js(t,e){t.querySelectorAll("[data-feature]").forEach(a=>{const o=a.dataset.feature;if(!o)return;const s=e(o);a.style.display=s?"":"none",s?(a.removeAttribute("aria-hidden"),"disabled"in a&&(a.disabled=!1)):(a.setAttribute("aria-hidden","true"),"disabled"in a&&(a.disabled=!0))})}function Zr({flags:t,document:e=document,router:a,rutasExtra:o}){function s(){const r=e.querySelector(".nav-btn.active[data-view]");return(r==null?void 0:r.dataset.view)??null}function n(){let r=!1;const c=Object.entries((o==null?void 0:o())??{}).map(([l,u])=>[u,l]);for(const[l,u]of[...Object.entries(zs),...c]){const d=t.isEnabled(l),p=e.querySelector(`.nav-btn[data-view="${u}"]`);p&&(p.style.display=d?"":"none"),!d&&s()===u&&(r=!0)}if(e.querySelectorAll(".nav-section").forEach(l=>{const u=[...l.querySelectorAll(".nav-btn[data-view]")];if(u.length===0)return;const d=u.some(p=>p.style.display!=="none");l.style.display=d?"":"none"}),js(e,l=>t.isEnabled(l)),r){const l=a??globalThis.Router;l==null||l.navigate("dashboard")}}function i(r=e.body){if(typeof MutationObserver>"u")return()=>{};let c=!1;const l=new MutationObserver(()=>{if(!c){c=!0;try{js(e,u=>t.isEnabled(u))}finally{c=!1}}});return l.observe(r,{childList:!0,subtree:!0}),()=>l.disconnect()}return{apply:n,observar:i,vistaPara:r=>zs[r]}}const tc="toast toast-deshacer";function ec(t){const{store:e,rerender:a,duracionMs:o=12e3}=t,s=t.contenedor??(()=>document.getElementById("toast-container"));let n=null,i=null,r=null;function c(){i&&clearTimeout(i),i=null,n==null||n.remove(),n=null}function l(d){const p=s();if(!p)return;c();const v=document.createElement("div");v.className=tc,v.style.display="flex",v.style.alignItems="center",v.style.gap="12px";const g=document.createElement("span");g.textContent=`${Ir(d.col,d.item)} se ha eliminado.`,g.style.flex="1";const b=document.createElement("button");b.type="button",b.className="btn-secondary btn-sm",b.textContent="Deshacer",b.style.flexShrink="0",b.addEventListener("click",()=>{const y=e.deshacerBorrado();if(c(),!y)return;const f=s();if(f){const h=document.createElement("div");h.className="toast toast-ok",h.textContent="Deshecho.",f.appendChild(h),setTimeout(()=>h.remove(),2500)}a==null||a()}),v.appendChild(g),v.appendChild(b),p.appendChild(v),n=v,i=setTimeout(c,o)}const u=e.subscribe(()=>{const d=e.borradoPendiente();if(!d){r=null,c();return}d!==r&&(r=d,l(d))});return()=>{u(),c()}}function na(t){return String(t??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}function qs(t,e){const a=na(t),o=na(e);if(!o)return-1;const s=a.indexOf(o);return s<0?-1:s===0?0:/[\s\-/_(«"']/.test(a[s-1])?1:2}const Le=t=>{const e=Number(t);return Number.isFinite(e)?`${e.toLocaleString("es-ES",{minimumFractionDigits:2,maximumFractionDigits:2})} €`:""};function ac(t){const e=[],a=o=>{var s,n;return((n=(s=t.accounts)==null?void 0:s.find(i=>i._id===o))==null?void 0:n.nombre)??""};for(const o of t.expenses??[]){const s=o.tipo==="ingreso";e.push({tipo:s?"ingreso":"gasto",etiqueta:s?"Ingreso":"Gasto",id:o._id,titulo:o.concepto,detalle:[Le(o.cuantia),a(o.cuenta)].filter(Boolean).join(" · "),ruta:"expenses",extra:[...o.tags??[],a(o.cuenta)].join(" ")})}for(const o of t.accounts??[])e.push({tipo:"cuenta",etiqueta:"Cuenta",id:o._id,titulo:o.nombre,detalle:Le(o.saldoInicial),ruta:"accounts"});for(const o of t.loans??[])e.push({tipo:"prestamo",etiqueta:"Préstamo",id:o._id,titulo:o.nombre,detalle:Le(o.capital),ruta:"loans",extra:[...o.tags??[],a(o.cuenta)].join(" ")});for(const o of t.nominas??[])e.push({tipo:"nomina",etiqueta:"Nómina",id:o._id,titulo:o.nombre,detalle:`${Le(o.bruto)} brutos`,ruta:"nominas"});for(const o of t.transacciones??[])e.push({tipo:"movimiento",etiqueta:"Movimiento",id:o._id,titulo:o.concepto,detalle:[o.fecha,Le(o.importeCts/100),a(o.cuentaId)].filter(Boolean).join(" · "),ruta:"accounts",extra:(o.tags??[]).join(" ")});return e}function oc(t,e,a={}){const{maximo:o=12,rutasDisponibles:s=null}=a,n=na(e);if(n.length<2)return[];const i=c=>s===null||s.includes(c),r=[];for(const c of ac(t)){if(!i(c.ruta))continue;const l=qs(c.titulo,n),u=l>=0?-1:Math.min(qs(c.extra??"",n),2);if(l<0&&u<0)continue;const d=l>=0?l:3;r.push({tipo:c.tipo,etiqueta:c.etiqueta,id:c.id,titulo:c.titulo,detalle:c.detalle,ruta:c.ruta,peso:d*1e3+Math.min(999,na(c.titulo).length)})}return r.sort((c,l)=>c.peso-l.peso||c.titulo.localeCompare(l.titulo,"es")),r.slice(0,o)}const sc="buscador-overlay",Ns="btn-buscador";function nc(t){const e=t.doc??document,a=t.rutasDisponibles??(()=>null);let o=null,s=null,n=null,i=[],r=0;function c(){const S=e.createElement("div");S.id=sc,S.className="modal-overlay",S.style.alignItems="flex-start",S.style.paddingTop="10vh";const I=e.createElement("div");I.className="modal-box",I.style.maxWidth="560px",I.style.padding="14px";const E=e.createElement("input");E.type="search",E.className="form-input",E.placeholder="Buscar gastos, cuentas, préstamos, movimientos…",E.setAttribute("aria-label","Buscar en toda la aplicación"),E.autocomplete="off";const M=e.createElement("div");return M.style.marginTop="10px",M.style.maxHeight="52vh",M.style.overflowY="auto",I.appendChild(E),I.appendChild(M),S.appendChild(I),e.body.appendChild(S),S.addEventListener("click",w=>{w.target===S&&b()}),E.addEventListener("input",()=>{r=0,u()}),E.addEventListener("keydown",v),o=S,s=E,n=M,S}function l(){if(n){if(n.textContent="",i.length===0){const S=e.createElement("div");S.style.padding="14px 4px",S.style.fontSize="13px",S.style.color="var(--text3)";const I=(s==null?void 0:s.value.trim())??"";S.textContent=I.length<2?"Escribe al menos dos letras.":"Nada que se parezca a eso.",n.appendChild(S);return}i.forEach((S,I)=>{const E=e.createElement("button");E.type="button",E.className="buscador-fila",E.dataset.indice=String(I),I===r&&E.classList.add("activa");const M=e.createElement("div");M.style.minWidth="0";const w=e.createElement("div");w.textContent=S.titulo,w.style.fontSize="13px",w.style.overflow="hidden",w.style.textOverflow="ellipsis",w.style.whiteSpace="nowrap";const x=e.createElement("div");x.textContent=S.detalle,x.style.fontSize="11px",x.style.color="var(--text3)",x.style.overflow="hidden",x.style.textOverflow="ellipsis",x.style.whiteSpace="nowrap",M.appendChild(w),S.detalle&&M.appendChild(x);const _=e.createElement("span");_.className="tag",_.textContent=S.etiqueta,_.style.flexShrink="0",E.appendChild(M),E.appendChild(_),E.addEventListener("click",()=>p(I)),n.appendChild(E)})}}function u(){const S=(s==null?void 0:s.value)??"";i=oc(t.estado(),S,{rutasDisponibles:a()}),r>=i.length&&(r=Math.max(0,i.length-1)),l()}function d(S){var I,E;i.length!==0&&(r=(r+S+i.length)%i.length,l(),(E=(I=n==null?void 0:n.querySelector(".buscador-fila.activa"))==null?void 0:I.scrollIntoView)==null||E.call(I,{block:"nearest"}))}function p(S){const I=i[S];I&&(b(),t.navegar(I.ruta))}function v(S){S.key==="Escape"?(S.preventDefault(),b()):S.key==="ArrowDown"?(S.preventDefault(),d(1)):S.key==="ArrowUp"?(S.preventDefault(),d(-1)):S.key==="Enter"&&(S.preventDefault(),p(r))}function g(){const S=o??c();S.classList.remove("hidden"),S.style.display="",r=0,s&&(s.value="",s.focus()),u()}function b(){o&&(o.style.display="none",i=[])}function y(){return!!o&&o.style.display!=="none"}function f(S){(S.ctrlKey||S.metaKey)&&(S.key==="k"||S.key==="K")&&(S.preventDefault(),y()?b():g())}e.addEventListener("keydown",f);let h=null;function C(){const S=e.getElementById("period-bar");if(!S||e.getElementById(Ns))return;const I=e.createElement("button");I.id=Ns,I.type="button",I.className="btn-secondary",I.title="Buscar en toda la aplicación (Ctrl+K)",I.setAttribute("aria-label","Buscar"),I.textContent="🔍 Buscar",I.style.marginLeft="auto",I.addEventListener("click",g),S.appendChild(I),h=I}return C(),()=>{e.removeEventListener("keydown",f),h==null||h.remove(),o==null||o.remove(),o=null,s=null,n=null}}const ic=new Set(["date","month","datetime-local","time","week"]),rc=/^(\d|Arrow(Up|Down|Left|Right)|Backspace|Delete)$/,ia=Symbol.for("financeapp.camposFecha");function cc(t){if(t.ownerDocument.activeElement===t)return!0;try{return t.matches(":focus-within")}catch{return!1}}function Ya(t){return!!t&&t.tagName==="INPUT"&&ic.has(t.type)}function lc(t=window){if(t[ia])return t[ia];const e=new WeakSet,a=new WeakSet,o=new WeakSet;function s(l){if(e.delete(l),!!a.has(l)&&(a.delete(l),!!l.isConnected)){o.add(l);try{l.dispatchEvent(new Event("change",{bubbles:!0}))}finally{o.delete(l)}}}const n=l=>{Ya(l.target)&&(l.key==="Enter"?s(l.target):rc.test(l.key)&&e.add(l.target))},i=l=>{const u=l.target;!Ya(u)||o.has(u)||!e.has(u)||cc(u)&&(l.stopImmediatePropagation(),a.add(u))},r=l=>{Ya(l.target)&&s(l.target)};t.addEventListener("keydown",n,!0),t.addEventListener("change",i,!0),t.addEventListener("blur",r,!0);const c=()=>{t.removeEventListener("keydown",n,!0),t.removeEventListener("change",i,!0),t.removeEventListener("blur",r,!0),delete t[ia]};return t[ia]=c,c}const Wa="aviso-guardado";function dc(t){const e=t.doc??document,a=t.contenedor??(()=>e.getElementById("toast-container")),o=t.msExito??1800,s=t.cambios.crearMarca("guardado");let n="oculto",i=!1,r=null,c=null;function l(){var g;r&&clearTimeout(r),r=null,(g=e.getElementById(Wa))==null||g.remove()}function u(){if(n==="oculto")return l();const g=a();if(!g)return;let b=e.getElementById(Wa);b||(b=e.createElement("div"),b.id=Wa,g.appendChild(b)),b.className=`toast toast-guardado toast-guardado--${n}`,b.style.display="flex",b.style.alignItems="center",b.style.gap="12px",b.textContent="";const y=e.createElement("span");if(y.style.flex="1",b.appendChild(y),n==="pendiente")y.textContent="Tienes cambios sin guardar.",b.appendChild(d("Guardar ahora","btn-primary btn-sm",()=>void p())),b.appendChild(d("Ocultar","btn-secondary btn-sm",()=>{i=!0,n="oculto",u()}));else if(n==="subiendo"){y.textContent="Subiendo…";const f=e.createElement("span");f.className="guardado-giro",f.setAttribute("aria-hidden","true"),b.appendChild(f)}else n==="guardado"?y.textContent="¡Guardado!":n==="error"&&(y.textContent="No se ha podido guardar.",b.appendChild(d("Reintentar","btn-primary btn-sm",()=>void p())))}function d(g,b,y){const f=e.createElement("button");return f.type="button",f.className=b,f.textContent=g,f.style.flexShrink="0",f.addEventListener("click",y),f}async function p(){if(c)return c;r&&clearTimeout(r);const g=t.cambios.revision();return n="subiendo",u(),c=(async()=>{try{await t.guardar(),s.alDia(g),n="guardado",u(),r=setTimeout(()=>{n=s.pendiente()?"pendiente":"oculto",n==="pendiente"&&(i=!1),u()},o)}catch(b){console.error("[guardado] no se ha podido subir la copia:",b),n=t.hayDestino()?"error":"oculto",u()}finally{c=null}})(),c}const v=t.cambios.suscribir(()=>{t.hayDestino()&&(i=!1,n!=="subiendo"&&(n="pendiente",u()))});return{estado:()=>i&&n==="oculto"?"oculto":n,guardarAhora:p,hayPendiente:()=>s.pendiente(),detener(){v(),l()}}}function uc({document:t=document,isEnabled:e}={}){const a=new Map;let o=null;function s(g){return`view-${g}`}function n(g){const b=t.getElementById(s(g.route));if(b)return b;const y=t.querySelector(".view-container");if(!y)return null;const f=t.createElement("div");return f.id=s(g.route),f.className="view hidden",y.appendChild(f),f}function i(g){if(t.querySelector(`.nav-btn[data-view="${g.route}"]`))return;const b=t.querySelectorAll(".nav-section"),y=b[g.seccion??Math.max(0,b.length-1)];if(!y)return;const f=t.createElement("button");f.className="nav-btn",f.dataset.view=g.route,f.innerHTML=`${g.iconoPath?`<svg viewBox="0 0 24 24"><path d="${g.iconoPath}"/></svg>`:""}<span>${g.nombre}</span>`,y.appendChild(f),f.addEventListener("click",()=>{const h=globalThis.Router;h==null||h.navigate(g.route)})}function r(g){a.set(g.route,g),n(g),i(g)}function c(){return[...a.keys()].filter(g=>{const b=a.get(g);return!e||e(b.flagId??b.id)})}function l(g){return c().includes(g)}function u(g){const b=a.get(g);if(!b||e&&!e(b.flagId??b.id))return!1;const y=n(b);if(!y)return!1;if(o&&o!==g){const f=a.get(o),h=t.getElementById(s(o));f!=null&&f.unmount&&h&&f.unmount(h)}return b.mount(y),o=g,!0}function d(){o&&u(o)}function p(){const g={};for(const[b,y]of a)g[b]=y.flagId??y.id;return g}function v(){for(const g of a.values())n(g),i(g)}return{register:r,routes:c,has:l,mount:u,rerender:d,flagPorRuta:p,attachToShell:v,get activa(){return o}}}const pc="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z";function Ka(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}function mc(t){const{store:e}=t,a=t.hoy??ot,o=()=>K(a()),s=()=>e.get("config").margenesSeguridad??[];function n(v){var g;e.patchConfig({margenesSeguridad:v}),(g=t.onDatosCambiados)==null||g.call(t)}function i(v,g){const b=s().map(f=>({...f,puntos:(f.puntos??[]).map(h=>({...h}))})),y=b.find(f=>f._id===v);y&&(g(y),n(b))}function r(v){const g=e.get("config"),b=Aa(v,e.get("expenses"),g,e.get("loans"),a(),!1,o());return F(b)}function c(v,g,b){const y=g.tipo==="fijo",f=y?"":`<span class="text-sm" style="color:var(--text3)">${m(F((g.meses??0)*b))}</span>`;return`
      <tr data-punto="${m(g._id)}" data-margen="${m(v._id)}">
        <td style="padding:4px 6px">
          <input type="date" class="form-input" style="width:130px" value="${m(g.fecha)}" data-campo="fecha"/>
        </td>
        <td style="padding:4px 6px">
          <select class="form-input" style="width:100px" data-campo="tipo">
            <option value="fijo"${y?" selected":""}>Fijo €</option>
            <option value="meses"${y?"":" selected"}>Meses</option>
          </select>
        </td>
        <td style="padding:4px 6px">
          ${y?`<input type="number" class="form-input" style="width:90px" value="${g.importe??0}" data-campo="importe"/>`:'<span style="color:var(--text3)">—</span>'}
        </td>
        <td style="padding:4px 6px">
          ${y?'<span style="color:var(--text3)">—</span>':`<input type="number" class="form-input" style="width:70px" value="${g.meses??0}" step="0.5" data-campo="meses"/>`}
        </td>
        <td style="padding:4px 6px">${f}</td>
        <td style="padding:4px 6px">
          <button class="btn-icon" style="color:var(--red)" data-borrar-punto title="Eliminar punto">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </td>
      </tr>`}function l(v,g,b){const y=v.cuentas&&v.cuentas.length>0?v.cuentas.map(S=>{var I;return((I=g.find(E=>E._id===S))==null?void 0:I.nombre)??S}).join(", "):"Todas las cuentas activas",h=[...v.puntos??[]].sort((S,I)=>S.fecha.localeCompare(I.fecha)).map(S=>c(v,S,b)).join(""),C=v.activo?`
      <div class="mt-8 text-sm" style="color:var(--text2)"><span style="color:var(--text3)">Cuentas:</span> ${m(y)}</div>
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
        ${C}
      </div>`}function u(v,g){const b=g?s().find(C=>C._id===g):null,y=e.get("accounts").filter(C=>C.activo),f=new Set((b==null?void 0:b.cuentas)??[]),h=y.map(C=>`
        <label class="tag" data-chip="${m(C._id)}" style="cursor:pointer;${f.has(C._id)?"border-color:var(--accent);color:var(--accent)":""}">
          <input type="checkbox" class="mg-acc-chip" value="${m(C._id)}" ${f.has(C._id)?"checked":""} style="display:none"/>
          ${m(C.nombre)}
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
          <div class="form-group"><label class="form-label">Fecha</label><input class="form-input" type="date" id="mg-p-fecha" value="${m(ot())}"/></div>
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
      </div>`}function d(v,g){const b=document.getElementById("modal-overlay"),y=zt();!b||!y||(u(y,v),b.classList.remove("hidden"),tt(y,".mg-acc-chip",f=>{const h=f,C=y.querySelector(`[data-chip="${h.value}"]`);C&&(C.style.cssText=`cursor:pointer;${h.checked?"border-color:var(--accent);color:var(--accent)":""}`)}),tt(y,"#mg-p-tipo",f=>{const h=f.value==="fijo",C=y.querySelector("#mg-p-importe-wrap"),S=y.querySelector("#mg-p-meses-wrap");C&&(C.style.display=h?"":"none"),S&&(S.style.display=h?"none":"")}),L(y,"[data-cerrar-form]",()=>b.classList.add("hidden")),L(y,"[data-guardar-margen]",f=>{var E,M,w,x,_;const h=f.getAttribute("data-guardar-margen")||"",C=((E=y.querySelector("#mg-nombre"))==null?void 0:E.value.trim())??"";if(!C)return G("El nombre es obligatorio","err");const S=[...y.querySelectorAll(".mg-acc-chip:checked")].map(A=>A.value),I=s().map(A=>({...A}));if(h){const A=I.findIndex(P=>P._id===h);if(A===-1)return G("Margen no encontrado","err");I[A]={...I[A],nombre:C,cuentas:S}}else{const A=((M=y.querySelector("#mg-p-tipo"))==null?void 0:M.value)??"fijo",P={_id:Ka(),fecha:((w=y.querySelector("#mg-p-fecha"))==null?void 0:w.value)||ot(),tipo:A,importe:parseFloat(((x=y.querySelector("#mg-p-importe"))==null?void 0:x.value)??"0")||0,meses:parseFloat(((_=y.querySelector("#mg-p-meses"))==null?void 0:_.value)??"1")||1};I.push({_id:Ka(),nombre:C,activo:!0,cuentas:S,puntos:[P]})}n(I),G(h?"Margen actualizado":"Margen creado"),b.classList.add("hidden"),g()}))}function p(v){const g=s(),b=e.get("accounts"),y=De(e.get("expenses"),o());v.innerHTML=`
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
             </div>`:g.map(h=>l(h,b,y)).join("")}`;const f=()=>p(v);L(v,"[data-nuevo-margen]",()=>d(null,f)),L(v,"[data-editar-margen]",h=>d(h.getAttribute("data-editar-margen"),f)),L(v,"[data-borrar-margen]",h=>{$t("¿Eliminar este margen de seguridad?")&&(n(s().filter(C=>C._id!==h.getAttribute("data-borrar-margen"))),G("Margen eliminado"),f())}),tt(v,"[data-toggle-margen]",h=>{const C=h.getAttribute("data-toggle-margen");i(C,S=>{S.activo=h.checked}),f()}),L(v,"[data-add-punto]",h=>{const C=h.getAttribute("data-add-punto");i(C,S=>{S.puntos=[...S.puntos??[],{_id:Ka(),fecha:ot(),tipo:"fijo",importe:0,meses:1}]}),f()}),L(v,"[data-borrar-punto]",h=>{const C=h.closest("[data-punto]");if(!C)return;const S=C.dataset.margen,I=C.dataset.punto;i(S,E=>{E.puntos=(E.puntos??[]).filter(M=>M._id!==I)}),f()}),tt(v,"[data-campo]",h=>{const C=h.closest("[data-punto]");if(!C)return;const S=h.getAttribute("data-campo"),I=h.value;i(C.dataset.margen,E=>{const M=(E.puntos??[]).find(w=>w._id===C.dataset.punto);M&&(S==="fecha"?M.fecha=I:S==="tipo"?M.tipo=I:S==="importe"?M.importe=parseFloat(I)||0:M.meses=parseFloat(I)||0)}),f()})}return{id:"margenes",route:"margenes",nombre:"Márgenes de seguridad",flagId:"margenes",seccion:2,iconoPath:pc,mount:p}}const fc=[...Array.from({length:31},(t,e)=>String(e+1)),"ultimo"],gc=[["1","1º"],["2","2º"],["3","3º"],["4","4º"],["5","5º"],["-1","Último"]],vc=[["1","lunes"],["2","martes"],["3","miércoles"],["4","jueves"],["5","viernes"],["6","sábado"],["0","domingo"]];function bc(t){const e=t||"";if(e.startsWith("dia:"))return{modo:"dia",dia:e.slice(4)||"1",nth:"1",wd:"1"};if(e.startsWith("nthweekday:")){const[,a="1",o="1"]=e.split(":");return{modo:"nthweekday",dia:"1",nth:a,wd:o}}return{modo:"none",dia:"1",nth:"1",wd:"1"}}const Ja=(t,e)=>t.map(([a,o])=>`<option value="${m(a)}"${a===e?" selected":""}>${m(o)}</option>`).join("");function Rs(t,e="dp"){const{modo:a,dia:o,nth:s,wd:n}=bc(t),i=Ja(fc.map(r=>[r,r==="ultimo"?"Último día":r]),o);return`<div class="form-group" data-diapago="${m(e)}">
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
        <select class="form-select" data-dp-n style="width:auto;min-width:72px">${Ja(gc,s)}</select>
        <select class="form-select" data-dp-wd style="width:auto;min-width:105px">${Ja(vc,n)}</select>
        del mes
      </span>
    </div>
  </div>`}function ks(t){var o,s,n;const e=t.querySelector("[data-diapago]");if(!e)return;const a=((o=e.querySelector("[data-dp-modo]"))==null?void 0:o.value)??"none";(s=e.querySelector("[data-dp-dia]"))==null||s.style.setProperty("display",a==="dia"?"":"none"),(n=e.querySelector("[data-dp-nth]"))==null||n.style.setProperty("display",a==="nthweekday"?"":"none")}function Ls(t){const e=t.querySelector("[data-diapago]");if(!e)return"";const a=s=>{var n;return((n=e.querySelector(s))==null?void 0:n.value)??""},o=a("[data-dp-modo]");return o==="dia"?`dia:${a("[data-dp-dnum]")}`:o==="nthweekday"?`nthweekday:${a("[data-dp-n]")}:${a("[data-dp-wd]")}`:""}const hc={partesIguales:"partes iguales",porcentaje:"%",importe:"€ exactos"};function yc(t,e){const a=new Set(((e==null?void 0:e.participantes)??[]).map(o=>o.personaId));return t.filter(o=>o.activo||a.has(o._id))}function $e(t,e,a,o){if(a.filter(c=>c.activo).length<2)return"";const s=(e==null?void 0:e.modo)??"",n=new Map(((e==null?void 0:e.participantes)??[]).map(c=>[c.personaId,c.valor])),i=s==="porcentaje"||s==="importe",r=c=>{const l=n.has(c._id),u=n.get(c._id);return`<label style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--text2);padding:3px 0">
      <input type="checkbox" class="reparto-persona" data-reparto-persona="${m(o)}" value="${m(c._id)}"${l?" checked":""}/>
      <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m(c.nombre)}</span>
      <input type="number" class="auth-input" data-reparto-valor="${m(o)}" data-persona="${m(c._id)}"
             value="${u??""}" step="0.01" min="0" placeholder="${s==="porcentaje"?"%":"€"}"
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
      ${yc(a,e).map(r).join("")}
    </div>
  </div>`}function xe(t,e){var i;const a=t.querySelector(`[data-reparto="${e}"]`);if(!a)return;const o=((i=a.querySelector(`[data-reparto-modo="${e}"]`))==null?void 0:i.value)??"",s=a.querySelector(`[data-reparto-participantes="${e}"]`);s&&(s.style.display=o?"":"none");const n=o==="porcentaje"||o==="importe";a.querySelectorAll(`[data-reparto-valor="${e}"]`).forEach(r=>{r.style.display=n?"":"none"})}function Ie(t,e){var i;const a=t.querySelector(`[data-reparto="${e}"]`);if(!a)return;const o=((i=a.querySelector(`[data-reparto-modo="${e}"]`))==null?void 0:i.value)??"";if(!o)return;const s=[...a.querySelectorAll(".reparto-persona:checked")];if(s.length===0)return;const n=s.map(r=>{const c=r.value,l=a.querySelector(`[data-reparto-valor="${e}"][data-persona="${c}"]`),u=l?parseFloat(l.value):NaN;return Number.isFinite(u)?{personaId:c,valor:u}:{personaId:c}});return{modo:o,participantes:n}}function Os(t,e){return!t||t.participantes.length===0?"":`${t.participantes.map(o=>{var s;return((s=e.find(n=>n._id===o.personaId))==null?void 0:s.nombre)??"?"}).join(", ")} (${hc[t.modo]})`}function Xa(t,e,a){const o=Os(t,a),s=Os(e,a);return!o&&!s?"":o===s?`Reparto: ${o}`:[s&&`Paga: ${s}`,o&&`Consume: ${o}`].filter(Boolean).join(" · ")}const $c="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z",xc=[["extraordinario","Único / Extraordinario"],["diaria","Diaria"],["mensual","Mensual"]];function Ic(t){const e=t.hoy??ot,a={mostrarExpirados:!1,orden:"concepto",sentido:1,tipo:"",cuenta:"",desde:"",hasta:"",busqueda:"",tags:new Set},o=()=>{var f;return(f=t.onDatosCambiados)==null?void 0:f.call(t)},s=()=>t.store.get("accounts"),n=f=>{var h;return((h=s().find(C=>C._id===(f||"default")))==null?void 0:h.nombre)??(f||"default")};function i(){const f=e();let h=[...t.store.get("expenses")];if(a.mostrarExpirados||(h=h.filter(C=>!C.fechaFin||C.fechaFin>=f)),a.tipo&&(h=h.filter(C=>C.tipo===a.tipo)),a.cuenta&&(h=h.filter(C=>(C.cuenta||"default")===a.cuenta)),a.desde&&(h=h.filter(C=>(C.fechaInicio??"")>=a.desde)),a.hasta&&(h=h.filter(C=>(C.fechaInicio??"")<=a.hasta)),a.busqueda){const C=a.busqueda.toLowerCase();h=h.filter(S=>S.concepto.toLowerCase().includes(C))}return a.tags.size>0&&(h=h.filter(C=>(C.tags||[]).some(S=>a.tags.has(S)))),h.sort((C,S)=>{const I=C[a.orden]??"",E=S[a.orden]??"";return typeof I=="number"&&typeof E=="number"?(I-E)*a.sentido:String(I).localeCompare(String(E))*a.sentido})}function r(){return[...new Set(t.store.get("expenses").flatMap(f=>f.tags||[]))].filter(Boolean).sort()}function c(f,h){const C=a.orden===f?a.sentido===1?"↑":"↓":"";return`<span class="exp-col-head" data-orden="${f}">${m(h)} <span class="sort-arrow">${C}</span></span>`}function l(f,h=!1){return(h?'<option value="">Todas las cuentas</option>':"")+s().filter(S=>S.activo!==!1).map(S=>`<option value="${m(S._id)}"${S._id===f?" selected":""}>${m(S.nombre)}</option>`).join("")}function u(f){const h=f.tipo==="transferencia",C=Xa(f.repartoConsumo,f.repartoPago,t.store.get("personas")),S=ya(f.diaPago??""),I=f.tipoFrecuencia==="extraordinario"?"Único":`Cada ${f.frecuencia??1} ${f.tipoFrecuencia==="diaria"?"día(s)":"mes(es)"}${S?` · ${S}`:""}`,E=!!f.fechaFin&&f.fechaFin<e(),M=h?'<span class="badge badge-purple">⇄ transf.</span>':f.tipo==="ingreso"?'<span class="badge badge-active">ingreso</span>':'<span class="badge badge-red">gasto</span>',w=h?`${m(n(f.cuenta))} → ${m(n(f.cuentaDestino))}`:m(n(f.cuenta)),x=(f.tags||[]).map(_=>`<span class="tag${a.tags.has(_)?" active":""}" data-tag="${m(_)}" title="Filtrar por ${m(_)}">${m(_)}</span>`).join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(f.concepto)}</div>
        <div class="tag-list mt-4">${x}</div>
      </div>
      <div>${M}</div>
      <div class="num ${f.tipo==="ingreso"?"pos":h?"":"neg"}">${h?"⇄ ":""}${m(F(f.cuantia))}</div>
      <div class="text-sm">${m(I)}</div>
      <div class="text-sm exp-col-hide">${w}</div>
      <div class="flex gap-8 items-center exp-col-hide">
        <label class="toggle"><input type="checkbox" data-activo="${m(f._id)}"${f.activo?" checked":""}/><span class="toggle-slider"></span></label>
        ${f.tipo==="gasto"&&f.clasificacion==="deseo"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:#ffb020" title="Gasto clasificado como deseo">deseo</span>':""}
        ${f.tipo==="gasto"&&f.clasificacion===null?'<span class="badge badge-inactive" title="Excluido del análisis de distribución">sin clasificar</span>':""}
        ${f.basico?'<span class="badge badge-orange" title="Gasto básico">⚑ básico</span>':""}
        ${f.tipo==="gasto"&&f.imprevisto?'<span class="badge" style="background:rgba(213,81,129,0.14);color:#e87ba4" title="Cuenta como imprevisto en «Este mes»">imprevisto</span>':""}
        ${f.tipo==="gasto"&&!f.imprevisto&&Je(f)?'<span class="badge" style="background:rgba(77,159,255,0.12);color:#4d9fff" title="Cuenta como factura en «Este mes»">factura</span>':""}
        ${f.ajustadaDesdeId?`<span class="badge" style="background:rgba(99,179,237,0.12);color:#63b3ed" title="Creada por un ajuste automático el ${m(f.ajustadaEn??"")}">ajustada</span>`:""}
        ${C?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(C)}">👥 reparto</span>`:""}
        ${E?'<span class="badge badge-inactive">Exp.</span>':""}
      </div>
      <div class="flex gap-8" style="flex-wrap:nowrap;align-items:center">
        <button class="btn-icon" data-duplicar="${m(f._id)}" title="Duplicar"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
        <button class="btn-icon" data-editar="${m(f._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar="${m(f._id)}">✕</button>
      </div>
    </div>`}function d(f){const h=i(),C=r();f.innerHTML=`
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
        <input class="form-input" type="text" data-busqueda placeholder="Buscar…" value="${m(a.busqueda)}" style="min-width:160px"/>
        <select class="form-select" data-f-tipo>
          <option value="">Todos</option>
          <option value="gasto"${a.tipo==="gasto"?" selected":""}>Gastos</option>
          <option value="ingreso"${a.tipo==="ingreso"?" selected":""}>Ingresos</option>
          <option value="transferencia"${a.tipo==="transferencia"?" selected":""}>Transferencias</option>
        </select>
        <select class="form-select" data-f-cuenta>${l(a.cuenta,!0)}</select>
        <input class="form-input" type="date" data-f-desde value="${m(a.desde)}" title="Fecha inicio desde"/>
        <input class="form-input" type="date" data-f-hasta value="${m(a.hasta)}" title="Fecha inicio hasta"/>
        <button class="btn-secondary btn-sm" data-limpiar>Limpiar</button>
      </div>
      ${C.length>0?`<div class="tag-filter-bar">
              <span class="text-sm" style="color:var(--text3);white-space:nowrap">Etiquetas:</span>
              ${C.map(S=>`<span class="tag${a.tags.has(S)?" active":""}" data-tag="${m(S)}">${m(S)}</span>`).join("")}
              ${a.tags.size>0?'<button class="btn-secondary btn-sm" data-limpiar-tags style="white-space:nowrap">✕ Limpiar etiquetas</button>':""}
            </div>`:""}
      <div class="card" style="padding:0;overflow:hidden">
        <div class="exp-table-head">
          ${c("concepto","Concepto")} ${c("tipo","Tipo")} ${c("cuantia","Cuantía")} ${c("tipoFrecuencia","Frecuencia")}
          <span class="exp-col-head exp-col-hide">Cuenta</span> <span class="exp-col-head exp-col-hide">Básico/Estado</span> <span></span>
        </div>
        ${h.length===0?'<div class="text-sm" style="text-align:center;padding:30px">Sin resultados.</div>':h.map(u).join("")}
      </div>`}function p(f){const h=(f==null?void 0:f.tipo)==="transferencia",C=t.store.get("personas"),S=(I,E,M,w,x="")=>`<div class="form-group"><label class="form-label">${m(E)}</label>
       <input class="form-input" type="${M}" id="${I}" value="${m(w)}" placeholder="${m(x)}"/></div>`;return`
      <div class="grid-2">
        ${S("ef-concepto","Concepto","text",(f==null?void 0:f.concepto)??"","Ej: Alquiler")}
        <div class="form-group"><label class="form-label">Tipo</label>
          <select class="form-select" id="ef-tipo">
            <option value="gasto"${(f==null?void 0:f.tipo)==="gasto"||!(f!=null&&f.tipo)?" selected":""}>Gasto</option>
            <option value="ingreso"${(f==null?void 0:f.tipo)==="ingreso"?" selected":""}>Ingreso</option>
            <option value="transferencia"${h?" selected":""}>Transferencia entre cuentas</option>
          </select>
        </div>
      </div>
      <div class="grid-3 mt-8">
        ${S("ef-cuantia","Cuantía (€)","number",(f==null?void 0:f.cuantia)??"","500")}
        ${S("ef-frecuencia","Frecuencia","number",(f==null?void 0:f.frecuencia)??1,"1")}
        <div class="form-group"><label class="form-label">Tipo frecuencia</label>
          <select class="form-select" id="ef-tipo-frec">
            ${xc.map(([I,E])=>`<option value="${I}"${((f==null?void 0:f.tipoFrecuencia)??"mensual")===I?" selected":""}>${m(E)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="grid-2 mt-8">
        ${S("ef-fecha-ini","Fecha inicio","date",(f==null?void 0:f.fechaInicio)??e())}
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
          <div class="mt-8">${S("ef-fecha-fin","Fecha fin (opcional)","date",(f==null?void 0:f.fechaFin)??"")}</div>
          <div class="mt-8">${Rs(f==null?void 0:f.diaPago,"exp")}</div>
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
                  <option value=""${(f==null?void 0:f.esFactura)===void 0?" selected":""}>Automático${f?` (ahora: ${Je({...f,esFactura:void 0})?"sí":"no"})`:""}</option>
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
          ${h?"":`${$e("Reparto de consumo",f==null?void 0:f.repartoConsumo,C,"consumo")}
                 ${$e("Reparto de pago",f==null?void 0:f.repartoPago,C,"pago")}`}
        </div>
      </details>

      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-cancelar>Cancelar</button>
        <button class="btn-primary" data-guardar="${m((f==null?void 0:f._id)??"")}">Guardar</button>
      </div>`}function v(f){var S;const h=((S=f.querySelector("#ef-tipo"))==null?void 0:S.value)??"gasto",C=(I,E)=>{const M=f.querySelector(I);M&&(M.style.display=E?"":"none")};C("#ef-destino-wrap",h==="transferencia"),C("#ef-basico-wrap",h!=="transferencia"),C("#ef-irpf-wrap",h==="ingreso"),C("#ef-clasificacion-wrap",h==="gasto"),C("#ef-factura-wrap",h==="gasto"),C("#ef-imprevisto-wrap",h==="gasto")}function g(f,h,C){const S=document.getElementById("modal-overlay"),I=zt();!S||!I||(I.innerHTML=`<div class="modal-title">${m(h)}</div>${p(f)}`,S.classList.remove("hidden"),tt(I,"#ef-tipo",()=>v(I)),tt(I,"[data-dp-modo]",()=>ks(I)),tt(I,'[data-reparto-modo="consumo"]',()=>xe(I,"consumo")),tt(I,'[data-reparto-modo="pago"]',()=>xe(I,"pago")),L(I,"[data-cancelar]",()=>S.classList.add("hidden")),L(I,"[data-guardar]",E=>{b(I,E.getAttribute("data-guardar")||"")&&(S.classList.add("hidden"),C())}))}function b(f,h){const C=z=>{var k;return((k=f.querySelector(z))==null?void 0:k.value)??""},S=z=>{var k;return!!((k=f.querySelector(z))!=null&&k.checked)},I=C("#ef-tipo")||"gasto",E=I==="transferencia",M=C("#ef-concepto").trim(),w=parseFloat(C("#ef-cuantia").replace(",",".")),x=C("#ef-fecha-ini"),_=C("#ef-fecha-fin")||null,A=M?!Number.isFinite(w)||w<=0?"La cuantía debe ser mayor que 0 (el signo lo pone el tipo: gasto o ingreso)":x?_&&_<x?"La fecha de fin no puede ser anterior a la de inicio":E&&C("#ef-cuenta")===(C("#ef-cuenta-dest")||"default")?"En una transferencia, la cuenta de destino tiene que ser distinta de la de origen":"":"Indica la fecha de inicio":"Escribe un concepto";if(A)return G(A,"err"),!1;const P=C("#ef-tags").split(",").map(z=>z.trim()).filter(z=>z&&z!=="transferencia"),$=E?[...new Set([...P,"transferencia"])]:[...new Set(P)],T=C("#ef-clasificacion"),D={concepto:M,tipo:I,cuantia:w,frecuencia:parseInt(C("#ef-frecuencia"),10)||1,tipoFrecuencia:C("#ef-tipo-frec")||"mensual",fechaInicio:x,fechaFin:_,diaPago:Ls(f),cuenta:C("#ef-cuenta"),cuentaDestino:E?C("#ef-cuenta-dest")||"default":void 0,activo:S("#ef-activo"),basico:!E&&S("#ef-basico"),sujetoIRPF:!E&&S("#ef-sujetoIRPF"),clasificacion:I==="gasto"?T||null:void 0,esFactura:I==="gasto"?C("#ef-factura")==="si"?!0:C("#ef-factura")==="no"?!1:void 0:void 0,imprevisto:I==="gasto"&&S("#ef-imprevisto")?!0:void 0,tags:$,repartoConsumo:E?void 0:Ie(f,"consumo"),repartoPago:E?void 0:Ie(f,"pago")};return h?(t.store.updateItem("expenses",h,D),G("Actualizado")):(t.store.addItem("expenses",D),G("Creado")),o(),!0}function y(f,h){const C=f.querySelector("[data-busqueda]");let S;C==null||C.addEventListener("input",()=>{clearTimeout(S),S=setTimeout(()=>{a.busqueda=C.value,h();const I=f.querySelector("[data-busqueda]");I==null||I.focus(),I==null||I.setSelectionRange(I.value.length,I.value.length)},250)}),tt(f,"[data-expirados]",I=>{a.mostrarExpirados=I.checked,h()}),tt(f,"[data-f-tipo]",I=>{a.tipo=I.value,h()}),tt(f,"[data-f-cuenta]",I=>{a.cuenta=I.value,h()}),tt(f,"[data-f-desde]",I=>{a.desde=I.value,h()}),tt(f,"[data-f-hasta]",I=>{a.hasta=I.value,h()}),L(f,"[data-limpiar]",()=>{a.tipo="",a.cuenta="",a.desde="",a.hasta="",a.busqueda="",a.tags=new Set,h()}),L(f,"[data-limpiar-tags]",()=>{a.tags=new Set,h()}),L(f,"[data-tag]",I=>{const E=I.getAttribute("data-tag");a.tags.has(E)?a.tags.delete(E):a.tags.add(E),h()}),L(f,"[data-orden]",I=>{const E=I.getAttribute("data-orden");a.orden===E?a.sentido=a.sentido===1?-1:1:(a.orden=E,a.sentido=1),h()}),L(f,"[data-nuevo]",()=>g(null,"Nuevo gasto/ingreso",h)),L(f,"[data-editar]",I=>{const E=t.store.get("expenses").find(M=>M._id===I.getAttribute("data-editar"));E&&g(E,"Editar",h)}),L(f,"[data-duplicar]",I=>{const E=t.store.get("expenses").find(x=>x._id===I.getAttribute("data-duplicar"));if(!E)return;const{_id:M,...w}=E;g({...w,concepto:`${E.concepto} (copia)`},"Duplicar movimiento",h)}),L(f,"[data-borrar]",I=>{$t("¿Eliminar?")&&(t.store.removeItem("expenses",I.getAttribute("data-borrar")),G("Eliminado"),o(),h())}),tt(f,"[data-activo]",I=>{const E=I;t.store.updateItem("expenses",E.getAttribute("data-activo"),{activo:E.checked}),o(),h()})}return{id:"expenses",route:"expenses",nombre:"Gastos e Ingresos",flagId:"expenses",seccion:1,iconoPath:$c,mount(f){const h=()=>d(f);d(f),f.dataset.wired!=="1"&&(y(f,h),f.dataset.wired="1")}}}function ra(t,e,a){return t.reduce((o,s)=>{if(s.esAmortizacion)return o;const n=Ot(e,a,s.fecha);return o+(n>0?s.interes/n:s.interes)},0)}function Bs(t,e,a,o){return t.reduce((s,n)=>{const i=Ot(e,a,n.fecha),r=n.esAmortizacion?n.amortizacion+n.comisionAmort:n.cuota;return s+(i>0?r/i:r)},0)+o}function wc(t,e,a){const o=t.amortizaciones||[];return o.map((s,n)=>{const i=vt({...t,amortizaciones:o.slice(0,n)}),r=vt({...t,amortizaciones:o.slice(0,n+1)});return{nominal:i.totalIntereses-r.totalIntereses,real:ra(i.tabla,e,a)-ra(r.tabla,e,a)}})}const Qa=(t,e,a="",o="")=>`<div class="stat-card">
     <div class="stat-label">${m(t)}</div>
     <div class="stat-value ${o}">${e}</div>
     ${a}
   </div>`;function Sc(t,e){const a=Co(t),o=(t.amortizaciones||[]).length>0,s=e.periodos.length>0,n=e.usarInflacion&&s,i=s?Mo(e.periodos,t.fechaInicio||e.hoy,a.fechaFin||e.hoy,0):0,r=s?Eo(t.tin||0,i):null,c=o&&s?wc(t,e.periodos,e.hoy):[],l=c.length?ra(a.sinAmort.tabla,e.periodos,e.hoy)-ra(a.tabla,e.periodos,e.hoy):null,u=l===null?null:l-a.costeTotalAmort,d=n?Bs(a.tabla,e.periodos,e.hoy,a.comAp):null,p=n&&o?Bs(a.sinAmort.tabla,e.periodos,e.hoy,a.comAp):null;return`<div class="loan-card" style="${e.completado?"opacity:0.65":""}">
    <div class="loan-card-header" data-toggle-loan="${m(t._id)}">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="loan-card-title">${m(t.nombre)}</span>
        ${e.completado?'<span class="badge badge-active" style="background:rgba(46,230,168,0.15);color:var(--accent)">✓ Finalizado</span>':""}
        ${t.simulacion?'<span class="badge badge-sim">SIM</span>':""}
        ${t.activo?"":'<span class="badge badge-inactive">Inactivo</span>'}
        ${t.tipoTasa==="variable"?'<span class="badge badge-orange">Variable</span>':""}
        ${t.basico!==!1?'<span class="badge badge-orange" title="Cuota incluida en el colchón económico">⚑ básico</span>':""}
        ${(()=>{const v=Xa(t.repartoConsumo,t.repartoPago,e.personas);return v?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(v)}">👥 reparto</span>`:""})()}
        ${(t.tags||[]).map(v=>`<span class="tag">${m(v)}</span>`).join("")}
      </div>
      <div class="loan-card-meta">
        <span class="loan-tin">${m(t.tin)}%</span>
        <span class="text-sm">${m(F(a.cuota))}/mes</span>
        <span class="text-sm">${m(a.fechaFin||"—")}</span>
        <button class="btn-icon" data-amort-loan="${m(t._id)}" title="Añadir amortización"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></button>
        <button class="btn-icon" data-editar-loan="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-loan="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="loan-card-body" data-body-loan="${m(t._id)}">

      <div class="grid-4 mb-12">
        ${Qa("Cuota mensual",m(F(a.cuota)),e.cuotaMes>0?`<div class="stat-sub" style="color:var(--accent)">Este mes: ${m(F(e.cuotaMes))}</div>`:"")}
        ${Qa("Total intereses",m(F(a.totalIntereses)),o?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(F(a.sinAmort.totalIntereses))}</div>`:"","neg")}
        <div class="stat-card">
          <div class="stat-label">Fecha fin</div>
          <div class="stat-value" style="font-size:14px">${m(a.fechaFin||"—")}</div>
          ${o&&a.fechaFin!==a.sinAmort.fechaFin?`<div class="stat-sub" style="text-decoration:line-through;color:var(--text3)" title="Sin amortizaciones">${m(a.sinAmort.fechaFin||"—")}${a.ahorroTiempo>0?` (−${a.ahorroTiempo}m)`:""}</div>`:""}
        </div>
        ${Qa("Total pagado",m(F(a.totalPagado)),t.capital?`<div class="stat-sub">Capital: ${m(F(t.capital))}</div>`:"","neg")}
      </div>

      <div class="grid-2 mb-12" style="gap:10px">
        <div class="stat-card" style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div><div class="stat-label">TAE</div><div class="stat-value">${m(xo(a.tae))}</div></div>
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
          <div><div class="stat-label">Capital</div><div class="stat-value">${m(F(t.capital))}</div></div>
          <div><div class="stat-label">Apertura</div><div class="stat-value neg">${m(F(a.comAp))}</div></div>
          <div><div class="stat-label">Inicio</div><div class="stat-value" style="font-size:14px">${m(t.fechaInicio)}</div></div>
          ${t.diaPago?`<div><div class="stat-label">Día de cobro</div><div class="stat-value" style="font-size:14px">${m(ya(t.diaPago))}</div></div>`:""}
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
                        <div><div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num pos">${m(F(a.ahorroIntereses))}</div></div>
                        <div title="Intereses ahorrados en euros de hoy, descontando la inflación proyectada">
                          <div class="stat-label">Ahorro intereses <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num pos" style="color:var(--yellow)">${m(F(l))}</div>
                        </div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(F(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--text3)">(nominal)</span></div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${m(F(a.ahorroNeto))}</div></div>
                        <div title="Ahorro neto en euros de hoy">
                          <div class="stat-label">Ahorro neto <span style="font-size:10px;color:var(--yellow)">real (€ hoy)</span></div>
                          <div class="num ${(u??0)>=0?"pos":"neg"}" style="color:var(--yellow)">${m(F(u??0))}</div>
                        </div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>
                      <div style="font-size:10px;color:var(--text3);margin-top:4px">Real = euros de hoy descontando una inflación media del ${i.toFixed(1)}% anual</div>`:`<div class="grid-4" style="gap:8px">
                        <div><div class="stat-label">Ahorro intereses</div><div class="num pos">${m(F(a.ahorroIntereses))}</div></div>
                        <div><div class="stat-label">Coste amortizaciones</div><div class="num neg">${m(F(a.costeTotalAmort))}</div></div>
                        <div><div class="stat-label">Ahorro neto</div><div class="num ${a.ahorroNeto>=0?"pos":"neg"}">${m(F(a.ahorroNeto))}</div></div>
                        <div><div class="stat-label">Plazo acortado</div><div class="num pos">${a.ahorroTiempo>0?`${a.ahorroTiempo} meses`:"—"}</div></div>
                      </div>`}
             </div>`:""}

      ${d!==null?Cc(t,a.totalPagado,d,p):""}

      <div class="card-title">Cuadro de amortización</div>
      <div class="table-wrap"><table>
        <thead><tr>
          <th>Mes</th><th>Fecha</th><th>Cuota</th><th>Intereses</th><th>Amort.</th><th>Cap. pendiente</th>
          ${n?'<th title="Valor de la cuota en euros de hoy descontando la inflación acumulada">Precio real (€ hoy)</th>':""}
          <th></th>
        </tr></thead>
        <tbody>${a.tabla.map(v=>Mc(v,n,e)).join("")}</tbody>
      </table></div>

      ${o?`<div class="card-title mt-12">Amortizaciones programadas</div>
             ${(t.amortizaciones||[]).map((v,g)=>Ec(t._id,v,c[g]??null)).join("")}`:""}
    </div>
  </div>`}function Cc(t,e,a,o){const s=t.tipoTasa==="variable"?'<div class="text-sm mt-8" style="color:var(--text3)">⚠ Tipo variable: el beneficio real dependerá de cómo evolucione el índice de referencia.</div>':"";if(o!==null){const r=o-a,c=r>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
      <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
      <div class="grid-3" style="gap:8px">
        <div><div class="stat-label">Real sin amortizar (€ hoy)</div><div class="num neg">${m(F(o))}</div></div>
        <div><div class="stat-label">Real con amortizar (€ hoy)</div><div class="num neg">${m(F(a))}</div></div>
        <div><div class="stat-label">${c?"Ahorro real neto":"Sobrecoste real neto"}</div>
             <div class="num ${c?"pos":"neg"}">${c?"−":"+"}${m(F(Math.abs(r)))}</div></div>
      </div>
      <div class="text-sm mt-4" style="color:var(--text3)">Comparación en euros de hoy: cuánto ahorran las amortizaciones en términos reales.</div>
      ${s}
    </div>`}const n=e-a,i=n>=0;return`<div class="card mb-12" style="background:var(--bg3);padding:12px">
    <div class="card-title" style="margin-bottom:8px;color:var(--yellow)">📉 Coste ajustado a inflación</div>
    <div class="grid-3" style="gap:8px">
      <div><div class="stat-label">Coste total nominal</div><div class="num neg">${m(F(e))}</div></div>
      <div><div class="stat-label">Coste total en € de hoy</div><div class="num ${i?"pos":"neg"}">${m(F(a))}</div></div>
      <div><div class="stat-label">${i?"Ahorro por inflación":"Sobrecoste real"}</div>
           <div class="num ${i?"pos":"neg"}">${i?"−":"+"}${m(F(Math.abs(n)))}</div></div>
    </div>
    ${s}
  </div>`}function Mc(t,e,a){let o="";if(e&&!t.esAmortizacion){const s=Ot(a.periodos,a.hoy,t.fecha);o=m(F(s>0?t.cuota/s:t.cuota))}return`<tr ${t.esAmortizacion?'style="background:var(--yellow-dim)"':""}>
    <td class="num">${t.esAmortizacion?"—":m(t.mes)}</td>
    <td class="num">${m(t.fecha)}</td>
    <td class="num">${t.esAmortizacion?"—":m(F(t.cuota))}</td>
    <td class="num ${t.interes>0?"neg":""}">${m(F(t.interes))}</td>
    <td class="num">${m(F(t.amortizacion))}</td>
    <td class="num">${m(F(t.capitalPendiente))}</td>
    ${e?`<td class="num pos" style="font-size:11px">${o}</td>`:""}
    <td>${t.esAmortizacion?`<span class="badge badge-sim">AMORT${t.simulacion?" SIM":""}</span>`:""}</td>
  </tr>`}function Ec(t,e,a){return`<div class="amort-item" style="flex-wrap:wrap">
    <span class="num">${m(e.fecha)}</span>
    <span class="num">${m(F(e.cantidad))}</span>
    <span class="badge ${e.simulacion?"badge-sim":"badge-active"}">${e.simulacion?"SIM":"REAL"}</span>
    <span class="badge badge-blue">${e.tipo==="plazo"?"↓ plazo":"↓ cuota"}</span>
    ${a?`<span style="font-size:11px;color:var(--text3);margin-left:4px" title="Ahorro de intereses atribuible a esta amortización">
             Ahorro: <span class="pos">${m(F(a.nominal))}</span> nominal
             · <span style="color:var(--yellow)">${m(F(a.real))} real</span>
           </span>`:""}
    <button class="btn-icon" data-duplicar-amort="${m(t)}|${m(e._id)}" title="Duplicar" aria-label="Duplicar amortización"><svg viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg></button>
    <button class="btn-icon" data-editar-amort="${m(t)}|${m(e._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
    <button class="btn-danger btn-sm" data-borrar-amort="${m(t)}|${m(e._id)}">✕</button>
  </div>`}const xt=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${m(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${m(o)}" placeholder="${m(s)}"/></div>`,Oe=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${m(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([s,n])=>`<option value="${m(s)}"${s===o?" selected":""}>${m(n)}</option>`).join("")}
   </select></div>`,Be=(t,e,a,o="")=>`<label class="form-label">${m(e)}</label>
   <label class="toggle"><input type="checkbox" id="${t}"${a?" checked":""}/><span class="toggle-slider"></span></label>
   ${o?`<span class="text-sm" style="margin-left:6px">${m(o)}</span>`:""}`,Ac=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${m(a._id)}"${a._id===e?" selected":""}>${m(a.nombre)}</option>`).join("");function Pc(t,e,a,o=ot()){return`
    <div class="grid-2">
      ${xt("f-nombre","Nombre del préstamo","text",(t==null?void 0:t.nombre)??"","Ej: Hipoteca ING")}
      ${xt("f-capital","Importe pendiente (€)","number",(t==null?void 0:t.capital)??"","150000")}
    </div>
    <div class="grid-3 mt-8">
      ${xt("f-tin","Tipo de interés TIN (%)","number",(t==null?void 0:t.tin)??"","2.5")}
      ${xt("f-meses","Plazo (meses)","number",(t==null?void 0:t.meses)??"","360")}
      ${xt("f-fecha","Fecha de inicio","date",(t==null?void 0:t.fechaInicio)??o)}
    </div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          <div class="form-group"><label class="form-label">Cuenta bancaria</label>
            <select class="form-select" id="f-cuenta">${Ac(e,(t==null?void 0:t.cuenta)??"default")}</select></div>
          ${Rs(t==null?void 0:t.diaPago,"loan")}
        </div>
        <div class="mt-8">
          ${Oe("f-tipo-tasa","Tipo de interés",[["fijo","Tipo fijo — la cuota no varía"],["variable","Tipo variable — la cuota puede cambiar con el mercado"]],(t==null?void 0:t.tipoTasa)??"fijo")}
        </div>
        <div class="grid-2 mt-8">
          ${xt("f-com-ap","Com. apertura (%)","number",(t==null?void 0:t.comisionApertura)??0,"1")}
          ${xt("f-com-am","Com. amort. anticipada (%)","number",(t==null?void 0:t.comisionAmort)??0,"0.5")}
        </div>
        <div class="form-group mt-8">
          <label class="form-label">Etiquetas (separadas por coma)</label>
          <input class="form-input" type="text" id="f-tags" value="${m(((t==null?void 0:t.tags)??[]).join(", "))}" placeholder="hipoteca, vivienda"/>
        </div>
        <div class="form-row mt-8">
          ${Be("f-basico","Gasto básico",(t==null?void 0:t.basico)!==!1,"Incluir la cuota en el cálculo del colchón económico")}
        </div>
        ${$e("Reparto de consumo",t==null?void 0:t.repartoConsumo,a,"consumo")}
        ${$e("Reparto de pago",t==null?void 0:t.repartoPago,a,"pago")}
        <div class="form-row mt-8" style="flex-wrap:wrap;row-gap:6px">
          ${Be("f-activo","Activo",(t==null?void 0:t.activo)!==!1)}
          <span style="margin-left:12px"></span>
          ${Be("f-sim","Simulación",!!(t!=null&&t.simulacion))}
          <span style="margin-left:12px"></span>
          ${Be("f-mostrar-fin","Mostrar fin en dashboard",(t==null?void 0:t.mostrarFechaFinEnDashboard)!==!1)}
        </div>
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-loan="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function _c(t,e,a=ot()){return`
    <div class="grid-2">
      ${xt("am-fecha","Fecha","date",(e==null?void 0:e.fecha)??a)}
      ${xt("am-cant","Cantidad (€)","number",(e==null?void 0:e.cantidad)??"","10000")}
    </div>
    <div class="mt-8">
      ${Oe("am-tipo","Efecto",[["cuota","Reducir cuota (mantener plazo)"],["plazo","Reducir plazo (mantener cuota)"]],(e==null?void 0:e.tipo)??"cuota")}
    </div>
    <div class="form-row mt-8">
      ${Be("am-sim","Simulación",!!(e!=null&&e.simulacion))}
    </div>
    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-amort="${m(t)}|${m((e==null?void 0:e._id)??"")}">${e!=null&&e._id?"Guardar cambios":"Añadir"}</button>
    </div>`}const Fc="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function Dc(t){const e=t.hoy??ot;let a=!1;const o=new Set;let s=null;const n=()=>{var E;return(E=t.onDatosCambiados)==null?void 0:E.call(t)};function i(E){const M=E.filter(x=>x.activo);if(M.length<2)return"";const w=(x,_)=>`<button class="btn-secondary btn-sm" data-persona-tab="${x===null?"":m(x)}"
               style="${s===x?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(_)}</button>`;return`<div class="flex gap-6 mb-8 flex-wrap">
      ${w(null,"Todas")}
      ${M.map(x=>w(x._id,x.nombre)).join("")}
    </div>`}function r(E){if(!E.activo||E.simulacion)return!1;const M=vt(E).tabla.filter(w=>!w.esAmortizacion);return M.length===0?!0:M[M.length-1].fecha<e()}function c(E,M){const w=e(),x=w.slice(0,7),_=new Map;let A=0;for(const P of E){if(!P.activo||P.simulacion||M.has(P._id)||(P.fechaInicio||"")>w)continue;const $=vt(P).tabla.filter(D=>!D.esAmortizacion&&D.fecha.startsWith(x)),T=$.length>0?$[0].cuota:0;_.set(P._id,T),A+=T}return{porLoan:_,total:A,activos:[..._.values()].filter(P=>P>0).length}}function l(E){const M=e().slice(0,7),w=[];for(const x of E){if(!x.activo||x.simulacion)continue;const _=vt(x).tabla.filter(P=>!P.esAmortizacion),A=_[_.length-1];A&&A.fecha.slice(0,7)===M&&w.push({loan:x,cuota:A.cuota})}return w}function u(E){return E.length<=1?E[0]??"":`${E.slice(0,-1).join(", ")} y ${E[E.length-1]}`}function d(E){const M=t.store.get("config"),w=M.dashboardStart,x=M.dashboardEnd,_=Math.max(1,(K(x).getTime()-K(w).getTime())/(30.44*864e5));let A=0;for(const P of E)!P.activo||P.simulacion||(A+=vt(P).tabla.filter($=>!$.esAmortizacion&&$.fecha>=w&&$.fecha<=x).reduce(($,T)=>$+T.cuota,0));return{media:A/_,desde:w,hasta:x}}function p(E){const M=t.store.get("personas"),w=We(M),x=[...t.store.get("loans")].sort((H,j)=>j.tin-H.tin),_=s?x.filter(H=>Ia(H.repartoConsumo,H.repartoPago,w).has(s)):x,A=new Set(_.filter(r).map(H=>H._id)),P=a?_:_.filter(H=>!A.has(H._id)),$=c(x,new Set(x.filter(r).map(H=>H._id))),T=d(x),D=l(x),z=t.store.get("config"),k=t.store.get("inflacion"),V=new Date(K(e())).toLocaleDateString("es-ES",{month:"long",year:"numeric"});E.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Mis <span>Préstamos</span></h1>
        <div class="page-actions">
          ${A.size>0?`<button class="btn-secondary btn-sm" data-toggle-finalizados>${a?"Ocultar":"Mostrar"} finalizados (${A.size})</button>`:""}
          <button class="btn-primary" data-nuevo-loan>+ Nuevo préstamo</button>
        </div>
      </div>
      ${i(M)}
      ${D.length>0?`<div class="card mb-14" style="padding:12px 16px;background:rgba(46,230,168,0.07);border:1px solid rgba(46,230,168,0.25)">
               <div style="display:flex;gap:10px;align-items:flex-start">
                 <span style="font-size:16px">🎉</span>
                 <div style="font-size:13px;color:var(--text)">
                   Este mes se ${D.length===1?"acaba":"acaban"} ${m(u(D.map(H=>H.loan.nombre)))}
                   — te liberará <strong style="color:var(--accent)">${m(F(D.reduce((H,j)=>H+j.cuota,0)))}</strong> de cuotas para el mes que viene.
                 </div>
               </div>
             </div>`:""}
      ${$.total>0||T.media>.01?`<div class="card mb-14" style="padding:14px 18px">
               <div class="flex gap-24 items-center flex-wrap">
                 ${$.total>0?`<div>
                          <div class="stat-label">Cuotas este mes (${m(V)})</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text);margin-top:2px">${m(F($.total))}</div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${$.activos} préstamo${$.activos!==1?"s":""} activo${$.activos!==1?"s":""} este mes</div>
                        </div>`:""}
                 ${T.media>.01?`<div>
                          <div class="stat-label">Cuota media del período</div>
                          <div style="font-family:var(--font-mono);font-size:24px;font-weight:700;color:var(--text2);margin-top:2px">${m(F(T.media))}<span style="font-size:13px;font-weight:400;color:var(--text3);margin-left:4px">/mes</span></div>
                          <div class="text-sm" style="color:var(--text3);margin-top:2px">${m(T.desde)} → ${m(T.hasta)}</div>
                        </div>`:""}
               </div>
             </div>`:""}
      <div id="loans-list">
        ${P.length===0?'<div class="text-sm" style="text-align:center;padding:40px 0">Sin préstamos.</div>':P.map(H=>Sc(H,{periodos:k,usarInflacion:!!z.usarInflacion,hoy:e(),cuotaMes:$.porLoan.get(H._id)??0,completado:A.has(H._id),personas:M})).join("")}
      </div>`;for(const H of E.querySelectorAll("[data-body-loan]"))o.has(H.dataset.bodyLoan??"")&&H.classList.add("open")}const v=()=>document.getElementById("modal-overlay"),g=()=>zt(),b=()=>{var E;return(E=v())==null?void 0:E.classList.add("hidden")};function y(E,M){const w=v(),x=g();return!w||!x?null:(x.innerHTML=`<div class="modal-title">${m(E)}</div>${M}`,w.classList.remove("hidden"),L(x,"[data-cancelar]",b),x)}function f(E,M){const w=E?t.store.get("loans").find(_=>_._id===E)??null:null,x=y(E?"Editar préstamo":"Nuevo préstamo",Pc(w,t.store.get("accounts"),t.store.get("personas"),e()));x&&(x.addEventListener("change",_=>{const A=_.target;A!=null&&A.matches("[data-dp-modo]")&&ks(x),A!=null&&A.matches('[data-reparto-modo="consumo"]')&&xe(x,"consumo"),A!=null&&A.matches('[data-reparto-modo="pago"]')&&xe(x,"pago")}),L(x,"[data-guardar-loan]",_=>{h(x,_.getAttribute("data-guardar-loan")||"")&&(b(),M())}))}function h(E,M){const w=D=>{var z;return((z=E.querySelector(D))==null?void 0:z.value)??""},x=D=>{var z;return!!((z=E.querySelector(D))!=null&&z.checked)},_=w("#f-nombre").trim(),A=parseFloat(w("#f-capital")),P=parseFloat(w("#f-tin")),$=parseInt(w("#f-meses"),10);if(!_||!Number.isFinite(A)||!Number.isFinite(P)||!Number.isFinite($))return G("Completa los campos obligatorios","err"),!1;const T={nombre:_,capital:A,tin:P,meses:$,fechaInicio:w("#f-fecha"),comisionApertura:parseFloat(w("#f-com-ap"))||0,comisionAmort:parseFloat(w("#f-com-am"))||0,diaPago:Ls(E),cuenta:w("#f-cuenta"),simulacion:x("#f-sim"),activo:x("#f-activo"),mostrarFechaFinEnDashboard:x("#f-mostrar-fin"),tipoTasa:w("#f-tipo-tasa"),basico:x("#f-basico"),tags:w("#f-tags").split(",").map(D=>D.trim()).filter(Boolean),repartoConsumo:Ie(E,"consumo"),repartoPago:Ie(E,"pago")};return M?(t.store.updateItem("loans",M,T),G("Préstamo actualizado")):(t.store.addItem("loans",{...T,amortizaciones:[]}),G("Préstamo creado")),n(),!0}function C(E,M,w,{duplicar:x=!1}={}){const _=t.store.get("loans").find(D=>D._id===E);if(!_)return;const A=M?(_.amortizaciones||[]).find(D=>D._id===M)??null:null;if(x&&!A)return;const P=x&&A?{...A,_id:""}:A,T=y(x?"Duplicar amortización":M?"Editar amortización":"Añadir amortización",_c(E,P,e()));T&&L(T,"[data-guardar-amort]",D=>{const[z,k]=(D.getAttribute("data-guardar-amort")||"").split("|");S(T,z,k)&&(b(),w([z]))})}function S(E,M,w){var z;const x=k=>{var V;return((V=E.querySelector(k))==null?void 0:V.value)??""},_=x("#am-fecha"),A=parseFloat(x("#am-cant"));if(!_||!Number.isFinite(A)||A<=0)return G("Fecha y cantidad requeridas","err"),!1;const P=t.store.get("loans").find(k=>k._id===M);if(!P)return!1;const $={fecha:_,cantidad:A,tipo:x("#am-tipo"),simulacion:!!((z=E.querySelector("#am-sim"))!=null&&z.checked)},T=P.amortizaciones||[],D=w?T.map(k=>k._id===w?{...k,...$}:k):[...T,{_id:Date.now().toString(36),...$}];return t.store.updateItem("loans",M,{amortizaciones:D}),G(w?"Amortización actualizada":"Amortización añadida"),n(),!0}function I(E,M){L(E,"[data-toggle-finalizados]",()=>{a=!a,M()}),L(E,"[data-persona-tab]",w=>{s=w.getAttribute("data-persona-tab")||null,M()}),L(E,"[data-nuevo-loan]",()=>f(null,M)),L(E,"[data-toggle-loan]",(w,x)=>{var $;if(($=x.target)!=null&&$.closest("button"))return;const _=w.getAttribute("data-toggle-loan"),A=[...E.querySelectorAll("[data-body-loan]")].find(T=>T.dataset.bodyLoan===_);(A==null?void 0:A.classList.toggle("open"))?o.add(_):o.delete(_)}),L(E,"[data-editar-loan]",w=>f(w.getAttribute("data-editar-loan"),M)),L(E,"[data-borrar-loan]",w=>{if(!$t("¿Eliminar préstamo?"))return;const x=w.getAttribute("data-borrar-loan");t.store.removeItem("loans",x),o.delete(x),G("Eliminado"),n(),M()}),L(E,"[data-amort-loan]",w=>{const x=w.getAttribute("data-amort-loan");o.add(x),C(x,null,M)}),L(E,"[data-duplicar-amort]",w=>{const[x,_]=(w.getAttribute("data-duplicar-amort")||"").split("|");o.add(x),C(x,_,M,{duplicar:!0})}),L(E,"[data-editar-amort]",w=>{const[x,_]=(w.getAttribute("data-editar-amort")||"").split("|");o.add(x),C(x,_,M)}),L(E,"[data-borrar-amort]",w=>{const[x,_]=(w.getAttribute("data-borrar-amort")||"").split("|"),A=t.store.get("loans").find(P=>P._id===x);A&&(t.store.updateItem("loans",x,{amortizaciones:(A.amortizaciones||[]).filter(P=>P._id!==_)}),G("Amortización eliminada"),n(),M([x]))})}return{id:"loans",route:"loans",nombre:"Préstamos",flagId:"loans",seccion:1,iconoPath:Fc,mount(E){const M=(w=[])=>{for(const x of w)o.add(x);p(E)};p(E),E.dataset.wired!=="1"&&(I(E,M),E.dataset.wired="1")}}}const Za=6.35;function we(t){return(t.retribucionFlexible||[]).reduce((e,a)=>e+(a.importe||0)*12,0)}function Hs(t){return Math.max(0,(t.bruto||0)-we(t))}function Tc(t){return[...t].sort((e,a)=>(a.bruto||0)-(e.bruto||0)||String(e._id).localeCompare(String(a._id)))}function zc(t){const e=t.reduce((i,r)=>i+(r.bruto||0),0),a=t.reduce((i,r)=>i+we(r),0),o=Math.max(0,e-a),s=Gt(e,a),n=new Map;for(const i of t)n.set(i._id,o>0?s*(Hs(i)/o):0);return n}function Gs(t,e,a){if(t.irpfModo==="manual")return Hs(t)*((t.irpfPct||0)/100);if(!e||e.length===0)return Pt(Gt(t.bruto||0,we(t)),a);const o=Tc(e.filter(i=>i.irpfModo!=="manual")),s=zc(e);let n=0;for(const i of o){const r=s.get(i._id)??0;if(i._id===t._id)return Pt(n+r,a)-Pt(n,a);n+=r}return Pt(Gt(t.bruto||0,we(t)),a)}function jc(t,e){return t.reduce((a,o)=>a+Gs(o,t,e),0)}function qc(t,e){var s;const a=[...e||[]].sort((n,i)=>n[0]-i[0]);let o=((s=a[0])==null?void 0:s[1])??19;for(const[n,i]of a)if(t>=n)o=i;else break;return o}function Nc(t,e){if(!t||t.length===0)return 0;const a=t.reduce((s,n)=>s+(n.bruto||0),0),o=t.reduce((s,n)=>s+we(n),0);return qc(Gt(a,o),e)}function Rc(t,e,a){const o=t.bruto||0,s=we(t),n=Math.max(0,o-s),i=t.nPagas||12,r=t.ssPct??Za,c=n*(r/100),l=Gs(t,e,a);return{brutoAnual:o,flexAnual:s,baseDineraria:n,nPagas:i,ssPct:r,ssAnual:c,irpfAnual:l,irpfPct:n>0?l/n*100:0,netoPorPaga:(n-c-l)/i}}function kc(t){const e=new Map,a=[];for(const o of t){const s=o.grupoNomina||"";if(!s){a.push(o);continue}const n=e.get(s)??[];n.push(o),e.set(s,n)}return{grupos:e,sueltas:a}}const Lc={transporte:125,restaurante:220,otros:null},Oc={transporte:"Transporte",restaurante:"Restaurante",otros:"Otros"},Bc=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],Se=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${m(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${m(o)}" placeholder="${m(s)}"/></div>`,Hc=(t,e)=>t.filter(a=>a.activo!==!1).map(a=>`<option value="${m(a._id)}"${a._id===e?" selected":""}>${m(a.nombre)}</option>`).join("");function Gc(t,e){const a=t.map((n,i)=>{const r=e.find(u=>u._id===n.cuenta),c=Lc[n.tipo],l=c!=null&&n.importe>c;return`<div class="flex gap-8 items-center" style="padding:5px 0;border-bottom:1px solid var(--border)">
        <span class="badge badge-blue" style="min-width:88px;text-align:center">${m(Oc[n.tipo]??n.tipo)}</span>
        <span style="flex:1;font-size:12px">${m(F(n.importe))}/mes${l?` <span style="color:var(--red)" title="Supera el límite orientativo de ${m(F(c))}/mes">⚠</span>`:""}</span>
        <span style="font-size:11px;color:var(--text3);min-width:120px">${r?m(r.nombre):'<span style="color:var(--yellow)">Sin cuenta</span>'}</span>
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
        ${o.map(n=>`<option value="${m(n._id)}">${m(n.nombre)}${(n.modeloFondo||"cuenta")==="beneficio"?" ★":""}</option>`).join("")}
      </select>
    </div>
    ${s.length===0?'<div class="text-sm mt-4" style="color:var(--text3)">Tip: crea una cuenta de tipo "Tarjeta beneficio" en <em>Cuentas y Ahorro</em> para vincularla aquí (★).</div>':""}
    <button class="btn-secondary btn-sm mt-6" data-flex-anadir>+ Añadir componente</button>`}function Vc(t,e){const a=e.hoy??ot(),o=(t==null?void 0:t.nPagas)??12,s=[12,14,16].includes(o);return`
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
        <select class="form-select" id="nf-cuenta">${Hc(e.accounts,(t==null?void 0:t.cuenta)??e.cuentaPrincipal)}</select></div>
    </div>
    <div id="nf-preview" class="card mt-12" style="background:var(--surface2);padding:12px;font-size:13px"></div>

    <details class="form-advanced mt-12"${t!=null&&t._id?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="grid-2 mt-8">
          ${Se("nf-fecha-ini","Fecha inicio","date",(t==null?void 0:t.fechaInicio)??a)}
          ${Se("nf-fecha-fin","Fecha fin (opcional)","date",(t==null?void 0:t.fechaFin)??"")}
        </div>
        <div class="grid-2 mt-8">
          ${Se("nf-grupo","Grupo (opcional)","text",(t==null?void 0:t.grupoNomina)??"","Ej: Empresa principal")}
          <div class="form-group"><label class="form-label">Mes actualización IPC (opcional)</label>
            <select class="form-select" id="nf-mes-ipc">
              <option value="">Sin ajuste IPC</option>
              ${Bc.map((n,i)=>`<option value="${i+1}"${(t==null?void 0:t.mesActualizacionIPC)===i+1?" selected":""}>${m(n)} (${i+1})</option>`).join("")}
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
        ${$e("Reparto de consumo",t==null?void 0:t.repartoConsumo,e.personas,"consumo")}
        ${$e("Reparto de pago",t==null?void 0:t.repartoPago,e.personas,"pago")}
      </div>
    </details>

    <div class="flex gap-8 mt-16" style="justify-content:flex-end">
      <button class="btn-secondary" data-cancelar>Cancelar</button>
      <button class="btn-primary" data-guardar-nomina="${m((t==null?void 0:t._id)??"")}">Guardar</button>
    </div>`}function Vs(t,e){const a=i=>{var r;return((r=t.querySelector(i))==null?void 0:r.value)??""},o=(i,r=0)=>{const c=parseFloat(a(i));return Number.isFinite(c)?c:r},s=a("#nf-npagas"),n=s==="custom"?parseInt(a("#nf-npagas-custom"),10)||12:parseInt(s,10)||12;return{nombre:a("#nf-nombre").trim(),bruto:o("#nf-bruto"),nPagas:n,irpfModo:a("#nf-irpfmodo")||"auto",irpfPct:o("#nf-irpfpct"),ssPct:o("#nf-sspct",Za),representacion:a("#nf-representacion")||"detallado",fechaInicio:a("#nf-fecha-ini"),fechaFin:a("#nf-fecha-fin")||null,cuenta:a("#nf-cuenta"),grupoNomina:a("#nf-grupo").trim(),mesActualizacionIPC:parseInt(a("#nf-mes-ipc"),10)||null,retribucionFlexible:e,repartoConsumo:Ie(t,"consumo"),repartoPago:Ie(t,"pago")}}function Uc(t,e,a,o){const s=Vs(t,e),n=e.reduce((f,h)=>f+(h.importe||0)*12,0),i=Math.max(0,s.bruto-n),r=i*(s.ssPct/100),c=s.irpfModo==="manual"?i*(s.irpfPct/100):Pt(Gt(s.bruto,n),a.tramos),l=i-r-c,u=i/s.nPagas,d=r/s.nPagas,p=c/s.nPagas,v=u-d-p,g=s.grupoNomina?a.nominas.filter(f=>f.grupoNomina===s.grupoNomina&&f._id!==o):[],b=g.length>0?`<div style="margin-top:6px;color:var(--yellow);font-size:11px">⚡ En el grupo "${m(s.grupoNomina)}" con ${m(g.map(f=>f.nombre).join(", "))} — el IRPF final se calculará al tipo marginal del grupo.</div>`:"",y=n>0?`<span style="color:var(--text2)">Retrib. flexible:</span><span style="color:var(--accent)">-${m(F(n))}/año (exento IRPF y SS)</span>
         <span style="color:var(--text2)">Base dineraria:</span><span>${m(F(i))}</span>`:"";return`<strong>Vista previa</strong>
    <div style="margin-top:8px;display:grid;grid-template-columns:1fr 1fr;gap:4px">
      <span style="color:var(--text2)">Bruto total:</span><span>${m(F(s.bruto))}</span>
      ${y}
      <span style="color:var(--text2)">SS empleado:</span><span class="neg">-${m(F(r))} (${s.ssPct.toFixed(2)}%)</span>
      <span style="color:var(--text2)">IRPF anual:</span><span class="neg">-${m(F(c))} (${i>0?(c/i*100).toFixed(1):"0"}%)</span>
      <span style="color:var(--text2)">Neto dinerario:</span><span class="pos">${m(F(l))}</span>
      ${n>0?`<span style="color:var(--text2)">+ Beneficios especie:</span><span style="color:var(--accent)">${m(F(n))}</span>`:""}
      <span style="color:var(--text2)">Neto/paga:</span><span style="font-weight:600">${m(F(v))}</span>
      <span style="color:var(--text2)">En predicciones:</span><span style="font-size:11px">${s.representacion==="simplificado"?`ingreso ${m(F(v))}/paga`:`ingreso ${m(F(u))} − SS ${m(F(d))} − IRPF ${m(F(p))}`}${n>0?" + recargas flex":""}</span>
    </div>${b}`}function Yc(t,e,a,o){const s=()=>{const r=t.querySelector("#flex-comp-container");r&&(r.innerHTML=Gc(e,a.accounts))},n=()=>{const r=t.querySelector("#nf-preview");r&&(r.innerHTML=Uc(t,e,a,o))},i=()=>{var c,l;const r=(u,d)=>{const p=t.querySelector(u);p&&(p.style.display=d?"":"none")};r("#nf-custom-pagas-wrap",((c=t.querySelector("#nf-npagas"))==null?void 0:c.value)==="custom"),r("#nf-irpfpct-wrap",((l=t.querySelector("#nf-irpfmodo"))==null?void 0:l.value)==="manual"),n()};t.addEventListener("input",r=>{var c;(c=r.target)!=null&&c.closest("#nf-bruto, #nf-irpfpct, #nf-npagas-custom, #nf-grupo, #nf-sspct")&&n()}),tt(t,"#nf-npagas, #nf-irpfmodo, #nf-representacion",i),tt(t,'[data-reparto-modo="consumo"]',()=>xe(t,"consumo")),tt(t,'[data-reparto-modo="pago"]',()=>xe(t,"pago")),L(t,"[data-flex-anadir]",()=>{var l,u,d;const r=((l=t.querySelector("#fc-tipo"))==null?void 0:l.value)||"transporte",c=parseFloat(((u=t.querySelector("#fc-importe"))==null?void 0:u.value)??"")||0;if(!c)return G("Importe requerido","err");e.push({_id:Date.now().toString(36),tipo:r,importe:c,cuenta:((d=t.querySelector("#fc-cuenta"))==null?void 0:d.value)||""}),s(),n()}),L(t,"[data-flex-borrar]",r=>{e.splice(Number(r.getAttribute("data-flex-borrar")),1),s(),n()}),s(),n()}const Us=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function Wc(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),s=()=>zt(),n=()=>{var p;return(p=o())==null?void 0:p.classList.add("hidden")},i=()=>t.store.get("config").tramos_irpf??Ht;function r(p,v){const g=o(),b=s();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${m(p)}</div>${v}`,g.classList.remove("hidden"),L(b,"[data-cerrar]",n),b)}function c(){e=null;const p=[...t.store.get("tramosIRPFHistorico")].sort((b,y)=>b.año-y.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos IRPF por ejercicio",`
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
          <span class="text-sm" style="color:var(--text2)">${m(Us(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tabla="default">Editar</button>
        </div>
        ${p.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(Us(b.tramos))}</span>
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
      </div>`);g&&(L(g,"[data-editar-tabla]",b=>{const y=b.getAttribute("data-editar-tabla");d(y==="default"?"default":Number(y))}),L(g,"[data-borrar-tabla]",b=>{const y=Number(b.getAttribute("data-borrar-tabla"));$t(`¿Eliminar la tabla del ejercicio ${y}?`)&&(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").filter(f=>f.año!==y)),G(`Tabla ${y} eliminada`),t.onDatosCambiados(),c())}),L(g,"[data-anadir-anyo]",()=>{var f;const b=parseInt(((f=g.querySelector("#irpf-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return G("Año inválido","err");const y=t.store.get("tramosIRPFHistorico");if(y.some(h=>h.año===b))return G("Ya existe una tabla para ese año","err");t.store.set("tramosIRPFHistorico",[...y,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function l(){return a.map(([p,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tr-min="${g}" value="${p}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tr-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tr-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function u(p){a=[...p.querySelectorAll("[data-tr-min]")].map((g,b)=>{const y=p.querySelector(`[data-tr-pct="${b}"]`);return[parseFloat(g.value)||0,parseFloat((y==null?void 0:y.value)??"")||0]})}function d(p){var h;e=p;const v=t.store.get("tramosIRPFHistorico");a=(p==="default"?i():((h=v.find(C=>C.año===p))==null?void 0:h.tramos)??i()).map(C=>[...C]);const b=p==="default"?"tabla por defecto":`ejercicio ${p}`,y=r(`Tramos IRPF — ${p==="default"?"Por defecto":p}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Tramos marginales IRPF — ${m(b)}. Orden ascendente por base imponible.</div>
      <div id="irpf-tramos-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tr-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver>Cancelar</button>
        <button class="btn-primary" data-tr-guardar>Guardar</button>
      </div>`);if(!y)return;const f=()=>{const C=y.querySelector("#irpf-tramos-rows");C&&(C.innerHTML=l())};L(y,"[data-volver]",c),L(y,"[data-tr-anadir]",()=>{u(y),a.push([0,0]),f()}),L(y,"[data-tr-borrar]",C=>{u(y),a.splice(Number(C.getAttribute("data-tr-borrar")),1),f()}),L(y,"[data-tr-guardar]",()=>{u(y);const C=[...a].sort((S,I)=>S[0]-I[0]);if(C.length===0)return G("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramos_irpf:C}),G("Tabla por defecto guardada")):(t.store.set("tramosIRPFHistorico",t.store.get("tramosIRPFHistorico").map(S=>S.año===e?{...S,tramos:C}:S)),G(`Tabla ${e} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const Ys=1500,ae=(t,e,a,o,s="")=>`<div class="form-group"><label class="form-label">${m(e)}</label>
   <input class="form-input" type="${a}" id="${t}" value="${m(o)}" placeholder="${m(s)}"/></div>`,Kc=(t,e,a,o)=>`<div class="form-group"><label class="form-label">${m(e)}</label>
   <select class="form-select" id="${t}">
     ${a.map(([s,n])=>`<option value="${m(s)}"${s===o?" selected":""}>${m(n)}</option>`).join("")}
   </select></div>`,Jc=t=>(t.modeloFondo||"cuenta")==="pension";function Xc(t,e,a,o){return t.length===0?`<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">
      Sin planes de pensiones. Crea uno con el botón "+ Nuevo plan de pensiones".
    </div>`:`<div class="grid-3">${t.map(s=>Qc(s,e,a,o)).join("")}</div>`}function Qc(t,e,a,o){const s=Sa(t);if(!s)return"";const n=Ca(t,e,a),i=o.slice(0,4),r=(t.aportaciones||[]).filter(l=>l.fecha>=`${i}-01-01`).reduce((l,u)=>l+u.cantidad,0),c=Math.min(r,Ys)*(n/100);return`<div class="card">
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
      <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value">${m(F(s.saldo))}</div></div>
      <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(F(s.costBase))}</div></div>
    </div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Revalorización</span><span class="num ${s.beneficio>=0?"pos":"neg"}">${m(F(s.beneficio))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(F(s.disponible))}</span></div>
    <div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(F(s.bloqueado))}</span></div>
    <div style="margin-top:10px;padding:8px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border)">
      <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Año ${m(i)}</div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Aportado</span><span class="num ${r>Ys?"neg":""}">${m(F(r))}</span></div>
      <div class="flex justify-between mb-4"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF est.</span><span class="num pos">${m(F(c))}</span></div>
    </div>
    <div style="margin-top:6px;font-size:11px;color:var(--text3)">${t.grupoNomina?`Tipo marginal grupo "${m(t.grupoNomina)}": ${n}%`:`Tipo fijo configurado: ${t.impuestoRetirada||0}%`}</div>
    ${s.proxDesbloqueo?`<div style="font-size:11px;color:var(--text3)">Próx. desbloqueo: ${m(s.proxDesbloqueo)}</div>`:""}
  </div>`}function Zc(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${m(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${m(F(a.importe))} / ${m(a.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${m(a.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function tl(t,e){const a=[...(t==null?void 0:t.historicoSaldos)??[]].sort((i,r)=>r.fecha.localeCompare(i.fecha)),o=a[0]?a[0].saldo:(t==null?void 0:t.saldo)??0,s=[...new Set(e.nominas.filter(i=>i.grupoNomina).map(i=>i.grupoNomina))],n=!!(t!=null&&t.grupoNomina);return`
    <div class="grid-2">
      ${ae("pen-nombre","Nombre del plan","text",(t==null?void 0:t.nombre)??"","Ej: Plan de Pensiones ING")}
      ${ae("pen-saldo","Saldo actual (€)","number",o,"5000")}
    </div>
    <div class="auth-hint mt-8">Cambiar el saldo añade un punto al histórico con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${ae("pen-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"0")}
      ${ae("pen-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="grid-2 mt-8">
      ${ae("pen-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"4")}
      ${Kc("pen-periodo","Capitalización",[["diario","Diario"],["mensual","Mensual"],["anual","Anual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
    </div>
    <div class="grid-2 mt-8">
      ${ae("pen-bloqueo","Bloqueo (meses)","number",(t==null?void 0:t.bloqueoMeses)??120,"120")}
      <div id="pen-impuesto-wrap"${n?' style="display:none"':""}>
        ${ae("pen-impuesto","% impuesto retirada (fijo)","number",(t==null?void 0:t.impuestoRetirada)??0,"24")}
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
    </div>`}function el(t,e,a){const o=()=>{const s=t.querySelector("#pen-aport-container");s&&(s.innerHTML=Zc(e))};tt(t,"#pen-grupo",s=>{const n=t.querySelector("#pen-impuesto-wrap");n&&(n.style.display=s.value?"none":"")}),L(t,"[data-aport-anadir]",()=>{var n,i,r,c;const s=parseFloat(((n=t.querySelector("#paport-importe"))==null?void 0:n.value)??"")||0;if(!s)return G("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#paport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#paport-inicio"))==null?void 0:r.value)||a,fechaFin:((c=t.querySelector("#paport-fin"))==null?void 0:c.value)||""}),o()}),L(t,"[data-aport-borrar]",s=>{e.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function al(t,e,a,o){var y;const s=f=>{var h;return((h=t.querySelector(f))==null?void 0:h.value)??""},n=(f,h=0)=>{const C=parseFloat(s(f));return Number.isFinite(C)?C:h},i=f=>{var h;return!!((h=t.querySelector(f))!=null&&h.checked)},r=s("#pen-nombre").trim();if(!r)return{datos:{},error:"Nombre obligatorio"};const c=n("#pen-saldo"),l=s("#pen-grupo"),u={nombre:r,grupoNomina:l,saldo:c,saldoInicial:n("#pen-saldo-ini"),fechaInicialSaldo:s("#pen-fecha-ini")||o,interes:n("#pen-interes"),periodoCobro:s("#pen-periodo")||"mensual",modeloFondo:"pension",bloqueoMeses:parseInt(s("#pen-bloqueo"),10)||120,impuestoRetirada:l?0:n("#pen-impuesto"),planAportaciones:e,descripcion:s("#pen-desc").trim(),activo:i("#pen-activo"),simulacion:i("#pen-sim")},d=[...(a==null?void 0:a.historicoSaldos)??[]],p=[...(a==null?void 0:a.aportaciones)??[]],g=((y=[...d].sort((f,h)=>h.fecha.localeCompare(f.fecha))[0])==null?void 0:y.saldo)??(a==null?void 0:a.saldo)??null,b=Date.now().toString(36);return a?(g===null||Math.abs(c-g)>.005)&&(d.push({_id:b,fecha:o,saldo:c,nota:"Actualización manual"}),c>(g??0)&&p.push({_id:`${b}a`,fecha:o,cantidad:c-(g??0)})):c>0&&(d.push({_id:b,fecha:o,saldo:c,nota:"Saldo inicial"}),p.push({_id:`${b}a`,fecha:u.fechaInicialSaldo??o,cantidad:c})),{datos:{...u,historicoSaldos:d,aportaciones:p}}}const ol="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5 0H9V4h6v2z";function sl(t){const e=t.hoy??ot,a=()=>{var h;return(h=t.onDatosCambiados)==null?void 0:h.call(t)};let o=null;function s(h){const C=h.filter(I=>I.activo);if(C.length<2)return"";const S=(I,E)=>`<button class="btn-secondary btn-sm" data-persona-tab="${I===null?"":m(I)}"
               style="${o===I?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${m(E)}</button>`;return`<div class="flex gap-6 mt-8 flex-wrap">
      ${S(null,"Todas")}
      ${C.map(I=>S(I._id,I.nombre)).join("")}
    </div>`}function n(){const h=t.store.get("config");return pe(t.store.get("tramosIRPFHistorico"),h.tramos_irpf??Ht)(Number(e().slice(0,4)))}function i(h,C,S){const I=Rc(h,C,S),E=!!C&&h.irpfModo!=="manual",M=Xa(h.repartoConsumo,h.repartoPago,t.store.get("personas")),w=[h.mesActualizacionIPC?`<span class="badge badge-blue" title="Actualización IPC en el mes ${h.mesActualizacionIPC}">IPC m${h.mesActualizacionIPC}</span>`:"",I.flexAnual>0?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0" title="Retribución flexible exenta de IRPF y SS">RF ${m(F(I.flexAnual))}/año</span>`:"",Math.abs(I.ssPct-6.35)>.01?`<span class="badge" style="background:rgba(255,200,80,0.12);color:var(--yellow)" title="Cotización SS del empleado personalizada">SS ${I.ssPct.toFixed(2)}%</span>`:"",M?`<span class="badge" style="background:rgba(139,92,246,0.12);color:#a78bfa" title="${m(M)}">👥 reparto</span>`:""].join("");return`<div class="exp-table-row">
      <div>
        <div style="font-weight:500">${m(h.nombre||"—")}</div>
        <div class="flex gap-4 mt-4 flex-wrap">${w}</div>
      </div>
      <div class="num">${m(F(I.brutoAnual))}
        ${I.flexAnual>0?`<div class="text-sm" style="color:var(--accent)">Diner. ${m(F(I.baseDineraria))}</div>`:""}
        <div class="text-sm" style="color:var(--text2)">${m(F(I.netoPorPaga))}</div>
        <div class="text-sm" style="color:var(--text3)">neto/paga</div></div>
      <div class="text-sm">${I.nPagas} pagas</div>
      <div class="text-sm ${E?"neg":""}">${h.irpfModo==="manual"?`${m(h.irpfPct??0)}% (manual)`:`${I.irpfPct.toFixed(1)}% (auto)`}${E?' <span title="Tipo marginal del grupo" style="font-size:10px;color:var(--text3)">marginal</span>':""}</div>
      <div>${h.representacion==="simplificado"?'<span class="badge badge-orange">Simplificado</span>':'<span class="badge badge-purple">Detallado</span>'}</div>
      <div class="text-sm exp-col-hide">${m(r(h.cuenta))}</div>
      <div class="flex gap-8 items-center">
        <label class="toggle"><input type="checkbox" data-activo-nom="${m(h._id)}"${h.activo!==!1?" checked":""}/><span class="toggle-slider"></span></label>
        <button class="btn-icon" data-editar-nom="${m(h._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
        <button class="btn-danger" data-borrar-nom="${m(h._id)}">✕</button>
      </div>
    </div>`}const r=h=>{var C;return((C=t.store.get("accounts").find(S=>S._id===(h||"default")))==null?void 0:C.nombre)??(h||"default")};function c(h,C,S){const I=C.reduce((w,x)=>w+(x.bruto||0),0),E=jc(C,S),M=I>0?E/I*100:0;return`<div style="margin-bottom:16px">
      <div class="exp-table-head" style="background:var(--surface2);padding:8px 12px;border-radius:var(--radius) var(--radius) 0 0;flex-wrap:wrap;gap:6px">
        <span style="font-weight:600;font-size:13px">Grupo: ${m(h)}</span>
        <span class="text-sm" style="color:var(--text2)">Bruto total: <strong>${m(F(I))}</strong></span>
        <span class="text-sm" style="color:var(--red)">IRPF efectivo: <strong>${M.toFixed(1)}%</strong> (${m(F(E))}/año)</span>
      </div>
      <div class="card" style="padding:0;overflow:hidden;border-radius:0 0 var(--radius) var(--radius)">
        ${C.map(w=>i(w,C,S)).join("")}
      </div>
    </div>`}function l(h){const C=n(),S=t.store.get("personas"),I=We(S),E=[...t.store.get("nominas")].sort((P,$)=>($.bruto||0)-(P.bruto||0)),M=o?E.filter(P=>Ia(P.repartoConsumo,P.repartoPago,I).has(o)):E,{grupos:w,sueltas:x}=kc(M),_=t.store.get("accounts").filter(Jc),A=E.filter(P=>P.activo!==!1);h.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Rendimientos <span>del Trabajo</span></h1>
        <div class="flex gap-8">
          <button class="btn-secondary" data-tramos>⚙ Tramos IRPF</button>
          <button class="btn-secondary" data-nueva-pension>+ Nuevo plan de pensiones</button>
          <button class="btn-primary" data-nueva-nomina>+ Nueva nómina</button>
        </div>
      </div>
      ${s(S)}
      ${t.store.get("inflacion").length>0?'<div class="auth-hint mt-8" style="font-size:12px">📈 Módulo de inflación activo — las nóminas con <em>Mes actualización IPC</em> se actualizarán anualmente según los datos de inflación configurados.</div>':""}
      ${M.length===0?'<div class="card text-sm" style="padding:24px;text-align:center;color:var(--text2)">Sin nóminas configuradas.</div>':""}
      ${[...w.entries()].map(([P,$])=>c(P,$,C)).join("")}
      ${x.length>0?`<div class="card" style="padding:0;overflow:hidden;margin-bottom:16px">
               <div class="exp-table-head">
                 <span class="exp-col-head">Concepto</span><span class="exp-col-head">Bruto anual</span>
                 <span class="exp-col-head">Pagas</span><span class="exp-col-head">IRPF efectivo</span>
                 <span class="exp-col-head">Modo</span><span class="exp-col-head exp-col-hide">Cuenta</span><span></span>
               </div>
               ${x.map(P=>i(P,null,C)).join("")}
             </div>`:""}

      <div class="page-header" style="margin-top:24px">
        <h2 class="page-title" style="font-size:1.1rem">Planes de <span>Pensiones</span></h2>
      </div>
      <div class="auth-hint mb-12" style="border-color:var(--yellow)">
        💼 El rescate tributa como <strong>rendimiento del trabajo</strong> (tramos IRPF generales).
        Asocia un plan a un grupo para que use el tipo marginal real del grupo.
      </div>
      <div>${Xc(_,A,C,e())}</div>`}const u=()=>document.getElementById("modal-overlay"),d=()=>zt(),p=()=>{var h;return(h=u())==null?void 0:h.classList.add("hidden")};function v(h,C){const S=u(),I=d();return!S||!I?null:(I.innerHTML=`<div class="modal-title">${m(h)}</div>${C}`,S.classList.remove("hidden"),L(I,"[data-cancelar]",p),I)}function g(h,C){const S=h?t.store.get("nominas").find(w=>w._id===h)??null:null,I=[...(S==null?void 0:S.retribucionFlexible)??[]].map(w=>({...w})),E={accounts:t.store.get("accounts"),nominas:t.store.get("nominas"),personas:t.store.get("personas"),cuentaPrincipal:t.store.getPrincipalAccountId(),tramos:n(),hoy:e()},M=v(h?"Editar nómina":"Nueva nómina",Vc(S,E));M&&(Yc(M,I,E,h??""),L(M,"[data-guardar-nomina]",w=>{const x=Vs(M,I);if(!x.nombre||x.bruto<=0)return G("Nombre y bruto anual son obligatorios","err");const _=w.getAttribute("data-guardar-nomina")||"",A={...x,activo:!0,tags:["nomina"]};_?(t.store.updateItem("nominas",_,A),G("Nómina actualizada")):(t.store.addItem("nominas",A),G("Nómina creada")),a(),p(),C()}))}function b(h,C){const S=h?t.store.get("accounts").find(M=>M._id===h)??null:null,I=[...(S==null?void 0:S.planAportaciones)??[]].map(M=>({...M})),E=v(h?"Editar plan de pensiones":"Nuevo plan de pensiones",tl(S,{nominas:t.store.get("nominas"),hoy:e()}));E&&(el(E,I,e()),L(E,"[data-guardar-pension]",M=>{const{datos:w,error:x}=al(E,I,S,e());if(x)return G(x,"err");const _=M.getAttribute("data-guardar-pension")||"";_?(t.store.updateItem("accounts",_,w),G("Plan actualizado")):(t.store.addItem("accounts",w),G("Plan creado")),a(),p(),C()}))}function y(h,C,S){L(h,"[data-persona-tab]",I=>{o=I.getAttribute("data-persona-tab")||null,C()}),L(h,"[data-nueva-nomina]",()=>g(null,C)),L(h,"[data-editar-nom]",I=>g(I.getAttribute("data-editar-nom"),C)),L(h,"[data-borrar-nom]",I=>{$t("¿Eliminar esta nómina?")&&(t.store.removeItem("nominas",I.getAttribute("data-borrar-nom")),G("Eliminada"),a(),C())}),tt(h,"[data-activo-nom]",I=>{const E=I;t.store.updateItem("nominas",E.getAttribute("data-activo-nom"),{activo:E.checked}),a(),C()}),L(h,"[data-tramos]",()=>S.abrir()),L(h,"[data-nueva-pension]",()=>b(null,C)),L(h,"[data-editar-pension]",I=>b(I.getAttribute("data-editar-pension"),C)),L(h,"[data-borrar-pension]",I=>{$t("¿Eliminar este plan de pensiones?")&&(t.store.removeItem("accounts",I.getAttribute("data-borrar-pension")),G("Plan eliminado"),a(),C())})}let f=null;return{id:"nominas",route:"nominas",nombre:"Nóminas",flagId:"nominas",seccion:1,iconoPath:ol,mount(h){const C=()=>l(h);f??(f=Wc({store:t.store,onDatosCambiados:()=>{a(),C()},año:()=>Number(e().slice(0,4))})),l(h),h.dataset.wired!=="1"&&(y(h,C,f),h.dataset.wired="1")}}}const nl="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",il="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z",Ws={transporte:{label:"Transporte",limiteAnual:1500},restaurante:{label:"Restaurante",limiteAnual:2640},otros:{label:"Otros",limiteAnual:null}},rl={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0};function cl(t,e){const a=t.filter(c=>c.activo&&Mt(c)==="inversion");if(a.length===0)return"";let o=0,s=0,n=0,i=0;for(const c of a){const l=Ke(c,e);l&&(o+=l.saldo,s+=l.costBase,n+=l.plusvalia,i+=l.impuesto)}const r=s>0?(n/s*100).toFixed(1):"0";return`
    <div class="card mb-14" style="border-color:rgba(16,185,129,0.3)">
      <div class="card-title" style="color:#10b981">Cartera — Fondos de Inversión</div>
      <div class="grid-4" style="gap:8px;margin-top:10px">
        <div class="stat-card"><div class="stat-label">Valor de mercado</div><div class="stat-value">${m(F(o))}</div></div>
        <div class="stat-card"><div class="stat-label">Coste base total</div><div class="stat-value">${m(F(s))}</div></div>
        <div class="stat-card"><div class="stat-label">Plusvalía latente (${m(r)}%)</div><div class="stat-value ${n>=0?"pos":"neg"}">${m(F(n))}</div></div>
        <div class="stat-card"><div class="stat-label">Impuesto estimado</div><div class="stat-value neg">${m(F(i))}</div><div class="stat-sub">Neto: ${m(F(o-i))}</div></div>
      </div>
      <div class="auth-hint mt-8" style="border-color:rgba(16,185,129,0.3)">
        📈 Los traspasos entre fondos son <strong>neutros fiscalmente</strong> (art. 94 LIRPF). El impuesto solo se devenga al reembolsar (retirar a cuenta bancaria).
      </div>
    </div>`}function ll(t,e){if(!t.activo||!t.interes||t.interes<=0)return"";const{dashboardStart:a,dashboardEnd:o}=e.config,s=Math.max(1,(K(o).getTime()-K(a).getTime())/(30.44*864e5)),n=Pe(t,a),i=n*(Math.pow(1+t.interes/100,s/12)-1);let r="";if(e.config.usarInflacion&&e.inflacion.length>0){const c=n*(Ot(e.inflacion,a,o)-1),l=i-c;r=`
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="color:var(--text2)">Pérdida poder adq.</span>
        <span class="num neg">${m(F(c))}</span>
      </div>
      <div class="flex justify-between mt-6">
        <span class="text-sm" style="font-weight:600">Beneficio real</span>
        <span class="num" style="color:${l>=0?"var(--accent)":"var(--red)"};font-weight:600">${m(F(l))}</span>
      </div>`}return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--border2)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Remuneración estimada (${m(a.slice(0,7))} → ${m(o.slice(0,7))})</div>
    <div class="flex justify-between">
      <span class="text-sm" style="color:var(--text2)">Intereses brutos</span>
      <span class="num pos">${m(F(i))}</span>
    </div>${r}
  </div>`}function dl(t,e){const a=Ws[t.tipoBeneficio??""]??{label:"Beneficio",limiteAnual:null},{limiteAnual:o}=a,s=e.nominas.flatMap(v=>(v.retribucionFlexible??[]).filter(g=>g.cuenta===t._id).map(g=>({nomina:v,importe:g.importe}))),n=s.reduce((v,g)=>v+g.importe,0),i=n*12,r=o!==null&&i>o,c=o!==null?Math.min(i,o):i,l=t.grupoNomina?e.nominas.filter(v=>(v.grupoNomina||"")===t.grupoNomina&&v.activo!==!1):s.slice(0,1).map(v=>v.nomina),u=Nc(l,e.tramosIRPF),d=c*u/100,p=t.grupoNomina?`grupo "${t.grupoNomina}", tipo marginal ${u}%`:`tipo marginal ${u}%`;return`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(99,214,160,0.35)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Tarjeta beneficio — ${m(a.label)}</div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga mensual</span>
      <span class="num pos">${m(F(n))}/mes</span>
    </div>
    <div class="flex justify-between mb-5">
      <span class="text-sm" style="color:var(--text2)">Recarga anual</span>
      <span class="num ${r?"neg":"pos"}">${m(F(i))}/año${r?` ⚠ excede límite ${m(F(o))}`:""}</span>
    </div>
    ${o!==null?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Límite exención</span><span class="num">${m(F(o))}/año</span></div>`:""}
    ${d>0?`<div class="flex justify-between mb-5"><span class="text-sm" style="color:var(--text2)">Ahorro IRPF estimado</span>
             <span class="num pos" title="Importe exento × ${m(p)}">≈ ${m(F(d))}/año <span style="font-size:10px;color:var(--text3)">(${m(u)}%)</span></span></div>`:""}
    ${s.length>0?s.map(v=>`<div style="font-size:11px;color:var(--text3)">↩ ${m(v.nomina.nombre)}: ${m(F(v.importe))}/mes</div>`).join(""):'<div style="font-size:11px;color:var(--yellow)">Sin nómina vinculada — configúrala en Nóminas.</div>'}
  </div>`}function ul(t){const e=Sa(t);return e?`<div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid var(--yellow-dark, #7a6010)">
    <div style="font-size:11px;color:var(--text3);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px">Análisis fiscal — Pensión</div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔓 Disponible</span><span class="num pos">${m(F(e.disponible))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">🔒 Bloqueado</span><span class="num" style="color:var(--yellow)">${m(F(e.bloqueado))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">📈 Revalorización</span><span class="num ${e.beneficio>=0?"pos":"neg"}">${m(F(e.beneficio))}</span></div>
    <div class="flex justify-between mb-6"><span class="text-sm" style="color:var(--text2)">💰 Coste base</span><span class="num">${m(F(e.costBase))}</span></div>
    <div style="font-size:10px;color:var(--text3);margin-top:4px">
      ${e.proxDesbloqueo?`Próx. desbloqueo: ${m(e.proxDesbloqueo)}`:"Todas las aportaciones disponibles"}
      · ${m(t.impuestoRetirada??0)}% sobre beneficio al retirar · ${e.numAportaciones} aportaciones
    </div>
  </div>`:""}function pl(t,e){const a=Ke(t,e.tramosGanancias);if(!a)return"";const o=e.config,s=e.flujos(t._id),n=K(o.dashboardStart),i=K(o.dashboardEnd),r=Math.max(0,(i.getTime()-n.getTime())/(30.44*864e5)),c=a.saldo+s.totalAportaciones-s.totalReembolsos,l=t.interes>0?Math.pow(1+t.interes/100,1/12)-1:0,u=c>0&&r>0?Math.max(0,c*Math.pow(1+l,r)):Math.max(0,c),d=a.costBase+s.totalAportaciones,p=Math.max(0,u-d),v=wa(p,e.tramosGanancias),g=p>0?(v/p*100).toFixed(1):"0",b=t.interes>0?`${t.interes}% anual`:"sin rentabilidad",y=a.saldo>0?(a.plusvalia/a.saldo*100).toFixed(1):"0",f=(M,w,x)=>M.map(_=>`<div class="flex justify-between mt-4">
          <span class="text-sm" style="color:var(--text2)">${w} ${m(_.contraparte)}: ${m(_.concepto)}</span>
          <span class="num ${x}">${m(F(_.total))} · ${_.ocurrencias} mov.</span>
        </div>`).join(""),C=s.entradas.length>0||s.salidas.length>0?`<div style="margin-top:8px;padding:8px 10px;background:var(--bg2);border-radius:var(--radius);border:1px solid var(--border)">
         <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Flujos en período (${m(o.dashboardStart.slice(0,7))} → ${m(o.dashboardEnd.slice(0,7))})</div>
         ${f(s.entradas,"↓","pos")}
         ${f(s.salidas,"↑","neg")}
         <div style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px">
           ${s.totalAportaciones>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total aportaciones</span><span class="num pos">${m(F(s.totalAportaciones))}</span></div>`:""}
           ${s.totalReembolsos>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Total reembolsos</span><span class="num neg">${m(F(s.totalReembolsos))}</span></div>`:""}
           ${s.retencion>0?`<div class="flex justify-between mt-4"><span class="text-sm" style="color:var(--text2)">Retención estimada (art. 101)</span><span class="num neg">${m(F(s.retencion))}</span></div>`:s.salidas.length>0?'<div style="font-size:10px;color:var(--text3);margin-top:4px">Sin plusvalía latente: los reembolsos no generan retención</div>':""}
         </div>
       </div>`:'<div style="font-size:10px;color:var(--text3);margin-top:6px">Gestiona aportaciones/reembolsos en <em>Gastos e Ingresos</em> → tipo Transferencia</div>',S=e.invModo(t._id),I=M=>`padding:3px 10px;border-radius:20px;border:1px solid ${M?"var(--accent)":"var(--border)"};background:${M?"var(--accent-dim)":"transparent"};color:${M?"var(--accent)":"var(--text3)"};cursor:pointer;font-size:11px`,E=S==="real"?`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Coste base</div><div class="stat-value">${m(F(a.costBase))}</div></div>
           <div class="stat-card"><div class="stat-label">Valor actual</div><div class="stat-value pos">${m(F(a.saldo))}</div></div>
           <div class="stat-card"><div class="stat-label">Neto actual</div><div class="stat-value pos">${m(F(a.neto))}</div><div class="stat-sub">${m(y)}% plusvalía</div></div>
         </div>`:`<div class="grid-3 mb-8" style="gap:8px">
           <div class="stat-card"><div class="stat-label">Aportaciones totales</div><div class="stat-value">${m(F(d))}</div><div class="stat-sub">Coste base proyectado</div></div>
           <div class="stat-card"><div class="stat-label">Valor proyectado</div><div class="stat-value pos">${m(F(u))}</div><div class="stat-sub">${m(b)} · ${m(o.dashboardEnd)}</div></div>
           <div class="stat-card"><div class="stat-label">Valor neto proyectado</div><div class="stat-value pos">${m(F(u-v))}</div><div class="stat-sub">${m(g)}% imp. efectivo</div></div>
         </div>`;return`
    <div style="margin-top:10px;padding:10px;background:var(--bg3);border-radius:var(--radius);border:1px solid rgba(16,185,129,0.3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px">Fondo de inversión</div>
        <div style="display:flex;gap:4px">
          <button data-inv-modo="${m(t._id)}|real" style="${I(S==="real")}">Real</button>
          <button data-inv-modo="${m(t._id)}|proyeccion" style="${I(S==="proyeccion")}">Proyección</button>
        </div>
      </div>
      ${E}
      ${C}
    </div>`}function ml(t,e){const a=[...t.historicoSaldos||[]].sort((c,l)=>l.fecha.localeCompare(c.fecha)),o=a[0],s=Bt(t),n=Mt(t),i=t.esCuentaPrincipal,r=[i?'<span class="badge badge-blue" title="Cuenta seleccionada por defecto en nuevos gastos">Principal</span>':"",n==="pension"?'<span class="badge" style="background:rgba(255,209,102,0.15);color:var(--yellow)">🔒 Pensión</span>':"",n==="inversion"?'<span class="badge" style="background:rgba(16,185,129,0.12);color:#10b981">📈 Inversión</span>':"",n==="beneficio"?`<span class="badge" style="background:rgba(99,214,160,0.12);color:#63d6a0">🎫 ${m((Ws[t.tipoBeneficio??""]??{label:"Beneficio"}).label)}</span>`:"",t.simulacion?'<span class="badge badge-sim">SIM</span>':""].join("");return`<div class="card" style="${i?"border-color:var(--accent2)":""}">
    <div class="flex justify-between items-center mb-12">
      <div class="flex gap-8 items-center" style="flex-wrap:wrap">
        <span class="card-title" style="margin:0">${m(t.nombre)}</span>
        ${r}
      </div>
      <div class="flex gap-8">
        ${i?"":`<button class="btn-icon" data-principal-acc="${m(t._id)}" title="Marcar como cuenta principal" style="font-size:14px">★</button>`}
        <button class="btn-icon" data-hist-acc="${m(t._id)}" title="Histórico de saldos"><svg viewBox="0 0 24 24"><path d="${il}"/></svg></button>
        <button class="btn-icon" data-editar-acc="${m(t._id)}" title="Editar"><svg viewBox="0 0 24 24"><path d="${nl}"/></svg></button>
        <button class="btn-danger" data-borrar-acc="${m(t._id)}">✕</button>
      </div>
    </div>
    <div class="grid-2 mb-8" style="gap:8px">
      <div class="stat-card"><div class="stat-label">Saldo inicial</div><div class="stat-value">${m(F(t.saldoInicial||0))}</div><div class="stat-sub">${m(t.fechaInicialSaldo||"—")}</div></div>
      <div class="stat-card"><div class="stat-label">Saldo actual</div><div class="stat-value">${m(F(s))}</div>${o?`<div class="stat-sub">Registro: ${m(o.fecha)}</div>`:'<div class="stat-sub" style="color:var(--text3)">Sin histórico</div>'}</div>
    </div>
    ${t.interes>0?`<div class="flex gap-8 flex-wrap mb-8"><span class="badge badge-active">${m(t.interes)}% rentabilidad</span><span class="badge badge-blue">Cap. ${m(t.periodoCobro??"mensual")}</span></div>`:'<div class="mb-8"><span class="badge badge-inactive">Sin remuneración</span></div>'}
    ${ll(t,e)}
    ${n==="beneficio"?dl(t,e):""}
    ${n==="pension"?ul(t):""}
    ${n==="inversion"?pl(t,e):""}
    ${a.length>0?`<div class="text-sm mt-8">${a.length} punto${a.length>1?"s":""} en histórico · último ${m(o.fecha)}</div>`:'<div class="text-sm" style="color:var(--text3)">Sin histórico</div>'}
    ${t.descripcion?`<div class="mt-8 text-sm">${m(t.descripcion)}</div>`:""}
  </div>`}const fl=[["cuenta","Cuenta bancaria"],["inversion","Fondo de inversión"],["beneficio","Tarjeta beneficio"]];function gl(t){return`<div>${t.map((a,o)=>`<div class="flex gap-8 items-center" style="padding:4px 0;border-bottom:1px solid var(--border)">
        <span style="min-width:70px;font-size:12px">${m(a.fechaInicio||"—")}</span>
        <span style="flex:1;font-size:12px">${m(F(a.importe))} / ${m(a.periodicidad)}</span>
        <span style="min-width:70px;font-size:12px;color:var(--text3)">${m(a.fechaFin||"indefinido")}</span>
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
    <button class="btn-secondary btn-sm mt-6" data-aport-anadir>+ Añadir aportación</button>`}function vl(t,e){const a=t?Mt(t):"cuenta",o=[...new Set(e.nominas.filter(n=>n.grupoNomina).map(n=>n.grupoNomina))],s=n=>n?"":' style="display:none"';return`
    <div class="grid-2">
      ${xt("ac-nombre","Nombre","text",(t==null?void 0:t.nombre)??"","Ej: Cuenta ING, Fondo Vanguard")}
      ${Oe("ac-modelo","Tipo",fl,a)}
    </div>
    <div class="grid-2 mt-8">
      ${xt("ac-saldo","Saldo actual (€)","number",e.saldoActual,"5000")}
      ${xt("ac-saldo-ini","Saldo inicial (€)","number",(t==null?void 0:t.saldoInicial)??0,"5000")}
    </div>
    <div class="auth-hint mt-8">El <strong>saldo inicial</strong> es el punto de arranque del extracto en el Dashboard.
      Cambiar el <strong>saldo actual</strong> registra un punto de control con la fecha de hoy.</div>
    <div class="grid-2 mt-8">
      ${xt("ac-interes","Rentabilidad anual (%)","number",(t==null?void 0:t.interes)??0,"7")}
      ${xt("ac-fecha-ini","Fecha saldo inicial","date",(t==null?void 0:t.fechaInicialSaldo)??e.hoy)}
    </div>
    <div class="form-row mt-8">
      <label class="form-label">Activa</label>
      <label class="toggle"><input type="checkbox" id="ac-activo"${(t==null?void 0:t.activo)!==!1?" checked":""}/><span class="toggle-slider"></span></label>
    </div>

    <details class="form-advanced mt-12"${t?" open":""}>
      <summary class="form-advanced-summary">Opciones</summary>
      <div class="form-advanced-body">
        <div class="mt-8">
          ${Oe("ac-periodo","Capitalización",[["diario","Diario"],["semanal","Semanal"],["mensual","Mensual"]],(t==null?void 0:t.periodoCobro)??"mensual")}
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
            ${Oe("ac-tipo-beneficio","Tipo de beneficio",[["transporte","Transporte (límite 1.500 €/año)"],["restaurante","Restaurante (límite 2.640 €/año)"],["otros","Otros beneficios"]],(t==null?void 0:t.tipoBeneficio)??"transporte")}
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
    </div>`}function bl(t,e,a){const o=()=>{const s=t.querySelector("#ac-aport-container");s&&(s.innerHTML=gl(e))};tt(t,"#ac-modelo",s=>{const n=s.value,i=(r,c)=>{const l=t.querySelector(r);l&&(l.style.display=c?"":"none")};i("#ac-inversion-hint",n==="inversion"),i("#ac-beneficio-fields",n==="beneficio")}),L(t,"[data-aport-anadir]",()=>{var n,i,r,c;const s=parseFloat(((n=t.querySelector("#aport-importe"))==null?void 0:n.value)??"")||0;if(!s)return G("Importe requerido","err");e.push({_id:Date.now().toString(36),importe:s,periodicidad:((i=t.querySelector("#aport-periodo"))==null?void 0:i.value)||"mensual",fechaInicio:((r=t.querySelector("#aport-inicio"))==null?void 0:r.value)||a,fechaFin:((c=t.querySelector("#aport-fin"))==null?void 0:c.value)||""}),o()}),L(t,"[data-aport-borrar]",s=>{e.splice(Number(s.getAttribute("data-aport-borrar")),1),o()}),o()}function hl(t,e,a,o,s){const n=g=>{var b;return((b=t.querySelector(g))==null?void 0:b.value)??""},i=(g,b=0)=>{const y=parseFloat(n(g));return Number.isFinite(y)?y:b},r=g=>{var b;return!!((b=t.querySelector(g))!=null&&b.checked)},c=n("#ac-nombre").trim();if(!c)return{datos:{},error:"Nombre obligatorio"};const l=n("#ac-modelo")||"cuenta",u=l==="beneficio",d=i("#ac-saldo"),p={nombre:c,saldo:d,saldoInicial:i("#ac-saldo-ini"),fechaInicialSaldo:n("#ac-fecha-ini")||s,interes:i("#ac-interes"),periodoCobro:n("#ac-periodo")||"mensual",descripcion:n("#ac-desc").trim(),activo:r("#ac-activo"),simulacion:r("#ac-sim"),modeloFondo:l,planAportaciones:e,tipoBeneficio:u?n("#ac-tipo-beneficio")||"transporte":void 0,grupoNomina:u?n("#ac-beneficio-grupo"):(a==null?void 0:a.grupoNomina)??"",...a?{}:{historicoSaldos:[],aportaciones:[],esCuentaPrincipal:!1}};if(!a&&d<=0)return{datos:p};if(!(o===null||Math.abs(d-o)>.005))return{datos:p};if(l==="inversion"&&d>(o??0)){const g=Date.now().toString(36);p.aportaciones=[...(a==null?void 0:a.aportaciones)??[],{_id:`${g}a`,fecha:a?s:p.fechaInicialSaldo??s,cantidad:d-(o??0)}]}return{datos:p,punto:{fecha:s,saldo:d,nota:a?"Actualización manual":"Saldo inicial"}}}function to(t){return[...t].sort((e,a)=>a.fecha.localeCompare(e.fecha)).map(e=>({_id:e._id,fecha:e.fecha,saldo:nt(e.saldoCts),nota:e.nota,derivado:e.origen==="derivado"}))}function yl(t,e,a,o,s){const n=a.map(r=>`<div class="flex gap-8 items-center" style="padding:8px 0;border-bottom:1px solid var(--border)${r.derivado?";opacity:0.75":""}">
        <span class="num" style="min-width:110px">${m(r.fecha)}</span>
        <span class="num" style="flex:1;color:${r.saldo>=o?"var(--accent)":"var(--red)"}">${m(F(r.saldo))}</span>
        <span class="text-sm" style="flex:2;color:var(--text2)">${r.derivado?'<span class="badge">semanal · calculado</span>':m(r.nota??"")}</span>
        <button class="btn-secondary btn-sm" title="Usar como punto de arranque del extracto" data-hist-inicial="${m(e)}|${m(r._id)}">⟲ Inicio</button>
        <button class="btn-danger btn-sm" data-hist-borrar="${m(e)}|${m(r._id)}">✕</button>
      </div>`).join(""),i=a.filter(r=>r.derivado).length;return`
    <div class="flex justify-between items-center" style="gap:10px;flex-wrap:wrap">
      <div class="card-title" style="margin:0">Histórico — ${m(t)}</div>
      <button class="btn-secondary btn-sm" data-hist-semanal="${m(e)}"
        title="Recalcula un punto por semana con el saldo al cierre de cada una, a partir de los movimientos. Si el arranque de la cuenta es posterior al primer movimiento, lo retrasa hasta él para que no tape la curva.">↻ Recalcular semanal</button>
    </div>
    <div class="text-sm mt-4 mb-8" style="color:var(--text3)">
      ${i>0?`${i} de los puntos son semanales calculados del ledger; el resto los has registrado tú y mandan sobre el saldo.`:"Los puntos que registras aquí anclan el saldo. «Recalcular semanal» añade además un punto por semana con lo que dicen los movimientos."}
    </div>
    <div style="max-height:240px;overflow-y:auto;margin-bottom:16px">
      ${a.length===0?'<div class="text-sm" style="padding:20px;text-align:center;color:var(--text3)">Sin registros.</div>':n}
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
      <button class="btn-primary" data-hist-anadir="${m(e)}">Añadir</button>
    </div>`}const Ks=t=>t.slice(0,3).map(([,e])=>`${e}%`).join(" · ")+(t.length>3?" …":"");function $l(t){let e=null,a=[];const o=()=>document.getElementById("modal-overlay"),s=()=>zt(),n=()=>{var p;return(p=o())==null?void 0:p.classList.add("hidden")},i=()=>t.store.get("config").tramosGananciasCapital??_e;function r(p,v){const g=o(),b=s();return!g||!b?null:(b.innerHTML=`<div class="modal-title">${m(p)}</div>${v}`,g.classList.remove("hidden"),L(b,"[data-cerrar]",n),b)}function c(){e=null;const p=[...t.store.get("tramosGananciasCapitalHistorico")].sort((b,y)=>b.año-y.año),v="display:grid;grid-template-columns:90px 1fr auto;gap:0;padding:10px 12px;border-top:1px solid var(--border);align-items:center",g=r("Tramos — Ganancias de capital",`
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
          <span class="text-sm" style="color:var(--text2)">${m(Ks(i()))}</span>
          <button class="btn-secondary btn-sm" data-editar-tg="default">Editar</button>
        </div>
        ${p.map(b=>`<div style="${v}">
              <span style="font-weight:600;font-size:13px">${b.año}</span>
              <span class="text-sm" style="color:var(--text2)">${m(Ks(b.tramos))}</span>
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
      </div>`);g&&(L(g,"[data-editar-tg]",b=>{const y=b.getAttribute("data-editar-tg");d(y==="default"?"default":Number(y))}),L(g,"[data-borrar-tg]",b=>{const y=Number(b.getAttribute("data-borrar-tg"));$t(`¿Eliminar la tabla del ejercicio ${y}?`)&&(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").filter(f=>f.año!==y)),G(`Tabla ${y} eliminada`),t.onDatosCambiados(),c())}),L(g,"[data-anadir-anyo-tg]",()=>{var f;const b=parseInt(((f=g.querySelector("#tg-new-year"))==null?void 0:f.value)??"",10);if(!b||b<2e3||b>2100)return G("Año inválido","err");const y=t.store.get("tramosGananciasCapitalHistorico");if(y.some(h=>h.año===b))return G("Ya existe una tabla para ese año","err");t.store.set("tramosGananciasCapitalHistorico",[...y,{_id:Date.now().toString(36),año:b,tramos:i().map(h=>[...h])}]),t.onDatosCambiados(),d(b)}))}function l(){return a.map(([p,v],g)=>`<div class="grid-2 mt-8">
          <input class="form-input" type="number" data-tg-min="${g}" value="${p}" placeholder="Desde €" min="0"/>
          <div class="flex gap-8">
            <input class="form-input" type="number" data-tg-pct="${g}" value="${v}" placeholder="%" min="0" max="100" style="flex:1"/>
            <button class="btn-danger" data-tg-borrar="${g}">✕</button>
          </div>
        </div>`).join("")}function u(p){a=[...p.querySelectorAll("[data-tg-min]")].map((v,g)=>{const b=p.querySelector(`[data-tg-pct="${g}"]`);return[parseFloat(v.value)||0,parseFloat((b==null?void 0:b.value)??"")||0]})}function d(p){var f;e=p;const v=t.store.get("tramosGananciasCapitalHistorico");a=(p==="default"?i():((f=v.find(h=>h.año===p))==null?void 0:f.tramos)??i()).map(h=>[...h]);const b=r(`Ganancias de capital — ${p==="default"?"Por defecto":p}`,`
      <button class="btn-secondary btn-sm mb-12" data-volver-tg>← Volver a la lista</button>
      <div class="text-sm mb-8" style="color:var(--text2)">Orden ascendente por base del ahorro.</div>
      <div id="tg-rows">${l()}</div>
      <button class="btn-secondary btn-sm mt-8" data-tg-anadir>+ Añadir tramo</button>
      <div class="flex gap-8 mt-16" style="justify-content:flex-end">
        <button class="btn-secondary" data-volver-tg>Cancelar</button>
        <button class="btn-primary" data-tg-guardar>Guardar</button>
      </div>`);if(!b)return;const y=()=>{const h=b.querySelector("#tg-rows");h&&(h.innerHTML=l())};L(b,"[data-volver-tg]",c),L(b,"[data-tg-anadir]",()=>{u(b),a.push([0,0]),y()}),L(b,"[data-tg-borrar]",h=>{u(b),a.splice(Number(h.getAttribute("data-tg-borrar")),1),y()}),L(b,"[data-tg-guardar]",()=>{u(b);const h=[...a].sort((C,S)=>C[0]-S[0]);if(h.length===0)return G("Añade al menos un tramo","err");e==="default"?(t.store.patchConfig({tramosGananciasCapital:h}),G("Tabla por defecto guardada")):(t.store.set("tramosGananciasCapitalHistorico",t.store.get("tramosGananciasCapitalHistorico").map(C=>C.año===e?{...C,tramos:h}:C)),G(`Tabla ${e} guardada`)),t.onDatosCambiados(),c()})}return{abrir:c}}const xl=[{id:"cuentas",etiqueta:"Cuentas"},{id:"movimientos",etiqueta:"Movimientos"},{id:"importar",etiqueta:"Importar CSV"},{id:"cierre",etiqueta:"Cierre y precisión"}];function Il(t){return`<div class="flex gap-6 mb-14 flex-wrap" data-cuentas-tabs>
    ${xl.map(e=>`<button class="btn-secondary btn-sm" data-cuentas-tab="${e.id}" style="${e.id===t?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">${e.etiqueta}</button>`).join("")}
  </div>`}function wl(t,e){if(t===0)return e===0?100:0;const a=Math.abs(e-t)/Math.abs(t);return Math.max(0,Math.min(100,(1-a)*100))}function Js(t,e){const a=K(t),o=[];for(let s=1;s<=e;s++){const n=new Date(a.getFullYear(),a.getMonth()-s,1);o.push(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`)}return o.reverse()}function Sl(t,e,a){const o=Js(a,1)[0],s=e.slice(0,7)<o?e.slice(0,7):o,n=[];let[i,r]=t.slice(0,7).split("-").map(Number);for(;`${i}-${String(r).padStart(2,"0")}`<=s;)n.push(`${i}-${String(r).padStart(2,"0")}`),++r>12&&(r=1,i++);return n}function eo(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0);return{inicio:`${t}-01`,fin:`${t}-${String(o.getDate()).padStart(2,"0")}`}}function Cl(t,e){const{inicio:a,fin:o}=eo(e);return ao(t,a,o)}function ao(t,e,a){return Fe([t],{start:e,end:a}).reduce((s,n)=>s+Math.abs(n.cuantia),0)}function Ml(t,e){const{inicio:a,fin:o}=eo(e);return Ye(t.fechaInicio,t.fechaFin,a,o)}function El(t){function e(s,n={}){var A;const{mesesHistorial:i=12,mesesMedia:r=3,hoy:c=ot(),desde:l,hasta:u}=n,d=t.transacciones({estimacionId:s._id}),v=d.length===0&&(((A=s.tags)==null?void 0:A.length)??0)>0?t.transacciones({tags:s.tags}):d,g=l&&u?Sl(l,u,c):Js(c,i),b=new Map(g.map(P=>{const{inicio:$,fin:T}=eo(P);return[P,{inicio:l&&l>$?l:$,fin:u&&u<T?u:T}]})),y=new Map;for(const P of v){const $=b.get(P.fecha.slice(0,7));if(!$||P.fecha<$.inicio||P.fecha>$.fin)continue;const T=P.fecha.slice(0,7);y.set(T,(y.get(T)??0)+Math.abs(P.importeCts)/100)}const f=[];for(const P of g){const $=y.get(P);if($===void 0||!Ml(s,P))continue;const T=b.get(P),D=Q(ao(s,T.inicio,T.fin));f.push({mes:P,estimado:D,real:Q($),desviacion:Q($-D),precision:wl(D,$)})}const h=Q(f.reduce((P,$)=>P+$.estimado,0)),C=Q(f.reduce((P,$)=>P+$.real,0)),S=f.reduce((P,$)=>P+Math.abs($.estimado),0),I=f.length===0?null:S>0?f.reduce((P,$)=>P+$.precision*Math.abs($.estimado),0)/S:f.reduce((P,$)=>P+$.precision,0)/f.length,E=f.slice(-r),M=E.length>0?Q(E.reduce((P,$)=>P+$.real,0)/E.length):null,w=E.reduce((P,$)=>P+$.estimado,0),x=E.reduce((P,$)=>P+$.real,0),_=w>0?x/w:null;return{estimacionId:s._id,concepto:s.concepto,tags:s.tags??[],meses:f,estimadoTotal:h,realTotal:C,desviacionTotal:Q(C-h),precision:I,mediaRealReciente:M,factorReciente:_,infraestimada:C>h}}function a(s,n={}){return s.filter(i=>i.tipo!=="transferencia").map(i=>e(i,n)).sort((i,r)=>i.precision===null&&r.precision===null?i.concepto.localeCompare(r.concepto):i.precision===null?1:r.precision===null?-1:i.precision-r.precision)}function o(s){const n=new Map;for(const i of s)if(i.precision!==null)for(const r of i.tags.length>0?i.tags:["sin_tag"]){const c=n.get(r)??{estimado:0,real:0,pesoPrecision:0,peso:0,n:0};c.estimado+=i.estimadoTotal,c.real+=i.realTotal,c.pesoPrecision+=i.precision*Math.abs(i.estimadoTotal),c.peso+=Math.abs(i.estimadoTotal),c.n+=1,n.set(r,c)}return[...n.entries()].map(([i,r])=>({tag:i,estimadoTotal:Q(r.estimado),realTotal:Q(r.real),desviacionTotal:Q(r.real-r.estimado),precision:r.peso>0?r.pesoPrecision/r.peso:null,estimaciones:r.n})).sort((i,r)=>(i.precision??101)-(r.precision??101))}return{analizarEstimacion:e,analizarTodas:a,analizarPorTag:o}}function Al(t){const[e,a]=t.split("-").map(Number);return`${t}-${String(new Date(e,a,0).getDate()).padStart(2,"0")}`}function Pl(t,e){const a=[];let[o,s]=t.slice(0,7).split("-").map(Number);const[n,i]=e.slice(0,7).split("-").map(Number);for(;o<n||o===n&&s<=i;)a.push(`${o}-${String(s).padStart(2,"0")}`),s+=1,s>12&&(s=1,o+=1);return a}function _l(t,e,a,o){const s=r=>e.filter(c=>c.tipo===r&&c.activo!==!1),n=s("gasto"),i=s("ingreso");return Pl(a,o).map(r=>{const c={desde:`${r}-01`,hasta:Al(r)},l=b=>Q(t.transacciones({...c,tipo:b}).reduce((y,f)=>y+Math.abs(f.importeCts)/100,0)),u=b=>Q(b.reduce((y,f)=>y+Cl(f,r),0)),d=u(n),p=l("gasto"),v=u(i),g=l("ingreso");return{mes:r,estimado:d,real:p,ingresosEstimados:v,ingresosReales:g,netoEstimado:Q(v-d),netoReal:Q(g-p)}})}const ca=640,Ce=200,ft={top:14,right:16,bottom:26,left:54};function Fl(t){return bt(t).slice(0,3)}const Dl={gasto:t=>({estimado:t.estimado,real:t.real}),ingreso:t=>({estimado:t.ingresosEstimados,real:t.ingresosReales}),neto:t=>({estimado:t.netoEstimado,real:t.netoReal})};function Tl(t,e="gasto"){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin meses que mostrar en este intervalo.</div>';const a=Dl[e],o=t.flatMap(y=>[a(y).estimado,a(y).real]),s=ca-ft.left-ft.right,n=Ce-ft.top-ft.bottom,i=Math.max(1,...o),r=Math.min(0,...o),c=i-r||1,l=y=>ft.left+(t.length===1?s/2:y/(t.length-1)*s),u=y=>ft.top+n-(y-r)/c*n,d=t.map((y,f)=>`${l(f)},${u(a(y).estimado)}`).join(" "),p=t.map((y,f)=>`${l(f)},${u(a(y).real)}`).join(" "),v=r<0?`<line x1="${ft.left}" y1="${u(0).toFixed(1)}" x2="${ca-ft.right}" y2="${u(0).toFixed(1)}" stroke="var(--border)" stroke-width="1" stroke-dasharray="2,3"/>`:"",g=t.map((y,f)=>`<circle cx="${l(f).toFixed(1)}" cy="${u(a(y).real).toFixed(1)}" r="3" fill="var(--accent)"><title>${m(bt(y.mes))}: ${m(F(a(y).real))}</title></circle>`).join(""),b=t.map((y,f)=>`<text x="${l(f).toFixed(1)}" y="${Ce-8}" font-size="9" text-anchor="middle" fill="var(--text3)" font-family="var(--font-mono)">${m(Fl(y.mes))}</text>`).join("");return`
    <svg viewBox="0 0 ${ca} ${Ce}" style="width:100%;height:auto;max-height:220px" role="img" aria-label="Real frente a estimado por mes">
      <line x1="${ft.left}" y1="${ft.top}" x2="${ft.left}" y2="${Ce-ft.bottom}" stroke="var(--border)" stroke-width="1"/>
      <line x1="${ft.left}" y1="${Ce-ft.bottom}" x2="${ca-ft.right}" y2="${Ce-ft.bottom}" stroke="var(--border)" stroke-width="1"/>
      <text x="4" y="${ft.top+8}" font-size="9" fill="var(--text3)" font-family="var(--font-mono)">${m(F(i))}</text>
      ${v}
      <polyline points="${d}" fill="none" stroke="var(--text3)" stroke-width="1.5" stroke-dasharray="4,3"/>
      <polyline points="${p}" fill="none" stroke="var(--accent)" stroke-width="2"/>
      ${g}
      ${b}
    </svg>
    <div class="flex gap-14" style="font-size:11px;color:var(--text2);margin-top:4px">
      <span><span style="display:inline-block;width:10px;height:2px;background:var(--accent);vertical-align:middle;margin-right:4px"></span>Real</span>
      <span><span style="display:inline-block;width:10px;border-top:1.5px dashed var(--text3);vertical-align:middle;margin-right:4px"></span>Estimado</span>
    </div>`}const Xs={gasto:"Gasto",ingreso:"Ingreso",ajuste:"Ajuste",transferencia:"Transferencia propia"},zl=[25,50,100,250,0];function jl(t){return{cuentaId:"",mes:t,filtroTexto:"",vista:"mensual",periodoDesde:Zs(t,5),periodoHasta:t,detalleAbierto:new Set,intervaloDesde:He(Zs(t,5)).desde,intervaloHasta:He(t).hasta,comparativa:"neto",pagina:1,porPagina:50}}function Qs(t,e,a){const o=t.length;if(a<=0)return{pagina:t,actual:1,paginas:1,total:o,desde:o>0?1:0,hasta:o};const s=Math.max(1,Math.ceil(o/a)),n=Math.min(Math.max(1,e),s),i=(n-1)*a;return{pagina:t.slice(i,i+a),actual:n,paginas:s,total:o,desde:o>0?i+1:0,hasta:Math.min(i+a,o)}}function la(t,e,a){if(t.total===0)return"";const o=(n,i,r,c)=>`<button class="btn-secondary btn-sm" data-acc-pagina="${n}" ${r?"":"disabled"} title="${m(c)}"
             style="padding:2px 9px;font-size:11px${r?"":";opacity:0.4;cursor:default"}">${i}</button>`,s=zl.map(n=>`<option value="${n}"${n===e?" selected":""}>${n===0?"todos":`${n} por página`}</option>`).join("");return`
    <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin:8px 0">
      <div class="text-sm" style="color:var(--text3)">
        ${t.desde}–${t.hasta} de ${t.total} ${m(a)}${t.paginas>1?` · página ${t.actual} de ${t.paginas}`:""}
      </div>
      <div class="flex gap-6 items-center">
        ${o(1,"«",t.actual>1,"Primera")}
        ${o(t.actual-1,"‹ Anterior",t.actual>1,"Página anterior")}
        ${o(t.actual+1,"Siguiente ›",t.actual<t.paginas,"Página siguiente")}
        ${o(t.paginas,"»",t.actual<t.paginas,"Última")}
        <select class="form-select" data-acc-por-pagina style="font-size:11px;padding:2px 6px;width:auto">${s}</select>
      </div>
    </div>`}function oo(t,e,a,o){const s=t===e?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-acc-comparativa="${t}" title="${m(o)}" style="${s}">${m(a)}</button>`}function He(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function Zs(t,e){const[a,o]=t.split("-").map(Number),s=new Date(a,o-1-e,1);return`${s.getFullYear()}-${String(s.getMonth()+1).padStart(2,"0")}`}function so(t,e){const[a,o]=t<=e?[t,e]:[e,t];return{desde:He(a).desde,hasta:He(o).hasta}}function ql(t,e){return t<=e?{desde:t,hasta:e}:{desde:e,hasta:t}}function no(t){const e=new Map;for(const a of t){const o=a.concepto.trim(),s=e.get(o);s?s.push(a):e.set(o,[a])}return[...e.entries()].filter(([,a])=>a.length>1).map(([a,o])=>{const s=new Set(o.map(n=>n.estimacionId??null));return{concepto:a,movimientos:o.slice().sort((n,i)=>n.fecha.localeCompare(i.fecha)),total:o.reduce((n,i)=>n+i.importeCts,0),estimacionComun:s.size===1?s.values().next().value??null:null,tagsComunes:[...new Set(o.flatMap(n=>n.tags))].sort()}}).sort((a,o)=>o.movimientos.length-a.movimientos.length||a.concepto.localeCompare(o.concepto))}function Nl(t,e){if(t.tagsComunes.length===0)return null;const a=new Set(t.movimientos.map(n=>n._id)),o=e.filter(n=>!a.has(n._id)&&n.tipo==="gasto"&&n.tags.some(i=>t.tagsComunes.includes(i))).reduce((n,i)=>n+Math.abs(i.importeCts),0),s=Math.abs(t.total);return{tags:t.tagsComunes,transferidoCts:s,gastadoCts:o,diferenciaCts:o-s}}function Rl(t){if(!t)return'<div class="text-sm" style="color:var(--text3)">Añade etiquetas para comparar lo traspasado con el gasto real que cubre.</div>';const e=t.diferenciaCts===0?"var(--text2)":t.diferenciaCts>0?"var(--red)":"var(--accent)",a=t.diferenciaCts>0?"+":"";return`
    <div style="display:flex;gap:16px;flex-wrap:wrap;font-size:12px">
      <span>Traspasado: <strong style="font-family:var(--font-mono)">${m(F(nt(t.transferidoCts)))}</strong></span>
      <span>Gastado en esas etiquetas: <strong style="font-family:var(--font-mono)">${m(F(nt(t.gastadoCts)))}</strong></span>
      <span style="color:${e}">Diferencia: <strong style="font-family:var(--font-mono)">${a}${m(F(nt(t.diferenciaCts)))}</strong></span>
    </div>`}function kl(t,e){const{ledger:a}=t,o=(t.hoy??ot)(),s=t.accounts().filter($=>$.activo),n=e.vista==="agrupado",i=e.vista==="intervalo",{desde:r,hasta:c}=n?so(e.periodoDesde,e.periodoHasta):i?ql(e.intervaloDesde,e.intervaloHasta):He(e.mes),l={cuentaId:e.cuentaId||void 0,desde:r,hasta:c,texto:e.filtroTexto||void 0},u=a.transacciones(l),d=t.estimaciones().filter($=>$.tipo!=="transferencia"),p=[...d.map($=>({_id:$._id,etiqueta:`${m($.concepto)} (${m(F($.cuantia))})`})),...t.loans().filter($=>$.activo).map($=>({_id:$._id,etiqueta:`Préstamo: ${m($.nombre)}`})),...t.nominas().filter($=>$.activo).map($=>({_id:$._id,etiqueta:`Nómina: ${m($.nombre)}`}))],v=u.filter($=>$.tipo!=="transferencia"&&$.importeCts<0).reduce(($,T)=>$+T.importeCts,0),g=u.filter($=>$.tipo!=="transferencia"&&$.importeCts>0).reduce(($,T)=>$+T.importeCts,0),b=e.cuentaId?a.saldoCuenta(e.cuentaId,c):a.saldoTotal(c),y=e.cuentaId?a.puntosControl(e.cuentaId):a.puntosControl(),f=s.map($=>`<option value="${m($._id)}"${$._id===e.cuentaId?" selected":""}>${m($.nombre)}</option>`).join(""),h=$=>'<option value="">— sin asignar —</option>'+p.map(T=>`<option value="${m(T._id)}"${T._id===$?" selected":""}>${T.etiqueta}</option>`).join(""),C=$=>Object.keys(Xs).map(T=>`<option value="${T}"${T===$?" selected":""}>${Xs[T]}</option>`).join(""),S=Qs(u,e.pagina,e.porPagina),I=new Map(t.accounts().map($=>[$._id,$.nombre])),E=S.pagina.map($=>`
      <tr data-tx="${m($._id)}" style="border-bottom:1px solid var(--border)${$.tipo==="transferencia"?";opacity:0.7":""}">
        <td style="padding:7px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text2);white-space:nowrap">${m($.fecha)}</td>
        <td style="padding:7px 8px;font-size:13px">${m($.concepto)}</td>
        <td style="padding:7px 8px">${rs($.tags)}</td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2)">${m(I.get($.cuentaId)??$.cuentaId)}</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-tipo="${m($._id)}" style="font-size:11px;padding:3px 6px" title="Una transferencia entre tus cuentas no cuenta como gasto ni ingreso">${C($.tipo)}</select>
        </td>
        <td style="padding:7px 8px">
          <select class="form-input" data-tx-estimacion="${m($._id)}" style="font-size:11px;padding:3px 6px;max-width:190px">${h($.estimacionId)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Yt(nt($.importeCts))}</td>
        <td style="padding:7px 8px;text-align:right;white-space:nowrap">
          ${$.importeCts<0&&$.tipo!=="transferencia"?`<button type="button" class="btn-secondary tx-imprevisto${$.imprevisto?" activo":""}" data-tx-imprevisto="${m($._id)}" aria-pressed="${$.imprevisto?"true":"false"}"
                  title="${$.imprevisto?$.estimacionId?"Marcado como imprevisto, pero cuenta a través de su estimación":"Marcado como imprevisto. Pulsa para quitar la marca":"Marcar como imprevisto"}">⚡${$.imprevisto?" Imprevisto":""}</button>`:""}
          <button class="btn-secondary" data-tx-editar="${m($._id)}" style="padding:3px 7px;font-size:11px">Editar</button>
          <button class="btn-secondary" data-tx-borrar="${m($._id)}" style="padding:3px 7px;font-size:11px;color:var(--red)">×</button>
        </td>
      </tr>`).join(""),M=i?_l(a,d,r,c):[],w=n?a.transacciones({desde:r,hasta:c}):[],x=n?no(u):[],_=Qs(x,e.pagina,e.porPagina),A=_.pagina.map($=>{const T=e.detalleAbierto.has($.concepto),D=T?`<tr style="background:var(--bg2);border-bottom:1px solid var(--border)">
             <td colspan="5" style="padding:9px 8px 9px 26px">
               <div class="text-sm mb-6" style="color:var(--text2)">
                 Etiquetas del grupo — para conciliar un traspaso con el gasto real que cubre (p. ej. «gasolina, super, personal»)
               </div>
               <div class="flex gap-8 items-center flex-wrap mb-8">
                 ${rs($.tagsComunes)}
                 <input class="form-input" type="text" data-grp-tags="${m($.concepto)}" list="acc-tags-list" placeholder="añadir etiquetas…" style="flex:1;min-width:160px;font-size:12px;padding:3px 6px"/>
                 <button class="btn-secondary btn-sm" data-grp-tags-asignar="${m($.concepto)}">Asignar</button>
               </div>
               ${Rl(Nl($,w))}
             </td>
           </tr>`:"",z=T?$.movimientos.map(k=>{var V;return`
            <tr style="border-bottom:1px solid var(--border);background:var(--bg2)">
              <td style="padding:5px 8px 5px 26px;font-size:12px;color:var(--text2)">
                <span style="font-family:var(--font-mono)">${m(k.fecha)}</span> · ${m(((V=t.accounts().find(H=>H._id===k.cuentaId))==null?void 0:V.nombre)??k.cuentaId)}
              </td>
              <td></td>
              <td style="padding:5px 8px">
                <select class="form-input" data-tx-estimacion="${m(k._id)}" style="font-size:11px;padding:2px 5px;max-width:190px">${h(k.estimacionId)}</select>
              </td>
              <td style="padding:5px 8px;text-align:right;font-family:var(--font-mono);font-size:12px;white-space:nowrap">${Yt(nt(k.importeCts))}</td>
              <td></td>
            </tr>`}).join(""):"";return`
      <tr data-grp="${m($.concepto)}" style="border-bottom:1px solid var(--border)">
        <td style="padding:7px 8px">
          <button class="btn-secondary" data-grp-detalle="${m($.concepto)}" style="padding:2px 7px;font-size:11px;margin-right:6px">${T?"▾":"▸"}</button>
          <span style="font-size:13px">${m($.concepto)}</span>
        </td>
        <td style="padding:7px 8px;font-size:12px;color:var(--text2);white-space:nowrap">${$.movimientos.length} movimientos</td>
        <td style="padding:7px 8px">
          <select class="form-input" data-grp-estimacion="${m($.concepto)}" style="font-size:11px;padding:3px 6px;max-width:190px" title="Asigna la estimación a los ${$.movimientos.length} movimientos del grupo de golpe">${h($.estimacionComun)}</select>
        </td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:13px;white-space:nowrap">${Yt(nt($.total))}</td>
        <td></td>
      </tr>${D}${z}`}).join(""),P=y.slice().reverse().slice(0,8).map($=>{var T;return`
      <div style="display:flex;align-items:center;gap:10px;padding:5px 0;border-bottom:1px solid var(--border);font-size:12px">
        <span style="font-family:var(--font-mono);color:var(--text2)">${m($.fecha)}</span>
        <span style="color:var(--text3)">${m(((T=t.accounts().find(D=>D._id===$.cuentaId))==null?void 0:T.nombre)??$.cuentaId)}</span>
        <span style="margin-left:auto;font-family:var(--font-mono)">${m(F(nt($.saldoCts)))}</span>
        ${$.nota?`<span style="color:var(--text3)">${m($.nota)}</span>`:""}
        <button class="btn-secondary" data-pc-borrar="${m($._id)}" style="padding:2px 6px;font-size:11px;color:var(--red)">×</button>
      </div>`}).join("");return`
    <div class="grid-2 mb-14" style="align-items:start">
      <div class="card">
        <div class="flex justify-between items-center flex-wrap" style="gap:8px;margin-bottom:10px">
          <div class="card-title" style="margin:0">Movimientos reales</div>
          <div class="flex gap-6">
            <button class="btn-secondary btn-sm" data-acc-vista="mensual" style="${e.vista==="mensual"?"background:var(--accent);color:#04120c;border-color:var(--accent)":""}">Mes</button>
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
                   <input class="form-input" type="month" id="acc-periodo-desde" value="${m(e.periodoDesde)}" style="width:140px"/>
                 </div>
                 <div class="form-group" style="margin:0">
                   <label class="form-label">Hasta</label>
                   <input class="form-input" type="month" id="acc-periodo-hasta" value="${m(e.periodoHasta)}" style="width:140px"/>
                 </div>`:i?`<div class="form-group" style="margin:0">
                     <label class="form-label">Desde</label>
                     <input class="form-input" type="date" id="acc-intervalo-desde" value="${m(e.intervaloDesde)}" style="width:150px"/>
                   </div>
                   <div class="form-group" style="margin:0">
                     <label class="form-label">Hasta</label>
                     <input class="form-input" type="date" id="acc-intervalo-hasta" value="${m(e.intervaloHasta)}" style="width:150px"/>
                   </div>`:`<div class="form-group" style="margin:0">
                     <label class="form-label">Mes</label>
                     <input class="form-input" type="month" id="acc-mes" value="${m(e.mes)}" style="width:140px"/>
                   </div>`}
          <div class="form-group" style="margin:0;flex:1;min-width:120px">
            <label class="form-label">Buscar</label>
            <input class="form-input" type="text" id="acc-buscar" value="${m(e.filtroTexto)}" placeholder="concepto…"/>
          </div>
        </div>

        <div style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:12px;font-size:12px">
          <span>Gastos: ${Yt(nt(v))}</span>
          <span>Ingresos: ${Yt(nt(g))}</span>
          <span>Neto: ${Yt(nt(g+v))}</span>
          <span style="margin-left:auto">Saldo a ${m(c)}: <strong>${m(F(b))}</strong></span>
        </div>

        ${n?`<div class="text-sm mb-8" style="color:var(--text3)">Conceptos idénticos repetidos entre ${m(e.periodoDesde)} y ${m(e.periodoHasta)}. Cambia la estimación de la fila para asignarla a todos los movimientos del grupo a la vez.</div>
               ${la(_,e.porPagina,"conceptos")}
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
                     ${A||'<tr><td colspan="5" style="padding:18px;text-align:center;color:var(--text2);font-size:13px">Ningún concepto se repite en este periodo.</td></tr>'}
                   </tbody>
                 </table>
               </div>
               ${la(_,e.porPagina,"conceptos")}`:`${la(S,e.porPagina,"movimientos")}
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
               ${la(S,e.porPagina,"movimientos")}
               ${i?`<div class="divider"></div>
                      <div class="flex justify-between items-center flex-wrap mb-8" style="gap:8px">
                        <div class="card-title" style="margin:0">Real frente a estimado — ${m(r)} → ${m(c)}</div>
                        <div class="flex gap-6">
                          ${oo("neto",e.comparativa,"Neto","Ingresos menos gastos: no se descuadra por un traspaso entre tus cuentas")}
                          ${oo("gasto",e.comparativa,"Gasto","Solo el gasto")}
                          ${oo("ingreso",e.comparativa,"Ingresos","Solo lo que entra")}
                        </div>
                      </div>
                      ${Tl(M,e.comparativa)}`:""}`}
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
            <datalist id="acc-tags-list">${t.tagsConocidas().map($=>`<option value="${m($)}"></option>`).join("")}</datalist>
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
    </div>`}function Ll(t,e,a,o){const{ledger:s}=e,n=()=>{a.pagina=1,o()};tt(t,"#acc-cuenta",r=>{a.cuentaId=r.value,n()}),tt(t,"#acc-mes",r=>{a.mes=r.value||a.mes,n()}),L(t,"[data-acc-vista]",r=>{a.vista=r.getAttribute("data-acc-vista")||"mensual",n()}),tt(t,"#acc-periodo-desde",r=>{a.periodoDesde=r.value||a.periodoDesde,n()}),tt(t,"#acc-periodo-hasta",r=>{a.periodoHasta=r.value||a.periodoHasta,n()}),L(t,"[data-acc-pagina]",r=>{var c;r.disabled||(a.pagina=Number(r.getAttribute("data-acc-pagina"))||1,o(),(c=t.querySelector("[data-acc-tabla]"))==null||c.scrollIntoView({block:"start"}))}),tt(t,"[data-acc-por-pagina]",r=>{const c=Number(r.value);a.porPagina=Number.isFinite(c)&&c>=0?c:50,a.pagina=1,o()}),L(t,"[data-acc-comparativa]",r=>{a.comparativa=r.getAttribute("data-acc-comparativa")||"neto",o()}),tt(t,"#acc-intervalo-desde",r=>{a.intervaloDesde=r.value||a.intervaloDesde,n()}),tt(t,"#acc-intervalo-hasta",r=>{a.intervaloHasta=r.value||a.intervaloHasta,n()}),L(t,"[data-grp-detalle]",r=>{const c=r.getAttribute("data-grp-detalle");a.detalleAbierto.has(c)?a.detalleAbierto.delete(c):a.detalleAbierto.add(c),o()}),tt(t,"[data-grp-estimacion]",r=>{const c=r.getAttribute("data-grp-estimacion"),l=r.value||null,{desde:u,hasta:d}=so(a.periodoDesde,a.periodoHasta),p=s.transacciones({cuentaId:a.cuentaId||void 0,desde:u,hasta:d,texto:a.filtroTexto||void 0}),v=no(p).find(g=>g.concepto===c);if(v){for(const g of v.movimientos)s.asignarEstimacion(g._id,l);G(`Estimación asignada a ${v.movimientos.length} movimientos`),e.onDatosCambiados(),o()}}),L(t,"[data-grp-tags-asignar]",r=>{var b;const c=r.getAttribute("data-grp-tags-asignar"),l=((b=r.closest("tr"))==null?void 0:b.querySelector("[data-grp-tags]"))??null,u=((l==null?void 0:l.value)??"").split(",").map(y=>y.trim().toLowerCase()).filter(Boolean);if(u.length===0)return G("Escribe al menos una etiqueta","err");const{desde:d,hasta:p}=so(a.periodoDesde,a.periodoHasta),v=s.transacciones({cuentaId:a.cuentaId||void 0,desde:d,hasta:p,texto:a.filtroTexto||void 0}),g=no(v).find(y=>y.concepto===c);if(g){for(const y of g.movimientos)s.actualizar(y._id,{tags:[...new Set([...y.tags,...u])]});G(`Etiquetas añadidas a ${g.movimientos.length} movimientos`),e.onDatosCambiados(),o()}});const i=t.querySelector("#acc-buscar");i==null||i.addEventListener("input",()=>{a.filtroTexto=i.value,clearTimeout(i._t),i._t=window.setTimeout(()=>{n();const r=document.getElementById("acc-buscar");r&&(r.focus(),r.setSelectionRange(r.value.length,r.value.length))},200)}),L(t,"#nt-guardar",()=>{var u;const r=Et(t,"#nt-concepto").trim(),c=cs(t,"#nt-importe");if(!r)return G("Indica un concepto","err");if(!(c>0))return G("Indica un importe mayor que cero","err");const l=Et(t,"#nt-tags").split(",").map(d=>d.trim().toLowerCase()).filter(Boolean);s.registrar({fecha:Et(t,"#nt-fecha")||(e.hoy??ot)(),cuentaId:Et(t,"#nt-cuenta"),importe:c,concepto:r,tags:l,tipo:Et(t,"#nt-tipo"),estimacionId:Et(t,"#nt-estimacion")||null,imprevisto:((u=t.querySelector("#nt-imprevisto"))==null?void 0:u.checked)||void 0}),G("Movimiento registrado"),e.onDatosCambiados(),o()}),L(t,"[data-tx-borrar]",r=>{const c=r.dataset.txBorrar;$t("¿Eliminar este movimiento?")&&(s.eliminar(c),G("Movimiento eliminado"),e.onDatosCambiados(),o())}),L(t,"[data-tx-editar]",r=>{const c=r.dataset.txEditar,l=s.transacciones().find(p=>p._id===c);if(!l)return;const u=window.prompt(`Importe de "${l.concepto}" (€)`,String(Math.abs(nt(l.importeCts))));if(u===null)return;const d=parseFloat(u.replace(",","."));if(!Number.isFinite(d)||d<=0)return G("Importe no válido","err");s.actualizar(c,{importe:d}),G("Movimiento actualizado"),e.onDatosCambiados(),o()}),L(t,"[data-tx-imprevisto]",r=>{const c=r.getAttribute("data-tx-imprevisto"),l=s.transacciones().find(d=>d._id===c);if(!l)return;const u=!l.imprevisto;s.actualizar(c,{imprevisto:u||void 0}),G(u?l.estimacionId?"Marcado como imprevisto. Ojo: está asignado a una estimación y cuenta a través de ella":"Marcado como imprevisto":"Ya no es un imprevisto"),e.onDatosCambiados(),o()}),tt(t,"[data-tx-estimacion]",r=>{const c=r.getAttribute("data-tx-estimacion");s.asignarEstimacion(c,r.value||null),G("Asignación actualizada"),e.onDatosCambiados()}),tt(t,"[data-tx-tipo]",r=>{const c=r.getAttribute("data-tx-tipo");s.actualizar(c,{tipo:r.value}),G("Tipo actualizado"),e.onDatosCambiados(),o()}),L(t,"#pc-guardar",()=>{if(Et(t,"#pc-saldo").trim()==="")return G("Indica el saldo","err");const c=cs(t,"#pc-saldo");s.registrarPuntoControl(Et(t,"#pc-cuenta"),Et(t,"#pc-fecha")||(e.hoy??ot)(),c,Et(t,"#pc-nota").trim()||void 0),G("Saldo real registrado"),e.onDatosCambiados(),o()}),L(t,"[data-pc-borrar]",r=>{$t("¿Eliminar este punto de control?")&&(s.eliminarPuntoControl(r.dataset.pcBorrar),G("Punto de control eliminado"),e.onDatosCambiados(),o())})}function io(t,e,a={}){const{umbralPrecision:o=90,variacionMinimaPct:s=5}=a;if(t.precision===null||t.factorReciente===null||t.meses.length===0||t.precision>=o)return null;const n=Q(e*t.factorReciente),i=Q(n-e),r=e!==0?i/Math.abs(e)*100:n!==0?100:0;if(Math.abs(r)<s)return null;const c=t.meses.slice(-3).length;return{estimacionId:t.estimacionId,concepto:t.concepto,cuantiaActual:Q(e),cuantiaSugerida:n,diferencia:i,variacionPct:r,precision:t.precision,mesesConsiderados:c,motivo:i>0?`El gasto real de los últimos ${c} meses supera lo previsto en un ${Math.round((t.factorReciente-1)*100)} %`:`El gasto real de los últimos ${c} meses se queda un ${Math.round((1-t.factorReciente)*100)} % por debajo de lo previsto`}}function Ol(t){function e(){return`exp_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(n,i,r={}){const c=r.hoy??ot(),l=t.get("expenses"),u=l.find(g=>g._id===n);if(!u)throw new Error(`La estimación ${n} no existe`);const d={...u,fechaFin:c},p={...u,_id:e(),cuantia:Q(i),fechaInicio:c,fechaFin:u.fechaFin??null,ajustadaDesdeId:u._id,ajustadaEn:c},v=l.map(g=>g._id===n?d:g);return v.push(p),t.set("expenses",v),{estimacionCerrada:d,estimacionNueva:p}}function o(n,i={}){const r=[],c=[];for(const l of n)try{r.push(a(l.estimacionId,l.cuantiaSugerida,i))}catch(u){c.push({estimacionId:l.estimacionId,error:u.message})}return{aplicadas:r,errores:c}}function s(n){const i=t.get("expenses"),r=new Map(i.map(b=>[b._id,b])),c=r.get(n);if(!c)return[];const l=[];let u=c;const d=new Set;for(;u!=null&&u.ajustadaDesdeId&&!d.has(u._id);){d.add(u._id);const b=r.get(u.ajustadaDesdeId);if(!b)break;l.unshift(b),u=b}const p=[];let v=c;const g=new Set([c._id]);for(;;){const b=i.find(y=>y.ajustadaDesdeId===v._id&&!g.has(y._id));if(!b)break;g.add(b._id),p.push(b),v=b}return[...l,c,...p]}return{aplicar:a,aplicarTodas:o,cadena:s}}function tn(t){var s;const e=t.estimaciones(),a=((s=t.rango)==null?void 0:s.call(t))??null,o=new Map(e.map(n=>[n._id,n]));return t.precision.analizarTodas(e,a?{desde:a.desde,hasta:a.hasta}:{}).map(n=>{const i=o.get(n.estimacionId);return{analisis:n,estimacion:i,sugerencia:io(n,i.cuantia)}}).filter(n=>!!n.estimacion)}function Bl(t){var a;const e=((a=t.rango)==null?void 0:a.call(t))??null;return e?m(`Limitado al periodo de la cabecera (${e.desde} → ${e.hasta}): se comparan los meses ya cerrados que caen dentro, recortados al intervalo. El mes en curso nunca entra.`):"Se comparan solo los meses ya cerrados que tengan movimientos reales."}function Hl(t){var r;const e=tn(t),a=e.filter(c=>c.analisis.precision!==null),o=e.filter(c=>c.sugerencia!==null),s=t.precision.analizarPorTag(e.map(c=>c.analisis));if(a.length===0)return`
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
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(F(c.estimadoTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${m(F(c.realTotal))}</td>
        <td style="padding:7px 8px;text-align:right;font-family:var(--font-mono);font-size:12px">${Yt(c.desviacionTotal)}</td>
        <td style="padding:7px 8px;text-align:right">${Ai(c.precision)}</td>
      </tr>`).join(""),i=(c,l="left")=>`<th style="padding:7px 8px;text-align:${l};font-size:10px;text-transform:uppercase;color:var(--text3);font-family:var(--font-mono)">${c}</th>`;return`
    <div class="card mb-14">
      <div class="flex justify-between items-center mb-12" style="flex-wrap:wrap;gap:8px">
        <span class="card-title" style="margin:0">Ajuste de las estimaciones</span>
        ${o.length>0?`<button class="btn-primary" id="ajustar-todas" style="padding:6px 12px;font-size:12px">Ajustar automáticamente todas (${o.length})</button>`:""}
      </div>
      <div class="text-sm" style="color:var(--text2);line-height:1.6">
        ${Bl(t)}
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
    </div>`}function Gl(t,e,a){L(t,"#ajustar-todas",()=>{const o=tn(e).map(r=>r.sugerencia).filter(r=>r!==null);if(o.length===0)return;const s=o.map(r=>`• ${r.concepto}: ${F(r.cuantiaActual)} → ${F(r.cuantiaSugerida)}`).join(`
`);if(!$t(`Se van a ajustar ${o.length} estimaciones:

${s}

¿Continuar?`))return;const{aplicadas:n,errores:i}=e.adjuster.aplicarTodas(o,{hoy:e.hoy()});G(i.length>0?`${n.length} ajustadas, ${i.length} con error`:`${n.length} estimaciones ajustadas`,i.length>0?"warn":"ok"),e.onDatosCambiados(),a()})}const Vl=[";",",","	","|"],Ul={fecha:["fecha","f. valor","fecha valor","fecha operacion","date","f.operacion","f. operacion"],concepto:["concepto","descripcion","detalle","movimiento","referencia","description","observaciones"],importe:["importe","cantidad","amount","euros","import"],debe:["debe","cargo","salida","pago","debito"],haber:["haber","abono","entrada","ingreso","credito"]};function da(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().trim()}function ua(t,e){const a=[];let o="",s=!1;for(let n=0;n<t.length;n++){const i=t[n];s?i==='"'?t[n+1]==='"'?(o+='"',n++):s=!1:o+=i:i==='"'?s=!0:i===e?(a.push(o.trim()),o=""):o+=i}return a.push(o.trim()),a}function Yl(t){let e=";",a=-1;for(const o of Vl){const s=t.slice(0,20).map(c=>ua(c,o).length),n=Math.max(...s);if(n<2)continue;const r=s.filter(c=>c===n).length*10+n;r>a&&(a=r,e=o)}return e}function Ge(t){let e=(t??"").trim();if(!e)return null;let a=!1;if(/^\(.*\)$/.test(e)&&(a=!0,e=e.slice(1,-1).trim()),e.endsWith("-")&&(a=!0,e=e.slice(0,-1).trim()),e.startsWith("-")&&(a=!0,e=e.slice(1).trim()),e.startsWith("+")&&(e=e.slice(1).trim()),e=e.replace(/[€$£\s  ]/g,""),!e)return null;const o=e.lastIndexOf(","),s=e.lastIndexOf(".");let n="";o>=0&&s>=0?n=o>s?",":".":o>=0?n=/,\d{3}$/.test(e)&&e.replace(/,/g,"").length>3?"":",":s>=0&&(n=/\.\d{3}$/.test(e)&&e.replace(/\./g,"").length>3?"":".");let i,r="0";if(n){const u=n===","?o:s;i=e.slice(0,u).replace(/[.,]/g,""),r=e.slice(u+1).replace(/[.,]/g,"")}else i=e.replace(/[.,]/g,"");if(!/^\d*$/.test(i)||!/^\d*$/.test(r)||i===""&&r==="")return null;const c=(r+"00").slice(0,2),l=Number(i||"0")*100+Number(c);return Number.isFinite(l)?a?-l:l:null}function ro(t){const e=(t??"").trim();if(!e)return null;let a=e.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);if(a)return en(Number(a[1]),Number(a[2]),Number(a[3]));if(a=e.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/),a){let o=Number(a[3]);return o<100&&(o+=o<70?2e3:1900),en(o,Number(a[2]),Number(a[1]))}return null}function en(t,e,a){if(e<1||e>12||a<1||a>31)return null;const o=new Date(t,e-1,a);return o.getFullYear()!==t||o.getMonth()!==e-1||o.getDate()!==a?null:`${t}-${String(e).padStart(2,"0")}-${String(a).padStart(2,"0")}`}function an(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>ro(a)!==null).length/e.length}function on(t){const e=t.filter(a=>a.trim());return e.length===0?0:e.filter(a=>Ge(a)!==null).length/e.length}function Wl(t,e){const a={fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1},o=new Set,s=n=>e.map(i=>i[n]??"");for(const n of["fecha","importe","debe","haber","concepto"])for(let i=0;i<t.length;i++){if(o.has(i))continue;const r=da(t[i]);if(r&&Ul[n].some(c=>r===c||r.startsWith(c)||r.includes(c))){if(n==="importe"&&da(t[i]).includes("saldo"))continue;a[n]=i,o.add(i);break}}if(a.fecha<0){let n=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=an(s(r));c>i&&(i=c,n=r)}n>=0&&(a.fecha=n,o.add(n))}if(a.importe<0&&a.debe<0&&a.haber<0){let n=-1,i=.6;for(let r=0;r<t.length;r++){if(o.has(r)||da(t[r]).includes("saldo"))continue;const c=on(s(r));c>i&&(i=c,n=r)}n>=0&&(a.importe=n,o.add(n))}if(a.concepto<0){let n=-1,i=0;for(let r=0;r<t.length;r++){if(o.has(r))continue;const c=s(r);if(on(c)>.5||an(c)>.5)continue;const l=c.reduce((u,d)=>u+d.length,0)/Math.max(1,c.length);l>i&&(i=l,n=r)}n>=0&&(a.concepto=n)}return a}function Kl(t){const e=t.replace(/^﻿/,"").split(/\r\n|\n|\r/).filter(u=>u.trim()!=="");if(e.length===0)return{separador:";",cabeceras:[],filas:[],lineaCabecera:0,mapeo:{fecha:-1,concepto:-1,importe:-1,debe:-1,haber:-1}};const a=Yl(e),o=e.map(u=>ua(u,a).length),s=Math.max(...o);let n=o.findIndex(u=>u===s);n<0&&(n=0);const i=ua(e[n],a);let r=e.slice(n+1).map(u=>ua(u,a));const c=ro(i[0]??"")!==null||i.some(u=>Ge(u)!==null&&/\d/.test(u));c&&(r=[i,...r]);const l=Wl(c?i.map(()=>""):i,r.slice(0,40));return{separador:a,cabeceras:c?i.map((u,d)=>`Columna ${d+1}`):i,filas:r,lineaCabecera:n+1,mapeo:l}}function sn(t,e,a){return`${t}|${e}|${da(a).replace(/\s+/g," ")}`}function Jl(t,e,a=[]){const o=new Map;for(const n of a){const i=sn(n.fecha,n.importeCts,n.concepto);o.set(i,(o.get(i)??0)+1)}const s=new Map;return t.filas.map((n,i)=>{const r=[],c=e.fecha>=0?ro(n[e.fecha]??""):null;e.fecha<0?r.push("sin columna de fecha"):c||r.push(`fecha ilegible: «${n[e.fecha]??""}»`);let l=null;if(e.importe>=0)l=Ge(n[e.importe]??""),l===null&&r.push(`importe ilegible: «${n[e.importe]??""}»`);else if(e.debe>=0||e.haber>=0){const p=e.debe>=0?Ge(n[e.debe]??""):null,v=e.haber>=0?Ge(n[e.haber]??""):null;p===null&&v===null?r.push("sin importe en Debe ni en Haber"):p!==null&&p!==0?l=-Math.abs(p):v!==null&&v!==0?l=Math.abs(v):l=0}else r.push("sin columna de importe");l===0&&r.push("importe cero");const u=(e.concepto>=0?n[e.concepto]??"":"").trim()||"Movimiento importado";let d=!1;if(c&&l!==null){const p=sn(c,l,u),v=(s.get(p)??0)+1;s.set(p,v),d=v<=(o.get(p)??0)}return{linea:t.lineaCabecera+1+i,fecha:c,concepto:u,importeCts:l,errores:r,duplicada:d}})}function Xl(t,e){const a=t.filter(s=>s.errores.length===0&&(e||!s.duplicada)),o=a.map(s=>s.fecha).filter(s=>!!s).sort();return{total:t.length,importables:a.length,conError:t.filter(s=>s.errores.length>0).length,duplicadas:t.filter(s=>s.duplicada).length,sumaCts:a.reduce((s,n)=>s+(n.importeCts??0),0),desde:o[0]??null,hasta:o[o.length-1]??null}}function pa(){return{abierto:!1,nombreFichero:"",analisis:null,mapeo:null,filas:[],cuentaId:"",incluirDuplicadas:!1,error:""}}const Ql=[{clave:"fecha",etiqueta:"Fecha"},{clave:"concepto",etiqueta:"Concepto"},{clave:"importe",etiqueta:"Importe (con signo)"},{clave:"debe",etiqueta:"Debe (salidas)"},{clave:"haber",etiqueta:"Haber (entradas)"}];function co(t,e){if(!e.analisis||!e.mapeo){e.filas=[];return}const a=t.ledger.transacciones(e.cuentaId?{cuentaId:e.cuentaId}:{}).map(o=>({fecha:o.fecha,importeCts:o.importeCts,concepto:o.concepto}));e.filas=Jl(e.analisis,e.mapeo,a)}function Zl(t,e){const a=t.accounts().filter(s=>s.activo);if(!e.abierto)return`
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
      </div>`;const o=a.map(s=>`<option value="${m(s._id)}"${s._id===e.cuentaId?" selected":""}>${m(s.nombre)}</option>`).join("");return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">Importar extracto</div>
        <button class="btn-secondary btn-sm" data-imp-cerrar>Cancelar</button>
      </div>

      ${e.error?`<div class="alert-card alert-danger mb-12"><div class="alert-body">${m(e.error)}</div></div>`:""}

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

      ${e.analisis&&e.mapeo?ed(e,e.analisis,e.mapeo):td()}
    </div>`}function td(){return`
    <div class="text-sm" style="color:var(--text3);line-height:1.7">
      Se reconocen los formatos habituales de los bancos españoles: separador <code>;</code>,
      importes como <code>1.234,56</code>, fechas <code>dd/mm/aaaa</code> y columnas
      <em>Debe</em>/<em>Haber</em> separadas. Si algo se detecta mal, se puede corregir a mano
      antes de importar.
    </div>`}function ed(t,e,a){const o=Xl(t.filas,t.incluirDuplicadas),s=r=>`<option value="-1"${r<0?" selected":""}>— ninguna —</option>`+e.cabeceras.map((c,l)=>`<option value="${l}"${l===r?" selected":""}>${m(c||`Columna ${l+1}`)}</option>`).join(""),n=t.filas.filter(r=>r.errores.length>0),i=t.filas.slice(0,12);return`
    <div class="divider"></div>

    <div class="text-sm mb-12" style="color:var(--text2)">
      <strong>${m(t.nombreFichero)}</strong> · ${e.filas.length} línea${e.filas.length!==1?"s":""}
      · separador <code>${m(e.separador==="	"?"tabulador":e.separador)}</code>
    </div>

    <div class="card-title mb-8">Qué es cada columna</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:14px">
      ${Ql.map(r=>`<div class="form-group">
          <label class="form-label" for="imp-col-${r.clave}">${m(r.etiqueta)}</label>
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
        <div class="stat-value" style="font-size:1.15rem">${Yt(nt(o.sumaCts))}</div>
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
          ${i.map(r=>{const c=r.errores.length>0,l=c?r.errores[0]:r.duplicada?"repetido":"se importa",u=c?"var(--red)":r.duplicada?"var(--yellow)":"var(--accent)";return`<tr style="${c?"opacity:0.55":""}">
                <td style="font-family:var(--font-mono);font-size:12px">${m(r.fecha??"—")}</td>
                <td style="font-size:12px">${m(r.concepto)}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${r.importeCts===null?"—":m(F(nt(r.importeCts)))}</td>
                <td style="font-size:11px;color:${u}">${m(l)}</td>
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
    ${t.cuentaId?"":'<div class="text-sm mt-8" style="color:var(--yellow);text-align:right">Elige antes la cuenta de destino.</div>'}`}function ad(t,e,a,o){L(t,"[data-imp-sincronizar]",()=>{const n=e.ledger.sincronizarHistoricoImportado();if(n.length===0)return G("Nada que sincronizar: no hay movimientos importados todavía");const i=u=>{var d;return((d=e.accounts().find(p=>p._id===u))==null?void 0:d.nombre)??u},r=n.reduce((u,d)=>u+d.eliminados,0),c=n.reduce((u,d)=>u+d.semanales,0),l=n.map(u=>`${i(u.cuentaId)} (${u.semanales})`).join(", ");G(`Histórico al día: ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""} · ${l}`+(r>0?` · ${r} manual${r!==1?"es":""} sustituido${r!==1?"s":""}`:"")),e.onDatosCambiados(),o()}),L(t,"[data-imp-abrir]",()=>{const n=e.accounts().filter(i=>i.activo);Object.assign(a,pa(),{abierto:!0,cuentaId:n.length===1?n[0]._id:""}),o()}),L(t,"[data-imp-cerrar]",()=>{Object.assign(a,pa()),o()}),tt(t,"#imp-cuenta",n=>{a.cuentaId=n.value,co(e,a),o()}),tt(t,"#imp-duplicadas",n=>{a.incluirDuplicadas=n.checked,o()}),tt(t,"[data-imp-col]",n=>{const i=n,r=i.dataset.impCol;a.mapeo&&(a.mapeo[r]=Number(i.value),co(e,a),o())});const s=t.querySelector("#imp-fichero");s==null||s.addEventListener("change",()=>{var i;const n=(i=s.files)==null?void 0:i[0];n&&od(n).then(r=>{const c=Kl(r);a.nombreFichero=n.name,a.error=c.filas.length===0?"El fichero no tiene ninguna línea de datos reconocible.":"",a.analisis=c,a.mapeo={...c.mapeo},co(e,a),o()}).catch(r=>{a.error=`No se ha podido leer el fichero: ${r.message}`,o()})}),L(t,"[data-imp-confirmar]",()=>{if(!a.cuentaId)return;const n=a.filas.filter(l=>l.errores.length===0&&(a.incluirDuplicadas||!l.duplicada));if(n.length===0)return;for(const l of n)e.ledger.registrar({fecha:l.fecha,cuentaId:a.cuentaId,importe:Math.abs(nt(l.importeCts)),tipo:l.importeCts<0?"gasto":"ingreso",concepto:l.concepto,origen:"importado"});const i=n.map(l=>l.fecha).sort(),r=e.ledger.eliminarPuntosControlEnRango(a.cuentaId,i[0],i[i.length-1]),c=e.ledger.generarPuntosSemanales(a.cuentaId);G(`${n.length} movimiento${n.length!==1?"s":""} importado${n.length!==1?"s":""} · histórico con ${c} punto${c!==1?"s":""} semanal${c!==1?"es":""}`+(r>0?` · ${r} punto${r!==1?"s":""} de control manual sustituido${r!==1?"s":""}`:"")),Object.assign(a,pa()),e.onDatosCambiados(),o()})}function od(t){return t.arrayBuffer().then(e=>{const a=new TextDecoder("utf-8").decode(e);if(!a.includes("�"))return a;try{return new TextDecoder("iso-8859-1").decode(e)}catch{return a}})}function sd(t,e){if(e<t)return 0;let a=0,[o,s]=t.slice(0,7).split("-").map(Number);for(;`${o}-${String(s).padStart(2,"0")}`<=e.slice(0,7);){const n=new Date(o,s,0).getDate(),i=`${o}-${String(s).padStart(2,"0")}-01`,r=`${o}-${String(s).padStart(2,"0")}-${String(n).padStart(2,"0")}`,c=t>i?t:i,l=e<r?e:r,u=(K(l).getTime()-K(c).getTime())/864e5+1;a+=u/n,++s>12&&(s=1,o++)}return a}function nd(t){const[e,a]=t.split("-").map(Number),o=new Date(e,a,0).getDate();return{desde:`${t}-01`,hasta:`${t}-${String(o).padStart(2,"0")}`}}function id(t){const[e,a]=t.slice(0,7).split("-").map(Number),o=new Date(e,a-2,1);return`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}`}function lo(t){return t.normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\d+/g,"").replace(/\s+/g," ").trim()}function nn(t,e,a){const o=new Map(e.map(n=>[n._id,[]])),s=e.filter(n=>{var i;return!a(n._id)&&(((i=n.tags)==null?void 0:i.length)??0)>0});for(const n of t){if(n.estimacionId&&o.has(n.estimacionId)){o.get(n.estimacionId).push(n);continue}if(n.estimacionId)continue;let i=null,r=0;for(const c of s){const l=(c.tags??[]).filter(u=>n.tags.includes(u)).length;l!==0&&(l>r||l===r&&i&&c._id<i._id)&&(i=c,r=l)}i&&o.get(i._id).push(n)}return o}function rn(t,e,a,o={}){const n=t.filter(c=>c.tipo!=="transferencia"&&c.activo!==!1&&Ye(c.fechaInicio,c.fechaFin,e,a)).map(c=>({_id:c._id,concepto:c.concepto,tipo:c.tipo==="ingreso"?"ingreso":"gasto",tags:c.tags??[],estimado:Q(ao(c,e,a)),origen:"estimacion",periodicidad:$o(c.tipoFrecuencia,c.frecuencia),cuantia:c.cuantia})),i=(o.nominas??[]).filter(c=>c.activo!==!1&&Ye(c.fechaInicio,c.fechaFin,e,a));if(i.length>0){const c=Ea(i,{start:e,end:a},null,[],o.resolverTramosIRPF);for(const l of i){const d=c.filter(p=>p.sourceId===l._id||p.sourceId.startsWith(`${l._id}_`)).reduce((p,v)=>p+(v.tipo==="ingreso"?Math.abs(v.cuantia):-Math.abs(v.cuantia)),0);n.push({_id:l._id,concepto:l.nombre,tipo:"ingreso",tags:l.tags??[],estimado:Q(d),origen:"nomina",periodicidad:`${l.nPagas} pagas al año`})}}const r=(o.loans??[]).filter(c=>c.activo!==!1);if(r.length>0){const c=Ma(r,{start:e,end:a});for(const l of r){const u=c.filter(d=>d.sourceId===l._id);u.length!==0&&n.push({_id:l._id,concepto:`Cuota ${l.nombre}`,tipo:"gasto",tags:l.tags??[],estimado:Q(u.reduce((d,p)=>d+Math.abs(p.cuantia),0)),origen:"prestamo",periodicidad:"cuota mensual"})}}return n}function rd(t,e,a,o={}){const{desde:s,hasta:n}=nd(a);return{...cn(t,e,s,n,o),mes:a}}function cn(t,e,a,o,s={}){const n=t.transacciones({desde:a,hasta:o}),i=new Set(s.omitidos??[]),r=D=>D.tipo!=="transferencia"&&!i.has(lo(D.concepto)),c=n.filter(D=>r(D)&&D.importeCts<0),l=n.filter(D=>r(D)&&D.importeCts>0),u=n.filter(D=>D.tipo!=="transferencia"&&i.has(lo(D.concepto))),d=new Map((s.analisis??[]).map(D=>[D.estimacionId,D])),p=rn(e,a,o,s),v=D=>new Set(D.filter(z=>t.transacciones({estimacionId:z._id}).length>0).map(z=>z._id)),g=p.filter(D=>D.tipo==="gasto"),b=p.filter(D=>D.tipo==="ingreso"),y=nn(c,g,D=>v(g).has(D)),f=nn(l,b,D=>v(b).has(D)),h=new Set,C=new Set,S=(D,z,k)=>{for(const j of z)k.add(j._id);const V=Q(z.reduce((j,N)=>j+Math.abs(N.importeCts)/100,0)),H=D.origen==="estimacion"?d.get(D._id):void 0;return{estimacionId:D._id,concepto:D.concepto,tipo:D.tipo,origen:D.origen,periodicidad:D.periodicidad,tags:D.tags,estimado:D.estimado,real:V,desviacion:Q(V-D.estimado),sinMovimiento:z.length===0,sugerencia:H?io(H,D.cuantia??0,{hoy:s.hoy}):null}},I=g.map(D=>S(D,y.get(D._id)??[],h)),E=b.map(D=>S(D,f.get(D._id)??[],C)),M=(D,z)=>{const k=new Map;for(const V of D){if(z.has(V._id))continue;const H=lo(V.concepto),j=k.get(H)??{concepto:V.concepto,clave:H,total:0,movimientos:0,ids:[]};j.total=Q(j.total+Math.abs(V.importeCts)/100),j.movimientos+=1,j.ids.push(V._id),k.set(H,j)}return[...k.values()].sort((V,H)=>H.total-V.total)},w=M(c,h),x=M(l,C),_=M(u,new Set),A=Q(I.reduce((D,z)=>D+z.estimado,0)),P=Q(c.reduce((D,z)=>D+Math.abs(z.importeCts)/100,0)),$=Q(E.reduce((D,z)=>D+z.estimado,0)),T=Q(l.reduce((D,z)=>D+z.importeCts/100,0));return{mes:a.slice(0,7),desde:a,hasta:o,estimado:A,real:P,desviacion:Q(P-A),ingresosEstimados:$,ingresosReales:T,desviacionIngresos:Q(T-$),netoEstimado:Q($-A),netoReal:Q(T-P),desviacionNeta:Q(T-P-($-A)),filas:[...I,...E].sort((D,z)=>Math.abs(z.desviacion)-Math.abs(D.desviacion)),sinEstimacion:w,totalSinEstimacion:Q(w.reduce((D,z)=>D+z.total,0)),ingresosSinPrever:x,totalIngresosSinPrever:Q(x.reduce((D,z)=>D+z.total,0)),porTag:cd(g,c),meses:sd(a,o),omitidos:_,totalOmitido:Q(_.reduce((D,z)=>D+z.total,0)),vacio:n.length===0}}function cd(t,e){const a=new Map,o=(s,n,i)=>{for(const r of s.length>0?s:["sin etiqueta"]){const c=a.get(r)??{estimado:0,real:0};c[n]+=i,a.set(r,c)}};for(const s of t)o(s.tags,"estimado",s.estimado);for(const s of e)o(s.tags,"real",Math.abs(s.importeCts)/100);return[...a.entries()].map(([s,n])=>({tag:s,estimado:Q(n.estimado),real:Q(n.real),desviacion:Q(n.real-n.estimado)})).filter(s=>s.estimado>0||s.real>0).sort((s,n)=>n.real-s.real||n.estimado-s.estimado)}function ln(t){const e=new Set;for(const a of t.transacciones())e.add(a.fecha.slice(0,7));return[...e].sort().reverse()}const ma=26,uo=7,po=(ma+uo)*2,dn=2*Math.PI*ma,un=12;function ld(t){if(t.estimado<=0)return t.real>0?{color:"var(--yellow)",fraccion:1,etiqueta:["sin","prever"]}:{color:"var(--text3)",fraccion:0,etiqueta:["—"]};const e=t.real/t.estimado*100;return{color:e>110?"var(--red)":e>100?"var(--yellow)":"var(--accent)",fraccion:Math.min(1,t.real/t.estimado),etiqueta:[`${Math.round(e)}%`]}}function dd(t){const{color:e,fraccion:a,etiqueta:o}=ld(t),s=po/2,n=`${t.tag}: real ${F(t.real)} de ${F(t.estimado)} previsto (${t.desviacion>=0?"+":""}${F(t.desviacion)})`;return`
    <div style="text-align:center;min-width:96px">
      <svg viewBox="0 0 ${po} ${po}" style="width:78px;height:78px" role="img" aria-label="${m(n)}">
        <title>${m(n)}</title>
        <circle cx="${s}" cy="${s}" r="${ma}" fill="none" stroke="var(--bg3)" stroke-width="${uo}"/>
        <circle cx="${s}" cy="${s}" r="${ma}" fill="none" stroke="${e}" stroke-width="${uo}"
                stroke-linecap="round" stroke-dasharray="${(dn*a).toFixed(2)} ${dn.toFixed(2)}"
                transform="rotate(-90 ${s} ${s})"/>
        ${o.map((i,r)=>{const c=o.length>1?9:12,l=s+(o.length>1?r*10-1:4);return`<text x="${s}" y="${l}" text-anchor="middle" font-size="${c}" font-family="var(--font-mono)" fill="var(--text2)">${m(i)}</text>`}).join("")}
      </svg>
      <div style="font-size:11px;color:var(--text);margin-top:2px;word-break:break-word">${m(t.tag)}</div>
      <div style="font-size:10px;color:var(--text2);font-family:var(--font-mono)">${m(F(t.real))}</div>
      <div style="font-size:10px;color:var(--text3);font-family:var(--font-mono)">de ${m(F(t.estimado))}</div>
    </div>`}function ud(t){if(t.length===0)return'<div class="text-sm" style="color:var(--text3)">Sin gasto etiquetado en este periodo.</div>';const e=t.slice(0,un),a=t.slice(un),o=a.reduce((s,n)=>s+n.real,0);return`
    <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start">
      ${e.map(dd).join("")}
    </div>
    <div class="flex flex-wrap" style="gap:6px 18px;font-size:11px;color:var(--text2);margin-top:10px">
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--accent);margin-right:4px"></span>dentro de lo previsto</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--yellow);margin-right:4px"></span>pasado o sin prever</span>
      <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--red);margin-right:4px"></span>más de un 10 % por encima</span>
      ${a.length>0?`<span style="color:var(--text3)">y ${a.length} etiqueta(s) más, ${m(F(o))}</span>`:""}
    </div>`}function pd(){return{mes:"",modo:"mes"}}function pn(t,e){if(e.mes)return e.mes;const a=ln(t.ledger),o=id((t.hoy??ot)());return a.includes(o)?o:a[0]??o}function Ve(t,e){var i;const a=(t.hoy??ot)(),o=t.estimaciones(),s={hoy:a,nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(i=t.resolverTramosIRPF)==null?void 0:i.call(t),omitidos:t.omitidos()};if(e.modo==="periodo"){const{desde:r,hasta:c}=t.periodo(),l=t.precision.analizarTodas(o,{hoy:a,desde:r,hasta:c});return cn(t.ledger,o,r,c,{...s,analisis:l})}const n=t.precision.analizarTodas(o,{hoy:a});return rd(t.ledger,o,pn(t,e),{...s,analisis:n})}function mn(t){var s;const e=(t.hoy??ot)(),a=rn(t.estimaciones(),e,e,{nominas:t.nominas(),loans:t.loans(),resolverTramosIRPF:(s=t.resolverTramosIRPF)==null?void 0:s.call(t)}),o=n=>a.filter(i=>i.tipo===n).map(i=>`<option value="${m(i._id)}">${m(i.concepto)}</option>`).join("");return{gasto:o("gasto"),ingreso:o("ingreso")}}function Rt(t,e){return e<=0?"—":`${m(F(t/e))}/mes`}function fn(t,e,a,o){const s=e?"background:var(--accent);color:#04120c;border-color:var(--accent)":"";return`<button class="btn-secondary btn-sm" data-cie-modo="${t}" title="${m(o)}" style="${s}">${m(a)}</button>`}function md(t,e){const a=e.modo==="periodo",o=pn(t,e),s=ln(t.ledger);s.includes(o)||s.unshift(o);const n=Ve(t,e),i=a?"Cierre del periodo":"Cierre de mes",r=a?`del ${m(n.desde)} al ${m(n.hasta)}`:m(bt(o)),c=`
    <div class="flex gap-6 items-center flex-wrap">
      ${fn("mes",!a,"Mes","Cierra un mes natural completo")}
      ${fn("periodo",a,"Periodo del header","Cierra el intervalo configurado arriba, aunque cruce varios meses o corte uno por la mitad")}
      ${a?`<span class="text-sm" style="color:var(--text2);font-family:var(--font-mono);margin-left:4px">${m(n.desde)} → ${m(n.hasta)}</span>`:`<select class="form-select" id="cie-mes" style="width:auto;min-width:150px">
               ${s.map(d=>`<option value="${m(d)}"${d===o?" selected":""}>${m(bt(d))}</option>`).join("")}
             </select>`}
    </div>`;if(n.vacio)return`
      <div class="card">
        <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
          <div class="card-title" style="margin:0">${i}</div>
          ${c}
        </div>
        <div class="text-sm" style="color:var(--text2);line-height:1.7">
          No hay movimientos registrados ${a?"":"en "}${r}. Importa el extracto del banco o
          registra los movimientos a mano y aquí verás en qué te desviaste respecto a lo que habías previsto.
        </div>
      </div>`;const l=d=>d>0?"+":"",u=n.desviacionNeta<0?"var(--red)":n.desviacionNeta>0?"var(--accent)":"var(--text2)";return`
    <div class="card">
      <div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
        <div class="card-title" style="margin:0">${i}</div>
        ${c}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:6px">
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Gasto</div>
          <div class="stat-value" style="font-size:1.15rem">${m(F(n.real))}</div>
          <div class="stat-sub">${Rt(n.real,n.meses)} · previsto ${m(F(n.estimado))} (${Rt(n.estimado,n.meses)})</div>
          <div class="stat-sub">${l(n.desviacion)}${m(F(n.desviacion))} · ${l(n.desviacion)}${Rt(n.desviacion,n.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Ingresos</div>
          <div class="stat-value" style="font-size:1.15rem">${m(F(n.ingresosReales))}</div>
          <div class="stat-sub">${Rt(n.ingresosReales,n.meses)} · previsto ${m(F(n.ingresosEstimados))} (${Rt(n.ingresosEstimados,n.meses)})</div>
          <div class="stat-sub">${l(n.desviacionIngresos)}${m(F(n.desviacionIngresos))} · ${l(n.desviacionIngresos)}${Rt(n.desviacionIngresos,n.meses)}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Desviación neta</div>
          <div class="stat-value" style="font-size:1.15rem;color:${u}">${l(n.desviacionNeta)}${m(F(n.desviacionNeta))}</div>
          <div class="stat-sub">${l(n.desviacionNeta)}${Rt(n.desviacionNeta,n.meses)}</div>
          <div class="stat-sub">neto real ${m(F(n.netoReal))} · previsto ${m(F(n.netoEstimado))}</div>
        </div>
        <div class="stat-card" style="padding:12px">
          <div class="stat-label">Sin prever</div>
          <div class="stat-value" style="font-size:1.15rem;color:${n.totalSinEstimacion>0?"var(--yellow)":"var(--text)"}">${m(F(n.totalSinEstimacion))}</div>
          <div class="stat-sub">${Rt(n.totalSinEstimacion,n.meses)} · ${n.sinEstimacion.length} concepto${n.sinEstimacion.length!==1?"s":""} de gasto</div>
          <div class="stat-sub">${n.totalIngresosSinPrever>0?`${m(F(n.totalIngresosSinPrever))} de ingreso`:"sin ingresos sueltos"}</div>
        </div>
      </div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        El periodo son ${m(n.meses.toFixed(1).replace(".",","))} meses; «/mes» es el total repartido entre ellos.
      </div>

      ${fd(n)}
      ${gd(n,mn(t))}
      ${bd(n,mn(t))}
      ${vd(n)}
    </div>

    <div class="card mb-14">
      <div class="card-title mb-8">Real frente a previsto por etiqueta</div>
      <div class="text-sm mb-12" style="color:var(--text3)">
        Cada anillo es una etiqueta: cuánto llevas gastado de lo que tenías previsto en el periodo.
        Un movimiento con varias etiquetas cuenta en todas, así que los anillos no reparten el total.
      </div>
      ${ud(n.porTag)}
    </div>`}function fd(t){const e=t.filas.filter(o=>o.estimado>0||o.real>0);if(e.length===0)return'<div class="text-sm" style="color:var(--text3)">No tienes estimaciones de gasto activas en este periodo.</div>';const a=e.filter(o=>o.sugerencia);return`
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
          ${e.map(o=>{const s=o.tipo==="gasto"?o.desviacion>0:o.desviacion<0,n=o.desviacion===0?"var(--text2)":s?"var(--red)":"var(--accent)",i=o.sugerencia;return`<tr>
                <td style="font-size:12px">
                  ${m(o.concepto)}
                  ${o.tipo==="ingreso"?'<span class="badge" style="margin-left:6px">ingreso</span>':""}
                  ${o.sinMovimiento?'<span class="badge badge-yellow" style="margin-left:6px">sin movimiento</span>':""}
                  <div style="font-size:10px;color:var(--text3)">${m(o.periodicidad)}</div>
                </td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(F(o.estimado))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px">${m(F(o.real))}</td>
                <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${n}">
                  ${o.desviacion>0?"+":""}${m(F(o.desviacion))}
                </td>
                <td style="text-align:right">
                  ${i?`<button class="btn-secondary btn-sm" data-cie-ajustar="${m(o.estimacionId)}"
                           title="Pasar el importe de cada pago (${m(o.periodicidad)}) de ${m(F(i.cuantiaActual))} a ${m(F(i.cuantiaSugerida))} · ${m(i.motivo)}"
                           style="font-size:11px;padding:2px 9px">→ ${m(F(i.cuantiaSugerida))}/pago</button>`:""}
                </td>
              </tr>`}).join("")}
        </tbody>
      </table>
    </div>
    ${a.length>0?`<div class="flex justify-between items-center mb-12" style="gap:10px;flex-wrap:wrap">
             <div class="text-sm" style="color:var(--text2)">
               ${a.length===1?"1 estimación se desvía":`${a.length} estimaciones se desvían`}
               de forma sistemática. El importe propuesto es el de CADA pago, con la periodicidad de la estimación:
               ajustarla cierra la de hoy y abre una nueva con ese importe corregido.
             </div>
             <button class="btn-primary btn-sm" data-cie-ajustar-todas>Ajustar todas</button>
           </div>`:""}`}function gn(t,e,a,o){return`<tr>
    <td style="font-size:12px">${m(t.concepto)}</td>
    <td style="text-align:right;font-size:12px;color:var(--text3)">${t.movimientos}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:12px;color:${o}">${m(F(t.total))}</td>
    <td style="text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--text3)">${Rt(t.total,e)}</td>
    <td style="text-align:right;white-space:nowrap">
      <select class="form-select" data-cie-asignar="${m(t.clave)}" style="font-size:11px;padding:2px 6px;max-width:150px">
        <option value="">Asignar a…</option>
        ${a}
      </select>
      <button class="btn-secondary btn-sm" data-cie-imprevisto="${m(t.clave)}" title="Marcar estos movimientos como imprevisto: se siguen aparte en «Este mes» y entran en la estimación de imprevistos"
              style="font-size:11px;padding:2px 8px;margin-left:4px">⚡ Imprevisto</button>
      <button class="btn-secondary btn-sm" data-cie-omitir="${m(t.clave)}" title="No contar este concepto en el cierre"
              style="font-size:11px;padding:2px 8px;margin-left:4px">Omitir</button>
    </td>
  </tr>`}const vn=`<thead><tr>
  <th style="cursor:default">Concepto</th>
  <th style="cursor:default;text-align:right">Movimientos</th>
  <th style="cursor:default;text-align:right">Total</th>
  <th style="cursor:default;text-align:right">Al mes</th>
  <th style="cursor:default"></th>
</tr></thead>`;function gd(t,e){return t.sinEstimacion.length===0?`<div class="alert-card alert-info">
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
        ${vn}
        <tbody>
          ${t.sinEstimacion.slice(0,10).map(a=>gn(a,t.meses,e.gasto,"var(--yellow)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.sinEstimacion.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.sinEstimacion.length-10} concepto(s) más.</div>`:""}`}function vd(t){return t.omitidos.length===0?"":`
    <div class="card-title mb-8 mt-14">No se cuentan</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      ${t.omitidos.length} concepto(s) omitido(s), ${m(F(t.totalOmitido))} en el periodo. No suman ni en gasto ni en ingresos.
    </div>
    <div class="flex gap-6 flex-wrap">
      ${t.omitidos.map(e=>`<button class="btn-secondary btn-sm" data-cie-restaurar="${m(e.clave)}" title="Volver a contarlo"
                    style="font-size:11px;padding:2px 9px">${m(e.concepto)} · ${m(F(e.total))} ✕</button>`).join("")}
    </div>`}function bd(t,e){return t.ingresosSinPrever.length===0?"":`
    <div class="card-title mb-8 mt-14">Ingresos que no tenías previstos</div>
    <div class="text-sm mb-8" style="color:var(--text3)">
      Si alguno es el otro lado de un traspaso entre tus cuentas, márcalo como transferencia en Movimientos
      y dejará de contar en los dos sitios.
    </div>
    <div class="table-wrap">
      <table style="min-width:520px">
        ${vn}
        <tbody>
          ${t.ingresosSinPrever.slice(0,10).map(a=>gn(a,t.meses,e.ingreso,"var(--accent)")).join("")}
        </tbody>
      </table>
    </div>
    ${t.ingresosSinPrever.length>10?`<div class="text-sm mt-8" style="color:var(--text3)">…y ${t.ingresosSinPrever.length-10} concepto(s) más.</div>`:""}`}function hd(t,e,a,o){tt(t,"#cie-mes",s=>{a.mes=s.value,o()}),L(t,"[data-cie-modo]",s=>{a.modo=s.getAttribute("data-cie-modo")||"mes",o()}),L(t,"[data-cie-omitir]",s=>{const n=s.getAttribute("data-cie-omitir"),i=e.omitidos();i.includes(n)||(e.setOmitidos([...i,n]),G("Concepto omitido: deja de contar en el cierre"),o())}),L(t,"[data-cie-imprevisto]",s=>{var c;const n=s.getAttribute("data-cie-imprevisto"),r=Ve(e,a).sinEstimacion.find(l=>l.clave===n);if(r){for(const l of r.ids)e.ledger.actualizar(l,{imprevisto:!0});G(`${r.ids.length} movimiento${r.ids.length===1?"":"s"} marcado${r.ids.length===1?"":"s"} como imprevisto`),(c=e.onDatosCambiados)==null||c.call(e),o()}}),L(t,"[data-cie-restaurar]",s=>{const n=s.getAttribute("data-cie-restaurar");e.setOmitidos(e.omitidos().filter(i=>i!==n)),o()}),tt(t,"[data-cie-asignar]",s=>{const n=s,i=n.getAttribute("data-cie-asignar"),r=n.value;if(!r)return;const c=Ve(e,a),l=[...c.sinEstimacion,...c.ingresosSinPrever].find(u=>u.clave===i);if(l){if(!$t(`Se van a asignar ${l.movimientos} movimiento(s) de «${l.concepto}». ¿Continuar?`)){n.value="";return}for(const u of l.ids)e.ledger.asignarEstimacion(u,r);G(`${l.movimientos} movimiento(s) asignados`),e.onDatosCambiados(),o()}}),L(t,"[data-cie-ajustar]",s=>{const n=s.dataset.cieAjustar,r=Ve(e,a).filas.find(c=>c.estimacionId===n);r!=null&&r.sugerencia&&(e.adjuster.aplicar(r.sugerencia.estimacionId,r.sugerencia.cuantiaSugerida,{hoy:(e.hoy??ot)()}),G(`«${r.concepto}» ajustada a ${F(r.sugerencia.cuantiaSugerida)}`),e.onDatosCambiados(),o())}),L(t,"[data-cie-ajustar-todas]",()=>{const n=Ve(e,a).filas.map(c=>c.sugerencia).filter(c=>c!==null);if(n.length===0)return;const{aplicadas:i,errores:r}=e.adjuster.aplicarTodas(n,{hoy:(e.hoy??ot)()});G((i.length===1?"1 estimación ajustada":`${i.length} estimaciones ajustadas`)+(r.length>0?` · ${r.length} con error`:"")),e.onDatosCambiados(),o()})}const yd="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z";function $d(t){const e=t.hoy??ot,a=()=>{var z;return(z=t.onDatosCambiados)==null?void 0:z.call(t)},o=new Map;let s="cuentas";const n=jl(e().slice(0,7)),i=pa(),r=pd(),c=()=>t.store.get("expenses"),l=()=>t.store.get("accounts"),u={ledger:t.ledger,accounts:l,estimaciones:c,loans:()=>t.store.get("loans"),nominas:()=>t.store.get("nominas"),tagsConocidas:()=>t.tags.todas(),onDatosCambiados:a,hoy:e},d={ledger:t.ledger,accounts:l,onDatosCambiados:a},p=()=>t.store.get("config"),v=()=>({desde:p().dashboardStart,hasta:p().dashboardEnd}),g={ledger:t.ledger,precision:t.precision,adjuster:t.adjuster,estimaciones:c,nominas:()=>t.store.get("nominas"),loans:()=>t.store.get("loans"),resolverTramosIRPF:()=>pe(t.store.get("tramosIRPFHistorico"),p().tramos_irpf??Ht),omitidos:()=>p().cierreOmitidos??[],setOmitidos:z=>t.store.patchConfig({cierreOmitidos:z}),onDatosCambiados:a,periodo:v,hoy:e},b={precision:t.precision,adjuster:t.adjuster,estimaciones:c,onDatosCambiados:a,rango:()=>r.modo==="periodo"?v():null,hoy:e},y=z=>{var k;return((k=t.store.get("accounts").find(V=>V._id===z))==null?void 0:k.nombre)??z},f=()=>pe(t.store.get("tramosIRPFHistorico"),p().tramos_irpf??Ht)(Number(e().slice(0,4))),h=()=>pe(t.store.get("tramosGananciasCapitalHistorico"),p().tramosGananciasCapital??_e),C=()=>h()(Number(e().slice(0,4)));function S(){const z=p(),k=t.store.get("accounts"),V=Lo({loans:[],expenses:t.store.get("expenses").filter(q=>q.tipo==="transferencia"),accounts:k,config:{dashboardStart:z.dashboardStart,dashboardEnd:z.dashboardEnd,fechaReferencia:z.dashboardStart},nominas:[],resolverTramosGanancias:h()}),H=new Map,j=q=>{let B=H.get(q);return B||(B={entradas:[],salidas:[],totalAportaciones:0,totalReembolsos:0,retencion:0},H.set(q,B)),B},N=(q,B)=>{const Y=`${B.sourceId}`,J=q.find(W=>W.concepto===Y),at=J??{concepto:Y,contraparte:"",total:0,ocurrencias:0};at.total+=Math.abs(B.cuantia),at.ocurrencias+=1,J||q.push(at)};for(const q of V){if(!q.cuenta)continue;const B=j(q.cuenta);q.sourceType==="transfer-in"||q.sourceType==="traspaso-in"?(B.totalAportaciones+=Math.abs(q.cuantia),N(B.entradas,q)):q.sourceType==="transfer-out"||q.sourceType==="traspaso-out"?(B.totalReembolsos+=Math.abs(q.cuantia),N(B.salidas,q)):q.sourceType==="investment-tax"&&(B.retencion+=Math.abs(q.cuantia))}const R=t.store.get("expenses");for(const q of H.values())for(const[B,Y]of[[q.entradas,"cuenta"],[q.salidas,"cuentaDestino"]])for(const J of B){const at=R.find(W=>W._id===J.concepto);J.contraparte=y((at==null?void 0:at[Y])??"default"),J.concepto=(at==null?void 0:at.concepto)||(Y==="cuenta"?"Aportación":"Reembolso")}return H}function I(z){const k=s==="cuentas"?`<div class="page-actions">
          <button class="btn-secondary" data-tramos-ganancias title="Configurar los tramos del impuesto sobre ganancias de capital">⚙ Tramos ganancias capital</button>
          <button class="btn-secondary" data-reset-base>↻ Actualizar saldo base</button>
          <button class="btn-primary" data-nueva-acc>+ Nueva cuenta / fondo</button>
        </div>`:"";let V;if(s==="cuentas"){const N=t.store.get("accounts").filter(B=>Mt(B)!=="pension"),R=S(),q={config:p(),inflacion:t.store.get("inflacion"),nominas:t.store.get("nominas"),tramosIRPF:f(),tramosGanancias:C(),flujos:B=>R.get(B)??rl,invModo:B=>o.get(B)??"proyeccion"};V=`${cl(N,q.tramosGanancias)}<div class="grid-3">${N.map(B=>ml(B,q)).join("")}</div>`}else s==="movimientos"?V='<div id="acc-tx"></div>':s==="importar"?V='<div id="acc-import"></div>':V='<div id="acc-cierre"></div><div id="acc-precision" data-feature="precision-estimaciones"></div>';z.innerHTML=`
      <div class="page-header">
        <h1 class="page-title">Cuentas y <span>Contabilidad</span></h1>
        ${k}
      </div>
      ${Il(s)}
      ${V}`;const H=()=>I(z);if(s==="movimientos"){const j=z.querySelector("#acc-tx");j.innerHTML=kl(u,n),Ll(j,u,n,H)}else if(s==="importar"){const j=z.querySelector("#acc-import");j.innerHTML=Zl(d,i),ad(j,d,i,H)}else if(s==="cierre"){const j=z.querySelector("#acc-cierre"),N=z.querySelector("#acc-precision");j.innerHTML=md(g,r),N.innerHTML=Hl(b),hd(j,g,r,H),Gl(N,b,H)}}const E=()=>document.getElementById("modal-overlay"),M=()=>zt(),w=()=>{var z;return(z=E())==null?void 0:z.classList.add("hidden")};function x(z,k){const V=E(),H=M();return!V||!H?null:(H.innerHTML=z?`<div class="modal-title">${m(z)}</div>${k}`:k,V.classList.remove("hidden"),L(H,"[data-cancelar]",w),H)}function _(z,k){const V=z?t.store.get("accounts").find(R=>R._id===z)??null:null,H=[...(V==null?void 0:V.planAportaciones)??[]].map(R=>({...R})),j=V?A(V):null,N=x(z?"Editar cuenta / fondo":"Nueva cuenta / fondo",vl(V,{nominas:t.store.get("nominas"),hoy:e(),saldoActual:j??0}));N&&(bl(N,H,e()),L(N,"[data-guardar-acc]",R=>{const q=R.getAttribute("data-guardar-acc")||"",{datos:B,punto:Y,error:J}=hl(N,H,V,j,e());if(J)return G(J,"err");let at=q;q?t.store.updateItem("accounts",q,B):at=t.store.addItem("accounts",B)._id,Y&&t.ledger.registrarPuntoControl(at,Y.fecha,Y.saldo,Y.nota),G(q?"Actualizada":"Cuenta / fondo creado"),a(),w(),k()}))}function A(z){const k=t.ledger.puntosControl(z._id);return k.length>0?to(k)[0].saldo:z.saldo??null}function P(z,k){const V=t.store.get("accounts").find(N=>N._id===z);if(!V)return;const H=x("Histórico de saldos",yl(V.nombre,z,to(t.ledger.puntosControl(z)),V.saldoInicial||0,e()));if(!H)return;const j=()=>{k(),P(z,k)};L(H,"[data-hist-anadir]",()=>{var B,Y,J;const N=((B=H.querySelector("#hi-fecha"))==null?void 0:B.value)??"",R=parseFloat(((Y=H.querySelector("#hi-saldo"))==null?void 0:Y.value)??""),q=((J=H.querySelector("#hi-nota"))==null?void 0:J.value.trim())??"";if(!N||!Number.isFinite(R))return G("Fecha y saldo requeridos","err");t.ledger.registrarPuntoControl(z,N,R,q||void 0),G("Punto añadido"),a(),j()}),L(H,"[data-hist-borrar]",N=>{const[,R]=(N.getAttribute("data-hist-borrar")||"").split("|");t.ledger.eliminarPuntoControl(R),G("Eliminado"),a(),j()}),L(H,"[data-hist-semanal]",N=>{const R=N.getAttribute("data-hist-semanal"),q=t.ledger.generarPuntosSemanales(R);G(q>0?`Histórico con ${q} punto${q!==1?"s":""} semanal${q!==1?"es":""}`:"Sin movimientos con los que calcular el histórico"),a(),j()}),L(H,"[data-hist-inicial]",N=>{const[R,q]=(N.getAttribute("data-hist-inicial")||"").split("|"),B=t.ledger.puntosControl(R).find(J=>J._id===q);if(!B)return;const Y=to([B])[0].saldo;t.store.updateItem("accounts",R,{saldoInicial:Y,fechaInicialSaldo:B.fecha}),G(`Punto inicial → ${B.fecha} (${F(Y)})`),a(),j()})}function $(z){const k=t.store.get("accounts").filter(j=>j.activo);if(k.length===0)return G("No hay cuentas activas","err");const V=e(),H=k.map(j=>`• ${j.nombre}: ${F(A(j)??j.saldoInicial??0)}`).join(`
`);if($t(`¿Actualizar el saldo inicial de estas cuentas a su saldo actual (${V})?

${H}

Esto recalibra el punto de arranque del dashboard.`)){for(const j of k)t.store.updateItem("accounts",j._id,{saldoInicial:A(j)??j.saldoInicial??0,fechaInicialSaldo:V});G("Saldo base actualizado"),a(),z()}}function T(z,k,V){L(z,"[data-cuentas-tab]",H=>{s=H.getAttribute("data-cuentas-tab")||"cuentas",k()}),L(z,"[data-nueva-acc]",()=>_(null,k)),L(z,"[data-editar-acc]",H=>_(H.getAttribute("data-editar-acc"),k)),L(z,"[data-tramos-ganancias]",()=>V.abrir()),L(z,"[data-reset-base]",()=>$(k)),L(z,"[data-hist-acc]",H=>P(H.getAttribute("data-hist-acc"),k)),L(z,"[data-principal-acc]",H=>{const j=H.getAttribute("data-principal-acc");t.store.set("accounts",t.store.get("accounts").map(N=>({...N,esCuentaPrincipal:N._id===j}))),G("Cuenta marcada como principal"),a(),k()}),L(z,"[data-borrar-acc]",H=>{var J,at;const j=H.getAttribute("data-borrar-acc"),N=t.store.get("accounts");if(N.length<=1)return G("Debe existir al menos una cuenta","err");const R=N.find(W=>W._id===j);if(!R)return;const B=[[((J=t.ledger)==null?void 0:J.transacciones({cuentaId:j}).length)??0,"movimiento","movimientos"],[((at=t.ledger)==null?void 0:at.puntosControl(j).filter(W=>W.origen!=="derivado").length)??0,"saldo anotado","saldos anotados"],[t.store.get("expenses").filter(W=>(W.cuenta||"default")===j||W.cuentaDestino===j).length,"gasto o ingreso","gastos o ingresos"],[t.store.get("nominas").filter(W=>W.cuenta===j).length,"nómina","nóminas"],[t.store.get("loans").filter(W=>(W.cuenta||"default")===j).length,"préstamo","préstamos"]].filter(([W])=>W>0).map(([W,X,dt])=>`${W} ${W===1?X:dt}`);if(B.length>0){if(R.activo===!1)return G("Esta cuenta ya está desactivada y tiene datos: no se puede eliminar","warn");if(!$t(`«${R.nombre}» tiene ${B.join(", ")}.

No se puede eliminar sin dejar esos datos sueltos. ¿Desactivarla? Dejará de contar en la proyección y conservará su historial; puedes reactivarla al editarla.`))return;let W=t.store.get("accounts").map(X=>X._id===j?{...X,activo:!1,esCuentaPrincipal:!1}:X);if(!W.some(X=>X.esCuentaPrincipal)){const X=W.find(dt=>dt.activo!==!1)??W[0];W=W.map(dt=>dt._id===X._id?{...dt,esCuentaPrincipal:!0}:dt)}t.store.set("accounts",W),G("Cuenta desactivada"),a(),k();return}if(!$t(`¿Eliminar la cuenta «${R.nombre}»? No tiene movimientos ni nada asociado.`))return;t.store.removeItem("accounts",j);const Y=t.store.get("accounts");Y.length>0&&!Y.some(W=>W.esCuentaPrincipal)&&t.store.set("accounts",Y.map((W,X)=>X===0?{...W,esCuentaPrincipal:!0}:W)),G("Cuenta eliminada"),a(),k()}),L(z,"[data-inv-modo]",H=>{const[j,N]=(H.getAttribute("data-inv-modo")||"").split("|");o.set(j,N==="real"?"real":"proyeccion"),k()})}let D=null;return{id:"accounts",route:"accounts",nombre:"Cuentas y contabilidad",flagId:"accounts",seccion:1,iconoPath:yd,mount(z){const k=()=>I(z);D??(D=$l({store:t.store,onDatosCambiados:()=>{a(),k()},año:()=>Number(e().slice(0,4))})),I(z),z.dataset.wired!=="1"&&(T(z,k,D),z.dataset.wired="1")}}}function bn(t,e,a=!1){const o=Math.abs(Ct(e));return t==="ingreso"?o:t==="gasto"||a?-o:o}function xd(t){function e(x){return`${x}_${Date.now().toString(36)}${Math.random().toString(36).slice(2,7)}`}function a(x={}){var A;const _=(A=x.texto)==null?void 0:A.trim().toLowerCase();return t.get("transacciones").filter(P=>!(x.cuentaId&&P.cuentaId!==x.cuentaId||x.desde&&P.fecha<x.desde||x.hasta&&P.fecha>x.hasta||x.tipo&&P.tipo!==x.tipo||x.estimacionId&&P.estimacionId!==x.estimacionId||x.tags&&x.tags.length>0&&!x.tags.some($=>P.tags.includes($))||_&&!P.concepto.toLowerCase().includes(_))).sort((P,$)=>P.fecha.localeCompare($.fecha)||P._id.localeCompare($._id))}function o(x){const _={_id:e("tx"),fecha:x.fecha,cuentaId:x.cuentaId,importeCts:bn(x.tipo,x.importe,x.negativo),concepto:x.concepto,tags:x.tags??[],estimacionId:x.estimacionId??null,tipo:x.tipo,origen:x.origen??"manual",...x.nota?{nota:x.nota}:{},...x.imprevisto?{imprevisto:!0}:{}};return t.set("transacciones",[...t.get("transacciones"),_]),_}function s(x,_){t.set("transacciones",t.get("transacciones").map(A=>{if(A._id!==x)return A;const{importe:P,...$}=_,T={...A,...$};return P!==void 0&&(T.importeCts=bn(T.tipo,P,T.importeCts<0)),T}))}function n(x){t.set("transacciones",t.get("transacciones").filter(_=>_._id!==x))}function i(x,_){s(x,{estimacionId:_})}function r(x){return t.get("puntosControl").filter(_=>!x||_.cuentaId===x).sort((_,A)=>_.fecha.localeCompare(A.fecha))}function c(x){return r(x).filter(_=>_.origen!=="derivado")}function l(x,_,A,P){const $={_id:e("pc"),fecha:_,cuentaId:x,saldoCts:Ct(A),...P?{nota:P}:{}},T=t.get("puntosControl").filter(D=>!(D.cuentaId===x&&D.fecha===_));return t.set("puntosControl",[...T,$].sort((D,z)=>D.fecha.localeCompare(z.fecha))),p(x),$}function u(x){const _=t.get("puntosControl").find(A=>A._id===x);t.set("puntosControl",t.get("puntosControl").filter(A=>A._id!==x)),_&&(_.origen==="derivado"?y(_.cuentaId):p(_.cuentaId))}function d(x,_,A){const P=T=>T.cuentaId===x&&T.origen!=="derivado"&&T.fecha>=_&&T.fecha<=A,$=t.get("puntosControl").filter(P).length;return $===0?0:(t.set("puntosControl",t.get("puntosControl").filter(T=>!P(T))),y(x),$)}function p(x){var H,j;const _=c(x),A=t.get("transacciones").filter(N=>N.cuentaId===x).sort((N,R)=>N.fecha.localeCompare(R.fecha)),P=(H=A[0])==null?void 0:H.fecha,$=(j=A[A.length-1])==null?void 0:j.fecha,T=t.get("puntosControl").filter(N=>!(N.cuentaId===x&&N.origen==="derivado"));if(!P)return t.set("puntosControl",T),y(x),0;const D=[];for(let N=Ae(P);N<=$;N=Ae(Lt(N,1)))D.push(N);D[D.length-1]!==$&&D.push($);const z=new Set(_.map(N=>Ae(N.fecha))),k=N=>{const R=_.filter(q=>q.fecha<=N).pop();return A.filter(q=>q.fecha<=N&&(!R||q.fecha>R.fecha)).reduce((q,B)=>q+B.importeCts,(R==null?void 0:R.saldoCts)??0)},V=D.filter(N=>!z.has(Ae(N))).map(N=>({_id:e("pcd"),fecha:N,cuentaId:x,saldoCts:k(N),origen:"derivado"}));return t.set("puntosControl",[...T,...V].sort((N,R)=>N.fecha.localeCompare(R.fecha))),v(x,P,k(P)),y(x),V.length}function v(x,_,A){const P=t.get("accounts"),$=P.find(T=>T._id===x);!$||$.fechaInicialSaldo&&$.fechaInicialSaldo<=_||t.set("accounts",P.map(T=>T._id===x?{...T,saldoInicial:nt(A),fechaInicialSaldo:_}:T))}function g(x){return(x??[...new Set(t.get("transacciones").map(A=>A.cuentaId))]).reduce((A,P)=>A+p(P),0)}function b(x){const _=t.get("transacciones").filter($=>$.origen==="importado"&&(!x||$.cuentaId===x)),A=new Map;for(const $ of _){const T=A.get($.cuentaId);T?T.push($.fecha):A.set($.cuentaId,[$.fecha])}const P=[];for(const[$,T]of A){T.sort();const D=d($,T[0],T[T.length-1]);P.push({cuentaId:$,eliminados:D,semanales:p($)})}return P}function y(x){const _=r(x),A=t.get("accounts");A.some(P=>P._id===x)&&t.set("accounts",A.map(P=>P._id===x?{...P,historicoSaldos:_.map($=>({_id:$._id,fecha:$.fecha,saldo:nt($.saldoCts),...$.nota?{nota:$.nota}:{}}))}:P))}function f(x,_=ot()){const A=c(x).filter(D=>D.fecha<=_).pop(),P=A==null?void 0:A.fecha,$=(A==null?void 0:A.saldoCts)??0;return t.get("transacciones").filter(D=>D.cuentaId===x&&D.fecha<=_&&(P===void 0||D.fecha>P)).reduce((D,z)=>D+z.importeCts,$)}function h(x,_){return nt(f(x,_))}function C(x=ot(),_){const A=_??t.get("accounts").filter(P=>P.activo).map(P=>P._id);return nt(A.reduce((P,$)=>P+f($,x),0))}function S(){return t.get("transacciones").length>0||t.get("puntosControl").length>0}function I(){const x=[...t.get("transacciones").map(_=>_.fecha),...t.get("puntosControl").map(_=>_.fecha)];return x.length>0?x.sort().pop()??null:null}function E(x={}){return nt(a(x).reduce((_,A)=>_+A.importeCts,0))}function M(x={}){const _=new Map;for(const A of a(x)){const P=A.fecha.slice(0,7);_.set(P,(_.get(P)??0)+A.importeCts)}return new Map([..._.entries()].sort(([A],[P])=>A.localeCompare(P)).map(([A,P])=>[A,nt(P)]))}function w(x={}){const _=new Map;for(const A of a(x))for(const P of A.tags.length>0?A.tags:["sin_tag"])_.set(P,(_.get(P)??0)+A.importeCts);return new Map([..._.entries()].map(([A,P])=>[A,nt(P)]))}return{transacciones:a,registrar:o,actualizar:s,eliminar:n,asignarEstimacion:i,puntosControl:r,registrarPuntoControl:l,eliminarPuntoControl:u,eliminarPuntosControlEnRango:d,sincronizarHistoricoImportado:b,generarPuntosSemanales:p,generarPuntosSemanalesTodas:g,saldoCuenta:h,saldoCuentaCts:f,saldoTotal:C,tieneDatos:S,ultimaFecha:I,total:E,totalPorMes:M,totalPorTag:w}}function Tt(t){return t.trim().toLowerCase()}function Id(t){function e(){const l=new Map,u=(d,p)=>{const v=Tt(d);if(!v)return;const g=l.get(v)??{tag:v,estimaciones:0,reales:0,total:0};g[p]+=1,g.total+=1,l.set(v,g)};for(const d of t.get("expenses"))for(const p of d.tags??[])u(p,"estimaciones");for(const d of t.get("transacciones"))for(const p of d.tags??[])u(p,"reales");return[...l.values()].sort((d,p)=>p.total-d.total||d.tag.localeCompare(p.tag))}function a(){return e().map(l=>l.tag)}function o(l){return e().filter(u=>l==="estimaciones"?u.reales===0:u.estimaciones===0).map(u=>u.tag)}function s(l,u,d){const p=Tt(u),v=(l??[]).map(Tt);if(!v.includes(p))return l??[];const g=v.filter(b=>b!==p);return d===null?[...new Set(g)]:[...new Set([...g,Tt(d)])]}function n(l,u){const d=Tt(u);if(!d)throw new Error("El nuevo nombre de la etiqueta no puede estar vacío");return c(l,d)}function i(l,u){let d=0;for(const p of l)Tt(p)!==Tt(u)&&(d+=c(p,Tt(u)).cambiados);return{cambiados:d}}function r(l){return c(l,null)}function c(l,u){let d=0;const p=t.get("expenses").map(M=>{const w=s(M.tags,l,u);return w!==M.tags&&(d+=1),w===M.tags?M:{...M,tags:w}});t.set("expenses",p);const v=t.get("transacciones").map(M=>{const w=s(M.tags,l,u);return w!==M.tags&&(d+=1),w===M.tags?M:{...M,tags:w}});t.set("transacciones",v);const g=t.get("loans").map(M=>{const w=s(M.tags,l,u);return w!==M.tags&&(d+=1),w===M.tags?M:{...M,tags:w}});t.set("loans",g);const b=t.get("nominas").map(M=>{const w=s(M.tags,l,u);return w!==M.tags&&(d+=1),w===M.tags?M:{...M,tags:w}});t.set("nominas",b);const y=t.get("config"),f=Tt(l),h=M=>{const w=(M??[]).map(Tt);if(!w.includes(f))return M??[];const x=w.filter(_=>_!==f);return u===null?[...new Set(x)]:[...new Set([...x,u])]},C={},S=h(y.activeTagsFilter),I=h(y.tagCategorias),E=h(y.tagGrupos);return S!==y.activeTagsFilter&&(C.activeTagsFilter=S),I!==y.tagCategorias&&(C.tagCategorias=I),E!==y.tagGrupos&&(C.tagGrupos=E),Object.keys(C).length>0&&t.patchConfig(C),{cambiados:d}}return{uso:e,todas:a,soloEn:o,renombrar:n,fusionar:i,eliminar:r}}const wd=3;function hn(t){return t<.005?0:t}function Sd(t){if(t.length<2)return null;const e=t.reduce((o,s)=>o+s,0)/t.length,a=t.reduce((o,s)=>o+(s-e)**2,0)/(t.length-1);return Math.sqrt(a)}function Cd(t){const e=[],a=[],o=[];for(const i of t){if(i.meses.length<wd)continue;const r=Sd(i.meses.map(c=>c.desviacion));r!==null&&(e.push(r),a.push(r/Math.sqrt(i.meses.length)),o.push(i.meses.length))}if(e.length===0)return{sigmaMensual:0,sigmaDeriva:0,estimaciones:0,mesesMinimos:0,mesesMaximos:0,fiable:!1};const s=Math.sqrt(e.reduce((i,r)=>i+r*r,0)),n=Math.sqrt(a.reduce((i,r)=>i+r*r,0));return{sigmaMensual:hn(s),sigmaDeriva:hn(n),estimaciones:e.length,mesesMinimos:Math.min(...o),mesesMaximos:Math.max(...o),fiable:!0}}function yn(t,e,a=1,o=0){if(e<=0)return 0;const s=Math.max(0,t)*Math.sqrt(e),n=Math.max(0,o)*e;return s===0&&n===0?0:Q(a*Math.hypot(s,n))}function Md(t,e,a={}){if(!e.fiable||t.length===0)return[];const{z:o=1}=a,s=a.desde??t[0].fecha,[n,i]=s.slice(0,7).split("-").map(Number);return t.map(r=>{const[c,l]=r.fecha.slice(0,7).split("-").map(Number),u=Math.max(0,(c-n)*12+(l-i)),d=yn(e.sigmaMensual,u,o,e.sigmaDeriva);return{fecha:r.fecha,saldo:r.saldoAcum,arriba:Q(r.saldoAcum+d),abajo:Q(r.saldoAcum-d)}})}function Ed(t,e=1){if(!t.fiable)return"Necesita al menos 3 meses de contabilidad real para medir cuánto se desvían tus estimaciones.";if(t.sigmaMensual===0)return"Sin margen de error: tus estimaciones se desvían siempre lo mismo, así que no hay incertidumbre que dibujar. Si se desvían de forma sistemática, ajústalas desde el cierre de mes.";const a=e>=2?"95 %":"68 %",o=t.mesesMinimos===t.mesesMaximos?`${t.mesesMinimos}`:`${t.mesesMinimos}–${t.mesesMaximos}`;return`Banda de ±${e} desviación${e!==1?"es":""} típica${e!==1?"s":""} (${a} de los casos), medida sobre ${t.estimaciones} estimación${t.estimaciones!==1?"es":""} con ${o} mes${t.mesesMaximos!==1?"es":""} de datos reales. Se ensancha con el tiempo, y tanto más deprisa cuanto menos historial haya: tu gasto medio también es una estimación.`}const mo="financeapp_session",Ad=["local","dropbox","firebase"];function Pd(t){if(!t)return null;try{const e=JSON.parse(t);if(!e||!Ad.includes(e.modo))return null;const a=Number(e.creadaEn),o=Number(e.ultimoUso);return!Number.isFinite(a)||!Number.isFinite(o)?null:{modo:e.modo,...typeof e.email=="string"?{email:e.email}:{},...typeof e.passphrase=="string"?{passphrase:e.passphrase}:{},creadaEn:a,ultimoUso:o}}catch{return null}}function _d({storage:t,autoLogoutMinutos:e=()=>0,ahora:a=()=>Date.now(),graciaActiva:o=()=>!1}={}){const s=()=>t??(typeof localStorage<"u"?localStorage:null);function n(v){const g=s();if(g)try{v?g.setItem(mo,JSON.stringify(v)):g.removeItem(mo)}catch{}}function i(){const v=s();if(!v)return null;try{return Pd(v.getItem(mo))}catch{return null}}function r(){const v=i();return v?(a()-v.ultimoUso)/6e4:null}function c(){const v=e();if(!Number.isFinite(v)||v<=0||o())return!1;const g=r();return g!==null&&g>=v}function l(){const v=i();return v?c()?(n(null),null):v:null}function u(v){const g=a(),b={modo:v.modo,...v.email?{email:v.email}:{},...v.passphrase?{passphrase:v.passphrase}:{},creadaEn:g,ultimoUso:g};return n(b),b}function d(){const v=i();v&&n({...v,ultimoUso:a()})}function p(){n(null)}return{abrir:u,leer:l,tocar:d,cerrar:p,caducada:c,inactividadMinutos:r,get activa(){return l()!==null}}}const $n=["pointerdown","keydown","visibilitychange"];function Fd({sesion:t,onCaducada:e,intervaloMs:a=3e4,setIntervalImpl:o=setInterval,clearIntervalImpl:s=clearInterval,target:n=typeof document<"u"?document:void 0}){let i=!0;const r=()=>{i&&t.tocar()};for(const u of $n)n==null||n.addEventListener(u,r);const c=o(()=>{i&&t.caducada()&&(l(),t.cerrar(),e())},a);function l(){if(i){i=!1,s(c);for(const u of $n)n==null||n.removeEventListener(u,r)}}return l}const Dd=[{minutos:0,etiqueta:"Nunca (solo manualmente)"},{minutos:15,etiqueta:"Tras 15 minutos de inactividad"},{minutos:60,etiqueta:"Tras 1 hora de inactividad"},{minutos:480,etiqueta:"Tras 8 horas de inactividad"},{minutos:10080,etiqueta:"Tras 7 días de inactividad"}],Td="FinanceApp",zd=new TextEncoder().encode("financeapp-bio-passphrase-v1");function xn(t){return new Uint8Array(new ArrayBuffer(t))}const fo="financeapp_bio_credencial",go="financeapp_bio_secreto",vo="financeapp_bio_ultimo_desbloqueo",In="financeapp_bio_gracia_min",jd=5;function qd(){return{create:t=>navigator.credentials.create(t),get:t=>navigator.credentials.get(t),async disponiblePlataforma(){if(typeof window>"u"||!window.PublicKeyCredential)return!1;try{return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()}catch{return!1}}}}function fa(t){const e=t instanceof Uint8Array?t:new Uint8Array(t);let a="";for(const o of e)a+=String.fromCharCode(o);return btoa(a)}function ga(t){const e=atob(t),a=xn(e.length);for(let o=0;o<e.length;o++)a[o]=e.charCodeAt(o);return a}function Nd(t){return fa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function Rd(t){const e=t.replace(/-/g,"+").replace(/_/g,"/")+"=".repeat((4-t.length%4)%4);return ga(e)}function wn(t){return t.getClientExtensionResults()}function kd(t={}){const e=t.webauthn??qd(),a=t.subtle??(typeof crypto<"u"?crypto.subtle:void 0),o=t.storage??(typeof localStorage<"u"?localStorage:void 0),s=t.ahora??(()=>Date.now()),n=t.randomBytes??(I=>crypto.getRandomValues(xn(I)));function i(){if(!o)throw new Error("No hay almacenamiento local disponible.");return o}function r(){return e.disponiblePlataforma()}function c(){const I=o==null?void 0:o.getItem(fo);if(!I)return null;try{const E=JSON.parse(I);return typeof E.credencialId!="string"||typeof E.salt!="string"?null:E}catch{return null}}function l(){return c()!==null}async function u(I){const E=await a.importKey("raw",I,"HKDF",!1,["deriveKey"]);return a.deriveKey({name:"HKDF",hash:"SHA-256",salt:new Uint8Array(0),info:zd},E,{name:"AES-GCM",length:256},!1,["encrypt","decrypt"])}async function d(I,E){const M=n(12),w=await a.encrypt({name:"AES-GCM",iv:M},I,new TextEncoder().encode(E));return`${fa(M)}:${fa(w)}`}async function p(I,E){const[M,w]=E.split(":"),x=ga(M),_=ga(w),A=await a.decrypt({name:"AES-GCM",iv:x},I,_);return new TextDecoder().decode(A)}async function v(I,E){var k,V;if(!I)throw new Error("No hay clave de cifrado que envolver.");const M=n(32),w=n(32),x=n(16),_=await e.create({publicKey:{challenge:w,rp:{name:Td},user:{id:x,name:"financeapp-local",displayName:"FinanceApp en este dispositivo"},pubKeyCredParams:[{type:"public-key",alg:-7},{type:"public-key",alg:-257}],authenticatorSelection:{authenticatorAttachment:"platform",userVerification:"required",residentKey:"required"},extensions:{prf:{eval:{first:M}}},timeout:6e4}});if(!_)throw new Error("No se ha podido crear la credencial biométrica.");const A=wn(_);if(!((k=A.prf)!=null&&k.enabled))throw new Error("Este dispositivo o navegador no admite desbloqueo con huella (falta soporte de la extensión PRF).");let P=((V=A.prf.results)==null?void 0:V.first)??null;if(P||(P=await g(_.rawId,M)),!P)throw new Error("El sensor no ha devuelto material de cifrado.");const $=await u(P),T=await d($,I),D={credencialId:Nd(_.rawId),salt:fa(M),modo:E,creadaEn:s()},z=i();z.setItem(fo,JSON.stringify(D)),z.setItem(go,T)}async function g(I,E){var w,x;const M=await e.get({publicKey:{challenge:n(32),allowCredentials:[{id:I,type:"public-key"}],userVerification:"required",extensions:{prf:{eval:{first:E}}},timeout:6e4}});return M?((x=(w=wn(M).prf)==null?void 0:w.results)==null?void 0:x.first)??null:null}async function b(){const I=c();if(!I)throw new Error("No hay huella configurada en este dispositivo.");const E=o==null?void 0:o.getItem(go);if(!E)throw new Error("No hay clave guardada. Vuelve a activar el desbloqueo con huella.");const M=await g(Rd(I.credencialId).buffer,ga(I.salt));if(!M)throw new Error("No se ha podido leer la huella. Inténtalo de nuevo o usa la clave.");const w=await u(M),x=await p(w,E);return f(),x}function y(){o==null||o.removeItem(fo),o==null||o.removeItem(go),o==null||o.removeItem(vo)}function f(){o==null||o.setItem(vo,String(s()))}function h(){const I=o==null?void 0:o.getItem(In);if(I==null)return jd;const E=Number(I);return Number.isFinite(E)&&E>0?E:0}function C(I){o==null||o.setItem(In,String(Math.max(0,Math.floor(I)||0)))}function S(){if(!l())return!1;const I=h();if(I<=0)return!1;const E=o==null?void 0:o.getItem(vo),M=E?Number(E):NaN;return Number.isFinite(M)?s()-M<I*6e4:!1}return{disponible:r,registrada:l,leerCredencial:c,registrar:v,desbloquear:b,olvidar:y,marcarDesbloqueo:f,dentroDeGracia:S,graciaMinutos:h,configurarGracia:C}}function Sn(){if(typeof localStorage<"u"){const M=yr();M.length>0&&console.info(`[FinanceApp] Recuperadas claves escritas fuera del espacio de nombres: ${M.join(", ")}`)}const t=Fr(),e=t.activo(),a=be(e),o=Ss(localStorage,a),s=Sr({adapter:o}),n=Cr(),{applied:i}=s.load();i.length>0&&console.info(`[FinanceApp] Migraciones aplicadas: ${i.join(", ")} (esquema v${Qt})`),s.subscribe(M=>n.marcar(M));function r(){var w,x,_,A,P;const M=globalThis;(x=(w=M.FirebaseService)==null?void 0:w.isConnected)!=null&&x.call(w)&&((P=(A=(_=M.FirebaseService).uploadRegistroProyectos)==null?void 0:A.call(_))==null||P.catch($=>console.warn("[FinanceApp] No se ha podido subir la lista de proyectos:",$ instanceof Error?$.message:$)))}const c={listar:()=>t.listar(),activo:()=>t.listar().find(M=>M._id===e)??t.listar()[0],colecciones:Zt.filter(M=>M!=="config"),crear:M=>{const w=t.crear(M);return r(),w},renombrar:(M,w)=>{t.renombrar(M,w),r()},duplicar:(M,w)=>{const x=t.duplicar(M,w);return r(),x},eliminar:M=>{t.eliminar(M),r()},cambiarA:M=>t.establecerActivo(M),fusionarRemotos:M=>t.fusionarRemotos(M),importarDesde:(M,w)=>{const x=Dr(localStorage,M,w),_=Tr(x),A=[];for(const P of w){const $=_[P];if(!Array.isArray($)||$.length===0)continue;const T=s.get(P);s.set(P,[...T,...$]),A.push(P)}return A.length>0&&n.marcar("importado-de-otro-proyecto"),{importadas:A}}},l=jr(s);typeof window<"u"&&lc(window);const u=kd(),d=_d({autoLogoutMinutos:()=>{var w,x;const M=(x=(w=globalThis.State)==null?void 0:w.get)==null?void 0:x.call(w,"config");return Number((M==null?void 0:M.autoLogoutMinutos)??s.get("config").autoLogoutMinutos??0)},graciaActiva:()=>u.dentroDeGracia()}),p=xd(s),v=Id(s),g=El(p),b=Ol(s),y=uc({isEnabled:M=>l.isEnabled(M)}),f=Zr({flags:l,rutasExtra:()=>y.flagPorRuta()}),h=kr({flags:l,onChange:()=>{var M,w;y.attachToShell(),f.apply(),(w=(M=globalThis.Router)==null?void 0:M.rerender)==null||w.call(M)}}),C=Yr({proyectos:c}),S=()=>{var w,x,_,A,P,$;const M=globalThis;if((x=(w=M.State)==null?void 0:w.load)==null||x.call(w),((A=(_=M.Router)==null?void 0:_.current)==null?void 0:A.call(_))==="dashboard")try{($=(P=M.DashboardModule)==null?void 0:P.render)==null||$.call(P)}catch(T){console.error("[FinanceApp] No se ha podido repintar el cuadro de mando tras el cambio:",T)}};function I(){const w=globalThis.FinanceMath;if(!w){console.error("[informe] FinanceMath no está cargado");return}const x=ot(),_=s.get("config"),A=s.get("accounts").filter(q=>q.activo),P=s.get("expenses"),$=s.get("loans"),T=s.get("nominas"),D=_.contarImprevistos!==!1;let z=null;const k=(q,B=!1)=>(Y,J,at=x)=>w.generarExtracto($,P,s.get("accounts"),{..._,dashboardStart:Y,dashboardEnd:J,fechaReferencia:at,corregirConSaldoReal:B,...q?{reservaImprevistos:q}:{}},null,T,s.get("inflacion")),V=k(null),H={generarExtracto:V,gastos:P,prestamos:$,movimientos:s.get("transacciones"),hoy:x};let j=null;try{const q=x.slice(0,7),B=V(`${q}-01`,Ut(q));j=Fa(H,B).estimacion,D&&(z=ss(H,B))}catch(q){console.error("[informe] Sin estimación de imprevistos:",q)}const N=k(z),R=c.activo().nombre;Li({hoy:x,proyecto:R,construir:(q,B)=>Xi(Hi({desde:q,hasta:B,hoy:x,proyecto:R,cuentas:A,gastos:P,prestamos:$,generarExtracto:N,saldoEnFecha:(Y,J)=>w.saldoEnFecha(Y,J),ultimoSaldoConocido:(Y,J)=>w.fechaUltimoSaldoConocido([Y],J)??"",imprevistos:j,contarImprevistos:D,cuadroDeMando:(()=>{var Y;try{const J=k(z,_.corregirConSaldoReal===!0)(q,B,x);if(J.length===0)return null;const at=Number(((Y=J[J.length-1])==null?void 0:Y.saldoAcum)??NaN);return Number.isFinite(at)?{saldoFinal:at}:null}catch{return null}})()}))})}const E=Qr({store:s,onDatosCambiados:S});return y.register(Ic({store:s,onDatosCambiados:S})),y.register(Dc({store:s,onDatosCambiados:S})),y.register(sl({store:s,onDatosCambiados:S})),y.register($d({store:s,ledger:p,tags:v,precision:g,adjuster:b,onDatosCambiados:S})),y.register(mc({store:s,onDatosCambiados:S})),{version:Qt,core:zn,engine:{generarExtracto:Lo,recomputarSaldoAcum:Nn,saldoHoy:Rn,sumarPorTags:Oo,providers:{proyectarGastos:Fe,proyectarPrestamos:Ma,proyectarTransferencias:Do,proyectarNominas:Ea,proyectarInteresesCuentas:zo,proyectarAportaciones:To,proyectarRetencionesFiscales:jo,proyectarInflacionGastos:qo,proyectarPerdidaAhorro:No},analysis:Bn,margins:Kn,avisos:Zn,dashboard:mi,mes:yi,precisionSaldo:Ei},store:s,flags:l,featureRegistry:{all:Jt,porGrupo:Fs},ui:{tarjetaMes:Ti,abrirHistoricoMeses:Ri,abrirCrearInforme:()=>I(),openFeatures:h.open,openProyectos:C.open,openPersonas:E.open,applyGating:f.apply,watchGating:()=>f.observar(),instalarDeshacer:()=>ec({store:s,rerender:()=>{var w,x,_,A;const M=globalThis;(x=(w=M.State)==null?void 0:w.load)==null||x.call(w),(A=(_=M.Router)==null?void 0:_.rerender)==null||A.call(_)}}),avisoGuardado:null,instalarBuscador:()=>nc({estado:()=>({accounts:s.get("accounts"),expenses:s.get("expenses"),loans:s.get("loans"),nominas:s.get("nominas"),transacciones:s.get("transacciones")}),rutasDisponibles:()=>y.routes(),navegar:M=>{var w,x;return(x=(w=globalThis.Router)==null?void 0:w.navigate)==null?void 0:x.call(w,M)}})},app:y,session:Object.assign(d,{vigilar:M=>Fd({sesion:d,onCaducada:M}),opciones:Dd}),biometria:u,cambios:n,datos:{colecciones:Zt,snapshot:()=>({...Cs(o),[Ms]:Qt}),aplicar:(M,{sellar:w=!0}={})=>{const x=w?(A,P)=>o.set(A,P):(A,P)=>{const $=globalThis.StorageAdapter;$!=null&&$.setRestaurando?$.setRestaurando(A,P):o.set(A,P)},_=Mr(x,M);for(const A of xs)M[A]!==void 0&&M[A]!==null&&x(`${At}${A}`,M[A]);return _.length>0&&x(Ne,Pr(M,Qt)),s.load(),n.marcar("copia-restaurada"),_},faltantes:M=>Er(M),esVacioOPorDefecto:()=>Ar(Cs(o)),recargar:()=>{s.load(),n.marcar("recarga-externa")}},proyectos:c,accounting:{ledger:p,tags:v,precision:g,adjuster:b,sugerirAjuste:io,medirVariabilidad:Cd,bandaDeConfianza:Md,bandaAcumulada:yn,describirBanda:Ed}}}function Ld(){try{const t=Sn();return window.FinanceApp=t,t}catch(t){const e=t;return window.FinanceAppError={mensaje:(e==null?void 0:e.message)??String(t),stack:e==null?void 0:e.stack},console.error("[FinanceApp] El paquete nuevo no pudo arrancar:",t),null}}const gt=typeof window<"u"?Ld():null;if(gt){let t=!1;const e=()=>{var s,n,i;if(gt.app.attachToShell(),gt.ui.applyGating(),!t){t=!0,gt.ui.watchGating(),gt.ui.instalarDeshacer(),gt.ui.instalarBuscador();const r=globalThis,c=()=>{var p,v,g,b;return(v=(p=r.FirebaseService)==null?void 0:p.isConnected)!=null&&v.call(p)?r.FirebaseService:(b=(g=r.DropboxService)==null?void 0:g.isConnected)!=null&&b.call(g)?r.DropboxService:null};gt.ui.avisoGuardado=dc({cambios:gt.cambios,hayDestino:()=>c()!==null,guardar:async()=>{const p=c();if(!(p!=null&&p.uploadBackup))throw new Error("No hay ningún destino de copia conectado.");const v=globalThis.AuthModule;v!=null&&v.guardarEnNube?await v.guardarEnNube():await p.uploadBackup()}});const l=document.getElementById("sidebar-proyecto-activo"),u=document.getElementById("sidebar-proyecto-activo-nombre");l&&u&&(u.textContent=gt.proyectos.activo().nombre,l.classList.remove("hidden"),l.addEventListener("click",()=>gt.ui.openProyectos())),(s=document.getElementById("btn-proyectos"))==null||s.addEventListener("click",()=>gt.ui.openProyectos());const d=gt.store.get("config").archivoMigracion011;if(d&&!d.avisado&&d.desactivados+d.amortizaciones.length>0){const p=d.desactivados+d.amortizaciones.length,v=globalThis.UI;setTimeout(()=>{var g;return(g=v==null?void 0:v.toast)==null?void 0:g.call(v,`Se han desactivado ${p} elemento${p===1?"":"s"} que venía${p===1?"":"n"} de un supuesto. Búscalos con la etiqueta «supuesto-archivado».`,"warn")},1500),gt.store.patchConfig({archivoMigracion011:{...d,avisado:!0}})}(n=document.getElementById("btn-personas"))==null||n.addEventListener("click",()=>gt.ui.openPersonas()),(i=document.getElementById("btn-informe"))==null||i.addEventListener("click",()=>gt.ui.abrirCrearInforme())}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e(),document.addEventListener("click",s=>{const n=s.target;n!=null&&n.closest(".nav-btn[data-view]")&&setTimeout(e,0)}),window.addEventListener(ws,()=>{if(document.getElementById("aviso-sin-espacio"))return;const s=document.querySelector(".view-container");if(!(s!=null&&s.parentElement))return;const n=document.createElement("div");n.id="aviso-sin-espacio",n.setAttribute("role","alert"),n.className="card",n.style.cssText="border:1px solid var(--red);background:rgba(255,77,109,0.09);padding:10px 16px;margin:10px 20px 0;font-size:13px;display:flex;gap:12px;align-items:center;flex-wrap:wrap";const i=document.createElement("span");i.style.flex="1",i.textContent="No se ha podido guardar: el almacenamiento de este navegador está lleno o bloqueado. Los últimos cambios pueden perderse al recargar. Exporta una copia ahora.";const r=document.createElement("button");r.className="btn-primary btn-sm",r.textContent="Exportar copia",r.addEventListener("click",()=>{var c,l;return(l=(c=globalThis.DataIO)==null?void 0:c.exportJSON)==null?void 0:l.call(c)}),n.append(i,r),s.parentElement.insertBefore(n,s)});let a=null;const o=`${be(gt.proyectos.activo()._id)}${At}`;window.addEventListener("storage",s=>{!s.key||!s.key.startsWith(o)||s.key.endsWith("_modificadoEn")||s.key.endsWith("_schemaVersion")||(a&&clearTimeout(a),a=setTimeout(()=>{var i,r,c;a=null,gt.store.load(),((i=document.getElementById("modal-overlay"))==null?void 0:i.classList.contains("hidden"))===!1||(c=(r=globalThis.Router)==null?void 0:r.rerender)==null||c.call(r)},150))})}return ba.bootstrap=Sn,Object.defineProperty(ba,Symbol.toStringTag,{value:"Module"}),ba}({});
//# sourceMappingURL=financeapp-core.js.map

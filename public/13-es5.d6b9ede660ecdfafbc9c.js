!function(){function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var o=0;o<e.length;o++){var r=e[o];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function o(t,o,r){return o&&e(t.prototype,o),r&&e(t,r),t}(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{"/z4q":function(e,r,a){"use strict";a.r(r),a.d(r,"GlModule",function(){return se});var i=a("ofXK"),c=a("tyNb"),n=a("3Pt+"),b=a("I2v7"),l=a("8pgC"),s=a("8edw"),u=a("Kj3r"),f=a("/uUt"),m=a("JX91"),d=a("lJxs"),h=a("wd/R");function p(t){return h(t).format("DD/MM/YYYY")}var g,y=a("fXoL"),v=a("lGQG"),D=a("flj8"),R=a("LGoc"),w=a("tk/3"),Q=((g=function(){function e(o){t(this,e),this.http=o}return o(e,[{key:"prepare",value:function(){return this.http.get(R.q)}},{key:"getAccountCopyList",value:function(t,e,o){return this.http.get(R.o,{params:{fromDate:t,toDate:e,code:o}})}},{key:"getTrailBalanceList",value:function(){return this.http.get(R.t)}},{key:"getTradingList",value:function(t){return this.http.get(R.s,{params:{closingStock:t}})}},{key:"getProfitNLossList",value:function(t,e){return this.http.get(R.r,{params:{grossLoss:t,grossProfit:e}})}},{key:"getBalanceSheetList",value:function(t){return this.http.get(R.p,{params:{closingStock:t}})}}]),e}()).\u0275fac=function(t){return new(t||g)(y.Vb(w.b))},g.\u0275prov=y.Hb({token:g,factory:g.\u0275fac}),g),A=a("WNGt"),S=a("/1cH"),C=a("kmnG"),L=a("qFsG"),k=a("tmjD"),x=a("bTqV"),P=a("Qu3c"),N=a("NFeN"),F=a("FKr1");function O(t,e){1&t&&(y.Rb(0,"mat-error"),y.yc(1," Enter code "),y.Qb())}function T(t,e){1&t&&(y.Rb(0,"mat-error"),y.yc(1," Enter valid code "),y.Qb())}function I(t,e){1&t&&(y.Rb(0,"mat-error"),y.yc(1," Enter date "),y.Qb())}function E(t,e){1&t&&(y.Rb(0,"mat-error"),y.yc(1," Enter valid date "),y.Qb())}function M(t,e){1&t&&(y.Rb(0,"mat-error"),y.yc(1," Enter date in range "),y.Qb())}function Y(t,e){1&t&&(y.Rb(0,"mat-error"),y.yc(1," Enter date "),y.Qb())}function z(t,e){1&t&&(y.Rb(0,"mat-error"),y.yc(1," Enter valid date "),y.Qb())}function B(t,e){1&t&&(y.Rb(0,"mat-error"),y.yc(1," Enter date in range "),y.Qb())}function j(t,e){1&t&&(y.Rb(0,"mat-error"),y.yc(1," To date cannot exceed From date "),y.Qb())}function q(t,e){if(1&t&&(y.Rb(0,"mat-option",16),y.yc(1),y.Qb()),2&t){var o=e.$implicit;y.ic("value",o.code),y.Ab(1),y.Ac(" ",o.firmName+(o.town.length>0?" - "+o.town:""),"")}}function H(t,e){if(1&t&&(y.Rb(0,"tr"),y.Rb(1,"td"),y.yc(2),y.Qb(),y.Rb(3,"td"),y.yc(4),y.Qb(),y.Rb(5,"td"),y.yc(6),y.Qb(),y.Rb(7,"td",19),y.yc(8),y.dc(9,"number"),y.Qb(),y.Rb(10,"td",19),y.yc(11),y.dc(12,"number"),y.Qb(),y.Rb(13,"td",19),y.yc(14),y.Qb(),y.Qb()),2&t){var o=e.$implicit;y.Ab(2),y.zc(o.date),y.Ab(2),y.zc(o.no),y.Ab(2),y.zc(o.desc),y.Ab(2),y.zc(y.fc(9,6,o.credit,".2-2")),y.Ab(3),y.zc(y.fc(12,9,o.debit,".2-2")),y.Ab(3),y.zc(o.balance)}}function G(t,e){if(1&t&&(y.Rb(0,"div",17),y.Rb(1,"table"),y.Rb(2,"thead"),y.Rb(3,"tr"),y.Rb(4,"th"),y.yc(5,"Date"),y.Qb(),y.Rb(6,"th"),y.yc(7,"No"),y.Qb(),y.Rb(8,"th"),y.yc(9,"Description"),y.Qb(),y.Rb(10,"th"),y.yc(11,"Credit"),y.Qb(),y.Rb(12,"th"),y.yc(13,"Debit"),y.Qb(),y.Rb(14,"th"),y.yc(15,"Balance"),y.Qb(),y.Qb(),y.Qb(),y.Rb(16,"tbody"),y.wc(17,H,15,12,"tr",18),y.Qb(),y.Qb(),y.Qb()),2&t){var o=y.cc();y.Ab(17),y.ic("ngForOf",o.recordsList)}}var $,_=(($=function(){function e(o,r,a,i,c){t(this,e),this.fb=o,this.authSrvc=r,this.accountSrvc=a,this.glSrvc=i,this.alrtSrvc=c,this.shopsList=[],this.recordsList=null,this.defaultDate=Object(s.d)()}return o(e,[{key:"ngOnInit",value:function(){var t=this;this.accountSrvc.getDropdownList().subscribe(function(e){t.shopsList=e},function(t){console.log(t)}),this.dateErrorStateMatcher=new b.a("errorFromToDate"),this.accountCopyForm=this.fb.group({fromDate:[p(this.authSrvc.finYearStart),[n.w.required,n.w.maxLength(14),Object(l.a)(this.authSrvc.finYearStart,this.authSrvc.finYearEnd)]],toDate:[p(this.authSrvc.finYearEnd),[n.w.required,n.w.maxLength(14),Object(l.a)(this.authSrvc.finYearStart,this.authSrvc.finYearEnd)]],code:["",[n.w.required,n.w.maxLength(10)]]},{validators:[Object(l.b)("fromDate","toDate")]}),this.filteredOption=this.code.valueChanges.pipe(Object(u.a)(300),Object(f.a)(),Object(m.a)(""),Object(d.a)(function(e){return e?t._filter(e):t.shopsList.slice()}))}},{key:"_filter",value:function(t){var e=t.toLowerCase();return this.shopsList.filter(function(t){return t.firmName.toLowerCase().includes(e)||t.code.toLowerCase().includes(e)})}},{key:"validateNSetCode",value:function(t,e,o){o.value="";var r=this.shopsList.find(function(e){return e.code.toLowerCase()===t.toLowerCase()});r?o.value=r.firmName:""!=t&&e.setErrors({InvalidCode:!0})}},{key:"search",value:function(){var t=this;this.inProgress=!0,this.glSrvc.getAccountCopyList(this.fromDate.value,this.toDate.value,this.code.value).subscribe(function(e){t.inProgress=!1,t.recordsList=e},function(e){t.inProgress=!1,t.recordsList=null,t.alrtSrvc.showErrorAlert(e)})}},{key:"fromDate",get:function(){return this.accountCopyForm.get("fromDate")}},{key:"toDate",get:function(){return this.accountCopyForm.get("toDate")}},{key:"code",get:function(){return this.accountCopyForm.get("code")}}]),e}()).\u0275fac=function(t){return new(t||$)(y.Lb(n.e),y.Lb(v.a),y.Lb(D.a),y.Lb(Q),y.Lb(A.b))},$.\u0275cmp=y.Fb({type:$,selectors:[["app-account-copy"]],decls:40,vars:22,consts:[[3,"formGroup"],["matAutocompleteOrigin","",1,"flex-space","align-left"],["codeOrigin","matAutocompleteOrigin"],[1,"mat-title","mr-05"],[1,"space-2","mr-05"],["type","text","matInput","","formControlName","code","maxlength","10","uppercase","","required","",3,"matAutocomplete","matAutocompleteConnectedTo","blur"],[4,"ngIf"],["type","text","matInput","","maxlength","50","tabindex","-1","readonly","",3,"disabled"],["firmName",""],["type","text","matInput","","formControlName","fromDate","maxlength","14","required","","placeholder","DD/MM/YYYY","mask","00/00/0000",3,"validation"],["type","text","matInput","","formControlName","toDate","maxlength","14","required","","placeholder","DD/MM/YYYY","mask","00/00/0000",3,"validation","errorStateMatcher"],[3,"autoActiveFirstOption","optionActivated","optionSelected"],["autoCode","matAutocomplete"],[3,"value",4,"ngFor","ngForOf"],["type","button","mat-mini-fab","","color","primary","matTooltip","Search","matTooltipPosition","after",3,"disabled","click"],["style","max-height: 400px; overflow-y: auto;",4,"ngIf"],[3,"value"],[2,"max-height","400px","overflow-y","auto"],[4,"ngFor","ngForOf"],[2,"text-align","right"]],template:function(t,e){if(1&t){var o=y.Sb();y.Rb(0,"form",0),y.Rb(1,"div",1,2),y.Rb(3,"div",3),y.yc(4," Account Copy "),y.Qb(),y.Rb(5,"mat-form-field",4),y.Rb(6,"mat-label"),y.yc(7,"Code"),y.Qb(),y.Rb(8,"input",5),y.Yb("blur",function(t){y.oc(o);var r=y.mc(15);return e.validateNSetCode(t.target.value,e.code,r)}),y.Qb(),y.wc(9,O,2,0,"mat-error",6),y.wc(10,T,2,0,"mat-error",6),y.Qb(),y.Rb(11,"mat-form-field",4),y.Rb(12,"mat-label"),y.yc(13,"Firm Name"),y.Qb(),y.Mb(14,"input",7,8),y.Qb(),y.Rb(16,"mat-form-field",4),y.Rb(17,"mat-label"),y.yc(18,"From Date"),y.Qb(),y.Mb(19,"input",9),y.wc(20,I,2,0,"mat-error",6),y.wc(21,E,2,0,"mat-error",6),y.wc(22,M,2,0,"mat-error",6),y.Qb(),y.Rb(23,"mat-form-field",4),y.Rb(24,"mat-label"),y.yc(25,"To Date"),y.Qb(),y.Mb(26,"input",10),y.wc(27,Y,2,0,"mat-error",6),y.wc(28,z,2,0,"mat-error",6),y.wc(29,B,2,0,"mat-error",6),y.wc(30,j,2,0,"mat-error",6),y.Qb(),y.Rb(31,"mat-autocomplete",11,12),y.Yb("optionActivated",function(t){y.oc(o);var r=y.mc(15);return e.validateNSetCode(t.option.value,e.code,r)})("optionSelected",function(t){y.oc(o);var r=y.mc(15);return e.validateNSetCode(t.option.value,e.code,r)}),y.wc(33,q,2,2,"mat-option",13),y.dc(34,"async"),y.Qb(),y.Rb(35,"div"),y.Rb(36,"button",14),y.Yb("click",function(){return e.search()}),y.Rb(37,"mat-icon"),y.yc(38,"search"),y.Qb(),y.Qb(),y.Qb(),y.Qb(),y.Qb(),y.wc(39,G,18,1,"div",15)}if(2&t){var r=y.mc(2),a=y.mc(32);y.ic("formGroup",e.accountCopyForm),y.Ab(8),y.ic("matAutocomplete",a)("matAutocompleteConnectedTo",r),y.Ab(1),y.ic("ngIf",e.code.hasError("required")),y.Ab(1),y.ic("ngIf",e.code.hasError("InvalidCode")),y.Ab(4),y.ic("disabled",e.accountCopyForm.disabled),y.Ab(5),y.ic("validation",!1),y.Ab(1),y.ic("ngIf",e.fromDate.hasError("required")),y.Ab(1),y.ic("ngIf",e.fromDate.hasError("errorDateValue")),y.Ab(1),y.ic("ngIf",e.fromDate.hasError("errorDateRange")),y.Ab(4),y.ic("validation",!1)("errorStateMatcher",e.dateErrorStateMatcher),y.Ab(1),y.ic("ngIf",e.toDate.hasError("required")),y.Ab(1),y.ic("ngIf",e.toDate.hasError("errorDateValue")),y.Ab(1),y.ic("ngIf",e.toDate.hasError("errorDateRange")),y.Ab(1),y.ic("ngIf",e.accountCopyForm.hasError("errorFromToDate")),y.Ab(1),y.ic("autoActiveFirstOption",!0),y.Ab(2),y.ic("ngForOf",y.ec(34,20,e.filteredOption)),y.Ab(3),y.ic("disabled",!e.accountCopyForm.valid||e.inProgress),y.Ab(3),y.ic("ngIf",e.recordsList)}},directives:[n.x,n.r,n.i,S.c,C.c,C.g,L.a,n.c,s.c,S.d,n.q,n.h,n.l,n.v,i.l,k.a,S.a,i.k,x.a,P.a,N.a,C.b,F.i],pipes:[i.b,i.e],styles:[""]}),$);function J(t,e){1&t&&(y.Rb(0,"h1"),y.yc(1,"Preparing GL"),y.Qb())}function V(t,e){1&t&&(y.Rb(0,"h1"),y.yc(1,"GL Complete"),y.Qb())}function K(t,e){1&t&&(y.Rb(0,"h1"),y.yc(1,"Preparing GL Failed"),y.Qb())}var Z,X=((Z=function(){function e(o){t(this,e),this.glSrvc=o,this.glPrepareStatus=0}return o(e,[{key:"ngOnInit",value:function(){var t=this;this.glSrvc.prepare().subscribe(function(e){t.glPrepareStatus=1},function(e){console.log(e),t.glPrepareStatus=2})}}]),e}()).\u0275fac=function(t){return new(t||Z)(y.Lb(Q))},Z.\u0275cmp=y.Fb({type:Z,selectors:[["app-prepare"]],decls:4,vars:3,consts:[[2,"text-align","center"],[4,"ngIf"]],template:function(t,e){1&t&&(y.Rb(0,"div",0),y.wc(1,J,2,0,"h1",1),y.wc(2,V,2,0,"h1",1),y.wc(3,K,2,0,"h1",1),y.Qb()),2&t&&(y.Ab(1),y.ic("ngIf",0==e.glPrepareStatus),y.Ab(1),y.ic("ngIf",1==e.glPrepareStatus),y.Ab(1),y.ic("ngIf",2==e.glPrepareStatus))},directives:[i.l],styles:[""]}),Z),W=a("+0xr"),U=a("Dh3D"),tt=a("o0su");function et(t,e){1&t&&(y.Rb(0,"th",27),y.Rb(1,"strong"),y.yc(2,"Code"),y.Qb(),y.Qb())}function ot(t,e){if(1&t&&(y.Rb(0,"td",28),y.yc(1),y.Qb()),2&t){var o=e.$implicit;y.Ab(1),y.zc(o.code)}}function rt(t,e){1&t&&(y.Rb(0,"th",27),y.Rb(1,"strong"),y.yc(2,"Firm Name"),y.Qb(),y.Qb())}function at(t,e){if(1&t&&(y.Rb(0,"td",28),y.yc(1),y.Qb()),2&t){var o=e.$implicit;y.Ab(1),y.zc(o.firmName)}}function it(t,e){1&t&&(y.Rb(0,"th",27),y.Rb(1,"strong"),y.yc(2,"Town"),y.Qb(),y.Qb())}function ct(t,e){if(1&t&&(y.Rb(0,"td",28),y.yc(1),y.Qb()),2&t){var o=e.$implicit;y.Ab(1),y.zc(o.town)}}function nt(t,e){1&t&&(y.Rb(0,"th",29),y.Rb(1,"strong"),y.yc(2,"Credit"),y.Qb(),y.Qb())}function bt(t,e){if(1&t&&(y.Rb(0,"td",30),y.yc(1),y.dc(2,"number"),y.Qb()),2&t){var o=e.$implicit;y.Ab(1),y.zc(y.fc(2,1,o.credit,".2-2"))}}function lt(t,e){1&t&&(y.Rb(0,"th",29),y.Rb(1,"strong"),y.yc(2,"Debit"),y.Qb(),y.Qb())}function st(t,e){if(1&t&&(y.Rb(0,"td",30),y.yc(1),y.dc(2,"number"),y.Qb()),2&t){var o=e.$implicit;y.Ab(1),y.zc(y.fc(2,1,o.debit,".2-2"))}}function ut(t,e){if(1&t&&(y.Rb(0,"td",31),y.yc(1," No Data Available "),y.Qb()),2&t){var o=y.cc();y.Bb("colspan",o.columnsToDisplay.length)}}function ft(t,e){1&t&&y.Mb(0,"td",32),2&t&&y.Bb("colspan",3)}function mt(t,e){if(1&t&&(y.Rb(0,"td",33),y.Rb(1,"strong"),y.yc(2),y.dc(3,"number"),y.Qb(),y.Qb()),2&t){var o=y.cc();y.Ab(2),y.zc(y.fc(3,1,o.totalCredit,".2-2"))}}function dt(t,e){if(1&t&&(y.Rb(0,"td",33),y.Rb(1,"strong"),y.yc(2),y.dc(3,"number"),y.Qb(),y.Qb()),2&t){var o=y.cc();y.Ab(2),y.zc(y.fc(3,1,o.totalDebit,".2-2"))}}function ht(t,e){1&t&&y.Mb(0,"tr",34)}function pt(t,e){1&t&&y.Mb(0,"tr",35)}function gt(t,e){1&t&&y.Mb(0,"tr",36)}var yt,vt=function(){return["noData"]},Dt=function(){return["totalBalance","totalCredit","totalDebit"]},Rt=((yt=function(){function e(o,r,a,i,c){t(this,e),this.glSrvc=o,this.alrtSrvc=r,this.exportSrvc=a,this.authSrvc=i,this.route=c,this.exportColumns=["code","firmName","town","Credit","Debit"],this.columnsToDisplay=["code","firmName","town","Credit","Debit"],this.totalCredit=0,this.totalDebit=0}return o(e,[{key:"ngOnInit",value:function(){this.trailBalanceListDS=new W.o,this.refresh()}},{key:"ngAfterViewInit",value:function(){this.trailBalanceListDS.sort=this.sort}},{key:"trackList",value:function(t,e){return e.code}},{key:"applyFilter",value:function(t){this.trailBalanceListDS.filter=t}},{key:"exportData",value:function(){var t=this.authSrvc.user.username+"_opening_trail_bal_"+Date.now(),e={code:"",firmName:"",town:"",credit:this.totalCredit,debit:this.totalDebit},o=[].concat({code:"Code",firmName:"Firm Name",town:"Town",credit:"Credit",debit:"Debit"}).concat(this.trailBalanceListDS.filteredData).concat(e);this.exportSrvc.exportAsExcelFile(o,t,{filterKeys:this.exportColumns,skipHeader:!0})}},{key:"refresh",value:function(){var t=this;this.glSrvc.getTrailBalanceList().subscribe(function(e){t.trailBalanceListDS.data=t.formatData(e)},function(e){t.alrtSrvc.showErrorAlert(e)})}},{key:"formatData",value:function(t){var e=this;return t.forEach(function(t,o){e.totalCredit=+e.totalCredit.toFixed(2)+t.credit,e.totalDebit=+e.totalDebit.toFixed(2)+t.debit}),t}}]),e}()).\u0275fac=function(t){return new(t||yt)(y.Lb(Q),y.Lb(A.b),y.Lb(tt.d),y.Lb(tt.b),y.Lb(c.a))},yt.\u0275cmp=y.Fb({type:yt,selectors:[["app-trail-balance"]],viewQuery:function(t,e){var o;1&t&&(y.Dc(U.a,!0),y.Dc(W.n,!0)),2&t&&(y.lc(o=y.Zb())&&(e.sort=o.first),y.lc(o=y.Zb())&&(e.table=o.first))},decls:43,vars:10,consts:[[1,"flex-space","align-left"],[1,"mat-title","mr-05"],[1,"space-7","mr-05"],["matInput","","type","text",3,"keyup"],["type","button","mat-mini-fab","","color","primary","matTooltip","Refresh List",3,"click"],["type","button","mat-mini-fab","","color","primary","matTooltip","Download List",3,"disabled","click"],[1,"container","mat-elevation-z8"],["mat-table","","matSort","",3,"dataSource","trackBy"],["matColumnDef","code"],["mat-header-cell","","mat-sort-header","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["matColumnDef","firmName"],["matColumnDef","town"],["matColumnDef","Credit"],["mat-header-cell","","mat-sort-header","","class","align-right",4,"matHeaderCellDef"],["mat-cell","","style","text-align: right;",4,"matCellDef"],["matColumnDef","Debit"],["matColumnDef","noData"],["mat-footer-cell","","data-export","false",4,"matFooterCellDef"],["matColumnDef","totalBalance"],["mat-footer-cell","","data-export","true",4,"matFooterCellDef"],["matColumnDef","totalCredit"],["mat-footer-cell","","data-export","true","style","text-align: right;",4,"matFooterCellDef"],["matColumnDef","totalDebit"],["mat-header-row","",4,"matHeaderRowDef","matHeaderRowDefSticky"],["mat-row","",4,"matRowDef","matRowDefColumns"],["mat-footer-row","","style","text-align: center;",4,"matFooterRowDef","matFooterRowDefSticky"],["mat-header-cell","","mat-sort-header",""],["mat-cell",""],["mat-header-cell","","mat-sort-header","",1,"align-right"],["mat-cell","",2,"text-align","right"],["mat-footer-cell","","data-export","false"],["mat-footer-cell","","data-export","true"],["mat-footer-cell","","data-export","true",2,"text-align","right"],["mat-header-row",""],["mat-row",""],["mat-footer-row","",2,"text-align","center"]],template:function(t,e){1&t&&(y.Rb(0,"div",0),y.Rb(1,"div",1),y.yc(2," Trial Balance "),y.Qb(),y.Rb(3,"mat-form-field",2),y.Rb(4,"mat-label"),y.yc(5,"Filter"),y.Qb(),y.Rb(6,"input",3),y.Yb("keyup",function(t){return e.applyFilter(t.target.value)}),y.Qb(),y.Qb(),y.Rb(7,"div"),y.Rb(8,"button",4),y.Yb("click",function(){return e.refresh()}),y.Rb(9,"mat-icon"),y.yc(10,"refresh"),y.Qb(),y.Qb(),y.yc(11," \xa0 "),y.Rb(12,"button",5),y.Yb("click",function(){return e.exportData()}),y.Rb(13,"mat-icon"),y.yc(14,"save_alt"),y.Qb(),y.Qb(),y.Qb(),y.Qb(),y.Rb(15,"div",6),y.Rb(16,"table",7),y.Pb(17,8),y.wc(18,et,3,0,"th",9),y.wc(19,ot,2,1,"td",10),y.Ob(),y.Pb(20,11),y.wc(21,rt,3,0,"th",9),y.wc(22,at,2,1,"td",10),y.Ob(),y.Pb(23,12),y.wc(24,it,3,0,"th",9),y.wc(25,ct,2,1,"td",10),y.Ob(),y.Pb(26,13),y.wc(27,nt,3,0,"th",14),y.wc(28,bt,3,4,"td",15),y.Ob(),y.Pb(29,16),y.wc(30,lt,3,0,"th",14),y.wc(31,st,3,4,"td",15),y.Ob(),y.Pb(32,17),y.wc(33,ut,2,1,"td",18),y.Ob(),y.Pb(34,19),y.wc(35,ft,1,1,"td",20),y.Ob(),y.Pb(36,21),y.wc(37,mt,4,4,"td",22),y.Ob(),y.Pb(38,23),y.wc(39,dt,4,4,"td",22),y.Ob(),y.wc(40,ht,1,0,"tr",24),y.wc(41,pt,1,0,"tr",25),y.wc(42,gt,1,0,"tr",26),y.Qb(),y.Qb()),2&t&&(y.Ab(12),y.ic("disabled",0===e.trailBalanceListDS.filteredData.length),y.Ab(4),y.ic("dataSource",e.trailBalanceListDS)("trackBy",e.trackList),y.Ab(24),y.ic("matHeaderRowDef",e.columnsToDisplay)("matHeaderRowDefSticky",!0),y.Ab(1),y.ic("matRowDefColumns",e.columnsToDisplay),y.Ab(1),y.ic("matFooterRowDef",0===e.trailBalanceListDS.filteredData.length?y.jc(8,vt):y.jc(9,Dt))("matFooterRowDefSticky",!0))},directives:[C.c,C.g,L.a,x.a,P.a,N.a,W.n,U.a,W.c,W.i,W.b,W.e,W.k,W.m,W.g,W.h,U.b,W.a,W.d,W.j,W.l,W.f],pipes:[i.e],styles:[""]}),yt),wt=a("M9IT"),Qt=a("W/PH");function At(t,e){if(1&t){var o=y.Sb();y.Rb(0,"button",9),y.Yb("click",function(){return y.oc(o),y.cc(2).goToNextStage()}),y.yc(1),y.Rb(2,"mat-icon"),y.yc(3,"navigate_next"),y.Qb(),y.Qb()}if(2&t){y.cc();var r=y.mc(9),a=y.cc();y.ic("disabled",r.invalid),y.Ab(1),y.zc(a.nextStageName)}}var St=function(){return{allowDecimal:!0,allowNegative:!1,setDefaultValue:!0}};function Ct(t,e){if(1&t){var o=y.Sb();y.Rb(0,"div",2),y.Rb(1,"div",3),y.Rb(2,"h2",4),y.yc(3," Enter Closing Stock "),y.Qb(),y.Qb(),y.Rb(4,"div",3),y.Rb(5,"mat-form-field",5),y.Rb(6,"mat-label"),y.yc(7,"Closing Stock"),y.Qb(),y.Rb(8,"input",6,7),y.Yb("ngModelChange",function(t){return y.oc(o),y.cc().closingStock=t}),y.Qb(),y.Qb(),y.wc(10,At,4,2,"button",8),y.Qb(),y.Qb()}if(2&t){var r=y.cc();y.Ab(8),y.ic("ngModel",r.closingStock)("numbersOnly",y.jc(3,St)),y.Ab(2),y.ic("ngIf",r.nextStageName.length>0)}}function Lt(t,e){if(1&t){var o=y.Sb();y.Rb(0,"button",35),y.Yb("click",function(){return y.oc(o),y.cc(2).goToPreviousStage()}),y.Rb(1,"mat-icon"),y.yc(2,"navigate_before"),y.Qb(),y.yc(3),y.Qb()}if(2&t){var r=y.cc(2);y.Ab(3),y.zc(r.previousStageName)}}function kt(t,e){if(1&t){var o=y.Sb();y.Rb(0,"button",36),y.Yb("click",function(){return y.oc(o),y.cc(2).goToNextStage()}),y.yc(1),y.Rb(2,"mat-icon"),y.yc(3,"navigate_next"),y.Qb(),y.Qb()}if(2&t){var r=y.cc(2);y.Ab(1),y.zc(r.nextStageName)}}function xt(t,e){1&t&&(y.Rb(0,"th",37),y.Rb(1,"strong"),y.yc(2,"Debit Code"),y.Qb(),y.Qb())}function Pt(t,e){if(1&t&&(y.Rb(0,"td",38),y.yc(1),y.Qb()),2&t){var o=e.$implicit;y.Ab(1),y.zc(o.DbCode)}}function Nt(t,e){1&t&&(y.Rb(0,"td",39),y.Rb(1,"strong"),y.yc(2,"Total Debit"),y.Qb(),y.Qb())}function Ft(t,e){1&t&&(y.Rb(0,"th",37),y.Rb(1,"strong"),y.yc(2,"Debit Account"),y.Qb(),y.Qb())}function Ot(t,e){if(1&t&&(y.Rb(0,"td",38),y.yc(1),y.Qb()),2&t){var o=e.$implicit;y.Ab(1),y.zc(o.DbAccName)}}function Tt(t,e){1&t&&(y.Rb(0,"td",39),y.Rb(1,"strong"),y.yc(2,"\xa0"),y.Qb(),y.Qb())}function It(t,e){1&t&&(y.Rb(0,"th",37),y.Rb(1,"strong"),y.yc(2,"Debit Amount"),y.Qb(),y.Qb())}function Et(t,e){if(1&t&&(y.Rb(0,"td",38),y.yc(1),y.dc(2,"number"),y.Qb()),2&t){var o=e.$implicit;y.Ab(1),y.zc(y.fc(2,1,o.DbAmount,".2-2"))}}function Mt(t,e){if(1&t&&(y.Rb(0,"td",39),y.Rb(1,"strong"),y.yc(2),y.dc(3,"number"),y.Qb(),y.Qb()),2&t){var o=y.cc(2);y.Ab(2),y.zc(y.fc(3,1,o.totalDebit,".2-2"))}}function Yt(t,e){1&t&&(y.Rb(0,"th",37),y.Rb(1,"strong"),y.yc(2,"Credit Code"),y.Qb(),y.Qb())}function zt(t,e){if(1&t&&(y.Rb(0,"td",38),y.yc(1),y.Qb()),2&t){var o=e.$implicit;y.Ab(1),y.zc(o.CrCode)}}function Bt(t,e){1&t&&(y.Rb(0,"td",39),y.Rb(1,"strong"),y.yc(2,"Total Credit"),y.Qb(),y.Qb())}function jt(t,e){1&t&&(y.Rb(0,"th",37),y.Rb(1,"strong"),y.yc(2,"Credit Account"),y.Qb(),y.Qb())}function qt(t,e){if(1&t&&(y.Rb(0,"td",38),y.yc(1),y.Qb()),2&t){var o=e.$implicit;y.Ab(1),y.zc(o.CrAccName)}}function Ht(t,e){1&t&&(y.Rb(0,"td",39),y.Rb(1,"strong"),y.yc(2,"\xa0"),y.Qb(),y.Qb())}function Gt(t,e){1&t&&(y.Rb(0,"th",37),y.Rb(1,"strong"),y.yc(2,"Credit Amount"),y.Qb(),y.Qb())}function $t(t,e){if(1&t&&(y.Rb(0,"td",38),y.yc(1),y.dc(2,"number"),y.Qb()),2&t){var o=e.$implicit;y.Ab(1),y.zc(y.fc(2,1,o.CrAmount,".2-2"))}}function _t(t,e){if(1&t&&(y.Rb(0,"td",39),y.Rb(1,"strong"),y.yc(2),y.dc(3,"number"),y.Qb(),y.Qb()),2&t){var o=y.cc(2);y.Ab(2),y.zc(y.fc(3,1,o.totalCredit,".2-2"))}}function Jt(t,e){if(1&t&&(y.Rb(0,"td",40),y.yc(1," No Data Available "),y.Qb()),2&t){var o=y.cc(2);y.Bb("colspan",o.columnsToDisplay.length)}}function Vt(t,e){if(1&t&&(y.Rb(0,"td",39),y.yc(1),y.Qb()),2&t){var o=y.cc(2);y.Bb("colspan",2),y.Ab(1),y.Ac(" ",o.profitLabel," ")}}function Kt(t,e){if(1&t&&(y.Rb(0,"td",39),y.yc(1),y.dc(2,"number"),y.Qb()),2&t){var o=y.cc(2);y.Ab(1),y.Ac(" ",y.fc(2,1,o.profitAmount,".2-2")," ")}}function Zt(t,e){if(1&t&&(y.Rb(0,"td",39),y.yc(1),y.Qb()),2&t){var o=y.cc(2);y.Bb("colspan",2),y.Ab(1),y.Ac(" ",o.lossLabel," ")}}function Xt(t,e){if(1&t&&(y.Rb(0,"td",39),y.yc(1),y.dc(2,"number"),y.Qb()),2&t){var o=y.cc(2);y.Ab(1),y.Ac(" ",y.fc(2,1,o.lossAmount,".2-2")," ")}}function Wt(t,e){1&t&&y.Mb(0,"tr",41)}function Ut(t,e){1&t&&y.Mb(0,"tr",42)}function te(t,e){1&t&&y.Mb(0,"tr",43)}function ee(t,e){1&t&&y.Mb(0,"tr",43)}var oe=function(){return["noData"]};function re(t,e){if(1&t&&(y.Rb(0,"div"),y.Rb(1,"div",10),y.Rb(2,"div",11),y.yc(3),y.Qb(),y.Rb(4,"div",12),y.wc(5,Lt,4,1,"button",13),y.wc(6,kt,4,1,"button",14),y.Qb(),y.Qb(),y.Rb(7,"div",15),y.Rb(8,"table",16),y.Pb(9,17),y.wc(10,xt,3,0,"th",18),y.wc(11,Pt,2,1,"td",19),y.wc(12,Nt,3,0,"td",20),y.Ob(),y.Pb(13,21),y.wc(14,Ft,3,0,"th",18),y.wc(15,Ot,2,1,"td",19),y.wc(16,Tt,3,0,"td",20),y.Ob(),y.Pb(17,22),y.wc(18,It,3,0,"th",18),y.wc(19,Et,3,4,"td",19),y.wc(20,Mt,4,4,"td",20),y.Ob(),y.Pb(21,23),y.wc(22,Yt,3,0,"th",18),y.wc(23,zt,2,1,"td",19),y.wc(24,Bt,3,0,"td",20),y.Ob(),y.Pb(25,24),y.wc(26,jt,3,0,"th",18),y.wc(27,qt,2,1,"td",19),y.wc(28,Ht,3,0,"td",20),y.Ob(),y.Pb(29,25),y.wc(30,Gt,3,0,"th",18),y.wc(31,$t,3,4,"td",19),y.wc(32,_t,4,4,"td",20),y.Ob(),y.Pb(33,26),y.wc(34,Jt,2,1,"td",27),y.Ob(),y.Pb(35,28),y.wc(36,Vt,2,2,"td",20),y.Ob(),y.Pb(37,29),y.wc(38,Kt,3,4,"td",20),y.Ob(),y.Pb(39,30),y.wc(40,Zt,2,2,"td",20),y.Ob(),y.Pb(41,31),y.wc(42,Xt,3,4,"td",20),y.Ob(),y.wc(43,Wt,1,0,"tr",32),y.wc(44,Ut,1,0,"tr",33),y.wc(45,te,1,0,"tr",34),y.wc(46,ee,1,0,"tr",34),y.Qb(),y.Qb(),y.Qb()),2&t){var o=y.cc();y.Ab(3),y.Ac(" ",o.currentReportName," "),y.Ab(2),y.ic("ngIf",o.previousStageName.length>0),y.Ab(1),y.ic("ngIf",o.nextStageName.length>0),y.Ab(2),y.ic("dataSource",o.financialListDS),y.Ab(35),y.ic("matHeaderRowDef",o.columnsToDisplay)("matHeaderRowDefSticky",!0),y.Ab(1),y.ic("matRowDefColumns",o.columnsToDisplay),y.Ab(1),y.ic("matFooterRowDef",0===o.financialListDS.filteredData.length?y.jc(11,oe):o.footerColumnsToDisplay)("matFooterRowDefSticky",!0),y.Ab(1),y.ic("matFooterRowDef",o.columnsToDisplay)("matFooterRowDefSticky",!0)}}var ae,ie,ce,ne=[{path:"prepare",component:X},{path:"account",component:_},{path:"trail-balance",component:Rt},{path:"financials",component:(ae=function(){function e(o,r){t(this,e),this.glSrvc=o,this.alrtSrvc=r,this.columnsToDisplay=["DbCode","DbAccName","DbAmount","CrCode","CrAccName","CrAmount"],this.footerColumnsToDisplay=["Profit","ProfitAmount","Loss","LossAmount"],this.currentReport=0,this.currentReportName="",this.nextStageName="",this.previousStageName="",this.profitLabel="",this.profitAmount="",this.lossLabel="",this.lossAmount="",this.closingStock="0.00",this.totalCredit="",this.totalDebit="",this.grossLoss="",this.grossProfit="",this.netLoss="",this.netProfit=""}return o(e,[{key:"ngOnInit",value:function(){this.financialListDS=new W.o,this.gotoReport()}},{key:"getTradingList",value:function(){var t=this;this.glSrvc.getTradingList(this.closingStock).subscribe(function(e){t.financialListDS.data=t.formatData(e.tradingList),t.totalDebit=e.totalDebit,t.totalCredit=e.totalCredit,t.grossProfit=e.grossProfit,t.grossLoss=e.grossLoss,t.profitLabel="Gross Profit",t.profitAmount=""+t.grossProfit,t.lossLabel="Gross Loss",t.lossAmount=""+t.grossLoss,t.footerColumnsToDisplay=["Profit","ProfitAmount","Loss","LossAmount"]},function(e){t.alrtSrvc.showErrorAlert(e)})}},{key:"getProfitNLossList",value:function(){var t=this;this.glSrvc.getProfitNLossList(this.grossLoss,this.grossProfit).subscribe(function(e){t.financialListDS.data=t.formatData(e.profitNLossList),t.totalDebit=e.totalDebit,t.totalCredit=e.totalCredit,t.netProfit=e.netProfit,t.netLoss=e.netLoss,t.profitLabel="Net Profit",t.profitAmount=""+t.netProfit,t.lossLabel="Net Loss",t.lossAmount=""+t.netLoss,t.footerColumnsToDisplay=["Profit","ProfitAmount","Loss","LossAmount"]},function(e){t.alrtSrvc.showErrorAlert(e)})}},{key:"getBalanceSheetList",value:function(){var t=this;this.glSrvc.getBalanceSheetList(this.closingStock).subscribe(function(e){t.financialListDS.data=t.formatData(e.balanceSheetList),t.totalDebit=e.totalDebit,t.totalCredit=e.totalCredit,t.profitLabel=t.profitAmount=t.lossLabel=t.lossAmount="",t.footerColumnsToDisplay=[]},function(e){t.alrtSrvc.showErrorAlert(e)})}},{key:"formatData",value:function(t){return t}},{key:"gotoReport",value:function(){switch(this.currentReport){case 0:this.currentReportName="",this.previousStageName="",this.nextStageName="Trading";break;case 1:this.currentReportName="Trading",this.previousStageName="Change Closing Stock",this.nextStageName="Profit And Loss",this.getTradingList();break;case 2:this.currentReportName="Profit And Loss",this.nextStageName="Balance Sheet",this.previousStageName="Trading",this.getProfitNLossList();break;case 3:this.currentReportName="Balance Sheet",this.nextStageName="",this.previousStageName="Profit And Loss",this.getBalanceSheetList()}}},{key:"goToNextStage",value:function(){this.currentReport=this.currentReport+1,this.gotoReport()}},{key:"goToPreviousStage",value:function(){this.currentReport=this.currentReport-1,this.gotoReport()}},{key:"matPaginator",set:function(t){t&&(this.financialListDS.paginator=t)}},{key:"matSort",set:function(t){t&&(this.financialListDS.sort=t)}}]),e}(),ae.\u0275fac=function(t){return new(t||ae)(y.Lb(Q),y.Lb(Qt.b))},ae.\u0275cmp=y.Fb({type:ae,selectors:[["app-financial"]],viewQuery:function(t,e){var o;1&t&&(y.Dc(wt.a,!0),y.Dc(U.a,!0)),2&t&&(y.lc(o=y.Zb())&&(e.matPaginator=o.first),y.lc(o=y.Zb())&&(e.matSort=o.first))},decls:3,vars:3,consts:[["style","width: 100%;height: 80vh;flex-direction: column;justify-content: center;text-align: center;display: flex;",4,"ngIf"],[4,"ngIf"],[2,"width","100%","height","80vh","flex-direction","column","justify-content","center","text-align","center","display","flex"],[2,"width","100%"],[2,"font-weight","initial"],[1,"mr-05",2,"width","25%"],["type","text","matInput","","maxlength","15","required","",3,"ngModel","numbersOnly","ngModelChange"],["closingStockFld","ngModel"],["type","button","class","reduce-right-pad","mat-raised-button","","color","primary",3,"disabled","click",4,"ngIf"],["type","button","mat-raised-button","","color","primary",1,"reduce-right-pad",3,"disabled","click"],[1,"flex-space","align-left"],[1,"space-full-1-5","mat-title"],[1,"space-full-8-5","flex"],["type","button","class","reduce-left-pad","mat-raised-button","","color","primary",3,"click",4,"ngIf"],["type","button","class","reduce-right-pad","mat-raised-button","","color","primary",3,"click",4,"ngIf"],[1,"container","mat-elevation-z8"],["mat-table","","matSort","",3,"dataSource"],["matColumnDef","DbCode"],["mat-header-cell","","mat-sort-header","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["mat-footer-cell","",4,"matFooterCellDef"],["matColumnDef","DbAccName"],["matColumnDef","DbAmount"],["matColumnDef","CrCode"],["matColumnDef","CrAccName"],["matColumnDef","CrAmount"],["matColumnDef","noData"],["mat-footer-cell","","style","text-align: center;",4,"matFooterCellDef"],["matColumnDef","Profit"],["matColumnDef","ProfitAmount"],["matColumnDef","Loss"],["matColumnDef","LossAmount"],["mat-header-row","",4,"matHeaderRowDef","matHeaderRowDefSticky"],["mat-row","",4,"matRowDef","matRowDefColumns"],["mat-footer-row","",4,"matFooterRowDef","matFooterRowDefSticky"],["type","button","mat-raised-button","","color","primary",1,"reduce-left-pad",3,"click"],["type","button","mat-raised-button","","color","primary",1,"reduce-right-pad",3,"click"],["mat-header-cell","","mat-sort-header",""],["mat-cell",""],["mat-footer-cell",""],["mat-footer-cell","",2,"text-align","center"],["mat-header-row",""],["mat-row",""],["mat-footer-row",""]],template:function(t,e){1&t&&(y.Rb(0,"div"),y.wc(1,Ct,11,4,"div",0),y.wc(2,re,47,12,"div",1),y.Qb()),2&t&&(y.ic("@animSlider",e.currentReport),y.Ab(1),y.ic("ngIf",0==e.currentReport),y.Ab(1),y.ic("ngIf",e.currentReport>0))},directives:[i.l,C.c,C.g,L.a,n.c,s.a,n.l,n.v,n.q,n.t,x.a,N.a,W.n,U.a,W.c,W.i,W.b,W.e,W.k,W.m,W.g,W.h,U.b,W.a,W.d,W.j,W.l,W.f],pipes:[i.e],styles:[""]}),ae)}],be=((ie=function e(){t(this,e)}).\u0275mod=y.Jb({type:ie}),ie.\u0275inj=y.Ib({factory:function(t){return new(t||ie)},imports:[[c.d.forChild(ne)],c.d]}),ie),le=a("1+r1"),se=((ce=function e(){t(this,e)}).\u0275mod=y.Jb({type:ce}),ce.\u0275inj=y.Ib({factory:function(t){return new(t||ce)},providers:[Q],imports:[[i.c,n.k,n.u,le.a,s.b,be,k.b.forChild()]]}),ce)}}])}();
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-47887eed"],{"66af":function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"wrapper"}},[a("navbar",{staticClass:"no-print animate__animated animate__fadeInLeft",staticStyle:{display:"none"},attrs:{id:"nav"}}),a("div",{staticClass:"d-flex flex-column animate__animated animate__fadeInRight",staticStyle:{display:"none !important"},attrs:{id:"content-wrapper"}},[a("div",{attrs:{id:"content"}},[a("header-btn",{staticClass:"no-print"}),a("div",{staticClass:"container-fluid text-dark"},[a("div",{staticClass:"row px-1 py-3 mb-1 no-print"},[a("label",{staticClass:"mt-2 mb-2 me-3"},[t._v(" From: ")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.from,expression:"from"}],staticClass:"form-control col-xl-1 col-md-4 mb-2",attrs:{type:"number"},domProps:{value:t.from},on:{input:function(e){e.target.composing||(t.from=e.target.value)}}}),a("label",{staticClass:"mt-2 mb-2 mx-3"},[t._v(" To: ")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.to,expression:"to"}],staticClass:"form-control col-xl-1 col-md-4 mb-2",attrs:{type:"number"},domProps:{value:t.to},on:{input:function(e){e.target.composing||(t.to=e.target.value)}}}),a("label",{staticClass:"mt-2 mx-3"},[t._v(" Staffs: ")]),a("select",{directives:[{name:"model",rawName:"v-model",value:t.staff_id,expression:"staff_id"}],staticClass:"form-control col-sm-2 mb-2",on:{change:function(e){var s=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.staff_id=e.target.multiple?s:s[0]}}},[a("option",{attrs:{value:""}}),t._l(t.staffs.filter((function(e){return e.special_staff==t.showSpecialStaffs})),(function(e){return a("option",{key:e.st_id,domProps:{value:e.st_id}},[t._v(" "+t._s(e.staff_name)+" ")])}))],2),a("span",{staticClass:"col-1"},[a("v-checkbox",{staticClass:"mt-1 custom-checkbox-label",attrs:{"true-value":"true","false-value":"false",label:"Specials"},model:{value:t.showSpecialStaffs,callback:function(e){t.showSpecialStaffs=e},expression:"showSpecialStaffs"}})],1),a("label",{staticClass:"mt-2 me-3"},[t._v(" Project: ")]),a("select",{directives:[{name:"model",rawName:"v-model",value:t.project_id,expression:"project_id"}],staticClass:"form-control col-sm-2 mb-2 px-1",on:{change:function(e){var s=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.project_id=e.target.multiple?s:s[0]}}},[a("option",{attrs:{value:""}}),t._l(t.projects,(function(e){return a("option",{key:e.project_id,domProps:{value:e.project_id}},[t._v(" "+t._s(e.project_name)+" ")])}))],2),a("label",{staticClass:"mt-2 mx-3"},[t._v(" Location: ")]),a("select",{directives:[{name:"model",rawName:"v-model",value:t.location,expression:"location"}],staticClass:"form-control col-sm-2 mb-2 px-1",on:{change:function(e){var s=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.location=e.target.multiple?s:s[0]}}},[a("option",{attrs:{value:""}}),t._l(t.locations,(function(e,s){return a("option",{key:"ll"+s,domProps:{value:e.location}},[t._v(" "+t._s(e.location)+" ")])}))],2),a("button",{staticClass:"btn btn-success ms-3 mb-2",staticStyle:{height:"37px"},on:{click:function(e){return t.search()}}},[a("i",{staticClass:"fa fa-search"})]),a("hr")]),a("hr",{staticClass:"no-print"}),a("div",{staticClass:"row no-print",attrs:{dir:"rtl"}},[a("label",{staticClass:"mt-1 col-xl-1 mb-2"},[t._v(" بەڕێوەبەر: ")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.manager,expression:"manager"}],staticClass:"form-control col-xl-2 col-md-4 mb-2",attrs:{type:"text"},domProps:{value:t.manager},on:{change:function(e){return t.changeNames()},input:function(e){e.target.composing||(t.manager=e.target.value)}}}),a("label",{staticClass:"mt-1 col-xl-1 mb-2"},[t._v(" ژمێریار: ")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.accountant,expression:"accountant"}],staticClass:"form-control col-xl-2 col-md-4 mb-2",attrs:{type:"text"},domProps:{value:t.accountant},on:{change:function(e){return t.changeNames()},input:function(e){e.target.composing||(t.accountant=e.target.value)}}}),a("label",{staticClass:"mt-1 col-xl-1 mb-2"},[t._v(" دارایی: ")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.kargeri,expression:"kargeri"}],staticClass:"form-control col-xl-2 col-md-4 mb-2",attrs:{type:"text"},domProps:{value:t.kargeri},on:{change:function(e){return t.changeNames()},input:function(e){e.target.composing||(t.kargeri=e.target.value)}}})]),a("hr",{staticClass:"no-print"}),t._m(0),a("hr",{staticClass:"my-1"}),a("div",[t._v(" "+t._s((new Date).toISOString().split("T")[0])+" ")]),a("div",{staticClass:"mt-1",staticStyle:{color:"black"}},[a("p",{staticClass:"text-center"},[t._v(" فەرمانی خەرجکردن ")]),a("p",{staticClass:"text-right mt-5",attrs:{dir:"rtl"}},[t._v(" بڕیاردرا بە خەرجکردنی بڕی ("+t._s(t.total.toLocaleString())+") "+t._s(t.numToWord(t.total))+" دینار بۆ "+t._s(t.staff_id?t.staffs.find((function(e){return e.st_id==t.staff_id})).staff_name:"")+" بۆ خەرجی لە فۆڕمی "+t._s(t.from)+" بۆ فۆڕمی "+t._s(t.to)+" بەپێی ئەم خشتەیەی لای خوارەوە: ")])]),a("div",[a("table",{staticClass:"table table-bordered table-striped text-center",staticStyle:{"page-break-inside":"always","font-size":"12pt !important"},attrs:{dir:"rtl"}},[t._m(1),a("tbody",[t._l(t.expenses,(function(e){return a("tr",{key:e.staff_expense_id},[a("td",[t._v(" "+t._s(e.form)+" ")]),a("td",[t._v(" "+t._s(new Date(e.expense_date).toISOString().split("T")[0])+" ")]),a("td",[t._v(" "+t._s(e.qty)+" ")]),a("td",[t._v(" "+t._s(e.unit)+" ")]),a("td",[t._v(" "+t._s(e.price.toLocaleString())+" ")]),a("td",[t._v(" "+t._s(e.total.toLocaleString())+" ")]),a("td",[t._v(" "+t._s(e.project_name)+" ")]),a("td",[t._v(" "+t._s(e.location)+" ")]),a("td",[t._v(" "+t._s(e.expense_text)+" ")])])})),a("tr",[a("td",{staticClass:"text-left para-total",attrs:{colspan:"4"}},[t._v(" کــۆ: ")]),a("td",{staticClass:"para-total"},[t._v(" "+t._s(t.total.toLocaleString())+" ")]),a("td",{staticClass:"para-total text-right",attrs:{colspan:"4"}},[t._v(" "+t._s(t.numToWord(t.total))+" دینار ")])])],2)]),a("div",{staticClass:"row mt-15 mb-8",attrs:{dir:"rtl"}},[a("div",{staticClass:"col-4 text-center",staticStyle:{color:"black"}},[t._v(" بەڕێوەبەر "),a("br"),t._v(" "+t._s(t.manager)+" ")]),a("div",{staticClass:"col-4 text-center",staticStyle:{color:"black"}},[t._v(" ژمێریار "),a("br"),t._v(" "+t._s(t.accountant)+" ")]),a("div",{staticClass:"col-4 text-center",staticStyle:{color:"black"}},[t._v(" بەڕێوەبەری دارایی "),a("br"),t._v(" "+t._s(t.kargeri)+" ")])]),a("img",{attrs:{src:s("d9a5"),alt:"",width:"100%"}})])])],1)])],1)},n=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"row mt-3"},[a("div",{staticClass:"col-4",staticStyle:{color:"black"}},[a("h3",[t._v(" Ideal Power Company ")]),a("p",[t._v(" For Contracting Electrical, Mechanical, General Trading, Renewable Energy & Clean Energy / LTD ")])]),a("div",{staticClass:"col-4 text-center",staticStyle:{color:"black"}},[a("img",{staticClass:"mt-n3",attrs:{src:s("70f2"),width:"75%"}})]),a("div",{staticClass:"col-4 text-right",staticStyle:{color:"black"}},[a("h2",[t._v(" کۆمپانیای ئایدیەڵ پاوەر ")]),a("p",[t._v(" بۆ بەڵێندەرایەتی کارەبایی و میکانیکی و بازرگانی گشتی و وزەی نوێ بووە و وزەی تاک / سنوردار ")])])])},function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("thead",[s("th",{staticStyle:{width:"8%","font-weight":"600"}},[t._v(" فۆڕم ")]),s("th",{staticStyle:{width:"11%","font-weight":"600"}},[t._v(" بەروار ")]),s("th",{staticStyle:{width:"9%","font-weight":"600"}},[t._v(" بڕ ")]),s("th",{staticStyle:{width:"9%","font-weight":"600"}},[t._v(" هێند ")]),s("th",{staticStyle:{width:"9%","font-weight":"600"}},[t._v(" نرخ ")]),s("th",{staticStyle:{width:"13%","font-weight":"600"}},[t._v(" کۆی نرخ ")]),s("th",{staticStyle:{"font-weight":"600"}},[t._v(" پڕۆژە ")]),s("th",{staticStyle:{"font-weight":"600"}},[t._v(" شوێن ")]),s("th",{staticStyle:{"font-weight":"600"}},[t._v(" خەرجی ")])])}],r=(s("13d5"),s("1ab6"));class i{static convert(t){return"number"!==typeof t?"The entered number was not valid":(t=parseInt(t).toString(),"ones"===this._get_number_type(t)?this._calculate_ones(t):"tens"===this._get_number_type(t)?this._calculate_tens(t):"hundreds"===this._get_number_type(t)?this._calculate_hundreds(t):"thousands"===this._get_number_type(t)?this._calculate_thousands(t):"tens-thousands"===this._get_number_type(t)?this._calculate_tens_thousands(t):"hundreds-thousands"===this._get_number_type(t)?this._calculate_hundreds_thousands(t):"millions"===this._get_number_type(t)?this._calculate_millions(t):"tens-millions"===this._get_number_type(t)?this._calculate_tens_millions(t):"hundreds-millions"===this._get_number_type(t)?this._calculate_hundreds_millions(t):"large-number"===this._get_number_type(t)?this._calculate_large_number(t):void 0)}static _calculate_ones(t){const e={0:"سفڕ",1:"یەک",2:"دوو",3:"سێ",4:"چوار",5:"پێنج",6:"شەش",7:"حەوت",8:"هەشت",9:"نۆ"};return e[t]}static _calculate_tens(t){if(t.toString().startsWith("0"))return this._calculate_ones(parseInt(t.substr(1)));const e={10:"دە",11:"یازدە",12:"دوازدە",13:"سێزدە",14:"چواردە",15:"پازدە",16:"شازدە",17:"حەڤدە",18:"هەژدە",19:"نۆزدە",20:"بیست",30:"سی",40:"چل",50:"پەنجا",60:"شەست",70:"حەفتا",80:"هەشتا",90:"نەوەد"};if(void 0!==e[t])return e[t];{const s=(10*parseInt(t.toString().substr(0,1))).toString(),a=parseInt(t.toString().substr(1,1)).toString();return e[s]+this._get_joint()+this._calculate_ones(a)}}static _calculate_hundreds(t){if("100"===t)return"سەد";if(t.endsWith("00")){const e=t.substr(0,1);return this._calculate_ones(e)+"سەد"}{const e=t.substr(0,1),s=parseInt(t.substr(1)).toString();switch(s.length){case 1:return this._calculate_hundreds((100*parseInt(e)).toString())+this._get_joint()+this._calculate_ones(s);case 2:return this._calculate_hundreds((100*parseInt(e)).toString())+this._get_joint()+this._calculate_tens(s)}}}static _calculate_thousands(t){if("1000"===t)return"هەزار";if(t.endsWith("000")){const e=t.substr(0,1);return t.startsWith("5")?"پێنج هەزار":this._calculate_ones(e)+" هەزار"}const e=parseInt(t.substr(1));let s="";switch(e.toString().length){case 1:s=this._calculate_ones(e.toString());break;case 2:s=this._calculate_tens(e.toString());break;default:s=this._calculate_hundreds(e.toString());break}if(t.startsWith("5"))return"پێنج هەزار"+this._get_joint()+s;if(t.startsWith("1"))return"هەزار"+this._get_joint()+s;{const e=parseInt(t.substr(0,1));return this._calculate_ones(e.toString())+" هەزار"+this._get_joint()+s}}static _calculate_tens_thousands(t){if(t.endsWith("000")){const e=t.substr(0,2);return this._calculate_tens(e)+" هەزار"}const e=parseInt(t.substr(2));let s="";switch(e.toString().length){case 1:s=this._calculate_ones(e.toString());break;case 2:s=this._calculate_tens(e.toString());break;default:s=this._calculate_hundreds(e.toString());break}const a=parseInt(t.substr(0,2));return this._calculate_tens(a.toString())+" هەزار"+this._get_joint()+s}static _calculate_hundreds_thousands(t){if(t.endsWith("000")){const e=t.substr(0,3);return this._calculate_hundreds(e)+" هەزار"}const e=parseInt(t.substr(3));let s="";switch(e.toString().length){case 1:s=this._calculate_ones(e.toString());break;case 2:s=this._calculate_tens(e.toString());break;default:s=this._calculate_hundreds(e.toString());break}const a=parseInt(t.substr(0,3));return this._calculate_hundreds(a.toString())+" هەزار"+this._get_joint()+s}static _calculate_millions(t){if("1000000"===t)return"ملیۆن";if(t.endsWith("000000")){const e=t.substr(0,1);return t.startsWith("5")?"پێنج ملیۆن":this._calculate_ones(e)+" ملیۆن"}const e=parseInt(t.substr(1));let s="";switch(e.toString().length){case 1:s=this._calculate_ones(e.toString());break;case 2:s=this._calculate_tens(e.toString());break;case 3:s=this._calculate_hundreds(e.toString());break;case 4:s=this._calculate_thousands(e.toString());break;case 5:s=this._calculate_tens_thousands(e.toString());break;default:s=this._calculate_hundreds_thousands(e.toString());break}if(t.startsWith("5"))return"پێنج ملیۆن"+this._get_joint()+s;if(t.startsWith("1"))return"ملیۆن"+this._get_joint()+s;{const e=parseInt(t.substr(0,1));return this._calculate_ones(e.toString())+" ملیۆن"+this._get_joint()+s}}static _calculate_tens_millions(t){if(t.endsWith("000000")){const e=t.substr(0,2);return this._calculate_tens(e)+" ملیۆن"}const e=parseInt(t.substr(2));let s="";switch(e.toString().length){case 1:s=this._calculate_ones(e.toString());break;case 2:s=this._calculate_tens(e.toString());break;case 3:s=this._calculate_hundreds(e.toString());break;case 4:s=this._calculate_thousands(e.toString());break;case 5:s=this._calculate_tens_thousands(e.toString());break;default:s=this._calculate_hundreds_thousands(e.toString());break}const a=parseInt(t.substr(0,2));return this._calculate_tens(a.toString())+" ملیۆن"+this._get_joint()+s}static _calculate_hundreds_millions(t){if(t.endsWith("000000")){const e=t.substr(0,3);return this._calculate_hundreds(e)+" ملیۆن"}const e=parseInt(t.substr(3));let s="";switch(e.toString().length){case 1:s=this._calculate_ones(e.toString());break;case 2:s=this._calculate_tens(e.toString());break;case 3:s=this._calculate_hundreds(e.toString());break;case 4:s=this._calculate_thousands(e.toString());break;case 5:s=this._calculate_tens_thousands(e.toString());break;default:s=this._calculate_hundreds_thousands(e.toString());break}const a=parseInt(t.substr(0,3));return this._calculate_hundreds(a.toString())+" ملیۆن"+this._get_joint()+s}static _calculate_large_number(t){return"1000000000"===t?"ملیار":t.split("").map(t=>i._calculate_ones(t)).join(" ")}static _get_number_type(t){switch(t.length){case 1:return"ones";case 2:return"tens";case 3:return"hundreds";case 4:return"thousands";case 5:return"tens-thousands";case 6:return"hundreds-thousands";case 7:return"millions";case 8:return"tens-millions";case 9:return"hundreds-millions";default:return"large-number"}}static _get_joint(){return" و "}}console.log(i.convert(9876));var c={name:"staff_expenses_report",data(){return{staff_id:null,staffs:[],expenses:[],month:(new Date).getMonth()+1,year:(new Date).getFullYear(),from:1,to:1,employees:[],manager:"",accountant:"",kargeri:"",showSpecialStaffs:"false",projects:[],project_id:null,location:null}},beforeCreate(){Object(r["a"])("staff_expenses_report")},created(){this.$http.get("/getNames").then(({data:t})=>{this.manager=t.manager,this.kargeri=t.kargeri,this.accountant=t.accountant}),this.$http.post("/staff/getData").then(({data:t})=>{this.staffs=t.filter(t=>"1"==t.show_staff).sort((t,e)=>t.staff_sort_code-e.staff_sort_code)})},mounted(){setTimeout(()=>{this.$http.post("/projects/getData").then(({data:t})=>{this.projects=t}),this.$http.get("/staff_expenses/getLocations").then(({data:t})=>{this.locations=t})},500)},methods:{numToWord(t){return i.convert(t)},search(){this.from&&this.to&&this.staff_id?this.$http.post("/staff_expenses/getDataByStaff",{staff_id:this.staff_id,from:this.from,to:this.to,project_id:this.project_id||null,location:this.location||null}).then(({data:t})=>{this.expenses=t}):this.expenses=[]},changeNames(){this.$http.post("/setNames",{manager:this.manager,kargeri:this.kargeri,accountant:this.accountant}).then(()=>{})}},computed:{total(){return this.expenses.reduce((t,e)=>t+e.total,0)}},watch:{staff_id(){this.search()},from(){this.search()},to(){this.search()},project_id(){this.search()},location(){this.search()}}},o=c,l=(s("e181"),s("2877")),_=s("6544"),u=s.n(_),h=s("ac7c"),d=Object(l["a"])(o,a,n,!1,null,"7cf81ec6",null);e["default"]=d.exports;u()(d,{VCheckbox:h["a"]})},d9a5:function(t,e,s){t.exports=s.p+"img/footer.d2ad0bc0.png"},e181:function(t,e,s){"use strict";s("eb14")},eb14:function(t,e,s){}}]);
//# sourceMappingURL=chunk-47887eed.a96ca12c.js.map
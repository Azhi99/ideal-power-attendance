(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-58420164"],{"30fb":function(e,t,a){},"44d1":function(e,t,a){"use strict";a.r(t);var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"wrapper"}},[a("navbar",{staticClass:"no-print animate__animated animate__fadeInLeft",staticStyle:{display:"none"},attrs:{id:"nav"}}),a("div",{staticClass:"d-flex flex-column animate__animated animate__fadeInRight",staticStyle:{display:"none !important"},attrs:{id:"content-wrapper"}},[a("div",{attrs:{id:"content"}},[a("header-btn"),a("div",{staticClass:"container-fluid text-dark"},[a("div",{staticClass:"row px-1 py-3 mb-1 no-print"},[a("label",{staticClass:"mt-1 col-xl-1 mb-2"},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].month)+": ")]),a("select",{directives:[{name:"model",rawName:"v-model",value:e.month,expression:"month"}],staticClass:"form-control col-xl-1 col-md-4 mb-2",on:{change:function(t){var a=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){var t="_value"in e?e._value:e.value;return t}));e.month=t.target.multiple?a:a[0]}}},[a("option",{attrs:{value:"1"}},[e._v("1")]),a("option",{attrs:{value:"2"}},[e._v("2")]),a("option",{attrs:{value:"3"}},[e._v("3")]),a("option",{attrs:{value:"4"}},[e._v("4")]),a("option",{attrs:{value:"5"}},[e._v("5")]),a("option",{attrs:{value:"6"}},[e._v("6")]),a("option",{attrs:{value:"7"}},[e._v("7")]),a("option",{attrs:{value:"8"}},[e._v("8")]),a("option",{attrs:{value:"9"}},[e._v("9")]),a("option",{attrs:{value:"10"}},[e._v("10")]),a("option",{attrs:{value:"11"}},[e._v("11")]),a("option",{attrs:{value:"12"}},[e._v("12")])]),a("label",{staticClass:"mt-1 col-xl-1 mb-2"},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].year)+": ")]),a("input",{directives:[{name:"model",rawName:"v-model",value:e.year,expression:"year"}],staticClass:"form-control col-xl-1 col-md-4 mb-2",attrs:{type:"number",min:"2020"},domProps:{value:e.year},on:{input:function(t){t.target.composing||(e.year=t.target.value)}}}),a("label",{staticClass:"mt-1 col-xl-2 mb-2"},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].phone_number)+": ")]),a("input",{directives:[{name:"model",rawName:"v-model",value:e.phone,expression:"phone"}],staticClass:"form-control col-xl-2 col-md-4 mb-2",attrs:{type:"text",maxlength:"11"},domProps:{value:e.phone},on:{input:function(t){t.target.composing||(e.phone=t.target.value)}}}),a("button",{staticClass:"btn btn-success col-xl-2 col-md-4 mx-2 mb-2",on:{click:function(t){return e.search()}}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].search)+" "),a("i",{staticClass:"fa fa-search"})]),a("hr")]),a("hr",{staticClass:"no-print"}),a("button",{staticClass:"no-print btn btn-info btn-block mb-3",attrs:{"data-toggle":"collapse","data-target":"#staffs"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].staffs)+" "),a("i",{staticClass:"fa fa-arrow-down"})]),a("div",{staticClass:"collapse",attrs:{id:"staffs"}},[a("div",{staticClass:"row no-print"},[a("label",{staticClass:"col-sm-1 mt-1"},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].staffs)+": ")]),a("select",{directives:[{name:"model",rawName:"v-model",value:e.staff_id,expression:"staff_id"}],staticClass:"form-control col-sm-3 mb-2",on:{change:function(t){var a=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){var t="_value"in e?e._value:e.value;return t}));e.staff_id=t.target.multiple?a:a[0]}}},[a("option",{attrs:{value:""}}),e._l(e.staffs.filter((function(t){return"E"==e.user.type||t.special_staff==e.showSpecialStaffs})),(function(t){return a("option",{key:t.st_id,domProps:{value:t.st_id}},[e._v(" "+e._s(t.staff_name)+" ")])}))],2),"A"==e.user.type||"K"==e.user.type?a("span",{staticClass:"col-1"},[a("v-checkbox",{staticClass:"mt-1 custom-checkbox-label",attrs:{"true-value":"true","false-value":"false",label:"Specials"},model:{value:e.showSpecialStaffs,callback:function(t){e.showSpecialStaffs=t},expression:"showSpecialStaffs"}})],1):e._e(),e.staff_id?a("div",{staticClass:"col-sm-3 mb-2"},[a("button",{staticClass:"btn btn-success btn-block",attrs:{id:"btn-actived-employees"},on:{click:function(t){return e.get_actived()}}},[e._v(" Actived Employees ")])]):e._e(),e.staff_id?a("div",{staticClass:"col-sm-3 mb-2"},[a("button",{staticClass:"btn btn-danger btn-block",attrs:{id:"btn-deactived-employees"},on:{click:function(t){return e.get_deactived()}}},[e._v(" Dectived Employees ")])]):e._e()]),a("hr",{staticClass:"no-print"}),a("div",{staticClass:"row no-print"},e._l(e.employees,(function(t){return a("div",{key:t.phone,staticClass:"col-sm-2 mb-2"},[a("button",{staticClass:"btn btn-primary btn-block",on:{click:function(a){e.emp_id=t.emp_id}}},[e._v(" "+e._s(t.full_name)+" ")])])})),0)]),"K"!=e.user.type?a("hr",{staticClass:"no-print"}):e._e(),"K"!=e.user.type?a("div",{staticClass:"no-print row"},[a("label",{staticClass:"mt-1 mx-2"},[e._v(" 1 $ = ")]),a("input",{directives:[{name:"model",rawName:"v-model",value:e.dollar_price,expression:"dollar_price"}],staticClass:"form-control col-xl-1 text-center",attrs:{type:"number",min:"0",readonly:null!=e.gs_id},domProps:{value:e.dollar_price},on:{input:function(t){t.target.composing||(e.dollar_price=t.target.value)}}}),a("label",{staticClass:"mt-1 mx-2"},[e._v(" IQD ")])]):e._e(),a("hr",{staticClass:"no-print"}),a("div",{staticClass:"row px-1 py-1 mb-2",attrs:{id:"report"}},[a("div",{staticClass:"col-12 py-1 multi-language no-print-border",staticStyle:{border:"1px solid","overflow-x":"auto"}},[a("img",{staticClass:"mb-3 float-right",staticStyle:{border:"1px solid"},attrs:{src:e.employee.personal_image,width:"12%"}}),e.user.en_id||"K"==e.user.type?e._e():[null!=e.gs_id?a("button",{staticClass:"btn btn-success btn-multi-language ml-1 float-right no-print",attrs:{"data-toggle":"modal","data-target":"#mdl_give_detail"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].give_salary)+" "),a("i",{staticClass:"fa fa-check-circle"})]):a("button",{staticClass:"btn btn-primary btn-multi-language ml-1 float-right no-print",on:{click:function(t){return e.create_monthly_receipt()}}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].create_monthly_receipt)+" "),a("i",{staticClass:"fa fa-plus"})])],e.debt<0?a("span",{staticClass:"mx-5 float-right"},[e._v(" The Employee has "+e._s((-1*e.debt).toLocaleString())+" "+e._s("Daily"==e.employee.salary_type?"IQD":"$")+" ")]):a("span",{staticClass:"mx-5 float-right"},[e._v(" The Company has "+e._s(e.debt.toLocaleString())+" "+e._s("Daily"==e.employee.salary_type?"IQD":"$")+" ")]),a("span",[e._v(" "+e._s(e.givedSalaryLanguage[e.language].report)+": "+e._s(e.month+"/"+e.year)+" ")]),a("br"),a("br"),a("span",{staticStyle:{width:"20%",display:"inline-block"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].id)+": "+e._s(e.employee.emp_id)+" ")]),a("span",{staticStyle:{width:"25%",display:"inline-block"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].phone_number)+": "+e._s(e.phone)+" ")]),a("br"),a("br"),a("span",[e._v(" "+e._s(e.givedSalaryLanguage[e.language].employee_name)+": "+e._s(e.employee.full_name)+" ")]),a("br"),a("br"),a("span",[e._v(" "+e._s(e.givedSalaryLanguage[e.language].staff)+": "+e._s(e.employee.staff_name)+" ")]),a("br"),a("br"),a("span",{staticStyle:{width:"21%",display:"inline-block"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].salary_type)+": "+e._s("Monthly"==e.employee.salary_type?e.givedSalaryLanguage[e.language].monthly:e.givedSalaryLanguage[e.language].daily)+" ")]),a("span",{staticStyle:{width:"25%",display:"inline-block"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].daily_salary)+": "),a("span",[e._v(" "+e._s(e._f("money_filter")(e.employee.daily_salary))+" ")]),"Monthly"==e.employee.salary_type?a("span",[e._v(" $ ")]):a("span",[e._v(" IQD ")])]),a("span",{staticStyle:{width:"25%",display:"inline-block"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].monthly_salary)+": "),a("span",[e._v(" "+e._s(e._f("money_filter")(e.employee.monthly_salary))+" ")]),"Monthly"==e.employee.salary_type?a("span",[e._v(" $ ")]):a("span",[e._v(" IQD ")])]),a("span",{staticStyle:{width:"29%",display:"inline-block"}},[e._v(e._s(e.givedSalaryLanguage[e.language].hour_salary)+": "),a("span",[e._v(" "+e._s(e._f("money_filter")(e.employee.hour_salary))+" ")]),"Monthly"==e.employee.salary_type?a("span",[e._v(" $ ")]):a("span",[e._v(" IQD ")])]),a("hr"),a("span",{staticStyle:{width:"33%",display:"inline-block"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].total_worked_hours)+" : "),a("span",[e._v(" "+e._s(e.employee.total_worked_hour)+" ")])]),a("span",{staticStyle:{width:"33%",display:"inline-block"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].total_overtime)+" : "),a("span",[e._v(" "+e._s(e.employee.total_overtime)+" ")])]),a("span",{staticStyle:{width:"33%",display:"inline-block"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].total_not_worked_hours)+" : "),a("span",[e._v(" "+e._s(e.employee.total_h_not_work)+" ")])]),a("br"),a("br"),a("span",{staticStyle:{width:"33%",display:"inline-block"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].total_present)+" : "),a("span",[e._v(" "+e._s(e.employee.total_present)+" ")])]),a("span",{staticStyle:{width:"33%",display:"inline-block"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].total_off)+" : "),a("span",[e._v(" "+e._s(e.employee.total_off)+" ")])]),a("span",{staticStyle:{width:"33%",display:"inline-block"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].total_absent)+" : "),a("span",[e._v(" "+e._s(e.employee.total_absent)+" ")])]),a("table",{staticClass:"table table-bordered text-center text-dark mt-4"},[a("thead",[a("th",{staticClass:"p-2",staticStyle:{width:"7.8%","font-size":"11.5pt !important"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].list_id)+" ")]),a("th",{staticClass:"p-2",staticStyle:{width:"13%","font-size":"11.5pt !important"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].staff)+" ")]),a("th",{staticClass:"p-2",staticStyle:{width:"10%","font-size":"11.5pt !important"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].work_date)+" ")]),a("th",{staticClass:"p-2",staticStyle:{"font-size":"11.5pt !important"}},[e._v(" List Date ")]),a("th",{staticClass:"p-2",staticStyle:{"font-size":"11.5pt !important"}},[e._v(" User ")]),a("th",{staticClass:"p-2",staticStyle:{width:"14%","font-size":"11.5pt !important"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].location)+" ")]),a("th",{staticClass:"p-2",staticStyle:{"font-size":"11.5pt !important"}},[e._v(" Work ")]),a("th",{staticClass:"px-0",staticStyle:{width:"11%","font-size":"11.5pt !important"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].worked_hours)+" ")]),a("th",{staticClass:"px-0",staticStyle:{width:"11%","font-size":"11.5pt !important"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].overtime_hours)+" ")]),a("th",{staticClass:"p-2",staticStyle:{width:"7%","font-size":"11.5pt !important"}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].status)+" ")])]),a("tbody",e._l(e.each_days,(function(t){return a("tr",{key:t.dsl_id,class:{"bg-danger text-white":1==t.absent,"bg-warning text-white":2==t.absent}},[a("td",{staticClass:"px-1",staticStyle:{"font-size":"11.8pt"}},[e._v(" "+e._s(t.dsl_id)+" ")]),a("td",{staticClass:"px-1",staticStyle:{"font-size":"11.8pt"}},[e._v(" "+e._s(t.staff_name)+" ")]),a("td",{staticClass:"px-1",staticStyle:{"font-size":"11.8pt"}},[e._v(" "+e._s(t.work_date.slice(0,10))+" ")]),a("td",{staticClass:"px-1",staticStyle:{"font-size":"11.8pt"}},[e._v(" "+e._s(t.datetime_list?new Date(t.datetime_list).toISOString().split("T")[0]:"")+" "+e._s(t.datetime_list?new Date(t.datetime_list).toLocaleTimeString([],{timeZone:"America/Danmarkshavn",hour:"2-digit",minute:"2-digit"}):"")+" ")]),a("td",{staticClass:"px-1",staticStyle:{"font-size":"11.8pt"}},[e._v(" "+e._s(t.user)+" ")]),a("td",{staticClass:"px-1",staticStyle:{"font-size":"11.8pt"}},[e._v(" "+e._s(t.location)+" ")]),a("td",{staticClass:"px-1",staticStyle:{"font-size":"11.8pt"}},[e._v(" "+e._s(t.work)+" ")]),a("td",{staticClass:"px-1",staticStyle:{"font-size":"11.8pt"}},[e._v(" "+e._s(t.worked_hours)+" ")]),a("td",{staticClass:"px-1",staticStyle:{"font-size":"11.8pt"}},[e._v(" "+e._s(t.overtime)+" ")]),a("td",{staticClass:"px-1",staticStyle:{"font-size":"11.8pt"}},[e._v(" "+e._s(e._f("absent_filter")(t.absent,e.language))+" ")])])})),0)]),a("div",{staticClass:"alert alert-primary text-center"},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].employee_name)+" : "+e._s(e.employee.full_name)+" ")])],2)])])],1)]),a("change-pass"),a("div",{staticClass:"modal animate__animated animate__fadeInDown animate__faster",attrs:{id:"mdl_give_detail"}},[a("div",{staticClass:"modal-dialog text-dark"},[a("div",{staticClass:"modal-content"},[a("div",{staticClass:"modal-header"},[a("button",{staticClass:"btn btn-danger",attrs:{"data-dismiss":"modal"}},[e._v(" × ")]),a("h5",{staticClass:"mt-2"},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].give_salary)+" ")])]),a("div",{staticClass:"modal-body"},[e.employee.gived_salary>=e.employee.monthly_salary?a("div",{staticClass:"alert alert-primary text-center"},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].employee_gived_all_money)+" ")]):a("div",{staticClass:"container-fluid"},[a("div",{staticClass:"row mb-2"},[a("label",{staticClass:"col-sm-4 mt-2 text-center"},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].gived_date)+": ")]),a("label",{staticClass:"form-control col-sm-7 text-center"},[e._v(" "+e._s((new Date).toISOString().split("T")[0])+" ")])]),a("div",{staticClass:"row mb-2"},[a("label",{staticClass:"col-sm-4 mt-2 text-center"},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].gived_amount)+": ")]),a("input",{directives:[{name:"model",rawName:"v-model.lazy",value:e.salary,expression:"salary",modifiers:{lazy:!0}}],staticClass:"form-control col-sm-7 text-center",attrs:{type:"number"},domProps:{value:e.salary},on:{change:function(t){e.salary=t.target.value}}}),"Monthly"==e.employee.salary_type?a("label",{staticClass:"col-sm-1 mt-2"},[e._v(" $ ")]):a("label",{staticClass:"col-sm-1 mt-2"},[e._v(" IQD ")])]),a("button",{staticClass:"btn btn-primary btn-block",attrs:{id:"btn_give_salary"},on:{click:function(t){return e.give_salary()}}},[e._v(" "+e._s(e.givedSalaryLanguage[e.language].give_salary)+" "),a("i",{staticClass:"fa fa-dollar-sign fa-sm"})])])])])])])],1)},s=[],o=(a("13d5"),a("1ab6")),i=a("1157"),n=a.n(i),r={Kurdish:{month:"مـانگ",year:"سـاڵ",phone_number:"ژمارە مۆبایل",search:"گـەڕان",staffs:"ستافەکان",give_salary:"پێدانی مووچە",create_monthly_receipt:"دروستکردنی وەصـڵی مانگانە",report:"ڕاپۆرتی",id:"کۆد",employee_name:"نـاو",staff:"ستاف",salary_type:"جۆری مووچە",monthly_salary:"مووچەی مانگانە",daily_salary:"مووچەی ڕۆژانە",hour_salary:"مووچەی کاتژمێر/کاتی زیادە",total_worked_hours:"کـۆی کارکردن (کاتژمێر)",total_overtime:"کـۆی کاتی زیادە (کاتژمێر)",total_not_worked_hours:"کـۆی کارنەکردن (کاتژمێر)",total_present:"ڕۆژانی ئامادەبوو",total_off:"ڕۆژانی ئۆف (پشوو)",total_absent:"ڕۆژانـی نـەهاتوو",one_dollar_price:"نرخی 1 دۆلار",total_fine_salary:"کـۆی بـڕی سـەرپێچـی",total_not_work_salary:"کـۆی بـڕی کاتی کارنەکردن",total_absent_salary:"کـۆی بـڕی ڕۆژانی نەهاتن",total_overtime_salary:"کـۆی بـڕی کاتی زیادە",food_money:"پارەی خواردن",transport_money:"کرێی هاتووچۆ",calculated_salary_until_end_of_month:"بـڕی مـووچەی هەژمارکراو تا کۆتایی مانگ",calculated_salary_until_now:"بـڕی مـووچەی هەژمارکراو بەپێی سیستم تا ئێستا",gived_salary_until_now:"بـڕی مـووچەی وەرگیراو تا ئێستا",remain_salary_until_end_of_month:"بـڕی مـووچەی مـاوە تا کۆتایی مانگ",remain_salary_until_now:"بڕی مووچەی ماوە تا ئێستا",gived_amount:"بڕی مووچە",gived_date:"بەرواری وەرگرتن",list_id:"ژ.لـیست",work_date:"بـەرواری کارکردن",location:"شوێن",worked_hours:"کارکردن (کاتژمێر)",overtime_hours:"زیادە (کاتژمێر)",fine_reason:"هۆی سەرپێچی",fine:"بـڕی سەرپێچی",status:"دۆخ",monthly:"مانگانە",daily:"ڕۆژانە",present:"ئامادەبوو",absent:"نەهاتوو",off:"ئۆف(پشوو)",employee_gived_all_money:"ئەم کارمەندە هەموو بڕە پارەی مانگەکەی وەرگرتووە",max_give_salary:"زۆرترین بڕی پێدانی مووچە",collimate_give_salary:"بۆ ڕێککردنەوەی مووچە",daily_collimate:"تا 1000 دینار ڕێگەپێدراوە بۆ کارمەندی ڕۆژانە",monthly_collimate:"تا 1 دۆلار ڕێگەپێدراوە بۆ کارمەندی مانگانە"},English:{month:"Month",year:"Year",phone_number:"Phone Number",search:"Search",staffs:"Staffs",give_salary:"Give Salary",create_monthly_receipt:"Create monthly receipt",report:"Report of",id:"ID",employee_name:"Full name",staff:"Staff",salary_type:"Salary type",monthly_salary:"Monthly salary",daily_salary:"Daily salary",hour_salary:"Hour salary\\Overtime",total_worked_hours:"Total worked (hour)",total_overtime:"Total overtime (hour)",total_not_worked_hours:"Total not worked (hour)",total_present:"Total present",total_off:"Total off",total_absent:"Total absent",one_dollar_price:"Price of 1 dollar",total_fine_salary:"Total amount of fine",total_not_work_salary:"Total amount of not worked hours",total_absent_salary:"Total amount of absent days",total_overtime_salary:"Total amount of overtime",food_money:"Food money",transport_money:"Transport money",calculated_salary_until_end_of_month:"Calculated salary until end of month",calculated_salary_until_now:"Calculated salary until now",gived_salary_until_now:"Total gived salary until now",remain_salary_until_end_of_month:"Total remain salary until end of month",remain_salary_until_now:"Total remain salary until now",gived_amount:"Gived amount",gived_date:"Gived date",list_id:"List ID",work_date:"Work date",location:"Location",worked_hours:"Worked (hour)",overtime_hours:"Overtime (hour)",fine_reason:"Fine reason",fine:"Fine",status:"Status",monthly:"Monthly",daily:"Daily",present:"Present",absent:"Absent",off:"Off",employee_gived_all_money:"This employee has gived all monthly salary",max_give_salary:"Maximum amount of give salary",collimate_give_salary:"To collimate salary",daily_collimate:"It has enable until 1000 IQD",monthly_collimate:"It has enable until 1 Dollar"},Arabic:{month:"شهـر",year:"عـام",phone_number:"رقم موبایل",search:"بحـث",staffs:"العاملین",give_salary:"استلام الراتب",create_monthly_receipt:"عمل فاتورة شهرية",report:"تقریر",id:"رقـم",employee_name:"اسـم",staff:"ستاف",salary_type:"نوع الراتب",monthly_salary:"راتب شهري",daily_salary:"الراتب اليومي",hour_salary:"الراتب الساعة / العمل الإضافي",total_worked_hours:"إجمالي العمل (ساعات)",total_overtime:"الإجمالي وقت إضافي (ساعات) ",total_not_worked_hours:"إجمالي وقت التوقف (ساعات)",total_present:"كانت الأيام حاضرا",total_off:"أيام العطلة",total_absent:"الأيام الغیاب",one_dollar_price:"السعر 1 دولار",total_fine_salary:"مجموع الغرامة",total_not_work_salary:"إجمالي وقت التعطل",total_absent_salary:"إجمالي أيام الغياب",total_overtime_salary:"إجمالي الوقت الإضافي",food_money:"أموال الطعام",transport_money:"تكلفة النقل",calculated_salary_until_end_of_month:"مبلغ الراتب المحتسب بنهاية الشهر",calculated_salary_until_now:"مبلغ الراتب المحسوب حسب النظام حتى الآن",gived_salary_until_now:"مقدار الراتب المستلم حتى الآن",remain_salary_until_end_of_month:"يبقى مقدار الراتب حتى نهاية الشهر",remain_salary_until_now:"مبلغ الراتب لا يزال حتى الآن",gived_amount:"مبلغ الراتب",gived_date:"تاريخ استلام",list_id:"ر. قائمة",work_date:"تاريخ العمل",location:"موقع",worked_hours:"(ساعات) العمل",overtime_hours:"إضافي (ساعات)",fine_reason:"سبب الغرامة",fine:"مبلغ الغرامة",status:"حالة",monthly:"شهريا",daily:"اليومي",present:"كان حاضرا",absent:"غیاب",off:"يوم الاجازة (عطلة)",employee_gived_all_money:"حصل الموظف على جميع أموال الشهر",max_give_salary:"الحد الأقصى للراتب",collimate_give_salary:"لضبط الراتب",daily_collimate:"يسمح بحد أقصى 1000 دينار للموظفين المياومين",monthly_collimate:"يُسمح بما يصل إلى 1 دولار للموظفين شهريًا"}},_=a("cba0"),y=a("c735"),m={name:"employeeProfile",data(){return{month:(new Date).getMonth()+1,year:(new Date).getFullYear(),phone:"",gs_id:null,salary:0,employee:{emp_id:null,full_name:null,staff_name:null,salary_type:null,monthly_salary:0,daily_salary:0,hour_salary:0,total_worked_hour:0,total_not_work_s:0,total_overtime:0,total_o_s:0,total_apsen_s:0,total_absent:0,total_present:0,total_fine:0,total_off:0,total_off_s:0,total_s_by_h_work:0,total_final_s:0,gived_salary:0,personal_image:null,food_money:0,transport_money:0,cabina_money:0,expense_money:0,fine_money:0,loan_money:0,accomodation_money:0,other_expense:0,other_minus:0,total_final_s_gui:0,total_s_by_h_work_gui:0},each_days:[],each_give_salary:[],dollar_price:0,employees_btn:{full_name:null},base_26:!1,staff_id:"",staffs:[],employees:[],givedSalaryLanguage:r,language:"English",debt:0,user:{type:"",username:"",en_id:""},emp_id:null,showSpecialStaffs:"false"}},beforeCreate(){Object(o["a"])("give_salary")},created(){this.$http.post("/getLoggedInfo").then(({data:e})=>{this.user.username=e.username,this.user.type=e.type,this.user.en_id=e.en_id,this.user.en_id?this.$http.post("/staff/getByEngineer/"+this.user.en_id).then(({data:e})=>{this.staffs=e}):this.$http.post("/staff/getData").then(({data:e})=>{this.staffs=e.filter(e=>"1"==e.show_staff).sort((e,t)=>e.staff_sort_code-t.staff_sort_code)})})},mounted(){_["a"].$on("languageChanged",e=>{this.language=e,["Kurdish","Arabic"].includes(e)?(n()(".multi-language").addClass("rtl"),n()("#wrapper").attr("dir","rtl"),n()(".btn-multi-language, img").removeClass("float-right"),n()(".btn-multi-language, img").addClass("float-left")):(n()(".multi-language").removeClass("rtl"),n()("#wrapper").attr("dir","ltr"),n()(".btn-multi-language, img").addClass("float-right"),n()(".btn-multi-language, img").removeClass("float-left"))})},methods:{search(){this.employee.emp_id=null,this.employee.full_name=null,this.employee.staff_name=null,this.employee.salary_type=null,this.employee.monthly_salary=0,this.employee.daily_salary=0,this.employee.hour_salary=0,this.employee.total_worked_hour=0,this.employee.total_not_work_s=0,this.employee.total_overtime=0,this.employee.total_o_s=0,this.employee.total_apsen_s=0,this.employee.total_absent=0,this.employee.total_present=0,this.employee.total_fine=0,this.employee.total_off=0,this.employee.total_off_s=0,this.employee.total_s_by_h_work=0,this.employee.total_final_s=0,this.employee.gived_salary=0,this.employee.personal_image=null,this.employee.food_money=0,this.employee.transport_money=0,this.employee.cabina_money=0,this.employee.expense_money=0,this.employee.fine_money=0,this.employee.loan_money=0,this.employee.accomodation_money=0,this.employee.other_expense=0,this.employee.other_minus=0,this.each_days=[],this.each_give_salary=[],this.dollar_price=0,this.debt=0,this.$http.post("/employee/getEmployeeInfo/"+this.emp_id+"/"+this.month+"/"+this.year).then(({data:e})=>{if(!e.employee)return this.$alert("هیچ داتایەک نەدۆزرایەوە","","error"),this.employee.emp_id=null,this.employee.full_name=null,this.employee.staff_name=null,this.employee.salary_type=null,this.employee.monthly_salary=0,this.employee.daily_salary=0,this.employee.hour_salary=0,this.employee.total_worked_hour=0,this.employee.total_not_work_s=0,this.employee.total_overtime=0,this.employee.total_o_s=0,this.employee.total_apsen_s=0,this.employee.total_absent=0,this.employee.total_present=0,this.employee.total_fine=0,this.employee.total_off=0,this.employee.total_off_s=0,this.employee.total_s_by_h_work=0,this.employee.total_final_s=0,this.employee.gived_salary=0,this.employee.personal_image=null,this.employee.food_money=0,this.employee.transport_money=0,this.employee.cabina_money=0,this.employee.expense_money=0,this.employee.fine_money=0,this.employee.loan_money=0,this.employee.accomodation_money=0,this.employee.other_expense=0,this.employee.other_minus=0,this.each_days=[],this.each_give_salary=[],this.dollar_price=0,"";this.gs_id=e.gs_id,this.employee.emp_id=e.employee.emp_id||null,this.employee.full_name=e.employee.full_name,this.employee.staff_name=e.employee.staff_name,this.employee.salary_type=e.employee.salary_type,this.employee.personal_image=e.employee.personal_image_path,this.employee.total_worked_hour=e.employee.total_h,this.employee.total_overtime=e.employee.total_o,this.employee.total_fine=e.employee.total_fine,this.employee.total_present=e.employee.count_present,this.employee.total_absent=e.employee.total_apsent,this.employee.hour_salary=e.gived_salary.hour_salary||e.employee.hour_salary,this.employee.daily_salary=e.gived_salary.daily_salary||e.employee.daily_salary,this.employee.monthly_salary=e.gived_salary.monthly_salary||e.employee.monthly_salary,this.employee.total_off=e.employee.count_off,this.employee.total_h_not_work=e.employee.total_h_not_work,this.employee.total_o_s=e.employee.total_o_s,this.employee.total_not_work_s=e.employee.total_not_work_s,this.employee.total_apsen_s=e.employee.total_apsen_s,this.employee.total_off_s=e.employee.total_off_s,this.employee.food_money=e.employee.food_money||e.gived_salary.food_money||0,this.employee.transport_money=e.employee.transport_money||e.gived_salary.transport_money||0,this.employee.cabina_money=e.employee.cabina_money||e.gived_salary.cabina_money||0,this.employee.expense_money=e.employee.expense_money||e.gived_salary.expense_money||0,this.employee.fine_money=e.employee.fine_money||e.gived_salary.fine_money||0,this.employee.loan_money=e.employee.loan_money||e.gived_salary.loan_money||0,this.employee.accomodation_money=e.employee.accomodation_money||e.gived_salary.accomodation_money||0,this.employee.other_expense=e.employee.other_expense||e.gived_salary.other_expense||0,this.employee.other_minus=e.employee.other_minus||e.gived_salary.other_minus||0,this.employee.total_final_s=e.employee.total_final_s-e.employee.total_fine+Number(this.employee.food_money)+Number(this.employee.transport_money)+Number(this.employee.cabina_money)+Number(this.employee.expense_money)+Number(this.employee.fine_money)+Number(this.employee.loan_money)+Number(this.employee.accomodation_money)+Number(this.employee.other_expense)+Number(this.employee.other_minus),this.employee.gived_salary=e.employee.gived_salary,this.employee.total_s_by_h_work=(e.employee.total_s_by_h_work+e.employee.total_o_s+e.employee.total_off_s-e.employee.total_fine+Number(this.employee.food_money)+Number(this.employee.transport_money)+Number(this.employee.cabina_money)+Number(this.employee.expense_money)+Number(this.employee.fine_money)+Number(this.employee.loan_money)+Number(this.employee.accomodation_money)+Number(this.employee.other_expense)+Number(this.employee.other_minus)).toFixed(3),this.dollar_price=e.employee.dollar_price||this.dollar_price,this.each_days=e.each_days;var t=new Date;t.setMonth(this.month-1),t.setFullYear(this.year);const a=new Date(t.getFullYear(),t.getMonth()+1,0).getDate(),l=this.fridays(this.year,this.month-1),s=a-l;"Monthly"==this.employee.salary_type&&(this.employee.daily_salary=Number(this.employee.monthly_salary/s).toFixed(2),this.employee.hour_salary=Number(this.employee.daily_salary/8).toFixed(2)),this.each_give_salary=e.each_give_salary,this.$http.get("/employee/getEmployeeTransaction/"+this.employee.emp_id).then(({data:e})=>{this.debt=e.reduce((e,t)=>e+Number(t.transactionAmount),0)})})},fridays(e,t){var a,l,s;a=1,l=0,s=new Date(e,t,a);while(s.getMonth()===t)6===s.getDay()&&(l+=1),a+=1,s=new Date(e,t,a);return l},create_monthly_receipt(){11==this.phone.length?this.dollar_price<=0&&"Monthly"==this.employee.salary_type?this.$alert("Enter Dollar price","","warning"):this.$confirm(`دڵنیای لە دروست کردنی وەصڵی مانگی ${this.month}/${this.year}`,"","question").then(()=>{this.$http.post("/gived_salary/addGiveSalary",{emp_id:this.employee.emp_id,salary_month:this.month,salary_year:this.year,monthly_salary:this.employee.monthly_salary,daily_salary:this.employee.daily_salary,hour_salary:this.employee.hour_salary,dollar_price:this.dollar_price,food_money:this.employee.food_money,transport_money:this.employee.transport_money}).then(({data:e})=>{this.gs_id=e.gs_id,this.$alert("","Success","success"),this.$http.post("/employee/getEmployeeInfo/"+this.phone+"/"+this.month+"/"+this.year).then(({data:e})=>{this.employee.total_fine=e.employee.total_fine})}).catch(e=>{Object(y["a"])(e)})}):this.$alert("Enter valid phone number","Invalid phone number","warning")},give_salary(){this.salary>0?this.$confirm("دڵنیای لە پێدانی ئەم بڕە پارەیە بۆ کارمەند ؟","","question").then(()=>{document.getElementById("btn_give_salary").style.display="none",this.$http.post("/gived_salary/addGivedDetail",{gs_id:this.gs_id,gived_salary:this.salary}).then(()=>{this.each_give_salary.push({gived_salary:this.salary,gived_date:(new Date).toISOString().split("T")[0]}),this.employee.gived_salary+=Number(this.salary),this.salary=0,this.$alert("Salary gived","Success","success")}).catch(e=>{Object(y["a"])(e)}).finally(()=>{var e=document.getElementById("btn_give_salary");e&&(e.style.display="")})}):this.$alert("بڕی مووچە ئەبێت گەورەتربێت لە 0","","warning")},search_staff(){this.$http.post("/employee/getEmployeeBystaff/"+this.staff_id+"/"+this.month+"/"+this.year).then(([e])=>{this.employees_btn.full_name=e.full_name})},get_actived(){document.getElementById("btn-actived-employees").setAttribute("disabled","disabled"),this.employees=[],this.$http.post("/employee/getEmployeeBystaff/"+this.staff_id+"/"+this.month+"/"+this.year).then(({data:e})=>{this.employees=e}).finally(()=>document.getElementById("btn-actived-employees").removeAttribute("disabled"))},get_deactived(){document.getElementById("btn-deactived-employees").setAttribute("disabled","disabled"),this.employees=[],this.$http.post("/employee/getDeactivedEmployeeBystaff/"+this.staff_id).then(({data:e})=>{this.employees=e}).finally(()=>document.getElementById("btn-deactived-employees").removeAttribute("disabled"))}},filters:{gived_status_filter(e){return 1==e?"بـەڵێ":"نـەخـێـر"},absent_filter(e,t){return[r[t].present,r[t].absent,r[t].off][e]},money_filter(e){if("undefined"==typeof e)return 0;var t=[],a="";e=e.toString(),e.includes(".")?(a=e.substring(e.indexOf(".")),t=e.substring(0,e.indexOf(".")).split("").reverse()):t=e.split("").reverse();var l=[];for(let o=0;o<t.length;o++)l.unshift(t[o]),(o+1)%3==0&&l.unshift(",");".000"==a&&(a="");var s=l.join("")+a;return","==s.charAt(0)?s.slice(1):s},date_filter(e){var t=new Date(e);return t.setDate(t.getDate()+1),t.toISOString().split("T")[0]}},watch:{emp_id(e){e&&this.search()},month(){11==this.phone.length&&this.search()},year(){11==this.phone.length&&this.search()},staff_id(e){this.employees=[],e?this.$http.post("/employee/getEmployeeBystaff/"+this.staff_id+"/"+this.month+"/"+this.year).then(({data:e})=>{this.employees=e}):this.employees=[]}},computed:{valid_give_salary(){return"Daily"==this.employee.salary_type?this.employee.total_s_by_h_work>this.employee.total_final_s?this.salary<=Number((Number(this.employee.total_s_by_h_work)-Number(this.employee.gived_salary)).toFixed(3))+Number(1e3):this.salary<=Number((Number(this.employee.total_final_s)-Number(this.employee.gived_salary)).toFixed(3))+Number(1e3):this.employee.total_s_by_h_work>this.employee.total_final_s?this.salary<=Number((Number(this.employee.total_s_by_h_work)-Number(this.employee.gived_salary)).toFixed(3))+Number(1):this.salary<=Number((Number(this.employee.total_final_s)-Number(this.employee.gived_salary)).toFixed(3))+Number(1)},last_salary(){return"Monthly"==this.employee.salary_type?(this.employee.monthly_salary-this.employee.total_fine-this.employee.daily_salary*this.employee.total_absent-this.employee.total_not_work_s+Number(this.employee.food_money)+Number(this.employee.transport_money)+Number(this.employee.cabina_money)+Number(this.employee.expense_money)+Number(this.employee.fine_money)+Number(this.employee.loan_money)+Number(this.employee.accomodation_money)+Number(this.employee.other_expense)+Number(this.employee.other_minus)+this.employee.total_o_s).toFixed(3):(this.employee.daily_salary*this.employee.total_present-this.employee.total_fine-this.employee.total_not_work_s+Number(this.employee.food_money)+Number(this.employee.transport_money)+Number(this.employee.cabina_money)+Number(this.employee.expense_money)+Number(this.employee.fine_money)+Number(this.employee.loan_money)+Number(this.employee.accomodation_money)+Number(this.employee.other_expense)+Number(this.employee.other_minus)+this.employee.total_o_s).toFixed(3)},now_salary(){if(this.base_26&&"Monthly"==this.employee.salary_type){var e=(this.employee.daily_salary*this.employee.total_present-this.employee.total_fine-this.employee.total_not_work_s+Number(this.employee.food_money)+Number(this.employee.transport_money)+Number(this.employee.cabina_money)+Number(this.employee.expense_money)+Number(this.employee.fine_money)+Number(this.employee.loan_money)+Number(this.employee.accomodation_money)+Number(this.employee.other_expense)+Number(this.employee.other_minus)+this.employee.hour_salary*this.employee.total_overtime).toFixed(3);if(this.each_days.length>26){var t=this.each_days.length-26;e-=this.employee.daily_salary*t}return e}return this.employee.salary_type,(this.employee.daily_salary*this.employee.total_present-this.employee.total_fine-this.employee.total_not_work_s+Number(this.employee.food_money)+Number(this.employee.transport_money)+Number(this.employee.cabina_money)+Number(this.employee.expense_money)+Number(this.employee.fine_money)+Number(this.employee.loan_money)+Number(this.employee.accomodation_money)+Number(this.employee.other_expense)+Number(this.employee.other_minus)+this.employee.hour_salary*this.employee.total_overtime).toFixed(3)}}},p=m,h=(a("a37f"),a("2877")),d=a("6544"),u=a.n(d),c=a("ac7c"),g=Object(h["a"])(p,l,s,!1,null,"01f277c6",null);t["default"]=g.exports;u()(g,{VCheckbox:c["a"]})},a37f:function(e,t,a){"use strict";a("30fb")}}]);
//# sourceMappingURL=chunk-58420164.d316a5dd.js.map
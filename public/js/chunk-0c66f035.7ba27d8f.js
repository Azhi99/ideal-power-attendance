(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0c66f035"],{"1bc9":function(t,e,a){"use strict";a("e116")},5708:function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{attrs:{id:"wrapper"}},[a("navbar",{staticClass:"no-print animate__animated animate__fadeInLeft",staticStyle:{display:"none"},attrs:{id:"nav"}}),a("div",{staticClass:"d-flex flex-column animate__animated animate__fadeInRight",staticStyle:{display:"none !important"},attrs:{id:"content-wrapper"}},[a("div",{attrs:{id:"content"}},[a("header-btn",{staticClass:"no-print"}),a("div",{staticClass:"container-fluid text-dark"},[t.loading?a("div",{staticClass:"w-100 text-center mt-15 pt-15"},[a("v-progress-circular",{attrs:{indeterminate:"",color:"primary",size:"50"}})],1):"A"==t.user.role||"E"==t.user.role||"K"==t.user.role&&!t.is_print?a("table",{staticClass:"table table-bordered table-striped text-center text-dark",staticStyle:{"page-break-inside":"always","font-size":"12pt !important"}},[t._m(0),a("tbody",[t._l(t.staffs,(function(e){return[a("tr",{key:"n"+e.st_id},[a("td",{staticClass:"text-left ps-4",attrs:{colspan:"12"}},[t._v(" "+t._s(e.staff_name)+" ")])]),a("tr",{key:"d"+e.st_id},[a("td",[a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_salary_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_salary_dinar.toLocaleString())+" ")])]),a("td",[a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_overtime_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_overtime_dinar.toLocaleString())+" ")])]),a("td",[a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_food_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_food_dinar.toLocaleString())+" ")])]),a("td",[a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_transport_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_transport_dinar.toLocaleString())+" ")])]),a("td",[a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_cabina_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_cabina_dinar.toLocaleString())+" ")])]),a("td",[a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_expense_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_expense_dinar.toLocaleString())+" ")])]),a("td",[a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_fine_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_fine_dinar.toLocaleString())+" ")])]),a("td",[a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_loan_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_loan_dinar.toLocaleString())+" ")])]),a("td",[a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_accomodation_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_accomodation_dinar.toLocaleString())+" ")])]),a("td",[a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_salary_per_month_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_salary_per_month_dinar.toLocaleString())+" ")])]),a("td",[a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_other_minus_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).total_other_minus_dinar.toLocaleString())+" ")])]),a("td",[a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).sub_total_dollar_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.getTotalsByStaff(e.st_id).sub_total_dinar_dinar.toLocaleString())+" ")])])])]})),a("tr",[a("td",{staticClass:"para"},[a("span",[t._v(" "+t._s(t.totals.total_salary_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.totals.total_salary_dinar.toLocaleString())+" ")])]),a("td",{staticClass:"para"},[a("span",[t._v(" "+t._s(t.totals.total_overtime_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.totals.total_overtime_dinar.toLocaleString())+" ")])]),a("td",{staticClass:"para"},[a("span",[t._v(" "+t._s(t.totals.total_food_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.totals.total_food_dinar.toLocaleString())+" ")])]),a("td",{staticClass:"para"},[a("span",[t._v(" "+t._s(t.totals.total_transport_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.totals.total_transport_dinar.toLocaleString())+" ")])]),a("td",{staticClass:"para"},[a("span",[t._v(" "+t._s(t.totals.total_cabina_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.totals.total_cabina_dinar.toLocaleString())+" ")])]),a("td",{staticClass:"para"},[a("span",[t._v(" "+t._s(t.totals.total_expense_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.totals.total_expense_dinar.toLocaleString())+" ")])]),a("td",{staticClass:"para"},[a("span",[t._v(" "+t._s(t.totals.total_fine_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.totals.total_fine_dinar.toLocaleString())+" ")])]),a("td",{staticClass:"para"},[a("span",[t._v(" "+t._s(t.totals.total_loan_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.totals.total_loan_dinar.toLocaleString())+" ")])]),a("td",{staticClass:"para"},[a("span",[t._v(" "+t._s(t.totals.total_accomodation_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.totals.total_accomodation_dinar.toLocaleString())+" ")])]),a("td",{staticClass:"para"},[a("span",[t._v(" "+t._s(t.totals.total_salary_per_month_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.totals.total_salary_per_month_dinar.toLocaleString())+" ")])]),a("td",{staticClass:"para"},[a("span",[t._v(" "+t._s(t.totals.total_other_minus_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.totals.total_other_minus_dinar.toLocaleString())+" ")])]),a("td",{staticClass:"para"},[a("span",[t._v(" "+t._s(t.totals.sub_total_dollar_dollar.toLocaleString())+" $ ")]),a("br"),a("br"),a("span",[t._v(" "+t._s(t.totals.sub_total_dinar_dinar.toLocaleString())+" ")])])])],2)]):t._e()])],1)])],1)},i=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("thead",[a("th",[t._v(" Total Salary ")]),a("th",[t._v(" Total Overtime Hours ")]),a("th",[t._v(" Total Food ")]),a("th",[t._v(" Total Transport ")]),a("th",[t._v(" Total Cabina ")]),a("th",[t._v(" Total Expense ")]),a("th",[t._v(" Total Fine ")]),a("th",[t._v(" Total Loan ")]),a("th",[t._v(" Total Accomodation ")]),a("th",[t._v(" Total Salary per Month ")]),a("th",[t._v(" Total Other Minus ")]),a("th",[t._v(" Sub Total ")])])}],r=(a("13d5"),a("1ab6")),_={name:"total_salary_list",data(){return{list:[],zeros:[],dollar_price:0,month:Number(this.$route.params.month),year:Number(this.$route.params.year),loading:!0,staffs:[],is_print:!1,user:{}}},beforeCreate(){Object(r["a"])("total_salary_list")},created(){this.$http.post("/getLoggedInfo").then(({data:t})=>{this.user.username=t.username,this.user.role=t.type,this.user.en_id=t.en_id||null})},mounted(){this.dollar_price=Number(this.$route.params.dollar_price),this.$http.post("/staff/getData").then(({data:t})=>{this.staffs=t.filter(t=>"1"==t.show_staff).sort((t,e)=>t.staff_sort_code-e.staff_sort_code),"normals"==this.$route.params.special?this.staffs=this.staffs.filter(t=>"false"==t.special_staff):this.staffs=this.staffs.filter(t=>"true"==t.special_staff),this.$http.post("/employee/getSalaryListByMonthAndYearForTotal",{month:Number(this.$route.params.month),year:Number(this.$route.params.year),special:this.$route.params.special}).then(({data:t})=>{this.loading=!1,this.list=t.salary_list,this.zeros=t.zeros,this.overWorkDayToOvertime()})}),window.matchMedia("print").addListener(t=>{t.matches?this.is_print=!0:this.is_print=!1})},methods:{fridays(t,e){var a,o,i;a=1,o=0,i=new Date(t,e,a);while(i.getMonth()===e)5===i.getDay()&&(o+=1),a+=1,i=new Date(t,e,a);return o},getDaysAndFridays(t,e){const a=new Date(e,t,0).getDate();let o=0;for(let i=1;i<=a;i++){const a=new Date(e,t-1,i);5===a.getDay()&&o++}return{days:a,fridays:o}},overWorkDayToOvertime(){for(let a=0;a<this.list.length;a++){var t=this.list[a].count_present;const o=this.getDaysAndFridays(this.month,this.year).days,i=this.getDaysAndFridays(this.month,this.year).fridays,r=o-i;if(t>r){var e=t-r;this.list[a].total_hour+=8*e,this.list[a].count_present=r}}},getSuitableSalary(t){const e=this.getDaysAndFridays(this.month,this.year).days,a=this.getDaysAndFridays(this.month,this.year).fridays,o=e-a;return"Monthly"==t.salary_type?(t.daily_salary=Number(t.monthly_salary/o).toFixed(2),Number(Number(t.monthly_salary/o).toFixed(2))):t.daily_salary},getTotalsByStaff(t){let e={total_salary_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+this.getSuitableSalary(e)*e.count_present,0),total_salary_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+this.getSuitableSalary(e)*e.count_present,0),total_overtime_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number((e.monthly_salary/26/8*e.total_hour).toFixed(2)),0),total_overtime_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number((e.daily_salary/8*e.total_hour).toFixed(2)),0),total_food_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.food_money)+Number(e.total_food)),0),total_food_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.food_money)+Number(e.total_food)),0),total_transport_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.transport_money)+Number(e.total_transport)),0),total_transport_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.transport_money)+Number(e.total_transport)),0),total_cabina_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.cabina_money),0),total_cabina_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.cabina_money),0),total_expense_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.expense_money)+Number(e.total_expense)+Number(e.expense_by_accomodation)),0),total_expense_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.expense_money)+Number(e.total_expense)+Number(e.expense_by_accomodation)),0),total_fine_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.fine_money-e.total_fine+e.fine_by_accomodation),0),total_fine_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.fine_money-e.total_fine+e.fine_by_accomodation),0),total_loan_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.loan_money)+Number(e.total_loan)+Number(e.loan_by_accomodation)),0),total_loan_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.loan_money)+Number(e.total_loan)+Number(e.loan_by_accomodation)),0),total_accomodation_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.accomodation_money)+Number(e.total_accomodation)+Number(e.accomodation_by_accomodation)),0),total_accomodation_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.accomodation_money)+Number(e.total_accomodation)+Number(e.accomodation_by_accomodation)),0),total_salary_per_month_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.other_expense),0),total_salary_per_month_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.other_expense),0),total_other_minus_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.other_minus),0),total_other_minus_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.other_minus),0),sub_total_dollar_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number((this.getSuitableSalary(e)*e.count_present+Number(e.monthly_salary/26/8*e.total_hour)+Number(e.food_money)+Number(e.transport_money)+Number(e.total_expense)+Number(e.expense_by_accomodation)+Number(e.fine_by_accomodation)+Number(e.total_transport)+Number(e.total_food)+Number(e.total_loan)+Number(e.total_accomodation)+Number(e.loan_by_accomodation)+Number(e.accomodation_by_accomodation)+Number(e.cabina_money)+Number(e.expense_money)+Number(e.fine_money)-Number(e.total_fine)+Number(e.loan_money)+Number(e.accomodation_money)+Number(e.other_expense)+Number(e.other_minus)).toFixed(2)),0),sub_total_dollar_dinar:this.list.filter(t=>"Monthly"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Math.round(Number((this.getSuitableSalary(e)*e.count_present+Number(e.monthly_salary/26/8*e.total_hour)+Number(e.food_money)+Number(e.transport_money)+Number(e.total_expense)+Number(e.expense_by_accomodation)+Number(e.fine_by_accomodation)+Number(e.total_transport)+Number(e.total_food)+Number(e.total_loan)+Number(e.total_accomodation)+Number(e.loan_by_accomodation)+Number(e.accomodation_by_accomodation)+Number(e.cabina_money)+Number(e.expense_money)+Number(e.fine_money)-Number(e.total_fine)+Number(e.loan_money)+Number(e.accomodation_money)+Number(e.other_expense)+Number(e.other_minus))*this.dollar_price)),0),sub_total_dinar_dollar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Math.round((e.daily_salary*e.count_present+e.daily_salary/8*e.total_hour+e.food_money-e.total_fine+e.transport_money+Number(e.total_expense)+Number(e.expense_by_accomodation)+Number(e.fine_by_accomodation)+Number(e.total_transport)+Number(e.total_food)+Number(e.total_loan)+Number(e.total_accomodation)+Number(e.loan_by_accomodation)+Number(e.accomodation_by_accomodation)+e.cabina_money+e.expense_money+e.fine_money+e.loan_money+e.accomodation_money+e.other_expense+e.other_minus)/this.dollar_price),0),sub_total_dinar_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(e=>e.st_id==t).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Math.round(Math.round(e.daily_salary*e.count_present)+Math.round(e.daily_salary/8*e.total_hour)+e.food_money-e.total_fine+e.transport_money+Number(e.total_expense)+Number(e.fine_by_accomodation)+Number(e.expense_by_accomodation)+Number(e.total_transport)+Number(e.total_food)+Number(e.total_loan)+Number(e.total_accomodation)+Number(e.loan_by_accomodation)+Number(e.accomodation_by_accomodation)+e.cabina_money+e.expense_money+e.fine_money+e.loan_money+e.accomodation_money+e.other_expense+e.other_minus),0)};return e}},computed:{totals(){let t={total_salary_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+this.getSuitableSalary(e)*e.count_present,0),total_salary_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+this.getSuitableSalary(e)*e.count_present,0),total_overtime_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number((e.monthly_salary/26/8*e.total_hour).toFixed(2)),0),total_overtime_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number((e.daily_salary/8*e.total_hour).toFixed(2)),0),total_food_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.food_money)+Number(e.total_food)),0),total_food_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.food_money)+Number(e.total_food)),0),total_transport_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.transport_money)+Number(e.total_transport)),0),total_transport_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.transport_money)+Number(e.total_transport)),0),total_cabina_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.cabina_money),0),total_cabina_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.cabina_money),0),total_expense_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.expense_money)+Number(e.total_expense)+Number(e.expense_by_accomodation)),0),total_expense_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.expense_money)+Number(e.total_expense)+Number(e.expense_by_accomodation)),0),total_fine_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.fine_money-e.total_fine+e.fine_by_accomodation),0),total_fine_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.fine_money-e.total_fine+e.fine_by_accomodation),0),total_loan_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.loan_money)+Number(e.total_loan)+Number(e.loan_by_accomodation)),0),total_loan_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.loan_money)+Number(e.total_loan)+Number(e.loan_by_accomodation)),0),total_accomodation_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.accomodation_money)+Number(e.total_accomodation)+Number(e.accomodation_by_accomodation)),0),total_accomodation_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(Number(e.accomodation_money)+Number(e.total_accomodation)+Number(e.accomodation_by_accomodation)),0),total_salary_per_month_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.other_expense),0),total_salary_per_month_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.other_expense),0),total_other_minus_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.other_minus),0),total_other_minus_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number(e.other_minus),0),sub_total_dollar_dollar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Number((this.getSuitableSalary(e)*e.count_present+Number(e.monthly_salary/26/8*e.total_hour)+Number(e.food_money)+Number(e.transport_money)+Number(e.total_expense)+Number(e.expense_by_accomodation)+Number(e.fine_by_accomodation)+Number(e.total_transport)+Number(e.total_food)+Number(e.total_loan)+Number(e.total_accomodation)+Number(e.loan_by_accomodation)+Number(e.accomodation_by_accomodation)+Number(e.cabina_money)+Number(e.expense_money)+Number(e.fine_money)-Number(e.total_fine)+Number(e.loan_money)+Number(e.accomodation_money)+Number(e.other_expense)+Number(e.other_minus)).toFixed(2)),0),sub_total_dollar_dinar:this.list.filter(t=>"Monthly"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Math.round(Number((this.getSuitableSalary(e)*e.count_present+Number(e.monthly_salary/26/8*e.total_hour)+Number(e.food_money)+Number(e.transport_money)+Number(e.total_expense)+Number(e.expense_by_accomodation)+Number(e.fine_by_accomodation)+Number(e.total_transport)+Number(e.total_food)+Number(e.total_loan)+Number(e.total_accomodation)+Number(e.loan_by_accomodation)+Number(e.accomodation_by_accomodation)+Number(e.cabina_money)+Number(e.expense_money)+Number(e.fine_money)-Number(e.total_fine)+Number(e.loan_money)+Number(e.accomodation_money)+Number(e.other_expense)+Number(e.other_minus))*this.dollar_price)),0),sub_total_dinar_dollar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Math.round((e.daily_salary*e.count_present+e.daily_salary/8*e.total_hour+e.food_money-e.total_fine+e.transport_money+Number(e.total_expense)+Number(e.expense_by_accomodation)+Number(e.fine_by_accomodation)+Number(e.total_transport)+Number(e.total_food)+Number(e.total_loan)+Number(e.total_accomodation)+Number(e.loan_by_accomodation)+Number(e.accomodation_by_accomodation)+e.cabina_money+e.expense_money+e.fine_money+e.loan_money+e.accomodation_money+e.other_expense+e.other_minus)/this.dollar_price),0),sub_total_dinar_dinar:this.list.filter(t=>"Daily"==t.salary_type).filter(t=>!this.zeros.find(e=>e.emp_id==t.emp_id&&e.st_id==t.st_id)).reduce((t,e)=>t+Math.round(Math.round(e.daily_salary*e.count_present)+Math.round(e.daily_salary/8*e.total_hour)+e.food_money-e.total_fine+e.transport_money+Number(e.total_expense)+Number(e.expense_by_accomodation)+Number(e.fine_by_accomodation)+Number(e.total_transport)+Number(e.total_food)+Number(e.total_loan)+Number(e.total_accomodation)+Number(e.loan_by_accomodation)+Number(e.accomodation_by_accomodation)+e.cabina_money+e.expense_money+e.fine_money+e.loan_money+e.accomodation_money+e.other_expense+e.other_minus),0)};return t}}},s=_,l=(a("1bc9"),a("2877")),n=a("6544"),d=a.n(n),m=a("490a"),y=Object(l["a"])(s,o,i,!1,null,"5ab684fd",null);e["default"]=y.exports;d()(y,{VProgressCircular:m["a"]})},e116:function(t,e,a){}}]);
//# sourceMappingURL=chunk-0c66f035.7ba27d8f.js.map
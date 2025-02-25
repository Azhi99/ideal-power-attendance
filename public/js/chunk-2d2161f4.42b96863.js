(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2161f4"],{c0b3:function(t,e,r){"use strict";r.r(e);var o=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"wrapper"}},[r("navbar",{staticClass:"no-print animate__animated animate__fadeInLeft",staticStyle:{display:"none"},attrs:{id:"nav"}}),r("div",{staticClass:"d-flex flex-column animate__animated animate__fadeInRight",staticStyle:{display:"none !important"},attrs:{id:"content-wrapper"}},[r("div",{attrs:{id:"content"}},[r("header-btn",{staticClass:"no-print"}),r("div",{staticClass:"container-fluid text-dark"},[t._m(0),r("hr"),r("div",{staticClass:"row"},[r("button",{staticClass:"btn btn-success col-xl-2 col-lg-2 col-md-2 col-sm-12",staticStyle:{height:"39px"},attrs:{"data-toggle":"modal","data-target":"#mdl_project"},on:{click:function(e){return t.clearProject()}}},[t._v(" Add Project "),r("i",{staticClass:"fa fa-plus"})]),r("a",{staticClass:"btn btn-primary text-white col-xl-2 col-md-5 mx-2 mb-2",attrs:{href:"/work_projects_report"}},[t._v(" Report ")])])]),r("v-data-table",{staticClass:"mx-2 mt-3",attrs:{headers:t.headers,items:t.work_projects},scopedSlots:t._u([{key:"item.work_project_status",fn:function(e){var o=e.item;return["enabled"==o.work_project_status?r("v-btn",{attrs:{icon:"",color:"success"},on:{click:function(e){return t.updateStatus(o.work_project_id,"disabled")}}},[r("v-icon",[t._v(" fas fa-check ")])],1):r("v-btn",{attrs:{icon:"",color:"error"},on:{click:function(e){return t.updateStatus(o.work_project_id,"enabled")}}},[r("v-icon",[t._v(" mdi-cancel ")])],1)]}},{key:"item.actions",fn:function(e){var o=e.item;return[r("v-btn",{attrs:{icon:"",color:"primary","data-toggle":"modal","data-target":"#mdl_project"},on:{click:function(e){return t.getSingleProject(o)}}},[r("v-icon",[t._v(" mdi-pencil ")])],1),r("v-btn",{attrs:{icon:"",color:"error"},on:{click:function(e){return t.deleteProject(o)}}},[r("v-icon",[t._v(" mdi-delete ")])],1)]}}],null,!0)})],1)]),r("change-pass"),r("div",{staticClass:"modal text-dark animate__animated animate__fadeInDown animate__faster",attrs:{id:"mdl_project"}},[r("div",{staticClass:"modal-dialog modal-md"},[r("div",{staticClass:"modal-content"},[r("div",{staticClass:"modal-header"},[r("button",{staticClass:"btn btn-danger",attrs:{"data-dismiss":"modal"},on:{click:function(e){return t.clearProject()}}},[t._v("×")]),r("h5",{staticClass:"mt-2"},[t._v("Project Information")])]),r("div",{staticClass:"modal-body"},[r("div",{staticClass:"container-fluid px-0"},[r("div",{staticClass:"row pe-4"},[r("label",{staticClass:"col-2 mt-2 ps-4"},[t._v("Project: ")]),r("input",{directives:[{name:"model",rawName:"v-model",value:t.work_project.work_project_name,expression:"work_project.work_project_name"}],staticClass:"form-control col-10",attrs:{type:"text"},domProps:{value:t.work_project.work_project_name},on:{keyup:function(e){if(!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter"))return null;t.work_project.work_project_id?t.updateProject():t.addProject()},input:function(e){e.target.composing||t.$set(t.work_project,"work_project_name",e.target.value)}}})]),t.work_project.work_project_id?r("button",{staticClass:"btn btn-warning btn-block mt-3",attrs:{disabled:t.loading_add_project},on:{click:function(e){return t.updateProject()}}},[r("i",{staticClass:"fa fa-save"})]):r("button",{staticClass:"btn btn-success btn-block mt-3",attrs:{disabled:t.loading_add_project},on:{click:function(e){return t.addProject()}}},[r("i",{staticClass:"fa fa-plus"})])])])])])])],1)},a=[function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"d-sm-flex justify-content-between align-items-center mb-4"},[r("h3",{staticClass:"text-dark mb-0"},[t._v(" Projects")])])}],s=r("1ab6"),c={name:"work_projects",data(){return{work_project:{work_project_id:null,work_project_name:null,work_project_status:null},work_projects:[],loading_add_project:!1,headers:[{text:"Project",align:"start",sortable:!0,value:"work_project_name"},{text:"Status",align:"start",sortable:!0,value:"work_project_status"},{text:"Actions",align:"start",sortable:!1,value:"actions"}]}},beforeCreate(){Object(s["a"])("workProjects")},mounted(){this.$http.post("/work_projects/getData").then(t=>{this.work_projects=t.data}).catch(()=>{alert("Failed to get projects")})},methods:{clearProject(){this.work_project={work_project_id:null,work_project_name:null,work_project_status:"enabled"}},addProject(){this.work_project.work_project_name?(this.loading_add_project=!0,this.$http.post("/work_projects/addProject",this.work_project).then(t=>{this.work_projects.push({work_project_id:t.data.work_project_id,work_project_name:this.work_project.work_project_name,work_project_status:this.work_project.work_project_status}),this.clearProject()}).catch(()=>{alert("Failed to add project")}).finally(()=>{this.loading_add_project=!1})):alert("Please enter project name")},getSingleProject(t){this.work_project=JSON.parse(JSON.stringify(t))},updateProject(){this.work_project.work_project_name?(this.loading_add_project=!0,this.$http.patch("/work_projects/updateProject/"+this.work_project.work_project_id,this.work_project).then(()=>{const t=this.work_projects.findIndex(t=>t.work_project_id==this.work_project.work_project_id);this.$set(this.work_projects,t,JSON.parse(JSON.stringify(this.work_project))),alert("Project updated successfully")}).catch(()=>{alert("Failed to update project")}).finally(()=>{this.loading_add_project=!1})):alert("Please enter project name")},deleteProject(t){const e=confirm("Are you sure you want to delete this project?");e&&this.$http.delete("/work_projects/deleteProject/"+t.work_project_id).then(()=>{this.work_projects=this.work_projects.filter(e=>e.work_project_id!=t)}).catch(()=>{alert("Failed, Project may be used in other records")})},updateStatus(t,e){if("enabled"==e){const t=confirm("Are you sure you want to enable this project?");if(!t)return}else{const t=confirm("Are you sure you want to disable this project?");if(!t)return}this.$http.patch("/work_projects/updateStatus/"+t,{work_project_status:e}).then(()=>{const r=this.work_projects.findIndex(e=>e.work_project_id==t);this.$set(this.work_projects[r],"work_project_status",e)}).catch(()=>{alert("Failed to update status")})}}},n=c,i=r("2877"),l=r("6544"),d=r.n(l),_=r("8336"),p=r("8fea"),j=r("132d"),u=Object(i["a"])(n,o,a,!1,null,null,null);e["default"]=u.exports;d()(u,{VBtn:_["a"],VDataTable:p["a"],VIcon:j["a"]})}}]);
//# sourceMappingURL=chunk-2d2161f4.42b96863.js.map
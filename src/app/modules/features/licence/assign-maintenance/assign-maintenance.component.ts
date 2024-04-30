import { Component, Inject, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common.service';
import { ToastrService } from 'ngx-toastr';
import * as _moment from 'moment';

@Component({
  selector: 'app-assign-maintenance',
  templateUrl: './assign-maintenance.component.html',
  styleUrls: ['./assign-maintenance.component.scss']
})
export class AssignMaintenanceComponent implements OnInit {
    form: FormGroup;
    features: any;
    isLoading: boolean;
    submitted: boolean;
    userId:string;
    selectedProduct: any;
    roles: any;
    permissions: any = [];
    employee: any;
    languages: any;
    last_sign_in;
    loggedin_id:any;
    licence_id:any;
    licence_data:any;
    maintenances:any;

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<AssignMaintenanceComponent>,
        private _formBuilder: FormBuilder,
        private commonService: CommonService,
        private toastr: ToastrService,
        private _router: Router,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    )
    {
        if(data.id){
            this.licence_id = data.id;
        }
    }

    get f() {
        return this.form.controls;
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.userId = this.data?.userId;
        this.licence_id = this.licence_id;
        const maintenancesArr = [];
        if(this.licence_id != undefined){
            this.commonService.getLicenceById(this.licence_id).subscribe(res => {
                const licence_type = this.getLicencesType(res.data.licence.licence_type);
                this.maintenances = res.data.maintenance;
                this.licence_data = res.data.licence;
                this.licence_data.licence_type_name = licence_type;
            });
        }
        // Create the form
        this.form = this._formBuilder.group({
            // leaseplan : ['', [Validators.required]],
            licence_id : [this.licence_id, [Validators.required]],
            maintenances : [this.maintenances, [Validators.required]],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Show the copy field with the given field name
     *
     * @param name
     */

    /**
     * Save and close
     */
    saveAndClose(): void
    {
        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void
    {

    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void
    {

    }

    /**
     * Send the message
     */
    assignMaintenance(): void
    {
        this.submitted = true;
        if(this.form.valid){
            const retrivedUser = localStorage.getItem('user');
            const user = JSON.parse(retrivedUser) ?? '';
            this.loggedin_id = user.id;
            const formData = new FormData();
            formData.append("maintenances",this.form.value.maintenances);
            // formData.append("licence_id",this.form.value.licence_id);
            formData.append("licence_id",this.licence_id);
            this.isLoading = true;
            this.commonService.assignMaintenance(formData).subscribe(data => {
                this.submitted = false;
                // this._router.navigate(['/licences']);
                this.isLoading = false;
                this.toastr.success(data.message, 'Success!', {progressBar: true});
                this.matDialogRef.close();
                window.location.reload();
                // this._router.navigate(['/licences']);
                // window.location.href='https://sandbox-secure.xsolla.com/paystation3/desktop/payment/?access_token='+data.token;
              }, error => {
                this.isLoading = false;
                this._router.navigate(['/licences']);
                this.toastr.error(error.error.message, 'Error');
                this.matDialogRef.close();
            });
        }
    }

    getLicencesType(licenseType){
        let license_type = "";
        if(licenseType == 'PREM1'){
          license_type = "Atavism On-Premises Advanced";
        }else if(licenseType == 'PREM2'){
          license_type = "Atavism On-Premises Ultra";
        }else if(licenseType == 'PREM3'){
          license_type = "Atavism On-Premises Standard";
        }else if(licenseType == 'PREM4'){
          license_type = "Atavism On-Premises Professional";
        }else if(licenseType == 'PREM5'){
          license_type = "Atavism On-Premises";
        }else if(licenseType == 'PREM5'){
          license_type = "Atavism On-Premises";
        }else if(licenseType == 'TRIAL'){
          license_type = "Atavism On-Premises Trial";
        }else if(licenseType != 'TRIAL'){
          license_type = "Atavism On-Premises Standard Subscription";
        }
        return license_type;
    }
}

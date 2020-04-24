import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
    data: any[];

    constructor(private apiService: ApiService) {}

    async ngOnInit() {
        const response = await this.apiService.get('/role').toPromise();
        this.data = response;

        console.log(this.data);
    }
}

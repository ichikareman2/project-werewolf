import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api.service';
import { Role } from 'src/models';

@Component({
  selector: 'roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
    data: Role[];

    constructor(private apiService: ApiService) {}

    async ngOnInit() {
        const response = await this.apiService.get('/role').toPromise();
        this.data = response.map((r: any) => ({
          ...r,
          image: `assets/images/roles/${r.name.toLowerCase()}.png`
        }));
    }
}

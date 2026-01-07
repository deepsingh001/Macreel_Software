import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ManageMasterdataService } from '../../../../core/services/manage-masterdata.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-role',
  standalone: false,
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})

export class AddRoleComponent implements OnInit, AfterViewInit {

  roleName: string = '';

  displayedColumns: string[] = ['srNo', 'name', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private master: ManageMasterdataService) { }

  // ✅ PAGE LOAD PE API CALL
  ngOnInit(): void {
    this.loadRoles(); // ✅ NOW PERFECT
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  //get role
  loadRoles() {
    this.master.getAllRoles().subscribe({
      next: (res) => {
        const roles = res.data || [];

        this.dataSource.data = roles.map((item: any, index: number) => ({
          srNo: index + 1,
          id: item.id,
          name: item.rolename
        }));
      },
      error: err => {
        console.error(err);
        alert('Failed to load roles');
      }
    });
  }

  // Add or Update role using the same API
  onSubmit() {
    if (!this.roleName.trim()) return;

    const payload = {
      id: this.editingRoleId || 0, // 0 → Add, >0 → Update
      rolename: this.roleName
    };

    this.master.AddRole(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.editingRoleId ? 'Role updated successfully' : 'Role added successfully',
          showConfirmButton: false,
          timer: 1500
        });

        // Reset form
        this.roleName = '';
        this.editingRoleId = null;

        // Reload table
        this.loadRoles();
      },
      error: err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: this.editingRoleId ? 'Failed to update role' : 'Failed to add role'
        });
      }
    });
  }
  deleteRole(role: PeriodicElement) {
    Swal.fire({
      title: `Are you sure you want to delete ${role.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#E6354B',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.master.deleteRoleById(role.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: `${role.name} has been deleted.`,
              showConfirmButton: false,
              timer: 1500
            });

            // Remove row locally for instant UI update
            this.dataSource.data = this.dataSource.data
              .filter(r => r.id !== role.id)
              .map((r, i) => ({ ...r, srNo: i + 1 }));
          },
          error: err => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Failed to delete role'
            });
          }
        });
      }
    });
  }


  editingRoleId: number | null = null;

  editRole(role: PeriodicElement) {
    this.master.getRoleById(role.id).subscribe({
      next: (res) => {
        if (res.status && res.roleListbyid.length) {
          const roleData = res.roleListbyid[0];

          // Populate form
          this.roleName = roleData.rolename;

          // Store ID in case you want to update later
          this.editingRoleId = roleData.id;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to load role data'
          });
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to fetch role data'
        });
      }
    });
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

export interface PeriodicElement {
  srNo: number;
  id: number;

  name: string;
}
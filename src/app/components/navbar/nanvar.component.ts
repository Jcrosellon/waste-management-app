import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent {
  isDropdownOpen = false
  menuAbierto = false;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  onLogout(): void {
    try {
      this.closeDropdown()
      this.authService.logout()
      this.router.navigate(["/"])
    } catch (error) {
      console.error("Error durante el logout:", error)
      this.router.navigate(["/"])
    }
  }

  getInitials(nombre?: string): string {
  if (!nombre) return '👤';
  const parts = nombre.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const second = parts[1]?.charAt(0) ?? '';
  return (first + second).toUpperCase();
}


 toggleDropdown() {
  this.isDropdownOpen = !this.isDropdownOpen;
}

closeDropdown() {
  this.isDropdownOpen = false;
}
}

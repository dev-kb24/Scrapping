<template>
    <nav
          class="sidebar-nav"
          aria-labelledby="main-nav-heading"
        >
          <router-link
            to="/dashboard"
            class="nav-item"
            active-class="active"
          >
            <i class="fas fa-chart-pie"></i>
            <span>Dashboard</span>
          </router-link>
          <router-link
            to="/dashboard/scrapes"
            class="nav-item"
            active-class="active"
          >
            <i class="fas fa-globe"></i>
            <span>Scrapes</span>
          </router-link>
          <!-- <router-link
            to="/dashboard/preview-sites"
            class="nav-item"
            active-class="active"
          > -->
            <!-- <i class="fas fa-desktop"></i>
            <span>Preview Sites</span>
          </router-link> -->
          <router-link
            to="/entreprises"
            class="nav-item"
            active-class="active"
          >
            <i class="fas fa-store"></i>
            <span>Entreprises</span>
          </router-link>
         <!--  <router-link
            to="/dashboard/prospects"
            class="nav-item"
            active-class="active"
          >
            <i class="fas fa-building"></i>
            <span>Prospects</span>
          </router-link>
          <router-link
            to="/dashboard/clients"
            class="nav-item"
            active-class="active"
          > -->
            <!-- <i class="fas fa-users"></i>
            <span>Clients</span>
          </router-link>
          <router-link
            to="/dashboard/tasks"
            class="nav-item"
            active-class="active"
          >
            <i class="fas fa-tasks"></i>
            <span>Tasks</span> 
          </router-link>-->
        </nav>
</template>
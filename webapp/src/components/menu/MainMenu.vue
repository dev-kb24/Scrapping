<template>
  <nav
    class="sidebar-nav"
    aria-labelledby="main-nav-heading"
  >
    <router-link
      to="/"
      class="nav-item"
      active-class="active"
      exact
    >
      <i class="fas fa-chart-pie"></i>
      <span>Dashboard</span>
    </router-link>
    <router-link
      to="/scrape"
      class="nav-item"
      active-class="active"
      exact
    >
      <i class="fas fa-globe"></i>
      <span>Scrapes</span>
    </router-link>
    <router-link
      to="/email"
      class="nav-item"
      active-class="active"
      exact
    >
      <i class="fas fa-envelope"></i>
      <span>Envoi Email</span>
    </router-link>
    <router-link
      to="/entreprises"
      class="nav-item"
      active-class="active"
      exact
    >
      <i class="fas fa-store"></i>
      <span>Entreprises</span>
    </router-link>
    <router-link
      to="/site-creator"
      class="nav-item"
      active-class="active"
    >
      <i class="fas fa-code"></i>
      <span>Site creator</span>
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

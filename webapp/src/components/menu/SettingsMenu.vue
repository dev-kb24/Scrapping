<template>
    <nav
          class="sidebar-nav"
          aria-labelledby="settings-nav-heading"
        >
          <router-link
            to="/dashboard/settings"
            class="nav-item"
            active-class="active"
            exact
          >
            <i class="fas fa-cog"></i>
            <span>All Settings</span>
          </router-link>
          <router-link
            to="/dashboard/account"
            class="nav-item"
            active-class="active"
          >
            <i class="fas fa-user"></i>
            <span>Account</span>
          </router-link>
          <router-link
            to="/dashboard/team"
            class="nav-item"
            active-class="active"
          >
            <i class="fas fa-users-cog"></i>
            <span>Team</span>
          </router-link>

        </nav>
</template>
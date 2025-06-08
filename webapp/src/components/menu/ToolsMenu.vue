<template>
    <nav
          class="sidebar-nav"
          aria-labelledby="tools-nav-heading"
        >
          <router-link
            to="/dashboard/tools"
            class="nav-item"
            active-class="active"
            exact
          >
            <i class="fas fa-toolbox"></i>
            <span>All Tools</span>
          </router-link>
          <router-link
            to="/dashboard/scrape-builder"
            class="nav-item"
            active-class="active"
          >
            <i class="fas fa-tools"></i>
            <span>Scrape Builder</span>
          </router-link>
          <router-link
            to="/dashboard/site-designer"
            class="nav-item"
            active-class="active"
          >
            <i class="fas fa-edit"></i>
            <span>Site Designer</span>
          </router-link>
          <router-link
            to="/dashboard/data-explorer"
            class="nav-item"
            active-class="active"
          >
            <i class="fas fa-database"></i>
            <span>Data Explorer</span>
          </router-link>
        </nav>
</template>
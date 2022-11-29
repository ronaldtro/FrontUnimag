'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Application documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-4d9082a71dc2cb6de3a6b831a19a7b78"' : 'data-target="#xs-components-links-module-AppModule-4d9082a71dc2cb6de3a6b831a19a7b78"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-4d9082a71dc2cb6de3a6b831a19a7b78"' :
                                            'id="xs-components-links-module-AppModule-4d9082a71dc2cb6de3a6b831a19a7b78"' }>
                                            <li class="link">
                                                <a href="components/ActividadesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ActividadesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ActividadesSupervisorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ActividadesSupervisorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ActualizarDatosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ActualizarDatosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AdminComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AgendaCitasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AgendaCitasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AgendaCitasDiariasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AgendaCitasDiariasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AgendaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AgendaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AsistenteConvocatoriaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AsistenteConvocatoriaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AsociarDisciplinasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AsociarDisciplinasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AsociarItemsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AsociarItemsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AyudaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AyudaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/BeneficiosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BeneficiosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CafeteriasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CafeteriasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CambiarContrasenaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CambiarContrasenaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CitasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CitasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConfiguracionasignaturasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConfiguracionasignaturasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ControlValueAccesorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ControlValueAccesorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConvocatoriaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConvocatoriaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConvocatoriaDetalleArtistasDeportistasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConvocatoriaDetalleArtistasDeportistasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConvocatoriaDetalleComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConvocatoriaDetalleComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ConvocatoriaRefrigeriosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConvocatoriaRefrigeriosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CrearComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CrearComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CrearConvocatoriaArtistasDeportistasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CrearConvocatoriaArtistasDeportistasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CrearConvocatoriaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CrearConvocatoriaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CrearPlazaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CrearPlazaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CriteriosEvaluacionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CriteriosEvaluacionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CriteriosSeleccionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CriteriosSeleccionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CuantificacionPlazasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CuantificacionPlazasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DashboardEstudianteComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardEstudianteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetalleCitaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DetalleCitaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetalleCitaEnfermeriaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DetalleCitaEnfermeriaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetalleConvocatoriaRefrigeriosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DetalleConvocatoriaRefrigeriosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DetalleConvocatoriasRefrigeriosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DetalleConvocatoriasRefrigeriosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DiasNoLaborablesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DiasNoLaborablesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DiasNohabilitadosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DiasNohabilitadosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DisciplinaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DisciplinaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarConvocatoriasArtistasDeportistasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditarConvocatoriasArtistasDeportistasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarConvocatoriasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditarConvocatoriasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarConvocatoriasRefrigeriosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditarConvocatoriasRefrigeriosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarInscripcionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditarInscripcionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditarPlazaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EditarPlazaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EncuestaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EncuestaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EnfermeriaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EnfermeriaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EntregaExtemporaneaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EntregaExtemporaneaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EntrevistasEstudiantesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EntrevistasEstudiantesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EstudianteCondicionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EstudianteCondicionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EstudianteEvaluadoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EstudianteEvaluadoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EstudiantesEvaluadosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EstudiantesEvaluadosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EstudiantesPlazasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EstudiantesPlazasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EstudiantesSupervisorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EstudiantesSupervisorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EvaluacionEstudianteComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EvaluacionEstudianteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EvaluarEstudiantesDeportistasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EvaluarEstudiantesDeportistasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ExcusasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExcusasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FacultadesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FacultadesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterPrivateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FooterPrivateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GeneralesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GeneralesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GuardarBolsaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GuardarBolsaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GuardarProfesionalsaludComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GuardarProfesionalsaludComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/GuardarUnidadComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GuardarUnidadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistorialConvocatoriasArtistasDeportistasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistorialConvocatoriasArtistasDeportistasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistorialConvocatoriasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistorialConvocatoriasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HistorialPlazasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HistorialPlazasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HomeComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomeComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HorasActividadesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HorasActividadesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InscripcionAdministrativaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InscripcionAdministrativaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InscripcionEstudiantesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InscripcionEstudiantesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/InscripcionEstudiantesDeportistasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">InscripcionEstudiantesDeportistasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaInscripcionesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListaInscripcionesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListaPlazasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListaPlazasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListadoEntregasEstadosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListadoEntregasEstadosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListadoEstudiantesAprobadosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListadoEstudiantesAprobadosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListadoEvaluadosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListadoEvaluadosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListadoFallasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListadoFallasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListadoFallasEstudianteComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListadoFallasEstudianteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListadoInscritosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListadoInscritosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarBolsasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListarBolsasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarCondicionesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListarCondicionesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarConvocatoriasArtistasDeportistasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListarConvocatoriasArtistasDeportistasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarConvocatoriasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListarConvocatoriasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarConvocatoriasRefrigeriosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListarConvocatoriasRefrigeriosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarEstudiantesDeportistasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListarEstudiantesDeportistasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarEstudiosrealizadosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListarEstudiosrealizadosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarNivelesprofesionalesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListarNivelesprofesionalesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarPlazasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListarPlazasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarUnidadesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListarUnidadesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ListarUsuariosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ListarUsuariosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LogsEstudianteComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LogsEstudianteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LugaresComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LugaresComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MedicinageneralComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MedicinageneralComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MiCitasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MiCitasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ModalidadComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ModalidadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarPrivateComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavbarPrivateComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NoProgramadaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NoProgramadaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PerfilComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PerfilComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PerfilEstudianteComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PerfilEstudianteComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PerfilRefrigeriosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PerfilRefrigeriosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PerfilSaludComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PerfilSaludComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PeriodosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PeriodosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PeriodosRefrigeriosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PeriodosRefrigeriosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlazasAprobadasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PlazasAprobadasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PlazasInformacionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PlazasInformacionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PrincipalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PrincipalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfesionalDiasConsultoriosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfesionalDiasConsultoriosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfesionalesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfesionalesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProfileComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ProgramasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProgramasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PsicologiaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PsicologiaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PublicAprobadosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PublicAprobadosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PublicComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PublicComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PublicEvaluadoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PublicEvaluadoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RecepcionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RecepcionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroExtemporaneasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegistroExtemporaneasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RegistroIncapacidadComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegistroIncapacidadComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReporteAsignacionDiasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReporteAsignacionDiasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReporteEntregasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReporteEntregasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReporteEntregasConvocatoriasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReporteEntregasConvocatoriasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReporteEntregasEstudiantesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReporteEntregasEstudiantesComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ReportesRefrigeriosComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ReportesRefrigeriosComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SolicicitudesCancelacionComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SolicicitudesCancelacionComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SupervisorAyudantiaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SupervisorAyudantiaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TiposPlazasComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TiposPlazasComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TiposprofesionalessaludComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TiposprofesionalessaludComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsuariosCafeteriaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsuariosCafeteriaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/VerPlazaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">VerPlazaComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-4d9082a71dc2cb6de3a6b831a19a7b78"' : 'data-target="#xs-injectables-links-module-AppModule-4d9082a71dc2cb6de3a6b831a19a7b78"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-4d9082a71dc2cb6de3a6b831a19a7b78"' :
                                        'id="xs-injectables-links-module-AppModule-4d9082a71dc2cb6de3a6b831a19a7b78"' }>
                                        <li class="link">
                                            <a href="injectables/AtencionService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AtencionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/BolsaPresupuestalService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>BolsaPresupuestalService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EvaluarEstudianteService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>EvaluarEstudianteService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FacultadesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FacultadesService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PeriodoService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PeriodoService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PlazaService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PlazaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ProgramaService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProgramaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TipoPlazaService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TipoPlazaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TitleService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TitleService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-4d9082a71dc2cb6de3a6b831a19a7b78"' : 'data-target="#xs-pipes-links-module-AppModule-4d9082a71dc2cb6de3a6b831a19a7b78"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-4d9082a71dc2cb6de3a6b831a19a7b78"' :
                                            'id="xs-pipes-links-module-AppModule-4d9082a71dc2cb6de3a6b831a19a7b78"' }>
                                            <li class="link">
                                                <a href="pipes/CalcularEdadPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CalcularEdadPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/CapitalizePipePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CapitalizePipePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/DataFilterPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DataFilterPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/DiferenciaFechasPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DiferenciaFechasPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/DonseguroPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DonseguroPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/FilterPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FilterPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/IDToNamePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">IDToNamePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/KeysPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">KeysPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/LetrasPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LetrasPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/LimitToPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LimitToPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/ObtenerHoraPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ObtenerHoraPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/OrderByPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrderByPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SearchPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SelecPlazaPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SelecPlazaPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/obtenerFechaPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">obtenerFechaPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EstudiantesRefrigeriosRoutingModule.html" data-type="entity-link">EstudiantesRefrigeriosRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RefrigeriosRoutingModule.html" data-type="entity-link">RefrigeriosRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ReportesModule.html" data-type="entity-link">ReportesModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ReportesRoutingModule.html" data-type="entity-link">ReportesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ReportesRoutingModule.html" data-type="entity-link">ReportesRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ReportesRoutingModule.html" data-type="entity-link">ReportesRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link">LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent-1.html" data-type="entity-link">LoginComponent</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Antecedente.html" data-type="entity-link">Antecedente</a>
                            </li>
                            <li class="link">
                                <a href="classes/Api.html" data-type="entity-link">Api</a>
                            </li>
                            <li class="link">
                                <a href="classes/Atencion.html" data-type="entity-link">Atencion</a>
                            </li>
                            <li class="link">
                                <a href="classes/Cie10.html" data-type="entity-link">Cie10</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConvocatoriaAsistente.html" data-type="entity-link">ConvocatoriaAsistente</a>
                            </li>
                            <li class="link">
                                <a href="classes/CriteriosSeleccion.html" data-type="entity-link">CriteriosSeleccion</a>
                            </li>
                            <li class="link">
                                <a href="classes/DTConfig.html" data-type="entity-link">DTConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/enfermeria.html" data-type="entity-link">enfermeria</a>
                            </li>
                            <li class="link">
                                <a href="classes/Entrega.html" data-type="entity-link">Entrega</a>
                            </li>
                            <li class="link">
                                <a href="classes/Entrega-1.html" data-type="entity-link">Entrega</a>
                            </li>
                            <li class="link">
                                <a href="classes/Eps.html" data-type="entity-link">Eps</a>
                            </li>
                            <li class="link">
                                <a href="classes/Estudiante.html" data-type="entity-link">Estudiante</a>
                            </li>
                            <li class="link">
                                <a href="classes/examen_fisico_item.html" data-type="entity-link">examen_fisico_item</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExamenesClinico.html" data-type="entity-link">ExamenesClinico</a>
                            </li>
                            <li class="link">
                                <a href="classes/ExamenGineco.html" data-type="entity-link">ExamenGineco</a>
                            </li>
                            <li class="link">
                                <a href="classes/Falla.html" data-type="entity-link">Falla</a>
                            </li>
                            <li class="link">
                                <a href="classes/Formulario.html" data-type="entity-link">Formulario</a>
                            </li>
                            <li class="link">
                                <a href="classes/FormularioIncapacidad.html" data-type="entity-link">FormularioIncapacidad</a>
                            </li>
                            <li class="link">
                                <a href="classes/FullcalendarConfig.html" data-type="entity-link">FullcalendarConfig</a>
                            </li>
                            <li class="link">
                                <a href="classes/Medicamento.html" data-type="entity-link">Medicamento</a>
                            </li>
                            <li class="link">
                                <a href="classes/Medicamento2.html" data-type="entity-link">Medicamento2</a>
                            </li>
                            <li class="link">
                                <a href="classes/Metabolicos.html" data-type="entity-link">Metabolicos</a>
                            </li>
                            <li class="link">
                                <a href="classes/Persona.html" data-type="entity-link">Persona</a>
                            </li>
                            <li class="link">
                                <a href="classes/RespuestaServidor.html" data-type="entity-link">RespuestaServidor</a>
                            </li>
                            <li class="link">
                                <a href="classes/Sexual.html" data-type="entity-link">Sexual</a>
                            </li>
                            <li class="link">
                                <a href="classes/TablaSeleccion.html" data-type="entity-link">TablaSeleccion</a>
                            </li>
                            <li class="link">
                                <a href="classes/Tiempo.html" data-type="entity-link">Tiempo</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AtencionService.html" data-type="entity-link">AtencionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BeneficiosService.html" data-type="entity-link">BeneficiosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BolsaPresupuestalService.html" data-type="entity-link">BolsaPresupuestalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CafeteriaService.html" data-type="entity-link">CafeteriaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CitasService.html" data-type="entity-link">CitasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CondicionService.html" data-type="entity-link">CondicionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfiguracionAsignaturasService.html" data-type="entity-link">ConfiguracionAsignaturasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConsultasService.html" data-type="entity-link">ConsultasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConvocatoriaPService.html" data-type="entity-link">ConvocatoriaPService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConvocatoriaRefrigerioService.html" data-type="entity-link">ConvocatoriaRefrigerioService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConvocatoriasArtistasDeportistasService.html" data-type="entity-link">ConvocatoriasArtistasDeportistasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConvocatoriaService.html" data-type="entity-link">ConvocatoriaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DisciplinasService.html" data-type="entity-link">DisciplinasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EstudianteCondicionService.html" data-type="entity-link">EstudianteCondicionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EstudiantesService.html" data-type="entity-link">EstudiantesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EstudiosRealizadosService.html" data-type="entity-link">EstudiosRealizadosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EvaluarEstudiantesDeportistasService.html" data-type="entity-link">EvaluarEstudiantesDeportistasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EvaluarEstudianteService.html" data-type="entity-link">EvaluarEstudianteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExcusaService.html" data-type="entity-link">ExcusaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FacultadesService.html" data-type="entity-link">FacultadesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FechasAlmuerzoService.html" data-type="entity-link">FechasAlmuerzoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FechasService.html" data-type="entity-link">FechasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FuncionesJSService.html" data-type="entity-link">FuncionesJSService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InscripcionArtistasDeportistasService.html" data-type="entity-link">InscripcionArtistasDeportistasService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InscripcionRService.html" data-type="entity-link">InscripcionRService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InscritosService.html" data-type="entity-link">InscritosService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ItemService.html" data-type="entity-link">ItemService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LugaresService.html" data-type="entity-link">LugaresService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ModalidadesService.html" data-type="entity-link">ModalidadesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NivelesProfesionalesService.html" data-type="entity-link">NivelesProfesionalesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PerfilProfesionalService.html" data-type="entity-link">PerfilProfesionalService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PeriodoRefrigerioService.html" data-type="entity-link">PeriodoRefrigerioService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PeriodoService.html" data-type="entity-link">PeriodoService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PlazaService.html" data-type="entity-link">PlazaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PlazasPService.html" data-type="entity-link">PlazasPService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProfesionalSaludService.html" data-type="entity-link">ProfesionalSaludService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProgramaService.html" data-type="entity-link">ProgramaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RecepcionService.html" data-type="entity-link">RecepcionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SupervisorService.html" data-type="entity-link">SupervisorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TipoPlazaService.html" data-type="entity-link">TipoPlazaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TiposProfesionalesService.html" data-type="entity-link">TiposProfesionalesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TitleService.html" data-type="entity-link">TitleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UnidadService.html" data-type="entity-link">UnidadService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link">UserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsuarioCafeteriaService.html" data-type="entity-link">UsuarioCafeteriaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsuarioService.html" data-type="entity-link">UsuarioService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Actividad.html" data-type="entity-link">Actividad</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Actividades.html" data-type="entity-link">Actividades</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Antecedentes.html" data-type="entity-link">Antecedentes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Asignaturas.html" data-type="entity-link">Asignaturas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Asignaturas-1.html" data-type="entity-link">Asignaturas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/asignaturas.html" data-type="entity-link">asignaturas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Atencion.html" data-type="entity-link">Atencion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Beneficios.html" data-type="entity-link">Beneficios</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BolsaPresupuestal.html" data-type="entity-link">BolsaPresupuestal</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cafeteria.html" data-type="entity-link">Cafeteria</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Condicion.html" data-type="entity-link">Condicion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Condiciones.html" data-type="entity-link">Condiciones</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Convocatoria.html" data-type="entity-link">Convocatoria</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConvocatoriaInscripcionBeneficio.html" data-type="entity-link">ConvocatoriaInscripcionBeneficio</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConvocatoriaRefrigerio.html" data-type="entity-link">ConvocatoriaRefrigerio</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Disciplina.html" data-type="entity-link">Disciplina</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Entrevista.html" data-type="entity-link">Entrevista</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Estudiante.html" data-type="entity-link">Estudiante</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EstudianteEval.html" data-type="entity-link">EstudianteEval</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EstudiantePlaza.html" data-type="entity-link">EstudiantePlaza</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EstudiantePlazas.html" data-type="entity-link">EstudiantePlazas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EstudianteRefrigerios.html" data-type="entity-link">EstudianteRefrigerios</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Estudiantes.html" data-type="entity-link">Estudiantes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/estudiantesActividades.html" data-type="entity-link">estudiantesActividades</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Etapas.html" data-type="entity-link">Etapas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Evaluacion.html" data-type="entity-link">Evaluacion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Horario.html" data-type="entity-link">Horario</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InscripcionBeneficio.html" data-type="entity-link">InscripcionBeneficio</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/InscripcionRefrigerio.html" data-type="entity-link">InscripcionRefrigerio</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/lugar.html" data-type="entity-link">lugar</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Modalidad.html" data-type="entity-link">Modalidad</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NivelProfesional.html" data-type="entity-link">NivelProfesional</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Objeto.html" data-type="entity-link">Objeto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Observacion.html" data-type="entity-link">Observacion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Periodo.html" data-type="entity-link">Periodo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PlazaCrear.html" data-type="entity-link">PlazaCrear</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Plazas.html" data-type="entity-link">Plazas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Profesional.html" data-type="entity-link">Profesional</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/programas.html" data-type="entity-link">programas</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/requisitoInscripcion.html" data-type="entity-link">requisitoInscripcion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/requisitosEvaluacion.html" data-type="entity-link">requisitosEvaluacion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/requisitosInscripcion.html" data-type="entity-link">requisitosInscripcion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/tipoAyudantia.html" data-type="entity-link">tipoAyudantia</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/tipoPlaza.html" data-type="entity-link">tipoPlaza</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Usuarios.html" data-type="entity-link">Usuarios</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
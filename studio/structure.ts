import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Gestor de Contenido Web')
    .items([
      // 1. PÁGINA DE INICIO
      S.listItem()
        .title('🏠 Página de Inicio')
        .child(
          S.list()
            .title('Fotografías: Página de Inicio')
            .items([
              S.listItem()
                .title('📸 Retrato "Sobre Mí" (Máx. 1 foto)')
                .child(
                  S.documentList()
                    .title('Inicio - Retrato Sobre Mí (1 foto)')
                    .filter('_type == "siteImage" && placement == "home-about"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-home-about')
                    ])
                ),
              S.listItem()
                .title('🖼️ Galería Portafolio Principal (4 fotos)')
                .child(
                  S.documentList()
                    .title('Inicio - Galería Portafolio (4 fotos recomendadas)')
                    .filter('_type == "siteImage" && placement == "home-portfolio"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-home-portfolio')
                    ])
                ),
            ])
        ),

      // 2. PÁGINA SOBRE MÍ
      S.listItem()
        .title('👤 Página "Sobre Mí"')
        .child(
          S.list()
            .title('Fotografías: Página Sobre Mí')
            .items([
              S.listItem()
                .title('📸 Retrato Principal de Autor (1 foto)')
                .child(
                  S.documentList()
                    .title('Sobre Mí - Retrato de Cristian (1 foto)')
                    .filter('_type == "siteImage" && placement == "about-main"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-about-main')
                    ])
                ),
              S.listItem()
                .title('🎞️ Galería de Detalles / Estilo de Vida (2 fotos)')
                .child(
                  S.documentList()
                    .title('Sobre Mí - Detalles y Equipo (2 fotos)')
                    .filter('_type == "siteImage" && placement == "about-details"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-about-details')
                    ])
                ),
            ])
        ),

      // 3. PÁGINA DE TARIFAS Y SERVICIOS
      S.listItem()
        .title('🏷️ Página de Tarifas y Servicios')
        .child(
          S.list()
            .title('Fotografías: Portadas de Servicios')
            .items([
              S.listItem()
                .title('💍 Portada Servicio: Bodas (1 foto)')
                .child(
                  S.documentList()
                    .title('Tarifas - Bodas (1 foto de portada)')
                    .filter('_type == "siteImage" && placement == "pricing-wedding"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-pricing-wedding')
                    ])
                ),
              S.listItem()
                .title('🎭 Portada Servicio: Retrato / Moda (1 foto)')
                .child(
                  S.documentList()
                    .title('Tarifas - Retrato / Moda (1 foto de portada)')
                    .filter('_type == "siteImage" && placement == "pricing-portrait"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-pricing-portrait')
                    ])
                ),
              S.listItem()
                .title('🎂 Portada Servicio: Cumpleaños / 15 Años / Bautizos (1 foto)')
                .child(
                  S.documentList()
                    .title('Tarifas - Eventos Sociales (1 foto de portada)')
                    .filter('_type == "siteImage" && placement == "pricing-events"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-pricing-events')
                    ])
                ),
            ])
        ),

      S.divider(),

      // 4. LISTADO GLOBAL COMPLETO
      S.listItem()
        .title('📁 Todas las Fotografías (Listado Global)')
        .child(
          S.documentList()
            .title('Todas las Fotos de la Web')
            .filter('_type == "siteImage"')
        ),
    ])

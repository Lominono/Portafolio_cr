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
                .title('📸 Retrato "Sobre Mí" (1 foto)')
                .child(
                  S.documentList()
                    .title('Inicio - Retrato Sobre Mí (1 foto)')
                    .filter('_type == "siteImage" && placement == "home-about"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-home-about')
                    ])
                ),
              S.listItem()
                .title('🖼️ Galería Portafolio Principal')
                .child(
                  S.documentList()
                    .title('Inicio - Galería Portafolio (Múltiples fotos)')
                    .filter('_type == "siteImage" && placement == "home-portfolio"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-home-portfolio')
                    ])
                ),
              S.listItem()
                .title('🌟 Especialidades / Servicios Destacados')
                .child(
                  S.list()
                    .title('Especialidades de Inicio')
                    .items([
                      S.listItem()
                        .title('💍 Bodas & Enlaces')
                        .child(
                          S.documentList()
                            .title('Inicio - Especialidad Bodas')
                            .filter('_type == "siteImage" && placement == "home-service-wedding"')
                            .initialValueTemplates([S.initialValueTemplateItem('siteImage-home-service-wedding')])
                        ),
                      S.listItem()
                        .title('🎭 Retrato & Moda')
                        .child(
                          S.documentList()
                            .title('Inicio - Especialidad Retrato')
                            .filter('_type == "siteImage" && placement == "home-service-portrait"')
                            .initialValueTemplates([S.initialValueTemplateItem('siteImage-home-service-portrait')])
                        ),
                      S.listItem()
                        .title('🎉 Eventos & Celebraciones')
                        .child(
                          S.documentList()
                            .title('Inicio - Especialidad Eventos')
                            .filter('_type == "siteImage" && placement == "home-service-events"')
                            .initialValueTemplates([S.initialValueTemplateItem('siteImage-home-service-events')])
                        ),
                      S.listItem()
                        .title('⚽ Deportes')
                        .child(
                          S.documentList()
                            .title('Inicio - Especialidad Deportes')
                            .filter('_type == "siteImage" && placement == "home-service-sports"')
                            .initialValueTemplates([S.initialValueTemplateItem('siteImage-home-service-sports')])
                        ),
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
            .title('Fotografías: Servicios y Tarifas')
            .items([
              S.listItem()
                .title('💍 Bodas (General / Boda Básica)')
                .child(
                  S.documentList()
                    .title('Tarifas - Bodas (General / Básica)')
                    .filter('_type == "siteImage" && placement == "pricing-wedding"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-pricing-wedding')
                    ])
                ),
              S.listItem()
                .title('💍 Boda Completa (Collage 3 fotos)')
                .child(
                  S.documentList()
                    .title('Tarifas - Boda Completa')
                    .filter('_type == "siteImage" && placement == "pricing-wedding-full"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-pricing-wedding-full')
                    ])
                ),
              S.listItem()
                .title('🎭 Retrato / Moda / Sesión Individual')
                .child(
                  S.documentList()
                    .title('Tarifas - Retrato y Moda')
                    .filter('_type == "siteImage" && placement == "pricing-portrait"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-pricing-portrait')
                    ])
                ),
              S.listItem()
                .title('🎂 Cumpleaños y Fiestas Infantiles')
                .child(
                  S.documentList()
                    .title('Tarifas - Cumpleaños')
                    .filter('_type == "siteImage" && placement == "pricing-birthday"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-pricing-birthday')
                    ])
                ),
              S.listItem()
                .title('👑 Fiestas de 15 Años / Quinceañeras')
                .child(
                  S.documentList()
                    .title('Tarifas - 15 Años')
                    .filter('_type == "siteImage" && placement == "pricing-quince"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-pricing-quince')
                    ])
                ),
              S.listItem()
                .title('🕊️ Bautizos y Comuniones')
                .child(
                  S.documentList()
                    .title('Tarifas - Bautizos y Comuniones')
                    .filter('_type == "siteImage" && placement == "pricing-baptism"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-pricing-baptism')
                    ])
                ),
              S.listItem()
                .title('⚽ Eventos Deportivos')
                .child(
                  S.documentList()
                    .title('Tarifas - Deportes')
                    .filter('_type == "siteImage" && placement == "pricing-sports"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-pricing-sports')
                    ])
                ),
              S.listItem()
                .title('🤍 Sesiones Especiales (Pareja / Familia)')
                .child(
                  S.documentList()
                    .title('Tarifas - Sesiones Especiales')
                    .filter('_type == "siteImage" && placement == "pricing-special"')
                    .initialValueTemplates([
                      S.initialValueTemplateItem('siteImage-pricing-special')
                    ])
                ),
              S.listItem()
                .title('🏷️ Eventos Generales (Comodín)')
                .child(
                  S.documentList()
                    .title('Tarifas - Eventos Generales')
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

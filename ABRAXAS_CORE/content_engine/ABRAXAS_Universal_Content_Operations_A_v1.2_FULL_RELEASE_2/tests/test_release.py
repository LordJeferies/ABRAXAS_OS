from pathlib import Path
import re, json, unittest
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'ABRAXAS_Universal_Content_Operations_A_v1.1.2.html'
SRC=ROOT/'src/app.js'
CORE=ROOT/'src/core.js'
DATA=ROOT/'src/data.js'
CSS=ROOT/'src/styles.css'

class Release094(unittest.TestCase):
    def read(self,p): return p.read_text(encoding='utf-8')
    def test_release_exists_and_version(self):
        self.assertTrue(OUT.exists())
        s=self.read(OUT)
        self.assertIn('ABRAXAS A v1.1.2',s)
        self.assertIn("const VERSION='1.1.2'",s)
    def test_dynamic_client_accent_tokens(self):
        s=self.read(CSS)
        for token in ['--client-accent','--client-accent-strong','--client-accent-soft','--client-accent-glow','--client-accent-surface','--client-accent-border','--client-accent-text']:
            self.assertIn(token,s)
        c=self.read(CORE)
        self.assertIn('clientThemeTokens',c)
        self.assertIn('Moka Bio',self.read(DATA))
    def test_apple_spatial_layers_and_reduced_motion(self):
        s=self.read(CSS)
        for token in ['.layer-environment','.layer-content','.layer-function','.layer-focus','prefers-reduced-motion','backdrop-filter','transform-origin']:
            self.assertIn(token,s)
        self.assertIn('materialize',s)
    def test_no_glass_on_content_cards_rule(self):
        s=self.read(CSS)
        self.assertIn('.glass-layer',s)
        # content surfaces must have solid token, not backdrop-filter directly
        card_rule=re.search(r'\.content-surface\{([^}]*)\}',s,re.S)
        self.assertIsNotNone(card_rule)
        self.assertNotIn('backdrop-filter',card_rule.group(1))
    def test_client_intelligence_tabs(self):
        s=self.read(SRC)
        for label in ['Overview','Brand Core','Pilares','Formatos','Patrones','Copy Profiles','Branding Method','Sources']:
            self.assertIn(label,s)
        self.assertIn('openClientIntelligence',s)
        self.assertIn('openClientDetailSheet',s)
    def test_content_overview_shows_physical_type(self):
        s=self.read(SRC)
        self.assertIn('physicalTypeLabel',s)
        self.assertIn('PHYSICAL TYPE',s)
        self.assertIn('Content Studio 1×1',s)
    def test_prompt_composer_has_extended_inputs(self):
        s=self.read(SRC)
        self.assertIn('data-prompt-field="${key}"',s)
        for field in ['audience','problem','desiredChange','evidence','claims','cta','primaryPlatform','recipeClient','recipeUniversal']:
            self.assertIn(f"promptField(c,'{field}'",s)
        self.assertIn('data-prompt-field="structure"',s)
    def test_calendar_has_detailed_legend_and_dragdrop(self):
        s=self.read(SRC)
        self.assertIn('openCalendarLegend',s)
        for label in ['Cliente','Tipo físico','Estado productivo','Lote']:
            self.assertIn(label,s)
        self.assertIn('draggable="true"',s)
        self.assertIn('calendarBacklog',s)
    def test_factory_physical_output_is_sovereign_and_patterns_adapt(self):
        s=self.read(CORE)
        self.assertIn('translatePatternToPhysical',s)
        self.assertIn("'NATIVO'",s)
        self.assertIn("'ADAPTADO'",s)
        self.assertNotIn('NO COMPATIBLE',s)
        a=self.read(SRC)
        self.assertIn('Crear pieza',a)
        self.assertIn('Crear lote',a)
        self.assertIn('Pilares del cliente',a)
        self.assertIn('Patrones del cliente',a)
        self.assertIn('Patrones universales',a)
    def test_factory_quantity_1_to_6_and_coverage_map(self):
        s=self.read(SRC)
        self.assertIn('[1,2,3,4,5,6]',s)
        self.assertIn('Coverage Map',s)
        self.assertIn('setFactoryQuantity',s)
    def test_batch_independent_lot_cadences_are_visible(self):
        s=self.read(SRC)
        for label in ['Cadencia Lote 1','Cadencia Lote 2','Cadencia Lote 3','Baja','Media','Alta']:
            self.assertIn(label,s)
        self.assertIn('data-lot-cadence="${key}"',s)
        self.assertIn("renderLotCadence('lot1'",s)
        self.assertIn("renderLotCadence('lot2'",s)
        self.assertIn("renderLotCadence('lot3'",s)

    def test_batch_rules_exist(self):
        s=self.read(CORE)
        for token in ['buildBatchPlan','reelPrincipal','carouselPrincipal','useExisting','cadence']:
            self.assertIn(token,s)
        a=self.read(SRC)
        for label in ['1 semana','2 semanas','1 mes','Usar contenido existente']:
            self.assertIn(label,a)
    def test_content_studio_exposes_deep_unit_prompts(self):
        s=self.read(SRC); core=self.read(CORE)
        for token in ['compileUnitOmniPrompt','compileUnitReferenceImagesPrompt','compileUnitBrollPrompt','compileUnitStillPrompt','compileUnitSfxPrompt','compileCarouselSlidePrompt']:
            self.assertIn(token,core)
            self.assertIn(token,s)
        for label in ['Omni / VFX · source video','Referencias visuales · START / MIDDLE / END','B-roll · video independiente','SFX · generación / búsqueda','Imagen del slide · CON texto','Imagen del slide · SIN texto']:
            self.assertIn(label,s)

    def test_production_queue_calm_first(self):
        s=self.read(SRC)
        self.assertIn('¿Qué quieres resolver primero?',s)
        for x in ['Copies','Visuales','Video / B-roll','Portadas','QA','Publicación','Ver todo']:
            self.assertIn(x,s)
        self.assertIn('continueProduction',s)
    def test_guide_has_real_routes(self):
        s=self.read(SRC)
        for x in ['Dónde entrar','Qué seleccionar','Qué ocurre','Qué copiar','Dónde ejecutar','Qué vuelve','Dónde cargar','Cómo saber que terminó','Ir al paso']:
            self.assertIn(x,s)
    def test_roadmap_is_tree_not_growth_capsules(self):
        s=self.read(SRC)
        self.assertIn('roadmap-tree',s)
        self.assertIn('<svg',s)
        self.assertIn('selectRoadmapNode',s)
        self.assertNotIn('roadmap-growth',s)
    def test_branding_25_tools(self):
        s=self.read(DATA)
        self.assertEqual(s.count('toolId:'),25)
        self.assertIn('brandCore',s)
    def test_visual_gate_markers(self):
        s=self.read(SRC)+self.read(CSS)
        for x in ['WHERE AM I','WHAT CAN I DO','WHERE NEXT','NO GLASS ON GLASS','NO TEXT OVERFLOW','NO BUTTON COLLISIONS']:
            self.assertIn(x,s)

    def test_architect_local_contextual_assistant(self):
        s=self.read(SRC)
        for token in ['El Arquitecto','renderArchitectLauncher','renderArchitectPanel','architectContext','architectAnswer','architectSearch','Preparar pregunta para IA','architect-app-icon']:
            self.assertIn(token,s)
        for q in ['¿Qué hago primero?','Explícame esta pantalla','¿Qué tengo que pegar aquí?','¿Qué opciones debo elegir?','¿Qué voy a obtener?','¿Dónde llevo el resultado?','¿Cómo sé que terminé?']:
            self.assertIn(q,s)
        self.assertNotIn('sk-proj-',s)
        self.assertNotIn('OPENAI_API_KEY',s)

    def test_shim_is_five_step_wizard(self):
        s=self.read(SRC)
        for token in ['Shim Wizard 2.0','01 · Fuente','02 · Qué quieres obtener','03 · Estructuras','04 · Revisar','05 · Exportar','renderShimStep','shimNext','compileShimPackage']:
            self.assertIn(token,s)
        for label in ['Nombre de la grabación','Contexto opcional','Transcripción con timestamps','VERTICALES','HORIZONTALES','CARRUSELES','Estructura fija','distribución inteligente','Copiar prompt','Descargar TXT','Descargar JSON']:
            self.assertIn(label,s)

    def test_command_palette_tools_menu_and_collapsible_sidebar(self):
        s=self.read(SRC)+self.read(CSS)
        for token in ['Command Palette','⌘K','Herramientas','renderCommandPalette','toggleToolsMenu','sidebarCollapsed','command-palette']:
            self.assertIn(token,s)

    def test_apple_fidelity_architect_edition_markers(self):
        s=self.read(CSS)+self.read(SRC)
        for token in ['ABRAXAS Interface System 2.0','Architect Edition','--glass-regular','--glass-edge','--radius-app-icon','app-icon-superellipse','source-anchored','NO GLASS ON GLASS','prefers-reduced-motion']:
            self.assertIn(token,s)

    def test_brand_intelligence_storytelling_chapters(self):
        s=self.read(SRC)
        for chapter in ['THE CORE','WHO IT IS FOR','WHAT IT BELIEVES','WHAT IT PROMISES','WHAT IT MUST NEVER BECOME','HOW IT LOOKS','HOW IT SOUNDS','HOW TO EXPLAIN IT TO THE CLIENT','HOW TO SELL IT']:
            self.assertIn(chapter,s)
        self.assertIn('Branding Method · 25 tools',s)

    def test_icon_assets_exist_and_build_embeds_them(self):
        self.assertTrue((ROOT/'assets/branding/abraxas_app_icon_v100.png').exists())
        self.assertTrue((ROOT/'assets/branding/el_arquitecto_app_icon_v100.png').exists())
        b=self.read(ROOT/'scripts/build.py')
        self.assertIn('abraxas_app_icon_v100.png',b)
        self.assertIn('el_arquitecto_app_icon_v100.png',b)
        if OUT.exists():
            h=self.read(OUT)
            self.assertIn('data:image/png;base64,',h)
            self.assertIn('ABRAXAS_ASSETS',h)

    def test_visual_composer_is_deferred(self):
        s=self.read(ROOT/'docs/superpowers/specs/2026-08-07-abraxas-v0.9.4-architect-edition-design.md')
        self.assertIn('Visual Composer',s)
        self.assertIn('post-v1.0',s)

    def test_offline_no_external_runtime_dependencies(self):
        s=self.read(OUT) if OUT.exists() else ''
        self.assertNotRegex(s,r'<script[^>]+src=["\']https?://')
        self.assertNotRegex(s,r'<link[^>]+href=["\']https?://')

    def test_architect_edition_uses_consistent_internal_svg_iconography(self):
        s=self.read(SRC)
        self.assertIn('function iconSvg',s)
        self.assertIn('stroke-linecap="round"',s)
        self.assertIn('stroke="currentColor"',s)
        self.assertIn('iconSvg(id)',s)

    def test_screen_context_is_quiet_and_context_help_moves_to_architect(self):
        s=self.read(SRC)
        start=s.index('function screenContext')
        frag=s[start:start+700]
        self.assertNotIn('WHERE AM I',frag)
        self.assertNotIn('WHAT CAN I DO',frag)
        self.assertNotIn('WHERE NEXT',frag)
        self.assertIn('context-next',frag)

    def test_dashboard_hero_is_product_story_not_orbit_badges(self):
        s=self.read(SRC)+self.read(CSS)
        self.assertIn('hero-icon-stage',s)
        self.assertNotIn('product-hero-orbit>span',s)
        self.assertIn('product-status-line',s)


class TestV095NativeWorkspace(Release094):
    def test_version_and_story_mode_contract(self):
        s=self.read(SRC)
        self.assertIn("const VERSION='1.1.2'",s)
        for token in ['isProductStorySection','storyMode','renderStoryLocalNav','Visual','Solo texto']:
            self.assertIn(token,s)

    def test_dashboard_product_story_anatomy(self):
        s=self.read(SRC)+self.read(CSS)
        for token in ['Get the highlights','story-highlight-rail','story-hero','story-scene','data-story-target="attention"']:
            self.assertIn(token,s)
        self.assertNotIn('metric-strip',s[s.find('function renderDashboard'):s.find('function renderFocusLayer')])

    def test_clients_branding_roadmap_are_story_surfaces(self):
        s=self.read(SRC)
        for token in ['Four brands. One operating system.','THE CORE','story-highlight-rail','story-roadmap-rail']:
            self.assertIn(token,s)

    def test_story_mode_has_minimal_internal_navigation(self):
        s=self.read(SRC)+self.read(CSS)
        for token in ['story-local-nav','story-nav-links','scrollToStorySection','story-view-toggle']:
            self.assertIn(token,s)

    def test_architect_is_right_floating_utility_window(self):
        s=self.read(SRC)+self.read(CSS)
        self.assertIn('architect-utility-window',s)
        self.assertIn('position:fixed',s.replace(' ',''))
        self.assertIn('right:',s)
        self.assertIn('top:',s)

    def test_story_visual_mode_uses_large_scenes_not_card_grid(self):
        css=self.read(CSS)
        for token in ['.story-hero','.story-scene','.story-highlight-rail','scroll-snap-type:x mandatory','--story-scene-min:72vh']:
            self.assertIn(token,css)



class TestV095ReplacementR2(Release094):
    def test_global_menu_launcher_exists_everywhere(self):
        s=self.read(SRC)+self.read(CSS)
        for token in ['renderGlobalMenuLauncher','renderGlobalMenuPanel','toggleGlobalMenu','global-menu-launcher','global-menu-panel']:
            self.assertIn(token,s)
        self.assertIn('${renderGlobalMenuLauncher()}',s)

    def test_architect_updates_panel_without_rerendering_shell(self):
        s=self.read(SRC)
        start=s.rfind('function setArchitectIntent')
        frag=s[start:start+900]
        self.assertIn('refreshArchitectPanel',frag)
        self.assertNotIn('renderShell()',frag)
        self.assertIn('architect-answer-body',s)
        self.assertIn('architectSubmitQuery',s)

    def test_dashboard_is_goal_router_and_has_abraxas_field_animation(self):
        s=self.read(SRC)+self.read(CSS)
        for token in ['¿Qué quieres hacer ahora?','Crear un contenido','Planificar una semana o un mes','Convertir una grabación','Continuar una producción','Revisar y publicar','Entender una marca','home-abraxas-field','initHomeAbraxasField','drawAbraxasChevron']:
            self.assertIn(token,s)

    def test_story_typography_is_reduced_and_interactive(self):
        css=self.read(CSS); src=self.read(SRC)
        self.assertIn('--story-hero-max:68px',css)
        self.assertIn('--story-scene-max:54px',css)
        self.assertNotIn('118px',css[css.rfind('v0.9.5 Replacement R2'):])
        for token in ['story-slide-controls','story-disclosure','renderStorySectionMenu','story-section-menu']:
            self.assertIn(token,src+css)

    def test_branding_method_has_generic_and_applied_entry_modes(self):
        s=self.read(SRC)
        for token in ['Conocer el Branding Method','Ver aplicado a un cliente','brandingView','renderBrandingMethodExplainer','renderAppliedBranding','appliedBrandToolAnswer']:
            self.assertIn(token,s)
        self.assertNotIn('Respuesta aplicada:</b> ${esc(t.answer)}',s[s.rfind('v0.9.5 Replacement R2'):])

    def test_applied_branding_uses_client_context(self):
        s=self.read(SRC)
        start=s.rfind('function appliedBrandToolAnswer')
        frag=s[start:start+7000]
        for token in ['brandCore.core','brandCore.identity','brandCore.salesNarrative','proofPoints','boundaries','pillars','patterns','copyProfiles','visualRules']:
            self.assertIn(token,frag)

    def test_story_slides_have_controls_and_disclosure(self):
        s=self.read(SRC)
        for token in ['renderStoryRailControls','moveStoryRail','story-detail-button','Más contexto','Menos contexto']:
            self.assertIn(token,s)

    def test_visual_reference_audit_is_packaged(self):
        self.assertTrue((ROOT/'reports/VISUAL_REFERENCE_AUDIT.md').exists())
        txt=self.read(ROOT/'reports/VISUAL_REFERENCE_AUDIT.md')
        for token in ['Apple','CleanMyMac','Dala','Refero','Ainsley']:
            self.assertIn(token,txt)


class TestV096NativeBrainRewrite(Release094):
    def test_version_096_and_home_label(self):
        s=self.read(SRC)
        self.assertIn("const VERSION='1.1.2'",s)
        self.assertIn("['dashboard','⌁','Home'",s)

    def test_home_has_procedural_brain_and_scroll_morph(self):
        s=self.read(SRC)+self.read(CSS)
        for token in ['homeBrainField','initHomeBrainFieldV096','BRAINVAL_SHAPES_V096','brainMorphTargetV096','drawBrainParticleV096','home-brain-field','home-brain-hotspot']:
            self.assertIn(token,s)
        for shape in ['brain','routes','queue','calendar','network']:
            self.assertIn(shape,s)

    def test_home_brain_has_clickable_tool_nodes(self):
        s=self.read(SRC)
        self.assertIn('data-brain-target',s)
        for target in ['factory','shim','production','calendar','assets','branding']:
            self.assertIn(f"['{target}'",s)

    def test_global_navigation_button_is_persistent_top_right_and_closes_on_route(self):
        s=self.read(SRC)+self.read(CSS)
        self.assertIn('global-menu-launcher',s)
        self.assertIn('right:16px',s.replace(' ',''))
        start=s.rfind('function go(section)')
        frag=s[start:start+500]
        for token in ['toolsMenu=false','globalMenuOpen=false','moreMenu=false']:
            self.assertIn(token,frag)

    def test_architect_is_forced_right_and_context_tracks_story_section(self):
        s=self.read(SRC)+self.read(CSS)
        for token in ['storyActiveSection','architectContextV096','refreshArchitectPanel','right:18px','left:auto']:
            self.assertIn(token,s.replace(' ','' ) if token in ['right:18px','left:auto'] else s)

    def test_story_type_scale_is_smaller_and_interactive(self):
        css=self.read(CSS); src=self.read(SRC)
        for token in ['--story-hero-max:56px','--story-scene-max:44px','--story-highlight-max:36px','story-feature-grid','story-media-panel','story-mini-tabs']:
            self.assertIn(token,css+src)

    def test_home_is_goal_router_not_status_only(self):
        s=self.read(SRC)
        for token in ['Crear contenido','Planificar contenido','Transformar una grabación','Resolver producción','Organizar assets','Entender una marca']:
            self.assertIn(token,s)
        self.assertIn('Get the highlights',s)

    def test_cleanmymac_workspace_classes_exist(self):
        css=self.read(CSS)
        for token in ['workspace-stage','workspace-primary-action','workspace-module-orb','workspace-flow-step']:
            self.assertIn(token,css)

    def test_motion_and_layout_json_exists(self):
        p=ROOT/'json/ABRAXAS_VISUAL_MOTION_SYSTEM_v1.0.json'
        self.assertTrue(p.exists())
        data=json.loads(p.read_text(encoding='utf-8'))
        self.assertEqual(data['version'],'1.0')
        self.assertIn('home_brain_morph',data['motion'])
        self.assertIn('highlight_rail',data['layout_patterns'])


class TestV100BrainNavigatorHandoff(Release094):
    def test_version_100_and_brain_zoom_contract(self):
        s=self.read(SRC)
        self.assertIn("const VERSION='1.1.2'",s)
        for token in ['brainZoom:1','setBrainZoomV100','BRAIN_ZOOM_MIN_V100=1','BRAIN_ZOOM_MAX_V100=2','brain-zoom-controls','100%','200%']:
            self.assertIn(token,s)

    def test_brain_hotspots_have_leader_lines_icons_and_popovers(self):
        s=self.read(SRC)+self.read(CSS)
        for token in ['homeBrainHotspotsV100','brain-hotspot-line','brain-hotspot-icon','brain-tool-popover','Qué hace','Abrir herramienta']:
            self.assertIn(token,s)
        for target in ['factory','shim','production','calendar','assets','branding']:
            self.assertIn(target,s)

    def test_brain_primary_shape_and_scale_transform(self):
        s=self.read(SRC)
        for token in ['scaledBrainTargetsV100','drawBrainGuideV100','brainZoom','target:\'brain\'']:
            self.assertIn(token,s)

    def test_home_brain_overlays_use_translucent_liquid_glass(self):
        css=self.read(CSS)
        for token in ['.brain-glass-overlay','.brain-zoom-controls','backdrop-filter','rgba(18,18,20,.42)']:
            self.assertIn(token,css)

    def test_v11_handoff_assets_exist(self):
        for rel in ['continuity/ABRAXAS_V1_1_HANDOFF_PROMPT.txt','prompts/ABRAXAS_VISUAL_DIRECTION_PROMPT_v1.0.txt','json/ABRAXAS_VISUAL_MOTION_SYSTEM_v1.0.json','continuity/ABRAXAS_NEXT_VERSION_BRIEF.md']:
            self.assertTrue((ROOT/rel).exists(),rel)

if __name__=='__main__': unittest.main(verbosity=2)

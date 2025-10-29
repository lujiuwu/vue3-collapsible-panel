import { computed, defineComponent, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import './style.css'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'

export const Demo = defineComponent({
  props: {
    /** 动画持续时间 单位 -- ms */
    lasting_time: {
      type: String,
      default: '300'
    },
    /** 折叠面板状态：false 折叠，true 展开 */
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup(props: any, { slots, emit }) {
    const status = ref<boolean>(props.modelValue);
    const panelRef = ref<HTMLElement | null>(null);
    const contentRef = ref<HTMLElement | null>(null);

    const iconPath = computed(() => props.modelValue ? mdiChevronUp : mdiChevronDown);
    let resizeObserver: ResizeObserver | null = null;
    let rafId: number | null = null;
    let lastMeasuredHeight = 0;

    const resolveDuration = (): string | undefined => {
      const raw = props.lasting_time;
      if (raw == null || raw === '') return undefined;
      const v = String(raw);
      if (v.endsWith('ms') || v.endsWith('s')) return v;
      return `${v}ms`;
    };

    const updatePanelCssVars = () => {
      const panel = panelRef.value;
      const content = contentRef.value;
      if (!panel || !content) return;
      // 使用内容容器的 scrollHeight 作为展开时的目标高度
      const targetHeight = content.scrollHeight;
      if (targetHeight === lastMeasuredHeight) return;
      lastMeasuredHeight = targetHeight;
      panel.style.setProperty('--panel-height', `${targetHeight}px`);
      const dur = resolveDuration();
      if (dur) {
        panel.style.setProperty('--lasting', dur);
      } else {
        panel.style.removeProperty('--lasting');
      }
    };

    const scheduleUpdate = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updatePanelCssVars();
      });
    };

    const toggle = () => {
      status.value = !status.value;
      emit('update:modelValue', status.value);
      // 切换时更新一次，避免初次展开高度为 0 的闪烁
      nextTick(() => {
        updatePanelCssVars();
      });
    };

    onMounted(() => {
      updatePanelCssVars();
    });

    onBeforeUnmount(() => {
      if (resizeObserver && contentRef.value) {
        resizeObserver.unobserve(contentRef.value);
      }
      if (rafId != null) cancelAnimationFrame(rafId);
      resizeObserver = null;
    });

    // 父 -> 子 同步：外部 v-model 变化时更新内部状态
    watch(() => props.modelValue, (val: boolean) => {
      if (val !== status.value) status.value = val;
    });

    // 仅在展开状态下绑定监听，折叠时解绑，减少无效计算
    watch(status, async (val) => {
      await nextTick();
      const observed = contentRef.value;
      if (!observed) return;
      if (!resizeObserver) {
        resizeObserver = new ResizeObserver(() => {
          scheduleUpdate();
        });
      }
      if (val === true) {
        // 展开：先测一次，再开始观察
        updatePanelCssVars();
        resizeObserver.observe(observed);
      } else {
        // 折叠：停止观察，避免无用回调
        try { resizeObserver.unobserve(observed); } catch {}
      }
    }, { immediate: true });

    return () => (
      <div class="collapsible-panel-area w-full flex-auto flex-col items-center justify-center">
        <div class="collapsible-panel-area__default-area">
          <div class="default-area-slot">
            {slots.default?.()}
          </div>
          <div class="default-area-action-btn">
            {
              slots.action ? slots.action({ toggle, status: status.value }) : (
                <button class="public-button-style" onClick={toggle}>
                  <SvgIcon type="mdi" path={iconPath.value} />
                </button>
              )
            }
          </div>
        </div>
        <div
          class={`${status.value ? 'expand-area' : 'collapse-area'} panel-area`}
          ref={panelRef}
        >
          <div ref={contentRef}>
            {slots.collapse?.()}
          </div>
        </div>
      </div>
    );
  },
});
// =============================================================================
// REACT COMPOSITIONAL PATTERNS REFERENCE
// =============================================================================
// This file demonstrates various React composition patterns for the
// library features configuration use case

import React from 'react';
import { useConfig } from '@astock/core-react-context/config';
import { useFeatureFlags } from '@astock/react-feature-flags';
import {
  isEditHoverButtonInTimelineEnabledFF,
  isTimelineSingleAssetEditorEnabledFF,
} from '@astock/stock-feature-flags';
import {
  TEMPLATE_TYPE_AE_PROJ,
  TEMPLATE_TYPE_PPRO_PROJ,
} from '@astock/stock-graphql-search/constants';

// =============================================================================
// 1. CONTAINMENT PATTERN (Children Prop)
// =============================================================================

/**
 * Basic containment - component doesn't know its children ahead of time
 */
const QuickActionsWrapper = ({ children }) => (
  <div className="quick-actions-wrapper">
    {children}
  </div>
);

// Usage:
const Example1_Containment = ({ item }) => {
  const config = useConfig();
  const disableLibraryFeatures = config?.disableLibraryFeatures ?? false;

  return (
    <QuickActionsWrapper>
      {!disableLibraryFeatures && <SaveToLibraryButton item={item} />}
      <EditButton item={item} />
    </QuickActionsWrapper>
  );
};

// =============================================================================
// 2. SPECIALIZATION PATTERN
// =============================================================================

/**
 * Generic QuickActions component
 */
const QuickActions = ({ showSave, showEdit, item }) => (
  <div className="quick-actions">
    {showSave && <SaveToLibraryButton item={item} />}
    {showEdit && <EditButton item={item} />}
  </div>
);

/**
 * Specialized version for embed context
 */
const EmbedQuickActions = ({ item }) => {
  const config = useConfig();
  const disableLibraryFeatures = config?.disableLibraryFeatures ?? false;

  return (
    <QuickActions
      showSave={!disableLibraryFeatures}
      showEdit
      item={item}
    />
  );
};

/**
 * Specialized version for regular context
 */
const StandardQuickActions = ({ item }) => (
  <QuickActions
    showSave
    showEdit
    item={item}
  />
);

// =============================================================================
// 3. HIGHER-ORDER COMPONENT (HOC) PATTERN
// =============================================================================

/**
 * HOC that adds library feature configuration logic
 */
const withLibraryFeatureConfig = Component => function WrappedComponent(props) {
  const config = useConfig();
  const disableLibraryFeatures = config?.disableLibraryFeatures ?? false;

  return (
    <Component
      {...props}
      disableLibraryFeatures={disableLibraryFeatures}
    />
  );
};

/**
 * Pure component that receives config as props
 */
const PureQuickActions = ({ item, disableLibraryFeatures }) => (
  <div className="quick-actions">
    {!disableLibraryFeatures && <SaveToLibraryButton item={item} />}
    <EditButton item={item} />
  </div>
);

// Enhanced component with configuration
const EnhancedQuickActions = withLibraryFeatureConfig(PureQuickActions);

// =============================================================================
// 4. RENDER PROPS PATTERN
// =============================================================================

/**
 * Component that provides configuration via render prop
 */
const LibraryFeatureProvider = ({ children }) => {
  const config = useConfig();
  const disableLibraryFeatures = config?.disableLibraryFeatures ?? false;

  return children({ disableLibraryFeatures });
};

// Usage:
const Example4_RenderProps = ({ item }) => (
  <LibraryFeatureProvider>
    {({ disableLibraryFeatures }) => (
      <div className="quick-actions">
        {!disableLibraryFeatures && <SaveToLibraryButton item={item} />}
        <EditButton item={item} />
      </div>
    )}
  </LibraryFeatureProvider>
);

// =============================================================================
// 5. COMPONENT INJECTION PATTERN
// =============================================================================

/**
 * Component that accepts other components as props
 */
const QuickActionsContainer = ({
  SaveComponent = null,
  EditComponent = null,
  item,
}) => (
  <div className="quick-actions">
    {SaveComponent && <SaveComponent item={item} />}
    {EditComponent && <EditComponent item={item} />}
  </div>
);

// Usage:
const Example5_ComponentInjection = ({ item }) => {
  const config = useConfig();
  const disableLibraryFeatures = config?.disableLibraryFeatures ?? false;

  return (
    <QuickActionsContainer
      SaveComponent={!disableLibraryFeatures ? SaveToLibraryButton : null}
      EditComponent={EditButton}
      item={item}
    />
  );
};

// =============================================================================
// 6. COMPOUND COMPONENTS PATTERN
// =============================================================================

/**
 * Parent component that manages shared state
 */
const QuickActionsManager = ({ children, item }) => {
  const config = useConfig();
  const disableLibraryFeatures = config?.disableLibraryFeatures ?? false;

  return (
    <div className="quick-actions">
      {React.Children.map(children, child => (React.isValidElement(child)
        ? React.cloneElement(child, {
          item,
          disableLibraryFeatures,
        })
        : child))}
    </div>
  );
};

/**
 * Child components that work with the parent
 */
const QuickActionsManager_Save = ({ item, disableLibraryFeatures }) => {
  if (disableLibraryFeatures) return null;
  return <SaveToLibraryButton item={item} />;
};

const QuickActionsManager_Edit = ({ item }) => <EditButton item={item} />;

// Usage:
const Example6_CompoundComponents = ({ item }) => (
  <QuickActionsManager item={item}>
    <QuickActionsManager_Save />
    <QuickActionsManager_Edit />
  </QuickActionsManager>
);

// =============================================================================
// 7. CONDITIONAL WRAPPER COMPONENTS
// =============================================================================

/**
 * Wrapper that conditionally renders children
 */
const IfLibraryFeaturesEnabled = ({ children, fallback = null }) => {
  const config = useConfig();
  const disableLibraryFeatures = config?.disableLibraryFeatures ?? false;

  return disableLibraryFeatures ? fallback : children;
};

/**
 * More specific conditional wrapper
 */
const IfSaveAllowed = ({ item, children }) => {
  const { templateTypeId } = item;
  const isProjectFile = [TEMPLATE_TYPE_AE_PROJ, TEMPLATE_TYPE_PPRO_PROJ].includes(templateTypeId);

  return isProjectFile ? null : children;
};

// Usage:
const Example7_ConditionalWrappers = ({ item }) => (
  <div className="quick-actions">
    <IfLibraryFeaturesEnabled>
      <IfSaveAllowed item={item}>
        <SaveToLibraryButton item={item} />
      </IfSaveAllowed>
    </IfLibraryFeaturesEnabled>
    <EditButton item={item} />
  </div>
);

// =============================================================================
// 8. FACTORY PATTERN
// =============================================================================

/**
 * Factory function that creates configured components
 */
const createQuickActionsComponent = config => function QuickActionsComponent({ item }) {
  const { disableLibraryFeatures = false } = config;
  const { templateTypeId } = item;
  const showSave = !disableLibraryFeatures
      && ![TEMPLATE_TYPE_AE_PROJ, TEMPLATE_TYPE_PPRO_PROJ].includes(templateTypeId);

  return (
    <div className="quick-actions">
      {showSave && <SaveToLibraryButton item={item} />}
      <EditButton item={item} />
    </div>
  );
};

// Usage:
const Example8_Factory = ({ item }) => {
  const config = useConfig();
  const QuickActions = createQuickActionsComponent(config);

  return <QuickActions item={item} />;
};

// =============================================================================
// 9. SLOT PATTERN (Named Children)
// =============================================================================

/**
 * Component that expects specific named children
 */
const QuickActionsSlots = ({ saveSlot, editSlot, moreSlot }) => (
  <div className="quick-actions">
    <div className="save-slot">{saveSlot}</div>
    <div className="edit-slot">{editSlot}</div>
    <div className="more-slot">{moreSlot}</div>
  </div>
);

// Usage:
const Example9_Slots = ({ item }) => {
  const config = useConfig();
  const disableLibraryFeatures = config?.disableLibraryFeatures ?? false;

  return (
    <QuickActionsSlots
      saveSlot={!disableLibraryFeatures ? <SaveToLibraryButton item={item} /> : null}
      editSlot={<EditButton item={item} />}
      moreSlot={<MoreOptionsButton item={item} />}
    />
  );
};

// =============================================================================
// 10. CONTEXT-AWARE COMPOSITION
// =============================================================================

/**
 * Context for library feature configuration
 */
const LibraryFeatureContext = React.createContext();

/**
 * Provider component
 */
const LibraryFeatureContextProvider = ({ children }) => {
  const config = useConfig();
  const disableLibraryFeatures = config?.disableLibraryFeatures ?? false;

  return (
    <LibraryFeatureContext.Provider value={{ disableLibraryFeatures }}>
      {children}
    </LibraryFeatureContext.Provider>
  );
};

/**
 * Hook to use the context
 */
const useLibraryFeatureContext = () => {
  const context = React.useContext(LibraryFeatureContext);
  if (!context) {
    throw new Error('useLibraryFeatureContext must be used within LibraryFeatureContextProvider');
  }
  return context;
};

/**
 * Pure component that uses context
 */
const ContextAwareQuickActions = ({ item }) => {
  const { disableLibraryFeatures } = useLibraryFeatureContext();

  return (
    <div className="quick-actions">
      {!disableLibraryFeatures && <SaveToLibraryButton item={item} />}
      <EditButton item={item} />
    </div>
  );
};

// =============================================================================
// CURRENT IMPLEMENTATION (for comparison)
// =============================================================================

/**
 * Our current context-based approach
 */
const CurrentQuickActionsMenu = ({ item, editHoverButton: SingleAssetEditHoverButton = null }) => {
  const config = useConfig();
  const disableLibraryFeatures = config?.disableLibraryFeatures ?? false;

  const {
    [isEditHoverButtonInTimelineEnabledFF.id]: {
      value: isEditHoverButtonInTimelineEnabled = false,
    } = {},
    [isTimelineSingleAssetEditorEnabledFF.id]: {
      value: isTimelineSingleAssetEditorEnabled = false,
    } = {},
  } = useFeatureFlags();

  const { templateTypeId } = item;
  const showSaveToLibraryButton = !disableLibraryFeatures
    && ![TEMPLATE_TYPE_AE_PROJ, TEMPLATE_TYPE_PPRO_PROJ].includes(templateTypeId);

  const getActionButtons = () => {
    const buttons = [];

    if (showSaveToLibraryButton) {
      buttons.push(<SaveToLibraryButton key="save-to-library" item={item} />);
    }

    if (isTimelineSingleAssetEditorEnabled && SingleAssetEditHoverButton) {
      buttons.push(<SingleAssetEditHoverButton key="single-asset-edit" item={item} />);
    } else if (!isTimelineSingleAssetEditorEnabled && isEditHoverButtonInTimelineEnabled) {
      // Edit button logic...
      buttons.push(<EditHoverButton key="edit-hover" asset={transformedAsset} />);
    }

    return buttons;
  };

  const actionButtons = getActionButtons();

  if (!actionButtons.length) {
    return null;
  }

  return (
    <div className="quick-actions-wrapper">
      {actionButtons}
    </div>
  );
};

// =============================================================================
// COMPARISON TABLE
// =============================================================================

/*
PATTERN COMPARISON:

| Pattern                | Pros                           | Cons                          | Use Case                    |
|------------------------|--------------------------------|-------------------------------|-----------------------------|
| Containment           | ✅ Simple, flexible            | ❌ Logic in parent            | Basic wrapper components    |
| Specialization        | ✅ Reusable base component     | ❌ Can get complex           | Variants of same component  |
| HOC                   | ✅ Logic reuse                 | ❌ Wrapper hell              | Cross-cutting concerns      |
| Render Props          | ✅ Maximum flexibility         | ❌ Callback complexity       | Dynamic rendering logic     |
| Component Injection   | ✅ Highly configurable         | ❌ Many props               | Plugin-like architecture    |
| Compound Components   | ✅ Declarative API            | ❌ Complex implementation    | Related components          |
| Conditional Wrappers  | ✅ Clean conditions           | ❌ Nesting complexity       | Simple show/hide logic      |
| Factory Pattern       | ✅ Pre-configured components   | ❌ Less runtime flexibility  | Multiple configurations     |
| Slots                 | ✅ Named injection points     | ❌ Fixed structure          | Layout-based composition    |
| Context-Aware         | ✅ Global configuration       | ❌ Context dependency       | App-wide settings           |
| Current (Context)     | ✅ Encapsulated logic         | ❌ Context coupling         | Feature-specific config     |

RECOMMENDATION:
For our library features use case, the current Context approach is optimal because:
- Limited scope (embed-specific)
- Few components affected
- Clear ownership of configuration logic
- Team familiarity with pattern
- Easy maintenance
*/

export {
  // Pattern examples
  Example1_Containment,
  Example4_RenderProps,
  Example5_ComponentInjection,
  Example6_CompoundComponents,
  Example7_ConditionalWrappers,
  Example8_Factory,
  Example9_Slots,

  // Specialized components
  EmbedQuickActions,
  StandardQuickActions,
  EnhancedQuickActions,
  ContextAwareQuickActions,

  // Utility components
  LibraryFeatureProvider,
  LibraryFeatureContextProvider,
  IfLibraryFeaturesEnabled,
  IfSaveAllowed,

  // Current implementation
  CurrentQuickActionsMenu,

  // Hooks
  useLibraryFeatureContext,

  // Factories
  createQuickActionsComponent,
};

var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CheckFormsIssuesTrigger_instances, _CheckFormsIssuesTrigger_checkFormsIssues, _CheckFormsIssuesTrigger_pageLoaded;
import * as SDK from '../../core/sdk/sdk.js';
/**
 * Responsible for asking autofill for current form issues. This currently happens when devtools is first open.
 */
// TODO(crbug.com/1399414): Trigger check form issues when an element with an associated issue is editted in the issues panel.
let checkFormsIssuesTriggerInstance = null;
export class CheckFormsIssuesTrigger {
    constructor() {
        _CheckFormsIssuesTrigger_instances.add(this);
        SDK.TargetManager.TargetManager.instance().addModelListener(SDK.ResourceTreeModel.ResourceTreeModel, SDK.ResourceTreeModel.Events.Load, __classPrivateFieldGet(this, _CheckFormsIssuesTrigger_instances, "m", _CheckFormsIssuesTrigger_pageLoaded), this, { scoped: true });
        for (const model of SDK.TargetManager.TargetManager.instance().models(SDK.ResourceTreeModel.ResourceTreeModel)) {
            if (model.target().outermostTarget() !== model.target()) {
                continue;
            }
            __classPrivateFieldGet(this, _CheckFormsIssuesTrigger_instances, "m", _CheckFormsIssuesTrigger_checkFormsIssues).call(this, model);
        }
    }
    static instance({ forceNew } = { forceNew: false }) {
        if (!checkFormsIssuesTriggerInstance || forceNew) {
            checkFormsIssuesTriggerInstance = new CheckFormsIssuesTrigger();
        }
        return checkFormsIssuesTriggerInstance;
    }
}
_CheckFormsIssuesTrigger_instances = new WeakSet(), _CheckFormsIssuesTrigger_checkFormsIssues = function _CheckFormsIssuesTrigger_checkFormsIssues(resourceTreeModel) {
    void resourceTreeModel.target().auditsAgent().invoke_checkFormsIssues();
}, _CheckFormsIssuesTrigger_pageLoaded = function _CheckFormsIssuesTrigger_pageLoaded(event) {
    const { resourceTreeModel } = event.data;
    __classPrivateFieldGet(this, _CheckFormsIssuesTrigger_instances, "m", _CheckFormsIssuesTrigger_checkFormsIssues).call(this, resourceTreeModel);
};
//# sourceMappingURL=CheckFormsIssuesTrigger.js.map
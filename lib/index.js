'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React from 'react';
import { View, InteractionManager, StyleSheet, Button, Dimensions } from 'react-native';
import * as PropTypes from 'prop-types';
export const styles = StyleSheet.create({
    stageContainer: {
        top: 0,
        left: 0,
        bottom: 0,
        maxHeight: Dimensions.get('window').height - 50,
        right: 0
    },
    prevNextFlex: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    progressOutterFlex: {
        flex: 1,
        flexDirection: 'row',
        height: 3,
        marginBottom: 15
    },
    progressFlex: {
        flex: 0.7,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 2,
        alignItems: 'flex-start'
    },
    progressIndicator: {
        marginRight: 4,
        height: 2,
        borderRadius: 10,
        padding: 2,
    },
    progressPad: {
        flex: 0.3
    },
    progressView: {
        height: 3,
    },
    scrollview: {
        marginTop: 20
    },
    prevBtn: {
        marginRight: 3,
        flex: 0.15
    },
    prevNext: {
        bottom: 0,
        left: 0,
        right: 0,
        height: 40
    },
    scrollviewContainer: {
        paddingBottom: 20
    }
});
export class Stage extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.refresh = () => __awaiter(this, void 0, void 0, function* () {
            if (this.props.continue) {
                return this.context.fn.canContinue(this.props.continue());
            }
        });
        this.passProps = {
            instance: this,
            context: this.context.fn
        };
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.props.loaded) {
                this.props.loaded(() => {
                    InteractionManager.runAfterInteractions(() => {
                        this.refresh();
                    });
                });
            }
            yield this.context.fn.noPrevious(!!this.props.noPrevious);
            yield this.refresh();
        });
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }
    render() {
        const { children } = this.props;
        /*
              keyboardShouldPersistTaps={'handled'}
              contentContainerStyle={styles.scrollviewContainer}
        */
        return (React.createElement(View, null,
            React.createElement(View, { style: [styles.scrollviewContainer, { height: Dimensions.get('window').height }] }, children(this.passProps))));
    }
}
Stage.contextTypes = {
    fn: PropTypes.any
};
export class StageButtons extends React.Component {
    constructor() {
        super(...arguments);
        this.passProps = {
            context: this.context.fn
        };
    }
    render() {
        return this.props.children(this.passProps);
    }
}
StageButtons.contextTypes = {
    fn: PropTypes.any
};
export class StageProgress extends React.Component {
    constructor() {
        super(...arguments);
        this.passProps = {
            context: this.context.fn
        };
    }
    render() {
        return this.props.children(this.passProps);
    }
}
StageProgress.contextTypes = {
    fn: PropTypes.any
};
export class Stager extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.next = () => __awaiter(this, void 0, void 0, function* () {
            const next = this.nextStage();
            if (next) {
                return this.setStage(next, 1);
            }
        });
        this.prev = () => __awaiter(this, void 0, void 0, function* () {
            const prev = this.prevStage();
            if (prev) {
                return this.setStage(prev, -1);
            }
        });
        this.setStage = (stage, direction) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.setState({
                    currentStage: stage,
                    stageState: {
                        noPrevious: false,
                        canContinue: null
                    },
                    stage: this.getStage(stage)
                }, () => {
                    if (this.props.onChange && this.state.currentStage) {
                        this.props.onChange(this.state.currentStage, direction || 0);
                    }
                    resolve();
                });
            });
        });
        this.reset = () => {
            return this.setStage(this.state.stages[0], 0);
        };
        this.canContinue = (state) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.setState({
                    stageState: Object.assign({}, this.state.stageState, { canContinue: state })
                }, resolve);
            });
        });
        this.noPrevious = (state) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.setState({
                    stageState: Object.assign({}, this.state.stageState, { noPrevious: state })
                }, resolve);
            });
        });
        this.notify = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.setState({
                    time: Date.now()
                }, resolve);
            });
        });
        this.has = (type) => {
            if (this.state.currentStage) {
                if (type === 'next') {
                    return this.state.stages.indexOf(this.state.currentStage) + 1 < this.state.stages.length;
                }
                else if (type === 'prev') {
                    return this.state.stages.indexOf(this.state.currentStage) - 1 >= 0;
                }
            }
            return false;
        };
        this.getStage = (stage) => {
            return React.Children.map(this.props.children, (child) => {
                return child['key'] === stage ? child : null;
            }).filter((s) => s);
        };
        this.nextStage = () => {
            if (this.state.currentStage) {
                return this.state.stages[this.state.stages.indexOf(this.state.currentStage) + 1 % this.state.stages.length];
            }
            return null;
        };
        this.currentStage = () => {
            return this.state.currentStage;
        };
        this.prevStage = () => {
            if (this.state.currentStage) {
                return this.state.stages[this.state.stages.indexOf(this.state.currentStage) - 1 % this.state.stages.length];
            }
            return null;
        };
        this.gatherButtonsAndProgress = (cb) => {
            let hasButtons = null;
            let hasProgress = null;
            React.Children.forEach(this.props.children, (child) => {
                const childType = child['type'];
                if (childType === StageProgress) {
                    hasProgress = child;
                }
                else if (childType === StageButtons) {
                    hasButtons = child;
                }
            });
            this.setState({
                hasButtons,
                hasProgress
            }, cb);
        };
        this.gatherStages = (cb) => {
            const stagesNames = [];
            React.Children.forEach(this.props.children, (child) => {
                const childType = child['type'];
                if (childType === Stage) {
                    stagesNames.push(child['key']);
                }
            });
            if (!stagesNames.length) {
                throw new Error('No Stage');
            }
            this.setState({
                stages: stagesNames,
            }, cb);
        };
        this.progress = () => {
            return (React.createElement(View, { key: "progress", style: styles.progressView },
                React.createElement(View, { style: styles.progressOutterFlex },
                    React.createElement(View, { style: styles.progressFlex }, this.state.stages.map((stage, index) => {
                        return (React.createElement(View, { key: index, style: [
                                styles.progressIndicator,
                                {
                                    flex: (1 / this.state.stages.length) / 2,
                                },
                                {
                                    backgroundColor: this.state.currentStage && this.state.stages.indexOf(stage) <= this.state.stages.indexOf(this.state.currentStage) ? 'blue' : 'gray'
                                }
                            ] }));
                    })),
                    React.createElement(View, { style: styles.progressPad }))));
        };
        this.buttons = () => {
            return (React.createElement(View, { key: "prevNext", style: styles.prevNext },
                React.createElement(View, { key: "prevNextButtons", style: styles.prevNextFlex },
                    !this.state.stageState.noPrevious && this.has('prev') ? (React.createElement(View, { key: "prevButton", style: styles.prevBtn },
                        React.createElement(Button, { onPress: this.prev, title: "Prev" }))) : null,
                    this.state.stageState.canContinue != null ? (React.createElement(View, { key: "nextButton", style: { flex: !this.has('prev') ? 1 : 0.85 } },
                        React.createElement(Button, { disabled: !this.state.stageState.canContinue, onPress: this.next, title: "Next" }))) : null)));
        };
        this.state = {
            currentStage: null,
            stages: [],
            stage: null,
            hasButtons: null,
            hasProgress: null,
            stageState: {
                noPrevious: false,
                canContinue: null
            },
            time: Date.now()
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.stages !== nextState.stages ||
            this.state.stage !== nextState.stage ||
            this.state.hasButtons !== nextState.hasButtons ||
            this.state.hasProgress !== nextState.hasProgress ||
            this.state.time !== nextState.time ||
            this.state.stageState.canContinue !== nextState.stageState.canContinue ||
            this.state.stageState.noPrevious !== nextState.stageState.noPrevious ||
            this.props.onChange !== nextProps.onChange ||
            this.state.currentStage !== nextState.currentStage;
    }
    getChildContext() {
        return {
            fn: this
        };
    }
    componentDidMount() {
        this.gatherStages(() => {
            this.setStage(this.state.stages[0], 0).then(() => {
                this.gatherButtonsAndProgress();
            });
        });
    }
    render() {
        return (React.createElement(View, { style: styles.stageContainer },
            this.state.hasProgress ? this.state.hasProgress : this.progress(),
            this.state.time && this.state.stage,
            this.state.hasButtons ? this.state.hasButtons : this.buttons()));
    }
}
Stager.childContextTypes = {
    fn: PropTypes.any
};
export default Stager;
//# sourceMappingURL=index.js.map
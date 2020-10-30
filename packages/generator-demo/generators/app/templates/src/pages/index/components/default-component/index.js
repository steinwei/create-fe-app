'use strict';

import React from 'react';
import './index.less';

export default class DefaultComponent extends React.Component {

    render() {
        return (
            <div className="default-component">
                <p>欢迎使用由cli-demo提供的Starkit.</p>
                <p>cli-demo官网：<a href="http://cli-demojs.org/">http://cli-demojs.org/</a></p>
            </div>
        );
    }
}

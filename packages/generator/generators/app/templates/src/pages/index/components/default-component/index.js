'use strict';

import React from 'react';
import './index.less';

export default class DefaultComponent extends React.Component {

    render() {
        return (
            <div className="default-component">
                <p>欢迎使用由create-fe-app提供的Starkit.</p>
                <p>create-fe-app官网：<a href="http://create-fe-appjs.org/">http://create-fe-appjs.org/</a></p>
            </div>
        );
    }
}

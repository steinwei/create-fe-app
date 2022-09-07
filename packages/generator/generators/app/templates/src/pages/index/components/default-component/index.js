'use strict';

import React from 'react';
import './index.less';

export default class DefaultComponent extends React.Component {

    render() {
        return (
            <div className="default-component">
                <p>欢迎使用由fe-cli提供的Starkit.</p>
                <p>fe-cli官网：<a href="http://fe-clijs.org/">http://fe-clijs.org/</a></p>
            </div>
        );
    }
}



import {VueClass, VueRequireFilter, VueVar} from "../lib/numbersLab/VueAnnotate";
import {DependencyInjectorInstance} from "../lib/numbersLab/DependencyInjector";
import {Wallet} from "../model/Wallet";
import {DestructableView} from "../lib/numbersLab/DestructableView";
import {Constants} from "../model/Constants";
import {VueFilterDate, VueFilterPiconero} from "../filters/Filters";
import {AppState} from "../model/AppState";

AppState.disconnect();

window.location.href = '#index';
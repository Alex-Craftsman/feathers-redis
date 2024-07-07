import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import 'dayjs/locale/en'; // import locale

dayjs.extend(duration);

dayjs.locale('en'); // use locale

export default dayjs;

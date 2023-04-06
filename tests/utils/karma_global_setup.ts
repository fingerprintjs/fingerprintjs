/** This file must be included in karma.conf.ts */
import { retryFailedTests } from '@fpjs-incubator/broyster/browser'

retryFailedTests(3, 100)
